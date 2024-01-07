import {EventBus} from "@/plugins/EventBus";
import {GameEventLoading} from "@/events/GameEventLoading";

export class Loading {
    public static open(): any {
        EventBus.instance.emit(GameEventLoading.event, true);
    }

    public static close(): any {
        EventBus.instance.emit(GameEventLoading.event, false);
    }

}
