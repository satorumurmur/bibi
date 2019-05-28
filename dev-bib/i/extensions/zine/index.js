/*!
 *                                                                                                                                (℠)
 *  # BiB/i Extension: Zine
 *
 *  * Copyright (c) Satoru MATSUSHIMA - https://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  * Licensed under the MIT license. - https://opensource.org/licenses/mit-license.php
 *
 *  * Including:
 *      - JS-YAML ... Copyright (c) Vitaly Puzrin - http://nodeca.github.io/js-yaml (Licensed under the MIT license.)
 *
 */

import jsyaml from "js-yaml/dist/js-yaml.min.js";

Bibi.x({

    id: "Zine",
    description: "Utilities for BibiZine.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.1.0"

})(function() {

    'use strict';

    this.openYAML = Path => {
        return B.Unzipped ?
            O.download(B.Path + "/" +  Path)
                .then(XHR => jsyaml.safeLoad(XHR.responseText))
                .catch(XHR => O.error('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"'))
            :
            Promise.resolve()
                .then(() => jsyaml.safeLoad(B.Files[Path]));
    };

    this.loadZineData = () => {
        return this.openYAML(B.Zine.Path).then(this.processZineData).then(L.processPackage);
    };

    this.processZineData = Data => {
        const Doc = document.createElement("bibi:zine");
        // Metadata
        const Metadata = Doc.appendChild(document.createElement("metadata"));
        ["identifier", "title", "creator", "publisher", "language", "rendition-layout", "rendition-orientation", "rendition-spread"].forEach(Property => {
            if(!Data[Property]) return;
            const Meta = Metadata.appendChild(document.createElement("meta"));
            Meta.setAttribute("property", Property.replace("-", ":"));
            Meta.textContent = Data[Property];
        });
        // Manifest & Spine
        const Manifest = Doc.appendChild(document.createElement("manifest"));
        ["cover-image", "nav"].forEach(Property => {
            if(!Data[Property]) return;
            const Item = Manifest.appendChild(document.createElement("item"));
            Item.setAttribute("id", Property + "-item");
            Item.setAttribute("properties", Property);
            Item.setAttribute("href", Data[Property]);
        });
        const Spine = Doc.appendChild(document.createElement("spine"));
        if(Data["page-progression-direction"]) {
            Spine.setAttribute("page-progression-direction", Data["page-progression-direction"]);
        }
        Data.spine.forEach((ItemrefData, i) => {
            if(!ItemrefData) return;
            ItemrefData = ItemrefData.trim().replace(/\s+/, " ").split(" ");
            const ID = "spine-item-" + (i + 1 + "").padStart(3, 0);
            const Item = Manifest.appendChild(document.createElement("item"));
            Item.setAttribute("id", ID);
            Item.setAttribute("href", ItemrefData[0]);
            const Itemref = Spine.appendChild(document.createElement("itemref"));
            Itemref.setAttribute("idref", ID);
            if(ItemrefData[1]) {
                Itemref.setAttribute("properties", "page-spread-" + ItemrefData[1]);
            }
        });
        console.log(Doc);
        return Promise.resolve(Doc);
    };

});

