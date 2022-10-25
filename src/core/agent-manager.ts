import fastq, { done, queue } from 'fastq';
import { v4 } from 'uuid';

import Agent from './agent';

export type TAction = () => Promise<any>;

export type TTask = {
  id: string;
  action: TAction;
};

class AgentManager {
  private agents: Agent[] = [];
  private q: queue<TTask>;
  private results: Record<string, Promise<any>> = {};

  constructor(agents: Agent[]) {
    this.q = fastq(this.worker, 1);
    this.agents = agents;

    this.agents.forEach((agent) => {
      agent.push = this.pushToQueue;
      agent.getResult = this.getResult;
    });
  }

  private worker = (task: TTask, cb: done) => {
    this.results[task.id] = task.action();
    cb(null);
  };

  private pushToQueue = (action: TAction) => {
    const id = v4();
    this.q.push({ id, action });
    return id;
  };

  private getResult = (id: string) => {
    return this.results[id];
  };

  showAgentsState() {
    this.agents.forEach((agent) => agent.showState());
  }

  async start() {
    await Promise.all(this.agents.map((agent) => agent.start()));
  }
}

export default AgentManager;
