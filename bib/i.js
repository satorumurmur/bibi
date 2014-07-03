BibiPutter = { /*!
 *
 *  # BiB/i Putter
 *
 *  - "Putting EPUBs in Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://sarasa.la/bib/i
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - Fri July 4 09:00:00 2014 +0900
 */    Version: 0.997, Build: 20140704.0
};

(function(embedBiBi) {
	if(window["bibi-status"]) return;
	window["bibi-status"] = "waiting";
	document.addEventListener("DOMContentLoaded", embedBiBi, false);
	  window.addEventListener("load",             embedBiBi, false);
})(function() {
	if(window["bibi-status"] != "waiting") return;
	window["bibi-status"] = "processed";
	var As = document.querySelectorAll ? document.querySelectorAll('a[data-bibi]') : (function(_As, As) {
		for(var L = _As.length, i = 0; i < L; i++) if(_As[i].getAttribute("data-bibi")) As.push(_As[i]);
		return As;
	})(document.body.getElementsByTagName("a"), []);
	if(!As.length) return;
	var SmartPhone = /((iPod|iPhone|iPad)( Simulator)?;|Android )/.test(navigator.userAgent);
	var create = function(TagName, Properties) { var Element = document.createElement(TagName); for(var Attribute in Properties) Element[Attribute] = Properties[Attribute]; return Element; }
	document.getElementsByTagName("head")[0].appendChild(create("link", { rel: "stylesheet", href: As[0].href.replace(/^(.+?bib\/i)\/.+$/, "$1.css") }));
	for(var L = As.length, i = 0; i < L; i++) {
		if(!As[i].getAttribute("href")) continue;
		var Holder = create("span", { className: "bibi-holder", title: (As[i].innerText ? As[i].innerText + " " : "") + "(powered by BiB/i)" });
		var Href      = As[i].getAttribute("href");
		var Class     = As[i].getAttribute("data-bibi-class");
		var ID        = As[i].getAttribute("data-bibi-id");
		var Style     = As[i].getAttribute("data-bibi-style");
		var Poster    = As[i].getAttribute("data-bibi-poster");
		var Autostart = As[i].getAttribute("data-bibi-autostart");
		if(Class) Holder.className = Holder.className + " " + Class;
		if(ID)    Holder.id = ID;
		if(Style) Holder.setAttribute("style", Style);
		if(Poster && !Autostart) {
			Holder.className = Holder.className + " bibi-holder-with-poster";
			Holder.appendChild(create("span", { className: "bibi-poster", innerHTML: '<img alt="' + Holder.title + '" src="' + Poster + '" />' }));
		}
		if(Autostart) {
			Href = Href + (/#/.test(Href) ? "," : "#") + "auto(start)";
		}
		As[i].style.display = "none";
		As[i].parentNode.insertBefore(Holder, As[i]).appendChild(
			create("iframe", { className: "bibi-frame", frameborder: "0", scrolling: "auto", allowfullscreen: "true",
				onload: function() {
					var Holder = this.parentNode;
					this.contentWindow.addEventListener("click", function() {
						Holder.className = Holder.className + " bibi-holder-started";
						this.removeEventListener("click", arguments.callee);
					}, false);
					this.contentWindow.O.ParentFrame = this;
				},
				src: Href
			})
		);
	}
});
