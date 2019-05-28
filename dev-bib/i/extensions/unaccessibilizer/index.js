/*!
 *                                                                                                                          (℠)
 *  # BiB/i Extension: Unaccessibilizer ("What a...")
 *
 *  * Reluctantly coded by Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  * Released into the public domain under the Unlicense. - http://unlicense.org/UNLICENSE
 *
 */

Bibi.x({

    id: "Unaccessibilizer",
    description: "What a...",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: "0.3.0"

})(function() {

    'use strict';

    const unaccessibilize = (Item) => {
        if(this["select-elements"]) {
            ["-webkit-", "-moz-", "-ms-", ""].forEach(Prefix => {
                ["user-select", "user-drag"].forEach(Property => {
                    Item.Body.style[Prefix + Property] = "none";
                });
            });
        }
        if(this["save-images"]) {
            Array.prototype.forEach.call(Item.Body.querySelectorAll("img, svg, image"), Img => {
                ["-webkit-", "-moz-", "-ms-", ""].forEach(Prefix => {
                    ["user-select", "user-drag"].forEach(Property => {
                        Img.style[Prefix + Property] = "none";
                    });
                    if(O.Touch) Img.style[Prefix + "pointer-events"] = "none";
                });
                Img.draggable = false;
                Img.addEventListener("contextmenu", O.preventDefault);
            });
        }
        if(this["use-contextmenu"]) {
            Item.contentDocument.addEventListener("contextmenu", O.preventDefault);
        }
    };

    unaccessibilize(O), E.bind("bibi:postprocessed-item", unaccessibilize);

});