import config from "../../config";
import { getRandomInt } from "../../utils";
import { Car } from "../car/car";

const MIN_CAR_ADDITIONAL_COSTS = config.minCarAdditionalCosts;
const MAX_CAR_ADDITIONAL_COSTS = config.maxCarAdditionalCosts;

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

export const generateCars = (carsList: Car[], count: number): Car[] => {
  const cars: Car[] = [];

  for (let x = 0; x < count; x++) {
    const carRandomIndex = getRandomInt(0, carsList.length - 1);
    const car = carsList[carRandomIndex];
    const randomCar = new Car({
      make: car.make,
      model: car.model,
      bodyStyle: car.bodyStyle,
      yearOfProduction: car.yearOfProduction,
      engineCapacity: car.engineCapacity,
      price: getRandomInt(car.price * 0.5, car.price * 1.5),
      additionalCosts: getRandomInt(
        MIN_CAR_ADDITIONAL_COSTS,
        MAX_CAR_ADDITIONAL_COSTS
      ),
    });

    cars.push(randomCar);
  }

  return cars;
};