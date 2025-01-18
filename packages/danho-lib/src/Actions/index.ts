import { Dispatcher, EventEmitter } from '@dium/modules';
import { Actions } from './ActionTypes';
import { Logger } from '@danho-lib/dium/api/logger';

export * from './CreateActionCallback';

export * from './AppActions';
export * from './ApplicationActions';
export * from './ChannelActions';
export * from './GuildActions';
export * from './MessageActions';
export * from './PermissionsActions';
export * from './UserNoteActions';
export * from './UserStatusActions';
export * from './VoiceActions';

export const DISPATCH_ACTIONS = (() => {
  const actions = new Set<string>();

  // gather all events
  Object.values(Dispatcher._actionHandlers._dependencyGraph.nodes)
    .forEach(node => Object.keys(node.actionHandler)
      .forEach(event => actions.add(event)));

  Object.keys(Dispatcher._subscriptions).forEach(event => actions.add(event));

  return [...actions].sort((a, b) => a.localeCompare(b));
})();
export function find(action: string) {
  return DISPATCH_ACTIONS.filter(key => key.toLowerCase().includes(action.toLowerCase()));
}

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
    Logger.log(`[ActionsEmitter] Subscribed to ${eventName}`);

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
    Logger.log(`[ActionsEmitter] Subscribed to ${eventName}`);

    return super.once(eventName, callback as any);
  }
  off<K>(eventName: keyof Actions | K, listener: K extends keyof Actions ? Actions[K] extends unknown[] ? (...args: Actions[K]) => void : never : never): this {
    Dispatcher.unsubscribe(eventName as string, listener as any);
    this._events.set(eventName as string, this._events.get(eventName as string)!.filter(([l]) => l !== listener));

    Logger.log(`[ActionsEmitter] Unsubscribed from ${eventName}`);
    return super.off(eventName, listener as any);
  }

  removeAllListeners(event?: unknown): this {
    this._events.forEach((listeners, event) => {
      listeners.forEach(([listener, wrapped]) => Dispatcher.unsubscribe(event, wrapped));
    });
    this._events.clear();

    Logger.log(`[ActionsEmitter] Unsubscribed from all events`);
    return super.removeAllListeners(event);
  }

  emit<K>(eventName: keyof Actions | K, ...args: K extends keyof Actions ? Actions[K] extends unknown[] ? Actions[K] : never : never): boolean {
    Logger.log(`[ActionsEmitter] Emitting ${eventName}`, { args });
    return super.emit(eventName, ...args as any);
  }
};