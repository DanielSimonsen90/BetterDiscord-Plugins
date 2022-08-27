import { Channel } from '@discord';
import { Finder } from '@discordium/api';

type ChannelEditorContainerComponent = React.ComponentClass<{
    accessibilityLabel?: string,
    "aria-describedby"?: string,
    "aria-labelledby"?: string,
    canOnlyuseTextCommands?: boolean,
    canPasteFiles?: boolean,
    channel?: Channel,
    className?: string,
    disabled?: boolean,
    focused?: boolean,
    fontSize?: number,
    isPreviewing?: boolean,
    maxCharacterCount?: number,
    placeholder?: string,
    richValue?: Array<React.ReactNode>
    spellcheckEnabled?: boolean,
    textValue?: string,
    /** This is viewable, but i cba to do it */
    type?: any
    uploadPromptCharacterCount?: number,
    useSlate?: boolean,

    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void,
    onChange?: (_: null, textValue: string, elements: Array<JSX.Element>) => void,
    onEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void,
    onFocus?: (e: React.FocusEvent<HTMLDivElement>) => void,
    onHideAutocomplete?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void,
    onMaybeShowAutocomplete?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onResize?: (e: React.UIEvent<HTMLDivElement>) => void,
    onSelectionChanged?: (e: React.UIEvent<HTMLDivElement>) => void,
    onSubmit?: (e: React.FormEvent<HTMLDivElement>) => void,
    onTab?: (e: React.KeyboardEvent<HTMLDivElement>) => void,

    promptToUpload?: () => void,
}, {
    focused: boolean,
    popup: {
        activeDescendant: null,
        id: null
    },
    submitting: boolean,
}>

export interface ChannelEditorContainer extends ChannelEditorContainerComponent {
    default: ChannelEditorContainerComponent,
}
export const ChannelEditorContainer: ChannelEditorContainer = Finder.byName("ChannelEditorContainer");
export default ChannelEditorContainer;

type ChatInputTypes = {
    [key in 'CREATE_FORUM_POST' | 'EDIT' | 'FORM' | 'FORUM_CHANNEL_GUIDELINES' | 'NORMAL' | 'NORMAL_WITH_ACTIVITY' 
        | 'OVERLAY' | 'PROFILE_BIO_INPUT' | 'RULES_INPUT' | 'SIDEBAR' | 'THREAD_CREATION']: {
            activities?: {
                button: boolean
            }
            analyticsName: string,
            attachments?: boolean,
            autocomplete?: {
                alwaysUseLayer?: boolean,
                small?: boolean,
                addReactionShortcut?: boolean,
                forceChatLayer?: boolean,
                reactions?: boolean,
            },
            commands?: {
                enabled?: boolean,
            }
            disableAutoFocus?: boolean,
            drafts: {
                type: number,
                autoSave?: boolean,
            },
            emojis?: {
                button: boolean,
            },
            expressionPicker?: {
                onlyEmojis?: boolean,
                onlyStickers?: boolean,
            }
            gifs?: {
                button?: boolean,
                allowSending: boolean,
            },
            gifts?: {
                button?: boolean,
            }
            hideAttachmentsArea?: boolean,
            permissions: {
                allowSending?: boolean,
                requireCreateTreads?: boolean,
            },
            sedReplace?: boolean,
            showCharacterCount?: boolean,
            showThreadPromptOnReply?: boolean,
            stickers: {
                button?: boolean,
                allowSending: boolean,
                autoSuggest?: boolean,
            },
            submit: {
                button?: boolean,
                clearOnSubmit?: boolean,
                disableEnterToSubmit?: boolean,
                ignorePreference?: boolean,
                useDisabledStylesOnSubmit: boolean,
            },
            toolbarType?: number,
            uploadLongMessages?: boolean,
            upsellLongMessages?: {
                iconOnly?: boolean,
            }
        };
};
export const ChatInputTypes: ChatInputTypes = Finder.byProps("ChatInputTypes").ChatInputTypes;