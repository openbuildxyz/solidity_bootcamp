import EventEmitter from "eventemitter3";

export class EventBus {
  private static _instance: EventBus;
  static get instance(): EventBus {
    if (!this._instance) {
      this._instance = new EventBus();
    }
    return this._instance;
  }

  private _eventEmitter: EventEmitter | null = null;

  private get eventEmitter(): EventEmitter {
    if (!this._eventEmitter) {
      this._eventEmitter = new EventEmitter();
    }
    return this._eventEmitter;
  }

  public emit(event: string, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
