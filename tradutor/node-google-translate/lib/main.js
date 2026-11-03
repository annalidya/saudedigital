var querystring     = require('querystring'),
    https           = require('https');

// Dependencias usadas apenas no modo oficial (com API key).
// Sao carregadas de forma opcional para permitir o modo gratuito sem instala-las.
var _               = null,
    request         = null,
    async           = null,
    entities        = null;

try { _ = require('underscore'); } catch (e) {}
try { request = require('request'); } catch (e) {}
try { async = require('async'); } catch (e) {}
try { entities = require('ent'); } catch (e) {}

// Globals
var apiBase = 'https://www.googleapis.com/language/translate/v2/',
    freeApiBase = 'https://translate.googleapis.com/translate_a/single',
    freeMaxQueryLen = 1600,
    maxGetQueryLen = 1600, // Limit is actually 2000, but let's just be safe
    concurrentLimit = 10; // Max num concurrent requests. Can be overridden by passing a new limit when requiring module

////
//  SEND REQUEST
////

// Closure that returns a function for making a 
// GET request to Google with an apiKey
var getRequestWithApi = function(apiKey) {
  return function(path, data, cb) {
    var url = apiBase + path + '?' + querystring.stringify(_.extend({ 'key': apiKey }, data));
    request.get(url, globalResponseHandler(cb)); 
  };
};

////
//   RESPONSE HANDLERS
////

var globalResponseHandler = function(cb) {
  return function(err, res, body) {
    if (!cb || !_.isFunction(cb)) return;

    // Catch connection errors
    if (err || !res) {
      var returnErr = 'Error connecting to Google';
      if (err) returnErr += ': ' + err.code;
      err = returnErr;
    } else if (res.statusCode !== 200) {
      err = 'Something went wrong. Google responded with a ' + res.statusCode;
    }
    if (err) return cb(err, null);

    // Try to parse response
    try {
      body = JSON.parse(body);
    } catch(e) {
      err = 'Could not parse response from Google: ' + body;
      return cb(err, null);
    }

    // Return response
    cb(null, body);
  };
};

var parseTranslations = function(originalStrings, done) {
  return function(err, data) {
    if (err) return done(err, null);
    
    // Remove nesting
    data = data.data;
    data = data.translations ? data.translations : data;

    // Add originalText to response
    originalStrings.forEach(function(s, i){ 
      if (data[i]) _.extend(data[i], { originalText: s });
    });

    // Decode html entities
    data = data.map(function(translation){
      translation.translatedText = entities.decode(translation.translatedText);
      return translation;
    });

    // Return nested languages array
    done(null, data);
  };
};

var parseSupportedLanguages = function(cb) {
  return function(err, languages) {
    if (err) return cb(err, null);
    languages = languages.data.languages;;
    if (languages[0] && !languages[0].name) languages = _.pluck(languages, 'language');
    cb(null, languages);
  }
};

var parseLanguageDetections = function(originalStrings, done) {
  return function(err, data) {
    if (err) return done(err, null);

    // Remove nesting and parse
    data = data.data && data.data.detections ? data.data.detections : data;
    if (data.length > 1) {
      data = data.map(function(d){ return d[0]; });
    } else {
      data = data[0];
    }

    // Add originalText to response
    originalStrings.forEach(function(s, i){ 
      if (data[i]) _.extend(data[i], { originalText: s });
    });

    done(null, data);
  };
};

////
//  HELPERS
////

// Return array of arrays that are short enough for Google to handle
var splitArraysForGoogle = function(arr, result) {
  if (encodeURIComponent(arr.join(',')).length > maxGetQueryLen && arr.length !== 1) {
    var mid = Math.floor(arr.length / 2);
    splitArraysForGoogle(arr.slice(0,mid), result);
    splitArraysForGoogle(arr.slice(mid, arr.length), result);
  } else {
    result.push(arr)
  }
};

////
//   MODO GRATUITO (sem API key)
////

// Executa fn em no maximo `limit` itens por vez, preservando a ordem do resultado.
var mapLimit = function(items, limit, fn) {
  return new Promise(function(resolve, reject) {
    var resultados = new Array(items.length),
        proximo = 0,
        ativos = 0,
        falhou = false;

    if (items.length === 0) return resolve(resultados);

    var disparar = function() {
      if (falhou) return;
      if (proximo >= items.length && ativos === 0) return resolve(resultados);

      while (ativos < limit && proximo < items.length) {
        (function(indice) {
          ativos++;
          Promise.resolve()
            .then(function() { return fn(items[indice], indice); })
            .then(function(resultado) {
              resultados[indice] = resultado;
              ativos--;
              disparar();
            })
            .catch(function(err) {
              falhou = true;
              reject(err);
            });
        })(proximo++);
      }
    };

    disparar();
  });
};

// GET JSON usando o modulo https nativo (evita bloqueios que o fetch do Node sofre).
var requisitarJson = function(url, tentativa) {
  tentativa = tentativa || 0;

  return new Promise(function(resolve, reject) {
    var req = https.get(url, {
      headers: {
        'User-Agent': 'curl/8.5.0',
        'Accept': '*/*'
      }
    }, function(res) {
      var dados = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) { dados += chunk; });
      res.on('end', function() {
        // Limite de requisicoes: aguarda um pouco e tenta novamente.
        if ((res.statusCode === 429 || res.statusCode >= 500) && tentativa < 4) {
          return setTimeout(function() {
            requisitarJson(url, tentativa + 1).then(resolve, reject);
          }, 1200 * (tentativa + 1));
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error('Google respondeu com status ' + res.statusCode));
        }
        try {
          resolve(JSON.parse(dados));
        } catch (e) {
          reject(new Error('Nao foi possivel interpretar a resposta do Google'));
        }
      });
    });

    req.on('error', function(err) {
      reject(new Error('Erro ao conectar no Google: ' + (err.code || err.message)));
    });

    req.setTimeout(15000, function() {
      req.destroy(new Error('Tempo esgotado ao conectar no Google'));
    });
  });
};

// Traduz um unico texto usando o endpoint publico do Google Tradutor.
var traduzirGratuito = function(texto, sourceLang, targetLang) {
  var params = new URLSearchParams();
  params.set('client', 'gtx');
  params.set('sl', sourceLang || 'auto');
  params.set('tl', targetLang);
  params.set('dt', 't');
  params.set('q', texto);

  return requisitarJson(freeApiBase + '?' + params.toString())
    .then(function(data) {
      var partes = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : [];
      var traduzido = partes.map(function(parte) {
        return parte && parte[0] ? parte[0] : '';
      }).join('');

      if (!traduzido) throw new Error('Resposta de traducao vazia');
      return traduzido;
    });
};

var criarApiGratuita = function(newConcurrentLimit) {
  var limite = newConcurrentLimit || 5;

  var api = {};

  api.translate = function(strings, sourceLang, targetLang, cb) {
    if (typeof strings !== 'string' && !Array.isArray(strings)) {
      return cb('Input source must be a string or array of strings');
    }
    if (typeof sourceLang !== 'string') {
      return cb('No target language specified. Must be a string');
    }

    // Torna sourceLang opcional
    if (!cb) {
      cb = targetLang;
      targetLang = sourceLang;
      sourceLang = null;
    }
    if (typeof cb !== 'function') return console.log('No callback defined');

    var ehArray = Array.isArray(strings);
    var lista = ehArray ? strings.slice() : [strings];

    for (var i = 0; i < lista.length; i++) {
      if (typeof lista[i] !== 'string') return cb('Todos os textos devem ser strings');
    }

    // Agrupa textos simples separados por quebra de linha para reduzir requisicoes.
    var tarefas = [],
        lote = [],
        indicesLote = [],
        tamanhoLote = 0;

    lista.forEach(function(texto, indice) {
      var tamanho = encodeURIComponent(texto).length + 1;

      if (texto.indexOf('\n') !== -1 || tamanho > freeMaxQueryLen) {
        tarefas.push({ individual: true, indice: indice, texto: texto });
        return;
      }

      if (tamanhoLote + tamanho > freeMaxQueryLen && lote.length > 0) {
        tarefas.push({ individual: false, indices: indicesLote, textos: lote });
        lote = [];
        indicesLote = [];
        tamanhoLote = 0;
      }

      lote.push(texto);
      indicesLote.push(indice);
      tamanhoLote += tamanho;
    });

    if (lote.length > 0) {
      tarefas.push({ individual: false, indices: indicesLote, textos: lote });
    }

    var resultados = new Array(lista.length);

    mapLimit(tarefas, limite, function(tarefa) {
      if (tarefa.individual) {
        return traduzirGratuito(tarefa.texto, sourceLang, targetLang).then(function(traduzido) {
          resultados[tarefa.indice] = traduzido;
        });
      }

      return traduzirGratuito(tarefa.textos.join('\n'), sourceLang, targetLang).then(function(traduzido) {
        var partes = traduzido.split('\n');

        // Se a quebra de linha nao foi preservada, traduz cada item separadamente.
        if (partes.length !== tarefa.textos.length) {
          return mapLimit(tarefa.textos, limite, function(texto) {
            return traduzirGratuito(texto, sourceLang, targetLang);
          }).then(function(traducoes) {
            traducoes.forEach(function(t, i) {
              resultados[tarefa.indices[i]] = t;
            });
          });
        }

        partes.forEach(function(parte, i) {
          resultados[tarefa.indices[i]] = parte;
        });
      });
    }).then(function() {
      if (!ehArray) {
        return cb(null, { translatedText: resultados[0], originalText: lista[0] });
      }

      cb(null, resultados.map(function(traduzido, i) {
        return { translatedText: traduzido, originalText: lista[i] };
      }));
    }).catch(function(err) {
      cb(err && err.message ? err.message : String(err));
    });
  };

  api.detectLanguage = function(strings, cb) {
    if (!cb) return console.log('No callback defined');
    if (typeof strings !== 'string' && !Array.isArray(strings)) {
      return cb('Input source must be a string or array of strings');
    }

    var ehArray = Array.isArray(strings);
    var lista = ehArray ? strings.slice() : [strings];

    mapLimit(lista, limite, function(texto) {
      var params = new URLSearchParams();
      params.set('client', 'gtx');
      params.set('sl', 'auto');
      params.set('tl', 'en');
      params.set('dt', 't');
      params.set('q', texto);

      return requisitarJson(freeApiBase + '?' + params.toString())
        .then(function(data) {
          return {
            language: data && data[2] ? data[2] : null,
            isReliable: data && typeof data[6] === 'boolean' ? data[6] : null,
            confidence: data && typeof data[6] === 'number' ? data[6] : null,
            originalText: texto
          };
        });
    }).then(function(deteccoes) {
      cb(null, ehArray ? deteccoes : deteccoes[0]);
    }).catch(function(err) {
      cb(err && err.message ? err.message : String(err));
    });
  };

  api.getSupportedLanguages = function(target, cb) {
    if (typeof target === 'function') {
      cb = target;
      target = null;
    }
    if (typeof cb !== 'function') return console.log('No callback defined');

    var params = new URLSearchParams();
    params.set('client', 'gtx');
    params.set('alpha', 'true');
    if (target) params.set('hl', target);

    requisitarJson('https://translate.googleapis.com/translate_a/l?' + params.toString())
      .then(function(data) {
        var idiomas = data && data.tl ? data.tl : {};
        if (target) {
          cb(null, Object.keys(idiomas).map(function(codigo) {
            return { language: codigo, name: idiomas[codigo] };
          }));
        } else {
          cb(null, Object.keys(idiomas));
        }
      })
      .catch(function(err) {
        cb(err && err.message ? err.message : String(err));
      });
  };

  return {
    translate: api.translate,
    getSupportedLanguages: api.getSupportedLanguages,
    detectLanguage: api.detectLanguage
  };
};

////
//   PUBLIC API
////

module.exports = function(apiKey, newConcurrentLimit) {

  // Sem API key utiliza o endpoint publico (modo gratuito)
  if (!apiKey) return criarApiGratuita(newConcurrentLimit);

  // Set new concurrent limit for async calls if specified
  concurrentLimit = newConcurrentLimit || concurrentLimit;

  var get = getRequestWithApi(apiKey),
      api = {};


  // TRANSLATE

  api.translate = function(strings, sourceLang, targetLang, cb) {
    if (typeof strings !== 'string' && !Array.isArray(strings)) return cb('Input source must be a string or array of strings');
    if (typeof sourceLang !== 'string') return cb('No target language specified. Must be a string');

    // Make sourceLang optional
    if (!cb) {
      cb = targetLang;
      targetLang = sourceLang;
      sourceLang = null;
    }
    if (!_.isFunction(cb)) return console.log('No callback defined');

    // Split into multiple calls if string array is longer than allowed by Google (2k limit for GET, 5k for POST)
    var queries;    
    if (Array.isArray(strings) && encodeURIComponent(strings.join(',')).length > maxGetQueryLen && strings.length !== 1) {
      var stringSets = [];
      splitArraysForGoogle(strings, stringSets);
    } else if (!Array.isArray(strings)) {
      stringSets = [[strings]];
    } else {
      stringSets = [strings];
    }

    // Request options
    var data = { target: targetLang };
    if (sourceLang) data.source = sourceLang;

    // Run queries async
    // TODO Make POST requests when query is greater than 2k. More efficient -- limit for POST is 5k, compared to 2k for GET    
    async.mapLimit(stringSets, concurrentLimit, function(stringSet, done) {

      get('', _.extend({ q: stringSet }, data), parseTranslations(stringSet, done));

    }, function(err, translations) {
      if (err) return cb(err);

      // Merge and return translation
      translations = _.flatten(translations);
      if (translations.length === 1) translations = translations[0];
      cb(null, translations);
    });

  };


  // GET SUPPORTED LANGUAGES

  api.getSupportedLanguages = function(target, cb) {
    // Data param is optional
    if (_.isFunction(target)) {
      cb = target;
      target = {};
    } else {
      target = { target: target };
    }
    if (!_.isFunction(cb)) return console.log('No callback defined');

    get('languages', target, parseSupportedLanguages(cb));
  };


  // DETECT LANGUAGES
  
  api.detectLanguage = function(strings, cb) {
    if (!cb) return console.log('No callback defined');
    if (typeof strings !== 'string' && !Array.isArray(strings)) return cb('Input source must be a string or array of strings');

    // Split into multiple calls if string array is longer than allowed by Google (2k limit for GET, 5k for POST)
    var queries;    
    if (Array.isArray(strings) && encodeURIComponent(strings.join(',')).length > maxGetQueryLen && strings.length !== 1) {
      var stringSets = [];
      splitArraysForGoogle(strings, stringSets);
    } else if (!Array.isArray(strings)) {
      stringSets = [[strings]];
    } else {
      stringSets = [strings];
    }

    // Run queries async
    // TODO Make POST requests when query is greater than 2k. More efficient -- limit for POST is 5k, compared to 2k for GET
    async.mapLimit(stringSets, concurrentLimit, function(stringSet, done) {

      get('detect', { q: stringSet }, parseLanguageDetections(stringSet, done));

    }, function(err, detections) {
      if (err) return cb(err);

      // Merge arrays and return detections
      detections = _.flatten(detections);
      if (detections.length === 1) detections = detections[0];
      cb(null, detections);

    });

  };

  ////
  //   RETURN API
  ////

  return {
    translate:                api.translate,
    getSupportedLanguages:    api.getSupportedLanguages,
    detectLanguage:           api.detectLanguage
  };

};


