import { playerData } from "../data/PlayerData";
import { GameEventBase } from "./GameEventBase";
import { Loading } from "../plugins/Loading";
import { GO_HOME } from "../const/Constants";
import { homeData } from "../data/HomeData";

export class GameEventGoFriendHome extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventGoFriendHome";

  public get subject(): string {
    return GameEventGoFriendHome.event;
  }

  public async exec(address: string) {
    if (address !== GO_HOME) {
      Loading.open();
      await playerData.getPlayerData(address, true);
      Loading.close();
    }

    homeData.onChangeScene(address);

    return Promise.resolve();
  }
}
