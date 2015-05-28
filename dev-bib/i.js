/*!
 *
 *  # Pipi: BiB/i Putter
 *
 *  - "Putting EPUBs in a Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://bibi.epub.link/
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - Thu May 28 12:13:00 2015 +0900
 */

(function() {
	if(window["bibi:pipi"]) return;
	var Pipi = window["bibi:pipi"] = { Version: "0.999.0", Build: 20150528.0, Status: "", Bibis: [], Anchors: [], Holders: [], Frames: [], Loaded: 0 };
	Pipi.BibiPath = document.querySelector('script[src$="bib/i.js"]').src.replace(/\.js$/, "");
	Pipi.embed = function() {
		Pipi.Status = "Started";
		var As = document.body.querySelectorAll('a[data-bibi]');
		for(var L = As.length, i = 0; i < L; i++) if(As[i].getAttribute("href") && !As[i].Bibi) {
			// Bibi Object
			var Bibi = { Index: i, Number: i + 1 };
			// Anchor
			var Anchor = Bibi.Anchor = As[i];
			if(!/ bibi-anchor /.test(" " + Anchor.className + " ")) Anchor.className = "bibi-anchor" + (Anchor.className ? " " + Anchor.className : "");
			var Src = Href = Anchor.getAttribute("href");
			var Class      = Anchor.getAttribute("data-bibi-class");
			var ID         = Anchor.getAttribute("data-bibi-id");
			var Style      = Anchor.getAttribute("data-bibi-style");
			var Poster     = Anchor.getAttribute("data-bibi-poster");
			var Autostart  = Anchor.getAttribute("data-bibi-autostart");
			Pipi.Anchors.push(Anchor);
			// Holder
			var Holder = Bibi.Holder = Pipi.create("span", {
				className: "bibi-holder",
				title: (Anchor.innerText ? Anchor.innerText + " " : "") + "(powered by BiB/i)"
			});
			if(Class) Holder.className += " " + Class;
			if(ID)    Holder.id = ID;
			if(Style) Holder.setAttribute("style", Style);
			if(Autostart && !/^(false|no)$/.test(Autostart)) {
				Src += (/#/.test(Src) ? "," : "#") + "pipi(autostart:true)";
			} else if(Poster) {
				var PosterLink = Pipi.create("link", { href: Poster });
				Poster = PosterLink.href;
				delete PosterLink;
				Src += (/#/.test(Src) ? "," : "#") + "pipi(poster:" + encodeURIComponent(Poster).replace("(", "_BibiKakkoOpen_").replace(")", "_BibiKakkoClose_") + ")";
			}
			Pipi.Holders.push(Holder);
			// Frame
			var Frame = Bibi.Frame = Holder.appendChild(
				Pipi.create("iframe", {
					className: "bibi-frame",
					frameborder: "0",
					scrolling: "auto",
					allowfullscreen: "true",
					webkitallowfullscreen: "true",
					mozallowfullscreen: "true",
					src: Src
				})
			);
			Pipi.Frames.push(Frame);
			// Buttons
			var SwitchNewWindow = Bibi.SwitchNewWindow = Holder.appendChild(
				Pipi.create("a", {
					className: "bibi-icon bibi-switch-newwindow",
					title: "Open in New Window",
					target: "_blank",
					href: Href
				})
			);
			if(Pipi.FullscreenEnabled) {
				Holder.className += " bibi-fullscreen-enabled";
				var SwitchFullscreen = Bibi.SwitchFullscreen = Holder.appendChild(
					Pipi.create("span", {
						className: "bibi-icon bibi-switch-fullscreen",
						title: "Enter Fullscreen",
						Holder: Holder,
						onclick: function() {
							if(!Pipi.getFullscreenElement(document)) {
								Pipi.requestFullscreen(this.Holder);
								this.title = "Exit Fullscreen";
							} else {
								Pipi.exitFullscreen(document);
								this.title = "Enter Fullscreen";
							}
						}
					})
				);
			} else {
				Holder.className += " bibi-fullscreen-not-enabled";
			}
			// Add & Load
			Pipi.Bibis.push(Bibi);
			Frame.Bibi = Holder.Bibi = Anchor.Bibi = Bibi;
		}
		for(var i = 0, L = Pipi.Bibis.length; i < L; i++) {
			var Bibi = Pipi.Bibis[i];
			if(Bibi.Embedded) continue;
			Bibi.Frame.addEventListener("load", function() {
				Pipi.Loaded++;
				this.Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:Loaded", { detail: this.Bibi }));
				if(Pipi.Status != "Timeouted" && Pipi.Loaded == Pipi.Bibis.length) {
					Pipi.Status = "Loaded";
					document.dispatchEvent(new CustomEvent("bibi:Loaded", { detail: Pipi }));
				}
			}, false);
			Bibi.Anchor.addEventListener("bibi:Loaded", function(E) { console.log("BiB/i: Loaded. - #" + E.detail.Number + ": " + E.detail.Anchor.href); }, false);
			Bibi.Anchor.style.display = "none";
			Bibi.Anchor.parentNode.insertBefore(Bibi.Holder, Bibi.Anchor);
			Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:Readied", { detail: Bibi }));
			Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:holderadded", { detail: { holder: Bibi.Holder }, bubbles: true, cancelable: true })); // for back compatibility
		}
		setTimeout(function() {
			if(Pipi.Status == "Loaded") return;
			Pipi.Status = "Timeouted";
			document.dispatchEvent(new CustomEvent("bibi:Timeouted", { detail: Pipi }));
		}, 12000);
		Pipi.Status = "Readied";
		document.dispatchEvent(new CustomEvent("bibi:Readied", { detail: Pipi }));
		return Pipi.Bibis;
	};
	Pipi.create = function(TagName, Properties) {
		var Element = document.createElement(TagName);
		for(var Attribute in Properties) Element[Attribute] = Properties[Attribute];
		return Element;
	};
	if(
			  document.body.requestFullscreen ||       document.body.requestFullScreen ||
		document.body.webkitRequestFullscreen || document.body.webkitRequestFullScreen ||
		   document.body.mozRequestFullscreen ||    document.body.mozRequestFullScreen ||
			document.body.msRequestFullscreen
	) {
		Pipi.FullscreenEnabled = true;
		Pipi.requestFullscreen = (function(E) {
			var getFunction = function(M) { return function(O) { if(!O) O = E; return O[M](); } };
			if(E.requestFullscreen)                             return getFunction("requestFullscreen");
			if(E.requestFullScreen)                             return getFunction("requestFullScreen");
			if(E.webkitRequestFullscreen)                       return getFunction("webkitRequestFullscreen");
			if(E.webkitRequestFullScreen)                       return getFunction("webkitRequestFullScreen");
			if(E.mozRequestFullscreen)                          return getFunction("mozRequestFullscreen");
			if(E.mozRequestFullScreen)                          return getFunction("mozRequestFullScreen");
			if(E.msRequestFullscreen)                           return getFunction("msRequestFullscreen");
			return function() { return false; };
		})(document.documentElement);
		Pipi.exitFullscreen = (function(D) {
			var getFunction = function(M) { return function(O) { if(!O) O = D; return O[M](); } };
			if(D.exitFullscreen)                                return getFunction("exitFullscreen");
			if(D.cencelFullScreen)                              return getFunction("cencelFullScreen");
			if(D.webkitExitFullscreen)                          return getFunction("webkitExitFullscreen");
			if(D.webkitCancelFullScreen)                        return getFunction("webkitCancelFullScreen");
			if(D.mozExitFullscreen)                             return getFunction("mozExitFullscreen");
			if(D.mozRequestFullScreen)                          return getFunction("mozRequestFullScreen");
			if(D.msExitFullscreen)                              return getFunction("msExitFullscreen");
			return function() { return false; };
		})(document);
		Pipi.getFullscreenElement = (function(D) {
			var getFunction = function(M) { return function(O) { if(!O) O = D; return O[M]; } };
			if(typeof D.fullscreenElement       != "undefined") return getFunction("fullscreenElement");
			if(typeof D.fullScreenElement       != "undefined") return getFunction("fullScreenElement");
			if(typeof D.webkitFullscreenElement != "undefined") return getFunction("webkitFullscreenElement");
			if(typeof D.webkitFullScreenElement != "undefined") return getFunction("webkitFullScreenElement");
			if(typeof D.mozFullscreenElement    != "undefined") return getFunction("mozFullscreenElement");
			if(typeof D.mozFullScreenElement    != "undefined") return getFunction("mozFullScreenElement");
			if(typeof D.msFullscreenElement     != "undefined") return getFunction("msFullscreenElement");
			return function() { return null; };
		})(document);
	}
	if(typeof window.CustomEvent === "undefined") {
		window.CustomEvent = function(EventName, Arguments) {
			Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
			var E = document.createEvent("CustomEvent");
			E.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
			return E;
		};
		window.CustomEvent.prototype = window.Event.prototype;
	}
	document.getElementsByTagName("head")[0].appendChild(Pipi.create("link", { rel: "stylesheet", id: "bibi-css", href: Pipi.BibiPath + ".css" }));
	document.addEventListener("bibi:Readied",     function(E) { console.log("BiB/i: Readied. - "   + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:Loaded",      function(E) { console.log("BiB/i: Loaded. - "    + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:Timeouted",   function(E) { console.log("BiB/i: Timeouted. - " + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("DOMContentLoaded", Pipi.embed,                                                                                 false);
})();
