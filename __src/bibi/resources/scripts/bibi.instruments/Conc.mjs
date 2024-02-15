export class Conc {
    static ConcNumber = 0;
    reset() {
        this.OrderNumber = 0;
        this.Orders = new Map();
        this.Seats = new Set();
        this.WaitLists = new Array();
    };
    constructor(Properties = {}, coreprocess) {
        const ConcNumber = Conc.ConcNumber++;
        this.reset();
        if(typeof coreprocess === 'function') Object.assign(Properties, { coreprocess });
        Object.keys(Properties).forEach(Key => this[Key] === undefined && (this[Key] = Properties[Key]));
        if(this.Name === undefined) this.Name = String(ConcNumber).padStart(3, '0');
        if(typeof     this.process !== 'function')     this.process = (Order, ...Args) => this.coreprocess(...Args);
        if(typeof this.coreprocess !== 'function') this.coreprocess = () => undefined;
        if(!Number.isInteger(this.ConcurrencyLimit)) {
            this.ConcurrencyLimit = null;
            this.order = (Order = {}, ...Args) => {
                const OrderNumber = this.OrderNumber++;
                if(Order.ID === undefined) Order.ID = OrderNumber;
                return this.process(Order, ...Args);
            };
        }
    };
    async order(Order = {}, ...Args) {
        Order = Order.ID !== undefined && this.Orders.get(Order.ID) || Order;
        if(Order.Promise) {
            this.Logger && this.log(Order, `Cache!`);
        } else {
            Order.State = 'Ordering';
            const TimeLog = Order.TimeLog = [Date.now()];
            let resolveOrder, rejectOrder;
            Order.Promise = new Promise((resolve, reject) => { resolveOrder = resolve; rejectOrder = reject; });
            const OrderNumber = this.OrderNumber++;
            if(   Order.ID === undefined)    Order.ID = String(OrderNumber).padStart(3, '0');
            if(Order.Label === undefined) Order.Label = Order.ID;
            this.Orders.set(Order.ID, Order);
            const { ConcurrencyLimit, Seats, WaitLists } = this;
            if(Seats.size >= ConcurrencyLimit) await new Promise(resolve => {
                Order.State = 'Waiting';
                const WLI = Order.WaitListIndex || 0;
                (WaitLists[WLI] || (WaitLists[WLI] = [])).push(resolve);
                this.Logger && this.log(Order, `Waiting... (in the WaitLists[${ WLI }])`);
            });
            new Promise(resolveProcess => {
                Order.State = 'Processing';
                Seats.add(Order);
                TimeLog[1] = Date.now();
                this.Logger && this.log(Order, `Processing... (waited: ${ this.sec(TimeLog[1] - TimeLog[0]) }sec)`);
                resolveProcess(this.process(Order, ...Args));
            }).then(Result => {
                Order.State = 'Done';
                resolveOrder(Result);
            }).catch(Result => {
                Order.State = 'Failed';
                rejectOrder(Result);
            }).finally(async () => {
                TimeLog[2] = Date.now();
                this.Logger && this.log(Order, `${ Order.State }! (total: ${ this.sec(TimeLog[2] - TimeLog[0]) }sec / process: ${ this.sec(TimeLog[2] - TimeLog[1]) }sec)`);
                if(Seats.size >= ConcurrencyLimit) {
                    const Delay = this.Delay?.[i];
                    if(Delay) await new Promise(o => setTimeout(o, Delay));
                }
                for(let l = WaitLists.length, i = 0; i < l; i++) {
                    const WaitList = WaitLists[i];
                    if(!WaitList?.length) continue;
                    WaitList.shift()();
                    break;
                }
                Seats.delete(Order);
            });
        }
        return Order.Promise;
    };
    log(Order, LogHeader) {
        if(!this.Logger?.log || this.Logger === this) return;
        const { Name, ConcurrencyLimit, Seats, WaitLists } = this;
        this.Logger.log([
            `Conc['${ Name }']("${ Order.Label }"): ${ LogHeader }`,
            `{${ Seats.size }/${ ConcurrencyLimit || '-' }}:(` + (_ => { for(let l = WaitLists.length, i = 0; i < l; i++) _.push(WaitLists[i]?.length || 0); return _.join('+') || 0; })([]) + `)`
        ].join(' - '));
    };
    sec(Sec) {
        return String(Sec).padStart(4, '0').replace(/(.{3})$/, '.$1');
    };
};

// export class conc extends Conc { constructor(...Args) { super(...Args); return (...Args) => this.order(...Args); }; };
