import { GameEventBase } from "./GameEventBase";

export class GameEventModalOpen extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventModalOpen";

  public get subject(): string {
    return GameEventModalOpen.event;
  }
}
