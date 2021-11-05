import Finder from "./finder";

// we import instances for the typing
import ReactInstance from "react";
import ReactDOMInstance from "react-dom";
import classNamesInstance from "classnames";
import lodashInstance from "lodash";
import semverInstance from "semver";
import momentInstance from "moment";
import SimpleMarkdownInstance from "simple-markdown";
import hljsInstance from "highlight.js";
import joiInstance from "joi";
import RavenInstance from "raven";

export const EventEmitter: NodeJS.EventEmitter = Finder.byProps("subscribe", "emit");

export const React: typeof ReactInstance = Finder.byProps("createElement", "Component", "Fragment");

export const ReactDOM: typeof ReactDOMInstance = Finder.byProps("render", "findDOMNode", "createPortal");

export const classNames: typeof classNamesInstance = Finder.find((exports) => exports instanceof Object && exports.default === exports && Object.keys(exports).length === 1);

export const lodash: typeof lodashInstance = Finder.byProps("cloneDeep", "flattenDeep");

export const semver: typeof semverInstance = Finder.byProps("valid", "satifies");

export const moment: typeof momentInstance = Finder.byProps("utc", "months");

export const SimpleMarkdown: typeof SimpleMarkdownInstance = Finder.byProps("parseBlock", "parseInline");

export const hljs: typeof hljsInstance = Finder.byProps("highlight", "highlightBlock");

export const Raven: typeof RavenInstance = Finder.byProps("captureBreadcrumb");

export const joi: typeof joiInstance = Finder.byProps("assert", "validate", "object");

// TODO: full typing
export interface Flux {
    Store: any;
    CachedStore: any;
    PersistedStore: any;
    StoreListenerMixin(): any;
    LazyStoreListenerMixin(): any;
    connectStores<P extends Record<string, any>, I>(
        stores: any[],
        mapping: (props: I) => Partial<P>
    ): (component: React.ComponentType<P>) => React.ComponentClass<I>;
    destroy(): any;
    initialize(): any;
    initialized: boolean;
}

/** Custom module from Discord. */
export const Flux: Flux = Finder.query({props: ["Store", "connectStores"], export: "default"});

/** Custom module from Discord. */
export const Dispatcher = Finder.query({props: ["Dispatcher"], export: "Dispatcher"});

/** Custom module from Discord. */
export const i18n = Finder.byProps("languages", "getLocale");