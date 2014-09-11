Pipi = { /*!
 *
 *  # Pipi: BiB/i Putter
 *
 *  - "Putting EPUBs in Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://sarasa.la/bib/i
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - Tue August 19 15:00:00 2014 +0900
 */    Version: "0.997.0", Build: 20140819.0
};

(function(embedBibi) {
	if(window["bibi-pipi"]) return;
	window["bibi-pipi"] = { Status: "waiting" };
	document.addEventListener("DOMContentLoaded", embedBibi, false);
	  window.addEventListener("load",             embedBibi, false);
})(function() {
	if(window["bibi-pipi"].Status != "waiting") return;
	window["bibi-pipi"].Status = "processing";
	var As = document.querySelectorAll ? document.querySelectorAll('a[data-bibi]') : (function(_As, As) {
		for(var L = _As.length, i = 0; i < L; i++) if(_As[i].getAttribute("data-bibi")) As.push(_As[i]);
		return As;
	})(document.body.getElementsByTagName("a"), []);
	if(As.length) {
		var create = function(TagName, Properties) {
			var Element = document.createElement(TagName);
			for(var Attribute in Properties) Element[Attribute] = Properties[Attribute];
			return Element;
		};
		var BibiPath = As[0].href.replace(/^(.+?bib\/i)\/.+$/, "$1");
		var FullScreenEnabled = (function(B) {
			if(B.requestFullscreen       || B.requestFullScreen)       return true;
			if(B.webkitRequestFullscreen || B.webkitRequestFullScreen) return true;
			if(B.mozRequestFullscreen    || B.mozRequestFullScreen)    return true;
			if(B.msRequestFullscreen)                                  return true;
			return false;
		})(document.body);
		if(FullScreenEnabled) {
			window["bibi-pipi"].requestFullscreen = function(E) {
				if(E.requestFullscreen)       return E.requestFullscreen();
				if(E.requestFullScreen)       return E.requestFullScreen();
				if(E.webkitRequestFullscreen) return E.webkitRequestFullscreen();
				if(E.webkitRequestFullScreen) return E.webkitRequestFullScreen();
				if(E.mozRequestFullscreen)    return E.mozRequestFullscreen();
				if(E.mozRequestFullScreen)    return E.mozRequestFullScreen();
				if(E.msRequestFullscreen)     return E.msRequestFullscreen();
			};
			window["bibi-pipi"].exitFullscreen = function(D) {
				if(D.exitFullscreen)          return D.exitFullscreen();
				if(D.cencelFullScreen)        return D.cancelFullScreen();
				if(D.webkitExitFullscreen)    return D.webkitExitFullscreen();
				if(D.webkitCancelFullScreen)  return D.webkitCancelFullScreen();
				if(D.mozExitFullscreen)       return D.mozExitFullscreen();
				if(D.mozCancelFullScreen)     return D.mozCancelFullScreen();
				if(D.msExitFullscreen)        return D.msExitFullscreen();
			};
			window["bibi-pipi"].getFullscreenElement = function(D) {
				if(D.fullscreenElement)       return D.fullscreenElement;
				if(D.fullScreenElement)       return D.fullScreenElement;
				if(D.webkitFullscreenElement) return D.webkitFullscreenElement;
				if(D.webkitFullScreenElement) return D.webkitFullScreenElement;
				if(D.mozFullscreenElement)    return D.mozFullscreenElement;
				if(D.mozFullScreenElement)    return D.mozFullScreenElement;
				if(D.msFullscreenElement)     return D.msFullscreenElement;
				return null;
			};
		}
		document.getElementsByTagName("head")[0].appendChild(
			create("link", { rel: "stylesheet", id: "bibi-css", href: BibiPath + "/res/styles/pipi.css" })
		);
		window["bibi-pipi"].Holders = [];
		for(var L = As.length, i = 0; i < L; i++) {
			if(!As[i].getAttribute("href")) continue;
			var Holder = create("span", {
				className: "bibi-holder " + (FullScreenEnabled ? "bibi-fullscreen-enabled" : "bibi-fullscreen-not-enabled"),
				title: (As[i].innerText ? As[i].innerText + " " : "") + "(powered by BiB/i)"
			});
			var Href      = As[i].getAttribute("href");
			var Src       = Href;
			var Class     = As[i].getAttribute("data-bibi-class");
			var ID        = As[i].getAttribute("data-bibi-id");
			var Style     = As[i].getAttribute("data-bibi-style");
			var Poster    = As[i].getAttribute("data-bibi-poster");
			var Autostart = As[i].getAttribute("data-bibi-autostart");
			if(Class) Holder.className += " " + Class;
			if(ID)    Holder.id = ID;
			if(Style) Holder.setAttribute("style", Style);
			if(Autostart) {
				Src += (/#/.test(Src) ? "," : "#") + "pipi(autostart:true)";
			} else if(Poster) {
				var PosterLink = create("link", { href: Poster });
				Poster = PosterLink.href;
				delete PosterLink;
				Src += (/#/.test(Src) ? "," : "#") + "pipi(poster:" + encodeURIComponent(Poster).replace("(", "_BibiKakkoOpen_").replace(")", "_BibiKakkoClose_") + ")";
			}
			As[i].style.display = "none";
			As[i].parentNode.insertBefore(Holder, As[i]);
			Holder.appendChild(
				create("iframe", {
					className: "bibi-frame",
					frameborder: "0",
					scrolling: "auto",
					allowfullscreen: "true",
					webkitallowfullscreen: "true",
					mozallowfullscreen: "true",
					src: Src
				})
			);
			Holder.SwitchNewWindow = Holder.appendChild(
				create("a", {
					className: "bibi-switch-newwindow",
					title: "Open in New Window",
					target: "_blank",
					href: Href
				})
			);
			if(FullScreenEnabled) {
				Holder.className += " bibi-fullscreen-enabled";
				Holder.SwitchFullscreen = Holder.appendChild(
					create("span", {
						className: "bibi-switch-fullscreen",
						title: "Enter Fullscreen",
						Holder: Holder,
						onclick: function() {
							if(!window["bibi-pipi"].getFullscreenElement(document)) {
								window["bibi-pipi"].requestFullscreen(this.Holder);
								this.title = "Exit Fullscreen";
							} else {
								window["bibi-pipi"].exitFullscreen(document);
								this.title = "Enter Fullscreen";
							}
						}
					})
				);
			}
			window["bibi-pipi"].Holders.push(Holder);
		}
	}
	window["bibi-pipi"].Status = "processed";
});
