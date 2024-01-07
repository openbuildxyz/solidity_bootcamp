import { EventBus } from "../plugins/EventBus";

export abstract class GameEventBase {
  public static readonly event: string = "core.game.event.base";
  public static get eventAsync(): string {
    return `${this.event}_await`;
  }

  public get subject(): string {
    console.error("not implement", this.subject);
    return GameEventBase.event;
  }

  public async exec(
    eventData: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ) {}

  public async execAsync(
    eventData: any,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ) {
    try {
      await this.exec(eventData, arg2, arg3, arg4, arg5);
      EventBus.instance.emit(
        `${this.subject}_await`,
        eventData,
        arg2,
        arg3,
        arg4,
        arg5
      );
    } catch (e) {
      console.error("reject event", this.subject, e);
    }
  }
}
