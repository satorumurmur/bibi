(function() {

	document.open();
	for(var L = arguments.length, i = 0; i < L; i++) document.write(arguments[i] + "\n");
	document.close();

})(

	'<!-- sML - http://sarasa.la/sML - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
	'<!-- JSZip - http://stuartk.com/jszip - Copyright: Stuart Knightley - Dual licenced under the MIT license or GPLv3. -->',
	'<!-- base64.js - https://github.com/dankogai/js-base64 - Copyright: dankogai - Licensed under the MIT license. -->',
	'	<script id="bibi-script-lib" src="./res/scripts/bibi.lib.js"></script>',

	'<!-- BiB/i - http://sarasa.la/bib/i - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
	'	<link rel="stylesheet" id="bibi-style" href="./res/styles/bibi.css" />',
	'	<script id="bibi-script" src="./res/scripts/bibi.js"></script>',
	'	<script id="bibi-preset" src="../presets/default.js"></script>'

);