import { injectable } from 'inversify';
import { Err, Ok, Result } from '@thames/monads';
import { logger } from '../../../utils/logsHelper.js';
import { BASE_CADIDATE_ID, getHeaders, URL_COMETH } from '../_utils.js';
import { ComethsInterfaceOutgoing } from '../../../core/ports/outgoing/comeths.interface.outgoing.js';
import { DirectionComethEnum } from '../../../core/models/directionCometh.enum.js';
import axiosInstance from '../../../utils/axiosRetry.js';

@injectable()
export class Comeths implements ComethsInterfaceOutgoing {
  public async addCometh(
    row: number,
    column: number,
    direction: DirectionComethEnum,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Add Cometh: [${row}, ${column}] , ${direction}`);
      const body = {
        row: row,
        column: column,
        direction: direction,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.post(URL_COMETH, body, { headers: getHeaders() });
      return Ok('Added Cometh');
    } catch (error) {
      logger.error(error.response?.data?.message);
      return Err(error.response?.data?.message);
    }
  }

  public async deleteCometh(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Delete Cometh: [${row}, ${column}]`);
      const data = {
        row: row,
        column: column,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.delete(URL_COMETH, {
        data,
        headers: getHeaders(),
      });
      return Ok('Added Cometh');
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
