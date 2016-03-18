/*!
 *
 * # BiB/i Extension: C+Mover
 *
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 */

Bibi.x({

    name: "C+Mover",
    description: "Utilities and UIs for Moving (Scrolling and Page-Flipping by Clicking, Tapping or Swiping)",
    author: "Satoru MATSUSHIMA (@satorumurmur)",
    version: Bibi["version"],
    build: Bibi["build"]

})(function() {

    C.Mover = {
        getArea: function(Eve) {
            if(!Eve) return {};
            var X, Y, XBorders = [], YBorders = [];
            if(Eve.srcElement.ownerDocument.documentElement == O.HTML) {
                X = Eve.pageX;
                Y = Eve.pageY;
            } else {
                var Item = Eve.srcElement.ownerDocument.documentElement.Item;
                ItemCoord = O.getElementCoord(Item);
                HTMLXY = { X: ItemCoord.X, Y: ItemCoord.Y };
                if(!Item.PrePaginated && !Item.Outsourcing) HTMLXY.X += S["item-padding-left"], HTMLXY.Y += S["item-padding-top"];
                X = HTMLXY.X + Eve.pageX - R.Main.scrollLeft;
                Y = HTMLXY.Y + Eve.pageY - R.Main.scrollTop;
            }
            var Border = O.TouchActive ? S["flipper-width-for-touch"] : S["flipper-width"];
            XBorders[0] = YBorders[0] = Border;
            if(Border < 1) X = X / window.innerWidth, Y = Y / window.innerHeight, XBorders[1] = YBorders[1] = 1 - Border; // Ratio
            else           XBorders[1] = window.innerWidth - XBorders[0], YBorders[1] = window.innerHeight - YBorders[0]; // Pixel
                 if(X < XBorders[0]) X = "left";
            else if(XBorders[1] < X) X = "right";
            else                     X = "center";
                 if(Y < YBorders[0]) Y = "top";
            else if(YBorders[1] < Y) Y = "bottom";
            else                     Y = "middle";
            return { X:X, Y:Y };
        },
        preventDefault: function(Eve) {
            Eve.preventDefault();
            return false;
        }
    };

    // Arrows
    C.Arrows = {
        createArrows: function() {
            if(C.Arrows.Back || C.Arrows.Forward) return;
            if(S["hide-arrows"]) sML.addClass(O.HTML, "hide-arrows");
            C.Arrows.Back = C.Arrows["back"] = R.Main.appendChild(
                sML.create("div", { className: "bibi-arrow", id: "bibi-arrow-back",
                    Distance: -1,
                    Labels: {
                        default: { ja: "戻る", en: "Back" }
                    },
                    isAvailable: function() {
                        return (R.Current.Pages.StartPage != R.Pages[0] || R.Current.Pages.StartPageRatio != 100);
                    }
                })
            );
            C.Arrows.Forward = C.Arrows["forward"] = R.Main.appendChild(
                sML.create("div", { className: "bibi-arrow", id: "bibi-arrow-forward",
                    Distance: +1,
                    Labels: {
                        default: { ja: "進む", en: "Forward" }
                    },
                    isAvailable: function() {
                        return (R.Current.Pages.EndPage != R.Pages[R.Pages.length - 1] || R.Current.Pages.EndPageRatio != 100);
                    }
                })
            );
            C.Arrows.Back.Pair = C.Arrows.Forward;
            C.Arrows.Forward.Pair = C.Arrows.Back;
            [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                C.setLabels(Arrow);
                C.setFeedback(Arrow);
                Arrow.showHelp = Arrow.hideHelp = function() {};
                if(!O.Mobile) {
                    Arrow.removeEventListener("mouseover", Arrow.hover);
                    Arrow.removeEventListener("mouseout",  Arrow.unhover);
                }
            });
            R.Items.concat(O).forEach(function(Item) {
            });
            var TouchStart, TouchEnd;
            if(!O.Mobile) {
                R.Items.concat(O).forEach(function(Item) {
                    Item.HTML.addEventListener("mousemove", C.Arrows.hover);
                    Item.HTML.addEventListener("mouseover", C.Arrows.hover);
                    Item.HTML.addEventListener("mouseout",  C.Arrows.hover);
                    sML.each(Item.Body.querySelectorAll("img"), function(){ this.addEventListener("mousedown", C.Mover.preventDefault); });
                });
            }
            R.Items.concat(O).forEach(function(Item) {
                C.observeTap(Item.HTML).addTapEventListener(function(Eve) { C.Arrows.go(Eve); });
            });
        },
        update: function() {
            if(S.RVM == "vertical") {
                C.Arrows["top"] = C.Arrows.Back, C.Arrows["bottom"] = C.Arrows.Forward;
                C.Arrows["left"] = C.Arrows["right"] = undefined;
            } else {
                if(S.PPD == "ltr") C.Arrows["left"] = C.Arrows.Back, C.Arrows["right"] = C.Arrows.Forward;
                else               C.Arrows["right"] = C.Arrows.Back, C.Arrows["left"] = C.Arrows.Forward;
                C.Arrows["top"] = C.Arrows["bottom"] = undefined;
            }
        },
        navigate: function() {
            setTimeout(function() {
                R.getCurrent();
                [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                    if(Arrow.isAvailable()) sML.addClass(Arrow, "glowing");
                });
                setTimeout(function() {
                    [C.Arrows.Back, C.Arrows.Forward].forEach(function(Arrow) {
                        sML.removeClass(Arrow, "glowing");
                    });
                }, 1234);
            }, 420);
        },
        tap: function(Dis) {
            var Dir = ""
            switch(Dis) {
                case -1 : Dir = "back"; break;
                case  1 : Dir = "forward"; break;
            }
            if(Dir && C.Arrows[Dir]) {
                return C.Arrows[Dir].tap();
            }
        },
        isAvailable: function(Eve) {
            if(C.Panel.State == "active") return false;
            if(Eve.srcElement.ownerDocument.documentElement == O.HTML) {
                if(Eve.srcElement == R.Main.Book || /^(spread|item|bibi-arrow)/.test(Eve.srcElement.className)) return true;
            } else {
                if(!/^a$/i.test(Eve.srcElement.tagName)) return true;
            }
            return false;
        },
        go: function(Eve, TEve) {
            if(!C.Arrows.isAvailable(Eve)) return false;
            var Area = C.Mover.getArea(Eve);
            var Dir = (S.RVM == "vertical") ? Area.Y : Area.X;
            if(C.Arrows[Dir] && C.Arrows[Dir].isAvailable()) {
                E.dispatch("bibi:command:move", C.Arrows[Dir].Distance);
            }
        },
        hover: function(Eve) {
            if(O.Mobile) return;
            if(!C.Arrows.isAvailable(Eve)) return C.Arrows.unhover();
            var Area = C.Mover.getArea(Eve);
            var Dir = (S.RVM == "vertical") ? Area.Y : Area.X;
            if(C.Arrows[Dir] && C.Arrows[Dir].isAvailable()) {
                C.Arrows[Dir].hover();
                C.Arrows[Dir].Pair.unhover();
                Eve.srcElement.ownerDocument.documentElement.setAttribute("data-bibi-cursor", Dir);
            } else {
                C.Arrows.unhover();
            }
        },
        unhover: function() {
            C.Arrows.Back.unhover();
            C.Arrows.Forward.unhover();
            R.Items.concat(O).forEach(function(Item) {
                Item.HTML.removeAttribute("data-bibi-cursor");
            });
        }
    };
    E.add("bibi:open",          function()    { C.Arrows.createArrows(); C.Arrows.update(); C.Arrows.navigate(); });
    E.add("bibi:updateSetting", function()    { C.Arrows.update(); });
    E.add("bibi:relayout",      function()    { C.Arrows.navigate(); });
    E.add("bibi:command:move",  function(Dis) { C.Arrows.tap(Dis); });

    // Touch
    C.Touch = {
        State: 0,
        UserChanged: false,
        createButton: function() {
            if(C.Touch.Button) return;
            C.Touch.Button = C.addButton({ className: "bibi-button-toggle-touch",
                Type: "toggle",
                Area: C.SwitchBeta,
                Labels: {
                    "default": { ja: "タップ／スワイプ操作を切り替え（現在はオフ）", en: "Toggle Tap/Swipe Availability (Current: OFF)"  },
                    "active":  { ja: "タップ／スワイプ操作を切り替え（現在はオン）", en: "Toggle Tap/Swipe Availability (Current: ON)" }
                },
                execute: function() {
                    C.Touch.toggle();
                    C.Touch.UserChanged = true;
                }
            });
            E.add("bibi:activateTouch",   function() { C.setState(C.Touch.Button, "active"); });
            E.add("bibi:deactivateTouch", function() { C.setState(C.Touch.Button, ""); });
        },
        update: function() {
            if(!L.Loaded || this.UserChanged) return;
            S.RVM == "paged" ? this.activate() : this.deactivate();
            E.dispatch("bibi:updateTouch", this.State);
            return this.State;
        },
        activate: function(Cb) {
            if(this.State == 1) {
                if(typeof Cb == "function") Cb();
                return 1;
            }
            O.TouchActive = true;
            this.State = 1;
            this.activateElement(R.Main);
            for(var i = 0, L = R.Items.length; i < L; i++) this.activateElement(R.Items[i].HTML);
            E.dispatch("bibi:activateTouch");
            if(typeof Cb == "function") setTimeout(Cb, 0);
            O.log('Touch Activated.', "-*");
            return this.State;
        },
        activateElement: function(Ele) {
            sML.addClass(Ele, "touch-active");
            sML.observeTouch(Ele).addTouchEventListener("swipe", C.Touch.swipe);
            if(!O.Mobile) sML.each(Ele.querySelectorAll("img"), function(){ this.addEventListener("mousedown", C.Mover.preventDefault); });
        },
        deactivate: function(Cb) {
            if(this.State == 0) {
                if(typeof Cb == "function") Cb();
                return 0;
            }
            O.TouchActive = false;
            this.State = 0;
            this.deactivateElement(R.Main);
            for(var i = 0, L = R.Items.length; i < L; i++) this.deactivateElement(R.Items[i].HTML);
            E.dispatch("bibi:deactivateTouch");
            if(typeof Cb == "function") setTimeout(Cb, 0);
            O.log('Touch Deactivated.', "-*");
            return this.State;
        },
        deactivateElement: function(Ele) {
            sML.removeClass(Ele, "touch-active");
            sML.unobserveTouch(Ele);
            if(!O.Mobile) sML.each(Ele.querySelectorAll("img"), function(){ this.removeEventListener("mousedown", C.Mover.preventDefault); });
        },
        toggle: function(Cb) {
            this.State ? this.deactivate() : this.activate();
            E.dispatch("bibi:toggleTouch", this.State);
            if(typeof Cb == "function") setTimeout(Cb, 0);
            return this.State;
        },
        swipe: function(Eve, TEve) {
            var Angle = TEve.angle + 90, Dir = { From: "", To: "" };
            if(Angle < 0) Angle += 360;
                 if(330 <= Angle || Angle <=  30) Dir.From = "bottom", Dir.To = "top";
            else if( 60 <= Angle && Angle <= 120) Dir.From = "left",   Dir.To = "right";
            else if(150 <= Angle && Angle <= 210) Dir.From = "top",    Dir.To = "bottom";
            else if(240 <= Angle && Angle <= 300) Dir.From = "right",  Dir.To = "left";
            /*
            if(S.RVM != "vertical" && (Dir.To == "bottom" || Dir.To == "top")) {
                     if(Dir.To == "bottom") E.dispatch("bibi:command:openPanel");
                else if(Dir.To == "top")    E.dispatch("bibi:command:closePanel");
            }
            */
            if(C.Arrows[Dir.From] && C.Arrows[Dir.From].isAvailable()) E.dispatch("bibi:command:move", C.Arrows[Dir.From].Distance);
        }
    };
    E.add("bibi:loadItem", function(Item) {
        sML.appendStyleRule('html[data-bibi-cursor="left"]',   "cursor: w-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="right"]',  "cursor: e-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="top"]',    "cursor: n-resize;", Item.contentDocument);
        sML.appendStyleRule('html[data-bibi-cursor="bottom"]', "cursor: s-resize;", Item.contentDocument);
    });
    E.add("bibi:loadBook",                function() { C.Touch.createButton(); });
    E.add("bibi:layout",                  function() { C.Touch.update(); });
    E.add("bibi:command:activateTouch",   function() { C.Touch.activate(); });
    E.add("bibi:command:deactivateTouch", function() { C.Touch.deactivate(); });
    E.add("bibi:command:toggleTouch",     function() { C.Touch.toggle(); }); 

    // Keys
    C.Keys = {
        observe: function(Eve) {
            if(!L.Opened) return;
            Eve.preventDefault();
            var Dir = undefined;
            switch(Eve.keyCode) {
                case 37: Dir = "left"; break;
                case 38: Dir = "top"; break;
                case 39: Dir = "right"; break;
                case 40: Dir = "bottom"; break;
            }
            if(C.Arrows[Dir]) E.dispatch("bibi:command:move", C.Arrows[Dir].Distance);
        },
        listen: function() {
            R.Items.forEach(function(Item) {
                Item.contentWindow.addEventListener("keydown", C.Keys.observe, false);
            });
            window.addEventListener("keydown", C.Keys.observe, false);
        }
    };
    E.add("bibi:open", function() { C.Keys.listen(); });

});