




sML = /* JavaScript Library */ (function() { var sML = {

	Name        : "sML JavaScript Library",
	Description : "I'm a Simple and Middling Library.",
	Copyright   : "(c) 2013 Satoru MATSUSHIMA",
	Licence     : "Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php",
	Date        : "Tue July 4 13:36:00 2013 +0900",

	Version     : 0.9992,
	Build       : 20130704.0,

	WebSite     : "http://sarasa.la/sML"

}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Polarstar

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.DeviceName = sML.DN = (function(nUA, v2n) {
	var iOSV = /(iPod|iPhone|iPad)( Simulator)?;/.test(nUA) ? v2n(nUA, /^.+? OS ([\d_]+).+$/)       : undefined;
	var AndV = /Android /.test(nUA)                         ? v2n(nUA, /^.+? Android ([\d\.]+).+$/) : undefined;
	sML.OperatingSystem = sML.OS = {
		OSX     : ((nUA.indexOf("Mac")     > -1 && !iOSV) ? 1 : undefined),
		Windows : ((nUA.indexOf("Windows") > -1         ) ? 1 : undefined),
		Linux   : ((nUA.indexOf("Linux")   > -1 && !AndV) ? 1 : undefined),
		iOS     : iOSV,
		Android : AndV
	}
	sML.UserAgent = sML.UA = {
		WebKit           : ((nUA.indexOf("AppleWebKit") > -1) ? v2n(nUA, /^.+AppleWebKit\/([\d\.]+).+$/) : undefined),
		Safari           : ((nUA.indexOf("Safari/")     > -1) ? v2n(nUA, /^.+Version\/([\d\.]+).+$/)     : undefined),
		Chrome           : ((nUA.indexOf("Chrome/")     > -1) ? v2n(nUA, /^.+Chrome\/([\d\.]+).+$/)      : undefined),
		Gecko            : ((nUA.indexOf("Gecko/")      > -1) ? v2n(nUA, /^.+rv\:([\d\.]+).+$/)          : undefined),
		Firefox          : ((nUA.indexOf("Firefox/")    > -1) ? v2n(nUA, /^.+Firefox\/([\d\.]+).+$/)     : undefined),
		Presto           : ((nUA.indexOf("Presto")      > -1) ? v2n(nUA, /^.+Presto\/([\d\.]+).+$/)      : undefined),
		Opera            : ((nUA.indexOf("Opera/")      > -1) ? v2n(nUA, /^.+Version\/([\d\.]+).*$/)     : undefined),
		Trident          : undefined,
		InternetExplorer : undefined,
		Flash            : undefined
	}
	if(sML.OS.OSX)     return "Mac";
	if(sML.OS.Windows) return "PC";
	if(sML.OS.Linux)   return "PC";
	if(sML.OS.iOS)     return nUA.replace(/^.+?(iPod|iPhone|iPad)( Simulator)?;.+$/, "$1");
	if(sML.OS.Android) return nUA.replace(/^.+?\(.+?; ([^;]+)\).+$/, "$1");
	return "";
})(
	navigator.userAgent,
	function(t, r) { // Version To Number
		var N = parseFloat(t.replace(r, "$1").replace(/[_\.]/g, ",").replace(/\,/, ".").replace(/\,/g, ""));
		return (isNaN(N) ? undefined : N);
	}
);

try {
	sML.UA.Flash = parseFloat(navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin.description.replace(/^.+?([\d\.]+).*$/, "$1"));
} catch(e) {}

/*@cc_on
	sML.UA.Trident = sML.UA.InternetExplorer = document.documentMode ? document.documentMode : ((navigator.userAgent.indexOf("MSIE 7") > -1) ? 7 : 1);
	try {
		var fAX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"); // Farewell to Flash Player Under-7
		sML.UA.Flash = parseFloat(fAX.GetVariable("$version").replace(/^[^\d]+(\d+)\,([\d\,]+)$/, "$1.$2").replace(/\,/g, ""));
	} catch(e) {}
@*/

sML.OS.Mac = sML.OS.OSX, sML.OS.Win = sML.OS.Windows, sML.OS.Lin = sML.OS.Linux, sML.OS.And = sML.OS.Android;

sML.UA.WK = sML.UA.WebKit,  sML.UA.Sa = sML.UA.Safari, sML.UA.Ch = sML.UA.Chrome;
sML.UA.Ge = sML.UA.Gecko,   sML.UA.Fx = sML.UA.Firefox;
sML.UA.Pr = sML.UA.Presto,  sML.UA.Op = sML.UA.Opera;
sML.UA.Tr = sML.UA.Trident, sML.UA.IE = sML.UA.InternetExplorer;
sML.UA.Fl = sML.UA.Flash;

//----------------------------------------------------------------------------------------------------------------------------------------------

if(sML.UA.Opera && !window.console) console = { log: opera.postError };

sML.log = function() {
	for(var Log = arguments[0], L = arguments.length, i = 1; i < L; i++) Log += ", " + arguments[i];
	try { console.log(Log); } catch(e) {}
};

sML.write = function() {
	document.open();
	for(var L = arguments.length, i = 0; i < L; i++) document.write(arguments[i]);
	document.close();
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Event = {};

if(document.addEventListener) {
	sML.Event.add    = sML.addEventListener    = function(O, Ev, F, uC) { O.addEventListener(   Ev, F, (uC ? true : false)); return O; };
	sML.Event.remove = sML.removeEventListener = function(O, Ev, F, uC) { O.removeEventListener(Ev, F, (uC ? true : false)); return O; };
} else if(document.attachEvent) {
	sML.Event.add    = sML.addEventListener    = function(O, Ev, F)     { O.attachEvent("on" + Ev, F); return O; };
	sML.Event.remove = sML.removeEventListener = function(O, Ev, F)     { O.detachEvent("on" + Ev, F); return O; };
} else {
	sML.Event.add    = sML.addEventListener    = function(O, Ev, F)     { O["on" + Ev] = F; return O; };
	sML.Event.remove = sML.removeEventListener = function(O, Ev, F)     { O["on" + Ev] = F; return O; };
}

sML.stopPropagation = sML.Event.stopPropagation = sML.UA.IE ? function() { event.cancelBubble = true; } : function(e) { return e.stopPropagation(); };
sML.preventDefault  = sML.Event.preventDefault  = sML.UA.IE ? function() { event.returnValue = false; } : function(e) { return e.preventDefault();  };

sML.Event.add(window, "unload", function() { sML = null; delete sML; });

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.onRead = sML.onread = {
	Functions: [],
	execute: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
}

sML.onLoad = sML.onload = {
	Functions: [],
	execute: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
}

sML.done  = function(F) { return sML.onLoad.addEventListener(F); };
sML.ready = function(F) { return sML.onRead.addEventListener(F); };

if(document.addEventListener && (!sML.UA.WK || sML.UA.WK > 525)) {
	document.addEventListener("DOMContentLoaded", function() {
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		sML.onRead.execute();
	}, false);
} else if(document.attachEvent) {
	document.attachEvent("onreadystatechange", function() {
		if(document.readyState !== "complete") return;
		document.detachEvent("onreadystatechange", arguments.callee);
		sML.onRead.execute();
	});
	if(document.documentElement.doScroll && window == window.top) { (function() {
		if(sML.onRead.Executed) return;
		try { document.documentElement.doScroll("left"); } catch(e) { setTimeout(arguments.callee, 0); return; }
		sML.onRead.execute();
	})(); }
} else sML.onLoad.addEventListener(function() { sML.onRead.execute(); });

sML.Event.add(window, "load", function() {
	sML.Event.remove(window, "load", arguments.callee, false);
	sML.onLoad.execute();
}, false);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.onresizefont = sML.onResizeFont = {
	RegularFunctions: [],
	onZoomInFunctions: [],
	onZoomOutFunctions: [],
	addEventListener: function(F, S) {
		     if(S && S > 0) this.onZoomInFunctions.push(F);
		else if(S && S < 0) this.onZoomOutFunctions.push(F);
		else                this.RegularFunctions.push(F);
	},
	detect: function(E, T) {
		if(!E) var E = document.body;
		if(!T) var T = 200;
		this.checker = E;
		this.timer = setInterval(function() {
			var currentHeight = sML.Coord.getElementSize(sML.onResizeFont.checker).h;
			if(sML.onResizeFont.prevHeight && sML.onResizeFont.prevHeight != currentHeight) {
				var Functions = sML.onResizeFont.RegularFunctions;
				if(sML.onResizeFont.prevHeight && sML.onResizeFont.prevHeight < currentHeight) {
					Functions = Functions.concat(sML.onResizeFont.onZoomInFunctions);
				} else if(sML.onResizeFont.prevHeight && sML.onResizeFont.prevHeight > currentHeight) {
					Functions = Functions.concat(sML.onResizeFont.onZoomOutFunctions);
				}
				for(var L = Functions.length, i = 0; i < L; i++) Functions[i]();
			}
			sML.onResizeFont.prevHeight = currentHeight;
		}, T);
	},
	stopDetect: function() {
		if(this.timer) clearTimeout(this.timer);
	}
}

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Chain = function() {
	this.Functions = arguments.length ? sML.toArray(arguments) : [];
	this.add = function() {
		for(var L = arguments.length, i = 0; i < L; i++) this.Functions.push(arguments[i]);
	}
	this.start = this.next = function() {
		var F = this.Functions.shift();
		if(typeof F == "function") F.apply(null, arguments);
	}
	this.skip = function(D) {
		if(typeof D == "number") for(var i = 0; i < D; i++) this.Functions.shift();
	}
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- DOM / Elements

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.extendElements = function(tE) {
	if(tE.getElementsByClassName) return;
	var cEs = [tE.getElementsByTagName("*"), []];
	for(var L = cEs[0].length, i = 0; i < L; i++) cEs[1][i] = cEs[0][i];
	var Es = [tE].concat(cEs[1]);
	for(var L = Es.length, i = 0; i < L; i++) Es[i].getElementsByClassName = sML.getElementsByClassName;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if(!document.getElementsByClassName) {
	sML.getElementsByClassName = function(Cs) {
		var Es = [], aEs = this.getElementsByTagName("*"), Cs = Cs.replace(/^\s+/, "").replace(/\s+$/, "").split(" ").sort();
		for(var eL = aEs.length, i = 0; i < eL; i++) {
			var eCs = " " + aEs[i].className.replace(/^[\t\s]+/, "").replace(/[\t\s]+$/, "").split(" ").sort().join(" ") + " ";
			for(var m = 1, cL = Cs.length, j = 0; j < cL; j++) if(eCs.indexOf(" " + Cs[j] + " ") < 0) { m = 0; break; }
			if(m) Es.push(aEs[i]);
		}
		return Es;
	}
	if(window.HTMLElement && window.Document) {
		if(HTMLElement.prototype.getElementsByClassName == undefined) HTMLElement.prototype.getElementsByClassName = sML.getElementsByClassName;
		if(   Document.prototype.getElementsByClassName == undefined)    Document.prototype.getElementsByClassName = sML.getElementsByClassName;
	} else sML.onRead.addEventListener(function() { sML.extendElements(document); });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.getElementsByIds = document.getElementsByIds = function() {
	for(var Es = [], L = arguments.length, i = 0; i < L; i++) if(document.getElementById(arguments[i])) Es.push(document.getElementById(arguments[i]));
	return Es;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.getElements = sML.getElementsBySelector = function() {
	for(var i = 1, L = arguments.length; i < L; i++) arguments[0] += "," + arguments[i];
	return document.querySelectorAll(arguments[0]);
}

sML.getInnerText = function(E) {
	return E.innerText || E.textContent;
}

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.cloneObject = function(O) {
	var F = function() {};
	F.prototype = O;
	return new F();
}

sML.set = sML.edit = sML.setMembers = function(O, M, S) {
	if(M) for(var m in M) O[m] = M[m];
	if(S) sML.CSS.set(O, S);
	return O;
}

sML.create = sML.createElement = function(tagName, M, S) {
	return (tagName ? sML.set(document.createElement(tagName), M, S) : null);
}

sML.changeClass = sML.changeClassName = function(E, CN) {
	if(CN) E.className = CN;
	else /*@cc_on if(sML.UA.IE < 10) { E.removeAttribute("className"); } else @*/ E.removeAttribute("class");
	return E.className;
}

sML.addClass = sML.addClassName = function(E, CN) {
	if(typeof CN != "string") return E.className;
	CN = CN.replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "")
	if(!CN) return E.className;
	if(E.className) {
		if((" " + E.className + " ").indexOf(" " + CN + " ") > -1) return E.className;
		CN = E.className + " " + CN;
	}
	return sML.changeClass(E, CN);
}

sML.removeClass = sML.removeClassName = function(E, CN) {
	if(!E.className) return "";
	if(typeof CN != "string") return E.className;
	CN = CN.replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "")
	if(!CN) return E.className;
	if((" " + E.className + " ").indexOf(" " + CN + " ") <  0) return E.className;
	CN = (" " + E.className + " ").replace(" " + CN + " ", " ").replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "");
	return sML.changeClass(E, CN);
}

sML.insertBefore = function(E, S) {
	S.parentNode.insertBefore(E, S);
	return S.previousSibling;
}

sML.insertAfter = function(E, S) {
	S.parentNode.insertBefore(E, S.nextSibling);
	return S.nextSibling;
}

sML.replaceElement = function(E, S) {
	S.parentNode.insertBefore(E, S);
	E = S.previousSibling;
	S.parentNode.removeChild(S);
	return E;
}

sML.removeElement = function(E) {
	E.parentNode.removeChild(E);
}

sML.deleteElement = function(E) {
	if(E.parentNode) E.parentNode.removeChild(E);
	E.innerHTML = "";
	E = null;
	delete E;
}

sML.hatch = function() {
	for(var HTML = "", L = arguments.length, i = 0; i < L; i++) HTML += arguments[i];
	var egg = document.createElement("div");
	var chick = document.createDocumentFragment();
	var brood = function() {
		egg.innerHTML = HTML;
		for(var L = egg.childNodes.length, i = 0; i < L; i++) chick.appendChild(egg.firstChild);
	}
	if(sML.UA.IE && sML.UA.IE < 9) {
		egg.style.display = "none";
		document.body.appendChild(egg);
		brood();
		document.body.removeChild(egg);
	} else brood();
	return chick;
}

sML.getSelection = function() { /*@cc_on var S = document.selection.createRange().text + ""; return (S ? S : ""); @*/
	var S = window.getSelection() + "";
	return (S ? S : "");
}

sML.getContentDocument = function(F) { /*@cc_on return F.contentWindow.document; @*/
	return F.contentDocument;
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- CSS

//----------------------------------------------------------------------------------------------------------------------------------------------

if(!window.getComputedStyle) {
	     if(document.defaultView && document.defaultView.getComputedStyle) window.getComputedStyle = document.defaultView.getComputedStyle;
	else if(sML.UA.InternetExplorer)                                       window.getComputedStyle = function(E) { return E.currentStyle; };
}

sML.CSS = sML.S = {
	Prefix:        (sML.UA.WK ? "-webkit-"            : (sML.UA.Ge ? "-moz-"         : (sML.UA.IE ? "-ms-"            : (sML.UA.Op ? "-o-"            : "")))),
	TransitionEnd: (sML.UA.WK ? "webkitTransitionEnd" : (sML.UA.Ge ? "transitionend" : (sML.UA.IE ? "MSTransitionEnd" : (sML.UA.Op ? "oTransitionEnd" : "")))),
	AnimationEnd:  (sML.UA.WK ? "webkitAnimationEnd"  : (sML.UA.Ge ? "animationend"  : (sML.UA.IE ? "MSAnimationEnd"  : (sML.UA.Op ? "oAnimationEnd"  : "")))),
	Catalogue : [],
	getSFO : function(E) {
		for(var L = this.Catalogue.length, i = 0; i < L; i++) if(this.Catalogue[i].Element == E) return this.Catalogue[i];
		return this.Catalogue[this.Catalogue.push({ Element: E }) - 1];
	},
	getComputedStyle: function(E, P) {
		var S = E.currentStyle || document.defaultView.getComputedStyle(E, (P ? P : "")) 
		return S;
	},
	StyleSheets: [],
	getStyleSheet: function(ParentDocument) {
		/*@cc_on if(sML.UA.IE < 9) return ParentDocument.styleSheets[ParentDocument.styleSheets.length - 1]; @*/
		for(var L = this.StyleSheets.length, i = 0; i < L; i++) {
			if(this.StyleSheets[i].StyleFor == ParentDocument) {
				return this.StyleSheets[i].StyleSheet;
			}
		}
		var STYLE = ParentDocument.createElement("style");
		STYLE.appendChild(ParentDocument.createTextNode(""));
		ParentDocument.getElementsByTagName("head")[0].appendChild(STYLE);
		this.StyleSheets.push({ StyleFor: ParentDocument, StyleSheet: STYLE.sheet });
		return STYLE.sheet;
	},
	addRule: function(Selector, Styles, ParentDocument) {
		if(typeof Styles.join == "function") {
			Styles = Styles.join(" ");
		} else if(typeof Styles == "object") {
			var tStyles = [];
			for(var Property in Styles) tStyles.push(Property + ": " + Styles[Property] + ";");
			Styles = tStyles.join(" ");
		}
		var StyleSheet = this.getStyleSheet((ParentDocument ? ParentDocument : document));
		if(StyleSheet.addRule) {
			var Index = StyleSheet.rules.length;
			StyleSheet.addRule(Selector, Styles, Index);
			return Index;
		} else if(StyleSheet.insertRule) {
			return StyleSheet.insertRule(Selector + "{" + Styles + "}", StyleSheet.cssRules.length);
		}
		return null;
	},
	addRules: function(CSS, ParentDocument) {
		var Indexes = [];
		     if(typeof CSS.join == "function") for(var L = CSS.length / 2, i = 0; i < L; i++) Indexes.push(this.addRule(CSS[i * 2], CSS[i * 2 + 1], ParentDocument));
		else if(typeof CSS      == "object")   for(var Selector in CSS)                       Indexes.push(this.addRule(Selector,   CSS[Selector],  ParentDocument));
		return Indexes;
	},
	add: function(CSS, ParentDocument) {
		return this.addRules(CSS, ParentDocument);
	},
	removeRule: function(Index, ParentDocument) {
		var StyleSheet = this.getStyleSheet((ParentDocument ? ParentDocument : document));
		     if(StyleSheet.removeRule) StyleSheet.removeRule(Index);
		else if(StyleSheet.deleteRule) StyleSheet.deleteRule(Index);
		return Index;
	},
	removeRules: function(Indexes, ParentDocument) {
		for(var L = Indexes.length, i = 0; i < L; i++) this.removeRule(Indexes[i], ParentDocument);
		return Indexes;
	},
	remove: function(Indexes, ParentDocument) {
		return this.removeRules(Indexes, ParentDocument);
	},
	setProperty: function(E, P, V, pfx) {
		if(!E || !P) return E;
		     if(P == "opacity") return this.setOpacity(E, V); // 2012/11/01
		else if(/^(animation|box|column|filter|transition|transform|writing|background-size)/.test(P)) pfx = true; // 2013/06/30
		else if(P == "float") /*@cc_on P = "styleFloat"; // @*/ P = "cssFloat";
		if(pfx) E.style[this.Prefix + P] = V;
		E.style[P] = V;
		return E;
	},
	addTransitionEndListener: function(E, Fn) {
		if(typeof Fn != "function") return;
		E.sMLTransitionEndListener = Fn;
		sML.Event.add(E, this.TransitionEnd, E.sMLTransitionEndListener);
	},
	removeTransitionEndListener: function(E) {
		if(typeof E.sMLTransitionEndListener != "function") return;
		sML.Event.remove(E, this.TransitionEnd, E.sMLTransitionEndListener);
		delete E.sMLTransitionEndListener;
	},
	set: function(E, PV, Cb) {
		if(!E || typeof PV != "object") return E;
		this.removeTransitionEndListener(E);
		if(typeof Cb == "function") this.addTransitionEndListener(E, Cb);
		if(!(PV instanceof Array)) {
			var PVArray = [];
			for(var P in PV) {
				if(/^transition/.test(P)) this.setProperty(E, P, PV[P]);
				else                      PVArray[PVArray.push(P)] = PV[P];
			}
			PV = PVArray;
		}
		if(PV.length % 2 < 1) for(var L = PV.length / 2, i = 0; i < L; i++) this.setProperty(E, PV[i * 2], PV[i * 2 + 1]);
		return E;
	},
	getRGB: function(Property) {
		var RGB = Property.replace(/rgb\(([\d\., ]+)\)/, "$1").replace(/\s/g, "").split(",");
		for(var L = RGB.length, i = 0; i < L; i++) RGB[i] = parseInt(RGB[i]);
		return RGB;
	},
	getRGBA: function(Property) {
		var RGBA = Property.replace(/rgba?\(([\d\., ]+)\)/, "$1").replace(/\s/g, "").split(",");
		for(var L = RGBA.length, i = 0; i < L; i++) RGBA[i] = parseInt(RGBA[i]);
		if(!RGBA[3]) RGBA[3] = 1;
		return RGBA;
	},
	getOpacity: function(Ob) {
		/*@cc_on if(sML.UA.IE < 9) {
			if(!Ob.style || !Ob.style.filter) return 1;
			var Op = parseFloat(Ob.style.filter.replace(/alpha\(opacity=([\d\.]+)/, "$1")) / 100;
			return (isNaN(Op) ? 1 : Op); 
		} @*/
		var Op = parseFloat(Ob.style.opacity);
		return (isNaN(Op) ? 1 : Op);
	},
	setOpacity: function(Ob, Op) {
		/*@cc_on if(sML.UA.IE < 9) {
			if(Op >= 1) Ob.style.removeAttribute('filter');
			else        Ob.style.filter = "alpha(opacity=" + (Op * 100) + ")";
			return Ob;
		} @*/
		Ob.style.opacity = Op;
		return Ob;
	}
}

sML.style = sML.css = function(E, PV, Cb) { return sML.CSS.set(E, PV, Cb); }





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Transition

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Transition = sML.T = {
	Catalogue : [],
	getSFO : function(E) {
		for(var L = this.Catalogue.length, i = 0; i < L; i++) if(this.Catalogue[i].Element == E) return this.Catalogue[i];
		return this.Catalogue[this.Catalogue.push({ Element: E }) - 1];
	},
	begin : function(E, Ps, Fs) {
		if(!Ps) var Ps = {};
		if(!Fs) var Fs = {};
		this.Element = E;
		var SFO = this.getSFO(E);
		if(SFO.Timer) clearTimeout(SFO.Timer);
		SFO.Ps = { // Params
			c:                   0 , // "C"urrent Frame (auto)
			f: (Ps.f ? Ps.f :   10), // "F"rames
			t: (Ps.t ? Ps.t :   10), // "T"ime/Frames (milli-seconds)
			e: (Ps.e ? Ps.e : null), // "E"asing (default)
			x: (Ps.x ? Ps.x : null)  // "X" for Easing (default)
		}
		SFO.Fs = { // Functions
			s: (Fs.s ? Fs.s : null),
			m: (Fs.m ? Fs.m : null),
			e: (Fs.e ? Fs.e : null),
			c: (Fs.c ? Fs.c : null)
		}
		SFO.gN = SFO.getNext = function(S, E, e, x) {
			var s = 1, t = SFO.Ps.c / SFO.Ps.f;
			if(!e && SFO.Ps.e) var e = SFO.Ps.e;
			if(!x && SFO.Ps.x) var x = SFO.Ps.x;
			     if(!e)     s = t;
			else if(x == 0) s = t + e / (100 * Math.PI) * Math.sin(Math.PI * t);
			else if(!x)     s = t + e / 100 * (1 - t) * t;
			else            s = (100 + x * e) * t / (2 * x * e * t + 100 - x * e);
			return S + (E - S) * s;
		}
		SFO.gC = SFO.getNextRGBA = function(S, E, e, x) {
			var RGBA = [], sL = S.length, eL = E.length;
			if(sL == 4 && eL == 3) E[3] = 1;
			for(var i = 0; i < sL; i++) RGBA[i] = Math.round(this.gN(S[i], E[i]));
			return RGBA;
		}
		if(SFO.Fs.s) SFO.Fs.s.call(E, SFO);
		(function() {
			if(SFO.Ps.c++ != SFO.Ps.f) {
				if(SFO.Fs.m) SFO.Fs.m.call(E, SFO);
				SFO.Timer = setTimeout(arguments.callee, SFO.Ps.t);
			} else {
				if(SFO.Fs.e) SFO.Fs.e.call(E, SFO);
				if(SFO.Fs.c) SFO.Fs.c.call(E, SFO);
			}
		})();
	}
}

sML.transition = function(E, Ps, Fs) { return sML.Transition.begin(E, Ps, Fs); }





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Coords

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Coord = sML.C = {
	/*@cc_on setIEF : function() {
		var cX = window.screenLeft;
		var cY = window.screenTop;
		window.moveTo(cX, cY);
		this.IEF = { w: window.screenLeft - cX, h: window.screenTop  - cY };
		window.moveBy(-this.IEF.w, -this.IEF.h);
	}, @*/
	getScreenSize : function() {
		return { w: screen.availWidth, h: screen.availHeight };
	},
	getWindowInnerSize : ((sML.UA.WK || sML.UA.Op) ? function() {
		return { w: window.innerWidth, h: window.innerHeight };
	} : function() {
		var W = document.documentElement.clientWidth  || document.body.clientWidth  || document.body.scrollWidth;
		var H = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight
		return { w: W, h: H };
	}),
	getWindowOuterSize : function() {
		/*@cc_on
			if(!this.IEF) this.setIEF();
			var iS = this.getWindowInnerSize();
			return { w: iS.w + this.IEF.w * 2, h: iS.h + this.IEF.h + 50 }
		@*/
		return { w: window.outerWidth, h: window.outerHeight };
	},
	getDocumentSize : function() {
		/*@cc_on
			if(sML.UA.IE < 8) return { w: document.body.scrollWidth, h: document.body.scrollHeight };
		@*/
		var W = document.documentElement.scrollWidth  || document.body.scrollWidth;
		var H = document.documentElement.scrollHeight || document.body.scrollHeight;
		return { w: W, h: H };
	},
	getElementSize : function (E) {
		return { w: E.offsetWidth, h: E.offsetHeight };
	},
	getWindowCoord : function (E) {
		/*@cc_on
			if(!this.IEF) this.setIEF();
			var cX = window.screenLeft;
			var cY = window.screenTop;
			var X = cX - this.IEF.w;
			var Y = cY - this.IEF.h;
			if(X < 0) X = 0;
			if(Y < 0) Y = 0;
			return { x: X, y: Y };
		@*/
		var X = window.screenLeft || window.screenX;
		var Y = window.screenTop  || window.screenY;
		return { x: X, y: Y };
	},
	getScrollLimitCoord : function(RtL) {
		var dS = this.getDocumentSize();
		var wS = this.getWindowInnerSize();
		return { x: (dS.w - wS.w) * (RtL ? -1 : 1), y: (dS.h - wS.h) };
	},
	getScrollCoord : function() {
		var X = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		var Y = window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop;
		return { x: X, y: Y };
	},
	getElementCoord : function (E, RtL) {
		var eC = { x: E.offsetLeft, y: E.offsetTop };
		if(RtL) eC.x = eC.x + E.offsetWidth - window.innerWidth;
		while(E.offsetParent) {
			E = E.offsetParent;
			eC.x += E.offsetLeft;
			eC.y += E.offsetTop;
		}
		return eC;
	},
	getEventCoord : function(e) {
		/*@cc_on if(sML.UA.IE < 9) {
			return { x: event.clientX + document.documentElement.scrollLeft, y: event.clientY + document.documentElement.scrollTop }
		} @*/
		return (e ? { x: e.pageX, y: e.pageY } : { x: 0, y: 0 });
	},
	getCoord : function(O, RtL) {
		var C = {};
		if(RtL) {
			/****/ if(O == screen) {
				C.wh = sML.C.getScreenSize();
				C.rt = { x: C.wh.w, y:      0 };
				C.lb = { x:      0, y: C.wh.h };
			} else if(O == window) {
				C.wh = sML.C.getWindowInnerSize();
				C.rt = sML.C.getScrollCoord();
				C.lb = { x: C.rt.x - C.wh.w, y: C.rt.y + C.wh.h };
			} else if(O == document) {
				C.wh = sML.C.getDocumentSize();
				C.rt = { x:      0, y:      0 };
				C.lb = { x: C.wh.w, y: C.wh.h };
			} else if(O.tagName) {
				C.wh = sML.C.getElementSize(O);
				C.rt = sML.C.getElementCoord(O, 1);
				C.lb = { x: C.rt.x - C.wh.w, y: C.rt.y + C.wh.h };
			} else {
				return {};
			}
			C.cm = { x: Math.round((C.lb.x + C.rt.x) / 2), y: Math.round((C.rt.y + C.lb.y) / 2) };
			return {
				left:   C.lb.x,    l: C.lb.x,
				top:    C.rt.y,    t: C.rt.y,    y: C.rt.y,
				right:  C.rt.x,    r: C.rt.x,    x: C.rt.x,
				bottom: C.lb.y,    b: C.lb.y,
				center: C.cm.x,    c: C.cm.x,
				middle: C.cm.y,    m: C.cm.y,
				width:  C.wh.w,    w: C.wh.w,
				height: C.wh.h,    h: C.wh.h
			}
		} else {
			/****/ if(O == screen) {
				C.wh = sML.C.getScreenSize();
				C.lt = { x:      0, y:      0 };
				C.rb = { x: C.wh.w, y: C.wh.h };
			} else if(O == window) {
				C.wh = sML.C.getWindowInnerSize();
				C.lt = sML.C.getScrollCoord();
				C.rb = { x: C.lt.x + C.wh.w, y: C.lt.y + C.wh.h };
			} else if(O == document) {
				C.wh = sML.C.getDocumentSize();
				C.lt = { x:      0, y:      0 };
				C.rb = { x: C.wh.w, y: C.wh.h };
			} else if(O.tagName) {
				C.wh = sML.C.getElementSize(O);
				C.lt = sML.C.getElementCoord(O);
				C.rb = { x: C.lt.x + C.wh.w, y: C.lt.y + C.wh.h };
			} else {
				return {};
			}
			C.cm = { x: Math.round((C.lt.x + C.rb.x) / 2), y: Math.round((C.lt.y + C.rb.y) / 2) };
			return {
				left:   C.lt.x,    l: C.lt.x,    x: C.lt.x,
				top:    C.lt.y,    t: C.lt.y,    y: C.lt.y,
				right:  C.rb.x,    r: C.rb.x,
				bottom: C.rb.y,    b: C.rb.y,
				center: C.cm.x,    c: C.cm.x,
				middle: C.cm.y,    m: C.cm.y,
				width:  C.wh.w,    w: C.wh.w,
				height: C.wh.h,    h: C.wh.h
			}
		}
	},
	isInside : function(ARGUMENT, WHOLE, RtL) {
		var sWH = this.getWindowInnerSize();
//		if(RtL) sLT.x = sLT.x * -1;
		if(RtL) {
			var sRT = this.getScrollCoord();
			var sLT = { x: sRT.x - sWH.w, y: sRT.y         };
			var sRB = { x: sRT.x,         y: sRT.y + sWH.h };
		} else {
			var sLT = this.getScrollCoord();
			var sRB = { x: sLT.x + sWH.w, y: sLT.y + sWH.h };
		}
		if(ARGUMENT.tagName) {
			var eWH = this.getElementSize(ARGUMENT);
			if(RtL) {
				var eRT = this.getElementCoord(ARGUMENT, 1);
				var eLT = { x: eRT.x - eWH.w, y: eRT.y         };
				var eRB = { x: eRT.x,         y: eRT.y + eWH.h };
			} else {
				var eLT = this.getElementCoord(ARGUMENT);
				var eRB = { x: eLT.x + eWH.w, y: eLT.y + eWH.h };
			}
			var e_C = { x: (eLT.x + eRB.x) / 2, y: (eLT.y + eRB.y) / 2 };
			var lIn = ((eLT.x >= sLT.x) && (eLT.x <= sRB.x));
			var hIn = ((e_C.x >= sLT.x) && (e_C.x <= sRB.x));
			var rIn = ((eRB.x >= sLT.x) && (eRB.x <= sRB.x));
			var tIn = ((eLT.y >= sLT.y) && (eLT.y <= sRB.y));
			var vIn = ((e_C.y >= sLT.y) && (e_C.y <= sRB.y));
			var bIn = ((eRB.y >= sLT.y) && (eRB.y <= sRB.y));
			var xIn = WHOLE ? (lIn && rIn) : (lIn || hIn || rIn);
			var yIn = WHOLE ? (tIn && bIn) : (tIn || vIn || bIn);
		} else if(typeof ARGUMENT == "object") {
			if(typeof ARGUMENT.x == "number") {
				var xIn = ((ARGUMENT.x >= sLT.x) && (ARGUMENT.x <= sRB.x));
				if(typeof ARGUMENT.y != "number") return xIn;
			}
			if(typeof ARGUMENT.y == "number") {
				var yIn = ((ARGUMENT.y >= sLT.y) && (ARGUMENT.y <= sRB.y));
				if(typeof ARGUMENT.x != "number") return yIn;
			}
		}
		return (xIn && yIn);
	},
	scrollTo : function(tC, Ps, Fs, ForceScroll) {
		if(!Ps) var Ps = {};
		if(!Fs) var Fs = {};
		this.SFO = {};
		var RtL = (Ps.rtl || Ps.rl || Ps.vt || Ps.vertical || /-rl$/.test(Ps.writingMode ? Ps.writingMode : (Ps["writing-mode"] ? Ps["writing-mode"] : (Ps.wm ? Ps.wm : undefined))));
		if(sML.Coord.timer) clearTimeout(sML.Coord.timer);
		     if(typeof tC == "number") tC = { y: tC };
		else if(!tC) tC = {};
		else if(tC.tagName) tC = this.getElementCoord(tC, RtL);
		var SFO = this.SFO;
		var sC = this.getScrollCoord();
		var lC = this.getScrollLimitCoord(RtL);
		SFO.dC = {
			x: (typeof tC.x == "number" ? tC.x : sC.x),
			y: (typeof tC.y == "number" ? tC.y : sC.y)
		}
		if(RtL) {
			if(SFO.dC.x < lC.x) SFO.dC.x = lC.x;
			if(SFO.dC.x >    0) SFO.dC.x =    0;
		} else {
			if(SFO.dC.x > lC.x) SFO.dC.x = lC.x;
			if(SFO.dC.x <    0) SFO.dC.x =    0;
		}
		if(SFO.dC.y > lC.y) SFO.dC.y = lC.y;
		if(SFO.dC.y <    0) SFO.dC.y =    0;
		SFO.Ps = { // Params
			p: (Ps.p ? Ps.p : 0.25), // "P"roportion
			t: (Ps.t ? Ps.t : 20)    // "T"ime/Frames (milli-seconds)
		}
		SFO.Fs = { // Functions
			s: (Fs.s ? Fs.s : null),
			m: (Fs.m ? Fs.m : null),
			e: (Fs.e ? Fs.e : null),
			c: (Fs.c ? Fs.c : null)
		}
		if(ForceScroll) sML.Coord.preventUserScrolling();
		if(SFO.Fs.s) SFO.Fs.s(SFO);
		(function() {
			SFO.cC = sML.Coord.getScrollCoord();
			SFO.mV = {
				x: Math.floor((SFO.dC.x - SFO.cC.x) * SFO.Ps.p),
				y: Math.floor((SFO.dC.y - SFO.cC.y) * SFO.Ps.p)
			}
			if(Math.abs(SFO.mV.x) <= 1 && Math.abs(SFO.mV.y) <= 1) {
				RtL ? window.scrollBy(SFO.dC.x - SFO.cC.x, SFO.dC.y - SFO.cC.y) : window.scrollTo(SFO.dC.x, SFO.dC.y);
				if(ForceScroll) sML.Coord.allowUserScrolling();
				if(SFO.Fs.e) SFO.Fs.e(SFO);
				if(SFO.Fs.c) SFO.Fs.c(SFO);
			} else {
				window.scrollBy(SFO.mV.x, SFO.mV.y);
				sML.Coord.timer = setTimeout(arguments.callee, SFO.Ps.t);
				if(SFO.Fs.m) SFO.Fs.m(SFO);
			}
		})();
		if(!ForceScroll) this.addScrollCancelation();
	},
	addScrollCancelation : function() {
		   sML.addEventListener(document, "mousedown",      sML.Coord.cancelScrolling);
		   sML.addEventListener(document, "keydown",        sML.Coord.cancelScrolling);
		   sML.addEventListener(document, "mousewheel",     sML.Coord.cancelScrolling);
		   sML.addEventListener(document, "DOMMouseScroll", sML.Coord.cancelScrolling);
	},
	cancelScrolling : function() {
		clearTimeout(sML.Coord.timer);
		sML.removeEventListener(document, "mousedown",      sML.Coord.cancelScrolling);
		sML.removeEventListener(document, "keydown",        sML.Coord.cancelScrolling);
		sML.removeEventListener(document, "mousewheel",     sML.Coord.cancelScrolling);
		sML.removeEventListener(document, "DOMMouseScroll", sML.Coord.cancelScrolling);
	},
	preventUserScrolling: function() {
		   sML.addEventListener(document, "mousedown",      sML.preventDefault);
		   sML.addEventListener(document, "keydown",        sML.preventDefault);
		   sML.addEventListener(document, "mousewheel",     sML.preventDefault);
		   sML.addEventListener(document, "DOMMouseScroll", sML.preventDefault);
	},
	allowUserScrolling: function() {
		sML.removeEventListener(document, "mousedown",      sML.preventDefault);
		sML.removeEventListener(document, "keydown",        sML.preventDefault);
		sML.removeEventListener(document, "mousewheel",     sML.preventDefault);
		sML.removeEventListener(document, "DOMMouseScroll", sML.preventDefault);
	}
}

sML.getCoord = sML.Coord.getCoord;

sML.scrollTo = function(tC, Ps, Fs, ForceScroll) {
	if(typeof Fs == "function") Fs = { c: Fs };
	return sML.C.scrollTo(tC, Ps, Fs, ForceScroll);
}

sML.scrollBy = function(bD, Ps, Fs, ForceScroll) {
	if(typeof Fs == "function") Fs = { c: Fs };
	var tC = {}, wC = sML.C.getCoord(window, (bD.RtL || bD.rtl || bD["vertical-rl"] || bD.horizontal));
	if(bD.x) tC.x = wC.x + bD.x;
	if(bD.y) tC.y = wC.y + bD.y;
	sML.log(tC);
	return sML.C.scrollTo(tC, Ps, Fs, ForceScroll);
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ajax

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Ajax = sML.A = {
	ships : [],
	build : function() {
		var ship = {};
		try { ship.XHR = new XMLHttpRequest(); } catch(e) { try { ship.XHR = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) { try { ship.XHR = new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {} } }
		if(!ship.XHR) return sML.log("sML.ShipBuilder could not find XHR.");
		ship.sail = function(Ps, Fs) {
			if(!Ps) var Ps = {};
			if(!Fs) var Fs = {};
			Ps.method = (Ps.method && /^POST$/i.test(Ps.method)) ? "POST" : "GET";
			if(!Ps.auth) Ps.auth = ["", ""];
			if(Ps.async !== false) Ps.async = true;
//			if(!Ps.query.nocache) Ps.query.nocache = (new Date()).getTime();
			var QueryString = "";
			if(Ps.query) for(var Q in Ps.query) QueryString += "&" + Q + "=" + encodeURIComponent(Ps.query[Q]);
			if(QueryString) {
				if(Ps.method == "GET") {
					Ps.url = Ps.url + ((Ps.url.indexOf("?") > 0) ? QueryString : QueryString.replace(/^&/, "?"));
					QueryString = null;
				} else if(Ps.method == "POST") {
					QueryString = QueryString.replace(/^&/, "");
				}
			}
			this.XHR.onreadystatechange = function() {
				if(Fs[1] && this.readyState == 1) return Fs[1].call(this, this.responseText, this.responseXML); // loading
				if(Fs[2] && this.readyState == 2) return Fs[2].call(this, this.responseText, this.responseXML); // loaded
				if(Fs[3] && this.readyState == 3) return Fs[3].call(this, this.responseText, this.responseXML); // interactive
				if(Fs[4] && this.readyState == 4) return Fs[4].call(this, this.responseText, this.responseXML); // complete
				if(Fs[0]                        ) return Fs[0].call(this, this.responseText, this.responseXML);
			}
			if(Ps.mimetype) this.XHR.overrideMimeType(Ps.mimetype);
			this.XHR.open(Ps.method, Ps.url, Ps.async, Ps.auth[0], Ps.auth[1]);
			if(Ps.method == "POST") this.XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			this.XHR.send(QueryString);
			return this;
		}
		this.ships.push(ship);
		return ship;
	},
	open : function(URL, Settings) {
		if(typeof Settings != "object") var Settings = {};
		if(!Settings.method)    Settings.method = "get";
		if(!Settings.query)     Settings.query = null;
		if(!Settings.auth)      Settings.auth = ["", ""];
		if(!Settings.mimetype)  Settings.mimetype = null;
		if(!Settings.onsuccess) Settings.onsuccess = function() {};
		if(!Settings.onfailed)  Settings.onfailed  = function() { sML.each(arguments, function() { sML.log(this + ""); }); };
		if(!Settings.ontimeout) Settings.ontimeout = Settings.onfailed;
		var Ship = this.build();
		Ship.Timeout = 0;
		Ship.TimeoutTimer = setTimeout(function() {
			Ship.Timeout = 1;
			Settings.ontimeout("sML.AJAX.get Timeout: " + URL);
		}, 10000);
		Ship.sail({
			url: URL,
			method: Settings.method,
			mimetype: Settings.mimetype,
			query: Settings.query,
			auth: Settings.auth,
			overrideMimeType: Settings.overrideMimeType
		}, {
			4: function(rT, rX) {
				if(Ship.Timeout) return;
				clearTimeout(Ship.TimeoutTimer);
				if(Ship.XHR.status == 200 || Ship.XHR.status == 0) {
					Settings.onsuccess(rT, rX);
				} else {
					Settings.onfailed("sML.AJAX.get Failed: (" + Ship.XHR.status + ") " + URL);
				}
			}
		});
	}
}

sML.ajax = function(URL, Settings) { return sML.Ajax.open(URL, Settings); }




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Location / Hash / Query / History

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Location = sML.Loc = {
	RE: new RegExp('^((([a-z]+)://([^/\\?#]+))(/[^\\?#]*))(\\?[^\\?#]*)?(#[^#]*)?$'),
	getFile:         function(U   ) { return (U ? U : location.href).replace(this.RE, "$1"); },
	getOrigin:       function(U   ) { return (U ? U : location.href).replace(this.RE, "$2"); },
	getProtocol:     function(U   ) { return (U ? U : location.href).replace(this.RE, "$3"); },
	getHost:         function(U   ) { return (U ? U : location.href).replace(this.RE, "$4"); },
	getPathname:     function(U   ) { return (U ? U : location.href).replace(this.RE, "$5"); },
	getSearch:       function(U   ) { return (U ? U : location.href).replace(this.RE, "$6"); },
	getHash:         function(U   ) { return (U ? U : location.href).replace(this.RE, "$7"); },
	getDirectory:    function(U   ) { return this.getFile(U).replace(/\/[^\/]*$/, ""); },
	getId:           function(U   ) { return this.getHash(U).replace("#", ""); },
	getQueries:      function(U   ) {
		var UnQs = (U ? U : location.href).split("?");
		if(UnQs.length != 2) return {};
		var Queries = {};
		var KnVs = UnQs[1].replace(/#.*$/, "").split("&");
		for(var L = KnVs.length, i = 0; i < L; i++) {
			if(!KnVs[i]) continue;
			var KnV = KnVs[i].split("=");
			     if(KnV.length < 2) KnV[1] = null;
			else if(KnV.length > 2) KnV[1] = KnVs[i].replace(KnV[0] + "=", "");
			Queries[KnV[0]] = KnV[1];
		}
		return Queries;
	},
	isIndexFile:     function(U   ) { return (/index\.(x?html?|php|cgi|[ja]spx?)$/.test(this.getPathname(U))); },
	isSameFile:      function(U, L) { return (this.getFile(U)      == (L ? this.getOrigin(L)    : (location.protocol + "//" + location.host + location.pathname))                         ); },
	isSameOrigin:    function(U, L) { return (this.getOrigin(U)    == (L ? this.getOrigin(L)    : (location.protocol + "//" + location.host))                                             ); },
	isSameProtocol:  function(U, L) { return (this.getProtocol(U)  == (L ? this.getProtocol(L)  : (location.protocol))                                                                    ); },
	isSameHost:      function(U, L) { return (this.getHost(U)      == (L ? this.getHost(L)      : (location.host))                                                                        ); },
	isSameHash:      function(U, L) { return (this.getHash(U)      == (L ? this.getHash(L)      : (location.hash))                                                                        ); },
	isSameDirectory: function(U, L) { return (this.getDirectory(U) == (L ? this.getDirectory(L) : (location.protocol + "//" + location.host + location.pathname).replace(/\/[^\/]*$/, ""))); },
	isSameId:        function(U, L) { return (this.getId(U)        == (L ? this.getId(L)        : (location.hash).replace("#", ""))                                                       ); }
}

sML.getQueries = sML.Location.getQueries;





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Cookie

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Cookies = sML.cookies = {
	put: function(N, V, E) {
		if(!E) var E = 1;
		var Ex = new Date();
		document.cookie = N + '=' + V + '; path=/; expires=' + Ex.toGMTString(Ex.setTime(Ex.getTime() + 86400000 * E));
		return document.cookie;
	},
	del: function(N) {
		var Ex = new Date();
		document.cookie = N + "=%00; path=/; expires=" + Ex.toGMTString(Ex.setTime(Ex.getTime() - 86400000));
		return document.cookie;
	},
	get: function(N) {
		var Cs = document.cookie.split("; "), CookieValue = "";
		for(var L = Cs.length, i = 0; i < L; i++) {
			if(Cs[i].substr(0, N.length + 1) == (N + "=")) {
				CookieValue = Cs[i].substr(N.length + 1, Cs[i].length);
				break;
			}
		}
		return CookieValue;
	}
}

sML.CookieMonster = {
	Cookies: {},
	set: function(N, K, V) {
		if(!this.Cookies[N]) this.Cookies[N] = this.get(N);
		if(V == null) {
			if(typeof this.Cookies[N][K] != "undefined") delete this.Cookies[N][K];
		} else {
			this.Cookies[N][K] = V;
		}
		return this.Cookies[N];
	},
	put: function(N, E) {
		if(!sML.getLength(this.Cookies[N])) {
			sML.Cookies.del(N);
			return this.del(N);
		}
		var eV = "";
		for(var K in this.Cookies[N]) {
			eV += '"' + K + '":"' + this.Cookies[N][K] + '",';
		}
		eV = encodeURIComponent("{" + eV.replace(/\,$/, "") + "}");
		sML.Cookies.put(N, eV, E);
		return this.Cookies;
	},
	del: function(N) {
		if(this.Cookies[N]) {
			sML.Cookies.del(N);
			delete this.Cookies[N];
		}
		return this.Cookies;
	},
	get: function(N, K) {
		if(!this.Cookies[N]) {
			var V = "";
			try { V = eval("(" + decodeURIComponent(sML.Cookies.get(N)) + ")"); } catch(e) {}
			this.Cookies[N] = (typeof V == "object") ? V : {};
		}
		if(K) return ((typeof this.Cookies[N][K] == "undefined") ? "" : this.Cookies[N][K]);
		return this.Cookies[N];
	}
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Array / List

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.toArray = function() {
	for(var A = [], aL = arguments.length, i = 0; i < aL; i++) {
		if(typeof arguments[i].length == "undefined")              A.push(arguments[i]);
		else for(var eL = arguments[i].length, j = 0; j < eL; j++) A.push(arguments[i][j]);
	}
	return A;
}

sML.filter = function(A, F) {
	if(typeof F != "function") throw new TypeError();
	for(var newArray = [], L = A.length, i = 0; i < L; i++) if(F.call(A[i], i, A)) newArray.push(A[i]);
	return newArray;
}

sML.foreach = function(O, F, pThis) {
	for(var L = O.length, i = 0; i < L; i++) if(F.call(pThis, O[i], i, O) === false) break;
	return O;
}

sML.each    = function(O, F, iN, LN) {
	for(var L = (LN ? LN : O.length), i = (iN ? iN : 0); i < L; i++) if(F.call(O[i], i, O) === false) break;
	return O;
}

sML.firstOf = function(A) {
	return (A.length ? A[           0] : null);
}

sML.lastOf  = function(A) {
	return (A.length ? A[A.length - 1] : null);
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Math

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Math = {
	sum: function() {
		var Sum = 0;
		for(var L = arguments.length, i = 0; i < L; i++) {
			var Num = 0;
			     if(typeof arguments[i] == "number") Num = arguments[i];
			else if(typeof arguments[i] == "string") Num = arguments[i].length;
			Sum += Num;
		}
		return Sum;
	},
	random: function(A, B) {
		     if(isNaN(A) && isNaN(B)) A = 0, B = 1;
		else if(isNaN(A)            ) A = 0       ;
		else if(            isNaN(B))        B = 0;
		var Min = Math.min(A, B), Max = Math.max(A, B);
		return Math.floor(Math.random() * (Max - Min + 1)) + Min;
	}
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- String / Number

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.String = {
	padZero: function(N, D) {
		if((N + "").length >= D) return N;
		var Padding = "0";
		while(Padding.length < D) Padding += "0";
		return (Padding + N).slice(-D);
	},
	insertZeroWidthSpace: function(T) {
		return T.replace(/(?=\w)/g, "&#x200B;");
	},
	replace: function(T, R) {
		if(R.length % 2) return this;
		for(var L = R.length / 2, i = 0; i < L; i++) T = T.replace(R[i * 2], R[i * 2 + 1]);
		return T;
	}
}

sML.getLength = function(O) {
	if(typeof O == "object") {
		var L = 0;
		for(var i in O) L++;
		return L;
	}
	if(typeof O == "array" ) return        O.length;
	if(typeof O == "string") return        O.length;
	if(typeof O == "number") return ("" + O).length;
	return null;
}

sML.padZero = sML.zeroPadding = sML.String.padZero;
sML.insertZeroWidthSpace = sML.String.insertZeroWidthSpace;





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Full Screen

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.fullScreenEnabled = function(D) {
	if(!D) D = document;
	return ((D.body.requestFullScreen || D.body.webkitRequestFullScreen || D.body.mozRequestFullScreen || D.body.msRequestFullScreen || D.body.oRequestFullScreen) ? true : false);
}

sML.requestFullScreen = function(E) {
	if(!E) E = document.documentElement || document.body;
	if(E.requestFullScreen)       return E.requestFullScreen();
	if(E.webkitRequestFullScreen) return E.webkitRequestFullScreen();
	if(E.mozRequestFullScreen)    return E.mozRequestFullScreen();
	if(E.msRequestFullScreen)     return E.msRequestFullScreen();
	if(E.oRequestFullScreen)      return E.oRequestFullScreen();
}

sML.exitFullScreen = function(D) {
	if(!D) D = document;
	if(D.exitFullScreen)          return D.exitFullScreen();
	if(D.cencelFullScreen)        return D.cancelFullScreen();
	if(D.webkitExitFullScreen)    return D.webkitExitFullScreen();
	if(D.webkitCancelFullScreen)  return D.webkitCancelFullScreen();
	if(D.mozExitFullScreen)       return D.mozExitFullScreen();
	if(D.mozCancelFullScreen)     return D.mozCancelFullScreen();
	if(D.msExitFullScreen)        return D.msExitFullScreen();
	if(D.msCancelFullScreen)      return D.msCancelFullScreen();
	if(D.oExitFullScreen)         return D.oExitFullScreen();
	if(D.oCancelFullScreen)       return D.oCancelFullScreen();
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Readied ?

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.readied = 1; return sML; })();


