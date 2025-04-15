import { Actions } from './ActionTypes';
import { createLogger } from '@injections';
import { Dispatcher, EventEmitter } from '@dium/modules';

const Logger = createLogger('ActionsEmitter');

export const ActionsEmitter = new class ActionsEmitter extends EventEmitter<Actions> {
  private _events = new Map<string, Array<[original: (...args: any[]) => void, wrapped: (...args: any[]) => void]>>();

  on<K>(eventName: keyof Actions | K, listener:
    K extends keyof Actions
    ? Actions[K] extends unknown[]
    ? (...args: Actions[K]) => void
    : never
    : (...args: any[]) => void
  ): this {
    const callback = (...args: any[]) => {
      try {
        listener(...args as any);
      } catch (error) {
        console.error(error, { eventName, args });
      }
    };
    const existing = this._events.get(eventName as string) ?? [];
    this._events.set(
      eventName as string,
      [...existing, [listener as any, callback as any]]
    );

    Dispatcher.subscribe(eventName as string, callback as any);
    Logger.log(`Subscribed to ${eventName}`);

    return super.on(eventName, callback as any);
  };
  once<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    const callback = (...args: any[]) => {
      try {
        listener(...args as any);
      } catch (error) {
        console.error(error, { eventName, args });
      }
    };
    const existing = this._events.get(eventName as string) ?? [];
    this._events.set(
      eventName as string,
      [...existing, [listener as any, callback as any]]
    );

    Dispatcher.subscribe(eventName as string, (...args) => {
      callback(...args as any);
      Dispatcher.unsubscribe(eventName as string, callback as any);
      this._events.set(eventName as string, this._events.get(eventName as string)!.filter(([l]) => l !== listener));
    });
    Logger.log(`Subscribed to ${eventName}`);

    return super.once(eventName, callback as any);
  }
  off<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    Dispatcher.unsubscribe(eventName as string, listener as any);
    const existing = this._events.get(eventName as string) ?? [];
    this._events.set(eventName as string, existing.filter(([l]) => l !== listener));

    Logger.log(`Unsubscribed from ${eventName}`);
    return super.off(eventName, listener as any);
  }

  removeAllListeners(event?: unknown): this {
    this._events.forEach((listeners, event) => {
      listeners.forEach(([listener, wrapped]) => Dispatcher.unsubscribe(event, wrapped));
    });
    this._events.clear();

    Logger.log(`Unsubscribed from all events`);
    return super.removeAllListeners(event);
  }

  emit<K>(eventName: keyof Actions | K, ...args: K extends keyof Actions ? Actions[K] extends unknown[] ? Omit<Actions[K], 'type'> : [object] : [object]): boolean {
    Logger.log(`Emitting ${eventName}`, { args });
    const actionProps: any = args.shift();
    if (args.length) Logger.warn(`The following arguments were not used:`, { args });

    const payload = Object.assign({ type: eventName }, actionProps);
    Logger.log(`Dispatching ${eventName}`, { payload });
    Dispatcher.dispatch(payload);

    this._events.get(eventName as string)?.forEach(([_, wrapped]) => wrapped(...args as any));
    return super.emit(eventName, ...args as any);
  }
};
export default ActionsEmitter;