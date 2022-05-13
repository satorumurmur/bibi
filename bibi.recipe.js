'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Bibi's Recipe                                                                                                                                                                         (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Bibi = {
    'package': require('./package.json'),
    'homepage': 'https://bibi.epub.link or https://github.com/satorumurmur/bibi'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bibi.ARCHIVES = '__archives', Bibi.ARCHIVETMP = Bibi.ARCHIVES + '/.tmp';
Bibi.DIST     = '__dist';
Bibi.SRC      = '__src', Bibi.SRCBC = Bibi.SRC + '__back-compat';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bibi.Arguments = (() => {
    const KRE = /^\-+([\w\d_\-]+)$/;
    let CurrentKey = null;
    return process.argv.reduce((As, KoV) => {
             if(KRE.test(KoV)) CurrentKey = KoV.replace(KRE, '$1'), As[CurrentKey] = true;
        else if(CurrentKey) As[CurrentKey] = KoV, CurrentKey = null;
        return As;
    }, {});
})();

Bibi.ForPack = Bibi.Arguments['pack'];
Bibi.WithBCK = Bibi.Arguments['wbck'];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bibi.Dresses = (Dresses => {
    const check = (Ds) => Ds instanceof Array ? Ds.filter(D => typeof D == 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_\-]*$/.test(D)) : [];
    Dresses[ 'ready-made'] = check(Dresses[ 'ready-made']);
    Dresses['custom-made'] = check(Dresses['custom-made']).filter(D => !Dresses['ready-made'].includes(D));
    return Dresses;
})(require('./' + Bibi.SRC + '/bibi/wardrobe/_dresses.js') || {});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bibi.arrayPathTree = (X, Cxs) => { Cxs = Array.isArray(Cxs) ? Cxs.map(Cx => Cx.trim().replace(/^\.|\.$/, '').replace(/^\/|\/$/, '')).filter(Cx => Cx) : [];
    if(X) switch(typeof X) {
        case 'string': return [Cxs.concat(X).join('/')];
        case 'object': return ( Array.isArray(X) ? X .map(I  => Bibi.arrayPathTree(I,     Cxs           )) :
                                       Object.keys(X).map(Cx => Bibi.arrayPathTree(X[Cx], Cxs.concat(Cx))) ).flat(Infinity);
    }
    return [];
};
Bibi.arrangePathTree = (RV, fn, PT) => { Object.keys(PT).forEach(Cx => Bibi.arrayPathTree(PT[Cx]).forEach(P => fn(RV, Cx, P))); return RV; };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Bibi.Banners = {  // ===========================================================================================================

'bibi/resources/scripts/bibi.js': { Name: `Bibi | EPUB Reader on your website.`, Credit: Bibi, Extra: `
 *  * Including:
 *      - sML.js : © Satoru Matsushima - https://github.com/satorumurmur/sML / Licensed under the MIT License - https://github.com/satorumurmur/sML/blob/master/LICENSE
`, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/and/jo.js': { Name: `Jo | Helper for Embedding Bibi-Frames in Webpage.`, Credit: Bibi, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bib/i.js': { Name: `bib/i.js (BCK)`, Credit: Bibi, Extra: `
 *  * Calling:
 *      - Jo | Helper for Embedding Bibi-Frames in Webpage. - bibi/and/jo.js
`, Mark: true },

// -----------------------------------------------------------------------------------------------------------------------------

'bibi/resources/scripts/polyfills/bundle.js': { Name: `Polyfill Bundle for Bibi`, Credit: `
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
` },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/resources/scripts/polyfills/encoding.js': { Name: `Polyfill for Bibi: text-encoding-utf-8`, Credit: `
 *  * Consists of:
 *      - text-encoding-utf-8 : by Erik Arvidsson - https://github.com/arv/text-encoding-utf-8 / Released into the public domain under the Unlicense - https://github.com/arv/text-encoding-utf-8/blob/master/LICENSE.md
` },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/resources/scripts/polyfills/intersection-observer.js': { Name: `Polyfill for Bibi: IntersectionObserver polyfill`, Credit: `
 *  * Consists of:
 *      - IntersectionObserver polyfill : © W3C - https://github.com/w3c/IntersectionObserver / Licensed under the W3C Software and Document License - https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
` },

// -----------------------------------------------------------------------------------------------------------------------------

'bibi/extensions/analytics.js': { Name: `Bibi Extension: Analytics`, Credit: Bibi, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/extractor/on-the-fly.js': { Name: 'Bibi Extension: Extractor (on the fly)', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - Bibi Zip Loader : © Lunascape - https://github.com/lunascape/bibi-zip-loader / Licensed under the MIT License - https://github.com/lunascape/bibi-zip-loader/blob/master/LICENSE
`, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/extractor/at-once.js': { Name: 'Bibi Extension: Extractor (at once)', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - JSZip      : © Stuart Knightley - https://stuk.github.io/jszip / Dual licensed under the MIT License or the GPLv3 - https://github.com/Stuk/jszip/blob/master/LICENSE.markdown
 *      - JSZipUtils : © Stuart Knightley - https://stuk.github.io/jszip-utils / Dual licensed under the MIT License or the GPLv3 - https://github.com/Stuk/jszip-utils/blob/master/LICENSE.markdown
`, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/lamp.js': { Name: 'Bibi Extension: Lamp', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - NoSleep.js : © Rich Tibbett - https://github.com/richtr/NoSleep.js / Licensed under the MIT License - https://github.com/richtr/NoSleep.js/blob/master/LICENSE
`, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/sanitizer.js': { Name: 'Bibi Extension: Sanitizer', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - DOMPurify : © Mario Heiderich - https://github.com/cure53/DOMPurify / Dual licensed under the Apache License Version 2.0 or the Mozilla Public License Version 2.0 - https://github.com/cure53/DOMPurify/blob/master/LICENSE
`, Mark: true },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/unaccessibilizer.js': { Name: `# Bibi Extension: Unaccessibilizer ("What a...")`, Credit: `
 *  * Reluctantly coded by ${ Bibi.package.author.name } - ${ Bibi.homepage }
 *  * Released into the public domain under the Unlicense - http://unlicense.org/UNLICENSE
` },

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

'bibi/extensions/zine.js': { Name: 'Bibi Extension: Zine', Credit: Bibi, Extra: `
 *  * Depends on:
 *      - JS-YAML : © Vitaly Puzrin - https://nodeca.github.io/js-yaml / Licensed under the MIT License - https://github.com/nodeca/js-yaml/blob/master/LICENSE
`, Mark: true },

// =============================================================================================================================

'bibi/resources/styles/bibi.css': { Name: `Bibi Style`, Credit: Bibi, Extra: `
 *  * Including:
 *      - Material Icons : © Material Design Authors & Google Inc. - https://material.io/resources/icons / Licensed under the Apache License version 2.0 - https://www.apache.org/licenses/LICENSE-2.0
`, Mark: true }

};  /**/  Bibi.Dresses['custom-made'].forEach(DressName => Object.assign(Bibi.Banners, {  // -----------------------------------

[`bibi/wardrobe/${ DressName }/bibi.dress.css`]: { Name: `Bibi Dress: "${ DressName }"`, Credit: DressName == 'everyday' ? Bibi : `
 *  * © The Creator(s) of This Dress
`, Extra: `
 *  * Based on:
 *      - The Bibi Dress Design System : © ${ Bibi.package.author.name } - ${ Bibi.homepage } / Licensed under the MIT License - https://github.com/satorumurmur/bibi/blob/master/LICENSE
`, Mark: true }

}));  // =======================================================================================================================

for(const Key in Bibi.Banners) {
    const BannerRecipe = Bibi.Banners[Key];
    Bibi.Banners[Key] = (!/\.css$/.test(Key) ? '' : `@charset "utf-8";`) + `
/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # ${ BannerRecipe.Name }` + (!BannerRecipe.Mark ? '' : (s => { for(let l = Math.max((192 - 1 - 3) - (6 + BannerRecipe.Name.length), 2), i = 0; i < l; i++) s = ' ' + s; return s; })(`(℠)`)) + `
 *` + (!BannerRecipe.Credit ? '' : (BannerRecipe.Credit == Bibi ? `
 *  * © ${ Bibi.package.author.name } - ${ Bibi.homepage }
 *  * Open source under the MIT License - https://github.com/satorumurmur/bibi/blob/master/LICENSE` : '\n' + BannerRecipe.Credit.replace(/^\n|\n$/g, '')) + `
 *`) + (!BannerRecipe.Extra ? '' : '\n' + BannerRecipe.Extra.replace(/^\n|\n$/g, '') + `
 *`) + `
 */`;
 };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Bibi;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
