//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Setting

//----------------------------------------------------------------------------------------------------------------------------------------------

var gulp = require('gulp'), S = {}, $ = {
    combineMq:       require("gulp-combine-mq"),
    concat:          require("gulp-concat"),
    if:              require("gulp-if"),
    notify:          require("gulp-notify"),
    plumber:         require("gulp-plumber"),
    postcss:         require("gulp-postcss"),
    rename:          require("gulp-rename"),
    replace:         require("gulp-replace"),
    sass:            require("gulp-sass"),
    uglify:          require("gulp-uglify"),
    zip:             require("gulp-zip"),
    merge:           require("merge-stream"),
    bower:           require("bower"),
    browserSync:     require("browser-sync"),
    cssnano:         require("cssnano"),
    del:             require("del"),
    fs:              require("fs"),
    postcss_cssnext: require("postcss-cssnext"),
    runSequence:     require("run-sequence")
};

S.Extensions = [
    "analytics",
    "epubcfi",
    "fontsize",
    "jatex",
    "overreflow",
    "share",
    "unaccessibilizer",
    "unzipper"
];

S.concat = function() {
    var list = arguments[0];
    for(var i = 1, l = arguments.length; i < l; i++) list = list.concat(arguments[i]);
    return list;
};

S.getVersion = function() {
    return JSON.parse($.fs.readFileSync('package.json')).version;
};

S.getBuildNumber = function() {
    var now = "", date = new Date();
    [
        date.getYear() + 1900,
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes()/*,
        date.getSeconds()*/
    ].forEach(function(d) {
        now += (d < 10 ? "0" : "") + d;
    });
    return now;
};


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Clean

//----------------------------------------------------------------------------------------------------------------------------------------------

S.clean = function(list) {
    $.del.sync(list);
    return gulp;
};

gulp.task('clean: Scripts', function() {
    return S.clean(ToBeCleaned.Scripts);
});

gulp.task('clean: Styles', function() {
    return S.clean(ToBeCleaned.Styles);
});

gulp.task('clean: Metafiles', function() {
    return S.clean(ToBeCleaned.Metafiles);
});

gulp.task('clean: All', function() {
    return S.clean(ToBeCleaned.All);
});

var ToBeCleaned = {
    Scripts: [
        'bib/i/res/scripts',
        'bib/i.js'
    ],
    Styles: [
        'bib/i/res/styles',
        'bib/i.css'
    ],
    Metafiles: [
        'bib/LICENSE',
        'bib/README.md'
    ]
};

S.Extensions.forEach(function(Extension) {
    ToBeCleaned.Scripts.push('bib/i/extensions/' + Extension);
});

ToBeCleaned.All = S.concat(ToBeCleaned.Scripts, ToBeCleaned.Styles, ToBeCleaned.Metafiles);


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Update Metafiles

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update: JSONs', function() {
    return gulp.src([
        'bower.json'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.replace(/"version"(\s*:\s*)".+?"/, '"version"$1"' + S.getVersion() + '"'))
        .pipe(gulp.dest(''));
});

gulp.task('update: README.md', function() {
    return gulp.src([
        'README.md'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('bib'));
});

gulp.task('update: LICENSE', function() {
    return gulp.src([
        'LICENSE'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('bib'));
});

var Tasks_updateMetafiles = [
    'update: JSONs',
    'update: README.md',
    'update: LICENSE'
];


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Update Bower Components

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update: bower_components', function() {
    return $.bower.commands.install();
});

S.makeBowerComponents = function(Param) {
    if(!Param.replace) Param.replace = ["", ""];
    return gulp.src(Param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat(Param.dist))
        .pipe($.replace(Param.replace[0], Param.replace[1]))
        .pipe($.uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest(''));
};

gulp.task('update: bower_components.js for bibi', function() {
    return S.makeBowerComponents({
        src: [
            'bower_components/native-promise-only/lib/npo.src.js',
            'bower_components/easing/easing.js',
            'bower_components/sML/sML.js'
        ],
        dist: 'dev-bib/i/res/scripts/_lib/bower_components.js',
        replace: [/(\/\/ -+\n\/\/ easing\.js v[\d\.]+\n(\/\/ [^\n]+\n)+)/, '/*!\n$1*/\n']
    });
});

gulp.task('update: bower_components.js for unzipper', function() {
    return S.makeBowerComponents({
        src: [
            'bower_components/jszip/dist/jszip.js',
            'bower_components/jszip-utils/dist/jszip-utils.js'
        ],
        dist: 'dev-bib/i/extensions/unzipper/_lib/bower_components.js'
    });
});

var Tasks_updateBowerComponents = [
    'update: bower_components.js for bibi',
    'update: bower_components.js for unzipper'
];


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Scripts

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeScript = function(Param) {
    return gulp.src(Param.src)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat(Param.dist))
        .pipe($.uglify({ preserveComments: 'some' }))
        .pipe($.replace('0.000.0', S.getVersion()))
        .pipe($.replace('198106091234', S.getBuildNumber()))
        .pipe($.replace(/(.)(\/\*!)/g, '$1\n$2'))
        .pipe($.replace(/(\*\/)(.)/g, '$1\n$2'))
        .pipe(gulp.dest(''))
        .pipe($.browserSync.reload({ stream: true }));
};

gulp.task('make: bibi.js', function() {
    return S.makeScript({
        src: [
			'dev-bib/i/res/scripts/_banner.js',
			'dev-bib/i/res/scripts/_lib/bower_components.js',
			'dev-bib/i/res/scripts/bibi.heart.js'
        ],
        dist: 'bib/i/res/scripts/bibi.js'
    });
});

gulp.task('make: i.js', function() {
    return S.makeScript({
        src: [
            'dev-bib/i.js'
        ],
        dist: 'bib/i.js'
    });
});

var Tasks_makeScripts = [
    'make: bibi.js',
    'make: i.js'
];


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Extension Scripts

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeExtensionScript = function(ExtensionName) {
    var Sources = [
        'dev-bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.js'
    ];
    if(ExtensionName == "unzipper") {
        Sources.unshift('dev-bib/i/extensions/unzipper/_banner.js');
        Sources.push(   'dev-bib/i/extensions/unzipper/_lib/bower_components.js');
    }
    return S.makeScript({
        src: Sources,
        dist: 'bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.js'
    });
};

var Tasks_makeExtensionScripts = [];

S.Extensions.forEach(function(ExtensionName) {
    gulp.task('make: extension: ' + ExtensionName + '.js', function() {
        return S.makeExtensionScript(ExtensionName);
    });
    Tasks_makeExtensionScripts.push('make: extension: ' + ExtensionName + '.js');
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Styles

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeStyle = function(Param) {
    return $.merge(
        gulp.src(Param.header),
        gulp.src(Param.src)
    )
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.sass())
        .pipe($.combineMq())
        .pipe($.concat(Param.dist))
        .pipe($.postcss([
            $.postcss_cssnext({
                browsers: 'last 2 versions',
                warnForDuplicates: false
            }),
            $.cssnano({
                zindex: false
            })
        ]))
        .pipe($.replace(/(.)(\/\*!)/g, '$1\n$2'))
        .pipe($.replace(/(\*\/)(.)/g, '$1\n$2'))
        .pipe(gulp.dest(''))
        .pipe($.browserSync.reload({ stream: true }));
};

gulp.task('make: bibi.css', function() {
    return S.makeStyle({
        header: [
            'dev-bib/i/res/styles/-header.scss'
        ],
        src: [
            'dev-bib/i/res/styles/bibi.heart.scss'
        ],
        dist: 'bib/i/res/styles/bibi.css'
    });
});

gulp.task('make: i.css', function() {
    return S.makeStyle({
        header: [
        ],
        src: [
            'dev-bib/i.scss'
        ],
        dist: 'bib/i.css'
    });
});

var Tasks_makeStyles = [
    'make: bibi.css',
    'make: i.css'
];


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Make Extension Styles

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeExtensionStyle = function(ExtensionName) {
    return S.makeStyle({
        header: [
            'dev-bib/i/extensions/' + ExtensionName + '/-header.scss'
        ],
        src: [
            'dev-bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.scss'
        ],
        dist: 'bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.css'
    });
};

var Tasks_makeExtensionStyles = [];

S.Extensions.forEach(function(ExtensionName) {
    gulp.task('make: extension: ' + ExtensionName + '.css', function() {
        return S.makeExtensionStyle(ExtensionName);
    });
    Tasks_makeExtensionStyles.push('make: extension: ' + ExtensionName + '.css');
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Serve

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('serve', function() {
    $.browserSync({
        server: {
            baseDir: '',
            index: 'index.html'
        },
        ghostMode: {
            location: true
        }
    });
    return gulp.watch([
        'bib/i/index.html',
        'bib/i/presets/*.js',
        'bib/i/res/scripts/*.js',
        'bib/i/extensions/**/*.js'
    ]).on('change', $.browserSync.reload);
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Watch

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    gulp.watch(['package.json'], ['update: JSONs']);
    gulp.watch(['README.md'], ['update: README.md']);
    gulp.watch(['LICENSE'], ['update: LICENSE']);
    gulp.watch(['bower.json'], ['update: bower_components']);
    gulp.watch(['bower_components/**/*.js'], Tasks_updateBowerComponents);
    gulp.watch(['dev-bib/i/res/scripts/**/*.js'], ['make: bibi.js']);
    gulp.watch(['dev-bib/i.js'], ['make: i.js']);
    gulp.watch(['dev-bib/i/res/styles/*.scss',], ['make: bibi.css']);
    gulp.watch(['dev-bib/i.scss'], ['make: i.css']);
    S.Extensions.forEach(function(ExtensionName) { gulp.watch(['dev-bib/i/extensions/' + ExtensionName + '/**/*.js'  ], ['make: extension: ' + ExtensionName + '.js' ]); });
    S.Extensions.forEach(function(ExtensionName) { gulp.watch(['dev-bib/i/extensions/' + ExtensionName + '/**/*.scss'], ['make: extension: ' + ExtensionName + '.css']); });
    return gulp;
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Update, Build, Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update', function() {
    return $.runSequence(
        Tasks_updateMetafiles,
        Tasks_updateBowerComponents,
        S.concat(Tasks_makeScripts, Tasks_makeStyles, Tasks_makeExtensionScripts, Tasks_makeExtensionStyles)
    );
});

gulp.task('build', function() {
    return $.runSequence(
        'clean: All',
        Tasks_updateMetafiles,
        Tasks_updateBowerComponents,
        S.concat(Tasks_makeScripts, Tasks_makeStyles, Tasks_makeExtensionScripts, Tasks_makeExtensionStyles)
    );
});

gulp.task('default', function() {
    return $.runSequence(
        'clean: All',
        Tasks_updateMetafiles,
        Tasks_updateBowerComponents,
        S.concat(Tasks_makeScripts, Tasks_makeStyles, Tasks_makeExtensionScripts, Tasks_makeExtensionStyles),
        'serve',
        'watch'
    );
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Distribute

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('clean: Distribution Folder', function() {
    var Ver = S.getVersion();
    return S.clean([
        'archives/bibi-' + Ver
    ]);
});

gulp.task('clean: Distribution Archive', function() {
    var Ver = S.getVersion();
    return S.clean([
        'archives/bibi-' + Ver + '.zip'
    ]);
});

gulp.task('clean: Distribution', function() {
    return $.runSequence([
        'clean: Distribution Folder',
        'clean: Distribution Archive'
    ]);
});

gulp.task('copy: Distribution', function() {
    var Ver = S.getVersion();
    return gulp.src([
        'bib/i/**/*.*',
        'bib/*'
    ], {
        base: './'
    })
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest('archives/bibi-' + Ver));
});

gulp.task('archive: Distribution', function() {
    var Ver = S.getVersion();
    return gulp.src([
        'archives/bibi-' + Ver + '/**/*',
        'archives/bibi-' + Ver + '/**/*.*'
    ], {
        base: 'archives'
    })
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.zip('bibi-' + Ver + '.zip'))
        .pipe(gulp.dest('archives'));
});

gulp.task('distribute', function() {
    return $.runSequence(
        'clean: All',
        Tasks_updateMetafiles,
        Tasks_updateBowerComponents,
        S.concat(Tasks_makeScripts, Tasks_makeStyles, Tasks_makeExtensionScripts, Tasks_makeExtensionStyles),
        'clean: Distribution',
        'copy: Distribution',
        'archive: Distribution',
        'clean: Distribution Folder'
    );
});
