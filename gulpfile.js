'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # gulpfile for Bibi                                                                                                                                                                     (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Bibi = require('./bibi.recipe.js');

const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', done => {
    if(!Bibi.ForPack) {
        del.sync([
            '**/.DS_Store',
            '**/Thumbs.db',
            'bibi/*.html',
            'bibi/and',
            'bibi/extensions',
            'bibi/info',
            'bibi/presets',
            'bibi/resources',
            'bibi/wardrobe',
            'bib/i/*.html',
            'bib/i.js',
            'bib/i/presets',
            'bibi-bookshelf/__samples',
            'bibi-demo'
        ].map(
            X => Bibi.DIST + '/' + X
        ));
        [
            'bibi-bookshelf',
            'bibi',
            'bib/bookshelf',
            'bib/i',
            'bib'
        ].forEach(Dir => fs.existsSync(Dir = Bibi.DIST + '/' + Dir) && fs.statSync(Dir).isDirectory() && !fs.readdirSync(Dir).length && fs.rmdirSync(Dir));
    }
    del.sync(Bibi.ARCHIVETMP);
    done();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('make:dress-template', () => {
    return gulp.src([
        Bibi.SRC + '/bibi/wardrobe/_dress-codes/**',
    ], {
        base: Bibi.SRC + '/bibi/wardrobe/_dress-codes'
    }).pipe(gulp.dest(
        Bibi.SRC + '/bibi/wardrobe/DRESS-TEMPLATE-' + new Date(Date.now() + 1000 * 60 * 60 * (new Date().getTimezoneOffset() / -60)).toISOString().split('.')[0].replace(/[-:]/g, '').replace('T', '-')
    ));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('make:package', () => {
    const PackageName = (Bibi.package.name == 'bibi' ? 'Bibi' : Bibi.package.name) + '-v' + Bibi.package.version + (Bibi.WithBCK ? '_with_BackCompatKit' : '') + '.zip';
    del.sync([
        Bibi.ARCHIVES + '/' + PackageName
    ]);
    return gulp.src([
        'bibi/*.html',
        'bibi/and/**',
        'bibi/extensions/**',
        'bibi/info/**',
        'bibi/presets/**',
        'bibi/resources/**',
        'bibi/wardrobe/**',
        'bibi-bookshelf'
    ].concat(!Bibi.WithBCK ? [] : [
        'README.BackCompatKit.md',
        'bib/i/*.html',
        'bib/i.js',
        'bib/i/presets/**'
    ]).map(
        X => Bibi.ARCHIVETMP + '/' + X
    ), {
        base: Bibi.ARCHIVETMP
    }).pipe(zip(
        PackageName
    )).pipe(gulp.dest(
        Bibi.ARCHIVES
    ));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
