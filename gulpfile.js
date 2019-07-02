/*!
 *                                                                                                                                (℠)
 *  # gulpfile for BiB/i
 *
 */

'use strict';

const gulp = require('gulp'), del = require('del'), Version = JSON.parse(require('fs').readFileSync('package.json')).version;

gulp.task('clean: files', done => {
    del.sync('archives/bibi-' + Version);
    done();
});

gulp.task('clean: archive', done => {
    del.sync('archives/bibi-' + Version + '.zip');
    done();
});

gulp.task('merge: files', () => {
    return gulp.src([
        'bib/*',
        'bib/i/**/*.*'
    ], {
        base: '.'
    })
        .pipe(gulp.dest('archives/bibi-' + Version));
});

gulp.task('make: archive', () => {
    return gulp.src([
        'archives/bibi-' + Version + '/**/*',
        'archives/bibi-' + Version + '/**/*.*'
    ], {
        base: 'archives'
    })
        .pipe(require('gulp-zip')('bibi-' + Version + '.zip'))
        .pipe(gulp.dest('archives'));
});

gulp.task('distribute', gulp.series(
    'clean: files',
    'clean: archive',
    'merge: files',
    'make: archive',
    'clean: files'
));