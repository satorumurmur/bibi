import jsyaml from 'js-yaml/dist/js-yaml.min.js';

Bibi.x({

    id: 'Zine',
    description: 'Utilities for BibiZine.',
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '1.1.1'

})(function() {

    'use strict';

    B.ZineData = { Path: 'zine.yaml', Dir: '' };

    this.loadZineData = () => this.openYAML(B.ZineData.Path).then(this.processZineData).then(L.loadPackage.process);

    this.openYAML = (Path) => O.file(Path).then(jsyaml.safeLoad);

    this.processZineData = (Data) => {
        sML.edit(B.Package, B.ZineData);
        const Doc = document.createElement('bibi:zine');
        // Metadata
        const Metadata = Doc.appendChild(document.createElement('metadata'));
        ['identifier', 'title', 'creator', 'publisher', 'language', 'rendition-layout', 'rendition-orientation', 'rendition-spread'].forEach(Pro => {
            if(!Data[Pro]) return;
            const Meta = Metadata.appendChild(document.createElement('meta'));
            Meta.setAttribute('property', Pro.replace('-', ':'));
            Meta.textContent = Data[Pro];
        });
        // Manifest & Spine
        const Manifest = Doc.appendChild(document.createElement('manifest'));
        ['cover-image', 'nav'].forEach(Pro => {
            if(!Data[Pro]) return;
            const Item = Manifest.appendChild(document.createElement('item'));
            Item.setAttribute('id', Pro + '-item');
            Item.setAttribute('properties', Pro);
            Item.setAttribute('href', Data[Pro]);
        });
        const Spine = Doc.appendChild(document.createElement('spine'));
        if(Data['page-progression-direction']) Spine.setAttribute('page-progression-direction', Data['page-progression-direction']);
        Data['spine'].forEach((ItemrefData, i) => {
            if(!ItemrefData) return;
            ItemrefData = ItemrefData.trim().replace(/\s+/, ' ').split(' ');
            const ID = 'spine-item-' + (i + 1 + '').padStart(3, 0);
            const Item = Manifest.appendChild(document.createElement('item'));
            Item.setAttribute('id', ID);
            Item.setAttribute('href', ItemrefData[0]);
            const Itemref = Spine.appendChild(document.createElement('itemref'));
            Itemref.setAttribute('idref', ID);
            if(ItemrefData[1]) Itemref.setAttribute('properties', 'page-spread-' + ItemrefData[1]);
        });
        return Promise.resolve(Doc);
    };

});

