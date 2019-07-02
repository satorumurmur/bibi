/*!
 *                                                                                                                          (℠)
 *  # Banners for BiB/i
 *
 */

'use strict';

const Banners = {}; module.exports = Banners;
const Package = require('./package.json');

// =============================================================================================================================

const banner = (Name, Credit, Extra) => '/*!' + `
 *                                                                                                                          (℠)
 *  # ${ Name }
 *` + (!Credit || Credit == 'none' ? '' : (Credit == 'default' ? `
 *  * Copyright (c) ${ Package.author.name } - ${ Package.homepage } or ${ 'https://github.com/satorumurmur/bibi' }
 *  * Licensed under the MIT license. - ${ 'https://opensource.org/licenses/mit-license.php' }` : '\n' + Credit.replace(/^\n|\n$/g, '')) + `
 *`) + (!Extra ? '' : '\n' + Extra.replace(/^\n|\n$/g, '') + `
 *`) + '\n */';

// =============================================================================================================================

Banners.BibiJS = banner(`BiB/i v${ Package.version } | EPUB Reader on your website.`, 'default', `
 *  * Including:
 *      - sML.js ... Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML (Licensed under the MIT license.)
`);

// -----------------------------------------------------------------------------------------------------------------------------

Banners.BibiCSS = '@charset "UTF-8";\n' + banner(`BiB/i Styles`, 'default', `
 *  * Including:
 *      - Material Icons    ... Copyright (c) Material Design Authors / Google Inc. - https://material.io/icons/ (Licensed under the Apache license version 2.0.)
 *      - Font Awesome Free ... Copyright (c) Dave Gandy                            - https://fontawesome.com    (Licensed under the SIL Open Font License (OFL) 1.1.)
`);

// -----------------------------------------------------------------------------------------------------------------------------

Banners.BibiPolyfillsJS = banner(`BiB/i Polyfills for on Internet Explorer 11`, 'none', `
 *  * Including:
 *      - classlist-polyfill                ...            by Yola Inc.        - https://github.com/yola/classlist-polyfill (Released into the public domain under the Unlicense.)
 *      - document.currentScript Polyfill   ... Copyright (c) Adam Miller      - https://github.com/amiller-gh/currentScript-polyfill            (Licensed under the MIT license.)
 *      - custom-event-polyfill             ... Copyright (c) Evan Krambuhl    - https://github.com/kumarharsh/custom-event-polyfill             (Licensed under the MIT license.)
 *      - Native Promise Only (NPO)         ... Copyright (c) Kyle Simpson     - https://github.com/getify/native-promise-only                   (Licensed under the MIT license.)
 *      - Polyfill Array.prototype.includes ... Copyright (c) Kevin Latusinski - https://github.com/latusinski/polyfill-array-includes           (Licensed under the MIT license.)
 *      - String.prototype.padStart         ... Copyright (c) Khaled Al-Ansari - https://github.com/KhaledElAnsari/String.prototype.padStart     (Licensed under the MIT license.)
 *      - text-encoding-utf-8               ...            by Erik Arvidsson   - https://github.com/arv/text-encoding-utf-8 (Released into the public domain under the Unlicense.)
 *      - url-polyfill                      ... Copyright (c) Valentin Richard - https://github.com/lifaon74/url-polyfill   (Released into the public domain under the Unlicense.)
`);

// -----------------------------------------------------------------------------------------------------------------------------

Banners.PipiJS = banner(`Pipi | Putter of BiBi/i v${ Package.version }`, 'default');

// =============================================================================================================================

Banners.X_Analytics = banner(`BiB/i Extension: Analytics`, 'default');

// -----------------------------------------------------------------------------------------------------------------------------

Banners.X_EPUBCFI = banner(`BiB/i Extension: EPUBCFI`, 'default');

// -----------------------------------------------------------------------------------------------------------------------------

Banners.X_Share = banner(`BiB/i Extension: Share`, 'default');

// -----------------------------------------------------------------------------------------------------------------------------

Banners.X_Unaccessibilizer = banner(`# BiB/i Extension: Unaccessibilizer ("What a...")`, `
 *  * Reluctantly coded by Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  * Released into the public domain under the Unlicense. - http://unlicense.org/UNLICENSE
`);

// -----------------------------------------------------------------------------------------------------------------------------

Banners.X_Unzipper = banner('BiB/i Extension: Unzipper', 'default', `
 *  * Including:
 *      - JSZip      ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip       (Dual licensed under the MIT license or the GPLv3 license.)
 *      - JSZipUtils ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip-utils (Dual licensed under the MIT license or the GPLv3 license.)
`);

// -----------------------------------------------------------------------------------------------------------------------------

Banners.X_Zine = banner('BiB/i Extension: Zine', 'default', `
 *  * Including:
 *      - JS-YAML ... Copyright (c) Vitaly Puzrin - http://nodeca.github.io/js-yaml (Licensed under the MIT license.)
`);

// =============================================================================================================================
