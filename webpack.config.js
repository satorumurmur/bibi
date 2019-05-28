/*!
 *                                                                                                                                (℠)
 *  # webpack config for BiB/i
 *
 */

'use strict';

const Package = require('./package.json');

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
            'bib/i/extensions/zine/index'
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
        Config.plugins.push(new Webpack.BannerPlugin({ test: /\/bibi\.js$/,           raw: true, banner: Banner.BibiJS          }));
        Config.plugins.push(new Webpack.BannerPlugin({ test: /\/bibi\.polyfill\.js$/, raw: true, banner: Banner.BibiPolyfillsJS }));
        Config.plugins.push(new Webpack.BannerPlugin({ test: /\/bib\/i\.js$/,         raw: true, banner: Banner.PipiJS          }));
        Config.plugins.push(new Webpack.BannerPlugin({ test: /\/bibi\.css$/,          raw: true, banner: Banner.BibiCSS         }));
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

const Banner = {};

Banner.BibiJS = `/*!
 *                                                                                                                                (℠)
 *  # BiB/i v${Package.version} -- EPUB Reader on your website.
 *sss
 *  * Copyright (c) ${Package.author.name} - ${Package.homepage} or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT license. - https://opensource.org/licenses/mit-license.php
 *
 *  * Including:
 *      - sML.js ... Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML (Licensed under the MIT license.)
 *
 */`;

Banner.BibiPolyfillsJS = `/*!
 *                                                                                                                                (℠)
 *  # BiB/i Polyfills for on Internet Explorer 11
 *
 *  * Including:
 *      - Native Promise Only (NPO) ... Copyright (c) Kyle Simpson - https://github.com/getify/native-promise-only (Licensed under the MIT license.)
 *      - custom-event-polyfill ... Copyright (c) Evan Krambuhl - https://github.com/kumarharsh/custom-event-polyfill (Licensed under the MIT license.)
 *      - document.currentScript Polyfill ... Copyright (c) Adam Miller - https://github.com/amiller-gh/currentScript-polyfill (Licensed under the MIT license.)
 *      - Polyfill Array.prototype.includes ... Copyright (c) Kevin Latusinski - https://github.com/latusinski/polyfill-array-includes (Licensed under the MIT license.)
 *      - String.prototype.padStart ... Copyright (c) Khaled Al-Ansari - https://github.com/KhaledElAnsari/String.prototype.padStart (Licensed under the MIT license.)
 *      - classlist-polyfill ... by Yola Inc. - https://github.com/yola/classlist-polyfill (Released into the public domain under the Unlicense)
 *
 */`;

Banner.PipiJS = `/*!
 *                                                                                                                                (℠)
 *  # Pipi | Putter of BiBi/i v${Package.version}
 *
 *  * Copyright (c) {Package.author.name} - ${Package.homepage} or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT license. - https://opensource.org/licenses/mit-license.php
 *
 */`;

Banner.BibiCSS = `@charset "UTF-8";
/*!
 *                                                                                                                                (℠)
 *  # BiB/i Styles
 *
 *  * Copyright (c) ${Package.author.name} - ${Package.homepage} or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  * Including:
 *      - Material Icons ... Copyright (c) Material Design Authors / Google Inc. - https://material.io/icons/ (Licensed under the Apache license version 2.0.)
 *      - Font Awesome Free ... Copyright (c) Dave Gandy - https://fontawesome.com (Licensed under the SIL Open Font License (OFL) 1.1.)
 *
 */`;