/*!
 *
 * # BiB/i Extension: C+Arrows
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+Arrows",
    description: "Floating Buttons for Scrolling and Page-Flipping",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    C.Arrows = O.Body.appendChild(
        sML.create("div", { id: "bibi-arrows" }, { display: S["hide-arrows"] ? "none" : "" })
    );
    C.Arrows.Back = C.Arrows.appendChild(
        sML.create("div", { title: "Back",    className: "bibi-arrow", id: "bibi-arrow-back",
            DistanceToMove: -1,
            isActive: function() {
                return (R.Current.Pages.StartPage != R.Pages[0] || R.Current.Pages.StartPageRatio != 100);
            }
        })
    );
    C.Arrows.Forward = C.Arrows.appendChild(
        sML.create("div", { title: "Forward", className: "bibi-arrow", id: "bibi-arrow-forward",
            DistanceToMove: +1,
            isActive: function() {
                return (R.Current.Pages.EndPage != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio != 100);
            }
        })
    );

    [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
        if(!O.Mobile) {
            Arrow.addEventListener("mouseover", function() { if(Arrow.isActive()) sML.addClass(Arrow, "flickering"); });
            Arrow.addEventListener("mouseout",  function() { sML.removeClass(Arrow, "flickering"); });
        }
        Arrow.addEventListener("click", function(Eve) {
            if(!Arrow.isActive() || (!Eve.offsetX && !Eve.offsetY)) return false; // returns false in case of: 1. clicking inactive arrow, 2. ghost event (what is this...?)
            E.dispatch("bibi:command:move", Arrow.DistanceToMove);
            sML.addClass(Arrow, "firing");
            if(Arrow.Timer_out) clearTimeout(Arrow.Timer_out);
            Arrow.Timer_out = setTimeout(function() { sML.removeClass(Arrow, "firing"); }, 200);
        });
    });

    C.Arrows.navigate = function() {
        R.getCurrent();
        C.Arrows.check();
        setTimeout(function() {
            R.getCurrent();
            [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                if(Arrow.isActive()) sML.addClass(Arrow, "glowing");
            });
            setTimeout(function() {
                [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                    sML.removeClass(Arrow, "glowing");
                });
            }, 1234);
        }, 420);
    };

    C.Arrows.check = function() {
        [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
            if(Arrow.isActive()) sML.removeClass(Arrow, "inactive"); else sML.addClass(Arrow, "inactive");
        });
    };

    E.add("bibi:start",    C.Arrows.navigate);
    E.add("bibi:relayout", C.Arrows.navigate);
    E.add("bibi:scrolled", C.Arrows.check);

    E.dispatch("bibi:createArrows");

});