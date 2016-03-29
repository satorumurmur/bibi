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
    var getShareURI = function(ParentOrBook, SNS) {
        var ShareTitle = "", ShareURI = "";
        switch(ParentOrBook) {
            case "P": ShareTitle = U["parent-title"], ShareURI = U["parent-uri"]; break;
            case "B": ShareTitle = document.title,    ShareURI = O.ReadiedURL;    break;
        }
        switch(SNS) {
            case "T": return "https://twitter.com/intent/tweet?url="  + encodeURIComponent(ShareURI) + "&text=" + encodeURIComponent(ShareTitle) + "&hashtags=bibipub"; break;
            case "F": return "https://www.facebook.com/sharer.php?u=" + encodeURIComponent(ShareURI); break;
            case "G": return "https://plus.google.com/share?url="     + encodeURIComponent(ShareURI); break;
        }
        return "";
    };
    ShareButton.SubPanel = C.createSubPanel({ Opener: ShareButton,
        open: function() {
            sML.each(this.querySelectorAll(".parent-title"), function() {
                this.innerHTML = U["parent-title"];
            });
            sML.each(this.querySelectorAll(".book-title"), function() {
                this.innerHTML = document.title;
            });
        }
    });
    ShareButton.SubPanel.id = "bibi-subpanel_share";
    if(U["parent-uri"]) {
        ShareButton.SubPanel.appendSection({
            Label: { ja: '埋め込まれたページをシェア', en: 'Share the Embedded Webpage' },
            Tiled: true,
            Items: [
                { Label: { default: 'Twitter'  }, Icon: "Twitter",    Href: getShareURI("P", "T"), on: { click: function() { this.href = getShareURI("P", "T"); } } },
                { Label: { default: 'Facebook' }, Icon: "Facebook",   Href: getShareURI("P", "F"), on: { click: function() { this.href = getShareURI("P", "F"); } } },
                { Label: { default: 'Google+'  }, Icon: "GooglePlus", Href: getShareURI("P", "G"), on: { click: function() { this.href = getShareURI("P", "G"); } } }
            ]
        }).querySelector(".bibi-subpanel-h-label").appendChild(sML.create("small", { className: "parent-title" }));
    }
    if(true) {
        ShareButton.SubPanel.appendSection({
            Label: { ja: 'この本をシェア', en: 'Share This Book' },
            Tiled: true,
            Items: [
                { Label: { default: 'Twitter'  }, Icon: "Twitter",    Href: getShareURI("B", "T"), on: { click: function() { this.href = getShareURI("B", "T"); } } },
                { Label: { default: 'Facebook' }, Icon: "Facebook",   Href: getShareURI("B", "F"), on: { click: function() { this.href = getShareURI("B", "F"); } } },
                { Label: { default: 'Google+'  }, Icon: "GooglePlus", Href: getShareURI("B", "G"), on: { click: function() { this.href = getShareURI("B", "G"); } } }
            ]
        }).querySelector(".bibi-subpanel-h-label").appendChild(sML.create("small", { className: "book-title" }));
    }/*
    if(true) {
        ShareButton.SubPanel.appendSection({
            Items: [
                { Label: { ja: 'この本の埋め込みコードを取得', en: 'Get the Embed-Code of This Book' }, Icon: "code", on: { click: function() {
                    console.log('<a href="' + O.ReadiedURL + '" data-bibi="embed">' + U["parent-bibi-label"] + '</a><script src="' + U["parent-pipi-path"] + '"></script>');
                } } }
            ]
        });
    }*/
    O.Head.appendChild(sML.create("script", { async: "async", src: "//platform.twitter.com/widgets.js" }));

});