/*!
 *
 * # BiB/i Extension: C+Indicators
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+Indicators",
    description: "Add Indicators.",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    C.Indicator = O.Body.appendChild(sML.create("div", { id: "bibi-indicator" }));

    // Mark
    C.Indicator.Mark = C.Indicator.appendChild(sML.create("div", { id: "bibi-indicator-mark" }));
    for(var i = 1; i <= 12; i++) C.Indicator.Mark.appendChild(sML.create("span"));
    E.add("bibi:startLoading", function() {    sML.addClass(O.HTML, "loading"); N.note('Loading...'); });
    E.add("bibi:stopLoading",  function() { sML.removeClass(O.HTML, "loading"); N.note('');           });

    // Progress
    C.Indicator.Progress = C.Indicator.appendChild(sML.create("div", { id: "bibi-indicator-progress" }));
    C.Indicator.progress = function() {
        clearTimeout(C.Indicator.Progress.Timer_vanish);
        clearTimeout(C.Indicator.Progress.Timer_transparentize);
        setTimeout(function() { sML.addClass(C.Indicator.Progress, "active"); },  0);
        setTimeout(function() { sML.addClass(C.Indicator.Progress, "hot"   ); }, 10);
        C.Indicator.Progress.Timer_transparentize = setTimeout(function() { sML.removeClass(C.Indicator.Progress, "hot"   ); }, 1981      );
        C.Indicator.Progress.Timer_vanish         = setTimeout(function() { sML.removeClass(C.Indicator.Progress, "active"); }, 1981 + 255);
        E.dispatch("bibi:indicator:progress");
    };

    // Progress > Nombre
    C.Indicator.Progress.Nombre = C.Indicator.Progress.appendChild(sML.create("div", { id: "bibi-indicator-progress-nombre" }));
    sML.CSS.addRule("html.view-horizontal div#bibi-indicator-progress-nombre", "bottom: " + (O.ScrollBars.Height + 2) + "px;");
    sML.CSS.addRule("html.view-vertical   div#bibi-indicator-progress-nombre", "right: "  + (O.ScrollBars.Width  + 2) + "px;");
    C.Indicator.Progress.Nombre.Current   = C.Indicator.Progress.Nombre.appendChild(sML.create("span", { id: "bibi-indicator-progress-nombre-current"   }));
    C.Indicator.Progress.Nombre.Delimiter = C.Indicator.Progress.Nombre.appendChild(sML.create("span", { id: "bibi-indicator-progress-nombre-delimiter" }));
    C.Indicator.Progress.Nombre.Total     = C.Indicator.Progress.Nombre.appendChild(sML.create("span", { id: "bibi-indicator-progress-nombre-total"     }));
    C.Indicator.Progress.Nombre.Percent   = C.Indicator.Progress.Nombre.appendChild(sML.create("span", { id: "bibi-indicator-progress-nombre-percent"   }));
    E.add("bibi:indicator:progress", function() {
        C.Indicator.Progress.Nombre.Current.innerHTML   = R.Current.PageNumber;
        C.Indicator.Progress.Nombre.Delimiter.innerHTML = '/';
        C.Indicator.Progress.Nombre.Total.innerHTML     = R.Pages.length;
        C.Indicator.Progress.Nombre.Percent.innerHTML   = '(' + R.Current.Percent + '<span class="unit">%</span>)';
    });

    // Progress > Bar
    C.Indicator.Progress.Bar = C.Indicator.Progress.appendChild(sML.create("div", { id: "bibi-indicator-progress-bar" }));
    C.Indicator.Progress.Bar.Current = C.Indicator.Progress.Bar.appendChild(sML.create("span", { id: "bibi-indicator-progress-bar-current" }));
    E.add("bibi:indicator:progress", function() {
        C.Indicator.Progress.Bar.Current.style.width = (100 / R.Pages.length) + "%";
        C.Indicator.Progress.Bar.Current.style[S.PPD == "ltr" ? "right" : "left"] = ((R.Pages.length - R.Current.PageNumber) / R.Pages.length * 100) + "%";
    });

    E.add("bibi:scrolled", C.Indicator.progress);
    E.add("bibi:start", function() { setTimeout(C.Indicator.progress, 321); });

});