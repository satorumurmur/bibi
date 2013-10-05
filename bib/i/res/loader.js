


BiB = { is: "abbreviation of Books-in-Browsers." };  /* and */  BiB.i = { is: "EPUB Reader on Your Site." };



(function() {

	document.open();
	for(var L = arguments.length, i = 0; i < L; i++) document.write(arguments[i]);
	document.close();

})(

	'<!-- JSZip - http://stuartk.com/jszip - Copyright: Stuart Knightley - Dual licenced under the MIT license or GPLv3. -->',
		'<script src="./res/scripts/lib/jszip.js"></script>',
		'<script src="./res/scripts/lib/jszip-inflate.js"></script>',
		'<script src="./res/scripts/lib/jszip-deflate.js"></script>',
		'<script src="./res/scripts/lib/jszip-load.js"></script>',

	'<!-- base64.js - https://github.com/dankogai/js-base64 - Copyright: dankogai - Licensed under the MIT license. -->',
		'<script src="./res/scripts/lib/base64.js"></script>',

	'<!-- Entypo - http://www.entypo.com/ - Copyright: Daniel Bruce - Licensed under SIL Open Font License. -->',
		'<!-- ./res/images/icons.png -->',

	'<!-- sML - http://sarasa.la/sML/ - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
		'<script src="./res/scripts/lib/sML.js"></script>',

	'<!-- BiB/i - http://sarasa.la/bib/i/ - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
		'<link rel="stylesheet" href="./res/styles/bibi.css" />',
		'<script id="bibi-script"  src="./res/scripts/bibi.js"></script>',
		'<script id="bibi-epubcfi" src="./res/scripts/bibi.epubcfi.js"></script>',
		'<script id="bibi-preset"  src="../presets/default.js"></script>'

);