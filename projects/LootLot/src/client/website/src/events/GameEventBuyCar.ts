import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";

export class GameEventBuyCar extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventBuyCar";

  public get subject(): string {
    return GameEventBuyCar.event;
  }

  public async exec(to: string, tokenId: number, account: string) {
    await playerData.getPlayerData(to, true);
  }
}
