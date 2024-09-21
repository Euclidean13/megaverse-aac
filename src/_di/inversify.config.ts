import { Container } from 'inversify';
import { MegaverseOrchestrator } from '../core/orchestrators/megaverse.orchestrator.js';
import { PolyanetsInterfaceOutgoing } from '../core/ports/outgoing/polyanets.interface.outgoing.js';
import { PolyanetsInterfaceUsecase } from '../core/usecases/polyanets/polyanets.interface.usecase.js';
import { PolyantesUsecase } from '../core/usecases/polyanets/polyanets.usecase.js';
import { Polyanets } from '../infrastructure/apis/polyanets/polyanets.js';
import { TYPES } from './types.js';
import { SoloonsInterfaceOutgoing } from '../core/ports/outgoing/soloons.interface.outgoing.js';
import { Soloons } from '../infrastructure/apis/soloons/soloons.js';
import { ComethsInterfaceOutgoing } from '../core/ports/outgoing/comeths.interface.outgoing.js';
import { Comeths } from '../infrastructure/apis/comeths/comeths.js';
import { SoloonsInterfaceUsecase } from '../core/usecases/soloons/soloons.interface.usecase.js';
import { SoloonsUsecase } from '../core/usecases/soloons/soloons.usecase.js';
import { ComethsInterfaceUsecase } from '../core/usecases/comeths/comeths.interface.usecase.js';
import { ComethsUsecase } from '../core/usecases/comeths/comeths.usecase.js';
import { MegaverseInterfaceIncoming } from '../core/ports/incoming/megaverse.interface.incoming.js';
import { BuildMegaverseJob } from '../infrastructure/queues/bull/jobs/buildMegaverse.job.js';

const container = new Container();

// APPLICATION
// CORE
// -- PORTS
// ---- INCOMING
container
  .bind<MegaverseInterfaceIncoming>(TYPES.megaverseInterfaceIncoming)
  .to(MegaverseOrchestrator);
// ---- OUTGOING
container
  .bind<PolyanetsInterfaceOutgoing>(TYPES.polyanetsInterfaceOutgoing)
  .to(Polyanets);
container
  .bind<SoloonsInterfaceOutgoing>(TYPES.soloonsInterfaceOutgoing)
  .to(Soloons);
container
  .bind<ComethsInterfaceOutgoing>(TYPES.comethsInterfaceOutgoing)
  .to(Comeths);
// -- USECASES
container
  .bind<PolyanetsInterfaceUsecase>(TYPES.polyanetsInterfaceUsecase)
  .to(PolyantesUsecase);
container
  .bind<SoloonsInterfaceUsecase>(TYPES.soloonsInterfaceUsecase)
  .to(SoloonsUsecase);
container
  .bind<ComethsInterfaceUsecase>(TYPES.comethsInterfaceUsecase)
  .to(ComethsUsecase);
// INFRASTRUCTURE
container.bind(BuildMegaverseJob).toSelf();

export { container };
