/*!
 *
 * # BiB/i Extention: C+Arrows
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

	name: "C+Arrows",
	description: "Floating Buttons for Scrolling and Page Flipping",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	C.Arrows = R.Content.appendChild(
		sML.create("div", { id: "bibi-arrows" }, { display: S["arrows"] == "hidden" ? "none" : "" })
	);
	C.Arrows.Back = C.Arrows.appendChild(
		sML.create("div", { title: "Back",    className: "bibi-arrow", id: "bibi-arrow-back",    DistanceToMove: -1 })
	);
	C.Arrows.Forward = C.Arrows.appendChild(
		sML.create("div", { title: "Forward", className: "bibi-arrow", id: "bibi-arrow-forward", DistanceToMove: +1 })
	);

	[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
		Arrow.addEventListener("mouseover", function() {
			sML.addClass(Arrow, "flickering");
		});
		Arrow.addEventListener("mouseout", function() {
			sML.removeClass(Arrow, "flickering");
		});
		Arrow.addEventListener("click", function() {
			E.dispatch("bibi:command:move", Arrow.DistanceToMove);
			sML.addClass(Arrow, "firing");
			if(Arrow.Timer) clearTimeout(Arrow.Timer);
			Arrow.Timer = setTimeout(function() {
				Arrow.className = "bibi-arrow";
			}, 400);
		});
	});

	E.add("bibi:start", function() {
		setTimeout(function() {
			if(S.To) sML.addClass(C.Arrows.Back, "glowing");
			sML.addClass(C.Arrows.Forward, "glowing");
			setTimeout(function() {
				[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) { sML.removeClass(Arrow, "glowing"); });
			}, 800);
		}, 400);
	});

	E.dispatch("bibi:createArrows");

});