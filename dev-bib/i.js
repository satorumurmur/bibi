/*!
 *
 *  # Pipi: BiB/i Putter
 *
 *  - "Putting EPUBs in a Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://bibi.epub.link/
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

(function() {
    if(window["bibi:pipi"]) return;
    var Pipi = window["bibi:pipi"] = { "version": "0.999.0", "build": 20150929.1551,
        Status: "",
        Bibis: [],
        Anchors: [],
        Holders: [],
        Frames: [],
        TrustworthyOrigins: [location.origin],
        Loaded: 0
    };
    Pipi.Path = (function() {
        if(document.currentScript) return document.currentScript.src;
        var Scripts = document.getElementsByTagName("script");
        return Scripts[Scripts.length - 1].src;
    })();
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
            var RVM        = Anchor.getAttribute("data-bibi-reader-view-mode");
            var RVMFixed   = Anchor.getAttribute("data-bibi-reader-view-mode-fixed");
            var Autostart  = Anchor.getAttribute("data-bibi-autostart");
            var NewWindow  = Anchor.getAttribute("data-bibi-play-in-new-window");
            var HideArrows = Anchor.getAttribute("data-bibi-hide-arrows");
            var To         = Anchor.getAttribute("data-bibi-to");
            var Nav        = Anchor.getAttribute("data-bibi-nav");
            var BibiLabel  = Anchor.innerHTML;
            if(Anchor.origin != location.origin) Pipi.TrustworthyOrigins.push(Anchor.origin);
            Anchor.addEventListener("bibi:load", function(Eve) { console.log("BiB/i: Loaded. - #" + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
            Pipi.Anchors.push(Anchor);
            // Holder
            var Holder = Bibi.Holder = Pipi.create("span", {
                className: "bibi-holder",
                id: "bibi-holder-" + (i + 1),
                title: (Anchor.innerText ? Anchor.innerText + " " : "") + "(powered by BiB/i)"
            });
            if(Class) Holder.className += " " + Class;
            if(ID)    Holder.id = ID;
            if(Style) Holder.setAttribute("style", Style);
            Pipi.Holders.push(Holder);
            // Fragment
            var Fragment = new Pipi.Fragment();
            Fragment.add("parent-title", Pipi.encode(document.title));
            Fragment.add("parent-uri", Pipi.encode(location.href));
            Fragment.add("parent-origin", Pipi.encode(location.origin));
            Fragment.add("parent-pipi-path", Pipi.encode(Pipi.Path));
            Fragment.add("parent-bibi-label",  Pipi.encode(BibiLabel));
            Fragment.add("parent-holder-id", Holder.id);
            if(/^(horizontal|vertical|paged)$/.test(RVM)) Fragment.add("reader-view-mode", RVM);
            if(/^(true|false|yes|no|mobile|desktop)?$/.test(RVMFixed  )) Fragment.add("reader-view-mode-fixed", RVMFixed);
            if(/^(true|false|yes|no|mobile|desktop)?$/.test(Autostart )) Fragment.add("autostart", Autostart);
            if(/^(true|false|yes|no|mobile|desktop)?$/.test(NewWindow )) Fragment.add("play-in-new-window", NewWindow);
            if(/^(true|false|yes|no|mobile|desktop)?$/.test(HideArrows)) Fragment.add("hide-arrows", HideArrows);
            if(/^[1-9][\d\-\.]*$/.test(To)) Fragment.add("to", To);
            if(/^[1-9]\d*$/.test(Nav)) Fragment.add("nav", Nav);
            // Frame
            var Frame = Bibi.Frame = Holder.appendChild(
                Pipi.create("iframe", {
                    className: "bibi-frame",
                    frameborder: "0",
                    scrolling: "auto",
                    allowfullscreen: "true",
                    src: Src + (/#/.test(Src) ? "," : "#") + Fragment.make()
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
            // Add
            Pipi.Bibis.push(Bibi);
            Frame.Bibi = Holder.Bibi = Anchor.Bibi = Bibi;
        }
        // Put
        for(var i = 0, L = Pipi.Bibis.length; i < L; i++) {
            if(Pipi.Bibis[i].Embedded) continue;
            var Bibi = Pipi.Bibis[i];
            Bibi.move = function(Distance) {
                if(typeof Target != "number") return;
                this.Frame.contentWindow.postMessage('{"bibi:command:move":"' + Distance + '"}', this.Anchor.origin);
            };
            Bibi.focus = function(Target) {
                if(typeof Target != "string" && typeof Target != "number") return;
                this.Frame.contentWindow.postMessage('{"bibi:command:focus":"' + Target + '"}', this.Anchor.origin);
            };
            Bibi.changeView = function(BDM) {
                if(typeof Target != "string") return;
                this.Frame.contentWindow.postMessage('{"bibi:command:changeView":"' + BDM + '"}', this.Anchor.origin);
            };
            Bibi.togglePanel = function() {
                this.Frame.contentWindow.postMessage('{"bibi:command:togglePanel":""}', this.Anchor.origin);
            };
            Bibi.Anchor.style.display = "none";
            Bibi.Anchor.parentNode.insertBefore(Bibi.Holder, Bibi.Anchor);
            Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:ready", { detail: Bibi }));
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
    Pipi.Fragment = function() {
        this.Fragment = [];
        this.add = function(Key, Value) {
            this.Fragment.push([Key, Value].join(":"));
        };
        this.make = function() {
            return this.Fragment.length ? "pipi(" + this.Fragment.join(",") + ")" : "";
        };
        return this;
    };
    if(!window.CustomEvent || (typeof window.CustomEvent !== "function") && (window.CustomEvent.toString().indexOf('CustomEventConstructor') === -1)) {
        window.CustomEvent = function(EventName, Arguments) {
            Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
            var Eve = document.createEvent("CustomEvent");
            Eve.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
            return Eve;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }
    window.addEventListener("message", function(Eve) {
        if(!Eve || !Eve.data) return;
        for(var i = 0, L = Pipi.TrustworthyOrigins.length; i < L; i++) {
            if(Eve.origin != Pipi.TrustworthyOrigins[i]) continue;
            var Data = Eve.data;
            try {
                Data = JSON.parse(Data);
                if(typeof Data != "object" || !Data) return false;
                for(var EventName in Data) if(/^bibi:command:/.test(EventName)) document.dispatchEvent(new CustomEvent(EventName, { detail: Data[EventName] }));
                return true;
            } catch(Err) {}
            return false;
        }
    }, false);
    document.getElementsByTagName("head")[0].appendChild(Pipi.create("link", { rel: "stylesheet", id: "bibi-css", href: Pipi.Path.replace(/\.js$/, ".css") }));
    document.addEventListener("bibi:ready",       function(Eve) { console.log("BiB/i: Readied. - "   + Eve.detail.Bibis.length + " Bibi(s)."); }, false);
    document.addEventListener("bibi:load",        function(Eve) { console.log("BiB/i: Loaded. - "    + Eve.detail.Bibis.length + " Bibi(s)."); }, false);
    document.addEventListener("bibi:timeout",     function(Eve) { console.log("BiB/i: Timeouted.");                                            }, false);
    document.addEventListener("DOMContentLoaded", Pipi.embed,                                                                                     false);
})();