/*!
 *                                                                                                                                (℠)
 *  ## BiB/i (heart)
 *  - "Heart of BiB/i"
 *
 */

Bibi = { "version": "0.000.0", "build": 198106091234 };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() { setTimeout(Bibi.welcome, 0); });

Bibi.SiteHref = "http://bibi.epub.link";
Bibi.WelcomeMessage = 'Welcome! - BiB/i v' + Bibi["version"] + ' (' + Bibi["build"] + ') - [ja] ' + Bibi.SiteHref + ' - [en] https://github.com/satorumurmur/bibi';


Bibi.welcome = function() {

    O.stamp("Welcome!");
    O.log(Bibi.WelcomeMessage, "-0");
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
        O.HTML.className = O.HTML.className + " Touch";
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
        var Msg = {
            en: '<span>I\'m so Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible with BiB/i.</span>',
            ja: '<span>ごめんなさい……</span> <span>お使いのブラウザでは、</span><span>ビビは動きません。</span>'
        };
        I.Veil.ByeBye = I.Veil.appendChild(
            sML.create("p", { id: "bibi-veil-byebye",
                innerHTML: [
                    '<span lang="en">', Msg["en"], '</span>',
                    '<span lang="ja">', Msg["ja"], '</span>',
                ].join("").replace(/(BiB\/i|ビビ)/g, '<a href="' + Bibi.SiteHref + '" target="_blank">$1</a>')
            })
        );
        I.note('(Your Browser Is Not Compatible)', 99999999999);
        O.log(Msg["en"].replace(/<[^>]*>/g, ""), "-*");
        E.dispatch("bibi:says-byebye");
        sML.removeClass(O.HTML, "welcome");
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

    var PromiseForLoadingExtensions = new Promise(function(resolve, reject) {
        return (P.X.length) ? X.loadFilesInPreset().then(resolve) : resolve();
    });

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
        var HTMLCS = getComputedStyle(O.HTML);
        if(/^(vertical|horizontal)-/.test(HTMLCS["-webkit-writing-mode"])) return "-webkit-writing-mode";
        if(/^(vertical|horizontal)-/.test(HTMLCS["writing-mode"]) || sML.UA.InternetExplorer) return "writing-mode";
        else return undefined;
    })();
    var SRI4VTC = sML.appendStyleRule("div#bibi-vtc", "position: absolute; left: -100px; top: -100px; width: 100px; height: 100px; -webkit-writing-mode: vertical-rl; -ms-writing-mode: tb-rl; writing-mode: vertical-rl;");
    var VTC = document.body.appendChild(sML.create("div", { id: "bibi-vtc" })); // VerticalTextChecker
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
    delete VTC;
    sML.deleteStyleRule(SRI4VTC);

    // Scrollbars
    O.Scrollbars = {
        Width: window.innerWidth - O.HTML.offsetWidth,
        Height: window.innerHeight - O.HTML.offsetHeight
    };

    // Settings
    S.initialize();

    sML.removeClass(O.HTML, "welcome");

    // Ready ?
    PromiseForLoadingExtensions.then(function() {
        E.add("bibi:commands:move-by",     function(Par) { R.moveBy(Par); });
        E.add("bibi:commands:scroll-by",   function(Par) { R.scrollBy(Par); });
        E.add("bibi:commands:focus-on",    function(Par) { R.focusOn(Par); });
        E.add("bibi:commands:change-view", function(RVM) { R.changeView(RVM); });
        window.addEventListener("message", M.gate, false);
        Bibi.ready();
    });

};


Bibi.ready = function() {

    sML.addClass(O.HTML, "ready");

    E.add("bibi:readied", function() {
        if(U["book"]) {
            sML.removeClass(O.HTML, "ready");
            L.loadBook({ Path: (/^([\w\d]+:)?\/\//.test(U["book"]) ? "" : P["bookshelf"] + "/") + U["book"] });
        } else {
            if(X.Unzipper && window.File && !O.Mobile) {
                I.Veil.Catcher.dropOrClick();
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


B = {}; // Bibi.Book


B.initialize = function() {
    O.applyTo(B, {
        Title: "",
        Creator: "",
        Publisher: "",
        Language: "",
        WritingMode: "",
        Unzipped: false,
        Path: "",
        PathDelimiter: "",
        Mimetype:  { Path: "mimetype" },
        Container: { Path: "META-INF/container.xml" },
        Package:   { Path: "", Dir: "",
            Metadata: { "identifier": "", "title": "", "creators": [], "publishers": [], "languages": [] },
            Manifest: { "items": {}, "nav": {}, "toc-ncx": {}, "cover-image": {}, Files: {} },
            Spine:    { "itemrefs": [] }
        },
        Files: {},
        FileDigit: 0
    });
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


L = {}; // Bibi.Loader


L.wait = function() {
    return new Promise(function(resolve) {
        L.wait.resolve = function() { resolve(); delete L.wait.resolve; };
        O.Busy = false;
        sML.removeClass(O.HTML, "busy");
        sML.addClass(O.HTML, "waiting");
        E.dispatch("bibi:waits");
        O.log('(waiting)', '-*');
        I.note('');
    }).then(function() {
        O.Busy = true;
        sML.addClass(O.HTML, "busy");
        sML.removeClass(O.HTML, "waiting");
        I.note('Loading...');
    });
};


L.play = function() {
    if(S["start-in-new-window"]) return window.open(location.href);
    L.Played = true;
    L.wait.resolve();
    E.dispatch("bibi:played");
};


L.loadBook = function(PathOrData) {
    B.initialize();
    R.reset();
    L.Preprocessed = false;
    L.Loaded = false;
    O.Busy = true;
    sML.addClass(O.HTML, "busy");
    sML.addClass(O.HTML, "loading");
    I.note('Loading...');
    O.log("Initializing Book...", "*:");
    return new Promise(function(resolve, reject) {
        L.loadBook.resolve = function() { resolve.apply(L.loadBook, arguments); delete L.loadBook.resolve; delete L.loadBook.reject; };
        L.loadBook.reject  = function() {  reject.apply(L.loadBook, arguments); delete L.loadBook.resolve; delete L.loadBook.reject; I.Veil.Cover.className = ""; };
        if(PathOrData.Path) {
            // Online
            if(!P["trustworthy-origins"].includes(PathOrData.Path.replace(/^([\w\d]+:\/\/[^\/]+).*$/, "$1"))) return L.loadBook.reject('The Origin of the Path of the Book Is Not Allowed.');
            B.Path = PathOrData.Path;
            O.download(B.Path + "/mimetype").then(function() {
                // Online && Unzipped
                B.Unzipped = true;
                O.log('EPUB: ' + B.Path + ' (Unzipped Online Folder)', "-*");
                L.loadBook.resolve();
            }).catch(function() {
                // Online && Zipped (probably)
                if(!X.Unzipper) return L.loadBook.reject('Unzipper Extension Is Required to Open a Zipped EPUB.');
                X.Unzipper.loadBookData({ Path: B.Path });
            });
        } else if(PathOrData.Data) {
            // Local (only from the form or the catcher generated by X.Unzipper)
            if(!PathOrData.Data.size || typeof PathOrData.Data.name != "string"/* || !/\.epub$/i.test(PathOrData.Data.name)*/) return L.loadBook.reject('EPUB File Is Not Valid.');
            B.Path = "[Local] " + PathOrData.Data.name;
            X.Unzipper.loadBookData({ Data: PathOrData.Data });
        } else {
            L.loadBook.reject('Something Troubled...');
        }
    }).then(function() {
        B.PathDelimiter = B.Unzipped ? "/" : " > ";
        O.log("Book Initialized.", "/*");
        L.loadContainer();
    }).catch(function(ErrorMessage) {
        I.note(ErrorMessage, 99999999999, "ErrorOccured");
        O.error(ErrorMessage);
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
    var Metadata = Doc.getElementsByTagName("metadata")[0];
    var Manifest = Doc.getElementsByTagName("manifest")[0];
    var Spine    = Doc.getElementsByTagName("spine")[0];
    var ManifestItems = Manifest.getElementsByTagName("item");
    var SpineItemrefs = Spine.getElementsByTagName("itemref");
    if(ManifestItems.length <= 0) return O.error('"' + B.Package.Path + '" has no <item> in <manifest>.');
    if(SpineItemrefs.length <= 0) return O.error('"' + B.Package.Path + '" has no <itemref> in <spine>.');

    // METADATA
    var XMLNS = { "dc": Metadata.getAttribute("xmlns:dc") };
    sML.each(Metadata.getElementsByTagName("meta"), function() {
        if(this.getAttribute("refines")) return;
        if(this.getAttribute("property")) {
            // DCTerms
            var Property = this.getAttribute("property").replace(/^dcterms:/, "");
                 if(/^(identifier|title)$/.test(Property)) B.Package.Metadata[Property] = this.textContent;
            else if(/^(creator|publisher|language)$/.test(Property)) B.Package.Metadata[Property + "s"].push(this.textContent);
            else if(!B.Package.Metadata[Property]) B.Package.Metadata[Property] = this.textContent;
        }
        if(this.getAttribute("name") && this.getAttribute("content")) {
            // Others
            B.Package.Metadata[this.getAttribute("name")] = this.getAttribute("content");
        }
    });
    if(!B.Package.Metadata["identifier"]) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "identifier"), function() { B.Package.Metadata["identifier"] = this.textContent; return false; });
    if(!B.Package.Metadata["identifier"]) B.Package.Metadata["identifier"] = Date.now();
    if(!B.Package.Metadata["title"     ]) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "title"     ), function() { B.Package.Metadata["title"     ] = this.textContent; return false; });
    if(!B.Package.Metadata["creators"  ].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "creator"),   function() { B.Package.Metadata["creators"  ].push(this.textContent); });
    if(!B.Package.Metadata["publishers"].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "publisher"), function() { B.Package.Metadata["publishers"].push(this.textContent); });
    if(!B.Package.Metadata["languages" ].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "language"),  function() { B.Package.Metadata["languages" ].push(this.textContent); });
    if(!B.Package.Metadata["languages" ].length) B.Package.Metadata["languages"][0] = "en";
    if(!B.Package.Metadata["cover"])                           B.Package.Metadata["cover"]                 = "";
    if(!B.Package.Metadata["rendition:layout"])                B.Package.Metadata["rendition:layout"]      = "reflowable";
    if(!B.Package.Metadata["rendition:orientation"])           B.Package.Metadata["rendition:orientation"] = "auto";
    if(!B.Package.Metadata["rendition:spread"])                B.Package.Metadata["rendition:spread"]      = "auto";
    if( B.Package.Metadata["rendition:orientation"] == "auto") B.Package.Metadata["rendition:orientation"] = "portrait";
    if( B.Package.Metadata["rendition:spread"]      == "auto") B.Package.Metadata["rendition:spread"]      = "landscape";

    delete Doc;

    // MANIFEST
    var TOCID = Spine.getAttribute("toc");
    sML.each(ManifestItems, function() {
        var ManifestItem = {
            "id"         : this.getAttribute("id")         || "",
            "href"       : this.getAttribute("href")       || "",
            "media-type" : this.getAttribute("media-type") || "",
            "properties" : this.getAttribute("properties") || "",
            "fallback"   : this.getAttribute("fallback")   || ""
        };
        if(ManifestItem["id"] && ManifestItem["href"]) {
            B.Package.Manifest["items"][ManifestItem["id"]] = ManifestItem;
            ManifestItem.Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
            B.Package.Manifest.Files[ManifestItem.Path] = "";
            (function(ManifestItemProperties) {
                if(        / nav /.test(ManifestItemProperties)) B.Package.Manifest["nav"        ].Path = ManifestItem.Path;
                if(/ cover-image /.test(ManifestItemProperties)) B.Package.Manifest["cover-image"].Path = ManifestItem.Path;
            })(" " + ManifestItem.properties + " ");
            if(TOCID && ManifestItem["id"] == TOCID) B.Package.Manifest["toc-ncx"].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
        }
    });

    // SPINE
    B.Package.Spine["page-progression-direction"] = Spine.getAttribute("page-progression-direction");
    if(!B.Package.Spine["page-progression-direction"] || !/^(ltr|rtl)$/.test(B.Package.Spine["page-progression-direction"])) B.Package.Spine["page-progression-direction"] = "ltr";//"default";
    B.PPD = B.Package.Spine["page-progression-direction"];
    var PropertyREs = [
        /(page-spread)-(.+)/,
        /(rendition:layout)-(.+)/,
        /(rendition:orientation)-(.+)/,
        /(rendition:spread)-(.+)/,
        /(rendition:page-spread)-(.+)/,
        /(bibi:[a-z]+)-(.+)/
    ];
    sML.each(SpineItemrefs, function(i) {
        var SpineItemref = {
            "idref"                 : this.getAttribute("idref")      || "",
            "linear"                : this.getAttribute("linear")     || "",
            "properties"            : this.getAttribute("properties") || "",
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
        var BookIDFragments = [B.Title];
        if(B.Creator)   BookIDFragments.push(B.Creator);
        if(B.Publisher) BookIDFragments.push(B.Publisher);
        BookIDFragments = BookIDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">");
        O.Title.innerHTML = "";
        O.Title.appendChild(document.createTextNode(BookIDFragments + " | " + (S["website-name-in-title"] ? S["website-name-in-title"] : "BiB/i")));
    }

    var IDLogs = [];
    if(B.Title)     IDLogs.push(B.Title);
    if(B.Creator)   IDLogs.push(B.Creator);
    if(B.Publisher) IDLogs.push(B.Publisher);
    IDLogs.push('Language: "'  + B.Language + '"');
    O.log(IDLogs.join(' / '), "-*");

    var MetaLogs = [];
    MetaLogs.push('rendition:layout: "' + B.Package.Metadata["rendition:layout"] + '"');
    MetaLogs.push('rendition:orientation: "' + B.Package.Metadata["rendition:orientation"] + '"');
    MetaLogs.push('rendition:spread: "' + B.Package.Metadata["rendition:spread"] + '"');
    MetaLogs.push('page-progression-direction: "' + B.Package.Spine["page-progression-direction"] + '"');
    O.log(MetaLogs.join(' / '), "-*");

    if(S["use-cookie"]) {
        var BibiCookie = O.Cookie.remember(O.RootPath);
        var BookCookie = O.Cookie.remember(B.ID);
        if(BibiCookie) {
            if(!U["reader-view-mode"] && BibiCookie.RVM) S["reader-view-mode"] = BibiCookie.RVM;
        }
        if(BookCookie) {
            if(!U["to"] && BookCookie.Position) S["to"] = BookCookie.Position;
        }
    }

    S.update();

};


L.onLoadPackageDocument = function() {
    E.dispatch("bibi:loaded-package-document");
    O.log('Package Document Loaded.', "/*");
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
        var BookID = [];
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
                var Img = this;
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
    }

    O.log('Cover Created.', "/*");
    E.dispatch("bibi:created-cover", R.CoverImage.Path);

};


L.prepareSpine = function(ItemMaker) {

    O.log('Preparing Spine...', "*:");

    // For Spread Pairing of Pre-Paginated
    if(B.PPD == "rtl") var SpreadPairBefore = "right", SpreadPairAfter = "left";
    else               var SpreadPairBefore = "left",  SpreadPairAfter = "right";

    B.FileDigit = (B.Package.Spine["itemrefs"].length + "").length;
    if(B.FileDigit < 3) B.FileDigit = 3;

    if(typeof ItemMaker != "function") ItemMaker = function() {
        return sML.create("iframe", {
            scrolling: "no",
            allowtransparency: "true"
        });
    };

    // Spreads, Boxes, and Items
    sML.each(B.Package.Spine["itemrefs"], function() {
        var ItemRef = this, ItemIndex = R.Items.length;
        // Item: A
        var Item = ItemMaker(this);
        sML.addClass(Item, "item");
        Item.ItemRef = ItemRef;
        Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
        Item.Dir = Item.Path.replace(/\/?[^\/]+$/, "");
        R.AllItems.push(Item);
        if(ItemRef["linear"] != "yes") return R.NonLinearItems.push(Item);
        R.Items.push(Item);
        // SpreadBox & Spread
        var SpreadBox, Spread;
        if(ItemRef["page-spread"] == "center") {
            Item.IsSpreadCenter = true;
        } else if(ItemRef["page-spread"] == SpreadPairBefore) {
            Item.IsSpreadPairBefore = true;
        } else if(ItemRef["page-spread"] == SpreadPairAfter && ItemIndex > 0) {
            Item.IsSpreadPairAfter = true;
            var PreviousItem = R.Items[ItemIndex - 1];
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
        var ItemBox = Spread.appendChild(sML.create("div", { className: "item-box" }));
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
            sML.addClass(Ele, ItemRef["rendition:layout"]);
        });
        [ItemBox, Item].forEach(function(Ele) {
            if(ItemRef["page-spread"]) {
                sML.addClass(Ele, "page-spread-" + ItemRef["page-spread"]);
            }
            if(ItemRef["bibi:layout"]) {
                sML.addClass(Ele, "layout-" + ItemRef["bibi:layout"]);
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
            var NavContent = document.createDocumentFragment();
            if(I.Panel.BookInfo.Navigation.Type == "Navigation Document") {
                sML.each(Doc.querySelectorAll("nav"), function() {
                    switch(this.getAttribute("epub:type")) {
                        case "toc":       sML.addClass(this, "bibi-nav-toc"); break;
                        case "landmarks": sML.addClass(this, "bibi-nav-landmarks"); break;
                        case "page-list": sML.addClass(this, "bibi-nav-page-list"); break;
                    }
                    sML.each(this.querySelectorAll("*"), function() { this.removeAttribute("style"); });
                    NavContent.appendChild(this);
                });
            } else {
                var NavUL = (function(Ele) {
                    var ChildNodes = Ele.childNodes;
                    var UL = undefined;
                    for(var l = ChildNodes.length, i = 0; i < l; i++) {
                        if(ChildNodes[i].nodeType == 1 && /^navPoint$/i.test(ChildNodes[i].tagName)) {
                            var NavPoint = ChildNodes[i];
                            var NavLabel = NavPoint.getElementsByTagName("navLabel")[0];
                            var Content = NavPoint.getElementsByTagName("content")[0];
                            var Text = NavPoint.getElementsByTagName("text")[0];
                            if(!UL) UL = document.createElement("ul");
                            var LI = sML.create("li", { id: NavPoint.getAttribute("id") }); LI.setAttribute("playorder", NavPoint.getAttribute("playorder"));
                            var A = sML.create("a", { href: Content.getAttribute("src"), innerHTML: Text.innerHTML.trim() });
                            UL.appendChild(LI).appendChild(A);
                            var ChildUL = arguments.callee(NavPoint);
                            if(ChildUL) LI.appendChild(ChildUL);
                        }
                    }
                    return UL;
                })(Doc.getElementsByTagName("navMap")[0]);
                if(NavUL) NavContent.appendChild(document.createElement("nav")).appendChild(NavUL);
            }
            I.Panel.BookInfo.Navigation.appendChild(NavContent);
            I.Panel.BookInfo.Navigation.Body = I.Panel.BookInfo.Navigation;
            delete NavContent; delete Doc;
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
            if(!(sML.UA.Gecko || sML.UA.Edge)) return resolve();
            var FilesToBeLoaded = 0;
            for(var FilePath in B.Package.Manifest.Files) {
                if(/\.(css|xhtml|xml|html?)$/.test(FilePath)) {
                    B.Files[FilePath] = "";
                    FilesToBeLoaded++;
                }
            }
            if(!FilesToBeLoaded) return resolve();
            var FilesLoaded = 0;
            for(var FilePath in B.Files) {
                (function(FilePath) {
                    O.download(B.Path + "/" +  FilePath).then(function(XHR) {
                        B.Files[FilePath] = XHR.responseText;
                        FilesLoaded++;
                        if(FilesLoaded >= FilesToBeLoaded) return resolve("ToPreprocess");
                    });
                })(FilePath);
            }
        } else {
            for(var FilePath in B.Files) if(typeof B.Package.Manifest.Files[FilePath] == "undefined") B.Files[FilePath] = "";
            resolve("ToPreprocess");
        }
    }).then(function(ToPreprocess) {
        if(!ToPreprocess) return;
        for(var Type in L.preprocessResources.Settings) if(L.preprocessResources.Settings[Type].init) L.preprocessResources.Settings[Type].init();
        E.dispatch("bibi:is-going-to:preprocess-resources");
        var Log = [];
        ["CSS", "SVG", "HTML"].forEach(function(Type) {
            var Count = 0;
            for(var FilePath in B.Files) {
                if(!L.preprocessResources.Settings[Type].FileExtensionRE.test(FilePath)) continue;
                L.preprocessResources.preprocessFile(FilePath, L.preprocessResources.Settings[Type]);
                Count++;
            }
            if(Count) Log.push(Count + ' ' + Type + (Count >= 2 ? "s" : ""));
        });
        if(Log.length) O.log('Preprocessed ' + Log.join(', '), "-*");
        L.Preprocessed = true;
        E.dispatch("bibi:preprocessed-resources");
    });
};

L.preprocessResources.preprocessFile = function(FilePath, Setting) {
    if(B.Files[FilePath].Preprocessed) return B.Files[FilePath];
    var FileContent = B.Files[FilePath];
    if(!B.Files[FilePath] || !Setting.FileExtensionRE.test(FilePath)) return FileContent;
    if(Setting.ReplaceRules) {
        Setting.ReplaceRules.forEach(function(ReplaceRule) {
            if(ReplaceRule) FileContent = FileContent.replace(ReplaceRule[0], ReplaceRule[1]);
        });
    }
    if(Setting.NestingRE) {
        var Nestings = FileContent.match(Setting.NestingRE);
        if(Nestings) {
            Nestings.forEach(function(Nesting) {
                var NestingPath = O.getPath(FilePath.replace(/[^\/]+$/, ""), Nesting.replace(Setting.NestingRE, "$2"));
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
    B.Files[FilePath].Preprocessed = true;
    return B.Files[FilePath];
};

L.preprocessResources.Settings = {
    CSS: {
        FileExtensionRE: /\.css$/,
        ReplaceRules: [
            [/\/\*[.\s\S]*?\*\/|[^\{\}]+\{\s*\}/gm, ""],,
            [/(-(epub|webkit)-)?column-count\s*:\s*1\s*([;\}])/g, '$1column-count: auto$4']
        ],
        NestingRE: /(@import\s*(?:url\()?["']?)(?!(?:https?|data):)(.+?\.css)(['"]?(?:\))?\s*;)/g,
        ResAttributesAndExtensions: {
            "url" : "gif|png|jpe?g|svg|ttf|otf|woff"
        },
        getResMatchRE: function() {
            return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g;
        },
        init: function() {
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
        FileExtensionRE: /\.(xhtml|xml|html?)$/,
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
    var FileDir = FilePath.replace(/\/?[^\/]+$/, "");
    for(var Attribute in Setting.ResAttributesAndExtensions) {
        var ResMatchRE = Setting.getResMatchRE(Attribute);
        var ResMatches = FileContent.match(ResMatchRE);
        if(ResMatches) {
            var ExtRE = new RegExp('\.' + Setting.ResAttributesAndExtensions[Attribute] + '$', "i");
            ResMatches.forEach(function(Match) {
                var ResPathInSource = Match.replace(ResMatchRE, "$1");
                var ResPath = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? "./" : "") + ResPathInSource);
                var ResFilePathAndHash = ResPath.split("#");
                var ResFilePath = ResFilePathAndHash[0];
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
    O.log(sML.String.pad(Item.ItemIndex + 1, 0, B.FileDigit) + '/' + sML.String.pad(R.Items.length, 0, B.FileDigit) + ' - ' + (Item.Path ? B.Path + B.PathDelimiter + Item.Path : '... Not Found.'), "-*");
    Item.Loaded = false;
    Item.TimeCard = {};
    Item.stamp = function(What) { O.stamp(What, Item.TimeCard); };
    var Path = Item.Path;
    if(/\.(xhtml|xml|html?)$/i.test(Path)) {
        // If HTML or Others
        if(B.Files[Path]) {
            L.loadItem.writeItemHTML(Item, B.Files[Path]);
            setTimeout(L.postprocessItem, 0, Item);
        } else {
            Item.src = B.Path + "/" + Path;
            Item.onload = function() { setTimeout(L.postprocessItem, 0, Item); };
            Item.ItemBox.appendChild(Item);
        }
    } else if(/\.(svg)$/i.test(Path)) {
        // If SVG-in-Spine
        Item.IsSVG = true;
        if(B.Files[Path]) {
            L.loadItem.writeItemHTML(Item, false, '', B.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
        } else {
            var URI = B.Path + "/" + Path;
            O.download(URI).then(function(XHR) {
                L.loadItem.writeItemHTML(Item, false, '<base href="' + URI + '" />', XHR.responseText.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
            });
        }
    } else if(/\.(gif|jpe?g|png)$/i.test(Path)) {
        // If Bitmap-in-Spine
        Item.IsBitmap = true;
        L.loadItem.writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Files[Path] ? O.getDataURI(Path, B.Files[Path]) : B.Path + "/" + Path) + '" />');
    } else if(/\.(pdf)$/i.test(Path)) {
        // If PDF-in-Spine
        Item.IsPDF = true;
        L.loadItem.writeItemHTML(Item, false, '',     '<iframe src="' + (B.Files[Path] ? O.getDataURI(Path, B.Files[Path]) : B.Path + "/" + Path) + '" />');
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

    Item.HTML = sML.edit(Item.contentDocument.getElementsByTagName("html")[0], { Item: Item });
    Item.Head = sML.edit(Item.contentDocument.getElementsByTagName("head")[0], { Item: Item });
    Item.Body = sML.edit(Item.contentDocument.getElementsByTagName("body")[0], { Item: Item });

    var XMLLang = Item.HTML.getAttribute("xml:lang"), Lang = Item.HTML.getAttribute("lang");
         if(!XMLLang && !Lang) Item.HTML.setAttribute("xml:lang", B.Language), Item.HTML.setAttribute("lang", B.Language);
    else if(!XMLLang         ) Item.HTML.setAttribute("xml:lang", Lang);
    else if(            !Lang)                                                 Item.HTML.setAttribute("lang", XMLLang);

    sML.addClass(Item.HTML, sML.Environments.join(" "));
    sML.each(Item.Body.querySelectorAll("link"), function() { Item.Head.appendChild(this); });

    if(S["epub-additional-stylesheet"]) Item.Head.appendChild(sML.create("link",   { rel: "stylesheet", href: S["epub-additional-stylesheet"] }));
    if(S["epub-additional-script"])     Item.Head.appendChild(sML.create("script", { src: S["epub-additional-script"] }));

    Item.StyleSheets = [];
    sML.appendStyleRule("html", "-webkit-text-size-adjust: 100%;", Item.contentDocument);
    sML.each(Item.HTML.querySelectorAll("link, style"), function() {
        if(/^link$/i.test(this.tagName)) {
            if(!/^(alternate )?stylesheet$/.test(this.rel)) return;
            if((sML.UA.Safari || sML.OS.iOS) && this.rel == "alternate stylesheet") return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
        }
        Item.StyleSheets.push(this);
    });

    Item.BibiProperties = {};
    var BibiProperties = Item.HTML.getAttribute("data-bibi-properties");
    if(BibiProperties) {
        BibiProperties.replace(/[\s\t\r\n]+/g, " ").split(" ").forEach(function(Property) {
            if(Property) Item.BibiProperties[Property] = true;
        });
    }

    var Elements = Item.contentDocument.querySelectorAll("body>*");
    if(Elements && Elements.length) {
        var LengthOfElements = 0;
        for(var l = Elements.length, i = 0; i < l; i++) {
            if(!/^(script|style)$/i.test(Elements[i].tagName)) LengthOfElements++;
        }
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
        sML.each(Item.Body.getElementsByTagName("svg"), function() {
            var ChildImages = this.getElementsByTagName("image");
            if(ChildImages.length == 1) {
                var ChildImage = ChildImages[0];
                if(ChildImage.getAttribute("width") && ChildImage.getAttribute("height")) {
                    this.setAttribute("width",  ChildImage.getAttribute("width"));
                    this.setAttribute("height", ChildImage.getAttribute("height"));
                }
            }
        });
    }
};


L.postprocessItem.defineViewport = function(Item) {
    var ItemRef = Item.ItemRef;
    sML.each(Item.Head.getElementsByTagName("meta"), function() { // META Viewport
        if(this.name == "viewport") {
            ItemRef["viewport"].content = this.getAttribute("content");
            if(ItemRef["viewport"].content) {
                var ViewportWidth  = ItemRef["viewport"].content.replace( /^.*?width=([^\, ]+).*$/, "$1") * 1;
                var ViewportHeight = ItemRef["viewport"].content.replace(/^.*?height=([^\, ]+).*$/, "$1") * 1;
                if(!isNaN(ViewportWidth) && !isNaN(ViewportHeight)) {
                    ItemRef["viewport"].width  = ViewportWidth;
                    ItemRef["viewport"].height = ViewportHeight;
                }
            }
        }
    });
    if(ItemRef["rendition:layout"] == "pre-paginated" && !(ItemRef["viewport"].width * ItemRef["viewport"].height)) { // If Fixed-Layout Item without Viewport
        var ItemImage = Item.Body.firstElementChild;
        if(Item.SingleSVGOnlyItem) { // If Single-SVG-HTML or SVG-in-Spine, Use ViewBox for Viewport.
            if(ItemImage.getAttribute("viewBox")) {
                ItemRef["viewBox"].content = ItemImage.getAttribute("viewBox");
                var ViewBoxCoords  = ItemRef["viewBox"].content.split(" ");
                if(ViewBoxCoords.length == 4) {
                    var ViewBoxWidth  = ViewBoxCoords[2] * 1 - ViewBoxCoords[0] * 1;
                    var ViewBoxHeight = ViewBoxCoords[3] * 1 - ViewBoxCoords[1] * 1;
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
    var Path = Item.Path;
    var RootElement = Item.Body;
    sML.each(RootElement.getElementsByTagName("a"), function(i) {
        var A = this;
        if(InNav) {
            A.NavANumber = i + 1;
            A.addEventListener(O["pointerdown"], function(Eve) { Eve.stopPropagation(); });
            A.addEventListener(O["pointerup"],   function(Eve) { Eve.stopPropagation(); });
        }
        var HrefPathInSource = A.getAttribute("href");
        if(!HrefPathInSource) {
            if(InNav) {
                A.addEventListener("click", function(Eve) { Eve.preventDefault(); Eve.stopPropagation(); return false; });
                sML.addClass(A, "bibi-bookinfo-inactive-link");
            }
            return;
        }
        if(/^[a-zA-Z]+:/.test(HrefPathInSource)) {
            if(HrefPathInSource.split("#")[0] == location.href.split("#")[0]) {
                var HrefHashInSource = HrefPathInSource.split("#")[1];
                HrefPathInSource = (HrefHashInSource ? "#" + HrefHashInSource : R.Items[0].Path)
            } else {
                return A.setAttribute("target", A.getAttribute("target") || "_blank");
            }
        }
        var HrefPath = O.getPath(Path.replace(/\/?([^\/]+)$/, ""), (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? Path.replace(/^.+?([^\/]+)$/, "$1") : "") + HrefPathInSource);
        var HrefFnH = HrefPath.split("#");
        var HrefFile = HrefFnH[0] ? HrefFnH[0] : Path;
        var HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
        R.Items.forEach(function(rItem) {
            if(HrefFile == rItem.Path) {
                A.setAttribute("data-bibi-original-href", HrefPathInSource);
                A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + B.PathDelimiter + HrefPath);
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
                A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + B.PathDelimiter + "#" + HrefHash);
                A.InNav = InNav;
                A.Destination = X["EPUBCFI"].getDestination(HrefHash);
                L.postprocessItem.coordinateLinkages.setJump(A);
            } else {
                A.removeAttribute("href");
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
            var Go = L.Opened ? function() {
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
            var IsCJK = /^(zho?|chi|kor?|ja|jpn)$/.test(B.Language);
            O.editCSSRules(Item.contentDocument, function(CSSRule) {
                if(/(-(epub|webkit)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "tb-rl";
                if(/(-(epub|webkit)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "tb-lr";
                if(/(-(epub|webkit)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = "lr-tb";
                if(/(-(epub|webkit)-)?(text-combine-upright|text-combine-horizontal): all; /.test(CSSRule.cssText)) CSSRule.style.msTextCombineHorizontal = "all";
                if(IsCJK && / text-align: justify; /.test(CSSRule.cssText)) CSSRule.style.textJustify = "inter-ideograph";
            });
        } else {
            O.editCSSRules(Item.contentDocument, function(CSSRule) {
                if(/(-(epub|webkit)-)?column-count: 1; /.test(CSSRule.cssText)) CSSRule.style.columnCount = CSSRule.style.webkitColumnCount = CSSRule.style.epubColumnCount = "auto";
            });
        }
    }
    if(sML.UA.Gecko) {
        Array.prototype.forEach.call(Item.Body.getElementsByTagName("a"), function(A) {
            var ComputedStyle = getComputedStyle(A);
            if(/^vertical-/.test(ComputedStyle.writingMode)) {
                     if(ComputedStyle.textDecoration ==  "overline") A.style.textDecoration = "underline";
                else if(ComputedStyle.textDecoration == "underline") A.style.textDecoration =  "overline";
            }
        });
    }

    var ItemHTMLComputedStyle = getComputedStyle(Item.HTML);
    var ItemBodyComputedStyle = getComputedStyle(Item.Body);
    if(ItemHTMLComputedStyle[O.WritingModeProperty] != ItemBodyComputedStyle[O.WritingModeProperty]) {
        sML.style(Item.HTML, {
            "writing-mode": ItemBodyComputedStyle[O.WritingModeProperty]
        });
    }
    Item.HTML.WritingMode = O.getWritingMode(Item.HTML);
    sML.addClass(Item.HTML, "writing-mode-" + Item.HTML.WritingMode);
         if(/-rl$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
    else if(/-lr$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
    else                                        if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
    if(Item.HTML.style) { sML.style(Item.ItemBox, L.postprocessItem.patchStyles.getBackgroundStyle(Item.HTML)); Item.HTML.style.background = "transparent"; }
    if(Item.Body.style) { sML.style(Item,         L.postprocessItem.patchStyles.getBackgroundStyle(Item.Body)); Item.Body.style.background = "transparent"; }
    sML.each(Item.Body.getElementsByTagName("img"), function() {
        this.Bibi = {
            DefaultStyle: {
                "margin":            (this.style.margin          ? this.style.margin          : ""),
                "width":             (this.style.width           ? this.style.width           : ""),
                "height":            (this.style.height          ? this.style.height          : ""),
                "vertical-align":    (this.style.verticalAlign   ? this.style.verticalAlign   : ""),
                "page-break-before": (this.style.pageBreakBefore ? this.style.pageBreakBefore : ""),
                "page-break-after":  (this.style.pageBreakAfter  ? this.style.pageBreakAfter  : "")
            }
        }
    });

};

L.postprocessItem.patchStyles.getBackgroundStyle = function(Ele) {
    var ComputedStyle = getComputedStyle(Ele);
    return {
        backgroundColor: ComputedStyle.backgroundColor,
        backgroundImage: ComputedStyle.backgroundImage,
        backgroundRepeat: ComputedStyle.backgroundRepeat,
        backgroundPosition: ComputedStyle.backgroundPosition,
        backgroundSize: ComputedStyle.backgroundSize
    };
};


L.onLoadItem = function(Item) {
    Item.Loaded = true;
    L.LoadedItems++;
    if(Item.ImageItem) {
        sML.addClass(Item.ItemBox, "image-item-box");
        sML.addClass(Item, "image-item");
    }
    E.dispatch("bibi:loaded-item", Item);
    Item.stamp("Loaded");
    var Spread = Item.Spread;
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
        sML.addClass(Spread.SpreadBox, "image-spread-box");
        sML.addClass(Spread, "image-spread");
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
    sML.removeClass(O.HTML, "busy");
    sML.removeClass(O.HTML, "loading");

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
                var HatchedDestination = R.focusOn.hatchDestination(S["to"]);
                if(HatchedDestination) return HatchedDestination;
            }
            return "head";
        })()
    });

    R.getCurrent();

    E.dispatch("bibi:laid-out:for-the-first-time");

    setTimeout(function() {
        if(I.Veil) I.Veil.close();
        setTimeout(function() {
            if(I.Menu) I.Menu.close();
            if(I.Slider) I.Slider.close();
        }, 888);
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


R = {}; // Bibi.Reader


R.initialize = function() {

    R.Main      = O.Body.insertBefore(sML.create("div", { id: "bibi-main" }), O.Body.firstElementChild);
    R.Sub       = O.Body.insertBefore(sML.create("div", { id: "bibi-sub" }),  R.Main.nextSibling);
    R.Main.Book =  R.Main.appendChild(sML.create("div", { id: "bibi-main-book" }));

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

    //if(!O.Mobile) {
        O.HTML.addEventListener(O["pointermove"], R.onpointermove);
        //O.HTML.addEventListener(O["pointerover"], R.onpointermove);
        //O.HTML.addEventListener(O["pointerout"],  R.onpointermove);
        E.add("bibi:loaded-item", function(Item) {
            Item.HTML.addEventListener(O["pointermove"], R.onpointermove);
            //Item.HTML.addEventListener(O["pointerover"], R.onpointermove);
            //Item.HTML.addEventListener(O["pointerout"],  R.onpointermove);
        });
    //}

    I.observeTap(O.HTML);
    O.HTML.addTapEventListener("tap", R.ontap);
    E.add("bibi:loaded-item", function(Item) {
        I.observeTap(Item.HTML);
        Item.HTML.addTapEventListener("tap", R.ontap);
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
    R.Stage = {};
    R.Columned = false;
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = "";
    R.Stage.Width  = O.HTML.clientWidth;
    R.Stage.Height = O.HTML.clientHeight;
    if(/FBAN/.test(navigator.userAgent)) {
        R.Stage.Height = window.innerHeight;
        O.HTML.style.height = window.innerHeight + "px";
        window.scrollTo(0, 0);
    }
    if(S.RVM == "paged") {
        if(I.Slider) R.Stage.Height -= O.Scrollbars.Height;
        R.Stage.PageGap = R.Main.Book.style["padding" + S.BASE.S] = R.Main.Book.style["padding" + S.BASE.E] = 0;
    } else {
        R.Stage[S.SIZE.B] -= O.Scrollbars[S.SIZE.B] + S["spread-margin"] * 2;
        R.Stage.PageGap = S["spread-gap"];
        R.Main.Book.style["padding" + S.BASE.S] = S["spread-margin"] + "px";
        R.Main.Book.style["padding" + S.BASE.E] = S["spread-margin"] + "px";
    }
    R.Stage.Orientation = (R.Stage.Width / R.Stage.Height > 1.4) ? "landscape" : "portrait";
    R.Stage.BunkoLength = Math.floor(R.Stage[S.SIZE.B] * R.DefaultPageRatio[S.AXIS.L] / R.DefaultPageRatio[S.AXIS.B]);
    if(S["book-background"]) O.HTML.style["background"] = S["book-background"];
};

R.resetSpread = function(Spread) {
    O.stamp("Reset Spread " + Spread.SpreadIndex + " Start");
    E.dispatch("bibi:is-going-to:reset-spread", Spread);
    Spread.Items.forEach(function(Item) {
        R.resetItem(Item);
    });
    var SpreadBox = Spread.SpreadBox;
    SpreadBox.style["margin" + S.BASE.B] = SpreadBox.style["margin" + S.BASE.A] = "";
    SpreadBox.style["margin" + S.BASE.E] = SpreadBox.style["margin" + S.BASE.S] = "auto";
    SpreadBox.style.padding = SpreadBox.style.width = SpreadBox.style.height = "";
    if(Spread.RenditionLayout == "reflowable" || (S.BRL == "reflowable" && S.SLA == "vertical")) {
        if(Spread.Items.length == 2) {
            if(R.Stage.Width > Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth) {
                var Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
                var Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight);
            } else {
                var Width  = Math.max(Spread.Items[0].ItemBox.offsetWidth,   Spread.Items[1].ItemBox.offsetWidth);
                var Height =          Spread.Items[0].ItemBox.offsetHeight + Spread.Items[1].ItemBox.offsetHeight;
            }
        } else {
            var Width  = Spread.Items[0].ItemBox.offsetWidth;
            var Height = Spread.Items[0].ItemBox.offsetHeight;
        }
    } else {
        if(Spread.Items.length == 2) {
            var Width  =          Spread.Items[0].ItemBox.offsetWidth + Spread.Items[1].ItemBox.offsetWidth;
            var Height = Math.max(Spread.Items[0].ItemBox.offsetHeight, Spread.Items[1].ItemBox.style.offsetHeight);
        } else {
            var Width  = Spread.Items[0].ItemBox.offsetWidth * (Spread.Items[0].ItemRef["page-spread"] == "left" || Spread.Items[0].ItemRef["page-spread"] == "right" ? 2 : 1);
            var Height = Spread.Items[0].ItemBox.offsetHeight;
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
    Item.HTML.style[S.SIZE.b] = Item.HTML.style[S.SIZE.l] = "";
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
    var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    var StageB = R.Stage[S.SIZE.B];
    var StageL = R.Stage[S.SIZE.L];
    var PageGap = R.Stage.PageGap;
    if(!/fill/.test(ItemRef["bibi:layout"])) {
        StageB  -= (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]);
        StageL  -= (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
        PageGap += (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
        Item.style["padding-" + S.BASE.b] = S["item-padding-" + S.BASE.b] + "px";
        Item.style["padding-" + S.BASE.a] = S["item-padding-" + S.BASE.a] + "px";
        Item.style["padding-" + S.BASE.s] = S["item-padding-" + S.BASE.s] + "px";
        Item.style["padding-" + S.BASE.e] = S["item-padding-" + S.BASE.e] + "px";
    }
    var PageB = StageB;
    var PageL = StageL;
    if(!S["single-page-always"] && /-tb$/.test(B.WritingMode) && S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        var BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.AXIS.L] / R.DefaultPageRatio[S.AXIS.B]);
        var StageHalfL = Math.floor((StageL - PageGap) / 2);
        if(StageHalfL >= BunkoL) {
            Item.Spreaded = true;
            PageL = StageHalfL;
        }
    }
    Item.style[S.SIZE.b] = PageB + "px";
    Item.style[S.SIZE.l] = PageL + "px";
    R.resetItem.asReflowableItem.adjustContent(Item, PageB, PageL, PageGap);
    var ItemL = sML.UA.InternetExplorer ? Item.Body["client" + S.SIZE.L] : Item.HTML["scroll" + S.SIZE.L];
    var Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
    ItemL = (PageL + PageGap) * Pages - PageGap;
    Item.style[S.SIZE.l] = ItemL + "px";
    if(sML.UA.InternetExplorer) Item.HTML.style[S.SIZE.l] = "100%";
    var ItemBoxB = PageB;
    var ItemBoxL = ItemL + ((S.RVM == "paged" && Item.Spreaded && Pages % 2) ? (PageGap + PageL) : 0);
    if(!/fill/.test(ItemRef["bibi:layout"])) {
        ItemBoxB += (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]);
        ItemBoxL += (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
    }
    ItemBox.style[S.SIZE.b] = ItemBoxB + "px";
    ItemBox.style[S.SIZE.l] = ItemBoxL + "px";
    for(var i = 0; i < Pages; i++) {
        var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
        if(!/fill/.test(ItemRef["bibi:layout"])) {
            Page.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + "px";
            Page.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + "px";
            Page.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
            Page.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
        }
        Page.style[S.SIZE.b] = PageB + "px";
        Page.style[S.SIZE.l] = PageL + "px";
        Page.style[S.BASE.b] = (PageL + PageGap) * i + "px";
        Page.Item = Item, Page.Spread = Spread;
        Page.PageIndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
    }
    return Item;
};
R.resetItem.asReflowableItem.adjustContent = function(Item, PageB, PageL, PageGap) {
    E.dispatch("bibi:is-going-to:adjust-content", Item);
    var WordWrappingStyleSheetIndex = sML.appendStyleRule("*", "word-wrap: break-word;", Item.contentDocument); ////
    R.resetItem.asReflowableItem.adjustContent.fitImages(Item, PageB, PageL);
    R.resetItem.asReflowableItem.adjustContent.columify(Item, PageB, PageL, PageGap);
    if(S["page-breaking"]) R.resetItem.asReflowableItem.adjustContent.breakPages(Item, PageB);
    sML.deleteStyleRule(WordWrappingStyleSheetIndex, Item.contentDocument); ////
    E.dispatch("bibi:adjusted-content", Item);
};
R.resetItem.asReflowableItem.adjustContent.fitImages = function(Item, PageB, PageL) {
    sML.each(Item.Body.getElementsByTagName("img"), function() {
        if(!this.Bibi || !this.Bibi.DefaultStyle) return;
        //this.style.display       = this.Bibi.DefaultStyle["display"];
        //this.style.verticalAlign = this.Bibi.DefaultStyle["vertical-align"];
        this.style.width         = this.Bibi.DefaultStyle["width"];
        this.style.height        = this.Bibi.DefaultStyle["height"];
        var B = parseFloat(getComputedStyle(this)[S.SIZE.b]);
        var L = parseFloat(getComputedStyle(this)[S.SIZE.l]);
        var MaxB = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.SIZE.b]), PageB));
        var MaxL = Math.floor(Math.min(parseFloat(getComputedStyle(Item.Body)[S.SIZE.l]), PageL));
        if(B > MaxB || L > MaxL) {
            //if(getComputedStyle(this).display == "inline") this.style.display = "inline-block";
            //this.style.verticalAlign = "top";
            this.style[S.SIZE.b] = Math.floor(parseFloat(getComputedStyle(this)[S.SIZE.b]) * Math.min(MaxB / B, MaxL / L)) + "px";
            this.style[S.SIZE.l] = "auto";
        }
    });
};
R.resetItem.asReflowableItem.adjustContent.columify = function(Item, PageB, PageL, PageGap) {
    if(S.RVM == "paged" || Item.HTML["offset"+ S.SIZE.B] > PageB) {
        R.Columned = Item.Columned = true, Item.ColumnBreadth = PageB, Item.ColumnLength = PageL, Item.ColumnGap = PageGap;
        Item.HTML.style[S.SIZE.b] = PageB + "px";
        Item.HTML.style[S.SIZE.l] = PageL + "px";
        sML.style(Item.HTML, {
            "column-fill": "auto",
            "column-width": Item.ColumnLength + "px",
            "column-gap": Item.ColumnGap + "px",
            "column-rule": ""
        });
    }
};
R.resetItem.asReflowableItem.adjustContent.breakPages = function(Item, PageB) {
    var PBR; // PageBreakerRulers
    if(Item.Body["offset" + S.SIZE.B] <= PageB) PBR = [(S.SLA == "vertical" ? "Top" : "Left"), window["inner" + S.SIZE.L]/*PageL*/, S.SIZE.L, S.SIZE.l, S.BASE.a];
    else                                        PBR = [(S.SLA == "vertical" ? "Left" : "Top"), /*window["inner" + S.SIZE.B]*/PageB, S.SIZE.B, S.SIZE.b, S.BASE.e];
    sML.each(Item.contentDocument.querySelectorAll("html>body *"), function() {
        var ComputedStyle = getComputedStyle(this);
        if(ComputedStyle.pageBreakBefore != "always" && ComputedStyle.pageBreakAfter != "always") return;
        if(this.BibiPageBreakerBefore) this.BibiPageBreakerBefore.style[PBR[3]] = "";
        if(this.BibiPageBreakerAfter)  this.BibiPageBreakerAfter.style[PBR[3]] = "";
        var Ele = this,                                 BreakPoint  = Ele["offset" + PBR[0]], Add = 0;
        while(Ele.offsetParent) Ele = Ele.offsetParent, BreakPoint += Ele["offset" + PBR[0]];
        if(S.SLD == "rtl") BreakPoint = window["innerWidth"] + BreakPoint * -1 - this["offset" + PBR[2]];
        if(ComputedStyle.pageBreakBefore == "always") {
            if(!this.BibiPageBreakerBefore) this.BibiPageBreakerBefore = this.parentNode.insertBefore(sML.create("span", { className: "bibi-page-breaker-before" }, { display: "block" }), this);
            Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
            this.BibiPageBreakerBefore.style[PBR[3]] = Add + "px";
        }
        if(ComputedStyle.pageBreakAfter == "always") {
            BreakPoint += Add + this["offset" + PBR[2]];
            this.style["margin-" + PBR[4]] = 0;
            if(!this.BibiPageBreakerAfter) this.BibiPageBreakerAfter = this.parentNode.insertBefore(sML.create("span", { className: "bibi-page-breaker-after" }, { display: "block" }), this.nextSibling);
            Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
            this.BibiPageBreakerAfter.style[PBR[3]] = Add + "px";
        }
    });
};

R.resetItem.asReflowableOutsourcingItem = function(Item, Fun) {
    var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    Item.style.margin = "auto";
    Item.style.padding = 0;
    var StageB = R.Stage[S.SIZE.B];
    var StageL = R.Stage[S.SIZE.L];
    var PageB = StageB;
    var PageL = StageL;
    if(!S["single-page-always"] && S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        var BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.AXIS.L] / R.DefaultPageRatio[S.AXIS.B]);
        var StageHalfL = Math.floor((StageL - R.Stage.PageGap) / 2);
        if(StageHalfL > BunkoL) {
            Item.Spreaded = true;
            PageL = StageHalfL;
        }
    }
    Item.style[S.SIZE.b] = ItemBox.style[S.SIZE.b] = PageB + "px";
    Item.style[S.SIZE.l] = ItemBox.style[S.SIZE.l] = PageL + "px";
    if(Item.ImageItem) {
        if(Item.HTML["scroll" + S.SIZE.B] <= PageB && Item.HTML["scroll" + S.SIZE.L] <= PageL) {
            var ItemBodyComputedStyle = getComputedStyle(Item.Body);
            Item.style.width = Item.Body.offsetWidth + parseFloat(ItemBodyComputedStyle.marginLeft) + parseFloat(ItemBodyComputedStyle.marginRight) + "px";
        } else {
            if((S.SLD == "ttb" && Item.HTML["scroll" + S.SIZE.B] > PageB) || (S.SLA == "horizontal" && Item.HTML["scroll" + S.SIZE.L] > PageL)) {
                var TransformOrigin = (/rl/.test(Item.HTML.WritingMode)) ? "100% 0" : "0 0";
            } else {
                var TransformOrigin =  "50% 0";
            }
            var Scale = Math.floor(Math.min(PageB / Item.HTML["scroll" + S.SIZE.B], PageL / Item.HTML["scroll" + S.SIZE.L]) * 100) / 100;
            sML.style(Item.HTML, {
                "transform-origin": TransformOrigin,
                "transform": "scale(" + Scale + ")"
            });
        }
        sML.each(Item.Body.getElementsByTagName("img"), function() {
            var IMG = this;
            IMG.style.maxWidth = "none";
            setTimeout(function() {
                IMG.style.maxWidth = "";
            }, 0);
        });
    } else if(Item.FrameItem) {
        var IFrame = Item.Body.getElementsByTagName("iframe")[0];
        IFrame.style[S.SIZE.b] = IFrame.style[S.SIZE.l] = "100%";
    }
    var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
    Page.style[S.SIZE.b] = PageB + "px";
    Page.style[S.SIZE.l] = PageL + "px";
    Page.style[S.BASE.b] = 0;
    Page.Item = Item, Page.Spread = Spread;
    Page.PageIndexInItem = Item.Pages.length;
    Item.Pages.push(Page);
    return Item;
};

R.resetItem.asPrePaginatedItem = function(Item) {
    var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
    Item.HTML.style.margin = Item.HTML.style.padding = Item.Body.style.margin = Item.Body.style.padding = 0;
    var StageB = R.Stage[S.SIZE.B];
    var StageL = R.Stage[S.SIZE.L];
    var PageB = StageB;
    var PageL = StageL;
    Item.style.padding = 0;
    if(Item.Scale) {
        var Scale = Item.Scale;
        delete Item.Scale;
    } else {
        var Scale = 1;
        if((S.BRL == "pre-paginated" && S.SLA == "vertical") || R.Stage.Orientation == ItemRef["rendition:spread"] || ItemRef["rendition:spread"] == "both") {
            var SpreadViewPort = { Width: ItemRef["viewport"].width, Height: ItemRef["viewport"].height };
            if(Item.SpreadPair) SpreadViewPort.Width += Item.SpreadPair.ItemRef["viewport"].width;
            else if(ItemRef["page-spread"] == "right" || ItemRef["page-spread"] == "left") SpreadViewPort.Width += SpreadViewPort.Width;
            Scale = Math.min(
                PageB / SpreadViewPort[S.SIZE.B],
                PageL / SpreadViewPort[S.SIZE.L]
            );
        } else {
            Scale = Math.min(
                PageB / ItemRef["viewport"][S.SIZE.b],
                PageL / ItemRef["viewport"][S.SIZE.l]
            );
        }
        if(Item.SpreadPair) Item.SpreadPair.Scale = Scale;
    }
    PageL = Math.floor(ItemRef["viewport"][S.SIZE.l] * Scale);
    PageB = Math.floor(ItemRef["viewport"][S.SIZE.b] * (PageL / ItemRef["viewport"][S.SIZE.l]));
    ItemBox.style[S.SIZE.l] = Item.style[S.SIZE.l] = PageL + "px";
    ItemBox.style[S.SIZE.b] = Item.style[S.SIZE.b] = PageB + "px";
    var TransformOrigin = (/rl/.test(Item.HTML.WritingMode)) ? "100% 0" : "0 0";
    sML.style(Item.HTML, {
        "width": ItemRef["viewport"].width + "px",
        "height": ItemRef["viewport"].height + "px",
        "transform-origin": TransformOrigin,
        "transformOrigin": TransformOrigin,
        "transform": "scale(" + Scale + ")"
    });
    var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
    if(ItemRef["page-spread"] == "right") Page.style.right = 0;
    else                                  Page.style.left  = 0;
    Page.style[S.SIZE.b] = PageB + "px";
    Page.style[S.SIZE.l] = PageL + "px";
    Page.Item = Item, Page.Spread = Spread;
    Page.PageIndexInItem = Item.Pages.length;
    Item.Pages.push(Page);
    return Item;
};

R.resetPages = function() {
    R.Pages.forEach(function(Page) {
        Page.parentNode.removeChild(Page);
        delete Page;
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

R.resetNavigation = function() {/*
    if(S.PPD == "rtl") {
        var theWidth = I.Panel.Navigation.scrollWidth - window.innerWidth;
        I.Panel.NavigationBox.scrollLeft = I.Panel.NavigationBox.scrollWidth - window.innerWidth;
    }
*/};


R.layOutSpread = function(Spread) {
    O.stamp("Lay Out Spread " + Spread.SpreadIndex + " Start");
    E.dispatch("bibi:is-going-to:lay-out-spread", Spread);
    var SpreadBox = Spread.SpreadBox;
    SpreadBox.style.padding = "";
    SpreadBox.PaddingBefore = SpreadBox.PaddingAfter = 0;
    if(S.SLA == "horizontal") {
        // Set padding-start + padding-end of SpreadBox
        if(SpreadBox.offsetHeight < R.Stage[S.SIZE.B]) {
            var SpreadBoxPaddingTop    = Math.floor((R.Stage[S.SIZE.B] - SpreadBox.offsetHeight) / 2);
            var SpreadBoxPaddingBottom = R.Stage[S.SIZE.B] - (SpreadBoxPaddingTop + SpreadBox.offsetHeight);
            SpreadBox.style.paddingTop    = SpreadBoxPaddingTop + "px";
            SpreadBox.style.paddingBottom = SpreadBoxPaddingBottom + "px";
        }
    }
    if(S.BRL == "pre-paginated") {
        if(R.Stage[S.SIZE.L] >= SpreadBox["offset" + S.SIZE.L]) {
            SpreadBox.PaddingBefore = SpreadBox.PaddingAfter = Math.ceil((R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        } else {
            var FirstItemInSpread = Spread.Items[0];
            if(R.Stage[S.SIZE.L] >= FirstItemInSpread["offset" + S.SIZE.L]) {
                SpreadBox.PaddingBefore = Math.ceil((R.Stage[S.SIZE.L] - FirstItemInSpread["offset" + S.SIZE.L]) / 2);
            }
            var LastItemInSpread = Spread.Items[Spread.Items.length - 1];
            if(R.Stage[S.SIZE.L] >= LastItemInSpread["offset" + S.SIZE.L]) {
                SpreadBox.PaddingAfter = Math.ceil((R.Stage[S.SIZE.L] - LastItemInSpread["offset" + S.SIZE.L]) / 2);
            }
        }
        if(Spread.SpreadIndex != 0) {
            var PreviousSpreadBox = R.Spreads[Spread.SpreadIndex - 1].SpreadBox;
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
            SpreadBox.PaddingBefore = Math.floor((R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        } else {
            SpreadBox.PaddingBefore = R.Stage.PageGap;
        }
        if(Spread.SpreadIndex == R.Spreads.length - 1) {
            SpreadBox.PaddingAfter  = Math.ceil( (R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        }
    }
    if(SpreadBox.PaddingBefore > 0) SpreadBox.style["padding" + S.BASE.B] = SpreadBox.PaddingBefore + "px";
    if(SpreadBox.PaddingAfter  > 0) SpreadBox.style["padding" + S.BASE.A] = SpreadBox.PaddingAfter  + "px";
    // Adjust R.Main.Book (div#epub-content-main)
    var MainContentLength = 0;
    R.Spreads.forEach(function(Spread) {
        MainContentLength += Spread.SpreadBox["offset" + S.SIZE.L];
    });
    R.Main.Book.style[S.SIZE.b] = "";
    R.Main.Book.style[S.SIZE.l] = MainContentLength + "px";
    E.dispatch("bibi:laid-out-spread", Spread);
    O.stamp("Lay Out Spread " + Spread.SpreadIndex + " End");
};


/*
R.layOutStage = function() {
    var StageLength = 0;
    for(var l = R.Spreads.length, i = 0; i < l; i++) StageLength += R.Spreads[i].SpreadBox["offset" + S.SIZE.L];
    R.Main.Book.style[S.SIZE.l] = StageLength + "px";
};
*/


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
    E.dispatch("bibi:is-going-to:lay-out", Opt);

    window.removeEventListener(O["resize"], R.onresize);
    R.Main.removeEventListener("scroll", R.onscroll);

    O.Busy = true;
    sML.addClass(O.HTML, "busy");
    sML.addClass(O.HTML, "laying-out");
    if(!Opt.NoNotification) I.note('Laying Out...');

    if(!Opt.Destination) {
        R.getCurrent();
        var CurrentPage = R.Current.Pages.StartPage;
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
    for(var l = R.Items.length, i = 0; i < l; i++) {
        var Style = R.Items[i].HTML.style;
        if(Style["-webkit-column-width"] || Style["-moz-column-width"] || Style["-ms-column-width"] || Style["column-width"]) {
            R.Columned = true;
            break;
        }
    }

    E.dispatch("bibi:commands:focus-on", { Destination: Opt.Destination, Duration: 0 });

    O.Busy = false;
    sML.removeClass(O.HTML, "busy");
    sML.removeClass(O.HTML, "laying-out");
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
    var PreviousOrientation = R.Orientation;
    if(typeof window.orientation != "undefined") {
        R.Orientation = (window.orientation == 0 || window.orientation == 180) ? "portrait" : "landscape";
    } else {
        var W = window.innerWidth  - (S.SLA == "vertical"   ? O.Scrollbars.Width  : 0);
        var H = window.innerHeight - (S.SLA == "horizontal" ? O.Scrollbars.Height : 0);
        R.Orientation = W / H < 1.4 /* Math.floor(Math.sqrt(2) * 10) / 10 */ ? "portrait" : "landscape";
    }
    if(R.Orientation != PreviousOrientation) {
        E.dispatch("bibi:changes-orientation", R.Orientation);
        sML.removeClass(O.HTML, "orientation-" + PreviousOrientation);
        sML.addClass(   O.HTML, "orientation-" + R.Orientation);
        E.dispatch("bibi:changed-orientation", R.Orientation);
    }
};

R.onscroll = function(Eve) {
    if(!L.Opened) return;
    if(!R.Scrolling) {
        sML.addClass(O.HTML, "scrolling");
        R.Scrolling = true;
        Eve.BibiScrollingBegun = true;
    }
    E.dispatch("bibi:scrolls", Eve);
    clearTimeout(R.Timer_onscrolled);
    R.Timer_onscrolled = setTimeout(function() {
        R.Scrolling = false;
        sML.removeClass(O.HTML, "scrolling");
        E.dispatch("bibi:scrolled", Eve);
    }, 123);
};

R.onresize = function(Eve) {
    if(!L.Opened) return;
    if(!R.Resizing) sML.addClass(O.HTML, "resizing");
    R.Resizing = true;
    E.dispatch("bibi:resizes", Eve);
    clearTimeout(R.Timer_afterresized);
    clearTimeout(R.Timer_onresized);
    R.Timer_onresized = setTimeout(function() {
        O.Busy = true;
        sML.addClass(O.HTML, "busy");
        R.updateOrientation();
        R.Timer_afterresized = setTimeout(function() {
            E.dispatch("bibi:resized", Eve);
            O.Busy = false;
            R.Resizing = false;
            sML.removeClass(O.HTML, "busy");
            sML.removeClass(O.HTML, "resizing");
        }, 100);
    }, O.Mobile ? 444 : 222);
};

R.ontap = function(Eve) {
    E.dispatch("bibi:taps",   Eve);
    E.dispatch("bibi:tapped", Eve);
}

R.onpointermove = function(Eve) {
    var CC = O.getBibiEventCoord(Eve), PC = R.onpointermove.PreviousCoord;
    if(PC.X != CC.X || PC.Y != CC.Y) E.dispatch("bibi:moved-pointer",   Eve);
    else                             E.dispatch("bibi:stopped-pointer", Eve);
    R.onpointermove.PreviousCoord = CC;
};
R.onpointermove.PreviousCoord = { X:0, Y:0 };

R.onwheel = function(Eve) {
    Eve.preventDefault();
    if(Math.abs(Eve.deltaX) > Math.abs(Eve.deltaY)) {
        var CW = {}, PWs = R.onwheel.PreviousWheels, PWl = PWs.length, Wheeled = false;
        CW.Distance = (Eve.deltaX < 0 ? -1 : 1) * (S.ARD == "rtl" ? -1 : 1);
        CW.Delta = Math.abs(Eve.deltaX);
        if(!PWs[PWl - 1]) {
            CW.Accel = 1, CW.Wheeled = "start";
        } else if(CW.Distance != PWs[PWl - 1].Distance) {
            CW.Accel = 1;
            if(PWl >= 3 && PWs[PWl - 2].Distance != CW.Distance && PWs[PWl - 3].Distance != CW.Distance) CW.Wheeled = "reverse";
        } else if(CW.Delta > PWs[PWl - 1].Delta) {
            CW.Accel =  1;
            if(PWl >= 3 && PWs[PWl - 1].Accel == -1 && PWs[PWl - 2].Accel == -1 && PWs[PWl - 3].Accel == -1) CW.Wheeled = "serial";
        } else if(CW.Delta < PWs[PWl - 1].Delta) {
            CW.Accel = -1;
        } else {
            CW.Accel = PWs[PWl - 1].Accel;
        }
        if(CW.Wheeled) {
            Eve.BibiSwiperWheel = CW;
            E.dispatch("bibi:wheeled", Eve);
        }
        if(PWl >= 3) PWs.shift();
        PWs.push(CW);
    }
    clearTimeout(R.onwheel.Timer_stop);
    R.onwheel.Timer_stop = setTimeout(function() { R.onwheel.PreviousWheels = []; }, 192);
};
R.onwheel.PreviousWheels = [];

R.changeView = function(RVM) {
    if(S["fix-reader-view-mode"] || typeof RVM != "string" || S.RVM == RVM || !/^(paged|horizontal|vertical)$/.test(RVM)) return false;
    if(L.Opened) {
        I.Panel.close();
        I.SubPanels.forEach(function(SubPanel) {
            SubPanel.close();
        });
        I.Menu.close();
        if(I.Slider) I.Slider.close();
        O.Busy = true;
        sML.addClass(O.HTML, "busy");
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
                    sML.removeClass(O.HTML, "busy");
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


R.getFrameState = function() {
    return {
        Coord: sML.Coord.getScrollCoord(R.Main),
        Size: sML.Coord.getClientSize(R.Main)
    };
};


R.getCurrentPages = function() {
    var FrameState = R.getFrameState();
    var FrameScrollCoord = FrameState.Coord;
    var FrameClientSize  = FrameState.Size;
    FrameScrollCoord = {
        Left:   FrameScrollCoord.X,
        Right:  FrameScrollCoord.X + FrameClientSize.Width,
        Top:    FrameScrollCoord.Y,
        Bottom: FrameScrollCoord.Y + FrameClientSize.Height,
    };
    FrameScrollCoord.Before = FrameScrollCoord[S.BASE.B];
    FrameScrollCoord.After  = FrameScrollCoord[S.BASE.A];
    var Pages = [], Ratio = [], Status = [], BiggestRatio = 0, Done = false;
    R.Pages.forEach(function(Page, i) {
        if(!Done) {
            var PageCoord = sML.getCoord(Page);
            PageCoord.Before = PageCoord[S.BASE.B];
            PageCoord.After  = PageCoord[S.BASE.A];
            var LengthInside = Math.min(FrameScrollCoord.After * S.AXIS.PM, PageCoord.After * S.AXIS.PM) - Math.max(FrameScrollCoord.Before * S.AXIS.PM, PageCoord.Before * S.AXIS.PM);
            var PageRatio = (LengthInside <= 0 || !PageCoord[S.SIZE.L] || isNaN(LengthInside)) ? 0 : Math.round(LengthInside / PageCoord[S.SIZE.L] * 100);
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
        }
    });
    var Params = {
                                                   Ratio: Ratio,                          Status: Status,
        StartPage: Pages[0],              StartPageRatio: Ratio[0],              StartPageStatus: Status[0],
          EndPage: Pages[Pages.length - 1], EndPageRatio: Ratio[Ratio.length - 1], EndPageStatus: Status[Status.length - 1]
    };
    for(var Property in Params) Pages[Property] = Params[Property];
    return Pages;
};

R.getCurrentPages.getStatus = function(PageRatio, PageCoord, FrameScrollCoord) {
    if(PageRatio >= 100) return "including";
    var Status = [];
    if(window["inner" + S.SIZE.L] < PageCoord[S.SIZE.L]) Status.push("oversize");
    var FrameBefore = FrameScrollCoord.Before;
    var FrameAfter  = FrameScrollCoord.After;
    if(FrameBefore * S.AXIS.PM <  PageCoord.Before * S.AXIS.PM) Status.push("entering");
    if(FrameBefore * S.AXIS.PM == PageCoord.Before * S.AXIS.PM) Status.push("entered");
    if(FrameAfter  * S.AXIS.PM == PageCoord.After  * S.AXIS.PM) Status.push("passsing");
    if(FrameAfter  * S.AXIS.PM  > PageCoord.After  * S.AXIS.PM) Status.push("passed");
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
                if(Page.IsCurrent) sML.replaceClass(Page, "not-current", "current");
                else               sML.replaceClass(Page, "current", "not-current");
            });
            if(Item.IsCurrent) [Item, Item.ItemBox].forEach(function(Ele) { sML.replaceClass(Ele, "not-current", "current"); });
            else               [Item, Item.ItemBox].forEach(function(Ele) { sML.replaceClass(Ele, "current", "not-current"); });
        });
        if(Spread.IsCurrent) [Spread, Spread.SpreadBox].forEach(function(Ele) { sML.replaceClass(Ele, "not-current", "current"); });
        else                 [Spread, Spread.SpreadBox].forEach(function(Ele) { sML.replaceClass(Ele, "current", "not-current"); });
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
    var FocusPoint = 0;
    if(S["book-rendition-layout"] == "reflowable") {
        if(Par.Destination.Edge == "head") {
            FocusPoint = (S.SLD != "rtl") ? 0 : R.Main.Book["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.SIZE.L];
        } else if(Par.Destination.Edge == "foot") {
            FocusPoint = (S.SLD == "rtl") ? 0 : R.Main.Book["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.SIZE.L];
        } else {
            FocusPoint = O.getElementCoord(Par.Destination.Page)[S.AXIS.L];
            if(Par.Destination.Side == "after") FocusPoint += (Par.Destination.Page["offset" + S.SIZE.L] - R.Stage[S.SIZE.L]) * S.AXIS.PM;
            if(S.SLD == "rtl") FocusPoint += Par.Destination.Page.offsetWidth - R.Stage.Width;
        }
    } else {
        if(R.Stage[S.SIZE.L] > Par.Destination.Page.Spread["offset" + S.SIZE.L]) {
            FocusPoint = O.getElementCoord(Par.Destination.Page.Spread)[S.AXIS.L];
            FocusPoint -= Math.floor((R.Stage[S.SIZE.L] - Par.Destination.Page.Spread["offset" + S.SIZE.L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Par.Destination.Page)[S.AXIS.L];
            if(R.Stage[S.SIZE.L] > Par.Destination.Page["offset" + S.SIZE.L]) FocusPoint -= Math.floor((R.Stage[S.SIZE.L] - Par.Destination.Page["offset" + S.SIZE.L]) / 2);
        }
    }
    if(typeof Par.Destination.TextNodeIndex == "number") R.selectTextLocation(Par.Destination); // Colorize Destination with Selection
    var ScrollTarget = R.focusOn.getScrollTarget(FocusPoint);
    sML.scrollTo(ScrollTarget, {
        ForceScroll: true,
        Duration: ((S.RVM == "paged") ? 0 : Par.Duration),
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
    var Item = Ele.ownerDocument.body.Item;
    if(!Item) return R.Pages[0];
    if(Item.Columned) {
        sML.style(Item.HTML, { "column-width": "" });
        var ElementCoordInItem = O.getElementCoord(Ele)[S.AXIS.B];
        if(S.PPD == "rtl" && S.SLA == "vertical") {
            ElementCoordInItem = Item.offsetWidth - (S["item-padding-left"] + S["item-padding-right"]) - ElementCoordInItem - Ele.offsetWidth;
        }
        sML.style(Item.HTML, { "column-width": Item.ColumnLength + "px" });
        var NearestPage = Item.Pages[Math.ceil(ElementCoordInItem / Item.ColumnBreadth - 1)];
    } else {
        var ElementCoordInItem = O.getElementCoord(Ele)[S.AXIS.L];
        if(S.SLD == "rtl" && S.SLA == "horizontal") {
            ElementCoordInItem = Item.HTML.offsetWidth - ElementCoordInItem - Ele.offsetWidth;
        }
        var NearestPage = Item.Pages[0];
        for(var l = Item.Pages.length, i = 0; i < l; i++) {
            ElementCoordInItem -= Item.Pages[i]["offset" + S.SIZE.L];
            if(ElementCoordInItem <= 0) {
                NearestPage = Item.Pages[i];
                break;
            }
        }
    }
    return NearestPage;
};

R.focusOn.getScrollTarget = function(FocusPoint) {
    var ScrollTarget = { Frame: R.Main, X: 0, Y: 0 };
    ScrollTarget[S.AXIS.L] = FocusPoint;
    return ScrollTarget;
};


R.selectTextLocation = function(Destination) {
    if(typeof Destination.TextNodeIndex != "number") return;
    var DestinationNode = Destination.Element.childNodes[Destination.TextNodeIndex];
    if(!DestinationNode || !DestinationNode.textContent) return;
    var Sides = { Start: { Node: DestinationNode, Index: 0 }, End: { Node: DestinationNode, Index: DestinationNode.textContent.length } };
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
    var CurrentEdge = "", Side = "";
    if(Par.Distance > 0) CurrentEdge = "EndPage",   Side = "before";
    else                 CurrentEdge = "StartPage", Side = "after";
    R.getCurrent();
    var CurrentPage = R.Current.Pages[CurrentEdge];
    var ToFocus = (
        R.Columned ||
        S.BRL == "pre-paginated" ||
        CurrentPage.Item.PrePaginated ||
        CurrentPage.Item.Outsourcing ||
        CurrentPage.Item.Pages.length == 1 ||
        (Par.Distance < 0 && CurrentPage.PageIndexInItem == 0) ||
        (Par.Distance > 0 && CurrentPage.PageIndexInItem == CurrentPage.Item.Pages.length - 1)
    );
    var callback = Par.callback;
    Par.callback = function(Par) {
        if(typeof callback == "function") callback(Par);
        E.dispatch("bibi:moved-by", Par);
    };
    if(!ToFocus) {
        E.dispatch("bibi:commands:scroll-by", Par);
    } else {
        var CurrentPageStatus = R.Current.Pages[CurrentEdge + "Status"];
        var CurrentPageRatio  = R.Current.Pages[CurrentEdge + "Ratio"];
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
        var DestinationPageIndex = CurrentPage.PageIndex + Par.Distance;
             if(DestinationPageIndex <                  0) DestinationPageIndex = 0;
        else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1;
        var DestinationPage = R.Pages[DestinationPageIndex];
        if(S.BRL == "pre-paginated" && DestinationPage.Item.SpreadPair) {
            if(S.SLA == "horizontal" && R.Stage[S.SIZE.L] > DestinationPage.Spread["offset" + S.SIZE.L]) {
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
    var ScrollTarget = {
        Frame: R.Main,
        X: 0, Y: 0
    };
    var CurrentScrollCoord = sML.Coord.getScrollCoord(R.Main);
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
    var ElementSelector = "", InE = BibitoString.split("-"), ItemIndexInAll = parseInt(InE[0]) - 1, ElementIndex = InE[1] ? InE[1] : null;
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


I = {}; // Bibi.UserInterfaces


I.initialize = function() {

    I.createNotifier();
    I.createVeil();

    E.bind("bibi:readied", function() {
        I.createPanel();
        I.createMenu();
        I.createHelp();
        I.createPoweredBy();
    });

    E.bind("bibi:prepared", function() {
        I.createNombre();
        I.createSlider();
        I.createArrows();
        I.createKeyListener();
        I.createSwiper();
        I.createSpinner();
    });

};


I.note = function(Msg, Time, ErrorOccured) {
    clearTimeout(I.note.Timer);
    if(!Msg) I.note.Time = 0;
    else     I.note.Time = (typeof Time == "number") ? Time : (O.Busy ? 9999 : 2222);
    if(I.Notifier) {
        I.Notifier.Board.innerHTML = '<p' + (ErrorOccured ? ' class="error"' : '') + '>' + Msg + '</p>';
        sML.addClass(O.HTML, "notifier-shown");
        I.note.Timer = setTimeout(function() { sML.removeClass(O.HTML, "notifier-shown"); }, I.note.Time);
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
            sML.addClass(O.HTML, "veil-opened");
            sML.removeClass(this, "closed");
        },
        onclosed: function() {
            sML.addClass(this, "closed");
            sML.removeClass(O.HTML, "veil-opened");
        }
    });

    I.Veil.open();

    I.Veil.Cover = I.Veil.appendChild(sML.create("div", { id: "bibi-veil-cover" }));
    I.Veil.Cover.Info = I.Veil.Cover.appendChild(
        sML.create("p", { id: "bibi-veil-cover-info" })
    );

    var PlayButtonTitle = (O.Mobile ? 'Tap' : 'Click') + ' to Open';
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


I.createPanel = function() {

    I.Panel = O.Body.appendChild(sML.create("div", { id: "bibi-panel" }));
    I.setToggleAction(I.Panel, {
        onopened: function(Opt) {
            sML.addClass(O.HTML, "panel-opened");
            E.dispatch("bibi:opened-panel");
        },
        onclosed: function(Opt) {
            sML.removeClass(O.HTML, "panel-opened");
            E.dispatch("bibi:closed-panel");
        }
    });
    E.add("bibi:commands:open-panel",   function(Opt) { I.Panel.open(Opt); });
    E.add("bibi:commands:close-panel",  function(Opt) { I.Panel.close(Opt); });
    E.add("bibi:commands:toggle-panel", function(Opt) { I.Panel.toggle(Opt); });
    I.Panel.Labels = {
        default: { default: "Opoen this Index", ja: "この目次を開く" },
        active: { default: "Close this Index", ja: "この目次を閉じる" }
    };
    I.setFeedback(I.Panel, { StopPropagation: true });
    I.Panel.addTapEventListener("tapped", function() { E.dispatch("bibi:commands:toggle-panel"); });

    // Optimize to Scrollbar Size
    sML.appendStyleRule("html.page-rtl div#bibi-panel:after", "bottom: " + (O.Scrollbars.Height) + "px;");

    // Book Info
    I.Panel.BookInfo = I.Panel.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo" })
    );
    I.Panel.BookInfo.Box = I.Panel.BookInfo.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-box" })
    );
    I.Panel.BookInfo.Navigation = I.Panel.BookInfo.Box.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-navigation" })
    );
    I.Panel.BookInfo.Cover = I.Panel.BookInfo.Box.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-cover" })
    );
    I.Panel.BookInfo.Cover.Info = I.Panel.BookInfo.Cover.appendChild(
        sML.create("p", { id: "bibi-panel-bookinfo-cover-info" })
    );

    I.SubPanels = [];
    I.createPanel.createShade();

    E.dispatch("bibi:created-panel");

};


I.createPanel.createShade = function() {

    I.Shade = O.Body.appendChild(
        sML.create("div", { id: "bibi-shade",
            open: function() {
                sML.addClass(O.HTML, "shade-opened");
                clearTimeout(I.Timer_openShade);
                clearTimeout(I.Timer_closeShade);
                I.Timer_openShade = setTimeout(function() { sML.addClass(O.HTML, "shade-visible"); }, 0);
            },
            close: function() {
                sML.removeClass(O.HTML, "shade-visible");
                clearTimeout(I.Timer_openShade);
                clearTimeout(I.Timer_closeShade);
                I.Timer_closeShade = setTimeout(function() { sML.removeClass(O.HTML, "shade-opened"); }, 150);
            }
        })
    );

    I.observeTap(I.Shade, { StopPropagation: true });

    //I.Shade.addTapEventListener("tap", R.ontap);

    I.Shade.addTapEventListener("tapped", function() {
        I.SubPanels.forEach(function(SubPanel) {
            SubPanel.close();
        });
        I.Panel.close();
    });

};


I.createMenu = function() {

    // Menus
    I.Menu = O.Body.appendChild(sML.create("div", { id: "bibi-menu", on: { "click": function(Eve) { Eve.stopPropagation(); } } }));
    I.setHoverActions(I.Menu);
    I.setToggleAction(I.Menu, {
        onopened: function() {
            sML.addClass(O.HTML, "menu-opened");
            E.dispatch("bibi:opened-menu");
        },
        onclosed: function() {
            sML.removeClass(O.HTML, "menu-opened");
            E.dispatch("bibi:closed-menu");
        }
    });
    E.add("bibi:closed-slider",        function(   ) { I.Menu.close(); });
    E.add("bibi:commands:open-menu",   function(Opt) { I.Menu.open(Opt); });
    E.add("bibi:commands:close-menu",  function(Opt) { I.Menu.close(Opt); });
    E.add("bibi:commands:toggle-menu", function(Opt) { I.Menu.toggle(Opt); });
    E.add("bibi:scrolls", function() {
        clearTimeout(I.Menu.Timer_cool);
        if(!I.Menu.Hot) sML.addClass(I.Menu, "hot");
        I.Menu.Hot = true;
        I.Menu.Timer_cool = setTimeout(function() {
            I.Menu.Hot = false;
            sML.removeClass(I.Menu, "hot");
        }, 1234);
    });
    if(!O.Mobile) {
        E.add("bibi:moved-pointer", function(Eve) {
            var BibiEvent = O.getBibiEvent(Eve);
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
    E.add("bibi:tapped", function(Eve) {
        var BibiEvent = O.getBibiEvent(Eve);
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
            case "ttb": return (BibiEvent.Division.Y == "middle") ? E.dispatch("bibi:commands:toggle-menu") : false;
            default   : return (BibiEvent.Division.X == "center") ? E.dispatch("bibi:commands:toggle-menu") : false;
        }
    });
    I.Menu.L = I.Menu.appendChild(sML.create("div", { id: "bibi-menu-l" }));
    I.Menu.R = I.Menu.appendChild(sML.create("div", { id: "bibi-menu-r" }));
    //I.Menu.open();

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
        "html.view-vertical div#bibi-menu"
    ].join(", "), "width: calc(100% - " + (O.Scrollbars.Width) + "px);");
    sML.appendStyleRule([
        "html.view-vertical.panel-opened div#bibi-menu",
        "html.view-vertical.subpanel-opened div#bibi-menu"
    ].join(", "), "width: 100%; padding-right: " + (O.Scrollbars.Width) + "px;");

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
    I.PanelSwitch = I.createButtonGroup({ Area: I.Menu.L, Sticky: true }).addButton({
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
    E.add("bibi:opened-panel",  function() { I.setUIState(I.PanelSwitch, "active"); });
    E.add("bibi:closed-panel", function() { I.setUIState(I.PanelSwitch, ""); });
    E.add("bibi:started", function() {
        sML.style(I.PanelSwitch, { display: "block" });
    });

};


I.createMenu.createSettingMenu = function() {

    I.Menu.Config = {};

    // Button
    I.Menu.Config.Button = I.createButtonGroup({ Area: I.Menu.R, Sticky: true }).addButton({
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

    if(I.createMenu.SettingMenuComponents.includes("ViewModeButtons")                                                                   ) I.createMenu.createSettingMenu.createViewModeSection();
    if(I.createMenu.SettingMenuComponents.includes("NewWindowButton") || I.createMenu.SettingMenuComponents.includes("FullscreenButton")) I.createMenu.createSettingMenu.createWindowSection();
    if(I.createMenu.SettingMenuComponents.includes("WebsiteLink")     || I.createMenu.SettingMenuComponents.includes("BibiWebsiteLink") ) I.createMenu.createSettingMenu.createLinkageSection();

};


I.createMenu.createSettingMenu.createViewModeSection = function() {

    // Shapes
    var Shape = {};
    Shape.Item         = '<span class="bibi-shape bibi-shape-item"></span>';
    Shape.Spread       = '<span class="bibi-shape bibi-shape-spread">' + Shape.Item + Shape.Item + '</span>';

    // Icons
    var Icon = {};
    Icon["paged"]      = '<span class="bibi-icon bibi-icon-view-paged"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';
    Icon["horizontal"] = '<span class="bibi-icon bibi-icon-view-horizontal"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';
    Icon["vertical"]   = '<span class="bibi-icon bibi-icon-view-vertical"><span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span></span>';

    var changeView = function() {
        R.changeView(this.Value);
    };

    I.Menu.Config.SubPanel.ViewModeSection = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Choose Layout', ja: 'レイアウトを選択' } },
        ButtonGroup: {
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
        }
    });

    E.add("bibi:updated-settings", function() {
        I.Menu.Config.SubPanel.ViewModeSection.ButtonGroup.Buttons.forEach(function(Button) {
            I.setUIState(Button, (Button.Value == S.RVM ? "active" : "default"));
        });
    });

};


I.createMenu.createSettingMenu.createWindowSection = function() {

    var Buttons = [];

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
            var Button = this;
            if(!O.FullscreenElement.Fullscreen) {
                sML.requestFullscreen(O.FullscreenElement);
            } else {
                sML.exitFullscreen(O.FullscreenDocument);
            }
            if(!O.FullscreenElement.Fullscreen) {
                O.FullscreenElement.Fullscreen = true;
                E.dispatch("bibi:requested-fullscreen");
                sML.addClass(O.HTML, "fullscreen");
            } else {
                O.FullscreenElement.Fullscreen = false;
                E.dispatch("bibi:exited-fullscreen");
                sML.removeClass(O.HTML, "fullscreen");
            }
        }
    });

    I.Menu.Config.SubPanel.WindowSection = I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Window Operation', ja: 'ウィンドウ操作' } },
        ButtonGroup: {
            Buttons: Buttons
        }
    });

};


I.createMenu.createSettingMenu.createLinkageSection = function() {

    var Buttons = [];

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
        href: Bibi.SiteHref,
        target: "_blank"
    });

    I.Menu.Config.SubPanel.addSection({
        Labels: { default: { default: 'Link' + (Buttons.length > 1 ? 's' : ''), ja: 'リンク' } },
        ButtonGroup: {
            Buttons: Buttons
        }
    });

};


I.createButtonGroup = function(Par) { // classifies ButtonGroup
    if(!Par || typeof Par != "object" || !Par.Area || !Par.Area.tagName) return null;
    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;
    var ClassName = ["bibi-buttongroup"];
    if(Par.Tiled) ClassName.push("bibi-tiledbuttongroup");
    if(Par.Sticky) ClassName.push("sticky");
    Par.className = ClassName.join(" ");
    Par.IsButtonGroup = true;
    var ButtonGroup = Par.Area.appendChild(sML.create("ul", Par));
    ButtonGroup.addButton = I.createButtonGroup.addButton;
    if(ButtonGroup.Buttons instanceof Array) {
        ButtonGroup.Buttons.forEach(function(Button, i) {
            ButtonGroup.addButton(Button, i);
        });
    }
    return ButtonGroup;
};


I.createButtonGroup.addButton = function(Par, i) { // classifies Button
    // i: optional
    if(!Par || typeof Par != "object") return null;
    if(!Par.ButtonGroup) Par.ButtonGroup = this;
    if(!Par.ButtonGroup.IsButtonGroup) return null;
    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;
    Par.Type = (typeof Par.Type == "string" && /^(normal|toggle|radio|link)$/.test(Par.Type)) ? Par.Type : "normal";
    Par.className = "bibi-button bibi-button-" + Par.Type + (Par.className ? " " + Par.className : "");
    if(typeof Par.Icon != "undefined" && !Par.Icon.tagName) {
        if(typeof Par.Icon == "string" && Par.Icon) {
            Par.Icon = sML.hatch(Par.Icon);
        } else {
            delete Par.Icon;
        }
    }
    Par.IsBibiButton = true;
    var Button = Par.ButtonGroup.appendChild(
        sML.create("li", { className: "bibi-buttonbox bibi-buttonbox-" + Par.Type })
    ).appendChild(
        sML.create((typeof Par.href == "string" ? "a" : "span"), Par)
    );
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
    Button.ButtonGroup.Busy = false;
    Button.Busy = false;
    Button.isAvailable = function() {
        return (!Button.Busy && !Button.ButtonGroup.Busy);
    };
    if(typeof Button.execute == "function") Button.action = Button.execute; // for back compatibility
    if(typeof Button.action == "function") {
        Button.addTapEventListener("tapped", function(Eve) {
            if(!Button.isAvailable()) return false;
            Button.action.apply(Button, arguments);
        });
    }
    if(!(Button.ButtonGroup.Buttons instanceof Array)) Button.ButtonGroup.Buttons = [];
    if(typeof i == "number") Button.ButtonGroup.Buttons[i] = Button;
    else                     Button.ButtonGroup.Buttons.push(Button);
    return Button;
};


I.createSubPanel = function(Par) { // classifies SubPanel

    if(!Par) Par = {};
    if(typeof Par.className != "string" || !Par.className) delete Par.className;
    if(typeof Par.id        != "string" || !Par.id)        delete Par.id;
    Par.className = "bibi-subpanel" + (Par.className ? " " + Par.className : "");
    Par.Sections = [];

    var SubPanel = O.Body.appendChild(sML.create("div", Par));
    SubPanel.addEventListener(O["pointerdown"], function(Eve) { Eve.stopPropagation(); });
    SubPanel.addEventListener(O["pointerup"],   function(Eve) { Eve.stopPropagation(); });

    I.setToggleAction(SubPanel, {
        onopened: function(Opt) {
            I.SubPanels.forEach(function(SP) {
                if(SP == SubPanel) return;
                SP.close({ ForAnotherSubPanel: true });
            });
            sML.addClass(this, "opened");
            sML.addClass(O.HTML, "subpanel-opened");
            I.Shade.open();
            if(SubPanel.Opener) {
                SubPanel.Bit.adjust(SubPanel.Opener);
                I.setUIState(SubPanel.Opener, "active");
            }
            if(Par.onopened) Par.onopened.apply(SubPanel, arguments);
        },
        onclosed: function(Opt) {
            sML.removeClass(this, "opened");
            if(!Opt || !Opt.ForAnotherSubPanel) {
                sML.removeClass(O.HTML, "subpanel-opened");
                I.Shade.close();
            }
            if(SubPanel.Opener) {
                I.setUIState(SubPanel.Opener, "default");
            }
            if(Par.onclosed) Par.onclosed.apply(SubPanel, arguments);
        }
    });
    if(SubPanel.Opener) SubPanel.Opener.addTapEventListener("tapped", function() { SubPanel.toggle(); });
    E.add("bibi:opened-panel",  function() { SubPanel.close(); });
    E.add("bibi:closed-panel", function() { SubPanel.close(); });

    SubPanel.Bit = SubPanel.appendChild(sML.create("span", { className: "bibi-subpanel-bit",
        SubPanel: SubPanel,
        adjust: function(Ele) {
            if(!Ele) return;
            var Center = O.getElementCoord(Ele).X + Ele.offsetWidth / 2 - O.getElementCoord(this.SubPanel).X;
            sML.style(this.SubPanel, { transformOrigin: Center + "px 0" });
            sML.style(this.SubPanel.Bit, { left: Center + "px" });
        }
    }));
    I.SubPanels.push(SubPanel);

    SubPanel.addSection = I.createSubPanel.addSection;

    return SubPanel;

};


I.createSubPanel.addSection = function(Par) { // classifies of Subpanel / classify SubPanelSection
    if(!Par) Par = {};
    Par.className = "bibi-subpanel-section";
    var SubPanelSection = sML.create("div", Par);
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
    // PGroup
    if(SubPanelSection.Notes) {
        var PGroup = SubPanelSection.appendChild(
            sML.create("div",  { className: "bibi-pgroup" })
        );
        SubPanelSection.Notes.forEach(function(Note) {
            Note = I.distillLabels(Note);
            PGroup.appendChild(
                sML.create("p",    { className: "bibi-p", innerHTML: Note["default"][O.Language] })
            );
        });
    }
    // ButtonGroup
    SubPanelSection.addButtonGroup = I.createSubPanel.addSection.addButtonGroup;
    if(SubPanelSection.ButtonGroup) SubPanelSection.addButtonGroup(SubPanelSection.ButtonGroup);
    this.appendChild(SubPanelSection);
    this.Sections.push(SubPanelSection);
    return SubPanelSection;
};

I.createSubPanel.addSection.addButtonGroup = function(Par) {
    if(!Par) return;
    Par.Area = this;
    this.ButtonGroup = I.createButtonGroup(Par);
    return this.ButtonGroup;
};


I.createHelp = function() {

    I.Help = O.Body.appendChild(sML.create("div", { id: "bibi-help" }));
    I.Help.Message = I.Help.appendChild(sML.create("p", { className: "hidden", id: "bibi-help-message" }));

    I.Help.show = function(HelpText) {
        clearTimeout(I.Help.Timer_deactivate1);
        clearTimeout(I.Help.Timer_deactivate2);
        sML.addClass(I.Help, "active");
        I.Help.Message.innerHTML = HelpText;
        setTimeout(function() {
            sML.addClass(I.Help, "shown");
        }, 0);
    };
    I.Help.hide = function() {
        I.Help.Timer_deactivate1 = setTimeout(function() {
            sML.removeClass(I.Help, "shown");
            I.Help.Timer_deactivate2 = setTimeout(function() { 
                sML.removeClass(I.Help, "active");
            }, 200);
        }, 100);
    };

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
        "html.view-paged div#bibi-help",
        "html.view-horizontal div#bibi-help",
        "html.page-rtl.panel-opened div#bibi-help"
    ].join(", "), "bottom: " + (O.Scrollbars.Height) + "px;");

};


I.createPoweredBy = function() {

    I.PoweredBy = O.Body.appendChild(sML.create("div", { id: "bibi-poweredby", innerHTML: [
        '<p>',
            '<a href="' + Bibi.SiteHref + '" target="_blank" title="BiB/i | Official Website">',
                '<span>BiB/i</span>',
                '<img class="bibi-logo-white" alt="" src="' + O.RootPath + 'res/images/bibi-logo_white.png" />',
                '<img class="bibi-logo-black" alt="" src="' + O.RootPath + 'res/images/bibi-logo_black.png" />',
            '</a>',
        '</p>'
    ].join("") }));

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
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
            sML.addClass(I.Nombre, "active");
            I.Nombre.Timer_hot = setTimeout(function() { sML.addClass(I.Nombre, "hot"); }, 10);
        },
        hide: function() {
            clearTimeout(I.Nombre.Timer_hot);
            clearTimeout(I.Nombre.Timer_vanish);
            sML.removeClass(I.Nombre, "hot");
            I.Nombre.Timer_vanish = setTimeout(function() { sML.removeClass(I.Nombre, "active"); }, 255);
        },
        progress: function(PageInfo) {
            clearTimeout(I.Nombre.Timer_hide);
            if(!PageInfo || !PageInfo.Pages) PageInfo = R.getCurrent();
            if(typeof PageInfo.Percent != "number") PageInfo.Percent = Math.floor((PageInfo.Pages.EndPage.PageIndex + 1) / R.Pages.length * 100);
            if(!R.Current.Page) return;
            I.Nombre.Current.innerHTML = (function() {
                var PageNumber = PageInfo.Pages.StartPage.PageIndex + 1;
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
    if(S["use-slider"]) {
        sML.appendStyleRule("html.view-paged div#bibi-nombre",      "bottom: " + (O.Scrollbars.Height + 2) + "px;");
    }
    if(true) {
        sML.appendStyleRule("html.view-horizontal div#bibi-nombre", "bottom: " + (O.Scrollbars.Height + 2) + "px;");
        sML.appendStyleRule("html.view-vertical div#bibi-nombre",    "right: " + (O.Scrollbars.Height + 2) + "px;");
    }

    E.dispatch("bibi:created-nombre");

};


I.createSlider = function() {

    if(!S["use-slider"]) return;

    I.Slider = O.Body.appendChild(
        sML.create("div", { id: "bibi-slider",
            reset: function() {
                     if(S.ARD == "ttb") I.Slider.SIZE = { L: "Height", l: "height" }, I.Slider.AXIS = { b: "top",   OB: "Top",  ob: "top",  XY: "Y" };
                else if(S.ARD == "rtl") I.Slider.SIZE = { L: "Width",  l: "width"  }, I.Slider.AXIS = { b: "right", OB: "Left", ob: "left", XY: "X" };
                else                    I.Slider.SIZE = { L: "Width",  l: "width"  }, I.Slider.AXIS = { b: "left",  OB: "Left", ob: "left", XY: "X" };
                I.Slider.Spreads.innerHTML = "";
                I.Slider.Pages.innerHTML = "";
                R.Spreads.forEach(function(Spread, i) {
                    var SpreadBit = I.Slider.Spreads.appendChild(sML.create("div", { id: "bibi-slider-spreadbit-" + (i + 1) }));
                    SpreadBit.style[I.Slider.SIZE.l] = (  1 / R.Pages.length * Spread.Pages.length * 100) + "%";
                    SpreadBit.style[I.Slider.AXIS.b] = (100 / R.Pages.length * Spread.Pages[0].PageIndex) + "%";
                });
                R.Pages.forEach(function(Page, i) {
                    var PageBit = I.Slider.Pages.appendChild(sML.create("div", { id: "bibi-slider-pagebit-" + (i + 1) }));
                    PageBit.style[I.Slider.SIZE.l] = (  1 / R.Pages.length * 100) + "%";
                    PageBit.style[I.Slider.AXIS.b] = (100 / R.Pages.length *   i) + "%";
                    PageBit.PageNumber = i + 1;
                    if(I.Nombre) {
                        PageBit.addEventListener(O["pointerover"], function() {
                            if(I.Slider.Sliding) return;
                            clearTimeout(I.Slider.Timer_PageBitPointerOut);
                            I.Nombre.progress({ Pages: { StartPage: R.Pages[i], EndPage: R.Pages[i] } });
                        });
                        PageBit.addEventListener(O["pointerout"], function() {
                            if(I.Slider.Sliding) return;
                            I.Slider.Timer_PageBitPointerOut = setTimeout(function() {
                                clearTimeout(I.Nombre.Timer_hide);
                                I.Nombre.hide();
                            }, 200);
                        });
                    }
                    PageBit.Labels = { default: { default: "Slider Page" } };
                    I.setFeedback(PageBit);
                });
            },
            progress: function() {
                if(I.Slider.Sliding) return;
                var Current = I.Slider.Current;
                Current.style.top = Current.style.right = Current.style.bottom = Current.style.left = Current.style.width = Current.style.height = "";
                Current.className = (R.Current.Pages.length > 1) ? "two-pages" : "";
                if(S.RVM == "paged" || I.Slider.UIState == "active") {
                    Current.style[I.Slider.SIZE.l] = (100 / R.Pages.length) * R.Current.Pages.length + "%";
                    Current.style[I.Slider.AXIS.b] = (R.Current.Pages.StartPage.PageIndex / R.Pages.length * 100) + "%";
                } else {
                    Current.style[I.Slider.SIZE.l]  = (R.Main["offset" + I.Slider.SIZE.L]  / R.Main["scroll" + I.Slider.SIZE.L] * 100) + "%";
                    Current.style[I.Slider.AXIS.ob] = (R.Main["scroll" + I.Slider.AXIS.OB] / R.Main["scroll" + I.Slider.SIZE.L] * 100) + "%";
                }
            },
            flip: function() {
                var SlidedDistance = I.Slider.Status.CurrentCoord - I.Slider.Status.StartCoord;
                var TargetPageIndex = I.Slider.Status.StartPageIndex + Math.round(R.Pages.length * (SlidedDistance / I.Slider["offset" + I.Slider.SIZE.L] * (S.ARD != "ttb" && S.PPD == "rtl" ? -1 : 1)));
                     if(TargetPageIndex < 0)                  TargetPageIndex = 0;
                else if(TargetPageIndex > R.Pages.length - 1) TargetPageIndex = R.Pages.length - 1;
                var TargetPage = R.Pages[TargetPageIndex];
                if(TargetPage != R.Current.Pages.StartPage && TargetPage != R.Current.Pages.EndPage) {
                    E.dispatch("bibi:commands:focus-on", { Destination: TargetPage, Duration: 0 });
                }
                if(I.Slider.Sliding) {
                    sML.style(I.Slider.Current, { transform: "translate" + I.Slider.AXIS.XY + "(" + SlidedDistance + "px)" });
                } else {
                    sML.style(I.Slider.Current, { transform: "" });
                    I.Slider.progress();
                }
            },
            slide: function(Eve) {
                var SliderEdges = [
                    I.Slider["offset" + I.Slider.AXIS.OB],
                    I.Slider["offset" + I.Slider.AXIS.OB] + I.Slider["offset" + I.Slider.SIZE.L]
                ];
                var CurrentCoord = O.getBibiEventCoord(Eve)[I.Slider.AXIS.XY];
                     if(CurrentCoord < SliderEdges[0]) CurrentCoord = SliderEdges[0];
                else if(CurrentCoord > SliderEdges[1]) CurrentCoord = SliderEdges[1];
                I.Slider.Status.CurrentCoord = CurrentCoord;
                I.Slider.flip();
            },
            startSliding: function(Eve) {
                if(!Eve.target || !Eve.target.id || !/^bibi-slider-/.test(Eve.target.id)) return;
                Eve.preventDefault();
                I.Slider.Sliding = true;
                I.Slider.Status = {
                    StartPageIndex: R.Current.Pages.StartPage.PageIndex,
                    StartCoord: (Eve.target == I.Slider.Current) ?
                        O.getBibiEventCoord(Eve)[I.Slider.AXIS.XY] :
                        I.Slider["offset" + I.Slider.AXIS.OB] + I.Slider.Current["offset" + I.Slider.AXIS.OB] + I.Slider.Current["offset" + I.Slider.SIZE.L]  / 2
                };
                I.Slider.Status.CurrentCoord = I.Slider.Status.StartCoord;
                clearTimeout(I.Slider.Timer_endSliding);
                sML.addClass(O.HTML, "slider-sliding");
                E.add("bibi:moved-pointer", I.Slider.slide);
            },
            endSliding: function(Eve) {
                if(!I.Slider.Sliding) return;
                I.Slider.Sliding = false;
                E.remove("bibi:moved-pointer", I.Slider.slide);
                I.Slider.Status.CurrentCoord = O.getBibiEventCoord(Eve)[I.Slider.AXIS.XY];
                I.Slider.flip();
                I.Slider.Timer_endSliding = setTimeout(function() { sML.removeClass(O.HTML, "slider-sliding"); }, 125);
            },
            activate: function() {
                if(I.Nombre) {
                    I.Slider.Current.addEventListener(O["pointerover"], I.Nombre.show);
                    I.Slider.Current.addEventListener(O["pointerout"],  I.Nombre.hide);
                }
                O.HTML.addEventListener(O["pointerdown"], I.Slider.startSliding);
                R.Items.concat(O).forEach(function(Item) { Item.HTML.addEventListener(O["pointerup"], I.Slider.endSliding); });
                E.add("bibi:scrolls", I.Slider.progress);
                I.Slider.progress();
            },
            deactivate: function() {
                if(I.Nombre) {
                    I.Slider.Current.removeEventListener(O["pointerover"], I.Nombre.show);
                    I.Slider.Current.removeEventListener(O["pointerout"],  I.Nombre.hide);
                }
                O.HTML.removeEventListener(O["pointerdown"], I.Slider.startSliding);
                R.Items.concat(O).forEach(function(Item) { Item.HTML.removeEventListener(O["pointerup"], I.Slider.endSliding); });
                E.remove("bibi:scrolls", I.Slider.progress);
            }
        })
    );
    I.Slider.Spreads      = I.Slider.appendChild(sML.create("div", { id: "bibi-slider-spreads" }));
    I.Slider.Pages        = I.Slider.appendChild(sML.create("div", { id: "bibi-slider-pages" }));
    I.Slider.CurrentPages = I.Slider.appendChild(sML.create("div", { id: "bibi-slider-currentpages" }));
    I.Slider.Current      = I.Slider.CurrentPages.appendChild(sML.create("div", { id: "bibi-slider-currentpagebits" }));
    I.Slider.Current.Labels = { default: { default: "Slider Current" } };
    I.setFeedback(I.Slider.Current);
    I.setToggleAction(I.Slider, {
        onopened: function() {
            I.Slider.progress();
            sML.addClass(O.HTML, "slider-opened");
            //I.Shade.open(); // bad
            E.dispatch("bibi:opened-slider");
        },
        onclosed: function() {
            I.Slider.progress();
            sML.removeClass(O.HTML, "slider-opened");
            //I.Shade.close(); // bad
            E.dispatch("bibi:closed-slider");
        }
    });
    E.add("bibi:commands:open-slider",   function(Opt) { I.Slider.open(Opt); });
    E.add("bibi:commands:close-slider",  function(Opt) { I.Slider.close(Opt); });
    E.add("bibi:commands:toggle-slider", function(Opt) { I.Slider.toggle(Opt); });
    E.add("bibi:tapped", function(Eve) {
        if(!L.Opened) return;
        var BibiEvent = O.getBibiEvent(Eve);
        if(BibiEvent.Target.tagName) {
            if(/bibi-slider/.test(BibiEvent.Target.id)) return false;
            if(O.isAnchorContent(BibiEvent.Target)) return false;
            if(S.RVM == "horizontal" && BibiEvent.Coord.Y > window.innerHeight - O.Scrollbars.Height) return false;
        }
        switch(S.ARD) {
            case "ttb": return (BibiEvent.Division.Y == "middle") ? E.dispatch("bibi:commands:toggle-slider") : false;
            default   : return (BibiEvent.Division.X == "center") ? E.dispatch("bibi:commands:toggle-slider") : false;
        }
    });
    E.add("bibi:opened",   I.Slider.activate);
    //E.add("bibi:opened",   I.Slider.open);
    E.add("bibi:laid-out", I.Slider.reset);
    E.add("bibi:closed-panel", I.Slider.close);

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
        "html.view-paged div#bibi-slider",
        "html.view-horizontal div#bibi-slider"
    ].join(", "), "height: " + (O.Scrollbars.Height) + "px;");
    sML.appendStyleRule([
        "html.view-vertical div#bibi-slider"
    ].join(", "), "width: " + (O.Scrollbars.Width) + "px;");

    E.dispatch("bibi:created-slider");

};


I.createArrows = function() {

    if(!S["use-arrows"]) return;

    I.Arrows = {
        update: function() {
            if(S.RVM == "vertical") {
                I.Arrows["top"] = I.Arrows.Back, I.Arrows["bottom"] = I.Arrows.Forward;
                I.Arrows["left"] = I.Arrows["right"] = undefined;
            } else {
                if(S.PPD == "ltr") I.Arrows["left"]  = I.Arrows.Back, I.Arrows["right"] = I.Arrows.Forward;
                else               I.Arrows["right"] = I.Arrows.Back, I.Arrows["left"]  = I.Arrows.Forward;
                I.Arrows["top"] = I.Arrows["bottom"] = undefined;
            }
        },
        navigate: function() {
            setTimeout(function() {
                R.getCurrent();
                [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                    if(Arrow.isAvailable()) sML.addClass(Arrow, "glowing");
                });
                setTimeout(function() {
                    [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                        sML.removeClass(Arrow, "glowing");
                    });
                }, 1234);
            }, 400);
        },
        check: function() {
            [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
                if(Arrow.isAvailable()) sML.replaceClass(Arrow, "unavailable",   "available");
                else                    sML.replaceClass(Arrow,   "available", "unavailable");
            });
        },
        areAvailable: function(BibiEvent) {
            if(!L.Opened) return false;
            if(I.Panel && I.Panel.UIState == "active") return false;
            if(I.Menu && BibiEvent.Coord.Y < I.Menu.offsetHeight * 1.5) return false;
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

    sML.addClass(O.HTML, "arrows-active");

    I.Arrows.Back = I.Arrows["back"] = R.Main.appendChild(
        sML.create("div", { id: "bibi-arrow-back",
            Distance: -1,
            Labels: {
                default: { default: 'Back', ja: '戻る' }
            },
            isAvailable: function() {
                return (L.Opened && (R.Current.Pages.StartPage != R.Pages[0] || R.Current.Pages.StartPageRatio != 100));
            }
        })
    );
    I.Arrows.Forward = I.Arrows["forward"] = R.Main.appendChild(
        sML.create("div", { id: "bibi-arrow-forward",
            Distance: +1,
            Labels: {
                default: { default: 'Forward', ja: '進む' }
            },
            isAvailable: function() {
                return (L.Opened && (R.Current.Pages.EndPage != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio != 100));
            }
        })
    );
    I.Arrows.Back.Pair = I.Arrows.Forward;
    I.Arrows.Forward.Pair = I.Arrows.Back;
    [I.Arrows.Back, I.Arrows.Forward].forEach(function(Arrow) {
        I.setFeedback(Arrow);
        Arrow.addTapEventListener("tap", function(Eve) {
            if(L.Opened) E.dispatch("bibi:commands:move-by", { Distance: Arrow.Distance });
        });
        Arrow.showHelp = Arrow.hideHelp = function() {};
    });

    if(!O.Mobile) {
        E.add("bibi:moved-pointer", function(Eve) { // try hovering
            if(!L.Opened) return false;
            var BibiEvent = O.getBibiEvent(Eve);
            if(I.Arrows.areAvailable(BibiEvent)) {
                var Dir = (S.RVM == "vertical") ? BibiEvent.Division.Y : BibiEvent.Division.X;
                if(I.Arrows[Dir] && I.Arrows[Dir].isAvailable()) {
                    E.dispatch("bibi:hovers",   Eve, I.Arrows[Dir]);
                    E.dispatch("bibi:unhovers", Eve, I.Arrows[Dir].Pair);
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
                sML.each(Item.Body.querySelectorAll("img"), function(){ this.addEventListener(O["pointerdown"], O.preventDefault); });
            });
        });
    }

    E.add("bibi:tapped", function(Eve) { // try moving
        if(!L.Opened) return false;
        var BibiEvent = O.getBibiEvent(Eve);
        if(/^bibi-arrow-/.test(BibiEvent.Target.id)) return false;
        if(!I.Arrows.areAvailable(BibiEvent)) return false;
        var Dir = (S.RVM == "vertical") ? BibiEvent.Division.Y : BibiEvent.Division.X;
        if(I.Arrows[Dir] && I.Arrows[Dir].isAvailable()) {
            //E.dispatch("bibi:commands:move-by", { Distance: I.Arrows[Dir].Distance });
            E.dispatch("bibi:taps",   Eve, I.Arrows[Dir]);
            E.dispatch("bibi:tapped", Eve, I.Arrows[Dir]);
        }
    });

    E.add("bibi:commands:move-by", function(Par) { // indicate direction
        if(!L.Opened) return false;
        if(!Par || !Par.Distance) return false;
        var Dir = "";
        switch(Par.Distance) {
            case -1 : Dir = "back";    break;
            case  1 : Dir = "forward"; break;
        }
        if(Dir && I.Arrows[Dir]) return E.dispatch("bibi:tapped", null, I.Arrows[Dir]);
    });

    E.add("bibi:loaded-item", function(Item) {
        /*
        sML.appendStyleRule('html[data-bibi-cursor="left"]',   "cursor: w-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="right"]',  "cursor: e-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="top"]',    "cursor: n-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="bottom"]', "cursor: s-resize;", Item.contentDocument);
        */
        sML.appendStyleRule('html[data-bibi-cursor]', "cursor: pointer;", Item.contentDocument);
    });

    E.add("bibi:opened",           function()    { I.Arrows.update(); I.Arrows.check(); I.Arrows.navigate(); });
    E.add("bibi:updated-settings", function()    { I.Arrows.update(); });
    E.add("bibi:changed-view",     function()    { I.Arrows.navigate(); });
    E.add("bibi:scrolled",         function()    { I.Arrows.check(); });

    E.dispatch("bibi:created-arrows");

};


I.createKeyListener = function() {

    if(!S["use-keys"]) return;

    // Keys
    I.KeyListener = {
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
            var KeyName = I.KeyListener.KeyCodes[Eve.type][Eve.keyCode];
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
            return true;
        },
        onkeydown:  function(Eve) {
            if(!I.KeyListener.onEvent(Eve)) return false;
            E.dispatch("bibi:downs-key", Eve);
        },
        onkeyup:    function(Eve) {
            if(!I.KeyListener.onEvent(Eve)) return false;
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
            if(Eve.shiftKey) Eve.BibiKeyName = Eve.BibiKeyName.toUpperCase();
            var MovingParameter = I.KeyListener.MovingParameters[Eve.BibiKeyName];
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
    E.add("bibi:ups-key",          function(Eve) { I.KeyListener.tryMoving(Eve); });

    E.dispatch("bibi:created-keylistener");

};


I.createSwiper = function() {

    if(!S["use-swipe"]) return;

    I.Swiper = {
        update: function() {
            S.RVM == "paged" ? this.open() : this.close();
            return this.State;
        },
        activateElement: function(Ele) {
            Ele.addEventListener("touchstart", I.Swiper.ontouchstart);
            Ele.addEventListener("touchmove", I.Swiper.ontouchmove);
            Ele.addEventListener("touchend", I.Swiper.ontouchend);
            if(!O.Mobile) {
                Ele.addEventListener('wheel', R.onwheel);
                sML.each(Ele.querySelectorAll("img"), function(){ this.addEventListener(O["pointerdown"], O.preventDefault); });
            }
        },
        deactivateElement: function(Ele) {
            Ele.removeEventListener("touchstart", I.Swiper.ontouchstart);
            Ele.removeEventListener("touchmove", I.Swiper.ontouchmove);
            Ele.removeEventListener("touchend", I.Swiper.ontouchend);
            if(!O.Mobile) {
                Ele.removeEventListener('wheel', R.onwheel);
                sML.each(Ele.querySelectorAll("img"), function(){ this.removeEventListener(O["pointerdown"], O.preventDefault); });
            }
        },
        ontouchstart: function(Eve) {
            var EventCoord = O.getBibiEventCoord(Eve);
            I.Swiper.TouchStartedOn = { X: EventCoord.X, Y: EventCoord.Y, T: Eve.timeStamp };
        },
        ontouchmove: function(Eve) {
            if(Eve.touches.length == 1 && document.body.clientWidth / window.innerWidth <= 1) Eve.preventDefault();
        },
        ontouchend: function(Eve) {
            if(!I.Swiper.TouchStartedOn) return;
            if(document.body.clientWidth / window.innerWidth <= 1 && Eve.timeStamp - I.Swiper.TouchStartedOn.T <= 300) {
                var EventCoord = O.getBibiEventCoord(Eve);
                var VarX = EventCoord.X - I.Swiper.TouchStartedOn.X;
                var VarY = EventCoord.Y - I.Swiper.TouchStartedOn.Y;
                if(Math.sqrt(Math.pow(VarX, 2) + Math.pow(VarY, 2)) >= 10) {
                    var Deg = Math.atan2((VarY ? VarY * -1 : 0), VarX) * 180 / Math.PI;
                    var From = "", To = "";
                         if( 120 >= Deg && Deg >=   60) From = "bottom", To = "top";
                    else if(  30 >= Deg && Deg >=  -30) From = "left",   To = "right";
                    else if( -60 >= Deg && Deg >= -120) From = "top",    To = "bottom";
                    else if(-150 >= Deg || Deg >=  150) From = "right",  To = "left";
                    if(I.Arrows[From] && I.Arrows[From].isAvailable()) {
                        E.dispatch("bibi:commands:move-by", { Distance: I.Arrows[From].Distance });
                    }
                }
            }
            delete I.Swiper.TouchStartedOn;
        },
        onwheeled: function(Eve) {
            if(!Eve.BibiSwiperWheel) return;
            clearTimeout(I.Swiper.onwheeled.Timer_cooldown);
            I.Swiper.onwheeled.Timer_cooldown = setTimeout(function() { I.Swiper.onwheeled.hot = false; }, 248);
            if(!I.Swiper.onwheeled.hot) {
                I.Swiper.onwheeled.hot = true;
                E.dispatch("bibi:commands:move-by", { Distance: Eve.BibiSwiperWheel.Distance });
            }
        }/*,
        addButton: function() {
            I.Menu.Config.SubPanel.SwipeSection = I.Menu.Config.SubPanel.addSection({
                //Labels: { default: { default: 'Settings', ja: '操作設定' } }
                ButtonGroup: {
                    Buttons: [
                        {
                            Type: "toggle",
                            Labels: {
                                default: { default: 'Swipe', ja: 'スワイプ操作' },
                                active:  { default: 'Swipe', ja: 'スワイプ操作' }
                            },
                            Icon: '<span class="bibi-icon bibi-icon-toggle-swipe"></span>',
                            action: function() {
                                I.Swiper.toggle();
                                I.Panel.close();
                                I.Menu.close();
                            }
                        }
                    ]
                }
            });
            I.Swiper.Button = I.Menu.Config.SubPanel.SwipeSection.ButtonGroup.Buttons[0];
            E.add("bibi:activated-touch",   function() { I.setState(I.Swiper.Button, "active"); });
            E.add("bibi:deactivated-touch", function() { I.setState(I.Swiper.Button, ""); });
        }*/
    };

    I.setToggleAction(I.Swiper, {
        onopened: function() {
            sML.addClass(O.HTML, "swipe-active");
            if(!O.Mobile) E.add("bibi:wheeled", I.Swiper.onwheeled);
            I.Swiper.activateElement(R.Main);
            R.Items.forEach(function(Item) { I.Swiper.activateElement(Item.HTML); });
        },
        onclosed: function() {
            sML.removeClass(O.HTML, "swipe-active");
            if(!O.Mobile) E.remove("bibi:wheeled", I.Swiper.onwheeled);
            I.Swiper.deactivateElement(R.Main);
            R.Items.forEach(function(Item) { I.Swiper.deactivateElement(Item.HTML); });
        }
    });

    E.add("bibi:laid-out:for-the-first-time", function() {
        I.Swiper.update();
        E.add("bibi:updated-settings", function() { I.Swiper.update(); });
        //I.Swiper.addButton();
    });
    E.add("bibi:commands:activate-swipe",   function() { I.Swiper.open(); });
    E.add("bibi:commands:deactivate-swipe", function() { I.Swiper.close(); });
    E.add("bibi:commands:toggle-swipe",     function() { I.Swiper.toggle(); });

    E.dispatch("bibi:created-swiper");

};


I.createSpinner = function() {

    I.Spinner = O.Body.appendChild(sML.create("div", { id: "bibi-spinner" }));
    for(var i = 1; i <= 12; i++) I.Spinner.appendChild(document.createElement("span"));
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
    for(var State in Labels) Labels[State] = I.distillLabels.distillLanguage(Labels[State]);
    if(!Labels["default"])                      Labels["default"] = I.distillLabels.distillLanguage();
    if(!Labels["active"]  && Labels["default"]) Labels["active"] = Labels["default"];
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
    Ele.addEventListener(O["pointerover"], function(Eve) { E.dispatch("bibi:hovers",   Eve, Ele) });
    Ele.addEventListener(O["pointerout"],  function(Eve) { E.dispatch("bibi:unhovers", Eve, Ele) });
    return Ele;
};


I.setHoverActions = function(Ele) {
    E.add("bibi:hovers", function(Eve) {
        if(Ele.Hover) return Ele;
        if(Ele.isAvailable && !Ele.isAvailable(Eve)) return Ele;
        Ele.Hover = true;
        sML.addClass(Ele, "hover");
        if(Ele.showHelp) Ele.showHelp();
        return Ele;
    }, Ele);
    E.add("bibi:unhovers", function(Eve) {
        if(!Ele.Hover) return Ele;
        Ele.Hover = false;
        sML.removeClass(Ele, "hover");
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
        Ele.addEventListener(O["pointerdown"], function(Eve) {
            if(Opt.PreventDefault) Eve.preventDefault();
            if(Opt.StopPropagation) Eve.stopPropagation();
            clearTimeout(Ele.Timer_tap);
            Ele.TouchStart = { Time: new Date(), Event: Eve, Coord: O.getBibiEventCoord(Eve) };
            Ele.TouchEnd = undefined;
            Ele.Timer_tap = setTimeout(function() {
                Ele.TouchStart = undefined;
            }, 300);
        });
        Ele.addEventListener(O["pointerup"], function(Eve) {
            if(Opt.PreventDefault) Eve.preventDefault();
            if(Opt.StopPropagation) Eve.stopPropagation();
            if(!Ele.TouchStart) return;
            Ele.TouchEnd = { Time: new Date(), Event: Eve, Coord: O.getBibiEventCoord(Eve) };
            if((Ele.TouchEnd.Time - Ele.TouchStart.Time) < 300 && Math.abs(Ele.TouchEnd.Coord.X - Ele.TouchStart.Coord.X) < 5 && Math.abs(Ele.TouchEnd.Coord.Y - Ele.TouchStart.Coord.Y) < 5) {
                E.dispatch("bibi:taps",   Ele.TouchStart.Event, Ele);
                E.dispatch("bibi:tapped", Ele.TouchStart.Event, Ele);
            }
        });
    }
    return Ele;
};


I.setTapAction = function(Ele) {
    var ontapped = (function() {
        switch(Ele.Type) {
            case "toggle": return function(Eve) {
                I.setUIState(Ele, Ele.UIState == "default" ? "active" : "default");
            };
            case "radio": return function(Eve) {
                Ele.ButtonGroup.Buttons.forEach(function(Button) {
                    if(Button != Ele) I.setUIState(Button, "");
                });
                I.setUIState(Ele, "active");
            };
            default: return function(Eve) {
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
        ontapped.call(Ele, Eve);
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
        sML.replaceClass(UI, UI.PreviousUIState, UI.UIState);
    }
    return UI.UIState;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


P = {}; // Bibi.Preset


P.initialize = function() {
    O.applyTo(P, Bibi.Preset);
    O.SettingTypes.Boolean.forEach(function(Property) {
        if(P[Property] !== true) P[Property] = false;
    });
    O.SettingTypes.YesNo.forEach(function(Property) {
        if(typeof P[Property] == "string") P[Property] = /^(yes|no|mobile|desktop)$/.test(P[Property]) ? P[Property] : "no";
        else                               P[Property] = P[Property] ? "yes" : "no";
    });
    O.SettingTypes.Integer.forEach(function(Property) {
        P[Property] = (typeof P[Property] != "number" || P[Property] < 0) ? 0 : Math.round(P[Property]);
    });
    O.SettingTypes.Number.forEach(function(Property) {
        if(typeof P[Property] != "number") P[Property] = 0;
    });
    if(!/^(horizontal|vertical|paged)$/.test(P["reader-view-mode"])) P["reader-view-mode"] = "paged";
    if(!/^([\w\d]+:)?\/\//.test(P["bookshelf"])) {
        if(/^\//.test(P["bookshelf"])) P["bookshelf"] = O.Origin + P["bookshelf"];
        else                           P["bookshelf"] = O.getPath(location.href.split("?")[0].replace(/[^\/]*$/, "") + P["bookshelf"]);
        P["bookshelf"] = P["bookshelf"].replace(/\/$/, "");
    }
    if(!(P["trustworthy-origins"] instanceof Array)) P["trustworthy-origins"] = [];
    if(!P["trustworthy-origins"].includes(O.Origin)) P["trustworthy-origins"].unshift(O.Origin);
    var ExtensionsToBeLoaded = [];
    P["extensions"].forEach(function(FileInfo) {
        if(
            typeof FileInfo["name"] != "string" || !FileInfo["name"] || FileInfo["name"] == "Bibi" ||
            typeof FileInfo["src"]  != "string" || !FileInfo["src"]
        ) return;
        FileInfo.FileIndexInPreset = ExtensionsToBeLoaded.length;
        ExtensionsToBeLoaded.push(FileInfo);
    });
    P.X = P["extensions"] = ExtensionsToBeLoaded;
};



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- URI-Defined Settings (FileName, Queries, Hash, and EPUBCFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


U = {}; // Bibi.SettingsInURI


U.initialize = function() { // formerly O.readExtras

    var Q = U.parseQuery(location.search);
    var H = U.parseHash(location.hash);

    U["book"] = (function() {
        var Book = Q["book"] ? Q["book"] : O.Body.getAttribute("data-bibi-book");
        if(typeof Book != "string") return undefined;
        Book = decodeURIComponent(Book).replace(/\/+$/, "");
        if(/^([\w\d]+:)?\/\//.test(Book)) { // absolute URI
            if(/^\/\//.test(Book)) Book = location.protocol + Book;
        }
        return Book;
    })();

    var applyToU = function(DataString) {
        if(typeof DataString != "string") return {};
        DataString.replace(" ", "").split(",").forEach(function(PnV) {
            PnV = PnV.split(":"); if(!PnV[0]) return;
            if(!PnV[1]) {
                switch(PnV[0]) {
                    case "horizontal":
                    case "vertical":
                    case "paged":
                        PnV[1] = PnV[0], PnV[0] = "reader-view-mode";
                        break;
                    default:
                        if(O.SettingTypes.YesNo.includes(PnV[0])) PnV[1] = "yes";
                        else PnV[0] = undefined;
                }
            } else {
                switch(PnV[0]) {
                    case "parent-title":
                    case "parent-uri":
                    case "parent-origin":
                    case "parent-pipi-path":
                    case "parent-bibi-label":
                    case "parent-holder-id":
                        PnV[1] = U.decode(PnV[1]);
                        break;
                    case "reader-view-mode":
                        if(!/^(horizontal|vertical|paged)$/.test(PnV[1])) PnV[1] = undefined;
                        break;
                    case "to":
                        PnV[1] = R.getBibiToDestination(PnV[1]);
                        break;
                    case "nav":
                        PnV[1] = /^[1-9]\d*$/.test(PnV[1]) ? PnV[1] * 1 : undefined;
                        break;
                    case "preset":
                        break;
                    default:
                        if(O.SettingTypes.YesNo.includes(PnV[0])) {
                                 if(PnV[1] == "true" ) PnV[1] = "yes";
                            else if(PnV[1] == "false") PnV[1] = "no";
                            else if(!/^(yes|no|mobile|desktop)$/.test(PnV[1])) PnV[1] = undefined;
                        }
                        else PnV[0] = undefined;
                }
            }
            if(PnV[0] && (PnV[1] || typeof PnV[1] == "string" || typeof PnV[1] == "number")) U[PnV[0]] = PnV[1];
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
    var Params = {};
    Q.split("&").forEach(function(PnV) {
        PnV = PnV.split("=");
        if(/^[a-z]+$/.test(PnV[0])) Params[PnV[0]] = PnV[1];
    });
    return Params;
};


U.parseHash = function(H) {
    if(typeof H != "string") return {};
    H = H.replace(/^#/, "");
    var Params = {}, CurrentPosition = 0;
    var parseFragment = function() {
        var Foothold = CurrentPosition, Label = "";
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


S = {}; // Bibi.Settings


S.initialize = function() {
    for(var Property in S) if(typeof S[Property] != "function") delete S[Property];
    O.applyTo(S, P);
    O.applyTo(S, U);
    delete S["book"];
    delete S["bookshelf"];
    O.SettingTypes.YesNo.forEach(function(Property) {
        S[Property] = S.decideYesNo(Property);
    });
    S["autostart"] = (!S["wait"] && (!O.WindowEmbedded || S["autostart"]));
    S["start-in-new-window"] = (S["start-in-new-window"] && O.WindowEmbedded);
};


S.decideYesNo = function(Property) {
    return (S[Property] === true || S[Property] == "yes" || (S[Property] == "mobile" && O.Mobile) || (S[Property] == "desktop" && !O.Mobile));
};


S.update = function(Settings) {

    var PrevBRL = S.BRL, PrevRVM = S.RVM, PrevPPD = S.PPD, PrevSLA = S.SLA, PrevSLD = S.SLD, PrevARD = S.ARD;

    if(typeof Settings == "object") for(var Property in Settings) if(typeof S[Property] != "function") S[Property] = Settings[Property];

    S.BRL = S["book-rendition-layout"] = B.Package.Metadata["rendition:layout"];
    S.BWM = S["book-writing-mode"] = (/^tb/.test(B.WritingMode) && !O.VerticalTextEnabled) ? "lr-tb" : B.WritingMode;

    // Font Family
    if(S.FontFamilyStyleIndex) sML.deleteStyleRule(S.FontFamilyStyleIndex);
    if(S["ui-font-family"]) S.FontFamilyStyleIndex = sML.appendStyleRule("html", "font-family: " + S["ui-font-family"] + " !important;");

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

    // Dictionary
    if(S.SLA == "horizontal") {
        /**/S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width",  w: "length",  W: "Length",  h: "breadth", H: "Breadth" };
        if(S.PPD == "ltr") {
            S.AXIS = { B: "Y",      L: "X",      PM: +1 };
            S.BASE = { b: "left",   B: "Left",   a: "right",  A: "Right",  s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
        } else {
            S.AXIS = { B: "Y",      L: "X",      PM: -1 };
            S.BASE = { b: "right",  B: "Right",  a: "left",   A: "Left",   s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
        }
    } else {
        /**/S.SIZE = { b: "width",  B: "Width",  l: "height", L: "Height", w: "breadth", W: "Breadth", h: "length",  H: "Length" };
        /**/S.AXIS = { B: "X",      L: "Y",      PM: +1 };
        if(S.PPD == "ltr") {
            S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "left",    S: "Left",    e: "right",   E: "Right",  c: "center", m: "middle" };
        } else {
            S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "right",   S: "Right",   e: "left",    E: "Left",   c: "center", m: "middle" };
        }
    }

    // Root Class
    if(PrevBRL != S.BRL) { sML.replaceClass(O.HTML, "book-"       + PrevBRL, "book-"       + S.BRL); }
    if(PrevRVM != S.RVM) { sML.replaceClass(O.HTML, "view-"       + PrevRVM, "view-"       + S.RVM); }
    if(PrevPPD != S.PPD) { sML.replaceClass(O.HTML, "page-"       + PrevPPD, "page-"       + S.PPD); }
    if(PrevSLA != S.SLA) { sML.replaceClass(O.HTML, "spread-"     + PrevSLA, "spread-"     + S.SLA); }
    if(PrevSLD != S.SLD) { sML.replaceClass(O.HTML, "spread-"     + PrevSLD, "spread-"     + S.SLD); }
    if(PrevARD != S.ARD) { sML.replaceClass(O.HTML, "appearance-" + PrevARD, "appearance-" + S.ARD); }

    E.dispatch("bibi:updated-settings", S);

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


O = {}; // Bibi.Operator


O.log = function(Msg, Tag) {
    if(sML.UA.Gecko && typeof Msg == "string") Msg = Msg.replace(/(https?:\/\/)/g, "");
    var Pre = 'BiB/i: ';
    switch(Tag) {
        case  "-*": Tag  = "-" + (O.log.Depth);              break;
        case  "*:": Tag  =       (O.log.Depth) + ":";        break;
        case "/*" : Tag  = "/" + (O.log.Depth - 1);          break;
    }
    switch(Tag) {
        case "-x" : Pre += "[ERROR] ";                  console.info(Pre + Msg); return;
        case "-0" : Pre += "━━ "; console.info(Pre + Msg); return;
        case "-1" : Pre += " - ";                       O.log.Depth = 1; break;
        case  "1:": Pre += "┌ ";                       O.log.Depth = 2; break;
        case "-2" : Pre += "│ - ";                     O.log.Depth = 2; break;
        case  "2:": Pre += "│┌ ";                     O.log.Depth = 3; break;
        case "-3" : Pre += "││ - ";                   O.log.Depth = 3; break;
        case  "3:": Pre += "││┌ ";                   O.log.Depth = 4; break;
        case "-4" : Pre += "│││ - ";                 O.log.Depth = 4; break;
        case  "4:": Pre += "│││┌ ";                 O.log.Depth = 5; break;
        case "-5" : Pre += "││││ - ";               O.log.Depth = 5; break;
        case  "5:": Pre += "││││┌ ";               O.log.Depth = 6; break;
        case "-6" : Pre += "│││││ - ";             O.log.Depth = 6; break;
        case "/5" : Pre += "││││└ ";               O.log.Depth = 5; break;
        case "/4" : Pre += "│││└ ";                 O.log.Depth = 4; break;
        case "/3" : Pre += "││└ ";                   O.log.Depth = 3; break;
        case "/2" : Pre += "│└ ";                     O.log.Depth = 2; break;
        case "/1" : Pre += "└ ";                       O.log.Depth = 1; break;
    }
    console.log(Pre + Msg);
};
/*O.log = function(Msg, Tag) {
    var Pre = 'BiB/i: ';
    switch(Tag) {
        case  "-*": Tag  = "-" + (O.log.Depth);              break;
        case  "*:": Tag  =       (O.log.Depth) + ":";        break;
        case "/*" : Tag  = "/" + (O.log.Depth - 1);          break;
    }
    switch(Tag) {
        case "-x" : Pre += "[ERROR] ";                       console.error(Pre + Msg); break;
        case "-0" : Pre += "━━━━━━━━━━━━ ";      console.info(Pre + Msg); break;
        case "-1" : O.log.Depth = 1; console.log(Pre + Msg); break;
        case  "1:": O.log.Depth = 2; console.group(Pre + Msg); break;
        case "-2" : O.log.Depth = 2; console.log(Pre + Msg); break;
        case  "2:": O.log.Depth = 3; console.group(Pre + Msg); break;
        case "-3" : O.log.Depth = 3; console.log(Pre + Msg); break;
        case  "3:": O.log.Depth = 4; console.group(Pre + Msg); break;
        case "-4" : O.log.Depth = 4; console.log(Pre + Msg); break;
        case  "4:": O.log.Depth = 5; console.group(Pre + Msg); break;
        case "-5" : O.log.Depth = 5; console.log(Pre + Msg); break;
        case  "5:": O.log.Depth = 6; console.group(Pre + Msg); break;
        case "-6" : O.log.Depth = 6; console.log(Pre + Msg); break;
        case "/5" : O.log.Depth = 5; console.log(Pre + Msg); console.groupEnd(); break;
        case "/4" : O.log.Depth = 4; console.log(Pre + Msg); console.groupEnd(); break;
        case "/3" : O.log.Depth = 3; console.log(Pre + Msg); console.groupEnd(); break;
        case "/2" : O.log.Depth = 2; console.log(Pre + Msg); console.groupEnd(); break;
        case "/1" : O.log.Depth = 1; console.log(Pre + Msg); console.groupEnd(); break;
    }
};*/
O.log.Depth = 1; if(parent && parent != window) O.log = function() { return false; };


O.error = function(Msg) {
    O.Busy = false;
    sML.removeClass(O.HTML, "busy");
    sML.removeClass(O.HTML, "loading");
    sML.removeClass(O.HTML, "waiting");
    E.dispatch("bibi:x_x", Msg);
    O.log(Msg, "-x");
    O.log.Depth = 1;
};


O.applyTo = function(To, From) {
    for(var Property in From) if(typeof To[Property] != "function" && typeof From[Property] != "function") To[Property] = From[Property];
};


O.download = function(URI, MimeType) {
    return new Promise(function(resolve, reject) {
        var XHR = new XMLHttpRequest();
        if(MimeType) XHR.overrideMimeType(MimeType);
        XHR.open('GET', URI, true);
        XHR.onloadend = function() {
            XHR.status === 200 ? resolve(XHR) : reject(XHR);
        };
        XHR.send(null);
    });
};


O.parseDocument = function(Path, Doc) {
    return (new DOMParser()).parseFromString(Doc, /\.(xml|opf|ncx)$/i.test(Path) ? "text/xml" : "text/html");
};


O.openDocument = function(Path) {
    if(B.Unzipped) {
        return O.download(B.Path + "/" +  Path).then(function(XHR) {
            return O.parseDocument(Path, XHR.responseText);
        }).catch(function(XHR) {
            O.error('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"');
        });
    } else {
        return Promise.resolve().then(function() {
            return O.parseDocument(Path, B.Files[Path]);
        });
    }
};


O.editCSSRules = function() {
    var Doc, Fun;
         if(typeof arguments[0] == "function") Doc = arguments[1], Fun = arguments[0];
    else if(typeof arguments[1] == "function") Doc = arguments[0], Fun = arguments[1];
    if(!Doc) Doc = document;
    if(!Doc.styleSheets || typeof Fun != "function") return;
    sML.each(Doc.styleSheets, function() {
        var StyleSheet = this;
        if(!StyleSheet.cssRules) return;
        for(var l = StyleSheet.cssRules.length, i = 0; i < l; i++) {
            var CSSRule = this.cssRules[i];
            /**/ if(CSSRule.cssRules)   arguments.callee.call(CSSRule);
            else if(CSSRule.styleSheet) arguments.callee.call(CSSRule.styleSheet);
            else Fun(CSSRule);
        }
    });
};


O.appendStyleSheetLink = function(Opt, Doc) {
    if(!Opt || !Opt.href) return false;
    if(!Doc) Doc = document;
    var Link = Doc.createElement("link");
    Link.rel = "stylesheet";
    if(typeof Opt.className == "string") Link.className = Opt.className;
    if(typeof Opt.id        == "string") Link.id = Opt.id;
    if(typeof Opt.media     == "string") Link.media = Opt.media;
    Link.href = Opt.href;
    return Doc.head.appendChild(Link);
};


O.isBin = function(Hint) {
    if(/(^|\.)(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(Hint)) return true;
    return false;
};

O.getDataURI = function(FilePath, FileContent) {
    for(var Ext in O.ContentTypes) {
        if((new RegExp('(^|\.)' + Ext + '$', "i")).test(FilePath)) {
            return "data:" + O.ContentTypes[Ext] + ";base64," + (O.isBin(FilePath) ? btoa(FileContent) : btoa(unescape(encodeURIComponent(FileContent))));
        }
    }
    return "";
};

O.getWritingMode = function(Ele) {
    var CS = getComputedStyle(Ele);
         if(!O.WritingModeProperty)                            return (CS["direction"] == "rtl" ? "rl-tb" : "lr-tb");
    else if(     /^vertical-/.test(CS[O.WritingModeProperty])) return (CS["direction"] == "rtl" ? "bt" : "tb") + "-" + (/-lr$/.test(CS[O.WritingModeProperty]) ? "lr" : "rl");
    else if(   /^horizontal-/.test(CS[O.WritingModeProperty])) return (CS["direction"] == "rtl" ? "rl" : "lr") + "-" + (/-bt$/.test(CS[O.WritingModeProperty]) ? "bt" : "tb");
    else if(/^(lr|rl|tb|bt)-/.test(CS[O.WritingModeProperty])) return CS[O.WritingModeProperty];
};


O.getElementInnerText = function(Ele) {
    var InnerText = "InnerText";
    var Copy = document.createElement("div");
    Copy.innerHTML = Ele.innerHTML.replace(/ (src(set)?|source|(xlink:)?href)=/g, " data-$1=");
    sML.each(Copy.querySelectorAll("svg"),    function() { this.parentNode.removeChild(this); });
    sML.each(Copy.querySelectorAll("video"),  function() { this.parentNode.removeChild(this); });
    sML.each(Copy.querySelectorAll("audio"),  function() { this.parentNode.removeChild(this); });
    sML.each(Copy.querySelectorAll("img"),    function() { this.parentNode.removeChild(this); });
    sML.each(Copy.querySelectorAll("script"), function() { this.parentNode.removeChild(this); });
    sML.each(Copy.querySelectorAll("style"),  function() { this.parentNode.removeChild(this); });
    /**/ if(typeof Copy.textContent != "undefined") InnerText = Copy.textContent;
    else if(typeof Copy.innerText   != "undefined") InnerText = Copy.innerText;
    return InnerText.replace(/[\r\n\s\t ]/g, "");
};


O.getElementCoord = function(El) {
    var Coord = { X: El["offsetLeft"], Y: El["offsetTop"] };
    while(El.offsetParent) El = El.offsetParent, Coord.X += El["offsetLeft"], Coord.Y += El["offsetTop"];
    return Coord;
};

O.getPath = function() {
    var Origin = "", Path = arguments[0];
    if(arguments.length == 2 && /^[\w\d]+:\/\//.test(arguments[1])) Path  =       arguments[1];
    else for(var l = arguments.length, i = 1; i < l; i++)           Path += "/" + arguments[i];
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
    var HMS = O.TimeCard.getHMS(O.TimeCard.getElapsed());
    if(TimeCard[HMS]) What = TimeCard[HMS] + " -&- " + What;
    TimeCard[HMS] = What;
};

O.stopPropagation = function(Eve) { Eve.stopPropagation(); return false; };
O.preventDefault  = function(Eve) { Eve.preventDefault();  return false; };

O.getBibiEventCoord = function(Eve) {
    var Coord = { X:0, Y:0 };
    if(/^touch/.test(Eve.type)) {
        Coord.X = Eve.changedTouches[0].pageX;
        Coord.Y = Eve.changedTouches[0].pageY;
    } else {
        Coord.X = Eve.pageX;
        Coord.Y = Eve.pageY;
    }
    if(Eve.target.ownerDocument.documentElement != O.HTML) {
        var Item = Eve.target.ownerDocument.documentElement.Item;
        ItemCoord = O.getElementCoord(Item);
        if(!Item.PrePaginated && !Item.Outsourcing) ItemCoord.X += S["item-padding-left"], ItemCoord.Y += S["item-padding-top"];
        Coord.X += ItemCoord.X - R.Main.scrollLeft;
        Coord.Y += ItemCoord.Y - R.Main.scrollTop;
    }
    return Coord;
};

O.getBibiEvent = function(Eve) {
    if(!Eve) return {};
    var Coord = O.getBibiEventCoord(Eve);
    var FlipperWidth = S["flipper-width"];
    var Ratio = {
        X: Coord.X / window.innerWidth,
        Y: Coord.Y / window.innerHeight
    };
    if(FlipperWidth < 1) { // Ratio
        var BorderL = BorderT =     FlipperWidth;
        var BorderR = BorderB = 1 - FlipperWidth;
    } else { // Pixel to Ratio
        var BorderL = FlipperWidth / window.innerWidth;
        var BorderT = FlipperWidth / window.innerHeight;
        var BorderR = 1 - BorderL;
        var BorderB = 1 - BorderT;
    }
    var Division = {
        X: "",
        Y: ""
    };
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
    var Loc = (Win ? Win : window).location;
    return Loc.origin || Loc.protocol + "//" + (Loc.host || Loc.hostname + (Loc.port ? ":" + Loc.port : ""))
};
O.Origin = O.getOrigin();

O.Path = (function() {
    if(document.currentScript) return document.currentScript.src;
    var Scripts = document.getElementsByTagName("script");
    return Scripts[Scripts.length - 1].src;
})();

O.RootPath = O.Path.replace(/\/res\/scripts\/.+$/, "/");

O.Cookie = {
    remember: function(Group) {
        var Cookie = JSON.parse(sML.Cookies.read("bibi") || '{}');
        if(typeof Group != "string" || !Group) return Cookie;
        return Cookie[Group];
    },
    eat: function(Group, KeyVal, Opt) {
        if(typeof Group != "string" || !Group) return false;
        if(typeof KeyVal != "object") return false;
        var Cookie = this.remember();
        if(typeof Cookie[Group] != "object") Cookie[Group] = {};
        for(var Key in KeyVal) {
            var Val = KeyVal[Key];
            if(typeof Val == "function") continue;
            Cookie[Group][Key] = Val;
        }
        if(!Opt) Opt = {};
        Opt.Path = location.pathname.replace(/[^\/]+$/, "");
        if(!Opt.Expires) Opt.Expires = S["cookie-expires"];
        sML.Cookies.write("bibi", JSON.stringify(Cookie), Opt);
    }
};

O.ContentTypes = {
    "gif"   :       "image/gif",
    "png"   :       "image/png",
    "jpe?g" :       "image/jpeg",
    "svg"   :       "image/svg+xml",
    "mp4"   :       "video/mp4",
    "webm"  :       "video/webm",
    "mp3"   :       "audio/mpeg",
    "mp4"   :       "audio/mp4",
    "ttf"   :        "font/truetype",
    "otf"   :        "font/opentype",
    "woff"  :        "font/woff",
    "css"   :        "text/css",
    "js"    :        "text/javascript",
    "html?" :        "text/html",
    "xhtml" : "application/xhtml+xml",
    "xml"   : "application/xml",
    "pdf"   : "application/pdf"
};

O.SettingTypes = {
    YesNo: [
        "fix-reader-view-mode",
        "single-page-always",
        "wait",
        "autostart",
        "start-in-new-window",
        "use-nombre",
        "use-slider",
        "use-arrows",
        "use-keys",
        "use-swipe",
        "use-cookie"
    ],
    Integer: [
        "spread-gap",
        "spread-margin",
        "item-padding-left",
        "item-padding-right",
        "item-padding-top",
        "item-padding-bottom"
    ],
    Number: [
        "cookie-expires",
        "flipper-width"
    ],
    Boolean: [
        "remove-bibi-website-link",
        "page-breaking"
    ]
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events - Special Thanks: @KitaitiMakoto & @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


E = {}; // Bibi.Events



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


M = {}; // Bibi.Messages


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
        for(var EventName in Data) if(/^bibi:commands:/.test(EventName)) E.dispatch(EventName, Data[EventName]);
        return true;
    } catch(Err) {}
    return false;
};


M.gate = function(Eve) {
    if(!Eve || !Eve.data) return;
    for(var l = S["trustworthy-origins"].length, i = 0; i < l; i++) if(S["trustworthy-origins"][i] == Eve.origin) return M.receive(Eve.data);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extensions - Special Thanks: @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


X = {}; // Bibi.Extensions


X.initialize = function() {
    X.Files = {};
    X.Presets = {};
    X.Loaded = [];
    X.Added = [];
};


X.loadFilesInPreset = function() {
    return new Promise(function(resolve, reject) {
        O.log('Loading Extension File' + (P.X.length > 1 ? 's' : '') + '...', "*:");
        var loadFile = function(FileInfo) {
            if(X.Files[FileInfo["name"]]) {
                O.log('"name" of Extension File "' + FileInfo["name"] + '" is already taken.', "-*");
                loadFile(P.X[FileInfo.FileIndexInPreset + 1]);
                return false;
            }
            X.Files[FileInfo["name"]] = FileInfo;
            X.Presets[FileInfo["name"]] = P.X[FileInfo["name"]] = {};
            for(var Option in FileInfo) P.X[FileInfo["name"]][Option] = FileInfo[Option];
            document.head.appendChild(
                sML.create("script", { className: "bibi-extension-script", id: "bibi-extension-script_" + FileInfo["name"], name: FileInfo["name"], src: FileInfo["src"],// async: "async",
                    onload: function() {
                        X.Loaded.push(FileInfo);
                        if(FileInfo.FileIndexInPreset + 1 == P.X.length) {
                            /*
                            if(X.Loaded.length) {
                                var LoadedExtensionFiles = "";
                                X.Loaded.forEach(function(LoadedExtension) { LoadedExtensionFiles += ", " + LoadedExtension["name"]; });
                                LoadedExtensionFiles = LoadedExtensionFiles.replace(/^, /, "");
                                O.log('Extension File' + (X.Loaded.length > 1 ? 's' : '') + ': ' + LoadedExtensionFiles, "-*");
                            }
                            */
                            if(X.Added.length) {
                                var AddedExtensions = "";
                                X.Added.forEach(function(AddedExtension) { AddedExtensions += ", " + AddedExtension["name"]; });
                                AddedExtensions = AddedExtensions.replace(/^, /, "");
                                O.log('Extension' + (X.Added.length > 1 ? 's' : '') + ': ' + AddedExtensions, "-*");
                            }
                            O.log('Extension File' + (X.Loaded.length > 1 ? 's' : '') + ' Loaded.', "/*");
                            return resolve();
                        }
                        loadFile(P.X[FileInfo.FileIndexInPreset + 1]);
                    }
                })
            );
        };
        loadFile(P.X[0]);
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

