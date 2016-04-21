/*!
 *
 * # BiB/i Extension: JaTEx
 *
 * - "Japanes Typesetting Extra"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "JaTEx",
    description: "Japanese Typesetting Extra",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "0.1.0",
    build: 20150722.1424,

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

    markupEnclosure: function(TextString, List) {
        for(var i = 0, L = List.length; i < L; i++) {
            if(!List[i]) break;
            var Open      = List[i][0];
            var Close     = List[i][1];
            var ClassName = List[i][2];
            var RE = new RegExp('(' + Open + ')([^' + Open + Close + ']+)(' + Close + ')', "g");
            while(RE.test(TextString)){
                TextString = TextString.replace(RE, '<o>$2<c>');
            }
            TextString = TextString
                .replace(/<o>/g, '<span class="enclosed ' + ClassName + '">' + Open)
                .replace(/<c>/g, Close + '</span>')
            ;
        }
        return TextString;
    },

    markupCharacters: function(TextString, List, It) {
        for(var i = 0, L = List.length; i < L; i++) {
            if(!List[i]) break;
            TextString = TextString
                .replace(new RegExp('(' + List[i][0] + ')', "g"), '</span><span class="' + List[i][1] + '">' + It + '</span><span>')
            ;
        }
        return TextString;
    },
    markupPlural: function(TextString, List) { return this.markupCharacters(TextString, List, '<span>$1</span>'); },
    markupSingle: function(TextString, List) { return this.markupCharacters(TextString, List,       '$1'       ); },

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

    defineMode: function(Item) {
        Item.JaTEx = { Markup: false, Layout: false };
        if(B.Language == "ja") {
            var JaTExSetting = Item.HTML.getAttribute("data-bibi-jatex") || Item.ItemRef["bibi:jatex"];
            if(JaTExSetting) {
                switch(JaTExSetting) {
                    case "markup":
                        Item.JaTEx.Markup = true;
                        break;
                    case "layout":
                        Item.JaTEx.Layout = true;
                        break;
                    case "markup-layout" :
                    case "layout-markup" :
                        Item.JaTEx.Markup = true;
                        Item.JaTEx.Layout = true;
                        break;
                }
            }
        }
    },

    Selector: "p, li, dd" // "h1, h2, h3, h4, h5, h6, p, li, dt, dd"

})(function() {

    // Markup
    E.bind("bibi:is-going-to:postprocess-item-content", function(Item) {
        X.JaTEx.defineMode(Item);
        if(!Item.JaTEx.Markup) return;
        Item.stamp("JaTEx Preprocess Start");
        sML.each(Item.Body.querySelectorAll(X.JaTEx.Selector), function() {
            var Block = this;
            var EnclosedHTML = X.JaTEx.markupEnclosure(Block.innerHTML, [
                [  '\\('  ,  '\\)'  ,  "parenthesized with-parentheses"  ],
                [  '（'   ,  '）'   ,  "parenthesized with-fullwidth-parentheses"  ],
                [  '「'   ,  '」'   ,  "bracketed with-corner-brackets"  ],
                [  '『'   ,  '』'   ,  "bracketed with-double-corner-brackets"  ],
            //    [  '〈'   ,  '〉'   ,  "bracketed with-anble-brackets"  ],
            //    [  '《'   ,  '》'   ,  "bracketed with-double-anble-brackets"  ],
            //    [  '｛'   ,  '｝'   ,  "bracketed with-fullwidth-curly-brackets"  ],
            //    [  '［'   ,  '］'   ,  "bracketed with-fullwidth-square-brackets"  ],
            //    [  '【'   ,  '】'   ,  "bracketed bracketed with-black-lenticular-brackets"  ],
                [  '“'   ,  '”'   ,  "quoted with-double-quotation-marks"  ],
                [  '〝'   ,  '〟'   ,  "quoted with-double-prime-quotation-marks"  ],
            //    [  '‘'   ,  '’'   ,  "quoted with-single-quotation-marks"  ],
            null ]);
            Block.innerHTML = EnclosedHTML;
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
                        .replace(  /⋯/g  ,  '…'  ) // midline-horizontal-ellipses => horizontal-ellipses
                        .replace(  /―/g  ,  '—'  ) // horizontal-bar => em-dash
                    //    .replace(  /“/g  ,  '〝'  ) // left-double-quotation-mark => reversed-double-prime-quotation-mark
                    //    .replace(  /”/g  ,  '〟'  ) // right-double-quotation-mark => low-double-prime-quotation-mark
                    ;
                    Part.Content = X.JaTEx.markupPlural(Part.Content, [
                    //    [  '・{7,}'   ,  'repeated katakana-middle-dots'  ],
                    //    [  '・{6,6}'  ,  'repeated as-doublewidth-horizontal-ellipsis'  ],
                    //    [  '・{4,5}'  ,  'repeated katakana-middle-dots'  ],
                    //    [  '・・・'   ,  'repeated as-horizontal-ellipsis'  ],
                        [  '…{3,}'   ,  'repeated horizontal-ellipses'  ],
                        [  '……'     ,  'repeated as-doublewidth-horizontal-ellipsis'  ],
                    //    [  '⋯{3,}'   ,  'repeated midline-horizontal-ellipses'  ],
                    //    [  '⋯⋯'     ,  'repeated as-doublewidth-midline-horizontal-ellipsis'  ],
                        [  '—{3,}'   ,  'repeated em-dashes'  ],
                        [  '——'     ,  'repeated as-doublewidth-em-dash'  ],
                    //    [  '―{3,}'   ,  'repeated horizontal-bars'  ],
                    //    [  '――'     ,  'repeated as-doublewidth-horizontal-bar'  ],
                        [  '！{3,}'   ,  'repeated fullwidth-exclamation-marks'  ],
                        [  '？{3,}'   ,  'repeated fullwidth-question-marks'  ],
                        [  '！！'     ,  'coupled as-double-exclamation-mark'  ],
                        [  '？？'     ,  'coupled as-double-question-mark'  ],
                        [  '！？'     ,  'coupled as-exclamation-question-mark'  ],
                        [  '？！'     ,  'coupled as-question-exclamation-mark'  ],
                    null ]);
                    Part.Content = X.JaTEx.markupSingle(Part.Content, [
                        [  '\\('  ,  'encloser parenthesis left-parenthesis'  ],
                        [  '\\)'  ,  'encloser parenthesis right-parenthesis'  ],
                        [  '（'   ,  'encloser fullwidth-parenthesis fullwidth-left-parenthesis'  ],
                        [  '）'   ,  'encloser fullwidth-parenthesis fullwidth-right-parenthesis'  ],
                        [  '「'   ,  'encloser corner-bracket left-corner-bracket'  ],
                        [  '」'   ,  'encloser corner-bracket right-corner-bracket'  ],
                        [  '『'   ,  'encloser white-corner-bracket left-white-corner-bracket'  ],
                        [  '』'   ,  'encloser white-corner-bracket right-white-corner-bracket'  ],
                    //    [  '〈'   ,  'encloser angle-bracket left-angle-bracket'  ],
                    //    [  '〉'   ,  'encloser angle-bracket right-angle-bracket'  ],
                    //    [  '《'   ,  'encloser double-angle-bracket left-double-angle-bracket'  ],
                    //    [  '》'   ,  'encloser double-angle-bracket right-double-angle-bracket'  ],
                    //    [  '｛'   ,  'encloser fullwidth-curly-bracket fullwidth-left-curly-bracket'  ],
                    //    [  '｝'   ,  'encloser fullwidth-curly-bracket fullwidth-right-curly-bracket'  ],
                    //    [  '［'   ,  'encloser fullwidth-square-bracket fullwidth-left-square-bracket'  ],
                    //    [  '］'   ,  'encloser fullwidth-square-bracket fullwidth-right-square-bracket'  ],
                    //    [  '【'   ,  'encloser black-lenticular-bracket left-black-lenticular-bracket'  ],
                    //    [  '】'   ,  'encloser black-lenticular-bracket right-black-lenticular-bracket'  ],
                        [  '“'   ,  'encloser double-quotation-mark left-double-quotation-mark'  ],
                        [  '”'   ,  'encloser double-quotation-mark right-double-quotation-mark'  ],
                        [  '〝'   ,  'encloser double-prime-quotation-mark reversed-double-prime-quotation-mark'  ],
                        [  '〟'   ,  'encloser double-prime-quotation-mark low-double-prime-quotation-mark'  ],
                    //    [  '‘'   ,  'encloser single-quotation-mark left-single-quotation-mark'  ],
                    //    [  '’'   ,  'encloser single-quotation-mark right-single-quotation-mark'  ],
                        [  '　'   ,  'ideographic-space'  ],
                        [  '、'   ,  'ideographic-comma'  ],
                        [  '。'   ,  'ideographic-full-stop'  ],
                    //    [  '・'   ,  'katakana-middle-dot'  ],
                        [  '…'   ,  'horizontal-ellipsis'  ],
                    //    [  '⋯'   ,  'midline-horizontal-ellipsis'  ],
                        [  '—'   ,  'em-dash'  ],
                    //    [  '―'   ,  'horizontal-bar'  ],
                        [  '！'   ,  'fullwidth-exclamation-mark'  ],
                        [  '？'   ,  'fullwidth-question-mark'  ],
                    null ]);
                    Part.Content = '<span>' + Part.Content + '</span>';
                }
                NewInnerHTML += Part.Content;
            });
            Block.innerHTML = NewInnerHTML.replace(/<span[^>]*><\/span>/g, "");
            sML.each(Block.querySelectorAll(".repeated"), function() {
                this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
            });
            sML.each(Block.querySelectorAll(".coupled"), function() {
                this.innerHTML = this.innerHTML.replace(/<[^>]+>/g, "");
            });
        });
        Item.stamp("JaTEx Preprocess End");
    });

    // Ruby
    E.bind("bibi:postprocessed-item", function(Item) {
        Item.RubyParents = [];
        sML.each(Item.Body.querySelectorAll("ruby"), function() {
            var RubyParent = this.parentNode;
            while(getComputedStyle(RubyParent).display != "block" && RubyParent != Item.Body) RubyParent = RubyParent.parentNode;
            if(RubyParent != Item.Body && Item.RubyParents[Item.RubyParents.length - 1] != RubyParent) {
                Item.RubyParents.push(RubyParent);
                RubyParent.WritingMode = O.getWritingMode(RubyParent);
                RubyParent.LiningLength = (/^tb/.test(RubyParent.WritingMode) ? "Width" : "Height");
                RubyParent.LiningBefore = (/tb$/.test(RubyParent.WritingMode) ? "Top" : (/rl$/.test(RubyParent.WritingMode) ? "Right" : "Left"));
                RubyParent.DefaultFontSize = parseFloat(getComputedStyle(RubyParent).fontSize);
                RubyParent.OriginalCSSText = RubyParent.style.cssText;
            }
        });
    });

    // Layout
    E.bind("bibi:postprocessed-item", function(Item) {
        if(!Item.JaTEx.Layout) return;
        sML.appendStyleRule(".jatex-checker", "display: block;", Item.contentDocument);
        sML.appendStyleRule(".jatex-checker >span", "display: block;", Item.contentDocument);
        sML.appendStyleRule(".jatex-checker >span:last-child", "text-align: right;", Item.contentDocument);
        sML.appendStyleRule(".jatex-checker >span:first-child", "text-align: left;", Item.contentDocument);
        sML.appendStyleRule(".jatex-checker >span >span", "display: inline-block; width: 0; height: 0;", Item.contentDocument);
        sML.appendStyleRule(".jatex-test", "display: inline-block; text-indent: 0;", Item.contentDocument);
        sML.appendStyleRule(".jatex-burasage-tate", "display: inline-block; position: relative; margin-top: -1em; top: 1em;", Item.contentDocument);
        sML.appendStyleRule(".jatex-burasage-yoko", "display: inline-block; position: relative; margin-left: -1em; left: 1em;", Item.contentDocument);
    });

    // Ruby
    E.bind("bibi:is-going-to:adjust-content", function(Item) {
        if(!sML.UA.Safari && !sML.UA.Chrome) return;
        var RubyParentsLengthWithRubys = [];
        Item.RubyParents.forEach(function(RubyParent) {
            RubyParent.style.cssText = RubyParent.OriginalCSSText;
            RubyParentsLengthWithRubys.push(RubyParent["offset" + RubyParent.LiningLength]);
        });
        var RubyHidingStyleSheetIndex = sML.appendStyleRule("rt", "display: none !important;", Item.contentDocument);
        Item.RubyParents.forEach(function(RubyParent, i) {
            var Gap = RubyParentsLengthWithRubys[i] - RubyParent["offset" + RubyParent.LiningLength];
            if(Gap > 0 && Gap < RubyParent.DefaultFontSize) {
                var RubyParentComputedStyle = getComputedStyle(RubyParent);
                RubyParent.style["margin" + RubyParent.LiningBefore] = parseFloat(RubyParentComputedStyle["margin" + RubyParent.LiningBefore]) - Gap + "px";
            }
        });
        sML.deleteStyleRule(RubyHidingStyleSheetIndex, Item.contentDocument);
    });

    // Layout
    E.bind("bibi:is-going-to:reset-item", function(Item) {
        if(!Item.JaTEx.Layout) return;
        Item.stamp("JaTEx Reset Start");
        var VerticalWritingMode = /^tb/.test(Item.HTML.WritingMode);
        var Start = VerticalWritingMode ? "Top" : "Left";
        sML.each(Item.Body.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"), function() {
            this.className = this.className.replace(/ *jatex[^ ]+/g, "");
        });
        Item.stamp("JaTEx Reset End");
    });

    // Layout
    E.bind("bibi:reset-item", function(Item) {
        if(!Item.JaTEx.Layout) return;
        Item.stamp("JaTEx Layout Start");
        var VerticalWritingMode = /^tb/.test(Item.HTML.WritingMode);
        var Start = VerticalWritingMode ? "Top" : "Left";
        sML.each(Item.Body.querySelectorAll(X.JaTEx.Selector), function() {
            var Checker = this.appendChild(sML.create("span", { className: "jatex-checker" }));
            this.StartPoint = Checker.appendChild(sML.create("span")).appendChild(sML.create("span"))["offset" + Start];
            this.EndPoint = Checker.appendChild(sML.create("span")).appendChild(sML.create("span"))["offset" + Start];
            this.removeChild(Checker);
            var Block = this;
            sML.each(this.querySelectorAll(".ideographic-space, .ideographic-comma, .ideographic-full-stop"), function() {
                sML.addClass(this, "jatex-test");
                if(this["offset" + Start] == Block.StartPoint) {
                    sML.addClass(this, "jatex-burasage-" + (VerticalWritingMode ? "tate" : "yoko"));
                }
                sML.removeClass(this, "jatex-test");
            });
        });
        Item.stamp("JaTEx Layout End");
    });

});