export type TConfig = {
  minCarAdditionalCosts: number;
  maxCarAdditionalCosts: number;
  sellersCount: number;
  buyersCount: number;
  sellersCarsCount: number;
  buyersCarsGoal: number;
  minCashPerCar: number;
  maxCashPerCar: number;
};

const config: TConfig = {
  minCarAdditionalCosts: 0,
  maxCarAdditionalCosts: 10000,
  sellersCount: 10,
  buyersCount: 3,
  sellersCarsCount: 8,
  buyersCarsGoal: 3,
  minCashPerCar: 25000,
  maxCashPerCar: 250000,
};

export default config;
