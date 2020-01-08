(() => {
    'use strict';
    if(window['bibi:jo']) return;
    if(!Array.prototype.includes) Array.prototype.includes = function(I) { for(let l = this.length, i = 0; i < l; i++) if(this[i] == I) return true; return false; };
    const Jo = window['bibi:jo'] = { 'version': '____Bibi-Version____',
        CSS: require('./jo.scss'),
        Status: '',
        Bibis: [],
        Anchors: [],
        Holders: [],
        Frames: [],
        TrustworthyOrigins: [location.origin],
        Loaded: 0
    };
    Jo.Path = (() => {
        if(document.currentScript) return document.currentScript.src;
        const Scripts = document.getElementsByTagName('script');
        return Scripts[Scripts.length - 1].src;
    })();
    Jo.embed = () => {
        Jo.Status = 'Started';
        const As = document.body.querySelectorAll('a[data-bibi]');
        for(let l = As.length, i = 0; i < l; i++) {
            if(!As[i].getAttribute('href') || As[i].Bibi) continue;
            // Bibi Object
            const Bibi = { Index: i, Number: i + 1 };
            // Anchor
            const Anchor = Bibi.Anchor = As[i];
            if(!/ bibi-anchor /.test(' ' + Anchor.className + ' ')) Anchor.className = 'bibi-anchor' + (Anchor.className ? ' ' + Anchor.className : '');
            if(Anchor.origin != location.origin) Jo.TrustworthyOrigins.push(Anchor.origin);
            Anchor.addEventListener('bibi:loaded', function(Eve) { console.log('Bibi: Loaded. - #' + Eve.detail.Number + ': ' + Eve.detail.Anchor.href); }, false);
            Jo.Anchors.push(Anchor);
            // Holder
            const BibiClass  = Anchor.getAttribute('data-bibi-class');
            const BibiID     = Anchor.getAttribute('data-bibi-id');
            const BibiStyle  = Anchor.getAttribute('data-bibi-style');
            const Holder = Bibi.Holder = Jo.create('span', {
                className: 'bibi-holder' + (BibiClass ? ' ' + BibiClass : ''),
                id: (BibiID ? BibiID : 'bibi-holder-' + (i + 1)),
                title: (Anchor.innerText ? Anchor.innerText + ' ' : '') + '(powered by Bibi)'
            });
            if(BibiStyle) Holder.setAttribute('style', BibiStyle);
            Jo.Holders.push(Holder);
            // Fragments
            const Fragments = new Jo.Fragments();
            Fragments.add('parent-title',      document.title);
            Fragments.add('parent-uri',        location.href);
            Fragments.add('parent-origin',     location.origin);
            Fragments.add('parent-jo-path',    Jo.Path);
            Fragments.add('parent-bibi-label', Anchor.innerHTML);
            Fragments.add('parent-holder-id',  Holder.id);
            [
                'to',
                'nav',
                'autostart', 'autostart-embedded',
                'fix-reader-view-mode',
                'preprocess-html-always',
                'reader-view-mode',
                'single-page-always',
                'start-in-new-window', 'start-embedded-in-new-window',
                'use-arrows',
                'use-font-size-changer',
                'use-full-height',
                'use-keys',
                'use-loupe',
                'use-menubar', //'place-menubar-at-top',
                'use-nombre'
            ].forEach(PresetKey => {
                const PresetValue = Anchor.getAttribute('data-bibi-' + PresetKey);
                if(!PresetValue) return;
                let RE;
                switch(PresetKey) {
                    case 'to':               RE =                      /^[1-9][\d\-\.]*$/; break;
                    case 'nav':              RE =                            /^[1-9]\d*$/; break;
                    case 'reader-view-mode': RE =         /^(horizontal|vertical|paged)$/; break;
                    default:                 RE = /^(true|false|yes|no|mobile|desktop)?$/; break;
                }
                if(/^(autostart|start-in-new-window)$/.test(PresetKey)) PresetKey = PresetKey.replace('start', 'start-embedded');
                if(RE.test(PresetValue)) Fragments.add(PresetKey, PresetValue);
            });
            // Frame
            const BibiSrc = Anchor.getAttribute('href');
            const Frame = Bibi.Frame = Holder.appendChild(
                Jo.create('iframe', {
                    className: 'bibi-frame',
                    frameborder: '0',
                    scrolling: 'auto',
                    allowfullscreen: 'true',
                    src: BibiSrc + (/#/.test(BibiSrc) ? ',' : '#') + Fragments.make()
                })
            );
            Frame.addEventListener('load', () => {
                Jo.Loaded++;
                Frame.Bibi.Anchor.dispatchEvent(new CustomEvent('bibi:loaded', { detail: Frame.Bibi }));
                if(Jo.Status != 'TimedOut' && Jo.Loaded == Jo.Bibis.length) {
                    Jo.Status = 'Loaded';
                    document.dispatchEvent(new CustomEvent('bibi:loaded', { detail: Jo }));
                }
            }, false);
            Jo.Frames.push(Frame);
            // Add
            Jo.Bibis.push(Bibi);
            Frame.Bibi = Holder.Bibi = Anchor.Bibi = Bibi;
        }
        // Put
        for(let l = Jo.Bibis.length, i = 0; i < l; i++) {
            if(Jo.Bibis[i].Embedded) continue;
            const Bibi = Jo.Bibis[i];
            Bibi.move = (Distance) => {
                if(typeof Target != 'number') return;
                Bibi.Frame.contentWindow.postMessage(`{'bibi:commands:move':'${ Distance }'}`, Bibi.Anchor.origin);
            };
            Bibi.focus = (Target) => {
                if(typeof Target != 'string' && typeof Target != 'number') return;
                Bibi.Frame.contentWindow.postMessage(`{'bibi:commands:focus':'${ Target }'}`, Bibi.Anchor.origin);
            };
            Bibi.changeView = (BDM) => {
                if(typeof Target != 'string') return;
                Bibi.Frame.contentWindow.postMessage(`{'bibi:commands:change-view':'${ BDM }'}`, Bibi.Anchor.origin);
            };
            Bibi.togglePanel = () => {
                Bibi.Frame.contentWindow.postMessage(`{'bibi:command:toggle-panel':''}`, Bibi.Anchor.origin);
            };
            Bibi.Anchor.style.display = 'none';
            Bibi.Anchor.parentNode.insertBefore(Bibi.Holder, Bibi.Anchor);
            Bibi.Anchor.dispatchEvent(new CustomEvent('bibi:readied', { detail: Bibi }));
        }
        setTimeout(() => {
            if(Jo.Status == 'Loaded') return;
            Jo.Status = 'TimedOut';
            document.dispatchEvent(new CustomEvent('bibi:timed-out', { detail: Jo }));
        }, 12000);
        Jo.Status = 'Readied';
        document.dispatchEvent(new CustomEvent('bibi:readied', { detail: Jo }));
        return Jo.Bibis;
    };
    Jo.encode = (Str) => encodeURIComponent(Str).replace('(', '_BibiKakkoOpen_').replace(')', '_BibiKakkoClose_');
    Jo.create = (TagName, Properties) => {
        const Ele = document.createElement(TagName);
        for(let Attribute in Properties) Ele[Attribute] = Properties[Attribute];
        return Ele;
    };
    Jo.Fragments = function() { // constructor
        this.FragmentKeys = [];
        this.FragmentKeysAndValues = {};
        this.add = function(Key, Value) {
            if(!this.FragmentKeys.includes(Key)) this.FragmentKeys.push(Key);
            this.FragmentKeysAndValues[Key] = Value;
        };
        this.make = function() {
            if(!this.FragmentKeys.length) return '';
            const Fragments = [];
            for(let l = this.FragmentKeys.length, i = 0; i < l; i++) Fragments.push(`${ this.FragmentKeys[i] }:${ Jo.encode(this.FragmentKeysAndValues[this.FragmentKeys[i]]) }`);
            return `jo(${ Fragments.join(',') })`;
        };
        return this;
    };
    if(!window.CustomEvent || (typeof window.CustomEvent !== 'function') && (window.CustomEvent.toString().indexOf('CustomEventConstructor') === -1)) {
        window.CustomEvent = function(EventName, Arguments) { // constructor
            Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
            const Eve = document.createEvent('CustomEvent');
            Eve.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
            return Eve;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }
    window.addEventListener('message', Eve => {
        if(!Eve || !Eve.data) return;
        for(let l = Jo.TrustworthyOrigins.length, i = 0; i < l; i++) {
            if(Eve.origin != Jo.TrustworthyOrigins[i]) continue;
            let Data = Eve.data;
            try {
                Data = JSON.parse(Data);
                if(typeof Data != 'object' || !Data) return false;
                for(let EventName in Data) if(/^bibi:commands:/.test(EventName)) document.dispatchEvent(new CustomEvent(EventName, { detail: Data[EventName] }));
                return true;
            } catch(Err) {}
            return false;
        }
    }, false);
    document.addEventListener('bibi:readied',     Eve => console.log(`Bibi: Readied. - ${ Eve.detail.Bibis.length } Bibi${ Eve.detail.Bibis.length > 1 ? 's' : '' }.`));
    document.addEventListener('bibi:loaded',      Eve => console.log(`Bibi: Loaded. - ${  Eve.detail.Bibis.length } Bibi${ Eve.detail.Bibis.length > 1 ? 's' : '' }.`));
    document.addEventListener('bibi:timed-out',   Eve => console.log(`Bibi: Timed Out.`                                                                              ));
    document.addEventListener('DOMContentLoaded', Jo.embed, false);
})();