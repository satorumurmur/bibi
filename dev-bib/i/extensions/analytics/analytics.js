/*!
 *
 * # BiB/i Extension: Analytics
 *
 * - "Track and Log. Powered by Google Analytics."
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "Analytics",
    description: "Track and Log",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    var BookPath = location.origin + location.pathname + location.search;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', S["extensions"]["analytics"]["setting"], 'auto', { 'allowLinker': true });
    ga('require', 'linker'); 
    ga('linker:autoLink', (function(Hosts) {
        S["trustworthy-origins"].forEach(function(Origin) {
            Hosts.push(Origin.replace(/^\w+:\/\//, ""));
        });
        return Hosts;
    })([]));

    E.add("bibi:createNavigation", function() {
        sML.each(C.Panel.BookInfo.Navigation.querySelectorAll("a"), function() {
            this.addEventListener("click", function() {
                ga('send', { hitType: 'event',
                    eventCategory: 'BiB/i: Navigation Clicked',
                    eventAction: BookPath,
                    eventLabel: this.innerHTML.replace(/<[^>]*>/g, "") + ' - "' + this.getAttribute("data-bibi-original-href") + '"',
                    eventValue: undefined
                });
            });
        });
    });

    E.add("bibi:play:button", function() {
        ga('send', { hitType: 'event',
            eventCategory: 'BiB/i: Play by Button',
            eventAction: BookPath,
            eventLabel: "on: " + S["parent-uri"].replace(/#.+$/, ""),
            eventValue: undefined
        });
    });

    E.add("bibi:scrolled", function() {
        if(R.Current.Percent == 100) {
            ga('send', { hitType: 'event',
                eventCategory: 'BiB/i: Read Through',
                eventAction: BookPath,
                eventLabel: (Date.now() - O.TimeCard.Origin),
                eventValue: undefined
           });
       }
    });

});