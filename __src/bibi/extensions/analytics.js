Bibi.x({

    id: 'Analytics',
    description: 'Utilities for Tracking and Logging with Google Analytics.',
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '2.0.1'

})(function() {

    'use strict';

    if(typeof this['tracking-id'] != 'string' || !this['tracking-id']) return;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', this['tracking-id'], 'auto', { 'allowLinker': true });
    ga('require', 'linker'); 
    ga('linker:autoLink', (Hosts => S['trustworthy-origins'].reduce((Hosts, Origin) => Hosts.push(Origin.replace(/^\w+:\/\//, '')), []))());

    E.add('bibi:loaded-navigation', () => sML.forEach(I.Panel.BookInfo.Navigation.querySelectorAll('a'))(A => A.addEventListener('click', () => {
        ga('send', { hitType: 'event',
            eventCategory: `Bibi: Jumped by Navigation`,
            eventAction: B.Path,
            eventLabel: A.innerHTML.replace(/<[^>]*>/g, '') + ` - "${ A.getAttribute('data-bibi-original-href') }"`,
            eventValue: undefined
        });
    })));

    E.add('bibi:played:by-button', () => {
        ga('send', { hitType: 'event',
            eventCategory: `Bibi: Played by Button`,
            eventAction: B.Path,
            eventLabel: S['parent-uri'] ? `on: ` + S['parent-uri'].replace(/#.+$/, '') : '',
            eventValue: undefined
        });
    });

    E.add('bibi:scrolled', () => {
        if(R.Current.Percent != 100) return false;
        ga('send', { hitType: 'event',
            eventCategory: `Bibi: Read Through`,
            eventAction: B.Path,
            eventLabel: (Date.now() - Bibi.TimeOrigin),
            eventValue: undefined
        });
    });

});