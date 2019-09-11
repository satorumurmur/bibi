import sML from 'sml.js'; self.sML = sML;
import * as _ from './bibi.heart.js'; for(const m in _) self[m] = _[m];

require('../styles/bibi.book.scss');

document.addEventListener('DOMContentLoaded',
    (sML.UA.Trident || sML.UA.EdgeHTML)
        ? () => document.head.insertBefore(sML.create('script', { id: 'bibi-polyfills', src: './res/scripts/bibi.polyfills.js', onload: Bibi.hello }), document.getElementById('bibi-script'))
        : Bibi.hello
);