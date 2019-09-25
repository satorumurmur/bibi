/*!
 *                                                                                                                         (℠)
 *  # Webpack Config for BiB/i
 *
 */

'use strict';

const Package = require('./package.json'), Bibi = require('./webpack.config.bibi.js');
const Dresses = require('./dev-bib/i/res/styles/wardrobe/_dresses.js');

const Webpack = require('webpack');

const HardSourcePlugin = require('hard-source-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const BrowsersList = ['last 1 version', 'ie 11'];

const Config = {
    stats: 'errors-warnings',
    performance: { maxEntrypointSize: 1000000, maxAssetSize: 1000000, hints: false  },
    optimization: { minimizer: [] },
    output: { path: __dirname, filename: '[name].js' },
    entry: ((Es, Ns) => {
        if(Dresses instanceof Array && Dresses.length) Dresses.forEach(D => { const N = 'bib/i/res/styles/wardrobe/' + D + '/bibi.dress'; if(!Ns[N]) Ns[N] = 'scss'; });
        for(const N in Ns) Es[N] = __dirname + '/dev-' + N + '.' + Ns[N];
        return Es;
    })({}, {
        'bib/i': 'js',
        'bib/i/res/scripts/bibi': 'js',
        'bib/i/res/scripts/polyfills/bundle': 'js',
        'bib/i/res/scripts/polyfills/encoding': 'js',
        'bib/i/res/scripts/polyfills/intersection-observer': 'js',
        'bib/i/extensions/analytics/index': 'js',
        'bib/i/extensions/epubcfi/index': 'js',
        'bib/i/extensions/unaccessibilizer/index': 'js',
        'bib/i/extensions/unzipper/index': 'js',
        'bib/i/extensions/zine/index': 'js',
        'bib/i/res/styles/bibi': 'scss'
    }),
    plugins: [
        new StringReplacePlugin(),
        new FixStyleOnlyEntriesPlugin({ extensions: ['scss', 'css'] }),
        new MiniCSSExtractPlugin({ filename: '[name].css' }),
        new BrowserSyncPlugin(require('./bs-config.js'), { reload: true, injectCss: true })
    ],//devServer: { compress: true, port: 61673 },
    module: { rules: [] }
};

module.exports = (env, argv) => {
    Config.mode = argv.mode;
    const IsDev = (Config.mode !== 'production');
    if(IsDev) Config.devtool = 'inline-source-map';
    Config.module.rules.push({
        test: /\.m?js$/,//exclude: /node_modules/,
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
    });
    Config.module.rules.push({
        test: /(\/bibi\.heart|bib\/i)\.js$/,
        use: [
            StringReplacePlugin.replace({ replacements: [{
                pattern: /____bibi-version____/ig,
                replacement: () => Bibi.version
            }]})
        ]
    });
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
        exclude: /(bib\/i|bibi\.book)\.scss$/,
        use: [
            MiniCSSExtractPlugin.loader,
            StringReplacePlugin.replace({ replacements: [{
                pattern: IsDev ? null : /@charset \\"UTF-8\\";\\n?/ig,
                replacement: () => ''
            }]})
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /(bib\/i|bibi\.book)\.scss$/,
        use: [
            { loader: 'style-loader' }
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /\.(eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: 'file-loader', options: {
                outputPath: 'bib/i/res/fonts',//(url, resourcePath, context) => { return 'bib/i/res/fonts/' + resourcePath.replace(context + '/node_modules/', '').replace(/^@[^\/]+\//, ''); },
                publicPath:        '../fonts',//(url, resourcePath, context) => { return        '../fonts/' + resourcePath.replace(context + '/node_modules/', '').replace(/^@[^\/]+\//, ''); },
                name: '[name].[ext]'
            }}
        ]
    });/*
    Config.module.rules.push({
        test: /\.(eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: 'file-loader', options: {
                outputPath: 'bib/i/res/fonts',
                publicPath: '../fonts',
                name: '[name].[ext]'
            }}
        ]
    });*/
    Config.module.rules.push({
        test: /\.(gif|png|jpg|svg)$/,///\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: 'url-loader' }
        ]
    });
    if(Config.mode === 'production') {
        Config.optimization.minimizer.push(new TerserPlugin({
            cache: true,
            parallel: true,
            extractComments: false,
            terserOptions: {
                ecma: 5,
                compress: true,
                output: {
                    comments: /^\!/,
                    beautify: false
                }
            }
        }));
        for(const N in Bibi.Banners) if(N) Config.plugins.push(new Webpack.BannerPlugin({ test: new RegExp(N.replace(/([\/\.])/g, '\\$1') + '$'), banner: Bibi.Banners[N], raw: true }));
        Config.plugins.push(new CopyPlugin([
            { from: 'LICENSE',   to: 'bib' }/*,
            { from: 'README.md', to: 'bib' }*/
        ]));
    } else if(Config.mode === 'development') {
        //Config.plugins.push(new HardSourcePlugin());
    } else {
    }
    return Config;
};