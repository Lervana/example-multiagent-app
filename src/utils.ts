import dayjs from 'dayjs';
import delay from 'delay';

import config from './config';

export const LINE = ''.padEnd(config.lineWidth, '-');

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const plnFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

export const log = (message: string) => {
  console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')}] ${message}`);
};

export const waitForDecision = async (max?: number) => {
  await delay(getRandomInt(100, max ?? 1000));
};
