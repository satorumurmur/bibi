/*!
 *
 * # BiB/i Extension: C+WindowUtilities
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+WindowUtilities",
    description: "Menu Buttons to Enter Fullscreen, Open in New Window, and Share.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    var ButtonGroup = C.addButtonGroup({ Area: C.Panel.MenuAlpha });

    // Fullscreen
    if(O.WindowEmbedded) {
        try {
            O.ParentHolder = window.parent.document.getElementById(U["parent-holder-id"]);
        } catch(Err) {}
    }
    if((!O.WindowEmbedded || O.ParentHolder) && (O.Body.requestFullscreen || O.Body.webkitRequestFullscreen || O.Body.mozRequestFullScreen || O.Body.msRequestFullscreen)) {
        O.FullscreenEnabled = true;
        O.FullscreenElement  = O.ParentHolder ? O.ParentHolder.Bibi.Frame : O.HTML;
        O.FullscreenDocument = O.ParentHolder ? window.parent.document    : document;
        O.HTML.className = O.HTML.className + " fullscreen-enabled";
    } else {
        O.HTML.className = O.HTML.className + " fullscreen-not-enabled";
    }
    if(O.FullscreenEnabled) C.addButton({ className: "bibi-button-toggle-fullscreen",
        Type: "toggle",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: 'フルスクリーンモードを開始', en: 'Enter Fullscreen' },
            "active":  { ja: 'フルスクリーンモードを終了', en:  'Exit Fullscreen' }
        },
        execute: function() {
            var Button = this;
            if(!O.FullscreenElement.Fullscreen) {
                sML.requestFullscreen(O.FullscreenElement);
            } else {
                sML.exitFullscreen(O.FullscreenDocument);
            }
            C.Panel.toggle({
                callback: function() {
                    if(!O.FullscreenElement.Fullscreen) {
                        O.FullscreenElement.Fullscreen = true;
                        E.dispatch("bibi:requestFullscreen");
                        sML.addClass(O.HTML, "fullscreen");
                    } else {
                        O.FullscreenElement.Fullscreen = false;
                        E.dispatch("bibi:exitFullscreen");
                        sML.removeClass(O.HTML, "fullscreen");
                    }
                }
            });
        }
    });

    // New Window
    if(O.WindowEmbedded) C.addButton({ tagName: "a", className: "bibi-button-open-newwindow", href: O.RequestedURL, target: "_blank",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: 'あたらしいウィンドウで開く', en: 'Open in New Window' }
        }
    });
/*
    // Share
    C.addButton({ className: "bibi-button-share",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: 'シェア', en: 'Share' }
        },
        execute: function() {
        }
    });
*/
    E.dispatch("bibi:createWindowMenu");

});