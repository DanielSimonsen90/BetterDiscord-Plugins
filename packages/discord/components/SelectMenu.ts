import { Finder } from "@dium/api"

type SelectionResult<Type> = {
    newValue: Type, 
    updated: boolean
}

type UseSelectStateHooks<Type> = (props: {
    value: Type,
    onChange: (value: Type) => void,
    serialize: () => string
}) => {
    select: (value: Type) => void,
    isSelected: (value: Type) => boolean,
    clear: () => void,
    serialize: string
}

export interface SelectMenuComponent<Type extends number | string> extends React.FunctionComponent<{
    options: Array<{
        position: number,
        label: string,
        value: Type,
        disabled?: boolean,
        key: string,
    }>;
    placeholder?: string;
    className?: string;
    isDisabled?: boolean;
    maxVisibleItems?: number;
    look?: any;
    autoFocus?: boolean;
    popoutWidth?: number;
    clearable?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;

    onClose?: (e: React.MouseEvent) => void;
    onOpen?: (e: React.MouseEvent) => void;
    renderOptionLabel?: (option: any) => React.ReactNode;
    renderOptionValue?: (option: any) => React.ReactNode;

    popoutClassName?: string;
    popoutPosition?: 'top' | 'bottom';
    
    optionClassName?: string;
    closeOnSelect?: boolean;
    select: (option: Type) => void;
    isSelected: (option: Type) => boolean;
    serialize: (option: Type) => string;
}> {
    SingleSelect: React.FunctionComponent<{
        value: Type,
        onChange: (value: Type) => void,
    }>,
    multiSelect: (value: Type, selection: Type[]) => SelectionResult<Type>,
    singleSelect: (value: Type, selection: Type[]) => SelectionResult<Type>,
    toggleSelect: (value: Type, selection: Type[]) => SelectionResult<Type>,
    useMultiSelectState: UseSelectStateHooks<Type>,
    useSingleSelectState: UseSelectStateHooks<Type>,
    useVariableSelect: UseSelectStateHooks<Type>,
}
export const SelectMenu: SelectMenuComponent<any> = Finder.byKeys(["Select"]);
export default SelectMenu;