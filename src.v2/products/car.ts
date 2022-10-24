import { v4 } from 'uuid';

import { plnFormatter } from '../utils';

const ID_COLUMN = 3;
const UUID_COLUMN = 36;
const MAKE_COLUMN = 15;
const MODEL_COLUMN = 20;
const BODY_STYLE_COLUMN = 15;
const ENGINE_COLUMN = 4;
const YEAR_COLUMN = 4;
const PRICE_COLUMN = 15;
const ADDITIONAL_COST_COLUMN = 12;

export type TCarProps = {
  make: string;
  model: string;
  bodyStyle: string;
  engineCapacity: number;
  yearOfProduction: number;
  price?: number;
  additionalCosts?: number;
};

class Car {
  private _id: string;
  private readonly _make: TCarProps['make'];
  private readonly _model: TCarProps['model'];
  private readonly _bodyStyle: TCarProps['bodyStyle'];
  private readonly _engineCapacity: TCarProps['engineCapacity'];
  private readonly _yearOfProduction: TCarProps['yearOfProduction'];
  private readonly _price: number;
  private readonly _additionalCosts: number;

  constructor({ make, model, bodyStyle, engineCapacity, yearOfProduction, price, additionalCosts }: TCarProps) {
    this._id = v4();
    this._make = make;
    this._model = model;
    this._bodyStyle = bodyStyle;
    this._engineCapacity = engineCapacity;
    this._yearOfProduction = yearOfProduction;
    this._price = price ?? 0;
    this._additionalCosts = additionalCosts ?? 0;
  }

  public printAsRecord = (rowIndex: number, lineWidth: number) => {
    if (
      lineWidth <
      ID_COLUMN +
        UUID_COLUMN +
        MAKE_COLUMN +
        MODEL_COLUMN +
        BODY_STYLE_COLUMN +
        ENGINE_COLUMN +
        YEAR_COLUMN +
        PRICE_COLUMN +
        ADDITIONAL_COST_COLUMN +
        28
    )
      throw new Error('Unable to print car - line width is to short');

    const id = rowIndex.toString().padStart(ID_COLUMN);
    const uuid = this._id.padStart(UUID_COLUMN);
    const a = this._make.padEnd(MAKE_COLUMN);
    const b = this._model.padEnd(MODEL_COLUMN);
    const c = this._bodyStyle.padEnd(BODY_STYLE_COLUMN);
    const d = this._engineCapacity.toString().padStart(ENGINE_COLUMN);
    const e = this._yearOfProduction.toString().padStart(YEAR_COLUMN);
    const f = plnFormatter.format(this._price).padStart(PRICE_COLUMN);
    const g = plnFormatter.format(this._additionalCosts).padStart(ADDITIONAL_COST_COLUMN);

    const row = `| ${id} | ${uuid} | ${a} | ${b} | ${c} | ${d} | ${e} | ${f} | ${g} |`;
    console.log(row);
  };

  public printAsShortRecord = (rowIndex: number) => {
    const id = rowIndex.toString().padStart(3);
    const row = `${id} - ${this._make} | ${this._model} | ${this._bodyStyle} | ${this._engineCapacity} | ${this._yearOfProduction} |`;
    console.log(row);
  };

  public getParameters = (): Omit<TCarProps, 'price' | 'additionalCosts'> => {
    return {
      make: this._make,
      model: this._model,
      bodyStyle: this._bodyStyle,
      engineCapacity: this._engineCapacity,
      yearOfProduction: this._yearOfProduction,
    };
  };

  get id() {
    return this._id;
  }

  get price() {
    return this._price;
  }

  get additionalCosts() {
    return this._additionalCosts;
  }

  get yearOfProduction() {
    return this._yearOfProduction;
  }

  get engineCapacity() {
    return this._yearOfProduction;
  }

  get totalPrice() {
    return this._price + this._additionalCosts;
  }
}

export default Car;
