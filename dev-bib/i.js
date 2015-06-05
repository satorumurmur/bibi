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
		//	var BDM        = Anchor.getAttribute("data-bibi-book-display-mode");
		//	var SLA        = Anchor.getAttribute("data-bibi-spread-layout-axis");
			var To         = Anchor.getAttribute("data-bibi-to");
			var View       = Anchor.getAttribute("data-bibi-view");
			var Arrows     = Anchor.getAttribute("data-bibi-arrows");
			Anchor.addEventListener("bibi:load",              function(Eve) { console.log("BiB/i: Loaded. - #"               + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
			Anchor.addEventListener("bibi:openInNewWindow",   function(Eve) { console.log("BiB/i: Opened in New Window. - #" + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
			Anchor.addEventListener("bibi:requestFullscreen", function(Eve) { console.log("BiB/i: Entered Fullscreen. - #"   + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
			Anchor.addEventListener("bibi:exitFullscreen",    function(Eve) { console.log("BiB/i: Exited Fullscreen. - #"    + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
			Pipi.Anchors.push(Anchor);
			// Holder
			var Holder = Bibi.Holder = Pipi.create("span", {
				className: "bibi-holder",
				title: (Anchor.innerText ? Anchor.innerText + " " : "") + "(powered by BiB/i)"
			});
			if(Class) Holder.className += " " + Class;
			if(ID)    Holder.id = ID;
			if(Style) Holder.setAttribute("style", Style);
			var PipiFragments = [];
			if(typeof Autostart == "string" && /^(undefined|autostart|yes|true)?$/.test(Autostart)) {
				PipiFragments.push("autostart");
			}
			if(Poster) {
				var PosterLink = Pipi.create("link", { href: Poster });
				Poster = PosterLink.href;
				delete PosterLink;
				PipiFragments.push("poster:" + Pipi.encode(Poster));
			}
			if(location.origin != Anchor.origin) {
				PipiFragments.push("parent-origin:" + Pipi.encode(location.origin))
			}
			if(To && /^\d[\d\-\.]+$/.test(To)) {
				PipiFragments.push("to:" + To);
			}
			if(View && /^fixed$/.test(View)) {
				PipiFragments.push("view:" + View);
			}
			if(Arrows && /^hidden$/.test(Arrows)) {
				PipiFragments.push("arrows:" + Arrows);
			}
			if(PipiFragments.length) Src += (/#/.test(Src) ? "," : "#") + "pipi(" + PipiFragments.join(",") + ")"
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
			Frame.addEventListener("load", function() {
				Pipi.Loaded++;
				this.Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:load", { detail: this.Bibi }));
				if(Pipi.Status != "Timeouted" && Pipi.Loaded == Pipi.Bibis.length) {
					Pipi.Status = "Loaded";
					document.dispatchEvent(new CustomEvent("bibi:load", { detail: Pipi }));
				}
			}, false);
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
			SwitchNewWindow.addEventListener("click", function(Eve) {
				Eve.stopPropagation();
				Anchor.dispatchEvent(new CustomEvent("bibi:openInNewWindow", { detail: this.Bibi }));
				return true;
			});
			if(Pipi.FullscreenEnabled) {
				Holder.className += " bibi-fullscreen-enabled";
				var SwitchFullscreen = Bibi.SwitchFullscreen = Holder.appendChild(
					Pipi.create("span", {
						className: "bibi-icon bibi-switch-fullscreen",
						title: "Enter Fullscreen",
						Holder: Holder
					})
				);
				SwitchFullscreen.addEventListener("click", function(Eve) {
					Eve.preventDefault();
					Eve.stopPropagation();
					if(!Pipi.getFullscreenElement(document)) {
						Pipi.requestFullscreen(this.Holder);
						this.title = "Exit Fullscreen";
						Anchor.dispatchEvent(new CustomEvent("bibi:requestFullscreen", { detail: this.Bibi }));
					} else {
						Pipi.exitFullscreen(document);
						this.title = "Enter Fullscreen";
						Anchor.dispatchEvent(new CustomEvent("bibi:exitFullscreen", { detail: this.Bibi }));
					}
					return true;
				});
			} else {
				Holder.className += " bibi-fullscreen-not-enabled";
				var SwitchFullscreen = {};
			}
			// Add & Load
			Pipi.Bibis.push(Bibi);
			Frame.Bibi = Holder.Bibi = Anchor.Bibi = SwitchNewWindow.Bibi = SwitchFullscreen.Bibi = Bibi;
		}
		for(var i = 0, L = Pipi.Bibis.length; i < L; i++) {
			if(Pipi.Bibis[i].Embedded) continue;
			var Bibi = Pipi.Bibis[i];
			Bibi.Anchor.style.display = "none";
			Bibi.Anchor.parentNode.insertBefore(Bibi.Holder, Bibi.Anchor);
			Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:ready",       { detail: Bibi }));
			Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:holderadded", { detail: { holder: Bibi.Holder }, bubbles: true, cancelable: true })); // for back compatibility
		}
		setTimeout(function() {
			if(Pipi.Status == "Loaded") return;
			Pipi.Status = "Timeouted";
			document.dispatchEvent(new CustomEvent("bibi:timeout", { detail: Pipi }));
		}, 12000);
		Pipi.Status = "Readied";
		document.dispatchEvent(new CustomEvent("bibi:ready", { detail: Pipi }));
		return Pipi.Bibis;
	};
	Pipi.encode = function(Str) { return encodeURIComponent(Str).replace("(", "_BibiKakkoOpen_").replace(")", "_BibiKakkoClose_"); };
	Pipi.create = function(TagName, Properties) {
		var Ele = document.createElement(TagName);
		for(var Attribute in Properties) Ele[Attribute] = Properties[Attribute];
		return Ele;
	};
	if(
			  document.body.requestFullscreen ||       document.body.requestFullScreen ||
		document.body.webkitRequestFullscreen || document.body.webkitRequestFullScreen ||
		   document.body.mozRequestFullscreen ||    document.body.mozRequestFullScreen ||
			document.body.msRequestFullscreen
	) {
		Pipi.FullscreenEnabled = true;
		Pipi.requestFullscreen = (function(Ele) {
			var getFunction = function(M) { return function(O) { if(!O) O = Ele; return O[M](); } };
			if(Ele.requestFullscreen)                             return getFunction("requestFullscreen");
			if(Ele.requestFullScreen)                             return getFunction("requestFullScreen");
			if(Ele.webkitRequestFullscreen)                       return getFunction("webkitRequestFullscreen");
			if(Ele.webkitRequestFullScreen)                       return getFunction("webkitRequestFullScreen");
			if(Ele.mozRequestFullscreen)                          return getFunction("mozRequestFullscreen");
			if(Ele.mozRequestFullScreen)                          return getFunction("mozRequestFullScreen");
			if(Ele.msRequestFullscreen)                           return getFunction("msRequestFullscreen");
			return function() { return false; };
		})(document.documentElement);
		Pipi.exitFullscreen = (function(Doc) {
			var getFunction = function(M) { return function(O) { if(!O) O = Doc; return O[M](); } };
			if(Doc.exitFullscreen)                                return getFunction("exitFullscreen");
			if(Doc.cencelFullScreen)                              return getFunction("cencelFullScreen");
			if(Doc.webkitExitFullscreen)                          return getFunction("webkitExitFullscreen");
			if(Doc.webkitCancelFullScreen)                        return getFunction("webkitCancelFullScreen");
			if(Doc.mozExitFullscreen)                             return getFunction("mozExitFullscreen");
			if(Doc.mozRequestFullScreen)                          return getFunction("mozRequestFullScreen");
			if(Doc.msExitFullscreen)                              return getFunction("msExitFullscreen");
			return function() { return false; };
		})(document);
		Pipi.getFullscreenElement = (function(Doc) {
			var getFunction = function(M) { return function(O) { if(!O) O = Doc; return O[M]; } };
			if(typeof Doc.fullscreenElement       != "undefined") return getFunction("fullscreenElement");
			if(typeof Doc.fullScreenElement       != "undefined") return getFunction("fullScreenElement");
			if(typeof Doc.webkitFullscreenElement != "undefined") return getFunction("webkitFullscreenElement");
			if(typeof Doc.webkitFullScreenElement != "undefined") return getFunction("webkitFullScreenElement");
			if(typeof Doc.mozFullscreenElement    != "undefined") return getFunction("mozFullscreenElement");
			if(typeof Doc.mozFullScreenElement    != "undefined") return getFunction("mozFullScreenElement");
			if(typeof Doc.msFullscreenElement     != "undefined") return getFunction("msFullscreenElement");
			return function() { return null; };
		})(document);
	}
	if(typeof window.CustomEvent === "undefined") {
		window.CustomEvent = function(EventName, Arguments) {
			Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
			var Eve = document.createEvent("CustomEvent");
			Eve.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
			return Eve;
		};
		window.CustomEvent.prototype = window.Event.prototype;
	}
	document.getElementsByTagName("head")[0].appendChild(Pipi.create("link", { rel: "stylesheet", id: "bibi-css", href: Pipi.BibiPath + ".css" }));
	document.addEventListener("bibi:ready",             function(Eve) { console.log("BiB/i: Readied. - "   + Eve.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:load",              function(Eve) { console.log("BiB/i: Loaded. - "    + Eve.detail.Bibis.length + " Bibi(s)."); }, false);
	document.addEventListener("bibi:timeout",           function(Eve) { console.log("BiB/i: Timeouted.");                                            }, false);
	document.addEventListener("DOMContentLoaded",       Pipi.embed,                                                                                     false);
})();
