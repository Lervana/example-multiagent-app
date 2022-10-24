import dayjs from 'dayjs';

import config from './config';

export const LINE_WIDTH = config.app.lineWidth;
export const HALF_LINE_WIDTH = LINE_WIDTH / 2;
export const LINE = ''.padEnd(LINE_WIDTH, '-');

export const padBoth = (text: string) => {
  const emptySignsCount = LINE_WIDTH - text.length;
  const signs = ''.padEnd(emptySignsCount / 2);
  return signs + text + signs;
};

export const logLine = () => console.log(LINE);
export const logCentered = (text: string) => console.log(padBoth(text));
export const logEmpty = () => console.log();
export const logFramed = (text: string) => console.log(`| ${text.padEnd(LINE_WIDTH - 4)} |`);

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
