


BiB = { is: "abbreviation of Books-in-Browsers." };  /* and */  BiB.i = { is: "EPUB Reader on Your Site." };



(function() {

	document.open();
	for(var L = arguments.length, i = 0; i < L; i++) document.write(arguments[i]);
	document.close();

})(

	'<!-- Entypo - http://www.entypo.com/ - Copyright: Daniel Bruce - Licensed under SIL Open Font License. -->',
		'<link rel="stylesheet" href="./res/font/entypo.css" />',

	'<!-- JSZip - http://stuartk.com/jszip - Copyright: Stuart Knightley - Dual licenced under the MIT license or GPLv3. -->',
		'<script src="./res/script/lib/jszip.js"></script>',
		'<script src="./res/script/lib/jszip-inflate.js"></script>',
		'<script src="./res/script/lib/jszip-deflate.js"></script>',
		'<script src="./res/script/lib/jszip-load.js"></script>',

	'<!-- base64.js - https://github.com/dankogai/js-base64 - Copyright: dankogai - Licensed under the MIT license. -->',
		'<script src="./res/script/lib/base64.js"></script>',

	'<!-- sML - http://sarasa.la/sML/ - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
		'<script src="./res/script/lib/sML.js"></script>',

	'<!-- BiB/i - http://sarasa.la/bib/i/ - Copyright: Satoru MATSUSHIMA - Licensed under the MIT license. -->',
		'<link rel="stylesheet" href="./res/style/bibi.css" />',
		'<script src="./res/script/bibi.js"></script>'

);



// 以下の Google Analytics コードは、配布しているコードには書かれておりませんのでご安心ください。
// Google Analytics codes below are not included in BiB/i you download.

var _gaq = _gaq || [];
var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';

_gaq.push(['_require', 'inpage_linkid', pluginUrl]);
_gaq.push(['_setAccount', 'UA-28036505-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();



