/*!
 *
 *  # BiB/i Extension: Zine (core)
 *
 *  - "Zine Utility for BiB/i (core)"
 *  - Copyright (c) Satoru MATSUSHIMA - https://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  - Licensed under the MIT license. - https://opensource.org/licenses/mit-license.php
 *
 */

Bibi.x({

    name: "Zine",
    description: "Zine Utility for BiB/i",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.0.0",
    build: Bibi["build"]

})(function() {

    'use strict';

    X.Zine.openYAML = function(Path) {
        if(B.Unzipped) {
            return O.download(B.Path + "/" +  Path).then(function(XHR) {
                return jsyaml.load(XHR.responseText);
            }).catch(function(XHR) {
                O.error('XHR HTTP status: ' + XHR.status + ' "' + XHR.responseURL + '"');
            });
        } else {
            return Promise.resolve().then(function() {
                return jsyaml.load(B.Files[Path]);
            });
        }
    };

    X.Zine.loadZineData = function() {
        return X.Zine.openYAML(B.Zine.Path).then(X.Zine.processZineData).then(L.processPackageDocument);
    };

    X.Zine.processZineData = function(Data) {
        const Doc = document.createElement("bibi:zine");
        // Metadata
        const Metadata = Doc.appendChild(document.createElement("metadata"));
        ["identifier", "title", "creator", "publisher", "language", "rendition-layout", "rendition-orientation", "rendition-spread"].forEach(function(Property) {
            if(!Data[Property]) return;
            const Meta = Metadata.appendChild(document.createElement("meta"));
            Meta.setAttribute("property", Property.replace("-", ":"));
            Meta.textContent = Data[Property];
        });
        // Manifest & Spine
        const Manifest = Doc.appendChild(document.createElement("manifest"));
        ["cover-image", "nav"].forEach(function(Property) {
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
        Data.spine.forEach(function(ItemrefData, i) {
            if(!ItemrefData) return;
            ItemrefData = ItemrefData.trim().replace(/\s+/, " ").split(" ");
            const ID = "spine-item-" + sML.String.pad(i + 1, 0, 3);
            const Item = Manifest.appendChild(document.createElement("item"));
            Item.setAttribute("id", ID);
            Item.setAttribute("href", ItemrefData[0]);
            const Itemref = Spine.appendChild(document.createElement("itemref"));
            Itemref.setAttribute("idref", ID);
            if(ItemrefData[1]) {
                Itemref.setAttribute("properties", "page-spread-" + ItemrefData[1]);
            }
        });
        return Promise.resolve(Doc);
    };

});

