/*!
 *
 * # BiB/i Extension: C+Indicator
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

	name: "C+Indicator",
	description: "Show Indicator (Bar, Nombre, and Percent).",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

    C.Indicator = {};

    C.Indicator.Bar = O.Body.appendChild(
        sML.create("div", { id: "bibi-indicator-bar",
            innerHTML: [
                '<span id="bibi-indicator-bar-progress"></span>'
            ].join(" "),
            progress: function() {
                C.Indicator.Bar.Progress.style.width = (R.Current.PageNumber / R.Pages.length * 100) + "%";
            }
        })
    );
    C.Indicator.Bar.Progress = document.getElementById("bibi-indicator-bar-progress");

    C.Indicator.Nombre = O.Body.appendChild(
        sML.create("div", { id: "bibi-indicator-nombre",
            innerHTML: [
                '<span id="bibi-indicator-nombre-current"></span>',
                '<span id="bibi-indicator-nombre-delimiter"></span>',
                '<span id="bibi-indicator-nombre-total"></span>',
                '<span id="bibi-indicator-nombre-percent"></span>'
            ].join(" "),
            flick: function() {
                clearTimeout(C.Indicator.Nombre.Timer_vanish);
                clearTimeout(C.Indicator.Nombre.Timer_transparentize);
                setTimeout(function() {
                    sML.removeClass(C.Indicator.Nombre, "vanished");
                }, 0);
                setTimeout(function() {
                    sML.removeClass(C.Indicator.Nombre, "transparentized");
                }, 10);
                C.Indicator.Nombre.Timer_transparentize = setTimeout(function() {
                    sML.addClass(C.Indicator.Nombre, "transparentized");
                }, 1981);
                C.Indicator.Nombre.Timer_vanish = setTimeout(function() {
                    sML.addClass(C.Indicator.Nombre, "vanished");
                }, 1981 + 255);
                C.Indicator.Nombre.Current.innerHTML   = R.Current.PageNumber;
                C.Indicator.Nombre.Delimiter.innerHTML = '/';
                C.Indicator.Nombre.Total.innerHTML     = R.Pages.length;
                C.Indicator.Nombre.Percent.innerHTML   = '(' + R.Current.Percent + '%)';
                E.dispatch("bibi:x:cplus:nombre:flick");
            }
        })
    );
    C.Indicator.Nombre.Current   = document.getElementById("bibi-indicator-nombre-current");
    C.Indicator.Nombre.Delimiter = document.getElementById("bibi-indicator-nombre-delimiter");
    C.Indicator.Nombre.Total     = document.getElementById("bibi-indicator-nombre-total");
    C.Indicator.Nombre.Percent   = document.getElementById("bibi-indicator-nombre-percent");

    E.add("bibi:scrolled", C.Indicator.Bar.progress);
    E.add("bibi:scrolled", C.Indicator.Nombre.flick);

});