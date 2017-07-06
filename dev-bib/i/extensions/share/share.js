/*!
 *
 * # BiB/i Extension: Share
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "Share",
    description: "Share the webpage which is holding BiB/i or embedded books through SNS.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "2.0.0",
    build: Bibi["build"]

})(function() {

    var ShareButtonGroup = I.createButtonGroup({ Area: I.Menu.R, Sticky: true });

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
                case "Parent": ShareTitle = U["parent-title"], ShareURI = U["parent-uri"]; break;
                case "Book": ShareTitle = document.title,    ShareURI = O.ReadiedURL;    break;
            }
            switch(SNS) {
                case "Twitter": return "https://twitter.com/intent/tweet?url="   + encodeURIComponent(ShareURI) + "&text=" + encodeURIComponent(ShareTitle) + "&hashtags=bibipub"; break;
                case "Facebook": return "https://www.facebook.com/sharer.php?u=" + encodeURIComponent(ShareURI); break;
                case "Google+": return "https://plus.google.com/share?url="   + encodeURIComponent(ShareURI); break;
            }
            return "";
        }
    });
    var getButtonObject = function(ParentOrBook, SNS, onclick) {
        var ButtonObject = {
            Type: "link",
            Labels: { default: { default: SNS } },
            Icon: '<span class="bibi-icon bibi-icon-' + SNS.replace("+", "Plus") + '"></span>',
            href: "",
            target: "_blank",
            action: function() {
                this.href = ShareSubPanel.getShareURI(ParentOrBook, SNS);
            }
        };
        if(!O.Mobile && SNS != "Twitter") {
            var N = "_blank", W = 560, H = 500;
            switch(SNS) {
                case "Facebook": N = "FBwindow", H = 480; break;
                case "Google+" : N = "G+window", W = 400; break;
            }
            ButtonObject.on = {
                click: function(Eve) {
                    Eve.preventDefault();
                    window.open(encodeURI(decodeURI(this.href)), N, 'width=' + W + ', height=' + H + ', menubar=no, toolbar=no, scrollbars=yes');
                    return false;
                }
            };
        }
        return ButtonObject;
    };
    if(U["parent-uri"]) {
        ShareSubPanel.addSection({
            Labels: { default: { default: 'Share the Embedded Webpage', ja: '埋め込まれたページをシェア' } },
            ButtonGroup: {
                Tiled: true,
                Buttons: [
                    getButtonObject("Parent", "Twitter"),
                    getButtonObject("Parent", "Facebook"),
                    getButtonObject("Parent", "Google+")
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
                    getButtonObject("Book", "Twitter"),
                    getButtonObject("Book", "Facebook"),
                    getButtonObject("Book", "Google+")
                ]
            }
        }).querySelector(".bibi-h-label").appendChild(sML.create("small", { className: "book-title" }));
    }
    /*
    if(X.Presets.Share["allow-embedding-in-other-webpages"]) {
        var EmbedCode = [
            '<a href="' + O.RequestedURL + '" data-bibi="embed">' + (U["parent-bibi-label"] ? U["parent-bibi-label"] : document.title) + '</a>',
            '<script src="' + (U["parent-pipi-path"] ? U["parent-pipi-path"] : O.RootPath.replace(/\/$/, ".js")) + '"></script>'
        ].join("").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        ShareSubPanel.addSection({
            Labels: { default: { default: 'Embed-Code of This Book', ja: 'この本の埋め込みコード' } },
            Notes: [
                { default: { default: '<input class="code block" value="' + EmbedCode.replace(/[""]/g, "&quot;") + '" onclick="this.select();" />' } }
            ]
        });
    }
    */
    O.Head.appendChild(sML.create("script", { async: "async", src: "//platform.twitter.com/widgets.js" }));

});