import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";

export class GameEventBuyParkings extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventBuyParkings";

  public get subject(): string {
    return GameEventBuyParkings.event;
  }

  public async exec(to: string, tokenIds: number[]) {
    await playerData.getPlayerData(to, true);
  }
}
