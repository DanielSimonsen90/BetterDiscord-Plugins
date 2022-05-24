/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Finder from "../api/finder";

// GENERAL
export const Constants = () => Finder.byProps("Permissions", "RelationshipTypes");
export const i18n = () => Finder.byProps("languages", "getLocale");

// STORES/ACTIONS
// TODO: rename to actual names (store suffix)
export const Channels = () => Finder.byProps("getChannel", "hasChannel");
export const SelectedChannel = () => Finder.byProps("getChannelId", "getVoiceChannelId");
export const Users = () => Finder.byProps("getUser", "getCurrentUser");
export const Members = () => Finder.byProps("getMember", "isMember");

export interface ContextMenuActions {
    openContextMenu(e, t, n, r);
    openContextMenuLazy(event: React.MouseEvent, resolver: (...args: any[]) => Promise<any>, unknown: any);
    closeContextMenu();
}

export const ContextMenuActions = (): ContextMenuActions => Finder.byProps("openContextMenuLazy");

export interface ModalActions {
    openModal(e, t, n);
    openModalLazy(resolver: (...args: any[]) => Promise<any>, unknown: any);
    updateModal(e, t, n, r, i);
    closeAllModals();
    closeModal(e, t);
    hasAnyModalOpen();
    hasAnyModalOpenSelector(e);
    hasModalOpen(e, t);
    hasModalOpenSelector(e, t, n);
    useModalsStore(e, n);
}

export const ModalActions = (): ModalActions => Finder.byProps("openModalLazy");

// COMPONENTS
export const Flex = () => Finder.byName("Flex");

enum Colors {
    BLACK,
    BRAND,
    BRAND_NEW,
    GREEN,
    LINK,
    PRIMARY,
    RED,
    TRANSPARENT,
    WHITE,
    YELLOW,
}
enum ButtonLooks { BLANK, FILLED, INVERTED, LINK, OUTLINED }
enum ButtonSizes { ICON, LARGE, MAX, MEDIUM, MIN, NONE, SMALL, TINY, XLARGE }
interface ButtonComponent extends React.FunctionComponent<{
    look?: ButtonLooks;
    color?: Colors;
    borderColor?: Colors;
    hover?: any;
    size?: ButtonSizes;
    fullWidth?: boolean;
    grow?: boolean;
    disabled?: boolean;
    submitting?: boolean;
    type?: string;
    style?: React.CSSProperties;
    wrapperClassName?: string;
    className?: string;
    innerClassName?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onDoubleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    rel?: string;
    buttonRef?: React.Ref<HTMLButtonElement>;
    focusProps?: any;
    "aria-label"?: string;
}> {
    BorderColors: Record<keyof typeof Colors, Colors>
    Colors: Record<keyof typeof Colors, Colors>;
    Hovers: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Link: React.FunctionComponent<{
            look?: ButtonLooks;
            color?: Colors;
            borderColor?: Colors;
            hover?: any;
            size?: ButtonSizes;
            fullWidth?: boolean;
            grow?: boolean;
            style?: React.CSSProperties;
            className?: string;
            innerClassName?: string;
            onClick?: (e: React.MouseEvent) => void;
            onMouseDown?: (e: React.MouseEvent) => void;
            onMouseUp?: (e: React.MouseEvent) => void;
            children?: React.ReactNode;
            rel?: string;
        }>;
    Looks: Record<keyof typeof ButtonLooks, ButtonLooks>;
    Sizes: Record<keyof typeof ButtonSizes, ButtonSizes>;
}

export const Button = (): ButtonComponent => Finder.byProps("Link", "Hovers");

export const Text = () => Finder.byName("Text");
export const Links = () => Finder.byProps("Link", "NavLink");

export const Switch = () => Finder.byName("Switch");
export const SwitchItem = () => Finder.byName("SwitchItem");
export const RadioGroup = () => Finder.byName("RadioGroup");
export const Slider = () => Finder.byName("Slider");
export const TextInput = () => Finder.byName("TextInput");

export const Menu = (): {
    MenuCheckboxItem: any;
    MenuControlItem: any;
    MenuGroup: any;
    MenuItem: any;
    MenuRadioItem: any;
    MenuSeperator: any;
    MenuSpinner: any;
} => Finder.byProps("MenuGroup", "MenuItem", "MenuSeparator");

type FormKeys = `Form${
    'Divider' 
    | 'Item' 
    | 'Label' 
    | `Notice${'' | 'ImagePositions' | 'Types'}` 
    | 'Section' 
    | `Text${'' | 'Types'}`}`
    | `FormTitle${'' | 'Tags'}`;
type Tag = `h${1 | 2 | 3 | 4 | 5 | 6}`;
enum FormNoticeTypes {
    BRAND,
    CUSTOM,
    DANGER,
    PRIMARY,
    SUCCESS,
    WARNING
}
enum FormTextTypes {
    DEFAULT,
    DESCRIPTION,
    ERROR,
    INPUT_PLACEHOLDER,
    LABEL_BOLD,
    LABEL_DESCRIPTION,
    LABEL_SELECTED,
    SUCCESS
}
export const Form = (): Record<FormKeys, React.FunctionComponent<any>> & {
    FormDivider: React.FunctionComponent<{
        className?: string;
        style?: React.CSSProperties;
    }>;
    FormItem: React.FunctionComponent<{
        children: React.ReactNode;
        disabled?: boolean;
        className?: string;
        titleClassName?: string;
        tag?: Tag;
        required?: boolean;
        style?: React.CSSProperties;
        title?: string;
        error?: Error;
    }>;
    FormLabel: React.FunctionComponent<{
        children: React.ReactNode;
        className?: string;
        disabled?: boolean;
        required?: boolean;
    }>;
    FormNotice: React.FunctionComponent<{
        type: FormNoticeTypes;
        imageData?: string;
        button?: React.ReactNode;
        className?: string;
        iconClassName?: string;
        title?: string;
        body?: React.ReactNode;
        style?: React.CSSProperties;
        align?: 'left' | 'right';
    }>;
    FormNoticeImagePositions: {
        LEFT: 'left';
        RIGHT: 'right';
    };
    FormNoticeTypes: {
        BRAND: FormNoticeTypes.BRAND;
        CUSTOM: FormNoticeTypes.CUSTOM;
        DANGER: FormNoticeTypes.DANGER;
        PRIMARY: FormNoticeTypes.PRIMARY;
        SUCCESS: FormNoticeTypes.SUCCESS;
        WARNING: FormNoticeTypes.WARNING;
    };
    FormSection: React.FunctionComponent<{
        children: React.ReactNode;
        className?: string;
        title?: string;
        icon?: string;
        disabled?: boolean;
        tag?: Tag;
    }>;
    FormText: React.FunctionComponent<{
        type?: FormTextTypes,
        className?: string;
        disabled?: boolean;
        selectable?: boolean;
        children: React.ReactNode;
        style?: React.CSSProperties;
    }>;
    FormTextTypes: {
        DEFAULT: FormTextTypes.DEFAULT;
        DESCRIPTION: FormTextTypes.DESCRIPTION;
        ERROR: FormTextTypes.ERROR;
        INPUT_PLACEHOLDER: FormTextTypes.INPUT_PLACEHOLDER;
        LABEL_BOLD: FormTextTypes.LABEL_BOLD;
        LABEL_DESCRIPTION: FormTextTypes.LABEL_DESCRIPTION;
        LABEL_SELECTED: FormTextTypes.LABEL_SELECTED;
        SUCCESS: FormTextTypes.SUCCESS;
    };
    FormTitle: React.FunctionComponent<{
        tag?: Tag;
        children: React.ReactNode;
        className?: string;
        faded?: boolean;
        disabled?: boolean;
        required?: boolean;
        error?: Error;
    }>;
    FormTitleTags: Record<Uppercase<Tag>, Tag>;        

} => Finder.byProps("FormItem", "FormSection", "FormDivider")

// STYLE MODULES
export const margins = () => Finder.byProps("marginLarge");