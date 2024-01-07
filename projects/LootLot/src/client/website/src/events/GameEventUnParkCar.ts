import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";

export class GameEventUnParkCar extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventUnParkCar";

  public get subject(): string {
    return GameEventUnParkCar.event;
  }

  public async exec(who: string, carTokenId: number, parkTokenId: number) {
    await playerData.getPlayerData(who, true);
  }
}
