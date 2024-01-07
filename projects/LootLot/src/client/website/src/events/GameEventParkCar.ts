import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";

export class GameEventParkCar extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventParkCar";

  public get subject(): string {
    return GameEventParkCar.event;
  }

  public async exec(who: string, carTokenId: number, parkTokenId: number) {
    await playerData.getPlayerData(who, true);
  }
}
