import config from '../config';
import { EXCHANGE_ACTIONS } from '../exchange';
import { Car } from '../products';
import { getRandomInt, log, logFramed, logLine, plnFormatter } from '../utils';
import ExchangeAgent, { ROLE } from './exchange-agent';
import { TOffer } from './seller';

export type TBuyerProps = {
  carsCountGoal: number;
  cash: number;
  id?: string;
  minWait: number;
  maxWait: number;
  maxAttempts: number;
};

class Buyer extends ExchangeAgent {
  private readonly _carsCountGoal;
  private readonly _minWait;
  private readonly _maxWait;
  private readonly _maxAttempts;

  constructor({ id, carsCountGoal, cash, minWait, maxWait, maxAttempts }: TBuyerProps) {
    super([], ROLE.BUYER, id);

    this.cash = cash;
    this._carsCountGoal = carsCountGoal;
    this._minWait = minWait;
    this._maxWait = maxWait;
    this._maxAttempts = maxAttempts;
  }

  showState() {
    super.showState();

    logFramed(`Wants to buy ${this._carsCountGoal}`);
    logFramed(`Cash: ${plnFormatter.format(this.cash)}`);
    logLine();
  }

  private filterCars = (cars: Car[], evaluate: (car: Car) => boolean) => {
    const filtered: Car[] = [];
    cars.forEach((car) => evaluate(car) && filtered.push(car));
    return filtered;
  };

  private evaluateIfAbleToBuy = (car: Car) => car.totalPrice <= this.cash / (this._carsCountGoal - this.cars.length);
  private evaluateIfNewest = (car: Car, bestYear: number) => car.yearOfProduction === bestYear;
  private evaluateIfBestEngine = (car: Car, bestEngine: number) => car.engineCapacity === bestEngine;

  private sortByYearOfProduction = (cars: Car[]) =>
    cars.sort((a, b) => {
      if (a.yearOfProduction > b.yearOfProduction) return -1;
      else if (a.yearOfProduction < b.yearOfProduction) return 1;
      return 0;
    });

  private sortByEngineCapacity = (cars: Car[]) =>
    cars.sort((a, b) => {
      if (a.engineCapacity > b.engineCapacity) return -1;
      else if (a.engineCapacity < b.engineCapacity) return 1;
      return 0;
    });

  private sortByLowestPrice = (cars: Car[]) =>
    cars.sort((a, b) => {
      if (a.totalPrice > b.totalPrice) return 1;
      else if (a.totalPrice < b.totalPrice) return -1;
      return 0;
    });

  private getBestCar(cars: Car[]): Car {
    // Assumptions:
    // Buyer looks for the NEWEST car that he can afford, then with the biggest engine capacity
    // and the last parameter is to get this car for less price.

    let results = this.filterCars(cars, this.evaluateIfAbleToBuy);
    results = this.sortByYearOfProduction(results);
    results = this.filterCars(results, (car) => this.evaluateIfNewest(car, results[0].yearOfProduction));
    results = this.sortByEngineCapacity(results);
    results = this.filterCars(results, (car) => this.evaluateIfBestEngine(car, results[0].engineCapacity));
    results = this.sortByLowestPrice(results);

    return results?.[0];
  }

  waitWithDecision = async () => await this.wait(getRandomInt(this._minWait, this._maxWait));

  async start() {
    await super.start();

    // 1. Register to exchange
    await this.getTaskResult(
      this.pushTask(this.actions[EXCHANGE_ACTIONS.REGISTER_TO_EXCHANGE]([this.getTileWithId()])),
    );

    let attempts = 1;

    while (this.cars.length < this._carsCountGoal && attempts <= this._maxAttempts) {
      // 2. Ask for cars
      await this.waitWithDecision();
      this.log(`asks for cars`);
      const cars: Car[] = await this.getTaskResult(this.pushTask(this.actions[EXCHANGE_ACTIONS.ASK_FOR_CARS]()));

      // 3. Find best car
      const bestCar = this.getBestCar(cars);
      if (!bestCar) this.log(`is unable to buy any car, will wait [#${attempts}]`);
      await this.waitWithDecision();

      if (bestCar) {
        this.log(`try to buy car [${bestCar.id}]`);
        const carOffer: TOffer = await this.getTaskResult(
          this.pushTask(this.actions[EXCHANGE_ACTIONS.ASK_FOR_CAR]([this.id, bestCar.id])),
        );

        if (!carOffer) {
          this.log(`weren't able to buy car [${bestCar.id}], will look for new one [#${attempts}]`);
        } else {
          await this.waitWithDecision();
          const result: boolean = await this.getTaskResult(
            this.pushTask(
              this.actions[EXCHANGE_ACTIONS.BUY_CAR]([
                this.id,
                carOffer.sellerId,
                carOffer.car.id,
                carOffer.totalPrice.toString(),
              ]),
            ),
          );
          if (result) this.log(`bought car ${bestCar.id}`);
          else this.log(`didn't buy car ${bestCar.id}`);
        }
      }

      attempts++;
    }
  }

  showSummary() {
    super.showSummary();

    const title = `${this.getTileWithId()}`.padStart(10);
    const carsCount = this.cars.length;
    const cash = plnFormatter.format(this.cash).padStart(config.app.lineWidth - (title.length + 118));

    logFramed(`${title} BOUGHT ${carsCount} car(s) ${''.padEnd(89)}| Cash: ${cash}`);
  }
}

export default Buyer;
