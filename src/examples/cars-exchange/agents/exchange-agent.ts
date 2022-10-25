import { Agent } from '../../../core';
import { EXCHANGE_ACTIONS } from '../exchange';
import { Car } from '../products';
import { log, logFramed, logLine, plnFormatter } from '../utils';

export enum ROLE {
  SELLER,
  BUYER,
}

class ExchangeAgent extends Agent {
  protected cars: Car[];
  protected cash = 0;
  protected role: ROLE;

  constructor(cars: Car[], role: ROLE, id?: string) {
    super(id);
    this.cars = cars;
    this.role = role;
  }

  showState() {
    logLine();
    logFramed(`${this.getTile()} [${this.id}]`);
    logLine();
  }

  public isSeller = () => this.role === ROLE.SELLER;
  protected getTile = () => (this.isSeller() ? 'Seller' : 'Buyer');
  protected getTileWithId = () => `${this.colorText(`[${this.id.padStart(2)}]`)} ${this.getTile()}`;
  protected log = (message: string) => log(`${this.getTileWithId()} ${message}`);

  public reduceCash = (amount: number) => {
    this.cash = this.cash - amount;
    this.log(`spent ${plnFormatter.format(amount)}`);
  };

  public addCash = (amount: number) => {
    this.cash = this.cash + amount;
    this.log(`received ${plnFormatter.format(amount)}`);
  };

  public getCash = () => this.cash;

  public removeCar = (removedCar: Car) => {
    const newCarsSet: Car[] = [];
    this.cars.forEach((car) => car.id !== removedCar.id && newCarsSet.push(car));
    this.cars = newCarsSet;
    this.log(`removed car [${removedCar.id}]`);
  };

  public addCar = (car: Car) => {
    this.cars.push(car);
    this.log(`added car [${car.id}]`);
  };

  public showSummary() {}

  async start(): Promise<void> {
    super.start();

    // 1. Register to exchange
    await this.getTaskResult(
      this.pushTask(this.actions[EXCHANGE_ACTIONS.REGISTER_TO_EXCHANGE]([`${this.getTileWithId()} joined exchange`])),
    );
  }
}

export default ExchangeAgent;
