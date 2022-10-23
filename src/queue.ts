import fastq from 'fastq';
import type { done, queue } from 'fastq';
import { v4 } from 'uuid';

type TTask = {
  id: string;
  action: () => Promise<any>;
};

class Queue {
  q: queue<TTask>;
  tasks: Record<string, Promise<any>> = {};

  constructor() {
    this.q = fastq(this.worker, 1);
  }

  private worker = (task: TTask, cb: done) => {
    this.tasks[task.id] = task.action();
    cb(null);
  };

  public push = (action: TTask['action']) => {
    const id = v4();
    this.q.push({ id, action });
    return id;
  };

  public getTask = (id: string): Promise<any> | undefined => this.tasks[id];
}

export const mainQueue = new Queue();
