/*!
 *
 *  # Pipi: BiB/i Putter
 *
 *  - "Putting EPUBs in a Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://bibi.epub.link/
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - Fri May 15 19:13:00 2015 +0900
 */
 
Pipi = { Version: "0.999.0", Build: 20150515.0 };

(function(embedBibi) {
	if(window["bibi:pipi"]) return;
	window["bibi:pipi"] = { Status: "", Bibis: [], Anchors: [], Holders: [], Frames: [], Loaded: 0 };
	document.addEventListener("bibi:started",   function(E) { console.log("BiB/i: Started."); }, false);
	document.addEventListener("bibi:ended",     function(E) { console.log("BiB/i: Ended."); }, false);
	document.addEventListener("bibi:readied",   function(E) { console.log("BiB/i: Readied. - "   + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:loaded",    function(E) { console.log("BiB/i: Loaded. - "    + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:timeouted", function(E) { console.log("BiB/i: Timeouted. - " + E.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("DOMContentLoaded", embedBibi, false);
	  window.addEventListener("load",             embedBibi, false);
})(function() {
	if(window["bibi:pipi"].Status) return;
	window["bibi:pipi"].Status = "started";
	document.dispatchEvent(new CustomEvent("bibi:started", { detail: window["bibi:pipi"] }));
	var As = document.body.querySelectorAll('a[data-bibi]');
	for(var L = As.length, i = 0; i < L; i++) if(As[i].getAttribute("href")) window["bibi:pipi"].Anchors.push(As[i]);
	if(!window["bibi:pipi"].Anchors.length) {
		window["bibi:pipi"].Status = "ended";
		document.dispatchEvent(new CustomEvent("bibi:ended", { detail: window["bibi:pipi"] }));
	} else {
		var create = function(TagName, Properties) {
			var Element = document.createElement(TagName);
			for(var Attribute in Properties) Element[Attribute] = Properties[Attribute];
			return Element;
		};
		if(typeof window.CustomEvent === "undefined") {
			window.CustomEvent = function(EventName, Arguments) {
				Arguments = Arguments || {
					bubbles:    false,
					cancelable: false,
					detail:     undefined
				};
				var Event = document.createEvent("CustomEvent");
				Event.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
				return Event;
			};
			window.CustomEvent.prototype = window.Event.prototype;
		}
		if(
				  document.body.requestFullscreen ||       document.body.requestFullScreen ||
			document.body.webkitRequestFullscreen || document.body.webkitRequestFullScreen ||
			   document.body.mozRequestFullscreen ||    document.body.mozRequestFullScreen ||
				document.body.msRequestFullscreen
		) {
			window["bibi:pipi"].FullscreenEnabled = true;
			var requestFullscreen = (function(E) {
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
			var exitFullscreen = (function(D) {
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
			var getFullscreenElement = (function(D) {
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
		};
		// Embed
		window["bibi:pipi"].BibiPath = document.querySelector('script[src$="bib/i.js"]').src.replace(/\.js$/, "");
		document.getElementsByTagName("head")[0].appendChild(
			create("link", { rel: "stylesheet", id: "bibi-css", href: window["bibi:pipi"].BibiPath + ".css" })
		);
		for(var L = window["bibi:pipi"].Anchors.length, i = 0; i < L; i++) {
			// Bibi Object
			var Bibi = { Index: i, Number: i + 1 };
			// Anchor
			var Anchor = Bibi.Anchor = window["bibi:pipi"].Anchors[i];
			if(!/ bibi-anchor /.test(" " + Anchor.className + " ")) Anchor.className = "bibi-anchor" + (Anchor.className ? " " + Anchor.className : "");
			// Holder
			var Holder = Bibi.Holder = create("span", {
				className: "bibi-holder",
				title: (Anchor.innerText ? Anchor.innerText + " " : "") + "(powered by BiB/i)"
			});
			var Href      = Anchor.getAttribute("href");
			var Src       = Href;
			var Class     = Anchor.getAttribute("data-bibi-class");
			var ID        = Anchor.getAttribute("data-bibi-id");
			var Style     = Anchor.getAttribute("data-bibi-style");
			var Poster    = Anchor.getAttribute("data-bibi-poster");
			var Autostart = Anchor.getAttribute("data-bibi-autostart");
			if(Class) Holder.className += " " + Class;
			if(ID)    Holder.id = ID;
			if(Style) Holder.setAttribute("style", Style);
			if(Autostart && !/^(false|no)$/.test(Autostart)) {
				Src += (/#/.test(Src) ? "," : "#") + "pipi(autostart:true)";
			} else if(Poster) {
				var PosterLink = create("link", { href: Poster });
				Poster = PosterLink.href;
				delete PosterLink;
				Src += (/#/.test(Src) ? "," : "#") + "pipi(poster:" + encodeURIComponent(Poster).replace("(", "_BibiKakkoOpen_").replace(")", "_BibiKakkoClose_") + ")";
			}
			window["bibi:pipi"].Holders.push(Holder);
			// Frame
			var Frame = Bibi.Frame = Holder.appendChild(
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
			window["bibi:pipi"].Frames.push(Frame);
			// Buttons
			var SwitchNewWindow = Bibi.SwitchNewWindow = Holder.appendChild(
				create("a", {
					className: "bibi-icon bibi-switch-newwindow",
					title: "Open in New Window",
					target: "_blank",
					href: Href
				})
			);
			if(window["bibi:pipi"].FullscreenEnabled) {
				Holder.className += " bibi-fullscreen-enabled";
				var SwitchFullscreen = Bibi.SwitchFullscreen = Holder.appendChild(
					create("span", {
						className: "bibi-icon bibi-switch-fullscreen",
						title: "Enter Fullscreen",
						Holder: Holder,
						onclick: function() {
							if(!getFullscreenElement(document)) {
								requestFullscreen(this.Holder);
								this.title = "Exit Fullscreen";
							} else {
								exitFullscreen(document);
								this.title = "Enter Fullscreen";
							}
						}
					})
				);
			} else {
				Holder.className += " bibi-fullscreen-not-enabled";
			}
			// Add & Load
			window["bibi:pipi"].Bibis.push(Bibi);
			Frame.Bibi = Holder.Bibi = Anchor.Bibi = Bibi;
			Frame.addEventListener("load", function() {
				window["bibi:pipi"].Loaded++;
				this.Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:loaded", { detail: this.Bibi }));
				if(window["bibi:pipi"].Status != "timeouted" && window["bibi:pipi"].Loaded == window["bibi:pipi"].Anchors.length) {
					window["bibi:pipi"].Status = "loaded";
					document.dispatchEvent(new CustomEvent("bibi:loaded", { detail: window["bibi:pipi"] }));
				}
			}, false);
		//	Anchor.addEventListener("bibi:readied", function(E) { console.log("BiB/i: Readied - " + E.detail.Index + ": " + E.detail.Anchor.href); }, false);
			Anchor.addEventListener("bibi:loaded",  function(E) { console.log("BiB/i: Loaded. - " + E.detail.Index + ": " + E.detail.Anchor.href); }, false);
			Anchor.style.display = "none";
			Anchor.parentNode.insertBefore(Holder, Anchor);
			Anchor.dispatchEvent(new CustomEvent("bibi:readied", { detail: Bibi }));
			Anchor.dispatchEvent(new CustomEvent("bibi:holderadded", { detail: { holder: Holder }, bubbles: true, cancelable: true })); // for back compatibility
		}
		setTimeout(function() {
			if(window["bibi:pipi"].Status == "loaded") return;
			window["bibi:pipi"].Status = "timeouted";
			document.dispatchEvent(new CustomEvent("bibi:timeouted", { detail: window["bibi:pipi"] }));
		}, 12000);
		window["bibi:pipi"].Status = "readied";
		document.dispatchEvent(new CustomEvent("bibi:readied", { detail: window["bibi:pipi"] }));
	}
});
