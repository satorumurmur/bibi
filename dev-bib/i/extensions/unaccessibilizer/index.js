Bibi.x({

    id: 'Unaccessibilizer',
    description: 'What a...',
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '0.3.2'

})(function() {

    'use strict';

    const VPs = ['-webkit-', '-moz-', '-ms-', ''], unaccessibilize = (Item) => {
        if(this['select-elements']) {
            VPs.forEach(Prefix => {
                ['user-select', 'user-drag'].forEach(Property => {
                    Item.Body.style[Prefix + Property] = 'none';
                });
            });
        }
        if(this['save-images']) {
            sML.forEach(Item.Body.querySelectorAll('img, svg, image'))(Img => {
                VPs.forEach(Prefix => {
                    ['user-select', 'user-drag'].forEach(Property => {
                        Img.style[Prefix + Property] = 'none';
                    });
                    if(O.Touch) Img.style[Prefix + 'pointer-events'] = 'none';
                });
                Img.draggable = false;
                Img.addEventListener('contextmenu', O.preventDefault);
            });
        }
        if(this['use-contextmenu']) {
            Item.contentDocument.addEventListener('contextmenu', O.preventDefault);
        }
    };
    unaccessibilize(O), E.bind('bibi:postprocessed-item', unaccessibilize);

});