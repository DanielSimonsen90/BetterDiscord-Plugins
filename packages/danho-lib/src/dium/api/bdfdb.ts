import { Module } from "betterdiscord";
import { Filter } from "./finder";
import { Logger } from "@dium/api";

declare global {
  interface Window {
    webpackChunkdiscord_app: any;
  }
}

type FinderConfig = {
  defaultExport?: boolean,
  onlySearchUnloaded?: boolean,
  all?: boolean,
  moduleName?: string,
  ignoreCase?: boolean,
  hasNot?: boolean,
  noWarnings?: boolean
};

class GlobalReq {
  private static _instance: any;
  public static get instance() {
    if (!GlobalReq._instance) {
      const id = "WebModules_" + Math.floor(Math.random() * 1000000000000);
      let req;
      window.webpackChunkdiscord_app.push([[id], {}, r => { if (r.c) req = r; }]);
      delete req.m[id];
      delete req.c[id];
      GlobalReq._instance = req;
    }
    return GlobalReq._instance;
  }

  private constructor() {}
}

const Cache = {
  modules: {}
};

export function BDFDB_findByString<TModule extends any = Module>(strings: string[], config: FinderConfig = {}): TModule {
  strings = strings.flat(10);
  return findModule("string", JSON.stringify(strings), m => checkModuleStrings(m, strings) && m, config) as TModule;
};

function checkModuleStrings(module: Module & any, strings: string[], config: FinderConfig = {}) {
  const check = (s1, s2) => {
    s1 = config.ignoreCase ? s1.toString().toLowerCase() : s1.toString();
    return config.hasNot ? s1.indexOf(s2) == -1 : s1.indexOf(s2) > -1;
  };
  return [strings].flat(10).filter(n => typeof n == "string").map(config.ignoreCase ? (n => n.toLowerCase()) : (n => n)).every(string => module && ((typeof module == "function" || typeof module == "string") && (check(module, string) || typeof module.__originalFunction == "function" && check(module.__originalFunction, string)) || typeof module.type == "function" && check(module.type, string) || (typeof module == "function" || typeof module == "object") && module.prototype && Object.keys(module.prototype).filter(n => n.indexOf("render") == 0).some(n => check(module.prototype[n], string))));
};

function findModule(type: string, cacheString: string, filter: (...args: any[]) => boolean, config: FinderConfig = {}): Module {
  if (!isObject(Cache.modules[type])) Cache.modules[type] = { module: {}, export: {} };
  let defaultExport = typeof config.defaultExport != "boolean" ? true : config.defaultExport;
  if (!config.all && defaultExport && Cache.modules[type].export[cacheString]) return Cache.modules[type].export[cacheString];
  else if (!config.all && !defaultExport && Cache.modules[type].module[cacheString]) return Cache.modules[type].module[cacheString];
  else {
    let m = find(filter, config);
    if (m) {
      if (!config.all) {
        if (defaultExport) Cache.modules[type].export[cacheString] = m;
        else Cache.modules[type].module[cacheString] = m;
      }
      return m;
    }
    else if (!config.noWarnings) Logger.warn(`${cacheString} [${type}] not found in WebModules`);
  }
};

function find(filter: Filter, config: FinderConfig = {}) {
  let defaultExport = typeof config.defaultExport != "boolean" ? true : config.defaultExport;
  let onlySearchUnloaded = typeof config.onlySearchUnloaded != "boolean" ? false : config.onlySearchUnloaded;
  let all = typeof config.all != "boolean" ? false : config.all;
  const req = GlobalReq.instance;
  const found = [];
  if (!onlySearchUnloaded) for (let i in req.c) if (req.c.hasOwnProperty(i) && req.c[i].exports != window) {
    let m = req.c[i].exports, r = null;
    if (m && (typeof m == "object" || typeof m == "function")) {
      if (!!(r = filter(m))) {
        if (all) found.push(defaultExport ? r : req.c[i]);
        else return defaultExport ? r : req.c[i];
      }
      else if (Object.keys(m).length < 400) for (let key of Object.keys(m)) try {
        if (m[key] && !!(r = filter(m[key]))) {
          if (all) found.push(defaultExport ? r : req.c[i]);
          else return defaultExport ? r : req.c[i];
        }
      } catch (err) { }
    }
    if (config.moduleName && m && m[config.moduleName] && (typeof m[config.moduleName] == "object" || typeof m[config.moduleName] == "function")) {
      if (!!(r = filter(m[config.moduleName]))) {
        if (all) found.push(defaultExport ? r : req.c[i]);
        else return defaultExport ? r : req.c[i];
      }
      else if (m[config.moduleName].type && (typeof m[config.moduleName].type == "object" || typeof m[config.moduleName].type == "function") && !!(r = filter(m[config.moduleName].type))) {
        if (all) found.push(defaultExport ? r : req.c[i]);
        else return defaultExport ? r : req.c[i];
      }
    }
    if (m && m.__esModule && m.default && (typeof m.default == "object" || typeof m.default == "function")) {
      if (!!(r = filter(m.default))) {
        if (all) found.push(defaultExport ? r : req.c[i]);
        else return defaultExport ? r : req.c[i];
      }
      else if (m.default.type && (typeof m.default.type == "object" || typeof m.default.type == "function") && !!(r = filter(m.default.type))) {
        if (all) found.push(defaultExport ? r : req.c[i]);
        else return defaultExport ? r : req.c[i];
      }
    }
  }
  for (let i in req.m) if (req.m.hasOwnProperty(i)) {
    let m = req.m[i];
    if (m && typeof m == "function") {
      if (req.c[i] && !onlySearchUnloaded && filter(m)) {
        if (all) found.push(defaultExport ? req.c[i].exports : req.c[i]);
        else return defaultExport ? req.c[i].exports : req.c[i];
      }
      if (!req.c[i] && onlySearchUnloaded && filter(m)) {
        const resolved: any = {}, resolved2: any = {};
        m(resolved, resolved2, req);
        const trueResolved = resolved2 && Object.getOwnPropertyNames(resolved2).length == 0 ? resolved : resolved2;
        if (all) found.push(defaultExport ? trueResolved.exports : trueResolved);
        else return defaultExport ? trueResolved.exports : trueResolved;
      }
    }
  }
  if (all) return found;
};

function isObject(obj: any): obj is Object {
  return obj && typeof obj === "object" && obj.constructor === Object;
}