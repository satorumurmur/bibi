Bibi.x({

    id: 'Unaccessibilizer',
    description: 'What a...',
    author: 'Satoru Matsushima (@satorumurmur)',
    version: '1.2.0'

})(function() {

    'use strict';

    const VPs = ['-webkit-', '-moz-', '-ms-', ''], unaccessibilize = (Item) => {
        if(this['select-elements'] == 'prevent') {
            VPs.forEach(Prefix => {
                ['user-select', 'user-drag'].forEach(Property => {
                    Item.Body.style[Prefix + Property] = 'none';
                });
            });
        }
        if(this['save-images'] == 'prevent') {
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
        if(this['use-contextmenu'] == 'prevent') {
            Item.contentDocument.addEventListener('contextmenu', O.preventDefault);
        }
    };

    E.bind('bibi:postprocessed-item', unaccessibilize);

});