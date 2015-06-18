/*!
 *
 * # BiB/i Extention: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */

Bibi.x({

	name: "C+Keys",
	description: "Listening Key Pressing.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	C.listenKeys = function(E) {
		if(!R.Started) return;
		E.preventDefault();
		var Window = (parent != window && parent.Bibi) ? parent : window;
		Window.C.KeyCode = E.keyCode;
		var Dir = null; //                                                      W                          N                          E                          S
		if(S["page-progression-direction"] == "rtl") switch(E.keyCode) {  case 37: Dir = +1; break;  case 38: Dir = -1; break;  case 39: Dir = -1; break;  case 40: Dir = +1; break;  }
		else                                         switch(E.keyCode) {  case 37: Dir = -1; break;  case 38: Dir = -1; break;  case 39: Dir = +1; break;  case 40: Dir = +1; break;  }
		if(Dir) Window.R.page(Dir);
	};

	E.add("bibi:loadItem", function(Item) {
		Item.contentWindow.addEventListener("keydown", C.listenKeys, false);
	});

	E.add("bibi:start", function() {
		if(!O.SmartPhone) window.addEventListener("keydown", C.listenKeys, false);
	});

});