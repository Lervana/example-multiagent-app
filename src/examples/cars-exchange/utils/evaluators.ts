import { Car } from '../products';

const evaluateIfNewest = (car: Car, bestYear: number) => car.yearOfProduction === bestYear;
const evaluateIfBestEngine = (car: Car, bestEngine: number) => car.engineCapacity === bestEngine;

const sortByYearOfProduction = (cars: Car[]) =>
  cars.sort((a, b) => {
    if (a.yearOfProduction > b.yearOfProduction) return -1;
    else if (a.yearOfProduction < b.yearOfProduction) return 1;
    return 0;
  });

const sortByEngineCapacity = (cars: Car[]) =>
  cars.sort((a, b) => {
    if (a.engineCapacity > b.engineCapacity) return -1;
    else if (a.engineCapacity < b.engineCapacity) return 1;
    return 0;
  });

const sortByLowestPrice = (cars: Car[]) =>
  cars.sort((a, b) => {
    if (a.totalPrice > b.totalPrice) return 1;
    else if (a.totalPrice < b.totalPrice) return -1;
    return 0;
  });

const evaluateIfAbleToBuy = (cash: number) => (car: Car) => car.totalPrice <= cash;

const filterCars = (cars: Car[], evaluate: (car: Car) => boolean) => {
  const filtered: Car[] = [];
  cars.forEach((car) => evaluate(car) && filtered.push(car));
  return filtered;
};

export const getBestCar = (cars: Car[], cashPerCar: number): Car => {
  // Assumptions:
  // Buyer looks for the NEWEST car that he can afford, then with the biggest engine capacity
  // and the last parameter is to get this car for less price.

  let results = filterCars(cars, evaluateIfAbleToBuy(cashPerCar));
  results = sortByYearOfProduction(results);
  results = filterCars(results, (car) => evaluateIfNewest(car, results[0].yearOfProduction));
  results = sortByEngineCapacity(results);
  results = filterCars(results, (car) => evaluateIfBestEngine(car, results[0].engineCapacity));
  results = sortByLowestPrice(results);

  return results?.[0];
};
