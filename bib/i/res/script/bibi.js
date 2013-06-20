




I = BiB.i.Info = {

	Name        : "BiB/i",
	Description : "EPUB Reader on Your Site.",
	Copyright   : "(c) 2013 Satoru MATSUSHIMA",
	Licence     : "Licensed Under the MIT License. - http://www.opensource.org/licenses/mit-license.php",
	Date        : "Tue June 19 08:45:00 2013 +0900",

	Version     : 0.96, // beta
	Build       : 20130619.0,

	WebSite     : "http://sarasa.la/bib/i"

}





O = BiB.i.O        = {};

R = BiB.i.Reader   = {};

A = BiB.i.Archive  = {};

B = BiB.i.Book     = {};

C = BiB.i.Controls = {};

V = BiB.i.View     = {};

N = BiB.i.Notifier = {};

P = BiB.i.Preset   = {};

S = BiB.i.Setting  = {};

U = BiB.i.User     = {};

Q = BiB.i.Queries  = {};





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Welcome !

//----------------------------------------------------------------------------------------------------------------------------------------------



O.start = function() {

	if(sML.OS.iOS || sML.OS.Android) {
		O.SmartPhone = true;
		var HTML = document.getElementsByTagName("html")[0];
		sML.addClass(HTML, "device-" + sML.DN);
		O.setOrientation = function() {
			window.scrollBy(1, 1);
			sML.removeClass(HTML, "orientation-" + (window.orientation == 0 ? "landscape" : "portrait" ));
			sML.addClass(   HTML, "orientation-" + (window.orientation == 0 ? "portrait"  : "landscape"));
			HTML.style.minHeight = window.innerHeight + "px";
		}
		window.addEventListener("orientationchange", O.setOrientation);
		setTimeout(function() {
			O.setOrientation();
		}, 100);
	}

	O.log(1, 'Welcome !');

	if(sML.OS.iOS) {
		document.head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-capable",          content: "yes"   }));
		document.head.appendChild(sML.create("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }));
	}

	O.HTML = document.getElementsByTagName("html")[0];
	O.Body = document.getElementsByTagName("body")[0];

	R.Contents            = document.body.appendChild(sML.create("div", { id: "epub-contents"  }));
	R.Asides              = document.body.appendChild(sML.create("div", { id: "epub-asides"    }));

	R.Metafiles           = document.body.appendChild(sML.create("div", { id: "epub-metafiles" }));
	R.Metafiles.Container =   R.Metafiles.appendChild(sML.create("div", { id: "epub-container" }));
	R.Metafiles.Package   =   R.Metafiles.appendChild(sML.create("div", { id: "epub-package"   }));

	O.createNotifier();
	O.createControls();

	R.getQueries();
	R.waitEPUB();

}



R.getQueries = function() {
	Q = sML.getQueries();
	if(Q.pb) {
		var PB = Q.pb.split(",");
		Q.preset = PB[0];
		Q.book   = PB[1];
	}
	if(Q.bp) {
		var BP = Q.bp.split(",");
		Q.book   = BP[0];
		Q.preset = BP[1];
	}
	if(Q.book)                       Q.b   = Q.book;
	if(Q.preset)                     Q.p   = Q.preset;
	if(Q["book-display-mode"])       Q.bdm = Q["book-display-mode"];
	if(Q.bdm)                        Q.dm  = Q.dm;
	if(Q["spread-layout-direction"]) Q.sld = Q["spread-layout-direction"];
	if(Q.sld)                        Q.sd  = Q.sld;
	if(Q["spread-orientation"])      Q.so  = Q["spread-orientation"];
}



R.waitEPUB = function() {

	var Book = Q.b ? Q.b : "";

	if(typeof Book != "string" || !Book || /\//.test(Book)) {
		// File Open or Stop
		if(window.File) {
			N.Panel.appendChild(sML.createElement("p", { id: "bibi-drop" }));
			return N.note('Drop an EPUB into this window.');
		} else {
			return N.note('Tell me EPUB name via URL in address-bar.');
		}
	} else {
		R.loadEPUB = /\.epub$/i.test(Book) ? function() {
			// EPUB XHR
			O.log(2, 'Loading EPUB...');
			sML.addClass(N.Panel, "animate");
			N.note('Loading ...');
			O.log(3, '"' + Book + '"');
			sML.Ajax.open("../bookshelf/" + Book, {
				mimetype: "text/plain;charset=x-user-defined",
				onsuccess: function(FileContent) {
					O.log(2, 'Loaded.');
					R.initialize({
						Name: Book.replace(/\.epub$/, ""),
						Format: "EPUB",
						Zipped: true,
						Content: FileContent
					});
					R.Chain.start();
				},
				onfailed: function() {
					O.log(2, 'Failed.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or Drop an EPUB into this window.');
				}
			});
		} : function() {
			// EPUB Folder
			sML.addClass(N.Panel, "animate");
			N.note('Loading ...');
			R.initialize({
				Name: Book,
				Format: "EPUB",
				Zipped: false,
				Content: ""
			});
			R.Chain.start();
		}
		if(Q.wait || (parent && parent != window && !Q.autostart)) {
			N.Panel.appendChild(sML.createElement("p", { id: "bibi-play", onclick: O.SmartPhone ? function() { window.open(location.href.replace(/&wait=[^&]+/, "")); } : function() {
				R.loadEPUB();
				this.onclick = "";
				sML.CSS.set(this, { opacity: 0, cursor: "default" });
			} }));
			return N.note('<a href="' + location.href.replace(/&wait=[^&]+/, "") + '" target="_blank">open in new window.</a>');
		}
		R.loadEPUB();
	}

}



R.initialize = function(Settings) {

	O.HTML.removeAttribute("class");

	sML.addClass(R.Contents, "processing");

	B = {
		Name: Settings.Name,
		Zipped: Settings.Zipped,
		container: { path: "META-INF/container.xml" },
		package: {}
	};

	A = {
		Zip: Settings.Content,
		Files: {},
		FileDigit: 3
	};

	R.Chain = new sML.Chain(
		R.loadPreset,
		(B.Zipped ? R.extractEPUB : function() { R.Chain.next(); }),
		R.readContainer,
		R.readPackageDocument,
		(B.Zipped ? R.preprocessContents : function() { R.Chain.next(); }),
		R.loadNavigationDocument,
		R.loadSpineItems,
		R.postprocessContents,
		R.finish
	);

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Loading

//----------------------------------------------------------------------------------------------------------------------------------------------



R.loadPreset = function() {

	O.log(2, 'Loading Preset...');

	P.file = (typeof Q.p == "string" && Q.p && !/\//.test(Q.p)) ? Q.p + (/\.js$/i.test(Q.p) ? "" : ".js") : "default.js";

	O.log(3, '"' + P.file + '"');

	var PresetScript = sML.insertAfter(
		sML.create("script", { src: "../preset/" + P.file, onload: function() {
			if(sML.OS.iOS || sML.OS.Android) {
				P["spread-separation"]   = P["spread-separation_narrow-device"];
				P["spread-margin-start"] = P["spread-margin-start_narrow-device"];
				P["spread-margin-end"]   = P["spread-margin-end_narrow-device"];
				P["item-padding-left"]   = P["item-padding-left_narrow-device"];
				P["item-padding-right"]  = P["item-padding-right_narrow-device"];
				P["item-padding-top"]    = P["item-padding-top_narrow-device"];
				P["item-padding-bottom"] = P["item-padding-bottom_narrow-device"];
			}
			sML.each([
				"spread-separation", "spread-margin-start", "spread-margin-end",
				"item-padding-left", "item-padding-right",  "item-padding-top",  "item-padding-bottom"
			], function() {
				P[this] = (typeof P[this] != "number" || P[this] < 0) ? 0 : Math.round(P[this]);
			});
			if(P["spread-separation"] % 2) P["spread-separation"]++;
			if(typeof Q.dm == "string" && /^(all|spread|item)$/.test(                     Q.dm)) P["book-display-mode"      ] = Q.dm;
			if(typeof Q.sd == "string" && /^(ttb|ltr|rtl|vertical|horizontal|auto)$/.test(Q.sd)) P["spread-layout-direction"] = Q.sd;
			if(typeof Q.so == "string" && /^(portrait|landscape|auto|window)$/.test(      Q.so)) P["spread-orientation"     ] = Q.so;
			if(!sML.UA.WebKit) P["spread-layout-direction"] = "ttb";
		} }),
		sML.lastOf(document.head.getElementsByTagName("script"))
	);

	if(document.getElementById("bibi-preset")) sML.removeElement(document.getElementById("bibi-preset"));
	PresetScript.id = "bibi-preset";

	O.log(2, 'Loaded.');
	R.Chain.next();

}



R.extractEPUB = function() {

	O.log(2, 'Extracting EPUB...');

	A.FileCount = { All:0, HTML:0, CSS:0, SVG:0, Bitmap:0, Font:0, Audio:0, Video:0 };

	var UnZipped = (new JSZip()).load(A.Zip).files;  delete(A.Zip);
	for(var FileName in UnZipped) {
		if(UnZipped[FileName].data) {
			A.FileCount.All++;
			     if(         /\.(x?html?)$/i.test(FileName)) A.FileCount.HTML++;
			else if(             /\.(css)$/i.test(FileName)) A.FileCount.CSS++;
			else if(             /\.(svg)$/i.test(FileName)) A.FileCount.SVG++;
			else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) A.FileCount.Bitmap++;
			else if(    /\.(woff|otf|ttf)$/i.test(FileName)) A.FileCount.Font++;
			else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) A.FileCount.Audio++;
			else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) A.FileCount.Video++;
			A.Files[FileName] = R.isBin(FileName) ? UnZipped[FileName].data : Base64.btou(UnZipped[FileName].data);
		}
	}

	A.FileDigit = (A.FileCount.All + "").length;

	if(A.FileCount.All)    O.log(3, sML.String.padZero(A.FileCount.All,    A.FileDigit) + ' Files');
	if(A.FileCount.HTML)   O.log(4, sML.String.padZero(A.FileCount.HTML,   A.FileDigit) + ' HTML');
	if(A.FileCount.CSS)    O.log(4, sML.String.padZero(A.FileCount.CSS,    A.FileDigit) + ' CSS');
	if(A.FileCount.SVG)    O.log(4, sML.String.padZero(A.FileCount.SVG,    A.FileDigit) + ' SVG');
	if(A.FileCount.Bitmap) O.log(4, sML.String.padZero(A.FileCount.Bitmap, A.FileDigit) + ' Bitmap');
	if(A.FileCount.Font)   O.log(4, sML.String.padZero(A.FileCount.Font,   A.FileDigit) + ' Font');
	if(A.FileCount.Audio)  O.log(4, sML.String.padZero(A.FileCount.Audio,  A.FileDigit) + ' Audio');
	if(A.FileCount.Video)  O.log(4, sML.String.padZero(A.FileCount.Video,  A.FileDigit) + ' Video');

	O.log(2, 'Extracted.');

	R.Chain.next();

}



R.readContainer = function(FileContent) {

	if(B.Zipped) {
		var FileContent = A.Files[B.container.path];
	} else {
		if(!FileContent) {
			return sML.Ajax.open("../bookshelf/" + B.Name + "/" + B.container.path, {
				onsuccess: function(FileContent) { R.readContainer(FileContent); },
				onfailed: function() {
					O.log(2, 'Failed.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or drop an EPUB into this window.');
				}
			});
		}
	}

	O.log(2, 'Reading Container XML...');

	R.Metafiles.Container.innerHTML = R.toBiBiXML(FileContent);
	B.package.path = R.Metafiles.Container.getElementsByTagName("bibi:rootfile")[0].getAttribute("full-path");
	B.package.dir  = B.package.path.replace(/\/?[^\/]+$/, "");
	O.log(3, B.container.path);
	O.log(2, 'Read.');
	R.Chain.next();

}



R.readPackageDocument = function(FileContent) {

	if(B.Zipped) {
		var FileContent = A.Files[B.package.path];
	} else {
		if(!FileContent) {
			return sML.Ajax.open("../bookshelf/" + B.Name + "/" + B.package.path, {
				onsuccess: function(FileContent) { R.readPackageDocument(FileContent); },
				onfailed: function() {
					O.log(2, 'Failed.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or drop an EPUB into this window.');
				}
			});
		}
	}

	O.log(2, 'Reading Package Document...');

	// Package
	R.Metafiles.Package.innerHTML = R.toBiBiXML(FileContent);
	var Metadata = R.Metafiles.Package.getElementsByTagName("bibi:metadata")[0];
	var Manifest = R.Metafiles.Package.getElementsByTagName("bibi:manifest")[0];
	var Spine    = R.Metafiles.Package.getElementsByTagName("bibi:spine")[0];
	var ManifestItems = Manifest.getElementsByTagName("bibi:item");
	var SpineItemrefs = Spine.getElementsByTagName("bibi:itemref");
	if(ManifestItems.length <= 0) return O.log(0, '"' + B.package.path + '" has no <item> in <manifest>.');
	if(SpineItemrefs.length <= 0) return O.log(0, '"' + B.package.path + '" has no <itemref> in <spine>.');
	B.package.metadata = { title: "", creator: "", publisher: "", titles: [], creators: [], publishers: [] };
	B.package.manifest = { item: {}, navigation: {} };
	B.package.spine    = { itemref: [] };

	// METADATA
	sML.each(Metadata.getElementsByTagName("bibi:meta"), function() {
		if(this.getAttribute("refines") || !this.getAttribute("property")) return;
		var Property = this.getAttribute("property").replace(/^dcterms:/, "");
		if(/^(title|creator|publisher)$/.test(Property)) B.package.metadata[Property + "s"].push(this.innerHTML);
		else if(!B.package.metadata[Property]) B.package.metadata[Property] = this.innerText;
	});
	if(!B.package.metadata["titles"    ].length) sML.each(R.Metafiles.Package.getElementsByTagName("bibi:dc:title"),     function() { B.package.metadata["titles"    ].push(this.innerHTML); return false; });
	if(!B.package.metadata["creators"  ].length) sML.each(R.Metafiles.Package.getElementsByTagName("bibi:dc:creator"),   function() { B.package.metadata["creators"  ].push(this.innerHTML); });
	if(!B.package.metadata["publishers"].length) sML.each(R.Metafiles.Package.getElementsByTagName("bibi:dc:publisher"), function() { B.package.metadata["publishers"].push(this.innerHTML); });
	B.package.metadata.title     = B.package.metadata.titles.join(    ", ");
	B.package.metadata.creator   = B.package.metadata.creators.join(  ", ");
	B.package.metadata.publisher = B.package.metadata.publishers.join(", ");
	if(!B.package.metadata["rendition:layout"])      B.package.metadata["rendition:layout"]      = "reflowable";
	if(!B.package.metadata["rendition:orientation"]) B.package.metadata["rendition:orientation"] = "auto";
	if(!B.package.metadata["rendition:spread"])      B.package.metadata["rendition:spread"]      = "auto";

	// MANIFEST
	sML.each(ManifestItems, function() {
		var Item = {
			"id"         : this.getAttribute("id")         || "",
			"href"       : this.getAttribute("href")       || "",
			"media-type" : this.getAttribute("media-type") || "",
			"properties" : this.getAttribute("properties") || "",
			"fallback"   : this.getAttribute("fallback")   || ""
		};
		if(Item.id && Item.href) B.package.manifest.item[Item.id] = Item;
		if(/ nav /.test(" " + Item.properties + " ")) B.package.manifest.navigation.path = R.getPath(B.package.path.replace(/\/[^\/]+$/, ""), Item.href);
	});

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
		B.package.spine.itemref.push(Ref);
	});

	O.log(3, B.package.path);

	if(B.package.metadata.creator || B.package.metadata.title) {
		var Title = "BiB/i | ";
		if(B.package.metadata.title) {
			Title += B.package.metadata.title;
			O.log(3, "title: " + B.title);
		}
		if(B.package.metadata.creator) {
			Title += " - " + B.package.metadata.creator;
			O.log(3, "creator: " + B.creator);
		}
		if(B.package.metadata.publisher) {
			Title += " - " + B.package.metadata.publisher;
			O.log(3, "publisher: " + B.publisher);
		}
	}
	if(Title) document.title = Title;
	O.log(2, 'Read.');
	R.Chain.next();

}



R.preprocessContents = function() {

	O.log(2, 'Preprocessing Contents...');

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
					var ResPath = R.getPath(FileDir, (!/^(\.*\/+|#)/.test(ResPathInSource) ? "./" : "") + ResPathInSource);
					var ResFnH = ResPath.split("#"), ResFile = ResFnH[0] ? ResFnH[0] : FilePath, ResHash = ResFnH[1] ? ResFnH[1] : "";
					//sML.log(FilePath + " - " + ResFile);
					if(ExtRE.test(ResFile) && A.Files[ResFile]) Source = Source.replace(this, this.replace(ResPathInSource, R.getDataURI(ResFile) + (ResHash ? "#" + ResHash : "")));
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
					var ImportPath = R.getPath(FilePath.replace(/[^\/]+$/, ""), this.replace(RE, "$1"));
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
	if(Preprocessed.CSS) O.log(3, sML.String.padZero(Preprocessed.CSS, A.FileDigit) + ' CSS');

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
	if(Preprocessed.SVG) O.log(3, sML.String.padZero(Preprocessed.SVG, A.FileDigit) + ' SVG');

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
	if(Preprocessed.HTML) O.log(3, sML.String.padZero(Preprocessed.HTML, A.FileDigit) + ' HTML');

	O.log(2, 'Preprocessed.');

	R.Chain.next();

}



R.loadNavigationDocument = function(FileContent) {

	if(!B.package.manifest.navigation.path) {
		O.log(2, 'No Navigation Document.');
		return R.Chain.next();
	}

	if(B.Zipped) {
		var FileContent = A.Files[B.package.manifest.navigation.path];
	} else {
		if(!FileContent) {
			return sML.Ajax.open("../bookshelf/" + B.Name + "/" + B.package.manifest.navigation.path, {
				onsuccess: function(FileContent) { R.loadNavigationDocument(FileContent); },
				onfailed: function() {
					O.log(2, 'Failed.');
					sML.removeClass(N.Panel, "animate");
					N.note('Failed. Check and try again, or drop an EPUB into this window.');
				}
			});
		}
	}

	O.log(2, 'Loading Navigation Document...');

	O.log(3, '"' + B.package.manifest.navigation.path + '"');

	var TempDivs = { A: sML.create("div", { innerHTML: FileContent.replace(/^.+<body( [^>]+)?>/, '').replace(/<\/body>.+$/, '') }), B: document.createElement("div") };
	sML.each(sML.toArray(TempDivs.A.getElementsByTagName("nav")), function() { TempDivs.B.appendChild(this); });
	C.Navigation.Item.innerHTML = TempDivs.B.innerHTML;
	sML.deleteElement(TempDivs.A); sML.deleteElement(TempDivs.B); delete TempDivs;

	O.log(2, 'Loaded.');

	R.Chain.next();

}



R.loadSpineItems = function() {

	if(!P.loaded) return setTimeout(arguments.callee, 1000);

	O.log(2, 'Loading Spine Items...');

	R.Contents.innerHTML = "";

	if(B.package.spine["page-progression-direction"] == "ltr" || B.package.spine["page-progression-direction"] == "default") {
		var before = "left",  after = "right";
	} else if(B.package.spine["page-progression-direction"] == "rtl") {
		var before = "right", after = "left";
	}
	R.Spreads = [], R.Boxes = [], R.Items = [], R.Pages = [], R.LoadedItems = 0;

	var writeItemHTML = function(Item, HTML, Head, Body) {
		Item.contentDocument.open();
		Item.contentDocument.write(HTML ? HTML : [
			'<html>',
				'<head>' + Head + '</head>',
				'<body onload="parent.R.Items[' + Item.ItemIndex + '].onItemLoaded(); document.body.removeAttribute(\'onload\'); return false;">' + Body + '</body>',
			'</html>'
		].join(""));
		Item.contentDocument.close();
	}

	// Spreads, Boxes, and Items
	sML.each(B.package.spine.itemref, function(i) {
		var Ref  = this;
		var Path = R.getPath(B.package.dir, B.package.manifest.item[Ref.idref].href);
		var Item = sML.create("iframe", {
			className: "item",
			id: "item-" + sML.String.padZero(i + 1, A.FileDigit),
			Dir: Path.replace(/\/?[^\/]+$/, ""),
			Path: Path,
			Ref: Ref,
			ItemIndex: i,
			ItemNumber: i + 1,
			Pair: null,
			Spread: null,
			Box: null,
			Loaded: false,
			onItemLoaded: function() {
				var Item = this;
				Item.Loaded = true;
				R.LoadedItems++;
				Item.HTML = Item.contentDocument.getElementsByTagName("html")[0];
				Item.Head = Item.contentDocument.getElementsByTagName("head")[0];
				Item.Body = Item.contentDocument.getElementsByTagName("body")[0];
				sML.each(Item.Body.querySelectorAll("link"), function() { Item.Head.appendChild(this); });
				//delete this.onItemLoaded;
			}
		});
		Item.name = Item.id;
		Item.setAttribute("scrolling", "no");
		// Spread
		if(Ref["rendition:layout"] == "pre-paginated" && i) {
			var PrevItem = R.Items[i - 1];
			if(PrevItem.Ref["rendition:layout"] == "pre-paginated") {
				if(Ref["page-spread"] == after || Ref["page-spread"] == "") {
					if(PrevItem.Ref["page-spread"] == "" || PrevItem.Ref["page-spread"] == before) {
						Item.Pair = PrevItem, PrevItem.Pair = Item, Ref["page-spread"] = after, PrevItem.Ref["page-spread"] = before;
					}
				} else if(Ref["page-spread"] == before || Ref["page-spread"] == "center") {
					if(PrevItem.Ref["page-spread"] == "") {
						PrevItem.Ref["page-spread"] = "center";
					}
				}
			}
			if(!Ref["page-spread"] && i == B.package.spine.itemref.length - 1) Ref["page-spread"] = "center";
		}
		Item.Spread = Item.Pair ? Item.Pair.Spread : R.Contents.appendChild(sML.create("div", { className: "spread", Items: [] }));
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
			writeItemHTML(Item, false, '', '<img alt="" src="' + (B.Zipped ? R.getDataURI(Path) : "../bookshelf/" + B.Name + "/" + Path) + '" />');
		} else if(/\.(svg)$/i.test(Path)) { // If SVG-in-Spine
			if(B.Zipped) {
				writeItemHTML(Item, false, '', A.Files[Path].replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
			} else {
				sML.Ajax.open("../bookshelf/" + B.Name + "/" + Path, {
					onsuccess: function(FileContent) {
						writeItemHTML(Item, false, '<base href="../bookshelf/' + B.Name + '/' + Path + '" />', FileContent.replace(/<\?xml-stylesheet (.+?)[ \t]?\?>/g, '<link rel="stylesheet" $1 />'));
					},
					onfailed: function() {}
				});
			}
		} else { // If HTML or Others
			if(B.Zipped) {
				writeItemHTML(Item, A.Files[Path]);
				Item.onItemLoaded();
			} else {
				Item.onload = Item.onItemLoaded;
				Item.src = "../bookshelf/" + B.Name + "/" + Path;
			}
		}
		// Done
		O.log(3, sML.String.padZero(i + 1, A.FileDigit) + '/' + sML.String.padZero(B.package.spine.itemref.length, A.FileDigit) + ' ' + (Path ? '"' + Path + '"' : '... Not Found.'));
	});

	// Done
	R.ct = 25; (function() {
		if(R.ct <= 0) {
			O.log(0, 'Failed.');
		} else if(R.LoadedItems < B.package.spine.itemref.length) {
			R.ct--;
			return setTimeout(arguments.callee, 400);
		} else {
			delete R.ct;
			delete R.LoadedItems;
			O.log(2, 'Loaded.');
			R.Chain.next();
		}
	})();

}



R.postprocessContents = function() {

	O.log(2, 'Postprocessing Contents...');

	var Postprocessed = { Viewport: 0, Linkage:0 };

	var postprocessLinkage = function(FilePath, BodyElement, isNavigation) {
		var FileDir = FilePath.replace(/\/?[^\/]+$/, "");
		sML.each(BodyElement.getElementsByTagName("a"), function(i) {
			var A = this;
			var HrefPathInSource = A.getAttribute("href");
			if(!HrefPathInSource) return;
			if(/^[a-zA-Z]+:/.test(HrefPathInSource)) return A.setAttribute("target", "_blank");
			var HrefPath = R.getPath(FileDir, (!/^(\.*\/+|#)/.test(HrefPathInSource) ? "./" : "") + HrefPathInSource);
			var HrefFnH = HrefPath.split("#"), HrefFile = HrefFnH[0] ? HrefFnH[0] : FilePath, HrefHash = HrefFnH[1] ? HrefFnH[1] : "";
			sML.each(R.Items, function() {
				var rItem = this;
				if(HrefFile == rItem.Path) {
					A.setAttribute("href", "bibi://" + B.Name + "/" + HrefPathInSource);
					A.onclick = isNavigation ? function(e) {
						sML.stopPropagation(e);
						return R.focus(rItem, HrefHash, { p:0.75, t:20 });
					} : function(e) {
						return R.focus(rItem, HrefHash, { p:0.75, t:20 });
					};
					Postprocessed.Linkage++;
					return;
				}
			});
		});
	}

	if(C.Navigation.Item) postprocessLinkage(B.package.manifest.navigation.path, C.Navigation.Item, "isNavigation");

	sML.each(R.Items, function() {
		var Item = this, Box = this.Box, Ref = this.Ref;
		// Margin & Padding & Background
		sML.CSS.add({ "html, body" : "margin: 0; padding: 0;", "html" : "-webkit-text-size-adjust: none;" }, Item.contentDocument);
		// Single SVG / IMG Item
		var ItemBodyChildren = [];
		sML.each(Item.Body.getElementsByTagName("*"), function() { if(this.parentNode == Item.Body) ItemBodyChildren.push(this); });
		if(ItemBodyChildren.length == 1) {
			     if(/^svg$/i.test(ItemBodyChildren[0].tagName)) Item.SingleSVG = true;
			else if(/^img$/i.test(ItemBodyChildren[0].tagName)) Item.SingleIMG = true;
		}
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
						Postprocessed.Viewport++;
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
							Postprocessed.Viewport++;
						}
					}
				}
			} else if(Item.SingleIMG) { // If Single-IMG-HTML or Bitmap-in-Spine, Use IMG "width" / "height" for viewport.
				Ref.viewport.width  = ItemBodyChildren[0].width;
				Ref.viewport.height = ItemBodyChildren[0].height;
				Postprocessed.Viewport++;
			}
		}
		// Linkage
		postprocessLinkage(Item.Path, Item.Body);
		// For Multi-column Layout
		Item.ColumnCSSIndex = sML.CSS.addRule("body", "", Item.contentDocument);
	});

	if(Postprocessed.Viewport) O.log(3, sML.String.padZero(Postprocessed.Viewport, A.FileDigit) + ' Viewport');
	if(Postprocessed.Linkage)  O.log(3, sML.String.padZero(Postprocessed.Linkage,  A.FileDigit) + ' Linkage');

	O.log(2, 'Postprocessed.');

	R.Chain.next();

}



R.finish = function() {

	R.ScrollBarBreadth = Math.max(window.innerWidth - document.body.clientWidth, window.innerHeight - document.body.clientHeight);

	R.LayoutCanceled = 0;
	R.ResizeTriggerCanceled = 0;

	R.updateSetting({ Reset: true });

	setTimeout(function() {
		window.addEventListener((sML.OS.iOS || sML.OS.Android) ? "orientationchange" : "resize", function() {
			if(R.layoutTimer) clearTimeout(R.layoutTimer);
			R.layoutTimer = setTimeout(function() { if(!R.ResizeTriggerCanceled) R.layout({ Reflesh: true }); }, (sML.OS.iOS || sML.OS.Android) ? 800 : 400);
		});
		R.layout({ Reflesh: true }, "head");
		sML.each(R.Items, function(){
			this.Box.style.background  = this.contentDocument.defaultView.getComputedStyle(this.HTML).background;  this.HTML.style.background = "";
			this.style.background      = this.contentDocument.defaultView.getComputedStyle(this.Body).background;  this.Body.style.background = "";
		});
		sML.CSS.set(N.Panel, [
			"transition", "opacity 1s linear",
			"opacity", 0.75
		], function() {
			setTimeout(function() {
				window.scrollTo(S["spread-layout-direction"] == "rtl" ? document.body["scroll" + S.SIZE.L] - document.body["client" + S.SIZE.L] : 0, 0);
				R.Contents.addEventListener(sML.CSS.TransitionEnd, function() {
					this.removeEventListener(sML.CSS.TransitionEnd, arguments.callee);
					sML.each([C.Go, C.Switch], function() { sML.CSS.set(this, { opacity: 1 }); });
					setTimeout(function() { N.close(); }, 400);
					O.log(1, 'Completed');
					//C.Switch.toggleControlBar();
				});
				sML.removeClass(R.Contents, "processing");
			}, 400);
		});
	}, 800);

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Operation

//----------------------------------------------------------------------------------------------------------------------------------------------



R.layout = function(Setting, TargetItem, ProgressArrayInTargetItem) {

	if(R.LayoutCanceled) return;

	R.LayoutCanceled++;
	R.ResizeTriggerCanceled++;

	var Reflesh = null, NoLog = null;
	if(Setting && Setting.Reflesh) { Reflesh = true; delete Setting.Reflesh; }
	if(Setting && Setting.NoLog)   { NoLog   = true; delete Setting.NoLog;   }

	if(!NoLog) O.log(2, 'Laying Out...');

	var Progress = ProgressArrayInTargetItem;
	if(!TargetItem) {
		var Current = R.getCurrent();
		TargetItem = Current.Item;
		Progress = [Current.Page.PageIndexInItem, Current.Item.Pages.length];
	} else if(TargetItem == "head") {
		if(S["spread-layout-direction"] == "rtl") TargetItem = "foot";
	} else if(TargetItem == "foot") {
		if(S["spread-layout-direction"] == "rtl") TargetItem = "head";
	} else if(typeof Progress != "object" || Progress.length != 2) {
		Progress = [0, 1];
	} else {
		     if(Progress[1] < 1)               Progress[1] = 1;
		     if(Progress[0] < 0)               Progress[0] = 0;
		else if(Progress[0] > Progress[1] - 1) Progress[0] = Progress[1] - 1;
	}

	R.updateSetting(Setting);

	if(!NoLog) {
		O.log(3, '"book-display-mode":          "' + S["book-display-mode"]          + '"');
		O.log(3, '"spread-layout-direction":    "' + S["spread-layout-direction"]    + '"');
		O.log(3, '"page-progression-direction": "' + S["page-progression-direction"] + '"');
		O.log(3, '"spread-orientation":         "' + S["spread-orientation"]         + '"');
	}

	//sML.each(R.Items, function() { this.Spread.style.display = this.Box.style.display = "block"; });

	sML.each(R.Spreads, function(i) {
		this.style.display = "";
		this.style["margin" + S.BASE.B] = i ? S["spread-separation"] + "px" : "";
		this.style["margin" + S.BASE.A] = "";
		this.style["margin" + S.BASE.S] = S["spread-margin-start"] + "px";
		this.style["margin" + S.BASE.E] = S["spread-margin-end"  ] + "px";
	});

	if(Reflesh) {
		if(sML.OS.iOS && sML.UA.Sa) document.body.style.height = S["spread-layout-direction"] == "ttb" ? "100%" : window.innerHeight + "px";
		sML.each(R.Pages, function() { sML.removeElement(this); }); R.Pages = [];
		R.Contents.style["padding" + S.BASE.B] = R.Contents.style["padding" + S.BASE.A] = S["spread-separation"] / 2 + "px";
		R.Contents.style["padding" + S.BASE.S] = R.Contents.style["padding" + S.BASE.E] = 0;
		R.Contents.style["background"] = S["book-background"];
		sML.each(R.Spreads, function() {
			this.style.width = this.style.height = "";
			this.style["border-radius"]     = S["spread-border-radius"];
			this.style["box-shadow"]        = S["spread-box-shadow"];
		});
		var WindowB  = document.body["client" + S.SIZE.B] - (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e] + S["spread-margin-start"] + S["spread-margin-end"]);
		var WindowL  = document.body["client" + S.SIZE.L] - (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a] + S["spread-separation"]);
		sML.each(R.Items, function(ItemIndex) {
			var Spread = this.Spread, Box = this.Box, Item = this, Ref = this.Ref;
			Item.Pages = [];
			if(Ref["rendition:layout"] == "pre-paginated" && Ref.viewport[S.SIZE.b] && Ref.viewport[S.SIZE.l]) {
			// -- Pre Pagenated (Fixed Layout)
				var PageB = WindowB + (S["item-padding-" + S.BASE.s] + S["item-padding-" + S.BASE.e]);
				var PageL = WindowL + (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
				Item.style["padding" + S.BASE.B] = Item.style["padding" + S.BASE.A] = Item.style["padding" + S.BASE.S] = Item.style["padding" + S.BASE.E] = 0;
				if((S["spread-layout-direction"] == "ttb") && (Ref["page-spread"] == "right" || Ref["page-spread"] == "left")) {
					PageB = PageB / 2;
					if(!Item.Pair && Ref["page-spread"] == "right") Spread.SpacerMargin = Spread.style.marginLeft = PageB + "px";
				}
				PageB = Math.min(Ref.viewport[S.SIZE.b], PageB);
				var Scale = PageB / Ref.viewport[S.SIZE.b];
				PageL = Math.floor(Ref.viewport[S.SIZE.l] * Scale);
				Item.style[S.SIZE.b] = Ref.viewport[S.SIZE.b] + "px";
				Item.style[S.SIZE.l] = Ref.viewport[S.SIZE.l] + "px";
				sML.CSS.set(Item, { transform: "scale(" + Scale + ")" });
				var BoxB = PageB;
				var BoxL = PageL;
				Box.style[S.SIZE.b] = BoxB + "px";
				Box.style[S.SIZE.l] = BoxL + "px";
				if((S["spread-layout-direction"] != "ttb") || (Ref["page-spread"] != "right" && Ref["page-spread"] != "left")) {
					Spread.style[S.SIZE.b] = BoxB + "px";
				}/*
				var Pages = 2;
				for(var i = 0; i < Pages; i++) {*/
					var Page = Box.appendChild(sML.createElement("span", { className: "page" }));
					Page.style["padding" + S.BASE.B] = S["spread-separation"] / 2 + "px";
					Page.style["padding" + S.BASE.A] = S["spread-separation"] / 2 + "px";
					Page.style[S.SIZE.b] = PageB + "px";
					Page.style[S.SIZE.l] = PageL + "px";
					//Page.style[S.SIZE.l] = (i ? document.body["client" + S.SIZE.L] - S["spread-separation"] : 1) + "px";
					Page.style[S.BASE.b] = S["spread-separation"] / 2 * -1 + "px";
					Page.PageIndex       =    R.Pages.length;    R.Pages.push(Page);
					Page.PageIndexInItem = Item.Pages.length; Item.Pages.push(Page);
					Page.Item = Item;/*
				}
				if(Pages > 1) {
					var LastPage = sML.lastOf(Item.Pages);
					LastPage.style[S.BASE.b] = "";
					LastPage.style[S.BASE.a] = S["spread-separation"] / 2 * -1 + "px";
				}*/
			} else {
			// -- Reflowable
				Item.scrolling = "no";
				var isSingleImageItem = (!Item.HTML.innerText && Item.HTML.getElementsByTagName("img").length == 1);
				var SpreadMinLength = isSingleImageItem ? S["spread-min-length_single-image"] : S["spread-min-length"];
				var PageB = WindowB;
				var PageL = WindowL;
				var PageGap = S["item-padding-" + S.BASE.a] + S["spread-separation"] + S["item-padding-" + S.BASE.b];
				if(S["spread-orientation"] == "portrait" || S["spread-orientation"] == "landscape") {
					var Ratio = 1.414 / 0.96;
					if((S.SIZE.l == "width" && S["spread-orientation"] == "portrait") || (S.SIZE.l == "height" && S["spread-orientation"] == "landscape")) Ratio = 1 / Ratio;
					PageL = Math.min(WindowL, Math.floor(PageB * Ratio));
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
				sML.CSS.set(Item.HTML, { "column-axis": "", "column-width": "", "column-gap": "", "column-rule": "" });
				Item.ColumnBreadth = 0, Item.ColumnLength = 0, Item.ColumnGap = 0;
				(function(Z, H, B) {
					Z = H.clientWidth; Z = H.clientHeight; Z = H.scrollWidth; Z = H.scrollHeight; Z = H.offsetWidth; Z = H.offsetHeight;
					Z = B.clientWidth; Z = B.clientHeight; Z = B.scrollWidth; Z = B.scrollHeight; Z = B.offsetWidth; Z = B.offsetHeight;
				})(0, Item.HTML, Item.Body);
				if(Item.Body["scroll" + S.SIZE.B] > PageB) {
					Item.ColumnBreadth = PageB;
					Item.ColumnLength  = PageL;
					Item.ColumnGap     = PageGap;
					sML.CSS.set(Item.HTML, {
						"column-axis": (S.SIZE.l == "width" ? "horizontal" : "vertical"),
						"column-width": Item.ColumnLength + "px",
						"column-gap": Item.ColumnGap + "px",
						"column-rule": S["item-column-rule"]
					});
				}
				var BodyL = Item.Body["scroll" + S.SIZE.L];
				     if(SpreadMinLength == "self")   var ItemL = BodyL;
				else if(SpreadMinLength == "window") var ItemL = Math.max(BodyL, WindowL);
				else                                 var ItemL = Math.max(BodyL, PageL);
				var BoxL = ItemL + (S["item-padding-" + S.BASE.b] + S["item-padding-" + S.BASE.a]);
				Spread.style[S.SIZE.l] = Box.style[S.SIZE.l] = BoxL + "px";
				Item.style[S.SIZE.l] = ItemL + "px";
				//Item.HTML.style["min-" + S.SIZE.l] = "";
				//Item.scrolling = "yes";
				var Pages = Math.ceil(ItemL / (PageL + PageGap));
				for(var i = 0; i < Pages; i++) {
					var Page = Box.appendChild(sML.createElement("span", { className: "page" }));
					Page.style["padding" + S.BASE.B] = S["item-padding-" + S.BASE.b] + S["spread-separation"] / 2 + "px";
					Page.style["padding" + S.BASE.A] = S["item-padding-" + S.BASE.a] + S["spread-separation"] / 2 + "px";
					Page.style["padding" + S.BASE.S] = S["item-padding-" + S.BASE.s] + "px";
					Page.style["padding" + S.BASE.E] = S["item-padding-" + S.BASE.e] + "px";
					Page.style[S.SIZE.b] = PageB + "px";
					Page.style[S.SIZE.l] = PageL + "px";
					Page.style[S.BASE.b] = (PageL + PageGap) * i - S["spread-separation"] / 2 + "px";
					Page.PageIndex       =    R.Pages.length;    R.Pages.push(Page);
					Page.PageIndexInItem = Item.Pages.length; Item.Pages.push(Page);
					Page.Item = Item;
				}
				if(Pages > 1) {
					var LastPage = sML.lastOf(Item.Pages);
					LastPage.style[S.BASE.b] = "";
					LastPage.style[S.BASE.a] = S["spread-separation"] / 2 * -1 + "px";
				}
			}
		});
	}

	sML.each(R.Spreads, function() {
		if(this.SpacerMargin) {
			this.style.marginLeft = (S["book-display-mode"] != "item") ? this.SpacerMargin : 0;
		}
	});

	R.CurrentEdgeSpread = { F: R.Spreads[0], L: R.Spreads[R.Spreads.length - 1] };

	sML.each(R.Items, function() {
		this.Spread.style.display = (S["book-display-mode"] == "all" ? "" : "none");
		this.Box.style.display = "";
	});
	if(S["book-display-mode"] != "all") {
		if(S["book-display-mode"] == "item" && TargetItem.Pair) TargetItem.Pair.Box.style.display = "none";
		TargetItem.Spread.style.display = "";
		R.CurrentEdgeSpread.F = R.CurrentEdgeSpread.L = TargetItem.Spread;
	}

	if(S["center-end-spreads"]) {
		var FirstSpreadMarginBefore = Math.floor((window["inner" + S.SIZE.L] - R.CurrentEdgeSpread.F["offset" + S.SIZE.L] - S["spread-separation"]) / 2);
		var  LastSpreadMarginAfter  = Math.floor((window["inner" + S.SIZE.L] - R.CurrentEdgeSpread.L["offset" + S.SIZE.L] - S["spread-separation"]) / 2);
		R.CurrentEdgeSpread.F.style["margin" + S.BASE.B] = (FirstSpreadMarginBefore > 0 ? FirstSpreadMarginBefore : 0) + "px";
		R.CurrentEdgeSpread.L.style["margin" + S.BASE.A] = ( LastSpreadMarginAfter  > 0 ?  LastSpreadMarginAfter  : 0) + "px";
	}

	sML.CSS.set(C.Navigation.Item, { float: "" });
	if(S["spread-layout-direction"] == "rtl") {
		var theWidth = C.Navigation.Item.scrollWidth - window.innerWidth;
		if(C.Navigation.Item.scrollWidth - window.innerWidth < 0) sML.CSS.set(C.Navigation.Item, { float: "right" });
		C.Navigation.Box.scrollLeft = C.Navigation.Box.scrollWidth - window.innerWidth;
	}

	setTimeout(function() {
		if(TargetItem == "head") {
			window.scrollTo(0, 0);
		} else if(TargetItem == "foot") {
			var LengthToScroll = document.body["scroll" + S.SIZE.L] - document.body["client" + S.SIZE.L];
			(S["spread-layout-direction"] == "ttb") ? window.scrollTo(0, LengthToScroll) : window.scrollTo(LengthToScroll, 0);
		} else {
			R.focus(TargetItem.Pages[Math.floor(TargetItem.Pages.length * Progress[0] / Progress[1])], null, { p:1, t:1 });
		}
	}, 10);

	R.LayoutCanceled--;
	setTimeout(function() {
		R.ResizeTriggerCanceled--;
	}, 400);

	if(!NoLog) O.log(2, 'Laid Out.');

	return S;

}



R.changeView = function(Setting) {
	if(!Setting) Setting = {};
	Setting.Reflesh = (Setting["spread-layout-direction"] || Setting["spread-orientation"]);
	var Current = R.getCurrent();
	sML.CSS.set(R.Contents, [
		"transition", "opacity 0.5s linear",
		"opacity", 0
	], function() {
		R.ResizeTriggerCanceled++;
		R.layout(Setting, Current.Item, [Current.Page.PageIndexInItem, Current.Item.Pages.length]);
		setTimeout(function() {
			sML.CSS.set(R.Contents, [
				"transition", "opacity 0.5s linear",
				"opacity", 1
			], function() {
				setTimeout(function() { R.ResizeTriggerCanceled--; }, 400);
			});
		}, 100);
	});
	
}

R.changeBookDisplayMode = function(DM) {
	if(DM == S["book-display-mode"]) return;
	R.changeView({ "book-display-mode": DM });
}

R.changeSpreadLayoutDirection = function(SD) {
	if(SD == S["spread-layout-direction"]) return;
	R.changeView({ "spread-layout-direction": SD });
}



R.updateSetting = function(Setting) {

	if(!Setting || typeof Setting != "object") return S;

	var PrevSD = S["spread-layout-direction"], PrevPD = S["page-progression-direction"], PrevDM = S["book-display-mode"];

	// Reset
	if(Setting.Reset) {
		for(var Property in S) delete S[Property];
		for(var Property in P) S[Property] = P[Property];
		S["page-progression-direction"] = (B.package.spine["page-progression-direction"] == "default") ? P["page-progression-direction"] : B.package.spine["page-progression-direction"];
		delete Setting.Reset;
	}
	for(var Property in Setting) S[Property] = Setting[Property];

	// Spread Layout Direction
	var isPrePaginated = (B.package.metadata["rendition:layout"] == "pre-paginated");
	if(S["spread-layout-direction"] == "auto")       S["spread-layout-direction"] =    B.package.spine["page-progression-direction"]        ;
	if(S["spread-layout-direction"] == "default")    S["spread-layout-direction"] = isPrePaginated ? S["page-progression-direction"] : "ttb";
	if(S["spread-layout-direction"] == "horizontal") S["spread-layout-direction"] =                  S["page-progression-direction"]        ;
	if(S["spread-layout-direction"] == "vertical")   S["spread-layout-direction"] =                                                    "ttb";

	// Shortening
	S.DM = S.DisplayMode       = S["book-display-mode"];
	S.PD = S.PageDir           = S["page-progression-direction"];
	S.SD = S.SpreadDir         = S["spread-layout-direction"];
	S.SO = S.SpreadOrientation = S["spread-orientation"];
	S.SS = S.SpreadSeparation  = S["spread-separation"];

	// Layout Dictionary
	if(S.SD == "ttb") {
		S.SIZE = { b: "width",  B: "Width",  l: "height", L: "Height" };
		S.BASE = { b: "top",    B: "Top",    a: "bottom", A: "Bottom", s: "left", S: "Left", e: "right",  E: "Right",  c: "center", m: "middle" };
		S.XYPM = { X: "X", Y: "Y", xP: +1, yP: +1, xM: -1, yM: -1 };
	} else if(S.SD == "ltr") {
		S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width"  };
		S.BASE = { b: "left",   B: "Left",   a: "right",  A: "Right",  s: "top",  S: "Top",  e: "bottom", E: "Bottom", c: "middle", m: "center" };
		S.XYPM = { X: "Y", Y: "X", xP: +1, yP: +1, xM: -1, yM: -1 };
	} else if(S.SD == "rtl") {
		S.SIZE = { b: "height", B: "Height", l: "width",  L: "Width"  };
		S.BASE = { b: "right",  B: "Right",  a: "left",   A: "Left",   s: "top",  S: "Top",  e: "bottom", E: "Bottom", c: "middle", m: "center" };
		S.XYPM = { X: "Y", Y: "X", xP: +1, yP: -1, xM: -1, yM: +1 };
	}

	// Root Class
	sML.each([O.HTML, C.Navigation.Item.HTML], function() {
		if(S.SD == "ttb")  { sML.removeClass(this, "spread-horizontal"); sML.addClass(this, "spread-vertical"  ); }
		else               { sML.removeClass(this, "spread-vertical"  ); sML.addClass(this, "spread-horizontal"); }
		if(PrevSD != S.SD) { sML.removeClass(this, "spread-"  + PrevSD); sML.addClass(this, "spread-"  + S.SD  ); }
		if(PrevPD != S.PD) { sML.removeClass(this, "page-"    + PrevPD); sML.addClass(this, "page-"    + S.PD  ); }
		if(PrevDM != S.DM) { sML.removeClass(this, "display-" + PrevDM); sML.addClass(this, "display-" + S.DM  ); }
	});

	return S;

}



R.getCurrentElementByAreaBreadth = function(Es, wCoord) {
	if(!wCoord) wCoord = sML.getCoord(window);
	var rlPM = (S["spread-layout-direction"] == "rtl") ? -1 : +1;
	var E = Es[0], Area = 0;
	for(var L = Es.length, i = 0; i < L; i++) {
		var PrevArea = Area;
		var eCoord = sML.getCoord(Es[i]);
		if(eCoord[S.BASE.b] * rlPM < wCoord[S.BASE.m] && wCoord[S.BASE.m] < eCoord[S.BASE.a] * rlPM) { E = Es[i]; break; }
		if(wCoord[S.BASE.a] * rlPM < eCoord[S.BASE.b] * rlPM) continue;
		if(wCoord[S.BASE.b] * rlPM > eCoord[S.BASE.a] * rlPM) continue;
		Area = Math.min(wCoord[S.BASE.a], eCoord[S.BASE.a] * rlPM) - Math.max(wCoord[S.BASE.b], eCoord[S.BASE.b] * rlPM) * rlPM;
		if(Area > PrevArea) E = Es[i];
	}
	return E;
}



R.getCurrentElement = function(Es, wCoord) {
	if(!wCoord) wCoord = sML.getCoord(window);
	var rlPM = (S["spread-layout-direction"] == "rtl") ? -1 : +1;
	for(var L = Es.length, i = 0; i < L; i++) {
		var eCoord = sML.getCoord(Es[i]);
		if(eCoord[S.BASE.a] * rlPM <= wCoord[S.BASE.b] * rlPM) continue;
		if(wCoord[S.BASE.a] * rlPM <= eCoord[S.BASE.b] * rlPM) break;
		return Es[i];
		//return ((i < Es.length - 1 && eCoord[S.BASE.b] == sML.getCoord(Es[i + 1])[S.BASE.b]) ? Es[i + 1] : Es[i]);
	}
	return null;
}



R.getCurrent = function(What, wCoord) {
	if(!What) What = "";
	if(!wCoord) wCoord = sML.getCoord(window);
	var CurrentItem = R.getCurrentElement(R.Boxes,           wCoord).Item; if(/^Item$/i.test(What)) return CurrentItem;
	var CurrentPage = R.getCurrentElement(CurrentItem.Pages, wCoord);      if(/^Page$/i.test(What)) return CurrentPage;
	return { Item: CurrentItem, Page: CurrentPage };
}



R.focus = function(Target, Hash, ScrollOption) {
	if(!ScrollOption) ScrollOption = { p:0.33, t:20 };
	if(typeof Target == "string") {
		if(S["spread-layout-direction"] == "rtl") Target = (Target == "head") ? "foot" : "head";
		var Point = (Target == "head") ? 0 : document.body["scroll" + S.SIZE.L] - document.body["client" + S.SIZE.L];
		sML.scrollTo((S["spread-layout-direction"] == "ttb" ? { y:Point } : { x:Point }), ScrollOption);
		return false;
	} else if(typeof Target.ItemIndex == "number") var TargetPage = Target.Pages[0], TargetItem = Target;
	  else if(typeof Target.PageIndex == "number") var TargetPage = Target,          TargetItem = Target.Item;
	var CurrentPage = R.getCurrent("page");
	if(S["book-display-mode"] != "all" && TargetItem != CurrentPage.Item) R.layout({ Reflash: false, NoLog: true }, TargetItem, [TargetPage.PageIndexInItem, TargetItem.Pages.length]);
	if(S["spread-layout-direction"] == "ttb") var TorL = ["Top", "Left"], tORl = ["top", "left"];
	else                                      var TorL = ["Left", "Top"], tORl = ["left", "top"];
	var E = TargetPage;
	var Point = E["offset" + TorL[0]];
	while(E.offsetParent) E = E.offsetParent, Point += E["offset" + TorL[0]];
	if(Hash) {
		var HashElement = TargetItem.contentDocument.getElementById(Hash), E = HashElement;
		var HashPoint = E["offset" + TorL[0]], HashPointO = E["offset" + TorL[1]];
		while(E.offsetParent) E = E.offsetParent, HashPoint += E["offset" + TorL[0]], HashPointO += E["offset" + TorL[1]];
		if(TargetItem.ColumnBreadth) {
			if(HashPointO == 0) {
				HashPoint = 0;
			} else if(S["page-progression-direction"] != "rtl") {
				HashPoint = (TargetItem.ColumnLength + TargetItem.ColumnGap) * Math.floor(HashPointO / TargetItem.ColumnBreadth) - (S["item-padding-" + S.BASE.b]);
			} else {
				HashPoint = (TargetItem.ColumnLength + TargetItem.ColumnGap) * Math.ceil( HashPointO / TargetItem.ColumnBreadth) - (S["item-padding-" + S.BASE.a]);
			}
			if(S["page-progression-direction"] == "rtl") HashPoint = TargetItem["offset" + S.SIZE.L] - HashPoint;
		} else {
			if(S["page-progression-direction"] == "rtl") HashPoint += HashElement["offset" + S.SIZE.L];
		}
		Point += S["item-padding-" + tORl[0]] + HashPoint;
	} else {
		if(S["page-progression-direction"] == "rtl") Point += TargetPage["offset" + S.SIZE.L];
	}
	if(S["page-progression-direction"] == "rtl") Point -= window["inner" + S.SIZE.L];
	sML.scrollTo((S["spread-layout-direction"] == "ttb" ? { y:Point } : { x:Point }), ScrollOption);
	return false;
}



R.page = function(bfPM) { // bfPM = "back" ? -1 : 1;
	var CurrentPage = R.getCurrent("page");
	var TargetPageIndex = CurrentPage.PageIndex + bfPM;
	if(bfPM < 0 && TargetPageIndex <                  0) return R.focus("head");
	if(bfPM > 0 && TargetPageIndex > R.Pages.length - 1) return R.focus("foot");
	var rlPM = (S["spread-layout-direction"] == "rtl") ? -1 : +1;
	var TargetPage = R.Pages[TargetPageIndex];
	var wCoord = sML.getCoord(window);
	if(S["book-display-mode"] != "all") {
		if(TargetPage.Item != CurrentPage.Item) {
			sML.log(TargetPage.PageIndexInItem, TargetPage.Item.Pages.length);
			return R.layout({ Reflash: false, NoLog: true }, TargetPage.Item, [TargetPage.PageIndexInItem, TargetPage.Item.Pages.length]);
		}
		if(bfPM > 0 && R.Items[CurrentPage.Item.ItemIndex + 1] && ((rlPM > 0 && wCoord[S.BASE.a] == document.body["scroll" + S.SIZE.L]) || (rlPM < 0 && wCoord[S.BASE.b] == 0))) {
			return R.layout({ Reflash: false, NoLog: true }, R.Items[CurrentPage.Item.ItemIndex + 1], [0, 1]);
		}
	}
	var CurrentPageCoord = sML.getCoord(CurrentPage), TargetPageCoord = sML.getCoord(TargetPage);
	if(bfPM < 0 && CurrentPageCoord[S.BASE.b] * rlPM <  wCoord[S.BASE.b] * rlPM) return R.focus(CurrentPage);
	if(bfPM > 0 && CurrentPageCoord[S.BASE.b] * rlPM  > wCoord[S.BASE.b] * rlPM && document.body["scroll" + S.SIZE.L] > window["inner" + S.SIZE.L]) return R.focus(CurrentPage);
	if(bfPM > 0 &&  TargetPageCoord[S.BASE.b] * rlPM <= wCoord[S.BASE.b] * rlPM) return ((R.Pages.length > TargetPage.PageIndex + 1) ? R.focus(R.Pages[TargetPage.PageIndex + 1]) : false);
	return R.focus(TargetPage);
}



R.move = function(bfPM) { // bfPM = "back" ? -1 : 1;
	var  rlPM = (S["spread-layout-direction"] == "rtl") ? -1 : +1;
	var dirPM = bfPM * rlPM;
	if(bfPM > 0) var Head = S.BASE.a, Foot = S.BASE.b, EndItemIndex = R.Items.length - 1;
	else         var Head = S.BASE.b, Foot = S.BASE.a, EndItemIndex = 0; // Head: Direction, Foot: Reversed
	var MoveParam = { p:0.8, t:8 };
	var CurrentItem = R.getCurrent("item"), AdjacentItem = R.Items[CurrentItem.ItemIndex + bfPM];
	var Pt = undefined, wCoord = sML.getCoord(window), CurrentItemSpreadCoord = sML.getCoord(CurrentItem.Spread);
	if((wCoord[Head]) * dirPM < (CurrentItemSpreadCoord[Head] + S["spread-separation"] / 2 * dirPM) * dirPM) {
	// ^ if Window-head has not passed Spread-head,
		if(wCoord[Foot] * dirPM < (CurrentItemSpreadCoord[Foot] - S["spread-separation"] / 2 * dirPM) * dirPM) {
		// ^ if Window-foot has not passed Spread-foot (= foot-side of Window has not entered in Spread)
			Pt = CurrentItemSpreadCoord[Foot] - S["spread-separation"] / 2 * dirPM - (dirPM < 0 ? wCoord[S.SIZE.l] : 0);
			// ^ Scroll to Spread-foot
		} else if((CurrentItemSpreadCoord[Head] - wCoord[Head]) * dirPM < wCoord[S.SIZE.l]) {
		// ^ if (Window-foot has passed Spread-foot, and) the distance to Spread-head is shorter than Window-length,
			Pt = CurrentItemSpreadCoord[Head] + S["spread-separation"] / 2 * dirPM - (dirPM > 0 ? wCoord[S.SIZE.l] : 0);
			// ^ Scroll to Spread-head
		} else {
		// ^ if (Window-foot has passed Spread-foot, and) the distance to Spread-head is longer than Window-length
			Pt = wCoord[Head]/* - S["spread-separation"] / 2 * dirPM*/ - (dirPM < 0 ? wCoord[S.SIZE.l] : 0);
			// ^ Scroll by Window-length
		}
		MoveParam = { p:0.3, t:30 };
	} else if((wCoord[S.BASE.m]) * dirPM < CurrentItemSpreadCoord[S.BASE.m] * dirPM) {
	// ^ if (Window-head has passed Spread-head, and) Window-center has not passed Spread-center
		Pt = CurrentItemSpreadCoord[S.BASE.m] - wCoord[S.SIZE.l] / 2;
		// ^ Scroll to Spread-center
	} else if(CurrentItem.ItemIndex == EndItemIndex) {
	// ^ if (Window-head has passed Spread-head, and Window-center has passed Spread-center, and) Spread is the end
		Pt = (dirPM > 0) ? (document.body["scroll" + S.SIZE.L] - wCoord[S.SIZE.l]) : 0;
		// ^ Scroll to the end of document.body
	} else {
	// ^ else. Switch to AdjacentItem
		var TargetItem = AdjacentItem;
		if(S["book-display-mode"] != "all") {
		// ^ if there's no need to scroll
			if(S["book-display-mode"] == "spread") {
				if(CurrentItem.Pair && CurrentItem.Pair == AdjacentItem && (AdjacentItem.ItemIndex + bfPM) * bfPM <= EndItemIndex * bfPM) TargetItem = R.Items[AdjacentItem.ItemIndex + bfPM];
				if(bfPM < 0 && TargetItem.Pair) TargetItem = TargetItem.Pair;
			}
			return sML.CSS.set(R.Contents, [
				"transition", "opacity 0.1s linear",
				"opacity", 0
			], function() {
				R.focus(TargetItem.Pages[(bfPM > 0 ? 0 : TargetItem.Pages.length - 1)]);
				setTimeout(function() { R.Contents.style.opacity = 1; }, 10);
			});
		}
		var TargetItemSpreadCoord = sML.getCoord(TargetItem.Spread);
		if(TargetItemSpreadCoord[S.SIZE.l] < wCoord[S.SIZE.l] && TargetItemSpreadCoord[S.BASE.m] > wCoord[S.BASE.m] * dirPM) {
			Pt = TargetItemSpreadCoord[S.BASE.m] - wCoord[S.SIZE.l] / 2;
		} else {
			Pt = TargetItemSpreadCoord[Foot] - S["spread-separation"] / 2 * dirPM - (dirPM < 0 ? wCoord[S.SIZE.l] : 0)
		}
	}
	if(typeof Pt != "undefined") {
		     if(document.body["scroll" + S.SIZE.L] - wCoord[S.SIZE.l] < Pt) Pt = document.body["scroll" + S.SIZE.L] - wCoord[S.SIZE.l];
		else if(Pt < 0)                                                          Pt = 0;
		Pt = (dirPM < 0) ? Math.floor(Pt) : Math.ceil(Pt);
		return sML.scrollTo((S["spread-layout-direction"] == "ttb" ? { y:Pt } : { x:Pt }), MoveParam);
	}
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- O

//----------------------------------------------------------------------------------------------------------------------------------------------



O.createNotifier = function() {

	N = {

		Opened: true, Closed: false,

		Perspective: 240, // px
		Translate: 240, // %
		Rotate: -48, // deg

		OpeningTransition: "0.4s ease-out",
		ClosingTransition: "0.4s ease-in",

		note: function(Note) {
			N.Message.innerHTML = Note;
		},

		switch: function(IO) {
			R.ControlPanel.Status = (typeof IO == "undefined") ? Math.abs(R.ControlPanel.Status - 1) : IO;
			sML[(R.ControlPanel.Status ? "add" : "remove") + "Class"](O.HTML, "control-panel-on");
			return R.ControlPanel.Status;
		},

		open: function(Cb) {
			if(!this.Closed) return this.close(function() { N.open(Cb); });
			this.Closed = false;
			N.Panel.style.zIndex = 100;
			sML.CSS.set(N.Panel, [
				"transition", N.OpeningTransition,
				"transform", [
					"perspective(" + N.Perspective + "px)",
					"translate" + S.XYPM.Y + "(0)",
					"translateZ(0)",
					"rotate" + S.XYPM.X + "(0)"
				].join(" "),
				"opacity", 0.75
			], function() {
				N.Message.style.opacity = 1;
				N.Opened = true;
				if(typeof Cb == "function") Cb();
			});
		},

		close: function(Cb) {
			if(!this.Opened) return;
			this.Opened = false;
			N.Message.style.opacity = 0;
			sML.CSS.set(N.Panel, [
				"transition", N.ClosingTransition,
				"transform", [
					"perspective(" + N.Perspective + "px)",
					"translate" + S.XYPM.Y + "(" + (S.XYPM.yP * N.Translate) + "%)",
					"translateZ(-100px)",
					"rotate" + S.XYPM.X + "(" + (S.XYPM.xP * N.Rotate) + "deg)"
				].join(" "),
				"opacity", 0
			], function() {
				sML.CSS.set(N.Panel, [
					"transition", "none",
					"transform", [
						"perspective(" + N.Perspective + "px)",
						"translate" + S.XYPM.Y + "(" + (S.XYPM.yM * N.Translate) + "%)",
						"translateZ(-100px)",
						"rotate" + S.XYPM.X + "(" + (S.XYPM.xM * N.Rotate) + "deg)"
					].join(" ")
				]);
				N.Panel.style.zIndex = 1;
				N.Closed = true;
				if(typeof Cb == "function") Cb();
			});
		}

	}

	N.Panel   = document.body.appendChild(sML.create("div", { id: "bibi-notifier-panel" }));
	N.Mark    =       N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-mark", className: "animate" }));
	N.Message =       N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-message", className: "animate" }));
	N.Powered =       N.Panel.appendChild(sML.create("p",   { id: "bibi-notifier-powered", innerHTML: O.getLogo({ Linkify: true }) }));
	for(var i = 1; i <= 8; i++) N.Mark.appendChild(sML.create("span", { className: "dot" + i }));

	// Drag & Drop
	if(window.File) {
		N.Panel.addEventListener("dragenter", function(e) { e.preventDefault(); document.body.style.opacity = 0.9; }, 1);
		N.Panel.addEventListener("dragover",  function(e) { e.preventDefault(); document.body.style.opacity = 0.9; }, 1);
		N.Panel.addEventListener("dragleave", function(e) { e.preventDefault(); document.body.style.opacity = 1.0; }, 1);
		N.Panel.addEventListener("drop",      function(e) { e.preventDefault(); document.body.style.opacity = 1.0;
			var BookFile = e.dataTransfer.files[0];
			if(!BookFile.size || BookFile.type != "application/epub+zip") {
				N.note('Give me <span style="color:rgb(128,128,128);">EPUB</span>. Drop into this window.');
			} else {
				O.log(2, 'Loading EPUB...');
				sML.addClass(N.Panel, "animate");
				var Book = BookFile.name;
				O.log(3, '"' + Book + '"');
				sML.setMembers(new FileReader(), {
					onerror : function() { document.body.style.opacity = 1.0; N.note('Error. Something trouble...'); },
					onload  : function() {
						var FR = this;
						O.log(2, 'Loaded.');
						R.initialize({
							Name: Book.replace(/\.epub$/, ""),
							Format: "EPUB",
							Zipped: true,
							Content: FR.result
						});
						R.Chain.start();
					}
				}).readAsBinaryString(BookFile);
			}
		}, 1);
	}

}



O.createControls = function() {

	// Shape
	C.Shape = {};
	C.Shape.Back    = '<span class="bibi-shape bibi-shape-back"></span>';
	C.Shape.Forward = '<span class="bibi-shape bibi-shape-forward"></span>';
	C.Shape.Item    = '<span class="bibi-shape bibi-shape-item"></span>';
	C.Shape.Spread  = '<span class="bibi-shape bibi-shape-spread">' + C.Shape.Item + C.Shape.Item + '</span>';
	C.Shape.All     = '<span class="bibi-shape bibi-shape-all">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';
	C.Shape.AllV    = '<span class="bibi-shape bibi-shape-all-vertical">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';
	C.Shape.AllH    = '<span class="bibi-shape bibi-shape-all-horizontal">' + C.Shape.Spread + C.Shape.Spread + C.Shape.Spread + '</span>';

	// Go
	C.Go         = document.body.appendChild(sML.create("div", { id: "bibi-control-go" }, [ "opacity", 0, "transition", "opacity 0.75s linear" ]));
	C.Go.Back    = C.Go.appendChild(sML.create("div", { className: "bibi-control-go", id: "bibi-control-go-back",    onclick: function() { R.page(-1); } }));
	C.Go.Forward = C.Go.appendChild(sML.create("div", { className: "bibi-control-go", id: "bibi-control-go-forward", onclick: function() { R.page(+1); } }));

	// Switch
	C.Switch = document.body.appendChild(
		sML.create("div", {
			id: "bibi-control-switch",
			Opened: false,
			onmouseover: function() {    sML.addClass(this, "bibi-control-switch-touching"); },
			onmouseout:  function() { sML.removeClass(this, "bibi-control-switch-touching"); }
		}, ["opacity", 0, "transition", "opacity 0.75s linear"])
	);
	C.Switch.toggleControlBar = function(CB) {
		var TranslateAxis = (S["spread-layout-direction"] == "ttb" ? "X" : "Y");
		if(!C.Switch.Opened) {
			sML.CSS.set(C.Bar, { transition: "0.2s ease-in" });
			sML.CSS.set(R.Contents, { transition: "0.2s ease-in" }, CB);
			sML.addClass(C.Bar,      "bibi-control-bar-opened");
			sML.addClass(C.Switch,   "bibi-control-bar-opened");
			sML.addClass(R.Contents, "bibi-control-bar-opened");
		} else {
			sML.CSS.set(C.Bar, { transition: "0.2s ease-out" });
			sML.CSS.set(R.Contents, { transition: "0.2s ease-out" }, CB);
			sML.removeClass(C.Bar,      "bibi-control-bar-opened");
			sML.removeClass(C.Switch,   "bibi-control-bar-opened");
			sML.removeClass(R.Contents, "bibi-control-bar-opened");
		}
		C.Switch.Opened = (!C.Switch.Opened);
	}
	C.Switch.onclick = C.Switch.toggleControlBar;

	// Bar
	C.Bar = document.body.appendChild(sML.create("div", { id: "bibi-control-bar" }));

	// Bar > Menus
	C.Menus = C.Bar.appendChild(sML.create("div", { id: "bibi-menus" }));
	C.Menus["move"] = C.Menus.appendChild(sML.create("menu", { id: "move" }));
	C.Menus["move"].Buttons = {
		"back": C.Menus["move"].appendChild(
			sML.create("li", { id: "move-back",
				innerHTML: '<span class="bibi-icon bibi-icon-back" title="移動：戻る">' + C.Shape.Back + '</span>',
				onclick: function() { R.page(-1); }
				//onclick: function() { R.move(-1); }
			})
		),
		"forward": C.Menus["move"].appendChild(
			sML.create("li", { id: "move-forward",
				innerHTML: '<span class="bibi-icon bibi-icon-forward" title="移動：進む">' + C.Shape.Forward + '</span>',
				onclick: function() { R.page(+1); }
				//onclick: function() { R.move(+1); }
			})
		)
	}
	C.Menus["book-display-mode"] = C.Menus.appendChild(sML.create("menu", { id: "book-display-mode" }));
	C.Menus["book-display-mode"].Buttons = {
		"all": C.Menus["book-display-mode"].appendChild(
			sML.create("li", { id: "display-all",
				innerHTML: '<span class="bibi-icon bibi-icon-all" title="表示：すべて">' + C.Shape.All + '</span>',
				onclick: function() { R.changeBookDisplayMode("all"); }
			})
		),
		"spread": C.Menus["book-display-mode"].appendChild(
			sML.create("li", { id: "display-spread",
				innerHTML: '<span class="bibi-icon bibi-icon-spread" title="表示：見開きごと">' + C.Shape.Spread + '</span>',
				onclick: function() { R.changeBookDisplayMode("spread"); }
			})
		),
		"item": C.Menus["book-display-mode"].appendChild(
			sML.create("li", { id: "display-item",
				innerHTML: '<span class="bibi-icon bibi-icon-item" title="表示：アイテムごと">' + C.Shape.Item   + '</span>',
				onclick: function() { R.changeBookDisplayMode("item"); }
			})
		)
	}
	C.Menus["spread-layout-direction"] = C.Menus.appendChild(sML.create("menu", { id: "spread-layout-direction" }));
	C.Menus["spread-layout-direction"].Buttons = {
		"vertical": C.Menus["spread-layout-direction"].appendChild(
			sML.create("li", { id: "spread-layout-vertical",
				innerHTML: '<span class="bibi-icon bibi-icon-vertical" title="見開きの配置方向：タテ">' + C.Shape.AllV + '</span>',
				onclick: function() { C.Switch.toggleControlBar(function() { R.changeSpreadLayoutDirection("ttb"); }); }
			})
		),
		"horizontal": C.Menus["spread-layout-direction"].appendChild(
			sML.create("li", { id: "spread-layout-horizontal",
				innerHTML: '<span class="bibi-icon bibi-icon-horizontal" title="見開きの配置方向：ヨコ">' + C.Shape.AllH + '</span>',
				onclick: function() { C.Switch.toggleControlBar(function() { R.changeSpreadLayoutDirection(S["page-progression-direction"]); }); }
			})
		)
	}

	// Bar > Misc
	C.Misc = C.Bar.appendChild(sML.create("div", { id: "bibi-misc", innerHTML: O.getLogo({ Linkify: true }) }));

	// Bar > Navigation
	C.Navigation      = C.Bar.appendChild(           sML.create("div", { id: "bibi-control-navigation" }));
	C.Navigation.Box  = C.Navigation.appendChild(    sML.create("div", { id: "bibi-control-navigation-box", onclick: function() { C.Switch.toggleControlBar(); } }));
	C.Navigation.Item = C.Navigation.Box.appendChild(sML.create("div", { id: "bibi-control-navigation-item" }));
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Utilities

//----------------------------------------------------------------------------------------------------------------------------------------------



O.getLogo = function(Settings) {
	return [
		'<span class="bibi-logo"' + (Settings.ID ? ' id="' + Settings.ID + '"' : '') + '>',
			(Settings.Linkify ? '<a href="' + I.WebSite + '" title="BiB/i | Web Site" target="_blank">' : ''),
				'<span class="bibi-type-B">B</span>',
				'<span class="bibi-type-i">i</span>',
				'<span class="bibi-type-B">B</span>',
				'<span class="bibi-type-slash">/</span>',
				'<span class="bibi-type-i">i</span>',
			(Settings.Linkify ? '</a>' : ''),
		'</span>'
	].join("");
}



O.log = function(Lv, Message) {
	if(Q.log == "false" || (parent && parent != window)) return;
	if(!Message || typeof Message != "string") return;
	status = 'BiB/i: ' + Message;
	if(O.statusClearer) clearTimeout(O.statusClearer);
	O.statusClearer = setTimeout(function() { status = defaultStatus; }, 4000);
	// if(Lv == 2) N.Message.innerHTML = Message;
	     if(Lv == 0) Message = "[ERROR] " + Message;
	else if(Lv == 1) Message = "---------------- " + Message + " ----------------";
	else if(Lv == 2) Message = Message;
	else if(Lv == 3) Message = " - " + Message;
	else if(Lv == 4) Message = " . " + Message;
	sML.log('BiB/i: ' + Message);
}



R.isBin = function(T) {
	return /\.(gif|jpe?g|png|ttf|otf|woff)$/i.test(T);
}



R.getPath = function() {
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



R.toBiBiXML = function(XML) {
	return XML.replace(
		/<\?[^>]*?\?>/g, ""
	).replace(
		/<([\w:\d]+) ([^>]+?)\/>/g, "<$1 $2></$1>"
	).replace(
		/<([^!\?\/ >]+)/g, "<bibi:$1"
	).replace(
		/<\/([^!\?\/ >]+)>/g, "</bibi:$1>"
	);
}



R.ContentTypeList = {
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

R.getDataURI = function(FilePath) {

	for(var ContentType in R.ContentTypeList) {
		if(R.ContentTypeList[ContentType].test(FilePath)) {
			return "data:" + ContentType + ";base64," + (R.isBin(FilePath) ? btoa(A.Files[FilePath]) : Base64.encode(A.Files[FilePath]));
		}
	}

	return "";

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ready?

//----------------------------------------------------------------------------------------------------------------------------------------------





sML.ready(O.start);




