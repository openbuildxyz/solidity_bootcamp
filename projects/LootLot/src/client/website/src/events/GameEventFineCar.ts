import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";
import { walletData } from "../data/WalletData";

export class GameEventFineCar extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventFineCar";

  public get subject(): string {
    return GameEventFineCar.event;
  }

  public async exec(who: string, carTokenId: number, parkTokenId: number) {
    await playerData.getPlayerData(walletData.address, true);
  }
}
