/*!
 *
 * # BiB/i Extension: Unzipper (core)
 *
 * - "Unzipping Utility for BiB/i (core)"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */

// requires: JSZip & JSZipUtils

Bibi.x({

    name: "Unzipper",
    description: "Unzipping Utility for BiB/i",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.5.0",
    build: Bibi["build"]

})(function() {

    'use strict';

    X.Unzipper.loadBookData = function(BookData) {
        return new Promise(function(resolve, reject) {
            X.Unzipper.loadBookData.start(BookData).then(function(BookData) {
                return X.Unzipper.loadBookData.getArrayBuffer(BookData);
            }).then(function(ArrayBufferOfBookData) {
                return JSZip.loadAsync(ArrayBufferOfBookData);
            }).then(function(BookDataArchive) {
                if(I.Catcher) I.Catcher.style.opacity = 0;
                return X.Unzipper.loadBookData.extract(BookDataArchive);
            }).then(function(Log) {
                O.log("Book Data Extracted" + (Log ? ' ' + Log : '') + '.');
                resolve();
            }).catch(function(ErrorMessage) {
                reject(ErrorMessage);
            })
        });
    };

    X.Unzipper.loadBookData.start = function(BookData) {
        return new Promise(function(resolve) {
            if(S["autostart"]) {
                resolve(BookData);
            } else {
                I.Veil.Cover.Info.innerHTML = [
                    '<strong>' + (O.Touch ? "Tap" : "Click") + ' to Open</strong>',
                    '<small>' + B.Path.replace(/.*?([^\/]+)$/, "$1") + '</small>'
                ].join(" ");
                sML.addClass(I.Veil.Cover, "without-cover-image waiting-for-unzipping");
                L.wait().then(function() {
                    resolve(BookData);
                });
            }
        });
    };

    X.Unzipper.loadBookData.getArrayBuffer = function(BookData) {
        return new Promise(function(resolve, reject) {
            if(typeof BookData == "string") {
                JSZipUtils.getBinaryContent(BookData, function(Err, ArrayBufferOfBookData) {
                    Err ? reject('Book File Is Not Found or Invalid.') : resolve(ArrayBufferOfBookData);
                });
            } else if(BookData instanceof Blob) {
                const BookDataLoader = new FileReader();
                BookDataLoader.onload  = function() { resolve(this.result); };
                BookDataLoader.onerror = function() { reject('Book Data Is Invalid.'); };
                BookDataLoader.readAsArrayBuffer(BookData);
            } else {
                reject('Book Data Is Invalid.');
            }
        });
    };

    X.Unzipper.loadBookData.extract = function(BookDataArchive) {
        return new Promise(function(resolve, reject) {
            const FilesToBeExtract = [];
            for(let FileName in BookDataArchive.files) {
                if(
                    BookDataArchive.files[FileName].dir ||
                    /(^|\/)\./.test(FileName) ||
                    /\.(db|php|p[lm]|cgi|r[bu])(\/|$)/i.test(FileName) ||
                    /^mimetype$/i.test(FileName) ||
                    !BookDataArchive.files[FileName]._data.compressedContent
                ) {
                    delete BookDataArchive.files[FileName];
                    continue;
                }
                FilesToBeExtract.push(FileName);
            }
            if(!FilesToBeExtract.length) return reject('Does Not Contain Any Resources');
            let FolderName = "", FolderNameRE = undefined;
            if(!FilesToBeExtract.includes(B.Container.Path) && !FilesToBeExtract.includes(B.Zine.Path)) {
                [B.Container.Path, B.Zine.Path].forEach(function(ToBeFound) {
                    if(FolderName) return;
                    const RE = new RegExp("^(.+?\\/)" + ToBeFound.replace(/\//g, "\\/").replace(/\./g, "\\.") + "$");
                    for(let l = FilesToBeExtract.length, i = 0; i < l; i++) {
                        const FileName = FilesToBeExtract[i];
                        if(RE.test(FileName)) {
                            FolderName = FileName.replace(RE, "$1");
                            FolderNameRE = new RegExp("^" + FolderName.replace(/\//g, "\\/").replace(/\./g, "\\."));
                            break;
                        }
                    }
                });
            }
            if(FilesToBeExtract.includes(FolderName + B.Container.Path)) {
                if(!S["book-type"]) S["book-type"] = "EPUB";
                else if(S["book-type"] == "Zine") reject({ BookTypeError: 'It Seems to Be an EPUB. Not a Zine.' });
            } else if(FilesToBeExtract.includes(FolderName + B.Zine.Path)) {
                if(!S["book-type"]) S["book-type"] = "Zine";
                else if(S["book-type"] == "EPUB") reject({ BookTypeError: 'It Seems to Be a Zine. Not an EPUB.' });
            } else {
                reject('Required Metafile Is Not Contained.');
            }
            const FileCount = { All: 0, Particular: 0 };
            const FileTypesToBeCounted = [
                ["Meta XML",   "xml|opf|ncx"],
                ["Meta YAML",  "ya?ml"],
                ["HTML",       "html?|xht(ml?)?"],
                ["SMIL",       "smil?"],
                ["PLS",        "pls"],
                ["CSS",        "css"],
                ["JavaScript", "js"],
                ["JSON",       "json"],
                ["SVG",        "svg"],
                ["Bitmap",     "gif|jpe?g|png"],
                ["Font",       "woff2?|otf|ttf"],
                ["Audio",      "aac|m4a|mp3|ogg"],
                ["Video",      "mp4|m4v|webm|ogv"],
                ["PDF",        "pdf"],
                ["Markdown",   "md"],
                ["PlainText",  "txt"]
            ];
            FilesToBeExtract.forEach(function(FileName) {
                if(FolderName) FileName = FileName.replace(FolderNameRE, "");
                BookDataArchive.file(FolderName + FileName).async(O.isBin(FileName) ? "binarystring" : "string").then(function(content) {
                    B.Files[FileName] = content.trim();
                    if(S["book-type"] == "Zine" && !B.Package.Manifest.Files[FileName]) B.Package.Manifest.Files[FileName] = {};
                    if(FileTypesToBeCounted.length) {
                        for(let Counted = false, l = FileTypesToBeCounted.length, i = 0; i < l; i++) {
                            const Label = FileTypesToBeCounted[i][0], REFragment = FileTypesToBeCounted[i][1];
                            if(new RegExp("\\.(" + FileTypesToBeCounted[i][1] + ")$", "i").test(FileName)) {
                                if(FileCount[Label]) FileCount[Label]++; else FileCount[Label] = 1;
                                FileCount.Particular++;
                                break;
                            }
                        }
                    }
                    FileCount.All++;
                    if(FileCount.All >= FilesToBeExtract.length) {
                        const PartLog = [];
                        FileTypesToBeCounted.forEach(function(FileTypeToBeCounted) {
                            const Label = FileTypeToBeCounted[0], Count = FileCount[Label];
                            if(Count) PartLog.push(Count + ' ' + Label + (Count >= 2 ? 's' : ''));
                        });
                        if(PartLog.length && FileCount.Particular < FileCount.All) {
                            const EtCCount = FileCount.All - FileCount.Particular;
                            PartLog.push(EtCCount + ' ' + (EtCCount >= 2 ? 'Others' : 'Another'));
                        }
                        resolve('(' + (PartLog.length != 1 ? FileCount.All + ' Resources' + (PartLog.length > 1 ? ' = ' : '') : '') + PartLog.join(' + ') + ')');
                    }
                });
            });
        });
    };

});



