module.exports = {
    port: 61671,
    ui: {
        port: 61672
    },
    server: {
        baseDir: '.',
        index: 'index.html'
    },
    snippetOptions: {
        ignorePaths: 'bib/bookshelf/**/*.*'
    },
    files: [
        'bib/i/**/*.*'
    ],
    ghostMode: false/*{
        clicks: true,
        scroll: true,
        location: true,
        forms: true
    }*/
};