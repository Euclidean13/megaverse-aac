import { Err, Ok, type Result } from '@thames/monads';
import { injectable } from 'inversify';
import { PolyanetsInterfaceOutgoing } from '../../../core/ports/outgoing/polyanets.interface.outgoing.js';
import { logger } from '../../../utils/logsHelper.js';
import { BASE_CADIDATE_ID, getHeaders, URL_POLYANETS } from '../_utils.js';
import axiosInstance from '../../../utils/axiosRetry.js';

@injectable()
export class Polyanets implements PolyanetsInterfaceOutgoing {
  public async addPolyanet(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Add Polyanet: [${row}, ${column}]`);
      const body = {
        row: row,
        column: column,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.post(URL_POLYANETS, body, {
        headers: getHeaders(),
      });
      return Ok('Added Polyanet');
    } catch (error) {
      logger.error(error.response?.data?.message);
      return Err(error.response?.data?.message);
    }
  }

  public async deletePolyanet(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Delete Polyplanet: [${row}, ${column}]`);
      const data = {
        row: row,
        column: column,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.delete(URL_POLYANETS, {
        data,
        headers: getHeaders(),
      });
      return Ok('Deleted Polyplanet');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ??
        error.message ??
        'An unexpected error occurred.';
      logger.error(errorMessage);
      return Err(errorMessage);
    }
  }
}
