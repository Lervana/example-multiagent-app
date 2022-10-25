import { getRandomInt } from '../utils';
import { Car } from './index';

export type TVersion = {
  yearOfProduction: number;
  engineCapacity: number;
  avgPrice: number;
};

export type TGeneration = {
  name: string;
  versions: TVersion[];
};

export type TCarData = {
  make: string;
  model: string;
  bodyStyle: string;
  generations: TGeneration[];
};

export type TProduceOptions = {
  priceChangeFactor: {
    min: number;
    max: number;
  };
  additionalCosts: {
    min: number;
    max: number;
  };
};

class CarFactory {
  private readonly parsedCarsData: Car[];
  private readonly parsedCarsCount: number = 0;

  constructor(carsData: TCarData[]) {
    this.parsedCarsData = this.parseCarsData(carsData);
    this.parsedCarsCount = this.parsedCarsData.length;
  }

  private parseCarsData = (carsData: TCarData[]): Car[] => {
    const cars: Car[] = [];

    carsData.forEach((carSet) => {
      carSet.generations.forEach((generation) => {
        generation.versions.forEach((version) => {
          cars.push(
            new Car({
              make: carSet.make,
              model: carSet.model,
              bodyStyle: carSet.bodyStyle,
              yearOfProduction: version.yearOfProduction,
              engineCapacity: version.engineCapacity,
              price: version.avgPrice,
            }),
          );
        });
      });
    });

    return cars;
  };

  public printParsedCars = () => {
    this.parsedCarsData.forEach((car, index) => car.printAsShortRecord(index + 1));
  };

  public produce = ({ priceChangeFactor, additionalCosts }: TProduceOptions): Car => {
    const carRandomIndex = getRandomInt(0, this.parsedCarsCount - 1);
    const car = this.parsedCarsData[carRandomIndex];
    return new Car({
      ...car.getParameters(),
      price: getRandomInt(car.price * (priceChangeFactor.min ?? 0.5), car.price * (priceChangeFactor.max ?? 1.5)),
      additionalCosts: getRandomInt(additionalCosts.min, additionalCosts.max),
    });
  };

  public produceSeries = (count: number, options: TProduceOptions) => {
    const cars: Car[] = [];
    for (let x = 0; x < count; x++) cars.push(this.produce(options));
    return cars;
  };

  public getCarsDataCount = () => this.parsedCarsCount;
}

export default CarFactory;
