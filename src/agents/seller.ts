import { v4 } from 'uuid';

import config from '../config';
import { generateCars } from '../products';
import { Car } from '../products/car/car';
import { LINE, getRandomInt, plnFormatter } from '../utils';
import Agent, { ROLE } from './agent';

export type TOffer = {
  id: string;
  car: Car;
  price: number;
  additionalCosts: number;
  totalPrice: number;
};

const SOLD_INFO_LENGTH = config.lineWidth - 4;

class Seller extends Agent {
  private offers: Record<string, TOffer> = {};

  constructor(carsList: Car[]) {
    super([], ROLE.SELLER);
    this.cars.push(...generateCars(this.id, carsList, config.sellersCarsCount));
  }

  showInfo(index: number) {
    super.showInfo(index);

    this.cars.forEach((car, index) => car.printAsRecord((index + 1).toString()));

    console.log(LINE);
  }

  showSummary(index: number) {
    const info = `[${this.id}] Sold ${config.sellersCarsCount - this.cars.length} cars | Cash: ${plnFormatter.format(
      this.cash,
    )}.`;
    console.log(`| ${info.padEnd(SOLD_INFO_LENGTH)} |`);
  }

  getCars = (): Car[] => this.cars;
  getCar = (id: string): Car | undefined => this.cars.filter((car) => car.id === id)?.[0];
  isCarAvailable = (carId: string) => !this.getCar(carId)?.isBooked();
  isCarReserved = (carId: string, buyerId: string) => this.getCar(carId)?.isBookedFor(buyerId);

  bookCar = (carId: string, buyerId: string): TOffer | boolean => {
    const car = this.getCar(carId);
    if (car?.isBooked() || !car) return false;

    const price = car.price - (car.price * getRandomInt(1, 30)) / 100;
    const additionalCosts = car.additionalCosts - (car.additionalCosts * getRandomInt(1, 10)) / 100;

    const offer: TOffer = {
      id: v4(),
      car,
      price: Math.round(price),
      additionalCosts: Math.round(additionalCosts),
      totalPrice: additionalCosts + price,
    };

    this.offers[offer.id] = offer;

    car.book(buyerId, () => delete this.offers[offer.id]);

    return offer;
  };
}

export default Seller;
