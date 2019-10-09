Bibi.x({

    id: 'EPUBCFI',
    description: 'Utilities for EPUBCFI', // An Example Is at the Bottom of This Document.
    author: 'Satoru MATSUSHIMA (@satorumurmur)',
    version: '0.2.1'

})(function() {

    'use strict';

    this.CFIString = '';
    this.Current = 0;
    this.Log = false;
    this.LogCorrection = false;
    this.LogCancelation = false;

    this.parse = (CFIString, Scope) => {
        if(!CFIString || typeof CFIString != 'string') return null;
        try { CFIString = decodeURIComponent(CFIString); } catch(Err) { this.log(0, `Unregulated URIEncoding.`); return null; }
        if(!Scope || typeof Scope != 'string' || typeof this['parse' + Scope] != 'function') Scope = 'Fragment';
        if(Scope == 'Fragment') CFIString = CFIString.replace(/^(epubcfi\()?/, 'epubcfi(').replace(/(\))?$/, ')');
        this.CFIString = CFIString, this.Current = 0;
        if(this.Log) {
            this.log(1, `Bibi EPUB-CFI`);
            this.log(2, `parse`);
            this.log(3, `CFIString: ${ this.CFIString }`);
        }
        return this['parse' + Scope]();
    };

    this.parseFragment = () => {
        const Foothold = this.Current;
        if(!this.parseString('epubcfi(')) return this.cancel(Foothold, `Fragment`);
        const CFI = this.parseCFI();
        if(CFI === null) return this.cancel(Foothold);
        if(!this.parseString(')')) return this.cancel(Foothold, `Fragment`);
        return CFI;
    };
    this.parseCFI = () => {
        const Foothold = this.Current, CFI = { Type: 'CFI', Path: this.parsePath() };
        if(!CFI.Path) return this.cancel(Foothold, `CFI`);
        if(this.parseString(',')) {
            CFI.Start = this.parseLocalPath();
            if(!CFI.Start.Steps.length && !CFI.Start.TermStep) return this.cancel(Foothold, `CFI > Range`);
            if(!this.parseString(',')) return this.cancel(Foothold, 'CFI > Range');
            CFI.End   = this.parseLocalPath();
            if(  !CFI.End.Steps.length &&   !CFI.End.TermStep) return this.cancel(Foothold, `CFI > Range`);
        }
        return CFI;
    };
    this.parsePath = () => {
        const Foothold = this.Current, Path = { Type: 'Path', Steps: [this.parseStep()] }, LocalPath = this.parseLocalPath();
        if(!Path.Steps[0]) return this.cancel(Foothold, `Path`);
        if(LocalPath) Path.Steps = Path.Steps.concat(LocalPath.Steps);
        else return this.cancel(Foothold, `Path`);
        return Path;
    };
    this.parseLocalPath = () => {
        const Foothold = this.Current, LocalPath = { Type: 'LocalPath', Steps: [] };
        let StepRoot = LocalPath, Step = this.parseStep('Local'), TermStep = null;
        while(Step !== null) {
            StepRoot.Steps.push(Step);
            Step = this.parseStep('Local');
            if(!Step) break;
            if(Step.Type == 'IndirectStep') {
                const IndirectPath = { Type: 'IndirectPath', Steps: [] };
                StepRoot.Steps.push(IndirectPath);
                StepRoot = IndirectPath;
            } else if(Step.Type == 'TermStep') {
                TermStep = Step;
                break;
            }
        }
        if(TermStep) StepRoot.Steps.push(TermStep);
        return (LocalPath.Steps.length ? LocalPath : null);
    };
    this.parseStep = Local => {
        const Foothold = this.Current, Step = {};
             if(         this.parseString( '/')) Step.Type =         'Step';
        else if(Local && this.parseString('!/')) Step.Type = 'IndirectStep';
        else if(Local && this.parseString( ':')) Step.Type =     'TermStep';
        else                                     return this.cancel(Foothold, `Step`);
        Step.Index = this.parseString(/^(0|[1-9][0-9]*)/);
        if(Step.Index === null) return this.cancel(Foothold, `Step`);
        Step.Index = parseInt(Step.Index);
        if(this.parseString('[')) {
            if(Step.Type != 'TermStep') {
                Step.ID = this.parseString(/^[a-zA-Z_:][a-zA-Z0-9_:\-\.]+/);
                if(!Step.ID) return this.cancel(Foothold, `Step > Assertion > ID`);
            } else {
                const CSV = [], Side = null, ValueRegExp = /^((\^[\^\[\]\(\)\,\;\=])|[_a-zA-Z0-9%\- ])*/;
                CSV.push(this.parseString(ValueRegExp));
                if(this.parseString(',')) CSV.push(this.parseString(ValueRegExp));
                if(CSV[0]) Step.Preceding = CSV[0];
                if(CSV[1]) Step.Following = CSV[1];
                if(this.parseString(/^;s=/)) Side = this.parseString(/^[ab]/);
                if(Side)   Step.Side = Side;
                if(!Step.Preceding && !Step.Following && !Step.Side) return this.cancel(Foothold, `Step > Assertion > TextLocation`);
            }
            if(!this.parseString(']')) return this.cancel(Foothold, `Step > Assertion`);
        }
        return Step;
    };
    this.parseString = S => {
        let Correction = null, Matched = false;
        if(S instanceof RegExp) {
            const CFIString = this.CFIString.substr(this.Current, this.CFIString.length - this.Current);
            if(S.test(CFIString)) {
                Matched = true;
                S = CFIString.match(S)[0];
            }
        } else if(this.CFIString.substr(this.Current, S.length) === S) {
            Matched = true;
        }
        if(Matched) {
            this.Current += S.length;
            Correction = S;
        }
        return this.correct(Correction);
    };

    this.correct = Correction => {
        if(this.Log && this.LogCorrection && Correction) this.log(3, Correction);
        return Correction;
    };
    this.cancel = (Foothold, Parser) => {
        if(this.Log && this.LogCancelation) this.log(4, `cancel: parse ${ Parser } (${ Foothold }-${ this.Current }/${ this.CFIString.length })`);
        if(typeof Foothold == 'number') this.Current = Foothold;
        return null;
    };
    this.log = (Lv, Message) => {
        if(!this.Log) return;
             if(Lv == 0) Message = `[ERROR] ${ Message }`;
        else if(Lv == 1) Message = `---------------- ${ Message } ----------------`;
        else if(Lv == 2) Message = Message;
        else if(Lv == 3) Message = ` - ${ Message }`;
        else if(Lv == 4) Message = `   . ${ Message }`;
        O.log(`EPUBCFI: ${ Message }`);
    };

    this.getDestination = CFIString => {
        const CFI = X['EPUBCFI'].parse(CFIString);
        if(!CFI || CFI.Path.Steps.length < 2 || !CFI.Path.Steps[1].Index || CFI.Path.Steps[1].Index % 2 == 1) return null;
        const ItemIndexInAll = CFI.Path.Steps[1].Index / 2 - 1;
        let ElementSelector = null, TextNodeIndex = null, TermStep = null, IndirectPath = null;
        if(CFI.Path.Steps[2] && CFI.Path.Steps[2].Steps) {
            ElementSelector = '';
            CFI.Path.Steps[2].Steps.forEach((Step, i) => {
                if(Step.Type == 'IndirectPath') { IndirectPath = Step; return false; }
                if(Step.Type == 'TermStep')     { TermStep     = Step; return false; }
                if(Step.Index % 2 == 1) {
                    TextNodeIndex = Step.Index - 1;
                    if(i != CFI.Path.Steps[2].Steps.length - 2) return false;
                }
                if(TextNodeIndex === null) ElementSelector = Step.ID ? '#' + Step.ID : ElementSelector + '>*:nth-child(' + (Step.Index / 2) + ')';
            });
            if(ElementSelector && /^>/.test(ElementSelector)) ElementSelector = 'html' + ElementSelector;
            if(!ElementSelector) ElementSelector = null;
        }
        return {
            CFI: CFI,
            CFIString: CFIString,
            ItemIndexInAll: ItemIndexInAll,
            ElementSelector: ElementSelector,
            TextNodeIndex: TextNodeIndex,
            TermStep: TermStep,
            IndirectPath: IndirectPath
        };
    };

});

/* -----------------------------------------------------------------------------------------------------------------

   // EXAMPLE:

   X.EPUBCFI.parse('epubcfi(/6/4!/4/10!/4/2:32[All%20You%20Need%20Is,Love;s=a])'); // returns following object.

--------------------------------------------------------------------------------------------------------------------

{
    Type: 'CFI',
    Path: {
        Type: 'Path',
        Steps: [
            {
                Type: 'Step',
                Index: '6'
            },
            {
                Type: 'Step',
                Index: '4'
            },
            {
                Type: 'IndirectPath',
                Steps: [
                    {
                        Type: 'IndirectStep',
                        Index: '4'
                    },
                    {
                        Type: 'Step',
                        Index: '10'
                    },
                    {
                        Type: 'IndirectPath',
                        Steps: [
                            {
                                Type: 'IndirectStep',
                                Index: '4'
                            },
                            {
                                Type: 'Step',
                                Index: '2'
                            }
                        ],
                        TermStep: {
                            Type: 'TermStep',
                            Index: '32',
                            Preceding: 'All You Need Is',
                            Following: 'Love',
                            Side: 'a'
                        }
                    }
                ]
            }
        ]
    }
}

----------------------------------------------------------------------------------------------------------------- */



