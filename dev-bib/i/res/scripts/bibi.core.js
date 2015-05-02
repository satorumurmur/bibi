



/*!
 *
 * # BiB/i (core)
 *
 * - "EPUB Reader on Your Web Site."
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Sat May 2 18:15:00 2015 +0900 */ Bibi = { Version: "0.998.3", Build: 20150502.3 };




A = {}; // Bibi.Archive

B = {}; // Bibi.Book

C = {}; // Bibi.Controls

L = {}; // Bibi.Loader

O = {}; // Bibi.Operator

P = {}; // Bibi.Preset

R = {}; // Bibi.Reader

S = {}; // Bibi.Setting

X = {}; // Bibi.Extra




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------


O.welcome = function() {

	O.log(1, 'Welcome !');

	O.HTML  = document.getElementsByTagName("html" )[0]; O.HTML.className = "preparing " + sML.Environments.join(" ");
	O.Head  = document.getElementsByTagName("head" )[0];
	O.Body  = document.getElementsByTagName("body" )[0];
	O.Title = document.getElementsByTagName("title")[0];

	if(sML.OS.iOS || sML.OS.Android) {
		O.SmartPhone = true;
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
	}

	if(parent == window) {
		O.HTML.className = O.HTML.className + " window-not-embedded";
		O.WindowEmbedded = 0;
	} else {
		O.HTML.className = O.HTML.className + " window-embedded";
		try {
			if(location.host == parent.location.host) {
				O.WindowEmbedded = 1;
				O.HTML.className = O.HTML.className + " window-embedded-sameorigin";
			}
		} catch(e) {
			O.WindowEmbedded = -1;
			O.HTML.className = O.HTML.className + " window-embedded-crossorigin";
		}
	}

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

	O.found();
	O.open();

};


O.found = function() {

	C.weaveCartain();

	R.Content = O.Body.insertBefore(sML.create("div", { id: "epub-content" }), C.Cartain);
	R.Content.Main = R.Content.appendChild(sML.create("div", { id: "epub-content-main" }));
	R.Content.Complementary = R.Content.appendChild(sML.create("div", { id: "epub-content-complementary" }));

	R.Frame = (sML.OS.iOS || sML.OS.Android) ? R.Content : window;
	//R.Frame = R.Content;

};


O.open = function() {

	O.readExtra();

	setTimeout(function() { L.getBook(X["book"]); }, (sML.OS.iOS || sML.OS.Android ? 1000 : 1));

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loading

//----------------------------------------------------------------------------------------------------------------------------------------------


L.sayLoading = function(Message) {
	sML.addClass(O.HTML, "wait-please");
	sML.addClass(C.Cartain, "animate");
	C.Cartain.Message.note(Message ? Message : 'Loading...');
};


L.shutUpLoading = function(Message) {
	sML.removeClass(O.HTML, "wait-please");
	sML.removeClass(C.Cartain, "animate");
	C.Cartain.Message.note(Message ? Message : '');
};


L.error = function(Message) {
	sML.removeClass(O.HTML, "wait-please");
	sML.removeClass(C.Cartain, "animate");
	O.log(0, Message);
};


L.download = function(URI, MimeType) {
	return new Promise(function(resolve, reject) {
		var XHR = new XMLHttpRequest();
		if(MimeType) XHR.overrideMimeType(MimeType);
		XHR.open('GET', URI, true);
		XHR.onloadend = function() {
			if(XHR.status !== 200) {
				var ErrorMessage = 'XHR HTTP status: ' + XHR.status + ' "' + URI + '"';
				L.error(ErrorMessage);
				reject(new Error(ErrorMessage));
				return;
			}
			resolve(XHR);
		};
		XHR.send(null);
	});
};

L.requestDocument = function(Path) {
	var IsXML = /\.(xml|opf|ncx)$/i.test(Path);
	var XHR, Document;
	var getDocument = !B.Zipped ? L.download(S["bookshelf"] + B.Name + "/" +  Path).then(function(ResolvedXHR) {
		XHR = ResolvedXHR;
		if(!IsXML) Document = XHR.responseXML;
		return Document;
	}) : Promise.resolve(Document);
	return getDocument.then(function(Document) {
		if(Document) return Document;
		var DocumentText = !B.Zipped ? XHR.responseText : A.Files[Path];
		var Document = sML.create("object", { innerHTML: IsXML ? O.toBibiXML(DocumentText) : DocumentText });
		if(IsXML) sML.each([Document].concat(sML.toArray(Document.getElementsByTagName("*"))), function() {
			this.getElementsByTagName = function(TagName) {
				return this.querySelectorAll("bibi_" + TagName.replace(/:/g, "_"));
			}
		});
		if(!Document || !Document.childNodes || !Document.childNodes.length) return L.error('Invalid Content. - "' + Path + '"');
		return Document;
	});
};


L.openDocument = function(Path, Option) {
	if(!Option || typeof Option != "object" || typeof Option.then != "function") Option = { then: function() { return false; } };
	L.requestDocument(Path).then(Option.then);
};


L.getBook = function(BookFileName) {

	var loadFile = function(BookFile) {
		BookFileName = BookFile.name;
		if(!BookFile.size || !/\.epub$/i.test(BookFileName)) {
			C.Cartain.Message.note('Give me <span style="color:rgb(128,128,128);">EPUB</span>. Drop into this window.');
		} else {
			X = { book: "", bibi: {}, pipi: {} };
			L.initialize(BookFileName);
			L.sayLoading();
			O.log(2, 'Loading EPUB...');
			O.log(3, BookFileName);
			sML.edit(new FileReader(), {
				onerror : function(e) { O.Body.style.opacity = 1.0; C.Cartain.Message.note('Error. Something trouble...'); },
				onload  : function(e) {
					O.log(2, 'Loaded.');
					onloadFile(this.result);
				}
			}).readAsArrayBuffer(BookFile);
		}
	};

	var onloadFile = function(EPUBZip) {
		L.preprocessEPUB(EPUBZip);
		B.Name = BookFileName.replace(/\.epub$/i, ""), B.Format = "EPUB", B.Zipped = true;
		L.openDocument(B.Container.Path, { then: L.readContainer });
	};

	// Wait Drop or Input
	if(window.File) {
		C.Cartain.Catcher = C.Cartain.appendChild(
			sML.create("p", { id: "bibi-cartain-catcher", title: 'Drop me an EPUB! or Click me!' }, { display: "none" })
		);
		sML.addTouchEventObserver(C.Cartain.Catcher).addTouchEventListener("tap", function() {
			if(!this.Input) this.Input = this.appendChild(
				sML.create("input", { type: "file",
					onchange: function(e) {
						loadFile(e.target.files[0]);
						C.Cartain.Catcher.style.opacity = 0;
					}
				})
			);
			this.Input.click();
		});
		if(!sML.OS.iOS && !sML.OS.Android) {
			document.body.addEventListener("dragenter", function(e) { e.preventDefault(); O.Body.style.opacity = 0.9; sML.addClass(O.HTML, "dragenter"); }, 1);
			document.body.addEventListener("dragover",  function(e) { e.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
			document.body.addEventListener("dragleave", function(e) { e.preventDefault(); O.Body.style.opacity = 1.0; sML.removeClass(O.HTML, "dragenter"); }, 1);
			document.body.addEventListener("drop",      function(e) { e.preventDefault(); O.Body.style.opacity = 1.0; loadFile(e.dataTransfer.files[0]); }, 1);
		}
	}

	if(typeof BookFileName != "string" || !BookFileName || /\//.test(BookFileName)) {
		// File Open or Stop
		if(window.File) {
			// Drag & Drop
			C.Cartain.Catcher.style.display = "block";
			C.Cartain.Message.note('Drop an EPUB file into this window, or click and select EPUB file.');
		} else {
			C.Cartain.Message.note('Tell me EPUB name via URL in address-bar.');
		}
	} else {
		L.initialize(BookFileName);
		if(/\.epub$/i.test(BookFileName)) {
			// EPUB XHR
			var fetchEPUB = function() {
				L.sayLoading();
				O.log(2, 'Fetching EPUB...');
				O.log(3, BookFileName);
				L.download(S["bookshelf"] + BookFileName, "text/plain;charset=x-user-defined").then(function(XHR) {
					O.log(2, 'Fetched.');
					onloadFile(XHR.responseText)
				});
			}
			if(!X["pipi"]["wait"]) fetchEPUB();
			else {
				C.Cartain.createPlayButton({
					onplay: function() {
						fetchEPUB();
						delete  X["pipi"]["wait"];
					}
				});
				C.Cartain.Message.note('');
			}
		} else {
			// EPUB Folder
			L.sayLoading();
			B.Name = BookFileName, B.Format = "EPUB";
			L.openDocument(B.Container.Path, { then: L.readContainer });
		}
	}

};


L.initialize = function(BookFileName) {

	O.log(2, 'Initializing BiB/i...');

	L.FileDigit = 3;

	B = {
		Container: { Path: "META-INF/container.xml" },
		Package: {}
	}

	R.Content.Main.style.opacity = 0;
	R.Content.Main.innerHTML = R.Content.Complementary.innerHTML = "";
	R.CoverImage = {};
	R.Navigation = {};

	var PresetFileName = (typeof X["bibi"]["preset"] == "string" && X["bibi"]["preset"] && !/\//.test(X["bibi"]["preset"])) ? X["bibi"]["preset"].replace(/(\.js)?$/, ".js") : "default.js";
	var applyPreset = function() {
		["spread-gap", "spread-margin-start", "spread-margin-end", "item-padding-left", "item-padding-right",  "item-padding-top",  "item-padding-bottom"].forEach(function(Property) {
			P[Property] = (typeof P[Property] != "number" || P[Property] < 0) ? 0 : Math.round(P[Property]);
		});
		if(P["spread-gap"] % 2) P["spread-gap"]++;
		if(X["bibi"]["book-display-mode" ] && /^(all|each)$/.test(                 X["bibi"]["book-display-mode" ])) P["book-display-mode" ] = X["bibi"]["book-display-mode" ];
		if(X["bibi"]["spread-layout-axis"] && /^(horizontal|vertical)$/.test(      X["bibi"]["spread-layout-axis"])) P["spread-layout-axis"] = X["bibi"]["spread-layout-axis"];
		if(X["bibi"]["page-size-format"  ] && /^(portrait|landscape|window)$/.test(X["bibi"]["page-size-format"  ])) P["page-size-format"  ] = X["bibi"]["page-size-format"  ];
		/*if(P.FileName !== "default.js") */O.updateSetting(P);
	}
	if(!P.FileName && PresetFileName == "default.js") {
		P.FileName = "default.js";
		applyPreset();
	} else if(P.FileName != PresetFileName) {
		P.loaded = false;
		if(document.getElementById("bibi-preset")) sML.removeElement(document.getElementById("bibi-preset"));
		sML.insertAfter(sML.create("script", { id: "bibi-preset", onload: applyPreset }), document.getElementById("bibi-script")).src = "../../bib/presets/" + PresetFileName;
		P.FileName = PresetFileName;
	}
	O.log(3, 'preset: ' + PresetFileName);
	O.log(3, 'bookshelf: ' + S["bookshelf"]);
	O.log(3, 'book: ' + BookFileName + (/\.epub$/i.test(BookFileName) ? "" : " (Unzipped)"));

	O.log(2, 'Initialized.');

};


L.preprocessEPUB = function(EPUBZip) {

	O.log(2, 'Preprocessing EPUB...');

	A = {
		Files: {},
		FileCount: { All:0, HTML:0, CSS:0, SVG:0, Bitmap:0, Font:0, Audio:0, Video:0, PDF:0, Etcetra:0 },
		getDataURI: function(FilePath) {
			for(var ContentType in O.ContentTypeList) {
				if(O.ContentTypeList[ContentType].test(FilePath)) {
					return "data:" + ContentType + ";base64," + (O.isBin(FilePath) ? btoa(A.Files[FilePath]) : Base64.encode(A.Files[FilePath]));
				}
			}
			return "";
		}
	}

	EPUBZip = (new JSZip()).load(EPUBZip);

	for(var FileName in EPUBZip.files) {
		if(EPUBZip.files[FileName]._data) {
			A.FileCount.All++;
			     if(         /\.(x?html?)$/i.test(FileName)) A.FileCount.HTML++;
			else if(             /\.(css)$/i.test(FileName)) A.FileCount.CSS++;
			else if(             /\.(svg)$/i.test(FileName)) A.FileCount.SVG++;
			else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) A.FileCount.Bitmap++;
			else if(    /\.(woff|otf|ttf)$/i.test(FileName)) A.FileCount.Font++;
			else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) A.FileCount.Audio++;
			else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) A.FileCount.Video++;
			else if(             /\.(pdf)$/i.test(FileName)) A.FileCount.PDF++;
			else                                             A.FileCount.Etcetra++;
			A.Files[FileName] = O.isBin(FileName) ? EPUBZip.file(FileName).asBinary() : Base64.btou(EPUBZip.file(FileName).asText());
		}
	}

	L.FileDigit = (A.FileCount.All + "").length;

	if(A.FileCount.All)     O.log(3, sML.String.padZero(A.FileCount.All,     L.FileDigit) + ' File'   + (A.FileCount.All    >= 2 ? "s" : ""));
	if(A.FileCount.HTML)    O.log(4, sML.String.padZero(A.FileCount.HTML,    L.FileDigit) + ' HTML'   + (A.FileCount.HTML   >= 2 ? "s" : ""));
	if(A.FileCount.CSS)     O.log(4, sML.String.padZero(A.FileCount.CSS,     L.FileDigit) + ' CSS'    + (A.FileCount.CSS    >= 2 ? "s" : ""));
	if(A.FileCount.SVG)     O.log(4, sML.String.padZero(A.FileCount.SVG,     L.FileDigit) + ' SVG'    + (A.FileCount.SVG    >= 2 ? "s" : ""));
	if(A.FileCount.Bitmap)  O.log(4, sML.String.padZero(A.FileCount.Bitmap,  L.FileDigit) + ' Bitmap' + (A.FileCount.Bitmap >= 2 ? "s" : ""));
	if(A.FileCount.Font)    O.log(4, sML.String.padZero(A.FileCount.Font,    L.FileDigit) + ' Font'   + (A.FileCount.Font   >= 2 ? "s" : ""));
	if(A.FileCount.Audio)   O.log(4, sML.String.padZero(A.FileCount.Audio,   L.FileDigit) + ' Audio'  + (A.FileCount.Audio  >= 2 ? "s" : ""));
	if(A.FileCount.Video)   O.log(4, sML.String.padZero(A.FileCount.Video,   L.FileDigit) + ' Video'  + (A.FileCount.Video  >= 2 ? "s" : ""));
	if(A.FileCount.PDF)     O.log(4, sML.String.padZero(A.FileCount.PDF,     L.FileDigit) + ' PDF'    + (A.FileCount.PDF    >= 2 ? "s" : ""));
	if(A.FileCount.Etcetra) O.log(4, sML.String.padZero(A.FileCount.Etcetra, L.FileDigit) + ' etc.');

	delete EPUBZip;

	var rRR = replaceResourceRefferences = function(FilePath, ExtLists, getMatchRE) {
		if(typeof getMatchRE != "function") getMatchRE = function(At) { return (new RegExp('<\\??[a-zA-Z1-6:\-]+[^>]*? ' + At + '[ \t]*=[ \t]*[\'"](?!(?:https?|data):)([^"]+?)[\'"]', "g")); };
		var Source = A.Files[FilePath].replace(/[\r\n]/g, "\n").replace(/\r/g, "\n");
		var FileDir = FilePath.replace(/\/?[^\/]+$/, "");
		for(var Attribute in ExtLists) {
			var MatchRE = getMatchRE(Attribute);
			var Matches = Source.match(MatchRE);
			if(Matches) {
				var ExtRE = new RegExp('\.' + ExtLists[Attribute] + '$', "i");
				sML.each(Matches, function() {
					var ResPathInSource = this.replace(MatchRE, "$1");
					var ResPath = O.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? "./" : "") + ResPathInSource);
					var ResFnH = ResPath.split("#"), ResFile = ResFnH[0] ? ResFnH[0] : FilePath, ResHash = ResFnH[1] ? ResFnH[1] : "";
					if(ExtRE.test(ResFile) && typeof A.Files[ResFile] == "string") Source = Source.replace(this, this.replace(ResPathInSource, A.getDataURI(ResFile) + (ResHash ? "#" + ResHash : "")));
				});
			}
		}
		/*
		if(Shelter.length) for(var i = 0, L = Shelter.length; i < L; i++) Source = Source.replace('<bibi:ignored number="' + i + '" />', Shelter[i]);
		Source = Source.replace(/<bibi:lf \/>/g, "\n");
		*/
		return Source;
	}

	var Preprocessed = { CSS:0, SVG:0, HTML:0 };

	// CSS
	for(var FilePath in A.Files) {
		if(!/\.css$/.test(FilePath)) continue;
		A.Files[FilePath] = (function(FilePath) { var getImportedCSS = arguments.callee;
			if(!A.Files[FilePath]) return "";
			var RE = /@import[ \t]*(?:url\()?["']?(?!(?:https?|data):)(.+?)['"]?(?:\))?[ \t]*;/g;
			var Imports = A.Files[FilePath].match(RE);
			if(Imports) {
				sML.each(Imports, function() {
					var ImportPath = O.getPath(FilePath.replace(/[^\/]+$/, ""), this.replace(RE, "$1"));
					if(A.Files[ImportPath]) A.Files[FilePath] = A.Files[FilePath].replace(this, getImportedCSS(ImportPath));
				});
			}
			A.Files[FilePath] = rRR(FilePath, {
				"url" : "gif|png|jpe?g|svg|ttf|otf|woff"
			}, function() {
				return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g;
			});
			return A.Files[FilePath];
		})(FilePath);
		Preprocessed.CSS++;
	}
	if(Preprocessed.CSS) O.log(3, sML.String.padZero(Preprocessed.CSS, L.FileDigit) + ' CSS' + (Preprocessed.CSS >= 2 ? "s" : "") + " Preprocessed.");

	// SVG
	for(var FilePath in A.Files) {
		if(!/\.svg$/.test(FilePath)) continue;
		A.Files[FilePath] = rRR(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js",
			"xlink:href" : "gif|png|jpe?g"
		});
		Preprocessed.SVG++;
	}
	if(Preprocessed.SVG) O.log(3, sML.String.padZero(Preprocessed.SVG, L.FileDigit) + ' SVG' + (Preprocessed.SVG >= 2 ? "s" : "") + " Preprocessed.");

	// HTML
	for(var FilePath in A.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		A.Files[FilePath] = rRR(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js",
			"xlink:href" : "gif|png|jpe?g"
		});
	}
	for(var FilePath in A.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		A.Files[FilePath] = rRR(FilePath, {
			"src" : "x?html?"
		});
		Preprocessed.HTML++;
	}
	if(Preprocessed.HTML) O.log(3, sML.String.padZero(Preprocessed.HTML, L.FileDigit) + ' HTML' + (Preprocessed.HTML >= 2 ? "s" : "") + " Preprocessed.");

	O.log(2, 'Preprocessed.');

};


L.readContainer = function(Document) {

	O.log(2, 'Reading Container XML...');

	O.log(3, B.Container.Path);

	B.Package.Path = Document.getElementsByTagName("rootfile")[0].getAttribute("full-path");
	B.Package.Dir  = B.Package.Path.replace(/\/?[^\/]+$/, "");

	O.log(2, 'Read.');

	L.openDocument(B.Package.Path, { then: L.readPackageDocument });
};


L.readPackageDocument = function(Document) {

	O.log(2, 'Reading Package Document...');

	O.log(3, B.Package.Path);

	// Package
	var Metadata = Document.getElementsByTagName("metadata")[0];
	var Manifest = Document.getElementsByTagName("manifest")[0];
	var Spine    = Document.getElementsByTagName("spine")[0];
	var ManifestItems = Manifest.getElementsByTagName("item");
	var SpineItemrefs = Spine.getElementsByTagName("itemref");
	if(ManifestItems.length <= 0) return O.log(0, '"' + B.Package.Path + '" has no <item> in <manifest>.');
	if(SpineItemrefs.length <= 0) return O.log(0, '"' + B.Package.Path + '" has no <itemref> in <spine>.');

	B.Package.Metadata = { "title": "", "creator": "", "publisher": "", "language": "", "titles": [], "creators": [], "publishers": [], "languages": [] };
	B.Package.Manifest = { "items": {}, "nav": {}, "cover-image": {}, "toc-ncx": {} };
	B.Package.Spine    = { "itemrefs": [] };

	// METADATA
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
	if(!B.Package.Metadata["titles"    ].length) sML.each(Document.getElementsByTagName("dc:title"),     function() { B.Package.Metadata["titles"    ].push(this.textContent); return false; });
	if(!B.Package.Metadata["creators"  ].length) sML.each(Document.getElementsByTagName("dc:creator"),   function() { B.Package.Metadata["creators"  ].push(this.textContent); });
	if(!B.Package.Metadata["publishers"].length) sML.each(Document.getElementsByTagName("dc:publisher"), function() { B.Package.Metadata["publishers"].push(this.textContent); });
	if(!B.Package.Metadata["languages" ].length) sML.each(Document.getElementsByTagName("dc:language"),  function() { B.Package.Metadata["languages" ].push(this.textContent); });
	if(!B.Package.Metadata["languages" ].length) B.Package.Metadata["languages"][0] = "en";
	B.Package.Metadata["title"]     = B.Package.Metadata["titles"].join(    ", ");
	B.Package.Metadata["creator"]   = B.Package.Metadata["creators"].join(  ", ");
	B.Package.Metadata["publisher"] = B.Package.Metadata["publishers"].join(", ");
	B.Package.Metadata["language"]  = B.Package.Metadata["languages"].join( ", ");
	if(!B.Package.Metadata["rendition:layout"])      B.Package.Metadata["rendition:layout"]      = "reflowable";
	if(!B.Package.Metadata["rendition:orientation"]) B.Package.Metadata["rendition:orientation"] = "auto";
	if(!B.Package.Metadata["rendition:spread"])      B.Package.Metadata["rendition:spread"]      = "auto";
	if(!B.Package.Metadata["cover"])                 B.Package.Metadata["cover"]                 = "";
	O.getMetadata = function() { return B.Package.Metadata; };

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
	if(!B.Package.Spine["page-progression-direction"] || !/^(ltr|rtl)$/.test(B.Package.Spine["page-progression-direction"])) B.Package.Spine["page-progression-direction"] = "default";
	var PropertyREs = [
		/(rendition:layout)-(.+)/,
		/(rendition:orientation)-(.+)/,
		/(rendition:spread)-(.+)/,
		/(rendition:page-spread)-(.+)/,
		/(page-spread)-(.+)/
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

	B.IDFragments = [];
	if(B.Package.Metadata["title"])     { B.IDFragments.push(B.Package.Metadata["title"]);     O.log(3, "title: "     + B.Package.Metadata["title"]);     }
	if(B.Package.Metadata["creator"])   { B.IDFragments.push(B.Package.Metadata["creator"]);   O.log(3, "creator: "   + B.Package.Metadata["creator"]);   }
	if(B.Package.Metadata["publisher"]) { B.IDFragments.push(B.Package.Metadata["publisher"]); O.log(3, "publisher: " + B.Package.Metadata["publisher"]); }
	if(B.IDFragments.length) {
		O.Title.innerHTML = "";
		O.Title.appendChild(document.createTextNode("BiB/i | " + B.IDFragments.join(" - ").replace(/&amp;?/gi, "&").replace(/&lt;?/gi, "<").replace(/&gt;?/gi, ">")));
	}

	C.createPanel();
	C.createPanelMisc();
	C.createPanelNavigation();
	C.createPanelMenu();

	C.createSwitches();

	O.log(2, 'Read.');

	delete Document;

	O.updateSetting({ Reset: true });

	L.prepareSpine();

};


L.prepareSpine = function() {

	O.log(2, 'Preparing Spine...');

	R.Content.Main.innerHTML = R.Content.Complementary.innerHTML = "";

	R.Spreads = [], R.Items = [], R.Pages = [];

	// For Paring of Pre-Pagenated
	if(S.PPD == "rtl") var PairBefore = "right", PairAfter = "left";
	else               var PairBefore = "left",  PairAfter = "right";

	// Spreads, Boxes, and Items
	sML.each(B.Package.Spine["itemrefs"], function(i) {
		var ItemRef = this;
		// Item: A
		var Item = sML.create("iframe", {
			className: "item",
			id: "item-" + sML.String.padZero(i, L.FileDigit),
			scrolling: "no",
			allowtransparency: "true"
		});
		Item.ItemRef = ItemRef;
		Item.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][ItemRef["idref"]].href);
		Item.Dir = Item.Path.replace(/\/?[^\/]+$/, "");
		Item.IsPrePaginated = (ItemRef["rendition:layout"] == "pre-paginated");
		// SpreadBox & Spread
		if(ItemRef["rendition:layout"] == "pre-paginated" && i) {
			var PrevItem = R.Items[i - 1];
			if(PrevItem.ItemRef["rendition:layout"] == "pre-paginated" && PrevItem.ItemRef["page-spread"] == PairBefore && ItemRef["page-spread"] == PairAfter) {
				Item.Pair = PrevItem;
				PrevItem.Pair = Item;
			}
		}
		if(Item.Pair) {
			var Spread = Item.Pair.Spread;
		} else {
			var SpreadBox = R.Content.Main.appendChild(sML.create("div", { className: "spread-box" }));
			var Spread = SpreadBox.appendChild(sML.create("div", { className: "spread" }));
			if(ItemRef["rendition:layout"] == "pre-paginated") sML.addClass(SpreadBox, "pre-paginated");
			Spread.SpreadBox = SpreadBox;
			Spread.Items = [];
			Spread.Pages = [];
			Spread.SpreadIndex = R.Spreads.length;
			R.Spreads.push(Spread);
			/*
			sML.addTouchEventObserver(Spread).addTouchEventListener("tap", function(e, E) {
				R.observeTap(Spread, E);
			});
			*/
		}
		// ItemBox
		var ItemBox = Spread.appendChild(sML.create("div", { className: "item-box" }));
		if(ItemRef["page-spread"]) sML.addClass(ItemBox, "page-spread-" + ItemRef["page-spread"]);
		// Item: B
		Item.Spread = Spread;
		Item.ItemBox = ItemBox;
		Item.Pages = [];
		Item.ItemIndexInSpread = Spread.Items.length; Spread.Items.push(Item);
		Item.ItemIndex         =      R.Items.length;      R.Items.push(Item);
	});

	O.log(3, sML.String.padZero(R.Items.length, L.FileDigit) + ' Items');

	O.log(2, 'Prepared.');

	L.createCover();

};


L.createCover = function() {

	O.log(2, 'Creating Cover...');

	if(B.Package.Manifest["cover-image"].Path) {
		R.CoverImage.Path = B.Package.Manifest["cover-image"].Path;
	}

	C.Cartain.Cover.Info = C.Cartain.Cover.appendChild(
		sML.create("p", { id: "bibi-cartain-cover-info",
			innerHTML: (function() {
				var BookID = [];
				if(B.Package.Metadata["title"])     BookID.push('<strong>' + B.Package.Metadata["title"] + '</strong>');
				if(B.Package.Metadata["creator"])   BookID.push('<em>' + B.Package.Metadata["creator"] + '</em>');
				if(B.Package.Metadata["publisher"]) BookID.push('<span>' + B.Package.Metadata["publisher"] + '</span>');
				return BookID.join(" ");
			})()
		})
	);

	if(R.CoverImage.Path) {
		O.log(3, R.CoverImage.Path);
		C.Cartain.Cover.className = [C.Cartain.Cover.className, "with-cover-image"].join(" ");
		sML.create("img", {
			onload: function() {
				sML.style(C.Cartain.Cover, {
					backgroundImage: "url(" + this.src + ")",
					opacity: 1
				});
				O.log(2, 'Created.');
				L.loadNavigation();
			}
		}).src = (function() {
			if(!B.Zipped) return S["bookshelf"] + B.Name + "/" + R.CoverImage.Path;
			else          return A.getDataURI(R.CoverImage.Path);
		})();
	} else {
		O.log(3, 'No Cover Image.');
		C.Cartain.Cover.className = [C.Cartain.Cover.className, "without-cover-image"].join(" ");
		O.log(2, 'Created.');
		L.loadNavigation();
	}

};


L.loadNavigation = function() {

	if(B.Package.Manifest["nav"].Path) {
		R.Navigation.Path = B.Package.Manifest["nav"].Path;
		R.Navigation.Type = "NavigationDocument";
	} else {
		O.log(2, 'No Navigation Document.');
		if(B.Package.Manifest["toc-ncx"].Path) {
			R.Navigation.Path = B.Package.Manifest["toc-ncx"].Path;
			R.Navigation.Type = "TOC-NCX";
		} else {
			O.log(2, 'No TOC-NCX.');
			return L.loadItems();
		}
	}

	L.openDocument(R.Navigation.Path, { then: L.createNavigation });

};


L.createNavigation = function(Document) {

	O.log(2, 'Making Navigation...');

	O.log(3, R.Navigation.Path);

	if(R.Navigation.Type == "NavigationDocument") {
		sML.each(Document.querySelectorAll("nav"), function() { sML.each(this.querySelectorAll("*"), function() { this.removeAttribute("style"); }); C.Panel.Navigation.Item.appendChild(this); });
	} else {
		var TempTOCNCX = Document.getElementsByTagName("navMap")[0];
		sML.each(TempTOCNCX.getElementsByTagName("navPoint"), function() {
			sML.insertBefore(
				sML.create("a", { href: this.getElementsByTagName("content")[0].getAttribute("src"), innerHTML: this.getElementsByTagName("text")[0].innerHTML }),
				this.getElementsByTagName("navLabel")[0]
			);
			sML.removeElement(this.getElementsByTagName("navLabel")[0]);
			sML.removeElement(this.getElementsByTagName("content")[0]);
			var LI = sML.create("li");
			LI.setAttribute("id", this.getAttribute("id"));
			LI.setAttribute("playorder", this.getAttribute("playorder"));
			sML.insertBefore(LI, this).appendChild(this);
			if(!LI.previousSibling || !LI.previousSibling.tagName || /^a$/i.test(LI.previousSibling.tagName)) {
				sML.insertBefore(sML.create("ul"), LI).appendChild(LI);
			} else {
				LI.previousSibling.appendChild(LI);
			}
		});
		C.Panel.Navigation.Item.innerHTML = '<nav>' + TempTOCNCX.innerHTML.replace(/<(bibi_)?navPoint( [^>]+)?>/ig, "").replace(/<\/(bibi_)?navPoint>/ig, "") + '</nav>';
	}

	L.postprocessLinkage(R.Navigation.Path, C.Panel.Navigation.Item, "InBibiNavigation");
	R.resetNavigation();

	O.log(2, 'Made.');

	delete Document;

	if(!X["pipi"]["wait"]) L.loadItems();
	else {
		L.shutUpLoading();
		C.Cartain.createPlayButton({
			onplay: function() {
				L.loadItems();
			}
		});
		C.Cartain.Message.note('');
	}

};


L.loadItems = function() {

	O.log(2, 'Loading Items...');

	O.Body.style.backgroundImage = "none";
	sML.removeClass(O.HTML, "with-poster");

	R.resetStage();

	L.LoadedItems = 0;

	R.ToRelayout = false;
	L.listenResizingWhileLoading = function() { R.ToRelayout = true; };
	window.addEventListener("resize", L.listenResizingWhileLoading);

	R.Items.forEach(function(Item) { L.loadItem(Item); });

	// Done?
	setTimeout(function() {
		if(L.LoadedItems < R.Items.length) return setTimeout(arguments.callee, 400);
		document.body.style.display = "";
		R.resetPages();
		O.log(2, 'Loaded.');
		L.start();
	}, 10);

};


L.loadItem = function(Item) {
	var Path = Item.Path;
	Item.Loaded = false;
	Item.LongWaited = false;
	if(/\.(x?html?)$/i.test(Path)) {
		// If HTML or Others
		if(B.Zipped) {
			L.writeItemHTML(Item, A.Files[Path]);
			setTimeout(L.postprocessItem, 10, Item);
		} else {
			Item.src = S["bookshelf"] + B.Name + "/" + Path;
			Item.onload = function() { setTimeout(L.postprocessItem, 10, Item); };
			Item.ItemBox.appendChild(Item);
		}
	} else if(/\.(svg)$/i.test(Path)) {
		// If SVG-in-Spine
		Item.IsSVG = true;
		if(B.Zipped) {
			L.writeItemHTML(Item, false, '', A.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
		} else {
			var URI = S["bookshelf"] + B.Name + "/" + Path;
			L.download(URI).then(function(XHR) {
				L.writeItemHTML(Item, false, '<base href="' + URI + '" />', XHR.responseText.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
			});
		}
	} else if(/\.(gif|jpe?g|png)$/i.test(Path)) {
		// If Bitmap-in-Spine
		Item.IsBitmap = true;
		L.writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Zipped ? A.getDataURI(Path) : S["bookshelf"] + B.Name + "/" + Path) + '" />');
	} else if(/\.(pdf)$/i.test(Path)) {
		// If PDF-in-Spine
		Item.IsPDF = true;
		L.writeItemHTML(Item, false, '', '<iframe     src="' + (B.Zipped ? A.getDataURI(Path) : S["bookshelf"] + B.Name + "/" + Path) + '" />');
	}
	O.log(3, sML.String.padZero(Item.ItemIndex + 1, L.FileDigit) + '/' + sML.String.padZero(B.Package.Spine["itemrefs"].length, L.FileDigit) + ' ' + (Path ? Path : '... Not Found.'));
};


L.writeItemHTML = function(Item, HTML, Head, Body) {
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

	var ItemRef = Item.ItemRef;

	Item.HTML = sML.edit(Item.contentDocument.getElementsByTagName("html")[0], { Item: Item });
	Item.Head = sML.edit(Item.contentDocument.getElementsByTagName("head")[0], { Item: Item });
	Item.Body = sML.edit(Item.contentDocument.getElementsByTagName("body")[0], { Item: Item });

	sML.each(Item.Body.querySelectorAll("link"), function() { Item.Head.appendChild(this); });

	if(S["epub-additional-stylesheet"]) Item.Head.appendChild(sML.create("link",   { rel: "stylesheet", href: S["epub-additional-stylesheet"] }));
	if(S["epub-additional-script"])     Item.Head.appendChild(sML.create("script", { src: S["epub-additional-script"] }));

	Item.StyleSheets = [];
	sML.CSS.add({ "html" : "-webkit-text-size-adjust: 100%;" }, Item.contentDocument);
	sML.each(Item.HTML.querySelectorAll("link, style"), function() {
		if(/^link$/i.test(this.tagName)) {
			if(!/^(alternate )?stylesheet$/.test(this.rel)) return;
			if((sML.UA.Safari || sML.OS.iOS) && this.rel == "alternate stylesheet") return; //// Safari does not count "alternate stylesheet" in document.styleSheets.
		}
		Item.StyleSheets.push(this);
	});

	// Single SVG / IMG Item
	var ItemBodyChildren = Item.contentDocument.querySelectorAll("body>*");
	if(ItemBodyChildren.length == 1) {
			 if(/^svg$/i.test(ItemBodyChildren[0].tagName)) Item.SingleSVG = true;
		else if(/^img$/i.test(ItemBodyChildren[0].tagName)) Item.SingleIMG = true;
	}
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

	// Viewport
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
		if(Item.SingleSVG) { // If Single-SVG-HTML or SVG-in-Spine, Use ViewBox for Viewport.
			if(ItemBodyChildren[0].getAttribute("viewBox")) {
				ItemRef["viewBox"].content = ItemBodyChildren[0].getAttribute("viewBox");
				var ViewBoxCoords  = ItemRef["viewBox"].content.split(" ");
				if(ViewBoxCoords.length == 4) {
					var ViewBoxWidth  = ViewBoxCoords[2] * 1 - ViewBoxCoords[0] * 1;
					var ViewBoxHeight = ViewBoxCoords[3] * 1 - ViewBoxCoords[1] * 1;
					if(ViewBoxWidth && ViewBoxHeight) {
						if(ItemBodyChildren[0].getAttribute("width")  != "100%") ItemBodyChildren[0].setAttribute("width",  "100%");
						if(ItemBodyChildren[0].getAttribute("height") != "100%") ItemBodyChildren[0].setAttribute("height", "100%");
						ItemRef["viewport"].width  = ItemRef["viewBox"].width  = ViewBoxWidth;
						ItemRef["viewport"].height = ItemRef["viewBox"].height = ViewBoxHeight;
					}
				}
			}
		} else if(Item.SingleIMG) { // If Single-IMG-HTML or Bitmap-in-Spine, Use IMG "width" / "height" for Viewport.
			ItemRef["viewport"].width  = parseInt(getComputedStyle(ItemBodyChildren[0]).width);
			ItemRef["viewport"].height = parseInt(getComputedStyle(ItemBodyChildren[0]).height);
		}
	}

	// Linkage
	L.postprocessLinkage(Item.Path, Item.Body);

	/*
	setTimeout(function() {
		if(!Item.Loaded) Item.LongWaited = true;
	}, 1000 * 10);
	*/
	setTimeout(function() {
		if(/*!Item.LongWaited &&*/ Item.contentDocument.styleSheets.length < Item.StyleSheets.length) return setTimeout(arguments.callee, 100);
		// Writing Mode
		if(sML.UA.Gecko || sML.UA.InternetExplorer < 12) {
			Item.AdditionalStyles = [];
			var translateWritingMode = sML.UA.Gecko ? function(CSSRule) {
				/**/ if(/ (-(webkit|epub)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "vertical-rl";
				else if(/ (-(webkit|epub)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = "vertical-lr";
				else if(/ (-(webkit|epub)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = "horizontal-tb";
			} : function(CSSRule) {
				/**/ if(/ (-(webkit|epub)-)?writing-mode: vertical-rl; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-rl" : "tb-rl";
				else if(/ (-(webkit|epub)-)?writing-mode: vertical-lr; /.test(  CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "bt-lr" : "tb-lr";
				else if(/ (-(webkit|epub)-)?writing-mode: horizontal-tb; /.test(CSSRule.cssText)) CSSRule.style.writingMode = / direction: rtl; /.test(CSSRule.cssText) ? "rl-tb" : "lr-tb";
			};
			sML.each(Item.contentDocument.styleSheets, function () {
				var StyleSheet = this;
				for(var L = StyleSheet.cssRules.length, i = 0; i < L; i++) {
					var CSSRule = this.cssRules[i];
					/**/ if(CSSRule.cssRules)   arguments.callee.call(CSSRule);
					else if(CSSRule.styleSheet) arguments.callee.call(CSSRule.styleSheet);
					else                        translateWritingMode(CSSRule);
				}
			});
		}
		(function() {
			var HTMLCS = getComputedStyle(Item.HTML);
			var Property = (function() {
				if(/^(vertical|horizontal)-/.test(HTMLCS["-webkit-writing-mode"])) return "-webkit-writing-mode";
				if(/^(vertical|horizontal)-/.test(HTMLCS["writing-mode"]) || sML.UA.InternetExplorer >= 11) return "writing-mode";
				else return undefined;
			})();
			sML.style(Item.HTML, {
				"writing-mode": getComputedStyle(Item.Body)[Property]
			});
			Item.HTML.WritingMode = (function() {
					 if(!Property)                                return (HTMLCS["direction"] == "rtl" ? "rl-tb" : "lr-tb");
				else if(     /^vertical-/.test(HTMLCS[Property])) return (HTMLCS["direction"] == "rtl" ? "bt" : "tb") + "-" + (/-lr$/.test(HTMLCS[Property]) ? "lr" : "rl");
				else if(   /^horizontal-/.test(HTMLCS[Property])) return (HTMLCS["direction"] == "rtl" ? "rl" : "lr") + "-" + (/-bt$/.test(HTMLCS[Property]) ? "bt" : "tb");
				else if(/^(lr|rl|tb|bt)-/.test(HTMLCS[Property])) return  HTMLCS[Property];
			})();
		})();
		Item.Body.style["margin" + (function() {
			if(/-rl$/.test(Item.HTML.WritingMode)) return "Left";
			if(/-lr$/.test(Item.HTML.WritingMode)) return "Right";
			return "Bottom";
		})()] = 0;
		// Update Background
		if(Item.HTML.style) { Item.ItemBox.style.background = Item.contentDocument.defaultView.getComputedStyle(Item.HTML).background; Item.HTML.style.background = ""; }
		if(Item.Body.style) { Item.style.background         = Item.contentDocument.defaultView.getComputedStyle(Item.Body).background; Item.Body.style.background = ""; }
		// Layout Inside of the Spread
		if(!R.ToRelayout) {
			R.resetItem(Item);
			R.resetSpread(Item.Spread);
		}
		// Keys
		Item.contentWindow.addEventListener("keydown", C.listenKeys, false);
		/*if(!Item.LongWaited)*/ Item.Loaded = true;
		L.LoadedItems++;
		O.showStatus("Loaded... ( " + (L.LoadedItems) + "/" + R.Items.length + " Items )");
	}, 100);

	// Tap Scroller
	/*
	sML.addTouchEventObserver(Item.HTML).addTouchEventListener("tap", function(e, E) {
		R.observeTap(Item, E);
	});
	*/

};


L.postprocessLinkage = function(FilePath, RootElement, InBibiNavigation) {

	var FileDir  = FilePath.replace(/\/?([^\/]+)$/, "");
	var FileName = FilePath.replace(/^.+?([^\/]+)$/, "$1");

	sML.each(RootElement.getElementsByTagName("a"), function(i) {
		var A = sML.addTouchEventObserver(this);
		A.NavAIndex = i;
		var HrefPathInSource = A.getAttribute("href");
		if(!HrefPathInSource) {
			if(InBibiNavigation) {
				A.addEventListener("click", function(e) { e.preventDefault(); });
				A.addEventListener("mousedown", function(e) { e.stopPropagation(); });
				A.addTouchEventListener("tap", function(e) {
					e.stopPropagation();
					return false;
				});
				sML.addClass(A, "bibi-navigation-inactive-link");
			}
			return;
		}
		if(/^[a-zA-Z]+:/.test(HrefPathInSource)) return A.setAttribute("target", "_blank");
		var HrefPath = O.getPath(FileDir, (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? FileName : "") + HrefPathInSource);
		var HrefFnH = HrefPath.split("#"), HrefFile = HrefFnH[0] ? HrefFnH[0] : FilePath, HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
		var Jump = function(e) {
			e.stopPropagation();
			if(this.Target) {
				var This = this;
				var Go = R.Started ?
					function() { R.focus(This.Target); } :
					function() { C.Cartain.PlayButton.play(This.Target, This.NavAIndex); };
				This.InBibiNavigation ? C.Panel.toggle(Go) : Go();
			}
			return false;
		};
		R.Items.forEach(function(rItem) {
			if(HrefFile == rItem.Path) {
				A.setAttribute("data-bibi-original-href", HrefPathInSource);
				A.setAttribute("href", "bibi://" + B.Name + "/" + HrefPathInSource);
				A.InBibiNavigation = InBibiNavigation;
				A.Target = { Item: rItem, Element: (HrefHash ? "#" + HrefHash : null) };
				A.addEventListener("click", function(e) { e.preventDefault(); });
				A.addEventListener("mousedown", function(e) { e.stopPropagation(); });
				A.addTouchEventListener("tap", Jump);
				return;
			}
		});
		if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
			A.setAttribute("data-bibi-original-href", HrefPathInSource);
			A.setAttribute("href", "bibi://" + B.Name + "/#" + HrefHash);
			A.InBibiNavigation = InBibiNavigation;
			A.Target = O.getEPUBCFITarget(HrefHash);
			A.addEventListener("click", function(e) { e.preventDefault(); });
			A.addEventListener("mousedown", function(e) { e.stopPropagation(); });
			A.addTouchEventListener("tap", Jump);
		}
		if(InBibiNavigation && typeof X["pipi"]["nav"] == "number" && i == X["pipi"]["nav"] && A.Target) X["bibi"].To = A.Target;
	});

};


L.start = function() {

	C.createArrows();
	L.shutUpLoading();

	R.layout({
		Target: (X["bibi"].To ? X["bibi"].To : "head")
	});

	window.removeEventListener("resize", L.listenResizingWhileLoading);
	delete L.listenResizingWhileLoading;

	sML.style(R.Content.Main, {
		transition: "opacity 0.75s ease-in-out",
		opacity: 1
	});
	sML.style(C.Switches.Panel, { display: "block" });
	sML.style(C.Arrows, { opacity: 1 });
	if(X["bibi"].To) sML.style(C.Arrows.Back, { opacity: 1 });
	sML.style(C.Arrows.Forward, { opacity: 1 });
	setTimeout(function() {
		C.Cartain.close(function() {
			sML.removeClass(O.HTML, "preparing");
			setTimeout(function() {
				[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) { sML.style(Arrow, { opacity: "" }); });
				document.body.click(); // Making iOS browsers to responce for user scrolling immediately after loading.
			}, 500);
		});
	}, 1);

	L.shutUpLoading();

	window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
	window.addEventListener("scroll", R.onscroll);
	if(!O.SmartPhone) window.addEventListener("keydown", C.listenKeys, false);
	if(O.WindowEmbedded) window.addEventListener("message", C.listenMessage, false);

	R.Started = true;

	O.log(1, 'Enjoy!');

};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Manipuration

//----------------------------------------------------------------------------------------------------------------------------------------------

R.resetStage = function() {
	//if(sML.OS.iOS && sML.UA.Sa) O.Body.style.height = S["spread-layout-direction"] == "ttb" ? "100%" : window.innerHeight + "px";
	R.StageSize = {};
	R.StageSize.Width   = O.HTML.clientWidth;
	R.StageSize.Height  = O.HTML.clientHeight;// - 35 * 2;
	R.StageSize.Breadth = R.StageSize[S.SIZE.B] - S["spread-margin-start"] - S["spread-margin-end"];
	R.StageSize.Length  = R.StageSize[S.SIZE.L] - S["spread-gap"] * 2;
	//R.Content.Main.style["padding" + S.BASE.B] = R.Content.Main.style["padding" + S.BASE.A] = S["spread-gap"] + "px";
	R.Content.Main.style.padding = R.Content.Main.style.width = R.Content.Main.style.height = "";
	R.Content.Main.style["padding" + S.BASE.S] = R.Content.Main.style["padding" + S.BASE.E] = S["spread-margin-start"]/* + 35*/ + "px";
	R.Content.Main.style["background"] = S["book-background"];
	/*
	if(!R.Bar) R.Bar = document.body.appendChild(
		sML.create("div", {}, {
			position: "fixed",
			zIndex: 1000,
			left: 0,
			top: 0,
			width: "100%",
			height: "35px",
			background: "rgb(248,248,248)",
			background: "rgb(64,64,64)"
		})
	);
	*/
};

R.getItemInnerText = function(Item) {
	var InnerText = "InnerText";
	/**/ if(typeof Item.Body.innerText   != "undefined") InnerText = Item.Body.innerText;
	else if(typeof Item.Body.textContent != "undefined") InnerText = Item.Body.textContent;
	return InnerText.replace(/[\r\n\s\t ]/g, "");
};

R.resetItem = function(Item) {
	Item.Reset = false;
	Item.Reflowable = (Item.ItemRef["rendition:layout"] != "pre-paginated" || !Item.ItemRef["viewport"][S.SIZE.b] || !Item.ItemRef["viewport"][S.SIZE.l]);
	Item.Reflowable ? R.resetItem_Reflowable(Item) : R.resetItem_PrePagenated(Item);
	Item.Reset = true;
};

R.shock = function(Item) {
	var Z = 0, H = Item.HTML, B = Item.Body;
	Z = H.clientWidth; Z = H.clientHeight; Z = H.scrollWidth; Z = H.scrollHeight; Z = H.offsetWidth; Z = H.offsetHeight;
	Z = B.clientWidth; Z = B.clientHeight; Z = B.scrollWidth; Z = B.scrollHeight; Z = B.offsetWidth; Z = B.offsetHeight;
	return;
	sML.each(Item.HTML.querySelectorAll("body>*"), function() {
		Item.Body.removeChild(this);
		Item.Body.appendChild(this);
	});
};

R.resetItem_Reflowable = function(Item) {
	var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
	Item.Pages = [];
	Item.scrolling = "no";
	var ItemInnerText = R.getItemInnerText(Item);
	Item.IsSingleImageItem = (!ItemInnerText && Item.Body.querySelectorAll("img, svg").length - Item.Body.querySelectorAll("svg img").length == 1); // textContent... mmm...
	var StageB = R.StageSize.Breadth - (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]);
	var StageL = R.StageSize.Length  - (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
	var PageB  = StageB;
	var PageL  = StageL;
	var PageGap = S["item-padding-" + S.BASE.a] + S["spread-gap"] + S["item-padding-" + S.BASE.b];
	//if(S["page-size-format"] == "portrait" || S["page-size-format"] == "landscape") {
		var Ratio = 1.414 / 0.96;
		if((S.SIZE.l == "width" && S["page-size-format"] == "portrait") || (S.SIZE.l == "height" && S["page-size-format"] == "landscape")) Ratio = 1 / Ratio;
		PageL = Math.min(StageL, Math.floor(PageB * Ratio));
		if(!Item.IsSingleImageItem) {
			var Half = Math.floor((StageL - PageGap) / 2);
			PageL = (PageL < Half) ? Half : StageL;
		}
	//}
	ItemBox.style[S.SIZE.b] = PageB + ( S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e] ) + "px";
	Item.style["padding-" + S.BASE.b] = S["item-padding-" + S.BASE.b] + "px";
	Item.style["padding-" + S.BASE.a] = S["item-padding-" + S.BASE.a] + "px";
	Item.style["padding-" + S.BASE.s] = S["item-padding-" + S.BASE.s] + "px";
	Item.style["padding-" + S.BASE.e] = S["item-padding-" + S.BASE.e] + "px";
	Item.style[S.SIZE.b] = PageB + "px";
	Item.style[S.SIZE.l] = PageL + "px";
	Item.HTML.style[S.SIZE.b] = "";
	Item.HTML.style[S.SIZE.l] = "";
	Item.HTML.style[S.SIZE.b] = PageB + "px";
	Item.HTML.style[S.SIZE.l] = PageL + "px";
	sML.style(Item.HTML, { "column-width": "", "column-gap": "", "column-rule": "" });
	Item.Columned = false, Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
	var WordWrappingStyleSheetIndex = sML.CSS.addRule("*", "word-wrap: break-word;", Item.contentDocument);
	if(!ItemInnerText && Item.Body.getElementsByTagName("iframe").length == 1) { // textContent... mmm...
		var IFrame = Item.Body.getElementsByTagName("iframe")[0];
		IFrame.style[S.SIZE.b] = IFrame.style[S.SIZE.l] = "100%";
	}
	if(Item.IsSingleImageItem) {
		// Fitting Images
		if(S["fit-images"]) {
			sML.style(Item.HTML, { "transform-origin": "", "transformOrigin": "", "transform": "" });
			if(Item.Body["scroll" + S.SIZE.B] > PageB || Item.Body["scroll" + S.SIZE.L] > PageL) {
				var Scale = Math.floor(Math.min(PageB / Item.Body["scroll" + S.SIZE.B], PageL / Item.Body["scroll" + S.SIZE.L]) * 100) / 100;
				var TransformOrigin = { "lr-tb": "0 0", "rl-tb": "100% 0", "tb-rl": "100% 0", "bt-rl": "100% 100%", "tb-lr": "0 0", "bt-lr": "0 100%" }[Item.HTML.WritingMode];
				sML.style(Item.HTML, {
					"transform-origin": TransformOrigin,
					"transform": "scale(" + Scale + ")"
				});
			}
		}
	} else {
		// Fitting Images
		if(S["fit-images"] && S["fit-images"] != "in-single-image-only-item") {
			sML.each(Item.Body.getElementsByTagName("img"), function() {
				this.style.display       = this.Bibi.DefaultStyle["display"];
				this.style.verticalAlign = this.Bibi.DefaultStyle["vertical-align"];
				this.style.width         = this.Bibi.DefaultStyle["width"];
				this.style.height        = this.Bibi.DefaultStyle["height"];
				var MaxB = Math.floor(Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.b]), PageB));
				var MaxL = Math.floor(Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.l]), PageL));
				if(parseInt(getComputedStyle(this)[S.SIZE.b]) >= MaxB || parseInt(getComputedStyle(this)[S.SIZE.l]) >= MaxL) {
					if(getComputedStyle(this).display == "inline") this.style.display = "inline-block";
					this.style.verticalAlign = "top";
					if(parseInt(getComputedStyle(this)[S.SIZE.b]) >= MaxB) {
						this.style[S.SIZE.b] = MaxB + "px";
						this.style[S.SIZE.l] = "auto";
					}
					if(parseInt(getComputedStyle(this)[S.SIZE.l]) >= MaxL) {
						this.style[S.SIZE.l] = MaxL + "px";
						this.style[S.SIZE.b] = "auto";
					}
				}
			});
		}
		// Making Columns
		if(S["book-display-mode"] == "each" || Item.Body["scroll"+ S.SIZE.B] > PageB) {
			Item.Columned = true, Item.ColumnBreadth = PageB, Item.ColumnLength = PageL, Item.ColumnGap = PageGap;
			sML.style(Item.HTML, {
				"column-width": Item.ColumnLength + "px",
				"column-gap": Item.ColumnGap + "px",
				"column-rule": ""
			});
		}
		// Breaking Pages
		if(S["page-breaking"]) {
			var PBR; // PageBreakerRulers
			if(Item.Body["offset" + S.SIZE.B] <= PageB) PBR = [(S.SLA == "vertical" ? "Top" : "Left"), window["inner" + S.SIZE.L]/*PageL*/, S.SIZE.L, S.SIZE.l, S.BASE.a];
			else                                        PBR = [(S.SLA == "vertical" ? "Left" : "Top"), /*window["inner" + S.SIZE.B]*/PageB, S.SIZE.B, S.SIZE.b, S.BASE.e];
			sML.each(Item.contentDocument.querySelectorAll("html>body *"), function() {
				var ComputedStyle = getComputedStyle(this);
				if(ComputedStyle.pageBreakBefore != "always" && ComputedStyle.pageBreakAfter != "always") return;
				if(this.BibiPageBreakerBefore) this.BibiPageBreakerBefore.style[PBR[3]] = "";
				if(this.BibiPageBreakerAfter)  this.BibiPageBreakerAfter.style[PBR[3]] = "";
				var E = this, BreakPoint = E["offset" + PBR[0]], Add = 0;
				while(E.offsetParent) E = E.offsetParent, BreakPoint += E["offset" + PBR[0]];
				if(S.SLD == "rtl") BreakPoint = window["innerWidth"] + BreakPoint * -1 - this["offset" + PBR[2]];
				//sML.log(PBR);
				//sML.log(Item.ItemIndex + ": " + BreakPoint);
				if(ComputedStyle.pageBreakBefore == "always") {
					if(!this.BibiPageBreakerBefore) this.BibiPageBreakerBefore = sML.insertBefore(sML.create("span", { className: "bibi-page-breaker-before" }, { display: "block" }), this);
					Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
					this.BibiPageBreakerBefore.style[PBR[3]] = Add + "px";
				}
				if(ComputedStyle.pageBreakAfter == "always") {
					BreakPoint += Add + this["offset" + PBR[2]];
					//sML.log(Item.ItemIndex + ": " + BreakPoint);
					this.style["margin-" + PBR[4]] = 0;
					if(!this.BibiPageBreakerAfter) this.BibiPageBreakerAfter = sML.insertAfter(sML.create("span", { className: "bibi-page-breaker-after" }, { display: "block" }), this);
					Add = (PBR[1] - BreakPoint % PBR[1]); if(Add == PBR[1]) Add = 0;
					this.BibiPageBreakerAfter.style[PBR[3]] = Add + "px";
				}
			});
		}
	}
	sML.CSS.removeRule(WordWrappingStyleSheetIndex, Item.contentDocument);
	/**/ if(Item.IsSingleImageItem)        var ItemL = PageL;
	else if(sML.UA.InternetExplorer >= 10) var ItemL = Item.Body["client" + S.SIZE.L];
	else                                   var ItemL = Item.HTML["scroll" + S.SIZE.L];
	var Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
	ItemL = (PageL + PageGap) * Pages - PageGap;
	ItemBox.style[S.SIZE.l] = ItemL + (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]) + "px";
	Item.style[S.SIZE.l] = ItemL + "px";
	for(var i = 0; i < Pages; i++) {
		var Page = ItemBox.appendChild(sML.create("span", { className: "page" }));
		Page.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + "px";//S["spread-gap"] / 2 + "px";
		Page.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + "px";//S["spread-gap"] / 2 + "px";
		Page.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
		Page.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
		Page.style[            S.SIZE.b] = PageB + "px";
		Page.style[            S.SIZE.l] = PageL + "px";
		Page.style[            S.BASE.b] = (PageL + PageGap) * i/* - S["spread-gap"]*/ + "px";
		Page.Item = Item, Page.Spread = Spread;
		Page.PageIndexInItem = Item.Pages.length;
		Item.Pages.push(Page);
	}
	return Item;
};

R.resetItem_PrePagenated = function(Item) {
	var ItemIndex = Item.ItemIndex, ItemRef = Item.ItemRef, ItemBox = Item.ItemBox, Spread = Item.Spread;
	Item.Pages = [];
	Item.HTML.style.margin = Item.HTML.style.padding = Item.Body.style.margin = Item.Body.style.padding = 0;
	var PageB = R.StageSize.Breadth;
	var PageL = R.StageSize.Length;
	Item.style["padding" + S.BASE.B] = Item.style["padding" + S.BASE.A] = Item.style["padding" + S.BASE.S] = Item.style["padding" + S.BASE.E] = 0;
	if((S["spread-layout-direction"] == "ttb") && (ItemRef["page-spread"] == "right" || ItemRef["page-spread"] == "left")) {
		PageB = PageB / 2;
	}
	var Scale = Math.min(
		Math.min(ItemRef["viewport"][S.SIZE.b], PageB) / ItemRef["viewport"][S.SIZE.b],
		Math.min(ItemRef["viewport"][S.SIZE.l], PageL) / ItemRef["viewport"][S.SIZE.l]
	);
	PageL = Math.floor(ItemRef["viewport"][S.SIZE.l] * Scale);
	PageB = Math.floor(ItemRef["viewport"][S.SIZE.b] * (PageL / ItemRef["viewport"][S.SIZE.l]));
	Item.style[S.SIZE.l] = ItemBox.style[S.SIZE.l] = PageL + "px";
	Item.style[S.SIZE.b] = ItemBox.style[S.SIZE.b] = PageB + "px";
	sML.style(Item.HTML, {
		"width": ItemRef["viewport"].width + "px",
		"height": ItemRef["viewport"].height + "px",
		"transform-origin": "0 0",
		"transformOrigin": "0 0",
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

R.resetSpread = function(Spread) {
	var SpreadBox = Spread.SpreadBox;
	SpreadBox.style["margin" + S.BASE.B] = SpreadBox.style["margin" + S.BASE.A] = "";
	SpreadBox.style["margin" + S.BASE.E] = SpreadBox.style["margin" + S.BASE.S] = "auto";
	SpreadBox.style.padding = "";
	if(Spread.Items.length == 1) {
		SpreadBox.style[S.SIZE.b] = Spread.style[S.SIZE.b] = Spread.Items[0].ItemBox.style[S.SIZE.b];
		SpreadBox.style[S.SIZE.l] = Spread.style[S.SIZE.l] = Spread.Items[0].ItemBox.style[S.SIZE.l];
	} else {
		SpreadBox.style.width  = Spread.style.width  = Math.ceil(        (parseFloat(Spread.Items[0].ItemBox.style.width) + parseFloat(Spread.Items[1].ItemBox.style.width) )) + "px";
		SpreadBox.style.height = Spread.style.height = Math.ceil(Math.max(parseFloat(Spread.Items[0].ItemBox.style.height), parseFloat(Spread.Items[1].ItemBox.style.height))) + "px";
	}
	Spread.style["border-radius"] = S["spread-border-radius"];
	Spread.style["box-shadow"]    = S["spread-box-shadow"];
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
			});
		});
	});
	return R.Pages;
};

R.resetNavigation = function() {
	sML.style(C.Panel.Navigation.Item, { float: "" });
	if(S.PPD == "rtl") {
		var theWidth = C.Panel.Navigation.Item.scrollWidth - window.innerWidth;
		if(C.Panel.Navigation.Item.scrollWidth < window.innerWidth) sML.style(C.Panel.Navigation.Item, { float: "right" });
		C.Panel.Navigation.ItemBox.scrollLeft = C.Panel.Navigation.ItemBox.scrollWidth - window.innerWidth;
	}
};


R.layoutSpread = function(Spread, Target) {
	var SpreadBox = Spread.SpreadBox;
	var IsHeadSpread = false, IsFootSpread = false;/*
	if(S.BDM == "each") {
		IsHeadSpread = IsFootSpread = true;
	} else {*/
		IsHeadSpread = (Spread.SpreadIndex == 0);
		IsFootSpread = (Spread.SpreadIndex == R.Spreads.length - 1);
	//}
	SpreadBox.style.padding = "";
	// Set padding-start + padding-end of SpreadBox
	var SpreadBoxPaddingStart = 0, SpreadBoxPaddingEnd = 0;
	if(S.SLA == "vertical") {
		// Set padding-left + padding-right of pre-pagenated-single
		if(Spread.Items.length == 1) {
			if(Spread.Items[0].ItemRef["page-spread"] == "right") {
				if(S.PPD == "ltr") SpreadBoxPaddingStart += Spread.offsetWidth;
				if(S.PPD == "rtl") SpreadBoxPaddingEnd   += Spread.offsetWidth;
				SpreadBox.style.paddingLeft = Spread.offsetWidth + "px";
			} else if(Spread.Items[0].ItemRef["page-spread"] == "left") {
				if(S.PPD == "ltr") SpreadBoxPaddingEnd   += Spread.offsetWidth;
				if(S.PPD == "rtl") SpreadBoxPaddingStart += Spread.offsetWidth;
				SpreadBox.style.paddingRight = Spread.offsetWidth + "px";
			}
		}
	} else if(SpreadBox["offset" + S.SIZE.B] < R.StageSize.Breadth) {
		SpreadBoxPaddingEnd   += Math.floor((R.StageSize.Breadth - SpreadBox["offset" + S.SIZE.B]) / 2);
		SpreadBoxPaddingStart += R.StageSize.Breadth - SpreadBox["offset" + S.SIZE.B] - SpreadBoxPaddingEnd;
		if(SpreadBoxPaddingStart) SpreadBox.style["padding" + S.BASE.S] = SpreadBoxPaddingStart + "px";
		if(SpreadBoxPaddingEnd)   SpreadBox.style["padding" + S.BASE.E] = SpreadBoxPaddingEnd   + "px";
	}
	// Set padding-before + padding-after of SpreadBox
	var SpreadBoxPaddingBefore = 0, SpreadBoxPaddingAfter = 0;
	if(IsHeadSpread) {
		SpreadBoxPaddingBefore = Math.floor((R.StageSize.Length - SpreadBox["offset" + S.SIZE.L]) / 2);
		if(SpreadBoxPaddingBefore < S["spread-gap"]) SpreadBoxPaddingBefore = S["spread-gap"];
	} else if(B.Package.Metadata["rendition:layout"] == "reflowable") {
		SpreadBoxPaddingBefore = S["spread-gap"];
	} else {
		SpreadBoxPaddingBefore = Math.floor(R.StageSize.Length / 2/* - S["spread-gap"]*/);
	}
	if(IsFootSpread) {
		SpreadBoxPaddingAfter  += Math.ceil( (R.StageSize.Length - SpreadBox["offset" + S.SIZE.L]) / 2);
		if(SpreadBoxPaddingAfter  < S["spread-gap"]) SpreadBoxPaddingAfter  = S["spread-gap"];
	}
	if(SpreadBoxPaddingBefore) SpreadBox.style["padding" + S.BASE.B] = SpreadBoxPaddingBefore + "px";
	if(SpreadBoxPaddingAfter)  SpreadBox.style["padding" + S.BASE.A] = SpreadBoxPaddingAfter  + "px";
	// Adjust R.Content.Main (div#epub-content-main)
	var MainContentLength = 0;
	R.Spreads.forEach(function(Spread) {
		MainContentLength += Spread.SpreadBox["offset" + S.SIZE.L];
	});
	R.Content.Main.style[S.SIZE.b] = "";
	R.Content.Main.style[S.SIZE.l] = MainContentLength + "px";
};


/*
R.layoutStage = function() {
	for(var L = R.Spreads.length, i = 0, StageLength = 0; i < L; i++) StageLength += R.Spreads[i].SpreadBox["offset" + S.SIZE.L];
	R.Content.Main.style[S.SIZE.l] = StageLength + "px";
};
*/


R.layout = function(Param) {

	/*
		Param: {
			Target: BibiTarget (Required),
			Reset: Boolean (Required),
			Setting: BibiSetting (Optional)
		}
	*/

	if(!R.Layouted || !R.ToRelayout) O.log(2, 'Laying Out...');

	R.Layouted = true;

	window.removeEventListener("scroll", R.onscroll);
	window.removeEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);

	if(!Param) Param = {};

	if(!Param.Target) {
		var CurrentPage = R.getCurrentPages().Start;
		Param.Target = {
			ItemIndex: CurrentPage.Item.ItemIndex,
			PageProgressInItem: CurrentPage.PageIndexInItem / CurrentPage.Item.Pages.length
		}
	}

	if(Param.Setting) O.updateSetting(Param.Setting);

	if(Param.Reset || R.ToRelayout) {
		R.ToRelayout = false;
		R.resetStage();
		for(var SL = R.Spreads.length, SI = 0; SI < SL; SI++) {
			O.showStatus("Rendering... ( " + (SI + 1) + "/" + SL + " Spreads )");
			for(var IL = R.Spreads[SI].Items.length, II = 0; II < IL; II++) {
				R.resetItem(R.Spreads[SI].Items[II]);
			}
			R.resetSpread(R.Spreads[SI]);
		}
		R.resetPages();
		R.resetNavigation();
	}

	R.Columned = false;
	for(var i = 0, L = R.Items.length; i < L; i++) {
		var Style = R.Items[i].HTML.style;
		if(Style["-webkit-column-width"] || Style["-moz-column-width"] || Style["-ms-column-width"] || Style["column-width"]) {
			R.Columned = true;
			break;
		}
	}

	Param.Target = R.getTarget(Param.Target);

	R.Spreads.forEach(function(Spread) {
		R.layoutSpread(Spread, Param.Target);
	});

	//R.layoutStage();

	R.focus(Param.Target, { Duration: 0, Easing: 0 });

	O.log(3, "rendition:layout: " + B.Package.Metadata["rendition:layout"]);
	O.log(3, "page-progression-direction: " + S["page-progression-direction"]);
	O.log(3, "spread-layout-axis: " + S["spread-layout-axis"]);
	O.log(3, "book-display-mode: " + S["book-display-mode"]);
//	O.log(3, "page-size-format: "   + S["page-size-format"]);
	O.log(2, 'Laid Out.');

	if(typeof doAfter == "function") doAfter();

	window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
	window.addEventListener("scroll", R.onscroll);

	return S;

};


R.Relayouting = 0;

R.relayout = function(Param) {
	if(!R.Started) {
		if(Param && Param.Setting) O.updateSetting(Param.Setting);
		return C.Cartain.PlayButton.play();
	}
	if(R.Relayouting) return;
	R.Relayouting++;
	var CurrentPages = R.getCurrentPages();
	var Target = CurrentPages.Start ? {
		ItemIndex: CurrentPages.Start.Item.ItemIndex,
		PageProgressInItem: CurrentPages.Start.PageIndexInItem / CurrentPages.Start.Item.Pages.length
	} : {
		ItemIndex: 0,
		PageProgressInItem: 0
	};
	setTimeout(function() {
		sML.style(R.Content.Main, {
			transition: "opacity 0.4s ease",
			opacity: 0
		});
		window.removeEventListener("scroll", R.onscroll);
		window.removeEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
		sML.addClass(O.HTML, "preparing");
		setTimeout(function() {
			R.layout({
				Target: Target,
				Reset: true,
				Setting: Param && Param.Setting ? Param.Setting : undefined
			});
			R.Relayouting--;
			if(!R.Relayouting) setTimeout(function() {
				sML.removeClass(O.HTML, "preparing");
				window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", R.onresize);
				window.addEventListener("scroll", R.onscroll);
				sML.style(R.Content.Main, {
					transition: "opacity 0.4s ease",
					opacity: 1
				});
			}, 100);
		}, 100);
	}, 222);
};

R.onscroll = function() {
};

R.onresize = function() {
	if(R.Timer_onresize) clearTimeout(R.Timer_onresize);
	R.Timer_onresize = setTimeout(function() {
		R.relayout();
	}, 888);
};


R.changeView = function(View, Value) {
	if(View == "paged") {
		if(S.BDM == "all") {
			R.relayout({
				Setting: {
					"book-display-mode" : "each",
					"spread-layout-axis" : (B.Package.Spine["page-progression-direction"] == "rtl" || B.Package.Metadata["rendition:layout"] == "pre-paginated") ? "vertical" : "horizontal"/*,
					"page-size-format": "window"*/
				}
			});
		}
	} else {
		var Axis = (Value != "vertical") ? "horizontal" : "vertical";
		if(S.BDM == "each" || Axis != S.SLA) {
			R.Spreads.forEach(function(Spread) {
				Spread.style.opacity = 1;
			});
			R.relayout({
				Setting: {
					"book-display-mode": "all",
					"spread-layout-axis": Axis,
					"page-size-format": P["page-size-format"]
				}
			});
		}
	}
};

R.changeBookDisplayMode  = function(BDM) { // for Back Compatibility.
	if(BDM == "each") R.changeView("paged");
	else              R.changeView("scroll", "horizontal");
};

R.changeSpreadLayoutAxis = function(SLA) { // for Back Compatibility.
	R.changeView("scroll", SLA);
};


R.getTarget = function(Target) {
	     if(typeof Target == "string") Target = { Edge: Target };
	else if(typeof Target == "number") Target = { Item: R.Items[Target] };
	if(typeof Target != "object" || !Target) return null;
	if(Target.tagName) {
		TargetElement = Target, Target = {};
		     if(typeof TargetElement.SpreadIndex == "number") Target.Item    = TargetElement.Items[0];
		else if(typeof TargetElement.ItemIndex   == "number") Target.Item    = TargetElement;
		else if(typeof TargetElement.PageIndex   == "number") Target.Page    = TargetElement;
		else                                                  Target.Element = TargetElement;
	}
	if(typeof Target.Edge == "string") {
		if(Target.Edge == "head") return { Edge: "head", EdgeTRBL: (S.SLD == "ttb" ? "T" : (S.SLD == "rtl" ? "R" : "L")), Item: R.Items[0],                  Page: R.Pages[0] };
		if(Target.Edge == "foot") return { Edge: "foot", EdgeTRBL: (S.SLD == "ttb" ? "B" : (S.SLD == "rtl" ? "L" : "R")), Item: R.Items[R.Items.length - 1], Page: R.Pages[R.Pages.length - 1] };
	}
	if(!Target.Item && typeof Target.ItemIndex == "number") Target.Item = R.Items[Target.ItemIndex];
	if(Target.Page && !Target.Page.parentElement) delete Target.Page;
	if(Target.Element) {
		if(Target.Element.tagName) { // In-Frame Content
			Target.Item = Target.Element.ownerDocument.body.Item ? Target.Element.ownerDocument.body.Item : null;
		} else if(typeof Target.Element == "string" && Target.Item) { // Selector
			Target.Element = Target.Item.contentDocument.querySelector(Target.Element);
			if(!Target.Element) delete Target.Element;
		}
		Target.Page = Target.Item.Pages[0];
	} else if(Target.Page) {
		Target.Item = Target.Page.Item;
	} else if(typeof Target.PageIndexInItem == "number" && Target.Item) {
		Target.Page = Target.Item.Pages[Target.PageIndexInItem];
	} else if(typeof Target.PageProgressInItem == "number" && Target.Item) {
		Target.Page = Target.Item.Pages[Math.floor(Target.Item.Pages.length * Target.PageProgressInItem)];
	} else if(typeof Target.PageIndex == "number") {
		Target.Page = R.Pages[Target.PageIndex];
		Target.Item = Target.Page.Item;
	}
	if(!Target.Item) return null;
	if(!Target.Page) Target.Page = Target.Item.Pages[0];
	return Target;
};


R.getCurrentPages = function() {
	var FrameScrollCoord = sML.Coord.getScrollCoord(R.Frame);
	var FrameClientSize  = sML.Coord.getClientSize(R.Frame);
	FrameScrollCoord = {
		Left:   FrameScrollCoord.X,
		Right:  FrameScrollCoord.X + FrameClientSize.Width,
		Top:    FrameScrollCoord.Y,
		Bottom: FrameScrollCoord.Y + FrameClientSize.Height,
	};
	var CurrentPages = [], CenterPage = null, Longest = 0, Nearest = FrameClientSize[S.SIZE.L] / 2;
	for(var L = R.Pages.length, i = 0; i < L; i++) {
		if(R.Pages[i].style.display == "none") continue;
		var PageCoord = sML.getCoord(R.Pages[i]);
		var Length   = Math.min(
			FrameScrollCoord[S.BASE.A] / R.Scale * S.AXIS.PM,
			PageCoord[S.BASE.A] * S.AXIS.PM
		) - Math.max(
			FrameScrollCoord[S.BASE.B] / R.Scale * S.AXIS.PM,
			PageCoord[S.BASE.B] * S.AXIS.PM
		);
		var Distance = Math.abs((FrameScrollCoord[S.BASE.B] / R.Scale + FrameScrollCoord[S.BASE.A] / R.Scale) - (PageCoord[S.BASE.B] + PageCoord[S.BASE.a]));
		Length = (Length <= 0 || !PageCoord[S.SIZE.L] || isNaN(Length)) ? -1 : Math.round(Length / PageCoord[S.SIZE.L] * 100);
		     if(Length <  Longest) { if(!CurrentPages.length) continue; else break; }
		else if(Length == Longest) CurrentPages.push(R.Pages[i]);
		else if(Length  > Longest) CurrentPages[0] = R.Pages[i], Longest = Length;
		if(Distance < Nearest) CenterPage = R.Pages[i], Nearest = Distance;
	}
	return {
		All:    CurrentPages,
		Start:  CurrentPages[0],
		Center: CenterPage,
		End:    CurrentPages[CurrentPages.length - 1]
	};
};


R.getPageGroup = function(Target) {
	Target = R.getTarget(Target);
	var Next = (Target.Side == "a") ? -1 : +1;
	var Pages = [], Length = 0, Space = document.documentElement["client" + S.SIZE.L];
	for(var i = Target.Page.PageIndex; 0 <= i && i < R.Pages.length; i += Next) {
		if((Target.Item.IsPrePaginated && R.Pages[i].Spread != Target.Page.Spread)) break;
		if(Space - R.Pages[i]["offset" + S.SIZE.L] < 0) break;
		Pages.push(R.Pages[i]);
		if(S.SLD == "ttb" && R.Pages[i].Item.Pair && R.Pages[i].Item.Pair == Target.Page.Item) continue;
		var PageGap = (i < 0 ? S["spread-gap"] : 0);
		Space  -= R.Pages[i]["offset" + S.SIZE.L] + PageGap;
		Length += R.Pages[i]["offset" + S.SIZE.L] + PageGap;
	}
	var MarginBeforeGroup = Math.floor(Space / 2), MarginBeforePage = MarginBeforeGroup;
	if(Target.Side == "a") {
		Pages.reverse();
		MarginBeforePage += (Length - Target.Page["offset" + S.SIZE.L]);
	}
	return {
		Page:              Target.Page,
		Pages:             Pages,
		Length:            Length,
		MarginBeforeGroup: MarginBeforeGroup,
		MarginBeforePage:  MarginBeforePage
	};
};


R.focus = function(Target, ScrollOption) {
	var FocusTarget = R.getTarget(Target); if(typeof FocusTarget != "object" || !FocusTarget) return false;
	if(FocusTarget.Edge) {
		var FocusPoint = /^[TL]$/.test(FocusTarget.EdgeTRBL) ? 0 : R.Content.Main["offset" + [S.SIZE.L]] - sML.Coord.getClientSize(R.Frame)[S.SIZE.L];
		sML.scrollTo(R.Frame, (S.SLD == "ttb" ? { Y: FocusPoint * R.Scale } : { X: FocusPoint * R.Scale }), ScrollOption);
		return false;
	}
	var Top_or_Left = (S.SLD == "ttb") ? ["Top", "Left"] : ["Left", "Top"];
	var E, FocusPoint, FocusSpread, TextLocationTarget = { Element: FocusTarget.Element, TextNodeIndex: FocusTarget.TextNodeIndex, TermStep: FocusTarget.TermStep };
	if(FocusTarget.Element) {
		E = FocusTarget.Item.Pages[0];
		var ElementPoint = E["offset" + Top_or_Left[0]];
		while(E.offsetParent) E = E.offsetParent, ElementPoint += E["offset" + Top_or_Left[0]];
		E = FocusTarget.Element;              var OffsetInItem  = E["offset" + Top_or_Left[0]], OffsetInItemO  = E["offset" + Top_or_Left[1]];
		while(E.offsetParent) E = E.offsetParent, OffsetInItem += E["offset" + Top_or_Left[0]], OffsetInItemO += E["offset" + Top_or_Left[1]];
		if(sML.getCoord(FocusTarget.Element)[S.BASE.s] > FocusTarget.Item["offset" + S.SIZE.B] - S["item-padding-" + S.BASE.s] - S["item-padding-" + S.BASE.e]) {
			// Columned
			if(OffsetInItemO == 0) {
				OffsetInItem = 0;
			} else if(S.PPD != "rtl") {
				OffsetInItem = (FocusTarget.Item.ColumnLength + FocusTarget.Item.ColumnGap) * Math.floor(OffsetInItemO / FocusTarget.Item.ColumnBreadth) - (S["item-padding-" + S.BASE.b]);
			} else {
				OffsetInItem = (FocusTarget.Item.ColumnLength + FocusTarget.Item.ColumnGap) * Math.ceil( OffsetInItemO / FocusTarget.Item.ColumnBreadth) - (S["item-padding-" + S.BASE.a]);
			}
			if(S.SLD == "rtl") OffsetInItem = FocusTarget.Item["offsetWidth"] - OffsetInItem;
		} else {
			if(S.SLD == "rtl") OffsetInItem += FocusTarget.Element["offsetWidth"];
		}
		ElementPoint += S["item-padding-" + Top_or_Left[0].toLowerCase()] + OffsetInItem;
		// Find Nearest Page
		FocusTarget.Item.Pages.forEach(function(Page) {
			var PageBefore = sML.getCoord(Page)[S.BASE.b];
			if((ElementPoint + 8) * S.AXIS.PM < PageBefore * S.AXIS.PM) return false;
			FocusPoint = PageBefore;
		});
		if(S.SLD == "rtl") FocusPoint += S["spread-gap"];
		else               FocusPoint -= S["spread-gap"];
		if(typeof TextLocationTarget.TextNodeIndex == "number") R.pointTextLocation(TextLocationTarget); // Colorize Target with Selection
		FocusSpread = FocusTarget.Item.Spread;
	} else {
		var FocusTargetPageGroup = R.getPageGroup(FocusTarget);
		E = FocusTargetPageGroup.Pages[0];
		FocusPoint = E["offset" + Top_or_Left[0]];
		//if(FocusTargetPageGroup.length == 1) FocusPoint += Math.ceil(E["offset" + S.SIZE.L] / 2);
		while(E.offsetParent) E = E.offsetParent, FocusPoint += E["offset" + Top_or_Left[0]];
		if(S.SLD == "rtl") FocusPoint += Math.floor(FocusTargetPageGroup.Pages[0]["offset" + S.SIZE.L]);
		if(window["inner" + S.SIZE.L] > FocusTargetPageGroup.Pages[0]["offset" + S.SIZE.L]) {
			var PageMargin = Math.floor((window["inner" + S.SIZE.L] - FocusTargetPageGroup.Length) / 2);
			if(PageMargin > 0) FocusPoint -= PageMargin * S.AXIS.PM;
		}
		FocusSpread = FocusTargetPageGroup.Pages[0].Spread;
	}
	if(S.SLD == "rtl") FocusPoint = FocusPoint - window["inner" + S.SIZE.L];
	sML.scrollTo(
		R.Frame,
		(S.SLD == "ttb") ? { Y:FocusPoint * R.Scale } : { X:FocusPoint * R.Scale },
		ScrollOption,
		(S.BDM == "each") ? {
			end: function() {
				R.Spreads.forEach(function(Spread) {
					if(Spread == FocusSpread) Spread.style.opacity = 1;
					//else                      Spread.style.opacity = 0;
				});
				sML.removeClass(O.HTML, "flipping-ltr");
				sML.removeClass(O.HTML, "flipping-rtl");
			}
		} : undefined
	);
	return false;
};


R.pointTextLocation = function(Target) {
	if(typeof Target.TextNodeIndex != "number") return;
	var TargetNode = Target.Element.childNodes[Target.TextNodeIndex];
	if(!TargetNode || !TargetNode.textContent) return;
	var Sides = { Start: { Node: TargetNode, Index: 0 }, End: { Node: TargetNode, Index: TargetNode.textContent.length } };
	if(Target.TermStep) {
		if(Target.TermStep.Preceding || Target.TermStep.Following) {
			Sides.Start.Index = Target.TermStep.Index, Sides.End.Index = Target.TermStep.Index;
			if(Target.TermStep.Preceding) Sides.Start.Index -= Target.TermStep.Preceding.length;
			if(Target.TermStep.Following)   Sides.End.Index += Target.TermStep.Following.length;
			if(Sides.Start.Index < 0 || TargetNode.textContent.length < Sides.End.Index) return;
			if(TargetNode.textContent.substr(Sides.Start.Index, Sides.End.Index - Sides.Start.Index) != Target.TermStep.Preceding + Target.TermStep.Following) return;
		} else if(Target.TermStep.Side && Target.TermStep.Side == "a") {
			Sides.Start.Node = TargetNode.parentNode.firstChild; while(Sides.Start.Node.childNodes.length) Sides.Start.Node = Sides.Start.Node.firstChild;
			Sides.End.Index = Target.TermStep.Index - 1;
		} else {
			Sides.Start.Index = Target.TermStep.Index;
			Sides.End.Node = TargetNode.parentNode.lastChild; while(Sides.End.Node.childNodes.length) Sides.End.Node = Sides.End.Node.lastChild;
			Sides.End.Index = Sides.End.Node.textContent.length;
		}
	}
	return sML.select(Sides);
};


R.page = function(Distance) {
	if(Distance != -1) Distance = +1;
	var CurrentPages = R.getCurrentPages(), CurrentPage = Distance < 0 ? CurrentPages.Start : CurrentPages.End;
	var TargetPageIndex = CurrentPage.PageIndex + Distance;
	if(TargetPageIndex <                  0) return R.focus({ Edge: "head" });
	if(TargetPageIndex > R.Pages.length - 1) return R.focus({ Edge: "foot" });
	var TargetPage = R.Pages[TargetPageIndex];
	if(S.SLA == "vertical" && TargetPage.Item.Pair) {
		if(CurrentPage.Item.Pair == TargetPage.Item) TargetPageIndex += (Distance > 0 ? +1 : -1);
	}
	if(S.SLA == "horizontal" && TargetPage.Item.Pair && window["inner" + S.SIZE.L] > TargetPage.Item[S.SIZE.L] * 2) {
		if(Distance < 0 && TargetPage.PageIndexInSpread == 0) TargetPage = TargetPage.Spread.Pages[1];
		if(Distance > 0 && TargetPage.PageIndexInSpread == 1) TargetPage = TargetPage.Spread.Pages[0];
	}
	/*
	if(S.BDM == "each" && TargetPage.Spread != CurrentPage.Spread) {
		return R.focus(TargetPage, { p:1, t:1 });
	}
	*/
	var focus = function() {
		R.focus(
			{ Page: TargetPage, Side: (Distance > 0 ? "b" : "a") },
			(S["book-display-mode"] == "each") ? { Duration: 1 } : undefined
		);
	};
	if(S["book-display-mode"] == "each") {
		sML.style(R.Content, {
			transition: "ease-out 0.05s"
		});
		sML.addClass(O.HTML, "flipping-" + (Distance * (S["page-progression-direction"] == "rtl" ? 1 : -1) > 0 ? "rtl" : "ltr"));
		setTimeout(function() {
			sML.style(R.Content, {
				transition: "none"
			});
			focus();
		}, 50);
	} else {
		focus();
	}
};


R.scroll = function(Distance) {
	if(Distance != -1) Distance = +1;
	return sML.scrollTo(
		R.Frame,
		(function(ScrollCoord) {
			switch(S.SLD) {
				case "ttb": return { Y: ScrollCoord.Y + (R.StageSize.Length + S["spread-gap"]) * Distance      };
				case "ltr": return { X: ScrollCoord.X + (R.StageSize.Length + S["spread-gap"]) * Distance      };
				case "rtl": return { X: ScrollCoord.X + (R.StageSize.Length + S["spread-gap"]) * Distance * -1 };
			}
		})(sML.Coord.getScrollCoord(R.Frame))
	);
};


R.move = function(Distance) {
	((R.Columned || B.Package.Metadata["rendition:layout"] == "pre-paginated") ? R.page : R.scroll)(Distance);
};


R.to = function(BibitoString) {
	return R.focus(O.getBibitoTarget(BibitoString));
};


R.Scale = 1;

R.zoom = function(Scale) {
	if(typeof Scale != "number" || Scale <= 0) Scale = 1;
	var CurrentStartPage = R.getCurrentPages().Start;
	sML.style(R.Content.Main, { "transform-origin": S.SLD == "rtl" ? "100% 0" : "0 0" });
	if(Scale == 1) {
		O.HTML.style.overflow = "";
		sML.style(R.Content.Main, { transform: "" });
	} else {
		sML.style(R.Content.Main, { transform: "scale(" + Scale + ")" });
		O.HTML.style.overflow = "auto";
	}
	setTimeout(function() {
		R.focus(CurrentStartPage, { Duration: 1 });
	}, 0);
	R.Scale = Scale;
};

/*
R.observeTap = function(Layer, E) {
	var L = "", Point = { X: E.center.x, Y: E.center.y };
	if(typeof Layer.SpreadIndex != "undefined") {
		L = "Spread";
	} else {
		L = "Item";
		var FrameScrollCoord = sML.Coord.getScrollCoord(R.Frame);
		var ElementCoord = sML.Coord.getElementCoord(Layer);
		Point.X = ElementCoord.X + parseInt(R.Items[0].style.paddingLeft) + Point.X - FrameScrollCoord.X;
		Point.Y = ElementCoord.Y + parseInt(R.Items[0].style.paddingTop)  + Point.Y - FrameScrollCoord.Y;
	}
	sML.log(E);
	sML.log(L + ": { X: " + Point.X + ", Y: " + Point.Y + " }");
};
*/




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Controls

//----------------------------------------------------------------------------------------------------------------------------------------------


C.weaveCartain = function() {

	C.Cartain = document.getElementById("bibi-cartain");

	sML.edit(C.Cartain, {
		State: 1, // Translate: 240, /* % */ // Rotate: -48, /* deg */ // Perspective: 240, /* px */
		open: function(Cb) {
			if(this.State == 1) return (typeof Cb == "function" ? Cb() : this.State);
			this.State = 1;
			this.style.display = "block";
			this.style.zIndex = 100;
			sML.style(this, {
				transition: "0.5s ease-out",
				transform: "translate" + S.AXIS.XY + "(0)",
				opacity: 0.75
			}, function() {
				if(typeof Cb == "function") Cb();
			});
			return this.State;
		},
		close: function(Cb) {
			if(this.State == 0) return (typeof Cb == "function" ? Cb() : this.State);
			this.State = 0;
			this.Message.style.opacity = 0;
			sML.style(this, {
				transition: "0.5s ease-in",
				transform: "translate" + S.AXIS.XY + "(" + (S.AXIS.PM * -1 * 240) + "%)",
				opacity: 0
			}, function() {
				sML.style(this, {
					transition: "none",
					transform: "translate" + S.AXIS.XY + "(" + (S.AXIS.PM * 240) + "%)"
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
	});

	C.Cartain.Powered = C.Cartain.appendChild(sML.create("p", { id: "bibi-cartain-powered", innerHTML: O.getLogo({ Linkify: true }) }));

	C.Cartain.Cover   = C.Cartain.insertBefore(sML.create("div", { id: "bibi-cartain-cover" }), C.Cartain.Powered);
	C.Cartain.Mark    = C.Cartain.insertBefore(sML.create("div", { id: "bibi-cartain-mark",    className: "animate" }), C.Cartain.Powered);
	C.Cartain.Message = C.Cartain.insertBefore(sML.create("p",   { id: "bibi-cartain-message", className: "animate" }), C.Cartain.Powered);
	for(var i = 1; i <= 8; i++) C.Cartain.Mark.appendChild(sML.create("span", { className: "dot" + i }));

	C.Cartain.createPlayButton = function(Param) {
		var Title = (sML.OS.iOS || sML.OS.Android ? 'Tap' : 'Click') + ' to Open';
		C.Cartain.PlayButton = C.Cartain.appendChild(
			sML.create("p", { id: "bibi-cartain-playbutton", title: Title,
				innerHTML: '<span class="non-visual">' + Title + ' to Open</span>',
				play: function(To, NavAIndex) {
					if(O.SmartPhone) {
						var URI = location.href.replace(/&wait=[^&]+/g, "");
						if(typeof NavAIndex == "number") URI = [URI, 'pipi(nav:' + NavAIndex + ')'].join(/#/.test(URI) ? "," : "#");
						return window.open(URI);
					}
					if(To) X["bibi"].To = To;
					L.sayLoading();
					this.removeTouchEventListener("tap");
					sML.style(this, {
						opacity: 0,
						cursor: "default"
					});
					Param.onplay();
				}
			})
		);
		sML.addTouchEventObserver(C.Cartain.PlayButton).addTouchEventListener("tap", function(e) {
			this.play();
			sML.stopPropagation(e);
		});
	};

	C.Cartain.Message.note = function(Note) {
		C.Cartain.Message.innerHTML = Note;
		return Note;
	};

};


C.createPanel = function() {

	if(C.Panel) C.Panel.innerHTML = "";
	else C.Panel = O.Body.appendChild(
		sML.create("div", { id: "bibi-panel",
			State: 0,
			open: function(Cb) {
				if(this.State == 1) return (typeof Cb == "function" ? Cb() : this.State);
				this.State = 1;
				C.Switches.Panel.toggleState(this.State);
				sML.addClass(O.HTML, "panel-opened");
				setTimeout(Cb, 250);
				return this.State;
			},
			close: function(Cb) {
				if(this.State == 0) return (typeof Cb == "function" ? Cb() : this.State);
				this.State = 0;
				C.Switches.Panel.toggleState(this.State);
				sML.removeClass(O.HTML, "panel-opened");
				setTimeout(Cb, 250);
				return this.State;
			},
			toggle: function(Cb) {
				return (this.State == 0 ? this.open(Cb) : this.close(Cb));
			}
		})
	);

};


C.createPanelMisc = function() {

	C.Panel.Misc = C.Panel.appendChild(sML.create("div", { id: "bibi-panel-misc", innerHTML: O.getLogo({ Linkify: true }) }));

};


C.createPanelNavigation = function() {

	C.Panel.Navigation = C.Panel.appendChild(
		sML.create("div", { id: "bibi-panel-navigation" })
	);
	C.Panel.Navigation.ItemBox = C.Panel.Navigation.appendChild(
		sML.create("div", { id: "bibi-panel-navigation-item-box" })
	);
	C.Panel.Navigation.Item = C.Panel.Navigation.ItemBox.appendChild(
		sML.create("div", { id: "bibi-panel-navigation-item" })
	);
	if(!sML.OS.iOS && !sML.OS.Android) {
		sML.addTouchEventObserver(C.Panel.Navigation.ItemBox).addTouchEventListener("tap", function(e) {
			C.Panel.toggle();
		});
	}

};


C.createPanelMenu = function() {

	C.Panel.Menu = C.Panel.appendChild(
		sML.create("div", { id: "bibi-panel-menu" })
	);

	var Shape = {};
	Shape.Item     = '<span class="bibi-shape bibi-shape-item"></span>';
	Shape.Spread   = '<span class="bibi-shape bibi-shape-spread">' + Shape.Item + Shape.Item + '</span>';
	Shape.SpreadsS = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-single">' + Shape.Spread + '</span>';
	Shape.SpreadsV = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';
	Shape.SpreadsH = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';

	C.Panel.Menu["view"] = C.Panel.Menu.appendChild(
		sML.create("ul", { id: "bibi-panel-menu-view" })
	);
	C.Panel.Menu["view"].Buttons = {
		"display-each": C.Panel.Menu["view"].appendChild(
			sML.create("li", { className: "display-each",      innerHTML: '<span class="bibi-icon bibi-icon-each"       title="Paged View">'               + Shape.SpreadsS + '</span>' })
		),
		"layout-horizontal": C.Panel.Menu["view"].appendChild(
			sML.create("li", { className: "layout-horizontal", innerHTML: '<span class="bibi-icon bibi-icon-horizontal" title="Scroll View (Horizontal)">' + Shape.SpreadsH + '</span>' })
		),
		"layout-vertical": C.Panel.Menu["view"].appendChild(
			sML.create("li", { className: "layout-vertical",   innerHTML: '<span class="bibi-icon bibi-icon-vertical"   title="Scroll View (Vertical)">'   + Shape.SpreadsV + '</span>' })
		)
	};
	sML.addTouchEventObserver(C.Panel.Menu["view"].Buttons["display-each"]).addTouchEventListener("tap", function() {
		C.Panel.toggle(function() {
			R.changeView("paged");
		});
	});
	sML.addTouchEventObserver(C.Panel.Menu["view"].Buttons["layout-horizontal"]).addTouchEventListener("tap", function() {
		C.Panel.toggle(function() {
			R.changeView("scroll", "horizontal");
		});
	});
	sML.addTouchEventObserver(C.Panel.Menu["view"].Buttons["layout-vertical"]).addTouchEventListener("tap", function() {
		C.Panel.toggle(function() {
			R.changeView("scroll", "vertical");
		});
	});

	sML.each(C.Panel.Menu.getElementsByClassName("bibi-icon"), function() {
		this.innerHTML = '<span class="non-visual">' + this.title + '</span>' + this.innerHTML;
	});

};


C.createSwitches = function() {

	if(C.Switches) C.Switches.innerHTML = "";
	else {
		C.Switches = O.Body.appendChild(
			sML.create("div", { id: "bibi-switches" }, { "transition": "opacity 0.75s linear" })
		);
	}

	var toggleState = function(State) {
		this.State = typeof State == "number" ? State : Math.abs(this.State - 1);
		var Language = B.Package.Metadata["languages"][0].split("-")[0];
		var Label = (Language && /^(ja)$/.test(Language) ? this.Labels[this.State][Language] + " / " : "") + this.Labels[this.State]["en"];
		this.title = Label;
		this.innerHTML = '<span class="non-visual">' + Label + '</span>';
		return this.State;
	}

	C.Switches.Panel = C.Switches.appendChild(
		sML.create("span", { className: "bibi-icon bibi-switch bibi-switch-panel",
			State: 0,
			Labels: [
				{ ja: 'メニューを開く',   en: 'Open Menu'  },
				{ ja: 'メニューを閉じる', en: 'Close Menu' }
			],
			toggleState: toggleState
		})
	);
	sML.addTouchEventObserver(C.Switches.Panel).addTouchEventListener("tap", function() {
		return C.Panel.toggle();
	});

	if((function() {
		if(document.body.requestFullscreen       || document.body.requestFullScreen)       return true;
		if(document.body.webkitRequestFullscreen || document.body.webkitRequestFullScreen) return true;
		if(document.body.mozRequestFullscreen    || document.body.mozRequestFullScreen)    return true;
		if(document.body.msRequestFullscreen)                                              return true;
		return false;
	})()) {
		sML.addClass(O.HTML, "fullscreen-enabled");
		if(!O.WindowEmbedded) {
			C.Switches.Fullscreen = C.Switches.appendChild(
				sML.create("span", { className: "bibi-icon bibi-switch bibi-switch-fullscreen",
					State: 0,
					Labels: [
						{ ja: 'フルスクリーンモードを開始', en: 'Enter Fullscreen' },
						{ ja: 'フルスクリーンモードを終了', en:  'Exit Fullscreen' }
					],
					toggleState: toggleState,
					enter: function() {
						sML.requestFullscreen(O.HTML);
						this.toggleState(1);
					},
					exit: function() {
						sML.exitFullscreen();
						this.toggleState(0);
					},
					toggle: function() {
						return (!sML.getFullscreenElement() ? this.enter() : this.exit());
					}
				})
			);
			sML.addTouchEventObserver(C.Switches.Fullscreen).addTouchEventListener("tap", function() {
				return this.toggle();
			});
		}
	} else {
		sML.addClass(O.HTML, "fullscreen-not-enabled");
	}

	sML.each(C.Switches.getElementsByClassName("bibi-switch"), function() { this.toggleState(0); });

};


C.createArrows = function() {

	if(C.Arrows) C.Arrows.innerHTML = "";
	else {
		C.Arrows = R.Content.appendChild(
			sML.create("div", { id: "bibi-arrows" }, { transition: "opacity 0.75s linear", opacity: 0 })
		);
	}

	C.Arrows.Back = C.Arrows.appendChild(
		sML.create("div", { title: "Back",    className: "bibi-arrow", id: "bibi-arrow-back",    DistanceToMove: -1 })
	);
	C.Arrows.Forward = C.Arrows.appendChild(
		sML.create("div", { title: "Forward", className: "bibi-arrow", id: "bibi-arrow-forward", DistanceToMove: +1 })
	);

	[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
		Arrow.addEventListener("mouseover", function() {
			if(Arrow.Timer_tap) clearTimeout(Arrow.Timer_tap);
			sML.addClass(Arrow, "shown");
		});
		Arrow.addEventListener("mouseout", function() {
			sML.removeClass(Arrow, "shown");
		});
		sML.addTouchEventObserver(Arrow).addTouchEventListener("tap", function() {
			R.move(Arrow.DistanceToMove)
			sML.addClass(Arrow, "shown");
			if(Arrow.Timer_tap) clearTimeout(Arrow.Timer_tap);
			Arrow.Timer_tap = setTimeout(function() {
				sML.removeClass(Arrow, "shown");
			}, 500);
		});
	});

};


C.listenKeys = function(E) {
	if(!R.Started) return;
	E.preventDefault();
	var Window = (parent != window && parent.Bibi) ? parent : window;
	Window.C.KeyCode = E.keyCode;
	var Dir = null; //                                                   W                          N                          E                          S
	if(S["page-progression-direction"] == "rtl") switch(E.keyCode) {  case 37: Dir = +1; break;  case 38: Dir = -1; break;  case 39: Dir = -1; break;  case 40: Dir = +1; break;  }
	else                                         switch(E.keyCode) {  case 37: Dir = -1; break;  case 38: Dir = -1; break;  case 39: Dir = +1; break;  case 40: Dir = +1; break;  }
	if(Dir) return Window.R.page(Dir);
};


C.listenMessage = function(E) {
	return false;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Setting

//----------------------------------------------------------------------------------------------------------------------------------------------


O.updateSetting = function(Setting) {

	if(typeof Setting != "object") return S;

	var PrevBDM = S.BDM, PrevSLA = S.SLA, PrevSLD = S.SLD, PrevPSF = S.PSF, PrevPPD = S.PPD;

	// Reset
	if(Setting.Reset) {
		for(var Property in S) delete S[Property];
		for(var Property in P) S[Property] = P[Property];
		S["page-progression-direction"] = B.Package.Spine["page-progression-direction"];
		if(S["page-progression-direction"] == "default") S["page-progression-direction"] = P["page-progression-direction"];
		delete Setting.Reset;
	}
	for(var Property in Setting) S[Property] = Setting[Property];
	if(!/^https?:\/\//.test(S["bookshelf"])) S["bookshelf"] = O.getPath(location.href.split("?")[0].replace(/[^\/]*$/, "") + S["bookshelf"]);

	// Page Progression Direction
	if(S["page-progression-direction"] == "rtl" && !O.VerticalTextEnabled && B.Package.Metadata["rendition:layout"] != "pre-paginated") S["page-progression-direction"] = "ltr";

	// Spread Layout Axis
	if(S["spread-layout-axis"] == "auto")     S["spread-layout-axis"] = B.Package.Spine["page-progression-direction"];
	if(S["spread-layout-axis"] == "default")  S["spread-layout-axis"] = (B.Package.Metadata["rendition:layout"] == "pre-paginated") ? S["page-progression-direction"] : "vertical";
	if(S["spread-layout-axis"] != "vertical") S["spread-layout-axis"] = "horizontal";

	// Spread Layout Direction
	if(S["spread-layout-axis"] == "vertical")   S["spread-layout-direction"] = "ttb";
	if(S["spread-layout-axis"] == "horizontal") S["spread-layout-direction"] = S["page-progression-direction"] != "rtl" ? "ltr" : "rtl";

	// Shortening
	S.BDM = S["book-display-mode"];
	S.SLA = S["spread-layout-axis"];
	S.SLD = S["spread-layout-direction"];
	S.PPD = S["page-progression-direction"];
	S.PSF = S["page-size-format"];

	// Layout Dictionary
	if(S.SLA == "vertical") {
		/**/S.SIZE = { b: "width",  B: "Width",  l: "height", L: "Height", w: "breadth", W: "Breadth", h: "length",  H: "Length" };
		/**/S.AXIS = { XY: "Y",     YX: "X",     PM: +1 };
		if(S.PPD == "ltr") {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "left",    S: "Left",    e: "right",   E: "Right",  c: "center", m: "middle" };
		} else {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "right",   S: "Right",   e: "left",    E: "Left",   c: "center", m: "middle" };
		}
	} else {
		/**/S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width",  w: "length",  W: "Length",  h: "breadth", H: "Breadth" };
		if(S.PPD == "ltr") {
			S.AXIS = { XY: "X",     YX: "Y",     PM: +1 };
			S.BASE = { b: "left",   B: "Left",   a: "right",  A: "Right",  s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
		} else {
			S.AXIS = { XY: "X",     YX: "Y",     PM: -1 };
			S.BASE = { b: "right",  B: "Right",  a: "left",   A: "Left",   s: "top",     S: "Top",     e: "bottom",  E: "Bottom", c: "middle", m: "center" };
		}
	}

	// Root Class
	if(PrevBDM != S.BDM) { sML.replaceClass(O.HTML, "display-" + PrevBDM, "display-" + S.BDM ); }
	if(PrevSLA != S.SLA) { sML.replaceClass(O.HTML, "spread-"  + PrevSLA, "spread-"  + S.SLA ); }
	if(PrevSLD != S.SLD) { sML.replaceClass(O.HTML, "spread-"  + PrevSLD, "spread-"  + S.SLD ); }
	if(PrevPSF != S.PSF) { sML.replaceClass(O.HTML, "page-"    + PrevPSF, "page-"    + S.PSF ); }
	if(PrevPPD != S.PPD) { sML.replaceClass(O.HTML, "page-"    + PrevPPD, "page-"    + S.PPD ); }

	return S;

};


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extra (Hash / Queries / CFI)

//----------------------------------------------------------------------------------------------------------------------------------------------


O.readExtra = function() {

	O.EPUBCFI = BibiEPUBCFI;

	X = O.parseHash(), X["book"] = sML.getQueries()["book"];
	if(history.replaceState) history.replaceState(null, null, location.href.replace(/[\,#]pipi\([^\)]*\)$/g, ""));

	if(!X["book"]) {
		var PathFragments = location.pathname.split("/");
		var BibiFileName = PathFragments[PathFragments.length - 1];
		if(BibiFileName != "" && BibiFileName != "index.html") X["book"] = BibiFileName.replace(/\.html$/, "");
	}

	if(!X["bibi"]) {
		X["bibi"] = {};
	} else {
		X["bibi"] = { Data: X["bibi"] };
		X["bibi"].Data.replace(" ", "").split(",").forEach(function(XBibiData) {
			var KnV = XBibiData.split(":"); if(!KnV[0]) return;
			if(!KnV[1]) {
				switch(KnV[0]) {
					case "all": case "each":                          KnV[1] = KnV[0], KnV[0] = "book-display-mode";  break;
					case "horizontal": case "vertical":               KnV[1] = KnV[0], KnV[0] = "spread-layout-axis"; break;
					case "window": case "portrait": case "landscape": KnV[1] = KnV[0], KnV[0] = "page-size-format";   break;
					default: return;
				}
			}
			switch(KnV[0]) {
				case "preset": KnV[1] = KnV[1].replace(/(\.js)?$/, ".js"); break;
				case "to":     KnV[1] = O.getBibitoTarget(KnV[1]); break;
				case "book-display-mode": case "spread-layout-axis": case "page-size-format": break;
				default: return;
			}
			X["bibi"][KnV[0]] = KnV[1];
		});
	}

	if(!X["pipi"]) {
		X["pipi"] = {};
	} else {
		X["pipi"] = { Data: X["pipi"] };
		X["pipi"].Data.replace(" ", "").split(",").forEach(function(XPipiData) {
			var KnV = XPipiData.split(":"); if(!KnV[0]) return;
			if(!KnV[1]) {
				switch(KnV[0]) {
					case "wait":      KnV[1] = true, KnV[0] = "wait";      break;
					case "autostart": KnV[1] = true, KnV[0] = "autostart"; break;
					default: return;
				}
			}
			switch(KnV[0]) {
				case "wait": case "autostart": break;
				case "poster": KnV[1] = decodeURIComponent(KnV[1].replace("_BibiKakkoClose_", ")").replace("_BibiKakkoOpen_", "(")); break;
				case "nav": KnV[1] = KnV[1] * 1; break;
				default: return;
			}
			X["pipi"][KnV[0]] = KnV[1];
		});
	}

	 X["pipi"]["wait"] = (!X["pipi"]["autostart"] && (X["pipi"]["wait"] || parent != window));

	if(X["pipi"]["poster"]) {
		sML.addClass(O.HTML, "with-poster");
		O.Body.style.backgroundImage = "url(" + X["pipi"]["poster"] + ")";
	}

	if(!X["bibi"].To && X["epubcfi"]) X["bibi"].To = O.getEPUBCFITarget(X["epubcfi"]);

};


O.parseHash = function() {
	if(!location.hash) return {};
	var Hash = location.hash.replace(/^#/, ""), CurrentPosition = 0, Fragments = {};
	var parseFragment = function() {
		var Foothold = CurrentPosition, Label = "";
		while(/[a-z_]/.test(Hash.charAt(CurrentPosition))) CurrentPosition++;
		if(Hash.charAt(CurrentPosition) == "(") Label = Hash.substr(Foothold, CurrentPosition - 1 - Foothold + 1), CurrentPosition++; else return null;
		while(Hash.charAt(CurrentPosition) != ")") CurrentPosition++;
		Fragments[Label] = Hash.substr(Foothold, CurrentPosition - Foothold + 1).replace(/^[a-z_]+\(/, "").replace(/\)$/, "");
		CurrentPosition++;
	};
	(function() {
		parseFragment();
		while(Hash.charAt(CurrentPosition) == ",") {
			CurrentPosition++;
			parseFragment();
		}
	})();
	return Fragments;
};


O.getBibitoTarget = function(BibitoString) {
	if(typeof BibitoString == "number") BibitoString = "" + BibitoString;
	if(typeof BibitoString != "string" || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(BibitoString)) return null;
	var ElementSelector = "", InE = BibitoString.split("-"), ItemIndex = parseInt(InE[0]), ElementIndex = InE[1] ? InE[1] : null;
	if(ElementIndex) ElementIndex.split(".").forEach(function(Index) { ElementSelector += ">*:nth-child(" + Index + ")"; });
	return {
		BibitoString: BibitoString,
		ItemIndex: ItemIndex - 1,
		Element: (ElementSelector ? "body" + ElementSelector : null)
	};
};


O.getEPUBCFITarget = function(CFIString) {
	var CFI = O.EPUBCFI.parse(CFIString);
	if(!CFI || CFI.Path.Steps.length < 2 || !CFI.Path.Steps[1].Index || CFI.Path.Steps[1].Index % 2 == 1) return null;
	var ItemIndex = CFI.Path.Steps[1].Index / 2 - 1, ElementSelector = null, TextNodeIndex = null, TermStep = null, IndirectPath = null;
	if(CFI.Path.Steps[2] && CFI.Path.Steps[2].Steps) {
		ElementSelector = "";
		CFI.Path.Steps[2].Steps.forEach(function(Step, i) {
			if(Step.Type == "IndirectPath") { IndirectPath = Step; return false; }
			if(Step.Type == "TermStep")     { TermStep     = Step; return false; }
			if(Step.Index % 2 == 1) {
				TextNodeIndex = Step.Index - 1;
				if(i != CFI.Path.Steps[2].Steps.length - 2) return false;
			}
			if(TextNodeIndex === null) ElementSelector = Step.ID ? "#" + Step.ID : ElementSelector + ">*:nth-child(" + (Step.Index / 2) + ")";
		});
		if(ElementSelector && /^>/.test(ElementSelector)) ElementSelector = "html" + ElementSelector;
		if(!ElementSelector) ElementSelector = null;
	}
	return {
		CFI: CFI,
		CFIString: CFIString,
		ItemIndex: ItemIndex,
		Element: ElementSelector,
		TextNodeIndex: TextNodeIndex,
		TermStep: TermStep,
		IndirectPath: IndirectPath
	};
};


//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------


O.getLogo = function(Setting) {
	var Logo = sML.UA.InternetExplorer < 9 ? [
		'<span class="bibi-type-B">B</span>',
		'<span class="bibi-type-i">i</span>',
		'<span class="bibi-type-B">B</span>',
		'<span class="bibi-type-slash">/</span>',
		'<span class="bibi-type-i">i</span>'
	].join("") : '<img alt="BiB/i" src="../../bib/i/res/images/bibi-logo.png" />';
	return [
		'<', (Setting.Linkify ? 'a' : 'span'), ' class="bibi-logo"', (Setting.Linkify ? ' href="http://bibi.epub.link/" target="_blank" title="BiB/i | Web Site"' : ''), '>',
		Logo,
		'</', (Setting.Linkify ? 'a' : 'span') , '>'
	].join("");
};


O.Log = ((!parent || parent == window) && console && console.log);


O.log = function(Lv, Message) {
	if(!O.Log || !Message || typeof Message != "string") return;
	O.showStatus(Message);
	if(O.SmartPhone) return;
	switch(Lv) {
		case 0: Message = "[ERROR] " + Message; break;
		case 1: Message = "---------------- " + Message + " ----------------"; break;
		case 2: Message = Message; break;
		case 3: Message = " - " + Message; break;
		case 4: Message = "   . " + Message; break;
	}
	console.log('BiB/i: ' + Message);
};


O.showStatus = function(Message) {
	if(C.Cartain && C.Cartain.Message) C.Cartain.Message.note(Message);
	if(O.SmartPhone) return;
	if(O.statusClearer) clearTimeout(O.statusClearer);
	window.status = 'BiB/i: ' + Message;
	O.statusClearer = setTimeout(function() { window.status = ""; }, 3210);
};


O.isBin = function(T) {
	return /\.(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(T);
};




O.getPath = function(Path) {
	for(var i = 1; i < arguments.length; i++) arguments[0] += "/" + arguments[i];
	arguments[0].replace(/^([a-zA-Z]+:\/\/[^\/]+)?\/*(.*)$/, function() { Path = [arguments[1], arguments[2]] });
	while(/([^:\/])\/{2,}/.test(Path[1])) Path[1] = Path[1].replace(/([^:\/])\/{2,}/g, "$1/");
	while(        /\/\.\//.test(Path[1])) Path[1] = Path[1].replace(        /\/\.\//g, "/");
	while(/[^\/]+\/\.\.\//.test(Path[1])) Path[1] = Path[1].replace(/[^\/]+\/\.\.\//g, "");
	                                      Path[1] = Path[1].replace(     /^(\.*\/)+/g, "");
	return Path[0] ? Path.join("/") : Path[1];
};


O.toBibiXML = function(XML) {
	return XML.replace(
		/<\?[^>]*?\?>/g, ""
	).replace(
		/<(\/?)([\w\d]+):/g, "<$1$2_"
	).replace(
		/<(\/?)(opf_)?([^!\?\/ >]+)/g, "<$1bibi_$3"
	).replace(
		/<([\w\d_]+) ([^>]+?)\/>/g, "<$1 $2></$1>"
	);
};


O.ContentTypeList = {
	"image/gif"             :   /\.gif$/i,
	"image/png"             :   /\.png$/i,
	"image/jpeg"            : /\.jpe?g$/i,
	"image/svg+xml"         :   /\.svg$/i,
	"font/truetype"         :   /\.ttf$/i,
	"font/opentype"         :   /\.otf$/i,
	"font/woff"             :  /\.woff$/i,
	"text/css"              :   /\.css$/i,
	"text/javascript"       :    /\.js$/i,
	"text/html"             : /\.html?$/i,
	"application/xhtml+xml" : /\.xhtml$/i,
	"application/xml"       :   /\.xml$/i,
	"application/pdf"       :   /\.pdf$/i
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ready?

//----------------------------------------------------------------------------------------------------------------------------------------------




sML.ready(O.welcome);
