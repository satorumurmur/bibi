#!/usr/bin/env node

'use strict';

import Bibi from 'bibi.plays/as.conductor.mjs';

Object.keys(Bibi.Arguments).forEach(Wave => Bibi.Conductor.wave(Wave)(Bibi.Arguments[Wave]));
