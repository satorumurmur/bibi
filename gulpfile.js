//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Setting

//----------------------------------------------------------------------------------------------------------------------------------------------

var gulp = require('gulp');

var $ = require("gulp-load-plugins")();
$.fs = require("fs");
$.del = require("del");
$.runSequence = require("run-sequence");
$.browserSync = require("browser-sync");

var reload = false;

concat_list = function() {
    var list = arguments[0];
    for(var i = 1, l = arguments.length; i < l; i++) list = list.concat(arguments[i]);
    return list;
};

getVersion = function() {
    return JSON.parse($.fs.readFileSync('./package.json')).version;
};

getNow = function() {
    var now = "", date = new Date();
    [
        date.getYear() + 1900,
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()
    ].forEach(function(d) {
        now += (d < 10 ? "0" : "") + d;
    });
    return now;
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Clean

//----------------------------------------------------------------------------------------------------------------------------------------------

clean = function(list) {
    $.del.sync(list);
    return gulp;
};

gulp.task('clean_styles', function() {
    return clean([
        './bib/i/res/styles',
        './bib/i.css'
    ]);
});

gulp.task('clean_scripts', function() {
    return clean([
        './bib/i/res/scripts',
        './bib/i/extensions/analytics',
        './bib/i/extensions/epubcfi',
        './bib/i/extensions/jatex',
        './bib/i/extensions/overreflow',
        './bib/i/extensions/share',
        './bib/i/extensions/unzipper',
        './bib/i.js'
    ]);
});

gulp.task('clean_metafiles', function() {
    return clean([
        './bib/LICENSE',
        './bib/README.md'
    ]);
});

gulp.task('clean_distribution', function() {
    return clean([
        './archives/bibi-' + getVersion(),
        './archives/bibi-' + getVersion() + '.zip'
    ]);
});



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Styles

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

//-- Make Scripts

//----------------------------------------------------------------------------------------------------------------------------------------------

make_script = function(param) {
    var g = gulp.src(param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat(param.dist.name))
        .pipe($.uglify({
            preserveComments: 'some'
         }))
        .pipe($.replace('0.000.0', getVersion()))
        .pipe($.replace('198106091234', getNow()))
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
			'./bower_components/hammerjs/hammer.js',
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

gulp.task('make_script_extension_share', function() {
    return make_script({
        src: [
			'./dev-bib/i/extensions/share/share.js'
        ],
        dist: {
            dir: './bib/i/extensions/share',
            name: 'share.js'
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

//-- Update Metafiles

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update_metafile_json', function() {
    return gulp.src([
        './bower.json',
        './bib/manifest.json'
    ], {
        base: './'
    })
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.replace(/"version"(\s*:\s*)".+?"/, '"version"$1"' + getVersion() + '"'))
        .pipe(gulp.dest('./'));
});

gulp.task('update_metafile_readme', function() {
    return gulp.src([
        './README.md'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('./bib'));
});

gulp.task('update_metafile_license', function() {
    return gulp.src([
        './LICENSE'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('./bib'));
});



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Watch

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    reload = true;
    gulp.watch([
        './dev-bib/i/res/styles/*.scss',
    ], ['make_style_bibi']);
    gulp.watch([
        './dev-bib/i.scss'
    ], ['make_style_pipi']);
    gulp.watch([
        './package.json',
        './bower_components/native-promise-only/lib/npo.src.js',
        './bower_components/hammerjs/hammer.js',
        './bower_components/easing/easing-min.js',
        './bower_components/sML/sML.js',
        './dev-bib/i/res/scripts/**/*.js'
    ], ['make_script_bibi']);
    gulp.watch([
        './dev-bib/i.js'
    ], ['make_script_pipi']);
    gulp.watch([
        './dev-bib/i/extensions/analytics/**/*.js'
    ], ['make_script_extension_analytics']);
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
        './dev-bib/i/extensions/share/**/*.js'
    ], ['make_script_extension_share']);
    gulp.watch([
        './dev-bib/i/extensions/unzipper/**/*.js'
    ], ['make_script_extension_unzipper']);
    gulp.watch([
        './package.json'
    ], ['update_metafile_json']);
    gulp.watch([
        './README.md'
    ], ['update_metafile_readme']);
    gulp.watch([
        './LICENSE'
    ], ['update_metafile_license']);
    return gulp;
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Serve

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('serve', function() {
    $.browserSync({
        server: {
            baseDir: './',
            index: 'index.html'
        },
        ghostMode: {
            location: true
        }
    });
    return gulp.watch([
        './bib/i/index.html',
        './bib/i/presets/*.js',
        './bib/i/res/scripts/*.js',
        './bib/i/extensions/**/*.js'
    ]).on('change', $.browserSync.reload);
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build

//----------------------------------------------------------------------------------------------------------------------------------------------

var make_styles_tasks = [
    'make_style_bibi',
    'make_style_pipi'
];

var make_scripts_tasks = [
    'make_script_bibi',
    'make_script_pipi',
    'make_script_extension_analytics',
    'make_script_extension_epubcfi',
    'make_script_extension_jatex',
    'make_script_extension_overreflow',
    'make_script_extension_share',
    'make_script_extension_unzipper'
];

var make_metafiles_tasks = [
    'update_metafile_json',
    'update_metafile_readme',
    'update_metafile_license'
];

gulp.task('build_styles', function() {
    return $.runSequence(
        'clean_styles',
        make_styles_tasks
    );
});

gulp.task('build_scripts', function() {
    return $.runSequence(
        'clean_scripts',
        make_scripts_tasks
    );
});

gulp.task('build_metafiles', function() {
    return $.runSequence(
        'clean_metafiles',
        make_metafiles_tasks
    );
});

gulp.task('build', function() {
    return $.runSequence(
        ['clean_metafiles', 'clean_styles', 'clean_scripts'],
        concat_list(make_metafiles_tasks, make_styles_tasks, make_scripts_tasks)
    );
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Distribution

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('make_distribution_copy', function() {
    return gulp.src([
        './bib/i/**/*.*',
        './bib/*'
    ], {
        base: './'
    })
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('./archives/bibi-' + getVersion()));
});

gulp.task('make_distribution_zip', function() {
    var version = getVersion();
    return gulp.src([
        './archives/bibi-' + version + '/bib/**/*.*',
        './archives/bibi-' + version + '/bib/*'
    ], {
        base: './archives'
    })
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.zip('bibi-' + version + '.zip'))
        .pipe(gulp.dest('./archives'));
});

gulp.task('make_distribution', function() {
    return $.runSequence(
        'make_distribution_copy',
        'make_distribution_zip'
    );
});

gulp.task('distribute', function() {
    return $.runSequence(
        'clean_distribution',
        'make_distribution'
    );
});



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('default', function() {
    return $.runSequence(
        ['clean_metafiles', 'clean_styles', 'clean_scripts'],
        concat_list(make_metafiles_tasks, make_styles_tasks, make_scripts_tasks),
        'watch',
        'serve'
    );
});



