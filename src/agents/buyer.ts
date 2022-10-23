import config from '../config';
import { Car } from '../products/car/car';
import { LINE, getRandomInt, log, plnFormatter, waitForDecision } from '../utils';
import Agent, { ROLE, TActions } from './agent';
import { TOffer } from './seller';

const INFO_LINE_LENGTH = LINE.length - 1;
const BOUGHT_INFO_LENGTH = config.lineWidth - 4;

class Buyer extends Agent {
  private readonly carsNeed;
  private readonly maxBookTime;
  private readonly maxCarBuyAttempts;

  constructor(
    carsNeed: number,
    minCashPerCar: number,
    maxCashPerCar: number,
    maxBookTime: number,
    maxCarBuyAttempts: number,
  ) {
    super([], ROLE.BUYER);

    this.carsNeed = carsNeed;
    this.cash = carsNeed * getRandomInt(minCashPerCar, maxCashPerCar);
    this.maxBookTime = maxBookTime;
    this.maxCarBuyAttempts = maxCarBuyAttempts;
  }

  showInfo(index: number) {
    super.showInfo(index);

    console.log(`| Wants to buy ${this.carsNeed} car(s)`.padEnd(INFO_LINE_LENGTH) + '|');
    console.log(LINE);
  }

  private filterCars = (cars: Car[], evaluate: (car: Car) => boolean) => {
    const filtered: Car[] = [];
    cars.forEach((car) => evaluate(car) && filtered.push(car));
    return filtered;
  };

  private evaluateIfAbleToBuy = (car: Car) => car.price + car.additionalCosts <= this.cash / this.carsNeed;
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
      const aTotalPrice = a.additionalCosts + a.price;
      const bTotalPrice = b.additionalCosts + b.price;

      if (aTotalPrice > bTotalPrice) return 1;
      else if (aTotalPrice < bTotalPrice) return -1;
      return 0;
    });

  private getBestCar(cars: Car[]) {
    // Assumptions:
    // Buyer looks for the NEWEST car that he can afford, then with the biggest engine capacity
    // and the last parameter is to get this car for less price.

    let results = this.filterCars(cars, this.evaluateIfAbleToBuy);
    results = this.sortByYearOfProduction(results);
    results = this.filterCars(results, (car) => this.evaluateIfNewest(car, results[0].yearOfProduction));
    results = this.sortByEngineCapacity(results);
    results = this.filterCars(results, (car) => this.evaluateIfBestEngine(car, results[0].engineCapacity));
    results = this.sortByLowestPrice(results);

    return results[0];
  }

  showSummary(index: number) {
    const info = `[${this.id}] Bought ${this.cars.length} cars | Cash: ${plnFormatter.format(this.cash)}.`;

    console.log(`| ${info.padEnd(BOUGHT_INFO_LENGTH)} |`);
  }

  async start(actions: TActions) {
    await super.start(actions);

    let attempts = 0;

    while (this.cars.length < this.carsNeed && attempts <= this.maxCarBuyAttempts) {
      await waitForDecision();

      this.agentLog('asks for cars');
      const askForCarsActionId = actions.askForCars();
      const cars = (await actions.getResult(askForCarsActionId)) as Car[];
      const bestCar = this.getBestCar(cars);

      if (!bestCar) this.agentLog(`is unable to buy any car, will wait [#${attempts}]`);
      await waitForDecision();

      if (bestCar) {
        this.agentLog(`try to buy car [${bestCar.id}]`);
        const askForCarActionId = actions.askForCar(bestCar.id, bestCar.ownerId, this.id);
        const carOffer = (await actions.getResult(askForCarActionId)) as TOffer;
        if (!carOffer) {
          this.agentLog(`weren't able to buy car [${bestCar.id}], will look for new one [#${attempts}]`);
        } else {
          await waitForDecision(0.8 * this.maxBookTime);
          const buyCarActionId = actions.buyCar(carOffer, this.id);
          const buyResult = await actions.getResult(buyCarActionId);
          if (buyResult) this.agentLog(`bought car ${bestCar.id}`);
          else this.agentLog(`didn't buy car ${bestCar.id}`);
        }
      }

      attempts++;
    }
  }
}

export default Buyer;
