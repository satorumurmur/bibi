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
			if(Arrow.Timer_tap) clearTimeout(Arrow.Timer_tap);
			sML.addClass(Arrow, "shown");
		});
		Arrow.addEventListener("mouseout", function() {
			sML.removeClass(Arrow, "shown");
		});
		sML.addTouchEventObserver(Arrow).addTouchEventListener("tap", function() {
			E.dispatch("bibi:command:move", Arrow.DistanceToMove)
			sML.addClass(Arrow, "shown");
			if(Arrow.Timer_tap) clearTimeout(Arrow.Timer_tap);
			Arrow.Timer_tap = setTimeout(function() {
				sML.removeClass(Arrow, "shown");
			}, 500);
		});
	});

	E.add("bibi:start", function() {
		if(S.To) sML.style(C.Arrows.Back, { opacity: 1 });
		sML.style(C.Arrows.Forward, { opacity: 1 });
		setTimeout(function() {
			[C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) { sML.style(Arrow, { opacity: "" }); });
		}, 500);
	});

	E.dispatch("bibi:createArrows");

});