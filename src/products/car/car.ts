import { plnFormatter } from "../../utils";

export type TCarProps = {
  make: string;
  model: string;
  bodyStyle: string;
  engineCapacity: number;
  yearOfProduction: number;
  price: number;
  additionalCosts: number;
};

export class Car {
  public make: string = "";
  public model: string = "";
  public bodyStyle: string = "";
  public engineCapacity: number = 0;
  public yearOfProduction: number = 0;
  public price: number = 0;
  public additionalCosts: number = 0;

  constructor({
    make,
    model,
    bodyStyle,
    engineCapacity,
    yearOfProduction,
    price,
    additionalCosts,
  }: TCarProps) {
    this.make = make;
    this.model = model;
    this.bodyStyle = bodyStyle;
    this.engineCapacity = engineCapacity;
    this.yearOfProduction = yearOfProduction;
    this.price = price;
    this.additionalCosts = additionalCosts;
  }

  printAsRecord = (index: string) => {
    const id = index.padStart(2);
    const a = this.make.padEnd(15);
    const b = this.model.padEnd(15);
    const c = this.bodyStyle.padEnd(15);
    const d = this.engineCapacity.toString().padStart(5);
    const e = this.yearOfProduction.toString().padStart(5);
    const f = plnFormatter.format(this.price).padStart(15);
    const g = plnFormatter.format(this.additionalCosts).padStart(12);

    console.log(`| ${id} | ${a} | ${b} | ${c} | ${d} | ${e} | ${f} | ${g} |`);
  };
}

export type TCar = typeof Car;
