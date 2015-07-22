/*!
 *
 * # BiB/i Extension: C+Fullscreen
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

	name: "C+Fullscreen",
	description: "Floating Button for Switching Fullscreen.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	if(O.WindowEmbedded || !O.FullscreenEnabled) return;

	C["switch"].Fullscreen = C.addButton({
		id: "bibi-switch-fullscreen",
		Category: "switch",
		Group: "fullscreen",
		Labels: [
			{ ja: 'フルスクリーンモードを開始', en: 'Enter Fullscreen' },
			{ ja: 'フルスクリーンモードを終了', en:  'Exit Fullscreen' }
		],
		IconHTML: '<span class="bibi-icon bibi-switch bibi-switch-fullscreen"></span>'
	}, function() {
		if(!sML.getFullscreenElement()) {
			sML.requestFullscreen(O.HTML);
			C.setLabel(C["switch"].Fullscreen, 1);
		} else {
			sML.exitFullscreen();
			C.setLabel(C["switch"].Fullscreen, 0);
		}
	});

	E.dispatch("bibi:createFullscreenSwitch");

});