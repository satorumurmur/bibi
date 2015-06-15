/*!
 *
 * # BiB/i Extention: C+ Pack | Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi | Licensed under the MIT license.
 *
 * ## Including:
 * 1. dev-bib/i/extentions/cplus/cplus.viewmenu.js   - C+ViewMenu
 * 2. dev-bib/i/extentions/cplus/cplus.fullscreen.js - C+Fullscreen
 * 3. dev-bib/i/extentions/cplus/cplus.arrow.js      - C+Arrows
 * 4. dev-bib/i/extentions/cplus/cplus.keys.js       - C+Keys
 * 5. dev-bib/i/extentions/cplus/cplus.messages.js   - C+Messages
 *
 */
/*!
 *
 * # BiB/i Extention: C+ViewMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */
Bibi.x({name:"C+ViewMenu",description:"Menu Buttons to Change View Mode.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){if("fixed"!=S.view){var a={};a.Item='<span class="bibi-shape bibi-shape-item"></span>',a.Spread='<span class="bibi-shape bibi-shape-spread">'+a.Item+a.Item+"</span>",a.SpreadsS='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-single">'+a.Spread+"</span>",a.SpreadsV='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'+a.Spread+a.Spread+a.Spread+"</span>",a.SpreadsH='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">'+a.Spread+a.Spread+a.Spread+"</span>",C.addButton({Category:"menu",Group:"view",Labels:[{ja:"ページ表示",en:"Paged View"}],IconHTML:'<span class="bibi-icon bibi-icon-each">'+a.SpreadsS+"</span>"},function(){C.Cartain.toggle(function(){R.changeView({View:"paged"})})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"横スクロール表示",en:"Scroll View (Horizontal)"}],IconHTML:'<span class="bibi-icon bibi-icon-horizontal">'+a.SpreadsH+"</span>"},function(){C.Cartain.toggle(function(){R.changeView({View:"scroll",Axis:"horizontal"})})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"縦スクロール表示",en:"Scroll View (Vertical)"}],IconHTML:'<span class="bibi-icon bibi-icon-vertical">'+a.SpreadsV+"</span>"},function(){C.Cartain.toggle(function(){R.changeView({View:"scroll",Axis:"vertical"})})}),E.dispatch("bibi:createViewMenu")}}),/*!
 *
 * # BiB/i Extention: C+Fullscreen
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */
Bibi.x({name:"C+Fullscreen",description:"Floating Button for Switching Fullscreen.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){!O.WindowEmbedded&&O.FullscreenEnabled&&(C["switch"].Fullscreen=C.addButton({id:"bibi-switch-fullscreen",Category:"switch",Group:"fullscreen",Labels:[{ja:"フルスクリーンモードを開始",en:"Enter Fullscreen"},{ja:"フルスクリーンモードを終了",en:"Exit Fullscreen"}],IconHTML:'<span class="bibi-icon bibi-switch bibi-switch-fullscreen"></span>'},function(){sML.getFullscreenElement()?(sML.exitFullscreen(),C.setLabel(C["switch"].Fullscreen,0)):(sML.requestFullscreen(O.HTML),C.setLabel(C["switch"].Fullscreen,1))}),E.dispatch("bibi:createFullscreenSwitch"))}),/*!
 *
 * # BiB/i Extention: C+Arrows
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */
Bibi.x({name:"C+Arrows",description:"Floating Buttons for Scrolling and Page Flipping",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.Arrows=R.Content.appendChild(sML.create("div",{id:"bibi-arrows"},{display:"hidden"==S.arrows?"none":""})),C.Arrows.Back=C.Arrows.appendChild(sML.create("div",{title:"Back",className:"bibi-arrow",id:"bibi-arrow-back",DistanceToMove:-1})),C.Arrows.Forward=C.Arrows.appendChild(sML.create("div",{title:"Forward",className:"bibi-arrow",id:"bibi-arrow-forward",DistanceToMove:1})),[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){a.addEventListener("mouseover",function(){a.Timer_tap&&clearTimeout(a.Timer_tap),sML.addClass(a,"shown")}),a.addEventListener("mouseout",function(){sML.removeClass(a,"shown")}),sML.addTouchEventObserver(a).addTouchEventListener("tap",function(){E.dispatch("bibi:command:move",a.DistanceToMove),sML.addClass(a,"shown"),a.Timer_tap&&clearTimeout(a.Timer_tap),a.Timer_tap=setTimeout(function(){sML.removeClass(a,"shown")},500)})}),E.add("bibi:start",function(){S.To&&sML.style(C.Arrows.Back,{opacity:1}),sML.style(C.Arrows.Forward,{opacity:1}),setTimeout(function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){sML.style(a,{opacity:""})})},500)}),E.dispatch("bibi:createArrows")}),/*!
 *
 * # BiB/i Extention: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */
Bibi.x({name:"C+Keys",description:"Listening Key Pressing.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.listenKeys=function(a){if(R.Started){a.preventDefault();var b=parent!=window&&parent.Bibi?parent:window;b.C.KeyCode=a.keyCode;var c=null;if("rtl"==S["page-progression-direction"])switch(a.keyCode){case 37:c=1;break;case 38:c=-1;break;case 39:c=-1;break;case 40:c=1}else switch(a.keyCode){case 37:c=-1;break;case 38:c=-1;break;case 39:c=1;break;case 40:c=1}c&&b.R.page(c)}},E.add("bibi:postprocessItem",function(a){a.contentWindow.addEventListener("keydown",C.listenKeys,!1)}),E.add("bibi:start",function(){O.SmartPhone||window.addEventListener("keydown",C.listenKeys,!1)})});