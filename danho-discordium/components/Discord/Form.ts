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

export type Form = Record<FormKeys, React.FunctionComponent<any>> & {
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
}
export default Form;