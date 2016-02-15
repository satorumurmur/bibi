/*!
 *
 * # BiB/i Extension: C+ViewMenu
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

	name: "C+ViewMenu",
	description: "Menu Buttons to Change View Mode.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

	if(S["reader-view-mode-fixed"]) return;

	var Shape = {};
	Shape.Item     = '<span class="bibi-shape bibi-shape-item"></span>';
	Shape.Spread   = '<span class="bibi-shape bibi-shape-spread">' + Shape.Item + Shape.Item + '</span>';
	Shape.SpreadsP = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-paged">'      + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';
	Shape.SpreadsH = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-horizontal">' + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';
	Shape.SpreadsV = '<span class="bibi-shape bibi-shape-spreads bibi-shape-spreads-vertical">'   + Shape.Spread + Shape.Spread + Shape.Spread + '</span>';

	C.addButton({
		Category: "panel-menu-alpha",
		Group: "view",
		Labels: [
			{ ja: 'ページ表示', en: 'Paged View' }
		],
		IconHTML: '<span class="bibi-icon bibi-icon-paged">' + Shape.SpreadsP + '</span>'
	}, function() {
		C.Panel.toggle(function() {
			R.changeView("paged");
		});
	});

	C.addButton({
		Category: "panel-menu-alpha",
		Group: "view",
		Labels: [
			{ ja: '横スクロール表示', en: 'Scroll View (Horizontal)' }
		],
		IconHTML: '<span class="bibi-icon bibi-icon-horizontal">' + Shape.SpreadsH + '</span>'
	}, function() {
		C.Panel.toggle(function() {
			R.changeView("horizontal");
		});
	});

	C.addButton({
		Category: "panel-menu-alpha",
		Group: "view",
		Labels: [
			{ ja: '縦スクロール表示', en: 'Scroll View (Vertical)' }
		],
		IconHTML: '<span class="bibi-icon bibi-icon-vertical">' + Shape.SpreadsV + '</span>'
	}, function() {
		C.Panel.toggle(function() {
			R.changeView("vertical");
		});
	});

	E.dispatch("bibi:createViewMenu");

});