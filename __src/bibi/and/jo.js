(() => { 'use strict';




const World = typeof window     !== 'undefined' ? window     :
              typeof self       !== 'undefined' ? self       :
              typeof globalThis !== 'undefined' ? globalThis :
              typeof global     !== 'undefined' ? global     : undefined;

if(!World || World['bibi:jo']) return;




const Jo = World['bibi:jo'] = { 'version': '____Bibi-Version____', Bibis: [] }, BibiEventRE = /^bibi:[a-z][a-z0-9:_\-]*$/;




Jo.Bibi = function() { return Jo.callBibi.apply(Jo, arguments); }; // Constructor

Jo.callBibi = (Love) => {
    let Anchor = null, Frame = null, Receiver = null, ToReceive = [];
    try {
        if(!(Love instanceof HTMLElement)) {
            if(Love && typeof Love == 'object') {
                if(!Love['bibi-href']) return null;
                Anchor = Jo.create('a', { href: Love['bibi-href'] });
                Frame = Jo.create('iframe');
                Receiver = Frame;
            }
            if(Love['bibi-receive'] instanceof Array) ToReceive = Love['bibi-receive'];
        } else {
            if(/^iframe$/i.test(Love.tagName)) {
                const BibiHref = Love.getAttribute('data-bibi-href');
                if(!BibiHref) return null;
                Anchor = Love.parentNode.insertBefore(Jo.create('a', { href: BibiHref }), Love);
                Frame = Love.parentNode.removeChild(Love);
            } else if(/^a$/i.test(Love.tagName)) {
                if(!Love.href) return null;
                Anchor = Love;
                Frame = Jo.create('iframe');
                (BibiClass => BibiClass ? BibiClass.trim().replace(/\s+/, ' ').split(' ').forEach(CN => CN ? Frame.classList.add(CN) : false) : false)(Anchor.getAttribute('data-bibi-class'));
                (BibiID    => BibiID    ? Frame.setAttribute('id',    BibiID   )                                                              : false)(Anchor.getAttribute('data-bibi-id'   ));
                (BibiStyle => BibiStyle ? Frame.setAttribute('style', BibiStyle)                                                              : false)(Anchor.getAttribute('data-bibi-style'));
            }
            Receiver = Love;
            let BibiReceive = Receiver.getAttribute('data-bibi-receive');
            if(BibiReceive && (BibiReceive = BibiReceive.replace(/\s+/, ''))) ToReceive = BibiReceive.split(',');
        }
    } catch(Err) { return null; } if(!Anchor || !Frame || !Receiver) return null;
    const Bibi = Anchor.Bibi = Frame.Bibi = { Jo: Jo, Anchor: Anchor, Frame: Frame, Receiver: Receiver, Index: Jo.Bibis.length, Status: '' };
    Bibi.listen   = (EN, fun)        => !BibiEventRE.test(EN) ? false : Receiver.addEventListener(EN, Eve => fun.call(Receiver, Eve.detail), false);
    Bibi.dispatch = (EN, Det = Bibi) => !BibiEventRE.test(EN) ? false : Receiver.dispatchEvent(new CustomEvent(EN, { detail: Det }));
    Bibi.receive  = (EN)             => !BibiEventRE.test(EN) ? false : Frame.contentWindow.E.add(EN, Det => Bibi.dispatch(EN, Det));
    Bibi.post     = (EN, V)          => !BibiEventRE.test(EN) ? false : Frame.contentWindow.postMessage(`{ "${ EN }" : "${ V }" }`, Anchor.origin);
    Bibi.listen('bibi:initialized', (Status) => Bibi.Status = Bibi.Initialized = Status); if(ToReceive.length) Bibi.listen('bibi:initialized', () => ToReceive.forEach(EN => Bibi.receive('' + EN.trim())));
    Bibi.listen('bibi:readied',     (Status) => Bibi.Status = Bibi.Readied     = Status);
    Bibi.listen('bibi:prepared',    (Status) => Bibi.Status = Bibi.Prepared    = Status);
    Bibi.listen('bibi:loaded',      (Status) => Bibi.Status = Bibi.Loaded      = Status);
    Bibi.listen('bibi:binded',      (Status) => Bibi.Status = Bibi.Binded      = Status);
    Bibi.listen('bibi:opened',      (Status) => Bibi.Status = Bibi.Opened      = Status);
    Bibi.listen('bibi:opened',      () => {
        Bibi.move = (Distance)  => Bibi.post('bibi:commands:move', Distance);
        Bibi.focus = (Target)   => Bibi.post('bibi:commands:focus', Target);
        Bibi.changeView = (RVM) => Bibi.post('bibi:commands:change-view', RVM);
        Bibi.togglePanel = ()   => Bibi.post('bibi:commands:toggle-panel', '');
    });
    Anchor.style.display = 'none';
    if(Jo.TrustworthyOrigins && !Jo.TrustworthyOrigins.includes(Anchor.origin)) Jo.TrustworthyOrigins.push(Anchor.origin); // It is NOT reflected to S['trustworthy-origins'].
    Anchor.href += (/#/.test(Anchor.href) ? '&' : '#') + (() => {
        const Fragments = new Jo.Fragments();
        Fragments.add('parent-bibi-index', Bibi.Index);
        [
            'autostart-embedded', 'autostart',
            'dress',
            'fix-reader-view-mode', 'fix-view-mode', 'fix-view', 'fix-rvm',
            'forget-me',
            'full-breadth-layout-in-scroll',
            'iipp',
            'nav',
            'p',
            'preset',
            'reader-view-mode', 'view-mode', 'view', 'rvm',
            'start-embedded-in-new-window', 'start-in-new-window',
            'uiless'
        ].forEach(K => { let V;
            if(Love.ownerDocument) V = Love.getAttribute('data-bibi-' + K);
            else switch(typeof (V = Love['bibi-' + K])) { case 'number': if(V != V) return; case 'boolean': V = String(V); }
            switch(typeof V) { case 'string': if(V = V.trim()) break; default: return; }
            /**/     switch(K) { case 'autostart':                                      K = 'autostart-embedded'; break;
                                 case     'view-mode': case     'view': case     'rvm': K = 'reader-view-mode'; break;
                                 case 'fix-view-mode': case 'fix-view': case 'fix-rvm': K = 'fix-reader-view-mode'; break;
                                 case 'start-in-new-window':                            K = 'start-embedded-in-new-window'; break;}
            (() => { switch(K) { case 'preset': case 'dress': return              /^[_\-\w\d]+(\.[_\-\w\d]+)*$/;
                                 case 'iipp': case 'p':       return                            /^(\d*\.)?\d+$/;
                                 case 'nav':                  return                            /^[1-9][0-9]*$/;
                                 case 'reader-view-mode':     return       /^(auto|paged|horizontal|vertical)$/;
                                 default:                     return /^(true|false|1|0|yes|no|mobile|desktop)$/; } })().test(V) && Fragments.add(K, V);
        });
        return Fragments.make();
    })();
    Frame.classList.add('bibi-frame');
    Frame.setAttribute('frameborder', '0');
    Frame.setAttribute('scrolling', 'auto');
    Frame.setAttribute('allowfullscreen', 'true');
    Frame.src = Anchor.href;
    Jo.Bibis.push(Bibi);
    return Bibi;
};

Jo.create = (TagName, Properties) => {
    const Ele = document.createElement(TagName);
    for(let Attribute in Properties) Ele[Attribute] = Properties[Attribute];
    return Ele;
};

Jo.encode = (Str) => encodeURIComponent(Str).replace('(', '_BibiKakkoOpen_').replace(')', '_BibiKakkoClose_');

Jo.Fragments = function() { // constructor
    this.Cupboard = {};
    this.add = function(Key, Value) { this.Cupboard[Key] = Value; };
    this.make = function() {
        const Keys = Object.keys(this.Cupboard);
        if(!Keys.length) return '';
        return `jo(` + Keys.reduce((Arr, Key) => Arr.push(Key + `=` + Jo.encode(this.Cupboard[Key])) && Arr, []).join('&') + `)`;
    };
    return this;
};




if(typeof window !== 'undefined') {

    Jo.StyleModule = require('./jo.scss');

    Jo.TrustworthyOrigins = [location.origin];

    Jo.listen   = (EN, fun)      => !BibiEventRE.test(EN) ? false : document.addEventListener(EN, Eve => fun.call(document, Eve.detail));
    Jo.dispatch = (EN, Det = Jo) => !BibiEventRE.test(EN) ? false : document.dispatchEvent(new CustomEvent(EN, { detail: Det }));
    Jo.judge    = (Msg, Origin)  => (Msg && typeof Msg == 'string' && Origin && typeof Origin == 'string' && Jo.TrustworthyOrigins.includes(Origin));

    Jo.embed = () => {
        const BibisToBeLoaded = [], BibisLoaded = [];
        Array.prototype.forEach.call(document.body.querySelectorAll('*[data-bibi]'), Bed => {
            if(Bed.getAttribute('data-bibi-processed')) return;
            Bed.setAttribute('data-bibi-processed', 'true');
            const Bibi = new Jo.Bibi(Bed);
            if(Bibi) BibisToBeLoaded.push(Bibi);
        });
        if(!BibisToBeLoaded.length) return;
        // Jo.listen('bibi:jo:embedded', Bibis => console.log(`[Bibi:Jo] Embedded. - ${ Bibis.length } of ${ Jo.Bibis.length }`));
        BibisToBeLoaded.forEach(Bibi => {
            const Anchor = Bibi.Anchor, Frame = Bibi.Frame;
            Bibi.listen('bibi:initialized', () => (BibisLoaded.push(Bibi) < BibisToBeLoaded.length) ? false : Jo.dispatch('bibi:jo:embedded', BibisLoaded));
            Anchor.parentNode.insertBefore(Frame, Anchor);
        });
    };

    Jo.message = (Eve) => {
        if(!Eve || !Jo.judge(Eve.data, Eve.origin)) return false;
        try {
            Data = JSON.parse(Data);
            if(typeof Data != 'object' || !Data) return false;
            for(let EN in Data) Jo.dispatch(EN, Data[EN]);
            return true;
        } catch(Err) {} return false;
    };

    document.addEventListener('DOMContentLoaded', Jo.embed);
    window.addEventListener('load', Jo.embed);
    window.addEventListener('message', Jo.message);

    // Polyfill: Array.prototype.includes
    if(!Array.prototype.includes) Array.prototype.includes = function(I) { for(let l = this.length, i = 0; i < l; i++) if(this[i] == I) return true; return false; };

    // Polyfill: CustomEvent Constructor
    if(!window.CustomEvent || typeof window.CustomEvent !== 'function' && window.CustomEvent.toString().indexOf('CustomEventConstructor') === -1) {
        window.CustomEvent = function(EventName, Arguments) {
            Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
            const Eve = document.createEvent('CustomEvent');
            Eve.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
            return Eve;
        };
        window.CustomEvent.prototype = window.Event.prototype;
    }

}




})();
