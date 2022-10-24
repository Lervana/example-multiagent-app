export type TConfig = {
  app: {
    lineWidth: number;
  };
  agents: {
    sellers: {
      count: number;
      startCarsCount: number;
      carBookTime: number;
    };
    buyers: {
      count: number;
      carsGoal: number;
      minCashPerCar: number;
      maxCashPerCar: number;
      maxCarBuyAttempts: number;
    };
    minDecisionWait: number;
    maxDecisionWait: number;
  };
  cars: {
    priceChangeFactor: {
      min: number;
      max: number;
    };
    additionalCosts: {
      min: number;
      max: number;
    };
  };
};

const config: TConfig = {
  app: {
    lineWidth: 152,
  },
  agents: {
    sellers: {
      count: 10,
      startCarsCount: 8,
      carBookTime: 2000,
    },
    buyers: {
      count: 3,
      carsGoal: 3,
      maxCarBuyAttempts: 10,
      minCashPerCar: 5000,
      maxCashPerCar: 100000,
    },
    minDecisionWait: 100,
    maxDecisionWait: 1000,
  },
  cars: {
    priceChangeFactor: {
      min: 0.5,
      max: 1.5,
    },
    additionalCosts: {
      min: 0,
      max: 10000,
    },
  },
};

export default config;
