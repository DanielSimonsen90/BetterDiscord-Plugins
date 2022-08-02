declare namespace BdApi {
    interface Plugin {
        start(): void;
        stop(): void;
        getSettingsPanel?: () => JSX.Element;

    }
    interface PluginConstructor {
        new(): Plugin;
    }
    interface PluginData {
        added: number,
        author: string,
        autohrLink: string,
        description: string,
        exports: Plugin,
        filename: string,
        format: string,
        id: string,
        instance: Plugin & { 
            __proto__: { constructor: { name: string } },
            plugin: Plugin,
        },
        modified: number,
        name: string,
        size: number,
        source: string,
        updateUrl: string,
        version: string,
        website: string
    }

    const Patcher: any;

    function alert(title: string, content: string | JSX.Element): void;

    interface ConfirmationModalOptions {
        danger?: boolean;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }
    function showConfirmationModal(title: string, content: string | JSX.Element, options?: ConfirmationModalOptions): Promise<boolean>;

    interface ToastOptions {
        type?: "" | "info" | "success" | "danger" | "error" | "warning" | "warn";
        icon?: boolean;
        timeout?: number;
    }
    function showToast(content: string, options?: ToastOptions): void;

    function loadData(id: string, key: string): any;
    function saveData(id: string, key: string, data: any): void;
    function deleteData(id: string, key: string): void;

    function injectCSS(id: string, styles: string): void;
    function clearCSS(id: string): void;

    function findModule(filter: (module: any) => boolean): any;
    function findAllModules(filter: (module: any) => boolean): any[];
    function findModuleByProps(...props: string[]): any;
    function findModuleByPrototypes(...protos: string[]): any;
    function findModuleByDisplayName(name: string): any;
}
