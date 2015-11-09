/*!
 *
 * # BiB/i Extension: C+Nombre
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

	name: "C+Nombre",
	description: "Show Nombre and Percent.",
	author: "Satoru MATSUSHIMA (@satorumurmur)",
	version: Bibi["version"],
	build: Bibi["build"]

})(function() {

    C.Nombre = O.Body.appendChild(
        sML.create("div", { id: "bibi-nombre",
            count: function() {
                this.Current = R.CurrentPages.EndPage.PageIndex + 1;
                this.Percent = Math.round((R.CurrentPages.EndPage.PageIndex + 1) / R.Pages.length * 100);
                E.dispatch("bibi:x:cplus:nombre:count");
            },
            flick: function() {
                clearTimeout(C.Nombre.Timer_vanish);
                clearTimeout(C.Nombre.Timer_transparentize);
                setTimeout(function() {
                    sML.removeClass(C.Nombre, "vanished");
                }, 0);
                setTimeout(function() {
                    sML.removeClass(C.Nombre, "transparentized");
                }, 10);
                C.Nombre.Timer_transparentize = setTimeout(function() {
                    sML.addClass(C.Nombre, "transparentized");
                }, 1981);
                C.Nombre.Timer_vanish = setTimeout(function() {
                    sML.addClass(C.Nombre, "vanished");
                }, 1981 + 255);
                C.Nombre.innerHTML = [
                    '<span id="bibi-nombre-current">' + this.Current + '</span>',
                    '<span id="bibi-nombre-delimiter">/</span>',
                    '<span id="bibi-nombre-total">' + (R.Pages.length) + '</span>',
                    '<span id="bibi-nombre-percent">(' + this.Percent + '%)</span>'
                ].join(" ");
                E.dispatch("bibi:x:cplus:nombre:flick");
            }
        })
    );

    E.add("bibi:scrolled", function() {
        C.Nombre.count();
        C.Nombre.flick();
    });

});