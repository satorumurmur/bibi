/*!
 *                                                                                                                                (℠)
 *  ## BiB/i (heart)
 *  - "Heart of BiB/i"
 *
 */

(function(____) { 'use strict'; const TimeOrigin = Date.now();




____.Bibi = { "version": "____bibi-version____", "build": "____bibi-build____", "href": "https://bibi.epub.link" };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() { setTimeout(Bibi.welcome, 0); });

Bibi.welcome = function() {

    O.log('Welcome! v' + Bibi["version"] + ' (' + Bibi["build"] + ')', "<g!>");
    O.log('[ja] ' + Bibi["href"]);
    O.log('[en] https://github.com/satorumurmur/bibi');
    O.log('', "</g>");
    E.dispatch("bibi:says-welcome");

    O.RequestedURL = location.href;
    O.BookURL = O.Origin + location.pathname + location.search;

    O.Language = (function() {
        if(typeof navigator.language != "string") return "en";
        return (navigator.language.split("-")[0] == "ja") ? "ja" : "en";
    })();

    O.contentWindow = window;
    O.contentDocument = document;

    O.HTML  = document.documentElement; O.HTML.className = sML.Environments.join(" ") + " bibi welcome";
    O.Head  = document.head;
    O.Body  = document.body;
    O.Info  = document.getElementById("bibi-info");
    O.Title = document.getElementsByTagName("title")[0];

    // Device & Event
    if(sML.OS.iOS || sML.OS.Android) {
        O.Touch = true;
        O.HTML.className = O.HTML.className + " touch";
        if(sML.OS.iOS) {
            O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-capable",          content: "yes"   }));
            O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-status-bar-style", content: "white" }));
        }
        O["resize"] = "orientationchange";
        O["pointerdown"] = "touchstart";
        O["pointermove"] = "touchmove";
        O["pointerup"]   = "touchend";
    } else {
        O.Touch = false;
        O["resize"] = "resize";
        if(sML.UA.InternetExplorer || sML.UA.Edge) {
            O["pointerdown"] = "pointerdown";
            O["pointermove"] = "pointermove";
            O["pointerup"]   = "pointerup";
            O["pointerover"] = "pointerover";
            O["pointerout"]  = "pointerout";
        } else {
            O["pointerdown"] = "mousedown";
            O["pointermove"] = "mousemove";
            O["pointerup"]   = "mouseup";
            O["pointerover"] = "mouseover";
            O["pointerout"]  = "mouseout";
        }
    }

    setTimeout(Bibi.initialize, 0);

};


Bibi.initialize = function() {

    // Reader
    R.initialize();

    // UI
    I.initialize();

    if(sML.UA.InternetExplorer < 11) {
        // Say Bye-bye
        const Msg = {
            en: '<span>I\'m so Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible with BiB/i.</span>',
            ja: '<span>ごめんなさい……</span> <span>お使いのブラウザでは、</span><span>ビビは動きません。</span>'
        };
        I.Veil.ByeBye = I.Veil.appendChild(
            sML.create("p", { id: "bibi-veil-byebye",
                innerHTML: [
                    '<span lang="en">', Msg["en"], '</span>',
                    '<span lang="ja">', Msg["ja"], '</span>',
                ].join("").replace(/(BiB\/i|ビビ)/g, '<a href="' + Bibi["href"] + '" target="_blank">$1</a>')
            })
        );
        I.note('(Your Browser Is Not Compatible)', 99999999999);
        O.log(Msg["en"].replace(/<[^>]*>/g, ""));
        E.dispatch("bibi:says-byebye");
        O.HTML.classList.remove("welcome");
        return false;
    }

    // Say Welcome!
    I.note("Welcome!");

    // Extensions
    X.initialize();

    // Presets
    P.initialize();

    // User Parameters
    U.initialize();

    // Window Embedding
    if(window.parent == window) {
        O.WindowEmbedded = 0; // false
        O.WindowEmbeddedDetail = "Direct Opened: " + O.Origin + location.pathname + location.search;
        O.HTML.className = O.HTML.className + " window-not-embedded";
    } else {
        O.WindowEmbedded = -1; // true
        O.HTML.className = O.HTML.className + " window-embedded";
        try {
            if(location.host == parent.location.host || parent.location.href) {
                O.WindowEmbedded = 1; // true
                O.WindowEmbeddedDetail = "Embedded in: " + O.getOrigin(parent) + parent.location.pathname + parent.location.search;
                O.ParentHolder = window.parent.document.getElementById(U["parent-holder-id"]);
            }
        } catch(e) {}
        if(O.WindowEmbedded == -1) O.WindowEmbeddedDetail = "Embedded in: Unreachable Parent";
    }

    // Fullscreen
    if((!O.WindowEmbedded || O.ParentHolder) && (O.Body.requestFullscreen || O.Body.webkitRequestFullscreen || O.Body.mozRequestFullScreen || O.Body.msRequestFullscreen)) {
        O.FullscreenEnabled = true;
        O.FullscreenElement  = O.ParentHolder ? O.ParentHolder.Bibi.Frame : O.HTML;
        O.FullscreenDocument = O.ParentHolder ? window.parent.document    : document;
        O.HTML.className = O.HTML.className + " fullscreen-enabled";
    } else {
        O.HTML.className = O.HTML.className + " fullscreen-not-enabled";
    }

    // Writing Mode & Font Size
    O.WritingModeProperty = (function() {
        const HTMLCS = getComputedStyle(O.HTML);
        if(/^(vertical|horizontal)-/.test(HTMLCS["-webkit-writing-mode"])) return "-webkit-writing-mode";
        if(/^(vertical|horizontal)-/.test(HTMLCS["writing-mode"]) || sML.UA.InternetExplorer) return "writing-mode";
        else return undefined;
    })();
    const SRI4VTC = sML.CSS.appendRule("div#bibi-vtc", "position: absolute; left: -100px; top: -100px; width: 100px; height: 100px; -webkit-writing-mode: vertical-rl; -ms-writing-mode: tb-rl; writing-mode: vertical-rl;");
    const VTC = document.body.appendChild(sML.create("div", { id: "bibi-vtc" })); // VerticalTextChecker
    VTC.Child = VTC.appendChild(sML.create("p", { innerHTML: "aAあ亜" }));
    if(VTC.Child.offsetWidth < VTC.Child.offsetHeight) {
        O.HTML.className = O.HTML.className + " vertical-text-enabled";
        O.VerticalTextEnabled = true;
    } else {
        O.HTML.className = O.HTML.className + " vertical-text-not-enabled";
        O.VerticalTextEnabled = false;
    };
    O.DefaultFontSize = Math.min(VTC.Child.offsetWidth, VTC.Child.offsetHeight);
    document.body.removeChild(VTC);
    sML.deleteStyleRule(SRI4VTC);

    // Scrollbars
    O.Scrollbars = {
        Width: window.innerWidth - O.HTML.offsetWidth,
        Height: window.innerHeight - O.HTML.offsetHeight
    };
    O.Scrollbars.Height = O.Scrollbars.Width;

    // Settings
    S.initialize();

    O.HTML.classList.remove("welcome");

    // Ready ?
    X.loadFilesInPreset().then(function() {
        Bibi.ready();
    });

    E.dispatch("bibi:initialized");

};


Bibi.ready = function() {

    O.HTML.classList.add("ready");
    O.ReadiedURL = location.href;

    L.initialize();
    E.add("bibi:readied", L.loadBook);

    setTimeout(function() { E.dispatch("bibi:readied"); }, (O.Touch ? 999 : 0));

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Book

//----------------------------------------------------------------------------------------------------------------------------------------------


____.B = {}; // Bibi.Book


B.initialize = function() {
    O.applyRtL(B, {
        Title: "",
        Creator: "",
        Publisher: "",
        Language: "",
        WritingMode: "",
        Unzipped: false,
        Path: "",
        PathDelimiter: "",
        Zine:      { Path: "zine.yml" },
        Mimetype:  { Path: "mimetype" },
        Container: { Path: "META-INF/container.xml" },
        Package:   { Path: "", Dir: "",
            Metadata: { "identifier": "", "title": "", "creators": [], "publishers": [], "languages": [] },
            Manifest: { "items": {}, "nav": {}, "toc-ncx": {}, "cover-image": {}, Files: {} },
            Spine:    { "itemrefs": [] }
        },
        Files: {},
        FileDigit: 0
    }, "ExceptFunctions");
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


____.L = {}; // Bibi.Loader


L.initialize = function() {
    O.applyRtL(L, {
        Opened: false,
        Preprocessed: false
    }, "ExceptFunctions");
};


L.loadBook = function() {
    return L.getBookData().then(function(Param) {
        O.Busy = true;
        O.HTML.classList.remove("ready");
        O.HTML.classList.remove("waiting-file");
        O.HTML.classList.add("busy");
        O.HTML.classList.add("loading");
        I.note('Loading...');
        O.log("Initializing Book...", "<g:>");
        return L.initializeBook(Param);
    }).then(function(As) {
        O.log('As ' + As + (S["book"] ? ': ' + S["book"] : '.'));
        O.log('Initialized.', "</g>");
    }).then(function() {
        // Load Container+Package (or ZineData)
        return new Promise(function(resolve) {
            switch(S["book-type"]) {
                case "EPUB":
                    delete B.Zine;
                    O.log('Loading Container+Package...', "<g:>");
                    O.log("Container: " + B.Path + B.PathDelimiter + B.Container.Path);
                    return L.loadContainer().then(function() {
                        O.log("Package: " + B.Path + B.PathDelimiter + B.Package.Path);
                        return L.loadPackage().then(resolve);
                    });
                case "Zine":
                    delete B.Mimetype, delete B.Container;
                    O.log('Loading Zine Data...', "<g:>");
                    O.log('Zine Data: ' + B.Path + B.PathDelimiter + B.Zine.Path);
                    return X.Zine.loadZineData().then(resolve);
            }
        }).then(function() {
            E.dispatch("bibi:loaded-package-document");
            ['Title', 'Creator', 'Publisher', 'Language'].forEach(function(Pro) { O.log(Pro + ': ' + B[Pro]); });
            ['rendition:layout', 'rendition:orientation', 'rendition:spread', 'page-progression-direction'].forEach(function(Pro) { O.log(Pro + ': ' + B.Package.Metadata[Pro]); });
            O.log('Loaded.', "</g>");
        });
    }).then(function() {
        if(S["use-cookie"]) {
            const BibiCookie = O.Cookie.remember(O.RootPath);
            const BookCookie = O.Cookie.remember(B.ID);
            if(BibiCookie) {
                if(!U["reader-view-mode"]              && BibiCookie.RVM     ) S["reader-view-mode"]              = BibiCookie.RVM;
                if(!U["full-breadth-layout-in-scroll"] && BibiCookie.FBL     ) S["full-breadth-layout-in-scroll"] = BibiCookie.FBL;
            }
            if(BookCookie) {
                if(!U["to"]                            && BookCookie.Position) S["to"]                            = BookCookie.Position;
            }
        }
        S.update();
        R.updateOrientation();
        R.resetStage();
    }).then(function() {
        // Create Cover
        O.log('Creating Cover...', "<g:>");
        let Done = "";
        return new Promise(function(resolve) {
            if(B.Package.Manifest["cover-image"].Path) {
                O.log('Cover Image: ' + B.Path + B.PathDelimiter + B.Package.Manifest["cover-image"].Path);
                resolve();
            } else {
                reject();
            }
            L.createCover();
            E.dispatch("bibi:created-cover", B.Package.Manifest["cover-image"].Path);
        }).then(function() {
            O.log('Will Be Created.', "</g>");
        }).catch(function() {
            O.log('No Cover Image.', "</g>");
        });
    }).then(function() {
        // Initialize Spine
        O.log('Initializing Spine...', "<g:>");
        L.initializeSpine();
        O.log(R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : ''));
        O.log('Initialized.', "</g>");
    }).then(function() {
        // Load Navigation
        O.log('Loading Navigation...', "<g:>");
        return L.loadNavigation().then(function() {
            O.log(I.Panel.BookInfo.Navigation.Type + ': ' + B.Path + B.PathDelimiter + I.Panel.BookInfo.Navigation.Path);
            O.log('Loaded.', "</g>");
            E.dispatch("bibi:loaded-navigation", I.Panel.BookInfo.Navigation.Path);
        }).catch(function() {
            O.log('No Navigation.', "</g>");
        });
    }).then(function() {
        // Announce "Prepared" (and Wait, sometime)
        E.dispatch("bibi:prepared");
        if(!S["autostart"] && !L.Played) return L.wait();
    }).then(function() {
        // Background Preparing
        return L.preprocessResources();
    }).then(function() {
        // Load & Layout Items in Spreads and Pages
        O.log('Loading ' + R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + '...', "<g:>");
        const LayoutOption = {
            resetter: function() {
                LayoutOption.Reset = true;
                LayoutOption.removeResetter();
            },
            addResetter: function() {
                window.addEventListener("resize", LayoutOption.resetter);
            },
            removeResetter: function() {
                window.removeEventListener("resize", LayoutOption.resetter);
                LayoutOption.resetter = LayoutOption.addResetter = LayoutOption.removeResetter = function() {};
            },
            Destination: (function() {
                if(S["to"]) {
                    const HatchedDestination = R.hatchDestination(S["to"]);
                    if(HatchedDestination) return HatchedDestination;
                }
                return "head";
            })()
        };
        LayoutOption.addResetter();
        let LoadedSpreads = 0, LoadedItems = 0;
        return new Promise(function(resolve) {
            R.Spreads.forEach(function(Spread) {
                L.loadSpread(Spread, { AllowPlaceholderItems: !(Spread == LayoutOption.Destination.Spread) }).then(function() {
                    LoadedSpreads++;
                    const ItemHeaders = [], ItemLogs = [];
                    Spread.Items.forEach(function(Item, i) {
                        LoadedItems++;
                        const ItemNumber = sML.String.pad(Item.ItemIndex + 1, 0, B.FileDigit);
                        ItemHeaders.push('Item ' + ItemNumber);
                        ItemLogs.push('Item ' + ItemNumber + ': ' + (Item.FullPath || '(Not Found)'));
                    });
                    O.log('Spread ' + sML.String.pad(Spread.SpreadIndex + 1, 0, B.FileDigit) + ' (' + ItemHeaders.join(", ") + ')', "<g->");
                    ItemLogs.forEach(function(ItemLog) { O.log(ItemLog); });
                    O.log('', "</g>");
                    if(B.Package.Metadata["rendition:layout"] == "reflowable") I.note("Loading... (" + (LoadedItems) + "/" + R.Items.length + " Items Loaded.)");
                    if(!LayoutOption.Reset) R.layOutSpread(Spread);
                    if(LoadedSpreads == R.Spreads.length) resolve();
                });
            });
        }).then(function() {
            B.Files = {};
            O.log('Loaded.', "</g>");
            return LayoutOption;
        });
    }).then(function(LayoutOption) {
        if(!LayoutOption.Reset) {
            R.organizePages();
            R.layOutStage();
        }
        return R.layOut(LayoutOption).then(LayoutOption.removeResetter);
    }).then(function() {
        // Open
        O.Busy = false;
        O.HTML.classList.remove("busy");
        O.HTML.classList.remove("loading");
        I.Veil.close();
        L.Opened = true;
        document.body.click(); // To responce for user scrolling/keypressing immediately
        I.note('');
        //alert(O.getElapsedTimeLabel());
        O.log('Enjoy Readings!', "<i/>");
        E.dispatch("bibi:opened");
    }).then(function() {
        if(S["allow-placeholders"]) setTimeout(R.turnSpreadsOnDemand, 123);
        if(I.Slider) setTimeout(I.Slider.resetBookMap, 456);
    }).then(function() {
        E.add("bibi:commands:move-by",     function(Par) { R.moveBy(Par); });
        E.add("bibi:commands:scroll-by",   function(Par) { R.scrollBy(Par); });
        E.add("bibi:commands:focus-on",    function(Par) { R.focusOn(Par); });
        E.add("bibi:commands:change-view", function(Par) { R.changeView(Par); });
        window.addEventListener("message", M.gate, false);
        /*
        alert((function(Alert) {
            [
                "document.referrer",
                "navigator.userAgent",
                "[navigator.appName, navigator.vendor, navigator.platform]",
                "window.innerHeight",
                "[O.HTML.offsetHeight, O.HTML.clientHeight, O.HTML.scrollHeight]",
                "[O.Body.offsetHeight, O.Body.clientHeight, O.Body.scrollHeight]",
                "[R.Main.offsetHeight, R.Main.clientHeight, R.Main.scrollHeight]"
            ].forEach(function(X) {
                Alert.push("┌ " + X + "\n" + eval(X));
            });
            return Alert.join("\n\n");
        })([]));
        //*/
    }).catch(function(Mes) {
        I.note(Mes, 99999999999, "ErrorOccured");
    });
};


L.wait = function() {
    O.Busy = false;
    O.HTML.classList.remove("busy");
    O.HTML.classList.add("waiting");
    E.dispatch("bibi:waits");
    O.log('(Waiting...)', '<i/>');
    I.note('');
    return new Promise(function(resolve) {
        L.wait.resolve = function() { resolve(); delete L.wait.resolve; };
    }).then(function() {
        O.Busy = true;
        O.HTML.classList.add("busy");
        O.HTML.classList.remove("waiting");
        I.note('Loading...');
    });
};


L.play = function() {
    if(S["start-in-new-window"]) return window.open(location.href);
    L.Played = true;
    L.wait.resolve();
    E.dispatch("bibi:played");
};


L.getBookData = function() {
    return new Promise(function(resolve, reject) {
        if(S["book"])               return resolve({ BookData: S["book"] });
        if(S.BookDataElement)       return resolve({ BookData: S.BookDataElement.innerText.trim(), BookDataType: S.BookDataElement.getAttribute("data-bibi-book-mimetype") });
        if(!S["accept-local-file"]) return reject('Tell me EPUB name via ' + (O.WindowEmbedded ? "embedding tag" : "URI") + '.');
        L.getBookData.resolve = function(Param) { resolve(Param); delete L.getBookData.resolve; };
        O.HTML.classList.add("waiting-file");
    });
};


L.initializeBook = function(Param) {
    B.initialize();
    R.reset();
    return new Promise(function(resolve, reject) {
        if(!Param || !Param.BookData) return reject('Book Data Is Undefined.');
        let BookData = Param.BookData;
        const BookDataFormat = (function() {
            switch(typeof BookData) {
                case "string": return /^https?:\/\//.test(BookData) ? "URI" : "Base64";
                case "object": return (BookData instanceof File) ? "File" : (BookData instanceof Blob) ? "BLOB" : "";
                default:       return "";
            }
        })();
        if(!BookDataFormat) return reject('Book Data Is Unknown.');
        if(BookDataFormat == "URI") {
            // Online
            B.Path = BookData;
            if(!S["trustworthy-origins"].includes(B.Path.replace(/^(\w+:\/\/[^\/]+).*$/, "$1"))) return reject('The Origin of the Path of the Book Is Not Allowed.');
            const getErrorMessage = function(As, Detail) {
                let         ErrorMessage  = 'Failed to Open';
                if(As.join) ErrorMessage += ' Both as ' + As.join(' and ');
                else        ErrorMessage += ' as ' + As;
                if(Detail)  ErrorMessage += ' (' + Detail + ')';
                return      ErrorMessage +  '.';
            };
            let ToCheckExistance, As;
            if(S["book-type"] == "EPUB") {
                // Online EPUB
                ToCheckExistance = B.Container.Path;
                As = ['a Zipped EPUB File', 'an Unzipped EPUB Folder'];
            } else if(S["book-type"] == "Zine") {
                // Online Zine
                ToCheckExistance = B.Zine.Path;
                As = ['a Zipped Zine File', 'an Unzipped Zine Folder'];
            }
            if(S.willBeUnzipped(B.Path)) {
                // Online Zipped (probably)
                X.Unzipper.loadBookData(B.Path).then(function(ContentLog) {
                    // Online Zipped (definitely)
                    resolve(As[0]);
                }).catch(function(ErrorDetail) {
                    if(ErrorDetail.BookTypeError) return reject(ErrorDetail.BookTypeError);
                    O.log(getErrorMessage(As[0], ErrorDetail));
                    // Online Unzipped (probably)
                    O.log('Trying as ' + As[1] + '...');
                    O.download(B.Path + "/" + ToCheckExistance).then(function() {
                        // Online Unzipped (definitely)
                        B.Unzipped = true;
                        resolve(As[1]);
                    }).catch(function(XHR) {
                        const ErrorDetail = ""; //(XHR.status == 404 ? ToCheckExistance + ' Is Not Found' : '');
                        O.log(getErrorMessage(As[1], ErrorDetail));
                        reject(getErrorMessage(As));
                    });
                });
            } else {
                // Online Unzipped (probably)
                As.reverse();
                O.download(B.Path + "/" + ToCheckExistance).then(function() {
                    // Online Unzipped (definitely)
                    B.Unzipped = true;
                    resolve(As[0]);
                }).catch(function(XHR) {
                    const ErrorDetail = ""; //(XHR.status == 404 ? ToCheckExistance + ' Is Not Found' : '');
                    O.log(getErrorMessage(As[0], ErrorDetail));
                    // Online Zipped (probably)
                    return reject('To Open This Book as ' + As[1] + ', Changing "unzip-if-necessary" May Be Required.');
                });
            }
        } else {
            let FileOrData;
            const MIMETypeREs = { EPUB: /^application\/epub\+zip$/, Zine: /^application\/(zip|x-zip(-compressed)?)$/ };
            const MIMETypeErrorMessage = 'BiB/i Can Not Open This Type of File.';
            if(BookDataFormat == "File") {
                // Local Zipped EPUB/Zine File
                if(!S["accept-local-file"])               return reject('To Open Local Files, Changing "accept-local-file" in default.js Is Required.');
                if(!BookData.name)                        return reject('Book File Is Invalid.');
                if(!/\.[\w\d]+$/.test(BookData.name))     return reject('BiB/i Can Not Open Local Files without Extension.');
                if(!/\.(epub|zip)$/i.test(BookData.name)) return reject(MIMETypeErrorMessage);
                if(!S.willBeUnzipped(BookData.name))      return reject('To Open This File, Changing "unzip-if-necessary" in default.js Is Required.');
                if(/\.epub$/i.test(BookData.name)) {
                    if(!MIMETypeREs["EPUB"].test(BookData.type)) return reject(MIMETypeErrorMessage);
                } else {
                    if(!MIMETypeREs["Zine"].test(BookData.type)) return reject(MIMETypeErrorMessage);
                }
                FileOrData = "File";
                B.Path = "[Local File] " + BookData.name;
            } else {
                if(BookDataFormat == "Base64") {
                    // Base64 Encoded EPUB/Zine Data
                    if(!S["accept-base64-encoded-data"]) return reject('To Open Base64 Encoded Data, Changing "accept-base64-encoded-data" in default.js Is Required.');
                    try {
                        const Bin = atob(BookData.replace(/^.*,/, ''));
                        const Buf = new Uint8Array(Bin.length);
                        for(let l = Bin.length, i = 0; i < l; i++) Buf[i] = Bin.charCodeAt(i);
                        BookData = new Blob([Buf.buffer], { type: Param.BookDataType });
                        if(!BookData || !(BookData instanceof Blob)) throw '';
                    } catch(Err) {
                        return reject('Book Data Is Invalid.');
                    }
                    B.Path = "[Base64 Encoded Data]";
                } else {
                    // BLOB of EPUB/Zine Data
                    if(!S["accept-blob-converted-data"]) return reject('To Open BLOB Converted Data, Changing "accept-blob-converted-data" in default.js Is Required.');
                    B.Path = "[BLOB Converted Data]";
                }
                if(!MIMETypeREs["EPUB"].test(BookData.type) && !MIMETypeREs["Zine"].test(BookData.type)) return reject(MIMETypeErrorMessage);
                FileOrData = "Data";
            }
            if(!BookData.size) return reject('Book ' + FileOrData + ' Is Empty.');
            X.Unzipper.loadBookData(BookData).then(function(ContentLog) {
                if(S["book-type"] == "EPUB") return resolve("an Zipped EPUB " + FileOrData);
                if(S["book-type"] == "Zine") return resolve( "a Zipped Zine " + FileOrData);
                return reject('Book ' + FileOrData + ' Is Invalid.');
            });
        }
    }).then(function(As) {
        B.PathDelimiter = B.Unzipped ? "/" : " > ";
        return As;
    }).catch(function(Log) {
        I.Veil.Cover.className = "";
        if(S["accept-local-file"]) O.HTML.classList.add("waiting-file");
        const Message = 'BiB/i Failed to Open the Book.';
        O.error(Message + "\n* " + Log);
        return Promise.reject(Message);
    });
};



L.loadContainer = function() {
    return O.openDocument(B.Container.Path).then(L.processContainer);
};

L.processContainer = function(Doc) {
    B.Package.Path = Doc.getElementsByTagName("rootfile")[0].getAttribute("full-path");
    B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, "");
};


L.loadPackage = function() {
    return O.openDocument(B.Package.Path).then(L.processPackage);
};

L.processPackage = function(Doc) {

    const BPM = B.Package.Metadata;
    const BPS = B.Package.Spine;

    // Package
    const Metadata = Doc.getElementsByTagName("metadata")[0];
    const Manifest = Doc.getElementsByTagName("manifest")[0];
    const Spine    = Doc.getElementsByTagName("spine"   )[0];
    const ManifestItems = Manifest.getElementsByTagName("item");
    const SpineItemrefs = Spine.getElementsByTagName("itemref");
    if(ManifestItems.length <= 0) return O.error('"' + B.Package.Path + '" has no <item> in <manifest>.');
    if(SpineItemrefs.length <= 0) return O.error('"' + B.Package.Path + '" has no <itemref> in <spine>.');

    // METADATA
    O.forEach(Metadata.getElementsByTagName("meta"), function(Meta) {
        if(Meta.getAttribute("refines")) return;
        if(Meta.getAttribute("property")) {
            // DCTerms
            const Property = Meta.getAttribute("property").replace(/^dcterms:/, "");
                 if(          /^(identifier|title)$/.test(Property)) BPM[Property      ] =    Meta.textContent;
            else if(/^(creator|publisher|language)$/.test(Property)) BPM[Property + "s"].push(Meta.textContent);
            else if(                                 !BPM[Property]) BPM[Property      ] =    Meta.textContent;
        }
        if(Meta.getAttribute("name") && Meta.getAttribute("content")) {
            // Others
            BPM[Meta.getAttribute("name")] = Meta.getAttribute("content");
        }
    });
    const DCNS = Metadata.getAttribute("xmlns:dc");
    if(!BPM["identifier"])                      O.forEach(Doc.getElementsByTagNameNS(DCNS, "identifier"), function(DCI) { BPM["identifier"] =    DCI.textContent;  });
    if(!BPM["identifier"])                      BPM["identifier"] = O.BookURL;
    if(!BPM["title"     ])                      O.forEach(Doc.getElementsByTagNameNS(DCNS, "title"),      function(DCT) { BPM["title"     ] =    DCT.textContent;  });
    if(!BPM["creators"  ].length)               O.forEach(Doc.getElementsByTagNameNS(DCNS, "creator"),    function(DCC) { BPM["creators"  ].push(DCC.textContent); });
    if(!BPM["publishers"].length)               O.forEach(Doc.getElementsByTagNameNS(DCNS, "publisher"),  function(DCP) { BPM["publishers"].push(DCP.textContent); });
    if(!BPM["languages" ].length)               O.forEach(Doc.getElementsByTagNameNS(DCNS, "language"),   function(DCL) { BPM["languages" ].push(DCL.textContent); });
    if(!BPM["languages" ].length)               BPM["languages"][0] = "en";
    if(!BPM["cover"])                           BPM["cover"]                 = "";
    if(!BPM["rendition:layout"])                BPM["rendition:layout"]      = BPM["omf:version"] ? "pre-paginated" : "reflowable";
    if(!BPM["rendition:orientation"])           BPM["rendition:orientation"] = "auto";
    if(!BPM["rendition:spread"])                BPM["rendition:spread"]      = "auto";
    if( BPM["rendition:orientation"] == "auto") BPM["rendition:orientation"] = "portrait";
    if( BPM["rendition:spread"]      == "auto") BPM["rendition:spread"]      = "landscape";

    if(BPM[     "original-resolution"]) BPM[     "original-resolution"] = O.getViewportByOriginalResolutionString(BPM[     "original-resolution"]);
    if(BPM[      "rendition:viewport"]) BPM[      "rendition:viewport"] = O.getViewportByMetaContentString(       BPM[      "rendition:viewport"]);
    if(BPM["fixed-layout-jp:viewport"]) BPM["fixed-layout-jp:viewport"] = O.getViewportByMetaContentString(       BPM["fixed-layout-jp:viewport"]);
    if(BPM[            "omf:viewport"]) BPM[            "omf:viewport"] = O.getViewportByMetaContentString(       BPM[            "omf:viewport"]);

    B.ICBViewport = (function() {
        if(BPM[     "original-resolution"]) return BPM[     "original-resolution"];
        if(BPM[      "rendition:viewport"]) return BPM[      "rendition:viewport"];
        if(BPM["fixed-layout-jp:viewport"]) return BPM["fixed-layout-jp:viewport"];
        if(BPM[            "omf:viewport"]) return BPM[            "omf:viewport"];
        return null;
    })();

    Doc = undefined;

    // MANIFEST
    const TOCID = Spine.getAttribute("toc");
    O.forEach(ManifestItems, function(ManifestItemSource) {
        const ManifestItem = {
            "id"         : ManifestItemSource.getAttribute("id")         || "",
            "href"       : ManifestItemSource.getAttribute("href")       || "",
            "media-type" : ManifestItemSource.getAttribute("media-type") || "",
            "properties" : ManifestItemSource.getAttribute("properties") || "",
            "fallback"   : ManifestItemSource.getAttribute("fallback")   || ""
        };
        if(!ManifestItem["id"] || !ManifestItem["href"]) return;
        B.Package.Manifest["items"][ManifestItem["id"]] = ManifestItem;
        ManifestItem.Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
        B.Package.Manifest.Files[ManifestItem.Path] = {};
        (function(ManifestItemProperties) {
            if(        / nav /.test(ManifestItemProperties)) B.Package.Manifest["nav"        ].Path = ManifestItem.Path;
            if(/ cover-image /.test(ManifestItemProperties)) B.Package.Manifest["cover-image"].Path = ManifestItem.Path;
        })(" " + ManifestItem.properties + " ");
        if(TOCID && ManifestItem["id"] == TOCID) B.Package.Manifest["toc-ncx"].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
    });

    // SPINE
    BPS["page-progression-direction"] = Spine.getAttribute("page-progression-direction");
    if(!BPS["page-progression-direction"] || !/^(ltr|rtl)$/.test(BPS["page-progression-direction"])) BPS["page-progression-direction"] = "ltr";//"default";
    B.PPD = BPS["page-progression-direction"];
    const PropertyREs = [
        /(page-spread)-(.+)/,
        /(rendition:layout)-(.+)/,
        /(rendition:orientation)-(.+)/,
        /(rendition:spread)-(.+)/,
        /(rendition:page-spread)-(.+)/,
        /(bibi:[a-z]+)-(.+)/
    ];
    O.forEach(SpineItemrefs, function(SpineItemrefSource) {
        const SpineItemref = {
            "idref"                 : SpineItemrefSource.getAttribute("idref")      || "",
            "linear"                : SpineItemrefSource.getAttribute("linear")     || "",
            "properties"            : SpineItemrefSource.getAttribute("properties") || "",
            "page-spread"           : "",
            "rendition:layout"      : BPM["rendition:layout"],
            "rendition:orientation" : BPM["rendition:orientation"],
            "rendition:spread"      : BPM["rendition:spread"]
        };
        if(SpineItemref["linear"] != "no") SpineItemref["linear"] = "yes";
        SpineItemref["properties"] = SpineItemref["properties"].replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ").split(" ");
        PropertyREs.forEach(function(RE) {
            SpineItemref["properties"].forEach(function(Property) {
                if(RE.test(Property)) {
                    SpineItemref[Property.replace(RE, "$1")] = Property.replace(RE, "$2").replace("rendition:", "");
                    return false;
                }
            });
        });
        if(SpineItemref["rendition:page-spread"]) SpineItemref["page-spread"] = SpineItemref["rendition:page-spread"];
        SpineItemref["rendition:page-spread"] = SpineItemref["page-spread"];
        //SpineItemref["viewport"] = { Width: null, Height: null };
        BPS["itemrefs"].push(SpineItemref);
    });

    B.ID        = BPM["identifier"];
    B.Title     = BPM["title"];
    B.Creator   = BPM["creators"].join(  ", ");
    B.Publisher = BPM["publishers"].join(", ");
    B.Language  = BPM["languages"][0].split("-")[0];
    B.WritingMode = (function() {
        if(                                                                                            /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) return (B.PPD == "rtl") ? "tb-rl" : "lr-tb";
        if(/^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language)) return                              "rl-tb";
        if(                                                                                                            /^(mo?n)$/.test(B.Language)) return                    "tb-lr"          ;
        /* Default: */                                                                                                                              return                              "lr-tb";
    })();

    if(B.Title) {
        const BookIDFragments = [B.Title];
        if(B.Creator)   BookIDFragments.push(B.Creator);
        if(B.Publisher) BookIDFragments.push(B.Publisher);
        const TitleExtras = S["website-name-in-title"] ? S["website-name-in-title"] : "Published with BiB/i";
        O.Title.innerHTML = "";
        O.Title.appendChild(document.createTextNode(BookIDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">") + " | " + TitleExtras));
        try { O.Info.querySelector("h1").innerHTML = document.title; } catch(Err) {}
    }

    B.AllowPlaceholderItems = (B.Unzipped/* && B.Package.Metadata["rendition:layout"] == "pre-paginated"*/);

};


L.createCover = function() {
    //I.Veil.Cover.ImageBox.innerHTML = I.Veil.Cover.Info.innerHTML = I.Panel.BookInfo.Cover.Info.innerHTML = "";
    I.Veil.Cover.Info.innerHTML = I.Panel.BookInfo.Cover.Info.innerHTML = "";
    try { I.Panel.BookInfo.Cover.removeChild(I.Panel.BookInfo.Cover.getElementsByTagName("img")[0]); } catch(Err) {}
    const CoverImagePath = B.Package.Manifest["cover-image"].Path;
    I.Veil.Cover.Info.innerHTML = I.Panel.BookInfo.Cover.Info.innerHTML = (function() {
        const BookID = [];
        if(B.Title)     BookID.push('<strong>' + B.Title     + '</strong>');
        if(B.Creator)   BookID.push('<em>'     + B.Creator   + '</em>');
        if(B.Publisher) BookID.push('<span>'   + B.Publisher + '</span>');
        return BookID.join(" ");
    })();
    if(CoverImagePath) {
        sML.create("img", {
            load: function() {
                //O.log('Loading Cover Image: ' + B.Path + B.PathDelimiter + CoverImagePath + ' ...', "<g:>");
                const Img = this;
                Img.src = B.Files[CoverImagePath] ? O.getDataURI(CoverImagePath, B.Files[CoverImagePath]) : B.Path + "/" + CoverImagePath;
                Img.timeout = setTimeout(function() { Img.ontimeout(); }, 5000);
                //I.Veil.Cover.ImageBox.appendChild(this);
            },
            onload: function() {
                if(this.TimedOut) return false;
                clearTimeout(this.timeout);
                //O.log('Cover Image Loaded.', "</g>");
                //I.Panel.BookInfo.Cover.insertBefore(sML.create("img", { src: this.src }), I.Panel.BookInfo.Cover.Info);
                sML.style(I.Veil.Cover, { backgroundImage: "url(" + this.src + ")" });
                I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "with-cover-image";
                I.Panel.BookInfo.Cover.insertBefore(this, I.Panel.BookInfo.Cover.Info);
            },
            ontimeout: function() {
                this.TimedOut = true;
                //O.log('Cover Image Request Timed Out.', "</g>");
                I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "without-cover-image";
            }
        }).load();
    } else {
        I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "without-cover-image";
        I.Veil.Cover.appendChild(I.getBookIcon());
    };
    return CoverImagePath;
};


L.initializeSpine = function() {

    // For Spread Pairing of Pre-Paginated
    let SpreadBefore, SpreadAfter;
    if(B.PPD == "rtl") SpreadBefore = "right", SpreadAfter = "left";
    else               SpreadBefore = "left",  SpreadAfter = "right";

    B.FileDigit = (B.Package.Spine["itemrefs"].length + "").length;
    //if(B.FileDigit < 3) B.FileDigit = 3;

    // Items, ItemBoxes, Spreads, SpreadBoxes
    O.forEach(B.Package.Spine["itemrefs"], function(ItemRef) {
        const Item = sML.create("iframe", { className: "item", scrolling: "no", allowtransparency: "true" });
        Item.TimeCard = {};
        Item.stamp = function(What) { O.stamp(What, Item.TimeCard); };
        Item.ItemIndex = R.Items.length;
        Item.ItemRef = ItemRef;
        Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
        Item.FullPath = Item.Path ? ((!/^https?:\/\//.test(Item.Path) ? B.Path + B.PathDelimiter : "") + Item.Path) : "";
        R.AllItems.push(Item);
        if(ItemRef["linear"] == "yes") R.Items.push(Item); else return R.NonLinearItems.push(Item);
        let Spread = null;
        if(ItemRef["page-spread"] == SpreadAfter && Item.ItemIndex > 0) {
            const PreviousItem = R.Items[Item.ItemIndex - 1];
            if(PreviousItem.ItemRef["page-spread"] == SpreadBefore) {
                PreviousItem.SpreadPair = Item;
                Item.SpreadPair = PreviousItem;
                Spread = Item.Spread = PreviousItem.Spread;
                const SpreadBox = Spread.SpreadBox;
                //SpreadBox.classList.add(ItemRef["rendition:layout"]);
                SpreadBox.classList.add("paired-items");
                SpreadBox.classList.remove("single-item", "single-item-spread-before", "single-item-spread-" + SpreadBefore);
            }
        }
        if(!Spread) {
            Spread = Item.Spread = sML.create("div", { className: "spread" });
            const SpreadBox = Spread.SpreadBox = sML.create("div", { className: "spread-box" });
            SpreadBox.classList.add(ItemRef["rendition:layout"], "single-item");
            if(ItemRef["page-spread"]) {
                SpreadBox.classList.add("single-item-spread-" + ItemRef["page-spread"]);
                switch(ItemRef["page-spread"]) {
                    case SpreadBefore: SpreadBox.classList.add("single-item-spread-before"); break;
                    case SpreadAfter:  SpreadBox.classList.add("single-item-spread-after" ); break;
                }
            }
            Spread.SpreadIndex = R.Spreads.length;
            R.Spreads.push(Spread);
            R.Main.Book.appendChild(SpreadBox).appendChild(Spread);
            Spread.Items = [];
            Spread.Pages = [];
        }
        const ItemBox = Item.ItemBox = sML.create("div", { className: "item-box" });
        ItemBox.classList.add(ItemRef["rendition:layout"]);
        if(Item.ItemRef["page-spread"]) {
            ItemBox.classList.add("page-spread-" + Item.ItemRef["page-spread"]);
            switch(ItemRef["page-spread"]) {
                case SpreadBefore: ItemBox.classList.add("page-spread-before"); break;
                case SpreadAfter:  ItemBox.classList.add("page-spread-after" ); break;
            }
        }
        Item.ItemIndexInSpread = Spread.Items.length;
        Spread.Items.push(Item);
        Spread.appendChild(ItemBox);//.appendChild(Item);
        Item.Pages = [];
        if(ItemRef["rendition:layout"] == "pre-paginated") {
            const Page = sML.create("span", { className: "page" });
            Page.Item = Item, Page.Spread = Item.Spread;
            Page.PageIndexInItem = 0;
            Item.Pages.push(Page);
            Item.ItemBox.appendChild(Page);
        }
    });

    E.dispatch("bibi:initialized-spine");

};


L.loadNavigation = function() {

    return new Promise(function(resolve, reject) {
        if(B.Package.Manifest["nav"].Path) {
            I.Panel.BookInfo.Navigation.Path = B.Package.Manifest["nav"].Path;
            I.Panel.BookInfo.Navigation.Type = "Navigation Document";
        } else if(B.Package.Manifest["toc-ncx"].Path) {
            I.Panel.BookInfo.Navigation.Path = B.Package.Manifest["toc-ncx"].Path;
            I.Panel.BookInfo.Navigation.Type = "TOC-NCX";
        }
        if(!I.Panel.BookInfo.Navigation.Type) return reject();
        return O.openDocument(I.Panel.BookInfo.Navigation.Path).then(function(Doc) {
            I.Panel.BookInfo.Navigation.innerHTML = "";
            const NavContent = document.createDocumentFragment();
            if(I.Panel.BookInfo.Navigation.Type == "Navigation Document") {
                O.forEach(Doc.querySelectorAll("nav"), function(Nav) {
                    switch(Nav.getAttribute("epub:type")) {
                        case "toc":       Nav.classList.add("bibi-nav-toc"); break;
                        case "landmarks": Nav.classList.add("bibi-nav-landmarks"); break;
                        case "page-list": Nav.classList.add("bibi-nav-page-list"); break;
                    }
                    O.forEach(Nav.querySelectorAll("*"), function(Ele) { Ele.removeAttribute("style"); });
                    NavContent.appendChild(Nav);
                });
            } else {
                const makeNavULTree = function(Ele) {
                    const ChildNodes = Ele.childNodes;
                    let UL = undefined;
                    for(let l = ChildNodes.length, i = 0; i < l; i++) {
                        if(ChildNodes[i].nodeType != 1 || !/^navPoint$/i.test(ChildNodes[i].tagName)) continue;
                        const NavPoint = ChildNodes[i];
                        const NavLabel = NavPoint.getElementsByTagName("navLabel")[0];
                        const Content  = NavPoint.getElementsByTagName("content")[0];
                        const Text = NavPoint.getElementsByTagName("text")[0];
                        if(!UL) UL = document.createElement("ul");
                        const LI = sML.create("li", { id: NavPoint.getAttribute("id") }); LI.setAttribute("playorder", NavPoint.getAttribute("playorder"));
                        const A  = sML.create("a", { href: Content.getAttribute("src"), innerHTML: Text.innerHTML.trim() });
                        UL.appendChild(LI).appendChild(A);
                        const ChildUL = makeNavULTree(NavPoint);
                        if(ChildUL) LI.appendChild(ChildUL);
                    }
                    return UL;
                };
                const NavUL = makeNavULTree(Doc.getElementsByTagName("navMap")[0]);
                if(NavUL) NavContent.appendChild(document.createElement("nav")).appendChild(NavUL);
            }
            I.Panel.BookInfo.Navigation.appendChild(NavContent);
            L.coordinateLinkages(I.Panel.BookInfo.Navigation.Path, I.Panel.BookInfo.Navigation, "InNav");
        }).then(resolve);
    });

};


L.coordinateLinkages = function(BasePath, RootElement, InNav) {
    O.forEach(RootElement.getElementsByTagName("a"), function(A, i) {
        if(InNav) {
            A.NavANumber = i + 1;
            A.addEventListener(O["pointerdown"], function(Eve) { Eve.stopPropagation(); });
            A.addEventListener(O["pointerup"],   function(Eve) { Eve.stopPropagation(); });
        }
        let HrefPathInSource = A.getAttribute("href"), HrefAttribute = "href";
        if(!HrefPathInSource) {
            HrefPathInSource = A.getAttribute("xlink:href");
            if(HrefPathInSource) {
                HrefAttribute = "xlink:href";
            } else {
                if(InNav) {
                    A.addEventListener("click", function(Eve) { Eve.preventDefault(); Eve.stopPropagation(); return false; });
                    A.classList.add("bibi-bookinfo-inactive-link");
                }
                return;
            }
        }
        if(/^[a-zA-Z]+:/.test(HrefPathInSource)) {
            if(HrefPathInSource.split("#")[0] == location.href.split("#")[0]) {
                const HrefHashInSource = HrefPathInSource.split("#")[1];
                HrefPathInSource = (HrefHashInSource ? "#" + HrefHashInSource : R.Items[0].Path)
            } else {
                return A.setAttribute("target", A.getAttribute("target") || "_blank");
            }
        }
        const HrefPath = O.getPath(BasePath.replace(/\/?([^\/]+)$/, ""), (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? BasePath.replace(/^.+?([^\/]+)$/, "$1") : "") + HrefPathInSource);
        const HrefFnH = HrefPath.split("#");
        const HrefFile = HrefFnH[0] ? HrefFnH[0] : BasePath;
        const HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
        for(let l = R.Items.length, i = 0; i < l; i++) {
            const rItem = R.Items[i];
            if(HrefFile == rItem.Path) {
                A.setAttribute("data-bibi-original-href", HrefPathInSource);
                A.setAttribute(HrefAttribute, B.Path + "/" + HrefPath);
                A.InNav = InNav;
                A.Destination = (rItem.ItemRef["rendition:layout"] == "pre-paginated") ? {
                    Page: rItem.Pages[0]
                } : {
                    Item: rItem,
                    ElementSelector: (HrefHash ? "#" + HrefHash : undefined)
                };
                L.coordinateLinkages.setJump(A);
                break;
            }
        }
        if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
            A.setAttribute("data-bibi-original-href", HrefPathInSource);
            if(X["EPUBCFI"]) {
                A.setAttribute(HrefAttribute, B.Path + "/#" + HrefHash);
                A.InNav = InNav;
                A.Destination = X["EPUBCFI"].getDestination(HrefHash);
                L.coordinateLinkages.setJump(A);
            } else {
                A.removeAttribute(HrefAttribute);
                A.addEventListener("click", function() { return false; });
                if(!O.Touch) {
                    A.addEventListener(O["pointerover"], function() { I.Help.show("(This link uses EPUBCFI. BiB/i needs the extension.)"); return false; });
                    A.addEventListener(O["pointerout"],  function() { I.Help.hide(); return false; });
                }
            }
        }
        if(InNav && typeof S["nav"] == (i + 1) && A.Destination) S["to"] = A.Destination;
    });
};

L.coordinateLinkages.setJump = function(A) {
    A.addEventListener("click", function(Eve) {
        Eve.preventDefault(); 
        Eve.stopPropagation();
        if(A.Destination) {
            new Promise(function(resolve) {
                A.InNav ? I.Panel.toggle().then(resolve) : resolve();
            }).then(L.Opened ? function() {
                R.focusOn({ Destination: A.Destination, Duration: 0 });
            } : function() {
                if(S["start-in-new-window"]) return window.open(location.href + (location.hash ? "," : "#") + "pipi(nav:" + A.NavANumber + ")");
                S["to"] = A.Destination;
                L.play();
            });
        }
        return false;
    });
};


L.preprocessResources = function() {
    return new Promise(function(resolve, reject) {
        if(B.Unzipped) {
            if(S.BRL == "pre-paginated") return reject();
            if(S["book-type"] == "Zine") return reject();
            const FileTypes = (function() {
                if(sML.UA.Gecko || sML.UA.Edge) return ["HTML", "CSS"];
                return null;
            })();
            if(!FileTypes) return reject();
            let FilesToBeLoaded = 0;
            for(let FilePath in B.Package.Manifest.Files) {
                for(let l = FileTypes.length, i = 0; i < l; i++) {
                    if(L.preprocessResources.Settings[FileTypes[i]].FileExtensionRE.test(FilePath)) {
                        B.Files[FilePath] = "";
                        FilesToBeLoaded++;
                        break;
                    }
                }
            }
            if(!FilesToBeLoaded) return reject();
            let FilesLoaded = 0;
            for(let FilePath in B.Files) {
                //(function(FilePath) {
                    O.download(B.Path + "/" +  FilePath).then(function(XHR) {
                        B.Files[FilePath] = XHR.responseText;
                        FilesLoaded++;
                        if(FilesLoaded >= FilesToBeLoaded) return resolve();
                    });
                //})(FilePath);
            }
        } else {
            for(let FilePath in B.Files) if(typeof B.Package.Manifest.Files[FilePath] == "undefined") B.Files[FilePath] = "";
            resolve();
        }
    }).then(function() {
        for(let Type in L.preprocessResources.Settings) if(L.preprocessResources.Settings[Type].init) L.preprocessResources.Settings[Type].init();
        E.dispatch("bibi:is-going-to:preprocess-resources");
        const PartLog = [];
        let AllCount = 0;
        ["CSS", "SVG", "HTML"].forEach(function(Type) {
            let Count = 0;
            for(let FilePath in B.Files) {
                if(!L.preprocessResources.Settings[Type].FileExtensionRE.test(FilePath)) continue;
                L.preprocessResources.preprocessFile(FilePath, L.preprocessResources.Settings[Type]);
                Count++;
                AllCount++;
            }
            if(Count) PartLog.push(Count + ' ' + Type + (Count >= 2 ? 's' : ''));
        });
        if(AllCount) O.log('Preprocessed Resources (' + (PartLog.length != 1 ? AllCount + ' Files' + (PartLog.length > 1 ? ' = ' : '') : '') + PartLog.join(' + ') + ').');
        L.Preprocessed = true;
        E.dispatch("bibi:preprocessed-resources");
    }).catch(function() {
        return Promise.resolve();
    });
};

L.preprocessResources.PreprocessedFiles = [];
L.preprocessResources.preprocessFile = function(FilePath, Setting) {
    if(L.preprocessResources.PreprocessedFiles.includes(FilePath)) return B.Files[FilePath];
    let FileContent = B.Files[FilePath];
    if(!B.Files[FilePath] || !Setting.FileExtensionRE.test(FilePath)) return FileContent;
    if(Setting.ReplaceRules) {
        Setting.ReplaceRules.forEach(function(ReplaceRule) {
            if(ReplaceRule) FileContent = FileContent.replace(ReplaceRule[0], ReplaceRule[1]);
        });
    }
    if(Setting.NestingRE) {
        const Nestings = FileContent.match(Setting.NestingRE);
        if(Nestings) {
            Nestings.forEach(function(Nesting) {
                const NestingPath = O.getPath(FilePath.replace(/[^\/]+$/, ""), Nesting.replace(Setting.NestingRE, "$2"));
                if(B.Files[NestingPath]) {
                    FileContent = FileContent.replace(
                        Nesting, Nesting.replace(
                            Setting.NestingRE, "$1" + O.getDataURI(NestingPath, L.preprocessResources.preprocessFile(NestingPath, Setting)) + "$3"
                        )
                    );
                }
            });
        }
    }
    FileContent = L.preprocessResources.replaceResourceRefferences(FilePath, FileContent, Setting);
    B.Files[FilePath] = FileContent.replace(/[\r\n]+/gm, "\n").trim();
    L.preprocessResources.PreprocessedFiles.push(FilePath);
    return B.Files[FilePath];
};

L.preprocessResources.Settings = {
    CSS: {
        FileExtensionRE: /\.css$/,
        ReplaceRules: [
            [/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, ""]
        ],
        NestingRE: /(@import\s*(?:url\()?["']?)(?!(?:https?|data):)(.+?\.css)(['"]?(?:\))?\s*;)/g,
        ResAttributesAndExtensions: {
            "url" : "gif|png|jpe?g|svg|ttf|otf|woff"
        },
        getResMatchRE: function() {
            return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g;
        },
        init: function() {
            this.ReplaceRules.push([/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/gm, 'column-count: auto$3']);
            this.ReplaceRules.push([/(-(epub|webkit)-)?text-underline-position\s*:/gm, 'text-underline-position:']);
            if(sML.UA.WebKit || sML.UA.Blink) {
                return;
            }
            this.ReplaceRules.push([/-(epub|webkit)-/gm, '']);
            if(sML.UA.Gecko) {
                this.ReplaceRules.push([/text-combine-horizontal\s*:\s*([^;\}]+)\s*([;\}])/gm, 'text-combine-upright: $1$2']);
                this.ReplaceRules.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-upright: all$1']);
                return;
            }
            if(sML.UA.Edge) {
                this.ReplaceRules.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, 'text-combine-horizontal: $2; text-combine-upright: $2$3']);
                this.ReplaceRules.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, 'text-combine-horizontal: all; text-combine-upright: all$1']);
            }
            if(sML.UA.InternetExplorer) {
                this.ReplaceRules.push([/writing-mode\s*:\s*vertical-rl\s*([;\}])/gm,   'writing-mode: tb-rl$1']);
                this.ReplaceRules.push([/writing-mode\s*:\s*vertical-lr\s*([;\}])/gm,   'writing-mode: tb-lr$1']);
                this.ReplaceRules.push([/writing-mode\s*:\s*horizontal-tb\s*([;\}])/gm, 'writing-mode: lr-tb$1']);
                this.ReplaceRules.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/gm, '-ms-text-combine-horizontal: $2$3']);
                this.ReplaceRules.push([/text-combine\s*:\s*horizontal\s*([;\}])/gm, '-ms-text-combine-horizontal: all$1']);
            }
            if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
                this.ReplaceRules.push([/text-align\s*:\s*justify\s*([;\}])/gm, 'text-align: justify; text-justify: inter-ideograph$1']);
            }
        }
    },
    SVG: {
        FileExtensionRE: /\.svg$/,
        ReplaceRules: [
            [/<!--\s+[.\s\S]*?\s+-->/gm, ""]
        ],
        NestingRE: /(<img\s+(?:\w+\s*=\s*["'].*?['"]\s+)*src\s*=\s*["'])(?!(?:https?|data):)(.+?\.svg?)(['"][^>]*>)/g,
        ResAttributesAndExtensions: {
            "href"       : "css",
            "src"        : "gif|png|jpe?g|js",
            "xlink:href" : "gif|png|jpe?g"
        }
    },
    HTML: {
        FileExtensionRE: /\.(xht(ml?)?|xml|html?)$/,
        ReplaceRules: [
            [/<!--\s+[.\s\S]*?\s+-->/gm, ""]
        ],
        NestingRE: /(<iframe\s+(?:\w+\s*=\s*["'].*?['"]\s+)*src\s*=\s*["'])(?!(?:https?|data):)(.+?\.(xhtml|xml|html?))(['"][^>]*>)/g,
        ResAttributesAndExtensions: {
            "href"       : "css",
            "src"        : "gif|png|jpe?g|svg|js|mp[34]|m4[av]|webm",
            "xlink:href" : "gif|png|jpe?g"
        }
    }
};

L.preprocessResources.replaceResourceRefferences = function(FilePath, FileContent, Setting) {
    if(!FileContent || !FilePath || !Setting || !Setting.ResAttributesAndExtensions) return FileContent;
    if(typeof Setting.getResMatchRE != "function") Setting.getResMatchRE = function(At) { return (new RegExp('<\\??[a-zA-Z1-6:\-]+[^>]*? ' + At + '[ \t]*=[ \t]*[\'"](?!(?:https?|data):)([^"]+?)[\'"]', "g")); };
    const FileDir = FilePath.replace(/\/?[^\/]+$/, "");
    for(let Attribute in Setting.ResAttributesAndExtensions) {
        const ResMatchRE = Setting.getResMatchRE(Attribute);
        const ResMatches = FileContent.match(ResMatchRE);
        if(ResMatches) {
            const ExtRE = new RegExp('\.' + Setting.ResAttributesAndExtensions[Attribute] + '$', "i");
            ResMatches.forEach(function(Match) {
                const ResPathInSource = Match.replace(ResMatchRE, "$1");
                const ResPath = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? "./" : "") + ResPathInSource);
                const ResFilePathAndHash = ResPath.split("#");
                const ResFilePath = ResFilePathAndHash[0];
                if(ExtRE.test(ResFilePath)) {
                    if(B.Files[ResFilePath]) {
                        FileContent = FileContent.replace(Match, Match.replace(ResPathInSource, O.getDataURI(ResFilePath, B.Files[ResFilePath]) + (ResFilePathAndHash[1] ? "#" + ResFilePathAndHash[1] : "")));
                    } else {
                        FileContent = FileContent.replace(Match, Match.replace(ResPathInSource, B.Path + "/" + ResPath));
                    }
                }
            });
        }
    }
    return FileContent;
};


L.loadSpread = function(Spread, Param) {
    if(!Param) Param = {};
    return new Promise(function(resolve, reject) {
        Spread.AllowPlaceholderItems = (S["allow-placeholders"] && Param.AllowPlaceholderItems);
        let LoadedItemsInSpread = 0, SkippedItemsInSpread = 0;
        Spread.Items.forEach(function(Item) {
            L.loadItem(Item, {
                AllowPlaceholder: Param.AllowPlaceholderItems
            }).then(function() { // Loaded
                if(++LoadedItemsInSpread                        == Spread.Items.length) resolve(Spread);
            }).catch(function() { // Skipped
                if(++SkippedItemsInSpread + LoadedItemsInSpread == Spread.Items.length)  reject(Spread);
            });
        });
    });
};


L.loadItem = function(Item, Param) { // Don't Call Directly. Use L.loadSpread.
    if(!Param) Param = {};
    const IsPlaceholder = (S["allow-placeholders"] && Item.ItemRef["rendition:layout"] == "pre-paginated" && Param.AllowPlaceholder);
    if(typeof Item.IsPlaceholder != "undefined" && Item.IsPlaceholder == IsPlaceholder) return Promise.reject(Item);
    Item.IsPlaceholder = IsPlaceholder;
    Item.ItemBox.classList.toggle("placeholder", Item.IsPlaceholder);
    if(Item.IsPlaceholder) {
        if(Item.parentElement) {
            Item.parentElement.removeChild(Item);
            Item.src = "";
        }
        Item.HTML = Item.Head = Item.Body = Item.Pages[0];
        return Promise.resolve(Item);
    }
    Item.ItemBox.classList.remove("loaded");
    return new Promise(function(resolve) {
        if(/\.(xhtml|xml|html?)$/i.test(Item.Path)) { // If HTML or Others
            return resolve(B.Files[Item.Path] ? { HTML: B.Files[Item.Path] } : { Src: Item.FullPath });
        }
        if(/\.(svg)$/i.test(Item.Path)) { // If SVG-in-Spine
            const Replacement = [/<\?xml-stylesheet\s*(.+?)\s*\?>/g, '<link rel="stylesheet" $1 />'];
            if(B.Files[Item.Path]) return resolve({ Body: B.Files[Item.Path].replace(Replacement[0], Replacement[1]) });
            return O.download(Item.FullPath).then(function(XHR) { return resolve({ Head: '<base href="' + Item.FullPath + '" />', Body: XHR.responseText.replace(Replacement[0], Replacement[1]) }); });
        }
        if(/\.(gif|jpe?g|png)$/i.test(Item.Path)) { // Bitmap-in-Spine
            return resolve({ Body: [
                '<img alt="" src="' + (B.Files[Item.Path] ? O.getDataURI(Item.Path, B.Files[Item.Path]) : Item.FullPath) + '"',
                ' style="display: block; margin: 0; border: none 0; padding: 0; width: auto; height: auto;"',
                ' />'
            ].join("") });
        }
        if(/\.(pdf)$/i.test(Item.Path)) { // PDF-in-Spine
            return resolve({ Body: [
                '<iframe src="' + (B.Files[Item.Path] ? O.getDataURI(Item.Path, B.Files[Item.Path]) : Item.FullPath) + '" scrolling="no" allowtransparency="true"',
                ' style="display: block; margin: 0; border: none 0; padding: 0; width: 100%; height: 100%;"',
                ' />'
            ].join("") });
        }
        return resolve();
    }).then(function(Param) {
        if(typeof Param != "object") Param = {};
        return new Promise(function(resolve) {
            Item.onLoad = function() {
                resolve(Item);
                Item.removeEventListener("load", Item.onLoad);
                delete Item.onLoad;
            };
            if(Param.Src) {
                Item.src = Param.Src;
                Item.addEventListener("load", Item.onLoad);
                Item.ItemBox.insertBefore(Item, Item.ItemBox.firstChild);
            } else {
                Item.src = "";
                Item.ItemBox.insertBefore(Item, Item.ItemBox.firstChild);
                if(typeof Param.HTML == "string") {
                    Item.contentDocument.open();
                    Item.contentDocument.write(Param.HTML.replace(/^<\?.+?\?>/, ""));
                    Item.contentDocument.close();
                    setTimeout(Item.onLoad, 0);
                } else {
                    const onLoad = "parent.R.Items[" + Item.ItemIndex + "].onLoad(); document.body.removeAttribute('onload'); return false;";
                    const Style = "margin: 0; border: none 0; padding: 0;";
                    Item.contentDocument.open();
                    Item.contentDocument.write([
                        '<!DOCTYPE html>' + "\n",
                        '<html style="' + Style + '">',
                            '<head>' + (typeof Param.Head == "string" ? Param.Head : '') + '</head>',
                            '<body style="' + Style + '" onload="' + onLoad + '">' + (typeof Param.Body == "string" ? Param.Body : '') + '</body>',
                        '</html>'
                    ].join(""));
                    Item.contentDocument.close();
                }
            }
        });
    }).then(L.postprocessItem).then(function() {
        Item.Loaded = true;
        Item.ItemBox.classList.add("loaded");
        E.dispatch("bibi:loaded-item", Item);
        Item.stamp("Loaded");
        return Item;
    });
};


L.postprocessItem = function(Item) {

    Item.HTML = Item.contentDocument.documentElement;
    Item.Head = Item.contentDocument.head;
    Item.Body = Item.contentDocument.body;
    Item.HTML.Item = Item.Head.Item = Item.Body.Item = Item;

    if(Item.IsPlaceholder) return Promise.resolve(Item);

    Item.stamp("Postprocess");

    const XMLLang = Item.HTML.getAttribute("xml:lang"), Lang = Item.HTML.getAttribute("lang");
         if(!XMLLang && !Lang) Item.HTML.setAttribute("xml:lang", B.Language), Item.HTML.setAttribute("lang", B.Language);
    else if(!XMLLang         ) Item.HTML.setAttribute("xml:lang", Lang);
    else if(            !Lang)                                                 Item.HTML.setAttribute("lang", XMLLang);

    O.forEach(Item.Body.querySelectorAll("link"), function(Link) { Item.Head.appendChild(Link); });

    sML.CSS.appendRule("html", "-webkit-text-size-adjust: 100%;", Item.contentDocument);

    if(sML.UA.InternetExplorer) {
        O.forEach(Item.Body.getElementsByTagName("svg"), function(SVG) {
            const ChildImages = SVG.getElementsByTagName("image");
            if(ChildImages.length == 1) {
                const ChildImage = ChildImages[0];
                if(ChildImage.getAttribute("width") && ChildImage.getAttribute("height")) {
                    SVG.setAttribute("width",  ChildImage.getAttribute("width"));
                    SVG.setAttribute("height", ChildImage.getAttribute("height"));
                }
            }
        });
    }

    Item.contentDocument.addEventListener("wheel", R.Main.onWheeled, { capture: true, passive: false });

    I.observeTap(Item.HTML);
    Item.HTML.addTapEventListener("tap",         R.onTap);
    Item.HTML.addEventListener(O["pointermove"], R.onPointerMove);
    Item.HTML.addEventListener(O["pointerdown"], R.onPointerDown);
    Item.HTML.addEventListener(O["pointerup"],   R.onPointerUp);

    L.coordinateLinkages(Item.Path, Item.Body);

    sML.Environments.forEach(function(EnvironmentClassName) { Item.HTML.classList.add(EnvironmentClassName); });

    const Elements = Item.contentDocument.querySelectorAll("body>*");
    if(Elements && Elements.length) {
        let LengthOfElements = 0;
        for(let l = Elements.length, i = 0; i < l; i++) if(!/^(script|style)$/i.test(Elements[i].tagName)) LengthOfElements++;
        if(LengthOfElements == 1) {
            if(/^svg$/i.test(Item.Body.firstElementChild.tagName)) {
                Item.Outsourcing = true;
                Item.ImageItem = true;
                Item.SingleSVGOnlyItem = true;
            } else if(/^img$/i.test(Item.Body.firstElementChild.tagName)) {
                Item.Outsourcing = true;
                Item.ImageItem = true;
                Item.SingleIMGOnlyItem = true;
            } else if(/^iframe$/i.test(Item.Body.firstElementChild.tagName)) {
                Item.Outsourcing = true;
                Item.FrameItem = true;
                Item.SingleFrameOnlyItem = true;
            } else if(!O.getElementInnerText(Item.Body)) {
                if(Item.Body.querySelectorAll("img, svg, video, audio").length - Item.Body.querySelectorAll("svg img, video img, audio img").length == 1) {
                    Item.Outsourcing = true;
                    Item.ImageItem = true;
                } else if(Item.Body.getElementsByTagName("iframe").length == 1) {
                    Item.Outsourcing = true;
                    Item.FrameItem = true;
                }
            }
        }
    }

    return new Promise(function(resolve) {
        if(Item.ItemRef["rendition:layout"] == "pre-paginated") {
            resolve();
        } else {
            L.patchItemStyles(Item).then(resolve);
        }
    }).then(function() {
        if(S["epub-additional-stylesheet"]) Item.Head.appendChild(sML.create("link",   { rel: "stylesheet", href: S["epub-additional-stylesheet"] }));
        if(S["epub-additional-script"])     Item.Head.appendChild(sML.create("script", { src: S["epub-additional-script"] }));
        E.dispatch("bibi:postprocessed-item", Item);
        Item.stamp("Postprocessed");
        return Item;
    });

};


L.patchItemStyles = function(Item) { // All processes are only for reflowable.

    return new Promise(function(resolve) {
        Item.StyleSheets = [];
        Item.Head.insertBefore(sML.create("link", { rel: "stylesheet", href: O.RootPath + "res/styles/bibi-default.css" }), Item.HTML.querySelector("link, style"));
        O.forEach(Item.HTML.querySelectorAll("link, style"), function(SSEle) {
            if(/^link$/i.test(SSEle.tagName)) {
                if(!/^(alternate )?stylesheet$/.test(SSEle.rel)) return;
                if((sML.UA.Safari || sML.OS.iOS) && SSEle.rel == "alternate stylesheet") return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
            }
            Item.StyleSheets.push(SSEle);
        });
        const checkCSSLoadingAndResolve = function() {
            if(Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return false;
            clearInterval(Item.CSSLoadingTimerID);
            delete Item.CSSLoadingTimerID;
            resolve();
            return true;
        };
        if(!checkCSSLoadingAndResolve()) Item.CSSLoadingTimerID = setInterval(checkCSSLoadingAndResolve, 100);
    }).then(function() {
        if(!L.Preprocessed) {
            if(B.Package.Metadata["ebpaj:guide-version"]) {
                const Versions = B.Package.Metadata["ebpaj:guide-version"].split(".");
                if(Versions[0] * 1 == 1 && Versions[1] * 1 == 1 && Versions[2] * 1 <=3) Item.Body.style.textUnderlinePosition = "under left";
            }
            if(sML.UA.InternetExplorer) {
                //if(!B.Unzipped) return false;
                const IsCJK = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language);
                O.editCSSRules(Item.contentDocument, function(CSSRule) {
                    if(/(-(epub|webkit)-)?column-count: 1; /.test(CSSRule.cssText)) CSSRule.style.columnCount = CSSRule.style.msColumnCount = "auto";
                    if(/(-(epub|webkit)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "tb-rl";
                    if(/(-(epub|webkit)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "tb-lr";
                    if(/(-(epub|webkit)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = "lr-tb";
                    if(/(-(epub|webkit)-)?(text-combine-upright|text-combine-horizontal): all; /.test(CSSRule.cssText)) CSSRule.style.msTextCombineHorizontal = "all";
                    if(IsCJK && / text-align: justify; /.test(CSSRule.cssText)) CSSRule.style.textJustify = "inter-ideograph";
                });
            } else {
                O.editCSSRules(Item.contentDocument, function(CSSRule) {
                    if(/(-(epub|webkit)-)?column-count: 1; /.test(CSSRule.cssText)) CSSRule.style.columnCount = CSSRule.style.webkitColumnCount = "auto";
                });
            }
        }
        const ItemHTMLComputedStyle = getComputedStyle(Item.HTML);
        const ItemBodyComputedStyle = getComputedStyle(Item.Body);
        if(ItemHTMLComputedStyle[O.WritingModeProperty] != ItemBodyComputedStyle[O.WritingModeProperty]) {
            sML.style(Item.HTML, {
                "writing-mode": ItemBodyComputedStyle[O.WritingModeProperty]
            });
        }
        Item.HTML.WritingMode = O.getWritingMode(Item.HTML);
             if(/-rl$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
        else if(/-lr$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
        else                                        if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
        [
            [Item.ItemBox, ItemHTMLComputedStyle, Item.HTML],
            [Item,         ItemBodyComputedStyle, Item.Body]
        ].forEach(function(Par) {
            [
                "backgroundColor",
                "backgroundImage",
                "backgroundRepeat",
                "backgroundPosition",
                "backgroundSize"
            ].forEach(function(Pro) {
                Par[0].style[Pro] = Par[1][Pro];
            });
            Par[2].style.background = "transparent";
        });
        O.forEach(Item.Body.querySelectorAll("svg, img"), function(Img) {
            Img.BibiDefaultStyle = {
                width: (Img.style.width ? Img.style.width : ""),
                height: (Img.style.height ? Img.style.height : ""),
                maxWidth: (Img.style.maxWidth ? Img.style.maxWidth : ""),
                maxHeight: (Img.style.maxHeight ? Img.style.maxHeight : "")
            };
        });
    });

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Reader

//----------------------------------------------------------------------------------------------------------------------------------------------


____.R = {}; // Bibi.Reader


R.initialize = function() {

    R.Main      = O.Body.insertBefore(sML.create("div", { id: "bibi-main", Transformation: { Scale: 1, Translation: { X: 0, Y: 0 } } }), O.Body.firstElementChild);
    R.Sub       = O.Body.insertBefore(sML.create("div", { id: "bibi-sub" }),  R.Main.nextSibling);
    R.Main.Book =  R.Main.appendChild(sML.create("div", { id: "bibi-main-book" }));

    R.Main.onWheeled = function(Eve) {
        Eve.preventDefault();
        Eve.stopPropagation();
        if(S.RVM == "paged") return R.onWheel(Eve);
        R.Main.scrollLeft = R.Main.scrollLeft + Eve.deltaX;
        R.Main.scrollTop  = R.Main.scrollTop  + Eve.deltaY;
    };

    R.Main.addEventListener("wheel", R.Main.onWheeled, { capture: true, passive: false });

    //R.reset();

    E.add("bibi:scrolled", function() {
        R.getCurrent();
        clearTimeout(R.Timer_Scrolling);
        if(!R.Current.Page) return;
        R.Timer_Scrolling = setTimeout(function() {
            if(S["allow-placeholders"]) R.turnSpreadsOnDemand();
            if(S["use-cookie"]) {
                O.Cookie.eat(B.ID, {
                    "Position": {
                        SpreadIndex: R.Current.Pages.StartPage.Spread.SpreadIndex,
                        PageProgressInSpread: R.Current.Pages.StartPage.PageIndexInSpread / R.Current.Pages.StartPage.Spread.Pages.length
                    }
                });
            }
        }, 222);
    });

    E.add("bibi:resized", function() {
        R.layOut({
            Reset: true,
            Setting: (Option && Option.Setting ? Option.Setting : undefined)
        });
    });

    I.observeTap(O.HTML);

    O.HTML.addTapEventListener("tap",         R.onTap);
    O.HTML.addEventListener(O["pointermove"], R.onPointerMove);
    O.HTML.addEventListener(O["pointerdown"], R.onPointerDown);
    O.HTML.addEventListener(O["pointerup"],   R.onPointerUp);

    E.add("bibi:tapped", function(Eve) {
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(BibiEvent.Coord.Y < I.Menu.offsetHeight) return false;
        switch(S.RVM) {
            case "horizontal": if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false; else break;
            case "vertical":   if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false; else break;
        }
        if(BibiEvent.Target.tagName) {
            if(I.Slider && (I.Slider.contains(BibiEvent.Target) || BibiEvent.Target == I.Slider)) return false;
            if(O.isAnchorContent(BibiEvent.Target)) return false;
        }
        switch(S.ARD) {
            case "ttb": return (BibiEvent.Division.Y == "middle") ? E.dispatch("bibi:tapped-center", Eve) : false;
            default   : return (BibiEvent.Division.X == "center") ? E.dispatch("bibi:tapped-center", Eve) : false;
        }
    });

    E.add("bibi:tapped-center", function(Eve) {
        if(I.SubPanel) E.dispatch("bibi:closes-utilities",  Eve);
        else           E.dispatch("bibi:toggles-utilities", Eve);
    });

};


R.reset = function() {
    R.Started = false;
    R.Spreads = [], R.Items = [], R.Pages = [];
    R.AllItems = [], R.NonLinearItems = [];
    R.CoverImage = { Path: "" };
    R.Current = {};
    R.Past = {};
    R.Main.Book.innerHTML = R.Sub.innerHTML = "";
};


R.resetStage = function() {
    const WIH = window.innerHeight;
    O.HTML.style.height = O.Body.style.height = WIH + "px"; // for In-App Browsers
    try {  I.Veil.style.height = WIH + "px"; } catch(Err) {}
    try { I.Panel.style.height = WIH + "px"; } catch(Err) {}
    R.Stage = {};
    R.Columned = false;
    R.Main.style.padding = R.Main.style.width = R.Main.style.height = "";
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = "";
    R.Main.Book.style[S.CC.A.SIZE.l] = "";
    R.Main.Book.style[S.CC.A.SIZE.b] = S.RVM == "paged" && O.Scrollbars[S.CC.A.SIZE.B] ? "calc(100% - " + O.Scrollbars[S.CC.A.SIZE.B] + "px)" : "";
    R.Stage.Width  = O.Body.clientWidth;
    R.Stage.Height = WIH;
    R.Stage[S.CC.A.SIZE.B] -= O.Scrollbars[S.CC.A.SIZE.B] + S["spread-margin"] * 2;
    window.scrollTo(0, 0);
    if(S["use-full-height"]) {
        O.HTML.classList.add("book-full-height");
    } else {
        O.HTML.classList.remove("book-full-height");
        R.Stage.Height -= I.Menu.offsetHeight;
    }
    if(S.RVM == "paged") {
        R.Stage.PageGap = 0;
    } else {
        R.Stage.PageGap = S["spread-gap"];
        R.Main.Book.style["padding" + S.CC.L.BASE.S] = R.Main.Book.style["padding" + S.CC.L.BASE.E] = S["spread-margin"] + "px";
    }
    R.Main.Book.style["background"] = S["book-background"] ? S["book-background"] : "";
};

R.layOutSpread = function(Spread) { const SpreadBox = Spread.SpreadBox;
    E.dispatch("bibi:is-going-to:reset-spread", Spread);
    Spread.style.width = Spread.style.height = "";
    SpreadBox.classList.remove("spreaded", "not-spreaded", "horizontal-items", "vertical-items");
    Spread.Pages = [];
    Spread.Items.forEach(function(Item) {
        R.layOutItem(Item);
        Item.Pages.forEach(function(Page) {
            Page.PageIndexInSpread = Spread.Pages.length;
            Spread.Pages.push(Page);
        });
    });
    Spread.Spreaded = (Spread.Items[0].Spreaded || (Spread.Items[1] && Spread.Items[1].Spreaded)) ? true : false;
    if(Spread.Spreaded) SpreadBox.classList.add(    "spreaded",                                     "horizontal-items");
    else                SpreadBox.classList.add("not-spreaded", (S.RVM == "vertical" ? "vertical" : "horizontal") + "-items");
    const SpreadSize = { Width: 0, Height: 0 };
    if(Spread.Items.length == 1) {
        // Single Reflowable/Pre-Paginated Item
        SpreadSize.Width  = Spread.Items[0].ItemBox.offsetWidth;
        SpreadSize.Height = Spread.Items[0].ItemBox.offsetHeight;
        if(Spread.Spreaded && Spread.Items[0].ItemRef["rendition:layout"] == "pre-paginated" && /^(left|right)$/.test(Spread.Items[0].ItemRef["page-spread"])) {
            // Single Pre-Paginated Spreaded Left/Right Item
            SpreadSize.Width *= 2;
        }
    } else if(Spread.Items[0].ItemRef["rendition:layout"] == "pre-paginated" && Spread.Items[1].ItemRef["rendition:layout"] == "pre-paginated") {
        // Paired Pre-Paginated Items
        if(Spread.Spreaded || S.RVM != "vertical") {
            SpreadSize.Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
            SpreadSize.Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.offsetHeight);
        } else {
            SpreadSize.Width  = Math.max(Spread.Items[0].ItemBox.offsetWidth,   Spread.Items[1].ItemBox.offsetWidth);
            SpreadSize.Height =          Spread.Items[0].ItemBox.offsetHeight + Spread.Items[1].ItemBox.offsetHeight;
        }
    } else {
        // Paired Mixed Items
        if(R.Stage.Width > Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth) {
            // horizontal layout
            console.log("---------------------------------------- Mixed:A");
            SpreadSize.Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
            SpreadSize.Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight);
        } else {
            // vertical layout
            console.log("---------------------------------------- Mixed:B");
            SpreadSize.Width  = Math.max(Spread.Items[0].ItemBox.offsetWidth,   Spread.Items[1].ItemBox.offsetWidth);
            SpreadSize.Height =          Spread.Items[0].ItemBox.offsetHeight + Spread.Items[1].ItemBox.offsetHeight;
        }
        console.log(Spread);
    }
    if(O.Scrollbars.Height && S.SLA == "vertical" && S.ARA != "vertical") {
        SpreadBox.style.minHeight    = S.RVM == "paged"                           ? "calc(100vh - " + O.Scrollbars.Height + "px)" : "";
        SpreadBox.style.marginBottom = Spread.SpreadIndex == R.Spreads.length - 1 ? O.Scrollbars.Height + "px"                    : "";
    } else {
        SpreadBox.style.minHeight = SpreadBox.style.marginBottom = ""
    }
    SpreadBox.style[S.CC.L.SIZE.l] = Math.ceil(SpreadSize[S.CC.L.SIZE.L]) + "px";
    SpreadBox.style[S.CC.L.SIZE.b] = "";
    Spread.style.width  = Math.ceil(SpreadSize.Width) + "px";
    Spread.style.height = Math.ceil(SpreadSize.Height) + "px";
    Spread.style["border-radius"] = S["spread-border-radius"];
    Spread.style["box-shadow"]    = S["spread-box-shadow"];
    E.dispatch("bibi:reset-spread", Spread);
    return Spread;
};

R.layOutItem = function(Item) {
    O.stamp("Reset...", Item.TimeCard);
    E.dispatch("bibi:is-going-to:reset-item", Item);
    Item.Scale = 1;
    Item.ItemBox.style.width = Item.ItemBox.style.height = Item.style.width = Item.style.height = "";
    (Item.ItemRef["rendition:layout"] != "pre-paginated") ? R.renderReflowableItem(Item) : R.renderPrePaginatedItem(Item);
    E.dispatch("bibi:reset-item", Item);
    O.stamp("Reset.", Item.TimeCard);
    return Item;
};

R.renderReflowableItem = function(Item) {
    let PageCB  = R.Stage[S.CC.L.SIZE.B] - (S["item-padding-" + S.CC.L.BASE.s] + S["item-padding-" + S.CC.L.BASE.e]); // Page "C"ontent "B"readth
    let PageCL  = R.Stage[S.CC.L.SIZE.L] - (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]); // Page "C"ontent "L"ength
    let PageGap = R.Stage.PageGap        + (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]);
    ["b","a","s","e"].forEach(function(base) { const trbl = S.CC.L.BASE[base]; Item.style["padding-" + trbl] = S["item-padding-" + trbl] + "px"; });
    Item.HTML.classList.remove("bibi-columned");
    Item.HTML.style.width = Item.HTML.style.height = "";
    sML.style(Item.HTML, { "column-fill": "", "column-width": "", "column-gap": "", "column-rule": "" });
    if(!S["single-page-always"] && /-tb$/.test(Item.HTML.WritingMode) && S.SLA == "horizontal") {
        const HalfL = Math.floor((PageCL - PageGap) / 2);
        if(HalfL >= Math.floor(PageCB * S["orientation-border-ratio"] / 2)) PageCL = HalfL;
    }
    Item.style[S.CC.L.SIZE.b] = PageCB + "px";
    Item.style[S.CC.L.SIZE.l] = PageCL + "px";
    const WordWrappingStyleSheetIndex = sML.CSS.appendRule("*", "word-wrap: break-word;", Item.contentDocument); ////
    O.forEach(Item.Body.querySelectorAll("img, svg"), function(Img) {
        // Fit Image Size
        if(!Img.BibiDefaultStyle) return;
        ["width", "height", "maxWidth", "maxHeight"].forEach(function(Pro) { Img.style[Pro] = Img.BibiDefaultStyle[Pro]; });
        if(S.RVM == "horizontal" && /-(rl|lr)$/.test(Item.HTML.WritingMode) || S.RVM == "vertical" && /-tb$/.test(Item.HTML.WritingMode)) return;
        const B = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]), MaxB = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.b]), PageCB));
        const L = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.l]), MaxL = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.l]), PageCL));
        if(B > MaxB || L > MaxL) {
            Img.style[S.CC.L.SIZE.b] = Math.floor(parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]) * Math.min(MaxB / B, MaxL / L)) + "px";
            Img.style[S.CC.L.SIZE.l] = "auto";
            Img.style.maxWidth = "100vw";
            Img.style.maxHeight = "100vh";
        }
    });
    Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
    if(!Item.Outsourcing && (S.RVM == "paged" || Item.HTML["offset"+ S.CC.L.SIZE.B] > PageCB)) {
        // Columify
        R.Columned = Item.Columned = true, Item.ColumnBreadth = PageCB, Item.ColumnLength = PageCL, Item.ColumnGap = PageGap;
        Item.HTML.classList.add("bibi-columned");
        Item.HTML.style[S.CC.L.SIZE.b] = PageCB + "px";
        Item.HTML.style[S.CC.L.SIZE.l] = PageCL + "px";
        sML.style(Item.HTML, {
            "column-fill": "auto",
            "column-width": Item.ColumnLength + "px",
            "column-gap": Item.ColumnGap + "px",
            "column-rule": ""
        });
    }
    sML.deleteStyleRule(WordWrappingStyleSheetIndex, Item.contentDocument); ////
    let ItemL = sML.UA.InternetExplorer ? Item.Body["client" + S.CC.L.SIZE.L] : Item.HTML["scroll" + S.CC.L.SIZE.L];
    const HowManyPages = Math.ceil((ItemL + PageGap) / (PageCL + PageGap));
    ItemL = (PageCL + PageGap) * HowManyPages - PageGap;
    Item.style[S.CC.L.SIZE.l] = ItemL + "px";
    if(sML.UA.InternetExplorer) Item.HTML.style[S.CC.L.SIZE.l] = "100%";
    let ItemBoxB = PageCB + (S["item-padding-" + S.CC.L.BASE.s] + S["item-padding-" + S.CC.L.BASE.e]);
    let ItemBoxL = ItemL  + (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]);// + ((S.RVM == "paged" && Item.Spreaded && HowManyPages % 2) ? (PageGap + PageCL) : 0);
    Item.ItemBox.style[S.CC.L.SIZE.b] = ItemBoxB + "px";
    Item.ItemBox.style[S.CC.L.SIZE.l] = ItemBoxL + "px";
    Item.Pages.forEach(function(Page) { Item.ItemBox.removeChild(Page); });
    Item.Pages = [];
    const PageL = ItemBoxL / HowManyPages;
    for(let i = 0; i < HowManyPages; i++) {
        const Page = Item.ItemBox.appendChild(sML.create("span", { className: "page" }));
        Page.style[S.CC.L.SIZE.l] = PageL + "px";
        Page.Item = Item, Page.Spread = Item.Spread;
        Page.PageIndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
    }
    return Item;
};

R.renderPrePaginatedItem = function(Item) {
    Item.style.visibility = Item.IsPlaceholder ? "hidden" : "";
    sML.style(Item, { "transform-origin": "", "transformOrigin": "", "transform": "" });
    let StageB = R.Stage[S.CC.L.SIZE.B];
    let StageL = R.Stage[S.CC.L.SIZE.L];
    Item.Spreaded = (
        (S.RVM == "paged" || !S["full-breadth-layout-in-scroll"])
            &&
        (Item.ItemRef["rendition:spread"] == "both" || R.Orientation == Item.ItemRef["rendition:spread"] || R.Orientation == "landscape")
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
            if(PairItem.ItemIndex > Item.ItemIndex) LoBaseItem =     Item, LoBaseItemLoVp =     ItemLoVp, LoPairItem = PairItem, LoPairItemLoVp = PairItemLoVp;
            else                                    LoBaseItem = PairItem, LoBaseItemLoVp = PairItemLoVp, LoPairItem =     Item, LoPairItemLoVp =     ItemLoVp;
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
                Width:  ItemLoVp.Width * (/^(left|right)$/.test(Item.ItemRef["page-spread"]) ? 2 : 1),
                Height: ItemLoVp.Height
            };
            Item.Scale = Math.min(
                StageB / SpreadViewPort[S.CC.L.SIZE.B],
                StageL / SpreadViewPort[S.CC.L.SIZE.L]
            );
        }
    } else {
        ItemLoVp = R.getItemLayoutViewport(Item);
        if(S.RVM == "paged" || !S["full-breadth-layout-in-scroll"]) {
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
    Item.ItemBox.style[S.CC.L.SIZE.l] = PageL + "px";
    Item.ItemBox.style[S.CC.L.SIZE.b] = PageB + "px";
    sML.style(Item, {
        "width":  ItemLoVp.Width + "px",
        "height": ItemLoVp.Height + "px",
        "transformOrigin": "0 0",
        "transform": "scale(" + Item.Scale + ")"
    });
    return Item;
};

R.getItemViewport = function(Item) {
    if(!Item.IsPlaceholder) {
        const ViewportMeta = Item.Head.querySelector('meta[name="viewport"]');
        if(ViewportMeta)           return O.getViewportByMetaContentString(ViewportMeta.getAttribute("content"));
        if(Item.SingleSVGOnlyItem) return O.getViewportByViewBoxString(Item.Body.firstElementChild.getAttribute("viewBox")); // for Item of SVGs-in-Spine, or Fixed-Layout Item including SVG without Viewport
        if(Item.SingleIMGOnlyItem) return O.getViewportByImage(Item.Body.firstElementChild); // for Item of Bitmaps-in-Spine
    }
    return null;
};

R.getItemLayoutViewport = function(Item) {
    if(Item.Viewport) return Item.Viewport;
    if(B.ICBViewport) return B.ICBViewport;
    return {
        Width:  R.Stage.Height * S["orientation-border-ratio"] / (Item.Spreaded && /^(left|right)$/.test(Item.ItemRef["page-spread"]) ? 2 : 1),
        Height: R.Stage.Height
    };
};


R.turnSpread = function(Spread, TF) {
    const AllowPlaceholderItems = !(TF);
    return new Promise(function(resolve) {
        if(!S["allow-placeholders"] || Spread.AllowPlaceholderItems == AllowPlaceholderItems) return resolve(Spread); // no need to turn
        const PreviousSpreadBoxLength = Spread.SpreadBox["offset" + S.CC.L.SIZE.L];
        L.loadSpread(Spread, { AllowPlaceholderItems: AllowPlaceholderItems }).then(function(Spread) {
            resolve(Spread); // ←↙ do asynchronous
            R.layOutSpread(Spread);
            const ChangedSpreadBoxLength = Spread.SpreadBox["offset" + S.CC.L.SIZE.L] - PreviousSpreadBoxLength;
            if(ChangedSpreadBoxLength != 0) R.Main.Book.style[S.CC.L.SIZE.l] = (parseFloat(getComputedStyle(R.Main.Book)[S.CC.L.SIZE.l]) + ChangedSpreadBoxLength) + "px";
        }).catch(function(Spread) {
            resolve(Spread);
        });
    });
};

R.turnSpreads = function(Spreads, TF) {
    let TurnedSpreads = 0;
    return new Promise(function(resolve) {
        Spreads.forEach(function(Spread) {
            R.turnSpread(Spread, TF).then(function() {
                if(++TurnedSpreads == Spreads.length) resolve(Spreads);
            });
        });
    });
};

R.SpreadsTurnedFaceUp = [];
R.SpreadsToBeTurnedBack = [];

R.turnSpreadsOnDemand = function() {
    return new Promise(function(resolve) {
        const CurrentSpreadIndex = R.Current.Page.Spread.SpreadIndex;
        const SpreadsToBeTurnedFaceUp = [R.Spreads[CurrentSpreadIndex]];
        const DistanceToTheNext = R.Past.Page && R.Past.Page.PageIndex > R.Current.Page.PageIndex ? -1 : 1;
        for(let i = 1; i <= 2; i++) if(R.Spreads[CurrentSpreadIndex + DistanceToTheNext * i]) SpreadsToBeTurnedFaceUp.push(R.Spreads[CurrentSpreadIndex + DistanceToTheNext * i]); else break;
        for(let i = 1; i <= 1; i++) if(R.Spreads[CurrentSpreadIndex - DistanceToTheNext * i]) SpreadsToBeTurnedFaceUp.push(R.Spreads[CurrentSpreadIndex - DistanceToTheNext * i]); else break;
        R.turnSpreads(SpreadsToBeTurnedFaceUp, true).then(resolve);
        R.SpreadsTurnedFaceUp = R.SpreadsTurnedFaceUp.filter(function(SpreadTurnedFaceUp) { return !SpreadsToBeTurnedFaceUp.includes(SpreadTurnedFaceUp); }).concat(SpreadsToBeTurnedFaceUp);
        while(R.SpreadsTurnedFaceUp.length > 10) R.SpreadsToBeTurnedBack.push(R.SpreadsTurnedFaceUp.shift());
        R.SpreadsToBeTurnedBack = R.SpreadsToBeTurnedBack.filter(function(SpreadToBeTurnedBack) { return !R.SpreadsTurnedFaceUp.includes(SpreadToBeTurnedBack); });
        clearTimeout(R.Timer_turnSpreadsBack);
        R.Timer_turnSpreadsBack = setTimeout(function() {
            R.turnSpreads(R.SpreadsToBeTurnedBack, false).then(function() { R.SpreadsToBeTurnedBack = []; });
        }, 123);
    });
};


R.organizePages = function() {
    R.Pages = [];
    R.Spreads.forEach(function(Spread) {
        Spread.Pages.forEach(function(Page) {
            Page.PageIndex = R.Pages.length; R.Pages.push(Page);
            Page.id = "page-" + sML.String.pad(Page.PageIndex + 1, 0, B.FileDigit);
        });
    });
    return R.Pages;
};


R.layOutStage = function() {
    //E.dispatch("bibi:is-going-to:lay-out-stage");
    let MainContentLayoutLength = 0;
    R.Spreads.forEach(function(Spread) {
        MainContentLayoutLength += Spread.SpreadBox["offset" + S.CC.L.SIZE.L];
    });
    MainContentLayoutLength += R.Stage.PageGap * (R.Spreads.length - 1);
    R.Main.Book.style[S.CC.L.SIZE.l] = MainContentLayoutLength + "px";
    //E.dispatch("bibi:laid-out-stage");
};


R.layOut = function(Opt) {
    /*
        Opt: {
            Destination: BibiDestination,
            Reset: Boolean,
            Setting: BibiSetting (Optional),
            before: Function (Optional)
        }
    */
    if(!Opt) Opt = {};
    if(R.LayingOut) return Promise.reject();
    return new Promise(function(resolve) {
        R.LayingOut = true;
        O.log('Laying out...', "<g:>");
        E.dispatch("bibi:closes-utilities");
        E.dispatch("bibi:is-going-to:lay-out", Opt);
        window.removeEventListener(O["resize"], R.onresize);
        R.Main.removeEventListener("scroll", R.onscroll);
        O.Busy = true;
        O.HTML.classList.add("busy");
        O.HTML.classList.add("laying-out");
        if(!Opt.NoNotification) I.note('Laying out...');
        if(!Opt.Destination) {
            R.getCurrent();
            const CurrentPage = R.Current.Pages.StartPage;
            Opt.Destination = {
                SpreadIndex: CurrentPage.Spread.SpreadIndex,
                PageProgressInSpread: CurrentPage.PageIndexInSpread / CurrentPage.Spread.Pages.length
            }
        }
        if(Opt.Setting) S.update(Opt.Setting);
        ['reader-view-mode', 'spread-layout-direction', 'apparent-reading-direction'].forEach(function(Pro) { O.log(Pro + ': ' + S[Pro]); });
        if(typeof Opt.before == "function") Opt.before();
        if(Opt.Reset) {
            R.resetStage();
            R.Spreads.forEach(function(Spread) { R.layOutSpread(Spread); });
            R.organizePages();
            R.layOutStage();
        }
        R.focusOn({ Destination: Opt.Destination, Duration: 0 });
        resolve();
    }).then(function() {
        O.Busy = false;
        O.HTML.classList.remove("busy");
        O.HTML.classList.remove("laying-out");
        if(!Opt.NoNotification) I.note('');
        window.addEventListener(O["resize"], R.onresize);
        R.Main.addEventListener("scroll", R.onscroll);
        R.LayingOut = false;
        E.dispatch("bibi:laid-out");
        O.log('Laid out.', "</g>");
        R.getCurrent();
    });
};

R.updateOrientation = function() {
    const PreviousOrientation = R.Orientation;
    if(typeof window.orientation != "undefined") {
        R.Orientation = (window.orientation == 0 || window.orientation == 180) ? "portrait" : "landscape";
    } else {
        const W = window.innerWidth  - (S.ARA == "vertical"   ? O.Scrollbars.Width  : 0);
        const H = window.innerHeight - (S.ARA == "horizontal" ? O.Scrollbars.Height : 0);
        R.Orientation = (W / H) < S["orientation-border-ratio"] ? "portrait" : "landscape";
    }
    if(R.Orientation != PreviousOrientation) {
        if(PreviousOrientation) E.dispatch("bibi:changes-orientation", R.Orientation);
        O.HTML.classList.remove("orientation-" + PreviousOrientation);
        O.HTML.classList.add("orientation-" + R.Orientation);
        if(PreviousOrientation) E.dispatch("bibi:changed-orientation", R.Orientation);
    }
};

R.onscroll = function(Eve) {
    if(!L.Opened) return;
    if(!R.Scrolling) {
        O.HTML.classList.add("scrolling");
        R.Scrolling = true;
        Eve.BibiScrollingBegun = true;
    }
    E.dispatch("bibi:scrolls", Eve);
    clearTimeout(R.Timer_onscrolled);
    R.Timer_onscrolled = setTimeout(function() {
        R.Scrolling = false;
        O.HTML.classList.remove("scrolling");
        E.dispatch("bibi:scrolled", Eve);
    }, 123);
};

R.onresize = function(Eve) {
    if(!L.Opened) return;
    if(!R.Resizing) O.HTML.classList.add("resizing");
    R.Resizing = true;
    E.dispatch("bibi:resizes", Eve);
    clearTimeout(R.Timer_afterresized);
    clearTimeout(R.Timer_onresized);
    R.Timer_onresized = setTimeout(function() {
        O.Busy = true;
        O.HTML.classList.add("busy");
        R.updateOrientation();
        R.Timer_afterresized = setTimeout(function() {
            E.dispatch("bibi:resized", Eve);
            O.Busy = false;
            R.Resizing = false;
            O.HTML.classList.remove("busy");
            O.HTML.classList.remove("resizing");
        }, 100);
    }, O.Touch ? 444 : 222);
};

R.onTap = function(Eve) {
    E.dispatch("bibi:taps",   Eve);
    E.dispatch("bibi:tapped", Eve);
}

R.onPointerDown = function(Eve) {
    E.dispatch("bibi:downs-pointer",  Eve);
    R.PointerIsDowned = true;
    E.dispatch("bibi:downed-pointer", Eve);
};

R.onPointerUp = function(Eve) {
    E.dispatch("bibi:ups-pointer",   Eve);
    R.PointerIsDowned = false;
    E.dispatch("bibi:upped-pointer", Eve);
};

R.onPointerMove = function(Eve) {
    const CC = O.getBibiEventCoord(Eve), PC = R.onPointerMove.PreviousCoord;
    if(PC.X != CC.X || PC.Y != CC.Y) E.dispatch("bibi:moved-pointer",   Eve);
    else                             E.dispatch("bibi:stopped-pointer", Eve);
    R.onPointerMove.PreviousCoord = CC;
    //Eve.preventDefault();
    Eve.stopPropagation();
};
R.onPointerMove.PreviousCoord = { X:0, Y:0 };

R.onWheel = function(Eve) {
    Eve.preventDefault();
    const WA /* WheelAxis */ = Math.abs(Eve.deltaX) > Math.abs(Eve.deltaY) ? "X" : "Y";
    if(R.onWheel.PreviousWheels.length && R.onWheel.PreviousWheels[R.onWheel.PreviousWheels.length - 1].Axis != WA) R.onWheel.PreviousWheels = [];
    const CW = {}, PWs = R.onWheel.PreviousWheels, PWl = PWs.length;
    CW.Axis = WA;
    CW.Distance = (Eve["delta" + WA] < 0 ? -1 : 1) * (WA == "X" && S.ARD == "rtl" ? -1 : 1);
    CW.Delta = { X: 0, Y: 0 }, CW.Delta[WA] = Math.abs(Eve["delta" + WA]);
    if(!PWs[PWl - 1]) {
        CW.Accel = 1, CW.Wheeled = "start";
    } else if(CW.Distance != PWs[PWl - 1].Distance) {
        CW.Accel = 1;
        if(PWl >= 3 && PWs[PWl - 2].Distance != CW.Distance && PWs[PWl - 3].Distance != CW.Distance) CW.Wheeled = "reverse";
    } else if(CW.Delta[WA] > PWs[PWl - 1].Delta[WA]) {
        CW.Accel =  1;
        if(PWl >= 3 && PWs[PWl - 1].Accel == -1 && PWs[PWl - 2].Accel == -1 && PWs[PWl - 3].Accel == -1) CW.Wheeled = "serial";
    } else if(CW.Delta[WA] < PWs[PWl - 1].Delta[WA]) {
        CW.Accel = -1;
    } else {
        CW.Accel = PWs[PWl - 1].Accel;
    }
    if(CW.Wheeled) {
        Eve.BibiWheeled = CW;
        E.dispatch("bibi:wheeled", Eve);
    }
    if(PWl >= 3) PWs.shift();
    PWs.push(CW);
    clearTimeout(R.onWheel.Timer_stop);
    R.onWheel.Timer_stop = setTimeout(function() { R.onWheel.PreviousWheels = []; }, 192);
};
R.onWheel.PreviousWheels = [];

R.changeView = function(Param) {
    if(
        S["fix-reader-view-mode"] ||
        !Param || typeof Param.Mode != "string" || !/^(paged|horizontal|vertical)$/.test(Param.Mode) ||
        S.RVM == Param.Mode && !Param.Force
    ) return false;
    if(L.Opened) {
        E.dispatch("bibi:closes-utilities");
        E.dispatch("bibi:changes-view");
        O.Busy = true;
        O.HTML.classList.add("busy");
        setTimeout(function() {
            if(Param.Mode != "paged") {
                R.Spreads.forEach(function(Spread) {
                    Spread.style.opacity = "";
                });
            }
            R.layOut({
                Reset: true,
                Setting: {
                    "reader-view-mode": Param.Mode
                }
            }).then(function() {
                O.HTML.classList.remove("busy");
                O.Busy = false;
                setTimeout(function() { E.dispatch("bibi:changed-view", Param.Mode); }, 0);
            });
        }, 99);
    } else {
        S.update({
            "reader-view-mode": Param.Mode
        });
        L.play();
    }
    if(S["use-cookie"]) {
        O.Cookie.eat(O.RootPath, {
            "RVM": Param.Mode
        });
    }
};


R.getCurrentPages = function() {
    const FrameScrollCoord = {
        Left:   R.Main.scrollLeft,
        Right:  R.Main.scrollLeft + O.Body.offsetWidth, // instead of R.Main.offsetWidth for stretching.
        Top:    R.Main.scrollTop,
        Bottom: R.Main.scrollTop + O.Body.offsetHeight, // instead of R.Main.offsetHeight for stretching.
    };
    FrameScrollCoord.Before = FrameScrollCoord[S.CC.L.BASE.B];
    FrameScrollCoord.After  = FrameScrollCoord[S.CC.L.BASE.A];
    let Pages = [], Ratio = [], Status = [], BiggestRatio = 0;
    for(let l = R.Pages.length, i = 0; i < l; i++) { const Page = R.Pages[i];
        const PageCoord = sML.getCoord(Page);
        //if(Page == Page.Item) PageCoord.Bottom = PageCoord.Top + PageCoord.Height * Page.Item.Scale, PageCoord.Right = PageCoord.Left + PageCoord.Width * Page.Item.Scale
        PageCoord.Before = PageCoord[S.CC.L.BASE.B];
        PageCoord.After  = PageCoord[S.CC.L.BASE.A];
        const LengthInside = Math.min(FrameScrollCoord.After * S.CC.L.AXIS.PM, PageCoord.After * S.CC.L.AXIS.PM) - Math.max(FrameScrollCoord.Before * S.CC.L.AXIS.PM, PageCoord.Before * S.CC.L.AXIS.PM);
        const PageRatio = (LengthInside <= 0 || !PageCoord[S.CC.L.SIZE.L] || isNaN(LengthInside)) ? 0 : Math.round(LengthInside / PageCoord[S.CC.L.SIZE.L] * 100);
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
    for(let Property in Params) Pages[Property] = Params[Property];
    return Pages;
};

R.getCurrentPages.getStatus = function(PageRatio, PageCoord, FrameScrollCoord) {
    if(PageRatio >= 100) return "including";
    const Status = [];
    if(window["inner" + S.CC.L.SIZE.L] < PageCoord[S.CC.L.SIZE.L]) Status.push("oversize");
    const FrameBefore = FrameScrollCoord.Before;
    const FrameAfter  = FrameScrollCoord.After;
    if(FrameBefore * S.CC.L.AXIS.PM <  PageCoord.Before * S.CC.L.AXIS.PM) Status.push("entering");
    if(FrameBefore * S.CC.L.AXIS.PM == PageCoord.Before * S.CC.L.AXIS.PM) Status.push("entered");
    if(FrameAfter  * S.CC.L.AXIS.PM == PageCoord.After  * S.CC.L.AXIS.PM) Status.push("passsing");
    if(FrameAfter  * S.CC.L.AXIS.PM  > PageCoord.After  * S.CC.L.AXIS.PM) Status.push("passed");
    return Status.join(" ");
};

R.getCurrent = function() {
    R.Past = R.Current;
    R.Current.Pages = R.getCurrentPages();
    R.Current.Page = R.Current.Pages.EndPage;
    R.Current.Percent = Math.floor((R.Current.Pages.EndPage.PageIndex + 1) / R.Pages.length * 100);
    R.classifyCurrent();
    return R.Current;
};


R.classifyCurrent = function() {
    R.Spreads.forEach(function(Spread) { Spread.IsCurrent = false;
        Spread.Items.forEach(function(Item) { Item.IsCurrent = false;
            Item.Pages.forEach(function(Page) { Page.IsCurrent = false;
                if(R.Current.Pages.includes(Page)) Page.IsCurrent = Item.IsCurrent = Spread.IsCurrent = true;
                Page.classList.toggle("current", Page.IsCurrent);
            });
            Item.ItemBox.classList.toggle("current", Item.IsCurrent);
        });
        Spread.SpreadBox.classList.toggle("current", Spread.IsCurrent);
    });
};


R.focusOn = function(Par) {
    return new Promise(function(resolve, reject) {
        if(R.Moving) return reject();
        if(!Par) return reject();
        if(typeof Par == "number") Par = { Destination: Par };
        const Destination = R.hatchDestination(Par.Destination);
        if(!Destination) return reject();
        E.dispatch("bibi:is-going-to:focus-on", Par);
        R.Moving = true;
        let FocusPoint = 0;
        if(S["book-rendition-layout"] == "reflowable") {
            if(Destination.Edge == "head") {
                FocusPoint = (S.SLD != "rtl") ? 0 : R.Main.Book["offset" + [S.CC.L.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.CC.L.SIZE.L];
            } else if(Destination.Edge == "foot") {
                FocusPoint = (S.SLD == "rtl") ? 0 : R.Main.Book["offset" + [S.CC.L.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.CC.L.SIZE.L];
            } else {
                FocusPoint = O.getElementCoord(Destination.Page)[S.CC.L.AXIS.L];
                if(Destination.Side == "after") FocusPoint += (Destination.Page["offset" + S.CC.L.SIZE.L] - R.Stage[S.CC.L.SIZE.L]) * S.CC.L.AXIS.PM;
                if(S.SLD == "rtl") FocusPoint += Destination.Page.offsetWidth - R.Stage.Width;
            }
        } else {
            if(S["allow-placeholders"]) R.turnSpread(Destination.Page.Spread, true);
            if(R.Stage[S.CC.L.SIZE.L] >= Destination.Page.Spread["offset" + S.CC.L.SIZE.L]) {
                FocusPoint = O.getElementCoord(Destination.Page.Spread)[S.CC.L.AXIS.L];
                FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Destination.Page.Spread["offset" + S.CC.L.SIZE.L]) / 2);
            } else {
                FocusPoint = O.getElementCoord(Destination.Page)[S.CC.L.AXIS.L];
                if(R.Stage[S.CC.L.SIZE.L] > Destination.Page["offset" + S.CC.L.SIZE.L]) FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Destination.Page["offset" + S.CC.L.SIZE.L]) / 2);
            }
        }
        if(typeof Destination.TextNodeIndex == "number") R.selectTextLocation(Destination); // Colorize Destination with Selection
        const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
        ScrollTarget[S.CC.L.AXIS.L] = FocusPoint;
        O.scrollTo(ScrollTarget, {
            ForceScroll: true,
            Duration: 0//(S.RVM == "paged" && S.ARD != S.SLD ? 0 : Par.Duration)
        }).then(function() {
            R.getCurrent();
            R.Moving = false;
            resolve();
        });
    }).then(function() {
        return new Promise(function(resolve) {
            resolve();
            E.dispatch("bibi:focused-on", Par);
        });
    });
};


R.hatchDestination = function(Destination) { // from Page, Element, or Edge
    if(!Destination) return null;
    if(typeof Destination == "number" || (typeof Destination == "string" && /^\d+$/.test(Destination))) {
        Destination = R.getBibiToDestination(Destination);
    } else if(typeof Destination == "string") {
        if(Destination == "head" || Destination == "foot") {
            Destination = { Edge: Destination };
        } else if(X["EPUBCFI"]) {
            Destination = X["EPUBCFI"].getDestination(Destination);
        }
    } else if(Destination.tagName) {
             if(typeof Destination.PageIndex   == "number") Destination = { Page:   Destination };
        else if(typeof Destination.ItemIndex   == "number") Destination = { Item:   Destination };
        else if(typeof Destination.SpreadIndex == "number") Destination = { Spread: Destination }; 
        else Destination = { Element: Destination };
    }
    if(Destination.Page    && !Destination.Page.parentElement)    delete Destination.Page;
    if(Destination.Item    && !Destination.Item.parentElement)    delete Destination.Item;
    if(Destination.Spread  && !Destination.Spread.parentElement)  delete Destination.Spread;
    if(Destination.Element && !Destination.Element.parentElement) delete Destination.Element;
    if(typeof Destination.Edge == "string") {
        if(Destination.Edge == "head") Destination.Page = R.Pages[0];
        else                           Destination.Page = R.Pages[R.Pages.length - 1], Destination.Edge = "foot";
    } else {
        if(!Destination.Element) {
            if(!Destination.Item) {
                     if(typeof Destination.ItemIndexInAll == "number") Destination.Item = R.AllItems[Destination.ItemIndexInAll];
                else if(typeof Destination.ItemIndex      == "number") Destination.Item =    R.Items[Destination.ItemIndex];
                else {
                    if(!Destination.Spread && typeof Destination.SpreadIndex == "number") Destination.Spread = R.Spreads[Destination.SpreadIndex];
                    if(Destination.Spread) {
                             if(typeof Destination.PageIndexInSpread == "number") Destination.Page = Destination.Spread.Pages[Destination.PageIndexInSpread];
                        else if(typeof Destination.ItemIndexInSpread == "number") Destination.Item = Destination.Spread.Items[Destination.ItemIndexInSpread];
                        else                                                      Destination.Item = Destination.Spread.Items[0];
                    }
                }
            }
            if(Destination.Item && typeof Destination.ElementSelector == "string") {
                Destination.Element = Destination.Item.contentDocument.querySelector(Destination.ElementSelector);
            }
        }
        if(Destination.Element) {
            Destination.Page = R.getNearestPageOfElement(Destination.Element);
        } else if(!Destination.Page){
            if(Destination.Spread) {
                     if(typeof Destination.PageIndexInSpread    == "number") Destination.Page = Destination.Spread.Pages[Destination.PageIndexInSpread];
                else if(typeof Destination.PageProgressInSpread == "number") Destination.Page = Destination.Spread.Pages[Math.floor(Destination.Spread.Pages.length * Destination.PageProgressInSpread)];
            }
            if(!Destination.Page && Destination.Item) Destination.Page = Destination.Item.Pages[0];
        }
    }
    if(!Destination.Page) return null;
    Destination.Item = Destination.Page.Item;
    Destination.Spread = Destination.Page.Spread;
    return Destination;
};

R.getNearestPageOfElement = function(Ele) {
    const Item = Ele.ownerDocument.body.Item;
    if(!Item) return R.Pages[0];
    let NearestPage, ElementCoordInItem;
    if(Item.Columned) {
        sML.style(Item.HTML, { "column-width": "" });
        ElementCoordInItem = O.getElementCoord(Ele)[S.CC.L.AXIS.B];
        if(S.PPD == "rtl" && S.SLA == "vertical") {
            ElementCoordInItem = Item.offsetWidth - (S["item-padding-left"] + S["item-padding-right"]) - ElementCoordInItem - Ele.offsetWidth;
        }
        sML.style(Item.HTML, { "column-width": Item.ColumnLength + "px" });
        NearestPage = Item.Pages[Math.ceil(ElementCoordInItem / Item.ColumnBreadth - 1)];
    } else {
        ElementCoordInItem = O.getElementCoord(Ele)[S.CC.L.AXIS.L];
        if(S.SLD == "rtl" && S.SLA == "horizontal") {
            ElementCoordInItem = Item.HTML.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
        }
        NearestPage = Item.Pages[0];
        for(let l = Item.Pages.length, i = 0; i < l; i++) {
            ElementCoordInItem -= Item.Pages[i]["offset" + S.CC.L.SIZE.L];
            if(ElementCoordInItem <= 0) {
                NearestPage = Item.Pages[i];
                break;
            }
        }
    }
    return NearestPage;
};


R.selectTextLocation = function(Destination) {
    if(typeof Destination.TextNodeIndex != "number") return;
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
        } else if(Destination.TermStep.Side && Destination.TermStep.Side == "a") {
            Sides.Start.Node = DestinationNode.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
            Sides.End.Index = Destination.TermStep.Index - 1;
        } else {
            Sides.Start.Index = Destination.TermStep.Index;
            Sides.End.Node = DestinationNode.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
            Sides.End.Index = Sides.End.Node.textContent.length;
        }
    }
    return sML.select(Sides);
};


R.moveBy = function(Par) {
    return new Promise(function(resolve, reject) {
        if(R.Moving || !L.Opened) return reject();
        if(!Par) return reject();
        if(typeof Par == "number") Par = { Distance: Par };
        if(!Par.Distance || typeof Par.Distance != "number") return reject();
        Par.Distance *= 1;
        if(Par.Distance == 0 || isNaN(Par.Distance)) return reject();
        Par.Distance = Par.Distance < 0 ? -1 : 1;
        E.dispatch("bibi:is-going-to:move-by", Par);
        let CurrentEdge = "", Side = "";
        if(Par.Distance > 0) CurrentEdge = "EndPage",   Side = "before";
        else                 CurrentEdge = "StartPage", Side = "after";
        R.getCurrent();
        const CurrentPage = R.Current.Pages[CurrentEdge];
        const ToFocus = (
            R.Columned ||
            S.BRL == "pre-paginated" ||
            CurrentPage.Item.ItemRef["rendition:layout"] == "pre-paginated" ||
            CurrentPage.Item.Outsourcing ||
            CurrentPage.Item.Pages.length == 1 ||
            (Par.Distance < 0 && CurrentPage.PageIndexInItem == 0) ||
            (Par.Distance > 0 && CurrentPage.PageIndexInItem == CurrentPage.Item.Pages.length - 1)
        );
        if(!ToFocus) {
            R.scrollBy(Par).then(resolve);
        } else {
            const CurrentPageStatus = R.Current.Pages[CurrentEdge + "Status"];
            const CurrentPageRatio  = R.Current.Pages[CurrentEdge + "Ratio"];
            if(/(oversize)/.test(CurrentPageStatus)) {
                if(Par.Distance > 0) {
                         if(CurrentPageRatio >= 90)             Side = "before";
                    else if(/entering/.test(CurrentPageStatus)) Side = "before", Par.Distance =  0;
                    else if( /entered/.test(CurrentPageStatus)) Side = "after",  Par.Distance =  0;
                } else {
                         if(CurrentPageRatio >= 90)             Side = "after";
                    else if( /passing/.test(CurrentPageStatus)) Side = "before", Par.Distance =  0;
                    else if(  /passed/.test(CurrentPageStatus)) Side = "after",  Par.Distance =  0;
                }
            } else {
                if(Par.Distance > 0) {
                         if(   /enter/.test(CurrentPageStatus)) Side = "before", Par.Distance =  0;
                } else {
                         if(    /pass/.test(CurrentPageStatus)) Side = "after",  Par.Distance =  0;
                }
            }
            //sML.log([CurrentPageStatus, CurrentPageRatio, Par.Distance, Side].join(" / "));
            let DestinationPageIndex = CurrentPage.PageIndex + Par.Distance;
                 if(DestinationPageIndex <                  0) DestinationPageIndex = 0;
            else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1;
            let DestinationPage = R.Pages[DestinationPageIndex];
            if(S.BRL == "pre-paginated" && DestinationPage.Item.SpreadPair) {
                if(S.SLA == "horizontal" && R.Stage[S.CC.L.SIZE.L] > DestinationPage.Spread["offset" + S.CC.L.SIZE.L]) {
                    if(Par.Distance < 0 && DestinationPage.PageIndexInSpread == 0) DestinationPage = DestinationPage.Spread.Pages[1];
                    if(Par.Distance > 0 && DestinationPage.PageIndexInSpread == 1) DestinationPage = DestinationPage.Spread.Pages[0];
                }
            }
            Par.Destination = { Page: DestinationPage, Side: Side };
            R.focusOn(Par).then(resolve);
        }
    }).then(function() {
        return new Promise(function(resolve) {
            resolve();
            E.dispatch("bibi:moved-by", Par);
        });
    });
};

R.scrollBy = function(Par) {
    return new Promise(function(resolve, reject) {
        if(!Par) return reject();
        if(typeof Par == "number") Par = { Distance: Par };
        if(!Par.Distance || typeof Par.Distance != "number") return reject();
        E.dispatch("bibi:is-going-to:scroll-by", Par);
        R.Moving = true;
        const ScrollTarget = {
            Frame: R.Main,
            X: 0, Y: 0
        };
        const CurrentScrollCoord = sML.Coord.getScrollCoord(R.Main);
        switch(S.SLD) {
            case "ttb": ScrollTarget.Y = CurrentScrollCoord.Y + (R.Stage.Height + R.Stage.PageGap) * Par.Distance;      break;
            case "ltr": ScrollTarget.X = CurrentScrollCoord.X + (R.Stage.Width  + R.Stage.PageGap) * Par.Distance;      break;
            case "rtl": ScrollTarget.X = CurrentScrollCoord.X + (R.Stage.Width  + R.Stage.PageGap) * Par.Distance * -1; break;
        }
        O.scrollTo(ScrollTarget, {
            ForceScroll: true,
            Duration: ((S.RVM == "paged") ? 0 : Par.Duration)
        }).then(function() {
            R.getCurrent();
            R.Moving = false;
            resolve();
        });
    }).then(function() {
        return new Promise(function(resolve) {
            resolve();
            E.dispatch("bibi:scrolled-by", Par);
        });
    });
};

R.getBibiToDestination = function(BibitoString) {
    if(typeof BibitoString == "number") BibitoString = "" + BibitoString;
    if(typeof BibitoString != "string" || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(BibitoString)) return null;
    let ElementSelector = "", InE = BibitoString.split("-"), ItemIndexInAll = parseInt(InE[0]) - 1, ElementIndex = InE[1] ? InE[1] : null;
    if(ElementIndex) ElementIndex.split(".").forEach(function(Index) { ElementSelector += ">*:nth-child(" + Index + ")"; });
    return {
        BibitoString: BibitoString,
        ItemIndexInAll: ItemIndexInAll,
        ElementSelector: (ElementSelector ? "body" + ElementSelector : undefined)
    };
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- User Interfaces

//----------------------------------------------------------------------------------------------------------------------------------------------


____.I = {}; // Bibi.UserInterfaces


I.initialize = function() {

    I.createNotifier();
    I.createVeil();

    E.bind("bibi:readied", function() {
        I.createCatcher();
        I.createPanel();
        I.createMenu();
        I.createHelp();
        I.createPoweredBy();
        I.createFontSizeChanger();
        I.createLoupe();
    });

    E.bind("bibi:prepared", function() {
        I.createNombre();
        I.createSlider();
        I.createTurner();
        I.createArrows();
        I.createSwipeListener();
        I.createKeyListener();
        I.createSpinner();
    });

    E.add("bibi:commands:open-utilities",   function() { E.dispatch("bibi:opens-utilities"); });
    E.add("bibi:commands:close-utilities",  function() { E.dispatch("bibi:closes-utilities"); });
    E.add("bibi:commands:toggle-utilities", function() { E.dispatch("bibi:toggles-utilities"); });

};


I.note = function(Msg, Time, ErrorOccured) {
    clearTimeout(I.note.Timer);
    if(!Msg) I.note.Time = 0;
    else     I.note.Time = (typeof Time == "number") ? Time : (O.Busy ? 9999 : 2222);
    if(I.Notifier) {
        I.Notifier.Board.innerHTML = '<p' + (ErrorOccured ? ' class="error"' : '') + '>' + Msg + '</p>';
        O.HTML.classList.add("notifier-shown");
        I.note.Timer = setTimeout(function() { O.HTML.classList.remove("notifier-shown"); }, I.note.Time);
    }
    if(!O.Touch) {
        if(O.statusClearer) clearTimeout(O.statusClearer);
        window.status = 'BiB/i: ' + Msg;
        O.statusClearer = setTimeout(function() { window.status = ""; }, I.note.Time);
    }
};


I.createNotifier = function() {

    I.Notifier = O.Body.appendChild(sML.create("div", { id: "bibi-notifier" }));

    I.Notifier.Board = I.Notifier.appendChild(sML.create("div", { id: "bibi-notifier-board" }));

    E.dispatch("bibi:created-notifier");

};


I.createVeil = function() {

    I.Veil = I.setToggleAction(O.Body.appendChild(sML.create("div", { id: "bibi-veil" })), {
        // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
        onopened:  function() {
            O.HTML.classList.add("veil-opened");
            this.classList.remove("closed");
        },
        onclosed: function() {
            this.classList.add("closed");
            O.HTML.classList.remove("veil-opened");
        }
    });

    I.Veil.open();

    I.Veil.Cover = I.Veil.appendChild(sML.create("div", { id: "bibi-veil-cover" }));
    I.Veil.Cover.Info     = I.Veil.Cover.appendChild(sML.create("p", { id: "bibi-veil-cover-info" }));
    //I.Veil.Cover.ImageBox = I.Veil.Cover.appendChild(sML.create("figure", { id: "bibi-veil-cover-image-box" }));

    const PlayButtonTitle = (O.Touch ? 'Tap' : 'Click') + ' to Open';
    I.Veil.PlayButton = I.Veil.appendChild(
        sML.create("p", { id: "bibi-veil-play", title: PlayButtonTitle,
            innerHTML: '<span class="non-visual">' + PlayButtonTitle + '</span>',
            play: function(Eve) {
                Eve.stopPropagation();
                L.play();
                //M.post("bibi:play:button:" + location.href);
                E.dispatch("bibi:played:by-button");
            },
            hide: function() {
                this.removeEventListener("click", I.Veil.PlayButton.play);
                sML.style(this, {
                    opacity: 0,
                    cursor: "default"
                });
            }
        })
    );
    I.Veil.PlayButton.addEventListener("click", I.Veil.PlayButton.play);
    E.add("bibi:played", function() { I.Veil.PlayButton.hide(); });

    E.dispatch("bibi:created-veil");

};

I.createCatcher = function() {
    // Catcher
    if(S["book"] || S.BookDataElement || !S["accept-local-file"]) return;
    const CatcherInnerHTML = I.distillLabels.distillLanguage({
        default: [
            '<div class="pgroup" lang="en">',
                '<p><strong>Pass Me Your EPUB File!</strong></p>',
                '<p><em>You Can Open Your Own EPUB.</em></p>',
                '<p><span>Please ' + (O.Touch ? 'Tap' : 'Drag & Drop It Here. <br />Or Click') + ' Here and Choose It.</span></p>',
                '<p><small>(Open in Your Device without Uploading)</small></p>',
            '</div>'
        ].join(""),
        ja: [
            '<div class="pgroup" lang="ja">',
                '<p><strong>EPUBファイルをここにください！</strong></p>',
                '<p><em>お持ちの EPUB ファイルを<br />開くことができます。</em></p>',
                '<p><span>' + (O.Touch ? 'ここをタップ' : 'ここにドラッグ＆ドロップするか、<br />ここをクリック') + 'して選択してください。</span></p>',
                '<p><small>（外部に送信されず、この端末の中で開きます）</small></p>',
            '</div>'
        ].join("")
    })[O.Language];
    I.Catcher = O.Body.appendChild(sML.create("div", { id: "bibi-catcher", innerHTML: CatcherInnerHTML }));
    I.Catcher.title = I.Catcher.querySelector('span').innerHTML.replace(/<br( ?\/)?>/g, "\n").replace(/<[^>]+>/g, "").trim();
    I.Catcher.Input = I.Catcher.appendChild(sML.create("input", { type: "file" }));
    if(!S["unzip-if-necessary"].includes("*") && S["unzip-if-necessary"].length) {
        const Accept = [];
        if(S["unzip-if-necessary"].includes(".epub")) {
            Accept.push("application/epub+zip");
        }
        if(S["unzip-if-necessary"].includes(".zip")) {
            Accept.push("application/zip");
            Accept.push("application/x-zip");
            Accept.push("application/x-zip-compressed");
        }
        if(Accept.length) I.Catcher.Input.setAttribute("accept", Accept.join(","));
    }
    I.Catcher.Input.addEventListener("change", function(Eve) {
        let FileData = {};  try { FileData = Eve.target.files[0]; } catch(Err) {}
        L.getBookData.resolve({ BookData: FileData });
    });
    I.Catcher.addEventListener("click", function(Eve) {
        this.Input.click(Eve);
    });
    if(!O.Touch) {
        I.Catcher.addEventListener("dragenter", function(Eve) { Eve.preventDefault(); O.HTML.classList.add(   "dragenter"); }, 1);
        I.Catcher.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); }, 1);
        I.Catcher.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); O.HTML.classList.remove("dragenter"); }, 1);
        I.Catcher.addEventListener("drop",      function(Eve) { Eve.preventDefault();
            let FileData = {};  try { FileData = Eve.dataTransfer.files[0]; } catch(Err) {}
            L.getBookData.resolve({ BookData: FileData });
        }, 1);
    }
    I.Catcher.appendChild(I.getBookIcon());
};


I.createPanel = function() {

    I.Panel = O.Body.appendChild(sML.create("div", { id: "bibi-panel" }));
    I.setToggleAction(I.Panel, {
        onopened: function() {
            O.HTML.classList.add("panel-opened");
            E.dispatch("bibi:opened-panel");
        },
        onclosed: function() {
            O.HTML.classList.remove("panel-opened");
            E.dispatch("bibi:closed-panel");
        }
    });

    E.add("bibi:commands:open-panel",   I.Panel.open);
    E.add("bibi:commands:close-panel",  I.Panel.close);
    E.add("bibi:commands:toggle-panel", I.Panel.toggle);

    E.add("bibi:closes-utilities",      I.Panel.close);

    I.Panel.Labels = {
        default: { default: "Opoen this Index", ja: "この目次を開く" },
        active: { default: "Close this Index", ja: "この目次を閉じる" }
    };
    I.setFeedback(I.Panel, { StopPropagation: true });
    I.Panel.addTapEventListener("tapped", function() { E.dispatch("bibi:commands:toggle-panel"); });

    // Optimize to Scrollbar Size
    sML.CSS.appendRule("html.page-rtl div#bibi-panel:after", "bottom: " + (O.Scrollbars.Height) + "px;");

    // Book Info
    I.Panel.BookInfo            = I.Panel.appendChild(               sML.create("div", { id: "bibi-panel-bookinfo"            }));
    I.Panel.BookInfo.Box        = I.Panel.BookInfo.appendChild(      sML.create("div", { id: "bibi-panel-bookinfo-box"        }));
    I.Panel.BookInfo.Navigation = I.Panel.BookInfo.Box.appendChild(  sML.create("div", { id: "bibi-panel-bookinfo-navigation" }));
    I.Panel.BookInfo.Cover      = I.Panel.BookInfo.Box.appendChild(  sML.create("div", { id: "bibi-panel-bookinfo-cover"      }));
    I.Panel.BookInfo.Cover.Info = I.Panel.BookInfo.Cover.appendChild(sML.create("p",   { id: "bibi-panel-bookinfo-cover-info" }));

    E.dispatch("bibi:created-panel");

};


I.createMenu = function() {

    if(!S["use-menubar"]) O.HTML.classList.add("without-menubar");
    //else if( S["place-menubar-at-top"]) O.HTML.classList.add("menubar-top");
    //else                                O.HTML.classList.add("menubar-bottom");

    // Menus
    I.Menu = O.Body.appendChild(sML.create("div", { id: "bibi-menu", on: { "click": function(Eve) { Eve.stopPropagation(); } } }));
    I.setHoverActions(I.Menu);
    I.setToggleAction(I.Menu, {
        onopened: function() {
            O.HTML.classList.add("menu-opened");
            E.dispatch("bibi:opened-menu");
        },
        onclosed: function() {
            O.HTML.classList.remove("menu-opened");
            E.dispatch("bibi:closed-menu");
        }
    });
    E.add("bibi:commands:open-menu",   I.Menu.open);
    E.add("bibi:commands:close-menu",  I.Menu.close);
    E.add("bibi:commands:toggle-menu", I.Menu.toggle);

    E.add("bibi:opens-utilities",   function(Opt) { E.dispatch("bibi:commands:open-menu",   Opt); });
    E.add("bibi:closes-utilities",  function(Opt) { E.dispatch("bibi:commands:close-menu",  Opt); });
    E.add("bibi:toggles-utilities", function(Opt) { E.dispatch("bibi:commands:toggle-menu", Opt); });

    E.add("bibi:opened", I.Menu.close);

    E.add("bibi:scrolls", function() {
        clearTimeout(I.Menu.Timer_cool);
        if(!I.Menu.Hot) I.Menu.classList.add("hot");
        I.Menu.Hot = true;
        I.Menu.Timer_cool = setTimeout(function() {
            I.Menu.Hot = false;
            I.Menu.classList.remove("hot");
        }, 1234);
    });
    if(!O.Touch) {
        E.add("bibi:moved-pointer", function(Eve) {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(I.Menu.Timer_close);
            if(BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) {
                E.dispatch(I.Menu, "bibi:hovers");
            } else if(I.Menu.Hover) {
                I.Menu.Timer_close = setTimeout(function() {
                    E.dispatch(I.Menu, "bibi:unhovers", Eve);
                }, 123);
            }
        });
    }
    I.Menu.L = I.Menu.appendChild(sML.create("div", { id: "bibi-menu-l" }));
    I.Menu.R = I.Menu.appendChild(sML.create("div", { id: "bibi-menu-r" }));
    [I.Menu.L, I.Menu.R].forEach(function(MenuSide) {
        MenuSide.ButtonGroups = [];
        MenuSide.addButtonGroup = function(Par) {
            const ButtonGroup = I.createButtonGroup(Par);
            if(!ButtonGroup) return null;
            this.ButtonGroups.push(ButtonGroup);
            return this.appendChild(ButtonGroup);
        };
    });

    // Optimize to Scrollbar Size
    sML.CSS.appendRule([
        "html.view-vertical div#bibi-menu"
    ].join(", "), "width: calc(100% - " + (O.Scrollbars.Width) + "px);");
    sML.CSS.appendRule([
        "html.view-vertical.panel-opened div#bibi-menu",
        "html.view-vertical.subpanel-opened div#bibi-menu"
    ].join(", "), "width: 100%; padding-right: " + (O.Scrollbars.Width) + "px;");

    I.SubPanel = null;
    I.SubPanels = [];

    I.createMenu.createPanelSwitch();

    I.createMenu.SettingMenuComponents = [];
    if(!S["fix-reader-view-mode"])                                                                     I.createMenu.SettingMenuComponents.push("ViewModeButtons");
    if(O.WindowEmbedded)                                                                               I.createMenu.SettingMenuComponents.push("NewWindowButton");
    if(O.FullscreenEnabled && !O.Touch)                                                                I.createMenu.SettingMenuComponents.push("FullscreenButton");
    if(S["website-href"] && /^https?:\/\/[^\/]+/.test(S["website-href"]) && S["website-name-in-menu"]) I.createMenu.SettingMenuComponents.push("WebsiteLink");
    if(!S["remove-bibi-website-link"])                                                                 I.createMenu.SettingMenuComponents.push("BibiWebsiteLink");
    if(I.createMenu.SettingMenuComponents.length) I.createMenu.createSettingMenu();

    E.dispatch("bibi:created-menu");

};


I.createMenu.createPanelSwitch = function() {

    // Panel Switch
    I.PanelSwitch = I.Menu.L.addButtonGroup({ Sticky: true }).addButton({
        Type: "toggle",
        Labels: {
            default: { default: 'Open Index',  ja: '目次を開く'   },
            active:  { default: 'Close Index', ja: '目次を閉じる' }
        },
        Help: true,
        Icon: '<span class="bibi-icon bibi-icon-toggle-panel"><span class="bar-1"></span><span class="bar-2"></span><span class="bar-3"></span></span>',
        action: function() {
            I.Panel.toggle();
        }
    });
    E.add("bibi:opened-panel", function() { I.setUIState(I.PanelSwitch, "active"); });
    E.add("bibi:closed-panel", function() { I.setUIState(I.PanelSwitch,       ""); });
    E.add("bibi:started",      function() { sML.style(I.PanelSwitch, { display: "block" }); });

    E.dispatch("bibi:created-panel-switch");

};


I.createMenu.createSettingMenu = function() {

    I.Menu.Config = {};

    // Button
    I.Menu.Config.Button = I.Menu.R.addButtonGroup({ Sticky: true }).addButton({
        Type: "toggle",
        Labels: {
            default: { default: 'Setting', ja: '設定を変更' },
            active:  { default: 'Close Setting-Menu', ja: '設定メニューを閉じる' }
        },
        Help: true,
        Icon: '<span class="bibi-icon bibi-icon-setting"></span>'
    });

    // Sub Panel
    I.Menu.Config.SubPanel = I.createSubPanel({ Opener: I.Menu.Config.Button, id: "bibi-subpanel_config" });

    if(
        I.createMenu.SettingMenuComponents.includes("ViewModeButtons")
    ) {
        I.Menu.Config.ViewSection        = I.createMenu.createSettingMenu.createViewSection();
        I.Menu.Config.ViewOptionSectionR = I.createMenu.createSettingMenu.createViewOptionSectionR();
        I.Menu.Config.ViewOptionSectionF = I.createMenu.createSettingMenu.createViewOptionSectionF();
    }

    if(
        I.createMenu.SettingMenuComponents.includes("NewWindowButton") ||
        I.createMenu.SettingMenuComponents.includes("FullscreenButton")
    ) {
        I.Menu.Config.WindowSection      = I.createMenu.createSettingMenu.createWindowSection();
    }

    if(
        I.createMenu.SettingMenuComponents.includes("WebsiteLink") ||
        I.createMenu.SettingMenuComponents.includes("BibiWebsiteLink")
    ) {
        I.Menu.Config.LinkageSection     = I.createMenu.createSettingMenu.createLinkageSection();
    }

    E.dispatch("bibi:created-setting-menu");

};


I.createMenu.createSettingMenu.createViewSection = function() {

    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Layout Mode', ja: '表示モード' } }
    });

    const SS /*= SpreadShape*/ = (function(ItemShape) { return '<span class="bibi-shape bibi-shape-spread">' + ItemShape + ItemShape + '</span>'; })('<span class="bibi-shape bibi-shape-item"></span>');

    const Buttons = [{
        Mode: "paged",
        Labels: {
            default: {
                default: 'Page Flipping <small>(with ' + (O.Touch ? 'Tap/Swipe' : 'Click/Wheel') + ')</small>',
                ja: 'ページ単位<small>（' + (O.Touch ? 'タップ／スワイプ' : 'クリック／ホイール') + '）</small>'
            }
        },
        Icon: '<span class="bibi-icon bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">' + SS + SS + SS + '</span></span>'
    }, {
        Mode: "horizontal",
        Labels: {
            default: {
                default: 'Horizontal Scroll',
                ja: '横スクロール'
            }
        },
        Icon: '<span class="bibi-icon bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + SS + SS + SS + '</span></span>'
    }, {
        Mode: "vertical",
        Labels: {
            default: {
                default: 'Vertical Scroll',
                ja: '縦スクロール'
            }
        },
        Icon: '<span class="bibi-icon bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">' + SS + SS + SS + '</span></span>'
    }];

    Buttons.forEach(function(Button) {
        Button.Type = "radio";
        Button.Notes = true;
        Button.action = function() { return R.changeView(this); };
    });

    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });

    E.add("bibi:updated-settings", function() {
        ButtonGroup.Buttons.forEach(function(Button) {
            I.setUIState(Button, (Button.Mode == S.RVM ? "active" : "default"));
        });
    });

    return Section;

};


I.createMenu.createSettingMenu.createViewOptionSectionR = function() { // for Reflowable Books

    /*

    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Options', ja: '表示オプション' } }
    });

    const Buttons = [];

    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });

    E.add("bibi:updated-settings", function() {
        Section.style.display = S.BRL == "reflowable" ? "" : "none";
        ButtonGroup.Buttons.forEach(function(Button) {
            I.setUIState(Button, S[Button.Name] ? "active" : "default");
        });
    });

    return Section;

    //*/

};


I.createMenu.createSettingMenu.createViewOptionSectionF = function() { // for Fixed-layout Books

    const Section = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Options', ja: '表示オプション' } }
    });

    const Buttons = [{
        Name: "full-breadth-layout-in-scroll",
        Type: "toggle",
        Notes: false,
        Labels: {
            default: {
                default: 'Full Width for Each Page <small>(in Scrolling Mode)</small>',
                ja: 'スクロール表示で各ページを幅一杯に</small>'
            }
        },
        Icon: '<span class="bibi-icon bibi-icon-full-breadth-layout"></span>',
        action: function() {
            const IsActive = (this.UIState == "active");
            S.update({ "full-breadth-layout-in-scroll": IsActive });
            if(IsActive) O.HTML.classList.add(   "book-full-breadth");
            else         O.HTML.classList.remove("book-full-breadth");
            if(S.RVM == "horizontal" || S.RVM == "vertical") R.changeView({ Mode: S.RVM, Force: true });
            if(S["use-cookie"]) {
                O.Cookie.eat(O.RootPath, {
                    "FBL": S["full-breadth-layout-in-scroll"]
                });
            }
        }
    }];

    const ButtonGroup = Section.addButtonGroup({ Buttons: Buttons });

    E.add("bibi:updated-settings", function() {
        Section.style.display = S.BRL == "pre-paginated" ? "" : "none";
        ButtonGroup.Buttons.forEach(function(Button) {
            I.setUIState(Button, S[Button.Name] ? "active" : "default");
        });
    });

    return Section;

};


I.createMenu.createSettingMenu.createWindowSection = function() {

    const Buttons = [];

    // New Window
    if(I.createMenu.SettingMenuComponents.includes("NewWindowButton")) Buttons.push({
        Type: "link",
        Labels: {
            default: { default: 'Open in New Window', ja: 'あたらしいウィンドウで開く' }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: O.RequestedURL,
        target: "_blank"
    });

    // Fullscreen
    if(I.createMenu.SettingMenuComponents.includes("FullscreenButton")) Buttons.push({
        Type: "toggle",
        Labels: {
            default: { default: 'Enter Fullscreen', ja: 'フルスクリーンモード' },
            active:  { default: 'Exit Fullscreen', ja: 'フルスクリーンモード解除' }
        },
        Icon: '<span class="bibi-icon bibi-icon-toggle-fullscreen"></span>',
        action: function() {
            const Button = this;
            if(!O.FullscreenElement.Fullscreen) {
                sML.requestFullscreen(O.FullscreenElement);
            } else {
                sML.exitFullscreen(O.FullscreenDocument);
            }
            if(!O.FullscreenElement.Fullscreen) {
                O.FullscreenElement.Fullscreen = true;
                E.dispatch("bibi:requested-fullscreen");
                O.HTML.classList.add("fullscreen");
            } else {
                O.FullscreenElement.Fullscreen = false;
                E.dispatch("bibi:exited-fullscreen");
                O.HTML.classList.remove("fullscreen");
            }
        }
    });

    if(Buttons.length) {
        const WindowSection = I.Menu.Config.SubPanel.addSection({
            //Labels: { default: { default: 'Choose Layout', ja: 'レイアウトを選択' } }
        });
        WindowSection.addButtonGroup({ Buttons: Buttons });
        return WindowSection;
    } else {
        return null;
    }

};


I.createMenu.createSettingMenu.createLinkageSection = function() {

    const Buttons = [];

    if(I.createMenu.SettingMenuComponents.includes("WebsiteLink")) Buttons.push({
        Type: "link",
        Labels: {
            default: { default: S["website-name-in-menu"].replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: S["website-href"],
        target: "_blank"
    });

    if(I.createMenu.SettingMenuComponents.includes("BibiWebsiteLink")) Buttons.push({
        Type: "link",
        Labels: {
            default: { default: "BiB/i | Official Website" }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: Bibi["href"],
        target: "_blank"
    });

    if(Buttons.length) {
        const LinkageSection = I.Menu.Config.SubPanel.addSection({
            // Labels: { default: { default: 'Link' + (Buttons.length > 1 ? 's' : ''), ja: 'リンク' } },
        });
        LinkageSection.addButtonGroup({ Buttons: Buttons });
        return LinkageSection;
    } else {
        return null;
    }

};

I.createFontSizeChanger = function() {

    I.FontSizeChanger = {};

    if(typeof S["font-size-scale-per-step"] != "number" || S["font-size-scale-per-step"] <= 1) S["font-size-scale-per-step"] = 1.25;

    if(S["use-font-size-changer"] && S["use-cookie"]) {
        const BibiCookie = O.Cookie.remember(O.RootPath);
        if(BibiCookie && BibiCookie.FontSize && BibiCookie.FontSize.Step != undefined) I.FontSizeChanger.Step = BibiCookie.FontSize.Step * 1;
    }
    if(typeof I.FontSizeChanger.Step != "number" || I.FontSizeChanger.Step < -2 || 2 < I.FontSizeChanger.Step) I.FontSizeChanger.Step = 0;

    E.bind("bibi:postprocessed-item", function(Item) {
        if(Item.ItemRef["rendition:layout"] == "pre-paginated") return false;
        Item.changeFontSize = function(FontSize) {
            if(Item.FontSizeStyleRule) sML.CSS.deleteRule(Item.FontSizeStyleRule, Item.contentDocument);
            Item.FontSizeStyleRule = sML.CSS.appendRule("html", "font-size: " + FontSize + "px !important;", Item.contentDocument);
        };
        Item.changeFontSizeStep = function(Step) {
            Item.changeFontSize(Item.FontSize.Base * Math.pow(S["font-size-scale-per-step"], Step));
        };
        Item.FontSize = {
            Default: getComputedStyle(Item.HTML).fontSize.replace(/[^\d]*$/, "") * 1
        };
        Item.FontSize.Base = Item.FontSize.Default;
        if(L.Preprocessed && (sML.UA.Chrome || sML.UA.InternetExplorer)) {
            O.forEach(Item.contentDocument.documentElement.querySelectorAll("body, body *"), function(Ele) {
                Ele.style.fontSize = parseInt(getComputedStyle(Ele).fontSize) / Item.FontSize.Base + "rem";
            });
        } else {
            O.editCSSRules(Item.contentDocument, function(CSSRule) {
                if(!CSSRule || !CSSRule.selectorText || /^@/.test(CSSRule.selectorText)) return;
                try { if(Item.contentDocument.querySelector(CSSRule.selectorText) == Item.HTML) return; } catch(Error) {}
                const REs = {
                    "pt": / font-size: (\d[\d\.]*)pt; /,
                    "px": / font-size: (\d[\d\.]*)px; /
                };
                if(REs["pt"].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs["pt"])[1] * (96/72) / Item.FontSize.Base + "rem";
                if(REs["px"].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs["px"])[1]           / Item.FontSize.Base + "rem";
            });
        }
        if(typeof S["base-font-size"] == "number" && S["base-font-size"] > 0) {
            let MostPopularFontSize = 0;
            const FontSizeCounter = {};
            O.forEach(Item.Body.querySelectorAll("p, p *"), function(Ele) {
                if(!Ele.innerText.replace(/\s/g, "")) return;
                const FontSize = Math.round(getComputedStyle(Ele).fontSize.replace(/[^\d]*$/, "") * 100) / 100;
                if(!FontSizeCounter[FontSize]) FontSizeCounter[FontSize] = [];
                FontSizeCounter[FontSize].push(Ele);
            });
            let MostPopularFontSizeAmount = 0;
            for(let FontSize in FontSizeCounter) {
                if(FontSizeCounter[FontSize].length > MostPopularFontSizeAmount) {
                    MostPopularFontSizeAmount = FontSizeCounter[FontSize].length;
                    MostPopularFontSize = FontSize;
                }
            }
            if(MostPopularFontSize) Item.FontSize.Base = Item.FontSize.Base * (S["base-font-size"] / MostPopularFontSize);
            Item.changeFontSizeStep(I.FontSizeChanger.Step);
        } else if(I.FontSizeChanger.Step != 0) {
            Item.changeFontSizeStep(I.FontSizeChanger.Step);
        }
    });

    I.FontSizeChanger.changeFontSizeStep = function(Step, Actions) {
        if(S.BRL == "pre-paginated") return;
        if(Step == I.FontSizeChanger.Step) return;
        if(!Actions) Actions = {};
        E.dispatch("bibi:changes-font-size");
        if(typeof Actions.before == "function") Actions.before();
        I.FontSizeChanger.Step = Step;
        if(S["use-font-size-changer"] && S["use-cookie"]) {
            O.Cookie.eat(O.RootPath, { FontSize: { Step: Step } });
        }
        setTimeout(function() {
            R.layOut({
                Reset: true,
                NoNotification: true,
                before: function() {
                    R.Items.forEach(function(Item) {
                        if(Item.changeFontSizeStep) Item.changeFontSizeStep(Item, Step);
                    });
                }
            }).then(function() {
                E.dispatch("bibi:changed-font-size", { Step: Step });
                if(typeof Actions.after == "function") Actions.after();
            });
        }, 88);
    };

    E.add("bibi:changes-font-size", function() { E.dispatch("bibi:closes-utilities"); });

  //E.add("bibi:changes-view", function() { I.FontSizeChanger.changeFontSizeStep(0); }); // unnecessary

    if(S["use-font-size-changer"]) I.createFontSizeChanger.createUI();
    E.dispatch("bibi:created-font-size-changer");

};


I.createFontSizeChanger.createUI = function() {

    const changeFontSizeStep = function() {
        const Button = this;
        I.FontSizeChanger.changeFontSizeStep(Button.Step, {
            before: function() { Button.ButtonGroup.Busy = true;  },
            after:  function() { Button.ButtonGroup.Busy = false; }
        });
    };

    I.createSubPanel({
        Opener: I.Menu.R.addButtonGroup({ Sticky: true, id: "bibi-buttongroup_font-size" }).addButton({
            Type: "toggle",
            Labels: {
                default: {
                    default: 'Change Font Size',
                    ja: '文字サイズを変更'
                },
                active: {
                    default: 'Close Font Size Menu',
                    ja: '文字サイズメニューを閉じる'
                }
            },
            //className: 'bibi-button-font-size bibi-button-font-size-change',
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-change"></span>',
            Help: true
        }),
        id: "bibi-subpanel_font-size",
        open: function() {}
    }).addSection({
        Labels: {
            default: {
                default: 'Choose Font Size',
                ja: '文字サイズを選択'
            }
        }
    }).addButtonGroup({
        //Tiled: true,
        Buttons: [{
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Ex-Large',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>最大'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-exlarge"></span>',
            action: changeFontSizeStep, Step: 2
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Large',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>大'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-large"></span>',
            action: changeFontSizeStep, Step: 1
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-medium"></span>',
            action: changeFontSizeStep, Step: 0
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Small',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>小'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-small"></span>',
            action: changeFontSizeStep, Step: -1
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Ex-Small',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>最小'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-exsmall"></span>',
            action: changeFontSizeStep, Step: -2
        }]
    }).Buttons.forEach(function(Button) {
        if(Button.Step == I.FontSizeChanger.Step) I.setUIState(Button, "active");
    });

};


I.createLoupe = function() {

    I.Loupe = {};

    if(typeof S["loupe-mode"]      != "string" || S["loupe-mode"]      != "with-keys") S["loupe-mode"]      = "pointer-only";
    if(typeof S["loupe-max-scale"] != "number" || S["loupe-max-scale"] <=           1) S["loupe-max-scale"] = 4;

    if(S["loupe-mode"] == "with-keys" && !S["use-keys"]) return;

    sML.edit(I.Loupe, {
        scale: function(Scl, BibiEvent) { // Scl: Scale
            if(typeof Scl != "number") return false;
            const CurrentTfm = R.Main.Transformation;
            Scl = Math.round(Scl * 100) / 100;
            if(Scl == CurrentTfm.Scale) return;
            E.dispatch("bibi:changes-scale", Scl);
            if(Scl < 1) {
                this.transform({ Scale: Scl, Translation: { X: R.Main.offsetWidth * (1 - Scl) / 2, Y: R.Main.offsetHeight * (1 - Scl) / 2 } });
            } else if(Scl == 1) {
                this.transform({ Scale:   1, Translation: { X: 0, Y: 0 } });
            } else {
                if(this.UIState != "active") return false;
                if(!BibiEvent) BibiEvent = { Coord: { X: window.innerWidth / 2, Y: window.innerHeight / 2 } };
                /*
                const CurrentTransformOrigin = {
                    X: window.innerWidth  / 2 + CurrentTfm.Translation.X,
                    Y: window.innerHeight / 2 + CurrentTfm.Translation.Y
                };
                this.transform({
                    Scale: Scl,
                    Translation: {
                        X: CurrentTfm.Translation.X + (BibiEvent.Coord.X - (CurrentTransformOrigin.X + (BibiEvent.Coord.X - (CurrentTransformOrigin.X)) * (Scl / CurrentTfm.Scale))),
                        Y: CurrentTfm.Translation.Y + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y + (BibiEvent.Coord.Y - (CurrentTransformOrigin.Y)) * (Scl / CurrentTfm.Scale)))
                    }
                });
                */
                // ↓ simplified on culculation
                this.transform({
                    Scale: Scl,
                    Translation: {
                        X: CurrentTfm.Translation.X + (BibiEvent.Coord.X - window.innerWidth  / 2 - CurrentTfm.Translation.X) * (1 - Scl / CurrentTfm.Scale),
                        Y: CurrentTfm.Translation.Y + (BibiEvent.Coord.Y - window.innerHeight / 2 - CurrentTfm.Translation.Y) * (1 - Scl / CurrentTfm.Scale)
                    }
                });
            }
            E.dispatch("bibi:changed-scale", R.Main.Transformation.Scale);
        },
        transform: function(Tfm, Opt) { // Tfm: Transformation
            return new Promise(function(resolve, reject) {
                if(!Tfm) return reject();
                if(!Opt) Opt = {};
                clearTimeout(I.Loupe.Timer_onTransformEnd);
                O.HTML.classList.add("transforming");
                const CurrentTfm = R.Main.Transformation;
                if(typeof Tfm.Scale != "number") Tfm.Scale = CurrentTfm.Scale;
                if(!Tfm.Translation) Tfm.Translation = CurrentTfm.Translation;
                else {
                    if(typeof Tfm.Translation.X != "number") Tfm.Translation.X = CurrentTfm.Translation.X;
                    if(typeof Tfm.Translation.Y != "number") Tfm.Translation.Y = CurrentTfm.Translation.Y;
                }
                if(Tfm.Scale > 1) {
                    const OverflowX = window.innerWidth  * (0.5 * (Tfm.Scale - 1));
                    const OverflowY = window.innerHeight * (0.5 * (Tfm.Scale - 1));
                    Tfm.Translation.X = O.limitMinMax(Tfm.Translation.X, OverflowX * -1, OverflowX);
                    Tfm.Translation.Y = O.limitMinMax(Tfm.Translation.Y, OverflowY * -1, OverflowY);
                }
                sML.style(R.Main, {
                    transform: (function(Ps) {
                             if(Tfm.Translation.X && Tfm.Translation.Y) Ps.push( "translate(" + Tfm.Translation.X + "px" + ", " + Tfm.Translation.Y + "px" + ")");
                        else if(Tfm.Translation.X                     ) Ps.push("translateX(" + Tfm.Translation.X + "px"                                   + ")");
                        else if(                     Tfm.Translation.Y) Ps.push("translateY("                                   + Tfm.Translation.Y + "px" + ")");
                             if(Tfm.Scale != 1                        ) Ps.push(     "scale(" + Tfm.Scale                                                  + ")");
                        return Ps.length ? Ps.join(" ") : "";
                    })([])
                });
                R.Main.PreviousTransformation = R.Main.Transformation;
                R.Main.Transformation = Tfm;
                I.Loupe.Timer_onTransformEnd = setTimeout(function() {
                         if(R.Main.Transformation.Scale == 1) O.HTML.classList.remove("zoomed-in"), O.HTML.classList.remove("zoomed-out");
                    else if(R.Main.Transformation.Scale <  1) O.HTML.classList.remove("zoomed-in"), O.HTML.classList.add(   "zoomed-out");
                    else                                      O.HTML.classList.add(   "zoomed-in"), O.HTML.classList.remove("zoomed-out");
                    O.HTML.classList.remove("transforming");
                    resolve();
                    E.dispatch("bibi:transformed-book", Tfm);
                    if(!Opt.Temporary && S["use-loupe"] && S["use-cookie"]) O.Cookie.eat(O.BookURL, { Loupe: { Transformation: R.Main.Transformation } });
                }, 345);
            });
        },
        transformBack: function(Opt) {
            return I.Loupe.transform(R.Main.PreviousTransformation, Opt) || I.Loupe.transformReset(Opt);
        },
        transformReset: function(Opt) {
            return I.Loupe.transform({ Scale: 1, Translation: { X: 0, Y: 0 } }, Opt);
        },
        isAvailable: function(Mode) {
            if(!L.Opened) return false;
            if(this.UIState != "active") return false;
            if(S.BRL == "reflowable") return false;
            if(Mode == "TAP") {
                if(!I.KeyListener || !I.KeyListener.ActiveKeys["Space"]) return false;
                if(I.Slider && I.Slider.UIState == "active") return false;
            } else if(Mode == "MOVE") {
                if(R.Main.Transformation.Scale == 1) return false;
                if(I.Slider && I.Slider.UIState == "active") return false;
            } else {
                if(!R.PointerIsDowned) return false;
            }
            return true;
        },
        adjustScale: function(Scl) {
            return O.limitMinMax(Scl, 1, S["loupe-max-scale"]);
        },
        onTapped: function(Eve) {
            if(!this.isAvailable("TAP")) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(BibiEvent.Target.tagName) {
                if(/bibi-menu|bibi-slider/.test(BibiEvent.Target.id)) return false;
                if(O.isAnchorContent(BibiEvent.Target)) return false;
                if(S.RVM == "horizontal" && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
            }
            this.scale(this.adjustScale(R.Main.Transformation.Scale + 0.5 * (Eve.shiftKey ? -1 : 1) * 2), BibiEvent);
        },
        onPointerDown: function(Eve) {
            this.PointerDownCoord = O.getBibiEvent(Eve).Coord;
            this.PointerDownTransformation = {
                Scale: R.Main.Transformation.Scale,
                Translation: {
                    X: R.Main.Transformation.Translation.X,
                    Y: R.Main.Transformation.Translation.Y
                }
            };
        },
        onPointerUp: function(Eve) {
            O.HTML.classList.remove("dragging");
            I.Loupe.Dragging = false;
            delete this.PointerDownCoord;
            delete this.PointerDownTransformation;
        },
        onPointerMove: function(Eve) {
            if(!this.isAvailable("MOVE", Eve)) return false;
            if(R.Main.Transformation.Scale == 1 || !this.PointerDownCoord) return;
            I.Loupe.Dragging = true;
            O.HTML.classList.add("dragging");
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(this.Timer_TransitionRestore);
            sML.style(R.Main, { transition: "none", cursor: "move" });
            this.transform({
                Scale: R.Main.Transformation.Scale,
                Translation: {
                    X: this.PointerDownTransformation.Translation.X + (BibiEvent.Coord.X - this.PointerDownCoord.X),
                    Y: this.PointerDownTransformation.Translation.Y + (BibiEvent.Coord.Y - this.PointerDownCoord.Y)
                }
            });
            this.Timer_TransitionRestore = setTimeout(function() { sML.style(R.Main, { transition: "", cursor: "" }); }, 234);
        },
        lock: function() {
            E.dispatch("bibi:locked-loupe");
            I.Loupe.Locked = true;
        },
        unlock: function() {
            I.Loupe.Locked = false;
            E.dispatch("bibi:unlocked-loupe");
        }
    });
    I.isPointerStealth.addChecker(function() {
        if(I.Loupe.Dragging) return true;
        if(!I.KeyListener || !I.KeyListener.ActiveKeys["Space"]) return false;
        return true;
    });

    I.setToggleAction(I.Loupe, {
        onopened: function() {
            O.HTML.classList.add("loupe-active");
            O.HTML.classList.add("loupe-" + S["loupe-mode"]);
        },
        onclosed: function() {
            this.scale(1);
            O.HTML.classList.remove("loupe-" + S["loupe-mode"]);
            O.HTML.classList.remove("loupe-active");
        }
    });

    E.add("bibi:commands:activate-loupe",   function()      { I.Loupe.open(); });
    E.add("bibi:commands:deactivate-loupe", function()      { I.Loupe.close(); });
    E.add("bibi:commands:toggle-loupe",     function()      { I.Loupe.toggle(); });
    E.add("bibi:commands:scale",            function(Scale) { I.Loupe.scale(Scale); });

    E.add("bibi:tapped",         function(Eve) { I.Loupe.onTapped(     Eve); });
    E.add("bibi:downed-pointer", function(Eve) { I.Loupe.onPointerDown(Eve); });
    E.add("bibi:upped-pointer",  function(Eve) { I.Loupe.onPointerUp(  Eve); });
    E.add("bibi:moved-pointer",  function(Eve) { I.Loupe.onPointerMove(Eve); });

    E.add("bibi:changed-scale", function(Scale) { O.log('Changed Scale: ' + Scale); });

    E.add("bibi:opened", function() {
        I.Loupe.open();
        if(S["use-loupe"] && S["use-cookie"]) try { I.Loupe.transform(O.Cookie.remember(O.BookURL).Loupe.Transformation); } catch(Err) {}
    });

    E.add("bibi:changes-view",  function() { I.Loupe.scale(1); });
    E.add("bibi:opened-slider", I.Loupe.lock);
    E.add("bibi:closed-slider", I.Loupe.unlock);

    if(S["use-loupe"]) I.createLoupeUI();
    E.dispatch("bibi:created-loupe");

};


I.createLoupeUI = function() {

    // Button Group

    if(S["loupe-mode"] == "with-keys") {
        // SubPanel
        const ButtonGroup = I.createSubPanel({
            Opener: I.Menu.R.addButtonGroup({ Sticky: true, Tiled: true, id: "bibi-buttongroup_loupe" }).addButton({
                Type: "toggle",
                Labels: {
                    default: {
                        default: 'Zoom-in/out',
                        ja: '拡大機能'
                    },
                    active: {
                        default: 'Close Zoom-in/out Menu',
                        ja: '拡大機能メニューを閉じる'
                    }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-menu"></span>',
                Help: true
            }),
            id: "bibi-subpanel_loupe",
            open: function() {}
        }).addSection({
            Labels: {
                default: {
                    default: 'Zoom-in/out or Reset',
                    ja: '拡大縮小とリセット'
                }
            }
        }).addButtonGroup({
            Buttons: [{
                Type: "toggle",
                Labels: {
                    default: {
                        default: 'Zoom-in/out',
                        ja: '拡大機能'
                    },
                    active: {
                        default: 'Zoom-in/out <small>(activated)</small>',
                        ja: '拡大機能<small>（現在有効）</small>'
                    }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>',
                action: function() { I.Loupe.toggle(); },
                updateState: function(State) {
                    I.setUIState(this, typeof State == "string" ? State : I.Loupe.UIState == "active" ? "active" : "default");
                }
            }, {
                Type: "normal",
                Labels: {
                    default: { default: 'Reset Zoom-in/out', ja: '元のサイズに戻す' }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>',
                action: function() { I.Loupe.scale(1); },
                updateState: function(State) {
                    I.setUIState(this, typeof State == "string" ? State : R.Main.Transformation.Scale == 1 ? "disabled" : "default");
                }
            }]
        });
        I.Loupe.updateButtonState = function(State) {
            ButtonGroup.Buttons.forEach(function(Button) { Button.updateState(State); });
        };
        const PGroup = ButtonGroup.parentNode.appendChild(sML.create("div", { className: "bibi-pgroup" }));
        [{
            default: ['<strong>Zoom-in/out is activated</strong>:', '* Space + Click to Zoom-in'].join('<br />'),
            ja: ['<strong>拡大機能が有効のとき</strong>：', '・スペースキーを押しながらクリックで拡大'].join('<br />')
        }, {
            default: ['<strong>Zoomed-in</strong>:', '* Space + Shift + Click to Zoom-out', '* Space + Drag to Move the Book'].join('<br />'),
            ja: ['<strong>拡大中</strong>：', '・スペース + Shift キーを押しながらクリックで縮小', '・ドラッグで本を移動'].join('<br />')
        }].forEach(function(PContent) {
            PGroup.appendChild(sML.create("p", { className: "bibi-p", innerHTML: I.distillLabels.distillLanguage(PContent)[O.Language] }));
        });
    } else {
        const ButtonGroup = I.Menu.R.addButtonGroup({
            Sticky: true,
            Tiled: true,
            id: "bibi-buttongroup_loupe",
            Buttons: [{
                Type: "normal",
                Labels: {
                    default: { default: 'Zoom-in', ja: '拡大する' }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomin"></span>',
                Help: true,
                action: function() { I.Loupe.scale(I.Loupe.adjustScale(R.Main.Transformation.Scale + 0.5)); },
                updateState: function(State) {
                    I.setUIState(this, typeof State == "string" ? State : (R.Main.Transformation.Scale >= S["loupe-max-scale"]) ? "disabled" : "default");
                }
            },{ 
                Type: "normal",
                Labels: {
                    default: { default: 'Reset Zoom-in/out', ja: '元のサイズに戻す' }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-reset"></span>',
                Help: true,
                action: function() { I.Loupe.scale(1); },
                updateState: function(State) {
                    I.setUIState(this, typeof State == "string" ? State : (R.Main.Transformation.Scale == 1) ? "disabled" : "default");
                }
            }, {
                Type: "normal",
                Labels: {
                    default: { default: 'Zoom-out', ja: '縮小する' }
                },
                Icon: '<span class="bibi-icon bibi-icon-loupe bibi-icon-loupe-zoomout"></span>',
                Help: true,
                action: function() { I.Loupe.scale(I.Loupe.adjustScale(R.Main.Transformation.Scale - 0.5)); },
                updateState: function(State) {
                    I.setUIState(this, typeof State == "string" ? State : (R.Main.Transformation.Scale <= 1) ? "disabled" : "default");
                }
            }]
        });
        I.Loupe.updateButtonState = function(State) {
            ButtonGroup.Buttons.forEach(function(Button) { Button.updateState(State); });
        };
    }

    E.add("bibi:opened",           function() { I.Loupe.updateButtonState(); });

    E.add("bibi:transformed-book", function() { I.Loupe.updateButtonState(I.Loupe.Locked ? "disabled" : null); });
    E.add("bibi:locked-loupe",     function() { I.Loupe.updateButtonState("disabled"); });
    E.add("bibi:unlocked-loupe",   function() { I.Loupe.updateButtonState(); });

};


I.createButtonGroup = function(Par) {

    if(!Par || typeof Par != "object") return null;

    if(Par.Area && Par.Area.tagName) {
        const AreaToBeAppended = Par.Area;
        delete Par.Area;
        return AreaToBeAppended.addButtonGroup(Par);
    }

    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;

    const ClassNames = ["bibi-buttongroup"];
    if(Par.Tiled) ClassNames.push("bibi-buttongroup-tiled");
    if(Par.Sticky) ClassNames.push("sticky");
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(" ");

    const ButtonsToAdd = Par.Buttons instanceof Array ? Par.Buttons : Par.Button ? [Par.Button] : [];
    delete Par.Buttons;
    delete Par.Button;

    const ButtonGroup = sML.create("ul", Par);

    ButtonGroup.Buttons = [];
    ButtonGroup.addButton = function(Par) {
        const Button = I.createButton(Par);
        if(!Button) return null;
        Button.ButtonGroup = this;
        this.appendChild(sML.create("li", { className: "bibi-buttonbox bibi-buttonbox-" + Button.Type })).appendChild(Button)
        this.Buttons.push(Button);
        return Button;
    };
    ButtonsToAdd.forEach(function(ButtonToAdd) { ButtonGroup.addButton(ButtonToAdd); });

    ButtonGroup.Busy = false;

    return ButtonGroup;

};


I.createButton = function(Par) {

    if(!Par || typeof Par != "object") return null;
    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;

    Par.Type = (typeof Par.Type == "string" && /^(normal|toggle|radio|link)$/.test(Par.Type)) ? Par.Type : "normal";

    const ClassNames = ["bibi-button", "bibi-button-" + Par.Type];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(" ");

    if(typeof Par.Icon != "undefined" && !Par.Icon.tagName) {
        if(typeof Par.Icon == "string" && Par.Icon) {
            Par.Icon = sML.hatch(Par.Icon);
        } else {
            delete Par.Icon;
        }
    }

    const Button = sML.create((typeof Par.href == "string" ? "a" : "span"), Par);

    if(Button.Icon) {
        Button.IconBox = Button.appendChild(sML.create("span", { className: "bibi-button-iconbox" }));
        Button.IconBox.appendChild(Button.Icon);
        Button.Icon = Button.IconBox.firstChild;
        Button.IconBox.Button = Button.Icon.Button = Button;
    }

    Button.Label = Button.appendChild(sML.create("span", { className: "bibi-button-label" }));

    I.setFeedback(Button, {
        Help: Par.Help,
        StopPropagation: true,
        PreventDefault: (Button.href ? false : true)
    });

    Button.isAvailable = function() {
        if(Button.Busy) return false;
        if(Button.ButtonGroup && Button.ButtonGroup.Busy) return false;
        return (Button.UIState != "disabled");
    };

    if(typeof Button.action == "function") {
        Button.addTapEventListener("tapped", function(Eve) {
            if(!Button.isAvailable()) return false;
            Button.action.apply(Button, arguments);
        });
    }

    Button.Busy = false;

    return Button;

};


I.createSubPanel = function(Par) {

    if(!Par || typeof Par != "object") return null;

    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;

    const ClassNames = ["bibi-subpanel"];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(" ");

    const SectionsToAdd = Par.Sections instanceof Array ? Par.Sections : Par.Section ? [Par.Section] : [];
    delete Par.Sections;
    delete Par.Section;

    const SubPanel = O.Body.appendChild(sML.create("div", Par));
    SubPanel.Sections = [];

    SubPanel.addEventListener(O["pointerdown"], function(Eve) { Eve.stopPropagation(); });
    SubPanel.addEventListener(O["pointerup"],   function(Eve) { Eve.stopPropagation(); });

    I.setToggleAction(SubPanel, {
        onopened: function(Opt) {
            I.SubPanels.forEach(function(SP) {
                if(SP == SubPanel) return;
                SP.close({ ForAnotherSubPanel: true });
            });
            I.SubPanel = this;
            this.classList.add("opened");
            O.HTML.classList.add("subpanel-opened");
            if(SubPanel.Opener) {
                SubPanel.Bit.adjust(SubPanel.Opener);
                I.setUIState(SubPanel.Opener, "active");
            }
            if(Par.onopened) Par.onopened.apply(SubPanel, arguments);
        },
        onclosed: function(Opt) {
            this.classList.remove("opened");
            if(I.SubPanel == this) setTimeout(function() { I.SubPanel = null; }, 222);
            if(!Opt || !Opt.ForAnotherSubPanel) {
                O.HTML.classList.remove("subpanel-opened");
            }
            if(SubPanel.Opener) {
                I.setUIState(SubPanel.Opener, "default");
            }
            if(Par.onclosed) Par.onclosed.apply(SubPanel, arguments);
        }
    });
    if(SubPanel.Opener) SubPanel.Opener.addTapEventListener("tapped", function() { SubPanel.toggle(); });

    E.add("bibi:opened-panel",      SubPanel.close);
    E.add("bibi:closes-utilities",  SubPanel.close);

    SubPanel.Bit = SubPanel.appendChild(sML.create("span", { className: "bibi-subpanel-bit",
        SubPanel: SubPanel,
        adjust: function(Ele) {
            if(!Ele) return;
            const Center = O.getElementCoord(Ele).X + Ele.offsetWidth / 2 - O.getElementCoord(this.SubPanel).X;
            sML.style(this.SubPanel, { transformOrigin: Center + "px 0" });
            sML.style(this.SubPanel.Bit, { left: Center + "px" });
        }
    }));
    I.SubPanels.push(SubPanel);

    SubPanel.addSection = function(Par) {
        if(!Par || typeof Par != "object") return null;
        const SubPanelSection = I.createSubPanelSection(Par);
        if(!SubPanelSection) return null;
        SubPanelSection.SubPanel = this;
        this.appendChild(SubPanelSection)
        this.Sections.push(SubPanelSection);
        return SubPanelSection;
    };
    SectionsToAdd.forEach(function(SectionToAdd) { SubPanel.addSection(SectionToAdd); });

    return SubPanel;

};


I.createSubPanelSection = function(Par) {

    if(!Par || typeof Par != "object") return null;

    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;

    const ClassNames = ["bibi-subpanel-section"];
    if(Par.className) ClassNames.push(Par.className);
    Par.className = ClassNames.join(" ");

    const PGroupsToAdd = Par.PGroups instanceof Array ? Par.PGroups : Par.PGroup ? [Par.PGroup] : [];
    delete Par.PGroups;
    delete Par.PGroup;

    const ButtonGroupsToAdd = Par.ButtonGroups instanceof Array ? Par.ButtonGroups : Par.ButtonGroup ? [Par.ButtonGroup] : [];
    delete Par.ButtonGroups;
    delete Par.ButtonGroup;
    
    const SubPanelSection = sML.create("div", Par);

    // HGroup
    if(SubPanelSection.Labels) {
        SubPanelSection.Labels = I.distillLabels(SubPanelSection.Labels);
        SubPanelSection.appendChild(
            sML.create("div",  { className: "bibi-hgroup" })
        ).appendChild(
            sML.create("p",    { className: "bibi-h" })
        ).appendChild(
            sML.create("span", { className: "bibi-h-label", innerHTML: SubPanelSection.Labels["default"][O.Language] })
        );
    }

    // ButtonGroups
    SubPanelSection.ButtonGroups = [];
    SubPanelSection.addButtonGroup = function(Par) {
        if(!Par || typeof Par != "object") return null;
        const ButtonGroup = I.createButtonGroup(Par);
        this.appendChild(ButtonGroup);
        this.ButtonGroups.push(ButtonGroup);
        return ButtonGroup;
    };
    ButtonGroupsToAdd.forEach(function(ButtonGroupToAdd) { SubPanelSection.addButtonGroup(ButtonGroupToAdd); });

    return SubPanelSection;

};


I.createHelp = function() {

    I.Help = O.Body.appendChild(sML.create("div", { id: "bibi-help" }));
    I.Help.Message = I.Help.appendChild(sML.create("p", { className: "hidden", id: "bibi-help-message" }));

    I.Help.show = function(HelpText) {
        clearTimeout(I.Help.Timer_deactivate1);
        clearTimeout(I.Help.Timer_deactivate2);
        I.Help.classList.add("active");
        I.Help.Message.innerHTML = HelpText;
        setTimeout(function() {
            I.Help.classList.add("shown");
        }, 0);
    };
    I.Help.hide = function() {
        I.Help.Timer_deactivate1 = setTimeout(function() {
            I.Help.classList.remove("shown");
            I.Help.Timer_deactivate2 = setTimeout(function() { 
                I.Help.classList.remove("active");
            }, 200);
        }, 100);
    };

    // Optimize to Scrollbar Size
    sML.CSS.appendRule([
        "html.view-paged div#bibi-help",
        "html.view-horizontal div#bibi-help",
        "html.page-rtl.panel-opened div#bibi-help"
    ].join(", "), "bottom: " + (O.Scrollbars.Height) + "px;");

};


I.createPoweredBy = function() {

    I.PoweredBy = O.Body.appendChild(sML.create("div", { id: "bibi-poweredby", innerHTML: [
        '<p>',
            '<a href="' + Bibi["href"] + '" target="_blank" title="BiB/i | Official Website">',
                '<span>BiB/i</span>',
                '<img class="bibi-logo-white" alt="" src="' + O.RootPath + 'res/images/bibi-logo_white.png" />',
                '<img class="bibi-logo-black" alt="" src="' + O.RootPath + 'res/images/bibi-logo_black.png" />',
            '</a>',
        '</p>'
    ].join("") }));

    // Optimize to Scrollbar Size
    sML.CSS.appendRule([
        "html.view-paged div#bibi-poweredby",
        "html.view-horizontal div#bibi-poweredby",
        "html.page-rtl.panel-opened div#bibi-poweredby"
    ].join(", "), "bottom: " + (O.Scrollbars.Height) + "px;");

};


I.createNombre = function() {

    if(!S["use-nombre"]) return;

    // Progress > Nombre
    I.Nombre = O.Body.appendChild(sML.create("div", { id: "bibi-nombre",
        show: function() {
            clearTimeout(I.Nombre.Timer_hot);
            clearTimeout(I.Nombre.Timer_vanish);
            I.Nombre.classList.add("active");
            I.Nombre.Timer_hot = setTimeout(function() { I.Nombre.classList.add("hot"); }, 10);
        },
        hide: function() {
            clearTimeout(I.Nombre.Timer_hot);
            clearTimeout(I.Nombre.Timer_vanish);
            I.Nombre.classList.remove("hot");
            I.Nombre.Timer_vanish = setTimeout(function() { I.Nombre.classList.remove("active"); }, 255);
        },
        progress: function(PageInfo) {
            clearTimeout(I.Nombre.Timer_hide);
            if(!PageInfo || !PageInfo.Pages) PageInfo = R.getCurrent();
            if(typeof PageInfo.Percent != "number") PageInfo.Percent = Math.floor((PageInfo.Pages.EndPage.PageIndex + 1) / R.Pages.length * 100);
            if(!R.Current.Page) return;
            I.Nombre.Current.innerHTML = (function() {
                let PageNumber = PageInfo.Pages.StartPage.PageIndex + 1;
                if(PageInfo.Pages.StartPage != PageInfo.Pages.EndPage) PageNumber += '<span class="delimiter">-</span>' + (PageInfo.Pages.EndPage.PageIndex + 1);
                return PageNumber;
            })();
            I.Nombre.Delimiter.innerHTML = '/';
            I.Nombre.Total.innerHTML     = R.Pages.length;
            I.Nombre.Percent.innerHTML   = '(' + PageInfo.Percent + '<span class="unit">%</span>)';
            I.Nombre.show();
            I.Nombre.Timer_hide = setTimeout(I.Nombre.hide, 1234);
        }
    }));
    I.Nombre.Current   = I.Nombre.appendChild(sML.create("span", { id: "bibi-nombre-current"   }));
    I.Nombre.Delimiter = I.Nombre.appendChild(sML.create("span", { id: "bibi-nombre-delimiter" }));
    I.Nombre.Total     = I.Nombre.appendChild(sML.create("span", { id: "bibi-nombre-total"     }));
    I.Nombre.Percent   = I.Nombre.appendChild(sML.create("span", { id: "bibi-nombre-percent"   }));
    E.add("bibi:scrolls", I.Nombre.progress);
    E.add("bibi:resized", I.Nombre.progress);
    E.add("bibi:opened", function() { setTimeout(I.Nombre.progress, 321); });

    sML.CSS.appendRule("html.view-paged div#bibi-nombre",      "bottom: " + (O.Scrollbars.Height + 2) + "px;");
    sML.CSS.appendRule("html.view-horizontal div#bibi-nombre", "bottom: " + (O.Scrollbars.Height + 2) + "px;");
    sML.CSS.appendRule("html.view-vertical div#bibi-nombre",    "right: " + (O.Scrollbars.Height + 2) + "px;");

    E.dispatch("bibi:created-nombre");

};


I.createSlider = function() {

    I.Slider = O.Body.appendChild(
        sML.create("div", { id: "bibi-slider",
            reset: function() {
                //I.Slider.BookStretchingEach = 0;
                I.Slider.resetZoomingOutOfBook();
                I.Slider.resetThumbAndRail();
                I.Slider.progress();
            },
            zoomOutBook: function() {
                const BookMarginStart  = S.ARA == "horizontal" ? I.Menu.offsetHeight : 0;
                const BookMarginEnd    = 78;
                const Transformation = {
                    Scale: (R.Main["offset" + S.CC.A.SIZE.B] - (BookMarginStart + BookMarginEnd)) / (R.Main["offset" + S.CC.A.SIZE.B] - O.Scrollbars[S.CC.A.SIZE.B]),
                    Translation: {}
                };
                Transformation.Translation[S.CC.A.AXIS.L] = (S.RVM == "vertical" ? I.Menu.offsetHeight / 4 : 0);
                Transformation.Translation[S.CC.A.AXIS.B] = BookMarginStart - (R.Main["offset" + S.CC.A.SIZE.B]) * (1 - Transformation.Scale) / 2 - (S.RVM != "paged" ? O.Scrollbars[S.CC.A.SIZE.B] / 2 : 0);
                I.Slider.BookStretchingEach = (O.Body["offset" + S.CC.A.SIZE.L] / Transformation.Scale - R.Main["offset" + S.CC.A.SIZE.L]) / 2;
                R.Main.style["padding" + S.CC.A.BASE.B] = R.Main.style["padding" + S.CC.A.BASE.A] = I.Slider.BookStretchingEach + "px";
                if(S.ARA == S.SLA) R.Main.Book.style["padding" + (S.ARA == "horizontal" ? "Right" : "Bottom")] = I.Slider.BookStretchingEach + "px";
                I.Loupe.transform(Transformation, { Temporary: true }).then(I.Slider.progress);
            },
            resetZoomingOutOfBook: function() {
                I.Loupe.transformReset().then(function() {
                    //R.Main.style[S.CC.A.SIZE.l] = "";
                    R.Main.style["padding" + S.CC.A.BASE.B] = R.Main.style["padding" + S.CC.A.BASE.A] = "";
                    if(S.ARA == S.SLA) R.Main.Book.style["padding" + (S.ARA == "horizontal" ? "Right" : "Bottom")] = "";
                    I.Slider.BookStretchingEach = 0;
                    I.Slider.progress();
                });
            },
            resetThumbAndRail: function() {
                I.Slider.Thumb.style.width = I.Slider.Thumb.style.height = I.Slider.Rail.style.width = I.Slider.Rail.style.height = "";
                I.Slider.Thumb.LengthRatio = R.Main["offset" + S.CC.L.SIZE.L] / R.Main["scroll" + S.CC.L.SIZE.L];
                I.Slider.Thumb.style[S.CC.A.SIZE.l] = (      I.Slider.Thumb.LengthRatio * 100) + "%";
                I.Slider.Rail.style[ S.CC.A.SIZE.l] = (100 - I.Slider.Thumb.LengthRatio * 100) + "%";
                I.Slider.Rail.Coords = [O.getElementCoord(I.Slider.Rail)[S.CC.A.AXIS.L]];
                I.Slider.Rail.Coords.push(I.Slider.Rail.Coords[0] + I.Slider.Rail["offset" + S.CC.A.SIZE.L]);
            },
            progress: function() {
                if(I.Slider.Touching) return;
                I.Slider.Thumb.style.top = I.Slider.Thumb.style.right = I.Slider.Thumb.style.bottom = I.Slider.Thumb.style.left = "";
                const BASE = (S.RVM == "paged" && S.SLD == "ttb") ? S.CC.A.BASE.b : S.CC.A.OOLT.l;
                let ScrollBefore = R.Main["scroll" + S.CC.L.OOLT.L];
                let ScrollLength = R.Main["scroll" + S.CC.L.SIZE.L];
                if(S.RVM != "paged" || S.SLD != "ttb") ScrollLength -= I.Slider.BookStretchingEach * 2;
                I.Slider.Thumb.style[BASE] = ((ScrollBefore / ScrollLength) * 100) + "%";
                I.Slider.RailProgress.style.width = I.Slider.RailProgress.style.height = "";
                let Progress = O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb["offset" + S.CC.A.SIZE.L] / 2 - O.getElementCoord(I.Slider.Rail)[S.CC.A.AXIS.L];
                if(S.ARD == "rtl") Progress = I.Slider.Rail["offset" + S.CC.A.SIZE.L] - Progress;
                I.Slider.RailProgress.style[S.CC.A.SIZE.l] = (Progress / I.Slider.Rail["offset" + S.CC.A.SIZE.L] * 100) + "%";
            },
            initializeBookMap: function() {
                I.Slider.BookMap.BMSpreads = [], I.Slider.BookMap.BMItems = [];
                R.Spreads.forEach(function(Spread) {
                    const BMSpread = Spread.BMSpread = sML.create("div", { className: "bookmap-spread", Spread: Spread, BMSpreadBox: sML.create("div") });
                    I.Slider.BookMap.BMSpreads.push(BMSpread);
                    BMSpread.BMItems = [];
                    Spread.Items.forEach(function(Item) {
                        const BMItem = Item.BMItem = sML.create("span", { className: "bookmap-item", Item: Item, BMItemBox: sML.create("div"), BMSpread: BMSpread });
                        I.Slider.BookMap.BMItems.push(BMItem), BMSpread.BMItems.push(BMItem);
                        BMSpread.appendChild(BMItem.BMItemBox).appendChild(BMItem);
                    });
                    I.Slider.BookMap.appendChild(BMSpread.BMSpreadBox).appendChild(BMSpread);
                    //E.add("bibi:reset-spread", function(Spread) { if(L.Opened) setTimeout(function() { I.Slider.resetBookMapSpread(Spread.BMSpread); }, 123); });
                });
            },
            resetBookMap: function() {
                I.Slider.BookMap.BMSpreads.forEach(I.Slider.resetBookMapSpread);
            },
            resetBookMapSpread: function(BMSpread) {
                clearTimeout(I.Slider.Timer_appendBookMap);
                if(I.Slider.BookMap.paretElement) I.Slider.BookMapBox.removeChild(I.Slider.BookMap);
                const BMSpreadBox = BMSpread.BMSpreadBox;
                const Spread = BMSpread.Spread, SpreadBox = Spread.SpreadBox;
                BMSpreadBox.className = "bookmap-spread-box";
                Array.prototype.forEach.call(SpreadBox.classList, function(ClassName) { if(ClassName != "spread-box") BMSpreadBox.classList.add(ClassName); });
                BMSpreadBox.style[S.CC.A.SIZE.b] = BMSpread.style[S.CC.A.SIZE.b] = "";
                BMSpreadBox.style[S.CC.A.SIZE.l] = (SpreadBox["offset" + S.CC.L.SIZE.L] / R.Main["scroll" + S.CC.L.SIZE.L] * 100) + "%";
                BMSpread.style[S.CC.A.SIZE.l] = (Spread["offset" + S.CC.L.SIZE.L] / SpreadBox["offset" + S.CC.L.SIZE.L] * 100) + "%";
                if(BMSpread.BMPages) BMSpread.BMPages.forEach(function(OldBMPage) { if(OldBMPage.parentElement) OldBMPage.parentElement.removeChild(OldBMPage); });
                BMSpread.BMPages = [];
                BMSpread.BMItems.forEach(function(BMItem) {
                    const BMItemBox = BMItem.BMItemBox;
                    const Item = BMItem.Item, ItemBox = Item.ItemBox;
                    BMItemBox.className = "bookmap-item-box";
                    Array.prototype.forEach.call(ItemBox.classList, function(ClassName) { if(ClassName != "item-box") BMItemBox.classList.add(ClassName); });
                    BMItemBox.style[S.CC.A.SIZE.b] = (ItemBox["offset" + S.CC.L.SIZE.B] / Spread["offset" + S.CC.L.SIZE.B] * 100) + "%";
                    BMItemBox.style[S.CC.A.SIZE.l] = (ItemBox["offset" + S.CC.L.SIZE.L] / Spread["offset" + S.CC.L.SIZE.L] * 100) + "%";
                    BMItem.BMPages = [];
                    Item.Pages.forEach(function(Page) {
                        const BMPage = Page.BMPage = sML.create("span", { className: "bookmap-page", Page: Page });
                        BMPage.style[S.CC.A.SIZE.b] = "";
                        BMPage.style[S.CC.A.SIZE.l] = (1 / Item.Pages.length * 100) + "%";
                        if(I.Nombre) {
                            BMPage.addEventListener(O["pointerover"], function() {
                                if(I.Slider.Touching) return;
                                clearTimeout(I.Slider.Timer_BMPagePointerOut);
                                I.Nombre.progress({ Pages: { StartPage: Page, EndPage: Page } });
                            });
                            BMPage.addEventListener(O["pointerout"], function() {
                                if(I.Slider.Touching) return;
                                I.Slider.Timer_BMPagePointerOut = setTimeout(function() {
                                    clearTimeout(I.Nombre.Timer_hide);
                                    I.Nombre.hide();
                                }, 200);
                            });
                        }
                        BMPage.Labels = { default: { default: "P." + (Page.PageIndex + 1) } };
                        I.setFeedback(BMPage);
                        if(Item.SpreadPair && Item.ItemRef["rendition:layout"] == "pre-paginated" && Item.SpreadPair.ItemRef["rendition:layout"] == "pre-paginated") {
                            E.add(BMPage, "bibi:hovers",   function(Eve) { this.Page.Item.SpreadPair.Pages[0].BMPage.classList.add(   "hover"); });
                            E.add(BMPage, "bibi:unhovers", function(Eve) { this.Page.Item.SpreadPair.Pages[0].BMPage.classList.remove("hover"); });
                        }
                        BMSpread.BMPages.push(BMPage), BMItem.BMPages.push(BMPage);
                        BMItemBox.appendChild(BMPage);
                    });
                });
                I.Slider.Timer_appendBookMap = setTimeout(function() {
                    I.Slider.BookMapBox.appendChild(I.Slider.BookMap);
                }, 345);
            },
            getTouchStartCoord: function(Eve) {
                return (Eve.target == I.Slider.Thumb) ?
                    O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L] : // ← Move Thumb naturally. // ↓ Bring Thumb's center to the touched coord at the next pointer moving.
                    O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb["offset" + S.CC.A.SIZE.L] / 2;
            },
            onTouchStart: function(Eve) {
                if(!Eve.target || (!I.Slider.contains(Eve.target) && Eve.target != I.Slider)) return;
                Eve.preventDefault();
                //R.Main.style.overflow = "hidden"; // ← ↓ to stop momentum scrolling
                //setTimeout(function() { R.Main.style.overflow = ""; }, 1);
                I.Slider.Touching = true;
                I.Slider.TouchStartThumbCenterCoord = O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb["offset" + S.CC.A.SIZE.L] / 2;
                I.Slider.TouchStartCoord = I.Slider.TouchingCoord = I.Slider.getTouchStartCoord(Eve);
                clearTimeout(I.Slider.Timer_onTouchEnd);
                O.HTML.classList.add("slider-sliding");
                E.add("bibi:moved-pointer", I.Slider.onTouchMove);
            },
            onTouchMove: function(Eve) {
                I.Slider.TouchingCoord = O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L];
                I.Slider.flip(Eve);
            },
            onTouchEnd: function(Eve) {
                if(!I.Slider.Touching) return;
                I.Slider.Touching = false;
                E.remove("bibi:moved-pointer", I.Slider.onTouchMove);
                I.Slider.onTouchMove(Eve);
                I.Slider.Timer_onTouchEnd = setTimeout(function() { O.HTML.classList.remove("slider-sliding"); }, 125);
            },
            flip: function(Eve) {
                const TargetPage = I.Slider.getNearestBMPage(I.Slider.getTouchEndElement(Eve)).Page;
                if(TargetPage != R.Current.Pages.StartPage && TargetPage != R.Current.Pages.EndPage) {
                    R.focusOn({ Destination: TargetPage, Duration: 0 });
                }
                if(I.Slider.Touching) {
                    let Translation = I.Slider.TouchingCoord - I.Slider.TouchStartCoord;
                    let TranslatedCenter = I.Slider.TouchStartThumbCenterCoord + Translation;
                         if(TranslatedCenter < I.Slider.Rail.Coords[0]) Translation = I.Slider.Rail.Coords[0] - I.Slider.TouchStartThumbCenterCoord;
                    else if(TranslatedCenter > I.Slider.Rail.Coords[1]) Translation = I.Slider.Rail.Coords[1] - I.Slider.TouchStartThumbCenterCoord;
                    sML.style(I.Slider.Thumb,        { transform: "translate" + S.CC.A.AXIS.L + "(" + Translation + "px)" });
                    sML.style(I.Slider.RailProgress, { transform: "scale" + S.CC.A.AXIS.L + "(" + (1 + Translation / I.Slider.RailProgress["offset" + S.CC.A.SIZE.L] * S.CC.A.AXIS.PM) + ")" });
                } else {
                    sML.style(I.Slider.Thumb,        { transform: "" });
                    sML.style(I.Slider.RailProgress, { transform: "" });
                    I.Slider.progress();
                }
            },
            getTouchEndElement: function(Eve) {
                return I.Slider.BookMap.contains(Eve.target) ? Eve.target : (function(TouchEndElementPoint) {
                    TouchEndElementPoint[S.CC.A.AXIS.L] = O.limitMinMax(I.Slider.TouchingCoord, I.Slider.Rail.Coords[0], I.Slider.Rail.Coords[1]);
                    TouchEndElementPoint[S.CC.A.AXIS.B] = O.getElementCoord(I.Slider)[S.CC.A.AXIS.B] + I.Slider["offset" + S.CC.A.SIZE.B] / 2;
                    return document.elementFromPoint(TouchEndElementPoint.X, TouchEndElementPoint.Y);
                })({});
            },
            getNearestBMPage: function(Ele) {
                if(Ele.classList.contains("bookmap-page")) return Ele;
                const Ones = (Ele.classList.contains("bookmap-item") || Ele.classList.contains("bookmap-spread")) ? Ele.BMPages : I.Slider.BookMap.BMSpreads;
                const TouchingCoord = I.Slider.TouchingCoord * S.CC.A.AXIS.PM;
                let TheOne = Ones[Ones.length - 1], PrevOne = null, PrevOneFootCoord = 0;
                for(let l = Ones.length, i = 0; i < l; i++) {
                    const One = Ones[i], OneCoord = O.getElementCoord(One)[S.CC.A.AXIS.L], OneFootCoord = (OneCoord + (S.ARD != "rtl" ? One["offset" + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    if(OneFootCoord < TouchingCoord) {
                        PrevOne = One, PrevOneFootCoord = OneFootCoord;
                        continue;
                    }
                    const OneHeadCoord = (OneCoord + (S.ARD == "rtl" ? One["offset" + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    TheOne = (TouchingCoord < OneHeadCoord && PrevOne && TouchingCoord - PrevOneFootCoord < OneHeadCoord - TouchingCoord) ? PrevOne : One;
                }
                return I.Slider.getNearestBMPage(TheOne);
            },
            activate: function() {
                if(I.Nombre) {
                    I.Slider.Thumb.addEventListener(O["pointerover"], I.Nombre.show);
                    I.Slider.Thumb.addEventListener(O["pointerout"],  I.Nombre.hide);
                }
                I.Slider.addEventListener(O["pointerdown"], I.Slider.onTouchStart);
                R.Items.concat(O).forEach(function(Item) {
                    Item.HTML.addEventListener(O["pointerup"], I.Slider.onTouchEnd);
                });
                E.add("bibi:scrolls", I.Slider.progress);
                I.Slider.progress();
            },
            deactivate: function() {
                if(I.Nombre) {
                    I.Slider.Thumb.removeEventListener(O["pointerover"], I.Nombre.show);
                    I.Slider.Thumb.removeEventListener(O["pointerout"],  I.Nombre.hide);
                }
                I.Slider.removeEventListener(O["pointerdown"], I.Slider.onTouchStart);
                R.Items.concat(O).forEach(function(Item) {
                    Item.HTML.removeEventListener(O["pointerup"], I.Slider.onTouchEnd);
                });
                E.remove("bibi:scrolls", I.Slider.progress);
            }
        })
    );
    I.Slider.BookMapBox   = I.Slider.appendChild(sML.create("div", { id: "bibi-slider-bookmap-box" }));
    I.Slider.BookMap      = I.Slider.BookMapBox.appendChild(sML.create("div", { id: "bibi-slider-bookmap" }));
    I.Slider.Rail         = I.Slider.BookMap.appendChild(sML.create("div", { id: "bibi-slider-rail" }));
    I.Slider.RailProgress = I.Slider.Rail.appendChild(sML.create("div", { id: "bibi-slider-rail-progress" }));
    I.Slider.Thumb        = I.Slider.BookMap.appendChild(sML.create("div", { id: "bibi-slider-thumb", Labels: { default: { default: "Slider Thumb", ja: "スライダー上の好きな位置からドラッグを始められます" } } }));
    I.setFeedback(I.Slider.Thumb);
    I.setToggleAction(I.Slider, {
        onopened: function() {
            I.Slider.zoomOutBook();
            I.Slider.progress();
            O.HTML.classList.add("slider-opened");
            E.dispatch("bibi:opened-slider");
        },
        onclosed: function() {
            I.Slider.resetZoomingOutOfBook();
            I.Slider.progress();
            O.HTML.classList.remove("slider-opened");
            E.dispatch("bibi:closed-slider");
            setTimeout(I.Slider.resetBookMap, 456);
        }
    });
    E.add("bibi:commands:open-slider",   I.Slider.open);
    E.add("bibi:commands:close-slider",  I.Slider.close);
    E.add("bibi:commands:toggle-slider", I.Slider.toggle);

    E.add("bibi:opens-utilities",   function(Opt) { E.dispatch("bibi:commands:open-slider",   Opt); });
    E.add("bibi:closes-utilities",  function(Opt) { E.dispatch("bibi:commands:close-slider",  Opt); });
    E.add("bibi:toggles-utilities", function(Opt) { E.dispatch("bibi:commands:toggle-slider", Opt); });

    E.add("bibi:opened",       I.Slider.activate);
    E.add("bibi:laid-out",     I.Slider.reset);
  //E.add("bibi:tapped-shade", I.Slider.close);

    I.Slider.addEventListener("wheel", R.Main.onWheeled, { capture: true, passive: false });

    // Optimize to Scrollbar Size
    sML.CSS.appendRule([
        "html.view-paged div#bibi-slider",
        "html.view-horizontal div#bibi-slider"
    ].join(", "), "height: " + (O.Scrollbars.Height) + "px;");
    sML.CSS.appendRule([
        "html.view-vertical div#bibi-slider"
    ].join(", "), "width: " + (O.Scrollbars.Width) + "px;");

    I.Slider.initializeBookMap();
    E.dispatch("bibi:created-slider");

};


I.createTurner = function() {

    I.Turner = {
        Back: { Distance: -1 }, Forward: { Distance: 1 }, "top": undefined, "right": undefined, "bottom": undefined, "left": undefined,
        update: function() {
            if(S.RVM == "vertical") {
                this["left"] = this["right"] = undefined;
                this["top"] = this.Back, this["bottom"] = this.Forward;
            } else {
                this["top"] = this["bottom"] = undefined;
                if(S.PPD == "ltr") this["left"]  = this.Back, this["right"] = this.Forward;
                else               this["right"] = this.Back, this["left"]  = this.Forward;
            }
        },
        isAbleToTurn: function(Par) {
            if(typeof Par.Distance != "number" && typeof Par.Direction == "string") {
                if(I.Turner[Par.Direction]) Par.Distance = I.Turner[Par.Direction].Distance;
            }
            if(typeof Par.Distance == "number") {
                switch(Par.Distance) {
                    case -1: return (L.Opened && (R.Current.Pages.StartPage != R.Pages[0]                  || R.Current.Pages.StartPageRatio != 100));
                    case  1: return (L.Opened && (R.Current.Pages.EndPage   != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio   != 100));
                }
            }
            return false;
        }
    };

    E.add("bibi:opened",           function() { I.Turner.update(); });
    E.add("bibi:updated-settings", function() { I.Turner.update(); });

};


I.createArrows = function() {

    if(!S["use-arrows"]) return;

    I.Arrows = {
        navigate: function() {
            setTimeout(function() {
                R.getCurrent();
                [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                    if(I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance })) Arrow.classList.add("glowing");
                });
                setTimeout(function() {
                    [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                        Arrow.classList.remove("glowing");
                    });
                }, 1234);
            }, 400);
        },
        check: function() {
            [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                I.Turner.isAbleToTurn({ Distance: Arrow.Turner.Distance }) ? O.replaceClass(Arrow, "unavailable", "available") : O.replaceClass(Arrow, "available", "unavailable");
            });
        },
        areAvailable: function(BibiEvent) {
            if(!L.Opened) return false;
            if(I.Panel && I.Panel.UIState == "active") return false;
            if(BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) return false;
            if(S.RVM == "paged") {
                if(I.Slider && BibiEvent.Coord.Y > window.innerHeight - I.Slider.offsetHeight) return false;
            } else {
                if(S["full-breadth-layout-in-scroll"]) return false;
                if(S.RVM == "horizontal") {
                    if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
                } else if(S.RVM == "vertical") {
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

    O.HTML.classList.add("arrows-active");

    I.Arrows.Back    = I.Turner.Back.Arrow    = O.Body.appendChild(sML.create("div", { id: "bibi-arrow-back",    Labels: { default: { default: 'Back',    ja: '戻る' } }, Turner: I.Turner.Back    }));
    I.Arrows.Forward = I.Turner.Forward.Arrow = O.Body.appendChild(sML.create("div", { id: "bibi-arrow-forward", Labels: { default: { default: 'Forward', ja: '進む' } }, Turner: I.Turner.Forward }));
    I.Arrows.Back.Pair = I.Arrows.Forward, I.Arrows.Forward.Pair = I.Arrows.Back;
    [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
        //Arrow.isAvailable = function() { return I.Turner.isAbleToTurn(this); };
        I.setFeedback(Arrow);
        const FunctionsToBeCanceled = [
            Arrow.showHelp,
            Arrow.hideHelp,
            Arrow.onBibiTap
        ];
        if(!O.Touch) FunctionsToBeCanceled.push(Arrow.onBibiHover);
        FunctionsToBeCanceled.forEach(function(FunctionToBeCanceled) { FunctionToBeCanceled = function() { return false; }; });
    });

    if(!O.Touch) {
        E.add("bibi:moved-pointer", function(Eve) { // try hovering
            if(!L.Opened) return false;
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(I.Arrows.areAvailable(BibiEvent)) {
                const Dir = (S.RVM == "vertical") ? BibiEvent.Division.Y : BibiEvent.Division.X;
                if(I.Turner.isAbleToTurn({ Direction: Dir })) {
                    const Arrow = I.Turner[Dir].Arrow;
                    E.dispatch(Arrow,      "bibi:hovers",   Eve);
                    E.dispatch(Arrow.Pair, "bibi:unhovers", Eve);
                    BibiEvent.Target.ownerDocument.documentElement.setAttribute("data-bibi-cursor", Dir);
                    return;
                }
            }
            E.dispatch(I.Arrows.Back,    "bibi:unhovers", Eve);
            E.dispatch(I.Arrows.Forward, "bibi:unhovers", Eve);
            R.Items.concat(O).forEach(function(Item) {
                Item.HTML.removeAttribute("data-bibi-cursor");
            });
        });
        E.add("bibi:opened", function() {
            R.Items.concat(O).forEach(function(Item) {
                O.forEach(Item.Body.querySelectorAll("img"), function(Img) { Img.addEventListener(O["pointerdown"], O.preventDefault); });
            });
        });
    }

    E.add("bibi:tapped", function(Eve) { // try moving
        if(!L.Opened) return false;
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(/^bibi-arrow-/.test(BibiEvent.Target.id)) return false;
        if(!I.Arrows.areAvailable(BibiEvent)) return false;
        const Dir = (S.RVM == "vertical") ? BibiEvent.Division.Y : BibiEvent.Division.X;
        if(I.Turner.isAbleToTurn({ Direction: Dir })) {
            const Arrow = I.Turner[Dir].Arrow;
            E.dispatch(Arrow, "bibi:taps",   Eve);
            E.dispatch(Arrow, "bibi:tapped", Eve);
            R.moveBy({ Distance: I.Turner[Dir].Distance });
        }
    });

    E.add("bibi:commands:move-by", function(Par) { // indicate direction
        if(!L.Opened || !Par || typeof Par.Distance != "number") return false;
        switch(Par.Distance) {
            case -1: return E.dispatch(I.Arrows.Back,    "bibi:tapped", null);
            case  1: return E.dispatch(I.Arrows.Forward, "bibi:tapped", null);
        }
        return false;
    });

    E.add("bibi:loaded-item", function(Item) {
        /*
        sML.CSS.appendRule('html[data-bibi-cursor="left"]',   "cursor: w-resize;", Item.contentDocument);
        sML.CSS.appendRule('html[data-bibi-cursor="right"]',  "cursor: e-resize;", Item.contentDocument);
        sML.CSS.appendRule('html[data-bibi-cursor="top"]',    "cursor: n-resize;", Item.contentDocument);
        sML.CSS.appendRule('html[data-bibi-cursor="bottom"]', "cursor: s-resize;", Item.contentDocument);
        */
        sML.CSS.appendRule('html[data-bibi-cursor]', "cursor: pointer;", Item.contentDocument);
    });

    E.add("bibi:opened",           function()    { I.Arrows.check(); I.Arrows.navigate(); });
    E.add("bibi:changed-view",     function()    { I.Arrows.navigate(); });
    E.add("bibi:scrolled",         function()    { I.Arrows.check(); });

    E.dispatch("bibi:created-arrows");

};


I.createSwipeListener = function() {

    I.SwipeListener = {
        update: function() {
            S.RVM == "paged" ? this.open() : this.close();
            return this.State;
        },
        activateElement: function(Ele) {
            Ele.addEventListener("touchstart", I.SwipeListener.onTouchStart);
            Ele.addEventListener("touchmove",  I.SwipeListener.onTouchMove);
            Ele.addEventListener("touchend",   I.SwipeListener.onTouchEnd);
            if(!O.Touch) {
                Ele.addEventListener('wheel', R.onWheel);
                O.forEach(Ele.querySelectorAll("img"), function(Img) { Img.addEventListener(O["pointerdown"], O.preventDefault); });
            }
        },
        deactivateElement: function(Ele) {
            Ele.removeEventListener("touchstart", I.SwipeListener.onTouchStart);
            Ele.removeEventListener("touchmove",  I.SwipeListener.onTouchMove);
            Ele.removeEventListener("touchend",   I.SwipeListener.onTouchEnd);
            if(!O.Touch) {
                Ele.removeEventListener('wheel', R.onWheel);
                O.forEach(Ele.querySelectorAll("img"), function(Img) { Img.removeEventListener(O["pointerdown"], O.preventDefault); });
            }
        },
        onTouchStart: function(Eve) {
            const EventCoord = O.getBibiEventCoord(Eve);
            I.SwipeListener.TouchStartedOn = { X: EventCoord.X, Y: EventCoord.Y, T: Eve.timeStamp, SL: R.Main.scrollLeft, ST: R.Main.scrollTop };
        },
        onTouchMove: function(Eve) {
            if(Eve.touches.length == 1 && document.body.clientWidth / window.innerWidth <= 1) Eve.preventDefault();
        },
        onTouchEnd: function(Eve) {
            if(!I.SwipeListener.TouchStartedOn) return;
            if(I.SwipeListener.TouchStartedOn.SL != R.Main.scrollLeft || I.SwipeListener.TouchStartedOn.ST != R.Main.scrollTop) return;
            if(document.body.clientWidth / window.innerWidth <= 1 && Eve.timeStamp - I.SwipeListener.TouchStartedOn.T <= 300) {
                const EventCoord = O.getBibiEventCoord(Eve);
                const VarX = EventCoord.X - I.SwipeListener.TouchStartedOn.X;
                const VarY = EventCoord.Y - I.SwipeListener.TouchStartedOn.Y;
                if(Math.sqrt(Math.pow(VarX, 2) + Math.pow(VarY, 2)) >= 10) {
                    const Deg = Math.atan2((VarY ? VarY * -1 : 0), VarX) * 180 / Math.PI;
                    let From = "", To = "";
                         if( 120 >= Deg && Deg >=   60) From = "bottom", To = "top";
                    else if(  30 >= Deg && Deg >=  -30) From = "left",   To = "right";
                    else if( -60 >= Deg && Deg >= -120) From = "top",    To = "bottom";
                    else if(-150 >= Deg || Deg >=  150) From = "right",  To = "left";
                    if(I.Turner.isAbleToTurn({ Direction: From })) {
                        R.moveBy({ Distance: I.Turner[From].Distance });
                    }
                }
            }
            delete I.SwipeListener.TouchStartedOn;
        },
        onWheeled: function(Eve) {
            if(!Eve.BibiWheeled) return;
            clearTimeout(I.SwipeListener.onWheeled.Timer_cooldown);
            I.SwipeListener.onWheeled.Timer_cooldown = setTimeout(function() { I.SwipeListener.onWheeled.hot = false; }, 248);
            if(!I.SwipeListener.onWheeled.hot) {
                I.SwipeListener.onWheeled.hot = true;
                R.moveBy({ Distance: Eve.BibiWheeled.Distance });
            }
        }
    };

    I.setToggleAction(I.SwipeListener, {
        onopened: function() {
            O.HTML.classList.add("swipe-active");
            if(!O.Touch) E.add("bibi:wheeled", I.SwipeListener.onWheeled);
            I.SwipeListener.activateElement(R.Main);
            R.Items.forEach(function(Item) { I.SwipeListener.activateElement(Item.HTML); });
        },
        onclosed: function() {
            O.HTML.classList.remove("swipe-active");
            if(!O.Touch) E.remove("bibi:wheeled", I.SwipeListener.onWheeled);
            I.SwipeListener.deactivateElement(R.Main);
            R.Items.forEach(function(Item) { I.SwipeListener.deactivateElement(Item.HTML); });
        }
    });

    E.add("bibi:opened", function() {
        I.SwipeListener.update();
        E.add("bibi:updated-settings", function(    ) { I.SwipeListener.update(); });
        E.add("bibi:loaded-item",      function(Item) { if(S.RVM == "paged") I.SwipeListener.activateElement(Item.HTML); });
        //I.SwipeListener.addButton();
    });
    E.add("bibi:commands:activate-swipe",   function() { I.SwipeListener.open(); });
    E.add("bibi:commands:deactivate-swipe", function() { I.SwipeListener.close(); });
    E.add("bibi:commands:toggle-swipe",     function() { I.SwipeListener.toggle(); });

    E.dispatch("bibi:created-swipelistener");

};


I.createKeyListener = function() {

    if(!S["use-keys"]) return;

    // Keys
    I.KeyListener = {
        ActiveKeys: {},
        KeyCodes: { "keydown": {}, "keyup": {}, "keypress": {} },
        updateKeyCodes: function(EventTypes, KeyCodesToUpdate) {
            if(typeof EventTypes.join != "function")  EventTypes = [EventTypes];
            if(typeof KeyCodesToUpdate == "function") KeyCodesToUpdate = KeyCodesToUpdate();
            EventTypes.forEach(function(EventType) {
                I.KeyListener.KeyCodes[EventType] = sML.edit(I.KeyListener.KeyCodes[EventType], KeyCodesToUpdate);
            });
        },
        MovingParameters: {
            "Space":  1,  "Page Up":     -1,  "Page Down":      1,  "End": "foot",  "Home": "head",
            "SPACE": -1,  "PAGE UP": "head",  "PAGE DOWN": "foot",  "END": "foot",  "HOME": "head"
        },
        updateMovingParameters: function() {
            switch(S.ARD) {
                case "ttb": return sML.edit(I.KeyListener.MovingParameters, {
                    "Up Arrow":     -1,  "Right Arrow":      0,  "Down Arrow":      1,  "Left Arrow":      0,
                    "UP ARROW": "head",  "RIGHT ARROW":     "",  "DOWN ARROW": "foot",  "LEFT ARROW":     ""
                });
                case "ltr": return sML.edit(I.KeyListener.MovingParameters, {
                    "Up Arrow":      0,  "Right Arrow":      1,  "Down Arrow":      0,  "Left Arrow":     -1,
                    "UP ARROW":     "",  "RIGHT ARROW": "foot",  "DOWN ARROW":     "",  "LEFT ARROW": "head"
                });
                case "rtl": return sML.edit(I.KeyListener.MovingParameters, {
                    "Up Arrow":      0,  "Right Arrow":     -1,  "Down Arrow":      0,  "Left Arrow":      1,
                    "UP ARROW":     "",  "RIGHT ARROW": "head",  "DOWN ARROW":     "",  "LEFT ARROW": "foot"
                });
                default: return sML.edit(I.KeyListener.MovingParameters, {
                    "Up Arrow":      0,  "Right Arrow":      0,  "Down Arrow":      0,  "Left Arrow":      0,
                    "UP ARROW":     "",  "RIGHT ARROW":     "",  "DOWN ARROW":     "",  "LEFT ARROW":     ""
                });
            }
        },
        getBibiKeyName: function(Eve) {
            const KeyName = I.KeyListener.KeyCodes[Eve.type][Eve.keyCode];
            return KeyName ? KeyName : "";
        },
        onEvent: function(Eve) {
            if(!L.Opened) return false;
            Eve.BibiKeyName = I.KeyListener.getBibiKeyName(Eve);
            Eve.BibiModifierKeys = [];
            if(Eve.shiftKey) Eve.BibiModifierKeys.push("Shift");
            if(Eve.ctrlKey)  Eve.BibiModifierKeys.push("Control");
            if(Eve.altKey)   Eve.BibiModifierKeys.push("Alt");
            if(Eve.metaKey)  Eve.BibiModifierKeys.push("Meta");
            //if(!Eve.BibiKeyName) return false;
            if(Eve.BibiKeyName) Eve.preventDefault();
            return true;
        },
        onkeydown:  function(Eve) {
            if(!I.KeyListener.onEvent(Eve)) return false;
            if(Eve.BibiKeyName) {
                if(!I.KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    I.KeyListener.ActiveKeys[Eve.BibiKeyName] = Date.now();
                } else {
                    E.dispatch("bibi:is-holding-key", Eve);
                }
            }
            E.dispatch("bibi:downs-key", Eve);
        },
        onkeyup:    function(Eve) {
            if(!I.KeyListener.onEvent(Eve)) return false;
            if(I.KeyListener.ActiveKeys[Eve.BibiKeyName] && Date.now() - I.KeyListener.ActiveKeys[Eve.BibiKeyName] < 300) {
                E.dispatch("bibi:touches-key", Eve);
                E.dispatch("bibi:touched-key", Eve);
            }
            if(Eve.BibiKeyName) {
                if(I.KeyListener.ActiveKeys[Eve.BibiKeyName]) {
                    delete I.KeyListener.ActiveKeys[Eve.BibiKeyName];
                }
            }
            E.dispatch("bibi:ups-key", Eve);
        },
        onkeypress:  function(Eve) {
            if(!I.KeyListener.onEvent(Eve)) return false;
            E.dispatch("bibi:presses-key", Eve);
        },
        observe: function(Doc) {
            ["keydown", "keyup", "keypress"].forEach(function(EventName) {
                Doc.addEventListener(EventName, I.KeyListener["on" + EventName], false);
            });
        },
        tryMoving: function(Eve) {
            if(!Eve.BibiKeyName) return false;
            const MovingParameter = I.KeyListener.MovingParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!MovingParameter) return false;
            Eve.preventDefault();
                 if(typeof MovingParameter == "number") R.moveBy( { Distance:    MovingParameter });
            else if(typeof MovingParameter == "string") R.focusOn({ Destination: MovingParameter });
        }
    };

    I.KeyListener.updateKeyCodes(["keydown", "keyup", "keypress"], {
        32: "Space"
    });
    I.KeyListener.updateKeyCodes(["keydown", "keyup"], {
        33: "Page Up",     34: "Page Down",
        35: "End",         36: "Home",
        37: "Left Arrow",  38: "Up Arrow",  39: "Right Arrow",  40: "Down Arrow"
    });

    E.add("bibi:updated-settings",   function(    ) { I.KeyListener.updateMovingParameters(); });
    E.add("bibi:opened",             function(    ) { I.KeyListener.updateMovingParameters(); I.KeyListener.observe(document); });
    E.add("bibi:postprocessed-item", function(Item) { if(!Item.IsPlaceholder) I.KeyListener.observe(Item.contentDocument); });

    E.add("bibi:touched-key",        function(Eve ) { I.KeyListener.tryMoving(Eve); });

    E.dispatch("bibi:created-keylistener");

};


I.createSpinner = function() {

    I.Spinner = O.Body.appendChild(sML.create("div", { id: "bibi-spinner" }));
    for(let i = 1; i <= 12; i++) I.Spinner.appendChild(document.createElement("span"));
    E.dispatch("bibi:created-spinner");

};


I.setToggleAction = function(Obj, Par) {
    if(!Par) Par = {/*
         onopened: Function,
         onclosed: Function
    */};
    return sML.edit(Obj, {
        UIState: "default",
        open: function(Opt) {
            return new Promise(function(resolve) {
                if(Obj.UIState == "default") {
                    I.setUIState(Obj, "active");
                    if(Par.onopened) Par.onopened.call(Obj, Opt);
                }
                resolve(Opt);
            });
        },
        close: function(Opt) {
            return new Promise(function(resolve) {
                if(Obj.UIState == "active") {
                    I.setUIState(Obj, "default");
                    if(Par.onclosed) Par.onclosed.call(Obj, Opt);
                }
                resolve(Opt);
            });
        },
        toggle: function(Opt) {
            return Obj.UIState == "default" ? Obj.open(Opt) : Obj.close(Opt);
        }
    });
};


I.distillLabels = function(Labels) {
    if(typeof Labels != "object" || !Labels) Labels = {};
    for(let State in Labels) Labels[State] = I.distillLabels.distillLanguage(Labels[State]);
    if(!Labels["default"])                       Labels["default"]  = I.distillLabels.distillLanguage();
    if(!Labels["active"]   && Labels["default"]) Labels["active"]   = Labels["default"];
    if(!Labels["disabled"] && Labels["default"]) Labels["disabled"] = Labels["default"];
    return Labels;
};

I.distillLabels.distillLanguage = function(Label) {
    if(typeof Label != "object" || !Label) Label = { default: Label };
    if(typeof Label["default"] != "string")  {
             if(typeof Label["en"] == "string")       Label["default"]  = Label["en"];
        else if(typeof Label[O.Language] == "string") Label["default"]  = Label[O.Language];
        else                                          Label["default"]  = "";
    }
    if(typeof Label[O.Language] != "string") {
             if(typeof Label["default"] == "string")  Label[O.Language] = Label["default"];
        else if(typeof Label["en"]      == "string")  Label[O.Language] = Label["en"];
        else                                          Label[O.Language] = "";
    }
    return Label;
};


I.observeHover = function(Ele) {
    Ele.onBibiHover = function(On, Eve) { E.dispatch(Ele, On ? "bibi:hovers" : "bibi:unhovers", Eve) };
    Ele.addEventListener(O["pointerover"], function(Eve) { this.onBibiHover.call(this, true,  Eve); });
    Ele.addEventListener(O["pointerout"],  function(Eve) { this.onBibiHover.call(this, false, Eve); });
    return Ele;
};


I.setHoverActions = function(Ele) {
    E.add(Ele, "bibi:hovers", function(Eve) {
        if(Ele.Hover) return Ele;
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        Ele.Hover = true;
        Ele.classList.add("hover");
        if(Ele.showHelp) Ele.showHelp();
        return Ele;
    });
    E.add(Ele, "bibi:unhovers", function(Eve) {
        if(!Ele.Hover) return Ele;
        Ele.Hover = false;
        Ele.classList.remove("hover");
        if(Ele.hideHelp) Ele.hideHelp();
        return Ele;
    });
    return Ele;
};



I.observeTap = function(Ele, Opt) {
    if(!Opt) Opt = {};
    if(!Ele.addTapEventListener) {
        Ele.addTapEventListener = function(EN, Fun) {
            if(EN == "tap") EN = "taps";
            E.add(Ele, "bibi:" + EN, function(Eve) { return Fun.call(Ele, Eve); });
            return Ele;
        };
        Ele.onBibiTap = function(On, Eve) {
            if(On) {
                clearTimeout(Ele.Timer_tap);
                Ele.TouchStart = { Time: Date.now(), Event: Eve, Coord: O.getBibiEventCoord(Eve) };
                Ele.Timer_tap = setTimeout(function() { delete Ele.TouchStart; }, 333);
                if(Opt.PreventDefault)  Eve.preventDefault();
                if(Opt.StopPropagation) Eve.stopPropagation();
            } else {
                if(Ele.TouchStart) {
                    if((Date.now() - Ele.TouchStart.Time) < 300) {
                        const TouchEndCoord = O.getBibiEventCoord(Eve);
                        if(Math.abs(TouchEndCoord.X - Ele.TouchStart.Coord.X) < 5 && Math.abs(TouchEndCoord.Y - Ele.TouchStart.Coord.Y) < 5) {
                            E.dispatch(Ele, "bibi:taps",   Ele.TouchStart.Event);
                            E.dispatch(Ele, "bibi:tapped", Ele.TouchStart.Event);
                        }
                    }
                    delete Ele.TouchStart;
                }
                if(Opt.PreventDefault)  Eve.preventDefault();
                if(Opt.StopPropagation) Eve.stopPropagation();
            }
        };
        Ele.addEventListener(O["pointerdown"], function(Eve) { this.onBibiTap.call(this, 1, Eve); });
        Ele.addEventListener(O["pointerup"],   function(Eve) { this.onBibiTap.call(this, 0, Eve); });
    }
    return Ele;
};


I.setTapAction = function(Ele) {
    const onTapped = (function() {
        switch(Ele.Type) {
            case "toggle": return function(Eve) {
                if(Ele.UIState == "disabled") return false;
                I.setUIState(Ele, Ele.UIState == "default" ? "active" : "default");
            };
            case "radio": return function(Eve) {
                if(Ele.UIState == "disabled") return false;
                Ele.ButtonGroup.Buttons.forEach(function(Button) {
                    if(Button != Ele) I.setUIState(Button, "");
                });
                I.setUIState(Ele, "active");
            };
            default: return function(Eve) {
                if(Ele.UIState == "disabled") return false;
                I.setUIState(Ele, "active");
                clearTimeout(Ele.Timer_deactivate);
                Ele.Timer_deactivate = setTimeout(function() {
                    I.setUIState(Ele, "");
                }, 200);
            };
        }
    })();
    Ele.addTapEventListener("tapped", function(Eve) {
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        if(Ele.Type == "radio" && Ele.UIState == "active") return Ele;
        if(Ele.UIState == "disabled") return Ele;
        onTapped.call(Ele, Eve);
        if(Ele.hideHelp) Ele.hideHelp();
        if(Ele.note) Ele.note();
        return Ele;
    });
    return Ele;
};


I.setFeedback = function(Ele, Opt) {
    if(!Opt) Opt = {};
    Ele.Labels = I.distillLabels(Ele.Labels);
    if(Ele.Labels) {
        if(Opt.Help) {
            Ele.showHelp = function() {
                if(I.Help && Ele.Labels[Ele.UIState]) I.Help.show(Ele.Labels[Ele.UIState][O.Language]);
                return Ele;
            };
            Ele.hideHelp = function() {
                if(I.Help) I.Help.hide();
                return Ele;
            };
        }
        if(Ele.Notes) Ele.note = function() {
            if(Ele.Labels[Ele.UIState]) setTimeout(function() { I.note(Ele.Labels[Ele.UIState][O.Language]); }, 0);
            return Ele;
        }
    }
    if(!O.Touch) I.observeHover(Ele);
    I.setHoverActions(Ele);
    I.observeTap(Ele, Opt);
    I.setTapAction(Ele);
    Ele.addTapEventListener("tap", function(Eve) {
        if(Ele.isAvailable && !Ele.isAvailable()) return false;
        E.dispatch("bibi:is-going-to:tap:ui", Ele);
    });
    Ele.addTapEventListener("tapped", function(Eve) {
        E.dispatch("bibi:tapped:ui", Ele);
    });
    I.setUIState(Ele, "default");
    return Ele;
};


I.setUIState = function(UI, UIState) {
    if(!UIState) UIState = "default";
    UI.PreviousUIState = UI.UIState;
    if(UIState == UI.UIState) return;
    UI.UIState = UIState;
    if(UI.tagName) {
        if(UI.Labels && UI.Labels[UI.UIState] && UI.Labels[UI.UIState][O.Language]) {
            UI.title = UI.Labels[UI.UIState][O.Language].replace(/<[^>]+>/g, "");
            if(UI.Label) UI.Label.innerHTML = UI.Labels[UI.UIState][O.Language];
        }
        O.replaceClass(UI, UI.PreviousUIState, UI.UIState);
    }
    return UI.UIState;
};

I.isPointerStealth = function() {
    let IsPointerStealth = false;
    I.isPointerStealth.Checkers.forEach(function(checker) { if(checker()) IsPointerStealth = true; });
    return IsPointerStealth;
};
I.isPointerStealth.Checkers = [];
I.isPointerStealth.addChecker = function(fun) {
    if(typeof fun == "function" && !I.isPointerStealth.Checkers.includes(fun)) I.isPointerStealth.Checkers.push(fun);
};

I.getBookIcon = function() {
    return sML.create('div', { className: "book-icon", innerHTML: '<span></span>' });
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


____.P = {}; // Bibi.Preset


P.initialize = function() {
    O.applyRtL(P, Bibi.Preset, "ExceptFunctions");
    O.SettingTypes.Boolean.concat(O.PresetOnlySettingTypes.Boolean).forEach(function(PropertyName) {
        if(P[PropertyName] !== true) P[PropertyName] = false;
    });
    O.SettingTypes.YesNo.concat(O.PresetOnlySettingTypes.YesNo).forEach(function(PropertyName) {
        if(typeof P[PropertyName] == "string") P[PropertyName] = /^(yes|no|mobile|desktop)$/.test(P[PropertyName]) ? P[PropertyName] : "no";
        else                                   P[PropertyName] = P[PropertyName] ? "yes" : "no";
    });
    O.SettingTypes.String.concat(O.PresetOnlySettingTypes.String).forEach(function(PropertyName) {
        if(typeof P[PropertyName] != "string") P[PropertyName] = "";
    });
    O.SettingTypes.Integer.concat(O.PresetOnlySettingTypes.Integer).forEach(function(PropertyName) {
        P[PropertyName] = (typeof P[PropertyName] != "number" || P[PropertyName] < 0) ? 0 : Math.round(P[PropertyName]);
    });
    O.SettingTypes.Number.concat(O.PresetOnlySettingTypes.Number).forEach(function(PropertyName) {
        if(typeof P[PropertyName] != "number") P[PropertyName] = 0;
    });
    O.SettingTypes.Array.concat(O.PresetOnlySettingTypes.Array).forEach(function(PropertyName) {
        if(!(P[PropertyName] instanceof Array)) P[PropertyName] = [];
    });
    if(!/^(horizontal|vertical|paged)$/.test(P["reader-view-mode"])) P["reader-view-mode"] = "paged";
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- URI-Defined Settings (FileName, Queries, Hash, and EPUBCFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


____.U = {}; // Bibi.SettingsInURI


U.initialize = function() { // formerly O.readExtras

    const Q = U.parseQuery(location.search);
    const H = U.parseHash(location.hash);

    ["epub", "zine", "book"].forEach(function(BookType) {
        const BookPath = Q[BookType] ? Q[BookType] : O.Body.getAttribute("data-bibi-" + BookType);
        U[BookType] = (typeof BookPath == "string") ? decodeURIComponent(BookPath) : "";
    });

    const BookDataElement = document.getElementById("bibi-book-data");
    if(BookDataElement) {
        if(!U["epub"] && !U["zine"] && !U["book"] && BookDataElement.innerText.trim()) {
            const BookDataMIMEType = BookDataElement.getAttribute("data-bibi-book-mimetype");
            if(typeof BookDataMIMEType == "string" && /^application\/(epub\+zip|zip|x-zip(-compressed)?)$/i.test(BookDataMIMEType)) {
                U.BookDataElement = BookDataElement;
            }
        }
        if(!U.BookDataElement) {
            BookDataElement.innerHTML = "";
            BookDataElement.parentNode.removeChild(BookDataElement);
        }
    }

    if(H["bibi"]) {
        U.importFromDataString(H["bibi"]);
    }

    if(H["pipi"]) {
        U.importFromDataString(H["pipi"]);
        if(U["parent-origin"] && U["parent-origin"] != O.Origin) P["trustworthy-origins"].push(U["parent-origin"]);
        if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]pipi\([^\)]*\)$/g, ""));
    }

    if(H["epubcfi"]) {
        U["epubcfi"] = H["epubcfi"];
        E.add("bibi:readied", function() {
            if(X["EPUBCFI"]) S["to"] = U["to"] = X["EPUBCFI"].getDestination(H["epubcfi"]);
        });
    }

};


U.parseQuery = function(Q) {
    if(typeof Q != "string") return {};
    Q = Q.replace(/^\?/, "");
    const Params = {};
    Q.split("&").forEach(function(PnV) {
        PnV = PnV.split("=");
        if(/^[a-z]+$/.test(PnV[0])) Params[PnV[0]] = PnV[1];
    });
    return Params;
};


U.parseHash = function(H) {
    if(typeof H != "string") return {};
    H = H.replace(/^#/, "");
    const Params = {};
    let CurrentPosition = 0;
    const parseFragment = function() {
        const Foothold = CurrentPosition;
        let Label = "";
        while(/[a-z_]/.test(H.charAt(CurrentPosition))) CurrentPosition++;
        if(H.charAt(CurrentPosition) == "(") Label = H.substr(Foothold, CurrentPosition - 1 - Foothold + 1), CurrentPosition++; else return {};
        while(H.charAt(CurrentPosition) != ")") CurrentPosition++;
        if(Label) Params[Label] = H.substr(Foothold, CurrentPosition - Foothold + 1).replace(/^[a-z_]+\(/, "").replace(/\)$/, "");
        CurrentPosition++;
    };
    parseFragment();
    while(H.charAt(CurrentPosition) == ",") {
        CurrentPosition++;
        parseFragment();
    }
    return Params;
};


U.importFromDataString = function(DataString) {
    if(typeof DataString != "string") return false;
    DataString.replace(" ", "").split(",").forEach(function(PnV) {
        PnV = PnV.split(":"); if(!PnV[0]) return;
        switch(PnV[0]) {
            case "parent-title":
            case "parent-uri":
            case "parent-origin":
            case "parent-pipi-path":
            case "parent-bibi-label":
            case "parent-holder-id":
                PnV[1] = decodeURIComponent(PnV[1].replace("_BibiKakkoClose_", ")").replace("_BibiKakkoOpen_", "(")); if(!PnV[1]) PnV[1] = ""; 
                break;
            case "to":
                PnV[1] = R.getBibiToDestination(PnV[1]); if(!PnV[1]) return;
                break;
            case "nav":
                if(/^[1-9][0-9]*$/.test(PnV[1])) PnV[1] *= 1; else return;
                break;
            case "horizontal":
            case "vertical":
            case "paged":
                PnV = ["reader-view-mode", PnV[0]];
                break;
            case "reader-view-mode":
                if(!/^(horizontal|vertical|paged)$/.test(PnV[1])) return;
                break;
            default:
                if(O.SettingTypes.Boolean.concat(O.UserOnlySettingTypes.Boolean).includes(PnV[0])) {
                         if(PnV[1] == "true" ) PnV[1] = true;
                    else if(PnV[1] == "false") PnV[1] = false;
                    else return;
                } else if(O.SettingTypes.YesNo.concat(O.UserOnlySettingTypes.YesNo).includes(PnV[0])) {
                    if(!/^(yes|no|mobile|desktop)$/.test(PnV[1])) return;
                } else if(O.SettingTypes.Integer.concat(O.UserOnlySettingTypes.Integer).includes(PnV[0])) {
                    if(/^(0|[1-9][0-9]*)$/.test(PnV[1])) PnV[1] *= 1; else return;
                } else if(O.SettingTypes.Number.concat(O.UserOnlySettingTypes.Number).includes(PnV[0])) {
                    if(/^(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(PnV[1])) PnV[1] *= 1; else return;
                } else {
                    return;
                }
        }
        if(!PnV[0] || typeof PnV[1] == "undefined") return;
        U[PnV[0]] = PnV[1];
    });
    return U;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Settings

//----------------------------------------------------------------------------------------------------------------------------------------------


____.S = {}; // Bibi.Settings


S.initialize = function() {
    for(let Property in S) if(typeof S[Property] != "function") delete S[Property];
    O.applyRtL(S, P, "ExceptFunctions");
    O.applyRtL(S, U, "ExceptFunctions");
    O.SettingTypes.YesNo.concat(O.PresetOnlySettingTypes.YesNo).concat(O.UserOnlySettingTypes.YesNo).forEach(function(Property) {
        S[Property] = (typeof S[Property] == "string") ? (S[Property] == "yes" || (S[Property] == "mobile" && O.Touch) || (S[Property] == "desktop" && !O.Touch)) : false;
    });
    S["bookshelf"] = (function() {
        if(!S["bookshelf"]) return "";
        if(/^https?:\/\//.test(S["bookshelf"])) return S["bookshelf"];
        if(/^\/\//.test(S["bookshelf"])) return location.protocol + S["bookshelf"];
        if(/^\//.test(S["bookshelf"])) return O.Origin + S["bookshelf"];
        return O.getPath(location.href.split("?")[0].replace(/[^\/]*$/, ""), S["bookshelf"]);
    })().replace(/\/$/, "");
    if(!/^https?:\/\/[^\/]+.*$/.test(S["bookshelf"])) S["bookshelf"] = "";
         if(S["epub"]) S["book-type"] = "EPUB", S["book"] = S["epub"];
    else if(S["zine"]) S["book-type"] = "Zine", S["book"] = S["zine"];
    else if(S["book"]) S["book-type"] = "EPUB";
    else               S["book-type"] = "";
    delete S["epub"];
    delete S["zine"];
    S["book"] = (function() {
        if(!S["book"] || !S["book-type"]) return "";
        if(/^https?:\/\//.test(S["book"])) return S["book"];
        if(/^\/\//.test(S["book"])) return location.protocol + S["book"];
        if(/^\//.test(S["book"])) return O.Origin + S["book"];
        return O.getPath(S["bookshelf"], S["book"]);
    })().replace(/^(https?:\/\/[^\/]+.*)?.*$/, "$1");
    if(!S["book"]) S["book-type"] = "";
    S["unzip-if-necessary"] = (function() {
        if(!S["unzip-if-necessary"].length) return [];
        if(S["unzip-if-necessary"].includes("*")) return ["*"];
        const UnzipIfNecessary = [];
        for(let l = S["unzip-if-necessary"].length, i = 0; i < l; i++) {
            let Ext = S["unzip-if-necessary"][i];
            if(typeof Ext != "string" || !/^(\.[\w\d]+)*$/.test(Ext)) continue;
            Ext = Ext.toLowerCase();
            if(!UnzipIfNecessary.includes(Ext)) UnzipIfNecessary.push(Ext);
        }
        return UnzipIfNecessary;
    })();
    S["accept-local-file"] = (function() {
        if(S["book"] || !window.File || !S["accept-local-file"]) return false;
        return (S["unzip-if-necessary"].includes("*") || S["unzip-if-necessary"].includes(".epub") || S["unzip-if-necessary"].includes(".zip"));
    })();
    S["accept-blob-converted-data"] = (function() {
        if(S["book"] || !window.File || !S["accept-blob-converted-data"]) return false;
        return true;
    })();
    S["accept-base64-encoded-data"] = (function() {
        if(S["book"] || !window.File || !S["accept-base64-encoded-data"]) return false;
        return true;
    })();
    S["autostart"] = (function() {
        if(S["wait"]) return !S["wait"];
        if(!S["book"]) return true;
        return O.WindowEmbedded ? S["autostart-embedded"] : S["autostart"];
    })();
    S["start-in-new-window"] = (function() {
        if(S["autostart"]) return false;
        return O.WindowEmbedded ? S["start-embedded-in-new-window"] : false;
    })();
    if(!S["trustworthy-origins"].includes(O.Origin)) S["trustworthy-origins"].unshift(O.Origin);

};

S.willBeUnzipped = function(FileName) {
    if(!FileName || !S["unzip-if-necessary"].length) return false;
    if(S["unzip-if-necessary"].includes("*")) return true;
    if(S["unzip-if-necessary"].includes("")) return !/(\.[\w\d]+)+$/.test(FileName);
    for(let l = S["unzip-if-necessary"].length, i = 0; i < l; i++) if(new RegExp(S["unzip-if-necessary"][i].replace(/\./g, "\\.") + "$", "i").test(FileName)) return true;
    return false;
};

S.update = function(Settings) {

    const PrevBRL = S.BRL, PrevRVM = S.RVM, PrevPPD = S.PPD, PrevSLA = S.SLA, PrevSLD = S.SLD, PrevARD = S.ARD, PrevARA = S.ARA;

    if(typeof Settings == "object") for(let Property in Settings) if(typeof S[Property] != "function") S[Property] = Settings[Property];

    S.BRL = S["book-rendition-layout"] = B.Package.Metadata["rendition:layout"];
    S.BWM = S["book-writing-mode"] = (/^tb/.test(B.WritingMode) && !O.VerticalTextEnabled) ? "lr-tb" : B.WritingMode;

    S["allow-placeholders"] = (S["allow-placeholders"] && B.AllowPlaceholderItems);

    // Font Family
    if(S.FontFamilyStyleIndex) sML.deleteStyleRule(S.FontFamilyStyleIndex);
    if(S["ui-font-family"]) S.FontFamilyStyleIndex = sML.CSS.appendRule("html", "font-family: " + S["ui-font-family"] + " !important;");

    // Layout Settings
    S.RVM = S["reader-view-mode"];
    if(S.BRL == "reflowable") {
        if(S.BWM == "tb-rl") {
            S.PPD = S["page-progression-direction"] = "rtl";
            S.SLA = S["spread-layout-axis"] = (S.RVM == "paged") ? "vertical"   : S.RVM;
        } else if(S.BWM == "tb-lr") {
            S.PPD = S["page-progression-direction"] = "ltr";
            S.SLA = S["spread-layout-axis"] = (S.RVM == "paged") ? "vertical"   : S.RVM;
        } else if(S.BWM == "rl-tb") {
            S.PPD = S["page-progression-direction"] = "rtl";
            S.SLA = S["spread-layout-axis"] = (S.RVM == "paged") ? "horizontal" : S.RVM;
        } else {
            S.PPD = S["page-progression-direction"] = "ltr";
            S.SLA = S["spread-layout-axis"] = (S.RVM == "paged") ? "horizontal" : S.RVM;
        }
    } else {
        S.PPD = S["page-progression-direction"] = (B.PPD == "rtl") ? "rtl" : "ltr";
        S.SLA = S["spread-layout-axis"] = (S.RVM == "paged") ? "horizontal" : S.RVM;
    }
    S.SLD = S["spread-layout-direction"] = (S.SLA == "vertical") ? "ttb" : S.PPD;
    S.ARD = S["apparent-reading-direction"] = (S.RVM == "vertical") ? "ttb" : S.PPD;
    S.ARA = S["apparent-reading-axis"] = (S.RVM == "paged") ? "horizontal" : S.RVM;

    // Dictionary
    S.CC = {
        L: S.getCC(S.SLA, S.PPD), // for "L"ayout-Direction
        A: S.getCC(S.ARA, S.PPD)  // for "A"pparent-Direction
    };             

    // Root Class
    if(PrevBRL != S.BRL) O.replaceClass(O.HTML, "book-"       + PrevBRL, "book-"       + S.BRL);
    if(PrevRVM != S.RVM) O.replaceClass(O.HTML, "view-"       + PrevRVM, "view-"       + S.RVM);
    if(PrevPPD != S.PPD) O.replaceClass(O.HTML, "page-"       + PrevPPD, "page-"       + S.PPD);
    if(PrevSLA != S.SLA) O.replaceClass(O.HTML, "spread-"     + PrevSLA, "spread-"     + S.SLA);
    if(PrevSLD != S.SLD) O.replaceClass(O.HTML, "spread-"     + PrevSLD, "spread-"     + S.SLD);
    if(PrevARD != S.ARD) O.replaceClass(O.HTML, "appearance-" + PrevARD, "appearance-" + S.ARD);
    if(PrevARA != S.ARA) O.replaceClass(O.HTML, "appearance-" + PrevARA, "appearance-" + S.ARA);

    E.dispatch("bibi:updated-settings", S);

};

S.getCC = function(Hzt_Vtc, LtR_RtL) { // getCoordinateCondition
    const CC = { SIZE: {}, BASE: {}, OOLT: {}, AXIS: {} };
    if(Hzt_Vtc == "horizontal") {
        S.getCC.applyRtL(CC.SIZE, { b: "height", l: "width",  w: "length",  h: "breadth" });
        S.getCC.applyRtL(CC.BASE, { s: "top", e: "bottom" });
        S.getCC.applyRtL(CC.OOLT, { b: "top", l: "left" });
        S.getCC.applyRtL(CC.AXIS, { b: "y", l: "x" });
        if(LtR_RtL == "ltr") {
            S.getCC.applyRtL(CC.BASE, { b: "left", a: "right" });
            CC.AXIS.PM = 1;
        } else {
            S.getCC.applyRtL(CC.BASE, { b: "right", a: "left" });
            CC.AXIS.PM = -1;
        }
    } else {
        S.getCC.applyRtL(CC.SIZE, { b: "width", l: "height",  w: "breadth",  h: "length" });
        S.getCC.applyRtL(CC.BASE, { b: "top", a: "bottom" });
        S.getCC.applyRtL(CC.OOLT, { b: "left", l: "top" });
        S.getCC.applyRtL(CC.AXIS, { b: "x", l: "y" });
        CC.AXIS.PM = 1;
        if(LtR_RtL == "ltr") {
            S.getCC.applyRtL(CC.BASE, { s: "left", e: "right" });
        } else {
            S.getCC.applyRtL(CC.BASE, { s: "right", e: "left" });
        }
    }
    return CC;
};

S.getCC.applyRtL = function(Left, Right) {
    for(let Property in Right) {
        Left[Property] = Right[Property];
        Left[S.getCC.applyRtL.capitalize(Property)] = S.getCC.applyRtL.capitalize(Right[Property]);
    }
    return Left;
};

S.getCC.applyRtL.capitalize = function(Str) {
    return Str.charAt(0).toUpperCase() + Str.slice(1);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


____.O = {}; // Bibi.Operator


O.LogDepth = 0;
O.log = function(Body, Tag) {
    switch(Tag) {
        case "<e/>": O.log.put("error",          "!! ", Body, "font-weight: bold;"); break;
        case "<i/>": O.log.put("log",            "‐ ", Body, "font-weight: bold;"); break;
        case "<g!>": O.log.put("groupCollapsed", "📕",  Body, "font-weight: bold;"); break;
        case "<g:>": O.log.put("groupCollapsed", "┌ ", Body                      ); break;
        case "<g->": O.log.put("groupCollapsed", "‐ ", Body                      ); break;
        case "</g>": O.log.put("groupEnd",       "└ ", Body                      ); break;
        default    : O.log.put("log",            "‐ ", Body                      ); break;
    }
};
O.log.put = function(Method, Prefix, Body, Style) {
    if(Method == "groupEnd") {
        if(Bibi.LogDepth >= O.LogDepth) console.groupEnd();
        O.LogDepth--;
        Method = "log";
    }
    if(!Body) return false;
    if(O.LogDepth == 0) {
        Prefix = "Bibi: " + Prefix;
        O.stamp(Body);
    }
    if(Bibi.LogDepth < O.LogDepth) return false;
    if(Method == "groupCollapsed") {
        if(Bibi.LogDepth == O.LogDepth) Method = "log";
        O.LogDepth++;
    }
    return console[Method]("%c" + Prefix + Body, (Style ? Style : "font-weight: normal;"));
};
if(parent && parent != window) O.log = function() { return false; };


O.error = function(Msg) {
    O.Busy = false;
    O.HTML.classList.remove("busy");
    O.HTML.classList.remove("loading");
    O.HTML.classList.remove("waiting");
    E.dispatch("bibi:x_x", Msg);
    O.log(Msg, "<e/>");
};

O.TimeCard = {};

O.getElapsedTimeLabel = function() {
    const Milliseconds = Date.now() - TimeOrigin;
    return [
        Milliseconds / 1000 / 60 / 60,
        Milliseconds / 1000 / 60 % 60,
        Milliseconds / 1000 % 60
    ].map(function(Val) {
        return sML.String.pad(Math.floor(Val), 0, 2);
    }).join(":") + "." + sML.String.pad(Milliseconds % 1000, 0, 3);
};

O.stamp = function(What, TimeCard) {
    TimeCard = TimeCard || O.TimeCard;
    const TimeLabel = O.getElapsedTimeLabel();
    if(!TimeCard[TimeLabel]) TimeCard[TimeLabel] = [];
    TimeCard[TimeLabel].push(What);
    return TimeLabel;
};
//O.stamp = function() { return false; };


O.forEach = function(Col, fun) { return Col.forEach ? Col.forEach(fun) : Array.prototype.forEach.call(Col, fun); };


O.applyRtL = function(L, R, ExceptFunctions) {
    if(ExceptFunctions) {
        for(let Pro in R) if(typeof L[Pro] != "function" && typeof R[Pro] != "function") L[Pro] = R[Pro];
    } else {
        for(let Pro in R)                                                                L[Pro] = R[Pro];
    }
    return L;
};

O.limitMin    = function(Num, Min     ) { return                      (Num < Min) ? Min :                     Num; };
O.limitMax    = function(Num,      Max) { return                                          (Max < Num) ? Max : Num; };
O.limitMinMax = function(Num, Min, Max) { return (Max < Min) ? null : (Num < Min) ? Min : (Max < Num) ? Max : Num; };


O.scrollTo = function(ScrollTarget, Par) { return new Promise(function(resolve) { Par.callback = resolve; sML.scrollTo(ScrollTarget, Par); }); };


O.download = function(URI, MimeType) {
    return new Promise(function(resolve, reject) {
        const XHR = new XMLHttpRequest();
        if(MimeType) XHR.overrideMimeType(MimeType);
        XHR.open('GET', URI, true);
        XHR.onloadend = function() {
            XHR.status === 200 ? resolve(XHR) : reject(XHR);
        };
        XHR.send(null);
    });
};

O.parseDocument = function(Doc, Path) {
    return (new DOMParser()).parseFromString(Doc, /\.(xml|opf|ncx)$/i.test(Path) ? "text/xml" : "text/html");
};

O.openDocument = function(Path) {
    return new Promise(function(resolve, reject) {
        if(B.Unzipped) {
            O.download(B.Path + "/" +  Path).then(function(XHR) {
                resolve(XHR.responseText);
            }).catch(function(XHR) {
                reject('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"');
            });
        } else {
            B.Files[Path] ? resolve(B.Files[Path]) : reject('Not Included: "' + Path + '"');
        }
    }).then(function(TextData) {
        return O.parseDocument(TextData, Path);
    }).catch(O.error);
};


O.replaceClass = function(Ele, OC, NC) {
    Ele.classList.add(NC);
    Ele.classList.remove(OC);
    return Ele;
};


O.editCSSRules = function() {
    let Doc, fun;
         if(typeof arguments[0] == "function") Doc = arguments[1], fun = arguments[0];
    else if(typeof arguments[1] == "function") Doc = arguments[0], fun = arguments[1];
    if(!Doc) Doc = document;
    if(!Doc.styleSheets || typeof fun != "function") return;
    O.forEach(Doc.styleSheets, function(StyleSheet) {
        O.editCSSRules.edit(StyleSheet, fun);
    });
};

O.editCSSRules.edit = function(StyleSheet, fun) {
    try{ if(!StyleSheet.cssRules) return; } catch(Err) { return; }
    for(let l = StyleSheet.cssRules.length, i = 0; i < l; i++) {
        const CSSRule = StyleSheet.cssRules[i];
        /**/ if(CSSRule.cssRules)   O.editCSSRules.edit(CSSRule,            fun);
        else if(CSSRule.styleSheet) O.editCSSRules.edit(CSSRule.styleSheet, fun);
        else                                        fun(CSSRule                );
    }
};


O.appendStyleSheetLink = function(Opt, Doc) {
    if(!Opt || !Opt.href) return false;
    if(!Doc) Doc = document;
    const Link = Doc.createElement("link");
    Link.rel = "stylesheet";
    if(typeof Opt.className == "string") Link.className = Opt.className;
    if(typeof Opt.id        == "string") Link.id = Opt.id;
    if(typeof Opt.media     == "string") Link.media = Opt.media;
    Link.href = Opt.href;
    return Doc.head.appendChild(Link);
};


O.isBin = function(Hint) { return /(^|\.)(gif|jpe?g|png|ttf|otf|woff2?|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(Hint); };

O.getDataURI = function(FilePath, FileContent) {
    for(let Ext in O.getDataURI.ContentTypes) {
        if((new RegExp('(^|\.)' + Ext + '$', "i")).test(FilePath)) {
            return "data:" + O.getDataURI.ContentTypes[Ext] + ";base64," + (O.isBin(FilePath) ? btoa(FileContent) : btoa(unescape(encodeURIComponent(FileContent))));
        }
    }
    return "";
};

O.getDataURI.ContentTypes = {
    "gif"   :       "image/gif",
    "png"   :       "image/png",
    "jpe?g" :       "image/jpeg",
    "svg"   :       "image/svg+xml",
    "mp4"   :       "video/mp4",
    "webm"  :       "video/webm",
    "mp3"   :       "audio/mpeg",
    "ttf"   :        "font/truetype",
    "otf"   :        "font/opentype",
    "woff"  :        "font/woff",
    "woff2" :        "font/woff2",
    "css"   :        "text/css",
    "js"    :        "text/javascript",
    "html?" :        "text/html",
    "xhtml" : "application/xhtml+xml",
    "xml"   : "application/xml",
    "pdf"   : "application/pdf"
};

O.getWritingMode = function(Ele) {
    const CS = getComputedStyle(Ele);
         if(!O.WritingModeProperty)                            return (CS["direction"] == "rtl" ? "rl-tb" : "lr-tb");
    else if(     /^vertical-/.test(CS[O.WritingModeProperty])) return (CS["direction"] == "rtl" ? "bt" : "tb") + "-" + (/-lr$/.test(CS[O.WritingModeProperty]) ? "lr" : "rl");
    else if(   /^horizontal-/.test(CS[O.WritingModeProperty])) return (CS["direction"] == "rtl" ? "rl" : "lr") + "-" + (/-bt$/.test(CS[O.WritingModeProperty]) ? "bt" : "tb");
    else if(/^(lr|rl|tb|bt)-/.test(CS[O.WritingModeProperty])) return CS[O.WritingModeProperty];
};


O.getElementInnerText = function(Ele) {
    let InnerText = "InnerText";
    const Copy = document.createElement("div");
    Copy.innerHTML = Ele.innerHTML.replace(/ (src(set)?|source|(xlink:)?href)=/g, " data-$1=");
    O.forEach(Copy.querySelectorAll("svg"),    function(Ele) { Ele.parentNode.removeChild(Ele); });
    O.forEach(Copy.querySelectorAll("video"),  function(Ele) { Ele.parentNode.removeChild(Ele); });
    O.forEach(Copy.querySelectorAll("audio"),  function(Ele) { Ele.parentNode.removeChild(Ele); });
    O.forEach(Copy.querySelectorAll("img"),    function(Ele) { Ele.parentNode.removeChild(Ele); });
    O.forEach(Copy.querySelectorAll("script"), function(Ele) { Ele.parentNode.removeChild(Ele); });
    O.forEach(Copy.querySelectorAll("style"),  function(Ele) { Ele.parentNode.removeChild(Ele); });
    /**/ if(typeof Copy.textContent != "undefined") InnerText = Copy.textContent;
    else if(typeof Copy.innerText   != "undefined") InnerText = Copy.innerText;
    return InnerText.replace(/[\r\n\s\t ]/g, "");
};


O.getElementCoord = function(Ele, OPa) {
    const Coord = { X: Ele.offsetLeft, Y: Ele.offsetTop };
    OPa = OPa && OPa.tagName ? OPa : null;
    while(Ele.offsetParent) {
        Ele = Ele.offsetParent, Coord.X += Ele.offsetLeft, Coord.Y += Ele.offsetTop;
        if(Ele.offsetParent == OPa) break;
    }
    return Coord;
};

O.getPath = function() {
    let Origin = "", Path = arguments[0];
    if(arguments.length == 2 && /^[\w\d]+:\/\//.test(arguments[1])) Path  =       arguments[1];
    else for(let l = arguments.length, i = 1; i < l; i++)           Path += "/" + arguments[i];
    Path.replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, function() { Origin = arguments[1], Path = arguments[2]; });
    while(/([^:\/])\/{2,}/.test(Path)) Path = Path.replace(/([^:\/])\/{2,}/g, "$1/");
    while(        /\/\.\//.test(Path)) Path = Path.replace(        /\/\.\//g,   "/");
    while(/[^\/]+\/\.\.\//.test(Path)) Path = Path.replace(/[^\/]+\/\.\.\//g,    "");
    /**/                               Path = Path.replace(      /^(\.\/)+/g,    "");
    if(Origin) Path = Origin + "/" + Path;
    return Path;
};

O.getViewportByMetaContentString = function(Str) {
    if(typeof Str == "string" && /width/.test(Str) && /height/.test(Str)) {
        Str = Str.replace(/\s+/g, "");
        const W = Str.replace( /^.*?width=(\d+).*$/, "$1") * 1;
        const H = Str.replace(/^.*?height=(\d+).*$/, "$1") * 1;
        if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
    }
    return null;
};

O.getViewportByViewBoxString = function(Str) {
    if(typeof Str == "string") {
        const XYWH = Str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/);
        if(XYWH.length == 4) {
            const W = XYWH[2] * 1;// - XYWH[0] * 1;
            const H = XYWH[3] * 1;// - XYWH[1] * 1;
            if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
        }
    }
    return null;
};

O.getViewportByImage = function(Img) {
    if(Img && /^img$/i.test(Img.tagName)) {
        const ImageStyle = getComputedStyle(Img);
        return { Width: parseInt(ImageStyle.width), Height: parseInt(ImageStyle.height) };
    }
    return null;
};

O.getViewportByOriginalResolutionString = function(Str) {
    if(typeof Str == "string") {
        const WH = Str.replace(/\s+/, "").split("x");
        if(WH.length == 2) {
            const W = WH[0] * 1;
            const H = WH[1] * 1;
            if(!isNaN(W) && !isNaN(H)) return { Width: W, Height: H };
        }
    }
    return null;
};

O.isAnchorContent = function(Ele) {
    while(Ele) {
        if(/^a$/i.test(Ele.tagName)) return true;
        Ele = Ele.parentElement;
    }
    return false;
};

O.stopPropagation = function(Eve) { Eve.stopPropagation(); return false; };
O.preventDefault  = function(Eve) { Eve.preventDefault();  return false; };

O.getBibiEventCoord = function(Eve) {
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
        if(!Item.ItemRef["rendition:layout"] == "pre-paginated" && !Item.Outsourcing) ItemCoordInRM.X += S["item-padding-left"], ItemCoordInRM.Y += S["item-padding-top"];
        EventCoord.X = (RMCoord.X + RM.offsetWidth  / 2 + RMT.Translation.X) + ((((ItemCoordInRM.X - RM.scrollLeft) + (EventCoord.X * Item.Scale)) - (RM.offsetWidth  / 2)) * RMT.Scale);
        EventCoord.Y = (RMCoord.Y + RM.offsetHeight / 2 + RMT.Translation.Y) + ((((ItemCoordInRM.Y - RM.scrollTop ) + (EventCoord.Y * Item.Scale)) - (RM.offsetHeight / 2)) * RMT.Scale);
        //EventCoord = (translated-RM-transform-origin                     ) + ((((Item-coord in RM               ) + (Event-coord in Item      )) - (RM-transform-origin)) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + (((Event-coord in RM                                              ) - (RM-transform-origin)) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + ((Event-coord from RM-transform-origin                                                     ) * RM-scale )
        //EventCoord = (translated-RM-transform-origin                     ) + (Event-coord from translated-RM-transform-origin                                                        )
        //EventCoord = Event-coord
        EventCoord.X = Math.floor(EventCoord.X);
        EventCoord.Y = Math.floor(EventCoord.Y);
    }
    //O.getBibiEventCoord.log(EventCoord, Eve);
    return EventCoord;
};

O.getBibiEventCoord.log = function(EventCoord, Eve) {
    console.log(
        '[' + (Eve.target.ownerDocument.documentElement == O.HTML ? "PARENT" : "CHILD") + ']',
        EventCoord,
        {
            X: Eve.screenX - window.screenX - (window.outerWidth  - window.innerWidth),
            Y: Eve.screenY - window.screenY - (window.outerHeight - window.innerHeight)
        },
        Eve
    );
};

O.getBibiEvent = function(Eve) {
    if(!Eve) return {};
    const Coord = O.getBibiEventCoord(Eve);
    const FlipperWidth = S["flipper-width"];
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
         if(Ratio.X < BorderL) Division.X = "left";
    else if(BorderR < Ratio.X) Division.X = "right";
    else                       Division.X = "center";
         if(Ratio.Y < BorderT) Division.Y = "top";
    else if(BorderB < Ratio.Y) Division.Y = "bottom";
    else                       Division.Y = "middle";
    return {
        Target: Eve.target,
        Coord: Coord,
        Ratio: Ratio,
        Division: Division
    };
};

O.getOrigin = function(Win) {
    const Loc = (Win ? Win : window).location;
    return Loc.origin || Loc.protocol + "//" + (Loc.host || Loc.hostname + (Loc.port ? ":" + Loc.port : ""));
};
O.Origin = O.getOrigin();

O.Path = (function() {
    if(document.currentScript) return document.currentScript.src;
    const Scripts = document.getElementsByTagName("script");
    return Scripts[Scripts.length - 1].src;
})();

O.RootPath = O.Path.replace(/\/res\/scripts\/.+$/, "/");

O.Cookie = {
    remember: function(Group) {
        const Cookie = JSON.parse(sML.Cookies.read("bibi") || '{}');
        if(typeof Group != "string" || !Group) return Cookie;
        return Cookie[Group];
    },
    eat: function(Group, KeyVal, Opt) {
        if(typeof Group != "string" || !Group) return false;
        if(typeof KeyVal != "object") return false;
        const Cookie = this.remember();
        if(typeof Cookie[Group] != "object") Cookie[Group] = {};
        for(let Key in KeyVal) {
            const Val = KeyVal[Key];
            if(typeof Val == "function") continue;
            Cookie[Group][Key] = Val;
        }
        if(!Opt) Opt = {};
        Opt.Path = location.pathname.replace(/[^\/]+$/, "");
        if(!Opt.Expires) Opt.Expires = S["cookie-expires"];
        sML.Cookies.write("bibi", JSON.stringify(Cookie), Opt);
    }
};

O.SettingTypes = {
    Boolean: [
    ],
    YesNo: [
        "allow-placeholders",
        "autostart",
        "autostart-embedded",
        "fix-reader-view-mode",
        "place-menubar-at-top",
        "single-page-always",
        "start-embedded-in-new-window",
        "use-arrows",
        "use-font-size-changer",
        "use-full-height",
        "use-keys",
        "use-loupe",
        "use-menubar",
        "use-nombre"
    ],
    String: [
        "loupe-mode"
    ],
    Integer: [
        "item-padding-bottom",
        "item-padding-left",
        "item-padding-right",
        "item-padding-top",
        "spread-gap",
        "spread-margin"
    ],
    Number: [
        "base-font-size",
        "flipper-width",
        "font-size-scale-per-step",
        "loupe-max-scale",
        "orientation-border-ratio"
    ],
    Array: [
    ]
};

O.PresetOnlySettingTypes = {
    Boolean: [
        "accept-base64-encoded-data",
        "accept-blob-converted-data",
        "remove-bibi-website-link"
    ],
    YesNo: [
        "accept-local-file",
        "use-cookie"
    ],
    String: [
    ],
    Integer: [
    ],
    Number: [
        "cookie-expires"
    ],
    Array: [
        "trustworthy-origins",
        "unzip-if-necessary"
    ]
};

O.UserOnlySettingTypes = {
    Boolean: [
        "wait"
    ],
    YesNo: [
    ],
    Integer: [
        "nav"
    ],
    Number: [
    ],
    Array: [
    ]
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events - Special Thanks: @KitaitiMakoto & @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


____.E = {}; // Bibi.Events



E.add = function(Name, Listener) { let Target = document; if(typeof arguments[0] != "string") Target = arguments[0], Name = arguments[1], Listener = arguments[2];
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
    if(!Listener.bibiEventListener) Listener.bibiEventListener = function(Eve) { return Listener.call(Target, Eve.detail); };
    Target.addEventListener(Name, Listener.bibiEventListener, false);
    return Listener;
};


E.remove = function(Name, Listener) { let Target = document; if(typeof arguments[0] != "string") Target = arguments[0], Name = arguments[1], Listener = arguments[2];
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function" || typeof Listener.bibiEventListener != "function") return false;
    (Target ? Target : document).removeEventListener(Name, Listener.bibiEventListener);
    return Listener;
};


E.bind = function(Name, Listener) { let Target = document; if(typeof arguments[0] != "string") Target = arguments[0], Name = arguments[1], Listener = arguments[2];
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
    if(!Target.BibiBindedEventListeners) Target.BibiBindedEventListeners = {};
    if(!(Target.BibiBindedEventListeners[Name] instanceof Array)) Target.BibiBindedEventListeners[Name] = [];
    Target.BibiBindedEventListeners[Name] = Target.BibiBindedEventListeners[Name].filter(function(Binded) {
        if(Binded != Listener) return true;
        return false;
    });
    Target.BibiBindedEventListeners[Name].push(Listener);
    return Target.BibiBindedEventListeners[Name].length - 1;
};


E.unbind = function(Name, Listener) { let Target = document; if(typeof arguments[0] != "string") Target = arguments[0], Name = arguments[1], Listener = arguments[2];
    if(typeof Name != "string") return false;
    if(!Target.BibiBindedEventListeners || !(Target.BibiBindedEventListeners[Name] instanceof Array)) return false;
    if(typeof Listener == "undefined") {
        delete Target.BibiBindedEventListeners[Name];
        return 0;
    }
    if(typeof Listener == "number") {
        if(typeof Target.BibiBindedEventListeners[Name][Listener] != "function") return false;
        Listener = Target.BibiBindedEventListeners[Name][Listener];
    }
    Target.BibiBindedEventListeners[Name] = Target.BibiBindedEventListeners[Name].filter(function(Binded) {
        if(Binded != Listener) return true;
        return false;
    });
    return Target.BibiBindedEventListeners[Name].length;
};


E.dispatch = function(Name, Detail) { let Target = document; if(typeof arguments[0] != "string") Target = arguments[0], Name = arguments[1], Detail = arguments[2];
    if(typeof Name != "string") return false;
    if(Target.BibiBindedEventListeners && Target.BibiBindedEventListeners[Name] instanceof Array) {
        Target.BibiBindedEventListeners[Name].forEach(function(bindedEventListener) {
            if(typeof bindedEventListener == "function") bindedEventListener.call(Target, Detail);
        });
    }
    return Target.dispatchEvent(new CustomEvent(Name, { detail: Detail }));
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Messages - Special Thanks: @KitaitiMakoto

//----------------------------------------------------------------------------------------------------------------------------------------------


____.M = {}; // Bibi.Messages


M.post = function(Msg, TargetOrigin) {
    if(!O.WindowEmbedded) return false;
    if(typeof Msg != "string" || !Msg) return false;
    if(typeof TargetOrigin != "string" || !TargetOrigin) TargetOrigin = "*";
    return window.parent.postMessage(Msg, TargetOrigin);
};


M.receive = function(Data) {
    try {
        Data = JSON.parse(Data);
        if(typeof Data != "object" || !Data) return false;
        for(let EventName in Data) if(/^bibi:commands:/.test(EventName)) E.dispatch(EventName, Data[EventName]);
        return true;
    } catch(Err) {}
    return false;
};


M.gate = function(Eve) {
    if(!Eve || !Eve.data) return;
    for(let l = S["trustworthy-origins"].length, i = 0; i < l; i++) if(S["trustworthy-origins"][i] == Eve.origin) return M.receive(Eve.data);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extensions - Special Thanks: @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


____.X = {}; // Bibi.Extensions


X.initialize = function() {
    X.Files = {};
    X.Presets = {};
    X.Loaded = [];
    X.Added = [];
};


X.loadFilesInPreset = function() {
    if((function() {
        if(S["book"]) return (S["book-type"] == "Zine");
        return (S["accept-local-file"] || S["accept-blob-converted-data"]);
    })()) {
        P["extensions"].unshift({ "name": "Zine", "src": "extensions/zine/zine.js" });
    }
    if((function() {
        if(S["book"]) return S.willBeUnzipped(S["book"]);
        return (S["accept-local-file"] || S["accept-blob-converted-data"]);
    })()) {
        P["extensions"].unshift({ "name": "Unzipper", "src": "extensions/unzipper/unzipper.js" });
    }
    const ExtensionsToBeLoaded = [];
    P["extensions"].forEach(function(FileInfo) {
        if(
            typeof FileInfo["name"] != "string" || !FileInfo["name"] || FileInfo["name"] == "Bibi" ||
            typeof FileInfo["src"]  != "string" || !FileInfo["src"]
        ) return;
        FileInfo.FileIndexInPreset = ExtensionsToBeLoaded.length;
        ExtensionsToBeLoaded.push(FileInfo);
    });
    const PXs = P["extensions"] = ExtensionsToBeLoaded;
    if(!PXs.length) return Promise.resolve();
    O.log('Loading Extension File' + (PXs.length > 1 ? 's' : '') + '...', "<g:>");
    return new Promise(function(resolve) {
        const loadFile = function(FileInfo) {
            if(X.Files[FileInfo["name"]]) {
                O.log('"name" of Extension File "' + FileInfo["name"] + '" is already taken.');
                loadFile(PXs[FileInfo.FileIndexInPreset + 1]);
                return false;
            }
            X.Files[FileInfo["name"]] = FileInfo;
            X.Presets[FileInfo["name"]] = PXs[FileInfo["name"]] = {};
            for(let Option in FileInfo) PXs[FileInfo["name"]][Option] = FileInfo[Option];
            document.head.appendChild(
                sML.create("script", { className: "bibi-extension-script", id: "bibi-extension-script_" + FileInfo["name"], name: FileInfo["name"], src: FileInfo["src"],// async: "async",
                    onload: function() {
                        X.Loaded.push(FileInfo);
                        O.log("Extension: " + FileInfo["name"]);
                        if(FileInfo.FileIndexInPreset + 1 == PXs.length) return resolve();
                        loadFile(PXs[FileInfo.FileIndexInPreset + 1]);
                    }
                })
            );
        };
        loadFile(PXs[0]);
    }).then(function() {
        O.log('Extension File' + (X.Loaded.length > 1 ? 's' : '') + ' Loaded.', "</g>");
    });
};

X.add = function(Extension) {
    if(!Extension || typeof Extension != "object") {
        return function() { return false };
    }
    if(typeof Extension["name"] != "string" || !Extension["name"]) {
        O.log('Extension name is invalid.');
        return function() { return false };
    }
    if(X[Extension["name"]]) {
        O.log('Extension name "' + Extension["name"] + '" is reserved or already taken.');
        return function() { return false };
    }
    if(typeof Extension["description"] != "string") Extension["decription"] = undefined;
    if(typeof Extension["author"]      != "string") Extension["author"]     = undefined;
    if(typeof Extension["version"]     != "string") Extension["version"]    = undefined;
    if(typeof Extension["build"]       != "number") Extension["build"]      = undefined;
    if(!(X.Extensions instanceof Array)) X.Extensions = [];
    X.Extensions.push(Extension);
    X[Extension["name"]] = Extension;
    X[Extension["name"]].Options = {};
    X.Added.push(Extension);
    return function(onReadied) {
        if(typeof onReadied == "function") E.bind("bibi:readied", function() { return onReadied.call(Extension); });
        return function(onPrepared) {
            if(typeof onPrepared == "function") E.bind("bibi:prepared", function() { return onPrepared.call(Extension); });
            return function(onOpened) {
                if(typeof onOpened == "function") E.bind("bibi:opened", function() { return onOpened.call(Extension); });
            };
        };
    };
};

Bibi.x = X.add;




})(typeof global != 'undefined' ? global : this);