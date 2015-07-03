/*!
 *
 * # BiB/i Extention: JaTEx
 *
 * - "Japanes Typesetting Extra"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Thu July 2 14:36:00 2015 +0900
 */

Bibi.x({

	name: "JaTEx",
	description: "Japanese Typesetting Extra",
	version: "0.1.0",
	build: 20150702.0,

	HTMLString: "", Current: 0, Log: false, LogCorrection: false, LogCancelation: false,

	parse: function(HTMLString, Scope) {
		if(HTMLString && typeof HTMLString == "object" && HTMLString.tagName) HTMLString = HTMLString.innerHTML;
		if(!HTMLString || typeof HTMLString != "string") return null;
		this.HTMLString = HTMLString, this.Current = 0;
		if(this.Log) {
			this.log(1, "BiB/i JaTEx");
			this.log(2, "parse");
			this.log(3, "HTMLString: " + this.HTMLString);
		}
		return this.parseInnerHTML();
	},

	parseInnerHTML: function() {
		var Foothold = this.Current, Parts = [];
		var Part = this.parsePart();
		while(Part !== null) {
			Parts.push(Part);
			Part = this.parsePart();
			if(!Part) break;
		}
		return (Parts.length ? Parts : null);
	},

	parsePart: function() {
		var Foothold = this.Current, Part = {};
		var HTMLSpecialPart = this.parseString(/^<[^>]*?>/);
		if(HTMLSpecialPart) {
			if(/^<!--/.test(HTMLSpecialPart)) {
				Part.Type = "Comment";
			} else {
				Part.Type = "Tag";
				     if(/^<ruby[ >]/.test(HTMLSpecialPart)) Part.Detail = "ruby:open";
				else if( /^<\/ruby>/.test(HTMLSpecialPart)) Part.Detail = "ruby:close";
				else if(/^<span[ >]/.test(HTMLSpecialPart) && / class="([\w\d\-]+[\s\t]+)*(tcy|sideways|upright)([\s\t]+[\w\d\-]+)*"/.test(HTMLSpecialPart)) Part.Detail = "span.x:open";
				else if(/^<span[ >]/.test(HTMLSpecialPart)) Part.Detail = "span:open";
				else if( /^<\/span>/.test(HTMLSpecialPart)) Part.Detail = "span:close";
			}
			Part.Content = HTMLSpecialPart;
			return Part;
		}
		var Content = this.parseString(/[^<]+/);
		if(Content) {
			Part.Type = "Text";
			Part.Content = Content;
			return Part;
		}
		return null;
	},

	parseString: function(S) {
		var Correction = null, Matched = false;
		if(S instanceof RegExp) {
			var HTMLString = this.HTMLString.substr(this.Current, this.HTMLString.length - this.Current);
			if(S.test(HTMLString)) {
				Matched = true;
				S = HTMLString.match(S)[0];
			}
		} else if(this.HTMLString.substr(this.Current, S.length) === S) {
			Matched = true;
		}
		if(Matched) {
			this.Current += S.length;
			Correction = S;
		}
		return this.correct(Correction);
	},

	correct: function(Correction) {
		if(this.Log && this.LogCorrection && Correction) this.log(3, Correction);
		return Correction;
	},
	cancel: function(Foothold, Parser) {
		if(this.Log && this.LogCancelation) this.log(4, "cancel: parse" + Parser + " (" + Foothold + "-" + this.Current + "/" + this.HTMLString.length + ")");
		if(typeof Foothold == "number") this.Current = Foothold;
		return null;
	},
	log: function(Lv, Message) {
		if(!this.Log || !console || !console.log) return;
		     if(Lv == 0) Message = "[ERROR] " + Message;
		else if(Lv == 1) Message = "---------------- " + Message + " ----------------";
		else if(Lv == 2) Message = Message;
		else if(Lv == 3) Message = " - " + Message;
		else if(Lv == 4) Message = "   . " + Message;
		console.log('BiB/i JaTEx: ' + Message);
	}

})(function() {

	E.bind("bibi:postprocessItem", function(Item) {
		if(!Item.HTML.getAttribute("data-bibi-jatex")) return;
		Item.logNow("JaTEx Started");
		sML.each(Item.Body.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li, dt, dd"), function() {
			var Parts = X.JaTEx.parse(this.innerHTML);
			if(!Parts || !Parts.length) return;
			var NewInnerHTML = ""; IgnoringRuby = 0, IgnoringSpan = 0;
			for(var i = 0, L = Parts.length; i < L; i++) {
				var Part = Parts[i];
				if(Part.Type == "Comment") {
					// do nothing
				} else if(Part.Type == "Tag") {
					     if(Part.Detail ==   "ruby:open") IgnoringRuby++;
					else if(Part.Detail ==  "ruby:close") IgnoringRuby--;
					else if(Part.Detail == "span.x:open") IgnoringSpan++;
					else if(Part.Detail ==   "span:open") if(IgnoringRuby || IgnoringSpan) IgnoringSpan++;
					else if(Part.Detail ==  "span:close") if(IgnoringRuby || IgnoringSpan) IgnoringSpan--;
				} else if(!IgnoringRuby && !IgnoringSpan) {
					Part.Content = Part.Content
						.replace(/(（[^）]）)/g, '<span class="parenthesized">$1</span>')
						.replace(/(、)/g, '<span class="ideographic-comma">$1</span>')
						.replace(/(。)/g, '<span class="ideographic-full-stop">$1</span>')
						.replace(/(・)/g, '<span class="katakana-middle-dot">$1</span>')
						.replace(/(（)/g, '<span class="fullwidth-left-parenthesis">$1</span>')
						.replace(/(）)/g, '<span class="fullwidth-right-parenthesis">$1</span>')
						.replace(/(「)/g, '<span class="left-corner-bracket">$1</span>')
						.replace(/(」)/g, '<span class="right-corner-bracket">$1</span>')
						.replace(/(『)/g, '<span class="left-white-corner-bracket">$1</span>')
						.replace(/(』)/g, '<span class="right-white-corner-bracket">$1</span>')
						.replace(/(〈)/g, '<span class="left-angle-bracket">$1</span>')
						.replace(/(〉)/g, '<span class="right-angle-bracket">$1</span>')
						.replace(/(《)/g, '<span class="left-double-angle-bracket">$1</span>')
						.replace(/(》)/g, '<span class="right-double-angle-bracket">$1</span>')
						.replace(/(｛)/g, '<span class="fullwidth-left-curly-bracket">$1</span>')
						.replace(/(｝)/g, '<span class="fullwidth-right-curly-bracket">$1</span>')
						.replace(/(［)/g, '<span class="fullwidth-left-square-bracket">$1</span>')
						.replace(/(］)/g, '<span class="fullwidth-right-square-bracket">$1</span>')
						.replace(/(【)/g, '<span class="left-black-lenticular-bracket">$1</span>')
						.replace(/(】)/g, '<span class="right-black-lenticular-bracket">$1</span>')
						.replace(/(…{3,})/g, '<span class="repeating-horizontal-ellipsis">$1</span>')
						.replace(/(……)/g, '<span class="double-horizontal-ellipsis">$1</span>')
						.replace(/(…)/g, '<span class="horizontal-ellipsis">$1</span>')
						.replace(/(⋯{3,})/g, '<span class="repeating-midline-horizontal-ellipsis">$1</span>')
						.replace(/(⋯⋯)/g, '<span class="double-midline-horizontal-ellipsis">$1</span>')
						.replace(/(⋯)/g, '<span class="midline-horizontal-ellipsis">$1</span>')
						.replace(/(—{3,})/g, '<span class="repeating-em-dash">$1</span>')
						.replace(/(——)/g, '<span class="double-em-dash">$1</span>')
						.replace(/(—)/g, '<span class="em-dash">$1</span>')
						.replace(/(！{3,})/g, '<span class="repeating-exclamation-mark">$1</span>')
						.replace(/(？{3,})/g, '<span class="repeating-question-mark">$1</span>')
						.replace(/(！！)/g, '<span class="double-exclamation-mark">$1</span>')
						.replace(/(？？)/g, '<span class="double-question-mark">$1</span>')
						.replace(/(！？)/g, '<span class="exclamation-question-mark">$1</span>')
						.replace(/(？！)/g, '<span class="question-exclamation-mark">$1</span>')
						.replace(/(！)/g, '<span class="exclamation-mark">$1</span>')
						.replace(/(？)/g, '<span class="question-mark">$1</span>');
				}
				NewInnerHTML += Part.Content;
			}
			this.innerHTML = NewInnerHTML;
			sML.each(this.querySelectorAll([
				".repeating-horizontal-ellipsis",
				".repeating-midline-horizontal-ellipsis",
				".repeating-em-dash",
				".repeating-exclamation-mark",
				".repeating-question-mark"
			].join(",")), function() {
				this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
			});
			sML.each(this.querySelectorAll([
				".double-horizontal-ellipsis",
				".double-midline-horizontal-ellipsis",
				".double-em-dash",
				".double-exclamation-mark",
				".double-question-mark",
				".exclamation-question-mark",
				".question-exclamation-mark"
			].join(",")), function() {
				this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
			});
		});
		Item.logNow("JaTEx Processed");
	});

});