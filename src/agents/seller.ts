import Agent, { ROLE } from "./agent";
import { Car } from "../products/car/car";

class Seller extends Agent {
  constructor(cars: Car[]) {
    super([], ROLE.seller);
  }

  // start = async () => {};
}

export default Seller;
