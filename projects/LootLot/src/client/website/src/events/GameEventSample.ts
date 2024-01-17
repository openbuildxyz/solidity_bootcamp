import { GameEventBase } from "./GameEventBase";

export class GameEventSample extends GameEventBase {
  public static readonly event: string = "game.logic.GameEventSample";

  public get subject(): string {
    return GameEventSample.event;
  }
}
