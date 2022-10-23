import { Car } from '../car/car';
import { TCarData } from './car.generator';

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
        const car = new Car(
          '',
          carSet.make,
          carSet.model,
          carSet.bodyStyle,
          version.yearOfProduction,
          version.engineCapacity,
          version.avgPrice,
          0,
          0,
        );

        carsList.push(car);
      });
    });
  });

  return carsList;
};
