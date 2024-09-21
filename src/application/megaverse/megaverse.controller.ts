import { controller, httpGet, httpPost } from 'inversify-express-utils';
import * as express from 'express';
import { logger } from '../../utils/logsHelper.js';
import { MegaverseControllerModel } from './models/megaverse.controller.model.js';
import buildQueue from '../../infrastructure/queues/bull/queue.js';

@controller('/megaverse')
export class MegaverseController {
  @httpPost('/build')
  public async buildMegaverse(req: express.Request, res: express.Response) {
    try {
      const { megaverse }: MegaverseControllerModel = req.body;

      const job = await buildQueue.add({ megaverse });

      return res
        .status(202)
        .json({ message: 'Task is being processed', jobId: job.id });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }

  @httpGet('/job/:id')
  public async checkJobStatus(req: express.Request, res: express.Response) {
    const jobId = req.params.id;

    try {
      const job = await buildQueue.getJob(jobId);

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const jobStatus = {
        id: job.id,
        name: job.name,
        status: await job.getState(),
        progress: job.progress(),
        data: job.data,
        finishedOn: job.finishedOn,
        failedReason: job.failedReason,
      };

      return res.status(200).json(jobStatus);
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
}
