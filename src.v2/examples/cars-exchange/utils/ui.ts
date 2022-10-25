import clc from 'cli-color';

import { ExchangeAgent } from '../agents';
import { TTransaction } from '../exchange';
import { CarFactory } from '../products';
import { plnFormatter } from './converters';
import { logCenteredBetweenEmpty, logCenteredBetweenLines, logEmpty, logFramed, logLine } from './logger';

export const COLORS = [
  clc.bgRed,
  clc.bgGreen,
  clc.bgYellow,
  clc.bgBlue,
  clc.bgMagenta,
  clc.bgCyan,
  clc.bgWhite,
  clc.bgBlackBright,
  clc.bgRedBright,
  clc.bgBlueBright,
  clc.bgYellowBright,
  clc.bgGreenBright,
  clc.bgMagentaBright,
  clc.bgCyanBright,
  clc.bgWhiteBright,
];

export const logExchangeInfo = (carFactory: CarFactory) => {
  const INTRO = 'MultiAgentSystem - Car exchange example [v.1.0]';
  const CARS_DATA_HEADER = 'Cars Data';

  logCenteredBetweenLines(INTRO);
  logCenteredBetweenEmpty(CARS_DATA_HEADER + ` [${carFactory.getCarsDataCount()}]`);
  logLine();
  carFactory.printParsedCars();
  logLine();
  logEmpty();
};

export const logTransactions = (transactions: TTransaction[]) => {
  const header1 = `FROM -> TO | ${' '.padEnd(15)}CAR ID ${' '.padEnd(14)} | `;
  const header2 = ` ${'BUYER BALANCE'.padStart(25)} ${' '.padEnd(9)} |`;
  const header3 = ` ${'SELLER BALANCE'.padStart(25)} ${' '.padEnd(10)} | `;
  const header4 = ` ${'PRICE'.padStart(10)} ${' '.padEnd(4)}`;
  const balancePad = 16;

  logFramed(header1 + header2 + header3 + header4);
  logLine();

  transactions.forEach((t) => {
    const sellerColor = COLORS[parseInt(t.sellerId)];
    const buyerColor = COLORS[parseInt(t.buyerId)];

    const fromTo = `${sellerColor(t.sellerId)} -> ${buyerColor(t.buyerId)}`;
    const buyerBalance = `${plnFormatter.format(t.buyerBalance + t.totalPrice).padStart(balancePad)} -> ${plnFormatter
      .format(t.buyerBalance)
      .padStart(balancePad)}`;
    const sellerBalance = `${plnFormatter.format(t.sellerBalance - t.totalPrice).padStart(balancePad)} -> ${plnFormatter
      .format(t.sellerBalance)
      .padStart(balancePad)}`;
    const price = plnFormatter.format(t.totalPrice).padStart(balancePad);

    logFramed(`  ${fromTo} | ${t.carId} | ${buyerBalance} | ${sellerBalance} |  ${price} `);
  });
};

export const showSummary = (agents: ExchangeAgent[], transactions: TTransaction[]) => {
  logCenteredBetweenLines('Results');
  agents.forEach((agent) => agent.showSummary());
  logLine();
  logCenteredBetweenLines('Transactions');
  logTransactions(transactions);
  logLine();
};
