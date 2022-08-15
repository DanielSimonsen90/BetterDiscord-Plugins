import {Exports} from "./require";

export type Filter = (exports: Exports) => boolean;

export interface Query {
    filter?: Filter | Filter[];
    name?: string;
    props?: string[];
    protos?: string[];
    source?: string[];
    export?: string | ((target: any) => boolean);
}

export const join = (filters: Filter[]): Filter => {
    return (target) => filters.every((filter) => filter(target));
};

export const query = ({filter, name, props, protos, source}: Query): Filter => join([
    ...[filter].flat(),
    typeof name === "string" ? byName(name) : null,
    props instanceof Array ? byProps(props) : null,
    protos instanceof Array ? byProtos(protos) : null,
    source instanceof Array ? bySource(source) : null
].filter(Boolean));

export const byExports = (exported: Exports): Filter => {
    return (target) => target === exported || (target instanceof Object && Object.values(target).includes(exported));
};

export const byName = (name: string): Filter => {
    return (target) => target instanceof Object && target !== window && Object.values(target).some(byOwnName(name));
};

export const byOwnName = (name: string): Filter => {
    return (target: any) => (target?.displayName ?? target?.constructor?.displayName) === name;
};

export const byProps = (props: string[]): Filter => {
    return (target) => target instanceof Object && props.every((prop) => prop in target);
};

export const byProtos = (protos: string[]): Filter => {
    return (target: any) => target instanceof Object && target.prototype instanceof Object && protos.every((proto) => proto in target.prototype);
};

// TODO: allow regex?
export const bySource = (contents: string[]): Filter => {
    return (target) => target instanceof Function && contents.every((content) => target.toString().includes(content));
};