import { injectable } from 'inversify';
import { Err, Ok, Result } from '@thames/monads';
import { BASE_CADIDATE_ID, getHeaders, URL_SOLOONS } from '../_utils.js';
import { logger } from '../../../utils/logsHelper.js';
import { SoloonsInterfaceOutgoing } from '../../../core/ports/outgoing/soloons.interface.outgoing.js';
import { ColorSoloonEnum } from '../../../core/models/colorSoloon.enum.js';
import axiosInstance from '../../../utils/axiosRetry.js';

@injectable()
export class Soloons implements SoloonsInterfaceOutgoing {
  public async addSoloon(
    row: number,
    column: number,
    color: ColorSoloonEnum,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Add Soloon: [${row}, ${column}], ${color}`);
      const body = {
        row: row,
        column: column,
        color: color,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.post(URL_SOLOONS, body, {
        headers: getHeaders(),
      });
      return Ok('Added Soloon');
    } catch (error) {
      logger.error(error.response?.data?.message);
      return Err(error.response?.data?.message);
    }
  }

  public async deleteSoloon(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    try {
      logger.info(`Delete Soloon: [${row}, ${column}]`);
      const data = {
        row: row,
        column: column,
        candidateId: BASE_CADIDATE_ID,
      };
      await axiosInstance.delete(URL_SOLOONS, {
        data,
        headers: getHeaders(),
      });
      return Ok('Deleted Soloon');
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
