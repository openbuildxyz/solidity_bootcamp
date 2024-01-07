import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";
import { Loading } from "../plugins/Loading";

export class GameEventWalletConnected extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventWalletConnected";

  public get subject(): string {
    return GameEventWalletConnected.event;
  }

  public async exec(address: string) {
    Loading.open();
    await playerData.getPlayerData(address, true);
    Loading.close();
  }
}
