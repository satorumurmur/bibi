'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Heart of Bibi                                                                                                                                                                         (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Bibi = { 'version': ENV_VERSION, 'href': 'https://bibi.epub.link', Status: '', TimeOrigin: Date.now() }; /**/ Bibi.Dev = Bibi.Development = ENV_DEVELOPMENT;

import { Wand } from './bibi.instruments/Wand.mjs';


Bibi.SettingTypes = {
    'boolean': [
        'allow-placeholders',
        'background-spreading',
        'indicate-orthogonal-arrows-if-necessary',
        'prioritise-fallbacks',
        'prioritise-viewer-operation-over-text-selection',
        'uiless'
    ],
    'yes-no': [
        'autostart',
        'autostart-embedded',
        'fix-nav-ttb',
        'fix-reader-view-mode',
        'flip-pages-during-sliding',
        'full-breadth-layout-in-scroll',
        'start-embedded-in-new-window',
        'use-arrows',
        'use-axis-switcher-ui',
        'use-bookmark-ui',
        'use-flowdirection-setter',
        'use-fontsize-setter',
        'use-full-height',
        'use-history-ui',
        'use-keys',
        'use-linespacing-setter',
        'use-loupe-ui',
        'use-menubar',
        'use-nombre',
        'use-popup-footnotes',
        'use-search-ui',
        'use-slider',
        'use-textsetter-ui',
        'zoom-out-for-utilities'
    ],
    'string': [
        'book',
        'cache',
        'default-page-progression-direction',
        'on-doubletap',
        'on-doubletap-with-altkey',
        'on-singletap-with-altkey',
        'on-tripletap',
        'on-tripletap-with-altkey',
        'pagination-method',
        'reader-view-mode'
    ],
    'integer': [
        'item-padding-bottom',
        'item-padding-left',
        'item-padding-right',
        'item-padding-top',
        'content-margin'
    ],
    'number': [
        'base-fontsize',
        'flipper-width',
        'fontsize-scale-per-step',
        'linespacing-scale-per-step',
        'loupe-max-scale',
        'loupe-scale-per-step',
        'orientation-border-ratio'
    ],
    'array': [
        'concatenate-spreads',
        'content-draggable',
        'touchmove-ignoring-area',
        'on-orthogonal-edgetap',
        'on-orthogonal-arrowkey',
        'on-orthogonal-touchmove',
        'on-orthogonal-wheel'
    ]
};

Bibi.SettingTypes_PresetOnly = {
    'boolean': [
        'accept-base64-encoded-data',
        'accept-blob-converted-data',
        'allow-external-item-href',
        'allow-scripts-in-content',
        'allow-sugar-for-biscuits',
        'manualize-adding-histories',
        'use-bookmarks',
        'use-histories',
        'use-textsetter',
        'recognize-repeated-taps-separately',
        'remove-bibi-website-link',
        'request-with-credentials'
    ],
    'yes-no': [
        'accept-local-file',
        'keep-settings',
        'resume-from-last-position'
    ],
    'string': [
        'bookshelf',
        'default-reader-view-mode',
        'website-name-in-title',
        'website-name-in-menu',
        'website-href'
    ],
    'integer': [
        'max-bookmarks',
        'max-histories'
    ],
    'number': [
    ],
    'array': [
        'available-reader-view-modes',
        'extensions',
        'extract-if-necessary',
        'inhibit',
        'trustworthy-origins'
    ]
};

Bibi.SettingTypes_UserOnly = {
    'boolean': [
        'debug',
        'forget-me',
        'time',
        'wait',
        'zine'
    ],
    'yes-no': [
    ],
    'string': [
        'dress',
        'edge',
        'epubcfi',
        'p',
        'preset',
        'sugar-for-biscuits'
    ],
    'integer': [
        'log',
        'nav',
        'parent-bibi-index'
    ],
    'number': [
        'iipp',
        'sipp'
    ],
    'array': [
    ]
};

Bibi.verifySettingValue = (SettingType, _P, _V, Fill) => Bibi.verifySettingValue[SettingType](_P, _V, Fill); (Verifiers => { for(const SettingType in Verifiers) Bibi.verifySettingValue[SettingType] = Verifiers[SettingType]; })({
    'boolean': (_P, _V, Fill) => {
        if(typeof _V == 'boolean') return _V;
        if(_V === 'true'  || _V === '1' || _V === 1) return true;
        if(_V === 'false' || _V === '0' || _V === 0) return false;
        if(Fill) return false;
    },
    'yes-no': (_P, _V, Fill) => {
        if(/^(yes|no|mobile|desktop)$/.test(_V)) return _V;
        if(_V === 'true'  || _V === '1' || _V === 1) return 'yes';
        if(_V === 'false' || _V === '0' || _V === 0) return 'no';
        if(Fill) return 'no';
    },
    'string': (_P, _V, Fill) => {
        if(typeof _V == 'string') {
            switch(_P) {
                case 'book'                               : return (_V = decodeURIComponent(_V).trim())                  ? _V : undefined;
                case 'cache'                              : return /^(no-store)$/.test(_V)                               ? _V : undefined;
                case 'default-page-progression-direction' : return _V == 'rtl'                                           ? _V : 'ltr';
                case 'default-reader-view-mode'           :
                case         'reader-view-mode'           : return /^(paged|horizontal|vertical)$/.test(_V)              ? _V : 'auto';
                case 'dress'                              : return /^[_\-\w\d]+(\.[_\-\w\d]+)*$/.test(_V)                ? _V : undefined;
                case 'edge'                               : return /^(head|foot)$/.test(_V)                              ? _V : undefined;
                case 'on-doubletap'                       : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'on-tripletap'                       : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'on-singletap-with-altkey'           : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'on-doubletap-with-altkey'           : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'on-tripletap-with-altkey'           : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'p'                                  : return /^([a-z]+|[1-9]\d*((\.[1-9]\d*)*|-[a-z]+))$/.test(_V) ? _V : undefined;
                case 'preset'                             : return /^[_\-\w\d]+(\.[_\-\w\d]+)*$/.test(_V)                ? _V : undefined;
                case 'pagination-method'                  : return _V == 'x'                                             ? _V : 'auto';
            }
            return _V;
        }
        if(Fill) return '';
    },
    'integer': (_P, _V, Fill) => {
        if(Number.isFinite(_V *= 1)) {
            _V = Math.max(Math.round(_V), 0);
            switch(_P) {
                case 'log'           : return Math.min(_V,  9);
                case 'max-bookmarks' : return Math.min(_V,  9);
                case 'max-histories' : return Math.min(_V, 19);
            }
            return _V;
        }
        if(Fill) return 0;
    },
    'number': (_P, _V, Fill) => {
        if(Number.isFinite(_V *= 1) && _V >= 0) return _V;
        if(Fill) return 0;
    },
    'array': (_P, _V, Fill) => {
        if(Array.isArray(_V)) {
            switch(_P) {
                case 'available-reader-view-modes' : _V = Array.from(new Set(_V.filter(_I => typeof _I == 'string' && /^(paged|horizontal|vertical)$/.test(_I)))); return _V.length ? _V : ['paged', 'horizontal', 'vertical'];
                case 'concatenate-spreads'         : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = typeof _V[i] == 'string' && /^(always|never)$/.test(_V[i]) ? _V[i] : 'auto'; return _V;
                case 'content-draggable'           : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = _V[i] === true || _V[i] === 'true' || _V[i] === '1' || _V[i] === 1 ? true : false; return _V;
                case 'extensions'                  : return _V.filter(_I => typeof _I['src'] == 'string' && (_I['src'] = _I['src'].trim()));
                case 'extract-if-necessary'        : return (_V = _V.map(_I => typeof _I == 'string' ? _I.trim().toLowerCase() : '')).includes('*') ? ['*'] : _V.filter(_I => /^(\.[\w\d]+)*$/.test(_I));
                case 'inhibit'                     : return (_V = _V.map(_I => typeof _I == 'string' ? _I.trim()               : '')).includes('*') ? ['*'] : _V.filter(_I => _I);
                case 'touchmove-ignoring-area'     : _V.length = 4; for(let i = 0; i < 4; i++) _V[i] = Number.isFinite(_V[i] *= 1) && _V[i] >= 0 ? _V[i] : 0; return _V;
                case 'on-orthogonal-arrowkey'      :
                case 'on-orthogonal-edgetap'       :
                case 'on-orthogonal-touchmove'     : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = typeof _V[i] == 'string' &&        /^(move|switch|utilities)$/.test(_V[i]) ? _V[i] : ''; return _V;
                case 'on-orthogonal-wheel'         : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = typeof _V[i] == 'string' && /^(across|move|switch|utilities)$/.test(_V[i]) ? _V[i] : ''; return _V;
                case 'trustworthy-origins'         : return _V.reduce((_VN, _I) => typeof _I == 'string' && /^https?:\/\/[^\/]+$/.test(_I = _I.trim().replace(/\/$/, '')) && !_VN.includes(_I) ? _VN.push(_I) && _VN : false, []);
            }
            return _V.filter(_I => typeof _I != 'function');
        }
        if(Fill) return [];
    }
});

Bibi.applyFilteredSettingsTo = (To, From, ListOfSettingTypes, Fill) => {
    ListOfSettingTypes.forEach(STs => {
        for(const ST in STs) STs[ST].forEach(_P => {
            const VSV = Bibi.verifySettingValue[ST](_P, From[_P]);
            if(Fill) {
                To[_P] = Bibi.verifySettingValue[ST](_P, To[_P]);
                if(typeof VSV != 'undefined' || typeof To[_P] == 'undefined') To[_P] = Bibi.verifySettingValue[ST](_P, From[_P], true);
            } else if(From.hasOwnProperty(_P)) {
                if(typeof VSV != 'undefined') To[_P] = VSV;
            }
        });
    });
    return To;
};


Bibi.ErrorMessages = {
       Canceled: `Fetch Canceled`,
    CORSBlocked: `Probably CORS Blocked`,
    DataInvalid: `Data Invalid`,
       NotFound: `404 Not Found`,
   Unidentified: `Unidentified`
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Hello !

//----------------------------------------------------------------------------------------------------------------------------------------------


Bibi.ring = () => Promise.resolve().then(() => {
    Bibi.Script = document.getElementById('bibi-script');
    Bibi.Style  = document.getElementById('bibi-style');
    // const Pfs = [];
    // if(!window.IntersectionObserver) Pfs.push('intersection-observer');
    // if(Pfs.length) return Promise.all(Pfs.map(PfN => new Promise(resolve => document.head.insertBefore(sML.create('script', { src: new URL(`./polyfills/${ PfN }.js`, Bibi.Script.src).href, onload: resolve }), Bibi.Script))));
})
.then(Bibi.hello)
.then(Bibi.initialize)
.then(Bibi.loadExtensions)
.then(Bibi.ready)
.then(Bibi.getBookData)
.then(Bibi.loadBook)
.then(Bibi.bindBook)
.then(Bibi.openBook)
.then(Bibi.start)
.catch(O.error);


Bibi.hello = () => {
    D.at1st();
    U.at1st();
    const Promises = [];
    if(!document.getElementById('bibi-preset')) {
        const PresetName = D['preset'] || U['preset'] || 'default';
        // if(PresetName === '~') Promises.push(new Promise(resolve => P.preset.resolve = resolve)); else { // DO NOT ALLOW EXTERNAL OBJECT
            const Preset = sML.create('script', { id: 'bibi-preset', src: 'presets/' + PresetName + '.js' });
            Promises.push(new Promise(resolve => Preset.addEventListener('load', resolve)));
            document.head.insertBefore(Preset, Bibi.Script.nextSibling);
        // }
    }
    if(!document.getElementById('bibi-dress')) {
        const DressName = D['dress'] || U['dress'] || 'everyday';
        // if(DressName === '~') Promises.push(new Promise(resolve => P.dress.resolve = resolve)); else { // DO NOT ALLOW EXTERNAL TEXT
            const Dress = sML.create('link', { id: 'bibi-dress', rel: 'stylesheet', href: 'wardrobe/' + DressName + '/bibi.dress.css' });
            Promises.push(new Promise(resolve => Dress.addEventListener('load', resolve)));
            document.head.insertBefore(Dress, Bibi.Style.nextSibling);
        // }
    }
    Promises.push(new Promise(resolve => {
        let BookStyleCSS = '', Ele = Bibi.Script;
        while(Ele = Ele.nextElementSibling) if(/^style$/i.test(Ele.tagName) && /^\/\*! Bibi Book Style \*\//.test(Ele.textContent)) {
            const BookStyleElement = Ele;
            BookStyleCSS = BookStyleElement.textContent.replace(/\/*.*?\*\//g, '').trim();
            BookStyleElement.innerHTML = '';
            document.head.removeChild(BookStyleElement);
            break;
        }
        O.createBlobURL('Text', BookStyleCSS, 'text/css').then(BookStyleURL => {
            Bibi.BookStyleURL = BookStyleURL;
            resolve();
        });
    }));
    return Promise.all(Promises).then(() => {
        O.log.initialize();
        O.log(`Hello!`, '<b:>');
        O.log(`[ja] ${ Bibi['href'] }`);
        O.log(`[en] https://github.com/satorumurmur/bibi`);
    });
};


Bibi.initialize = async () => {
    { // Path / URI
        O.Origin = location.origin || (location.protocol + '//' + (location.host || (location.hostname + (location.port ? ':' + location.port : ''))));
        O.Local = location.protocol == 'file:';
        O.RequestedURL = location.href;
    }
    { // DOM
        O.contentWindow = window;
        O.contentDocument = document;
        O.HTML  = document.documentElement;
        O.Head  = document.head;
        O.Body  = document.body;
        O.Info  = document.getElementById('bibi-info');
        O.Title = document.getElementsByTagName('title')[0];
    }
    { // Environments
        O.HTML.classList.add(...sML.Environments, 'Bibi', 'welcome');
        if(O.TouchOS = (sML.OS.iOS || sML.OS.Android) ? true : false) { // Touch Device
            O.HTML.classList.add('touch');
            if(sML.OS.iOS) {
                O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-capable',          content: 'yes'   }));
                O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'white' }));
            }
        }
        O.HTML.classList.add('default-lang-' + (O.Language = (NLs => { // Language
            if(Array.isArray(navigator.languages)) NLs = NLs.concat(navigator.languages);
            if(navigator.language && navigator.language != NLs[0]) NLs.unshift(navigator.language);
            for(let l = NLs.length, i = 0; i < l; i++) {
                const Lan = NLs[i].split ? NLs[i].split('-')[0] : '';
                if(Lan == 'ja') return 'ja';
                if(Lan == 'en') break;
            }                   return 'en';
        })([])));
    }
    { // Modules
        E.initialize();
        P.initialize();
        U.initialize();
        D.initialize();
        S.initialize();
        W.initialize();
        I.initialize();
        if(!S['book-data'] && S['book'] && !S['trustworthy-origins'].includes(new URL(S['book']).origin)) throw `The Origin of the Path of the Book Is Not Allowed.`;
    }
    { // Embedding, Window, Fullscreen
        O.Embedded = (() => { // Window Embedded or Not
            if(window.parent == window) { O.HTML.classList.add('window-direct'  );                                                                         return                            0; } // false
            else                        { O.HTML.classList.add('window-embedded'); try { if(location.host == parent.location.host || parent.location.href) return 1; } catch(Err) {} return -1; } // true (1:Reachable or -1:Unreachable)
        })();
        O.ParentBibi = O.Embedded === 1 && typeof S['parent-bibi-index'] == 'number' ? window.parent['bibi:jo'].Bibis[S['parent-bibi-index']] || null : null;
        O.ParentOrigin = O.ParentBibi ? window.parent.location.origin : '';
        O.FullscreenTarget = (() => { // Fullscreen Target
            const FsT = (() => {
                if(!O.Embedded)  { sML.Fullscreen.polyfill(window       ); return O.HTML;             }
                if(O.ParentBibi) { sML.Fullscreen.polyfill(window.parent); return O.ParentBibi.Frame; }
            })() || null;
            if(FsT && FsT.ownerDocument.fullscreenEnabled) { O.HTML.classList.add('fullscreen-enabled' ); return FsT;  }
            else                                           { O.HTML.classList.add('fullscreen-disabled'); return null; }
        })();
        if(O.ParentBibi) {
            O.ParentBibi.Window = window, O.ParentBibi.Document = document, O.ParentBibi.HTML = O.HTML, O.ParentBibi.Body = O.Body;
            ['bibi:initialized', 'bibi:readied', 'bibi:prepared', 'bibi:opened'].forEach(EN => E.add(EN, Det => O.ParentBibi.dispatch(EN, Det)));
            window.addEventListener('message', M.receive, false);
        }
    }
    { // IFrame with BlobURL
        O.EnabledIFramesWithBlobURL = await new Promise(resolve => O.createBlobURL('Text', '<!DOCTYPE html><meta charset=l1><title></title>', 'text/html').then(SourceURL => {
            const IFrame = document.body.appendChild(sML.create('iframe', { on: { load: () => resolve(IFrame.contentDocument?.documentElement?.outerHTML?.length ? true : false) || IFrame.remove() }, src: SourceURL }));
            setTimeout(() => resolve(false) || IFrame.remove(), 999);
        }).catch(() => resolve(false)));
    }
    { // Say Welcome or say Bye-bye
        if(Bibi.isCompatible()) I.notify(`Welcome!`); else throw Bibi.byebye();
    }
    { // Writing Mode, Font Size, Safe Area Size, Slider Size, Menu Height
        O.WritingModeProperty = (() => {
            const HTMLComputedStyle = getComputedStyle(O.HTML);
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle[        'writing-mode'])) return         'writing-mode';
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle['-webkit-writing-mode'])) return '-webkit-writing-mode';
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle[  '-epub-writing-mode'])) return   '-epub-writing-mode';
            return undefined;
        })();
        const SC = O.Body.appendChild(sML.create('div', { id: 'bibi-style-checker' })), SCCS = getComputedStyle(SC);
        O.FontSize = { Default: parseFloat(SCCS.fontSize) };
        SC.style.fontSize = '0.01px';
        O.FontSize.Minimum = Math.ceil(parseFloat(SCCS.fontSize) * 100) / 100;
        SC.removeAttribute('style');
        I.Slider.Size = S['use-slider' ] ? parseFloat(SCCS.width)  : 0;
        I.Menu.Height = S['use-menubar'] ? parseFloat(SCCS.height) : 0;
        O.getSafeArea = () => O.Embedded ? { Top: 0, Right: 0, Bottom: 0, Left: 0 } : { Top: parseFloat(SCCS.paddingTop), Right: parseFloat(SCCS.paddingRight), Bottom: parseFloat(SCCS.paddingBottom), Left: parseFloat(SCCS.paddingLeft) };
        Object.defineProperty(O, 'SafeArea', { get: O.getSafeArea });
        // delete document.body.removeChild(SC);
    }
    { // Scrollbars
        O.Body.style.width = O.Body.style.height = '111%';
        O.Scrollbars = { Width: window.innerWidth - O.HTML.offsetWidth, Height: window.innerHeight - O.HTML.offsetHeight };
        /*O.HTML.style.width = O.HTML.style.height =*/ O.Body.style.width = O.Body.style.height = '';
    }
    { // Inhibition...
        O.inhibit();
    }
    { // Debugger & DevNote
        if(Bibi.Deb) O.HTML.classList.add('deb', 'debug'      ) || location.hostname == 'localhost' && Bibi.createDebNote();  delete Bibi.createDebNote;
        if(Bibi.Dev) O.HTML.classList.add('dev', 'development') || location.hostname != 'localhost' && Bibi.createDevNote();  delete Bibi.createDevNote;
    }
    O.HTML.classList.toggle('book-full-height', S['use-full-height']);
    O.HTML.classList.remove('welcome');
    return E.dispatch('bibi:initialized', Bibi.Status = Bibi.Initialized = 'Initialized');
};


Bibi.isCompatible = () => {
    if(sML.UA.Trident || sML.UA.EdgeHTML) return false;
    return true;
};

Bibi.byebye = () => {
    I.Veil.byebye({
        'en': `<span>Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible.</span>`,
        'ja': `<span>大変申し訳ありません。</span> <span>お使いのブラウザでは、</span><span>動作しません。</span>`
    });
    return `Your Browser Is Not Compatible`;
};


Bibi.loadExtensions = () => X.list().then(() => {
    if(S['extensions'].length == 0) return;
    O.log(`Loading Extension${ S['extensions'].length > 1 ? 's' : '' }...`, '<g:>');
    return X.load().then(() => {
        O.log(`Extensions: %O`, X.Extensions);
        O.log(`Loaded. (${ X.Extensions.length } Extension${ X.Extensions.length > 1 ? 's' : '' })`, '</g>');
    });
}).finally(X.clean);


Bibi.ready = async () => {
    if(!Bibi.isCompatible()) throw Bibi.byebye(); // Extensions may update Bibi.isCompatible & Bibi.byebye function.
    O.HTML.classList.add('ready');
    O.ReadiedURL = location.href;
    await new Promise(resolve => setTimeout(resolve, (O.TouchOS && !O.Embedded) ? 999 : 0));
    return E.dispatch('bibi:readied', Bibi.Status = Bibi.Readied = 'Readied').then(() => O.HTML.classList.remove('ready'));
};


Bibi.getBookData = () =>
    S['book-data']         ?     Promise.resolve({ BookData: S['book-data'], BookDataMIMEType: S['book-data-mimetype'] }) :
    S['book']              ?     Promise.resolve({ Book: S['book'] }) :
    S['accept-local-file'] ? new Promise(resolve => { Bibi.getBookData.resolve = (Par) => { resolve(Par), O.HTML.classList.remove('waiting-file'); }; O.HTML.classList.add('waiting-file'); }) :
                                 Promise.reject (`Tell me EPUB name via ${ O.Embedded ? 'embedding tag' : 'URI' }.`);

Bibi.setBookData = (Par) => Bibi.getBookData.resolve ? Bibi.getBookData.resolve(Par) : Promise.reject(Par);

Bibi.busyHerself = () => new Promise(resolve => {
    O.Busy = true;
    O.HTML.classList.add('busy');
    O.HTML.classList.add('loading');
    I.ResizeObserver.addEventListener(R.resetBibiHeight);
    Bibi.busyHerself.resolve = () => { resolve(); delete Bibi.busyHerself; };
}).then(() => {
    I.ResizeObserver.addEventListener(R.resetBibiHeight);
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('loading');
});


Bibi.loadBook = (BookInfo) => Promise.resolve().then(() => {
    Bibi.busyHerself();
    I.notify(`Loading...`);
    O.log(`Initializing Book...`, '<g:>');
    return L.initializeBook(BookInfo).then(InitializedAs => {
        O.log(`${ InitializedAs }: %O`, B);
        O.log(`Initialized. (as ${ /^[aiueo]/i.test(InitializedAs) ? 'an' : 'a' } ${ InitializedAs })`, '</g>');
    });
}).then(() => {
    S.update();
    R.updateOrientation();
    R.resetStage();
}).then(() => {
    // Create Cover
    O.log(`Creating Cover...`, '<g:>');
    if(B.CoverImage.Source) {
        O.log(`Cover Image: %O`, B.CoverImage.Source);
        O.log(`Will Be Created.`, '</g>');
    } else {
        O.log(`Will Be Created. (w/o Image)`, '</g>');
    }
    /*return*/ L.createCover(); // ← loading is async
}).then(() => {
    // Load Navigation
    if(!B.Nav.Source) return O.log(`No Navigation.`)
    O.log(`Loading Navigation...`, '<g:>');
    return L.loadNavigation().then(PNav => {
        O.log(`${ B.Nav.Type }: %O`, B.Nav.Source);
        O.log(`Loaded.`, '</g>');
        E.dispatch('bibi:loaded-navigation', B.Nav.Source);
    });
}).then(() => {
    // Announce "Prepared"
    return E.dispatch('bibi:prepared', Bibi.Status = Bibi.Prepared = 'Prepared');
}).then(() => {
    // Wait, sometime
    if(!S['autostart'] && !L.Played) return L.wait();
}).then(() => {
    // Background Preparing
    return L.preprocessResources();
}).then(() => {
    // Load & Layout Items in Spreads and Pages
    O.log(`Loading Items in Spreads...`, '<g:>');
    Bibi.StartOption = {
        TargetItemIndex: 0,
        TargetSpreadIndex: 0,
        Destination: { Edge: 'head' },
        NoNotification: true,
        Reset: true, ////////
        // resetter:       () => { Bibi.StartOption.Reset = true; Bibi.StartOption.removeResetter(); },
        // addResetter:    () => { window   .addEventListener('resize', Bibi.StartOption.resetter); },
        // removeResetter: () => { window.removeEventListener('resize', Bibi.StartOption.resetter); }
    };
    if(typeof R.StartOn == 'object') {
        const Item = typeof R.StartOn.Item == 'object' ? R.StartOn.Item : (() => {
            if(typeof R.StartOn.ItemIndex == 'number') {
                let II = R.StartOn.ItemIndex;
                     if(II <  0             ) R.StartOn = { ItemIndex: 0 };
                else if(II >= R.Items.length) R.StartOn = { ItemIndex: R.Items.length - 1 };
                return R.Items[R.StartOn.ItemIndex];
            }
            if(typeof R.StartOn.ItemIndexInSpine  == 'number') {
                let IIIS = R.StartOn.ItemIndexInSpine;
                     if(IIIS <  0                     ) IIIS = 0;
                else if(IIIS >= B.Package.Spine.length) IIIS = B.Package.Spine.length - 1;
                let Item = B.Package.Spine[R.StartOn.ItemIndexInSpine];
                if(!Item.Spread) {
                    R.StartOn = { ItemIndex: 0 };
                    Item = R.Items[0];
                }
                return Item;
            }
            if(typeof R.StartOn.P == 'string') {
                const Steps = R.StartOn.P.split('.');
                let II = Steps.shift() * 1 - 1;
                     if(II <  0             ) II = 0,                  R.StartOn = { P: String(II + 1) };
                else if(II >= R.Items.length) II = R.Items.length - 1, R.StartOn = { P: String(II + 1) };
                return R.Items[II];
            }
            if(typeof R.StartOn.IIPP == 'number') {
                let II = Math.floor(R.StartOn.IIPP);
                     if(II <  0             ) II = 0,                  R.StartOn = { IIPP: II };
                else if(II >= R.Items.length) II = R.Items.length - 1, R.StartOn = { IIPP: II };
                return R.Items[II];
            }
            if(typeof R.StartOn.Edge == 'string') {
                R.StartOn = (R.StartOn.Edge != 'foot') ? { Edge: 'head' } : { Edge: 'foot' };
                switch(R.StartOn.Edge) {
                    case 'head': return R.Items[0];
                    case 'foot': return R.Items[R.Items.length - 1];
                }
            }
        })();
        if(Item) {
            Bibi.StartOption.TargetItemIndex = Item.Index;
            Bibi.StartOption.TargetSpreadIndex = Item.Spread.Index;
        }
        Bibi.StartOption.Destination = R.StartOn;
    }
    // Bibi.StartOption.addResetter();
    O.HTML.classList.add('loading-items');
    let LoadedItems = 0;
    return Promise.all(R.Spreads.map(Spread => new Promise(resolve => L.loadSpread(Spread, { AllowPlaceholderItems: S['allow-placeholders'] && Spread.Index != Bibi.StartOption.TargetSpreadIndex }).then(() => {
        I.notify(`Loading Items... <span class="sotto">${ LoadedItems += Spread.Items.length }/${ R.Items.length }</span>`);
        setTimeout(() => resolve(), 69);
        // !Bibi.StartOption.Reset ? R.layOutSpreadAndItsItems(Spread).then(resolve) : resolve();
    })))).then(async () => {
        O.log(`Loaded. (${ R.Items.length } in ${ R.Spreads.length })`, '</g>');
        I.notify(`Processing...`);
        await new Promise(resolve => setTimeout(resolve, 69));
        return E.dispatch('bibi:loaded-book', Bibi.Status = Bibi.Loaded = 'Loaded').then(() => O.HTML.classList.remove('loading-items'));
    });
});


Bibi.bindBook = async () => {
    // if(!Bibi.StartOption.Reset) {
    //     R.organizePages();
    //     R.layOutStage();
    // }
    I.notify(`Binding...`);
    await new Promise(resolve => setTimeout(resolve, 69));
    return R.layOutBook(Bibi.StartOption)
        // .then(() => Bibi.StartOption.removeResetter())
        .then(() => E.dispatch('bibi:laid-out-for-the-first-time', Bibi.StartOption))
        .then(() => E.dispatch('bibi:binded-book', Bibi.Status = Bibi.Binded = 'Binded'));
};


Bibi.openBook = () => {
    // Open
    Bibi.busyHerself.resolve();
    I.Veil.close();
    L.Opened = true;
    document.body.click(); // To responce for user scrolling/keypressing immediately
    I.notify('Here!', { Time: 999 });
    O.log(`Enjoy Readings!`, '</b>');
    return E.dispatch('bibi:opened', Bibi.Status = Bibi.Opened = 'Opened').then(() => E.dispatch('bibi:scrolled'));
};


Bibi.start = () => {
    /*
    alert((Alert => {
        [
            'document.referrer',
            'navigator.userAgent',
            '[navigator.appName, navigator.vendor, navigator.platform]',
            'window.innerHeight',
            '[O.HTML.offsetHeight, O.HTML.clientHeight, O.HTML.scrollHeight]',
            '[O.Body.offsetHeight, O.Body.clientHeight, O.Body.scrollHeight]',
            '[R.Main.offsetHeight, R.Main.clientHeight, R.Main.scrollHeight]'
        ].forEach(X => Alert.push(`┌ ' + X + '\n' + eval(X)));
        return Alert.join('\n\n');
    })([]));
    //*/
    const LandingPage = R.getPage(Bibi.StartOption.Destination);
    if(!I.History.List.length) {
        I.History.List = [{ UI: Bibi, Item: LandingPage.Item, ProgressInItem: LandingPage.IndexInItem / LandingPage.Item.Pages.length }];
        I.History.update();
    }
    E.add('bibi:commands:move-by',     R.moveBy);
    E.add('bibi:commands:scroll-by',   R.scrollBy);
    E.add('bibi:commands:focus-on',    R.focusOn);
    E.add('bibi:commands:change-view', R.changeView);
    return E.dispatch('bibi:started', Bibi.Status = Bibi.Started = 'Started');
};


Bibi.createDebNote = () => {
    const Deb = Bibi.IsDebMode = O.Body.appendChild(sML.create('div', { id: 'bibi-is-deb-mode', style: { display: 'none' } }));
    const deb = Bibi.deb = (...Args) => {
        Deb.style.display = '';
        const NoLog = Args[0] === 'NoLog'; if(NoLog) Args.shift();
        const Msg = Args.join(', '); if(!Msg) return;
        if(!NoLog) O.log(Msg.replace(/<[^<>]*>/g, ''), '<*/>');
        return Deb.appendChild(sML.create('p', { innerHTML: Msg }));
    };
    E.add('bibi:started', () => {
        sML.style(Deb, { top: '5px', width: R.Stage.Width - 10 + 'px', height: R.Stage.Height - 10 + 'px' });
        // O.log('========================', '<*/>');
        // deb(`Window: W:${ window.innerWidth }, H:${ window.innerHeight }`);
        // deb(`Stage: W:${ R.Stage.Width }, H:${ R.Stage.Height }`);
    });
}, Bibi.deb = () => undefined;


Bibi.createDevNote = () => {
    const Dev = Bibi.IsDevMode = O.Body.appendChild(sML.create('div', { id: 'bibi-is-dev-mode' }));
    const dev = (...Args) => {
        const NoLog = Args[0] === 'NoLog'; if(NoLog) Args.shift();
        const Msg = Args.join(', '); if(!Msg) return;
        if(!NoLog) O.log(Msg.replace(/<[^<>]*>/g, ''), '<*/>');
        return Dev.appendChild(sML.create('p', { innerHTML: Msg }));
    };
    O.log('========================', '<*/>');
    dev(`<strong>This Bibi seems to be a</strong> <strong>Development Version</strong>`);
    dev(`<span>Please don't forget</span> <span>to create a production version</span> <span>before publishing on the Internet.</span>`);
    dev(`<span class="non-visual">(To create a production version, run it on terminal: \`</span><code>npm run build</code><span class="non-visual">\`)</span>`);
    dev('NoLog', `<em>Close</em>`).addEventListener('click', () => Dev.className = 'hide');
    O.log('========================', '<*/>');
    [E['pointerdown'], E['pointerup'], E['pointermove'], E['pointerover'], E['pointerout'], 'click'].forEach(EN => Dev.addEventListener(EN, Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; }));
    setTimeout(() => Dev.className = 'show', 0);
};


Bibi.createElement = (...Args) => {
    const TagName = Args[0];
    if(!Bibi.Elements) Bibi.Elements = {};
    if(window.customElements) {
        if(!Bibi.Elements[TagName]) Bibi.Elements[TagName] = class extends HTMLElement { constructor() { super(); } }, window.customElements.define(TagName, Bibi.Elements[TagName]);
    } else if(document.registerElement) {
        if(!Bibi.Elements[TagName]) Bibi.Elements[TagName] = document.registerElement(TagName);
        return sML.edit(new Bibi.Elements[Args.shift()](), Args);
    }
    return sML.create(...Args);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Wand (Worker)

//----------------------------------------------------------------------------------------------------------------------------------------------

export const W = new Wand(new Worker(new URL('./bibi.wand.js', document.currentScript.src).href), {
    initialize: () => {
        delete W.initialize;
        W.Logger = O;
        W.and('initialize')(['sML', 'Bibi', 'S'].reduce((Settings, OName) => (Settings[OName] = JSON.parse(JSON.stringify(window[OName]))) && Settings, {}));
    }
});


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Book

//----------------------------------------------------------------------------------------------------------------------------------------------


export const B = { // Bibi.Book
    Path: '',
    PathDelimiter: ' > ',
    DataElement: null,
    Container: { Source: { Path: 'META-INF/container.xml' } },
    Package: { Source: {}, Metadata: {}, Manifest: {}, Spine: [] },
    Nav: {}, CoverImage: {},
    FileDigit: 0
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


export const L = { // Bibi.Loader
    Opened: false
};


L.wait = () => {
    L.Waiting = true;
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.add('waiting');
    E.dispatch('bibi:waits');
    O.log(`(Waiting...)`, '<i/>');
    I.notify('');
    return new Promise(resolve => L.wait.resolve = resolve).then(() => {
        L.Waiting = false;
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.remove('waiting');
        I.notify(`Loading...`);
        return new Promise(resolve => setTimeout(resolve, 99));
    });
};


L.openNewWindow = (HRef) => {
    const WO = window.open(HRef);
    return WO ? WO : location.href = HRef;
};


L.play = () => {
    if(S['start-in-new-window']) return L.openNewWindow(location.href);
    L.Played = true;
    R.resetStage();
    L.wait.resolve();
    E.dispatch('bibi:played');
};


L.initializeBook = (BookInfo = {}) => new Promise((resolve, reject) => {
    const reject_failedToOpenTheBook = (Msg) => reject(`Failed to open the book (${ Msg })`);
    if(!BookInfo.Book && !BookInfo.BookData) return reject_failedToOpenTheBook(Bibi.ErrorMessages.DataInvalid);
    const BookDataFormat =
        typeof BookInfo.Book     == 'string' ? 'URI' :
        typeof BookInfo.BookData == 'string' ? 'Base64' :
        typeof BookInfo.BookData == 'object' && BookInfo.BookData.size && BookInfo.BookData.type ? (BookInfo.BookData.name ? 'File' : 'Blob') : '';
    if(!BookDataFormat) return reject_failedToOpenTheBook(Bibi.ErrorMessages.DataInvalid);
    B.Type = !S['book'] ? '' : S['zine'] ? 'Zine' : 'EPUB';
    if(B.Type != 'EPUB') B.ZineData = { Source: { Path: 'zine.yaml' } };
    if(BookDataFormat == 'URI') {
        // Online
        if(O.Local) return reject(`Bibi can't open books via ${ D['book'] ? 'data-bibi-book' : 'URL' } on local mode`);
        B.Path = BookInfo.Book;
        const RootSource = (B.Type == 'Zine' ? B.ZineData : B.Container).Source;
        const InitErrors = [], initialize_as = (FileOrFolder) => ({
            Promised: (
                FileOrFolder == 'folder' ? O.download(RootSource).then(() => (B.PathDelimiter = '/') && '') :
                O.RangeLoader            ?  O.extract(RootSource).then(() => 'on-the-fly') :
                                 O.loadZippedBookData(  B.Path  ).then(() => 'at-once')
            ).then(ExtractionPolicy => {
                B.ExtractionPolicy = ExtractionPolicy;
                //O.log(`Succeed to Open as ${ B.Type } ${ FileOrFolder }.`);
                resolve(`${ B.Type } ${ FileOrFolder }`);
            }).catch(Err => {
                InitErrors.push(Err = (/404/.test(String(Err)) ? Bibi.ErrorMessages.NotFound : String(Err).replace(/^Error: /, '')));
                O.log(`Failed as ${ /^[aiueo]/i.test(B.Type) ? 'an' : 'a' } ${ B.Type } ${ FileOrFolder }: ` + Err);
                return Promise.reject();
            }),
            or:        function(fun) { return this.Promised.catch(fun); },
            or_reject: function(fun) { return this.or(() => reject_failedToOpenTheBook(
                InitErrors.length < 2 || InitErrors[0] == InitErrors[1] ? InitErrors[0] :
                InitErrors[0] == Bibi.ErrorMessages.Unidentified && InitErrors[1] == Bibi.ErrorMessages.CORSBlocked ? InitErrors[1] :
                `as a file: ${ InitErrors[0] } / as a folder: ${ InitErrors[1] }`
            )); }
        });
        O.isToBeExtractedIfNecessary(B.Path) ? initialize_as('file').or(() => initialize_as('folder').or_reject()) : initialize_as('folder').or_reject();
    } else {
        let BookData = BookInfo.BookData;
        let FileOrData;
        const MIMETypeREs = { EPUB: /^application\/epub\+zip$/, Zine: /^application\/(zip|x-zip(-compressed)?)$/ };
        const MIMETypeErrorMessage = 'File of this type is unacceptable';
        if(BookDataFormat == 'File') {
            // Local-Archived EPUB/Zine File
            if(!S['accept-local-file'])                      return reject(`Local file is set to unacceptable`);
            if(!BookData.name)                               return reject(`File without a name is unacceptable`);
            if(!/\.[\w\d]+$/.test(BookData.name))            return reject(`Local file without extension is set to unacceptable`);
            if(!O.isToBeExtractedIfNecessary(BookData.name)) return reject(`File with this extension is set to unacceptable`);
            if(BookData.type) {
                if(/\.epub$/i.test(BookData.name) ? !MIMETypeREs['EPUB'].test(BookData.type) :
                    /\.zip$/i.test(BookData.name) ? !MIMETypeREs['Zine'].test(BookData.type) : true) return reject(MIMETypeErrorMessage);
            }
            FileOrData = 'file';
            B.Path = '[Local File] ' + BookData.name;
        } else {
            if(BookDataFormat == 'Base64') {
                // Base64-Encoded EPUB/Zine Data
                if(!S['accept-base64-encoded-data']) return reject(`Base64 encoded data is set to unacceptable`);
                try {
                    const Bin = atob(BookData.replace(/^.*,/, ''));
                    const Buf = new Uint8Array(Bin.length);
                    for(let l = Bin.length, i = 0; i < l; i++) Buf[i] = Bin.charCodeAt(i);
                    BookData = new Blob([Buf.buffer], { type: BookInfo.BookDataMIMEType });
                    if(!BookData || !BookData.size || !BookData.type) throw '';
                } catch(_) {
                    return reject(Bibi.ErrorMessages.DataInvalid);
                }
                B.Path = '[Base64 Encoded Data]';
            } else {
                // Blob of EPUB/Zine Data
                if(!S['accept-blob-converted-data']) return reject(`Blob converted data is set to unacceptable`);
                B.Path = '[Blob Converted Data]';
            }
            if(!MIMETypeREs['EPUB'].test(BookData.type) && !MIMETypeREs['Zine'].test(BookData.type)) return reject(MIMETypeErrorMessage);
            FileOrData = 'data';
        }
        O.loadZippedBookData(BookData).then(() => {
            switch(B.Type) {
                case 'EPUB': case 'Zine':
                    B.ExtractionPolicy = 'at-once';
                    return resolve(`${ B.Type } ${ FileOrData }`);
                default:
                    return reject_failedToOpenTheBook(Bibi.ErrorMessages.DataInvalid);
            }
        }).catch(reject_failedToOpenTheBook);
    }
}).then(InitializedAs => {
    delete S['book-data'];
    delete S['book-data-mimetype'];
    return (B.Type == 'Zine' ? X.Zine.loadZineData() : L.loadContainer().then(L.loadPackage)).then(() => E.dispatch('bibi:initialized-book')).then(() => InitializedAs);
});


L.loadContainer = () => O.openDocument(B.Container.Source).then(L.loadContainer.process);

    L.loadContainer.process = (Doc) => B.Package.Source.Path = Doc.getElementsByTagName('rootfile')[0].getAttribute('full-path');


L.loadPackage = () => O.openDocument(B.Package.Source).then(L.loadPackage.process);

    L.loadPackage.process = (Doc) => { // This is Used also from the Zine Extention.
        Doc.Promises = []; E.dispatch('bibi:is-going-to:process-package', Doc);
        // ================================================================================
        // NAMESPACES
        // --------------------------------------------------------------------------------
        const XMLNS = {}, DocEle = Doc.documentElement;
        [DocEle, ...DocEle.children].forEach(_Ele => { if(!_Ele.hasAttributes()) return;
            const Atts = _Ele.attributes; Object.keys(Atts).forEach(i => { const Att = Atts[i]; if(!Att || !Att.name || !Att.value) return;
                const Matched = Att.name.match(/^xmlns:(\w+)$/);
                if(Matched) XMLNS[Matched[1]] = Att.value;
            })
        });
        const getOPFElementsByTagNameIn = (Anc, TN) => [...new Set([...Anc.getElementsByTagName(TN), ...Anc.getElementsByTagName('opf:' + TN), ...Anc.getElementsByTagNameNS(XMLNS['opf'], TN) ])],
               getDCElementsByTagNameIn = (Anc, TN) => [...new Set([                                 ...Anc.getElementsByTagName( 'dc:' + TN), ...Anc.getElementsByTagNameNS(XMLNS[ 'dc'], TN) ])];
        // ================================================================================
        // STRUCTURE
        // --------------------------------------------------------------------------------
        const _Package  = getOPFElementsByTagNameIn(Doc, 'package' )[0];
        const _Metadata = getOPFElementsByTagNameIn(Doc, 'metadata')[0], Metadata = B.Package.Metadata;
        const _Manifest = getOPFElementsByTagNameIn(Doc, 'manifest')[0], Manifest = B.Package.Manifest;
        const _Spine    = getOPFElementsByTagNameIn(Doc, 'spine'   )[0], Spine    = B.Package.Spine;
        const SourcePaths = {};
        // ================================================================================
        // METADATA
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:is-going-to:process-package-metadata', _Metadata);
        // --------------------------------------------------------------------------------
        const UIDID = _Package.getAttribute('unique-identifier'), UIDE = UIDID ? Doc.getElementById(UIDID) : null, UIDTC = UIDE ? UIDE.textContent : '';
        Metadata['unique-identifier'] = UIDTC ? UIDTC.trim() : '';
        ['identifier', 'language', 'title', 'creator', 'publisher'].forEach(Pro => sML.forEach(getDCElementsByTagNameIn(Doc, Pro))(_Meta => (Metadata[Pro] ? Metadata[Pro] : Metadata[Pro] = []).push(_Meta.textContent.trim())));
        sML.forEach(getOPFElementsByTagNameIn(_Metadata, 'meta'))(_Meta => {
            if(_Meta.getAttribute('refines')) return; // Should be solved.
            let Property = _Meta.getAttribute('property');
            if(Property) {
                if(/^dcterms:/.test(Property)) {
                    if(!Metadata[Property]) Metadata[Property] = [];
                    Metadata[Property].push(_Meta.textContent.trim()); // 'dcterms:~'
                } else {
                    Metadata[Property] = _Meta.textContent.trim(); // ex.) 'rendition:~'
                }
            } else {
                let Name = _Meta.getAttribute('name');
                if(Name) {
                    Metadata[Name] = _Meta.getAttribute('content').trim(); // ex.) 'cover'
                }
            }
        });
        // --------------------------------------------------------------------------------
        if(!Metadata['identifier']) Metadata['identifier'] = Metadata['dcterms:identifier'] || [];
        if(!Metadata['language'  ]) Metadata['language'  ] = Metadata['dcterms:language'  ] || ['en'];
        if(!Metadata['title'     ]) Metadata['title'     ] = Metadata['dcterms:title'     ] || Metadata['identifier'];
        Metadata['rendition:layout'] = Metadata['omf:version'] || Metadata['rendition:layout'] == 'pre-paginated' ? 'pre-paginated' : 'reflowable';
        Metadata['rendition:orientation'] = Metadata['rendition:orientation'] == 'landscape' ? 'landscape' : 'portrait';
        Metadata['rendition:spread'] = Metadata['rendition:spread'] == 'none' ? 'none' : Metadata['rendition:spread'] == 'both' || Metadata['rendition:spread'] == 'portrait' ? 'both' : 'landscape';
        if(!/^(scrolled-(continuous|doc)|paginated)$/.test(Metadata['rendition:flow'])) Metadata['rendition:flow'] = 'auto';
        if(!/^(ttb|ltr|rtl|vertical|horizontal)$/.test(Metadata['scroll-direction'])) delete Metadata['scroll-direction'];
        if( Metadata[     'original-resolution']) Metadata[     'original-resolution'] = O.getViewportByOriginalResolution(Metadata[     'original-resolution']);
        if( Metadata[      'rendition:viewport']) Metadata[      'rendition:viewport'] = O.getViewportByMetaContent(       Metadata[      'rendition:viewport']);
        if( Metadata['fixed-layout-jp:viewport']) Metadata['fixed-layout-jp:viewport'] = O.getViewportByMetaContent(       Metadata['fixed-layout-jp:viewport']);
        if( Metadata[            'omf:viewport']) Metadata[            'omf:viewport'] = O.getViewportByMetaContent(       Metadata[            'omf:viewport']);
        // --------------------------------------------------------------------------------
        B.ID        =  Metadata['unique-identifier'] || Metadata['identifier'][0] || '';
        B.Language  =  Metadata['language'][0].split('-')[0];
        B.Title     =  Metadata['title'     ].join(', ');
        B.Creator   = !Metadata['creator'   ] ? '' : Metadata['creator'  ].join(', ');
        B.Publisher = !Metadata['publisher' ] ? '' : Metadata['publisher'].join(', ');
        R.title();
        B.PrePaginated = Metadata['rendition:layout'] == 'pre-paginated';
        B.Reflowable = !B.PrePaginated;
        B.ICBViewport = Metadata['original-resolution'] || Metadata['rendition:viewport'] || Metadata['fixed-layout-jp:viewport'] || Metadata['omf:viewport'] || null;
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:processed-package-metadata', _Metadata);
        // ================================================================================
        // MANIFEST
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:is-going-to:process-package-manifest', _Manifest);
        // --------------------------------------------------------------------------------
        const PackageDir = B.Package.Source.Path.replace(/\/?[^\/]+$/, '');
        sML.forEach(getOPFElementsByTagNameIn(_Manifest, 'item'))(_Item => {
            let Source = {
                'id': _Item.getAttribute('id'),
                'href': _Item.getAttribute('href'),
                'media-type': _Item.getAttribute('media-type')
            };
            if(/^https?:\/\//i.test(Source['href'])) {
                if(S['allow-external-item-href'] && S['trustworthy-origins'].includes(new URL(Source['href']).origin)) Source.External = true;
                else Source['href'] = '';
            }
            if(!Source['id'] || !Source['href'] || (!Source['media-type'] && B.Type == 'EPUB')) return false;
            Source.Path = Source.External ? Source['href'] : O.rrr(PackageDir + '/' + Source['href']);
            if(Manifest[Source.Path]) Source = Object.assign(Manifest[Source.Path], Source);
            if(!Source.Content) Source.Content = '';
            Source.Of = [];
            let Properties = _Item.getAttribute('properties');
            if(Properties) {
                Properties = Properties.trim().replace(/\s+/g, ' ').split(' ');
                     if(Properties.includes('cover-image')) B.CoverImage.Source = Source;
                else if(Properties.includes('nav'        )) B.Nav.Source        = Source, B.Nav.Type = 'Navigation Document';
            }
            const FallbackItemID = _Item.getAttribute('fallback');
            if(FallbackItemID) Source['fallback'] = FallbackItemID;
            Manifest[Source.Path] = Source;
            SourcePaths[Source['id']] = Source.Path;
        });
        [B.Container, B.Package].forEach(Meta => { if(Meta && Meta.Source) Meta.Source.Content = ''; });
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:processed-package-manifest', _Manifest);
        // ================================================================================
        // SPINE
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:is-going-to:process-package-spine', _Spine);
        // --------------------------------------------------------------------------------
        if(!B.Nav.Source) {
            const Source = Manifest[SourcePaths[_Spine.getAttribute('toc')]];
            if(Source) B.Nav.Source = Source, B.Nav.Type = 'TOC-NCX';
        }
        if(       B.Nav.Source)        B.Nav.Source.Of.push(       B.Nav);
        if(B.CoverImage.Source) B.CoverImage.Source.Of.push(B.CoverImage);
        // --------------------------------------------------------------------------------
        B.PPD = Spine['page-progression-direction'] = _Spine.getAttribute('page-progression-direction');
        if(!B.PPD || !/^(ltr|rtl)$/.test(B.PPD)) B.PPD = S['default-page-progression-direction']; // default;
        // --------------------------------------------------------------------------------
        const RenditionPropertyRE = /^((rendition:)?(layout|orientation|spread|page-spread))-([a-z\-]+)$/;
        const      BibiPropertyRE = /^(bibi:(allow-placeholder|no-adjustment|no-padding))$/;
        let SpreadBefore, SpreadAfter;
        if(B.PPD == 'rtl') SpreadBefore = 'right', SpreadAfter = 'left';
        else               SpreadBefore = 'left',  SpreadAfter = 'right';
        const SpreadsDocumentFragment = document.createDocumentFragment();
        sML.forEach(getOPFElementsByTagNameIn(_Spine, 'itemref'))(ItemRef => {
            const IDRef = ItemRef.getAttribute('idref'); if(!IDRef) return false;
            const Source = Manifest[SourcePaths[IDRef]]; if(!Source) return false;
            const Item = sML.create('iframe', { className: 'item', scrolling: 'no', allowtransparency: 'true', /*TimeCard: {}, stamp: function(What) { O.stamp(What, this.TimeCard); },*/
                IsItem: true,
                Source: Source,
                Type: O.getItemType(Source['media-type']),
                AnchorPath: Source.Path,
                FallbackChain: [],
                Scale: 1,
                Viewport: B.ICBViewport
            });
            Item['idref'] = IDRef;
            if(S['prioritise-fallbacks']) while(Item.Source['fallback']) {
                const FallbackItem = Manifest[SourcePaths[Item.Source['fallback']]];
                if(FallbackItem) Item.FallbackChain.push(Item.Source = FallbackItem);
                else delete Item.Source['fallback'];
            }
            Item.Source.Of.push(Item);
            let Properties = ItemRef.getAttribute('properties');
            if(Properties) {
                Properties = Properties.trim().replace(/\s+/g, ' ').split(' ');
                Properties.forEach(Pro => {
                    if(RenditionPropertyRE.test(Pro)) ItemRef[Pro.replace(RenditionPropertyRE, '$1')] = Pro.replace(RenditionPropertyRE, '$4');
                    if(     BibiPropertyRE.test(Pro)) ItemRef[Pro.replace(     BibiPropertyRE, '$1')] = true;
                });
            }
            Item['rendition:layout']       = ItemRef['rendition:layout']       || Metadata['rendition:layout']; if(Item['rendition:layout'] != 'pre-paginated') Item['rendition:layout'] = 'reflowable';
            Item['rendition:orientation']  = ItemRef['rendition:orientation']  || Metadata['rendition:orientation'];
            Item['rendition:spread']       = ItemRef['rendition:spread']       || Metadata['rendition:spread'];
            Item['rendition:page-spread']  = ItemRef['rendition:page-spread']  || ItemRef['page-spread'] || undefined;
            Item['bibi:allow-placeholder'] = ItemRef['bibi:allow-placeholder'] || undefined;
            Item['bibi:no-adjustment']     = ItemRef['bibi:no-adjustment']     || undefined;
            Item['bibi:no-padding']        = ItemRef['bibi:no-padding']        || undefined;
            Object.assign(Item, Item['rendition:layout'] == 'reflowable' ? {
                Reflowable: true, PrePaginated: false,
                AllowPlaceholder: B.ExtractionPolicy != 'at-once' && Item['bibi:allow-placeholder'],
                NoAdjustment: Item['bibi:no-adjustment'] ? true : false,
                NoPadding: Item['bibi:no-padding'] ? true : false
            } : {
                Reflowable: false, PrePaginated: true,
                AllowPlaceholder: B.ExtractionPolicy != 'at-once' && (Item['bibi:allow-placeholder'] || Metadata['rendition:layout'] == 'pre-paginated'),
                NoAdjustment: true,
                NoPadding: true
            });
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            Item.IndexInSpine = Spine.push(Item) - 1;
            if(ItemRef.getAttribute('linear') == 'no') {
                Item['linear'] = 'no',  Item.IsLinearItem = false, Item.IsNonLinearItem = true;
                Item.IndexInNonLinearItems = R.NonLinearItems.push(Item) - 1;
            } else {
                Item['linear'] = 'yes', Item.IsLinearItem = true,  Item.IsNonLinearItem = false;
                Item.Index = R.Items.push(Item) - 1;
                let Spread = null;
                if(Item.PrePaginated && Item['rendition:page-spread'] == SpreadAfter && Item.Index > 0) {
                    const PreviousItem = R.Items[Item.Index - 1];
                    if(Item.PrePaginated && PreviousItem['rendition:page-spread'] == SpreadBefore) {
                        PreviousItem.SpreadPair = Item;
                        Item.SpreadPair = PreviousItem;
                        Spread = Item.Spread = PreviousItem.Spread;
                        Spread.Box.classList.remove('single-item-spread-before', 'single-item-spread-' + SpreadBefore);
                        Spread.Box.classList.add(Item['rendition:layout']);
                        Spread.PrePaginated = PreviousItem.PrePaginated && Item.PrePaginated;
                    }
                }
                if(!Spread) {
                    Spread = Item.Spread = sML.create('div', { className: 'spread',
                        IsSpread: true,
                        Items: [], Pages: [],
                        Index: R.Spreads.length,
                        PrePaginated: Item.PrePaginated
                    });
                    Spread.Box = sML.create('div', { className: 'spread-box ' + Item['rendition:layout'], IsSpreadBox: true, Inside: Spread, Spread: Spread });
                    if(Item['rendition:page-spread']) {
                        Spread.Box.classList.add('single-item-spread-' + Item['rendition:page-spread']);
                        switch(Item['rendition:page-spread']) {
                            case SpreadBefore: Spread.Box.classList.add('single-item-spread-before'); break;
                            case SpreadAfter:  Spread.Box.classList.add('single-item-spread-after' ); break;
                        }
                    }
                    R.Spreads.push(SpreadsDocumentFragment.appendChild(Spread.Box).appendChild(Spread));
                }
                Item.IndexInSpread = Spread.Items.push(Item) - 1;
                Item.Box = Spread.appendChild(sML.create('div', { className: 'item-box ' + Item['rendition:layout'], IsItemBox: true, Inside: Item, Item: Item }));
                Item.Pages = [];
                const Page = sML.create('span', { className: 'page',
                    IsPage: true,
                    Spread: Spread, Item: Item,
                    IndexInItem: 0
                });
                Item.Pages.push(Item.Box.appendChild(Page));
                I.PageObserver.observePageIntersection(Page);
            }
        });
        R.createSpine(SpreadsDocumentFragment);
        // --------------------------------------------------------------------------------
        B.WritingMode =                                                                                   /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) ? (B.PPD == 'rtl' ? 'tb-rl' : 'lr-tb')
            :                                                                                                             /^(mo?n)$/.test(B.Language) ?                   'tb-lr'
            : /^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language) ?                             'rl-tb'
            :                                                                                                                                                                       'lr-tb';
        if(S['reader-view-mode'] == 'auto') {
            const RVMPriority = (() => {
                const Default    = ['paged', 'horizontal', 'vertical'];
                const Scrolled_H = ['horizontal', 'paged', 'vertical'];
                const Scrolled_V = ['vertical', 'horizontal', 'paged'];
                switch(Metadata['scroll-direction']) {
                    case 'ttb':             case   'vertical': return Scrolled_V;
                    case 'ltr': case 'rtl': case 'horizontal': return Scrolled_H;
                }
                switch(Metadata['rendition:flow']) {
                    case 'scrolled-continuous': case 'scrolled-doc': return /-tb$/.test(B.WritingMode) ? Scrolled_V : Scrolled_H;
                }
                return Default;
            })();
            for(let i = 0; i < 3; i++) if(S['available-reader-view-modes'].includes(RVMPriority[i])) {
                S['reader-view-mode'] = RVMPriority[i];
                break;
            }
        };
        // --------------------------------------------------------------------------------
        E.dispatch('bibi:processed-package-spine', _Spine);
        // ================================================================================
        E.dispatch('bibi:processed-package', Doc); return Promise.all(Doc.Promises);
    };


L.createCover = () => {
    if(L.createCover.Not) return Promise.resolve();
    const VCover = I.Veil.Cover, PCover = I.Panel.BookInfo.Cover;
    VCover.Info.innerHTML = PCover.Info.innerHTML = [
        [B.Title,   'strong'],
        [B.Creator,     'em'],
        [B.Publisher, 'span']
    ].map(BookMetaAndTagName => {
        const [BookMeta, TagName] = BookMetaAndTagName;
        return BookMeta ? `<` + TagName + `><span>` + BookMeta.replace(/([ 　・／]+)/g, '</span><span>$1') + `</span></` + TagName + `>` : '';
    }).filter(TaggedBookMeta => TaggedBookMeta).join(' ');
    let VCoverIcon = null, PCoverIcon = null, AltShown = false;
    const TimerID_showAlt = setTimeout(() => {
        VCoverIcon = VCover.insertBefore(I.getBookIcon(), VCover.Info);
        PCoverIcon = PCover.insertBefore(I.getBookIcon(), PCover.Info);
        VCover.className = PCover.className = 'without-cover-image';
        AltShown = true;
    }, 999);
    return new Promise((resolve, reject) => {
        if(!B.CoverImage.Source || !B.CoverImage.Source.Path) return reject();
        O.file(B.CoverImage.Source, { URI: true }).then(resolve).catch(reject);
    }).then(CoverImageSource => {
        clearTimeout(TimerID_showAlt);
        if(AltShown) {
            VCover.className = PCover.className = '';
            VCoverIcon.remove(), PCoverIcon.remove();
        }
        const CoverImageURI = CoverImageSource.URI;
        sML.style(VCover, { 'background-image': 'url(' + CoverImageURI + ')' });
        PCover.insertBefore(sML.create('img', { src: CoverImageURI }), PCover.Info);
        VCover.className = PCover.className = 'with-cover-image';
    }).catch(() => {
        // (do nothing)
    });
};
    L.createCover.Not = false;


L.loadNavigation = () => O.openDocument(B.Nav.Source).then(Doc => {
    const PNav = I.Panel.BookInfo.Navigation = I.Panel.BookInfo.insertBefore(sML.create('div', { id: 'bibi-panel-bookinfo-navigation' }), I.Panel.BookInfo.firstElementChild);
    PNav.innerHTML = '';
    const NavContent = document.createDocumentFragment();
    if(B.Nav.Type == 'Navigation Document') {
        sML.forEach(Doc.querySelectorAll('nav'))(Nav => {
            switch(Nav.getAttribute('epub:type')) {
                case 'toc':       Nav.classList.add('bibi-nav-toc'); break;
                case 'landmarks': Nav.classList.add('bibi-nav-landmarks'); break;
                case 'page-list': Nav.classList.add('bibi-nav-page-list'); break;
            }
            sML.forEach(Nav.getElementsByTagName('*'))(Ele => Ele.removeAttribute('style'));
            NavContent.appendChild(Nav);
        });
    } else { // toc.ncx
        const makeNavOLTree = (Ele) => {
            const ChildNodes = Ele.childNodes;
            let OL = undefined;
            for(let l = ChildNodes.length, i = 0; i < l; i++) {
                if(ChildNodes[i].nodeType != 1 || !/^navPoint$/i.test(ChildNodes[i].tagName)) continue;
                const NavPoint = ChildNodes[i];
                const NavLabel = NavPoint.getElementsByTagName('navLabel')[0];
                const Content  = NavPoint.getElementsByTagName('content')[0];
                const Text = NavPoint.getElementsByTagName('text')[0];
                if(!OL) OL = document.createElement('ol');
                const LI = sML.create('li', { id: NavPoint.getAttribute('id') }); LI.setAttribute('playorder', NavPoint.getAttribute('playorder'));
                const A  = sML.create('a', { href: Content.getAttribute('src'), innerHTML: Text.innerHTML.trim() });
                OL.appendChild(LI).appendChild(A);
                const ChildOL = makeNavOLTree(NavPoint);
                if(ChildOL) LI.appendChild(ChildOL);
            }
            return OL;
        };
        const NavOL = makeNavOLTree(Doc.getElementsByTagName('navMap')[0]);
        if(NavOL) NavContent.appendChild(document.createElement('nav')).appendChild(NavOL);
    }
    PNav.appendChild(NavContent);
    L.coordinateLinkages({ RootElement: PNav, BasePath: B.Nav.Source.Path, InNav: true });
    if(B.Nav.Source.Of.length == 1) B.Nav.Source.Content = '';
    return PNav;
});


L.coordinateLinkages = (Opt) => {
    if(typeof Opt             != 'object') return;
    if(typeof Opt.RootElement != 'object' || !Opt.RootElement || Opt.RootElement.nodeType != 1) return;
    if(typeof Opt.BasePath    != 'string' || !Opt.BasePath) return;
    const As = Opt.RootElement.getElementsByTagName('a'); if(!As) return;
    const BaseDir = Opt.BasePath.replace(/\/?([^\/]+)$/, '');
    for(let l = As.length, i = 0; i < l; i++) { const A = As[i];
        if(A.InNav = Opt.InNav ? true : false) {
            A.NavANumber = i + 1;
            A.addEventListener(E['pointerdown'], Eve => Eve.stopPropagation());
            A.addEventListener(E['pointerup'],   Eve => Eve.stopPropagation());
        }
        let HRefPathInSource = A.getAttribute('href'), HRefAttribute = 'href';
        if(!HRefPathInSource) {
            HRefPathInSource = A.getAttribute('xlink:href');
            if(HRefPathInSource) {
                HRefAttribute = 'xlink:href';
            } else {
                if(A.InNav) {
                    A.addEventListener('click', Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; });
                    A.classList.add('bibi-bookinfo-inactive-link');
                }
                continue;
            }
        }
        if(/^[a-zA-Z]+:/.test(HRefPathInSource)) {
            A.Destination = { External: HRefPathInSource };
        } else {
            const HRefPath = /^#/.test(HRefPathInSource) ? Opt.BasePath + HRefPathInSource : O.rrr(BaseDir + '/' + HRefPathInSource);
            const HRefFnH = HRefPath.split('#');
            const HRefFile = HRefFnH[0] ? HRefFnH[0] : Opt.BasePath;
            const HRefHash = HRefFnH[1] ? HRefFnH[1] : '';
            if(HRefHash && /^epubcfi\(.+?\)$/.test(HRefHash)) {
                A.Destination = R.getCFIDestination(HRefHash);
            } else sML.forEach(R.Items)(Item => {
                if(HRefFile == Item.AnchorPath) {
                    A.Destination = { ItemIndex: Item.Index }; // not IIPP. ElementSelector may be added.
                    if(HRefHash) A.Destination.ElementSelector = '#' + HRefHash;
                    return 'break'; //// break sML.forEach()
                }
            });
            if(A.Destination) {
                A.setAttribute('data-bibi-original-href', HRefPathInSource);
                A.setAttribute(HRefAttribute, B.Path + '/' + HRefPath);
            }
        }
        if(A.Destination) {
            A.jump = (Eve, Opt = {}) => {
                Eve.preventDefault(), Eve.stopPropagation();
                return (A.InNav ? I.Panel.toggle() : Promise.resolve()).then(() => {
                    if(A.Destination.External) {
                        // Go External
                        const TargetInSource = A.getAttribute('target');
                        if(/^_(parent|self|top)$/.test(TargetInSource)) location.href = A.Destination.External;
                        else                                                window.open(A.Destination.External);
                    } else if(L.Waiting) {
                        // Open with Links in Nav
                        if(S['start-in-new-window']) {
                            L.openNewWindow(location.href + (location.hash ? '&' : '#') + 'jo(nav=' + A.NavANumber + ')');
                        } else {
                            R.StartOn = A.Destination;
                            return L.play();
                        }
                    } else if(L.Opened) {
                        if(!A.InNav && I.Footnotes && !Opt.PreventFootnote && I.Footnotes.show(A)) return Promise.resolve();
                        const Dest = R.dest(A.Destination);
                        if(!Dest) return Promise.reject();
                        E.dispatch('bibi:jumps-a-link', Eve);
                        if(!S['manualize-adding-histories']) I.History.add();
                        return R.focusOn(A.Destination, { Duration: 0 }).then(Destination => {
                            if(!S['manualize-adding-histories']) I.History.add({ UI: Opt.UI|| B, SumUp: false, Destination: Destination });
                            E.dispatch('bibi:jumped-a-link', Eve);
                        });
                    }
                });
            };
            A.addEventListener('click', Eve => A.jump(Eve));
        }
        if(A.InNav && R.StartOn && R.StartOn.Nav == (i + 1) && A.Destination && !A.Destination.External) R.StartOn = A.Destination;
    }
};


L.preprocessResources = () => {
    E.dispatch('bibi:is-going-to:preprocess-resources');
    const Promises = [], PreprocessedResources = [], pushItemPreprocessingPromise = (Item, URI) => Promises.push(O.file(Item, { Preprocess: true, URI: URI }).then(() => PreprocessedResources.push(Item)));
    if(B.ExtractionPolicy) for(const FilePath in B.Package.Manifest) {
        const Item = B.Package.Manifest[FilePath];
        if(/\/(css|javascript)$/.test(Item['media-type'])) { // CSSs & JavaScripts in Manifest
            if(!Promises.length) O.log(`Preprocessing Resources...`, '<g:>');
            pushItemPreprocessingPromise(Item, true);
        }
    }
    return Promise.all(Promises).then(() => {/*
        if(B.ExtractionPolicy != 'at-once' && (B.PrePaginated || (sML.UA.Chromium || sML.UA.WebKit || sML.UA.Gecko))) return resolve(PreprocessedResources);
        R.Items.forEach(Item => pushItemPreprocessingPromise(Item, O.isBin(Item))); // Spine Items
        return Promise.all(Promises).then(() => resolve(PreprocessedResources));*/
        if(PreprocessedResources.length) {
            O.log(`Preprocessed: %O`, PreprocessedResources);
            O.log(`Preprocessed. (${ PreprocessedResources.length } Resource${ PreprocessedResources.length > 1 ? 's' : '' })`, '</g>');
        }
        E.dispatch('bibi:preprocessed-resources');
    });
};


L.loadSpread = (Spread, Opt = {}) => new Promise((resolve, reject) => {
    Spread.AllowPlaceholderItems = (S['allow-placeholders'] && Opt.AllowPlaceholderItems);
    let LoadedItemsInSpread = 0, SkippedItemsInSpread = 0;
    Spread.Items.forEach(Item => {
        L.loadItem(Item, { AllowPlaceholder: Opt.AllowPlaceholderItems })
        .then(() =>  LoadedItemsInSpread++) // Loaded
       .catch(() => SkippedItemsInSpread++) // Skipped
        .then(() => {
            if(LoadedItemsInSpread + SkippedItemsInSpread == Spread.Items.length) /*(SkippedItemsInSpread ? reject : resolve)*/resolve(Spread);
        });
    });
});


L.loadItem = async (Item, Opt = {}) => {
    const ProcessID = Item.LoadingProcessID = O.id();
    await Promise.resolve(Item.Loading);
    const IsPlaceholder = (S['allow-placeholders'] && Item.AllowPlaceholder && Opt.AllowPlaceholder) ? true : false;
    const ItemBox = Item.Box;
    const classify = (ClassName, TF) => [Item, ItemBox].forEach(TF ? Ele => Ele.classList.add(ClassName) : Ele => Ele.classList.remove(ClassName));
    let ContentURL;
    return Item.Loading = new Promise((resolve, reject) => {
        Item.IsPlaceholder = IsPlaceholder;
        classify('loading', true);
        classify('loaded', false);
        classify('placeholder', IsPlaceholder);
        !IsPlaceholder ? resolve() : reject('Placeholder');
    }).then(() => O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.loadItem' },
        async () => {
            if(Item.Source.External) {
                if(!S['allow-external-item-href']) return Promise.reject('External Item Not Allowed');
                return ContentURL = Item.Source.Path;
            }
            await O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.loadItem > building Item.SourceText' },
                () => L.buildItemSourceText(Item),
                async () => ContentURL = !O.EnabledIFramesWithBlobURL ? undefined : await O.createBlobURL('Text', Item.SourceText, 'application/xhtml+xml')
            );
        },
        () => new Promise(resolve => {
            Item.onLoaded = () => {
                clearInterval(Item.ReloadTimer);
                URL.revokeObjectURL(ContentURL);
                Item.removeEventListener('load', Item.onLoaded);
                delete Item.onLoaded;
                resolve();
            };
            if(ContentURL) {
                Item.addEventListener('load', Item.onLoaded);
                Item.src = ContentURL;
                ItemBox.insertBefore(Item, ItemBox.firstChild);
                Item.ReloadTimer = setInterval(() => { if(Item.contentDocument?.readyState == 'interactive') Item.src = Item.src; }, 8888);
            } else {
                Item.src = '';
                ItemBox.insertBefore(Item, ItemBox.firstChild);
                Item.contentDocument.open();
                Item.contentDocument.write(
                    Item.SourceText = Item.SourceText
                        .replace(/<[\?\!][^>]+?>/g, '').trim()
                        .replace(/<([a-z][a-z0-9]*)([^>]*?)\s*\/>/g, '<$1$2></$1>')
                        .replace('</head>', `<script id="bibi-onload">window.addEventListener('load', () => { parent.R.Items[${ Item.Index }].onLoaded(); document.getElementById('bibi-onload').remove(); });</script>\n</head>`)
                );
                Item.contentDocument.close();
            }
        }),
        () => L.postprocessItem(Item)
    )).then(() => {
        O.log(`Item#${ String(Item.Index).padStart(3, 0) } is turned UP.`);
        classify('loaded', true);
        Item.Loaded = true;
        Item.Turned = 'Up';
        // Item.stamp('Loaded');
        E.dispatch('bibi:loaded-item', Item);
    }).catch(Reason => { // Placeholder (or Error)
        O.log(`Item#${ String(Item.Index).padStart(3, 0) } is turned DOWN:`, Reason);
        classify('loaded', false);
        classify('placeholder', true);
        if(Item.contentWindow) Item.contentWindow.stop() || O.log(`Item#${ String(Item.Index).padStart(3, 0) } STOPPED its window.`);
        if(Item.contentDocument) Item.contentDocument.querySelectorAll('[src], [*|href]').forEach(Ele => ['src','href','xlink:href'].forEach(Att => Ele.removeAttribute(Att)) || Ele.remove()) || O.log(`Item#${ String(Item.Index).padStart(3, 0) } REMOVED its elements.`);
        if(Item.parentElement) Item.parentElement.removeChild(Item);
        Item.src = '';
        Item.HTML = Item.Head = Item.Body = Item.Foot = Item.Pages[0];
        Item.IsPlaceholder = true;
        Item.Loaded = false;
        Item.Turned = 'Down';
        E.dispatch('bibi:prepared-placeholder', Item);
    }).then(() => {
        classify('loading', false);
        clearInterval(Item.ReloadTimer);
        URL.revokeObjectURL(ContentURL);
        Item.removeEventListener('load', Item.onLoaded);
        delete Item.onLoaded;
        delete Item.Source.Content;
        delete Item.Source.Preprocessed;
        delete Item.Source.Retlieved;
        delete Item.SourceText;
        delete Item.LoadingProcessID;
        window.focus();
        return Item;
    });
};

L.buildItemSourceText = (Item) => {
    const ProcessID = Item.LoadingProcessID;
    const DeclarationsRE = /<[\?\!]\w[^>]+?>/g;
    let Declarations, AdditionalHeader;
    return O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.buildItemSourceText' },
        () => E.dispatch('bibi:is-going-to:build-item-source-text', Item),
        () => (Opt => !Opt ? Promise.reject('Item.Type Unknown') : O.file(Item.Source, {
            Preprocess: Opt.Preprocess,
            URI: Opt.URI,
            initialize: () => O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.buildItemSourceText > O.file > initialize' },
                Opt.initialize_before,
                () => E.dispatch('bibi:is-going-to:initialize-item-source', Item),
                Opt.initialize_main,
                () => E.dispatch('bibi:initialized-item-source', Item),
                Opt.initialize_after
            ),
            finalize: Opt.finalize
        }))(
            Item.Type == 'MarkupDocument' ? {
                Preprocess: (B.ExtractionPolicy || sML.UA.Gecko), // Preprocess if archived (or Gecko. For such books as styled only with -webkit/epub- prefixed properties. It's NOT Gecko's fault but requires preprocessing.)
                initialize_before: () => Item.SourceText = Item.Source.Content.trim(),
                initialize_main: async () => {
                    Declarations = Item.SourceText.match(DeclarationsRE);
                    if(Declarations) Item.SourceText = Item.SourceText.replace(DeclarationsRE, '').trim();
                    if(/<object\s/.test(Item.SourceText) && Item.SourceText.match(/<object\s[^>]+?>/g).filter(Obj => /\stype\s*=\s*["']image\/svg\+xml["']/.test(Obj) && /\sdata\s*=\s*["'](?!([a-zA-Z]+:)?\/+).+?\.svg["']/.test(Obj)).length) {
                        const ItemDOM = O.parseDOM(Item.SourceText, Item.Source['media-type']);
                        await Promise.all(Array.prototype.map.call(ItemDOM.querySelectorAll('object[type="image/svg+xml"][data$=".svg"]'), SOE => {
                            const ItemURL = new URL(Item.Source.Path, 'bibi:/'), SVGURL = new URL(SOE.getAttribute('data'), ItemURL), SVGSource = B.Package.Manifest[SVGURL?.pathname.slice(1)];
                            if(SVGSource) return O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.buildItemSourceText > O.file > initialize > object svg' },
                                () => O.file(SVGSource),
                                () => {
                                    const SVGDOM = O.parseDOM(SVGSource.Content, SVGSource['media-type']);
                                    [['src','src'], ['href','href'], ['*|href','xlink:href']].forEach(SA => SVGDOM.querySelectorAll(`[${ SA[0] }]`).forEach(Ele => Ele.setAttribute(SA[1], O.relativePath({ From: ItemURL, To: new URL(Ele.getAttribute(SA[1]), SVGURL) }))));
                                    SOE.removeAttribute('data'), SOE.removeAttribute('type');
                                    SOE.innerHTML = SVGDOM.documentElement.outerHTML;
                                }
                            );
                        }));
                        Item.SourceText = ItemDOM.documentElement.outerHTML;
                    }
                    if(!S['allow-scripts-in-content']) {
                        Item.SourceText = O.sanitizeItemSourceText(Item.SourceText, { As: 'XHTML' });
                    }
                    if(Declarations) Item.SourceText = [...Declarations, Item.SourceText].join('\n');
                },
                initialize_after: () => Item.Source.Content = Item.SourceText,
                finalize: () => Item.SourceText = Item.Source.Content
            } :
            Item.Type == 'SVG' ? {
                Preprocess: B.ExtractionPolicy,
                initialize_before: () => Item.SourceText = Item.Source.Content.trim(),
                initialize_main: () => {
                    Declarations = Item.SourceText.match(DeclarationsRE);
                    if(Declarations) Item.SourceText = Item.SourceText.replace(DeclarationsRE, '').trim();
                    if(!S['allow-scripts-in-content']) {
                        Item.SourceText = Item.SourceText.replace(/\s+xlink:href\s*=\s*(["'])blob:/ig, ' data-xlink-href-blob=$1');
                        Item.SourceText = Item.SourceText.replace(      /\s+href\s*=\s*(["'])blob:/ig,       ' data-href-blob=$1');
                        Item.SourceText = O.sanitizeItemSourceText(Item.SourceText, { As: 'SVG' });
                        Item.SourceText = Item.SourceText.replace(         / data-href-blob=(["'])/ig,            ' href=$1blob:');
                        Item.SourceText = Item.SourceText.replace(   / data-xlink-href-blob=(["'])/ig,      ' xlink:href=$1blob:');
                    }
                    if(Declarations) Item.SourceText = [...Declarations, Item.SourceText].join('\n');
                },
                initialize_after: () => Item.Source.Content = Item.SourceText,
                finalize: () => {
                    Item.SourceText = Item.Source.Content
                    const CSSLinks = [];
                    if(Declarations = Item.SourceText.match(DeclarationsRE)) {
                        Declarations.forEach(Declaration => {
                            const StyleSheetPath = Declaration.match(/^<\?xml-stylesheet\s(?:[^>]+?\s)?href\s*=\s*["'](?![a-z]+:\/\/)(.+?)['"]/)?.[1];
                            if(!StyleSheetPath) return;
                            if(Item.Source.Preprocessed) { if(!/^blob:/.test(StyleSheetPath)) return; }
                            else                         { if(!B.Package.Manifest[new URL(StyleSheetPath, new URL(Item.Source.Path, 'bibi:/')).pathname.slice(1)]) return; }
                            CSSLinks.push(Declaration.replace(/^<\?xml-stylesheet\s+/, '<link rel="stylesheet" ').replace(/\s*\?>$/, ' />'));
                        });
                        Item.SourceText = Item.SourceText.replace(DeclarationsRE, '').trim();
                    }
                    if(CSSLinks.length) AdditionalHeader = CSSLinks.join('\n');
                }
            } :
            Item.Type == 'BitmapImage' ? {
                URI: true,
                initialize_before: () => Item.SourceText = `<img class="bibi-spine-item-image" alt="" src="bibi:/${ Item.Source.Path }" />`,
                finalize: () => {
                    Item.SourceText = Item.SourceText.replace('bibi:/' + Item.Source.Path, Item.Source.URI); // URI is BlobURL or URI
                }
            } :
            null
        ),
        async () => {
            const ViewportMeta = Item.PrePaginated && (Item.Viewport = await O.getItemViewport(Item) || Item.Viewport || null)
                ? `<meta name="viewport" content="width=${ Item.Viewport.Width }, height=${ Item.Viewport.Height }" />`
                : `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />`;
            if(Item.Type == 'MarkupDocument') {
                Item.SourceText = Item.SourceText.replace(/(<head(\s[^>]+)?>)/i, `$1\n` + ViewportMeta);
            } else {
                Item.SourceText = [
                    `<?xml version="1.0"?>`,
                    `<!DOCTYPE html>`,
                    `<html xmlns="http://www.w3.org/1999/xhtml">`,
                        `<head>`,
                            ViewportMeta,
                            `<meta charset="utf-8" />`,
                            `<title>${ B.FullTitle } - #${ Item.Index + 1 }/${ R.Items.length }</title>`,
                            (AdditionalHeader ? AdditionalHeader + '\n' : '') +
                        `</head>`,
                        `<body>`,
                            Item.SourceText,
                        `</body>`,
                    `</html>`
                ].join('\n');
            }
            Item.SourceText = Item.SourceText.replace(/(<head(\s[^>]+)?>)/i,
                `$1\n<link rel="stylesheet" id="bibi-default-style" href="${ Bibi.BookStyleURL }" />` +
                (!B.ExtractionPolicy && !Item.Source.Preprocessed ? `\n<base href="${ B.Path + '/' + Item.Source.Path }" />` : '')
            );
        },
        () => E.dispatch('bibi:built-item-source-text', Item)
    );
};


L.postprocessItem = (Item) => {
    const ProcessID = Item.LoadingProcessID;
    return O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.postprocessItem' },
        () => E.dispatch('bibi:is-going-to:postprocess-item', Item),
        () => {
            // Item.stamp('Postprocess');
            Item.HTML = Item.contentDocument.documentElement; Item.HTML.classList.add(...sML.Environments);
            Item.Head = Item.contentDocument.head;
            Item.Body = Item.contentDocument.body;
            Item.Foot = Item.HTML.appendChild(Item.contentDocument.createElement('foot'));
            Item.HTML.Item = Item.Head.Item = Item.Body.Item = Item;
            const XMLLang = Item.HTML.getAttribute('xml:lang'), Lang = Item.HTML.getAttribute('lang');
                 if(!XMLLang && !Lang) Item.HTML.setAttribute('xml:lang', B.Language), Item.HTML.setAttribute('lang', B.Language);
            else if(!XMLLang         ) Item.HTML.setAttribute('xml:lang', Lang);
            else if(            !Lang)                                                 Item.HTML.setAttribute('lang', XMLLang);
            const ViewportMetaElements = Item.Head.querySelectorAll('meta[name="viewport"]');
            for(let i = ViewportMetaElements.length - 2; i >= 0; i--) ViewportMetaElements[i].remove();
            sML.forEach(Item.Body.getElementsByTagName('link'))(Link => Item.Head.appendChild(Link));
            if(Item.Reflowable && !Item.NoAdjustment) Item.contentDocument.querySelectorAll('html, body, body>*:not(script):not(style)').forEach(Ele => Ele.style.direction = Ele.BibiDefaultDirection = getComputedStyle(Ele).direction);
            sML.appendCSSRule(Item.contentDocument, 'html', '-webkit-text-size-adjust: 100%;');
            L.coordinateLinkages({ RootElement: Item.Body, BasePath: Item.Source.Path });
            const Lv1Eles = Item.contentDocument.querySelectorAll('body>*:not(script):not(style)');
            if(Lv1Eles && Lv1Eles.length == 1) {
                const Lv1Ele = Item.contentDocument.querySelector('body>*:not(script):not(style)');
                     if(    /^svg$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleSVG = true;
                else if(    /^img$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleImg = true;
                else if( /^iframe$/i.test(Lv1Ele.tagName)) Item.Outsourcing =                      true;
                else if(!O.getElementInnerText(Item.Body)) Item.Outsourcing =                      true;
            }
            sML.forEach(Item.Body.querySelectorAll('svg'))(SVG => { if(SVG.getAttribute('viewBox')) return;
                const Images = SVG.querySelectorAll('image, img, canvas'); if(Images.length != 1) return;
                const Image = Images[0];
                const ImageW = Image.getAttribute('width' ); if(!/^\d+$/.test(ImageW)) return;
                const ImageH = Image.getAttribute('height'); if(!/^\d+$/.test(ImageH)) return;
                SVG.setAttribute('viewBox', [0, 0, ImageW, ImageH].join(' '));
            });
            if(!Item.PrePaginated) return L.patchItemStyles(Item);
        },
        // () => Item.stamp('Postprocessed'),
        () => E.dispatch('bibi:postprocessed-item', Item)
    );
};


L.patchItemStyles = (Item) => { // only for reflowable.
    const ProcessID = Item.LoadingProcessID;
    return O.chain({ assure: () => ProcessID == Item.LoadingProcessID, Label: 'L.patchItemStyles' },
        () => E.dispatch('bibi:is-going-to:patch-item-styles', Item),
        async () => {
            const StyleSheetsLength = Array.prototype.filter.call(Item.HTML.querySelectorAll('style, link'), Ele =>
                Ele.tagName.toLowerCase() == 'style' || (
                    Ele.href && /^(alternate )?stylesheet$/.test(Ele.rel)
                    && !((sML.UA.Safari || sML.OS.iOS) && Ele.rel == 'alternate stylesheet')  //// Safari does not count "alternate stylesheet" in document.styleSheets.
                )
            ).length;
            await new Promise((resolve, reject) => (function check() {
                if(ProcessID != Item.LoadingProcessID) return reject();
                if(Item.contentDocument.styleSheets.length >= StyleSheetsLength) return resolve();
                setTimeout(check, 33);
            })());
            if(!Item.Source.Preprocessed) {
                if(B.Package.Metadata['ebpaj:guide-version']) {
                    const Vers = B.Package.Metadata['ebpaj:guide-version'].split('.').map(Ver => Ver * 1);
                    if(Vers[0] == 1 && Vers[1] == 1 && Vers[2] <= 3) Item.Body.style.textUnderlinePosition = 'under left';
                }
                O.forEachCSSRuleOf(Item.contentDocument, CSSRule => CSSRule.style.columnCount == 1 && Item.contentDocument.querySelectorAll(CSSRule.selectorText).forEach(Ele => getComputedStyle(Ele).columnCount == 1 && (Ele.style.columnCount = 'auto')));
            }
            const ItemHTMLComputedStyle = getComputedStyle(Item.HTML);
            const ItemBodyComputedStyle = getComputedStyle(Item.Body);
            if(ItemHTMLComputedStyle[O.WritingModeProperty] != ItemBodyComputedStyle[O.WritingModeProperty]) Item.HTML.style.writingMode = ItemBodyComputedStyle[O.WritingModeProperty];
            Item.WritingMode = O.getWritingMode(Item.HTML);
                 if(/^(tb|bt)-/.test(Item.WritingMode)) Item.HTML.classList.add('bibi-vertical-text');
            else if(/^(lr|rl)-/.test(Item.WritingMode)) Item.HTML.classList.add('bibi-horizontal-text');
            if(S['background-spreading']) [
                [Item.Box, ItemHTMLComputedStyle, Item.HTML],
                [Item,     ItemBodyComputedStyle, Item.Body]
            ].forEach(Par => {
                ['Color', 'Image', 'Repeat', 'Position', 'Size'].forEach(Pro => Par[0].style[Pro = 'background' + Pro] = Par[1][Pro]);
                Par[2].style.background = 'transparent';
            });
        },
        () => E.dispatch('bibi:patched-item-styles', Item)
    );
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Reader

//----------------------------------------------------------------------------------------------------------------------------------------------


export const R = { // Bibi.Reader
    Spreads: [], Items: [], Pages: [],
    NonLinearItems: [],
    IntersectingPages: [], Current: {}
};


R.title = () => {
    const FullTitleFragments = [B.Title];
    if(B.Creator)   FullTitleFragments.push(B.Creator);
    if(B.Publisher) FullTitleFragments.push(B.Publisher);
    B.FullTitle = FullTitleFragments.join(' - ').replace(/&amp;?/gi, '&').replace(/&lt;?/gi, '<').replace(/&gt;?/gi, '>');
    O.Title.innerHTML = ''; O.Title.appendChild(document.createTextNode(B.FullTitle + ' | ' + (S['website-name-in-title'] ? S['website-name-in-title'] : 'Published with Bibi')));
    try { O.Info.querySelector('h1').innerHTML = document.title; } catch(Err) {}
};


R.createSpine = (SpreadsDocumentFragment) => {
    R.Main      = O.Body.insertBefore(sML.create('main', { id: 'bibi-main' }), O.Body.firstElementChild);
    R.Main.Book =  R.Main.appendChild(sML.create('div',  { id: 'bibi-main-book' }));
    R.Main.Book.appendChild(SpreadsDocumentFragment);
  //R.Sub       = O.Body.insertBefore(sML.create('div',  { id: 'bibi-sub' }),  R.Main.nextSibling);
};


R.resetBibiHeight = () => {
    if(O.TouchOS) O.HTML.style.height = O.Body.style.height = '';
    const SafeHeight = O.HTML.offsetHeight - O.SafeArea.Bottom;
    if(O.TouchOS) O.HTML.style.height = O.Body.style.height = SafeHeight + 'px'; // for In-App Browsers
    return SafeHeight;
};


R.resetStage = () => {
    const SafeHeight = R.resetBibiHeight();
    R.Stage = {};
    R.Main.style.padding = R.Main.style.width = R.Main.style.height = '';
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = '';
    const BookBreadthIsolationStartEnd = (S['use-slider'] && S.RVM == 'paged' && O.Scrollbars[C.A_SIZE_B] ? O.Scrollbars[C.A_SIZE_B] : 0) + S['content-margin'] * 2;
    sML.style(R.Main.Book, {
        [C.A_SIZE_b]: (BookBreadthIsolationStartEnd > 0 ? 'calc(100% - ' + BookBreadthIsolationStartEnd + 'px)' : ''),
        [C.A_SIZE_l]: ''
    });
    R.Stage.Width  = O.Body.clientWidth;
    R.Stage.Height = SafeHeight;
    R.Stage[C.A_SIZE_B] -= (S['use-slider'] || S.RVM != 'paged' ? O.Scrollbars[C.A_SIZE_B] : 0) + S['content-margin'] * 2;
    window.scrollTo(0, 0);
    if(!S['use-full-height']) R.Stage.Height -= I.Menu.Height;
    if(S['content-margin'] > 0) R.Main.Book.style['padding' + C.L_BASE_S] = R.Main.Book.style['padding' + C.L_BASE_E] = S['content-margin'] + 'px';
    //R.Main.style['background'] = S['book-background'] ? S['book-background'] : '';
};


R.layOutSpreadAndItsItems = (Spread) => R.layOutItem(Spread.Items[0]).then(() => Spread.Items[1] && R.layOutItem(Spread.Items[1])).then(() => R.layOutSpread(Spread));


R.layOutSpread = (Spread, Opt = {}) => new Promise(resolve => {
    if(Opt.Makeover) {
        Spread.PreviousSpreadBoxLength = Spread.Box['offset' + C.L_SIZE_L];
        Spread.OldPages = Spread.Pages.concat(); // copy
    }
    Spread.Pages = [];
    Spread.Items.forEach(Item => Item.Pages.forEach(Page => Page.IndexInSpread = Spread.Pages.push(Page) - 1));
    const SpreadSize = { Width: 0, Height: 0 }, SpreadBox = Spread.Box;
    if(Spread.Items.length == 1) {
        const Item = Spread.Items[0];
        Spread.Spreaded = Item.Spreaded ? true : false;
        SpreadSize.Width  = (Spread.Spreaded && Item.PrePaginated && Item['rendition:page-spread']) ? (Item.Viewport ? Item.Box.offsetHeight * Item.Viewport.Width * 2 / Item.Viewport.Height : B.PrePaginated ? Item.Box.offsetWidth * 2 : R.Stage.Width) : Item.Box.offsetWidth;
        SpreadSize.Height = Item.Box.offsetHeight;
    } else {
        const ItemA = Spread.Items[0], ItemB = Spread.Items[1];
        Spread.Spreaded = (ItemA.Spreaded || ItemB.Spreaded) ? true : false;
        if(ItemA.PrePaginated && ItemB.PrePaginated) {
            // Paired Pre-Paginated Items
            if(Spread.Spreaded || S.SLA == 'horizontal') {
                // Spreaded
                SpreadSize.Width  =          ItemA.Box.offsetWidth  + ItemB.Box.offsetWidth;
                SpreadSize.Height = Math.max(ItemA.Box.offsetHeight,  ItemB.Box.offsetHeight);
            } else {
                // Not Spreaded (Vertical)
                SpreadSize.Width  = Math.max(ItemA.Box.offsetWidth,   ItemB.Box.offsetWidth);
                SpreadSize.Height =          ItemA.Box.offsetHeight + ItemB.Box.offsetHeight;
            }
        } else {
            // Paired Items Including Reflowable // currently not appearable.
            if(S.SLA == 'horizontal') { // if(R.Stage.Width > ItemA.Box.offsetWidth + ItemB.Box.offsetWidth) {
                // horizontal layout
                SpreadSize.Width  =          ItemA.Box.offsetWidth + ItemB.Box.offsetWidth;
                SpreadSize.Height = Math.max(ItemA.Box.offsetHeight, ItemB.Box.offsetHeight);
                if(Bibi.Dev) {
                    O.log(`Paired Items incl/Reflowable (Horizontal)`, '<g:>');
                    O.log(`[0] w${ ItemA.Box.offsetWidth }/h${ ItemA.Box.offsetHeight } %O`, ItemA);
                    O.log(`[1] w${ ItemB.Box.offsetWidth }/h${ ItemB.Box.offsetHeight } %O`, ItemB);
                    O.log(`-=> w${      SpreadSize.Width }/h${      SpreadSize.Height } %O`, Spread, '</g>');
                }
            } else {
                // vertical layout
                SpreadSize.Width  = Math.max(ItemA.Box.offsetWidth,   ItemB.Box.offsetWidth);
                SpreadSize.Height =          ItemA.Box.offsetHeight + ItemB.Box.offsetHeight;
                if(Bibi.Dev) {
                    O.log(`Paired Items incl/Reflowable (Vertical)`, '<g:>');
                    O.log(`[0] w${ ItemA.Box.offsetWidth }/h${ ItemA.Box.offsetHeight } %O`, ItemA);
                    O.log(`[1] w${ ItemB.Box.offsetWidth }/h${ ItemB.Box.offsetHeight } %O`, ItemB);
                    O.log(`-=> w${      SpreadSize.Width }/h${      SpreadSize.Height } %O`, Spread, '</g>');
                }
            }
        }
    }
    const IsHead = Spread.Index == 0, IsFoot = Spread.Index == R.Spreads.length - 1;
    let PaddingBefore = 0, PaddingAfter = 0;
    if(IsHead || IsFoot) {
        const StageLength = R.Stage[C.L_SIZE_L], SpreadLength = SpreadSize[C.L_SIZE_L];
        let PaddingLength = 0;
        if(StageLength > SpreadLength) {
            PaddingLength = Math.floor((StageLength - SpreadLength) / 2);
            if(S.RVM == 'paged' || IsHead) PaddingBefore = PaddingLength;
            if(S.RVM == 'paged' || IsFoot) PaddingAfter  = PaddingLength;
        } else if(StageLength < SpreadLength) {
            let EdgeItemLength = 0;
            if(IsHead && StageLength > (EdgeItemLength = Spread.Items[                      0].Box['offset' + C.L_SIZE_L])) PaddingBefore = Math.floor((StageLength - EdgeItemLength) / 2);
            if(IsFoot && StageLength > (EdgeItemLength = Spread.Items[Spread.Items.length - 1].Box['offset' + C.L_SIZE_L])) PaddingAfter  = Math.floor((StageLength - EdgeItemLength) / 2);
        }
    }
    if(PaddingBefore) SpreadSize[C.L_SIZE_L] += PaddingBefore, Spread.style['padding' + C.L_BASE_B] = PaddingBefore + 'px'; else Spread.style['padding' + C.L_BASE_B] = '';
    if(PaddingAfter ) SpreadSize[C.L_SIZE_L] += PaddingAfter,  Spread.style['padding' + C.L_BASE_A] = PaddingAfter  + 'px'; else Spread.style['padding' + C.L_BASE_A] = '';
    Spread.style['padding' + C.L_BASE_S] = Spread.style['padding' + C.L_BASE_E] = '';
    if(O.Scrollbars.Height && S.SLA == 'vertical' && S.ARA != 'vertical') {
        SpreadBox.style.minHeight    = S.RVM == 'paged' ?   'calc(100vh - ' + O.Scrollbars.Height + 'px)' : '';
        SpreadBox.style.marginBottom = Spread.Index == R.Spreads.length - 1 ? O.Scrollbars.Height + 'px'  : '';
    } else {
        SpreadBox.style.minHeight = SpreadBox.style.marginBottom = ''
    }
    SpreadBox.classList.toggle('spreaded', Spread.Spreaded);
    SpreadBox.style[C.L_SIZE_b] = '', Spread.style[C.L_SIZE_b] = ''; // Math.ceil(SpreadSize[C.L_SIZE_B]) + 'px';
    SpreadBox.style[C.L_SIZE_l] =     Spread.style[C.L_SIZE_l] = Math.ceil(SpreadSize[C.L_SIZE_L]) + 'px';
    //sML.style(Spread, { 'border-radius': S['spread-border-radius'], 'box-shadow': S['spread-box-shadow'] });
    if(Opt.Makeover) {
        if(!Spread.PrePaginated) R.replacePages(Spread.OldPages, Spread.Pages);
        const ChangedSpreadBoxLength = Spread.Box['offset' + C.L_SIZE_L] - Spread.PreviousSpreadBoxLength;
        if(ChangedSpreadBoxLength != 0) {
            const Correct = (C.L_AXIS_L == 'X' && O.getElementCoord(Spread, R.Main).X + Spread.offsetWidth <= R.Main.scrollLeft + R.Main.offsetWidth);
            R.Main.Book.style[C.L_SIZE_l] = (parseFloat(getComputedStyle(R.Main.Book)[C.L_SIZE_l]) + ChangedSpreadBoxLength) + 'px';
            if(Correct) {
                R.Main.scrollLeft += ChangedSpreadBoxLength;
                if(I.Slider.ownerDocument) {
                    I.Slider.resetUISize();
                    I.Slider.progress();
                }
            }
        }
        delete Spread.OldPages, delete Spread.PreviousSpreadBoxLength;
    }
    resolve(Spread);
});


R.layOutItem = (Item) => new Promise(resolve => {
    E.dispatch('bibi:is-going-to:lay-out-item', Item);
    (Item.Reflowable ? R.renderReflowableItem(Item) : R.renderPrePaginatedItem(Item)).then(Item => {
        E.dispatch('bibi:laid-out-item', Item);
        resolve(Item);
    });
});


R.renderReflowableItem = (Item) => new Promise(resolve => {
    if(Item.IsPlaceholder) return resolve();
    const SafeArea = O.SafeArea;
    Item.Padding = {
           Top: S['item-padding-top'],     Left: S['item-padding-left']  + SafeArea.Left,
        Bottom: S['item-padding-bottom'], Right: S['item-padding-right'] + SafeArea.Right
    };
    const ItemPaddingSE = Item.NoPadding ? 0 : Item.Padding[C.L_BASE_S] + Item.Padding[C.L_BASE_E];
    const ItemPaddingBA = Item.NoPadding ? 0 : Item.Padding[C.L_BASE_B] + Item.Padding[C.L_BASE_A];
    const PageCB = R.Stage[C.L_SIZE_B] - ItemPaddingSE; // Page "C"ontent "B"readth
    let   PageCL = R.Stage[C.L_SIZE_L] - ItemPaddingBA; // Page "C"ontent "L"ength
    const PageGap = ItemPaddingBA;
    ['b','a','s','e'].forEach(base => { const trbl = C['L_BASE_' + base], TRBL = C['L_BASE_' + base.toUpperCase()]; Item.style['padding-' + trbl] = Item.NoPadding ? 0 : Item.Padding[TRBL] + 'px'; });
    sML.style(Item.HTML, { 'width': '', 'height': '' });
    if(Item.WithGutters) {
        Item.HTML.classList.remove('bibi-with-gutters');
        if(Item.Neck.parentNode) Item.Neck.parentNode.removeChild(Item.Neck);
        Item.Neck.innerHTML = '';
        delete Item.Neck;
    }
    const ReverseItemPaginationDirectionIfNecessary = !Item.NoAdjustment ? true : false;
    if(Item.Columned) {
        sML.style(Item.HTML, { 'column-width': '', 'column-gap': '', 'column-fill': '', 'column-rule': '' });
        Item.HTML.classList.remove('bibi-columned');
        if(ReverseItemPaginationDirectionIfNecessary && Item.ReversedColumned) Item.HTML.style.direction = Item.HTML.BibiDefaultDirection;
    }
    Item.WithGutters = false;
    Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0;
    Item.ReversedColumned = false;
    Item.Half = false;
    Item.Spreaded = (
        S.SLA == 'horizontal' && (S['pagination-method'] == 'x' || /-tb$/.test(Item.WritingMode))
            &&
        (Item['rendition:spread'] == 'both' || R.Orientation == Item['rendition:spread'] || R.Orientation == 'landscape')
    );
    if(Item.Spreaded && Item['rendition:page-spread'] != 'center') {
        const HalfL = Math.floor((PageCL - PageGap) / 2);
        if(HalfL >= Math.floor(PageCB * S['orientation-border-ratio'] / 2)) PageCL = HalfL;
        else Item.Spreaded = false;
    }
    sML.style(Item, {
        [C.L_SIZE_b]: PageCB + 'px',
        [C.L_SIZE_l]: PageCL + 'px'
    });
    const WordWrappingStyleSheetIndex = sML.appendCSSRule(Item.contentDocument, '*', 'word-wrap: break-word; overflow-wrap: break-word;'); ////
    { // Fit Image and Embeded Content
        const [ItemBDir, ItemLDir] = Item.WritingMode.split('-'), ItemLineAxis = ItemLDir == 'tb' ? 'horizontal' : 'vertical';
        const TRBL = ['Top', 'Right', 'Bottom', 'Left'];
        sML.forEach(Item.Body.querySelectorAll('img, picture, svg, video, iframe'))(Ele => {
            if(!Ele.BibiDefaultStyle) { Ele.BibiDefaultStyle = {}; ['width', 'height', 'maxWidth', 'maxHeight'].forEach(Pro => Ele.BibiDefaultStyle[Pro] = Ele.style[Pro] || ''); }
            else Object.keys(Ele.BibiDefaultStyle).forEach(Pro => Ele.style[Pro] = Ele.BibiDefaultStyle[Pro]);
            const EComStyle = getComputedStyle(Ele),               EMarTRBL = TRBL.map(TRBL => parseFloat(EComStyle[ 'margin' + TRBL]) || 0);
            const PComStyle = getComputedStyle(Ele.parentElement), PPadTRBL = TRBL.map(TRBL => parseFloat(PComStyle['padding' + TRBL]) || 0);
            const ESpacing = ItemLineAxis == 'horizontal' ? O.getElementCoord(Ele).X + (ItemBDir == 'lr' ? EMarTRBL[1] + PPadTRBL[1] : EMarTRBL[3] + PPadTRBL[3] - Ele.offsetWidth)
                                                          : O.getElementCoord(Ele).Y + (ItemBDir == 'tb' ? EMarTRBL[2] + PPadTRBL[2] : EMarTRBL[0] + PPadTRBL[0] - Ele.offsetHeight);
            let EMaxB = PageCB, EMaxL = PageCL;
            if(S.SLA != ItemLineAxis) EMaxB -= ESpacing, EMaxL -= PPadTRBL[0] + PPadTRBL[2];
            else                      EMaxL -= ESpacing, EMaxB -= PPadTRBL[1] + PPadTRBL[3];
            const ENatB = Ele['offset' + C.L_SIZE_B];
            const ENatL = Ele['offset' + C.L_SIZE_L];
            const EFitRatio = Math.min(EMaxB / ENatB, EMaxL / ENatL);
            if(EFitRatio < 1) sML.style(Ele, { width: 'auto', height: 'auto',
                ['max' + C.L_SIZE_B]: Math.floor(ENatB * EFitRatio) + 'px',
                ['max' + C.L_SIZE_L]: Math.floor(ENatL * EFitRatio) + 'px'
            });
        });
    }
    if(sML.UA.Gecko) { // Part 1/2: Assist Gecko in the rendering of the orthogonal flow of writing-mode.
        if(Item.OFREs === undefined) {
            Item.OFREs = []; // Orthogonal Flow Root Elements
            Item.contentDocument.querySelectorAll('body, body *').forEach(Ele => {
                if(getComputedStyle(Ele).writingMode.split('-')[0] != getComputedStyle(Ele.parentNode).writingMode.split('-')[0]) {
                    Ele.BibiOFREOriginalStyleWidthHeight = { width: Ele.style.width, height: Ele.style.height };
                    Item.OFREs.push(Ele);
                }
            });
        }
        if(Item.OFREs.length) Item.OFREs.forEach(OFRE => sML.style(OFRE, OFRE.BibiOFREOriginalStyleWidthHeight));
    }
    if(!Item.Outsourcing) {
        if(S.RVM == 'paged' && Item.HTML['offset'+ C.L_SIZE_L] > PageCL && (Item.WritingMode.split('-')[1] == 'tb' || S['pagination-method'] == 'x')) {
            // reader-view-mode: paged, spread-layout-axis: vertical,   Item.WritingMode: **-tb                       ... horizontal-text item in vertical-text book
            // reader-view-mode: paged, spread-layout-axis: horizontal, Item.WritingMode: tb-**, pagination-method: x ... extra layout method for vertical-text book
            Item.HTML.classList.add('bibi-columned');
            sML.style(Item.HTML, { [C.L_SIZE_b]: 'auto', [C.L_SIZE_l]: PageCL + 'px', 'column-width': PageCB + 'px', 'column-gap': 0, 'column-fill': 'auto', 'column-rule': '' });
            const HowManyPages = Math.ceil(Item.HTML['scroll' + C.L_SIZE_B] / PageCB);
            sML.style(Item.HTML, { 'width': '', 'height': '', 'column-width': '', 'column-gap': '', 'column-fill': '', 'column-rule': '' });
            Item.HTML.classList.remove('bibi-columned');
            Item.HTML.classList.add('bibi-with-gutters');
            const ItemLength = (PageCL + PageGap) * HowManyPages - PageGap;
            Item.HTML.style[C.L_SIZE_L] = ItemLength + 'px';
            const Points = []; for(let i = 1; i < HowManyPages; i++) { const After = (PageCL + PageGap) * i, Before = After - PageGap;
                Points.push(     0), Points.push(Before);
                Points.push(PageCB), Points.push(Before);
                Points.push(PageCB), Points.push(After );
                Points.push(     0), Points.push(After );
            } if(/^tb-/.test(Item.WritingMode)) Points.reverse();
            const Polygon = []; for(let Pt = '', l = Points.length, i = 0; i < l; i++) {
                const Px = Points[i] + 'px';
                if(i % 2 == 0) Pt = Px;
                else Polygon.push(Pt + ' ' + Px);
            }
            const Neck = Bibi.createElement('bibi-neck'), Throat = Neck.appendChild(Bibi.createElement('bibi-throat')), ShadowOrThroat = Throat.attachShadow ? Throat.attachShadow({ mode: 'open' }) : Throat.createShadowRoot ? Throat.createShadowRoot() : Throat;
            ShadowOrThroat.appendChild(document.createElement('style')).textContent = (ShadowOrThroat != Throat ? ':host' : 'bibi-throat') + ` { ${C.L_SIZE_b}: ${PageCB}px; ${C.L_SIZE_l}: ${ItemLength}px; shape-outside: polygon(${ Polygon.join(', ') }); }`;
            Item.Neck = Item.Head.appendChild(Neck);
            Item.WithGutters = true;
        } else if(Item.HTML['offset'+ C.L_SIZE_B] > PageCB) {
            // reader-view-mode: paged | vertical,   spread-layout-axis: vertical,   Item.WritingMode: tb-** ... normal layout method for vertical-text book
            // reader-view-mode: paged | horizontal, spread-layout-axis: horizontal, Item.WritingMode: **-tb ... normal layout method for horizontal-text book
            Item.HTML.classList.add('bibi-columned');
            sML.style(Item.HTML, { [C.L_SIZE_l]: 'auto', [C.L_SIZE_b]: PageCB + 'px', 'column-width': PageCL + 'px', 'column-gap': PageGap + 'px', 'column-fill': 'auto', 'column-rule': '' });
            Item.Columned = true, Item.ColumnBreadth = PageCB, Item.ColumnLength = PageCL;
            if(ReverseItemPaginationDirectionIfNecessary) {
                let ToBeReversedColumnAxis = false;
                switch(Item.WritingMode) {
                    case 'lr-tb': case 'tb-lr': if(S['page-progression-direction'] != 'ltr') ToBeReversedColumnAxis = true; break;
                    case 'rl-tb': case 'tb-rl': if(S['page-progression-direction'] != 'rtl') ToBeReversedColumnAxis = true; break;
                }
                if(ToBeReversedColumnAxis) {
                    Item.ReversedColumned = true;
                    Item.HTML.style.direction = S['page-progression-direction'];
                    //if(sML.UA.Chromium) Item.HTML.style.transform = 'translateX(' + (Item.HTML['scroll'+ C.L_SIZE_L] - Item.HTML['offset'+ C.L_SIZE_L]) * (S['page-progression-direction'] == 'rtl' ? 1 : -1) + 'px)';
                }
            }
        } else if(Item.HTML['offset'+ C.L_SIZE_B] < PageCB) {
            Item.HTML.style[C.L_SIZE_b] = Math.floor(parseFloat(getComputedStyle(Item.HTML)[C.L_SIZE_b]) + (PageCB - Item.HTML['offset'+ C.L_SIZE_B])) + 'px';
        }
    }
    sML.deleteCSSRule(Item.contentDocument, WordWrappingStyleSheetIndex); ////
    if(sML.UA.Gecko) { // Part 2/2: Assist Gecko in the rendering of the orthogonal flow of writing-mode.
        if(Item.OFREs.length) Item.OFREs.forEach(OFRE => sML.style(OFRE, { width: OFRE.offsetWidth + 'px', height: OFRE.offsetHeight + 'px' }));
    }
    const [ItemL, HowManyPages] = (() => {
        let ItemL, HowManyPages;
        const LineSpacing = (() => {
            const Ps = Item.Body.querySelectorAll('p');
            const CS = getComputedStyle(Ps.length ? Ps[Ps.length - 1] : Item.Body);
            const FS = parseFloat(CS.fontSize);
            const CLH = CS.lineHeight;
            return Math.floor((/\dpx$/.test(CLH) ? parseFloat(CLH) : FS * (/\d$/.test(CLH) ? parseFloat(CLH) : 1.2)) - FS);
        })();
        (function updateL(Again) {
            const ItemScrollL = Item.HTML['scroll' + C.L_SIZE_L];
            HowManyPages = Math.ceil((ItemScrollL + PageGap) / (PageCL + PageGap));
            if(ItemScrollL - ((PageCL + PageGap) * (HowManyPages - 1) - PageGap) < LineSpacing / 2) HowManyPages--; // Avoid white page.
            ItemL = (PageCL + PageGap) * HowManyPages - PageGap;
            Item.style[C.L_SIZE_l] = Item.HTML.style[C.L_SIZE_l] = ItemL + 'px';
            if(!Again) updateL('Again'); // Watch reflowing after setting styles.
        })();
        return [ItemL, HowManyPages];
    })();
    Item.Box.style[C.L_SIZE_b] = (PageCB + ItemPaddingSE) + 'px';
    Item.Box.style[C.L_SIZE_l] = (ItemL + ItemPaddingBA /* + ((S.RVM == 'paged' && Item.Spreaded && HowManyPages % 2) ? (PageGap + PageCL) : 0) */ ) + 'px';
    Item.Pages.forEach(Page => {
        delete Page.IsPage;
        I.PageObserver.unobservePageIntersection(Page);
        Item.Box.removeChild(Page);
    });
    Item.Pages = [];
    for(let i = 0; i < HowManyPages; i++) {
        const Page = Item.Box.appendChild(sML.create('span', { className: 'page',
            IsPage: true,
            Spread: Item.Spread, Item: Item,
            IndexInItem: Item.Pages.length
        }));
        Item.Pages.push(Page);
        I.PageObserver.observePageIntersection(Page);
    }
    const ItemContentCoordInItemBox = !Item.NoPadding ? { Left: Item.Padding.Left, Top: Item.Padding.Top } : { Left: 0, Top: 0 };
    Item.PagedContentAreas = Item.Pages.map(Page => {
        const PageContentAreaInItemBox = {
            Left: Page.offsetLeft, Right: Page.offsetLeft + Page.offsetWidth,
             Top: Page.offsetTop, Bottom: Page.offsetTop  + Page.offsetHeight
        };
        if(!Item.NoPadding) {
            const PagePadding = {        [C.L_OOBL_B]:  Item.Padding[C.L_OOBL_B],            [C.L_OEBL_B]:  Item.Padding[C.L_OEBL_B] * -1 };
            if(Item.Columned) PagePadding[C.L_OOBL_L] = Item.Padding[C.L_OOBL_L], PagePadding[C.L_OEBL_L] = Item.Padding[C.L_OEBL_L] * -1;
            Object.keys(PagePadding).forEach(Key => PageContentAreaInItemBox[Key] += PagePadding[Key]);
        }
        return Page.ContentAreaInItem = {
            Left: Math.max(PageContentAreaInItemBox.Left - ItemContentCoordInItemBox.Left, 0),  Right: Math.min(PageContentAreaInItemBox.Right  - ItemContentCoordInItemBox.Left, Item.HTML.offsetWidth ),
             Top: Math.max(PageContentAreaInItemBox.Top  - ItemContentCoordInItemBox.Top,  0), Bottom: Math.min(PageContentAreaInItemBox.Bottom - ItemContentCoordInItemBox.Top,  Item.HTML.offsetHeight)
        };
    }); // console.log(Item.Index, Item.PagedContentAreas);
    /*
    if(Item.Index == 2) { //setTimeout(() => {
        console.log(`R.Items[${ Item.Index }]:`, Item);
        O.logSets(`R.Items[${ Item.Index }]`, '.', ['HTML', 'Body'], '.', ['offset', 'client', 'scroll'], ['Width', 'Height', 'Left', 'Top']); //}, 100);
    }
    //*/
    resolve();
}).then(() => Item);

/* R.Paginated */ Object.defineProperty(R, 'Paginated', { get: () => {
    if(B.PrePaginated) return true;
    switch(S.RVM) {
        case      'paged': return true;
        case 'horizontal': return B.WritingMode.split('-')[1] == 'tb';
        case   'vertical': return B.WritingMode.split('-')[0] == 'tb';
    }
} });


R.renderPrePaginatedItem = (Item) => new Promise(resolve => {
    sML.style(Item, { width: '', height: '', transform: '' });
    Item.Spreaded = (
        (S.RVM == 'paged' || !S['full-breadth-layout-in-scroll'])
            &&
        (Item['rendition:spread'] == 'both' || R.Orientation == Item['rendition:spread'] || R.Orientation == 'landscape')
    );
    R.renderPrePaginatedItem.getViewport(Item).then(Vp => R.renderPrePaginatedItem.getScale(Item, Vp).then(Sc => {
        Item.Scale = Sc;
        sML.style(Item.Box, {
            width:  Math.floor(Vp.Width  * Sc) + 'px',
            height: Math.floor(Vp.Height * Sc) + 'px'
        })
        if(Item.parentElement) sML.style(Item, {
            width:  Vp.Width  + 'px',
            height: Vp.Height + 'px',
            transform: 'scale(' + Sc + ')'
        });
    })).then(resolve);
}).then(() => Item);

    R.renderPrePaginatedItem.getViewport = (Item) => Promise.resolve().then(() =>
          Item.Viewport ? Item.Viewport
        : (    (S.RVM != 'paged' && S['full-breadth-layout-in-scroll'])
            && (!Item.Source.External || S['allow-external-item-href'])
            && (Item.Type == 'MarkupDocument' || Item.Type == 'SVG')
          ) ? O.file(Item.Source).then(() => O.getItemViewport(Item).then(Vp => Item.Viewport = Vp))
        : (   Item.SpreadPair?.Viewport          ? Item.SpreadPair.Viewport
            : Item.IsPlaceholder || !Item.Loaded ? null
            : Item.OnlySingleSVG                 ? Item.Viewport = O.getViewportByViewBox(Item.Body.firstElementChild.getAttribute('viewBox'))
            : Item.OnlySingleImg                 ? Item.Viewport = O.getViewportByImage(  Item.Body.firstElementChild                        )
            :                                      null
        ) || {
            Width:  Math.floor(Math.min(R.Stage.Width, R.Stage.Height * S['orientation-border-ratio']) / (/^(left|right)$/.test(Item['rendition:page-spread']) ? 2 : 1)),
            Height: R.Stage.Height,
            IsSubstitute: true
        }
    );

    R.renderPrePaginatedItem.getScale = (Item, Vp = Item.Viewport) => Promise.resolve().then(() =>
          !Vp || Vp.IsSubstitute ? 1
        : Item.Spreaded ? (Item.SpreadPair ? R.renderPrePaginatedItem.getViewport(Item.SpreadPair) : Promise.resolve(/^(left|right)$/.test(Item['rendition:page-spread']) ? Vp : null)).then(PVp => Math.min(R.Stage.Height / Vp.Height, R.Stage.Width / (Vp.Width + (PVp?.Width || 0))))
        : (S.RVM == 'paged' || !S['full-breadth-layout-in-scroll']) ? Math.min(R.Stage.Height / Vp.Height, R.Stage.Width / Vp.Width)
        : Math.min(1, R.Stage[C.L_SIZE_B] / Vp[C.L_SIZE_B])
    );


R.organizePages = () => R.Pages = R.Spreads.reduce((NewPages, Spread) => Spread.Pages.reduce((NewPages, Page) => { Page.Index = NewPages.push(Page) - 1; return NewPages; }, NewPages), []);


R.replacePages = (OldPages, NewPages) => {
    const StartIndex = OldPages[0].Index, OldLength = OldPages.length, NewLength = NewPages.length;
    for(let l = NewPages.length, i = 0; i < l; i++) NewPages[i].Index = StartIndex + i;
    if(NewLength != OldLength) {
        const Dif = NewLength - OldLength;
        let i = OldPages[OldLength - 1].Index + 1;
        while(R.Pages[i]) R.Pages[i].Index += Dif, i++;
    }
    R.Pages.splice(StartIndex, OldLength, ...NewPages);
    return R.Pages;
};


R.layOutStage = () => {
    //E.dispatch('bibi:is-going-to:lay-out-stage');
    let MainContentLayoutLength = 0;
    R.Spreads.forEach(Spread => MainContentLayoutLength += Spread.Box['offset' + C.L_SIZE_L]);
    const SpreadGap = B.Reflowable || S.RVM == 'paded' || (() => { switch(S['concatenate-spreads'][S.RVM == 'horizontal' ? 0 : 1]) {
        case 'always': return true;
        case 'never': return false;
        default: return (B.Package.Metadata['rendition:flow'] == 'scrolled-continuous' || B.Package.Metadata['scroll-direction']);
    }})() ? 0 : Math.max(Math.ceil(R.Stage[C.L_SIZE_L] / 8), 40);
    if(SpreadGap) MainContentLayoutLength += SpreadGap * (R.Spreads.length - 1);
    R.Main.Book.style[C.L_SIZE_l] = MainContentLayoutLength + 'px';
    //E.dispatch('bibi:laid-out-stage');
};


R.layOutBook = (Opt) => new Promise((resolve, reject) => setTimeout(() => {
    // Opt: {
    //     DoNotCloseUtilities: Boolean,
    //     NoNotification: Boolean,
    //     Destination: BibiDestination,
    //     Setting: BibiSetting,
    //     before: Function,
    //     Reset: Boolean,
    //     ResetOnlyContent: Boolean,
    //     Delay: Integer
    // }
    if(R.LayingOut) return reject();
    I.ScrollObserver.History = [];
    R.LayingOut = true;
    O.log(`Laying out...`, '<g:>');
    if(Opt) O.log(`Option: %O`, Opt); else Opt = {};
    if(!Opt.DoNotCloseUtilities) E.dispatch('bibi:closes-utilities');
    E.dispatch('bibi:is-going-to:lay-out', Opt);
    O.Busy = true;
    O.HTML.classList.add('busy');
    O.HTML.classList.add('laying-out');
    if(!Opt.NoNotification) I.notify(`Laying out...`);
    if(!Opt.Destination) Opt.Destination = { Element: R.getElement() };
    if(Opt.Setting) S.update(Opt.Setting);
    R.updateOrientation();
    const Layout = {}; ['reader-view-mode', 'spread-layout-direction', 'apparent-reading-direction'].forEach(Pro => Layout[Pro] = S[Pro]);
    O.log(`Layout: %O`, Layout);
    setTimeout(() => Promise.resolve().then(() => typeof Opt.before == 'function' ? Opt.before() : true).then(() => {
        if(!Opt.Reset) return resolve();
        if(!Opt.ResetOnlyContent) R.resetStage();
        const Promises = [];
        R.Spreads.forEach(Spread => Promises.push(R.layOutSpreadAndItsItems(Spread)));
        Promise.all(Promises).then(() => {
            R.organizePages();
            R.layOutStage();
            resolve();
        });
    }), Number.isFinite(Opt.Delay) ? Opt.Delay : 33);
}, Number.isFinite(Opt?.DelayBefore) ? Opt.DelayBefore : 0)).then(() => {
    return R.focusOn(Opt.Destination, { Duration: 0 });
}).then(() => {
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('laying-out');
    if(!Opt.NoNotification) I.notify('');
    R.LayingOut = false;
    E.dispatch('bibi:laid-out');
    O.log(`Laid out.`, '</g>');
});


R.updateOrientation = () => {
    const PreviousOrientation = R.Orientation;
    let Orientation = '';
    if(O.TouchOS) {
             if(typeof screen.orientation?.type == 'string') Orientation = screen.orientation.type.split('-')[0];
        else if(typeof window.orientation       == 'number') Orientation = window.orientation % 180 == 0 ? 'portrait' : 'landscape';
    }
    if(!Orientation) {
        const W = window.innerWidth  - (S.ARA == 'vertical'   ? O.Scrollbars.Width  : 0);
        const H = window.innerHeight - (S.ARA == 'horizontal' ? O.Scrollbars.Height : 0);
        Orientation = (W / H) < S['orientation-border-ratio'] ? 'portrait' : 'landscape';
    }
    if(Orientation != PreviousOrientation) {
        R.Orientation = Orientation;
        if(PreviousOrientation) E.dispatch('bibi:changes-orientation', R.Orientation);
        O.HTML.classList.remove('orientation-' + PreviousOrientation);
        O.HTML.classList.add('orientation-' + R.Orientation);
        if(PreviousOrientation) E.dispatch('bibi:changed-orientation', R.Orientation);
    }
};


R.changeView = (Par) => { if(!Par) return false;
    switch(typeof Par) {
        case 'string': Par = { Mode: Par };
        case 'object':
           if(S['fix-reader-view-mode'] || typeof Par.Mode != 'string' || !S['available-reader-view-modes'].includes(Par.Mode)) Par.Mode = S.RVM;
            Par.FullBreadthLayoutInScroll = (Par.FullBreadthLayoutInScroll === undefined || S.AVM == 'paged') ? S['full-breadth-layout-in-scroll'] : !!(Par.FullBreadthLayoutInScroll);
            if(S.RVM == Par.Mode && Par.FullBreadthLayoutInScroll == S['full-breadth-layout-in-scroll']) return false;
            break;
        default: return false;
    }
    let ToLayOut = false;
    if(S.RVM != Par.Mode) ToLayOut = true;
    if(Par.FullBreadthLayoutInScroll != S['full-breadth-layout-in-scroll']) {
        S.update({ 'full-breadth-layout-in-scroll': Par.FullBreadthLayoutInScroll });
        if(Par.FullBreadthLayoutInScroll) O.HTML.classList.add(   'book-full-breadth');
        else                              O.HTML.classList.remove('book-full-breadth');
        if(Par.Mode != 'paged') ToLayOut = true;
    }
    const Setting = {
        'reader-view-mode': Par.Mode,
        'full-breadth-layout-in-scroll': Par.FullBreadthLayoutInScroll
    };
    if(L.Opened && ToLayOut) {
        E.dispatch('bibi:changes-view', Par.Mode);
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.add('changing-view');
        R.layOutBook({
            before: () => new Promise(resolve => setTimeout(() => resolve(E.dispatch('bibi:closes-utilities')), 0)),
            Reset: true,
            NoNotification: Par.NoNotification,
            Setting: Setting,
            DelayBefore: 33
        }).then(() => {
            O.HTML.classList.remove('changing-view');
            O.HTML.classList.remove('busy');
            O.Busy = false;
            setTimeout(() => E.dispatch('bibi:changed-view', Par.Mode), 0);
        });
    } else {
        S.update(Setting);
        if(!L.Opened) L.play();
    }
    if(S['keep-settings']) I.Oven.Biscuits.memorize('Book', { RVM: Par.Mode, FBL: Par.FullBreadthLayoutInScroll });
};


Object.defineProperties(R, { // To ensure backward compatibility.
    Current: { get: () => I.PageObserver.Current },
    updateCurrent: { get: () => I.PageObserver.updateCurrent }
});


R.focusOn = (Par, Opt) => new Promise((resolve, reject) => { // Par = { Destination: DESTINATION } || DESTINATION, Par.Side = STRING (optional)
    if(R.Moving) return reject();
    let _ = Par?.Destination !== undefined ? Par.Destination : Par;
    Opt = Object.assign({}, Par, Opt ? Opt : {});
    if(!Opt.Distilled) _ = R.dest(_);
    if(!_ || !_.Page) try { _ = { Page: I.PageObserver.Current.Pages[0] }; } catch(Err) { return reject(); }
    E.dispatch('bibi:is-going-to:focus-on', _);
    R.Moving = true;
    let FocusPoint;
    const Page = _.Page, Item = Page.Item, Side = Opt.Side != 'after' ? 'before' : 'after';
    if(Item.Reflowable) {
        if(!R.Paginated && B.WritingMode.split('-')[1] == Item.WritingMode.split('-')[1] && _.Element && _.Element.ownerDocument != document) {
            FocusPoint = O.getElementCoord(Item)[C.L_AXIS_L] + (Item.NoPadding ? 0 : Item.Padding[C.L_OOBL_L]) + _.Element.getBoundingClientRect()[C.L_BASE_b];
        } else {
            FocusPoint = O.getElementCoord(Page)[C.L_AXIS_L];
            if(Side == 'after') FocusPoint += (Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
            if(S.SLD == 'rtl') FocusPoint += Page.offsetWidth;
        }
        if(S.SLD == 'rtl') FocusPoint -= R.Stage.Width;
    } else {
        if(R.Stage[C.L_SIZE_L] >= Page.Spread['offset' + C.L_SIZE_L]) {
            FocusPoint = O.getElementCoord(Page.Spread)[C.L_AXIS_L];
            FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - Page.Spread['offset' + C.L_SIZE_L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Page)[C.L_AXIS_L];
            if(R.Stage[C.L_SIZE_L] > Page['offset' + C.L_SIZE_L]) FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - Page['offset' + C.L_SIZE_L]) / 2);
            else if(Side == 'after') FocusPoint += (Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
        }
    }
    // if(Number.isInteger(_.TextNodeIndex)) R.selectTextLocation(_); // Colorize Destination with Selection
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[C.L_AXIS_L] = FocusPoint; if(!S['use-full-height'] && S.RVM == 'vertical') ScrollTarget.Y -= I.Menu.Height;
    sML.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: typeof Opt.Duration == 'number' ? Opt.Duration : (S.SLA == S.ARA && S.RVM != 'paged') ? 39 : 0,
        ease: typeof Opt.ease == 'function' ? Opt.ease : (Pos) => (Pos === 1) ? 1 : Math.pow(2, -10 * Pos) * -1 + 1
    }).then(() => {
        resolve(_);
        E.dispatch('bibi:focused-on', _);
    }).catch(reject);
}).catch(() => {}).then(() => {
    R.Moving = false;
});


R.dest = (_, Opt) => { if(_ === undefined || _ === null) return null;
    /* _ = { // Destination Format (Immutable)
        Range: RANGE,
        Element: ELEMENT,
        CFI: STRING,
        P: STRING,
            (IsAutomark: BOOLEAN,
            (IsBookmark: BOOLEAN,
        IIPP: NUMBER,
        Item: ELEMENT,
        ItemIndex: INTEGER,
        ItemIndexInSpine: INTEGER,
        ItemIndexInSpread: INTEGER,
            ElementSelector: STRING,
            ProgressInItem: NUMBER,
            EdgeOfItem: STRING,
            PageIndexInItem: INTEGER,
        Spread: ELEMENT,
        SpreadIndex: INTEGER,
            ProgressInSpread: NUMBER,
            EdgeOfSpread: STRING,
            PageIndexInSpread: INTEGER
        Progress: NUMBER,
        Edge: STRING,
        --------
        PageIndex: INTEGER,
        --------
        Page: ELEMENT
    } */
    const DD = { /* // Distilled Destination (New Object)
        Page: ELEMENT, (with/out)
                 Item: ELEMENT, (with/out)
                         Range: RANGE,
                    (or) Element: ELEMENT, (with/out)
                                     TextNodeIndex: INTEGER,
                            (and/or) CharacterOffset: OBJECT,
                    (or) ProgressInItem: NUMBER, 
            (or) Spread: ELEMENT, (with/out)
                     ProgressInSpread: NUMBER, 
            (or) Progress: NUMBER
    */ };
    if(_.IsAutomark || _.IsBookmark) {
        if(_.P === undefined) return null;
        if(!_.Page) _.Page = R.getPageStartsWithP(_.P);
    } else if(Opt && Opt.Distilled) {
        Object.assign(DD, _);
        delete DD.Page;
    } else {
        switch(typeof _) {
            case 'object': _ = _.startContainer ? { Range: _ } : _.nodeType == 1 ? { Element: _ } : Object.assign({}, _); break; // Immutable
            case 'number': _ = Number.isFinite(_) ? { IIPP: _ } : {}; break;
            case 'string': _ = R.getCFIDestination(_) || R.getPDestination(_) || {};
        }
        if(_.Range !== undefined) {
            if(_.Range && _.Range.startContainer) {
                if(_.Range.startContainer.ownerDocument.body.Item) {
                    const Item = _.Range.startContainer.ownerDocument.body.Item;
                    if(Item && Item.IsLinearItem) {
                        DD.Item = Item;
                        DD.Range = _.Range;
                    }
                }
            }
        } else if(_.Element !== undefined) {
            if(_.Element && _.Element.ownerDocument) {
                if(_.Element.ownerDocument == document) {
                    DD.Element = _.Element;
                } else {
                    const Item = _.Element.ownerDocument.documentElement.Item;
                    if(Item && Item.IsLinearItem) {
                        DD.Item = Item;
                        if(_.Element != _.Element.ownerDocument.documentElement) {
                            DD.Element = _.Element;
                            if(Number.isInteger(_.TextNodeIndex)) DD.TextNodeIndex = _.TextNodeIndex;
                            if(typeof _.CharacterOffset == 'object' && _.CharacterOffset) DD.CharacterOffset = _.CharacterOffset;
                        }
                    }
                }
            }
        } else {
                 if( _.CFI !== undefined) _ = R.getCFIDestination(_.CFI)   || {};
            else if(   _.P !== undefined) _ = R.getPDestination(_.P)       || {};
            else if(_.IIPP !== undefined) _ = R.getIIPPDestination(_.IIPP) || {};
            if(_.Item === undefined) {
                if(_.ItemIndex !== undefined) {
                    if(Number.isInteger(_.ItemIndex)) _.Item = R.Items[_.ItemIndex];
                } else if(_.ItemIndexInSpine !== undefined) {
                    if(Number.isInteger(_.ItemIndexInSpine)) _.Item = B.Package.Spine[_.ItemIndexInSpine];
                } else if(_.ItemIndexInSpread !== undefined) {
                    if(Number.isInteger(_.ItemIndexInSpread)) {
                        const Spread = _.Spread !== undefined ? _.Spread : Number.isInteger(_.SpreadIndex) ? R.Spreads[_.SpreadIndex] : null;
                        if(Spread && Spread.IsSpread) _.Item = Spread.Items[_.ItemIndexInSpread];
                    }
                }
            }
            if(_.Item !== undefined) {
                if(_.Item && _.Item.IsLinearItem) {
                    DD.Item = _.Item;
                    if(_.ElementSelector !== undefined) {
                        if(_.ElementSelector && typeof _.ElementSelector == 'string') { try {
                            const Ele = _.Item.contentDocument.querySelector(_.ElementSelector);
                            if(Ele && Ele != Ele.ownerDocument.documentElement) {
                                DD.Element = Ele;
                                if(Number.isInteger(_.TextNodeIndex)) DD.TextNodeIndex = _.TextNodeIndex;
                                if(typeof _.CharacterOffset == 'object' && _.CharacterOffset) DD.CharacterOffset = _.CharacterOffset;
                            }
                        } catch(Err) {} }
                    } else if(_.ProgressInItem !== undefined) {
                        if(Number.isFinite(_.ProgressInItem) && 0 <= _.ProgressInItem && _.ProgressInItem <= 1) DD.ProgressInItem = _.ProgressInItem;
                    } else if(_.EdgeOfItem !== undefined) {
                             if(_.EdgeOfItem === 'head') DD.ProgressInItem = 0;
                        else if(_.EdgeOfItem === 'foot') DD.ProgressInItem = 1;
                    } else if(_.PageIndexInItem !== undefined) {
                        if(Number.isInteger(_.PageIndexInItem) && 0 <= _.PageIndexInItem) DD.PageIndexInItem = _.PageIndexInItem;
                    }
                }
            } else if(_.ItemIndex === undefined && _.ItemIndexInSpine === undefined && _.ItemIndexInSpread === undefined && _.ElementSelector === undefined && _.ProgressInItem === undefined && _.EdgeOfItem === undefined) {
                if(_.Spread === undefined) {
                    if(_.SpreadIndex !== undefined) {
                        if(Number.isInteger(_.SpreadIndex)) _.Spread = R.Spreads[_.SpreadIndex];
                    }
                }
                if(_.Spread !== undefined) {
                    if(_.Spread && _.Spread.IsSpread) {
                        DD.Spread = _.Spread;
                        if(_.ProgressInSpread !== undefined) {
                            if(Number.isFinite(_.ProgressInSpread) && 0 <= _.ProgressInSpread && _.ProgressInSpread <= 1) DD.ProgressInSpread = _.ProgressInSpread;
                        } else if(_.EdgeOfSpread !== undefined) {
                                 if(_.EdgeOfSpread === 'head') DD.ProgressInSpread = 0;
                            else if(_.EdgeOfSpread === 'foot') DD.ProgressInSpread = 1;
                        } else if(_.PageIndexInSpread !== undefined) {
                            if(Number.isInteger(_.PageIndexInSpread) && 0 <= _.PageIndexInSpread) DD.PageIndexInSpread = _.PageIndexInSpread;
                        }
                    }
                } else if(_.SpreadIndex === undefined && _.ProgressInSpread === undefined && _.EdgeOfSpread === undefined) {
                    if(_.Progress !== undefined) {
                        if(Number.isFinite(_.Progress) && 0 <= _.Progress && _.Progress <= 1) DD.Progress = _.Progress;
                    } else if(_.Edge !== undefined) {
                             if(_.Edge === 'head') DD.Progress = 0;
                        else if(_.Edge === 'foot') DD.Progress = 1;
                    } else if(_.PageIndex !== undefined) {
                        if(Number.isInteger(_.PageIndex) && 0 <= _.PageIndex && _.PageIndex < R.Pages.length) DD.PageIndex = _.PageIndex;
                    }
                }
            }
        }
    }
    const Page = !Object.keys(DD).length ? _.Page :
        DD.Range   ? R.getPageOfRangeHead(DD.Range) :
        DD.Element ? R.getPageOfElementHead(DD.Element) :
        DD.Item    ? (DD.ProgressInItem   !== undefined ? R.getPageOfProgressIn(DD.Item,   DD.ProgressInItem  ) : DD.PageIndexInItem   !== undefined ? R.getPageOfIndexIn(DD.Item,   DD.PageIndexInItem  ) :   DD.Item.Pages[0]) :
        DD.Spread  ? (DD.ProgressInSpread !== undefined ? R.getPageOfProgressIn(DD.Spread, DD.ProgressInSpread) : DD.PageIndexInSpread !== undefined ? R.getPageOfIndexIn(DD.Spread, DD.PageIndexInSpread) : DD.Spread.Pages[0]) :
                      DD.Progress         !== undefined ? R.getPageOfProgressIn(   R,      DD.Progress        ) : DD.PageIndex         !== undefined ? R.getPageOfIndexIn(   R,      DD.PageIndex        ) :         R.Pages[0]  ;
    if(Page && Page.IsPage) {
        DD.Page = Page;
        if(_.IsAutomark) DD.IsAutomark = true, DD.P = _.P;
        if(_.IsBookmark) DD.IsBookmark = true, DD.P = _.P;
        return DD;
    }
    return null;
};

    R.getPageOfRangeHead = (Ran) => {
        if(!Ran || !Ran.startContainer) return null;
        if(Ran.startContainer.ownerDocument == document) return R.Pages[0];
        return R.getPageOfRectHeadInItem(Ran.getBoundingClientRect(), Ran.startContainer.ownerDocument.documentElement.Item);
    };

    R.getPageOfElementHead = (Ele) => {
        if(!Ele || Ele.nodeType !== 1) return null;
        if(Ele.ownerDocument == document) return Ele.IsPage ? Ele : (Ele.IsLinearItem || Ele.IsSpread) ? Ele.Pages[0] : R.Pages[0];
        const ClientRects = Ele.getClientRects(), First = ClientRects[0];
        return First ? R.getPageOfRectHeadInItem(ClientRects.length == 1 ? First : First[C.L_SIZE_b] > parseFloat(getComputedStyle(Ele).fontSize) * 0.5 ? First : ClientRects[1], Ele.ownerDocument.documentElement.Item) : null;
    };

    R.getPageOfRectHeadInItem = (Rect, Item) => {
        const CoordInItem = Rect[C.L_BASE_b];
        return Item.Pages[Math.floor((S.SLD == 'rtl' ? Item.HTML.getBoundingClientRect()[C.L_SIZE_l] - CoordInItem : CoordInItem) / R.Stage[C.L_SIZE_L])];
    };

    R.getPageOfProgressIn = (In, Progress) => In.Pages[ Progress > 0 ? Math.min(Math.floor(In.Pages.length * Progress), In.Pages.length - 1) : 0 ];
    R.getPageOfIndexIn    = (In, Index   ) => In.Pages[ Index    > 0 ? Math.min(Index,                                  In.Pages.length - 1) : 0 ];


R.getPage = (_, Opt) => {
    if(_ === undefined || _ === null) return ( R.Paginated ? I.PageObserver.Current.Pages : I.PageObserver.IntersectingPages.filter(ISP => R.Stage[C.L_SIZE_L] * I.PageObserver.getIntersectionStatus(ISP).Ratio > 3) )[0] || null;
    if(!Opt || !Opt.Distilled)        return                (_ = R.dest(_)) ?                                                                                                                                                        _.Page :  null;
    /**/                              return        _.Page && _.Page.IsPage ?                                                                                                                                                        _.Page :  null;
};


R.getElement = (_, Opt) => {
    let Page = null;
    if(!Opt || typeof Opt != 'object') Opt = {};
    if(_ === undefined || _ === null) {
        Page = R.getPage();
        Opt.InCurrentViewport = S.RVM == 'paged' ? false : true;
    } else {
        if(!Opt.Distilled) _ = R.dest(_);
        if(_) {
            if(_.Element                                   ) return _.Element;
            if(_.Item   && _.ProgressInItem   === undefined) return _.Item;
            if(_.Spread && _.ProgressInSpread === undefined) return _.Spread;
            Page = _.Page;
            Opt.InCurrentViewport = false;
        }
    }
    return R.getFirstElementOfPage(Page, Opt);
};

R.getFirstElementOfPage = (Page, Opt) => {
    if(!Page || !Page.IsPage) return null;
    if(Page.Item.PrePaginated) return Page.Item;
    const InCurrentViewport = S.RVM != 'paged' && Opt?.InCurrentViewport ? true : false;
    if(!InCurrentViewport && Page.FirstElement) return /*console.log('Without SCANNING:', `<${ Page.FirstElement.tagName }>${ Page.FirstElement.innerText.substring(0,8) }...`) ||*/ Page.FirstElement;
    const Item = Page.Item;
    const Ele = R.getFirstElementOfAreaInItem(Item, !InCurrentViewport ? Object.assign({}, Page.ContentAreaInItem) : (ItemCoord => {
        if(!Item.NoPadding) ItemCoord.X += Item.Padding.Left, ItemCoord.Y += Item.Padding.Top;
        return {
            Left: Math.max(Page.ContentAreaInItem.Left, R.Main.scrollLeft - ItemCoord.X, 0),  Right: Math.min(Page.ContentAreaInItem.Right,  R.Main.scrollLeft + R.Stage.Width  - ItemCoord.X, Item.HTML.offsetWidth ),
             Top: Math.max(Page.ContentAreaInItem.Top,  R.Main.scrollTop  - ItemCoord.Y, 0), Bottom: Math.min(Page.ContentAreaInItem.Bottom, R.Main.scrollTop  + R.Stage.Height - ItemCoord.Y, Item.HTML.offsetHeight)
        };
    })(O.getElementCoord(Item, R.Main)));
    if(!InCurrentViewport) Page.FirstElement = Ele;
    return Ele;
};

// R.getFirstElementOfViewport = (Vp, Opt) => { // useless...
//     const Page = R.getPage();
//     if(!Page || !Page.IsPage) return null;
//     if(B.PrePaginated) return Page.Item;
//     const Item = Page.Item;
//     const Ele = R.getFirstElementOfAreaInItem(Item, (ItemCoord => {
//         if(!Item.NoPadding) ItemCoord.X += Item.Padding.Left, ItemCoord.Y += Item.Padding.Top;
//         if(!Vp) Vp = {
//             Left: R.Main.scrollLeft, Right: R.Main.scrollLeft + R.Stage.Width,
//              Top: R.Main.scrollTop, Bottom: R.Main.scrollTop  + R.Stage.Height
//         };
//         return {
//             Left: Math.max(Vp.Left - ItemCoord.X, 0),  Right: Math.min(Vp.Right  - ItemCoord.X, Item.HTML.offsetWidth ),
//              Top: Math.max(Vp.Top  - ItemCoord.Y, 0), Bottom: Math.min(Vp.Bottom - ItemCoord.Y, Item.HTML.offsetHeight)
//         };
//     })(O.getElementCoord(Item, R.Main)));
//     return Ele;
// };

R.getFirstElementOfAreaInItem = (Item, TargetAreaInItem) => {
    if(Item.PrePaginated || Item.Source.External) return Item;
    // console.log('SCANNING...');
    TargetAreaInItem.Left += 2, TargetAreaInItem.Right  -= (1 + 2);
    TargetAreaInItem.Top  += 2, TargetAreaInItem.Bottom -= (1 + 2);
    const Vs = R.getFirstElementOfAreaInItem.Vars[Item.WritingMode], BD = Vs.BD, LD = Vs.LD, g = Vs.gEfPiI; // [D]irection, [F]rom, [T]o, [S]tep, [P]oint/[P]rogress
    const BF = TargetAreaInItem[Vs.BASE_S], BT = TargetAreaInItem[Vs.BASE_E];
    const BS = Math.abs(BT - BF) / 4, LS = parseFloat(getComputedStyle(Item.HTML).fontSize);
    const LF = TargetAreaInItem[Vs.BASE_B], LT = LF + Math.min(Math.abs(TargetAreaInItem[Vs.BASE_A] - LF), LS * 9) * LD;
    const Body = Item.Body;
    let Ele = Body, Found = false, SameElementCount = 0;
    const REs = R.getFirstElementOfAreaInItem.Testers.RegExps;
    // let Ct = 0; const z = (Dig, Num) => String(Num).padStart(Dig, '0');
    _L: for(let l = 0, LP = LF; LP * LD <= LT * LD; LP += LS * LD * (l < 2 ? 0.5 : 1), l++)
    _B: for(let b = 0, BP = BF; BP * BD <= BT * BD; BP += BS * BD * (l < 2 ? 0.5 : 1), b++) { let _Ele = g(Item, BP, LP);
        // console.log([
        //     `[${ z(3, ++Ct) }]`,
        //     `L[${ z(2, l) }]${ Vs.AXIS_L }:${ z(5, LP) }/${ z(5, LF) }-${ z(5, LT) }`,
        //     `B[${ z(2, b) }]${ Vs.AXIS_B }:${ z(5, BP) }/${ z(5, BF) }-${ z(5, BT) }`,
        //     `I[${ z(3, Item.Index) }] <${ _Ele.tagName }>${ _Ele.innerText.substring(0, 8) }...`
        // ].join(' - '));
        if(!Body.contains(_Ele) || _Ele == Body) continue; // break _B;
        if(l < 2) {                  Ele = _Ele;
                 if(         REs.RBTC.test(_Ele.tagName)) { Found = true; while((_Ele = _Ele.parentNode) != Body) if(REs.Ruby.test(_Ele.tagName)) { Ele = _Ele; break; } }
            else if(REs.GOOD_Rep_In_A.test(_Ele.tagName)) { Found = true; }
        } else if(_Ele != Ele) {     Ele = _Ele, SameElementCount = 0;
                 if(         REs.GOOD.test(_Ele.tagName)) { Found = true; }
            else if(         REs.RBTC.test(_Ele.tagName)) { Found = true; while((_Ele = _Ele.parentNode) != Body) if(REs.GOOD.test(_Ele.tagName)) { Ele = _Ele; break; } else if(REs.Ruby.test(_Ele.tagName)) Ele = _Ele; }
            else if(     REs.Rep_In_A.test(_Ele.tagName)) { Found = true; while((_Ele = _Ele.parentNode) != Body) if(REs.GOOD.test(_Ele.tagName)) { Ele = _Ele; break; } }
        } else if(++SameElementCount == 8) break _L;
        if(Found) break _L;
    }
    if(!Found) {
        // console.log('...(NOT FOUND)...', `<${ Ele.tagName }>${ Ele.innerText.substring(0,8) }...`);
        if(Ele == Body) Ele = Item;
        else {        let _Ele = Ele;
                   while((_Ele = _Ele.parentNode) != Body) if(REs.GOOD.test(_Ele.tagName)) { Found = true; Ele = _Ele; break; }
            if(!Found && (_Ele = Ele.querySelector(R.getFirstElementOfAreaInItem.Testers.Selectors.GOOD))) Ele = _Ele;
        }
    }
    // console.log('...SCANNED', (!Found ? 'Not ' : '') + 'Found', `<${ Ele.tagName }>${ Ele.innerText.substring(0,8) }...`);
    return Ele;
};

R.getFirstElementOfAreaInItem.Vars = { // gEfPiI: getElementFromPointInItem
    'lr-tb': { BASE_B: 'Top',   BASE_A: 'Bottom', BASE_S: 'Left',  BASE_E: 'Right',  AXIS_B: 'X', AXIS_L: 'Y', BD:  1, LD:  1, gEfPiI: (Item, BP, LP) => Item.contentDocument.elementFromPoint(BP, LP) },
    'rl-tb': { BASE_B: 'Top',   BASE_A: 'Bottom', BASE_S: 'Right', BASE_E: 'Left',   AXIS_B: 'X', AXIS_L: 'Y', BD: -1, LD:  1, gEfPiI: (Item, BP, LP) => Item.contentDocument.elementFromPoint(BP, LP) },
    'tb-rl': { BASE_B: 'Right', BASE_A: 'Left',   BASE_S: 'Top',   BASE_E: 'Bottom', AXIS_B: 'Y', AXIS_L: 'X', BD:  1, LD: -1, gEfPiI: (Item, BP, LP) => Item.contentDocument.elementFromPoint(LP, BP) },
    'tb-lr': { BASE_B: 'Left',  BASE_A: 'Right',  BASE_S: 'Top',   BASE_E: 'Bottom', AXIS_B: 'Y', AXIS_L: 'X', BD:  1, LD:  1, gEfPiI: (Item, BP, LP) => Item.contentDocument.elementFromPoint(LP, BP) }
};

R.getFirstElementOfAreaInItem.Testers = {
    Selectors: { GOOD: 'h1,h2,h3,h4,h5,h6,p,address,blockquote,li,dt,dd,th,td,figure' },
      RegExps: { GOOD:          /^(h[1-6]|p|address|blockquote|li|d[td]|t[hd]|figure)$/i,                RBTC: /^r[bt]c?$/i, Ruby: /^ruby$/i,
                 GOOD_Rep_In_A: /^(h[1-6]|p|address|blockquote|li|d[td]|t[hd]|figure|picture|img|svg|iframe|span|em|strong|small|b|i|ruby|a)$/i,
                      Rep_In_A:                                                   /^(picture|img|svg|iframe|span|em|strong|small|b|i|ruby|a)$/i }
};


R.getPageImageURL = (_, Opt) => new Promise((resolve, reject) => {
    const Page = R.getPage(_, Opt);
    if(!Page) return reject('');
    const Item = Page.Item;
    if(!Item.PrePaginated && !Item.Outsourcing) return reject('');
    resolve(Item.Loaded ? Item : L.loadItem(Item));
}).then(Item => {
    const resolvePath = (Ele, Att) => (SourcePath => B.ExtractionPolicy ? SourcePath : new URL(SourcePath, new URL(Item.Source.Path, B.Path.replace(/\/?$/, '/')).href).href)(Ele.getAttribute(Att));
    let Ele = null;
    if(Ele = Item.Body.querySelector('svg')) return new Promise((resolve, reject) => {
        Ele = sML.create('span', { innerHTML: Ele.outerHTML.replace(/xlink:href/g, 'data-href') }).firstChild;
        Ele.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const ImageElements = Ele.querySelectorAll('image');
        const Promises = [];
        for(let l = ImageElements.length, i = 0; i < l; i++) { const ImageElement = ImageElements[i];
            const ImagePath = resolvePath(ImageElement, 'data-href');
            if(!ImagePath) return reject('');
            const MediaType = !B.ExtractionPolicy ? O.getMediaType(ImagePath) : (() => { const BPM = B.Package.Manifest; for(const _ in BPM) { if(BPM[_].URI == ImagePath) return BPM[_]['media-type']; } return ''; })();
            if(!MediaType) return reject('');
            ImageElement.removeAttribute('data-href');
            Promises.push(W.and('retlieve')(ImagePath, 'blob').then(Data => O.createDataURL('Blob', Data, MediaType)).then(DataURL => ImageElement.setAttribute('xlink:href', DataURL)));
        }
        Promise.all(Promises).then(() => O.createBlobURL('Text', `<?xml version="1.0" encoding="utf-8"?>\n` + Ele.outerHTML, 'image/svg+xml')).then(resolve);
    });
    if(Ele = Item.Body.querySelector('img')) return Promise.resolve(resolvePath(Ele, 'src'));
    return Promise.reject('');
});


R.getItemCopy = (_, Opt) => new Promise((resolve, reject) => {
    const Page = R.getPage(_, Opt);
    if(!Page) return reject(null);
    const Item = Page.Item;
    if(!Item.PrePaginated) return reject(null);
    resolve(Item.Loaded ? Item : L.loadItem(Item));
}).then(Item => {
    const ItemViewport = Item.Viewport || (SpineItemImage => SpineItemImage ? { Width: SpineItemImage.offsetWidth, Height: SpineItemImage.offsetHeight } : null)(Item.Body.querySelector('.bibi-spine-item-image'));
    if(!ItemViewport) return Promise.reject(null);
    const ItemCopy = Object.assign(sML.create('span', { innerHTML: Item.outerHTML }).firstChild, { className: 'item-copy', IsItemCopy: true, Original: Item, Viewport: ItemViewport });
    ItemCopy.removeAttribute('style');
    const VWidth = ItemViewport.Width, VHeight = ItemViewport.Height;
    ItemCopy.FittingIn = { Width: VWidth , Height: VHeight, Scale: 1 };
    sML.style(ItemCopy, { width: VWidth + 'px', height: VHeight + 'px', transform: 'scale(1)' });
    ItemCopy.resize = (Size) => { if(!Size || typeof Size != 'object') return false;
        let Width  = (Size.Width  !== undefined || Size.width  === undefined) ? Size.Width  : Size.width ; if(!Number.isFinite(Width ) || Width  <= 0) Width  = undefined;
        let Height = (Size.Height !== undefined || Size.height === undefined) ? Size.Height : Size.height; if(!Number.isFinite(Height) || Height <= 0) Height = undefined;
        if(!Width  && !Height) return false;
        if( Width  && !Height) Height = Width * VHeight/VWidth;
        if(!Width  &&  Height) Width = Height * VWidth/VHeight;
        Object.assign(ItemCopy.FittingIn, { Width: Width , Height: Height, Scale: Math.min(Width/VWidth, Height/VHeight, 1) });
        sML.style(ItemCopy, { transform: 'scale(' + ItemCopy.FittingIn.Scale + ')' });
        return ItemCopy;
    }
    return ItemCopy;
});

R.getItemCopyWithShell = (_, Opt) => R.getItemCopy(_, Opt).then(ItemCopy => {
    if(!ItemCopy) return Promise.reject(null);
    const ItemCopyShell = ItemCopy.Shell = sML.create('span', { className: 'item-copy-shell', ItemCopy: ItemCopy });
    ItemCopyShell.appendChild(ItemCopy);
    const ItemCopyVeil = ItemCopyShell.Veil = ItemCopyShell.appendChild(sML.create('span', { className: 'item-copy-shell-veil' }));
    sML.style(ItemCopyShell, { width: ItemCopy.Viewport.Width + 'px', height: ItemCopy.Viewport.Height + 'px' });
    ItemCopyShell.resize = (Size) => {
        if(!ItemCopy.resize(Size)) return false;
        sML.style(ItemCopyShell, { width: ItemCopy.FittingIn.Width + 'px', height: ItemCopy.FittingIn.Height + 'px' });
        return ItemCopyShell;
    };
    return ItemCopyShell;
});


R.getCFI = (_) => {
    _ = R.dest(_);
    const IsBody = _.Element && _.Element == _.Element.ownerDocument.body;
    const TheP = R.getP(_);
    if(!TheP) return '';
    const PSteps = TheP.split('.');
    const Paths = [['6', (R.Items[PSteps.shift() - 1].IndexInSpine + 1) * 2]];
    if(IsBody || PSteps.length) Paths.push(['4'].concat(PSteps.map(PStep => PStep * 2)));
    return Paths.map(Steps => Steps.map(Step => '/' + Step).join('')).join('!');
};

R.getCFIDestination = (CFI) => {
    const CFIStructure = O.CFIManager.parse(CFI);
    if(!CFIStructure) return null;
    let PathSteps = CFIStructure.Path.Steps;
    if(PathSteps.length < 2 || !PathSteps[1].Index || PathSteps[1].Index % 2 == 1) return null;
    const Dest = { ItemIndexInSpine: PathSteps[1].Index / 2 - 1 };
    if(PathSteps[2] && PathSteps[2].Steps) {
        const Steps = PathSteps[2].Steps;
        let ElementSelector = '';
        for(let l = Steps.length, i = 0; i < l; i++) { const Step = Steps[i];
            if(Step.Type == 'IndirectPath') { Dest.IndirectPath    = Step; break; }
            if(Step.Type == 'TermStep')     { Dest.CharacterOffset = Step; break; }
            if(Step.Index % 2 == 1)         { Dest.TextNodeIndex   = Step.Index - 1; if(i == Steps.length - 2 && Steps[i + 1].Type == 'TermStep') continue; else break; }
            if(Step.ID) ElementSelector = '#' + Step.ID;
            else        ElementSelector += '>*:nth-child(' + (Step.Index / 2) + ')';
        }
        if(ElementSelector) Dest.ElementSelector = ElementSelector.replace(/^>\*:nth-child\(2\)/, 'body');
    }
    return Dest;
};


R.getP = (_) => {
    let Ele = R.getElement(_);
    if(!Ele) return '';
    if(Ele.IsSpread) Ele = Ele.Items[0];
    if(Ele.IsItem) return String(Ele.Index + 1);
    const Item = Ele.ownerDocument.documentElement.Item;
    const Steps = [];
    while(Ele != Item.HTML && Ele != Item.Body) {
        let Nth = 0;
        sML.forEach(Ele.parentElement.childNodes)((CN, i) => {
            if(CN.nodeType != 1) return;
            Nth++;
            if(CN == Ele) {
                Steps.unshift(Nth);
                Ele = Ele.parentElement;
                return 'break';
            }
        });
    }
    Steps.unshift(Item.Index + 1);
    return Steps.join('.');
};

R.getPDestination = (TheP) => {
    TheP = Bibi.verifySettingValue('string', 'p', TheP);
    if(!TheP) return null;
    const Steps = TheP.split('.');
    const [FirstStep, Opt] = Steps.shift().split('-');
    if(FirstStep == 'head') return { Progress: 0 };
    if(FirstStep == 'foot') return { Progress: 1 };
    const Dest = { ItemIndex: FirstStep - 1 };
    if(Opt) {
        if(Opt == 'end') Dest.ProgressInItem = 1;
    } else {
        Dest.ElementSelector = `body`;
        Steps.forEach(Step => Dest.ElementSelector += `>*:nth-child(` + Step + `)`);
    }
    return Dest;
};

R.getPageStartsWithP = (TheP) => {
    TheP = Bibi.verifySettingValue('string', 'p', TheP);
    if(!TheP) return null;
    const Page = R.getPage({ P: TheP });
    if(!Page || typeof Page.Index != 'number') return null;
    if(R.getP({ Page: Page }) != TheP && R.getP({ Page: R.Pages[Page.Index + 1] }) == TheP) return R.Pages[Page.Index + 1];
    return Page;
};


R.getIIPP = (_) => {
    const Page = R.getPage(_);
    if(!Page) return NaN;
    let IIPP = Page.Item.Index;
    if(Page.Index != 0) IIPP += Page.IndexInItem / Page.Item.Pages.length;
    return IIPP;
};

R.getIIPPDestination = (IIPP) => {
    return Number.isFinite(IIPP) && 0 <= IIPP ? {
        ItemIndex: Math.floor(IIPP),
        ProgressInItem: IIPP % 1
    } : null;
};


R.getNavAnchors = () => {
    if(!Bibi.Opened) return null;
    const NavAnchors = [];
    sML.forEach(I.Panel.BookInfo.Navigation.querySelectorAll('*[href]'))(NavAnchor => {
        if(!NavAnchor.Destination.P) {
            const TheP = R.getP(NavAnchor.Destination);
            if(TheP) NavAnchor.Destination.P = TheP;
        }
        if(NavAnchor.Destination.P) NavAnchors.push(NavAnchor);
    });
    return NavAnchors;
};

R.getNearestNavItem = (_) => {
    let NavAnchors = R.getNavAnchors();
    if(!NavAnchors || !NavAnchors.length) return null;
    const TheP = R.getP(_);
    if(!TheP) return null;
    const ThePSteps = TheP.split('.');
    return NavAnchors.filter(NA => {
        const NA_PSteps = NA.Destination.P.split('.');
        for(let l = ThePSteps.length, i = 0; i < l; i++) {
            const ThePStep = ThePSteps[i] * 1 || 0,
                  NA_PStep = NA_PSteps[i] * 1 || 0;
            if(ThePStep < NA_PStep) return false;
        }
        return true;
    }).sort((ItemA, ItemB) => {
        const ItemAPSteps = ItemA.Destination.P.split('.'),
              ItemBPSteps = ItemB.Destination.P.split('.');
        for(let l = Math.max(ItemAPSteps.length, ItemBPSteps.length), i = 0; i < l; i++) {
            const ItemAPStep = ItemAPSteps[i] * 1 || 0,
                  ItemBPStep = ItemBPSteps[i] * 1 || 0;
            if(ItemAPStep < ItemBPStep             ) return -1;
            if(             ItemBPStep < ItemAPStep) return  1;
        }
        return 0;
    }).pop() || null;
};


// R.selectTextLocation = (_) => {
//     if(!_ || !Number.isInteger(_.TextNodeIndex) || !_.Element) return false;
//     const _Node = _.Element.childNodes[_.TextNodeIndex];
//     if(!_Node || !_Node.textContent) return;
//     const Sides = { Start: { Node: _Node, Index: 0 }, End: { Node: _Node, Index: _Node.textContent.length } };
//     if(_.CharacterOffset) {
//         if(_.CharacterOffset.Preceding || _.CharacterOffset.Following) {
//             Sides.Start.Index = _.CharacterOffset.Index, Sides.End.Index = _.CharacterOffset.Index;
//             if(_.CharacterOffset.Preceding) Sides.Start.Index -= _.CharacterOffset.Preceding.length;
//             if(_.CharacterOffset.Following)   Sides.End.Index += _.CharacterOffset.Following.length;
//             if(Sides.Start.Index < 0 || _Node.textContent.length < Sides.End.Index) return;
//             if(_Node.textContent.substring(Sides.Start.Index, Sides.End.Index) != _.CharacterOffset.Preceding + _.CharacterOffset.Following) return;
//         } else if(_.CharacterOffset.Side && _.CharacterOffset.Side == 'a') {
//             Sides.Start.Node = _Node.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
//             Sides.End.Index = _.CharacterOffset.Index - 1;
//         } else {
//             Sides.Start.Index = _.CharacterOffset.Index;
//             Sides.End.Node = _Node.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
//             Sides.End.Index = Sides.End.Node.textContent.length;
//         }
//     }
//     return sML.Ranges.selectRange(sML.Ranges.getRange(Sides));
// };


R.scrollBy = (Dist, Par) => new Promise((resolve, reject) => {
    if(!Par || typeof Par != 'object') Par = {};
    if(Dist && Dist.Distance) {
        Object.assign(Par, Dist);
        Dist = Dist.Distance;
    }
    Dist *= 1;
    delete Par.Distance;
    if(!Dist || typeof Dist != 'number') return reject();
    E.dispatch('bibi:is-going-to:scroll-by', Dist);
    R.Moving = true;
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    switch(S.SLD) {
        case 'ttb': ScrollTarget.Y = R.Main.scrollTop  + R.Stage.Height * Dist     ; break;
        case 'ltr': ScrollTarget.X = R.Main.scrollLeft + R.Stage.Width  * Dist     ; break;
        case 'rtl': ScrollTarget.X = R.Main.scrollLeft + R.Stage.Width  * Dist * -1; break;
    }
    sML.scrollTo(ScrollTarget, {
        Duration: typeof Par.Duration == 'number' ? Par.Duration : (S.RVM != 'paged' && S.SLA == S.ARA) ? 100 : 0,
        ForceScroll: Par.Cancelable ? false : true,
        ease: typeof Par.ease == 'function' ? Par.ease : null
    }).then(() => {
        resolve({ P: R.getP() });
        E.dispatch('bibi:scrolled-by', Dist);
    }).catch(reject);
}).catch(() => {}).then(() => {
    R.Moving = false;
});


R.moveBy = (Dist, Par) => new Promise((resolve, reject) => {
    if(R.Moving || !L.Opened) return reject();
    if(!Par || typeof Par != 'object') Par = {};
    if(Dist && Dist.Distance) {
        Object.assign(Par, Dist);
        Dist = Dist.Distance;
    }
    Dist *= 1;
    delete Par.Distance;
    if(!Dist || typeof Dist != 'number') return reject();
    E.dispatch('bibi:is-going-to:move-by', Dist);
    const Current = (Dist > 0 ? I.PageObserver.Current.List.slice(-1) : I.PageObserver.Current.List)[0], CurrentPage = Current.Page, CurrentItem = CurrentPage.Item;
    let Promised = null;
    if(
        true /*||
        R.Paginated ||
        CurrentItem.PrePaginated ||
        CurrentItem.Outsourcing ||
        CurrentItem.Pages.length == 1 ||
        Dist < 0 && CurrentPage.IndexInItem == 0 ||
        Dist > 0 && CurrentPage.IndexInItem == CurrentItem.Pages.length - 1*/
    ) {
        let StrictDist = Dist, Side = Dist > 0 ? 'before' : 'after';
        if(Current.PageIntersectionStatus.Oversized) {
            if(Dist > 0) {
                     if(Current.PageIntersectionStatus.Entering) StrictDist = 0, Side = 'before';
                else if(Current.PageIntersectionStatus.Headed  ) StrictDist = 0, Side = 'after';
            } else {
                     if(Current.PageIntersectionStatus.Footed  ) StrictDist = 0, Side = 'before';
                else if(Current.PageIntersectionStatus.Passing ) StrictDist = 0, Side = 'before';
            }
        } else {
            if(Dist > 0) {
                if(Current.PageIntersectionStatus.Entering) StrictDist = 0, Side = 'before';
            } else {
                if(Current.PageIntersectionStatus.Passing ) StrictDist = 0, Side = 'before';
            }
        }
        let DestinationPageIndex = CurrentPage.Index + StrictDist;
             if(DestinationPageIndex <                  0) DestinationPageIndex = 0,                  Side = 'before';
        else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1, Side = 'after';
        let DestinationPage = R.Pages[DestinationPageIndex];
        if(B.PrePaginated && DestinationPage.Item.SpreadPair) {
            if(S.SLA == 'horizontal' && R.Stage[C.L_SIZE_L] > DestinationPage.Spread['offset' + C.L_SIZE_L]) {
                if(StrictDist < 0 && DestinationPage.IndexInSpread == 0) DestinationPage = DestinationPage.Spread.Pages[1];
                if(StrictDist > 0 && DestinationPage.IndexInSpread == 1) DestinationPage = DestinationPage.Spread.Pages[0];
            }
        }
        Promised = R.focusOn({ Page: DestinationPage, Side: Side }, Par);
    } else {
        Promised = R.scrollBy(Dist, Par).then(() => ({ P: R.getP() }));
    }
    Promised.then(Dest => {
        resolve(Dest);
        E.dispatch('bibi:moved-by', Dist);
    }).catch(reject);
}).catch(() => {}).then(() => {});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- User Interfaces

//----------------------------------------------------------------------------------------------------------------------------------------------


export const I = {}; // Bibi.UserInterfaces


I.initialize = () => {
    I.Oven.create();
    I.Utilities.create();
    I.RangeFinder.create();
    I.TouchObserver.create();
    I.Notifier.create();
    I.Veil.create();
    E.bind('bibi:readied', () => {
        I.ScrollObserver.create();
        I.ResizeObserver.create();
        I.PageObserver.create();
        I.Turner.create();
        I.Catcher.create();
        I.Menu.create();
        I.Panel.create();
        I.Help.create();
        I.PoweredBy.create();
        I.Loupe.create();
    });
    E.bind('bibi:initialized-book', () => {
        I.TextSetter.create();
        I.BookmarkManager.create();
        I.Footnotes.create();
    });
    E.bind('bibi:prepared', () => {
        I.FlickObserver.create();
        I.WheelObserver.create();
        I.PinchObserver.create();
        I.KeyObserver.create();
        I.Tracer.create();
        I.Nombre.create();
        I.Slider.create();
        I.Flipper.create();
        I.Arrows.create();
        I.AxisSwitcher.create();
        I.Spinner.create();
    });
};


I.Oven = { create: () => {
    const Oven = I.Oven = {
        Spirit: S['forget-me'] || !localStorage ? null : {
            getItem: (Key) => localStorage.getItem(Key),
            setItem: (Key, Value) => localStorage.setItem(Key, Value),
            removeItem: (Key) => localStorage.removeItem(Key)
        },
        Flame: false,
        realize: () => { if(S['forget-me'] || !Oven.Spirit) return;
            Oven.Flame = true;
            E.dispatch('bibi:realized-oven');
        },
        quench: () => {
            Oven.Flame = false;
            E.dispatch('bibi:quenched-oven');
        },
        // rememberMe: () => Oven.realize(),
        // forgetMeNot: () => Oven.rememberMe(),
        // forgetMe: () => Oven.quench(),
    };
    Oven.realize();
    const Biscuits = Oven.Biscuits = {
        Tags: ['****', 'Bibi', 'Book'],
        initialize: () => {
            delete Biscuits.initialize;
            // if(S['forget-me']) return;
            const LabelDelimiter = ' ', [BibiPath, PresetPath] = [Bibi.Script.src, P.Script.src].map(Src => (Loc => Loc.origin == O.Origin ? Loc.pathname : Loc.href.replace(/^[^:]+:\/\//, ''))(new URL(Src)));
            E.bind('bibi:processed-package-metadata', () => {
                Biscuits.Tin = Biscuits.Tags.reduce((Tin, Tag) => {
                    const LabelParts = []; switch(Tag) {
                        case 'Book': LabelParts.unshift([B.ID, S['allow-sugar-for-biscuits'] && S['sugar-for-biscuits']].filter(_ => _).join(LabelDelimiter));
                        case 'Bibi': LabelParts.unshift([BibiPath, PresetPath].join(LabelDelimiter));
                        default    : LabelParts.unshift('Bibi:Biscuit');
                    }
                    const Label = LabelParts.join(LabelDelimiter), Portion = Biscuits.parsePortion(Oven.Spirit?.getItem(Label));
                    Tin[Tag] = { Label: Label, Portion: Portion };
                    return Tin;
                }, {});
                E.dispatch('bibi:initialized-biscuits', Biscuits);
            });
        },
        parsePortion: (PortionJSON) => {
            let Portion = null; try { Portion = JSON.parse(PortionJSON); } catch(Err) {}
            if(!Portion || !Portion.Biscuit || !Portion.Stamp) Portion = { Biscuit: {}, Stamp: 0 };
            return Portion;
        },
        update: (Tag, Biscuit) => {
            if(!Oven.Flame || !Biscuits.Tags.includes(Tag)) return;
            Biscuits.Tin[Tag].Portion.Stamp = Date.now();
            return Biscuit && Object.keys(Biscuit).length ?
                (Biscuits.Tin[Tag].Portion.Biscuit = Biscuit) && Oven.Spirit.setItem(   Biscuits.Tin[Tag].Label, JSON.stringify(Biscuits.Tin[Tag].Portion)) :
                (Biscuits.Tin[Tag].Portion.Biscuit =      {}) && Oven.Spirit.removeItem(Biscuits.Tin[Tag].Label);
        },
        remember: (Tag, Key) => {
            if(!Oven.Flame || !Biscuits.Tags.includes(Tag)) return null;
            const Biscuit = Biscuits.Tin[Tag].Portion.Biscuit;
            return Key !== undefined ? Biscuit[Key] : Biscuit;
        },
        memorize: (Tag, KnV) => {
            if(!Oven.Flame || !Biscuits.Tags.includes(Tag)) return null;
            const Biscuit = Biscuits.Tin[Tag].Portion.Biscuit;
            if(KnV !== undefined) Object.keys(KnV).forEach(Key => { const Val = KnV[Key];
                try        { if(Val && typeof Val != 'function' && JSON.parse(JSON.stringify({ [Key]: Val }))[Key] !== undefined) Biscuit[Key] = Val; else throw ''; }
                catch(Err) { delete Biscuit[Key]; }
            });
            Biscuits.update(Tag, Biscuit);
            return Biscuit;
        },
        forget: (Tags, Keys) => {
            if(!Oven.Flame) return null;
            if(Tags === undefined) Biscuits.Tags.forEach(Tag => Biscuits.update(Tag));
            else (Array.isArray(Tags) ? Tags : [Tags]).forEach(Tag => {
                if(!Biscuits.Tags.includes(Tag)) return;
                if(Keys === undefined) Biscuits.update(Tag);
                else {
                    const Biscuit = Biscuits.Tin[Tag].Portion.Biscuit;
                    (Array.isArray(Keys) ? Keys : [Keys]).forEach(Key => delete Biscuit[Key]);
                    Biscuits.update(Tag, Biscuit);
                }
            });
            return Biscuits.Tin;
        }
    };
    Biscuits.initialize();
    E.dispatch('bibi:created-oven');
}};


I.Desk = {};


I.Utilities = { create: () => {
    const Utilities = I.Utilities = I.setToggleAction({
        Checkers: [],
        isAbleToBeToggled: () => !R.Moving && !R.Breaking && Utilities.Checkers.filter(checker => !(typeof checker == 'function' ? checker() : checker)).length == 0,
          openGracefuly: () => Utilities.isAbleToBeToggled() && Utilities.UIState != 'active'  && Utilities.open(),
         closeGracefuly: () => Utilities.isAbleToBeToggled() && Utilities.UIState != 'default' && Utilities.close(),
        toggleGracefuly: () => Utilities.isAbleToBeToggled()                                   && Utilities.toggle()
    }, {
        onopened: () => E.dispatch('bibi:opens-utilities'),
        onclosed: () => E.dispatch('bibi:closes-utilities')
    });
    E.add('bibi:commands:open-utilities',   () => I.Utilities.open());
    E.add('bibi:commands:close-utilities',  () => I.Utilities.close());
    E.add('bibi:commands:toggle-utilities', () => I.Utilities.toggleGracefuly());
}};


I.ScrollObserver = { create: () => {
    const ScrollObserver = I.ScrollObserver = {
        History: [],
        Scrolling: 0,
        onScroll: (Eve) => { if(R.LayingOut || !L.Opened) return;
            clearTimeout(R.Timer_onScrollEnd);
            if(!ScrollObserver.Scrolling) {
                O.HTML.classList.add('scrolling');
                E.dispatch('bibi:started-scrolling');
            } else {
                E.dispatch('bibi:keeps-scrolling');
            }
            E.dispatch('bibi:is-scrolling');
            if(++ScrollObserver.Scrolling == 33) {
                ScrollObserver.Scrolling = 1;
                E.dispatch('bibi:scrolled');
            }
            R.Timer_onScrollEnd = setTimeout(() => {
                ScrollObserver.Scrolling = 0;
                O.HTML.classList.remove('scrolling');
                E.dispatch('bibi:scrolled');
                E.dispatch('bibi:stopped-scrolling');
            }, 123);
            ScrollObserver.History.unshift(Math.ceil(R.Main['scroll' + C.L_OOBL_L])); // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            if(ScrollObserver.History.length > 2) ScrollObserver.History.length = 2;
        },
        observe: () => {
            R.Main.addEventListener('scroll', ScrollObserver.onScroll);
        },
        breakCurrentScrolling: () => {
            try { R.Breaking = true; sML.Scroller.Scrolling.cancel(); setTimeout(() => R.Breaking = false, 333); } catch(Err) { R.Breaking = false; }
        },
        forceStopScrolling: () => {
            ScrollObserver.breakCurrentScrolling();
            R.Main.style.overflow = 'hidden', R.Main.scrollLeft = R.Main.scrollLeft, R.Main.scrollTop = R.Main.scrollTop, R.Main.style.overflow = '';
        }
    }
    E.bind('bibi:opened', ScrollObserver.observe);
    E.dispatch('bibi:created-scroll-observer');
}};


I.PageObserver = { create: () => {
    const PageObserver = I.PageObserver = {
        // ---- Intersection
        IntersectingPages: [],
        PagesToBeObserved: [],
        observePageIntersection: (Page) => !PageObserver.PagesToBeObserved.includes(Page) ? PageObserver.PagesToBeObserved.push(Page) : PageObserver.PagesToBeObserved.length,
        unobservePageIntersection: (Page) => (PageObserver.PagesToBeObserved = PageObserver.PagesToBeObserved.filter(PageToBeObserved => PageToBeObserved != Page)).length,
        observeIntersection: () => {
            const Glasses = new IntersectionObserver(Ents => Ents.forEach(Ent => {
                const Page = Ent.target;
                let IntersectionChanging = false;
                //const IntersectionRatio = Math.round(Ent.intersectionRatio * 10000) / 100;
                if(Ent.isIntersecting) {
                    if(!PageObserver.IntersectingPages.includes(Page)) {
                        IntersectionChanging = true;
                        PageObserver.IntersectingPages.push(Page);
                    }
                } else {
                    if( PageObserver.IntersectingPages.includes(Page)) {
                        IntersectionChanging = true;
                        PageObserver.IntersectingPages = PageObserver.IntersectingPages.filter(IntersectingPage => IntersectingPage != Page);
                    }
                }
                if(IntersectionChanging) {
                    if(PageObserver.IntersectingPages.length) PageObserver.IntersectingPages.sort((A, B) => A.Index - B.Index);
                    E.dispatch('bibi:changes-intersection', PageObserver.IntersectingPages);
                    clearTimeout(PageObserver.Timer_IntersectionChange);
                    PageObserver.Timer_IntersectionChange = setTimeout(() => {
                        E.dispatch('bibi:changed-intersection', PageObserver.IntersectingPages);
                    }, 9);
                }
            }), {
                root: R.Main,
                rootMargin: '0px',
                threshold: 0
            });
            PageObserver.observePageIntersection = (Page) => Glasses.observe(Page);
            PageObserver.unobservePageIntersection = (Page) => Glasses.unobserve(Page);
            PageObserver.PagesToBeObserved.forEach(PageToBeObserved => Glasses.observe(PageToBeObserved));
            delete PageObserver.PagesToBeObserved;
        },
        // ---- Current
        Current: { List: [], Pages: [], Frame: {} },
        updateCurrent: () => {
            const Current = PageObserver.Current;
            const Frame = PageObserver.getFrame();
            if(Frame) {
                Current.Frame = Frame;
                const List = PageObserver.getList();
                if(List) {
                    Current.List = List;
                    const Pages = Current.Pages = List.map(CE => CE.Page);
                    const Items = Current.Items = [...new Set(Pages.map(Page => Page.Item))];
                    const Spreads = Current.Spreads = [...new Set(Items.map(Item => Item.Spread))];
                    PageObserver.classify();
                }
            }
            return Current;
        },
        getFrame: () => {
            const Frame = {};
            Frame.Length = R.Main['offset' + C.L_SIZE_L];
            Frame[C.L_OOBL_L                              ] = Math.ceil(R.Main['scroll' + C.L_OOBL_L]); // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            Frame[C.L_OOBL_L == 'Top' ? 'Bottom' : 'Right'] = Frame[C.L_OOBL_L] + Frame.Length;
            //if(PageObserver.Current.List.length && Frame[C.L_BASE_B] == PageObserver.Current.Frame.Before && Frame[C.L_BASE_A] == PageObserver.Current.Frame.After) return false;
            return { Before: Frame[C.L_BASE_B], After: Frame[C.L_BASE_A], Length: Frame.Length };
        },
        getCandidatePages: () => {
            const QSW = Math.ceil((R.Stage.Width - 1) / 4), QSH = Math.ceil((R.Stage.Height - 1) / 4), CheckRoute = [5, 6, 4, 2, 8]; // 4x4 matrix
            const CandidateParents = new Set();
            for(let l = CheckRoute.length, i = 0; i < l; i++) {
                const CheckPoint = CheckRoute[i], CPX = QSW * (CheckPoint % 3 || 3), CPY = QSH * Math.ceil(CheckPoint / 3); // console.log(CPX, CPY); ////////
                O.HTML.classList.add('searching-page');
                const Ele = document.elementFromPoint(CPX, CPY);
                O.HTML.classList.remove('searching-page');
                if(!Ele) continue;
                if(Ele.IsPage) return [Ele];
                CandidateParents.add(Ele);
            }
            if(CandidateParents.size) {
                const CandidateItems = new Set();
                CandidateParents.forEach(CandidateParent => {
                    if(CandidateParent.IndexInSpine) return CandidateItems.add(CandidateParent); // Item
                    if(CandidateParent.Items)        return CandidateParent.Items.forEach(Item => CandidateItems.add(Item)); // Spread
                    if(CandidateParent.Inside)       return CandidateParents.add(CandidateParent.Inside); // ItemBox or SpreadBox
                });
                if(CandidateItems.size) return [...CandidateItems].sort((_A, _B) => _A.Index - _B.Index).flatMap(Item => Item.Pages);
            }
            return PageObserver.IntersectingPages.length ? PageObserver.IntersectingPages : [];
        },
        getList: () => {
            let List = [], List_SpreadContained = [];
            const CandidatePages = PageObserver.getCandidatePages(); // console.log('a', CandidatePages.map(Page => Page.Index)); ////////
            if(!CandidatePages.length || typeof CandidatePages[0].Index != 'number') return null;
            const FirstIndex = sML.limitMin(CandidatePages[                        0].Index - 2,                  0);
            const  LastIndex = sML.limitMax(CandidatePages[CandidatePages.length - 1].Index + 2, R.Pages.length - 1);
            for(let BiggestPageIntersectionRatio = 0, i = FirstIndex; i <= LastIndex; i++) { const Page = R.Pages[i];
                const PageIntersectionStatus = PageObserver.getIntersectionStatus(Page, 'WithDetail');
                if(PageIntersectionStatus.Ratio < BiggestPageIntersectionRatio) {
                    if(List.length) break;
                } else {
                    const CurrentEntry = { Page: Page, PageIntersectionStatus: PageIntersectionStatus };
                    if(List.length) {
                        const Prev = List[List.length - 1];
                        if(Prev.Page.Item   == Page.Item  )   CurrentEntry.ItemIntersectionStatus =   Prev.ItemIntersectionStatus;
                        if(Prev.Page.Spread == Page.Spread) CurrentEntry.SpreadIntersectionStatus = Prev.SpreadIntersectionStatus;
                    }
                    if(  !CurrentEntry.ItemIntersectionStatus)   CurrentEntry.ItemIntersectionStatus = PageObserver.getIntersectionStatus(Page.Item.Box); // Item is scaled.
                    if(!CurrentEntry.SpreadIntersectionStatus) CurrentEntry.SpreadIntersectionStatus = PageObserver.getIntersectionStatus(Page.Spread);   // SpreadBox has margin.
                    if(CurrentEntry.SpreadIntersectionStatus.Ratio == 1) List_SpreadContained.push(CurrentEntry);
                         if(PageIntersectionStatus.Ratio > BiggestPageIntersectionRatio) List   = [CurrentEntry], BiggestPageIntersectionRatio = PageIntersectionStatus.Ratio;
                    else if(PageIntersectionStatus.Ratio)                                List.push(CurrentEntry);
                }
            } // console.log('b', List.map(Entry => Object.assign({}, Entry))); ////////
            return B.PrePaginated && List_SpreadContained.length ? List_SpreadContained : List.length ? List : null;
        },
        getIntersectionStatus: (Ele, WithDetail) => {
            const Coord = sML.getCoord(Ele), _D = C.L_AXIS_D;
            const LengthInside = Math.min(PageObserver.Current.Frame.After * _D, Coord[C.L_BASE_A] * _D) - Math.max(PageObserver.Current.Frame.Before * _D, Coord[C.L_BASE_B] * _D);
            const Ratio = (LengthInside <= 0 || !Coord[C.L_SIZE_L] || isNaN(LengthInside)) ? 0 : LengthInside / Coord[C.L_SIZE_L];
            const IntersectionStatus = { Ratio: Ratio };
            if(Ratio <= 0) {} else if(WithDetail) {
                if(Ratio >= 1) {
                    IntersectionStatus.Contained = true;
                } else {
                    const FC_B = PageObserver.Current.Frame.Before * _D, FC_A = PageObserver.Current.Frame.After * _D;
                    const PC_B = Coord[C.L_BASE_B]                 * _D, PC_A = Coord[C.L_BASE_A]                * _D;
                         if(FC_B <  PC_B        ) IntersectionStatus.Entering = true;
                    else if(FC_B == PC_B        ) IntersectionStatus.Headed   = true;
                    else if(        PC_A == FC_A) IntersectionStatus.Footed   = true;
                    else if(        PC_A <  FC_A) IntersectionStatus.Passing  = true;
                    if(R.Main['offset' + L] < Coord[C.L_SIZE_L]) IntersectionStatus.Oversized = true;
                }
            }
            return IntersectionStatus;
        },
        classify: () => {
            const [Curr, Prev, Next] = ['current', 'prev-of-current', 'next-of-current'].map(CN => ({ ClassName: CN, PastElements: new Set(R.Main.Book.querySelectorAll('.' + CN)), NewElements: new Set() }));
            PageObserver.Current.Pages.forEach(Page => { const Item = Page.Item, Spread = Page.Spread;
                [                   Page,                     Item.Box,                       Spread.Box].forEach(Ele => Curr.NewElements.add(Ele));
                [R.Pages[Page.Index - 1], R.Items[Item.Index - 1]?.Box, R.Spreads[Spread.Index - 1]?.Box].forEach(Ele => Prev.NewElements.add(Ele));
                [R.Pages[Page.Index + 1], R.Items[Item.Index + 1]?.Box, R.Spreads[Spread.Index + 1]?.Box].forEach(Ele => Next.NewElements.add(Ele));
            });
            Curr.NewElements.forEach(Ele => Ele.classList.add(Curr.ClassName));
            [Prev, Next].forEach(PN => PN.NewElements.forEach(Ele => Ele && !Curr.NewElements.has(Ele) ? Ele.classList.add(PN.ClassName) : PN.NewElements.delete(Ele)));
            [Curr, Prev, Next].forEach(CPN => CPN.PastElements.forEach(Ele => CPN.NewElements.has(Ele) || Ele.classList.remove(CPN.ClassName)));
        },
        observeCurrent: () => {
            E.bind(['bibi:changed-intersection', 'bibi:scrolled'], PageObserver.updateCurrent);
        },
        // ---- PageChange
        Past:    { List: [{ Page: null, PageIntersectionStatus: null }] },
        observePageMove: () => {
            E.bind('bibi:scrolled', () => {
                const CS = PageObserver.Current.List[0], CE = PageObserver.Current.List.slice(-1)[0], CSP = CS.Page, CEP = CE.Page, CSPIS = CS.PageIntersectionStatus, CEPIS = CE.PageIntersectionStatus;
                const PS =    PageObserver.Past.List[0], PE =    PageObserver.Past.List.slice(-1)[0], PSP = PS.Page, PEP = PE.Page;
                const FPI = 0, LPI = R.Pages.length - 1;
                let Flipped = false, AtTheBeginning = false, AtTheEnd = false;
                if(CSP != PSP || CEP != PEP) {
                    Flipped = true;
                    if(CSP.Index == FPI && (CSPIS.Contained || CSPIS.Headed)) AtTheBeginning = true;
                    if(CEP.Index == LPI && (CEPIS.Contained || CEPIS.Footed)) AtTheEnd       = true;
                } else {
                    const PSPIS = PS.PageIntersectionStatus, PEPIS = PE.PageIntersectionStatus
                    if(CSP.Index == FPI && (CSPIS.Contained || CSPIS.Headed) && !(PSPIS.Contained || PSPIS.Headed)) AtTheBeginning = true;
                    if(CEP.Index == LPI && (CEPIS.Contained || CEPIS.Footed) && !(PEPIS.Contained || PEPIS.Footed)) AtTheEnd       = true;
                }
                const ReturnValue = { Past: PageObserver.Past, Current: PageObserver.Current };
                if(Flipped       ) E.dispatch('bibi:flipped',              ReturnValue);
                if(AtTheBeginning) E.dispatch('bibi:got-to-the-beginning', ReturnValue);
                if(AtTheEnd      ) E.dispatch('bibi:got-to-the-end',       ReturnValue);
                Object.assign(PageObserver.Past, PageObserver.Current);
            });
        },
        automark: () => { try {
            I.Oven.Biscuits.memorize('Book', { Automarks: [{ IsAutomark: true, P: R.getP() }] });
        } catch(Err) {} }
    };
    E.bind('bibi:laid-out-for-the-first-time', LayoutOption => {
        PageObserver.IntersectingPages = R.Items[LayoutOption.TargetItemIndex].Pages.concat(); // copy
        PageObserver.observeIntersection();
    });
    E.bind('bibi:initialized-biscuits', () => {
        if(R.StartOn || !S['resume-from-last-position']) return;
        const Automarks = I.Oven.Biscuits.remember('Book', 'Automarks');
        if(Array.isArray(Automarks) && Automarks[0]?.P) R.StartOn = Object.assign({}, I.Oven.Biscuits.remember('Book').Automarks[0]);
    });
    E.bind('bibi:opened', () => {
        PageObserver.updateCurrent();
        PageObserver.observeCurrent();
        PageObserver.observePageMove();
    });
    if(S['resume-from-last-position']) E.bind('bibi:started', () => {
        E.bind('bibi:realized-oven', () => PageObserver.automark());
        E.add('bibi:stopped-scrolling', () => {
            // clearTimeout(PageObserver.Timer_automarkOnScrolled);
            // PageObserver.Timer_automarkOnScrolled = setTimeout(() => PageObserver.automark(), 99);
            PageObserver.automark();
        });
    });
    E.dispatch('bibi:created-page-observer');
}};


I.Turner = { create: () => {
    const Turner = I.Turner = {
        // TurningOrders: [], PastTurningOrdersString: '', ItemsNowTurning: [], TurningProcessID: '',
        getTurningOriginItem: (Dir = 1) => {
            const List = I.PageObserver.Current.List?.length ? I.PageObserver.Current.List : I.PageObserver.IntersectingPages?.length ? I.PageObserver.IntersectingPages : null;
            return List?.[Dir > 0 ? 0 : List.length - 1]?.Page?.Item || null;
        },
        filterOrders: (Orders) => Orders.filter(Items => Items && (Items = Items.filter(Item => Item?.Turned != 'Up')).length),
        stringifyOrders: (Orders) => Orders.map(Items => Items ? Items.map(Item => Item ? Item.Index : '').join('+') : '').join('-'),
        turnItems: (Opt = {}) => {
            if(R.DoNotTurn || !S['allow-placeholders']) return;
            const Dir = (I.ScrollObserver.History.length > 1) && (I.ScrollObserver.History[1] * C.L_AXIS_D > I.ScrollObserver.History[0] * C.L_AXIS_D) ? -1 : 1;
            const OItem = Opt.Origin || Turner.getTurningOriginItem(Dir); if(!OItem) return;
            let NewOrders = [];
            if(R.Orientation == 'landscape') {
                const i = OItem.Spread.Index;
                // [0, Dir, Dir * -1, 2].forEach(Distance => { const Spread = R.Spreads[i + Distance]; if(Spread) Spread.Items.forEach(Item => NewOrders.push([Item])); }); // one by one
                [0, Dir, Dir * -1, 2].forEach(Distance => { const Spread = R.Spreads[i + Distance]; if(Spread) NewOrders.push([...Spread.Items]); });
            } else {
                NewOrders.push([OItem]);
                const PItem = OItem.SpreadPair; if(PItem) NewOrders.push([PItem]);
                const i = OItem.Index; 
                [Dir, Dir * -1].forEach(Distance => { const Item = R.Items[i + Distance]; if(Item && Item != PItem) NewOrders.push([Item]); });
                [2,          3].forEach(Distance => { const Item = R.Items[i + Distance]; if(Item                 ) NewOrders.push([Item]); });
            }
            NewOrders = Turner.filterOrders(NewOrders);
            const NewOrdersString = Turner.stringifyOrders(NewOrders);
            if(!NewOrders.length || NewOrdersString === Turner.PastTurningOrdersString) return;
            const ProcessID = Turner.TurningProcessID = O.id(); //// Set after ^
            /* ==== */ O.log('I.Turner.turnItems > NewOrders:', NewOrders.map(Items => Items.map(Item => Item.Index).join(',')));
            Turner.TurningOrders = NewOrders, Turner.PastTurningOrdersString = NewOrdersString;
            if(Turner.ItemsNowTurning) Turner.ItemsNowTurning.forEach(Item => !Turner.TurningOrders[0].includes(Item) && Turner.turnItem(Item, false));
            (function turn() {
                const Items = Turner.ItemsNowTurning = Turner.TurningOrders.shift();
                // if(Items) Promise.all(Items.map((Item, i) => new Promise(resolve => setTimeout(() => Turner.turnItem(Item, true).finally(resolve), 69 * i)))).then(() => ProcessID == Turner.TurningProcessID && turn()); // delay in spread
                if(Items) Promise.all(Items.map(Item => Turner.turnItem(Item, true))).then(() => ProcessID == Turner.TurningProcessID && turn());
            })();
        },
        turnItem: async (Item, Up) => {
            if(R.DoNotTurn || !S['allow-placeholders'] || !Item || Item.TurningUp === (Up = !!Up)) return;
            Item.TurningUp = Up;
            const ProcessID = Item.TurningProcessID = O.id();
            await Promise.resolve(Item.Turning);
            return Item.Turning = Promise.resolve().then(() => {
                if(Up || !O.RangeLoader) return;
                O.log('I.Turner.turnItem > cancel:', Item.Index);
                return O.cancelExtraction(Item.Source);
            }).then(() => O.chain({ assure: () => ProcessID == Item.TurningProcessID, Label: 'I.Turner.turnItem' },
                () => L.loadItem(Item, { AllowPlaceholder: !Up }),
                () => R.layOutItem(Item),
                () => R.layOutSpread(Item.Spread, { Makeover: true })
            )).catch(() => {}).then(() => {
                delete Item.TurningUp;
                return Item;
            });
        },
        rerotateItem: (Item) => O.chain(
            () => Turner.turnItem(Item, false),
            () => Turner.turnItem(Item, true)
        )
    };
    E.bind('bibi:started', () => E.add('bibi:scrolled', () => Turner.turnItems()));
    E.dispatch('bibi:created-turner');
}};


I.ResizeObserver = { create: () => {
    const ResizeObserver = I.ResizeObserver = {
        Resizing: false,
        TargetPageAfterResizing: null,
        onResize: (Eve) => { if(R.LayingOut || !L.Opened) return;
            if(!ResizeObserver.Resizing) {
                ResizeObserver.TargetAfterResizing = R.getElement();
                ResizeObserver.onResizeStart(Eve);
            };
            clearTimeout(ResizeObserver.Timer_onResizeEnd);
            ResizeObserver.Timer_onResizeEnd = setTimeout(() => {
                R.layOutBook({
                    Reset: true,
                    Destination: ResizeObserver.TargetAfterResizing
                }).then(() => {
                    ResizeObserver.onResizeEnd(Eve);
                    ResizeObserver.Resizing = false;
                    ResizeObserver.TargetAfterResizing = null;
                });
            }, O.TouchOS ? 999 : 333);
        },
        onResizeStart: (Eve) => {
            E.dispatch('bibi:is-going-to:resize', Eve);
            ResizeObserver.Resizing = true;
            //////// R.Main.removeEventListener('scroll', I.ScrollObserver.onScroll);
            O.Busy = true;
            O.HTML.classList.add('busy');
            O.HTML.classList.add('resizing');
        },
        onResizeEnd: (Eve) => {
            E.dispatch('bibi:resized', Eve);
            O.HTML.classList.remove('resizing');
            O.HTML.classList.remove('busy');
            O.Busy = false;
            //////// R.Main.addEventListener('scroll', I.ScrollObserver.onScroll);
            // I.ScrollObserver.onScroll();
        },
        addEventListener: (fn) => {
            screen.orientation?.addEventListener ? screen.orientation.addEventListener('change', fn) : window.addEventListener('orientationchange', fn);
            window.addEventListener('resize', fn);
        }
    };
    E.bind('bibi:opened', () => ResizeObserver.addEventListener(ResizeObserver.onResize));
    E.dispatch('bibi:created-resize-observer');
}};


I.TouchObserver = { create: () => {
    const TimeLimit = { D2U: 300, U2D: 300 };
    const TouchObserver = I.TouchObserver = {
        observeElementHover: (Ele) => {
            if(!Ele.BibiHoverObserver) {
                Ele.BibiHoverObserver = {
                    onHover:   (Eve) => E.dispatch(Ele, 'bibi:hovered', Eve),
                    onUnHover: (Eve) => E.dispatch(Ele, 'bibi:unhovered', Eve)
                };
                Ele.addEventListener(E['pointerover'], Eve => Ele.BibiHoverObserver.onHover(Eve));
                Ele.addEventListener(E['pointerout'],  Eve => Ele.BibiHoverObserver.onUnHover(Eve));
            }
            return Ele;
        },
        setElementHoverActions: (Ele) => {
            E.add(Ele, 'bibi:hovered', Eve => { if(Ele.Hover || (Ele.isAvailable && !Ele.isAvailable(Eve))) return Ele;
                Ele.Hover = true;
                Ele.classList.add('hover');
                if(Ele.showHelp) Ele.showHelp();
                return Ele;
            });
            E.add(Ele, 'bibi:unhovered', Eve => { if(!Ele.Hover) return Ele;
                Ele.Hover = false;
                Ele.classList.remove('hover');
                if(Ele.hideHelp) Ele.hideHelp();
                return Ele;
            });
            return Ele;
        },
        observeElementTap: (Ele, Opt = {}) => {
            if(!Ele.BibiTapObserver) {
                Ele.addEventListener(E['pointerdown'], Eve => Ele.BibiTapObserver.onPointerDown(E.aBCD(Eve)));
                Ele.addEventListener(E['pointerup'],   Eve => Ele.BibiTapObserver.onPointerUp(  E.aBCD(Eve)));
                Ele.BibiTapObserver = {
                    Staccato: 0,
                    staccato: function(fn) {
                        clearTimeout(this.Timer_Staccato);
                        fn(++this.Staccato);
                        this.Timer_Staccato = setTimeout(() => this.Staccato = 0, TimeLimit.U2D);
                    },
                    care: Opt.PreventDefault ? (Opt.StopPropagation ? _ => _.preventDefault() || _.stopPropagation() : _ => _.preventDefault()) : (Opt.StopPropagation ? _ => _.stopPropagation() : () => {}),
                    onPointerDown: function(BibiEvent) {
                        if((typeof BibiEvent.buttons == 'number' && BibiEvent.buttons !== 1) || BibiEvent.ctrlKey) return;
                        this.care(BibiEvent);
                        clearTimeout(this.Timer_fireTap);
                        this.TapLandingBibiEvent = Object.assign(BibiEvent, { IsTapLandingBibiEvent: true });
                        if(!this.TapFloatingBibiEvent) return;
                        if((BibiEvent.timeStamp - this.TapFloatingBibiEvent.timeStamp) < TimeLimit.U2D) {
                            this.TapFloatingBibiEvent.TapLandingBibiEvent.preventDefault();
                            this.TapFloatingBibiEvent.preventDefault();
                            BibiEvent.preventDefault();
                        } else {
                            delete this.TapFloatingBibiEvent;
                        }
                    },
                    onPointerUp: function(BibiEvent) {
                        this.care(BibiEvent);
                        if(!this.TapLandingBibiEvent) return;
                        if((BibiEvent.timeStamp - this.TapLandingBibiEvent.timeStamp) < TimeLimit.D2U) {
                            if(Math.abs(BibiEvent.Coord.X - this.TapLandingBibiEvent.Coord.X) < 3 && Math.abs(BibiEvent.Coord.Y - this.TapLandingBibiEvent.Coord.Y) < 3) {
                                const TapAccumulation = !this.TapFloatingBibiEvent ? [] : [...this.TapFloatingBibiEvent.TapAccumulation];
                                TapAccumulation.push(this.TapFloatingBibiEvent = this.TapLandingBibiEvent.TapFloatingBibiEvent = Object.assign(BibiEvent, {
                                    IsTapFloatingBibiEvent: true,
                                    TapLandingBibiEvent: this.TapLandingBibiEvent,
                                    TapAccumulation: TapAccumulation
                                }));
                                this.onTap(this.TapFloatingBibiEvent, 'IsStaccato');
                                const fire = () => {
                                    if(this.TapFloatingBibiEvent) this.onTap(this.TapFloatingBibiEvent);
                                    delete this.TapFloatingBibiEvent;
                                };
                                if(S['recognize-repeated-taps-separately']) fire(); else this.Timer_fireTap = setTimeout(fire, TimeLimit.U2D);
                            } else {
                                delete this.TapFloatingBibiEvent;
                            }
                        }
                        delete this.TapLandingBibiEvent;
                    },
                    onTap: function(BibiEvent, IsStaccato) {
                        if(IsStaccato) {
                            this.staccato(Sta => Object.assign(BibiEvent, { IsTapBibiEvent: true, Staccato: Sta }));
                            E.dispatch(Ele, 'bibi:tapped' + (!BibiEvent.altKey ? '' : '-with-altkey'), BibiEvent); // 'bibi:tapped', 'bibi:tapped-with-altkey'
                            return;
                        }
                        if(!BibiEvent || !Array.isArray(BibiEvent.TapAccumulation) || BibiEvent.TapAccumulation.length == 0 || BibiEvent.TapAccumulation.length > 3) return;
                        let EventName = '';
                        switch(BibiEvent.TapAccumulation.length) {
                            case 1: EventName = 'bibi:singletapped'; BibiEvent.IsSingleTapBibiEvent = true; delete BibiEvent.IsTapBibiEvent; break;
                            case 2: EventName = 'bibi:doubletapped'; BibiEvent.IsDoubleTapBibiEvent = true;                                  break;
                            case 3: EventName = 'bibi:tripletapped'; BibiEvent.IsTripleTapBibiEvent = true;                                  break;
                        }
                        if(BibiEvent.altKey) EventName += '-with-altkey'; // 'bibi:singletapped-with-altkey', 'bibi:doubletapped-with-altkey', 'bibi:tripletapped-with-altkey'
                        E.dispatch(Ele, EventName, Object.assign(BibiEvent, { RangeOfSelection: BibiEvent.TapAccumulation[0].TapLandingBibiEvent.RangeOfSelection }));
                    }
                };
            }
            return Ele;
        },
        setElementTapActions: (Ele) => {
            const onTap = (() => { switch(Ele.Type) {
                case 'toggle': return () => { if(Ele.UIState == 'disabled') return false;
                    I.setUIState(Ele, Ele.UIState == 'default' ? 'active' : 'default');
                };
                case 'radio': return () => { if(Ele.UIState == 'disabled') return false;
                    Ele.ButtonGroup.Buttons.forEach(Button => { if(Button != Ele) I.setUIState(Button, ''); });
                    I.setUIState(Ele, 'active');
                };
                default: return () => { if(Ele.UIState == 'disabled') return false;
                    I.setUIState(Ele, 'active');
                    clearTimeout(Ele.Timer_deactivate);
                    Ele.Timer_deactivate = setTimeout(() => I.setUIState(Ele, Ele.UIState == 'disabled' ? 'disabled' : ''), 200);
                };
            } })();
            E.add(Ele, 'bibi:singletapped', BibiEvent => { if((Ele.isAvailable && !Ele.isAvailable(BibiEvent)) || (Ele.UIState == 'disabled') || (Ele.UIState == 'active' && Ele.Type == 'radio')) return Ele;
                onTap();
                if(Ele.hideHelp) Ele.hideHelp();
                if(Ele.notify) setTimeout(Ele.notify, 0);
                return Ele;
            });
            return Ele;
        },
        PointerEventNames: O.TouchOS ? [['touchstart', 'mousedown'], ['touchend', 'mouseup'], ['touchmove', 'mousemove']] : document.onpointermove !== undefined ? ['pointerdown', 'pointerup', 'pointermove'] : ['mousedown', 'mouseup', 'mousemove'],
        PreviousPointerCoord: { X: 0, Y: 0 },
        activateHTML: (HTML) => {
            TouchObserver.observeElementTap(HTML);
            [      'bibi:tapped',       'bibi:tapped-with-altkey',
             'bibi:singletapped', 'bibi:singletapped-with-altkey',
             'bibi:doubletapped', 'bibi:doubletapped-with-altkey',
             'bibi:tripletapped', 'bibi:tripletapped-with-altkey'].forEach(TapEventName => E.add(HTML, TapEventName, BibiEvent => E.dispatch(TapEventName, BibiEvent)));
            const TOPENs = TouchObserver.PointerEventNames;
            E.add(HTML, TOPENs[0], Eve => E.dispatch('bibi:downed-pointer', E.aBCD(Eve)), E.CPO_100);
            E.add(HTML, TOPENs[1], Eve => E.dispatch( 'bibi:upped-pointer', E.aBCD(Eve)), E.CPO_100);
            E.add(HTML, TOPENs[2], Eve => {
                const BibiEvent = E.aBCD(Eve);
                const CC = BibiEvent.Coord, PC = TouchObserver.PreviousPointerCoord;
                E.dispatch((PC.X != CC.X || PC.Y != CC.Y) ? 'bibi:moved-pointer' : 'bibi:stopped-pointer', BibiEvent);
                TouchObserver.PreviousPointerCoord = CC;
                //Eve.preventDefault();
                Eve.stopPropagation();
            }, E.CPO_100);
        }
    }
    E.bind('bibi:readied',            (    ) => TouchObserver.activateHTML(   O.HTML));
    E.bind('bibi:postprocessed-item', (Item) => TouchObserver.activateHTML(Item.HTML));
    E.dispatch('bibi:created-touch-observer');
}};


I.FlickObserver = { create: () => {
    const FlickObserver = I.FlickObserver = {
        getPassage: (From, To) => ({ X: To.X - From.X, Y: To.Y - From.Y }),
        getDistance: (From, To) => { const { X, Y } = FlickObserver.getPassage(From, To); return Math.sqrt(X ** 2 + Y ** 2); },
        getProgress: (From, To) => FlickObserver.getDistance(From, To) / Math.min(128, R.Stage.Width * 0.333, R.Stage.Height * 0.333),
        getDegree: (From, To) => { const { X, Y } = FlickObserver.getPassage(From, To); return (Math.atan2(X, Y * -1) * 180 / Math.PI + 360) % 360; }, // N:0, E:90, S:180, W:270. Swap X/Y of the arguments for Math.atan2 to match the clock face.
        getDividedDirectionIndex: (From, To, Div) => Math.floor(FlickObserver.getDegree(From, To) / (360 / Div) + 0.5) % Div,
        // getClockDirection: (From, To) => FlickObserver.getDividedDirectionIndex(From, To, 12) || 12,
        // getAzimuthDirection: (From, To, Div = 16) => { switch(FlickObserver.getDividedDirectionIndex(From, To, Div) * (16 / Div)) { // Div: 4 or 8 or 16.
        //               /* ////////// */ case  0: return 'N';
        //           case 15: return 'NNW'; case  1: return 'NNE';
        //        case 14: return 'NW';        case  2: return  'NE';
        //      case 13: return 'WNW';           case  3: return 'ENE';
        //     case 12: return 'W';               case  4: return   'E';
        //      case 11: return 'WSW';           case  5: return 'ESE';
        //        case 10: return 'SW';        case  6: return  'SE';
        //           case  9: return 'SSW'; case  7: return 'SSE';
        //               case  8: return 'S'; /* ////////// */
        // }},
        MovementPrototype: ['getPassage', 'getProgress', 'getDistance', 'getDegree'].reduce(
            (Mv, FN) => (Mv[FN] = function(BibiEvent, ...Args) { return FlickObserver[FN](this.Started.BibiEvent.Coord, BibiEvent.Coord, ...Args); }) && Mv, {
            getVector: function(BibiEvent) {
                let DDI = FlickObserver.getDividedDirectionIndex(this.Started.BibiEvent.Coord, BibiEvent.Coord, 8);
                switch(DDI) {
                    case 1: case 5: C.A_AXIS_L == 'X' ? DDI++ : DDI--; break;
                    case 3: case 7: C.A_AXIS_L == 'X' ? DDI-- : DDI++; break;
                }
                switch(DDI % 8) {
                    case 0: return { Axis: 'Y', Direction: { From: 'bottom'/*, To: 'top'*/ } };
                    case 2: return { Axis: 'X', Direction: { From: 'left'/*, To: 'right'*/ } };
                    case 4: return { Axis: 'Y', Direction: { From: 'top'/*, To: 'bottom'*/ } };
                    case 6: return { Axis: 'X', Direction: { From: 'right'/*, To: 'left'*/ } };
                }
            }
        }),
        getMovement: (BibiEvent) => Object.assign({}, FlickObserver.MovementPrototype, {
            Started: {
                BibiEvent: BibiEvent,
                TimeStamp: BibiEvent.timeStamp,
                Item: BibiEvent.target.ownerDocument.body.Item || null,
                ScrollLeft: R.Main.scrollLeft,
                ScrollTop: R.Main.scrollTop,
                OriginList: I.PageObserver.updateCurrent().List
            },
            Last: {
                BibiEvent: null
            },
            Moving: 0,
            AxisSwitcherReadied: I.AxisSwitcher && I.orthogonal('touchmove') == 'switch' && I.Loupe.CurrentTransformation.Scale == 1
        }),
        isInSafeAreas: (BibiEvent) => {
            for(let i = 0; i < 4; i++) { const SafeArea = S['touchmove-ignoring-area'][i]; if(!SafeArea) continue; switch(i) {
                case 0: if(BibiEvent.Coord.Y <                  (SafeArea < 1 ? R.Stage.Height * SafeArea : SafeArea)) return true; break;
                case 1: if(BibiEvent.Coord.X > R.Stage.Width  - (SafeArea < 1 ? R.Stage.Width  * SafeArea : SafeArea)) return true; break;
                case 2: if(BibiEvent.Coord.Y > R.Stage.Height - (SafeArea < 1 ? R.Stage.Height * SafeArea : SafeArea)) return true; break;
                case 3: if(BibiEvent.Coord.X <                  (SafeArea < 1 ? R.Stage.Width  * SafeArea : SafeArea)) return true; break;
            }} return false;
        },
        onTouchStart: (BibiEvent) => {
            if(!L.Opened) return;
            //if(S.RVM != 'paged' && O.TouchOS) return;
            if(BibiEvent.touches && BibiEvent.touches.length != 1) return;
            if(FlickObserver.Movement?.Last.BibiEvent) return FlickObserver.onTouchEnd();
            if(I.Loupe.Transforming) return;
            if(FlickObserver.isInSafeAreas(BibiEvent)) return;
            //BibiEvent.preventDefault();
            FlickObserver.Movement = FlickObserver.getMovement(BibiEvent);
            E.add('bibi:moved-pointer', FlickObserver.onTouchMove);
            E.add('bibi:upped-pointer', FlickObserver.onTouchEnd);
        },
        cancel: () => {
            delete FlickObserver.Movement;
            E.remove('bibi:moved-pointer', FlickObserver.onTouchMove);
            E.remove('bibi:upped-pointer', FlickObserver.onTouchEnd);
        },
        onTouchMove: (BibiEvent) => {
            //if(BibiEvent.touches && BibiEvent.touches.length == 1 && O.getViewportZooming() <= 1) BibiEvent.preventDefault();
            I.ScrollObserver.breakCurrentScrolling();
            const Mv = FlickObserver.Movement; if(Mv) { const MvS = Mv.Started;
                if(!Mv.Moving++) {
                    const TimeFromTouchStarted = BibiEvent.timeStamp - MvS.TimeStamp;
                    if(O.TouchOS || (BibiEvent.type != 'mousemove' && BibiEvent.pointerType != 'mouse') || S['prioritise-viewer-operation-over-text-selection']) { if(TimeFromTouchStarted > 234) return FlickObserver.cancel(); }
                    else                                                                                                                                         { if(TimeFromTouchStarted < 234) return FlickObserver.cancel(); }
                    MvS.TimeStamp = BibiEvent.timeStamp;
                }
                const Vector = Mv.getVector(BibiEvent);
                if(!Mv.LaunchingVector && Mv.getDistance(BibiEvent) >= 22) Mv.LaunchingVector = Vector;
                if(Mv.LaunchingVector?.Axis == C.A_AXIS_B) {
                    // Orthogonal
                    if(Mv.AxisSwitcherReadied) I.AxisSwitcher.progress(Vector.Axis != C.A_AXIS_B ? 0 : Mv.getProgress(BibiEvent, C.A_AXIS_B));
                } else {
                    // Natural
                    if(S.RVM != 'paged' && BibiEvent.type == 'touchmove') return Mv.LaunchingVector && FlickObserver.cancel();
                    if(I.draggable() && I.isScrollable()) R.Main['scroll' + C.L_OOBL_L] = MvS['Scroll' + C.L_OOBL_L] + Mv.getPassage(BibiEvent)[C.L_AXIS_L] * -1;
                }
                BibiEvent.preventDefault();
                if(MvS.Item) {
                    MvS.Item.HTML.classList.add('bibi-flick-hot');
                    MvS.Item.contentWindow.getSelection().empty();
                }
                Mv.Last.BibiEvent = BibiEvent;
                if(BibiEvent.Coord[C.A_AXIS_L] <= 0 || BibiEvent.Coord[C.A_AXIS_L] >= R.Stage[C.A_SIZE_L] || BibiEvent.Coord[C.A_AXIS_B] <= 0 || BibiEvent.Coord[C.A_AXIS_B] >= R.Stage[C.A_SIZE_B]) return FlickObserver.onTouchEnd(BibiEvent, { Swipe: true });
            }
        },
        onTouchEnd: (BibiEvent, Opt) => {
            let cb = undefined, Par = {};
            const Mv = FlickObserver.Movement; if(Mv) { const MvS = Mv.Started;
                if(!BibiEvent) BibiEvent = Mv.Last.BibiEvent;
                if(MvS.Item) MvS.Item.HTML.classList.remove('bibi-flick-hot');
                if(!I.Loupe.Transforming) {
                    const Vector = Mv.getVector(BibiEvent);
                    if(Mv.LaunchingVector?.Axis == C.A_AXIS_B && Vector.Axis == C.A_AXIS_B) {
                        // Orthogonal Pan/Releace
                        cb = Mv.getProgress(BibiEvent) >= 1 ? (Mv.AxisSwitcherReadied ? I.AxisSwitcher.switchAxis : I.orthogonal('touchmove') == 'utilities' ? I.Utilities.toggleGracefuly : undefined) : I.AxisSwitcher?.reset;
                    }
                    const Distance = Mv.getDistance(BibiEvent);
                    if(!cb && Distance >= 5) {
                        // Moved (== not Tap)
                        BibiEvent.preventDefault();
                        const Duration = BibiEvent.timeStamp - MvS.TimeStamp;
                        Par.Speed = Distance / Duration;
                        if(O.getViewportZooming() <= 1 && Duration <= 300) {
                            if(S.RVM == 'paged' || I.draggable()) {
                                Par.OriginList = MvS.OriginList;
                                Par.Vector = Vector;
                                cb = Opt?.Swipe ? FlickObserver.onSwipe : FlickObserver.onFlick;
                            }
                        } else if(I.isScrollable()) {
                            if(S.RVM == 'paged' && I.draggable()) {
                                Par.Vector = { Direction: { From: Mv.getDegree(BibiEvent) < 180 ? 'left' /* to right */ : 'right' /* to left */ } };
                                cb = FlickObserver.onPanRelease;
                            }
                        }
                    } else {
                        // Not Moved (== Tap)
                        // [[[[ Do Nothing ]]]] (to avoid conflicts with other tap events on other UIs like Arrows.)
                    }
                }
            }
            FlickObserver.cancel();
            return Promise.resolve(cb?.(BibiEvent, Par));
        },
        onFlick: (BibiEvent, Par) => { // Only for Paged View or Draggable Scrolling Views ====
            if(!I.draggable() && S.RVM != 'paged') return Promise.resolve();
            if(!BibiEvent || !Par) return Promise.resolve();
            const Dist = C.d2d(Par.Vector.Direction.From, I.orthogonal('touchmove') == 'move');
            if(!Dist) {
                // Orthogonal (not for "move")
                return Promise.resolve().then(() => { switch(I.orthogonal('touchmove')) {
                    case 'switch': return I.AxisSwitcher?.switchAxis();
                    case 'utilities': return I.Utilities.toggleGracefuly();
                }});
            } else if(S.RVM == 'paged' || S.RVM == 'horizontal' && Par.Vector.Axis == 'Y' || S.RVM == 'vertical' && Par.Vector.Axis == 'X') {
                // Paged || Scrolling && Orthogonal
                const PageIndex = (Dist > 0 ? Par.OriginList.slice(-1)[0].Page.Index : Par.OriginList[0].Page.Index);
                return R.focusOn({ Page: R.Pages[PageIndex + Dist] || R.Pages[PageIndex] }, { Duration: !I.isScrollable() ? 0 : I.draggable() || S.RVM != 'paged' ? 123 : 0 });
            } else {
                // Scrolling && Natural
                return R.scrollBy(Dist * (Par.Speed ? sML.limitMinMax(Math.round(Par.Speed * 100) * 0.08, 0.33, 10) * 333 / (S.SLD == 'ttb' ? R.Stage.Height : R.Stage.Width) : 1), {
                    Duration: 1234,
                    Cancelable: true,
                    ease: (_) => (Math.pow(--_, 4) - 1) * -1
                });
            }
        },
        onSwipe: (...Args) => FlickObserver.onFlick(...Args),
        onPanRelease: (BibiEvent, Par) => { // Only for Paged View ====
            if(!I.draggable() || S.RVM != 'paged') return Promise.resolve();
            if(!BibiEvent || !Par) return Promise.resolve();
            const Dist = C.d2d(Par.Vector.Direction.From);
            const CurrentList = I.PageObserver.updateCurrent().List, CurrentPage = Dist >= 0 ? CurrentList.slice(-1)[0].Page : CurrentList[0].Page;
            return R.focusOn({ Page: CurrentList.length == 1 && CurrentList[0].SpreadIntersectionStatus.Ratio < 0.5 ? R.Pages[CurrentPage.Index + Dist] || CurrentPage : CurrentPage }, {
                Duration: !I.isScrollable() ? 0 : I.draggable() ? 123 : 0
            });
        },
        getCNPf: (Ele) => Ele.ownerDocument == document ? '' : 'bibi-',
        activateElement: (Ele) => { if(!Ele) return false;
            if(!Ele.FlickObserver) Ele.FlickObserver = {};
            if(!Ele.FlickObserver.onPointerDown) Ele.FlickObserver.onPointerDown = Eve => FlickObserver.onTouchStart(E.aBCD(Eve));
            Ele.addEventListener(O.TouchOS ? 'touchstart' : E['pointerdown'], Ele.FlickObserver.onPointerDown, E.CPO_100);
            const CNPf = FlickObserver.getCNPf(Ele);
            /**/                 Ele.ownerDocument.documentElement.classList.add(CNPf + 'flick-active');
            if(I.isScrollable()) Ele.ownerDocument.documentElement.classList.add(CNPf + 'flick-scrollable');
        },
        deactivateElement: (Ele) => { if(!Ele) return false;
            if(Ele.FlickObserver?.onPointerDown) Ele.removeEventListener(O.TouchOS ? 'touchstart' : E['pointerdown'], Ele.FlickObserver.onPointerDown, E.CPO_100);
            const CNPf = FlickObserver.getCNPf(Ele);
            Ele.ownerDocument.documentElement.classList.remove(CNPf + 'flick-active');
            Ele.ownerDocument.documentElement.classList.remove(CNPf + 'flick-scrollable');
        }
    };
    FlickObserver.activateElement(R.Main);
    E.add('bibi:loaded-item', Item => FlickObserver.activateElement(Item.HTML));
    E.dispatch('bibi:created-flick-observer');
}};


I.WheelObserver = { create: () => {
    const WheelObserver = I.WheelObserver = {
        TotalDelta: 0,
        Turned: false,
        Wheels: [],
        // OverlaidUIs: [],
        reset: () => {
            WheelObserver.TotalDelta = 0;
            WheelObserver.Progress = 0;
            WheelObserver.Turned = false;
            WheelObserver.Wheels = [];
            if(I.AxisSwitcher) I.AxisSwitcher.reset();
        },
        reserveResetWith: (fn) => {
            clearTimeout(WheelObserver.Timer_resetWheeling);
            try { fn(); } catch(Err) {}
            WheelObserver.Timer_resetWheeling = setTimeout(WheelObserver.reset, 234);
        },
        careTurned: () => {
            WheelObserver.reserveResetWith(() => WheelObserver.Turned = true);
        },
        heat: () => {
            clearTimeout(WheelObserver.Timer_coolDown);
            WheelObserver.Hot = true;
            WheelObserver.Timer_coolDown = setTimeout(() => WheelObserver.Hot = false, 234);
        },
        onWheel: (Eve) => {
            //if(WheelObserver.Turned) return WheelObserver.careTurned();
            const WA /* WheelAxis */ = Math.abs(Eve.deltaX) > Math.abs(Eve.deltaY) ? 'X' : 'Y';
            const CW /* CurrentWheel */ = {}, Ws = WheelObserver.Wheels, Wl = Ws.length;
            //if(Wl && Ws[Wl - 1].Axis != WA) WheelObserver.Wheels = [];
            CW.Axis = WA;
            CW.Direction = WA == 'X' ? (Eve.deltaX < 0 ? 'left' : 'right') : (Eve.deltaY < 0 ? 'top' : 'bottom');
            CW.Distance = C.d2d(CW.Direction, 'Allow Orthogonal Direction');
            CW.Delta = Math.abs(Eve['delta' + WA]);
                 if(!Ws[Wl - 1])                        CW.Accel =  1, CW.Wheeled = 'start';
            else if(CW.Axis     != Ws[Wl - 1].Axis    ) return WheelObserver.careTurned(); ////////
            else if(CW.Distance != Ws[Wl - 1].Distance) CW.Accel =  1, CW.Wheeled = (Wl >= 3 &&                           Ws[Wl - 2].Distance != CW.Distance && Ws[Wl - 3].Distance != CW.Distance) ? 'reverse' : '';
            else if(CW.Delta     > Ws[Wl - 1].Delta   ) CW.Accel =  1, CW.Wheeled = (Wl >= 3 && Ws[Wl - 1].Accel == -1 && Ws[Wl - 2].Accel == -1             && Ws[Wl - 3].Accel == -1            ) ? 'serial' : '';
            else if(CW.Delta     < Ws[Wl - 1].Delta   ) CW.Accel = -1, CW.Wheeled = '';
            else                                        CW.Accel = Ws[Wl - 1].Accel, CW.Wheeled = '';
            WheelObserver.reserveResetWith(() => {
                Ws.push(CW); if(Wl > 3) Ws.shift();
                WheelObserver.Progress = (WheelObserver.TotalDelta += Eve['delta' + WA]) / 3 / 100;
            });
            const ToDo = WA != C.A_AXIS_L ? I.orthogonal('wheel') : S.RVM == 'paged' ? 'move' : /*WheelObserver.OverlaidUIs.filter(OUI => OUI.contains(Eve.target)).length ? 'simulate' :*/ '';
            if(!ToDo) return;
            //Eve.preventDefault(); // Must not prevent.
            //Eve.stopPropagation(); // No need to stop.
            if(WheelObserver.Hot) return;
            switch(ToDo) {
                // case 'simulate':  return WheelObserver.scrollNatural(Eve, WA);
                case 'across'  :  return WheelObserver.scrollAcross(Eve, WA);
                case 'move':      return WheelObserver.move(CW);
                case 'utilities': return WheelObserver.toggleUtilities(CW);
                case 'switch':    return WheelObserver.switchAxis(CW);
                                  // clearTimeout(WheelObserver.Timer_switchAxis);
                                  // return WheelObserver.Timer_switchAxis = setTimeout(() => WheelObserver.switchAxis(CW), 99);
            }
        },
        scrollNatural: (Eve, Axis) => { switch(Axis) {
            case 'X': R.Main.scrollLeft += Eve.deltaX; break;
            case 'Y': R.Main.scrollTop  += Eve.deltaY; break;
        } },
        scrollAcross: (Eve, Axis) => { switch(Axis) {
            case 'X': R.Main.scrollTop  += Eve.deltaX; break;
            case 'Y': R.Main.scrollLeft += Eve.deltaY * (S.ARD == 'rtl' ? -1 : 1); break;
        } },
        move: (CW) => { // Only for Paged View ====
            if(!CW.Wheeled) return;
            WheelObserver.heat();
            R.moveBy(CW.Distance, {
                Duration: I.isScrollable() && I.draggable() ? 123 : 0
            });
        },
        toggleUtilities: (CW) => {
            if(!CW.Wheeled) return;
            WheelObserver.heat();
            I.Utilities.toggleGracefuly();
        },
        switchAxis: () => {
            if(!I.AxisSwitcher) return;
            // I.AxisSwitcher.progress(WheelObserver.Progress);
            if(Math.abs(WheelObserver.Progress) < 1) return;
            WheelObserver.heat();
            I.AxisSwitcher.switchAxis();
        }
    };
    document.addEventListener('wheel', Eve => E.dispatch('bibi:is-wheeling', Eve), E.CPO_000);
    E.add('bibi:loaded-item', Item => Item.contentDocument.addEventListener('wheel', Eve => E.dispatch('bibi:is-wheeling', Eve), E.CPO_100));
    E.add('bibi:opened', () => {
        // [I.Menu, I.Slider].forEach(UI => {
        //     if(!UI.ownerDocument) return;
        //     UI.addEventListener('wheel', Eve => { Eve.preventDefault(); Eve.stopPropagation(); }, E.CPO_000);
        //     WheelObserver.OverlaidUIs.push(UI);
        // });
        E.add('bibi:is-wheeling', WheelObserver.onWheel);
        O.HTML.classList.add('wheel-active');
    });
    E.dispatch('bibi:created-wheel-observer');
}};


I.PinchObserver = { create: () => {
    const PinchObserver = I.PinchObserver = {
        Pinching: 0,
        getEventCoords: (Eve) => {
            const T0 = Eve.touches[0], T1 = Eve.touches[1], Doc = Eve.target.ownerDocument;
            const T0CoordInViewport = { X: T0.screenX, Y: T0.screenY };
            const T1CoordInViewport = { X: T1.screenX, Y: T1.screenY };
            return {
                Center: { X: (T0CoordInViewport.X + T1CoordInViewport.X) / 2, Y: (T0CoordInViewport.Y + T1CoordInViewport.Y) / 2 },
                Distance: Math.sqrt(Math.pow(T1.screenX - T0.screenX, 2) + Math.pow(T1.screenY - T0.screenY, 2))
            };
        },
        onTouchStart: (Eve) => {
            if(!L.Opened) return;
            if(Eve.touches.length != 2) return;
            O.HTML.classList.add('pinching');
            PinchObserver.Hot = true;
            Eve.preventDefault(); Eve.stopPropagation();
            PinchObserver.PinchStart = {
                Scale: I.Loupe.CurrentTransformation.Scale,
                Coords: PinchObserver.getEventCoords(Eve)
            };
        },
        onTouchMove: (Eve) => {
            if(Eve.touches.length != 2 || !PinchObserver.PinchStart) return;
            Eve.preventDefault(); Eve.stopPropagation();
            const Ratio = PinchObserver.getEventCoords(Eve).Distance / PinchObserver.PinchStart.Coords.Distance;
            /* // Switch Utilities with Pinch-In/Out
            if(PinchObserver.Pinching++ < 3 && PinchObserver.PinchStart.Scale == 1) switch(I.Utilities.UIState) {
                case 'default': if(Ratio < 1) { PinchObserver.onTouchEnd(); I.Utilities.openGracefuly();  return; } break;
                case  'active': if(Ratio > 1) { PinchObserver.onTouchEnd(); I.Utilities.closeGracefuly(); return; } break;
            } //*/
            clearTimeout(PinchObserver.Timer_TransitionRestore);
            sML.style(R.Main, { transition: 'none' });
            I.Loupe.scale(PinchObserver.PinchStart.Scale * Ratio, { Center: PinchObserver.PinchStart.Coords.Center, Stepless: true });
            PinchObserver.Timer_TransitionRestore = setTimeout(() => sML.style(R.Main, { transition: '' }), 234);
        },
        onTouchEnd: (Eve, Opt) => {
            PinchObserver.Pinching = 0;
            delete PinchObserver.LastScale;
            delete PinchObserver.PinchStart;
            delete PinchObserver.Hot;
            O.HTML.classList.remove('pinching');
        },
        getCNPf: (Doc) => Doc == document ? '' : 'bibi-',
        activateElement: (Ele) => { if(!Ele) return false;
            Ele.addEventListener('touchstart', PinchObserver.onTouchStart, E.CPO_100);
            Ele.addEventListener('touchmove',  PinchObserver.onTouchMove,  E.CPO_100);
            Ele.addEventListener('touchend',   PinchObserver.onTouchEnd,   E.CPO_100);
            Ele.ownerDocument.documentElement.classList.add(PinchObserver.getCNPf(Ele) + 'pinch-active');
        },
        deactivateElement: (Ele) => { if(!Ele) return false;
            Ele.removeEventListener('touchstart', PinchObserver.onTouchStart, E.CPO_100);
            Ele.removeEventListener('touchmove',  PinchObserver.onTouchMove,  E.CPO_100);
            Ele.removeEventListener('touchend',   PinchObserver.onTouchEnd,   E.CPO_100);
            Ele.ownerDocument.documentElement.classList.remove(PinchObserver.getCNPf(Ele) + 'pinch-active');
        }
    };
    PinchObserver.activateElement(R.Main);
    E.add('bibi:loaded-item', Item => PinchObserver.activateElement(Item.HTML));
    E.dispatch('bibi:created-pinch-observer');
}};


I.KeyObserver = { create: () => { if(!S['use-keys']) return;
    const TimeLimit = { D2U: 300, U2D: 300 };
    const KeyObserver = I.KeyObserver = {
        Staccato: 0,
        staccato: function(fn) {
            clearTimeout(this.Timer_Staccato);
            fn(++this.Staccato);
            this.Timer_Staccato = setTimeout(() => this.Staccato = 0, TimeLimit.U2D);
        },
        ActiveKeys: {},
        KeyCodes: { 'keydown': {}, 'keyup': {}, 'keypress': {} },
        updateKeyCodes: (EventTypes, KeyCodesToUpdate) => {
            if(typeof EventTypes.join != 'function')  EventTypes = [EventTypes];
            if(typeof KeyCodesToUpdate == 'function') KeyCodesToUpdate = KeyCodesToUpdate();
            EventTypes.forEach(EventType => KeyObserver.KeyCodes[EventType] = sML.edit(KeyObserver.KeyCodes[EventType], KeyCodesToUpdate));
        },
        KeyParameters: {},
        initializeKeyParameters: () => {
            let _ = { 'End': 'foot', 'Home': 'head' };
            for(const p in _) _[p.toUpperCase()] = _[p] == 'head' ? 'foot' : _[p] == 'foot' ? 'head' : _[p];
            Object.assign(_, { 'Space': 1, 'SPACE': -1 });
            KeyObserver.KeyParameters = _;
        },
        updateKeyParameters: () => {
            const _O = I.orthogonal('arrowkey');
            const _ = (() => { switch(S.ARA) {
                case 'horizontal': return Object.assign({ 'Left Arrow': C.d2d('left'), 'Right Arrow': C.d2d('right' ) }, _O == 'move' ? {   'Up Arrow': C.d2d('top' , 9),  'Down Arrow': C.d2d('bottom', 9) } : {   'Up Arrow': _O,  'Down Arrow': _O });
                case   'vertical': return Object.assign({   'Up Arrow': C.d2d('top' ),  'Down Arrow': C.d2d('bottom') }, _O == 'move' ? { 'Left Arrow': C.d2d('left', 9), 'Right Arrow': C.d2d('right' , 9) } : { 'Left Arrow': _O, 'Right Arrow': _O });
            } })();
            for(const p in _) _[p.toUpperCase()] = _[p] == -1 ? 'head' : _[p] == 1 ? 'foot' : _[p];
            Object.assign(KeyObserver.KeyParameters, _);
        },
        getBibiKeyName: (Eve) => {
            const KeyName = KeyObserver.KeyCodes[Eve.type][Eve.keyCode];
            return KeyName ? KeyName : '';
        },
        onEvent: (Eve) => {
            if(!L.Opened) return false;
            Eve.BibiKeyName = KeyObserver.getBibiKeyName(Eve);
            Eve.BibiModifierKeys = [];
            if(Eve.shiftKey) Eve.BibiModifierKeys.push('Shift');
            if(Eve.ctrlKey)  Eve.BibiModifierKeys.push('Control');
            if(Eve.altKey)   Eve.BibiModifierKeys.push('Alt');
            if(Eve.metaKey)  Eve.BibiModifierKeys.push('Meta');
            //if(!Eve.BibiKeyName) return false;
            if(Eve.BibiKeyName) Eve.preventDefault();
            return true;
        },
        onKeyDown: (Eve) => {
            if(!KeyObserver.onEvent(Eve)) return false;
            if(Eve.BibiKeyName) {
                if(!KeyObserver.ActiveKeys[Eve.BibiKeyName]) {
                    KeyObserver.ActiveKeys[Eve.BibiKeyName] = Date.now();
                } else {
                    KeyObserver.staccato(Sta =>  E.dispatch('bibi:is-holding-key', Object.assign(Eve, { Staccato: Sta })));
                }
            }
            E.dispatch('bibi:downed-key', Eve);
        },
        onKeyUp: (Eve) => {
            if(!KeyObserver.onEvent(Eve)) return false;
            if(KeyObserver.ActiveKeys[Eve.BibiKeyName] && Date.now() - KeyObserver.ActiveKeys[Eve.BibiKeyName] < TimeLimit.D2U) {
                KeyObserver.staccato(Sta =>  E.dispatch('bibi:touched-key', Object.assign(Eve, { Staccato: Sta })));
            }
            if(Eve.BibiKeyName) {
                if(KeyObserver.ActiveKeys[Eve.BibiKeyName]) {
                    delete KeyObserver.ActiveKeys[Eve.BibiKeyName];
                }
            }
            E.dispatch('bibi:upped-key', Eve);
        },
        onKeyPress: (Eve) => {
            if(!KeyObserver.onEvent(Eve)) return false;
            E.dispatch('bibi:pressed-key', Eve);
        },
        observe: (Doc) => {
            ['keydown', 'keyup', 'keypress'].forEach(EventName => Doc.addEventListener(EventName, KeyObserver['onKey' + sML.capitalise(EventName.replace('key', ''))], false));
        },
        onKeyTouch: (Eve) => {
            if(KeyObserver.Hot) return;
            if(!Eve.BibiKeyName) return false;
            const KeyParameter = KeyObserver.KeyParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!KeyParameter) return false;
            //Eve.preventDefault();
            KeyObserver.Hot = true;
            new Promise((resolve, reject) => { switch(typeof KeyParameter) {
                case 'number': if(I.Flipper.isAbleToFlip(KeyParameter)) {
                    if(I.Arrows) E.dispatch(I.Arrows[KeyParameter], 'bibi:singletapped');
                    return I.Flipper.flip(KeyParameter, { Duration: Eve.Staccato > 1 ? 0 : null }).then(resolve);
                } break;
                case 'string': switch(KeyParameter) {
                    case 'head': case 'foot': return R.focusOn(KeyParameter, { Duration: 0 }).then(resolve);
                    case 'utilities': return I.Utilities.toggleGracefuly(), resolve();
                    case 'switch': if(I.AxisSwitcher) return I.AxisSwitcher.switchAxis().then(resolve);
                } break;
            } reject(); }).catch(() => 0).then(() => KeyObserver.Hot = false);
        }
    };
    KeyObserver.updateKeyCodes(['keydown', 'keyup', 'keypress'], {
        32: 'Space'
    });
    KeyObserver.updateKeyCodes(['keydown', 'keyup'], {
        33: 'Page Up',     34: 'Page Down',
        35: 'End',         36: 'Home',
        37: 'Left Arrow',  38: 'Up Arrow',  39: 'Right Arrow',  40: 'Down Arrow'
    });
    E.add('bibi:postprocessed-item', Item => Item.IsPlaceholder ? false : KeyObserver.observe(Item.contentDocument));
    E.add('bibi:opened', () => {
        KeyObserver.initializeKeyParameters(), KeyObserver.updateKeyParameters(), E.add('bibi:changed-view', () => KeyObserver.updateKeyParameters());
        KeyObserver.observe(document);
        E.add(['bibi:touched-key', 'bibi:is-holding-key'], Eve => KeyObserver.onKeyTouch(Eve));
    });
    E.dispatch('bibi:created-key-observer');
}};


I.Tracer = { create: () => {
    const Tracer = I.Tracer = {
        checkSelectionStatus: (BibiEvent) => {
            if(I.RangeFinder.Selecting) return false;
            if(BibiEvent.RangeOfSelection) {
                const PageOfRangeHeadOfSelection = R.getPageOfRangeHead(BibiEvent.RangeOfSelection);
                if(PageOfRangeHeadOfSelection && I.PageObserver.Current.Pages.includes(PageOfRangeHeadOfSelection)) return false;
            }
            return true;
        },
        checkTapAvailability: (BibiEvent) => {
            switch(S.RVM) {
                case 'horizontal': if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; else break;
                case 'vertical':   if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; else break;
            }
            if(BibiEvent.target.ownerDocument) {
                if(O.isPointableContent(BibiEvent.target)) return false;
                if(I.Slider.ownerDocument && (BibiEvent.target == I.Slider || I.Slider.contains(BibiEvent.target))) return false;
            }
            return true;
        },
        checkFlipperAvailability: (BibiEvent) => {
            if(!L.Opened) return false;
            if(I.OpenedSubpanel) return false;
            if(I.Panel && I.Panel.UIState == 'active') return false;
            //if(BibiEvent.Coord.Y < I.Menu.Height/* * 1.5*/) return false;
            const Buf = 3;
                 if(BibiEvent.Coord.X <= Buf || BibiEvent.Coord.Y <= Buf) return false;
            else if(S.ARA == 'horizontal') { if(BibiEvent.Coord.X >= window.innerWidth  - Buf || BibiEvent.Coord.Y >= window.innerHeight - O.Scrollbars.Height - Buf) return false; }
            else if(S.ARA == 'vertical'  ) { if(BibiEvent.Coord.Y >= window.innerHeight - Buf || BibiEvent.Coord.X >= window.innerWidth  - O.Scrollbars.Width  - Buf) return false; }
            if(BibiEvent.target.ownerDocument.documentElement == O.HTML) {
                if(BibiEvent.target == O.HTML || BibiEvent.target == O.Body || BibiEvent.target == I.Menu) return true;
                if(/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(BibiEvent.target.id)) return true;
                if(/^(spread|item|page)( |-|$)/.test(BibiEvent.target.className)) return true;
            } else {
                return O.isPointableContent(BibiEvent.target) ? false : true;
            }
            return false;
        },
        getDirection: (BibiEvent) => { switch(S.ARA) {
            case 'horizontal': return BibiEvent.Division.X != 'center' ? BibiEvent.Division.X : BibiEvent.Division.Y;
            case 'vertical'  : return BibiEvent.Division.Y != 'middle' ? BibiEvent.Division.Y : BibiEvent.Division.X;
        }}
    };
    ['bibi:tapped', 'bibi:singletapped', 'bibi:doubletapped', 'bibi:tripletapped'].forEach(EN => {
        E.add(EN, BibiEvent => {
            if(I.isPointerStealth()) return false;
            if(EN != 'bibi:tapped' && I.OpenedSubpanel) return I.OpenedSubpanel.close() && false;
            if(!L.Opened) return false;
            if(!Tracer.checkTapAvailability(BibiEvent)) return false;
            E.dispatch(EN + '-book', BibiEvent); // 'bibi:tapped-book', 'bibi:singletapped-book', 'bibi:doubletapped-book', 'bibi:tripletapped-book'
        })
    });
    { // Both (O.TouchOS || !O.TouchOS)
        E.add('bibi:opened', () => {
            E.add('bibi:singletapped-book', BibiEvent => {
                if(I.isPointerStealth()) return;
                if(!Tracer.checkSelectionStatus(BibiEvent)) return;
                if(BibiEvent.Division.X == 'center' && BibiEvent.Division.Y == 'middle') return I.Utilities.toggleGracefuly();
                if(Tracer.checkFlipperAvailability(BibiEvent)) {
                    const Dir = Tracer.getDirection(BibiEvent), Ortho = I.orthogonal('edgetap'), Dist = C.d2d(Dir, Ortho == 'move');
                    if(Dist) {
                        if(I.Flipper.isAbleToFlip(Dist)) {
                            I.Flipper.flip(Dist, { Duration: BibiEvent.Staccato > 1 ? 0 : null });
                            if(I.Arrows) E.dispatch(I.Arrows[Dist], 'bibi:singletapped');
                        }
                    } else {
                        if(typeof C.DDD[Dir] == 'string') switch(Ortho) {
                            case 'utilities': I.Utilities.toggleGracefuly(); break;
                            case 'switch': if(I.AxisSwitcher) I.AxisSwitcher.switchAxis(); break;
                        }
                    }
                }
            });
        });
    }
    if(!O.TouchOS) {
        E.add('bibi:opened', () => {
            E.add('bibi:moved-pointer', BibiEvent => {
                if(I.isPointerStealth()) return;
                if(Tracer.checkSelectionStatus(BibiEvent) && Tracer.checkFlipperAvailability(BibiEvent)) {
                    const Dir = Tracer.getDirection(BibiEvent), Ortho = I.orthogonal('edgetap'), Dist = C.d2d(Dir, Ortho == 'move');
                    if(Dist) {
                        if(I.Flipper.isAbleToFlip(Dist)) {
                            Tracer.Hovering = true;
                            if(I.Arrows) {
                                let Arrow = I.Arrows[Dist]; if(S['indicate-orthogonal-arrows-if-necessary'] && (
                                    (/^(left|right)$/.test(Dir) && S.ARA == 'vertical') ||
                                    (/^(top|bottom)$/.test(Dir) && S.ARA == 'horizontal')
                                )) Arrow = Arrow.Alt;
                                E.dispatch([Arrow.Pair, Arrow.Alt, Arrow.Alt.Pair], 'bibi:unhovered', BibiEvent);
                                E.dispatch(Arrow,                                   'bibi:hovered',   BibiEvent);
                            }
                            const HoveringHTML = BibiEvent.target.ownerDocument.documentElement;
                            if(Tracer.HoveringHTML != HoveringHTML) {
                                if(Tracer.HoveringHTML) Tracer.HoveringHTML.removeAttribute('data-bibi-cursor');
                                (Tracer.HoveringHTML = HoveringHTML).setAttribute('data-bibi-cursor', Dir);
                            }
                            return;
                        }
                    }
                }
                if(Tracer.Hovering) {
                    Tracer.Hovering = false;
                    if(I.Arrows) E.dispatch(I.Arrows.All, 'bibi:unhovered', BibiEvent);
                    if(Tracer.HoveringHTML) Tracer.HoveringHTML.removeAttribute('data-bibi-cursor'), Tracer.HoveringHTML = null;
                }
            });
            sML.forEach(O.Body.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault));
        });
        E.add('bibi:loaded-item', Item => {/*
            sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="left"]',   'cursor: w-resize;');
            sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="right"]',  'cursor: e-resize;');
            sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="top"]',    'cursor: n-resize;');
            sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="bottom"]', 'cursor: s-resize;');*/
            sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor]', 'cursor: pointer;');
            sML.forEach(Item.Body.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault))
        });
    }
    const Seconds = [0,1,2,3,4,5,6,7,8,9];
    E.add('bibi:opened', () => {
        Seconds.forEach(Sec => setTimeout(() => O.HTML.setAttribute('data-intro-within', Seconds.slice(Sec + 1, Seconds.length).reverse().join(' ')), Sec * 1000));
        (Tracer.gaze = () => Seconds.forEach(Sec => {
            const TimerName = 'Timer_gaze_' + Sec;
            clearTimeout(Tracer[TimerName]);
            Tracer[TimerName] = setTimeout(() => O.HTML.setAttribute('data-keeping-calm', Seconds.slice(1, Sec + 1).join(' ')), Sec * 1000);
        }))();
        E.add(['bibi:moved-pointer', 'bibi:downed-pointer', 'bibi:touched-key'], Tracer.gaze);
    });
    E.dispatch('bibi:created-tracer');
}};


I.Flipper = { create: () => {
    const Flipper = I.Flipper = {
        PreviousDistance: 0,
        Back: { Distance: -1 }, Forward: { Distance: 1 },
        isAbleToFlip: (Distance) => {
            if(L.Opened && !I.OpenedSubpanel && typeof (Distance * 1) == 'number' && Distance) {
                if(!I.PageObserver.Current.List.length) I.PageObserver.updateCurrent();
                if(I.PageObserver.Current.List.length) {
                    let CurrentEdge, BookEdgePage, Edged;
                    if(Distance < 0) CurrentEdge = I.PageObserver.Current.List[          0], BookEdgePage = R.Pages[          0], Edged = 'Headed';
                    else             CurrentEdge = I.PageObserver.Current.List.slice(-1)[0], BookEdgePage = R.Pages.slice(-1)[0], Edged = 'Footed';
                    if(CurrentEdge.Page != BookEdgePage) return true;
                    if(!CurrentEdge.PageIntersectionStatus.Contained && !CurrentEdge.PageIntersectionStatus[Edged]) return true;
                }
            }
            return false;
        },
        flip: (Distance, Opt = {}) => {
            if(typeof (Distance *= 1) != 'number' || !isFinite(Distance) || Distance === 0) return Promise.resolve();
            I.ScrollObserver.forceStopScrolling();
            const SumUpHistory = !S['manualize-adding-histories'] ? (I.History.List.slice(-1)[0].UI == Flipper) && ((Distance < 0 ? -1 : 1) === (Flipper.PreviousDistance < 0 ? -1 : 1)) : false;
            Flipper.PreviousDistance = Distance;
            if(B.PrePaginated) { // Preventing flicker.
                const CIs = [
                    I.PageObserver.Current.List[          0].Page.Index,
                    I.PageObserver.Current.List.slice(-1)[0].Page.Index
                ], TI = CIs[Distance < 0 ? 0 : 1] + Distance;
                CIs.forEach(CI => { try { R.Pages[CI].Spread.Box.classList.remove('current'); } catch(Err) {} });
                                    try { R.Pages[TI].Spread.Box.classList.add(   'current'); } catch(Err) {}
            }
            return R.moveBy(Distance, { Duration: Opt.Duration }).then(Destination => {
                if(!S['manualize-adding-histories']) I.History.add({ UI: Flipper, SumUp: SumUpHistory, Destination: Destination });
                return Destination;
            });
        }
    };
    Flipper[-1] = Flipper.Back, Flipper[1] = Flipper.Forward;
}};


I.Notifier = { create: () => {
    const  Notifier = I.Notifier = sML.create('div', { id: 'bibi-notifier' });
    const     Panel = Notifier.appendChild(document.createElement('div'));
    const Paragraph = Panel.appendChild(document.createElement('p'));
    Object.assign(Notifier, {
        show: (Msg, Opt = {}) => {
            clearTimeout(Notifier.Timer_hide);
            const ClassNames = [];
            if(Opt.Type == 'Error') ClassNames.push('error');
            if(typeof Opt.className == 'string' && (Opt.className = Opt.className.trim())) ClassNames.push(Opt.className);
            ClassNames.length ? (Paragraph.className = ClassNames.join(' ')) : Paragraph.removeAttribute('class');
            (typeof Opt.id == 'string' && (Opt.id = Opt.id.trim())) ? (Paragraph.id = Opt.id) : Paragraph.removeAttribute('id');
            Paragraph.innerHTML = Msg;
            O.HTML.classList.add('notifier-shown');
            if(L.Opened && Opt.Type != 'Error') Notifier.addEventListener(O.TouchOS || Opt.Hoverable ? E['pointerdown'] : E['pointerover'], Notifier.hide);
        },
        hide: (Opt = {}) => {
            clearTimeout(Notifier.Timer_hide);
            Notifier.Timer_hide = setTimeout(() => {
                if(L.Opened) Notifier.removeEventListener(O.TouchOS || Opt.Hoverable ? E['pointerdown'] : E['pointerover'], Notifier.hide);
                O.HTML.classList.remove('notifier-shown');
            }, typeof Opt.Time == 'number' ? Opt.Time : 0);
        },
        notify: (Msg, Opt = {}) => {
            if(!Msg) return Notifier.hide();
            Notifier.show(Msg, Opt);
            if(typeof Opt.Time == 'undefined') Opt.Time = Opt.Type == 'Error' ? undefined : O.Busy && !L.Opened ? 8888 : 2222;
            if(typeof Opt.Time == 'number') Notifier.hide(Opt);
        }
    });
    I.notify = (...Args) => Notifier.notify(...Args);
    O.Body.appendChild(Notifier);
    E.dispatch('bibi:created-notifier');
}};

    I.notify = () => false;


I.Veil = { create: () => {
    const Veil = I.Veil = I.setToggleAction(O.Body.appendChild(sML.create('div', { id: 'bibi-veil' })), {
        // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
        onopened: () => (O.HTML.classList.add('veil-opened'), Veil.classList.remove('closed')),
        onclosed: () => (Veil.classList.add('closed'), O.HTML.classList.remove('veil-opened'))
    });
    ['touchstart', 'pointerdown', 'mousedown', 'click'].forEach(EN => Veil.addEventListener(EN, Eve => Eve.stopPropagation(), E.CPO_000));
    Veil.open();
    const PlayButtonTitle = (O.TouchOS ? 'Tap' : 'Click') + ' to Open';
    const PlayButton = Veil.PlayButton = Veil.appendChild(
        sML.create('p', { id: 'bibi-veil-play', title: PlayButtonTitle,
            innerHTML: `<span class="non-visual">${ PlayButtonTitle }</span>`,
            play: (Eve) => (Eve.stopPropagation(), L.play(), E.dispatch('bibi:played:by-button')),
            hide: (   ) => sML.style(PlayButton, { opacity: 0, cursor: 'default' }).then(Eve => Veil.removeChild(PlayButton)),
            on: { click: Eve => PlayButton.play(Eve) }
        })
    );
    E.add('bibi:played', () => PlayButton.hide());
    Veil.byebye = (Msg = {}) => {
        Veil.innerHTML = '';
        Veil.ByeBye = Veil.appendChild(sML.create('p', { id: 'bibi-veil-byebye' }));
        ['en', 'ja'].forEach(Lang => Veil.ByeBye.innerHTML += `<span lang="${ Lang }">${ Msg[Lang] }</span>`);
        O.HTML.classList.remove('welcome');
        Veil.open();
    };
    Veil.Cover      = Veil.appendChild(      sML.create('div', { id: 'bibi-veil-cover'      }));
    Veil.Cover.Info = Veil.Cover.appendChild(sML.create('p',   { id: 'bibi-veil-cover-info' }));
    E.dispatch('bibi:created-veil');
}};


I.Catcher = { create: () => { if(S['book-data'] || S['book'] || !S['accept-local-file']) return;
    const Catcher = I.Catcher = O.Body.appendChild(sML.create('div', { id: 'bibi-catcher' }));
    Catcher.insertAdjacentHTML('afterbegin', I.distillLabels.distillLanguage({
        default: [
            `<div class="pgroup" lang="en">`,
                `<p><strong>Pass Me Your EPUB File!</strong></p>`,
                `<p><em>You Can Open Your Own EPUB.</em></p>`,
                `<p><span>Please ${ O.TouchOS ? 'Tap Screen' : 'Drag & Drop It Here. <br />Or Click Screen' } and Choose It.</span></p>`,
                `<p><small>(Open in Your Device without Uploading)</small></p>`,
            `</div>`
        ].join(''),
        ja: [
            `<div class="pgroup" lang="ja">`,
                `<p><strong>EPUBファイルをここにください！</strong></p>`,
                `<p><em>お持ちの EPUB ファイルを<br />開くことができます。</em></p>`,
                `<p><span>${ O.TouchOS ? '画面をタップ' : 'ここにドラッグ＆ドロップするか、<br />画面をクリック' }して選択してください。</span></p>`,
                `<p><small>（外部に送信されず、この端末の中で開きます）</small></p>`,
            `</div>`
        ].join('')
    })[O.Language]);
    Catcher.title = Catcher.querySelector('span').innerHTML.replace(/<br( ?\/)?>/g, '\n').replace(/<[^>]+>/g, '').trim();
    Catcher.Input = Catcher.appendChild(sML.create('input', { type: 'file' }));
    if(!S['extract-if-necessary'].includes('*') && S['extract-if-necessary'].length) {
        const Accept = [];
        if(S['extract-if-necessary'].includes('.epub')) {
            Accept.push('application/epub+zip');
        }
        if(S['extract-if-necessary'].includes('.zip')) {
            Accept.push('application/zip');
            Accept.push('application/x-zip');
            Accept.push('application/x-zip-compressed');
        }
        if(Accept.length) Catcher.Input.setAttribute('accept', Accept.join(','));
    }
    Catcher.Input.addEventListener('change', Eve => {
        let FileData = {};  try { FileData = Eve.target.files[0]; } catch(_) {}
        Bibi.getBookData.resolve({ BookData: FileData });
    });
    Catcher.addEventListener('click', Eve => Catcher.Input.click(Eve));
    if(!O.TouchOS) {
        Catcher.addEventListener('dragenter', Eve => { Eve.preventDefault(); O.HTML.classList.add(   'dragenter'); }, 1);
        Catcher.addEventListener('dragover',  Eve => { Eve.preventDefault();                                       }, 1);
        Catcher.addEventListener('dragleave', Eve => { Eve.preventDefault(); O.HTML.classList.remove('dragenter'); }, 1);
        Catcher.addEventListener('drop',      Eve => { Eve.preventDefault();
            let FileData = {};  try { FileData = Eve.dataTransfer.files[0]; } catch(_) {}
            Bibi.getBookData.resolve({ BookData: FileData });
        }, 1);
    }
    Catcher.appendChild(I.getBookIcon());
    E.dispatch('bibi:created-catcher');
}};


I.Menu = { create: () => {
    if(!S['use-menubar']) O.HTML.classList.add('without-menubar');
    const Menu = I.Menu = O.Body.appendChild(sML.create('div', { id: 'bibi-menu' }, I.Menu)); delete Menu.create;
    //Menu.addEventListener('click', Eve => Eve.stopPropagation());
    I.TouchObserver.setElementHoverActions(Menu);
    I.setToggleAction(Menu, {
        onopened: () => { O.HTML.classList.add(   'menu-opened'); E.dispatch('bibi:opened-menu'); },
        onclosed: () => { O.HTML.classList.remove('menu-opened'); E.dispatch('bibi:closed-menu'); }
    });
    E.add('bibi:commands:open-menu',   Menu.open);
    E.add('bibi:commands:close-menu',  Menu.close);
    E.add('bibi:commands:toggle-menu', Menu.toggle);
    E.add('bibi:opens-utilities',   Opt => E.dispatch('bibi:commands:open-menu',   Opt));
    E.add('bibi:closes-utilities',  Opt => E.dispatch('bibi:commands:close-menu',  Opt));
    E.add('bibi:opened', Menu.close);/*
    E.add('bibi:changes-intersection', () => {
        clearTimeout(Menu.Timer_cool);
        if(!Menu.Hot) Menu.classList.add('hot');
        Menu.Hot = true;
        Menu.Timer_cool = setTimeout(() => {
            Menu.Hot = false;
            Menu.classList.remove('hot');
        }, 1234);
    });*//*
    if(sML.OS.iOS) {
        Menu.addEventListener('pointerdown', console.log);
        Menu.addEventListener('pointerover', console.log);
    }*/
    if(!O.TouchOS) E.add('bibi:opened', () => {
        E.add('bibi:moved-pointer', BibiEvent => {
            if(I.isPointerStealth()) return false;
            clearTimeout(Menu.Timer_close);
            if(BibiEvent.Coord.Y <= Menu.Height && !O.isPointableContent(BibiEvent.target)) { // if(BibiEvent.Division.Y == 'top' && !O.isPointableContent(BibiEvent.target)) {
                E.dispatch(Menu, 'bibi:hovered', BibiEvent);
            } else if(Menu.Hover) {
                Menu.Timer_close = setTimeout(() => E.dispatch(Menu, 'bibi:unhovered', BibiEvent), 123);
            }
        });
    });
    Menu.L = Menu.appendChild(sML.create('div', { id: 'bibi-menu-l' }));
    Menu.R = Menu.appendChild(sML.create('div', { id: 'bibi-menu-r' }));
    [Menu.L, Menu.R].forEach(MenuSide => {
        MenuSide.ButtonGroups = [];
        MenuSide.addButtonGroup = function(Par) {
            const ButtonGroup = I.createButtonGroup(Par);
            if(!ButtonGroup) return null;
            this.ButtonGroups.push(ButtonGroup);
            return this.appendChild(ButtonGroup);
        };
    });
    { // Optimize to Scrollbar Size
        const _Common = 'html.appearance-vertical:not(.veil-opened):not(.slider-opened)', _M = ' div#bibi-menu';
        sML.appendCSSRule(_Common + _M, 'width: calc(100% - ' + O.Scrollbars.Width + 'px);');
        sML.appendCSSRule([_Common + '.panel-opened' + _M, _Common + '.subpanel-opened' + _M].join(', '), 'padding-right: ' + O.Scrollbars.Width + 'px;');
    }
    I.OpenedSubpanel = null;
    I.Subpanels = [];
    Menu.Config.create();
    E.dispatch('bibi:created-menu');
}};

    I.Menu.Config = { create: () => {
        const Menu = I.Menu;
        const Components = [];
        if(!S['fix-reader-view-mode'] && S['available-reader-view-modes'].length > 1)                      Components.push('ViewModeSection');
        if(O.Embedded)                                                                                     Components.push('WindowSection'), Components.push('WindowSection_NewWindowButton');
        if(O.FullscreenTarget && !O.TouchOS)                                                               Components.push('WindowSection'), Components.push('WindowSection_FullscreenButton');
        if(S['website-href'] && /^https?:\/\/[^\/]+/.test(S['website-href']) && S['website-name-in-menu']) Components.push('LinkageSection'), Components.push('LinkageSection_WebsiteLink');
        if(!S['remove-bibi-website-link'])                                                                 Components.push('LinkageSection'), Components.push('LinkageSection_BibiWebsiteLink');
        if(!Components.length) {
            delete I.Menu.Config;
            return;
        }
        const Config = Menu.Config = sML.applyRtL(I.createSubpanel({ id: 'bibi-subpanel_config' }), Menu.Config); delete Config.create;
        const Opener = Config.bindOpener(Menu.R.addButtonGroup(/* { Lively: true } */).addButton({
            Type: 'toggle',
            Labels: {
                default: { default: `Configure Setting`,            ja: `設定を変更` },
                active:  { default: `Close Setting-Menu`, ja: `設定メニューを閉じる` }
            },
            Help: true,
            Icon: `<span class="bibi-icon bibi-icon-config"></span>`
        }));
        if(Components.includes('ViewModeSection')) Config.ViewModeSection.create(          ); else delete Config.ViewModeSection;
        if(Components.includes('WindowSection'))     Config.WindowSection.create(Components); else delete Config.WindowSection;
        if(Components.includes('LinkageSection'))   Config.LinkageSection.create(Components); else delete Config.LinkageSection;
        E.dispatch('bibi:created-config');
    }};

        I.Menu.Config.ViewModeSection = { create: () => {
            const Config = I.Menu.Config;
            const /* SpreadShapes */ SSs = (/* SpreadShape */ SS => SS + SS + SS)((/* ItemShape */ IS => `<span class="bibi-shape bibi-shape-spread">${ IS + IS }</span>`)(`<span class="bibi-shape bibi-shape-item"></span>`));
            const Section = Config.ViewModeSection = Config.addSection({
                Labels: { default: { default: `View Mode`, ja: `閲覧モード` } },
                ButtonGroups: [{
                    ButtonType: 'radio',
                    Buttons: [{
                        Mode: 'paged',
                        Labels: { default: { default: `Spread / Page`, ja: `見開き／ページ` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">${ SSs }</span></span>`
                    }, {
                        Mode: 'horizontal',
                        Labels: { default: { default: `<span class="non-visual-in-label">⇄ </span>Horizontal Scroll`, ja: `<span class="non-visual-in-label">⇄ </span>横スクロール` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">${ SSs }</span></span>`
                    }, {
                        Mode: 'vertical',
                        Labels: { default: { default: `<span class="non-visual-in-label">⇅ </span>Vertical Scroll`, ja: `<span class="non-visual-in-label">⇅ </span>縦スクロール` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">${ SSs }</span></span>`
                    }].filter(Button => S['available-reader-view-modes'].includes(Button.Mode)).map(Button => sML.edit(Button, {
                        Notification: true,
                        action: () => R.changeView({ Mode: Button.Mode, NoNotification: true })
                    }))
                }].concat(S['available-reader-view-modes'].includes('horizontal') || S['available-reader-view-modes'].includes('vertical') ? {
                    Buttons: [{
                        Name: 'full-breadth-layout-in-scroll',
                        Type: 'toggle',
                        Notification: false,
                        Labels: { default: { default: `Full Width for Each Page <small>(in Scrolling Mode)</small>`, ja: `スクロール表示で各ページを幅一杯に</small>` } },
                        Icon: `<span class="bibi-icon bibi-icon-full-breadth-layout"></span>`,
                        action: function() { R.changeView({ FullBreadthLayoutInScroll: (this.UIState == 'active'), NoNotification: true }); }
                    }]
                } : [])
            });
            E.add('bibi:updated-settings', () => {
                Section.ButtonGroups[0].Buttons.forEach(Button => I.setUIState(Button, (Button.Mode == S.RVM ? 'active' : 'default')));
                if(Section.ButtonGroups[1]) {
                    if(B.PrePaginated) I.setUIState(Section.ButtonGroups[1].Buttons[0], S['full-breadth-layout-in-scroll'] ? 'active' : 'default');
                    else Section.ButtonGroups[1].style.display = 'none';
                }
            });
        }};

        I.Menu.Config.WindowSection = { create: (Components) => {
            const Config = I.Menu.Config;
            const Buttons = [];
            if(Components.includes('WindowSection_NewWindowButton')) {
                Buttons.push({
                    Type: 'link',
                    Labels: {
                        default: { default: `Open in New Window`, ja: `あたらしいウィンドウで開く` }
                    },
                    Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
                    id: 'bibi-button-open-newwindow',
                    href: O.RequestedURL,
                    target: '_blank'
                });
            }
            if(Components.includes('WindowSection_FullscreenButton')) {
                Buttons.push({
                    Type: 'toggle',
                    Labels: {
                        default: { default: `<span class="non-visual">Enter </span>Fullscreen`, ja: `フルスクリーンモード<span class="non-visual">で表示</span>` },
                        active:  { default: `<span class="non-visual">Exit </span>Fullscreen`, ja: `フルスクリーンモード<span class="non-visual">を解除</span>` }
                    },
                    Icon: `<span class="bibi-icon bibi-icon-toggle-fullscreen"></span>`,
                    id: 'bibi-button-toggle-fullscreen',
                    action: function() {
                        !O.Fullscreen ? O.FullscreenTarget.requestFullscreen() : O.FullscreenTarget.ownerDocument.exitFullscreen();
                        Config.close();
                    }
                });
                O.FullscreenTarget.ownerDocument.addEventListener('fullscreenchange', function() { // care multi-embeddeding
                    if(!O.FullscreenButton) O.FullscreenButton = document.getElementById('bibi-button-toggle-fullscreen');
                    if(this.fullscreenElement == O.FullscreenTarget) {
                        O.Fullscreen = true;
                        O.HTML.classList.add('fullscreen');
                        I.setUIState(O.FullscreenButton, 'active');
                    } else if(O.Fullscreen) {
                        O.Fullscreen = false;
                        O.HTML.classList.remove('fullscreen');
                        I.setUIState(O.FullscreenButton, 'default');
                    }
                });
            }
            if(Buttons.length) {
                const Section = Config.WindowSection = Config.addSection({ Labels: { default: { default: `Window Control`, ja: `ウィンドウ制御` } } });
                Section.addButtonGroup({ Buttons: Buttons });
            }
        }};

        I.Menu.Config.LinkageSection = { create: (Components) => {
            const Config = I.Menu.Config;
            const Buttons = [];
            if(Components.includes('LinkageSection_WebsiteLink')) Buttons.push({
                Type: 'link',
                Labels: { default: { default: S['website-name-in-menu'].replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') } },
                Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
                href: S['website-href'],
                target: '_blank'
            });
            if(Components.includes('LinkageSection_BibiWebsiteLink')) Buttons.push({
                Type: 'link',
                Labels: { default: { default: `Bibi | Official Website` } },
                Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
                href: Bibi['href'],
                target: '_blank'
            });
            if(Buttons.length) {
                const Section = Config.LinkageSection = Config.addSection({ Labels: { default: { default: `Link${ Buttons.length > 1 ? 's' : '' }`, ja: `リンク` } } });
                Section.addButtonGroup({ Buttons: Buttons });
            }
        }};


I.Panel = { create: () => {
    const Panel = I.Panel = O.Body.appendChild(sML.create('div', { id: 'bibi-panel' }));
    I.setToggleAction(Panel, {
        onopened: () => { O.HTML.classList.add(   'panel-opened'); E.dispatch('bibi:opened-panel'); },
        onclosed: () => { O.HTML.classList.remove('panel-opened'); E.dispatch('bibi:closed-panel'); }
    });
    E.add('bibi:commands:open-panel',   Panel.open);
    E.add('bibi:commands:close-panel',  Panel.close);
    E.add('bibi:commands:toggle-panel', Panel.toggle);
    E.add('bibi:closes-utilities',      Panel.close);
    I.setFeedback(Panel, { StopPropagation: true });
    E.add(Panel, 'bibi:singletapped', () => E.dispatch('bibi:commands:toggle-panel'));
    Panel.BookInfo            = Panel.appendChild(               sML.create('div', { id: 'bibi-panel-bookinfo'            }));
    Panel.BookInfo.Cover      = Panel.BookInfo.appendChild(      sML.create('div', { id: 'bibi-panel-bookinfo-cover'      }));
    Panel.BookInfo.Cover.Info = Panel.BookInfo.Cover.appendChild(sML.create('p',   { id: 'bibi-panel-bookinfo-cover-info' }));
    const Opener = Panel.Opener = I.Menu.L.addButtonGroup(/* { Lively: true } */).addButton({
        Type: 'toggle',
        Labels: {
            default: { default: `Open Index`,  ja: `目次を開く`   },
            active:  { default: `Close Index`, ja: `目次を閉じる` }
        },
        Help: true,
        Icon: `<span class="bibi-icon bibi-icon-toggle-panel">${ (Bars => { for(let i = 1; i <= 6; i++) Bars += '<span></span>'; return Bars; })('') }</span>`,
        action: () => Panel.toggle()
    });
    E.add('bibi:opened-panel', () => I.setUIState(Opener, 'active'            ));
    E.add('bibi:closed-panel', () => I.setUIState(Opener, ''                  ));
    if(S['on-doubletap'            ] == 'panel') E.add('bibi:doubletapped',             () => Panel.toggle());
    if(S['on-tripletap'            ] == 'panel') E.add('bibi:tripletapped',             () => Panel.toggle());
    if(S['on-singletap-with-altkey'] == 'panel') E.add('bibi:singletapped-with-altkey', () => Panel.toggle());
    if(S['on-doubletap-with-altkey'] == 'panel') E.add('bibi:doubletapped-with-altkey', () => Panel.toggle());
    if(S['on-tripletap-with-altkey'] == 'panel') E.add('bibi:tripletapped-with-altkey', () => Panel.toggle());
    //sML.appendCSSRule('div#bibi-panel-bookinfo', 'height: calc(100% - ' + (O.Scrollbars.Height) + 'px);'); // Optimize to Scrollbar Size
    E.dispatch('bibi:created-panel');
}};


I.Help = { create: () => {
    const Help = I.Help = O.Body.appendChild(sML.create('div', { id: 'bibi-help' }));
    Help.Message = Help.appendChild(sML.create('p', { className: 'hidden', id: 'bibi-help-message' }));
    Help.show = (HelpText) => {
        clearTimeout(Help.Timer_deactivate1);
        clearTimeout(Help.Timer_deactivate2);
        Help.classList.add('active');
        Help.Message.innerHTML = HelpText;
        setTimeout(() => Help.classList.add('shown'), 0);
    };
    Help.hide = () => {
        Help.Timer_deactivate1 = setTimeout(() => {
            Help.classList.remove('shown');
            Help.Timer_deactivate2 = setTimeout(() => Help.classList.remove('active'), 200);
        }, 100);
    };
    /*
    sML.appendCSSRule([ // Optimize to Scrollbar Size
        'html.appearance-horizontal div#bibi-help',
        'html.page-rtl.panel-opened div#bibi-help'
    ].join(', '), 'bottom: ' + (O.Scrollbars.Height) + 'px;');
    */
}};


I.PoweredBy = { create: () => {
    const PoweredBy = I.PoweredBy = O.Body.appendChild(sML.create('div', { id: 'bibi-poweredby', innerHTML: `<p><a href="${ Bibi['href'] }" target="_blank" title="Bibi | Official Website">Bibi</a></p>` }));
    /*
    sML.appendCSSRule([ // Optimize to Scrollbar Size
        'html.appearance-horizontal div#bibi-poweredby',
        'html.page-rtl.panel-opened div#bibi-poweredby'
    ].join(', '), 'bottom: ' + (O.Scrollbars.Height) + 'px;');
    */
}};


I.TextSetter = { create: () => { if(!S['use-textsetter']) return;
    // =========================================================================================================================
    const TextSetter = I.TextSetter = {
        distillSettings: (Settings, Opt) => { if(!Settings || typeof Settings != 'object') return null;
            const DistilledSettings = {};
            return Object.keys(Settings).filter(SetterName => {
                const Setter = TextSetter.X[SetterName]; if(!Setter) return false;
                const Setting = Setter.distillSetting(Settings[SetterName], Opt); if(!Setting) return false;
                DistilledSettings[SetterName] = Setting; return true;
            }).length ? DistilledSettings : null;
        },
        ElementsToBeIgnored: 'script,style,br,img,iframe,source,audio,video,picture,svg,math,ruby,rb,rp,rt,rtc',
        getItemElements: (Item) => Item.TextSettings.Elements = Item.TextSettings.Elements || Item.contentDocument.querySelectorAll(`html, body, body *:not(${ TextSetter.ElementsToBeIgnored })`),
        postprocessItem: (Item) => { if(Item.PrePaginated || Item.Source.External) return;
            Item.TextSettings = { HTMLOriginalFontSize: getComputedStyle(Item.HTML).fontSize.replace(/[^\d]*$/, '') * 1 };
            const SettersToPostprocess = {
                ItemBefore: TextSetter.X.filter(Setter => !!Setter.postprocessItemBefore),
                CSSRule:    TextSetter.X.filter(Setter => !!Setter.postprocessCSSRule),
                Element:    TextSetter.X.filter(Setter => !!Setter.postprocessElement),
                ItemAfter:  TextSetter.X.filter(Setter => !!Setter.postprocessItemAfter)
            };
            SettersToPostprocess.ItemBefore.forEach(Setter => Setter.postprocessItemBefore(Item));
            if(SettersToPostprocess.CSSRule.length) O.forEachCSSRuleOf(Item.contentDocument,  CSSRule => CSSRule.style && SettersToPostprocess.CSSRule.forEach(Setter => Setter.postprocessCSSRule(CSSRule, Item)));
            if(SettersToPostprocess.Element.length) sML.forEach(TextSetter.getItemElements(Item))(Ele =>     Ele.style && SettersToPostprocess.Element.forEach(Setter => Setter.postprocessElement(Ele, getComputedStyle(Ele), Item)));
            SettersToPostprocess.ItemAfter.forEach(Setter => Setter.postprocessItemAfter(Item));
            delete Item.TextSettings.Elements; ////
        },
        // readyItem: (Item) => { if(Item.PrePaginated || Item.Source.External) return;
        //     const SettersToReady = {
        //         ItemBefore: TextSetter.X.filter(Setter => !!Setter.readyItemBefore),
        //         CSSRule :   TextSetter.X.filter(Setter => !!Setter.readyCSSRule),
        //         Element :   TextSetter.X.filter(Setter => !!Setter.readyElement),
        //         ItemAfter:  TextSetter.X.filter(Setter => !!Setter.readyItemAfter)
        //     };
        //     SettersToReady.ItemBefore.forEach(Setter => Setter.readyItemBefore(Item));
        //     if(SettersToReady.CSSRule.length) O.forEachCSSRuleOf(Item.contentDocument,  CSSRule => CSSRule.style && SettersToReady.CSSRule.forEach(Setter => Setter.readyCSSRule(CSSRule, Item)));
        //     if(SettersToReady.Element.length) sML.forEach(TextSetter.getItemElements(Item))(Ele =>     Ele.style && SettersToReady.Element.forEach(Setter => Setter.readyElement(Ele, getComputedStyle(Ele), Item)));
        //     SettersToReady.ItemAfter.forEach(Setter => Setter.readyItemAfter(Item));
        //     delete Item.TextSettings.Elements;
        // },
        change: (Settings, ActionsBeforeAfter) => new Promise(resolve => { if(B.PrePaginated) return resolve();
            Settings = TextSetter.distillSettings(Settings, { Changeable: true });
            if(!Settings) return resolve();
            if(TextSetter.Changing) return resolve();
            TextSetter.Changing = 'Changing';
            const SetterNames = Object.keys(Settings);
            SetterNames.forEach(SetterName => E.dispatch('bibi:changes-' + SetterName.toLowerCase(), Settings[SetterName]));
            // ^-- E.dispatch('bibi:changes-fontsize', Settings.FontSize), E.dispatch('bibi:changes-linespacing', Settings.LineSpacing), E.dispatch('bibi:changes-flowdirection', Settings.FlowDirection)
            if(TextSetter.Subpanel) TextSetter.Subpanel.busy(true);
            if(typeof ActionsBeforeAfter?.before == 'function') ActionsBeforeAfter.before();
            setTimeout(() => R.layOutBook({
                before: () => TextSetter.rebind(Settings, { SettingsAreDistilled: true, Async: true }),
                Reset: true,
                ResetOnlyContent: !Settings.FlowDirection,
                DoNotCloseUtilities: true,
                NoNotification: true,
                Delay: 33
            }).then(() => {
                SetterNames.forEach(SetterName => E.dispatch('bibi:changed-' + SetterName.toLowerCase(), Settings[SetterName]));
                // ^-- E.dispatch('bibi:changed-fontsize', Settings.FontSize), E.dispatch('bibi:changed-linespacing', Settings.LineSpacing), E.dispatch('bibi:changed-flowdirection', Settings.FlowDirection)
                if(typeof ActionsBeforeAfter?.after == 'function') ActionsBeforeAfter.after();
                if(TextSetter.Subpanel) TextSetter.Subpanel.busy(false);
                delete TextSetter.Changing;
                resolve(Settings);
            }), 88);
        }),
        rebind: (Settings, Opt) => {
            if(B.PrePaginated) return Promise.resolve();
            if(!Opt?.SettingsAreDistilled) Settings = TextSetter.distillSettings(Settings, { Changeable: true });
            if(!Settings) return Promise.resolve();
            const Setters = Object.keys(Settings).map(SetterName => TextSetter.X[SetterName]);
            Setters.forEach(Setter => { const Setting = Settings[Setter.Name];
                if(Setter.changeAtFirst) Setter.changeAtFirst(Setting);
                if(Setter.UI?.care) Setter.UI.care(Setting);
                if(S['keep-settings']) I.Oven.Biscuits.memorize('Book', { [Setter.Name]: Setting });
                Object.assign(Setter.Setting, Setting);
            });
            if(Opt?.Async) return Promise.resolve() // ----------------------------------------------------------------------------------------------------------------------------------------------------------------
                .then(() => Promise.all(                                    Setters.map    (Setter => new Promise(r => r(Setter.changeBeforeItems ? Setter.changeBeforeItems(Settings[Setter.Name]) : undefined)))  ))
                .then(() => Promise.all(R.Items.map    (Item => Promise.all(Setters.map    (Setter => new Promise(r => r(Setter.changeItem        ? Setter.changeItem(Item,  Settings[Setter.Name]) : undefined)))))))
                .then(() => Promise.all(                                    Setters.map    (Setter => new Promise(r => r(Setter.changeAfterItems  ? Setter.changeAfterItems( Settings[Setter.Name]) : undefined)))  ));
            else { // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                                                            Setters.forEach(Setter =>                    Setter.changeBeforeItems ? Setter.changeBeforeItems(Settings[Setter.Name]) : undefined  )    ;
                                        R.Items.forEach(Item =>             Setters.forEach(Setter =>                    Setter.changeItem        ? Setter.changeItem(Item,  Settings[Setter.Name]) : undefined  ) )  ;
                                                                            Setters.forEach(Setter =>                    Setter.changeAfterItems  ? Setter.changeAfterItems( Settings[Setter.Name]) : undefined  )    ;
            } // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        },
        createSubpanel: () => TextSetter.Subpanel = I.createSubpanel({ id: 'bibi-subpanel_textsetter',
            Opener: I.Menu.R.addButtonGroup({/* Lively: true, */ id: 'bibi-buttongroup_textsetter' }).addButton({
                Type: 'toggle',
                Labels: {
                    default: { default: `Change Text Setting`,     ja: `テキスト表示を調整` },
                    active:  { default: `Close Text Setting Menu`, ja: `テキスト表示調整メニューを閉じる` }
                },
                Icon: `<span class="bibi-icon bibi-icon-textsetter"></span>`,
                Help: true
            }),
            open: () => {},
            busy: (Busy) => TextSetter.Subpanel.Sections?.forEach(Section => Section.ButtonGroups?.forEach(ButtonGroup => ButtonGroup.Busy = Busy))
        }),
        discardSubpanel: () => {
            const Subpanel = TextSetter.Subpanel;
            O.Body.removeChild(Subpanel);
            I.Subpanels = I.Subpanels.filter(Sp => Sp != Subpanel);
            const OpenerButtonGroup = I.Menu.R.removeChild(Subpanel.Opener.ButtonGroup);
            I.Menu.R.ButtonGroups = I.Menu.R.ButtonGroups.filter(BG => BG != OpenerButtonGroup);
            delete TextSetter.Subpanel;
        },
        initialize: () => {
            E.bind('bibi:postprocessed-item', Item => TextSetter.postprocessItem(Item));
            // E.bind('bibi:loaded-book', () => R.Items.forEach(Item => TextSetter.readyItem(Item)));
            if(S['keep-settings']) E.bind('bibi:loaded-book', () => {
                const BookBiscuits = I.Oven.Biscuits.remember('Book'); if(!BookBiscuits) return;
                const Settings = TextSetter.distillSettings(BookBiscuits); if(!Settings) return;
                TextSetter.rebind(Settings, { SettingsAreDistilled: true, Async: false });
                // Bibi.StartOption.resetter();
            });
            if(S['use-textsetter-ui']) E.bind('bibi:loaded-book', () => {
                TextSetter.createSubpanel();
                TextSetter.X.forEach(Setter => Setter.createUI ? Setter.createUI() : false);
                if(!TextSetter.Subpanel.Sections?.length) TextSetter.discardSubpanel();
            });
        },
        PrototypeOfSetter: {
            Setting: {},
            initializeItemSettings: function(Item, ItemSettings) { Item.TextSettings[this.Name] = ItemSettings; },
            distillSetting: (Setting, Opt) => typeof Setting != 'object' || !Setting ? null : !Opt?.Changeable ? Setting : null,
            prepareCandidates: function(Item, Property, Default) {
                // if(typeof Property == 'string') {
                    const ItemSettings = Item.TextSettings[this.Name];
                    ((ItemSettings.CandidatesOf || (ItemSettings.CandidatesOf = {}))[Property] = new Set(Default || [])).Selectors = new Set();
                // } else {
                //     const Properties = Property;
                //     Object.keys(Properties).forEach(Property => this.prepareCandidates(Item, Property, Properties[Property]));
                // }
            },
            collectCandidates: function(Item, Property, Selector, AdditionalSelector) {
                const ItemSettings = Item.TextSettings[this.Name];
                const Candidates = ItemSettings.CandidatesOf[Property];
                let Eles = null; try {
                    const Cands_Sels = Candidates.Selectors, Sel = `*:not(:not(${ Selector }))${ AdditionalSelector || '' }:not(${ TextSetter.ElementsToBeIgnored })`;
                    if(!Cands_Sels.has(Sel)) {
                        Cands_Sels.add(Sel);
                        Eles = Item.contentDocument.querySelectorAll(Sel);
                    }
                } catch(Err) {}
                if(Eles?.length) {
                    for(let l = Eles.length, i = 0; i < l; i++) Eles[i] && Candidates.add(Eles[i]);
                }
            },
            isCandidateOf: function(Item, Property, Ele) {
                return Item.TextSettings[this.Name].CandidatesOf[Property].has(Ele);
            },
            deleteCandidates: function(Item) {
                const ItemSettings = Item.TextSettings[this.Name], CandidatesOf = ItemSettings.CandidatesOf;
                Object.keys(CandidatesOf).forEach(Property => {
                    const Candidates = CandidatesOf[Property], Cands_Sels = Candidates.Selectors;
                    Cands_Sels.clear(), delete Candidates.Selectors;
                    Candidates.clear(), delete CandidatesOf[Property];
                });
                delete ItemSettings.CandidatesOf;
            }
        },
        PrototypeOfResizer: {
            Setting: { Step: 0, Scale: 1, ScalePerStep: 1.25 },
            setScalePerStep: function(ScalePerStep) { if(Number.isFinite(ScalePerStep) && ScalePerStep > 1) this.Setting.ScalePerStep = ScalePerStep; },
            convertStepToScale: function(Step) { return Math.pow(this.Setting.ScalePerStep, Step); },
            convertScaleToStep: function(Scale) {
                if(Scale == 1) return 0;
                let Step = 0; const SPS = this.Setting.ScalePerStep;
                if(Scale < 1) while(--Step >= -2 && (Scale *= SPS) < 1); // if(Scale < 1) while(Step > -2 && Scale < 1) Step--, Scale *= SPS;
                else          while(++Step <=  2 && (Scale /= SPS) > 1); // else          while(Step <  2 && Scale > 1) Step++, Scale /= SPS;
                return Scale == 1 ? Step : undefined;
            },
            distillSetting: function(Setting, Opt) {
                if(typeof Setting == 'string') switch(Setting) {
                    case 'default': Setting = { Step: 0, Scale: 1 }; break;
                    default: return null;
                }
                else if(Number.isFinite(Setting)) Setting = { Scale: Setting };
                else if(typeof Setting != 'object' || !Setting) return null;
                let Step  = Number.isInteger(Setting.Step *= 1)                      ? sML.limitMinMax(Setting.Step, -2, 2) : undefined;
                let Scale = Number.isFinite(Setting.Scale *= 1) && Setting.Scale > 0 ?                 Setting.Scale        : undefined;
                if(Step === undefined) { if(Scale === undefined) return null;
                    Step = this.convertScaleToStep(Scale);
                } else if(Scale === undefined)
                    Scale = this.convertStepToScale(Step);
                return !Opt?.Changeable || Scale != this.Setting.Scale ? { Step: Step, Scale: Scale } : null;
            },
            createStepsUI: function(SectionLabels, MinMaxLabels, ButtonLabelsIcons) {
                const Setter = this;
                const UI = TextSetter.Subpanel.addSection({ Labels: { default: { default: SectionLabels[0], ja: SectionLabels[1] } } });
                UI.addButtonGroup({ Type: 'Steps',
                    MinLabels: { default: { default: MinMaxLabels[0][0], ja: MinMaxLabels[0][1] } },
                    MaxLabels: { default: { default: MinMaxLabels[1][0], ja: MinMaxLabels[1][1] } },
                    Buttons: (action => {
                        const Buttons = [];
                        for(let i = 0; i < 5; i++) Buttons.push({ Setting: { Step: i - 2 }, Labels: { default: { default: ButtonLabelsIcons[i][0], ja: ButtonLabelsIcons[i][1] } }, Icon: ButtonLabelsIcons[i][2], action: action });
                        return Buttons;
                    })(function() { TextSetter.change({ [Setter.Name]: this.Setting }) })
                });
                UI.care = (Setting) => UI.ButtonGroups[0].Buttons.forEach(Button => I.setUIState(Button, Button.Setting.Step != Setting.Step ? 'default' : 'active'));
                UI.care(this.Setting);
                return UI;
            }
        },
        X: [], x: (Setter) => {
            if(typeof Setter.Name != 'string' || !Setter.Name || TextSetter.X[Setter.Name]) return null;
            const Prototype = Object.assign({}, TextSetter.PrototypeOfSetter, { Setting: Object.assign({}, TextSetter.PrototypeOfSetter.Setting) });
            if(Setter.IsResizer) Object.assign(Prototype, TextSetter.PrototypeOfResizer, { Setting: Object.assign({}, TextSetter.PrototypeOfResizer.Setting) });
            TextSetter.X.push(Setter = TextSetter.X[Setter.Name] = Object.assign(Prototype, Setter));
            return Setter;
        }
    };
    // =========================================================================================================================
    if(S['use-fontsize-setter']) {
        TextSetter.x({
            Name: 'FontSize', IsResizer: true,
            postprocessItemBefore: function(Item) {
                this.initializeItemSettings(Item, {
                    Base: Number.isFinite(S['base-fontsize']) && S['base-fontsize'] > 0 ? sML.limitMinMax(S['base-fontsize'], 10, 30) : Item.TextSettings.HTMLOriginalFontSize
                });
                this.prepareCandidates(Item, 'font-size');
            },
            postprocessCSSRule: function(CSSRule, Item) {
                const StyleValue = CSSRule.style['font-size'];
                if(StyleValue && !/\d(%|cap|ch|r?em|ex|ic|r?lh)$/.test(StyleValue) && !/^(smaller|larger|inherit)$/.test(StyleValue)) this.collectCandidates(Item, 'font-size', CSSRule.selectorText, ':not(html)');
            },
            postprocessElement: function(Ele, ComStyle, Item) {
                if(!this.isCandidateOf(Item, 'font-size', Ele)) return;
                const ComFontSize = ComStyle.fontSize;
                if(!/\.?\d+px$/.test(ComFontSize)) return;
                const PEle = Ele.parentElement;
                Ele.style.fontSize = (PEle && getComputedStyle(PEle).fontSize == ComFontSize) ? '1em' : parseFloat(ComFontSize) / Item.TextSettings.HTMLOriginalFontSize + 'rem';
            },
            postprocessItemAfter: function(Item) {
                this.deleteCandidates(Item);
                Item.HTML.style.fontSize = Item.TextSettings.FontSize.Base + 'px';
            },
            changeItem: (Item, Setting) => { const Scale = Setting.Scale;
                const ItemSettings = Item.TextSettings?.FontSize; if(!ItemSettings) return;
                if(ItemSettings.StyleRule) sML.deleteCSSRule(Item.contentDocument, ItemSettings.StyleRule);
                ItemSettings.StyleRule = sML.appendCSSRule(Item.contentDocument, 'html', 'font-size: ' + (ItemSettings.Base * Scale) + 'px !important;');
            },
            createUI: function() {
                this.UI = this.createStepsUI([`Font Size`, `文字の大きさ`], [
                    [`Small`, `小`], [`Large`, `大`]
                ], [
                    [`Smallest`, `最小`, `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-smallest"></span>`],
                    [`Smaller`,  `小`,   `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-smaller"></span>`],
                    [`Default`,  `標準`, `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-medium"></span>`],
                    [`Larger`,   `大`,   `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-larger"></span>`],
                    [`Largest`,  `最大`, `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-largest"></span>`]
                ]);
            }
        }).setScalePerStep(S['fontsize-scale-per-step']);
    }
    if(S['use-linespacing-setter']) {
        TextSetter.x({
            Name: 'LineSpacing', IsResizer: true,
            postprocessItemBefore: function(Item) {
                this.initializeItemSettings(Item, {
                    CustomizableElements: new Set()
                });
                this.prepareCandidates(Item, 'line-height');
            },
            postprocessCSSRule: function(CSSRule, Item) {
                const StyleValue = CSSRule.style['line-height'];
                if(StyleValue && StyleValue != 'inherit') this.collectCandidates(Item, 'line-height', CSSRule.selectorText); // exclude (table|thead|tbody|th|td) ...?
            },
            postprocessElement: function(Ele, ComStyle, Item) {
                if(!this.isCandidateOf(Item, 'line-height', Ele)) return;
                const ComFontSize = ComStyle.fontSize;
                if(!/\.?\d+px$/.test(ComFontSize)) return;
                const ComLineHeight = ComStyle.lineHeight;
                if(!Ele.BibiTextSettings) Ele.BibiTextSettings = {};
                Ele.BibiTextSettings.LineHeight = { Base: /\.?\d+px$/.test(ComLineHeight) ? parseFloat(ComLineHeight) / parseFloat(ComFontSize) : 1.2 };
                Item.TextSettings.LineSpacing.CustomizableElements.add(Ele);
            },
            postprocessItemAfter: function(Item) {
                this.deleteCandidates(Item);
                Item.TextSettings.LineSpacing.CustomizableElements.forEach(Ele => Ele.style.lineHeight = Ele.BibiTextSettings.LineHeight.Base);
            },
            changeItem: (Item, Setting) => { const Scale = Setting.Scale;
                const ItemSettings = Item.TextSettings?.LineSpacing; if(!ItemSettings) return;
                ItemSettings.CustomizableElements.forEach(Ele => Ele.style.lineHeight = Ele.BibiTextSettings.LineHeight.Base * Scale);
            },
            createUI: function() {
                const TextLineShapes = (TLS => `<span class="bibi-shape bibi-shape-textlines">${ TLS + TLS + TLS + TLS + TLS + TLS + TLS + TLS }</span>`)(`<span class="bibi-shape bibi-shape-textline"></span>`);
                this.UI = this.createStepsUI([`Line Spacing`, `行間`], [
                    [`Narrow`, `狭い`], [`Wide`, `広い`]
                ], [
                    [`Narrowest`, `最小`, `<span class="bibi-icon bibi-icon-linespacing bibi-icon-linespacing-narrowest">${ TextLineShapes }</span>`],
                    [`Narrower`,  `狭い`, `<span class="bibi-icon bibi-icon-linespacing bibi-icon-linespacing-narrower">${ TextLineShapes }</span>`],
                    [`Default`,   `標準`, `<span class="bibi-icon bibi-icon-linespacing bibi-icon-linespacing-medium">${ TextLineShapes }</span>`],
                    [`Wider`,     `広い`, `<span class="bibi-icon bibi-icon-linespacing bibi-icon-linespacing-wider">${ TextLineShapes }</span>`],
                    [`Widest`,    `最大`, `<span class="bibi-icon bibi-icon-linespacing bibi-icon-linespacing-widest">${ TextLineShapes }</span>`]
                ]);
            }
        }).setScalePerStep(S['linespacing-scale-per-step']);
    }
    if(S['use-flowdirection-setter']) {
        TextSetter.x({
            Name: 'FlowDirection', IsResizer: false,
            Setting: { Default: true, DefaultWritingMode: B.WritingMode, DefaultPageProgressionDirection: B.PPD },
            DirectionalStylePropertyTrees: JSON.stringify([[['margin@', 'padding@', 'inset@', 'border@Style', 'border@Width', 'border@Color'], ['Block@', 'Inline@'], ['Start', 'End']]/*, [['blockSize', 'inlineSize']]*/].map(TreeSet => TreeSet.reduce((Tree, Branches) => (function appendTo(Base, AppendingNames, BaseName = '') {
                const ChildNames = Object.keys(Base);
                ChildNames.length ? ChildNames.forEach(ChildName => appendTo(Base[ChildName], AppendingNames, ChildName)) : AppendingNames.forEach(AppendingName => Base[BaseName.replace(/(@|$)/, AppendingName)] = {});
                return Base;
            })(Tree, Branches), {}))).replace(/@/g, ''),
            postprocessItemBefore: function(Item) {
                this.initializeItemSettings(Item, {
                    DefaultWritingMode: Item.WritingMode,
                    FlowRootElements: new Set(),
                    OverlinedElements: new Set()
                });
                this.prepareCandidates(Item, 'writing-mode', [Item.HTML]);
                this.prepareCandidates(Item, 'text-decoration-line');
            },
            postprocessCSSRule: function(CSSRule, Item) {
                const Style = CSSRule.style;
                if(Style['writing-mode'] || Style['-webkit-writing-mode'] || Style['-epub-writing-mode']) this.collectCandidates(Item, 'writing-mode', CSSRule.selectorText);
                if(B.WritingMode == 'tb-rl' && (Style['text-decoration-line'] || Style['-epub-text-decoration-line'] || Style['-webkit-text-decoration-line']) == 'overline') this.collectCandidates(Item, 'text-decoration-line', CSSRule.selectorText);
            },
            postprocessElement: function(Ele, ComStyle, Item) {
                if(this.isCandidateOf(Item, 'writing-mode', Ele)) {
                    const ComWritingMode = ComStyle.writingMode;
                    const PEle = Ele.parentElement;
                    if(PEle && getComputedStyle(PEle).writingMode == ComWritingMode) Ele.style.writingMode = 'inherit';
                    else {
                        if(!Ele.BibiTextSettings) Ele.BibiTextSettings = {};
                        Ele.BibiTextSettings.FlowDirection = { DefaultWritingMode: (Ele.style.writingMode = ComWritingMode) };
                        Item.TextSettings.FlowDirection.FlowRootElements.add(Ele);
                    }
                }
                if(B.WritingMode == 'tb-rl' && this.isCandidateOf(Item, 'text-decoration-line', Ele)) {
                    if(ComStyle.writingMode == 'vertical-rl' && ComStyle.textDecorationLine == 'overline') Item.TextSettings.FlowDirection.OverlinedElements.add(Ele);
                }
                JSON.parse(this.DirectionalStylePropertyTrees).forEach((StyleTree, i) => {
                    Object.keys(StyleTree).forEach(SelfName => StyleTree[SelfName] = (function buildStyleTree(Parent, SelfName) {
                        const Self = Parent[SelfName], Children = Object.keys(Self);
                        if(Children.length) {
                            const Vals = Children.map(Pro => Self[Pro] = (Object.keys(Self[Pro]).length) ? buildStyleTree(Self, Pro) : ComStyle[Pro]);
                            if(new Set(Vals).size == 1) Parent[SelfName] = Vals[0];
                        } else Parent[SelfName] = ComStyle[SelfName];
                        return Parent[SelfName];
                    })(StyleTree, SelfName));
                    const PropertiesToBeIgnored = !i ? Object.keys(StyleTree) : []; // Ignore shorthand properties like margin, padding...
                    (function setStyles(StyleTree) {
                        Object.keys(StyleTree).forEach(Pro => {
                            let Val = StyleTree[Pro];
                            if(typeof Val == 'object') return setStyles(Val);
                            if(!PropertiesToBeIgnored.includes(Pro)) Ele.style[Pro] = !/\.?\d+?px$/.test(Val) ? Val : !(Val = parseFloat(Val)) ? 0 : /* /^marginInline$/.test(Pro) && Val >= 0 ? 'auto' : */ Val / Item.TextSettings.HTMLOriginalFontSize + 'rem';
                        });
                    })(StyleTree);
                });
            },
            postprocessItemAfter: function(Item) {
                this.deleteCandidates(Item);
            },
            getLineAxis: (WM) => WM.split('-')[1] == 'tb' ? 'horizontal' : 'vertical',
            distillSetting: function(Setting, Opt) {
                if(typeof Setting == 'string') switch(Setting) {
                    case 'default':    Setting = { Default: true  }; break;
                    case 'alt':        Setting = { Default: false }; break;
                    case 'toggle':     Setting = { Default: !this.Setting.Default }; break;
                    case 'horizontal':
                    case 'vertical':   Setting = { Default: this.getLineAxis(this.Setting.DefaultWritingMode) == Setting }; break;
                    default: return null;
                }
                else if(typeof Setting != 'object' || !Setting) return null;
                const Default = Setting.Default !== undefined ? !!Setting.Default : Setting.Alt !== undefined ? !Setting.Alt : Setting.Toggle !== undefined ? !this.Setting.Default : undefined;
                if(Default === undefined) return null;
                return !Opt?.Changeable || Default != this.Setting.Default ? { Default: Default } : null;
            },
            changeBeforeItems: function(Setting) {
                if(Setting.Default) {
                    B.WritingMode = this.Setting.DefaultWritingMode;
                    B.PPD         = this.Setting.DefaultPageProgressionDirection;
                } else switch(this.Setting.DefaultWritingMode) {
                    case 'lr-tb': B.WritingMode = 'tb-rl', B.PPD = 'rtl'; break;
                    case 'rl-tb': B.WritingMode = 'bt-rl', B.PPD = 'rtl'; break;
                    case 'tb-rl': B.WritingMode = 'lr-tb', B.PPD = 'ltr'; break;
                }
            },
            changeItem: function(Item, Setting) {
                const ItemSettings = Item.TextSettings?.FlowDirection; if(!ItemSettings) return;
                const BookDefaultLineAxis = this.getLineAxis(this.Setting.DefaultWritingMode);
                if(Setting.Default) {
                    ItemSettings.OverlinedElements.forEach(Ele => Ele.style.textDecorationLine = '');
                    ItemSettings.FlowRootElements.forEach(Ele => Ele.style.writingMode = Ele.BibiTextSettings.FlowDirection.DefaultWritingMode);
                    Item.WritingMode = ItemSettings.DefaultWritingMode;
                    Item.HTML.classList.remove('bibi-textsetter-writingmode-alternated');
                } else if(this.getLineAxis(ItemSettings.DefaultWritingMode) == BookDefaultLineAxis) {
                    ItemSettings.OverlinedElements.forEach(Ele => Ele.style.textDecorationLine = 'underline');
                    ItemSettings.FlowRootElements.forEach(Ele => {
                        if(this.getLineAxis(Ele.BibiTextSettings.FlowDirection.DefaultWritingMode) != BookDefaultLineAxis) return;
                        Ele.style.writingMode = BookDefaultLineAxis == 'horizontal' ? 'vertical-rl' : 'horizontal-tb';
                    });
                    Item.WritingMode = O.getWritingMode(Item.HTML);
                    Item.HTML.classList.add('bibi-textsetter-writingmode-alternated');
                }
                if(this.getLineAxis(Item.WritingMode) == 'horizontal') Item.HTML.classList.remove(  'bibi-vertical-text'), Item.HTML.classList.add('bibi-horizontal-text');
                else                                                   Item.HTML.classList.remove('bibi-horizontal-text'), Item.HTML.classList.add(  'bibi-vertical-text');
            },
            changeAfterItems: (Setting) => {
                S.update();
                E.dispatch('bibi:changed-view', S.RVM);
            },
            createUI: function() { //// TEMPORARY
                const Setter = this;
                this.UI = TextSetter.Subpanel.addSection({ Labels: { default: { default: `Direction of Text/Line`, ja: `縦書き・横書き` } } });
                this.UI.addButtonGroup({
                    Buttons: [{ Setting: { Toggle: true }, Type: 'toggle', Icon: `<span class="bibi-icon bibi-icon-flowdirection"></span>`, Labels: { default: { default: `Alternate`, ja: `切り替え` } }, action: function() { TextSetter.change({ [Setter.Name]: this.Setting }); } }]
                });
                this.UI.care = (Setting) => this.UI.ButtonGroups[0].Buttons.forEach(Button => I.setUIState(Button, Setting.Default ? 'default' : 'active'));
                this.UI.care(this.Setting);
            }
        });
    }
    // =========================================================================================================================
    E.dispatch('bibi:prepared-textsetter');
    TextSetter.initialize();
    E.dispatch('bibi:created-textsetter');
}};


I.Loupe = { create: () => {
    if(S['loupe-max-scale']      <= 1) S['loupe-max-scale']      = 4.0;
    if(S['loupe-scale-per-step'] <= 1) S['loupe-scale-per-step'] = 1.6;
    if(S['loupe-scale-per-step'] > S['loupe-max-scale']) S['loupe-scale-per-step'] = S['loupe-max-scale'];
    const Loupe = I.Loupe = {
        CurrentTransformation: { Scale: 1, TranslateX: 0, TranslateY: 0 },
        defineZoomOutPropertiesForUtilities: () => {
            const Tfm = {}, ReservedSpaceTop = S['use-menubar'] && S['use-full-height'] ? I.Menu.Height : 0;
            if(S.ARA == 'horizontal') {
                const ReservedSpaceBottom = I.Slider.Size;
                if(S.ARA == S.SLA) {
                    const HighestSpreadHeight = Math.max(...R.Spreads.map(Spr => Spr.offsetHeight));
                    if(HighestSpreadHeight < R.Main.offsetHeight - Math.max(ReservedSpaceTop, ReservedSpaceBottom) * 2) return Loupe.ZoomOutPropertiesForUtilities = null;
                    Tfm.Scale = Math.min(1, (R.Main.offsetHeight - (ReservedSpaceTop + ReservedSpaceBottom)) / HighestSpreadHeight);
                    Tfm.TranslateY = (ReservedSpaceTop - ReservedSpaceBottom + O.Scrollbars.Height) / 2;
                } else {
                    Tfm.Scale = (R.Main.offsetHeight - (ReservedSpaceTop + ReservedSpaceBottom)) / R.Main.offsetHeight;
                    Tfm.TranslateY = ReservedSpaceTop - (R.Main.offsetHeight) * (1 - Tfm.Scale) / 2;
                }
                Tfm.TranslateX = 0;
            } else {
                const ReservedSpaceRight = I.Slider.Size;
                if(Math.max(...R.Spreads.map(Spr => Spr.offsetWidth)) + ReservedSpaceRight * 2 < R.Main.offsetWidth) return Loupe.ZoomOutPropertiesForUtilities = null;
                const ScaleW = (R.Main.offsetWidth  - ReservedSpaceRight) / (R.Main.offsetWidth - O.Scrollbars.Width);
                const ScaleH = (R.Main.offsetHeight - ReservedSpaceTop  ) /  R.Main.offsetHeight;
                Tfm.Scale = Math.min(ScaleW, ScaleH);
                Tfm.TranslateX = (Tfm.Scale == ScaleW ? R.Main.offsetWidth * (1 - Tfm.Scale) : (ReservedSpaceRight - O.Scrollbars.Width)) / -2;
                Tfm.TranslateY = ReservedSpaceTop - R.Main.offsetHeight * (1 - Tfm.Scale) / 2;
            }
            const Stc = (O.Body['offset' + C.A_SIZE_L] / Tfm.Scale - R.Main['offset' + C.A_SIZE_L]), OPd = {}, IPd = {};
            OPd[C.A_BASE_B] = OPd[C.A_BASE_A] = Stc / 2; if(!S['use-full-height'] && S.ARA == 'vertical') OPd.Top += I.Menu.Height;
            // if(S.ARA == S.SLA) IPd[S.ARA == 'horizontal' ? 'Right' : 'Bottom'] = Stc / 2;
            return Loupe.ZoomOutPropertiesForUtilities = { Transformation: Tfm, Stretch: Stc, OuterPadding: OPd, /*InnerPadding: IPd*/ };
        },
        getNormalizedTransformation: (Tfm) => {
            const NTfm = Object.assign({}, Loupe.CurrentTransformation);
            if(Tfm) {
                if(typeof Tfm.Scale      == 'number') NTfm.Scale      = Tfm.Scale;
                if(typeof Tfm.TranslateX == 'number') NTfm.TranslateX = Tfm.TranslateX;
                if(typeof Tfm.TranslateY == 'number') NTfm.TranslateY = Tfm.TranslateY;
            }
            return NTfm;
        },
        getActualTransformation: (Tfm) => {
            const ATfm = Loupe.getNormalizedTransformation(Tfm);
            if(ATfm.Scale == 1 && Loupe.IsZoomedOutForUtilities) {
                const Tfm4U = Loupe.ZoomOutPropertiesForUtilities.Transformation;
                ATfm.Scale      *= Tfm4U.Scale;
                ATfm.TranslateX += Tfm4U.TranslateX;
                ATfm.TranslateY += Tfm4U.TranslateY;
            }
            return ATfm;
        },
        transform: (Tfm, Opt = {}) => new Promise((resolve, reject) => {
            // Tfm: Transformation
            Tfm = Loupe.getNormalizedTransformation(Tfm);
            const PTfm = Loupe.CurrentTransformation;
            //if(Tfm.Scale == PTfm.Scale && Tfm.TranslateX == PTfm.TranslateX && Tfm.TranslateY == PTfm.TranslateY) return resolve();
            Loupe.Transforming = true;
            clearTimeout(Loupe.Timer_onTransformEnd);
            O.HTML.classList.add('transforming');
            if(Tfm.Scale > 1) {
                const OverflowX = window.innerWidth  * (0.5 * (Tfm.Scale - 1)),
                      OverflowY = window.innerHeight * (0.5 * (Tfm.Scale - 1));
                Tfm.TranslateX = sML.limitMinMax(Tfm.TranslateX, OverflowX * -1 - (S.RVM != 'vertical' ? 0 : I.Slider.UIState == 'active' ? I.Slider.Size - O.Scrollbars.Width  : 0) + O.Scrollbars.Width , OverflowX);
                Tfm.TranslateY = sML.limitMinMax(Tfm.TranslateY, OverflowY * -1 - (S.RVM == 'vertical' ? 0 : I.Slider.UIState == 'active' ? I.Slider.Size - O.Scrollbars.Height : 0) + O.Scrollbars.Height, OverflowY + (I.Menu.UIState == 'active' ? I.Menu.Height : 0));
            }
            Loupe.CurrentTransformation = Tfm;
            const ATfm = Loupe.getActualTransformation(Tfm);
            sML.style(R.Main, {
                transform: (Ps => {
                         if(ATfm.TranslateX && ATfm.TranslateY) Ps.push( 'translate(' + ATfm.TranslateX + 'px' + ', ' + ATfm.TranslateY + 'px' + ')');
                    else if(ATfm.TranslateX                   ) Ps.push('translateX(' + ATfm.TranslateX + 'px'                                 + ')');
                    else if(                   ATfm.TranslateY) Ps.push('translateY('                                 + ATfm.TranslateY + 'px' + ')');
                         if(ATfm.Scale != 1                   ) Ps.push(     'scale(' + ATfm.Scale                                             + ')');
                    return Ps.length ? Ps.join(' ') : '';
                })([])
            });
            Loupe.Timer_onTransformEnd = setTimeout(() => {
                     if(Loupe.CurrentTransformation.Scale == 1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.remove('zoomed-out');
                else if(Loupe.CurrentTransformation.Scale <  1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.add(   'zoomed-out');
                else                                            O.HTML.classList.add(   'zoomed-in'), O.HTML.classList.remove('zoomed-out');
                O.HTML.classList.remove('transforming');
                Loupe.Transforming = false;
                resolve();
                E.dispatch('bibi:transformed-book', {
                    Transformation: Tfm,
                    ActualTransformation: ATfm,
                    PreviousTransformation: PTfm,
                    Temporary: Opt.Temporary
                });
            }, 345);
        }),
        scale: (Scl, Opt = {}) => { // Scl: Scale
            Scl = typeof Scl == 'number' ? sML.limitMinMax(Scl, 1, S['loupe-max-scale']) : 1;
            if(!Opt.Stepless) Scl = Math.round(Scl * 100) / 100;
            const CTfm = Loupe.CurrentTransformation;
            if(Scl == CTfm.Scale) return Promise.resolve();
            E.dispatch('bibi:changes-scale', Scl);
            let TX = 0, TY = 0;
            if(Scl < 1) {
                TX = R.Main.offsetWidth  * (1 - Scl) / 2;
                TY = R.Main.offsetHeight * (1 - Scl) / 2;
            } else if(Scl > 1) {
                if(Loupe.UIState != 'active') return Promise.resolve();
                if(!Opt.Center) Opt.Center = { X: window.innerWidth / 2, Y: window.innerHeight / 2 };
                TX = CTfm.TranslateX + (Opt.Center.X - window.innerWidth  / 2 - CTfm.TranslateX) * (1 - Scl / CTfm.Scale);
                TY = CTfm.TranslateY + (Opt.Center.Y - window.innerHeight / 2 - CTfm.TranslateY) * (1 - Scl / CTfm.Scale);
                /* ↑↑↑↑ SIMPLIFIED ↑↑↑↑
                const CTfmOriginX = window.innerWidth  / 2 + CTfm.TranslateX;  TX = CTfm.TranslateX + (Opt.Center.X - (CTfmOriginX + (Opt.Center.X - CTfmOriginX) * (Scl / CTfm.Scale)));
                const CTfmOriginY = window.innerHeight / 2 + CTfm.TranslateY;  TY = CTfm.TranslateY + (Opt.Center.Y - (CTfmOriginY + (Opt.Center.Y - CTfmOriginY) * (Scl / CTfm.Scale)));
                //*/
            }
            return Loupe.transform({
                Scale: Scl,
                TranslateX: TX,
                TranslateY: TY
            });
        },
        BookStretchingEach: 0,
        transformToDefault: () => Loupe.transform({ Scale: 1, TranslateX: 0, TranslateY: 0 }),
        transformForUtilities: (IO) => {
            if(!Loupe.isAvailable() || !Loupe.ZoomOutPropertiesForUtilities) return Promise.resolve();
            const before = () => O.HTML.classList.add(   'transforming-for-utilities');
            const  after = () => O.HTML.classList.remove('transforming-for-utilities');
            let cb = () => {};
            if(IO) {
                if(Loupe.IsZoomedOutForUtilities) return Promise.resolve();
                before();
                Loupe.IsZoomedOutForUtilities = true;
                const OP4U = Loupe.ZoomOutPropertiesForUtilities.OuterPadding/*, IP4U = Loupe.ZoomOutPropertiesForUtilities.InnerPadding*/;
                for(const Dir in OP4U) R.Main.style[     'padding' + Dir] = OP4U[Dir] + 'px';
                // for(const Dir in IP4U) R.Main.Book.style['padding' + Dir] = IP4U[Dir] + 'px';
                Loupe.BookStretchingEach = Loupe.ZoomOutPropertiesForUtilities.Stretch / 2;
                cb = () => {
                    O.HTML.classList.add('zoomed-out-for-utilities');
                    after();
                };
            } else {
                if(!Loupe.IsZoomedOutForUtilities) return Promise.resolve();
                before();
                O.HTML.classList.remove('zoomed-out-for-utilities');
                Loupe.IsZoomedOutForUtilities = false;
                cb = () => {
                    R.Main.style.padding = R.Main.Book.style.padding = '';
                    Loupe.BookStretchingEach = 0;
                    after();
                };
            }
            return Loupe.transform(null, { Temporary: true }).then(cb).then(() => I.Slider.ownerDocument ? I.Slider.progress() : undefined);
        },
        isAvailable: () => {
            if(!L.Opened) return false;
            if(Loupe.UIState != 'active') return false;
            //if(B.Reflowable) return false;
            return true;
        },
        checkBibiEventForTaps: (BibiEvent) => {
            if(!BibiEvent || !Loupe.isAvailable()) return false;
            if(BibiEvent.target.tagName) {
                if(/bibi-menu|bibi-slider/.test(BibiEvent.target.id)) return false;
                if(O.isPointableContent(BibiEvent.target)) return false;
                if(S.RVM == 'horizontal' && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
            }
            return true;
        },
        onTap: (BibiEvent) => {
            if(!Loupe.checkBibiEventForTaps(BibiEvent)) return Promise.resolve();
            BibiEvent.preventDefault();
            try { BibiEvent.target.ownerDocument.body.Item.contentWindow.getSelection().empty(); } catch(Err) {}
            if(Loupe.CurrentTransformation.Scale >= S['loupe-max-scale'] && !BibiEvent.shiftKey) return Loupe.scale(1);
            return Loupe.scale(Loupe.CurrentTransformation.Scale * (BibiEvent.shiftKey ? 1 / S['loupe-scale-per-step'] : S['loupe-scale-per-step']), { Center: BibiEvent.Coord });
        },
        onPointerDown: (BibiEvent) => {
            Loupe.PointerDownCoord = BibiEvent.Coord;
            Loupe.PointerDownTransformation = {
                Scale: Loupe.CurrentTransformation.Scale,
                TranslateX: Loupe.CurrentTransformation.TranslateX,
                TranslateY: Loupe.CurrentTransformation.TranslateY
            };
        },
        onPointerUp: (BibiEvent) => {
            O.HTML.classList.remove('dragging');
            Loupe.Dragging = false;
            delete Loupe.PointerDownCoord;
            delete Loupe.PointerDownTransformation;
        },
        onPointerMove: (BibiEvent) => {
            if(I.PinchObserver.Hot) return false;
            if(!Loupe.isAvailable()) return false;
            if(Loupe.CurrentTransformation.Scale == 1 || !Loupe.PointerDownCoord) return false;
            BibiEvent.preventDefault();
            Loupe.Dragging = true;
            O.HTML.classList.add('dragging');
            clearTimeout(Loupe.Timer_TransitionRestore);
            sML.style(R.Main, { transition: 'none' }, { cursor: 'move' });
            Loupe.transform({
                Scale: Loupe.CurrentTransformation.Scale,
                TranslateX: Loupe.PointerDownTransformation.TranslateX + (BibiEvent.Coord.X - Loupe.PointerDownCoord.X),
                TranslateY: Loupe.PointerDownTransformation.TranslateY + (BibiEvent.Coord.Y - Loupe.PointerDownCoord.Y)
            });
            Loupe.Timer_TransitionRestore = setTimeout(() => sML.style(R.Main, { transition: '' }, { cursor: '' }), 234);
        }
    };
    I.isPointerStealth.addChecker(() => {
        if(Loupe.Dragging) return true;
        if(!I.KeyObserver.ActiveKeys || !I.KeyObserver.ActiveKeys['Space']) return false;
        return true;
    });
    I.setToggleAction(Loupe, {
        onopened: () => {
            //Loupe.defineZoomOutPropertiesForUtilities();
            O.HTML.classList.add('loupe-active');
        },
        onclosed: () => {
            Loupe.transformToDefault();
            O.HTML.classList.remove('loupe-active');
        }
    });
    E.add('bibi:commands:activate-loupe',   (   ) => Loupe.open());
    E.add('bibi:commands:deactivate-loupe', (   ) => Loupe.close());
    E.add('bibi:commands:toggle-loupe',     (   ) => Loupe.toggle());
    E.add('bibi:commands:scale',            Scale => Loupe.scale(Scale));
    if(S['on-doubletap'            ] == 'zoom') E.add('bibi:doubletapped',             BibiEvent => Loupe.onTap(BibiEvent));
    if(S['on-tripletap'            ] == 'zoom') E.add('bibi:tripletapped',             BibiEvent => Loupe.onTap(BibiEvent));
    if(S['on-singletap-with-altkey'] == 'zoom') E.add('bibi:singletapped-with-altkey', BibiEvent => Loupe.onTap(BibiEvent));
    if(S['on-doubletap-with-altkey'] == 'zoom') E.add('bibi:doubletapped-with-altkey', BibiEvent => Loupe.onTap(BibiEvent));
    if(S['on-tripletap-with-altkey'] == 'zoom') E.add('bibi:tripletapped-with-altkey', BibiEvent => Loupe.onTap(BibiEvent));
    E.add('bibi:downed-pointer', BibiEvent => Loupe.onPointerDown(BibiEvent));
    E.add('bibi:upped-pointer',  BibiEvent => Loupe.onPointerUp(  BibiEvent));
    E.add('bibi:moved-pointer',  BibiEvent => Loupe.onPointerMove(BibiEvent));
    if(S['zoom-out-for-utilities']) {
        E.add('bibi:opens-utilities',  () => Loupe.transformForUtilities(true ));
        E.add('bibi:closes-utilities', () => Loupe.transformForUtilities(false));
    }
    E.add('bibi:opened', () => Loupe.open());
    E.add('bibi:laid-out', () => Loupe.defineZoomOutPropertiesForUtilities());
    E.add('bibi:changed-view',  () => Loupe.transformToDefault());
    if(S['use-loupe-ui']) E.bind('bibi:loaded-book', () => {
        const ButtonGroup = I.Menu.R.addButtonGroup({
            // Lively: true,
            Type: 'Tiled',
            id: 'bibi-buttongroup_loupe',
            Buttons: [{
                Labels: { default: { default: `Zoom-in`, ja: `拡大する` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>`,
                Help: true,
                action: () => Loupe.scale(Loupe.CurrentTransformation.Scale * S['loupe-scale-per-step']),
                updateState: function(State) { I.setUIState(this, typeof State == 'string' ? State : (Loupe.CurrentTransformation.Scale >= S['loupe-max-scale']) ? 'disabled' : 'default'); }
            }, { 
                Labels: { default: { default: `Reset Zoom-in/out`, ja: `元のサイズに戻す` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>`,
                Help: true,
                action: () => Loupe.scale(1),
                updateState: function(State) { I.setUIState(this, typeof State == 'string' ? State : (Loupe.CurrentTransformation.Scale == 1) ? 'disabled' : 'default'); }
            }, {
                Labels: { default: { default: `Zoom-out`, ja: `縮小する` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomout"></span>`,
                Help: true,
                action: () => Loupe.scale(Loupe.CurrentTransformation.Scale / S['loupe-scale-per-step']),
                updateState: function(State) { I.setUIState(this, typeof State == 'string' ? State : (Loupe.CurrentTransformation.Scale <= 1) ? 'disabled' : 'default'); }
            }]
        });
        Loupe.updateButtonState = (State) => ButtonGroup.Buttons.forEach(Button => Button.updateState(State));
        E.add('bibi:opened',           () => Loupe.updateButtonState());
        E.add('bibi:transformed-book', () => Loupe.updateButtonState());
    });
    E.dispatch('bibi:created-loupe');
}};


I.Nombre = { create: () => { if(!S['use-nombre']) return;
    const Nombre = I.Nombre = O.Body.appendChild(sML.create('div', { id: 'bibi-nombre',
        clearTimers: () => {
            clearTimeout(Nombre.Timer_hot);
            clearTimeout(Nombre.Timer_vanish);
            clearTimeout(Nombre.Timer_autohide);
        },
        show: () => {
            Nombre.clearTimers();
            Nombre.classList.add('active');
            Nombre.Timer_hot = setTimeout(() => Nombre.classList.add('hot'), 10);
        },
        hide: () => {
            Nombre.clearTimers();
            Nombre.classList.remove('hot');
            Nombre.Timer_vanish = setTimeout(() => Nombre.classList.remove('active'), 255);
        },
        progress: (PageInfo) => {
            Nombre.clearTimers();
            if(!PageInfo) PageInfo = I.PageObserver.Current;
            if(!PageInfo.List.length) return; ////////
            const StartPageNumber = PageInfo.List[          0].Page.Index + 1;
            const   EndPageNumber = PageInfo.List.slice(-1)[0].Page.Index + 1;
            const Percent = Math.floor((EndPageNumber) / R.Pages.length * 100);
            Nombre.Current.innerHTML = (() => {
                let PageNumber = StartPageNumber; if(StartPageNumber != EndPageNumber) PageNumber += `<span class="delimiter">-</span>` + EndPageNumber;
                return PageNumber;
            })();
            Nombre.Delimiter.innerHTML = `/`;
            Nombre.Total.innerHTML     = R.Pages.length;
            Nombre.Percent.innerHTML   = `(${ Percent }<span class="unit">%</span>)`;
            Nombre.show();
            if(I.Slider.UIState != 'active') Nombre.Timer_autohide = setTimeout(Nombre.hide, 1234);
        }
    }));
    Nombre.Current   = Nombre.appendChild(sML.create('span', { className: 'bibi-nombre-current'   }));
    Nombre.Delimiter = Nombre.appendChild(sML.create('span', { className: 'bibi-nombre-delimiter' }));
    Nombre.Total     = Nombre.appendChild(sML.create('span', { className: 'bibi-nombre-total'     }));
    Nombre.Percent   = Nombre.appendChild(sML.create('span', { className: 'bibi-nombre-percent'   }));
    E.add('bibi:opened' , () => setTimeout(() => {
        Nombre.progress();
        E.add(['bibi:keeps-scrolling', 'bibi:scrolled', 'bibi:opened-slider'], () => Nombre.progress());
        E.add('bibi:closed-slider', Nombre.hide);
    }, 321));
    sML.appendCSSRule('html.view-paged div#bibi-nombre',      'bottom: ' + (O.Scrollbars.Height + 2) + 'px;');
    sML.appendCSSRule('html.view-horizontal div#bibi-nombre', 'bottom: ' + (O.Scrollbars.Height + 2) + 'px;');
    sML.appendCSSRule('html.view-vertical div#bibi-nombre',    'right: ' + (O.Scrollbars.Height + 2) + 'px;');
    E.dispatch('bibi:created-nombre');
}};


I.History = {
    List: [], Updaters: [],
    update: () => I.History.Updaters.forEach(fun => fun()),
    add: (Opt = {}) => { if(!S['use-histories']) return null;
        if(!Opt.UI) Opt.UI = Bibi;
        const PageToBeAdded = Opt.Destination ? R.getPage(Opt.Destination) : (() => { I.PageObserver.updateCurrent(); return I.PageObserver.Current.List[0].Page; })();
        let Added = null;
        if(PageToBeAdded != R.getPage(I.History.List.slice(-1)[0])) {
            if(Opt.SumUp && I.History.List.slice(-1)[0].UI == Opt.UI) I.History.List.pop();
            Added = { UI: Opt.UI, IIPP: R.getIIPP({ Page: PageToBeAdded }) };
            I.History.List.push(Added);
            if(I.History.List.length - 1 > S['max-histories']) { // Not count the first (oldest).
                const First = I.History.List.shift(); // The first (oldest) is the landing point.
                I.History.List.shift(); // Remove the second
                I.History.List.unshift(First); // Restore the first (oldest).
            }
        }
        I.History.update();
        return Added;
    },
    back: () => {
        if(I.History.List.length <= 1) return Promise.reject();
        const CurrentPage = R.getPage(I.History.List.pop()),
                 LastPage = R.getPage(I.History.List.slice(-1)[0]);
        I.History.update();
        return R.focusOn(LastPage, { Duration: 0 });
    }
};


I.Slider = { create: () => {
    if(!S['use-slider']) return false;
    O.HTML.classList.add('slider-active');
    const Slider = I.Slider = O.Body.appendChild(sML.create('div', { id: 'bibi-slider',
        RailProgressMode: 'end', // or 'center'
        Size: I.Slider.Size,
        initialize: () => {
            const EdgebarBox = Slider.appendChild(sML.create('div', { id: 'bibi-slider-edgebar-box' }));
            Slider.Edgebar = EdgebarBox.appendChild(sML.create('div', { id: 'bibi-slider-edgebar' }));
            Slider.Rail    = EdgebarBox.appendChild(sML.create('div', { id: 'bibi-slider-rail' }));
            Slider.RailGroove   = Slider.Rail.appendChild(sML.create('div', { id: 'bibi-slider-rail-groove' }));
            Slider.RailProgress = Slider.RailGroove.appendChild(sML.create('div', { id: 'bibi-slider-rail-progress' }));
            Slider.Thumb   = EdgebarBox.appendChild(sML.create('div', { id: 'bibi-slider-thumb', Labels: { default: { default: `Slider Thumb`, ja: `スライダー上の好きな位置からドラッグを始められます` } } })); I.setFeedback(Slider.Thumb);
            if(S['use-history-ui']) {
                Slider.classList.add('bibi-slider-with-history');
                Slider.History        = Slider.appendChild(sML.create('div', { id: 'bibi-slider-history' }));
                Slider.History.Button = Slider.History.appendChild(I.createButtonGroup()).addButton({ id: 'bibi-slider-history-button',
                    Type: 'normal',
                    Labels: { default: { default: `History Back`, ja: `移動履歴を戻る` } },
                    Help: false,
                    Icon: `<span class="bibi-icon bibi-icon-history"></span>`,
                    action: () => I.History.back(),
                    update: function() {
                        this.Icon.style.transform = `rotate(${ 360 * (I.History.List.length - 1) }deg)`;
                             if(I.History.List.length <= 1) I.setUIState(this, 'disabled');
                        else if(this.UIState == 'disabled') I.setUIState(this, 'default');
                    }
                });
                I.History.Updaters.push(() => Slider.History.Button.update());
            }
            if(S['use-nombre']) {
                E.add(Slider.Edgebar, ['mouseover', 'mousemove'], Eve => { if(!Slider.Touching) I.Nombre.progress({ List: [{ Page: Slider.getPointedPage(E.aBCD(Eve).Coord[C.A_AXIS_L]) }] }); });
                E.add(Slider.Edgebar,  'mouseout',                Eve => { if(!Slider.Touching) I.Nombre.progress(); });
            }
        },
        resetUISize: () => {
            Slider.MainLength = R.Main['scroll' + C.L_SIZE_L];
            const ThumbLengthPercent = R.Main['offset' + C.L_SIZE_L] / Slider.MainLength * 100;
            Slider.RailGroove.style[C.A_SIZE_b] = Slider.Thumb.style[C.A_SIZE_b] = '';
            Slider.RailGroove.style[C.A_SIZE_l] = (100 - (Slider.RailProgressMode == 'center' ? ThumbLengthPercent : 0)) + '%';
                 Slider.Thumb.style[C.A_SIZE_l] =                                               ThumbLengthPercent       + '%';
            setTimeout(() => Slider.Thumb.classList.toggle('min', (STACS => STACS.width == STACS.height)(getComputedStyle(Slider.Thumb, '::after'))), 0);
               Slider.Edgebar.Before = O.getElementCoord(Slider.Edgebar)[C.A_AXIS_L];
               Slider.Edgebar.Length = Slider.Edgebar['offset' + C.A_SIZE_L];
               Slider.Edgebar.After  = Slider.Edgebar.Before + Slider.Edgebar.Length;
            Slider.RailGroove.Before = O.getElementCoord(Slider.RailGroove)[C.A_AXIS_L];
            Slider.RailGroove.Length = Slider.RailGroove['offset' + C.A_SIZE_L];
            Slider.RailGroove.After  = Slider.RailGroove.Before + Slider.RailGroove.Length;
                 Slider.Thumb.Length = Slider.Thumb['offset' + C.A_SIZE_L];
        },
        onTouchStart: (BibiEvent) => {
            I.ScrollObserver.forceStopScrolling();
            clearTimeout(Slider.Timer_onTouchEnd);
            BibiEvent.preventDefault();
            Slider.Touching = true;
            Slider.StartedAt = {
                ThumbBefore: O.getElementCoord(Slider.Thumb)[C.A_AXIS_L],
                RailProgressLength: Slider.RailProgress['offset' + C.A_SIZE_L],
                MainScrollBefore: Math.ceil(R.Main['scroll' + C.L_OOBL_L]) // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            };
            Slider.StartedAt.Coord = BibiEvent.target == Slider.Thumb ? BibiEvent.Coord[C.A_AXIS_L] : Slider.StartedAt.ThumbBefore + Slider.Thumb.Length / 2; // ← ? <Move Thumb naturally> : <Bring Thumb's center to the touched coord at the next pointer moving>
            O.HTML.classList.add('slider-sliding');
            Slider.onTouchUpdate(BibiEvent);
            E.add('bibi:moved-pointer', Slider.onTouchMove);
        },
        onTouchUpdate: (BibiEvent) => {
            Slider.LastEvent = BibiEvent;
            const TouchingCoord = BibiEvent.Coord[C.A_AXIS_L];
            Slider.progressTemporarily(TouchingCoord);
            if(S['flip-pages-during-sliding']) Slider.flipPagesDuringSliding(TouchingCoord);
        },
            progressTemporarily: (TouchingCoord) => {
                const Translation = sML.limitMinMax(TouchingCoord - Slider.StartedAt.Coord,
                    Slider.Edgebar.Before -  Slider.StartedAt.ThumbBefore,
                    Slider.Edgebar.After  - (Slider.StartedAt.ThumbBefore + Slider.Thumb.Length)
                );
                sML.style(Slider.Thumb,        { transform: 'translate' + C.A_AXIS_L + '(' + Translation + 'px)' });
                sML.style(Slider.RailProgress, { [C.A_SIZE_l]: (Slider.StartedAt.RailProgressLength + Translation * (S.ARD == 'rtl' ? -1 : 1)) + 'px' });
            },
            flipPagesDuringSliding: (TouchingCoord) => {
                R.DoNotTurn = true; Slider.flip(TouchingCoord);
                clearTimeout(Slider.Timer_flipPagesDuringSliding);
                Slider.Timer_flipPagesDuringSliding = setTimeout(() => { R.DoNotTurn = false; Slider.flip(TouchingCoord, 'TURN-FORCE'); }, 333);
            },
        onTouchMove: (BibiEvent) => {
            if(BibiEvent.buttons === 0) return Slider.onTouchEnd(Slider.LastEvent);
            Slider.onTouchUpdate(BibiEvent);
        },
        onTouchEnd: (BibiEvent) => {
            if(!Slider.Touching) return;
            clearTimeout(Slider.Timer_flipPagesDuringSliding);
            Slider.Touching = false;
            E.remove('bibi:moved-pointer', Slider.onTouchMove);
            const TouchEndCoord = BibiEvent.Coord[C.A_AXIS_L];
            if(TouchEndCoord == Slider.StartedAt.Coord) Slider.StartedAt.Coord = Slider.StartedAt.ThumbBefore + Slider.Thumb.Length / 2;
            R.DoNotTurn = false;
            Slider.flip(TouchEndCoord, 'TURN-FORCE').then(() => {
                sML.style(Slider.Thumb,        { transform: '' });
                sML.style(Slider.RailProgress, { [C.A_SIZE_l]: '' });
                Slider.progress();
                if(!S['manualize-adding-histories']) I.History.add({ UI: Slider, SumUp: false, Destination: null });
            });
            delete Slider.StartedAt;
            delete Slider.LastEvent;
            Slider.Timer_onTouchEnd = setTimeout(() => O.HTML.classList.remove('slider-sliding'), 123);
        },
        flip: (TouchedCoord, TurnForce) => new Promise(resolve => { switch(S.RVM) {
            case 'paged':
                const TargetPage = Slider.getPointedPage(TouchedCoord);
                return I.PageObserver.Current.Pages.includes(TargetPage) ? resolve() : R.focusOn(TargetPage, { Duration: 0 }).then(() => resolve());
            default:
                R.Main['scroll' + C.L_OOBL_L] = Slider.StartedAt.MainScrollBefore + (TouchedCoord - Slider.StartedAt.Coord) * (Slider.MainLength / Slider.Edgebar.Length);
                return resolve();
        } }).then(() => {
            if(TurnForce) I.Turner.turnItems();
        }),
        progress: () => {
            if(Slider.Touching) return;
            let MainScrollBefore = Math.ceil(R.Main['scroll' + C.L_OOBL_L]); // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            if(S.ARA != S.SLA && S.ARD == 'rtl') MainScrollBefore = Slider.MainLength - MainScrollBefore - R.Main.offsetHeight; // <- Paged (HorizontalAppearance) && VerticalText
            switch(S.ARA) {
                case 'horizontal': Slider.Thumb.style.top  = '', Slider.RailProgress.style.height = ''; break;
                case   'vertical': Slider.Thumb.style.left = '', Slider.RailProgress.style.width  = ''; break;
            }
            Slider.Thumb.style[C.A_OOBL_l] = (MainScrollBefore / Slider.MainLength * 100) + '%';
            Slider.RailProgress.style[C.A_SIZE_l] = Slider.getRailProgressLength(O.getElementCoord(Slider.Thumb)[C.A_AXIS_L] - Slider.RailGroove.Before) / Slider.RailGroove.Length * 100 + '%';
        },
        getRailProgressLength: (_) => (Slider.getRailProgressLength = Slider.RailProgressMode == 'center' ? // switch and define at the first call.
            (ThumbBeforeInRailGroove) => S.ARD != 'rtl' ? ThumbBeforeInRailGroove + Slider.Thumb.Length / 2 : Slider.RailGroove.Length - (ThumbBeforeInRailGroove + Slider.Thumb.Length / 2) :
            (ThumbBeforeInRailGroove) => S.ARD != 'rtl' ? ThumbBeforeInRailGroove + Slider.Thumb.Length     : Slider.RailGroove.Length -  ThumbBeforeInRailGroove
        )(_),
        getPointedPage: (PointedCoord) => {
            let RatioInSlider = (PointedCoord - Slider.Edgebar.Before) / Slider.Edgebar['offset' + C.A_SIZE_L];
            const OriginPageIndex = sML.limitMinMax(Math.round(R.Pages.length * (S.ARD == 'rtl' ? 1 - RatioInSlider : RatioInSlider)), 0, R.Pages.length - 1);
            const PointedCoordInBook = R.Main['scroll' + C.L_SIZE_L] * (S.ARD == 'rtl' && S.SLD == 'ttb' ? 1 - RatioInSlider : RatioInSlider);
            let ThePage = R.Pages[OriginPageIndex], MinDist = Slider.getPageDistanceFromPoint(ThePage, PointedCoordInBook);
            [-1, 1].forEach(PM => { for(let i = OriginPageIndex + PM; R.Pages[i]; i += PM) {
                const Page = R.Pages[i], Dist = Slider.getPageDistanceFromPoint(Page, PointedCoordInBook);
                if(Dist < MinDist) ThePage = Page, MinDist = Dist; else break;
            } });
            return ThePage;
        },
        getPageDistanceFromPoint: (Page, PointedCoordInBook) => {
            return Math.abs(PointedCoordInBook - (O.getElementCoord(Page, R.Main)[C.L_AXIS_L] + Page['offset' + C.L_SIZE_L] * 0.5));
        }
    }));
    Slider.initialize();
    I.setToggleAction(Slider, {
        onopened: () => {
            O.HTML.classList.add('slider-opened');
            setTimeout(Slider.resetUISize, 0);
            E.dispatch('bibi:opened-slider');
        },
        onclosed: () => {
            new Promise(resolve => setTimeout(resolve, S['zoom-out-for-utilities'] ? 111 : 0));
            O.HTML.classList.remove('slider-opened');
            setTimeout(Slider.resetUISize, 0);
            E.dispatch('bibi:closed-slider');
        }
    });
    E.add('bibi:commands:open-slider',   Slider.open);
    E.add('bibi:commands:close-slider',  Slider.close);
    E.add('bibi:commands:toggle-slider', Slider.toggle);
    E.add('bibi:opens-utilities',   Opt => E.dispatch('bibi:commands:open-slider',   Opt));
    E.add('bibi:closes-utilities',  Opt => E.dispatch('bibi:commands:close-slider',  Opt));
    E.add('bibi:loaded-item', Item => Item.HTML.addEventListener(E['pointerup'], Slider.onTouchEnd));
    E.add('bibi:opened', () => {
        E.add('bibi:downed-pointer', BibiEvent => [Slider.Edgebar, Slider.Thumb].includes(BibiEvent.target) ? Slider.onTouchStart(BibiEvent) : false);
        //Slider.Edgebar.addEventListener(E['pointerdown'], Slider.onTouchStart);
        //Slider.Thumb.addEventListener(E['pointerdown'], Slider.onTouchStart);
        E.add('bibi:upped-pointer', BibiEvent => Slider.onTouchEnd(BibiEvent));
        //O.HTML.addEventListener(E['pointerup'], Slider.onTouchEnd);
        //if(Slider.History) Slider.History.Button.addEventListener(E['pointerup'], Slider.onTouchEnd);
        E.add(['bibi:keeps-scrolling', 'bibi:scrolled'], Slider.progress);
        Slider.progress();
    });
    E.add(['bibi:opened-slider', 'bibi:closed-slider', 'bibi:laid-out'], () => {
        Slider.resetUISize();
        Slider.progress();
    });
    { // Optimize to Scrollbar Size
        const _S = 'div#bibi-slider', _TB = '-thumb:before';
        const _HS = 'html.appearance-horizontal ' + _S, _HSTB = _HS + _TB, _SH = O.Scrollbars.Height, _STH = Math.ceil(_SH / 2);
        const _VS = 'html.appearance-vertical '   + _S, _VSTB = _VS + _TB, _SW = O.Scrollbars.Width,  _STW = Math.ceil(_SW / 2);
        const _getSliderThumbOffsetStyle = (Offset) => ['top', 'right', 'bottom', 'left'].reduce((Style, Dir) => Style + Dir + ': ' + (Offset * -1) + 'px; ', '').trim();
        sML.appendCSSRule(_HS, 'height: ' + _SH + 'px;');  sML.appendCSSRule(_HSTB, _getSliderThumbOffsetStyle(_STH) + ' border-radius: ' + (_STH / 2) + 'px; min-width: '  + _STH + 'px;');
        sML.appendCSSRule(_VS, 'width: '  + _SW + 'px;');  sML.appendCSSRule(_VSTB, _getSliderThumbOffsetStyle(_STW) + ' border-radius: ' + (_STW / 2) + 'px; min-height: ' + _STW + 'px;');
    }
    E.dispatch('bibi:created-slider');
}};


I.BookmarkManager = { create: () => { if(!S['use-bookmarks']) return;
    const BookmarkManager = I.BookmarkManager = {
        Bookmarks: [],
        initialize: () => {
            if(S['use-bookmark-ui']) {
                BookmarkManager.Subpanel = I.createSubpanel({
                    Opener: I.Menu.L.addButtonGroup({/* Lively: true, */ id: 'bibi-buttongroup_bookmarks' }).addButton({
                        Type: 'toggle',
                        Labels: {
                            default: { default: `Manage Bookmarks`,     ja: `しおりメニューを開く` },
                            active:  { default: `Close Bookmarks Menu`, ja: `しおりメニューを閉じる` }
                        },
                        Icon: `<span class="bibi-icon bibi-icon-manage-bookmarks"></span>`,
                        Help: true
                    }),
                    Position: 'left',
                    id: 'bibi-subpanel_bookmarks',
                    updateBookmarks: () => BookmarkManager.update({}),
                    onopened: () => { E.add(   'bibi:scrolled', BookmarkManager.Subpanel.updateBookmarks); BookmarkManager.Subpanel.updateBookmarks(); },
                    onclosed: () => { E.remove('bibi:scrolled', BookmarkManager.Subpanel.updateBookmarks); }
                });
                BookmarkManager.ButtonGroup = BookmarkManager.Subpanel.addSection({
                    id: 'bibi-subpanel-section_bookmarks',
                    Labels: { default: { default: `Bookmarks`, ja: `しおり` } }
                }).addButtonGroup();
                E.add('bibi:opened', BookmarkManager.Subpanel.updateBookmarks);
                if(!I.Oven.Flame) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
                E.add('bibi:quenched-oven', () => {
                    BookmarkManager.Subpanel.close();
                    BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
                });
                E.add('bibi:realized-oven', () => {
                    BookmarkManager.load();
                    BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = '';
                });
            }
            BookmarkManager.load();
            delete BookmarkManager.initialize;
        },
        load: () => {
            const BookmarkBiscuits = I.Oven.Biscuits.remember('Book', 'Bookmarks');
            if(Array.isArray(BookmarkBiscuits) && BookmarkBiscuits.length) BookmarkManager.Bookmarks = BookmarkBiscuits;
            else if(S['use-bookmark-ui']) if(!L.Opened) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
        },
        exists: (Bookmark) => {
            const BookmarkPage = R.getPageStartsWithP(Bookmark.P);
            if(BookmarkPage) for(let l = BookmarkManager.Bookmarks.length, i = 0; i < l; i++) if(R.getPageStartsWithP(BookmarkManager.Bookmarks[i].P) == BookmarkPage) return BookmarkManager.Bookmarks[i];
            return null;
        },
        add: (Bookmark) => {
            if(BookmarkManager.exists(Bookmark)) return BookmarkManager.update();
            Bookmark.IsHot = true;
            BookmarkManager.Bookmarks.push(Bookmark);
            BookmarkManager.update({ Added: Bookmark });
        },
        remove: (Bookmark) => {
            BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => Bmk.P != Bookmark.P);
            BookmarkManager.update({ Removed: Bookmark });
        },
        update: (Opt = {}) => {
            if(S['use-bookmark-ui']) {
                if(I.Oven.Flame) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = '';
                if(BookmarkManager.ButtonGroup.Buttons) {
                    BookmarkManager.ButtonGroup.Buttons = [];
                    BookmarkManager.ButtonGroup.innerHTML = '';
                }
            }
            //BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => typeof Bmk.IIPP == 'number' && typeof Bmk['%'] == 'number');
            let Bookmarks = [], ExistingBookmarks = [];
            if(Array.isArray(Opt.Bookmarks)) BookmarkManager.Bookmarks = Opt.Bookmarks;
            if(Opt.Added) Bookmarks = [Opt.Added];
            else if(L.Opened) {
                I.PageObserver.updateCurrent();
                Bookmarks = I.PageObserver.Current.Pages.map(Page => ({
                    P: R.getP({ Page: Page }),
                    '%': Math.floor((Page.Index + 1) / R.Pages.length * 100) // only for showing percentage in waiting status
                }));
            }
            if(BookmarkManager.Bookmarks.length) {
                const UpdatedBookmarks = []
                for(let l = BookmarkManager.Bookmarks.length, i = 0; i < l; i++) {
                    let Bmk = BookmarkManager.Bookmarks[i];
                    if(typeof Bmk != 'object' || !Bmk || typeof Bmk.P != 'string') continue;
                    if(/^(\d*\.)?\d+?$/.test(Bmk['%'])) Bmk['%'] *= 1; else delete Bmk['%'];
                    let Label = '', ClassName = '';
                    const BB = 'bibi-bookmark';
                    let Page = L.Opened ? R.getPageStartsWithP(Bmk.P) : null;
                    const PageNumber = Page?.IsPage ? Page.Index + 1 : Bmk.P.split('.')[0] * 1;
                    if(PageNumber) {
                        Label += `<span class="${BB}-page"><span class="${BB}-unit">P.</span><span class="${BB}-number">${ PageNumber }</span></span>`;
                        if(R.Pages.length) {
                            if(PageNumber > R.Pages.length) continue;
                            Label += `<span class="${BB}-total-pages">/<span class="${BB}-number">${ R.Pages.length }</span></span>`;
                            Bmk['%'] = Math.floor(PageNumber / R.Pages.length * 100);
                        }
                    }
                    if(typeof Bmk['%'] == 'number') {
                        if(Label) Label += ` <span class="${BB}-percent"><span class="${BB}-parenthesis">(</span><span class="${BB}-number">${ Bmk['%'] }</span><span class="${BB}-unit">%</span><span class="${BB}-parenthesis">)</span></span>`;
                        else      Label +=  `<span class="${BB}-percent">` +                                    `<span class="${BB}-number">${ Bmk['%'] }</span><span class="${BB}-unit">%</span>`                                    + `</span>`;
                    }
                    const Labels = Label ? { default: { default: Label, ja: Label } } : { default: { default: `Bookmark #${ UpdatedBookmarks.length + 1 }`, ja: `しおり #${ UpdatedBookmarks.length + 1 }` } };
                    if(L.Opened && Bookmarks.reduce((Exists, Bookmark) => Exists = R.getPageStartsWithP(Bmk.P) == R.getPageStartsWithP(Bookmark.P) ? true : Exists, false)) {
                        ExistingBookmarks.push(Bmk);
                        ClassName = `bibi-button-bookmark-is-current`;
                        Labels.default.default += ` <span class="${BB}-is-current"></span>`;
                        Labels.default.ja      += ` <span class="${BB}-is-current ${BB}-is-current-ja"></span>`;
                    }
                    if(S['use-bookmark-ui']) {
                        const Button = BookmarkManager.ButtonGroup.addButton({
                            className: ClassName,
                            Type: 'normal',
                            Labels: Labels,
                            Icon: `<span class="bibi-icon bibi-icon-bookmark bibi-icon-a-bookmark"></span>`,
                            Bookmark: Bmk,
                            action: () => {
                                if(L.Opened) return R.focusOn(Bmk).then(Destination => {
                                    if(!S['manualize-adding-histories']) I.History.add({ UI: BookmarkManager, SumUp: false/*true*/, Destination: Destination });
                                    return Destination;
                                });
                                if(!L.Waiting) return false;
                                if(S['start-in-new-window']) return L.openNewWindow(location.href + (location.hash ? '&' : '#') + 'jo(p=' + Bmk.P + ')');
                                R.StartOn = Bmk;
                                L.play();
                            },
                            remove: () => BookmarkManager.remove(Bmk)
                        });
                        const Remover = Button.appendChild(sML.create('span', { className: 'bibi-remove-bookmark', title: 'しおりを削除' }));
                        I.setFeedback(Remover, { StopPropagation: true });
                        E.add(Remover, 'bibi:singletapped', () => Button.remove());
                        Remover.addEventListener(E['pointer-over'], Eve => Eve.stopPropagation());
                        if(Bmk.IsHot) {
                            delete Bmk.IsHot;
                            I.setUIState(Button, 'active'); setTimeout(() => I.setUIState(Button, ExistingBookmarks.includes(Bmk) ? 'disabled' : 'default'), 234);
                        }
                        else if(ExistingBookmarks.includes(Bmk)) I.setUIState(Button, 'disabled');
                        else                                     I.setUIState(Button,  'default');
                    }
                    const UpdatedBookmark = { IsBookmark: true, P: Bmk.P };
                    if(Bmk['%']) UpdatedBookmark['%'] = Bmk['%'];
                    UpdatedBookmarks.push(UpdatedBookmark);
                }
                BookmarkManager.Bookmarks = UpdatedBookmarks;
            } else {
                if(S['use-bookmark-ui']) {
                    if(!L.Opened) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
                    E.add('bibi:quenched-oven', () => BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none');
                    E.add('bibi:realized-oven', () => BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = '');
                }
            }
            if(S['use-bookmark-ui']) {
                if(BookmarkManager.Bookmarks.length < S['max-bookmarks']) {
                    BookmarkManager.AddButton = BookmarkManager.ButtonGroup.addButton({
                        id: 'bibi-button-add-a-bookmark',
                        Type: 'normal',
                        Labels: { default: { default: `Add a Bookmark to Current Page`, ja: `現在のページにしおりを挟む` } },
                        Icon: `<span class="bibi-icon bibi-icon-bookmark bibi-icon-add-a-bookmark"></span>`,
                        action: () => Bookmarks.length ? BookmarkManager.add(Bookmarks[0]) : false
                    });
                    if(!Bookmarks.length || ExistingBookmarks.length) {
                        I.setUIState(BookmarkManager.AddButton, 'disabled');
                    }
                }
            }
            BookmarkManager.Bookmarks.length ? I.Oven.Biscuits.memorize('Book', { Bookmarks: BookmarkManager.Bookmarks }) : I.Oven.Biscuits.forget('Book', 'Bookmarks');
            /**/            E.dispatch('bibi:updated-bookmarks', BookmarkManager.Bookmarks);
            if(Opt.Added)   E.dispatch(  'bibi:added-bookmark',  BookmarkManager.Bookmarks);
            if(Opt.Removed) E.dispatch('bibi:removed-bookmark',  BookmarkManager.Bookmarks);
        },
    };
    BookmarkManager.initialize();
    E.dispatch('bibi:created-bookmark-manager');
}};


I.Footnotes = { create: () => { if(!S['use-popup-footnotes']) return I.Footnotes = null;
    const Footnotes = I.Footnotes = {
        OpenedFoontnotes: [],
        _trimBrackets: (Str) => Str.trim().replace(/^[\(\{\[（｛［〔〈《｟【「『]+|[\)\}\]）｝］〕〉》｠】」』]+$/g, '').trim(),
        _trimMarkers:  (Str) => Str.trim().replace(/^[\*＊※†]+|[\*＊※†]+$/, '').trim(),
        _trimBracketsAndMarkers: (Str) => Footnotes._trimMarkers(Footnotes._trimBrackets(Str)),
        _zen2han: (Str) => Str.replace(/[ａ-ｚＡ-Ｚ０-９]/g, (_M) => String.fromCharCode(_M.charCodeAt(0) - 0xFEE0)),
        initialize: () => {
            const escapeSC = (Str) => Str.replace(/([\(\{\[\*])/g, '\\$1');
            const BracketsO = escapeSC('({[（｛［〔〈《｟【「『');
            const BracketsC = escapeSC(')}]）｝］〕〉》｠】」』');
            const  Markers  = escapeSC('*＊※†');
            const BracketsRE = new RegExp('^[' + BracketsO + ']+|[' + BracketsC + ']+$', 'g');
            const  MarkersRE = new RegExp('^[' +  Markers  + ']+|[' +  Markers  + ']+$', 'g');
            Footnotes.trimBrackets = (Str) => Str.trim().replace(BracketsRE, '').trim();
            Footnotes.trimMarkers  = (Str) => Str.trim().replace( MarkersRE, '').trim();
            Footnotes.trimBracketsAndMarkers = (Str) => Footnotes.trimMarkers(Footnotes.trimBrackets(Str));
            const hatch = (Dest) => {
                if(!Dest) return null;
                if(!Dest.Element && Dest.ElementSelector) {
                    if(Dest.ItemIndex) Dest.Item = R.Items[Dest.ItemIndex], delete Dest.ItemIndex;
                    if(Dest.Item) {
                        Dest.Element = Dest.Item.contentDocument.querySelector(Dest.ElementSelector), delete Dest.ElementSelector;
                        if(!Dest.Element || Dest.Element.nodeType != 1) delete Dest.Element;
                    }
                }
                return Dest;
            };
            const setFootnoteElement = (A, FnEle) => {
                A.IsNoteRef = true, FnEle.IsFootnote = true;
                A.FootnoteElement = FnEle;
                if(!FnEle.NoteRefs) FnEle.NoteRefs = [];
                FnEle.NoteRef = A;
            };
            E.bind('bibi:loaded-book', () => R.Items.forEach(Item => {
                Item.Body.querySelectorAll('a[href*="#"]').forEach(BaseA => {
                    const BaseDest = hatch(BaseA.Destination);
                    if(!BaseDest || !BaseDest.Element || !BaseDest.Element.innerHTML) return;
                    if(BaseA.getAttribute('epub:type') == 'noteref' || BaseDest.Element.getAttribute('epub:type') == 'footnote') setFootnoteElement(BaseA, BaseDest.Element);
                    if(BaseA.ReturningTo) return;
                    const BackACandidates = BaseDest.Element.tagName.toUpperCase() == 'A' ? [BaseDest.Element] : BaseDest.Element.getElementsByTagName('a');
                    if(!BackACandidates.length) return;
                    let BackA = null, BackDest = null;
                    for(let l = BackACandidates.length, i = 0; i < l; i++) { const BackACandidate = BackACandidates[i];
                        BackDest = hatch(BackACandidate.Destination);
                        if(!BackDest || !BackDest.Element) continue;
                        if(BackDest.Element.contains(BaseA)) { BackA = BackACandidate; break; }
                    }
                    if(BackA) {
                        BaseA.ForwardingTo = BackA;
                        BackA.ReturningTo  = BaseA;
                        if(BaseA.FootnoteElement) return;
                        if(Footnotes._trimBracketsAndMarkers(BaseA.textContent) == Footnotes._trimBracketsAndMarkers(BackA.textContent)) {
                            BaseA.Pair = BackA, BackA.Pair = BaseA;
                            if(BaseDest.Element.closest('h1,h2,h3,h4,h5,h6')) return;
                            let FnEle_JIP = BaseDest.Element.closest('p,li,dt,figure');
                            if(!FnEle_JIP) {
                                FnEle_JIP = BaseDest.Element.closest('div,section,article,aside,body,html');
                                if(!FnEle_JIP || FnEle_JIP.textContent.length > 800) return;
                            }
                            BaseA.FootnoteElement_JustInPossibility = FnEle_JIP;
                        }
                    }
                });
            }));
        },
        detectFootnoteElement: (BaseA) => {
            if(BaseA.FootnoteElement) return BaseA.FootnoteElement;
            if(!BaseA.ForwardingTo || !BaseA.FootnoteElement_JustInPossibility) return null;
            const FnEle_JIP = BaseA.FootnoteElement_JustInPossibility, Clone = FnEle_JIP.cloneNode('DEEP');
            const CloneAs = Clone.querySelectorAll('a[href*="#"]');
            FnEle_JIP.querySelectorAll('a[href*="#"]').forEach((A, i) => A.Pair ? CloneAs[i].remove() : A);
            return Clone.textContent.trim() ? FnEle_JIP : null;
        },
        show: (A) => { // must returns true/false
            if(A.FootnoteElement === undefined) A.FootnoteElement = Footnotes.detectFootnoteElement(A);
            if(!A.FootnoteElement) return false;
            // if(I.PageObserver.Current.Pages.includes(R.dest(A.FootnoteElement).Page)) return false; // return true;
            for(let i = 0; i < Footnotes.OpenedFoontnotes.length; i++) if(Footnotes.OpenedFoontnotes[i].For == A.FootnoteElement) return true;
            Footnotes.make(A).open();
            return true;
        },
        make: (A) => {
            // Layer
            const Layer  = sML.create('div', { className: 'bibi-footnote', For: A.FootnoteElement,
                open: () => {
                    E.dispatch('bibi:is-going-to:opens-footnote', Layer);
                    Layer.check();
                    E.add('bibi:changed-intersection', Layer.onIntersectionChange);
                    Footnotes.hideAll();
                    Footnotes.OpenedFoontnotes.push(document.body.appendChild(Layer));
                    O.HTML.classList.add('footnote-opened');
                    setTimeout(() => {
                        Layer.classList.add('opened');
                        E.dispatch('bibi:opened-footnote', Layer);
                    }, 0);
                },
                close: () => {
                    E.dispatch('bibi:is-going-to:closes-footnote', Layer);
                    E.remove('bibi:changed-intersection', Layer.check);
                    Footnotes.OpenedFoontnotes = Footnotes.OpenedFoontnotes.filter(Fn => Fn != Layer);
                    Layer.ontransitionend = () => {
                        Layer.ontransitionend = () => undefined;
                        document.body.removeChild(Layer);
                        Layer.innerHTML = '';
                        if(!Footnotes.OpenedFoontnotes.length) O.HTML.classList.remove('footnote-opened');
                        E.dispatch('bibi:closed-footnote', Layer);
                    };
                    setTimeout(() => { Layer.classList.add('closed'); Layer.classList.remove('opened'); }, 0);
                }
            });
            E.add(Layer, ['wheel', 'mousewheel'], Eve => Eve.stopPropagation());
            // Footnote Head
            const FnHead = Layer.appendChild(sML.create('div', { className: 'footnote-head' }));
            FnHead.Heading = FnHead.appendChild(sML.create('div', { className: 'footnote-heading', innerHTML: Footnotes._zen2han(A.innerHTML) }));
            sML.forEach(FnHead.Heading.getElementsByTagName('*'))(Ele => Ele.removeAttribute('style') || Ele.removeAttribute('class'));
            // Footnote Body
            const FnBody = Layer.appendChild(sML.create('div', { className: 'footnote-body', Jumpers: [] }));
            FnBody.Content = FnBody.appendChild(sML.create('div', { className: 'footnote-content', innerHTML: Footnotes._zen2han(A.FootnoteElement.innerHTML), style: { fontFamily: getComputedStyle(A.FootnoteElement).fontFamily } }));
            sML.forEach(FnBody.Content.getElementsByTagName('*'))(Ele => Ele.removeAttribute('style') || Ele.removeAttribute('class'));
            const Imgs = FnBody.Content.querySelectorAll('img');
            A.FootnoteElement.querySelectorAll('img').forEach((Img, i) => (Imgs[i].style.maxWidth = '100%') && (Imgs[i].src = Img.src));
            const escapeDoubledDashes = (Ele) => Ele.childNodes.forEach(CN => { switch(CN.nodeType) { case 1: return escapeDoubledDashes(CN); case 3: CN.textContent = CN.textContent.replace(/(^|[^―])――([^―]|$)/g, '$1--DOUBLED-DASH--$2'); } });
            escapeDoubledDashes(FnBody.Content); FnBody.Content.innerHTML = FnBody.Content.innerHTML.replace(/--DOUBLED-DASH--/g, `<span class="bibi-footnote-content_doubled-dashes"><span>―</span><span>―</span></span>`);
            const FnBC_As = FnBody.Content.getElementsByTagName('a'), OriginalAs = A.FootnoteElement.getElementsByTagName('a');
            for(let l = FnBC_As.length, i = 0; i < l; i++) {
                const FnBC_A = FnBC_As[i], OriginalA = OriginalAs[i];
                if(!OriginalA.jump) return;
                Object.assign(FnBC_A, { Original: OriginalA, Destination: OriginalA.Destination }).addEventListener('click', Eve => {
                    Eve.preventDefault(), Eve.stopPropagation();
                    return FnBC_A.Disabled ? false : OriginalA.jump(Eve, { UI: Footnotes, PreventFootnote: false });
                });
                FnBody.Jumpers.push(FnBC_A);
            }
            // Util
            const Util = Layer.Util = Layer.appendChild(sML.create('ul', { className: 'footnote-utilities' })); 
            (Util.UIs = [
                Util.Jump  = sML.create('span', { action: Eve => A.jump(Eve, { UI: Footnotes, PreventFootnote: true }), Destination: A.Destination }),
                Util.Close = sML.create('span', { action: Eve => Layer.close() })
            ]).forEach(UI => {
                E.add(UI, 'bibi:singletapped', (Eve) => UI.Disabled ? false : UI.action(Eve));
                I.setFeedback(UI, { StopPropagation: true });
                Util.appendChild(sML.create('li')).appendChild(UI);
            });
            // Checker
            Layer.check = () => {
                FnBody.Jumpers.concat(Util.UIs).forEach(UI => UI.Destination ? UI.classList.toggle('disabled', UI.Disabled = I.PageObserver.Current.Pages.includes(R.getPage(UI.Destination))) : false);
            };
            Layer.onIntersectionChange = () => {
                Layer.check();
                Layer.close();
            };
            return Layer;
        },
        hideAll: () => Footnotes.OpenedFoontnotes.forEach(Fn => Fn.close())
    };
    Footnotes.initialize();
    // E.add(['bibi:opens-utilities', 'bibi:closes-utilities'], () => Footnotes.hideAll());
    I.Utilities.Checkers.push(() => {
        if(Footnotes.OpenedFoontnotes.length) {
            Footnotes.hideAll();
            return false;
        }
        return true;
    });
}};


I.RangeFinder = { create: () => {
    const RangeFinder = I.RangeFinder = {
        _str: (Str) => typeof Str == 'string' ? Str : Number.isFinite(Str) ? String(Str) : '',
        _opt: (Opt) => {
            if(!Opt || Opt.Flexible) return {};
            const Options = {
                CaseSensitive: true,
                WidthSensitive: true,
                ConvertBreaksTo: ' '
            };
            if(!Opt.Strict) for(const k in Options) if(!Opt[k]) delete Options[k];
            if(typeof Opt.ConvertBreaksTo == 'string' && Opt.ConvertBreaksTo.length == 1) Options.ConvertBreaksTo = Opt.ConvertBreaksTo;
            return Options;
        },
        _flatten: function(Str, Opt = {}) {
            Str = (typeof Opt.ConvertBreaksTo != 'string' || Opt.ConvertBreaksTo.length != 1 || Opt.ConvertBreaksTo == ' ') ?
                Str.replace(/[\r\n\t ]/g, ' ') :
                Str.replace(/[\r\n]/g, Opt.ConvertBreaksTo).replace(/[\t ]/g, ' ');
            if(!Opt.WidthSensitive) Str = Str.replace(/[！＂＃＄％＆＇（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g, (Cha) => String.fromCharCode(Cha.charCodeAt(0) - 0xFEE0)).replace(/・/g, '.');
            if(! Opt.CaseSensitive) Str = Str.toLowerCase();
            return Str;
        },
        _compress: function(Str, Opt) { return this._flatten(Str, this._opt({ Strict: true, ConvertBreaksTo: Opt?.ConvertBreaksTo })).trim().replace(/ +/, ' '); },
        _find: function(TargetNode, Str, Opt, Reversing) {
            Str = this._flatten(Str, Opt); if(!Str) return null;
            let TNode = TargetNode ? TargetNode : document.body; while(TNode.childNodes.length == 1) TNode = TNode.firstChild;
            const TText = this._flatten(TNode.textContent, Opt); if(TText.indexOf(Str) < 0) return null;
            const StrL = Str.length;
            let Edges = [{}, {}];
            if(TNode.nodeType == 3) {
                const StartOffset = !Reversing ? TText.indexOf(Str) : TText.lastIndexOf(Str);
                const EdgePrototype = { Container: TNode, Content: Str, Offsets: [StartOffset, StartOffset + StrL] };
                return Edges.map(Edge => Object.assign(Edge, EdgePrototype));
            } else {
                const CTexts = [];
                for(let CNs = TNode.childNodes, l = CNs.length - 1, i = 0; i <= l; i++) { const CN_i = !Reversing ? i : l - i;
                    const CText = this._flatten(CNs[CN_i].textContent, Opt);
                    if(CText.indexOf(Str) >= 0) return this._find(CNs[CN_i], Str, Opt, Reversing);
                    !Reversing ? CTexts.push(CText) : CTexts.unshift(CText);
                }
                return Edges.map((Edge, Edge_i) => {
                    let Container; switch(Edge_i) {
                        case 0: Container = TNode.firstChild; while(CTexts.slice(1                   ).join('').indexOf(Str) >= 0) CTexts.shift(), Container =     Container.nextSibling; break;
                        case 1: Container =  TNode.lastChild; while(CTexts.slice(0, CTexts.length - 1).join('').indexOf(Str) >= 0) CTexts.pop(),   Container = Container.previousSibling; break;
                    }
                    const CText = this._flatten(Container.textContent, Opt), CTextL = CText.length;
                    let Content = Str; switch(Edge_i) {
                        case 0: if(CTextL < StrL) Content = Content.substring(0,     CTextL); while(CText.lastIndexOf(Content) != CTextL - Content.length) Content = Content.substring(0, Content.length - 1); break;
                        case 1: if(CTextL < StrL) Content = Content.substring(StrL - CTextL); while(    CText.indexOf(Content) != 0                      ) Content = Content.substring(1                    ); break;
                    }
                    while(!Edge.Offsets) Edge = this._find(Container, Content, Opt, !Edge_i)[Edge_i];
                    return Edge;
                });
            }
        },
        searchFromDocument: function(Doc, SearchStrings, SearchOptions) { if(!Doc) Doc = document;
            SearchOptions = this._opt(SearchOptions);
            const SearchResults = [];
            return Promise.all([SearchStrings].flat().map(SStr => new Promise(resolve => {
                SStr = this._str(SStr); if(!SStr) return resolve();
                const MDocF = Doc.createDocumentFragment(), // "M"irror
                      MHTML = MDocF.appendChild(Doc.createElement('html')),
                      MBody = MHTML.appendChild(Doc.importNode(Doc.body, true));
                // const Imgs = MBody.querySelectorAll('img'), ImgsL = Imgs.length, RTPs = MBody.querySelectorAll('rp, rt'), RTPsL = RTPs.length;
                // if(ImgsL) for(let i = 0; i < ImgsL; i++) { const Img = Imgs[i], PN = Img.parentNode; PN.insertBefore(Doc.createElement('ALT'), Img).innerHTML = Img.alt; PN.removeChild(Img); } // for Images: 1/2
                // if(RTPsL) for(let i = 0; i < RTPsL; i++) { const RTP = RTPs[i]; RTP.IsRTP = RTP.tagName.toLowerCase(); RTP.TCL = RTP.textContent.length; RTP.innerHTML = ''; } // - for Rubies: 1/2
                const Imgs = MBody.querySelectorAll('img'   ), ImgsL = Imgs.length;  if(ImgsL) for(let i = 0; i < ImgsL; i++) { const Img = Imgs[i], PN = Img.parentNode; PN.insertBefore(Doc.createElement('ALT'), Img).appendChild(Doc.createTextNode(Img.alt || '')); PN.removeChild(Img); }
                const RTCs = MBody.querySelectorAll('rtc'   ), RTCsL = RTCs.length;  if(RTCsL) for(let i = 0; i < RTCsL; i++) { RTCs[i].innerHTML = ''; } // - for Rubies: 1/2 // ^ for Images: 1/2
                const RTPs = MBody.querySelectorAll('rt, rp'), RTPsL = RTPs.length;  if(RTPsL) for(let i = 0; i < RTPsL; i++) { RTPs[i].innerHTML = ''; } // - for Rubies: 2/2
                const DistilledDocText = this._compress(MBody.textContent, { ConvertBreaksTo: '⏎' }), DistilledSStrL = this._compress(SStr).length;
                let Edges; while(Edges = this._find(MBody, SStr, SearchOptions)) {
                    const Range = Doc.createRange();
                    let Replaced = null;
                    Edges.forEach((Edge, Edge_i) => {
                        let MContainer = Edge.Container, Offsets = Edge.Offsets, CText = MContainer.textContent;
                        if(MContainer != Replaced) (Replaced = MContainer).textContent = CText.substring(0, Offsets[0]) + Edge.Content.replace(/(.|\s)/g, '􏿿') + CText.substring(Offsets[1]); // to: U+10FFFF (PRIVATE USE AREA)
                        // if(RTPsL && Edge_i && CText && Offsets[1] == CText.length) { // for Rubies: 2/2 (RTC not supported)
                        //     let _Node = MContainer; while(_Node != MBody) {
                        //         if(_Node.parentElement.tagName.toLowerCase() != 'ruby') { _Node = _Node.parentElement; continue; }
                        //         let PEle = null, NES = _Node.nextElementSibling;
                        //         if(NES && NES.nodeType == 1 && NES.IsRTP == 'rp')                              NES = NES.nextElementSibling;
                        //         if(NES && NES.nodeType == 1 && NES.IsRTP == 'rt') PEle = NES.TCL ? NES : null, NES = NES.nextElementSibling;
                        //         if(NES && NES.nodeType == 1 && NES.IsRTP == 'rp') PEle = NES.TCL ? NES : null;
                        //         if(PEle) MContainer = PEle.appendChild(Doc.createTextNode('')), Offsets = [0, PEle.TCL];
                        //         break;
                        //     }
                        // }
                        if(ImgsL && MContainer.parentElement.tagName == 'ALT') { // for Images: 2/2
                            const ALT = MContainer.parentElement;
                            MContainer = ALT.parentElement;
                            let ALT_i = 0; while(MContainer.childNodes[ALT_i] != ALT) ALT_i++;
                            Offsets = [ALT_i, ALT_i + 1];
                        }
                        const NodeSteps = []; let _Node = MContainer; while(_Node != MBody) {
                            const PEle = _Node.parentElement;
                            let _Node_i = 0; while(PEle.childNodes[_Node_i] != _Node) _Node_i++;
                            NodeSteps.unshift(_Node_i);
                            _Node = PEle;
                        }
                        let Container = Doc.body; NodeSteps.forEach(NStep => Container = Container.childNodes[NStep]);
                        switch(Edge_i) {
                            case 0: Range.setStart(Container, Offsets[0]); break;
                            case 1:   Range.setEnd(Container, Offsets[1]); break;
                        }
                    });
                    const ResultText_Start = this._compress(MBody.textContent, { ConvertBreaksTo: '⏎' }).indexOf('􏿿');
                    let   TextAround_Start = Math.max(ResultText_Start -  9, 0);
                    const TextAround_End   = Math.min(TextAround_Start + 69, DistilledDocText.length);
                          TextAround_Start = Math.max(TextAround_End   - 69, 0);
                    const ResultText_End   = Math.min(ResultText_Start + DistilledSStrL, TextAround_End);
                    const Break = `<span class="break"> </span>`;
                    SearchResults.push({
                        Index: SearchResults.length, // IndexInDocument
                        Document: Doc,
                        Range: Range,
                        TextAround: [
                            TextAround_Start > 0 ? '...' : '',
                            DistilledDocText.substring(TextAround_Start, ResultText_Start).replace(/^⏎+/g, '').replace(/⏎+/g, Break),
                            DistilledDocText.substring(ResultText_Start, ResultText_End  ).replace(                    /⏎+/g, Break),
                            DistilledDocText.substring(ResultText_End,   TextAround_End  ).replace(/⏎+$/g, '').replace(/⏎+/g, Break),
                            TextAround_End < DistilledDocText.length ? '...' : ''
                        ],
                        focus: () => this.Search.Results
                    });
                    Edges.forEach(Edge => Edge.Container.textContent = Edge.Container.textContent.replace(/􏿿/g, '​')); // from: U+10FFFF (PRIVATE USE AREA) / to: U+200B (ZERO WIDTH SPACE)
                }
                resolve();
            }))).then(() => SearchResults.sort((_A, _B) => _A.Range.compareBoundaryPoints(Range.START_TO_START, _B.Range) || _A.Range.compareBoundaryPoints(Range.END_TO_END, _B.Range)));
        },
        searchFromBook: function(SearchStrings, SearchOptions) {
            SearchStrings = SearchStrings.Formatted || SearchStrings;
            const SearchResults = [];
            return Promise.all(
                R.Items.map((Item, i) => Item.Loaded ? this.searchFromDocument(Item.contentDocument, SearchStrings, SearchOptions).then(ItemSearchResults => SearchResults[i] = ItemSearchResults) : null)
            )   .then(() => SearchResults.flat().map((SRes, i) => (SRes.Item = SRes.Document.body.Item, SRes.IndexInItem = SRes.Index, SRes.Index = i, SRes)));
        },
        search: function(SearchStrings, SearchOptions_BehaviorOptions) {
            this.searching(false);
            const NewSearch = this.newSearch(SearchStrings, SearchOptions_BehaviorOptions), SearchStringsF = NewSearch.Strings.Formatted;
            const BehaviorOptions = { Focus: true }; for(const k in BehaviorOptions) if(SearchOptions_BehaviorOptions[k] !== undefined) BehaviorOptions[k] = SearchOptions_BehaviorOptions[k];
            return new Promise((resolve, reject) => {
                if(!SearchStringsF.length) return this.resetSearch() && reject();
                E.dispatch('bibi:is-going-to:search', NewSearch);
                if(this.isSameSearch(NewSearch, this.Search)) return this.updateSearch({ Strings: NewSearch.Strings, Options: NewSearch.Options }) && resolve();
                this.updateSearch({ Strings: NewSearch.Strings, Options: NewSearch.Options, Results: [] });
                const Times = SearchStringsF[0].length == 1 ? [0, 99] : [99, 0];
                this.searching(true, Times[0]);
                setTimeout(() => this.searchFromBook(NewSearch.Strings, NewSearch.Options).then(SearchResults => {
                    this.updateSearch({ Results: SearchResults });
                    resolve();
                }), Times[1]);
            })  .then(() => {
                    const SearchResults = this.Search.Results;
                    if(SearchResults.length) switch(BehaviorOptions.Focus) {
                        case true: case 'auto'        : return this.autofocusOnTheSearchResult();
                                   case 'auto-reverse': return this.autofocusOnTheSearchResult({ Reverse: true });
                                   case 'first'       : return this.setSearchResultFocusTo(0);
                                   case  'last'       : return this.setSearchResultFocusTo(SearchResults.length - 1);
                    }
                    const SearchResultF = SearchResults.Focused;
                    if(SearchResultF) {
                        this.paint(SearchResultF.Range, { Emphasized: false });
                        SearchResults.Focused = null;
                        this.updateSearch();
                    }
                    return Promise.resolve();
                })
                .then(() => E.dispatch('bibi:searched', this.Search))
                .catch(() => Promise.resolve())
                .then(() => this.searching(false) || this.Search);
        },
        initializeSearch: function() {
            if(!this.Search) this.Search = {};
            Object.assign(this.Search, { Strings: [], Options: {}, Results: [] });
        },
        resetSearch: function(Updates) {
            this.initializeSearch();
            this.removeAllPaints();
            return this.updateSearch(Updates);
        },
        updateSearch: function(Updates) {
            const _S = this.Search;
            if(Updates) Object.keys(_S).forEach(k => {
                const _SData = _S[k], UdData = Updates[k];
                if(UdData === undefined || UdData === _SData) return;
                _S[k] = UdData;
                if(k == 'Results') {
                    this.removeAllPaints();
                    const SearchResults = this.Search.Results;
                    if(SearchResults.length) SearchResults.forEach(SearchResult => this.paint(SearchResult.Range));
                    SearchResults.Focused       = null;
                }
            });
            E.dispatch('bibi:updated-search-status', _S);
            return _S;
        },
        searching: function(TF, Time) {
            clearTimeout(this.Timer_searchingHard);
            if(TF) { this.Timer_searchingHard = setTimeout(() => {
                O.Busy = true;
                O.HTML.classList.add('searching-hard');
                O.HTML.classList.add('busy');
            }, Time); } else {
                O.HTML.classList.remove('busy');
                O.HTML.classList.remove('searching-hard');
                O.Busy = false;
            }
        },
        isSameSearch: function(Search_A, Search_B) {
            try {
                const SOpts_A = Search_A.Options, SOpts_B = Search_B.Options; for(const k in Object.assign({}, SOpts_A, SOpts_B)) if(SOpts_A[k] !== SOpts_B[k]) return false;
                return (Search_A.Strings.Formatted.join('<OR>') == Search_B.Strings.Formatted.join('<OR>'));
            } catch(Err) { return false; }
        },
        newSearch: function(SearchStrings, SearchOptions) {
            SearchOptions = this._opt(SearchOptions);
            SearchStrings = [...new Set([SearchStrings].flat().reduce((SStrs, SStr) => (SStr = this._str(SStr).replace(/<OR>/g, '').replace(/^\s+$/g, '')) ? (SStrs.push(SStr), SStrs) : SStrs, []))];
            SearchStrings.Formatted = [...new Set(SearchStrings.map(SStr => this._flatten(SStr, SearchOptions)))].sort((_A, _B) => _A.length - _B.length || (_A <= _B ? -1 : 1));
            return { Strings: SearchStrings, Options: SearchOptions, Results: [] };
        },
        focusOn: function(Ran) {
            const FocusedRange = this.FocusedRange;
            if(Ran != FocusedRange) {
                if(FocusedRange) this.paint(FocusedRange, { Emphasized: false });
                this.paint(Ran, { Emphasized: true });
                this.FocusedRange = Ran;
            }
            const Page = R.dest(Ran).Page;
            return I.PageObserver.Current.Pages.includes(Page) ? Promise.resolve() : R.focusOn(Page).then(() => this.reserveRepainting(999));
        },
        setSearchResultFocusTo: function(SRoI /* SearchResult-or-Index: Index is better than SearchResult. */) {
            const SearchResults = this.Search.Results; /**/ if(!SearchResults.length) return Promise.resolve();
            const SearchResult  = Number.isInteger(SRoI) ? SearchResults[SRoI] : SearchResults.includes(SRoI) ? SRoI : null; /**/ if(!SearchResult) return Promise.resolve();
            if(SearchResult != SearchResults.Focused) {
                SearchResults.Focused = SearchResult;
                this.updateSearch();
            }
            return this.focusOn(SearchResult.Range);
        },
        changeSearchResultFocusBy: function(Dist) {      /**/ if(!Number.isInteger(Dist) || !Dist) return Promise.resolve();
            const SearchResults = this.Search.Results;   /**/ if(!SearchResults.length)            return Promise.resolve();
            const SearchResultF = SearchResults.Focused; /**/ if(!SearchResultF)                   return Promise.resolve();
            const Index = (SearchResultF.Index + Dist) % SearchResults.length;
            return this.setSearchResultFocusTo(Index < 0 ? SearchResults.length + Index : Index);
        },
        autofocusOnTheSearchResult: function(Opt) {
            const SearchResults = this.Search.Results; /**/ if(!SearchResults.length) return Promise.resolve();
            const SearchResultF = SearchResults.Focused;
            if(!Opt) Opt = {};
            if(SearchResultF && I.PageObserver.Current.Pages.includes(R.dest(SearchResultF.Range).Page)) return this.changeSearchResultFocusBy(Opt.Reverse ? -1 : 1);
            const NextResultIndex = this.getNearestSearchResultIndex();
            return this.setSearchResultFocusTo(!Opt.Reverse || I.PageObserver.Current.Pages.includes(R.dest(SearchResults[NextResultIndex].Range).Page) ? NextResultIndex : this.getNearestSearchResultIndex({ Reverse: true }));
        },
        getNearestSearchResultIndex: function(Opt) {
            const SearchResults = this.Search.Results; /**/ if(!SearchResults.length) return NaN;
            if(SearchResults.length == 1) return 0;
            if(!Opt) Opt = {};
            let Dir, iStart, CP;
            if(!Opt.Reverse) Dir =  1, iStart = 0,                        CP = I.PageObserver.Current.Pages[0];
            else             Dir = -1, iStart = SearchResults.length - 1, CP = I.PageObserver.Current.Pages.slice(-1)[0];
            const CII = CP.Item.Index, CPI = CP.Index;
            for(let i = iStart; SearchResults[i]; i += Dir) { const Ran = SearchResults[i].Range;
                if(Ran.startContainer.ownerDocument.body.Item.Index * Dir < CII * Dir || R.dest(Ran).Page.Index * Dir < CPI * Dir) continue;
                return i;
            } return iStart;
        },
        paint: function(RoP /* Range-or-Paint */, Spec) {
            let IsNew, Paint, Ran, Doc, Item;
            if(RoP.nodeType === 1) {
                Paint = RoP;
            } else if(RoP.startContainer) {
                Ran = RoP, Doc = Ran.startContainer.ownerDocument, Item = Doc.body.Item;
                if(Item.Paints) for(let _Paints = Item.Paints.children, l = _Paints.length, i = 0; i < l; i++) { const _Paint = _Paints[i];
                    if(_Paint.Range != Ran) continue;
                    Paint = _Paint;
                    break;
                }
                if(!Paint) { IsNew = true;
                    if(!this.Paints) this.Paints = [];
                    if(!Item.Paints) Item.Paints = Item.Foot.appendChild(sML.create('bibi-paints'));
                    this.Paints.push(Item.Paints.appendChild(Paint = sML.create('bibi-paint', { Range: Ran, Spec: {} })));
                }
            }
            if(Spec) Object.keys(Spec).forEach(Sp => Paint.classList.toggle(Sp.toLowerCase(), Paint.Spec[Sp] = Spec[Sp] ? true : false));
            else {
                Paint.Spec = {};
                Paint.removeAttribute('class');
            }
            if(!IsNew) return Paint;
            const RangeFragments = [];
            const CAC = Ran.commonAncestorContainer;
            if(CAC.nodeType == 3) {
                RangeFragments.push(Ran);
            } else {
                const SC = Ran.startContainer, EC = Ran.endContainer, SO = Ran.startOffset, EO = Ran.endOffset;
                let Started = false, Ended = false;
                const _parse = (Ele) => { for(let _CNs = Ele.childNodes, l = _CNs.length, i = 0; i < l; i++) { const CN = _CNs[i];
                    if(Ended) break; // both required
                    switch(CN.nodeType) {
                        case 1: switch(CN.tagName.toLowerCase()) {
                            case 'img':
                                const PEle = CN.parentElement;
                                let CN_i = 0; while(PEle.childNodes[CN_i] != CN) CN_i++;
                                if(PEle == SC && CN_i     == SO) Started = true;
                                if(Started) _push(PEle, CN_i, CN_i + 1);
                                if(PEle == EC && CN_i + 1 == EO) Ended   = true;
                                break;
                            default: _parse(CN);
                        } break;
                        case 3: switch(CN) {
                            case SC: Started = true; _push(SC, SO, SC.textContent.length);               break;
                            case EC:                 _push(EC,  0, EO                   ); Ended = true; break;
                            default:     if(Started) _push(CN,  0, CN.textContent.length);
                        } break;
                    }
                    if(Ended) break; // both required
                }};
                const _push = (Container, StartOffset, EndOffset) => {
                    if(/^r[tp]$/i.test(Container.parentElement.tagName)) return;
                    const RF = Doc.createRange();
                    RF.setStart(Container, StartOffset), RF.setEnd(Container, EndOffset);
                    RangeFragments.push(RF);
                };
                _parse(CAC.nodeType == 1 ? CAC : CAC.parentElement);
            }
            const Rects = [];
            let LastRect = null; RangeFragments.forEach(RF => {
                const RFC = RF.startContainer;
                const Dir = getComputedStyle(RFC.nodeType == 1 ? RFC : RFC.parentElement).writingMode.split('-')[0];
                __: for(let RFRects = RF.getClientRects(), l = RFRects.length, i = 0; i < l; i++) { const RFRect = RFRects[i];
                    const Rect = { Dir: Dir, L: RFRect.left, T: RFRect.top, W: RFRect.width, H: RFRect.height };
                    if(LastRect && Dir == LastRect.Dir) switch(Dir) {
                        case 'horizontal': if(Rect.T === LastRect.T && Rect.H === LastRect.H) { Object.assign(LastRect, { W: (Rect.L - LastRect.L) + Rect.W }); continue __; } break;
                        case   'vertical': if(Rect.L === LastRect.L && Rect.W === LastRect.W) { Object.assign(LastRect, { H: (Rect.T - LastRect.T) + Rect.H }); continue __; } break;
                    }
                    Rects.push(LastRect = Rect);
                }
            });
            const _PS = 2; // Paint Spreading
            Rects.forEach(Rect => Paint.appendChild(sML.create('bibi-paint-fragment', { className: Rect.Dir, style: { left: (Rect.L - _PS) + 'px', top: (Rect.T - _PS) + 'px', width: (Rect.W + _PS * 2) + 'px', height: (Rect.H + _PS * 2) + 'px' } })));
            return Paint;
        },
        removeAllPaints: function() {
            if(this.Paints) this.Paints.forEach(Paint => Paint.parentElement.removeChild(Paint));
            if(this.FocusedRange) this.FocusedRange = null;
            return this.Paints = [];
        },
        prepareRepainting: function() {
            if(!this.Paints || !this.Paints.length) return;
            const FocusedRange = this.FocusedRange;
            const Repaints = this.Paints.map(Paint => [Paint.Range, Paint.Spec]);
            this.removeAllPaints();
            this.FocusedRange = FocusedRange;
            return () => Repaints.forEach(Repaint => this.paint(...Repaint));
        },
        repaint: function() {
            const repaint = this.prepareRepainting();
            if(repaint) repaint();
        },
        reserveRepainting: function(Time) {
            clearTimeout(this.Timer_reserveRepainting);
            this.Timer_reserveRepainting = setTimeout(() => this.repaint(), Time);
        },
        createSearchUI: function() { if(!S['use-search-ui'] || !S['use-menubar'] || !I.Menu) return null;
            const UIID = 'bibi-search', IconHTML = `<span class="bibi-icon"></span>`;
            const UI = RangeFinder.UI = I.setToggleAction(sML.create('div', { id: UIID }), { onopened: () => UI.start(), onclosed: () => UI.end() });
            const Bar                 = UI.appendChild(sML.create('div', { id: UIID + '-bar', addButtonGroup: (BG) => Bar.appendChild(I.createButtonGroup(BG)) }));
            const Form                =     Bar.appendChild(sML.create('form', { id: UIID + '-form', action: location.href }));
            const FormInput           =         Form.appendChild(sML.create('input', { type: 'search', id: Form.id + '-input', placeholder: I.distillLabels.distillLanguage({ default: 'Search', ja: '検索' })[O.Language] }));
            const Progress            =     Bar.appendChild(sML.create('div', { id: UIID + '-progress' }));
            const ProgressCurrent     =         Progress.appendChild(sML.create('span', { id: Progress.id + '-current',   innerHTML: `-` }));
            const ProgressDelimiter   =         Progress.appendChild(sML.create('span', { id: Progress.id + '-delimiter', innerHTML: `/` }));
            const ProgressTotal       =         Progress.appendChild(sML.create('span', { id: Progress.id + '-total',     innerHTML: `-` }));
            const ListOpener          =     Bar.addButtonGroup({ id: UIID + '-listopener' });
            const ListOpenerButton    =         ListOpener.addButton({ id: ListOpener.id + '-button', Type: 'toggle', Icon: IconHTML, Labels: { default: { default: `List of the Results`, ja: `検索結果一覧` }, active: { default: `Close`, ja: `閉じる` } } });
            const Move                =     Bar.addButtonGroup({ id: UIID + '-move', Type: 'Tiled' });
            const MovePrev            =         Move.addButton({ id: Move.id + '-prev', Type: 'normal', Icon: IconHTML, Labels: { default: { default: `Previous`, ja: `前` } }, action: () => List.close() && this.autofocusOnTheSearchResult({ Reverse: true }) });
            const MoveNext            =         Move.addButton({ id: Move.id + '-next', Type: 'normal', Icon: IconHTML, Labels: { default: { default: `Next`,     ja: `次` } }, action: () => List.close() && this.autofocusOnTheSearchResult(                 ) });
            const UICloser            =     Bar.addButtonGroup({ id: UIID + '-closer' });
            const UICloserButton      =         UICloser.addButton({ id: UICloser.id + '-button', Type: 'normal', Icon: IconHTML, Labels: { default: { default: `Close`, ja: `閉じる` } }, action: () => UI.close() });
            const UIOpener            = I.createButtonGroup({ id: UIID + '-opener' });
            const UIOpenerButton      =     UIOpener.addButton({ id: UIOpener.id + '-button', Type: 'normal', Icon: IconHTML, Labels: { default: { default: `Search`, ja: `検索` } }, action: () => UI.open() });
            const List                = I.createSubpanel({ id: UIID + '-list', Opener: ListOpenerButton, Position: 'center' });
            const ListButtonGroup     =     List.addSection().addButtonGroup();
            Object.assign(UI, {
                start: () => {
                    I.Subpanels.forEach(Sp => Sp.close());
                    this.resetSearch();
                    FormInput.focus();
                    O.HTML.classList.add('search-active');
                },
                end: () => {
                    I.Subpanels.forEach(Sp => Sp.close());
                    O.HTML.classList.remove('search-active');
                    FormInput.blur(), O.Body.focus();
                    this.resetSearch();
                },
                updateBar: () => {
                    const SearchResults = this.Search.Results, SearchResultF = SearchResults.Focused;
                    const Current = SearchResultF ? SearchResultF.Index + 1 : 0;
                    const Total = SearchResults.length;
                    const JoinedSStrs = this.Search.Strings.join('<OR>');
                    if(FormInput.value != JoinedSStrs) FormInput.value = JoinedSStrs;
                    Progress.classList.toggle('disabled', !Total);
                    if(ProgressCurrent.textContent != Current) ProgressCurrent.innerHTML = Current;
                    if(  ProgressTotal.textContent != Total  )   ProgressTotal.innerHTML = Total;
                    [MovePrev, MoveNext].forEach(Button => I.setUIState(Button, Total > 1 ? 'default' : 'disabled'));
                    I.setUIState(ListOpenerButton, Total ? 'default' : 'disabled');
                    if(!Total) List.close();
                    return Bar;
                },
                updateList: () => {
                    const SearchResults = this.Search.Results;
                    if(List.Results == SearchResults) return List;
                    List.Results = SearchResults;
                    if(ListButtonGroup.Buttons.length) {
                        ListButtonGroup.innerHTML = '';
                        ListButtonGroup.Buttons = [];
                    }
                    if(SearchResults) SearchResults.forEach((SearchResult, i) => {
                        const Button = ListButtonGroup.addButton({
                            Icon: `<span>` + (SearchResult.Index + 1) + `</span>`,
                            Labels: { default: { default: SearchResult.TextAround.map((Txt, i) => sML.create(i == 2 ? 'strong' : i % 2 == 1 ? 'em' : 'span', { innerHTML: Txt.replace(/(<span class="break"> <\/span>)/g, '$1\n') }).outerHTML).join('') } },
                            action: () => List.close() && this.setSearchResultFocusTo(SearchResult.Index)
                        });
                        if(SearchResult.IndexInItem == 0)                                           Button.classList.add('first-in-item');
                        if(!SearchResults[i + 1] || SearchResults[i + 1].Item != SearchResult.Item) Button.classList.add( 'last-in-item');
                    });
                    return List;
                },
                update: (NotFound) => {
                    clearTimeout(UI.Timer_update);
                    UI.Timer_update = setTimeout(() => UI.updateBar() && UI.updateList() && NotFound && UI.notFound(), 33);
                },
                notFound: () => new Promise(resolve => {
                    FormInput.blur();
                    FormInput.setAttribute('disabled', 'disabled');
                    const FormInputValue = FormInput.value;
                    Form.classList.add('not-found');
                    FormInput.value = I.distillLabels.distillLanguage({ default: 'Not Found', ja: 'みつかりませんでした' })[O.Language];
                    setTimeout(() => {
                        FormInput.value = '';
                        Form.classList.remove('not-found');
                        FormInput.value = FormInputValue;
                        FormInput.removeAttribute('disabled');
                        FormInput.focus();
                        resolve();
                    }, 777);
                }),
                submit: (Alt) => this.search(FormInput.value.split('<OR>'), { Focus: Alt ? 'auto-reverse' : 'auto' })
            });
            ['click', 'touchstart', 'touchmove', 'touchend', 'pointerdown', 'pointermove', 'pointerup', 'mousedown', 'mousemove', 'mouseup', 'keydown', 'keypress', 'keyup', 'wheel', 'mousewheel'].forEach(_ => UI.addEventListener(_, E.stopPropagation));
            ['autocapitalize', 'autocomplete', 'autocorrect'].forEach(_ => FormInput.setAttribute(_, 'off'));
            E.bind('bibi:updated-search-status', () => UI.update());
            E.bind('bibi:searched', () => this.Search.Results.length || UI.update('NotFound'));
            Form.addEventListener('submit', () => UI.submit());
            FormInput.addEventListener('keypress', Eve => {
                if(Eve.key != 'Enter' && Eve.keyCode != 13) return;
                Eve.preventDefault();
                UI.submit(Eve.shiftKey);
            });
            FormInput.addEventListener('keyup', Eve => {
                if(FormInput.value) return;
                Eve.preventDefault();
                UI.submit();
            });
            const addShortcutKey = (Target) => Target.addEventListener('keydown', Eve => {
                if((Eve.key != 'f' && Eve.keyCode != 70) || (!Eve.metaKey && !Eve.ctrlKey)) return;
                Eve.preventDefault();
                if(UI.UIState == 'default') return UI.open();
                if(!FormInput.value) return UI.close();
                FormInput.value = '';
                UI.submit();
            }, E.CPO_000);
            [FormInput, window].concat(R.Items.map(Item => Item.contentWindow || null)).forEach(Target => Target ? addShortcutKey(Target) : undefined); E.add('bibi:loaded-item', Item => addShortcutKey(Item.contentWindow));
            I.Menu.appendChild(UI);
            I.Menu.R.appendChild(UIOpener);
            return UI;
        },
        selectRange: function(Ran) {
            if(!Ran || typeof Ran != 'object' || !Ran.commonAncestorContainer) return null;
            const Sel = Ran.commonAncestorContainer.ownerDocument.defaultView.getSelection();
            Sel.removeAllRanges();
            Sel.addRange(Ran);
            return Sel;
        },
        getSelection: function(Doc) {
            if(Doc) {
                const Sel = Doc.getSelection();
                if(Sel.type == 'Range') return Sel;
            } else for(let l = R.Items.length, i = 0; i < l; i++) {
                const Sel = this.getSelection(R.Items[i].contentDocument);
                if(Sel) return Sel;
            }
            return null;
        },
        getSelectedText: function(Opt) {
            const Sel = this.Selection || this.getSelection();
            if(!Sel || Sel.type != 'Range' || !Sel.anchorNode) return '';
            if(!Opt || typeof Opt != 'object') Opt = {};
            const IncludeImgAlt      = Opt.IncludeImgAlt      !== false;
            const IgnoreRubies       = Opt.IgnoreRubies       !== false;
            const OptimizeLineBreaks = Opt.OptimizeLineBreaks !== false;
            let SelectedText = '';
            if(!IncludeImgAlt && !IgnoreRubies) SelectedText = Sel.toString();
            else {
                const DF = Sel.getRangeAt(0).cloneContents();
                if(IncludeImgAlt) sML.forEach(DF.querySelectorAll(    'img'))(Ele => Ele.parentNode.insertBefore(document.createTextNode(Ele.alt), Ele).parentNode.removeChild(Ele));
                if(IgnoreRubies)  sML.forEach(DF.querySelectorAll( 'rt, rp'))(Ele =>                                                                Ele.parentNode.removeChild(Ele));
                SelectedText = DF.textContent;
            }
            if(OptimizeLineBreaks) {
                SelectedText = SelectedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{2}/g, '\n').replace(/\n{2,}/g, '\n\n');
                if(sML.OS.Windows) SelectedText = SelectedText.replace(/\n/g, '\r\n');
            }
            return SelectedText;
        },
        initialize: function() {
            this.initializeSearch();
            E.add('bibi:loaded-item', Item => {
                Item.RangeFinder = {};
                Item.contentDocument.addEventListener('selectstart', (Eve) => {
                    const Sel = this.Selection;
                    if(Sel && Sel.anchorNode.ownerDocument != Eve.target) Sel.removeAllRanges();
                    this.Selection = this.RangeOfSelection = null;
                }, E.CPO_110);
                Item.contentDocument.addEventListener('selectionchange', (Eve) => {
                    clearTimeout(Item.RangeFinder.Timer_SelectionChanged);
                    Item.RangeFinder.Timer_SelectionChanged = setTimeout(() => this.RangeOfSelection = (this.Selection = this.getSelection(Eve.target))?.getRangeAt(0), 0);
                }, E.CPO_110);
                Item.contentDocument.addEventListener('copy', (Eve) => {
                    Eve.preventDefault();
                    const SelectedText = this.getSelectedText({ IncludeImgAlt: true, IgnoreRubies: true, OptimizeLineBreaks: true });
                    if(SelectedText) Eve.clipboardData.setData('text/plain', SelectedText);
                }, E.CPO_100);
            });
            E.add('bibi:opened', () => {
                if(S['use-search-ui'] && B.Package.Metadata['rendition:layout'] == 'reflowable') this.createSearchUI();
                E.add('bibi:changed-intersection', () => {
                    this.reserveRepainting(999);
                });
                E.bind('bibi:is-going-to:lay-out', () => {
                    const repaint = this.prepareRepainting();
                    if(!repaint) return;
                    let repaintAfterLayingOut;
                    E.add('bibi:laid-out', repaintAfterLayingOut = () => setTimeout(() => repaint(), 333) && E.remove('bibi:laid-out', repaintAfterLayingOut));
                });
            });
        }
    };
    RangeFinder.initialize();
}};


I.Arrows = { create: () => { if(!S['use-arrows']) return I.Arrows = null;
    const Arrows = I.Arrows = O.Body.appendChild(sML.create('div', { id: 'bibi-arrows' }));
    Object.assign(Arrows, {
        initialize: () => {
            (Arrows.All = [
                Arrows.Back     = Arrows[-1] = Arrows.appendChild(sML.create('div', { className: 'bibi-arrow', Labels: { default: { default: `Back`,    ja: `戻る` } }, Distance: -1 })),
                Arrows.Forward  = Arrows[ 1] = Arrows.appendChild(sML.create('div', { className: 'bibi-arrow', Labels: { default: { default: `Forward`, ja: `進む` } }, Distance:  1 })),
                Arrows.BackO    =                                 sML.create('div', { className: 'bibi-arrow', Labels: { default: { default: `Back`,    ja: `戻る` } }, Distance: -1 }),
                Arrows.ForwardO =                                 sML.create('div', { className: 'bibi-arrow', Labels: { default: { default: `Forward`, ja: `進む` } }, Distance:  1 })
            ]).forEach(Arrow => {
                I.setFeedback(Arrow);
                const FunctionsToBeCanceled = [Arrow.showHelp, Arrow.hideHelp, Arrow.BibiTapObserver.onTap];
                if(!O.TouchOS) FunctionsToBeCanceled.push(Arrow.BibiHoverObserver.onHover, Arrow.BibiHoverObserver.onUnHover);
                FunctionsToBeCanceled.forEach(f2BC => f2BC = () => {});
            });
            if(S['indicate-orthogonal-arrows-if-necessary']) [Arrows.BackO, Arrows.ForwardO].forEach(OArrow => Arrows.appendChild(OArrow));
            Arrows.Back.Pair = Arrows.Forward,   Arrows.Back.Alt = Arrows.BackO;
            Arrows.Forward.Pair = Arrows.Back,   Arrows.Forward.Alt = Arrows.ForwardO;
            Arrows.BackO.Pair = Arrows.ForwardO, Arrows.BackO.Alt = Arrows.Back;
            Arrows.ForwardO.Pair = Arrows.BackO, Arrows.ForwardO.Alt = Arrows.Forward;
            delete Arrows.initialize;
        },
        update: () => {
            Arrows.All.forEach(Arrow => {
                Arrow.classList.add('bibi-arrow-updating');
                ['horizontal', 'vertical', 'up', 'right', 'down', 'left'].forEach(ClassName => Arrow.classList.remove('bibi-arrow-' + ClassName))
            });
            switch(S.ARA) {
                case 'horizontal': switch(S.PPD) {
                    case 'ltr': Arrows['left']  = Arrows.Back, Arrows['right'] = Arrows.Forward; break;
                    case 'rtl': Arrows['right'] = Arrows.Back, Arrows['left']  = Arrows.Forward; break;
                } Arrows['top'] = Arrows['up'] = Arrows.BackO, Arrows['bottom'] = Arrows['down'] = Arrows.ForwardO; break;
                case 'vertical': switch(S.PPD) {
                    case 'ltr': Arrows['left']  = Arrows.BackO, Arrows['right'] = Arrows.ForwardO; break;
                    case 'rtl': Arrows['right'] = Arrows.BackO, Arrows['left']  = Arrows.ForwardO; break;
                } Arrows['top'] = Arrows['up'] = Arrows.Back, Arrows['bottom'] = Arrows['down'] = Arrows.Forward; break;
            }
            ['horizontal',  'left'].forEach(ClassName =>   Arrows['left'].classList.add('bibi-arrow-' + ClassName));
            ['horizontal', 'right'].forEach(ClassName =>  Arrows['right'].classList.add('bibi-arrow-' + ClassName));
            [  'vertical',    'up'].forEach(ClassName =>    Arrows['top'].classList.add('bibi-arrow-' + ClassName));
            [  'vertical',  'down'].forEach(ClassName => Arrows['bottom'].classList.add('bibi-arrow-' + ClassName));
            Arrows.All.forEach(Arrow => Arrow.classList.remove('bibi-arrow-updating'));
        },
        toggleState: () => Arrows.All.forEach(Arrow => {
            const Availability = I.Flipper.isAbleToFlip(Arrow.Distance);
            Arrow.classList.toggle(  'available',  Availability);
            Arrow.classList.toggle('unavailable', !Availability);
        }),
        navigate: () => setTimeout(() => {
            [Arrows.Back, Arrows.Forward].forEach(Arrow => I.Flipper.isAbleToFlip(Arrow.Distance) ? Arrow.classList.add('glowing') : false);
            setTimeout(() => [Arrows.Back, Arrows.Forward].forEach(Arrow => Arrow.classList.remove('glowing')), 1234);
        }, 400)
    });
    O.HTML.classList.add('arrows-active');
    Arrows.initialize();
    E.add('bibi:commands:move-by', Distance => { // indicate direction
        if(!L.Opened || typeof (Distance *= 1) != 'number' || !isFinite(Distance) || !(Distance = Math.round(Distance))) return false;
        return E.dispatch(Distance < 0 ? Arrows.Back : Arrows.Forward, 'bibi:singletapped');
    });
    E.add('bibi:opened',       () => setTimeout(() => { Arrows.update(); Arrows.toggleState(); Arrows.navigate(); }, 123));
    E.add('bibi:scrolled',     () => setTimeout(() => {                  Arrows.toggleState();                    },   0));
    E.add('bibi:changed-view', () => setTimeout(() => { Arrows.update(); Arrows.toggleState(); Arrows.navigate(); },   0));
    E.dispatch('bibi:created-arrows');
     // Optimize to Scrollbar Size
    (_ => {
        _('html:not(.slider-opened).book-full-height',       'horizontal', 'height', O.Scrollbars.Width);
        _('html:not(.slider-opened):not(.book-full-height)', 'horizontal', 'height', O.Scrollbars.Width + I.Menu.Height);
        _('html:not(.slider-opened).appearance-vertical',      'vertical',  'width', O.Scrollbars.Width);
    })((Context, HorV, WorH, Margin) => sML.appendCSSRule(
        `${ Context } div.bibi-arrow.bibi-arrow-${ HorV }`,
        `${ WorH }: calc(100% - ${ Margin }px); ${ WorH }: calc(100v${ WorH.charAt(0) } - ${ Margin }px);`
    ));
    (_ => {
        _('html:not(.slider-opened).appearance-vertical',  'right', 'right');
        _('html:not(.slider-opened).appearance-horizontal', 'down', 'bottom');
    })((Context, Dir, Side) => sML.appendCSSRule(
        `${ Context } div.bibi-arrow.bibi-arrow-${ Dir }`,
        `${ Side }: ${ O.Scrollbars.Width }px;`
    ));
}};


I.AxisSwitcher = { create: () => { if(S['fix-reader-view-mode']) return I.AxisSwitcher = null;
    const UseUI = S['use-axis-switcher-ui'];
    let AxisSwitcher, Circle, Arrows, CW, _t;
    if(UseUI) {
        AxisSwitcher = O.Body.appendChild(sML.create('div', { id: 'bibi-axis-switcher' }));
        Circle = AxisSwitcher.appendChild(sML.create('span')), CW = parseFloat(getComputedStyle(Circle).borderWidth); sML.CSS.appendRule('div#bibi-axis-switcher > span:first-child', 'border-width: 0;');
        Arrows = AxisSwitcher.appendChild(sML.create('span'));
        _t = (_P, _VR, _RR, _ep) => _P < _RR[0] ? _VR[0] : _P > _RR[1] ? _VR[1] : _VR[0] + (_VR[1] - _VR[0]) * Math.pow(_ep[0]((_P - _RR[0]) / (_RR[1] - _RR[0])), _ep[1]);
    } else {
        AxisSwitcher = {};
    }
    I.AxisSwitcher = Object.assign(AxisSwitcher, {
        progress: (_R) => {
            AxisSwitcher.InProgress = true;
            const _P = sML.limitMinMax(Math.abs(_R), 0, 1);
            E.dispatch('bibi:progresses-axis-switcher', _P);
            if(!UseUI) return;
            AxisSwitcher.style.transform   =  'scale(' + _t(_P, [    .4,  1                    ], [.4,  1], [sML.Easing.easeOutBack,   4])    + ')';
            AxisSwitcher.style.opacity     =             _t(_P, [     0,  1                    ], [.4,  1], [sML.Easing.easeOutCirc,   1])         ;
                  Circle.style.borderWidth =             _t(_P, [CW / 4, CW                    ], [.4, .8], [sML.Easing.easeOutBack,   4])   + 'px';
                  Circle.style.opacity     =             _t(_P, [     0,  1                    ], [.2, .8], [sML.Easing.easeOutBack,   1])         ;
                  Arrows.style.transform   = 'rotate(' + _t(_P, [     0, 90 * (_R < 0 ? -1 : 1)], [.6,  1], [sML.Easing.easeInOutExpo, 1]) + 'deg)';
                  Arrows.style.opacity     =             _t(_P, [     0,  1                    ], [.4, .8], [sML.Easing.easeInOutExpo, 1])         ;
        },
        reset: () => {
            if(AxisSwitcher.InProgress) {
                AxisSwitcher.InProgress = false;
                E.dispatch('bibi:cancelled-axis-switcher');
            }
            if(!UseUI) return;
            AxisSwitcher.style.transition = '.1s ease-out';
            setTimeout(() => AxisSwitcher.style.opacity = AxisSwitcher.style.transform = '', 0);
            setTimeout(() => AxisSwitcher.style.transition = Circle.style.borderWidth = Circle.style.opacity = Arrows.style.transform = Arrows.style.opacity = '', 111);
        },
        switchAxis: () => new Promise(resolve => {
            AxisSwitcher.InProgress = false;
            AxisSwitcher.reset();
            let RVM = ''; switch(S['available-reader-view-modes'].length) {
                case 2: RVM = S['available-reader-view-modes'][S['available-reader-view-modes'][0] != S.RVM ? 0 : 1]; break;
                case 3: switch(S.RVM) {
                    case 'horizontal': RVM =   'vertical'; break;
                    case   'vertical': RVM = 'horizontal'; break;
                } break;
            }
            if(RVM) R.changeView({ Mode: RVM, NoNotification: true });
            resolve();
        })
    });
    E.dispatch('bibi:created-axis-switcher');
}};


I.Spinner = { create: () => {
    const Spinner = I.Spinner = O.Body.appendChild(sML.create('div', { id: 'bibi-spinner' }));
    for(let i = 1; i <= 12; i++) Spinner.appendChild(document.createElement('span'));
    E.dispatch('bibi:created-spinner');
}};


I.createButtonGroup = (Par = {}) => {
    if(Par.Area && Par.Area.tagName) {
        const AreaToBeAppended = Par.Area;
        delete Par.Area;
        return AreaToBeAppended.addButtonGroup(Par);
    }
    const ButtonsToBeAdded = Array.isArray(Par.Buttons) ? Par.Buttons : Par.Button ? [Par.Button] : [];
    delete Par.Buttons;
    delete Par.Button;
    const CommonClassName = 'bibi-buttongroup', ClassNames = [CommonClassName];
    if(Par.Type == 'Steps') {
        const StepsCommonClassName = CommonClassName + '-steps', StepsUniqueClassName = StepsCommonClassName + '-' + String(I.createButtonGroup.StepsUniqueCount = (I.createButtonGroup.StepsUniqueCount || 0) + 1).padStart(3, '0');
        ClassNames.push(StepsCommonClassName, StepsUniqueClassName);
        if(typeof Par.MinLabels == 'object') sML.CSS.appendRule('.' + StepsUniqueClassName + ':before', `content: "` + I.distillLabels(Par.MinLabels)['default'][O.Language] + `" !important;`);
        if(typeof Par.MaxLabels == 'object') sML.CSS.appendRule('.' + StepsUniqueClassName + ':after',  `content: "` + I.distillLabels(Par.MaxLabels)['default'][O.Language] + `" !important;`);
        ButtonsToBeAdded.forEach(Button => Button.Type = 'radio');
    } else if(Par.Type == 'Tiled' || Par.Tiled) {
        ClassNames.push(CommonClassName + '-tiled');
    }
    if(Par.Lively) ClassNames.push('lively');
    if(typeof Par.className == 'string' && Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    if(typeof Par.id != 'string' || !Par.id) delete Par.id;
    const ButtonGroup = sML.create('ul', Par);
    ButtonGroup.Buttons = [];
    ButtonGroup.addButton = function(Par) {
        const Button = I.createButton(Par); if(!Button) return null;
        (Button.ButtonBox = (Button.ButtonGroup = this).appendChild(sML.create('li', { className: 'bibi-buttonbox bibi-buttonbox-' + Button.Type }))).appendChild(Button);
        if(!O.TouchOS) {
            I.TouchObserver.observeElementHover(Button.ButtonBox)
            I.TouchObserver.setElementHoverActions(Button.ButtonBox);
        }
        this.Buttons.push(Button);
        return Button;
    };
    ButtonGroup.addButtons = function(Pars) { Pars.forEach(Par => this.addButton(Par)); return this.Buttons; };
    ButtonsToBeAdded.forEach(Button => {
        if(!Button.Type && Par.ButtonType) Button.Type = Par.ButtonType;
        if(!Button.action && Par.action) Button.action = Par.action;
        ButtonGroup.addButton(Button);
    });
    ButtonGroup.Busy = false;
    return ButtonGroup;
};


I.createButton = (Par = {}) => {
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id       ) delete Par.id;
    Par.Type = (typeof Par.Type == 'string' && /^(normal|toggle|radio|link)$/.test(Par.Type)) ? Par.Type : 'normal';
    const ClassNames = ['bibi-button', 'bibi-button-' + Par.Type];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    if(typeof Par.Icon != 'undefined' && !Par.Icon.tagName) {
        if(typeof Par.Icon == 'string' && Par.Icon) {
            Par.Icon = sML.hatch(Par.Icon);
        } else {
            delete Par.Icon;
        }
    }
    const Button = sML.create((typeof Par.href == 'string' ? 'a' : 'span'), Par);
    if(Button.Icon) {
        Button.IconBox = Button.appendChild(sML.create('span', { className: 'bibi-button-iconbox' }));
        Button.IconBox.appendChild(Button.Icon);
        Button.Icon = Button.IconBox.firstChild;
        Button.IconBox.Button = Button.Icon.Button = Button;
    }
    Button.Label = Button.appendChild(sML.create('span', { className: 'bibi-button-label' }));
    I.setFeedback(Button, {
        Help: Par.Help,
        Checked: Par.Checked,
        StopPropagation: true,
        PreventDefault: (Button.href ? false : true)
    });
    Button.isAvailable = () => {
        if(Button.Busy) return false;
        if(Button.ButtonGroup && Button.ButtonGroup.Busy) return false;
        return (Button.UIState != 'disabled');
    };
    if(typeof Button.action == 'function') E.add(Button, 'bibi:singletapped', () => Button.isAvailable() ? Button.action.apply(Button, arguments) : null);
    Button.Busy = false;
    return Button;
};


I.createSubpanel = (Par = {}) => {
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id       ) delete Par.id;
    const ClassNames = ['bibi-subpanel', 'bibi-subpanel-' + (/^(left|center|right)$/.test(Par.Position) ? Par.Position : 'right')];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    const SectionsToAdd = Array.isArray(Par.Sections) ? Par.Sections : Par.Section ? [Par.Section] : [];
    delete Par.Sections;
    delete Par.Section;
    const Subpanel = O.Body.appendChild(sML.create('div', Par));
    Subpanel.Sections = [];
    Subpanel.addEventListener(E['pointerdown'], Eve => Eve.stopPropagation());
    Subpanel.addEventListener(E['pointerup'],   Eve => Eve.stopPropagation());
    Subpanel.addEventListener('wheel',          Eve => Eve.stopPropagation());
    I.setToggleAction(Subpanel, {
        onopened: function(Opt) {
            I.Subpanels.forEach(Sp => Sp == Subpanel ? true : Sp.close({ ForAnotherSubpanel: true }));
            I.OpenedSubpanel = this;
            this.classList.add('opened');
            O.HTML.classList.add('subpanel-opened');
            if(Subpanel.Opener) I.setUIState(Subpanel.Opener, 'active');
            if(Par.onopened) Par.onopened.apply(Subpanel, arguments);
            E.dispatch(Subpanel, 'bibi:opened-subpanel', Subpanel), E.dispatch('bibi:opened-subpanel', Subpanel);
        },
        onclosed: function(Opt) {
            this.classList.remove('opened');
            if(I.OpenedSubpanel == this) setTimeout(() => I.OpenedSubpanel = null, 222);
            if(!Opt || !Opt.ForAnotherSubpanel) {
                O.HTML.classList.remove('subpanel-opened');
            }
            if(Subpanel.Opener) {
                I.setUIState(Subpanel.Opener, 'default');
            }
            if(Par.onclosed) Par.onclosed.apply(Subpanel, arguments);
            E.dispatch(Subpanel, 'bibi:closed-subpanel', Subpanel), E.dispatch('bibi:closed-subpanel', Subpanel);
        }
    });
    Subpanel.bindOpener = (Opener) => {
        E.add(Opener, 'bibi:singletapped', () => Subpanel.toggle());
        Subpanel.Opener = Opener;
        return Subpanel.Opener;
    }
    if(Subpanel.Opener) Subpanel.bindOpener(Subpanel.Opener);
    E.add('bibi:opened-panel',      Subpanel.close);
    E.add('bibi:closes-utilities',  Subpanel.close);
    I.Subpanels.push(Subpanel);
    Subpanel.addSection = function(Par = {}) {
        const SubpanelSection = I.createSubpanelSection(Par);
        if(!SubpanelSection) return null;
        SubpanelSection.Subpanel = this;
        this.appendChild(SubpanelSection)
        this.Sections.push(SubpanelSection);
        return SubpanelSection;
    };
    SectionsToAdd.forEach(SectionToAdd => Subpanel.addSection(SectionToAdd));
    return Subpanel;
};


I.createSubpanelSection = (Par = {}) => {
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id       ) delete Par.id;
    const ClassNames = ['bibi-subpanel-section'];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    const PGroupsToAdd = Array.isArray(Par.PGroups) ? Par.PGroups : Par.PGroup ? [Par.PGroup] : [];
    delete Par.PGroups;
    delete Par.PGroup;
    const ButtonGroupsToAdd = Array.isArray(Par.ButtonGroups) ? Par.ButtonGroups : Par.ButtonGroup ? [Par.ButtonGroup] : [];
    delete Par.ButtonGroups;
    delete Par.ButtonGroup;
    const SubpanelSection = sML.create('div', Par);
    if(SubpanelSection.Labels) { // HGroup
        SubpanelSection.Labels = I.distillLabels(SubpanelSection.Labels);
        SubpanelSection
            .appendChild(sML.create('div', { className: 'bibi-hgroup' }))
                .appendChild(sML.create('p', { className: 'bibi-h' }))
                    .appendChild(sML.create('span', { className: 'bibi-h-label', innerHTML: SubpanelSection.Labels['default'][O.Language] }));
    }
    SubpanelSection.ButtonGroups = []; // ButtonGroups
    SubpanelSection.addButtonGroup = function(Par = {}) {
        const ButtonGroup = I.createButtonGroup(Par);
        this.appendChild(ButtonGroup);
        this.ButtonGroups.push(ButtonGroup);
        return ButtonGroup;
    };
    ButtonGroupsToAdd.forEach(ButtonGroupToAdd => {
        if(ButtonGroupToAdd) SubpanelSection.addButtonGroup(ButtonGroupToAdd);
    });
    return SubpanelSection;
};


I.setToggleAction = (Obj, Par = {}) => {
    // Par = {
    //      onopened: Function,
    //      onclosed: Function
    // };
    return sML.edit(Obj, {
        UIState: 'default',
        open: (Opt) => new Promise(resolve => {
            if(Obj.UIState == 'default') {
                I.setUIState(Obj, 'active');
                if(Par.onopened) Par.onopened.call(Obj, Opt);
            }
            resolve(Opt);
        }),
        close: (Opt) => new Promise(resolve => {
            if(Obj.UIState == 'active') {
                I.setUIState(Obj, 'default');
                if(Par.onclosed) Par.onclosed.call(Obj, Opt);
            }
            resolve(Opt);
        }),
        toggle: (Opt) => Obj.UIState == 'default' ? Obj.open(Opt) : Obj.close(Opt)
    });
};


I.setFeedback = (Ele, Opt = {}) => {
    Ele.Labels = I.distillLabels(Ele.Labels);
    if(Ele.Labels) {
        if(Opt.Help) {
            Ele.showHelp = () => {
                if(I.Help && Ele.Labels[Ele.UIState]) I.Help.show(Ele.Labels[Ele.UIState][O.Language]);
                return Ele;
            };
            Ele.hideHelp = () => {
                if(I.Help) I.Help.hide();
                return Ele;
            };
        }
        if(Ele.Notification) Ele.notify = () => {
            if(Ele.Labels[Ele.UIState]) setTimeout(() => I.notify(Ele.Labels[Ele.UIState][O.Language]), 0);
            return Ele;
        }
    }
    if(!O.TouchOS) {
        I.TouchObserver.observeElementHover(Ele);
        I.TouchObserver.setElementHoverActions(Ele);
    }
    I.TouchObserver.observeElementTap(Ele, Opt);
    I.TouchObserver.setElementTapActions(Ele);
    I.setUIState(Ele, Opt.Checked ? 'active' : 'default');
    return Ele;
};


I.setUIState = (UI, UIState) => {
    if(!UIState) UIState = 'default';
    UI.PreviousUIState = UI.UIState;
    if(UIState == UI.UIState) return;
    UI.UIState = UIState;
    if(UI.tagName) {
        if(UI.Labels && UI.Labels[UI.UIState] && UI.Labels[UI.UIState][O.Language]) {
            UI.title = UI.Labels[UI.UIState][O.Language].replace(/<[^>]+>/g, '');
            if(UI.Label) UI.Label.innerHTML = UI.Labels[UI.UIState][O.Language];
        }
        sML.replaceClass(UI, UI.PreviousUIState, UI.UIState);
    }
    return UI.UIState;
};


I.isPointerStealth = () => {
    let IsPointerStealth = false;
    I.isPointerStealth.Checkers.forEach(checker => IsPointerStealth = checker() ? true : IsPointerStealth);
    return IsPointerStealth;
};

    I.isPointerStealth.Checkers = [];

    I.isPointerStealth.addChecker = (fun) => typeof fun == 'function' && !I.isPointerStealth.Checkers.includes(fun) ? I.isPointerStealth.Checkers.push(fun) : I.isPointerStealth.Checkers.length;


I.distillLabels = (Labels) => {
    if(typeof Labels != 'object' || !Labels) Labels = {};
    for(const State in Labels) Labels[State] = I.distillLabels.distillLanguage(Labels[State]);
    if(!Labels['default'])                       Labels['default']  = I.distillLabels.distillLanguage();
    if(!Labels['active']   && Labels['default']) Labels['active']   = Labels['default'];
    if(!Labels['disabled'] && Labels['default']) Labels['disabled'] = Labels['default'];
    return Labels;
};

    I.distillLabels.distillLanguage = (Label) => {
        if(typeof Label != 'object' || !Label) Label = { default: Label };
        if(typeof Label['default'] != 'string')  {
                 if(typeof Label['en'] == 'string')       Label['default']  = Label['en'];
            else if(typeof Label[O.Language] == 'string') Label['default']  = Label[O.Language];
            else                                          Label['default']  = '';
        }
        if(typeof Label[O.Language] != 'string') {
                 if(typeof Label['default'] == 'string')  Label[O.Language] = Label['default'];
            else if(typeof Label['en']      == 'string')  Label[O.Language] = Label['en'];
            else                                          Label[O.Language] = '';
        }
        return Label;
    };


I.orthogonal = (InputType, RVM = S.RVM) => {
    if(S['available-reader-view-modes'].includes(RVM)) {
        switch(RVM) {
            case 'paged':                       return S['on-orthogonal-' + InputType][0];
            case 'horizontal': case 'vertical': return S['on-orthogonal-' + InputType][1];
        }
    }
    return '';
};

I.draggable = (RVM = S.RVM) => {
    if(S['available-reader-view-modes'].includes(RVM)) {
        switch(RVM) {
            case 'paged':                       return S['content-draggable'][0] === true && S.ARA === S.SLA;
            case 'horizontal': case 'vertical': return S['content-draggable'][1] === true;
        }
    }
    return false;
};

I.isScrollable = () => (S.ARA == S.SLA && I.Loupe.CurrentTransformation.Scale == 1) ? true : false;


I.getBookIcon = () => sML.create('div', { className: 'book-icon', innerHTML: `<span></span>` });




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


export const P = {}; // Bibi.Preset


P.preset = (PresetData) => { // DO NOT ALLOW EXTERNAL OBJECT
    Bibi.applyFilteredSettingsTo(P, PresetData, [Bibi.SettingTypes, Bibi.SettingTypes_PresetOnly], 'Fill'); /**/ delete P['book']; /**/
    delete P.preset; delete Bibi.preset;
    P.Script = document.currentScript;
    // if(P.preset.resolve) P.preset.resolve();
};
Bibi.preset = P.preset;


// P.dress = (Dress) => { // DO NOT ALLOW EXTERNAL TEXT
//     document.documentElement.insertBefore(document.createElement('style')).textContent = DressData;
//     delete P.dress; delete Bibi.dress;
//     if(P.dress.resolve) P.dress.resolve();
// };
// Bibi.dress = P.dress;


P.initialize = () => {
    P['bookshelf'] = (P['bookshelf'] ? new URL(P['bookshelf'], P.Script.src) : new URL('../../../bibi-bookshelf', Bibi.Script.src)).href.replace(/\/$/, '');
    P['extensions'] = (() => {
        let Extensions_HTML = Bibi.Script.getAttribute('data-bibi-extensions');
        if(Extensions_HTML) {
            const DocHRef = location.href.split('?')[0];
            Extensions_HTML = Extensions_HTML.trim().replace(/\s+/, ' ').split(' ').map(EPath => ({ src: new URL(EPath, DocHRef).href }));
            if(Extensions_HTML.length) P['extensions'] = Extensions_HTML;
        }
        return !Array.isArray(P['extensions']) ? [] : P['extensions'].filter(Xtn => {
            if(Xtn.hasOwnProperty('-spell-of-activation-')) {
                const SoA = Xtn['-spell-of-activation-'];
                if(!SoA || !/^[a-zA-Z0-9_\-]+$/.test(SoA) || !U.Query.hasOwnProperty(SoA)) return false;
            }
            if(Xtn.hasOwnProperty('-extract-')) {
                const Extract = Xtn['-extract-'] = Bibi.verifySettingValue('array', 'extract-if-necessary', Xtn['-extract-']);
                if(Extract) X.Extractor = Xtn, P['extract-if-necessary'] = Extract;
            }
            if(!Xtn || !Xtn['src'] || typeof Xtn['src'] != 'string') return false;
            return (Xtn['src'] = new URL(Xtn['src'], P.Script.src).href);
        });
    })();
    delete P.initialize;
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- URI-Defined Settings (FileName, Queries, Hash, and EPUBCFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


export const U = {};


U.translateData = (PnV) => {
    let [_P, _V] = PnV;
    switch(_P) {
        case 'dppd': case 'default-ppd': _P = 'default-page-progression-direction'; break;
        case 'pagination': _P = 'pagination-method'; break;
        case 'view-mode': case 'view': case 'rvm': _P = 'reader-view-mode'; break;
        case 'paged': case 'horizontal': case 'vertical': _V = _P, _P = 'reader-view-mode'; break;
    }
    return [_P, _V];
};


U.parseQuery = () => {
    const LS = location.search; if(typeof LS != 'string') return;
    let Query = LS.replace(/^\?/, '').split('&').reduce((Query, PnV) => {
        let [_P, _V] = PnV.split('=');
        if(!_V) _V = undefined;
        switch(_P) {
            case 'book': if(!_V) return Query; break;
            case 'log': if(!_V) _V = '1'; break;
            case 'debug': case 'time': case 'wait': case 'zine': if(!_V) _V = 'true'; break;
            default: [_P, _V] = U.translateData([_P, _V]);
        }
        Query[_P] = _V;
        return Query;
    }, {});
    const DistilledQuery = Bibi.applyFilteredSettingsTo({}, Query, [Bibi.SettingTypes, Bibi.SettingTypes_UserOnly]);
    Object.assign(U, DistilledQuery);
    U['Query'] = Object.assign(Query, DistilledQuery);
    delete U.parseQuery;
};


U.parseHash = () => {
    const HashData = {};
    let LocHash = location.hash;
    const CatGroupREStr = '([&#])([a-zA-Z_]+)\\(([^\\(\\)]+)\\)', CatGroups = LocHash.match(new RegExp(CatGroupREStr, 'g'));
    if(CatGroups?.length) CatGroups.forEach(CatGroup => {
        const CatGroupParts = CatGroup.match(new RegExp(CatGroupREStr));
        let Cat = CatGroupParts[2].toLowerCase(), Dat = CatGroupParts[3];
        if(/^(bibi|jo|epubcfi)$/.test(Cat) && Dat) HashData[Cat] = Dat;
        LocHash = LocHash.replace(CatGroup, CatGroupParts[1]);
    });
    HashData['#'] = LocHash.replace(/^#|&$/, '');
    for(const Cat in HashData) {
        if(Cat == 'epubcfi') continue;
        const DataString = HashData[Cat];
        if(typeof DataString == 'string' && DataString) {
            let ParsedData = {}, HasValue = false;
            DataString.split('&').forEach(PnV => {
                const DD = U.translateData(PnV.split('='));
                if(DD && DD[1] != undefined) ParsedData[DD[0]] = DD[1], HasValue = true;
            });
            if(!HasValue) {
                delete HashData[Cat];
                continue;
            }
            HashData[Cat] = Bibi.applyFilteredSettingsTo({}, ParsedData, [Bibi.SettingTypes, Bibi.SettingTypes_UserOnly]);
            delete HashData[Cat]['book'];
        }
    }
    if(HashData['#']      )   Object.assign(U, U['#']       = HashData['#']);
    if(HashData['bibi']   )   Object.assign(U, U['bibi']    = HashData['bibi']);
    if(HashData['jo']     ) { Object.assign(U, U['jo']      = HashData['jo']  ); if(history.replaceState) history.replaceState(null, null, location.href.replace(/[&#]jo\([^\)]*\)$/g, '')); }
    if(HashData['epubcfi'])                    U['epubcfi'] = HashData['epubcfi'];
    delete U.parseHash;
};


U.at1st = () => {
    U.parseQuery();
    U.parseHash();
    if(!U['book']) delete U['zine'];
    if(U['debug']) Bibi.Deb = Bibi.Debug = true, U['log'] = 9;
    delete U.translateData;
    delete U.at1st;
};


U.initialize = () => {
         if(typeof U['nav']  == 'number') U['nav'] < 1 ? delete U['nav'] : R.StartOn = { Nav:  U['nav']  }; // to be converted in L.coordinateLinkages
    else if(typeof U['p']    == 'string')                                  R.StartOn = { P:    U['p']    };
    else if(typeof U['iipp'] == 'number')                                  R.StartOn = { IIPP: U['iipp'] };
    else if(typeof U['edge'] == 'string')                                  R.StartOn = { Edge: U['edge'] };
    else if(typeof U['epubcfi'] == 'string')                               R.StartOn = R.getCFIDestination(U['epubcfi']);
    delete U.initialize;
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Document-Defined Settings (Bookshelf, Book, Book-Data)

//----------------------------------------------------------------------------------------------------------------------------------------------


export const D = {};


D.at1st = () => {
    const RE = /^[_\-\w\d]+(\.[_\-\w\d]+)*$/;
    const PresetValue = Bibi.Script.getAttribute('data-bibi-preset');
    if(PresetValue && RE.test(PresetValue)) D['preset'] = PresetValue;
    const DressValue  = Bibi.Style.getAttribute('data-bibi-dress');
    if( DressValue && RE.test(DressValue) ) D['dress']  = DressValue;
    const BookshelfValue = document.body.getAttribute('data-bibi-bookshelf');
    if(BookshelfValue) D['bookshelf'] = new URL(BookshelfValue, location.href.split('?')[0]);
    const BookValue = document.body.getAttribute('data-bibi-book');
    if(BookValue) D['book'] = BookValue;
    const BookDataElement = document.getElementById('bibi-book-data');
    if(BookDataElement) {
        const BookData = BookDataElement.innerText.trim();
        if(BookData) {
            const BookDataMIMEType = BookDataElement.getAttribute('data-bibi-book-mimetype');
            if(/^application\/(epub\+zip|zip|x-zip(-compressed)?)$/i.test(BookDataMIMEType)) {
                D['book-data']          = BookData;
                D['book-data-mimetype'] = BookDataMIMEType;
            }
        }
        BookDataElement.innerHTML = '';
        BookDataElement.parentNode.removeChild(BookDataElement);
    }
    delete D.at1st;
};


D.initialize = () => {
    if(D['book-data'] || D['book']) {
        // delete U['book'];
        let HRef = location.href.replace(/([\?&])book=[^&]*&?/, '$1');
        if(!HRef.split('?')[1]) HRef = HRef.split('?')[0];
        history.replaceState(null, document.title, HRef);
    }
    delete D.initialize;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


export const S = {}; // Bibi.Settings


S.initialize = () => {
    for(const Pro in S) if(typeof S[Pro] != 'function') delete S[Pro];
    sML.applyRtL(S, P, 'ExceptFunctions');
    sML.applyRtL(S, U, 'ExceptFunctions');
    sML.applyRtL(S, D, 'ExceptFunctions');
    Bibi.SettingTypes['yes-no'].concat(Bibi.SettingTypes_PresetOnly['yes-no']).concat(Bibi.SettingTypes_UserOnly['yes-no']).forEach(Pro => S[Pro] = (S[Pro] == 'yes' || (S[Pro] == 'mobile' && O.TouchOS) || (S[Pro] == 'desktop' && !O.TouchOS)));
    // --------
    if( S['uiless'])      S['use-menubar'] = S['use-slider'] = S['use-arrows'] = S['use-nombre'] = false;
    if(!S['use-menubar']) S['use-bookmark-ui'] = S['use-loupe-ui'] = S['use-search-ui'] = S['use-textsetter-ui'] = false, S['use-full-height'] = true;
    if(!S['use-slider'])  S['use-history-ui'] = S['zoom-out-for-utilities'] = false;
    // --------
    if(!S['trustworthy-origins'].includes(O.Origin)) S['trustworthy-origins'].unshift(O.Origin);
    S['cache'] = (S['cache'] == 'no-store' || Bibi.Debug) ? 'no-store' : '';
    // --------
    S['book'] = (!S['book-data'] && typeof S['book'] == 'string' && S['book']) ? new URL(S['book'], S['bookshelf'] + '/').href : '';
    // --------
    if(typeof S['parent-bibi-index'] != 'number') delete S['parent-bibi-index'];
    // --------
    if(S['book'] || !window.File) S['accept-local-file'] = false, S['accept-blob-converted-data'] = false, S['accept-base64-encoded-data'] = false;
    else                          S['accept-local-file'] = S['accept-local-file'] && (S['extract-if-necessary'].includes('*') || S['extract-if-necessary'].includes('.epub') || S['extract-if-necessary'].includes('.zip')) ? true : false;
    // --------
    S['autostart'] = S['wait'] ? false : !S['book'] ? true : window.parent != window ? S['autostart-embedded'] : S['autostart'];
    S['start-in-new-window'] = (window.parent != window && !S['autostart']) ? S['start-embedded-in-new-window'] : false;
    // --------
    S['default-page-progression-direction'] = S['default-page-progression-direction'] == 'rtl' ? 'rtl' : 'ltr';
    // --------
    if(!S['available-reader-view-modes'] || !S['available-reader-view-modes'].length || S['available-reader-view-modes'].length > 3) S['available-reader-view-modes'] = ['paged', 'horizontal', 'vertical'];
    S['available-reader-view-modes_string'] = (ARVMs => {
        if(S['available-reader-view-modes'].includes('paged'     )) ARVMs.push('paged');
        if(S['available-reader-view-modes'].includes('horizontal')) ARVMs.push('horizontal');
        if(S['available-reader-view-modes'].includes('vertical'  )) ARVMs.push('vertical');
        return ARVMs.join('-');
    })([]);
    if(!S['default-reader-view-mode'] || (S['default-reader-view-mode'] != 'auto' && !S['available-reader-view-modes'].includes(S['default-reader-view-mode']))) S['default-reader-view-mode'] = 'auto';
    if(!S['reader-view-mode'] || !S['available-reader-view-modes'].includes(S['reader-view-mode'])) S['reader-view-mode'] = S['default-reader-view-mode'];
    if(S['available-reader-view-modes'].length == 1) S['fix-reader-view-mode'] = true;
    // --------
    if(O.TouchOS) S['use-loupe-ui'] = false;
    if(S['forget-me'] || !localStorage || S['max-bookmarks'] == 0) S['use-bookmarks'] = false;
    if(!S['use-bookmarks']) S['max-bookmarks'] = 0, S['use-bookmark-ui'] = false;
    if(S['max-histories'] == 0) S['use-histories'] = false;
    if(!S['use-histories']) S['max-histories'] = 0, S['use-history-ui'] = false;
    // --------
    if(S['on-orthogonal-wheel'][0] == 'across') S['on-orthogonal-wheel'][0] = 'move';
    if(S['available-reader-view-modes'].length != 2) {
        const EventNames = ['on-orthogonal-arrowkey', 'on-orthogonal-edgetap', 'on-orthogonal-touchmove', 'on-orthogonal-wheel'];
        switch(S['available-reader-view-modes'].length) {
            case 1: EventNames.forEach(EN => S[EN].forEach((Val, i) => { if(     Val == 'switch') S[EN][i] = ''; })); break;
            case 3: EventNames.forEach(EN =>                           { if(S[EN][0] == 'switch') S[EN][0] = ''; } ); break;
        }
    }
    // --------
    S.Modes = { // 'Mode': { SH: 'ShortHand', CNP: 'ClassNamePrefix' }
               'book-rendition-layout'       : { SH: 'BRL', CNP: 'book' },
                 'book-writing-mode'         : { SH: 'BWM', CNP: 'book' },
             'page-progression-direction'    : { SH: 'PPD', CNP: 'page' },
            'navigation-layout-direction'    : { SH: 'NLD', CNP: 'nav' },
                  'reader-view-mode'         : { SH: 'RVM', CNP: 'view' },
        'available-reader-view-modes_string' : { SH: 'AVM', CNP: 'available' },
                'spread-layout-axis'         : { SH: 'SLA', CNP: 'spread' },
                'spread-layout-direction'    : { SH: 'SLD', CNP: 'spread' },
             'apparent-reading-axis'         : { SH: 'ARA', CNP: 'appearance' },
             'apparent-reading-direction'    : { SH: 'ARD', CNP: 'appearance' }
    };
    for(const Mode in S.Modes) {
        const _ = S.Modes[Mode];
        Object.defineProperty(S, _.SH, { get: () => S[Mode], set: (Val) => S[Mode] = Val });
        delete _.SH;
    }
    // --------
    E.bind('bibi:initialized-book', () => {
        if(S['keep-settings']) {
            const BookBiscuits = I.Oven.Biscuits.remember('Book');
            if(!BookBiscuits) return;
            if(!U['reader-view-mode']              && BookBiscuits.RVM && S['available-reader-view-modes'].includes(BookBiscuits.RVM)) S['reader-view-mode']              = BookBiscuits.RVM;
            if(!U['full-breadth-layout-in-scroll'] && BookBiscuits.FBL                                                               ) S['full-breadth-layout-in-scroll'] = BookBiscuits.FBL;
        }
    });
    // --------
    E.dispatch('bibi:initialized-settings');
};


S.update = (Settings) => {
    const Prev = {}; for(const Mode in S.Modes) Prev[Mode] = S[Mode];
    if(typeof Settings == 'object') for(const Property in Settings) if(typeof S[Property] != 'function') S[Property] = Settings[Property];
    S['book-rendition-layout'] = B.Package.Metadata['rendition:layout'];
    S['book-writing-mode'] = B.WritingMode;
    S['allow-placeholders'] = (S['allow-placeholders'] && B.ExtractionPolicy != 'at-once') ? true : false;
    if(S.FontFamilyStyleIndex) sML.deleteCSSRule(S.FontFamilyStyleIndex);
    if(S['ui-font-family']) S.FontFamilyStyleIndex = sML.appendCSSRule('html', 'font-family: ' + S['ui-font-family'] + ' !important;');
    S['page-progression-direction'] = B.PPD;
    S['spread-layout-axis'] = S['pagination-method'] == 'x' ? (
        S['reader-view-mode'] == 'vertical' ? 'vertical' : 'horizontal'
    ) : (() => {
        if(S['reader-view-mode'] != 'paged') return S['reader-view-mode'];
        if(B.Reflowable) switch(B.WritingMode) {
            case 'tb-rl': case 'tb-lr': return   'vertical'; ////
        }                               return 'horizontal';
    })();
     S['apparent-reading-axis']      = (S['reader-view-mode']   == 'paged'   ) ? 'horizontal' : S['reader-view-mode'];
     S['apparent-reading-direction'] = (S['reader-view-mode']   == 'vertical') ? 'ttb'        : S['page-progression-direction'];
        S['spread-layout-direction'] = (S['spread-layout-axis'] == 'vertical') ? 'ttb'        : S['page-progression-direction'];
    S['navigation-layout-direction'] = (S['fix-nav-ttb'] || S['page-progression-direction'] != 'rtl') ? 'ttb' : 'rtl';
    for(const Mode in S.Modes) {
        const Pfx = S.Modes[Mode].CNP + '-', PC = Pfx + Prev[Mode], CC = Pfx + S[Mode];
        if(PC != CC) O.HTML.classList.remove(PC);
        O.HTML.classList.add(CC);
    }
    C.update();
    E.dispatch('bibi:updated-settings', S);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Compass

//----------------------------------------------------------------------------------------------------------------------------------------------

export const C = {};


C.update = () => {
    C.probe('L', S['spread-layout-axis']   ); // Rules in "L"ayout
    C.probe('A', S['apparent-reading-axis']); // Rules in "A"ppearance
    C.DDD = (() => { switch(S.PPD) { // DDD: Direction-Distance Dictionary
        case 'ltr': return S.ARD != 'ttb' ? { 'left':  -1 , 'right':  1 , 'top': '-1', 'bottom': '1' } : { 'left': '-1', 'right': '1', 'top':  -1 , 'bottom':  1  };
        case 'rtl': return S.ARD != 'ttb' ? { 'left':   1 , 'right': -1 , 'top': '-1', 'bottom': '1' } : { 'left':  '1', 'right':'-1', 'top':  -1 , 'bottom':  1  };
    } })();
};

    C.probe = (L_A, AXIS) => {
        const LR_RL = ['left', 'right']; if(S.PPD != 'ltr') LR_RL.reverse();
        if(AXIS == 'horizontal') {
            C._app(L_A, 'BASE', { b: LR_RL[0], a: LR_RL[1], s: 'top', e: 'bottom' });
            C._app(L_A, 'SIZE', { b: 'height', l: 'width'                         });
            C._app(L_A, 'OOBL', { b: 'top',    l: 'left'                          });
            C._app(L_A, 'OEBL', { b: 'bottom', l: 'right'                         });
            C._app(L_A, 'AXIS', { b: 'y',      l: 'x'                             }); C[L_A + '_AXIS_D'] = S.PPD == 'ltr' ? 1 : -1;
        } else {
            C._app(L_A, 'BASE', { b: 'top', a: 'bottom', s: LR_RL[0], e: LR_RL[1] });
            C._app(L_A, 'SIZE', { b: 'width',  l: 'height'                        });
            C._app(L_A, 'OOBL', { b: 'left',   l: 'top'                           });
            C._app(L_A, 'OEBL', { b: 'right',  l: 'bottom'                        });
            C._app(L_A, 'AXIS', { b: 'x',      l: 'y'                             }); C[L_A + '_AXIS_D'] = 1;
        }
        // BASE: Directions ("B"efore-"A"fter-"S"tart-"E"nd. Top-Bottom-Left-Right on TtB, Left-Right-Top-Bottom on LtR, and Right-Left-Top-Bottom on RtL.)
        // SIZE: Breadth, Length (Width-Height on TtB, Height-Width on LtR and RtL.)
        // OOBL: "O"ffset "O"rigin of "B"readth and "L"ength
        // OEBL: "O"ffset "E"nd of "B"readth and "L"ength
        // AXIS: X or Y for Breadth and Length (X-Y on TtB, Y-X on LtR and RtL), and ±1 for Culcuration of Length (1 on TtB and LtR, -1 on RtL.)
    };

        C._app = (L_A, Gauge, Par) => {
            for(const Pro in Par) C[[L_A, Gauge,                Pro ].join('_')] =                Par[Pro] ,
                                  C[[L_A, Gauge, sML.capitalise(Pro)].join('_')] = sML.capitalise(Par[Pro]);
        };

    C.d2d = (Dir, AOD) => { const Dist = C.DDD[Dir]; return AOD ? Dist * 1 : typeof Dist == 'number' ? Dist : 0; }; // d2d: Direction to Distance // AOD: Allow Orthogonal Direction



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


export const O = {}; // Bibi.Operator


O.log = (Log, A2, A3) => { let Obj = '', Tag = '';
         if(A3)      Obj = A2, Tag = A3;
    else if(/^<..>$/.test(A2)) Tag = A2;
    else if(A2)      Obj = A2;
    switch(Tag) {
        case '<e/>': return console.error(Log);
        case '</g>': O.log.Depth--;
    }
    if(
        (Log || Obj)
            &&
        (O.log.Depth <= O.log.Limit || Tag == '<b:>' || Tag == '</b>' || Tag == '<*/>')
    ) {
        const Time = (O.log.Depth <= 1) ? O.stamp(Log) : 0;
        let Ls = [], Ss = [];
        if(Log) switch(Tag) {
            case '<b:>': Ls.unshift(`📕`); Ls.push('%c' + Log), Ss.push(O.log.BStyle);                Ls.push(`%c(v${ Bibi['version'] })` + (Bibi.Dev ? ':%cDEV' : '')), Ss.push(O.log.NStyle); if(Bibi.Dev) Ss.push(O.log.BStyle); break;
            case '</b>': Ls.unshift(`📖`); Ls.push('%c' + Log), Ss.push(O.log.BStyle); if(O.log.Time) Ls.push(`%c(${ Math.floor(Time / 1000) + '.' + String(Time % 1000).padStart(3, 0) }sec)`), Ss.push(O.log.NStyle); break;
            case '<g:>': Ls.unshift(`┌`); Ls.push(Log); break;
            case '</g>': Ls.unshift(`└`); Ls.push(Log); break;
          //case '<o/>': Ls.unshift( `>`); Ls.push(Log); break;
            default    : Ls.unshift( `-`); Ls.push(Log);
        }
        for(let i = O.log.Depth; i > 1; i--) Ls.unshift('│');
        Ls.unshift('%cBibi:'); Ss.unshift(O.log.NStyle);
        switch(Tag) {
          //case '<o/>': O.log.log('groupCollapsed', Ls, Ss); console.log(Obj); console.groupEnd(); break;
            default    : O.log.log('log',            Ls, Ss,              Obj                    );
        }
    }
    switch(Tag) {
        case '<g:>': O.log.Depth++;
    }
};

    O.log.initialize = () => {
        if(parent && parent != window) return O.log = () => true;
        O.log.Limit = U.hasOwnProperty('log') && typeof (U['log'] *= 1) == 'number' ? U['log'] : 0;
        O.log.Time = O.log.Limit || U.hasOwnProperty('time');
        O.log.Depth = 1;
        O.log.NStyle = 'font: normal normal 10px/1 Menlo, Consolas, monospace;';
        O.log.BStyle = 'font: normal bold   10px/1 Menlo, Consolas, monospace;';
        O.log.distill = (Logs, Styles) => [Logs.join(' ')].concat(Styles);
        O.log.log = (Method, Logs, Styles, Obj) => {
            const Args = O.log.distill(Logs, Styles);
            if(Obj) Args.push(Obj);
            console[Method].apply(console, Args);
        };
    };
/*
O.logSets = (...Args) => {
    let Repeats = [], Sets = []; Sets.length = 1;
    Args.reverse();
    for(let i = 0; i < Args.length; i++) {
        if(!Array.isArray(Args[i])) Args[i] = [Args[i]];
        Repeats[i] = Sets.length;
        Sets.length = Sets.length * Args[i].length;
    }
    Args.reverse(), Repeats.reverse();
    for(let i = 0; i < Sets.length; i++) Sets[i] = '';
    Args.forEach((_AA, i) => {
        let s = 0;
        while(s < Sets.length) _AA.forEach(_A => {
            let r = Repeats[i];
            while(r--) Sets[s++] += _A;
        });
    });
    Sets.forEach(Set => console.log('- ' + Set + ': ' + eval(Set)));
};*/


O.error = (Err) => {
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('loading');
    O.HTML.classList.remove('waiting');
    I.notify(Err, { Type: 'Error', Time: 99999999999 });
    O.log(Err, '<e/>');
    E.dispatch('bibi:x_x', typeof Err == 'string' ? new Error(Err) : Err);
};


O.id = () => (O.id.Count++).toString(36); O.id.Count = 0; // [Date.now(), performance.now(), Math.random()].map(Num => Math.ceil(Num * 9999).toString(36)).join('');

O.chain = (...Args) => {
    const Assurance = typeof Args[0]?.assure !== 'function' ? { assure: () => true } : typeof Args[0] !== 'function' ? Args.shift() : Args[0];
    const { assure } = Assurance;
    const Tasks = Args;
    return (async () => {
        let Value;
        if(!Tasks.length) {
            if(!assure()) throw O.chain.error(Assurance);
        } else {
            for(let l = Tasks.length, i = 0; i < l; i++) {
                if(!assure()) throw O.chain.error(Assurance, Tasks, i);
                Value = await (typeof Tasks[i] != 'function' ? Tasks[i] : Tasks[i](Value));
            }
            if(!assure()) throw O.chain.error(Assurance, Tasks);
        }
        return Value;
    })();
};
    O.chain.error = (Assurance, Tasks, i) => (Assurance.Label && typeof Assurance.Label == 'string' ? `[${ Assurance.Label }] ` : '') + `Assurance failed` + (
                 !Tasks ? '' :
        i !== undefined ? ` before ` + (Tasks.length == 1 ? 'the task' : !i ? `the ${ Tasks.length } tasks`  : `the ${ O.ordinal(i + 1) } of the ${ Tasks.length } tasks (tasks[${ i }])`) :
                           ` after ` + (Tasks.length == 1 ? 'the task' : `all of the ${ Tasks.length } tasks`)
    );


O.ordinal = i => i + (() => {
    if((i = i % 100) < 4 || 20 < i) switch(i % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
    }           return 'th';
})();


O.TimeCard = {};

O.getTimeLabel = (TimeFromOrigin = Date.now() - Bibi.TimeOrigin) => [
    TimeFromOrigin / 1000 / 60 / 60,
    TimeFromOrigin / 1000 / 60 % 60,
    TimeFromOrigin / 1000 % 60
].map(Val => String(Math.floor(Val)).padStart(2, 0)).join(':') + '.' + String(TimeFromOrigin % 1000).padStart(3, 0);

O.stamp = (What, TimeCard = O.TimeCard) => {
    const TimeFromOrigin = Date.now() - Bibi.TimeOrigin;
    const TimeLabel = O.getTimeLabel(TimeFromOrigin);
    if(!TimeCard[TimeLabel]) TimeCard[TimeLabel] = [];
    TimeCard[TimeLabel].push(What);
    return TimeFromOrigin;
};


O.isToBeExtractedIfNecessary = (Path) => {
    if(!Path || !S['extract-if-necessary'].length) return false;
    if(S['extract-if-necessary'].includes('*')) return true;
    if(S['extract-if-necessary'].includes( '')) return !/(\.[\w\d]+)+$/.test(Path);
    for(let l = S['extract-if-necessary'].length, i = 0; i < l; i++) if(new RegExp(S['extract-if-necessary'][i].replace(/\./g, '\\.') + '$', 'i').test(Path)) return true;
    return false;
};


O.src = (Source) => {
    if(!B.Package.Manifest[Source.Path]) B.Package.Manifest[Source.Path] = Source;
    if(!Source['media-type']) Source['media-type'] = O.getMediaType(Source.Path);
    return B.Package.Manifest[Source.Path];
};


O.RangeLoader = null;

O.cancelExtraction = (Source) => Promise.allSettled(
    (Source.Resources || []).concat(Source).map(Res => Res.Retlieved || O.RangeLoader?.abort(Res.Path))
).then(() =>
    E.dispatch('bibi:canceled-extraction', Source)
);

O.extract = (Source) => { 
    Source = O.src(Source);
    if(Source.Retlieving) return Source.Retlieving;
    if(Source.Content) return Promise.resolve(Source);
    if(Source.URI) return O.download(Source);
    return Source.Retlieving = O.RangeLoader.getBuffer(Source.Path).then(ABuf => {
        if(O.isBin(Source)) Source.DataType = 'Blob', Source.Content = new Blob([ABuf], { type: Source['media-type'] });
        else                Source.DataType = 'Text', Source.Content = new TextDecoder('utf-8').decode(new Uint8Array(ABuf));
        Source.Retlieved = true;
        delete Source.Retlieving;
        return Source;
    }).catch(Err => {
        delete Source.Retlieving;
        return Promise.reject(
            O.extract.UseErrorAsIsOnRejection ?                Err :
                  /404/.test(Err) ? Bibi.ErrorMessages.NotFound    :
              /aborted/.test(Err) ? Bibi.ErrorMessages.Canceled    :
                /fetch/.test(Err) ? Bibi.ErrorMessages.CORSBlocked :
            /not found/.test(Err) ? Bibi.ErrorMessages.DataInvalid :
              /invalid/.test(Err) ? Bibi.ErrorMessages.DataInvalid : Err
        );
    });
};          O.extract.UseErrorAsIsOnRejection = false;

O.download = (Source) => {
    Source = O.src(Source);
    if(Source.Retlieving) return Source.Retlieving;
    if(Source.Content) return Promise.resolve(Source);
    const IsBin = O.isBin(Source);
    return Source.Retlieving = W.and('retlieve')(
        Source.URI ? Source.URI : (/^([a-z]+:\/\/|\/)/.test(Source.Path) ? '' : B.Path + '/') + Source.Path,
        IsBin ? 'blob' : 'text'
    ).then(Data => {
        Source.DataType = IsBin ? 'Blob' : 'Text';
        Source.Content = Data;
        Source.Retlieved = true;
        delete Source.Retlieving;
        return Source;
    }).catch(Res => {
        delete Source.Retlieving;
        return Promise.reject(
            Res.status == 404 ? Bibi.ErrorMessages.NotFound :
            Res.status ==   0 ? Bibi.ErrorMessages.CORSBlocked :
        Res.status + ' ' + Res.statusText);
    });
};

O.tryRangeRequest = (RemotePath, Bytes = '0-0') => new Promise((resolve, reject) => {
    if(typeof RemotePath != 'string' || !/^https?:\/\//.test(RemotePath) || !S['trustworthy-origins'].includes(new URL(RemotePath).origin)) return reject();
    const XHR = new XMLHttpRequest();
    XHR.onloadend = () => XHR.status != 206 ? reject() : resolve();
    XHR.open('GET', RemotePath, true);
    if(S['request-with-credentials']) XHR.withCredentials = true;
    XHR.setRequestHeader('Range', 'bytes=' + Bytes);
    XHR.send(null);
});

O.file = (Source, Opt = {}) => new Promise((resolve, reject) => {
    Source = O.src(Source);
    Promise.resolve().then(() => {
        if(Opt.URI && Source.URI) return Source;
        if(Source.Content) return Source;
        if(Source.URI || !B.ExtractionPolicy) return O.download(Source);
        switch(B.ExtractionPolicy) {
            case 'on-the-fly': return O.extract(Source);
            case 'at-once':    return Promise.reject(`File Not Included: "${ Source.Path }"`);
        }
    }).then(() =>
        typeof Opt.initialize == 'function' ? Opt.initialize(Source) : Opt.initialize
    ).then(() =>
        Opt.Preprocess && !Source.Preprocessed ? O.preprocess(Source) : Source
    ).then(() =>
        Opt.URI && !Source.URI && (!Opt.DataURI ? O.createBlobURL : O.createDataURL)(Source.DataType, Source.Content, Source['media-type']).then(SourceURI => {
            Source.URI = SourceURI;
            Source.Content = ''; //////
        })
    ).then(() =>
        typeof Opt.finalize == 'function' ? Opt.finalize(Source) : Opt.finalize
    ).then(() =>
        resolve(Source)
    ).catch(
        reject
    );
});


O.isBin = (Source) => /\.(aac|gif|jpe?g|m4[av]|mp([34]|e?g)|ogg|[ot]tf|pdf|png|web[mp]|woff2?)$/i.test(Source.Path.split('?')[0]);

O.createDataURL = (DT, CB, MT) => new Promise((o, x) => DT == 'Text' ? o(`data:` + MT + `;base64,` + btoa(String.fromCharCode.apply(null, new TextEncoder().encode(CB)))) : (_ => { _.onload = () => o(_.result); _.onerror = x; _.readAsDataURL(CB); })(new FileReader()));
O.createBlobURL = (DT, CB, MT) => Promise.resolve(URL.createObjectURL(DT == 'Text' ? new Blob([CB], { type: MT }) : CB));
// O.consumeBlobURL = (BURL, fn) => { const ReturnValue = fn(BURL); URL.revokeObjectURL(BURL); return ReturnValue; };

O.relativePath = (Opt) => { // Opt: { From: URLObject, To: URLObject, /* AllowRootRelative: Boolean */ }
    let [T, F] = [Opt.To, Opt.From].map(TF => typeof TF == 'string' ? new URL(TF, 'bibi:/') : TF);
    if(T.origin != F.origin) return T.href;
    if(T.pathname == F.pathname) return T.pathname.split('/').slice(-1)[0];
    [T, F] = [T, F].map(TF => TF.pathname.slice(1).split('/'));
    if(Opt.AllowRootRelative) if(T.length == 1 || T[0] != F[0]) return '/' + T.join('/');
    while(T[0] == F[0] && F[0]) T.shift(), F.shift();
    while(F.length > 1) T.unshift('..'), F.shift();
    return T.join('/'); 
};


O.MediaTypes = {
    'pdf'     : 'application/pdf',
    'ya?ml'   : 'application/x-yaml',
    'xht(ml)?': 'application/xhtml+xml',
    'xml'     : 'application/xml',
    'aac'     :       'audio/aac',
    'mp3'     :       'audio/mpeg',
    'otf'     :        'font/opentype',
    'ttf'     :        'font/truetype',
    'woff'    :        'font/woff',
    'woff2'   :        'font/woff2',
    'gif'     :       'image/gif',
    'jpe?g'   :       'image/jpeg',
    'png'     :       'image/png',
    'svg'     :       'image/svg+xml',
    'webp'    :       'image/webp',
    'css'     :        'text/css',
    'js'      :        'text/javascript',
    'html?'   :        'text/html',
    'mp4'     :       'video/mp4',
    'webm'    :       'video/webm'
};

O.getMediaType = (FileName) => {
    for(const Ext in O.MediaTypes) if(new RegExp('\\.' + Ext + '$').test(FileName)) return O.MediaTypes[Ext];
    return null;
};

O.getItemType = (MediaType) => { switch(MediaType?.replace?.(/^([^\/]+\/)?([^\+]*)(\+.+)?$/, '$2')) {
    case 'html': case 'xhtml': case 'xml':            return 'MarkupDocument';
    case 'svg':                                       return 'SVG';
    case 'gif': case 'jpeg': case 'png': case 'webp': return 'BitmapImage';
} return ''; };


O.preprocess = (Source) => {
    Source = O.src(Source);
    const Resources = [];
    const Setting = O.preprocess.getSetting(Source.Path);
    if(!Setting) {
        return Promise.resolve(Source);
    }
    const Promises = [];
    if(Setting.ReplaceRules) Source.Content = Setting.ReplaceRules.reduce((SourceContent, Rule) => SourceContent.replace(Rule[0], Rule[1]), Source.Content);
    if(Setting.ResolveRules) { // RRR
        const FileDir = Source.Path.replace(/\/?[^\/]+$/, '');
        Setting.ResolveRules.forEach(ResolveRule => ResolveRule.Patterns.forEach(Pattern => {
            const ResRE = ResolveRule.getRE(Pattern);
            const Reses = Source.Content.match(ResRE);
            if(!Reses) return;
            const ExtRE = new RegExp('\\.(' + Pattern.Extensions + ')$', 'i');
            Reses.forEach(Res => {
                const ResPathInSource = Res.replace(ResRE, ResolveRule.PathRef);
                const ResPaths = O.rrr(FileDir + '/' + ResPathInSource).split('#');
                if(!ExtRE.test(ResPaths[0])) return;
                const Resource = O.src({ Path: ResPaths[0] });
                Resources.push(Resource);
                Promises.push(O.file(Resource, { Preprocess: true, URI: true }).then(ChildSource => {
                    ResPaths[0] = ChildSource.URI;
                    Source.Content = Source.Content.replace(Res, Res.replace(ResPathInSource, ResPaths.join('#')));
                }));
            });
        }));
    }
    return Promise.all(Promises).then(() => {
        Source.Preprocessed = true;
        Source.Resources = Resources;
        return Source;
    });
};

    O.preprocess.getSetting = (FilePath) => { const PpSs = O.preprocess.Settings;
        for(const Ext in PpSs) if(new RegExp('\\.(' + Ext + ')$', 'i').test(FilePath)) return typeof PpSs[Ext].init == 'function' ? PpSs[Ext].init() : PpSs[Ext];
        return null;
    };

    O.preprocess.Settings = {
        'css': {
            ReplaceRules: [
                [/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, ''],
                [/[\r\n]+/g, '\n']
            ],
            ResolveRules: [{
                getRE: () => /@import\s+["'](?!(?:https?|data):)(.+?)['"]/g,
                PathRef: '$1',
                Patterns: [
                    { Extensions: 'css' }
                ]
            }, {
                getRE: () => /@import\s+url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g,
                PathRef: '$1',
                Patterns: [
                    { Extensions: 'css' }
                ]
            }, {
                getRE: () => /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g,
                PathRef: '$1',
                Patterns: [
                    { Extensions: 'gif|jpe?g|[ot]tf|png|svg|webp|woff2?' }
                ]
            }],
            init: function() { const RRs = this.ReplaceRules;
                RRs.push([/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/gm, 'column-count: auto$3']);
                RRs.push([/(-(epub|webkit)-)?text-underline-position\s*:/gm, 'text-underline-position:']);
                if(sML.UA.Chromium || sML.UA.WebKit) {
                    return this;
                }
                RRs.push([/-(epub|webkit)-/gm, '']);
                if(sML.UA.Gecko) {
                    RRs.push([/text-combine-horizontal\s*:\s*([^;\}]+)\s*([;\}])/gm, 'text-combine-upright: $1$2']);
                    RRs.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-upright: all$1']);
                    return this;
                }
                if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
                    RRs.push([/text-align\s*:\s*justify\s*([;\}])/gm, 'text-align: justify; text-justify: inter-ideograph$1']);
                }
                //delete this.init;
                return this;
            }
        },
        'html?|xht(ml)?|xml|svg': {
            ReplaceRules: [
                [/<!--\s+[.\s\S]*?\s+-->/gm, '']
            ],
            ResolveRules: [{
                getRE: (Pattern) => new RegExp(`<\\??\\s*${ Pattern.TagName || '[a-zA-Z:\\-]+' }\\s(?:[^>]*?\\s)?(${ Pattern.Attribute })\\s*=\\s*["\'](?!(?:https?|data):)(.+?)[\'"]`, 'g'),
                PathRef: '$2',
                Patterns: [
                    { TagName: '(?!a)[a-zA-Z:\\-]+', Attribute: '(?:xlink:)?href', Extensions: 'css|gif|jpe?g|png|svg|webp' },
                    { TagName: '',                   Attribute: 'src|data',        Extensions: 'aac|gif|jpe?g|js|m4[av]|mp([34]|e?g)|ogg|png|svg|web[mp]' },
                    { TagName: 'video',              Attribute: 'poster',          Extensions: 'gif|jpe?g|png|svg|webp' }
                ]
            }]
        }
    };


O.parseDOM = (...Args) => new DOMParser().parseFromString(...Args);

O.openDocument = (Source) => O.file(Source).then(Source => O.parseDOM(Source.Content, /\.(xml|opf|ncx)$/i.test(Source.Path) ? 'text/xml' : 'application/xhtml+xml'));


O.forEachCSSRuleOf = (Doc = document, fun) => {
    if(!Doc.styleSheets || typeof fun != 'function') return;
    Array.prototype.forEach.call(Doc.styleSheets, StyleSheet => {
        (function forCSSRules(CSSRules) {
            Array.prototype.forEach.call(CSSRules, CSSRule => {
                switch(CSSRule.constructor.name) {
                    case 'CSSStyleRule': fun(CSSRule); break;
                    case 'CSSImportRule': forCSSRules(CSSRule.styleSheet.cssRules); break;
                    case 'CSSMediaRule': forCSSRules(CSSRule.cssRules); break;
                    case 'CSSFontFaceRule': break;
                    default: break; // console.log(CSSRule.constructor.name, CSSRule);
                }
            });
        })(StyleSheet.cssRules);
    });
};


O.getWritingMode = (Ele) => {
    const WMP = O.WritingModeProperty, CS = getComputedStyle(Ele);
    if(!WMP)                                return (CS['direction'] == 'rtl' ? 'rl' : 'lr') + '-tb';
    switch(CS[WMP]) { case 'horizontal-tb': return (CS['direction'] == 'rtl' ? 'rl' : 'lr') + '-tb';
                      case   'vertical-rl': return (CS['direction'] == 'rtl' ? 'bt' : 'tb') + '-rl';
                      case   'sideways-rl': return (CS['direction'] == 'rtl' ? 'bt' : 'tb') + '-rl';
                      case   'vertical-lr': return (CS['direction'] == 'rtl' ? 'bt' : 'tb') + '-lr';
                      case   'sideways-lr': return (CS['direction'] == 'rtl' ? 'tb' : 'bt') + '-lr';
    }                                       return  CS[WMP];
};


O.getElementInnerText = (Ele) => {
    let InnerText = 'InnerText';
    const Copy = document.createElement('div');
    Copy.innerHTML = Ele.innerHTML.replace(/ (src(set)?|source|(xlink:)?href)=/g, ' data-$1=');
    sML.forEach(Copy.querySelectorAll('svg'   ))(Ele => Ele.parentNode.removeChild(Ele));
    sML.forEach(Copy.querySelectorAll('video' ))(Ele => Ele.parentNode.removeChild(Ele));
    sML.forEach(Copy.querySelectorAll('audio' ))(Ele => Ele.parentNode.removeChild(Ele));
    sML.forEach(Copy.querySelectorAll('img'   ))(Ele => Ele.parentNode.removeChild(Ele));
    sML.forEach(Copy.querySelectorAll('script'))(Ele => Ele.parentNode.removeChild(Ele));
    sML.forEach(Copy.querySelectorAll('style' ))(Ele => Ele.parentNode.removeChild(Ele));
    /**/ if(typeof Copy.textContent != 'undefined') InnerText = Copy.textContent;
    else if(typeof Copy.innerText   != 'undefined') InnerText = Copy.innerText;
    return InnerText.replace(/[\r\n\s\t ]/g, '');
};


O.getElementCoord = (Ele, OPa) => {
    const Coord = { X: Ele.offsetLeft, Y: Ele.offsetTop };
    OPa = OPa && OPa.tagName ? OPa : null;
    while(Ele.offsetParent != OPa) Ele = Ele.offsetParent, Coord.X += Ele.offsetLeft, Coord.Y += Ele.offsetTop;
    return Coord;
};


O.getViewportZooming = () => document.body.clientWidth / window.innerWidth;


O.rrr = (Path) => { // resolve relative reference
    // return new URL(Path.replace(/(^|[^:\/])\/{2,}/g, '$1/'), 'https://bibi/').href.replace(/^https:\/\/bibi\//, '');
    const VirtualLoc = new URL(Path.replace(/(^|[^:\/])\/{2,}/g, '$1/'), 'https://bibi/');
    const RelativePath = VirtualLoc.pathname.replace(/^\/+/, '');
    const HashString = VirtualLoc.hash ? VirtualLoc.hash.replace(/^#/, '') : '';
    return RelativePath + (HashString ? '#' + HashString : '');
};


O.getViewportByMetaContent = (Str) => {
    if(typeof Str == 'string' && /width/.test(Str) && /height/.test(Str)) {
        Str = Str.replace(/\s+/g, '');
        const W = Str.replace( /^.*?width=(\d+).*$/, '$1') * 1;
        const H = Str.replace(/^.*?height=(\d+).*$/, '$1') * 1;
        if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
    }
    return null;
};

O.getViewportByViewBox = (Str) => {
    if(typeof Str == 'string') {
        const XYWH = Str.replace(/^\s+/, '').replace(/\s+$/, '').split(/\s+/);
        if(XYWH.length == 4) {
            const W = XYWH[2] * 1;// - XYWH[0] * 1;
            const H = XYWH[3] * 1;// - XYWH[1] * 1;
            if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
        }
    }
    return null;
};

O.getViewportByImage = (Img) => {
    if(Img && /^img$/i.test(Img.tagName)) {
        const ImageStyle = getComputedStyle(Img);
        return { Width: parseInt(ImageStyle.width), Height: parseInt(ImageStyle.height) };
    }
    return null;
};

O.getViewportByOriginalResolution = (Str) => {
    if(typeof Str == 'string') {
        const WH = Str.replace(/\s+/, '').split('x');
        if(WH.length == 2) {
            const W = WH[0] * 1;
            const H = WH[1] * 1;
            if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
        }
    }
    return null;
};

O.getItemViewport = async (Item) => O.getItemViewport.as[Item.Type]?.(Item) || null; /* + */ O.getItemViewport.as = {
  'MarkupDocument': async (Item) => O.getViewportByMetaContent(O.parseDOM(Item.Source.Content.replace(/(<body(\s[^>]*)?>)(.|\s)*?(<\/body>)/, '$1$4'), Item.Source['media-type'])?.querySelector('meta[name="viewport"]')?.getAttribute('content')),
             'SVG': async (Item) => O.getViewportByViewBox(    O.parseDOM(Item.Source.Content.replace( /(<svg(\s[^>]*)?>)(.|\s)*?(<\/svg>)/ , '$1$4'), Item.Source['media-type'])?.documentElement?.getAttribute('viewBox')),
     'BitmapImage': async (Item) => new Promise((o, x) => sML.create('img', { onload: function() { const W = this.naturalWidth, H = this.naturalHeight; W && H ? o({ Width: W, Height: H }) : x(); }, onerror: x }).src = Item.Source.URI).catch(() => null)
};


O.isPointableContent = (Ele) => {
    while(Ele) {
        if(/^(a|audio|video)$/i.test(Ele.tagName)) return true;
        Ele = Ele.parentElement;
    }
    return false;
};


O.stopPropagation = (Eve) => { Eve.stopPropagation(); return false; };

O.preventDefault  = (Eve) => { Eve.preventDefault();  return false; };


O.CFIManager = { // Utilities for EPUBCFI (An Example Is at the Bottom of This Object)
    CFI: '',
    Current: 0,
    Log: false,
    LogCorrection: false,
    LogCancelation: false,
    parse: function(CFI, Scope) {
        if(!CFI || typeof CFI != 'string') return null;
        try { CFI = decodeURIComponent(CFI); } catch(Err) { this.log(0, `Unregulated URIEncoding.`); return null; }
        if(!Scope || typeof Scope != 'string' || typeof this['parse' + Scope] != 'function') Scope = 'Fragment';
        if(Scope == 'Fragment') CFI = CFI.replace(/^(epubcfi\()?/, 'epubcfi(').replace(/(\))?$/, ')');
        this.CFI = CFI, this.Current = 0;
        if(this.Log) {
            this.log(1, `Bibi EPUBCFI`);
            this.log(2, `parse`);
            this.log(3, `CFI: ${ this.CFI }`);
        }
        return this['parse' + Scope]();
    },
    parseFragment: function() {
        const Foothold = this.Current;
        if(!this.parseString('epubcfi(')) return this.cancel(Foothold, `Fragment`);
        const CFIStructure = this.parseCFI();
        if(CFIStructure === null) return this.cancel(Foothold);
        if(!this.parseString(')')) return this.cancel(Foothold, `Fragment`);
        return CFIStructure;
    },
    parseCFI: function() {
        const Foothold = this.Current, CFIStructure = { Type: 'CFI', Path: this.parsePath() };
        if(!CFIStructure.Path) return this.cancel(Foothold, `CFI`);
        if(this.parseString(',')) {
            CFIStructure.Start = this.parseLocalPath();
            if(!CFIStructure.Start.Steps.length && !CFIStructure.Start.TermStep) return this.cancel(Foothold, `CFI > Range`);
            if(!this.parseString(',')) return this.cancel(Foothold, 'CFI > Range');
            CFIStructure.End   = this.parseLocalPath();
            if(  !CFIStructure.End.Steps.length &&   !CFIStructure.End.TermStep) return this.cancel(Foothold, `CFI > Range`);
        }
        return CFIStructure;
    },
    parsePath: function() {
        const Foothold = this.Current, Path = { Type: 'Path', Steps: [this.parseStep()] }, LocalPath = this.parseLocalPath();
        if(!Path.Steps[0]) return this.cancel(Foothold, `Path`);
        if(LocalPath) Path.Steps = Path.Steps.concat(LocalPath.Steps);
        else return this.cancel(Foothold, `Path`);
        return Path;
    },
    parseLocalPath: function() {
        const Foothold = this.Current, LocalPath = { Type: 'LocalPath', Steps: [] };
        let StepRoot = LocalPath, Step = this.parseStep('Local'), TermStep = null;
        while(Step !== null) {
            StepRoot.Steps.push(Step);
            Step = this.parseStep('Local');
            if(!Step) break;
            if(Step.Type == 'IndirectStep') {
                const IndirectPath = { Type: 'IndirectPath', Steps: [] };
                StepRoot.Steps.push(IndirectPath);
                StepRoot = IndirectPath;
            } else if(Step.Type == 'TermStep') {
                TermStep = Step;
                break;
            }
        }
        if(TermStep) StepRoot.Steps.push(TermStep);
        return (LocalPath.Steps.length ? LocalPath : null);
    },
    parseStep: function(Local) {
        const Foothold = this.Current, Step = {};
             if(         this.parseString( '/')) Step.Type =         'Step';
        else if(Local && this.parseString('!/')) Step.Type = 'IndirectStep';
        else if(Local && this.parseString( ':')) Step.Type =     'TermStep';
        else                                     return this.cancel(Foothold, `Step`);
        Step.Index = this.parseString(/^(0|[1-9][0-9]*)/);
        if(Step.Index === null) return this.cancel(Foothold, `Step`);
        Step.Index = parseInt(Step.Index);
        if(this.parseString('[')) {
            if(Step.Type != 'TermStep') {
                Step.ID = this.parseString(/^[a-zA-Z_:][a-zA-Z0-9_:\-\.]+/);
                if(!Step.ID) return this.cancel(Foothold, `Step > Assertion > ID`);
            } else {
                const CSV = [], ValueRegExp = /^((\^[\^\[\]\(\)\,\;\=])|[_a-zA-Z0-9%\- ])*/;
                CSV.push(this.parseString(ValueRegExp));
                if(this.parseString(',')) CSV.push(this.parseString(ValueRegExp));
                if(CSV[0]) Step.Preceding = CSV[0];
                if(CSV[1]) Step.Following = CSV[1];
                const Side = this.parseString(/^;s=/) ? this.parseString(/^[ab]/) : null;
                if(Side) Step.Side = Side;
                if(!Step.Preceding && !Step.Following && !Step.Side) return this.cancel(Foothold, `Step > Assertion > TextLocation`);
            }
            if(!this.parseString(']')) return this.cancel(Foothold, `Step > Assertion`);
        }
        return Step;
    },
    parseString: function(TheString) {
        let Correction = null, Matched = false;
        if(TheString instanceof RegExp) {
            const CFI = this.CFI.substring(this.Current, this.CFI.length);
            if(TheString.test(CFI)) {
                Matched = true;
                TheString = CFI.match(TheString)[0];
            }
        } else if(this.CFI.substring(this.Current, this.Current + TheString.length) === TheString) {
            Matched = true;
        }
        if(Matched) {
            this.Current += TheString.length;
            Correction = TheString;
        }
        return this.correct(Correction);
    },
    correct: function(Correction) {
        if(this.Log && this.LogCorrection && Correction) this.log(3, Correction);
        return Correction;
    },
    cancel: function(Foothold, Parser) {
        if(this.Log && this.LogCancelation) this.log(4, `cancel: parse ${ Parser } (${ Foothold }-${ this.Current }/${ this.CFI.length })`);
        if(typeof Foothold == 'number') this.Current = Foothold;
        return null;
    },
    log: function(Lv, Message) {
        if(!this.Log) return;
             if(Lv == 0) Message = `[ERROR] ${ Message }`;
        else if(Lv == 1) Message = `---------------- ${ Message } ----------------`;
        else if(Lv == 2) Message = Message;
        else if(Lv == 3) Message = ` - ${ Message }`;
        else if(Lv == 4) Message = `   . ${ Message }`;
        O.log(`EPUBCFI: ${ Message }`);
    }
    /* -----------------------------------------------------------------------------------------------------------------
    // EXAMPLE:
    O.CFIManager.parse('epubcfi(/6/4!/4/10!/4/2:32[All%20You%20Need%20Is,%20Love;s=a])'); // returns following object.
    --------------------------------------------------------------------------------------------------------------------
    {
        Type: 'CFI',
        Path: {
            Type: 'Path',
            Steps: [
                {
                    Type: 'Step',
                    Index: '6'
                },
                {
                    Type: 'Step',
                    Index: '4'
                },
                {
                    Type: 'IndirectPath',
                    Steps: [
                        {
                            Type: 'IndirectStep',
                            Index: '4'
                        },
                        {
                            Type: 'Step',
                            Index: '10'
                        },
                        {
                            Type: 'IndirectPath',
                            Steps: [
                                {
                                    Type: 'IndirectStep',
                                    Index: '4'
                                },
                                {
                                    Type: 'Step',
                                    Index: '2'
                                }
                            ],
                            TermStep: {
                                Type: 'TermStep',
                                Index: '32',
                                Preceding: 'All You Need Is',
                                Following: ' Love',
                                Side: 'a'
                            }
                        }
                    ]
                }
            ]
        }
    }
    ----------------------------------------------------------------------------------------------------------------- */
};


O.inhibit = () => { // What a...
    if(!Array.isArray(S['inhibit']) || !S['inhibit'].length) return;
    const InhibitAll = S['inhibit'].includes('*');
    const VPs = ['-webkit-', '-moz-', '-ms-', ''];
    const ActionsOnPostprocessedItem = [];
    if(InhibitAll || S['inhibit'].includes('selecting')) {
        ActionsOnPostprocessedItem.push(Item => VPs.forEach(Prefix => ['user-select', 'user-drag'].forEach(Property => Item.Body.style[Prefix + Property] = 'none')));
    }
    if(InhibitAll || S['inhibit'].includes('saving-images')) {
        ActionsOnPostprocessedItem.push(Item => sML.forEach(Item.Body.querySelectorAll('img, image, svg'))(Img => {
            VPs.forEach(Prefix => {
                ['user-select', 'user-drag'].forEach(Property => Img.style[Prefix + Property] = 'none');
                if(O.Touch) Img.style[Prefix + 'pointer-events'] = 'none';
            });
            Img.draggable = false;
            Img.addEventListener('contextmenu', O.preventDefault);
        }));
    }
    if(InhibitAll || S['inhibit'].includes('contextual-menu')) {
        ActionsOnPostprocessedItem.push(Item => Item.contentDocument.addEventListener('contextmenu', O.preventDefault));
    }
    if(InhibitAll || S['inhibit'].includes('printing')) {
        window.addEventListener('beforeprint', () => (O.HTML.style.background = 'transparent') && (O.Body.style.visibility = 'hidden'));
        window.addEventListener( 'afterprint', () => (O.HTML.style.background =            '') || (O.Body.style.visibility =       ''));
        const CSSURLs = ((CSSs, Zero) => CSSs.map(CSS => URL.createObjectURL(new Blob([`@charset "utf-8";`, '\n', Object.keys(CSS).map(Sel => [Sel, '{', (CSS[Sel] || Zero), '}'].join(' ')).join('\n').replace(/;/g, ' !important;')], { type: 'text/css' }))))([{
            'html, html:before': [
                `display: block; visibility: visible; box-sizing: border-box; overflow: hidden;`,
                `top: 0; right: 0; bottom: 0; left: 0; inset: 0; margin: 0; border: none 0;`,
                `width: 100%; height: 100%; inline-size: 100%; block-size: 100%; min-width: 100%; min-height: 100%; min-inline-size: 100%; min-block-size: 100%; max-width: 100%; max-height: 100%; max-inline-size: 100%; max-block-size: 100%;`,
                `background: transparent; opacity: 1;`,
            ].join(' '),
            'html': `position: static; z-index: auto; padding: 0; font: normal 0/0 sans-serif; color: transparent;`,
            'html:before': `content: "(non-printable)"; position: fixed; z-index: 88; padding: 44% 0 0; text-align: center; font: normal 8vw/2 HelveticaNeue, Helvetica, Arial, sans-serif; color: rgb(234,234,234);`,
            'html:after, html *': null
        }, {
            'html, html:before, html:after, html *' : null
        }], [
            `content: none; display: none; visibility: hidden; box-sizing: border-box; overflow: hidden;`,
            `position: absolute; z-index: 0; top: 0; right: 0; bottom: 0; left: 0; inset: 0; margin: 0; border: none 0; padding: 0;`,
            `width: 0; height: 0; inline-size: 0; block-size: 0; min-width: 0; min-height: 0; min-inline-size: 0; min-block-size: 0; max-width: 0; max-height: 0; max-inline-size: 0; max-block-size: 0;`,
            `font: normal 0/0 sans-serif; color: transparent; background: transparent; opacity: 0;`
        ].join(' '));
        const appendLink = (Doc, i) => Doc.head.appendChild(sML.create('link', { rel: 'stylesheet', media: 'print', href: CSSURLs[i] }));
        const repairLink = (Doc, i) => Doc.querySelector('link[media~="print"][href^="' + CSSURLs[i] + '"]') || appendLink(Doc, i);
        const manageLink = (Win, i) => {
            const Doc = Win.document, Windows = [window]; if(Win != window) Windows.push(Win);
            Windows.forEach(Window => {
                Window.addEventListener('beforeprint', () => repairLink(Doc, i));
                Window.addEventListener( 'afterprint', () => repairLink(Doc, i));
            });
            appendLink(Doc, i);
        };
        manageLink(window, 0), ActionsOnPostprocessedItem.push(Item => manageLink(Item.contentWindow, 1));
    }
    if(ActionsOnPostprocessedItem.length) E.bind('bibi:postprocessed-item', (Item) => ActionsOnPostprocessedItem.forEach(action => action(Item)));
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events

//----------------------------------------------------------------------------------------------------------------------------------------------


export const E = {};


E.initialize = () => {
    if(document.onpointerdown !== undefined) {
        E['pointerdown'] = 'pointerdown';
        E['pointermove'] = 'pointermove';
        E['pointerup']   = 'pointerup';
        E['pointerover'] = 'pointerover';
        E['pointerout']  = 'pointerout';
    } else if(O.TouchOS && document.ontouchstart !== undefined) {
        E['pointerdown'] = 'touchstart';
        E['pointermove'] = 'touchmove';
        E['pointerup']   = 'touchend';
    } else {
        E['pointerdown'] = 'mousedown';
        E['pointermove'] = 'mousemove';
        E['pointerup']   = 'mouseup';
        E['pointerover'] = 'mouseover';
        E['pointerout']  = 'mouseout';
    }
    E.CPO_000 = { capture: false, passive: false, once: false };
    E.CPO_010 = { capture: false, passive:  true, once: false };
    E.CPO_100 = { capture:  true, passive: false, once: false };
    E.CPO_110 = { capture:  true, passive:  true, once: false };
    E.stopPropagation = (Eve) => Eve.stopPropagation();
    E.preventDefault  = (Eve) => Eve.preventDefault();
    //sML.applyRtL(E, new sML.CustomEvents('bibi'));
    E.CustomEvents = new sML.CustomEvents('bibi');
    E.add = function(/*[Tar,]*/ Nam, fun, Opt) {
        if(Array.isArray(arguments[0])                                        ) return arguments[0].forEach(AI => E.add(AI, arguments[1], arguments[2], arguments[3]));
        if(Array.isArray(arguments[1])                                        ) return arguments[1].forEach(AI => E.add(arguments[0], AI, arguments[2], arguments[3]));
        if(Array.isArray(arguments[2]) && typeof arguments[2][0] == 'function') return arguments[2].forEach(AI => E.add(arguments[0], arguments[1], AI, arguments[3]));
        let Tar = document; if(typeof fun != 'function') Tar = arguments[0], Nam = arguments[1], fun = arguments[2], Opt = arguments[3];
        return /^bibi:/.test(Nam) ? E.CustomEvents.add(Tar, Nam, fun) : Tar.addEventListener(Nam, fun, Opt);
    };
    E.remove = function(/*[Tar,]*/ Nam, fun, Opt) {
        if(Array.isArray(arguments[0])                                        ) return arguments[0].forEach(AI => E.remove(AI, arguments[1], arguments[2], arguments[3]));
        if(Array.isArray(arguments[1])                                        ) return arguments[1].forEach(AI => E.remove(arguments[0], AI, arguments[2], arguments[3]));
        if(Array.isArray(arguments[2]) && typeof arguments[2][0] == 'function') return arguments[2].forEach(AI => E.remove(arguments[0], arguments[1], AI, arguments[3]));
        let Tar = document; if(typeof fun != 'function') Tar = arguments[0], Nam = arguments[1], fun = arguments[2], Opt = arguments[3];
        return /^bibi:/.test(Nam) ? E.CustomEvents.remove(Tar, Nam, fun) : Tar.removeEventListener(Nam, fun, Opt);
    };
    E.bind     = function() { return E.CustomEvents.bind    .apply(E.CustomEvents, arguments); };
    E.unbind   = function() { return E.CustomEvents.unbind  .apply(E.CustomEvents, arguments); };
    E.dispatch = function() { return E.CustomEvents.dispatch.apply(E.CustomEvents, arguments); };
    delete E.initialize;
};


E.aBCD = (Eve) => { // add Bibi's Collections of Data (formerly: add Bibi-Coord/Division)
    if(!Eve) return Eve;
    const BCD = {};
    BCD.Coord = E.aBCD.getCoord(Eve);
    BCD.Division = E.aBCD.getDivision(BCD.Coord);
    BCD.RangeOfSelection = I.RangeFinder.RangeOfSelection;
    return Object.assign(Eve, BCD);
};

    E.aBCD.getCoord = (Eve) => { let Coord = { X: 0, Y: 0 };
        if(/^touch/.test(Eve.type)) {
            Coord.X = Eve.changedTouches[0].pageX;
            Coord.Y = Eve.changedTouches[0].pageY;
        } else {
            Coord.X = Eve.pageX;
            Coord.Y = Eve.pageY;
        }
        const Doc = Eve.target.ownerDocument;
        if(Doc == document) {
            Coord.X -= O.Body.scrollLeft;
            Coord.Y -= O.Body.scrollTop;
        } else {
            const Main = R.Main;
            //const MainTransformation = I.Loupe.CurrentTransformation || { Scale: 1, TranslateX: 0, TranslateY: 0 };
            const MainTransformation = I.Loupe.CurrentTransformation ? I.Loupe.getActualTransformation() : { Scale: 1, TranslateX: 0, TranslateY: 0 };
            const MainScale = MainTransformation.Scale;
            const MainTransformOriginX_InMain = Main.offsetWidth  / 2;
            const MainTransformOriginY_InMain = Main.offsetHeight / 2;
            const MainTranslationX = MainTransformation.TranslateX;
            const MainTranslationY = MainTransformation.TranslateY;
            const Item = Doc.documentElement.Item;
            const ItemScale = Item.Scale;
            const ItemCoordInMain = O.getElementCoord(Item, Main);
            if(!Item.NoPadding && !Item.Outsourcing) ItemCoordInMain.X += Item.Padding.Left, ItemCoordInMain.Y += Item.Padding.Top;
            Coord.X = Math.floor(Main.offsetLeft + ((MainTransformOriginX_InMain + MainTranslationX) + ((((ItemCoordInMain.X + (Coord.X * ItemScale)) - Main.scrollLeft) - MainTransformOriginX_InMain) * MainScale)));
            Coord.Y = Math.floor(Main.offsetTop  + ((MainTransformOriginY_InMain + MainTranslationY) + ((((ItemCoordInMain.Y + (Coord.Y * ItemScale)) - Main.scrollTop ) - MainTransformOriginY_InMain) * MainScale)));
            //                  (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation ) + ((((ItemCoord_in_Main + Coord_in_Item        ) - ScrolledLength ) - MainTransformOrigin_in_Main) * MainScale)))
            //                  (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation ) + (((Coord_in_Main                               - ScrolledLength ) - MainTransformOrigin_in_Main) * MainScale)))
            //                  (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation ) + ((Coord_in_Viewport_of_Main                                       - MainTransformOrigin_in_Main) * MainScale)))
            //                  (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation ) + (Coord_from_MainTransformOrigin_in_Main                                                          * MainScale)))
            //                  (MainCoord       + (MainTransformOrigin_in_Translated-Main           + Coord_from_TransformOrigin_in_Scaled-Main                                                                    ))
            //                  (MainCoord       + Coord_in_Transformed-Main                                                                                                                                         )
            //                  Coord
        }
        return Coord;
    };

    E.aBCD.getDivision = (Coord) => {
        const FlipperWidth = S['flipper-width'];
        const Ratio = {
            X: Coord.X / window.innerWidth,
            Y: Coord.Y / window.innerHeight
        };
        let BorderT, BorderR, BorderB, BorderL;
        if(FlipperWidth < 1) { // Ratio
            BorderL = BorderT =     FlipperWidth;
            BorderR = BorderB = 1 - FlipperWidth;
        } else { // Pixel to Ratio
            BorderL = FlipperWidth / window.innerWidth;
            BorderT = FlipperWidth / window.innerHeight;
            BorderR = 1 - BorderL;
            BorderB = 1 - BorderT;
        }
        const Division = { /* 9: 5 */ };
             if(Ratio.X < BorderL          ) Division.X = 'left';//,   Division[9] -= 1;
        else if(          BorderR < Ratio.X) Division.X = 'right';//,  Division[9] += 1;
        else                                 Division.X = 'center';
             if(Ratio.Y < BorderT          ) Division.Y = 'top';//,    Division[9] -= 3;
        else if(          BorderB < Ratio.Y) Division.Y = 'bottom';//, Division[9] += 3;
        else                                 Division.Y = 'middle';
        return Division;
    };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Messages

//----------------------------------------------------------------------------------------------------------------------------------------------


export const M = {}; // Bibi.Messages


M.judge = (Msg, Origin) => (O.ParentBibi && Msg && typeof Msg == 'string' && Origin && typeof Origin == 'string' && S['trustworthy-origins'].includes(Origin));


M.post = (Msg) => !M.judge(Msg, O.ParentOrigin) ? false : window.parent.postMessage(Msg, window.parent.location.origin);


M.receive = (Eve) => {
    if(!Eve || !M.judge(Eve.data, Eve.origin)) return false; try {
    const Data = JSON.parse(Eve.data);
    if(!Data || typeof Data != 'object') return false;
    for(const EventName in Data) if(/^bibi:commands:/.test(EventName)) E.dispatch(EventName, Data[EventName]);
    return true; } catch(Err) {} return false;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extensions

//----------------------------------------------------------------------------------------------------------------------------------------------


export const X = { // Bibi.Extensions
    Bibi: {}, Extensions: [], Extractor: null
};

X.list = () => {
    const SystemExtensions = [];
    const extension = XP => ({ 'src': new URL('../../extensions/' + XP, Bibi.Script.src).href });
    let ReadyForExtraction = false, ReadyForBibiZine = false;
    if(S['book']) {
        if(O.isToBeExtractedIfNecessary(S['book'])) ReadyForExtraction = true;
        if(S['zine'])                               ReadyForBibiZine   = true;
    } else {
        if(S['accept-local-file'] || S['accept-blob-converted-data']) ReadyForExtraction = ReadyForBibiZine = true;
    }
    return Promise.resolve().then(() => {
        if(!ReadyForExtraction) return X.Extractor = null;
        if(!X.Extractor) return (S['book'] ? O.tryRangeRequest(S['book']).then(() => 'on-the-fly') : Promise.reject()).catch(() => 'at-once').then(_ => SystemExtensions.push(X.Extractor = extension('extractor/' + _ + '.js')))
    }).then(() => {
        if(ReadyForBibiZine) SystemExtensions.push(extension('zine.js'));
        if(!S['allow-scripts-in-content']) SystemExtensions.push(extension('sanitizer.js'));
        if(Bibi.Deb || Bibi.Dev) SystemExtensions.push(extension('../resources/scripts/bibi.x.debv.js'));
        if(SystemExtensions.length) S['extensions'].unshift(...SystemExtensions);
        return S['extensions'];
    });
};

X.load = () => new Promise(resolve => {
    if(S['extensions'].length == 0) return resolve();
    const clean = Scr => Scr && delete Scr.Added && delete Scr.resolve && delete Scr.reject;
    const flush = Scr => Scr && delete Scr.Extension.Script && clean(Scr) && Scr.remove();
    (function load(i) {
        const Xtn = S['extensions'][i];
        new Promise((resolveExtension, rejectExtension) => {
            if(typeof Xtn?.['src'] != 'string') throw `Setting of the Extension is Invalid.`;
            const XO = new URL(Xtn['src']).origin;
            if(!S['trustworthy-origins'].includes(XO)) throw `The Origin of the Extension Is Not Allowed.`;
            Xtn.Script = document.head.appendChild(sML.create('script', {
                className: 'bibi-extension-script', src: Xtn['src'],
                Extension: Xtn, resolve: resolveExtension, reject: rejectExtension
            }));
        })
        .then((    ) => clean(Xtn.Script) && delete Xtn['src'])
        .catch((Err) => flush(Xtn.Script) || O.log(Err + ' %O', Xtn))
        .then(() => S['extensions'][i + 1] ? load(i + 1) : resolve());
    })(0);
}).catch(() => false);

X.add = (XMeta, InitialX) => {
    const XScript = document.currentScript;
    if(XScript.Added) return O.log(`Ignored: %O`, XMeta) || X.through;
    XScript.Added = true;
    try {
             if(typeof XScript.Extension['id'] == 'string' && XScript.Extension['id']) XMeta['id'] = XScript.Extension['id'];
        else if(typeof             XMeta['id'] != 'string' ||            !XMeta['id']) throw `Every extension must have the valid ID.`;
        if(X.hasOwnProperty(XMeta['id']))                                              throw `The ID ("${ XMeta['id'] }") of the extension is reserved or already used by another.`;
        XScript.setAttribute('data-bibi-extension-id', XMeta['id']);
        const Xtn = X[XMeta['id']] = Object.assign(XScript.Extension, XMeta);
        Xtn.Index = X.Extensions.push(Xtn) - 1;
        Promise.resolve(typeof InitialX == 'function' ? InitialX.call(Xtn, Xtn) : InitialX).then(XScript.resolve);
        return function(onR) {         if(Xtn && typeof onR == 'function') E.bind('bibi:readied',  () => onR.call(Xtn, Xtn));
            return function(onP) {     if(Xtn && typeof onP == 'function') E.bind('bibi:prepared', () => onP.call(Xtn, Xtn));
                return function(onO) { if(Xtn && typeof onO == 'function') E.bind('bibi:opened',   () => onO.call(Xtn, Xtn)); }; }; };
    } catch(Err) {
        XScript.reject(Err);
        return X.through;
    }
}, Bibi.x = (...Args) => X.add(...Args);

X.through = () => X.through;

X.clean = () => delete X.list && delete X.load && delete X.add && delete Bibi.x && delete X.through && delete X.clean;
