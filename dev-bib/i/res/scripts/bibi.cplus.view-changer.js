/*!
 *
 * # BiB/i Extension: C+ViewChanger
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+ViewChanger",
    description: "Menu Buttons to Change View Mode.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    if(S["reader-view-mode-fixed"]) return;

    var Shape = {};
    Shape.Item     = '<span class="bibi-shape bibi-shape-item"></span>';
    Shape.Spread   = '<span class="bibi-shape bibi-shape-spread">' + Shape.Item + Shape.Item + '</span>';
    Shape.SpreadsP = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">'      + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';
    Shape.SpreadsH = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';
    Shape.SpreadsV = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'   + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';

    var changeView = function() {
        var Button = this;
        C.Panel.toggle({
            callback: function() {
                R.changeView(Button.Value);
            }
        });
    };

    var ButtonGroup = C.addButtonGroup({ Area: C.Panel.MenuAlpha });

    C.addButton({ className: "bibi-button-view-paged", extraHTML: Shape.SpreadsP,
        Type: "radio",
        Value: "paged",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: 'ページ表示に変更', en: 'Change to Paged View' },
            "active":  { ja: 'ページ表示（現在の設定）', en: 'Paged View (Selected)' }
        },
        execute: changeView
    });

    C.addButton({ className: "bibi-button-view-horizontal", extraHTML: Shape.SpreadsH,
        Type: "radio",
        Value: "horizontal",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: '横スクロール表示に変更', en: 'Change to Horizontal-Scroll View' },
            "active":  { ja: '横スクロール表示（現在の設定）', en: 'Horizontal-Scroll View (Selected)' }
        },
        execute: changeView
    });

    C.addButton({ className: "bibi-button-view-vertical", extraHTML: Shape.SpreadsV,
        Type: "radio",
        Value: "vertical",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: '縦スクロール表示に変更', en: 'Change to Vertical-Scroll View' },
            "active":  { ja: '縦スクロール表示（現在の設定）', en: 'Vertical-Scroll View (Selected)' }
        },
        execute: changeView
    });

    E.add("bibi:updateSetting", function() {
        ButtonGroup.Buttons.forEach(function(Button) {
            C.setState(Button, (Button.Value == S.RVM ? "active" : "default"));
        });
    });

    E.dispatch("bibi:createViewMenu");

});