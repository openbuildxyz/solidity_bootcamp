import { walletData } from "../data/WalletData";
import { GameEventBase } from "./GameEventBase";

export class GameEventWalletAccountChanged extends GameEventBase {
  public static readonly event: string =
    "game.logic.GameEventWalletAccountChanged";

  public get subject(): string {
    return GameEventWalletAccountChanged.event;
  }

  public async exec(account: string) {
    Promise.resolve();
  }
}
