type PluginEventItem<TEventKey extends keyof EventSourceEventMap> = {
  element: HTMLElement;
  type: TEventKey;
  listener: (this: EventSource, event: EventSourceEventMap[TEventKey]) => void;
}

let events: Array<PluginEventItem<any>> = [];
export function addEventListener<TEventKey extends keyof HTMLElementEventMap>(
  element: HTMLElement, 
  type: TEventKey, 
  listener: (this: EventSource, event: HTMLElementEventMap[TEventKey]) => void, 
  options?: AddEventListenerOptions
): void {
  element.addEventListener(type, listener, options);
  events.push({ element, type, listener });
}

export function removeAllEventListeners(): void {
  for (const { element, type, listener } of events) {
    element.removeEventListener(type, listener);
  }
  
  events = [];
}