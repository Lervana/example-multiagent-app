import { TCarData } from "./car.generator";
import { Car } from "../car/car";

export const getCarsCount = (data: TCarData[]) => {
  let counter = 0;

  data.forEach((carSet) => {
    carSet.generations.forEach((generation) => {
      counter += generation.versions.length;
    });
  });

  return counter;
};

export const carDataToCarsList = (data: TCarData[]): Car[] => {
  const carsList: Car[] = [];

  data.forEach((carSet) => {
    carSet.generations.forEach((generation) => {
      generation.versions.forEach((version) => {
        const car = new Car({
          make: carSet.make,
          model: carSet.model,
          bodyStyle: carSet.bodyStyle,
          yearOfProduction: version.yearOfProduction,
          engineCapacity: version.engineCapacity,
          price: version.avgPrice,
          additionalCosts: 0,
        });

        carsList.push(car);
      });
    });
  });

  return carsList;
};
