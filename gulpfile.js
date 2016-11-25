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

S.Extensions = ["analytics", "epubcfi", "jatex", "overreflow", "share", "unzipper"];

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
        'bib/i/extensions/analytics',
        'bib/i/extensions/epubcfi',
        'bib/i/extensions/jatex',
        'bib/i/extensions/overreflow',
        'bib/i/extensions/share',
        'bib/i/extensions/unzipper',
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

ToBeCleaned.All = S.concat(ToBeCleaned.Scripts, ToBeCleaned.Styles, ToBeCleaned.Metafiles);


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Update Metafiles

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update: JSONs', function() {
    return gulp.src([
        'bower.json',
        'bib/manifest.json'
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

S.update_bower_components_js = function() {
    return gulp.src([
        'bower_components/native-promise-only/lib/npo.src.js',
        'bower_components/hammerjs/hammer.min.js',
        'bower_components/easing/easing-min.js',
        'bower_components/sML/sML.js'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.concat('dev-bib/i/res/scripts/_lib/bower_components.js'))
        .pipe($.uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest(''));
};

gulp.task('update: bower_components', function() {
    return $.bower.commands.install().on('end', S.update_bower_components_js);
});

gulp.task('update: bower_components.js', function() {
    return S.update_bower_components_js();
});


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
        Sources.push(   'dev-bib/i/extensions/unzipper/_lib/jszip.min.js');
        Sources.push(   'dev-bib/i/extensions/unzipper/_lib/base64.js');
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
            $.cssnano()
        ]))
        .pipe(gulp.dest(''))
        .pipe($.browserSync.reload({ stream: true }));
};

gulp.task('make: bibi.css', function() {
    return S.makeStyle({
        header: [
            'dev-bib/i/res/styles/-header.scss'
        ],
        src: [
            'dev-bib/i/res/styles/bibi.scss'
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
    gulp.watch(['dev-bib/i/res/scripts/**/*.js'], ['make: bibi.js']);
    gulp.watch(['dev-bib/i.js'], ['make: i.js']);
    S.Extensions.forEach(function(ExtensionName) {
        gulp.watch(['dev-bib/i/extensions/' + ExtensionName + '/**/*.js'], ['make: extension: ' + ExtensionName + '.js']);
    });
    gulp.watch(['dev-bib/i/res/styles/*.scss',], ['make: bibi.css']);
    gulp.watch(['dev-bib/i.scss'], ['make: i.css']);
    gulp.watch(['package.json'], ['update: JSONs']);
    gulp.watch(['README.md'], ['update: README.md']);
    gulp.watch(['LICENSE'], ['update: LICENSE']);
    gulp.watch(['bower.json'], ['update: bower_components']);
    return gulp;
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Build, Update, Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('build', function() {
    return $.runSequence(
        ['clean: All'],
        Tasks_updateMetafiles,
        ['update: bower_components.js'],
        S.concat(Tasks_makeScripts, Tasks_makeExtensionScripts, Tasks_makeStyles)
    );
});

gulp.task('update', function() {
    return $.runSequence(
        Tasks_updateMetafiles,
        ['update: bower_components.js'],
        S.concat(Tasks_makeScripts, Tasks_makeExtensionScripts, Tasks_makeStyles)
    );
});

gulp.task('default', function() {
    return $.runSequence(
        ['clean: All'],
        Tasks_updateMetafiles,
        ['update: bower_components.js'],
        S.concat(Tasks_makeScripts, Tasks_makeExtensionScripts, Tasks_makeStyles),
        ['serve', 'watch']
    );
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Distribute

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('clean: Distribution', function() {
    var Ver = S.getVersion();
    return S.clean([
        'archives/bibi-' + Ver,
        'archives/bibi-' + Ver + '.zip'
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
        'archives/bibi-' + Ver + '/bib/**/*.*',
        'archives/bibi-' + Ver + '/bib/*'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.zip('bibi-' + Ver + '.zip'))
        .pipe(gulp.dest('archives'));
});

gulp.task('distribute', function() {
    return $.runSequence(
        ['clean: All'],
        Tasks_updateMetafiles,
        ['update: bower_components.js'],
        S.concat(Tasks_makeScripts, Tasks_makeExtensionScripts, Tasks_makeStyles),
        'clean: Distribution',
        'copy: Distribution',
        'archive: Distribution'
    );
});
