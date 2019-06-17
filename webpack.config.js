/*!
 *                                                                                                                         (℠)
 *  # webpack config for BiB/i
 *
 */

'use strict';

const Package = require('./package.json');
const Banners = require('./webpack.config.banners.js');

const Webpack = require('webpack');
const Path = require('path');
const HardSourcePlugin = require('hard-source-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const BrowsersList = ['last 1 version'];

const Config = {
    stats: 'errors-warnings',
    performance: { maxEntrypointSize: 1000000, maxAssetSize: 1000000, hints: false  },
    optimization: { minimizer: [] },
    output: { path: __dirname, filename: '[name].js' },
    entry: ((E, L) => { for(const X in L) L[X].forEach(N => E[N] = __dirname + '/dev-' + N + '.' + X); return E; })({}, {
        "js": [
            'bib/i',
            'bib/i/res/scripts/bibi',
            'bib/i/res/scripts/bibi.polyfills',
            'bib/i/extensions/analytics/index',
            'bib/i/extensions/epubcfi/index',
            'bib/i/extensions/share/index',
            'bib/i/extensions/unaccessibilizer/index',
            'bib/i/extensions/unzipper/index',
            'bib/i/extensions/zine/index',
            'bib/i/extensions/lunascape/index'
        ],
        "scss": [
            'bib/i/res/styles/bibi',
            'bib/i/res/styles/bibi.book'
        ]
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
    const IsDev = (Config.mode !== "production");
    if(IsDev) Config.devtool = "inline-source-map";
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
        test: /\/(bibi\.heart|i)\.js$/,
        use: [
            StringReplacePlugin.replace({ replacements: [{
                pattern: /____bibi-version____/ig,
                replacement: () => Package.version
            }]})
        ]
    });
    const CommonLoadersForCSS = [
        { loader: "css-loader", options: {
            url: true,
            sourceMap: IsDev,
            importLoaders: 2
        }},
        { loader: "postcss-loader", options: {
            config: {
                ctx: {
                    'postcss-cssnext': BrowsersList,//'autoprefixer': { grid: true },
                    'cssnano': { zindex: false }
                }
            },
            sourceMap: IsDev
        }},
        { loader: "sass-loader", options: {
            sourceMap: IsDev
        }}
    ];
    Config.module.rules.push({
        test: /\.scss$/,
        exclude: /\/i\.scss$/,
        use: [
            MiniCSSExtractPlugin.loader,
            StringReplacePlugin.replace({ replacements: [{
                pattern: IsDev ? null : /@charset \\"UTF-8\\";\\n?/ig,
                replacement: () => ""
            }]})
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /\/i\.scss$/,
        use: [
            { loader: "style-loader" }
        ].concat(CommonLoadersForCSS)
    });
    Config.module.rules.push({
        test: /\.(eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: "file-loader", options: {
                outputPath: 'bib/i/res/fonts',//(url, resourcePath, context) => { return 'bib/i/res/fonts/' + resourcePath.replace(context + '/node_modules/', '').replace(/^@[^\/]+\//, ''); },
                publicPath:        '../fonts',//(url, resourcePath, context) => { return        '../fonts/' + resourcePath.replace(context + '/node_modules/', '').replace(/^@[^\/]+\//, ''); },
                name: '[name].[ext]'
            }}
        ]
    });/*
    Config.module.rules.push({
        test: /\.(eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: "file-loader", options: {
                outputPath: 'bib/i/res/fonts',
                publicPath: '../fonts',
                name: '[name].[ext]'
            }}
        ]
    });*/
    Config.module.rules.push({
        test: /\.(gif|png|jpg|svg)$/,///\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        use: [
            { loader: "url-loader" }
        ]
    });
    if(Config.mode === 'production') {
        Config.optimization.minimizer.push(new TerserPlugin({
            cache: true,
            parallel: true,
            terserOptions: {
                ecma: 5,
                compress: true,
                output: {
                    comments: /^!/,
                    beautify: false
                }
            }
        }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:                    /\/bibi\.js$/,  raw: true, banner: Banners.BibiJS             }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:                    /\/bibi\.css$/, raw: true, banner: Banners.BibiCSS            }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:         /\/bibi\.polyfills\.js$/,  raw: true, banner: Banners.BibiPolyfillsJS    }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:                  /\/bib\/i\.js$/,  raw: true, banner: Banners.PipiJS             }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:        /\/analytics\/index\.js$/,  raw: true, banner: Banners.X_Analytics        }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:          /\/epubcfi\/index\.js$/,  raw: true, banner: Banners.X_EPUBCFI          }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:            /\/share\/index\.js$/,  raw: true, banner: Banners.X_Share            }));
        Config.plugins.push(new Webpack.BannerPlugin({ test: /\/unaccessibilizer\/index\.js$/,  raw: true, banner: Banners.X_Unaccessibilizer }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:         /\/unzipper\/index\.js$/,  raw: true, banner: Banners.X_Unzipper         }));
        Config.plugins.push(new Webpack.BannerPlugin({ test:             /\/zine\/index\.js$/,  raw: true, banner: Banners.X_Zine             }));
        Config.plugins.push(new CopyPlugin([
            //{ from: 'node_modules/@fortawesome/fontawesome-free/LICENSE.txt', to: 'bib/i/res/fonts/fontawesome-free' },
            //{ from: 'node_modules/material-icons/LICENSE',                    to: 'bib/i/res/fonts/material-icons' },
            { from: 'LICENSE',   to: 'bib' },
            { from: 'README.md', to: 'bib' }
        ]));
    } else if(Config.mode === 'development') {
        //Config.plugins.push(new HardSourcePlugin());
    } else {
    }
    return Config;
};