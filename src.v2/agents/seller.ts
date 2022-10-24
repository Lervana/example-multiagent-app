import delay from 'delay';
import { v4 } from 'uuid';

import config from '../config';
import { Car } from '../products';
import { LINE_WIDTH, getRandomInt, logFramed, logLine, plnFormatter } from '../utils';
import ExchangeAgent, { ROLE } from './exchange-agent';

export type TOffer = {
  id: string;
  sellerId: string;
  car: Car;
  price: number;
  additionalCosts: number;
  totalPrice: number;
};

class Seller extends ExchangeAgent {
  private reservations: Record<string, string | undefined> = {};
  private offers: Record<string, TOffer> = {};
  private _reservationTime: number;

  constructor(cars: Car[], reservationTime: number, id?: string) {
    super(cars, ROLE.SELLER, id);
    this._reservationTime = reservationTime;
  }

  showState() {
    super.showState();
    this.cars.forEach((car, index) => car.printAsRecord(index, LINE_WIDTH));
    logLine();
  }

  public getCars = (): Car[] => this.cars;
  public getCar = (id: string): Car | undefined => this.cars.filter((car) => car.id === id)?.[0];
  public isCarAvailable = (carId: string) => !this.reservations[carId];
  public isCarReserved = (carId: string, buyerId: string) => this.reservations[carId] === buyerId;

  private prepareOffer = (car: Car): TOffer => {
    const price = car.price - (car.price * getRandomInt(1, 30)) / 100;
    const additionalCosts = car.additionalCosts - (car.additionalCosts * getRandomInt(1, 10)) / 100;

    return {
      id: v4(),
      sellerId: this.id,
      car,
      price: Math.round(price),
      additionalCosts: Math.round(additionalCosts),
      totalPrice: additionalCosts + price,
    };
  };

  makeReservation = async (carId: string, buyerId: string) => {
    this.reservations[carId] = buyerId;

    await delay(this._reservationTime);
    this.reservations[carId] = undefined;
  };

  bookCar = (carId: string, buyerId: string): TOffer | boolean => {
    const car = this.getCar(carId);
    if (!this.isCarAvailable(carId) || !car) return false;

    const offer = this.prepareOffer(car);
    this.offers[offer.id] = offer;

    this.makeReservation(carId, buyerId);

    return offer;
  };

  showSummary() {
    super.showSummary();

    const title = `${this.getTileWithId()}`.padStart(11);
    const carsCount = config.agents.sellers.startCarsCount - this.cars.length;
    const cash = plnFormatter.format(this.cash).padStart(config.app.lineWidth - (title.length + 117));

    logFramed(`${title} SOLD ${carsCount} car(s) ${''.padEnd(90)}| Cash: ${cash}`);
  }
}

export default Seller;
