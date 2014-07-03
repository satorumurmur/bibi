



sML = (function() { var sML = { /*!
 *
 *  # sML JavaScript Library
 *
 *  - "I'm a Simple and Middling Library."
 *  - (c) Satoru MATSUSHIMA - http://sarasa.la/sML
 *  _ Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 *  - Thu July 03 18:58:00 2014 +0900
 */    Version: 0.9995, Build: 20140703.0
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
		Opera            : ((nUA.indexOf("OPR/")        > -1) ? v2n(nUA, /^.+OPR\/([\d\.]+).*$/)         : undefined),
		Trident          : ((nUA.indexOf("Trident/")    > -1) ? v2n(nUA, /^.+Trident\/([\d\.]+).*$/)     : undefined),
		InternetExplorer : ((nUA.indexOf("MSIE ")       > -1) ? v2n(nUA, /^.+MSIE ([\d\.]+).*$/)         : undefined),
		Flash            : undefined
	}
	if(sML.UA.Trident >= 7) sML.UA.InternetExplorer = v2n(nUA, /^.+rv:([\d\.]+).*$/);
	if(!sML.UA.Opera) sML.UA.Opera = ((nUA.indexOf("Opera/") > -1) ? v2n(nUA, /^.+Version\/([\d\.]+).*$/) : undefined);
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
if(sML.UA.InternetExplorer) { try {
	sML.UA.Flash = parseFloat((new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")).GetVariable("$version").replace(/^[^\d]+(\d+)\,([\d\,]+)$/, "$1.$2").replace(/\,/g, ""));
} catch(e) {} }

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
	try { return console.log(Log); } catch(e) {}
};

sML.write = function() {
	document.open();
	for(var L = arguments.length, i = 0; i < L; i++) document.write(arguments[i]);
	document.close();
};




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

sML.OnRead = sML.onRead = {
	Functions: [],
	execute: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
};
sML.onread = sML.ready = function(F) { return sML.OnRead.addEventListener(F); };

sML.OnLoad = sML.onLoad = {
	Functions: [],
	execute: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
};
sML.onload = sML.done  = function(F) { return sML.OnLoad.addEventListener(F); };

if(document.addEventListener && (!sML.UA.WK || sML.UA.WK > 525)) {
	document.addEventListener("DOMContentLoaded", function() {
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		sML.OnRead.execute();
	}, false);
} else if(document.attachEvent) {
	document.attachEvent("onreadystatechange", function() {
		if(document.readyState !== "complete") return;
		document.detachEvent("onreadystatechange", arguments.callee);
		sML.OnRead.execute();
	});
	if(document.documentElement.doScroll && window == window.top) { (function() {
		if(sML.OnRead.Executed) return;
		try { document.documentElement.doScroll("left"); } catch(e) { setTimeout(arguments.callee, 0); return; }
		sML.OnRead.execute();
	})(); }
} else sML.OnLoad.addEventListener(function() { sML.OnRead.execute(); });

sML.Event.add(window, "load", function() {
	sML.Event.remove(window, "load", arguments.callee, false);
	sML.OnLoad.execute();
}, false);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.OnResizeFont = sML.onResizeFont = sML.onresizefont = {
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
};

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
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Timers

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Timers = {
	setTimeout:  function(T, F, A1, A2, A3, A4, A5, A6, A7, A8, A9) { return setTimeout( F, T, A1, A2, A3, A4, A5, A6, A7, A8, A9); },
	setInterval: function(T, F, A1, A2, A3, A4, A5, A6, A7, A8, A9) { return setInterval(F, T, A1, A2, A3, A4, A5, A6, A7, A8, A9); }
};

sML.setTimeout  = sML.Timers.setTimeout;
sML.setInterval = sML.Timers.setInterval;




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
};

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
	} else sML.OnRead.addEventListener(function() { sML.extendElements(document); });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.getElementsByIds = document.getElementsByIds = function() {
	for(var Es = [], L = arguments.length, i = 0; i < L; i++) if(document.getElementById(arguments[i])) Es.push(document.getElementById(arguments[i]));
	return Es;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.getElements = sML.getElementsBySelector = function() {
	for(var i = 1, L = arguments.length; i < L; i++) arguments[0] += "," + arguments[i];
	return document.querySelectorAll(arguments[0]);
};

sML.getInnerText = function(E) {
	return E.innerText || E.textContent;
};

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.cloneObject = function(O) {
	var F = function() {};
	F.prototype = O;
	return new F();
};

sML.set = sML.edit = sML.setMembers = function(O, M, S) {
	if(M) for(var m in M) O[m] = M[m];
	if(S) sML.CSS.set(O, S);
	return O;
};

sML.create = sML.createElement = function(tagName, M, S) {
	return (tagName ? sML.set(document.createElement(tagName), M, S) : null);
};

sML.changeClass = sML.changeClassName = ((sML.UA.IE < 10) ? function(E, CN) {
	if(CN) E.className = CN;
	else E.removeAttribute("className");
	return E.className;
} : function(E, CN) {
	if(CN) E.className = CN;
	else E.removeAttribute("class");
	return E.className;
});

sML.addClass = sML.addClassName = function(E, CN) {
	if(typeof CN != "string") return E.className;
	CN = CN.replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "")
	if(!CN) return E.className;
	if(E.className) {
		if((" " + E.className + " ").indexOf(" " + CN + " ") > -1) return E.className;
		CN = E.className + " " + CN;
	}
	return sML.changeClass(E, CN);
};

sML.removeClass = sML.removeClassName = function(E, CN) {
	if(!E.className) return "";
	if(typeof CN != "string") return E.className;
	CN = CN.replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "")
	if(!CN) return E.className;
	if((" " + E.className + " ").indexOf(" " + CN + " ") <  0) return E.className;
	CN = (" " + E.className + " ").replace(" " + CN + " ", " ").replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "");
	return sML.changeClass(E, CN);
};

sML.replaceClass = sML.replaceClassName = function(E, RCN, ACN) {
	sML.removeClass(E, RCN);
	sML.addClass(E, ACN);
	return E.className;
};

sML.appendChildren = function(Es, P) {
	for(var L = Es.length, i = 0; i < L; i++) P.appendChild(Es[i]);
	return Es;
};

sML.insertBefore = function(E, S) {
	S.parentNode.insertBefore(E, S);
	return S.previousSibling;
};

sML.insertAfter = function(E, S) {
	S.parentNode.insertBefore(E, S.nextSibling);
	return S.nextSibling;
};

sML.replaceElement = function(E, S) {
	S.parentNode.insertBefore(E, S);
	E = S.previousSibling;
	S.parentNode.removeChild(S);
	return E;
};

sML.removeElement = function(E) {
	E.parentNode.removeChild(E);
};

sML.deleteElement = function(E) {
	if(E.parentNode) E.parentNode.removeChild(E);
	E.innerHTML = "";
	E = null;
	delete E;
};

sML.hatch = function() {
	for(var HTML = "", L = arguments.length, i = 0; i < L; i++) HTML += arguments[i];
	var egg = document.createElement("div");
	var chick = document.createDocumentFragment();
	var brood = function() {
		egg.innerHTML = HTML;
		for(var L = egg.childNodes.length, i = 0; i < L; i++) chick.appendChild(egg.firstChild);
	}
	if(sML.UA.IE < 9) {
		document.body.appendChild(egg).display = "none";
		brood();
		document.body.removeChild(egg);
	} else brood();
	return chick;
};

sML.getContentDocument = function(F) {
	return (sML.UA.IE < 8) ? F.contentWindow.document : F.contentDocument;
};




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
		if(sML.UA.IE < 9) return ParentDocument.styleSheets[ParentDocument.styleSheets.length - 1];
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
		     if(/^(animation|background(-s|S)ize|box|break|column|filter|flow|hyphens|region|shape|transform|transition|writing)/.test(P)) pfx = true; // 2013/09/25
		else if(P == "float") P = sML.UA.IE ? "styleFloat" : "cssFloat";
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
	}
};
sML.style = sML.css = function(E, PV, Cb) { return sML.CSS.set(E, PV, Cb); };




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
};
sML.transition = function(E, Ps, Fs) { return sML.Transition.begin(E, Ps, Fs); };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Coords

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Coord = sML.C = {
	setIEF : function() {
		var cX = window.screenLeft, cY = window.screenTop;
		window.moveTo(cX, cY);
		this.IEF = { w: window.screenLeft - cX, h: window.screenTop  - cY };
		window.moveBy(-this.IEF.w, -this.IEF.h);
	},
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
	getWindowOuterSize : ((sML.UA.IE < 9) ? function() {
		if(!this.IEF) this.setIEF();
		var iS = this.getWindowInnerSize();
		return { w: iS.w + this.IEF.w * 2, h: iS.h + this.IEF.h + 50 };
	} : function() {
		return { w: window.outerWidth, h: window.outerHeight };
	}),
	getDocumentSize : ((sML.UA.IE < 8) ? function() {
		return { w: document.body.scrollWidth, h: document.body.scrollHeight };
	} : function() {
		var W = document.documentElement.scrollWidth  || document.body.scrollWidth;
		var H = document.documentElement.scrollHeight || document.body.scrollHeight;
		return { w: W, h: H };
	}),
	getElementSize : function (E) {
		return { w: E.offsetWidth, h: E.offsetHeight };
	},
	getWindowCoord : ((sML.UA.IE < 9) ? function (E) {
		if(!this.IEF) this.setIEF();
		var cX = window.screenLeft;
		var cY = window.screenTop;
		var X = cX - this.IEF.w;
		var Y = cY - this.IEF.h;
		if(X < 0) X = 0;
		if(Y < 0) Y = 0;
		return { x: X, y: Y };
	} : function(E) {
		var X = window.screenLeft || window.screenX;
		var Y = window.screenTop  || window.screenY;
		return { x: X, y: Y };
	}),
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
	getEventCoord : ((sML.UA.IE < 9) ? function(e) {
		return { x: event.clientX + document.documentElement.scrollLeft, y: event.clientY + document.documentElement.scrollTop };
	} : function(e) {
		return (e ? { x: e.pageX, y: e.pageY } : { x: 0, y: 0 });
	}),
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
};

sML.scrollBy = function(bD, Ps, Fs, ForceScroll) {
	if(typeof Fs == "function") Fs = { c: Fs };
	var tC = {}, wC = sML.C.getCoord(window, (bD.RtL || bD.rtl || bD["vertical-rl"] || bD.horizontal));
	if(bD.x) tC.x = wC.x + bD.x;
	if(bD.y) tC.y = wC.y + bD.y;
	sML.log(tC);
	return sML.C.scrollTo(tC, Ps, Fs, ForceScroll);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ajax

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Ajax = sML.A = {
	open : function(Settings) {
		try { var XHR = new XMLHttpRequest(); } catch(e) { try { var XHR = new ActiveXObject("Msxml2.XMLHTTP"); } catch(e) { try { var XHR = new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {} } };
		if(!XHR) return sML.log("sML.ShipBuilder could not find XHR.");
		if(typeof Settings != "object" || typeof Settings.URI != "string" || typeof Settings.onsuccess != "function") return false;
		if(!Settings.Query)     Settings.Query = null;
		if(!Settings.Auth)      Settings.Auth = ["", ""];
		if(!Settings.MimeType)  Settings.MimeType = null;
		if(!Settings.onsuccess) Settings.onsuccess = function() {};
		if(!Settings.onfailed)  Settings.onfailed  = function() { sML.each(arguments, function() { sML.log(this + ""); }); };
		if(!Settings.ontimeout) Settings.ontimeout = Settings.onfailed;
		if(Settings.Async !== false) Settings.Async = true;
		Settings.Method = (Settings.Method && /^POST$/i.test(Settings.Method)) ? "POST" : "GET";
		var QueryString = "";
		if(Settings.Query) for(var Q in Settings.Query) QueryString += "&" + Q + "=" + encodeURIComponent(Settings.Query[Q]);
		if(QueryString) {
			if(Settings.method == "GET") {
				Settings.URI = Settings.URI + ((Settings.URI.indexOf("?") > 0) ? QueryString : QueryString.replace(/^&/, "?"));
				QueryString = null;
			} else if(Settings.Method == "POST") {
				QueryString = QueryString.replace(/^&/, "");
			}
		}
		XHR.sMLAjaxTimeout = 0, XHR.sMLAjaxTimeoutTimer = setTimeout(function() { XHR.sMLAjaxTimeout = 1; Settings.ontimeout("sML.AJAX.get Timeout: " + Settings.URI); }, 10000);
		Settings.onstate4 = function(rT, rX) {
			if(XHR.sMLAjaxTimeout) return;
			clearTimeout(XHR.sMLAjaxTimeoutTimer);
			if(XHR.status == 200 || XHR.status == 0) Settings.onsuccess(rT, rX);
			else                                     Settings.onfailed("sML.AJAX.get Failed: (" + XHR.status + ") " + URL);
			delete XHR;
		}
		XHR.onreadystatechange = function() {
			switch(this.readyState) {
			//	case 1: if(Settings.onstate1) return Settings.onstate1.call(this, this.responseText, this.responseXML); break; // loading
			//	case 2: if(Settings.onstate2) return Settings.onstate2.call(this, this.responseText, this.responseXML); break; // loaded
			//	case 3: if(Settings.onstate3) return Settings.onstate3.call(this, this.responseText, this.responseXML); break; // interactive
				case 4:                       return Settings.onstate4.call(this, this.responseText, this.responseXML); break; // complete
			}
		}
		if(Settings.MimeType) XHR.overrideMimeType(Settings.MimeType);
		XHR.open(Settings.Method, Settings.URI, Settings.Async, Settings.Auth[0], Settings.Auth[1]);
		if(Settings.Method == "POST") XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		XHR.send(QueryString);
		return XHR;
	}
};
sML.ajax = function() {
	var Settings = {};
	if(typeof arguments[0] == "object") {
		Settings = arguments[0];
		if(typeof Settings.URI != "string") return false;
	} else if(typeof arguments[0] == "string") {
		if(typeof arguments[1] == "object") Settings = arguments[1];
		Settings.URI = arguments[0];
	} else return false;
	if(typeof Settings.onsuccess != "function") {
		if(typeof arguments[1] == "function") Settings.onsuccess = arguments[1]; else return false;
		if(typeof arguments[2] == "function") Settings.onfailed  = arguments[2];
		if(typeof arguments[3] == "function") Settings.ontimeout = arguments[3];
	}
	return sML.Ajax.open(Settings);
};




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
};
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
};

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
};




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
};

sML.filter = function(A, F) {
	if(typeof F != "function") throw new TypeError();
	for(var newArray = [], L = A.length, i = 0; i < L; i++) if(F.call(A[i], i, A)) newArray.push(A[i]);
	return newArray;
};

sML.foreach = function(O, F, pThis) {
	for(var L = O.length, i = 0; i < L; i++) if(F.call(pThis, O[i], i, O) === false) break;
	return O;
};

sML.each = function(O, F, iN, LN) {
	for(var L = (LN ? LN : O.length), i = (iN ? iN : 0); i < L; i++) if(F.call(O[i], i, O) === false) break;
	return O;
};

sML.firstOf = function(A) {
	return (A.length ? A[           0] : null);
};

sML.lastOf  = function(A) {
	return (A.length ? A[A.length - 1] : null);
};




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
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- String / Number

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.String = {
	pad: function(N, D, P) {
		N = N + ""; if((N).length >= D) return N;
		if(typeof P != "string") P = "0";
		var Padding = ""; while(Padding.length < D) Padding += P;
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
};

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
};

sML.padZero = sML.zeroPadding = sML.String.padZero = sML.String.pad;
sML.insertZeroWidthSpace = sML.String.insertZeroWidthSpace;




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Range / Selection

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Range = {
	getRange: function(Sides, OwnerDocument) {
		if(!Sides) return null;
		if(!OwnerDocument) OwnerDocument = Sides.Start.Node.ownerDocument;
		var R = OwnerDocument.createRange();
		R.setStart(Sides.Start.Node, (typeof Sides.Start.Index == "number" ? Sides.Start.Index : Sides.Start.Node.textContent.indexOf(Sides.Start.Text)));
		R.setEnd(    Sides.End.Node, (typeof   Sides.End.Index == "number" ?   Sides.End.Index :   Sides.End.Node.textContent.indexOf(  Sides.End.Text) + Sides.End.Text.length));
		return R;
	},
	flat: function(T) { return T.replace(/[\r\n]/g, ""); },
	escape: function(T) { return this.flat(T).replace(/([\(\)\{\}\[\]\,\.\-\+\*\?\!\:\^\$\/\\])/g, "\\$1"); },
	distill: function(T, F, L) { for(var D = "", i = F; i <= L; i++) D += T[i]; return D; },
	find: function(SearchText, TargetNode) {
		// Initialize
		if(!TargetNode) TargetNode = document.body;
		if(typeof SearchText != "string" || !SearchText || this.flat(TargetNode.textContent).indexOf(SearchText) < 0) return null;
		if(TargetNode.nodeType == 3) return { Start: { Node: TargetNode, Text: SearchText }, End: { Node: TargetNode, Text: SearchText } };
		var TextContents = [], SNI = 0, ENI = TargetNode.childNodes.length - 1, D = "", F = {};
		for(var i = 0; i <= ENI; i++) {
			if(this.flat(TargetNode.childNodes[i].textContent).indexOf(SearchText) >= 0) return this.find(SearchText, TargetNode.childNodes[i]);
			TextContents.push(TargetNode.childNodes[i].textContent);
		}
		// Get StartNode
		D = this.distill(TextContents, SNI + 1, ENI);
		while(D && this.flat(D).indexOf(SearchText) >= 0) SNI++, D = this.distill(TextContents, SNI + 1, ENI);
		var SN = TargetNode.childNodes[SNI];
		// Get StartText
		var SS = 0, SE = SN.textContent.length - 1, ST = "";
		D = this.distill(SN.textContent, SS, SE);
		while(this.flat(D) && !(new RegExp("^" + this.escape(D))).test(SearchText)) SS++, D = this.distill(SN.textContent, SS, SE);
		ST = this.flat(D);
		// Dive StartNode
		while(SN.nodeType != 3) F = this.find(ST, SN), SN = F.Start.Node, ST = F.Start.Text;
		// Get EndNode
		D = this.distill(TextContents, SNI, ENI - 1);
		while(D && this.flat(D).indexOf(SearchText) >= 0) ENI--, D = this.distill(TextContents, SNI, ENI - 1);
		var EN = TargetNode.childNodes[ENI];
		// Get EndText
		var ES = 0, EE = EN.textContent.length - 1, ET = "";
		D = this.distill(EN.textContent, ES, EE);
		while(this.flat(D) && !(new RegExp(this.escape(D) + "$")).test(SearchText)) EE--, D = this.distill(EN.textContent, ES, EE);
		ET = this.flat(D);
		// Dive EndNode
		while(EN.nodeType != 3) F = this.find(ET, EN), EN = F.End.Node, ET = F.End.Text;
		// Return
		return {
			Start: { Node: SN, Text: ST },
			  End: { Node: EN, Text: ET }
		};
	}
};

sML.Selection = {
	selectRange: function(R) {
		if(!R) return null;
		var S = window.getSelection();
		S.removeAllRanges();
		S.addRange(R);
		return R;
	},
	getSelectedText: ((sML.UA.IE < 9) ? function() {
		var S = "" + document.selection.createRange().text;
		return (S ? S : "");
	} : function() {
		var S = "" + window.getSelection();
		return (S ? S : "");
	})
};
sML.getSelection = function() { return sML.Selection.getSelectedText(); };

sML.select = function(Sides, OwnerDocument)   { return sML.Selection.selectRange(sML.Range.getRange(Sides, OwnerDocument)); };
sML.find   = function(SearchText, TargetNode) { return sML.Selection.selectRange(sML.Range.getRange(sML.Range.find(SearchText, TargetNode))); };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Full Screen

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.fullScreenEnabled = function(D) {
	if(!D) D = document;
	return ((D.body.requestFullScreen || D.body.webkitRequestFullScreen || D.body.mozRequestFullScreen || D.body.msRequestFullscreen || D.body.oRequestFullScreen) ? true : false);
};

sML.requestFullScreen = function(E) {
	if(!E) E = document.documentElement || document.body;
	if(E.requestFullScreen)       return E.requestFullScreen();
	if(E.webkitRequestFullScreen) return E.webkitRequestFullScreen();
	if(E.mozRequestFullScreen)    return E.mozRequestFullScreen();
	if(E.msRequestFullscreen)     return E.msRequestFullscreen();
	if(E.oRequestFullScreen)      return E.oRequestFullScreen();
};

sML.exitFullScreen = function(D) {
	if(!D) D = document;
	if(D.cencelFullScreen)        return D.cancelFullScreen();
	if(D.webkitCancelFullScreen)  return D.webkitCancelFullScreen();
	if(D.mozCancelFullScreen)     return D.mozCancelFullScreen();
	if(D.msExitFullscreen)        return D.msExitFullscreen();
	if(D.oCancelFullScreen)       return D.oCancelFullScreen();
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Readied ?

//----------------------------------------------------------------------------------------------------------------------------------------------

return sML; })();



