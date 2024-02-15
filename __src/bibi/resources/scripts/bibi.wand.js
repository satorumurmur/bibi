import { Wand } from './bibi.instruments/Wand.mjs';
import { Conc } from './bibi.instruments/Conc.mjs';

class retlieve extends Conc {
    constructor(Properties) {
        super(Object.assign({
            Name: 'retlieve',
            ConcurrencyLimit: 8,
            // Delay: sML.UA.Blink ? 123 : 4,
            RetryingLimit: 2,
            RetryingDelay: 888,
            FetchOption: {
                cache: S['cache'] === 'no-store' ? 'no-store' : undefined,
                credentials: S['request-with-credentials'] ? 'include' : undefined
            }
        }, Properties || {}));
        return (RequestURL, ResponseType) => this.order({
            ID: RequestURL.indexOf(S['book']) === 0 ? RequestURL.replace(S['book'], '') : RequestURL,
            WaitListIndex: /\.(x?html?)$/i.test(RequestURL.split('?')[0]) ? 1 : 0,
            ResponseType, RequestURL, Retried: 0
        });
    };
    async process(Order) {
        const { ResponseType, RequestURL } = Order;
        const Res = await fetch(RequestURL, this.FetchOption);
        if(Res.ok) return Res[ResponseType]();
        switch(Res.status) {
            case 404: {
                if(ResponseType === 'blob') {
                    this.Logger && this.log(Order, `Got 404 ...but go ahead.`);
                    return Res[ResponseType]();
                }
                this.Logger && this.log(Order, `Got 404`);
                break;
            }
            case 503: {
                const { ConcurrencyLimit, RetryingLimit, RetryingDelay } = this;
                const { Retried } = Order;
                if(ConcurrencyLimit > 1) this.ConcurrencyLimit = ConcurrencyLimit > 8 ? 8 : this.ConcurrencyLimit - 1;
                if(Retried < RetryingLimit) {
                    const Rd = ++Order.Retried;
                    this.Logger && this.log(Order, `Got 503 and retrying... (${ Rd }/${ RetryingLimit })` + (this.ConcurrencyLimit < ConcurrencyLimit ? ` & Reduced concurrency limit (${ ConcurrencyLimit } -> ${ this.ConcurrencyLimit })` : ''));
                    await new Promise(o => setTimeout(o, RetryingDelay));
                    return this.order(Object.assign(Order, { ID: `R${ Rd }::${ Order.ID }` }));
                }
                this.Logger && this.log(Order, `Got 503 and give up. (${ Retried }/${ RetryingLimit })` + (this.ConcurrencyLimit < ConcurrencyLimit ? ` & Reduced concurrency limit (${ ConcurrencyLimit } -> ${ this.ConcurrencyLimit })` : ''));
                break;
            }
        }
        throw { status: Res.status, statusText: Res.statusText };
    };
};

const W = new Wand(self, {
    log: (Msg, ...Args) => setTimeout(() => self.postMessage({ Log: [`w&: ` + Msg, ...Args] }), 0),
    setVars: (Vars) => Object.keys(Vars).forEach(VarName => self[VarName] = Vars[VarName]),
    initialize: (Vars) => {
        delete W.initialize;
        W.setVars(Vars);
        Object.defineProperties(sML, { OS: { get: () => sML.OperatingSystem }, UA: { get: () => sML.UserAgent }, Env: { get: () => sML.Environments } });
        W.Logger = Bibi.Debug ? W : null;
        W.retlieve = new retlieve({ Logger: W.Logger });
    }
});
