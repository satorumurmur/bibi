/*!
 *
 * # BiB/i Extension: C+ Pack
 *
 * - "Package of Additional Controls for BiB/i"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * ## Components:
 * 1. BiB/i Extension: C+ViewMenu
 * 2. BiB/i Extension: C+Fullscreen
 * 3. BiB/i Extension: C+Arrows
 * 4. BiB/i Extension: C+Keys
 * 5. BiB/i Extension: C+Messages
 */
/*!
 *
 * # BiB/i Extension: C+ViewMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+ViewMenu",description:"Menu Buttons to Change View Mode.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){if("fixed"!=S.view){var a={};a.Item='<span class="bibi-shape bibi-shape-item"></span>',a.Spread='<span class="bibi-shape bibi-shape-spread">'+a.Item+a.Item+"</span>",a.SpreadsS='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-single">'+a.Spread+"</span>",a.SpreadsV='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'+a.Spread+a.Spread+a.Spread+"</span>",a.SpreadsH='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">'+a.Spread+a.Spread+a.Spread+"</span>",C.addButton({Category:"menu",Group:"view",Labels:[{ja:"ページ表示",en:"Paged View"}],IconHTML:'<span class="bibi-icon bibi-icon-paged">'+a.SpreadsS+"</span>"},function(){C.Panel.toggle(function(){R.changeView("paged")})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"横スクロール表示",en:"Scroll View (Horizontal)"}],IconHTML:'<span class="bibi-icon bibi-icon-horizontal">'+a.SpreadsH+"</span>"},function(){C.Panel.toggle(function(){R.changeView("horizontal")})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"縦スクロール表示",en:"Scroll View (Vertical)"}],IconHTML:'<span class="bibi-icon bibi-icon-vertical">'+a.SpreadsV+"</span>"},function(){C.Panel.toggle(function(){R.changeView("vertical")})}),E.dispatch("bibi:createViewMenu")}}),/*!
 *
 * # BiB/i Extension: C+Fullscreen
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Fullscreen",description:"Floating Button for Switching Fullscreen.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){!O.WindowEmbedded&&O.FullscreenEnabled&&(C["switch"].Fullscreen=C.addButton({id:"bibi-switch-fullscreen",Category:"switch",Group:"fullscreen",Labels:[{ja:"フルスクリーンモードを開始",en:"Enter Fullscreen"},{ja:"フルスクリーンモードを終了",en:"Exit Fullscreen"}],IconHTML:'<span class="bibi-icon bibi-switch bibi-switch-fullscreen"></span>'},function(){sML.getFullscreenElement()?(sML.exitFullscreen(),C.setLabel(C["switch"].Fullscreen,0)):(sML.requestFullscreen(O.HTML),C.setLabel(C["switch"].Fullscreen,1))}),E.dispatch("bibi:createFullscreenSwitch"))}),/*!
 *
 * # BiB/i Extension: C+Arrows
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Arrows",description:"Floating Buttons for Scrolling and Page-Flipping",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.Arrows=O.Body.appendChild(sML.create("div",{id:"bibi-arrows"},{display:"hidden"==S.arrows?"none":""})),C.Arrows.Back=C.Arrows.appendChild(sML.create("div",{title:"Back",className:"bibi-arrow",id:"bibi-arrow-back",DistanceToMove:-1,isActive:function(){return R.CurrentPages.StartPage!=R.Pages[0]||100!=R.CurrentPages.StartPageRatio}})),C.Arrows.Forward=C.Arrows.appendChild(sML.create("div",{title:"Forward",className:"bibi-arrow",id:"bibi-arrow-forward",DistanceToMove:1,isActive:function(){return R.CurrentPages.EndPage!=R.Pages[R.Pages.length-1]||100!=R.CurrentPages.EndPageRatio}})),[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){a.addEventListener("mouseover",function(){a.isActive()&&sML.addClass(a,"flickering")}),a.addEventListener("mouseout",function(){sML.removeClass(a,"flickering")}),a.addEventListener("click",function(){return a.isActive()?(E.dispatch("bibi:command:move",a.DistanceToMove),sML.addClass(a,"firing"),a.Timer&&clearTimeout(a.Timer),void(a.Timer=setTimeout(function(){sML.removeClass(a,"firing")},400))):!1})}),C.Arrows.navigate=function(){setTimeout(function(){R.CurrentPages=R.getCurrentPages(),[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){a.isActive()&&sML.addClass(a,"glowing")}),setTimeout(function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){sML.removeClass(a,"glowing")})},1234)},420)},C.Arrows.check=function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(a){a.isActive()?sML.removeClass(a,"inactive"):sML.addClass(a,"inactive")})},E.add("bibi:start",C.Arrows.navigate),E.add("bibi:relayout",C.Arrows.navigate),E.add("bibi:scrolled",C.Arrows.check),E.dispatch("bibi:createArrows")}),/*!
 *
 * # BiB/i Extension: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Keys",description:"Listening Key Pressing.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.listenKeys=function(a){if(R.Started){a.preventDefault();var b=parent!=window&&parent.Bibi?parent:window;b.C.KeyCode=a.keyCode;var c=null;if("rtl"==S["page-progression-direction"])switch(a.keyCode){case 37:c=1;break;case 38:c=-1;break;case 39:c=-1;break;case 40:c=1}else switch(a.keyCode){case 37:c=-1;break;case 38:c=-1;break;case 39:c=1;break;case 40:c=1}c&&b.R.page(c)}},E.add("bibi:loadItem",function(a){a.contentWindow.addEventListener("keydown",C.listenKeys,!1)}),E.add("bibi:start",function(){O.SmartPhone||window.addEventListener("keydown",C.listenKeys,!1)})});