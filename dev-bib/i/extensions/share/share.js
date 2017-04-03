/*!
 *
 * # BiB/i Extension: Share
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "Share",
    description: "Share webpages and embedded books via SNS.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    var ShareButtonGroup = I.createButtonGroup({ Area: I.Menu.R });

    // Share
    var ShareButton = ShareButtonGroup.addButton({
        Type: "toggle",
        Labels: {
            default: { default: 'Share', ja: 'シェア' },
            active:  { default: 'Close Share-Menu', ja: 'シェアメニューを閉じる' }
        },
        Help: true,
        Icon: '<span class="bibi-icon bibi-icon-share"></span>'
    });

    // Share SubPanel
    var ShareSubPanel = I.createSubPanel({
        Opener: ShareButton,
        id: "bibi-subpanel_share",
        open: function() {
            sML.each(this.querySelectorAll(".parent-title"), function() {
                this.innerHTML = U["parent-title"];
            });
            sML.each(this.querySelectorAll(".book-title"), function() {
                this.innerHTML = document.title;
            });
        },
        getShareURI: function(ParentOrBook, SNS) {
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
        }
    });
    if(U["parent-uri"]) {
        ShareSubPanel.addSection({
            Labels: { default: { default: 'Share the Embedded Webpage', ja: '埋め込まれたページをシェア' } },
            ButtonGroup: {
                Tiled: true,
                Buttons: [
                    {
                        Type: "link",
                        Labels: { default: { default: 'Twitter' } },
                        Icon: '<span class="bibi-icon bibi-icon-Twitter"></span>',
                        href: ShareSubPanel.getShareURI("P", "T"),
                        action: function() { this.href = ShareSubPanel.getShareURI("P", "T"); },
                        on: { click: function() { return false; } }
                    },
                    {
                        Type: "link",
                        Labels: { default: { default: 'Facebook' } },
                        Icon: '<span class="bibi-icon bibi-icon-Facebook"></span>',
                        href: ShareSubPanel.getShareURI("P", "F"),
                        action: function() { this.href = ShareSubPanel.getShareURI("P", "F"); },
                        on: { click: function() { return false; } }
                    },
                    {
                        Type: "link",
                        Labels: { default: { default: 'Google+' } },
                        Icon: '<span class="bibi-icon bibi-icon-GooglePlus"></span>',
                        href: ShareSubPanel.getShareURI("P", "G"),
                        action: function() { this.href = ShareSubPanel.getShareURI("P", "G"); },
                        on: { click: function() { return false; } }
                    }
                ]
            }
        }).querySelector(".bibi-h-label").appendChild(sML.create("small", { className: "parent-title" }));
    }
    if(true) {
        ShareSubPanel.addSection({
            Labels: { default: { default: 'Share This Book', ja: 'この本をシェア' } },
            ButtonGroup: {
                Tiled: true,
                Buttons: [
                    {
                        Type: "link",
                        Labels: { default: { default: 'Twitter' } },
                        Icon: '<span class="bibi-icon bibi-icon-Twitter"></span>',
                        href: ShareSubPanel.getShareURI("B", "T"),
                        action: function() { this.href = ShareSubPanel.getShareURI("B", "T"); },
                        on: { click: function() { return false; } }
                    },
                    {
                        Type: "link",
                        Labels: { default: { default: 'Facebook' } },
                        Icon: '<span class="bibi-icon bibi-icon-Facebook"></span>',
                        href: ShareSubPanel.getShareURI("B", "F"),
                        action: function() { this.href = ShareSubPanel.getShareURI("B", "F"); },
                        on: { click: function() { return false; } }
                    },
                    {
                        Type: "link",
                        Labels: { default: { default: 'Google+' } },
                        Icon: '<span class="bibi-icon bibi-icon-GooglePlus"></span>',
                        href: ShareSubPanel.getShareURI("B", "G"),
                        action: function() { this.href = ShareSubPanel.getShareURI("B", "G"); },
                        on: { click: function() { return false; } }
                    }
                ]
            }
        }).querySelector(".bibi-h-label").appendChild(sML.create("small", { className: "book-title" }));
    }
    if(0 && true) {
        ShareSubPanel.addSection({
            ButtonGroup: {
                Buttons: [
                    {
                        Labels: { default: { default: 'Get the Embed-Code of This Book', ja: 'この本の埋め込みコードを取得' } },
                        Icon: '<span class="bibi-icon bibi-icon-code"></span>',
                        on: { click: function() { console.log('<a href="' + O.ReadiedURL + '" data-bibi="embed">' + U["parent-bibi-label"] + '</a><script src="' + U["parent-pipi-path"] + '"></script>'); } }
                    }
                ]
            }
        });
    }
    O.Head.appendChild(sML.create("script", { async: "async", src: "//platform.twitter.com/widgets.js" }));

});