export type TConfig = {
  minCarAdditionalCosts: number;
  maxCarAdditionalCosts: number;
  sellersCount: number;
  buyersCount: number;
  sellersCarsCount: number;
  buyersCarsGoal: number;
  minCashPerCar: number;
  maxCashPerCar: number;
  lineWidth: number;
  bookTime: number;
  maxCarBuyAttempts: number;
};

const config: TConfig = {
  minCarAdditionalCosts: 0,
  maxCarAdditionalCosts: 10000,
  sellersCount: 10,
  buyersCount: 3,
  sellersCarsCount: 8,
  buyersCarsGoal: 3,
  minCashPerCar: 5000,
  maxCashPerCar: 150000,
  lineWidth: 150,
  bookTime: 2000,
  maxCarBuyAttempts: 10,
};

export default config;
