import { Agent, Buyer, Seller } from './agents';
import { TOffer } from './agents/seller';
import config from './config';
import { TCarData, carDataToCarsList } from './products';
import { Car } from './products/car/car';
import { mainQueue } from './queue';
import { LINE, log } from './utils';

type TTransaction = {
  sellerId: string;
  buyerId: string;
  offer: TOffer;
};

export class Core {
  agents: Agent[] = [];
  transactions: TTransaction[] = [];

  constructor(carsData: TCarData[]) {
    const carsList = carDataToCarsList(carsData);

    for (let x = 0; x < config.sellersCount; x++) {
      this.agents.push(new Seller(carsList));
    }

    for (let x = 0; x < config.buyersCount; x++) {
      this.agents.push(
        new Buyer(
          config.buyersCarsGoal,
          config.minCashPerCar,
          config.maxCashPerCar,
          config.bookTime,
          config.maxCarBuyAttempts,
        ),
      );
    }
  }

  showInitialState = () => {
    this.agents.forEach((agent, index) => agent.showInfo(index + 1));
  };

  getAgent = (id: string) => this.agents.filter((a) => a.id === id)?.[0];

  registerToExchange = (titleWithId: string) => {
    return mainQueue.push(async () => {
      log(`${titleWithId} joined exchange`);
    });
  };

  getResult = (id: string) => mainQueue.getTask(id);

  askForCars = () => {
    return mainQueue.push(async () => {
      const cars: Car[] = [];

      for (const agent of this.agents) {
        if (agent.isSeller()) cars.push(...(agent as Seller).getCars());
      }

      return cars;
    });
  };

  askForCar = (carId: string, ownerId: string, buyerId: string) => {
    return mainQueue.push(async () => {
      const owner = this.getAgent(ownerId);
      if (owner && owner.isSeller()) {
        const seller = owner as Seller;
        if (seller.isCarAvailable(carId)) return seller.bookCar(carId, buyerId);
      }

      return false;
    });
  };

  buyCar = (offer: TOffer, buyerId: string) => {
    return mainQueue.push(async () => {
      const seller = this.getAgent(offer.car.ownerId) as Seller;
      const buyer = this.getAgent(buyerId) as Buyer;

      if (buyer?.isSeller() || !seller?.isSeller()) return false;

      if (seller.isCarReserved(offer.car.id, buyerId)) {
        buyer.reduceCash(offer.totalPrice);
        seller.addCash(offer.totalPrice);
        buyer.addCar(offer.car);
        seller.removeCar(offer.car);
        this.transactions.push({
          sellerId: seller.id,
          buyerId: buyerId,
          offer: offer,
        });
        return true;
      }

      return false;
    });
  };

  startExchange = async () => {
    log('Exchange opened!');
    await Promise.all(
      this.agents.map((agent) =>
        agent.start({
          registerToExchange: this.registerToExchange,
          askForCars: this.askForCars,
          getResult: this.getResult,
          askForCar: this.askForCar,
          buyCar: this.buyCar,
        }),
      ),
    );
    log('Exchange closed!');

    console.log(LINE);
    console.log(`| Results `.padEnd(config.lineWidth - 1) + '|');
    console.log(LINE);
    this.agents.forEach((agent, index) => agent.showSummary(index));
    console.log(LINE);

    console.log();
    console.log();
    console.log(LINE);
    console.log(`| Transactions `.padEnd(config.lineWidth - 1) + '|');
    console.log(LINE);
    this.transactions.forEach((t) => {
      const info = `${t.sellerId} -> ${t.buyerId} | ${t.offer.car.make} ${t.offer.car.model} ${t.offer.car.yearOfProduction} ${t.offer.car.engineCapacity} | ${t.offer.price} | ${t.offer.additionalCosts} | ${t.offer.totalPrice}`;
      console.log(`| ${info} |`);
    });
    console.log(LINE);
  };
}
