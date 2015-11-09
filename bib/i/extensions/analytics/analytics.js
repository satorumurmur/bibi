/*!
 *
 * # BiB/i Extension: Analytics
 *
 * - "Track and Log"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"Analytics",description:"Track and Log",version:"0.1.0",build:20151109})(function(){S["google-analytics-tracking-id"]&&(!function(n,e,i,a,t,o,c){n.GoogleAnalyticsObject=t,n[t]=n[t]||function(){(n[t].q=n[t].q||[]).push(arguments)},n[t].l=1*new Date,o=e.createElement(i),c=e.getElementsByTagName(i)[0],o.async=1,o.src=a,c.parentNode.insertBefore(o,c)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create",S["google-analytics-tracking-id"],"auto",{allowLinker:!0}),ga("require","linker"),ga("linker:autoLink",function(n){return S["trustworthy-origins"].forEach(function(e){n.push(e.replace(/^\w+:\/\//,""))}),n}([])),ga("send","pageview"),E.bind("bibi:play:button",function(){ga("send","event","BiB/i: Play by Button",location.origin+location.pathname+location.search,"on: "+S["parent-uri"].replace(/#.+$/,""))}),E.bind("bibi:x:cplus:nombre:count",function(){100==C.Nombre.Percent&&ga("send","event","BiB/i: Read Through",location.origin+location.pathname+location.search,Date.now()-O.TimeCard.Origin)}))});