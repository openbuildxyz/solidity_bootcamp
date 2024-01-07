import { GameEventModalOpen } from "../events/GameEventModalOpen";
import { EventBus } from "./EventBus";

export class DialogModal {
  static open(desc: string, callback: Function, title = "") {
    EventBus.instance.emit(
      GameEventModalOpen.event,
      true,
      title,
      desc,
      callback
    );
  }

  static close() {
    EventBus.instance.emit(GameEventModalOpen.event, false, "", "", null);
  }
}
