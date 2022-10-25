import dayjs from 'dayjs';

import config from '../config';

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
export const logCenteredBetweenLines = (text: string) => {
  logLine();
  logCentered(text);
  logLine();
};
export const logCenteredBetweenEmpty = (text: string) => {
  logEmpty();
  logCentered(text);
  logEmpty();
};

export const log = (message: string, colorLog: (input: string) => string = (input) => input) => {
  console.log(colorLog(`[${dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')}] ${message}`));
};
