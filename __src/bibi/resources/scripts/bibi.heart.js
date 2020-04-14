/*!
 *                                                                                                                          (℠)
 *  ## Bibi (heart) | Heart of Bibi.
 *
 */




export const Bibi = { 'version': '____Bibi-Version____', 'href': 'https://bibi.epub.link', TimeOrigin: Date.now() };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Hello !

//----------------------------------------------------------------------------------------------------------------------------------------------


Bibi.hello = () => new Promise(resolve => {
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
.catch(Mes => {
    I.note(Mes, 99999999999, 'ErrorOccured');
    throw Mes;
});


Bibi.initialize = () => {
    //const PromiseTryingRangeRequest = O.tryRangeRequest().then(() => true).catch(() => false).then(TF => O.RangeRequest = TF);
    { // Path / URI
        O.Origin = location.origin || (location.protocol + '//' + (location.host || (location.hostname + (location.port ? ':' + location.port : ''))));
        O.RequestedURL = location.href;
        O.BookURL = O.Origin + location.pathname + location.search;
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
        if(O.TouchOS = (sML.OS.iOS || sML.OS.Android)) { // Touch Device
            O.HTML.classList.add('touch');
            if(sML.OS.iOS) {
                O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-capable',          content: 'yes'   }));
                O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'white' }));
            }
        }
        if(Bibi.Dev)   O.HTML.classList.add('dev');
        if(Bibi.Debug) O.HTML.classList.add('debug');
        O.HTML.classList.add('default-lang-' + (O.Language = (NLs => { // Language
            if(navigator.languages instanceof Array) NLs = NLs.concat(navigator.languages);
            if(navigator.language && navigator.language != NLs[0]) NLs.unshift(navigator.language);
            for(let l = NLs.length, i = 0; i < l; i++) {
                const Lan = NLs[i].split ? NLs[i].split('-')[0] : '';
                if(Lan == 'ja') return 'ja';
                if(Lan == 'en') break;
            }                   return 'en';
        })([])));
    }
    E.initialize(); O.Biscuits.initialize();
    R.initialize();
    I.initialize();
    P.initialize();
    H.initialize();
    U.initialize();
    S.initialize(
        () => O.Embedded = (() => { // Window Embedded or Not
            if(window.parent == window) { O.HTML.classList.add('window-direct'  );                                                                         return                            0; } // false
            else                        { O.HTML.classList.add('window-embedded'); try { if(location.host == parent.location.host || parent.location.href) return 1; } catch(Err) {} return -1; } // true (1:Reachable or -1:Unreachable)
        })(),
        () => O.FullscreenTarget = (() => { // Fullscreen Target
            const FsT = (() => {
                     if(O.Embedded == 0) { sML.Fullscreen.polyfill(window       );       return                                                                  O.HTML;                 }
                else if(O.Embedded == 1) { sML.Fullscreen.polyfill(window.parent); try { return window.parent.document.getElementById(S['parent-holder-id']).Bibi.Frame; } catch(Err) {} }
            })() || null;
            if(FsT && FsT.ownerDocument.fullscreenEnabled) { O.HTML.classList.add('fullscreen-enabled' ); return FsT;  }
            else                                           { O.HTML.classList.add('fullscreen-disabled'); return null; }
        })()
    );
    if(sML.UA.Trident && !(sML.UA.Trident[0] >= 7)) { // Say Bye-bye
        I.note(`Your Browser Is Not Compatible`, 99999999999, 'ErrorOccured');
        return O.error(I.Veil.byebye({
            'en': `<span>Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible.</span>`,
            'ja': `<span>大変申し訳ありません。</span> <span>お使いのブラウザでは、</span><span>動作しません。</span>`
        }));
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
    E.dispatch('bibi:initialized');
    //return PromiseTryingRangeRequest;
};


Bibi.loadExtensions = () => {
    return new Promise((resolve, reject) => {
        const AdditionalExtensions = [];
        let ReadyForExtraction = false, ReadyForBibiZine = false;
        if(S['book']) {
            if(O.isToBeExtractedIfNecessary(S['book'])) ReadyForExtraction = true;
            if(B.Type == 'Zine')                        ReadyForBibiZine = true;
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
    E.dispatch('bibi:readied');
}).then(() => {
    O.HTML.classList.remove('ready');
});


Bibi.getBookData = () =>
    S['book']              ?     Promise.resolve({ BookData: S['book'] }) :
    S.BookDataElement      ?     Promise.resolve({ BookData: S.BookDataElement.innerText.trim(), BookDataType: S.BookDataElement.getAttribute('data-bibi-book-mimetype') }) :
    S['accept-local-file'] ? new Promise(resolve => { Bibi.getBookData.resolve = (Par) => { resolve(Par), O.HTML.classList.remove('waiting-file'); }; O.HTML.classList.add('waiting-file'); }) :
                                 Promise.reject (`Tell me EPUB name via ${ O.Embedded ? 'embedding tag' : 'URI' }.`);


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


Bibi.loadBook = (BookDataParam) => Promise.resolve().then(() => {
    Bibi.busyHerself();
    I.note(`Loading...`);
    O.log(`Initializing Book...`, '<g:>');
    return L.initializeBook(BookDataParam).then(InitializedAs => {
        O.log(`${ InitializedAs }: %O`, B);
        O.log(`Initialized.`, '</g>');
    });
}).then(() => {
    S.update();
    R.updateOrientation();
    R.resetStage();
}).then(() => {
    // Create Cover
    O.log(`Creating Cover...`, '<g:>');
    if(B.CoverImageItem) {
        O.log(`Cover Image: %O`, B.CoverImageItem);
        O.log(`Will Be Created.`, '</g>');
    } else {
        O.log(`Will Be Created. (w/o Image)`, '</g>');
    }
    return L.createCover(); // ← loading is async
}).then(() => {
    // Load Navigation
    if(!B.NavItem) {
        O.log(`No Navigation.`)
        return resolve();
    }
    O.log(`Loading Navigation...`, '<g:>');
    return L.loadNavigation().then(PNav => {
        O.log(`${ B.NavItem.NavType }: %O`, B.NavItem);
        O.log(`Loaded.`, '</g>');
        E.dispatch('bibi:loaded-navigation', B.NavItem);
    });
}).then(() => {
    // Announce "Prepared" (and Wait, sometime)
    E.dispatch('bibi:prepared');
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
    if(typeof S['to'] == 'object') {
        LayoutOption.TargetSpreadIndex =
            (typeof S['to'].SpreadIndex       == 'number') ? S['to'].SpreadIndex :
            (typeof S['to'].ItemIndexInSpine  == 'number') ? B.Package.Spine.Items[S['to'].ItemIndexInSpine].Spread.Index :
            (       S['to']['SI-PPiS']                   ) ? S['to']['SI-PPiS'].split('-')[0] :
            0;
        LayoutOption.Destination = S['to'];
    }
    LayoutOption.addResetter();
    let LoadedItems = 0;
    R.Spreads.forEach(Spread => Promises.push(new Promise(resolve => L.loadSpread(Spread, { AllowPlaceholderItems: S['allow-placeholders'] && Spread.Index != LayoutOption.TargetSpreadIndex }).then(() => {
        LoadedItems += Spread.Items.length;
        I.note(`Loading... (${ LoadedItems }/${ R.Items.length } Items Loaded.)`);
        !LayoutOption.Reset ? R.layOutSpread(Spread).then(resolve) : resolve();
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
    return R.layOut(LayoutOption).then(() => {
        LayoutOption.removeResetter();
        R.IntersectingPages = [R.Spreads[LayoutOption.TargetSpreadIndex].Pages[0]];
        Bibi.Eyes.wearGlasses();
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
    E.dispatch('bibi:opened');
    resolve();
}).then(() => {
    E.bind(['bibi:changed-intersection', 'bibi:scrolled'], R.updateCurrent);
    R.updateCurrent();
    const LandingPage = R.hatchPage(LayoutOption.Destination);
    if(!I.History.List.length) {
        I.History.List = [{ UI: Bibi, Spread: LandingPage.Spread, PageProgressInSpread: LandingPage.IndexInSpread / LandingPage.Spread.Pages.length }];
        I.History.update();
    }
    if(S['allow-placeholders']) {
        R.turnSpreads({ Origin: LandingPage.Spread });
        setTimeout(() => { R.turnSpreads(); }, 123);
        E.add('bibi:scrolled', () => setTimeout(() => R.turnSpreads(), 123));
        E.add('bibi:changed-intersection', () => !I.Slider.Touching ? R.turnSpreads() : false);
    }
    if(S['resume-from-last-position']) E.add('bibi:changed-intersection', () => { try {
        const CurrentPage = R.Current.List[0].Page;
        O.Biscuits.memorize('Book', { 'Position': { 'SI-PPiS': CurrentPage.Spread.Index + '-' + (CurrentPage.IndexInSpread / CurrentPage.Spread.Pages.length) } });
    } catch(Err) {} });
    E.add('bibi:commands:move-by',     R.moveBy);
    E.add('bibi:commands:scroll-by',   R.scrollBy);
    E.add('bibi:commands:focus-on',    R.focusOn);
    E.add('bibi:commands:change-view', R.changeView);
    window.addEventListener('message', M.gate, false);
    (Bibi.Dev && !/:61671/.test(location.href)) ? Bibi.createDevNote() : delete Bibi.createDevNote;
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


Bibi.Eyes = {
    watch: (Ent) => {
        const Page = Ent.target;
        let IntersectionChanging = false;
        //const IntersectionRatio = Math.round(Ent.intersectionRatio * 10000) / 100;
        if(Ent.isIntersecting) {
            if(!R.IntersectingPages.includes(Page)) {
                IntersectionChanging = true;
                R.IntersectingPages.push(Page);
            }
        } else {
            if( R.IntersectingPages.includes(Page)) {
                IntersectionChanging = true;
                R.IntersectingPages = R.IntersectingPages.filter(IntersectingPage => IntersectingPage != Page);
            }
        }
        if(IntersectionChanging) {
            if(R.IntersectingPages.length) R.IntersectingPages.sort((A, B) => A.Index - B.Index);
            E.dispatch('bibi:changes-intersection', R.IntersectingPages);
            clearTimeout(Bibi.Eyes.Timer_IntersectionChange);
            Bibi.Eyes.Timer_IntersectionChange = setTimeout(() => {
                E.dispatch('bibi:changed-intersection', R.IntersectingPages);
            }, 9);
        }
    },
    wearGlasses: () => {
        Bibi.Glasses = new IntersectionObserver(Ents => Ents.forEach(Bibi.Eyes.watch), {
            root: R.Main,
            rootMargin: '0px',
            threshold: [0, 0.5, 1]
        });
        Bibi.Eyes.observe = (Page) => Bibi.Glasses.observe(Page);
        Bibi.Eyes.unobserve = (Page) => Bibi.Glasses.unobserve(Page);
        Bibi.Eyes.PagesToBeObserved.forEach(PageToBeObserved => Bibi.Glasses.observe(PageToBeObserved));
        delete Bibi.Eyes.PagesToBeObserved;
    },
    PagesToBeObserved: [],
    observe: (Page) => !Bibi.Eyes.PagesToBeObserved.includes(Page) ? Bibi.Eyes.PagesToBeObserved.push(Page) : Bibi.Eyes.PagesToBeObserved.length,
    unobserve: (Page) => (Bibi.Eyes.PagesToBeObserved = Bibi.Eyes.PagesToBeObserved.filter(PageToBeObserved => PageToBeObserved != Page)).length
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
    Container: { Path: 'META-INF/container.xml' },
    Package: {
        Manifest: { Items: {} },
        Spine: { Items: [] }
    },
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


L.openNewWindow = (Href) => {
    const WO = window.open(Href);
    return WO ? WO : location.href = Href;
};


L.play = () => {
    if(S['start-in-new-window']) return L.openNewWindow(location.href);
    L.Played = true;
    R.resetStage();
    L.wait.resolve();
    E.dispatch('bibi:played');
};


L.initializeBook = (Par) => new Promise((resolve, reject) => {
    if(!Par || !Par.BookData) return reject(`Book Data Is Undefined.`);
    let BookData = Par.BookData;
    const BookDataFormat =
        typeof BookData == 'string' ? (/^https?:\/\//.test(BookData) || /^ms-local-stream:\/\//.test(BookData) ? 'URI' : 'Base64') :
        typeof BookData == 'object' ? (BookData instanceof File ? 'File' : BookData instanceof Blob ? 'BLOB' : '') : '';
    if(!BookDataFormat) return reject(`Book Data Is Unknown.`);
    if(BookDataFormat == 'URI') {
        // Online
        B.Path = BookData;
        if(!S['trustworthy-origins'].includes(new URL(B.Path).origin)) return reject(`The Origin of the Path of the Book Is Not Allowed.`);
        let RootFile;
        switch(B.Type) {
            case 'EPUB': RootFile = B.Container; break; // Online EPUB
            case 'Zine': RootFile = B.ZineData ; break; // Online Zine
        }
        const initialize_as = (FileOrFolder) => ({
            Promised: (
                FileOrFolder == 'Folder' ? O.download(RootFile).then(() => (B.PathDelimiter = '/') && '') :
                O.RangeLoader            ?  O.extract(RootFile).then(() => 'on-the-fly') :
                                           O.loadZippedBookData(B.Path)  .then(() => 'at-once')
            ).then(ExtractionPolicy => {
                B.ExtractionPolicy = ExtractionPolicy;
                //O.log(`Succeed to Open as ${ B.Type } ${ FileOrFolder }.`);
                resolve(`${ B.Type} ${ FileOrFolder }`);
            }).catch(ErrorDetail => {
                if(ErrorDetail.BookTypeError) return reject(ErrorDetail.BookTypeError);
                O.log(`Failed to Open as ${ B.Type } ${ FileOrFolder }.` + '\n' + `... ${ ErrorDetail }`);
                return Promise.reject();
            }),
            or:        function(fun) { return this.Promised.catch(ErrorDetail => fun(ErrorDetail)); },
            or_reject: function(Msg) { return this.or(() => reject(Msg)); }
        });
        O.isToBeExtractedIfNecessary(B.Path)
            ? initialize_as('File').or(() => initialize_as('Folder').or_reject(`Failed to Open Both as ${ B.Type } File and ${ B.Type } Folder.`                       ))
            :                                initialize_as('Folder').or_reject(`Changing "extract-if-necessary" May Be Required to Open This Book as ${ B.Type } File.`);
    } else {
        let FileOrData;
        const MIMETypeREs = { EPUB: /^application\/epub\+zip$/, Zine: /^application\/(zip|x-zip(-compressed)?)$/ };
        const MIMETypeErrorMessage = 'Can Not Open This Type of File.';
        if(BookDataFormat == 'File') {
            // Local-Archived EPUB/Zine File
            if(!S['accept-local-file'])                      return reject(`To Open Local Files, Changing "accept-local-file" in default.js Is Required.`);
            if(!BookData.name)                               return reject(`Book File Is Invalid.`);
            if(!/\.[\w\d]+$/.test(BookData.name))            return reject(`Can Not Open Local Files without Extension.`);
            if(!O.isToBeExtractedIfNecessary(BookData.name)) return reject(`To Open This File, Changing "extract-if-necessary" in default.js Is Required.`);
            if(BookData.type) {
                if(/\.epub$/i.test(BookData.name) ? !MIMETypeREs['EPUB'].test(BookData.type) :
                    /\.zip$/i.test(BookData.name) ? !MIMETypeREs['Zine'].test(BookData.type) : true) return reject(MIMETypeErrorMessage);
            }
            FileOrData = 'File';
            B.Path = '[Local File] ' + BookData.name;
        } else {
            if(BookDataFormat == 'Base64') {
                // Base64-Encoded EPUB/Zine Data
                if(!S['accept-base64-encoded-data']) return reject(`To Open Base64 Encoded Data, Changing "accept-base64-encoded-data" in default.js Is Required.`);
                try {
                    const Bin = atob(BookData.replace(/^.*,/, ''));
                    const Buf = new Uint8Array(Bin.length);
                    for(let l = Bin.length, i = 0; i < l; i++) Buf[i] = Bin.charCodeAt(i);
                    BookData = new Blob([Buf.buffer], { type: Par.BookDataType });
                    if(!BookData || !(BookData instanceof Blob)) throw '';
                } catch(_) {
                    return reject(`Book Data Is Invalid.`);
                }
                B.Path = '[Base64 Encoded Data]';
            } else {
                // BLOB of EPUB/Zine Data
                if(!S['accept-blob-converted-data']) return reject(`To Open BLOB Converted Data, Changing "accept-blob-converted-data" in default.js Is Required.`);
                B.Path = '[BLOB Converted Data]';
            }
            if(!MIMETypeREs['EPUB'].test(BookData.type) && !MIMETypeREs['Zine'].test(BookData.type)) return reject(MIMETypeErrorMessage);
            FileOrData = 'Data';
        }
        if(!BookData.size) return reject(`Book ${ FileOrData } Is Empty.`);
        O.loadZippedBookData(BookData).then(() => {
            switch(B.Type) {
                case 'EPUB': case 'Zine':
                    B.ExtractionPolicy = 'at-once';
                    return resolve(`${ B.Type } ${ FileOrData }`);
                default:
                    return reject(`Book ${ FileOrData } Is Invalid.`);
            }
        }).catch(reject);
    }
}).then(InitializedAs => new Promise(resolve => {
    switch(B.Type) {
        case 'EPUB': return L.loadContainer().then(L.loadPackage).then(resolve);
        case 'Zine': return X.Zine.loadZineData().then(resolve);
    }
}).then(() => {
    E.dispatch('bibi:initialized-book');
    return InitializedAs;
})).catch(Log => {
    //if(S['accept-local-file']) O.HTML.classList.add('waiting-file');
    const Message = `Failed to Open the Book.`;
    O.error(Message + '\n* ' + Log);
    return Promise.reject(Message);
});


L.loadContainer = () => O.openDocument(B.Container).then(L.loadContainer.process).then(() => E.dispatch('bibi:loaded-container'));

    L.loadContainer.process = (Doc) => {
        B.Package.Path = Doc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
        B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, '');
    };


L.loadPackage = () => O.openDocument(B.Package).then(L.loadPackage.process).then(() => E.dispatch('bibi:loaded-package-document'));

    L.loadPackage.process = (Doc) => { // This is Used also from the Zine Extention.
        const _Metadata = Doc.getElementsByTagName('metadata')[0], Metadata = B.Package.Metadata = {};// = { 'identifier': [], 'title': [], 'creator': [], 'publisher': [], 'language': [] };
        const _Manifest = Doc.getElementsByTagName('manifest')[0], Manifest = B.Package.Manifest;
        const _Spine    = Doc.getElementsByTagName('spine'   )[0], Spine    = B.Package.Spine;
        const _ItemPaths = {};
        // ================================================================================
        // METADATA
        // --------------------------------------------------------------------------------
        const DCNS = _Metadata.getAttribute('xmlns:dc');
        ['identifier', 'language', 'title', 'creator', 'publisher'].forEach(Pro => sML.forEach(Doc.getElementsByTagNameNS(DCNS, Pro))(_Meta => (Metadata[Pro] ? Metadata[Pro] : Metadata[Pro] = []).push(_Meta.textContent.trim())));
        sML.forEach(_Metadata.getElementsByTagName('meta'))(_Meta => {
            if(_Meta.getAttribute('refines')) return; // It's BAD and Wanted to Be FIXed.
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
        if(!Metadata['identifier']) Metadata['identifier'] = Metadata['dcterms:identifier'] || [O.BookURL];
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
        sML.forEach(_Manifest.getElementsByTagName('item'))(_Item => {
            let Item = {
                'id': _Item.getAttribute('id'),
                'href': _Item.getAttribute('href'),
                'media-type': _Item.getAttribute('media-type')
            };
            if(!Item['id'] || !Item['href'] || (!Item['media-type'] && B.Type == 'EPUB')) return false;
            Item.Path = O.getPath(B.Package.Dir, Item['href']);
            if(Manifest.Items[Item.Path]) Item = sML.edit(Manifest.Items[Item.Path], Item);
            if(!Item.Content) Item.Content = '';
            let Properties = _Item.getAttribute('properties');
            if(Properties) {
                Properties = Properties.trim().replace(/\s+/g, ' ').split(' ');
                     if(Properties.includes('cover-image')) B.CoverImageItem = Item;
                else if(Properties.includes('nav'        )) B.NavItem        = Item, Item.NavType = 'Navigation Document';
            }
            const FallbackItemID = _Item.getAttribute('fallback');
            if(FallbackItemID) Item['fallback'] = FallbackItemID;
            Manifest.Items[Item.Path] = Item;
            _ItemPaths[Item['id']] = Item.Path;
        });
        // ================================================================================
        // SPINE
        // --------------------------------------------------------------------------------
        if(!B.NavItem) {
            const Item = Manifest.Items[_ItemPaths[_Spine.getAttribute('toc')]];
            if(Item) B.NavItem = Item, Item.NavType = 'TOC-NCX';
        }
        // --------------------------------------------------------------------------------
        Spine['page-progression-direction'] = _Spine.getAttribute('page-progression-direction');
        if(!Spine['page-progression-direction'] || !/^(ltr|rtl)$/.test(Spine['page-progression-direction'])) Spine['page-progression-direction'] = S['default-page-progression-direction']; // default;
        B.PPD = Spine['page-progression-direction'];
        // --------------------------------------------------------------------------------
        const PropertyRE = /^((rendition:)?(layout|orientation|spread|page-spread))-(.+)$/;
        let SpreadBefore, SpreadAfter;
        if(B.PPD == 'rtl') SpreadBefore = 'right', SpreadAfter = 'left';
        else               SpreadBefore = 'left',  SpreadAfter = 'right';
        Spine.SpreadsDocumentFragment = document.createDocumentFragment();
        sML.forEach(_Spine.getElementsByTagName('itemref'))(_ItemRef => {
            const ItemRef = {
                'idref': _ItemRef.getAttribute('idref')
            };
            if(!ItemRef['idref']) return false;
            let Item = Manifest.Items[_ItemPaths[ItemRef['idref']]];
            if(!Item) return false;
            const FallbackChain = [];
            if(S['prioritise-fallbacks']) {
                while(Item['fallback']) {
                    const FallbackItem = Manifest.Items[_ItemPaths[Item['fallback']]];
                    if(FallbackItem) {
                        FallbackChain.push(Item.Path);
                        Item = FallbackItem;
                    } else delete Item['fallback'];
                }
            }
            Item.RefChain = FallbackChain.concat(Item.Path);
            ItemRef['linear'] = _ItemRef.getAttribute('linear');
            if(ItemRef['linear'] != 'no') ItemRef['linear'] = 'yes';
            let Properties = _ItemRef.getAttribute('properties');
            if(Properties) {
                Properties = Properties.trim().replace(/\s+/g, ' ').split(' ');
                Properties.forEach(Pro => { if(PropertyRE.test(Pro)) _ItemRef[Pro.replace(PropertyRE, '$1')] = Pro.replace(PropertyRE, '$4'); });
            }
            ItemRef['rendition:layout']      = _ItemRef['rendition:layout']      || Metadata['rendition:layout'];
            ItemRef['rendition:orientation'] = _ItemRef['rendition:orientation'] || Metadata['rendition:orientation'];
            ItemRef['rendition:spread']      = _ItemRef['rendition:spread']      || Metadata['rendition:spread'];
            const PageSpread = _ItemRef['rendition:page-spread'] || _ItemRef['page-spread'] || undefined;
            if(PageSpread) ItemRef['rendition:page-spread'] = PageSpread;
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            Item = sML.create('iframe', Item, { className: 'item', scrolling: 'no', allowtransparency: 'true',
                TimeCard: {}, stamp: function(What) { O.stamp(What, this.TimeCard); },
                IndexInSpine: Spine.Items.length,
                Ref: ItemRef,
                Pages: []
            });
            Item.Box = sML.create('div', { className: 'item-box ' + ItemRef['rendition:layout'], Content: Item, Item: Item });
            Item.RefChain.forEach(FallbackPath => Manifest.Items[FallbackPath] = Item);
            Spine.Items.push(Item);
            if(ItemRef['linear'] != 'yes') {
                Item.IndexInNonLinearItems = R.NonLinearItems.length;
                R.NonLinearItems.push(Item);
            } else {
                Item.Index = R.Items.length;
                R.Items.push(Item);
                let Spread = null;
                if(ItemRef['rendition:page-spread'] == SpreadAfter && Item.Index > 0) {
                    const PreviousItem = R.Items[Item.Index - 1];
                    if(PreviousItem.Ref['rendition:page-spread'] == SpreadBefore) {
                        PreviousItem.SpreadPair = Item;
                        Item.SpreadPair = PreviousItem;
                        Spread = Item.Spread = PreviousItem.Spread;
                        Spread.Box.classList.remove('single-item-spread-before', 'single-item-spread-' + SpreadBefore);
                        Spread.Box.classList.add(ItemRef['rendition:layout']);
                    }
                }
                if(!Spread) {
                    Spread = Item.Spread = sML.create('div', { className: 'spread',
                        Items: [], Pages: [],
                        Index: R.Spreads.length
                    });
                    Spread.Box = sML.create('div', { className: 'spread-box ' + ItemRef['rendition:layout'], Content: Spread, Spread: Spread });
                    if(ItemRef['rendition:page-spread']) {
                        Spread.Box.classList.add('single-item-spread-' + ItemRef['rendition:page-spread']);
                        switch(ItemRef['rendition:page-spread']) {
                            case SpreadBefore: Spread.Box.classList.add('single-item-spread-before'); break;
                            case SpreadAfter:  Spread.Box.classList.add('single-item-spread-after' ); break;
                        }
                    }
                    R.Spreads.push(Spine.SpreadsDocumentFragment.appendChild(Spread.Box).appendChild(Spread));
                }
                Item.IndexInSpread = Spread.Items.length;
                Spread.Items.push(Item);
                Spread.appendChild(Item.Box);//.appendChild(Item);
                if(ItemRef['rendition:layout'] == 'pre-paginated') {
                    Item.PrePaginated = true;
                    if(Item.IndexInSpread == 0) Spread.PrePaginated = true;
                    const Page = sML.create('span', { className: 'page',
                        Spread: Spread, Item: Item,
                        IndexInItem: 0
                    });
                    Item.Pages.push(Item.Box.appendChild(Page));
                    Bibi.Eyes.observe(Page);
                } else {
                    Item.PrePaginated = Spread.PrePaginated = false;
                }
            }
        });
        R.Main.Book.appendChild(B.Package.Spine.SpreadsDocumentFragment);
        // --------------------------------------------------------------------------------
        B.FileDigit = (Spine.Items.length + '').length;
        // ================================================================================
        B.ID        =  Metadata['identifier'][0];
        B.Language  =  Metadata['language'  ][0].split('-')[0];
        B.Title     =  Metadata['title'     ].join(', ');
        B.Creator   = !Metadata['creator'   ] ? '' : Metadata['creator'  ].join(', ');
        B.Publisher = !Metadata['publisher' ] ? '' : Metadata['publisher'].join(', ');
        const FullTitleFragments = [B.Title];
        if(B.Creator)   FullTitleFragments.push(B.Creator);
        if(B.Publisher) FullTitleFragments.push(B.Publisher);
        B.FullTitle = FullTitleFragments.join(' - ').replace(/&amp;?/gi, '&').replace(/&lt;?/gi, '<').replace(/&gt;?/gi, '>')
        O.Title.innerHTML = '';
        O.Title.appendChild(document.createTextNode(B.FullTitle + ' | ' + (S['website-name-in-title'] ? S['website-name-in-title'] : 'Published with Bibi')));
        try { O.Info.querySelector('h1').innerHTML = document.title; } catch(_) {}
        B.WritingMode =                                                                                   /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) ? (B.PPD == 'rtl' ? 'tb-rl' : 'lr-tb')
            : /^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language) ?                             'rl-tb'
            :                                                                                                             /^(mo?n)$/.test(B.Language) ?                   'tb-lr'
            :                                                                                                                                                                       'lr-tb';
        B.AllowPlaceholderItems = (B.ExtractionPolicy != 'at-once' && Metadata['rendition:layout'] == 'pre-paginated');
        [B.Container.Path, B.Package.Path].forEach(Path => {
            const Item = B.Package.Manifest.Items[Path];
            delete Item.Path, delete Item.Content, delete Item.DataType;
            delete B.Package.Manifest.Items[Path];
        });
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
        if(!B.CoverImageItem || !B.CoverImageItem.Path) return reject();
        let TimedOut = false;
        const TimerID = setTimeout(() => { TimedOut = true; reject(); }, 5000);
        O.file(B.CoverImageItem, { URI: true }).then(Item => {
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


L.loadNavigation = () => O.openDocument(B.NavItem).then(Doc => {
    const PNav = I.Panel.BookInfo.Navigation = I.Panel.BookInfo.insertBefore(sML.create('div', { id: 'bibi-panel-bookinfo-navigation' }), I.Panel.BookInfo.firstElementChild);
    PNav.innerHTML = '';
    const NavContent = document.createDocumentFragment();
    if(B.NavItem.NavType == 'Navigation Document') {
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
    L.coordinateLinkages(B.NavItem.Path, PNav, 'InNav');
    B.NavItem.Content = '';
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
        let HrefPathInSource = A.getAttribute('href'), HrefAttribute = 'href';
        if(!HrefPathInSource) {
            HrefPathInSource = A.getAttribute('xlink:href');
            if(HrefPathInSource) {
                HrefAttribute = 'xlink:href';
            } else {
                if(InNav) {
                    A.addEventListener('click', Eve => { Eve.preventDefault(); Eve.stopPropagation(); return false; });
                    A.classList.add('bibi-bookinfo-inactive-link');
                }
                continue;
            }
        }
        if(/^[a-zA-Z]+:/.test(HrefPathInSource)) {
            if(HrefPathInSource.split('#')[0] == location.href.split('#')[0]) {
                const HrefHashInSource = HrefPathInSource.split('#')[1];
                HrefPathInSource = (HrefHashInSource ? '#' + HrefHashInSource : R.Items[0].RefChain[0])
            } else {
                A.setAttribute('target', A.getAttribute('target') || '_blank');
                continue;
            }
        }
        const HrefPath = O.getPath(BasePath.replace(/\/?([^\/]+)$/, ''), (!/^\.*\/+/.test(HrefPathInSource) ? './' : '') + (/^#/.test(HrefPathInSource) ? BasePath.replace(/^.+?([^\/]+)$/, '$1') : '') + HrefPathInSource);
        const HrefFnH = HrefPath.split('#');
        const HrefFile = HrefFnH[0] ? HrefFnH[0] : BasePath;
        const HrefHash = HrefFnH[1] ? HrefFnH[1] : '';
        sML.forEach(R.Items)(Item => {
            if(HrefFile == Item.RefChain[0]) {
                A.setAttribute('data-bibi-original-href', HrefPathInSource);
                A.setAttribute(HrefAttribute, B.Path + '/' + HrefPath);
                A.InNav = InNav;
                A.Destination = (Item.Ref['rendition:layout'] == 'pre-paginated') ? {
                    Page: Item.Pages[0]
                } : {
                    Item: Item,
                    ElementSelector: (HrefHash ? '#' + HrefHash : undefined)
                };
                L.coordinateLinkages.setJump(A);
                return 'break'; //// break sML.forEach()
            }
        });
        if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
            A.setAttribute('data-bibi-original-href', HrefPathInSource);
            A.setAttribute(HrefAttribute, B.Path + '/#' + HrefHash);
            if(X['EPUBCFI']) {
                A.InNav = InNav;
                A.Destination = X['EPUBCFI'].getDestination(HrefHash);
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
        if(InNav && typeof S['nav'] == (i + 1) && A.Destination) S['to'] = A.Destination;
    }
};

    L.coordinateLinkages.setJump = (A) => A.addEventListener('click', Eve => {
        Eve.preventDefault(); 
        Eve.stopPropagation();
        if(A.Destination) new Promise(resolve => A.InNav ? I.Panel.toggle().then(resolve) : resolve()).then(() => {
            if(L.Opened) return R.focusOn({ Destination: A.Destination, Duration: 0 }).then(Destination => I.History.add({ UI: B, SumUp: false, Destination: Destination }));
            if(!L.Waiting) return false;
            if(S['start-in-new-window']) return L.openNewWindow(location.href + (location.hash ? ',' : '#') + 'jo(nav:' + A.NavANumber + ')');
            S['to'] = A.Destination;
            L.play();
        });
        return false;
    });


L.preprocessResources = () => new Promise((resolve, reject) => {
    E.dispatch('bibi:is-going-to:preprocess-resources');
    const Promises = [], PreprocessedResources = [], pushItemPreprocessingPromise = (Item, URI) => Promises.push(O.file(Item, { Preprocess: true, URI: URI }).then(() => PreprocessedResources.push(Item)));
    if(B.ExtractionPolicy) for(const FilePath in B.Package.Manifest.Items) {
        const Item = B.Package.Manifest.Items[FilePath];
        if(/\/(css|javascript)$/.test(Item['media-type'])) { // CSSs & JavaScripts in Manifest
            if(!Promises.length) O.log(`Preprocessing Resources...`, '<g:>');
            pushItemPreprocessingPromise(Item, true);
        }
    }
    Promise.all(Promises).then(() => {/*
        if(B.ExtractionPolicy != 'at-once' && (S.BRL == 'pre-paginated' || (sML.UA.Chromium || sML.UA.WebKit || sML.UA.Gecko))) return resolve(PreprocessedResources);
        R.Items.forEach(Item => pushItemPreprocessingPromise(Item, O.isBin(Item))); // Spine Items
        return Promise.all(Promises).then(() => resolve(PreprocessedResources));*/
        if(PreprocessedResources.length) {
            O.log(`Preprocessed: %O`, PreprocessedResources);
            O.log(`Preprocessed. (${ PreprocessedResources.length } Resource${ PreprocessedResources.length > 1 ? 's' : '' })`, '</g>');
        }
        E.dispatch('bibi:preprocessed-resources');
        resolve();
    });
});


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


L.loadItem = (Item, Opt = {}) => { // !!!! Don't Call Directly. Use L.loadSpread and load with spread-pair. !!!!
    const IsPlaceholder = (S['allow-placeholders'] && Item.Ref['rendition:layout'] == 'pre-paginated' && Opt.AllowPlaceholder);
    if(typeof Item.IsPlaceholder != 'undefined' && Item.IsPlaceholder == IsPlaceholder) return Promise.reject(Item);
    Item.IsPlaceholder = IsPlaceholder;
    const ItemBox = Item.Box;
    ItemBox.classList.toggle('placeholder', Item.IsPlaceholder);
    if(Item.IsPlaceholder) {
        if(Item.parentElement) Item.parentElement.removeChild(Item);
        Item.onload = Item.onLoaded = undefined;
        Item.src = '';
        Item.HTML = Item.Head = Item.Body = Item.Pages[0];
        return Promise.resolve(Item);
    }
    ItemBox.classList.remove('loaded');
    return new Promise((resolve, reject) => {
        if(Item.BlobURL) { resolve({}); return; }
        if(/\.(html?|xht(ml)?|xml)$/i.test(Item.Path)) { // (X)HTML
            if(!B.ExtractionPolicy /*!!!!!!!!*/ && !sML.UA.Gecko /*!!!!!!!!*/ ) { // Extracted (exclude Gecko from here, because of such books as styled only with -webkit/epub- prefixed properties. It's NOT Gecko's fault.)
                resolve({
                    URL: O.fullPath(Item.Path)
                }); return;
            }
            O.file(Item, { Preprocess: true }).then(Item => { // Archived (or Gecko. It's NOT Gecko's fault...)
                resolve({
                    HTML: Item.Content.replace(/^<\?.+?\?>/, '')
                })
            }).catch(reject); return;
        }
        if(/\.(gif|jpe?g|png)$/i.test(Item.Path)) { // Bitmap-in-Spine
            O.file(Item, { URI: true }).then(Item => {
                resolve({
                    Head: (Item.Ref['rendition:layout'] == 'pre-paginated' && B.ICBViewport) ? `<meta name="viewport" content="width=${ B.ICBViewport.Width }, height=${ B.ICBViewport.Height }" />` : '',
                    Body: `<img class="bibi-spine-item-image" alt="" src="${ Item.URI }" />` // URI is BlobURL or URI
                })
            }).catch(reject); return;
        }
        if(/\.(svg)$/i.test(Item.Path)) { // SVG-in-Spine
            O.file(Item, { Preprocess: true }).then(Item => {
                const StyleSheetRE = /<\?xml-stylesheet\s*(.+?)\s*\?>/g, MatchedStyleSheets = Item.Content.match(StyleSheetRE);
                let StyleSheets = '', Content = Item.Content;
                if(MatchedStyleSheets) StyleSheets = MatchedStyleSheets.map(SS => SS.replace(StyleSheetRE, `<link rel="stylesheet" $1 />`)).join(''), Content = Content.replace(StyleSheetRE, '');
                resolve({
                    Head: (!B.ExtractionPolicy ? `<base href="${ O.fullPath(Item.Path) }" />` : '') + StyleSheets,
                    Body: Content
                });
            }).catch(reject); return;
        }
        resolve({});
    }).then(Source => new Promise(resolve => {
        const DefaultStyleID = 'bibi-default-style';
        if(Source.URL) {
            Item.onload = () => {
                const Head = Item.contentDocument.getElementsByTagName('head')[0];
                const Link = sML.create('link', { rel: 'stylesheet', id: DefaultStyleID, href: Bibi.BookStyleURL, onload: resolve });
                Head.insertBefore(Link, Head.firstChild);
            };
            Item.src = Source.URL;
        } else {
            if(!Item.BlobURL) {
                let HTML = Source.HTML || `<!DOCTYPE html>\n<html><head><meta charset="utf-8" /><title>${ B.FullTitle } - #${ Item.Index + 1 }/${ R.Items.length }</title>${ Source.Head || '' }</head><body>${ Source.Body || '' }</body></html>`;
                HTML = HTML.replace(/(<head(\s[^>]+)?>)/i, `$1<link rel="stylesheet" id="${ DefaultStyleID }" href="${ Bibi.BookStyleURL }" />`);
                if(sML.UA.Trident || sML.UA.EdgeHTML) {
                    // Legacy Microsoft Browsers do not accept DataURIs for src of <iframe>.
                    HTML = HTML.replace('</head>', `<script id="bibi-onload">window.addEventListener('load', function() { parent.R.Items[${ Item.Index }].onLoaded(); return false; });</script></head>`);
                    Item.onLoaded = () => {
                        resolve();
                        const Script = Item.contentDocument.getElementById('bibi-onload');
                        Script.parentNode.removeChild(Script);
                        delete Item.onLoaded;
                    };
                    Item.src = '';
                    ItemBox.insertBefore(Item, ItemBox.firstChild);
                    Item.contentDocument.open();
                    Item.contentDocument.write(HTML);
                    Item.contentDocument.close();
                    return;
                }
                Item.BlobURL = URL.createObjectURL(new Blob([HTML], { type: 'text/html' })), Item.Content = '';
            }
            Item.onload = resolve;
            Item.src = Item.BlobURL;
        }
        ItemBox.insertBefore(Item, ItemBox.firstChild);
    })).then(() => {
        return L.postprocessItem(Item);
    }).then(() => {
        //console.log(Item.src);
        Item.Loaded = true;
        ItemBox.classList.add('loaded');
        E.dispatch('bibi:loaded-item', Item);
        Item.stamp('Loaded');
        return Item;
    }).catch(() => Promise.reject());
};


L.postprocessItem = (Item) => {
    Item.stamp('Postprocess');
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
    if(!O.TouchOS) {
        if(!sML.UA.Gecko) Item.contentDocument.addEventListener('wheel', R.Main.listenWheel, { capture: true, passive: false });
    }
    I.observeTap(Item.HTML);
    Item.HTML.addTapEventListener('tap',         R.onTap);
    Item.HTML.addEventListener(E['pointermove'], R.onPointerMove);
    Item.HTML.addEventListener(E['pointerdown'], R.onPointerDown);
    Item.HTML.addEventListener(E['pointerup'],   R.onPointerUp);
    L.coordinateLinkages(Item.Path, Item.Body);
    const Lv1Eles = Item.contentDocument.querySelectorAll('body>*:not(script):not(style)');
    if(Lv1Eles && Lv1Eles.length == 1) {
        const Lv1Ele = Item.contentDocument.querySelector('body>*:not(script):not(style)');
             if(    /^svg$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleSVG = true;
        else if(    /^img$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleIMG = true;
        else if( /^iframe$/i.test(Lv1Ele.tagName)) Item.Outsourcing =                      true;
        else if(!O.getElementInnerText(Item.Body)) Item.Outsourcing =                      true;
    }
    return (Item.Ref['rendition:layout'] == 'pre-paginated' ? Promise.resolve() : L.patchItemStyles(Item)).then(() => {
        E.dispatch('bibi:postprocessed-item', Item);
        Item.stamp('Postprocessed');
        return Item;
    });
};


L.patchItemStyles = (Item) => new Promise(resolve => { // only for reflowable.
    Item.StyleSheets = [];
    sML.forEach(Item.HTML.querySelectorAll('link, style'))(SSEle => {
        if(/^link$/i.test(SSEle.tagName)) {
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
    //console.log(Item.StyleSheets);
    if(!Item.Preprocessed) {
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


R.initialize = () => {
    R.Main      = O.Body.insertBefore(sML.create('main', { id: 'bibi-main', Transformation: { Scale: 1, TranslateX: 0, TranslateY: 0 } }), O.Body.firstElementChild);
    R.Main.Book =  R.Main.appendChild(sML.create('div',  { id: 'bibi-main-book' }));
  //R.Sub       = O.Body.insertBefore(sML.create('div',  { id: 'bibi-sub' }),  R.Main.nextSibling);
    E.bind('bibi:readied', () => {
        R.Main.listenWheel = (Eve) => {
            if(S.RVM == 'paged') return;
            Eve.preventDefault();
            Eve.stopPropagation();
            R.Main.scrollLeft = R.Main.scrollLeft + Eve.deltaX;
            R.Main.scrollTop  = R.Main.scrollTop  + Eve.deltaY;
        };
        I.observeTap(O.HTML);
        O.HTML.addTapEventListener('tap',         R.onTap);
        O.HTML.addEventListener(E['pointermove'], R.onPointerMove);
        O.HTML.addEventListener(E['pointerdown'], R.onPointerDown);
        O.HTML.addEventListener(E['pointerup'],   R.onPointerUp);
        E.add('bibi:tapped', Eve => {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            switch(S.RVM) {
                case 'horizontal': if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; else break;
                case 'vertical':   if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; else break;
            }
            if(BibiEvent.Target.tagName) {
                if(I.Slider.UI && (I.Slider.contains(BibiEvent.Target) || BibiEvent.Target == I.Slider)) return false;
                if(O.isAnchorContent(BibiEvent.Target)) return false;
            }
            if(I.OpenedSubpanel) return I.OpenedSubpanel.close();
            return BibiEvent.Division.X == 'center' && BibiEvent.Division.Y == 'middle' ? E.dispatch('bibi:tapped-center', Eve) : E.dispatch('bibi:tapped-not-center', Eve);/*
            switch(S.ARD) {
                case 'ttb': return (BibiEvent.Division.Y == 'middle') ? E.dispatch('bibi:tapped-center', Eve) : false;
                default   : return (BibiEvent.Division.X == 'center') ? E.dispatch('bibi:tapped-center', Eve) : false;
            }*/
        });
        E.add('bibi:tapped-center', Eve => {
            if(I.OpenedSubpanel) E.dispatch('bibi:commands:close-utilities',  Eve);
            else                 E.dispatch('bibi:commands:toggle-utilities', Eve);
        });
    });
};


R.resetBibiHeight = () => {
    const WIH = window.innerHeight;
    O.HTML.style.height = O.Body.style.height = WIH + 'px'; // for In-App Browsers
    return WIH;
};


R.resetStage = () => {
    const WIH = R.resetBibiHeight(WIH);
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
    R.Main.style['background'] = S['book-background'] ? S['book-background'] : '';
};


R.layOutSpread = (Spread) => new Promise(resolve => {
    E.dispatch('bibi:is-going-to:reset-spread', Spread);
    //Spread.style.width = Spread.style.height = '';
    Spread.Pages = [];
    R.layOutItem(Spread.Items[0]).then(Item => {
        Item.Pages.forEach(Page => Page.IndexInSpread = Spread.Pages.push(Page) - 1);
        if(Spread.Items.length == 1) return resolve();
        R.layOutItem(Spread.Items[1]).then(Item => {
            Item.Pages.forEach(Page => Page.IndexInSpread = Spread.Pages.push(Page) - 1);
            resolve();
        });
    });
}).then(() => {
    const SpreadSize = { Width: 0, Height: 0 }, SpreadItems = Spread.Items, SpreadBox = Spread.Box;
    Spread.Spreaded = (SpreadItems[0].Spreaded || (SpreadItems[1] && SpreadItems[1].Spreaded)) ? true : false;
    SpreadBox.classList.toggle('spreaded', Spread.Spreaded);
    if(SpreadItems.length == 1) {
        // Single Reflowable/Pre-Paginated Item
        SpreadSize.Width  = SpreadItems[0].Box.offsetWidth;
        SpreadSize.Height = SpreadItems[0].Box.offsetHeight;
        if(Spread.Spreaded && SpreadItems[0].Ref['rendition:layout'] == 'pre-paginated' && /^(left|right)$/.test(SpreadItems[0].Ref['rendition:page-spread'])) {
            // Single Pre-Paginated Spreaded Left/Right Item
            SpreadSize.Width *= 2;
        }
    } else if(SpreadItems[0].Ref['rendition:layout'] == 'pre-paginated' && SpreadItems[1].Ref['rendition:layout'] == 'pre-paginated') {
        // Paired Pre-Paginated Items
        if(Spread.Spreaded || S.RVM != 'vertical') {
            SpreadSize.Width  =          SpreadItems[0].Box.offsetWidth + SpreadItems[1].Box.offsetWidth;
            SpreadSize.Height = Math.max(SpreadItems[0].Box.offsetHeight, SpreadItems[1].Box.offsetHeight);
        } else {
            SpreadSize.Width  = Math.max(SpreadItems[0].Box.offsetWidth,   SpreadItems[1].Box.offsetWidth);
            SpreadSize.Height =          SpreadItems[0].Box.offsetHeight + SpreadItems[1].Box.offsetHeight;
        }
    } else {
        // Paired Items Including Reflowable
        if(S.SLA == 'horizontal') { // if(R.Stage.Width > SpreadItems[0].Box.offsetWidth + SpreadItems[1].Box.offsetWidth) {
            // horizontal layout
            SpreadSize.Width  =          SpreadItems[0].Box.offsetWidth + SpreadItems[1].Box.offsetWidth;
            SpreadSize.Height = Math.max(SpreadItems[0].Box.offsetHeight, SpreadItems[1].Box.offsetHeight);
            if(Bibi.Dev) {
                O.log(`Paired Items incl/Reflowable (Horizontal)`, '<g:>');
                O.log(`[0] w${ SpreadItems[0].Box.offsetWidth }/h${ SpreadItems[0].Box.offsetHeight } %O`, SpreadItems[0]);
                O.log(`[1] w${ SpreadItems[1].Box.offsetWidth }/h${ SpreadItems[1].Box.offsetHeight } %O`, SpreadItems[1]);
                O.log(`-=> w${               SpreadSize.Width }/h${               SpreadSize.Height } %O`, Spread, '</g>');
            }
        } else {
            // vertical layout
            SpreadSize.Width  = Math.max(SpreadItems[0].Box.offsetWidth,   SpreadItems[1].Box.offsetWidth);
            SpreadSize.Height =          SpreadItems[0].Box.offsetHeight + SpreadItems[1].Box.offsetHeight;
            if(Bibi.Dev) {
                O.log(`Paired Items incl/Reflowable (Vertical)`, '<g:>');
                O.log(`[0] w${ SpreadItems[0].Box.offsetWidth }/h${ SpreadItems[0].Box.offsetHeight } %O`, SpreadItems[0]);
                O.log(`[1] w${ SpreadItems[1].Box.offsetWidth }/h${ SpreadItems[1].Box.offsetHeight } %O`, SpreadItems[1]);
                O.log(`-=> w${               SpreadSize.Width }/h${               SpreadSize.Height } %O`, Spread, '</g>');
            }
        }
    }
    if(O.Scrollbars.Height && S.SLA == 'vertical' && S.ARA != 'vertical') {
        SpreadBox.style.minHeight    = S.RVM == 'paged' ?   'calc(100vh - ' + O.Scrollbars.Height + 'px)' : '';
        SpreadBox.style.marginBottom = Spread.Index == R.Spreads.length - 1 ? O.Scrollbars.Height + 'px'  : '';
    } else {
        SpreadBox.style.minHeight = SpreadBox.style.marginBottom = ''
    }
    SpreadBox.style[C.L_SIZE_b] = '', Spread.style[C.L_SIZE_b] = Math.ceil(SpreadSize[C.L_SIZE_B]) + 'px';
    SpreadBox.style[C.L_SIZE_l] =     Spread.style[C.L_SIZE_l] = Math.ceil(SpreadSize[C.L_SIZE_L]) + 'px';
    sML.style(Spread, {
        'border-radius': S['spread-border-radius'],
        'box-shadow':    S['spread-box-shadow']
    });
    E.dispatch('bibi:reset-spread', Spread);
    return Spread;
});


R.layOutItem = (Item) => new Promise(resolve => {
    O.stamp('Reset...', Item.TimeCard);
    E.dispatch('bibi:is-going-to:reset-item', Item);
    Item.Scale = 1;
    //Item.Box.style.width = Item.Box.style.height = Item.style.width = Item.style.height = '';
    (Item.Ref['rendition:layout'] != 'pre-paginated') ? R.renderReflowableItem(Item) : R.renderPrePaginatedItem(Item);
    E.dispatch('bibi:reset-item', Item);
    O.stamp('Reset.', Item.TimeCard);
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
    if(Item.Columned) {
        sML.style(Item.HTML, { 'column-fill': '', 'column-width': '', 'column-gap': '', 'column-rule': '' });
        Item.HTML.classList.remove('bibi-columned');
        if(O.ReverseItemPaginationDirectionIfNecessary && Item.ReversedColumned) {
            Item.HTML.style.direction = '';
            sML.forEach(Item.contentDocument.querySelectorAll('body > *'))(Ele => Ele.style.direction = '');
        }
    }
    Item.WithGutters = false;
    Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0;
    Item.ReversedColumned = false;
    Item.Half = false;
    if(S['double-spread-for-reflowable'] && S.SLA == 'horizontal' && (O.PaginateWithCSSShapes || /-tb$/.test(Item.WritingMode))) {
        const HalfL = Math.floor((PageCL - PageGap) / 2);
        if(HalfL >= Math.floor(PageCB * S['orientation-border-ratio'] / 2)) {
            PageCL = HalfL;
            Item.Half = true;
        }
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
        if(O.PaginateWithCSSShapes) {
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
            const Points = [0, 0];
            for(let i = 1; i < HowManyPages; i++) {
                const   End = (PageCL + PageGap) * i;
                const Start = End - PageGap;
                Points.push(     0), Points.push(Start);
                Points.push(PageCB), Points.push(Start);
                Points.push(PageCB), Points.push(  End);
                Points.push(     0), Points.push(  End);
            }
            if(/^tb-/.test(Item.WritingMode)) Points.reverse();
            const Polygon = [];
            for(let Pt = '', l = Points.length, i = 0; i < l; i++) if(i % 2 == 0) Pt = Points[i] + 'px'; else Polygon.push(Pt + ' ' + Points[i] + 'px');
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
            if(O.ReverseItemPaginationDirectionIfNecessary) {
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
        Bibi.Eyes.unobserve(Page);
        Item.Box.removeChild(Page);
    });
    Item.Pages = [];
    for(let i = 0; i < HowManyPages; i++) {
        const Page = Item.Box.appendChild(sML.create('span', { className: 'page' }));
        //Page.style[C.L_SIZE_l] = (PageCL + ItemPaddingBA) + 'px';//R.Stage[C.L_SIZE_L] + 'px';
        Page.Item = Item, Page.Spread = Item.Spread;
        Page.IndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
        Bibi.Eyes.observe(Page);
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
        (Item.Ref['rendition:spread'] == 'both' || R.Orientation == Item.Ref['rendition:spread'] || R.Orientation == 'landscape')
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
                Width:  ItemLoVp.Width * (/^(left|right)$/.test(Item.Ref['rendition:page-spread']) ? 2 : 1),
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
    Width:  R.Stage.Height * S['orientation-border-ratio'] / (/*Item.Spreaded &&*/ /^(left|right)$/.test(Item.Ref['rendition:page-spread']) ? 2 : 1),
    Height: R.Stage.Height
};


R.turnSpreads = (Opt = {}) => new Promise(resolve => {
    if(!S['allow-placeholders']) return resolve();
    const Range     = [-1, 2];
    const Direction = (R.ScrollHistory.length > 1) && (R.ScrollHistory[1] * C.L_AXIS_D > R.ScrollHistory[0] * C.L_AXIS_D) ? -1 : 1;
    const Origin = Opt.Origin || (
        R.Current.List.length      ? (Direction > 0 ?      R.Current.List.slice(-1) :      R.Current.List)[0].Page.Spread :
        R.IntersectingPages.length ? (Direction > 0 ? R.IntersectingPages.slice(-1) : R.IntersectingPages)[0     ].Spread :
        null
    );
    if(!Origin) return resolve();
    const Promises = [];
    const SpreadsToBeTurnedFaceUp = []; /* <== */ for(let i = Range[0]; i <= Range[1]; i++) {
        const Spread = R.Spreads[Origin.Index + i * Direction]; if(!Spread) continue;
        if(Spread.Turned != 'Up' && Spread.Turning != 'Up') {
            clearTimeout(Spread.Timer_TurningFaceUp);
            SpreadsToBeTurnedFaceUp.push(Spread);
        }
    }//*
    const MinimumTurning = 2;//Math.random() < 0.25 ? 2 : 1;
    while(SpreadsToBeTurnedFaceUp.length < MinimumTurning) {
        const i = ++Range[1]; if(i > 9) break;
        const Spread = R.Spreads[Origin.Index + i * Direction]; if(!Spread) break;
        if(Spread.Turned != 'Up' && Spread.Turning != 'Up') {
            clearTimeout(Spread.Timer_TurningFaceUp);
            SpreadsToBeTurnedFaceUp.push(Spread);
        }
    }//*/
    const SpreadsThatMustBeTurnedFaceUpAlreadyButNotYet = []; /* <== */ if(R.turnSpreads.SpreadsTurnedFaceUp) R.turnSpreads.SpreadsTurnedFaceUp.forEach(Spread => {
        if(Spread.Turned != 'Up' && Spread.Turning != 'Up' && !SpreadsToBeTurnedFaceUp.includes(Spread)) {
            clearTimeout(Spread.Timer_TurningFaceUp);
            setTimeout(() => R.turnSpread(Spread, false), 0);
            SpreadsThatMustBeTurnedFaceUpAlreadyButNotYet.push(Spread);
        }
    });
    R.turnSpreads.SpreadsTurnedFaceUp = []; /* <== */ [SpreadsToBeTurnedFaceUp, SpreadsThatMustBeTurnedFaceUpAlreadyButNotYet].forEach((Spreads, i) => Spreads.forEach((Spread, j) => {
        const ItemLength = Spread.Items.length;
        if(Spread == Origin || i + j == 0)   Promises.push(R.turnSpread(Spread, true));
        else Spread.Timer_TurningFaceUp = setTimeout(() => R.turnSpread(Spread, true), 88 * (i + j * 0.1));
        R.turnSpreads.SpreadsTurnedFaceUp.push(Spread);
    }));/*
    console.log(
        R.turnSpreads.SpreadsTurnedFaceUp.length + '(' + SpreadsToBeTurnedFaceUp.length + '+' + SpreadsThatMustBeTurnedFaceUpAlreadyButNotYet.length + ')',
        R.turnSpreads.SpreadsTurnedFaceUp.map(Sd => 'Sp:' + Sd.Index + '/pp' + Sd.Pages.map(Pg => Pg.Index + 1).join('-'))
    );*/
    (Promises.length ? Promise.all(Promises) : Promise.resolve()).then(resolve);
});

    R.turnSpread = (Spread, TF) => new Promise(resolve => { // !!!! Don't Call Directly. Use R.turnSpreads. !!!!
        Spread.Turning = TF ? 'Up' : 'Down';
        Spread.Turned  = false;
        const AllowPlaceholderItems = !(TF);
        if(!S['allow-placeholders'] || Spread.AllowPlaceholderItems == AllowPlaceholderItems) return resolve(); // no need to turn
        /* DEBUG */ if(Bibi.Debug && TF) sML.style(Spread.Box, { transition: '' }, { background: 'rgba(255,0,0,0.5)' });
        const PreviousSpreadBoxLength = Spread.Box['offset' + C.L_SIZE_L];
        const OldPages = Spread.Pages.reduce((OldPages, OldPage) => { OldPages.push(OldPage); return OldPages; }, []);
        if(!TF) {
            R.cancelSpreadRetlieving(Spread);
            //Spread.Items.forEach(Item => console.log('Canceled Retlieving for: %O', Item));
        }
        L.loadSpread(Spread, { AllowPlaceholderItems: AllowPlaceholderItems }).then(Spread => {
            resolve(); // ←↙ do asynchronous
            R.layOutSpread(Spread).then(() => {
                if(!Spread.PrePaginated) R.replacePages(OldPages, Spread.Pages);
                const ChangedSpreadBoxLength = Spread.Box['offset' + C.L_SIZE_L] - PreviousSpreadBoxLength;
                if(ChangedSpreadBoxLength != 0) R.Main.Book.style[C.L_SIZE_l] = (parseFloat(getComputedStyle(R.Main.Book)[C.L_SIZE_l]) + ChangedSpreadBoxLength) + 'px';
            });
        }).catch(Spread => resolve());
    }).then(() => {
        /* DEBUG */ if(Bibi.Debug && TF) sML.style(Spread.Box, { transition: 'background linear .5s' }, { background: '' });
        Spread.Turning = false;
        Spread.Turned  = TF ? 'Up' : 'Down';
    });

    R.cancelSpreadRetlieving = (Spread) => O.RangeLoader ? Spread.Items.forEach(Item => {
        if(Item.ResItems) Item.ResItems.forEach(ResItem => O.cancelExtraction(ResItem));
        O.cancelExtraction(Item);
    }) : false;


R.organizePages = () => {
    const NewPages = [];
    R.Spreads.forEach(Spread => Spread.Pages.forEach(Page => { Page.Index = NewPages.length; NewPages.push(Page); /* Page.id = 'page-' + (Page.Index + 1 + '').padStart(B.FileDigit, 0); */ }));
    return R.Pages = NewPages;
};


R.replacePages = (OldPages, NewPages) => {
    const StartIndex = OldPages[0].Index, OldLength = OldPages.length, NewLength = NewPages.length;
    NewPages.forEach((NewPage, i) => NewPage.Index = StartIndex + i);
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


R.layOut = (Opt) => new Promise((resolve, reject) => {
    // Opt: {
    //     Destination: BibiDestination,
    //     Reset: Boolean, (default: false)
    //     DoNotCloseUtilities: Boolean, (default: false)
    //     Setting: BibiSetting,
    //     before: Function
    // }
    if(R.LayingOut) return reject();
    R.ScrollHistory = [];
    R.LayingOut = true;
    O.log(`Laying out...`, '<g:>');
    if(Opt) O.log(`Option: %O`, Opt); else Opt = {};
    if(!Opt.DoNotCloseUtilities) E.dispatch('bibi:closes-utilities');
    E.dispatch('bibi:is-going-to:lay-out', Opt);
    window.removeEventListener(E['resize'], R.onResize);
    R.Main.removeEventListener('scroll', R.onScroll);
    O.Busy = true;
    O.HTML.classList.add('busy');
    O.HTML.classList.add('laying-out');
    if(!Opt.NoNotification) I.note(`Laying out...`);
    if(!Opt.Destination) {
        const CurrentPage = R.Current.List.length ? R.Current.List[0].Page : R.Pages[0];
        Opt.Destination = { SpreadIndex: CurrentPage.Spread.Index, PageProgressInSpread: CurrentPage.IndexInSpread / CurrentPage.Spread.Pages.length }
    }
    if(Opt.Setting) S.update(Opt.Setting);
    const Layout = {}; ['reader-view-mode', 'spread-layout-direction', 'apparent-reading-direction'].forEach(Pro => Layout[Pro] = S[Pro]);
    O.log(`Layout: %O`, Layout);
    if(typeof Opt.before == 'function') Opt.before();
    if(!Opt.Reset) {
        resolve();
    } else {
        R.resetStage();
        const Promises = [];
        R.Spreads.forEach(Spread => Promises.push(R.layOutSpread(Spread)));
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
    window.addEventListener(E['resize'], R.onResize);
    R.Main.addEventListener('scroll', R.onScroll);
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


R.ScrollHistory = [];

R.onScroll = (Eve) => {
    if(!L.Opened) return;
    if(!R.Scrolling) {
        R.Scrolling = true;
        O.HTML.classList.add('scrolling');
    }
    E.dispatch('bibi:scrolls');
    R.ScrollHistory.unshift(R.Main['scroll' + C.L_OOBL_L]);
    if(R.ScrollHistory.length > 2) R.ScrollHistory.pop();
    if(++R.onScroll.Count == 8) {
        R.onScroll.Count = 0;
        E.dispatch('bibi:scrolled');
    }
    clearTimeout(R.Timer_onScrollEnd);
    R.Timer_onScrollEnd = setTimeout(() => {
        R.Scrolling = false;
        R.onScroll.Count = 0;
        O.HTML.classList.remove('scrolling');
        E.dispatch('bibi:scrolled');
    }, 123);
};

    R.onScroll.Count = 0;


R.onResize = (Eve) => {
    if(!L.Opened) return;
    if(!R.Resizing) {
        R.Resizing = true;
        //R.FirstIntersectingPageBeforeResizing = R.IntersectingPages[0];
        //R.onResize.TargetPageAfterResizing = R.Current.List && R.Current.List[0] && R.Current.List[0].Page ? R.Current.List[0].Page : R.IntersectingPages[0];
        R.onResize.TargetPageAfterResizing = R.Current.List[0] ? R.Current.List[0].Page : null;
        ////////R.Main.removeEventListener('scroll', R.onScroll);
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.add('resizing');
    };
    clearTimeout(R.Timer_onResizeEnd);
    R.Timer_onResizeEnd = setTimeout(() => {
        R.updateOrientation();
        const Page = R.onResize.PageAfterResizing;
        R.layOut({
            Reset: true,
            Destination: Page ? { SpreadIndex: Page.Spread.Index, PageProgressInSpread: Page.IndexInSpread / Page.Spread.Pages.length } : null
        }).then(() => {
            E.dispatch('bibi:resized', Eve);
            O.HTML.classList.remove('resizing');
            O.HTML.classList.remove('busy');
            O.Busy = false;
            ////////R.Main.addEventListener('scroll', R.onScroll);
            //R.onScroll();
            R.Resizing = false;
        });
    }, sML.UA.Trident ? 1200 : O.TouchOS ? 600 : 300);
};


R.onTap = (Eve) => {
    E.dispatch('bibi:taps',   Eve);
    E.dispatch('bibi:tapped', Eve);
};


R.PreviousPointerCoord = { X: 0, Y: 0 };

R.onPointerMove = (Eve) => {
    const CC = O.getBibiEventCoord(Eve), PC = R.PreviousPointerCoord;
    if(PC.X != CC.X || PC.Y != CC.Y) E.dispatch('bibi:moved-pointer',   Eve);
    else                             E.dispatch('bibi:stopped-pointer', Eve);
    R.PreviousPointerCoord = CC;
    //Eve.preventDefault();
    Eve.stopPropagation();
};

R.onPointerDown = (Eve) => {
    E.dispatch('bibi:downs-pointer',  Eve);
    R.PointerIsDowned = true;
    E.dispatch('bibi:downed-pointer', Eve);
};

R.onPointerUp = (Eve) => {
    E.dispatch('bibi:ups-pointer',   Eve);
    R.PointerIsDowned = false;
    E.dispatch('bibi:upped-pointer', Eve);
};


R.changeView = (Par, Opt = {}) => {
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
            R.layOut({
                Reset: true,
                NoNotification: Opt.NoNotification,
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
    if(S['keep-settings']) O.Biscuits.memorize('Book', { 'RVM': Par.Mode });
};


R.Current = { List: [], Frame: {} };

R.updateCurrent = () => {
    const Frame = {};
    Frame.Length = R.Main['offset' + C.L_SIZE_L];
    Frame[C.L_OOBL_L                              ] = R.Main['scroll' + C.L_OOBL_L];
    Frame[C.L_OOBL_L == 'Top' ? 'Bottom' : 'Right'] = Frame[C.L_OOBL_L] + Frame.Length;
    //if(R.Current.List.length && Frame[C.L_BASE_B] == R.Current.Frame.Before && Frame[C.L_BASE_A] == R.Current.Frame.After) return R.Current;
    R.Current.Frame = { Before: Frame[C.L_BASE_B], After: Frame[C.L_BASE_A], Length: Frame.Length };
    const CurrentList = R.updateCurrent.getList();
    if(CurrentList) {
        R.Current.List = CurrentList;
        R.updateCurrent.classify();
    }
    return R.Current;
};

    R.updateCurrent.getList = () => {
        let List = [], List_SpreadContained = [];
        let PageList = undefined;
        const QSW = Math.ceil(R.Stage.Width / 4), QSH = Math.ceil(R.Stage.Height / 4), CheckRoute = [5, 6, 4, 2, 8];
        for(let l = CheckRoute.length, i = 0; i < l; i++) { const CheckPoint = CheckRoute[i];
            const Ele = document.elementFromPoint(QSW * (CheckPoint % 3 || 3), QSH * Math.ceil(CheckPoint / 3));
            if(Ele) {
                     if(Ele.IndexInItem) PageList = [Ele];
                else if(Ele.Pages)       PageList = Ele.Pages;
                else if(Ele.Content)     PageList = Ele.Content.Pages;
            }
            if(PageList) break;
        }
        if(!PageList && R.IntersectingPages.length) PageList = R.IntersectingPages;
        if(!PageList || !PageList[0] || typeof PageList[0].Index != 'number') return null;
        const FirstIndex = sML.limitMin(PageList[                  0].Index - 2,                  0);
        const  LastIndex = sML.limitMax(PageList[PageList.length - 1].Index + 2, R.Pages.length - 1);
        for(let BiggestPageIntersectionRatio = 0, i = FirstIndex; i <= LastIndex; i++) { const Page = R.Pages[i];
            const PageIntersectionStatus = R.updateCurrent.getIntersectionStatus(Page, 'WithDetail');
            if(PageIntersectionStatus.Ratio < BiggestPageIntersectionRatio) {
                if(List.length) break;
            } else {
                const Current = { Page: Page, PageIntersectionStatus: PageIntersectionStatus };
                if(List.length) {
                    const Prev = List[List.length - 1];
                    if(Prev.Page.Item   == Page.Item  )   Current.ItemIntersectionStatus =   Prev.ItemIntersectionStatus;
                    if(Prev.Page.Spread == Page.Spread) Current.SpreadIntersectionStatus = Prev.SpreadIntersectionStatus;
                }
                if(  !Current.ItemIntersectionStatus)   Current.ItemIntersectionStatus = R.updateCurrent.getIntersectionStatus(Page.Item.Box); // Item is scaled.
                if(!Current.SpreadIntersectionStatus) Current.SpreadIntersectionStatus = R.updateCurrent.getIntersectionStatus(Page.Spread);   // SpreadBox has margin.
                if(Current.SpreadIntersectionStatus.Ratio == 1) List_SpreadContained.push(Current);
                if(PageIntersectionStatus.Ratio > BiggestPageIntersectionRatio) List   = [Current], BiggestPageIntersectionRatio = PageIntersectionStatus.Ratio;
                else                                                            List.push(Current);
            }
        }
        return List_SpreadContained.length ? List_SpreadContained : List.length ? List : null;
    };

    R.updateCurrent.getIntersectionStatus = (Ele, WithDetail) => {
        const Coord = sML.getCoord(Ele), _D = C.L_AXIS_D;
        const LengthInside = Math.min(R.Current.Frame.After * _D, Coord[C.L_BASE_A] * _D) - Math.max(R.Current.Frame.Before * _D, Coord[C.L_BASE_B] * _D);
        const Ratio = (LengthInside <= 0 || !Coord[C.L_SIZE_L] || isNaN(LengthInside)) ? 0 : LengthInside / Coord[C.L_SIZE_L];
        const IntersectionStatus = { Ratio: Ratio };
        if(Ratio <= 0) {} else if(WithDetail) {
            if(Ratio >= 1) {
                IntersectionStatus.Contained = true;
            } else {
                const FC_B = R.Current.Frame.Before * _D, FC_A = R.Current.Frame.After * _D;
                const PC_B = Coord[C.L_BASE_B]      * _D, PC_A = Coord[C.L_BASE_A]     * _D;
                     if(FC_B <  PC_B        ) IntersectionStatus.Entering = true;
                else if(FC_B == PC_B        ) IntersectionStatus.Headed   = true;
                else if(        PC_A == FC_A) IntersectionStatus.Footed   = true;
                else if(        PC_A <  FC_A) IntersectionStatus.Passing  = true;
                if(R.Main['offset' + L] < Coord[C.L_SIZE_L]) IntersectionStatus.Oversize = true;
            }
        }
        return IntersectionStatus;
    };

    R.updateCurrent.classify = () => {
        const CurrentElements = [], PastCurrentElements = R.Main.Book.querySelectorAll('.current');
        R.Current.List.forEach(Current => {
            const Page = Current.Page, ItemBox = Page.Item.Box, SpreadBox = Page.Spread.Box;
            if(!CurrentElements.includes(SpreadBox)) SpreadBox.classList.add('current'), CurrentElements.push(SpreadBox);
            if(!CurrentElements.includes(  ItemBox))   ItemBox.classList.add('current'), CurrentElements.push(  ItemBox);
            Page.classList.add('current'), CurrentElements.push(Page);
        });
        sML.forEach(PastCurrentElements)(PastCurrentElement => {
            if(!CurrentElements.includes(PastCurrentElement)) {
                PastCurrentElement.classList.remove('current');
            }
        });
    };


R.focusOn = (Par) => new Promise((resolve, reject) => {
    if(R.Moving) return reject();
    if(!Par) return reject();
    if(typeof Par == 'number') Par = { Destination: Par };
    Par.Destination = R.hatchDestination(Par.Destination);
    if(!Par.Destination) return reject();
    E.dispatch('bibi:is-going-to:focus-on', Par);
    R.Moving = true;
    Par.FocusPoint = 0;
    if(S['book-rendition-layout'] == 'reflowable') {
        Par.FocusPoint = O.getElementCoord(Par.Destination.Page)[C.L_AXIS_L];
        if(Par.Destination.Side == 'after') Par.FocusPoint += (Par.Destination.Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
        if(S.SLD == 'rtl') Par.FocusPoint += Par.Destination.Page.offsetWidth - R.Stage.Width;
    } else {
        if(S['allow-placeholders'] && Par.Turn != false) R.turnSpreads({ Origin: Par.Destination.Page.Spread });
        if(R.Stage[C.L_SIZE_L] >= Par.Destination.Page.Spread['offset' + C.L_SIZE_L]) {
            Par.FocusPoint = O.getElementCoord(Par.Destination.Page.Spread)[C.L_AXIS_L];
            Par.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - Par.Destination.Page.Spread['offset' + C.L_SIZE_L]) / 2);
        } else {
            Par.FocusPoint = O.getElementCoord(Par.Destination.Page)[C.L_AXIS_L];
            if(R.Stage[C.L_SIZE_L] > Par.Destination.Page['offset' + C.L_SIZE_L]) Par.FocusPoint -= Math.floor((R.Stage[C.L_SIZE_L] - Par.Destination.Page['offset' + C.L_SIZE_L]) / 2);
            else if(Par.Destination.Side == 'after') Par.FocusPoint += (Par.Destination.Page['offset' + C.L_SIZE_L] - R.Stage[C.L_SIZE_L]) * C.L_AXIS_D;
        }
    }
    if(typeof Par.Destination.TextNodeIndex == 'number') R.selectTextLocation(Par.Destination); // Colorize Destination with Selection
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[C.L_AXIS_L] = Par.FocusPoint; if(!S['use-full-height'] && S.RVM == 'vertical') ScrollTarget.Y -= I.Menu.Height;
    return sML.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: typeof Par.Duration == 'number' ? Par.Duration : (S.SLA == S.ARA && (S.RVM != 'paged' || S['animate-page-flipping'])) ? 222 : 0,
        Easing: (Pos) => (Pos === 1) ? 1 : Math.pow(2, -10 * Pos) * -1 + 1
    }).then(() => {
        R.Moving = false;
        resolve(Par.Destination);
        E.dispatch('bibi:focused-on', Par);
        //console.log(`FOCUSED`);
    });
}).catch(() => Promise.resolve());

    R.hatchDestination = (Dest) => {
        if(!Dest) return null;
        if(Dest.Page) return Dest;
        if(typeof Dest == 'number' || (typeof Dest == 'string' && /^\d+$/.test(Dest))) {
            Dest = R.getBibiToDestination(Dest);
        } else if(typeof Dest == 'string') {
                 if(Dest == 'head' || Dest == 'foot') Dest = { Edge: Dest };
            else if(X['EPUBCFI'])                     Dest = X['EPUBCFI'].getDestination(Dest);
        } else if(Dest.tagName) {
            if(typeof Dest.IndexInItem == 'number') return { Page: Dest }; // Page
            if(typeof Dest.Index       == 'number') return { Page: Dest.Pages[0] }; // Item or Spread
            Dest = { Element: Dest };
        }
        Dest.Page = R.hatchPage(Dest);
        return Dest;
    };

    R.hatchPage = (Dest) => {
        if(Dest.Page) return Dest.Page;
        if(Dest.Edge == 'head') return R.Pages[0];
        if(Dest.Edge == 'foot') return R.Pages[R.Pages.length - 1];
        if(typeof Dest.PageIndex    == 'number') return R.Pages[Dest.PageIndex];
        if(typeof Dest.PageProgressInSpread != 'number' && typeof Dest.SpreadIndex != 'number' && !Dest.Spread && typeof Dest['SI-PPiS'] == 'string') [Dest.SpreadIndex, Dest.PageProgressInSpread] = Dest['SI-PPiS'].split('-').map(Num => Num * 1);
        try {
            if(typeof    Dest.PageIndexInItem   == 'number') return R.hatchItem(Dest).Pages[Dest.PageIndexInItem];
            if(typeof    Dest.PageIndexInSpread == 'number') return R.hatchSpread(Dest).Pages[Dest.PageIndexInSpread];
            if(typeof Dest.PageProgressInSpread == 'number') return (DestSpread => DestSpread.Pages[Math.floor(DestSpread.Pages.length * Dest.PageProgressInSpread)])(R.hatchSpread(Dest));
            if(typeof Dest.ElementSelector == 'string') Dest.Element = R.hatchItem(Dest).contentDocument.querySelector(Dest.ElementSelector);
            if(Dest.Element) return R.hatchNearestPageOfElement(Dest.Element);
            return (R.hatchItem(Dest) || R.hatchSpread(Dest)).Pages[0];
        } catch(_) {}
        return null;
    };

        R.hatchItem = (Dest) => {
            if(Dest.Item) return Dest.Item;
            if(typeof Dest.ItemIndex == 'number') return R.Items[Dest.ItemIndex];
            if(typeof Dest.ItemIndexInSpine == 'number') return B.Package.Spine.Items[Dest.ItemIndexInSpine];
            if(typeof Dest.ItemIndexInSpread == 'number') try { return R.hatchSpread(Dest).Items[Dest.ItemIndexInSpread]; } catch(_) { return null; }
            //if(Dest.Element && Dest.Element.ownerDocument.body.Item && Dest.Element.ownerDocument.body.Item.Pages) return Dest.Element.ownerDocument.body.Item;
            return null;
        };

        R.hatchSpread = (Dest) => {
            if(Dest.Spread) return Dest.Spread;
            if(typeof Dest.SpreadIndex == 'number') return R.Spreads[Dest.SpreadIndex];
            return null;
        };

        R.hatchNearestPageOfElement = (Ele) => {
            if(!Ele || !Ele.tagName) return null;
            const Item = Ele.ownerDocument.body.Item;
            if(!Item) return null;
            let NearestPage, ElementCoordInItem;
            if(Item.Columned) {
                sML.style(Item.HTML, { 'column-width': '' });
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_B];
                if(S.PPD == 'rtl' && S.SLA == 'vertical') ElementCoordInItem = Item.offsetWidth - (S['item-padding-left'] + S['item-padding-right']) - ElementCoordInItem - Ele.offsetWidth;
                sML.style(Item.HTML, { 'column-width': Item.ColumnLength + 'px' });
                NearestPage = Item.Pages[Math.ceil(ElementCoordInItem / Item.ColumnBreadth)];
            } else {
                ElementCoordInItem = O.getElementCoord(Ele)[C.L_AXIS_L];
                if(S.SLD == 'rtl' && S.SLA == 'horizontal') ElementCoordInItem = Item.HTML.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
                NearestPage = Item.Pages[0];
                for(let l = Item.Pages.length, i = 0; i < l; i++) {
                    ElementCoordInItem -= Item.Pages[i]['offset' + C.L_SIZE_L];
                    if(ElementCoordInItem <= 0) {
                        NearestPage = Item.Pages[i];
                        break;
                    }
                }
            }
            return NearestPage;
        };


R.getBibiToDestination = (BibitoString) => {
    if(typeof BibitoString == 'number') BibitoString = '' + BibitoString;
    if(typeof BibitoString != 'string' || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(BibitoString)) return null;
    let ElementSelector = '', InE = BibitoString.split('-'), ItemIndexInSpine = parseInt(InE[0]) - 1, ElementIndex = InE[1] ? InE[1] : null;
    if(ElementIndex) ElementIndex.split('.').forEach(Index => ElementSelector += '>*:nth-child(' + Index + ')');
    return {
        ItemIndexInSpine: ItemIndexInSpine,
        ElementSelector: (ElementSelector ? 'body' + ElementSelector : undefined)
    };
};


R.selectTextLocation = (Dest) => {
    if(typeof Dest.TextNodeIndex != 'number' || !Dest.Element) return false;
    const DestNode = Dest.Element.childNodes[Dest.TextNodeIndex];
    if(!DestNode || !DestNode.textContent) return;
    const Sides = { Start: { Node: DestNode, Index: 0 }, End: { Node: DestNode, Index: DestNode.textContent.length } };
    if(Dest.TermStep) {
        if(Dest.TermStep.Preceding || Dest.TermStep.Following) {
            Sides.Start.Index = Dest.TermStep.Index, Sides.End.Index = Dest.TermStep.Index;
            if(Dest.TermStep.Preceding) Sides.Start.Index -= Dest.TermStep.Preceding.length;
            if(Dest.TermStep.Following)   Sides.End.Index += Dest.TermStep.Following.length;
            if(Sides.Start.Index < 0 || DestNode.textContent.length < Sides.End.Index) return;
            if(DestNode.textContent.substr(Sides.Start.Index, Sides.End.Index - Sides.Start.Index) != Dest.TermStep.Preceding + Dest.TermStep.Following) return;
        } else if(Dest.TermStep.Side && Dest.TermStep.Side == 'a') {
            Sides.Start.Node = DestNode.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
            Sides.End.Index = Dest.TermStep.Index - 1;
        } else {
            Sides.Start.Index = Dest.TermStep.Index;
            Sides.End.Node = DestNode.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
            Sides.End.Index = Sides.End.Node.textContent.length;
        }
    }
    return sML.Ranges.selectRange(sML.Ranges.getRange(Sides));
};


R.moveBy = (Par) => new Promise((resolve, reject) => {
    if(R.Moving || !L.Opened) return reject();
    if(!Par) return reject();
    if(typeof Par == 'number') Par = { Distance: Par };
    if(!Par.Distance || typeof Par.Distance != 'number') return reject();
    Par.Distance *= 1;
    if(Par.Distance == 0 || isNaN(Par.Distance)) return reject();
    Par.Distance = Par.Distance < 0 ? -1 : 1;
    E.dispatch('bibi:is-going-to:move-by', Par);
    const Current = (Par.Distance > 0 ? R.Current.List.slice(-1) : R.Current.List)[0], CurrentPage = Current.Page, CurrentItem = CurrentPage.Item;
    let Promised = {};
    if(
        true ||
        R.Columned ||
        S.BRL == 'pre-paginated' ||
        S.BRL == 'reflowable' && S.RVM == 'paged' ||
        CurrentItem.Ref['rendition:layout'] == 'pre-paginated' ||
        CurrentItem.Outsourcing ||
        CurrentItem.Pages.length == 1 ||
        Par.Distance < 0 && CurrentPage.IndexInItem == 0 ||
        Par.Distance > 0 && CurrentPage.IndexInItem == CurrentItem.Pages.length - 1
    ) {
        let Side = Par.Distance > 0 ? 'before' : 'after';
        if(Current.PageIntersectionStatus.Oversize) {
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
        ForceScroll: true,
        Duration: (S.RVM != 'paged' && S.SLA == S.ARA) ? 100 : 0
    }).then(() => {
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
    I.Notifier.create();
    I.Veil.create();
    E.bind('bibi:readied', () => {
        I.Catcher.create();
        I.Menu.create();
        I.Panel.create();
        I.Help.create();
        I.PoweredBy.create();
        I.FontSizeChanger.create();
        I.Loupe.create();
    });
    E.bind('bibi:prepared', () => {
        I.Nombre.create();
        I.Slider.create();
        I.Turner.create();
        I.Arrows.create();
        I.SwipeListener.create();
        I.KeyListener.create();
        I.Spinner.create();
    });
    E.bind('bibi:initialized-book', () => {
        I.BookmarkManager.create();
    });
    I.Utilities = I.setToggleAction({}, {
        onopened: () => E.dispatch('bibi:opens-utilities'),
        onclosed: () => E.dispatch('bibi:closes-utilities')
    });
    E.add('bibi:commands:open-utilities',   () => I.Utilities.open());
    E.add('bibi:commands:close-utilities',  () => I.Utilities.close());
    E.add('bibi:commands:toggle-utilities', () => I.Utilities.toggle());
};


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
            if(typeof Time == 'undefined') Time = O.Busy ? 9999 : 2222;
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
        onopened:  function() {
            O.HTML.classList.add('veil-opened');
            this.classList.remove('closed');
        },
        onclosed: function() {
            this.classList.add('closed');
            O.HTML.classList.remove('veil-opened');
        }
    });
    Veil.open();
    const PlayButtonTitle = (O.TouchOS ? 'Tap' : 'Click') + ' to Open';
    Veil.PlayButton = Veil.appendChild(
        sML.create('p', { id: 'bibi-veil-play', title: PlayButtonTitle,
            innerHTML: `<span class="non-visual">${ PlayButtonTitle }</span>`,
            play: (Eve) => {
                Eve.stopPropagation();
                L.play();
                //M.post('bibi:play:button:' + location.href);
                E.dispatch('bibi:played:by-button');
            },
            hide: function() {
                sML.style(this, {
                    opacity: 0,
                    cursor: 'default'
                }).then(Eve => this.parentNode.removeChild(this));
            },
            on: {
                click: function(Eve) { this.play(Eve); }
            }
        })
    );
    E.add('bibi:played', () => Veil.PlayButton.hide());
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


I.Catcher = { create: () => { if(S['book'] || S.BookDataElement || !S['accept-local-file']) return;
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
}};


I.Menu = { create: () => {
    if(!S['use-menubar']) O.HTML.classList.add('without-menubar');
    const Menu = I.Menu = O.Body.appendChild(sML.create('div', { id: 'bibi-menu' }, I.Menu)); delete Menu.create;
    //Menu.addEventListener('click', Eve => Eve.stopPropagation());
    I.setHoverActions(Menu);
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
                E.dispatch(Menu, 'bibi:hovers', Eve);
            } else if(Menu.Hover) {
                Menu.Timer_close = setTimeout(() => E.dispatch(Menu, 'bibi:unhovers', Eve), 123);
            }
        });
        if(!sML.UA.Gecko) Menu.addEventListener('wheel', R.Main.listenWheel, { capture: true, passive: false });
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
                Labels: { default: { default: `View Mode`, ja: `表示モード` } },
                ButtonGroups: [{
                    ButtonType: 'radio',
                    Buttons: [{
                        Mode: 'paged',
                        Labels: { default: { default: `Paged <small>(Flip with ${ O.TouchOS ? 'Tap/Swipe' : 'Click/Wheel' })</small>`, ja: `ページ単位<small>（${ O.TouchOS ? 'タップ／スワイプ' : 'クリック／ホイール' }で移動）</small>` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">${ SSs }</span></span>`
                    }, {
                        Mode: 'horizontal',
                        Labels: { default: { default: `Horizontal Scroll`, ja: `横スクロール` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">${ SSs }</span></span>`
                    }, {
                        Mode: 'vertical',
                        Labels: { default: { default: `Vertical Scroll`, ja: `縦スクロール` } },
                        Icon: `<span class="bibi-icon bibi-icon-view bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">${ SSs }</span></span>`
                    }].map(Button => sML.edit(Button, {
                        Notes: true,
                        action: () => R.changeView(Button, { NoNotification: true })
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
                            if(S['keep-settings']) O.Biscuits.memorize('Book', { 'FBL': S['full-breadth-layout-in-scroll'] });
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
    /*
    Panel.Labels = {
        default: { default: `Opoen this Index`, ja: `この目次を開く`   },
        active:  { default: `Close this Index`, ja: `この目次を閉じる` }
    };
    */
    I.setFeedback(Panel, { StopPropagation: true });
    Panel.addTapEventListener('tapped', () => E.dispatch('bibi:commands:toggle-panel'));
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
    if(S['use-font-size-changer'] && S['keep-settings']) {
        const BibiBiscuits = O.Biscuits.remember('Bibi');
        if(BibiBiscuits && BibiBiscuits.FontSize && BibiBiscuits.FontSize.Step != undefined) FontSizeChanger.Step = BibiBiscuits.FontSize.Step * 1;
    }
    if(typeof FontSizeChanger.Step != 'number' || FontSizeChanger.Step < -2 || 2 < FontSizeChanger.Step) FontSizeChanger.Step = 0;
    E.bind('bibi:postprocessed-item', Item => { if(Item.Ref['rendition:layout'] == 'pre-paginated') return false;
        Item.changeFontSize = (FontSize) => {
            if(Item.FontSizeStyleRule) sML.deleteCSSRule(Item.contentDocument, Item.FontSizeStyleRule);
            Item.FontSizeStyleRule = sML.appendCSSRule(Item.contentDocument, 'html', 'font-size: ' + FontSize + 'px !important;');
        };
        Item.changeFontSizeStep = (Step) => Item.changeFontSize(Item.FontSize.Base * Math.pow(S['font-size-scale-per-step'], Step));
        Item.FontSize = {
            Default: getComputedStyle(Item.HTML).fontSize.replace(/[^\d]*$/, '') * 1
        };
        Item.FontSize.Base = Item.FontSize.Default;
        if(Item.Preprocessed && (sML.UA.Chrome || sML.UA.Trident)) {
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
        if(S['use-font-size-changer'] && S['keep-settings']) {
            O.Biscuits.memorize('Book', { 'FontSize': { 'Step': Step } });
        }
        setTimeout(() => {
            R.layOut({
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
                action: changeFontSizeStep, Step: 2
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Large`,                           ja: `<span class="non-visual-in-label">文字サイズ：</span>大` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-large"></span>`,
                action: changeFontSizeStep, Step: 1
            }, {
                Labels: { default: { default: `<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>`, ja: `<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>` } },
                Icon: `<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-medium"></span>`,
                action: changeFontSizeStep, Step: 0
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
    if(S['loupe-max-scale'] <= 2) S['loupe-max-scale'] = 4;
    const Loupe = I.Loupe = {
        scale: (Scl, BibiEvent) => { // Scl: Scale
            if(typeof Scl != 'number') return false;
            const CurrentTfm = R.Main.Transformation;
            Scl = Math.round(Scl * 100) / 100;
            if(Scl == CurrentTfm.Scale) return;
            E.dispatch('bibi:changes-scale', Scl);
                 if(Scl <  1) Loupe.transform({ Scale: Scl, TranslateX: R.Main.offsetWidth * (1 - Scl) / 2, TranslateY: R.Main.offsetHeight * (1 - Scl) / 2 });
            else if(Scl == 1) Loupe.transform({ Scale:   1, TranslateX: 0,                                  TranslateY: 0                                   });
            else {
                if(Loupe.UIState != 'active') return false;
                if(!BibiEvent) BibiEvent = { Coord: { X: window.innerWidth / 2, Y: window.innerHeight / 2 } };
                /*
                const CurrentTransformOrigin = {
                    X: window.innerWidth  / 2 + CurrentTfm.TranslateX,
                    Y: window.innerHeight / 2 + CurrentTfm.TranslateY
                };
                Loupe.transform({
                    Scale: Scl,
                    TranslateX: CurrentTfm.TranslateX + (BibiEvent.Coord.X - (CurrentTransformOrigin.X + (BibiEvent.Coord.X - (CurrentTransformOrigin.X)) * (Scl / CurrentTfm.Scale))),
                    TranslateY: CurrentTfm.TranslateY + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y)) * (Scl / CurrentTfm.Scale)))
                });
                // ↓ simplified on culculation */
                Loupe.transform({
                    Scale: Scl,
                    TranslateX: CurrentTfm.TranslateX + (BibiEvent.Coord.X - window.innerWidth  / 2 - CurrentTfm.TranslateX) * (1 - Scl / CurrentTfm.Scale),
                    TranslateY: CurrentTfm.TranslateY + (BibiEvent.Coord.Y - window.innerHeight / 2 - CurrentTfm.TranslateY) * (1 - Scl / CurrentTfm.Scale)
                });
            }
            E.dispatch('bibi:changed-scale', R.Main.Transformation.Scale);
        },
        transform: (Tfm, Opt) => new Promise((resolve, reject) => {
            // Tfm: Transformation
            if(!Tfm) return reject();
            if(!Opt) Opt = {};
            Loupe.Transforming = true;
            clearTimeout(Loupe.Timer_onTransformEnd);
            O.HTML.classList.add('transforming');
            const CurrentTfm = R.Main.Transformation;
            if(typeof Tfm.Scale      != 'number') Tfm.Scale      = CurrentTfm.Scale;
            if(typeof Tfm.TranslateX != 'number') Tfm.TranslateX = CurrentTfm.TranslateX;
            if(typeof Tfm.TranslateY != 'number') Tfm.TranslateY = CurrentTfm.TranslateY;
            if(Tfm.Scale > 1) {
                const OverflowX = window.innerWidth  * (0.5 * (Tfm.Scale - 1));
                const OverflowY = window.innerHeight * (0.5 * (Tfm.Scale - 1));
                Tfm.TranslateX = sML.limitMinMax(Tfm.TranslateX, OverflowX * -1, OverflowX);
                Tfm.TranslateY = sML.limitMinMax(Tfm.TranslateY, OverflowY * -1, OverflowY);
            }
            sML.style(R.Main, {
                transform: (Ps => {
                         if(Tfm.TranslateX && Tfm.TranslateY) Ps.push( 'translate(' + Tfm.TranslateX + 'px' + ', ' + Tfm.TranslateY + 'px' + ')');
                    else if(Tfm.TranslateX                  ) Ps.push('translateX(' + Tfm.TranslateX + 'px'                                + ')');
                    else if(                  Tfm.TranslateY) Ps.push('translateY('                                + Tfm.TranslateY + 'px' + ')');
                         if(Tfm.Scale != 1                  ) Ps.push(     'scale(' + Tfm.Scale                                            + ')');
                    return Ps.length ? Ps.join(' ') : '';
                })([])
            });
            R.Main.PreviousTransformation = R.Main.Transformation;
            R.Main.Transformation = Tfm;
            Loupe.Timer_onTransformEnd = setTimeout(() => {
                     if(R.Main.Transformation.Scale == 1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.remove('zoomed-out');
                else if(R.Main.Transformation.Scale <  1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.add(   'zoomed-out');
                else                                      O.HTML.classList.add(   'zoomed-in'), O.HTML.classList.remove('zoomed-out');
                O.HTML.classList.remove('transforming');
                Loupe.Transforming = false;
                resolve();
                E.dispatch('bibi:transformed-book', { Transformation: Tfm, Temporary: Opt.Temporary });
            }, 345);
        }),
        transformBack:  (Opt) => Loupe.transform(R.Main.PreviousTransformation,              Opt) || Loupe.transformReset(Opt),
        transformReset: (Opt) => Loupe.transform({ Scale: 1, TranslateX: 0, TranslateY: 0 }, Opt),
        BookStretchingEach: 0,
        defineZoomOutPropertiesForUtilities: () => {
            const BookMargin = {
                   Top: S['use-menubar'] && S['use-full-height'] ? I.Menu.Height : 0,
                 Right: S.ARA == 'vertical'   ? I.Slider.Size : 0,
                Bottom: S.ARA == 'horizontal' ? I.Slider.Size : 0,
                  Left: 0
            };
            const Tf = {};
            if(S.ARA == 'horizontal') {
                Tf.Scale = (R.Main.offsetHeight - (BookMargin.Top + BookMargin.Bottom)) / (R.Main.offsetHeight - (S.ARA == S.SLA && (S.RVM != 'paged' || I.Slider.UI) ? O.Scrollbars.Height : 0));
                Tf.TranslateX = 0;
            } else {
                Tf.Scale = Math.min(
                    (R.Main.offsetWidth  - BookMargin.Right) / (R.Main.offsetWidth - O.Scrollbars.Width),
                    (R.Main.offsetHeight - BookMargin.Top  ) /  R.Main.offsetHeight
                );
                Tf.TranslateX = 0;//R.Main.offsetWidth * (1 - Tf.Scale) / -2;
                //OP.Left = Tf.TranslateX * -1;
            }
            Tf.TranslateY = BookMargin.Top - (R.Main.offsetHeight) * (1 - Tf.Scale) / 2;
            const St = (O.Body['offset' + C.A_SIZE_L] / Tf.Scale - R.Main['offset' + C.A_SIZE_L]);
            const OP = {};
            OP[C.A_BASE_B] = St / 2 + (!S['use-full-height'] && S.ARA == 'vertical' ? I.Menu.Height : 0);
            OP[C.A_BASE_A] = St / 2;
            const IP = {};
            if(S.ARA == S.SLA) IP[S.ARA == 'horizontal' ? 'Right' : 'Bottom'] = St / 2;
            Loupe.ZoomOutPropertiesForUtilities = {
                Transformation: Tf,
                Stretch: St,
                OuterPadding: OP,
                InnerPadding: IP
            };
        },
        zoomOutForUtilities: () => {
            Loupe.defineZoomOutPropertiesForUtilities();
            const ZOP = Loupe.ZoomOutPropertiesForUtilities, OP = ZOP.OuterPadding, IP = ZOP.InnerPadding;
            for(const Dir in OP) R.Main.style[     'padding' + Dir] = OP[Dir] + 'px';
            for(const Dir in IP) R.Main.Book.style['padding' + Dir] = IP[Dir] + 'px';
            Loupe.BookStretchingEach = ZOP.Stretch / 2;
            return Loupe.transform(ZOP.Transformation, { Temporary: true }).then(() => {
                if(I.Slider.UI) I.Slider.progress();
            });
        },
        resetZoomingOutForUtilities: () => {
            return Loupe.transformReset().then(() => {
                //R.Main.style[C.A_SIZE_l] = '';
                R.Main.style.padding = R.Main.Book.style.padding = '';
                Loupe.BookStretchingEach = 0;
                if(I.Slider.UI) I.Slider.progress();
            });
        },
        isAvailable: (Mode) => {
            if(!L.Opened) return false;
            if(Loupe.UIState != 'active') return false;
            if(S.BRL == 'reflowable') return false;
            if(Mode == 'TAP') {
                if(!I.KeyListener.ActiveKeys || !I.KeyListener.ActiveKeys['Space']) return false;
                if(I.Slider.UIState == 'active') return false;
            } else if(Mode == 'MOVE') {
                if(R.Main.Transformation.Scale == 1) return false;
                if(I.Slider.UIState == 'active') return false;
            } else {
                if(!R.PointerIsDowned) return false;
            }
            return true;
        },
        adjustScale: (Scl) => sML.limitMinMax(Scl, 1, S['loupe-max-scale']),
        onTapped: (Eve) => {
            if(!Loupe.isAvailable('TAP')) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(BibiEvent.Target.tagName) {
                if(/bibi-menu|bibi-slider/.test(BibiEvent.Target.id)) return false;
                if(O.isAnchorContent(BibiEvent.Target)) return false;
                if(S.RVM == 'horizontal' && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
            }
            Loupe.scale(Loupe.adjustScale(R.Main.Transformation.Scale + 0.5 * (Eve.shiftKey ? -1 : 1) * 2), BibiEvent);
        },
        onPointerDown: (Eve) => {
            Loupe.PointerDownCoord = O.getBibiEvent(Eve).Coord;
            Loupe.PointerDownTransformation = {
                Scale: R.Main.Transformation.Scale,
                TranslateX: R.Main.Transformation.TranslateX,
                TranslateY: R.Main.Transformation.TranslateY
            };
        },
        onPointerUp: (Eve) => {
            O.HTML.classList.remove('dragging');
            Loupe.Dragging = false;
            delete Loupe.PointerDownCoord;
            delete Loupe.PointerDownTransformation;
        },
        onPointerMove: (Eve) => {
            if(!Loupe.isAvailable('MOVE', Eve)) return false;
            if(R.Main.Transformation.Scale == 1 || !Loupe.PointerDownCoord) return;
            Loupe.Dragging = true;
            O.HTML.classList.add('dragging');
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(Loupe.Timer_TransitionRestore);
            sML.style(R.Main, { transition: 'none' }, { cursor: 'move' });
            Loupe.transform({
                Scale: R.Main.Transformation.Scale,
                TranslateX: Loupe.PointerDownTransformation.TranslateX + (BibiEvent.Coord.X - Loupe.PointerDownCoord.X),
                TranslateY: Loupe.PointerDownTransformation.TranslateY + (BibiEvent.Coord.Y - Loupe.PointerDownCoord.Y)
            });
            Loupe.Timer_TransitionRestore = setTimeout(() => sML.style(R.Main, { transition: '' }, { cursor: '' }), 234);
        },
        lock: () => {
            E.dispatch('bibi:locked-loupe');
            Loupe.Locked = true;
        },
        unlock: () => {
            Loupe.Locked = false;
            E.dispatch('bibi:unlocked-loupe');
        }
    };
    I.isPointerStealth.addChecker(() => {
        if(Loupe.Dragging) return true;
        if(!I.KeyListener.ActiveKeys || !I.KeyListener.ActiveKeys['Space']) return false;
        return true;
    });
    I.setToggleAction(Loupe, {
        onopened: () => {
            O.HTML.classList.add('loupe-active');
        },
        onclosed: () => {
            Loupe.scale(1);
            O.HTML.classList.remove('loupe-active');
        }
    });
    E.add('bibi:commands:activate-loupe',   (   ) => Loupe.open());
    E.add('bibi:commands:deactivate-loupe', (   ) => Loupe.close());
    E.add('bibi:commands:toggle-loupe',     (   ) => Loupe.toggle());
    E.add('bibi:commands:scale',            Scale => Loupe.scale(Scale));
    E.add('bibi:tapped',         Eve => Loupe.onTapped(     Eve));
    E.add('bibi:downed-pointer', Eve => Loupe.onPointerDown(Eve));
    E.add('bibi:upped-pointer',  Eve => Loupe.onPointerUp(  Eve));
    E.add('bibi:moved-pointer',  Eve => Loupe.onPointerMove(Eve));
    E.add('bibi:changed-scale', Scale => O.log(`Changed Scale: ${ Scale }`));
    if(S['zoom-out-for-utilities']) {
        E.add('bibi:opens-utilities',  () => Loupe.zoomOutForUtilities());
        E.add('bibi:closes-utilities', () => Loupe.resetZoomingOutForUtilities());
    }
    E.add('bibi:opened', () => {
        Loupe.open();
        if(S['use-loupe'] && S['keep-settings']) {
            const Transformation = O.Biscuits.remember('Book')['Transformation'];
            if(Transformation) Loupe.transform(Transformation);
        }
    });
    E.add('bibi:transformed-book', Par => {
        if(Par.Temporary) return false;
        if(S['use-loupe'] && S['keep-settings']) O.Biscuits.memorize('Book', { 'Transformation': Par.Transformation });
    });
    E.add('bibi:changes-view',  () => Loupe.scale(1));
    E.add('bibi:opened-slider', () => Loupe.lock());
    E.add('bibi:closed-slider', () => Loupe.unlock());
    if(S['use-loupe']) {
        const ButtonGroup = I.Menu.R.addButtonGroup({
            Sticky: true,
            Tiled: true,
            id: 'bibi-buttongroup_loupe',
            Buttons: [{
                Labels: { default: { default: `Zoom-in`, ja: `拡大する` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>`,
                Help: true,
                action: () => Loupe.scale(Loupe.adjustScale(R.Main.Transformation.Scale + 0.5)),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale >= S['loupe-max-scale']) ? 'disabled' : 'default');
                }
            }, { 
                Labels: { default: { default: `Reset Zoom-in/out`, ja: `元のサイズに戻す` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>`,
                Help: true,
                action: () => Loupe.scale(1),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale == 1) ? 'disabled' : 'default');
                }
            }, {
                Labels: { default: { default: `Zoom-out`, ja: `縮小する` } },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomout"></span>`,
                Help: true,
                action: () => Loupe.scale(Loupe.adjustScale(R.Main.Transformation.Scale - 0.5)),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale <= 1) ? 'disabled' : 'default');
                }
            }]
        });
        Loupe.updateButtonState = (State) => ButtonGroup.Buttons.forEach(Button => Button.updateState(State));
        E.add('bibi:opened',           () => Loupe.updateButtonState());
        E.add('bibi:transformed-book', () => Loupe.updateButtonState(Loupe.Locked ? 'disabled' : null));
        E.add('bibi:locked-loupe',     () => Loupe.updateButtonState('disabled'));
        E.add('bibi:unlocked-loupe',   () => Loupe.updateButtonState());
    }
    E.dispatch('bibi:created-loupe');
}};


I.Nombre = { create: () => { if(!S['use-nombre']) return;
    const Nombre = I.Nombre = O.Body.appendChild(sML.create('div', { id: 'bibi-nombre',
        show: () => {
            clearTimeout(Nombre.Timer_hot);
            clearTimeout(Nombre.Timer_vanish);
            Nombre.classList.add('active');
            Nombre.Timer_hot = setTimeout(() => Nombre.classList.add('hot'), 10);
        },
        hide: () => {
            clearTimeout(Nombre.Timer_hot);
            clearTimeout(Nombre.Timer_vanish);
            Nombre.classList.remove('hot');
            Nombre.Timer_vanish = setTimeout(() => Nombre.classList.remove('active'), 255);
        },
        progress: (PageInfo) => {
            clearTimeout(Nombre.Timer_hide);
            if(!PageInfo) PageInfo = R.Current;
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
            Nombre.Timer_hide = setTimeout(Nombre.hide, 1234);
        }
    }));
    Nombre.Current   = Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-current'   }));
    Nombre.Delimiter = Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-delimiter' }));
    Nombre.Total     = Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-total'     }));
    Nombre.Percent   = Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-percent'   }));
    E.add('bibi:opened' , () => {
        setTimeout(() => {
            Nombre.progress();
            E.add('bibi:changed-intersection', () => Nombre.progress());
        }, 321);
    });
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
        const CurrentPage = Opt.Destination ? R.hatchPage(Opt.Destination) : (() => { R.updateCurrent(); return R.Current.List[0].Page; })(),
                 LastPage = R.hatchPage(I.History.List[I.History.List.length - 1]);
        if(CurrentPage != LastPage) {
            if(Opt.SumUp && I.History.List[I.History.List.length - 1].UI == Opt.UI) I.History.List.pop();
            const Spread = CurrentPage.Spread;
            I.History.List.push({ UI: Opt.UI, Spread: Spread, PageProgressInSpread: CurrentPage.IndexInSpread / Spread.Pages.length });
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
                 LastPage = R.hatchPage(I.History.List[I.History.List.length - 1]);
        I.History.update();
        return R.focusOn({ Destination: LastPage, Duration: 0 });
    }
};


I.Slider = { create: () => {
    if(!S['use-slider']) return false;
    const Slider = I.Slider = O.Body.appendChild(sML.create('div', { id: 'bibi-slider',
        Size: I.Slider.Size,
        initialize: () => {
            //if(!/^(edgebar|bookmap)$/.test(S['slider-mode'])) S['slider-mode'] = (O.TouchOS || R.Stage.Width / R.Items.length < 20) ? 'edgebar' : 'bookmap';
            if(S['slider-mode'] != 'bookmap') S['slider-mode'] = 'edgebar';
            Slider.UI = (S['slider-mode'] == 'edgebar' ? Slider.Edgebar : Slider.Bookmap).create().initialize();
            const UIBox = Slider.appendChild(Slider.UI.Box);
            Slider.Rail           = UIBox.appendChild(sML.create('div', { id: 'bibi-slider-rail' }));
            Slider.Rail.Progress  = Slider.Rail.appendChild(sML.create('div', { id: 'bibi-slider-rail-progress' }));
            Slider.Thumb          = UIBox.appendChild(sML.create('div', { id: 'bibi-slider-thumb', Labels: { default: { default: `Slider Thumb`, ja: `スライダー上の好きな位置からドラッグを始められます` } } })); I.setFeedback(Slider.Thumb);
            if(!S['use-history']) return;
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
        },
        resetThumbAndRailSize: () => {
            let ScrollLength = R.Main['scroll' + C.L_SIZE_L];
            if(S.ARA == S.SLA) ScrollLength -= I.Loupe.BookStretchingEach * (S.SLA == 'horizontal' ? 2 : 3);
            const ThumbLengthPercent = R.Stage[C.L_SIZE_L]/*R.Main['offset' + C.L_SIZE_L]*/ / ScrollLength * 100;
            Slider.Thumb.style[C.A_SIZE_l] = (      ThumbLengthPercent) + '%';
            Slider.Rail.style[ C.A_SIZE_l] = (100 - ThumbLengthPercent) + '%';
            Slider.Thumb.style[C.A_SIZE_b] = Slider.Rail.style[C.A_SIZE_b] = '';
            Slider.resetRailCoords();
        },
        resetRailCoords: () => {
            Slider.Rail.Coords = [O.getElementCoord(Slider.Rail)[C.A_AXIS_L]];
            Slider.Rail.Coords.push(Slider.Rail.Coords[0] + Slider.Rail['offset' + C.A_SIZE_L]);
            //console.log(Slider.Rail.Coords);
        },
        progress: () => {
            if(Slider.Touching) return;
            Slider.Thumb.style.top = Slider.Thumb.style.right = Slider.Thumb.style.bottom = Slider.Thumb.style.left = '';
            let Scrolled = R.Main['scroll' + C.L_OOBL_L];
            let ScrollLength = R.Main['scroll' + C.L_SIZE_L];
                 if(S.ARA == S.SLA) ScrollLength -= I.Loupe.BookStretchingEach * (S.SLA == 'horizontal' ? 2 : 3);
            else if(S.ARD == 'rtl') Scrolled = ScrollLength - Scrolled - R.Stage.Height; // <- Paged (HorizontalAppearance) && VerticalText
            Slider.Thumb.style[C.A_OOBL_l] = (Scrolled / ScrollLength * 100) + '%';
            Slider.Rail.Progress.style.width = Slider.Rail.Progress.style.height = '';
            let Progress = O.getElementCoord(Slider.Thumb)[C.A_AXIS_L] + Slider.Thumb['offset' + C.A_SIZE_L] / 2 - O.getElementCoord(Slider.Rail)[C.A_AXIS_L];
            if(S.ARD == 'rtl') Progress = Slider.Rail['offset' + C.A_SIZE_L] - Progress;
            Slider.Rail.Progress.style[C.A_SIZE_l] = (Progress / Slider.Rail['offset' + C.A_SIZE_L] * 100) + '%';
        },
        onTouchStart: (Eve) => { // console.log(Eve);
            //if(!Eve.target || (!Slider.contains(Eve.target) && Eve.target != Slider)) return;
            Eve.preventDefault();
            //R.Main.style.overflow = 'hidden'; // ← ↓ to stop momentum scrolling
            //setTimeout(() => R.Main.style.overflow = '', 1);
            if(Slider.History) Slider.History.add({ Page: R.Current.List[0].Page });
            Slider.Touching = true;
            Slider.TouchStartThumbCenterCoord = O.getElementCoord(Slider.Thumb)[C.A_AXIS_L] + Slider.Thumb['offset' + C.A_SIZE_L] / 2;
            Slider.TouchStartCoord = Slider.TouchingCoord = Slider.getTouchStartCoord(Eve);
            clearTimeout(Slider.Timer_onTouchEnd);
            O.HTML.classList.add('slider-sliding');
            E.add('bibi:moved-pointer', Slider.onTouchMove);
        },
        getTouchStartCoord: (Eve) => {
            return (Eve.target == Slider.Thumb) ?
                O.getBibiEventCoord(Eve)[C.A_AXIS_L] : // ← Move Thumb naturally. // ↓ Bring Thumb's center to the touched coord at the next pointer moving.
                O.getElementCoord(Slider.Thumb)[C.A_AXIS_L] + Slider.Thumb['offset' + C.A_SIZE_L] / 2;
        },
        onTouchMove: (Eve) => {
            Slider.TouchingCoord = O.getBibiEventCoord(Eve)[C.A_AXIS_L];
            Slider.flip(Eve);
        },
        onTouchEnd: (Eve) => {
            if(!Slider.Touching) return;
            Slider.Touching = false;
            E.remove('bibi:moved-pointer', Slider.onTouchMove);
            Slider.onTouchMove(Eve);
            Slider.Timer_onTouchEnd = setTimeout(() => O.HTML.classList.remove('slider-sliding'), 125);
        },
        flip: (Eve) => {
            if(Slider.Touching) {
                let Translation = Slider.TouchingCoord - Slider.TouchStartCoord;
                const TranslatedThumbCenterCoord = Slider.TouchStartThumbCenterCoord + Translation;
                     if(TranslatedThumbCenterCoord < Slider.Rail.Coords[0]) Translation = Slider.Rail.Coords[0] - Slider.TouchStartThumbCenterCoord;
                else if(TranslatedThumbCenterCoord > Slider.Rail.Coords[1]) Translation = Slider.Rail.Coords[1] - Slider.TouchStartThumbCenterCoord;
                let ProgressLength = Slider.Thumb['offset' + C.A_OOBL_L] + Translation;
                if(S.ARD == 'rtl') ProgressLength = Slider.Rail['offset' + C.A_SIZE_L] - ProgressLength;
                sML.style(Slider.Thumb,         { transform: 'translate' + C.A_AXIS_L + '(' + Translation + 'px)' });
                sML.style(Slider.Rail.Progress, { [C.A_SIZE_l]: ProgressLength + 'px' });
                setTimeout(() => Slider.focus(Eve, { Turn: false, History: false }), 9);
            } else Slider.focus(Eve).then(Destination => {
                sML.style(Slider.Thumb,         { transform: '' });
                sML.style(Slider.Rail.Progress, { [C.A_SIZE_l]: '' });
                Slider.progress();
                if(Slider.History) Slider.History.add(Destination);
            });
        },
        focus: (Eve, Par = {}) => {
            const TargetPage = Slider.UI.identifyPage(Eve)
            Par.Destination = TargetPage;
            for(let l = R.Current.List.length, i = 0; i < l; i++) if(R.Current.List[i].Page == TargetPage) return Promise.resolve();
            Par.Duration = 0;
            return R.focusOn(Par);
        },
        getTouchEndCoord: () => {
            const TouchEndCoord = {};
            TouchEndCoord[C.A_AXIS_L] = sML.limitMinMax(Slider.TouchingCoord, Slider.Rail.Coords[0], Slider.Rail.Coords[1]);
            TouchEndCoord[C.A_AXIS_B] = O.getElementCoord(Slider)[C.A_AXIS_B] + Slider['offset' + C.A_SIZE_B] / 2;
            return TouchEndCoord;
        }
    }));
    Slider.Edgebar = { create: () => sML.create('div', { id: 'bibi-slider-edgebar',
        initialize: function() {
            (this.Box = sML.create('div', { id: 'bibi-slider-edgebar-box' })).appendChild(this);//.addEventListener(E['pointerover'], Eve => this.PointedPage = this.getPointedPage());
            if(!O.TouchOS) this.addEventListener(E['pointermove'], Eve => I.Nombre.progress({ List: [{ Page: this.getPointedPage({ X: Eve.offsetX, Y: Eve.offsetY }) }] }));
            return Slider.Edgebar = this;
        },
        getPointedPage: (Coord) => {
            //const START = Date.now();
            //const log = (OPI, FPI, SUPER) => console.log(Date.now() - START, '[Method02' + (SUPER ? '★' : '') + '] - O:' + OPI + ' F:' + FPI + ' G:' + (FPI - OPI));
            let Ratio = Coord[C.A_AXIS_L] / Slider.Edgebar['offset' + C.A_SIZE_L];
            const CoordInBook = R.Main.Book['offset' + C.L_SIZE_L] * (S.ARD != 'rtl' || S.SLD != 'ttb' ? Ratio : 1 - Ratio);
            const OriginPageIndex = Math.max(Math.round(R.Pages.length * (S.ARD != 'rtl' ? Ratio : 1 - Ratio)) - 1, 0);
            let ThePage = R.Pages[OriginPageIndex];
            let MinimumDistance = CoordInBook - O.getElementCoord(ThePage, R.Main.Book)[C.L_AXIS_L] + ThePage['offset' + C.L_SIZE_L] * 0.5;
            if(Math.abs(MinimumDistance) < window['inner' + C.L_SIZE_L] / 4) return ThePage;
            const Dir = (S.SLD == 'rtl' ? -1 : 1) * MinimumDistance < 0 ? -1 : 1;
            MinimumDistance = Math.abs(MinimumDistance);
            for(let i = OriginPageIndex + Dir; R.Pages[i]; i += Dir) {
                const Page = R.Pages[i];
                const PageDistance = Math.abs(CoordInBook - O.getElementCoord(Page, R.Main.Book)[C.L_AXIS_L] + Page['offset' + C.L_SIZE_L] * 0.5);
                if(PageDistance < MinimumDistance) MinimumDistance = PageDistance, ThePage = Page; else break;
            }
            return ThePage;
        },
        identifyPage: () => {
            const Coord = Slider.getTouchEndCoord();
            Coord[C.A_AXIS_L] -= Slider.Edgebar.Box['offset' + C.A_OOBL_L];
            return Slider.Edgebar.getPointedPage(Coord);
        }
    }) };
    Slider.Bookmap = { create: () => sML.create('div', { id: 'bibi-slider-bookmap',
        initialize: function() {
            this.Box = sML.create('div', { id: 'bibi-slider-bookmap-box' });
            R.Spreads.forEach(Spread => {
                Spread.BookmapSpread = sML.create('div', { className: 'bookmap-spread', Box: this.appendChild(document.createElement('div')) });
                Spread.Items.forEach(Item => Item.BookmapItem = { Box: Spread.BookmapSpread.appendChild(document.createElement('div')) });
                Spread.BookmapSpread.Box.appendChild(Spread.BookmapSpread);
            });
            return Slider.Bookmap = this;
        },
        putAway: (Lock) => {
            clearTimeout(Slider.Bookmap.Timer_putIn);
            if(Slider.Bookmap.Locked) return false;
            Slider.Bookmap.Locked = Lock;
            return Slider.Bookmap.parentElement
                ? Slider.Bookmap.Box.removeChild(Slider.Bookmap)
                : false;
        },
        putIn: (Unlock) => {
            if(Unlock) Slider.Bookmap.Locked = false;
            if(Slider.Bookmap.Locked) return false;
            return !Slider.Bookmap.parentElement
                ? (Slider.Bookmap.Timer_putIn = setTimeout(() => { Slider.Bookmap.Box.appendChild(Slider.Bookmap); Slider.resetThumbAndRailSize(); }, Unlock ? 0 : 456))
                : false;
        },
        reset: () => setTimeout(() => {
            Slider.Bookmap.putAway('Lock');
            R.Spreads.forEach(Spread => setTimeout(Slider.Bookmap.resetSpread, 0, Spread));
            Slider.Bookmap.putIn('Unlock');
        }, 456),
        resetSpread: (Spread) => {
            Slider.Bookmap.putAway();
            const SpreadBox = Spread.Box, BmSpread = Spread.BookmapSpread, BmSpreadBox = BmSpread.Box;
            sML.forEach(BmSpread.querySelectorAll('span.bookmap-page'))(OldBmPage => OldBmPage.parentElement.removeChild(OldBmPage));
            BmSpreadBox.className = 'bookmap-spread-box'; sML.forEach(SpreadBox.classList)(ClassName => { if(ClassName != 'spread-box') BmSpreadBox.classList.add(ClassName); });
            BmSpreadBox.style[C.A_SIZE_b] = BmSpread.style[C.A_SIZE_b] = '';
            BmSpreadBox.style[C.A_SIZE_l] = (SpreadBox['offset' + C.L_SIZE_L] / R.Main[   'scroll' + C.L_SIZE_L] * 100) + '%';
            BmSpread.style[   C.A_SIZE_l] = (Spread[   'offset' + C.L_SIZE_L] / SpreadBox['offset' + C.L_SIZE_L] * 100) + '%';
            Spread.Items.forEach(Item => {
                const ItemBox = Item.Box, BmItemBox = Item.BookmapItem.Box;
                BmItemBox.className = 'bookmap-item-box'; sML.forEach(ItemBox.classList)(ClassName => { if(ClassName != 'item-box') BmItemBox.classList.add(ClassName); });
                BmItemBox.style[C.A_SIZE_b] = (ItemBox['offset' + C.L_SIZE_B] / Spread['offset' + C.L_SIZE_B] * 100) + '%';
                BmItemBox.style[C.A_SIZE_l] = (ItemBox['offset' + C.L_SIZE_L] / Spread['offset' + C.L_SIZE_L] * 100) + '%';
                Item.Pages.forEach(Page => {
                    const BmPage = Page.BookmapPage = sML.create('span', { className: 'bookmap-page', Page: Page });
                    BmPage.style[C.A_SIZE_l] = (1 / Item.Pages.length * 100) + '%';
                    if(I.Nombre.progress) {
                        BmPage.addEventListener(E['pointerover'], () => {
                            if(Slider.Touching) return;
                            clearTimeout(Slider.Timer_BookmapPagePointerOut);
                            I.Nombre.progress({ List: [{ Page: Page }] });
                        });
                        BmPage.addEventListener(E['pointerout'], () => {
                            if(Slider.Touching) return;
                            Slider.Timer_BookmapPagePointerOut = setTimeout(() => {
                                clearTimeout(I.Nombre.Timer_hide);
                                I.Nombre.hide();
                            }, 200);
                        });
                    }
                    //BmPage.Labels = { default: { default: `P.${ Page.Index + 1 }` } };
                    I.setFeedback(BmPage);
                    if(Item.SpreadPair && Item.Ref['rendition:layout'] == 'pre-paginated' && Item.SpreadPair.Ref['rendition:layout'] == 'pre-paginated') {
                        E.add(BmPage, 'bibi:hovers',   function(Eve) { this.Page.Item.SpreadPair.Pages[0].BookmapPage.classList.add(   'hover'); });
                        E.add(BmPage, 'bibi:unhovers', function(Eve) { this.Page.Item.SpreadPair.Pages[0].BookmapPage.classList.remove('hover'); });
                    }
                    BmItemBox.appendChild(BmPage);
                });
            });
            Slider.Bookmap.putIn();
        },
        identifyPage: (Eve) => {
            let TouchEndElement;
            if(!O.TouchOS && (Eve.target == Slider.Bookmap || Slider.Bookmap.contains(Eve.target))) {
                TouchEndElement = Eve.target;
            } else {
                const TouchEndCoord = Slider.getTouchEndCoord();
                TouchEndElement = document.elementFromPoint(TouchEndCoord.X, TouchEndCoord.Y);
            }
            return Slider.Bookmap.narrowDownToPage(TouchEndElement);
        },
        narrowDownToPage: (Ele) => {
            if(Ele.classList.contains('bookmap-page')) return Ele.Page;
            const Ones = (Ele.classList.contains('bookmap-item') || Ele.classList.contains('bookmap-spread')) ? Ele.querySelectorAll('span.bookmap-page') : Slider.Bookmap.querySelectorAll('div.bookmap-spread');
            const TouchingCoord = Slider.TouchingCoord * C.A_AXIS_D;
            let TheOne = Ones[Ones.length - 1], PrevOne = null, PrevOneFootCoord = 0;
            for(let l = Ones.length, i = 0; i < l; i++) {
                const One = Ones[i], OneCoord = O.getElementCoord(One)[C.A_AXIS_L], OneFootCoord = (OneCoord + (S.ARD != 'rtl' ? One['offset' + C.A_SIZE_L] : 0)) * C.A_AXIS_D;
                if(OneFootCoord < TouchingCoord) {
                    PrevOne = One, PrevOneFootCoord = OneFootCoord;
                    continue;
                }
                const OneHeadCoord = (OneCoord + (S.ARD == 'rtl' ? One['offset' + C.A_SIZE_L] : 0)) * C.A_AXIS_D;
                TheOne = (TouchingCoord < OneHeadCoord && PrevOne && TouchingCoord - PrevOneFootCoord < OneHeadCoord - TouchingCoord) ? PrevOne : One;
            }
            return Slider.Bookmap.narrowDownToPage(TheOne);
        }
    }) };
    Slider.initialize();
    I.setToggleAction(Slider, {
        onopened: () => {
            O.HTML.classList.add('slider-opened');
            setTimeout(Slider.resetRailCoords, 0);
            E.dispatch('bibi:opened-slider');
        },
        onclosed: () => {
            new Promise(resolve => setTimeout(resolve, S['zoom-out-for-utilities'] ? 111 : 0)).then(() => {
                if(Slider.UI.reset) Slider.UI.reset();
            });
            O.HTML.classList.remove('slider-opened');
            setTimeout(Slider.resetRailCoords, 0);
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
        Slider.UI.addEventListener(E['pointerdown'], Slider.onTouchStart);
        Slider.Thumb.addEventListener(E['pointerdown'], Slider.onTouchStart);
        O.HTML.addEventListener(E['pointerup'], Slider.onTouchEnd);
        E.add('bibi:changed-intersection', () => Slider.progress());
        Slider.progress();
    });
    if(Slider.UI.reset) E.add(['bibi:opened', 'bibi:changed-view'], Slider.UI.reset);
    E.add('bibi:laid-out', () => {
        if(S['zoom-out-for-utilities']) I.Loupe.resetZoomingOutForUtilities();
        Slider.resetThumbAndRailSize();
        Slider.progress();
    });
    if(!O.TouchOS) {
        if(!sML.UA.Gecko) Slider.addEventListener('wheel', R.Main.listenWheel, { capture: true, passive: false });
    }
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
                onopened: () => { E.add(   'bibi:scrolled', () => BookmarkManager.update()); BookmarkManager.update(); },
                onclosed: () => { E.remove('bibi:scrolled', () => BookmarkManager.update()); }
            });
            BookmarkManager.ButtonGroup = BookmarkManager.Subpanel.addSection({
                id: 'bibi-subpanel-section_bookmarks',
                Labels: { default: { default: `Bookmarks`, ja: `しおり` } }
            }).addButtonGroup();
            const BookmarkBiscuits = O.Biscuits.remember('Book', 'Bookmarks');
            if(BookmarkBiscuits instanceof Array && BookmarkBiscuits.length) BookmarkManager.Bookmarks = BookmarkBiscuits;
            //E.add(['bibi:opened', 'bibi:resized'], () => BookmarkManager.update());
            delete BookmarkManager.initialize;
        },
        exists: (Bookmark) => {
            for(let l = BookmarkManager.Bookmarks.length, i = 0; i < l; i++) if(BookmarkManager.Bookmarks[i]['SI-PPiS'] == Bookmark['SI-PPiS']) return BookmarkManager.Bookmarks[i];
            return null;
        },
        add: (Bookmark) => {
            const ExistingBookmark = BookmarkManager.exists(Bookmark);
            if(!ExistingBookmark) {
                Bookmark.IsHot = true;
                BookmarkManager.Bookmarks.push(Bookmark);
                BookmarkManager.update({ Added: Bookmark });
            } else BookmarkManager.update();
        },
        remove: (Bookmark) => {
            BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => Bmk['SI-PPiS'] != Bookmark['SI-PPiS']);
            BookmarkManager.update({ Removed: Bookmark });
        },
        update: (Opt = {}) => {
            BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = '';
            if(BookmarkManager.ButtonGroup.Buttons) {
                BookmarkManager.ButtonGroup.Buttons = [];
                BookmarkManager.ButtonGroup.innerHTML = '';
            }
            //BookmarkManager.Bookmarks = BookmarkManager.Bookmarks.filter(Bmk => Bmk['SI-PPiS'] && Bmk['%']);
            let Bookmark = null, ExistingBookmark = null;
            if(Opt.Added) Bookmark = Opt.Added;
            else if(L.Opened) {
                R.updateCurrent();
                const Page = R.Current.List[0].Page;
                Bookmark = {
                    'SI-PPiS': Page.Spread.Index + '-' + (Page.IndexInSpread / Page.Spread.Pages.length),
                    '%': Math.floor((Page.Index + 1) / R.Pages.length * 100) // only for showing percentage in waiting status
                };
            }
            if(BookmarkManager.Bookmarks.length) {
                BookmarkManager.Bookmarks.forEach(Bmk => {
                    let Label = '', ClassName = ''; const BB = 'bibi-bookmark', Page = R.hatchPage({ 'SI-PPiS': Bmk['SI-PPiS'] });
                    if(Page && typeof Page.Index == 'number') {
                        const PageNumber = Page.Index + 1;
                        Bmk['%'] = Math.floor(PageNumber / R.Pages.length * 100);
                        Label += `<span class="${BB}-page"><span class="${BB}-unit">P.</span><span class="${BB}-number">${ PageNumber }</span></span>`;
                        Label += `<span class="${BB}-total-pages">/<span class="${BB}-number">${ R.Pages.length }</span></span>`;
                        Label += ` <span class="${BB}-percent"><span class="${BB}-parenthesis">(</span><span class="${BB}-number">${ Bmk['%'] }</span><span class="${BB}-unit">%</span><span class="${BB}-parenthesis">)</span></span>`;
                    } else {
                        Label +=  `<span class="${BB}-percent">` +                                    `<span class="${BB}-number">${ Bmk['%'] }</span><span class="${BB}-unit">%</span>`                                    + `</span>`;
                    }
                    const Labels = { default: { default: Label, ja: Label } };
                    if(Bookmark && Bmk['SI-PPiS'] == Bookmark['SI-PPiS']) {
                        ExistingBookmark = Bmk;
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
                            if(S['start-in-new-window']) return L.openNewWindow(location.href + (location.hash ? ',' : '#') + 'jo(si-ppis:' + Bmk['SI-PPiS'] + ')');
                            S['to'] = { 'SI-PPiS': Bmk['SI-PPiS'] };
                            L.play();
                        },
                        remove: () => BookmarkManager.remove(Bmk)
                    });
                    const Remover = Button.appendChild(sML.create('span', { className: 'bibi-remove-bookmark', title: 'しおりを削除' }));
                    I.setFeedback(Remover, { StopPropagation: true }).addTapEventListener('tapped', () => Button.remove());
                    Remover.addEventListener(E['pointer-over'], Eve => Eve.stopPropagation());
                    if(Bmk.IsHot) {
                        delete Bmk.IsHot;
                        I.setUIState(Button, 'active'); setTimeout(() => { I.setUIState(Button, ExistingBookmark == Bmk ? 'disabled' : 'default'); }, 234);/*
                        Button.classList.add('bibi-button-bookmark-is-hot');
                        setTimeout(() => {
                            Button.classList.remove('bibi-button-bookmark-is-hot');
                            Button.classList.add('bibi-button-bookmark-is-cold');
                            setTimeout(() => {
                                Button.classList.remove('bibi-button-bookmark-is-cold');
                            }, 234);
                        }, 234);*/
                    }
                    else if(ExistingBookmark == Bmk) I.setUIState(Button, 'disabled');
                    else                             I.setUIState(Button,  'default');
                });
            } else {
                if(!L.Opened) BookmarkManager.Subpanel.Opener.ButtonGroup.style.display = 'none';
            }
            if(BookmarkManager.Bookmarks.length < S['max-bookmarks']) {
                BookmarkManager.AddButton = BookmarkManager.ButtonGroup.addButton({
                    id: 'bibi-button-add-a-bookmark',
                    Type: 'normal',
                    Labels: { default: { default: `Add a Bookmark to Current Page`, ja: `現在のページにしおりを挟む` } },
                    Icon: `<span class="bibi-icon bibi-icon-bookmark bibi-icon-add-a-bookmark"></span>`,
                    action: () => Bookmark ? BookmarkManager.add(Bookmark) : false
                });
                if(!Bookmark || ExistingBookmark) {
                    I.setUIState(BookmarkManager.AddButton, 'disabled');
                }
            }
            O.Biscuits.memorize('Book', { 'Bookmarks': BookmarkManager.Bookmarks.map(Bmk => ({ 'SI-PPiS': Bmk['SI-PPiS'], '%': Bmk['%'] })) });
        },
    };
    BookmarkManager.initialize();
    E.dispatch('bibi:created-bookmark-manager');
}};


I.Turner = { create: () => {
    const Turner = I.Turner = {
        Back: { Distance: -1 }, Forward: { Distance: 1 },
        initialize: () => {
            Turner[-1] = Turner.Back, Turner[1] = Turner.Forward;
            if(S['accept-orthogonal-input']) {
                Turner['top'] = Turner.Back, Turner['bottom'] = Turner.Forward;
                switch(B.PPD) {
                    case 'ltr': Turner['left']  = Turner.Back, Turner['right'] = Turner.Forward; break;
                    case 'rtl': Turner['right'] = Turner.Back, Turner['left']  = Turner.Forward; break;
                }
            }
        },
        update: () => {
            if(S['accept-orthogonal-input']) return;
            switch(S.ARD) {
                case 'ltr': Turner['left']  = Turner.Back, Turner['right']  = Turner.Forward, Turner['top']  = Turner['bottom'] = undefined; break;
                case 'rtl': Turner['right'] = Turner.Back, Turner['left']   = Turner.Forward, Turner['top']  = Turner['bottom'] = undefined; break;
                case 'ttb': Turner['top']   = Turner.Back, Turner['bottom'] = Turner.Forward, Turner['left'] = Turner['right']  = undefined; break;
            }
        },
        getDirection: (Division) => {
            switch(S.ARA) {
                case 'horizontal': return Division.X != 'center' ? Division.X : Division.Y;
                case 'vertical'  : return Division.Y != 'middle' ? Division.Y : Division.X;
            }
        },
        isAbleToTurn: (Par) => {
            if(I.OpenedSubpanel) return false;
            if(typeof Par.Distance != 'number' && typeof Par.Direction == 'string') {
                if(Turner[Par.Direction]) Par.Distance = Turner[Par.Direction].Distance;
            }
            if(typeof Par.Distance == 'number') {
                if(!R.Current.List.length) R.updateCurrent();
                if(R.Current.List.length) {
                    let CurrentEdge, BookEdgePage, Edged;
                    switch(Par.Distance) {
                        case -1: CurrentEdge = R.Current.List[          0], BookEdgePage = R.Pages[          0], Edged = 'Headed'; break;
                        case  1: CurrentEdge = R.Current.List.slice(-1)[0], BookEdgePage = R.Pages.slice(-1)[0], Edged = 'Footed'; break;
                    }
                    if(L.Opened && (
                        CurrentEdge.Page != BookEdgePage
                        || (!CurrentEdge.PageIntersectionStatus.Contained && !CurrentEdge.PageIntersectionStatus[Edged])
                    )) {
                        switch(Par.Direction) {
                            case 'left': case  'right': return S.ARA == 'horizontal' ? 1 : -1;
                            case  'top': case 'bottom': return S.ARA ==   'vertical' ? 1 : -1;
                        }
                        return true;
                    }
                }
            }
            return false;
        },
        turn: (Distance) => {
            const IsSameDirection = (Distance == Turner.PreviousDistance);
            Turner.PreviousDistance = Distance;
            if(S['book-rendition-layout'] == 'pre-paginated') { // Preventing flicker.
                const CIs = [
                    R.Current.List[          0].Page.Index,
                    R.Current.List.slice(-1)[0].Page.Index
                ], TI = CIs[Distance < 0 ? 0 : 1] + Distance;
                CIs.forEach(CI => { try { R.Pages[CI].Spread.Box.classList.remove('current'); } catch(Err) {} });
                                    try { R.Pages[TI].Spread.Box.classList.add(   'current'); } catch(Err) {}
            }
            return R.moveBy({ Distance: Distance }).then(Destination => I.History.add({ UI: Turner, SumUp: IsSameDirection, Destination: Destination }));
        }
    };
    E.add('bibi:opened', () => {
        Turner.initialize();
        Turner.update(), E.add('bibi:changed-view', () => Turner.update());
    });
}};


I.Arrows = { create: () => { if(!S['use-arrows']) return;
    const Arrows = I.Arrows = {
        navigate: () => {
            setTimeout(() => {
                [Arrows.Back, Arrows.Forward].forEach(Arrow => I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance }) ? Arrow.classList.add('glowing') : false);
                setTimeout(() => [Arrows.Back, Arrows.Forward].forEach(Arrow => Arrow.classList.remove('glowing')), 1234);
            }, 400);
        },
        check: () => {
            [Arrows.Back, Arrows.Forward].forEach(Arrow =>
                I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance })
                    ? sML.replaceClass(Arrow, 'unavailable', 'available')
                    : sML.replaceClass(Arrow, 'available', 'unavailable')
            );
        },
        areAvailable: (BibiEvent) => {
            if(!L.Opened) return false;
            if(I.OpenedSubpanel) return false;
            if(I.Panel && I.Panel.UIState == 'active') return false;
            //if(BibiEvent.Coord.Y < I.Menu.Height/* * 1.5*/) return false;
            if(S.RVM == 'paged') {
                if(BibiEvent.Coord.Y > window.innerHeight - (I.Slider.UI ? I.Slider.offsetHeight : 0)) return false;
            } else {
                //if(S['full-breadth-layout-in-scroll']) return false;
                     if(S.RVM == 'horizontal') { if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; }
                else if(S.RVM == 'vertical'  ) { if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; }
            }
            if(BibiEvent.Target.ownerDocument.documentElement == O.HTML) {
                if(BibiEvent.Target == O.HTML || BibiEvent.Target == O.Body || BibiEvent.Target == I.Menu) return true;
                if(/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(BibiEvent.Target.id)) return true;
                if(/^(spread|item|page)( |-|$)/.test(BibiEvent.Target.className)) return true;
            } else {
                return O.isAnchorContent(BibiEvent.Target) ? false : true;
            }
            return false;
        }
    };
    O.HTML.classList.add('arrows-active');
    Arrows.Back    = I.Turner.Back.Arrow    = O.Body.appendChild(sML.create('div', { className: 'bibi-arrow', id: 'bibi-arrow-back',    Labels: { default: { default: `Back`,    ja: `戻る` } }, Turner: I.Turner.Back    }));
    Arrows.Forward = I.Turner.Forward.Arrow = O.Body.appendChild(sML.create('div', { className: 'bibi-arrow', id: 'bibi-arrow-forward', Labels: { default: { default: `Forward`, ja: `進む` } }, Turner: I.Turner.Forward }));
    Arrows.Back.Pair = Arrows.Forward, Arrows.Forward.Pair = Arrows.Back;
    [Arrows.Back, Arrows.Forward].forEach(Arrow => {
        //Arrow.isAvailable = () => I.Turner.isAbleToTurn(Arrow);
        I.setFeedback(Arrow);
        const FunctionsToBeCanceled = [Arrow.showHelp, Arrow.hideHelp, Arrow.onBibiTap]; if(!O.TouchOS) FunctionsToBeCanceled.push(Arrow.onBibiHover);
        FunctionsToBeCanceled.forEach(FunctionToBeCanceled => FunctionToBeCanceled = undefined);
    });
    if(!O.TouchOS) {
        E.add('bibi:moved-pointer', Eve => { // try hovering
            if(!L.Opened) return false;
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(Arrows.areAvailable(BibiEvent)) {
                const Dir = I.Turner.getDirection(BibiEvent.Division);/*
                const Dir = (S.RVM == 'vertical') ? BibiEvent.Division.Y : BibiEvent.Division.X;*/
                const Availability = I.Turner.isAbleToTurn({ Direction: Dir });
                if(Availability) {
                    const Arrow = I.Turner[Dir].Arrow;
                    //if(Availability != -1) {
                        E.dispatch(Arrow,      'bibi:hovers',   Eve);
                        E.dispatch(Arrow.Pair, 'bibi:unhovers', Eve);
                    //}
                    BibiEvent.Target.ownerDocument.documentElement.setAttribute('data-bibi-cursor', Dir);
                    return;
                }
            }
            E.dispatch(Arrows.Back,    'bibi:unhovers', Eve);
            E.dispatch(Arrows.Forward, 'bibi:unhovers', Eve);
            R.Items.concat(O).forEach(Item => Item.HTML.removeAttribute('data-bibi-cursor'));
        });
        E.add('bibi:opened', () => R.Items.concat(O).forEach(Item => sML.forEach(Item.Body.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault))));
    }
    E.add('bibi:tapped-not-center', Eve => { // try moving
        if(!L.Opened) return false;
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(/^bibi-arrow-/.test(BibiEvent.Target.id)) return false;
        if(!Arrows.areAvailable(BibiEvent)) return false;
        const Dir = I.Turner.getDirection(BibiEvent.Division);/*
        const Dir = (S.RVM == 'vertical') ? BibiEvent.Division.Y : BibiEvent.Division.X;*/
        if(I.Turner.isAbleToTurn({ Direction: Dir })) {
            const Turner = I.Turner[Dir];
            const Arrow = Turner.Arrow;
            E.dispatch(Arrow, 'bibi:taps',   Eve);
            E.dispatch(Arrow, 'bibi:tapped', Eve);
            I.Turner.turn(Turner.Distance);
        }
    });
    E.add('bibi:commands:move-by', Par => { // indicate direction
        if(!L.Opened || !Par || typeof Par.Distance != 'number') return false;
        switch(Par.Distance) {
            case -1: return E.dispatch(Arrows.Back,    'bibi:tapped', null);
            case  1: return E.dispatch(Arrows.Forward, 'bibi:tapped', null);
        }
        return false;
    });
    E.add('bibi:loaded-item', Item => {
        /*
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="left"]',   'cursor: w-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="right"]',  'cursor: e-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="top"]',    'cursor: n-resize;');
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor="bottom"]', 'cursor: s-resize;');
        */
        sML.appendCSSRule(Item.contentDocument, 'html[data-bibi-cursor]', 'cursor: pointer;');
    });
    E.add('bibi:opened',       () => setTimeout(() => { Arrows.check(); Arrows.navigate(); }, 123));
    E.add('bibi:changed-view', () => Arrows.navigate());
    E.add('bibi:scrolled',     () => Arrows.check());
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


I.SwipeListener = { create: () => {
    const SwipeListener = I.SwipeListener = {
        update: () => {
            S.RVM == 'paged' ? SwipeListener.open() : SwipeListener.close();
            return SwipeListener.State;
        },
        activateElement: (Ele) => {
            Ele.addEventListener('touchstart', SwipeListener.onTouchStart);
            Ele.addEventListener('touchmove',  SwipeListener.onTouchMove);
            Ele.addEventListener('touchend',   SwipeListener.onTouchEnd);
            if(!O.TouchOS) {
                Ele.addEventListener('wheel', SwipeListener.onWheel, { capture: true, passive: false });
                sML.forEach(Ele.querySelectorAll('img'))(Img => Img.addEventListener(E['pointerdown'], O.preventDefault));
            }
        },
        deactivateElement: (Ele) => {
            Ele.removeEventListener('touchstart', SwipeListener.onTouchStart);
            Ele.removeEventListener('touchmove',  SwipeListener.onTouchMove);
            Ele.removeEventListener('touchend',   SwipeListener.onTouchEnd);
            if(!O.TouchOS) {
                Ele.removeEventListener('wheel', SwipeListener.onWheel, { capture: true, passive: false });
                sML.forEach(Ele.querySelectorAll('img'))(Img => Img.removeEventListener(E['pointerdown'], O.preventDefault));
            }
        },
        PreviousWheels: [],
        onWheel: (Eve) => {
            Eve.preventDefault();
            const WA /* WheelAxis */ = Math.abs(Eve.deltaX) > Math.abs(Eve.deltaY) ? 'X' : 'Y';
            if(SwipeListener.PreviousWheels.length && SwipeListener.PreviousWheels[SwipeListener.PreviousWheels.length - 1].Axis != WA) SwipeListener.PreviousWheels = [];
            const CW = {}, PWs = SwipeListener.PreviousWheels, PWl = PWs.length;
            CW.Axis = WA;
            CW.Distance = (Eve['delta' + WA] < 0 ? -1 : 1) * (WA == 'X' && S.ARD == 'rtl' ? -1 : 1);
            CW.Delta = { X: 0, Y: 0 }, CW.Delta[WA] = Math.abs(Eve['delta' + WA]);
            if(!PWs[PWl - 1]) {
                CW.Accel = 1, CW.Wheeled = 'start';
            } else if(CW.Distance != PWs[PWl - 1].Distance) {
                CW.Accel = 1;
                if(PWl >= 3 && PWs[PWl - 2].Distance != CW.Distance && PWs[PWl - 3].Distance != CW.Distance) CW.Wheeled = 'reverse';
            } else if(CW.Delta[WA] > PWs[PWl - 1].Delta[WA]) {
                CW.Accel =  1;
                if(PWl >= 3 && PWs[PWl - 1].Accel == -1 && PWs[PWl - 2].Accel == -1 && PWs[PWl - 3].Accel == -1) CW.Wheeled = 'serial';
            } else if(CW.Delta[WA] < PWs[PWl - 1].Delta[WA]) {
                CW.Accel = -1;
            } else {
                CW.Accel = PWs[PWl - 1].Accel;
            }
            if(CW.Wheeled) {
                if(!SwipeListener.Hot) {
                    clearTimeout(SwipeListener.Timer_coolDown);
                    SwipeListener.Hot = true;
                    SwipeListener.Timer_coolDown = setTimeout(() => SwipeListener.Hot = false, 192);
                    R.moveBy({ Distance: CW.Distance });
                }
            }
            if(PWl >= 3) PWs.shift();
            PWs.push(CW);
            clearTimeout(SwipeListener.Timer_resetWheeling);
            SwipeListener.Timer_resetWheeling = setTimeout(() => SwipeListener.PreviousWheels = [], 192);
        },
        onTouchStart: (Eve) => {
            if(I.Loupe && I.Loupe.Transforming) return;
            const EventCoord = O.getBibiEventCoord(Eve);
            SwipeListener.TouchStartedOn = { X: EventCoord.X, Y: EventCoord.Y, T: Eve.timeStamp, SL: R.Main.scrollLeft, ST: R.Main.scrollTop };
        },
        onTouchMove: (Eve) => {
            if(Eve.touches.length == 1 && document.body.clientWidth / window.innerWidth <= 1) Eve.preventDefault();
        },
        onTouchEnd: (Eve) => {
            if(I.Loupe && I.Loupe.Transforming) return;
            if(SwipeListener.TouchStartedOn) {
                if(SwipeListener.TouchStartedOn.SL != R.Main.scrollLeft || SwipeListener.TouchStartedOn.ST != R.Main.scrollTop) return;
                if(document.body.clientWidth / window.innerWidth <= 1 && Eve.timeStamp - SwipeListener.TouchStartedOn.T <= 300) {
                    const EventCoord = O.getBibiEventCoord(Eve);
                    const VarX = EventCoord.X - SwipeListener.TouchStartedOn.X;
                    const VarY = EventCoord.Y - SwipeListener.TouchStartedOn.Y;
                    if(Math.sqrt(Math.pow(VarX, 2) + Math.pow(VarY, 2)) >= 10) {
                        const Deg = Math.atan2((VarY ? VarY * -1 : 0), VarX) * 180 / Math.PI;
                        let From = '', To = '';
                             if( 120 >= Deg && Deg >=   60) From = 'bottom', To = 'top';
                        else if(  30 >= Deg && Deg >=  -30) From = 'left',   To = 'right';
                        else if( -60 >= Deg && Deg >= -120) From = 'top',    To = 'bottom';
                        else if(-150 >= Deg || Deg >=  150) From = 'right',  To = 'left';
                        if(I.Turner.isAbleToTurn({ Direction: From })) I.Turner.turn(I.Turner[From].Distance);
                    }
                }
            }
            delete SwipeListener.TouchStartedOn;
        }
    };
    I.setToggleAction(SwipeListener, {
        onopened: () => {
            O.HTML.classList.add('swipe-active');
            SwipeListener.activateElement(R.Main);
            R.Items.forEach(Item => SwipeListener.activateElement(Item.HTML));
        },
        onclosed: () => {
            O.HTML.classList.remove('swipe-active');
            SwipeListener.deactivateElement(R.Main);
            R.Items.forEach(Item => SwipeListener.deactivateElement(Item.HTML));
        }
    });
    E.add('bibi:opened', () => {
        SwipeListener.update();
        E.add('bibi:updated-settings', (  ) => SwipeListener.update());
        E.add('bibi:loaded-item',      Item => { if(S.RVM == 'paged') SwipeListener.activateElement(Item.HTML); });
    });
    E.add('bibi:commands:activate-swipe',   () => SwipeListener.open());
    E.add('bibi:commands:deactivate-swipe', () => SwipeListener.close());
    E.add('bibi:commands:toggle-swipe',     () => SwipeListener.toggle());
    E.dispatch('bibi:created-swipelistener');
}};


I.KeyListener = { create: () => { if(!S['use-keys']) return;
    const KeyListener = I.KeyListener = {
        ActiveKeys: {},
        KeyCodes: { 'keydown': {}, 'keyup': {}, 'keypress': {} },
        updateKeyCodes: (EventTypes, KeyCodesToUpdate) => {
            if(typeof EventTypes.join != 'function')  EventTypes = [EventTypes];
            if(typeof KeyCodesToUpdate == 'function') KeyCodesToUpdate = KeyCodesToUpdate();
            EventTypes.forEach(EventType => KeyListener.KeyCodes[EventType] = sML.edit(KeyListener.KeyCodes[EventType], KeyCodesToUpdate));
        },
        MovingParameters: {},
        initializeMovingParameters: () => {
            let _ = {};
            if(S['accept-orthogonal-input']) switch(B.PPD) {
                case 'ltr': _ = { 'Up Arrow': -1, 'Down Arrow': 1, 'Left Arrow': -1, 'Right Arrow':  1 }; break;
                case 'rtl': _ = { 'Up Arrow': -1, 'Down Arrow': 1, 'Left Arrow':  1, 'Right Arrow': -1 }; break;
            }
            sML.applyRtL(_, { 'End': 'foot',  'Home': 'head' });
            for(const p in _) _[p.toUpperCase()] = _[p] == -1 ? 'head' : _[p] == 1 ? 'foot' : _[p] == 'head' ? 'foot' : _[p] == 'foot' ? 'head' : 0;
            //sML.applyRtL(_, { 'Space': 1, 'SPACE': -1 }); // Space key is reserved for Loupe.
            return KeyListener.MovingParameters = _;
        },
        updateMovingParameters: () => {
            if(S['accept-orthogonal-input']) return;
            let _ = {};
            switch(S.ARD) {
                case 'ltr': _ = { 'Up Arrow':  0, 'Down Arrow': 0, 'Left Arrow': -1, 'Right Arrow':  1 }; break;
                case 'rtl': _ = { 'Up Arrow':  0, 'Down Arrow': 0, 'Left Arrow':  1, 'Right Arrow': -1 }; break;
                case 'ttb': _ = { 'Up Arrow': -1, 'Down Arrow': 1, 'Left Arrow':  0, 'Right Arrow':  0 }; break;
            }
            for(const p in _) _[p.toUpperCase()] = _[p] == -1 ? 'head' : _[p] == 1 ? 'foot' : 0;
            sML.applyRtL(KeyListener.MovingParameters, _);
        },
        getBibiKeyName: (Eve) => {
            const KeyName = KeyListener.KeyCodes[Eve.type][Eve.keyCode];
            return KeyName ? KeyName : '';
        },
        onEvent: (Eve) => {
            if(!L.Opened) return false;
            Eve.BibiKeyName = KeyListener.getBibiKeyName(Eve);
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
            if(!KeyListener.onEvent(Eve)) return false;
            if(Eve.BibiKeyName) {
                if(!KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    KeyListener.ActiveKeys[Eve.BibiKeyName] = Date.now();
                } else {
                    E.dispatch('bibi:is-holding-key', Eve);
                }
            }
            E.dispatch('bibi:downs-key', Eve);
        },
        onKeyUp: (Eve) => {
            if(!KeyListener.onEvent(Eve)) return false;
            if(KeyListener.ActiveKeys[Eve.BibiKeyName] && Date.now() - KeyListener.ActiveKeys[Eve.BibiKeyName] < 300) {
                E.dispatch('bibi:touches-key', Eve);
                E.dispatch('bibi:touched-key', Eve);
            }
            if(Eve.BibiKeyName) {
                if(KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    delete KeyListener.ActiveKeys[Eve.BibiKeyName];
                }
            }
            E.dispatch('bibi:ups-key', Eve);
        },
        onKeyPress: (Eve) => {
            if(!KeyListener.onEvent(Eve)) return false;
            E.dispatch('bibi:presses-key', Eve);
        },
        observe: (Doc) => {
            ['keydown', 'keyup', 'keypress'].forEach(EventName => Doc.addEventListener(EventName, KeyListener['onKey' + sML.capitalise(EventName.replace('key', ''))], false));
        },
        tryMoving: (Eve) => {
            if(!Eve.BibiKeyName) return false;
            const MovingParameter = KeyListener.MovingParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!MovingParameter) return false;
            Eve.preventDefault();
            if(typeof MovingParameter == 'string') return R.focusOn({ Destination: MovingParameter, Duration: 0 });
            if(typeof MovingParameter == 'number') {
                if(I.Turner.isAbleToTurn({ Distance: MovingParameter })) {
                    const Turner = I.Turner[MovingParameter];
                    const Arrow = Turner.Arrow;
                    E.dispatch(Arrow, 'bibi:taps',   Eve);
                    E.dispatch(Arrow, 'bibi:tapped', Eve);
                    I.Turner.turn(Turner.Distance);
                }
            }
        }
    };
    KeyListener.updateKeyCodes(['keydown', 'keyup', 'keypress'], {
        32: 'Space'
    });
    KeyListener.updateKeyCodes(['keydown', 'keyup'], {
        33: 'Page Up',     34: 'Page Down',
        35: 'End',         36: 'Home',
        37: 'Left Arrow',  38: 'Up Arrow',  39: 'Right Arrow',  40: 'Down Arrow'
    });
    E.add('bibi:postprocessed-item', Item => Item.IsPlaceholder ? false : KeyListener.observe(Item.contentDocument));
    E.add('bibi:opened', () => {
        KeyListener.initializeMovingParameters(), KeyListener.updateMovingParameters(), E.add('bibi:changed-view', () => KeyListener.updateMovingParameters());
        KeyListener.observe(document);
        E.add(['bibi:touched-key', 'bibi:is-holding-key'], Eve => KeyListener.tryMoving(Eve));
    });
    E.dispatch('bibi:created-keylistener');
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
    const ButtonsToAdd = (Par.Buttons instanceof Array) ? Par.Buttons : Par.Button ? [Par.Button] : [];
    delete Par.Buttons;
    delete Par.Button;
    const ButtonGroup = sML.create('ul', Par);
    ButtonGroup.Buttons = [];
    ButtonGroup.addButton = function(Par) {
        const Button = I.createButton(Par);
        if(!Button) return null;
        Button.ButtonGroup = this;
        Button.ButtonBox = Button.ButtonGroup.appendChild(sML.create('li', { className: 'bibi-buttonbox bibi-buttonbox-' + Button.Type }));
        if(!O.TouchOS) I.setHoverActions(I.observeHover(Button.ButtonBox));
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
    if(typeof Button.action == 'function') Button.addTapEventListener('tapped', () => Button.isAvailable() ? Button.action.apply(Button, arguments) : null);
    Button.Busy = false;
    return Button;
};


I.createSubpanel = (Par = {}) => {
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id       ) delete Par.id;
    const ClassNames = ['bibi-subpanel', 'bibi-subpanel-' + (Par.Position == 'left' ? 'left' : 'right')];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');
    const SectionsToAdd = Par.Sections instanceof Array ? Par.Sections : Par.Section ? [Par.Section] : [];
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
        Opener.addTapEventListener('tapped', () => Subpanel.toggle());
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
    const PGroupsToAdd = Par.PGroups instanceof Array ? Par.PGroups : Par.PGroup ? [Par.PGroup] : [];
    delete Par.PGroups;
    delete Par.PGroup;
    const ButtonGroupsToAdd = Par.ButtonGroups instanceof Array ? Par.ButtonGroups : Par.ButtonGroup ? [Par.ButtonGroup] : [];
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


I.observeHover = (Ele) => {
    Ele.onBibiHover = (On, Eve) => E.dispatch(Ele, On ? 'bibi:hovers' : 'bibi:unhovers', Eve);
    Ele.addEventListener(E['pointerover'], Eve => Ele.onBibiHover(true,  Eve));
    Ele.addEventListener(E['pointerout'],  Eve => Ele.onBibiHover(false, Eve));
    return Ele;
};

I.setHoverActions = (Ele) => {
    E.add(Ele, 'bibi:hovers', Eve => {
        if(Ele.Hover) return Ele;
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        Ele.Hover = true;
        Ele.classList.add('hover');
        if(Ele.showHelp) Ele.showHelp();
        return Ele;
    });
    E.add(Ele, 'bibi:unhovers', Eve => {
        if(!Ele.Hover) return Ele;
        Ele.Hover = false;
        Ele.classList.remove('hover');
        if(Ele.hideHelp) Ele.hideHelp();
        return Ele;
    });
    return Ele;
};


I.observeTap = (Ele, Opt) => {
    if(!Opt) Opt = {};
    if(!Ele.addTapEventListener) {
        Ele.addTapEventListener = (EN, Fun) => {
            if(EN == 'tap') EN = 'taps';
            E.add(Ele, 'bibi:' + EN, Eve => Fun.call(Ele, Eve));
            return Ele;
        };
        Ele.onBibiTap = (Eve, State) => {
            if(Opt.PreventDefault)  Eve.preventDefault();
            if(Opt.StopPropagation) Eve.stopPropagation();
            if(State == 'down') {
                clearTimeout(Ele.Timer_tap);
                Ele.TouchStart = { Time: Date.now(), Event: Eve, Coord: O.getBibiEventCoord(Eve) };
                Ele.Timer_tap = setTimeout(() => delete Ele.TouchStart, 333);
            } else {
                if(Ele.TouchStart) {
                    if((Date.now() - Ele.TouchStart.Time) < 300) {
                        const TouchEndCoord = O.getBibiEventCoord(Eve);
                        if(Math.abs(TouchEndCoord.X - Ele.TouchStart.Coord.X) < 5 && Math.abs(TouchEndCoord.Y - Ele.TouchStart.Coord.Y) < 5) {
                            E.dispatch(Ele, 'bibi:taps',   Ele.TouchStart.Event);
                            E.dispatch(Ele, 'bibi:tapped', Ele.TouchStart.Event);
                        }
                    }
                    delete Ele.TouchStart;
                }
            }
        };
        Ele.addEventListener(E['pointerdown'], Eve => Ele.onBibiTap(Eve, 'down'));
        Ele.addEventListener(E['pointerup'],   Eve => Ele.onBibiTap(Eve, 'up'  ));
    }
    return Ele;
};

I.setTapAction = (Ele) => {
    const onTapped = (() => {
        switch(Ele.Type) {
            case 'toggle': return (Eve) => {
                if(Ele.UIState == 'disabled') return false;
                I.setUIState(Ele, Ele.UIState == 'default' ? 'active' : 'default');
            };
            case 'radio': return (Eve) => {
                if(Ele.UIState == 'disabled') return false;
                Ele.ButtonGroup.Buttons.forEach(Button => { if(Button != Ele) I.setUIState(Button, ''); });
                I.setUIState(Ele, 'active');
            };
            default: return (Eve) => {
                if(Ele.UIState == 'disabled') return false;
                I.setUIState(Ele, 'active');
                clearTimeout(Ele.Timer_deactivate);
                Ele.Timer_deactivate = setTimeout(() => I.setUIState(Ele, Ele.UIState == 'disabled' ? 'disabled' : ''), 200);
            };
        }
    })();
    Ele.addTapEventListener('tapped', Eve => {
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        if(Ele.UIState == 'disabled') return Ele;
        if(Ele.UIState == 'active' && Ele.Type == 'radio') return Ele;
        onTapped(Eve);
        if(Ele.hideHelp) Ele.hideHelp();
        if(Ele.note) setTimeout(Ele.note, 0);
        return Ele;
    });
    return Ele;
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
    if(!O.TouchOS) I.observeHover(Ele);
    I.setHoverActions(Ele);
    I.observeTap(Ele, Opt);
    I.setTapAction(Ele);
    Ele.addTapEventListener('tap',    Eve => Ele.isAvailable && !Ele.isAvailable() ? false : E.dispatch('bibi:is-going-to:tap:ui', Ele));
    Ele.addTapEventListener('tapped', Eve =>                                                 E.dispatch('bibi:tapped:ui',          Ele));
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


I.getBookIcon = () => sML.create('div', { className: 'book-icon', innerHTML: `<span></span>` });




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


export const P = {}; // Bibi.Preset


Bibi.preset = (Preset) => {
    sML.applyRtL(P, Preset, 'ExceptFunctions');
    P.Script = document.getElementById('bibi-preset');
};


P.initialize = (Preset) => {
    O.SettingTypes['boolean'].concat(O.SettingTypes_PresetOnly['boolean']).forEach(PropertyName => {
        if(P[PropertyName] !== true) P[PropertyName] = false;
    });
    O.SettingTypes['yes-no'].concat(O.SettingTypes_PresetOnly['yes-no']).forEach(PropertyName => {
        if(typeof P[PropertyName] == 'string') P[PropertyName] = /^(yes|no|mobile|desktop)$/.test(P[PropertyName]) ? P[PropertyName] : 'no';
        else                                   P[PropertyName] = P[PropertyName] ? 'yes' : 'no';
    });
    O.SettingTypes['string'].concat(O.SettingTypes_PresetOnly['string']).forEach(PropertyName => {
        if(typeof P[PropertyName] != 'string') P[PropertyName] = '';
    });
    O.SettingTypes['integer'].concat(O.SettingTypes_PresetOnly['integer']).forEach(PropertyName => {
        P[PropertyName] = (typeof P[PropertyName] != 'number' || P[PropertyName] < 0) ? 0 : Math.round(P[PropertyName]);
    });
    O.SettingTypes['number'].concat(O.SettingTypes_PresetOnly['number']).forEach(PropertyName => {
        if(typeof P[PropertyName] != 'number') P[PropertyName] = 0;
    });
    O.SettingTypes['array'].concat(O.SettingTypes_PresetOnly['array']).forEach(PropertyName => {
        if(!(P[PropertyName] instanceof Array)) P[PropertyName] = [];
    });
    if(!/^(horizontal|vertical|paged)$/.test(P['reader-view-mode'])) P['reader-view-mode'] = 'paged';
    P['bookshelf'] = (!P['bookshelf'] || typeof P['bookshelf'] != 'string') ? '' : new URL(P['bookshelf'], P.Script.src).href;
    P['extensions'] = !(P['extensions'] instanceof Array) ? [] : P['extensions'].filter(Xtn => {
        if(Xtn.hasOwnProperty('-spell-of-activation-') && (!Xtn['-spell-of-activation-'] || typeof Xtn['-spell-of-activation-'] != 'string' || !U.hasOwnProperty(Xtn['-spell-of-activation-']))) return false;
        if(!Xtn || !Xtn['src'] || typeof Xtn['src'] != 'string') return false;
        return (Xtn['src'] = new URL(Xtn['src'], P.Script.src).href);
    });
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- HTML-Defined Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


export const H = {};


H.initialize = () => {
    const Extensions = document.getElementById('bibi-script').getAttribute('data-bibi-extensions')
    const Bookshelf  = document.getElementById('bibi-preset').getAttribute('data-bibi-bookshelf');
    const Book       = O.Body.getAttribute('data-bibi-book');
    if(Bookshelf ) H['bookshelf']  = new URL(Bookshelf, location.href.split('?')[0]).href;
    if(Book      ) H['book']       = Book;
    const BookDataElement = document.getElementById('bibi-book-data');
    if(BookDataElement) {
        if(BookDataElement.innerText.trim()) {
            const BookDataMIMEType = BookDataElement.getAttribute('data-bibi-book-mimetype');
            if(typeof BookDataMIMEType == 'string' && /^application\/(epub\+zip|zip|x-zip(-compressed)?)$/i.test(BookDataMIMEType)) {
                H.BookDataElement = BookDataElement;
            }
        }
        if(!H.BookDataElement) {
            BookDataElement.innerHTML = '';
            BookDataElement.parentNode.removeChild(BookDataElement);
        }
    }
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- URI-Defined Settings (FileName, Queries, Hash, and EPUBCFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


export const U = (LS => {
    if(typeof LS != 'string') return {};
    LS = LS.replace(/^\?/, '');
    const Qs = {};
    LS.split('&').forEach(PnV => {
        PnV = PnV.split('=');
        if(/^[a-zA-Z0-9_\-]+$/.test(PnV[0])) Qs[PnV[0]] = PnV[1];
    });
    if(Qs.hasOwnProperty('debug')) {
        Bibi.Debug = true;
        Qs['log'] = 9;
    }
    return Qs;
})(location.search);


U.initialize = () => { // formerly O.readExtras
    if( U['book']) U['book'] = decodeURIComponent(U['book']).trim() || '';
    if(!U['book']) delete U['book'];
    const HashData = U.parseHash(location.hash);
    if(HashData['bibi']) {
        U.importFromDataString(HashData['bibi']);
    }
    if(HashData['jo']) {
        U.importFromDataString(HashData['jo']);
        if(U['parent-origin'] && U['parent-origin'] != O.Origin) P['trustworthy-origins'].push(U['parent-origin']);
        if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]jo\([^\)]*\)$/g, ''));
    }
    if(HashData['epubcfi']) {
        U['epubcfi'] = HashData['epubcfi'];
        E.add('bibi:readied', () => { if(X['EPUBCFI']) S['to'] = U['to'] = X['EPUBCFI'].getDestination(H['epubcfi']); });
    }
};

    U.parseHash = (Hash) => {
        const Data = {}, ParREStr = '([a-z_]+)\\(([^\\(\\)]+)\\)';
        if(typeof Hash != 'string') return Data;
        //if(!new RegExp('^#?' + ParREStr + '(,' + ParREStr + ')*$').test(Hash)) return Data;
        const Pars = Hash.match(new RegExp(ParREStr, 'g'));
        if(!Pars || !Pars.length) return Data;
        Pars.forEach(Par => {
            const Label_KnV = Par.match(new RegExp(ParREStr));
            Data[Label_KnV[1]] = Label_KnV[2];
        });
        return Data;
    };

    U.importFromDataString = (DataString) => {
        if(typeof DataString != 'string') return false;
        DataString.replace(' ', '').split(',').forEach(PnV => {
            PnV = PnV.split(':'); if(PnV.length != 2) return;
            switch(PnV[0]) {
                case 'parent-title':
                case 'parent-uri':
                case 'parent-origin':
                case 'parent-jo-path':
                case 'parent-bibi-label':
                case 'parent-holder-id':
                    PnV[1] = decodeURIComponent(PnV[1].replace('_BibiKakkoClose_', ')').replace('_BibiKakkoOpen_', '(')); if(!PnV[1]) PnV[1] = ''; 
                    break;
                case 'to':
                    PnV[1] = R.getBibiToDestination(PnV[1]); if(!PnV[1]) return;
                    break;
                case 'nav':
                    if(/^[1-9][0-9]*$/.test(PnV[1])) PnV[1] *= 1; else return;
                    break;
                case 'si-ppis':
                    if(/^\d+\-(0(\.\d+)*|1)$/.test(PnV[1])) PnV[1] = { 'SI-PPiS': PnV[1] }; else return;
                    break;
                case 'horizontal':
                case 'vertical':
                case 'paged':
                    PnV = ['reader-view-mode', PnV[0]];
                    break;
                case 'reader-view-mode':
                    if(!/^(horizontal|vertical|paged)$/.test(PnV[1])) return;
                    break;
                case 'default-page-progression-direction':
                    if(!/^(ltr|rtl)$/.test(PnV[1])) return;
                    break;
                default:
                    if(O.SettingTypes['boolean'].concat(O.SettingTypes_UserOnly['boolean']).includes(PnV[0])) {
                             if(PnV[1] == 'true' ) PnV[1] = true;
                        else if(PnV[1] == 'false') PnV[1] = false;
                        else return;
                    } else if(O.SettingTypes['yes-no'].concat(O.SettingTypes_UserOnly['yes-no']).includes(PnV[0])) {
                        if(!/^(yes|no|mobile|desktop)$/.test(PnV[1])) return;
                    } else if(O.SettingTypes['integer'].concat(O.SettingTypes_UserOnly['integer']).includes(PnV[0])) {
                        if(/^(0|[1-9][0-9]*)$/.test(PnV[1])) PnV[1] *= 1; else return;
                    } else if(O.SettingTypes['number'].concat(O.SettingTypes_UserOnly['number']).includes(PnV[0])) {
                        if(/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(PnV[1])) PnV[1] *= 1; else return;
                    } else {
                        return;
                    }
            }
            if(!PnV[0] || typeof PnV[1] == 'undefined') return;
            U[PnV[0]] = PnV[1];
        });
        if(U['si-ppis']) {
            delete U['nav'];
            U['to'] = U['si-ppis'];
        } else if(U['nav']) {
            delete U['to'];
        } // Priority: to < nav < si-ppis
        return U;
    };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


export const S = {}; // Bibi.Settings


S.initialize = (before, after) => {
    if(before) before();
    // --------
    for(const Property in S) if(typeof S[Property] != 'function') delete S[Property];
    sML.applyRtL(S, P, 'ExceptFunctions');
    sML.applyRtL(S, H, 'ExceptFunctions');
    sML.applyRtL(S, U, 'ExceptFunctions');
    O.SettingTypes['yes-no'].concat(O.SettingTypes_PresetOnly['yes-no']).concat(O.SettingTypes_UserOnly['yes-no']).forEach(Property => {
        S[Property] = (typeof S[Property] == 'string') ? (S[Property] == 'yes' || (S[Property] == 'mobile' && O.TouchOS) || (S[Property] == 'desktop' && !O.TouchOS)) : false;
    });
    // --------
    S['bookshelf'] = (typeof S['bookshelf'] == 'string' && S['bookshelf']) ? S['bookshelf'].replace(/\/$/, '') : '';
    S['book']      = (typeof S['book']      == 'string' && S['book']     ) ? new URL(S['book'], S['bookshelf'] + '/').href : '';
    B.Type = !S['book'] ? '' : U.hasOwnProperty('zine') ? 'Zine' : 'EPUB';
    S['extract-if-necessary'] = (() => {
        if(!S['extract-if-necessary'].length) return [];
        if(S['extract-if-necessary'].includes('*')) return ['*'];
        const UnzipIfNecessary = [];
        for(let l = S['extract-if-necessary'].length, i = 0; i < l; i++) {
            let Ext = S['extract-if-necessary'][i];
            if(typeof Ext != 'string' || !/^(\.[\w\d]+)*$/.test(Ext)) continue;
            Ext = Ext.toLowerCase();
            if(!UnzipIfNecessary.includes(Ext)) UnzipIfNecessary.push(Ext);
        }
        return UnzipIfNecessary;
    })();
    if(S['book'] || !window.File) S['accept-local-file'] = false, S['accept-blob-converted-data'] = false, S['accept-base64-encoded-data'] = false;
    else                          S['accept-local-file'] = S['accept-local-file'] && (S['extract-if-necessary'].includes('*') || S['extract-if-necessary'].includes('.epub') || S['extract-if-necessary'].includes('.zip')) ? true : false;
    if(!S['trustworthy-origins'].includes(O.Origin)) S['trustworthy-origins'].unshift(O.Origin);
    // --------
    S['autostart'] = (() => {
        if( S['wait']) return false;
        if(!S['book']) return true;
        return O.Embedded ? S['autostart-embedded'] : S['autostart'];
    })();
    S['start-in-new-window'] = (O.Embedded && !S['autostart']) ? S['start-embedded-in-new-window'] : false;
    // --------
    S['default-page-progression-direction'] = S['default-page-progression-direction'] == 'rtl' ? 'rtl' : 'ltr';
    const MaxOfHistoryAndBookmarks = { 'history': 19, 'bookmarks': 9 };
    ['history', 'bookmarks'].forEach(_ => {
        S['max-' + _] = !S['use-' + _] ? 0 : S['max-' + _] > MaxOfHistoryAndBookmarks[_] ? MaxOfHistoryAndBookmarks[_] : S['max-' + _];
        if(S['max-' + _] == 0) S['use-' + _] = false;
    });
    if(!S['use-menubar']) S['use-full-height'] = true;
    // --------
    E.bind('bibi:initialized-book', () => {
        const BookBiscuits = O.Biscuits.remember('Book');
        if(S['keep-settings']) {
            if(!U['reader-view-mode']              && BookBiscuits['RVM']) S['reader-view-mode']              = BookBiscuits['RVM'];
            if(!U['full-breadth-layout-in-scroll'] && BookBiscuits['FBL']) S['full-breadth-layout-in-scroll'] = BookBiscuits['FBL'];
        }
        if(S['resume-from-last-position']) {
            if(!U['to'] && BookBiscuits['Position']) S['to'] = sML.clone(BookBiscuits['Position']);
        }
    });
    // --------
    if(after) after();
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
    O.PaginateWithCSSShapes = (sML.UA.Trident || sML.UA.EdgeHTML) ? false : true;
    O.ReverseItemPaginationDirectionIfNecessary = (sML.UA.Trident || sML.UA.EdgeHTML) ? false : true;
};


S.update = (Settings) => {
    const Prev = {}; for(const Mode in S.Modes) Prev[Mode] = S[Mode];
    if(typeof Settings == 'object') for(const Property in Settings) if(typeof S[Property] != 'function') S[Property] = Settings[Property];
    S['book-rendition-layout'] = B.Package.Metadata['rendition:layout'];
    S['allow-placeholders'] = (S['allow-placeholders'] && B.AllowPlaceholderItems);
    if(S.FontFamilyStyleIndex) sML.deleteCSSRule(S.FontFamilyStyleIndex);
    if(S['ui-font-family']) S.FontFamilyStyleIndex = sML.appendCSSRule('html', 'font-family: ' + S['ui-font-family'] + ' !important;');
    S['page-progression-direction'] = B.PPD;
    if(O.PaginateWithCSSShapes) {
        S['spread-layout-axis'] = S['reader-view-mode'] == 'vertical' ? 'vertical' : 'horizontal';
    } else {
        S['spread-layout-axis'] = (() => {
            if(S['reader-view-mode'] != 'paged') return S['reader-view-mode'];
            if(S['book-rendition-layout'] == 'reflowable') switch(B.WritingMode) {
                case 'tb-rl': case 'tb-lr': return   'vertical'; ////
            }                               return 'horizontal';
        })();
    }
        S['spread-layout-direction'] = (S['spread-layout-axis'] == 'vertical') ? 'ttb'        : S['page-progression-direction'];
     S['apparent-reading-axis']      = (S['reader-view-mode']   == 'paged'   ) ? 'horizontal' : S['reader-view-mode'];
     S['apparent-reading-direction'] = (S['reader-view-mode']   == 'vertical') ? 'ttb'        : S['page-progression-direction'];
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
};

    C.probe = (L_A, AXIS) => {
        const LR_RL = ['left', 'right']; if(S.PPD != 'ltr') LR_RL.reverse();
        if(AXIS == 'horizontal') {
            C._app(L_A, 'BASE', { b: LR_RL[0], a: LR_RL[1], s: 'top', e: 'bottom' });
            C._app(L_A, 'SIZE', { b: 'height', l: 'width'                         });
            C._app(L_A, 'OOBL', { b: 'top',    l: 'left'                          });
            C._app(L_A, 'AXIS', { b: 'y',      l: 'x'                             }); C[L_A + '_AXIS_D'] = S.PPD == 'ltr' ? 1 : -1;
        } else {
            C._app(L_A, 'BASE', { b: 'top', a: 'bottom', s: LR_RL[0], e: LR_RL[1] });
            C._app(L_A, 'SIZE', { b: 'width',  l: 'height'                        });
            C._app(L_A, 'OOBL', { b: 'left',   l: 'top'                           });
            C._app(L_A, 'AXIS', { b: 'x',      l: 'y'                             }); C[L_A + '_AXIS_D'] = 1;
        }
        // BASE: Directions ("B"efore-"A"fter-"S"tart-"E"nd. Top-Bottom-Left-Right on TtB, Left-Right-Top-Bottom on LtR, and Right-Left-Top-Bottom on RtL.)
        // SIZE: Breadth, Length (Width-Height on TtB, Height-Width on LtR and RtL.)
        // OOBL: "O"ffset "O"rigin of "B"readth and "L"ength
        // AXIS: X or Y for Breadth and Length (X-Y on TtB, Y-X on LtR and RtL), and ±1 for Culcuration of Length (1 on TtB and LtR, -1 on RtL.)
    };

        C._app = (L_A, Gauge, Par) => {
            for(const Pro in Par) C[[L_A, Gauge,                Pro ].join('_')] =                Par[Pro] ,
                                  C[[L_A, Gauge, sML.capitalise(Pro)].join('_')] = sML.capitalise(Par[Pro]);
        };




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
        case '<e/>': throw '\n' + Log;
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
            case '</b>': Ls.unshift(`📖`); Ls.push('%c' + Log), Ss.push(O.log.BStyle); if(O.log.Limit) Ls.push(`%c(${ Math.floor(Time / 1000) + '.' + (Time % 1000 + '').padStart(3, 0) }sec)`), Ss.push(O.log.NStyle); break;
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
        O.log.Limit = !U.hasOwnProperty('log') ? 0 : /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(U['log']) ? U['log'] : 1;
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

O.logSets = (...Args) => {
    let Repeats = [], Sets = []; Sets.length = 1;
    Args.reverse();
    for(let i = 0; i < Args.length; i++) {
        if(!Args[i].map) Args[i] = [Args[i]];
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
};


O.error = (Msg) => {
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('loading');
    O.HTML.classList.remove('waiting');
    E.dispatch('bibi:x_x', Msg);
    O.log(Msg, '<e/>');
};


O.TimeCard = {};

O.getTimeLabel = (TimeFromOrigin = Date.now() - Bibi.TimeOrigin) => [
    TimeFromOrigin / 1000 / 60 / 60,
    TimeFromOrigin / 1000 / 60 % 60,
    TimeFromOrigin / 1000 % 60
].map(Val => (Math.floor(Val) + '').padStart(2, 0)).join(':') + '.' + (TimeFromOrigin % 1000 + '').padStart(3, 0);

O.stamp = (What, TimeCard = O.TimeCard) => {
    const TimeFromOrigin = Date.now() - Bibi.TimeOrigin;
    const TimeLabel = O.getTimeLabel(TimeFromOrigin);
    if(!TimeCard[TimeLabel]) TimeCard[TimeLabel] = [];
    TimeCard[TimeLabel].push(What);
    return TimeFromOrigin;
};
//O.stamp = () => '';


O.isToBeExtractedIfNecessary = (Path) => {
    if(!Path || !S['extract-if-necessary'].length) return false;
    if(S['extract-if-necessary'].includes('*')) return true;
    if(S['extract-if-necessary'].includes( '')) return !/(\.[\w\d]+)+$/.test(Path);
    for(let l = S['extract-if-necessary'].length, i = 0; i < l; i++) if(new RegExp(S['extract-if-necessary'][i].replace(/\./g, '\\.') + '$', 'i').test(Path)) return true;
    return false;
};


O.item = (Item) => {
    if(!Item.Path) throw `Path Not Defined`;
    if(!B.Package.Manifest.Items[Item.Path]) B.Package.Manifest.Items[Item.Path] = Item;
    return B.Package.Manifest.Items[Item.Path];
};


O.RangeLoader = null;

O.cancelExtraction = (Item) => { try { return O.RangeLoader.abort(Item.Path); } catch(Err) {} return false; };

O.extract = (Item) => {
    Item = O.item(Item);
    return O.RangeLoader.getBuffer(Item.Path).then(ABuf => {
        if(O.isBin(Item)) Item.DataType = 'Blob', Item.Content = new Blob([ABuf], { type: Item['media-type'] });
        else              Item.DataType = 'Text', Item.Content = new TextDecoder('utf-8').decode(new Uint8Array(ABuf));
        return Item;
    }).catch(() => Promise.reject());
};

O.download = (Item/*, Opt = {}*/) => new Promise((resolve, reject) => {
    Item = O.item(Item);
    if(Item.Content) return resolve(Item);
    const IsBin = O.isBin(Item);
    const XHR = new XMLHttpRequest(); //if(Opt.MimeType) XHR.overrideMimeType(Opt.MimeType);
    const RemotePath = (/^([a-z]+:\/\/|\/)/.test(Item.Path) ? '' : B.Path + '/') + Item.Path;
    XHR.open('GET', RemotePath, true); // async
    XHR.responseType = IsBin ? 'blob' : 'text';
    XHR.onerror   = () => reject(`${ XHR.status === 404 ? 'File Not Found' : 'Could Not Download File' }: "${ RemotePath }"`);
    XHR.onloadend = () => {
        if(XHR.status !== 200) return XHR.onerror();
        Item.Content = XHR.response;
        Item.DataType = IsBin ? 'Blob' : 'Text';
        resolve(Item);
    };
    XHR.send(null);
});

O.tryRangeRequest = (Path = Bibi.Script.src, Bytes = '0-0') => new Promise((resolve, reject) => {
    const XHR = new XMLHttpRequest;
    XHR.onloadend = () => XHR.status != 206 ? reject() : resolve();
    XHR.open('GET', Path, true);
    XHR.setRequestHeader('Range', 'bytes=' + Bytes);
    XHR.send(null);
});


O.file = (Item, Opt = {}) => new Promise((resolve, reject) => {
    Item = O.item(Item);
    if(Opt.URI) {
        //if(!B.ExtractionPolicy) Item.URI = O.fullPath(Item.Path), Item.Content = '';
        if(Item.URI) return resolve(Item);
    }
    let _Promise = null;
    (() => {
        if(Item.Content) return Promise.resolve(Item);
        switch(B.ExtractionPolicy) {
            case 'at-once':    return Promise.reject(`File Not Included: "${ Item.Path }"`);
            case 'on-the-fly': return O.extract(Item);
        }
        return O.download(Item);
    })().then(Item => (Opt.Preprocess && !Item.Preprocessed) ? O.preprocess(Item) : Item).then(() => {
        if(Opt.URI) O.getBlobURL(Item).then(Item => { Item.Content = ''; resolve(Item); });
        else resolve(Item);
     }).catch(reject);
});


O.isBin = (Item) => /\.(aac|gif|jpe?g|m4[av]|mp[g34]|ogg|[ot]tf|pdf|png|web[mp]|woff2?)$/i.test(Item.Path);


O.getBlobURL = (Item) => new Promise(resolve => {
    Item = O.item(Item);
    if(!Item.URI) {
        // if(!Item.Content) throw `Item "${Item.id}" Has No Content. (O.getBlobURL)`;
        Item.URI = URL.createObjectURL(Item.DataType == 'Blob' ? Item.Content: new Blob([Item.Content], { type: Item['media-type'] }));
    }
    resolve(Item);
});


O.getDataURI = (Item) => new Promise(resolve => {
    Item = O.item(Item);
    // if(!Item.Content) throw `Item "${Item.id}" Has No Content. (O.getDataURI)`;
    // if(Item.DataType != 'Text') throw `Item Content Is Not Text.`;
    if(Item.URI) resolve(Item);
    else if(Item.DataType == 'Text') {
        Item.URI = 'data:' + Item['media-type'] + ';base64,' + btoa(unescape(encodeURIComponent(Item.Content)));
        resolve(Item);
    } else {
        const FR = new FileReader();
        FR.onload = () => {
            Item.URI = FR.result;
            resolve(Item);
        };
        FR.readAsDataURL(Item.Content);
    }
});


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
    'webm'    :       'video/webm'
};


O.preprocess = (Item) => {
    Item = O.item(Item);
    // if(!Item.Content) throw `Item "${Item.id}" Has No Content. (O.preprocess)`;
    const ResItems = [];
    const Setting = O.preprocess.getSetting(Item.Path); if(!Setting) return Promise.resolve(Item.Content);
    const Promises = [];
    if(Setting.ReplaceRules) Item.Content = Setting.ReplaceRules.reduce((ItemContent, Rule) => ItemContent.replace(Rule[0], Rule[1]), Item.Content);
    if(Setting.ResolveRules) { // RRR
        const FileDir = Item.Path.replace(/\/?[^\/]+$/, '');
        Setting.ResolveRules.forEach(ResolveRule => ResolveRule.Patterns.forEach(Pattern => {
            const ResRE = ResolveRule.getRE(Pattern.Attribute);
            const Reses = Item.Content.match(ResRE);
            if(!Reses) return;
            const ExtRE = new RegExp('\\.(' + Pattern.Extensions + ')$', 'i');
            Reses.forEach(Res => {
                const ResPathInSource = Res.replace(ResRE, ResolveRule.PathRef);
                const ResPaths = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? './' : '') + ResPathInSource).split('#');
                if(!ExtRE.test(ResPaths[0])) return;
                ResItems.push(O.item({ Path: ResPaths[0] }));
                //const Promised = (!B.ExtractionPolicy && !Pattern.ForceURI) ? Promise.resolve(B.Path + '/' + ResPaths[0]) : O.file({ Path: ResPaths[0] }, { Preprocess: true, URI: true });
                const Promised = O.file({ Path: ResPaths[0] }, { Preprocess: true, URI: true });
                Promises.push(Promised.then(ChildItem => {
                    ResPaths[0] = ChildItem.URI;
                    Item.Content = Item.Content.replace(Res, Res.replace(ResPathInSource, ResPaths.join('#')));
                }));
            });
        }));
    }
    return Promise.all(Promises).then(() => {
        Item.Preprocessed = true;
        Item.ResItems = ResItems;
        return Item;
    });
};

    O.preprocess.getSetting = (FilePath) => { const PpSs = O.preprocess.Settings;
        for(const Ext in PpSs) if(new RegExp('\\.(' + Ext + ')$', 'i').test(FilePath)) return typeof PpSs[Ext].init == 'function' ? PpSs[Ext].init() : PpSs[Ext];
        return null;
    };

    O.preprocess.Settings = {
        'css': {
            ReplaceRules: [
                [/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, '']
            ],
            ResolveRules: [{
                getRE: () => /@import\s+["'](?!(?:https?|data):)(.+?)['"]/g,
                PathRef: '$1',
                Patterns: [
                    { Extensions: 'css', ForceURI: true }
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
                    { Attribute: 'href',           Extensions: 'css', ForceURI: true },
                    { Attribute: 'src',            Extensions: 'svg', ForceURI: true },
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
                    { Attribute: 'href',           Extensions: 'css', ForceURI: true },
                    { Attribute: 'src',            Extensions: 'js|svg', ForceURI: true },//{ Attribute: 'src',        Extensions: 'js|svg|xml|xht(ml?)?|html?', ForceURI: true },
                    { Attribute: 'src|xlink:href', Extensions: 'gif|png|jpe?g' }
                ]
            }]
        }
    };


O.parseDocument = (Item) => (new DOMParser()).parseFromString(Item.Content, /\.(xml|opf|ncx)$/i.test(Item.Path) ? 'text/xml' : 'text/html');


O.openDocument = (Item) => O.file(Item).then(O.parseDocument).catch(O.error);


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


O.isAnchorContent = (Ele) => {
    while(Ele) {
        if(/^a$/i.test(Ele.tagName)) return true;
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

O.getBibiEventCoord = (Eve) => { const EventCoord = { X: 0, Y: 0 };
    if(/^touch/.test(Eve.type)) {
        EventCoord.X = Eve.changedTouches[0].pageX;
        EventCoord.Y = Eve.changedTouches[0].pageY;
    } else {
        EventCoord.X = Eve.pageX;
        EventCoord.Y = Eve.pageY;
    }
    if(Eve.target.ownerDocument.documentElement == O.HTML) {
        EventCoord.X -= O.Body.scrollLeft;
        EventCoord.Y -= O.Body.scrollTop;
    } else {
        const Main = R.Main;
        const MainScale = Main.Transformation.Scale;
        const MainTransformOriginInMain_X = Main.offsetWidth  / 2;
        const MainTransformOriginInMain_Y = Main.offsetHeight / 2;
        const MainTranslation_X = Main.Transformation.TranslateX;
        const MainTranslation_Y = Main.Transformation.TranslateY;
        const Item = Eve.target.ownerDocument.documentElement.Item;
        const ItemScale = Item.Scale;
        const ItemCoordInMain = O.getElementCoord(Item, Main);
        if(Item.Ref['rendition:layout'] != 'pre-paginated' && !Item.Outsourcing) ItemCoordInMain.X += S['item-padding-left'], ItemCoordInMain.Y += S['item-padding-top'];
        EventCoord.X = Math.floor(Main.offsetLeft + ((MainTransformOriginInMain_X + MainTranslation_X) + ((((ItemCoordInMain.X + (EventCoord.X * ItemScale)) - Main.scrollLeft) - MainTransformOriginInMain_X) * MainScale)));
        EventCoord.Y = Math.floor(Main.offsetTop  + ((MainTransformOriginInMain_Y + MainTranslation_Y) + ((((ItemCoordInMain.Y + (EventCoord.Y * ItemScale)) - Main.scrollTop ) - MainTransformOriginInMain_Y) * MainScale)));
        //                       (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation  ) + ((((ItemCoord_in_Main + EventCoord_in_Item        ) - ScrolledLength ) - MainTransformOrigin_in_Main) * MainScale)))
        //                       (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation  ) + (((EventCoord_in_Main                               - ScrolledLength ) - MainTransformOrigin_in_Main) * MainScale)))
        //                       (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation  ) + ((EventCoord_in_Viewport_of_Main                                       - MainTransformOrigin_in_Main) * MainScale)))
        //                       (MainCoord       + ((MainTransformOrigin_in_Main + MainTranslation  ) + (EventCoord_from_MainTransformOrigin_in_Main                                                          * MainScale)))
        //                       (MainCoord       + (MainTransformOrigin_in_Translated-Main            + EventCoord_from_TransformOrigin_in_Scaled-Main                                                                    ))
        //                       (MainCoord       + EventCoord_in_Transformed-Main                                                                                                                                          )
        //                       EventCoord
    }/*
    console.log(
        `[${ Eve.target.ownerDocument.documentElement == O.HTML ? 'PARENT' : 'CHILD' }]`,
        EventCoord,
        {
            X: Eve.screenX - window.screenX - (window.outerWidth  - window.innerWidth),
            Y: Eve.screenY - window.screenY - (window.outerHeight - window.innerHeight)
        },
        Eve
    );//*/
    return EventCoord;
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
        if(typeof Tag != 'string') {
            O.Biscuits.__forget_about_cookies();
            O.Biscuits.LabelBase = 'BibiBiscuits:' + P.Script.src.replace(new RegExp('^' + O.Origin.replace(/([\/\.])/g, '\\$1')), '');
            E.bind('bibi:initialized',      () => O.Biscuits.initialize('Bibi'));
            E.bind('bibi:initialized-book', () => O.Biscuits.initialize('Book'));
            return null;
        }
        if(Tag != 'Bibi' && Tag != 'Book') return null;
        const Label = O.Biscuits.Labels[Tag] = O.Biscuits.LabelBase + (Tag == 'Book' ? '#' + B.ID.replace(/^urn:uuid:/, '') : '');
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
                if(Keys instanceof Array) Keys.forEach(Key => (typeof Key != 'string' || !Key) ? false : delete O.Biscuits.Memories[Label][Key]);
                localStorage.setItem(Label, JSON.stringify(O.Biscuits.Memories[Label]));
            }
        }
        return O.Biscuits.Memories;
    },
    __forget_about_cookies: () => setTimeout(() => { try { sML.Cookies.write(O.Cookies.Label, '', { Expires: 0 }); } catch(Err) {} }, 999)
};


O.SettingTypes = {
    'boolean': [
        'prioritise-fallbacks'
    ],
    'yes-no': [
        'accept-orthogonal-input',
        'allow-placeholders',
        'animate-page-flipping',
        'autostart',
        'autostart-embedded',
        'double-spread-for-reflowable',
        'fix-nav-ttb',
        'fix-reader-view-mode',
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
        'slider-mode',
        'default-page-progression-direction'
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
        'orientation-border-ratio'
    ],
    'array': [
    ]
};

O.SettingTypes_PresetOnly = {
    'boolean': [
        'accept-base64-encoded-data',
        'accept-blob-converted-data',
        'remove-bibi-website-link'
    ],
    'yes-no': [
        'accept-local-file',
        'keep-settings',
        'resume-from-last-position'
    ],
    'string': [
    ],
    'integer': [
        'max-history',
        'max-bookmarks',
    ],
    'number': [
    ],
    'array': [
        'trustworthy-origins',
        'extract-if-necessary'
    ]
};

O.SettingTypes_UserOnly = {
    'boolean': [
        'wait'
    ],
    'yes-no': [
    ],
    'integer': [
        'nav'
    ],
    'number': [
    ],
    'array': [
    ]
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events

//----------------------------------------------------------------------------------------------------------------------------------------------


export const E = {};


E.initialize = () => {
    sML.applyRtL(E, new sML.CustomEvents('bibi'));
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
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Messages

//----------------------------------------------------------------------------------------------------------------------------------------------


export const M = {}; // Bibi.Messages


M.post = (Msg, TargetOrigin) => {
    if(!O.Embedded) return false;
    if(typeof Msg != 'string' || !Msg) return false;
    if(typeof TargetOrigin != 'string' || !TargetOrigin) TargetOrigin = '*';
    return window.parent.postMessage(Msg, TargetOrigin);
};


M.receive = (Data) => {
    try {
        Data = JSON.parse(Data);
        if(typeof Data != 'object' || !Data) return false;
        for(const EventName in Data) if(/^bibi:commands:/.test(EventName)) E.dispatch(EventName, Data[EventName]);
        return true;
    } catch(_) {}
    return false;
};


M.gate = (Eve) => {
    if(!Eve || !Eve.data) return;
    for(let l = S['trustworthy-origins'].length, i = 0; i < l; i++) if(S['trustworthy-origins'][i] == Eve.origin) return M.receive(Eve.data);
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
