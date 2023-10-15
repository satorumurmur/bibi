'use strict';

/*! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 *
 *  # Bibi                                                                                                                                                                                  (℠)
 *
 */ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Bibi = { 'package': require('../package.json') };  module.exports = Bibi;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Object.assign(Bibi, {
    WebSiteURI: 'https://bibi.epub.link or https://github.com/satorumurmur/bibi',
    LicenseURI: 'https://github.com/satorumurmur/bibi/blob/master/LICENSE',
      ARCHIVES: '__archives',
          DIST: '__dist',
           SRC: '__src'
});

Bibi.Dresses = (Dresses => {
    const check = (Ds) => Ds instanceof Array ? Ds.filter(D => typeof D == 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_\-]*$/.test(D)) : [];
    Dresses[ 'ready-made'] = check(Dresses[ 'ready-made']);
    Dresses['custom-made'] = check(Dresses['custom-made']).filter(D => !Dresses['ready-made'].includes(D));
    return Dresses;
})(require('../' + Bibi.SRC + '/bibi/wardrobe/_dresses.js') || {});

Bibi.Arguments = (CurrentKey => process.argv.reduce((BibiArguments, ProcessArgument) => {
    ProcessArgument = String(ProcessArgument);
    const KeyMatched = ProcessArgument.match(/^\-+([\w\d_\-:]+)$/);
         if(KeyMatched) CurrentKey = KeyMatched[1], BibiArguments[CurrentKey] = true;
    else if(CurrentKey) BibiArguments[CurrentKey] = ProcessArgument, CurrentKey = '';
    return BibiArguments;
}, {}))('');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
