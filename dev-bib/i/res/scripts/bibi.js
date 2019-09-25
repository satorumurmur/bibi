import sML from 'sml.js'; self.sML = sML;
import * as _ from './bibi.heart.js'; for(const m in _) self[m] = _[m];

require('../styles/bibi.book.scss');

document.addEventListener('DOMContentLoaded', () => {
    if(!window.Promise) {
        const BibiScript = document.getElementById('bibi-script');
        return document.head.insertBefore(sML.create('script', { className: 'bibi-polyfill', src: './res/scripts/polyfills/bundle.js', onload: Bibi.hello }), BibiScript);
    }
    const Polyfills = [];
    if(!window.TextDecoder)          Polyfills.push('./res/scripts/polyfills/encoding.js');
    if(!window.IntersectionObserver) Polyfills.push('./res/scripts/polyfills/intersection-observer.js');
    if(Polyfills.length) {
        const Promises = [];
        const BibiScript = document.getElementById('bibi-script');
        Polyfills.forEach(Polyfill => Promises.push(new Promise(resolve => document.head.insertBefore(sML.create('script', { className: 'bibi-polyfill', src: Polyfill, onload: resolve }), BibiScript))));
        return Promise.all(Promises).then(Bibi.hello);
    }
    return Bibi.hello();
});