import jsyaml from 'js-yaml/dist/js-yaml.min.js';

Bibi.x({

    id: 'Zine',
    description: 'Utilities for BibiZine.',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.2.0'

})(function() {

    'use strict';

    this.loadZineData = () => this.setZineMode().then(this.openYAML).then(this.createPackageDocument).then(L.loadPackage.process);

    this.setZineMode = () => {
        delete B.Container;
        B.Package.Source = O.src(B.ZineData.Source);
        Object.defineProperty(B, 'ZineData', { get: () => B.Package });
        return Promise.resolve();
    };

    this.openYAML = () => O.file(B.ZineData.Source).then(() => jsyaml.safeLoad(B.ZineData.Source.Content));

    this.createPackageDocument = (YAML) => {
        const NS = {
            OPF: 'http://www.idpf.org/2007/opf',
             DC: 'http://purl.org/dc/elements/1.1/'
        };
        const Doc = document.implementation.createDocument(NS.OPF, 'package');
        // Package
        const Package = Doc.documentElement;
        Package.setAttribute('xmlns',    NS.OPF);
        Package.setAttribute('xmlns:dc', NS.DC);
        // Metadata
        const Metadata = Package.appendChild(document.createElementNS(NS.OPF, 'metadata'));
        ['identifier', 'language', 'title', 'creator', 'publisher'].forEach(Pro => {
            if(!YAML[Pro]) return;
            const Meta = Metadata.appendChild(document.createElementNS(NS.DC, 'dc:' + Pro));
            Meta.textContent = YAML[Pro];
        });
        ['rendition-layout', 'rendition-orientation', 'rendition-spread'].forEach(Pro => {
            if(!YAML[Pro]) return;
            const Meta = Metadata.appendChild(document.createElementNS(NS.OPF, 'meta'));
            Meta.setAttribute('property', Pro.replace('-', ':'));
            Meta.textContent = YAML[Pro];
        });
        // Manifest & Spine
        const Manifest = Package.appendChild(document.createElementNS(NS.OPF, 'manifest'));
        ['cover-image', 'nav'].forEach(Pro => {
            if(!YAML[Pro]) return;
            const Item = Manifest.appendChild(document.createElementNS(NS.OPF, 'item'));
            Item.setAttribute('id', Pro + '-item');
            Item.setAttribute('properties', Pro);
            Item.setAttribute('media-type', O.getContentType(YAML[Pro]));
            Item.setAttribute('href', YAML[Pro]);
        });
        const Spine = Package.appendChild(document.createElementNS(NS.OPF, 'spine'));
        if(YAML['page-progression-direction']) Spine.setAttribute('page-progression-direction', YAML['page-progression-direction']);
        YAML['spine'].forEach((ItemRefData, i) => {
            if(!ItemRefData) return;
            const ID = 'spine-item-' + (i + 1 + '').padStart(3, 0);
            const [Href, PageSpread] = ItemRefData.trim().replace(/\s+/, ' ').split(' ');
            const Item = Manifest.appendChild(document.createElementNS(NS.OPF, 'item'));
            Item.setAttribute('id', ID);
            Item.setAttribute('media-type', O.getContentType(Href));
            Item.setAttribute('href', Href);
            const ItemRef = Spine.appendChild(document.createElementNS(NS.OPF, 'itemref'));
            ItemRef.setAttribute('idref', ID);
            if(PageSpread) ItemRef.setAttribute('properties', 'page-spread-' + PageSpread);
        });
        return Promise.resolve(Doc);
    };

});

