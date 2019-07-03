/*!
 *                                                                                                                                (℠)
 *  # gulpfile for BiB/i
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del');
const Dest = 'archives', Dist = 'bibi-v' + JSON.parse(require('fs').readFileSync('package.json')).version;

gulp.task('clean:files',   done => { del.sync(Dest + '/' + Dist         ), done(); });
gulp.task('clean:archive', done => { del.sync(Dest + '/' + Dist + '.zip'), done(); });

gulp.task('merge:files', () => {
    return gulp.src([
        'bib/*',
        'bib/i/**/*.*'
    ], {
        base: '.'
    })
        .pipe(gulp.dest(Dest + '/' + Dist));
});

gulp.task('make:archive', () => {
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
    'clean:files',
    'clean:archive',
    'merge:files',
    'make:archive'/*,
    'clean:files'*/
));