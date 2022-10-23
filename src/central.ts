import Seller from "./agents/seller";
import { carDataToCarsList, generateCars, TCarData } from "./products";
import Buyer from "./agents/buyer";
import carsData from "./data/cars.json";
import config from "./config";
import { log } from "./utils";

export class Central {
  sellers: Seller[] = [];
  buyers: Buyer[] = [];

  constructor() {
    const carsList = carDataToCarsList(carsData);

    for (let x = 0; x < config.sellersCount; x++) {
      const cars = generateCars(carsList, config.sellersCarsCount);
      this.sellers.push(new Seller(cars));
    }

    for (let x = 0; x < config.buyersCount; x++) {
      this.buyers.push(
        new Buyer(
          config.buyersCarsGoal,
          config.minCashPerCar,
          config.maxCashPerCar
        )
      );
    }
  }

  listSellers = () => {
    this.sellers.forEach((seller, index) => seller.show(index + 1));
  };

  listBuyers = () => {
    this.buyers.forEach((buyer, index) => buyer.show(index + 1));
  };

  startExchange = async () => {
    log("Exchange opened!");

    const workers = [
      ...this.sellers.map((seller) => seller.start()),
      ...this.buyers.map((seller) => seller.start()),
    ];

    await Promise.all(workers);

    log("Exchange closed!");
  };
}
