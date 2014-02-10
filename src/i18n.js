/**
 * @module i18n
 * @desc RequireJS-модуль интернационализации
 *
 * @author ankostyuk
 *
 * @example
 *
    // Импорт
    var i18n = require('i18n');

    // Конфигурирование
    i18n.setConfig({
        templateSettings: {
            evaluate:       '',
            interpolate:    /\$\{([\s\S]+?)\}/g,
            escape:         ''
        },
        escape: false
    });
 *
 *
 * @example
 *
    // Формат bundle.json
    // Сводный бандл для языков
    {

        // Бандл для конкретного языка
        "lang_key_1": {

            // Заголовок
            "": {

                // Описание форм множественного числа
                "pluralForms": {

                    // Кол-во форм
                    "count": 2,

                    // C-like код вычисления индекса формы
                    "ruleCode": "n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5",

                    // CLDR формат
                    // http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
                    "cldrFormat": "zero{{0}}one{{1}}two{{2}}few{{3}}many{{4}}other{{5}}"
                }
            }

            // Сообщения по ключу
            "key": [

                // Зарезервированно для простого множественного числа. В данный момент не используется
                null,

                // Сообщение по ключу или единственное число при формах множественного числа (форма 0).
                "сообщение",

                // Множественное число при формах множественного числа (форма 1).
                "сообщения",

                ...

                // Множественное число при формах множественного числа (форма N).
                "сообщений"
            ],

            ...

            // Сообщения по ключу и контексту
            "context\u0004key": [
                ...
            ]
        }

        ...

        // Бандл для конкретного языка
        "lang_key_N": {
        }
    }
 *
 */
define(function(require) {'use strict';

    // @Deprecated
    var bundleContent       = require('text!./bundle/bundle.json');
                              require('underscore');
                              require('jquery');
    //

    var root = window;

    var CONTEXT_GLUE = '\u0004';
    var PLURAL_FORM_SEPARATOR = '/';

    var bundle = $.parseJSON(bundleContent);

    var pluralFormFuncs = buildPluralFormFuncs();

    var langBundle = null;
    var langPluralFormIndex = null;

    var config = {
        escape: true
    };

    function setConfig(options) {
        _.extend(config, options);
    }

    function buildPluralFormFuncs() {
        var r = {};

        _.each(bundle, function(langBundle, lang){
            var ruleCode = langBundle['']['pluralForms']['ruleCode'];
            r[lang] = new Function('n', 'return (' + ruleCode + ');');
        });

        return r;
    }

    function setLang(lang) {
        langBundle = bundle[lang];
        if (!langBundle) {
            throw new Error('Lang is not supported: ' + lang);
        }
        langPluralFormIndex = pluralFormFuncs[lang];
    }

    function getMessage(key, context, index) {
        var r = key;

        var messages = langBundle[context ? (context + CONTEXT_GLUE + key) : key];

        if ($.isArray(messages)) {
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

    function getMessageKeyByPluralKey(pluralKey) {
        return pluralKey.split(PLURAL_FORM_SEPARATOR)[0];
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

    var _trn = root._trn = function(pluralKey, n) {
        return getMessage(getMessageKeyByPluralKey(pluralKey), null, 1 + langPluralFormIndex(n));
    };

    var _trnc = root._trnc = function(pluralKey, n, context) {
        return getMessage(getMessageKeyByPluralKey(pluralKey), context, 1 + langPluralFormIndex(n));
    };

    //
    return {
        /**
         * @method
         *
         * @desc Конфигурирование
         *
         * @param {object} options - конфиг
         *
         * @property {object}   options.templateSettings    -
         * Настройки шаблонизатора underscore.js для перевода шаблонов.
         * Должны отличаться от общих настроек шаблонизатора.
         * Т.к. смысл шаблонизации i18n: только перевести текст шаблона, а далее использовать переведённый шаблон с шаблонизатором по умолчанию.
         * @property {boolean}  options.escape              - Экранировать перевод?
         */
        setConfig: setConfig,

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
