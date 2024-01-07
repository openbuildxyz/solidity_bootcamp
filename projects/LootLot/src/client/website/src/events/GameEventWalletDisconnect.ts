import { walletData } from "../data/WalletData";
import { GameEventBase } from "./GameEventBase";

export class GameEventWalletDisconnect extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventWalletDisconnect";

  public get subject(): string {
    return GameEventWalletDisconnect.event;
  }

  public async exec() {
    Promise.resolve();
  }
}
