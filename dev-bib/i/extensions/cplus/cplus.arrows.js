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
		sML.create("div", { id: "bibi-arrows" }, { display: S["arrows"] == "hidden" ? "none" : "" })
	);
	C.Arrows.Back = C.Arrows.appendChild(
		sML.create("div", { title: "Back",    className: "bibi-arrow", id: "bibi-arrow-back",
            DistanceToMove: -1,
            isActive: function() {
                return (R.CurrentPages.StartPage != R.Pages[0] || R.CurrentPages.StartPageRatio != 100);
            }
        })
	);
	C.Arrows.Forward = C.Arrows.appendChild(
		sML.create("div", { title: "Forward", className: "bibi-arrow", id: "bibi-arrow-forward",
            DistanceToMove: +1,
            isActive: function() {
                return (R.CurrentPages.EndPage != R.Pages[R.Pages.length - 1] || R.CurrentPages.EndPageRatio != 100);
            }
        })
	);

	[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
		Arrow.addEventListener("mouseover", function() { if(Arrow.isActive()) sML.addClass(Arrow, "flickering"); });
		Arrow.addEventListener("mouseout",  function() { sML.removeClass(Arrow, "flickering"); });
		Arrow.addEventListener("click", function() {
            if(!Arrow.isActive()) return false;
			E.dispatch("bibi:command:move", Arrow.DistanceToMove);
			sML.addClass(Arrow, "firing");
			if(Arrow.Timer) clearTimeout(Arrow.Timer);
			Arrow.Timer = setTimeout(function() {
                sML.removeClass(Arrow, "firing")
			}, 400);
		});
	});

    C.Arrows.navigate = function() {
		setTimeout(function() {
            R.CurrentPages = R.getCurrentPages();
            [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                if(Arrow.isActive()) sML.addClass(Arrow, "glowing")
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