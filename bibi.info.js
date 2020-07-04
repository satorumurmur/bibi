/*!
 *                                                                                                                          (℠)
 *  # Additional Webpack Config for Bibi
 *
 */

'use strict';

const Bibi = {
    'version': '1.2.0',
    'author': {
        'name': 'Satoru Matsushima'
    },
    'description': 'Bibi | EPUB Reader on your website.',
    'homepage': 'https://bibi.epub.link or https://github.com/satorumurmur/bibi'
};

Bibi.Arguments = (() => {
    const KRE = /^\-+([\w\d_\-]+)$/;
    let CurrentKey = null;
    return process.argv.reduce((As, KoV) => {
             if(KRE.test(KoV)) CurrentKey = KoV.replace(KRE, '$1'), As[CurrentKey] = true;
        else if(CurrentKey) As[CurrentKey] = KoV, CurrentKey = null;
        return As;
    }, {});
})();

Bibi.ForPack = (Bibi.Arguments['pack']);
Bibi.WithBCK = (Bibi.Arguments['bc'] || Bibi.ForPack);

Bibi.ARCHIVES = '__archives', Bibi.ARCHIVETMP = Bibi.ARCHIVES + '/.tmp', Bibi.DIST = '__dist', Bibi.SRC = '__src', Bibi.SRCBC = '__src__back-compat';

Bibi.Dresses = (_ => {
    const Dresses = require('./' + Bibi.SRC + '/bibi/wardrobe/_dresses.js') || {};
    Dresses['custom-made'] = _(Dresses['custom-made']).filter(D => !Dresses['ready-made'].includes(D));
    Dresses[ 'ready-made'] = _(Dresses[ 'ready-made']);
    return Dresses;
})(Ds => Ds instanceof Array ? Ds.filter(D => typeof D == 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_\-]*$/.test(D)) : []);

const _banner = (Opt) => '/*!' + `
 *
 *  # ${ Opt.Name }` + (!Opt.Mark ? '' : (s => { for(let l = Math.max(69 - (6 + Opt.Name.length) - 4, 1), i = 0; i < l; i++) s = ' ' + s; return s; })(`(℠)`)) + `
 *` + (!Opt.Credit ? '' : (Opt.Credit == Bibi ? `
 *  * © ${ Bibi.author.name } - ${ Bibi.homepage }
 *  * Open source under the MIT License - https://github.com/satorumurmur/bibi/blob/master/LICENSE` : '\n' + Opt.Credit.replace(/^\n|\n$/g, '')) + `
 *`) + (!Opt.Extra ? '' : '\n' + Opt.Extra.replace(/^\n|\n$/g, '') + `
 *`) + '\n */';

Bibi.Banners = Object.assign({

// =============================================================================================================================

'bibi/resources/scripts/bibi.js': _banner({ Name: `Bibi | EPUB Reader on your website.`, Credit: Bibi, Extra: `
 *  * Including:
 *      - sML.js : © Satoru Matsushima - https://github.com/satorumurmur/sML / Licensed under the MIT License - https://github.com/satorumurmur/sML/blob/master/LICENSE
`, Mark: true }),

'bibi/and/jo.js': _banner({ Name: `Jo | Helper for Embedding Bibi-Frames in Webpage.`, Credit: Bibi, Mark: true }),

'bib/i.js': _banner({ Name: `bib/i.js (BCK)`, Credit: Bibi, Extra: `
 *  * Calling:
 *      - Jo | Helper for Embedding Bibi-Frames in Webpage. - bibi/and/jo.js
`, Mark: true }),

// -----------------------------------------------------------------------------------------------------------------------------

'bibi/resources/scripts/polyfills/bundle.js': _banner({ Name: `Polyfill Bundle for Bibi`, Credit: `
 *  * Consists of:
 *      - classlist-polyfill                : by Yola Inc. - https://github.com/yola/classlist-polyfill / Released into the public domain under the Unlicense - https://github.com/yola/classlist-polyfill/blob/master/LICENSE
 *      - text-encoding-utf-8               : by Erik Arvidsson - https://github.com/arv/text-encoding-utf-8 / Released into the public domain under the Unlicense - https://github.com/arv/text-encoding-utf-8/blob/master/LICENSE.md
 *      - IntersectionObserver polyfill     : © W3C - https://github.com/w3c/IntersectionObserver / Licensed under the W3C Software and Document License - https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *      - custom-event-polyfill             : © Evan Krambuhl - https://github.com/kumarharsh/custom-event-polyfill / Licensed under the MIT License - https://github.com/kumarharsh/custom-event-polyfill/blob/master/LICENSE
 *      - document.currentScript Polyfill   : © Adam Miller - https://github.com/amiller-gh/currentScript-polyfill / Licensed under the MIT License - https://github.com/amiller-gh/currentScript-polyfill/blob/master/LICENSE
 *      - ES6 Object.assign()               : © Rubén Norte - https://github.com/rubennorte/es6-object-assign / Licensed under the MIT License - https://github.com/rubennorte/es6-object-assign/blob/master/LICENSE
 *      - Native Promise Only (NPO)         : © Kyle Simpson - https://github.com/getify/native-promise-only / Licensed under the MIT License - https://getify.mit-license.org/
 *      - Polyfill Array.prototype.includes : © Kevin Latusinski - https://github.com/latusinski/polyfill-array-includes / Licensed under the MIT License - https://github.com/kevlatus/polyfill-array-includes/blob/master/LICENSE
 *      - String.prototype.padStart         : © Khaled Al-Ansari - https://github.com/KhaledElAnsari/String.prototype.padStart / Licensed under the MIT License - https://github.com/KhaledElAnsari/String.prototype.padStart/blob/master/LICENSE
 *      - url-polyfill                      : © Valentin Richard - https://github.com/lifaon74/url-polyfill / Licensed under the MIT License - https://github.com/lifaon74/url-polyfill/blob/master/LICENSE
` }),

'bibi/resources/scripts/polyfills/encoding.js': _banner({ Name: `Polyfill for Bibi: text-encoding-utf-8`, Credit: `
 *  * Consists of:
 *      - text-encoding-utf-8 : by Erik Arvidsson - https://github.com/arv/text-encoding-utf-8 / Released into the public domain under the Unlicense - https://github.com/arv/text-encoding-utf-8/blob/master/LICENSE.md
` }),

'bibi/resources/scripts/polyfills/intersection-observer.js': _banner({ Name: `Polyfill for Bibi: IntersectionObserver polyfill`, Credit: `
 *  * Consists of:
 *      - IntersectionObserver polyfill : © W3C - https://github.com/w3c/IntersectionObserver / Licensed under the W3C Software and Document License - https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
` }),

// -----------------------------------------------------------------------------------------------------------------------------

'bibi/extensions/analytics.js': _banner({ Name: `Bibi Extension: Analytics`, Credit: Bibi, Mark: true }),

'bibi/extensions/epubcfi.js': _banner({ Name: `Bibi Extension: EPUBCFI`, Credit: Bibi, Mark: true }),

'bibi/extensions/extractor/on-the-fly.js': _banner({ Name: 'Bibi Extension: Extractor (on the fly)', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - Bibi Zip Loader : © Lunascape - https://github.com/lunascape/bibi-zip-loader / Licensed under the MIT License - https://github.com/lunascape/bibi-zip-loader/blob/master/LICENSE
`, Mark: true }),

'bibi/extensions/extractor/at-once.js': _banner({ Name: 'Bibi Extension: Extractor (at once)', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - JSZip      : © Stuart Knightley - https://stuk.github.io/jszip / Dual licensed under the MIT License or the GPLv3 - https://github.com/Stuk/jszip/blob/master/LICENSE.markdown
 *      - JSZipUtils : © Stuart Knightley - https://stuk.github.io/jszip-utils / Dual licensed under the MIT License or the GPLv3 - https://github.com/Stuk/jszip-utils/blob/master/LICENSE.markdown
`, Mark: true }),

'bibi/extensions/sanitizer.js': _banner({ Name: 'Bibi Extension: Sanitizer', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - DOMPurify : © Mario Heiderich - https://github.com/cure53/DOMPurify / Dual licensed under the Apache License Version 2.0 or the Mozilla Public License Version 2.0 - https://github.com/cure53/DOMPurify/blob/master/LICENSE
`, Mark: true }),

'bibi/extensions/unaccessibilizer.js': _banner({ Name: `# Bibi Extension: Unaccessibilizer ("What a...")`, Credit: `
 *  * Reluctantly coded by ${ Bibi.author.name } - ${ Bibi.homepage }
 *  * Released into the public domain under the Unlicense - http://unlicense.org/UNLICENSE
` }),

'bibi/extensions/zine.js': _banner({ Name: 'Bibi Extension: Zine', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - JS-YAML : © Vitaly Puzrin - https://nodeca.github.io/js-yaml / Licensed under the MIT License - https://github.com/nodeca/js-yaml/blob/master/LICENSE
`, Mark: true })

// =============================================================================================================================

}, [{

// =============================================================================================================================

'bibi/resources/styles/bibi.css': _banner({ Name: `Bibi Style`, Credit: Bibi, Extra: `
 *  * Including:
 *      - Material Icons : © Material Design Authors & Google Inc. - https://material.io/resources/icons / Licensed under the Apache License version 2.0 - https://www.apache.org/licenses/LICENSE-2.0.html
`, Mark: true })

// -----------------------------------------------------------------------------------------------------------------------------

}].concat(Bibi.Dresses['custom-made'].map(D => ({

// -----------------------------------------------------------------------------------------------------------------------------

[`bibi/wardrobe/${ D }/bibi.dress.css`]: _banner({ Name: `Bibi Dress: "${ D }"`, Credit: D == 'everyday' ? Bibi : `
 *  * © The Creator(s) of This Dress
`, Extra: `
 *  * Based on:
 *      - The Bibi Dress Design System : © ${ Bibi.author.name } - ${ Bibi.homepage } / Licensed under the MIT License - https://github.com/satorumurmur/bibi/blob/master/LICENSE
`, Mark: true })

// =============================================================================================================================

}))).reduce((Bs, B) => { for(const P in B) B[P] = '@charset "utf-8";\n' + B[P]; return Object.assign(Bs, B); }, {}));

module.exports = Bibi;
