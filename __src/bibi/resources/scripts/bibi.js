import sML from 'sml.js'; self.sML = sML;
import * as _ from './bibi.heart.js'; for(const m in _) self[m] = _[m];

require('./bibi.book.scss');

document.addEventListener('DOMContentLoaded', Bibi.ring);
