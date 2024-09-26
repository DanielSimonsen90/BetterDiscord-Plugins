import { Dispatcher, EventEmitter } from '@dium/modules';
import { Actions } from './ActionTypes';

export * from './UserNoteActions';
export * from './GuildActions';

export const DISPATCH_ACTIONS = Dispatcher._subscriptions;
export function find(action: string) {
  Object.keys(DISPATCH_ACTIONS).find(key => key.includes(action));
}

export const ActionsEmitter = new class ActionsEmitter extends EventEmitter<Actions> {
  private _events = new Map<string, Array<(...args: any[]) => void>>();
  
  on<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    this._events.set(eventName as string, [...(this._events.get(eventName as string) ?? []), listener as any]);
    Dispatcher.subscribe(eventName as string, listener as any);
    return super.on(eventName, listener as any);
  }
  once<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    this._events.set(eventName as string, [...(this._events.get(eventName as string) ?? []), listener as any]);
    Dispatcher.subscribe(eventName as string, (...args) => {
      listener(...args as any);
      Dispatcher.unsubscribe(eventName as string, listener as any);
      this._events.set(eventName as string, this._events.get(eventName as string)!.filter(l => l !== listener));
    });
    return super.once(eventName, listener as any);
  }
  off<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    Dispatcher.unsubscribe(eventName as string, listener as any);
    this._events.set(eventName as string, this._events.get(eventName as string)!.filter(l => l !== listener));
    return super.off(eventName, listener as any);
  }

  removeAllListeners(event?: unknown): this {
    this._events.forEach((listeners, event) => {
      listeners.forEach(listener => Dispatcher.unsubscribe(event, listener));
    });
    this._events.clear();
    return super.removeAllListeners(event as string);
  }
}