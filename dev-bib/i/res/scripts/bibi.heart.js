/*!
 *                                                                                                                                (℠)
 *  ## BiB/i (heart)
 *  - "Heart of BiB/i"
 *
 */

(function(____) { 'use strict';




____.Bibi = { "version": "____bibi-version____", "build": "____bibi-build____", "href": "https://bibi.epub.link" };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() { setTimeout(Bibi.welcome, 0); });

Bibi.welcome = function() {

    O.stamp("Welcome!");
    O.log('Welcome! - BiB/i v' + Bibi["version"] + ' (' + Bibi["build"] + ') - [ja] ' + Bibi["href"] + ' - [en] https://github.com/satorumurmur/bibi', "-0");
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
        O.Mobile = true;
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
        O.Mobile = false;
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

    O.NotCompatible = (sML.UA.InternetExplorer < 11) ? true : false;
    if(O.NotCompatible) {
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
        O.log(Msg["en"].replace(/<[^>]*>/g, ""), "-*");
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

    const PromiseForLoadingExtensions = new Promise(function(resolve) {
        X.loadFilesInPreset().then(resolve);
    });

    O.HTML.classList.remove("welcome");

    // Ready ?
    PromiseForLoadingExtensions.then(function() {
        E.add("bibi:commands:move-by",     function(Par) { R.moveBy(Par); });
        E.add("bibi:commands:scroll-by",   function(Par) { R.scrollBy(Par); });
        E.add("bibi:commands:focus-on",    function(Par) { R.focusOn(Par); });
        E.add("bibi:commands:change-view", function(RVM) { R.changeView(RVM); });
        window.addEventListener("message", M.gate, false);
        Bibi.ready();
    });

    E.dispatch("bibi:initialized");

};


Bibi.ready = function() {

    O.HTML.classList.add("ready");

    E.add("bibi:readied", function() {
        if(S["book"]) {
            L.loadBook(S["book"]);
        } else if(S.BookDataElement) {
            L.loadBook(S.BookDataElement.innerText.trim(), { type: S.BookDataElement.getAttribute("data-bibi-book-mimetype") });
        } else {
            if(S["accept-local-file"]) {
                O.HTML.classList.add("waiting-file");
            } else {
                if(O.WindowEmbedded) {
                    I.note('Tell me EPUB name via embedding tag.', 99999999999);
                } else {
                    I.note('Tell me EPUB name via URI.', 99999999999);
                }
            }
        }
    });

    setTimeout(function() { E.dispatch("bibi:readied"); }, (O.Mobile ? 999 : 1));

    O.ReadiedURL = location.href;

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


L.wait = function() {
    return new Promise(function(resolve) {
        L.wait.resolve = function() { resolve(); delete L.wait.resolve; delete L.wait.reject; };
        L.wait.reject  = function() { reject();  delete L.wait.resolve; delete L.wait.reject; }
        O.Busy = false;
        O.HTML.classList.remove("busy");
        O.HTML.classList.add("waiting");
        E.dispatch("bibi:waits");
        O.log('(waiting)', '-*');
        I.note('');
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


L.loadBook = function(BookData, BookDataMeta) {
    B.initialize();
    R.reset();
    L.Preprocessed = false;
    L.Loaded = false;
    O.Busy = true;
    O.HTML.classList.remove("ready");
    O.HTML.classList.remove("waiting-file");
    O.HTML.classList.add("busy");
    O.HTML.classList.add("loading");
    I.note('Loading...');
    O.log("Initializing Book...", "*:");
    return new Promise(function(resolve, reject) {
        const BookDataType = (function() {
            if(!BookData) return null;
            if(typeof BookData == "string") {
                if(/^https?:\/\//.test(BookData)) return "URI";
                else                              return "Base64";
            }
            if(typeof BookData == "object") {
                if(BookData instanceof File) return "File";
                if(BookData instanceof Blob) return "BLOB";
            }
            return undefined;
        })();
        if(!BookDataType) return reject('Book Data Is Undefined.');
        if(BookDataType == "URI") {
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
                    O.log(getErrorMessage(As[0], ErrorDetail), "-*");
                    // Online Unzipped (probably)
                    O.log('Trying as ' + As[1] + '...', "-*");
                    O.download(B.Path + "/" + ToCheckExistance).then(function() {
                        // Online Unzipped (definitely)
                        B.Unzipped = true;
                        resolve(As[1]);
                    }).catch(function(XHR) {
                        const ErrorDetail = "";//(XHR.status == 404 ? ToCheckExistance + ' Is Not Found' : '');
                        O.log(getErrorMessage(As[1], ErrorDetail), "-*");
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
                    const ErrorDetail = "";//(XHR.status == 404 ? ToCheckExistance + ' Is Not Found' : '');
                    O.log(getErrorMessage(As[0], ErrorDetail), "-*");
                    // Online Zipped (probably)
                    return reject('To Open This Book as ' + As[1] + ', Changing "unzip-if-necessary" May Be Required.');
                });
            }
        } else {
            let MIMETypeError = false, FileOrData;
            const MIMETypeREs = { EPUB: /^application\/epub\+zip$/, Zine: /^application\/(zip|x-zip(-compressed)?)$/ };
            if(BookDataType == "File") {
                // Local Zipped EPUB/Zine File
                if(!S["accept-local-file"]) reject('To Open Local Files, Changing "accept-local-file" in default.js Is Required.');
                if(!BookData.name) return reject('Book File Is Invalid.');
                if(!/\.[\w\d]+$/.test(BookData.name)) {
                    return reject('BiB/i Can Not Open Local Files without Extension.');
                } else if(/\.(epub|zip)$/i.test(BookData.name)) {
                    if(!S.willBeUnzipped(BookData.name)) return reject('To Open This File, Changing "unzip-if-necessary" in default.js Is Required.');
                    if(/\.epub$/i.test(BookData.name)) {
                        if(!MIMETypeREs["EPUB"].test(BookData.type)) MIMETypeError = true;
                    } else {
                        if(!MIMETypeREs["Zine"].test(BookData.type)) MIMETypeError = true;
                    }
                } else {
                    MIMETypeError = true;
                }
                FileOrData = "File";
                B.Path = "[Local File] " + BookData.name;
            } else {
                if(BookDataType == "Base64") {
                    // Base64 Encoded EPUB/Zine Data
                    if(!S["accept-base64-encoded-data"]) return reject('To Open Base64 Encoded Data, Changing "accept-base64-encoded-data" in default.js Is Required.');
                    try {
                        const Bin = atob(BookData.replace(/^.*,/, ''));
                        const Buf = new Uint8Array(Bin.length);
                        for(let l = Bin.length, i = 0; i < l; i++) Buf[i] = Bin.charCodeAt(i);
                        BookData = new Blob([Buf.buffer], { type: BookDataMeta["type"] });
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
                if(!MIMETypeREs["EPUB"].test(BookData.type) && !MIMETypeREs["Zine"].test(BookData.type)) MIMETypeError = true;
                FileOrData = "Data";
            }
            if(MIMETypeError) return reject('BiB/i Can Not Open This Type of File.');
            if(!BookData.size) return reject('Book ' + FileOrData + ' Is Empty.');
            X.Unzipper.loadBookData(BookData).then(function(ContentLog) {
                     if(S["book-type"] == "EPUB") resolve("an Zipped EPUB " + FileOrData);
                else if(S["book-type"] == "Zine") resolve( "a Zipped Zine " + FileOrData);
                else                              throw '';
            }).catch(function() {
                reject('Book ' + FileOrData + ' Is Invalid.');
            });
        }
    }).then(function(As) {
        B.PathDelimiter = B.Unzipped ? "/" : " > ";
        O.log('Opened as ' + As + (S["book"] ? ': ' + S["book"] : '.'), "-*");
        O.log('Book Initialized.', "/*");
        if(S["book-type"] == "EPUB") {
            delete B.Zine;
            L.loadContainer();
        } else if(S["book-type"] == "Zine") {
            delete B.Mimetype;
            delete B.Container;
            X.Zine.loadZineData();
        } else {
            throw 'Book Data May Be Invalid.';
        }
    }).catch(function(Log) {
        I.Veil.Cover.className = "";
        if(S["accept-local-file"]) O.HTML.classList.add("waiting-file");
        const Message = 'BiB/i Failed to Open the Book.';
        I.note(Message, 99999999999, "ErrorOccured");
        O.error(Message + "\n* " + Log);
        return false;
    });
};



L.loadContainer = function() {
    O.log('Loading Container XML: ' + B.Path + B.PathDelimiter + B.Container.Path + ' ...', "*:");
    O.openDocument(B.Container.Path).then(L.processContainer).then(L.onLoadContainer);
};


L.processContainer = function(Doc) {
    B.Package.Path = Doc.getElementsByTagName("rootfile")[0].getAttribute("full-path");
    B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, "");
};


L.onLoadContainer = function() {
    O.log('Container XML Loaded.', "/*");
    L.loadPackageDocument();
};


L.loadPackageDocument = function() {
    O.log('Loading Package Document: ' + B.Path + B.PathDelimiter + B.Package.Path + ' ...', "*:");
    O.openDocument(B.Package.Path).then(L.processPackageDocument).then(L.onLoadPackageDocument);
};


L.processPackageDocument = function(Doc) {

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
                 if(          /^(identifier|title)$/.test(Property)) B.Package.Metadata[Property      ] = Meta.textContent;
            else if(/^(creator|publisher|language)$/.test(Property)) B.Package.Metadata[Property + "s"].push(Meta.textContent);
            else if(                  !B.Package.Metadata[Property]) B.Package.Metadata[Property      ] = Meta.textContent;
        }
        if(Meta.getAttribute("name") && Meta.getAttribute("content")) {
            // Others
            B.Package.Metadata[Meta.getAttribute("name")] = Meta.getAttribute("content");
        }
    });
    const XMLNS_DC = Metadata.getAttribute("xmlns:dc");
    if(!B.Package.Metadata["identifier"])                      O.forEach(Doc.getElementsByTagNameNS(XMLNS_DC, "identifier"), function(DCI) { B.Package.Metadata["identifier"] = DCI.textContent; });
    if(!B.Package.Metadata["identifier"])                      B.Package.Metadata["identifier"] = O.BookURL;
    if(!B.Package.Metadata["title"     ])                      O.forEach(Doc.getElementsByTagNameNS(XMLNS_DC, "title"),      function(DCT) { B.Package.Metadata["title"     ] = DCT.textContent; });
    if(!B.Package.Metadata["creators"  ].length)               O.forEach(Doc.getElementsByTagNameNS(XMLNS_DC, "creator"),    function(DCC) { B.Package.Metadata["creators"  ].push(DCC.textContent); });
    if(!B.Package.Metadata["publishers"].length)               O.forEach(Doc.getElementsByTagNameNS(XMLNS_DC, "publisher"),  function(DCP) { B.Package.Metadata["publishers"].push(DCP.textContent); });
    if(!B.Package.Metadata["languages" ].length)               O.forEach(Doc.getElementsByTagNameNS(XMLNS_DC, "language"),   function(DCL) { B.Package.Metadata["languages" ].push(DCL.textContent); });
    if(!B.Package.Metadata["languages" ].length)               B.Package.Metadata["languages"][0] = "en";
    if(!B.Package.Metadata["cover"])                           B.Package.Metadata["cover"]                 = "";
    if(!B.Package.Metadata["rendition:layout"])                B.Package.Metadata["rendition:layout"]      = "reflowable";
    if(!B.Package.Metadata["rendition:orientation"])           B.Package.Metadata["rendition:orientation"] = "auto";
    if(!B.Package.Metadata["rendition:spread"])                B.Package.Metadata["rendition:spread"]      = "auto";
    if( B.Package.Metadata["rendition:orientation"] == "auto") B.Package.Metadata["rendition:orientation"] = "portrait";
    if( B.Package.Metadata["rendition:spread"]      == "auto") B.Package.Metadata["rendition:spread"]      = "landscape";

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
    B.Package.Spine["page-progression-direction"] = Spine.getAttribute("page-progression-direction");
    if(!B.Package.Spine["page-progression-direction"] || !/^(ltr|rtl)$/.test(B.Package.Spine["page-progression-direction"])) B.Package.Spine["page-progression-direction"] = "ltr";//"default";
    B.PPD = B.Package.Spine["page-progression-direction"];
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
            "rendition:layout"      : B.Package.Metadata["rendition:layout"],
            "rendition:orientation" : B.Package.Metadata["rendition:orientation"],
            "rendition:spread"      : B.Package.Metadata["rendition:spread"]
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
        SpineItemref["viewport"] = { content: null, width: null, height: null };
        SpineItemref["viewBox"]  = { content: null, width: null, height: null };
        B.Package.Spine["itemrefs"].push(SpineItemref);
    });

    B.ID        = B.Package.Metadata["identifier"];
    B.Title     = B.Package.Metadata["title"];
    B.Creator   = B.Package.Metadata["creators"].join(  ", ");
    B.Publisher = B.Package.Metadata["publishers"].join(", ");
    B.Language  = B.Package.Metadata["languages"][0].split("-")[0];
    if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
        B.WritingMode = (B.PPD == "rtl") ? "tb-rl" : "lr-tb";
    } else if(/^(aze?|ara?|ui?g|urd?|kk|kaz|ka?s|ky|kir|kur?|sn?d|ta?t|pu?s|bal|pan?|fas?|per|ber|msa?|may|yid?|heb?|arc|syr|di?v)$/.test(B.Language)) {
        B.WritingMode = "rl-tb";
    } else if(/^(mo?n)$/.test(B.Language)) {
        B.WritingMode = "tb-lr";
    } else {
        B.WritingMode = "lr-tb";
    }

    if(B.Title) {
        const BookIDFragments = [B.Title];
        if(B.Creator)   BookIDFragments.push(B.Creator);
        if(B.Publisher) BookIDFragments.push(B.Publisher);
        const TitleExtras = S["website-name-in-title"] ? S["website-name-in-title"] : "Published with BiB/i";
        O.Title.innerHTML = "";
        O.Title.appendChild(document.createTextNode(BookIDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">") + " | " + TitleExtras));
        try { O.Info.querySelector("h1").innerHTML = document.title; } catch(Err) {}
    }

    const IDLogs = [];
    if(B.Title)     IDLogs.push(B.Title);
    if(B.Creator)   IDLogs.push(B.Creator);
    if(B.Publisher) IDLogs.push(B.Publisher);
    IDLogs.push('Language: "'  + B.Language + '"');
    O.log(IDLogs.join(' / '), "-*");

    const MetaLogs = [];
    MetaLogs.push('layout: "' + B.Package.Metadata["rendition:layout"] + '"');
    MetaLogs.push('orientation: "' + B.Package.Metadata["rendition:orientation"] + '"');
    MetaLogs.push('spread: "' + B.Package.Metadata["rendition:spread"] + '"');
    MetaLogs.push('page-progression-direction: "' + B.Package.Spine["page-progression-direction"] + '"');
    O.log(MetaLogs.join(' / '), "-*");

    if(S["use-cookie"]) {
        const BibiCookie = O.Cookie.remember(O.RootPath);
        const BookCookie = O.Cookie.remember(B.ID);
        if(BibiCookie) if(!U["reader-view-mode"] && BibiCookie.RVM     ) S["reader-view-mode"] = BibiCookie.RVM;
        if(BookCookie) if(!U["to"]               && BookCookie.Position) S["to"]               = BookCookie.Position;
    }

    S.update();

};


L.onLoadPackageDocument = function(Log) {
    E.dispatch("bibi:loaded-package-document");
    O.log(Log ? Log : 'Package Document Loaded.', "/*");
    L.createCover();
    L.prepareSpine();
    L.loadNavigation().then(function() {
        E.dispatch("bibi:prepared");
        if(S["autostart"] || L.Played) {
            L.loadItemsInSpreads();
        } else {
            L.wait().then(function() {
                L.loadItemsInSpreads();
            });
        }
    });
};


L.createCover = function() {

    O.log('Creating Cover...', "*:");

    I.Veil.Cover.Info.innerHTML = I.Panel.BookInfo.Cover.Info.innerHTML = "";

    if(B.Package.Manifest["cover-image"].Path) {
        R.CoverImage.Path = B.Package.Manifest["cover-image"].Path;
    }

    I.Veil.Cover.Info.innerHTML = I.Panel.BookInfo.Cover.Info.innerHTML = (function() {
        const BookID = [];
        if(B.Title)     BookID.push('<strong>' + B.Title     + '</strong>');
        if(B.Creator)   BookID.push('<em>'     + B.Creator   + '</em>');
        if(B.Publisher) BookID.push('<span>'   + B.Publisher + '</span>');
        return BookID.join(" ");
    })();

    if(R.CoverImage.Path) {
        O.log('Cover Image: ' + B.Path + B.PathDelimiter + R.CoverImage.Path, "-*");
        sML.create("img", {
            load: function() {
                //O.log('Loading Cover Image: ' + B.Path + B.PathDelimiter + R.CoverImage.Path + ' ...', "*:");
                const Img = this;
                Img.src = B.Files[R.CoverImage.Path] ? O.getDataURI(R.CoverImage.Path, B.Files[R.CoverImage.Path]) : B.Path + "/" + R.CoverImage.Path;
                Img.timeout = setTimeout(function() { Img.ontimeout(); }, 5000)
            },
            onload: function() {
                if(this.TimedOut) return false;
                clearTimeout(this.timeout);
                //O.log('Cover Image Loaded.', "/*");
                sML.style(I.Veil.Cover, { backgroundImage: "url(" + this.src + ")" });
                I.Panel.BookInfo.Cover.insertBefore(this, I.Panel.BookInfo.Cover.Info);
                I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "with-cover-image";
            },
            ontimeout: function() {
                this.TimedOut = true;
                //O.log('Cover Image Request Timed Out.', "/*");
                I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "without-cover-image";
            }
        }).load();
    } else {
        O.log('No Cover Image.', "-*");
        I.Veil.Cover.className = I.Panel.BookInfo.Cover.className = "without-cover-image";
        I.Veil.Cover.appendChild(I.getBookIcon());
    }

    O.log('Cover Created.', "/*");
    E.dispatch("bibi:created-cover", R.CoverImage.Path);

};


L.prepareSpine = function(ItemMaker) {

    O.log('Preparing Spine...', "*:");

    // For Spread Pairing of Pre-Paginated
    let SpreadPairBefore, SpreadPairAfter;
    if(B.PPD == "rtl") SpreadPairBefore = "right", SpreadPairAfter = "left";
    else               SpreadPairBefore = "left",  SpreadPairAfter = "right";

    B.FileDigit = (B.Package.Spine["itemrefs"].length + "").length;
    //if(B.FileDigit < 3) B.FileDigit = 3;

    if(typeof ItemMaker != "function") ItemMaker = function() {
        return sML.create("iframe", {
            scrolling: "no",
            allowtransparency: "true"
        });
    };

    // Spreads, Boxes, and Items
    O.forEach(B.Package.Spine["itemrefs"], function(ItemRef) {
        const ItemIndex = R.Items.length;
        // Item: A
        const Item = ItemMaker(ItemRef);
        Item.classList.add("item");
        Item.ItemRef = ItemRef;
        Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
        Item.URI = (function() {
            if(!Item.Path || B.Files[Item.Path]) return "";
            if(/^https?:\/\//.test(Item.Path)) return Item.Path;
            return B.Path + "/" + Item.Path;
        })();
        //Item.Dir = Item.Path.replace(/\/?[^\/]+$/, "");
        R.AllItems.push(Item);
        if(ItemRef["linear"] != "yes") return R.NonLinearItems.push(Item);
        R.Items.push(Item);
        // SpreadBox & Spread
        let SpreadBox, Spread;
        if(ItemRef["page-spread"] == "center") {
            Item.IsSpreadCenter = true;
        } else if(ItemRef["page-spread"] == SpreadPairBefore) {
            Item.IsSpreadPairBefore = true;
        } else if(ItemRef["page-spread"] == SpreadPairAfter && ItemIndex > 0) {
            Item.IsSpreadPairAfter = true;
            const PreviousItem = R.Items[ItemIndex - 1];
            if(PreviousItem.IsSpreadPairBefore) {
                PreviousItem.SpreadPair = Item;
                Item.SpreadPair = PreviousItem;
                Spread = PreviousItem.Spread;
                SpreadBox = Spread.SpreadBox;
            }
        }
        if(!Item.SpreadPair) {
            SpreadBox = R.Main.Book.appendChild(sML.create("div", { className: "spread-box" }));
            Spread = SpreadBox.appendChild(sML.create("div", { className: "spread" }));
            Spread.SpreadBox = SpreadBox;
            Spread.Items = [];
            Spread.Pages = [];
            Spread.SpreadIndex = R.Spreads.length;
            R.Spreads.push(Spread);
        }
        // ItemBox
        const ItemBox = Spread.appendChild(sML.create("div", { className: "item-box" }));
        // Item: B
        Item.Spread = Spread;
        Item.ItemBox = ItemBox;
        Item.Pages = [];
        Item.ItemIndexInSpread = Spread.Items.length;
        Item.ItemIndex         =           ItemIndex;
        Item.id = "item-" + sML.String.pad(Item.ItemIndex + 1, 0, B.FileDigit);
        Spread.Items.push(Item);
        [SpreadBox, Spread, ItemBox, Item].forEach(function(Ele) {
            Ele.RenditionLayout = ItemRef["rendition:layout"];
            Ele.PrePaginated = (Ele.RenditionLayout == "pre-paginated");
            Ele.classList.add(ItemRef["rendition:layout"]);
        });
        [ItemBox, Item].forEach(function(Ele) {
            if(ItemRef["page-spread"]) {
                Ele.classList.add("page-spread-" + ItemRef["page-spread"]);
            }
            if(ItemRef["bibi:layout"]) {
                Ele.classList.add("layout-" + ItemRef["bibi:layout"]);
            }
        });
    });

    O.log(R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : ''), "-*");

    O.log('Spine Prepared.', "/*");

};


L.loadNavigation = function() {

    if(B.Package.Manifest["nav"].Path) {
        I.Panel.BookInfo.Navigation.Path = B.Package.Manifest["nav"].Path;
        I.Panel.BookInfo.Navigation.Type = "Navigation Document";
    } else if(B.Package.Manifest["toc-ncx"].Path) {
        I.Panel.BookInfo.Navigation.Path = B.Package.Manifest["toc-ncx"].Path;
        I.Panel.BookInfo.Navigation.Type = "TOC-NCX";
    } 

    return new Promise(function(resolve, reject) {
        if(!I.Panel.BookInfo.Navigation.Type) {
            O.log('No Navigation Document or TOC-NCX.', "-*");
            return resolve();
        }
        O.log('Loading Navigation: ' + B.Path + B.PathDelimiter + I.Panel.BookInfo.Navigation.Path + ' ...', "*:");
        O.openDocument(I.Panel.BookInfo.Navigation.Path).then(function(Doc) {
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
            I.Panel.BookInfo.Navigation.Body = I.Panel.BookInfo.Navigation;
            L.postprocessItem.coordinateLinkages(I.Panel.BookInfo.Navigation, "InNav");
            R.resetNavigation();
            O.log('Navigation Loaded.', "/*");
            resolve();
        });
    }).then(function() {
        E.dispatch("bibi:loaded-navigation", I.Panel.BookInfo.Navigation.Path);
    });

};


L.loadItemsInSpreads = function() {

    O.stamp("Load Items in Spreads");
    O.log('Loading ' + R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + '...', "*:");

    R.resetStage();

    L.LoadedItems = 0;
    L.LoadedSpreads = 0;

    R.ToBeLaidOutLater = false;
    L.listenResizingWhileLoading = function() { R.ToBeLaidOutLater = true; };
    window.addEventListener("resize", L.listenResizingWhileLoading);

    L.preprocessResources().then(function() {
        R.Spreads.forEach(L.loadSpread);
    });

};


L.preprocessResources = function() {
    
    return new Promise(function(resolve, reject) {
        if(B.Unzipped) {
            if(S["book-type"] == "Zine") return resolve();
            const FileTypes = (function() {
                if(sML.UA.Gecko || sML.UA.Edge) return ["HTML", "CSS"];
                if(S["preprocess-html-always"]) return ["HTML"];
                return null;
            })();
            if(!FileTypes) return resolve();
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
            if(!FilesToBeLoaded) return resolve();
            let FilesLoaded = 0;
            for(let FilePath in B.Files) {
                (function(FilePath) {
                    O.download(B.Path + "/" +  FilePath).then(function(XHR) {
                        B.Files[FilePath] = XHR.responseText;
                        FilesLoaded++;
                        if(FilesLoaded >= FilesToBeLoaded) return resolve("ToPreprocess");
                    });
                })(FilePath);
            }
        } else {
            for(let FilePath in B.Files) if(typeof B.Package.Manifest.Files[FilePath] == "undefined") B.Files[FilePath] = "";
            resolve("ToPreprocess");
        }
    }).then(function(ToPreprocess) {
        if(!ToPreprocess) return;
        if(S["book-type"] == "EPUB") for(let Type in L.preprocessResources.Settings) if(L.preprocessResources.Settings[Type].init) L.preprocessResources.Settings[Type].init();
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
        if(AllCount) O.log('Preprocessed Resources (' + (PartLog.length != 1 ? AllCount + ' Files' + (PartLog.length > 1 ? ' = ' : '') : '') + PartLog.join(' + ') + ').', "-*");
        L.Preprocessed = true;
        E.dispatch("bibi:preprocessed-resources");
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
            this.ReplaceRules.push([/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/g, '$1column-count: auto$4']);
            if(sML.UA.WebKit || sML.UA.Blink) {
                return;
            }
            this.ReplaceRules.push([/-(epub|webkit)-/g, '']);
            if(sML.UA.Gecko) {
                this.ReplaceRules.push([/text-combine-horizontal:\s*([^;\}]+)\s*([;\}])/g, 'text-combine-upright: $1$2']);
                this.ReplaceRules.push([/text-combine:\s*horizontal\s*([;\}])/g, 'text-combine-upright: all$1']);
                return;
            }
            if(sML.UA.Edge) {
                this.ReplaceRules.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/g, 'text-combine-horizontal: $2; text-combine-upright: $2$3']);
                this.ReplaceRules.push([/text-combine\s*:\s*horizontal\s*([;\}])/g, 'text-combine-horizontal: all; text-combine-upright: all$1']);
            }
            if(sML.UA.InternetExplorer) {
                this.ReplaceRules.push([/writing-mode\s*:\s*vertical-rl\s*([;\}])/g,   'writing-mode: tb-rl$1']);
                this.ReplaceRules.push([/writing-mode\s*:\s*vertical-lr\s*([;\}])/g,   'writing-mode: tb-lr$1']);
                this.ReplaceRules.push([/writing-mode\s*:\s*horizontal-tb\s*([;\}])/g, 'writing-mode: lr-tb$1']);
                this.ReplaceRules.push([/text-combine-(upright|horizontal)\s*:\s*([^;\}\s]+)\s*([;\}])/g, '-ms-text-combine-horizontal: $2$3']);
                this.ReplaceRules.push([/text-combine\s*:\s*horizontal\s*([;\}])/g, '-ms-text-combine-horizontal: all$1']);
            }
            if(/^(zho?|chi|kor?|ja|jpn)$/.test(B.Language)) {
                this.ReplaceRules.push([/text-align\s*:\s*justify\s*([;\}])/g, 'text-align: justify; text-justify: inter-ideograph$1']);
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


L.loadSpread = function(Spread) {
    Spread.Loaded = false;
    Spread.LoadedItems = 0;
    Spread.Items.forEach(L.loadItem);
};


L.loadItem = function(Item) {
    const FullPath = Item.Path ? ((!/^https?:\/\//.test(Item.Path) ? B.Path + B.PathDelimiter : "") + Item.Path) : "";
    O.log(sML.String.pad(Item.ItemIndex + 1, 0, B.FileDigit) + '/' + sML.String.pad(R.Items.length, 0, B.FileDigit) + ' - ' + (FullPath ? FullPath : '... Not Found.'), "-*");
    Item.Loaded = false;
    Item.TimeCard = {};
    Item.stamp = function(What) { O.stamp(What, Item.TimeCard); };
    if(/\.(xhtml|xml|html?)$/i.test(Item.Path)) {
        // If HTML or Others
        if(B.Files[Item.Path]) {
            L.loadItem.writeItemHTML(Item, B.Files[Item.Path]);
            setTimeout(L.postprocessItem, 0, Item);
        } else {
            Item.src = FullPath;
            Item.onload = function() { setTimeout(L.postprocessItem, 0, Item); };
            Item.ItemBox.appendChild(Item);
        }
    } else if(/\.(svg)$/i.test(Item.Path)) {
        // If SVG-in-Spine
        Item.IsSVG = true;
        if(B.Files[Item.Path]) {
            L.loadItem.writeItemHTML(Item, false, '', B.Files[Item.Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
        } else {
            O.download(FullPath).then(function(XHR) {
                L.loadItem.writeItemHTML(Item, false, '<base href="' + FullPath + '" />', XHR.responseText.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
            });
        }
    } else if(/\.(gif|jpe?g|png)$/i.test(Item.Path)) {
        // If Bitmap-in-Spine
        Item.IsBitmap = true;
        L.loadItem.writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Files[Item.Path] ? O.getDataURI(Item.Path, B.Files[Item.Path]) : FullPath) + '" />');
    } else if(/\.(pdf)$/i.test(Item.Path)) {
        // If PDF-in-Spine
        Item.IsPDF = true;
        L.loadItem.writeItemHTML(Item, false, '',     '<iframe src="' + (B.Files[Item.Path] ? O.getDataURI(Item.Path, B.Files[Item.Path]) : FullPath) + '" />');
    } else {
        L.loadItem.writeItemHTML(Item, false, '', '');
    }
};


L.loadItem.writeItemHTML = function(Item, HTML, Head, Body) {
    Item.ItemBox.appendChild(Item);
    Item.contentDocument.open();
    Item.contentDocument.write(HTML ? HTML.replace(/^<\?.+?\?>/, "") : [
        '<!DOCTYPE html>',
        '<html>',
            '<head>' + Head + '</head>',
            '<body onload="setTimeout(function() { parent.L.postprocessItem(parent.R.Items[' + Item.ItemIndex + ']); document.body.removeAttribute(\'onload\'); return false; }, 0);">' + Body + '</body>',
        '</html>'
    ].join(""));
    Item.contentDocument.close();
};


L.postprocessItem = function(Item) {

    Item.stamp("Postprocess");

    Item.PostprocessTrialCount = Item.PostprocessTrialCount || 1;

    if(
        !Item.contentDocument.documentElement ||
        !Item.contentDocument.head ||
        !Item.contentDocument.body
    ) {
        if(Item.PostprocessTrialCount > 10) {
            return O.error("Faled to load an Item: " + Item.Path);
        } else {
            return setTimeout(function() {
                Item.PostprocessTrialCount++;
                L.postprocessItem(Item);
            }, 100);
        }
    }

    Item.contentDocument.addEventListener("wheel", R.Main.onWheeled);

    Item.HTML = Item.contentDocument.documentElement;
    Item.Head = Item.contentDocument.head;
    Item.Body = Item.contentDocument.body;

    Item.HTML.Item = Item.Head.Item = Item.Body.Item = Item;

    const XMLLang = Item.HTML.getAttribute("xml:lang"), Lang = Item.HTML.getAttribute("lang");
         if(!XMLLang && !Lang) Item.HTML.setAttribute("xml:lang", B.Language), Item.HTML.setAttribute("lang", B.Language);
    else if(!XMLLang         ) Item.HTML.setAttribute("xml:lang", Lang);
    else if(            !Lang)                                                 Item.HTML.setAttribute("lang", XMLLang);

    sML.Environments.forEach(function(EnvironmentClassName)      { Item.HTML.classList.add(EnvironmentClassName); });
    O.forEach(Item.Body.querySelectorAll("link"), function(Link) { Item.Head.appendChild(Link); });

    if(S["epub-additional-stylesheet"]) Item.Head.appendChild(sML.create("link",   { rel: "stylesheet", href: S["epub-additional-stylesheet"] }));
    if(S["epub-additional-script"])     Item.Head.appendChild(sML.create("script", { src: S["epub-additional-script"] }));

    Item.StyleSheets = [];
    sML.CSS.appendRule("html", "-webkit-text-size-adjust: 100%;", Item.contentDocument);
    O.forEach(Item.HTML.querySelectorAll("link, style"), function(SSEle) {
        if(/^link$/i.test(SSEle.tagName)) {
            if(!/^(alternate )?stylesheet$/.test(SSEle.rel)) return;
            if((sML.UA.Safari || sML.OS.iOS) && SSEle.rel == "alternate stylesheet") return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
        }
        Item.StyleSheets.push(SSEle);
    });

    Item.BibiProperties = {};
    const BibiProperties = Item.HTML.getAttribute("data-bibi-properties");
    if(BibiProperties) {
        BibiProperties.replace(/[\s\t\r\n]+/g, " ").split(" ").forEach(function(Property) {
            if(Property) Item.BibiProperties[Property] = true;
        });
    }

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

    E.dispatch("bibi:is-going-to:postprocess-item-content", Item);

    L.postprocessItem.processSVGs(Item);
    L.postprocessItem.defineViewport(Item);
    L.postprocessItem.coordinateLinkages(Item);

    new Promise(function(resolve, reject) {
        Item.CSSLoadingTimerID = setInterval(function() {
            if(Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return;
            clearInterval(Item.CSSLoadingTimerID);
            L.postprocessItem.patchStyles(Item);
            resolve();
        }, 100);
    }).then(function() {
        E.dispatch("bibi:postprocessed-item-content", Item);
        E.dispatch("bibi:postprocessed-item", Item);
        L.onLoadItem(Item);
    });

};


L.postprocessItem.processSVGs = function(Item) {
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
};


L.postprocessItem.defineViewport = function(Item) {
    const ItemRef = Item.ItemRef;
    O.forEach(Item.Head.getElementsByTagName("meta"), function(Meta) { // META Viewport
        if(Meta.name == "viewport") {
            ItemRef["viewport"].content = Meta.getAttribute("content");
            if(ItemRef["viewport"].content) {
                const ViewportWidth  = ItemRef["viewport"].content.replace( /^.*?width=([^\, ]+).*$/, "$1") * 1;
                const ViewportHeight = ItemRef["viewport"].content.replace(/^.*?height=([^\, ]+).*$/, "$1") * 1;
                if(!isNaN(ViewportWidth) && !isNaN(ViewportHeight)) {
                    ItemRef["viewport"].width  = ViewportWidth;
                    ItemRef["viewport"].height = ViewportHeight;
                }
            }
        }
    });
    if(ItemRef["rendition:layout"] == "pre-paginated" && !(ItemRef["viewport"].width * ItemRef["viewport"].height)) { // If Fixed-Layout Item without Viewport
        const ItemImage = Item.Body.firstElementChild;
        if(Item.SingleSVGOnlyItem) { // If Single-SVG-HTML or SVG-in-Spine, Use ViewBox for Viewport.
            if(ItemImage.getAttribute("viewBox")) {
                ItemRef["viewBox"].content = ItemImage.getAttribute("viewBox");
                const ViewBoxCoords  = ItemRef["viewBox"].content.split(" ");
                if(ViewBoxCoords.length == 4) {
                    const ViewBoxWidth  = ViewBoxCoords[2] * 1 - ViewBoxCoords[0] * 1;
                    const ViewBoxHeight = ViewBoxCoords[3] * 1 - ViewBoxCoords[1] * 1;
                    if(ViewBoxWidth && ViewBoxHeight) {
                        if(ItemImage.getAttribute("width")  != "100%") ItemImage.setAttribute("width",  "100%");
                        if(ItemImage.getAttribute("height") != "100%") ItemImage.setAttribute("height", "100%");
                        ItemRef["viewport"].width  = ItemRef["viewBox"].width  = ViewBoxWidth;
                        ItemRef["viewport"].height = ItemRef["viewBox"].height = ViewBoxHeight;
                    }
                }
            }
        } else if(Item.SingleIMGOnlyItem) { // If Single-IMG-HTML or Bitmap-in-Spine, Use IMG "width" / "height" for Viewport.
            ItemRef["viewport"].width  = parseInt(getComputedStyle(ItemImage).width);
            ItemRef["viewport"].height = parseInt(getComputedStyle(ItemImage).height);
        }
    }
};


L.postprocessItem.coordinateLinkages = function(Item, InNav) {
    const Path = Item.Path;
    const RootElement = Item.Body;
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
        const HrefPath = O.getPath(Path.replace(/\/?([^\/]+)$/, ""), (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? Path.replace(/^.+?([^\/]+)$/, "$1") : "") + HrefPathInSource);
        const HrefFnH = HrefPath.split("#");
        const HrefFile = HrefFnH[0] ? HrefFnH[0] : Path;
        const HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
        R.Items.forEach(function(rItem) {
            if(HrefFile == rItem.Path) {
                A.setAttribute("data-bibi-original-href", HrefPathInSource);
                A.setAttribute(HrefAttribute, B.Path + "/" + HrefPath);
                A.InNav = InNav;
                A.Destination = {
                    Item: rItem,
                    ElementSelector: (HrefHash ? "#" + HrefHash : undefined)
                };
                L.postprocessItem.coordinateLinkages.setJump(A);
                return;
            }
        });
        if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
            A.setAttribute("data-bibi-original-href", HrefPathInSource);
            if(X["EPUBCFI"]) {
                A.setAttribute(HrefAttribute, B.Path + "/#" + HrefHash);
                A.InNav = InNav;
                A.Destination = X["EPUBCFI"].getDestination(HrefHash);
                L.postprocessItem.coordinateLinkages.setJump(A);
            } else {
                A.removeAttribute(HrefAttribute);
                A.addEventListener("click", function() { return false; });
                if(!O.Mobile) {
                    A.addEventListener(O["pointerover"], function() { I.Help.show("(This link uses EPUBCFI. BiB/i needs the extension.)"); return false; });
                    A.addEventListener(O["pointerout"],  function() { I.Help.hide(); return false; });
                }
            }
        }
        if(InNav && typeof S["nav"] == (i + 1) && A.Destination) S["to"] = A.Destination;
    });
};

L.postprocessItem.coordinateLinkages.setJump = function(A) {
    A.addEventListener("click", function(Eve) {
        Eve.preventDefault(); 
        Eve.stopPropagation();
        if(A.Destination) {
            const Go = L.Opened ? function() {
                E.dispatch("bibi:commands:focus-on", { Destination: A.Destination, Duration: 0 });
            } : function() {
                if(S["start-in-new-window"]) return window.open(location.href + (location.hash ? "," : "#") + "pipi(nav:" + A.NavANumber + ")");
                S["to"] = A.Destination;
                L.play();
            };
            A.InNav ? I.Panel.toggle({ callback: Go }) : Go();
        }
        return false;
    });
    /*
    A.addEventListener(O["pointerdown"], function(Eve) {
        Eve.preventDefault(); 
        Eve.stopPropagation();
        return false;
    });
    */
};


L.postprocessItem.patchStyles = function(Item) {

    if(!L.Preprocessed) {
        if(sML.UA.InternetExplorer) {
            if(!B.Unzipped) return false;
            const IsCJK = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language);
            O.editCSSRules(Item.contentDocument, function(CSSRule) {
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
    if(sML.UA.Gecko) {
        O.forEach(Item.Body.getElementsByTagName("a"), function(A) {
            const ComputedStyle = getComputedStyle(A);
            if(/^vertical-/.test(ComputedStyle.writingMode)) {
                     if(ComputedStyle.textDecoration ==  "overline") A.style.textDecoration = "underline";
                else if(ComputedStyle.textDecoration == "underline") A.style.textDecoration =  "overline";
            }
        });
    }

    const ItemHTMLComputedStyle = getComputedStyle(Item.HTML);
    const ItemBodyComputedStyle = getComputedStyle(Item.Body);
    if(ItemHTMLComputedStyle[O.WritingModeProperty] != ItemBodyComputedStyle[O.WritingModeProperty]) {
        sML.style(Item.HTML, {
            "writing-mode": ItemBodyComputedStyle[O.WritingModeProperty]
        });
    }
    Item.HTML.WritingMode = O.getWritingMode(Item.HTML);
    Item.HTML.classList.add("writing-mode-" + Item.HTML.WritingMode);
         if(/-rl$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
    else if(/-lr$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
    else                                        if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
    if(Item.HTML.style) { sML.style(Item.ItemBox, L.postprocessItem.patchStyles.getBackgroundStyle(Item.HTML)); Item.HTML.style.background = "transparent"; }
    if(Item.Body.style) { sML.style(Item,         L.postprocessItem.patchStyles.getBackgroundStyle(Item.Body)); Item.Body.style.background = "transparent"; }
    O.forEach(Item.Body.getElementsByTagName("img"), function(Img) {
        Img.Bibi = {
            DefaultStyle: {
                "margin":            (Img.style.margin          ? Img.style.margin          : ""),
                "width":             (Img.style.width           ? Img.style.width           : ""),
                "height":            (Img.style.height          ? Img.style.height          : ""),
                "vertical-align":    (Img.style.verticalAlign   ? Img.style.verticalAlign   : ""),
                "page-break-before": (Img.style.pageBreakBefore ? Img.style.pageBreakBefore : ""),
                "page-break-after":  (Img.style.pageBreakAfter  ? Img.style.pageBreakAfter  : "")
            }
        }
    });

};

L.postprocessItem.patchStyles.getBackgroundStyle = function(Ele) {
    const ComputedStyle = getComputedStyle(Ele);
    return {
        backgroundColor:    ComputedStyle.backgroundColor,
        backgroundImage:    ComputedStyle.backgroundImage,
        backgroundRepeat:   ComputedStyle.backgroundRepeat,
        backgroundPosition: ComputedStyle.backgroundPosition,
        backgroundSize:     ComputedStyle.backgroundSize
    };
};


L.onLoadItem = function(Item) {
    Item.Loaded = true;
    L.LoadedItems++;
    if(Item.ImageItem) {
        Item.ItemBox.classList.add("image-item-box");
        Item.classList.add("image-item");
    }
    E.dispatch("bibi:loaded-item", Item);
    Item.stamp("Loaded");
    const Spread = Item.Spread;
    Spread.LoadedItems++;
    if(Spread.LoadedItems == Spread.Items.length) L.onLoadSpread(Spread);
    I.note("Loading... (" + (L.LoadedItems) + "/" + R.Items.length + " Items Loaded.)");
};


L.onLoadSpread = function(Spread) {
    L.LoadedSpreads++;
    Spread.ImageSpread = true;
    Spread.Items.forEach(function(Item) {
        if(!Item.ImageItem) Spread.ImageSpread = false;
    });
    if(Spread.ImageSpread) {
        Spread.SpreadBox.classList.add("image-spread-box");
        Spread.classList.add("image-spread");
    }
    E.dispatch("bibi:loaded-spread", Spread);
    if(!R.ToBeLaidOutLater) R.resetSpread(Spread);
    if(L.LoadedSpreads == R.Spreads.length) L.onLoadItemsInSpreads();
};


L.onLoadItemsInSpreads = function() {

    B.Files = {};
    R.resetPages();

    O.stamp("Items in Spreads Loaded");
    O.log(R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + ' Loaded.', "/*");
    E.dispatch("bibi:loaded-items");
    E.dispatch("bibi:loaded-spreads");
    E.dispatch("bibi:loaded-items-in-spreads");

    L.onLoadBook();

};


L.onLoadBook = function() {

    L.Loaded = true;
    O.Busy = false;
    O.HTML.classList.remove("busy");
    O.HTML.classList.remove("loading");

    O.stamp("Book Loaded");
    //O.log("Book Loaded.", "/*");
    E.dispatch("bibi:loaded-book");

    L.open();

};


L.open = function() {

    window.removeEventListener("resize", L.listenResizingWhileLoading);
    delete L.listenResizingWhileLoading;

    R.updateOrientation();

    R.layOut({
        Destination: (function() {
            if(S["to"]) {
                const HatchedDestination = R.focusOn.hatchDestination(S["to"]);
                if(HatchedDestination) return HatchedDestination;
            }
            return "head";
        })()
    });

    R.getCurrent();

    E.dispatch("bibi:laid-out:for-the-first-time");

    setTimeout(function() {
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
        I.Veil.close();
        document.body.click(); // To responce for user scrolling/keypressing immediately
        L.Opened = true;
        I.note('');
        E.dispatch("bibi:opened");
        O.stamp("Enjoy");
        O.log('Enjoy Readings!', "-0");
    }, 1);

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

    R.Main.addEventListener("wheel", R.Main.onWheeled);

    R.reset();

    E.add("bibi:scrolled", function() {
        R.getCurrent();
        if(S["use-cookie"] && R.Current.Page) {
            O.Cookie.eat(B.ID, {
                "Position": {
                    SpreadIndex: R.Current.Pages.StartPage.Spread.SpreadIndex,
                    PageProgressInSpread: R.Current.Pages.StartPage.PageIndexInSpread / R.Current.Pages.StartPage.Spread.Pages.length
                }
            });
        }
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
    E.add("bibi:loaded-item", function(Item) {
        I.observeTap(Item.HTML);
        Item.HTML.addTapEventListener("tap",         R.onTap);
        Item.HTML.addEventListener(O["pointermove"], R.onPointerMove);
        Item.HTML.addEventListener(O["pointerdown"], R.onPointerDown);
        Item.HTML.addEventListener(O["pointerup"],   R.onPointerUp);
    });

    E.add("bibi:tapped", function(Eve) {
        if(I.isPointerStealth()) return false;
        const BibiEvent = O.getBibiEvent(Eve);
        //if(BibiEvent.Coord.Y < I.Menu.offsetHeight) return false;
        if(S.RVM == "horizontal") {
            if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
        } else if(S.RVM == "vertical") {
            if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false;
        }
        if(BibiEvent.Target.tagName) {
            if(/bibi-slider/.test(BibiEvent.Target.className + BibiEvent.Target.id)) return false;
            if(O.isAnchorContent(BibiEvent.Target)) return false;
        }
        switch(S.ARD) {
            case "ttb": return (BibiEvent.Division.Y == "middle") ? E.dispatch("bibi:tapped-center") : false;
            default   : return (BibiEvent.Division.X == "center") ? E.dispatch("bibi:tapped-center") : false;
        }
    });

    E.add("bibi:tapped-center", function(Eve) {
        if(I.SubPanel) E.dispatch("bibi:closes-utilities",  Eve);
        else           E.dispatch("bibi:toggles-utilities", Eve);
    });

};


R.reset = function() {
    R.Started = false;
    R.AllItems = [], R.NonLinearItems = [];
    R.Spreads = [], R.Items = [], R.Pages = [];
    R.CoverImage = { Path: "" };
    R.Current = {};
    R.Main.Book.innerHTML = R.Sub.innerHTML = "";
};


R.resetStage = function() {
    const WIH = window.innerHeight;
    R.Stage = {};
    R.Columned = false;
    R.Main.style.padding = R.Main.style.width = R.Main.style.height = "";
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = "";
    R.Stage.Width  = O.Body.clientWidth;
    R.Stage.Height = WIH;
    O.HTML.style.height = O.Body.style.height = WIH + "px"; // for In-App Browsers
    try {  I.Veil.style.height = WIH + "px"; } catch(Err) {}
    try { I.Panel.style.height = WIH + "px"; } catch(Err) {}
    window.scrollTo(0, 0);
    if(S["use-full-height"]) {
        O.HTML.classList.add("book-full-height");
    } else {
        O.HTML.classList.remove("book-full-height");
        R.Stage.Height -= I.Menu.offsetHeight;
    }
    R.Stage[S.CC.A.SIZE.B] -= O.Scrollbars[S.CC.A.SIZE.B] + S["spread-margin"] * 2;
    if(S.RVM == "paged") {
        R.Stage.PageGap = 0;
    } else {
        R.Stage.PageGap = S["spread-gap"];
        R.Main.Book.style["padding" + S.CC.L.BASE.S] = R.Main.Book.style["padding" + S.CC.L.BASE.E] = S["spread-margin"] + "px";
    }
    R.Stage.Orientation = (R.Stage.Width / R.Stage.Height > 1.4) ? "landscape" : "portrait";
    R.Stage.BunkoLength = Math.floor(R.Stage[S.CC.L.SIZE.B] * R.DefaultPageRatio[S.CC.L.AXIS.L] / R.DefaultPageRatio[S.CC.L.AXIS.B]);
    R.Main.Book.style["background"] = S["book-background"] ? S["book-background"] : "";
};

R.resetSpread = function(Spread) {
    O.stamp("Reset Spread " + Spread.SpreadIndex + " Start");
    E.dispatch("bibi:is-going-to:reset-spread", Spread);
    Spread.Items.forEach(function(Item) {
        R.resetItem(Item);
    });
    const SpreadBox = Spread.SpreadBox;
    SpreadBox.style["margin" + S.CC.L.BASE.B] = SpreadBox.style["margin" + S.CC.L.BASE.A] = "";
    SpreadBox.style["margin" + S.CC.L.BASE.S] = SpreadBox.style["margin" + S.CC.L.BASE.E] = "auto";
    SpreadBox.style.padding = SpreadBox.style.width = SpreadBox.style.height = "";
    let Width = 0, Height = 0;
    if(Spread.RenditionLayout == "reflowable" || (S.BRL == "reflowable" && S.SLA == "vertical")) {
        if(Spread.Items.length == 2) {
            if(R.Stage.Width > Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth) {
                Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
                Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight);
            } else {
                Width  = Math.max(Spread.Items[0].ItemBox.offsetWidth,   Spread.Items[1].ItemBox.offsetWidth);
                Height =          Spread.Items[0].ItemBox.offsetHeight + Spread.Items[1].ItemBox.offsetHeight;
            }
        } else {
            Width  = Spread.Items[0].ItemBox.offsetWidth;
            Height = Spread.Items[0].ItemBox.offsetHeight;
        }
    } else {
        if(Spread.Items.length == 2) {
            Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
            Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight);
        } else {
            Width  = Spread.Items[0].ItemBox.offsetWidth * (Spread.Items[0].ItemRef["page-spread"] == "left" || Spread.Items[0].ItemRef["page-spread"] == "right" ? 2 : 1);
            Height = Spread.Items[0].ItemBox.offsetHeight;
        }
    }
    SpreadBox.style.width  = Math.ceil(Width) + "px";
    SpreadBox.style.height = Math.ceil(Height) + "px";
    Spread.style["border-radius"] = S["spread-border-radius"];
    Spread.style["box-shadow"]    = S["spread-box-shadow"];
    E.dispatch("bibi:reset-spread", Spread);
    O.stamp("Reset Spread " + Spread.SpreadIndex + " End");
};

R.DefaultPageRatio = { X: 103, Y: 148 };//{ X: 1, Y: Math.sqrt(2) };

R.resetItem = function(Item) {
    O.stamp("Reset Item " + Item.ItemIndex + " Start");
    O.stamp("Reset Start", Item.TimeCard);
    E.dispatch("bibi:is-going-to:reset-item", Item);
    Item.Reset = false;
    Item.Pages = [];
    Item.scrolling = "no";
    Item.Spreaded = false;
    Item.style.margin = Item.style.padding = Item.style.width = Item.style.height = "";
    Item.HTML.style[S.CC.L.SIZE.b] = Item.HTML.style[S.CC.L.SIZE.l] = "";
    sML.style(Item.HTML, { "transform-origin": "", "transformOrigin": "", "transform": "", "column-width": "", "column-gap": "", "column-rule": "" });
    Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
         if(Item.PrePaginated) R.resetItem.asPrePaginatedItem(Item);
    else if(Item.Outsourcing)  R.resetItem.asReflowableOutsourcingItem(Item);
    else                       R.resetItem.asReflowableItem(Item)
    Item.Reset = true;
    E.dispatch("bibi:reset-item", Item);
    O.stamp("Reset End", Item.TimeCard);
    O.stamp("Reset Item " + Item.ItemIndex + " End");
};

R.resetItem.asReflowableItem = function(Item) {
    const ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    let StageB = R.Stage[S.CC.L.SIZE.B];
    let StageL = R.Stage[S.CC.L.SIZE.L];
    let PageGap = R.Stage.PageGap;
    if(!/fill/.test(ItemRef["bibi:layout"])) {
        StageB  -= (S["item-padding-" + S.CC.L.BASE.s] + S["item-padding-" + S.CC.L.BASE.e]);
        StageL  -= (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]);
        PageGap += (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]);
        Item.style["padding-" + S.CC.L.BASE.b] = S["item-padding-" + S.CC.L.BASE.b] + "px";
        Item.style["padding-" + S.CC.L.BASE.a] = S["item-padding-" + S.CC.L.BASE.a] + "px";
        Item.style["padding-" + S.CC.L.BASE.s] = S["item-padding-" + S.CC.L.BASE.s] + "px";
        Item.style["padding-" + S.CC.L.BASE.e] = S["item-padding-" + S.CC.L.BASE.e] + "px";
    }
    let PageB = StageB;
    let PageL = StageL;
    if(!S["single-page-always"] && /-tb$/.test(B.WritingMode) && S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        const BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.CC.L.AXIS.L] / R.DefaultPageRatio[S.CC.L.AXIS.B]);
        const StageHalfL = Math.floor((StageL - PageGap) / 2);
        if(StageHalfL >= BunkoL) {
            Item.Spreaded = true;
            PageL = StageHalfL;
        }
    }
    Item.style[S.CC.L.SIZE.b] = PageB + "px";
    Item.style[S.CC.L.SIZE.l] = PageL + "px";
    R.resetItem.asReflowableItem.adjustContent(Item, PageB, PageL, PageGap);
    let ItemL = sML.UA.InternetExplorer ? Item.Body["client" + S.CC.L.SIZE.L] : Item.HTML["scroll" + S.CC.L.SIZE.L];
    const Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
    ItemL = (PageL + PageGap) * Pages - PageGap;
    Item.style[S.CC.L.SIZE.l] = ItemL + "px";
    if(sML.UA.InternetExplorer) Item.HTML.style[S.CC.L.SIZE.l] = "100%";
    let ItemBoxB = PageB;
    let ItemBoxL = ItemL + ((S.RVM == "paged" && Item.Spreaded && Pages % 2) ? (PageGap + PageL) : 0);
    if(!/fill/.test(ItemRef["bibi:layout"])) {
        ItemBoxB += (S["item-padding-" + S.CC.L.BASE.s] + S["item-padding-" + S.CC.L.BASE.e]);
        ItemBoxL += (S["item-padding-" + S.CC.L.BASE.b] + S["item-padding-" + S.CC.L.BASE.a]);
    }
    ItemBox.style[S.CC.L.SIZE.b] = ItemBoxB + "px";
    ItemBox.style[S.CC.L.SIZE.l] = ItemBoxL + "px";
    for(let i = 0; i < Pages; i++) {
        const Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
        if(!/fill/.test(ItemRef["bibi:layout"])) {
            Page.style["padding" + S.CC.L.BASE.B] = S["item-padding-" + S.CC.L.BASE.b] + "px";
            Page.style["padding" + S.CC.L.BASE.A] = S["item-padding-" + S.CC.L.BASE.a] + "px";
            Page.style["padding" + S.CC.L.BASE.S] = S["item-padding-" + S.CC.L.BASE.s] + "px";
            Page.style["padding" + S.CC.L.BASE.E] = S["item-padding-" + S.CC.L.BASE.e] + "px";
        }
        Page.style[S.CC.L.SIZE.b] = PageB + "px";
        Page.style[S.CC.L.SIZE.l] = PageL + "px";
        Page.style[S.CC.L.BASE.b] = (PageL + PageGap) * i + "px";
        Page.Item = Item, Page.Spread = Spread;
        Page.PageIndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
    }
    return Item;
};
R.resetItem.asReflowableItem.adjustContent = function(Item, PageB, PageL, PageGap) {
    E.dispatch("bibi:is-going-to:adjust-content", Item);
    const WordWrappingStyleSheetIndex = sML.CSS.appendRule("*", "word-wrap: break-word;", Item.contentDocument); ////
    R.resetItem.asReflowableItem.adjustContent.fitImages(Item, PageB, PageL);
    R.resetItem.asReflowableItem.adjustContent.columify(Item, PageB, PageL, PageGap);
    //if(S["page-breaking"]) R.resetItem.asReflowableItem.adjustContent.breakPages(Item, PageB);
    sML.deleteStyleRule(WordWrappingStyleSheetIndex, Item.contentDocument); ////
    E.dispatch("bibi:adjusted-content", Item);
};
R.resetItem.asReflowableItem.adjustContent.fitImages = function(Item, PageB, PageL) {
    O.forEach(Item.Body.getElementsByTagName("img"), function(Img) {
        if(!Img.Bibi || !Img.Bibi.DefaultStyle) return;
        //Img.style.display       = Img.Bibi.DefaultStyle["display"];
        //Img.style.verticalAlign = Img.Bibi.DefaultStyle["vertical-align"];
        Img.style.width         = Img.Bibi.DefaultStyle["width"];
        Img.style.height        = Img.Bibi.DefaultStyle["height"];
        const B = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]);
        const L = parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.l]);
        const MaxB = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.b]), PageB));
        const MaxL = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.CC.L.SIZE.l]), PageL));
        if(B > MaxB || L > MaxL) {
            //if(getComputedStyle(Img).display == "inline") Img.style.display = "inline-block";
            //Img.style.verticalAlign = "top";
            Img.style[S.CC.L.SIZE.b] = Math.floor(parseFloat(getComputedStyle(Img)[S.CC.L.SIZE.b]) * Math.min(MaxB / B, MaxL / L)) + "px";
            Img.style[S.CC.L.SIZE.l] = "auto";
        }
    });
};
R.resetItem.asReflowableItem.adjustContent.columify = function(Item, PageB, PageL, PageGap) {
    if(S.RVM == "paged" || Item.HTML["offset"+ S.CC.L.SIZE.B] > PageB) {
        R.Columned = Item.Columned = true, Item.ColumnBreadth = PageB, Item.ColumnLength = PageL, Item.ColumnGap = PageGap;
        Item.HTML.style[S.CC.L.SIZE.b] = PageB + "px";
        Item.HTML.style[S.CC.L.SIZE.l] = PageL + "px";
        sML.style(Item.HTML, {
            "column-fill": "auto",
            "column-width": Item.ColumnLength + "px",
            "column-gap": Item.ColumnGap + "px",
            "column-rule": ""
        });
    }
};/*
R.resetItem.asReflowableItem.adjustContent.breakPages = function(Item, PageB) {
    let PBR; // PageBreakerRulers
    if(Item.Body["offset" + S.CC.L.SIZE.B] <= PageB) PBR = [(S.SLA == "vertical" ? "Top" : "Left"), window["inner" + S.CC.L.SIZE.L], S.CC.L.SIZE.L, S.CC.L.SIZE.l, S.CC.L.BASE.a]; // ... PageL, S.CC.L.SIZE.L, S.CC.L.SIZE.l, S.CC.L.BASE.a];
    else                                        PBR = [(S.SLA == "vertical" ? "Left" : "Top"), PageB, S.CC.L.SIZE.B, S.CC.L.SIZE.b, S.CC.L.BASE.e]; // ... window["inner" + S.CC.L.SIZE.B], S.CC.L.SIZE.B, S.CC.L.SIZE.b, S.CC.L.BASE.e];
    O.forEach(Item.contentDocument.querySelectorAll("html>body *"), function(Ele) {
        const ComputedStyle = getComputedStyle(Ele);
        if(ComputedStyle.pageBreakBefore != "always" && ComputedStyle.pageBreakAfter != "always") return;
        if(Ele.BibiPageBreakerBefore) Ele.BibiPageBreakerBefore.style[PBR[3]] = "";
        if(Ele.BibiPageBreakerAfter)  Ele.BibiPageBreakerAfter.style[PBR[3]] = "";
        let OffsetChild = Ele,                                                  BreakPoint  = OffsetChild["offset" + PBR[0]], Add = 0;
        while(OffsetChild.offsetParent) OffsetChild = OffsetChild.offsetParent, BreakPoint += OffsetChild["offset" + PBR[0]];
        if(S.SLD == "rtl") BreakPoint = window["innerWidth"] + BreakPoint * -1 - Ele["offset" + PBR[2]];
        if(ComputedStyle.pageBreakBefore == "always") {
            if(!Ele.BibiPageBreakerBefore) Ele.BibiPageBreakerBefore = Ele.parentNode.insertBefore(sML.create("span", { className: "bibi-page-breaker-before" }, { display: "block" }), Ele);
            Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
            Ele.BibiPageBreakerBefore.style[PBR[3]] = Add + "px";
        }
        if(ComputedStyle.pageBreakAfter == "always") {
            BreakPoint += Add + Ele["offset" + PBR[2]];
            Ele.style["margin-" + PBR[4]] = 0;
            if(!Ele.BibiPageBreakerAfter) Ele.BibiPageBreakerAfter = Ele.parentNode.insertBefore(sML.create("span", { className: "bibi-page-breaker-after" }, { display: "block" }), Ele.nextSibling);
            Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
            Ele.BibiPageBreakerAfter.style[PBR[3]] = Add + "px";
        }
    });
};*/

R.resetItem.asReflowableOutsourcingItem = function(Item, Fun) {
    const ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    Item.style.margin = "auto";
    Item.style.padding = 0;
    let StageB = R.Stage[S.CC.L.SIZE.B];
    let StageL = R.Stage[S.CC.L.SIZE.L];
    let PageB = StageB;
    let PageL = StageL;
    if(!S["single-page-always"] && S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        const BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.CC.L.AXIS.L] / R.DefaultPageRatio[S.CC.L.AXIS.B]);
        const StageHalfL = Math.floor((StageL - R.Stage.PageGap) / 2);
        if(StageHalfL > BunkoL) {
            Item.Spreaded = true;
            PageL = StageHalfL;
        }
    }
    Item.style[S.CC.L.SIZE.b] = ItemBox.style[S.CC.L.SIZE.b] = PageB + "px";
    Item.style[S.CC.L.SIZE.l] = ItemBox.style[S.CC.L.SIZE.l] = PageL + "px";
    if(Item.ImageItem) {
        if(Item.HTML["scroll" + S.CC.L.SIZE.B] <= PageB && Item.HTML["scroll" + S.CC.L.SIZE.L] <= PageL) {
            const ItemBodyComputedStyle = getComputedStyle(Item.Body);
            Item.style.width = Item.Body.offsetWidth + parseFloat(ItemBodyComputedStyle.marginLeft) + parseFloat(ItemBodyComputedStyle.marginRight) + "px";
        } else {
            let TransformOrigin = "";
            if((S.SLD == "ttb" && Item.HTML["scroll" + S.CC.L.SIZE.B] > PageB) || (S.SLA == "horizontal" && Item.HTML["scroll" + S.CC.L.SIZE.L] > PageL)) {
                TransformOrigin = (/rl/.test(Item.HTML.WritingMode)) ? "100% 0" : "0 0";
            } else {
                TransformOrigin =  "50% 0";
            }
            sML.style(Item.HTML, {
                "transform-origin": TransformOrigin,
                "transform": "scale(" + (Math.floor(Math.min(PageB / Item.HTML["scroll" + S.CC.L.SIZE.B], PageL / Item.HTML["scroll" + S.CC.L.SIZE.L]) * 100) / 100) + ")"
            });
        }
        O.forEach(Item.Body.getElementsByTagName("img"), function(Img) {
            Img.style.maxWidth = "none";
            setTimeout(function() {
                Img.style.maxWidth = "";
            }, 0);
        });
    } else if(Item.FrameItem) {
        const IFrame = Item.Body.getElementsByTagName("iframe")[0];
        IFrame.style[S.CC.L.SIZE.b] = IFrame.style[S.CC.L.SIZE.l] = "100%";
    }
    const Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
    Page.style[S.CC.L.SIZE.b] = PageB + "px";
    Page.style[S.CC.L.SIZE.l] = PageL + "px";
    Page.style[S.CC.L.BASE.b] = 0;
    Page.Item = Item, Page.Spread = Spread;
    Page.PageIndexInItem = Item.Pages.length;
    Item.Pages.push(Page);
    return Item;
};

R.resetItem.asPrePaginatedItem = function(Item) {
    const ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    Item.HTML.style.margin = Item.HTML.style.padding = Item.Body.style.margin = Item.Body.style.padding = 0;
    let StageB = R.Stage[S.CC.L.SIZE.B];
    let StageL = R.Stage[S.CC.L.SIZE.L];
    let PageB = StageB;
    let PageL = StageL;
    Item.style.padding = 0;
    let Scale = 1;
    if(Item.Scale) {
        Scale = Item.Scale;
        delete Item.Scale;
    } else {
        Scale = 1;
        if((S.BRL == "pre-paginated" && S.SLA == "vertical") || R.Stage.Orientation == ItemRef["rendition:spread"] || ItemRef["rendition:spread"] == "both") {
            const SpreadViewPort = { Width: ItemRef["viewport"].width, Height: ItemRef["viewport"].height };
            if(Item.SpreadPair) SpreadViewPort.Width += Item.SpreadPair.ItemRef["viewport"].width;
            else if(ItemRef["page-spread"] == "right" || ItemRef["page-spread"] == "left") SpreadViewPort.Width += SpreadViewPort.Width;
            Scale = Math.min(
                PageB / SpreadViewPort[S.CC.L.SIZE.B],
                PageL / SpreadViewPort[S.CC.L.SIZE.L]
            );
        } else {
            Scale = Math.min(
                PageB / ItemRef["viewport"][S.CC.L.SIZE.b],
                PageL / ItemRef["viewport"][S.CC.L.SIZE.l]
            );
        }
        if(Item.SpreadPair) Item.SpreadPair.Scale = Scale;
    }
    //const SO /*= ScaleOptimizing*/ = 1 / Scale;
    PageL = Math.floor(ItemRef["viewport"][S.CC.L.SIZE.l] * Scale);
    PageB = Math.floor(ItemRef["viewport"][S.CC.L.SIZE.b] * (PageL / ItemRef["viewport"][S.CC.L.SIZE.l]));
    ItemBox.style[S.CC.L.SIZE.l] = PageL      + "px";
    ItemBox.style[S.CC.L.SIZE.b] = PageB      + "px";
    //   Item.style[S.CC.L.SIZE.l] = PageL * SO + "px";
    //   Item.style[S.CC.L.SIZE.b] = PageB * SO + "px";
       Item.style[S.CC.L.SIZE.l] = Item.style[S.CC.L.SIZE.b] = "100%";
    const TransformOrigin = (/rl/.test(Item.HTML.WritingMode)) ? "100% 0" : "0 0";
    sML.style(Item.HTML, {
        "width": ItemRef["viewport"].width + "px",
        "height": ItemRef["viewport"].height + "px",
        "transform-origin": TransformOrigin,
        "transformOrigin": TransformOrigin,
        //"transform": "scale(" + (Scale * SO) + ")"
        "transform": "scale(" + Scale + ")"
    });/*
    sML.style(Item, {
        "transform-origin": "0 0",
        "transformOrigin": "0 0",
        "transform": "scale(" + (1 / SO) + ")"
    });*/
    const Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
    if(ItemRef["page-spread"] == "right") Page.style.right = 0;
    else                                  Page.style.left  = 0;
    Page.style[S.CC.L.SIZE.b] = PageB + "px";
    Page.style[S.CC.L.SIZE.l] = PageL + "px";
    Page.Item = Item, Page.Spread = Spread;
    Page.PageIndexInItem = Item.Pages.length;
    Item.Pages.push(Page);
    return Item;
};

R.resetPages = function() {
    R.Pages.forEach(function(Page) {
        Page.parentNode.removeChild(Page);
    });
    R.Pages = [];
    R.Spreads.forEach(function(Spread) {
        Spread.Pages = [];
        Spread.Items.forEach(function(Item) {
            Item.Pages.forEach(function(Page) {
                Page.PageIndexInSpread = Spread.Pages.length; Spread.Pages.push(Page);
                Page.PageIndex         =      R.Pages.length;      R.Pages.push(Page);
                Page.id = "page-" + sML.String.pad(Page.PageIndex + 1, 0, B.FileDigit);
            });
        });
    });
    return R.Pages;
};

R.resetNavigation = function() {
};


R.layOutSpread = function(Spread) {
    O.stamp("Lay Out Spread " + Spread.SpreadIndex + " Start");
    E.dispatch("bibi:is-going-to:lay-out-spread", Spread);
    const SpreadBox = Spread.SpreadBox;
    SpreadBox.style.padding = "";
    SpreadBox.PaddingBefore = SpreadBox.PaddingAfter = 0;
    if(S.SLA == "horizontal") {
        // Set padding-start + padding-end of SpreadBox
        if(SpreadBox.offsetHeight < R.Stage[S.CC.L.SIZE.B]) {
            const SpreadBoxPaddingTop    = Math.floor((R.Stage[S.CC.L.SIZE.B] - SpreadBox.offsetHeight) / 2);
            const SpreadBoxPaddingBottom = R.Stage[S.CC.L.SIZE.B] - (SpreadBoxPaddingTop + SpreadBox.offsetHeight);
            SpreadBox.style.paddingTop    = SpreadBoxPaddingTop + "px";
            SpreadBox.style.paddingBottom = SpreadBoxPaddingBottom + "px";
        }
    }
    if(S.BRL == "pre-paginated") {
        if(R.Stage[S.CC.L.SIZE.L] >= SpreadBox["offset" + S.CC.L.SIZE.L]) {
            SpreadBox.PaddingBefore = SpreadBox.PaddingAfter = Math.ceil((R.Stage[S.CC.L.SIZE.L] - SpreadBox["offset" + S.CC.L.SIZE.L]) / 2);
        } else {
            const FirstItemInSpread = Spread.Items[0];
            if(R.Stage[S.CC.L.SIZE.L] >= FirstItemInSpread["offset" + S.CC.L.SIZE.L]) {
                SpreadBox.PaddingBefore = Math.ceil((R.Stage[S.CC.L.SIZE.L] - FirstItemInSpread["offset" + S.CC.L.SIZE.L]) / 2);
            }
            const LastItemInSpread = Spread.Items[Spread.Items.length - 1];
            if(R.Stage[S.CC.L.SIZE.L] >= LastItemInSpread["offset" + S.CC.L.SIZE.L]) {
                SpreadBox.PaddingAfter = Math.ceil((R.Stage[S.CC.L.SIZE.L] - LastItemInSpread["offset" + S.CC.L.SIZE.L]) / 2);
            }
        }
        if(Spread.SpreadIndex != 0) {
            const PreviousSpreadBox = R.Spreads[Spread.SpreadIndex - 1].SpreadBox;
            SpreadBox.PaddingBefore = SpreadBox.PaddingBefore - PreviousSpreadBox.PaddingAfter;
            if(SpreadBox.PaddingBefore < I.Menu.offsetHeight) SpreadBox.PaddingBefore = I.Menu.offsetHeight;
        }
    } else if(S.RVM == "paged") {
        if(Spread.SpreadIndex == 0) {
        } else {
            SpreadBox.PaddingBefore = R.Stage.PageGap;
        }
    } else {
        if(Spread.SpreadIndex == 0) {
            SpreadBox.PaddingBefore = Math.floor((R.Stage[S.CC.L.SIZE.L] - SpreadBox["offset" + S.CC.L.SIZE.L]) / 2);
        } else {
            SpreadBox.PaddingBefore = R.Stage.PageGap;
        }
        if(Spread.SpreadIndex == R.Spreads.length - 1) {
            SpreadBox.PaddingAfter  = Math.ceil( (R.Stage[S.CC.L.SIZE.L] - SpreadBox["offset" + S.CC.L.SIZE.L]) / 2);
        }
    }
    if(SpreadBox.PaddingBefore > 0) SpreadBox.style["padding" + S.CC.L.BASE.B] = SpreadBox.PaddingBefore + "px";
    if(SpreadBox.PaddingAfter  > 0) SpreadBox.style["padding" + S.CC.L.BASE.A] = SpreadBox.PaddingAfter  + "px";
    // Adjust R.Main.Book (div#epub-content-main)
    let MainContentLength = 0;
    R.Spreads.forEach(function(Spread) {
        MainContentLength += Spread.SpreadBox["offset" + S.CC.L.SIZE.L];
    });
    R.Main.Book.style[S.CC.L.SIZE.b] = "";
    R.Main.Book.style[S.CC.L.SIZE.l] = MainContentLength + "px";
    E.dispatch("bibi:laid-out-spread", Spread);
    O.stamp("Lay Out Spread " + Spread.SpreadIndex + " End");
};


R.layOut = function(Opt) {

    /*
        Opt: {
            Destination: BibiDestination,
            Reset: Boolean,
            Setting: BibiSetting (Optional),
            callback: Function (Optional)
        }
    */

    if(!Opt) Opt = {};

    if(R.LayingOut) return false;
    R.LayingOut = true;

    O.log('Laying out...', "*:");
    O.stamp("Lay Out Start");
    E.dispatch("bibi:closes-utilities");
    E.dispatch("bibi:is-going-to:lay-out", Opt);

    window.removeEventListener(O["resize"], R.onresize);
    R.Main.removeEventListener("scroll", R.onscroll);

    O.Busy = true;
    O.HTML.classList.add("busy");
    O.HTML.classList.add("laying-out");
    if(!Opt.NoNotification) I.note('Laying Out...');

    if(!Opt.Destination) {
        R.getCurrent();
        const CurrentPage = R.Current.Pages.StartPage;
        Opt.Destination = {
            SpreadIndex: CurrentPage.Spread.SpreadIndex,
            PageProgressInSpread: CurrentPage.PageIndexInSpread / CurrentPage.Spread.Pages.length
        }
    }

    if(Opt.Setting) S.update(Opt.Setting);

    O.log([
        'reader-view-mode: "' + S.RVM + '"',
        'spread-layout-direction: "' + S.SLD + '"',
        'apparent-reading-direction: "' + S.ARD + '"'
    ].join(' / '), "-*");

    if(typeof Opt.before == "function") Opt.before();

    //setTimeout(function() {

    if(Opt.Reset || R.ToBeLaidOutLater) {
        R.ToBeLaidOutLater = false;
        R.resetStage();
        R.Spreads.forEach(function(Spread) { R.resetSpread(Spread); });
        R.resetPages();
        R.resetNavigation();
    }
    R.Spreads.forEach(function(Spread) { R.layOutSpread(Spread); });

    R.Columned = false;
    for(let l = R.Items.length, i = 0; i < l; i++) {
        const Style = R.Items[i].HTML.style;
        if(Style["-webkit-column-width"] || Style["-moz-column-width"] || Style["-ms-column-width"] || Style["column-width"]) {
            R.Columned = true;
            break;
        }
    }

    E.dispatch("bibi:commands:focus-on", { Destination: Opt.Destination, Duration: 0 });

    O.Busy = false;
    O.HTML.classList.remove("busy");
    O.HTML.classList.remove("laying-out");
    if(!Opt.NoNotification) I.note('');

    window.addEventListener(O["resize"], R.onresize);
    R.Main.addEventListener("scroll", R.onscroll);

    R.LayingOut = false;

    if(typeof Opt.callback == "function") Opt.callback();

    E.dispatch("bibi:laid-out");
    O.stamp("Lay Out End");
    O.log('Laid out.', "/*");

    //}, 1);

};

R.updateOrientation = function() {
    const PreviousOrientation = R.Orientation;
    if(typeof window.orientation != "undefined") {
        R.Orientation = (window.orientation == 0 || window.orientation == 180) ? "portrait" : "landscape";
    } else {
        const W = window.innerWidth  - (S.SLA == "vertical"   ? O.Scrollbars.Width  : 0);
        const H = window.innerHeight - (S.SLA == "horizontal" ? O.Scrollbars.Height : 0);
        R.Orientation = W / H < 1.4 /* Math.floor(Math.sqrt(2) * 10) / 10 */ ? "portrait" : "landscape";
    }
    if(R.Orientation != PreviousOrientation) {
        E.dispatch("bibi:changes-orientation", R.Orientation);
        O.HTML.classList.remove("orientation-" + PreviousOrientation);
        O.HTML.classList.add("orientation-" + R.Orientation);
        E.dispatch("bibi:changed-orientation", R.Orientation);
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
    }, O.Mobile ? 444 : 222);
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

R.changeView = function(RVM) {
    if(S["fix-reader-view-mode"] || typeof RVM != "string" || S.RVM == RVM || !/^(paged|horizontal|vertical)$/.test(RVM)) return false;
    if(L.Opened) {
        E.dispatch("bibi:closes-utilities");
        E.dispatch("bibi:changes-view");
        O.Busy = true;
        O.HTML.classList.add("busy");
        setTimeout(function() {
            if(RVM != "paged") {
                R.Spreads.forEach(function(Spread) {
                    Spread.style.opacity = "";
                });
            }
            R.layOut({
                Reset: true,
                Setting: { "reader-view-mode": RVM },
                callback: function() {
                    //Option["page-progression-direction"] = S.PPD;
                    E.dispatch("bibi:changed-view", RVM);
                    O.HTML.classList.remove("busy");
                    O.Busy = false;
                }
            });
        }, 888);
    } else {
        S.update({ "reader-view-mode": RVM });
        L.play();
    }
    if(S["use-cookie"]) {
        O.Cookie.eat(O.RootPath, { "RVM": RVM });
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
    let Pages = [], Ratio = [], Status = [], BiggestRatio = 0, Done = false;
    R.Pages.forEach(function(Page, i) {
        if(Done) return;
        const PageCoord = sML.getCoord(Page);
        PageCoord.Before = PageCoord[S.CC.L.BASE.B];
        PageCoord.After  = PageCoord[S.CC.L.BASE.A];
        const LengthInside = Math.min(FrameScrollCoord.After * S.CC.L.AXIS.PM, PageCoord.After * S.CC.L.AXIS.PM) - Math.max(FrameScrollCoord.Before * S.CC.L.AXIS.PM, PageCoord.Before * S.CC.L.AXIS.PM);
        const PageRatio = (LengthInside <= 0 || !PageCoord[S.CC.L.SIZE.L] || isNaN(LengthInside)) ? 0 : Math.round(LengthInside / PageCoord[S.CC.L.SIZE.L] * 100);
        if(PageRatio <= 0) {
            if(Pages.length) Done = true;
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
    });
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
    R.Current.Pages = R.getCurrentPages();
    R.Current.Page = R.Current.Pages.EndPage;
    R.Current.Percent = Math.floor((R.Current.Pages.EndPage.PageIndex + 1) / R.Pages.length * 100);
    R.classifyCurrent();
    return R.Current;
};


R.classifyCurrent = function() {
    R.Spreads.forEach(function(Spread) {
        Spread.IsCurrent = false;
        Spread.Items.forEach(function(Item) {
            Item.IsCurrent = false;
            Item.Pages.forEach(function(Page) {
                Page.IsCurrent = false;
                R.Current.Pages.forEach(function(CurrentPage) {
                    if(Page == CurrentPage) {
                        Page.IsCurrent = true;
                        Item.IsCurrent = true;
                        Spread.IsCurrent = true;
                    }
                });
                if(Page.IsCurrent) O.replaceClass(Page, "not-current", "current");
                else               O.replaceClass(Page, "current", "not-current");
            });
            if(Item.IsCurrent) [Item, Item.ItemBox].forEach(function(Ele) { O.replaceClass(Ele, "not-current", "current"); });
            else               [Item, Item.ItemBox].forEach(function(Ele) { O.replaceClass(Ele, "current", "not-current"); });
        });
        if(Spread.IsCurrent) [Spread, Spread.SpreadBox].forEach(function(Ele) { O.replaceClass(Ele, "not-current", "current"); });
        else                 [Spread, Spread.SpreadBox].forEach(function(Ele) { O.replaceClass(Ele, "current", "not-current"); });
    });
};


R.focusOn = function(Par) {
    if(R.Moving) return false;
    if(!Par) return false;
    if(typeof Par == "number") Par = { Destination: Par };
    Par.Destination = R.focusOn.hatchDestination(Par.Destination);
    if(!Par.Destination) return false;
    E.dispatch("bibi:is-going-to:focus-on", Par);
    R.Moving = true;
    let FocusPoint = 0;
    if(S["book-rendition-layout"] == "reflowable") {
        if(Par.Destination.Edge == "head") {
            FocusPoint = (S.SLD != "rtl") ? 0 : R.Main.Book["offset" + [S.CC.L.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.CC.L.SIZE.L];
        } else if(Par.Destination.Edge == "foot") {
            FocusPoint = (S.SLD == "rtl") ? 0 : R.Main.Book["offset" + [S.CC.L.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.CC.L.SIZE.L];
        } else {
            FocusPoint = O.getElementCoord(Par.Destination.Page)[S.CC.L.AXIS.L];
            if(Par.Destination.Side == "after") FocusPoint += (Par.Destination.Page["offset" + S.CC.L.SIZE.L] - R.Stage[S.CC.L.SIZE.L]) * S.CC.L.AXIS.PM;
            if(S.SLD == "rtl") FocusPoint += Par.Destination.Page.offsetWidth - R.Stage.Width;
        }
    } else {
        if(R.Stage[S.CC.L.SIZE.L] >= Par.Destination.Page.Spread["offset" + S.CC.L.SIZE.L]) {
            FocusPoint = O.getElementCoord(Par.Destination.Page.Spread)[S.CC.L.AXIS.L];
            FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Par.Destination.Page.Spread["offset" + S.CC.L.SIZE.L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Par.Destination.Page)[S.CC.L.AXIS.L];
            if(R.Stage[S.CC.L.SIZE.L] > Par.Destination.Page["offset" + S.CC.L.SIZE.L]) FocusPoint -= Math.floor((R.Stage[S.CC.L.SIZE.L] - Par.Destination.Page["offset" + S.CC.L.SIZE.L]) / 2);
        }
    }
    if(typeof Par.Destination.TextNodeIndex == "number") R.selectTextLocation(Par.Destination); // Colorize Destination with Selection
    sML.scrollTo(R.focusOn.getScrollTarget(FocusPoint), {
        ForceScroll: true,
        Duration: 0,//(S.RVM == "paged" && S.ARD != S.SLD ? 0 : Par.Duration),
        callback: function() {
            R.getCurrent();
            R.Moving = false;
            if(Par.callback) Par.callback(Par);
            E.dispatch("bibi:focused-on", Par);
        }
    });
    return true;
};


R.focusOn.hatchDestination = function(Destination) { // from Page, Element, or Edge
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
             if(typeof Destination.PageIndex   == "number") Destination = { Page: Destination };
        else if(typeof Destination.ItemIndex   == "number") Destination = { Item: Destination };
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
            Destination.Page = R.focusOn.getNearestPageOfElement(Destination.Element);
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

R.focusOn.getNearestPageOfElement = function(Ele) {
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

R.focusOn.getScrollTarget = function(FocusPoint) {
    const ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[S.CC.L.AXIS.L] = FocusPoint;
    return ScrollTarget;
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
    if(R.Moving || !L.Opened) return false;
    if(!Par) return false;
    if(typeof Par == "number") Par = { Distance: Par };
    if(!Par.Distance || typeof Par.Distance != "number") return false;
    Par.Distance *= 1;
    if(Par.Distance == 0 || isNaN(Par.Distance)) return false;
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
        CurrentPage.Item.PrePaginated ||
        CurrentPage.Item.Outsourcing ||
        CurrentPage.Item.Pages.length == 1 ||
        (Par.Distance < 0 && CurrentPage.PageIndexInItem == 0) ||
        (Par.Distance > 0 && CurrentPage.PageIndexInItem == CurrentPage.Item.Pages.length - 1)
    );
    const callback = Par.callback;
    Par.callback = function(Par) {
        if(typeof callback == "function") callback(Par);
        E.dispatch("bibi:moved-by", Par);
    };
    if(!ToFocus) {
        E.dispatch("bibi:commands:scroll-by", Par);
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
        E.dispatch("bibi:commands:focus-on", Par);
    }
    return true;
};

R.scrollBy = function(Par) {
    if(!Par) return false;
    if(typeof Par == "number") Par = { Distance: Par };
    if(!Par.Distance || typeof Par.Distance != "number") return false;
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
    sML.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: ((S.RVM == "paged") ? 0 : Par.Duration),
        callback: function() {
            R.getCurrent();
            R.Moving = false;
            if(Par.callback) Par.callback(Par);
            E.dispatch("bibi:scrolled-by", Par);
        }
    });
    return true;
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
    if(!O.Mobile) {
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
    I.Veil.Cover.Info = I.Veil.Cover.appendChild(
        sML.create("p", { id: "bibi-veil-cover-info" })
    );

    const PlayButtonTitle = (O.Mobile ? 'Tap' : 'Click') + ' to Open';
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
    E.add("bibi:played", function() {
        I.Veil.PlayButton.hide()
    });

    E.dispatch("bibi:created-veil");

};

I.createCatcher = function() {
    // Catcher
    if(S["book"] || S.BookDataElement || !S["accept-local-file"]) return;
    const CatcherInnerHTML = I.distillLabels.distillLanguage({
        default: '<div class="pgroup" lang="en">' + [
            '<p><strong>Pass Me Your EPUB File!</strong></p>',
            '<p><em>You Can Open Your Own EPUB.</em></p>',
            '<p><span>Please ' + (O.Mobile ? 'Tap' : 'Drag & Drop It Here. <br />Or Click') + ' Here and Choose It.</span></p>',
            '<p><small>(Open in Your Device without Uploading)</small></p>'
        ].join("") + '</div>',
        ja: '<div class="pgroup" lang="ja">' + [
            '<p><strong>EPUBファイルを見せてください！</strong></p>',
            '<p><em>お持ちの EPUB ファイルを<br />開くことができます。</em></p>',
            '<p><span>' + (O.Mobile ? 'ここをタップ' : 'ここにドラッグ＆ドロップするか、<br />ここをクリック') + 'して選択してください。</span></p>',
            '<p><small>（外部に送信されず、この端末の中で開きます）</small></p>'
        ].join("") + '</div>'
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
        L.loadBook(FileData, "Input");
    });
    I.Catcher.addEventListener("click", function(Eve) {
        this.Input.click(Eve);
    });
    if(!O.Mobile) {
        I.Catcher.addEventListener("dragenter", function(Eve) { Eve.preventDefault(); O.HTML.classList.add(   "dragenter"); }, 1);
        I.Catcher.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); }, 1);
        I.Catcher.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); O.HTML.classList.remove("dragenter"); }, 1);
        I.Catcher.addEventListener("drop",      function(Eve) { Eve.preventDefault();
            let FileData = {};  try { FileData = Eve.dataTransfer.files[0]; } catch(Err) {}
            L.loadBook(FileData, "Drop");
        }, 1);
    }
    I.Catcher.appendChild(I.getBookIcon());
};


I.createPanel = function() {

    I.Panel = O.Body.appendChild(sML.create("div", { id: "bibi-panel" }));
    I.setToggleAction(I.Panel, {
        onopened: function(Opt) {
            O.HTML.classList.add("panel-opened");
            E.dispatch("bibi:opened-panel");
        },
        onclosed: function(Opt) {
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

    E.add("bibi:opens-utilities",   function(Opt) { E.dispatch("bibi:commands:open-menu", Opt); });
    E.add("bibi:closes-utilities",  function(Opt) { E.dispatch("bibi:commands:close-menu", Opt); });
    E.add("bibi:toggles-utilities", function(Opt) { E.dispatch("bibi:commands:toggle-menu", Opt); });

    E.add("bibi:opened",       I.Menu.close);

    E.add("bibi:scrolls", function() {
        clearTimeout(I.Menu.Timer_cool);
        if(!I.Menu.Hot) I.Menu.classList.add("hot");
        I.Menu.Hot = true;
        I.Menu.Timer_cool = setTimeout(function() {
            I.Menu.Hot = false;
            I.Menu.classList.remove("hot");
        }, 1234);
    });
    if(!O.Mobile) {
        E.add("bibi:moved-pointer", function(Eve) {
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            clearTimeout(I.Menu.Timer_close);
            if(BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) {
                E.dispatch("bibi:hovers", Eve, I.Menu);
            } else if(I.Menu.Hover) {
                I.Menu.Timer_close = setTimeout(function() {
                    E.dispatch("bibi:unhovers", Eve, I.Menu);
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
    if(O.FullscreenEnabled && !O.Mobile)                                                               I.createMenu.SettingMenuComponents.push("FullscreenButton");
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
            default: { default: 'Open Index', ja: '目次を開く' },
            active:  { default: 'Close Index', ja: '目次を閉じる' }
        },
        Help: true,
        Icon: '<span class="bibi-icon bibi-icon-toggle-panel"><span class="bar-1"></span><span class="bar-2"></span><span class="bar-3"></span></span>',
        action: function() {
            I.Panel.toggle();
        }
    });
    E.add("bibi:opened-panel", function() { I.setUIState(I.PanelSwitch, "active"); });
    E.add("bibi:closed-panel", function() { I.setUIState(I.PanelSwitch, ""); });
    E.add("bibi:started", function() {
        sML.style(I.PanelSwitch, { display: "block" });
    });

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
    I.Menu.Config.SubPanel = I.createSubPanel({ Opener: I.Menu.Config.Button, id: "bibi-subpanel_change-view" });

    if(
        I.createMenu.SettingMenuComponents.includes("ViewModeButtons") || 
        I.createMenu.SettingMenuComponents.includes("NewWindowButton") ||
        I.createMenu.SettingMenuComponents.includes("FullscreenButton")
    ) I.Menu.Config.ViewSection = I.createMenu.createSettingMenu.createViewSection();

    if(
        I.createMenu.SettingMenuComponents.includes("WebsiteLink") ||
        I.createMenu.SettingMenuComponents.includes("BibiWebsiteLink")
    ) I.Menu.Config.LinkageSection = I.createMenu.createSettingMenu.createLinkageSection();

    E.dispatch("bibi:created-setting-menu");

};


I.createMenu.createSettingMenu.createViewSection = function() {

    // Shapes
    const Shape = {};
    Shape.Item         = '<span class="bibi-shape bibi-shape-item"></span>';
    Shape.Spread       = '<span class="bibi-shape bibi-shape-spread">' + Shape.Item + Shape.Item + '</span>';

    // Icons
    const Icon = {};
    Icon["paged"]      = '<span class="bibi-icon bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';
    Icon["horizontal"] = '<span class="bibi-icon bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';
    Icon["vertical"]   = '<span class="bibi-icon bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';

    const changeView = function() {
        R.changeView(this.Value);
    };

    const ViewSection = I.Menu.Config.SubPanel.addSection({
        // Labels: { default: { default: 'Choose Layout', ja: 'レイアウトを選択' } }
    });

    const ViewModeButtonGroup = ViewSection.addButtonGroup({
        Buttons: [
            {
                Type: "radio",
                Labels: {
                    default: {
                        default: '<span class="non-visual-in-label">Layout:</span> Each Page <small>(Flip with ' + (O.Mobile ? 'Tap/Swipe' : 'Click/Wheel') + ')</small>',
                        ja: 'ページ単位表示<small>（' + (O.Mobile ? 'タップ／スワイプ' : 'クリック／ホイール') + 'で移動）</small>'
                    }
                },
                Notes: true,
                Icon: Icon["paged"],
                Value: "paged",
                action: changeView
            },
            {
                Type: "radio",
                Labels: {
                    default: {
                        default: '<span class="non-visual-in-label">Layout:</span> All Pages <small>(Horizontal Scroll)</small>',
                        ja: '全ページ表示<small>（横スクロール移動）</small>'
                    }
                },
                Notes: true,
                Icon: Icon["horizontal"],
                Value: "horizontal",
                action: changeView
            },
            {
                Type: "radio",
                Labels: {
                    default: {
                        default: '<span class="non-visual-in-label">Layout:</span> All Pages <small>(Vertical Scroll)</small>',
                        ja: '全ページ表示<small>（縦スクロール移動）</small>'
                    }
                },
                Notes: true,
                Icon: Icon["vertical"],
                Value: "vertical",
                action: changeView
            }
        ]
    });

    E.add("bibi:updated-settings", function() {
        ViewModeButtonGroup.Buttons.forEach(function(Button) {
            I.setUIState(Button, (Button.Value == S.RVM ? "active" : "default"));
        });
    });

    const WindowManagerButtons = [];

    // New Window
    if(I.createMenu.SettingMenuComponents.includes("NewWindowButton")) WindowManagerButtons.push({
        Type: "link",
        Labels: {
            default: { default: 'Open in New Window', ja: 'あたらしいウィンドウで開く' }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: O.RequestedURL,
        target: "_blank"
    });

    // Fullscreen
    if(I.createMenu.SettingMenuComponents.includes("FullscreenButton")) WindowManagerButtons.push({
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

    if(WindowManagerButtons.length) ViewSection.addButtonGroup({
        Buttons: WindowManagerButtons
    });

    return ViewSection;

};


I.createMenu.createSettingMenu.createLinkageSection = function() {

    const LinkageButtons = [];

    if(I.createMenu.SettingMenuComponents.includes("WebsiteLink")) LinkageButtons.push({
        Type: "link",
        Labels: {
            default: { default: S["website-name-in-menu"].replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;') }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: S["website-href"],
        target: "_blank"
    });

    if(I.createMenu.SettingMenuComponents.includes("BibiWebsiteLink")) LinkageButtons.push({
        Type: "link",
        Labels: {
            default: { default: "BiB/i | Official Website" }
        },
        Icon: '<span class="bibi-icon bibi-icon-open-newwindow"></span>',
        href: Bibi["href"],
        target: "_blank"
    });

    const LinkageSection = I.Menu.Config.SubPanel.addSection({
        // Labels: { default: { default: 'Link' + (LinkageButtons.length > 1 ? 's' : ''), ja: 'リンク' } },
    });

    if(LinkageButtons.length) LinkageSection.addButtonGroup({
        Buttons: LinkageButtons
    });

    return LinkageSection;

};

I.createFontSizeChanger = function() {

    I.FontSizeChanger = {};

    if(typeof S["font-size-scale-per-step"] != "number" || S["font-size-scale-per-step"] <= 1) S["font-size-scale-per-step"] = 1.25;

    if(S["use-font-size-changer"] && S["use-cookie"]) {
        const BibiCookie = O.Cookie.remember(O.RootPath);
        if(BibiCookie && BibiCookie.FontSize && BibiCookie.FontSize.Step != undefined) I.FontSizeChanger.Step = BibiCookie.FontSize.Step * 1;
    }
    if(typeof I.FontSizeChanger.Step != "number" || I.FontSizeChanger.Step < -2 || 2 < I.FontSizeChanger.Step) I.FontSizeChanger.Step = 0;

    I.FontSizeChanger.changeItemFontSize = function(Item, FontSize) {
        if(Item.FontSizeStyleRule) sML.CSS.deleteRule(Item.FontSizeStyleRule, Item.contentDocument);
        Item.FontSizeStyleRule = sML.CSS.appendRule("html", "font-size: " + FontSize + "px !important;", Item.contentDocument);
    };
    I.FontSizeChanger.changeItemFontSizeStep = function(Item, Step) {
        I.FontSizeChanger.changeItemFontSize(Item, Item.FontSize.Base * Math.pow(S["font-size-scale-per-step"], Step));
    };

    E.bind("bibi:postprocessed-item-content", function(Item) {
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
            I.FontSizeChanger.changeItemFontSizeStep(Item, I.FontSizeChanger.Step);
        } else if(I.FontSizeChanger.Step != 0) {
            I.FontSizeChanger.changeItemFontSizeStep(Item, I.FontSizeChanger.Step);
        }
    });

    I.FontSizeChanger.changeFontSizeStep = function() {
        const Button = this;
        const Step = Button.Step;
        if(Step == I.FontSizeChanger.Step) return;
        E.dispatch("bibi:changes-font-size");
        Button.ButtonGroup.Busy = true;
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
                        I.FontSizeChanger.changeItemFontSizeStep(Item, Step);
                    });
                },
                callback: function() {
                    E.dispatch("bibi:changed-font-size", { Step: Step });
                    Button.ButtonGroup.Busy = false;
                }
            });
        }, 88);
    };

    E.add("bibi:changes-font-size", function() { E.dispatch("bibi:closes-utilities"); });

  //E.add("bibi:changes-view", function() { I.FontSizeChanger.changeFontSizeStep(0); }); // unnecessary

    if(S["use-font-size-changer"]) I.createFontSizeChanger.createUI();
    E.dispatch("bibi:created-font-size-changer");

};


I.createFontSizeChanger.createUI = function() {

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
            action: I.FontSizeChanger.changeFontSizeStep, Step: 2
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Large',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>大'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-large"></span>',
            action: I.FontSizeChanger.changeFontSizeStep, Step: 1
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-medium"></span>',
            action: I.FontSizeChanger.changeFontSizeStep, Step: 0
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Small',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>小'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-small"></span>',
            action: I.FontSizeChanger.changeFontSizeStep, Step: -1
        }, {
            Type: "radio",
            Labels: {
                default: {
                    default: '<span class="non-visual-in-label">Font Size:</span> Ex-Small',
                    ja: '<span class="non-visual-in-label">文字サイズ：</span>最小'
                }
            },
            Icon: '<span class="bibi-icon bibi-icon-font-size bibi-icon-font-size-exsmall"></span>',
            action: I.FontSizeChanger.changeFontSizeStep, Step: -2
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
            if(!Tfm) return false;
            if(!Opt) Opt = {};
            clearTimeout(this.Timer_onTransformEnd);
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
            this.Timer_onTransformEnd = setTimeout(function() {
                     if(R.Main.Transformation.Scale == 1) O.HTML.classList.remove("zoomed-in"), O.HTML.classList.remove("zoomed-out");
                else if(R.Main.Transformation.Scale <  1) O.HTML.classList.remove("zoomed-in"), O.HTML.classList.add(   "zoomed-out");
                else                                      O.HTML.classList.add(   "zoomed-in"), O.HTML.classList.remove("zoomed-out");
                O.HTML.classList.remove("transforming");
                E.dispatch("bibi:transformed-book", Tfm);
                if(typeof Opt.callback == "function") Opt.callback(Tfm);
                if(!Opt.Temporary && S["use-loupe"] && S["use-cookie"]) O.Cookie.eat(O.BookURL, { Loupe: { Transformation: R.Main.Transformation } });
            }, 345);
            return true;
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

    E.bind("bibi:opened", function() {
        I.Loupe.open();
        if(S["use-loupe"] && S["use-cookie"]) try { I.Loupe.transform(O.Cookie.remember(O.BookURL).Loupe.Transformation); } catch(Err) {}
    });

    E.add("bibi:changes-view",  function() { I.Loupe.scale(1); });
    E.add("bibi:opened-slider", I.Loupe.lock);
    E.add("bibi:closed-slider", I.Loupe.unlock);

    if(S["use-loupe"]) I.createLoupe.createUI();
    E.dispatch("bibi:created-loupe");
};


I.createLoupe.createUI = function() {

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

    E.bind("bibi:opened",          function() { I.Loupe.updateButtonState(); });

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
                I.Slider.BookStretchingEach = 0;
                I.Slider.resetZoomingOutOfBook();
                I.Slider.resetBookMap();
                I.Slider.resetThumbAndRail();
                I.Slider.progress();
            },
            resetBookMap: function() {
                if(I.Slider.BookMap.Spreads) I.Slider.BookMap.Spreads.forEach(function(SliderSpread) { I.Slider.BookMap.removeChild(SliderSpread); });
                I.Slider.BookMap.Spreads = [];
                R.Spreads.forEach(function(Spread) {
                    const SliderSpread = I.Slider.BookMap.appendChild(sML.create("div", { className: "bibi-slider-bookmap-spread", id: "bibi-slider-bookmap-spread-" + (Spread.SpreadIndex + 1), Spread: Spread }));
                    I.Slider.BookMap.Spreads.push(SliderSpread);
                    SliderSpread.style[                                                       S.CC.A.SIZE.l] = (Spread["offset" + S.CC.L.SIZE.L]                 / R.Main["scroll" + S.CC.L.SIZE.L] * 100) + "%";
                    SliderSpread.style[(S.RVM == "paged" && S.SLD == "ttb") ? S.CC.A.BASE.b : S.CC.A.OOLT.l] = (O.getElementCoord(Spread, R.Main)[S.CC.L.AXIS.L] / R.Main["scroll" + S.CC.L.SIZE.L] * 100) + "%";
                    SliderSpread.Items = [];
                    Spread.Items.forEach(function(Item) {
                        const SliderItem = SliderSpread.appendChild(sML.create("div", { className: "bibi-slider-bookmap-item", id: "bibi-slider-bookmap-item-" + (Item.ItemIndex + 1), Item: Item }));
                        SliderSpread.Items.push(SliderItem);
                        if(Item.ItemRef["rendition:layout"] == "pre-paginated") {
                            SliderSpread.classList.add("pre-paginated");
                            SliderItem.classList.add("pre-paginated");
                            if(Item.ItemRef["page-spread"]) {
                                if(Item.ItemRef["page-spread"] != "center") SliderSpread.classList.add("divided-spread");
                                SliderItem.classList.add("page-spread-" + Item.ItemRef["page-spread"]);
                            }
                        }
                        SliderItem.Pages = [];
                        Item.Pages.forEach(function(Page) {
                            const SliderPage = SliderItem.appendChild(sML.create("div", { className: "bibi-slider-bookmap-page", id: "bibi-slider-bookmap-page-" + (Page.PageIndex + 1), Page: Page }));
                            SliderItem.Pages.push(SliderPage);
                            if(Item.ItemRef["rendition:layout"] == "pre-paginated") {
                                SliderPage.classList.add("pre-paginated");
                                if(Item.ItemRef["page-spread"]) {
                                    SliderPage.classList.add("page-spread-" + Item.ItemRef["page-spread"]);
                                }
                            } else {
                                SliderPage.style[S.CC.A.SIZE.l] = (1                    / Item.Pages.length * 100) + "%";
                                SliderPage.style[S.CC.A.BASE.b] = (Page.PageIndexInItem / Item.Pages.length * 100) + "%";
                            }
                            if(I.Nombre) {
                                SliderPage.addEventListener(O["pointerover"], function() {
                                    if(I.Slider.Touching) return;
                                    clearTimeout(I.Slider.Timer_SliderPagePointerOut);
                                    I.Nombre.progress({ Pages: { StartPage: Page, EndPage: Page } });
                                });
                                SliderPage.addEventListener(O["pointerout"], function() {
                                    if(I.Slider.Touching) return;
                                    I.Slider.Timer_SliderPagePointerOut = setTimeout(function() {
                                        clearTimeout(I.Nombre.Timer_hide);
                                        I.Nombre.hide();
                                    }, 200);
                                });
                            }
                            SliderPage.Labels = { default: { default: "P." + (Page.PageIndex + 1) } };
                            I.setFeedback(SliderPage);
                        });
                    });
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
            getTouchStartCoord: function(Eve) {
                return (Eve.target == I.Slider.Thumb) ?
                    O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L] : // ← Move Thumb naturally. // ↓ Bring Thumb's center to the touched coord at the next pointer moving.
                    O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb["offset" + S.CC.A.SIZE.L] / 2;
            },
            onTouchStart: function(Eve) {
                if(!Eve.target || !Eve.target.id || !/^bibi-slider(-|$)/.test(Eve.target.id)) return;
                Eve.preventDefault();
                R.Main.style.overflow = "hidden"; // ← ↓ to stop momentum scrolling
                setTimeout(function() { R.Main.style.overflow = ""; }, 1);
                I.Slider.Touching = true;
                I.Slider.TouchStartThumbCenterCoord = O.getElementCoord(I.Slider.Thumb)[S.CC.A.AXIS.L] + I.Slider.Thumb["offset" + S.CC.A.SIZE.L] / 2;
                I.Slider.TouchStartCoord = I.Slider.TouchEndCoord = I.Slider.getTouchStartCoord(Eve);
                clearTimeout(I.Slider.Timer_onTouchEnd);
                O.HTML.classList.add("slider-sliding");
                E.add("bibi:moved-pointer", I.Slider.onTouchMove);
            },
            onTouchMove: function(Eve) {
                I.Slider.flip(Eve);
            },
            onTouchEnd: function(Eve) {
                if(!I.Slider.Touching) return;
                I.Slider.Touching = false;
                E.remove("bibi:moved-pointer", I.Slider.onTouchMove);
                I.Slider.flip(Eve);
                I.Slider.Timer_onTouchEnd = setTimeout(function() { O.HTML.classList.remove("slider-sliding"); }, 125);
            },
            flip: function(Eve) {
                I.Slider.TouchEndCoord = O.getBibiEventCoord(Eve)[S.CC.A.AXIS.L];
                const TouchEndElementPoints = {};
                TouchEndElementPoints[S.CC.A.AXIS.L] = O.limitMinMax(I.Slider.TouchEndCoord, I.Slider.Rail.Coords[0], I.Slider.Rail.Coords[1]);
                TouchEndElementPoints[S.CC.A.AXIS.B] = O.getElementCoord(I.Slider)[S.CC.A.AXIS.L] + (I.Slider["offset" + S.CC.A.SIZE.B] - I.Slider.Rail["offset" + S.CC.A.SIZE.B]) / 4;
                const TouchEndElement = document.elementFromPoint(TouchEndElementPoints.X, TouchEndElementPoints.Y) || I.Slider;
                let TargetPage, NearestSliderPage, NearestSliderItem, NearestSliderSpread;
                if(TouchEndElement.classList.contains("bibi-slider-bookmap-page")) {
                    NearestSliderPage = TouchEndElement;
                } else {
                    if(TouchEndElement.classList.contains("bibi-slider-bookmap-item")) {
                        NearestSliderItem = TouchEndElement;
                    } else {
                        if(TouchEndElement.classList.contains("bibi-slider-bookmap-spread")) {
                            NearestSliderSpread = TouchEndElement;
                        } else {
                            NearestSliderSpread = I.Slider.getNearest(I.Slider.BookMap.Spreads);
                        }
                        NearestSliderItem = I.Slider.getNearest(NearestSliderSpread.Items);
                    }
                    NearestSliderPage = I.Slider.getNearest(NearestSliderItem.Pages);
                }
                TargetPage = NearestSliderPage.Page;
                if(TargetPage != R.Current.Pages.StartPage && TargetPage != R.Current.Pages.EndPage) {
                    E.dispatch("bibi:commands:focus-on", { Destination: TargetPage, Duration: 0 });
                }
                if(I.Slider.Touching) {
                    let Translation = I.Slider.TouchEndCoord - I.Slider.TouchStartCoord;
                    let TranslatedCenter = I.Slider.TouchStartThumbCenterCoord + Translation;
                         if(TranslatedCenter < I.Slider.Rail.Coords[0]) Translation = I.Slider.Rail.Coords[0] - I.Slider.TouchStartThumbCenterCoord;
                    else if(TranslatedCenter > I.Slider.Rail.Coords[1]) Translation = I.Slider.Rail.Coords[1] - I.Slider.TouchStartThumbCenterCoord;
                    sML.style(I.Slider.Thumb, { transform: "translate" + S.CC.A.AXIS.L + "(" + Translation + "px)" });
                } else {
                    sML.style(I.Slider.Thumb, { transform: "" });
                    I.Slider.progress();
                }
            },
            getNearest: function(Ones) {
                const TouchEndCoord = I.Slider.TouchEndCoord * S.CC.A.AXIS.PM;
                let PrevOne = null, PrevOneFootCoord = 0;
                for(let l = Ones.length, i = 0; i < l; i++) {
                    const One = Ones[i];
                    const OneCoord = O.getElementCoord(One)[S.CC.A.AXIS.L];
                    const OneFootCoord = (OneCoord + (S.ARD != "rtl" ? One["offset" + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    if(OneFootCoord < TouchEndCoord) {
                        PrevOne = One, PrevOneFootCoord = OneFootCoord;
                        continue;
                    }
                    const OneHeadCoord = (OneCoord + (S.ARD == "rtl" ? One["offset" + S.CC.A.SIZE.L] : 0)) * S.CC.A.AXIS.PM;
                    if(TouchEndCoord < OneHeadCoord && PrevOne && TouchEndCoord - PrevOneFootCoord < OneHeadCoord - TouchEndCoord) return PrevOne;
                    return One;
                }
                return Ones[Ones.length - 1];
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
                I.Slider.RailProgress.style[S.CC.A.SIZE.l] = Progress + "px";
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
            },
            zoomOutBook: function() {
                const BookMarginStart  = S.ARA == "horizontal" ? I.Menu.offsetHeight : 0;
                const BookMarginEnd    = 78;
                //const BookMarginBefore = S.ARA == "horizontal" ? 0 : I.Menu.offsetHeight;
                //const BookMarginAfter  = 0;
                const Transformation = {
                    Scale: 1 - (BookMarginStart + BookMarginEnd - O.Scrollbars[S.CC.A.SIZE.B]) / R.Main["offset" + S.CC.A.SIZE.B],
                    Translation: {}
                };
                Transformation.Translation[S.CC.A.AXIS.L] = 0;
                Transformation.Translation[S.CC.A.AXIS.B] = BookMarginStart - R.Main["offset" + S.CC.A.SIZE.B] * (1 - Transformation.Scale) / 2;
                I.Slider.BookStretchingEach = O.Body["offset" + S.CC.A.SIZE.L] * (1 / Transformation.Scale - 1) / 2;
                R.Main.style[S.CC.A.SIZE.l]  = (R.Main["offset" + S.CC.A.SIZE.L] + I.Slider.BookStretchingEach * 2) + "px";
                R.Main.style["padding" + S.CC.A.BASE.B] = R.Main.style["padding" + S.CC.A.BASE.A] = I.Slider.BookStretchingEach + "px";
                if(S.ARA == S.SLA) R.Main.Book.style["padding" + (S.ARA == "horizontal" ? "Right" : "Bottom")] = I.Slider.BookStretchingEach + "px";
                I.Loupe.transform(Transformation, {
                    Temporary: true,
                    callback: function() {
                        I.Slider.progress();
                    }
                });
            },
            resetZoomingOutOfBook: function() {
                I.Loupe.transformReset({
                    callback: function() {
                        R.Main.style[S.CC.A.SIZE.l] = R.Main.style["padding" + S.CC.A.BASE.B] = R.Main.style["padding" + S.CC.A.BASE.A] = "";
                        if(S.ARA == S.SLA) R.Main.Book.style["padding" + (S.ARA == "horizontal" ? "Right" : "Bottom")] = "";
                        I.Slider.BookStretchingEach = 0;
                        I.Slider.progress();
                    }
                });
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
            //I.Slider.reset();
            I.Slider.progress();
            O.HTML.classList.add("slider-opened");
            E.dispatch("bibi:opened-slider");
        },
        onclosed: function() {
            I.Slider.resetZoomingOutOfBook();
            //I.Slider.reset();
            I.Slider.progress();
            O.HTML.classList.remove("slider-opened");
            E.dispatch("bibi:closed-slider");
        }
    });
    E.add("bibi:commands:open-slider",   I.Slider.open);
    E.add("bibi:commands:close-slider",  I.Slider.close);
    E.add("bibi:commands:toggle-slider", I.Slider.toggle);

    E.add("bibi:opens-utilities",   function(Opt) { E.dispatch("bibi:commands:open-slider", Opt); });
    E.add("bibi:closes-utilities",  function(Opt) { E.dispatch("bibi:commands:close-slider", Opt); });
    E.add("bibi:toggles-utilities", function(Opt) { E.dispatch("bibi:commands:toggle-slider", Opt); });

    E.add("bibi:opened",       I.Slider.activate);
    E.add("bibi:laid-out",     I.Slider.reset);
  //E.add("bibi:tapped-shade", I.Slider.close);

    I.Slider.addEventListener("wheel", R.Main.onWheeled);

    // Optimize to Scrollbar Size
    sML.CSS.appendRule([
        "html.view-paged div#bibi-slider",
        "html.view-horizontal div#bibi-slider"
    ].join(", "), "height: " + (O.Scrollbars.Height) + "px;");
    sML.CSS.appendRule([
        "html.view-vertical div#bibi-slider"
    ].join(", "), "width: " + (O.Scrollbars.Width) + "px;");

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

    E.add("bibi:opened",           function()    { I.Turner.update(); });
    E.add("bibi:updated-settings", function()    { I.Turner.update(); });

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
            if(S.RVM == "vertical") {
                if(BibiEvent.Coord.X > window.innerWidth  - O.Scrollbars.Width)  return false;
            } else if(S.RVM == "horizontal") {
                if(BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
            } else {
                if(I.Slider && BibiEvent.Coord.Y > window.innerHeight - I.Slider.offsetHeight) return false;
            }
            if(BibiEvent.Target.ownerDocument.documentElement == O.HTML) {
                if(BibiEvent.Target == O.HTML || BibiEvent.Target == O.Body) return true;
                if(/^(bibi-main|bibi-arrow|bibi-help|bibi-poweredby)/.test(BibiEvent.Target.id)) return true;
                if(/^(spread|item)/.test(BibiEvent.Target.className)) return true;
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
        if(!O.Mobile) FunctionsToBeCanceled.push(Arrow.onBibiHover);
        FunctionsToBeCanceled.forEach(function(FunctionToBeCanceled) { FunctionToBeCanceled = function() { return false; }; });
    });

    if(!O.Mobile) {
        E.add("bibi:moved-pointer", function(Eve) { // try hovering
            if(!L.Opened) return false;
            if(I.isPointerStealth()) return false;
            const BibiEvent = O.getBibiEvent(Eve);
            if(I.Arrows.areAvailable(BibiEvent)) {
                const Dir = (S.RVM == "vertical") ? BibiEvent.Division.Y : BibiEvent.Division.X;
                if(I.Turner.isAbleToTurn({ Direction: Dir })) {
                    const Arrow = I.Turner[Dir].Arrow;
                    E.dispatch("bibi:hovers",   Eve, Arrow);
                    E.dispatch("bibi:unhovers", Eve, Arrow.Pair);
                    BibiEvent.Target.ownerDocument.documentElement.setAttribute("data-bibi-cursor", Dir);
                    return;
                }
            }
            E.dispatch("bibi:unhovers", Eve, I.Arrows.Back);
            E.dispatch("bibi:unhovers", Eve, I.Arrows.Forward);
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
            E.dispatch("bibi:taps",   Eve, Arrow);
            E.dispatch("bibi:tapped", Eve, Arrow);
            E.dispatch("bibi:commands:move-by", { Distance: I.Turner[Dir].Distance });
        }
    });

    E.add("bibi:commands:move-by", function(Par) { // indicate direction
        if(!L.Opened || !Par || typeof Par.Distance != "number") return false;
        switch(Par.Distance) {
            case -1: return E.dispatch("bibi:tapped", null, I.Arrows.Back);
            case  1: return E.dispatch("bibi:tapped", null, I.Arrows.Forward);
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
            if(!O.Mobile) {
                Ele.addEventListener('wheel', R.onWheel);
                O.forEach(Ele.querySelectorAll("img"), function(Img) { Img.addEventListener(O["pointerdown"], O.preventDefault); });
            }
        },
        deactivateElement: function(Ele) {
            Ele.removeEventListener("touchstart", I.SwipeListener.onTouchStart);
            Ele.removeEventListener("touchmove",  I.SwipeListener.onTouchMove);
            Ele.removeEventListener("touchend",   I.SwipeListener.onTouchEnd);
            if(!O.Mobile) {
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
                        E.dispatch("bibi:commands:move-by", { Distance: I.Turner[From].Distance });
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
                E.dispatch("bibi:commands:move-by", { Distance: Eve.BibiWheeled.Distance });
            }
        }
    };

    I.setToggleAction(I.SwipeListener, {
        onopened: function() {
            O.HTML.classList.add("swipe-active");
            if(!O.Mobile) E.add("bibi:wheeled", I.SwipeListener.onWheeled);
            I.SwipeListener.activateElement(R.Main);
            R.Items.forEach(function(Item) { I.SwipeListener.activateElement(Item.HTML); });
        },
        onclosed: function() {
            O.HTML.classList.remove("swipe-active");
            if(!O.Mobile) E.remove("bibi:wheeled", I.SwipeListener.onWheeled);
            I.SwipeListener.deactivateElement(R.Main);
            R.Items.forEach(function(Item) { I.SwipeListener.deactivateElement(Item.HTML); });
        }
    });

    E.add("bibi:laid-out:for-the-first-time", function() {
        I.SwipeListener.update();
        E.add("bibi:updated-settings", function() { I.SwipeListener.update(); });
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
        observe: function() {
            [O].concat(R.Items).forEach(function(Item) {
                ["keydown", "keyup", "keypress"].forEach(function(EventName) {
                    Item.contentDocument.addEventListener(EventName, I.KeyListener["on" + EventName], false);
                });
            });
        },
        tryMoving: function(Eve) {
            if(!Eve.BibiKeyName) return false;
            const MovingParameter = I.KeyListener.MovingParameters[!Eve.shiftKey ? Eve.BibiKeyName : Eve.BibiKeyName.toUpperCase()];
            if(!MovingParameter) return false;
            Eve.preventDefault();
                 if(typeof MovingParameter == "number") E.dispatch("bibi:commands:move-by",  { Distance:    MovingParameter });
            else if(typeof MovingParameter == "string") E.dispatch("bibi:commands:focus-on", { Destination: MovingParameter });
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

    E.add("bibi:updated-settings", function(   ) { I.KeyListener.updateMovingParameters(); });
    E.add("bibi:opened",           function(   ) { I.KeyListener.updateMovingParameters(); I.KeyListener.observe(); });

    E.add("bibi:touched-key",      function(Eve) { I.KeyListener.tryMoving(Eve); });

    E.dispatch("bibi:created-keylistener");

};


I.createSpinner = function() {

    I.Spinner = O.Body.appendChild(sML.create("div", { id: "bibi-spinner" }));
    for(let i = 1; i <= 12; i++) I.Spinner.appendChild(document.createElement("span"));
    E.dispatch("bibi:created-spinner");

};


I.setToggleAction = function(Ele, Par) {
    if(!Par) Par = {}; // { open: Function, close: Function }
    return sML.edit(Ele, {
        UIState: "default",
        open: function(Opt) {
            if(!Opt) Opt = {}; // { callback: Function, CallbackTime: Number }
            if(Ele.UIState == "default") {
                //Ele.Locked = true;
                I.setUIState(Ele, "active");
                if(Par.onopened) Par.onopened.apply(Ele, arguments);
            } else {
                Opt.CallbackTime = 0;
            }
            Ele.callback(Opt);
            return Ele.UIState;
        },
        close: function(Opt) {
            if(!Opt) Opt = {}; // { callback: Function, CallbackTime: Number }
            if(Ele.UIState == "active") {
                I.setUIState(Ele, "default");
                if(Par.onclosed) Par.onclosed.apply(Ele, arguments);
            } else {
                Opt.CallbackTime = 0;
            }
            Ele.callback(Opt);
            return Ele.UIState;
        },
        toggle: function(Opt) {
            return (Ele.UIState == "default" ? Ele.open(Opt) : Ele.close(Opt));
        },
        callback: function(Opt) {
            if(Opt && typeof Opt.callback == "function") setTimeout(function() { Opt.callback.call(Ele); }, (typeof Opt.CallbackTime == "number" ? Opt.CallbackTime : 250));
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
    Ele.onBibiHover = function(On, Eve) { E.dispatch(On ? "bibi:hovers" : "bibi:unhovers", Eve, Ele) };
    Ele.addEventListener(O["pointerover"], function(Eve) { this.onBibiHover.call(this, 1, Eve); });
    Ele.addEventListener(O["pointerout"],  function(Eve) { this.onBibiHover.call(this, 0, Eve); });
    return Ele;
};


I.setHoverActions = function(Ele) {
    E.add("bibi:hovers", function(Eve) {
        if(Ele.Hover) return Ele;
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        Ele.Hover = true;
        Ele.classList.add("hover");
        if(Ele.showHelp) Ele.showHelp();
        return Ele;
    }, Ele);
    E.add("bibi:unhovers", function(Eve) {
        if(!Ele.Hover) return Ele;
        Ele.Hover = false;
        Ele.classList.remove("hover");
        if(Ele.hideHelp) Ele.hideHelp();
        return Ele;
    }, Ele);
    return Ele;
};



I.observeTap = function(Ele, Opt) {
    if(!Opt) Opt = {};
    if(!Ele.addTapEventListener) {
        Ele.addTapEventListener = function(EN, Fun) {
            if(EN == "tap") EN = "taps";
            E.add("bibi:" + EN, function(Eve) {
                return Fun.call(Ele, Eve);
            }, Ele);
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
                            E.dispatch("bibi:taps",   Ele.TouchStart.Event, Ele);
                            E.dispatch("bibi:tapped", Ele.TouchStart.Event, Ele);
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
    if(!O.Mobile) I.observeHover(Ele);
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

    const applyToU = function(DataString) {
        if(typeof DataString != "string") return {};
        DataString.replace(" ", "").split(",").forEach(function(PnV) {
            PnV = PnV.split(":"); if(!PnV[0]) return;
            switch(PnV[0]) {
                case "parent-title":
                case "parent-uri":
                case "parent-origin":
                case "parent-pipi-path":
                case "parent-bibi-label":
                case "parent-holder-id":
                    PnV[1] = U.decode(PnV[1]); if(!PnV[1]) PnV[1] = ""; 
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
    };

    if(H["bibi"]) {
        applyToU(H["bibi"]);
    }

    if(H["pipi"]) {
        applyToU(H["pipi"]);
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


U.decode = function(Str) {
    return decodeURIComponent(Str.replace("_BibiKakkoClose_", ")").replace("_BibiKakkoOpen_", "("));
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
        S[Property] = (typeof S[Property] == "string") ? (S[Property] == "yes" || (S[Property] == "mobile" && O.Mobile) || (S[Property] == "desktop" && !O.Mobile)) : false;
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
    S.CC = { L: S.getCC(S.SLA, S.PPD), A: S.getCC(S.ARA, S.PPD) };             

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


O.log = function(Msg, Tag) {
    if(sML.UA.Gecko && typeof Msg == "string") Msg = Msg.replace(/(https?:\/\/)/g, "");
    let Pre = 'BiB/i: ';
    switch(Tag) {
        case "-x" : break;
        case  "*:": Tag  =       (O.log.Depth    ) + ":";        break;
        case "/*" : Tag  = "/" + (O.log.Depth - 1)      ;        break;
        default   : Tag  = "-" + (O.log.Depth    )      ;        break;
    }
    switch(Tag) {
        case "-x" : Pre += "[ERROR] "; console.info(Pre + Msg); return;
        case "-0" : Pre += "━━ ";    console.info(Pre + Msg); return;
        case "-1" : Pre += " - ";              O.log.Depth = 1;  break;
        case  "1:": Pre += "┌ ";              O.log.Depth = 2;  break;
        case "-2" : Pre += "│ - ";            O.log.Depth = 2;  break;
        case  "2:": Pre += "│┌ ";            O.log.Depth = 3;  break;
        case "-3" : Pre += "││ - ";          O.log.Depth = 3;  break;
        case  "3:": Pre += "││┌ ";          O.log.Depth = 4;  break;
        case "-4" : Pre += "│││ - ";        O.log.Depth = 4;  break;
        case  "4:": Pre += "│││┌ ";        O.log.Depth = 5;  break;
        case "-5" : Pre += "││││ - ";      O.log.Depth = 5;  break;
        case  "5:": Pre += "││││┌ ";      O.log.Depth = 6;  break;
        case "-6" : Pre += "│││││ - ";    O.log.Depth = 6;  break;
        case "/5" : Pre += "││││└ ";      O.log.Depth = 5;  break;
        case "/4" : Pre += "│││└ ";        O.log.Depth = 4;  break;
        case "/3" : Pre += "││└ ";          O.log.Depth = 3;  break;
        case "/2" : Pre += "│└ ";            O.log.Depth = 2;  break;
        case "/1" : Pre += "└ ";              O.log.Depth = 1;  break;
    }
    console.log(Pre + Msg);
};
/*O.log = function(Msg, Tag) {
    let Pre = 'BiB/i: ';
    switch(Tag) {
        case "-*" : Tag  = "-" + (O.log.Depth    )      ; break;
        case  "*:": Tag  =       (O.log.Depth    ) + ":"; break;
        case "/*" : Tag  = "/" + (O.log.Depth - 1)      ; break;
    }
    switch(Tag) {
        case "-x" : Pre += "[ERROR] "; console.error(Pre + Msg);                     break;
        case "-0" : Pre += "━━ ";    console.info( Pre + Msg);                     break;
        case "-1" : O.log.Depth = 1;   console.log(  Pre + Msg);                     break;
        case  "1:": O.log.Depth = 2;   console.group(Pre + Msg);                     break;
        case "-2" : O.log.Depth = 2;   console.log(  Pre + Msg);                     break;
        case  "2:": O.log.Depth = 3;   console.group(Pre + Msg);                     break;
        case "-3" : O.log.Depth = 3;   console.log(  Pre + Msg);                     break;
        case  "3:": O.log.Depth = 4;   console.group(Pre + Msg);                     break;
        case "-4" : O.log.Depth = 4;   console.log(  Pre + Msg);                     break;
        case  "4:": O.log.Depth = 5;   console.group(Pre + Msg);                     break;
        case "-5" : O.log.Depth = 5;   console.log(  Pre + Msg);                     break;
        case  "5:": O.log.Depth = 6;   console.group(Pre + Msg);                     break;
        case "-6" : O.log.Depth = 6;   console.log(  Pre + Msg);                     break;
        case "/5" : O.log.Depth = 5;   console.log(  Pre + Msg); console.groupEnd(); break;
        case "/4" : O.log.Depth = 4;   console.log(  Pre + Msg); console.groupEnd(); break;
        case "/3" : O.log.Depth = 3;   console.log(  Pre + Msg); console.groupEnd(); break;
        case "/2" : O.log.Depth = 2;   console.log(  Pre + Msg); console.groupEnd(); break;
        case "/1" : O.log.Depth = 1;   console.log(  Pre + Msg); console.groupEnd(); break;
    }
};*/
O.log.Depth = 1;
if(parent && parent != window) O.log = function() { return false; };


O.error = function(Msg) {
    O.Busy = false;
    O.HTML.classList.remove("busy");
    O.HTML.classList.remove("loading");
    O.HTML.classList.remove("waiting");
    E.dispatch("bibi:x_x", Msg);
    O.log(Msg, "-x");
};


O.forEach = function(Col, fun) { return Col.forEach ? Col.forEach(fun) : Array.prototype.forEach.call(Col, fun); };


O.applyRtL = function(Left, Right, ExceptFunctions) {
    if(ExceptFunctions) for(let Property in Right) if(typeof Left[Property] != "function" && typeof Right[Property] != "function") Left[Property] = Right[Property];
    else                for(let Property in Right)                                                                                 Left[Property] = Right[Property];
    return Left;
};

O.limitMin    = function(Num, Min     ) { return                      (Num < Min) ? Min :                     Num; };
O.limitMax    = function(Num,      Max) { return                                          (Max < Num) ? Max : Num; };
O.limitMinMax = function(Num, Min, Max) { return (Max < Min) ? null : (Num < Min) ? Min : (Max < Num) ? Max : Num; };


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
    if(B.Unzipped) {
        return O.download(B.Path + "/" +  Path).then(function(XHR) {
            return O.parseDocument(XHR.responseText, Path);
        }).catch(function(XHR) {
            O.error('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"');
        });
    } else {
        return Promise.resolve().then(function() {
            return O.parseDocument(B.Files[Path], Path);
        });
    }
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
    if(!StyleSheet.cssRules) return;
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

O.isAnchorContent = function(Ele) {
    while(Ele) {
        if(/^a$/i.test(Ele.tagName)) return true;
        Ele = Ele.parentElement;
    }
    return false;
};

O.stamp = function(What, TimeCard) {
    if(!TimeCard) TimeCard = O.TimeCard;
    const HMS = O.TimeCard.getHMS(O.TimeCard.getElapsed());
    if(TimeCard[HMS]) What = TimeCard[HMS] + " -&- " + What;
    TimeCard[HMS] = What;
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
        const Item = Eve.target.ownerDocument.documentElement.Item;
        const FrameCoord = O.getElementCoord(R.Main);
        const ItemCoordInFrame = O.getElementCoord(Item, R.Main);
        if(!Item.PrePaginated && !Item.Outsourcing) ItemCoordInFrame.X += S["item-padding-left"], ItemCoordInFrame.Y += S["item-padding-top"];
        EventCoord.X = (FrameCoord.X + R.Main.offsetWidth  / 2 + R.Main.Transformation.Translation.X) + (((ItemCoordInFrame.X - R.Main.scrollLeft + EventCoord.X) - (R.Main.offsetWidth  / 2)) * R.Main.Transformation.Scale);
        EventCoord.Y = (FrameCoord.Y + R.Main.offsetHeight / 2 + R.Main.Transformation.Translation.Y) + (((ItemCoordInFrame.Y - R.Main.scrollTop  + EventCoord.Y) - (R.Main.offsetHeight / 2)) * R.Main.Transformation.Scale);
        //             (translated transform-origin                                                 ) + (((event-coord in frame                                 ) - (frame transform-origin )) * scale                      )
        //             (translated transform-origin                                                 ) + ((event-coord in frame from frame transform-origin                                   ) * scale                      )
        //             (translated transform-origin                                                 ) + (event-coord from translated transform-origin                                                                       )
    }
    return EventCoord;
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

O.TimeCard = {
    Origin: Date.now(),
    getElapsed: function(Time) {
        return ((Time ? Time : Date.now()) - O.TimeCard.Origin);
    },
    getHMS: function(Milliseconds) {
        return [
            Milliseconds / 1000 / 60 / 60,
            Milliseconds / 1000 / 60 % 60,
            Milliseconds / 1000 % 60
        ].map(function(Val) {
            return sML.String.pad(Math.floor(Val), 0, 2);
        }).join(":");
    }
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
        "autostart",
        "autostart-embedded",
        "fix-reader-view-mode",
        "start-embedded-in-new-window",
        "place-menubar-at-top",
        "single-page-always",
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
        "loupe-max-scale"
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
        "preprocess-html-always",
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



E.add = function(Name, Listener, Ele) {
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
    if(!Listener.bibiEventListener) Listener.bibiEventListener = function(Eve) { return Listener.call(document, Eve.detail); };
    (Ele ? Ele : document).addEventListener(Name, Listener.bibiEventListener, false);
    return Listener;
};


E.remove = function(Name, Listener, Ele) {
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function" || typeof Listener.bibiEventListener != "function") return false;
    (Ele ? Ele : document).removeEventListener(Name, Listener.bibiEventListener);
    return Listener;
};


E.bind = function(Name, Listener, Ele) {
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
    Ele = (Ele ? Ele : document);
    if(!Ele.BibiBindedEventListeners) Ele.BibiBindedEventListeners = {};
    if(!(Ele.BibiBindedEventListeners[Name] instanceof Array)) Ele.BibiBindedEventListeners[Name] = [];
    Ele.BibiBindedEventListeners[Name] = Ele.BibiBindedEventListeners[Name].filter(function(Binded) {
        if(Binded != Listener) return true;
        return false;
    });
    Ele.BibiBindedEventListeners[Name].push(Listener);
    return Ele.BibiBindedEventListeners[Name].length - 1;
};


E.unbind = function(Name, Listener, Ele) {
    if(typeof Name != "string") return false;
    Ele = (Ele ? Ele : document);
    if(!Ele.BibiBindedEventListeners || !(Ele.BibiBindedEventListeners[Name] instanceof Array)) return false;
    if(typeof Listener == "undefined") {
        delete Ele.BibiBindedEventListeners[Name];
        return 0;
    }
    if(typeof Listener == "number") {
        if(typeof Ele.BibiBindedEventListeners[Name][Listener] != "function") return false;
        Listener = Ele.BibiBindedEventListeners[Name][Listener];
    }
    Ele.BibiBindedEventListeners[Name] = Ele.BibiBindedEventListeners[Name].filter(function(Binded) {
        if(Binded != Listener) return true;
        return false;
    });
    return Ele.BibiBindedEventListeners[Name].length;
};


E.dispatch = function(Name, Detail, Ele) {
    // console.log('//////// ' + Name);
    if(typeof Name != "string") return false;
    Ele = (Ele ? Ele : document);
    if(Ele.BibiBindedEventListeners && Ele.BibiBindedEventListeners[Name] instanceof Array) {
        Ele.BibiBindedEventListeners[Name].forEach(function(bindedEventListener) {
            if(typeof bindedEventListener == "function") bindedEventListener.call(Ele, Detail);
        });
    }
    return Ele.dispatchEvent(new CustomEvent(Name, { detail: Detail }));
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
    return new Promise(function(resolve, reject) {
        if(!PXs.length) return resolve();
        O.log('Loading Extension File' + (PXs.length > 1 ? 's' : '') + '...', "*:");
        const loadFile = function(FileInfo) {
            if(X.Files[FileInfo["name"]]) {
                O.log('"name" of Extension File "' + FileInfo["name"] + '" is already taken.', "-*");
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
                        if(FileInfo.FileIndexInPreset + 1 == PXs.length) {
                            /*
                            if(X.Loaded.length) {
                                let LoadedExtensionFiles = "";
                                X.Loaded.forEach(function(LoadedExtension) { LoadedExtensionFiles += ", " + LoadedExtension["name"]; });
                                LoadedExtensionFiles = LoadedExtensionFiles.replace(/^, /, "");
                                O.log('Extension File' + (X.Loaded.length > 1 ? 's' : '') + ': ' + LoadedExtensionFiles, "-*");
                            }
                            */
                            if(X.Added.length) {
                                let AddedExtensions = "";
                                X.Added.forEach(function(AddedExtension) { AddedExtensions += ", " + AddedExtension["name"]; });
                                AddedExtensions = AddedExtensions.replace(/^, /, "");
                                O.log('Extension' + (X.Added.length > 1 ? 's' : '') + ': ' + AddedExtensions, "-*");
                            }
                            O.log('Extension File' + (X.Loaded.length > 1 ? 's' : '') + ' Loaded.', "/*");
                            return resolve();
                        }
                        loadFile(PXs[FileInfo.FileIndexInPreset + 1]);
                    }
                })
            );
        };
        loadFile(PXs[0]);
    });
};

X.add = function(Extension) {
    if(!Extension || typeof Extension != "object") {
        return function() { return false };
    }
    if(typeof Extension["name"] != "string" || !Extension["name"]) {
        O.log('Extension name is invalid.', "-*");
        return function() { return false };
    }
    if(X[Extension["name"]]) {
        O.log('Extension name "' + Extension["name"] + '" is reserved or already taken.', "-*");
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