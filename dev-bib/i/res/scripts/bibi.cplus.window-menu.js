/*!
 *
 * # BiB/i Extension: C+WindowMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+WindowMenu",
    description: "Menu Buttons to Enter Fullscreen, Open in New Window, and Share.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    // Fullscreen
    if(O.FullscreenEnabled) C.addButton({
        id: "bibi-toggle-fullscreen",
        Category: "panel-menu-alpha",
        Group: "window",
        Labels: [
            { ja: 'フルスクリーンモードを開始', en: 'Enter Fullscreen' },
            { ja: 'フルスクリーンモードを終了', en:  'Exit Fullscreen' }
        ],
        IconHTML: '<span class="bibi-icon bibi-icon-toggle-fullscreen"></span>'
    }, {
        click: function() {
            var Button = this;
            if(!O.FullscreenElement.Fullscreen) {
                sML.requestFullscreen(O.FullscreenElement);
            } else {
                sML.exitFullscreen(O.FullscreenDocument);
            }
            C.Panel.toggle(function() {
                if(!O.FullscreenElement.Fullscreen) {
                    O.FullscreenElement.Fullscreen = true;
                    sML.addClass(O.HTML, "fullscreen");
                    C.setState(Button, 1);
                    E.dispatch("bibi:requestFullscreen");
                } else {
                    O.FullscreenElement.Fullscreen = false;
                    sML.removeClass(O.HTML, "fullscreen");
                    C.setState(Button, 0);
                    E.dispatch("bibi:exitFullscreen");
                }
            });
        }
    });

    // New Window
    if(O.WindowEmbedded) C.addButton({
        id: "bibi-open-newwindow",
        Category: "panel-menu-alpha",
        Group: "window",
        Labels: [
            { ja: 'あたらしいウィンドウで開く', en: 'Open in New Window' }
        ],
        IconHTML: '<a class="bibi-icon bibi-icon-open-newwindow" href="' + location.href + '" target="_blank"></a>'
    });

    E.dispatch("bibi:createWindowMenu");

});