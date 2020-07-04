/*!
 *                                                                                                                          (℠)
 *  ## Bibi (heart) | Heart of Bibi.
 *
 */




export const Bibi = { 'version': '____Bibi-Version____', 'href': 'https://bibi.epub.link', Status: '', TimeOrigin: Date.now() };


Bibi.SettingTypes = {
    'boolean': [
        'allow-placeholders',
        'prioritise-fallbacks'
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
        'use-bookmarks',
        'use-font-size-changer',
        'use-full-height',
        'use-history',
        'use-keys',
        'use-loupe',
        'use-menubar',
        'use-nombre',
        'use-slider',
        'zoom-out-for-utilities'
    ],
    'string': [
        'book',
        'default-page-progression-direction',
        'on-doubletap',
        'on-tripletap',
        'pagination-method',
        'reader-view-mode'
    ],
    'integer': [
        'item-padding-bottom',
        'item-padding-left',
        'item-padding-right',
        'item-padding-top',
        'spread-gap',
        'spread-margin'
    ],
    'number': [
        'base-font-size',
        'flipper-width',
        'font-size-scale-per-step',
        'loupe-max-scale',
        'loupe-scale-per-step',
        'orientation-border-ratio'
    ],
    'array': [
        'content-draggable',
        'orthogonal-edges',
        'orthogonal-arrow-keys',
        'orthogonal-touch-moves',
        'orthogonal-wheelings'
    ]
};

Bibi.SettingTypes_PresetOnly = {
    'boolean': [
        'accept-base64-encoded-data',
        'accept-blob-converted-data',
        'allow-scripts-in-content',
        'remove-bibi-website-link'
    ],
    'yes-no': [
        'accept-local-file',
        'keep-settings',
        'resume-from-last-position'
    ],
    'string': [
        'bookshelf',
        'website-name-in-title',
        'website-name-in-menu',
        'website-href'
    ],
    'integer': [
        'max-bookmarks',
        'max-history'
    ],
    'number': [
    ],
    'array': [
        'extensions',
        'extract-if-necessary',
        'trustworthy-origins'
    ]
};

Bibi.SettingTypes_UserOnly = {
    'boolean': [
        'debug',
        'wait',
        'zine'
    ],
    'yes-no': [
    ],
    'string': [
        'edge',
        'epubcfi',
        'p',
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
                case 'edge'                               : return /^(head|foot)$/.test(_V)                              ? _V : undefined;
                case 'book'                               : return (_V = decodeURIComponent(_V).trim())                  ? _V : undefined;
                case 'default-page-progression-direction' : return _V == 'rtl'                                           ? _V : 'ltr';
                case 'on-doubletap': case 'on-tripletap'  : return /^(panel|zoom)$/.test(_V)                             ? _V : undefined;
                case 'p'                                  : return /^([a-z]+|[1-9]\d*((\.[1-9]\d*)*|-[a-z]+))$/.test(_V) ? _V : undefined;
                case 'pagination-method'                  : return _V == 'x'                                             ? _V : 'auto';
                case 'reader-view-mode'                   : return /^(paged|horizontal|vertical)$/.test(_V)              ? _V : 'paged';
            }
            return _V;
        }
        if(Fill) return '';
    },
    'integer': (_P, _V, Fill) => {
        if(typeof (_V *= 1) == 'number' && isFinite(_V)) {
            _V = Math.max(Math.round(_V), 0);
            switch(_P) {
                case 'log'           : return Math.min(_V,  9);
                case 'max-bookmarks' : return Math.min(_V,  9);
                case 'max-history'   : return Math.min(_V, 19);
            }
            return _V;
        }
        if(Fill) return 0;
    },
    'number': (_P, _V, Fill) => {
        if(typeof (_V *= 1) == 'number' && isFinite(_V) && _V >= 0) return _V;
        if(Fill) return 0;
    },
    'array': (_P, _V, Fill) => {
        if(Array.isArray(_V)) {
            switch(_P) {
                case 'content-draggable'      : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = _V[i] === false || _V[i] === 'false' || _V[i] === '0' || _V[i] === 0 ? false : true; return _V;
                case 'extensions'             : return _V.filter(_I => typeof _I['src'] == 'string' && (_I['src'] = _I['src'].trim()));
                case 'extract-if-necessary'   : return (_V = _V.map(_I => typeof _I == 'string' ? _I.trim().toLowerCase() : '')).includes('*') ? ['*'] : _V.filter(_I => /^(\.[\w\d]+)*$/.test(_I));
                case 'orthogonal-arrow-keys'  :
                case 'orthogonal-edges'       :
                case 'orthogonal-touch-moves' :
                case 'orthogonal-wheelings'   : _V.length = 2; for(let i = 0; i < 2; i++) _V[i] = typeof _V[i] == 'string' ? _V[i] : ''; return _V;
                case 'trustworthy-origins'    : return _V.reduce((_VN, _I) => typeof _I == 'string' && /^https?:\/\/[^\/]+$/.test(_I = _I.trim().replace(/\/$/, '')) && !_VN.includes(_I) ? _VN.push(_I) && _VN : false, []);
            }
            return _V.filter(_I => typeof _I != 'function');
        }
        if(Fill) return [];
    }
});

Bibi.applyFilteredSettingsTo = (To, From, ListOfSettingTypes, Fill) => {
    ListOfSettingTypes.forEach(STs => {
        for(const ST in STs) {
            STs[ST].forEach(_P => {
                const VSV = Bibi.verifySettingValue[ST](_P, From[_P]);
                if(Fill) {
                    To[_P] = Bibi.verifySettingValue[ST](_P, To[_P]);
                    if(typeof VSV != 'undefined' || typeof To[_P] == 'undefined') To[_P] = Bibi.verifySettingValue[ST](_P, From[_P], true);
                } else if(From.hasOwnProperty(_P)) {
                    if(typeof VSV != 'undefined') To[_P] = VSV;
                }
            });
        }
    });
    return To;
};


Bibi.ErrorMessages = {
       Canceled: `Fetch Canceled`,
    CORSBlocked: `Probably CORS Blocked`,
    DataInvalid: `Data Invalid`,
       NotFound: `404 Not Found`
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Hello !

//----------------------------------------------------------------------------------------------------------------------------------------------


Bibi.at1st = () => Bibi.at1st.List.forEach(fn => typeof fn == 'function' ? fn() : true), Bibi.at1st.List = [];

Bibi.hello = () => new Promise(resolve => {
    Bibi.at1st();
    O.log.initialize();
    O.log(`Hello!`, '<b:>');
    O.log(`[ja] ${ Bibi['href'] }`);
    O.log(`[en] https://github.com/satorumurmur/bibi`);
    resolve();
})
.then(Bibi.initialize)
.then(Bibi.loadExtensions)
.then(Bibi.ready)
.then(Bibi.getBookData)
.then(Bibi.loadBook)
.then(Bibi.bindBook)
.then(Bibi.openBook)
.catch(O.error);


Bibi.initialize = () => {
    //const PromiseTryingRangeRequest = O.tryRangeRequest().then(() => true).catch(() => false).then(TF => O.RangeRequest = TF);
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
        if(Bibi.Dev)   O.HTML.classList.add('dev');
        if(Bibi.Debug) O.HTML.classList.add('debug');
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
        E.initialize(); O.Biscuits.initialize();
        P.initialize();
        U.initialize();
        D.initialize();
        S.initialize();
        I.initialize();
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
    if(sML.UA.Trident && !(sML.UA.Trident[0] >= 7)) { // Say Bye-bye
        I.note(`Your Browser Is Not Compatible`, 99999999999, 'ErrorOccured');
        throw I.Veil.byebye({
            'en': `<span>Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible.</span>`,
            'ja': `<span>大変申し訳ありません。</span> <span>お使いのブラウザでは、</span><span>動作しません。</span>`
        });
    } else { // Say Welcome!
        I.note(`<span class="non-visual">Welcome!</span>`);
    }
    { // Writing Mode, Font Size, Slider Size, Menu Height
        O.WritingModeProperty = (() => {
            const HTMLComputedStyle = getComputedStyle(O.HTML);
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle[        'writing-mode']) || sML.UA.Trident) return         'writing-mode';
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle['-webkit-writing-mode'])                  ) return '-webkit-writing-mode';
            if(/^(vertical|horizontal)-/.test(HTMLComputedStyle[  '-epub-writing-mode'])                  ) return   '-epub-writing-mode';
            return undefined;
        })();
        const StyleChecker = O.Body.appendChild(sML.create('div', { id: 'bibi-style-checker', innerHTML: ' aAａＡあ亜　', style: { width: 'auto', height: 'auto', left: '-1em', top: '-1em' } }));
        O.VerticalTextEnabled = (StyleChecker.offsetWidth < StyleChecker.offsetHeight);
        O.DefaultFontSize = Math.min(StyleChecker.offsetWidth, StyleChecker.offsetHeight);
        StyleChecker.style.fontSize = '0.01px';
        O.MinimumFontSize = Math.min(StyleChecker.offsetWidth, StyleChecker.offsetHeight);
        StyleChecker.setAttribute('style', ''), StyleChecker.innerHTML = '';
        I.Slider.Size = S['use-slider' ] ? StyleChecker.offsetWidth  : 0;
        I.Menu.Height = S['use-menubar'] ? StyleChecker.offsetHeight : 0;
        delete document.body.removeChild(StyleChecker);
    }
    { // Scrollbars
        O.Body.style.width = '101vw', O.Body.style.height = '101vh';
        O.Scrollbars = { Width: window.innerWidth - O.HTML.offsetWidth, Height: window.innerHeight - O.HTML.offsetHeight };
        O.HTML.style.width = O.Body.style.width = '100%', O.Body.style.height = '';
    }
    O.HTML.classList.toggle('book-full-height', S['use-full-height']);
    O.HTML.classList.remove('welcome');
    E.dispatch('bibi:initialized', Bibi.Status = Bibi.Initialized = 'Initialized');
    //return PromiseTryingRangeRequest;
};


Bibi.loadExtensions = () => {
    return new Promise((resolve, reject) => {
        const AdditionalExtensions = [];
        if(!S['allow-scripts-in-content']) AdditionalExtensions.push('sanitizer.js');
        let ReadyForExtraction = false, ReadyForBibiZine = false;
        if(S['book']) {
            if(O.isToBeExtractedIfNecessary(S['book'])) ReadyForExtraction = true;
            if(S['zine'])                               ReadyForBibiZine   = true;
        } else {
            if(S['accept-local-file'] || S['accept-blob-converted-data']) ReadyForExtraction = ReadyForBibiZine = true;
        }
        if(ReadyForBibiZine) AdditionalExtensions.unshift('zine.js');
        (ReadyForExtraction ? (S['book'] ? O.tryRangeRequest().then(() => 'on-the-fly') : Promise.reject()).catch(() => 'at-once').then(_ => AdditionalExtensions.unshift('extractor/' + _ + '.js')) : Promise.resolve()).then(() => {
            if(AdditionalExtensions.length) AdditionalExtensions.forEach(AX => S['extensions'].unshift({ 'src': new URL('../../extensions/' + AX, Bibi.Script.src).href }));
            if(S['extensions'].length == 0) return reject();
            O.log(`Loading Extension${ S['extensions'].length > 1 ? 's' : '' }...`, '<g:>');
            const loadExtensionInPreset = (i) => {
                X.load(S['extensions'][i]).then(Msg => {
                    //O.log(Msg);
                }).catch(Msg => {
                    O.log(Msg);
                }).then(() => {
                    S['extensions'][i + 1] ? loadExtensionInPreset(i + 1) : resolve();
                });
            };
            loadExtensionInPreset(0);
        });
    }).then(() => {
        O.log(`Extensions: %O`, X.Extensions);
        O.log(X.Extensions.length ? `Loaded. (${ X.Extensions.length } Extension${ X.Extensions.length > 1 ? 's' : '' })` : `No Extension.`, '</g>')
    }).catch(() => false);
};


Bibi.ready = () => new Promise(resolve => {
    O.HTML.classList.add('ready');
    O.ReadiedURL = location.href;
    E.add('bibi:readied', resolve);
    setTimeout(() => E.dispatch('bibi:readied', Bibi.Status = Bibi.Readied = 'Readied'), (O.TouchOS && !O.Embedded) ? 1234 : 0);
}).then(() => {
    O.HTML.classList.remove('ready');
});


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
    window.addEventListener(E['resize'], R.resetBibiHeight);
    Bibi.busyHerself.resolve = () => { resolve(); delete Bibi.busyHerself; };
}).then(() => {
    window.removeEventListener(E['resize'], R.resetBibiHeight);
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('loading');
});


Bibi.loadBook = (BookInfo) => Promise.resolve().then(() => {
    Bibi.busyHerself();
    I.note(`Loading...`);
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
    return L.createCover(); // ← loading is async
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
    // Announce "Prepared" (and Wait, sometime)
    E.dispatch('bibi:prepared', Bibi.Status = Bibi.Prepared = 'Prepared');
    if(!S['autostart'] && !L.Played) return L.wait();
}).then(() => {
    // Background Preparing
    return L.preprocessResources();
}).then(() => {
    // Load & Layout Items in Spreads and Pages
    O.log(`Loading Items in Spreads...`, '<g:>');
    const Promises = [];
    const LayoutOption = {
        TargetSpreadIndex: 0,
        Destination: { Edge: 'head' },
        resetter:       () => { LayoutOption.Reset = true; LayoutOption.removeResetter(); },
        addResetter:    () => { window   .addEventListener('resize', LayoutOption.resetter); },
        removeResetter: () => { window.removeEventListener('resize', LayoutOption.resetter); }
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
        LayoutOption.TargetSpreadIndex = Item && Item.Spread ? Item.Spread.Index : 0;
        LayoutOption.Destination = R.StartOn;
    }
    LayoutOption.addResetter();
    let LoadedItems = 0;
    R.Spreads.forEach(Spread => Promises.push(new Promise(resolve => L.loadSpread(Spread, { AllowPlaceholderItems: S['allow-placeholders'] && Spread.Index != LayoutOption.TargetSpreadIndex }).then(() => {
        LoadedItems += Spread.Items.length;
        I.note(`Loading... (${ LoadedItems }/${ R.Items.length } Items Loaded.)`);
        !LayoutOption.Reset ? R.layOutSpreadAndItsItems(Spread).then(resolve) : resolve();
    }))));
    return Promise.all(Promises).then(() => {
        O.log(`Loaded. (${ R.Items.length } in ${ R.Spreads.length })`, '</g>');
        return LayoutOption;
    });
});


Bibi.bindBook = (LayoutOption) => {
    if(!LayoutOption.Reset) {
        R.organizePages();
        R.layOutStage();
    }
    return R.layOutBook(LayoutOption).then(() => {
        LayoutOption.removeResetter();
        E.dispatch('bibi:laid-out-for-the-first-time', LayoutOption);
        return LayoutOption
    });
};


Bibi.openBook = (LayoutOption) => new Promise(resolve => {
    // Open
    Bibi.busyHerself.resolve();
    I.Veil.close();
    L.Opened = true;
    document.body.click(); // To responce for user scrolling/keypressing immediately
    I.note('');
    O.log(`Enjoy Readings!`, '</b>');
    E.dispatch('bibi:opened', Bibi.Status = Bibi.Opened = 'Opened');
    E.dispatch('bibi:scrolled');
    resolve();
}).then(() => {
    const LandingPage = R.hatchPage(LayoutOption.Destination) || R.Pages[0];
    if(!I.History.List.length) {
        I.History.List = [{ UI: Bibi, Item: LandingPage.Item, PageProgressInItem: LandingPage.IndexInItem / LandingPage.Item.Pages.length }];
        I.History.update();
    }
    if(S['allow-placeholders']) E.add('bibi:scrolled', () => I.PageObserver.turnItems());
    if(S['resume-from-last-position']) E.add('bibi:changed-intersection', () => { try { if(O.Biscuits) O.Biscuits.memorize('Book', { Position: { IIPP: I.PageObserver.getIIPP() } }); } catch(Err) {} });
    E.add('bibi:commands:move-by',     R.moveBy);
    E.add('bibi:commands:scroll-by',   R.scrollBy);
    E.add('bibi:commands:focus-on',    R.focusOn);
    E.add('bibi:commands:change-view', R.changeView);
    (Bibi.Dev && location.hostname != 'localhost') ? Bibi.createDevNote() : delete Bibi.createDevNote;
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
});


Bibi.createDevNote = () => {
    const Dev = Bibi.IsDevMode = O.Body.appendChild(sML.create('div', { id: 'bibi-is-dev-mode' }));
    Bibi.createDevNote.logBorderLine();
    Bibi.createDevNote.appendParagraph(`<strong>This Bibi seems to be a</strong> <strong>Development Version</strong>`);
    Bibi.createDevNote.appendParagraph(`<span>Please don't forget</span> <span>to create a production version</span> <span>before publishing on the Internet.</span>`);
    Bibi.createDevNote.appendParagraph(`<span class="non-visual">(To create a production version, run it on terminal: \`</span><code>npm run build</code><span class="non-visual">\`)</span>`);
    Bibi.createDevNote.appendParagraph(`<em>Close</em>`, 'NoLog').addEventListener('click', () => Dev.className = 'hide');
    Bibi.createDevNote.logBorderLine();
    [E['pointerdown'], E['pointerup'], E['pointermove'], E['pointerover'], E['pointerout'], 'click'].forEach(EN => Dev.addEventListener(EN, Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; }));
    setTimeout(() => Dev.className = 'show', 0);
    delete Bibi.createDevNote;
};
    Bibi.createDevNote.logBorderLine = (InnerHTML, NoLog) => {
        O.log('========================', '<*/>');
    };
    Bibi.createDevNote.appendParagraph = (InnerHTML, NoLog) => {
        const P = Bibi.IsDevMode.appendChild(sML.create('p', { innerHTML: InnerHTML }));
        if(!NoLog) O.log(InnerHTML.replace(/<[^<>]*>/g, ''), '<*/>');
        return P;
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
    I.note('');
    return new Promise(resolve => L.wait.resolve = resolve).then(() => {
        L.Waiting = false;
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.remove('waiting');
        I.note(`Loading...`);
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
            or_reject: function(fun) { return this.or(() => reject_failedToOpenTheBook(InitErrors.length < 2 || InitErrors[0] == InitErrors[1] ? InitErrors[0] : `as a file: ${ InitErrors[0] } / as a folder: ${ InitErrors[1] }`)); }
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
        const _Package  = Doc.getElementsByTagName('package' )[0];
        const _Metadata = Doc.getElementsByTagName('metadata')[0], Metadata = B.Package.Metadata;
        const _Manifest = Doc.getElementsByTagName('manifest')[0], Manifest = B.Package.Manifest;
        const _Spine    = Doc.getElementsByTagName('spine'   )[0], Spine    = B.Package.Spine;
        const SourcePaths = {};
        // ================================================================================
        // METADATA
        // --------------------------------------------------------------------------------
        const DCNS = _Package.getAttribute('xmlns:dc') || _Metadata.getAttribute('xmlns:dc');
        const UIDID = _Package.getAttribute('unique-identifier'), UIDE = UIDID ? Doc.getElementById(UIDID) : null, UIDTC = UIDE ? UIDE.textContent : '';
        Metadata['unique-identifier'] = UIDTC ? UIDTC.trim() : '';
        ['identifier', 'language', 'title', 'creator', 'publisher'].forEach(Pro => sML.forEach(Doc.getElementsByTagNameNS(DCNS, Pro))(_Meta => (Metadata[Pro] ? Metadata[Pro] : Metadata[Pro] = []).push(_Meta.textContent.trim())));
        sML.forEach(_Metadata.getElementsByTagName('meta'))(_Meta => {
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
        // --------------------------------------------------------------------------------
        if(!Metadata['rendition:layout'     ]                                               ) Metadata['rendition:layout'     ] = 'reflowable'; if(Metadata['omf:version']) Metadata['rendition:layout'] = 'pre-paginated';
        if(!Metadata['rendition:orientation'] || Metadata['rendition:orientation'] == 'auto') Metadata['rendition:orientation'] = 'portrait';
        if(!Metadata['rendition:spread'     ] || Metadata['rendition:spread'     ] == 'auto') Metadata['rendition:spread'     ] = 'landscape';
        if( Metadata[     'original-resolution']) Metadata[     'original-resolution'] = O.getViewportByOriginalResolution(Metadata[     'original-resolution']);
        if( Metadata[      'rendition:viewport']) Metadata[      'rendition:viewport'] = O.getViewportByMetaContent(       Metadata[      'rendition:viewport']);
        if( Metadata['fixed-layout-jp:viewport']) Metadata['fixed-layout-jp:viewport'] = O.getViewportByMetaContent(       Metadata['fixed-layout-jp:viewport']);
        if( Metadata[            'omf:viewport']) Metadata[            'omf:viewport'] = O.getViewportByMetaContent(       Metadata[            'omf:viewport']);
        B.ICBViewport = Metadata['original-resolution'] || Metadata['rendition:viewport'] || Metadata['fixed-layout-jp:viewport'] || Metadata['omf:viewport'] || null;
        // ================================================================================
        // MANIFEST
        // --------------------------------------------------------------------------------
        const PackageDir  = B.Package.Source.Path.replace(/\/?[^\/]+$/, '');
        sML.forEach(_Manifest.getElementsByTagName('item'))(_Item => {
            let Source = {
                'id': _Item.getAttribute('id'),
                'href': _Item.getAttribute('href'),
                'media-type': _Item.getAttribute('media-type')
            };
            if(!Source['id'] || !Source['href'] || (!Source['media-type'] && B.Type == 'EPUB')) return false;
            Source.Path = O.getPath(PackageDir, Source['href']);
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
        // ================================================================================
        // SPINE
        // --------------------------------------------------------------------------------
        if(!B.Nav.Source) {
            const Source = Manifest[SourcePaths[_Spine.getAttribute('toc')]];
            if(Source) B.Nav.Source = Source, B.Nav.Type = 'TOC-NCX';
        }
        if(       B.Nav.Source)        B.Nav.Source.Of.push(       B.Nav);
        if(B.CoverImage.Source) B.CoverImage.Source.Of.push(B.CoverImage);
        // --------------------------------------------------------------------------------
        B.PPD = _Spine.getAttribute('page-progression-direction');
        if(!B.PPD || !/^(ltr|rtl)$/.test(B.PPD)) B.PPD = S['default-page-progression-direction']; // default;
        // --------------------------------------------------------------------------------
        const PropertyRE = /^((rendition:)?(layout|orientation|spread|page-spread))-(.+)$/;
        let SpreadBefore, SpreadAfter;
        if(B.PPD == 'rtl') SpreadBefore = 'right', SpreadAfter = 'left';
        else               SpreadBefore = 'left',  SpreadAfter = 'right';
        const SpreadsDocumentFragment = document.createDocumentFragment();
        sML.forEach(_Spine.getElementsByTagName('itemref'))(ItemRef => {
            const IDRef = ItemRef.getAttribute('idref'); if(!IDRef) return false;
            const Source = Manifest[SourcePaths[IDRef]]; if(!Source) return false;
            const Item = sML.create('iframe', { className: 'item', scrolling: 'no', allowtransparency: 'true' /*, TimeCard: {}, stamp: function(What) { O.stamp(What, this.TimeCard); }*/ });
            Item['idref'] = IDRef;
            Item.Source = Source;
            Item.AnchorPath = Source.Path;
            Item.FallbackChain = [];
            if(S['prioritise-fallbacks']) while(Item.Source['fallback']) {
                const FallbackItem = Manifest[SourcePaths[Item.Source['fallback']]];
                if(FallbackItem) Item.FallbackChain.push(Item.Source = FallbackItem);
                else delete Item.Source['fallback'];
            }
            Item.Source.Of.push(Item);
            let Properties = ItemRef.getAttribute('properties');
            if(Properties) {
                Properties = Properties.trim().replace(/\s+/g, ' ').split(' ');
                Properties.forEach(Pro => { if(PropertyRE.test(Pro)) ItemRef[Pro.replace(PropertyRE, '$1')] = Pro.replace(PropertyRE, '$4'); });
            }
            Item['rendition:layout']      = ItemRef['rendition:layout']      || Metadata['rendition:layout'];
            Item['rendition:orientation'] = ItemRef['rendition:orientation'] || Metadata['rendition:orientation'];
            Item['rendition:spread']      = ItemRef['rendition:spread']      || Metadata['rendition:spread'];
            Item['rendition:page-spread'] = ItemRef['rendition:page-spread'] || ItemRef['page-spread'] || undefined;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            Item.IndexInSpine = Spine.push(Item) - 1;
            if(ItemRef.getAttribute('linear') == 'no') {
                Item['linear'] = 'no';
                Item.IndexInNonLinearItems = R.NonLinearItems.push(Item) - 1;
            } else {
                Item['linear'] = 'yes';
                Item.Index = R.Items.push(Item) - 1;
                let Spread = null;
                if(Item['rendition:layout'] == 'pre-paginated' && Item['rendition:page-spread'] == SpreadAfter && Item.Index > 0) {
                    const PreviousItem = R.Items[Item.Index - 1];
                    if(Item['rendition:layout'] == 'pre-paginated' && PreviousItem['rendition:page-spread'] == SpreadBefore) {
                        PreviousItem.SpreadPair = Item;
                        Item.SpreadPair = PreviousItem;
                        Spread = Item.Spread = PreviousItem.Spread;
                        Spread.Box.classList.remove('single-item-spread-before', 'single-item-spread-' + SpreadBefore);
                        Spread.Box.classList.add(Item['rendition:layout']);
                    }
                }
                if(!Spread) {
                    Spread = Item.Spread = sML.create('div', { className: 'spread',
                        Items: [], Pages: [],
                        Index: R.Spreads.length
                    });
                    Spread.Box = sML.create('div', { className: 'spread-box ' + Item['rendition:layout'], Inside: Spread, Spread: Spread });
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
                Item.Box = Spread.appendChild(sML.create('div', { className: 'item-box ' + Item['rendition:layout'], Inside: Item, Item: Item }));
                Item.Pages = [];
                if(Item['rendition:layout'] == 'pre-paginated') {
                    Item.PrePaginated = true;
                    if(Item.IndexInSpread == 0) Spread.PrePaginated = true;
                    const Page = sML.create('span', { className: 'page',
                        Spread: Spread, Item: Item,
                        IndexInItem: 0
                    });
                    Item.Pages.push(Item.Box.appendChild(Page));
                    I.PageObserver.observePageIntersection(Page);
                } else {
                    Item.PrePaginated = Spread.PrePaginated = false;
                }
            }
        });
        R.createSpine(SpreadsDocumentFragment);
        // --------------------------------------------------------------------------------
        B.FileDigit = String(Spine.length).length;
        // ================================================================================
        B.ID        =  Metadata['unique-identifier'] || Metadata['identifier'][0] || '';
        B.Language  =  Metadata['language'][0].split('-')[0];
        B.Title     =  Metadata['title'     ].join(', ');
        B.Creator   = !Metadata['creator'   ] ? '' : Metadata['creator'  ].join(', ');
        B.Publisher = !Metadata['publisher' ] ? '' : Metadata['publisher'].join(', ');
        const FullTitleFragments = [B.Title];
        if(B.Creator)   FullTitleFragments.push(B.Creator);
        if(B.Publisher) FullTitleFragments.push(B.Publisher);
        B.FullTitle = FullTitleFragments.join(' - ').replace(/&amp;?/gi, '&').replace(/&lt;?/gi, '<').replace(/&gt;?/gi, '>');
        O.Title.innerHTML = '';
        O.Title.appendChild(document.createTextNode(B.FullTitle + ' | ' + (S['website-name-in-title'] ? S['website-name-in-title'] : 'Published with Bibi')));
        try { O.Info.querySelector('h1').innerHTML = document.title; } catch(_) {}
        B.WritingMode =                                                                                   /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) ? (B.PPD == 'rtl' ? 'tb-rl' : 'lr-tb')
            : /^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language) ?                             'rl-tb'
            :                                                                                                             /^(mo?n)$/.test(B.Language) ?                   'tb-lr'
            :                                                                                                                                                                       'lr-tb';
        B.AllowPlaceholderItems = (B.ExtractionPolicy != 'at-once' && Metadata['rendition:layout'] == 'pre-paginated');
        // ================================================================================
        E.dispatch('bibi:processed-package');
    };


L.createCover = () => {
    const VCover = I.Veil.Cover, PCover = I.Panel.BookInfo.Cover;
    VCover.Info.innerHTML = PCover.Info.innerHTML = (() => {
        const BookID = [];
        if(B.Title)     BookID.push(`<strong>${ L.createCover.optimizeString(B.Title)     }</strong>`);
        if(B.Creator)   BookID.push(    `<em>${ L.createCover.optimizeString(B.Creator)   }</em>`    );
        if(B.Publisher) BookID.push(  `<span>${ L.createCover.optimizeString(B.Publisher) }</span>`  );
        return BookID.join(' ');
    })();
    return Promise.resolve(new Promise((resolve, reject) => {
        if(!B.CoverImage.Source || !B.CoverImage.Source.Path) return reject();
        let TimedOut = false;
        const TimerID = setTimeout(() => { TimedOut = true; reject(); }, 5000);
        O.file(B.CoverImage.Source, { URI: true }).then(Item => {
            if(!TimedOut) resolve(Item.URI);
        }).catch(() => {
            if(!TimedOut) reject();
        }).then(() => clearTimeout(TimerID));
    }).then(ImageURI => {
        VCover.className = PCover.className = 'with-cover-image';
        sML.style(VCover, { 'background-image': 'url(' + ImageURI + ')' });
        PCover.insertBefore(sML.create('img', { src: ImageURI }), PCover.Info);
    }).catch(() => {
        VCover.className = PCover.className = 'without-cover-image';
        VCover.insertBefore(I.getBookIcon(), VCover.Info);
        PCover.insertBefore(I.getBookIcon(), PCover.Info);
    }));
};
    L.createCover.optimizeString = (Str) => `<span>` + Str.replace(
        /([ 　・／]+)/g, '</span><span>$1'
    ) + `</span>`;


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
    } else {
        const makeNavULTree = (Ele) => {
            const ChildNodes = Ele.childNodes;
            let UL = undefined;
            for(let l = ChildNodes.length, i = 0; i < l; i++) {
                if(ChildNodes[i].nodeType != 1 || !/^navPoint$/i.test(ChildNodes[i].tagName)) continue;
                const NavPoint = ChildNodes[i];
                const NavLabel = NavPoint.getElementsByTagName('navLabel')[0];
                const Content  = NavPoint.getElementsByTagName('content')[0];
                const Text = NavPoint.getElementsByTagName('text')[0];
                if(!UL) UL = document.createElement('ul');
                const LI = sML.create('li', { id: NavPoint.getAttribute('id') }); LI.setAttribute('playorder', NavPoint.getAttribute('playorder'));
                const A  = sML.create('a', { href: Content.getAttribute('src'), innerHTML: Text.innerHTML.trim() });
                UL.appendChild(LI).appendChild(A);
                const ChildUL = makeNavULTree(NavPoint);
                if(ChildUL) LI.appendChild(ChildUL);
            }
            return UL;
        };
        const NavUL = makeNavULTree(Doc.getElementsByTagName('navMap')[0]);
        if(NavUL) NavContent.appendChild(document.createElement('nav')).appendChild(NavUL);
    }
    PNav.appendChild(NavContent);
    L.coordinateLinkages(B.Nav.Source.Path, PNav, 'InNav');
    if(B.Nav.Source.Of.length == 1) B.Nav.Source.Content = '';
    return PNav;
});


L.coordinateLinkages = (BasePath, RootElement, InNav) => {
    const As = RootElement.getElementsByTagName('a'); if(!As) return;
    for(let l = As.length, i = 0; i < l; i++) { const A = As[i];
        if(InNav) {
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
                if(InNav) {
                    A.addEventListener('click', Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; });
                    A.classList.add('bibi-bookinfo-inactive-link');
                }
                continue;
            }
        }
        if(/^[a-zA-Z]+:/.test(HRefPathInSource)) {
            if(HRefPathInSource.split('#')[0] == location.href.split('#')[0]) {
                const HRefHashInSource = HRefPathInSource.split('#')[1];
                HRefPathInSource = (HRefHashInSource ? '#' + HRefHashInSource : R.Items[0].AnchorPath)
            } else {
                A.addEventListener('click', Eve => {
                    Eve.preventDefault(); 
                    Eve.stopPropagation();
                    window.open(A.href);
                    return false;
                });
                continue;
            }
        }
        const HRefPath = O.getPath(BasePath.replace(/\/?([^\/]+)$/, ''), (!/^\.*\/+/.test(HRefPathInSource) ? './' : '') + (/^#/.test(HRefPathInSource) ? BasePath.replace(/^.+?([^\/]+)$/, '$1') : '') + HRefPathInSource);
        const HRefFnH = HRefPath.split('#');
        const HRefFile = HRefFnH[0] ? HRefFnH[0] : BasePath;
        const HRefHash = HRefFnH[1] ? HRefFnH[1] : '';
        sML.forEach(R.Items)(Item => {
            if(HRefFile == Item.AnchorPath) {
                A.setAttribute('data-bibi-original-href', HRefPathInSource);
                A.setAttribute(HRefAttribute, B.Path + '/' + HRefPath);
                A.InNav = InNav;
                A.Destination = { ItemIndex: Item.Index }; // not IIPP. ElementSelector may be added.
                     if(Item['rendition:layout'] == 'pre-paginated') A.Destination.PageIndexInItem = 0;
                else if(HRefHash)                                    A.Destination.ElementSelector = '#' + HRefHash;
                L.coordinateLinkages.setJump(A);
                return 'break'; //// break sML.forEach()
            }
        });
        if(HRefHash && /^epubcfi\(.+?\)$/.test(HRefHash)) {
            A.setAttribute('data-bibi-original-href', HRefPathInSource);
            A.setAttribute(HRefAttribute, B.Path + '/#' + HRefHash);
            if(X['EPUBCFI']) {
                A.InNav = InNav;
                A.Destination = X['EPUBCFI'].getDestination(HRefHash);
                L.coordinateLinkages.setJump(A);
            } else {
                A.addEventListener('click', Eve => {
                    Eve.preventDefault(); 
                    Eve.stopPropagation();
                    I.note(O.Language == 'ja' ? '<small>このリンクの利用には EPUBCFI エクステンションが必要です</small>' : '"EPUBCFI" extension is required to use this link.');
                    return false;
                });
            }
        }
        if(InNav && R.StartOn && R.StartOn.Nav == (i + 1) && A.Destination) R.StartOn = A.Destination;
    }
};

    L.coordinateLinkages.setJump = (A) => A.addEventListener('click', Eve => {
        Eve.preventDefault(); 
        Eve.stopPropagation();
        if(A.Destination) new Promise(resolve => A.InNav ? I.Panel.toggle().then(resolve) : resolve()).then(() => {
            if(L.Opened) {
                I.History.add();
                return R.focusOn({ Destination: A.Destination, Duration: 0 }).then(Destination => I.History.add({ UI: B, SumUp: false, Destination: Destination }));
            }
            if(!L.Waiting) return false;
            if(S['start-in-new-window']) return L.openNewWindow(location.href + (location.hash ? '&' : '#') + 'jo(nav=' + A.NavANumber + ')');
            R.StartOn = A.Destination;
            L.play();
        });
        return false;
    });


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
        if(B.ExtractionPolicy != 'at-once' && (S.BRL == 'pre-paginated' || (sML.UA.Chromium || sML.UA.WebKit || sML.UA.Gecko))) return resolve(PreprocessedResources);
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
        L.loadItem(Item, { IsPlaceholder: Opt.AllowPlaceholderItems })
        .then(() =>  LoadedItemsInSpread++) // Loaded
       .catch(() => SkippedItemsInSpread++) // Skipped
        .then(() => {
            if(LoadedItemsInSpread + SkippedItemsInSpread == Spread.Items.length) /*(SkippedItemsInSpread ? reject : resolve)*/resolve(Spread);
        });
    });
});


L.loadItem = (Item, Opt = {}) => {
    const IsPlaceholder = (S['allow-placeholders'] && Item['rendition:layout'] == 'pre-paginated' && Opt.IsPlaceholder);
    if(IsPlaceholder === Item.IsPlaceholder) return Item.Loading ? Item.Loading : Promise.resolve(Item);
    Item.IsPlaceholder = IsPlaceholder;
    const ItemBox = Item.Box;
    ItemBox.classList.remove('loaded');
    ItemBox.classList.toggle('placeholder', Item.IsPlaceholder);
    return Item.Loading = ( // Promise
        Item.IsPlaceholder ? Promise.reject()
        : Item.ContentURL ? Promise.resolve()
        : /\.(html?|xht(ml)?|xml)$/i.test(Item.Source.Path) ? // (X)HTML
            O.file(Item.Source, {
                Preprocess: (B.ExtractionPolicy || sML.UA.Gecko), // Preprocess if archived (or Gecko. For such books as styled only with -webkit/epub- prefixed properties. It's NOT Gecko's fault but requires preprocessing.)
                initialize: () => {
                    if(!S['allow-scripts-in-content']) {
                        Item.Source.Content = Item.Source.Content.replace(/<script(\s+[\w\-]+(\s*=\s*('[^'']*'|"[^""]*"))?)*\s*\/>/ig, '');
                        O.sanitizeItemSource(Item.Source, { As: 'HTML' });
                    }
                }
            }).then(ItemSource =>
                ItemSource.Content
            )
        : /\.(gif|jpe?g|png)$/i.test(Item.Source.Path) ? // Bitmap-in-Spine
            O.file(Item.Source, {
                URI: true
            }).then(ItemSource => [
                (Item['rendition:layout'] == 'pre-paginated' && B.ICBViewport) ? `<meta name="viewport" content="width=${ B.ICBViewport.Width }, height=${ B.ICBViewport.Height }" />` : '',
                `<img class="bibi-spine-item-image" alt="" src="${ Item.Source.URI }" />` // URI is BlobURL or URI
            ])
        : /\.(svg)$/i.test(Item.Source.Path) ? // SVG-in-Spine
            O.file(Item.Source, {
                Preprocess: (B.ExtractionPolicy ? true : false),
                initialize: () => {
                    const StyleSheetRE = /<\?xml-stylesheet\s*(.+?)\s*\?>/g, MatchedStyleSheets = Item.Source.Content.match(StyleSheetRE);
                    if(!S['allow-scripts-in-content']) O.sanitizeItemSource(Item.Source, { As: 'SVG' });
                    Item.Source.Content = (MatchedStyleSheets ? MatchedStyleSheets.map(SS => SS.replace(StyleSheetRE, `<link rel="stylesheet" $1 />`)).join('') : '') + '<bibi:boundary/>' + Item.Source.Content; // Join for preprocessing.
                }
            }).then(ItemSource =>
                ItemSource.Content.split('<bibi:boundary/>')
            )
        : Item.Skipped = true && Promise.resolve([])
    ).then(ItemSourceContent => new Promise(resolve => {
        const DefaultStyleID = 'bibi-default-style';
        if(!Item.ContentURL) {
            let HTML = typeof ItemSourceContent == 'string' ? ItemSourceContent : [`<!DOCTYPE html>`,
                `<html>`,
                    `<head>`,
                        `<meta charset="utf-8" />`,
                        `<title>${ B.FullTitle } - #${ Item.Index + 1 }/${ R.Items.length }</title>`,
                        (ItemSourceContent[0] ? ItemSourceContent[0] + '\n' : '') +
                    `</head>`,
                    `<body>`,
                        (ItemSourceContent[1] ? ItemSourceContent[1] + '\n' : '') +
                    `</body>`,
                `</html>`
            ].join('\n');
            HTML = HTML.replace(/(<head(\s[^>]+)?>)/i, `$1\n<link rel="stylesheet" id="${ DefaultStyleID }" href="${ Bibi.BookStyleURL }" />` + (!B.ExtractionPolicy && !Item.Source.Preprocessed ? `\n<base href="${ O.fullPath(Item.Source.Path) }" />` : ''));
            if(O.Local || sML.UA.LINE || sML.UA.Trident || sML.UA.EdgeHTML) { // Legacy Microsoft Browsers do not accept DataURLs for src of <iframe>. Also LINE in-app-browser is probably the same as it.
                HTML = HTML.replace(/^<\?.+?\?>/, '').replace('</head>', `<script id="bibi-onload">window.addEventListener('load', function() { parent.R.Items[${ Item.Index }].onLoaded(); return false; });</script>\n</head>`);
                Item.onLoaded = () => {
                    resolve();
                    Item.contentDocument.head.removeChild(Item.contentDocument.getElementById('bibi-onload'));
                    delete Item.onLoaded;
                };
                Item.src = '';
                ItemBox.insertBefore(Item, ItemBox.firstChild);
                Item.contentDocument.open(); Item.contentDocument.write(HTML); Item.contentDocument.close();
                return;
            }
            Item.ContentURL = O.createBlobURL('Text', HTML, S['allow-scripts-in-content'] && /\.(xht(ml)?|xml)$/i.test(Item.Source.Path) ? 'application/xhtml+xml' : 'text/html'), Item.Source.Content = '';
        }
        Item.onload = resolve;
        Item.src = Item.ContentURL;
        ItemBox.insertBefore(Item, ItemBox.firstChild);
    })).then(() => {
        return L.postprocessItem(Item);
    }).then(() => {
        ItemBox.classList.add('loaded');
        E.dispatch('bibi:loaded-item', Item);
        // Item.stamp('Loaded');
        Item.Loaded = true;
        Item.Turned = 'Up';
    }).catch(() => { // Placeholder
        if(Item.parentElement) Item.parentElement.removeChild(Item);
        Item.onload = Item.onLoaded = undefined;
        Item.src = '';
        Item.HTML = Item.Head = Item.Body = Item.Pages[0];
        Item.Loaded = false;
        Item.Turned = 'Down';
    }).then(() => {
        delete Item.Loading;
        return Promise.resolve(Item);
    });
};


L.postprocessItem = (Item) => {
    // Item.stamp('Postprocess');
    Item.HTML = Item.contentDocument.getElementsByTagName('html')[0]; Item.HTML.classList.add(...sML.Environments);
    Item.Head = Item.contentDocument.getElementsByTagName('head')[0];
    Item.Body = Item.contentDocument.getElementsByTagName('body')[0];
    Item.HTML.Item = Item.Head.Item = Item.Body.Item = Item;
    const XMLLang = Item.HTML.getAttribute('xml:lang'), Lang = Item.HTML.getAttribute('lang');
         if(!XMLLang && !Lang) Item.HTML.setAttribute('xml:lang', B.Language), Item.HTML.setAttribute('lang', B.Language);
    else if(!XMLLang         ) Item.HTML.setAttribute('xml:lang', Lang);
    else if(            !Lang)                                                 Item.HTML.setAttribute('lang', XMLLang);
    sML.forEach(Item.Body.getElementsByTagName('link'))(Link => Item.Head.appendChild(Link));
    sML.appendCSSRule(Item.contentDocument, 'html', '-webkit-text-size-adjust: 100%;');
    if(sML.UA.Trident) sML.forEach(Item.Body.getElementsByTagName('svg'))(SVG => {
        const ChildImages = SVG.getElementsByTagName('image');
        if(ChildImages.length == 1) {
            const ChildImage = ChildImages[0];
            if(ChildImage.getAttribute('width') && ChildImage.getAttribute('height')) {
                SVG.setAttribute('width',  ChildImage.getAttribute('width'));
                SVG.setAttribute('height', ChildImage.getAttribute('height'));
            }
        }
    });
    L.coordinateLinkages(Item.Source.Path, Item.Body);
    const Lv1Eles = Item.contentDocument.querySelectorAll('body>*:not(script):not(style)');
    if(Lv1Eles && Lv1Eles.length == 1) {
        const Lv1Ele = Item.contentDocument.querySelector('body>*:not(script):not(style)');
             if(    /^svg$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleSVG = true;
        else if(    /^img$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleIMG = true;
        else if( /^iframe$/i.test(Lv1Ele.tagName)) Item.Outsourcing =                      true;
        else if(!O.getElementInnerText(Item.Body)) Item.Outsourcing =                      true;
    }
    return (Item['rendition:layout'] == 'pre-paginated' ? Promise.resolve() : L.patchItemStyles(Item)).then(() => {
        E.dispatch('bibi:postprocessed-item', Item);
        // Item.stamp('Postprocessed');
        return Item;
    });
};


L.patchItemStyles = (Item) => new Promise(resolve => { // only for reflowable.
    Item.StyleSheets = [];
    sML.forEach(Item.HTML.querySelectorAll('link, style'))(SSEle => {
        if(/^link$/i.test(SSEle.tagName)) {
            if(!SSEle.href) return;
            if(!/^(alternate )?stylesheet$/.test(SSEle.rel)) return;
            if((sML.UA.Safari || sML.OS.iOS) && SSEle.rel == 'alternate stylesheet') return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
        }
        Item.StyleSheets.push(SSEle);
    });
    const checkCSSLoadingAndResolve = () => {
        if(Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return false;
        clearInterval(Item.CSSLoadingTimerID);
        delete Item.CSSLoadingTimerID;
        resolve();
        return true;
    };
    if(!checkCSSLoadingAndResolve()) Item.CSSLoadingTimerID = setInterval(checkCSSLoadingAndResolve, 33);
}).then(() => {
    if(!Item.Source.Preprocessed) {
        if(B.Package.Metadata['ebpaj:guide-version']) {
            const Versions = B.Package.Metadata['ebpaj:guide-version'].split('.');
            if(Versions[0] * 1 == 1 && Versions[1] * 1 == 1 && Versions[2] * 1 <=3) Item.Body.style.textUnderlinePosition = 'under left';
        }
        if(sML.UA.Trident) {
            //if(B.ExtractionPolicy == 'at-once') return false;
            const IsCJK = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language);
            O.editCSSRules(Item.contentDocument, CSSRule => {
                if(/(-(epub|webkit)-)?column-count: 1; /                                    .test(CSSRule.cssText)) CSSRule.style.columnCount = CSSRule.style.msColumnCount = 'auto';
                if(/(-(epub|webkit)-)?writing-mode: vertical-rl; /                          .test(CSSRule.cssText)) CSSRule.style.writingMode = 'tb-rl';
                if(/(-(epub|webkit)-)?writing-mode: vertical-lr; /                          .test(CSSRule.cssText)) CSSRule.style.writingMode = 'tb-lr';
                if(/(-(epub|webkit)-)?writing-mode: horizontal-tb; /                        .test(CSSRule.cssText)) CSSRule.style.writingMode = 'lr-tb';
                if(/(-(epub|webkit)-)?(text-combine-upright|text-combine-horizontal): all; /.test(CSSRule.cssText)) CSSRule.style.msTextCombineHorizontal = 'all';
                if(IsCJK && / text-align: justify; /                                        .test(CSSRule.cssText)) CSSRule.style.textJustify = 'inter-ideograph';
            });
        } else {
            O.editCSSRules(Item.contentDocument, CSSRule => {
                if(/(-(epub|webkit)-)?column-count: 1; /.test(CSSRule.cssText)) CSSRule.style.columnCount = CSSRule.style.webkitColumnCount = 'auto';
            });
        }
    }
    const ItemHTMLComputedStyle = getComputedStyle(Item.HTML);
    const ItemBodyComputedStyle = getComputedStyle(Item.Body);
    if(ItemHTMLComputedStyle[O.WritingModeProperty] != ItemBodyComputedStyle[O.WritingModeProperty]) Item.HTML.style.writingMode = ItemBodyComputedStyle[O.WritingModeProperty];
    Item.WritingMode = O.getWritingMode(Item.HTML);
         if(/-rl$/.test(Item.WritingMode)) Item.HTML.classList.add('bibi-vertical-text');
    else if(/-lr$/.test(Item.WritingMode)) Item.HTML.classList.add('bibi-horizontal-text');
    /*
         if(/-rl$/.test(Item.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
    else if(/-lr$/.test(Item.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
    else                                   if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
    //*/
    [
        [Item.Box, ItemHTMLComputedStyle, Item.HTML],
        [Item,     ItemBodyComputedStyle, Item.Body]
    ].forEach(Par => {
        [
            'backgroundColor',
            'backgroundImage',
            'backgroundRepeat',
            'backgroundPosition',
            'backgroundSize'
        ].forEach(Pro => Par[0].style[Pro] = Par[1][Pro]);
        Par[2].style.background = 'transparent';
    });
    sML.forEach(Item.Body.querySelectorAll('svg, img'))(Img => {
        Img.BibiDefaultStyle = {
               width:  (Img.style.width     ? Img.style.width     : ''),
               height: (Img.style.height    ? Img.style.height    : ''),
            maxWidth:  (Img.style.maxWidth  ? Img.style.maxWidth  : ''),
            maxHeight: (Img.style.maxHeight ? Img.style.maxHeight : '')
        };
    });
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Reader

//----------------------------------------------------------------------------------------------------------------------------------------------


export const R = { // Bibi.Reader
    Spreads: [], Items: [], Pages: [],
    NonLinearItems: [],
    IntersectingPages: [], Current: {}
};


R.createSpine = (SpreadsDocumentFragment) => {
    R.Main      = O.Body.insertBefore(sML.create('main', { id: 'bibi-main' }), O.Body.firstElementChild);
    R.Main.Book =  R.Main.appendChild(sML.create('div',  { id: 'bibi-main-book' }));
    R.Main.Book.appendChild(SpreadsDocumentFragment);
  //R.Sub       = O.Body.insertBefore(sML.create('div',  { id: 'bibi-sub' }),  R.Main.nextSibling);
};


R.resetBibiHeight = () => {
    const WIH = window.innerHeight;
    if(O.TouchOS) O.HTML.style.height = O.Body.style.height = WIH + 'px'; // for In-App Browsers
    return WIH;
};


R.resetStage = () => {
    const WIH = R.resetBibiHeight();
    R.Stage = {};
    R.Columned = false;
    R.Main.style.padding = R.Main.style.width = R.Main.style.height = '';
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = '';
    const BookBreadthIsolationStartEnd = (S['use-slider'] && S.RVM == 'paged' && O.Scrollbars[C.A_SIZE_B] ? O.Scrollbars[C.A_SIZE_B] : 0) + S['spread-margin'] * 2;
    sML.style(R.Main.Book, {
        [C.A_SIZE_b]: (BookBreadthIsolationStartEnd > 0 ? 'calc(100% - ' + BookBreadthIsolationStartEnd + 'px)' : ''),
        [C.A_SIZE_l]: ''
    });
    R.Stage.Width  = O.Body.clientWidth;
    R.Stage.Height = WIH;
    R.Stage[C.A_SIZE_B] -= (S['use-slider'] || S.RVM != 'paged' ? O.Scrollbars[C.A_SIZE_B] : 0) + S['spread-margin'] * 2;
    window.scrollTo(0, 0);
    if(!S['use-full-height']) R.Stage.Height -= I.Menu.Height;
    if(S['spread-margin'] > 0) R.Main.Book.style['padding' + C.L_BASE_S] = R.Main.Book.style['padding' + C.L_BASE_E] = S['spread-margin'] + 'px';
    //R.Main.style['background'] = S['book-background'] ? S['book-background'] : '';
};


R.layOutSpreadAndItsItems = (Spread, Opt = {}) => {
    //Spread.style.width = Spread.style.height = '';
    return (Spread.Items.length == 1 ? R.layOutItem(Spread.Items[0])
     : !Opt.Reverse                  ? R.layOutItem(Spread.Items[0]).then(() => R.layOutItem(Spread.Items[1]))
     :                                 R.layOutItem(Spread.Items[1]).then(() => R.layOutItem(Spread.Items[0]))
    ).then(() => R.layOutSpread(Spread, Opt));
};


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
        SpreadSize.Width  = (Spread.Spreaded && Item['rendition:layout'] == 'pre-paginated' && Item['rendition:page-spread']) ? (B.ICBViewport ? Item.Box.offsetHeight * B.ICBViewport.Width * 2 / B.ICBViewport.Height : R.Stage.Width) : Item.Box.offsetWidth;
        SpreadSize.Height = Item.Box.offsetHeight;
    } else {
        const ItemA = Spread.Items[0], ItemB = Spread.Items[1];
        Spread.Spreaded = (ItemA.Spreaded || ItemB.Spreaded) ? true : false;
        if(ItemA['rendition:layout'] == 'pre-paginated' && ItemB['rendition:layout'] == 'pre-paginated') {
            // Paired Pre-Paginated Items
            if(Spread.Spreaded || S.RVM != 'vertical') {
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
    const MinSpaceOfEdge = (S.RVM != 'paged' && (Spread.Index == 0 || Spread.Index == R.Spreads.length - 1)) ? Math.floor((R.Stage[C.L_SIZE_L] - SpreadSize[C.L_SIZE_L]) / 2) : 0;
    if(MinSpaceOfEdge > 0) {
        if(Spread.Index == 0                   ) Spread.style['padding' + C.L_BASE_B] = MinSpaceOfEdge + 'px', SpreadSize[C.L_SIZE_L] += MinSpaceOfEdge;
        if(Spread.Index == R.Spreads.length - 1) Spread.style['padding' + C.L_BASE_A] = MinSpaceOfEdge + 'px', SpreadSize[C.L_SIZE_L] += MinSpaceOfEdge;
    } else {
        Spread.style.padding = '';
    }
    if(O.Scrollbars.Height && S.SLA == 'vertical' && S.ARA != 'vertical') {
        SpreadBox.style.minHeight    = S.RVM == 'paged' ?   'calc(100vh - ' + O.Scrollbars.Height + 'px)' : '';
        SpreadBox.style.marginBottom = Spread.Index == R.Spreads.length - 1 ? O.Scrollbars.Height + 'px'  : '';
    } else {
        SpreadBox.style.minHeight = SpreadBox.style.marginBottom = ''
    }
    SpreadBox.classList.toggle('spreaded', Spread.Spreaded);
    SpreadBox.style[C.L_SIZE_b] = '', Spread.style[C.L_SIZE_b] = Math.ceil(SpreadSize[C.L_SIZE_B]) + 'px';
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
                I.Slider.resetUISize();
                I.Slider.progress();
            }
        }
        delete Spread.OldPages, delete Spread.PreviousSpreadBoxLength;
    }
    resolve(Spread);
});


R.layOutItem = (Item) => new Promise(resolve => {
    // Item.stamp('Reset...');
    Item.Scale = 1;
    //Item.Box.style.width = Item.Box.style.height = Item.style.width = Item.style.height = '';
    (Item['rendition:layout'] != 'pre-paginated') ? R.renderReflowableItem(Item) : R.renderPrePaginatedItem(Item);
    // Item.stamp('Reset.');
    resolve(Item);
});


R.renderReflowableItem = (Item) => {
    const ItemPaddingSE = S['item-padding-' + C.L_BASE_s] + S['item-padding-' + C.L_BASE_e];
    const ItemPaddingBA = S['item-padding-' + C.L_BASE_b] + S['item-padding-' + C.L_BASE_a];
    const PageCB = R.Stage[C.L_SIZE_B] - ItemPaddingSE; // Page "C"ontent "B"readth
    let   PageCL = R.Stage[C.L_SIZE_L] - ItemPaddingBA; // Page "C"ontent "L"ength
    const PageGap = ItemPaddingBA;
    ['b','a','s','e'].forEach(base => { const trbl = C['L_BASE_' + base]; Item.style['padding-' + trbl] = S['item-padding-' + trbl] + 'px'; });
    sML.style(Item.HTML, { 'width': '', 'height': '' });
    if(Item.WithGutters) {
        Item.HTML.classList.remove('bibi-with-gutters');
        if(Item.Neck.parentNode) Item.Neck.parentNode.removeChild(Item.Neck);
        Item.Neck.innerHTML = '';
        delete Item.Neck;
    }
    const ReverseItemPaginationDirectionIfNecessary = (sML.UA.Trident || sML.UA.EdgeHTML) ? false : true;
    if(Item.Columned) {
        sML.style(Item.HTML, { 'column-fill': '', 'column-width': '', 'column-gap': '', 'column-rule': '' });
        Item.HTML.classList.remove('bibi-columned');
        if(ReverseItemPaginationDirectionIfNecessary && Item.ReversedColumned) {
            Item.HTML.style.direction = '';
            sML.forEach(Item.contentDocument.querySelectorAll('body > *'))(Ele => Ele.style.direction = '');
        }
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
    if(Item.Spreaded) {
        const HalfL = Math.floor((PageCL - PageGap) / 2);
        if(HalfL >= Math.floor(PageCB * S['orientation-border-ratio'] / 2)) PageCL = HalfL;
        else Item.Spreaded = false;
    }
    sML.style(Item, {
        [C.L_SIZE_b]: PageCB + 'px',
        [C.L_SIZE_l]: PageCL + 'px'
    });
    const WordWrappingStyleSheetIndex = sML.appendCSSRule(Item.contentDocument, '*', 'word-wrap: break-word;'); ////
    sML.forEach(Item.Body.querySelectorAll('img, svg'))(Img => {
        // Fit Image Size
        if(!Img.BibiDefaultStyle) return;
        ['width', 'height', 'maxWidth', 'maxHeight'].forEach(Pro => Img.style[Pro] = Img.BibiDefaultStyle[Pro]);
        if(S.RVM == 'horizontal' && /-(rl|lr)$/.test(Item.WritingMode) || S.RVM == 'vertical' && /-tb$/.test(Item.WritingMode)) return;
        const NaturalB = parseFloat(getComputedStyle(Img)[C.L_SIZE_b]), MaxB = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[C.L_SIZE_b]), PageCB));
        const NaturalL = parseFloat(getComputedStyle(Img)[C.L_SIZE_l]), MaxL = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[C.L_SIZE_l]), PageCL));
        if(NaturalB > MaxB || NaturalL > MaxL) sML.style(Img, {
            [C.L_SIZE_b]: Math.floor(parseFloat(getComputedStyle(Img)[C.L_SIZE_b]) * Math.min(MaxB / NaturalB, MaxL / NaturalL)) + 'px',
            [C.L_SIZE_l]: 'auto',
            maxWidth: '100vw',
            maxHeight: '100vh'
        });
    });
    let PaginateWith = '';
    if(!Item.Outsourcing) {
        if(S['pagination-method'] == 'x') {
                 if(S.RVM == 'paged' && Item.HTML['offset'+ C.L_SIZE_L] > PageCL) PaginateWith = 'S'; // VM:Paged            WM:Vertical   LA:Horizontal
            else if(                    Item.HTML['offset'+ C.L_SIZE_B] > PageCB) PaginateWith = 'C'; // VM:Paged/Horizontal WM:Horizontal LA:Horizontal // VM:      Vertical WM:Vertical LA:Vertical
        } else   if(S.RVM == 'paged' || Item.HTML['offset'+ C.L_SIZE_B] > PageCB) PaginateWith = 'C'; // VM:Paged/Horizontal WM:Horizontal LA:Horizontal // VM:Paged/Vertical WM:Vertical LA:Vertical
    }
    switch(PaginateWith) {
        case 'S':
            Item.HTML.classList.add('bibi-columned');
            sML.style(Item.HTML, {
                [C.L_SIZE_b]: 'auto',
                [C.L_SIZE_l]: PageCL + 'px',
                'column-fill': 'auto',
                'column-width': PageCB + 'px',
                'column-gap': 0,
                'column-rule': ''
            });
            const HowManyPages = Math.ceil((sML.UA.Trident ? Item.Body.clientHeight : Item.HTML.scrollHeight) / PageCB);
            sML.style(Item.HTML, { 'width': '', 'height': '', 'column-fill': '', 'column-width': '', 'column-gap': '', 'column-rule': '' });
            Item.HTML.classList.remove('bibi-columned');
            Item.HTML.classList.add('bibi-with-gutters');
            const ItemLength = (PageCL + PageGap) * HowManyPages - PageGap;
            Item.HTML.style[C.L_SIZE_L] = ItemLength + 'px';
            const Points = [];//[0, 0];
            for(let i = 1; i < HowManyPages; i++) {
                const Start = 0, End = PageCB, After = (PageCL + PageGap) * i, Before = After - PageGap;
                Points.push(Start), Points.push(Before);
                Points.push(  End), Points.push(Before);
                Points.push(  End), Points.push(After );
                Points.push(Start), Points.push(After );
            }
            if(/^tb-/.test(Item.WritingMode)) Points.reverse();
            const Polygon = [];
            for(let Pt = '', l = Points.length, i = 0; i < l; i++) {
                const Px = Points[i] + (Points[i] ? 'px' : '');
                if(i % 2 == 0) Pt = Px;
                else Polygon.push(Pt + ' ' + Px);
            }
            const Neck = Bibi.createElement('bibi-neck'), Throat = Neck.appendChild(Bibi.createElement('bibi-throat')), ShadowOrThroat = Throat.attachShadow ? Throat.attachShadow({ mode: 'open' }) : Throat.createShadowRoot ? Throat.createShadowRoot() : Throat;
            ShadowOrThroat.appendChild(document.createElement('style')).textContent = (ShadowOrThroat != Throat ? ':host' : 'bibi-throat') + ` { ${C.L_SIZE_b}: ${PageCB}px; ${C.L_SIZE_l}: ${ItemLength}px; shape-outside: polygon(${ Polygon.join(', ') }); }`;
            Item.Neck = Item.Head.appendChild(Neck);
            Item.WithGutters = true;
            break;
        case 'C':
            Item.HTML.classList.add('bibi-columned');
            sML.style(Item.HTML, {
                [C.L_SIZE_b]: PageCB + 'px',
                //[C.L_SIZE_l]: PageCL + 'px',
                'column-fill': 'auto',
                'column-width': PageCL + 'px',
                'column-gap': PageGap + 'px',
                'column-rule': ''
            });
            R.Columned = true;
            Item.Columned = true, Item.ColumnBreadth = PageCB, Item.ColumnLength = PageCL;
            if(ReverseItemPaginationDirectionIfNecessary) {
                let ToBeReversedColumnAxis = false;
                switch(Item.WritingMode) {
                    case 'lr-tb': case 'tb-lr': if(S['page-progression-direction'] != 'ltr') ToBeReversedColumnAxis = true; break;
                    case 'rl-tb': case 'tb-rl': if(S['page-progression-direction'] != 'rtl') ToBeReversedColumnAxis = true; break;
                }
                if(ToBeReversedColumnAxis) {
                    Item.ReversedColumned = true;
                    sML.forEach(Item.contentDocument.querySelectorAll('body > *'))(Ele => Ele.style.direction = getComputedStyle(Ele).direction);
                    Item.HTML.style.direction = S['page-progression-direction'];
                    //if(sML.UA.Chromium) Item.HTML.style.transform = 'translateX(' + (Item.HTML['scroll'+ C.L_SIZE_L] - Item.HTML['offset'+ C.L_SIZE_L]) * (S['page-progression-direction'] == 'rtl' ? 1 : -1) + 'px)';
                }
            }
            break;
    }
    sML.deleteCSSRule(Item.contentDocument, WordWrappingStyleSheetIndex); ////
    let ItemL = sML.UA.Trident ? Item.Body['client' + C.L_SIZE_L] : Item.HTML['scroll' + C.L_SIZE_L];
    const HowManyPages = Math.ceil((ItemL + PageGap) / (PageCL + PageGap));
    ItemL = (PageCL + PageGap) * HowManyPages - PageGap;
    Item.style[C.L_SIZE_l] = Item.HTML.style[C.L_SIZE_l] = ItemL + 'px';
    if(sML.UA.Trident) Item.HTML.style[C.L_SIZE_l] = '100%';
    let ItemBoxB = PageCB + ItemPaddingSE;
    let ItemBoxL = ItemL  + ItemPaddingBA;// + ((S.RVM == 'paged' && Item.Spreaded && HowManyPages % 2) ? (PageGap + PageCL) : 0);
    Item.Box.style[C.L_SIZE_b] = ItemBoxB + 'px';
    Item.Box.style[C.L_SIZE_l] = ItemBoxL + 'px';
    Item.Pages.forEach(Page => {
        I.PageObserver.unobservePageIntersection(Page);
        Item.Box.removeChild(Page);
    });
    Item.Pages = [];
    for(let i = 0; i < HowManyPages; i++) {
        const Page = Item.Box.appendChild(sML.create('span', { className: 'page' }));
        //Page.style[C.L_SIZE_l] = (PageCL + ItemPaddingBA) + 'px';//R.Stage[C.L_SIZE_L] + 'px';
        Page.Item = Item, Page.Spread = Item.Spread;
        Page.IndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
        I.PageObserver.observePageIntersection(Page);
    }
    /*
    if(Item.Index == 2) { //setTimeout(() => {
        console.log(`R.Items[${ Item.Index }]:`, Item);
        O.logSets(`R.Items[${ Item.Index }]`, '.', ['HTML', 'Body'], '.', ['offset', 'client', 'scroll'], ['Width', 'Height', 'Left', 'Top']); //}, 100);
    }
    //*/
    return Item;
};


R.renderPrePaginatedItem = (Item) => {
    sML.style(Item, { width: '', height: '', transform: '' });
    let StageB = R.Stage[C.L_SIZE_B];
    let StageL = R.Stage[C.L_SIZE_L];
    Item.Spreaded = (
        (S.RVM == 'paged' || !S['full-breadth-layout-in-scroll'])
            &&
        (Item['rendition:spread'] == 'both' || R.Orientation == Item['rendition:spread'] || R.Orientation == 'landscape')
    );
    if(!Item.Viewport) Item.Viewport = R.getItemViewport(Item);
  //if( Item.Viewport && !B.ICBViewport) B.ICBViewport = Item.Viewport;
    let ItemLoVp = null; // ItemLayoutViewport
    if(Item.Spreaded) {
        ItemLoVp = R.getItemLayoutViewport(Item);
        if(Item.SpreadPair) {
            const PairItem = Item.SpreadPair;
            PairItem.Spreaded = true;
            if(!PairItem.Viewport) PairItem.Viewport = R.getItemViewport(PairItem);
            const PairItemLoVp = R.getItemLayoutViewport(PairItem);
            let LoBaseItem = null, LoBaseItemLoVp = null; // LayoutBaseItem, LayoutBaseItemLayoutViewport
            let LoPairItem = null, LoPairItemLoVp = null; // LayoutPairItem, LayoutPairItemLayoutViewport
            if(PairItem.Index > Item.Index) LoBaseItem =     Item, LoBaseItemLoVp =     ItemLoVp, LoPairItem = PairItem, LoPairItemLoVp = PairItemLoVp;
            else                            LoBaseItem = PairItem, LoBaseItemLoVp = PairItemLoVp, LoPairItem =     Item, LoPairItemLoVp =     ItemLoVp;
            LoPairItem.Scale = LoBaseItemLoVp.Height / LoPairItemLoVp.Height;
            const SpreadViewPort = {
                Width:  LoBaseItemLoVp.Width + LoPairItemLoVp.Width * LoPairItem.Scale,
                Height: LoBaseItemLoVp.Height
            };
            LoBaseItem.Scale = Math.min(
                StageB / SpreadViewPort[C.L_SIZE_B],
                StageL / SpreadViewPort[C.L_SIZE_L]
            );
            LoPairItem.Scale *= LoBaseItem.Scale;
        } else {
            const SpreadViewPort = {
                Width:  ItemLoVp.Width * (/^(left|right)$/.test(Item['rendition:page-spread']) ? 2 : 1),
                Height: ItemLoVp.Height
            };
            Item.Scale = Math.min(
                StageB / SpreadViewPort[C.L_SIZE_B],
                StageL / SpreadViewPort[C.L_SIZE_L]
            );
        }
    } else {
        ItemLoVp = R.getItemLayoutViewport(Item);
        if(S.RVM == 'paged' || !S['full-breadth-layout-in-scroll']) {
            Item.Scale = Math.min(
                StageB / ItemLoVp[C.L_SIZE_B],
                StageL / ItemLoVp[C.L_SIZE_L]
            );
        } else {
            Item.Scale = StageB / ItemLoVp[C.L_SIZE_B];
        }
    }
    let PageL = Math.floor(ItemLoVp[C.L_SIZE_L] * Item.Scale);
    let PageB = Math.floor(ItemLoVp[C.L_SIZE_B] * (PageL / ItemLoVp[C.L_SIZE_L]));
    Item.Box.style[C.L_SIZE_l] = PageL + 'px';
    Item.Box.style[C.L_SIZE_b] = PageB + 'px';
    sML.style(Item, {
        width:  ItemLoVp.Width + 'px',
        height: ItemLoVp.Height + 'px',
        transform: 'scale(' + Item.Scale + ')'
    });
    return Item;
};


R.getItemViewport = (Item) => Item.IsPlaceholder ? null : (() => {
    const ViewportMeta = Item.Head.querySelector('meta[name="viewport"]');
    if(ViewportMeta)       return O.getViewportByMetaContent(           ViewportMeta.getAttribute('content'));
    if(Item.OnlySingleSVG) return O.getViewportByViewBox(Item.Body.firstElementChild.getAttribute('viewBox')); // It's also for Item of SVGs-in-Spine, or Fixed-Layout Item including SVG without Viewport.
    if(Item.OnlySingleIMG) return O.getViewportByImage(  Item.Body.firstElementChild                        ); // It's also for Item of Bitmaps-in-Spine.
                           return null                                                                       ;
})();


R.getItemLayoutViewport = (Item) => Item.Viewport ? Item.Viewport : B.ICBViewport ? B.ICBViewport : {
    Width:  R.Stage.Height * S['orientation-border-ratio'] / (/*Item.Spreaded &&*/ /^(left|right)$/.test(Item['rendition:page-spread']) ? 2 : 1),
    Height: R.Stage.Height
};


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
    if(S['book-rendition-layout'] == 'pre-paginated' || S['reader-view-mode'] != 'paged') MainContentLayoutLength += S['spread-gap'] * (R.Spreads.length - 1);
    R.Main.Book.style[C.L_SIZE_l] = MainContentLayoutLength + 'px';
    //E.dispatch('bibi:laid-out-stage');
};


R.layOutBook = (Opt) => new Promise((resolve, reject) => {
    // Opt: {
    //     Destination: BibiDestination,
    //     Reset: Boolean, (default: false)
    //     DoNotCloseUtilities: Boolean, (default: false)
    //     Setting: BibiSetting,
    //     before: Function
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
    if(!Opt.NoNotification) I.note(`Laying out...`);
    if(!Opt.Destination) Opt.Destination = { IIPP: I.PageObserver.getIIPP() };
    if(Opt.Setting) S.update(Opt.Setting);
    const Layout = {}; ['reader-view-mode', 'spread-layout-direction', 'apparent-reading-direction'].forEach(Pro => Layout[Pro] = S[Pro]);
    O.log(`Layout: %O`, Layout);
    if(typeof Opt.before == 'function') Opt.before();
    if(!Opt.Reset) {
        resolve();
    } else {
        R.resetStage();
        const Promises = [];
        R.Spreads.forEach(Spread => Promises.push(R.layOutSpreadAndItsItems(Spread)));
        Promise.all(Promises).then(() => {
            R.organizePages();
            R.layOutStage();
            resolve();
        });
    }
}).then(() => {
    return R.focusOn({ Destination: Opt.Destination, Duration: 0 });
}).then(() => {
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('laying-out');
    if(!Opt.NoNotification) I.note('');
    R.LayingOut = false;
    E.dispatch('bibi:laid-out');
    O.log(`Laid out.`, '</g>');
});


R.updateOrientation = () => {
    const PreviousOrientation = R.Orientation;
    if(typeof window.orientation != 'undefined') {
        R.Orientation = (window.orientation == 0 || window.orientation == 180) ? 'portrait' : 'landscape';
    } else {
        const W = window.innerWidth  - (S.ARA == 'vertical'   ? O.Scrollbars.Width  : 0);
        const H = window.innerHeight - (S.ARA == 'horizontal' ? O.Scrollbars.Height : 0);
        R.Orientation = (W / H) < S['orientation-border-ratio'] ? 'portrait' : 'landscape';
    }
    if(R.Orientation != PreviousOrientation) {
        if(PreviousOrientation) E.dispatch('bibi:changes-orientation', R.Orientation);
        O.HTML.classList.remove('orientation-' + PreviousOrientation);
        O.HTML.classList.add('orientation-' + R.Orientation);
        if(PreviousOrientation) E.dispatch('bibi:changed-orientation', R.Orientation);
    }
};


R.changeView = (Par) => {
    if(
        S['fix-reader-view-mode'] ||
        !Par || typeof Par.Mode != 'string' || !/^(paged|horizontal|vertical)$/.test(Par.Mode) ||
        S.RVM == Par.Mode && !Par.Force
    ) return false;
    if(L.Opened) {
        E.dispatch('bibi:changes-view');
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.add('changing-view');
        const Delay = [
            O.TouchOS ? 99 : 3,
            O.TouchOS ? 99 : 33
        ];
        setTimeout(() => {
            E.dispatch('bibi:closes-utilities');
        }, Delay[0]);
        setTimeout(() => {
            R.layOutBook({
                Reset: true,
                NoNotification: Par.NoNotification,
                Setting: {
                    'reader-view-mode': Par.Mode
                }
            }).then(() => {
                O.HTML.classList.remove('changing-view');
                O.HTML.classList.remove('busy');
                O.Busy = false;
                setTimeout(() => E.dispatch('bibi:changed-view', Par.Mode), 0);
            });
        }, Delay[0] + Delay[1]);
    } else {
        S.update({
            'reader-view-mode': Par.Mode
        });
        L.play();
    }
    if(S['keep-settings'] && O.Biscuits) O.Biscuits.memorize('Book', { RVM: Par.Mode });
};


Object.defineProperties(R, { // To ensure backward compatibility.
    Current: { get: () => I.PageObserver.Current },
    updateCurrent: { get: () => I.PageObserver.updateCurrent }
});


R.focusOn = (Par) => new Promise((resolve, reject) => {
    if(R.Moving) return reject();
    if(typeof Par == 'number' || /^\d+$/.test(Par)) Par = { Destination: Par * 1 };
    if(!Par) return reject();
    const _ = Par.Destination = R.hatchDestination(Par.Destination);
    if(!_) return reject();
    E.dispatch('bibi:is-going-to:focus-on', Par);
    R.Moving = true;
    Par.FocusPoint = 0;
    if(S['book-rendition-layout'] == 'reflowable') {
        if(typeof _.Point == 'number') {
            Par.FocusPoint = _.Point;
        } else {
            Par.FocusPoint = O.getElementCoord(_.Page)[C.L_AXIS_L];
            if(_.Side == 'after') Par.FocusPoint += (_.Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
            if(S.SLD == 'rtl') Par.FocusPoint += _.Page.offsetWidth;
        }
        if(S.SLD == 'rtl') Par.FocusPoint -= R.Stage.Width;
    } else {
        if(R.Stage[C.L_SIZE_L] >= _.Page.Spread['offset' + C.L_SIZE_L]) {
            Par.FocusPoint = O.getElementCoord(_.Page.Spread)[C.L_AXIS_L];
            Par.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - _.Page.Spread['offset' + C.L_SIZE_L]) / 2);
        } else {
            Par.FocusPoint = O.getElementCoord(_.Page)[C.L_AXIS_L];
            if(R.Stage[C.L_SIZE_L] > _.Page['offset' + C.L_SIZE_L]) Par.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - _.Page['offset' + C.L_SIZE_L]) / 2);
            else if(_.Side == 'after') Par.FocusPoint += (_.Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
        }
    }
    if(typeof _.TextNodeIndex == 'number') R.selectTextLocation(_); // Colorize Destination with Selection
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[C.L_AXIS_L] = Par.FocusPoint; if(!S['use-full-height'] && S.RVM == 'vertical') ScrollTarget.Y -= I.Menu.Height;
    return sML.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: typeof Par.Duration == 'number' ? Par.Duration : (S.SLA == S.ARA && S.RVM != 'paged') ? 222 : 0,
        Easing: (Pos) => (Pos === 1) ? 1 : Math.pow(2, -10 * Pos) * -1 + 1
    }).then(() => {
        resolve(_);
        E.dispatch('bibi:focused-on', Par);
    }).catch(reject).then(() => {
        R.Moving = false;
    });
}).catch(() => Promise.resolve());

    R.hatchDestination = (_) => {
        if(!_) return null;
        if(
            S.BRL == 'reflowable'
                &&
            (S.SLA == 'vertical' && /-tb$/.test(B.WritingMode) || S.SLA == 'horizontal' && /^tb-/.test(B.WritingMode))
                &&
            ((_.P & /\./.test(_.P)) || _.Element || _.ElementSelector)
        ) {
            _.Point = R.hatchPoint(_);
            return _;
        }
        delete _.Point;
        if(_.Page) {
            if(R.Pages[_.Page.Index] != _.Page) delete _.Page; // Pages of the Item have been replaced.
            else return _;
        }
        if(typeof _ == 'number' || (typeof _ == 'string' && /^\d+$/.test(_))) {
            return { Page: R.Items[_].Pages[0] };
        } else if(typeof _ == 'string') {
                 if(_ == 'head' || _ == 'foot') _ = { Edge: _ };
            else if(X['EPUBCFI'])               _ = X['EPUBCFI'].getDestination(_);
        } else if(typeof _.IndexInItem == 'number') {
            if(R.Pages[_.Index] == _) return { Page: _ }; // Page (If Pages of the Item have not been replaced)
        } else if(typeof _.Index == 'number') {
            return { Page: _.Pages[0] }; // Item or Spread
        } else if(_.tagName) {
            _ = { Element: _ };
        }
        _.Page = R.hatchPage(_);
        return _;
    };

    R.hatchPage = (_) => {
        if(typeof _.P == 'string' && _.P) Object.assign(_, R.getPDestination(_.P));
        if(_.Page) return _.Page;
        if(typeof _.PageIndex == 'number') return R.Pages[_.PageIndex];
        if(typeof _.SIPP == 'number' && ((typeof _.PageIndexInSpread != 'number' && typeof _.PageProgressInSpread != 'number') || (typeof _.SpreadIndex != 'number' && !_.Spread))) _.SpreadIndex = Math.floor(_.SIPP), _.PageProgressInSpread = String(_.SIPP).replace(/^\d*\./, '0.') * 1;
        if(typeof _.IIPP == 'number' && ((typeof _.PageIndexInItem   != 'number' && typeof _.PageProgressInItem   != 'number') || (typeof _.ItemIndex   != 'number' && !_.Item  ))) _.ItemIndex   = Math.floor(_.IIPP), _.PageProgressInItem   = String(_.IIPP).replace(/^\d*\./, '0.') * 1;
        if(_.Edge == 'head') return R.Pages[0];
        if(_.Edge == 'foot') return R.Pages[R.Pages.length - 1];
        try {
            if(typeof _.ElementSelector == 'string') {
                if(!_.Item) _.Item = R.hatchItem(_);
                if( _.Item) _.Element = _.Item.contentDocument.querySelector(_.ElementSelector);
                delete _.ElementSelector;
            }
            if(_.Element) {
                const NPOE = R.hatchNearestPageOfElement(_.Element);
                if(NPOE) return NPOE;
            }
            if(typeof    _.PageIndexInItem   == 'number') return R.hatchItem(_).Pages[_.PageIndexInItem];
            if(typeof    _.PageIndexInSpread == 'number') return R.hatchSpread(_).Pages[_.PageIndexInSpread];
            if(typeof _.PageProgressInItem   == 'number') return (Item   =>   Item.Pages[sML.limitMax(Math.floor(  Item.Pages.length * _.PageProgressInItem  ),   Item.Pages.length - 1)])(R.hatchItem(  _));
            if(typeof _.PageProgressInSpread == 'number') return (Spread => Spread.Pages[sML.limitMax(Math.floor(Spread.Pages.length * _.PageProgressInSpread), Spread.Pages.length - 1)])(R.hatchSpread(_));
            return (R.hatchItem(_) || R.hatchSpread(_)).Pages[0];
        } catch(Err) {}
        return null;
    };

        R.hatchItem = (_) => {
            if(_.Item) return _.Item;
            if(typeof _.ItemIndex == 'number') return R.Items[_.ItemIndex];
            if(typeof _.ItemIndexInSpine == 'number') return B.Package.Spine[_.ItemIndexInSpine];
            if(typeof _.ItemIndexInSpread == 'number') try { return R.hatchSpread(_).Items[_.ItemIndexInSpread]; } catch(_) { return null; }
            //if(_.Element && _.Element.ownerDocument.body.Item && _.Element.ownerDocument.body.Item.Pages) return _.Element.ownerDocument.body.Item;
            return null;
        };

        R.hatchSpread = (_) => {
            if(_.Spread) return _.Spread;
            if(typeof _.SpreadIndex == 'number') return R.Spreads[_.SpreadIndex];
            return null;
        };

        R.hatchNearestPageOfElement = (Ele) => {
            if(!Ele || !Ele.tagName) return null;
            const Item = Ele.ownerDocument.body.Item;
            if(!Item || !Item.Pages) return null;
            let NearestPage, ElementCoordInItem;
            if(Item.Columned) {
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_B];
                if(S.PPD == 'rtl' && S.SLA == 'vertical') ElementCoordInItem = /* !!!! Use offsetWidth of **Body** >>>> */ Item.Body.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
                NearestPage = Item.Pages[ElementCoordInItem <= 0 ? 0 : Math.floor(ElementCoordInItem / Item.ColumnBreadth)];
            } else {
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_L];
                if(S.PPD == 'rtl' && S.SLA == 'horizontal') ElementCoordInItem = /* !!!! Use offsetWidth of **HTML** >>>> */ Item.HTML.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
                NearestPage = Item.Pages[Math.floor(ElementCoordInItem / R.Stage[C.L_SIZE_L])];
                /*
                NearestPage = Item.Pages[0];
                for(let l = Item.Pages.length, i = 0; i < l; i++) {
                    ElementCoordInItem -= Item.Pages[i]['offset' + C.L_SIZE_L];
                    if(ElementCoordInItem <= 0) {
                        NearestPage = Item.Pages[i];
                        break;
                    }
                }
                //*/
            }
            return NearestPage;
        };

    R.hatchPoint = (_) => {
        try {
            if(typeof _.P == 'string' && _.P) Object.assign(_, R.getPDestination(_.P));
            if(typeof _.ElementSelector == 'string') { _.Element = R.hatchItem(_).contentDocument.querySelector(_.ElementSelector); delete _.ElementSelector; }
            if(_.Element) return R.hatchPointOfElement(_.Element);
        } catch(_) {}
        return null;
    };

        R.hatchPointOfElement = (Ele) => {
            if(!Ele || !Ele.tagName) return null;
            const Item = Ele.ownerDocument.body.Item;
            if(!Item || !Item.Pages) return null;
            let ElementCoordInItem;
            if(Item.Columned) {
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_B];
                if(S.PPD == 'rtl' && S.SLA == 'vertical') ElementCoordInItem = Item.Body.offsetWidth - ElementCoordInItem - Ele.offsetWidth; // Use offsetWidth of **Body**
            } else {
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_L];
                if(S.PPD == 'rtl' && S.SLA == 'horizontal') ElementCoordInItem += Ele.offsetWidth; // Use offsetWidth of **Body**
            }
            return O.getElementCoord(Item)[C.L_AXIS_L] + S['item-padding-' + C.L_OOBL_l] + ElementCoordInItem;
        };


R.getPDestination = (PString) => {
    PString = Bibi.verifySettingValue('string', 'p', PString);
    if(!PString) return null;
    if(/^[a-z]+$/.test(PString)) return (PString == 'head' || PString == 'foot') ? { Edge: PString } : null;
    const Steps = PString.split(/-[a-z]+$/.test(PString) ? '-' : '.');
    const ItemIndex = parseInt(Steps.shift()) - 1;
    if(ItemIndex <                  0) return { Edge: 'head' };
    if(ItemIndex > R.Items.length - 1) return { Edge: 'foot' };
    const Item = R.Items[ItemIndex];
    if(Steps.length) {
        if(/^[a-z]+$/.test(Steps[0])) {
            if(Steps[0] == 'end') return { Page: Item.Pages[Item.Pages.length - 1] };
        } else {
            let ElementSelector = `body`;
            Steps.forEach(Step => ElementSelector += `>*:nth-child(` + Step + `)`);
            const Element = Item.contentDocument.querySelector(ElementSelector);
            if(Element) return { Element: Element };
        }
    }
    return { Page: Item.Pages[0] };
};


R.selectTextLocation = (_) => {
    if(typeof _.TextNodeIndex != 'number' || !_.Element) return false;
    const _Node = _.Element.childNodes[_.TextNodeIndex];
    if(!_Node || !_Node.textContent) return;
    const Sides = { Start: { Node: _Node, Index: 0 }, End: { Node: _Node, Index: _Node.textContent.length } };
    if(_.TermStep) {
        if(_.TermStep.Preceding || _.TermStep.Following) {
            Sides.Start.Index = _.TermStep.Index, Sides.End.Index = _.TermStep.Index;
            if(_.TermStep.Preceding) Sides.Start.Index -= _.TermStep.Preceding.length;
            if(_.TermStep.Following)   Sides.End.Index += _.TermStep.Following.length;
            if(Sides.Start.Index < 0 || _Node.textContent.length < Sides.End.Index) return;
            if(_Node.textContent.substr(Sides.Start.Index, Sides.End.Index - Sides.Start.Index) != _.TermStep.Preceding + _.TermStep.Following) return;
        } else if(_.TermStep.Side && _.TermStep.Side == 'a') {
            Sides.Start.Node = _Node.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
            Sides.End.Index = _.TermStep.Index - 1;
        } else {
            Sides.Start.Index = _.TermStep.Index;
            Sides.End.Node = _Node.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
            Sides.End.Index = Sides.End.Node.textContent.length;
        }
    }
    return sML.Ranges.selectRange(sML.Ranges.getRange(Sides));
};


R.moveBy = (Par) => new Promise((resolve, reject) => {
    if(R.Moving || !L.Opened) return reject();
    if(!Par) return reject();
    switch(typeof Par) {
        case 'string':
        case 'number': Par = { Distance: Par };
        case 'object': Par.Distance *= 1;
    }
    if(typeof Par.Distance != 'number' || !isFinite(Par.Distance) || !Par.Distance) return reject();
    //Par.Distance = Par.Distance < 0 ? -1 : 1;
    E.dispatch('bibi:is-going-to:move-by', Par);
    const Current = (Par.Distance > 0 ? I.PageObserver.Current.List.slice(-1) : I.PageObserver.Current.List)[0], CurrentPage = Current.Page, CurrentItem = CurrentPage.Item;
    let Promised = null;
    if(
        true ||
        R.Columned ||
        S.BRL == 'pre-paginated' ||
        S.BRL == 'reflowable' && S.RVM == 'paged' ||
        CurrentItem['rendition:layout'] == 'pre-paginated' ||
        CurrentItem.Outsourcing ||
        CurrentItem.Pages.length == 1 ||
        Par.Distance < 0 && CurrentPage.IndexInItem == 0 ||
        Par.Distance > 0 && CurrentPage.IndexInItem == CurrentItem.Pages.length - 1
    ) {
        let Side = Par.Distance > 0 ? 'before' : 'after';
        if(Current.PageIntersectionStatus.Oversized) {
            if(Par.Distance > 0) {
                     if(Current.PageIntersectionStatus.Entering) Par.Distance = 0, Side = 'before';
                else if(Current.PageIntersectionStatus.Headed  ) Par.Distance = 0, Side = 'after';
            } else {
                     if(Current.PageIntersectionStatus.Footed  ) Par.Distance = 0, Side = 'before';
                else if(Current.PageIntersectionStatus.Passing ) Par.Distance = 0, Side = 'before';
            }
        } else {
            if(Par.Distance > 0) {
                if(Current.PageIntersectionStatus.Entering) Par.Distance = 0, Side = 'before';
            } else {
                if(Current.PageIntersectionStatus.Passing ) Par.Distance = 0, Side = 'before';
            }
        }
        let DestinationPageIndex = CurrentPage.Index + Par.Distance;
             if(DestinationPageIndex <                  0) DestinationPageIndex = 0,                  Side = 'before';
        else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1, Side = 'after';
        let DestinationPage = R.Pages[DestinationPageIndex];
        if(S.BRL == 'pre-paginated' && DestinationPage.Item.SpreadPair) {
            if(S.SLA == 'horizontal' && R.Stage[C.L_SIZE_L] > DestinationPage.Spread['offset' + C.L_SIZE_L]) {
                if(Par.Distance < 0 && DestinationPage.IndexInSpread == 0) DestinationPage = DestinationPage.Spread.Pages[1];
                if(Par.Distance > 0 && DestinationPage.IndexInSpread == 1) DestinationPage = DestinationPage.Spread.Pages[0];
            }
        }
        Par.Destination = { Page: DestinationPage, Side: Side };
        Promised = R.focusOn(Par).then(() => Par.Destination);
    } else {
        Promised = R.scrollBy(Par);
    }
    Promised.then(Returned => {
        resolve(Returned);
        E.dispatch('bibi:moved-by', Par);
    });
}).catch(() => Promise.resolve());


R.scrollBy = (Par) => new Promise((resolve, reject) => {
    if(!Par) return reject();
    if(typeof Par == 'number') Par = { Distance: Par };
    if(!Par.Distance || typeof Par.Distance != 'number') return reject();
    E.dispatch('bibi:is-going-to:scroll-by', Par);
    R.Moving = true;
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    switch(S.SLD) {
        case 'ttb': ScrollTarget.Y = R.Main.scrollTop  + R.Stage.Height * Par.Distance     ; break;
        case 'ltr': ScrollTarget.X = R.Main.scrollLeft + R.Stage.Width  * Par.Distance     ; break;
        case 'rtl': ScrollTarget.X = R.Main.scrollLeft + R.Stage.Width  * Par.Distance * -1; break;
    }
    sML.scrollTo(ScrollTarget, {
        Duration: typeof Par.Duration == 'number' ? Par.Duration : (S.RVM != 'paged' && S.SLA == S.ARA) ? 100 : 0,
        ForceScroll: Par.Cancelable ? false : true,
        ease: typeof Par.ease == 'function' ? Par.ease : null
    }).catch(() => true).then(() => {
        R.Moving = false;
        resolve();
    });
}).then(() => 
    E.dispatch('bibi:scrolled-by', Par)
);




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- User Interfaces

//----------------------------------------------------------------------------------------------------------------------------------------------


export const I = {}; // Bibi.UserInterfaces


I.initialize = () => {
    I.Utilities.create();
    I.TouchObserver.create();
    I.Notifier.create();
    I.Veil.create();
    E.bind('bibi:readied', () => {
        I.ScrollObserver.create();
        I.ResizeObserver.create();
        I.PageObserver.create();
        I.Catcher.create();
        I.Menu.create();
        I.Panel.create();
        I.Help.create();
        I.PoweredBy.create();
        I.FontSizeChanger.create();
        I.Loupe.create();
    });
    E.bind('bibi:initialized-book', () => {
        I.BookmarkManager.create();
    });
    E.bind('bibi:prepared', () => {
        I.FlickObserver.create();
        I.WheelObserver.create();
        I.PinchObserver.create();
        I.KeyObserver.create();
        I.EdgeObserver.create();
        I.Nombre.create();
        I.Slider.create();
        I.Flipper.create();
        I.Arrows.create();
        I.AxisSwitcher.create();
        I.Spinner.create();
    });
};


I.Utilities = { create: () => {
    const Utilities = I.Utilities = I.setToggleAction({
        openGracefuly: () => R.Moving || R.Breaking || Utilities.UIState == 'active' ? false : Utilities.open(),
        closeGracefuly: () => R.Moving || R.Breaking || Utilities.UIState == 'default' ? false : Utilities.close(),
        toggleGracefuly: () => R.Moving || R.Breaking ? false : Utilities.toggle()
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
        Count: 0,
        onScroll: (Eve) => { if(R.LayingOut || !L.Opened) return;
            if(!ScrollObserver.Scrolling) {
                ScrollObserver.Scrolling = true;
                O.HTML.classList.add('scrolling');
            }
            E.dispatch('bibi:is-scrolling');
            ScrollObserver.History.unshift(Math.ceil(R.Main['scroll' + C.L_OOBL_L])); // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            if(ScrollObserver.History.length > 2) ScrollObserver.History.pop();
            if(++ScrollObserver.Count == 8) {
                ScrollObserver.Count = 0;
                E.dispatch('bibi:scrolled');
            }
            clearTimeout(R.Timer_onScrollEnd);
            R.Timer_onScrollEnd = setTimeout(() => {
                ScrollObserver.Scrolling = false;
                ScrollObserver.Count = 0;
                O.HTML.classList.remove('scrolling');
                E.dispatch('bibi:scrolled');
            }, 123);
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
            const Frame = PageObserver.getFrame();
            if(Frame) {
                PageObserver.Current.Frame = Frame;
                const List = PageObserver.getList();
                if(List) {
                    PageObserver.Current.List = List;
                    PageObserver.Current.Pages = List.map(CE => CE.Page);
                    PageObserver.classify();
                }
            }
            return PageObserver.Current;
        },
        getFrame: () => {
            const Frame = {};
            Frame.Length = R.Main['offset' + C.L_SIZE_L];
            Frame[C.L_OOBL_L                              ] = Math.ceil(R.Main['scroll' + C.L_OOBL_L]); // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            Frame[C.L_OOBL_L == 'Top' ? 'Bottom' : 'Right'] = Frame[C.L_OOBL_L] + Frame.Length;
            //if(PageObserver.Current.List.length && Frame[C.L_BASE_B] == PageObserver.Current.Frame.Before && Frame[C.L_BASE_A] == PageObserver.Current.Frame.After) return false;
            return { Before: Frame[C.L_BASE_B], After: Frame[C.L_BASE_A], Length: Frame.Length };
        },
        getCandidatePageList: () => {
            const QSW = Math.ceil((R.Stage.Width - 1) / 4), QSH = Math.ceil((R.Stage.Height - 1) / 4), CheckRoute = [5, 6, 4, 2, 8]; // 4x4 matrix
            for(let l = CheckRoute.length, i = 0; i < l; i++) { const CheckPoint = CheckRoute[i];
                const Ele = document.elementFromPoint(QSW * (CheckPoint % 3 || 3), QSH * Math.ceil(CheckPoint / 3));
                if(Ele) {
                         if(Ele.IndexInItem) return [Ele]; // Page
                    else if(Ele.Pages)       return Ele.Pages; // Item or Spread
                    else if(Ele.Inside)      return Ele.Inside.Pages; // ItemBox or SpreadBox
                }
            }
            return PageObserver.IntersectingPages.length ? PageObserver.IntersectingPages : [];
        },
        getList: () => {
            let List = [], List_SpreadContained = [];
            const PageList = PageObserver.getCandidatePageList();
            if(!PageList.length || typeof PageList[0].Index != 'number') return null;
            const FirstIndex = sML.limitMin(PageList[                  0].Index - 2,                  0);
            const  LastIndex = sML.limitMax(PageList[PageList.length - 1].Index + 2, R.Pages.length - 1);
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
                    else                                                            List.push(CurrentEntry);
                }
            }
            return List_SpreadContained.length ? List_SpreadContained : List.length ? List : null;
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
            const CurrentElements = [], PastCurrentElements = R.Main.Book.querySelectorAll('.current');
            PageObserver.Current.List.forEach(CurrentEntry => {
                const Page = CurrentEntry.Page, ItemBox = Page.Item.Box, SpreadBox = Page.Spread.Box;
                if(!CurrentElements.includes(SpreadBox)) SpreadBox.classList.add('current'), CurrentElements.push(SpreadBox);
                if(!CurrentElements.includes(  ItemBox))   ItemBox.classList.add('current'), CurrentElements.push(  ItemBox);
                Page.classList.add('current'), CurrentElements.push(Page);
            });
            sML.forEach(PastCurrentElements)(PastCurrentElement => {
                if(!CurrentElements.includes(PastCurrentElement)) {
                    PastCurrentElement.classList.remove('current');
                }
            });
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
        getIIPP: (Par = {}) => {
            const Page = (Par.Page && typeof Par.Page.IndexInItem == 'number') ? Par.Page : (PageObserver.Current.Pages[0] || (Par.Item && Par.Item.IndexInSpine ? Par.Item.Pages[0] : R.Pages[0]));
            return Page.Item.Index + Page.IndexInItem / Page.Item.Pages.length;
        },
        getP: (Par = {}) => {
            let Item = null, Element = null;
            if(Par.Element && Par.Element.ownerDocument && Par.Element.ownerDocument.body.Item) {
                Item = Par.Element.ownerDocument.body.Item;
                Element = Par.Element;
            } else {
                if(B.Package.Metadata['rendition:layout'] == 'pre-paginated') return { P: String((PageObserver.Current.Pages[0] || R.Pages[0]).Item.Index + 1) };
                if(!Par.Page || typeof Par.Page.IndexInItem != 'number') Par.Page = null;
                const Page = Par.Page ? Par.Page : (
                       B.WritingMode.split('-')[0] == 'tb' && S.SLA == 'vertical'
                    || B.WritingMode.split('-')[1] == 'tb' && S.SLA == 'horizontal'
                ) ? PageObserver.Current.Pages[0] : PageObserver.IntersectingPages.filter(ISP => R.Stage[C.L_SIZE_L] * PageObserver.getIntersectionStatus(ISP).Ratio > 3)[0];
                if(!Page) return '';
                Item = Page.Item;
                const PageCoord = O.getElementCoord(Page, R.Main);
                const PageArea = { Left: PageCoord.X, Right: PageCoord.X + Page.offsetWidth, Top: PageCoord.Y, Bottom: PageCoord.Y + Page.offsetHeight };
                PageArea[C.L_OOBL_B] += S['item-padding-' + C.L_OOBL_b];
                PageArea[C.L_OEBL_B] -= S['item-padding-' + C.L_OEBL_b];
                if(Item.Columned) {
                    PageArea[C.L_OOBL_L] += S['item-padding-' + C.L_OOBL_l];
                    PageArea[C.L_OEBL_L] -= S['item-padding-' + C.L_OEBL_l];
                }
                const ItemCoord = O.getElementCoord(Item, R.Main);
                const HTMLArea = { Left: ItemCoord.X + S['item-padding-left'], Top: ItemCoord.Y + S['item-padding-top'] }; HTMLArea.Right = HTMLArea.Left + Item.HTML.offsetWidth, HTMLArea.Bottom = HTMLArea.Top + Item.HTML.offsetHeight;
                const ViewArea = { Left: R.Main.scrollLeft, Right: R.Main.scrollLeft + R.Stage.Width, Top: R.Main.scrollTop, Bottom: R.Main.scrollTop + R.Stage.Height };
                const PagedHTMLArea = Par.Page ? {
                    Left: Math.max(PageArea.Left, HTMLArea.Left               ) - HTMLArea.Left,  Right: Math.min(PageArea.Right,  HTMLArea.Right                  ) - HTMLArea.Left,
                     Top: Math.max(PageArea.Top,  HTMLArea.Top                ) - HTMLArea.Top , Bottom: Math.min(PageArea.Bottom, HTMLArea.Bottom                 ) - HTMLArea.Top
                } : {
                    Left: Math.max(PageArea.Left, HTMLArea.Left, ViewArea.Left) - HTMLArea.Left,  Right: Math.min(PageArea.Right,  HTMLArea.Right,  ViewArea.Right ) - HTMLArea.Left,
                     Top: Math.max(PageArea.Top,  HTMLArea.Top,  ViewArea.Top ) - HTMLArea.Top , Bottom: Math.min(PageArea.Bottom, HTMLArea.Bottom, ViewArea.Bottom) - HTMLArea.Top
                };
                PagedHTMLArea.Right--, PagedHTMLArea.Bottom--;
                const AbsoluteDistance = 10;
                let LPM = 1, BPM = 1, getFirstElement = (l, b) => Item.contentDocument.elementFromPoint(l, b);
                if(S.ARD == 'rtl') {
                    LPM *= -1;
                } else if(S.ARD == 'ttb') {
                    if(S.PPD == 'rtl') BPM *= -1;
                    getFirstElement = (l, b) => Item.contentDocument.elementFromPoint(b, l);
                }
                if(Par.TagNames) Par.TagNames = !Array.isArray(Par.TagNames) ? null : Par.TagNames.map(TN => typeof TN != 'string' ? '' : TN.replace(/\s+/, '').toLowerCase()).filter(TN => TN ? true : false);
                if(!Par.TagNames || !Par.TagNames.length) delete Par.TagNames;
                __: for(let i = 0, l = PagedHTMLArea[C.A_BASE_B], lp = Math.round((PagedHTMLArea[C.A_BASE_A] - PagedHTMLArea[C.A_BASE_B]) / 9); l * LPM < PagedHTMLArea[C.A_BASE_A] * LPM; l += lp) {
                    for(let j = 0, b = PagedHTMLArea[C.A_BASE_S], bp = Math.round((PagedHTMLArea[C.A_BASE_E] - PagedHTMLArea[C.A_BASE_S]) / 3); b * BPM < PagedHTMLArea[C.A_BASE_E] * BPM; b += bp) {
                        const Ele = getFirstElement(l, b);
                        if(Par.TagNames) {
                            if(Par.TagNames.includes(Ele.tagName.toLowerCase())) Element = Ele;
                        } else if(Ele != Item.HTML && Ele != Item.Body) {
                            Element = Ele;
                        }
                        if(Element) break __;
                    }
                }
                if(!Element) return (Page.IndexInItem < Item.Pages.length - 1) ? PageObserver.getP({ Page: Item.Pages[Page.IndexInItem + 1], TagNames: Par.TagNames }) : Item.Index < R.Items.length - 1 ? (Item.Index + 2) : 'foot';
            }
            const Steps = [];
            let Ele = Element; while(Ele != Item.Body) {
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
            return Steps.join('.');/*
            return {
                P: Steps.join('.'),
                ItemIndex: Item.Index,
                ElementSelector: 'body'; Steps.forEach(Step => ElementSelector += `>*:nth-child(` + Step + `)`),
                Item: Item,
                Element: Element
            };*/
        },
        // ---- Turning Face-up/down
        MaxTurning: 4,
        TurningItems_FaceUp: [],
        TurningItems_FaceDown: [],
        getTurningOriginItem: (Dir = 1) => {
            const List = PageObserver.Current.List.length ? PageObserver.Current.List : PageObserver.IntersectingPages.length ? PageObserver.IntersectingPages : null;
            try { return (Dir > 0 ? List[0] : List[List.length - 1]).Page.Item; } catch(Err) {} return null;
        },
        turnItems: (Opt) => {
            if(R.DoNotTurn || !S['allow-placeholders']) return;
            if(typeof Opt != 'object') Opt = {};
            const Dir = (I.ScrollObserver.History.length > 1) && (I.ScrollObserver.History[1] * C.L_AXIS_D > I.ScrollObserver.History[0] * C.L_AXIS_D) ? -1 : 1;
            const Origin = Opt.Origin || PageObserver.getTurningOriginItem(Dir); if(!Origin) return;
            const MUST = [Origin], NEW_ = [], KEEP = []; // const ___X = [];
            const Next = R.Items[Origin.Index + Dir]; if(Next) MUST.push(Next);
            const Prev = R.Items[Origin.Index - Dir]; if(Prev) MUST.push(Prev);
            MUST.forEach(Item => {
                if(Item.Turned != 'Up') (PageObserver.TurningItems_FaceUp.includes(Item) ? KEEP : NEW_).push(Item);
            });
            let i = 1/*, x = 0*/; while(++i < 9/* && x < 2*/ && KEEP.length + NEW_.length < PageObserver.MaxTurning) {
                const Item = R.Items[Origin.Index + i * Dir]; if(!Item) break;
                if(MUST.includes(Item)) continue;
                if(Item.Turned != 'Up') (PageObserver.TurningItems_FaceUp.includes(Item) ? KEEP : NEW_).push(Item);/* x++;*/
            }
            PageObserver.TurningItems_FaceUp.forEach(Item => { // use `forEach`, not `for`.
                if(KEEP.includes(Item)) return;
                if(KEEP.length + NEW_.length < PageObserver.MaxTurning) return KEEP.push(Item);
                clearTimeout(Item.Timer_Turn);
                PageObserver.turnItem(Item, { Down: true }); // ___X.push(Item);
            });
            NEW_.forEach((Item, i) => PageObserver.turnItem(Item, { Up: true, Delay: (MUST.includes(Item) ? 99 : 999) * i }));
            /*
            console.log('--------');
            console.log('Origin', Origin.Index);
            console.log('MUST', MUST.map(Item => Item.Index));
            console.log('KEEP', KEEP.map(Item => Item.Index));
            console.log('NEW_', NEW_.map(Item => Item.Index));
            // console.log('___X', ___X.map(Item => Item.Index));
            //*/
        },
        turnItem: (Item, Opt) => new Promise(resolve => {
            if(R.DoNotTurn || !S['allow-placeholders']) return;
            if(!Item) Item = PageObserver.getTurningOriginItem();
            if(typeof Opt != 'object') Opt = { Up: true };
            if(Opt.Up) {
                if(PageObserver.TurningItems_FaceUp.includes(Item)) return resolve();
                PageObserver.TurningItems_FaceUp.push(Item), PageObserver.TurningItems_FaceDown = PageObserver.TurningItems_FaceDown.filter(_ => _ != Item);
            } else {
                if(PageObserver.TurningItems_FaceDown.includes(Item)) return resolve();
                PageObserver.TurningItems_FaceDown.push(Item), PageObserver.TurningItems_FaceUp = PageObserver.TurningItems_FaceUp.filter(_ => _ != Item);
                if(O.RangeLoader) O.cancelExtraction(Item.Source);
            }
            Item.Timer_Turn = setTimeout(() => L.loadItem(Item, { IsPlaceholder: !(Opt.Up) }).then(() => {
                if(Opt.Up) PageObserver.TurningItems_FaceUp = PageObserver.TurningItems_FaceUp.filter(_ => _ != Item);
                else       PageObserver.TurningItems_FaceDown = PageObserver.TurningItems_FaceDown.filter(_ => _ != Item);
                R.layOutItem(Item).then(() => R.layOutSpread(Item.Spread, { Makeover: true, Reverse: Opt.Reverse })).then(() => resolve(Item));
            }), Opt.Delay || 0);
        })
    }
    E.bind('bibi:laid-out-for-the-first-time', LayoutOption => {
        PageObserver.IntersectingPages = [R.Spreads[LayoutOption.TargetSpreadIndex].Pages[0]];
        PageObserver.observeIntersection();
    });
    E.bind('bibi:opened', () => {
        PageObserver.updateCurrent();
        PageObserver.observeCurrent();
        PageObserver.observePageMove();
    });
    E.dispatch('bibi:created-page-observer');
}};


I.ResizeObserver = { create: () => {
    const ResizeObserver = I.ResizeObserver = {
        Resizing: false,
        TargetPageAfterResizing: null,
        onResize: (Eve) => { if(R.LayingOut || !L.Opened) return;
            if(!ResizeObserver.Resizing) {
                ResizeObserver.Resizing = true;
                //ResizeObserver.TargetPageAfterResizing = I.PageObserver.Current.List && I.PageObserver.Current.List[0] && I.PageObserver.Current.List[0].Page ? I.PageObserver.Current.List[0].Page : I.PageObserver.IntersectingPages[0];
                ResizeObserver.TargetPageAfterResizing = I.PageObserver.Current.List[0] ? I.PageObserver.Current.List[0].Page : null;
                ////////R.Main.removeEventListener('scroll', I.ScrollObserver.onScroll);
                O.Busy = true;
                O.HTML.classList.add('busy');
                O.HTML.classList.add('resizing');
            };
            clearTimeout(ResizeObserver.Timer_onResizeEnd);
            ResizeObserver.Timer_onResizeEnd = setTimeout(() => {
                R.updateOrientation();
                const Page = ResizeObserver.TargetPageAfterResizing || (I.PageObserver.Current.List[0] ? I.PageObserver.Current.List[0].Page : null);
                R.layOutBook({
                    Reset: true,
                    Destination: Page ? { ItemIndex: Page.Item.Index, PageProgressInItem: Page.IndexInItem / Page.Item.Pages.length } : null
                }).then(() => {
                    E.dispatch('bibi:resized', Eve);
                    O.HTML.classList.remove('resizing');
                    O.HTML.classList.remove('busy');
                    O.Busy = false;
                    ////////R.Main.addEventListener('scroll', I.ScrollObserver.onScroll);
                    //I.ScrollObserver.onScroll();
                    ResizeObserver.Resizing = false;
                });
            }, sML.UA.Trident ? 1200 : O.TouchOS ? 600 : 300);
        },
        observe: () => {
            window.addEventListener(E['resize'], ResizeObserver.onResize);
        }
    };
    E.bind('bibi:opened', ResizeObserver.observe);
    E.dispatch('bibi:created-resize-observer');
}};


I.TouchObserver = { create: () => {
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
            if(!Ele.BibiTapObserver) { const TimeLimit = { D2U: 300, U2D: 300 };
                Ele.BibiTapObserver = {
                    care: Opt.PreventDefault ? (Opt.StopPropagation ? _ => _.preventDefault() || _.stopPropagation() : _ => _.preventDefault()) : (Opt.StopPropagation ? _ => _.stopPropagation() : () => {}),
                    onPointerDown: function(Eve) {
                        if((typeof Eve.buttons == 'number' && Eve.buttons !== 1) || Eve.ctrlKey) return true;
                        this.care(Eve);
                        clearTimeout(this.Timer_forgetFloating);
                        clearTimeout(this.Timer_fireTap);
                        const DownTime = Date.now();
                        this.Touching = { Time: DownTime, Coord: O.getBibiEventCoord(Eve), Event: Eve };
                        if(!this.Floating) return;
                        if((DownTime - this.Floating.Time) < TimeLimit.U2D) {
                            this.Floating.PreviousTouching.Event.preventDefault();
                            this.Floating.Event.preventDefault();
                            Eve.preventDefault();
                        } else {
                            delete this.Floating;
                        }
                    },
                    onPointerUp: function(Eve) {
                        this.care(Eve);
                        if(!this.Touching) return;
                        const UpTime = Date.now();
                        if((UpTime - this.Touching.Time) < TimeLimit.D2U) {
                            const TouchEndCoord = O.getBibiEventCoord(Eve);
                            if(Math.abs(TouchEndCoord.X - this.Touching.Coord.X) < 3 && Math.abs(TouchEndCoord.Y - this.Touching.Coord.Y) < 3) {
                                let SDT = 0;
                                const Floating = { Time: UpTime, Event: Eve, PreviousTouching: this.Touching };
                                if(!this.Floating) {
                                    SDT = 1;
                                    this.Floating = Object.assign(Floating, { WaitingFor: 2 });
                                } else {
                                    SDT = this.Floating.WaitingFor;
                                    this.Floating = Object.assign(Floating, { WaitingFor: ++this.Floating.WaitingFor });
                                }
                                this.Timer_forgetFloating = setTimeout(() => { delete this.Floating; }, TimeLimit.U2D);
                                this.Timer_fireTap = setTimeout(() => { switch(SDT) {
                                    case 1: return Ele.BibiTapObserver.onTap(      Eve);
                                    case 2: return Ele.BibiTapObserver.onDoubleTap(Eve);
                                    case 3: return Ele.BibiTapObserver.onTripleTap(Eve);
                                }}, TimeLimit.U2D);
                            } else {
                                delete this.Floating;
                            }
                        }
                        delete this.Touching;
                    },
                    onTap:       (Eve) => E.dispatch(Ele, 'bibi:tapped'      , Eve),
                    onDoubleTap: (Eve) => E.dispatch(Ele, 'bibi:doubletapped', Eve),
                    onTripleTap: (Eve) => E.dispatch(Ele, 'bibi:tripletapped', Eve)
                };
                Ele.addEventListener(E['pointerdown'], Eve => Ele.BibiTapObserver.onPointerDown(Eve));
                Ele.addEventListener(E['pointerup'],   Eve => Ele.BibiTapObserver.onPointerUp(Eve));
            }
            return Ele;
        },
        setElementTapActions: (Ele) => {
            const onTap = (() => { switch(Ele.Type) {
                case 'toggle': return (Eve) => { if(Ele.UIState == 'disabled') return false;
                    I.setUIState(Ele, Ele.UIState == 'default' ? 'active' : 'default');
                };
                case 'radio': return (Eve) => { if(Ele.UIState == 'disabled') return false;
                    Ele.ButtonGroup.Buttons.forEach(Button => { if(Button != Ele) I.setUIState(Button, ''); });
                    I.setUIState(Ele, 'active');
                };
                default: return (Eve) => { if(Ele.UIState == 'disabled') return false;
                    I.setUIState(Ele, 'active');
                    clearTimeout(Ele.Timer_deactivate);
                    Ele.Timer_deactivate = setTimeout(() => I.setUIState(Ele, Ele.UIState == 'disabled' ? 'disabled' : ''), 200);
                };
            } })();
            E.add(Ele, 'bibi:tapped', Eve => { if((Ele.isAvailable && !Ele.isAvailable(Eve)) || (Ele.UIState == 'disabled') || (Ele.UIState == 'active' && Ele.Type == 'radio')) return Ele;
                onTap(Eve);
                if(Ele.hideHelp) Ele.hideHelp();
                if(Ele.note) setTimeout(Ele.note, 0);
                return Ele;
            });
            return Ele;
        },
        PointerEventNames: O.TouchOS ? [['touchstart', 'mousedown'], ['touchend', 'mouseup'], ['touchmove', 'mousemove']] : document.onpointermove !== undefined ? ['pointerdown', 'pointerup', 'pointermove'] : ['mousedown', 'mouseup', 'mousemove'],
        PreviousPointerCoord: { X: 0, Y: 0 },
        activateHTML: (HTML) => {
            TouchObserver.observeElementTap(HTML); const TOPENs = TouchObserver.PointerEventNames;
            E.add(HTML, 'bibi:tapped',       Eve => E.dispatch('bibi:tapped',         Eve));
            E.add(HTML, 'bibi:doubletapped', Eve => E.dispatch('bibi:doubletapped',   Eve)); //HTML.ownerDocument.addEventListener('dblclick', Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; });
            E.add(HTML, 'bibi:tripletapped', Eve => E.dispatch('bibi:tripletapped',   Eve));
            E.add(HTML, TOPENs[0],           Eve => E.dispatch('bibi:downed-pointer', Eve), E.Cpt1Psv0);
            E.add(HTML, TOPENs[1],           Eve => E.dispatch('bibi:upped-pointer',  Eve), E.Cpt1Psv0);
            E.add(HTML, TOPENs[2],           Eve => {
                const CC = O.getBibiEventCoord(Eve), PC = TouchObserver.PreviousPointerCoord;
                E.dispatch((PC.X != CC.X || PC.Y != CC.Y) ? 'bibi:moved-pointer' : 'bibi:stopped-pointer', Eve);
                TouchObserver.PreviousPointerCoord = CC;
                //Eve.preventDefault();
                Eve.stopPropagation();
            }, E.Cpt1Psv0);
        }
    }
    const checkTapAvailability = (BibiEvent) => {
        switch(S.RVM) {
            case 'horizontal': if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; else break;
            case 'vertical':   if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; else break;
        }
        if(BibiEvent.Target.ownerDocument) {
            if(O.isPointableContent(BibiEvent.Target)) return false;
            if(I.Slider.ownerDocument && (BibiEvent.Target == I.Slider || I.Slider.contains(BibiEvent.Target))) return false;
        }
        return true;
    };
    E.bind('bibi:readied',            (    ) => TouchObserver.activateHTML(   O.HTML));
    E.bind('bibi:postprocessed-item', (Item) => TouchObserver.activateHTML(Item.HTML));
    E.add('bibi:tapped', Eve => { if(I.isPointerStealth()) return false;
        if(I.OpenedSubpanel) return I.OpenedSubpanel.close() && false;
        const BibiEvent = O.getBibiEvent(Eve);
        if(!checkTapAvailability(BibiEvent)) return false;
        return BibiEvent.Division.X == 'center' && BibiEvent.Division.Y == 'middle' ? E.dispatch('bibi:tapped-center', Eve) : E.dispatch('bibi:tapped-not-center', Eve);
    });
    E.add('bibi:doubletapped', Eve => { if(I.isPointerStealth() || !L.Opened) return false;
        if(I.OpenedSubpanel) return I.OpenedSubpanel.close() && false;
        const BibiEvent = O.getBibiEvent(Eve);
        if(!checkTapAvailability(BibiEvent)) return false;
        return BibiEvent.Division.X == 'center' && BibiEvent.Division.Y == 'middle' ? E.dispatch('bibi:doubletapped-center', Eve) : E.dispatch('bibi:doubletapped-not-center', Eve);
    });
    E.add('bibi:tapped-center', () => I.Utilities.toggleGracefuly());
    E.dispatch('bibi:created-touch-observer');
}};


I.FlickObserver = { create: () => {
    const FlickObserver = I.FlickObserver = {
        Moving: 0,
        getDegree: (_) => (Deg => Deg < 0 ? Deg + 360 : Deg)(Math.atan2(_.Y * -1, _.X) * 180 / Math.PI),
        onTouchStart: (Eve) => {
            if(!L.Opened) return;
            //if(S.RVM != 'paged' && O.TouchOS) return;
            if(FlickObserver.LastEvent) return FlickObserver.onTouchEnd();
            if(I.Loupe.Transforming) return;
            FlickObserver.LastEvent = Eve;
            const EventCoord = O.getBibiEventCoord(Eve);
            FlickObserver.StartedAt = {
                X: EventCoord.X,
                Y: EventCoord.Y,
                Item: Eve.target.ownerDocument.body.Item || null,
                TimeStamp: Eve.timeStamp,
                ScrollLeft: R.Main.scrollLeft,
                ScrollTop: R.Main.scrollTop,
                OriginList: I.PageObserver.updateCurrent().List
            };
            //Eve.preventDefault();
            E.add('bibi:moved-pointer', FlickObserver.onTouchMove);
            E.add('bibi:upped-pointer', FlickObserver.onTouchEnd);
        },
        cancel: () => {
            delete FlickObserver.StartedAt;
            delete FlickObserver.LastEvent;
            E.remove('bibi:moved-pointer', FlickObserver.onTouchMove);
            E.remove('bibi:upped-pointer', FlickObserver.onTouchEnd);
            FlickObserver.Moving = 0;
        },
        onTouchMove: (Eve) => {
            //if(Eve.touches && Eve.touches.length == 1 && O.getViewportZooming() <= 1) Eve.preventDefault();
            I.ScrollObserver.breakCurrentScrolling();
            if(FlickObserver.StartedAt) {
                if(!FlickObserver.Moving) {
                    const TimeFromTouchStarted = Eve.timeStamp - FlickObserver.StartedAt.TimeStamp;
                    if(!O.TouchOS && (Eve.type == 'mousemove' || Eve.pointerType == 'mouse')) { if(TimeFromTouchStarted < 234) return FlickObserver.cancel(); }
                    else                                                                      { if(TimeFromTouchStarted > 234) return FlickObserver.cancel(); }
                    FlickObserver.StartedAt.TimeStamp = Eve.timeStamp;
                }
                const EventCoord = O.getBibiEventCoord(Eve);
                const Passage = { X: EventCoord.X - FlickObserver.StartedAt.X, Y: EventCoord.Y - FlickObserver.StartedAt.Y };
                if(++FlickObserver.Moving <= 3) {
                    const Deg = FlickObserver.getDegree(Passage);
                    FlickObserver.StartedAt.LaunchingAxis = (315 <= Deg || Deg <=  45) || (135 <= Deg && Deg <= 225) ? 'X' :
                                                            ( 45 <  Deg && Deg <  135) || (225 <  Deg && Deg <  315) ? 'Y' : '';
                }
                if(FlickObserver.StartedAt.LaunchingAxis == C.A_AXIS_B) {
                    // Orthogonal
                } else {
                    // Natural
                    if(S.RVM != 'paged' && Eve.type == 'touchmove') return FlickObserver.cancel();
                    if(S['content-draggable'][S.RVM == 'paged' ? 0 : 1] && I.isScrollable()) R.Main['scroll' + C.L_OOBL_L] = FlickObserver.StartedAt['Scroll' + C.L_OOBL_L] + Passage[C.L_AXIS_L] * -1;
                }
                Eve.preventDefault();
                if(FlickObserver.StartedAt.Item) {
                    FlickObserver.StartedAt.Item.HTML.classList.add('bibi-flick-hot');
                    FlickObserver.StartedAt.Item.contentWindow.getSelection().empty();
                }
                FlickObserver.LastEvent = Eve;
                if(EventCoord[C.A_AXIS_L] <= 0 || EventCoord[C.A_AXIS_L] >= R.Stage[C.A_SIZE_L] || EventCoord[C.A_AXIS_B] <= 0 || EventCoord[C.A_AXIS_B] >= R.Stage[C.A_SIZE_B]) return FlickObserver.onTouchEnd(Eve, { Swipe: true });
            }
        },
        onTouchEnd: (Eve, Opt) => {
            if(!Eve) Eve = FlickObserver.LastEvent;
            E.remove('bibi:moved-pointer', FlickObserver.onTouchMove);
            E.remove('bibi:upped-pointer', FlickObserver.onTouchEnd);
            FlickObserver.Moving = 0;
            let cb = undefined, Par = {};
            if(FlickObserver.StartedAt) {
                const EventCoord = O.getBibiEventCoord(Eve);
                const Passage = { X: EventCoord.X - FlickObserver.StartedAt.X, Y: EventCoord.Y - FlickObserver.StartedAt.Y };
                if(FlickObserver.StartedAt.Item) FlickObserver.StartedAt.Item.HTML.classList.remove('bibi-flick-hot');
                if(!I.Loupe.Transforming) {
                    if(FlickObserver.StartedAt.LaunchingAxis == C.A_AXIS_B && Math.abs(Passage[C.A_AXIS_B] / 100) >= 1) {
                        // Orthogonal Pan/Releace
                        cb = FlickObserver.getOrthogonalTouchMoveFunction();
                    }
                    if(!cb && (Math.abs(Passage.X) >= 3 || Math.abs(Passage.Y) >= 3)) {
                        // Moved (== not Tap)
                        Eve.preventDefault();
                        Par.Speed = Math.sqrt(Math.pow(Passage.X, 2) + Math.pow(Passage.Y, 2)) / (Eve.timeStamp - FlickObserver.StartedAt.TimeStamp);
                        Par.Deg = FlickObserver.getDegree(Passage);
                        if(O.getViewportZooming() <= 1 && (Eve.timeStamp - FlickObserver.StartedAt.TimeStamp) <= 300) {
                            Par.OriginList = FlickObserver.StartedAt.OriginList;
                            cb = (Opt && Opt.Swipe) ? FlickObserver.onSwipe : FlickObserver.onFlick;
                        } else if(I.isScrollable()) {
                            cb = FlickObserver.onPanRelease;
                        }
                    } else {
                        // Not Moved (== Tap)
                        // [[[[ Do Nothing ]]]] (to avoid conflicts with other tap events on other UIs like Arrows.)
                    }
                }
                delete FlickObserver.StartedAt;
            }
            delete FlickObserver.LastEvent;
            return (cb ? cb(Eve, Par) : Promise.resolve());
        },
        onFlick: (Eve, Par) => {
            if(S.RVM != 'paged' && !S['content-draggable'][S.RVM == 'paged' ? 0 : 1]) return Promise.resolve();
            if(typeof Par.Deg != 'number') return Promise.resolve();
            const Deg = Par.Deg;
            const Dir = (330 <= Deg || Deg <=  30) ? 'left' /* to right */ :
                        ( 60 <= Deg && Deg <= 120) ? 'bottom' /* to top */ :
                        (150 <= Deg && Deg <= 210) ? 'right' /* to left */ :
                        (240 <= Deg && Deg <= 300) ? 'top' /* to bottom */ : '';
            const Dist = C.d2d(Dir, I.orthogonal('touch-moves') == 'move');
            if(!Dist) {
                // Orthogonal (not for "move")
                return new Promise(resolve => {
                    FlickObserver.getOrthogonalTouchMoveFunction()();
                    resolve();
                });
            } else if(S.RVM == 'paged' || S.RVM != (/^[lr]/.test(Dir) ? 'horizontal' : /^[tb]/.test(Dir) ? 'vertical' : '')) {
                // Paged || Scrolling && Orthogonal
                const PageIndex = (Dist > 0 ? Par.OriginList.slice(-1)[0].Page.Index : Par.OriginList[0].Page.Index);
                return R.focusOn({
                    Destination: { Page: R.Pages[PageIndex + Dist] ? R.Pages[PageIndex + Dist] : R.Pages[PageIndex] },
                    Duration: !I.isScrollable() ? 0 : S.RVM != 'paged' || S['content-draggable'][0] ? 123 : 0
                });
            } else {
                // Scrolling && Natural
                return R.scrollBy({
                    Distance: Dist * (Par.Speed ? sML.limitMinMax(Math.round(Par.Speed * 100) * 0.08, 0.33, 10) * 333 / (S.SLD == 'ttb' ? R.Stage.Height : R.Stage.Width) : 1),
                    Duration: 1234,
                    Cancelable: true,
                    ease: (_) => (Math.pow((_ - 1), 4) - 1) * -1
                });
            }
        },
        onSwipe: (Eve, Par) => FlickObserver.onFlick(Eve, Par),
        onPanRelease: (Eve, Par) => {
            if(S.RVM != 'paged' || !S['content-draggable'][0]) return Promise.resolve(); // Only for Paged View ====
            const Deg = Par.Deg;
            const Dir = (270 <  Deg || Deg <   90) ? 'left'  /* to right */ :
                        ( 90 <  Deg && Deg <  270) ? 'right' /* to left  */ : '';
            const Dist = C.d2d(Dir);
            const CurrentList = I.PageObserver.updateCurrent().List;
            return R.focusOn({
                Destination: { Page: (Dist >= 0 ? CurrentList.slice(-1)[0].Page : CurrentList[0].Page) },
                Duration: !I.isScrollable() ? 0 : S['content-draggable'][0] ? 123 : 0
            });
        },
        getOrthogonalTouchMoveFunction: () => { switch(I.orthogonal('touch-moves')) {
            case 'switch': if(I.AxisSwitcher) return I.AxisSwitcher.switchAxis; break;
            case 'utilities': return I.Utilities.toggleGracefuly; break;
        } },
        getCNPf: (Ele) => Ele.ownerDocument == document ? '' : 'bibi-',
        activateElement: (Ele) => { if(!Ele) return false;
            Ele.addEventListener(E['pointerdown'], FlickObserver.onTouchStart, E.Cpt1Psv0);
            const CNPf = FlickObserver.getCNPf(Ele);
            /**/                             Ele.ownerDocument.documentElement.classList.add(CNPf + 'flick-active');
            if(I.isScrollable()) Ele.ownerDocument.documentElement.classList.add(CNPf + 'flick-scrollable');
        },
        deactivateElement: (Ele) => { if(!Ele) return false;
            Ele.removeEventListener(E['pointerdown'], FlickObserver.onTouchStart, E.Cpt1Psv0);
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
        reset: () => {
            WheelObserver.TotalDelta = 0;
            WheelObserver.Progress = 0;
            WheelObserver.Turned = false;
            WheelObserver.Wheels = [];
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
            const ToDo = WA != C.A_AXIS_L ? I.orthogonal('wheelings') : S.RVM == 'paged' ? 'move' : WheelObserver.OverlaidUIs.filter(OUI => OUI.contains(Eve.target)).length ? 'simulate' : '';
            if(!ToDo) return;
            //Eve.preventDefault(); // Must not prevent.
            //Eve.stopPropagation(); // No need to stop.
            if(WheelObserver.Hot) return;
            switch(ToDo) {
                case 'simulate':  return WheelObserver.scrollNatural(Eve, WA);
                case 'across'  :  return WheelObserver.scrollAcross(Eve, WA);
                case 'move':      return WheelObserver.move(CW);
                case 'utilities': return WheelObserver.toggleUtilities(CW);
                case 'switch':    return WheelObserver.switchAxis(CW);
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
        move: (CW) => {
            if(!CW.Wheeled) return;
            WheelObserver.heat();
            R.moveBy({ Distance: CW.Distance, Duration: I.isScrollable() && S['content-draggable'][0] ? 123 : 0 });
        },
        toggleUtilities: (CW) => {
            if(!CW.Wheeled) return;
            WheelObserver.heat();
            I.Utilities.toggleGracefuly();
        },
        switchAxis: () => {
            if(!I.AxisSwitcher || Math.abs(WheelObserver.Progress) < 1) return;
            WheelObserver.heat();
            I.AxisSwitcher.switchAxis();
        },
        OverlaidUIs: []
    };
    document.addEventListener('wheel', Eve => E.dispatch('bibi:is-wheeling', Eve), E.Cpt1Psv0);
    E.add('bibi:loaded-item', Item => Item.contentDocument.addEventListener('wheel', Eve => E.dispatch('bibi:is-wheeling', Eve), E.Cpt1Psv0));
    E.add('bibi:opened', () => {
        [I.Menu, I.Slider].forEach(UI => {
            if(!UI.ownerDocument) return;
            UI.addEventListener('wheel', Eve => { Eve.preventDefault(); Eve.stopPropagation(); }, E.Cpt1Psv0);
            WheelObserver.OverlaidUIs.push(UI);
        });
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
            Ele.addEventListener('touchstart', PinchObserver.onTouchStart, E.Cpt1Psv0);
            Ele.addEventListener('touchmove',  PinchObserver.onTouchMove,  E.Cpt1Psv0);
            Ele.addEventListener('touchend',   PinchObserver.onTouchEnd,   E.Cpt1Psv0);
            Ele.ownerDocument.documentElement.classList.add(PinchObserver.getCNPf(Ele) + 'pinch-active');
        },
        deactivateElement: (Ele) => { if(!Ele) return false;
            Ele.removeEventListener('touchstart', PinchObserver.onTouchStart, E.Cpt1Psv0);
            Ele.removeEventListener('touchmove',  PinchObserver.onTouchMove,  E.Cpt1Psv0);
            Ele.removeEventListener('touchend',   PinchObserver.onTouchEnd,   E.Cpt1Psv0);
            Ele.ownerDocument.documentElement.classList.remove(PinchObserver.getCNPf(Ele) + 'pinch-active');
        }
    };
    PinchObserver.activateElement(R.Main);
    E.add('bibi:loaded-item', Item => PinchObserver.activateElement(Item.HTML));
    E.dispatch('bibi:created-pinch-observer');
}};


I.KeyObserver = { create: () => { if(!S['use-keys']) return;
    const KeyObserver = I.KeyObserver = {
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
            //Object.assign(_, { 'Space': 1, 'SPACE': -1 }); // Space key is reserved for Loupe.
            KeyObserver.KeyParameters = _;
        },
        updateKeyParameters: () => {
            const _O = I.orthogonal('arrow-keys');
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
                    E.dispatch('bibi:is-holding-key', Eve);
                }
            }
            E.dispatch('bibi:downed-key', Eve);
        },
        onKeyUp: (Eve) => {
            if(!KeyObserver.onEvent(Eve)) return false;
            if(KeyObserver.ActiveKeys[Eve.BibiKeyName] && Date.now() - KeyObserver.ActiveKeys[Eve.BibiKeyName] < 300) {
                E.dispatch('bibi:touched-key', Eve);
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
            if(!Eve.BibiKeyName) return false;
            const KeyParameter = KeyObserver.KeyParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!KeyParameter) return false;
            Eve.preventDefault();
            switch(typeof KeyParameter) {
                case 'number': if(I.Flipper.isAbleToFlip(KeyParameter)) {
                    if(I.Arrows) E.dispatch(I.Arrows[KeyParameter], 'bibi:tapped', Eve);
                    I.Flipper.flip(KeyParameter);
                } break;
                case 'string': switch(KeyParameter) {
                    case 'head': case 'foot': return R.focusOn({ Destination: KeyParameter, Duration: 0 });
                    case 'utilities': return I.Utilities.toggleGracefuly();
                    case 'switch': return I.AxisSwitcher ? I.AxisSwitcher.switchAxis() : false;
                } break;
            }
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


I.EdgeObserver = { create: () => {
    const EdgeObserver = I.EdgeObserver = {};
    E.add('bibi:opened', () => {
        E.add(['bibi:tapped-not-center', 'bibi:doubletapped-not-center'], Eve => {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            const Dir = I.Flipper.getDirection(BibiEvent.Division), Ortho = I.orthogonal('edges'), Dist = C.d2d(Dir, Ortho == 'move');
            if(Dist) {
                if(I.Arrows && I.Arrows.areAvailable(BibiEvent)) E.dispatch(I.Arrows[Dist], 'bibi:tapped', Eve);
                if(I.Flipper.isAbleToFlip(Dist)) I.Flipper.flip(Dist);
            } else if(typeof C.DDD[Dir] == 'string') switch(Ortho) {
                case 'utilities': I.Utilities.toggleGracefuly(); break;
                case 'switch': if(I.AxisSwitcher) I.AxisSwitcher.switchAxis(); break;
            }
        });
        if(!O.TouchOS) {
            E.add('bibi:moved-pointer', Eve => {
                if(I.isPointerStealth()) return false;
                const BibiEvent = O.getBibiEvent(Eve);
                if(I.Arrows.areAvailable(BibiEvent)) {
                    const Dir = I.Flipper.getDirection(BibiEvent.Division), Ortho = I.orthogonal('edges'), Dist = C.d2d(Dir, Ortho == 'move');
                    if(Dist && I.Flipper.isAbleToFlip(Dist)) {
                        EdgeObserver.Hovering = true;
                        if(I.Arrows) {
                            const Arrow = I.Arrows[Dist];
                            E.dispatch(Arrow,      'bibi:hovered',   Eve);
                            E.dispatch(Arrow.Pair, 'bibi:unhovered', Eve);
                        }
                        const HoveringHTML = BibiEvent.Target.ownerDocument.documentElement;
                        if(EdgeObserver.HoveringHTML != HoveringHTML) {
                            if(EdgeObserver.HoveringHTML) EdgeObserver.HoveringHTML.removeAttribute('data-bibi-cursor');
                            (EdgeObserver.HoveringHTML = HoveringHTML).setAttribute('data-bibi-cursor', Dir);
                        }
                        return;
                    }
                }
                if(EdgeObserver.Hovering) {
                    EdgeObserver.Hovering = false;
                    if(I.Arrows) E.dispatch([I.Arrows.Back, I.Arrows.Forward], 'bibi:unhovered', Eve);
                    if(EdgeObserver.HoveringHTML) EdgeObserver.HoveringHTML.removeAttribute('data-bibi-cursor'), EdgeObserver.HoveringHTML = null;
                }
            });
            sML.forEach(O.Body.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault));
        }
    });
    if(!O.TouchOS) {
        E.add('bibi:loaded-item', Item => sML.forEach(Item.Body.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault)));
    }
    E.dispatch('bibi:created-edge-observer');
}};


I.Notifier = { create: () => {
    const Notifier = I.Notifier = O.Body.appendChild(sML.create('div', { id: 'bibi-notifier',
        show: (Msg, Err) => {
            clearTimeout(Notifier.Timer_hide);
            Notifier.P.className = Err ? 'error' : '';
            Notifier.P.innerHTML = Msg;
            O.HTML.classList.add('notifier-shown');
            if(L.Opened && !Err) Notifier.addEventListener(O.TouchOS ? E['pointerdown'] : E['pointerover'], Notifier.hide);
        },
        hide: (Time = 0) => {
            clearTimeout(Notifier.Timer_hide);
            Notifier.Timer_hide = setTimeout(() => {
                if(L.Opened) Notifier.removeEventListener(O.TouchOS ? E['pointerdown'] : E['pointerover'], Notifier.hide);
                O.HTML.classList.remove('notifier-shown');
            }, Time);
        },
        note: (Msg, Time, Err) => {
            if(!Msg) return Notifier.hide();
            Notifier.show(Msg, Err);
            if(typeof Time == 'undefined') Time = O.Busy && !L.Opened ? 8888 : 2222;
            if(typeof Time == 'number') Notifier.hide(Time);
        }
    }));
    Notifier.P = Notifier.appendChild(document.createElement('p'));
    I.note = Notifier.note;
    E.dispatch('bibi:created-notifier');
}};

    I.note = () => false;


I.Veil = { create: () => {
    const Veil = I.Veil = I.setToggleAction(O.Body.appendChild(sML.create('div', { id: 'bibi-veil' })), {
        // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
        onopened: () => (O.HTML.classList.add('veil-opened'), Veil.classList.remove('closed')),
        onclosed: () => (Veil.classList.add('closed'), O.HTML.classList.remove('veil-opened'))
    });
    ['touchstart', 'pointerdown', 'mousedown', 'click'].forEach(EN => Veil.addEventListener(EN, Eve => Eve.stopPropagation(), E.Cpt0Psv0));
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
        return Msg['en'] ? Msg['en'].replace(/<[^>]*>/g, '') : '';
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
        E.add('bibi:moved-pointer', Eve => {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(Menu.Timer_close);
            if(BibiEvent.Division.Y == 'top') { //if(BibiEvent.Coord.Y < Menu.Height * 1.5) {
                E.dispatch(Menu, 'bibi:hovered', Eve);
            } else if(Menu.Hover) {
                Menu.Timer_close = setTimeout(() => E.dispatch(Menu, 'bibi:unhovered', Eve), 123);
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
        if(!S['fix-reader-view-mode'])                                                                     Components.push('ViewModeSection');
        if(O.Embedded)                                                                                     Components.push('NewWindowButton');
        if(O.FullscreenTarget && !O.TouchOS)                                                               Components.push('FullscreenButton');
        if(S['website-href'] && /^https?:\/\/[^\/]+/.test(S['website-href']) && S['website-name-in-menu']) Components.push('WebsiteLink');
        if(!S['remove-bibi-website-link'])                                                                 Components.push('BibiWebsiteLink');
        if(!Components.length) {
            delete I.Menu.Config;
            return;
        }
        const Config = Menu.Config = sML.applyRtL(I.createSubpanel({ id: 'bibi-subpanel_config' }), Menu.Config); delete Config.create;
        const Opener = Config.bindOpener(Menu.R.addButtonGroup({ Sticky: true }).addButton({
            Type: 'toggle',
            Labels: {
                default: { default: `Configure Setting`,            ja: `設定を変更` },
                active:  { default: `Close Setting-Menu`, ja: `設定メニューを閉じる` }
            },
            Help: true,
            Icon: `<span class="bibi-icon bibi-icon-config"></span>`
        }));
        if(Components.includes('ViewModeSection')                                           ) Config.ViewModeSection.create(          ); else delete Config.ViewModeSection;
        if(Components.includes('NewWindowButton') || Components.includes('FullscreenButton'))   Config.WindowSection.create(Components); else delete   Config.WindowSection;
        if(Components.includes('WebsiteLink')     || Components.includes('BibiWebsiteLink') )  Config.LinkageSection.create(Components); else delete  Config.LinkageSection;
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
                    }].map(Button => sML.edit(Button, {
                        Notes: true,
                        action: () => R.changeView({ Mode: Button.Mode, NoNotification: true })
                    }))
                }, /*{
                    Buttons: []
                }, */{
                    Buttons: [{
                        Name: 'full-breadth-layout-in-scroll',
                        Type: 'toggle',
                        Notes: false,
                        Labels: { default: { default: `Full Width for Each Page <small>(in Scrolling Mode)</small>`, ja: `スクロール表示で各ページを幅一杯に</small>` } },
                        Icon: `<span class="bibi-icon bibi-icon-full-breadth-layout"></span>`,
                        action: function() {
                            const IsActive = (this.UIState == 'active');
                            S.update({ 'full-breadth-layout-in-scroll': IsActive });
                            if(IsActive) O.HTML.classList.add(   'book-full-breadth');
                            else         O.HTML.classList.remove('book-full-breadth');
                            if(S.RVM == 'horizontal' || S.RVM == 'vertical') R.changeView({ Mode: S.RVM, Force: true });
                            if(S['keep-settings'] && O.Biscuits) O.Biscuits.memorize('Book', { FBL: S['full-breadth-layout-in-scroll'] });
                        }
                    }]
                }]
            });
            E.add('bibi:updated-settings', () => {
                Section.ButtonGroups[0].Buttons.forEach(Button => I.setUIState(Button, (Button.Mode == S.RVM ? 'active' : 'default')));
            });/*
            E.add('bibi:updated-settings', () => {
                const ButtonGroup = Section.ButtonGroups[1];
                ButtonGroup.style.display = S.BRL == 'reflowable' ? '' : 'none';
                ButtonGroup.Buttons.forEach(Button => I.setUIState(Button, S[Button.Name] ? 'active' : 'default'));
            });*/
            E.add('bibi:updated-settings', () => {
                const ButtonGroup = Section.ButtonGroups[Section.ButtonGroups.length - 1];
                ButtonGroup.style.display = S.BRL == 'pre-paginated' ? '' : 'none';
                ButtonGroup.Buttons.forEach(Button => I.setUIState(Button, S[Button.Name] ? 'active' : 'default'));
            });
        }};

        I.Menu.Config.WindowSection = { create: (Components) => {
            const Config = I.Menu.Config;
            const Buttons = [];
            if(Components.includes('NewWindowButton')) {
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
            if(Components.includes('FullscreenButton')) {
                Buttons.push({
                    Type: 'toggle',
                    Labels: {
                        default: { default: `Enter Fullscreen`, ja: `フルスクリーンモード` },
                        active:  { default: `Exit Fullscreen`, ja: `フルスクリーンモード解除` }
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
            if(Components.includes('WebsiteLink')) Buttons.push({
                Type: 'link',
                Labels: { default: { default: S['website-name-in-menu'].replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') } },
                Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
                href: S['website-href'],
                target: '_blank'
            });
            if(Components.includes('BibiWebsiteLink')) Buttons.push({
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
    E.add(Panel, 'bibi:tapped', () => E.dispatch('bibi:commands:toggle-panel'));
    Panel.BookInfo            = Panel.appendChild(               sML.create('div', { id: 'bibi-panel-bookinfo'            }));
    Panel.BookInfo.Cover      = Panel.BookInfo.appendChild(      sML.create('div', { id: 'bibi-panel-bookinfo-cover'      }));
    Panel.BookInfo.Cover.Info = Panel.BookInfo.Cover.appendChild(sML.create('p',   { id: 'bibi-panel-bookinfo-cover-info' }));
    const Opener = Panel.Opener = I.Menu.L.addButtonGroup({ Sticky: true }).addButton({
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
    E.add('bibi:started',      () =>    sML.style(Opener, { display: 'block' }));
    if(S['on-doubletap'] == 'panel') E.add('bibi:doubletapped',   () => Panel.toggle());
    if(S['on-tripletap'] == 'panel') E.add('bibi:tripletapped',   () => Panel.toggle());
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

I.FontSizeChanger = { create: () => {
    const FontSizeChanger = I.FontSizeChanger = {};
    if(typeof S['font-size-scale-per-step'] != 'number' || S['font-size-scale-per-step'] <= 1) S['font-size-scale-per-step'] = 1.25;
    if(S['use-font-size-changer'] && S['keep-settings'] && O.Biscuits) {
        const BibiBiscuits = O.Biscuits.remember('Bibi');
        if(BibiBiscuits && BibiBiscuits.FontSize && BibiBiscuits.FontSize.Step != undefined) FontSizeChanger.Step = BibiBiscuits.FontSize.Step * 1;
    }
    if(typeof FontSizeChanger.Step != 'number' || FontSizeChanger.Step < -2 || 2 < FontSizeChanger.Step) FontSizeChanger.Step = 0;
    E.bind('bibi:postprocessed-item', Item => { if(Item['rendition:layout'] == 'pre-paginated') return false;
        Item.changeFontSize = (FontSize) => {
            if(Item.FontSizeStyleRule) sML.deleteCSSRule(Item.contentDocument, Item.FontSizeStyleRule);
            Item.FontSizeStyleRule = sML.appendCSSRule(Item.contentDocument, 'html', 'font-size: ' + FontSize + 'px !important;');
        };
        Item.changeFontSizeStep = (Step) => Item.changeFontSize(Item.FontSize.Base * Math.pow(S['font-size-scale-per-step'], Step));
        Item.FontSize = {
            Default: getComputedStyle(Item.HTML).fontSize.replace(/[^\d]*$/, '') * 1
        };
        Item.FontSize.Base = Item.FontSize.Default;
        if(Item.Source.Preprocessed && (sML.UA.Chrome || sML.UA.Trident)) {
            sML.forEach(Item.HTML.querySelectorAll('body, body *'))(Ele => Ele.style.fontSize = parseInt(getComputedStyle(Ele).fontSize) / Item.FontSize.Base + 'rem');
        } else {
            O.editCSSRules(Item.contentDocument, CSSRule => {
                if(!CSSRule || !CSSRule.selectorText || /^@/.test(CSSRule.selectorText)) return;
                try { if(Item.contentDocument.querySelector(CSSRule.selectorText) == Item.HTML) return; } catch(_) {}
                const REs = {
                    'pt': / font-size: (\d[\d\.]*)pt; /,
                    'px': / font-size: (\d[\d\.]*)px; /
                };
                if(REs['pt'].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs['pt'])[1] * (96/72) / Item.FontSize.Base + 'rem';
                if(REs['px'].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs['px'])[1]           / Item.FontSize.Base + 'rem';
            });
        }
        if(typeof S['base-font-size'] == 'number' && S['base-font-size'] > 0) {
            let MostPopularFontSize = 0;
            const FontSizeCounter = {};
            sML.forEach(Item.Body.querySelectorAll('p, p *'))(Ele => {
                if(!Ele.innerText.replace(/\s/g, '')) return;
                const FontSize = Math.round(getComputedStyle(Ele).fontSize.replace(/[^\d]*$/, '') * 100) / 100;
                if(!FontSizeCounter[FontSize]) FontSizeCounter[FontSize] = [];
                FontSizeCounter[FontSize].push(Ele);
            });
            let MostPopularFontSizeAmount = 0;
            for(const FontSize in FontSizeCounter) {
                if(FontSizeCounter[FontSize].length > MostPopularFontSizeAmount) {
                    MostPopularFontSizeAmount = FontSizeCounter[FontSize].length;
                    MostPopularFontSize = FontSize;
                }
            }
            if(MostPopularFontSize) Item.FontSize.Base = Item.FontSize.Base * (S['base-font-size'] / MostPopularFontSize);
            Item.changeFontSizeStep(FontSizeChanger.Step);
        } else if(FontSizeChanger.Step != 0) {
            Item.changeFontSizeStep(FontSizeChanger.Step);
        }
    });
    FontSizeChanger.changeFontSizeStep = (Step, Actions) => {
        if(S.BRL == 'pre-paginated') return;
        if(Step == FontSizeChanger.Step) return;
        if(!Actions) Actions = {};
        E.dispatch('bibi:changes-font-size');
        if(typeof Actions.before == 'function') Actions.before();
        FontSizeChanger.Step = Step;
        if(S['use-font-size-changer'] && S['keep-settings'] && O.Biscuits) {
            O.Biscuits.memorize('Book', { FontSize: { Step: Step } });
        }
        setTimeout(() => {
            R.layOutBook({
                before: () => R.Items.forEach(Item => { if(Item.changeFontSizeStep) Item.changeFontSizeStep(Step); }),
                Reset: true,
                DoNotCloseUtilities: true,
                NoNotification: true
            }).then(() => {
                E.dispatch('bibi:changed-font-size', { Step: Step });
                if(typeof Actions.after == 'function') Actions.after();
            });
        }, 88);
    };
    //E.add('bibi:changes-font-size', () => E.dispatch('bibi:closes-utilities'));
  //E.add('bibi:changes-view', () => FontSizeChanger.changeFontSizeStep(0)); // unnecessary
    if(S['use-font-size-changer']) {
        const changeFontSizeStep = function() {
            const Button = this;
            FontSizeChanger.changeFontSizeStep(Button.Step, {
                before: () => Button.ButtonGroup.Busy = true,
                after:  () => Button.ButtonGroup.Busy = false
            });
        };
        I.createSubpanel({
            Opener: I.Menu.R.addButtonGroup({ Sticky: true, id: 'bibi-buttongroup_font-size' }).addButton({
                Type: 'toggle',
                Labels: {
                    default: { default: `Change Font Size`,     ja: `文字サイズを変更` },
                    active:  { default: `Close Font Size Menu`, ja: `文字サイズメニューを閉じる` }
                },
                //className: 'bibi-button-font-size bibi-button-font-size-change',
                Icon: `<span class="bibi-icon bibi-icon-change-fontsize"></span>`,
                Help: true
            }),
            id: 'bibi-subpanel_font-size',
            open: () => {}
        }).addSection({
            Labels: { default: { default: `Choose Font Size`, ja: `文字サイズを選択` } }
        }).addButtonGroup({
            //Tiled: true,
            ButtonType: 'radio',
            Buttons: [{
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Ex-Large`,                        ja: `<span class="non-visual-in-label">文字サイズ：</span>最大` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exlarge"></span>`,
                action: changeFontSizeStep, Step:  2
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Large`,                           ja: `<span class="non-visual-in-label">文字サイズ：</span>大` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-large"></span>`,
                action: changeFontSizeStep, Step:  1
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>`, ja: `<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-medium"></span>`,
                action: changeFontSizeStep, Step:  0
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Small`,                           ja: `<span class="non-visual-in-label">文字サイズ：</span>小` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-small"></span>`,
                action: changeFontSizeStep, Step: -1
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Ex-Small`,                        ja: `<span class="non-visual-in-label">文字サイズ：</span>最小` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exsmall"></span>`,
                action: changeFontSizeStep, Step: -2
            }]
        }).Buttons.forEach(Button => { if(Button.Step == FontSizeChanger.Step) I.setUIState(Button, 'active'); });
    }
    E.dispatch('bibi:created-font-size-changer');
}};


I.Loupe = { create: () => {
    if(S['loupe-max-scale']      <= 1) S['loupe-max-scale']      = 4.0;
    if(S['loupe-scale-per-step'] <= 1) S['loupe-scale-per-step'] = 1.6;
    if(S['loupe-scale-per-step'] > S['loupe-max-scale']) S['loupe-scale-per-step'] = S['loupe-max-scale'];
    const Loupe = I.Loupe = {
        CurrentTransformation: { Scale: 1, TranslateX: 0, TranslateY: 0 },
        defineZoomOutPropertiesForUtilities: () => {
            const BookMargin = {
                   Top: S['use-menubar'] && S['use-full-height'] ? I.Menu.Height : 0,
                 Right: S.ARA == 'vertical'   ? I.Slider.Size : 0,
                Bottom: S.ARA == 'horizontal' ? I.Slider.Size : 0,
                  Left: 0
            };
            const Tfm = {};
            if(S.ARA == 'horizontal') {
                Tfm.Scale = (R.Main.offsetHeight - (BookMargin.Top + BookMargin.Bottom)) / (R.Main.offsetHeight - (S.ARA == S.SLA && (S.RVM != 'paged' || I.Slider.ownerDocument) ? O.Scrollbars.Height : 0));
                Tfm.TranslateX = 0;
            } else {
                Tfm.Scale = Math.min(
                    (R.Main.offsetWidth  - BookMargin.Right) / (R.Main.offsetWidth - O.Scrollbars.Width),
                    (R.Main.offsetHeight - BookMargin.Top  ) /  R.Main.offsetHeight
                );
                Tfm.TranslateX = R.Main.offsetWidth * (1 - Tfm.Scale) / -2;
                //OP.Left = Tfm.TranslateX * -1;
            }
            Tfm.TranslateY = BookMargin.Top - (R.Main.offsetHeight) * (1 - Tfm.Scale) / 2;
            const St = (O.Body['offset' + C.A_SIZE_L] / Tfm.Scale - R.Main['offset' + C.A_SIZE_L]);
            const OP = {};
            OP[C.A_BASE_B] = St / 2 + (!S['use-full-height'] && S.ARA == 'vertical' ? I.Menu.Height : 0);
            OP[C.A_BASE_A] = St / 2;
            const IP = {};
            if(S.ARA == S.SLA) IP[S.ARA == 'horizontal' ? 'Right' : 'Bottom'] = St / 2;
            Loupe.ZoomOutPropertiesForUtilities = {
                Transformation: Tfm,
                Stretch: St,
                OuterPadding: OP,
                InnerPadding: IP
            };
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
            const CTfm = Loupe.CurrentTransformation;
            //if(Tfm.Scale == CTfm.Scale && Tfm.TranslateX == CTfm.TranslateX && Tfm.TranslateY == CTfm.TranslateY) return resolve();
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
                else                                      O.HTML.classList.add(   'zoomed-in'), O.HTML.classList.remove('zoomed-out');
                O.HTML.classList.remove('transforming');
                Loupe.Transforming = false;
                resolve();
                E.dispatch('bibi:transformed-book', {
                    Transformation: Tfm,
                    ActualTransformation: ATfm,
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
            if(!Loupe.isAvailable()) return Promise.resolve();
            let cb = () => {};
            if(IO) {
                if(Loupe.IsZoomedOutForUtilities) return Promise.resolve();
                Loupe.IsZoomedOutForUtilities = true;
                const OP4U = Loupe.ZoomOutPropertiesForUtilities.OuterPadding, IP4U = Loupe.ZoomOutPropertiesForUtilities.InnerPadding;
                for(const Dir in OP4U) R.Main.style[     'padding' + Dir] = OP4U[Dir] + 'px';
                for(const Dir in IP4U) R.Main.Book.style['padding' + Dir] = IP4U[Dir] + 'px';
                Loupe.BookStretchingEach = Loupe.ZoomOutPropertiesForUtilities.Stretch / 2;
            } else {
                if(!Loupe.IsZoomedOutForUtilities) return Promise.resolve();
                Loupe.IsZoomedOutForUtilities = false;
                cb = () => {
                    R.Main.style.padding = R.Main.Book.style.padding = '';
                    Loupe.BookStretchingEach = 0;
                };
            }
            return Loupe.transform(null, { Temporary: true }).then(cb).then(() => I.Slider.ownerDocument ? I.Slider.progress() : undefined);
        },
        isAvailable: () => {
            if(!L.Opened) return false;
            if(Loupe.UIState != 'active') return false;
            //if(S.BRL == 'reflowable') return false;
            return true;
        },
        checkAndGetBibiEventForTaps: (Eve) => {
            if(!Eve || !Loupe.isAvailable()) return null;
            const BibiEvent = O.getBibiEvent(Eve);
            if(BibiEvent.Target.tagName) {
                if(/bibi-menu|bibi-slider/.test(BibiEvent.Target.id)) return null;
                if(O.isPointableContent(BibiEvent.Target)) return null;
                if(S.RVM == 'horizontal' && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return null;
            }
            return BibiEvent;
        },
        onTap: (Eve, HowManyTaps) => {
            if(HowManyTaps == 1 && (!I.KeyObserver.ActiveKeys || !I.KeyObserver.ActiveKeys['Space'])) return Promise.resolve(); // Requires pressing space-key on single-tap.
            const BibiEvent = Loupe.checkAndGetBibiEventForTaps(Eve);
            if(!BibiEvent) return Promise.resolve();
            //if(HowManyTaps > 1 && (BibiEvent.Division.X != 'center' || BibiEvent.Division.Y != 'middle')) return Promise.resolve();
            Eve.preventDefault();
            try { Eve.target.ownerDocument.body.Item.contentWindow.getSelection().empty(); } catch(Err) {}
            if(Loupe.CurrentTransformation.Scale >= S['loupe-max-scale'] && !Eve.shiftKey) return Loupe.scale(1);
            return Loupe.scale(Loupe.CurrentTransformation.Scale * (Eve.shiftKey ? 1 / S['loupe-scale-per-step'] : S['loupe-scale-per-step']), { Center: BibiEvent.Coord });
        },
        onPointerDown: (Eve) => {
            Loupe.PointerDownCoord = O.getBibiEvent(Eve).Coord;
            Loupe.PointerDownTransformation = {
                Scale: Loupe.CurrentTransformation.Scale,
                TranslateX: Loupe.CurrentTransformation.TranslateX,
                TranslateY: Loupe.CurrentTransformation.TranslateY
            };
        },
        onPointerUp: (Eve) => {
            O.HTML.classList.remove('dragging');
            Loupe.Dragging = false;
            delete Loupe.PointerDownCoord;
            delete Loupe.PointerDownTransformation;
        },
        onPointerMove: (Eve) => {
            if(I.PinchObserver.Hot) return false;
            if(!Loupe.isAvailable()) return false;
            if(Loupe.CurrentTransformation.Scale == 1 || !Loupe.PointerDownCoord) return false;
            Eve.preventDefault();
            Loupe.Dragging = true;
            O.HTML.classList.add('dragging');
            const BibiEvent = O.getBibiEvent(Eve);
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
    E.add('bibi:tapped',                                         Eve => Loupe.onTap(Eve, 1));
    if(S['on-doubletap'] == 'zoom') E.add('bibi:doubletapped',   Eve => Loupe.onTap(Eve, 2));
    if(S['on-tripletap'] == 'zoom') E.add('bibi:tripletapped',   Eve => Loupe.onTap(Eve, 3));
    E.add('bibi:downed-pointer', Eve => Loupe.onPointerDown(Eve));
    E.add('bibi:upped-pointer',  Eve => Loupe.onPointerUp(Eve));
    E.add('bibi:moved-pointer',  Eve => Loupe.onPointerMove(Eve));
    if(S['zoom-out-for-utilities']) {
        E.add('bibi:opens-utilities',  () => Loupe.transformForUtilities(true ));
        E.add('bibi:closes-utilities', () => Loupe.transformForUtilities(false));
    }
    E.add('bibi:opened', () => Loupe.open());
    E.add('bibi:laid-out', () => Loupe.defineZoomOutPropertiesForUtilities());
    E.add('bibi:changed-view',  () => Loupe.transformToDefault());
    if(S['use-loupe']) {
        const ButtonGroup = I.Menu.R.addButtonGroup({
            Sticky: true,
            Tiled: true,
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
    }
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
        E.add(['bibi:is-scrolling', 'bibi:scrolled', 'bibi:opened-slider'], () => Nombre.progress());
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
    add: (Opt = {}) => {
        if(!Opt.UI) Opt.UI = Bibi;
        const    LastPage = R.hatchPage(I.History.List.slice(-1)[0]),
              CurrentPage = Opt.Destination ? R.hatchPage(Opt.Destination) : (() => { I.PageObserver.updateCurrent(); return I.PageObserver.Current.List[0].Page; })();
        if(CurrentPage != LastPage) {
            if(Opt.SumUp && I.History.List.slice(-1)[0].UI == Opt.UI) I.History.List.pop();
            I.History.List.push({ UI: Opt.UI, IIPP: I.PageObserver.getIIPP({ Page: CurrentPage }) });
            if(I.History.List.length - 1 > S['max-history']) { // Not count the first (oldest).
                const First = I.History.List.shift(); // The first (oldest) is the landing point.
                I.History.List.shift(); // Remove the second
                I.History.List.unshift(First); // Restore the first (oldest).
            }
        }
        I.History.update();
    },
    back: () => {
        if(I.History.List.length <= 1) return Promise.reject();
        const CurrentPage = R.hatchPage(I.History.List.pop()),
                 LastPage = R.hatchPage(I.History.List.slice(-1)[0]);
        I.History.update();
        return R.focusOn({ Destination: LastPage, Duration: 0 });
    }
};


I.Slider = { create: () => {
    if(!S['use-slider']) return false;
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
            if(S['use-history']) {
                Slider.classList.add('bibi-slider-with-history');
                Slider.History        = Slider.appendChild(sML.create('div', { id: 'bibi-slider-history' }));
                Slider.History.add    = (Destination) => I.History.add({ UI: Slider, SumUp: false, Destination: Destination })
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
                E.add(Slider.Edgebar, ['mouseover', 'mousemove'], Eve => { if(!Slider.Touching) I.Nombre.progress({ List: [{ Page: Slider.getPointedPage(O.getBibiEventCoord(Eve)[C.A_AXIS_L]) }] }); });
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
        onTouchStart: (Eve) => {
            I.ScrollObserver.forceStopScrolling();
            Eve.preventDefault();
            Slider.Touching = true;
            Slider.StartedAt = {
                ThumbBefore: O.getElementCoord(Slider.Thumb)[C.A_AXIS_L],
                RailProgressLength: Slider.RailProgress['offset' + C.A_SIZE_L],
                MainScrollBefore: Math.ceil(R.Main['scroll' + C.L_OOBL_L]) // Android Chrome returns scrollLeft/Top value of an element with slightly less float than actual.
            };
            Slider.StartedAt.Coord = Eve.target == Slider.Thumb ? O.getBibiEventCoord(Eve)[C.A_AXIS_L] : Slider.StartedAt.ThumbBefore + Slider.Thumb.Length / 2; // ← ? <Move Thumb naturally> : <Bring Thumb's center to the touched coord at the next pointer moving>
            clearTimeout(Slider.Timer_onTouchEnd);
            O.HTML.classList.add('slider-sliding');
            E.add('bibi:moved-pointer', Slider.onTouchMove);
        },
        onTouchMove: (Eve) => {
            clearTimeout(Slider.Timer_move);
            const TouchMoveCoord = O.getBibiEventCoord(Eve)[C.A_AXIS_L];
            if(Slider.Touching) {
                const Translation = sML.limitMinMax(TouchMoveCoord - Slider.StartedAt.Coord,
                    Slider.Edgebar.Before -  Slider.StartedAt.ThumbBefore,
                    Slider.Edgebar.After  - (Slider.StartedAt.ThumbBefore + Slider.Thumb.Length)
                );
                sML.style(Slider.Thumb,        { transform: 'translate' + C.A_AXIS_L + '(' + Translation + 'px)' });
                sML.style(Slider.RailProgress, { [C.A_SIZE_l]: (Slider.StartedAt.RailProgressLength + Translation * (S.ARD == 'rtl' ? -1 : 1)) + 'px' });
            }
            Slider.flipPagesDuringSliding(TouchMoveCoord);
        },
        flipPagesDuringSliding: (_) => (Slider.flipPagesDuringSliding = !S['flip-pages-during-sliding'] ? // switch and define at the first call.
            () => false :
            (TouchMoveCoord) => {
                R.DoNotTurn = true; Slider.flip(TouchMoveCoord);
                Slider.Timer_move = setTimeout(() => { R.DoNotTurn = false; Slider.flip(TouchMoveCoord, 'FORCE'); }, 333);
            }
        )(_),
        onTouchEnd: (Eve) => {
            if(!Slider.Touching) return;
            clearTimeout(Slider.Timer_move);
            Slider.Touching = false;
            E.remove('bibi:moved-pointer', Slider.onTouchMove);
            const TouchEndCoord = O.getBibiEventCoord(Eve)[C.A_AXIS_L];
            if(TouchEndCoord == Slider.StartedAt.Coord) Slider.StartedAt.Coord = Slider.StartedAt.ThumbBefore + Slider.Thumb.Length / 2;
            R.DoNotTurn = false;
            Slider.flip(TouchEndCoord, 'FORCE').then(() => {
                sML.style(Slider.Thumb,        { transform: '' });
                sML.style(Slider.RailProgress, { [C.A_SIZE_l]: '' });
                Slider.progress();
                if(Slider.History) Slider.History.add();
            });
            delete Slider.StartedAt;
            Slider.Timer_onTouchEnd = setTimeout(() => O.HTML.classList.remove('slider-sliding'), 123);
        },
        flip: (TouchedCoord, Force) => new Promise(resolve => { switch(S.RVM) {
            case 'paged':
                const TargetPage = Slider.getPointedPage(TouchedCoord);
                return I.PageObserver.Current.Pages.includes(TargetPage) ? resolve() : R.focusOn({ Destination: TargetPage, Duration: 0 }).then(() => resolve());
            default:
                R.Main['scroll' + C.L_OOBL_L] = Slider.StartedAt.MainScrollBefore + (TouchedCoord - Slider.StartedAt.Coord) * (Slider.MainLength / Slider.Edgebar.Length);
                return resolve();
        } }).then(() => {
            if(Force) I.PageObserver.turnItems();
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
        Slider.Edgebar.addEventListener(E['pointerdown'], Slider.onTouchStart);
        Slider.Thumb.addEventListener(E['pointerdown'], Slider.onTouchStart);
        O.HTML.addEventListener(E['pointerup'], Slider.onTouchEnd);
        if(Slider.History) Slider.History.Button.addEventListener(E['pointerup'], Slider.onTouchEnd);
        E.add(['bibi:is-scrolling', 'bibi:scrolled'], Slider.progress);
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


I.BookmarkManager = { create: () => { if(!S['use-bookmarks'] || !O.Biscuits) return;
    const BookmarkManager = I.BookmarkManager = {
        Bookmarks: [],
        initialize: () => {
            BookmarkManager.Subpanel = I.createSubpanel({
                Opener: I.Menu.L.addButtonGroup({ Sticky: true, id: 'bibi-buttongroup_bookmarks' }).addButton({
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
                updateBookmarks: () => BookmarkManager.update(),
                onopened: () => { E.add(   'bibi:scrolled', BookmarkManager.Subpanel.updateBookmarks); BookmarkManager.Subpanel.updateBookmarks (); },
                onclosed: () => { E.remove('bibi:scrolled', BookmarkManager.Subpanel.updateBookmarks); }
            });
            BookmarkManager.ButtonGroup = BookmarkManager.Subpanel.addSection({
                id: 'bibi-subpanel-section_bookmarks',
                Labels: { default: { default: `Bookmarks`, ja: `しおり` } }
            }).addButtonGroup();
            const BookmarkBiscuits = O.Biscuits.remember('Book', 'Bookmarks');
            if(Array.isArray(BookmarkBiscuits) && BookmarkBiscuits.length) BookmarkManager.Bookmarks = BookmarkBiscuits;
            //E.add(['bibi:opened', 'bibi:resized'], () => BookmarkManager.update());
            delete BookmarkManager.initialize;
        },
        exists: (Bookmark) => {
            for(let l = BookmarkManager.Bookmarks.length, i = 0; i < l; i++) if(BookmarkManager.Bookmarks[i].IIPP == Bookmark.IIPP) return BookmarkManager.Bookmarks[i];
            return null;
        },
        add: (Bookmark) => {
            if(BookmarkManager.exists(Bookmark)) return BookmarkManager.update();
            Bookmark.IsHot = true;
            BookmarkManager.Bookmarks.push(Bookmark);
            BookmarkManager.update({ Added: Bookmark });
        },
        remove: (Bookmark) => {
            BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => Bmk.IIPP != Bookmark.IIPP);
            BookmarkManager.update({ Removed: Bookmark });
        },
        update: (Opt = {}) => {
            BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = '';
            if(BookmarkManager.ButtonGroup.Buttons) {
                BookmarkManager.ButtonGroup.Buttons = [];
                BookmarkManager.ButtonGroup.innerHTML = '';
            }
            //BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => typeof Bmk.IIPP == 'number' && typeof Bmk['%'] == 'number');
            let Bookmarks = [], ExistingBookmarks = [];
            if(Array.isArray(Opt.Bookmarks)) BookmarkManager.Bookmarks = Opt.Bookmarks;
            if(Opt.Added) Bookmarks = [Opt.Added];
            else if(L.Opened) {
                I.PageObserver.updateCurrent();
                Bookmarks = I.PageObserver.Current.Pages.map(Page => ({
                    IIPP: I.PageObserver.getIIPP({ Page: Page }),
                    '%': Math.floor((Page.Index + 1) / R.Pages.length * 100) // only for showing percentage in waiting status
                }));
            }
            if(BookmarkManager.Bookmarks.length) {
                const UpdatedBookmarks = []
                for(let l = BookmarkManager.Bookmarks.length, i = 0; i < l; i++) {
                    let Bmk = BookmarkManager.Bookmarks[i];
                         if(typeof Bmk == 'number') Bmk = { IIPP: Bmk };
                    else if(!Bmk) continue;
                    else if(typeof Bmk.IIPP != 'number') {
                        if(Bmk.ItemIndex) Bmk.IIPP = Bmk.ItemIndex + (Bmk.PageProgressInItem ? Bmk.PageProgressInItem : 0);
                        else if(B.Package.Metadata['rendition:layout'] == 'pre-paginated') {
                            if(typeof Bmk.PageNumber == 'number') Bmk.PageIndex = Bmk.PageNumber - 1;
                            if(typeof Bmk.PageIndex  == 'number') Bmk.IIPP      = Bmk.PageIndex;
                        }
                    }
                    if(typeof Bmk.IIPP != 'number') continue;
                    if(/^(\d*\.)?\d+?$/.test(Bmk['%'])) Bmk['%'] *= 1; else delete Bmk['%'];
                    let Label = '', ClassName = '';
                    const BB = 'bibi-bookmark';
                    const Page = R.hatchPage(Bmk);
                    let PageNumber = 0;
                         if(Page && typeof Page.Index == 'number')                     PageNumber = Page.Index + 1;
                    else if(B.Package.Metadata['rendition:layout'] == 'pre-paginated') PageNumber = Math.floor(Bmk.IIPP) + 1;
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
                    if(Bookmarks.reduce((Exists, Bookmark) => Exists = Bmk.IIPP == Bookmark.IIPP ? true : Exists, false)) {
                        ExistingBookmarks.push(Bmk);
                        ClassName = `bibi-button-bookmark-is-current`;
                        Labels.default.default += ` <span class="${BB}-is-current"></span>`;
                        Labels.default.ja      += ` <span class="${BB}-is-current ${BB}-is-current-ja"></span>`;
                    }
                    const Button = BookmarkManager.ButtonGroup.addButton({
                        className: ClassName,
                        Type: 'normal',
                        Labels: Labels,
                        Icon: `<span class="bibi-icon bibi-icon-bookmark bibi-icon-a-bookmark"></span>`,
                        Bookmark: Bmk,
                        action: () => {
                            if(L.Opened) return R.focusOn({ Destination: Bmk }).then(Destination => I.History.add({ UI: BookmarkManager, SumUp: false/*true*/, Destination: Destination }));
                            if(!L.Waiting) return false;
                            if(S['start-in-new-window']) return L.openNewWindow(location.href + (location.hash ? '&' : '#') + 'jo(iipp=' + Bmk.IIPP + ')');
                            R.StartOn = { IIPP: Bmk.IIPP };
                            L.play();
                        },
                        remove: () => BookmarkManager.remove(Bmk)
                    });
                    const Remover = Button.appendChild(sML.create('span', { className: 'bibi-remove-bookmark', title: 'しおりを削除' }));
                    I.setFeedback(Remover, { StopPropagation: true });
                    E.add(Remover, 'bibi:tapped', () => Button.remove());
                    Remover.addEventListener(E['pointer-over'], Eve => Eve.stopPropagation());
                    if(Bmk.IsHot) {
                        delete Bmk.IsHot;
                        I.setUIState(Button, 'active'); setTimeout(() => I.setUIState(Button, ExistingBookmarks.includes(Bmk) ? 'disabled' : 'default'), 234);
                    }
                    else if(ExistingBookmarks.includes(Bmk)) I.setUIState(Button, 'disabled');
                    else                                     I.setUIState(Button,  'default');
                    const UpdatedBookmark = { IIPP: Bmk.IIPP };
                    if(Bmk['%']) UpdatedBookmark['%'] = Bmk['%'];
                    UpdatedBookmarks.push(UpdatedBookmark);
                }
                BookmarkManager.Bookmarks = UpdatedBookmarks;
            } else {
                if(!L.Opened) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
            }
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
            O.Biscuits.memorize('Book', { Bookmarks: BookmarkManager.Bookmarks });
            /**/            E.dispatch('bibi:updated-bookmarks', BookmarkManager.Bookmarks);
            if(Opt.Added)   E.dispatch(  'bibi:added-bookmark',  BookmarkManager.Bookmarks);
            if(Opt.Removed) E.dispatch('bibi:removed-bookmark',  BookmarkManager.Bookmarks);
        },
    };
    BookmarkManager.initialize();
    E.dispatch('bibi:created-bookmark-manager');
}};


I.Flipper = { create: () => {
    const Flipper = I.Flipper = {
        PreviousDistance: 0,
        Back: { Distance: -1 }, Forward: { Distance: 1 },
        getDirection: (Division) => { switch(S.ARA) {
            case 'horizontal': return Division.X != 'center' ? Division.X : Division.Y;
            case 'vertical'  : return Division.Y != 'middle' ? Division.Y : Division.X; } },
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
            const SumUpHistory = (I.History.List.slice(-1)[0].UI == Flipper) && ((Distance < 0 ? -1 : 1) === (Flipper.PreviousDistance < 0 ? -1 : 1));
            Flipper.PreviousDistance = Distance;
            if(S['book-rendition-layout'] == 'pre-paginated') { // Preventing flicker.
                const CIs = [
                    I.PageObserver.Current.List[          0].Page.Index,
                    I.PageObserver.Current.List.slice(-1)[0].Page.Index
                ], TI = CIs[Distance < 0 ? 0 : 1] + Distance;
                CIs.forEach(CI => { try { R.Pages[CI].Spread.Box.classList.remove('current'); } catch(Err) {} });
                                    try { R.Pages[TI].Spread.Box.classList.add(   'current'); } catch(Err) {}
            }
            return R.moveBy({ Distance: Distance, Duration: Opt.Duration }).then(Destination => I.History.add({ UI: Flipper, SumUp: SumUpHistory, Destination: Destination }));
        }
    };
    Flipper[-1] = Flipper.Back, Flipper[1] = Flipper.Forward;
}};


I.Arrows = { create: () => { if(!S['use-arrows']) return I.Arrows = null;
    const Arrows = I.Arrows = {
        navigate: () => setTimeout(() => {
            [Arrows.Back, Arrows.Forward].forEach(Arrow => I.Flipper.isAbleToFlip(Arrow.Distance) ? Arrow.classList.add('glowing') : false);
            setTimeout(() => [Arrows.Back, Arrows.Forward].forEach(Arrow => Arrow.classList.remove('glowing')), 1234);
        }, 400),
        toggleState: () => [Arrows.Back, Arrows.Forward].forEach(Arrow => {
            const Availability = I.Flipper.isAbleToFlip(Arrow.Distance);
            Arrow.classList.toggle(  'available',  Availability);
            Arrow.classList.toggle('unavailable', !Availability);
        }),
        areAvailable: (BibiEvent) => {
            if(!L.Opened) return false;
            if(I.OpenedSubpanel) return false;
            if(I.Panel && I.Panel.UIState == 'active') return false;
            //if(BibiEvent.Coord.Y < I.Menu.Height/* * 1.5*/) return false;
            const Buf = 3;
                 if(BibiEvent.Coord.X <= Buf || BibiEvent.Coord.Y <= Buf) return false;
            else if(S.ARA == 'horizontal') { if(BibiEvent.Coord.X >= window.innerWidth  - Buf || BibiEvent.Coord.Y >= window.innerHeight - O.Scrollbars.Height - Buf) return false; }
            else if(S.ARA == 'vertical'  ) { if(BibiEvent.Coord.Y >= window.innerHeight - Buf || BibiEvent.Coord.X >= window.innerWidth  - O.Scrollbars.Width  - Buf) return false; }
            if(BibiEvent.Target.ownerDocument.documentElement == O.HTML) {
                if(BibiEvent.Target == O.HTML || BibiEvent.Target == O.Body || BibiEvent.Target == I.Menu) return true;
                if(/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(BibiEvent.Target.id)) return true;
                if(/^(spread|item|page)( |-|$)/.test(BibiEvent.Target.className)) return true;
            } else {
                return O.isPointableContent(BibiEvent.Target) ? false : true;
            }
            return false;
        }
    };
    O.HTML.classList.add('arrows-active');
    Arrows.Back    = O.Body.appendChild(sML.create('div', { className: 'bibi-arrow', id: 'bibi-arrow-back',    Labels: { default: { default: `Back`,    ja: `戻る` } }, Distance: -1 }));
    Arrows.Forward = O.Body.appendChild(sML.create('div', { className: 'bibi-arrow', id: 'bibi-arrow-forward', Labels: { default: { default: `Forward`, ja: `進む` } }, Distance:  1 }));
    Arrows[-1] = Arrows.Forward.Pair = I.Flipper.Back.Arrow    = Arrows.Back;
    Arrows[ 1] = Arrows.Back.Pair    = I.Flipper.Forward.Arrow = Arrows.Forward;
    [Arrows.Back, Arrows.Forward].forEach(Arrow => {
        I.setFeedback(Arrow);
        const FunctionsToBeCanceled = [Arrow.showHelp, Arrow.hideHelp, Arrow.BibiTapObserver.onTap, Arrow.BibiTapObserver.onDoubleTap];
        if(!O.TouchOS) FunctionsToBeCanceled.push(Arrow.BibiHoverObserver.onHover, Arrow.BibiHoverObserver.onUnHover);
        FunctionsToBeCanceled.forEach(f2BC => f2BC = () => {});
    });
    E.add('bibi:commands:move-by', Distance => { // indicate direction
        if(!L.Opened || typeof (Distance *= 1) != 'number' || !isFinite(Distance) || !(Distance = Math.round(Distance))) return false;
        return E.dispatch(Distance < 0 ? Arrows.Back : Arrows.Forward, 'bibi:tapped', null);
    });
    E.add('bibi:loaded-item', Item => {/*
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="left"]',   'cursor: w-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="right"]',  'cursor: e-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="top"]',    'cursor: n-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="bottom"]', 'cursor: s-resize;');*/
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor]', 'cursor: pointer;');
    });
    E.add('bibi:opened',       () => setTimeout(() => { Arrows.toggleState(); Arrows.navigate(); }, 123));
    E.add('bibi:scrolled',     () => Arrows.toggleState());
    E.add('bibi:changed-view', () => Arrows.navigate());
    E.dispatch('bibi:created-arrows');
     // Optimize to Scrollbar Size
    (_ => {
        _('html.appearance-horizontal.book-full-height:not(.slider-opened)',       'height', O.Scrollbars.Width);
        _('html.appearance-horizontal:not(.book-full-height):not(.slider-opened)', 'height', O.Scrollbars.Width + I.Menu.Height);
        _('html.appearance-vertical:not(.slider-opened)',                          'width',  O.Scrollbars.Width);
    })((Context, WidthOrHeight, Margin) => sML.appendCSSRule(
        `${ Context } div#bibi-arrow-back, ${ Context } div#bibi-arrow-forward`,
        `${ WidthOrHeight }: calc(100% - ${ Margin }px); ${ WidthOrHeight }: calc(100v${ WidthOrHeight.charAt(0) } - ${ Margin }px);`
    ));
}};


I.AxisSwitcher = { create: () => { if(S['fix-reader-view-mode']) return I.AxisSwitcher = null;
    const AxisSwitcher = I.AxisSwitcher = {
        switchAxis: () => new Promise(resolve => {
            if(S.RVM == 'paged') return resolve();
            const ViewMode = S.RVM == 'horizontal' ? 'vertical' : 'horizontal';
            I.Menu.Config.ViewModeSection.ButtonGroups[0].Buttons.filter(Button => Button.Mode == ViewMode)[0].BibiTapObserver.onTap();
            resolve();
        })
    };
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
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id)        delete Par.id;
    const ClassNames = ['bibi-buttongroup'];
    if(Par.Tiled) ClassNames.push('bibi-buttongroup-tiled');
    if(Par.Sticky) ClassNames.push('sticky');
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    const ButtonsToAdd = Array.isArray(Par.Buttons) ? Par.Buttons : Par.Button ? [Par.Button] : [];
    delete Par.Buttons;
    delete Par.Button;
    const ButtonGroup = sML.create('ul', Par);
    ButtonGroup.Buttons = [];
    ButtonGroup.addButton = function(Par) {
        const Button = I.createButton(Par);
        if(!Button) return null;
        Button.ButtonGroup = this;
        Button.ButtonBox = Button.ButtonGroup.appendChild(sML.create('li', { className: 'bibi-buttonbox bibi-buttonbox-' + Button.Type }));
        if(!O.TouchOS) {
            I.TouchObserver.observeElementHover(Button.ButtonBox)
            I.TouchObserver.setElementHoverActions(Button.ButtonBox);
        }
        Button.ButtonBox.appendChild(Button)
        Button.ButtonGroup.Buttons.push(Button);
        return Button;
    };
    ButtonsToAdd.forEach(ButtonToAdd => {
        if(!ButtonToAdd.Type && Par.ButtonType) ButtonToAdd.Type = Par.ButtonType;
        ButtonGroup.addButton(ButtonToAdd);
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
    if(typeof Button.action == 'function') E.add(Button, 'bibi:tapped', () => Button.isAvailable() ? Button.action.apply(Button, arguments) : null);
    Button.Busy = false;
    return Button;
};


I.createSubpanel = (Par = {}) => {
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id       ) delete Par.id;
    const ClassNames = ['bibi-subpanel', 'bibi-subpanel-' + (Par.Position == 'left' ? 'left' : 'right')];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    const SectionsToAdd = Array.isArray(Par.Sections) ? Par.Sections : Par.Section ? [Par.Section] : [];
    delete Par.Sections;
    delete Par.Section;
    const Subpanel = O.Body.appendChild(sML.create('div', Par));
    Subpanel.Sections = [];
    Subpanel.addEventListener(E['pointerdown'], Eve => Eve.stopPropagation());
    Subpanel.addEventListener(E['pointerup'],   Eve => Eve.stopPropagation());
    I.setToggleAction(Subpanel, {
        onopened: function(Opt) {
            I.Subpanels.forEach(Sp => Sp == Subpanel ? true : Sp.close({ ForAnotherSubpanel: true }));
            I.OpenedSubpanel = this;
            this.classList.add('opened');
            O.HTML.classList.add('subpanel-opened');
            if(Subpanel.Opener) I.setUIState(Subpanel.Opener, 'active');
            if(Par.onopened) Par.onopened.apply(Subpanel, arguments);
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
        }
    });
    Subpanel.bindOpener = (Opener) => {
        E.add(Opener, 'bibi:tapped', () => Subpanel.toggle());
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
        if(Ele.Notes) Ele.note = () => {
            if(Ele.Labels[Ele.UIState]) setTimeout(() => I.note(Ele.Labels[Ele.UIState][O.Language]), 0);
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


I.orthogonal = (InputType) => S['orthogonal-' + InputType][S.RVM == 'paged' ? 0 : 1];

I.isScrollable = () => (S.ARA == S.SLA && I.Loupe.CurrentTransformation.Scale == 1) ? true : false;


I.getBookIcon = () => sML.create('div', { className: 'book-icon', innerHTML: `<span></span>` });




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


export const P = {}; // Bibi.Preset


Bibi.preset = (Preset) => Bibi.at1st.List.push(() => {
    Bibi.applyFilteredSettingsTo(P, Preset, [Bibi.SettingTypes, Bibi.SettingTypes_PresetOnly], 'Fill');
    delete P['book'];
    P.Script = document.getElementById('bibi-preset');
});


P.initialize = () => {
    const DocHRef = location.href.split('?')[0];
    P['bookshelf'] = new URL(P['bookshelf'] || '../../bibi-bookshelf', P.Script.src).href.replace(/\/$/, '');
    P['extensions'] = (() => {
        let Extensions_HTML = document.getElementById('bibi-preset').getAttribute('data-bibi-extensions');
        if(Extensions_HTML) {
            Extensions_HTML = Extensions_HTML.trim().replace(/\s+/, ' ').split(' ').map(EPath => ({ src: new URL(EPath, DocHRef).href }));
            if(Extensions_HTML.length) P['extensions'] = Extensions_HTML;
        }
        return !Array.isArray(P['extensions']) ? [] : P['extensions'].filter(Xtn => {
            if(Xtn.hasOwnProperty('-spell-of-activation-')) {
                const SoA = Xtn['-spell-of-activation-'];
                if(!SoA || !/^[a-zA-Z0-9_\-]+$/.test(SoA) || !U.hasOwnProperty(SoA)) return false;
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
        case 'paged': case 'horizontal': case 'vertical': _V = _P, _P = 'reader-view-mode'; break;
        case 'view': case 'rvm': _P = 'reader-view-mode'; break;
        case 'dppd': case 'default-ppd': _P = 'default-page-progression-direction'; break;
        case 'pagination': _P = 'pagination-method'; break;
    }
    return [_P, _V];
};


Bibi.at1st.List.unshift(() => {
    const LS = location.search; if(typeof LS != 'string') return;
    const Q = LS.replace(/^\?/, '').split('&').reduce((Q, PnV) => {
        let [_P, _V] = PnV.split('=');
        if(!_V) _V = undefined;
        switch(_P) {
            case 'log': if(!_V) _V = '1'; break;
            case 'book': if(!_V) return Q; break;
            case 'zine': case 'wait': case 'debug': if(!_V) _V = 'true'; break;
            default: [_P, _V] = U.translateData([_P, _V]);
        }
        Q[_P] = _V;
        return Q;
    }, {});
    Object.assign(U, Bibi.applyFilteredSettingsTo(Q, Q, [Bibi.SettingTypes, Bibi.SettingTypes_UserOnly]));
    if(!U['book']) delete U['zine'];
    if(U['debug']) Bibi.Debug = true, U['log'] = 9;
});


U.initialize = () => {
    const _U = Bibi.applyFilteredSettingsTo({}, U, [Bibi.SettingTypes, Bibi.SettingTypes_UserOnly]);
    const HashData = (() => {
        let Hash = location.hash;
        if(typeof Hash != 'string') return {};
        const Data = {};
        const CatGroupREStr = '([&#])([a-zA-Z_]+)\\(([^\\(\\)]+)\\)', CatGroups = Hash.match(new RegExp(CatGroupREStr, 'g'));
        if(CatGroups && CatGroups.length) CatGroups.forEach(CatGroup => {
            const CatGroupParts = CatGroup.match(new RegExp(CatGroupREStr));
            let Cat = CatGroupParts[2].toLowerCase(), Dat = CatGroupParts[3];
            if(Dat) {
                Cat = Cat == 'bibi' ? 'Bibi' : Cat == 'jo' ? 'Jo' : Cat == 'epubcfi' ? 'EPUBCFI' : undefined;
                if(Cat) Data[Cat] = Dat;
            }
            Hash = Hash.replace(CatGroup, CatGroupParts[1]);
        });
        Data['#'] = Hash.replace(/^#|&$/, '');
        for(const Cat in Data) {
            if(Cat == 'EPUBCFI') continue;
            const ParsedData = U.initialize.parseDataString(Data[Cat]);
            if(!ParsedData) continue;
            Data[Cat] = Bibi.applyFilteredSettingsTo({}, ParsedData, [Bibi.SettingTypes, Bibi.SettingTypes_UserOnly]);
            delete Data[Cat]['book'];
        }
        return Data;
    })();
    if(HashData['#']      ) { Object.assign(_U, _U['#']       = HashData['#']   ); }
    if(HashData['Bibi']   ) { Object.assign(_U, _U['Bibi']    = HashData['Bibi']); }
    if(HashData['Jo']     ) { Object.assign(_U, _U['Jo']      = HashData['Jo']  ); if(history.replaceState) history.replaceState(null, null, location.href.replace(/[&#]jo\([^\)]*\)$/g, '')); }
    if(HashData['EPUBCFI']) {                   _U['EPUBCFI'] = HashData['EPUBCFI']; }
    _U['Query'] = {}; for(const Pro in U) {
        if(typeof U[Pro] != 'function') _U['Query'][Pro] = U[Pro];
        U[Pro] = undefined; delete U[Pro];
    }
    Object.assign(U, _U);
         if(typeof U['nav']  == 'number') U['nav'] < 1 ? delete U['nav'] : R.StartOn = { Nav:  U['nav']  }; // to be converted in L.coordinateLinkages
    else if(typeof U['p']    == 'string')                                  R.StartOn = { P:    U['p']    };
    else if(typeof U['iipp'] == 'number')                                  R.StartOn = { IIPP: U['iipp'] };
    else if(typeof U['edge'] == 'string')                                  R.StartOn = { Edge: U['edge'] };
    else if(typeof U['EPUBCFI'] == 'string') E.add('bibi:readied', () => { if(X['EPUBCFI']) R.StartOn = X['EPUBCFI'].getDestination(U['EPUBCFI']); });
};

    U.initialize.parseDataString = (DataString) => {
        if(typeof DataString != 'string' || !DataString) return null;
        const ParsedData = {}; let HasData = false;
        DataString.split('&').forEach(PnV => {
            const DD = U.translateData(PnV.split('='));
            if(DD && DD[1] != undefined) ParsedData[DD[0]] = DD[1], HasData = true;
        });
        return HasData ? ParsedData : null;
    };



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Document-Defined Settings (Bookshelf, Book, Book-Data)

//----------------------------------------------------------------------------------------------------------------------------------------------


export const D = {};


D.initialize = () => {
    const Bookshelf = document.getElementById('bibi-preset').getAttribute('data-bibi-bookshelf');
    if(Bookshelf) {
        D['bookshelf'] = new URL(Bookshelf, location.href.split('?')[0]);
        //delete P['bookshelf'];
    }
    const Book = document.body.getAttribute('data-bibi-book');
    if(Book) {
        D['book'] = document.body.getAttribute('data-bibi-book');
    }
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
    if(D['book'] || D['book-data']) {
        //delete U['book'];
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
    if(!S['trustworthy-origins'].includes(O.Origin)) S['trustworthy-origins'].unshift(O.Origin);
    // --------
    S['book'] = (!S['book-data'] && typeof S['book'] == 'string' && S['book']) ? new URL(S['book'], S['bookshelf'] + '/').href : '';
    if(!S['book-data'] && S['book'] && !S['trustworthy-origins'].includes(new URL(S['book']).origin)) throw `The Origin of the Path of the Book Is Not Allowed.`;
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
    ['history', 'bookmarks'].forEach(_ => {
        if( S['max-' + _] == 0) S['use-' + _] = false;
        if(!S['use-' + _]     ) S['max-' + _] = 0;
    });
    if(!S['use-menubar']) S['use-full-height'] = true;
    // --------
    if(sML.UA.Trident || sML.UA.EdgeHTML) S['pagination-method'] = 'auto';
    // --------
    if(!S['reader-view-mode']) S['reader-view-mode'] = 'paged';
    if(O.Biscuits) E.bind('bibi:initialized-book', () => {
        const BookBiscuits = O.Biscuits.remember('Book');
        if(S['keep-settings']) {
            if(!U['reader-view-mode']              && BookBiscuits.RVM) S['reader-view-mode']              = BookBiscuits.RVM;
            if(!U['full-breadth-layout-in-scroll'] && BookBiscuits.FBL) S['full-breadth-layout-in-scroll'] = BookBiscuits.FBL;
        }
        if(S['resume-from-last-position']) {
            if(!R.StartOn && BookBiscuits.Position && BookBiscuits.Position.IIPP) R.StartOn = sML.clone(BookBiscuits.Position);
        }
    });
    // --------
    S.Modes = { // 'Mode': { SH: 'ShortHand', CNP: 'ClassNamePrefix' }
          'book-rendition-layout'    : { SH: 'BRL', CNP: 'book' },
             'reader-view-mode'      : { SH: 'RVM', CNP: 'view' },
        'page-progression-direction' : { SH: 'PPD', CNP: 'page' },
           'spread-layout-axis'      : { SH: 'SLA', CNP: 'spread' },
           'spread-layout-direction' : { SH: 'SLD', CNP: 'spread' },
        'apparent-reading-axis'      : { SH: 'ARA', CNP: 'appearance' },
        'apparent-reading-direction' : { SH: 'ARD', CNP: 'appearance' },
        'navigation-layout-direction': { SH: 'NLD', CNP: 'nav' }
    };
    for(const Mode in S.Modes) {
        const _ = S.Modes[Mode];
        Object.defineProperty(S, _.SH, { get: () => S[Mode], set: (Val) => S[Mode] = Val });
        delete _.SH;
    }
    // --------
    E.dispatch('bibi:initialized-settings');
};


S.update = (Settings) => {
    const Prev = {}; for(const Mode in S.Modes) Prev[Mode] = S[Mode];
    if(typeof Settings == 'object') for(const Property in Settings) if(typeof S[Property] != 'function') S[Property] = Settings[Property];
    S['book-rendition-layout'] = B.Package.Metadata['rendition:layout'];
    S['allow-placeholders'] = (S['allow-placeholders'] && B.AllowPlaceholderItems);
    if(S.FontFamilyStyleIndex) sML.deleteCSSRule(S.FontFamilyStyleIndex);
    if(S['ui-font-family']) S.FontFamilyStyleIndex = sML.appendCSSRule('html', 'font-family: ' + S['ui-font-family'] + ' !important;');
    S['page-progression-direction'] = B.PPD;
    if(S['pagination-method'] == 'x') {
        S['spread-layout-axis'] = S['reader-view-mode'] == 'vertical' ? 'vertical' : 'horizontal';
    } else {
        S['spread-layout-axis'] = (() => {
            if(S['reader-view-mode'] != 'paged') return S['reader-view-mode'];
            if(S['book-rendition-layout'] == 'reflowable') switch(B.WritingMode) {
                case 'tb-rl': case 'tb-lr': return   'vertical'; ////
            }                               return 'horizontal';
        })();
    }
     S['apparent-reading-axis']      = (S['reader-view-mode']   == 'paged'   ) ? 'horizontal' : S['reader-view-mode'];
     S['apparent-reading-direction'] = (S['reader-view-mode']   == 'vertical') ? 'ttb'        : S['page-progression-direction'];
        S['spread-layout-direction'] = (S['spread-layout-axis'] == 'vertical') ? 'ttb'        : S['page-progression-direction'];
    S['navigation-layout-direction'] = (S['fix-nav-ttb'] || S['page-progression-direction'] != 'rtl') ? 'ttb' : 'rtl';
    //S['spread-gap'] = S['book-rendition-layout'] == 'reflowable' ? S['spread-gap_reflowable'] : S['spread-gap_pre-paginated'];
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
        // OOBL: "O"ffset "E"nd of "B"readth and "L"ength
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
            case '<b:>': Ls.unshift(`📕`); Ls.push('%c' + Log), Ss.push(O.log.BStyle);                 Ls.push(`%c(v${ Bibi['version'] })` + (Bibi.Dev ? ':%cDEV' : '')), Ss.push(O.log.NStyle); if(Bibi.Dev) Ss.push(O.log.BStyle); break;
            case '</b>': Ls.unshift(`📖`); Ls.push('%c' + Log), Ss.push(O.log.BStyle); if(O.log.Limit) Ls.push(`%c(${ Math.floor(Time / 1000) + '.' + String(Time % 1000).padStart(3, 0) }sec)`), Ss.push(O.log.NStyle); break;
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
        O.log.Depth = 1;
        O.log.NStyle = 'font: normal normal 10px/1 Menlo, Consolas, monospace;';
        O.log.BStyle = 'font: normal bold   10px/1 Menlo, Consolas, monospace;';
        O.log.distill = (sML.UA.Trident || sML.UA.EdgeHTML) ?
            (Logs, Styles) => [Logs.join(' ').replace(/%c/g, '')]               : // Ignore Styles
            (Logs, Styles) => [Logs.join(' ')                   ].concat(Styles);
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
    I.note(Err, 99999999999, 'ErrorOccured');
    O.log(Err, '<e/>');
    E.dispatch('bibi:x_x', typeof Err == 'string' ? new Error(Err) : Err);
};


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
    if(!Source['media-type']) Source['media-type'] = O.getContentType(Source.Path);
    return B.Package.Manifest[Source.Path];
};


O.RangeLoader = null;

O.cancelExtraction = (Source) => {
    if(Source.Resources) Source.Resources.forEach(Res => Res.Retlieved ? Promise.resolve() : O.RangeLoader.abort(Res.Path));
    return Source.Retlieved ? Promise.resolve() : O.RangeLoader.abort(Source.Path);
};

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
                /404/.test(Err) ? Bibi.ErrorMessages.NotFound :
            /aborted/.test(Err) ? Bibi.ErrorMessages.Canceled :
              /fetch/.test(Err) ? Bibi.ErrorMessages.CORSBlocked :
          /not found/.test(Err) ? Bibi.ErrorMessages.DataInvalid :
            /invalid/.test(Err) ? Bibi.ErrorMessages.DataInvalid :
        Err);
    });
};

O.download = (Source/*, Opt = {}*/) => {
    Source = O.src(Source);
    if(Source.Retlieving) return Source.Retlieving;
    if(Source.Content) return Promise.resolve(Source);
    const IsBin = O.isBin(Source);
    const XHR = new XMLHttpRequest(); //if(Opt.MimeType) XHR.overrideMimeType(Opt.MimeType);
    const RemotePath = Source.URI ? Source.URI : (/^([a-z]+:\/\/|\/)/.test(Source.Path) ? '' : B.Path + '/') + Source.Path;
    return Source.Retlieving = new Promise((resolve, reject) => {
        XHR.open('GET', RemotePath, true);
        XHR.responseType = IsBin ? 'blob' : 'text';
        XHR.onloadend = () => XHR.status == 200 ? resolve() : reject();
        XHR.onerror = () => reject();
        XHR.send(null);
    }).then(() => {
        Source.DataType = IsBin ? 'Blob' : 'Text', Source.Content = XHR.response;
        Source.Retlieved = true;
        delete Source.Retlieving;
        return Source;
    }).catch(() => {
        delete Source.Retlieving;
        return Promise.reject(
            XHR.status == 404 ? Bibi.ErrorMessages.NotFound :
            XHR.status ==   0 ? Bibi.ErrorMessages.CORSBlocked :
        XHR.status + ' ' + XHR.statusText);
    });
};

O.tryRangeRequest = (Path = Bibi.Script.src, Bytes = '0-0') => new Promise((resolve, reject) => {
    const XHR = new XMLHttpRequest();
    XHR.onloadend = () => XHR.status != 206 ? reject() : resolve();
    XHR.open('GET', Path, true);
    XHR.setRequestHeader('Range', 'bytes=' + Bytes);
    XHR.send(null);
});

O.file = (Source, Opt = {}) => new Promise((resolve, reject) => {
    Source = O.src(Source);
    if(Opt.URI && Source.URI) return resolve(Source);
    (() => {
        if(Source.Content) return Promise.resolve(Source);
        if(Source.URI || !B.ExtractionPolicy) return O.download(Source);
        switch(B.ExtractionPolicy) {
            case 'on-the-fly': return O.extract(Source);
            case 'at-once':    return Promise.reject(`File Not Included: "${ Source.Path }"`);
        }
    })().then(Source => {
        if(typeof Opt.initialize == 'function') Opt.initialize(Source);
        return (Opt.Preprocess && !Source.Preprocessed) ? O.preprocess(Source) : Source;
    }).then(Source => {
        if(Opt.URI) {
            if(!Source.URI) Source.URI = O.createBlobURL(Source.DataType, Source.Content, Source['media-type']);
            Source.Content = '';
        }
        resolve(Source);
     }).catch(reject);
});


O.isBin = (Source) => /\.(aac|gif|jpe?g|m4[av]|mp[g34]|ogg|[ot]tf|pdf|png|web[mp]|woff2?)$/i.test(Source.Path);

O.createBlobURL = (DT, CB, MT) => URL.createObjectURL(DT == 'Text' ? new Blob([CB], { type: MT }) : CB);


O.ContentTypes = {
    'pdf'     : 'application/pdf',
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
    'webm'    :       'video/webm',
    'ya?ml'   : 'application/x-yaml'
};

O.getContentType = (FileName) => {
    for(const Ext in O.ContentTypes) if(new RegExp('\\.' + Ext + '$').test(FileName)) return O.ContentTypes[Ext];
    return null;
};


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
            const ResRE = ResolveRule.getRE(Pattern.Attribute);
            const Reses = Source.Content.match(ResRE);
            if(!Reses) return;
            const ExtRE = new RegExp('\\.(' + Pattern.Extensions + ')$', 'i');
            Reses.forEach(Res => {
                const ResPathInSource = Res.replace(ResRE, ResolveRule.PathRef);
                const ResPaths = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? './' : '') + ResPathInSource).split('#');
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
                    { Extensions: 'gif|png|jpe?g|svg|ttf|otf|woff' }
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
                if(sML.UA.EdgeHTML) {
                    RRs.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, 'text-combine-horizontal: $2; text-combine-upright: $2$3']);
                    RRs.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-horizontal: all; text-combine-upright: all$1']);
                }
                if(sML.UA.Trident) {
                    RRs.push([/writing-mode\s*:\s*vertical-rl\s*([;\}])/gm,   'writing-mode: tb-rl$1']);
                    RRs.push([/writing-mode\s*:\s*vertical-lr\s*([;\}])/gm,   'writing-mode: tb-lr$1']);
                    RRs.push([/writing-mode\s*:\s*horizontal-tb\s*([;\}])/gm, 'writing-mode: lr-tb$1']);
                    RRs.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, '-ms-text-combine-horizontal: $2$3']);
                    RRs.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, '-ms-text-combine-horizontal: all$1']);
                }
                if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
                    RRs.push([/text-align\s*:\s*justify\s*([;\}])/gm, 'text-align: justify; text-justify: inter-ideograph$1']);
                }
                //delete this.init;
                return this;
            }
        },
        'svg': {
            ReplaceRules: [
                [/<!--\s+[.\s\S]*?\s+-->/gm, '']
            ],
            ResolveRules: [{
                getRE: (Att) => new RegExp('<\\??[a-zA-Z:\\-]+[^>]*? (' + Att + ')\\s*=\\s*["\'](?!(?:https?|data):)(.+?)[\'"]', 'g'),
                PathRef: '$2',
                Patterns: [
                    { Attribute: 'href',           Extensions: 'css' },
                    { Attribute: 'src',            Extensions: 'svg' },
                    { Attribute: 'src|xlink:href', Extensions: 'gif|png|jpe?g' }
                ]
            }]
        },
        'html?|xht(ml)?|xml': {
            ReplaceRules: [
                [/<!--\s+[.\s\S]*?\s+-->/gm, '']
            ],
            ResolveRules: [{
                getRE: (Att) => new RegExp('<\\??[a-zA-Z:\\-]+[^>]*? (' + Att + ')\\s*=\\s*["\'](?!(?:https?|data):)(.+?)[\'"]', 'g'),
                PathRef: '$2',
                Patterns: [
                    { Attribute: 'href',           Extensions: 'css' },
                    { Attribute: 'src',            Extensions: 'js|svg' },
                    { Attribute: 'src|xlink:href', Extensions: 'gif|png|jpe?g|mp([34]|e?g)|m4[av]' },
                    { Attribute: 'poster',         Extensions: 'gif|png|jpe?g' }
                ]
            }]
        }
    };


O.openDocument = (Source) => O.file(Source).then(Source => (new DOMParser()).parseFromString(Source.Content, /\.(xml|opf|ncx)$/i.test(Source.Path) ? 'text/xml' : 'text/html'));


O.editCSSRules = function() {
    let Doc, fun;
         if(typeof arguments[0] == 'function') Doc = arguments[1], fun = arguments[0];
    else if(typeof arguments[1] == 'function') Doc = arguments[0], fun = arguments[1];
    if(!Doc) Doc = document;
    if(!Doc.styleSheets || typeof fun != 'function') return;
    sML.forEach(Doc.styleSheets)(StyleSheet => O.editCSSRulesOfStyleSheet(StyleSheet, fun));
};

    O.editCSSRulesOfStyleSheet = (StyleSheet, fun) => {
        try{ if(!StyleSheet.cssRules) return; } catch(_) { return; }
        for(let l = StyleSheet.cssRules.length, i = 0; i < l; i++) {
            const CSSRule = StyleSheet.cssRules[i];
            /**/ if(CSSRule.cssRules)   O.editCSSRulesOfStyleSheet(CSSRule,            fun);
            else if(CSSRule.styleSheet) O.editCSSRulesOfStyleSheet(CSSRule.styleSheet, fun);
            else                                               fun(CSSRule                );
        }
    };


O.getWritingMode = (Ele) => {
    const CS = getComputedStyle(Ele);
         if(!O.WritingModeProperty)                            return (CS['direction'] == 'rtl' ? 'rl-tb' : 'lr-tb');
    else if(     /^vertical-/.test(CS[O.WritingModeProperty])) return (CS['direction'] == 'rtl' ? 'bt' : 'tb') + '-' + (/-lr$/.test(CS[O.WritingModeProperty]) ? 'lr' : 'rl');
    else if(   /^horizontal-/.test(CS[O.WritingModeProperty])) return (CS['direction'] == 'rtl' ? 'rl' : 'lr') + '-' + (/-bt$/.test(CS[O.WritingModeProperty]) ? 'bt' : 'tb');
    else if(/^(lr|rl|tb|bt)-/.test(CS[O.WritingModeProperty])) return CS[O.WritingModeProperty];
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


O.getPath = function() {
    let Origin = '', Path = arguments[0];
    if(arguments.length == 2 && /^[\w\d]+:\/\//.test(arguments[1])) Path  =       arguments[1];
    else for(let l = arguments.length, i = 1; i < l; i++)           Path += '/' + arguments[i];
    Path.replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, (M, P1, P2) => { Origin = P1, Path = P2; });
    while(/([^:\/])\/{2,}/.test(Path)) Path = Path.replace(/([^:\/])\/{2,}/g, '$1/');
    while(        /\/\.\//.test(Path)) Path = Path.replace(        /\/\.\//g,   '/');
    while(/[^\/]+\/\.\.\//.test(Path)) Path = Path.replace(/[^\/]+\/\.\.\//g,    '');
    /**/                               Path = Path.replace(      /^(\.\/)+/g,    '');
    if(Origin) Path = Origin + '/' + Path;
    return Path;
};


O.fullPath = (FilePath) => B.Path + B.PathDelimiter + FilePath;


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


O.isPointableContent = (Ele) => {
    while(Ele) {
        if(/^(a|audio|video)$/i.test(Ele.tagName)) return true;
        Ele = Ele.parentElement;
    }
    return false;
};


O.stopPropagation = (Eve) => { Eve.stopPropagation(); return false; };

O.preventDefault  = (Eve) => { Eve.preventDefault();  return false; };


O.getBibiEvent = (Eve) => {
    if(!Eve) return {};
    const Coord = O.getBibiEventCoord(Eve);
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
    return {
        Target: Eve.target,
        Coord: Coord,
        Ratio: Ratio,
        Division: Division
    };
};

O.getBibiEventCoord = (Eve) => { let Coord = { X: 0, Y: 0 };
    if(/^touch/.test(Eve.type)) {
        Coord.X = Eve.changedTouches[0].pageX;
        Coord.Y = Eve.changedTouches[0].pageY;
    } else {
        Coord.X = Eve.pageX;
        Coord.Y = Eve.pageY;
    }
    Coord = O.getCoordInViewport(Coord, Eve.target.ownerDocument);/*
    console.log(
        `[${ Eve.target.ownerDocument == document ? 'PARENT' : 'CHILD' }]`,
        Coord,
        {
            X: Eve.screenX - window.screenX - (window.outerWidth  - window.innerWidth),
            Y: Eve.screenY - window.screenY - (window.outerHeight - window.innerHeight)
        },
        Eve
    );//*/
    return Coord;
};

O.getCoordInViewport = (Coord, Doc) => {
    if(Doc == document) {
        Coord.X -= O.Body.scrollLeft;
        Coord.Y -= O.Body.scrollTop;
    } else {
        const Main = R.Main;
        const MainTransformation = I.Loupe.CurrentTransformation || { Scale: 1, TranslateX: 0, TranslateY: 0 };
        const MainScale = MainTransformation.Scale;
        const MainTransformOriginX_InMain = Main.offsetWidth  / 2;
        const MainTransformOriginY_InMain = Main.offsetHeight / 2;
        const MainTranslationX = MainTransformation.TranslateX;
        const MainTranslationY = MainTransformation.TranslateY;
        const Item = Doc.documentElement.Item;
        const ItemScale = Item.Scale;
        const ItemCoordInMain = O.getElementCoord(Item, Main);
        if(Item['rendition:layout'] != 'pre-paginated' && !Item.Outsourcing) ItemCoordInMain.X += S['item-padding-left'], ItemCoordInMain.Y += S['item-padding-top'];
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


O.Cookies = {
    Label: 'bibi',
    remember: (Group) => {
        const BCs = JSON.parse(sML.Cookies.read(O.Cookies.Label) || '{}');
        console.log('Cookies:', BCs);
        if(typeof Group != 'string' || !Group) return BCs;
        return BCs[Group];
    },
    eat: (Group, KeyVal, Opt) => {
        if(typeof Group != 'string' || !Group) return false;
        if(typeof KeyVal != 'object') return false;
        const BCs = O.Cookies.remember();
        if(typeof BCs[Group] != 'object') BCs[Group] = {};
        for(const Key in KeyVal) {
            const Val = KeyVal[Key];
            if(typeof Val == 'function') continue;
            BCs[Group][Key] = Val;
        }
        if(!Opt) Opt = {};
        Opt.Path = location.pathname.replace(/[^\/]+$/, '');
        if(!Opt.Expires) Opt.Expires = S['cookie-expires'];
        sML.Cookies.write(O.Cookies.Label, JSON.stringify(BCs), Opt);
    }
};


O.Biscuits = {
    Memories: {}, Labels: {},
    initialize: (Tag) => {
        if(!localStorage) return O.Biscuits = null;
        if(typeof Tag != 'string') {
            O.Biscuits.LabelBase = 'BibiBiscuits:' + P.Script.src.replace(new RegExp('^' + O.Origin.replace(/([\/\.])/g, '\\$1')), '');
            E.bind('bibi:initialized',      () => O.Biscuits.initialize('Bibi'));
            E.bind('bibi:initialized-book', () => O.Biscuits.initialize('Book'));
            return null;
        }
        switch(Tag) {
            case 'Bibi': break;
            case 'Book': if(B.ID) break;
            default: return null;
        }
        const Label = O.Biscuits.Labels[Tag] = O.Biscuits.LabelBase + (Tag == 'Book' ? '#' + B.ID : '');
        const BiscuitsOfTheLabel = localStorage.getItem(Label);
        O.Biscuits.Memories[Label] = BiscuitsOfTheLabel ? JSON.parse(BiscuitsOfTheLabel) : {};
        return O.Biscuits.Memories[Label];
    },
    remember: (Tag, Key) => {
        if(!Tag || typeof Tag != 'string' || !O.Biscuits.Labels[Tag]) return O.Biscuits.Memories;
        const Label = O.Biscuits.Labels[Tag];
        return (!Key || typeof Key != 'string') ? O.Biscuits.Memories[Label] : O.Biscuits.Memories[Label][Key];
    },
    memorize: (Tag, KnV) => {
        if(!Tag || typeof Tag != 'string' || !O.Biscuits.Labels[Tag]) return false;
        const Label = O.Biscuits.Labels[Tag];
        if(KnV && typeof KnV == 'object') for(const Key in KnV) { const Val = KnV[Key];
            try {
                if(Val && typeof Val != 'function' && typeof JSON.parse(JSON.stringify({ [Key]: Val }))[Key] != 'undefined') O.Biscuits.Memories[Label][Key] = Val;
                //if(Val) O.Biscuits.Memories[Label][Key] = Val;
                else throw '';
            } catch(Err) {
                delete O.Biscuits.Memories[Label][Key];
            }
        }
        return localStorage.setItem(Label, JSON.stringify(O.Biscuits.Memories[Label]));
    },
    forget: (Tag, Keys) => {
        if(!Tag) {
            localStorage.removeItem(O.Biscuits.Labels.Bibi);
            localStorage.removeItem(O.Biscuits.Labels.Book);
            O.Biscuits.Memories = {};
        } else if(typeof Tag != 'string' || !O.Biscuits.Labels[Tag]) {
        } else {
            const Label = O.Biscuits.Labels[Tag];
            if(!Keys) {
                localStorage.removeItem(Label);
                delete O.Biscuits.Memories[Label];
            } else {
                if(typeof Keys == 'string') Keys = [Keys];
                if(Array.isArray(Keys)) Keys.forEach(Key => (typeof Key != 'string' || !Key) ? false : delete O.Biscuits.Memories[Label][Key]);
                localStorage.setItem(Label, JSON.stringify(O.Biscuits.Memories[Label]));
            }
        }
        return O.Biscuits.Memories;
    }
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
    E['resize'] = O.TouchOS ? 'orientationchange' : 'resize';
    E.Cpt0Psv0 = { capture: false, passive: false };
    E.Cpt1Psv0 = { capture:  true, passive: false };
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
    Extensions: [], Bibi: {}
};

X.load = (Xtn) => new Promise((resolve, reject) => {
    if(!Xtn['src'] || typeof Xtn['src'] != 'string') return reject(`"path" of the Extension Seems to Be Invalid. ("${ Xtn['src'] }")`);
    const XO = new URL(Xtn['src']).origin;
    if(!S['trustworthy-origins'].includes(XO)) return reject(`The Origin Is Not Allowed. ("${ Xtn['src'] }")`);
    Xtn.Script = document.head.appendChild(sML.create('script', { className: 'bibi-extension-script', src: Xtn['src'], Extension: Xtn, resolve: resolve, reject: function() { reject(); document.head.removeChild(this); } }));
});

X.add = (XMeta) => {
    const XScript = document.currentScript;
    if(typeof XMeta['id'] == 'undefined') return XScript.reject(`"id" of the extension is undefined.`);
    if(typeof XMeta['id'] != 'string')    return XScript.reject(`"id" of the extension is invalid.`);
    if(!XMeta['id'])                      return XScript.reject(`"id" of the extension is blank.`);
    if(X[XMeta['id']])                    return XScript.reject(`"id" of the extension is reserved or already used by another. ("${ XMeta['id'] }")`);
    XScript.setAttribute('data-bibi-extension-id', XMeta['id']);
    X[XMeta['id']] = XScript.Extension = sML.applyRtL(XMeta, XScript.Extension);
    X[XMeta['id']].Index = X.Extensions.length;
    X.Extensions.push(X[XMeta['id']]);
    XScript.resolve(X[XMeta['id']]);
    const Xtn = X[XMeta['id']];
    return function(onR) {         if(Xtn && typeof onR == 'function') E.bind('bibi:readied',  () => onR.call(Xtn, Xtn));
        return function(onP) {     if(Xtn && typeof onP == 'function') E.bind('bibi:prepared', () => onP.call(Xtn, Xtn));
            return function(onO) { if(Xtn && typeof onO == 'function') E.bind('bibi:opened',   () => onO.call(Xtn, Xtn)); }; }; };
};

Bibi.x = X.add;
