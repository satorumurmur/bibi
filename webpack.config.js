'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Webpack Config for Bibi                                                                                                                                                               (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Bibi = require('bibi.plays/as.composer.js');

const Webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const Path = require('path'), resolvePath = (...Ps) => Path.resolve(__dirname, Ps.join('/'));
const Lodash = { cloneDeep: require('lodash.clonedeep') };

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
                    { 'extractor': [
                        'at-once.js',
                        'on-the-fly.js'
                    ] },
                    'lamp.js',
                    'sanitizer.js',
                    'zine.js'
                ],
                'resources': {
                    'scripts': [
                        'bibi.js',
                        'bibi.x.debv.js'
                    ],
                    'styles':
                        'bibi.css'
                },
                'wardrobe': Bibi.Dresses['custom-made'].map(DressName => (
                    { [DressName]:
                        'bibi.dress.css'
                    }
                ))
            }
        }
    },
    copyTree: {
        [Bibi.SRC]: {
            'bibi': [
                '*.html',
                'extensions/extractor/on-the-fly.bibi-zip-loader.worker.*',
                'presets/**'
            ]
        }
    },
    infoTree: {
        '.': [
            'LICENSE',
            'README.md'
        ]
    }
};

Object.keys(Configs).forEach(Name => Object.assign(Configs[Name], Lodash.cloneDeep(CommonConfig)));

// =============================================================================================================================

const addRule      = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].module.rules           .push(...ToBeAdded)) });
const addMinimizer = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].optimization.minimizer .push(...ToBeAdded)) });
const addPlugIn    = (...ToBeAdded) => ({ ________to: (Name) => (Configs[Name] ? [Name] : Object.keys(Configs)).forEach(Name => Configs[Name].plugins                .push(...ToBeAdded)) });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addPlugIn(
    new Webpack.DefinePlugin({
        ENV_VERSION: JSON.stringify(Bibi.package.version),
        ENV_DEVELOPMENT: JSON.stringify(/^development/.test(Bibi.Arguments['config-name']))
    }),
    new BrowserSyncPlugin(require('./bs-config.js'), { reload: true, injectCss: true }),
    new FixStyleOnlyEntriesPlugin({ extensions: ['scss', 'css'] }),
    new MiniCSSExtractPlugin({ filename: '[name]' })
).________to('all');

// =============================================================================================================================

const getCommonLoadersForCSS = (Opt = {}) => [
    { loader: 'css-loader', options: {
        url: Opt.url ? true : false,
        import: Opt.import ? true : false,
        importLoaders: 2
    } },
    { loader: 'postcss-loader', options: {} },
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
    type: 'asset/inline'
}).________to('all');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

addRule({
    test: /\.(gif|png|jpg|svg)$/,
    type: 'asset/inline'
}).________to('all');

// =============================================================================================================================

addMinimizer(
    new TerserPlugin({
        // cache: true,
        exclude: /^bibi\/presets\//,
        parallel: true,
        extractComments: false,
        terserOptions: {
            ecma: 6,
            compress: true,
            output: {
                comments: /^\! \/+\n/,
                beautify: false
            }
        }
    })
).________to('production');

// -----------------------------------------------------------------------------------------------------------------------------

addPlugIn(...Object.keys(Bibi.Composer.Banners).map(Name =>
    new Webpack.BannerPlugin({ test: Name, banner: Bibi.Composer.Banners[Name], raw: true })
)).________to('production');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(Configs['package'] = Lodash.cloneDeep(Configs['production'])).output.path = resolvePath(Bibi.ARCHIVES + '/.bibi-tmp./__dist');

// =============================================================================================================================

Object.keys(Configs).forEach(Name => {
    if(Name != 'package') {
        Object.assign(Configs[Name].entryTree[Bibi.SRC], {
            'bibi-demo': {
                'embedding':
                    'index.css'
            }
        });
        Object.assign(Configs[Name].copyTree[Bibi.SRC], {
            'bibi-bookshelf':
                '__samples/**/*.epub',
            'bibi-demo':
                '**/*.html'
        });
    }
    const BCConfig = Configs[Name + '@wbck'] = Lodash.cloneDeep(Configs[Name]), SRCBC = Bibi.SRC + '__back-compat';
    Object.assign(BCConfig.entryTree, {
        [SRCBC]:
            'bib/i.js'
    });
    Object.assign(BCConfig.copyTree, {
        [SRCBC]: [
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
    if(Config.infoTree) Config.plugins.push(new CopyPlugin({ patterns: Bibi.arrangePathTree([], (Patterns, SrcDir, FilePath) => Patterns.push({ context: resolvePath(SrcDir), from: FilePath, to: 'bibi/info' }), Config.infoTree) }));
    delete Config.entryTree;
    delete Config.copyTree;
    delete Config.infoTree;
    return Config;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
