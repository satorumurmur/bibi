/*!
 *
 * # BiB/i Extension: Unzipper (core)
 *
 * - "EPUB-Zip Utility for BiB/i (core)"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

// requires: JSZip & base64.js

Bibi.x({

    name: "Unzipper",
    description: "EPUB-Zip Unarchiver for BiB/i",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    if(!window.File) return;

    O.ZippedEPUBAvailable = true;

    var CatcherLabel = "Drop me an EPUB file or click me...";

    C.Veil.Catcher = C.Veil.appendChild(
        sML.create("p", { id: "bibi-veil-catcher", title: CatcherLabel, innerHTML: '<span>' + CatcherLabel + '</span>' }, { display: "none" })
    );

    C.Veil.Catcher.addEventListener("click", function() {
        if(!this.Input) this.Input = this.appendChild(
            sML.create("input", { type: "file",
                onchange: function(Eve) {
                    L.loadBook(Eve.target.files[0]);
                }
            })
        );
        this.Input.click();
    });

    if(!O.Mobile) {
        document.body.addEventListener("dragenter", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; sML.addClass(O.HTML, "dragenter"); }, 1);
        document.body.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 0.9; }, 1);
        document.body.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0; sML.removeClass(O.HTML, "dragenter"); }, 1);
        document.body.addEventListener("drop",      function(Eve) { Eve.preventDefault(); O.Body.style.opacity = 1.0;
            L.loadBook(Eve.dataTransfer.files[0]);
        }, 1);
    }

});


B.dropOrClick = function() {
    C.Veil.Catcher.style.display = "block";
    C.note('Drop an EPUB file into this window. Or click and select EPUB file.');
};


B.loadZippedEPUB = function() {
    if(B.Online) {
        O.download(B.Path, "text/plain;charset=x-user-defined").then(function(XHR) {
            B.unzip(XHR.responseText);
            B.initialize.resolve();
        }).catch(function() {
            B.loadMimetype().then(function() {
                B.initialize.resolve();
            }).catch(function() {
                B.initialize.reject('EPUB Not Found.');
            });
        });
    } else {
        sML.edit(new FileReader(), {
            onload  : function() {
                B.unzip(this.result);
                B.initialize.resolve();
            },
            onerror : function() {
                O.Body.style.opacity = 1;
                B.initialize.reject('Error. Something trouble...');
            }
        }).readAsArrayBuffer(B.File);
        C.Veil.Catcher.style.opacity = 0;
    }
};


B.unzip = function(FileText) {

    O.log("Unzipping EPUB: " + B.Path + " ...", "*:");

    B.Files = {};
    var FileCount = { All: 0, HTMLs: 0, CSSs: 0, SVGs: 0, Images: 0, Fonts: 0, Audios: 0, Videos: 0, PDFs: 0, Etc: 0 };

    B.File = (new JSZip()).load(FileText);

    for(var FileName in B.File.files) {
        if(!B.isMustToBeIgnore(FileName) && B.File.files[FileName]._data) {
            FileCount.All++;
                 if(         /\.(x?html?)$/i.test(FileName)) FileCount.HTMLs++;
            else if(             /\.(css)$/i.test(FileName)) FileCount.CSSs++;
            else if(             /\.(svg)$/i.test(FileName)) FileCount.SVGs++;
            else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) FileCount.Images++;
            else if(    /\.(woff|otf|ttf)$/i.test(FileName)) FileCount.Fonts++;
            else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) FileCount.Audios++;
            else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) FileCount.Videos++;
            else if(             /\.(pdf)$/i.test(FileName)) FileCount.PDFs++;
            else                                             FileCount.Etc++;
            B.Files[FileName] = B.isBin(FileName) ? B.File.file(FileName).asBinary() : Base64.btou(B.File.file(FileName).asText());
        }
    }
    delete B.File;

    B.FileDigit = (FileCount.All + "").length;

    if(FileCount.All) {
        var FileNumbers =                              sML.String.pad(FileCount.All,    0, B.FileDigit) + ' File'  + (FileCount.All    >= 2 ? 's' : '');
        var FileNumbersBreakdown = [];
        if(FileCount.HTMLs)  FileNumbersBreakdown.push(sML.String.pad(FileCount.HTMLs,  0, B.FileDigit) + ' HTML'  + (FileCount.HTMLs  >= 2 ? 's' : ''));
        if(FileCount.CSSs)   FileNumbersBreakdown.push(sML.String.pad(FileCount.CSSs,   0, B.FileDigit) + ' CSS'   + (FileCount.CSSs   >= 2 ? 's' : ''));
        if(FileCount.SVGs)   FileNumbersBreakdown.push(sML.String.pad(FileCount.SVGs,   0, B.FileDigit) + ' SVG'   + (FileCount.SVGs   >= 2 ? 's' : ''));
        if(FileCount.Images) FileNumbersBreakdown.push(sML.String.pad(FileCount.Images, 0, B.FileDigit) + ' Image' + (FileCount.Images >= 2 ? 's' : ''));
        if(FileCount.Fonts)  FileNumbersBreakdown.push(sML.String.pad(FileCount.Fonts,  0, B.FileDigit) + ' Font'  + (FileCount.Fonts  >= 2 ? 's' : ''));
        if(FileCount.Audios) FileNumbersBreakdown.push(sML.String.pad(FileCount.Audios, 0, B.FileDigit) + ' Audio' + (FileCount.Audios >= 2 ? 's' : ''));
        if(FileCount.Videos) FileNumbersBreakdown.push(sML.String.pad(FileCount.Videos, 0, B.FileDigit) + ' Video' + (FileCount.Videos >= 2 ? 's' : ''));
        if(FileCount.PDFs)   FileNumbersBreakdown.push(sML.String.pad(FileCount.PDFs,   0, B.FileDigit) + ' PDF'   + (FileCount.PDFs   >= 2 ? 's' : ''));
        if(FileCount.Etc)    FileNumbersBreakdown.push(sML.String.pad(FileCount.Etc,    0, B.FileDigit) + ' etc.');
        if(FileNumbersBreakdown.length) FileNumbers += ' (' + FileNumbersBreakdown.join(', ') + ')';
        O.log(FileNumbers, "-*");
    }

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
    if(Preprocessed.CSS) O.log(sML.String.pad(Preprocessed.CSS, 0, B.FileDigit) + ' CSS' + (Preprocessed.CSS >= 2 ? "s" : "") + " Preprocessed.", "-*");

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
    if(Preprocessed.SVG) O.log(sML.String.pad(Preprocessed.SVG, 0, B.FileDigit) + ' SVG' + (Preprocessed.SVG >= 2 ? "s" : "") + " Preprocessed.", "-*");

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
    if(Preprocessed.HTML) O.log(sML.String.pad(Preprocessed.HTML, 0, B.FileDigit) + ' HTML' + (Preprocessed.HTML >= 2 ? "s" : "") + " Preprocessed.", "-*");

    O.log("EPUB Unzipped.", "/*");

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


B.isMustToBeIgnore = function(FileName) {
    if(/\.(git|svn|bundle|sass-cache)\//.test(FileName)) return true;
    if(/(\.(DS_Store|AppleDouble|LSOverride|Spotlight-V100|Trashes|gitignore)|Thumbs\.db|Gemfile(\.lock)?|config\.(rb|ru))$/.test(FileName)) return true;
    return false;
};


B.isBin = function(FileName) {
    if(/\.(gif|jpe?g|png|ttf|otf|woff|mp[g34]|m4[av]|ogg|webm|pdf)$/i.test(FileName)) return true;
    return false;
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