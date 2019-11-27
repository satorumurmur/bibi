const RangeLoader = new (require('bibi-zip-loader'))({ url: S['book'], worker: document.currentScript.src.replace(/\.js$/, '.bibi-zip-loader.worker.js') });

Bibi.x({

    id: 'Extractor_on-the-fly',
    description: 'Utilities for Zipped Books. (Method: on-the-fly)',
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '1.0.0'

})(function() {

    O.RangeLoader = RangeLoader;

});
