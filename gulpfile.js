/*!
 *                                                                                                                                (℠)
 *  # gulpfile for Bibi
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del'), fs = require('fs'), rename = require('gulp-rename'), zip = require('gulp-zip');
const Package = JSON.parse(fs.readFileSync('package.json')), Bibi = require('./bibi.info.js');

const PackageName = Package.name == 'bibi' ? 'Bibi' : Package.name;

/* initialize */ {
    gulp.task('initialize', done => {
        fs.mkdirSync(Bibi.DIST + '/bibi',           { recursive: true });
        fs.mkdirSync(Bibi.DIST + '/bibi-bookshelf', { recursive: true }); done();
    });
}

/* clean */ {
    gulp.task('clean', done => {
        del.sync([
            '**/.DS_Store',
            '**/Thumbs.db',
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
        ].map(
            X => Bibi.DIST + '/' + X
        ));
        try { if(!fs.readdirSync(Bibi.DIST + '/bibi' ).length) del.sync(Bibi.DIST + '/bibi' ); } catch(E) {}
        try { if(!fs.readdirSync(Bibi.DIST + '/bib/i').length) del.sync(Bibi.DIST + '/bib/i'); } catch(E) {}
        try { if(!fs.readdirSync(Bibi.DIST + '/bib'  ).length) del.sync(Bibi.DIST + '/bib'  ); } catch(E) {}
        done();
    });
}

/* make:backward-compatibility-kit-files, clean:backward-compatibility-kit-files */ {
    gulp.task('make:backward-compatibility-kit:bib/i/*.html', () => {
        return gulp.src([
            Bibi.SRCBC + '/bib/i/*.html'
        ], {
            base: Bibi.SRCBC
        }).pipe(gulp.dest(
            Bibi.DIST
        ));
    });
    gulp.task('make:backward-compatibility-kit:bib/i.js', () => {
        return gulp.src([
            Bibi.DIST + '/bibi/and/jo.js'
        ], {
            base: Bibi.DIST
        }).pipe(rename(
            'bib/i.js'
        )).pipe(gulp.dest(
            Bibi.DIST
        ));
    });
    gulp.task('make:backward-compatibility-kit-files', gulp.parallel(
        'make:backward-compatibility-kit:bib/i/*.html',
        'make:backward-compatibility-kit:bib/i.js'
    ));
    gulp.task('clean:backward-compatibility-kit-files', done => {
        del.sync([
            'bib/**/.DS_Store',
            'bib/**/Thumbs.db',
            'bib/i/*.html',
            'bib/i.js'
        ].map(
            X => Bibi.DIST + '/' + X
        ));
        try { if(!fs.readdirSync(Bibi.DIST + '/bib/i').length) del.sync(Bibi.DIST + '/bib/i'); } catch(E) {}
        try { if(!fs.readdirSync(Bibi.DIST + '/bib'  ).length) del.sync(Bibi.DIST + '/bib'  ); } catch(E) {}
        done();
    });
}

const setPackageBuilderTasks = (Opt) => {
    gulp.task('clean:' + Opt.Name + '-archive', done => {
        del.sync([
            Bibi.ARCHIVES + '/' + Opt.Label + '.zip'
        ]);
        done();
    });
    gulp.task('clean:' + Opt.Name + '-directory', done => {
        del.sync([
            Bibi.ARCHIVES + '/' + Opt.Label
        ]);
        done();
    });
    gulp.task('merge:' + Opt.Name + '-content', () => {
        fs.mkdirSync(Bibi.ARCHIVES + '/' + Opt.Label + '/' + Opt.Bookshelf, { recursive: true });
        return gulp.src(Opt.Files.map(
            X => Bibi.DIST + '/' + X
        ), {
            base: Bibi.DIST
        }).pipe(gulp.dest(
            Bibi.ARCHIVES + '/' + Opt.Label
        ));
    });
    gulp.task('zip:' + Opt.Name, () => {
        return gulp.src([
            Bibi.ARCHIVES + '/' + Opt.Label + '/**'
        ], {
            base: Bibi.ARCHIVES
        }).pipe(zip(
            Opt.Label + '.zip'
        )).pipe(gulp.dest(
            Bibi.ARCHIVES
        ));
    });
    gulp.task('make:' + Opt.Name + '-archive', gulp.series(
        gulp.parallel(
            'clean:' + Opt.Name + '-directory',
            'clean:' + Opt.Name + '-archive'
        ),
        'merge:' + Opt.Name + '-content',
        'zip:' + Opt.Name,
        'clean:' + Opt.Name + '-directory'
    ));
};

/* make:distribution-package-archive */
setPackageBuilderTasks({
    Name: 'distribution-package',
    Label: PackageName + '-v' + Package.version,
    Bookshelf: 'bibi-bookshelf',
    Files: [
        'bibi/LICENSE',
        'bibi/README.md',
        'bibi/*.html',
        'bibi/and/**',
        'bibi/extensions/**',
        'bibi/presets/**',
        'bibi/resources/**',
        'bibi/wardrobe/**',
    ]
});

/* make:backward-compatibility-kit-archive */
setPackageBuilderTasks({
    Name: 'backward-compatibility-kit',
    Label: PackageName + '-v' + Package.version + '_BackCompatKit',
    Bookshelf: 'bib/bookshelf',
    Files: [
        'bib/i/*.html',
        'bib/i.js'
    ]
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