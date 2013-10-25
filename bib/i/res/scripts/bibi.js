




I = BiB.i.Info = {

	Name        : "BiB/i",
	Description : "EPUB Reader on Your Site.",
	Copyright   : "(c) 2013 Satoru MATSUSHIMA",
	Licence     : "Licensed Under the MIT License. - http://www.opensource.org/licenses/mit-license.php",
	Date        : "Fri October 25 19:00:00 2013 +0900",

	Version     : 0.9931, // beta
	Build       : 20131025.0,

	WebSite     : "http://sarasa.la/bib/i/"

}





A = BiB.i.Archive  = {};

B = BiB.i.Book     = {};

C = BiB.i.Controls = {};

H = BiB.i.Hash     = {};

L = BiB.i.Loader   = {};

N = BiB.i.Notifier = {};

O = BiB.i.Operator = {};

P = BiB.i.Preset   = {};

Q = BiB.i.Queries  = {};

R = BiB.i.Reader   = {};

S = BiB.i.Setting  = {};

X = BiB.i.Extra    = {};





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------



O.welcome = function() {

	O.log(1, 'Welcome !');

	O.HTML = document.getElementsByTagName("html")[0];
	O.Head = document.getElementsByTagName("head")[0];
	O.Body = document.getElementsByTagName("body")[0];

	if(sML.OS.iOS || sML.OS.Android) {
		O.SmartPhone = true;
		O.setOrientation = function() {
			window.scrollBy(1, 1);
			sML.removeClass(O.HTML, "orientation-" + (window.orientation == 0 ? "landscape" : "portrait" ));
			sML.addClass(   O.HTML, "orientation-" + (window.orientation == 0 ? "portrait"  : "landscape"));
			O.HTML.style.minHeight = window.innerHeight + "px";
		}
		window.addEventListener("orientationchange", O.setOrientation);
		O.setOrientation();
		setTimeout(O.setOrientation, 1);
		setTimeout(O.setOrientation, 100);
		setTimeout(O.setOrientation, 800);
	}

	if(sML.OS.iOS) {
		O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-capable",          content: "yes"   }));
		O.Head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }));
	}

	var HTMLClassNames = [];
	for(var OS in sML.OS) if(sML.OS[OS]                                  ) HTMLClassNames.push(OS);
	for(var UA in sML.UA) if(sML.UA[UA] && UA.length > 2 && UA != "Flash") HTMLClassNames.push(UA);
	O.HTML.className = HTMLClassNames.join(" ");

	R.Contents = O.Body.appendChild(sML.create("div", { id: "epub-contents" }));

	N.arise();
	C.arise();

	O.initialize();

	L.getBook(Q["book"]);

}



O.initialize = function() {

	O.log(2, 'Initializing BiB/i...');

	L.FileDigit = 3;

	R.Contents.innerHTML = "", R.Contents.style.opacity = 0;

	B = {
		container: { Path: "META-INF/container.xml" },
		package: {}
	}

	O.readExtra();

	var PresetFileName = (typeof X.Preset == "string" && X.Preset && !/\//.test(X.Preset)) ? X.Preset.replace(/(\.js)?$/, ".js") : "default.js";
	var applyPreset = function() {
		if(O.SmartPhone) {
			P["spread-gap"]          = P["spread-gap_narrow-device"];
			P["spread-margin-start"] = P["spread-margin-start_narrow-device"];
			P["spread-margin-end"]   = P["spread-margin-end_narrow-device"];
			P["item-padding-left"]   = P["item-padding-left_narrow-device"];
			P["item-padding-right"]  = P["item-padding-right_narrow-device"];
			P["item-padding-top"]    = P["item-padding-top_narrow-device"];
			P["item-padding-bottom"] = P["item-padding-bottom_narrow-device"];
		}
		sML.each(["spread-gap", "spread-margin-start", "spread-margin-end", "item-padding-left", "item-padding-right",  "item-padding-top",  "item-padding-bottom"], function() {
			P[this] = (typeof P[this] != "number" || P[this] < 0) ? 0 : Math.round(P[this]);
		});
		if(P["spread-gap"] % 2) P["spread-gap"]++;
		if(X.BDM && /^(all|each)$/.test(                 X.BDM)) P["book-display-mode" ] = X.BDM;
		if(X.SLA && /^(horizontal|vertical)$/.test(      X.SLA)) P["spread-layout-axis"] = X.SLA;
		if(X.PSF && /^(portrait|landscape|window)$/.test(X.PSF)) P["page-size-format"  ] = X.PSF;
		if(sML.UA.InternetExplorer < 11 || sML.UA.Gecko || sML.UA.Opera < 15) P["book-display-mode"] = "all", P["spread-layout-axis"] = "vertical", P["page-size-format"] = "window";
	}
	if(!P.FileName && PresetFileName == "default.js") {
		applyPreset();
		P.FileName = "default.js";
	} else if(P.FileName != PresetFileName) {
		P.loaded = false;
		if(document.getElementById("bibi-preset")) sML.removeElement(document.getElementById("bibi-preset"));
		sML.insertAfter(sML.create("script", { id: "bibi-preset", onload: applyPreset }), document.getElementById("bibi-script")).src = "../presets/" + PresetFileName;
		P.FileName = PresetFileName;
	}
	O.log(3, 'preset: "' + PresetFileName + '"');

	O.log(2, 'Initialized.');

}



O.update = function(Setting) {

	if(!Setting || typeof Setting != "object") return S;

	var PrevBDM = S.BDM, PrevSLA = S.SLA, PrevSLD = S.SLD, PrevPSF = S.PSF, PrevPPD = S.PPD;

	// Reset
	if(Setting.Reset) {
		for(var Property in S) delete S[Property];
		for(var Property in P) S[Property] = P[Property];
		S["page-progression-direction"] = B.package.spine["page-progression-direction"];
		if(S["page-progression-direction"] == "default") S["page-progression-direction"] = P["page-progression-direction"];
		delete Setting.Reset;
	}
	for(var Property in Setting) S[Property] = Setting[Property];

	// Spread Layout Axis
	if(S["spread-layout-axis"] == "auto")       S["spread-layout-axis"]      = B.package.spine["page-progression-direction"];
	if(S["spread-layout-axis"] == "default")    S["spread-layout-axis"]      = (B.package.metadata["rendition:layout"] == "pre-paginated") ? S["page-progression-direction"] : "vertical";
	if(S["spread-layout-axis"] != "vertical")   S["spread-layout-axis"]      = "horizontal";

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
		/**/S.SIZE = { b: "width",  B: "Width",  l: "height", L: "Height" };
		/**/S.AXIS = { XY: "Y",     YX: "X",     PM: +1 };
		if(S.PPD == "ltr") {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "left", S: "Left", e: "right",  E: "Right",  c: "center", m: "middle" };
		} else {
			S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "right", S: "Right", e: "left",  E: "Left",  c: "center", m: "middle" };
		}
	} else {
		/**/S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width"  };
		if(S.PPD == "ltr") {
			S.AXIS = { XY: "X",     YX: "Y",     PM: +1 };
			S.BASE = { b: "left",   B: "Left",   a: "right",  A: "Right",  s: "top",  S: "Top",  e: "bottom", E: "Bottom", c: "middle", m: "center" };
		} else {
			S.AXIS = { XY: "X",     YX: "Y",     PM: -1 };
			S.BASE = { b: "right",  B: "Right",  a: "left",   A: "Left",   s: "top",  S: "Top",  e: "bottom", E: "Bottom", c: "middle", m: "center" };
		}
	}

	// Root Class
	sML.each([O.HTML, C.Navigation.Item.HTML], function() {
		if(PrevBDM != S.BDM) { sML.replaceClass(this, "display-" + PrevBDM, "display-" + S.BDM ); }
		if(PrevSLA != S.SLA) { sML.replaceClass(this, "spread-"  + PrevSLA, "spread-"  + S.SLA ); }
		if(PrevSLD != S.SLD) { sML.replaceClass(this, "spread-"  + PrevSLD, "spread-"  + S.SLD ); }
		if(PrevPSF != S.PSF) { sML.replaceClass(this, "page-"    + PrevPSF, "page-"    + S.PSF ); }
		if(PrevPPD != S.PPD) { sML.replaceClass(this, "page-"    + PrevPPD, "page-"    + S.PPD ); }
	});

	return S;

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loading

//----------------------------------------------------------------------------------------------------------------------------------------------



L.getBook = function(BookFileName) {

	if(typeof BookFileName != "string" || !BookFileName || /\//.test(BookFileName)) {
		// File Open or Stop
		if(window.File) {
			N.Drop = N.Panel.appendChild(sML.create("p", { id: "bibi-drop", innerHTML: '<span><img class="bibi-icon-image" alt="Drop Me an EPUB!" src="./res/images/icons.png" /></span>' }));
			N.note('Drop an EPUB into this window.');
			// Drag & Drop
			N.Panel.addEventListener("dragenter", function(e) { e.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
			N.Panel.addEventListener("dragover",  function(e) { e.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
			N.Panel.addEventListener("dragleave", function(e) { e.preventDefault(); O.Body.style.opacity = 1.0; }, 1);
			N.Panel.addEventListener("drop",      function(e) { e.preventDefault(); O.Body.style.opacity = 1.0;
				var BookFile = e.dataTransfer.files[0];
				if(!BookFile.size || !/\.epub$/i.test(BookFile.name)/* || BookFile.type != "application/epub+zip"*/) {
					N.note('Give me <span style="color:rgb(128,128,128);">EPUB</span>. Drop into this window.');
				} else {
					sML.addClass(N.Panel, "animate");
					N.note('Loading ...');
					O.log(2, 'Fetching EPUB...');
					O.log(3, '"' + BookFile.name + '"');
					sML.edit(new FileReader(), {
						onerror : function(e) { O.Body.style.opacity = 1.0; N.note('Error. Something trouble...'); },
						onload  : function(e) {
							O.log(2, 'Fetched.');
							L.preprocessEPUB(this.result);
							B.Name = BookFile.name.replace(/\.epub$/i, ""), B.Format = "EPUB", B.Zipped = true;
							L.readContainer();
						}
					}).readAsArrayBuffer(BookFile);
				}
			}, 1);
		} else {
			N.note('Tell me EPUB name via URL in address-bar.');
		}
	} else if(/\.epub$/i.test(BookFileName)) {
		// EPUB XHR
		var fetchEPUB = function() {
			sML.addClass(N.Panel, "animate");
			N.note('Loading ...');
			O.log(2, 'Fetching EPUB...');
			O.log(3, '"' + BookFileName + '"');
			sML.ajax("../bookshelf/" + BookFileName, {
				mimetype: "text/plain;charset=x-user-defined",
				onsuccess: function(FileContent) {
					O.log(2, 'Fetched.');
					L.preprocessEPUB(FileContent);
					B.Name = BookFileName.replace(/\.epub$/i, ""), B.Format = "EPUB", B.Zipped = true;
					L.readContainer();
				},
				onfailed: function() {
					O.log(2, 'Failed to Load EPUB.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or Drop an EPUB into this window.');
				}
			});
		}
		if(!X.Wait) fetchEPUB();
		else {
			N.Panel.appendChild(
				sML.create("p", { id: "bibi-play", innerHTML: '<span><img class="bibi-icon-image" alt="Touch Me to Read!" src="./res/images/icons.png" /></span>',
					onclick: function() {
						if(O.SmartPhone) return window.open(location.href.replace(/&wait=[^&]+/g, ""));
						fetchEPUB();
						delete X.Wait;
						this.onclick = "";
						sML.style(this, { opacity: 0, cursor: "default" });
					}
				})
			);
			N.note('<a href="' + location.href.replace(/&wait=[^&]+/g, "") + '" target="_blank">open in new window.</a>');
		}
	} else {
		// EPUB Folder
		sML.addClass(N.Panel, "animate");
		N.note('Loading ...');
		B.Name = BookFileName, B.Format = "EPUB";
		L.readContainer();
	}

}



L.preprocessEPUB = function(EPUBZip) {

	O.log(2, 'Preprocessing EPUB...');

	A = {
		Files: {},
		FileCount: { All:0, HTML:0, CSS:0, SVG:0, Bitmap:0, Font:0, Audio:0, Video:0 },
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
			A.Files[FileName] = O.isBin(FileName) ? EPUBZip.file(FileName).asBinary() : Base64.btou(EPUBZip.file(FileName).asText());
		}
	}

	L.FileDigit = (A.FileCount.All + "").length;

	if(A.FileCount.All)    O.log(3, sML.String.padZero(A.FileCount.All,    L.FileDigit) + ' Files');
	if(A.FileCount.HTML)   O.log(4, sML.String.padZero(A.FileCount.HTML,   L.FileDigit) + ' HTML');
	if(A.FileCount.CSS)    O.log(4, sML.String.padZero(A.FileCount.CSS,    L.FileDigit) + ' CSS');
	if(A.FileCount.SVG)    O.log(4, sML.String.padZero(A.FileCount.SVG,    L.FileDigit) + ' SVG');
	if(A.FileCount.Bitmap) O.log(4, sML.String.padZero(A.FileCount.Bitmap, L.FileDigit) + ' Bitmap');
	if(A.FileCount.Font)   O.log(4, sML.String.padZero(A.FileCount.Font,   L.FileDigit) + ' Font');
	if(A.FileCount.Audio)  O.log(4, sML.String.padZero(A.FileCount.Audio,  L.FileDigit) + ' Audio');
	if(A.FileCount.Video)  O.log(4, sML.String.padZero(A.FileCount.Video,  L.FileDigit) + ' Video');

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
					if(ExtRE.test(ResFile) && A.Files[ResFile]) Source = Source.replace(this, this.replace(ResPathInSource, A.getDataURI(ResFile) + (ResHash ? "#" + ResHash : "")));
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
	if(Preprocessed.CSS) O.log(3, sML.String.padZero(Preprocessed.CSS, L.FileDigit) + ' CSS');

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
	if(Preprocessed.SVG) O.log(3, sML.String.padZero(Preprocessed.SVG, L.FileDigit) + ' SVG');

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
	if(Preprocessed.HTML) O.log(3, sML.String.padZero(Preprocessed.HTML, L.FileDigit) + ' HTML');

	O.log(2, 'Preprocessed.');

}



L.readContainer = function(FileContent) {

	if(B.Zipped) {
		var FileContent = A.Files[B.container.Path];
	} else {
		if(!FileContent) {
			return sML.ajax("../bookshelf/" + B.Name + "/" + B.container.Path, {
				onsuccess: function(FileContent) { L.readContainer(FileContent); },
				onfailed: function() {
					O.log(2, 'Failed to Load Container XML.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or drop an EPUB into this window.');
				}
			});
		}
	}

	O.log(2, 'Reading Container XML...');

	O.log(3, B.container.Path);

	var TempContainer = O.Body.appendChild(sML.create("div"));

	TempContainer.innerHTML = O.toBiBiXML(FileContent);
	B.package.Path = TempContainer.getElementsByTagName("bibi:rootfile")[0].getAttribute("full-path");
	B.package.Dir  = B.package.Path.replace(/\/?[^\/]+$/, "");

	sML.deleteElement(TempContainer);

	O.log(2, 'Read.');

	L.readPackageDocument();

}



L.readPackageDocument = function(FileContent) {

	if(B.Zipped) {
		var FileContent = A.Files[B.package.Path];
	} else {
		if(!FileContent) {
			return sML.ajax("../bookshelf/" + B.Name + "/" + B.package.Path, {
				onsuccess: function(FileContent) { L.readPackageDocument(FileContent); },
				onfailed: function() {
					O.log(2, 'Failed to Load Package Document.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or drop an EPUB into this window.');
				}
			});
		}
	}

	O.log(2, 'Reading Package Document...');

	O.log(3, B.package.Path);

	var TempPackage = O.Body.appendChild(sML.create("div"));

	// Package
	TempPackage.innerHTML = O.toBiBiXML(FileContent);
	var Metadata = TempPackage.getElementsByTagName("bibi:metadata")[0];
	var Manifest = TempPackage.getElementsByTagName("bibi:manifest")[0];
	var Spine    = TempPackage.getElementsByTagName("bibi:spine")[0];
	var ManifestItems = Manifest.getElementsByTagName("bibi:item");
	var SpineItemrefs = Spine.getElementsByTagName("bibi:itemref");
	if(ManifestItems.length <= 0) return O.log(0, '"' + B.package.Path + '" has no <item> in <manifest>.');
	if(SpineItemrefs.length <= 0) return O.log(0, '"' + B.package.Path + '" has no <itemref> in <spine>.');
	B.package.metadata = { title: "", creator: "", publisher: "", titles: [], creators: [], publishers: [] };
	B.package.manifest = { items: {}, "cover-image": {}, "navigation": {}, "toc-ncx": {} };
	B.package.spine    = { itemrefs: [] };

	// METADATA
	sML.each(Metadata.getElementsByTagName("bibi:meta"), function() {
		if(this.getAttribute("refines")) return;
		if(this.getAttribute("property")) {
			var Property = this.getAttribute("property").replace(/^dcterms:/, "");
			if(/^(title|creator|publisher)$/.test(Property)) B.package.metadata[Property + "s"].push(this.innerHTML);
			else if(!B.package.metadata[Property]) B.package.metadata[Property] = this.innerHTML;
		}
		if(this.getAttribute("name") && this.getAttribute("content")) {
			B.package.metadata[this.getAttribute("name")] = this.getAttribute("content");
		}
	});
	if(!B.package.metadata["titles"    ].length) sML.each(TempPackage.getElementsByTagName("bibi:dc:title"),     function() { B.package.metadata["titles"    ].push(this.innerHTML); return false; });
	if(!B.package.metadata["creators"  ].length) sML.each(TempPackage.getElementsByTagName("bibi:dc:creator"),   function() { B.package.metadata["creators"  ].push(this.innerHTML); });
	if(!B.package.metadata["publishers"].length) sML.each(TempPackage.getElementsByTagName("bibi:dc:publisher"), function() { B.package.metadata["publishers"].push(this.innerHTML); });
	B.package.metadata.title     = B.package.metadata.titles.join(    ", ");
	B.package.metadata.creator   = B.package.metadata.creators.join(  ", ");
	B.package.metadata.publisher = B.package.metadata.publishers.join(", ");
	if(!B.package.metadata["rendition:layout"])      B.package.metadata["rendition:layout"]      = "reflowable";
	if(!B.package.metadata["rendition:orientation"]) B.package.metadata["rendition:orientation"] = "auto";
	if(!B.package.metadata["rendition:spread"])      B.package.metadata["rendition:spread"]      = "auto";
	if(!B.package.metadata["cover"])                 B.package.metadata["cover"]                 = "";

	// MANIFEST
	var TOCID = Spine.getAttribute("toc");
	sML.each(ManifestItems, function() {
		var Item = {
			"id"         : this.getAttribute("id")         || "",
			"href"       : this.getAttribute("href")       || "",
			"media-type" : this.getAttribute("media-type") || "",
			"properties" : this.getAttribute("properties") || "",
			"fallback"   : this.getAttribute("fallback")   || ""
		};
		if(Item.id && Item.href) {
			B.package.manifest.items[Item.id] = Item;
			(function(ItemProperties) {
				if(/ cover-image /.test(ItemProperties)) B.package.manifest["cover-image"].Path = O.getPath(B.package.Dir, Item.href);
				if(        / nav /.test(ItemProperties)) B.package.manifest["navigation" ].Path = O.getPath(B.package.Dir, Item.href);
			})(" " + Item.properties + " ");
			if(TOCID && Item.id == TOCID) B.package.manifest["toc-ncx"].Path = O.getPath(B.package.Dir, Item.href);
		}
	});
	if(B.package.manifest["cover-image"].Path) {
		sML.create("img", {
			onload: function() {
				sML.style(N.Cover, {
					backgroundImage: "url(" + this.src + ")",
					opacity: 1
				});
			}
		}).src = (function() {
			if(!B.Zipped) return "../bookshelf/" + B.Name + "/" + B.package.manifest["cover-image"].Path + "?cover-image";
			else          return A.getDataURI(B.package.manifest["cover-image"].Path);
		})();
	}

	// SPINE
	B.package.spine["page-progression-direction"] = Spine.getAttribute("page-progression-direction");
	if(!B.package.spine["page-progression-direction"] || !/^(ltr|rtl)$/.test(B.package.spine["page-progression-direction"])) B.package.spine["page-progression-direction"] = "default";
	var PropertyREs = [
		/(rendition:layout)-(.+)/,
		/(rendition:orientation)-(.+)/,
		/(rendition:spread)-(.+)/,
		/(rendition:page-spread)-(.+)/,
		/(page-spread)-(.+)/
	];
	sML.each(SpineItemrefs, function(i) {
		var Ref = {
			"idref"                 : this.getAttribute("idref")      || "",
			"linear"                : this.getAttribute("linear")     || "",
			"properties"            : this.getAttribute("properties") || "",
			"page-spread"           : "",
			"rendition:layout"      : B.package.metadata["rendition:layout"],
			"rendition:orientation" : B.package.metadata["rendition:orientation"],
			"rendition:spread"      : B.package.metadata["rendition:spread"]
		};
		Ref.properties = Ref.properties.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ").split(" ");
		sML.each(PropertyREs, function() {
			var RE = this;
			sML.each(Ref.properties, function() {
				if(RE.test(this)) {
					Ref[this.replace(RE, "$1")] = this.replace(RE, "$2").replace("rendition:", "");
					return false;
				}
			});
		});
		if(Ref["rendition:page-spread"]) Ref["page-spread"] = Ref["rendition:page-spread"];
		Ref["rendition:page-spread"] = Ref["page-spread"];
		Ref.viewport = { content: null, width: null, height: null };
		Ref.viewBox  = { content: null, width: null, height: null };
		B.package.spine.itemrefs.push(Ref);
	});

	var TitleFragments = [];
	if(B.package.metadata.title)     { TitleFragments.push(B.package.metadata.title);     O.log(3, "title: "     + B.package.metadata.title);     }
	if(B.package.metadata.creator)   { TitleFragments.push(B.package.metadata.creator);   O.log(3, "creator: "   + B.package.metadata.creator);   }
	if(B.package.metadata.publisher) { TitleFragments.push(B.package.metadata.publisher); O.log(3, "publisher: " + B.package.metadata.publisher); }
	if(TitleFragments.length) document.title = "BiB/i | " + TitleFragments.join(" - ");

	sML.deleteElement(TempPackage);

	O.log(2, 'Read.');

	O.update({ Reset: true });

	if(!X.Wait) L.loadNavigation();
	else {
		sML.removeClass(N.Panel, "animate");
		N.Panel.appendChild(
			sML.create("p", { id: "bibi-play", innerHTML: '<span><img class="bibi-icon-image" alt="Touch Me to Read!" src="./res/images/icons.png" /></span>',
				onclick: function() {
					if(O.SmartPhone) return window.open(location.href);
					this.onclick = "";
					sML.addClass(N.Panel, "animate");
					N.note('Loading ...');
					sML.style(this, { opacity: 0, cursor: "default" });
					L.loadNavigation();
				}
			})
		);
		N.note('<a href="' + location.href.replace(/&wait=[^&]+/g, "") + '" target="_blank">open in new window.</a>');
	}

}



L.loadNavigation = function(FileContent) {

	if(!R.Navigation) {
		if(B.package.manifest["navigation"].Path) {
			R.Navigation = { Path: B.package.manifest["navigation"].Path, Type: "NavigationDocument" };
		} else {
			O.log(2, 'No Navigation Document.');
			if(B.package.manifest["toc-ncx"].Path) {
				R.Navigation = { Path: B.package.manifest["toc-ncx"].Path, Type: "TOC-NCX" };
			} else {
				O.log(2, 'No TOC-NCX.');
				return L.loadSpineItems();
			}
		}
		if(B.Zipped) {
			var FileContent = A.Files[R.Navigation.Path];
		} else {
			if(!FileContent) {
				return sML.ajax("../bookshelf/" + B.Name + "/" + R.Navigation.Path, {
					onsuccess: function(FileContent) { L.loadNavigation(FileContent); },
					onfailed: function() {
						O.log(2, 'Failed to Load Navigation.');
						sML.removeClass(N.Panel, "animate");
					}
				});
			}
		}
	}

	O.log(2, 'Loading Navigation...');

	O.log(3, '"' + R.Navigation.Path + '"');

	if(R.Navigation.Type == "NavigationDocument") {
		var TempDivs = { A: sML.create("div", { innerHTML: FileContent.replace(/^.+<body( [^>]+)?>/, '').replace(/<\/body>.+$/, '') }), B: document.createElement("div") };
		sML.each(TempDivs.A.querySelectorAll("nav"), function() { sML.each(this.getElementsByTagName("*"), function() { this.removeAttribute("style"); }); TempDivs.B.appendChild(this); });
		C.Navigation.Item.innerHTML = TempDivs.B.innerHTML;
		sML.deleteElement(TempDivs.A); sML.deleteElement(TempDivs.B); delete TempDivs;
	} else {
		var TempTOCNCX = O.Body.appendChild(sML.create("div"));
		TempTOCNCX.innerHTML = O.toBiBiXML(FileContent).replace(/[\r\n]/g, "").replace(/[\t\s]*</g, "<").replace(/>[\t\s]*/g, ">").replace(/^.+<bibi:navMap( [^>]+)?>/, "").replace(/<\/bibi:navMap>.+$/, "");
		sML.each(TempTOCNCX.getElementsByTagName("bibi:navPoint"), function() {
			sML.insertBefore(
				sML.create("a", { href: this.getElementsByTagName("bibi:content")[0].getAttribute("src"), innerHTML: this.getElementsByTagName("bibi:text")[0].innerHTML }),
				this.getElementsByTagName("bibi:navLabel")[0]
			);
			sML.removeElement(this.getElementsByTagName("bibi:navLabel")[0]);
			sML.removeElement(this.getElementsByTagName("bibi:content")[0]);
			var LI = sML.create("li");
			LI.setAttribute("id", this.getAttribute("id"));
			LI.setAttribute("playorder", this.getAttribute("playorder"));
			sML.insertBefore(LI, this).appendChild(this);
			if(!LI.previousSibling || /^a$/i.test(LI.previousSibling.tagName)) {
				sML.insertBefore(sML.create("ul"), LI).appendChild(LI);
			} else {
				LI.previousSibling.appendChild(LI);
			}
		});
		C.Navigation.Item.innerHTML = '<nav>' + TempTOCNCX.innerHTML.replace(/<bibi:navPoint( [^>]+)?>/ig, "").replace(/<\/bibi:navPoint>/ig, "") + '</nav>';
		sML.deleteElement(TempTOCNCX);
	}

	O.log(2, 'Loaded.');

	L.loadSpineItems();

}



L.loadSpineItems = function() {

	O.log(2, 'Loading Spine Items...');

	R.Contents.innerHTML = "";

	R.Spreads = [], R.Boxes = [], R.Items = [], R.Pages = [], L.LoadedItems = 0;

	var writeItemHTML = function(Item, HTML, Head, Body) {
		Item.contentDocument.open();
		Item.contentDocument.write(HTML ? HTML : [
			'<html>',
				'<head>' + Head + '</head>',
				'<body onload="parent.L.postprocessItem(parent.R.Items[' + Item.ItemIndex + ']); document.body.removeAttribute(\'onload\'); return false;">' + Body + '</body>',
			'</html>'
		].join(""));
		Item.contentDocument.close();
	}

	// For Paring of Pre-Pagenated
	if(S.PPD == "rtl") var PairBefore = "right", PairAfter = "left";
	else               var PairBefore = "left",  PairAfter = "right";

	// Spreads, Boxes, and Items
	sML.each(B.package.spine.itemrefs, function(i) {
		var Ref  = this;
		var Path = O.getPath(B.package.Dir, B.package.manifest.items[Ref.idref].href);
		O.log(3, sML.String.padZero(i + 1, L.FileDigit) + '/' + sML.String.padZero(B.package.spine.itemrefs.length, L.FileDigit) + ' ' + (Path ? '"' + Path + '"' : '... Not Found.'));
		var Item = sML.create("iframe", { className: "item", id: "item-" + sML.String.padZero(i + 1, L.FileDigit),
			Dir: Path.replace(/\/?[^\/]+$/, ""),
			Path: Path,
			Ref: Ref,
			ItemIndex: i,
			ItemNumber: i + 1,
			Spread: null,
			Box: null,
			Pair: null,
			IsPrePaginated: (Ref["rendition:layout"] == "pre-paginated"),
			Postprocessed: { Linkage:0, Viewport:0 },
			Loaded: false
		});
		Item.name = Item.id;
		Item.setAttribute("scrolling", "no");
		// Spread
		if(Ref["rendition:layout"] == "pre-paginated" && i) {
			var PrevItem = R.Items[i - 1];
			if(PrevItem.Ref["rendition:layout"] == "pre-paginated") {
				if(Ref["page-spread"] == PairAfter || Ref["page-spread"] == "") {
					if(PrevItem.Ref["page-spread"] == "" || PrevItem.Ref["page-spread"] == PairBefore) {
						Item.Pair = PrevItem, PrevItem.Pair = Item, Ref["page-spread"] = PairAfter, PrevItem.Ref["page-spread"] = PairBefore;
					}
				} else if(Ref["page-spread"] == PairBefore || Ref["page-spread"] == "center") {
					if(PrevItem.Ref["page-spread"] == "") {
						PrevItem.Ref["page-spread"] = "center";
					}
				}
			}
			if(!Ref["page-spread"] && i == B.package.spine.itemrefs.length - 1) Ref["page-spread"] = "center";
		}
		Item.Spread = Item.Pair ? Item.Pair.Spread : R.Contents.appendChild(sML.create("div", { className: "spread", Items: [] }));
		Item.ItemIndexInSpread = Item.Spread.Items.length;
		Item.Spread.Items.push(Item);
		if(!Item.Pair) R.Spreads.push(Item.Spread);
		// Box
		Item.Box = Item.Spread.appendChild(sML.create("div", { className: "item-box" }));
		Item.Box.Spread = Item.Spread;
		Item.Box.Item = Item;
		R.Boxes.push(Item.Box);
		// Item
		if(Ref["page-spread"]) {
			sML.addClass(Item.Box,    "page-spread-" + Ref["page-spread"]);
			sML.addClass(Item,        "page-spread-" + Ref["page-spread"]);
		}
		if(Ref["rendition:layout"] == "pre-paginated") {
			sML.addClass(Item.Spread, "pre-paginated");
			sML.addClass(Item.Box,    "pre-paginated");
			sML.addClass(Item,        "pre-paginated");
		}
		Item.Spread.appendChild(Item.Box).appendChild(Item);
		R.Items.push(Item);
		// Item Content
		if(/\.(gif|jpe?g|png)$/i.test(Path)) { // If Bitmap-in-Spine
			writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Zipped ? A.getDataURI(Path) : "../bookshelf/" + B.Name + "/" + Path) + '" />');
		} else if(/\.(svg)$/i.test(Path)) { // If SVG-in-Spine
			if(B.Zipped) {
				writeItemHTML(Item, false, '', A.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
			} else {
				sML.ajax("../bookshelf/" + B.Name + "/" + Path, {
					onsuccess: function(FileContent) {
						writeItemHTML(Item, false, '<base href="../bookshelf/' + B.Name + '/' + Path + '" />', FileContent.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
					},
					onfailed: function() {}
				});
			}
		} else { // If HTML or Others
			if(B.Zipped) {
				writeItemHTML(Item, A.Files[Path]);
				setTimeout(L.postprocessItem, 10, Item);
			} else {
				Item.onload = function() { L.postprocessItem(Item); };
				Item.src = "../bookshelf/" + B.Name + "/" + Path;
			}
		}
	});

	// Done?
	L.CountDown = 25; (function() {
		if(L.CountDown <= 0) {
			O.log(0, 'Failed to Load All Items at Once. Please Reload.');
		} else if(L.LoadedItems < B.package.spine.itemrefs.length) {
			L.CountDown--;
			return setTimeout(arguments.callee, 400);
		} else {
			delete L.CountDown;
			delete L.LoadedItems;
			O.log(2, 'Loaded.');
			R.start();
		}
	})();

}



L.postprocessItem = function(Item) {

	var Box = Item.Box, Ref = Item.Ref;

	Item.HTML = sML.edit(Item.contentDocument.getElementsByTagName("html")[0], { Item: Item });
	Item.Head = sML.edit(Item.contentDocument.getElementsByTagName("head")[0], { Item: Item });
	Item.Body = sML.edit(Item.contentDocument.getElementsByTagName("body")[0], { Item: Item });

	sML.each(Item.Body.querySelectorAll("link"), function() { Item.Head.appendChild(this); });

	// Margin & Padding & Background
	sML.each([Item.HTML, Item.Body], function() {
		this.BiBi = {
			DefaultStyle: {
				margin:  (this.style.margin  ? this.style.margin  : ""),
				padding: (this.style.padding ? this.style.padding : "")
			}
		}
	});
	if(!sML.UA.Gecko) sML.CSS.add({
		"html" : "-webkit-text-size-adjust: none;",
		"::selection" : "background: rgba(255,192,0,0.5);"
	}, Item.contentDocument);

	// Single SVG / IMG Item
	var ItemBodyChildren = Item.contentDocument.querySelectorAll("body>*");
	if(ItemBodyChildren.length == 1) {
			 if(/^svg$/i.test(ItemBodyChildren[0].tagName)) Item.SingleSVG = true;
		else if(/^img$/i.test(ItemBodyChildren[0].tagName)) Item.SingleIMG = true;
	}
	sML.each(Item.Body.querySelectorAll("img"), function() {
		this.BiBi = {
			DefaultStyle: {
				margin:    (this.style.margin    ? this.style.margin    : ""),
				width:     (this.style.width     ? this.style.width     : ""),
				height:    (this.style.height    ? this.style.height    : ""),
				maxWidth:  (this.style.maxWidth  ? this.style.maxWidth  : ""),
				maxHeight: (this.style.maxHeight ? this.style.maxHeight : "")
			}
		}
	});

	// Viewport
	sML.each(Item.Head.getElementsByTagName("meta"), function() { // META viewport
		if(this.name == "viewport") {
			Ref.viewport.content = this.getAttribute("content");
			if(Ref.viewport.content) {
				var viewportWidth  = Ref.viewport.content.replace( /^.*?width=([^\, ]+).*$/, "$1") * 1;
				var viewportHeight = Ref.viewport.content.replace(/^.*?height=([^\, ]+).*$/, "$1") * 1;
				if(!isNaN(viewportWidth) && !isNaN(viewportHeight)) {
					Ref.viewport.width  = viewportWidth;
					Ref.viewport.height = viewportHeight;
					Item.Postprocessed.Viewport;
				}
			}
		}
	});
	if(Ref["rendition:layout"] == "pre-paginated" && !(Ref.viewport.width * Ref.viewport.height)) { // If Fixed-Layout Item without viewport
		if(Item.SingleSVG) { // If Single-SVG-HTML or SVG-in-Spine, Use SVG "viewBox" for viewport.
			if(ItemBodyChildren[0].getAttribute("viewBox")) {
				Ref.viewBox.content = ItemBodyChildren[0].getAttribute("viewBox");
				var viewBoxCoords  = Ref.viewBox.content.split(" ");
				if(viewBoxCoords.length == 4) {
					var viewBoxWidth  = viewBoxCoords[2] * 1 - viewBoxCoords[0] * 1;
					var viewBoxHeight = viewBoxCoords[3] * 1 - viewBoxCoords[1] * 1;
					if(viewBoxWidth && viewBoxHeight) {
						if(ItemBodyChildren[0].getAttribute("width")  != "100%") ItemBodyChildren[0].setAttribute("width",  "100%");
						if(ItemBodyChildren[0].getAttribute("height") != "100%") ItemBodyChildren[0].setAttribute("height", "100%");
						Ref.viewport.width  = Ref.viewBox.width  = viewBoxWidth;
						Ref.viewport.height = Ref.viewBox.height = viewBoxHeight;
						Item.Postprocessed.Viewport++;
					}
				}
			}
		} else if(Item.SingleIMG) { // If Single-IMG-HTML or Bitmap-in-Spine, Use IMG "width" / "height" for viewport.
			Ref.viewport.width  = parseInt(getComputedStyle(ItemBodyChildren[0]).width);
			Ref.viewport.height = parseInt(getComputedStyle(ItemBodyChildren[0]).height);
			Item.Postprocessed.Viewport++;
		}
	}

	// Linkage
	Item.Postprocessed.Linkage = L.postprocessLinkage(Item.Path, Item.Body);

	L.LoadedItems++;
	Item.Loaded = true;

}



L.postprocessLinkage = function(FilePath, RootElement, inBiBiNavigation) {

	var Processed = 0;
	var FileDir  = FilePath.replace(/\/?([^\/]+)$/, "");
	var FileName = FilePath.replace(/^.+?([^\/]+)$/, "$1");

	sML.each(RootElement.getElementsByTagName("a"), function(i) {
		var A = this;
		var HrefPathInSource = A.getAttribute("href");
		if(!HrefPathInSource) return;
		if(/^[a-zA-Z]+:/.test(HrefPathInSource)) return A.setAttribute("target", "_blank");
		var HrefPath = O.getPath(FileDir, (!/^\.*\/+/.test(HrefPathInSource) ? "./" : "") + (/^#/.test(HrefPathInSource) ? FileName : "") + HrefPathInSource);
		var HrefFnH = HrefPath.split("#"), HrefFile = HrefFnH[0] ? HrefFnH[0] : FilePath, HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
		sML.each(R.Items, function() {
			var rItem = this;
			if(HrefFile == rItem.Path) {
				A.setAttribute("data-bibi-original-href", HrefPathInSource);
				A.setAttribute("href", "bibi://" + B.Name + "/" + HrefPathInSource);
				A.inBiBiNavigation = inBiBiNavigation;
				A.Target = { Item: rItem, Element: (HrefHash ? "#" + HrefHash : null) };
				A.onclick = function(e) {
					if(this.inBiBiNavigation) sML.stopPropagation(e);
					R.focus(this.Target, { p:0.75, t:20 });
					return false;
				};
				Processed++;
				return;
			}
		});
		if(HrefHash && /^epubcfi\(.+\)$/.test(HrefHash)) {
			A.setAttribute("data-bibi-original-href", HrefPathInSource);
			A.setAttribute("href", "bibi://" + B.Name + "/#" + HrefHash);
			A.inBiBiNavigation = inBiBiNavigation;
			A.Target = O.getEPUBCFITarget(HrefHash);
			A.onclick = function(e) {
				if(!this.Target) return false;
				if(this.inBiBiNavigation) sML.stopPropagation(e);
				R.focus(this.Target, { p:0.75, t:20 });
				return false;
			};
			Processed++;
		}
	});

	return Processed;

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Manipuration

//----------------------------------------------------------------------------------------------------------------------------------------------



R.start = function() {

	if(R.Navigation.Path) L.postprocessLinkage(R.Navigation.Path, C.Navigation.Item, "inBiBiNavigation");

	R.LayoutCanceled = 0;
	R.ResizeTriggerCanceled = 0;

	window.addEventListener(O.SmartPhone ? "orientationchange" : "resize", function() {
		if(R.layoutTimer) clearTimeout(R.layoutTimer);
		R.layoutTimer = setTimeout(function() { if(!R.ResizeTriggerCanceled) R.layout({ Reflesh: true }); }, (sML.OS.iOS || sML.OS.Android) ? 888 : 444);
	});

	R.layout({ Reflesh: true }, (X.To ? X.To : "head"), function() {
		sML.each(R.Items, function(){
			this.Box.style.background = this.contentDocument.defaultView.getComputedStyle(this.HTML).background;  this.HTML.style.background = "";
			this.style.background     = this.contentDocument.defaultView.getComputedStyle(this.Body).background;  this.Body.style.background = "";
		});
		sML.style(R.Contents, { transition: "opacity 0.75s ease-in-out" });
		sML.each([R.Contents, C.Go, C.Switch], function() { sML.style(this, { opacity: 1 }); });
		sML.each([C.Go.Back, C.Go.Forward], function() { sML.style(this, { opacity: 1 }); });
		setTimeout(function() {
			N.close(function() { setTimeout(function() { sML.each([C.Go.Back, C.Go.Forward], function() { sML.style(this, { opacity: "" }); }); }, 888); });
		}, 444);
		O.log(1, 'Enjoy!');
	});

}



R.layout = function(Setting, Target, doAfter) {

	if(R.LayoutCanceled) return;

	R.LayoutCanceled++;
	R.ResizeTriggerCanceled++;

	var Reflesh = null, NoLog = null;
	if(Setting && Setting.Reflesh) { Reflesh = true; delete Setting.Reflesh; }
	if(Setting && Setting.NoLog)   { NoLog   = true; delete Setting.NoLog;   }

	if(!NoLog) O.log(2, 'Laying Out...');

	if(!Target) {
		if(R.Layouted) {
			var CurrentPage = R.getCurrentPages().Start;
			Target = { Item: CurrentPage.Item, PageProgressInItem: CurrentPage.PageIndexInItem / CurrentPage.Item.Pages.length };
		} else {
			Target = { Edge: "head" };
		}
	}

	O.update(Setting);

	if(!NoLog) O.log(3, "(" + [S["book-display-mode"], S["spread-layout-axis"], S["page-size-format"]].join(", ") + ")");

	//sML.each(R.Items, function() { this.Spread.style.display = this.Box.style.display = "block"; });

	sML.each(R.Spreads, function(i) {
		this.style.display = "";
		this.style["margin" + S.BASE.B] = i ? S["spread-gap"] + "px" : "";
		this.style["margin" + S.BASE.A] = "";
		this.style["margin" + S.BASE.S] = S["spread-margin-start"] + "px";
		this.style["margin" + S.BASE.E] = ""; // S["spread-margin-end"  ] + "px";
	});

	if(Reflesh) {
		S.Paged = false;
		if(sML.OS.iOS && sML.UA.Sa) O.Body.style.height = S["spread-layout-direction"] == "ttb" ? "100%" : window.innerHeight + "px";
		sML.each(R.Pages, function() { sML.removeElement(this); }); R.Pages = [];
		R.Contents.style["padding" + S.BASE.B] = R.Contents.style["padding" + S.BASE.A] = S["spread-gap"] / 2 + "px";
		R.Contents.style["padding" + S.BASE.S] = R.Contents.style["padding" + S.BASE.E] = 0;
		R.Contents.style["background"] = S["book-background"];
		sML.each(R.Spreads, function() {
			this.Pages = [];
			this.style.width = this.style.height = "";
			this.style["border-radius"] = S["spread-border-radius"];
			this.style["box-shadow"]    = S["spread-box-shadow"];
		});
		R.StageSize = {
			Reflowable:   {
				Breadth: O.Body["client" + S.SIZE.B] - (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e] + S["spread-margin-start"] + S["spread-margin-end"]),
				Length:  O.Body["client" + S.SIZE.L] - (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a] + S["spread-gap"])
			},
			PrePagenated: {
				Breadth: O.Body["client" + S.SIZE.B] - (S["spread-margin-start"] + S["spread-margin-end"]),
				Length:  O.Body["client" + S.SIZE.L] - (S["spread-gap"])
			}
		}
		R.MaxSpreadWidth = 0;
		sML.each(R.Items, function(ItemIndex) {
			var Spread = this.Spread, Box = this.Box, Item = this, Ref = this.Ref;
			Item.Pages = [];
			if(Ref["rendition:layout"] != "pre-paginated" || !Ref.viewport[S.SIZE.b] || !Ref.viewport[S.SIZE.l]) {
			// -- Reflowable
				Item.scrolling = "no";
				var IsSingleImageItem = (Item.HTML.innerText == "" && Item.Body.querySelectorAll("img").length == 1); // textContent... mmm...
				var StageB = R.StageSize.Reflowable.Breadth, StageL = R.StageSize.Reflowable.Length;
				var PageB  = R.StageSize.Reflowable.Breadth,  PageL = R.StageSize.Reflowable.Length;
				var PageGap = S["item-padding-" + S.BASE.a] + S["spread-gap"] + S["item-padding-" + S.BASE.b];
				if(S["page-size-format"] == "portrait" || S["page-size-format"] == "landscape") {
					var Ratio = 1.414 / 0.96;
					if((S.SIZE.l == "width" && S["page-size-format"] == "portrait") || (S.SIZE.l == "height" && S["page-size-format"] == "landscape")) Ratio = 1 / Ratio;
					PageL = Math.min(StageL, Math.floor(PageB * Ratio));
				}
				Spread.style[S.SIZE.b] = Box.style[S.SIZE.b] = PageB + (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]) + "px";
				Item.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + "px";
				Item.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + "px";
				Item.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
				Item.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
				Item.style[S.SIZE.b] = PageB + "px";
				Item.style[S.SIZE.l] = PageL + "px";
				Item.HTML.style[S.SIZE.b] = PageB + "px"
				Item.HTML.style[S.SIZE.l] = PageL + "px";
				sML.style(Item.HTML, { "column-axis": "", "column-width": "", "column-gap": "", "column-rule": "" });
				if((function() {
					if(typeof S["fit-images"] != "string" || S["fit-images"] == "no")       return false;
					if(S["fit-images"] == "always")                                         return  true;
					if(Item.HTML.innerText && Item.Body.querySelectorAll("img").length > 1) return false;
					if(S["fit-images"] == "in-single-image-only-item")                      return  true; else return false;
				})()) {
					var Scale = 1;
					if(IsSingleImageItem) {
						sML.style(Item.HTML, { transformOrigin: "", transform: "" });
						if(Item.HTML["scroll" + S.SIZE.B] > PageB || Item.HTML["scroll" + S.SIZE.L] > PageL) {
							Scale = Math.floor(Math.min(PageB / Item.HTML["scroll" + S.SIZE.B], PageL / Item.HTML["scroll" + S.SIZE.L]) * 100) / 100;
							sML.style(Item.HTML, {
								transformOrigin: "50% 0",
								transform: "scale(" + Scale + ")"
							});
						}
					}
					sML.each(Item.Body.querySelectorAll("img"), function() {
						this.style.width  = this.BiBi.DefaultStyle.width;
						this.style.height = this.BiBi.DefaultStyle.height;
						var MaxB = Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.b]), Math.floor(PageB / Scale));
						var MaxL = Math.min(parseInt(getComputedStyle(Item.Body)[S.SIZE.l]), Math.floor(PageL / Scale));
						if(parseInt(getComputedStyle(this)[S.SIZE.b]) > MaxB) {
							this.style[S.SIZE.b] = MaxB + "px";
							this.style[S.SIZE.l] = "auto";
						}
						if(parseInt(getComputedStyle(this)[S.SIZE.l]) > MaxL) /*if(!S["fit-images_breadth-only"])*/ {
							this.style[S.SIZE.l] = MaxL + "px";
							this.style[S.SIZE.b] = "auto";
						}
					});
				}
				var WordWrappingStyleSheetIndex = sML.CSS.addRule("*", "word-wrap: break-word;", Item.contentDocument);
				Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
				(function(Z, H, B) {
					Z = H.clientWidth; Z = H.clientHeight; Z = H.scrollWidth; Z = H.scrollHeight; Z = H.offsetWidth; Z = H.offsetHeight;
					Z = B.clientWidth; Z = B.clientHeight; Z = B.scrollWidth; Z = B.scrollHeight; Z = B.offsetWidth; Z = B.offsetHeight;
				})(0, Item.HTML, Item.Body);
				if(Item.Body["scroll" + S.SIZE.B] > PageB) {
					S.Paged = true;
					Item.ColumnBreadth = PageB;
					Item.ColumnLength  = PageL;
					Item.ColumnGap     = PageGap;
					sML.style(Item.HTML, {
						"column-axis": (S.SLD != "ttb" ? "horizontal" : "vertical"),
						"column-width": Item.ColumnLength + "px",
						"column-gap": Item.ColumnGap + "px",
						"column-rule": S["item-column-rule"]
					});
				}
				sML.CSS.removeRule(WordWrappingStyleSheetIndex, Item.contentDocument);
				var BodyL = Item.Body["scroll" + S.SIZE.L]; /*@cc_on if(sML.UA.InternetExplorer >= 10) BodyL = Item.Body["client" + S.SIZE.L]; @*/
				var ItemL = IsSingleImageItem ? Math.max(BodyL,  PageL) : BodyL;
				var Pages = Math.ceil((ItemL + PageGap) / (PageL + PageGap));
				ItemL = (PageL + PageGap) * Pages - PageGap;
				Spread.style[S.SIZE.l] = Box.style[S.SIZE.l] = ItemL + (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]) + "px";
				Item.style[S.SIZE.l] = ItemL + "px";
				R.MaxSpreadWidth = Math.max(R.MaxSpreadWidth, Spread.offsetWidth);
				for(var i = 0; i < Pages; i++) {
					var Page = Box.appendChild(sML.create("span", { className: "page" }));
					Page.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + S["spread-gap"] / 2 + "px";
					Page.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + S["spread-gap"] / 2 + "px";
					Page.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
					Page.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
					Page.style[            S.SIZE.b] = PageB + "px";
					Page.style[            S.SIZE.l] = PageL + "px";
					Page.style[            S.BASE.b] = (PageL + PageGap) * i - S["spread-gap"] / 2 + "px";
					Page.PageIndex         =      R.Pages.length;      R.Pages.push(Page);
					Page.PageIndexInItem   =   Item.Pages.length;   Item.Pages.push(Page);
					Page.PageIndexInSpread = Spread.Pages.length; Spread.Pages.push(Page);
					Page.Item = Item, Page.Box = Box, Page.Spread = Spread;
				}/*
				if(Pages > 1) {
					var LastPage = sML.lastOf(Item.Pages);
					LastPage.style[        S.BASE.b] = "";
					LastPage.style[        S.BASE.a] = S["spread-gap"] / 2 * -1 + "px";
				}*/
			} else {
			// -- Pre Pagenated (Fixed Layout)
				S.Paged = true;
				Item.HTML.style.margin = Item.HTML.style.padding = Item.Body.style.margin = Item.Body.style.padding = 0;
				var PageB  = R.StageSize.PrePagenated.Breadth,  PageL = R.StageSize.PrePagenated.Length;
				Item.style["padding" + S.BASE.B] = Item.style["padding" + S.BASE.A] = Item.style["padding" + S.BASE.S] = Item.style["padding" + S.BASE.E] = 0;
				if((S["spread-layout-direction"] == "ttb") && (Ref["page-spread"] == "right" || Ref["page-spread"] == "left")) {
					PageB = PageB / 2;
				}
				var Scale = Math.min(
					Math.min(Ref.viewport[S.SIZE.b], PageB) / Ref.viewport[S.SIZE.b],
					Math.min(Ref.viewport[S.SIZE.l], PageL) / Ref.viewport[S.SIZE.l]
				);
				PageL = Math.floor(Ref.viewport[S.SIZE.l] * Scale);
				PageB = Math.floor(Ref.viewport[S.SIZE.b] * (PageL / Ref.viewport[S.SIZE.l]));
				Item.style[S.SIZE.l] = Box.style[S.SIZE.l] = PageL + "px";
				Item.style[S.SIZE.b] = Box.style[S.SIZE.b] = PageB + "px";
				sML.style(Item.HTML, { width: Ref.viewport.width + "px", height: Ref.viewport.height + "px", transformOrigin: "0 0", transform: "scale(" + Scale + ")" });
				if(!ItemIndex || !Item.Pair || Item.Pair != R.Items[ItemIndex - 1]) {
					Spread.MarginMore = 0;
					if(S["spread-layout-direction"] != "ttb") {
						Spread.style[S.SIZE.b] = PageB + "px";
						Spread.style[S.SIZE.l] = PageL + "px";
					} else {
						Spread.style[S.SIZE.b] = PageB + "px";
						Spread.style[S.SIZE.l] = PageL + "px";
						if(!Item.Pair) {
							     if(Ref["page-spread"] == "right")  Spread.MarginMore = PageB;
							else if(Ref["page-spread"] == "center") Spread.MarginMore = Math.floor(PageB / 2);
						}
					}
				} else {
					if(S["spread-layout-direction"] != "ttb") {
						Spread.style[S.SIZE.l] = (parseInt(Spread.style[S.SIZE.l]) + PageL) + "px";
					} else {
						Spread.style[S.SIZE.b] = (parseInt(Spread.style[S.SIZE.b]) + PageB) + "px";
					}
				}
				R.MaxSpreadWidth = Math.max(R.MaxSpreadWidth, Spread.offsetWidth);
				var Page = Box.appendChild(sML.create("span", { className: "page" }));
				if(Ref["page-spread"] == "right") Page.style.right = S["spread-gap"] / 2 * -1 + "px";
				else                              Page.style.left  = S["spread-gap"] / 2 * -1 + "px";
				Page.style.paddingLeft = Page.style.paddingRight = S["spread-gap"] / 2 + "px";
				Page.style[S.SIZE.b] = PageB + "px";
				Page.style[S.SIZE.l] = PageL + "px";
				Page.PageIndex         =      R.Pages.length;      R.Pages.push(Page);
				Page.PageIndexInItem   =   Item.Pages.length;   Item.Pages.push(Page);
				Page.PageIndexInSpread = Spread.Pages.length; Spread.Pages.push(Page);
				Page.Item = Item, Page.Box = Box, Page.Spread = Spread;
			}
		});
		sML.style(C.Navigation.Item, { float: "" });
		if(S.SLD == "rtl") {
			var theWidth = C.Navigation.Item.scrollWidth - window.innerWidth;
			if(C.Navigation.Item.scrollWidth - window.innerWidth < 0) sML.style(C.Navigation.Item, { float: "right" });
			C.Navigation.Box.scrollLeft = C.Navigation.Box.scrollWidth - window.innerWidth;
		}
	}

	Target = R.getTarget(Target);

	R.CurrentEdgeSpread = { Head: R.Spreads[0], Foot: R.Spreads[R.Spreads.length - 1] };

	// Change Display
	sML.each(R.Spreads, function() {
		if(S.SLD == "ttb") this.style.marginLeft = S["spread-margin-start"] + this.MarginMore + "px";//Math.max(S["spread-margin-start"], Math.floor(window.innerWidth - R.MaxSpreadWidth)) + this.MarginMore + "px";
		var Display = (S.BDM == "all") ? "" : "none";
		if(S.BDM == "each" && this == Target.Item.Spread) Display = "", R.CurrentEdgeSpread.Head = R.CurrentEdgeSpread.Foot = Target.Item.Spread;
		this.style.display = Display;
	});

	// Centering Edge Sporeads
	var FirstSpreadMarginBefore = Math.floor((window["inner" + S.SIZE.L] - R.CurrentEdgeSpread.Head["offset" + S.SIZE.L] - S["spread-gap"]) / 2);
	var  LastSpreadMarginAfter  = Math.ceil( (window["inner" + S.SIZE.L] - R.CurrentEdgeSpread.Foot["offset" + S.SIZE.L] - S["spread-gap"]) / 2);
	R.CurrentEdgeSpread.Head.style["margin" + S.BASE.B] = (FirstSpreadMarginBefore > 0 ? FirstSpreadMarginBefore : 0) + "px";
	R.CurrentEdgeSpread.Foot.style["margin" + S.BASE.A] = ( LastSpreadMarginAfter  > 0 ?  LastSpreadMarginAfter  : 0) + "px";

	if(R.Layouted) R.focus(Target, { p:1, t:1 });

	setTimeout(function() {
		if(!R.Layouted) R.focus(Target, { p:0.5, t:1 });
		R.LayoutCanceled--;
		R.Layouted = true;
		if(!NoLog) O.log(2, 'Laid Out.');
		setTimeout(function() { R.ResizeTriggerCanceled--; }, 444);
		if(typeof doAfter == "function") doAfter();
	}, 888);

	return S;

}



R.changeView = function(Setting) {
	if(!Setting) Setting = {};
	Setting.Reflesh = (Setting["spread-layout-axis"] || Setting["page-size-format"]);
	var CurrentPage = R.getCurrentPages().Start;
	sML.style(R.Contents, {
		transition: "opacity 0.5s linear",
		opacity: 0
	}, function() {
		R.ResizeTriggerCanceled++;
		R.layout(Setting, { ItemIndex: CurrentPage.Item.ItemIndex, PageProgressInItem: CurrentPage.PageIndexInItem / CurrentPage.Item.Pages.length });
		setTimeout(function() {
			sML.style(R.Contents, [
				"transition", "opacity 0.5s linear",
				"opacity", 1
			], function() {
				setTimeout(function() { R.ResizeTriggerCanceled--; }, 444);
			});
		}, 100);
	});
}

R.changeBookDisplayMode  = function(BDM) { if(BDM != S.BDM) R.changeView({ "book-display-mode":  BDM }); }
R.changeSpreadLayoutAxis = function(SLA) { if(SLA != S.SLA) R.changeView({ "spread-layout-axis": SLA }); }
R.changePageSizeFormat   = function(PSF) { if(PSF != S.PSF) R.changeView({ "page-size-format":   PSF }); }



R.getTarget = function(T) {
	     if(typeof T == "string") T = { Edge: T };
	else if(typeof T == "number") T = { Item: R.Items[T] };
	if(typeof T != "object" || !T) return null;
	if(T.tagName) {
		TargetElement = T, T = {};
			 if(typeof TargetElement.PageIndex == "number") T.Page    = TargetElement;
		else if(typeof TargetElement.ItemIndex == "number") T.Item    = TargetElement;
		else                                                T.Element = TargetElement;
	}
	if(typeof T.Edge == "string") {
		if(T.Edge == "head") return { Edge: "head", EdgeTRBL: (S.SLD == "ttb" ? "T" : (S.SLD == "rtl" ? "R" : "L")), Item: R.Items[0],                  Page: R.Pages[0] };
		if(T.Edge == "foot") return { Edge: "foot", EdgeTRBL: (S.SLD == "ttb" ? "B" : (S.SLD == "rtl" ? "L" : "R")), Item: R.Items[R.Items.length - 1], Page: R.Pages[R.Pages.length - 1] };
	}
	if(!T.Item && typeof T.ItemIndex == "number") T.Item = R.Items[T.ItemIndex];
	if(T.Element) {
		if(T.Element.tagName) {
			var E = T.Element; //while(E.offsetParent) E = E.offsetParent;
			if(E.ownerDocument.body.Item) T.Item = E.ownerDocument.body.Item; else return null;//if(E.Item) T.Item = E.Item; else return null;
		}
		if(typeof T.Element == "string") {
			if(T.Item) T.Element = T.Item.contentDocument.querySelector(T.Element); else return true;
			if(!T.Element) delete T.Element;
		}
		T.Page = T.Item.Pages[0];
	} else if(T.Page) {
		T.Item = T.Page.Item;
	} else if(typeof T.PageIndexInItem == "number" && T.Item) {
		T.Page = T.Item.Pages[T.PageIndexInItem];
	} else if(typeof T.PageProgressInItem == "number" && T.Item) {
		T.Page = T.Item.Pages[Math.floor(T.Item.Pages.length * T.PageProgressInItem)];
	} else if(typeof T.PageIndex == "number") {
		T.Page = R.Pages[T.PageIndex];
		T.Item = T.Page.Item;
	}
	if(!T.Item) return null;
	if(!T.Page) T.Page = T.Item.Pages[0];
	return T;
}



R.getCurrentPages = function() {
	var WindowCoord = sML.getCoord(window);
	var CurrentPages = [], Start = null, Center = null, End = null, Longest = 0, Nearest = WindowCoord[S.SIZE.l] / 2;
	for(var L = R.Pages.length, i = 0; i < L; i++) {
		if(R.Pages[i].style.display == "none") continue;
		var PageCoord = sML.getCoord(R.Pages[i]);
		var Length   = Math.min(WindowCoord[S.BASE.a] * S.AXIS.PM, PageCoord[S.BASE.a] * S.AXIS.PM) - Math.max(WindowCoord[S.BASE.b] * S.AXIS.PM, PageCoord[S.BASE.b] * S.AXIS.PM);
		var Distance = Math.abs((WindowCoord[S.BASE.b] + WindowCoord[S.BASE.a]) - (PageCoord[S.BASE.b] + PageCoord[S.BASE.a]));
		Length = (Length <= 0 || !PageCoord[S.SIZE.l] || isNaN(Length)) ? -1 : Math.round(Length / PageCoord[S.SIZE.l] * 100);
		     if(Length <  Longest) { if(!CurrentPages.length) continue; else break; }
		else if(Length == Longest) CurrentPages.push(R.Pages[i]);
		else if(Length  > Longest) CurrentPages[0] = R.Pages[i], Longest = Length;
		if(Distance < Nearest) Center = R.Pages[i], Nearest = Distance;
	}
	Start = CurrentPages[0], End = CurrentPages[CurrentPages.length - 1];
	return { All: CurrentPages, Start: Start, Center: Center, End: End };
}

/*R.isInside = function(Element, WindowCoord) {
	if(!WindowCoord) WindowCoord = sML.getCoord(window);
	var ElementCoord = sML.getCoord(Element);
	return (WindowCoord[S.BASE.b] * S.AXIS.PM < ElementCoord[S.BASE.b] * S.AXIS.PM && ElementCoord[S.BASE.a] * S.AXIS.PM < WindowCoord[S.BASE.a] * S.AXIS.PM);
}*/



R.getPageGroup = function(Target) {
	Target = R.getTarget(Target);
	var Next = (Target.Side == "a") ? -1 : +1;
	var Pages = [], Length = 0, Space = window["inner" + S.SIZE.L];
	for(var i = Target.Page.PageIndex; 0 <= i && i < R.Pages.length; i += Next) {
		if((Target.Item.IsPrePaginated && R.Pages[i].Spread != Target.Page.Spread)) break;
		if(Space - R.Pages[i]["offset" + S.SIZE.L] < 0) break;
		Pages.push(R.Pages[i]);
		if(S.SLD == "ttb" && R.Pages[i].Item.Pair && R.Pages[i].Item.Pair == Target.Page.Item) continue;
		Space  -= R.Pages[i]["offset" + S.SIZE.L];
		Length += R.Pages[i]["offset" + S.SIZE.L];
	}
	var MarginBeforeGroup = Math.floor(Space / 2), MarginBeforePage = MarginBeforeGroup;
	if(Target.Side == "a") {
		Pages.reverse();
		MarginBeforePage += (Length - Target.Page["offset" + S.SIZE.L]);
	}
	return { Page: Target.Page, Pages: Pages, Length: Length, MarginBeforeGroup: MarginBeforeGroup, MarginBeforePage: MarginBeforePage }
}



R.focus = function(Target, ScrollOption) {
	var FocusTarget = R.getTarget(Target); if(typeof FocusTarget != "object" || !FocusTarget) return false;
	if(!ScrollOption) ScrollOption = { p:0.4, t:10 };
	if(FocusTarget.Edge) {
		var FocusPoint = /^[TL]$/.test(FocusTarget.EdgeTRBL) ? 0 : O.Body["scroll" + S.SIZE.L] - O.Body["client" + S.SIZE.L];
		sML.scrollTo((S.SLD == "ttb" ? { y:FocusPoint } : { x:FocusPoint }), ScrollOption);
		return false;
	}
	if(S.BDM == "each" && FocusTarget.Spread != R.getCurrentPages().Start.Spread) {
		R.layout({ Reflesh: false, NoLog: true }, { Item: FocusTarget.Item, PageProgressInItem: FocusTarget.Page.PageIndexInItem / FocusTarget.Item.Pages.length });
	}
	if(S.SLD == "ttb") var TorL = ["Top", "Left"], tORl = ["top", "left"];
	else               var TorL = ["Left", "Top"], tORl = ["left", "top"];
	var E, FocusPoint, TextLocationTarget = { Element: FocusTarget.Element, TextNodeIndex: FocusTarget.TextNodeIndex, TermStep: FocusTarget.TermStep }, doAfterScrolling = function() {};
	if(FocusTarget.Element) {
		E = FocusTarget.Item.Pages[0];
		var ElementPoint = E["offset" + TorL[0]];
		while(E.offsetParent) E = E.offsetParent, ElementPoint += E["offset" + TorL[0]];
		E = FocusTarget.Element;              var OffsetInItem  = E["offset" + TorL[0]], OffsetInItemO  = E["offset" + TorL[1]];
		while(E.offsetParent) E = E.offsetParent, OffsetInItem += E["offset" + TorL[0]], OffsetInItemO += E["offset" + TorL[1]];
		if(sML.getCoord(FocusTarget.Element)[S.BASE.s] > FocusTarget.Item["offset" + S.SIZE.B] - S["item-padding-" + S.BASE.s] - S["item-padding-" + S.BASE.e]) {
			// Columned
			if(OffsetInItemO == 0) {
				OffsetInItem = 0;
			} else if(S.PPD != "rtl") {
				OffsetInItem = (FocusTarget.Item.ColumnLength + FocusTarget.Item.ColumnGap) * Math.floor(OffsetInItemO / FocusTarget.Item.ColumnBreadth) - (S["item-padding-" + S.BASE.b]);
			} else {
				OffsetInItem = (FocusTarget.Item.ColumnLength + FocusTarget.Item.ColumnGap) * Math.ceil( OffsetInItemO / FocusTarget.Item.ColumnBreadth) - (S["item-padding-" + S.BASE.a]);
			}
			if(S.SLD == "rtl") OffsetInItem = FocusTarget.Item["offset" + S.SIZE.L] - OffsetInItem;
		} else {
			if(S.SLD == "rtl") OffsetInItem = OffsetInItem + FocusTarget.Element["offset" + S.SIZE.L];
		}
		ElementPoint += S["item-padding-" + tORl[0]] + OffsetInItem;
		// Find Nearest Page
		sML.each(FocusTarget.Item.Pages, function() {
			var PageBefore = sML.getCoord(this)[S.BASE.b];
			if((ElementPoint + 8) * S.AXIS.PM < PageBefore * S.AXIS.PM) return false;
			FocusPoint = PageBefore;
		});
		// Search TextNode & Index in Element to Select
		if(typeof TextLocationTarget.TextNodeIndex != "number" && /[^ 　\s\t\r\n]/.test(TextLocationTarget.Element.textContent)) {
			var TextLocationTargetNode = TextLocationTarget.Element;
			while(TextLocationTargetNode.childNodes.length) {
				sML.each(TextLocationTargetNode.childNodes, function(i) {
					if(/[^ 　\s\t\r\n]/.test(this.textContent)) {
						TextLocationTargetNode = this;
						if(this.nodeType == 3) {
							TextLocationTarget.Element = this.parentNode;
							TextLocationTarget.TextNodeIndex = i;
						}
						return false;
					}
				});
			}
		}
		if(typeof TextLocationTarget.TextNodeIndex == "number") R.pointTextLocation(TextLocationTarget);
	} else {
		var FocusTargetPageGroup = R.getPageGroup(FocusTarget);
		E = FocusTargetPageGroup.Pages[0];
		FocusPoint = E["offset" + TorL[0]];
		while(E.offsetParent) E = E.offsetParent, FocusPoint += E["offset" + TorL[0]];
		if(S.SLD == "rtl") FocusPoint += Math.floor(FocusTargetPageGroup.Pages[0]["offset" + S.SIZE.L]);
		if(window["inner" + S.SIZE.L] > FocusTargetPageGroup.Pages[0]["offset" + S.SIZE.L]) {
			var PageMargin = Math.floor((window["inner" + S.SIZE.L] - FocusTargetPageGroup.Length) / 2);
			if(PageMargin > 0) FocusPoint -= PageMargin * S.AXIS.PM;
		}
	}
	if(S.SLD == "rtl") FocusPoint -= window["inner" + S.SIZE.L];
	sML.scrollTo((S.SLD == "ttb" ? { y:FocusPoint } : { x:FocusPoint }), ScrollOption, doAfterScrolling);
	return false;
}



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
}



R.page = function(Distance) {
	if(!S.Paged) return R.scroll(Distance);
	if(Distance != -1) Distance = +1;
	var CurrentPages = R.getCurrentPages(), CurrentPage = Distance < 0 ? CurrentPages.Start : CurrentPages.End;
	var TargetPageIndex = CurrentPage.PageIndex + Distance;
	if(TargetPageIndex <                  0) return R.focus({ Edge: "head" });
	if(TargetPageIndex > R.Pages.length - 1) return R.focus({ Edge: "foot" });
	var TargetPage = R.Pages[TargetPageIndex];
	if(S.SLA == "vertical" && TargetPage.Item.Pair) {
		if(CurrentPage.Item.Pair == TargetPage.Item) TargetPageIndex += (Distance > 0 ? +1 : -1);
	}
	if(S.SLA == "horizontal" && TargetPage.Item.Pair) {
		if(Distance < 0 && TargetPage.PageIndexInSpread == 0) TargetPage = TargetPage.Spread.Pages[1];
		if(Distance > 0 && TargetPage.PageIndexInSpread == 1) TargetPage = TargetPage.Spread.Pages[0];
	}
	var wCoord = sML.getCoord(window);
	if(S.BDM == "each" && TargetPage.Spread != CurrentPage.Spread) {
		return R.layout({ Reflesh: false, NoLog: true }, { Item: TargetPage.Item, PageProgressInItem: TargetPage.PageIndexInItem / TargetPage.Item.Pages.length });
	}
	return R.focus({ Page: TargetPage, Side: (Distance > 0 ? "b" : "a") });
}



R.scroll = function(Distance) {
	if(S.Paged) return R.page(Distance);
	if(Distance != -1) Distance = +1;
	var WindowCoord = sML.getCoord(window), ScrollTo = {};
	switch(S.SLD) {
		case "ttb": ScrollTo = { y: WindowCoord.top  + WindowCoord.height * Distance      }; break;
		case "ltr": ScrollTo = { x: WindowCoord.left + WindowCoord.width  * Distance      }; break;
		case "rtl": ScrollTo = { x: WindowCoord.left + WindowCoord.width  * Distance * -1 }; break;
	}
	return sML.scrollTo(ScrollTo, { p:0.4, t:10 });
}



R.to = function(BiBiToString) {
	return R.focus(O.getBiBiToTarget(BiBiToString));
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Interface

//----------------------------------------------------------------------------------------------------------------------------------------------



N.arise = function() {

	N.Opened = true;
	N.Closed = false;

	//N.Perspective = 240; // px
	N.Translate = 240; // %
	//N.Rotate = -48; // deg

	N.OpeningTransition = "0.5s ease-out";
	N.ClosingTransition = "0.5s ease-in";

	N.note = function(Note) {
		N.Message.innerHTML = Note;
	}

	N.toggle = function(IO) {
		R.ControlPanel.Status = (typeof IO == "undefined") ? Math.abs(R.ControlPanel.Status - 1) : IO;
		sML[(R.ControlPanel.Status ? "add" : "remove") + "Class"](O.HTML, "control-panel-on");
		return R.ControlPanel.Status;
	}

	N.open = function(Cb) {
		if(!this.Closed) return this.close(function() { N.open(Cb); });
		this.Closed = false;
		N.Panel.style.zIndex = 100;
		sML.style(N.Panel, {
			transition: N.OpeningTransition,
			transform: "translate" + S.AXIS.XY + "(0)",
			opacity: 0.75
		}, function() {
			N.Message.style.opacity = 1;
			N.Opened = true;
			if(typeof Cb == "function") Cb();
		});
	}

	N.close = function(Cb) {
		if(!this.Opened) return;
		this.Opened = false;
		N.Message.style.opacity = 0;
		sML.style(N.Panel, {
			transition: N.ClosingTransition,
			transform: "translate" + S.AXIS.XY + "(" + (S.AXIS.PM * -1 * N.Translate) + "%)",
			opacity: 0
		}, function() {
			sML.style(N.Panel, {
				transition: "none",
				transform: "translate" + S.AXIS.XY + "(" + (S.AXIS.PM * N.Translate) + "%)"
			});
			N.Panel.style.zIndex = 1;
			N.Closed = true;
			if(typeof Cb == "function") Cb();
		});
	}

	N.Panel   =  O.Body.appendChild(sML.create("div", { id: "bibi-notifier-panel" }));
	N.Cover   = N.Panel.appendChild(sML.create("div", { id: "bibi-notifier-cover" }));
	N.Mark    = N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-mark",    className: "animate" }));
	N.Message = N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-message", className: "animate" }));
	N.Powered = N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-powered", innerHTML: O.getLogo({ Linkify: true }) }));
	for(var i = 1; i <= 8; i++) N.Mark.appendChild(sML.create("span", { className: "dot" + i }));

}



C.arise = function() {

	// Shapes
	C.Shape = {};
	C.Shape.Back     = '<span class="bibi-shape bibi-shape-back"></span>';
	C.Shape.Forward  = '<span class="bibi-shape bibi-shape-forward"></span>';
	C.Shape.Item     = '<span class="bibi-shape bibi-shape-item"></span>';
	C.Shape.Spread   = '<span class="bibi-shape bibi-shape-spread">' + C.Shape.Item + C.Shape.Item + '</span>';
	C.Shape.Spreads  = '<span class="bibi-shape bibi-shape-spreads">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';
	C.Shape.SpreadsV = '<span class="bibi-shape bibi-shape-spreads-vertical">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';
	C.Shape.SpreadsH = '<span class="bibi-shape bibi-shape-spreads-horizontal">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';

	// Go
	C.Go         = O.Body.appendChild(sML.create("div", { id: "bibi-control-go" }, { transition: "opacity 0.75s linear", opacity: 0 }));
	C.Go.Back    =   C.Go.appendChild(sML.create("div", { title: "Back",    className: "bibi-control-go", id: "bibi-control-go-back",    onclick: function() { R.page(-1); } }));
	C.Go.Forward =   C.Go.appendChild(sML.create("div", { title: "Forward", className: "bibi-control-go", id: "bibi-control-go-forward", onclick: function() { R.page(+1); } }));
	sML.each([C.Go.Back, C.Go.Forward], function() { this.appendChild(sML.create("img", { alt: this.title, className: "bibi-icon-image", src: "./res/images/icons.png" })); });

	// Switch
	C.Switch     =   O.Body.appendChild(sML.create("div", { id: "bibi-control-switch" }, [ "opacity", 0, "transition", "opacity 0.75s linear" ]));
	C.Switch.Bar = C.Switch.appendChild(
		sML.create("div", { id: "bibi-control-switch-bar", title: "Switch Control-Bar",
			toggle: function(CB) {
				var TranslateAxis = (S["spread-layout-direction"] == "ttb" ? "X" : "Y");
				if(!C.Switch.Bar.On) {
					sML.style(C.Bar, { transition: "0.2s ease-in" });
					sML.style(R.Contents, { transition: "0.2s ease-in" }, CB);
					sML.addClass(O.HTML, "bibi-control-bar-opened");
				} else {
					sML.style(C.Bar, { transition: "0.2s ease-out" });
					sML.style(R.Contents, { transition: "0.2s ease-out" }, CB);
					sML.removeClass(O.HTML, "bibi-control-bar-opened");
				}
				C.Switch.Bar.On = (!C.Switch.Bar.On);
			},
			onclick: function() { this.toggle(); },
			On: false
		})
	);
	C.Switch.FullScreen = C.Switch.appendChild(
		sML.create("div", { id: "bibi-control-switch-fullscreen", title: "Switch Full-Screen",
			toggle: function(CB) {
				if(!C.Switch.FullScreen.On) {
					sML.requestFullScreen(C.Switch.FullScreen.Req);
					setTimeout(function() { sML.addClass(   O.HTML, "bibi-fullscreen"); }, 400);
				} else {
					sML.exitFullScreen(C.Switch.FullScreen.Doc);
					setTimeout(function() { sML.removeClass(O.HTML, "bibi-fullscreen"); }, 400);
				}
				C.Switch.FullScreen.On = (!C.Switch.FullScreen.On);
			},
			onclick: function() { this.toggle(); },
			On: false,
			Req: document.documentElement,
			Doc: document
		}, {
			display: "none"
		})
	);
	sML.each([C.Switch.Bar, C.Switch.FullScreen], function() { this.appendChild(sML.create("img", { alt: this.title, className: "bibi-icon-image", src: "./res/images/icons.png" })); });
	window.addEventListener("load", function() {
		setTimeout(function() {
			if(O.ParentFrame) C.Switch.FullScreen.Req = O.ParentFrame, C.Switch.FullScreen.Doc = parent.document;
			if(sML.fullScreenEnabled(C.Switch.FullScreen.Doc) && (parent == window || O.ParentFrame)) C.Switch.FullScreen.style.display = "block";
			else sML.addClass(O.HTML, "not-enabled-full-screen");
		}, 100);
	}, false);

	// Sheet
	C.Sheet = O.Body.appendChild(sML.create("div", { id: "bibi-control-sheet", onclick: C.Switch.Bar.toggle }));

	// Bar
	C.Bar = O.Body.appendChild(sML.create("div", { id: "bibi-control-bar" }));

	// Bar > Misc
	C.Misc = C.Bar.appendChild(sML.create("div", { id: "bibi-control-misc", innerHTML: O.getLogo({ Linkify: true }) }));

	// Bar > Navigation
	C.Navigation      = C.Bar.appendChild(           sML.create("div", { id: "bibi-control-navigation" }));
	C.Navigation.Box  = C.Navigation.appendChild(    sML.create("div", { id: "bibi-control-navigation-box", onclick: C.Switch.Bar.toggle }));
	C.Navigation.Item = C.Navigation.Box.appendChild(sML.create("div", { id: "bibi-control-navigation-item" }));

	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	if(sML.UA.InternetExplorer < 11 || sML.UA.Gecko || sML.UA.Opera < 15) return;
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////

	// Bar > Menus
	C.Menus = C.Bar.appendChild(sML.create("div", { id: "bibi-control-menus" }));
	C.Menus["move"] = C.Menus.appendChild(sML.create("menu", { id: "move" }));
	C.Menus["move"].Buttons = {
		"back": C.Menus["move"].appendChild(
			sML.create("li", { id: "move-back", innerHTML: '<span class="bibi-icon bibi-icon-back" title="Back">' + C.Shape.Back + '</span>',
				onclick: function() { R.page(-1); } // onclick: function() { R.move(-1); }
			})
		),
		"forward": C.Menus["move"].appendChild(
			sML.create("li", { id: "move-forward", innerHTML: '<span class="bibi-icon bibi-icon-forward" title="Forward">' + C.Shape.Forward + '</span>',
				onclick: function() { R.page(+1); } // onclick: function() { R.move(+1); }
			})
		)
	}
	C.Menus["book-display-mode"] = C.Menus.appendChild(sML.create("menu", { id: "book-display-mode" }));
	C.Menus["book-display-mode"].Buttons = {
		"all": C.Menus["book-display-mode"].appendChild(
			sML.create("li", { id: "display-all", innerHTML: '<span class="bibi-icon bibi-icon-all" title="Display All">' + C.Shape.Spreads + '</span>',
				onclick: function() { R.changeBookDisplayMode("all"); }
			})
		),
		"each": C.Menus["book-display-mode"].appendChild(
			sML.create("li", { id: "display-each", innerHTML: '<span class="bibi-icon bibi-icon-each" title="Display Each">' + C.Shape.Spread + '</span>',
				onclick: function() { R.changeBookDisplayMode("each"); }
			})
		)
	}
	C.Menus["spread-layout-axis"] = C.Menus.appendChild(sML.create("menu", { id: "spread-layout-axis" }));
	C.Menus["spread-layout-axis"].Buttons = {
		"vertical": C.Menus["spread-layout-axis"].appendChild(
			sML.create("li", { id: "layout-vertical", innerHTML: '<span class="bibi-icon bibi-icon-vertical" title="Layout Vertically">' + C.Shape.SpreadsV + '</span>',
				onclick: function() { C.Switch.Bar.toggle(function() { R.changeSpreadLayoutAxis("vertical"); }); }
			})
		),
		"horizontal": C.Menus["spread-layout-axis"].appendChild(
			sML.create("li", { id: "layout-horizontal", innerHTML: '<span class="bibi-icon bibi-icon-horizontal" title="Layout Horizontally">' + C.Shape.SpreadsH + '</span>',
				onclick: function() { C.Switch.Bar.toggle(function() { R.changeSpreadLayoutAxis("horizontal"); }); }
			})
		)
	}
	sML.each(C.Menus.querySelectorAll(".bibi-icon"), function() { this.innerHTML = '<span class="non-visual">' + this.title + '</span>' + this.innerHTML; });

	C.listenKeys = function(e) {
		C.KeyCode = e.keyCode;
		var Dir = null; //                                                        W                          N                          E                          S
		/**/ if(S["spread-layout-direction"] == "ttb") switch(e.keyCode) {  case 37: Dir =  0; break;  case 38: Dir = -1; break;  case 39: Dir =  0; break;  case 40: Dir = +1; break;  }
		else if(S["spread-layout-direction"] == "ltr") switch(e.keyCode) {  case 37: Dir = -1; break;  case 38: Dir =  0; break;  case 39: Dir = +1; break;  case 40: Dir =  0; break;  }
		else if(S["spread-layout-direction"] == "rtl") switch(e.keyCode) {  case 37: Dir = +1; break;  case 38: Dir =  0; break;  case 39: Dir = -1; break;  case 40: Dir =  0; break;  }
		switch(Dir) {
			case -1: return R.page(-1);
			case +1: return R.page(+1);
			case  0: return C.Switch.Bar.toggle();
		}
	}

	window.addEventListener("keydown", C.listenKeys, false);

}



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Extra (Hash / Queries / CFI)

//----------------------------------------------------------------------------------------------------------------------------------------------



O.readExtra = function() {

	O.EPUBCFI = BiBiEPUBCFI;

	Q = sML.getQueries(), H = O.parseHash(), X = {};

	// Back Compat.
	Q = (function(Queries, Book, BiBi) {
		Q.BDM = Q["book-display-mode"]       || Q["dm"];
		Q.SLA = Q["spread-layout-direction"] || Q["sd"];
		Q.PSF = Q["page-size-format"]        || Q["po"];
		if(Q["preset"]) BiBi.push("preset:" + Q["preset"]);
		if(Q.BDM) BiBi.push(Q.BDM);
		if(Q.SLA) BiBi.push(Q.SLA);
		if(Q.PSF) BiBi.push(Q.PSF);
		if(BiBi.length) Queries["bibi"] = BiBi.join(",");
		Queries.book = Book;
		return Queries;
	})({}, Q["book"], []);
	if(history.replaceState) history.replaceState(null, null, location.href.replace(/[#\,]$/, "").replace(/(\?book=[^&#]+)[^#]*(#.+)?$/g, "$1$2"));
	if(!H["bibi"] && Q["bibi"]) {
		H["bibi"] = Q["bibi"];
		if(history.replaceState) history.replaceState(null, null, location.href + (location.hash ? "," : "#") + "bibi(" + H["bibi"] + ")");
	}

	X.Wait = true;
	if(((parent == window) && !H.wait) || H.auto) delete X.Wait;
	if(history.replaceState) history.replaceState(null, null, location.href.replace(/\,?(wait|auto)\([^\)]*\)/g, ""));

	if(H["bibi"]) {
		var BiBi = [];
		H["bibi"] = H["bibi"].replace(" ", "");
		sML.each(H["bibi"].split(","), function() {
			var KnV = this.split(":"); if(!KnV[0]) return;
			if(KnV[1]) switch(KnV[0]) {
				case "preset": X.Preset = KnV[1].replace(/(\.js)?$/, ".js"); return;
				case     "to": X.To     = O.getBiBiToTarget(KnV[1]);         return;
				default      : return;
			}
			switch(KnV[0]) {
				// display-mode
				case "all": case "each":
				if(!X.BDM) X.BDM = KnV[0]; return;
				// spread-layout-axis
				case "horizontal": case "vertical":
				if(!X.SLA) X.SLA = KnV[0]; return;
				// page-size-format
				case "window": case "portrait": case "landscape":
				if(!X.PSF) X.PSF = KnV[0]; return;
			}
		});
	}
	if(!X.To && H["epubcfi"]) X.To = O.getEPUBCFITarget(H["epubcfi"]);

}



O.parseHash = function() {
	if(!location.hash) return {};
	var Hash = location.hash.replace(/^#/, ""), CurrentPosition = 0, Fragments = {};
	var parseFragment = function() {
		var Foothold = CurrentPosition, Label = "";
		while(/[a-z]/.test(Hash.charAt(CurrentPosition))) CurrentPosition++;
		if(Hash.charAt(CurrentPosition) == "(") Label = Hash.substr(Foothold, CurrentPosition - 1 - Foothold + 1), CurrentPosition++; else return null;
		while(Hash.charAt(CurrentPosition) != ")") CurrentPosition++;
		Fragments[Label] = Hash.substr(Foothold, CurrentPosition - Foothold + 1).replace(/^[a-z]+\(/, "").replace(/\)$/, "");
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
}



O.getBiBiToTarget = function(BiBiToString) {
	if(typeof BiBiToString == "number") BiBiToString = "" + BiBiToString;
	if(typeof BiBiToString != "string" || !/^[1-9][0-9]*(-[1-9][0-9]*(\.[1-9][0-9]*)*)?$/.test(BiBiToString)) return null;
	var ElementSelector = "", InE = BiBiToString.split("-"), ItemIndex = parseInt(InE[0]), ElementIndex = InE[1] ? InE[1] : null;
	if(ElementIndex) sML.each(ElementIndex.split("."), function() { ElementSelector += ">*:nth-child(" + this + ")"; });
	return {
		BiBiToString: BiBiToString,
		ItemIndex: ItemIndex - 1,
		Element: (ElementSelector ? "body" + ElementSelector : null)
	};
}



O.getEPUBCFITarget = function(CFIString) {
	var CFI = O.EPUBCFI.parse(CFIString);
	if(!CFI || CFI.Path.Steps.length < 2 || !CFI.Path.Steps[1].Index || CFI.Path.Steps[1].Index % 2 == 1) return null;
	var ItemIndex = CFI.Path.Steps[1].Index / 2 - 1, ElementSelector = null, TextNodeIndex = null, TermStep = null, IndirectPath = null;
	if(CFI.Path.Steps[2] && CFI.Path.Steps[2].Steps) {
		ElementSelector = "";
		sML.each(CFI.Path.Steps[2].Steps, function(i) {
			if(this.Type == "IndirectPath") { IndirectPath = this; return false; }
			if(this.Type == "TermStep")     { TermStep     = this; return false; }
			if(this.Index % 2 == 1) {
				TextNodeIndex = this.Index - 1;
				if(i != CFI.Path.Steps[2].Steps.length - 2) return false;
			}
			if(TextNodeIndex === null) ElementSelector = this.ID ? "#" + this.ID : ElementSelector + ">*:nth-child(" + (this.Index / 2) + ")";
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
}



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------



O.getLogo = function(Setting) {
	return [
		'<span class="bibi-logo"' + (Setting.ID ? ' id="' + Setting.ID + '"' : '') + '>',
			(Setting.Linkify ? '<a href="' + I.WebSite + '" title="BiB/i | Web Site" target="_blank">' : ''),
				'<span class="bibi-type-B">B</span>',
				'<span class="bibi-type-i">i</span>',
				'<span class="bibi-type-B">B</span>',
				'<span class="bibi-type-slash">/</span>',
				'<span class="bibi-type-i">i</span>',
			(Setting.Linkify ? '</a>' : ''),
		'</span>'
	].join("");
}



O.log = function(Lv, Message) {
	if((parent && parent != window) || !console || !console.log || !Message || typeof Message != "string") return;
	status = 'BiB/i: ' + Message;
	if(O.statusClearer) clearTimeout(O.statusClearer);
	O.statusClearer = setTimeout(function() { status = defaultStatus; }, 3210);
	// if(Lv == 2) N.note(Message);
	     if(Lv == 0) Message = "[ERROR] " + Message;
	else if(Lv == 1) Message = "---------------- " + Message + " ----------------";
	else if(Lv == 2) Message = Message;
	else if(Lv == 3) Message = " - " + Message;
	else if(Lv == 4) Message = "   . " + Message;
	console.log('BiB/i: ' + Message);
}



O.isBin = function(T) {
	return /\.(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm)$/i.test(T);
}



O.getPath = function() {
	return (function(Arguments) {
		for(var Path = Arguments[0], L = Arguments.length, i = 1; i < L; i++) Path += "/" + Arguments[i];
		return Path;
	})(arguments).replace(
		/\/\.\//g, "/"
	).replace(
		/[^\/]+\/\.\.\//g, ""
	).replace(
		/\/\//g, "/"
	).replace(
		/^\//, ""
	);
}



O.toBiBiXML = function(XML) {
	return XML.replace(
		/<\?[^>]*?\?>/g, ""
	).replace(
		/<([\w:\d]+) ([^>]+?)\/>/g, "<$1 $2></$1>"
	).replace(
		/<(opf:)?([^!\?\/ >]+)/g, "<bibi:$2"
	).replace(
		/<\/(opf:)?([^!\?\/ >]+)>/g, "</bibi:$2>"
	);
}



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
	"application/xhtml+xml" : /\.xhtml$/i
};





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ready?

//----------------------------------------------------------------------------------------------------------------------------------------------





sML.ready(O.welcome);




