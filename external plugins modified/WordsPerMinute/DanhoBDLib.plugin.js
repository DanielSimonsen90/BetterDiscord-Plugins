/**
 * @name 0DanhoBDLib
 * @version 1.0.0
 * @description Library for Danho's plugins
 * @author Danho
 */

/// <reference types="betterdiscord-types" />
/// <reference path="danhobdlib-types.d.ts" />

const PluginName = '0DanhoBDLib';

class DanhoBDLib {
  #log = (...data) => this.log(PluginName, ...data);
  log = (prefix, ...data) => console.log(`[${prefix}]`, ...data);
    
  // #region Utils
  createPlugin(name, builder, debugMode = true) {
    return builder(window.DanhoPlugin = class BasePlugin {
      start() {
        this.debugLog(`Started ${name}`);
      }
      stop() {
        this.debugLog(`Stopped ${name}`);
      }

      isDebuggingMode = debugMode;
      debugLog = (...data) => {
        if (this.isDebuggingMode) this.log(...data);
      };
      log = (...data) => window.DanhoLib.log(...data);
    });
  }
  // #endregion


  // #region Create Elements
  createElementFromType = (type, props) => {
    const _props = typeof props === 'object' ? props : {};

    const children = [];
    if (typeof props === 'object') {
      if (Array.isArray(props)) {
        children.push(...props);
      }
      if ('children' in props && Array.isArray(props.children)) {
        children.push(...props.children);
        delete _props.children;
      }
    } else if (typeof props === 'string' || typeof props === 'number') {
      _props.textContent = props;
    }

    const element = Object.assign(document.createElement(type), _props);
    if (children.length) children.forEach(child => element.appendChild(child));
    return element;
  };
  createElementFromString = (value) => {
    const template = document.createElement('template');
    template.innerHTML = value.trim();
    if (!template.content.firstElementChild) throw new Error('Element not found');
    return template.content.firstElementChild;
  };
  /**
   * @param {React.Component} component
   */
  createElementFromComponent = (component) => {
    const element = document.createElement('div');
    BdApi.ReactDOM.render(component, element);
    return element.firstElementChild;
  }
  createElement = (arg1, arg2) => {
    if (arg1 === undefined) return document.createElement('div');

    if (typeof arg1 === 'function') return this.createElementFromComponent(arg1);
    if (arg2 === undefined) return this.createElementFromString(arg1);
    return this.createElementFromType(arg1, arg2);
  }
  // #endregion

  // #region Plugin Lifecycle
  start() {
    this.#log("Started");
  }
  stop() {
    this.#log("Stopped");
  }
  // #endregion
};

window.DanhoLib = new DanhoBDLib();
window.DanhoPlugin = class DanhoPlugin {
  constructor(name, isDebugMode) {
    this.name = name;
    this.isDebuggingMode = isDebugMode;
  }

  // #region Lifecycle
  start() {
    this.debugLog("Started");

    if (this._settings) this._settings = BdApi.Data.load(this.name, 'settings') ?? this._settings;
    if (this.style) BdApi.DOM.addStyle(this.name, this.style);
  }
  stop() {
    this.debugLog("Stopped");

    if (this.style) BdApi.DOM.removeStyle(this.name);
    if (this.events.length) this.removeAllEventListeners();
    if (this.injections.length) this.removeAllInjections();
  }
  // #endregion

  // #region Plugin properties
  name = `Unknown Danho Plugin`;
  style;
  createStyle = (builder) => builder(this.settings);

  _settings;
  get settings() {
    return this._settings;
  }
  set settings(value) {
    this._settings = value;
    BdApi.Data.save(this.name, 'settings', value);
  }
  // #endregion

  // #region Development Utils
  isDebuggingMode = true;
  debugLog = (...data) => {
    if (this.isDebuggingMode) this.log(...data);
  };
  log = (...data) => window.DanhoLib.log(this.name, ...data);
  lib = window.DanhoLib;
  // #endregion

  // #region DOM Modifiers
  events = [];
  addEventListener = (element, event, callback, options) => {
    element.addEventListener(event, callback, options);
    this.events.push({ element, event, callback });
  };
  removeAllEventListeners = () => this.events.forEach(({ element, event, callback }) => element.removeEventListener(event, callback));

  injections = [];
  injectElement = (parentResolve, element, position = 'beforeend') => {
    const parent = typeof parentResolve === 'string' ? document.querySelector(parentResolve) : parentResolve;
    if (!parent) return this.log(`Failed to inject element into ${parent}`);
    parent.insertAdjacentElement(position, element);
    this.injections.push(element);
  }
  removeAllInjections = () => this.injections.forEach(element => element.remove());
  // #endregion
}

module.exports = DanhoBDLib;