// i18n test
define(function(require) {'use strict';
    var chai        = require('chai'),
        assert      = chai.assert,
        expect      = chai.expect,
        should      = chai.should();

                      require('jquery');
    //

    //
    var bundleContent   = require('text!test/bundle.json'),
        bundleJSON      = $.parseJSON(bundleContent),
        template        = require('text!test/template.html'),
        template_ru     = require('text!test/template_ru.html'),
        template_en     = require('text!test/template_en.html');

    //
    var i18n = require('i18n');

    i18n.setConfig({
        templateSettings: {
            evaluate:       '',
            interpolate:    /\$\{([\s\S]+?)\}/g,
            escape:         ''
        },
        escape: false
    });

    i18n.setBundle(bundleJSON);

    //
    var t = i18n.translateFuncs;

    //
    describe('i18n...', function() {

        describe('Установка языка...', function(){
            it('Неподдерживаемый язык', function(){
                var fn = function(){
                    i18n.setLang('xxx');
                };

                expect(fn).to.throw(/Lang is not supported/);
            })

            it('Поддерживаемый язык', function(){
                var fn = function(){
                    i18n.setLang('en');
                };

                expect(fn).to.not.throw(Error);
            })
        })

        describe('Базовый язык [ru] - как такового перевода нет :)...', function(){
            it('Переключение языка', function(){
                i18n.setLang('ru');
            })

            it('_tr - простой перевод', function(){
                console.log("ключ", '->', t._tr("ключ"));
                t._tr("ключ").should.equal("ключ");
            })

            it('_trc - перевод с контекстом', function(){
                console.log('ключ (к разгадке чего-либо)', '->', t._trc("ключ", "к разгадке чего-либо"));
                t._trc("ключ", "к разгадке чего-либо").should.equal("ключ");

                console.log('ключ (ключ воды, приток реки)', '->', t._trc("ключ", "ключ воды, приток реки"));
                t._trc("ключ", "ключ воды, приток реки").should.equal("ключ");
            })

            it('_trn - простой перевод с формами множественного числа', function(){
                console.log('0 ключей', '->', t._trn("ключ", 0));
                t._trn("ключ", 0).should.equal("ключей");

                console.log('1 ключ', '->', t._trn("ключ", 1));
                t._trn("ключ", 1).should.equal("ключ");

                console.log('2 ключа', '->', t._trn("ключ", 2));
                t._trn("ключ", 2).should.equal("ключа");

                console.log('5 ключей', '->', t._trn("ключ", 5));
                t._trn("ключ", 5).should.equal("ключей");
            })

            it('_trnc - перевод с контекстом и с формами множественного числа', function(){
                console.log('0 ключей (к разгадке чего-либо)', '->', t._trnc("ключ", 0, "к разгадке чего-либо"));
                t._trnc("ключ", 0, "к разгадке чего-либо").should.equal("ключей");

                console.log('1 ключ (к разгадке чего-либо)', '->', t._trnc("ключ", 1, "к разгадке чего-либо"));
                t._trnc("ключ", 1, "к разгадке чего-либо").should.equal("ключ");

                console.log('2 ключа (к разгадке чего-либо)', '->', t._trnc("ключ", 2, "к разгадке чего-либо"));
                t._trnc("ключ", 2, "к разгадке чего-либо").should.equal("ключа");

                console.log('5 ключей (к разгадке чего-либо)', '->', t._trnc("ключ", 5, "к разгадке чего-либо"));
                t._trnc("ключ", 5, "к разгадке чего-либо").should.equal("ключей");
            })

            describe('В бандле только ключ, нет контекста, нет форм множественного числа...', function(){
                it('_tr - простой перевод', function(){
                    console.log("корова", '->', t._tr("корова"));
                    t._tr("корова").should.equal("корова");
                })

                it('_trc - нет контекста в бандле', function(){
                    console.log('корова (нет контекста в бандле)', '->', t._trc("корова", "корова"));
                    t._trc("корова", "корова").should.equal("корова");
                })

                it('_trn - нет форм множественного числа в бандле', function(){
                    console.log('0 коров (нет форм множественного числа в бандле)', '->', t._trn("корова", 0));
                    t._trn("корова", 0).should.equal("корова");

                    console.log('1 корова (нет форм множественного числа в бандле)', '->', t._trn("корова", 1));
                    t._trn("корова", 1).should.equal("корова");

                    console.log('2 коровы (нет форм множественного числа в бандле)', '->', t._trn("корова", 2));
                    t._trn("корова", 2).should.equal("корова");
                })

                it('_trnc - нет форм множественного числа в бандле, нет контекста в бандле', function(){
                    console.log('0 коров (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 0, "корова"));
                    t._trnc("корова", 0, "корова").should.equal("корова");

                    console.log('1 корова (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 1, "корова"));
                    t._trnc("корова", 1, "корова").should.equal("корова");

                    console.log('2 коровы (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 2, "корова"));
                    t._trnc("корова", 2, "корова").should.equal("корова");
                })
            })

            describe('Перевод предложений', function(){
                it('_tr - простой перевод', function(){
                    console.log("Красивый лиловый шар, наполненный водородом.", '->', t._tr("Красивый лиловый шар, наполненный водородом."));
                    t._tr("Красивый лиловый шар, наполненный водородом.").should.equal("Красивый лиловый шар, наполненный водородом.");
                })

                it('_trn - простой перевод с формами множественного числа', function(){
                    console.log('0 Красивых лиловых шаров, наполненных водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 0));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 0).should.equal("Красивых лиловых шаров, наполненных водородом.");

                    console.log('1 Красивый лиловый шар, наполненный водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 1));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 1).should.equal("Красивый лиловый шар, наполненный водородом.");

                    console.log('2 Красивых лиловых шара, наполненных водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 2));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 2).should.equal("Красивых лиловых шара, наполненных водородом.");
                })
            })

            describe('Трансляция "системных ключей"', function(){
                it('_tr - простой перевод', function(){
                    console.log("SYSTEM_ERROR", '->', t._tr("SYSTEM_ERROR"));
                    t._tr("SYSTEM_ERROR").should.equal("Системная ошибка");
                })
            })
        })

        describe('Язык перевода [en]...', function(){
            it('Переключение языка', function(){
                i18n.setLang('en');
            })

            it('_tr - простой перевод', function(){
                console.log("ключ", '->', t._tr("ключ"));
                t._tr("ключ").should.equal("key");
            })

            it('_trc - перевод с контекстом', function(){
                console.log('ключ (к разгадке чего-либо)', '->', t._trc("ключ", "к разгадке чего-либо"));
                t._trc("ключ", "к разгадке чего-либо").should.equal("clue");

                console.log('ключ (ключ воды, приток реки)', '->', t._trc("ключ", "ключ воды, приток реки"));
                t._trc("ключ", "ключ воды, приток реки").should.equal("feeder");
            })

            it('_trn - простой перевод с формами множественного числа', function(){
                console.log('0 ключей', '->', t._trn("ключ", 0));
                t._trn("ключ", 0).should.equal("keys");

                console.log('1 ключ', '->', t._trn("ключ", 1));
                t._trn("ключ", 1).should.equal("key");

                console.log('2 ключа', '->', t._trn("ключ", 2));
                t._trn("ключ", 2).should.equal("keys");

                console.log('5 ключей', '->', t._trn("ключ", 5));
                t._trn("ключ", 5).should.equal("keys");
            })

            it('_trnc - перевод с контекстом и с формами множественного числа', function(){
                console.log('0 ключей (к разгадке чего-либо)', '->', t._trnc("ключ", 0, "к разгадке чего-либо"));
                t._trnc("ключ", 0, "к разгадке чего-либо").should.equal("clues");

                console.log('1 ключ (к разгадке чего-либо)', '->', t._trnc("ключ", 1, "к разгадке чего-либо"));
                t._trnc("ключ", 1, "к разгадке чего-либо").should.equal("clue");

                console.log('2 ключа (к разгадке чего-либо)', '->', t._trnc("ключ", 2, "к разгадке чего-либо"));
                t._trnc("ключ", 2, "к разгадке чего-либо").should.equal("clues");

                console.log('5 ключей (к разгадке чего-либо)', '->', t._trnc("ключ", 5, "к разгадке чего-либо"));
                t._trnc("ключ", 5, "к разгадке чего-либо").should.equal("clues");


                console.log('0 ключей (ключ воды, приток реки)', '->', t._trnc("ключ", 0, "ключ воды, приток реки"));
                t._trnc("ключ", 0, "ключ воды, приток реки").should.equal("feeders");

                console.log('1 ключей (ключ воды, приток реки)', '->', t._trnc("ключ", 0, "ключ воды, приток реки"));
                t._trnc("ключ", 1, "ключ воды, приток реки").should.equal("feeder");

                console.log('2 ключей (ключ воды, приток реки)', '->', t._trnc("ключ", 0, "ключ воды, приток реки"));
                t._trnc("ключ", 2, "ключ воды, приток реки").should.equal("feeders");

                console.log('5 ключей (ключ воды, приток реки)', '->', t._trnc("ключ", 0, "ключ воды, приток реки"));
                t._trnc("ключ", 5, "ключ воды, приток реки").should.equal("feeders");
            })

            describe('В бандле только ключ, нет контекста, нет форм множественного числа...', function(){
                it('_tr - простой перевод', function(){
                    console.log("корова", '->', t._tr("корова"));
                    t._tr("корова").should.equal("cow");
                })

                it('_trc - нет контекста в бандле', function(){
                    console.log('корова (нет контекста в бандле)', '->', t._trc("корова", "корова"));
                    t._trc("корова", "корова").should.equal("корова");
                })

                it('_trn - нет форм множественного числа в бандле', function(){
                    console.log('0 коров (нет форм множественного числа в бандле)', '->', t._trn("корова", 0));
                    t._trn("корова", 0).should.equal("корова");

                    console.log('1 корова (нет форм множественного числа в бандле)', '->', t._trn("корова", 1));
                    t._trn("корова", 1).should.equal("cow");

                    console.log('2 коровы (нет форм множественного числа в бандле)', '->', t._trn("корова", 2));
                    t._trn("корова", 2).should.equal("корова");
                })

                it('_trnc - нет форм множественного числа в бандле, нет контекста в бандле', function(){
                    console.log('0 коров (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 0, "корова"));
                    t._trnc("корова", 0, "корова").should.equal("корова");

                    console.log('1 корова (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 1, "корова"));
                    t._trnc("корова", 1, "корова").should.equal("корова");

                    console.log('2 коровы (нет форм множественного числа в бандле, нет контекста в бандле)', '->', t._trnc("корова", 2, "корова"));
                    t._trnc("корова", 2, "корова").should.equal("корова");
                })
            })

            describe('Перевод предложений', function(){
                it('_tr - простой перевод', function(){
                    console.log("Красивый лиловый шар, наполненный водородом.", '->', t._tr("Красивый лиловый шар, наполненный водородом."));
                    t._tr("Красивый лиловый шар, наполненный водородом.").should.equal("Beautiful purple balloon filled with hydrogen.");
                })

                it('_trn - простой перевод с формами множественного числа', function(){
                    console.log('0 Красивых лиловых шаров, наполненных водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 0));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 0).should.equal("Beautiful purple balloons filled with hydrogen.");

                    console.log('1 Красивый лиловый шар, наполненный водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 1));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 1).should.equal("Beautiful purple balloon filled with hydrogen.");

                    console.log('2 Красивых лиловых шара, наполненных водородом.', '->', t._trn("Красивый лиловый шар, наполненный водородом.", 2));
                    t._trn("Красивый лиловый шар, наполненный водородом.", 2).should.equal("Beautiful purple balloons filled with hydrogen.");
                })
            })

            describe('Трансляция "системных ключей"', function(){
                it('_tr - простой перевод', function(){
                    console.log("SYSTEM_ERROR", '->', t._tr("SYSTEM_ERROR"));
                    t._tr("SYSTEM_ERROR").should.equal("System error");
                })
            })
        })
    })

    describe('Глобальные функции перевода', function(){
        it('Включение языка [en]', function(){
            i18n.setLang('en');
        })

        it('window._tr', function(){
            window._tr("ключ").should.equal("key");
        })

        it('window._trc', function(){
            t._trc("ключ", "к разгадке чего-либо").should.equal("clue");
            t._trc("ключ", "ключ воды, приток реки").should.equal("feeder");
        })

        it('window._trn', function(){
            t._trn("ключ", 0).should.equal("keys");
            t._trn("ключ", 1).should.equal("key");
            t._trn("ключ", 2).should.equal("keys");
            t._trn("ключ", 5).should.equal("keys");
        })

        it('window._trnc', function(){
            t._trnc("ключ", 0, "к разгадке чего-либо").should.equal("clues");
            t._trnc("ключ", 1, "к разгадке чего-либо").should.equal("clue");
            t._trnc("ключ", 2, "к разгадке чего-либо").should.equal("clues");
            t._trnc("ключ", 5, "к разгадке чего-либо").should.equal("clues");
        })
    })

    describe('Перевод шаблона', function(){
        it('Шаблон', function(){
            console.log(template);
            assert.isString(template);
            assert.isString(template_ru);
            assert.isString(template_en);
        })

        it('Перевод шаблона при базовом языке [ru]', function(){
            i18n.setLang('ru');

            var tr_ru = i18n.translateTemplate(template);
            console.log(tr_ru);
            assert.equal(tr_ru, template_ru);
        })

        it('Перевод шаблона при языке перевода [en]', function(){
            i18n.setLang('en');

            var tr_en = i18n.translateTemplate(template);
            console.log(tr_en);
            assert.equal(tr_en, template_en);
        })
    })

    describe('Перевод в JavaScript коде через глобальный объект [window]', function(){
        it('Runtime перевод', function(){
            // en
            i18n.setLang('en');

            var message = {
                m1: _tr("ключ"),

                m2: _trc("ключ", "к разгадке чего-либо"),
                m3: _trc("ключ", "ключ воды, приток реки"),

                translateKeys: function(count) {
                    return _trn("ключ", count);
                },

                translateClues: function(count) {
                    return _trnc("ключ", count, "к разгадке чего-либо");
                },

                translateFeeder: function(count) {
                    return _trnc("ключ", count, "ключ воды, приток реки");
                },

                m4: _tr("корова")
            };

            assert.equal(message.m1, "key");

            assert.equal(message.m2, "clue");
            assert.equal(message.m3, "feeder");

            assert.equal(message.m4, "cow");

            // en
            message.translateKeys(0).should.equal("keys");
            message.translateKeys(1).should.equal("key");
            message.translateKeys(123).should.equal("keys");

            message.translateClues(0).should.equal("clues");
            message.translateClues(1).should.equal("clue");
            message.translateClues(123).should.equal("clues");

            message.translateFeeder(0).should.equal("feeders");
            message.translateFeeder(1).should.equal("feeder");
            message.translateFeeder(123).should.equal("feeders");

            // ru
            i18n.setLang('ru');

            message.translateKeys(0).should.equal("ключей");
            message.translateKeys(1).should.equal("ключ");
            message.translateKeys(22).should.equal("ключа");
            message.translateKeys(25).should.equal("ключей");

            message.translateClues(0).should.equal("ключей");
            message.translateClues(1).should.equal("ключ");
            message.translateClues(22).should.equal("ключа");
            message.translateClues(25).should.equal("ключей");

            message.translateFeeder(0).should.equal("ключей");
            message.translateFeeder(1).should.equal("ключ");
            message.translateFeeder(22).should.equal("ключа");
            message.translateFeeder(25).should.equal("ключей");
        })
    })
});
