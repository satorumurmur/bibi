/*!
 *
 * # BiB/i Extension: Unzipper (core)
 *
 * - "EPUB-Zip Utility for BiB/i (core)"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */

// requires: JSZip & JSZipUtils

Bibi.x({

    name: "Unzipper",
    description: "EPUB-Zip Utility for BiB/i",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.3.0",
    build: Bibi["build"]

})(function() {

    X.Unzipper.loadBookData = function(PathOrData) {
        if(S["autostart"]) {
            X.Unzipper.loadBookData.fetch(PathOrData);
        } else {
            I.Veil.Cover.Info.innerHTML = [
                '<strong>' + (O.Mobile ? "Tap" : "Click") + ' to Open</strong>',
                '<small>' + B.Path.replace(/.*?([^\/]+)$/, "$1") + '</small>'
            ].join(" ");
            sML.addClass(I.Veil.Cover, "without-cover-image waiting-for-unzipping");
            L.wait().then(function() {
                X.Unzipper.loadBookData.fetch(PathOrData);
            });
        }
    };

    X.Unzipper.loadBookData.fetch = function(PathOrData) {
        if(PathOrData.Path) {
            new JSZip.external.Promise(function (resolve, reject) {
                JSZipUtils.getBinaryContent(PathOrData.Path, function(Err, BookDataBinary) {
                    Err ? reject(Err) : resolve(BookDataBinary);
                });
            }).then(function(BookDataBinary) {
                JSZip.loadAsync(BookDataBinary).then(X.Unzipper.loadBookData.extract);
            }).catch(function() {
                L.loadBook.reject('EPUB Not Found.');
            });
        } else if(PathOrData.Data) {
            var EPUBLoader = new FileReader();
            EPUBLoader.onload = function() {
                JSZip.loadAsync(this.result).then(X.Unzipper.loadBookData.extract);
            };
            EPUBLoader.onerror = function() {
                L.loadBook.reject('Something Troubled...');
            };
            EPUBLoader.readAsArrayBuffer(PathOrData.Data);
        }
    };

    X.Unzipper.loadBookData.extract = function(ZippedData) {
        return new Promise(function(resolve, reject) {
            O.log("Extracting EPUB: " + B.Path + " ...", "*:");
            I.Veil.Catcher.style.opacity = 0;
            var FileCount = { HTML: 0, CSS: 0, SVG: 0, Image: 0, Font: 0, Audio: 0, Video: 0, PDF: 0, Etc: 0, All: 0 };
            var FilesToBeExtract = [];
            for(var FileName in ZippedData.files) {
                if(
                    ZippedData.files[FileName].dir ||
                    !ZippedData.files[FileName]._data.compressedContent ||
                    /\.(git|svn|bundle|sass-cache)\/|(\.(DS_Store|AppleDouble|LSOverride|Spotlight-V100|Trashes|gitignore)|Thumbs\.db|Gemfile(\.lock)?|config\.(rb|ru))$/.test(FileName)
                ) continue;
                     if(         /\.(x?html?)$/i.test(FileName)) FileCount.HTML++;
                else if(             /\.(css)$/i.test(FileName)) FileCount.CSS++;
                else if(             /\.(svg)$/i.test(FileName)) FileCount.SVG++;
                else if(   /\.(gif|jpe?g|png)$/i.test(FileName)) FileCount.Image++;
                else if(    /\.(woff|otf|ttf)$/i.test(FileName)) FileCount.Font++;
                else if( /\.(m4a|aac|mp3|ogg)$/i.test(FileName)) FileCount.Audio++;
                else if(/\.(mp4|m4v|ogv|webm)$/i.test(FileName)) FileCount.Video++;
                else if(             /\.(pdf)$/i.test(FileName)) FileCount.PDF++;
                else                                             FileCount.Etc++;
                FilesToBeExtract.push(FileName);
            }
            if(!FilesToBeExtract.length) return reject();
            FileCount.All = FilesToBeExtract.length;
            B.FileDigit = (FileCount.All + "").length;
            var PartLog = [];
            if(FileCount.HTML)  PartLog.push(FileCount.HTML  + ' HTML'  + (FileCount.HTML  >= 2 ? 's' : ''));
            if(FileCount.CSS)   PartLog.push(FileCount.CSS   + ' CSS'   + (FileCount.CSS   >= 2 ? 's' : ''));
            if(FileCount.SVG)   PartLog.push(FileCount.SVG   + ' SVG'   + (FileCount.SVG   >= 2 ? 's' : ''));
            if(FileCount.Image) PartLog.push(FileCount.Image + ' Image' + (FileCount.Image >= 2 ? 's' : ''));
            if(FileCount.Font)  PartLog.push(FileCount.Font  + ' Font'  + (FileCount.Font  >= 2 ? 's' : ''));
            if(FileCount.Audio) PartLog.push(FileCount.Audio + ' Audio' + (FileCount.Audio >= 2 ? 's' : ''));
            if(FileCount.Video) PartLog.push(FileCount.Video + ' Video' + (FileCount.Video >= 2 ? 's' : ''));
            if(FileCount.PDF)   PartLog.push(FileCount.PDF   + ' PDF'   + (FileCount.PDF   >= 2 ? 's' : ''));
            if(FileCount.Etc)   PartLog.push(FileCount.Etc   + ' etc.');
            var Log =                        FileCount.All   + ' File'  + (FileCount.All   >= 2 ? 's' : '') + '.' + ' (' + PartLog.join(', ') + ')';
            new Promise(function(resolve, reject) {
                var FilesExtracted = 0;
                FilesToBeExtract.forEach(function(FileName) {
                    ZippedData.file(FileName).async(O.isBin(FileName) ? "binarystring" : "string").then(function(content) {
                        B.Files[FileName] = content.trim();
                        FilesExtracted++;
                        if(FilesExtracted >= FilesToBeExtract.length) resolve(Log);
                    });
                });
            }).then(function() {
                O.log('Extracted ' + Log, "-*");
                O.log("EPUB Extracted.", "/*");
                L.loadBook.resolve();
                sML.removeClass(O.HTML, "waiting-file");
            }).catch(reject);
        }).catch(function() {
            I.Veil.Catcher.style.opacity = "";
            L.loadBook.reject("EPUB Extracting Failed.");
        });
    };

    // Catcher
    var CatcherLabel = "<strong>Give Me an EPUB File!</strong> <span>Please Drop Me It.</span> <small>(or Click Me and Select)</small>";
    I.Veil.Catcher = I.Veil.appendChild(
        sML.create("p", { id: "bibi-veil-catcher", title: CatcherLabel.replace(/<[^>]+>/g, ""), innerHTML: '<span>' + CatcherLabel + '</span>' }, { display: "none" })
    );
    I.Veil.Catcher.addEventListener("click", function() {
        if(!this.Input) this.Input = this.appendChild(
            sML.create("input", { type: "file",
                onchange: function(Eve) {
                    L.loadBook({ Data: Eve.target.files[0] });
                }
            })
        );
        this.Input.click();
    });
    I.Veil.Catcher.dropOrClick = function() {
        sML.addClass(O.HTML, "waiting-file");
        I.Veil.Catcher.style.display = "block";
        I.note('Drop an EPUB file into this window. Or click and select an EPUB file.');
    };
    if(!O.Mobile) {
        I.Veil.Catcher.addEventListener("dragenter", function(Eve) { Eve.preventDefault();    sML.addClass(O.HTML, "dragenter"); }, 1);
        I.Veil.Catcher.addEventListener("dragover",  function(Eve) { Eve.preventDefault(); }, 1);
        I.Veil.Catcher.addEventListener("dragleave", function(Eve) { Eve.preventDefault(); sML.removeClass(O.HTML, "dragenter"); }, 1);
        I.Veil.Catcher.addEventListener("drop",      function(Eve) { Eve.preventDefault();
            L.loadBook({ Data: Eve.dataTransfer.files[0] });
        }, 1);
    }

});



