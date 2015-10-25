var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
$.del         = require("del");
$.browserSync = require("browser-sync");
$.runSequence = require("run-sequence");

// --------------------------------------------------------------------------------

var DEV = './dev-bib';
var DIST = './bib';




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Browser Sync

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('browser-sync', function() {
    $.browserSync({
        server: {
            baseDir: "./"
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Clean

//----------------------------------------------------------------------------------------------------------------------------------------------

clean = function(files) {
    $.del(files, {
        force: true
    });
    return;
};

gulp.task('clean', function() {
    clean([
        DIST + '/i/res/scripts/bibi.js',
        DIST + '/i/res/styles/bibi.css',
        DIST + '/i/extensions/*',
        DIST + '/i.js',
        DIST + '/i.css'
    ]);
    return;
});



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build Style

//----------------------------------------------------------------------------------------------------------------------------------------------

build_style = function(param) {
    return gulp.src(param.src)
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
};

gulp.task('build_style_bibi', function() {
    return build_style({
        src: [
            DEV + '/i/res/styles/bibi.scss'
        ],
        dist: {
            dir: DIST + '/i/res/styles'
        }
    });
});

gulp.task('build_style_pipi', function() {
    return build_style({
        src: [
            DEV + '/i.scss'
        ],
        dist: {
            dir: DIST
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build Script

//----------------------------------------------------------------------------------------------------------------------------------------------

build_script = function(param) {
    return gulp.src(param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat(param.dist.name))
        .pipe($.uglify({
            preserveComments: 'some'
         }))
        .pipe(gulp.dest(param.dist.dir));
};

gulp.task('build_script_bibi', function() {
    return build_script({
        src: [
			DEV + '/i/res/scripts/_banner.js',
			DEV + '/i/res/scripts/_lib/npo.src.js',
			DEV + '/i/res/scripts/_lib/easing.js',
			DEV + '/i/res/scripts/_lib/sML.js',
			DEV + '/i/res/scripts/bibi.core.js'
        ],
        dist: {
            dir: DIST + '/i/res/scripts',
            name: 'bibi.js'
        }
    });
});

gulp.task('build_script_pipi', function() {
    return build_script({
        src: [
            DEV + '/i.js'
        ],
        dist: {
            dir: DIST,
            name: 'i.js'
        }
    });
});

gulp.task('build_script_extension_cplus', function() {
    return build_script({
        src: [
			DEV + '/i/extensions/cplus/_banner.js',
			DEV + '/i/extensions/cplus/cplus.viewmenu.js',
			DEV + '/i/extensions/cplus/cplus.fullscreen.js',
			DEV + '/i/extensions/cplus/cplus.arrows.js',
			DEV + '/i/extensions/cplus/cplus.keys.js',
			DEV + '/i/extensions/cplus/cplus.messages.js'
        ],
        dist: {
            dir: DIST + '/i/extensions/cplus',
            name: 'cplus.js'
        }
    });
});

gulp.task('build_script_extension_unzipper', function() {
    return build_script({
        src: [
			DEV + '/i/extensions/unzipper/_banner.js',
			DEV + '/i/extensions/unzipper/unzipper.js',
			DEV + '/i/extensions/unzipper/_lib/jszip.min.js',
			DEV + '/i/extensions/unzipper/_lib/base64.js'
        ],
        dist: {
            dir: DIST + '/i/extensions/unzipper',
            name: 'unzipper.js'
        }
    });
});

gulp.task('build_script_extension_epubcfi', function() {
    return build_script({
        src: [
			DEV + '/i/extensions/epubcfi/epubcfi.js'
        ],
        dist: {
            dir: DIST + '/i/extensions/epubcfi',
            name: 'epubcfi.js'
        }
    });
});

gulp.task('build_script_extension_jatex', function() {
    return build_script({
        src: [
			DEV + '/i/extensions/jatex/jatex.js'
        ],
        dist: {
            dir: DIST + '/i/extensions/jatex',
            name: 'jatex.js'
        }
    });
});

gulp.task('build_script_extension_overreflow', function() {
    return build_script({
        src: [
			DEV + '/i/extensions/overreflow/overreflow.js'
        ],
        dist: {
            dir: DIST + '/i/extensions/overreflow',
            name: 'overreflow.js'
        }
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('build', function() {
    $.runSequence(
        'clean',
        [
            'build_style_bibi',
            'build_style_pipi',
            'build_script_bibi',
            'build_script_pipi',
            'build_script_extension_cplus',
            'build_script_extension_unzipper',
            'build_script_extension_epubcfi',
            'build_script_extension_jatex',
            'build_script_extension_overreflow'
        ]
    );
    return;
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('default', ['build']);



