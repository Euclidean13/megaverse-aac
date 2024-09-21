import { Result } from '@thames/monads';

export interface MegaverseInterfaceIncoming {
  buildMegaverse(pattern: string[][]): Promise<Result<string, string[]>>;
}
