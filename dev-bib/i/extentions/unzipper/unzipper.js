/*!
 *
 * # BiB/i Extention: Unzipper
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

// requires: JSZip & base64.js

Bibi.x({

	name: "Unzipper",
	description: "Enables Zipped EPUBs.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	O.ZippedEPUBEnabled = true;

	if(!window.File) return;

	C.Veil.Catcher = C.Veil.appendChild(
		sML.create("p", { id: "bibi-veil-catcher", title: 'Drop me an EPUB! or Click me!' }, { display: "none" })
	);

	C.Veil.Catcher.addEventListener("click", function() {
		if(!this.Input) this.Input = this.appendChild(
			sML.create("input", { type: "file",
				onchange: function(Eve) {
					B.initialize({ File: Eve.target.files[0] });
					B.load();
				}
			})
		);
		this.Input.click();
	});

	if(!sML.OS.iOS && !sML.OS.Android) {
		document.body.addEventListener("dragenter", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; sML.addClass(O.HTML, "dragenter"); }, 1);
		document.body.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
		document.body.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0; sML.removeClass(O.HTML, "dragenter"); }, 1);
		document.body.addEventListener("drop",      function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0;
			B.initialize({ File: Eve.dataTransfer.files[0] });
			B.load();
		}, 1);
	}

});


B.dropOrClick = function() {
	if(O.WindowEmbedded) {
		C.Veil.Catcher.style.display = "block";
		C.Veil.Message.note('Drop an EPUB file into this window. Or click and select EPUB file.');
	} else {
		C.Veil.Catcher.style.display = "block";
		C.Veil.Message.note('Drop an EPUB file into this window. Or click and select EPUB file.');
	}
};


B.loadZippedEPUB = function() {
	O.log(2, 'Loading EPUB...', "Show");
	var onload = function(Loaded) {
		B.File = Loaded;
		B.unzip();
		O.log(2, 'EPUB Loaded.', "Show");
		B.open();
	};
	if(!B.Local) {
		// EPUB Zip (Online)
		O.log(3, B.Path);
		O.download(B.Path, "text/plain;charset=x-user-defined").then(function(XHR) { onload(XHR); });
	} else {
		// EPUB Zip (Local)
		O.log(3, "[Local] " + B.Path);
		sML.edit(new FileReader(), {
			onerror : function() { O.Body.style.opacity = 1; C.Veil.Message.note('Error. Something trouble...'); },
			onload  : function() { onload(this.result); }
		}).readAsArrayBuffer(B.File);
		C.Veil.Catcher.style.opacity = 0;
	}
};


B.unzip = function() {

	B.Files = {};
	var FileCount = { All: 0, HTML: 0, CSS: 0, SVG: 0, Bitmap: 0, Font: 0, Audio: 0, Video: 0, PDF: 0, Etcetra: 0 };

	B.File = (new JSZip()).load(B.File);
	for(var FileName in B.File.files) {
		if(B.File.files[FileName]._data) {
			FileCount.All++;
			     if(         /\.(x?html?)$/i.test(FileName)) FileCount.HTML++;
			else if(             /\.(css)$/i.test(FileName)) FileCount.CSS++;
			else if(             /\.(svg)$/i.test(FileName)) FileCount.SVG++;
			else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) FileCount.Bitmap++;
			else if(    /\.(woff|otf|ttf)$/i.test(FileName)) FileCount.Font++;
			else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) FileCount.Audio++;
			else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) FileCount.Video++;
			else if(             /\.(pdf)$/i.test(FileName)) FileCount.PDF++;
			else                                             FileCount.Etcetra++;
			B.Files[FileName] = B.isBin(FileName) ? B.File.file(FileName).asBinary() : Base64.btou(B.File.file(FileName).asText());
		}
	}
	delete B.File;

	B.FileDigit = (FileCount.All + "").length;

	if(FileCount.All)     O.log(3, sML.String.padZero(FileCount.All,     B.FileDigit) + ' File'   + (FileCount.All    >= 2 ? "s" : ""));
	if(FileCount.HTML)    O.log(4, sML.String.padZero(FileCount.HTML,    B.FileDigit) + ' HTML'   + (FileCount.HTML   >= 2 ? "s" : ""));
	if(FileCount.CSS)     O.log(4, sML.String.padZero(FileCount.CSS,     B.FileDigit) + ' CSS'    + (FileCount.CSS    >= 2 ? "s" : ""));
	if(FileCount.SVG)     O.log(4, sML.String.padZero(FileCount.SVG,     B.FileDigit) + ' SVG'    + (FileCount.SVG    >= 2 ? "s" : ""));
	if(FileCount.Bitmap)  O.log(4, sML.String.padZero(FileCount.Bitmap,  B.FileDigit) + ' Bitmap' + (FileCount.Bitmap >= 2 ? "s" : ""));
	if(FileCount.Font)    O.log(4, sML.String.padZero(FileCount.Font,    B.FileDigit) + ' Font'   + (FileCount.Font   >= 2 ? "s" : ""));
	if(FileCount.Audio)   O.log(4, sML.String.padZero(FileCount.Audio,   B.FileDigit) + ' Audio'  + (FileCount.Audio  >= 2 ? "s" : ""));
	if(FileCount.Video)   O.log(4, sML.String.padZero(FileCount.Video,   B.FileDigit) + ' Video'  + (FileCount.Video  >= 2 ? "s" : ""));
	if(FileCount.PDF)     O.log(4, sML.String.padZero(FileCount.PDF,     B.FileDigit) + ' PDF'    + (FileCount.PDF    >= 2 ? "s" : ""));
	if(FileCount.Etcetra) O.log(4, sML.String.padZero(FileCount.Etcetra, B.FileDigit) + ' etc.');

	var Preprocessed = { CSS: 0, SVG: 0, HTML: 0 };

	// CSS
	for(var FilePath in B.Files) {
		if(!/\.css$/.test(FilePath)) continue;
		B.Files[FilePath] = (function(FilePath) { var getImportedCSS = arguments.callee;
			if(!B.Files[FilePath]) return "";
			var RE = /@import[ \t]*(?:url\()?["']?(?!(?:https?|data):)(.+?)['"]?(?:\))?[ \t]*;/g;
			var Imports = B.Files[FilePath].match(RE);
			if(Imports) {
				sML.each(Imports, function() {
					var ImportPath = O.getPath(FilePath.replace(/[^\/]+$/, ""), this.replace(RE, "$1"));
					if(B.Files[ImportPath]) B.Files[FilePath] = B.Files[FilePath].replace(this, getImportedCSS(ImportPath));
				});
			}
			B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
				"url" : "gif|png|jpe?g|svg|ttf|otf|woff"
			}, function() {
				return /url\(["']?(?!(?:https?|data):)(.+?)['"]?\)/g;
			});
			return B.Files[FilePath];
		})(FilePath);
		Preprocessed.CSS++;
	}
	if(Preprocessed.CSS) O.log(3, sML.String.padZero(Preprocessed.CSS, B.FileDigit) + ' CSS' + (Preprocessed.CSS >= 2 ? "s" : "") + " Preprocessed.");

	// SVG
	for(var FilePath in B.Files) {
		if(!/\.svg$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js",
			"xlink:href" : "gif|png|jpe?g"
		});
		Preprocessed.SVG++;
	}
	if(Preprocessed.SVG) O.log(3, sML.String.padZero(Preprocessed.SVG, B.FileDigit) + ' SVG' + (Preprocessed.SVG >= 2 ? "s" : "") + " Preprocessed.");

	// HTML
	for(var FilePath in B.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"href"       : "css",
			"src"        : "gif|png|jpe?g|svg|js|mp[34]|m4[av]|webm",
			"xlink:href" : "gif|png|jpe?g"
		});
	}
	for(var FilePath in B.Files) {
		if(!/\.x?html?$/.test(FilePath)) continue;
		B.Files[FilePath] = B.replaceResourceRefferences(FilePath, {
			"src" : "x?html?"
		});
		Preprocessed.HTML++;
	}
	if(Preprocessed.HTML) O.log(3, sML.String.padZero(Preprocessed.HTML, B.FileDigit) + ' HTML' + (Preprocessed.HTML >= 2 ? "s" : "") + " Preprocessed.");

};


B.getDataURI = function(FilePath) {
	for(var ContentType in B.getDataURI.ContentTypeList) {
		if(B.getDataURI.ContentTypeList[ContentType].test(FilePath)) {
			return "data:" + ContentType + ";base64," + (B.isBin(FilePath) ? btoa(B.Files[FilePath]) : Base64.encode(B.Files[FilePath]));
		}
	}
	return "";
};

B.getDataURI.ContentTypeList = {
	"image/gif"             :   /\.gif$/i,
	"image/png"             :   /\.png$/i,
	"image/jpeg"            : /\.jpe?g$/i,
	"image/svg+xml"         :   /\.svg$/i,
	"video/mp4"             :   /\.mp4$/i,
	"video/webm"            :  /\.webm$/i,
	"audio/mpeg"            :   /\.mp3$/i,
	"audio/mp4"             :   /\.mp4$/i,
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


B.isBin = function(T) {
	return /\.(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(T);
};


B.replaceResourceRefferences = function(FilePath, ExtLists, getMatchRE) {
	if(typeof getMatchRE != "function") getMatchRE = function(At) { return (new RegExp('<\\??[a-zA-Z1-6:\-]+[^>]*? ' + At + '[ \t]*=[ \t]*[\'"](?!(?:https?|data):)([^"]+?)[\'"]', "g")); };
	var Source = B.Files[FilePath].replace(/[\r\n]/g, "\n").replace(/\r/g, "\n");
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
				if(ExtRE.test(ResFile) && typeof B.Files[ResFile] == "string") Source = Source.replace(this, this.replace(ResPathInSource, B.getDataURI(ResFile) + (ResHash ? "#" + ResHash : "")));
			});
		}
	}
	/*
	if(Shelter.length) for(var i = 0, L = Shelter.length; i < L; i++) Source = Source.replace('<bibi:ignored number="' + i + '" />', Shelter[i]);
	Source = Source.replace(/<bibi:lf \/>/g, "\n");
	*/
	return Source;
};