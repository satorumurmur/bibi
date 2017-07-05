/*!
 *                                                                                                                                (℠)
 *  # Pipi: BiB/i Putter
 *
 *  - "Putting EPUBs in a Web Page with BiB/i."
 *  - (c) Satoru MATSUSHIMA - http://bibi.epub.link or https://github.com/satorumurmur/bibi
 *  - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

(function() {
    if(window["bibi:pipi"]) return;
    var Pipi = window["bibi:pipi"] = { "version": "0.000.0", "build": 198106091234,
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
            if(Anchor.origin != location.origin) Pipi.TrustworthyOrigins.push(Anchor.origin);
            Anchor.addEventListener("bibi:loaded", function(Eve) { console.log("BiB/i: Loaded. - #" + Eve.detail.Number + ": " + Eve.detail.Anchor.href); }, false);
            Pipi.Anchors.push(Anchor);
            // Holder
            var BibiClass  = Anchor.getAttribute("data-bibi-class");
            var BibiID     = Anchor.getAttribute("data-bibi-id");
            var BibiStyle  = Anchor.getAttribute("data-bibi-style");
            var Holder = Bibi.Holder = Pipi.create("span", {
                className: "bibi-holder" + (BibiClass ? " " + BibiClass : ""),
                id: (BibiID ? BibiID : "bibi-holder-" + (i + 1)),
                title: (Anchor.innerText ? Anchor.innerText + " " : "") + "(powered by BiB/i)"
            });
            if(BibiStyle) Holder.setAttribute("style", BibiStyle);
            Pipi.Holders.push(Holder);
            // Fragments
            var Fragments = new Pipi.Fragments();
            Fragments.add("parent-title",      document.title);
            Fragments.add("parent-uri",        location.href);
            Fragments.add("parent-origin",     location.origin);
            Fragments.add("parent-pipi-path",  Pipi.Path);
            Fragments.add("parent-bibi-label", Anchor.innerHTML);
            Fragments.add("parent-holder-id",  Holder.id);
            [
                "to",
                "nav",
                "reader-view-mode",
                "fix-reader-view-mode",
                "autostart",
                "start-in-new-window",
                "use-nombre",
                "use-slider",
                "use-arrows",
                "use-keys",
                "use-swipe",
                "use-cookie"
            ].forEach(function(PresetKey) {
                var PresetValue = Anchor.getAttribute("data-bibi-" + PresetKey);
                if(!PresetValue) return;
                var RE;
                switch(PresetKey) {
                    case "to":               RE =                      /^[1-9][\d\-\.]*$/; break;
                    case "nav":              RE =                            /^[1-9]\d*$/; break;
                    case "reader-view-mode": RE =         /^(horizontal|vertical|paged)$/; break;
                    default:                 RE = /^(true|false|yes|no|mobile|desktop)?$/; break;
                }
                if(RE.test(PresetValue)) Fragments.add(PresetKey, PresetValue);
            });
            // Frame
            var BibiSrc = Anchor.getAttribute("href");
            var Frame = Bibi.Frame = Holder.appendChild(
                Pipi.create("iframe", {
                    className: "bibi-frame",
                    frameborder: "0",
                    scrolling: "auto",
                    allowfullscreen: "true",
                    src: BibiSrc + (/#/.test(BibiSrc) ? "," : "#") + Fragments.make()
                })
            );
            Frame.addEventListener("load", function() {
                Pipi.Loaded++;
                this.Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:loaded", { detail: this.Bibi }));
                if(Pipi.Status != "Timeouted" && Pipi.Loaded == Pipi.Bibis.length) {
                    Pipi.Status = "Loaded";
                    document.dispatchEvent(new CustomEvent("bibi:loaded", { detail: Pipi }));
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
                this.Frame.contentWindow.postMessage('{"bibi:commands:move":"' + Distance + '"}', this.Anchor.origin);
            };
            Bibi.focus = function(Target) {
                if(typeof Target != "string" && typeof Target != "number") return;
                this.Frame.contentWindow.postMessage('{"bibi:commands:focus":"' + Target + '"}', this.Anchor.origin);
            };
            Bibi.changeView = function(BDM) {
                if(typeof Target != "string") return;
                this.Frame.contentWindow.postMessage('{"bibi:commands:change-view":"' + BDM + '"}', this.Anchor.origin);
            };
            Bibi.togglePanel = function() {
                this.Frame.contentWindow.postMessage('{"bibi:command:toggle-panel":""}', this.Anchor.origin);
            };
            Bibi.Anchor.style.display = "none";
            Bibi.Anchor.parentNode.insertBefore(Bibi.Holder, Bibi.Anchor);
            Bibi.Anchor.dispatchEvent(new CustomEvent("bibi:readied", { detail: Bibi }));
        }
        setTimeout(function() {
            if(Pipi.Status == "Loaded") return;
            Pipi.Status = "Timeouted";
            document.dispatchEvent(new CustomEvent("bibi:timed-out", { detail: Pipi }));
        }, 12000);
        Pipi.Status = "Readied";
        document.dispatchEvent(new CustomEvent("bibi:readied", { detail: Pipi }));
        return Pipi.Bibis;
    };
    Pipi.encode = function(Str) { return encodeURIComponent(Str).replace("(", "_BibiKakkoOpen_").replace(")", "_BibiKakkoClose_"); };
    Pipi.create = function(TagName, Properties) {
        var Ele = document.createElement(TagName);
        for(var Attribute in Properties) Ele[Attribute] = Properties[Attribute];
        return Ele;
    };
    Pipi.Fragments = function() {
        this.Fragments = [];
        this.add = function(Key, Value) {
            this.Fragments.push(Key + ":" + Pipi.encode(Value));
        };
        this.make = function() {
            return this.Fragments.length ? "pipi(" + this.Fragments.join(",") + ")" : "";
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
                for(var EventName in Data) if(/^bibi:commands:/.test(EventName)) document.dispatchEvent(new CustomEvent(EventName, { detail: Data[EventName] }));
                return true;
            } catch(Err) {}
            return false;
        }
    }, false);
    document.getElementsByTagName("head")[0].appendChild(Pipi.create("link", { rel: "stylesheet", id: "bibi-css", href: Pipi.Path.replace(/\.js$/, ".css") }));
    document.addEventListener("bibi:readied",     function(Eve) { console.log("BiB/i: Readied. - "   + Eve.detail.Bibis.length + " Bibi" + (Eve.detail.Bibis.length > 1 ? "s" : "") + "."); }, false);
    document.addEventListener("bibi:loaded",      function(Eve) { console.log("BiB/i: Loaded. - "    + Eve.detail.Bibis.length + " Bibi" + (Eve.detail.Bibis.length > 1 ? "s" : "") + "."); }, false);
    document.addEventListener("bibi:timed-out",   function(Eve) { console.log("BiB/i: Timed Out.");                                                                                         }, false);
    document.addEventListener("DOMContentLoaded", Pipi.embed, false);
})();