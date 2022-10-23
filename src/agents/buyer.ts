import Agent, { ROLE } from "./agent";
import { delay, getRandomInt } from "../utils";

class Buyer extends Agent {
  private carsNeed = 0;

  constructor(carsNeed: number, minCashPerCar: number, maxCashPerCar: number) {
    super([], ROLE.buyer);
    this.carsNeed = carsNeed;
    this.cash = carsNeed * getRandomInt(minCashPerCar, maxCashPerCar);
  }

  show = (index: number) => {
    const line = "".padEnd(104, "-");
    const info = `Buyer [${index}]`;

    console.log(line);
    console.log(`| ${info.padEnd(63)} ${this.id} |`);
    console.log(line);
    console.log(`| Wants to buy ${this.carsNeed} car(s)`.padEnd(103) + "|");
    console.log(line);
  };

  start = async () => {
    console.log(`Buyer ${this.id} joined exchange`);

    await delay(getRandomInt(1000, 5000));
    console.log(`Buyer ${this.id} asks for offers`);
    const offers = [];
  };
}

export default Buyer;
