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
    startPath: 'bibi/?book=',
    ghostMode: false
};