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
 * 2. BiB/i Extension: C+Arrows
 * 3. BiB/i Extension: C+Keys
 * 4. BiB/i Extension: C+Messages
 */
/*!
 *
 * # BiB/i Extension: C+ViewMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+ViewMenu",description:"Menu Buttons to Change View Mode.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){if(!S["reader-view-mode-fixed"]){var e={};e.Item='<span class="bibi-shape bibi-shape-item"></span>',e.Spread='<span class="bibi-shape bibi-shape-spread">'+e.Item+e.Item+"</span>",e.SpreadsP='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">'+e.Spread+e.Spread+e.Spread+"</span>",e.SpreadsH='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">'+e.Spread+e.Spread+e.Spread+"</span>",e.SpreadsV='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'+e.Spread+e.Spread+e.Spread+"</span>",C.addButton({Category:"panel-menus-alpha",Group:"view",Labels:[{ja:"ページ表示",en:"Paged View"}],IconHTML:'<span class="bibi-icon bibi-icon-paged">'+e.SpreadsP+"</span>"},function(){C.Panel.toggle(function(){R.changeView("paged")})}),C.addButton({Category:"panel-menus-alpha",Group:"view",Labels:[{ja:"横スクロール表示",en:"Scroll View (Horizontal)"}],IconHTML:'<span class="bibi-icon bibi-icon-horizontal">'+e.SpreadsH+"</span>"},function(){C.Panel.toggle(function(){R.changeView("horizontal")})}),C.addButton({Category:"panel-menus-alpha",Group:"view",Labels:[{ja:"縦スクロール表示",en:"Scroll View (Vertical)"}],IconHTML:'<span class="bibi-icon bibi-icon-vertical">'+e.SpreadsV+"</span>"},function(){C.Panel.toggle(function(){R.changeView("vertical")})}),E.dispatch("bibi:createViewMenu")}}),/*!
 *
 * # BiB/i Extension: C+Arrows
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Arrows",description:"Floating Buttons for Scrolling and Page-Flipping",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.Arrows=O.Body.appendChild(sML.create("div",{id:"bibi-arrows"},{display:"hidden"==S.arrows?"none":""})),C.Arrows.Back=C.Arrows.appendChild(sML.create("div",{title:"Back",className:"bibi-arrow",id:"bibi-arrow-back",DistanceToMove:-1,isActive:function(){return R.Current.Pages.StartPage!=R.Pages[0]||100!=R.Current.Pages.StartPageRatio}})),C.Arrows.Forward=C.Arrows.appendChild(sML.create("div",{title:"Forward",className:"bibi-arrow",id:"bibi-arrow-forward",DistanceToMove:1,isActive:function(){return R.Current.Pages.EndPage!=R.Pages[R.Pages.length-1]||100!=R.Current.Pages.EndPageRatio}})),[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){O.SmartPhone||(e.addEventListener("mouseover",function(){e.isActive()&&sML.addClass(e,"flickering")}),e.addEventListener("mouseout",function(){sML.removeClass(e,"flickering")})),e.addEventListener("click",function(){return e.isActive()?(E.dispatch("bibi:command:move",e.DistanceToMove),sML.addClass(e,"firing"),e.Timer&&clearTimeout(e.Timer),void(e.Timer=setTimeout(function(){sML.removeClass(e,"firing")},200))):!1})}),C.Arrows.navigate=function(){R.getCurrent(),C.Arrows.check(),setTimeout(function(){R.getCurrent(),[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){e.isActive()&&sML.addClass(e,"glowing")}),setTimeout(function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){sML.removeClass(e,"glowing")})},1234)},420)},C.Arrows.check=function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){e.isActive()?sML.removeClass(e,"inactive"):sML.addClass(e,"inactive")})},E.add("bibi:start",C.Arrows.navigate),E.add("bibi:relayout",C.Arrows.navigate),E.add("bibi:scrolled",C.Arrows.check),E.dispatch("bibi:createArrows")}),/*!
 *
 * # BiB/i Extension: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Keys",description:"Listening Key Pressing.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.listenKeys=function(e){if(R.Started){e.preventDefault();var i=window.Bibi&&window.O&&window.C?window:parent;i.C.KeyCode=e.keyCode;var a=null;if("rtl"==S["page-progression-direction"])switch(e.keyCode){case 37:a=1;break;case 38:a=-1;break;case 39:a=-1;break;case 40:a=1}else switch(e.keyCode){case 37:a=-1;break;case 38:a=-1;break;case 39:a=1;break;case 40:a=1}a&&i.R.page(a)}},E.add("bibi:loadItem",function(e){e.contentWindow.addEventListener("keydown",C.listenKeys,!1)}),E.add("bibi:start",function(){O.SmartPhone||window.addEventListener("keydown",C.listenKeys,!1)})});