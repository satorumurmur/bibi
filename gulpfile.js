/*!
 *                                                                                                                                (℠)
 *  # gulpfile for BiB/i
 *
 */

'use strict';

//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Setting

//----------------------------------------------------------------------------------------------------------------------------------------------

const gulp = require('gulp'), S = {}, $ = {
    autoprefixer: require('autoprefixer'),
    bower:        require('bower'),
    browserSync:  require('browser-sync'),
    cssnano:      require('cssnano'),
    del:          require('del'),
    fs:           require('fs'),
    combineMQ:    require('gulp-combine-mq'),
    concat:       require('gulp-concat'),
    if:           require('gulp-if'),
    jsValidate:   require('gulp-jsvalidate'),
    notify:       require('gulp-notify'),
    plumber:      require('gulp-plumber'),
    postcss:      require('gulp-postcss'),
    rename:       require('gulp-rename'),
    replace:      require('gulp-replace'),
    sass:         require('gulp-sass'),
    sequence:     require('gulp-sequence'),
    //sourcemaps:   require('gulp-sourcemaps'),
    uglify:       require('gulp-uglify/composer')(require('uglify-es'), console),
    zip:          require('gulp-zip'),
    cssnext:      require('postcss-cssnext')
};

S.Extensions = [
    'analytics',
    'epubcfi',
    'share',
    'unaccessibilizer',
    'unzipper',
    'zine'
];

S.concat = function() {
    const list = arguments[0];
    for(let i = 1, l = arguments.length; i < l; i++) list = list.concat(arguments[i]);
    return list;
};

S.getVersionNumber = function() {
    return JSON.parse($.fs.readFileSync('package.json')).version;
};

S.getBuildNumber = function() {
    const Now = new Date();
    let BuildNumber = '';
    [
        Now.getYear() + 1900,
        Now.getMonth() + 1,
        Now.getDate(),
        Now.getHours(),
        Now.getMinutes()/*,
        Now.getSeconds()*/
    ].forEach(function(d) {
        BuildNumber += (d < 10 ? '0' : '') + d;
    });
    return BuildNumber;
};

S.task = function(TaskName, TaskOperation, ArrayToBeAdded) {
    gulp.task(TaskName, TaskOperation);
    if(ArrayToBeAdded && ArrayToBeAdded instanceof Array) ArrayToBeAdded.push(TaskName);
};

S.watch = function(FilesAndTasks) {
    Array.prototype.forEach.call(arguments, function(FilesAndTasks) {
        gulp.watch(FilesAndTasks[0], FilesAndTasks[1]);
    });
};

S.ForPlumber = { errorHandler: $.notify.onError('\n<%= error.toString() %>') };

S.TaskSets = {};  let _TaskSet = [];

S.DECO = [
    ['\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ ( ', ' )'],
    ['~~~~~~~~~~~~~~~~~~~~~~~~ ( ', ' )'],
    ['... ( ', ' )']
];

//S.MapDir = '.';




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Clean

//----------------------------------------------------------------------------------------------------------------------------------------------

S.clean = function(List) { $.del.sync(List); return gulp; };

S.Clean = {
    Metafiles: [
        'bib/LICENSE',
        'bib/README.md'
    ],
    Scripts: [
        'bib/i/res/scripts',
        'bib/i.js'
    ],
    Styles: [
        'bib/i/res/styles',
        'bib/i.css'
    ],
    Extensions: S.Extensions.map(function(ExtensionName) {
        return 'bib/i/extensions/' + ExtensionName;
    })
}

_TaskSet = S.TaskSets['clean: All'] = [];

for(let X in S.Clean) {
    const TaskName = 'clean: ' + X;
    S.task(TaskName, function() { return S.clean(S.Clean[X]); }, _TaskSet);
}




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Update Metafiles

//----------------------------------------------------------------------------------------------------------------------------------------------

_TaskSet = S.TaskSets['update: Metafiles'] = [];

S.task('update: JSONs', function() {
    return gulp.src([
        'bower.json'
    ])
        .pipe($.plumber(S.ForPlumber))
        .pipe($.replace(/"version"(\s*:\s*)".+?"/, '"version"$1"' + S.getVersionNumber() + '"'))
        .pipe(gulp.dest('.'));
}, _TaskSet);

S.task('update: Copies of Documents', function() {
    return gulp.src([
        'LICENSE',
        'README.md'
    ])
        .pipe($.plumber(S.ForPlumber))
        .pipe(gulp.dest('bib'));
}, _TaskSet);




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Update Bower Components

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('update: bower_components', function() {
    return $.bower.commands.install();
});

S.makeBowerComponents = function(Param) {
    if(!Param.replacement) Param.replacement = ['', ''];
    return gulp.src(Param.src, Param.srcOption)
        .pipe($.plumber(S.ForPlumber))
        .pipe($.concat(Param.dist))
        .pipe($.replace(Param.replacement[0], Param.replacement[1]))
        .pipe($.uglify({ output: { comments: /^!/ } }))
        .pipe(gulp.dest(Param.dest || '.'));
};

_TaskSet = S.TaskSets['update: Combined Bower Components'] = [];

S.BowerComponents = {
    'bibi': [
        'bower_components/native-promise-only/lib/npo.src.js',
        'bower_components/easing/easing.js',
        'bower_components/sML/sML.js'
    ],
    'unzipper': [
        'bower_components/jszip/dist/jszip.js',
        'bower_components/jszip-utils/dist/jszip-utils.js'
    ],
    'zine': [
        'bower_components/js-yaml/dist/js-yaml.js'
    ]
};

S.task('update: bower_components.js for bibi', function() {
    return S.makeBowerComponents({
        src: S.BowerComponents['bibi'],
        dist: 'dev-bib/i/res/scripts/_/bower_components.js',
        replacement: [/(\/\/ -+\n\/\/ easing\.js v[\d\.]+\n(\/\/ [^\n]+\n)+)/, '/*!\n$1*/']
    });
}, _TaskSet);

S.task('update: bower_components.js for unzipper', function() {
    return S.makeBowerComponents({
        src: S.BowerComponents['unzipper'],
        dist: 'dev-bib/i/extensions/unzipper/_/bower_components.js'
    });
}, _TaskSet);

S.task('update: bower_components.js for zine', function() {
    return S.makeBowerComponents({
        src: S.BowerComponents['zine'],
        dist: 'dev-bib/i/extensions/zine/_/bower_components.js',
        replacement: [/\/\*( *js-yaml *.+? *)\*\//, '/*!$1*/']
    });
}, _TaskSet);




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Make Scripts

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeScript = function(Param) {
    return gulp.src(Param.src, Param.srcOption)
        .pipe($.plumber(S.ForPlumber))
        //.pipe($.sourcemaps.init())
        .pipe($.jsValidate())
        .pipe($.concat(Param.dist))
        .pipe($.uglify({ output: { comments: /^!/ } }))
        .pipe($.replace(/["']____bibi-version____['"]/, '\'' + S.getVersionNumber() + '\''))
        .pipe($.replace(/["']____bibi-build____['"]/,  S.getBuildNumber()))
        //.pipe($.sourcemaps.write(S.MapDir))
        .pipe(gulp.dest(Param.dest || '.'))
        .pipe($.browserSync.reload({ stream: true }));
};


//----------------------------------------------------------------------------------------------------------------------------------------------
// - Bibi
//----------------------------------------------------------------------------------------------------------------------------------------------

_TaskSet = S.TaskSets['make: Bibi Scripts'] = [];

S.task('make: Bibi Script: bibi.js', function() {
    return S.makeScript({
        src: [
			'dev-bib/i/res/scripts/_/header.js',
			'dev-bib/i/res/scripts/_/bower_components.js',
			'dev-bib/i/res/scripts/bibi.heart.js'
        ],
        dist: 'bib/i/res/scripts/bibi.js'
    });
}, _TaskSet);

S.task('make: Bibi Script: bib/i.js', function() {
    return S.makeScript({
        src: [
            'dev-bib/i.js'
        ],
        dist: 'bib/i.js'
    });
}, _TaskSet);


//----------------------------------------------------------------------------------------------------------------------------------------------
// - Extension
//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeExtensionScript = function(ExtensionName) {
    const Sources = [
        'dev-bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.js'
    ];
    if(ExtensionName == 'unzipper') {
        Sources.unshift('dev-bib/i/extensions/unzipper/_/header.js');
        Sources.push(   'dev-bib/i/extensions/unzipper/_/bower_components.js');
    } else if(ExtensionName == 'zine') {
        Sources.unshift('dev-bib/i/extensions/zine/_/header.js');
        Sources.push(   'dev-bib/i/extensions/zine/_/bower_components.js');
    }
    return S.makeScript({
        src: Sources,
        dist: 'bib/i/extensions/' + ExtensionName + '/' + ExtensionName + '.js'
    });
};

_TaskSet = S.TaskSets['make: Extension Scripts'] = [];

S.Extensions.forEach(function(ExtensionName) {
    S.task('make: Extension Script: ' + ExtensionName + '.js', function() {
        return S.makeExtensionScript(ExtensionName);
    }, _TaskSet);
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Make Styles

//----------------------------------------------------------------------------------------------------------------------------------------------

S.makeStyle = function(Param) {
    return gulp.src(Param.src, Param.srcOption)
        .pipe($.plumber(S.ForPlumber))
        //.pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.postcss([
            $.cssnext({ warnForDuplicates: false }),
            $.autoprefixer({ grid: true })
        ]))
        .pipe($.combineMQ())
        .pipe($.concat(Param.dist))
        .pipe($.postcss([
            $.cssnano({ zindex: false })
        ]))
        .pipe($.replace(/([^\n])(\/\*!)/g, '$1\n$2'))
        .pipe($.replace(/( \*\/)([^\n])/g, '$1\n$2'))
        //.pipe($.sourcemaps.write(S.MapDir))
        .pipe(gulp.dest(Param.dest || '.'))
        .pipe($.browserSync.reload({ stream: true }));
};


//----------------------------------------------------------------------------------------------------------------------------------------------
// - Bibi
//----------------------------------------------------------------------------------------------------------------------------------------------

_TaskSet = S.TaskSets['make: Bibi Styles'] = [];

S.task('make: Bibi Style: bibi.css', function() {
    return S.makeStyle({
        src: [
            'dev-bib/i/res/styles/_/header.scss',
            'dev-bib/i/res/styles/bibi.heart.scss'
        ],
        dist: 'bib/i/res/styles/bibi.css'
    });
}, _TaskSet);

S.task('make: Bibi Style: bibi-default.css', function() {
    return S.makeStyle({
        src: [
            'dev-bib/i/res/styles/bibi-default.scss'
        ],
        dist: 'bib/i/res/styles/bibi-default.css'
    });
}, _TaskSet);

S.task('make: Bibi Style: bib/i.css', function() {
    return S.makeStyle({
        src: [
            'dev-bib/i.scss'
        ],
        dist: 'bib/i.css'
    });
}, _TaskSet);


//----------------------------------------------------------------------------------------------------------------------------------------------
// - Extension
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

_TaskSet = S.TaskSets['make: Extension Styles'] = [];

S.Extensions.forEach(function(ExtensionName) {
    S.task('make: Extension Style: ' + ExtensionName + '.css', function() {
        return S.makeExtensionStyle(ExtensionName);
    }, _TaskSet);
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = TaskSets

//----------------------------------------------------------------------------------------------------------------------------------------------

for(let X in S.TaskSets) gulp.task(S.DECO[2][0] + X + S.DECO[2][1], $.sequence(S.TaskSets[X]));




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Serve

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('serve', function() {
    $.browserSync({
        port: 61671,
        ui: {
            port: 61672
        },
        server: {
            baseDir: '.',
            index: 'index.html'
        },
        snippetOptions: {
            ignorePaths: 'bib/bookshelf/**/*.*'
        },
        ghostMode: false/*{
            clicks: true,
            scroll: true,
            location: true,
            forms: true
        }*/
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

// = Watch

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function() {
    S.watch([
        ['package.json'],
        ['update: JSONs']
    ], [
        ['LICENSE', 'README.md'],
        ['update: Copies of Documents']
    ], [
        ['bower.json'],
        ['update: bower_components']
    ], [
        S.BowerComponents['bibi'],
        ['update: bower_components.js for bibi']
    ], [
        S.BowerComponents['unzipper'],
        ['update: bower_components.js for unzipper']
    ], [
        S.BowerComponents['zine'],
        ['update: bower_components.js for zine']
    ], [
        ['dev-bib/i/res/scripts/**/*.js'],
        ['make: Bibi Script: bibi.js']
    ], [
        ['dev-bib/i/res/styles/**/*.scss'],
        ['make: Bibi Style: bibi.css', 'make: Bibi Style: bibi-default.css']
    ], [
        ['dev-bib/i.js'],
        ['make: Bibi Script: bib/i.js']
    ], [
        ['dev-bib/i.scss'],
        ['make: Bibi Style: bib/i.css']
    ]);
    S.Extensions.forEach(function(ExtensionName) { S.watch([
        ['dev-bib/i/extensions/' + ExtensionName + '/**/*.js'],
        ['make: Extension Script: ' + ExtensionName + '.js']
    ], [
        ['dev-bib/i/extensions/' + ExtensionName + '/**/*.scss'],
        ['make: Extension Style: ' + ExtensionName + '.css']
    ]); });
    return gulp;
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Update, Build, Default

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task(S.DECO[1][0] + 'UPDATE' + S.DECO[1][1], $.sequence(
    S.DECO[2][0] + 'update: Metafiles' + S.DECO[2][1],
    S.DECO[2][0] + 'update: Combined Bower Components' + S.DECO[2][1],
    [
        S.DECO[2][0] + 'make: Bibi Scripts' + S.DECO[2][1],
        S.DECO[2][0] + 'make: Extension Scripts' + S.DECO[2][1],
        S.DECO[2][0] + 'make: Bibi Styles' + S.DECO[2][1],
        S.DECO[2][0] + 'make: Extension Styles' + S.DECO[2][1]
    ]
));

gulp.task(S.DECO[0][0] + 'BUILD' + S.DECO[0][1], $.sequence(
    S.DECO[2][0] + 'clean: All' + S.DECO[2][1],
    S.DECO[1][0] + 'UPDATE' + S.DECO[1][1]
));

gulp.task('default', $.sequence(
    S.DECO[0][0] + 'BUILD' + S.DECO[0][1],
    [
        'serve',
        'watch'
    ]
));


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

// = Distribute

//----------------------------------------------------------------------------------------------------------------------------------------------

gulp.task('clean: Distribution Folder', function() {
    const Ver = S.getVersionNumber();
    return S.clean([
        'archives/bibi-' + Ver
    ]);
});

gulp.task('clean: Distribution Archive', function() {
    const Ver = S.getVersionNumber();
    return S.clean([
        'archives/bibi-' + Ver + '.zip'
    ]);
});

gulp.task('clean: Distribution', $.sequence(
    [
        'clean: Distribution Folder',
        'clean: Distribution Archive'
    ]
));

gulp.task('copy: Distribution', function() {
    const Ver = S.getVersionNumber();
    return gulp.src([
        'bib/i/**/*.*',
        'bib/*',
        '!**/*.map'
    ], {
        base: '.'
    })
        .pipe($.plumber(S.ForPlumber))
        .pipe(gulp.dest('archives/bibi-' + Ver));
});

gulp.task('archive: Distribution', function() {
    const Ver = S.getVersionNumber();
    return gulp.src([
        'archives/bibi-' + Ver + '/**/*',
        'archives/bibi-' + Ver + '/**/*.*'
    ], {
        base: 'archives'
    })
        .pipe($.plumber(S.ForPlumber))
        .pipe($.zip('bibi-' + Ver + '.zip'))
        .pipe(gulp.dest('archives'));
});

gulp.task('distribute', $.sequence(
    [
        S.DECO[0][0] + 'BUILD' + S.DECO[0][1],
        'clean: Distribution'
    ],
    'copy: Distribution',
    'archive: Distribution',
    'clean: Distribution Folder'
));
