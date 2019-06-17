import JSZip from "jszip/dist/jszip.min.js";
import JSZipUtils from "jszip-utils/dist/jszip-utils.min.js";

Bibi.x({

    id: "Unzipper",
    description: "Utilities for Zipped Books.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "2.1.0"

})(function() {

    'use strict';

    this.loadBookData = (BookData) => new Promise(resolve => {
        if(S["autostart"]) return resolve(BookData);
        I.Veil.Cover.Info.innerHTML = [
            '<strong>' + (O.Touch ? "Tap" : "Click") + ' to Open</strong>',
            '<small>' + B.Path.replace(/.*?([^\/]+)$/, "$1") + '</small>'
        ].join(" ");
        I.Veil.Cover.classList.add("without-cover-image", "waiting-for-unzipping");
        L.wait().then(() => resolve(BookData));
    })
    .then(makeArrayBuffer)
    .then(JSZip.loadAsync)
    .then(extractArchive);

    const makeArrayBuffer = (BookData) => new Promise((resolve, reject) => // resolve(ArrayBuffer)
        typeof BookData == "string" ? JSZipUtils.getBinaryContent(BookData, (Err, ABuf) => Err ? reject('Book File Is Not Found or Invalid.') : resolve(ABuf)) :
        BookData instanceof Blob    ? (() => { const FR = new FileReader(); FR.onerror = () => reject('Book Data Is Invalid.'); FR.onload = () => resolve(FR.result); FR.readAsArrayBuffer(BookData); })() :
        reject('Book Data Is Invalid.')
    );

    const extractArchive = (BookDataArchive) => new Promise((resolve, reject) => {
        if(I.Catcher) I.Catcher.style.opacity = 0;
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
        const FileTypesToBeCounted = {
            "Meta XML":   "xml|opf|ncx",
            "Meta YAML":  "ya?ml",
            "HTML":       "html?|xht(ml?)?",
            "SMIL":       "smil?",
            "PLS":        "pls",
            "CSS":        "css",
            "JavaScript": "js",
            "JSON":       "json",
            "SVG":        "svg",
            "Bitmap":     "gif|jpe?g|png",
            "Font":       "woff2?|otf|ttf",
            "Audio":      "aac|m4a|mp3|ogg",
            "Video":      "mp4|m4v|webm|ogv",
            "PDF":        "pdf",
            "Markdown":   "md",
            "PlainText":  "txt"
        };
        O.log('Extracting Book Data...', "<g:>");
        FilesToBeExtract.forEach(FileName => {
            if(FolderName) FileName = FileName.replace(FolderNameRE, "");
            BookDataArchive.file(FolderName + FileName).async(O.isBin(FileName) ? "binarystring" : "string").then(FileContent => {
                B.Files[FileName] = { Content: FileContent.trim() };
                if(FileTypesToBeCounted.length) {
                    for(const FileType in FileTypesToBeCounted) {
                        if(new RegExp("\\.(" + FileTypesToBeCounted[FileType] + ")$", "i").test(FileName)) {
                            if(!FileCount[FileType]) FileCount[FileType] = 1; else FileCount[FileType]++;
                            FileCount.Particular++;
                            break;
                        }
                    }
                }
                FileCount.All++;
                if(FileCount.All >= FilesToBeExtract.length) {
                    for(const FileType in FileTypesToBeCounted) {
                        const Count = FileCount[FileType];
                        if(Count) O.log(Count + ' ' + FileType + (Count > 1 ? 's' : ''));
                    }
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

});



