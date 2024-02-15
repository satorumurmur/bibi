export class Wand {
    static WandNumber = 0;
    reset() {
        this.AbsorberNumber = 0;
        this.Absorbers = new Map();
    };
    constructor(WandWorker, Properties = {}) {
        if( typeof window != 'undefined' ? !(typeof WandWorker === 'string' && WandWorker ? WandWorker = new Worker(WandWorker) : WandWorker instanceof Worker           )
                                         : !(                                                                                     WandWorker instanceof WorkerGlobalScope) ) return;
        this.WandWorker = WandWorker;
        this.WandNumber = Wand.WandNumber++;
        this.reset();
        Object.keys(Properties).forEach(Key => this[Key] === undefined && (this[Key] = Properties[Key]));
        WandWorker.addEventListener('message', Msg => this.receive(Msg?.data));
    };
    receive(Data) { if(!Data) return;
        if(Data.Log !== undefined) return this.Logger?.log?.(...(typeof Data.Log !== 'string' && Data.Log.length ? Data.Log : [Data.Log]));
        if(Data.AND !== undefined) { // B from A
            const { AbsorberNumber, AND, Arguments } = Data;
            let Fulfilled, With;
            return (!this.hasOwnProperty(AND) ? Promise.reject() : Promise.resolve(typeof this[AND] === 'function' ? this[AND](...Arguments) : AND))
                .then(FulfilledWith => { Fulfilled = true,  With = FulfilledWith; })
                .catch(RejectedWith => { Fulfilled = false, With =  RejectedWith; })
                .finally(() => this.WandWorker.postMessage({ AbsorberNumber, Fulfilled, With })); // B to A
        }
        if(Data.Fulfilled !== undefined) { // A from B
            const { AbsorberNumber, Fulfilled, With } = Data;
            this.Absorbers.get(AbsorberNumber)(Fulfilled, With);
            this.Absorbers.delete(AbsorberNumber);
        }
    };
    emit(AND, ...Arguments) {
        if(typeof AND !== 'string' || !AND) return () => Promise.reject();
        return new Promise((resolve, reject) => {
            const AbsorberNumber = this.AbsorberNumber++;
            this.Absorbers.set(AbsorberNumber, (Fulfilled, With) => (Fulfilled ? resolve : reject)(With));
            this.WandWorker.postMessage({ AbsorberNumber, AND, Arguments }); // A to B
        });
    };
    and(AND) { return (...Arguments) => this.emit(AND, ...Arguments); };
};
