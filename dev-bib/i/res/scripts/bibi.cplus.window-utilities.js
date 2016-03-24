/*!
 *
 * # BiB/i Extension: C+WindowUtilities
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
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

    // Share
    var ShareButton = C.addButton({ className: "bibi-button-share",
        Type: "toggle",
        Group: ButtonGroup,
        Labels: {
            "default": { ja: 'シェア', en: 'Share' },
            "active":  { ja: 'シェアメニューを閉じる', en: 'Close Share-Menu' }
        },
        execute: function() {
            var Center = O.getElementCoord(this).X + this.offsetWidth / 2 - O.getElementCoord(this.SubPanel).X;
            sML.style(this.SubPanel, { transformOrigin: Center + "px 0" });
            sML.style(this.SubPanel.Bit, { left: Center + "px" });
            this.SubPanel.toggle();
        }
    });
    ShareButton.addEventListener(O["touchstart"], function(Eve) { Eve.stopPropagation(); });
    ShareButton.addEventListener(O["touchend"],   function(Eve) { Eve.stopPropagation(); });

    // Share SubPanel
    var getShareFunction = function(ParentOrBook, SNS) {
        var getTitle = function() { return ""; }, getURI = function() { return ""; }, getHref = function() { return ""; };
        switch(ParentOrBook) {
            case "Parent": getTitle = function() { return U["parent-title"]; }, getURI = function() { return U["parent-uri"]; }; break;
            case "Book":   getTitle = function() { return document.title; },    getURI = function() { return O.ReadiedURL; };    break;
        }
        switch(SNS) {
            case "Twitter":    getHref = function() { return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(getTitle() + " - " + getURI()); }; break;
            case "Facebook":   getHref = function() { return "https://www.facebook.com/share.php?u="  + encodeURIComponent(                     getURI()); }; break;
            case "GooglePlus": getHref = function() { return "https://plus.google.com/share?url="     + encodeURIComponent(                     getURI()); }; break;
        }
        return function() { this.href = getHref(); };
    };
    ShareButton.SubPanel = C.createSubPanel({ Opener: ShareButton });
    ShareButton.SubPanel.id = "bibi-subpanel_share";
    if(U["parent-uri"]) ShareButton.SubPanel.appendSection({
        Label: { ja: '埋め込まれたページのURLを', en: 'Share the Embedded Webpage\'s URL:' },
        Items: [
            { Label: { ja: 'Twitter でツイート', en: 'on Twitter'  }, Icon: "Twitter",    TagName: "a", on: { click: getShareFunction("Parent", "Twitter") } },
            { Label: { ja: 'Facebook でシェア',  en: 'on Facebook' }, Icon: "Facebook",   TagName: "a", on: { click: getShareFunction("Parent", "Facebook") } },
            { Label: { ja: 'Google+ で共有',     en: 'on Google+'  }, Icon: "GooglePlus", TagName: "a", on: { click: getShareFunction("Parent", "GooglePlus") } }
        ]
    });
    ShareButton.SubPanel.appendSection({
        Label: { ja: 'この本のURLを', en: "Share This Book\'s URL:" },
        Items: [
            { Label: { ja: 'Twitter でツイート', en: 'on Twitter'  }, Icon: "Twitter",    TagName: "a", on: { click: getShareFunction("Book", "Twitter") } },
            { Label: { ja: 'Facebook でシェア',  en: 'on Facebook' }, Icon: "Facebook",   TagName: "a", on: { click: getShareFunction("Book", "Facebook") } },
            { Label: { ja: 'Google+ で共有',     en: 'on Google+'  }, Icon: "GooglePlus", TagName: "a", on: { click: getShareFunction("Book", "GooglePlus") } }
        ]
    });/*
    ShareButton.SubPanel.appendSection({
        Items: [
            { Label: { ja: 'この本の埋め込みコードを取得', en: 'Get the Embed-Code of This Book' }, Icon: "code", on: { click: function() {
                console.log('<a href="' + O.ReadiedURL + '" data-bibi="embed">' + U["parent-bibi-label"] + '</a><script src="' + U["parent-pipi-path"] + '"></script>');
            } } }
        ]
    });*/

});