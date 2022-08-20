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
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
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