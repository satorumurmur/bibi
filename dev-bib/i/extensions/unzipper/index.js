/*!
 *                                                                                                                                (℠)
 *  # BiB/i Extension: Unzipper
 *
 *  * Copyright (c) Satoru MATSUSHIMA - https://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT license. - https://opensource.org/licenses/mit-license.php
 *
 *  * Including:
 *      - JSZip ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip (Dual licensed under the MIT license or the GPLv3 license.)
 *      - JSZipUtils ... Copyright (c) Stuart Knightley - https://stuk.github.io/jszip-utils (Dual licensed under the MIT license or the GPLv3 license.)
 *
 */

import JSZip from "jszip/dist/jszip.min.js";
import JSZipUtils from "jszip-utils/dist/jszip-utils.min.js";

Bibi.x({

    id: "Unzipper",
    description: "Utilities for Zipped Books.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "2.0.0"

})(function() {

    'use strict';

    this.loadBookData = BookData => {
        return new Promise((resolve, reject) => {
            this.loadBookData.start(BookData)
                .then((BookData)              => { return this.loadBookData.getArrayBuffer(BookData); })
                .then((ArrayBufferOfBookData) => { return JSZip.loadAsync(ArrayBufferOfBookData); })
                .then((BookDataArchive)       => { return this.loadBookData.extract(BookDataArchive); })
                .then(resolve)
                .catch(reject)
        });
    };

    this.loadBookData.start = BookData => {
        return new Promise(resolve => {
            if(S["autostart"]) {
                resolve(BookData);
            } else {
                I.Veil.Cover.Info.innerHTML = [
                    '<strong>' + (O.Touch ? "Tap" : "Click") + ' to Open</strong>',
                    '<small>' + B.Path.replace(/.*?([^\/]+)$/, "$1") + '</small>'
                ].join(" ");
                I.Veil.Cover.classList.add("without-cover-image", "waiting-for-unzipping");
                L.wait().then(() => resolve(BookData));
            }
        });
    };

    this.loadBookData.getArrayBuffer = BookData => {
        return new Promise((resolve, reject) => {
            if(typeof BookData == "string") {
                JSZipUtils.getBinaryContent(BookData, (Err, ArrayBufferOfBookData) => {
                    Err ? reject('Book File Is Not Found or Invalid.') : resolve(ArrayBufferOfBookData);
                });
            } else if(BookData instanceof Blob) {
                const BookDataLoader = new FileReader();
                BookDataLoader.onload  = () => resolve(this.result);
                BookDataLoader.onerror = () => reject('Book Data Is Invalid.');
                BookDataLoader.readAsArrayBuffer(BookData);
            } else {
                reject('Book Data Is Invalid.');
            }
        });
    };

    this.loadBookData.extract = BookDataArchive => {
        if(I.Catcher) I.Catcher.style.opacity = 0;
        return new Promise((resolve, reject) => {
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
                [B.Container.Path, B.Zine.Path].forEach(ToBeFound => {
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
            O.log('Extracting Book Data...', "<g:>");
            FilesToBeExtract.forEach(FileName => {
                if(FolderName) FileName = FileName.replace(FolderNameRE, "");
                BookDataArchive.file(FolderName + FileName).async(O.isBin(FileName) ? "binarystring" : "string").then(content => {
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
                        FileTypesToBeCounted.forEach(FileTypeToBeCounted => {
                            const Label = FileTypeToBeCounted[0], Count = FileCount[Label];
                            if(Count) O.log(Count + ' ' + Label + (Count > 1 ? 's' : ''));
                        });
                        if(FileCount.Particular < FileCount.All) {
                            const EtCCount = FileCount.All - FileCount.Particular;
                            O.log(EtCCount + ' ' + (EtCCount > 1 ? 'Others' : 'Another'));
                        }
                        O.log('Extracted. (' + FileCount.All + ' File' + (FileCount.All > 1 ? 's' : '') + ')', "</g>");
                        resolve();
                    }
                });
            });
        });
    };

});



