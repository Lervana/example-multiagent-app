import clc from 'cli-color';
import { v4 } from 'uuid';

import { TConfig } from '../config';
import { TExchangeActions } from '../exchange';
import { Car } from '../products';
import { COLORS, getRandomInt } from '../utils';
import Buyer from './buyer';
import ExchangeAgent from './exchange-agent';
import Seller from './seller';

export type TAgentsFactoryProps = {
  config: TConfig;
  createAgentCars: (count: number) => Car[];
  exchangeActions: TExchangeActions;
};

class AgentsFactory {
  private readonly _createAgentCars: (count: number) => Car[];
  private readonly _config: TConfig;
  private readonly _exchangeActions: TExchangeActions;

  constructor({ config, createAgentCars, exchangeActions }: TAgentsFactoryProps) {
    this._config = config;
    this._createAgentCars = createAgentCars;
    this._exchangeActions = exchangeActions;
  }

  public produceSeller = (createAgentCars: (count: number) => Car[], id?: string): ExchangeAgent => {
    return new Seller({
      id: id ?? v4(),
      cars: createAgentCars(this._config.agents.sellers.startCarsCount),
      reservationTime: this._config.agents.sellers.carBookTime,
      maxLineWidth: this._config.app.lineWidth,
      startCarsCount: this._config.agents.sellers.startCarsCount,
    });
  };

  public produceBuyer = (id?: string): ExchangeAgent => {
    return new Buyer({
      id: id ?? v4(),
      carsCountGoal: this._config.agents.buyers.carsGoal,
      cash:
        getRandomInt(this._config.agents.buyers.minCashPerCar, this._config.agents.buyers.maxCashPerCar) *
        this._config.agents.buyers.carsGoal,
      minWait: this._config.agents.minDecisionWait,
      maxWait: this._config.agents.maxDecisionWait,
      maxAttempts: this._config.agents.buyers.maxCarBuyAttempts,
      maxLineWidth: this._config.app.lineWidth,
    });
  };

  public produceSeries = (sellersCount: number, buyersCount: number): ExchangeAgent[] => {
    const agentsCount = sellersCount + buyersCount;
    if (agentsCount > COLORS.length)
      throw new Error(`Due to colors amount maximum number of agents is: ${COLORS.length}`);

    const agents: ExchangeAgent[] = [];

    let counter = 0;

    for (let x = 0; x < agentsCount; x++) {
      counter++;

      const color = COLORS[x];
      const id = counter < 10 ? '0' + counter : counter.toString();
      const isSeller = x < sellersCount;
      const agent = isSeller ? this.produceSeller(this._createAgentCars, id) : this.produceBuyer(id);
      console.log(color(`[${agent.id}] ${isSeller ? 'Seller' : 'Buyer'} picked color`));
      agent.actions = this._exchangeActions;
      agent.colorText = color;
      agents.push(agent);
    }

    return agents;
  };
}

export default AgentsFactory;
