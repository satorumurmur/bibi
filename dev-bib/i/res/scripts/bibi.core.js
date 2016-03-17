/*!
 *
 * # BiB/i (core)
 *
 * - "Heart of BiB/i"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

// requires: Native Promiss Only & Hammer.js & easing.js & sML

Bibi = { "version": "0.999.0", "build": 20160309.1453 };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() { Bibi.welcome(); });


Bibi.welcome = function() {

    O.stamp("Welcome!");
    O.log('Welcome! - BiB/i v' + Bibi["version"] + ' - (ja) http://bibi.epub.link - (en) https://github.com/satorumurmur/bibi', "-0");

    O.Language = (function() {
        if(typeof navigator.language != "string") return "en";
        return (navigator.language.split("-")[0] == "ja") ? "ja" : "en";
    })();

    O.HTML  = document.documentElement; O.HTML.className = "welcome " + sML.Environments.join(" ");
    O.Head  = document.head;
    O.Body  = document.body;
    O.Info  = document.getElementById("bibi-info");
    O.Title = document.getElementsByTagName("title")[0];

    // Device
    if(sML.OS.iOS || sML.OS.Android) {
        O.Mobile = true;
        O.HTML.className = O.HTML.className + " Touch";
        O.setOrientation = function() {
            sML.removeClass(O.HTML, "orientation-" + (window.orientation == 0 ? "landscape" : "portrait" ));
            sML.addClass(   O.HTML, "orientation-" + (window.orientation == 0 ? "portrait"  : "landscape"));
        }
        window.addEventListener("orientationchange", O.setOrientation);
        O.setOrientation();
        if(sML.OS.iOS) {
            O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-capable",          content: "yes"   }));
            O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-status-bar-style", content: "white" }));
        }
        O["resize"] = "orientationchange";
        O["touchstart"] = "touchstart";
        O["touchend"] = "touchend";
    } else {
        O["resize"] = "resize";
        O["touchstart"] = "mousedown";
        O["touchend"] = "mouseup";
    }

    // Window
    if(window.parent == window) {
        O.WindowEmbedded = 0; // false
        O.WindowEmbeddedDetail = "Direct Opened: " + location.origin + location.pathname + location.search;
        O.HTML.className = O.HTML.className + " window-not-embedded";
    } else {
        O.HTML.className = O.HTML.className + " window-embedded";
        if(location.host == parent.location.host) {
            O.WindowEmbedded = 1; // true
            O.WindowEmbeddedDetail = "Embedded in: " + parent.location.origin + parent.location.pathname + parent.location.search;
            O.HTML.className = O.HTML.className + " window-embedded-sameorigin";
        } else {
            O.WindowEmbedded = -1; // true
            O.WindowEmbeddedDetail = "Embedded in: Cross-Origin Parent";
            O.HTML.className = O.HTML.className + " window-embedded-crossorigin";
        }
    }

    // Writing Mode & Font Size
    O.WritingModeProperty = (function() {
        var HTMLCS = getComputedStyle(O.HTML);
        if(/^(vertical|horizontal)-/.test(HTMLCS["-webkit-writing-mode"])) return "-webkit-writing-mode";
        if(/^(vertical|horizontal)-/.test(HTMLCS["writing-mode"]) || sML.UA.InternetExplorer) return "writing-mode";
        else return undefined;
    })();
    var Checker = document.body.appendChild(sML.create("div", { id: "checker" }));
    Checker.Child = Checker.appendChild(sML.create("p", { innerHTML: "aAあ亜" }));
    if(Checker.Child.offsetWidth < Checker.Child.offsetHeight) {
        O.HTML.className = O.HTML.className + " vertical-text-enabled";
        O.VerticalTextEnabled = true;
    } else {
        O.HTML.className = O.HTML.className + " vertical-text-not-enabled";
        O.VerticalTextEnabled = false;
    };
    O.DefaultFontSize = Math.min(Checker.Child.offsetWidth, Checker.Child.offsetHeight);
    document.body.removeChild(Checker);
    delete Checker;

    // Scrollbars
    O.Scrollbars = { Width: window.innerWidth - O.HTML.offsetWidth, Height: window.innerHeight - O.HTML.offsetHeight };

    // Extensions
    X.initialize();

    // Setting
    P.initialize();
    U.initialize();
    S.initialize();

    // Loader
    L.initialize();

    // Reader
    R.initialize();

    // UI
    C.initialize();

    // Bye-bye
    if(sML.UA.InternetExplorer < 11) return Bibi.byebye();

    // Welcome!
    C.note("Welcome!");
    sML.removeClass(O.HTML, "welcome");
    E.dispatch("bibi:welcome");

    // Ready
    P.Initialized.then(Bibi.ready);

};


Bibi.byebye = function() {

    var Msg = {
        "en": '<span>I\'m so Sorry....</span> <span>Your Browser Is</span> <span>Not Compatible with BiB/i.</span>',
        "ja": '<span>ごめんなさい……</span> <span>お使いのブラウザでは、</span><span>ビビは動きません。</span>'
    };

    C.Veil.ByeBye = C.Veil.appendChild(
        sML.create("p", { id: "bibi-veil-byebye",
            innerHTML: [
                '<span lang="en">', Msg["en"], '</span>',
                '<span lang="ja">', Msg["ja"], '</span>',
            ].join("").replace(/(BiB\/i|ビビ)/g, '<a href="http://bibi.epub.link/" target="_blank">$1</a>')
        })
    );

    O.log(Msg["en"].replace(/<[^>]*>/g, ""), "-*");
    E.dispatch("bibi:byebye");


};


Bibi.ready = function() {

    sML.addClass(O.HTML, "ready");

    var ExtensionNames = [];
    X.Extensions.forEach(function(Extension) { ExtensionNames.push(Extension["name"]) });
    if(ExtensionNames.length) O.log("Extension" + (ExtensionNames.length >= 2 ? "s" : "") + ": " + ExtensionNames.join(", "), "-*");

    E.add("bibi:scrolled", R.getCurrent);
    E.add("bibi:command:move",        function(Dis) { R.move(Dis); });
    E.add("bibi:command:focus",       function(Des) { R.focus(Des); });
    E.add("bibi:command:changeView",  function(RVM) { R.changeView(RVM); });

    window.addEventListener("message", M.gate, false);

    E.add("bibi:ready", function() {
        if(U["book"]) {
            sML.removeClass(O.HTML, "ready");
            L.loadBook(U["book"]);
        } else {
            if(X["Unzipper"] && window.File && !O.Mobile) {
                C.Veil.Catcher.dropOrClick();
            } else {
                if(O.WindowEmbedded) {
                    C.note('Tell me EPUB name via embedding tag.', 99999999999);
                } else {
                    C.note('Tell me EPUB name via URI.', 99999999999);
                }
            }
        }
    });

    setTimeout(function() { E.dispatch("bibi:ready"); }, (O.Mobile ? 999 : 1));


};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Book

//----------------------------------------------------------------------------------------------------------------------------------------------


B = {}; // Bibi.Book


B.initialize = function(Book) {
    O.log("Initializing Book...", "*:");
    delete B.Online;
    delete B.Unzipped;
    delete B["name"];
    delete B.Path;
    delete B.PathDelimiter;
    delete B.File;
    delete B.Files;
    delete B.initialize.resolve;
    delete B.initialize.reject;
    O.apply({
        Title: "",
        Creator: "",
        Publisher: "",
        Language: "",
        WritingMode: "",
        Mimetype:  { Path: "mimetype" },
        Container: { Path: "META-INF/container.xml" },
        Package:   { Path: "", Dir: "",
            Metadata: { "titles": [], "creators": [], "publishers": [], "languages": [] },
            Manifest: { "items": {}, "nav": {}, "toc-ncx": {}, "cover-image": {} },
            Spine:    { "itemrefs": [] }
        },
        FileDigit: 0
    }, B);
    return new Promise(function(resolve, reject) {
        B.initialize.resolve = resolve;
        B.initialize.reject  = reject;
        if(typeof Book == "string") { // Online
            B.Online = true;
            B["name"] = Book;
            B.Path = (function() {
                if(/^([\w\d]+:)?\/\//.test(B["name"])) return B["name"];
                if(             /^\//.test(B["name"])) return location.origin + B["name"];
                return P["bookshelf"] + B["name"];
            })();
            if(/\.epub$/i.test(B["name"])) { // ends with ".epub" -> Zipped
                B.initialize.asZipped();
            } else { // Unzipped ?
                B.Path = B.Path.replace(/\/+$/, "");
                B.loadMimetype().then(function() {
                    B.initialize.resolve();
                }).catch(function() {
                    B.initialize.asZipped();
                });
            }
        } else if(typeof Book == "object" && Book) { // Local
            if(Book.size && typeof Book.name == "string" && /\.epub$/i.test(Book.name)) {
                B["name"] = B.Path = "[Local] " + Book.name;
                B.File = Book;
                B.initialize.asZipped();
            } else {
                B.initialize.reject('EPUB File Is Not Valid.');
            }
        } else {
            B.initialize.reject('Something Trouble.');
        }
    }).then(function() {
        delete B.initialize.resolve;
        delete B.initialize.reject;
        B.PathDelimiter = B.Unzipped ? "/" : " > ";
        O.log("Book Initialized.", "/*");
        E.dispatch("bibi:B.initialize");
    }).catch(function(ErrorMessage) {
        C.note(ErrorMessage, 99999999999);
        O.error(ErrorMessage);
    });
};


B.initialize.asZipped = function() {
    if(!X["Unzipper"]) return B.initialize.reject('Zipped EPUB Unavailable.');
    if(S["autostart"]) {
        B.loadEPUB();
    } else {
        L.wait().then(B.loadEPUB);
    }
};


B.loadMimetype = function() {
    return O.download(B.Path + "/" + B.Mimetype.Path).then(function(XHR) {
        if(XHR.responseText == "application/epub+zip") { // Unzipped
            B.Unzipped = true;
            O.log('EPUB: ' + B.Path + ' (Unzipped Online Folder)', "-*");
        }
    });
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loader

//----------------------------------------------------------------------------------------------------------------------------------------------


L = {}; // Bibi.Loader


L.initialize = function() {};


L.wait = function() {
    return new Promise(function(resolve, reject) {
        L.wait.resolve = resolve;
        L.wait.reject  = reject;
        sML.removeClass(O.HTML, "busy");
        sML.addClass(O.HTML, "waiting");
        O.log('(waiting)', '-*');
        C.note('');
    }).then(function() {
        delete L.wait.resolve;
        delete L.wait.reject;
        sML.removeClass(O.HTML, "waiting");
        sML.addClass(O.HTML, "busy");
        C.note('Loading...');
    });
};


L.play = function() {
    if(S["play-in-new-window"]) return window.open(location.href);
    L.Played = true;
    L.wait.resolve();
    E.dispatch("bibi:play");
};


L.loadBook = function(Book) {
    O.log("Loading Book...", "*:");
    sML.addClass(O.HTML, "loading");
    sML.addClass(O.HTML, "busy");
    C.note('Loading...');
    B.initialize(Book).then(function() {
        R.reset();
        L.loadContainer();
    });
};


L.loadContainer = function() {

    O.log('Loading Container XML: ' + B.Path + B.PathDelimiter + B.Container.Path + ' ...', "*:");

    O.openDocument(B.Container.Path).then(L.loadContainer.read).then(function() {
        O.log('Container XML Loaded.', "/*");
        L.loadPackageDocument();
    });

};


L.loadContainer.read = function(Doc) {

    B.Package.Path = Doc.getElementsByTagName("rootfile")[0].getAttribute("full-path");
    B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, "");

};


L.loadPackageDocument = function() {

    O.log('Loading Package Document: ' + B.Path + B.PathDelimiter + B.Package.Path + ' ...', "*:");

    O.openDocument(B.Package.Path).then(L.loadPackageDocument.read).then(function() {
        O.log('Package Document Loaded.', "/*");
        L.createCover();
        L.prepareItemsInSpreads();
        L.loadNavigation().then(function() {
            if(S["autostart"] || L.Played) {
                L.loadItemsInSpreads();
            } else {
                L.wait().then(L.loadItemsInSpreads);
            }
        });
    });

};


L.loadPackageDocument.read = function(Doc) {

    // Package
    var Metadata = Doc.getElementsByTagName("metadata")[0];
    var Manifest = Doc.getElementsByTagName("manifest")[0];
    var Spine    = Doc.getElementsByTagName("spine")[0];
    var ManifestItems = Manifest.getElementsByTagName("item");
    var SpineItemrefs = Spine.getElementsByTagName("itemref");
    if(ManifestItems.length <= 0) return O.error('"' + B.Package.Path + '" has no <item> in <manifest>.');
    if(SpineItemrefs.length <= 0) return O.error('"' + B.Package.Path + '" has no <itemref> in <spine>.');

    // METADATA
    XMLNS = { "dc": Metadata.getAttribute("xmlns:dc") };
    sML.each(Metadata.getElementsByTagName("meta"), function() {
        if(this.getAttribute("refines")) return;
        if(this.getAttribute("property")) {
            var Property = this.getAttribute("property").replace(/^dcterms:/, "");
            if(/^(title|creator|publisher|language)$/.test(Property)) B.Package.Metadata[Property + "s"].push(this.textContent);
            else if(!B.Package.Metadata[Property]) B.Package.Metadata[Property] = this.textContent;
        }
        if(this.getAttribute("name") && this.getAttribute("content")) {
            B.Package.Metadata[this.getAttribute("name")] = this.getAttribute("content");
        }
    });
    if(!B.Package.Metadata["titles"    ].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "title"),     function() { B.Package.Metadata["titles"    ].push(this.textContent); return false; });
    if(!B.Package.Metadata["creators"  ].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "creator"),   function() { B.Package.Metadata["creators"  ].push(this.textContent); });
    if(!B.Package.Metadata["publishers"].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "publisher"), function() { B.Package.Metadata["publishers"].push(this.textContent); });
    if(!B.Package.Metadata["languages" ].length) sML.each(Doc.getElementsByTagNameNS(XMLNS["dc"], "language"),  function() { B.Package.Metadata["languages" ].push(this.textContent); });
    if(!B.Package.Metadata["languages" ].length) B.Package.Metadata["languages"][0] = "en";
    if(!B.Package.Metadata["cover"])                 B.Package.Metadata["cover"]                 = "";
    if(!B.Package.Metadata["rendition:layout"])      B.Package.Metadata["rendition:layout"]      = "reflowable";
    if(!B.Package.Metadata["rendition:orientation"]) B.Package.Metadata["rendition:orientation"] = "auto";
    if(!B.Package.Metadata["rendition:spread"])      B.Package.Metadata["rendition:spread"]      = "auto";

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
            (function(ManifestItemProperties) {
                if(        / nav /.test(ManifestItemProperties)) B.Package.Manifest["nav"        ].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
                if(/ cover-image /.test(ManifestItemProperties)) B.Package.Manifest["cover-image"].Path = O.getPath(B.Package.Dir, ManifestItem["href"]);
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

    B.Title     = B.Package.Metadata["titles"].join(    ", ");
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

    var IDFragments = [];
    if(B.Title)     IDFragments.push(B.Title);
    if(B.Creator)   IDFragments.push(B.Creator);
    if(B.Publisher) IDFragments.push(B.Publisher);
    if(IDFragments.length) {
        O.Title.innerHTML = "BiB/i";
        O.Title.appendChild(document.createTextNode(" | " + IDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, "*:")));
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

    S.update();

};


L.createCover = function() {

    O.log('Creating Cover...', "*:");

    C.Veil.Cover.innerHTML = C.Panel.BookInfo.Cover.innerHTML = "";

    if(B.Package.Manifest["cover-image"].Path) {
        R.CoverImage.Path = B.Package.Manifest["cover-image"].Path;
    }

    var InfoHTML = (function() {
        var BookID = [];
        if(B.Title)     BookID.push('<strong>' + B.Title + '</strong>');
        if(B.Creator)   BookID.push('<em>' + B.Creator + '</em>');
        if(B.Publisher) BookID.push('<span>' + B.Publisher + '</span>');
        return BookID.join(" ");
    })();

    C.Veil.Cover.Info = C.Veil.Cover.appendChild(
        sML.create("p", { id: "bibi-veil-cover-info",
            innerHTML: InfoHTML
        })
    );

    C.Panel.BookInfo.Cover.Info = C.Panel.BookInfo.Cover.appendChild(
        sML.create("p", { id: "bibi-panel-bookinfo-cover-info",
            innerHTML: InfoHTML
        })
    );

    (function(changeClass) {
        if(R.CoverImage.Path) {
            O.log('Cover Image: ' + B.Path + B.PathDelimiter + R.CoverImage.Path, "-*");
            sML.create("img", {
                load: function() {
                    //O.log('Loading Cover Image: ' + B.Path + B.PathDelimiter + R.CoverImage.Path + ' ...', "*:");
                    var Img = this;
                    Img.src = B.Unzipped ? (B.Path + "/" + R.CoverImage.Path) : B.getDataURI(R.CoverImage.Path);
                    Img.timeout = setTimeout(function() { Img.ontimeout(); }, 5000)
                },
                onload: function() {
                    if(this.TimedOut) return false;
                    clearTimeout(this.timeout);
                    //O.log('Cover Image Loaded.', "/*");
                    sML.style(C.Veil.Cover, { backgroundImage: "url(" + this.src + ")" });
                    C.Panel.BookInfo.Cover.insertBefore(this, C.Panel.BookInfo.Cover.Info);
                    changeClass("with-cover-image");
                },
                ontimeout: function() {
                    this.TimedOut = true;
                    //O.log('Cover Image Request Timed Out.', "/*");
                    changeClass("without-cover-image");
                }
            }).load();
        } else {
            O.log('No Cover Image.', "-*");
            changeClass("without-cover-image");
        }
    })(function(ClassName) {
        C.Veil.Cover.className = C.Panel.BookInfo.Cover.className = ClassName;
    });

    O.log('Cover Created.', "/*");
    E.dispatch("bibi:createCover", R.CoverImage.Path);

};


L.prepareItemsInSpreads = function() {

    O.log('Preparing Items and Spread...', "*:");

    // For Pairing of Pre-Paginated
    if(B.PPD == "rtl") var PairBefore = "right", PairAfter = "left";
    else               var PairBefore = "left",  PairAfter = "right";

    sML.each(B.Package.Spine["itemrefs"], function() {
    });
    // Spreads, Boxes, and Items
    sML.each(B.Package.Spine["itemrefs"], function() {
        var ItemRef = this, ItemIndex = R.Items.length;
        // Item: A
        var Item = sML.create("iframe", {
            className: "item",
            scrolling: "no",
            allowtransparency: "true"
        });
        Item.ItemRef = ItemRef;
        Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
        Item.Dir = Item.Path.replace(/\/?[^\/]+$/, "");
        R.AllItems.push(Item);
        if(ItemRef["linear"] != "yes") return R.NonLinearItems.push(Item);
        R.Items.push(Item);
        // SpreadBox & Spread
        var SpreadBox, Spread;
        if(ItemRef["page-spread"] == PairAfter && ItemIndex > 0) {
            var PreviousItem = R.Items[ItemIndex - 1];
            if(PreviousItem.ItemRef["page-spread"] == PairBefore) {
                PreviousItem.Pair = Item;
                Item.Pair = PreviousItem;
                Spread = Item.Pair.Spread;
                SpreadBox = Spread.SpreadBox;
            }
        }
        if(!Item.Pair) {
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

    B.FileDigit = (R.Items.length + "").length;

    O.log(R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + ' Prepared.', "/*");

};


L.loadNavigation = function() {

    if(B.Package.Manifest["nav"].Path) {
        C.Panel.BookInfo.Navigation.Path = B.Package.Manifest["nav"].Path;
        C.Panel.BookInfo.Navigation.Type = "Navigation Document";
    } else if(B.Package.Manifest["toc-ncx"].Path) {
        C.Panel.BookInfo.Navigation.Path = B.Package.Manifest["toc-ncx"].Path;
        C.Panel.BookInfo.Navigation.Type = "TOC-NCX";
    } 

    return new Promise(function(resolve, reject) {
        if(!C.Panel.BookInfo.Navigation.Type) {
            O.log('No Navigation Document or TOC-NCX.', "-*");
            return resolve();
        }
        O.log('Loading Navigation: ' + B.Path + B.PathDelimiter + C.Panel.BookInfo.Navigation.Path + ' ...', "*:");
        O.openDocument(C.Panel.BookInfo.Navigation.Path).then(function(Doc) {
            C.Panel.BookInfo.Navigation.innerHTML = "";
            var NavContent = document.createDocumentFragment();
            if(C.Panel.BookInfo.Navigation.Type == "Navigation Document") {
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
                var TempTOCNCX = Doc.getElementsByTagName("navMap")[0];
                sML.each(TempTOCNCX.getElementsByTagName("navPoint"), function() {
                    var FirstNavLabel = this.getElementsByTagName("navLabel")[0];
                    FirstNavLabel.parentNode.insertBefore(
                        sML.create("a", { href: this.getElementsByTagName("content")[0].getAttribute("src"), innerHTML: this.getElementsByTagName("text")[0].innerHTML }),
                        FirstNavLabel
                    );
                    sML.removeElement(this.getElementsByTagName("navLabel")[0]);
                    sML.removeElement(this.getElementsByTagName("content")[0]);
                    var LI = sML.create("li", { id: this.getAttribute("id") });
                    LI.setAttribute("playorder", this.getAttribute("playorder"));
                    this.parentNode.insertBefore(LI, this).appendChild(this);
                    if(!LI.previousSibling || !LI.previousSibling.tagName || /^a$/i.test(LI.previousSibling.tagName)) {
                        LI.parentNode.insertBefore(document.createElement("ul"), LI).appendChild(LI);
                    } else {
                        LI.previousSibling.appendChild(LI);
                    }
                });
                NavContent.appendChild(document.createElement("nav")).innerHTML = TempTOCNCX.innerHTML.replace(/<(bibi_)?navPoint( [^>]+)?>/ig, "").replace(/<\/(bibi_)?navPoint>/ig, "");
            }
            C.Panel.BookInfo.Navigation.appendChild(NavContent);
            C.Panel.BookInfo.Navigation.Body = C.Panel.BookInfo.Navigation;
            delete NavContent; delete Doc;
            L.postprocessItem.coordinateLinkages(C.Panel.BookInfo.Navigation, "InNav");
            R.resetNavigation();
            O.log('Navigation Loaded', "/*");
            resolve();
        });
    }).then(function() {
        E.dispatch("bibi:loadNavigation", C.Panel.BookInfo.Navigation.Path);
    });

};


L.loadItemsInSpreads = function() {

    O.stamp("Load Items in Spreads");
    O.log('Loading ' + R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + '...', "*:");

    R.resetStage();

    L.LoadedItems = 0;
    L.LoadedSpreads = 0;

    R.ToRelayout = false;
    L.listenResizingWhileLoading = function() { R.ToRelayout = true; };
    window.addEventListener("resize", L.listenResizingWhileLoading);

    R.Spreads.forEach(L.loadSpread);

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
    if(/\.(x?html?)$/i.test(Path)) {
        // If HTML or Others
        if(B.Unzipped) {
            Item.src = B.Path + "/" + Path;
            Item.onload = function() { setTimeout(L.postprocessItem, 0, Item); };
            Item.ItemBox.appendChild(Item);
        } else {
            L.loadItem.writeItemHTML(Item, B.Files[Path]);
            setTimeout(L.postprocessItem, 0, Item);
        }
    } else if(/\.(svg)$/i.test(Path)) {
        // If SVG-in-Spine
        Item.IsSVG = true;
        if(B.Unzipped) {
            var URI = B.Path + "/" + Path;
            O.download(URI).then(function(XHR) {
                L.loadItem.writeItemHTML(Item, false, '<base href="' + URI + '" />', XHR.responseText.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
            });
        } else {
            L.loadItem.writeItemHTML(Item, false, '', B.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
        }
    } else if(/\.(gif|jpe?g|png)$/i.test(Path)) {
        // If Bitmap-in-Spine
        Item.IsBitmap = true;
        L.loadItem.writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Unzipped ? B.Path + "/" + Path : B.getDataURI(Path)) + '" />');
    } else if(/\.(pdf)$/i.test(Path)) {
        // If PDF-in-Spine
        Item.IsPDF = true;
        L.loadItem.writeItemHTML(Item, false, '', '<iframe     src="' + (B.Unzipped ? B.Path + "/" + Path : B.getDataURI(Path)) + '" />');
    }
};


L.loadItem.writeItemHTML = function(Item, HTML, Head, Body) {
    Item.ItemBox.appendChild(Item);
    Item.contentDocument.open();
    Item.contentDocument.write(HTML ? HTML : [
        '<html>',
            '<head>' + Head + '</head>',
            '<body onload="parent.L.postprocessItem(parent.R.Items[' + Item.ItemIndex + ']); document.body.removeAttribute(\'onload\'); return false;">' + Body + '</body>',
        '</html>'
    ].join(""));
    Item.contentDocument.close();
};


L.postprocessItem = function(Item) {

    Item.stamp("Postprocess");

    Item.HTML = sML.edit(Item.contentDocument.getElementsByTagName("html")[0], { Item: Item });
    Item.Head = sML.edit(Item.contentDocument.getElementsByTagName("head")[0], { Item: Item });
    Item.Body = sML.edit(Item.contentDocument.getElementsByTagName("body")[0], { Item: Item });

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
        for(var i = 0, l = Elements.length; i < l; i++) {
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

    E.dispatch("bibi:before:postprocessItemContent", Item);

    L.postprocessItem.processImages(Item);
    L.postprocessItem.defineViewport(Item);
    L.postprocessItem.coordinateLinkages(Item);

    //Item.RenditionLayout = ((Item.ItemRef["rendition:layout"] == "pre-paginated") && Item.ItemRef["viewport"]["width"] && Item.ItemRef["viewport"]["height"]) ? "pre-paginated" : "reflowable";

    setTimeout(function() {
        if(Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return setTimeout(arguments.callee, 100);
        L.postprocessItem.patchWritingModeStyle(Item);
        L.postprocessItem.applyBackgroundStyle(Item);
        E.dispatch("bibi:postprocessItemContent", Item);
        E.dispatch("bibi:postprocessItem", Item);
        L.onLoadItem(Item);
    }, 100);

    // Tap Scroller
    // Item.HTML.addEventListener("click", function(Eve, HEve) { R.observeTap(Item, HEve); });

};


L.postprocessItem.processImages = function(Item) {
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
            A.addEventListener(O["touchstart"], function(Eve) { Eve.stopPropagation(); });
            A.addEventListener(O["touchend"],   function(Eve) { Eve.stopPropagation(); });
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
                A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + B.PathDelimiter + HrefPathInSource);
                A.InNav = InNav;
                A.Destination = {
                    Item: rItem,
                    ElementSelector: (HrefHash ? "#" + HrefHash : undefined)
                };
                A.addEventListener("click", L.postprocessItem.coordinateLinkages.jump);
                return;
            }
        });
        if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
            A.setAttribute("data-bibi-original-href", HrefPathInSource);
            if(X["EPUBCFI"]) {
                A.setAttribute("href", "bibi://" + B.Path.replace(/^\w+:\/\//, "") + B.PathDelimiter + "#" + HrefHash);
                A.InNav = InNav;
                A.Destination = X["EPUBCFI"].getDestination(HrefHash);
                A.addEventListener("click", L.postprocessItem.coordinateLinkages.jump);
            } else {
                A.removeAttribute("href");
                A.addEventListener("click", function() { return false; });
                if(!O.Mobile) {
                    A.addEventListener("mouseover", function() { C.Help.show("(This link uses EPUBCFI. BiB/i needs the extension.)"); return false; });
                    A.addEventListener("mouseout",  function() { C.Help.hide(); return false; });
                }
            }
        }
        if(InNav && typeof S["nav"] == (i + 1) && A.Destination) S["to"] = A.Destination;
    });
};

L.postprocessItem.coordinateLinkages.jump = function(Eve) {
    Eve.preventDefault(); 
    Eve.stopPropagation();
    if(this.Destination) {
        var This = this;
        var Go = (!This.InNav || L.Opened) ? function() {
            R.focus(This.Destination);
        } : function() {
            if(S["play-in-new-window"]) return window.open(location.href + (location.hash ? "," : "#") + "pipi(nav:" + This.NavANumber + ")");
            S["to"] = This.Destination;
            L.play();
        };
        This.InNav ? C.Panel.toggle(Go) : Go();
    }
    return false;
};


L.postprocessItem.patchWritingModeStyle = function(Item) {
    if(sML.UA.InternetExplorer) {
        sML.each(Item.contentDocument.styleSheets, function () {
            var StyleSheet = this;
            for(var L = StyleSheet.cssRules.length, i = 0; i < L; i++) {
                var CSSRule = this.cssRules[i];
                /**/ if(CSSRule.cssRules)   arguments.callee.call(CSSRule);
                else if(CSSRule.styleSheet) arguments.callee.call(CSSRule.styleSheet);
                else {
                    /**/ if(/ (-(webkit|epub)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-rl" : "tb-rl";
                    else if(/ (-(webkit|epub)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-lr" : "tb-lr";
                    else if(/ (-(webkit|epub)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "rl-tb" : "lr-tb";
                }
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
    /*
    Item.Body.style["margin" + (function() {
        if(/-rl$/.test(Item.HTML.WritingMode)) return "Left";
        if(/-lr$/.test(Item.HTML.WritingMode)) return "Right";
        return "Bottom";
    })()] = 0;
    */
         if(/-rl$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginLeft != ItemBodyComputedStyle.marginRight) Item.Body.style.marginLeft = ItemBodyComputedStyle.marginRight;
    else if(/-lr$/.test(Item.HTML.WritingMode)) if(ItemBodyComputedStyle.marginRight != ItemBodyComputedStyle.marginLeft) Item.Body.style.marginRight = ItemBodyComputedStyle.marginLeft;
    else                                        if(ItemBodyComputedStyle.marginBottom != ItemBodyComputedStyle.marginTop) Item.Body.style.marginBottom = ItemBodyComputedStyle.marginTop;
};


L.postprocessItem.applyBackgroundStyle = function(Item) {
    if(Item.HTML.style) { sML.style(Item.ItemBox, L.postprocessItem.applyBackgroundStyle.getBackgroundStyle(Item.HTML)); Item.HTML.style.background = "transparent"; }
    if(Item.Body.style) { sML.style(Item,         L.postprocessItem.applyBackgroundStyle.getBackgroundStyle(Item.Body)); Item.Body.style.background = "transparent"; }
};

L.postprocessItem.applyBackgroundStyle.getBackgroundStyle = function(Ele) {
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
    E.dispatch("bibi:loadItem", Item);
    Item.stamp("Loaded");
    var Spread = Item.Spread;
    Spread.LoadedItems++;
    if(Spread.LoadedItems == Spread.Items.length) L.onLoadSpread(Spread);
    C.note("Loading... (" + (L.LoadedItems) + "/" + R.Items.length + " Items Loaded.)");
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
    E.dispatch("bibi:loadSpread", Spread);
    if(!R.ToRelayout) R.resetSpread(Spread);
    if(L.LoadedSpreads == R.Spreads.length) L.onLoadItemsInSpreads();
};


L.onLoadItemsInSpreads = function() {

    delete B.Files;
    document.body.style.display = "";
    R.resetPages();

    O.stamp("Items in Spreads Loaded");
    O.log(R.Items.length + ' Item' + (R.Items.length > 1 ? 's' : '') + ' in ' + R.Spreads.length + ' Spread' + (R.Spreads.length > 1 ? 's' : '') + ' Loaded.', "/*");
    E.dispatch("bibi:loadItems");
    E.dispatch("bibi:loadSpreads");
    E.dispatch("bibi:loadItemsInSpreads");

    L.onLoadBook();

};


L.onLoadBook = function() {

    L.Loaded = true;
    sML.removeClass(O.HTML, "loading");
    sML.removeClass(O.HTML, "busy");

    O.stamp("Book Loaded");
    O.log("Book Loaded.", "/*");
    E.dispatch("bibi:loadBook");

    L.open();

};


L.open = function() {

    window.removeEventListener("resize", L.listenResizingWhileLoading);
    delete L.listenResizingWhileLoading;

    R.layout({
        Destination: (S["to"] ? S["to"] : "head")
    });

    setTimeout(function() {
        C.Veil.close(function() {
            setTimeout(function() {
                document.body.click(); // Making iOS browsers to responce for user scrolling immediately
            }, 500);
        });
        L.Opened = true;
        C.note('');
        O.stamp("Enjoy");
        O.log('Enjoy Readings!', "-0");
        E.dispatch("bibi:open");
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
    E.dispatch("bibi:initializeReader");
};


R.reset = function() {
    R.Main.Book.innerHTML = R.Sub.innerHTML = "";
    L.Loaded = false, R.Started = false;
    R.AllItems = [], R.NonLinearItems = [];
    R.Spreads = [], R.Items = [], R.Pages = [];
    R.CoverImage = { Path: "" };
    R.Current = {};
};


R.resetStage = function() {
    R.Stage = {};
    R.Columned = false;
    R.Main.Book.style.padding = R.Main.Book.style.width = R.Main.Book.style.height = "";
    R.Stage.Width   = window.innerWidth;
    R.Stage.Height  = window.innerHeight;
    if(S.RVM == "paged") {
        if(C.Indicator) R.Stage.Height -= parseFloat(getComputedStyle(C.Indicator.Progress.Bar).height);
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
    O.stamp("Reset Spread " + Spread.SpreadIndex + " End");
};

R.DefaultPageRatio = { X: 103, Y: 148 };//{ X: 1, Y: Math.sqrt(2) };

R.resetItem = function(Item) {
    O.stamp("Reset Item " + Item.ItemIndex + " Start");
    O.stamp("Reset Start", Item.TimeCard);
    E.dispatch("bibi:before:resetItem", Item);
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
    E.dispatch("bibi:resetItem", Item);
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
    if(S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        var BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.AXIS.L] / R.DefaultPageRatio[S.AXIS.B]);
        //if(/^tb/.test(S.BWM)) {
        //    PageL = BunkoL;
        //} else {
            var StageHalfL = Math.floor((StageL - PageGap) / 2);
            if(StageHalfL >= BunkoL) {
                Item.Spreaded = true;
                PageL = StageHalfL;
            }
        //}
    }
    Item.style[S.SIZE.b] = PageB + "px";
    Item.style[S.SIZE.l] = PageL + "px";
    R.resetItem.asReflowableItem.adjustContent(Item, PageB, PageL, PageGap);
    var ItemL = sML.UA.InternetExplorer ? Item.Body["client" + S.SIZE.L] : Item.HTML["scroll" + S.SIZE.L];
    var Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
    ItemL = (PageL + PageGap) * Pages - PageGap;
    Item.style[S.SIZE.l] = ItemL + "px";
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
        Page.style[            S.SIZE.b] = PageB + "px";
        Page.style[            S.SIZE.l] = PageL + "px";
        Page.style[            S.BASE.b] = (PageL + PageGap) * i + "px";
        Page.Item = Item, Page.Spread = Spread;
        Page.PageIndexInItem = Item.Pages.length;
        Item.Pages.push(Page);
    }
    return Item;
};
R.resetItem.asReflowableItem.adjustContent = function(Item, PageB, PageL, PageGap) {
    E.dispatch("bibi:before:resetItem.asReflowableItem.adjustContent", Item);
    var WordWrappingStyleSheetIndex = sML.appendStyleRule("*", "word-wrap: break-word;", Item.contentDocument); ////
    R.resetItem.asReflowableItem.adjustContent.fitImages(Item, PageB, PageL);
    R.resetItem.asReflowableItem.adjustContent.columify(Item, PageB, PageL, PageGap);
    if(S["page-breaking"]) R.resetItem.asReflowableItem.adjustContent.breakPages(Item, PageB);
    sML.deleteStyleRule(WordWrappingStyleSheetIndex, Item.contentDocument); ////
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
        //sML.log(PBR);
        //sML.log(Item.ItemIndex + ": " + BreakPoint);
        if(ComputedStyle.pageBreakBefore == "always") {
            if(!this.BibiPageBreakerBefore) this.BibiPageBreakerBefore = this.parentNode.insertBefore(sML.create("span", { className: "bibi-page-breaker-before" }, { display: "block" }), this);
            Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
            this.BibiPageBreakerBefore.style[PBR[3]] = Add + "px";
        }
        if(ComputedStyle.pageBreakAfter == "always") {
            BreakPoint += Add + this["offset" + PBR[2]];
            //sML.log(Item.ItemIndex + ": " + BreakPoint);
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
    if(S.SLA == "horizontal" && !/fill-spread/.test(ItemRef["bibi:layout"])) {
        var BunkoL = Math.floor(PageB * R.DefaultPageRatio[S.AXIS.L] / R.DefaultPageRatio[S.AXIS.B]);
        //if(/^tb/.test(S.BWM)) {
        //    PageL = BunkoL;
        //} else {
            var StageHalfL = Math.floor((StageL - R.Stage.PageGap) / 2);
            if(StageHalfL > BunkoL) {
                Item.Spreaded = true;
                PageL = StageHalfL;
            }
        //}
    }
    Item.style[S.SIZE.b] = ItemBox.style[S.SIZE.b] = PageB + "px";
    Item.style[S.SIZE.l] = ItemBox.style[S.SIZE.l] = PageL + "px";
    if(Item.ImageItem) {
        if(Item.Body["scroll" + S.SIZE.B] <= PageB && Item.Body["scroll" + S.SIZE.L] <= PageL) {
            var ItemBodyComputedStyle = getComputedStyle(Item.Body);
            Item.style.width = Item.Body.offsetWidth + parseFloat(ItemBodyComputedStyle.marginLeft) + parseFloat(ItemBodyComputedStyle.marginRight) + "px";
        } else {
            if((S.SLD == "ttb" && Item.Body["scroll" + S.SIZE.B] > PageB) || (S.SLA == "horizontal" && Item.Body["scroll" + S.SIZE.L] > PageL)) {
                var TransformOrigin = (/rl/.test(Item.HTML.WritingMode)) ? "100% 0" : "0 0";
            } else {
                var TransformOrigin =  "50% 0";
            }
            var Scale = Math.floor(Math.min(PageB / Item.Body["scroll" + S.SIZE.B], PageL / Item.Body["scroll" + S.SIZE.L]) * 100) / 100;
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
            if(Item.Pair) SpreadViewPort.Width += Item.Pair.ItemRef["viewport"].width;
            else if(ItemRef["page-spread"] == "right" || ItemRef["page-spread"] == "left") SpreadViewPort.Width += SpreadViewPort.Width;
            Scale = Math.min(
                PageB / SpreadViewPort[S.SIZE.B],
                PageL / SpreadViewPort[S.SIZE.L]
            );
            //if(S.SLA != "vertical" && SpreadViewPort[S.SIZE.B] * Scale < PageB) Scale = PageB / SpreadViewPort[S.SIZE.B];
        } else {
            Scale = Math.min(
                PageB / ItemRef["viewport"][S.SIZE.b],
                PageL / ItemRef["viewport"][S.SIZE.l]
            );
        }
        if(Item.Pair) Item.Pair.Scale = Scale;
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
    //if(Spread.Items.length == 1 && (ItemRef["page-spread"] == "left" || ItemRef["page-spread"] == "right")) Page.style.width = parseFloat(Page.style.width) * 2 + "px";
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
        var theWidth = C.Panel.Navigation.scrollWidth - window.innerWidth;
        C.Panel.NavigationBox.scrollLeft = C.Panel.NavigationBox.scrollWidth - window.innerWidth;
    }
*/};


R.layoutSpread = function(Spread) {
    O.stamp("Layout Spread " + Spread.SpreadIndex + " Start");
    var SpreadBox = Spread.SpreadBox;
    SpreadBox.style.padding = "";
    var SpreadBoxPaddingBefore = 0, SpreadBoxPaddingAfter = 0;
    if(S.SLA == "horizontal") {
        // Set padding-start + padding-end of SpreadBox
        if(SpreadBox.offsetHeight < R.Stage[S.SIZE.B]) {
            SpreadBoxPaddingTop    = Math.floor((R.Stage[S.SIZE.B] - SpreadBox.offsetHeight) / 2);
            SpreadBoxPaddingBottom = R.Stage[S.SIZE.B] - (SpreadBoxPaddingTop + SpreadBox.offsetHeight);
            SpreadBox.style.paddingTop    = SpreadBoxPaddingTop + "px";
            SpreadBox.style.paddingBottom = SpreadBoxPaddingBottom + "px";
        }
    }
    if(S.BRL == "pre-paginated") {
        var ThePadding = Math.ceil((R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        Spread.Pages.forEach(function(Page) {
            var ThePaddingWithPage = Math.ceil((R.Stage[S.SIZE.L] - Page["offset" + S.SIZE.L]) / 4);
            if(ThePaddingWithPage > ThePadding) ThePadding = ThePaddingWithPage;
        });
        SpreadBoxPaddingBefore = SpreadBoxPaddingAfter = ThePadding;
    } else if(S.RVM == "paged") {
        if(Spread.SpreadIndex != 0) {
            SpreadBoxPaddingBefore = R.Stage.PageGap;
        }
    } else {
        if(Spread.SpreadIndex == 0) {
            SpreadBoxPaddingBefore = Math.floor((R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        } else {
            SpreadBoxPaddingBefore = R.Stage.PageGap;
        }
        if(Spread.SpreadIndex == R.Spreads.length - 1) {
            SpreadBoxPaddingAfter  = Math.ceil( (R.Stage[S.SIZE.L] - SpreadBox["offset" + S.SIZE.L]) / 2);
        }
    }
    if(SpreadBoxPaddingBefore > 0) SpreadBox.style["padding" + S.BASE.B] = SpreadBoxPaddingBefore + "px";
    if(SpreadBoxPaddingAfter  > 0) SpreadBox.style["padding" + S.BASE.A] = SpreadBoxPaddingAfter  + "px";
    // Adjust R.Main.Book (div#epub-content-main)
    var MainContentLength = 0;
    R.Spreads.forEach(function(Spread) {
        MainContentLength += Spread.SpreadBox["offset" + S.SIZE.L];
    });
    R.Main.Book.style[S.SIZE.b] = "";
    R.Main.Book.style[S.SIZE.l] = MainContentLength + "px";
    O.stamp("Layout Spread " + Spread.SpreadIndex + " End");
};


/*
R.layoutStage = function() {
    for(var L = R.Spreads.length, i = 0, StageLength = 0; i < L; i++) StageLength += R.Spreads[i].SpreadBox["offset" + S.SIZE.L];
    R.Main.Book.style[S.SIZE.l] = StageLength + "px";
};
*/


R.layout = function(Option) {

    /*
        Option: {
            Destination: BibiDestination,
            Reset: Boolean,
            Setting: BibiSetting (Optional),
            callback: Function (Optional)
        }
    */

    if(R.Layouting) return false;
    R.Layouting = true;

    O.log('Laying out...', "*:");
    O.stamp("Layout Start");

    window.removeEventListener(O["resize"], R.onresize);
    R.Main.removeEventListener("scroll", R.onscroll);

    sML.addClass(O.HTML, "busy");
    sML.addClass(O.HTML, "layouting");
    C.note('Layouting...');

    if(!Option) Option = {};

    if(!Option.Destination) {
        R.getCurrent();
        var CurrentPage = R.Current.Pages.StartPage;
        Option.Destination = {
            SpreadIndex: CurrentPage.Spread.SpreadIndex,
            PageProgressInSpread: CurrentPage.PageIndexInSpread / CurrentPage.Spread.Pages.length
        }
    }

    if(Option.Setting) S.update(Option.Setting);

    O.log([
        'reader-view-mode: "' + S.RVM + '"',
        'spread-layout-direction: "' + S.SLD + '"',
        'apparent-reading-direction: "' + S.ARD + '"'
    ].join(' / '), "-*");

    if(Option.Reset || R.ToRelayout) {
        R.ToRelayout = false;
        R.resetStage();
        R.Spreads.forEach(function(Spread) {
            R.resetSpread(Spread);
            R.layoutSpread(Spread);
        });
        R.resetPages();
        R.resetNavigation();
    } else {
        R.Spreads.forEach(function(Spread) {
            R.layoutSpread(Spread);
        });
    }

    R.Columned = false;
    for(var i = 0, L = R.Items.length; i < L; i++) {
        var Style = R.Items[i].HTML.style;
        if(Style["-webkit-column-width"] || Style["-moz-column-width"] || Style["-ms-column-width"] || Style["column-width"]) {
            R.Columned = true;
            break;
        }
    }

    R.focus(Option.Destination, { Duration: 0 });

    sML.removeClass(O.HTML, "layouting");
    sML.removeClass(O.HTML, "busy");
    C.note('');

    window.addEventListener(O["resize"], R.onresize);
    R.Main.addEventListener("scroll", R.onscroll);

    R.Layouting = false;

    if(typeof Option.callback == "function") Option.callback();

    O.stamp("Layout End");
    O.log('Laid out.', "/*");
    E.dispatch("bibi:layout");

    return S;

};

R.onscroll = function() {
    if(!L.Opened) return;
    clearTimeout(R.Timer_onscroll);
    R.Timer_onscroll = setTimeout(function() { E.dispatch("bibi:scrolled"); }, 123);
};

R.onresize = function() {
    if(!L.Opened) return;
    clearTimeout(R.Timer_onresize);
    R.Timer_onresize = setTimeout(R.onresized, O.Mobile ? 888 : 222);
};

R.onresized = function() {
    R.layout({
        Reset: true,
        Setting: (Option && Option.Setting ? Option.Setting : undefined)
    });
    E.dispatch("bibi:resized");
};

R.changeView = function(RVM) {
    if(S["reader-view-mode-fixed"] || typeof RVM != "string" || S.RVM == RVM || !/^(paged|horizontal|vertical)$/.test(RVM)) return false;
    if(L.Opened) {
        if(RVM != "paged") {
            R.Spreads.forEach(function(Spread) {
                Spread.style.opacity = "";
            });
        }
        R.layout({
            Reset: true,
            Setting: { "reader-view-mode": RVM },
            callback: function() {
                //Option["page-progression-direction"] = S.PPD;
                E.dispatch("bibi:changeView", RVM);
            }
        });
    } else {
        S.update({ "reader-view-mode": RVM });
        return L.play();
    }
};


R.getCurrentPages = function() {
    var FrameScrollCoord = sML.Coord.getScrollCoord(R.Main);
    var FrameClientSize  = sML.Coord.getClientSize(R.Main);
    FrameScrollCoord = {
        Left:   FrameScrollCoord.X,
        Right:  FrameScrollCoord.X + FrameClientSize.Width,
        Top:    FrameScrollCoord.Y,
        Bottom: FrameScrollCoord.Y + FrameClientSize.Height,
    };
    FrameScrollCoord.Before = FrameScrollCoord[S.BASE.B] / R.Scale;
    FrameScrollCoord.After  = FrameScrollCoord[S.BASE.A] / R.Scale;
    var Pages = [], Ratio = [], Status = [], BiggestRatio = 0, Done = false;
    R.Pages.forEach(function(Page) {
        if(!Done) {
            var PageCoord = sML.getCoord(Page);
            PageCoord.Before = PageCoord[S.BASE.B];
            PageCoord.After  = PageCoord[S.BASE.A];
            var LengthInside = Math.min(FrameScrollCoord.After * S.AXIS.PM, PageCoord.After * S.AXIS.PM) - Math.max(FrameScrollCoord.Before * S.AXIS.PM, PageCoord.Before * S.AXIS.PM);
            var PageRatio = (LengthInside <= 0 || !PageCoord[S.SIZE.L] || isNaN(LengthInside)) ? 0 : Math.round(LengthInside / PageCoord[S.SIZE.L] * 100);
            if(PageRatio <= 0) {
                if(Pages.length) Done = true;
            } else if(PageRatio > BiggestRatio) {
                Pages[0] = Page;
                Ratio[0] = PageRatio;
                Status[0] = R.getCurrentPages.getStatus(PageRatio, PageCoord, FrameScrollCoord);
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
    R.Current.PageNumber = R.Current.Page.PageIndex + 1;
    R.Current.Item = R.Current.Page.Item;
    R.Current.ItemNumber = R.Current.Item.ItemIndex + 1;
    R.Current.Percent = Math.round(R.Current.PageNumber / R.Pages.length * 100);
    R.Pages.forEach(function(Page) {
        [Page, Page.Item, Page.Item.ItemBox, Page.Spread, Page.Spread.SpreadBox].forEach(function(Ele) {
            sML.removeClass(Ele, "current");
            sML.addClass(Ele, "not-current");
        });
    });
    R.Current.Pages.forEach(function(Page) {
        [Page, Page.Item, Page.Item.ItemBox, Page.Spread, Page.Spread.SpreadBox].forEach(function(Ele) {
            sML.removeClass(Ele, "not-current");
            sML.addClass(Ele, "current");
        });
    });
    return R.Current;
};


R.focus = function(Destination, ScrollOption) {
    if(R.Moving) return false;
    Destination = R.focus.hatchDestination(Destination);
    if(!Destination) return false;
    R.Moving = true;
    var FocusPoint = 0;
    if(S["book-rendition-layout"] == "reflowable") {
        if(Destination.Edge == "head") {
            FocusPoint = (S.SLD != "rtl") ? 0 : R.Main.Book["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.SIZE.L];
        } else if(Destination.Edge == "foot") {
            FocusPoint = (S.SLD == "rtl") ? 0 : R.Main.Book["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Main)[S.SIZE.L];
        } else {
            FocusPoint = O.getElementCoord(Destination.Page)[S.AXIS.L];
            if(Destination.Side == "after") FocusPoint += (Destination.Page["offset" + S.SIZE.L] - window["inner" + S.SIZE.L]) * S.AXIS.PM;
            if(S.SLD == "rtl") FocusPoint += Destination.Page.offsetWidth - window.innerWidth;
        }
    } else {
        if(window["inner" + S.SIZE.L] > Destination.Page.Spread["offset" + S.SIZE.L]) {
            FocusPoint = O.getElementCoord(Destination.Page.Spread)[S.AXIS.L];
            FocusPoint -= Math.floor((window["inner" + S.SIZE.L] - Destination.Page.Spread["offset" + S.SIZE.L]) / 2);
        } else {
            FocusPoint = O.getElementCoord(Destination.Page)[S.AXIS.L];
            if(window["inner" + S.SIZE.L] > Destination.Page["offset" + S.SIZE.L]) FocusPoint -= Math.floor((window["inner" + S.SIZE.L] - Destination.Page["offset" + S.SIZE.L]) / 2);
        }
    }
    if(typeof Destination.TextNodeIndex == "number") R.selectTextLocation(Destination); // Colorize Destination with Selection
    var ScrollTo = { X: 0, Y: 0 }; 
    ScrollTo[S.AXIS.L] = FocusPoint * R.Scale;
    var callback = function() { R.getCurrent(); R.Moving = false; };
    if(S.RVM == "paged") {
        sML.scrollTo(R.Main, ScrollTo, { Duration: 0, callback: callback });/*
        var GoAhead = (function() {
            CurrentScrollLength = R.Main["scroll" + (S.SLA == "horizontal" ? "Left" : "Top")];
            if(S.SLD == "rtl") return (FocusPoint < CurrentScrollLength);
            else               return (FocusPoint > CurrentScrollLength);
        })();
        var FlippingDuration = 50;
        sML.style(R.Main, {
            transition: "ease-out " + (FlippingDuration / 1000) + "s"
        });
        sML.addClass(O.HTML, "flipping-" + (GoAhead ? "ahead" : "astern"));
        setTimeout(function() {
            sML.style(R.Main, {
                transition: "none"
            });
            sML.scrollTo(R.Main, ScrollTo, { Duration: 1,
                callback: function() {
                    if(S.RVM == "paged") {
                        R.Spreads.forEach(function(Spread) {
                            if(Spread == Destination.Item.Spread) Spread.style.opacity = 1;
                            //else                                Spread.style.opacity = 0;
                        });
                        sML.removeClass(O.HTML, "flipping-ahead");
                        sML.removeClass(O.HTML, "flipping-astern");
                    }
                    E.dispatch("bibi:focus", Destination);
                }
            });
        }, FlippingDuration);*/
    } else {
        if(!ScrollOption) ScrollOption = {};
        ScrollOption.callback = callback;
        sML.scrollTo(R.Main, ScrollTo, ScrollOption);
    }
    return false;
};


R.focus.hatchDestination = function(Destination) { // from Page, Element, or Edge
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
            Destination.Page = R.focus.getNearestPageOfElement(Destination.Element);
        } else if(!Destination.Page){
                 if(typeof Destination.PageIndexInSpread    == "number") Destination.Page = Destination.Spread.Pages[Destination.PageIndexInSpread];
            else if(typeof Destination.PageProgressInSpread == "number") Destination.Page = Destination.Spread.Pages[Math.floor(Destination.Spread.Pages.length * Destination.PageProgressInSpread)];
            else                                                         Destination.Page = Destination.Item.Pages[0];
        }
    }
    if(!Destination.Page) return null;
    Destination.Item = Destination.Page.Item;
    Destination.Spread = Destination.Page.Spread;
    return Destination;
};

R.focus.getNearestPageOfElement = function(Ele) {
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
        for(var i = 0, L = Item.Pages.length; i < L; i++) {
            ElementCoordInItem -= Item.Pages[i]["offset" + S.SIZE.L];
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


R.move = function(Distance, ScrollOption) {
    if(R.Moving || !L.Opened || isNaN(Distance)) return false;
    Distance *= 1;
    if(Distance != -1) Distance = 1;
    if(Distance > 0) {
        var CurrentEdge = "EndPage";
        var Side = "before";
    } else {
        var CurrentEdge = "StartPage";
        var Side = "after";
    }
    R.getCurrent();
    var CurrentPage = R.Current.Pages[CurrentEdge];
    if(
        R.Columned ||
        S.BRL == "pre-paginated" ||
        CurrentPage.Item.PrePaginated ||
        CurrentPage.Item.Outsourcing ||
        CurrentPage.Item.Pages.length == 1 ||
        (Distance < 0 && CurrentPage.PageIndexInItem == 0) ||
        (Distance > 0 && CurrentPage.PageIndexInItem == CurrentPage.Item.Pages.length - 1)
    ) {
        var CurrentPageStatus = R.Current.Pages[CurrentEdge + "Status"];
        var CurrentPageRatio  = R.Current.Pages[CurrentEdge + "Ratio"];
        if(/(oversize)/.test(CurrentPageStatus)) {
            if(Distance > 0) {
                     if(CurrentPageRatio >= 90)             Side = "before";
                else if(/entering/.test(CurrentPageStatus)) Side = "before", Distance =  0;
                else if( /entered/.test(CurrentPageStatus)) Side = "after",  Distance =  0;
            } else {
                     if(CurrentPageRatio >= 90)             Side = "after";
                else if( /passing/.test(CurrentPageStatus)) Side = "before", Distance =  0;
                else if(  /passed/.test(CurrentPageStatus)) Side = "after",  Distance =  0;
            }
        } else {
            if(Distance > 0) {
                     if(   /enter/.test(CurrentPageStatus)) Side = "before", Distance =  0;
            } else {
                     if(    /pass/.test(CurrentPageStatus)) Side = "after",  Distance =  0;
            }
        }
        //sML.log([CurrentPageStatus, CurrentPageRatio, Distance, Side].join(" / "));
        var DestinationPageIndex = CurrentPage.PageIndex + Distance;
             if(DestinationPageIndex <                  0) DestinationPageIndex = 0;
        else if(DestinationPageIndex > R.Pages.length - 1) DestinationPageIndex = R.Pages.length - 1;
        var DestinationPage = R.Pages[DestinationPageIndex];
        if(S.BRL == "pre-paginated" && DestinationPage.Item.Pair) {
            if(S.SLA == "horizontal" && window["inner" + S.SIZE.L] > DestinationPage.Spread["offset" + S.SIZE.L]) {
                if(Distance < 0 && DestinationPage.PageIndexInSpread == 0) DestinationPage = DestinationPage.Spread.Pages[1];
                if(Distance > 0 && DestinationPage.PageIndexInSpread == 1) DestinationPage = DestinationPage.Spread.Pages[0];
            }
        }
        R.focus({ Page: DestinationPage, Side: Side }, ScrollOption);
    } else {
        R.Moving = true;
        if(!ScrollOption) ScrollOption = {};
        ScrollOption.callback = function() { R.getCurrent(); R.Moving = false; };
        sML.scrollTo(R.Main, (function(ScrollCoord) {
            var ScrollCoord = sML.Coord.getScrollCoord(R.Main);
            switch(S.SLD) {
                case "ttb": return { Y: ScrollCoord.Y + (window.innerHeight + R.Stage.PageGap) * Distance      };
                case "ltr": return { X: ScrollCoord.X + (window.innerWidth  + R.Stage.PageGap) * Distance      };
                case "rtl": return { X: ScrollCoord.X + (window.innerWidth  + R.Stage.PageGap) * Distance * -1 };
            }
        })(), ScrollOption);
    }
    E.dispatch("bibi:move", Distance);
};

R.page = R.scroll = R.move;


R.to = function(BibitoString) {
    return R.focus(R.getBibiToDestination(BibitoString));
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


R.Scale = 1;

R.zoom = function(Scale) {
    if(typeof Scale != "number" || Scale <= 0) Scale = 1;
    R.getCurrent();
    var CurrentStartPage = R.Current.Pages.StartPage;
    sML.style(R.Main.Book, { "transform-origin": S.SLD == "rtl" ? "100% 0" : "0 0" });
    if(Scale == 1) {
        O.HTML.style.overflow = "";
        sML.style(R.Main.Book, { transform: "" });
    } else {
        sML.style(R.Main.Book, { transform: "scale(" + Scale + ")" });
        O.HTML.style.overflow = "auto";
    }
    setTimeout(function() {
        R.focus({ Page: CurrentStartPage }, { Duration: 0 });
    }, 0);
    R.Scale = Scale;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Controls

//----------------------------------------------------------------------------------------------------------------------------------------------


C = {}; // Bibi.Controls


C.initialize = function() {
    C.createNotifier();
    C.createVeil();
    C.createPanel();
    C.createSwitches();
    C.createHelp();
    C.createPowered();
};


C.createNotifier = function() {

    C.Notifier = O.Body.appendChild(
        sML.create("div", { id: "bibi-notifier" })
    );

    C.Notifier.Board = C.Notifier.appendChild(
        sML.create("div", { className: "hidden", id: "bibi-notifier-board" })
    );

    C.note = function(Msg, Time) {
        if(!Msg) C.note.Time = 0;
        else     C.note.Time = (typeof Time == "number") ? Time : 3210;
        C.Notifier.Board.innerHTML = '<p>' + Msg + '</p>';
        clearTimeout(C.Notifier.Board.hide_Timer);
        C.Notifier.Board.style.display = "block";
        setTimeout(function() {
            C.Notifier.Board.className = "";
            setTimeout(function() {
                C.Notifier.Board.hide_Timer = setTimeout(function() {
                    C.Notifier.Board.className = "hidden";
                    setTimeout(function() {
                        C.Notifier.Board.style.display = "none"
                    }, 200);
                }, C.note.Time);
            }, 0);
        }, 0);
        if(!O.Mobile) {
            if(O.statusClearer) clearTimeout(O.statusClearer);
            window.status = 'BiB/i: ' + Msg;
            O.statusClearer = setTimeout(function() { window.status = ""; }, C.note.Time);
        }
    };

};


C.createVeil = function() {

    C.Veil = O.Body.appendChild(
        sML.create("div", { id: "bibi-veil",
            State: 1, // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
            open: function(Cb) {
                if(this.State == 1) return (typeof Cb == "function" ? Cb() : this.State);
                this.State = 1;
                this.style.display = "block";
                this.style.zIndex = 100;
                sML.style(this, {
                    transition: "0.5s ease-out",
                    transform: "",
                    opacity: 0.75
                }, function() {
                    if(typeof Cb == "function") Cb();
                });
                return this.State;
            },
            close: function(Cb) {
                if(this.State == 0) return (typeof Cb == "function" ? Cb() : this.State);
                this.State = 0;
                var getTranslate = function(Percent) {
                    if(S.RVM != "vertical") var Axis = "X", PM = (S.PPD == "ltr") ? -1 : 1;
                    else                    var Axis = "Y", PM = -1;
                    return "translate" + Axis + "(" + (Percent * PM) + "%)";
                };
                sML.style(this, {
                    transition: "0.5s ease-in",
                    transform: getTranslate(240),
                    opacity: 0
                }, function() {
                    sML.style(this, {
                        transition: "none",
                        transform: getTranslate(-240)
                    });
                    this.style.zIndex = 1;
                    this.style.display = "none";
                    if(typeof Cb == "function") Cb();
                });
                return this.State;
            },
            toggle: function(Cb) {
                return (this.State == 0 ? this.open(Cb) : this.close(Cb));
            }
        })
    );

    C.Veil.Cover   = C.Veil.appendChild(sML.create("div", { id: "bibi-veil-cover" }));

    var PlayButtonTitle = (O.Mobile ? 'Tap' : 'Click') + ' to Open';
    C.Veil.PlayButton = C.Veil.appendChild(
        sML.create("p", { id: "bibi-veil-play", title: PlayButtonTitle,
            innerHTML: '<span class="non-visual">' + PlayButtonTitle + '</span>',
            play: function(Eve) {
                Eve.stopPropagation();
                L.play();
                //M.post("bibi:play:button:" + location.href);
                E.dispatch("bibi:play:button");
            },
            hide: function() {
                this.removeEventListener("click", C.Veil.PlayButton.play);
                sML.style(this, {
                    opacity: 0,
                    cursor: "default"
                });
            }
        })
    );
    C.Veil.PlayButton.addEventListener("click", C.Veil.PlayButton.play);
    E.add("bibi:play", function() {
        C.Veil.PlayButton.hide()
    });

    E.dispatch("bibi:createVeil");

};


C.createPanel = function() {

    C.Panel = O.Body.appendChild(sML.create("div", { id: "bibi-panel" }));
    C.setToggleAction(C.Panel, {
        open: function(Opt) {
            sML.addClass(O.HTML, "panel-opened");
            E.dispatch("bibi:openPanel");
        },
        close: function(Opt) {
            sML.removeClass(O.HTML, "panel-opened");
            E.dispatch("bibi:closePanel");
        }
    });
    E.add("bibi:command:openPanel",   function(Opt) { C.Panel.open(Opt); });
    E.add("bibi:command:closePanel",  function(Opt) { C.Panel.close(Opt); });
    E.add("bibi:command:togglePanel", function(Opt) { C.Panel.toggle(Opt); });
    C.observeTap(C.Panel).addTapEventListener(function() {
        if(!this.Locked) E.dispatch("bibi:command:togglePanel");
    });

    // Optimize to Scrollbar Size
    sML.appendStyleRule("html.page-rtl div#bibi-panel:after", "bottom: " + (O.Scrollbars.Height) + "px;");

    // Book Info
    C.Panel.BookInfo = C.Panel.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo" })
    );
    C.Panel.BookInfo.Box = C.Panel.BookInfo.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-box" })
    );
    C.Panel.BookInfo.Navigation = C.Panel.BookInfo.Box.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-navigation" })
    );
    C.Panel.BookInfo.Cover = C.Panel.BookInfo.Box.appendChild(
        sML.create("div", { id: "bibi-panel-bookinfo-cover" })
    );

    // Menus
    C.Panel.MenuAlpha = C.Panel.appendChild(sML.create("div", { id: "bibi-panel-menu-alpha", on: { "click": function(Eve) { Eve.stopPropagation(); } } }));
    C.Panel.MenuBeta  = C.Panel.appendChild(sML.create("div", { id: "bibi-panel-menu-beta",  on: { "click": function(Eve) { Eve.stopPropagation(); } } }));

    E.dispatch("bibi:createPanel");

};


C.setToggleAction = function(Ele, Funs) {
    return sML.edit(Ele, {
        Locked: false,
        State: "default",
        open: function(Opt) {
            var This = this;
            if(!Opt) Opt = {};
            if(This.State == "active") {
                This.callback(Opt.callback, 0);
                return This.State;
            }
            This.Locked = true;
            This.State = "active";
            Funs.open.apply(This, arguments);
            This.callback(Opt.callback);
            setTimeout(function() { This.Locked = false; }, 1);
            return This.State;
        },
        close: function(Opt) {
            var This = this;
            if(!Opt) Opt = {};
            if(This.State == "default") {
                This.callback(Opt.callback, 0);
                return This.State;
            }
            This.Locked = true;
            This.State = "default";
            Funs.close.apply(This, arguments);
            This.callback(Opt.callback);
            setTimeout(function() { This.Locked = false; }, 1);
            return This.State;
        },
        toggle: function(Opt) {
            return (this.State == "default" ? this.open(Opt) : this.close(Opt));
        },
        callback: function(callback, Time) {
            if(typeof callback == "function") setTimeout(callback, (typeof Time == "number" ? Time : 250));
        }
    });
};


C.createSwitches = function() {

    C.SwitchAlpha = O.Body.appendChild(sML.create("div", { id: "bibi-switch-alpha", on: { "click": function(Eve) { Eve.stopPropagation(); } } }));
    C.SwitchBeta  = O.Body.appendChild(sML.create("div", { id: "bibi-switch-beta",  on: { "click": function(Eve) { Eve.stopPropagation(); } } }));

    // Panel Switch
    C.PanelSwitch = C.addButton({ className: "bibi-button-toggle-panel",
        Type: "toggle",
        Area: C.SwitchAlpha,
        Labels: {
            "default": { ja: 'メニューを開く',   en: 'Open Menu'  },
            "active":  { ja: 'メニューを閉じる', en: 'Close Menu' }
        },
        execute: function() {
            C.Panel.toggle();
        }
    });
    E.add("bibi:openPanel",  function() { C.setState(C.PanelSwitch, "active"); });
    E.add("bibi:closePanel", function() { C.setState(C.PanelSwitch, ""); });
    E.add("bibi:start", function() {
        sML.style(C.PanelSwitch, { display: "block" });
    });

};


C.createHelp = function() {

    C.Help = O.Body.appendChild(sML.create("div", { id: "bibi-help" }));
    C.Help.Message = C.Help.appendChild(sML.create("p", { className: "hidden", id: "bibi-help-message" }));

    C.Help.show = function(HelpText) {
        C.Help.Message.innerHTML = HelpText;
        C.Help.className = "shown";
    };
    C.Help.hide = function() {
        C.Help.className = "";
    };

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
        "html.appearance-ltr div#bibi-help",
        "html.appearance-rtl div#bibi-help",
        "html.page-rtl.panel-opened div#bibi-help"
    ].join(", "), "bottom: " + (O.Scrollbars.Height) + "px;");
    sML.appendStyleRule([
        "html.appearance-ttb div#bibi-help",
        "html.page-ltr.panel-opened div#bibi-help",
        "html.veil-opened div#bibi-help"
    ].join(", "), "bottom: 0;");

};


C.createPowered = function() {

    C.Powered = O.Body.appendChild(sML.create("div", { id: "bibi-powered", innerHTML: [
        '<p>',
            '<a href="http://bibi.epub.link" target="_blank" title="BiB/i | Web Site">',
                '<span>BiB/i</span>',
                '<img class="bibi-logo-white" alt="" src="../../bib/i/res/images/bibi-logo_white.png" />',
                '<img class="bibi-logo-black" alt="" src="../../bib/i/res/images/bibi-logo_black.png" />',
            '</a>',
        '</p>'
    ].join("") }));

    // Optimize to Scrollbar Size
    sML.appendStyleRule([
        "html.appearance-ltr div#bibi-powered",
        "html.appearance-rtl div#bibi-powered",
        "html.page-rtl.panel-opened div#bibi-powered"
    ].join(", "), "bottom: " + (O.Scrollbars.Height) + "px;");
    sML.appendStyleRule([
        "html.appearance-ttb div#bibi-powered",
        "html.page-ltr.panel-opened div#bibi-powered",
        "html.veil-opened div#bibi-powered"
    ].join(", "), "bottom: 0;");

};


C.addButtonGroup = function(Param) {
    if(!Param) Param = {};
    var Area = (Param.Area && Param.Area.tagName) ? Param.Area : C.Panel.MenuBeta;
    var Group = Area.appendChild(document.createElement("ul"));
    return Group;
};


C.addButton = function(Param, Fun) {
    if(!Param) Param = {};
    var Group = (Param.Group && /^ul$/i.test(Param.Group.tagName)) ? Param.Group : C.addButtonGroup(Param);
    if(!Group.Buttons) Group.Buttons = [];
    var Box = Group.appendChild(document.createElement("li"));
    if(typeof Param.Type != "string" || !/^(normal|toggle|radio)$/.test(Param.Type)) Param.Type = "normal";
    var ButtonClassName = ["bibi-button", "bibi-button-" + Param.Type];
    if(typeof Param.className == "string" && Param.className) ButtonClassName.push(Param.className);
    var Button = Box.appendChild(
        sML.create((typeof Param.tagName == "string" ? Param.tagName : "span"), { className:  ButtonClassName.join(" "), BibiButton: true, Area: Group.Area, Group: Group, Box: Box, Type: Param.Type })
    );
    Group.Buttons.push(Button);
    for(var Attribute in Param) {
        switch(Attribute) {
            case "tagName": case "className": case "extraHTML": case "Area": case "Group": case "Box": continue;
            default: Button[Attribute] = Param[Attribute];
        }
    }
    Button.Label = Button.appendChild(sML.create("span", { className: "bibi-button-label" }));
    if(typeof Param.extraHTML == "string") Button.innerHTML = Button.innerHTML + Param.extraHTML;
    C.setLabels(Button);
    C.observeTap(Button);
    C.setFeedback(Button);
    if(typeof Fun != "function") {
        for(EventName in Fun) {
            if(typeof Fun[EventName] != "function") continue;
            if(eventname == "tap") {
                Button.execute = Fun["tap"];
                continue;
            }
            Button.addEventListener(EventName, function(Eve) {
                Eve.stopPropagation();
                if((Button.Type == "toggle" || Button.Type == "radio") && Button.State == "active" && Button.PreviousState == "active") return false;
                return Fun[EventName].apply(Button, arguments);
            });
        }
    } else {
        Button.execute = Fun;
    }
    if(typeof Button.execute == "function") Button.addTapEventListener(Button.execute);
    return Button;
};


C.setLabels = function(Ele) {
    if(!Ele.Labels || !Ele.Labels["default"]) Ele.Labels = { "default": "" };
    else for(var State in Ele.Labels) {
             if(!Ele.Labels[State])                   Ele.Labels[State] = "";
        else if(typeof Ele.Labels[State] == "string") Ele.Labels[State] = Ele.Labels[State];
        else if(Ele.Labels[State][O.Language])        Ele.Labels[State] = Ele.Labels[State][O.Language];
        else if(Ele.Labels[State]["default"])         Ele.Labels[State] = Ele.Labels[State]["default"];
        else if(Ele.Labels[State]["en"])              Ele.Labels[State] = Ele.Labels[State]["en"];
        else                                          Ele.Labels[State] = "";
    }
    return Ele;
};


C.observeTap = function(Ele) {
    Ele.addEventListener(O["touchstart"], function(Eve) {
        clearTimeout(Ele.TapCounter);
        Ele.TouchStart = { Time: new Date(), X: Eve.pageX, Y: Eve.pageY };
        Ele.TapCounter = setTimeout(function() { Ele.TouchStart = undefined; }, 300);
    });
    Ele.addEventListener(O["touchend"], function(Eve) {
        Ele.TouchEnd   = { Time: new Date(), X: Eve.pageX, Y: Eve.pageY };
        if(Ele.TouchStart && (Ele.TouchEnd.Time - Ele.TouchStart.Time) < 300 && Math.abs(Ele.TouchEnd.X - Ele.TouchStart.X) < 5 && Math.abs(Ele.TouchEnd.Y - Ele.TouchStart.Y) < 5) E.dispatch("bibi:tap", Eve, Ele);
    });
    Ele.addTapEventListener = function(Fun) {
        E.add("bibi:tap", function(Eve) { return Fun.call(Ele, Eve); }, Ele);
        return Ele;
    };
    return Ele;
};


C.setFeedback = function(Ele) {
    if(!Ele.isAvailable) Ele.isAvailable = function() { return true; };
    Ele.ontap = (function() {
        switch(Ele.Type) {
            case "toggle": return function() {
                var This = this;
                C.setState(This, This.State == "default" ? "active" : "default");
            };
            case "radio": return function() {
                var This = this;
                C.setState(This, "active");
                This.Group.Buttons.forEach(function(Button) {
                    if(Button != This) C.setState(Button, "");
                });
            };
            default: return function() {
                var This = this;
                C.setState(This, "active");
                clearTimeout(This.Timer_deactivate);
                Ele.Timer_deactivate = setTimeout(function() {
                    C.setState(This, "");
                }, 200);
            };
        }
    })();
    Ele.tap = function(Eve) {
        if(!Ele.isAvailable(Eve)) return Ele;
        Ele.ontap();
        Ele.hideHelp();
        return Ele;
    };
    Ele.hover = function(Eve) {
        if(Ele.Hover || !Ele.isAvailable(Eve)) return Ele;
        Ele.Hover = true;
        sML.addClass(Ele, "hover");
        Ele.showHelp();
        return Ele;
    };
    Ele.unhover = function(Eve) {
        if(!Ele.Hover) return Ele;
        Ele.Hover = false;
        sML.removeClass(Ele, "hover");
        Ele.hideHelp();
        return Ele;
    };
    Ele.showHelp = function() {
        if(Ele.Labels && Ele.Labels[Ele.State]) C.Help.show(Ele.Labels[Ele.State]);
        return Ele;
    };
    Ele.hideHelp = function() {
        C.Help.hide();
        return Ele;
    };
    E.add("bibi:tap", Ele.tap, Ele);
    if(!O.Mobile) {
        Ele.addEventListener("mouseover", function(Eve) { Ele.hover(Eve); });
        Ele.addEventListener("mouseout",  function(Eve) { Ele.unhover(Eve); });
    }
    C.setState(Ele, "default");
    return Ele;
};


C.setState = function(Ele, State) {
    if(!State) State = "default";
    Ele.PreviousState = Ele.State;
    if(State == Ele.State) return;
    Ele.State = State;
    if(Ele.Labels && Ele.Labels[Ele.State]) {
        Ele.title = Ele.Labels[Ele.State];
        if(Ele.Label) Ele.Label.innerHTML = Ele.Labels[Ele.State];
    }
    sML.replaceClass(Ele, Ele.PreviousState, Ele.State);
    return Ele.State;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Presets

//----------------------------------------------------------------------------------------------------------------------------------------------


P = {}; // Bibi.Preset


P.initialize = function() {
    O.apply(Bibi.Preset, P);
    if(!/^([\w\d]+:)?\/+/.test(P["bookshelf"])) P["bookshelf"] = O.getPath(location.href.split("?")[0].replace(/[^\/]*$/, "") + P["bookshelf"]);
    if(!/^(horizontal|vertical|paged)$/.test(P["reader-view-mode"])) P["reader-view-mode"] = "paged";
    ["reader-view-mode-fided", "autostart", "play-in-new-window"].forEach(function(Property) {
        if(typeof P[Property] == "string") P[Property] = /^(yes|no|mobile|desktop)$/.test(P[Property]) ? P[Property] : "no";
        else                               P[Property] = P[Property] ? "yes" : "no";
    });
    ["spread-gap", "spread-margin", "item-padding-left", "item-padding-right",  "item-padding-top",  "item-padding-bottom"].forEach(function(Property) {
        P[Property] = (typeof P[Property] != "number" || P[Property] < 0) ? 0 : Math.round(P[Property]);
    });
    if(!(P["trustworthy-origins"] instanceof Array)) P["trustworthy-origins"] = [];
    if(P["trustworthy-origins"][0] != location.origin) P["trustworthy-origins"].unshift(location.origin);
    P["extensions"].forEach(function(Extension) {
        if(typeof Extension["src"] != "string" || !Extension["src"]) return;
        X.ExtensionsInPreset.push(Extension);
    });
    P.Initialized = new Promise(function(resolve, reject) {
        if(X.ExtensionsInPreset.length) return X.loadExtensionsInPreset().then(resolve);
        resolve();
    });
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
        if(/^([\w\d]+:)?\/\//.test(Book)) { // absolute URI
            if(/^\/\//.test(Book)) Book = location.protocol + Book;
            if(Book.replace(/^([\w\d]+:\/\/[^\/]+).*$/, "$1") != location.origin) return undefined; // allow same origin
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
                    case "reader-view-mode-fixed":
                    case "autostart":
                    case "play-in-new-window":
                    case "hide-arrows":
                        PnV[1] = "yes";
                        break;
                    default:
                        PnV[0] = undefined;
                }
            } else {
                switch(PnV[0]) {
                    case "parent-uri":
                    case "parent-origin":
                        PnV[1] = U.decode(PnV[1]);
                        break;
                    case "reader-view-mode":
                        if(!/^(horizontal|vertical|paged)$/.test(PnV[1])) PnV[1] = undefined;
                        break;
                    case "reader-view-mode-fixed":
                    case "autostart":
                    case "play-in-new-window":
                    case "hide-arrows":
                             if(PnV[1] == "true" ) PnV[1] = "yes";
                        else if(PnV[1] == "false") PnV[1] = "no";
                        else if(!/^(yes|no|mobile|desktop)$/.test(PnV[1])) PnV[1] = undefined;
                        break;
                    case "to":
                        PnV[1] = R.getBibiToDestination(PnV[1]);
                        break;
                    case "nav":
                        PnV[1] = /^[1-9]\d*$/.test(PnV[1]) ? PnV[1] * 1 : undefined;
                        break;
                    case "preset":
                    case "pipi-id":
                        break;
                    default:
                        PnV[0] = undefined;
                }
            }
            if(PnV[0] && typeof PnV[1] == "string") U[PnV[0]] = PnV[1];
        });
    };

    if(H["bibi"]) {
        applyToU(H["bibi"]);
    }

    if(H["pipi"]) {
        applyToU(H["pipi"]);
        if(U["parent-origin"] && U["parent-origin"] != location.origin) P["trustworthy-origins"].push(U["parent-origin"]);
        if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]pipi\([^\)]*\)$/g, ""));　
    }

    if(H["epubcfi"]) {
        U["epubcfi"] = H["epubcfi"];
        E.add("bibi:ready", function() {
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
    S.reset();
    S["reader-view-mode-fixed"] = S.decide("reader-view-mode-fixed", "Always");
    S["autostart"]              = S.decide("autostart");
    S["play-in-new-window"]     = S.decide("play-in-new-window");
    S["hide-arrows"]            = S.decide("hide-arrows", "Always");
};


S.decide = function(Property, Always) {
         if(U[Property])                return (U[Property] == "yes" || (U[Property] == "mobile" && O.Mobile) || (U[Property] == "desktop" && !O.Mobile));
    else if(O.WindowEmbedded || Always) return (S[Property] == "yes" || (S[Property] == "mobile" && O.Mobile) || (S[Property] == "desktop" && !O.Mobile));
    else                                return (Property == "autostart");
}


S.reset = function() {
    for(var Property in S) if(typeof S[Property] != "function") delete S[Property];
    O.apply(P, S);
    O.apply(U, S);
    delete S["book"];
    delete S["bookshelf"];
};


S.update = function(Settings) { // formerly O.updateSetting

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

    E.dispatch("bibi:updateSetting", S);

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


O = {}; // Bibi.Operator


O.log = function(Msg, Tag) {
    var Pre = 'BiB/i: ';
    switch(Tag) {
        case  "-*": Tag  = "-" + (O.log.Depth);              break;
        case  "*:": Tag  =       (O.log.Depth) + ":";        break;
        case "/*" : Tag  = "/" + (O.log.Depth - 1);          break;
    }
    switch(Tag) {
        case "-x" : Pre += "[ERROR] ";                       break;
        case "-0" : Pre += "━━━━━━━━━━━━ ";      break;
        case "-1" : Pre += " - ";           O.log.Depth = 1; break;
        case  "1:": Pre += "┌ ";           O.log.Depth = 2; break;
        case "-2" : Pre += "│ - ";         O.log.Depth = 2; break;
        case  "2:": Pre += "│┌ ";         O.log.Depth = 3; break;
        case "-3" : Pre += "││ - ";       O.log.Depth = 3; break;
        case  "3:": Pre += "││┌ ";       O.log.Depth = 4; break;
        case "-4" : Pre += "│││ - ";     O.log.Depth = 4; break;
        case  "4:": Pre += "│││┌ ";     O.log.Depth = 5; break;
        case "-5" : Pre += "││││ - ";   O.log.Depth = 5; break;
        case  "5:": Pre += "││││┌ ";   O.log.Depth = 6; break;
        case "-6" : Pre += "│││││ - "; O.log.Depth = 6; break;
        case "/5" : Pre += "││││└ ";   O.log.Depth = 5; break;
        case "/4" : Pre += "│││└ ";     O.log.Depth = 4; break;
        case "/3" : Pre += "││└ ";       O.log.Depth = 3; break;
        case "/2" : Pre += "│└ ";         O.log.Depth = 2; break;
        case "/1" : Pre += "└ ";           O.log.Depth = 1; break;
    }
    console.log(Pre + Msg);
};
O.log.Depth = 1;
if((parent && parent != window) || !console || !console.log) O.log = function() { return false; };


O.error = function(Msg) {
    sML.removeClass(O.HTML, "busy");
    sML.removeClass(O.HTML, "loading");
    sML.removeClass(O.HTML, "waiting");
    E.dispatch("bibi:error", Msg);
    O.log(Msg, "-x");
};


O.apply = function(From, To) {
    for(var Property in From) if(typeof To[Property] != "function" && typeof From[Property] != "function") To[Property] = From[Property];
};


O.download = function(URI, MimeType) {
    return new Promise(function(resolve, reject) {
        var XHR = new XMLHttpRequest();
        if(MimeType) XHR.overrideMimeType(MimeType);
        XHR.open('GET', URI, true);
        if(/\.x?html$/i.test(URI)) XHR.responseType = "document";
        XHR.onloadend = function() {
            if(XHR.status !== 200) return reject(XHR);
            else                   return resolve(XHR);
        };
        XHR.send(null);
    });
};


O.openDocument = function(Path) {
    if(B.Unzipped) {
        return O.download(B.Path + "/" +  Path).then(function(XHR) {
            return XHR.responseXML;
        }).catch(function(XHR) {
            O.error('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"');
        });
    } else {
        return Promise.resolve().then(function() {
            return (new DOMParser()).parseFromString(B.Files[Path], /\.(xml|opf|ncx)$/i.test(Path) ? "text/xml" : "text/html");
        });
    }
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
    if(arguments.length == 2 && /^[\w\d]+:\/\//.test(arguments[1])) Path  = arguments[1];
    else for(var i = 1; i < arguments.length; i++)                  Path += "/" + arguments[i];
    Path.replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, function() { Origin = arguments[1], Path = arguments[2]; });
    while(/([^:\/])\/{2,}/.test(Path)) Path = Path.replace(/([^:\/])\/{2,}/g, "$1/");
    while(        /\/\.\//.test(Path)) Path = Path.replace(        /\/\.\//g,   "/");
    while(/[^\/]+\/\.\.\//.test(Path)) Path = Path.replace(/[^\/]+\/\.\.\//g,    "");
    /**/                               Path = Path.replace(      /^(\.\/)+/g,    "");
    if(Origin) Path = Origin + "/" + Path;
    return Path;
};

O.stamp = function(What, TimeCard) {
    if(!TimeCard) TimeCard = O.TimeCard;
    var Time = Date.now() - O.TimeCard.Origin;
    if(TimeCard[Time]) What = TimeCard[Time] + " -&- " + What;
    TimeCard[Time] = What;
};

O.TimeCard = { Origin: Date.now(), getNow: function() { return ((Date.now() - O.TimeCard.Origin) / 1000) + "sec"; } };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events - Special Thanks: @KitaitiMakoto & @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


E = {}; // Bibi.Events


E.Binded = {};


E.add = function(Name, Listener, Ele) {
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function") return false;
    if(!Listener.bibiEventListener) Listener.bibiEventListener = function(Eve) { return Listener.call(document, Eve.detail); };
    (Ele ? Ele : document).addEventListener(Name, Listener.bibiEventListener, false);
    return Listener;
};


E.remove = function(Name, Listener, Ele) {
    if(typeof Name != "string" || !/^bibi:/.test(Name) || typeof Listener != "function" || typeof Listener.bibiEventListener != "function") return false;
    (Ele ? Ele : document).removeEventListener(Name, Listener.bibiEventListener);
    return true;
};


E.bind = function(Name, Fn) {
    if(typeof Name != "string" || typeof Fn != "function") return false;
    if(!(E.Binded[Name] instanceof Array)) E.Binded[Name] = [];
    E.Binded[Name].push(Fn);
    return {
        Name: Name,
        Index: E.Binded[Name].length - 1,
        Function: Fn
    };
};


E.unbind = function(Param) { // or E.unbined(Name, Fn);
    if(!Param) return false;
    if(typeof arguments[0] == "string" && typeof arguments[1] == "function") Param = { Name: arguments[0], Function: arguments[1] };
    if(typeof Param != "object" || typeof Param.Name != "string" || !(E.Binded[Param.Name] instanceof Array)) return false;
    if(typeof Param.Index == "number") {
        if(typeof E.Binded[Param.Name][Param.Index] != "function") return false;
        E.Binded[Param.Name][Param.Index] = undefined;
        return true;
    }
    if(typeof Param.Function == "function") {
        var Deleted = false;
        for(var i = 0, L = E.Binded[Param.Name].length; i < L; i++) {
            if(E.Binded[Param.Name][i] == Param.Function) {
                E.Binded[Param.Name][i] = undefined;
                Deleted = true;
            }
        }
        return Deleted;
    }
    return (delete E.Binded[Param.Name]);
};


E.dispatch = function(Name, Detail, Ele) {
    if(E.Binded[Name] instanceof Array) {
        for(var i = 0, L = E.Binded[Name].length; i < L; i++) {
            if(typeof E.Binded[Name][i] == "function") E.Binded[Name][i].call(Bibi, Detail);
        }
    }
    return (Ele ? Ele : document).dispatchEvent(new CustomEvent(Name, { detail: Detail }));
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
        for(var EventName in Data) if(/^bibi:command:/.test(EventName)) E.dispatch(EventName, Data[EventName]);
        return true;
    } catch(Err) {}
    return false;
};


M.gate = function(Eve) {
    if(!Eve || !Eve.data) return;
    for(var i = 0, L = S["trustworthy-origins"].length; i < L; i++) if(S["trustworthy-origins"][i] == Eve.origin) return M.receive(Eve.data);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extensions - Special Thanks: @shunito

//----------------------------------------------------------------------------------------------------------------------------------------------


X = {}; // Bibi.Extensions


X.initialize = function() {
    X.ExtensionsInPreset = [];
    X.LoadedExtensionsInPreset = 0;
};


X.loadExtensionsInPreset = function() {
    return new Promise(function(resolve, reject) {
        if(!X.ExtensionsInPreset.length) return resolve();
        X.ExtensionsInPreset.forEach(function(Extension) {
            document.head.appendChild(
                sML.create("script", { src: Extension["src"],// async: "async",
                    onload: function() {
                        X.LoadedExtensionsInPreset++;
                        if(X.LoadedExtensionsInPreset == X.ExtensionsInPreset.length) resolve();
                    }
                })
            );
        });
    });
};


X.add = function(Extension) {
    if(!Extension || typeof Extension != "object") return function() { return false; };
    if(typeof Extension["name"] != "string")       return function() { E.bind("bibi:ready", function() { O.log('Extension name is invalid.', "-*"); }); };
    if(X[Extension["name"]])                       return function() { E.bind("bibi:ready", function() { O.log('Extension name "' + Extension["name"] + '" is reserved or already taken.', "-*"); }); };
    if(typeof Extension["description"] != "string") Extension["decription"] = undefined;
    if(typeof Extension["author"] != "string") Extension["author"] = undefined;
    if(typeof Extension["version"] != "string") Extension["version"] = undefined;
    if(typeof Extension["build"] != "number") Extension["build"] = undefined;
    if(!(X.Extensions instanceof Array)) X.Extensions = [];
    X.Extensions.push(Extension);
    X[Extension["name"]] = Extension;
    return function(init) { E.bind("bibi:ready", function() { init.call(Extension); }); };
};

Bibi.x = X.add;



