import { EXCHANGE_ACTIONS } from '../exchange';
import { Car } from '../products';
import { getRandomInt, logFramed, logLine, plnFormatter } from '../utils';
import { getBestCar } from '../utils/evaluators';
import ExchangeAgent, { ROLE } from './exchange-agent';
import { TOffer } from './seller';

export type TBuyerProps = {
  carsCountGoal: number;
  cash: number;
  id?: string;
  minWait: number;
  maxWait: number;
  maxAttempts: number;
  maxLineWidth: number;
};

class Buyer extends ExchangeAgent {
  private readonly _carsCountGoal;
  private readonly _minWait;
  private readonly _maxWait;
  private readonly _maxAttempts;
  private readonly _maxLineWidth;

  constructor({ id, carsCountGoal, cash, minWait, maxWait, maxAttempts, maxLineWidth }: TBuyerProps) {
    super([], ROLE.BUYER, id);

    this.cash = cash;
    this._carsCountGoal = carsCountGoal;
    this._minWait = minWait;
    this._maxWait = maxWait;
    this._maxAttempts = maxAttempts;
    this._maxLineWidth = maxLineWidth;
  }

  showState() {
    super.showState();

    logFramed(`Wants to buy ${this._carsCountGoal} car(s)`);
    logFramed(`Cash: ${plnFormatter.format(this.cash)}`);
    logLine();
  }

  waitWithDecision = async () => await this.wait(getRandomInt(this._minWait, this._maxWait));

  async start() {
    await super.start();

    let attempts = 1;

    while (this.cars.length < this._carsCountGoal && attempts <= this._maxAttempts) {
      // 2. Ask for cars
      await this.waitWithDecision();
      this.log(`asks for cars #${attempts}`);
      const cars: Car[] = await this.getTaskResult(this.pushTask(this.actions[EXCHANGE_ACTIONS.ASK_FOR_CARS]()));

      // 3. Find best car
      const bestCar = getBestCar(cars, this.cash / (this._carsCountGoal - this.cars.length));
      if (!bestCar) this.log(`is unable to buy any car, will wait [#${attempts}]`);
      await this.waitWithDecision();

      if (bestCar) {
        this.log(`try to buy car [${bestCar.id}]`);
        const carOffer: TOffer = await this.getTaskResult(
          this.pushTask(this.actions[EXCHANGE_ACTIONS.ASK_FOR_CAR]([this.id, bestCar.id])),
        );

        if (!carOffer) {
          this.log(`weren't able to buy car [${bestCar.id}], will look for new one [#${attempts}]`);
        } else {
          await this.waitWithDecision();
          const result: boolean = await this.getTaskResult(
            this.pushTask(
              this.actions[EXCHANGE_ACTIONS.BUY_CAR]([
                this.id,
                carOffer.sellerId,
                carOffer.car.id,
                carOffer.totalPrice.toString(),
              ]),
            ),
          );
          if (result) this.log(`bought car [${bestCar.id}]`);
          else this.log(`didn't buy car [${bestCar.id}]`);
        }
      }

      attempts++;
    }

    this.log(`Exits exchange`);
  }

  showSummary() {
    super.showSummary();

    const space = `${''.padEnd(10, '-')}`;
    const title = `${this.getTileWithId()}`.padEnd(22);
    const carsCount = this.cars.length.toString().padStart(3, '-');
    const cashText = `| Cash: `.padStart(75, '-');
    const cash = plnFormatter.format(this.cash).padStart(24, '-');
    const info = `${title} | ${space} | BOUGHT | ${carsCount} car(s) | ${cashText}${cash}`;

    logFramed(info);
  }
}

export default Buyer;
