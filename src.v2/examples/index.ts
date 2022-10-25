import clc from 'cli-color';

import { exampleCarsExchange } from './cars-exchange';
import { log } from './cars-exchange/utils';

// clc.blackBright -> info logs

export const startExampleCarsExchange = () => {
  exampleCarsExchange.start().then(() => {
    log('Closing app...', clc.blackBright);
    process.exit(0);
  });
};
