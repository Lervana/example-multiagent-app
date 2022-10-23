import { v4 } from "uuid";
import { Car } from "../products/car/car";

const LINE = "".padEnd(109, "-");

export enum ROLE {
  seller,
  buyer,
}

class Agent {
  public id: string;
  protected cash = 0;
  protected cars: Car[] = [];
  protected role: ROLE = ROLE.seller;

  constructor(cars: Car[], role: ROLE) {
    this.id = v4();
    this.cars = cars;
    this.role = role;
  }

  show = (index: number) => {
    const info = ` [${index}]`;

    console.log(LINE);
    console.log(`| ${info.padEnd(68)} ${this.id} |`);

    //
    //
    //
    //
    // console.log(LINE);
    // this.cars.forEach((car, index) =>
    //   car.printAsRecord((index + 1).toString())
    // );
    // console.log(LINE);
    //console.log(`Seller ${this.id} joined exchange`);
  };

  start = async () => {};
}

export default Agent;
