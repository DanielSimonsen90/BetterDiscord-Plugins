export interface ConfigInfo {
    name?: string;
    version?: string;
    description?: string;
    author?: string;
}
export default interface IConfigData {
    info: ConfigInfo,
    changeLog?: Partial<Record<
        'added' | 'fixed' | 'progress' | 'improved',
        Record<string, string>
    >>
}

export function Config(config: IConfigData) {
    return config;
}