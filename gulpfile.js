//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Setting

//----------------------------------------------------------------------------------------------------------------------------------------------

var gulp = require('gulp');

var $ = require("gulp-load-plugins")();
$.del = require("del");
$.runSequence = require("run-sequence");
$.browserSync = require("browser-sync");

var reload = false;



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Clean

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('clean', function() {
    $.del([
        './bib/i/res/scripts',
        './bib/i/res/styles',
        './bib/i/extensions/analytics',
        './bib/i/extensions/cplus',
        './bib/i/extensions/epubcfi',
        './bib/i/extensions/jatex',
        './bib/i/extensions/overreflow',
        './bib/i/extensions/unzipper',
        './bib/i.js',
        './bib/i.css'
    ]);
    return gulp;
});



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Style

//----------------------------------------------------------------------------------------------------------------------------------------------

make_style = function(param) {
    var g = gulp.src(param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.sass())
        .pipe($.combineMq())
        .pipe($.cssnext({
            browsers: 'last 2 versions',
            features:{
                customProperties: false,
                calc: false,
                customMedia: false,
                mediaQueriesRange: false
            },
            compress: true,
            sourcemap: false
        }))
        .pipe(gulp.dest(param.dist.dir));
    return reload ? g.pipe($.browserSync.reload({
            stream: true
        })) : g;
};

gulp.task('make_style_bibi', function() {
    return make_style({
        src: [
            './dev-bib/i/res/styles/bibi.scss'
        ],
        dist: {
            dir: './bib/i/res/styles'
        }
    });
});

gulp.task('make_style_pipi', function() {
    return make_style({
        src: [
            './dev-bib/i.scss'
        ],
        dist: {
            dir: './bib'
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Script

//----------------------------------------------------------------------------------------------------------------------------------------------

make_script = function(param) {
    var g = gulp.src(param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat(param.dist.name))
        .pipe($.uglify({
            preserveComments: 'some'
         }))
        .pipe(gulp.dest(param.dist.dir));
    return reload ? g.pipe($.browserSync.reload({
            stream: true
        })) : g;
};

gulp.task('make_script_bibi', function() {
    return make_script({
        src: [
			'./dev-bib/i/res/scripts/_banner.js',
			'./bower_components/native-promise-only/lib/npo.src.js',
			'./bower_components/easing/easing-min.js',
			'./bower_components/sML/sML.js',
			'./dev-bib/i/res/scripts/bibi.core.js'
        ],
        dist: {
            dir: './bib/i/res/scripts',
            name: 'bibi.js'
        }
    });
});

gulp.task('make_script_pipi', function() {
    return make_script({
        src: [
            './dev-bib/i.js'
        ],
        dist: {
            dir: './bib',
            name: 'i.js'
        }
    });
});

gulp.task('make_script_extension_analytics', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/analytics/analytics.js'
        ],
        dist: {
            dir: './bib/i/extensions/analytics',
            name: 'analytics.js'
        }
    });
});

gulp.task('make_script_extension_cplus', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/cplus/_banner.js',
			'./dev-bib/i/extensions/cplus/cplus_viewmenu.js',
			'./dev-bib/i/extensions/cplus/cplus_arrows.js',
			'./dev-bib/i/extensions/cplus/cplus_keys.js'
        ],
        dist: {
            dir: './bib/i/extensions/cplus',
            name: 'cplus.js'
        }
    });
});

gulp.task('make_script_extension_epubcfi', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/epubcfi/epubcfi.js'
        ],
        dist: {
            dir: './bib/i/extensions/epubcfi',
            name: 'epubcfi.js'
        }
    });
});

gulp.task('make_script_extension_jatex', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/jatex/jatex.js'
        ],
        dist: {
            dir: './bib/i/extensions/jatex',
            name: 'jatex.js'
        }
    });
});

gulp.task('make_script_extension_overreflow', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/overreflow/overreflow.js'
        ],
        dist: {
            dir: './bib/i/extensions/overreflow',
            name: 'overreflow.js'
        }
    });
});

gulp.task('make_script_extension_unzipper', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/unzipper/_banner.js',
			'./dev-bib/i/extensions/unzipper/unzipper.js',
			'./dev-bib/i/extensions/unzipper/_lib/jszip.min.js',
			'./dev-bib/i/extensions/unzipper/_lib/base64.js'
        ],
        dist: {
            dir: './bib/i/extensions/unzipper',
            name: 'unzipper.js'
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('make', [
    'make_style_bibi',
    'make_style_pipi',
    'make_script_bibi',
    'make_script_pipi',
    'make_script_extension_analytics',
    'make_script_extension_cplus',
    'make_script_extension_unzipper',
    'make_script_extension_epubcfi',
    'make_script_extension_jatex',
    'make_script_extension_overreflow'
]);




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('build', function() {
    $.runSequence(
        'clean',
        'make'
    );
    return;
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Watch

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    reload = true;
    gulp.watch([
        './dev-bib/i/res/styles/_lib/*.scss',
        './dev-bib/i/res/styles/_+(common|bibi)-*.scss',
        './dev-bib/i/res/styles/bibi.scss'
    ], ['make_style_bibi']);
    gulp.watch([
        './dev-bib/i/res/styles/_lib/*.scss',
        './dev-bib/i/res/styles/_+(common|pipi)-*.scss',
        './dev-bib/i.scss'
    ], ['make_style_pipi']);
    gulp.watch([
        './dev-bib/i/res/scripts/**/*.js'
    ], ['make_script_bibi']);
    gulp.watch([
        './dev-bib/i.js'
    ], ['make_script_pipi']);
    gulp.watch([
        './dev-bib/i/extensions/analytics/**/*.js'
    ], ['make_script_extension_analytics']);
    gulp.watch([
        './dev-bib/i/extensions/cplus/**/*.js'
    ], ['make_script_extension_cplus']);
    gulp.watch([
        './dev-bib/i/extensions/epubcfi/**/*.js'
    ], ['make_script_extension_epubcfi']);
    gulp.watch([
        './dev-bib/i/extensions/jatex/**/*.js'
    ], ['make_script_extension_jatex']);
    gulp.watch([
        './dev-bib/i/extensions/overreflow/**/*.js'
    ], ['make_script_extension_overreflow']);
    gulp.watch([
        './dev-bib/i/extensions/unzipper/**/*.js'
    ], ['make_script_extension_unzipper']);
    gulp.watch([
        './bib/**/*.html',
        './bib/i/presets/*.js'
    ]).on('change', $.browserSync.reload);
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Sync

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('sync', function() {
    $.runSequence(
        'build',
        'watch'
    );
    $.browserSync({
        server: {
            baseDir: './'
        },
        ghostMode: {
            location: true
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('default', ['sync']);



