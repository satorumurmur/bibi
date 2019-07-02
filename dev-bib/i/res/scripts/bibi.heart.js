/*!
 *                                                                                                                          (℠)
 *  ## BiB/i (heart) | Heart of Bibi.
 *
 */




export const Bibi = { 'version': '____bibi-version____', 'href': 'https://bibi.epub.link', TimeOrigin: Date.now() };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Hello !

//----------------------------------------------------------------------------------------------------------------------------------------------


Bibi.hello = () => (hello => {
    O.initialize();
    document.addEventListener('DOMContentLoaded',
        (sML.UA.InternetExplorer || (sML.UA.Edge && !sML.UA.Chromium))
            ? () => document.head.insertBefore(sML.create('script', { id: 'bibi-polyfills', src: './res/scripts/bibi.polyfills.js', onload: hello }), document.getElementById('bibi-script'))
            : hello
    );
})(() => {
    O.log(`Hello!`, '<b:>');
    O.log(`[ja] ${ Bibi['href'] }`);
    O.log(`[en] https://github.com/satorumurmur/bibi`);
    Bibi.load();
});


Bibi.load = () => Promise.resolve()
    .then(Bibi.loadPreset)
    .then(Bibi.initialize)
    .then(Bibi.loadExtensions)
    .then(Bibi.ready)
    .then(Bibi.loadBook);


Bibi.loadPreset = () => new Promise(resolve => {
    O.log(`Loading Preset...`, '<g:>');
    const PresetSource = document.getElementById('bibi-script').getAttribute('data-bibi-preset') || './presets/default.js';
    document.head.appendChild(sML.create('script', { src: PresetSource, onload: resolve }));
}).then(() => {
    O.log(`Preset: %O`, P);
    O.log(`Loaded.`, '</g>');
});


Bibi.initialize = () => {

    O.contentWindow = window;
    O.contentDocument = document;

    O.HTML  = document.documentElement; O.HTML.classList.add(...sML.Environments.concat(['bibi', 'welcome']));
    O.Head  = document.head;
    O.Body  = document.body;
    O.Info  = document.getElementById('bibi-info');
    O.Title = document.getElementsByTagName('title')[0];

    O.RequestedURL = location.href;
    O.BookURL = O.Origin + location.pathname + location.search;

    O.Language = (Lans => {
        for(let l = Lans.length, i = 0; i < l; i++) {
            const Lan = Lans[i].split ? Lans[i].split('-')[0] : '';
            if(Lan == 'ja') return 'ja';
            if(Lan == 'en') break;
        }                   return 'en';
    })(navigator.languages instanceof Array ? navigator.languages : navigator.language ? [navigator.language] : []);

    // Device & Event
    if(sML.OS.iOS || sML.OS.Android) {
        O.Touch = true;
        O.HTML.classList.add('touch');
        if(sML.OS.iOS) {
            O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-capable',          content: 'yes'   }));
            O.Head.appendChild(sML.create('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'white' }));
        }
        O['resize'] = 'orientationchange';
        O['pointerdown'] = 'touchstart';
        O['pointermove'] = 'touchmove';
        O['pointerup']   = 'touchend';
    } else {
        O.Touch = false;
        O['resize'] = 'resize';
        if(sML.UA.InternetExplorer || (sML.UA.Edge && !sML.UA.Chromium)) {
            O['pointerdown'] = 'pointerdown';
            O['pointermove'] = 'pointermove';
            O['pointerup']   = 'pointerup';
            O['pointerover'] = 'pointerover';
            O['pointerout']  = 'pointerout';
        } else {
            O['pointerdown'] = 'mousedown';
            O['pointermove'] = 'mousemove';
            O['pointerup']   = 'mouseup';
            O['pointerover'] = 'mouseover';
            O['pointerout']  = 'mouseout';
        }
    }

    E.initialize();
    R.initialize();
    I.initialize();

    if(sML.UA.InternetExplorer < 11) {
        // Say Bye-bye
        const Msg = {
            en: `<span>I\'m so Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible with BiB/i.</span>`,
            ja: `<span>大変申し訳ありません。</span> <span>お使いのブラウザでは、</span><span>ビビは動作しません。</span>`
        };
        I.Veil.ByeBye = I.Veil.appendChild(
            sML.create('p', { id: 'bibi-veil-byebye',
                innerHTML: [
                    `<span lang="en">${ Msg['en'] }</span>`,
                    `<span lang="ja">${ Msg['ja'] }</span>`,
                ].join('').replace(/(BiB\/i|ビビ)/g, `<a href="${ Bibi['href'] }" target="_blank">$1</a>`)
            })
        );
        O.HTML.classList.remove('welcome');
        I.note(`Your Browser Is Not Compatible`, 99999999999, 'ErrorOccured');
        E.dispatch('bibi:says-byebye');
        return O.error(Msg['en'].replace(/<[^>]*>/g, ''));
    }

    I.note(`Welcome!`);

    U.initialize();

    // Window Embedding
    if(window.parent == window) {
        O.WindowEmbedded = 0; // false
        O.WindowEmbeddedDetail = 'Direct Opened: ' + O.Origin + location.pathname + location.search;
        O.HTML.classList.add('window-not-embedded');
    } else {
        O.WindowEmbedded = -1; // true
        O.HTML.classList.add('window-embedded');
        try {
            if(location.host == parent.location.host || parent.location.href) {
                O.WindowEmbedded = 1; // true
                O.WindowEmbeddedDetail = 'Embedded in: ' + O.getOrigin(parent) + parent.location.pathname + parent.location.search;
                O.ParentHolder = window.parent.document.getElementById(U['parent-holder-id']);
            }
        } catch(e) {}
        if(O.WindowEmbedded == -1) O.WindowEmbeddedDetail = 'Embedded in: Unreachable Parent';
    }

    // Fullscreen
    { let FsT = null;
             if(!O.WindowEmbedded) sML.Fullscreen.polyfill(window       ),  FsT = O.HTML                   ;
        else if( O.ParentHolder  ) sML.Fullscreen.polyfill(window.parent),  FsT = O.ParentHolder.Bibi.Frame;
        if(FsT && FsT.ownerDocument.fullscreenEnabled) O.FullscreenTarget = FsT,  O.HTML.classList.add('fullscreen-enabled');
    }

    // Writing Mode/* & Font Size*/
    O.WritingModeProperty = (() => {
        const HTMLCS = getComputedStyle(O.HTML);
        if(/^(vertical|horizontal)-/.test(HTMLCS['-webkit-writing-mode'])) return '-webkit-writing-mode';
        if(/^(vertical|horizontal)-/.test(HTMLCS['writing-mode']) || sML.UA.InternetExplorer) return 'writing-mode';
        else return undefined;
    })();/*
    const SRI4VTC = sML.appendCSSRule('div#bibi-vtc', 'position: absolute; left: -100px; top: -100px; width: 100px; height: 100px; -webkit-writing-mode: vertical-rl; -ms-writing-mode: tb-rl; writing-mode: vertical-rl;');
    const VTC = document.body.appendChild(sML.create('div', { id: 'bibi-vtc' })); // VerticalTextChecker
    VTC.Child = VTC.appendChild(sML.create('p', { innerHTML: 'aAあ亜' }));
    if(VTC.Child.offsetWidth < VTC.Child.offsetHeight) {
        O.HTML.className = O.HTML.className + ' vertical-text-enabled';
        O.VerticalTextEnabled = true;
    } else {
        O.HTML.className = O.HTML.className + ' vertical-text-not-enabled';
        O.VerticalTextEnabled = false;
    };
    O.DefaultFontSize = Math.min(VTC.Child.offsetWidth, VTC.Child.offsetHeight);
    document.body.removeChild(VTC);
    sML.deleteCSSRule(SRI4VTC);*/

    // Scrollbars
    O.Body.style.width = '101vw', O.Body.style.height = '101vh';
    O.Scrollbars = {
        Width: window.innerWidth - O.HTML.offsetWidth,
        Height: window.innerHeight - O.HTML.offsetHeight
    };//O.Scrollbars.Height = O.Scrollbars.Width;
    O.HTML.style.width = O.Body.style.width = '100%', O.Body.style.height = '';

    S.initialize();

    O.HTML.classList.remove('welcome');

    E.dispatch('bibi:initialized');

};


Bibi.loadExtensions = () => {
    let ReadyForExtraction = false, ReadyForBibiZine = false;
    if(S['book']) {
        if(O.isToBeExtractedIfNecessary(S['book'])) ReadyForExtraction = true;
        if(B.Type == 'Zine')                        ReadyForBibiZine = true;
    } else if(S['accept-local-file'] || S['accept-blob-converted-data']) ReadyForExtraction = ReadyForBibiZine = true;
    if(ReadyForBibiZine)   P['extensions'].unshift({ 'src': 'extensions/zine/index.js'     });
    if(ReadyForExtraction) P['extensions'].unshift({ 'src': 'extensions/unzipper/index.js' });
    if(P['extensions'].length == 0) return Promise.resolve();
    return new Promise(resolve => {
        O.log(`Loading Extension${ P['extensions'].length > 1 ? 's' : '' }...`, '<g:>');
        const loadExtensionInPreset = (i) => {
            X.load(P['extensions'][i]).then(Msg => {
                //O.log(Msg);
            }).catch(Msg => {
            }).then(() => {
                P['extensions'][i + 1] ? loadExtensionInPreset(i + 1) : resolve();
            });
        };
        loadExtensionInPreset(0);
    }).then(() => {
        O.log(`Extensions: %O`, X.Extensions);
        O.log(X.Extensions.length ? `Loaded. (${ X.Extensions.length } Extension${ X.Extensions.length > 1 ? 's' : '' })` : `No Extension.`, '</g>')
    });
};


Bibi.ready = () => new Promise(resolve => {
    O.HTML.classList.add('ready');
    O.ReadiedURL = location.href;
    E.add('bibi:readied', resolve);
    E.dispatch('bibi:readied');//setTimeout(() => E.dispatch('bibi:readied'), (O.Touch ? 999 : 0));
});


Bibi.loadBook = () => L.getBookData().then(Param => {
    O.Busy = true;
    O.HTML.classList.remove('ready');
    O.HTML.classList.add('busy');
    O.HTML.classList.add('loading');
    window.addEventListener(O['resize'], R.resetBibiHeight);
    I.note(`Loading...`);
    O.log(`Initializing Book...`, '<g:>');
    return L.initializeBook(Param);
}).then(InitializedAs => {
    O.log(`${ InitializedAs }: %O`, B);
    O.log(`Initialized.`, '</g>');
}).then(() => {
    if(S['use-cookie']) {
        const BibiCookie = O.Cookie.remember(O.RootPath);
        const BookCookie = O.Cookie.remember(B.ID);
        if(BibiCookie) {
            if(!U['reader-view-mode']              && BibiCookie.RVM     ) S['reader-view-mode']              = BibiCookie.RVM;
            if(!U['full-breadth-layout-in-scroll'] && BibiCookie.FBL     ) S['full-breadth-layout-in-scroll'] = BibiCookie.FBL;
        }
        if(BookCookie) {
            if(!U['to']                            && BookCookie.Position) S['to']                            = BookCookie.Position;
        }
    }
    S.update();
    R.updateOrientation();
    R.resetStage();
}).then(() => new Promise(resolve => {
    // Create Cover
    O.log(`Creating Cover...`, '<g:>');
    if(B.CoverImageItem) {
        O.log(`Cover Image: %O`, B.CoverImageItem);
        O.log(`Will Be Created.`, '</g>');
    } else {
        O.log(`Will Be Created. (w/o Image)`, '</g>');
    }
    resolve(); // ←↙ do async
    L.createCover();
})).then(() => new Promise(resolve => {
    // Load Navigation
    if(!B.NavItem) {
        O.log(`No Navigation.`)
        return resolve();
    }
    O.log(`Loading Navigation...`, '<g:>');
    L.loadNavigation().then(PNav => {
        O.log(`${ B.NavItem.NavType }: %O`, B.NavItem);
        O.log(`Loaded.`, '</g>');
        E.dispatch('bibi:loaded-navigation', B.NavItem);
        resolve();
    });
})).then(() => {
    // Announce "Prepared" (and Wait, sometime)
    E.dispatch('bibi:prepared');
    if(!S['autostart'] && !L.Played) return L.wait();
}).then(() => {
    // Background Preparing
    O.log(`Preprocessing Resources...`, '<g:>');
    return L.preprocessResources().then(Resolved => {
        O.log(`Preprocessed: %O`, Resolved);
        O.log(`Preprocessed. (${ Resolved.length } Resource${ Resolved.length > 1 ? 's' : '' })`, '</g>');
        E.dispatch('bibi:preprocessed-resources');
    });
}).then(() => new Promise(resolve => {
    // Load & Layout Items in Spreads and Pages
    O.log(`Loading Items in Spreads...`, '<g:>');
    const LayoutOption = {
        Destination: S['to'] || { Edge: 'head' },
        resetter:       () => { LayoutOption.Reset = true; LayoutOption.removeResetter(); },
        addResetter:    () => { window   .addEventListener('resize', LayoutOption.resetter); },
        removeResetter: () => { window.removeEventListener('resize', LayoutOption.resetter); }
    };
    LayoutOption.addResetter();
    const Promises = [], TargetSpreadIndex = (() => {
        if(typeof S['to'] == 'object') {
            if(S['to'].SpreadIndex)      return S['to'].SpreadIndex;
            if(S['to'].ItemIndexInSpine) return B.Package.Spine.Items[S['to'].ItemIndexInSpine].Spread.Index;
        }
        return 0;
    })();
    //const LoadedSpreads = {};
    let LoadedItems = 0;
    R.Spreads.forEach(Spread => Promises.push(
        L.loadSpread(Spread, { AllowPlaceholderItems: S['allow-placeholders'] && !(Spread.Index == TargetSpreadIndex) }).then(() => {/*
            const ItemLogHeaders = [];
            Spread.Items.forEach(Item => ItemLogHeaders.push('Item ' + (Item.Index + 1 + '').padStart(B.FileDigit, 0)));
            O.log(`Spread ${ (Spread.Index + 1 + '').padStart(B.FileDigit, 0) } (${ ItemLogHeaders.join(', ') })`, '<g->');
            Spread.Items.forEach(Item => O.log(`${ ItemLogHeaders[Item.IndexInSpread] }:`, Item));
            O.log('', '</g>');*/
            //O.log('', Spread.Items);
            //LoadedSpreads[O.getTimeLabel()] = Spread;
            LoadedItems += Spread.Items.length;/*
            if(B.Package.Metadata['rendition:layout'] == 'reflowable') */I.note(`Loading... (${ LoadedItems }/${ R.Items.length } Items Loaded.)`);
            if(!LayoutOption.Reset) return R.layOutSpread(Spread);
        })//.catch(() => Promise.resolve())
    ));
    Promise.all(Promises).then(() => {
        //O.log(`Spreads: %O`, LoadedSpreads);
        O.log(`Loaded. (${ R.Items.length } in ${ R.Spreads.length })`, '</g>');
        if(!LayoutOption.Reset) {
            R.organizePages();
            R.layOutStage();
        }
        R.layOut(LayoutOption).then(LayoutOption.removeResetter).then(resolve);
    });
})).then(() => {
    // Open
    window.removeEventListener(O['resize'], R.resetBibiHeight);
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.remove('loading');
    I.Veil.close();
    L.Opened = true;
    document.body.click(); // To responce for user scrolling/keypressing immediately
    I.note('');
    O.log(`Enjoy Readings!`, '</b>');
    E.dispatch('bibi:opened');
}).then(() => {
    if(S['allow-placeholders']) setTimeout(() => R.turnSpreads(), 123);
    E.add('bibi:commands:move-by',     R.moveBy);
    E.add('bibi:commands:scroll-by',   R.scrollBy);
    E.add('bibi:commands:focus-on',    R.focusOn);
    E.add('bibi:commands:change-view', R.changeView);
    window.addEventListener('message', M.gate, false);
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
}).catch(Mes => {
    I.note(Mes, 99999999999, 'ErrorOccured');
    throw Mes;
});




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Book

//----------------------------------------------------------------------------------------------------------------------------------------------


export const B = { // Bibi.Book
    Title: '',
    Creator: '',
    Publisher: '',
    Language: '',
    WritingMode: '',
    ExtractionPolicy: '',
    Path: '',
    PathDelimiter: ' > ',
    Container: { Path: 'META-INF/container.xml' },
    Package: {
        Manifest: { Items: {} },
        Spine: { Items: [] }
    },
    Files: {},
    FileDigit: 0
};


/*
B.clearCache = (FilePath) => {
    const Item = B.Package.Manifest.Items[FilePath];
    if(!Item) return null;
    Item.Content = '';
    delete Item.Preprocessed;
    return Item;
};

B.clearCaches = (Opt = {}) => {
    const FilePaths = Opt.FilePaths || B.Package.Manifest.Items;
    if(Opt.Extensions) {    const RE = new RegExp('\\.(' + Extensions + ')$', 'i');
        for(const FilePath in FilePaths) if( RE.test(FilePath)) B.clearCache(FilePath);
    } else if(Opt.Except) { const RE = new RegExp('\\.(' + Except     + ')$', 'i');
        for(const FilePath in FilePaths) if(!RE.test(FilePath)) B.clearCache(FilePath);
    } else {
        for(const FilePath in FilePaths)                        B.clearCache(FilePath);
    }
};
*/




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


export const L = { // Bibi.Loader
    Opened: false,
    Preprocessed: false,
    PreprocessedFiles: []
};


L.wait = () => {
    O.Busy = false;
    O.HTML.classList.remove('busy');
    O.HTML.classList.add('waiting');
    E.dispatch('bibi:waits');
    O.log(`(Waiting...)`, '<i/>');
    I.note('');
    return new Promise(resolve => L.wait.resolve = resolve).then(() => {
        O.Busy = true;
        O.HTML.classList.add('busy');
        O.HTML.classList.remove('waiting');
        I.note(`Loading...`);
    });
};


L.play = () => {
    if(S['start-in-new-window']) return window.open(location.href);
    L.Played = true;
    L.wait.resolve();
    E.dispatch('bibi:played');
};


L.getBookData = () =>
    S['book']              ?     Promise.resolve({ BookData: S['book'] }) :
    S.BookDataElement      ?     Promise.resolve({ BookData: S.BookDataElement.innerText.trim(), BookDataType: S.BookDataElement.getAttribute('data-bibi-book-mimetype') }) :
    S['accept-local-file'] ? new Promise(resolve => { L.getBookData.resolve = (Param) => { resolve(Param), O.HTML.classList.remove('waiting-file'); }; O.HTML.classList.add('waiting-file'); }) :
                                 Promise.reject (`Tell me EPUB name via ${ O.WindowEmbedded ? 'embedding tag' : 'URI' }.`);


L.initializeBook = (Param) => new Promise((resolve, reject) => {
    if(!Param || !Param.BookData) return reject(`Book Data Is Undefined.`);
    let BookData = Param.BookData;
    const BookDataFormat =
        typeof BookData == 'string' ? (/^https?:\/\//.test(BookData) ? 'URI' : 'Base64') :
        typeof BookData == 'object' ? (BookData instanceof File ? 'File' : BookData instanceof Blob ? 'BLOB' : '') : '';
    if(!BookDataFormat) return reject(`Book Data Is Unknown.`);
    if(BookDataFormat == 'URI') {
        // Online
        B.Path = BookData;
        if(!S['trustworthy-origins'].includes(B.Path.replace(/^(\w+:\/\/[^\/]+).*$/, '$1'))) return reject(`The Origin of the Path of the Book Is Not Allowed.`);
        let RootFile;
        switch(B.Type) {
            case 'EPUB': RootFile = B.Container; break; // Online EPUB
            case 'Zine': RootFile = B.ZineData ; break; // Online Zine
        }
        const initialize_as = (FileOrFolder) => ({
            Promised: (
                FileOrFolder == 'Folder'        ? O.download(RootFile).then(() => B.PathDelimiter = '/').then(() => '') :
                typeof O.retlieve == 'function' ? O.retlieve(RootFile)                                  .then(() => 'on-the-fly') :
                                                  X.Unzipper.loadBookData(B.Path)                       .then(() => 'at-once')
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
        const MIMETypeErrorMessage = 'BiB/i Can Not Open This Type of File.';
        if(BookDataFormat == 'File') {
            // Local-Archived EPUB/Zine File
            if(!S['accept-local-file'])                      return reject(`To Open Local Files, Changing "accept-local-file" in default.js Is Required.`);
            if(!BookData.name)                               return reject(`Book File Is Invalid.`);
            if(!/\.[\w\d]+$/.test(BookData.name))            return reject(`BiB/i Can Not Open Local Files without Extension.`);
            if(!O.isToBeExtractedIfNecessary(BookData.name)) return reject(`To Open This File, Changing "extract-if-necessary" in default.js Is Required.`);
            if(/\.epub$/i.test(BookData.name) ? !MIMETypeREs['EPUB'].test(BookData.type) :
                /\.zip$/i.test(BookData.name) ? !MIMETypeREs['Zine'].test(BookData.type) : true) return reject(MIMETypeErrorMessage);
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
                    BookData = new Blob([Buf.buffer], { type: Param.BookDataType });
                    if(!BookData || !(BookData instanceof Blob)) throw '';
                } catch(Err) {
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
        X.Unzipper.loadBookData(BookData).then(() => {
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
    E.dispatch('bibi:loaded-package-document');
    return InitializedAs;
})).catch(Log => {
    //if(S['accept-local-file']) O.HTML.classList.add('waiting-file');
    const Message = `BiB/i Failed to Open the Book.`;
    O.error(Message + '\n* ' + Log);
    return Promise.reject(Message);
});


L.loadContainer = () => O.openDocument(B.Container).then(L.processContainer);

L.processContainer = (Doc) => {
    B.Package.Path = Doc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
    B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, '');
};


L.loadPackage = () => O.openDocument(B.Package).then(L.processPackage);

L.processPackage = (Doc) => {

    const _Metadata = Doc.getElementsByTagName('metadata')[0], Metadata = B.Package.Metadata = {};// = { 'identifier': [], 'title': [], 'creator': [], 'publisher': [], 'language': [] };
    const _Manifest = Doc.getElementsByTagName('manifest')[0], Manifest = B.Package.Manifest;
    const _Spine    = Doc.getElementsByTagName('spine'   )[0], Spine    = B.Package.Spine;
    
    // METADATA
    // ================================================================================
    const DCNS = _Metadata.getAttribute('xmlns:dc');
    ['identifier', 'title', 'creator', 'publisher', 'language'].forEach(Pro => sML.forEach(Doc.getElementsByTagNameNS(DCNS, Pro))(_Meta => (Metadata[Pro] ? Metadata[Pro] : Metadata[Pro] = []).push(_Meta.textContent.trim())));
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
    if(!Metadata['title'     ]) Metadata['title'     ] = Metadata['dcterms:title'     ] || Metadata['identifier'];
    if(!Metadata['language'  ]) Metadata['language'  ] = Metadata['dcterms:language'  ] || ['en'];
    // --------------------------------------------------------------------------------
    if(!Metadata['rendition:layout'     ]                                               ) Metadata['rendition:layout'     ] = 'reflowable'; if(Metadata['omf:version']) Metadata['rendition:layout'] = 'pre-paginated';
    if(!Metadata['rendition:orientation'] || Metadata['rendition:orientation'] == 'auto') Metadata['rendition:orientation'] = 'portrait';
    if(!Metadata['rendition:spread'     ] || Metadata['rendition:spread'     ] == 'auto') Metadata['rendition:spread'     ] = 'landscape';
    if( Metadata[     'original-resolution']) Metadata[     'original-resolution'] = O.getViewportByOriginalResolution(Metadata[     'original-resolution']);
    if( Metadata[      'rendition:viewport']) Metadata[      'rendition:viewport'] = O.getViewportByMetaContent(       Metadata[      'rendition:viewport']);
    if( Metadata['fixed-layout-jp:viewport']) Metadata['fixed-layout-jp:viewport'] = O.getViewportByMetaContent(       Metadata['fixed-layout-jp:viewport']);
    if( Metadata[            'omf:viewport']) Metadata[            'omf:viewport'] = O.getViewportByMetaContent(       Metadata[            'omf:viewport']);
    B.ICBViewport = Metadata['original-resolution'] || Metadata['rendition:viewport'] || Metadata['fixed-layout-jp:viewport'] || Metadata['omf:viewport'] || null;

    const _ItemPaths = {};

    // MANIFEST
    // ================================================================================
    sML.forEach(_Manifest.getElementsByTagName('item'))(_Item => {
        let Item = {
            'id'         : _Item.getAttribute('id'),
            'href'       : _Item.getAttribute('href'),
            'media-type' : _Item.getAttribute('media-type')
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
        const Fallback = _Item.getAttribute('fallback');
        if(Fallback) Item['fallback'] = Fallback;
        Manifest.Items[Item.Path] = Item; ////
        _ItemPaths[Item['id']] = Item.Path;
    });

    // SPINE
    // ================================================================================
    if(!B.NavItem) {
        const Item = Manifest.Items[_ItemPaths[_Spine.getAttribute('toc')]];
        if(Item) B.NavItem = Item, Item.NavType = 'TOC-NCX';
    }
    // --------------------------------------------------------------------------------
    Spine['page-progression-direction'] = _Spine.getAttribute('page-progression-direction');
    if(!Spine['page-progression-direction'] || !/^(ltr|rtl)$/.test(Spine['page-progression-direction'])) Spine['page-progression-direction'] = 'ltr'; // default;
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
        Item = Manifest.Items[Item.Path] = sML.create('iframe', Item, { className: 'item', scrolling: 'no', allowtransparency: 'true',
            TimeCard: {}, stamp: function(What) { O.stamp(What, this.TimeCard); },
            IndexInSpine: Spine.Items.length,
            Ref: ItemRef,
            Box: sML.create('div', { className: 'item-box ' + ItemRef['rendition:layout'] }),
            Pages: []
        });
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
                    Box: sML.create('div', { className: 'spread-box ' + ItemRef['rendition:layout'] }),
                    Items: [], Pages: [],
                    Index: R.Spreads.length
                });
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
                const Page = sML.create('span', { className: 'page',
                    Spread: Spread, Item: Item,
                    IndexInItem: 0
                });
                Item.Pages.push(Item.Box.appendChild(Page));
            }
        }
    });
    R.Main.Book.appendChild(B.Package.Spine.SpreadsDocumentFragment);
    //E.dispatch('bibi:initialized-spine');
    // --------------------------------------------------------------------------------
    B.FileDigit = (Spine.Items.length + '').length;

    B.ID        = Metadata['identifier'][0];
    B.Title     = Metadata['title'     ].join(', ');
    B.Creator   = Metadata['creator'   ].join(', ');
    B.Publisher = Metadata['publisher' ].join(', ');
    B.Language  = Metadata['language'  ][0].split('-')[0];
    if(B.Title) {
        const BookIDFragments = [B.Title];
        if(B.Creator)   BookIDFragments.push(B.Creator);
        if(B.Publisher) BookIDFragments.push(B.Publisher);
        const TitleExtras = S['website-name-in-title'] ? S['website-name-in-title'] : 'Published with BiB/i';
        O.Title.innerHTML = '';
        O.Title.appendChild(document.createTextNode(BookIDFragments.join(' - ').replace(/&amp;?/gi, '&').replace(/&lt;?/gi, '<').replace(/&gt;?/gi, '>') + ' | ' + TitleExtras));
        try { O.Info.querySelector('h1').innerHTML = document.title; } catch(Err) {}
    }
    B.WritingMode =                                                                                   /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language) ? (B.PPD == 'rtl' ? 'tb-rl' : 'lr-tb')
        : /^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language) ?                             'rl-tb'
        :                                                                                                             /^(mo?n)$/.test(B.Language) ?                   'tb-lr'
        :                                                                                                                                                                       'lr-tb';

    B.AllowPlaceholderItems = (B.ExtractionPolicy != 'at-once'/* && Metadata['rendition:layout'] == 'pre-paginated'*/);

};


L.createCover = () => {
    const VCover =           I.Veil.Cover =               I.Veil.appendChild(sML.create('div', { id:           'bibi-veil-cover'      }));
          VCover.Info =                                   VCover.appendChild(sML.create('p',   { id:           'bibi-veil-cover-info' }));
    const PCover = I.Panel.BookInfo.Cover = I.Panel.BookInfo.Box.appendChild(sML.create('div', { id: 'bibi-panel-bookinfo-cover'      }));
          PCover.Info =                                   PCover.appendChild(sML.create('p',   { id: 'bibi-panel-bookinfo-cover-info' }));
    VCover.Info.innerHTML = PCover.Info.innerHTML = (() => {
        const BookID = [];
        if(B.Title)     BookID.push(`<strong>${ B.Title     }</strong>`);
        if(B.Creator)   BookID.push(    `<em>${ B.Creator   }</em>`    );
        if(B.Publisher) BookID.push(  `<span>${ B.Publisher }</span>`  );
        return BookID.join(' ');
    })();
    new Promise((resolve, reject) => {
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
        sML.style(VCover, { backgroundImage: 'url(' + ImageURI + ')' });
        PCover.insertBefore(sML.create('img', { src: ImageURI }), PCover.Info);
    }).catch(() => {
        VCover.className = PCover.className = 'without-cover-image';
        VCover.appendChild(I.getBookIcon());
    });
};


L.loadNavigation = () => O.openDocument(B.NavItem).then(Doc => {
    const PNav = I.Panel.BookInfo.Navigation = I.Panel.BookInfo.Box.appendChild(sML.create('div', { id: 'bibi-panel-bookinfo-navigation' }));
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
            A.addEventListener(O['pointerdown'], Eve => Eve.stopPropagation());
            A.addEventListener(O['pointerup'],   Eve => Eve.stopPropagation());
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
                HrefPathInSource = (HrefHashInSource ? '#' + HrefHashInSource : R.Items[0].Path)
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
            if(HrefFile == Item.Path) {
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
                return 'break';
            }
        });
        if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
            A.setAttribute('data-bibi-original-href', HrefPathInSource);
            if(X['EPUBCFI']) {
                A.setAttribute(HrefAttribute, B.Path + '/#' + HrefHash);
                A.InNav = InNav;
                A.Destination = X['EPUBCFI'].getDestination(HrefHash);
                L.coordinateLinkages.setJump(A);
            } else {
                A.removeAttribute(HrefAttribute);
                A.addEventListener('click', () => false);
                if(!O.Touch) {
                    A.addEventListener(O['pointerover'], () => { I.Help.show('(This link uses EPUBCFI. BiB/i needs the extension.)'); return false; });
                    A.addEventListener(O['pointerout'],  () => { I.Help.hide()                                                      ; return false; });
                }
            }
        }
        if(InNav && typeof S['nav'] == (i + 1) && A.Destination) S['to'] = A.Destination;
    }
};

L.coordinateLinkages.setJump = (A) => A.addEventListener('click', Eve => {
    Eve.preventDefault(); 
    Eve.stopPropagation();
    if(A.Destination) new Promise(resolve => A.InNav ? I.Panel.toggle().then(resolve) : resolve()).then(() => {
        if(L.Opened) return R.focusOn({ Destination: A.Destination, Duration: 0 });
        if(S['start-in-new-window']) return window.open(location.href + (location.hash ? ',' : '#') + 'pipi(nav:' + A.NavANumber + ')');
        S['to'] = A.Destination;
        L.play();
    });
    return false;
});


L.preprocessResources = () => new Promise((resolve, reject) => {
    E.dispatch('bibi:is-going-to:preprocess-resources');
    const PpdReses = []; // PreprocessedResources
    const Promises = [O.download({ Path: new URL('res/styles/bibi.book.css', O.RootPath + '/').pathname, 'media-type': 'text/css', Bibitem: true }).then(Item => {
        Item.URI = O.getBlobURL(Item);
        Item.Content = '';
        B.DefaultStyle = Item;
        return PpdReses.push(B.DefaultStyle);
    })]; // Default StyleSheet
    const pushItemPreprocessingPromise = (Item, URI) => Promises.push(O.file(Item, { Preprocess: true, URI: URI }).then(() => PpdReses.push(Item)));
    for(const FilePath in B.Package.Manifest.Items) {
        const Item = B.Package.Manifest.Items[FilePath];
        if(/\/(css|javascript)$/.test(Item['media-type']) && !Item.Bibitem) pushItemPreprocessingPromise(Item, true); // CSSs & JavaScripts in Manifest
    }
    Promise.all(Promises).then(() => {
        resolve(PpdReses);/*
        if(B.ExtractionPolicy != 'at-once' && (S.BRL == 'pre-paginated' || (sML.UA.Chromium || sML.UA.WebKit || sML.UA.Gecko))) return resolve(PpdReses);
        R.Items.forEach(Item => pushItemPreprocessingPromise(Item, O.isBin(Item))); // Spine Items
        return Promise.all(Promises).then(() => resolve(PpdReses));*/
    });
});


L.loadSpread = (Spread, Opt = {}) => new Promise((resolve, reject) => {
    Spread.AllowPlaceholderItems = (S['allow-placeholders'] && Opt.AllowPlaceholderItems);
    let LoadedItemsInSpread = 0, SkippedItemsInSpread = 0;
    Spread.Items.forEach(Item => {
        L.loadItem(Item, { AllowPlaceholder: Opt.AllowPlaceholderItems })
        .then(() =>  LoadedItemsInSpread++) // Loaded
       .catch(() => SkippedItemsInSpread++) // Skipped
        .then(() => { if(LoadedItemsInSpread + SkippedItemsInSpread == Spread.Items.length) /*(SkippedItemsInSpread ? reject : resolve)*/resolve(Spread); });
    });
});


L.loadItem = (Item, Opt = {}) => { // !!!! Don't Call Directly. Use L.loadSpread and load with spread-pair. !!!!
    const IsPlaceholder = (S['allow-placeholders'] && Item.Ref['rendition:layout'] == 'pre-paginated' && Opt.AllowPlaceholder);
    if(typeof Item.IsPlaceholder != 'undefined' && Item.IsPlaceholder == IsPlaceholder) return Promise.reject(Item);
    Item.IsPlaceholder = IsPlaceholder;
    const ItemBox = Item.Box;
    ItemBox.classList.toggle('placeholder', Item.IsPlaceholder);
    if(Item.IsPlaceholder) {
        if(Item.parentElement) {
            Item.parentElement.removeChild(Item);
            Item.src = Item.onload = '';
        }
        Item.HTML = Item.Head = Item.Body = Item.Pages[0];
        return Promise.resolve(Item);
    }
    ItemBox.classList.remove('loaded');
    return new Promise((resolve, reject) => {
        if(/\.(html?|xht(ml)?|xml)$/i.test(Item.Path)) { // (X)HTML
            //if(!B.ExtractionPolicy) return resolve(); // Extracted
            return O.file(Item, { Preprocess: true }).then(Item => resolve(Item.Content.replace(/^<\?.+?\?>/, ''))).catch(reject); // Archived
        }
        if(/\.(gif|jpe?g|png)$/i.test(Item.Path)) { // Bitmap-in-Spine
            return O.file(Item, { URI: true }).then(Item => resolve({
                Head: (Item.Ref['rendition:layout'] == 'pre-paginated' && B.ICBViewport) ? `<meta name="viewport" content="width=${ B.ICBViewport.Width }, height=${ B.ICBViewport.Height }" />` : '',
                Body: `<img class="bibi-spine-item-image" alt="" src="${ Item.URI }" />` // URI is BlobURL or URI
            })).catch(reject)
        }
        if(/\.(svg)$/i.test(Item.Path)) { // SVG-in-Spine
            return O.file(Item, { Preprocess: true }).then(Item => {
                const RE = /<\?xml-stylesheet\s*(.+?)\s*\?>/g;
                const SSs = Item.Content.match(RE);
                resolve({
                    Head: (!B.ExtractionPolicy ? `<base href="${ O.fullPath(Item.Path) }" />` : '') + (SSs ? SSs.map(SS => SS.replace(RE, `<link rel="stylesheet" $1 />`)).join('') : ''),
                    Body: Item.Content.replace(RE, '')
                });
            }).catch(reject)
        }
        resolve({})
    }).then(HTML => new Promise(resolve => {
        if(HTML) {
            if(typeof HTML == 'object') HTML = [
                `<!DOCTYPE html>` + '\n',
                `<html>`,
                    `<head>`,
                        `<meta charset="utf-8" />`,
                        `<title>${ B.Title } - #${ Item.Index + 1 + '/' + R.Items.length }</title>`,
                        typeof HTML.Head == 'string' ? HTML.Head : '',
                    `</head>`,
                    `<body>`,
                        typeof HTML.Body == 'string' ? HTML.Body : '',
                    `</body>`,
                `</html>`
            ].join('');
            HTML = HTML.replace(/(<head(\s[^>]+)?>)/i, `$1<link rel="stylesheet" id="bibi-default-style" href="${ B.DefaultStyle.URI }" />`);
            const BlobURLAcceptable = !(sML.UA.InternetExplorer || (sML.UA.Edge && !sML.UA.Chromium)); // Legacy Microsoft Browsers accepts any DataURIs for src of <iframe>.
            if(BlobURLAcceptable) {
                Item.URI = URL.createObjectURL(new Blob([HTML], { type: 'text/html' })), Item.Content = '';
                Item.onload = () => resolve(Item);
                Item.src = Item.URI;
                ItemBox.insertBefore(Item, ItemBox.firstChild);
            } else {
                HTML = HTML.replace(`</head>`, `<script id="bibi-onload">window.addEventListener('load', function() { parent.R.Items[${ Item.Index }].onLoaded(); return false; });</script></head>`);
                Item.onLoaded = () => {
                    resolve(Item);
                    //console.log(`onload: R.Items[${ Item.Index }]: %O`, Item);
                    const Script = Item.contentDocument.getElementById('bibi-onload');
                    Script.parentNode.removeChild(Script);
                    delete Item.onLoaded;
                };
                Item.src = '';
                ItemBox.insertBefore(Item, ItemBox.firstChild);
                Item.contentDocument.open();
                Item.contentDocument.write(HTML);
                Item.contentDocument.close();
            }
        } else {
            Item.onload = () => resolve(Item);
            Item.src = O.fullPath(Item.Path);
            ItemBox.insertBefore(Item, ItemBox.firstChild);
        }
    })).then(L.postprocessItem).then(() => {
        Item.Loaded = true;
        ItemBox.classList.add('loaded');
        E.dispatch('bibi:loaded-item', Item);
        Item.stamp('Loaded');
        return Item;
    }).catch(() => Promise.reject());
};


L.postprocessItem = (Item) => {

    Item.stamp('Postprocess');

    Item.HTML = Item.contentDocument.getElementsByTagName('html')[0];
    Item.Head = Item.contentDocument.getElementsByTagName('head')[0];
    Item.Body = Item.contentDocument.getElementsByTagName('body')[0];
    Item.HTML.Item = Item.Head.Item = Item.Body.Item = Item;

    const XMLLang = Item.HTML.getAttribute('xml:lang'), Lang = Item.HTML.getAttribute('lang');
         if(!XMLLang && !Lang) Item.HTML.setAttribute('xml:lang', B.Language), Item.HTML.setAttribute('lang', B.Language);
    else if(!XMLLang         ) Item.HTML.setAttribute('xml:lang', Lang);
    else if(            !Lang)                                                 Item.HTML.setAttribute('lang', XMLLang);

    sML.forEach(Item.Body.getElementsByTagName('link'))(Link => Item.Head.appendChild(Link));

    sML.appendCSSRule(Item.contentDocument, 'html', '-webkit-text-size-adjust: 100%;');

    if(sML.UA.InternetExplorer) sML.forEach(Item.Body.getElementsByTagName('svg'))(SVG => {
        const ChildImages = SVG.getElementsByTagName('image');
        if(ChildImages.length == 1) {
            const ChildImage = ChildImages[0];
            if(ChildImage.getAttribute('width') && ChildImage.getAttribute('height')) {
                SVG.setAttribute('width',  ChildImage.getAttribute('width'));
                SVG.setAttribute('height', ChildImage.getAttribute('height'));
            }
        }
    });

    Item.contentDocument.addEventListener('wheel', R.Main.listenWheel, { capture: true, passive: false });

    I.observeTap(Item.HTML);
    Item.HTML.addTapEventListener('tap',         R.onTap);
    Item.HTML.addEventListener(O['pointermove'], R.onPointerMove);
    Item.HTML.addEventListener(O['pointerdown'], R.onPointerDown);
    Item.HTML.addEventListener(O['pointerup'],   R.onPointerUp);

    L.coordinateLinkages(Item.Path, Item.Body);

    sML.Environments.forEach(Env => Item.HTML.classList.add(Env));

    const Lv1Eles = Item.contentDocument.querySelectorAll('body>*:not(script):not(style)');
    if(Lv1Eles && Lv1Eles.length == 1) {
        const Lv1Ele = Item.contentDocument.querySelector('body>*:not(script):not(style)');
             if(    /^svg$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleSVG = true;
        else if(    /^img$/i.test(Lv1Ele.tagName)) Item.Outsourcing = Item.OnlySingleIMG = true;
        else if( /^iframe$/i.test(Lv1Ele.tagName)) Item.Outsourcing =                      true;
        else if(!O.getElementInnerText(Item.Body)) Item.Outsourcing =                      true;
    }

    return (Item.Ref['rendition:layout'] == 'pre-paginated' ? Promise.resolve() : L.patchItemStyles(Item)).then(() => {
        //if(S['epub-additional-stylesheet']) Item.Head.appendChild(sML.create('link',   { rel: 'stylesheet', href: S['epub-additional-stylesheet'] }));
        //if(S['epub-additional-script'])     Item.Head.appendChild(sML.create('script', { src: S['epub-additional-script'] }));
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
    if(!checkCSSLoadingAndResolve()) Item.CSSLoadingTimerID = setInterval(checkCSSLoadingAndResolve, 100);
}).then(() => {
    if(!Item.Preprocessed) {
        if(B.Package.Metadata['ebpaj:guide-version']) {
            const Versions = B.Package.Metadata['ebpaj:guide-version'].split('.');
            if(Versions[0] * 1 == 1 && Versions[1] * 1 == 1 && Versions[2] * 1 <=3) Item.Body.style.textUnderlinePosition = 'under left';
        }
        if(sML.UA.InternetExplorer) {
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
    Item.HTML.WritingMode = O.getWritingMode(Item.HTML);
         if(/-rl$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
    else if(/-lr$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
    else                                        if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
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
               width:  (Img.style.   width  ? Img.style.   width  : ''),
               height: (Img.style.   height ? Img.style.   height : ''),
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
    Current: {}, Past: {}

};


R.initialize = () => {

    R.Main      = O.Body.insertBefore(sML.create('div', { id: 'bibi-main', Transformation: { Scale: 1, Translation: { X: 0, Y: 0 } } }), O.Body.firstElementChild);
    R.Sub       = O.Body.insertBefore(sML.create('div', { id: 'bibi-sub' }),  R.Main.nextSibling);
    R.Main.Book =  R.Main.appendChild(sML.create('div', { id: 'bibi-main-book' }));

    R.Main.listenWheel = (Eve) => {
        if(S.RVM == 'paged') return;
        Eve.preventDefault();
        Eve.stopPropagation();
        R.Main.scrollLeft = R.Main.scrollLeft + Eve.deltaX;
        R.Main.scrollTop  = R.Main.scrollTop  + Eve.deltaY;
    };

    //R.Main.addEventListener('wheel', R.onWheel, { capture: true, passive: true });

    E.add('bibi:scrolled', () => {
        R.getCurrent();
        clearTimeout(R.Timer_Scrolling);
        if(!R.Current.Page) return;
        R.Timer_Scrolling = setTimeout(() => {
            if(S['allow-placeholders']) R.turnSpreads();
            if(S['use-cookie']) {
                O.Cookie.eat(B.ID, {
                    'Position': {
                        SpreadIndex: R.Current.Pages.StartPage.Spread.Index,
                        PageProgressInSpread: R.Current.Pages.StartPage.IndexInSpread / R.Current.Pages.StartPage.Spread.Pages.length
                    }
                });
            }
        }, 222);
    });

    E.add('bibi:resized', () => R.layOut({ Reset: true }));

    I.observeTap(O.HTML);

    O.HTML.addTapEventListener('tap',         R.onTap);
    O.HTML.addEventListener(O['pointermove'], R.onPointerMove);
    O.HTML.addEventListener(O['pointerdown'], R.onPointerDown);
    O.HTML.addEventListener(O['pointerup'],   R.onPointerUp);

    E.add('bibi:tapped', Eve => {
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(BibiEvent.Coord.Y < I.Menu.offsetHeight) return false;
        switch(S.RVM) {
            case 'horizontal': if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; else break;
            case 'vertical':   if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; else break;
        }
        if(BibiEvent.Target.tagName) {
            if(I.Slider && (I.Slider.contains(BibiEvent.Target) || BibiEvent.Target == I.Slider)) return false;
            if(O.isAnchorContent(BibiEvent.Target)) return false;
        }
        switch(S.ARD) {
            case 'ttb': return (BibiEvent.Division.Y == 'middle') ? E.dispatch('bibi:tapped-center', Eve) : false;
            default   : return (BibiEvent.Division.X == 'center') ? E.dispatch('bibi:tapped-center', Eve) : false;
        }
    });

    E.add('bibi:tapped-center', Eve => {
        if(I.SubPanel) E.dispatch('bibi:closes-utilities',  Eve);
        else           E.dispatch('bibi:toggles-utilities', Eve);
    });

};


R.resetBibiHeight = () => {
    const WIH = window.innerHeight;
    O.HTML.style.height = O.Body.style.height = WIH + 'px'; // for In-App Browsers
    return WIH;
}


R.resetStage = () => {
    const WIH = R.resetBibiHeight(WIH);
    //try {  I.Veil.style.height = WIH + 'px'; } catch(Err) {}
    //try { I.Panel.style.height = WIH + 'px'; } catch(Err) {}
    R.Stage = {};
    R.Columned = false;
    R.Main.style.padding = R.Main.style.width = R.Main.style.height = '';
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = '';
    R.Main.Book.style[S.CC.A.SIZE.l] = '';
    R.Main.Book.style[S.CC.A.SIZE.b] = S.RVM == 'paged' && O.Scrollbars[S.CC.A.SIZE.B] ? 'calc(100% - ' + O.Scrollbars[S.CC.A.SIZE.B] + 'px)' : '';
    R.Stage.Width  = O.Body.clientWidth;
    R.Stage.Height = WIH;
    R.Stage[S.CC.A.SIZE.B] -= O.Scrollbars[S.CC.A.SIZE.B] + S['spread-margin'] * 2;
    window.scrollTo(0, 0);
    if(S['use-full-height']) {
        O.HTML.classList.add('book-full-height');
    } else {
        O.HTML.classList.remove('book-full-height');
        R.Stage.Height -= I.Menu.offsetHeight;
    }
    if(S.RVM == 'paged') {
        R.Stage.PageGap = 0;
    } else {
        R.Stage.PageGap = S['spread-gap'];
        R.Main.Book.style['padding' + S.CC.L.BASE.S] = R.Main.Book.style['padding' + S.CC.L.BASE.E] = S['spread-margin'] + 'px';
    }
    R.Main.Book.style['background'] = S['book-background'] ? S['book-background'] : '';
};

R.layOutSpread = (Spread) => new Promise(resolve => {
    E.dispatch('bibi:is-going-to:reset-spread', Spread);
    Spread.style.width = Spread.style.height = '';
    Spread.Box.classList.remove('spreaded');
    Spread.Pages = [];
    R.layOutItem(Spread.Items[0]).then(Item => {
        Item.Pages.forEach(Page => Page.IndexInSpread = Spread.Pages.push(Page) - 1);
        if(Spread.Items.length == 1) return resolve();
        R.layOutItem(Spread.Items[1]).then(Item => {
            Item.Pages.forEach(Page => Page.IndexInSpread = Spread.Pages.push(Page) - 1);
            resolve();
        });
    })
}).then(() => {
    Spread.Spreaded = (Spread.Items[0].Spreaded || (Spread.Items[1] && Spread.Items[1].Spreaded)) ? true : false;
    if(Spread.Spreaded) Spread.Box.classList.add('spreaded');
    const SpreadSize = { Width: 0, Height: 0 };
    if(Spread.Items.length == 1) {
        // Single Reflowable/Pre-Paginated Item
        SpreadSize.Width  = Spread.Items[0].Box.offsetWidth;
        SpreadSize.Height = Spread.Items[0].Box.offsetHeight;
        if(Spread.Spreaded && Spread.Items[0].Ref['rendition:layout'] == 'pre-paginated' && /^(left|right)$/.test(Spread.Items[0].Ref['rendition:page-spread'])) {
            // Single Pre-Paginated Spreaded Left/Right Item
            SpreadSize.Width *= 2;
        }
    } else if(Spread.Items[0].Ref['rendition:layout'] == 'pre-paginated' && Spread.Items[1].Ref['rendition:layout'] == 'pre-paginated') {
        // Paired Pre-Paginated Items
        if(Spread.Spreaded || S.RVM != 'vertical') {
            SpreadSize.Width  =          Spread.Items[0].Box.offsetWidth + Spread.Items[1].Box.offsetWidth;
            SpreadSize.Height = Math.max(Spread.Items[0].Box.offsetHeight, Spread.Items[1].Box.offsetHeight);
        } else {
            SpreadSize.Width  = Math.max(Spread.Items[0].Box.offsetWidth,   Spread.Items[1].Box.offsetWidth);
            SpreadSize.Height =          Spread.Items[0].Box.offsetHeight + Spread.Items[1].Box.offsetHeight;
        }
    } else {
        // Paired Mixed Items
        if(R.Stage.Width > Spread.Items[0].Box.offsetWidth + Spread.Items[1].Box.offsetWidth) {
            // horizontal layout
            console.log(`---------------------------------------- Mixed:A`);
            SpreadSize.Width  =          Spread.Items[0].Box.offsetWidth + Spread.Items[1].Box.offsetWidth;
            SpreadSize.Height = Math.max(Spread.Items[0].Box.offsetHeight, Spread.Items[1].Box.style.offsetHeight);
        } else {
            // vertical layout
            console.log(`---------------------------------------- Mixed:B`);
            SpreadSize.Width  = Math.max(Spread.Items[0].Box.offsetWidth,   Spread.Items[1].Box.offsetWidth);
            SpreadSize.Height =          Spread.Items[0].Box.offsetHeight + Spread.Items[1].Box.offsetHeight;
        }
        console.log(Spread);
    }
    if(O.Scrollbars.Height && S.SLA == 'vertical' && S.ARA != 'vertical') {
        Spread.Box.style.minHeight    = S.RVM == 'paged'                           ? 'calc(100vh - ' + O.Scrollbars.Height + 'px)' : '';
        Spread.Box.style.marginBottom = Spread.Index == R.Spreads.length - 1 ? O.Scrollbars.Height + 'px'                    : '';
    } else {
        Spread.Box.style.minHeight = Spread.Box.style.marginBottom = ''
    }
    Spread.Box.style[S.CC.L.SIZE.l] = Math.ceil(SpreadSize[S.CC.L.SIZE.L]) + 'px';
    Spread.Box.style[S.CC.L.SIZE.b] = '';
    Spread.style.width  = Math.ceil(SpreadSize.Width) + 'px';
    Spread.style.height = Math.ceil(SpreadSize.Height) + 'px';
    Spread.style['border-radius'] = S['spread-border-radius'];
    Spread.style['box-shadow']    = S['spread-box-shadow'];
    E.dispatch('bibi:reset-spread', Spread);
    return Spread;
});

R.layOutItem = (Item) => new Promise(resolve => {
    O.stamp('Reset...', Item.TimeCard);
    E.dispatch('bibi:is-going-to:reset-item', Item);
    Item.Scale = 1;
    Item.Box.style.width = Item.Box.style.height = Item.style.width = Item.style.height = '';
    (Item.Ref['rendition:layout'] != 'pre-paginated') ? R.renderReflowableItem(Item) : R.renderPrePaginatedItem(Item);
    E.dispatch('bibi:reset-item', Item);
    O.stamp('Reset.', Item.TimeCard);
    resolve(Item);
});

R.renderReflowableItem = (Item) => {
    let PageCB  = R.Stage[S.CC.L.SIZE.B] - (S['item-padding-' + S.CC.L.BASE.s] + S['item-padding-' + S.CC.L.BASE.e]); // Page "C"ontent "B"readth
    let PageCL  = R.Stage[S.CC.L.SIZE.L] - (S['item-padding-' + S.CC.L.BASE.b] + S['item-padding-' + S.CC.L.BASE.a]); // Page "C"ontent "L"ength
    let PageGap = R.Stage.PageGap        + (S['item-padding-' + S.CC.L.BASE.b] + S['item-padding-' + S.CC.L.BASE.a]);
    ['b','a','s','e'].forEach(base => { const trbl = S.CC.L.BASE[base]; Item.style['padding-' + trbl] = S['item-padding-' + trbl] + 'px'; });
    Item.HTML.classList.remove('bibi-columned');
    Item.HTML.style.width = Item.HTML.style.height = '';
    sML.style(Item.HTML, { 'column-fill': '', 'column-width': '', 'column-gap': '', 'column-rule': '' });
    if(!S['single-page-always'] && /-tb$/.test(Item.HTML.WritingMode) && S.SLA == 'horizontal') {
        const HalfL = Math.floor((PageCL - PageGap) / 2);
        if(HalfL >= Math.floor(PageCB * S['orientation-border-ratio'] / 2)) PageCL = HalfL;
    }
    Item.style[S.CC.L.SIZE.b] = PageCB + 'px';
    Item.style[S.CC.L.SIZE.l] = PageCL + 'px';
    const WordWrappingStyleSheetIndex = sML.appendCSSRule(Item.contentDocument, '*', 'word-wrap: break-word;'); ////
    sML.forEach(Item.Body.querySelectorAll('img, svg'))(Img => {
        // Fit Image Size
        if(!Img.BibiDefaultStyle) return;
        ['width', 'height', 'maxWidth', 'maxHeight'].forEach(Pro => Img.style[Pro] = Img.BibiDefaultStyle[Pro]);
        if(S.RVM == 'horizontal' && /-(rl|lr)$/.test(Item.HTML.WritingMode) || S.RVM == 'vertical' && /-tb$/.test(Item.HTML.WritingMode)) return;
        const B = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]), MaxB = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.b]), PageCB));
        const L = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.l]), MaxL = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.l]), PageCL));
        if(B > MaxB || L > MaxL) {
            Img.style[S.CC.L.SIZE.b] = Math.floor(parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]) * Math.min(MaxB / B, MaxL / L)) + 'px';
            Img.style[S.CC.L.SIZE.l] = 'auto';
            Img.style.maxWidth = '100vw';
            Img.style.maxHeight = '100vh';
        }
    });
    Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
    if(!Item.Outsourcing && (S.RVM == 'paged' || Item.HTML['offset'+ S.CC.L.SIZE.B] > PageCB)) {
        // Columify
        R.Columned = Item.Columned = true, Item.ColumnBreadth = PageCB, Item.ColumnLength = PageCL, Item.ColumnGap = PageGap;
        Item.HTML.classList.add('bibi-columned');
        Item.HTML.style[S.CC.L.SIZE.b] = PageCB + 'px';
        Item.HTML.style[S.CC.L.SIZE.l] = PageCL + 'px';
        sML.style(Item.HTML, {
            'column-fill': 'auto',
            'column-width': Item.ColumnLength + 'px',
            'column-gap': Item.ColumnGap + 'px',
            'column-rule': ''
        });
    }
    sML.deleteCSSRule(Item.contentDocument, WordWrappingStyleSheetIndex); ////
    let ItemL = sML.UA.InternetExplorer ? Item.Body['client' + S.CC.L.SIZE.L] : Item.HTML['scroll' + S.CC.L.SIZE.L];
    const HowManyPages = Math.ceil((ItemL + PageGap) / (PageCL + PageGap));
    ItemL = (PageCL + PageGap) * HowManyPages - PageGap;
    Item.style[S.CC.L.SIZE.l] = ItemL + 'px';
    if(sML.UA.InternetExplorer) Item.HTML.style[S.CC.L.SIZE.l] = '100%';
    let ItemBoxB = PageCB + (S['item-padding-' + S.CC.L.BASE.s] + S['item-padding-' + S.CC.L.BASE.e]);
    let ItemBoxL = ItemL  + (S['item-padding-' + S.CC.L.BASE.b] + S['item-padding-' + S.CC.L.BASE.a]);// + ((S.RVM == 'paged' && Item.Spreaded && HowManyPages % 2) ? (PageGap + PageCL) : 0);
    Item.Box.style[S.CC.L.SIZE.b] = ItemBoxB + 'px';
    Item.Box.style[S.CC.L.SIZE.l] = ItemBoxL + 'px';
    Item.Pages.forEach(Page => Item.Box.removeChild(Page));
    Item.Pages = [];
    const PageL = ItemBoxL / HowManyPages;
    for(let i = 0; i < HowManyPages; i++) {
        const Page = Item.Box.appendChild(sML.create('span', { className: 'page' }));
        Page.style[S.CC.L.SIZE.l] = PageL + 'px';
        Page.Item = Item, Page.Spread = Item.Spread;
        Page.IndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
    }
    return Item;
};

R.renderPrePaginatedItem = (Item) => {
    sML.style(Item, { width: '', height: '', transform: '' });
    let StageB = R.Stage[S.CC.L.SIZE.B];
    let StageL = R.Stage[S.CC.L.SIZE.L];
    Item.Spreaded = (
        (S.RVM == 'paged' || !S['full-breadth-layout-in-scroll'])
            &&
        (Item.Ref['rendition:spread'] == 'both' || R.Orientation == Item.Ref['rendition:spread'] || R.Orientation == 'landscape')
    );
    if(!Item.Viewport) Item.Viewport = R.getItemViewport(Item);
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
                StageB / SpreadViewPort[S.CC.L.SIZE.B],
                StageL / SpreadViewPort[S.CC.L.SIZE.L]
            );
            LoPairItem.Scale *= LoBaseItem.Scale;
        } else {
            const SpreadViewPort = {
                Width:  ItemLoVp.Width * (/^(left|right)$/.test(Item.Ref['rendition:page-spread']) ? 2 : 1),
                Height: ItemLoVp.Height
            };
            Item.Scale = Math.min(
                StageB / SpreadViewPort[S.CC.L.SIZE.B],
                StageL / SpreadViewPort[S.CC.L.SIZE.L]
            );
        }
    } else {
        ItemLoVp = R.getItemLayoutViewport(Item);
        if(S.RVM == 'paged' || !S['full-breadth-layout-in-scroll']) {
            Item.Scale = Math.min(
                StageB / ItemLoVp[S.CC.L.SIZE.B],
                StageL / ItemLoVp[S.CC.L.SIZE.L]
            );
        } else {
            Item.Scale = StageB / ItemLoVp[S.CC.L.SIZE.B];
        }
    }
    let PageL = Math.floor(ItemLoVp[S.CC.L.SIZE.L] * Item.Scale);
    let PageB = Math.floor(ItemLoVp[S.CC.L.SIZE.B] * (PageL / ItemLoVp[S.CC.L.SIZE.L]));
    Item.Box.style[S.CC.L.SIZE.l] = PageL + 'px';
    Item.Box.style[S.CC.L.SIZE.b] = PageB + 'px';
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
    Width:  R.Stage.Height * S['orientation-border-ratio'] / (Item.Spreaded && /^(left|right)$/.test(Item.Ref['rendition:page-spread']) ? 2 : 1),
    Height: R.Stage.Height
};

R.SpreadsTurnedFaceUp = [];

R._turnSpread = (Spread, TF) => new Promise(resolve => {
    const AllowPlaceholderItems = !(TF);
    if(!S['allow-placeholders'] || Spread.AllowPlaceholderItems == AllowPlaceholderItems) return resolve(Spread); // no need to turn
    const PreviousSpreadBoxLength = Spread.Box['offset' + S.CC.L.SIZE.L];
    L.loadSpread(Spread, { AllowPlaceholderItems: AllowPlaceholderItems }).then(Spread => {
        resolve(); // ←↙ do asynchronous
        R.layOutSpread(Spread).then(() => {
            R.organizePages();
            const ChangedSpreadBoxLength = Spread.Box['offset' + S.CC.L.SIZE.L] - PreviousSpreadBoxLength;
            if(ChangedSpreadBoxLength != 0) R.Main.Book.style[S.CC.L.SIZE.l] = (parseFloat(getComputedStyle(R.Main.Book)[S.CC.L.SIZE.l]) + ChangedSpreadBoxLength) + 'px';
        });
    }).catch(Spread => {
        resolve();
    });
}).then(() => Spread);

R.turnSpreads = (Opt = {}) => new Promise(resolve => {
    if(!S['allow-placeholders']) return;
    if(!Opt.Origin   ) Opt.Origin    = R.Current.Page.Spread;
    if(!Opt.Range    ) Opt.Range     = [0, 1];//[0, 1, 2, -1];
    if(!Opt.Direction) Opt.Direction = R.Past.Page && R.Past.Page.Index > R.Current.Page.Index ? -1 : 1
    let SpreadsToBeTurnedFaceUp = [];
    let SpreadsToBeTurnedFaceDown = [];
    let Promised = {};
    if(Opt.Range.length) Opt.Range.forEach((Distance, i) => {
        const Spread = R.Spreads[Opt.Origin.Index + Distance * Opt.Direction];
        if(!Spread) return;
        clearTimeout(Spread.Timer_TurningFaceUp);
        clearTimeout(Spread.Timer_TurningFaceDown);
        SpreadsToBeTurnedFaceUp.push(Spread);
        //if(R.SpreadsTurnedFaceUp.includes(Spread)) return;
        //console.log(`TurnFaceUp: [${ Spread.Index }] %O`, Spread);
        if(i == 0) Promised = R._turnSpread(Spread, true);
        else Spread.Timer_TurningFaceUp = setTimeout(() => R._turnSpread(Spread, true), 333 * i);
    }); else Promised = Promise.resolve();
    R.SpreadsTurnedFaceUp.forEach(Spread => { if(!SpreadsToBeTurnedFaceUp.includes(Spread)) SpreadsToBeTurnedFaceUp.push(Spread); });
    R.SpreadsTurnedFaceUp = SpreadsToBeTurnedFaceUp;
    while(R.SpreadsTurnedFaceUp.length > 3) SpreadsToBeTurnedFaceDown.push(R.SpreadsTurnedFaceUp.pop());
    SpreadsToBeTurnedFaceDown.forEach((Spread, i) => {
        clearTimeout(Spread.Timer_TurningFaceUp);
        clearTimeout(Spread.Timer_TurningFaceDown);
        //console.log(`TurnFaceDown: [${ Spread.Index }] %O`, Spread);
        if(O.cancelRetlieving) Spread.Items.forEach(Item => {
            if(Item.ResItems) Item.ResItems.forEach(ResItem => O.cancelRetlieving(ResItem));
            O.cancelRetlieving(Item);
        });
        Spread.Timer_TurningFaceDown = setTimeout(() => R._turnSpread(Spread, false), 99 * i);
    });
    Promised.then(() => resolve(R.SpreadsTurnedFaceUp));
});


R.organizePages = () => {
    R.Pages = [];
    R.Spreads.forEach(Spread => {
        Spread.Pages.forEach(Page => {
            Page.Index = R.Pages.length; R.Pages.push(Page);
            Page.id = 'page-' + (Page.Index + 1 + '').padStart(B.FileDigit, 0);
        });
    });
    return R.Pages;
};


R.layOutStage = () => {
    //E.dispatch('bibi:is-going-to:lay-out-stage');
    let MainContentLayoutLength = 0;
    R.Spreads.forEach(Spread => MainContentLayoutLength += Spread.Box['offset' + S.CC.L.SIZE.L]);
    MainContentLayoutLength += R.Stage.PageGap * (R.Spreads.length - 1);
    R.Main.Book.style[S.CC.L.SIZE.l] = MainContentLayoutLength + 'px';
    //E.dispatch('bibi:laid-out-stage');
};


R.layOut = (Opt) => new Promise((resolve, reject) => {
    // Opt: {
    //     Destination: BibiDestination,
    //     Reset: Boolean,
    //     Setting: BibiSetting (Optional),
    //     before: Function (Optional)
    // }
    if(R.LayingOut) return reject();
    R.LayingOut = true;
    O.log(`Laying out...`, '<g:>');
    if(Opt) O.log(`Option: %O`, Opt); else Opt = {};
    E.dispatch('bibi:closes-utilities');
    E.dispatch('bibi:is-going-to:lay-out', Opt);
    window.removeEventListener(O['resize'], R.onresize);
    R.Main.removeEventListener('scroll', R.onscroll);
    O.Busy = true;
    O.HTML.classList.add('busy');
    O.HTML.classList.add('laying-out');
    if(!Opt.NoNotification) I.note(`Laying out...`);
    if(!Opt.Destination) {
        R.getCurrent();
        const CurrentPage = R.Current.Pages.StartPage;
        Opt.Destination = {
            SpreadIndex: CurrentPage.Spread.Index,
            PageProgressInSpread: CurrentPage.IndexInSpread / CurrentPage.Spread.Pages.length
        }
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
    window.addEventListener(O['resize'], R.onresize);
    R.Main.addEventListener('scroll', R.onscroll);
    R.LayingOut = false;
    E.dispatch('bibi:laid-out');
    O.log(`Laid out.`, '</g>');
    R.getCurrent();
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

R.onscroll = (Eve) => {
    if(!L.Opened) return;
    if(!R.Scrolling) {
        O.HTML.classList.add('scrolling');
        R.Scrolling = true;
        Eve.BibiScrollingBegun = true;
    }
    E.dispatch('bibi:scrolls', Eve);
    clearTimeout(R.Timer_onscrolled);
    R.Timer_onscrolled = setTimeout(() => {
        R.Scrolling = false;
        O.HTML.classList.remove('scrolling');
        E.dispatch('bibi:scrolled', Eve);
    }, 123);
};

R.onresize = (Eve) => {
    if(!L.Opened) return;
    if(!R.Resizing) O.HTML.classList.add('resizing');
    R.Resizing = true;
    E.dispatch('bibi:resizes', Eve);
    clearTimeout(R.Timer_afterresized);
    clearTimeout(R.Timer_onresized);
    R.Timer_onresized = setTimeout(() => {
        O.Busy = true;
        O.HTML.classList.add('busy');
        R.updateOrientation();
        R.Timer_afterresized = setTimeout(() => {
            E.dispatch('bibi:resized', Eve);
            O.Busy = false;
            R.Resizing = false;
            O.HTML.classList.remove('busy');
            O.HTML.classList.remove('resizing');
        }, 100);
    }, O.Touch ? 444 : 222);
};

R.onTap = (Eve) => {
    E.dispatch('bibi:taps',   Eve);
    E.dispatch('bibi:tapped', Eve);
}

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

R.onPointerMove = (Eve) => {
    const CC = O.getBibiEventCoord(Eve), PC = R.onPointerMove.PreviousCoord;
    if(PC.X != CC.X || PC.Y != CC.Y) E.dispatch('bibi:moved-pointer',   Eve);
    else                             E.dispatch('bibi:stopped-pointer', Eve);
    R.onPointerMove.PreviousCoord = CC;
    //Eve.preventDefault();
    Eve.stopPropagation();
};
R.onPointerMove.PreviousCoord = { X:0, Y:0 };

R.changeView = (Param) => {
    if(
        S['fix-reader-view-mode'] ||
        !Param || typeof Param.Mode != 'string' || !/^(paged|horizontal|vertical)$/.test(Param.Mode) ||
        S.RVM == Param.Mode && !Param.Force
    ) return false;
    if(L.Opened) {
        E.dispatch('bibi:closes-utilities');
        E.dispatch('bibi:changes-view');
        O.Busy = true;
        O.HTML.classList.add('busy');
        setTimeout(() => {
            //if(Param.Mode != 'paged') R.Spreads.forEach(Spread => Spread.style.opacity = '');
            R.layOut({
                Reset: true,
                Setting: {
                    'reader-view-mode': Param.Mode
                }
            }).then(() => {
                O.HTML.classList.remove('busy');
                O.Busy = false;
                setTimeout(() => E.dispatch('bibi:changed-view', Param.Mode), 0);
            });
        }, 0);
    } else {
        S.update({
            'reader-view-mode': Param.Mode
        });
        L.play();
    }
    if(S['use-cookie']) {
        O.Cookie.eat(O.RootPath, {
            'RVM': Param.Mode
        });
    }
};


R.getCurrentPages = () => {
    const FrameScrollCoord = {
        Left:   R.Main.scrollLeft,
        Right:  R.Main.scrollLeft + O.Body.offsetWidth, // instead of R.Main.offsetWidth for stretching.
        Top:    R.Main.scrollTop,
        Bottom: R.Main.scrollTop + O.Body.offsetHeight, // instead of R.Main.offsetHeight for stretching.
    };
    FrameScrollCoord.Before = FrameScrollCoord[S.CC.L.BASE.B];
    FrameScrollCoord.After  = FrameScrollCoord[S.CC.L.BASE.A];
    //console.log(FrameScrollCoord);
    let Pages = [], Ratio = [], Status = [], BiggestRatio = 0;
    for(let l = R.Pages.length, i = 0; i < l; i++) { const Page = R.Pages[i];
        const PageCoord = sML.getCoord(Page);
        //if(Page == Page.Item) PageCoord.Bottom = PageCoord.Top + PageCoord.Height * Page.Item.Scale, PageCoord.Right = PageCoord.Left + PageCoord.Width * Page.Item.Scale
        PageCoord.Before = PageCoord[S.CC.L.BASE.B];
        PageCoord.After  = PageCoord[S.CC.L.BASE.A];
        const LengthInside = Math.min(FrameScrollCoord.After * S.CC.L.AXIS.PM, PageCoord.After * S.CC.L.AXIS.PM) - Math.max(FrameScrollCoord.Before * S.CC.L.AXIS.PM, PageCoord.Before * S.CC.L.AXIS.PM);
        //console.log(i, LengthInside);
        const PageRatio = (LengthInside <= 0 || !PageCoord[S.CC.L.SIZE.L] || isNaN(LengthInside)) ? 0 : Math.round(LengthInside / PageCoord[S.CC.L.SIZE.L] * 100);
        //console.log(i, PageRatio);
        if(PageRatio <= 0) {
            if(Pages.length) break;
        } else if(PageRatio > BiggestRatio) {
            Pages = [Page];
            Ratio = [PageRatio];
            Status = [R.getCurrentPages.getStatus(PageRatio, PageCoord, FrameScrollCoord)];
            BiggestRatio = PageRatio;
        } else if(PageRatio == BiggestRatio) {
            Pages.push(Page);
            Ratio.push(PageRatio);
            Status.push(R.getCurrentPages.getStatus(PageRatio, PageCoord, FrameScrollCoord));
        }
    }
    const Params = {
                                                   Ratio: Ratio,                          Status: Status,
        StartPage: Pages[0],              StartPageRatio: Ratio[0],              StartPageStatus: Status[0],
          EndPage: Pages[Pages.length - 1], EndPageRatio: Ratio[Ratio.length - 1], EndPageStatus: Status[Status.length - 1]
    };
    for(const Property in Params) Pages[Property] = Params[Property];
    return Pages;
};

R.getCurrentPages.getStatus = (PageRatio, PageCoord, FrameScrollCoord) => {
    if(PageRatio >= 100) return 'including';
    const Status = [];
    if(window['inner' + S.CC.L.SIZE.L] < PageCoord[S.CC.L.SIZE.L]) Status.push('oversize');
    const FrameBefore = FrameScrollCoord.Before;
    const FrameAfter  = FrameScrollCoord.After;
    if(FrameBefore * S.CC.L.AXIS.PM <  PageCoord.Before * S.CC.L.AXIS.PM) Status.push('entering');
    if(FrameBefore * S.CC.L.AXIS.PM == PageCoord.Before * S.CC.L.AXIS.PM) Status.push('entered');
    if(FrameAfter  * S.CC.L.AXIS.PM == PageCoord.After  * S.CC.L.AXIS.PM) Status.push('passsing');
    if(FrameAfter  * S.CC.L.AXIS.PM  > PageCoord.After  * S.CC.L.AXIS.PM) Status.push('passed');
    return Status.join(' ');
};

R.getCurrent = () => {
    R.Past = R.Current;
    R.Current.Pages = R.getCurrentPages();
    R.Current.Page = R.Current.Pages.EndPage;
    R.Current.Percent = Math.floor((R.Current.Pages.EndPage.Index + 1) / R.Pages.length * 100);
    R.classifyCurrent();
    return R.Current;
};


R.classifyCurrent = () => {
    R.Spreads.forEach(Spread => { Spread.IsCurrent = false;
        Spread.Items.forEach(Item => { Item.IsCurrent = false;
            Item.Pages.forEach(Page => { Page.IsCurrent = false;
                if(R.Current.Pages.includes(Page)) Page.IsCurrent = Item.IsCurrent = Spread.IsCurrent = true;
                Page.classList.toggle('current', Page.IsCurrent);
            });
            Item.Box.classList.toggle('current', Item.IsCurrent);
        });
        Spread.Box.classList.toggle('current', Spread.IsCurrent);
    });
};


R.focusOn = (Par) => new Promise((resolve, reject) => {
    if(R.Moving) return reject();
    if(!Par) return reject();
    if(typeof Par == 'number') Par = { Destination: Par };
    const Dest = R.hatchDestination(Par.Destination);
    if(!Dest) return reject();
    E.dispatch('bibi:is-going-to:focus-on', Par);
    R.Moving = true;
    let FocusPoint = 0;
    if(S['book-rendition-layout'] == 'reflowable') {
        FocusPoint = O.getElementCoord(Dest.Page)[S.CC.L.AXIS.L];
        if(Dest.Side == 'after') FocusPoint += (Dest.Page['offset' + S.CC.L.SIZE.L] - R.Stage[S.CC.L.SIZE.L]) * S.CC.L.AXIS.PM;
        if(S.SLD == 'rtl') FocusPoint += Dest.Page.offsetWidth - R.Stage.Width;
        return resolve({ FocusPoint: FocusPoint, Dest: Dest });
    }/* else {
        if(S['allow-placeholders'] && Par.Turn != false) R.turnSpreads({ Origin: Dest.Page.Spread });
        if(R.Stage[S.CC.L.SIZE.L] >= Dest.Page.Spread['offset' + S.CC.L.SIZE.L]) {
            FocusPoint = O.getElementCoord(Dest.Page.Spread)[S.CC.L.AXIS.L];
            FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Dest.Page.Spread['offset' + S.CC.L.SIZE.L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Dest.Page)[S.CC.L.AXIS.L];
            if(R.Stage[S.CC.L.SIZE.L] > Dest.Page['offset' + S.CC.L.SIZE.L]) FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Dest.Page['offset' + S.CC.L.SIZE.L]) / 2);
        }
        return resolve({ FocusPoint: FocusPoint, Dest: Dest });
    }*/
    ((S['allow-placeholders'] && Par.Turn != false) ? R.turnSpreads({ Origin: Dest.Page.Spread }) : Promise.resolve()).then(() => {
        if(R.Stage[S.CC.L.SIZE.L] >= Dest.Page.Spread['offset' + S.CC.L.SIZE.L]) {
            FocusPoint = O.getElementCoord(Dest.Page.Spread)[S.CC.L.AXIS.L];
            FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Dest.Page.Spread['offset' + S.CC.L.SIZE.L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Dest.Page)[S.CC.L.AXIS.L];
            if(R.Stage[S.CC.L.SIZE.L] > Dest.Page['offset' + S.CC.L.SIZE.L]) FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Dest.Page['offset' + S.CC.L.SIZE.L]) / 2);
        }
        return resolve({ FocusPoint: FocusPoint, Dest: Dest });
    });
}).then(Par => {
    if(typeof Par.Dest.TextNodeIndex == 'number') R.selectTextLocation(Par.Dest); // Colorize Destination with Selection
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[S.CC.L.AXIS.L] = Par.FocusPoint;
    return O.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: 0//(S.RVM == 'paged' && S.ARD != S.SLD ? 0 : Par.Duration)
    }).then(() => {
        R.getCurrent();
        R.Moving = false;
        E.dispatch('bibi:focused-on', Par);
        //console.log(`FOCUSED`);
    });
}).catch(() => Promise.resolve());


R.hatchDestination = (Dest) => { // from Page, Element, or Edge
    if(!Dest) return null;
    if(Dest.Page) return Dest;
    if(typeof Dest == 'number' || (typeof Dest == 'string' && /^\d+$/.test(Dest))) {
        Dest = R.getBibiToDestination(Dest);
    } else if(typeof Dest == 'string') {
        if(Dest == 'head' || Dest == 'foot') {
            Dest = { Edge: Dest };
        } else if(X['EPUBCFI']) {
            Dest = X['EPUBCFI'].getDestination(Dest);
        }
    } else if(Dest.tagName) {
        if(typeof Dest.IndexInItem == 'number') return { Page: Dest }; // Page
        if(typeof Dest.Index       == 'number') return { Page: Dest.Pages[0] }; // Item or Spread
        Dest = { Element: Dest };
    }
    Dest.Page = R.findPageByDestination(Dest);
    return Dest;
};

R.findPageByDestination = (Dest) => {
    if(Dest.Page) return Dest.Page;
    if(Dest.Edge == 'head') return R.Pages[0];
    if(Dest.Edge == 'foot') return R.Pages[R.Pages.length - 1];
    if(typeof Dest.PageIndex == 'number') return R.Pages[Dest.PageIndex];
    if(typeof Dest.PageIndexInItem == 'number') try { return R.findItemByDestination(Dest).Pages[Dest.PageIndexInItem]; } catch(Err) { return null; }
    if(typeof Dest.PageIndexInSpread == 'number') try { return R.findSpreadByDestination(Dest).Pages[Dest.PageIndexInSpread]; } catch(Err) { return null; }
    if(typeof Dest.PageProgressInSpread == 'number') try { const Spread = R.findSpreadByDestination(Dest); return Spread.Pages[Math.floor(Spread.Pages.length * Dest.PageProgressInSpread)]; } catch(Err) { return null; }
    if(typeof Dest.ElementSelector == 'string') try { return R.getNearestPageOfElement(R.findItemByDestination(Dest).contentDocument.querySelector(Dest.ElementSelector)); } catch(Err) { return null; }
    if(Dest.Element) return R.getNearestPageOfElement(Dest.Element);
    try { return R.findItemByDestination(Dest).Pages[0]; } catch(Err) {}
    try { return R.findSpreadByDestination(Dest).Pages[0]; } catch(Err) {}
    return null;
};

R.findItemByDestination = (Dest) => {
    if(Dest.Item) return Dest.Item;
    if(typeof Dest.ItemIndex == 'number') return R.Items[Dest.ItemIndex];
    if(typeof Dest.ItemIndexInSpine == 'number') return B.Package.Spine.Items[Dest.ItemIndexInSpine];
    if(typeof Dest.ItemIndexInSpread == 'number') try { return R.findSpreadByDestination(Dest).Items[Dest.ItemIndexInSpread]; } catch(Err) { return null; }
    //if(Dest.Element && Dest.Element.ownerDocument.body.Item && Dest.Element.ownerDocument.body.Item.Pages) return Dest.Element.ownerDocument.body.Item;
    return null;
};

R.findSpreadByDestination = (Dest) => {
    if(Dest.Spread) return Dest.Spread;
    if(typeof Dest.SpreadIndex == 'number') return R.Spreads[Dest.SpreadIndex];
    return null;
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

R.getNearestPageOfElement = (Ele) => {
    if(!Ele || !Ele.tagName) return null;
    const Item = Ele.ownerDocument.body.Item;
    if(!Item) return null;
    let NearestPage, ElementCoordInItem;
    if(Item.Columned) {
        sML.style(Item.HTML, { 'column-width': '' });
        ElementCoordInItem = O.getElementCoord(Ele)[S.CC.L.AXIS.B];
        if(S.PPD == 'rtl' && S.SLA == 'vertical') {
            ElementCoordInItem = Item.offsetWidth - (S['item-padding-left'] + S['item-padding-right']) - ElementCoordInItem - Ele.offsetWidth;
        }
        sML.style(Item.HTML, { 'column-width': Item.ColumnLength + 'px' });
        NearestPage = Item.Pages[Math.ceil(ElementCoordInItem / Item.ColumnBreadth)];
    } else {
        ElementCoordInItem = O.getElementCoord(Ele)[S.CC.L.AXIS.L];
        if(S.SLD == 'rtl' && S.SLA == 'horizontal') {
            ElementCoordInItem = Item.HTML.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
        }
        NearestPage = Item.Pages[0];
        for(let l = Item.Pages.length, i = 0; i < l; i++) {
            ElementCoordInItem -= Item.Pages[i]['offset' + S.CC.L.SIZE.L];
            if(ElementCoordInItem <= 0) {
                NearestPage = Item.Pages[i];
                break;
            }
        }
    }
    return NearestPage;
};


R.selectTextLocation = (Destination) => {
    if(typeof Destination.TextNodeIndex != 'number' || !Destination.Element) return false;
    const DestinationNode = Destination.Element.childNodes[Destination.TextNodeIndex];
    if(!DestinationNode || !DestinationNode.textContent) return;
    const Sides = { Start: { Node: DestinationNode, Index: 0 }, End: { Node: DestinationNode, Index: DestinationNode.textContent.length } };
    if(Destination.TermStep) {
        if(Destination.TermStep.Preceding || Destination.TermStep.Following) {
            Sides.Start.Index = Destination.TermStep.Index, Sides.End.Index = Destination.TermStep.Index;
            if(Destination.TermStep.Preceding) Sides.Start.Index -= Destination.TermStep.Preceding.length;
            if(Destination.TermStep.Following)   Sides.End.Index += Destination.TermStep.Following.length;
            if(Sides.Start.Index < 0 || DestinationNode.textContent.length < Sides.End.Index) return;
            if(DestinationNode.textContent.substr(Sides.Start.Index, Sides.End.Index - Sides.Start.Index) != Destination.TermStep.Preceding + Destination.TermStep.Following) return;
        } else if(Destination.TermStep.Side && Destination.TermStep.Side == 'a') {
            Sides.Start.Node = DestinationNode.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
            Sides.End.Index = Destination.TermStep.Index - 1;
        } else {
            Sides.Start.Index = Destination.TermStep.Index;
            Sides.End.Node = DestinationNode.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
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
    let CurrentEdge = '', Side = '';
    if(Par.Distance > 0) CurrentEdge = 'EndPage',   Side = 'before';
    else                 CurrentEdge = 'StartPage', Side = 'after';
    R.getCurrent();
    const CurrentPage = R.Current.Pages[CurrentEdge];
    const ToFocus = (
        R.Columned ||
        S.BRL == 'pre-paginated' ||
        CurrentPage.Item.Ref['rendition:layout'] == 'pre-paginated' ||
        CurrentPage.Item.Outsourcing ||
        CurrentPage.Item.Pages.length == 1 ||
        (Par.Distance < 0 && CurrentPage.IndexInItem == 0) ||
        (Par.Distance > 0 && CurrentPage.IndexInItem == CurrentPage.Item.Pages.length - 1)
    );
    let Promised = {};
    if(!ToFocus) {
        Promised = R.scrollBy(Par);
    } else {
        const CurrentPageStatus = R.Current.Pages[CurrentEdge + 'Status'];
        const CurrentPageRatio  = R.Current.Pages[CurrentEdge + 'Ratio'];
        if(/(oversize)/.test(CurrentPageStatus)) {
            if(Par.Distance > 0) {
                     if(CurrentPageRatio >= 90)             Side = 'before';
                else if(/entering/.test(CurrentPageStatus)) Side = 'before', Par.Distance =  0;
                else if( /entered/.test(CurrentPageStatus)) Side = 'after',  Par.Distance =  0;
            } else {
                     if(CurrentPageRatio >= 90)             Side = 'after';
                else if( /passing/.test(CurrentPageStatus)) Side = 'before', Par.Distance =  0;
                else if(  /passed/.test(CurrentPageStatus)) Side = 'after',  Par.Distance =  0;
            }
        } else {
            if(Par.Distance > 0) {
                     if(   /enter/.test(CurrentPageStatus)) Side = 'before', Par.Distance =  0;
            } else {
                     if(    /pass/.test(CurrentPageStatus)) Side = 'after',  Par.Distance =  0;
            }
        }
        //console.log([CurrentPageStatus, CurrentPageRatio, Par.Distance, Side].join(' / '));
        let DestinationPageIndex = CurrentPage.Index + Par.Distance;
             if(DestinationPageIndex <                  0) DestinationPageIndex = 0;
        else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1;
        let DestinationPage = R.Pages[DestinationPageIndex];
        if(S.BRL == 'pre-paginated' && DestinationPage.Item.SpreadPair) {
            if(S.SLA == 'horizontal' && R.Stage[S.CC.L.SIZE.L] > DestinationPage.Spread['offset' + S.CC.L.SIZE.L]) {
                if(Par.Distance < 0 && DestinationPage.IndexInSpread == 0) DestinationPage = DestinationPage.Spread.Pages[1];
                if(Par.Distance > 0 && DestinationPage.IndexInSpread == 1) DestinationPage = DestinationPage.Spread.Pages[0];
            }
        }
        Par.Destination = { Page: DestinationPage, Side: Side };
        Promised = R.focusOn(Par);
    }
    Promised.then(() => {
        resolve();
        E.dispatch('bibi:moved-by', Par);
    });
}).catch(() => Promise.resolve());

R.scrollBy = (Par) => new Promise((resolve, reject) => {
    if(!Par) return reject();
    if(typeof Par == 'number') Par = { Distance: Par };
    if(!Par.Distance || typeof Par.Distance != 'number') return reject();
    E.dispatch('bibi:is-going-to:scroll-by', Par);
    R.Moving = true;
    const ScrollTarget = {
        Frame: R.Main,
        X: 0, Y: 0
    };
    switch(S.SLD) {
        case 'ttb': ScrollTarget.Y = R.Main.scrollTop  + (R.Stage.Height + R.Stage.PageGap) * Par.Distance;      break;
        case 'ltr': ScrollTarget.X = R.Main.scrollLeft + (R.Stage.Width  + R.Stage.PageGap) * Par.Distance;      break;
        case 'rtl': ScrollTarget.X = R.Main.scrollLeft + (R.Stage.Width  + R.Stage.PageGap) * Par.Distance * -1; break;
    }
    O.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: ((S.RVM == 'paged') ? 0 : Par.Duration)
    }).then(() => {
        R.getCurrent();
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

    I.createNotifier();
    I.createVeil();

    E.bind('bibi:readied', () => {
        I.createCatcher();
        I.createPanel();
        I.createMenu();
        I.createHelp();
        I.createPoweredBy();
        I.createFontSizeChanger();
        I.createLoupe();
    });

    E.bind('bibi:prepared', () => {
        I.createNombre();
        I.createSlider();
        I.createTurner();
        I.createArrows();
        I.createSwipeListener();
        I.createKeyListener();
        I.createSpinner();
    });

    E.add('bibi:commands:open-utilities',   () => E.dispatch('bibi:opens-utilities'));
    E.add('bibi:commands:close-utilities',  () => E.dispatch('bibi:closes-utilities'));
    E.add('bibi:commands:toggle-utilities', () => E.dispatch('bibi:toggles-utilities'));

};


I.createNotifier = () => {
    I.Notifier = O.Body.appendChild(sML.create('div', { id: 'bibi-notifier' }));
    E.dispatch('bibi:created-notifier');
};


I.note = (Msg, Time, ErrorOccured) => {
    if(!I.Notifier) return false;
    clearTimeout(I.note.Timer);
         if(!Msg)                       I.note.Time = 0;
    else if(typeof Time == 'undefined') I.note.Time = O.Busy ? 9999 : 2222;
    else                                I.note.Time = Time;
    //setTimeout(() => {
        I.Notifier.innerHTML = `<p${ ErrorOccured ? ' class="error"' : '' }>${ Msg }</p>`;
        O.HTML.classList.add('notifier-shown');
        if(typeof I.note.Time == 'number') I.note.Timer = setTimeout(() => O.HTML.classList.remove('notifier-shown'), I.note.Time);
    //}, 0);
};


I.createVeil = () => {

    I.Veil = I.setToggleAction(O.Body.appendChild(sML.create('div', { id: 'bibi-veil' })), {
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

    I.Veil.open();

    const PlayButtonTitle = (O.Touch ? 'Tap' : 'Click') + ' to Open';
    I.Veil.PlayButton = I.Veil.appendChild(
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
    E.add('bibi:played', () => I.Veil.PlayButton.hide());

    E.dispatch('bibi:created-veil');

};

I.createCatcher = () => {
    // Catcher
    if(S['book'] || S.BookDataElement || !S['accept-local-file']) return;
    const CatcherInnerHTML = I.distillLabels.distillLanguage({
        default: [
            `<div class="pgroup" lang="en">`,
                `<p><strong>Pass Me Your EPUB File!</strong></p>`,
                `<p><em>You Can Open Your Own EPUB.</em></p>`,
                `<p><span>Please ${ O.Touch ? 'Tap' : 'Drag & Drop It Here. <br />Or Click' } Here and Choose It.</span></p>`,
                `<p><small>(Open in Your Device without Uploading)</small></p>`,
            `</div>`
        ].join(''),
        ja: [
            `<div class="pgroup" lang="ja">`,
                `<p><strong>EPUBファイルをここにください！</strong></p>`,
                `<p><em>お持ちの EPUB ファイルを<br />開くことができます。</em></p>`,
                `<p><span>${ O.Touch ? 'ここをタップ' : 'ここにドラッグ＆ドロップするか、<br />ここをクリック' }して選択してください。</span></p>`,
                `<p><small>（外部に送信されず、この端末の中で開きます）</small></p>`,
            `</div>`
        ].join('')
    })[O.Language];
    I.Catcher = O.Body.appendChild(sML.create('div', { id: 'bibi-catcher', innerHTML: CatcherInnerHTML }));
    I.Catcher.title = I.Catcher.querySelector('span').innerHTML.replace(/<br( ?\/)?>/g, '\n').replace(/<[^>]+>/g, '').trim();
    I.Catcher.Input = I.Catcher.appendChild(sML.create('input', { type: 'file' }));
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
        if(Accept.length) I.Catcher.Input.setAttribute('accept', Accept.join(','));
    }
    I.Catcher.Input.addEventListener('change', Eve => {
        let FileData = {};  try { FileData = Eve.target.files[0]; } catch(Err) {}
        L.getBookData.resolve({ BookData: FileData });
    });
    I.Catcher.addEventListener('click', Eve => I.Catcher.Input.click(Eve));
    if(!O.Touch) {
        I.Catcher.addEventListener('dragenter', Eve => { Eve.preventDefault(); O.HTML.classList.add(   'dragenter'); }, 1);
        I.Catcher.addEventListener('dragover',  Eve => { Eve.preventDefault();                                       }, 1);
        I.Catcher.addEventListener('dragleave', Eve => { Eve.preventDefault(); O.HTML.classList.remove('dragenter'); }, 1);
        I.Catcher.addEventListener('drop',      Eve => { Eve.preventDefault();
            let FileData = {};  try { FileData = Eve.dataTransfer.files[0]; } catch(Err) {}
            L.getBookData.resolve({ BookData: FileData });
        }, 1);
    }
    I.Catcher.appendChild(I.getBookIcon());
};


I.createPanel = () => {

    I.Panel = O.Body.appendChild(sML.create('div', { id: 'bibi-panel' }));
    I.setToggleAction(I.Panel, {
        onopened: () => {
            O.HTML.classList.add('panel-opened');
            E.dispatch('bibi:opened-panel');
        },
        onclosed: () => {
            O.HTML.classList.remove('panel-opened');
            E.dispatch('bibi:closed-panel');
        }
    });

    E.add('bibi:commands:open-panel',   I.Panel.open);
    E.add('bibi:commands:close-panel',  I.Panel.close);
    E.add('bibi:commands:toggle-panel', I.Panel.toggle);

    E.add('bibi:closes-utilities',      I.Panel.close);

    I.Panel.Labels = {
        default: { default: `Opoen this Index`, ja: `この目次を開く` },
        active: { default: `Close this Index`, ja: `この目次を閉じる` }
    };
    I.setFeedback(I.Panel, { StopPropagation: true });
    I.Panel.addTapEventListener('tapped', () => E.dispatch('bibi:commands:toggle-panel'));

    // Optimize to Scrollbar Size
    sML.appendCSSRule('html.page-rtl div#bibi-panel:after', 'bottom: ' + (O.Scrollbars.Height) + 'px;');

    // Book Info
    I.Panel.BookInfo            = I.Panel.appendChild(               sML.create('div', { id: 'bibi-panel-bookinfo'            }));
    I.Panel.BookInfo.Box        = I.Panel.BookInfo.appendChild(      sML.create('div', { id: 'bibi-panel-bookinfo-box'        }));

    E.dispatch('bibi:created-panel');

};


I.createMenu = () => {

    if(!S['use-menubar']) O.HTML.classList.add('without-menubar');
    //else if( S['place-menubar-at-top']) O.HTML.classList.add('menubar-top');
    //else                                O.HTML.classList.add('menubar-bottom');

    // Menus
    I.Menu = O.Body.appendChild(sML.create('div', { id: 'bibi-menu' }));
    I.Menu.addEventListener('click', Eve => Eve.stopPropagation());
    I.setHoverActions(I.Menu);
    I.setToggleAction(I.Menu, {
        onopened: () => {
            O.HTML.classList.add('menu-opened');
            E.dispatch('bibi:opened-menu');
        },
        onclosed: () => {
            O.HTML.classList.remove('menu-opened');
            E.dispatch('bibi:closed-menu');
        }
    });
    E.add('bibi:commands:open-menu',   I.Menu.open);
    E.add('bibi:commands:close-menu',  I.Menu.close);
    E.add('bibi:commands:toggle-menu', I.Menu.toggle);

    E.add('bibi:opens-utilities',   Opt => E.dispatch('bibi:commands:open-menu',   Opt));
    E.add('bibi:closes-utilities',  Opt => E.dispatch('bibi:commands:close-menu',  Opt));
    E.add('bibi:toggles-utilities', Opt => E.dispatch('bibi:commands:toggle-menu', Opt));

    E.add('bibi:opened', I.Menu.close);

    E.add('bibi:scrolls', () => {
        clearTimeout(I.Menu.Timer_cool);
        if(!I.Menu.Hot) I.Menu.classList.add('hot');
        I.Menu.Hot = true;
        I.Menu.Timer_cool = setTimeout(() => {
            I.Menu.Hot = false;
            I.Menu.classList.remove('hot');
        }, 1234);
    });
    if(!O.Touch) {
        E.add('bibi:moved-pointer', Eve => {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(I.Menu.Timer_close);
            if(BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) {
                E.dispatch(I.Menu, 'bibi:hovers');
            } else if(I.Menu.Hover) {
                I.Menu.Timer_close = setTimeout(() => E.dispatch(I.Menu, 'bibi:unhovers', Eve), 123);
            }
        });
    }
    I.Menu.L = I.Menu.appendChild(sML.create('div', { id: 'bibi-menu-l' }));
    I.Menu.R = I.Menu.appendChild(sML.create('div', { id: 'bibi-menu-r' }));
    [I.Menu.L, I.Menu.R].forEach(MenuSide => {
        MenuSide.ButtonGroups = [];
        MenuSide.addButtonGroup = function(Par) {
            const ButtonGroup = I.createButtonGroup(Par);
            if(!ButtonGroup) return null;
            this.ButtonGroups.push(ButtonGroup);
            return this.appendChild(ButtonGroup);
        };
    });

    // Optimize to Scrollbar Size
    sML.appendCSSRule([
        'html.view-vertical div#bibi-menu'
    ].join(', '), 'width: calc(100% - ' + (O.Scrollbars.Width) + 'px);');
    sML.appendCSSRule([
        'html.view-vertical.panel-opened div#bibi-menu',
        'html.view-vertical.subpanel-opened div#bibi-menu'
    ].join(', '), 'width: 100%; padding-right: ' + (O.Scrollbars.Width) + 'px;');

    I.SubPanel = null;
    I.SubPanels = [];

    I.createMenu.createPanelSwitch();

    I.createMenu.SettingMenuComponents = [];
    if(!S['fix-reader-view-mode'])                                                                     I.createMenu.SettingMenuComponents.push('ViewModeButtons');
    if(O.WindowEmbedded)                                                                               I.createMenu.SettingMenuComponents.push('NewWindowButton');
    if(O.FullscreenTarget && !O.Touch)                                                                 I.createMenu.SettingMenuComponents.push('FullscreenButton');
    if(S['website-href'] && /^https?:\/\/[^\/]+/.test(S['website-href']) && S['website-name-in-menu']) I.createMenu.SettingMenuComponents.push('WebsiteLink');
    if(!S['remove-bibi-website-link'])                                                                 I.createMenu.SettingMenuComponents.push('BibiWebsiteLink');
    if(I.createMenu.SettingMenuComponents.length) I.createMenu.createSettingMenu();

    E.dispatch('bibi:created-menu');

};


I.createMenu.createPanelSwitch = () => {
    I.PanelSwitch = I.Menu.L.addButtonGroup({ Sticky: true }).addButton({
        Type: 'toggle',
        Labels: {
            default: { default: `Open Index`,  ja: `目次を開く`   },
            active:  { default: `Close Index`, ja: `目次を閉じる` }
        },
        Help: true,
        Icon: `<span class="bibi-icon bibi-icon-toggle-panel"><span class="bar-1"></span><span class="bar-2"></span><span class="bar-3"></span></span>`,
        action: () => I.Panel.toggle()
    });
    E.add('bibi:opened-panel', () => I.setUIState(I.PanelSwitch, 'active'            ));
    E.add('bibi:closed-panel', () => I.setUIState(I.PanelSwitch, ''                  ));
    E.add('bibi:started',      () =>    sML.style(I.PanelSwitch, { display: 'block' }));
    E.dispatch('bibi:created-panel-switch');
};


I.createMenu.createSettingMenu = () => {
    I.Menu.Config = {};
    I.Menu.Config.Button = I.Menu.R.addButtonGroup({ Sticky: true }).addButton({
        Type: 'toggle',
        Labels: {
            default: { default: `Setting`, ja: `設定を変更` },
            active:  { default: `Close Setting-Menu`, ja: `設定メニューを閉じる` }
        },
        Help: true,
        Icon: `<span class="bibi-icon bibi-icon-setting"></span>`
    });
    I.Menu.Config.SubPanel = I.createSubPanel({ Opener: I.Menu.Config.Button, id: 'bibi-subpanel_config' });
    if(
        I.createMenu.SettingMenuComponents.includes('ViewModeButtons')
    ) {
        I.Menu.Config.ViewSection        = I.createMenu.createSettingMenu.createViewSection();
        I.Menu.Config.ViewOptionSectionR = I.createMenu.createSettingMenu.createViewOptionSectionR();
        I.Menu.Config.ViewOptionSectionF = I.createMenu.createSettingMenu.createViewOptionSectionF();
    }
    if(
        I.createMenu.SettingMenuComponents.includes('NewWindowButton') ||
        I.createMenu.SettingMenuComponents.includes('FullscreenButton')
    ) {
        I.Menu.Config.WindowSection      = I.createMenu.createSettingMenu.createWindowSection();
    }
    if(
        I.createMenu.SettingMenuComponents.includes('WebsiteLink') ||
        I.createMenu.SettingMenuComponents.includes('BibiWebsiteLink')
    ) {
        I.Menu.Config.LinkageSection     = I.createMenu.createSettingMenu.createLinkageSection();
    }
    E.dispatch('bibi:created-setting-menu');
};


I.createMenu.createSettingMenu.createViewSection = () => {
    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: `Layout Mode`, ja: `表示モード` } }
    });
    const SS /*= SpreadShape*/ = (ItemShape => `<span class="bibi-shape bibi-shape-spread">${ ItemShape + ItemShape }</span>`)(`<span class="bibi-shape bibi-shape-item"></span>`);
    const Buttons = [{
        Mode: 'paged',
        Labels: {
            default: {
                default: `Page Flipping <small>(with ${ O.Touch ? 'Tap/Swipe' : 'Click/Wheel' })</small>`,
                ja: `ページ単位<small>（${ O.Touch ? 'タップ／スワイプ' : 'クリック／ホイール' }）</small>`
            }
        },
        Icon: `<span class="bibi-icon bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">${ SS + SS + SS }</span></span>`
    }, {
        Mode: 'horizontal',
        Labels: {
            default: {
                default: `Horizontal Scroll`,
                ja: `横スクロール`
            }
        },
        Icon: `<span class="bibi-icon bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">${ SS + SS + SS }</span></span>`
    }, {
        Mode: 'vertical',
        Labels: {
            default: {
                default: `Vertical Scroll`,
                ja: `縦スクロール`
            }
        },
        Icon: `<span class="bibi-icon bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">${ SS + SS + SS }</span></span>`
    }];
    Buttons.forEach(Button => {
        Button.Type = 'radio';
        Button.Notes = true;
        Button.action = () => R.changeView(Button);
    });
    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });
    E.add('bibi:updated-settings', () => {
        ButtonGroup.Buttons.forEach(Button => I.setUIState(Button, (Button.Mode == S.RVM ? 'active' : 'default')));
    });
    return Section;
};


I.createMenu.createSettingMenu.createViewOptionSectionR = () => { // for Reflowable Books
    /*
    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: `Options`, ja: `表示オプション` } }
    });
    const Buttons = [];
    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });
    E.add('bibi:updated-settings', () => {
        Section.style.display = S.BRL == 'reflowable' ? '' : 'none';
        ButtonGroup.Buttons.forEach(Button => I.setUIState(Button, S[Button.Name] ? 'active' : 'default'));
    });
    return Section;
    //*/
};


I.createMenu.createSettingMenu.createViewOptionSectionF = () => { // for Fixed-layout Books
    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: `Options`, ja: `表示オプション` } }
    });
    const Buttons = [{
        Name: 'full-breadth-layout-in-scroll',
        Type: 'toggle',
        Notes: false,
        Labels: {
            default: {
                default: `Full Width for Each Page <small>(in Scrolling Mode)</small>`,
                ja: `スクロール表示で各ページを幅一杯に</small>`
            }
        },
        Icon: `<span class="bibi-icon bibi-icon-full-breadth-layout"></span>`,
        action: function() {
            const IsActive = (this.UIState == 'active');
            S.update({ 'full-breadth-layout-in-scroll': IsActive });
            if(IsActive) O.HTML.classList.add(   'book-full-breadth');
            else         O.HTML.classList.remove('book-full-breadth');
            if(S.RVM == 'horizontal' || S.RVM == 'vertical') R.changeView({ Mode: S.RVM, Force: true });
            if(S['use-cookie']) {
                O.Cookie.eat(O.RootPath, {
                    'FBL': S['full-breadth-layout-in-scroll']
                });
            }
        }
    }];
    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });
    E.add('bibi:updated-settings', () => {
        Section.style.display = S.BRL == 'pre-paginated' ? '' : 'none';
        ButtonGroup.Buttons.forEach(Button => I.setUIState(Button, S[Button.Name] ? 'active' : 'default'));
    });
    return Section;
};


I.createMenu.createSettingMenu.createWindowSection = () => {
    const Buttons = [];
    if(I.createMenu.SettingMenuComponents.includes('NewWindowButton')) {
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
    if(I.createMenu.SettingMenuComponents.includes('FullscreenButton')) {
        Buttons.push({
            Type: 'toggle',
            Labels: {
                default: { default: `Enter Fullscreen`, ja: `フルスクリーンモード` },
                active:  { default: `Exit Fullscreen`, ja: `フルスクリーンモード解除` }
            },
            Icon: `<span class="bibi-icon bibi-icon-toggle-fullscreen"></span>`,
            id: 'bibi-button-toggle-fullscreen',
            action: function() {
                I.Menu.Config.SubPanel.close();
                !O.Fullscreen ? O.FullscreenTarget.requestFullscreen() : O.FullscreenTarget.ownerDocument.exitFullscreen();
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
        const WindowSection = I.Menu.Config.SubPanel.addSection({
            //Labels: { default: { default: `Choose Layout`, ja: `レイアウトを選択` } }
        });
        WindowSection.addButtonGroup({ Buttons: Buttons });
        return WindowSection;
    } else {
        return null;
    }
};


I.createMenu.createSettingMenu.createLinkageSection = () => {
    const Buttons = [];
    if(I.createMenu.SettingMenuComponents.includes('WebsiteLink')) Buttons.push({
        Type: 'link',
        Labels: {
            default: { default: S['website-name-in-menu'].replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') }
        },
        Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
        href: S['website-href'],
        target: '_blank'
    });
    if(I.createMenu.SettingMenuComponents.includes('BibiWebsiteLink')) Buttons.push({
        Type: 'link',
        Labels: {
            default: { default: `BiB/i | Official Website` }
        },
        Icon: `<span class="bibi-icon bibi-icon-open-newwindow"></span>`,
        href: Bibi['href'],
        target: '_blank'
    });
    if(Buttons.length) {
        const LinkageSection = I.Menu.Config.SubPanel.addSection({
            // Labels: { default: { default: `Link${ Buttons.length > 1 ? 's' : '' }`, ja: `リンク` } },
        });
        LinkageSection.addButtonGroup({ Buttons: Buttons });
        return LinkageSection;
    } else {
        return null;
    }
};


I.createFontSizeChanger = () => {
    I.FontSizeChanger = {};
    if(typeof S['font-size-scale-per-step'] != 'number' || S['font-size-scale-per-step'] <= 1) S['font-size-scale-per-step'] = 1.25;
    if(S['use-font-size-changer'] && S['use-cookie']) {
        const BibiCookie = O.Cookie.remember(O.RootPath);
        if(BibiCookie && BibiCookie.FontSize && BibiCookie.FontSize.Step != undefined) I.FontSizeChanger.Step = BibiCookie.FontSize.Step * 1;
    }
    if(typeof I.FontSizeChanger.Step != 'number' || I.FontSizeChanger.Step < -2 || 2 < I.FontSizeChanger.Step) I.FontSizeChanger.Step = 0;
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
        if(Item.Preprocessed && (sML.UA.Chrome || sML.UA.InternetExplorer)) {
            sML.forEach(Item.HTML.querySelectorAll('body, body *'))(Ele => Ele.style.fontSize = parseInt(getComputedStyle(Ele).fontSize) / Item.FontSize.Base + 'rem');
        } else {
            O.editCSSRules(Item.contentDocument, CSSRule => {
                if(!CSSRule || !CSSRule.selectorText || /^@/.test(CSSRule.selectorText)) return;
                try { if(Item.contentDocument.querySelector(CSSRule.selectorText) == Item.HTML) return; } catch(Error) {}
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
            Item.changeFontSizeStep(I.FontSizeChanger.Step);
        } else if(I.FontSizeChanger.Step != 0) {
            Item.changeFontSizeStep(I.FontSizeChanger.Step);
        }
    });
    I.FontSizeChanger.changeFontSizeStep = (Step, Actions) => {
        if(S.BRL == 'pre-paginated') return;
        if(Step == I.FontSizeChanger.Step) return;
        if(!Actions) Actions = {};
        E.dispatch('bibi:changes-font-size');
        if(typeof Actions.before == 'function') Actions.before();
        I.FontSizeChanger.Step = Step;
        if(S['use-font-size-changer'] && S['use-cookie']) {
            O.Cookie.eat(O.RootPath, { FontSize: { Step: Step } });
        }
        setTimeout(() => {
            R.layOut({
                before: () => R.Items.forEach(Item => { if(Item.changeFontSizeStep) Item.changeFontSizeStep(Step); }),
                Reset: true,
                NoNotification: true
            }).then(() => {
                E.dispatch('bibi:changed-font-size', { Step: Step });
                if(typeof Actions.after == 'function') Actions.after();
            });
        }, 88);
    };
    E.add('bibi:changes-font-size', () => E.dispatch('bibi:closes-utilities'));
  //E.add('bibi:changes-view', () => I.FontSizeChanger.changeFontSizeStep(0)); // unnecessary
    if(S['use-font-size-changer']) I.createFontSizeChangerUI();
    E.dispatch('bibi:created-font-size-changer');
};


I.createFontSizeChangerUI = () => {
    const changeFontSizeStep = function() {
        const Button = this;
        I.FontSizeChanger.changeFontSizeStep(Button.Step, {
            before: () => Button.ButtonGroup.Busy = true,
            after:  () => Button.ButtonGroup.Busy = false
        });
    };
    I.createSubPanel({
        Opener: I.Menu.R.addButtonGroup({ Sticky: true, id: 'bibi-buttongroup_font-size' }).addButton({
            Type: 'toggle',
            Labels: {
                default: {
                    default: `Change Font Size`,
                    ja: `文字サイズを変更`
                },
                active: {
                    default: `Close Font Size Menu`,
                    ja: `文字サイズメニューを閉じる`
                }
            },
            //className: 'bibi-button-font-size bibi-button-font-size-change',
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-change"></span>`,
            Help: true
        }),
        id: 'bibi-subpanel_font-size',
        open: () => {}
    }).addSection({
        Labels: {
            default: {
                default: `Choose Font Size`,
                ja: `文字サイズを選択`
            }
        }
    }).addButtonGroup({
        //Tiled: true,
        Buttons: [{
            Type: 'radio',
            Labels: {
                default: {
                    default: `<span class="non-visual-in-label">Font Size:</span> Ex-Large`,
                    ja: `<span class="non-visual-in-label">文字サイズ：</span>最大`
                }
            },
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-exlarge"></span>`,
            action: changeFontSizeStep, Step: 2
        }, {
            Type: 'radio',
            Labels: {
                default: {
                    default: `<span class="non-visual-in-label">Font Size:</span> Large`,
                    ja: `<span class="non-visual-in-label">文字サイズ：</span>大`
                }
            },
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-large"></span>`,
            action: changeFontSizeStep, Step: 1
        }, {
            Type: 'radio',
            Labels: {
                default: {
                    default: `<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>`,
                    ja: `<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>`
                }
            },
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-medium"></span>`,
            action: changeFontSizeStep, Step: 0
        }, {
            Type: 'radio',
            Labels: {
                default: {
                    default: `<span class="non-visual-in-label">Font Size:</span> Small`,
                    ja: `<span class="non-visual-in-label">文字サイズ：</span>小`
                }
            },
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-small"></span>`,
            action: changeFontSizeStep, Step: -1
        }, {
            Type: 'radio',
            Labels: {
                default: {
                    default: `<span class="non-visual-in-label">Font Size:</span> Ex-Small`,
                    ja: `<span class="non-visual-in-label">文字サイズ：</span>最小`
                }
            },
            Icon: `<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-exsmall"></span>`,
            action: changeFontSizeStep, Step: -2
        }]
    }).Buttons.forEach(Button => { if(Button.Step == I.FontSizeChanger.Step) I.setUIState(Button, 'active'); });
};


I.createLoupe = () => {

    I.Loupe = {};

    if(typeof S['loupe-mode']      != 'string' || S['loupe-mode']      != 'with-keys') S['loupe-mode']      = 'pointer-only';
    if(typeof S['loupe-max-scale'] != 'number' || S['loupe-max-scale'] <=           1) S['loupe-max-scale'] = 4;

    if(S['loupe-mode'] == 'with-keys' && !S['use-keys']) return;

    sML.edit(I.Loupe, {
        scale: (Scl, BibiEvent) => { // Scl: Scale
            if(typeof Scl != 'number') return false;
            const CurrentTfm = R.Main.Transformation;
            Scl = Math.round(Scl * 100) / 100;
            if(Scl == CurrentTfm.Scale) return;
            E.dispatch('bibi:changes-scale', Scl);
            if(Scl < 1) {
                I.Loupe.transform({ Scale: Scl, Translation: { X: R.Main.offsetWidth * (1 - Scl) / 2, Y: R.Main.offsetHeight * (1 - Scl) / 2 } });
            } else if(Scl == 1) {
                I.Loupe.transform({ Scale:   1, Translation: { X: 0, Y: 0 } });
            } else {
                if(I.Loupe.UIState != 'active') return false;
                if(!BibiEvent) BibiEvent = { Coord: { X: window.innerWidth / 2, Y: window.innerHeight / 2 } };
                /*
                const CurrentTransformOrigin = {
                    X: window.innerWidth  / 2 + CurrentTfm.Translation.X,
                    Y: window.innerHeight / 2 + CurrentTfm.Translation.Y
                };
                I.Loupe.transform({
                    Scale: Scl,
                    Translation: {
                        X: CurrentTfm.Translation.X + (BibiEvent.Coord.X - (CurrentTransformOrigin.X + (BibiEvent.Coord.X - (CurrentTransformOrigin.X)) * (Scl / CurrentTfm.Scale))),
                        Y: CurrentTfm.Translation.Y + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y)) * (Scl / CurrentTfm.Scale)))
                    }
                });
                */
                // ↓ simplified on culculation
                I.Loupe.transform({
                    Scale: Scl,
                    Translation: {
                        X: CurrentTfm.Translation.X + (BibiEvent.Coord.X - window.innerWidth  / 2 - CurrentTfm.Translation.X) * (1 - Scl / CurrentTfm.Scale),
                        Y: CurrentTfm.Translation.Y + (BibiEvent.Coord.Y - window.innerHeight / 2 - CurrentTfm.Translation.Y) * (1 - Scl / CurrentTfm.Scale)
                    }
                });
            }
            E.dispatch('bibi:changed-scale', R.Main.Transformation.Scale);
        },
        transform: (Tfm, Opt) => new Promise((resolve, reject) => {
            // Tfm: Transformation
            if(!Tfm) return reject();
            if(!Opt) Opt = {};
            clearTimeout(I.Loupe.Timer_onTransformEnd);
            O.HTML.classList.add('transforming');
            const CurrentTfm = R.Main.Transformation;
            if(typeof Tfm.Scale != 'number') Tfm.Scale = CurrentTfm.Scale;
            if(!Tfm.Translation) Tfm.Translation = CurrentTfm.Translation;
            else {
                if(typeof Tfm.Translation.X != 'number') Tfm.Translation.X = CurrentTfm.Translation.X;
                if(typeof Tfm.Translation.Y != 'number') Tfm.Translation.Y = CurrentTfm.Translation.Y;
            }
            if(Tfm.Scale > 1) {
                const OverflowX = window.innerWidth  * (0.5 * (Tfm.Scale - 1));
                const OverflowY = window.innerHeight * (0.5 * (Tfm.Scale - 1));
                Tfm.Translation.X = sML.limitMinMax(Tfm.Translation.X, OverflowX * -1, OverflowX);
                Tfm.Translation.Y = sML.limitMinMax(Tfm.Translation.Y, OverflowY * -1, OverflowY);
            }
            sML.style(R.Main, {
                transform: (Ps => {
                         if(Tfm.Translation.X && Tfm.Translation.Y) Ps.push( 'translate(' + Tfm.Translation.X + 'px' + ', ' + Tfm.Translation.Y + 'px' + ')');
                    else if(Tfm.Translation.X                     ) Ps.push('translateX(' + Tfm.Translation.X + 'px'                                   + ')');
                    else if(                     Tfm.Translation.Y) Ps.push('translateY('                                   + Tfm.Translation.Y + 'px' + ')');
                         if(Tfm.Scale != 1                        ) Ps.push(     'scale(' + Tfm.Scale                                                  + ')');
                    return Ps.length ? Ps.join(' ') : '';
                })([])
            });
            R.Main.PreviousTransformation = R.Main.Transformation;
            R.Main.Transformation = Tfm;
            I.Loupe.Timer_onTransformEnd = setTimeout(() => {
                     if(R.Main.Transformation.Scale == 1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.remove('zoomed-out');
                else if(R.Main.Transformation.Scale <  1) O.HTML.classList.remove('zoomed-in'), O.HTML.classList.add(   'zoomed-out');
                else                                      O.HTML.classList.add(   'zoomed-in'), O.HTML.classList.remove('zoomed-out');
                O.HTML.classList.remove('transforming');
                resolve();
                E.dispatch('bibi:transformed-book', Tfm);
                if(!Opt.Temporary && S['use-loupe'] && S['use-cookie']) O.Cookie.eat(O.BookURL, { Loupe: { Transformation: R.Main.Transformation } });
            }, 345);
        }),
        transformBack:  (Opt) => I.Loupe.transform(R.Main.PreviousTransformation,             Opt) || I.Loupe.transformReset(Opt),
        transformReset: (Opt) => I.Loupe.transform({ Scale: 1, Translation: { X: 0, Y: 0 } }, Opt),
        isAvailable: (Mode) => {
            if(!L.Opened) return false;
            if(I.Loupe.UIState != 'active') return false;
            if(S.BRL == 'reflowable') return false;
            if(Mode == 'TAP') {
                if(!I.KeyListener || !I.KeyListener.ActiveKeys['Space']) return false;
                if(I.Slider && I.Slider.UIState == 'active') return false;
            } else if(Mode == 'MOVE') {
                if(R.Main.Transformation.Scale == 1) return false;
                if(I.Slider && I.Slider.UIState == 'active') return false;
            } else {
                if(!R.PointerIsDowned) return false;
            }
            return true;
        },
        adjustScale: (Scl) => sML.limitMinMax(Scl, 1, S['loupe-max-scale']),
        onTapped: (Eve) => {
            if(!I.Loupe.isAvailable('TAP')) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(BibiEvent.Target.tagName) {
                if(/bibi-menu|bibi-slider/.test(BibiEvent.Target.id)) return false;
                if(O.isAnchorContent(BibiEvent.Target)) return false;
                if(S.RVM == 'horizontal' && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
            }
            I.Loupe.scale(I.Loupe.adjustScale(R.Main.Transformation.Scale + 0.5 * (Eve.shiftKey ? -1 : 1) * 2), BibiEvent);
        },
        onPointerDown: (Eve) => {
            I.Loupe.PointerDownCoord = O.getBibiEvent(Eve).Coord;
            I.Loupe.PointerDownTransformation = {
                Scale: R.Main.Transformation.Scale,
                Translation: {
                    X: R.Main.Transformation.Translation.X,
                    Y: R.Main.Transformation.Translation.Y
                }
            };
        },
        onPointerUp: (Eve) => {
            O.HTML.classList.remove('dragging');
            I.Loupe.Dragging = false;
            delete I.Loupe.PointerDownCoord;
            delete I.Loupe.PointerDownTransformation;
        },
        onPointerMove: (Eve) => {
            if(!I.Loupe.isAvailable('MOVE', Eve)) return false;
            if(R.Main.Transformation.Scale == 1 || !I.Loupe.PointerDownCoord) return;
            I.Loupe.Dragging = true;
            O.HTML.classList.add('dragging');
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(I.Loupe.Timer_TransitionRestore);
            sML.style(R.Main, { transition: 'none', cursor: 'move' });
            I.Loupe.transform({
                Scale: R.Main.Transformation.Scale,
                Translation: {
                    X: I.Loupe.PointerDownTransformation.Translation.X + (BibiEvent.Coord.X - I.Loupe.PointerDownCoord.X),
                    Y: I.Loupe.PointerDownTransformation.Translation.Y + (BibiEvent.Coord.Y - I.Loupe.PointerDownCoord.Y)
                }
            });
            I.Loupe.Timer_TransitionRestore = setTimeout(() => sML.style(R.Main, { transition: '', cursor: '' }), 234);
        },
        lock: () => {
            E.dispatch('bibi:locked-loupe');
            I.Loupe.Locked = true;
        },
        unlock: () => {
            I.Loupe.Locked = false;
            E.dispatch('bibi:unlocked-loupe');
        }
    });
    I.isPointerStealth.addChecker(() => {
        if(I.Loupe.Dragging) return true;
        if(!I.KeyListener || !I.KeyListener.ActiveKeys['Space']) return false;
        return true;
    });

    I.setToggleAction(I.Loupe, {
        onopened: () => {
            O.HTML.classList.add('loupe-active');
            O.HTML.classList.add('loupe-' + S['loupe-mode']);
        },
        onclosed: () => {
            I.Loupe.scale(1);
            O.HTML.classList.remove('loupe-' + S['loupe-mode']);
            O.HTML.classList.remove('loupe-active');
        }
    });

    E.add('bibi:commands:activate-loupe',   (   ) => I.Loupe.open());
    E.add('bibi:commands:deactivate-loupe', (   ) => I.Loupe.close());
    E.add('bibi:commands:toggle-loupe',     (   ) => I.Loupe.toggle());
    E.add('bibi:commands:scale',            Scale => I.Loupe.scale(Scale));

    E.add('bibi:tapped',         Eve => I.Loupe.onTapped(     Eve));
    E.add('bibi:downed-pointer', Eve => I.Loupe.onPointerDown(Eve));
    E.add('bibi:upped-pointer',  Eve => I.Loupe.onPointerUp(  Eve));
    E.add('bibi:moved-pointer',  Eve => I.Loupe.onPointerMove(Eve));

    E.add('bibi:changed-scale', Scale => O.log(`Changed Scale: ${ Scale }`));

    E.add('bibi:opened', () => {
        I.Loupe.open();
        if(S['use-loupe'] && S['use-cookie']) try { I.Loupe.transform(O.Cookie.remember(O.BookURL).Loupe.Transformation); } catch(Err) {}
    });

    E.add('bibi:changes-view',  () => I.Loupe.scale(1));
    E.add('bibi:opened-slider', () => I.Loupe.lock());
    E.add('bibi:closed-slider', () => I.Loupe.unlock());

    if(S['use-loupe']) I.createLoupeUI();
    E.dispatch('bibi:created-loupe');

};


I.createLoupeUI = () => {
    if(S['loupe-mode'] == 'with-keys') {
        const ButtonGroup = I.createSubPanel({
            Opener: I.Menu.R.addButtonGroup({ Sticky: true, Tiled: true, id: 'bibi-buttongroup_loupe' }).addButton({
                Type: 'toggle',
                Labels: {
                    default: {
                        default: `Zoom-in/out`,
                        ja:`'拡大機能`
                    },
                    active: {
                        default: `Close Zoom-in/out Menu`,
                        ja: `拡大機能メニューを閉じる`
                    }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-menu"></span>`,
                Help: true
            }),
            id: 'bibi-subpanel_loupe',
            open: () => {}
        }).addSection({
            Labels: {
                default: {
                    default: `Zoom-in/out or Reset`,
                    ja: `拡大縮小とリセット`
                }
            }
        }).addButtonGroup({
            Buttons: [{
                Type: 'toggle',
                Labels: {
                    default: {
                        default: `Zoom-in/out`,
                        ja: `拡大機能`
                    },
                    active: {
                        default: `Zoom-in/out <small>(activated)</small>`,
                        ja: `拡大機能<small>（現在有効）</small>`
                    }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>`,
                action: () => I.Loupe.toggle(),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : I.Loupe.UIState == 'active' ? 'active' : 'default');
                }
            }, {
                Type: 'normal',
                Labels: {
                    default: { default: `Reset Zoom-in/out`, ja: `元のサイズに戻す` }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>`,
                action: () => I.Loupe.scale(1),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : R.Main.Transformation.Scale == 1 ? 'disabled' : 'default');
                }
            }]
        });
        I.Loupe.updateButtonState = (State) => ButtonGroup.Buttons.forEach(Button => Button.updateState(State));
        const PGroup = ButtonGroup.parentNode.appendChild(sML.create('div', { className: 'bibi-pgroup' }));
        [{
            default: [`<strong>Zoom-in/out is activated</strong>:`, `* Space + Click to Zoom-in`].join(`<br />`),
            ja: [`<strong>拡大機能が有効のとき</strong>：`, `・スペースキーを押しながらクリックで拡大`].join(`<br />`)
        }, {
            default: [`<strong>Zoomed-in</strong>:`, `* Space + Shift + Click to Zoom-out`, `* Space + Drag to Move the Book`].join(`<br />`),
            ja: [`<strong>拡大中</strong>：`, `・スペース + Shift キーを押しながらクリックで縮小`, `・ドラッグで本を移動`].join(`<br />`)
        }].forEach(PContent => PGroup.appendChild(sML.create('p', { className: 'bibi-p', innerHTML: I.distillLabels.distillLanguage(PContent)[O.Language] })));
    } else {
        const ButtonGroup = I.Menu.R.addButtonGroup({
            Sticky: true,
            Tiled: true,
            id: 'bibi-buttongroup_loupe',
            Buttons: [{
                Type: 'normal',
                Labels: {
                    default: { default: `Zoom-in`, ja: `拡大する` }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>`,
                Help: true,
                action: () => I.Loupe.scale(I.Loupe.adjustScale(R.Main.Transformation.Scale + 0.5)),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale >= S['loupe-max-scale']) ? 'disabled' : 'default');
                }
            }, { 
                Type: 'normal',
                Labels: {
                    default: { default: `Reset Zoom-in/out`, ja: `元のサイズに戻す` }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>`,
                Help: true,
                action: () => I.Loupe.scale(1),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale == 1) ? 'disabled' : 'default');
                }
            }, {
                Type: 'normal',
                Labels: {
                    default: { default: `Zoom-out`, ja: `縮小する` }
                },
                Icon: `<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomout"></span>`,
                Help: true,
                action: () => I.Loupe.scale(I.Loupe.adjustScale(R.Main.Transformation.Scale - 0.5)),
                updateState: function(State) {
                    I.setUIState(this, typeof State == 'string' ? State : (R.Main.Transformation.Scale <= 1) ? 'disabled' : 'default');
                }
            }]
        });
        I.Loupe.updateButtonState = (State) => ButtonGroup.Buttons.forEach(Button => Button.updateState(State));
    }
    E.add('bibi:opened',           () => I.Loupe.updateButtonState());
    E.add('bibi:transformed-book', () => I.Loupe.updateButtonState(I.Loupe.Locked ? 'disabled' : null));
    E.add('bibi:locked-loupe',     () => I.Loupe.updateButtonState('disabled'));
    E.add('bibi:unlocked-loupe',   () => I.Loupe.updateButtonState());
};


I.createButtonGroup = (Par) => {

    if(!Par || typeof Par != 'object') return null;

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

    const ButtonsToAdd = Par.Buttons instanceof Array ? Par.Buttons : Par.Button ? [Par.Button] : [];
    delete Par.Buttons;
    delete Par.Button;

    const ButtonGroup = sML.create('ul', Par);

    ButtonGroup.Buttons = [];
    ButtonGroup.addButton = function(Par) {
        const Button = I.createButton(Par);
        if(!Button) return null;
        Button.ButtonGroup = this;
        this.appendChild(sML.create('li', { className: 'bibi-buttonbox bibi-buttonbox-' + Button.Type })).appendChild(Button)
        this.Buttons.push(Button);
        return Button;
    };
    ButtonsToAdd.forEach(ButtonToAdd => ButtonGroup.addButton(ButtonToAdd));

    ButtonGroup.Busy = false;

    return ButtonGroup;

};


I.createButton = (Par) => {

    if(!Par || typeof Par != 'object') return null;
    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id)        delete Par.id;

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
        StopPropagation: true,
        PreventDefault: (Button.href ? false : true)
    });

    Button.isAvailable = () => {
        if(Button.Busy) return false;
        if(Button.ButtonGroup && Button.ButtonGroup.Busy) return false;
        return (Button.UIState != 'disabled');
    };

    if(typeof Button.action == 'function') Button.addTapEventListener('tapped', function() { return Button.isAvailable() ? Button.action.apply(Button, arguments) : false; });

    Button.Busy = false;

    return Button;

};


I.createSubPanel = (Par) => {

    if(!Par || typeof Par != 'object') return null;

    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id)        delete Par.id;

    const ClassNames = ['bibi-subpanel'];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');

    const SectionsToAdd = Par.Sections instanceof Array ? Par.Sections : Par.Section ? [Par.Section] : [];
    delete Par.Sections;
    delete Par.Section;

    const SubPanel = O.Body.appendChild(sML.create('div', Par));
    SubPanel.Sections = [];

    SubPanel.addEventListener(O['pointerdown'], Eve => Eve.stopPropagation());
    SubPanel.addEventListener(O['pointerup'],   Eve => Eve.stopPropagation());

    I.setToggleAction(SubPanel, {
        onopened: function(Opt) {
            I.SubPanels.forEach(SP => {
                if(SP == SubPanel) return;
                SP.close({ ForAnotherSubPanel: true });
            });
            I.SubPanel = this;
            this.classList.add('opened');
            O.HTML.classList.add('subpanel-opened');
            if(SubPanel.Opener) {
                SubPanel.Bit.adjust(SubPanel.Opener);
                I.setUIState(SubPanel.Opener, 'active');
            }
            if(Par.onopened) Par.onopened.apply(SubPanel, arguments);
        },
        onclosed: function(Opt) {
            this.classList.remove('opened');
            if(I.SubPanel == this) setTimeout(() => I.SubPanel = null, 222);
            if(!Opt || !Opt.ForAnotherSubPanel) {
                O.HTML.classList.remove('subpanel-opened');
            }
            if(SubPanel.Opener) {
                I.setUIState(SubPanel.Opener, 'default');
            }
            if(Par.onclosed) Par.onclosed.apply(SubPanel, arguments);
        }
    });
    if(SubPanel.Opener) SubPanel.Opener.addTapEventListener('tapped', () => SubPanel.toggle());

    E.add('bibi:opened-panel',      SubPanel.close);
    E.add('bibi:closes-utilities',  SubPanel.close);

    SubPanel.Bit = SubPanel.appendChild(sML.create('span', { className: 'bibi-subpanel-bit',
        SubPanel: SubPanel,
        adjust: function(Ele) {
            if(!Ele) return;
            const Center = O.getElementCoord(Ele).X + Ele.offsetWidth / 2 - O.getElementCoord(this.SubPanel).X;
            sML.style(this.SubPanel, { transformOrigin: Center + 'px 0' });
            sML.style(this.SubPanel.Bit, { left: Center + 'px' });
        }
    }));
    I.SubPanels.push(SubPanel);

    SubPanel.addSection = function(Par) {
        if(!Par || typeof Par != 'object') return null;
        const SubPanelSection = I.createSubPanelSection(Par);
        if(!SubPanelSection) return null;
        SubPanelSection.SubPanel = this;
        this.appendChild(SubPanelSection)
        this.Sections.push(SubPanelSection);
        return SubPanelSection;
    };
    SectionsToAdd.forEach(SectionToAdd => SubPanel.addSection(SectionToAdd));

    return SubPanel;

};


I.createSubPanelSection = (Par) => {

    if(!Par || typeof Par != 'object') return null;

    if(typeof Par.className != 'string' || !Par.className) delete Par.className;
    if(typeof Par.id        != 'string' || !Par.id)        delete Par.id;

    const ClassNames = ['bibi-subpanel-section'];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(' ');

    const PGroupsToAdd = Par.PGroups instanceof Array ? Par.PGroups : Par.PGroup ? [Par.PGroup] : [];
    delete Par.PGroups;
    delete Par.PGroup;

    const ButtonGroupsToAdd = Par.ButtonGroups instanceof Array ? Par.ButtonGroups : Par.ButtonGroup ? [Par.ButtonGroup] : [];
    delete Par.ButtonGroups;
    delete Par.ButtonGroup;
    
    const SubPanelSection = sML.create('div', Par);

    // HGroup
    if(SubPanelSection.Labels) {
        SubPanelSection.Labels = I.distillLabels(SubPanelSection.Labels);
        SubPanelSection.appendChild(
            sML.create('div',  { className: 'bibi-hgroup' })
        ).appendChild(
            sML.create('p',    { className: 'bibi-h' })
        ).appendChild(
            sML.create('span', { className: 'bibi-h-label', innerHTML: SubPanelSection.Labels['default'][O.Language] })
        );
    }

    // ButtonGroups
    SubPanelSection.ButtonGroups = [];
    SubPanelSection.addButtonGroup = function(Par) {
        if(!Par || typeof Par != 'object') return null;
        const ButtonGroup = I.createButtonGroup(Par);
        this.appendChild(ButtonGroup);
        this.ButtonGroups.push(ButtonGroup);
        return ButtonGroup;
    };
    ButtonGroupsToAdd.forEach(ButtonGroupToAdd => SubPanelSection.addButtonGroup(ButtonGroupToAdd));

    return SubPanelSection;

};


I.createHelp = () => {

    I.Help = O.Body.appendChild(sML.create('div', { id: 'bibi-help' }));
    I.Help.Message = I.Help.appendChild(sML.create('p', { className: 'hidden', id: 'bibi-help-message' }));

    I.Help.show = (HelpText) => {
        clearTimeout(I.Help.Timer_deactivate1);
        clearTimeout(I.Help.Timer_deactivate2);
        I.Help.classList.add('active');
        I.Help.Message.innerHTML = HelpText;
        setTimeout(() => I.Help.classList.add('shown'), 0);
    };
    I.Help.hide = () => {
        I.Help.Timer_deactivate1 = setTimeout(() => {
            I.Help.classList.remove('shown');
            I.Help.Timer_deactivate2 = setTimeout(() => { 
                I.Help.classList.remove('active');
            }, 200);
        }, 100);
    };

    // Optimize to Scrollbar Size
    sML.appendCSSRule([
        'html.view-paged div#bibi-help',
        'html.view-horizontal div#bibi-help',
        'html.page-rtl.panel-opened div#bibi-help'
    ].join(', '), 'bottom: ' + (O.Scrollbars.Height) + 'px;');

};


I.createPoweredBy = () => {

    I.PoweredBy = O.Body.appendChild(sML.create('div', { id: 'bibi-poweredby', innerHTML: `<p><a href="${ Bibi['href'] }" target="_blank" title="BiB/i | Official Website">BiB/i</a></p>` }));

    // Optimize to Scrollbar Size
    sML.appendCSSRule([
        'html.view-paged div#bibi-poweredby',
        'html.view-horizontal div#bibi-poweredby',
        'html.page-rtl.panel-opened div#bibi-poweredby'
    ].join(', '), 'bottom: ' + (O.Scrollbars.Height) + 'px;');

};


I.createNombre = () => {

    if(!S['use-nombre']) return;

    // Progress > Nombre
    I.Nombre = O.Body.appendChild(sML.create('div', { id: 'bibi-nombre',
        show: () => {
            clearTimeout(I.Nombre.Timer_hot);
            clearTimeout(I.Nombre.Timer_vanish);
            I.Nombre.classList.add('active');
            I.Nombre.Timer_hot = setTimeout(() => I.Nombre.classList.add('hot'), 10);
        },
        hide: () => {
            clearTimeout(I.Nombre.Timer_hot);
            clearTimeout(I.Nombre.Timer_vanish);
            I.Nombre.classList.remove('hot');
            I.Nombre.Timer_vanish = setTimeout(() => I.Nombre.classList.remove('active'), 255);
        },
        progress: (PageInfo) => {
            clearTimeout(I.Nombre.Timer_hide);
            if(!PageInfo || !PageInfo.Pages) PageInfo = R.getCurrent();
            if(typeof PageInfo.Percent != 'number') PageInfo.Percent = Math.floor((PageInfo.Pages.EndPage.Index + 1) / R.Pages.length * 100);
            if(!R.Current.Page) return;
            I.Nombre.Current.innerHTML = (() => {
                let PageNumber = PageInfo.Pages.StartPage.Index + 1;
                if(PageInfo.Pages.StartPage != PageInfo.Pages.EndPage) PageNumber += `<span class="delimiter">-</span>${ PageInfo.Pages.EndPage.Index + 1 }`;
                return PageNumber;
            })();
            I.Nombre.Delimiter.innerHTML = `/`;
            I.Nombre.Total.innerHTML     = R.Pages.length;
            I.Nombre.Percent.innerHTML   = `(${ PageInfo.Percent }<span class="unit">%</span>)`;
            I.Nombre.show();
            I.Nombre.Timer_hide = setTimeout(I.Nombre.hide, 1234);
        }
    }));
    I.Nombre.Current   = I.Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-current'   }));
    I.Nombre.Delimiter = I.Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-delimiter' }));
    I.Nombre.Total     = I.Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-total'     }));
    I.Nombre.Percent   = I.Nombre.appendChild(sML.create('span', { id: 'bibi-nombre-percent'   }));
    E.add('bibi:scrolls', () =>            I.Nombre.progress()    );
    E.add('bibi:resized', () =>            I.Nombre.progress()    );
    E.add('bibi:opened' , () => setTimeout(I.Nombre.progress, 321));

    sML.appendCSSRule('html.view-paged div#bibi-nombre',      'bottom: ' + (O.Scrollbars.Height + 2) + 'px;');
    sML.appendCSSRule('html.view-horizontal div#bibi-nombre', 'bottom: ' + (O.Scrollbars.Height + 2) + 'px;');
    sML.appendCSSRule('html.view-vertical div#bibi-nombre',    'right: ' + (O.Scrollbars.Height + 2) + 'px;');

    E.dispatch('bibi:created-nombre');

};


I.createSlider = () => {

    I.Slider = O.Body.appendChild(
        sML.create('div', { id: 'bibi-slider',
            BookStretchingEach: 0,
            zoomOutBook: () => {
                const BookMarginStart = S.ARA == 'horizontal' ? I.Menu.offsetHeight : 0;
                const BookMarginEnd   = 78;
                const Transformation = {
                    Scale: (R.Main['offset' + S.CC.A.SIZE.B] - (BookMarginStart + BookMarginEnd)) / (R.Main['offset' + S.CC.A.SIZE.B] - O.Scrollbars[S.CC.A.SIZE.B]),
                    Translation: {}
                };
                Transformation.Translation[S.CC.A.AXIS.L] = (S.RVM == 'vertical' ? I.Menu.offsetHeight / 4 : 0);
                Transformation.Translation[S.CC.A.AXIS.B] = BookMarginStart - (R.Main['offset' + S.CC.A.SIZE.B]) * (1 - Transformation.Scale) / 2 - (S.RVM != 'paged' ? O.Scrollbars[S.CC.A.SIZE.B] / 2 : 0);
                I.Slider.BookStretchingEach = (O.Body['offset' + S.CC.A.SIZE.L] / Transformation.Scale - R.Main['offset' + S.CC.A.SIZE.L]) / 2;
                R.Main.style['padding' + S.CC.A.BASE.B] = R.Main.style['padding' + S.CC.A.BASE.A] = I.Slider.BookStretchingEach + 'px';
                if(S.ARA == S.SLA) R.Main.Book.style['padding' + (S.ARA == 'horizontal' ? 'Right' : 'Bottom')] = I.Slider.BookStretchingEach + 'px';
                I.Loupe.transform(Transformation, { Temporary: true }).then(I.Slider.progress);
            },
            resetZoomingOutOfBook: () => {
                I.Loupe.transformReset().then(() => {
                    //R.Main.style[S.CC.A.SIZE.l] = '';
                    R.Main.style['padding' + S.CC.A.BASE.B] = R.Main.style['padding' + S.CC.A.BASE.A] = '';
                    if(S.ARA == S.SLA) R.Main.Book.style['padding' + (S.ARA == 'horizontal' ? 'Right' : 'Bottom')] = '';
                    I.Slider.BookStretchingEach = 0;
                    I.Slider.progress();
                });
            },
            resetThumbAndRail: () => {
                I.Slider.Thumb.style.width = I.Slider.Thumb.style.height = I.Slider.Rail.style.width = I.Slider.Rail.style.height = '';
                I.Slider.Thumb.LengthRatio = R.Main['offset' + S.CC.L.SIZE.L] / R.Main['scroll' + S.CC.L.SIZE.L];
                I.Slider.Thumb.style[S.CC.A.SIZE.l] = (      I.Slider.Thumb.LengthRatio * 100) + '%';
                I.Slider.Rail.style[ S.CC.A.SIZE.l] = (100 - I.Slider.Thumb.LengthRatio * 100) + '%';
                I.Slider.Rail.Coords = [O.getElementCoord(I.Slider.Rail)[S.CC.A.AXIS.L]];
                I.Slider.Rail.Coords.push(I.Slider.Rail.Coords[0] + I.Slider.Rail['offset' + S.CC.A.SIZE.L]);
            },
            progress: () => {
                if(I.Slider.Touching) return;
                I.Slider.Thumb.style.top = I.Slider.Thumb.style.right = I.Slider.Thumb.style.bottom = I.Slider.Thumb.style.left = '';
                const BASE = (S.RVM == 'paged' && S.SLD == 'ttb') ? S.CC.A.BASE.b : S.CC.A.OOLT.l;
                let ScrollBefore = R.Main['scroll' + S.CC.L.OOLT.L];
                let ScrollLength = R.Main['scroll' + S.CC.L.SIZE.L];
                if(S.RVM != 'paged' || S.SLD != 'ttb') ScrollLength -= I.Slider.BookStretchingEach * 2;
                I.Slider.Thumb.style[BASE] = ((ScrollBefore / ScrollLength) * 100) + '%';
                I.Slider.Rail.Progress.style.width = I.Slider.Rail.Progress.style.height = '';
                let Progress = O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb['offset' + S.CC.A.SIZE.L] / 2 - O.getElementCoord(I.Slider.Rail)[S.CC.A.AXIS.L];
                if(S.ARD == 'rtl') Progress = I.Slider.Rail['offset' + S.CC.A.SIZE.L] - Progress;
                I.Slider.Rail.Progress.style[S.CC.A.SIZE.l] = (Progress / I.Slider.Rail['offset' + S.CC.A.SIZE.L] * 100) + '%';
            },
            initializeBookmap: () => {
                R.Spreads.forEach(Spread => {
                    Spread.BookmapSpread = sML.create('div', { className: 'bookmap-spread', Box: document.createElement('div') });
                    I.Slider.Bookmap.appendChild(Spread.BookmapSpread.Box).appendChild(Spread.BookmapSpread);
                    Spread.Items.forEach(Item => {
                        Item.BookmapItem = { Box: document.createElement('div') };
                        Spread.BookmapSpread.appendChild(Item.BookmapItem.Box);
                    });
                });
            },
            removeBookmap: (Lock) => {
                clearTimeout(I.Slider.Bookmap.Timer_append);
                if(I.Slider.Bookmap.Locked) return false;
                I.Slider.Bookmap.Locked = Lock;
                if(I.Slider.Bookmap.paretElement) {
                    return I.Slider.BookmapBox.removeChild(I.Slider.Bookmap);
                } else {
                    return false;
                }
            },
            appendBookmap: (Unlock) => {
                if(Unlock) I.Slider.Bookmap.Locked = false;
                if(I.Slider.Bookmap.Locked) return false;
                if(!I.Slider.Bookmap.paretElement) {
                    return I.Slider.Bookmap.Timer_append = setTimeout(() => {
                        I.Slider.BookmapBox.appendChild(I.Slider.Bookmap);
                        I.Slider.resetThumbAndRail();
                    }, Unlock ? 0 : 456);
                } else {
                    return false;
                }
            },
            resetBookmap: () => {
                I.Slider.removeBookmap('Lock');
                R.Spreads.forEach(Spread => setTimeout(I.Slider.resetBookmapSpread, 0, Spread));
                I.Slider.appendBookmap('Unlock');
            },
            resetBookmapSpread: (Spread) => {
                I.Slider.removeBookmap();
                const SpreadBox = Spread.Box, BmSpread = Spread.BookmapSpread, BmSpreadBox = BmSpread.Box;
                sML.forEach(BmSpread.querySelectorAll('span.bookmap-page'))(OldBmPage => OldBmPage.parentElement.removeChild(OldBmPage));
                BmSpreadBox.className = 'bookmap-spread-box'; sML.forEach(SpreadBox.classList)(ClassName => { if(ClassName != 'spread-box') BmSpreadBox.classList.add(ClassName); });
                BmSpreadBox.style[S.CC.A.SIZE.b] = BmSpread.style[S.CC.A.SIZE.b] = '';
                BmSpreadBox.style[S.CC.A.SIZE.l] = (SpreadBox['offset' + S.CC.L.SIZE.L] / R.Main['scroll' + S.CC.L.SIZE.L] * 100) + '%';
                BmSpread.style[S.CC.A.SIZE.l] = (Spread['offset' + S.CC.L.SIZE.L] / SpreadBox['offset' + S.CC.L.SIZE.L] * 100) + '%';
                Spread.Items.forEach(Item => {
                    const ItemBox = Item.Box, BmItemBox = Item.BookmapItem.Box;
                    BmItemBox.className = 'bookmap-item-box'; sML.forEach(ItemBox.classList)(ClassName => { if(ClassName != 'item-box') BmItemBox.classList.add(ClassName); });
                    BmItemBox.style[S.CC.A.SIZE.b] = (ItemBox['offset' + S.CC.L.SIZE.B] / Spread['offset' + S.CC.L.SIZE.B] * 100) + '%';
                    BmItemBox.style[S.CC.A.SIZE.l] = (ItemBox['offset' + S.CC.L.SIZE.L] / Spread['offset' + S.CC.L.SIZE.L] * 100) + '%';
                    Item.Pages.forEach(Page => {
                        const BmPage = Page.BookmapPage = sML.create('span', { className: 'bookmap-page', Page: Page });
                        BmPage.style[S.CC.A.SIZE.l] = (1 / Item.Pages.length * 100) + '%';
                        if(I.Nombre) {
                            BmPage.addEventListener(O['pointerover'], () => {
                                if(I.Slider.Touching) return;
                                clearTimeout(I.Slider.Timer_BookmapPagePointerOut);
                                I.Nombre.progress({ Pages: { StartPage: Page, EndPage: Page } });
                            });
                            BmPage.addEventListener(O['pointerout'], () => {
                                if(I.Slider.Touching) return;
                                I.Slider.Timer_BookmapPagePointerOut = setTimeout(() => {
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
                I.Slider.appendBookmap();
            },
            getTouchStartCoord: (Eve) => {
                return (Eve.target == I.Slider.Thumb) ?
                    O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L] : // ← Move Thumb naturally. // ↓ Bring Thumb's center to the touched coord at the next pointer moving.
                    O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb['offset' + S.CC.A.SIZE.L] / 2;
            },
            onTouchStart: (Eve) => {
                if(!Eve.target || (!I.Slider.contains(Eve.target) && Eve.target != I.Slider)) return;
                Eve.preventDefault();
                //R.Main.style.overflow = 'hidden'; // ← ↓ to stop momentum scrolling
                //setTimeout(() => R.Main.style.overflow = '', 1);
                I.Slider.Touching = true;
                I.Slider.TouchStartThumbCenterCoord = O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb['offset' + S.CC.A.SIZE.L] / 2;
                I.Slider.TouchStartCoord = I.Slider.TouchingCoord = I.Slider.getTouchStartCoord(Eve);
                clearTimeout(I.Slider.Timer_onTouchEnd);
                O.HTML.classList.add('slider-sliding');
                E.add('bibi:moved-pointer', I.Slider.onTouchMove);
            },
            onTouchMove: (Eve) => {
                I.Slider.TouchingCoord = O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L];
                I.Slider.flip(Eve);
            },
            onTouchEnd: (Eve) => {
                if(!I.Slider.Touching) return;
                I.Slider.Touching = false;
                E.remove('bibi:moved-pointer', I.Slider.onTouchMove);
                I.Slider.onTouchMove(Eve);
                I.Slider.Timer_onTouchEnd = setTimeout(() => O.HTML.classList.remove('slider-sliding'), 125);
            },
            flip: (Eve) => {
                //clearTimeout(I.Slider.Timer_flipFocus);
                if(I.Slider.Touching) {
                    let Translation = I.Slider.TouchingCoord - I.Slider.TouchStartCoord;
                    let TranslatedCenter = I.Slider.TouchStartThumbCenterCoord + Translation;
                         if(TranslatedCenter < I.Slider.Rail.Coords[0]) Translation = I.Slider.Rail.Coords[0] - I.Slider.TouchStartThumbCenterCoord;
                    else if(TranslatedCenter > I.Slider.Rail.Coords[1]) Translation = I.Slider.Rail.Coords[1] - I.Slider.TouchStartThumbCenterCoord;
                    sML.style(I.Slider.Thumb,         { transform: 'translate' + S.CC.A.AXIS.L + '(' +      Translation                                                                    + 'px)' });
                    sML.style(I.Slider.Rail.Progress, { transform:     'scale' + S.CC.A.AXIS.L + '(' + (1 + Translation / I.Slider.Rail.Progress['offset' + S.CC.A.SIZE.L] * S.CC.A.AXIS.PM) + ')' });
                    I.Slider.focus(Eve, { Turn: false, History: false });/*
                    new Promise((resolve) > {
                        if(!S['allow-placeholders']) return resolve();
                        I.Slider.Timer_flipFocus = setTimeout(() => resolve(), 0);
                    }).then(() => {
                        I.Slider.focus(Eve, { Turn: false, History: false });
                    });*/
                } else I.Slider.focus(Eve).then(() => {
                    sML.style(I.Slider.Thumb,         { transform: '' });
                    sML.style(I.Slider.Rail.Progress, { transform: '' });
                    I.Slider.progress();
                });
            },
            focus: (Eve, Par = {}) => new Promise(resolve => {
                Par.Destination = I.Slider.getPageToBeFocusedOn(I.Slider.getTouchEndElement(Eve));
                if(!R.Current.Pages.includes(Par.Destination)) {
                    Par.Duration = 0;
                    R.focusOn(Par).then(resolve);
                } else resolve();
            }),
            getTouchEndElement: (Eve) => {
                return I.Slider.Bookmap.contains(Eve.target) ? Eve.target : (TouchEndElementPoint => {
                    TouchEndElementPoint[S.CC.A.AXIS.L] = sML.limitMinMax(I.Slider.TouchingCoord, I.Slider.Rail.Coords[0], I.Slider.Rail.Coords[1]);
                    TouchEndElementPoint[S.CC.A.AXIS.B] = O.getElementCoord(I.Slider)[S.CC.A.AXIS.B] + I.Slider['offset' + S.CC.A.SIZE.B] / 2;
                    return document.elementFromPoint(TouchEndElementPoint.X, TouchEndElementPoint.Y);
                })({});
            },
            getPageToBeFocusedOn: (Ele) => {
                if(Ele.classList.contains('bookmap-page')) return Ele.Page;
                const Ones = (Ele.classList.contains('bookmap-item') || Ele.classList.contains('bookmap-spread')) ? Ele.querySelectorAll('span.bookmap-page') : I.Slider.Bookmap.querySelectorAll('div.bookmap-spread');
                const TouchingCoord = I.Slider.TouchingCoord * S.CC.A.AXIS.PM;
                let TheOne = Ones[Ones.length - 1], PrevOne = null, PrevOneFootCoord = 0;
                for(let l = Ones.length, i = 0; i < l; i++) {
                    const One = Ones[i], OneCoord = O.getElementCoord(One)[S.CC.A.AXIS.L], OneFootCoord = (OneCoord + (S.ARD != 'rtl' ? One['offset' + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    if(OneFootCoord < TouchingCoord) {
                        PrevOne = One, PrevOneFootCoord = OneFootCoord;
                        continue;
                    }
                    const OneHeadCoord = (OneCoord + (S.ARD == 'rtl' ? One['offset' + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    TheOne = (TouchingCoord < OneHeadCoord && PrevOne && TouchingCoord - PrevOneFootCoord < OneHeadCoord - TouchingCoord) ? PrevOne : One;
                }
                return I.Slider.getPageToBeFocusedOn(TheOne);
            },
            activate: () => {/*
                if(I.Nombre) {
                    I.Slider.Thumb.addEventListener(O['pointerover'], I.Nombre.show);
                    I.Slider.Thumb.addEventListener(O['pointerout'],  I.Nombre.hide);
                }*/
                I.Slider.Bookmap.addEventListener(O['pointerdown'], I.Slider.onTouchStart);
                O.HTML.addEventListener(O['pointerup'], I.Slider.onTouchEnd);
                E.add('bibi:scrolls', I.Slider.progress);
                I.Slider.progress();
            },
            activateItem: (Item) => {
                Item.HTML.addEventListener(O['pointerup'], I.Slider.onTouchEnd);
            },
            deactivate: () => {/*
                if(I.Nombre) {
                    I.Slider.Thumb.removeEventListener(O['pointerover'], I.Nombre.show);
                    I.Slider.Thumb.removeEventListener(O['pointerout'],  I.Nombre.hide);
                }*/
                I.Slider.Bookmap.removeEventListener(O['pointerdown'], I.Slider.onTouchStart);
                R.Items.concat(O).forEach(Ele => Ele.HTML.removeEventListener(O['pointerup'], I.Slider.onTouchEnd));
                E.remove('bibi:scrolls', I.Slider.progress);
            }
        })
    );
    I.Slider.BookmapBox    = I.Slider.appendChild(sML.create('div', { id: 'bibi-slider-bookmap-box' }));
    I.Slider.Bookmap       = sML.create('div', { id: 'bibi-slider-bookmap' }); // to be appended to BookmapBox
    I.Slider.Rail          = I.Slider.Bookmap.appendChild(sML.create('div', { id: 'bibi-slider-rail' }));
    I.Slider.Rail.Progress = I.Slider.Rail.appendChild(sML.create('div', { id: 'bibi-slider-rail-progress' }));
    I.Slider.Thumb         = I.Slider.Bookmap.appendChild(sML.create('div', { id: 'bibi-slider-thumb', Labels: { default: { default: `Slider Thumb`, ja: `スライダー上の好きな位置からドラッグを始められます` } } }));
    I.setFeedback(I.Slider.Thumb);
    I.setToggleAction(I.Slider, {
        onopened: () => {
            I.Slider.zoomOutBook();
            I.Slider.progress();
            O.HTML.classList.add('slider-opened');
            E.dispatch('bibi:opened-slider');
        },
        onclosed: () => {
            I.Slider.resetZoomingOutOfBook();
            I.Slider.progress();
            O.HTML.classList.remove('slider-opened');
            E.dispatch('bibi:closed-slider');
            setTimeout(I.Slider.resetBookmap, 456);
        }
    });
    E.add('bibi:commands:open-slider',   I.Slider.open);
    E.add('bibi:commands:close-slider',  I.Slider.close);
    E.add('bibi:commands:toggle-slider', I.Slider.toggle);

    E.add('bibi:opens-utilities',   Opt => E.dispatch('bibi:commands:open-slider',   Opt));
    E.add('bibi:closes-utilities',  Opt => E.dispatch('bibi:commands:close-slider',  Opt));
    E.add('bibi:toggles-utilities', Opt => E.dispatch('bibi:commands:toggle-slider', Opt));

    E.add('bibi:opened', I.Slider.activate); E.add('bibi:loaded-item', I.Slider.activateItem);
    E.add(['bibi:opened', 'bibi:changed-view'], () => setTimeout(I.Slider.resetBookmap, 456));
    E.add('bibi:laid-out', () => {
        //I.Slider.BookStretchingEach = 0;
        I.Slider.resetZoomingOutOfBook();
        I.Slider.resetThumbAndRail();
        I.Slider.progress();
    });

    I.Slider.addEventListener('wheel', R.Main.listenWheel, { capture: true, passive: false });

    // Optimize to Scrollbar Size
    sML.appendCSSRule([
        'html.view-paged div#bibi-slider',
        'html.view-horizontal div#bibi-slider'
    ].join(', '), 'height: ' + (O.Scrollbars.Height) + 'px;');
    sML.appendCSSRule([
        'html.view-vertical div#bibi-slider'
    ].join(', '), 'width: ' + (O.Scrollbars.Width) + 'px;');

    I.Slider.initializeBookmap();
    E.dispatch('bibi:created-slider');

};


I.createTurner = () => {
    I.Turner = {
        Back: { Distance: -1 }, Forward: { Distance: 1 }, 'top': undefined, 'right': undefined, 'bottom': undefined, 'left': undefined,
        update: () => {
            if(S.RVM == 'vertical') {
                I.Turner['left'] = I.Turner['right'] = undefined;
                I.Turner['top'] = I.Turner.Back, I.Turner['bottom'] = I.Turner.Forward;
            } else {
                I.Turner['top'] = I.Turner['bottom'] = undefined;
                if(S.PPD == 'ltr') I.Turner['left']  = I.Turner.Back, I.Turner['right'] = I.Turner.Forward;
                else               I.Turner['right'] = I.Turner.Back, I.Turner['left']  = I.Turner.Forward;
            }
        },
        isAbleToTurn: (Par) => {
            if(typeof Par.Distance != 'number' && typeof Par.Direction == 'string') {
                if(I.Turner[Par.Direction]) Par.Distance = I.Turner[Par.Direction].Distance;
            }
            if(typeof Par.Distance == 'number') {
                switch(Par.Distance) {
                    case -1: return (L.Opened && (R.Current.Pages.StartPage != R.Pages[0]                  || R.Current.Pages.StartPageRatio != 100));
                    case  1: return (L.Opened && (R.Current.Pages.EndPage   != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio   != 100));
                }
            }
            return false;
        }
    };
    E.add('bibi:opened',           () => I.Turner.update());
    E.add('bibi:updated-settings', () => I.Turner.update());
};


I.createArrows = () => {

    if(!S['use-arrows']) return;

    I.Arrows = {
        navigate: () => {
            setTimeout(() => {
                R.getCurrent();
                [I.Arrows.Back, I.Arrows.Forward].forEach(Arrow => { if(I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance })) Arrow.classList.add('glowing'); });
                setTimeout(() => {
                    [I.Arrows.Back, I.Arrows.Forward].forEach(Arrow => Arrow.classList.remove('glowing'));
                }, 1234);
            }, 400);
        },
        check: () => {
            [I.Arrows.Back, I.Arrows.Forward].forEach(Arrow =>
                I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance }) ?
                    sML.replaceClass(Arrow, 'unavailable', 'available') :
                    sML.replaceClass(Arrow, 'available', 'unavailable')
            );
        },
        areAvailable: (BibiEvent) => {
            if(!L.Opened) return false;
            if(I.Panel && I.Panel.UIState == 'active') return false;
            if(BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) return false;
            if(S.RVM == 'paged') {
                if(I.Slider && BibiEvent.Coord.Y > window.innerHeight - I.Slider.offsetHeight) return false;
            } else {
                if(S['full-breadth-layout-in-scroll']) return false;
                if(S.RVM == 'horizontal') {
                    if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
                } else if(S.RVM == 'vertical') {
                    if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false;
                }
            }
            if(BibiEvent.Target.ownerDocument.documentElement == O.HTML) {
                if(BibiEvent.Target == O.HTML || BibiEvent.Target == O.Body) return true;
                if(/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(BibiEvent.Target.id)) return true;
                if(/^(spread|item|page)( |-|$)/.test(BibiEvent.Target.className)) return true;
            } else {
                return O.isAnchorContent(BibiEvent.Target) ? false : true;
            }
            return false;
        }
    };

    O.HTML.classList.add('arrows-active');

    I.Arrows.Back    = I.Turner.Back.Arrow    = O.Body.appendChild(sML.create('div', { id: 'bibi-arrow-back',    Labels: { default: { default: `Back`,    ja: `戻る` } }, Turner: I.Turner.Back    }));
    I.Arrows.Forward = I.Turner.Forward.Arrow = O.Body.appendChild(sML.create('div', { id: 'bibi-arrow-forward', Labels: { default: { default: `Forward`, ja: `進む` } }, Turner: I.Turner.Forward }));
    I.Arrows.Back.Pair = I.Arrows.Forward, I.Arrows.Forward.Pair = I.Arrows.Back;
    [I.Arrows.Back, I.Arrows.Forward].forEach(Arrow => {
        //Arrow.isAvailable = () => I.Turner.isAbleToTurn(Arrow);
        I.setFeedback(Arrow);
        const FunctionsToBeCanceled = [Arrow.showHelp, Arrow.hideHelp, Arrow.onBibiTap]; if(!O.Touch) FunctionsToBeCanceled.push(Arrow.onBibiHover);
        FunctionsToBeCanceled.forEach(FunctionToBeCanceled => FunctionToBeCanceled = undefined);
    });

    if(!O.Touch) {
        E.add('bibi:moved-pointer', Eve => { // try hovering
            if(!L.Opened) return false;
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(I.Arrows.areAvailable(BibiEvent)) {
                const Dir = (S.RVM == 'vertical') ? BibiEvent.Division.Y : BibiEvent.Division.X;
                if(I.Turner.isAbleToTurn({ Direction: Dir })) {
                    const Arrow = I.Turner[Dir].Arrow;
                    E.dispatch(Arrow,      'bibi:hovers',   Eve);
                    E.dispatch(Arrow.Pair, 'bibi:unhovers', Eve);
                    BibiEvent.Target.ownerDocument.documentElement.setAttribute('data-bibi-cursor', Dir);
                    return;
                }
            }
            E.dispatch(I.Arrows.Back,    'bibi:unhovers', Eve);
            E.dispatch(I.Arrows.Forward, 'bibi:unhovers', Eve);
            R.Items.concat(O).forEach(Item => Item.HTML.removeAttribute('data-bibi-cursor'));
        });
        E.add('bibi:opened', () => R.Items.concat(O).forEach(Item => sML.forEach(Item.Body.querySelectorAll('img'))(Img => Img.addEventListener(O['pointerdown'], O.preventDefault))));
    }

    E.add('bibi:tapped', Eve => { // try moving
        if(!L.Opened) return false;
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(/^bibi-arrow-/.test(BibiEvent.Target.id)) return false;
        if(!I.Arrows.areAvailable(BibiEvent)) return false;
        const Dir = (S.RVM == 'vertical') ? BibiEvent.Division.Y : BibiEvent.Division.X;
        if(I.Turner.isAbleToTurn({ Direction: Dir })) {
            const Arrow = I.Turner[Dir].Arrow;
            E.dispatch(Arrow, 'bibi:taps',   Eve);
            E.dispatch(Arrow, 'bibi:tapped', Eve);
            R.moveBy({ Distance: I.Turner[Dir].Distance });
        }
    });

    E.add('bibi:commands:move-by', Par => { // indicate direction
        if(!L.Opened || !Par || typeof Par.Distance != 'number') return false;
        switch(Par.Distance) {
            case -1: return E.dispatch(I.Arrows.Back,    'bibi:tapped', null);
            case  1: return E.dispatch(I.Arrows.Forward, 'bibi:tapped', null);
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

    E.add('bibi:opened',       () => { I.Arrows.check(); I.Arrows.navigate(); });
    E.add('bibi:changed-view', () => { I.Arrows.navigate(); });
    E.add('bibi:scrolled',     () => { I.Arrows.check(); });

    E.dispatch('bibi:created-arrows');

};


I.createSwipeListener = () => {

    I.SwipeListener = {
        update: () => {
            S.RVM == 'paged' ? I.SwipeListener.open() : I.SwipeListener.close();
            return I.SwipeListener.State;
        },
        activateElement: (Ele) => {
            Ele.addEventListener('touchstart', I.SwipeListener.onTouchStart);
            Ele.addEventListener('touchmove',  I.SwipeListener.onTouchMove);
            Ele.addEventListener('touchend',   I.SwipeListener.onTouchEnd);
            if(!O.Touch) {
                Ele.addEventListener('wheel', I.SwipeListener.onWheel, { capture: true, passive: false });
                sML.forEach(Ele.querySelectorAll('img'))(Img => Img.addEventListener(O['pointerdown'], O.preventDefault));
            }
        },
        deactivateElement: (Ele) => {
            Ele.removeEventListener('touchstart', I.SwipeListener.onTouchStart);
            Ele.removeEventListener('touchmove',  I.SwipeListener.onTouchMove);
            Ele.removeEventListener('touchend',   I.SwipeListener.onTouchEnd);
            if(!O.Touch) {
                Ele.removeEventListener('wheel', I.SwipeListener.onWheel, { capture: true, passive: false });
                sML.forEach(Ele.querySelectorAll('img'))(Img => Img.removeEventListener(O['pointerdown'], O.preventDefault));
            }
        },
        PreviousWheels: [],
        onWheel: (Eve) => {
            Eve.preventDefault();
            const WA /* WheelAxis */ = Math.abs(Eve.deltaX) > Math.abs(Eve.deltaY) ? 'X' : 'Y';
            if(I.SwipeListener.PreviousWheels.length && I.SwipeListener.PreviousWheels[I.SwipeListener.PreviousWheels.length - 1].Axis != WA) I.SwipeListener.PreviousWheels = [];
            const CW = {}, PWs = I.SwipeListener.PreviousWheels, PWl = PWs.length;
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
                if(!I.SwipeListener.Hot) {
                    clearTimeout(I.SwipeListener.Timer_coolDown);
                    I.SwipeListener.Hot = true;
                    I.SwipeListener.Timer_coolDown = setTimeout(() => I.SwipeListener.Hot = false, 192);
                    R.moveBy({ Distance: CW.Distance });
                }
            }
            if(PWl >= 3) PWs.shift();
            PWs.push(CW);
            clearTimeout(I.SwipeListener.Timer_resetWheeling);
            I.SwipeListener.Timer_resetWheeling = setTimeout(() => I.SwipeListener.PreviousWheels = [], 192);
        },
        onTouchStart: (Eve) => {
            const EventCoord = O.getBibiEventCoord(Eve);
            I.SwipeListener.TouchStartedOn = { X: EventCoord.X, Y: EventCoord.Y, T: Eve.timeStamp, SL: R.Main.scrollLeft, ST: R.Main.scrollTop };
        },
        onTouchMove: (Eve) => {
            if(Eve.touches.length == 1 && document.body.clientWidth / window.innerWidth <= 1) Eve.preventDefault();
        },
        onTouchEnd: (Eve) => {
            if(!I.SwipeListener.TouchStartedOn) return;
            if(I.SwipeListener.TouchStartedOn.SL != R.Main.scrollLeft || I.SwipeListener.TouchStartedOn.ST != R.Main.scrollTop) return;
            if(document.body.clientWidth / window.innerWidth <= 1 && Eve.timeStamp - I.SwipeListener.TouchStartedOn.T <= 300) {
                const EventCoord = O.getBibiEventCoord(Eve);
                const VarX = EventCoord.X - I.SwipeListener.TouchStartedOn.X;
                const VarY = EventCoord.Y - I.SwipeListener.TouchStartedOn.Y;
                if(Math.sqrt(Math.pow(VarX, 2) + Math.pow(VarY, 2)) >= 10) {
                    const Deg = Math.atan2((VarY ? VarY * -1 : 0), VarX) * 180 / Math.PI;
                    let From = '', To = '';
                         if( 120 >= Deg && Deg >=   60) From = 'bottom', To = 'top';
                    else if(  30 >= Deg && Deg >=  -30) From = 'left',   To = 'right';
                    else if( -60 >= Deg && Deg >= -120) From = 'top',    To = 'bottom';
                    else if(-150 >= Deg || Deg >=  150) From = 'right',  To = 'left';
                    if(I.Turner.isAbleToTurn({ Direction: From })) {
                        R.moveBy({ Distance: I.Turner[From].Distance });
                    }
                }
            }
            delete I.SwipeListener.TouchStartedOn;
        }
    };

    I.setToggleAction(I.SwipeListener, {
        onopened: () => {
            O.HTML.classList.add('swipe-active');
            I.SwipeListener.activateElement(R.Main);
            R.Items.forEach(Item => I.SwipeListener.activateElement(Item.HTML));
        },
        onclosed: () => {
            O.HTML.classList.remove('swipe-active');
            I.SwipeListener.deactivateElement(R.Main);
            R.Items.forEach(Item => I.SwipeListener.deactivateElement(Item.HTML));
        }
    });

    E.add('bibi:opened', () => {
        I.SwipeListener.update();
        E.add('bibi:updated-settings', (  ) => I.SwipeListener.update());
        E.add('bibi:loaded-item',      Item => { if(S.RVM == 'paged') I.SwipeListener.activateElement(Item.HTML); });
        //I.SwipeListener.addButton();
    });
    E.add('bibi:commands:activate-swipe',   () => I.SwipeListener.open());
    E.add('bibi:commands:deactivate-swipe', () => I.SwipeListener.close());
    E.add('bibi:commands:toggle-swipe',     () => I.SwipeListener.toggle());

    E.dispatch('bibi:created-swipelistener');

};


I.createKeyListener = () => {

    if(!S['use-keys']) return;

    // Keys
    I.KeyListener = {
        ActiveKeys: {},
        KeyCodes: { 'keydown': {}, 'keyup': {}, 'keypress': {} },
        updateKeyCodes: (EventTypes, KeyCodesToUpdate) => {
            if(typeof EventTypes.join != 'function')  EventTypes = [EventTypes];
            if(typeof KeyCodesToUpdate == 'function') KeyCodesToUpdate = KeyCodesToUpdate();
            EventTypes.forEach(EventType => I.KeyListener.KeyCodes[EventType] = sML.edit(I.KeyListener.KeyCodes[EventType], KeyCodesToUpdate));
        },
        MovingParameters: {
            'Space':  1,  'Page Up':     -1,  'Page Down':      1,  'End': 'foot',  'Home': 'head',
            'SPACE': -1,  'PAGE UP': 'head',  'PAGE DOWN': 'foot',  'END': 'foot',  'HOME': 'head'
        },
        updateMovingParameters: () => {
            switch(S.ARD) {
                case 'ttb': return sML.edit(I.KeyListener.MovingParameters, {
                    'Up Arrow':     -1,  'Right Arrow':      0,  'Down Arrow':      1,  'Left Arrow':      0,
                    'UP ARROW': 'head',  'RIGHT ARROW':     '',  'DOWN ARROW': 'foot',  'LEFT ARROW':     ''
                });
                case 'ltr': return sML.edit(I.KeyListener.MovingParameters, {
                    'Up Arrow':      0,  'Right Arrow':      1,  'Down Arrow':      0,  'Left Arrow':     -1,
                    'UP ARROW':     '',  'RIGHT ARROW': 'foot',  'DOWN ARROW':     '',  'LEFT ARROW': 'head'
                });
                case 'rtl': return sML.edit(I.KeyListener.MovingParameters, {
                    'Up Arrow':      0,  'Right Arrow':     -1,  'Down Arrow':      0,  'Left Arrow':      1,
                    'UP ARROW':     '',  'RIGHT ARROW': 'head',  'DOWN ARROW':     '',  'LEFT ARROW': 'foot'
                });
                default: return sML.edit(I.KeyListener.MovingParameters, {
                    'Up Arrow':      0,  'Right Arrow':      0,  'Down Arrow':      0,  'Left Arrow':      0,
                    'UP ARROW':     '',  'RIGHT ARROW':     '',  'DOWN ARROW':     '',  'LEFT ARROW':     ''
                });
            }
        },
        getBibiKeyName: (Eve) => {
            const KeyName = I.KeyListener.KeyCodes[Eve.type][Eve.keyCode];
            return KeyName ? KeyName : '';
        },
        onEvent: (Eve) => {
            if(!L.Opened) return false;
            Eve.BibiKeyName = I.KeyListener.getBibiKeyName(Eve);
            Eve.BibiModifierKeys = [];
            if(Eve.shiftKey) Eve.BibiModifierKeys.push('Shift');
            if(Eve.ctrlKey)  Eve.BibiModifierKeys.push('Control');
            if(Eve.altKey)   Eve.BibiModifierKeys.push('Alt');
            if(Eve.metaKey)  Eve.BibiModifierKeys.push('Meta');
            //if(!Eve.BibiKeyName) return false;
            if(Eve.BibiKeyName) Eve.preventDefault();
            return true;
        },
        onkeydown: (Eve) => {
            if(!I.KeyListener.onEvent(Eve)) return false;
            if(Eve.BibiKeyName) {
                if(!I.KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    I.KeyListener.ActiveKeys[Eve.BibiKeyName] = Date.now();
                } else {
                    E.dispatch('bibi:is-holding-key', Eve);
                }
            }
            E.dispatch('bibi:downs-key', Eve);
        },
        onkeyup: (Eve) => {
            if(!I.KeyListener.onEvent(Eve)) return false;
            if(I.KeyListener.ActiveKeys[Eve.BibiKeyName] && Date.now() - I.KeyListener.ActiveKeys[Eve.BibiKeyName] < 300) {
                E.dispatch('bibi:touches-key', Eve);
                E.dispatch('bibi:touched-key', Eve);
            }
            if(Eve.BibiKeyName) {
                if(I.KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    delete I.KeyListener.ActiveKeys[Eve.BibiKeyName];
                }
            }
            E.dispatch('bibi:ups-key', Eve);
        },
        onkeypress: (Eve) => {
            if(!I.KeyListener.onEvent(Eve)) return false;
            E.dispatch('bibi:presses-key', Eve);
        },
        observe: (Doc) => {
            ['keydown', 'keyup', 'keypress'].forEach(EventName => Doc.addEventListener(EventName, I.KeyListener['on' + EventName], false));
        },
        tryMoving: (Eve) => {
            if(!Eve.BibiKeyName) return false;
            const MovingParameter = I.KeyListener.MovingParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!MovingParameter) return false;
            Eve.preventDefault();
                 if(typeof MovingParameter == 'number') R.moveBy( { Distance:    MovingParameter });
            else if(typeof MovingParameter == 'string') R.focusOn({ Destination: MovingParameter });
        }
    };

    I.KeyListener.updateKeyCodes(['keydown', 'keyup', 'keypress'], {
        32: 'Space'
    });
    I.KeyListener.updateKeyCodes(['keydown', 'keyup'], {
        33: 'Page Up',     34: 'Page Down',
        35: 'End',         36: 'Home',
        37: 'Left Arrow',  38: 'Up Arrow',  39: 'Right Arrow',  40: 'Down Arrow'
    });

    E.add('bibi:updated-settings',   (  ) => { I.KeyListener.updateMovingParameters(); });
    E.add('bibi:opened',             (  ) => { I.KeyListener.updateMovingParameters(); I.KeyListener.observe(document); });
    E.add('bibi:postprocessed-item', Item => { if(!Item.IsPlaceholder) I.KeyListener.observe(Item.contentDocument); });
    E.add('bibi:touched-key',        Eve  => { I.KeyListener.tryMoving(Eve); });

    E.dispatch('bibi:created-keylistener');

};


I.createSpinner = () => {
    I.Spinner = O.Body.appendChild(sML.create('div', { id: 'bibi-spinner' }));
    for(let i = 1; i <= 12; i++) I.Spinner.appendChild(document.createElement('span'));
    E.dispatch('bibi:created-spinner');
};


I.setToggleAction = (Obj, Par) => {
    if(!Par) Par = {/*
         onopened: Function,
         onclosed: Function
    */};
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


I.observeHover = (Ele) => {
    Ele.onBibiHover = (On, Eve) => E.dispatch(Ele, On ? 'bibi:hovers' : 'bibi:unhovers', Eve);
    Ele.addEventListener(O['pointerover'], Eve => Ele.onBibiHover(true,  Eve));
    Ele.addEventListener(O['pointerout'],  Eve => Ele.onBibiHover(false, Eve));
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
        Ele.onBibiTap = (On, Eve) => {
            if(On) {
                clearTimeout(Ele.Timer_tap);
                Ele.TouchStart = { Time: Date.now(), Event: Eve, Coord: O.getBibiEventCoord(Eve) };
                Ele.Timer_tap = setTimeout(() => delete Ele.TouchStart, 333);
                if(Opt.PreventDefault)  Eve.preventDefault();
                if(Opt.StopPropagation) Eve.stopPropagation();
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
                if(Opt.PreventDefault)  Eve.preventDefault();
                if(Opt.StopPropagation) Eve.stopPropagation();
            }
        };
        Ele.addEventListener(O['pointerdown'], Eve => Ele.onBibiTap(true,  Eve));
        Ele.addEventListener(O['pointerup'],   Eve => Ele.onBibiTap(false, Eve));
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
                Ele.Timer_deactivate = setTimeout(() => I.setUIState(Ele, ''), 200);
            };
        }
    })();
    Ele.addTapEventListener('tapped', Eve => {
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        if(Ele.Type == 'radio' && Ele.UIState == 'active') return Ele;
        if(Ele.UIState == 'disabled') return Ele;
        onTapped(Eve);
        if(Ele.hideHelp) Ele.hideHelp();
        if(Ele.note) setTimeout(Ele.note, 0);
        return Ele;
    });
    return Ele;
};


I.setFeedback = (Ele, Opt) => {
    if(!Opt) Opt = {};
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
    if(!O.Touch) I.observeHover(Ele);
    I.setHoverActions(Ele);
    I.observeTap(Ele, Opt);
    I.setTapAction(Ele);
    Ele.addTapEventListener('tap',    Eve => Ele.isAvailable && !Ele.isAvailable() ? false : E.dispatch('bibi:is-going-to:tap:ui', Ele));
    Ele.addTapEventListener('tapped', Eve =>                                                 E.dispatch('bibi:tapped:ui',          Ele));
    I.setUIState(Ele, 'default');
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

I.getBookIcon = () => sML.create('div', { className: 'book-icon', innerHTML: `<span></span>` });




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


export const P = {}; // Bibi.Preset


P.initialize = (Preset) => {
    sML.applyRtL(P, Preset, 'ExceptFunctions');
    O.SettingTypes.Boolean.concat(O.SettingTypes_PresetOnly.Boolean).forEach(PropertyName => {
        if(P[PropertyName] !== true) P[PropertyName] = false;
    });
    O.SettingTypes.YesNo.concat(O.SettingTypes_PresetOnly.YesNo).forEach(PropertyName => {
        if(typeof P[PropertyName] == 'string') P[PropertyName] = /^(yes|no|mobile|desktop)$/.test(P[PropertyName]) ? P[PropertyName] : 'no';
        else                                   P[PropertyName] = P[PropertyName] ? 'yes' : 'no';
    });
    O.SettingTypes.String.concat(O.SettingTypes_PresetOnly.String).forEach(PropertyName => {
        if(typeof P[PropertyName] != 'string') P[PropertyName] = '';
    });
    O.SettingTypes.Integer.concat(O.SettingTypes_PresetOnly.Integer).forEach(PropertyName => {
        P[PropertyName] = (typeof P[PropertyName] != 'number' || P[PropertyName] < 0) ? 0 : Math.round(P[PropertyName]);
    });
    O.SettingTypes.Number.concat(O.SettingTypes_PresetOnly.Number).forEach(PropertyName => {
        if(typeof P[PropertyName] != 'number') P[PropertyName] = 0;
    });
    O.SettingTypes.Array.concat(O.SettingTypes_PresetOnly.Array).forEach(PropertyName => {
        if(!(P[PropertyName] instanceof Array)) P[PropertyName] = [];
    });
    if(!/^(horizontal|vertical|paged)$/.test(P['reader-view-mode'])) P['reader-view-mode'] = 'paged';
    P['extensions'] = !(P['extensions'] instanceof Array) ? [] : P['extensions'].filter(Xtn => {
        if(!Xtn) return false;
        if(Xtn['-spell-of-activation-']) return U.hasOwnProperty(Xtn['-spell-of-activation-']);
        return true;
    });
};

Bibi.preset = P.initialize;



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
        if(/^[a-z]+$/.test(PnV[0])) Qs[PnV[0]] = PnV[1];
    });
    return Qs;
})(location.search);


U.initialize = () => { // formerly O.readExtras

    const H = U.parseHash(location.hash);

    U['book'] = decodeURIComponent(U['book'] || O.Body.getAttribute('data-bibi-book') || '') || '';
    B.Type = U['book'] ? (U.hasOwnProperty('zine') ? 'Zine' : 'EPUB') : '';

    const BookDataElement = document.getElementById('bibi-book-data');
    if(BookDataElement) {
        if(!U['book'] && BookDataElement.innerText.trim()) {
            const BookDataMIMEType = BookDataElement.getAttribute('data-bibi-book-mimetype');
            if(typeof BookDataMIMEType == 'string' && /^application\/(epub\+zip|zip|x-zip(-compressed)?)$/i.test(BookDataMIMEType)) {
                U.BookDataElement = BookDataElement;
            }
        }
        if(!U.BookDataElement) {
            BookDataElement.innerHTML = '';
            BookDataElement.parentNode.removeChild(BookDataElement);
        }
    }

    if(H['bibi']) {
        U.importFromDataString(H['bibi']);
    }

    if(H['pipi']) {
        U.importFromDataString(H['pipi']);
        if(U['parent-origin'] && U['parent-origin'] != O.Origin) P['trustworthy-origins'].push(U['parent-origin']);
        if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]pipi\([^\)]*\)$/g, ''));
    }

    if(H['epubcfi']) {
        U['epubcfi'] = H['epubcfi'];
        E.add('bibi:readied', () => { if(X['EPUBCFI']) S['to'] = U['to'] = X['EPUBCFI'].getDestination(H['epubcfi']); });
    }

};


U.parseHash = (H) => {
    if(typeof H != 'string') return {};
    H = H.replace(/^#/, '');
    const Params = {};
    let CurrentPosition = 0;
    const parseFragment = () => {
        const Foothold = CurrentPosition;
        let Label = '';
        while(/[a-z_]/.test(H.charAt(CurrentPosition))) CurrentPosition++;
        if(H.charAt(CurrentPosition) == '(') Label = H.substr(Foothold, CurrentPosition - 1 - Foothold + 1), CurrentPosition++; else return {};
        while(H.charAt(CurrentPosition) != ')') CurrentPosition++;
        if(Label) Params[Label] = H.substr(Foothold, CurrentPosition - Foothold + 1).replace(/^[a-z_]+\(/, '').replace(/\)$/, '');
        CurrentPosition++;
    };
    parseFragment();
    while(H.charAt(CurrentPosition) == ',') {
        CurrentPosition++;
        parseFragment();
    }
    return Params;
};


U.importFromDataString = (DataString) => {
    if(typeof DataString != 'string') return false;
    DataString.replace(' ', '').split(',').forEach(PnV => {
        PnV = PnV.split(':'); if(!PnV[0]) return;
        switch(PnV[0]) {
            case 'parent-title':
            case 'parent-uri':
            case 'parent-origin':
            case 'parent-pipi-path':
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
            case 'horizontal':
            case 'vertical':
            case 'paged':
                PnV = ['reader-view-mode', PnV[0]];
                break;
            case 'reader-view-mode':
                if(!/^(horizontal|vertical|paged)$/.test(PnV[1])) return;
                break;
            default:
                if(O.SettingTypes.Boolean.concat(O.SettingTypes_UserOnly.Boolean).includes(PnV[0])) {
                         if(PnV[1] == 'true' ) PnV[1] = true;
                    else if(PnV[1] == 'false') PnV[1] = false;
                    else return;
                } else if(O.SettingTypes.YesNo.concat(O.SettingTypes_UserOnly.YesNo).includes(PnV[0])) {
                    if(!/^(yes|no|mobile|desktop)$/.test(PnV[1])) return;
                } else if(O.SettingTypes.Integer.concat(O.SettingTypes_UserOnly.Integer).includes(PnV[0])) {
                    if(/^(0|[1-9][0-9]*)$/.test(PnV[1])) PnV[1] *= 1; else return;
                } else if(O.SettingTypes.Number.concat(O.SettingTypes_UserOnly.Number).includes(PnV[0])) {
                    if(/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(PnV[1])) PnV[1] *= 1; else return;
                } else {
                    return;
                }
        }
        if(!PnV[0] || typeof PnV[1] == 'undefined') return;
        U[PnV[0]] = PnV[1];
    });
    return U;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


export const S = {}; // Bibi.Settings


S.initialize = () => {
    for(const Property in S) if(typeof S[Property] != 'function') delete S[Property];
    sML.applyRtL(S, P, 'ExceptFunctions');
    sML.applyRtL(S, U, 'ExceptFunctions');
    O.SettingTypes.YesNo.concat(O.SettingTypes_PresetOnly.YesNo).concat(O.SettingTypes_UserOnly.YesNo).forEach(Property => {
        S[Property] = (typeof S[Property] == 'string') ? (S[Property] == 'yes' || (S[Property] == 'mobile' && O.Touch) || (S[Property] == 'desktop' && !O.Touch)) : false;
    });
    S['bookshelf'] = (() => {
        if(!S['bookshelf']) return '';
        if(/^https?:\/\//.test(S['bookshelf'])) return S['bookshelf'];
        if(/^\/\//.test(S['bookshelf'])) return location.protocol + S['bookshelf'];
        if(/^\//.test(S['bookshelf'])) return O.Origin + S['bookshelf'];
        return O.getPath(location.href.split('?')[0].replace(/[^\/]*$/, ''), S['bookshelf']);
    })().replace(/\/$/, '');
    if(!/^https?:\/\/[^\/]+.*$/.test(S['bookshelf'])) S['bookshelf'] = '';
    S['book'] = (() => {
        if(!S['book'] || !B.Type) return '';
        if(/^https?:\/\//.test(S['book'])) return S['book'];
        if(/^\/\//.test(S['book'])) return location.protocol + S['book'];
        if(/^\//.test(S['book'])) return O.Origin + S['book'];
        return O.getPath(S['bookshelf'], S['book']);
    })().replace(/^(https?:\/\/[^\/]+.*)?.*$/, '$1');
    if(!S['book']) B.Type = '';
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
    S['accept-local-file'] = (() => {
        if(S['book'] || !window.File || !S['accept-local-file']) return false;
        return (S['extract-if-necessary'].includes('*') || S['extract-if-necessary'].includes('.epub') || S['extract-if-necessary'].includes('.zip'));
    })();
    S['accept-blob-converted-data'] = (() => {
        if(S['book'] || !window.File || !S['accept-blob-converted-data']) return false;
        return true;
    })();
    S['accept-base64-encoded-data'] = (() => {
        if(S['book'] || !window.File || !S['accept-base64-encoded-data']) return false;
        return true;
    })();
    S['autostart'] = (() => {
        if(S['wait']) return !S['wait'];
        if(!S['book']) return true;
        return O.WindowEmbedded ? S['autostart-embedded'] : S['autostart'];
    })();
    S['start-in-new-window'] = (() => {
        if(S['autostart']) return false;
        return O.WindowEmbedded ? S['start-embedded-in-new-window'] : false;
    })();
    if(!S['trustworthy-origins'].includes(O.Origin)) S['trustworthy-origins'].unshift(O.Origin);
    E.dispatch('bibi:initialized-settings');
};


S.update = (Settings) => {

    const PrevBRL = S.BRL, PrevRVM = S.RVM, PrevPPD = S.PPD, PrevSLA = S.SLA, PrevSLD = S.SLD, PrevARD = S.ARD, PrevARA = S.ARA;

    if(typeof Settings == 'object') for(const Property in Settings) if(typeof S[Property] != 'function') S[Property] = Settings[Property];

    S.BRL = S['book-rendition-layout'] = B.Package.Metadata['rendition:layout'];
    S.BWM = S['book-writing-mode'] = B.WritingMode;

    S['allow-placeholders'] = (S['allow-placeholders'] && B.AllowPlaceholderItems);

    // Font Family
    if(S.FontFamilyStyleIndex) sML.deleteCSSRule(S.FontFamilyStyleIndex);
    if(S['ui-font-family']) S.FontFamilyStyleIndex = sML.appendCSSRule('html', 'font-family: ' + S['ui-font-family'] + ' !important;');

    // Layout Settings
    S.RVM = S['reader-view-mode'];
    if(S.BRL == 'reflowable') switch(S.BWM) {
        case 'tb-rl': S.PPD = S['page-progression-direction'] = 'rtl', S.SLA = S['spread-layout-axis'] = (S.RVM == 'paged') ? 'vertical'   : S.RVM; break;
        case 'tb-lr': S.PPD = S['page-progression-direction'] = 'ltr', S.SLA = S['spread-layout-axis'] = (S.RVM == 'paged') ? 'vertical'   : S.RVM; break;
        case 'rl-tb': S.PPD = S['page-progression-direction'] = 'rtl', S.SLA = S['spread-layout-axis'] = (S.RVM == 'paged') ? 'horizontal' : S.RVM; break;
        default     : S.PPD = S['page-progression-direction'] = 'ltr', S.SLA = S['spread-layout-axis'] = (S.RVM == 'paged') ? 'horizontal' : S.RVM; break;
    }   else          S.PPD = S['page-progression-direction'] = B.PPD, S.SLA = S['spread-layout-axis'] = (S.RVM == 'paged') ? 'horizontal' : S.RVM;
    S.SLD = S['spread-layout-direction']    = (S.SLA == 'vertical') ? 'ttb'        : S.PPD;
    S.ARD = S['apparent-reading-direction'] = (S.RVM == 'vertical') ? 'ttb'        : S.PPD;
    S.ARA = S['apparent-reading-axis']      = (S.RVM == 'paged'   ) ? 'horizontal' : S.RVM;

    // Dictionary
    S.CC = {
        L: S.getCC(S.SLA), // for "L"ayout-Direction
        A: S.getCC(S.ARA)  // for "A"pparent-Direction
    };             

    // Root Class
    if(PrevBRL != S.BRL) sML.replaceClass(O.HTML, 'book-'       + PrevBRL, 'book-'       + S.BRL);
    if(PrevRVM != S.RVM) sML.replaceClass(O.HTML, 'view-'       + PrevRVM, 'view-'       + S.RVM);
    if(PrevPPD != S.PPD) sML.replaceClass(O.HTML, 'page-'       + PrevPPD, 'page-'       + S.PPD);
    if(PrevSLA != S.SLA) sML.replaceClass(O.HTML, 'spread-'     + PrevSLA, 'spread-'     + S.SLA);
    if(PrevSLD != S.SLD) sML.replaceClass(O.HTML, 'spread-'     + PrevSLD, 'spread-'     + S.SLD);
    if(PrevARD != S.ARD) sML.replaceClass(O.HTML, 'appearance-' + PrevARD, 'appearance-' + S.ARD);
    if(PrevARA != S.ARA) sML.replaceClass(O.HTML, 'appearance-' + PrevARA, 'appearance-' + S.ARA);

    E.dispatch('bibi:updated-settings', S);

};


S.getCC = (AXIS) => { // getCoordinateCondition
    const CC = { BASE: {/*BeforeAfterStartEnd*/}, SIZE: {}, OOLT: {}, AXIS: {} };
    const LR_RL = ['left', 'right']; if(S.PPD != 'ltr') LR_RL.reverse();
    if(AXIS == 'horizontal') {
        S.getCC.applyRtL(CC.BASE, { b: LR_RL[0], a: LR_RL[1], s: 'top',     e: 'bottom'  });
        S.getCC.applyRtL(CC.SIZE, { b: 'height', l: 'width',  w: 'length',  h: 'breadth' });
        S.getCC.applyRtL(CC.OOLT, { b: 'top',    l: 'left'                               });
        S.getCC.applyRtL(CC.AXIS, { b: 'y',      l: 'x'                                  });
        CC.AXIS.PM = S.PPD == 'ltr' ? 1 : -1;
    } else {
        S.getCC.applyRtL(CC.BASE, { b: 'top',    a: 'bottom', s: LR_RL[0],  e: LR_RL[1]  });
        S.getCC.applyRtL(CC.SIZE, { b: 'width',  l: 'height', w: 'breadth', h: 'length'  });
        S.getCC.applyRtL(CC.OOLT, { b: 'left',   l: 'top'                                });
        S.getCC.applyRtL(CC.AXIS, { b: 'x',      l: 'y'                                  });
        CC.AXIS.PM = 1;
    }
    return CC;
};

S.getCC.applyRtL = (Left, Right) => {
    for(const Property in Right) Left[                   Property ] =                    Right[Property] ,
                                 Left[S.getCC.capitalize(Property)] = S.getCC.capitalize(Right[Property]);
};

S.getCC.capitalize = (Str) => Str.charAt(0).toUpperCase() + Str.slice(1);




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


export const O = {}; // Bibi.Operator


O.initialize = () => {
    O.IsDev = U.hasOwnProperty('dev');
    O.log.initialize();
};


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
        (O.log.Depth <= O.log.Limit || Tag == '<b:>' || Tag == '</b>')
    ) {
        const Time = (O.log.Depth <= 1) ? O.stamp(Log) : 0;
        let Ls = [], Ss = [];
        if(Log) switch(Tag) {
            case '<b:>': Ls.unshift(`📕`); Ls.push(`%c`, Log), Ss.push(O.log.BStyle);                 Ls.push(`%c(v${ Bibi['version'] })`),                                                     Ss.push(O.log.NStyle); break;
            case '</b>': Ls.unshift(`📖`); Ls.push(`%c`, Log), Ss.push(O.log.BStyle); if(O.log.Limit) Ls.push(`%c(${ Math.floor(Time / 1000) + '.' + (Time % 1000 + '').padStart(3, 0) }sec)`), Ss.push(O.log.NStyle); break;
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
    if(parent && parent != window) O['log'] = () => true; else {
        O.log.Depth = 1;
        O.log.Limit = !U.hasOwnProperty('log') ? 0 : /^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(U['log']) ? U['log'] : 1;
        O.log.NStyle = 'font: normal normal 10px/1 Menlo, Consolas, monospace;';
        O.log.BStyle = 'font: normal bold   10px/1 Menlo, Consolas, monospace;';
        O.log.distill = (sML.UA.InternetExplorer || (sML.UA.Edge && !sML.UA.Chromium)) ?
            (Logs, Styles) => [Logs.join(' ').replace(/%c/g, '')]               : // Ignore Styles
            (Logs, Styles) => [Logs.join(' ')                   ].concat(Styles);
        O.log.log = (Method, Logs, Styles, Obj) => {
            const Args = O.log.distill(Logs, Styles);
            if(Obj) Args.push(Obj);
            console[Method].apply(console, Args);
        };
    }
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


O.scrollTo = (ScrollTarget, Par) => sML.scrollTo(ScrollTarget, Par);


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

O.file = (Item, Opt = {}) => new Promise((resolve, reject) => {
    Item = O.item(Item);
    if(Opt.URI) {
        if(!B.ExtractionPolicy) Item.URI = O.fullPath(Item.Path), Item.Content = '';
        if(Item.URI) return resolve(Item);
    }
    let _Promise;
    if(Item.Content) {
        if(!Opt.Preprocess || Item.Preprocessed) return resolve(Item);
        _Promise = Promise.resolve(Item);
    } else {
             if(!B.ExtractionPolicy                ) _Promise = O.download(Item);
        else if( B.ExtractionPolicy == 'on-the-fly') _Promise = O.retlieve(Item);
        else return reject(`File Not Included: "${ Item.Path }"`);
    }
    _Promise.then(Item => (Opt.Preprocess && !Item.Preprocessed) ? O.preprocess(Item) : Item).then(() => {
        if(Opt.URI) Item.URI = O.getBlobURL(Item), Item.Content = '';
        resolve(Item);
     }).catch(reject);
});

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
        Item.DataType = IsBin ? 'blob' : 'text';
        resolve(Item);
    }
    XHR.send(null);
});

O.isBin = (Item) => /\.(aac|gif|jpe?g|m4[av]|mp[g34]|ogg|[ot]tf|pdf|png|web[mp]|woff2?)$/i.test(Item.Path);

O.getBlobURL = (Item) => {
    Item = O.item(Item); if(!Item.Content) throw `No Content.`;
    if(Item.URI) return Item.URI;
    return URL.createObjectURL(Item.DataType == 'blob' ? Item.Content: new Blob([Item.Content], { type: Item['media-type'] }));
};

O.getDataURI = (Item) => {
    Item = O.item(Item); if(!Item.Content) throw `No Content.`;
    if(Item.DataType != 'text') throw `Item Content Is Not Text.`;
    if(Item.URI) return Item.URI;
    return 'data:' + Item['media-type'] + ';base64,' + btoa(unescape(encodeURIComponent(Item.Content)));
};

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
    Item = O.item(Item); if(!Item.Content) throw `No Content.`;
    const ResItems = [];
    const Setting = O.getPreprocessSetting(Item.Path); if(!Setting) return Promise.resolve(Item.Content);
    const Promises = [];
    if(Setting.ReplaceRules) Item.Content = Setting.ReplaceRules.reduce((ItemContent, Rule) => ItemContent.replace(Rule[0], Rule[1]), Item.Content);
    if(Setting.ResolveRules) { // RRR
        const FileDir = Item.Path.replace(/\/?[^\/]+$/, '');
        Setting.ResolveRules.Patterns.forEach(Pattern => {
            const ResRE = Setting.ResolveRules.getRE(Pattern.Attribute);
            const Reses = Item.Content.match(ResRE);
            if(!Reses) return;
            const ExtRE = new RegExp('\\.(' + Pattern.Extensions + ')$', 'i');
            Reses.forEach(Res => {
                const ResPathInSource = Res.replace(ResRE, Setting.ResolveRules.PathRef);
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
        });
    }
    return Promise.all(Promises).then(() => {
        Item.Preprocessed = true;
        Item.ResItems = ResItems;
        return Item;
    });
};

O.getPreprocessSetting = (FilePath) => { const PpSs = O.PreprocessSettings;
    for(const Ext in PpSs) if(new RegExp('\\.(' + Ext + ')$', 'i').test(FilePath)) return typeof PpSs[Ext].init == 'function' ? PpSs[Ext].init() : PpSs[Ext];
    return null;
};

O.PreprocessSettings = {
    'css': {
        ReplaceRules: [
            [/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, '']
        ],
        ResolveRules: {
            getRE: () => /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g,
            PathRef: '$1',
            Patterns: [
                { Extensions: 'css', ForceURI: true },
                { Extensions: 'gif|png|jpe?g|svg|ttf|otf|woff' }
            ]
        },
        init: function() { const RRs = this.ReplaceRules;
            RRs.push([/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/gm, 'column-count: auto$3']);
            RRs.push([/(-(epub|webkit)-)?text-underline-position\s*:/gm, 'text-underline-position:']);
            if(sML.UA.Chromium || sML.UA.WebKit) { // Including Edge (Chromium)
                return this;
            }
            RRs.push([/-(epub|webkit)-/gm, '']);
            if(sML.UA.Gecko) {
                RRs.push([/text-combine-horizontal\s*:\s*([^;\}]+)\s*([;\}])/gm, 'text-combine-upright: $1$2']);
                RRs.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-upright: all$1']);
                return this;
            }
            if(sML.UA.Edge) { // (Not Chromium)
                RRs.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, 'text-combine-horizontal: $2; text-combine-upright: $2$3']);
                RRs.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-horizontal: all; text-combine-upright: all$1']);
            }
            if(sML.UA.InternetExplorer) {
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
        ResolveRules: {
            getRE: (Att) => new RegExp('<\\??[a-zA-Z:\\-]+[^>]*? (' + Att + ')\\s*=\\s*["\'](?!(?:https?|data):)(.+?)[\'"]', 'g'),
            PathRef: '$2',
            Patterns: [
                { Attribute: 'href',           Extensions: 'css', ForceURI: true },
                { Attribute: 'src',            Extensions: 'svg', ForceURI: true },
                { Attribute: 'src|xlink:href', Extensions: 'gif|png|jpe?g' }
            ]
        }
    },
    'html?|xht(ml)?|xml': {
        ReplaceRules: [
            [/<!--\s+[.\s\S]*?\s+-->/gm, '']
        ],
        ResolveRules: {
            getRE: (Att) => new RegExp('<\\??[a-zA-Z:\\-]+[^>]*? (' + Att + ')\\s*=\\s*["\'](?!(?:https?|data):)(.+?)[\'"]', 'g'),
            PathRef: '$2',
            Patterns: [
                { Attribute: 'href',           Extensions: 'css', ForceURI: true },
                { Attribute: 'src',            Extensions: 'js|svg', ForceURI: true },//{ Attribute: 'src',        Extensions: 'js|svg|xml|xht(ml?)?|html?', ForceURI: true },
                { Attribute: 'src|xlink:href', Extensions: 'gif|png|jpe?g' }
            ]
        }
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
    try{ if(!StyleSheet.cssRules) return; } catch(Err) { return; }
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

O.getBibiEventCoord = (Eve) => {
    const EventCoord = { X:0, Y:0 };
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
        const RM = R.Main;
        const RMT = RM.Transformation;
        const Item = Eve.target.ownerDocument.documentElement.Item;
        const RMCoord       = O.getElementCoord(RM);
        const ItemCoordInRM = O.getElementCoord(Item, RM);
        if(!Item.Ref['rendition:layout'] == 'pre-paginated' && !Item.Outsourcing) ItemCoordInRM.X += S['item-padding-left'], ItemCoordInRM.Y += S['item-padding-top'];
        EventCoord.X = (RMCoord.X + RM.offsetWidth  / 2 + RMT.Translation.X) + ((((ItemCoordInRM.X - RM.scrollLeft) + (EventCoord.X * Item.Scale)) - (RM.offsetWidth  / 2)) * RMT.Scale);
        EventCoord.Y = (RMCoord.Y + RM.offsetHeight / 2 + RMT.Translation.Y) + ((((ItemCoordInRM.Y - RM.scrollTop ) + (EventCoord.Y * Item.Scale)) - (RM.offsetHeight / 2)) * RMT.Scale);
        //EventCoord = (translated-RM-transform-origin                     ) + ((((Item-coord in RM               ) + (Event-coord in Item      )) - (RM-transform-origin)) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + (((Event-coord in RM                                              ) - (RM-transform-origin)) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + ((Event-coord from RM-transform-origin                                                     ) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + (Event-coord from translated-RM-transform-origin                                                        )
        //EventCoord = Event-coord
        EventCoord.X = Math.floor(EventCoord.X);
        EventCoord.Y = Math.floor(EventCoord.Y);
    }/*
    console.log(
        `[${ Eve.target.ownerDocument.documentElement == O.HTML ? 'PARENT' : 'CHILD' }]`,
        EventCoord,
        {
            X: Eve.screenX - window.screenX - (window.outerWidth  - window.innerWidth),
            Y: Eve.screenY - window.screenY - (window.outerHeight - window.innerHeight)
        },
        Eve
    );*/
    return EventCoord;
};

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
    const Division = {};
         if(Ratio.X < BorderL) Division.X = 'left';
    else if(BorderR < Ratio.X) Division.X = 'right';
    else                       Division.X = 'center';
         if(Ratio.Y < BorderT) Division.Y = 'top';
    else if(BorderB < Ratio.Y) Division.Y = 'bottom';
    else                       Division.Y = 'middle';
    return {
        Target: Eve.target,
        Coord: Coord,
        Ratio: Ratio,
        Division: Division
    };
};

O.getOrigin = (Win) => {
    const Loc = (Win ? Win : window).location;
    return Loc.origin || Loc.protocol + '//' + (Loc.host || Loc.hostname + (Loc.port ? ':' + Loc.port : ''));
};

O.Origin = O.getOrigin();

O.Path = (DCS => {
    if(DCS) return DCS.src;
    return document.getElementById('bibi-script').src;
})(document.currentScript);

O.RootPath = O.Path.replace(/\/res\/scripts\/.+$/, '');

O.Cookie = {
    remember: (Group) => {
        const Cookie = JSON.parse(sML.Cookies.read('bibi') || '{}');
        if(typeof Group != 'string' || !Group) return Cookie;
        return Cookie[Group];
    },
    eat: (Group, KeyVal, Opt) => {
        if(typeof Group != 'string' || !Group) return false;
        if(typeof KeyVal != 'object') return false;
        const Cookie = O.Cookie.remember();
        if(typeof Cookie[Group] != 'object') Cookie[Group] = {};
        for(const Key in KeyVal) {
            const Val = KeyVal[Key];
            if(typeof Val == 'function') continue;
            Cookie[Group][Key] = Val;
        }
        if(!Opt) Opt = {};
        Opt.Path = location.pathname.replace(/[^\/]+$/, '');
        if(!Opt.Expires) Opt.Expires = S['cookie-expires'];
        sML.Cookies.write('bibi', JSON.stringify(Cookie), Opt);
    }
};

O.SettingTypes = {
    Boolean: [
    ],
    YesNo: [
        'allow-placeholders',
        'autostart',
        'autostart-embedded',
        'fix-reader-view-mode',
        'place-menubar-at-top',
        'single-page-always',
        'start-embedded-in-new-window',
        'use-arrows',
        'use-font-size-changer',
        'use-full-height',
        'use-keys',
        'use-loupe',
        'use-menubar',
        'use-nombre'
    ],
    String: [
        'loupe-mode'
    ],
    Integer: [
        'item-padding-bottom',
        'item-padding-left',
        'item-padding-right',
        'item-padding-top',
        'spread-gap',
        'spread-margin'
    ],
    Number: [
        'base-font-size',
        'flipper-width',
        'font-size-scale-per-step',
        'loupe-max-scale',
        'orientation-border-ratio'
    ],
    Array: [
    ]
};

O.SettingTypes_PresetOnly = {
    Boolean: [
        'accept-base64-encoded-data',
        'accept-blob-converted-data',
        'remove-bibi-website-link'
    ],
    YesNo: [
        'accept-local-file',
        'use-cookie'
    ],
    String: [
    ],
    Integer: [
    ],
    Number: [
        'cookie-expires'
    ],
    Array: [
        'trustworthy-origins',
        'extract-if-necessary'
    ]
};

O.SettingTypes_UserOnly = {
    Boolean: [
        'wait'
    ],
    YesNo: [
    ],
    Integer: [
        'nav'
    ],
    Number: [
    ],
    Array: [
    ]
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events

//----------------------------------------------------------------------------------------------------------------------------------------------


export const E = {};


E.initialize = () => {
    sML.applyRtL(E, new sML.CustomEvents('bibi'));
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Messages

//----------------------------------------------------------------------------------------------------------------------------------------------


export const M = {}; // Bibi.Messages


M.post = (Msg, TargetOrigin) => {
    if(!O.WindowEmbedded) return false;
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
    } catch(Err) {}
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
    Extensions: []
};

X.load = (Xtn) => new Promise((resolve, reject) => {
    if(!Xtn['src'] || typeof Xtn['src'] != 'string') return reject(`"src" of the Extension is Invalid.`);
    Xtn.Script = document.head.appendChild(sML.create('script', { className: 'bibi-extension-script', src: Xtn['src'], Extension: Xtn, resolve: resolve, reject: reject }));
})/*.then(DefinedExtension =>
    DefinedExtension['id'] + ': ' + O.getPath(O.RootPath, DefinedExtension['src'])
).catch(Msg =>
    Msg
)*/;

X.add = (XMeta) => {
    const XScript = document.currentScript;
    if(!XMeta['id'] || typeof XMeta['id']  != 'string') {
        XScript.reject(`"id" of the Extension is Invalid.`);
    } else if(XMeta['id'] == 'Bibi' || X[XMeta['id']]) {
        XScript.reject(`"${ XMeta['id'] }" is reserved or already taken for "id" of an Extention.`);
    } else {
        XScript.setAttribute('data-bibi-extension-id', XMeta['id']);
        X[XMeta['id']] = XScript.Extension = sML.applyRtL(XMeta, XScript.Extension);
        X[XMeta['id']].Index = X.Extensions.length;
        X.Extensions.push(X[XMeta['id']]);
        XScript.resolve(X[XMeta['id']]);
    }
    const Xtn = X[XMeta['id']];
    return function(onR) {         if(Xtn && typeof onR == 'function') E.bind('bibi:readied',  () => onR.call(Xtn, Xtn));
        return function(onP) {     if(Xtn && typeof onP == 'function') E.bind('bibi:prepared', () => onP.call(Xtn, Xtn));
            return function(onO) { if(Xtn && typeof onO == 'function') E.bind('bibi:opened',   () => onO.call(Xtn, Xtn)); }; }; };
};

Bibi.x = X.add;