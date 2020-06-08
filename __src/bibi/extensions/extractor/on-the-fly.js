const RangeLoader = new (require('./on-the-fly.bibi-zip-loader.js'))({ url: S['book'], worker: document.currentScript.src.replace(/\.js$/, '.bibi-zip-loader.worker' + (sML.UA.Trident ? '.alt' : '') + '.js') });

Bibi.x({

    id: 'Extractor_on-the-fly',
    description: 'Utilities for Zipped Books. (Method: on-the-fly)',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.2.0'

})(function() {

    O.RangeLoader = RangeLoader;

});
