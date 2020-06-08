/*!
 *                                                                                                                                (℠)
 *  # gulpfile for Bibi
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del'), fs = require('fs'), rename = require('gulp-rename'), zip = require('gulp-zip');

const Package = JSON.parse(fs.readFileSync('package.json'));
const Bibi = require('./bibi.info.js');

gulp.task('clean', done => {
    if(!Bibi.ForPack) {
        del.sync([
            '**/.DS_Store',
            '**/Thumbs.db',
            'LICENSE',
            '*.md',
            'bibi/*.html',
            'bibi/and',
            'bibi/extensions',
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
        ].forEach(Dir => {
            try { Dir = Bibi.DIST + '/' + Dir ; if(!fs.readdirSync(Dir).length) del.sync(Dir); } catch(E) {}
        });
    }
    del.sync(Bibi.ARCHIVETMP);
    done();
});

gulp.task('initialize', done => {
    [
      //'bibi',
      //'bibi-bookshelf'
    ].concat(!Bibi.WithBCK ? [] : [
      //'bib',
      //'bib/i',
        'bib/bookshelf'
    ]).forEach(Dir => {
        fs.mkdirSync((Bibi.ForPack ? Bibi.ARCHIVETMP : Bibi.DIST) + '/' + Dir, { recursive: true });
    });
    done();
});

gulp.task('reset', gulp.series(
    'clean',
    'initialize'
));

gulp.task('make:dress-template', () => {
    return gulp.src([
        Bibi.SRC + '/bibi/wardrobe/_dress-codes/**',
    ], {
        base: Bibi.SRC + '/bibi/wardrobe/_dress-codes'
    }).pipe(gulp.dest(
        Bibi.SRC + '/bibi/wardrobe/DRESS-TEMPLATE-' + new Date(Date.now() + 1000 * 60 * 60 * (new Date().getTimezoneOffset() / -60)).toISOString().split('.')[0].replace(/[-:]/g, '').replace('T', '-')
    ));
});

gulp.task('make:package', () => {
    const PackageName = (Package.name == 'bibi' ? 'Bibi' : Package.name) + '-v' + Package.version + (Bibi.WithBCK ? '_with_BackCompatKit' : '') + '.zip';
    del.sync([
        Bibi.ARCHIVES + '/' + PackageName
    ]);
    return gulp.src([
        'LICENSE',
        'README.md',
        'bibi/*.html',
        'bibi/and/**',
        'bibi/extensions/**',
        'bibi/presets/**',
        'bibi/resources/**',
        'bibi/wardrobe/**',
        'bibi-bookshelf'
    ].concat(!Bibi.WithBCK ? [] : [
        'README.BackCompatKit.md',
        'bib/i/*.html',
        'bib/i.js',
        'bib/i/presets/**',
      //'bib/bookshelf'
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

//  const Files = {
//      HTMLs: {
//          [Bibi.SRC]: [
//              'bibi/*.html',
//              'bibi-bookshelf/__samples/**/*.epub',
//              'bibi-demo/**/*.html'
//          ],
//          [Bibi.SRCBC]: [
//              'bib/i/*.html'
//          ]
//      },
//      Documents: {
//          '.': [
//              'LICENSE',
//              'README.md'
//          ],
//          [Bibi.SRCBC]: [
//              'README.BackCompatKit.md'
//          ]
//      },
//      Samples: {
//          [Bibi.SRC]: [
//              'bibi-bookshelf/__samples/**/*.epub'
//          ]
//      }
//  };
//  
//  const  copyFiles = (A, B   ) =>   gulp.src(A[B].map(X => B + '/' + X), { base: B }).pipe(gulp.dest(Bibi.DIST));
//  const watchFiles = (A, B, C) => gulp.watch(A[B].map(X => B + '/' + X), gulp.parallel(C));
//  
//  gulp.task('update:htmls',                   () => copyFiles(Files.HTMLs,     Bibi.SRC  ));
//  gulp.task('update:documents',               () => copyFiles(Files.Documents, '.'       ));
//  gulp.task('update:samples',                 () => copyFiles(Files.Samples,   Bibi.SRC  ));
//  
//  gulp.task('update:htmls-backcompatkit',     () => copyFiles(Files.HTMLs,     Bibi.SRCBC));
//  gulp.task('update:documents-backcompatkit', () => copyFiles(Files.Documents, Bibi.SRCBC));
//  
//  gulp.task('update', gulp.parallel([
//      'update:htmls',
//      'update:documents',
//      'update:samples'
//  ].concat(!Bibi.WithBCK ? [] : [
//      'update:htmls-backcompatkit',
//      'update:documents-backcompatkit'
//  ])));
//  
//  gulp.task('watch', done => {
//      watchFiles(Files.HTMLs,     Bibi.SRC  , 'update:htmls'                  );
//      watchFiles(Files.HTMLs,     Bibi.SRCBC, 'update:htmls-backcompatkit'    );
//      watchFiles(Files.Samples,   Bibi.SRC  , 'update:samples'                );
//      if(!Bibi.WithBCK) return done();
//      watchFiles(Files.Documents, '.'       , 'update:documents'              );
//      watchFiles(Files.Documents, Bibi.SRCBC, 'update:documents-backcompatkit');
//      done();
//  });
