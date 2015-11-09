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
Bibi.x({name:"C+ViewMenu",description:"Menu Buttons to Change View Mode.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){if("fixed"!=S.view){var e={};e.Item='<span class="bibi-shape bibi-shape-item"></span>',e.Spread='<span class="bibi-shape bibi-shape-spread">'+e.Item+e.Item+"</span>",e.SpreadsS='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-single">'+e.Spread+"</span>",e.SpreadsV='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'+e.Spread+e.Spread+e.Spread+"</span>",e.SpreadsH='<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">'+e.Spread+e.Spread+e.Spread+"</span>",C.addButton({Category:"menu",Group:"view",Labels:[{ja:"ページ表示",en:"Paged View"}],IconHTML:'<span class="bibi-icon bibi-icon-paged">'+e.SpreadsS+"</span>"},function(){C.Panel.toggle(function(){R.changeView("paged")})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"横スクロール表示",en:"Scroll View (Horizontal)"}],IconHTML:'<span class="bibi-icon bibi-icon-horizontal">'+e.SpreadsH+"</span>"},function(){C.Panel.toggle(function(){R.changeView("horizontal")})}),C.addButton({Category:"menu",Group:"view",Labels:[{ja:"縦スクロール表示",en:"Scroll View (Vertical)"}],IconHTML:'<span class="bibi-icon bibi-icon-vertical">'+e.SpreadsV+"</span>"},function(){C.Panel.toggle(function(){R.changeView("vertical")})}),E.dispatch("bibi:createViewMenu")}}),/*!
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
Bibi.x({name:"C+Arrows",description:"Floating Buttons for Scrolling and Page-Flipping",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.Arrows=O.Body.appendChild(sML.create("div",{id:"bibi-arrows"},{display:"hidden"==S.arrows?"none":""})),C.Arrows.Back=C.Arrows.appendChild(sML.create("div",{title:"Back",className:"bibi-arrow",id:"bibi-arrow-back",DistanceToMove:-1,isActive:function(){return R.CurrentPages.StartPage!=R.Pages[0]||100!=R.CurrentPages.StartPageRatio}})),C.Arrows.Forward=C.Arrows.appendChild(sML.create("div",{title:"Forward",className:"bibi-arrow",id:"bibi-arrow-forward",DistanceToMove:1,isActive:function(){return R.CurrentPages.EndPage!=R.Pages[R.Pages.length-1]||100!=R.CurrentPages.EndPageRatio}})),[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){O.SmartPhone||(e.addEventListener("mouseover",function(){e.isActive()&&sML.addClass(e,"flickering")}),e.addEventListener("mouseout",function(){sML.removeClass(e,"flickering")})),e.addEventListener("click",function(){return e.isActive()?(E.dispatch("bibi:command:move",e.DistanceToMove),sML.addClass(e,"firing"),e.Timer&&clearTimeout(e.Timer),void(e.Timer=setTimeout(function(){sML.removeClass(e,"firing")},200))):!1})}),C.Arrows.navigate=function(){R.CurrentPages=R.getCurrentPages(),C.Arrows.check(),setTimeout(function(){R.CurrentPages=R.getCurrentPages(),[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){e.isActive()&&sML.addClass(e,"glowing")}),setTimeout(function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){sML.removeClass(e,"glowing")})},1234)},420)},C.Arrows.check=function(){[C.Arrows.Back,C.Arrows.Forward].forEach(function(e){e.isActive()?sML.removeClass(e,"inactive"):sML.addClass(e,"inactive")})},E.add("bibi:start",C.Arrows.navigate),E.add("bibi:relayout",C.Arrows.navigate),E.add("bibi:scrolled",C.Arrows.check),E.dispatch("bibi:createArrows")}),/*!
 *
 * # BiB/i Extension: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Keys",description:"Listening Key Pressing.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.listenKeys=function(e){if(R.Started){e.preventDefault();var i=parent!=window&&parent.Bibi?parent:window;i.C.KeyCode=e.keyCode;var r=null;if("rtl"==S["page-progression-direction"])switch(e.keyCode){case 37:r=1;break;case 38:r=-1;break;case 39:r=-1;break;case 40:r=1}else switch(e.keyCode){case 37:r=-1;break;case 38:r=-1;break;case 39:r=1;break;case 40:r=1}r&&i.R.page(r)}},E.add("bibi:loadItem",function(e){e.contentWindow.addEventListener("keydown",C.listenKeys,!1)}),E.add("bibi:start",function(){O.SmartPhone||window.addEventListener("keydown",C.listenKeys,!1)})}),/*!
 *
 * # BiB/i Extension: C+Messages
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
/*!
 *
 * # BiB/i Extension: C+Nombre
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
Bibi.x({name:"C+Nombre",description:"Show Nombre and Percent.",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build})(function(){C.Nombre=O.Body.appendChild(sML.create("div",{id:"bibi-nombre",count:function(){this.Current=R.CurrentPages.EndPage.PageIndex+1,this.Percent=Math.round((R.CurrentPages.EndPage.PageIndex+1)/R.Pages.length*100),E.dispatch("bibi:x:cplus:nombre:count")},flick:function(){clearTimeout(C.Nombre.Timer_vanish),clearTimeout(C.Nombre.Timer_transparentize),setTimeout(function(){sML.removeClass(C.Nombre,"vanished")},0),setTimeout(function(){sML.removeClass(C.Nombre,"transparentized")},10),C.Nombre.Timer_transparentize=setTimeout(function(){sML.addClass(C.Nombre,"transparentized")},1981),C.Nombre.Timer_vanish=setTimeout(function(){sML.addClass(C.Nombre,"vanished")},2236),C.Nombre.innerHTML=['<span id="bibi-nombre-current">'+this.Current+"</span>",'<span id="bibi-nombre-delimiter">/</span>','<span id="bibi-nombre-total">'+R.Pages.length+"</span>",'<span id="bibi-nombre-percent">('+this.Percent+"%)</span>"].join(" "),E.dispatch("bibi:x:cplus:nombre:flick")}})),E.add("bibi:scrolled",function(){C.Nombre.count(),C.Nombre.flick()})});