Bibi.x({

    id: "Analytics",
    description: "Utilities for Tracking and Logging with Google Analytics.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.5.0"

})(function() {

    'use strict';

    if(typeof this["tracking-id"] != "string" || !this["tracking-id"]) return;

    const BookPath = location.origin + location.pathname + location.search;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', this["tracking-id"], 'auto', { 'allowLinker': true });
    ga('require', 'linker'); 
    ga('linker:autoLink', (Hosts => S["trustworthy-origins"].reduce((Hosts, Origin) => Hosts.push(Origin.replace(/^\w+:\/\//, "")), []))());

    E.add("bibi:loaded-navigation", () => O.forEach(I.Panel.BookInfo.Navigation.querySelectorAll("a"), A => A.addEventListener("click", () => ga('send', { hitType: 'event',
        eventCategory: 'BiB/i: Clicked Navigation',
        eventAction: BookPath,
        eventLabel: A.innerHTML.replace(/<[^>]*>/g, "") + ' - "' + A.getAttribute("data-bibi-original-href") + '"',
        eventValue: undefined
    }))));

    E.add("bibi:played:by-button", () => ga('send', { hitType: 'event',
        eventCategory: 'BiB/i: Played by Button',
        eventAction: BookPath,
        eventLabel: "on: " + S["parent-uri"].replace(/#.+$/, ""),
        eventValue: undefined
    }));

    E.add("bibi:scrolled", () => R.Current.Percent == 100 ? ga('send', { hitType: 'event',
        eventCategory: 'BiB/i: Read Through',
        eventAction: BookPath,
        eventLabel: (Date.now() - O.TimeCard.Origin),
        eventValue: undefined
   }) : false);

});