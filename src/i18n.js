/**
 * @module i18n
 * @desc RequireJS-модуль интернационализации
 * @author ankostyuk
 */
define(function(require) {'use strict';

    require('underscore');
    //

    var root                    = window,
        CONTEXT_GLUE            = '\u0004',
        bundle                  = {},
        pluralFormFuncs         = {},
        langBundle              = null,
        langPluralFormIndex     = null;

    var config = {
        escape: true
    };

    function setConfig(options) {
        _.extend(config, options);
    }

    function setBundle(bundleJSON) {
        bundle = bundleJSON;
        pluralFormFuncs = buildPluralFormFuncs();
    }

    function setLang(lang) {
        langBundle = bundle[lang];
        if (!langBundle) {
            throw new Error('Lang is not supported: ' + lang);
        }
        langPluralFormIndex = pluralFormFuncs[lang];
    }

    function buildPluralFormFuncs() {
        var r = {};

        _.each(bundle, function(langBundle, lang){
            var ruleCode = langBundle['']['pluralForms']['ruleCode'];
            r[lang] = new Function('n', 'return (' + ruleCode + ');');
        });

        return r;
    }

    function getMessage(key, context, index) {
        var r           = key,
            messages    = langBundle[context ? (context + CONTEXT_GLUE + key) : key];

        if (_.isArray(messages)) {
            var message = messages[index];

            if (message && message !== '') {
                r = message;
            }
        }

        if (config.escape) {
            r = _.escape(r);
        }

        return r;
    }

    //
    function translateTemplate(templateString) {
        var template = _.template(templateString, null, config.templateSettings);
        return template();
    }

    //
    var _tr = root._tr = function(key) {
        return getMessage(key, null, 1);
    };

    var _trc = root._trc = function(key, context) {
        return getMessage(key, context, 1);
    };

    var _trn = root._trn = function(key, n) {
        return getMessage(key, null, 1 + langPluralFormIndex(n));
    };

    var _trnc = root._trnc = function(key, n, context) {
        return getMessage(key, context, 1 + langPluralFormIndex(n));
    };

    //
    return {
        setConfig: setConfig,
        setBundle: setBundle,
        setLang: setLang,
        translateTemplate: translateTemplate,
        translateFuncs: {
            _tr: _tr,
            _trc: _trc,
            _trn: _trn,
            _trnc: _trnc
        }
    };
});
