/*!
 *                                                                                                                          (℠)
 *  # Additional Webpack Config for BiB/i
 *
 */

'use strict';

const Bibi = {
    'version': '1.0.0-pr',
    'author': {
        'name': 'Satoru MATSUSHIMA'
    },
    'description': 'BiB/i | EPUB Reader on your website.',
    'homepage': 'https://bibi.epub.link or https://github.com/satorumurmur/bibi'
};

// =============================================================================================================================

const banner = (Name, Credit, Extra, Mark) => '/*!' + `
 *` + (!Mark ? '' : `                                                                                                                          ${ Mark }`) + `
 *  # ${ Name }
 *` + (!Credit ? '' : (Credit == 'default' ? `
 *  * Copyright (c) ${ Bibi.author.name } - ${ Bibi.homepage }
 *  * Licensed under the MIT License. - https://opensource.org/licenses/mit-license.php` : '\n' + Credit.replace(/^\n|\n$/g, '')) + `
 *`) + (!Extra ? '' : '\n' + Extra.replace(/^\n|\n$/g, '') + `
 *`) + '\n */';

// =============================================================================================================================

Bibi.Banners = {

// -----------------------------------------------------------------------------------------------------------------------------

'/bibi.js': banner(`BiB/i | EPUB Reader on your website.`, 'default', `
 *  * Including:
 *      - sML.js ... Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML (Licensed under the MIT License.)
`, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/bibi.css': '@charset "utf-8";\n' + banner(`BiB/i Style`, 'default', `
 *  * Including:
 *      - Material Icons ... Copyright (c) Material Design Authors / Google Inc. - https://material.io/icons/ (Licensed under the Apache License version 2.0.)
`, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/bibi.dress.css': '@charset "utf-8";\n' + banner(`BiB/i Dress`, `
 *  * Base Design:
 *      - Copyright (c) ${ Bibi.author.name } - ${ Bibi.homepage }
 *      - Licensed under the MIT License. - https://opensource.org/licenses/mit-license.php
`, null, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/polyfills/bundle.js': banner(`Polyfill Bundle for BiB/i on Museum-Quality Retro Browsers`, `
 *  * Consists of:
 *      - classlist-polyfill                ...            by Yola Inc.        - https://github.com/yola/classlist-polyfill   (Released into the public domain under the Unlicense.)
 *      - text-encoding-utf-8               ...            by Erik Arvidsson   - https://github.com/arv/text-encoding-utf-8   (Released into the public domain under the Unlicense.)
 *      - IntersectionObserver polyfill     ... Copyright (c) W3C              - https://github.com/w3c/IntersectionObserver (Licensed under the W3C Software and Document License.)
 *      - document.currentScript Polyfill   ... Copyright (c) Adam Miller      - https://github.com/amiller-gh/currentScript-polyfill              (Licensed under the MIT License.)
 *      - custom-event-polyfill             ... Copyright (c) Evan Krambuhl    - https://github.com/kumarharsh/custom-event-polyfill               (Licensed under the MIT License.)
 *      - Native Promise Only (NPO)         ... Copyright (c) Kyle Simpson     - https://github.com/getify/native-promise-only                     (Licensed under the MIT License.)
 *      - Polyfill Array.prototype.includes ... Copyright (c) Kevin Latusinski - https://github.com/latusinski/polyfill-array-includes             (Licensed under the MIT License.)
 *      - String.prototype.padStart         ... Copyright (c) Khaled Al-Ansari - https://github.com/KhaledElAnsari/String.prototype.padStart       (Licensed under the MIT License.)
 *      - url-polyfill                      ... Copyright (c) Valentin Richard - https://github.com/lifaon74/url-polyfill                          (Licensed under the MIT License.)
`, null, null),

// -----------------------------------------------------------------------------------------------------------------------------

'/polyfills/encoding.js': banner(`text-encoding-utf-8`, `
 *  * by Erik Arvidsson - https://github.com/arv/text-encoding-utf-8
 *  * Released into the public domain under the Unlicense.
`, null, null),

// -----------------------------------------------------------------------------------------------------------------------------

'/polyfills/intersection-observer.js': banner(`IntersectionObserver polyfill`, `
 *  * Copyright (c) W3C - https://github.com/w3c/IntersectionObserver
 *  * Licensed under the W3C Software and Document License.
`, null, null),

// -----------------------------------------------------------------------------------------------------------------------------

'bib/i.js': banner(`Pipi | Putter of BiBi/i`, 'default', null, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/analytics/index.js': banner(`BiB/i Extension: Analytics`, 'default', null, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/epubcfi/index.js': banner(`BiB/i Extension: EPUBCFI`, 'default', null, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/unaccessibilizer/index.js': banner(`# BiB/i Extension: Unaccessibilizer ("What a...")`, `
 *  * Reluctantly coded by ${ Bibi.author.name } - ${ Bibi.homepage }
 *  * Released into the public domain under the Unlicense. - http://unlicense.org/UNLICENSE
`, null, null),

// -----------------------------------------------------------------------------------------------------------------------------

'/unzipper/index.js': banner('BiB/i Extension: Unzipper', 'default', `
 *  * Including:
 *      - JSZip      ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip       (Dual licensed under the MIT License or the GPLv3.)
 *      - JSZipUtils ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip-utils (Dual licensed under the MIT License or the GPLv3.)
`, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'/zine/index.js': banner('BiB/i Extension: Zine', 'default', `
 *  * Including:
 *      - JS-YAML ... Copyright (c) Vitaly Puzrin - https://nodeca.github.io/js-yaml (Licensed under the MIT License.)
`, '(℠)'),

// -----------------------------------------------------------------------------------------------------------------------------

'':'' };

module.exports = Bibi;