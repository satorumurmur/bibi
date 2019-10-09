/*!
 *                                                                                                                                (℠)
 *  # gulpfile for Bibi
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del'), fs = require('fs'), gulpZip = require('gulp-zip');
const Package = JSON.parse(fs.readFileSync('package.json')), Bibi = require('./bibi.info.js');

/* initialize */ {
    gulp.task('initialize', done => {
        fs.mkdirSync(Bibi.DIST + '/bibi',           { recursive: true });
        fs.mkdirSync(Bibi.DIST + '/bibi-bookshelf', { recursive: true }); if(!Bibi.KeepBackCompat) return done();
        fs.mkdirSync(Bibi.DIST + '/bib/i',          { recursive: true });
        fs.mkdirSync(Bibi.DIST + '/bib/bookshelf',  { recursive: true }); done();
    });
}

/* clean */ {
    gulp.task('clean', done => {
        del.sync([
            'bibi/**/.DS_Store',
            'bibi/**/Thumbs.db',
            'bibi/LICENSE',
            'bibi/README.md',
            'bibi/*.html',
            'bibi/and',
            'bibi/extensions',
            'bibi/presets',
            'bibi/resources',
            'bibi/wardrobe',
            'bib/i/*.html',
            'bib/i.js'
        ].map(X => Bibi.DIST + '/' + X));
        try { if(!fs.readdirSync(Bibi.DIST + '/bibi' ).length) del.sync(Bibi.DIST + '/bibi' ); } catch(E) {}
        try { if(!fs.readdirSync(Bibi.DIST + '/bib/i').length) del.sync(Bibi.DIST + '/bib/i'); } catch(E) {}
        try { if(!fs.readdirSync(Bibi.DIST + '/bib'  ).length) del.sync(Bibi.DIST + '/bib'  ); } catch(E) {}
        done();
    });
}

/* make:backward-compatibility-files */ {
    gulp.task('make:backward-compatibility-files', () => {
        return gulp.src([
            Bibi.SRCBC + '/bib/**'
        ], {
            base: Bibi.SRCBC
        }).pipe(gulp.dest(
            Bibi.DIST
        ));
    });
}

const setPackageBuilderTasks = (Opt) => {
    gulp.task('clean:' + Opt.Name + '-archive', done => {
        del.sync([
            Bibi.ARCHIVE + '/' + Opt.Label + '.zip'
        ]);
        done();
    });
    gulp.task('clean:' + Opt.Name + '-directory', done => {
        del.sync([
            Bibi.ARCHIVE + '/' + Opt.Label
        ]);
        done();
    });
    gulp.task('merge:' + Opt.Name + '-files', () => {
        fs.mkdirSync(Bibi.ARCHIVE + '/' + Opt.Label + '/' + Opt.Bookshelf, { recursive: true });
        return gulp.src([
            Bibi.DIST + '/' + Opt.Files
        ], {
            base: Bibi.DIST
        }).pipe(gulp.dest(
            Bibi.ARCHIVE + '/' + Opt.Label
        ));
    });
    gulp.task('make:' + Opt.Name + '-archive', () => {
        return gulp.src([
            Bibi.ARCHIVE + '/' + Opt.Label + '/**'
        ], {
            base: Bibi.DIST
        }).pipe(gulpZip(
            Opt.Label + '.zip'
        )).pipe(gulp.dest(
            Bibi.ARCHIVE
        ));
    });
    gulp.task('make:' + Opt.Name + '', gulp.series(
        gulp.parallel(
            'clean:' + Opt.Name + '-directory',
            'clean:' + Opt.Name + '-archive'
        ),
        'merge:' + Opt.Name + '-files',
        'make:' + Opt.Name + '-archive',
        'clean:' + Opt.Name + '-directory'
    ));
};

/* make:distribution-package */
setPackageBuilderTasks({
    Name: 'distribution-package',
    Label: Package.name + '-v' + Package.version,
    Files: 'bibi/**',
    Bookshelf: 'bibi-bookshelf'
});

/* make:backward-compatibility-package */
setPackageBuilderTasks({
    Name: 'backward-compatibility-package',
    Label: Package.name + '-v' + Package.version + '_BackCompatPack',
    Files: 'bib/**',
    Bookshelf: 'bib/bookshelf'
});

/* make:dress-template */ {
    gulp.task('make:dress-template', () => {
        return gulp.src([
            Bibi.SRC + '/bibi/wardrobe/_dress-codes/**',
        ], {
            base: Bibi.SRC + '/bibi/wardrobe/_dress-codes'
        }).pipe(gulp.dest(
            Bibi.SRC + '/bibi/wardrobe/DRESS-TEMPLATE-' + new Date(Date.now() + 1000 * 60 * 60 * (new Date().getTimezoneOffset() / -60)).toISOString().split('.')[0].replace(/[-:]/g, '').replace('T', '-')
        ));
    });
}