import delay from 'delay';
import { v4 } from 'uuid';

import { TAction } from './agent-manager';

class Agent {
  private _push?: (taskAction: TAction) => string;
  private _getResult?: (id: string) => Promise<any>;
  private _actions: Record<string, (args?: string[]) => TAction>;
  public id: string;

  constructor(id?: string) {
    this.id = id ?? v4();
    this._actions = {};
  }

  public set push(action: (taskAction: TAction) => string) {
    this._push = action;
  }

  public set getResult(action: (id: string) => Promise<any>) {
    this._getResult = action;
  }

  public set actions(actions: Record<string, (args?: string[]) => TAction>) {
    this._actions = actions;
  }

  public get actions() {
    return this._actions;
  }

  protected pushTask = (taskAction: TAction) => this._push?.(taskAction) ?? '';
  protected getTaskResult = (id: string) => this._getResult?.(id);

  protected async wait(ms: number) {
    await delay(ms);
  }

  showState() {}
  async start() {}
}

export default Agent;
