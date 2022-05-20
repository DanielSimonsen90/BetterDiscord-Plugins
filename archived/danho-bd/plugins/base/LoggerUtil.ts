type LogMethods = Pick<Console, 'log' | 'warn' | 'error' | 'table' | 'debug' | 'group' | 'trace'>

export default class LoggerUtil {
    constructor(
        public name: string, 
        public bracket: string, 
        public color: string
    ) {}

    private _log(type: keyof LogMethods, ...data: any[]) {
        const prefix = `%c[%c${this.name}%c]:`;
        const prefixColors = [this.bracket, this.color, this.bracket].map(clr => `color:${clr};`);
        console[type](`${new Date().toLocaleTimeString()} | ${prefix}`, ...prefixColors, ...data);
    }
    log(...data: any[]) { this._log('log', ...data); }
    warn(...data: any[]) { this._log('warn', ...data); }
    error(...data: any[]) { this._log('error', ...data); }
    table(...data: any[]) { this._log('table', ...data); }
}