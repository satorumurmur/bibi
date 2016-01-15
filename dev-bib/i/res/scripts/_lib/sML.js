



/*!
 *
 * # sML JavaScript Library
 *
 * - "I'm a Simple and Middling Library."
 * - Copyright (c) Satoru MATSUSHIMA - https://github.com/satorumurmur/sML
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 */ sML = (function() { var version = "0.999.24", build = 20160115.0;




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Polarstar

//----------------------------------------------------------------------------------------------------------------------------------------------

var sML = function(S) {
	var SML = (typeof S == "string") ? [sML.create.apply(this, arguments)] : (S.length ? S : [S]);
	if(window.__proto__) SML.__proto__ = sML.SML; else for(var M in sML.SML) SML[M] = sML.SML[M];
	return SML;
};

sML.Version = sML.version = version, sML.Build = sML.build = build;

var nUA = navigator.userAgent;
var getVersion = function(Prefix) {
	var N = parseFloat(nUA.replace(new RegExp('^.*' + Prefix + '[ :\\/]?(\\d+([\\._]\\d+)?).*$'), "$1").replace(/_/g, "."));
	return (!isNaN(N) ? N : undefined);
};

sML.OperatingSystem = sML.OS = (function(OS) {
         if(          /iPhone OS \d/.test(nUA)) OS.iOS          = getVersion("iPhone OS");
    else if(        /OS X 10[\._]\d/.test(nUA)) OS.OSX          = getVersion("OS X 10[\\._]");
    else if(/Windows Phone( OS)? \d/.test(nUA)) OS.WindowsPhone = getVersion("Windows Phone OS") || getVersion("Windows Phone");
    else if(      /Windows( NT)? \d/.test(nUA)) OS.Windows      = getVersion("Windows NT") || getVersion("Windows");
    else if(            /Android \d/.test(nUA)) OS.Android      = getVersion("Android");
    else if(                  /CrOS/.test(nUA)) OS.Chrome       = true;
    else if(                  /X11;/.test(nUA)) OS.Linux        = true;
    else if(               /Firefox/.test(nUA)) OS.Firefox      = true;
    return OS;
})({});

sML.UserAgent = sML.UA = (function(UA) {
    if(/Gecko\/\d/.test(nUA)) {
        UA.Gecko = getVersion("rv");
        if(/Firefox\/\d/.test(nUA)) UA.Firefox = getVersion("Firefox");
    } else if(/Edge\/\d/.test(nUA)) {
        UA.Edge = getVersion("Edge");
    } else if(/Chrome\/\d/.test(nUA)) {
        UA.Blink = getVersion("Chrome") || true;
             if( /OPR\/\d/.test(nUA)) UA.Opera  = getVersion("OPR");
        else if(/Silk\/\d/.test(nUA)) UA.Silk   = getVersion("Silk");
        else                          UA.Chrome = UA.Blink;
    } else if(/AppleWebKit\/\d/.test(nUA)) {
        UA.WebKit = getVersion("AppleWebKit");
             if(   /CriOS \d/.test(nUA)) UA.Chrome  = getVersion("CriOS");
        else if(   /FxiOS \d/.test(nUA)) UA.Firefox = getVersion("FxiOS");
        else if(/Version\/\d/.test(nUA)) UA.Safari  = getVersion("Version");
    } else if(/Trident\/\d/.test(nUA)) {
        UA.Trident          = getVersion("Trident"); 
        UA.InternetExplorer = getVersion("rv") || getVersion("MSIE");
    }
    try { UA.Flash = parseFloat(navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin.description.replace(/^.+?([\d\.]+).*$/, "$1")); } catch(e) {}
    return UA;
})({});

sML.Environments = sML.Env = (function(Env) {
    ["OS", "UA"].forEach(function(OS_UA) { for(var Param in sML[OS_UA]) if(Param != "Flash" && sML[OS_UA][Param]) Env.push(Param); });
	return Env;
})([]);

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.log = function() { try { console.log.apply(console, arguments); } catch(e) {} };

sML.write = function() {
	document.open();
	for(var i = 0, L = arguments.length; i < L; i++) document.write(arguments[i]);
	document.close();
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Fill

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Fill = {
	Prefixes: ['webkit', 'moz', 'MS', 'ms', 'o'],
	extendElements: function(E) { return E; },
	carePrefix: function(O, P) {
		if(P in O) return O[P];
		P = P[0].toUpperCase() + P.slice(1);
		for(var Property = "", i = 0, L = this.Prefixes.length; i < L; i++) {
			Property = this.Prefixes[i] + P;
			if(Property in O) return O[Property];
		}
		return undefined;
	}
};

if(sML.UA.InternetExplorer < 9) {
	sML.Fill.extendElement = function(E) {
		E.getElementsByClassName = sML.Fill.getElementsByClassName;
		E.addEventListener       = sML.Fill.addEventListener;
		E.removeEventListener    = sML.Fill.removeEventListener;
		return E;
	};
	sML.Fill.extendElements = function(E) {
		sML.Fill.extendElement(E);
		sML.each(E.getElementsByTagName("*"), function() { sML.Fill.extendElement(this); });
		return E;
	};
	sML.Fill.getElementsByClassName = function(Cs) {
		return this.querySelectorAll("." + Cs.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\s+/, "."));
	};
	sML.Fill.addEventListener    = function(EN, EL) {
		if(!this["FunctionsOn" + EN]) this["FunctionsOn" + EN] = [], this["XWrappersOn" + EN] = [];
		var E = this, Functions = this["FunctionsOn" + EN], XWrappers = this["XWrappersOn" + EN];
		if(EN == "DOMContentLoaded") {
			var XEL = function() { if(E.readyState === "complete") EL.apply(E, arguments); };
			EN = "readystatechange";
		} else {
			var XEL = function() { EL.apply(E, arguments); };
		}
		this.attachEvent("on" + EN, XEL);
		XWrappers.push(XEL);
		Functions.push( EL);
		return this;
	};
	sML.Fill.removeEventListener = function(EN, EL) {
		var E = this, Functions = this["FunctionsOn" + EN], XWrappers = this["XWrappersOn" + EN];
		for(var i = 0, L = Functions.length; i < L; i++) if(Functions[i] == EL) break;
		if(EN == "DOMContentLoaded") EN = "readystatechange";
		this.detachEvent("on" + EN, XWrappers[i]);
		XWrappers[i] = Functions[i] = null;
		return this;
	};
	window.getComputedStyle    = function(E)      { return E.currentStyle; };
	window.addEventListener    = function(EN, EL) { this.attachEvent("on" + EN, EL); return this; };
	window.removeEventListener = function(EN, EL) { this.detachEvent("on" + EN, EL); return this; };
	sML.Fill.extendElement(document);
	document.attachEvent("onreadystatechange", function() {
		if(document.readyState !== "complete") return;
		document.detachEvent("onreadystatechange", arguments.callee);
		sML.extendElements(document.documentElement);
	});
	window.Event.prototype.stopPropagation = function() { this.cancelBubble = true; };
	window.Event.prototype.preventDefault  = function() { this.returnValue = false; };
	Array.prototype.map = function(F, This) {
		if(typeof F != "function") throw new TypeError();
		for(var A = [], i = 0, L = this.length; i < L; i++) A.push(F.call(This, this[i], i, this));
		return A;
	};
	Array.prototype.filter = function(F, This) {
		if(typeof F != "function") throw new TypeError();
		for(var A = [], i = 0, L = this.length; i < L; i++) if(F.call(This, this[i], i, this)) A.push(this[i]);
		return A;
	};
	Array.prototype.forEach = function(F, This) {
		if(typeof F != "function") throw new TypeError();
		for(var i = 0, L = this.length; i < L; i++) F.call(This, this[i], i, this);
	};
	["section", "article", "nav", "aside", "header", "footer", "figure"].forEach(function(TagName) { document.createElement(TagName); });
}

if(sML.UA.InternetExplorer <= 9) {
	if(typeof window.console     == "undefined") window.console     =            {};
	if(typeof window.console.log != "function" ) window.console.log = function() {};
}

sML.extendElements = sML.Fill.extendElements;

window.requestAnimationFrame = sML.Fill.carePrefix(window, "requestAnimationFrame") || function(F) { setTimeout(F, 1000/60); };

if(!window.CustomEvent || (typeof window.CustomEvent !== "function") && (window.CustomEvent.toString().indexOf('CustomEventConstructor') === -1)) {
	window.CustomEvent = function(EventName, Option) {
		Option = Option || { bubbles: false, cancelable: false, detail: undefined };
		var Eve = document.createEvent("CustomEvent");
		Eve.initCustomEvent(EventName, Option.bubbles, Option.cancelable, Option.detail);
		return Eve;
	};
	window.CustomEvent.prototype = window.Event.prototype;
}




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Events / Chain

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Event = {
	OnRead: { Done: false, Functions: [] },
	OnLoad: { Done: false, Functions: [] },
	add:    function(O, EN, EL, UC) { O.addEventListener(   EN, EL, (UC ? true : false)); return O; },
	remove: function(O, EN, EL, UC) { O.removeEventListener(EN, EL, (UC ? true : false)); return O; },
	stopPropagation: function() { /*@cc_on @if (@_jscript_version<9) arguments[0]=event; @end @*/ return arguments[0].stopPropagation(); },
	preventDefault:  function() { /*@cc_on @if (@_jscript_version<9) arguments[0]=event; @end @*/ return arguments[0].preventDefault(); },
    set: function(O, E) { for(var EN in E) O.addEventListener(EN, E[EN], false); }
};

sML.addEventListener    = sML.Event.add;
sML.removeEventListener = sML.Event.remove;
sML.stopPropagation = sML.Event.stopPropagation;
sML.preventDefault  = sML.Event.preventDefault;

sML.Event.OnRead.doOnRead = sML.Event.OnLoad.doOnLoad = function() {
	if(this.Done) return;
	this.Done = true;
	while(this.Functions.length) this.Functions.shift()();
};
sML.Event.OnRead.addEventListener = sML.Event.OnLoad.addEventListener = function(EL) {
	return (this.Done) ? EL() : this.Functions.push(EL);
};

sML.onread = sML.ready = function(EL) { return sML.Event.OnRead.addEventListener(EL); };
sML.onload = sML.done  = function(EL) { return sML.Event.OnLoad.addEventListener(EL); };

document.addEventListener("DOMContentLoaded", function() {
	document.removeEventListener("DOMContentLoaded", arguments.callee, false);
	sML.Event.OnRead.doOnRead();
}, false);
window.addEventListener("load", function() {
	window.removeEventListener("load", arguments.callee, false);
	sML.Event.OnRead.doOnRead();
	sML.Event.OnLoad.doOnLoad();
}, false);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

sML.Event.OnResizeFont = sML.onResizeFont = sML.onresizefont = {
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
				for(var i = 0, L = Functions.length; i < L; i++) Functions[i]();
			}
			sML.onResizeFont.prevHeight = currentHeight;
		}, T);
	},
	stopDetect: function() {
		if(this.timer) clearTimeout(this.timer);
	}
};

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.addTouchEventObserver = sML.observeTouch = function(E, Option) {
	/*! Requires Hammer.js - http://hammerjs.github.io/ - Copyright (c) Jorik Tangelder - Licensed under the MIT license. */
	if(E.addTouchEventListener) return E;
	if(!window.Hammer) return sML.edit(E, { addTouchEventListener: function() { return false; }, removeTouchEventListener: function() { return false; } });
	var HM = new Hammer.Manager(E);
	if(!Option || Option.Pan)       HM.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
	if(!Option || Option.Swipe)     HM.add(new Hammer.Swipe()).recognizeWith(HM.get('pan'));
	if(!Option || Option.Rotate)    HM.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(HM.get('pan'));
	if(!Option || Option.Pinch)     HM.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([HM.get('pan'), HM.get('rotate')]);
	if(!Option || Option.DoubleTap) HM.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
	if(!Option || Option.Tap)       HM.add(new Hammer.Tap());
	return sML.edit(E, {
		TouchEventObserver: HM,
		TouchEventHandlers: [],
		addTouchEventListener: function(EN, EH) {
			var Wrapper = function(e) { EH.apply(E, [e.srcEvent, e]); };
			E.TouchEventHandlers.push([EH, Wrapper]);
			E.TouchEventObserver.on(EN, Wrapper);
			return E;
		},
		removeTouchEventListener: function(EN, EH) {
			if(!EH || typeof EH != "function") E.TouchEventObserver.off(EN);
			else {
				var TouchEventHandlers = [];
				for(var i = 0, L = E.TouchEventHandlers.length; i < L; i++) {
					if(E.TouchEventHandlers[i][0] == EH) E.TouchEventObserver.off(EN, E.TouchEventHandlers[i][1]);
					else TouchEventHandlers.push(E.TouchEventHandlers[i]);
				}
				E.TouchEventHandlers = TouchEventHandlers;
			}
			return E;
		}
	});
};

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Chain = function() {
	this.Functions = arguments.length ? sML.toArray(arguments) : [];
	this.add = function() {
		for(var i = 0, L = arguments.length; i < L; i++) this.Functions.push(arguments[i]);
	};
	this.start = this.next = function() {
		var F = this.Functions.shift();
		if(typeof F == "function") F.apply(null, arguments);
	};
	this.skip = function(D) {
		if(typeof D == "number") for(var i = 0; i < D; i++) this.Functions.shift();
	};
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Timers / AnimationFrames

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Timers = {
	setTimeout:  function() {
		var T = Array.prototype.shift.call(arguments);
		var F = Array.prototype.shift.call(arguments);
		Array.prototype.unshift.call(arguments, T);
		Array.prototype.unshift.call(arguments, F);
		return setTimeout.apply(window, arguments);
	},
	setInterval: function() {
		var T = Array.prototype.shift.call(arguments);
		var F = Array.prototype.shift.call(arguments);
		Array.prototype.unshift.call(arguments, T);
		Array.prototype.unshift.call(arguments, F);
		return setInterval.apply(window, arguments);
	}
};

sML.setTimeout  = sML.Timers.setTimeout;
sML.setInterval = sML.Timers.setInterval;

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Drawer = {
	draw: function(What, F) {
		if(!What.ToBeDrawn) {
			requestAnimationFrame(function() {
				F.apply(What, arguments);
				What.ToBeDrawn = false;
			});
			What.ToBeDrawn = true;
		}
	}
};

sML.draw = sML.Drawer.draw;




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- DOM / Elements

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.getElements = sML.getElementsBySelector = function() {
	for(var i = 1, L = arguments.length; i < L; i++) arguments[0] += "," + arguments[i];
	return document.querySelectorAll(arguments[0]);
};

sML.cloneObject = function(O) {
	var F = function() {};
	F.prototype = O;
	return new F();
};

sML.set = sML.edit = sML.setProperties = sML.setMembers = function(O, P, S, E) {
	if(P) {
		if(P["ObserveTouch"]) {
			sML.addTouchEventObserver(O);
			delete P["ObserveTouch"];
		}
		for(var p in P) {
			if(/^data-/.test(p)) O.setAttribute(p, P[p]);
			else                 O[p] = P[p];
		}
	}
	if(S) sML.CSS.set(O, S);
    if(E) sML.Event.set(O, E);
	/*@cc_on @if (@_jscript_version<9) sML.Fill.extendElements(arguments[0]); @end @*/ return O;
};

sML.create = sML.createElement = function(TagName, M, S, E) {
	return sML.set(document.createElement(TagName), M, S, E);
};

sML.changeClass = sML.changeClassName = function(E, CN) {
	if(CN) E.className = CN;
	else E.removeAttribute("class");
	return E.className;
};

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
	if(!Es.length) P.appendChild(Es);
	else for(var i = 0, L = Es.length; i < L; i++) P.appendChild(Es[i]);
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
	for(var HTML = "", i = 0, L = arguments.length; i < L; i++) HTML += arguments[i];
	var Egg = document.createElement("div");
	var Chick = document.createDocumentFragment();
	var brood = function() {
		Egg.innerHTML = HTML;
		for(var i = 0, L = Egg.childNodes.length; i < L; i++) Chick.appendChild(Egg.firstChild);
	}
	if(sML.UA.InternetExplorer < 9) {
		document.body.appendChild(Egg).style.display = "none";
		brood();
		document.body.removeChild(Egg);
	} else brood();
	return Chick;
};

sML.getContentDocument = function(F) {
	return (sML.UA.InternetExplorer < 8) ? F.contentWindow.document : F.contentDocument;
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- CSS

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.CSS = sML.S = {
	Prefix:        (sML.UA.WebKit || sML.UA.Blink ? "Webkit"              : (sML.UA.Gecko ? "Moz"           : (sML.UA.Trident ? "ms"              : ""))),
	TransitionEnd: (sML.UA.WebKit || sML.UA.Blink ? "webkitTransitionEnd" : (sML.UA.Gecko ? "transitionend" : (sML.UA.Trident ? "MSTransitionEnd" : ""))),
	AnimationEnd:  (sML.UA.WebKit || sML.UA.Blink ? "webkitAnimationEnd"  : (sML.UA.Gecko ? "animationend"  : (sML.UA.Trident ? "MSAnimationEnd"  : ""))),
	Catalogue : [],
	getSFO : function(E) {
		for(var i = 0, L = this.Catalogue.length; i < L; i++) if(this.Catalogue[i].Element == E) return this.Catalogue[i];
		return this.Catalogue[this.Catalogue.push({ Element: E }) - 1];
	},
	getComputedStyle: function(E, P) {
		var S = E.currentStyle || document.defaultView.getComputedStyle(E, (P ? P : "")) 
		return S;
	},
	StyleSheets: [],
	getStyleSheet: function(ParentDocument) {
		if(sML.UA.InternetExplorer < 9) return ParentDocument.styleSheets[ParentDocument.styleSheets.length - 1];
		for(var i = 0, L = this.StyleSheets.length; i < L; i++) {
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
		if(StyleSheet) {
			if(StyleSheet.addRule) {
				var Index = StyleSheet.rules.length;
				StyleSheet.addRule(Selector, Styles, Index);
				return Index;
			} else if(StyleSheet.insertRule) {
				return StyleSheet.insertRule(Selector + "{" + Styles + "}", StyleSheet.cssRules.length);
			}
		}
		return null;
	},
	addRules: function(CSS, ParentDocument) {
		var Indexes = [];
		     if(typeof CSS.join == "function") for(var i = 0, L = CSS.length / 2; i < L; i++) Indexes.push(this.addRule(CSS[i * 2], CSS[i * 2 + 1], ParentDocument));
		else if(typeof CSS      == "object")   for(var Selector in CSS)                       Indexes.push(this.addRule(Selector,   CSS[Selector],  ParentDocument));
		return Indexes;
	},
	add: function(CSS, ParentDocument) {
		return this.addRules(CSS, ParentDocument);
	},
	removeRule: function(Index, ParentDocument) {
		var StyleSheet = this.getStyleSheet((ParentDocument ? ParentDocument : document));
		if(StyleSheet) {
			     if(StyleSheet.removeRule) StyleSheet.removeRule(Index);
			else if(StyleSheet.deleteRule) StyleSheet.deleteRule(Index);
			else                           return null;
			return Index;
		}
		return null;
	},
	removeRules: function(Indexes, ParentDocument) {
		for(var i = 0, L = Indexes.length; i < L; i++) this.removeRule(Indexes[i], ParentDocument);
		return Indexes;
	},
	remove: function(Indexes, ParentDocument) {
		return this.removeRules(Indexes, ParentDocument);
	},
	setProperty: function(E, P, V, Prefixing) {
		if(!E || !P) return E;
		if(/^(animation|background(-s|S)ize|box|break|column|filter|flow|hyphens|region|shape|transform|transition|writing)/.test(P)) { // 2013/09/25
			E.style[this.Prefix + P.replace(/(-|^)([a-z])/g, function (M0, M1, M2) { return M2 ? M2.toUpperCase() : ""; })] = V;
		} else if(P == "float") {
			P = sML.UA.InternetExplorer ? "styleFloat" : "cssFloat";
		}
		E.style[P] = V;
		return E;
	},
	addTransitionEndListener: function(E, F) {
		if(typeof F != "function") return;
		E.sMLTransitionEndListener = F;
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
		if(PV.length % 2 < 1) for(var i = 0, L = PV.length / 2; i < L; i++) this.setProperty(E, PV[i * 2], PV[i * 2 + 1]);
		return E;
	},
	getRGB: function(Property) {
		var RGB = Property.replace(/rgb\(([\d\., ]+)\)/, "$1").replace(/\s/g, "").split(",");
		for(var i = 0, L = RGB.length; i < L; i++) RGB[i] = parseInt(RGB[i]);
		return RGB;
	},
	getRGBA: function(Property) {
		var RGBA = Property.replace(/rgba?\(([\d\., ]+)\)/, "$1").replace(/\s/g, "").split(",");
		for(var i = 0, L = RGBA.length; i < L; i++) RGBA[i] = parseInt(RGBA[i]);
		if(!RGBA[3]) RGBA[3] = 1;
		return RGBA;
	}
};
sML.style = sML.css = function(E, PV, Cb) { return sML.CSS.set(E, PV, Cb); };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Easing

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Easing = (typeof window.easing == "object") ? window.easing : {};

sML.Easing.linear = function(Pos) { return Pos; };
sML.Easing.getEaser = function(Easing) {
	return function(Pos) {
		return Pos + Easing / 100 * (1 - Pos) * Pos
	};
}



//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Transition

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Transition = sML.T = {
	Catalogue : [],
	getSFO : function(E) {
		for(var i = 0, L = this.Catalogue.length; i < L; i++) if(this.Catalogue[i].Element == E) return this.Catalogue[i];
		return this.Catalogue[this.Catalogue.push({ Element: E }) - 1];
	},
	begin : function(E, Param, Functions) {
		if(!Param) var Param = {};
		if(!Functions) var Functions = {};
		this.Element = E;
		var SFO = this.getSFO(E);
		if(SFO.Timer) clearTimeout(SFO.Timer);
		SFO.Param = { // Params
			c:                         0 , // "C"urrent Frame (auto)
			f: (Param.f ? Param.f :   10), // "F"rames
			t: (Param.t ? Param.t :   10), // "T"ime/Frames (milli-seconds)
			e: (Param.e ? Param.e : null), // "E"asing (default)
			x: (Param.x ? Param.x : null)  // "X" for Easing (default)
		}
		SFO.Functions = { // Functions
			s: (Functions.s ? Functions.s : null),
			m: (Functions.m ? Functions.m : null),
			e: (Functions.e ? Functions.e : null),
			c: (Functions.c ? Functions.c : null)
		}
		SFO.gN = SFO.getNext = function(S, E, e, x) {
			var s = 1, t = SFO.Param.c / SFO.Param.f;
			if(!e && SFO.Param.e) var e = SFO.Param.e;
			if(!x && SFO.Param.x) var x = SFO.Param.x;
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
		if(SFO.Functions.s) SFO.Functions.s.call(E, SFO);
		(function() {
			if(SFO.Param.c++ != SFO.Param.f) {
				if(SFO.Functions.m) SFO.Functions.m.call(E, SFO);
				SFO.Timer = setTimeout(arguments.callee, SFO.Param.t);
			} else {
				if(SFO.Functions.e) SFO.Functions.e.call(E, SFO);
				if(SFO.Functions.c) SFO.Functions.c.call(E, SFO);
			}
		})();
	}
};
sML.transition = function() { return sML.Transition.begin.apply(sML.Transition, arguments); };




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Coord / Scroller

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Coord = sML.C = {
	getXY: function(X, Y) {
		return { X:X, x:X, Y:Y, y:Y };
	},
	getWH: function(W, H) {
		return { Width:W, W:W, w:W, Height:H, H:H, h:H };
	},
	getXYTRBLCMWH: function(X, Y, T, R, B, L, C, M, W, H) {
		return {
			                    X:X, x:X,
			                    Y:Y, y:Y,
			Top:   T, top:   T, T:T, t:T,
			Right: R, right: R, R:R, r:R,
			Bottom:B, bottom:B, B:B, b:B,
			Left:  L, left:  L, L:L, l:L,
			Center:C, center:C, C:C, c:C,
			Middle:M, middle:M, M:M, m:M,
			Width: W, width: W, W:W, w:W,
			Height:H, height:H, H:H, h:H
		}
	},
	getScreenSize: function() {
		return this.getWH(screen.availWidth, screen.availHeight);
	},
	getScrollSize: function (E) {
		if(!E || E == window || E == document) E = document.documentElement;
		return this.getWH(E.scrollWidth, E.scrollHeight);
	},
	getOffsetSize: function (E) {
		if(!E || E == window) E = document.documentElement;
		if(E == document) return this.getScrollSize(document.documentElement);
		return this.getWH(E.offsetWidth, E.offsetHeight);
	},
	getClientSize: function (E) {
		if(!E || E == window) E = document.documentElement;
		if(E == document) return this.getScrollSize(document.documentElement);
		return this.getWH(E.clientWidth, E.clientHeight);
	},
	getDocumentSize: function() {
		return this.getScrollSize(document.documentElement);
	},
	getWindowSize: function() {
		return this.getOffsetSize(document.documentElement);
	},
	getElementSize: function (E) {
		return this.getOffsetSize(E);
	},
	getWindowCoord: function(E) {
		return this.getXY((window.screenLeft || window.screenX), (window.screenTop  || window.screenY));
	},
	getElementCoord: function (E, RtL) {
		var X = E.offsetLeft, Y = E.offsetTop;
		if(RtL) X = X + E.offsetWidth - this.getOffsetSize(document.documentElement).W;
		while(E.offsetParent) E = E.offsetParent, X += E.offsetLeft, Y += E.offsetTop;
		return this.getXY(X, Y);
	},
	getScrollCoord: function(E) {
		if(!E || E == window) return this.getXY(
			(window.scrollX || window.pageXOffset || document.documentElement.scrollLeft),
			(window.scrollY || window.pageYOffset || document.documentElement.scrollTop)
		);
		return this.getXY(E.scrollLeft, E.scrollTop);
	},
	getScrollLimitCoord: function(E, RtL) {
		if(!E || E == window) E = document.documentElement;
		var SS = this.getScrollSize(E), OS = this.getClientSize(E);
		return this.getXY(
			(SS.W - OS.W) * (RtL ? -1 : 1),
			(SS.H - OS.H)
		);
	},
	getEventCoord: function(e) {
		return (e ? this.getXY(e.pageX, e.pageY) : this.getXY(0, 0));
	},
	getCoord: function(O, RtL) {
		if(RtL) return this.getCoord_RtL(O);
		/**/ if(O == screen)   var WH = this.getScreenSize(),                         LT = { X: 0,    Y: 0 },          RB = { X: WH.W,        Y:        WH.H };
		else if(O == window)   var WH = this.getOffsetSize(document.documentElement), LT = this.getScrollCoord(),      RB = { X: LT.X + WH.W, Y: LT.Y + WH.H };
		else if(O == document) var WH = this.getScrollSize(document.documentElement), LT = { X: 0,    Y: 0 },          RB = { X: WH.W,        Y:        WH.H };
		else if(O.tagName)     var WH = this.getOffsetSize(O),                        LT = this.getElementCoord(O),    RB = { X: LT.X + WH.W, Y: LT.Y + WH.H };
		else return {};
		return this.getXYTRBLCMWH(
			/*  XY  */ LT.X, LT.Y,
			/* TRBL */ LT.Y, RB.X, RB.Y, LT.X,
			/*  CM  */ Math.round((LT.X + RB.X) / 2), Math.round((LT.Y + RB.Y) / 2),
			/*  WH  */ WH.W, WH.H
		);
	},
	getCoord_RtL: function(O) {
		/**/ if(O == screen)   var WH = this.getScreenSize(),                         RT = { X: WH.W, Y: 0 },          LB = { X: 0,           Y:        WH.H };
		else if(O == window)   var WH = this.getOffsetSize(document.documentElement), RT = this.getScrollCoord(),      LB = { X: RT.X - WH.W, Y: RT.Y + WH.H };
		else if(O == document) var WH = this.getScrollSize(document.documentElement), RT = { X: 0,    Y: 0 },          LB = { X: WH.W,        Y:        WH.H };
		else if(O.tagName)     var WH = this.getElementSize(O),                       RT = this.getElementCoord(O, 1), LB = { X: RT.X - WH.W, Y: RT.Y + WH.H };
		else return {};
		return this.getXYTRBLCMWH(
			/*  XY  */ RT.X, RT.Y,
			/* TRBL */ RT.Y, RT.X, LB.Y, LB.X,
			/*  CM  */ Math.round((LB.X + RT.X) / 2), Math.round((RT.Y + LB.Y) / 2),
			/*  WH  */ WH.W, WH.H
		);
	},
	isInside: function(ARGUMENT, WHOLE, RtL) {
		var SWH = this.getOffsetSize(document.documentElement);
		if(RtL) var SRT = this.getScrollCoord(),                 S = { T: SRT.Y, R: SRT.X,         B: SRT.Y + SWH.H, L: SRT.X - SWH.W };
		else    var SLT = this.getScrollCoord(),                 S = { T: SLT.Y, R: SLT.X + SWH.W, B: SLT.Y + SWH.H, L: SLT.X         };
		if(ARGUMENT.tagName) {
			var EWH = this.getElementSize(ARGUMENT);
			if(RtL) var ERT = this.getElementCoord(ARGUMENT, 1), E = { T: ERT.Y, R: ERT.X,         B: ERT.Y + EWH.H, L: ERT.X - EWH.W };
			else    var ELT = this.getElementCoord(ARGUMENT),    E = { T: ELT.Y, R: ELT.X + EWH.W, B: ELT.Y + EWH.H, L: ELT.X         };
			E.C = (E.L + E.R) / 2, E.M = (E.T + E.B) / 2;
			var InL = ((E.L >= S.L) && (E.L <= S.R)), InH = ((E.C >= S.L) && (E.C <= S.R)), InR = ((E.R >= S.L) && (E.R <= S.R));
			var InT = ((E.T >= S.T) && (E.T <= S.B)), InV = ((E.M >= S.T) && (E.M <= S.B)), InB = ((E.B >= S.T) && (E.B <= S.B));
			var InX = WHOLE ? (InL && InR) : (InL || InH || InR);
			var InY = WHOLE ? (InT && InB) : (InT || InV || InB);
		} else if(typeof ARGUMENT == "object") {
			if(typeof ARGUMENT.X == "number") {
				var InX = ((ARGUMENT.X >= S.L) && (ARGUMENT.X <= S.R));
				if(typeof ARGUMENT.Y != "number") return InX;
			}
			if(typeof ARGUMENT.Y == "number") {
				var InY = ((ARGUMENT.Y >= S.T) && (ARGUMENT.Y <= S.B));
				if(typeof ARGUMENT.X != "number") return InY;
			}
		}
		return (InX && InY);
	}
};

sML.getCoord = function() { return sML.Coord.getCoord.apply(sML.Coord, arguments); };

sML.Scroller = {
	scrollTo_Legacy: function(tC, Param, Functions, ForceScroll) {
		if(!Param) Param = {};
		if(!Functions) Functions = {}; if(typeof Functions == "function") Functions = { c: Functions };
		this.SFO = {};
		var RtL = (Param.rtl || Param.rl || Param.vt || Param.vertical || /-rl$/.test(Param.writingMode ? Param.writingMode : (Param["writing-mode"] ? Param["writing-mode"] : (Param.wm ? Param.wm : undefined))));
		if(sML.Scroller.Timer) clearTimeout(sML.Scroller.Timer);
		     if(typeof tC == "number") tC = { Y: tC };
		else if(!tC) tC = {};
		else if(tC.tagName) tC = sML.Coord.getElementCoord(tC, RtL);
		var SFO = this.SFO;
		var SC = sML.Coord.getScrollCoord();
		var LC = sML.Coord.getScrollLimitCoord(window, RtL);
		SFO.DC = {
			X: (typeof tC.x == "number" ? tC.x : SC.X),
			Y: (typeof tC.y == "number" ? tC.y : SC.Y)
		}
		if(RtL) {
			if(SFO.DC.X < LC.X) SFO.DC.X = LC.X;
			if(SFO.DC.X >    0) SFO.DC.X =    0;
		} else {
			if(SFO.DC.X > LC.x) SFO.DC.X = LC.X;
			if(SFO.DC.X <    0) SFO.DC.X =    0;
		}
		/**/if(SFO.DC.Y > LC.Y) SFO.DC.Y = LC.Y;
		/**/if(SFO.DC.Y <    0) SFO.DC.Y =    0;
		SFO.Param = { // Params
			P: (Param.p ? Param.p : 0.25), // "P"roportion
			T: (Param.t ? Param.t : 20)    // "T"ime/Frames (milli-seconds)
		}
		SFO.Functions = { // Functions
			start:    (Functions.s ? Functions.s : null),
			middle:   (Functions.m ? Functions.m : null),
			end:      (Functions.e ? Functions.e : null),
			callback: (Functions.c ? Functions.c : null)
		}
		if(ForceScroll) sML.Scroller.preventUserScrolling();
		if(SFO.Functions.start) SFO.Functions.start(SFO);
		(function() {
			SFO.cC = sML.Coord.getScrollCoord();
			SFO.mV = {
				X: Math.floor((SFO.DC.X - SFO.cC.X) * SFO.Param.P),
				Y: Math.floor((SFO.DC.Y - SFO.cC.Y) * SFO.Param.P)
			}
			if(Math.abs(SFO.mV.X) > 1 || Math.abs(SFO.mV.Y) > 1) {
				window.scrollBy(SFO.mV.X, SFO.mV.Y);
				if(SFO.Functions.middle) SFO.Functions.middle(SFO);
				sML.Scroller.Timer = setTimeout(arguments.callee, SFO.Param.T);
			} else {
				RtL ? window.scrollBy(SFO.DC.X - SFO.cC.X, SFO.DC.Y - SFO.cC.Y) : window.scrollTo(SFO.DC.X, SFO.DC.Y);
				if(ForceScroll) sML.Scroller.allowUserScrolling();
				if(SFO.Functions.end)      SFO.Functions.end(SFO);
				if(SFO.Functions.callback) SFO.Functions.callback(SFO);
			}
		})();
		if(!ForceScroll) sML.Scroller.addScrollCancelation();
	},
	scrollTo: function(TargetElement, Goal, Param, Functions) {
		var SC = sML.Coord.getScrollCoord(TargetElement);
		var LC = sML.Coord.getScrollLimitCoord(TargetElement);
		if(typeof Goal == "number") Goal = { X: SC.X, Y: Goal }; else if(typeof Goal != "object" || !Goal) return;
		if(typeof Goal.X != "number") Goal.X = SC.X;
		if(typeof Goal.Y != "number") Goal.Y = SC.Y;
		if(!Param) Param = {};
		     if(typeof Param.Duration != "number" || Param.Duration < 0) Param.Duration = 100;
		var ease = sML.Easing.linear;
		     if(typeof Param.Easing == "function") var ease = Param.Easing;
		else if(typeof Param.Easing == "string")   var ease = sML.Easing[Param.Easing] ? sML.Easing[Param.Easing] : sML.Easing.linear;
		else if(typeof Param.Easing == "number")   var ease = sML.Easing.getEaser(Param.Easing);
		     if(typeof Functions == "function") Functions = { callback: Functions };
		else if(typeof Functions != "object" || !Functions) Functions = {};
		if(sML.Scroller.Timer) clearTimeout(sML.Scroller.Timer);
		if(!Param.ForceScroll) sML.Scroller.addScrollCancelation();
		else                   sML.Scroller.preventUserScrolling();
		if(typeof Functions.start == "function") Functions.start();
		var scroll = TargetElement == window ? window.scrollTo : function(X, Y) { TargetElement.scrollLeft = X; TargetElement.scrollTop  = Y; };
		(function(Start, Goal, Param, Functions) {
			var Pos = Param.Duration ? ((new Date()).getTime() - Start.Time) / Param.Duration : 1;
			if(Pos < 1) {
				var Progress = ease(Pos);
				scroll(
					Math.round(Start.X + (Goal.X - Start.X) * Progress),
					Math.round(Start.Y + (Goal.Y - Start.Y) * Progress)
				);
				if(typeof Functions.middle == "function") Functions.middle();
				var Next = arguments.callee;
				sML.Scroller.Timer = setTimeout(function() { Next(Start, Goal, Param, Functions); }, 10);
			} else {
				scroll(Goal.X, Goal.Y);
				if(typeof Functions.end == "function") Functions.end();
				if(typeof Functions.callback == "function") Functions.callback();
				if(Param.ForceScroll) sML.Scroller.allowUserScrolling();
			}
		})({ X: SC.X, Y: SC.Y, Time: (new Date()).getTime() }, Goal, Param, Functions);
	},
	addScrollCancelation: function() {
		   sML.addEventListener(document, "mousedown",      sML.Scroller.cancelScrolling);
		   sML.addEventListener(document, "keydown",        sML.Scroller.cancelScrolling);
		   sML.addEventListener(document, "mousewheel",     sML.Scroller.cancelScrolling);
		   sML.addEventListener(document, "DOMMouseScroll", sML.Scroller.cancelScrolling);
	},
	cancelScrolling: function() {
		//if(sML.Scroller.Timer) clearTimeout(sML.Scroller.Timer);
		sML.removeEventListener(document, "mousedown",      sML.Scroller.cancelScrolling);
		sML.removeEventListener(document, "keydown",        sML.Scroller.cancelScrolling);
		sML.removeEventListener(document, "mousewheel",     sML.Scroller.cancelScrolling);
		sML.removeEventListener(document, "DOMMouseScroll", sML.Scroller.cancelScrolling);
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

sML.scrollTo = function() {
	var TargetElement, Goal, Param, Functions;
	if(arguments[0] == window || arguments[0].tagName) {
		TargetElement = arguments[0], Goal = arguments[1], Param = arguments[2], Functions = arguments[3];
	} else {
		TargetElement = window, Goal = arguments[0], Param = arguments[1], Functions = arguments[2];
	}
	if(
		(typeof Goal  == "object" && (typeof Goal.x == "number"  || typeof Goal.y  == "number")) ||
		(typeof Param == "object" && (typeof Param.p == "number" || typeof Param.t == "number"))
	) return sML.Scroller.scrollTo_Legacy.apply(sML.Scroller, arguments);
	else return sML.Scroller.scrollTo.apply(    sML.Scroller, [TargetElement, Goal, Param, Functions]);
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
		for(var i = 0, L = KnVs.length; i < L; i++) {
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
		for(var i = 0, L = Cs.length; i < L; i++) {
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

//-- Array / Collection

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.map     = function(O, F) { return Array.prototype.map.call(O, F); };
sML.filter  = function(O, F) { return Array.prototype.filter.call(O, F); };
sML.forEach = function(O, F) { return Array.prototype.forEach.call(O, F); };

sML.foreach = function(O, F, This) {
	for(var i = 0, L = O.length; i < L; i++) if(F.call(This, O[i], i, O) === false) break;
	return O;
};

sML.each = function(O, F, From, Till) {
	for(var i = (From ? From : 0), L = (Till ? Till + 1 : O.length); i < L; i++) if(F.call(O[i], i, O) === false) break;
	return O;
};

sML.toArray = function() {
	for(var A = [], i = 0, aL = arguments.length; i < aL; i++) {
		if(typeof arguments[i].length == "undefined" || typeof arguments[i] == "string") A.push(arguments[i]);
		else for(var j = 0, eL = arguments[i].length; j < eL; j++)                       A.push(arguments[i][j]);
	}
	return A;
};

sML.firstOf = function(O) {
	return (O.length ? O[           0] : null);
};

sML.lastOf  = function(O) {
	return (O.length ? O[O.length - 1] : null);
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Math

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Math = {
	sum: function() {
		var Sum = 0;
		for(var i = 0, L = arguments.length; i < L; i++) {
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
		for(var i = 0, L = R.length / 2; i < L; i++) T = T.replace(R[i * 2], R[i * 2 + 1]);
		return T;
	}
};

sML.getLength = function(O) {
	if(typeof O == "object") {
		if(O instanceof Array) return O.length;
		var L = 0;
		for(var i in O) L++;
		return L;
	}
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
	getSelectedText: ((sML.UA.InternetExplorer < 9) ? function() {
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

//-- Fullscreen

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.Fullscreen = {
	Enabled: (function(D) {
	    return (
	                                                        	     D.fullscreenEnabled || // Standard
	                                                        	     D.fullScreenEnabled ||
	                                                        	     D.webkitFullscreenEnabled ||
	                                                        	     D.webkitFullScreenEnabled ||
	                                                        	     D.mozFullscreenEnabled ||
	                                                        	     D.mozFullScreenEnabled ||
	                                                        	     D.msFullscreenEnabled ||
	                                                        	     D.msFullScreenEnabled
	    );
	})(document),
	request: (function(Ele) {
		var getFunction = function(M) { return function(O) { if(!O) O = Ele; return O[M](); } };
		if(Ele.requestFullscreen)                             return getFunction("requestFullscreen"); // Standard
		if(Ele.requestFullScreen)                             return getFunction("requestFullScreen");
		if(Ele.webkitRequestFullscreen)                       return getFunction("webkitRequestFullscreen");
		if(Ele.webkitRequestFullScreen)                       return getFunction("webkitRequestFullScreen");
		if(Ele.mozRequestFullscreen)                          return getFunction("mozRequestFullscreen");
		if(Ele.mozRequestFullScreen)                          return getFunction("mozRequestFullScreen");
		if(Ele.msRequestFullscreen)                           return getFunction("msRequestFullscreen");
		if(Ele.msRequestFullScreen)                           return getFunction("msRequestFullScreen");
		return function() { return false; };
	})(document.documentElement),
	exit: (function(Doc) {
		var getFunction = function(M) { return function(O) { if(!O) O = Doc; return O[M](); } };
		if(Doc.exitFullscreen)                                return getFunction("exitFullscreen"); // Standard
		if(Doc.cencelFullScreen)                              return getFunction("cencelFullScreen");
		if(Doc.webkitExitFullscreen)                          return getFunction("webkitExitFullscreen");
		if(Doc.webkitCancelFullScreen)                        return getFunction("webkitCancelFullScreen");
		if(Doc.mozExitFullscreen)                             return getFunction("mozExitFullscreen");
		if(Doc.mozCancelFullScreen)                           return getFunction("mozCancelFullScreen");
		if(Doc.msExitFullscreen)                              return getFunction("msExitFullscreen");
		if(Doc.msCancelFullScreen)                            return getFunction("msCancelFullScreen");
		return function() { return false; };
	})(document),
	getElement: (function(Doc) {
		var getFunction = function(M) { return function(O) { if(!O) O = Doc; return O[M]; } };
		if(typeof Doc.fullscreenElement       != "undefined") return getFunction("fullscreenElement"); // Starndard
		if(typeof Doc.fullScreenElement       != "undefined") return getFunction("fullScreenElement");
		if(typeof Doc.webkitFullscreenElement != "undefined") return getFunction("webkitFullscreenElement");
		if(typeof Doc.webkitFullScreenElement != "undefined") return getFunction("webkitFullScreenElement");
		if(typeof Doc.mozFullscreenElement    != "undefined") return getFunction("mozFullscreenElement");
		if(typeof Doc.mozFullScreenElement    != "undefined") return getFunction("mozFullScreenElement");
		if(typeof Doc.msFullscreenElement     != "undefined") return getFunction("msFullscreenElement");
		if(typeof Doc.msFullScreenElement     != "undefined") return getFunction("msFullScreenElement");
		return function() { return null; };
	})(document)
};

sML.FullscreenEnabled    = sML.Fullscreen.Enbabled;
sML.requestFullscreen    = sML.Fullscreen.request;
sML.exitFullscreen       = sML.Fullscreen.exit;
sML.getFullscreenElement = sML.Fullscreen.getElement;




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- SML

//----------------------------------------------------------------------------------------------------------------------------------------------

sML.SML = {
	each:           function(F)        { sML.each(this, F); return this; },
	set:            function(P, S)     { return this.each(function() { var O = this; sML.set(O, P, S); }); },
	style:          function(S)        { return this.each(function() { var O = this; sML.style(O, S); }); },
	appendChild:    function(Es)       { return this.each(function() { var O = this; sML.each(Es, function() { O.appendChild(this); }); }); },
	preppendChild:  function(E)        { return this.each(function() { var O = this; sML.each(Es, function() { O.insertBefore(this, S.firstChild); }); }); },
	insertBefore:   function(E, S)     { return this.each(function() { var O = this; sML.each(Es, function() { O.insertBefore(this, S); }); }); },
	insertAfter:    function(E, S)     { return this.each(function() { var O = this; sML.each(Es, function() { O.insertBefore(this, S.nextSibling); }); }); },
	addClass:       function(CN)       { return this.each(function() { var O = this; sML.addClass(O, CN); }); },
	removeClass:    function(CN)       { return this.each(function() { var O = this; sML.removeClass(O, CN); }); },
	replaceClass:   function(RCN, ACN) { return this.each(function() { var O = this; sML.replaceClass(O, RCN, ACN); }); }
};




//==============================================================================================================================================
//----------------------------------------------------------------------------------------------------------------------------------------------

//-- Readied ?

//----------------------------------------------------------------------------------------------------------------------------------------------

window.addEventListener("unload", function() { window.sML = null; delete window.sML; });

return sML;

})();



