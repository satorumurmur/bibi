import sML from 'sml.js'; self.sML = sML;
import * as _ from './bibi.heart.js'; for(const m in _) self[m] = _[m];

require('./bibi.book.scss');

document.addEventListener('DOMContentLoaded', () => {
    Bibi.Script = document.getElementById('bibi-script');
    Bibi.Style  = document.getElementById('bibi-style');
    (_ => {
        if(!window.Promise) return document.head.insertBefore(sML.create('script', { className: 'bibi-polyfill', src: Bibi.Script.src.split('?')[0].replace(/\/bibi\.js$/, '/polyfills/bundle.js'), onload: _ }), Bibi.Script);
        const Polyfills = [], PolyfillsPath = new URL('./polyfills', Bibi.Script.src).href;
        if(!window.TextDecoder)          Polyfills.push(PolyfillsPath + '/encoding.js');
        if(!window.IntersectionObserver) Polyfills.push(PolyfillsPath + '/intersection-observer.js');
        if(!Polyfills.length) return _();
        const Promises = [];
        Polyfills.forEach(Polyfill => Promises.push(new Promise(resolve => document.head.insertBefore(sML.create('script', { className: 'bibi-polyfill', src: Polyfill, onload: resolve }), Bibi.Script))));
        Promise.all(Promises).then(_);
    })(() => Bibi.ring());
});
