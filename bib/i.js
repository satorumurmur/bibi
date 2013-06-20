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
			var Href = BiBiAs[i].getAttribute("href");
			if(!Href) continue;
			if(SmartPhone) Href = Href.replace(/&wait=[^&]+/, "") + "&wait=true";
			var IFrame = document.createElement("iframe");
			IFrame.setAttribute("frameborder",  0);
			IFrame.setAttribute("scrolling", "yes");
			IFrame.setAttribute("style", BiBiAs[i].getAttribute("data-bibi-style"));
			IFrame.setAttribute("src", Href);
			BiBiAs[i].style.display = "none";
			BiBiAs[i].parentNode.insertBefore(IFrame, BiBiAs[i]);
		}
		window["bibi-status"] = "processed";
	}
	document.addEventListener("DOMContentLoaded", embedBiBi, false);
	  window.addEventListener("load",           embedBiBi, false);
})();
