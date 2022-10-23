import { Core } from './core';
import carsData from './data/cars.json';
import { getCarsCount } from './products';
import { log } from './utils';

const carsCount = getCarsCount(carsData);
console.log('MuultiAgent - Car exchange');
console.log(`Cars data count: ${carsCount}`);

const core = new Core(carsData);
core.showInitialState();
core.startExchange().then(() => {
  log('Closing app...');
  process.exit(0);
});
