const Bibi = require('./bibi.info.js');

module.exports = {
    port: 61671,
    ui: {
        port: 61672
    },
    server: {
        baseDir: Bibi.DIST,
        index: 'index.html'
    },
    files: [
        'bibi/**'
    ],
    startPath: 'bibi/?book=',
    snippetOptions: {
        whitelist: [
            'bibi/*',
            'bibi/**/',
            'bibi/*[?]*/**'
        ],
        blacklist: [
            '**'
        ]
    },
    ghostMode: false
};