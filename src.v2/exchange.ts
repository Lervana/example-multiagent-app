import { Buyer, Seller } from './agents';
import ExchangeAgent from './agents/exchange-agent';
import { TConfig } from './config';
import { AgentManager } from './core';
import { TAction } from './core/agent-manager';
import carsData from './data/cars.json';
import { Car, CarFactory } from './products';
import { getRandomInt, log, logCentered, logEmpty, logFramed, logLine, plnFormatter } from './utils';

export enum EXCHANGE_ACTIONS {
  REGISTER_TO_EXCHANGE = 'register_to_exchange',
  ASK_FOR_CARS = 'ask_for_cars',
  ASK_FOR_CAR = 'ask_for_car',
  BUY_CAR = 'buy_car',
}

type TTransaction = {
  sellerId: string;
  buyerId: string;
  carId: string;
  totalPrice: number;
  buyerBalance: number;
  sellerBalance: number;
};

class Exchange {
  private readonly _carDataCount: number;
  private readonly _agents: ExchangeAgent[];
  private _carFactory: CarFactory;
  private _agentsManager: AgentManager;
  private _transactions: TTransaction[] = [];

  constructor(config: TConfig) {
    this._carFactory = new CarFactory(carsData);
    this._carDataCount = this._carFactory.getCarsDataCount();
    this._agents = this.initializeAgents(config);
    this._agentsManager = new AgentManager(this._agents);
  }

  initializeAgents(config: TConfig) {
    const { agents: agentsConfig } = config;
    const agents: ExchangeAgent[] = [];

    let counter = 0;

    for (let x = 0; x < agentsConfig.sellers.count; x++)
      ++counter &&
        agents.push(
          new Seller(
            this._carFactory.produceSeries(agentsConfig.sellers.startCarsCount, { ...config.cars }),
            config.agents.sellers.carBookTime,
            counter.toString(),
          ),
        );

    for (let x = 0; x < agentsConfig.buyers.count; x++)
      ++counter &&
        agents.push(
          new Buyer({
            id: counter.toString(),
            carsCountGoal: agentsConfig.buyers.carsGoal,
            cash:
              getRandomInt(agentsConfig.buyers.minCashPerCar, agentsConfig.buyers.maxCashPerCar) *
              agentsConfig.buyers.carsGoal,
            minWait: config.agents.minDecisionWait,
            maxWait: config.agents.maxDecisionWait,
            maxAttempts: config.agents.buyers.maxCarBuyAttempts,
          }),
        );

    const exchangeActions: Record<string, (args?: string[]) => TAction> = {
      [EXCHANGE_ACTIONS.REGISTER_TO_EXCHANGE]: this.registerToExchange,
      [EXCHANGE_ACTIONS.ASK_FOR_CARS]: this.askForCars,
      [EXCHANGE_ACTIONS.ASK_FOR_CAR]: this.askForCar,
      [EXCHANGE_ACTIONS.BUY_CAR]: this.buyCar,
    };

    agents.forEach((agent) => (agent.actions = exchangeActions));

    return agents;
  }

  logIntro() {
    const INTRO = 'MultiAgentSystem - Car exchange example [v.1.0]';
    const CARS_DATA_HEADER = 'Cars Data';

    logLine();
    logCentered(INTRO);
    logLine();
    logEmpty();
    logCentered(CARS_DATA_HEADER + ` [${this._carDataCount}]`);
    logEmpty();
    logLine();
    logLine();
    this._carFactory.printParsedCars();
    logLine();
    logEmpty();
  }

  private getAgent = (id: string) => this._agents.filter((a) => a.id === id)?.[0];

  registerToExchange = (args?: string[]) => async () => log(`${args?.[0]} joined exchange`);

  askForCars = () => async () => {
    const cars: Car[] = [];
    for (const agent of this._agents) agent.isSeller() && cars.push(...(agent as Seller).getCars());
    return cars;
  };

  askForCar = (args?: string[]) => async () => {
    const [buyerId, carId] = args ?? [];

    for (const agent of this._agents) {
      if (agent.isSeller() && !!(agent as Seller).getCar(carId)) {
        const seller = agent as Seller;
        if (seller.isCarAvailable(carId)) return seller.bookCar(carId, buyerId);
      }
    }

    return false;
  };

  buyCar = (args?: string[]) => async () => {
    const [buyerId, sellerId, carId, totalPrice] = args ?? [];

    const seller = this.getAgent(sellerId) as Seller;
    const buyer = this.getAgent(buyerId) as Buyer;
    const car = seller.getCar(carId);

    if (buyer?.isSeller() || !seller?.isSeller() || !car) return false;

    if (seller.isCarReserved(carId, buyerId)) {
      const price = parseInt(totalPrice);
      buyer.reduceCash(price);
      seller.addCash(price);
      seller.removeCar(car);
      buyer.addCar(car);

      this._transactions.push({
        sellerId,
        buyerId,
        carId,
        totalPrice: price,
        buyerBalance: buyer.getCash(),
        sellerBalance: seller.getCash(),
      });

      return true;
    }

    return false;
  };

  private showSummary = () => {
    logLine();
    logFramed('Results');
    logLine();
    this._agents.forEach((agent) => agent.showSummary());
    logLine();
    logEmpty();
    logLine();
    logFramed('Transactions');
    logLine();
    this._transactions.forEach((t) => {
      const fromTo = `${t.sellerId} -> ${t.buyerId}`.padStart(8);
      const price = plnFormatter.format(t.totalPrice).padStart(15);
      const buyerBalance = `${plnFormatter.format(t.buyerBalance + t.totalPrice).padStart(14)} -> ${plnFormatter
        .format(t.buyerBalance)
        .padStart(14)}`;
      const sellerBalance = `${plnFormatter.format(t.sellerBalance - t.totalPrice).padStart(14)} -> ${plnFormatter
        .format(t.sellerBalance)
        .padStart(14)}`;

      const info = `${fromTo} | ${t.carId} | ${price} | ${buyerBalance.padStart(30)} | ${sellerBalance.padStart(30)}`;
      logFramed(info);
    });
    logLine();
  };

  async start() {
    this.logIntro();
    this._agentsManager.showAgentsState();

    log('Exchange opened!');
    await this._agentsManager.start();
    log('Exchange closed!');

    this.showSummary();
  }
}

export default Exchange;
