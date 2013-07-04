// for BiB/i - http://sarasa.la/bib/i

(function() {
	if(window["bibi-status"]) return;
	window["bibi-status"] = "waiting";
	var embedBiBi = function() {
		if(window["bibi-status"] != "waiting") return;
		window["bibi-status"] = "processing";
		var BiBiAs = document.querySelectorAll ? document.querySelectorAll('a[data-bibi]') : (function() {
			var BiBiAs = [], As = document.body.getElementsByTagName("a");
			for(var L = As.length, i = 0; i < L; i++) if(As[i].getAttribute("data-bibi")) BiBiAs.push(As[i]);
			return BiBiAs;
		})();
		var SmartPhone = /((iPod|iPhone|iPad)( Simulator)?;|Android )/.test(navigator.userAgent);
		var BaseStyle = "display: inline-block; position: relative; margin: 0; padding: 0; border: none 0; vertical-align: top; line-height: 1; ";
		for(var L = BiBiAs.length, i = 0; i < L; i++) {
			if(!BiBiAs[i].getAttribute("href")) continue;
			var A = BiBiAs[i], Span = document.createElement("span"), Frame = document.createElement("iframe");
			var BiBi = {
				Src       : A.getAttribute("href"),
				Class     : A.getAttribute("data-bibi-class"),
				ID        : A.getAttribute("data-bibi-id"),
				Name      : A.getAttribute("data-bibi-name"),
				Style     : A.getAttribute("data-bibi-style"),
				Poster    : A.getAttribute("data-bibi-poster"),
				AutoStart : A.getAttribute("data-bibi-autostart")
			}
			if(BiBi.Class) Span.setAttribute("class", BiBiClass);
			if(BiBi.ID)    Span.setAttribute("id",    BiBiID);
			if(BiBi.Name)  Span.setAttribute("name",  BiBiName);
			Frame.setAttribute("frameborder", "0");
			Frame.setAttribute("scrolling", "yes");
			Frame.setAttribute("allowfullscreen", "true");
			Span.setAttribute( "style", BaseStyle + (BiBi.Style ? BiBi.Style : ""));
			Frame.setAttribute("style", BaseStyle + "width: 100%; height: 100%;");
			Span.appendChild(Frame);
			A.parentNode.insertBefore(Span, A);
			A.style.display = "none";
			Frame.onload = function() { try { this.contentWindow.O.ParentFrame = this; } catch(e) {} }
			Frame.src = BiBi.Src + ((!/&wait=[^&]+/.test(BiBi.Src) && (SmartPhone || !BiBi.AutoStart)) ? "&wait=true" : "");
		}
		window["bibi-status"] = "processed";
	}
	document.addEventListener("DOMContentLoaded", embedBiBi, false);
	  window.addEventListener("load",             embedBiBi, false);
})();
