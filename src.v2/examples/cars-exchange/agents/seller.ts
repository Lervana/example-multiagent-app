import delay from 'delay';
import { v4 } from 'uuid';

import { Car } from '../products';
import { getRandomInt, logFramed, logLine, plnFormatter } from '../utils';
import ExchangeAgent, { ROLE } from './exchange-agent';

export type TSellerProps = {
  cars: Car[];
  reservationTime: number;
  id?: string;
  maxLineWidth: number;
  startCarsCount: number;
};

export type TOffer = {
  id: string;
  sellerId: string;
  car: Car;
  price: number;
  additionalCosts: number;
  totalPrice: number;
};

class Seller extends ExchangeAgent {
  private readonly _reservationTime: number;
  private readonly _maxLineWidth: number;
  private offers: Record<string, TOffer> = {};
  private reservations: Record<string, string | undefined> = {};
  private _startCarsCount: number;

  constructor({ id, cars, reservationTime, maxLineWidth, startCarsCount }: TSellerProps) {
    super(cars, ROLE.SELLER, id);
    this._reservationTime = reservationTime;
    this._maxLineWidth = maxLineWidth;
    this._startCarsCount = startCarsCount;
  }

  showState() {
    super.showState();
    this.cars.forEach((car, index) => car.printAsRecord(index, this._maxLineWidth));
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

    const space = `${''.padEnd(10, '-')}`;
    const title = `${this.getTileWithId()}`;
    const carsCount = (this._startCarsCount - this.cars.length).toString().padStart(3, '-');
    const cashText = `| Cash: `.padStart(75, '-');
    const cash = plnFormatter.format(this.cash).padStart(24, '-');
    const info = `${title} | ${space} |  SOLD  | ${carsCount} car(s) | ${cashText}${cash}`;

    logFramed(info);
  }
}

export default Seller;
