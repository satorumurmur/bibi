(() => { 'use strict'; if(window['bibi:jo']) return;




const Jo = window['bibi:jo'] = { 'version': '____Bibi-Version____',
    CSS: require('./jo.scss'),
    Status: '',
    Bibis: [],
    TrustworthyOrigins: [location.origin],
    Loaded: 0,
};

const BibiEventRE = /^bibi:[a-z][a-z:_\-]*$/;




Jo.Bibi = function() { return Jo.callBibi.apply(Jo, arguments); };

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
    Bibi.listen('bibi:opened',      (Status) => Bibi.Status = Bibi.Opened      = Status);
    Bibi.listen('bibi:opened',      () => {
        Bibi.move = (Distance)  => Bibi.post('bibi:commands:move', Distance);
        Bibi.focus = (Target)   => Bibi.post('bibi:commands:focus', Target);
        Bibi.changeView = (RVM) => Bibi.post('bibi:commands:change-view', RVM);
        Bibi.togglePanel = ()   => Bibi.post('bibi:commands:toggle-panel', '');
    });
    Anchor.style.display = 'none';
    if(!Jo.TrustworthyOrigins.includes(Anchor.origin)) Jo.TrustworthyOrigins.push(Anchor.origin); // It is NOT reflected to S['trustworthy-origins'].
    Anchor.href += (/#/.test(Anchor.href) ? '&' : '#') + (() => {
        const Fragments = new Jo.Fragments();
        Fragments.add('parent-bibi-index',  Bibi.Index);
        [
            'autostart-embedded', 'autostart',
            'p',
            'fix-reader-view-mode', 'fix-view', 'view-unchangeable',
            'full-breadth-layout-in-scroll',
            'iipp',
            'nav',
            'reader-view-mode', 'rvm', 'view',
            'start-embedded-in-new-window', 'start-in-new-window'
        ].forEach(K => { let V = '' + (Love.ownerDocument ? Love.getAttribute('data-bibi-' + K) || '' : Love['bibi-' + K]);
            if(V && (() => { switch(K) {
                case 'p':                return                            /^(\d*\.)?\d+$/;
                case 'iipp':             return                            /^(\d*\.)?\d+$/;
                case 'nav':              return                            /^[1-9][0-9]*$/;
                case 'rvm': case 'view': K = 'reader-view-mode';
                case 'reader-view-mode': return            /^(paged|horizontal|vertical)$/;
                case 'autostart': case 'start-in-new-window': K = K.replace('start', 'start-embedded'); break;
                case 'view-unchangeable': K = 'fix-reader-view-mode'; break;
            }                            return /^(true|false|1|0|yes|no|mobile|desktop)$/; })().test(V)) Fragments.add(K, V);
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




Jo.embed = () => {
    const BibisToBeLoaded = [], BibisLoaded = [];
    Array.prototype.forEach.call(document.body.querySelectorAll('*[data-bibi]'), Bed => {
        if(Bed.getAttribute('data-bibi-processed')) return;
        Bed.setAttribute('data-bibi-processed', 'true');
        const Bibi = new Jo.Bibi(Bed);
        if(Bibi) BibisToBeLoaded.push(Bibi);
    });
    if(!BibisToBeLoaded.length) return;
    //Jo.listen('bibi:jo:embedded', Bibis => console.log(`[Bibi:Jo] Embedded. - ${ Bibis.length } of ${ Jo.Bibis.length }`));
    BibisToBeLoaded.forEach(Bibi => {
        const Anchor = Bibi.Anchor, Frame = Bibi.Frame;
        Bibi.listen('bibi:initialized', () => (BibisLoaded.push(Bibi) < BibisToBeLoaded.length) ? false : Jo.dispatch('bibi:jo:embedded', BibisLoaded));
        Anchor.parentNode.insertBefore(Frame, Anchor);
    });
};




document.addEventListener('DOMContentLoaded', Jo.embed), window.addEventListener('load', Jo.embed);




window.addEventListener('message', Eve => {
    if(!Eve || !Jo.judge(Eve.data, Eve.origin)) return false; try {
    Data = JSON.parse(Data);
    if(typeof Data != 'object' || !Data) return false;
    for(let EN in Data) Jo.dispatch(EN, Data[EN]);
    return true; } catch(Err) {} return false;
}, false);




// Utility

Jo.create = (TagName, Properties) => {
    const Ele = document.createElement(TagName);
    for(let Attribute in Properties) Ele[Attribute] = Properties[Attribute];
    return Ele;
};

Jo.encode = (Str) => encodeURIComponent(Str).replace('(', '_BibiKakkoOpen_').replace(')', '_BibiKakkoClose_');

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
        for(let l = this.FragmentKeys.length, i = 0; i < l; i++) Fragments.push(`${ this.FragmentKeys[i] }=${ Jo.encode(this.FragmentKeysAndValues[this.FragmentKeys[i]]) }`);
        return `jo(${ Fragments.join('&') })`;
    };
    return this;
};

Jo.judge = (Msg, Origin) => (Msg && typeof Msg == 'string' && Origin && typeof Origin == 'string' && Jo.TrustworthyOrigins.includes(Origin));

Jo.listen   = (EN, fun)      => !BibiEventRE.test(EN) ? false : document.addEventListener(EN, Eve => fun.call(document, Eve.detail));
Jo.dispatch = (EN, Det = Jo) => !BibiEventRE.test(EN) ? false : document.dispatchEvent(new CustomEvent(EN, { detail: Det }));




// Polyfill

if(!Array.prototype.includes) Array.prototype.includes = function(I) { for(let l = this.length, i = 0; i < l; i++) if(this[i] == I) return true; return false; };

if(!window.CustomEvent || (typeof window.CustomEvent !== 'function') && (window.CustomEvent.toString().indexOf('CustomEventConstructor') === -1)) {
    window.CustomEvent = function(EventName, Arguments) { // constructor
        Arguments = Arguments || { bubbles: false, cancelable: false, detail: undefined };
        const Eve = document.createEvent('CustomEvent');
        Eve.initCustomEvent(EventName, Arguments.bubbles, Arguments.cancelable, Arguments.detail);
        return Eve;
    };
    window.CustomEvent.prototype = window.Event.prototype;
}




})();