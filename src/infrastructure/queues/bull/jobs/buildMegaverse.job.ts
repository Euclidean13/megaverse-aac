import buildQueue from '../queue.js';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../_di/types.js';
import { MegaverseInterfaceIncoming } from '../../../../core/ports/incoming/megaverse.interface.incoming.js';
import { logger } from '../../../../utils/logsHelper.js';

@injectable()
class BuildMegaverseJob {
  constructor(
    @inject(TYPES.megaverseInterfaceIncoming)
    private megaverseInterfaceIncoming: MegaverseInterfaceIncoming,
  ) {
    this.processJobs();
  }

  private processJobs() {
    logger.info('Job processor started');
    buildQueue.process(async (job, done) => {
      try {
        const { megaverse } = job.data;
        const result =
          await this.megaverseInterfaceIncoming.buildMegaverse(megaverse);

        if (result.isOk()) {
          logger.info(`Megaverse build completed: ${result.ok().unwrap()}`);
        } else {
          logger.warn(`Megaverse build failed: ${result.err().unwrap()}`);
        }

        done();
      } catch (error) {
        logger.error('Error processing job', error);
        done(error);
      }
    });
  }
}

export { BuildMegaverseJob };
