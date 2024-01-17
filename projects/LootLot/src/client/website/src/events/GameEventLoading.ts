import {GameEventBase} from "./GameEventBase";

export class GameEventLoading extends GameEventBase {
    public static readonly event: string = "game.logic.GameEventLoading";

    public get subject(): string {
        return GameEventLoading.event;
    }
}
