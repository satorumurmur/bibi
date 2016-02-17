/*!
 *
 * # BiB/i Extension: C+ViewMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+ViewMenu",
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
        if(this.State != 0) return; 
        var RVM = this.id.replace("bibi-viewmenu-", "");
        C.Panel.toggle(function() {
            R.changeView(RVM);
        });
    };

    C.addButton({
        id: "bibi-viewmenu-paged",
        Category: "panel-menu-alpha",
        Group: "view",
        Labels: [
            { ja: 'ページ表示に変更', en: 'Change to Paged View' },
            { ja: 'ページ表示（現在の設定）', en: 'Paged View (Selected)' }
        ],
        IconHTML: '<span class="bibi-icon bibi-icon-paged">' + Shape.SpreadsP + '</span>'
    }, {
        click: changeView
    });

    C.addButton({
        id: "bibi-viewmenu-horizontal",
        Category: "panel-menu-alpha",
        Group: "view",
        Labels: [
            { ja: '横スクロール表示に変更', en: 'Change to Horizontal-Scroll View' },
            { ja: '横スクロール表示（現在の設定）', en: 'Horizontal-Scroll View (Selected)' }
        ],
        IconHTML: '<span class="bibi-icon bibi-icon-horizontal">' + Shape.SpreadsH + '</span>'
    }, {
        click: changeView
    });

    C.addButton({
        id: "bibi-viewmenu-vertical",
        Category: "panel-menu-alpha",
        Group: "view",
        Labels: [
            { ja: '縦スクロール表示に変更', en: 'Change to Vertical-Scroll View' },
            { ja: '縦スクロール表示（現在の設定）', en: 'Vertical-Scroll View (Selected)' }
        ],
        IconHTML: '<span class="bibi-icon bibi-icon-vertical">' + Shape.SpreadsV + '</span>'
    }, {
        click: changeView
    });

    E.add("bibi:updateSetting", function() {
        sML.each(document.querySelectorAll("#bibi-panel-menu-alpha-view > li"), function() {
            C.setState(this, (this.id == "bibi-viewmenu-" + S.RVM ? 1 : 0));
        });
    });

    E.dispatch("bibi:createViewMenu");

});