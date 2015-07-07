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
	},

	haveTo: function(Item) {
		if(!P["japanese-typesetting-extra"] && !Item.HTML.getAttribute("data-bibi-jatex")) return false;
		if(!sML.UA.WebKit || sML.UA.Android) return false;
		if(B.Language != "ja" || B.WritingMode != "tb-rl" || S.BWM != "tb-rl") return false;
		return true;
	},

	Selector: "p, li" // "h1, h2, h3, h4, h5, h6, p, li, dt, dd"

})(function() {

	E.bind("bibi:before:postprocessItem", function(Item) {
		if(!X.JaTEx.haveTo(Item)) return;
		Item.logNow("JaTEx Preprocess");
		sML.each(Item.Body.querySelectorAll(X.JaTEx.Selector), function() {
			var Block = this;
			var Parts = X.JaTEx.parse(Block.innerHTML);
			if(!Parts || !Parts.length) return;
			var NewInnerHTML = "", IgnoringRuby = 0, IgnoringSpan = 0;
			sML.each(Parts, function() {
				var Part = this;
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
					//	.replace(/([\w\d\,\.!\?\-+=@#$%&*:;]+)/g, '</span><span class="alphanumeric-string">$1</span><span>')
					//	.replace(/([ａ-ｚＡ-Ｚ０−９]+)/g, '</span><span class="fullwidth-alphanumeric-string">$1</span><span>')
						.replace(/(（([^（）]+)）)/g, '</span><span class="parenthesized with-fullwidth-parentheses">（<span>$2</span>）</span><span>')
						.replace(/(\(([^\(\)]+)\))/g, '</span><span class="parenthesized with-parentheses">(<span>$2</span>)</span><span>')
					//	.replace(/(「([^「」]+)」)/g, '</span><span class="bracketed with-corner-brackets">「<span>$2</span>」</span><span>')
					//	.replace(/(『([^『』]+)』)/g, '</span><span class="bracketed with-double-corner-brackets">『<span>$2</span>』</span><span>')
					//	.replace(/(〈([^〈〉]+)〉)/g, '</span><span class="bracketed with-anble-brackets">〈<span>$2</span>〉</span><span>')
					//	.replace(/(《([^《》]+)》)/g, '</span><span class="bracketed with-double-anble-brackets">《<span>$2</span>》</span><span>')
					//	.replace(/(｛([^｛｝]+)｝)/g, '</span><span class="bracketed with-fullwidth-curly-brackets">｛<span>$2</span>｝</span><span>')
					//	.replace(/(［([^［］]+)］)/g, '</span><span class="bracketed with-fullwidth-square-brackets">［<span>$2</span>］</span><span>')
					//	.replace(/(【([^【】]+)】)/g, '</span><span class="bracketed with-black-lenticular-brackets">【<span>$2</span>】</span><span>')
					//	.replace(/(“([^“”]+)”)/g, '</span><span class="quoted with-double-quotation-marks">“<span>$2</span>”</span><span>')
					//	.replace(/(‘([^‘’]+)’)/g, '</span><span class="quoted with-single-quotation-marks">‘<span>$2</span>’</span><span>')
					//	.replace(/(（)/g, '</span><span class="fullwidth-left-parenthesis">$1</span><span>')
					//	.replace(/(）)/g, '</span><span class="fullwidth-right-parenthesis">$1</span><span>')
					//	.replace(/(「)/g, '</span><span class="left-corner-bracket">$1</span><span>')
					//	.replace(/(」)/g, '</span><span class="right-corner-bracket">$1</span><span>')
					//	.replace(/(『)/g, '</span><span class="left-white-corner-bracket">$1</span><span>')
					//	.replace(/(』)/g, '</span><span class="right-white-corner-bracket">$1</span><span>')
					//	.replace(/(〈)/g, '</span><span class="left-angle-bracket">$1</span><span>')
					//	.replace(/(〉)/g, '</span><span class="right-angle-bracket">$1</span><span>')
					//	.replace(/(《)/g, '</span><span class="left-double-angle-bracket">$1</span><span>')
					//	.replace(/(》)/g, '</span><span class="right-double-angle-bracket">$1</span><span>')
					//	.replace(/(｛)/g, '</span><span class="fullwidth-left-curly-bracket">$1</span><span>')
					//	.replace(/(｝)/g, '</span><span class="fullwidth-right-curly-bracket">$1</span><span>')
					//	.replace(/(［)/g, '</span><span class="fullwidth-left-square-bracket">$1</span><span>')
					//	.replace(/(］)/g, '</span><span class="fullwidth-right-square-bracket">$1</span><span>')
					//	.replace(/(【)/g, '</span><span class="left-black-lenticular-bracket">$1</span><span>')
					//	.replace(/(】)/g, '</span><span class="right-black-lenticular-bracket">$1</span><span>')
					//	.replace(/(“)/g, '</span><span class="left-double-quotation-mark">$1</span><span>')
					//	.replace(/(”)/g, '</span><span class="right-double-quotation-mark">$1</span><span>')
					//	.replace(/(‘)/g, '</span><span class="left-single-quotation-mark">$1</span><span>')
					//	.replace(/(’)/g, '</span><span class="right-single-quotation-mark">$1</span><span>')
						.replace(/(　)/g, '</span><span class="ideographic-space">$1</span><span>')
						.replace(/(、)/g, '</span><span class="ideographic-comma">$1</span><span>')
						.replace(/(。)/g, '</span><span class="ideographic-full-stop">$1</span><span>')
					//	.replace(/(・{7,})/g, '</span><span class="repeated katakana-middle-dots"><span>$1</span></span><span>')
					//	.replace(/(・・・・・・)/g, '</span><span class="repeated as-doublewidth-horizontal-ellipsis"><span>$1</span></span><span>')
					//	.replace(/(・{4,5})/g, '</span><span class="repeated katakana-middle-dots"><span>$1</span></span><span>')
					//	.replace(/(・・・)/g, '</span><span class="repeated as-horizontal-ellipsis"><span>$1</span></span><span>')
					//	.replace(/(・)/g, '</span><span class="katakana-middle-dot">$1</span><span>')
						.replace(/⋯/g, '…') // midline-horizontal-ellipses -> horizontal-ellipses
						.replace(/(…{3,})/g, '</span><span class="repeated horizontal-ellipses"><span>$1</span>/span><span>')
						.replace(/(……)/g, '</span><span class="repeated as-doublewidth-horizontal-ellipsis"><span>$1</span></span><span>')
						.replace(/(…)/g, '</span><span class="horizontal-ellipsis">$1</span><span>')
					//	.replace(/(⋯{3,})/g, '</span><span class="repeated midline-horizontal-ellipses"><span>$1</span></span><span>')
					//	.replace(/(⋯⋯)/g, '</span><span class="repeated as-doublewidth-midline-horizontal-ellipsis"><span>$1</span></span><span>')
					//	.replace(/(⋯)/g, '</span><span class="midline-horizontal-ellipsis">$1</span><span>')
						.replace(/―/g, '—') // horizontal-bar -> em-dash
						.replace(/(—{3,})/g, '</span><span class="repeated em-dashes"><span>$1</span></span><span>')
						.replace(/(——)/g, '</span><span class="repeated as-doublewidth-em-dash"><span>$1</span></span><span>')
						.replace(/(—)/g, '</span><span class="em-dash">$1</span><span>')
					//	.replace(/(―{3,})/g, '</span><span class="repeated horizontal-bars"><span>$1</span>/span><span>')
					//	.replace(/(――)/g, '</span><span class="repeated as-doublewidth-horizontal-bar"><span>$1</span></span><span>')
					//	.replace(/(―)/g, '</span><span class="horizontal-bar">$1</span><span>')
						.replace(/(！{3,})/g, '</span><span class="repeated fullwidth-exclamation-marks"><span>$1</span></span><span>')
						.replace(/(？{3,})/g, '</span><span class="repeated fullwidth-question-marks"><span>$1</span></span><span>')
						.replace(/(！！)/g, '</span><span class="coupled as-double-exclamation-mark"><span>$1</span></span><span>')
						.replace(/(？？)/g, '</span><span class="coupled as-double-question-mark"><span>$1</span></span><span>')
						.replace(/(！？)/g, '</span><span class="coupled as-exclamation-question-mark"><span>$1</span></span><span>')
						.replace(/(？！)/g, '</span><span class="coupled as-question-exclamation-mark"><span>$1</span></span><span>')
					//	.replace(/(！)/g, '</span><span class="fullwidth-exclamation-mark">$1</span><span>')
					//	.replace(/(？)/g, '</span><span class="fullwidth-question-mark">$1</span><span>');
					Part.Content = '<span>' + Part.Content + '</span>';
				}
				NewInnerHTML += Part.Content;
			});
			Block.innerHTML = NewInnerHTML.replace(/<span><\/span>/g, "");
			sML.each(Block.querySelectorAll(".repeated"), function() {
				this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
			});
			sML.each(Block.querySelectorAll(".coupled"), function() {
				this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
			});
		});
		Item.logNow("JaTEx Preprocessed");
	});

	E.bind("bibi:resetItem", function(Item) {
		if(!X.JaTEx.haveTo(Item)) return;
		Item.logNow("JaTEx Layout");
		var VerticalWritingMode = /^tb/.test(Item.HTML.WritingMode);
		sML.each(Item.Body.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"), function() {
			sML.style(this, { display: "", margin: "", textIndent: "", transform: "" });
		});
		sML.each(Item.Body.querySelectorAll(X.JaTEx.Selector), function() {
			var Checker = this.appendChild(sML.create("span", {}, { display: "block" }));
			var StartPoint = Checker.appendChild(sML.create("span", {}, { display: "block", textAlign: "left"  })).appendChild(sML.create("span"))["offset" + S.BASE.S];
			var   EndPoint = Checker.appendChild(sML.create("span", {}, { display: "block", textAlign: "right" })).appendChild(sML.create("span"))["offset" + S.BASE.S];
			this.removeChild(Checker);
			sML.each(this.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"), function() {
				this.style.display = "inline-block";
				this.style.textIndent = "0";
				if(this["offset" + S.BASE.S] == StartPoint) {
					this.style["margin" + S.BASE.S] = "-1em";
					sML.style(this, { transform: "translate" + (VerticalWritingMode ? "Y" : "X") + "(1em)" });
				} else {
					this.style.display = "";
					this.style.textIndent = "";
				}
			});
		});
		Item.logNow("JaTEx Layouted");
	});

});