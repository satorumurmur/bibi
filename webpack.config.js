'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Webpack Config for Bibi                                                                                                                                                               (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Package = require('./package.json');
const Bibi = require('./bibi.recipe.js');

const Webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const Path = require('path'), resolvePath = (...Ps) => Path.resolve(__dirname, Ps.join('/'));
const _ = require('lodash');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Configs = {
    'development': {
        mode: 'development',
        stats: 'errors-warnings',
        devtool: 'inline-source-map'
    },
    'production': {
        mode: 'production',
        stats: 'normal'
    }
};

const CommonConfig = {
    performance: { maxEntrypointSize: 1000000, maxAssetSize: 1000000, hints: false  },
    output: { path: resolvePath(Bibi.DIST), filename: '[name].js' },
    module: { rules: [] },
    optimization: { minimizer: [] },
    plugins: [],
    entryTree: {
        [Bibi.SRC]: {
            'bibi': {
                'and':
                    'jo.js',
                'extensions': [
                    'analytics.js',
                    { 'extractor': [
                        'at-once.js',
                        'on-the-fly.js'
                    ] },
                    'lamp.js',
                    'sanitizer.js',
                    'unaccessibilizer.js',
                    'zine.js'
                ],
                'resources': {
                    'scripts': [
                        'bibi.js',
                        { 'polyfills': [
                            'bundle.js',
                            'encoding.js',
                            'intersection-observer.js'
                        ] }
                    ],
                    'styles':
                        'bibi.css'
                },
                'wardrobe': Bibi.Dresses['custom-made'].map(DressName => (
                    { [DressName]:
                        'bibi.dress.css'
                    }
                ))
            },
            'bibi-demo': {
                'embedding':
                    'index.css'
            }
        }
    },
    copyTree: {
        [Bibi.SRC]: {
            'bibi': [
                '*.html',
                'extensions/extractor/on-the-fly.bibi-zip-loader.worker.*',
                'presets/**'
            ],
            'bibi-bookshelf':
                '__samples/**/*.epub',
            'bibi-demo':
                '**/*.html'
        },
        '.': [
            'LICENSE',
            'README.md'
        ]
    }
};

Object.keys(Configs).forEach(Name => Object.assign(Configs[Name], _.cloneDeep(CommonConfig)));

// =============================================================================================================================

const addRule      = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].module.rules           .push(...ToBeAdded)) });
const addMinimizer = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].optimization.minimizer .push(...ToBeAdded)) });
const addPlugin    = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].plugins                .push(...ToBeAdded)) });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addPlugin(
    new BrowserSyncPlugin(require('./bs-config.js'), { reload: true, injectCss: true }),
    new FixStyleOnlyEntriesPlugin({ extensions: ['scss', 'css'] }),
    new MiniCSSExtractPlugin({ filename: '[name]' }),
    new StringReplacePlugin(),
).________to('all');

// =============================================================================================================================

addRule({
    test: /\.m?js$/,
    use: [
        { loader: 'babel-loader', options: {
            babelrc: false,
            presets: [
                ['@babel/preset-env', { useBuiltIns: false }]
            ]
        } }
    ]
}).________to('all');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

addRule({
    include: [
        resolvePath(Bibi.SRC, 'bibi/and/jo.js'),
        resolvePath(Bibi.SRC, 'bibi/resources/scripts/bibi.heart.js')
    ],
    use: [
        StringReplacePlugin.replace({ replacements: [
            { pattern: /____Bibi-Version____/ig, replacement: () => Bibi.version }
        ] })
    ]
}).________to('all');

// -----------------------------------------------------------------------------------------------------------------------------

addRule({
    include: [
        resolvePath(Bibi.SRC, 'bibi/resources/scripts/bibi.heart.js')
    ],
    use: [
        StringReplacePlugin.replace({ replacements: [
            { pattern: /$/, replacement: () => '\n' + `Bibi.Dev = true;` }
        ] })
    ]
}).________to('development');

// =============================================================================================================================

const getCommonLoadersForCSS = (Opt = {}) => [
    { loader: 'css-loader', options: {
        url: Opt.url ? true : false,
        import: Opt.import ? true : false,
        importLoaders: 2
    } },
    { loader: 'postcss-loader', options: {
        postcssOptions: {
            plugins: {
                'postcss-preset-env': { /* autoprefixer: { grid: true } */ },
                'cssnano': { zindex: false }
            }
        }
    } },
    { loader: 'sass-loader', options: {} }
];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const StylesToBePacked = [
    resolvePath(Bibi.SRC, 'bibi/and/jo.scss'),
    resolvePath(Bibi.SRC, 'bibi/resources/scripts/bibi.book.scss')
];

// -----------------------------------------------------------------------------------------------------------------------------

addRule({
    test: /\.scss$/,
    exclude: StylesToBePacked,
    use: [
        MiniCSSExtractPlugin.loader,
        ...getCommonLoadersForCSS({ url: true, import: true })
    ]
}).________to('all');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

addRule({
    include: StylesToBePacked,
    use: [
        { loader: 'style-loader' },
        ...getCommonLoadersForCSS({ url: true, import: true })
    ]
}).________to('all');

// =============================================================================================================================

addRule({
    test: /\.(eot|svg|ttf|otf|wof|woff|woff2)$/,
    include: [
        resolvePath('node_modules/material-icons')
    ],
    use: [
        { loader: 'file-loader', options: {
            outputPath: 'bibi/resources/styles/fonts',
            publicPath:                     './fonts',
            name: '[name].[ext]'
        } }
    ]
}).________to('all');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

addRule({
    test: /\.(gif|png|jpg|svg)$/,
    use: [
        { loader: 'url-loader' }
    ]
}).________to('all');

// =============================================================================================================================

addMinimizer(
    new TerserPlugin({
        // cache: true,
        exclude: /^bibi\/presets\//,
        parallel: true,
        extractComments: false,
        terserOptions: {
            ecma: 5,
            compress: true,
            output: {
                comments: /^\! \/+\n/,
                beautify: false
            }
        }
    })
).________to('production');

// -----------------------------------------------------------------------------------------------------------------------------

addPlugin(...Object.keys(Bibi.Banners).map(Name =>
    new Webpack.BannerPlugin({ test: Name, banner: Bibi.Banners[Name], raw: true })
)).________to('production');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(Configs['pack'] = _.cloneDeep(Configs['production'])).output.path = resolvePath(Bibi.ARCHIVETMP);

// =============================================================================================================================

Object.keys(Configs).forEach(Name => {
    const BCConfig = Configs[Name + '@wbck'] = _.cloneDeep(Configs[Name]);
    Object.assign(BCConfig.entryTree, {
        [Bibi.SRCBC]:
            'bib/i.js'
    });
    Object.assign(BCConfig.copyTree, {
        [Bibi.SRCBC]: [
            'bib/i/*.html',
            'README.BackCompatKit.md'
        ]
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Object.keys(Configs).map(Name => {
    const Config = Configs[Name];
    Config.name = Name;
    if(Config.entryTree) Config.entry = Bibi.arrangePathTree({}, (Entries, SrcDir, FilePath) => Entries[FilePath.replace(/\.js$/, '')] = resolvePath(SrcDir, FilePath.replace(/\.css$/, '.scss')), Config.entryTree);
    if(Config.copyTree) Config.plugins.push(new CopyPlugin({ patterns: Bibi.arrangePathTree([], (Patterns, SrcDir, FilePath) => Patterns.push({ context: resolvePath(SrcDir), from: FilePath, to: '.' }), Config.copyTree) }));
    delete Config.entryTree;
    delete Config.copyTree;
    return Config;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
