import { Queue as BullMQQueue, Job, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis.default({ maxRetriesPerRequest: null });

class Queue {
  private name: string = "video-processing";
  private client: BullMQQueue;

  constructor() {
    //@ts-ignore
    this.client = new BullMQQueue(this.name, { connection });
  }

  async add(name: string, data: any) {
    await this.client.add(name, data);
  }

  async work(name: string, handler: (job: Job) => Promise<void>) {
    //@ts-ignore
    new Worker(this.name, handler, { connection: connection });
  }
}

const queue = new Queue();

export default queue;