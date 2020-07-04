import JSZip from 'jszip/dist/jszip.min.js';
import JSZipUtils from 'jszip-utils/dist/jszip-utils.min.js';

Bibi.x({

    id: 'Extractor_at-once',
    description: 'Utilities for Zipped Books. (Method: at-once)',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.2.0'

})(function() {

    'use strict';

    O.loadZippedBookData = (BookData) => new Promise(resolve => {
        if(S['autostart']) return resolve(BookData);
        I.Veil.Cover.Info.innerHTML = [
            `<strong>${ O.Touch ? 'Tap' : 'Click' } to Open</strong>`,
            `<small>${ B.Path.replace(/.*?([^\/]+)$/, '$1') }</small>`
        ].join(' ');
        I.Veil.Cover.classList.add('without-cover-image', 'waiting-for-unzipping');
        I.Veil.Cover.appendChild(I.getBookIcon());
        L.wait().then(() => resolve(BookData));
    })
    .then(load)
    .then(extract);

    const load = (BookData) => new Promise((resolve, reject) => // resolve(ArrayBuffer)
        typeof BookData == 'string' ? JSZipUtils.getBinaryContent(BookData, (Err, ABuf) => Err ? reject(Bibi.ErrorMessages.NotFound) : resolve(ABuf)) :
        BookData.size && BookData.type ? (() => { const FR = new FileReader(); FR.onerror = () => reject(Bibi.ErrorMessages.DataInvalid); FR.onload = () => resolve(FR.result); FR.readAsArrayBuffer(BookData); })() :
        reject(Bibi.ErrorMessages.DataInvalid)
    ).then(ArrayBuffer => JSZip.loadAsync(ArrayBuffer).catch(Err => Promise.reject(Bibi.ErrorMessages.DataInvalid)));

    const extract = (BookDataArchive) => new Promise((resolve, reject) => {
        if(I.Catcher.Input) I.Catcher.style.opacity = 0;
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
        if(!FilesToBeExtract.length) return reject(Bibi.ErrorMessages.DataInvalid);
        let FolderName = '', FolderNameRE = undefined;
        const PathsToBeChecked = [];
        if(B.Type != 'Zine') PathsToBeChecked.push(B.Container.Source.Path); // EPUB or unknown.
        if(B.Type != 'EPUB') PathsToBeChecked.push( B.ZineData.Source.Path); // Zine or unknown.
        if(!PathsToBeChecked.filter(PathToBeChecked => FilesToBeExtract.includes(PathToBeChecked)).length) {
            PathsToBeChecked.forEach(PathToBeChecked => {
                if(!PathToBeChecked) return;
                if(FolderName) return;
                const RE = new RegExp('^(.+?\\/)' +  PathToBeChecked.replace(/\//g, '\\/').replace(/\./g, '\\.') + '$');
                for(let l = FilesToBeExtract.length, i = 0; i < l; i++) {
                    const FileName = FilesToBeExtract[i];
                    if(RE.test(FileName)) {
                        FolderName = FileName.replace(RE, '$1');
                        FolderNameRE = new RegExp('^' + FolderName.replace(/\//g, '\\/').replace(/\./g, '\\.'));
                        break;
                    }
                }
            });
        }
        let RootFileFound = false;
             if(B.Type) RootFileFound = FilesToBeExtract.includes(FolderName + PathsToBeChecked[0]);
        else if(FilesToBeExtract.includes(FolderName + B.Container.Source.Path)) B.Type = 'EPUB', RootFileFound = true;
        else if(FilesToBeExtract.includes(FolderName +  B.ZineData.Source.Path)) B.Type = 'Zine', RootFileFound = true;
        if(!RootFileFound) return reject(`${ B.Type ? (B.Type == 'EPUB' ? B.Container.Source.Path : B.ZineData.Source.Path).split('/').slice(-1)[0] : '' } Not Contained`);
        const FileCount = { Particular: 0 };
        const FileTypesToBeCounted = {
            'Meta XML':   'xml|opf|ncx',
            'Meta YAML':  'ya?ml',
            'HTML':       'html?|xht(ml?)?',
            'SMIL':       'smil?',
            'PLS':        'pls',
            'CSS':        'css',
            'JavaScript': 'js',
            'JSON':       'json',
            'SVG':        'svg',
            'Bitmap':     'gif|jpe?g|png',
            'Font':       'woff2?|otf|ttf',
            'Audio':      'aac|m4a|mp3|ogg',
            'Video':      'mp4|m4v|webm|ogv',
            'PDF':        'pdf',
            'Markdown':   'md',
            'PlainText':  'txt'
        };
        O.log(`Extracting Book Data...`, '<g:>');
        const Promises = [];
        FilesToBeExtract.forEach(FileName => {
            if(FolderNameRE) FileName = FileName.replace(FolderNameRE, '');
            const IsBin = O.isBin({ Path: FileName });
            Promises.push(
                BookDataArchive.file(FolderName + FileName).async(IsBin ? 'blob' : 'string').then(FileContent => {
                    B.Package.Manifest[FileName] = IsBin ?
                        { Path: FileName, DataType: 'Blob', Content: FileContent } :
                        { Path: FileName, DataType: 'Text', Content: FileContent.trim() };
                    for(const FileType in FileTypesToBeCounted) {
                        if(new RegExp('\\.(' + FileTypesToBeCounted[FileType] + ')$', 'i').test(FileName)) {
                            if(!FileCount[FileType]) FileCount[FileType] = 1; else FileCount[FileType]++;
                            FileCount.Particular++;
                            break;
                        }
                    }
                })
            );
        });
        Promise.all(Promises).then(() => {
            const Total = Promises.length;
            for(const FileType in FileTypesToBeCounted) {
                const Count = FileCount[FileType];
                if(Count) O.log(`${ Count } ${ FileType }${ Count > 1 ? 's' : '' }`);
            }
            if(FileCount.Particular < Total) {
                const Count_Others = Total - FileCount.Particular;
                O.log(`${ Count_Others } ${ Count_Others > 1 ? 'Others' : 'Another' }`);
            }
            O.log(`Extracted. (${ Total } File${ Total > 1 ? 's' : '' })`, '</g>');
            resolve();
        });
    });

});



