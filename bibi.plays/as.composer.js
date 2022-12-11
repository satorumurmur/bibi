'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Bibi, the composer.                                                                                                                                                                   (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Bibi = require('bibi.plays');  module.exports = Bibi;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Composer = Bibi.Composer = { Banners: {} };

// =============================================================================================================================

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

const BibiC = { [`© ${ Bibi.package.author.name }`]: Bibi.WebSiteURI, 'Open source under the MIT License': Bibi.LicenseURI };

Object.assign(Composer.Banners, {  // ==========================================================================================

    [`bibi/resources/scripts/bibi.js`]: {
        'Bibi | EPUB Reader on your website.': BibiC, sM: true,
        'Including': {
            'sML.js': { '© Satoru Matsushima': 'https://github.com/satorumurmur/sML', 'Licensed under the MIT License': 'https://github.com/satorumurmur/sML/blob/master/LICENSE' }
        }
    },

    [`bibi/and/jo.js`]: {
        'Jo | Helper for Embedding Bibi-Frames in Webpage.': BibiC, sM: true
    },

    [`bib/i.js`]: {
        'bib/i.js (BCK)': BibiC, sM: true,
        'Calling': [
            `Jo | Helper for Embedding Bibi-Frames in Webpage. - bibi/and/jo.js`
        ]
    },

// -----------------------------------------------------------------------------------------------------------------------------

    [`bibi/extensions/extractor/on-the-fly.js`]: {
        'Bibi Extension: Extractor (on the fly)': BibiC, sM: true,
        'Depends on': {
            'Bibi Zip Loader': { '© Lunascape': 'https://github.com/lunascape/bibi-zip-loader', 'Licensed under the MIT License': 'https://github.com/lunascape/bibi-zip-loader/blob/master/LICENSE' }
        }
    },

    [`bibi/extensions/extractor/at-once.js`]: {
        'Bibi Extension: Extractor (at once)': BibiC, sM: true,
        'Depends on': {
            'JSZip':      { '© Stuart Knightley': 'https://stuk.github.io/jszip',       'Dual licensed under the MIT License or the GPLv3': 'https://github.com/Stuk/jszip/blob/master/LICENSE.markdown'       },
            'JSZipUtils': { '© Stuart Knightley': 'https://stuk.github.io/jszip-utils', 'Dual licensed under the MIT License or the GPLv3': 'https://github.com/Stuk/jszip-utils/blob/master/LICENSE.markdown' }
        }
    },

    [`bibi/extensions/lamp.js`]: {
        'Bibi Extension: Lamp': BibiC, sM: true,
        'Depends on': {
            'NoSleep.js': { '© Rich Tibbett': 'https://github.com/richtr/NoSleep.js', 'Licensed under the MIT License': 'https://github.com/richtr/NoSleep.js/blob/master/LICENSE' }
        }
    },

    [`bibi/extensions/sanitizer.js`]: {
        'Bibi Extension: Sanitizer': BibiC, sM: true,
        'Depends on': {
            'DOMPurify': { '© Mario Heiderich': 'https://github.com/cure53/DOMPurify', 'Dual licensed under the Apache License Version 2.0 or the Mozilla Public License Version 2.0': 'https://github.com/cure53/DOMPurify/blob/master/LICENSE' }
        }
    },

    [`bibi/extensions/zine.js`]: {
        'Bibi Extension: Zine': BibiC, sM: true,
        'Depends on': {
            'JS-YAML': { '© Vitaly Puzrin': 'https://nodeca.github.io/js-yaml', 'Licensed under the MIT License': 'https://github.com/nodeca/js-yaml/blob/master/LICENSE' }
        }
    },

// -----------------------------------------------------------------------------------------------------------------------------

    [`bibi/resources/scripts/bibi.x.debv.js`]: {
        'Bibi Extension: Debugging & Development': BibiC, sM: true
    },

// =============================================================================================================================

    [`bibi/resources/styles/bibi.css`]: {
        'Bibi Style': BibiC, sM: true,
        'Including': {
            'Material Icons': { '© Material Design Authors & Google Inc.': 'https://material.io/resources/icons', 'Licensed under the Apache License version 2.0': 'https://www.apache.org/licenses/LICENSE-2.0' }
        }
    }

});  /**/  Bibi.Dresses['custom-made'].forEach(DressName => Object.assign(Composer.Banners, {  // ------------------------------

    [`bibi/wardrobe/${ DressName }/bibi.dress.css`]: {
        [`Bibi Dress: "${ DressName }"`]: DressName === 'everyday' ? BibiC : `© The Creator(s) of This Dress`, sM: true,
        'Based on': {
            'The Bibi Dress Design System': { [`© ${ Bibi.package.author.name }`]: Bibi.WebSiteURI, 'Licensed under the MIT License': Bibi.LicenseURI }
        }
    }

}));  // =======================================================================================================================

const
AA = `/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`,
ZZ = ` * /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////` + '\n' + ` */`,
LH = ` *`,
__ = '  ';

const
    fLine = (L   ) => LH + (L ? __ + L : ''),
fMainName = (N, M) => (N = `# ` + N) + (() => { if(!M) return ''; M = __ + `(℠)`; while((LH + __ + N + M).length < AA.length - 1) M = ' ' + M; return M; })(),
fCopyItem = (I   ) =>      ``   + I,
fXtraName = (N   ) =>      `+ ` + N + `:`,
fXtraItem = (I   ) => __ + `- ` + I,
     fKV1 = (K, V) =>      K + (V ? ' : ' + arraynize(V, fKV2).join(' / ') : ''),
     fKV2 = (K, V) =>      K + (V ? ' - ' + V : '');

const
    forKV = (O) => (fn) => Object.getOwnPropertyNames(O).forEach((K, i) => fn(K, O[K], i)),
    mapKV = (O) => (fn) => Object.getOwnPropertyNames(O)    .map((K, i) => fn(K, O[K], i)),
alignKeys = (O, L_or_R) => { const L = Math.max(...mapKV(O)(K => K.length)); forKV(O)((K, V) => { let AK = K; while(AK.length < L) AK = L_or_R === 'R' ? ' ' + AK : AK + ' '; delete O[K]; O[AK] = V; }); return O; },
arraynize = (X, fn, Op) => Array.isArray(X) ? X : typeof X !== 'object' ? [X] : mapKV(Op?.AlignKeys ? alignKeys(X, Op.AlignKeys) : X)(fn);

forKV(Composer.Banners)((Path, Banner) => { let Lines = [];
    forKV(Banner)((Key, Value) => { if(Key === 'sM') return;
        if(!Lines.length) { let MainName = Key, CopyItems = Value;
            Lines.push(fMainName(MainName, Banner.sM));
            if(CopyItems) Lines.push('', ...arraynize(CopyItems, fKV2).map(fCopyItem));
        } else { let XtraName = Key, XtraItems = Value;
            Lines.push('', fXtraName(XtraName), ...arraynize(XtraItems, fKV1, { AlignKeys: 'L' }).map(fXtraItem));
        }
    });
    Lines = [AA, ...['', ...Lines, ''].map(fLine), ZZ]; if(/\.css$/.test(Path)) Lines.unshift(`@charset "utf-8";`);
    Composer.Banners[Path] = Lines.join('\n'); // console.log('\n' + Composer.Banners[Path] + '\n');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
