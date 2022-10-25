import clc from 'cli-color';

import { AgentManager } from '../../core';
import { TAction } from '../../core';
import carsData from '../../data/cars.json';
import { AgentsFactory, Buyer, ExchangeAgent, Seller } from './agents';
import { TConfig } from './config';
import { Car, CarFactory } from './products';
import { log, logExchangeInfo, showSummary } from './utils';

export type TTransaction = {
  sellerId: string;
  buyerId: string;
  carId: string;
  totalPrice: number;
  buyerBalance: number;
  sellerBalance: number;
};

export enum EXCHANGE_ACTIONS {
  REGISTER_TO_EXCHANGE = 'register_to_exchange',
  ASK_FOR_CARS = 'ask_for_cars',
  ASK_FOR_CAR = 'ask_for_car',
  BUY_CAR = 'buy_car',
}

export type TExchangeActions = Record<EXCHANGE_ACTIONS, (args?: string[]) => TAction>;

class Exchange {
  private readonly _carDataCount: number;
  private readonly _agents: ExchangeAgent[];
  private _agentsFactory: AgentsFactory;
  private _carFactory: CarFactory;
  private _agentsManager: AgentManager;
  private _transactions: TTransaction[] = [];

  constructor(config: TConfig) {
    const exchangeActions: TExchangeActions = {
      [EXCHANGE_ACTIONS.REGISTER_TO_EXCHANGE]: this.registerToExchange,
      [EXCHANGE_ACTIONS.ASK_FOR_CARS]: this.askForCars,
      [EXCHANGE_ACTIONS.ASK_FOR_CAR]: this.askForCar,
      [EXCHANGE_ACTIONS.BUY_CAR]: this.buyCar,
    };

    this._agentsFactory = new AgentsFactory({
      config,
      exchangeActions,
      createAgentCars: (count) => this._carFactory.produceSeries(count, { ...config.cars }),
    });

    this._carFactory = new CarFactory(carsData);
    this._carDataCount = this._carFactory.getCarsDataCount();
    this._agents = this._agentsFactory.produceSeries(config.agents.sellers.count, config.agents.buyers.count);
    this._agentsManager = new AgentManager(this._agents);
  }

  private getAgent = (id: string) => this._agents.filter((a) => a.id === id)?.[0];

  registerToExchange = (args?: string[]) => async () => log(args?.[0] ?? '');

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

  async start() {
    logExchangeInfo(this._carFactory);
    this._agentsManager.showAgentsState();

    log('Exchange opened!', clc.blackBright);
    await this._agentsManager.start();
    log('Exchange closed!', clc.blackBright);

    showSummary(this._agents, this._transactions);
  }
}

export default Exchange;
