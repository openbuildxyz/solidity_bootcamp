import { EventBus } from "../plugins/EventBus";
import { Singleton } from "../core/game/Singleton";
import { GameEventWalletAccountChanged } from "./GameEventWalletAccountChanged";
import { GameEventWalletChainChanged } from "./GameEventWalletChainChanged";
import { GameEventWalletDisconnect } from "./GameEventWalletDisconnect";
import { GameEventBuyParkings } from "./GameEventBuyParkings";
import { GameEventGoFriendHome } from "./GameEventGoFriendHome";
import { GameEventWalletConnected } from "./GameEventWalletConnected";
import { GameEventParkCar } from "./GameEventParkCar";
import { GameEventUnParkCar } from "./GameEventUnParkCar";
import { GameEventFineCar } from "./GameEventFineCar";
import { GameEventBuyCar } from "./GameEventBuyCar";

export class GameEventManager extends Singleton {
  public initialize() {
    this.initAsyncEventListeners();
  }

  private initAsyncEventListeners() {
    this.addListeners([
      new GameEventWalletAccountChanged(),
      new GameEventWalletChainChanged(),
      new GameEventWalletDisconnect(),
      new GameEventBuyParkings(),
      new GameEventGoFriendHome(),
      new GameEventWalletConnected(),
      new GameEventParkCar(),
      new GameEventUnParkCar(),
      new GameEventFineCar(),
      new GameEventBuyCar(),
    ]);
  }

  public addListeners(listeners: any[]) {
    listeners.forEach((listener) => this.addListener(listener));
  }

  public addListener(listener: any) {
    EventBus.instance.on(
      listener.subject,
      async (
        args1: any,
        args2: any,
        args3: any,
        args4: any,
        args5: any,
        args6: any
      ) => {
        await listener.execAsync(args1, args2, args3, args4, args5, args6);
      }
    );
  }
}
