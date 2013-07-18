/* BiB/i Putter = {

	Name        : "BiB/i Putter",
	Description : "Putting in an EPUB on Web Page with BiB/i.",
	Copyright   : "(c) 2013 Satoru MATSUSHIMA",
	Licence     : "Licensed Under the MIT License. - http://www.opensource.org/licenses/mit-license.php",
	Date        : "Tue July 18 15:00:00 2013 +0900",

	Version     : 0.985, // beta
	Build       : 20130718.0,

	WebSite     : "http://sarasa.la/bib/i"

}*/

(function(embedBiBi) {
	if(window["bibi-status"]) return;
	window["bibi-status"] = "waiting";
	document.addEventListener("DOMContentLoaded", embedBiBi, false);
	  window.addEventListener("load",             embedBiBi, false);
})(function() {
	if(window["bibi-status"] != "waiting") return;
	window["bibi-status"] = "processing";
	var BiBiAs = document.querySelectorAll ? document.querySelectorAll('a[data-bibi]') : (function(As, BiBiAs) {
		for(var L = As.length, i = 0; i < L; i++) if(As[i].getAttribute("data-bibi")) BiBiAs.push(As[i]);
		return BiBiAs;
	})(document.body.getElementsByTagName("a"), []);
	var SmartPhone = /((iPod|iPhone|iPad)( Simulator)?;|Android )/.test(navigator.userAgent);
	var BaseStyle = "display: inline-block; position: relative; margin: 0; padding: 0; border: none 0; vertical-align: top; line-height: 1; text-decoration: none; ";
	var create = function(TagName, Properties) {
		var Element = document.createElement(TagName);
		for(var Attribute in Properties) {
			     if(/^on[a-z]+$/.test(Attribute)) Element[Attribute] =            Properties[Attribute];
			else if(Properties[Attribute])        Element.setAttribute(Attribute, Properties[Attribute]);
		}
		return Element;
	}
	for(var L = BiBiAs.length, i = 0; i < L; i++) {
		var A = BiBiAs[i];
		if(!A.getAttribute("href")) continue;
		var BiBi = {
			Src         : A.getAttribute("href"),
			Class       : A.getAttribute("data-bibi-class"),
			ID          : A.getAttribute("data-bibi-id"),
			Style       : A.getAttribute("data-bibi-style"),
			Poster      : A.getAttribute("data-bibi-poster"),
			PosterStyle : A.getAttribute("data-bibi-poster"),
			AutoStart   : A.getAttribute("data-bibi-autostart")
		}
		var Holder = create("span", {
			className: "bibi-holder" + (BiBi.Class ? " " + BiBi.Class : ""),
			id: BiBi.ID,
			style: BaseStyle + (BiBi.Style ? BiBi.Style : "")
		});
		var Frame = create("iframe", {
			frameborder: "0",
			scrolling: "yes",
			allowfullscreen: "true",
			className: "bibi-frame",
			style: BaseStyle + "z-index: 1; width: 100%; height: 100%;",
			onload: function() {
				try { this.contentWindow.O.ParentFrame = this; } catch(e) {}
			}
		});
		A.style.display = "none";
		A.parentNode.insertBefore(Holder, A).appendChild(Frame);
		if(BiBi.Poster && !BiBi.AutoStart) {
			var Poster = Holder.appendChild(create("a", {
				className: "bibi-poster",
				style: BaseStyle + "position: absolute; z-index: 10; left: 0; top: 0; width: 100%; height: 100%; text-align: center; " + (BiBi.PosterStyle ? BiBi.PosterStyle : ""),
				href: BiBi.Src,
				onmouseover: function() { this.style.opacity = 0.75; },
				onmouseout:  function() { this.style.opacity = 1.00; },
				onclick: function() {
					var Poster = this;
					Poster.style.opacity = 0;
					try { Poster.parentNode.getElementsByTagName("iframe")[0].contentDocument.getElementById("bibi-play").click(); } catch(e) {}
					setTimeout(function() { Poster.parentNode.removeChild(Poster); }, 750);
					return false;
				}
			}));
			var PosterIMG = Poster.appendChild(create("img", {
				className: "bibi-poster-image",
				alt: (A.innerText ? A.innerText + " " : "") + "(powered by BiB/i)",
				src: BiBi.Poster,
				style: BaseStyle + "max-width: 100%; max-height: 100%; width: auto; height: auto;",
			}));
			Poster.style["-webkit-transition"] = Poster.style["-moz-transition"] = Poster.style["-ms-transition"] = Poster.style["-o-transition"] = Poster.style["transition"] = "opacity linear 0.25s";
			PosterIMG.title = PosterIMG.alt;
		}
		Frame.src = BiBi.Src + ((!/&wait=[^&]+/.test(BiBi.Src) && (SmartPhone || !BiBi.AutoStart)) ? "&wait=true" : "");
	}
	window["bibi-status"] = "processed";
});
