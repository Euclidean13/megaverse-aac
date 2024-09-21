export class MegaverseControllerModel {
  megaverse: string[][];

  public constructor(init?: Partial<MegaverseControllerModel>) {
    Object.assign(this, init);
  }
}
