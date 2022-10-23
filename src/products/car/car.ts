import delay from 'delay';
import { v4 } from 'uuid';

import config from '../../config';
import { LINE, plnFormatter } from '../../utils';

const MODEL_LINE_LENGTH = LINE.length - 133;

export class Car {
  public id: string;
  public ownerId: string;
  public make: string;
  public model: string;
  public bodyStyle: string;
  public engineCapacity: number;
  public yearOfProduction: number;
  public price: number;
  public additionalCosts: number;
  private bookTime: number;
  private bookedFor: string | undefined;

  constructor(
    ownerId: string,
    make: string,
    model: string,
    bodyStyle: string,
    engineCapacity: number,
    yearOfProduction: number,
    price: number,
    additionalCosts: number,
    bookTime: number,
  ) {
    this.id = v4();
    this.ownerId = ownerId;
    this.make = make;
    this.model = model;
    this.bodyStyle = bodyStyle;
    this.engineCapacity = engineCapacity;
    this.yearOfProduction = yearOfProduction;
    this.price = price;
    this.additionalCosts = additionalCosts;
    this.bookTime = bookTime;
  }

  public printAsRecord = (index: string) => {
    const id = index.padStart(2);
    const uuid = this.id.padStart(36);
    const a = this.make.padEnd(15);
    const b = this.model.padEnd(MODEL_LINE_LENGTH);
    const c = this.bodyStyle.padEnd(15);
    const d = this.engineCapacity.toString().padStart(5);
    const e = this.yearOfProduction.toString().padStart(5);
    const f = plnFormatter.format(this.price).padStart(15);
    const g = plnFormatter.format(this.additionalCosts).padStart(12);

    console.log(`| ${id} | ${uuid} | ${a} | ${b} | ${c} | ${d} | ${e} | ${f} | ${g} |`);
  };

  public isBooked = () => !!this.bookedFor;
  public isBookedFor = (buyerId: string) => this.bookedFor === buyerId;

  public book = async (buyerId: string, onBookEnd?: () => void) => {
    this.bookedFor = buyerId;
    await delay(this.bookTime);
    this.bookedFor = undefined;
    onBookEnd?.();
  };
}

export type TCar = typeof Car;
