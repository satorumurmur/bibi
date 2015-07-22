/*!
 *
 * # BiB/i Extension: C+Keys
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */
/*
Bibi.x({

	name: "C+Messages",
	description: "Observing Posted Message.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	C.listenMessage = function(E) {
		return false;
	};

	E.add("bibi:start", function() {
		if(O.WindowEmbedded) window.addEventListener("message", C.listenMessage, false);
	});

});*/