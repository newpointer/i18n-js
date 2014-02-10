require.config({
    baseUrl: '/',

    paths: {
        // path to src dependencies files // TODO use bower
        'jquery':       'lib/jquery/jquery',
        'underscore':   'lib/underscore/underscore',
        'text':         'lib/requirejs-text/text', // @Deprecated

        // paths to test-framework files
        'mocha':        'node_modules/mocha/mocha',
        'chai':         'node_modules/chai/chai',

        // paths to test files
        'i18n_test':    'test/i18n_test'
    },

    packages: [{
        // src files
        name: 'i18n',
        location: 'src',
        main: 'i18n'
    }],

    shim: {
        'underscore': {
            exports: '_'
        }
    }
});

define(function(require) {
    require('mocha');

    mocha.setup('bdd');

    require(['i18n_test'], function(require) {
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    });
});

