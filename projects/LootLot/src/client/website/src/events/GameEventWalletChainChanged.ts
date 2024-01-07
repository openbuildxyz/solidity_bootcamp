import { walletData } from "../data/WalletData";
import { GameEventBase } from "./GameEventBase";

export class GameEventWalletChainChanged extends GameEventBase {
  public static readonly event: string =
    "game.logic.GameEventWalletChainChanged";

  public get subject(): string {
    return GameEventWalletChainChanged.event;
  }

  public async exec(chainId: number) {
    Promise.resolve();
  }
}
