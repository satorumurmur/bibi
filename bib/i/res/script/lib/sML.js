




sML = /* JavaScript Library */ (function() { var sML = {

	Name        : "sML JavaScript Library",
	Description : "I'm a Simple and Middling Library.",
	Copyright   : "(c) 2013 Satoru MATSUSHIMA",
	Licence     : "Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php",
	Date        : "Wed June 12 00:58:00 2013 +0900",

	Version     : 0.992,
	Build       : 20130612.0,

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
		Presto           : ((nUA.indexOf("Presto")      > -1) ? v2n(nUA, /^.+Presto\/([\d\.]+).+$/)      : undefined),
		Opera            : ((nUA.indexOf("Opera/")      > -1) ? v2n(nUA, /^.+Version\/([\d\.]+).*$/)     : undefined),
		InternetExplorer : undefined,
		Flash            : undefined
	}
	if(sML.OS.OSX)     return "Mac";
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
	sML.UA.InternetExplorer = document.documentMode ? document.documentMode : ((navigator.userAgent.indexOf("MSIE 7") > -1) ? 7 : 1);
	try {
		var fAX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"); // Farewell to Flash Player Under-7
		sML.UA.Flash = parseFloat(fAX.GetVariable("$version").replace(/^[^\d]+(\d+)\,([\d\,]+)$/, "$1.$2").replace(/\,/g, ""));
	} catch(e) {}
@*/

sML.OS.Apple     = sML.OS.Apl = (sML.OS.OSX || sML.OS.iOS);
sML.OS.Microsoft = sML.OS.MS  = (sML.OS.Windows);
sML.OS.Google    = sML.OS.Ggl = (sML.OS.Android || sML.OS.Chrome);

sML.OS.Mac = sML.OS.OSX;
sML.OS.Win = sML.OS.Windows;
sML.OS.Lin = sML.OS.Linux;
sML.OS.And = sML.OS.Android;

sML.UA.WK = sML.UA.WebKit;
sML.UA.Sa = sML.UA.Safari;
sML.UA.Ch = sML.UA.Chrome;
sML.UA.Ge = sML.UA.Gecko;
sML.UA.Pr = sML.UA.Presto;
sML.UA.Op = sML.UA.Opera;
sML.UA.IE = sML.UA.InternetExplorer;
sML.UA.FP = sML.UA.Flash;

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

sML.onLoad = sML.onload = {
	Executed: 0,
	Functions: [],
	executeAll: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
}

sML.done = function(F) { return sML.onLoad.addEventListener(F); };

sML.Event.add(window, "load", function() {
	sML.Event.remove(window, "load", arguments.callee, false);
	sML.onLoad.executeAll();
}, false);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.onRead = sML.onread = {
	Executed: 0,
	Functions: [],
	executeAll: function() {
		if(this.Executed) return;
		this.Executed = 1;
		for(var L = this.Functions.length, i = 0; i < L; i++) this.Functions[i]();
		this.Functions = [];
	},
	addEventListener: function(F) { return (this.Executed) ? F() : this.Functions.push(F); }
}

sML.ready = function(F) { return sML.onRead.addEventListener(F); };

if(document.addEventListener && (!sML.UA.WK || sML.UA.WK > 525)) {
	document.addEventListener("DOMContentLoaded", function() {
		document.removeEventListener("DOMContentLoaded", arguments.callee, false);
		sML.onRead.executeAll();
	}, false);
} else if(document.attachEvent) {
	document.attachEvent("onreadystatechange", function() {
		if(document.readyState !== "complete") return;
		document.detachEvent("onreadystatechange", arguments.callee);
		sML.onRead.executeAll();
	});
	if(document.documentElement.doScroll && window == window.top) { (function() {
		if(sML.onRead.Executed) return;
		try { document.documentElement.doScroll("left"); } catch(e) { setTimeout(arguments.callee, 0); return; }
		sML.onRead.executeAll();
	})(); }
} else sML.onLoad.addEventListener(function() { sML.onRead.executeAll(); });

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
			var currentHeight = sML.coord.getElementSize(sML.onResizeFont.checker).h;
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
	for(var Es = [], L = arguments.length, i = 0; i < L; i++) {
		if(document.getElementById(arguments[i])) Es.push(document.getElementById(arguments[i]));
	}
	return Es;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.getElements = sML.getElementsBySelector = function() {
	for(var i = 1, L = arguments.length; i < L; i++) arguments[0] += "," + arguments[i];
	return document.querySelectorAll(arguments[0]);
	/*
	var Es = [], Ps = [document];
	for(var aL = arguments.length, i = 0; i < aL; i++) {
		var Ss = arguments[i].replace(/>/g, " >").split(" ");
		for(var sL = Ss.length, j = 0; j < sL; j++) {
			for(var pL = Ps.length, k = 0; k < pL; k++) {
				var tEs = [], IDCheck = "", CNCheck = "", TNCheck = "";
				if(Ss[j].charAt(0) == ">") {
					var ChildOnly = 1;
					Ss[j] = Ss[j].replace(/^>/, "");
				}
				var Req = Ss[j].replace(/([>\.#])/g, ",$1").replace(/^\,/, "").split(",");
				for(var rL = Req.length, l = 0; l < rL; l++) {
					     if(Req[l].charAt(0) == "#") IDCheck  = Req[l].replace(/^#/, "");
					else if(Req[l].charAt(0) == ".") CNCheck += Req[l].replace(/^./, "") + " ";
					else                             TNCheck  = Req[l].toUpperCase();
				}
				if(CNCheck) CNCheck = CNCheck.replace(/ $/, "");
				if(IDCheck) {
					var Cs = [document.getElementById(IDCheck)];
					if(Cs.length && TNCheck) {
						if(Cs[0].tagName.toUpperCase() != TNCheck) Cs = [];
					}
					if(Cs.length && CNCheck) {
						var CNs = CNCheck.split(" ");
						for(var cnL = CNs.length, l = 0; l < cnL; l++) {
							if(Cs[0].className.indexOf(CNs[l]) < 0) {
								Cs = [];
								break;
							}
						}
					}
				} else if(CNCheck) {
					var Cs = Ps[k].getElementsByClassName(CNCheck);
					if(TNCheck) {
						for(var ttEs = [], cL = Cs.length, l = 0; l < cL; l++) {
							if(Cs[l].tagName.toUpperCase() == TNCheck) ttEs.push(Cs[l]);
						}
						Cs = ttEs;
					}
				} else if(TNCheck) {
					var Cs = Ps[k].getElementsByTagName(TNCheck);
				}
				if(ChildOnly) { for(var cL = Cs.length, l = 0; l < cL; l++) if(Cs[l].parentNode == Ps[k]) tEs.push(Cs[l]); }
				else          { for(var cL = Cs.length, l = 0; l < cL; l++)                               tEs.push(Cs[l]); }
			}
			if(Ss[j].indexOf(">") > -1) Ss[j].split(">")[0];
			Ps = tEs;
		}
		Es = Es.concat(tEs);
	}
	return Es;
	*/
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

sML.toArray = function() {
	for(var A = [], aL = arguments.length, i = 0; i < aL; i++) {
		if(typeof arguments[i].length == "undefined")              A.push(arguments[i]);
		else for(var eL = arguments[i].length, j = 0; j < eL; j++) A.push(arguments[i][j]);
	}
	return A;
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

sML.set = sML.edit = sML.setMembers = function(O, M, S) {
	if(M) for(var m in M) O[m] = M[m];
	if(S) sML.CSS.set(O, S);
	return O;
}

sML.create = sML.createElement = function(tagName, M, S) {
	return (tagName ? sML.edit(document.createElement(tagName), M, S) : null);
}

sML.changeClass = sML.changeClassName = function(E, CN) {
	if(CN) E.className = CN;
	else /*@ E.removeAttribute("className"); // @*/ E.removeAttribute("class");
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

if(sML.UA.IE) {
	window.getComputedStyle = function(E) { return E.currentStyle; };
} else if(!window.getComputedStyle && document.defaultView && document.defaultView.getComputedStyle) {
	window.getComputedStyle = document.defaultView.getComputedStyle;
}

sML.CSS = sML.css = {
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
		else if(/^transition|transform|column|filter/.test(P)) pfx = true; // 2013/06/12
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
		if(!(PV instanceof Array)) for(var P in PV)                              this.setProperty(E,         P,         PV[P]);
		else if(PV.length % 2 < 1) for(var L = PV.length / 2, i = 0; i < L; i++) this.setProperty(E, PV[i * 2], PV[i * 2 + 1]);
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

// compatibility
sML.getComputedStyle = sML.CSS.getComputedStyle;
sML.style = sML.CSS.set;
sML.getOpacity = sML.CSS.getOpacity, sML.setOpacity = sML.CSS.setOpacity;
sML.setFloat = sML.CSS.setFloat;





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Transition / Animation / Effect

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Transition = sML.T = sML.transition = sML.t = {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.Animate = sML.Anim = {};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.Effect = {};

sML.Effect.fadeTo = function(Ob, Op, Ps, Cb, To) {
	if(typeof Ps == "function") {
		if(typeof Cb == "number") var To = Cb;
		var Cb = Ps;
		var Ps = {};
	}
	var F = function() {
		sML.Transition.begin(Ob, Ps, {
			s: function(SFO) { SFO.sO = sML.getOpacity(this); },
			m: function(SFO) { sML.CSS.setOpacity(this, SFO.getNext(SFO.sO, Op)); },
			e: function(SFO) { sML.CSS.setOpacity(this,                     Op ); },
			c: Cb
		});
	}
	return (To ? setTimeout(F, To) : F());
}

sML.fadeTo = sML.Effect.fadeTo;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.Overlay = {
	Layers: [],
	showLayer: function(L) {
		sML.Effect.fadeTo(L, 1, { f:10, t:10 });
	},
	removeLayer: function(L) {
		if(L.Removing) return;
		L.Removing = 1;
		sML.Effect.fadeTo(L, 0, { f:10, t:10 }, function() {
			sML.removeElement(L);
			delete(L);
		});
	},
	createLayer: function(P) {
		sML.CSS.addRule('div#' + P.id + ', div#' + P.id + ' *', [
			'display: block;',
			'overflow: hidden;',
			'position: fixed;',
			'z-index: 99999;',
			'left: 0;',
			'top: 0;',
			'margin: 0;',
			'padding: 0;',
			'border: none 0;',
			'width: 100%;',
			'height: 100%;',
			'background: transparent;'
		].join(""));
		var Layer = P.parentElement.appendChild(sML.createElement("div", { id: P.id }, { opacity: 0, background: P.background }));
		Layer.onclick = Layer.onkeypress = function() { sML.Overlay.removeLayer(this); };
		this.Layers.push(Layer);
		return Layer;
	}
};

sML.Overlay.Mesh = function(P) {
	if(!P) P = {};
	if(!P.parentElement) P.parentElement = document.body;
	if(!P.id) P.id = "sML-Overlay" + sML.padZero(this.Layers.length + 1, 2);
	if(!P.background) P.background = 'rgba(0,0,0,0.5)';
	var Layer = this.createLayer(P);
	if(!P.noCells) {
		if(!P.cellWidth)      P.cellWidth      = '4px';
		if(!P.cellHeight)     P.cellHeight     = '4px';
		if(!P.horizontalLine) P.horizontalLine = 'solid 2px rgba(0,0,0,0.5)';
		if(!P.verticalLine)   P.verticalLine   = 'solid 2px rgba(0,0,0,0.5)';
		sML.CSS.addRule('div#' + P.id + ' div.' + P.id + '-Horizontal', [
			'border-bottom: ' + P.horizontalLine + ';',
			'height: ' + P.cellHeight + ';'
		].join(""));
		sML.CSS.addRule('div#' + P.id + ' div.' + P.id + '-Vertical', [
			'border-right: ' + P.verticalLine + ';',
			'width: ' + P.cellWidth + ';'
		].join(""));
		var S = sML.Coord.getScreenSize();
		var H = Layer.appendChild(sML.createElement("div", { className: P.id + '-Horizontal' }));
		var V = Layer.appendChild(sML.createElement("div", { className: P.id + '-Vertical'   }));
		var cH = sML.Coord.getElementSize(H).h;
		var cW = sML.Coord.getElementSize(V).w;
		for(var Hs = [], hL = Math.ceil(S.h / cH), hI = 1; hI < hL; hI++) {
			Hs.push(Layer.appendChild(sML.createElement("div", { className: P.id + '-Horizontal' }, { top:  cH * hI + "px" })));
//			setTimeout(function() { Hs.shift().style.opacity = 1; }, 5 * hI);
		}
		for(var Vs = [], vL = Math.ceil(S.w / cW), vI = 1; vI < vL; vI++) {
			Vs.push(Layer.appendChild(sML.createElement("div", { className: P.id + '-Vertical'   }, { left: cW * vI + "px" })));
//			setTimeout(function() { Vs.shift().style.opacity = 1; }, Math.ceil(5 * hL / vL) * vI);
		}
	}
	this.showLayer(Layer);
	return Layer;
}

sML.Overlay.Tiles = function(P) {
	if(!P) P = {};
	if(!P.parentElement) P.parentElement = document.body;
	if(!P.id) P.id = "sML-Overlay" + sML.padZero(this.Layers.length + 1, 2);
	if(!P.background) P.background = 'transparent';
	var Layer = this.createLayer(P);
	if(!P.noCells) {
		if(!P.cellWidth)        P.cellWidth        = '100px';
		if(!P.cellHeight)       P.cellHeight       = '100px';
		if(!P.cellBackground)   P.cellBackground   = 'rgba(0,0,0,0.5)';
		if(!P.horizontalMargin) P.horizontalMargin = '5px';
		if(!P.verticalMargin)   P.verticalMargin   = '5px';
		sML.CSS.addRule('div#' + P.id + ' div.' + P.id + '-Tile', [
			'border-bottom: ' + P.horizontalLine + ';',
			'width: ' + P.cellWidth + ';',
			'height: ' + P.cellHeight + ';',
			'background: ' + P.cellBackground + ';'
		].join(""));
		var S = sML.Coord.getScreenSize();
		var T = Layer.appendChild(sML.createElement("div", { className: P.id + '-Tile' }, { padding: "0 " + P.horizontalMargin + " " + P.verticalMargin + " 0" }));
		var cH = sML.Coord.getElementSize(T).h;
		var cW = sML.Coord.getElementSize(T).w;
		sML.removeElement(T);
		Layer.Tiles = [];
		for(var vL = Math.ceil(S.h / cH), vI = 0; vI < vL; vI++) {
			for(var hL = Math.ceil(S.w / cW), hI = 0; hI < hL; hI++) {
				Layer.Tiles.push(Layer.appendChild(sML.createElement("div", { className: P.id + '-Tile' }, { left: cW * hI + "px", top: cH * vI + "px", opacity: 0 })));
			}
		}
		Layer.turnTiles = function() {
			if(!Layer.Tiles.length) return;
			sML.Effect.fadeTo(Layer.Tiles.shift(), 1, { t:25, f:10 });
			setTimeout(arguments.callee, 0);
		}
		Layer.turnTiles();
	}
	this.showLayer(Layer);
	return Layer;
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Coords

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Coord = sML.C = sML.coord = sML.c = {
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
		   sML.addEventListener(document, "mousedown",      sML.coord.cancelScrolling);
		   sML.addEventListener(document, "keydown",        sML.coord.cancelScrolling);
		   sML.addEventListener(document, "mousewheel",     sML.coord.cancelScrolling);
		   sML.addEventListener(document, "DOMMouseScroll", sML.coord.cancelScrolling);
	},
	cancelScrolling : function() {
		clearTimeout(sML.coord.timer);
		sML.removeEventListener(document, "mousedown",      sML.coord.cancelScrolling);
		sML.removeEventListener(document, "keydown",        sML.coord.cancelScrolling);
		sML.removeEventListener(document, "mousewheel",     sML.coord.cancelScrolling);
		sML.removeEventListener(document, "DOMMouseScroll", sML.coord.cancelScrolling);
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

sML.getCoord = sML.C.getCoord;

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

//-- Array / List

//----------------------------------------------------------------------------------------------------------------------------------------------

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

//-- String

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

sML.padZero = sML.zeroPadding = sML.String.padZero;
sML.insertZeroWidthSpace = sML.String.insertZeroWidthSpace;





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Ajax

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Ajax = sML.ajax = sML.AJAX = sML.a = {
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
		var Ship = sML.ajax.build();
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

//-- Flowers

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.preloadImages = function() {
	var SRCs = (typeof arguments[0] == "array")  ? arguments[0] : arguments;
	for(var L = SRCs.length, i = 0; i < L; i++) (new Image()).src = SRCs[i];
}

sML.replaceImageAfterLoaded = function(I, SRC) {
	if(I.src == SRC) return;
	setTimeout(function() {
		var nI = new Image();
		nI.onload = function() { I.src = SRC; };
		nI.src = SRC;
	}, 0);
}

sML.ISR = function(Ps) { /* Image-Swapper/Interaction-Switch Returner */ 
	if(Ps.S) (new Image()).src = Ps.S;
	if( (Ps.I && Ps.S) &&  Ps.F) return function() { Ps.I.src = Ps.S; Ps.F.call(Ps.I); };
	if( (Ps.I && Ps.S) && !Ps.F) return function() { Ps.I.src = Ps.S; };
	if(!(Ps.I && Ps.S) &&  Ps.F) return Ps.F;
	return null;
};

sML.setButtonInteractions = function(Es, Ts, Fs, WithoutInput) {
	if(!Es || !Es.length) return;
	if(!Ts) var Ts = [];
	if(!Fs) var Fs = {};
	var UIs = [];
	for(var eL = Es.length, i = 0; i < eL; i++) {
		for(var As = Es[i].getElementsByTagName("a"), aL = As.length, j = 0; j < aL; j++) {
			var IMGs = As[j].getElementsByTagName("img");
			if(IMGs.length) UIs.push([As[j], IMGs[0]]);
		}
		if(WithoutInput) continue;
		for(var INPUTs = Es[i].getElementsByTagName("input"), iL = INPUTs.length, j = 0; j < iL; j++) {
			if(/image/i.test(INPUTs[j].type)) UIs.push([INPUTs[j], INPUTs[j]]);
		}
	}
	for(var L = UIs.length, i = 0; i < L; i++) {
		if(Fs.e && !Fs.e.call(UIs[i][0])) continue;
		if(Fs.s) Fs.s.call(UIs[i][0]);
		var Src = {}, Act = {};
		if(Ts.length > 0) {
			Ts[0] = Ts[0].replace(/^_?(.+)/, "$1");
			Src.h = UIs[i][1].src.replace(/(_|\.)(link|on|in|at|hover|active)(\.\w+)$/, "$1" + Ts[0] + "$3");
			Src.b = UIs[i][1].src;
			Act.h = sML.ISR({ I:UIs[i][1], S:((Src.h != Src.b) ? Src.h : null), F:Fs.h });
			Act.b = sML.ISR({ I:UIs[i][1], S:((Src.h != Src.b) ? Src.b : null), F:Fs.b });
		} else {
			Act.h = Fs.h;
			Act.b = Fs.b;
		}
		if(Act.h) sML.addEventListener(UIs[i][0], "mouseover", Act.h);
		if(Act.b) sML.addEventListener(UIs[i][0], "mouseout",  Act.b);
		if(Ts.length < 2 && !Fs.d && !Fs.u) continue;
		if(Ts.length > 1) {
			Ts[1] = Ts[1].replace(/^_?(.+)/, "$1");
			if(Ts.length > 2) Ts[2] = Ts[2].replace(/^_?(.+)/, "$1"); if(Ts[2] == "*") Ts[2] = "$1";
			Src.d = UIs[i][1].src.replace(/(_|\.)(link|on|in|at|hover|active)(\.\w+)$/, "$1" + Ts[1] + "$3");
			Src.u = (Ts.length > 2) ? UIs[i][1].src.replace(/(_|\.)(link|on|in|at|hover|active)(\.\w+)$/, "$1" + Ts[2] + "$3") : Src.h;
			Act.d = sML.ISR({ I:UIs[i][1], S:Src.d, F:Fs.d });
			Act.u = sML.ISR({ I:UIs[i][1], S:Src.u, F:Fs.u });
		} else {
			Act.d = Fs.d;
			Act.u = Fs.u;
		}
		if(Act.d) sML.addEventListener(UIs[i][0], "mousedown", Act.d), sML.addEventListener(UIs[i][0], "keydown", Act.d);
		if(Act.u) sML.addEventListener(UIs[i][0], "mouseup",   Act.u), sML.addEventListener(UIs[i][0], "keyup",   Act.u);
	}
}

sML.openInNewWindow = function() {
	window.open(this.href);
	if(sML.UA.Ge) this.blur();
	return false;
}

sML.setLinkToOpenNewWindow = function(LINK) {
	LINK.onclick = LINK.onkeypress = function() {
		window.open(this.href);
		if(sML.UA.Ge) this.blur();
		return false;
	}
}

sML.setOddEven = function() {
	var LISTs = sML.toArray(
		document.getElementsByTagName("ul"),
		document.getElementsByTagName("ol"),
		document.getElementsByTagName("menu")
	);
	if(LISTs.length) for(var listL = LISTs.length, i = 0; i < listL; i++) {
		var LIs = sML.toArray(LISTs[i].getElementsByTagName("li")).filter(function(LI) { return (LI.parentNode == LISTs[i]); });
		for(var L = LIs.length, j = 0; j < L; j += 2) LIs[j].className = LIs[j].className + (LIs[j].className ? " " : "") + "odd";
		for(var L = LIs.length, j = 1; j < L; j += 2) LIs[j].className = LIs[j].className + (LIs[j].className ? " " : "") + "even";
	}
	var DLs = document.getElementsByTagName("dl");
	if(DLs.length) for(var dlL = DLs.length, i = 0; i < dlL; i++) {
		var DTs = DLs[i].getElementsByTagName("dt"), DDs = DLs[i].getElementsByTagName("dd");
		for(var L = DTs.length, j = 0; j < L; j += 2) DTs[j].className = DTs[j].className + (DTs[j].className ? " " : "") + "odd";
		for(var L = DTs.length, j = 1; j < L; j += 2) DTs[j].className = DTs[j].className + (DTs[j].className ? " " : "") + "even";
		for(var L = DDs.length, j = 0; j < L; j += 2) DDs[j].className = DDs[j].className + (DDs[j].className ? " " : "") + "odd";
		for(var L = DDs.length, j = 1; j < L; j += 2) DDs[j].className = DDs[j].className + (DDs[j].className ? " " : "") + "even";
	}
	var TABLEs = document.getElementsByTagName("table");
	if(TABLEs.length) for(var tableL = TABLEs.length, i = 0; i < tableL; i++) {
		var TRs = TABLEs[i].getElementsByTagName("tr");
		for(var L = TRs.length, j = 0; j < L; j += 2) TRs[j].className = TRs[j].className + (TRs[j].className ? " " : "") + "odd";
		for(var L = TRs.length, j = 1; j < L; j += 2) TRs[j].className = TRs[j].className + (TRs[j].className ? " " : "") + "even";
	}
}

sML.equalizeHeight = function(Elements, ElementsPerGroup, Padding, FixedHeight) {
	var Group = [], Groups = [];
	if(!ElementsPerGroup) var ElementsPerGroup = Elements.length;
	if(!Padding) var Padding = 0;
	for(var L = Elements.length, i = 0; i < L; i++) {
		if(i % ElementsPerGroup == 0) Group = [];
		Group.push(Elements[i]);
		if(i % ElementsPerGroup == ElementsPerGroup - 1 || i == Elements.length - 1) Groups.push(Group);
	}
	for(var gsL = Groups.length, i = 0; i < gsL; i++) {
		var H = 0;
		var Highest = null;
		for(var gL = Groups[i].length, j = 0; j < gL; j++) {
			Groups[i][j].style.height = "auto";
			var eH = parseInt(getComputedStyle(Groups[i][j], "").height);	//	var eH = sML.coord.getElementSize(Groups[i][j]).h;
			if(eH > H) {
				H = eH;
				Highest = Groups[i][j];
			}
		}
		for(var gL = Groups[i].length, j = 0; j < gL; j++) {
//			if(Groups[i][j] == Highest) continue;
			if(FixedHeight) Groups[i][j].style.height    = H + "px"; //			if(FixedHeight) Groups[i][j].style.height    = (H - Padding) + "px";
			else            Groups[i][j].style.minHeight = H + "px"; //			else            Groups[i][j].style.minHeight = (H - Padding) + "px";
		}
	}
}

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Twitter = {
	timeline: {
		Params : [],
		load : function(Style, Param) {
			var Prtcl = document.location.protocol;
			if(!Param.Style) Param.Style = Style;
			if(!Param.Placeholder && this.Style[Param.Style].Placeholder) Param.Placeholder = this.Style[Param.Style].Placeholder;
			if(!Param.Callback) Param.Callback = this.Style[Param.Style].after ? this.Style[Param.Style].after : function() {};
			if(!Param.Timeout) Param.Timeout = 8000;
			Param.ModuleNum = this.Params.length;
			Param.ModuleID = sML.padZero(Param.ModuleNum, 2);
			var SCRIPT = document.createElement("script"), SRC = "";
			if(Param.User && !Param.Key) Param.Key = Param.User.replace(/^@/, "");
			if(/^[^#@\/\*]/.test(Param.Key)) {
				Param.SingleUser = 1;
				Param.Keys = ["", Param.Key];
				SRC = Prtcl + "//api.twitter.com/1/statuses/user_timeline.json?screen_name=" + Param.Keys[1] + "&count=" + Param.Tweets;
			} else {
				Param.SingleUser = 0, Param.Prefix = Param.Key.charAt(0);
					 if(Param.Prefix == "#") Param.Keys = ["%23",   Param.Key.split("#")[1]];
				else if(Param.Prefix == "@") Param.Keys = ["to%3A", Param.Key.split("@")[1]];
				else if(Param.Prefix == "*") Param.Keys = ["",      Param.Key.split("*")[1]];
				else                         Param.Keys = ["",      Param.Key];
				if(Param.Keys[1].indexOf("/") > -1) {
					var ListKeys = Param.Keys[1].split("/");
					Param.Keys[1] = ListKeys[0];
					Param.Keys[2] = ListKeys[1];
				}
				if(Param.Keys[2]) SRC += Prtcl + "//api.twitter.com/1/" + Param.Keys[1] + "/lists/" + Param.Keys[2] + "/statuses.json?per_page=";
				else              SRC += Prtcl + "//search.twitter.com/search.json?q=" + Param.Keys[0] + Param.Keys[1] + "&rpp=";
				SRC += Param.Tweets;
			}
			SRC += "&callback=sML.Twitter.timeline.Callback" + Param.ModuleID;
			this["Callback" + Param.ModuleID] = function(T) {
				if(sML.Twitter.timeline["isError_" + Param.ModuleID]) return;
				if(sML.Twitter.timeline["showError_" + Param.ModuleID]) clearTimeout(sML.Twitter.timeline["showError_" + Param.ModuleID]);
				if(T instanceof Array) T = { results: T };
				if(T.results.length) {
					sML.Twitter.timeline.set(Param, T);
					var Success =  1;
				} else {
					var Success = -1;
				}
				Param.Callback(Param, Success);
			}
			if(!Param.Placeholder) {
				sML.write(
					'<div class="sML-Twitter-Timeline-Placeholder" id="sML-Twitter-Timeline-Placeholder_' + Param.ModuleID + '">',
						(this.Style[Param.Style].Template.alt ? this.Style[Param.Style].Template.alt(Param) : ""),
					'</div>'
				);
				Param.Placeholder = document.getElementById("sML-Twitter-Timeline-Placeholder_" + Param.ModuleID);
			} else if(this.Style[Param.Style].Template.alt) {
				Param.Placeholder = sML.replaceElement(sML.hatch(this.Style[Param.Style].Template.alt(Param)), Param.Placeholder);
				if(Param.altCallback) Param.altCallback(Param, -1);
			}
			this.Params[Param.ModuleNum] = Param;
			if(this.Style[Param.Style].Template.error) this["showError_" + Param.ModuleID] = setTimeout(function() {
				sML.Twitter.timeline["isError_" + Param.ModuleID] = 1;
				sML.replaceElement(sML.hatch(sML.Twitter.timeline.Style[Param.Style].Template.error(Param)), Param.Placeholder);
				Param.Callback(Param, 0);
			}, Param.Timeout);
			var SCIRPT = document.createElement("script");
			SCRIPT.id = "sML-Twitter-Timeline-Loader_" + Param.ModuleID, SCRIPT.src = SRC;
			sML.onRead.addEventListener(function() { document.getElementsByTagName("body")[0].appendChild(SCRIPT); });
		},
		set : function(Param, T) {
			if(Param.SingleUser) {
				if(!Param.UserName) Param.UserName = T.results[0].user.name;
				Param.UserImage =  T.results[0].user.profile_image_url;
			}
			var TMPL = this.Style[Param.Style].Template;
			Param.HTML = "";
			if(TMPL.head) Param.HTML += TMPL.head(Param);
			for(var L = T.results.length, i = 0; i < L; i++) {
				var R = T.results[i];
				R.text = sML.String.replace(R.text, [
					/</g, '&lt;',
					/>/g, '&gt;',
					/(^|[\s　])(https?(:\/\/[\w\d\-.!~*;\/?@&=+\$,%#]+))/g, '$1<a href="$2">$2</a>',
					/(^|[\s　])(@[\w\d]+)/g, '$1<a href="http://twitter.com/$2">$2</a>',
					/(^|[^&\/\w\dａ-ｚＡ-Ｚ０-９ぁ-ヶ一-龠ｦ-ﾟー゛゜々ヾヽ])([#＃][\w\dａ-ｚＡ-Ｚ０-９ぁ-ヶ一-龠ｦ-ﾟー゛゜々ヾヽ]+)/g, '$1<a href="http://twitter.com/search?q=$2">$2</a>'
				]);
				Param.HTML += TMPL.body(R);
			}
			if(Param.SingleUser) Param.HTML = Param.HTML.replace("{UserName}", Param.UserName);
			if(TMPL.foot) Param.HTML += TMPL.foot(Param);
			Param.Placeholder = (typeof Param.Placeholder == "object") ? Param.Placeholder : sML.getElements(Param.Placeholder)[0];
			sML.replaceElement(sML.hatch(Param.HTML), Param.Placeholder);
			sML.removeElement(document.getElementById("sML-Twitter-Timeline-Loader_" + Param.ModuleID));
			T = Param = null;
			delete T;
			delete Param;
		}
	},
	button: {
		getURL: function(Ps, isFrame) {
			if(!Ps.count)            Ps.count            = "none";
			if(!Ps.original_referer) Ps.original_referer = location.href;
			if(!Ps.url)              Ps.url              = location.href;
			if(Ps.related && typeof Ps.related == "object") {
				var Rel = "";
				for(var a in Ps.related) Rel += a + (Ps.related[a] ? (":" + Ps.related[a]) : "");
				Ps.related = Rel;
			}
			var Prtcl = document.location.protocol;
			var            URL  = Prtcl + (isFrame ? "//platform0.twitter.com/widgets/tweet_button.html" : "//twitter.com/share");
			               URL += "?_="                + (new Date()).getTime();
			               URL += "&count="            + Ps.count;
			if(!isFrame)   URL += "&original_referer=" + encodeURIComponent(Ps.original_referer);
			if(Ps.text)    URL += "&text="             + encodeURIComponent(Ps.text);
			               URL += "&url="              + encodeURIComponent(Ps.url);
			if(Ps.via)     URL += "&via="              + Ps.via;
			if(Ps.related) URL += "&related="          + encodeURIComponent(Ps.related);
			return URL;
		},
		open: function(Ps, wPs) {
			if(!wPs) var wPs = {};
			var dS = { w:550, h:450 };
			var sS = sML.coord.getScreenSize();
			var wParams = {
				left        : (wPs.left        ? wPs.left        : Math.round((sS.w - dS.w) / 2)),
				top         : (wPs.top         ? wPs.top         : Math.round((sS.h - dS.h) / 2)),
				width       : (wPs.width       ? wPs.width       :                         dS.w ),
				height      : (wPs.height      ? wPs.height      :                         dS.h ),
				personalbar : (wPs.personalbar ? wPs.personalbar :                           "1"),
				toolbar     : (wPs.toolbar     ? wPs.toolbar     :                           "1"),
				scrollbars  : (wPs.scrollbars  ? wPs.scrollbars  :                           "1"),
				location    : (wPs.location    ? wPs.location    :                           "1"),
				resizable   : (wPs.resizable   ? wPs.resizable   :                           "1"),
				status      : (wPs.status      ? wPs.status      :                           "1")
			}
			var wP = "";
			for(var P in wParams) wP += P + "=" + wParams[P] + ",";
			wP = wP.replace(/\,$/, "");
			var W = window.open(this.getURL(Ps, 0), "twitter_tweet", wP);
			if(W) W.focus();
		},
		getFrame: function(Ps, Styles) {
			if(!Ps.count) Ps.count = "none";
			var IFRAME = [
				'<iframe',
				' class="twitter-share-button twitter-count-' + Ps.count + '"',
				' allowtransparency="true" frameborder="0" scrolling="no" tabindex="0"',
				'></iframe>'
			].join("");
			var DIV = document.createElement("div");
			DIV.innerHTML = IFRAME;
			IFRAME = DIV.firstChild.cloneNode(false);
			IFRAME.src = this.getURL(Ps, 1);
			IFRAME.title = "Twitter For Websites: Tweet Button";
			if(Styles) IFRAME = sML.CSS.set(IFRAME, Styles);
			return IFRAME;
		}
	}
}

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Ustream = {
	getMType : function(M) {
		if(/^s/i.test(M)) return "S";
		if(/^m/i.test(M)) return "M";
		if(/^l/i.test(M)) return "L";
	},
	getHTML : function(M, Ps) {
		M = this.getMType(M);
		if(!Ps.height) {
			     if(M == "S") Ps.height = Math.ceil(Ps.width *   4 /   5);
			else if(M == "M") Ps.height = Math.ceil(Ps.width * 293 / 240);
			else if(M == "L") Ps.height = Math.ceil(Ps.width *   4 /   5);
		}
		if(M == "S") {
			return [
				'<iframe',
					' src="http://www.ustream.tv/socialstream/' + Ps.cid + '"',
					' frameborder="0" scrolling="no"',
					' style="border:none 0; width:' + Ps.width + 'px; height:' + Ps.height + 'px;"',
				'></iframe>'
			].join("");
		} else {
			return sML.fp.getHTML({
				id: Ps.id,
				data: "http://www.ustream.tv/flash/" + ((M == "L") ? ("live/1/" + Ps.cid) : "mediastream/" + Ps.cid),
				width: Ps.width,
				height: Ps.height,
				bgcolor : "#000000",
				allowfullscreen : "true",
				allowscriptaccess : "always",
				flashvars: ((M == "L") ? "autoplay=false&amp;brand=embed&amp;" : "") + "cid=" + Ps.cid + "&amp;locale=ja_JP"
			}, 9);
		}
	},
	write : function(M, Ps) {
		sML.write(this.getHTML(M, Ps));
	}
}





//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Readied ?

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.readied = 1; return sML; })();


