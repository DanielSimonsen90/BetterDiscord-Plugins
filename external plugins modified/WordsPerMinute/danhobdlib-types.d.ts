declare global {
  interface Window {
    DanhoLib: DanhoBDLib;
    DanhoPlugin: typeof BasePlugin;
  }
}

export declare class DanhoBDLib {
  createElement<Type extends keyof HTMLElementTagNameMap>(type: Type, props: Partial<HTMLElementTagNameMap[Type]>): HTMLElementTagNameMap[Type];
  createElement(value: string): HTMLElement;
  createElement(component: React.Component): HTMLElement;

  log(prefix: string, ...data: any[]): void;

  createPlugin<TPlugin extends BasePlugin>(name: string, builder: (basePlugin: typeof BasePlugin) => TPlugin): TPlugin;
}

export declare class BasePlugin<
  TSettings extends Record<string, unknown> = Record<string, unknown>
> {
  constructor(options: PluginOptions<TSettings>);

  // Plugin lifecycle
  start(): void;
  stop(): void;

  // Plugin properties
  name: string;
  style?: string;
  createStyle(builder: (settings: TSettings) => string): string;

  _settings: TSettings;
  get settings(): TSettings;
  set settings(value: TSettings);
  getSettingsPanel?: () => HTMLElement;

  // Development Utils
  isDebugMode: boolean;
  debugLog(): void;
  log(): void;
  lib: DanhoBDLib;

  // DOM Modifiers
  events: Array<PluginEventItem<any>>;
  addEventListener<TEventKey extends keyof HTMLElementEventMap>(element: HTMLElement, type: TEventKey, listener: (this: HTMLElement, event: HTMLElementEventMap[TEventKey]) => void, options?: AddEventListenerOptions): void;
  removeAllEventListeners(): void;

  injections: Array<HTMLElement>;
  injectElement(parentResolve: HTMLElement | string, element: HTMLElement, position?: InsertPosition): void;
  removeAllInjections(): void;
}

type PluginOptions<
  TSettings extends Record<string, unknown> = Record<string, unknown>
> = {
  name: string;
  isDebugMode?: boolean;
  style?: string;
  settings?: TSettings
};

type PluginEventItem<TEventKey extends keyof EventSourceEventMap> = {
  element: HTMLElement;
  type: TEventKey;
  listener: (this: EventSource, event: EventSourceEventMap[TEventKey]) => void;
}

type PluginInjectionItem = {
  element: HTMLElement;
  type: 'beforeend' | 'afterend' | 'beforebegin' | 'afterbegin';
}