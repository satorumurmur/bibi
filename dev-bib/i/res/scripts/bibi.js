import sML from 'sml.js'; self.sML = sML;
import * as _ from './bibi.heart.js'; for(const m in _) self[m] = _[m];

document.addEventListener('DOMContentLoaded',
    (sML.UA.InternetExplorer || (sML.UA.Edge && !sML.UA.Chromium))
        ? () => document.head.insertBefore(sML.create('script', { id: 'bibi-polyfills', src: './res/scripts/bibi.polyfills.js', onload: Bibi.hello }), document.getElementById('bibi-script'))
        : Bibi.hello
);