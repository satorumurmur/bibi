const Bibi = require('./bibi.recipe.js');

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
    watch: true,
    ignore: [
        Bibi.DIST + '/bibi-bookshelf/**'
    ],
    ghostMode: false
};