/*!
 *
 * # BiB/i Extension: FontSize
 *
 * - "FontSize Utility: Users can change font-size. Publishers can change default font-size."
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */

Bibi.x({

    name: "FontSize",
    description: "Font Size Optimizer for BiB/i",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "1.1.0",
    build: Bibi["build"]

})(function() {

    if(typeof X.Presets.FontSize["scale-per-step"] != "number" || X.Presets.FontSize["scale-per-step"] <= 1) X.Presets.FontSize["scale-per-step"] = 1.25;

    if(S["use-cookie"]) {
        var BibiCookie = O.Cookie.remember(O.RootPath);
        if(BibiCookie && BibiCookie.FontSize && BibiCookie.FontSize.Step != undefined) X.FontSize.Step = BibiCookie.FontSize.Step * 1;
    }
    if(typeof X.FontSize.Step != "number" || X.FontSize.Step < -2 || 2 < X.FontSize.Step) X.FontSize.Step = 0;

    O.appendStyleSheetLink({
        className: "bibi-extension-stylesheet",
        id: "bibi-extension-stylesheet_FontSize",
        href: O.RootPath + "extensions/fontsize/fontsize.css"
    });

    X.FontSize.changeItemFontSize = function(Item, FontSize) {
        if(Item.FontSizeStyleRule) sML.CSS.deleteRule(Item.FontSizeStyleRule, Item.contentDocument);
        Item.FontSizeStyleRule = sML.CSS.appendRule("html", "font-size: " + FontSize + "px !important;", Item.contentDocument);
    };
    X.FontSize.changeItemFontSizeStep = function(Item, Step) {
        X.FontSize.changeItemFontSize(Item, Item.FontSize.Base * Math.pow(X.Presets.FontSize["scale-per-step"], Step));
    };

    E.bind("bibi:postprocessed-item-content", function(Item) {
        Item.FontSize = {
            Default: getComputedStyle(Item.HTML).fontSize.replace(/[^\d]*$/, "") * 1
        };
        Item.FontSize.Base = Item.FontSize.Default;
        if(sML.UA.InternetExplorer && L.Preprocessed) {
            Array.prototype.forEach.call(Item.contentDocument.documentElement.querySelectorAll("body, body *"), function(Ele) {
                Ele.style.fontSize = parseInt(getComputedStyle(Ele).fontSize) / Item.FontSize.Base + "rem";
            });
        } else {
            O.editCSSRules(Item.contentDocument, function(CSSRule) {
                if(!CSSRule || !CSSRule.selectorText || /^@/.test(CSSRule.selectorText)) return;
                try { if(Item.contentDocument.querySelector(CSSRule.selectorText) == Item.HTML) return; } catch(Error) {}
                var REs = {
                    "pt": / font-size: (\d[\d\.]*)pt; /,
                    "px": / font-size: (\d[\d\.]*)px; /
                };
                if(REs["pt"].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs["pt"])[1] * (96/72) / Item.FontSize.Base + "rem";
                if(REs["px"].test(CSSRule.cssText)) CSSRule.style.fontSize = CSSRule.cssText.match(REs["px"])[1]           / Item.FontSize.Base + "rem";
            });
        }
        if(typeof X.Presets.FontSize["base"] == "number" && X.Presets.FontSize["base"] > 0) {
            var MostPopularFontSize = 0;
            var FontSizeCounter = {};
            sML.each(Item.Body.querySelectorAll("p, p *"), function() {
                if(!this.innerText.replace(/\s/g, "")) return;
                var FontSize = Math.round(getComputedStyle(this).fontSize.replace(/[^\d]*$/, "") * 100) / 100;
                if(!FontSizeCounter[FontSize]) FontSizeCounter[FontSize] = [];
                FontSizeCounter[FontSize].push(this);
            });
            var MostPopularFontSizeAmount = 0;
            for(var FontSize in FontSizeCounter) {
                if(FontSizeCounter[FontSize].length > MostPopularFontSizeAmount) {
                    MostPopularFontSizeAmount = FontSizeCounter[FontSize].length;
                    MostPopularFontSize = FontSize;
                }
            }
            if(MostPopularFontSize) Item.FontSize.Base = Item.FontSize.Base * (X.Presets.FontSize["base"] / MostPopularFontSize);
            X.FontSize.changeItemFontSizeStep(Item, X.FontSize.Step);
        } else if(X.FontSize.Step != 0) {
            X.FontSize.changeItemFontSizeStep(Item, X.FontSize.Step);
        }
    });

    X.FontSize.ButtonGroup = I.createButtonGroup({ Area: I.Menu.R, Sticky: true });

    // FontSize Button
    X.FontSize.Button = X.FontSize.ButtonGroup.addButton({
        Type: "toggle",
        Labels: {
            default: {
                default: 'Change Font Size',
                ja: '文字サイズを変更'
            },
            active: {
                default: 'Close Font Size Menu',
                ja: '文字サイズメニューを閉じる'
            }
        },
        //className: 'bibi-button-fontsize bibi-button-fontsize-change',
        Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-change"></span>',
        Help: true
    });

    // FontSize SubPanel
    X.FontSize.SubPanel = I.createSubPanel({
        Opener: X.FontSize.Button,
        id: "bibi-subpanel_fontsize",
        open: function() {}
    });
    var changeFontSizeStep = function() {
        var Button = this;
        var Step = Button.Step;
        if(Step == X.FontSize.Step) return;
        Button.ButtonGroup.Busy = true;
        X.FontSize.Step = Step;
        if(S["use-cookie"]) {
            O.Cookie.eat(O.RootPath, { FontSize: { Step: Step } });
        }
        I.Panel.close();
        if(I.Slider) I.Slider.close();
        setTimeout(function() {
            R.layOut({
                Reset: true,
                NoNotification: true,
                before: function() {
                    R.Items.forEach(function(Item) {
                        X.FontSize.changeItemFontSizeStep(Item, Step);
                    });
                },
                callback: function() {
                    E.dispatch("bibi:changed-fontsize", { Step: Step });
                    Button.ButtonGroup.Busy = false;
                }
            });
        }, 88);
    };
    X.FontSize.SubPanel.Section = X.FontSize.SubPanel.addSection({
        Labels: {
            default: {
                default: 'Choose Font Size',
                ja: '文字サイズを選択'
            }
        },
        ButtonGroup: {
            //Tiled: true,
            Buttons: [
                {
                    Type: "radio",
                    Labels: {
                        default: {
                            default: '<span class="non-visual-in-label">Font Size:</span> Ex-Large',
                            ja: '<span class="non-visual-in-label">文字サイズ：</span>最大'
                        }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exlarge"></span>',
                    //Notes: true,
                    Step: 2,
                    action: changeFontSizeStep
                },
                {
                    Type: "radio",
                    Labels: {
                        default: {
                            default: '<span class="non-visual-in-label">Font Size:</span> Large',
                            ja: '<span class="non-visual-in-label">文字サイズ：</span>大'
                        }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-large"></span>',
                    //Notes: true,
                    Step: 1,
                    action: changeFontSizeStep
                },
                {
                    Type: "radio",
                    Labels: {
                        default: {
                            default: '<span class="non-visual-in-label">Font Size:</span> Medium <small>(default)</small>',
                            ja: '<span class="non-visual-in-label">文字サイズ：</span>中<small>（初期値）</small>'
                        }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-medium"></span>',
                    //Notes: true,
                    Step: 0,
                    action: changeFontSizeStep
                },
                {
                    Type: "radio",
                    Labels: {
                        default: {
                            default: '<span class="non-visual-in-label">Font Size:</span> Small',
                            ja: '<span class="non-visual-in-label">文字サイズ：</span>小'
                        }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-small"></span>',
                    //Notes: true,
                    Step: -1,
                    action: changeFontSizeStep
                },
                {
                    Type: "radio",
                    Labels: {
                        default: {
                            default: '<span class="non-visual-in-label">Font Size:</span> Ex-Small',
                            ja: '<span class="non-visual-in-label">文字サイズ：</span>最小'
                        }
                    },
                    Icon: '<span class="bibi-icon bibi-icon-fontsize bibi-icon-fontsize-exsmall"></span>',
                    //Notes: true,
                    Step: -2,
                    action: changeFontSizeStep
                }
            ]
        }
    });
    X.FontSize.SubPanel.Section.ButtonGroup.Buttons.forEach(function(Button) {
        if(Button.Step == X.FontSize.Step) I.setUIState(Button, "active");
    });

    E.dispatch("bibi:created-fontsize-menu");

});

