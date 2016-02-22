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

    C.Arrows = R.Main.appendChild(
        sML.create("div", { id: "bibi-arrows" }, { display: S["hide-arrows"] ? "none" : "" })
    );
    C.Arrows.Back = C.Arrows.appendChild(
        sML.create("div", { title: "Back",    className: "bibi-arrow", id: "bibi-arrow-back",
            DistanceToMove: -1,
            isAvailable: function(Eve) {
                if(Eve && (!Eve.offsetX && !Eve.offsetY)) return false; // returns false for ghost event (what is this...?)
                return (R.Current.Pages.StartPage != R.Pages[0] || R.Current.Pages.StartPageRatio != 100);
            }
        })
    );
    C.Arrows.Forward = C.Arrows.appendChild(
        sML.create("div", { title: "Forward", className: "bibi-arrow", id: "bibi-arrow-forward",
            DistanceToMove: +1,
            isAvailable: function(Eve) {
                if(Eve && (!Eve.offsetX && !Eve.offsetY)) return false; // returns false for ghost event (what is this...?)
                return (R.Current.Pages.EndPage != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio != 100);
            }
        })
    );

    [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
        O.setFeedback(Arrow);
        Arrow.addEventListener("click", function(Eve) {
            if(!Arrow.isAvailable(Eve)) return false;
            E.dispatch("bibi:command:move", Arrow.DistanceToMove);
        });
    });

    C.Arrows.navigate = function() {
        R.getCurrent();
        setTimeout(function() {
            R.getCurrent();
            [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                if(Arrow.isAvailable()) sML.addClass(Arrow, "glowing");
            });
            setTimeout(function() {
                [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                    sML.removeClass(Arrow, "glowing");
                });
            }, 1234);
        }, 420);
    };

    E.add("bibi:start",    C.Arrows.navigate);
    E.add("bibi:relayout", C.Arrows.navigate);

    E.dispatch("bibi:createArrows");

});