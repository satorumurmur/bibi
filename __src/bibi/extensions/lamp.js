import NoSleep from 'nosleep.js';

Bibi.x({

    id: 'Lamp'

})(function() {

    const Lamp = I.Desk.Lamp = {
        KeepUntilAfter: 0,
        update: (KeepUntilAfter) => {
            if(!Number.isFinite(KeepUntilAfter)) KeepUntilAfter = Lamp.KeepUntilAfter;
            Lamp.KeepUntilAfter = KeepUntilAfter;
            clearTimeout(Lamp.Timer_fuel);
            clearTimeout(Lamp.Timer_release);
            if(Lamp.KeepUntilAfter) {
                if(!Lamp.NoSleep) Lamp.NoSleep = new NoSleep();
                if(!Lamp.NoSleep.enabled) Lamp.NoSleep.enable();
                Lamp.Timer_release = setTimeout(() => Lamp.update(0), Lamp.KeepUntilAfter);
                if(!Lamp.fuel) {
                    Lamp.fuel = () => Lamp.update();
                    E.add(['bibi:moved-pointer', 'bibi:tapped', 'bibi:singletapped', 'bibi:doubletapped', 'bibi:tripletapped'], Lamp.fuel);
                }
            } else {
                if(Lamp.NoSleep && Lamp.NoSleep.enabled) Lamp.NoSleep.disable();
                if(Lamp.fuel) {
                    E.remove(['bibi:moved-pointer', 'bibi:tapped', 'bibi:singletapped', 'bibi:doubletapped', 'bibi:tripletapped'], Lamp.fuel);
                    delete Lamp.fuel;
                }
            }
        },
        keep: (KeepUntilAfter) => Lamp.update(KeepUntilAfter),
        release: () => Lamp.update(0)
    };

});
