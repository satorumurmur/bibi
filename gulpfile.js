/*!
 *                                                                                                                                (℠)
 *  # gulpfile for BiB/i
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del');
const Package = JSON.parse(require('fs').readFileSync('package.json'));

/* make:distribution */ {
    const Dest = 'archives', Dist = Package.name + '-v' + Package.version;
    gulp.task('clean:distribution-files',   done => { del.sync(Dest + '/' + Dist         ), done(); });
    gulp.task('clean:distribution-archive', done => { del.sync(Dest + '/' + Dist + '.zip'), done(); });
    gulp.task('merge:distribution-files', () => {
        return gulp.src([
            'bib/*',
            'bib/i/**/*.*'
        ], {
            base: '.'
        })
            .pipe(gulp.dest(Dest + '/' + Dist));
    });
    gulp.task('make:distribution-archive', () => {
        return gulp.src([
            Dest + '/' + Dist + '/**/*',
            Dest + '/' + Dist + '/**/*.*'
        ], {
            base: Dest
        })
            .pipe(require('gulp-zip')(Dist + '.zip'))
            .pipe(gulp.dest(Dest));
    });
    gulp.task('make:distribution', gulp.series(
        'clean:distribution-files',
        'clean:distribution-archive',
        'merge:distribution-files',
        'make:distribution-archive'/*,
        'clean:distribution-files'*/
    ));
}

/* make:dress-template */ {
    const TimeStamp = new Date(Date.now() + 1000 * 60 * 60 * (new Date().getTimezoneOffset() / -60)).toISOString().split('.')[0].replace(/[-:]/g, '').replace('T', '-');
    const Dest = 'dev-bib/i/res/styles/wardrobe', Dist = '--dress-template--' + TimeStamp;
    gulp.task('clean:dress-template-files',  done => { del.sync(Dest + '/' + Dist), done(); });
    gulp.task('merge:dress-template-base-files', () => {
        const SrcDir = 'dev-bib/i/res/styles/_/dress-template';
        return gulp.src([
            SrcDir + '/**/*.*'
        ], {
            base: SrcDir
        })
            .pipe(gulp.dest(Dest + '/' + Dist));
    });
    gulp.task('merge:dress-template-part-files', () => {
        const SrcDir = 'dev-bib/i/res/styles/wardrobe/_';
        return gulp.src([
            SrcDir + '/**.*',
            '!' + SrcDir + '/_@a.scss',
            '!' + SrcDir + '/_@z.scss'
        ], {
            base: SrcDir
        })
            .pipe(gulp.dest(Dest + '/' + Dist));
    });
    gulp.task('make:dress-template', gulp.series(
        'clean:dress-template-files',
        'merge:dress-template-base-files',
        'merge:dress-template-part-files'
    ));
}