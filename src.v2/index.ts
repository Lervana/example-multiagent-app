import config from './config';
import Exchange from './exchange';
import { log } from './utils';

const exchange = new Exchange(config);
exchange.start().then(() => {
  log('Closing app...');
  process.exit(0);
});
