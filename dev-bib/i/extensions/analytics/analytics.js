/*!
 *
 * # BiB/i Extension: Analytics
 *
 * - "Track and Log"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "Analytics",
    description: "Track and Log",
    version: "0.1.0",
    build: 20151109.0000

})(function() {

    if(!S["google-analytics-tracking-id"]) return;

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', S["google-analytics-tracking-id"], 'auto', { 'allowLinker': true });
    ga('require', 'linker'); 
    ga('linker:autoLink', (function(Hosts) { S["trustworthy-origins"].forEach(function(Origin) { Hosts.push(Origin.replace(/^\w+:\/\//, "")); }); return Hosts; })([]));
    ga('send', 'pageview');

    E.bind("bibi:play:button", function() {
        ga('send', 'event', 'BiB/i: Play by Button', location.origin + location.pathname + location.search, "on: " + S["parent-uri"].replace(/#.+$/, ""));
    });

    E.bind("bibi:x:cplus:nombre:count", function() {
        if(C.Nombre.Percent != 100) return;
        ga('send', 'event', 'BiB/i: Read Through', location.origin + location.pathname + location.search, (Date.now() - O.TimeCard.Origin));
    });

});