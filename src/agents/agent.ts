import { v4 } from 'uuid';

import { Car } from '../products/car/car';
import { LINE, log, plnFormatter } from '../utils';
import { TOffer } from './seller';

export enum ROLE {
  SELLER,
  BUYER,
}

const INFO_LINE_LENGTH = LINE.length - 41;

export type TActions = {
  registerToExchange: (titleWithId: string) => string;
  getResult: (id: string) => Promise<any> | undefined;
  askForCars: () => string;
  askForCar: (carId: string, ownerId: string, buyerId: string) => string;
  buyCar: (offer: TOffer, buyerId: string) => string;
};

class Agent {
  public id: string;
  protected cars: Car[];
  protected cash = 0;
  protected role: ROLE;

  constructor(cars: Car[], role: ROLE) {
    this.id = v4();
    this.cars = cars;
    this.role = role;
  }

  public isSeller = () => this.role === ROLE.SELLER;
  protected getTile = () => (this.isSeller() ? 'Seller' : 'Buyer');
  protected getTileWithId = () => `[${this.id}] ${this.getTile()}`;
  protected agentLog = (message: string) => log(`${this.getTileWithId()} ${message}`);

  public reduceCash = (amount: number) => {
    this.cash = this.cash - amount;
    this.agentLog(`spent ${plnFormatter.format(amount)}`);
  };

  public addCash = (amount: number) => {
    this.cash = this.cash + amount;
    this.agentLog(`received ${plnFormatter.format(amount)}`);
  };

  public removeCar = (removedCar: Car) => {
    const newCarsSet: Car[] = [];
    this.cars.forEach((car) => car.id !== removedCar.id && newCarsSet.push(car));
    this.cars = newCarsSet;
    this.agentLog(`removed car ${removedCar.id}`);
  };

  public addCar = (car: Car) => {
    this.cars.push(car);
    this.agentLog(`added car ${car.id}`);
  };

  showInfo(index: number) {
    console.log(LINE);
    console.log(`| ${`${this.getTile()} [${index}]`.padEnd(INFO_LINE_LENGTH)} ${this.id} |`);
    console.log(LINE);
  }

  async start(actions: TActions) {
    actions.registerToExchange(this.getTileWithId());
  }

  showSummary(index: number) {}
}

export default Agent;
