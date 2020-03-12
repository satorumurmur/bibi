/*!
 *                                                                                                                         (℠)
 *  # Webpack Config for Bibi
 *
 */

'use strict';

const Webpack = require('webpack');

const Package = require('./package.json');
const Bibi = require('./bibi.info.js');

const Dresses = (_ => {
    const Dresses = require('./' + Bibi.SRC + '/bibi/wardrobe/_dresses.js') || {};
    Dresses['custom-made'] = _(Dresses['custom-made']).filter(D => !Dresses['ready-made'].includes(D));
    Dresses[ 'ready-made'] = _(Dresses[ 'ready-made']);
    return Dresses;
})(Ds => Ds instanceof Array ? Ds.filter(D => typeof D == 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_\-]*$/.test(D)) : []);

const HardSourcePlugin = require('hard-source-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const BrowsersList = ['last 1 version', 'ie 11'];

const IsDev = (Bibi.Arguments['mode'] === 'development');

const Config = {
    mode: IsDev ? 'development' : 'production',
    stats: 'errors-warnings',//IsDev ? 'errors-warnings' : 'normal',
    performance: { maxEntrypointSize: 1000000, maxAssetSize: 1000000, hints: false  },
    optimization: { minimizer: [] },
    output: { path: __dirname + '/' + (Bibi.ForPack ? Bibi.ARCHIVETMP : Bibi.DIST), filename: '[name].js' },
    entry: ((Entries, PathListsA, PathListsB) => {
        for(const SrcDir in PathListsA)    PathListsA[SrcDir].forEach(P => Entries[P.replace(/\.js$/, '')] = __dirname + '/' + SrcDir + '/' +                     P.replace(/\.css$/, '.scss'));
        for(const SrcDir in PathListsB) for(const P in PathListsB[SrcDir]) Entries[P.replace(/\.js$/, '')] = __dirname + '/' + SrcDir + '/' + PathListsB[SrcDir][P].replace(/\.css$/, '.scss') ;
        return Entries;
    })({}, {
        [Bibi.SRC]: [
            'bibi/and/jo.js',
            'bibi/extensions/analytics.js',
            'bibi/extensions/epubcfi.js',
            'bibi/extensions/extractor/at-once.js',
            'bibi/extensions/extractor/on-the-fly.js',
            'bibi/extensions/sanitizer.js',
            'bibi/extensions/unaccessibilizer.js',
            'bibi/extensions/zine.js',
            'bibi/resources/scripts/bibi.js',
            'bibi/resources/scripts/polyfills/bundle.js',
            'bibi/resources/scripts/polyfills/encoding.js',
            'bibi/resources/scripts/polyfills/intersection-observer.js',
            'bibi/resources/styles/bibi.css',
            'bibi/resources/scripts/bibi.js',
        ].concat(Dresses['custom-made'].map(D => 'bibi/wardrobe/' + D + '/bibi.dress.css')),
        [Bibi.SRCBC]: Bibi.WithBCK ? [
            'bib/i.js'
        ] : []
    }, {
        'node_modules': {
            'bibi/extensions/extractor/on-the-fly.bibi-zip-loader.worker.js': 'bibi-zip-loader/dist/lszlw.js'
        }
    }),
    plugins: ((RelativeCopySettings, PathLists) => {
        for(const SrcDir in PathLists) {
            const Entries = [];
            PathLists[SrcDir].forEach(P => Entries.push({ from: P, to: '.' }));
            RelativeCopySettings.push(new CopyPlugin(Entries, { context: SrcDir }));
        }
        return RelativeCopySettings;
    })([], {
        [Bibi.SRC]: [
            'bibi/*.html',
            'bibi/presets/**',
            'bibi-bookshelf/__samples/**/*.epub'
        ],
        [Bibi.SRCBC]: Bibi.WithBCK ? [
            'README.BackCompatKit.md',
            'bib/i/*.html',
            'bib/i/presets/**'
        ] : [],
        '': [
            'LICENSE',
            'README.md'
        ]
    }).concat([
        new FixStyleOnlyEntriesPlugin({ extensions: ['scss', 'css'] }),
        new MiniCSSExtractPlugin({ filename: '[name]' }),
        new BrowserSyncPlugin(require('./bs-config.js'), { reload: true, injectCss: true }),
        new StringReplacePlugin()
    ]),
    module: { rules: [{
        test: /\.m?js$/,
        exclude: /\/on-the-fly\.bibi-zip-loader\.worker\.js$/,
        use: [{
            loader: 'babel-loader', options: {
                babelrc: false,
                presets: [
                    ['@babel/preset-env', {
                        targets: BrowsersList,
                        useBuiltIns: false//, corejs: 3
                    }]
                ]
            }
        }]
    }, {
        test: /\/(bibi\.heart|jo)\.js$/,
        use: [
            StringReplacePlugin.replace({ replacements: [{
                pattern: /____Bibi-Version____/ig,
                replacement: () => Bibi.version
            }]})
        ]
    }] }
};

{
    if(Bibi.Arguments['watch']) Config.watch = true;
    if(IsDev) Config.devtool = 'inline-source-map';
    const CommonLoadersForCSS = [
        { loader: 'css-loader', options: {
            url: true,
            sourceMap: IsDev,
            importLoaders: 2
        }},
        { loader: 'postcss-loader', options: {
            config: {
                ctx: {
                    'postcss-cssnext': BrowsersList,//'autoprefixer': { grid: true },
                    'cssnano': { zindex: false }
                }
            },
            sourceMap: IsDev
        }},
        { loader: 'sass-loader', options: {
            sourceMap: IsDev
        }}
    ];
    Config.module.rules.push({
        test: /\.scss$/,
        exclude: /\/(bibi\.book|jo)\.scss$/,
        use: [
            MiniCSSExtractPlugin.loader,
            StringReplacePlugin.replace({ replacements: [{
                pattern: IsDev ? null : /@charset \\"UTF-8\\";\\n?/ig,
                replacement: () => ''
            }]})
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /\/(bibi\.book|jo)\.scss$/,
        use: [
            { loader: 'style-loader' }
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /\/MaterialIcons-Regular\.(eot|svg|ttf|wof|woff|woff2)$/,
        use: [
            { loader: 'file-loader', options: {
                outputPath: 'bibi/resources/styles/fonts',
                publicPath:                     './fonts',
                name: '[name].[ext]'
            }}
        ]
    });
    Config.module.rules.push({
        test: /\.(gif|png|jpg|svg)$/,
        use: [
            { loader: 'url-loader' }
        ]
    });
}

if(IsDev) {
    Config.module.rules.push({
        test: /\/bibi\.heart\.js$/,
        use: [
            StringReplacePlugin.replace({ replacements: [{
                pattern: /$/,
                replacement: () => '\n' + `Bibi.Dev = true;`
            }]})
        ]
    });
} else {
    Config.module.rules.push({
        test: /bibi-zip-loader/,
        use: [
            StringReplacePlugin.replace({ replacements: [{
                pattern: /# sourceURL=webpack:\/+/g,
                replacement: () => ''
            }, {
                pattern: /(\\n)(\\t|\s)+/g,
                replacement: () => '\\n '
            }, {
                pattern: /(\\n ){2,}/g,
                replacement: () => '\\n '
            }, {
                pattern: /(\\n){2,}/g,
                replacement: () => '\\n'
            }]})
        ]
    });
    for(const N in Bibi.Banners) if(N) Config.plugins.push(new Webpack.BannerPlugin({ test: new RegExp(N.replace(/([\/\.])/g, '\\$1') + '$'), banner: Bibi.Banners[N], raw: true }));
    Config.optimization.minimizer.push(new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: false,
        terserOptions: {
            ecma: 5,
            compress: true,
            output: {
                comments: /^\!\n \*( +\(.+\))?\n \* +# +(?!sML)/,
                beautify: false
            }
        }
    }));
}

module.exports = Config;
