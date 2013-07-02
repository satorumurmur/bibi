// for BiB/i - http://sarasa.la/bib/i

(function() {
	if(window["bibi-status"]) return;
	window["bibi-status"] = "waiting";
	var embedBiBi = function() {
		if(window["bibi-status"] != "waiting") return;
		window["bibi-status"] = "processing";
		var SmartPhone = /((iPod|iPhone|iPad)( Simulator)?;|Android )/.test(navigator.userAgent);
		var BiBiAs = document.querySelectorAll ? document.querySelectorAll('a[data-bibi]') : (function() {
			var BiBiAs = [], As = document.body.getElementsByTagName("a");
			for(var L = As.length, i = 0; i < L; i++) if(As[i].getAttribute("data-bibi")) BiBiAs.push(As[i]);
			return BiBiAs;
		})();
		for(var L = BiBiAs.length, i = 0; i < L; i++) {
			if(!BiBiAs[i].getAttribute("href")) continue;
			var A = BiBiAs[i];
			var BiBi = A["BiB/i"] = {
				Frame  : document.createElement("iframe", { frameborder: 0, scrolling: "yes" }),
				Src    : A.getAttribute("href"),
				Class  : A.getAttribute("data-bibi-class"),
				ID     : A.getAttribute("data-bibi-id"),
				Name   : A.getAttribute("data-bibi-name"),
				Style  : A.getAttribute("data-bibi-style"),
				Poster : A.getAttribute("data-bibi-poster")
			}
			if(!/&wait=[^&]+/.test(BiBi.Src) && (SmartPhone || !A.getAttribute("data-bibi-autostart"))) BiBi.Src += "&wait=true";
			if(BiBi.Class) BiBi.Frame.setAttribute("class", BiBiClass);
			if(BiBi.ID)    BiBi.Frame.setAttribute("id",    BiBiID);
			if(BiBi.Name)  BiBi.Frame.setAttribute("name",  BiBiName);
			BiBi.Frame.setAttribute("style", "margin: 0; padding: 0; border: none 0; " + BiBi.Style ? BiBi.Style : "");
			A.style.display = "none";
			A.parentNode.insertBefore(BiBi.Frame, A);
			BiBi.Frame.onload = function() { this.contentWindow.O.ParentFrame = this; }
			BiBi.Frame.src = BiBi.Src;
			BiBi.Frame.contentWindow.parentFrame = BiBi.Frame;
		}
		window["bibi-status"] = "processed";
	}
	document.addEventListener("DOMContentLoaded", embedBiBi, false);
	  window.addEventListener("load",             embedBiBi, false);
})();
