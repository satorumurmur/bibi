/*!
 *
 * # BiB/i Extension: OverReflow
 *
 * - "Overlays Reflowable Content Layers on Pre-Paginated Book"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "OverReflow",
    description: "Overlays Reflowable Content Layers on Pre-Paginated Book",
    version: "0.1.0",
    build: 20150902.0003

})(function() {

    E.bind("bibi:loaded-package-document", function() {
        X.OverReflow.Layer = R.Sub.appendChild(
            sML.create("div", { className: "overreflow-layer hidden",
                Frames: [],
                open: function(Item) {
                    R.Sub.style.display = "block";
                    X.OverReflow.Layer.Frames.forEach(function(Frame) {
                        Frame.style.display = (Frame == Item.OverReflow.Frame) ? "block" : "none";
                    });
                    setTimeout(function() {
                        sML.removeClass(X.OverReflow.Layer, "hidden");
                        sML.removeClass(X.OverReflow.Bar,   "hidden");
                    }, 0);
                },
                close: function() {
                    sML.addClass(X.OverReflow.Layer, "hidden");
                    sML.addClass(X.OverReflow.Bar,   "hidden");
                    setTimeout(function() {
                        R.Sub.style.display = "";
                    }, 250);
                }
            })
        );
        X.OverReflow.Bar = R.Sub.appendChild(
            sML.create("div", { className: "overreflow-bar" })
        );
        X.OverReflow.Closer = X.OverReflow.Bar.appendChild(
            sML.create("span", { className: "overreflow-closer", innerHTML: "Close" })
        );
        X.OverReflow.Closer.addEventListener("click", function() {
            X.OverReflow.Layer.close();
        });
    });

    E.bind("bibi:loaded-item", function(Item) {
        if(!Item.ItemRef["bibi:overreflow"] || !/^idref:/.test(Item.ItemRef["bibi:overreflow"])) return;
        Item.stamp("OverReflow Prepare Start");
        Item.OverReflow = {};
        Item.OverReflow.IDRef = Item.ItemRef["bibi:overreflow"].replace(/^idref:(.*)/, "$1");
        if(!B.Package.Manifest["items"][Item.OverReflow.IDRef]) return Item.stamp("OverReflow Prepare Error");
        Item.OverReflow["idref"] = Item.ItemRef["bibi:overreflow"];
        Item.OverReflow.Path = O.getPath(B.Package.Dir, B.Package.Manifest["items"][Item.OverReflow.IDRef].href);
        Item.OverReflow.URI = B.Zipped ? B.getDataURI(Item.OverReflow.Path) : B.Path + "/" + Item.OverReflow.Path;
        Item.OverReflow.Frame = X.OverReflow.Layer.appendChild(
            sML.create("iframe", { className: "overreflow-frame", scrolling: "auto", allowtransparency: "true", src: Item.OverReflow.URI,
                onload: function() {
                    var HTML = this.contentDocument.documentElement;
                    var Body = this.contentDocument.body;
                    HTML.addEventListener("click", X.OverReflow.Layer.close, false);
                    sML.each(Body.getElementsByTagName("a"), function() {
                        this.addEventListener("click", function(Eve) { Eve.stopPropagation(); }, false);
                    });
                }
            })
        );
        Item.OverReflow.Opener = Item.ItemBox.appendChild(
            sML.create("span", { className: "overreflow-opener", Item: Item,
                innerHTML: '<a href="' + Item.OverReflow.URI + '">Open</a>'
            }, {}, {
                "click": function() {
                    X.OverReflow.Layer.open(this.Item);
                }
            })
        );
        X.OverReflow.Layer.Frames.push(Item.OverReflow.Frame);
        Item.stamp("OverReflow Prepare End");
    });

});