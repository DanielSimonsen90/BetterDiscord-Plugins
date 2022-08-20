import { Emoji } from "@discord";
import DateTimePicker from "@react/components/DateTimePicker";
import useStateStack from "@react/hooks/useStateStack";

const { parseBioReact, CompiledReact, moment } = window.BDD.Modules;
const { React, useEffect, useCallback, useMemo, classNames, Components } = CompiledReact;
const { SuccessButton, CancelButton, ButtonContainer } = Components;
const { DiscordClassModules, LibraryComponents: {
    EmojiPickerButton, SvgIcon, PopoutContainer
} } = window.BDFDB;


type UserBioEditorProps = {
    initialValue: string;
    onButtonPressed: (value: string) => void;
}
export default function UserBioEditor({ initialValue, onButtonPressed }: UserBioEditorProps) {
    const [value, { push, undo, redo }] = useStateStack(initialValue);

    const charsLeft = useMemo(() => 190 - value.length, [value]);
    const isPastLimit = useMemo(() => charsLeft < 0, [charsLeft]);

    const onEmojiPicked = useCallback((emoji: Emoji) => push(value => value + `<:${emoji.name}:${emoji.id}>`), []);
    const format = useCallback((value: string) => parseBioReact(value), [parseBioReact]);

    console.log({ value, charsLeft, isPastLimit });

    useEffect(() => {
        // Handle Ctrl + Z and Ctrl + Y
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                if (e.key === 'z') undo();
                if (e.key === 'y') redo();
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [value]);

    return (
        <div className={classNames(
            "edit-bio-editor",
            DiscordClassModules.Flex.flex,
            DiscordClassModules.Flex.directionColumn,
        )}>
            <hr style={{ width: '100%' }} />
            <div className="bio-preview">
                {format(value)}
            </div>
            <div className="textarea-wrapper">
                {/* TODO: Change to ChannelTextAreaContainer */}
                <textarea maxLength={190} rows={8.5} value={value}
                    onChange={e => push(e.target.value)}
                    className={classNames(
                        DiscordClassModules.ChannelTextArea.channelTextArea,
                        DiscordClassModules.ChannelTextArea.inner,
                        DiscordClassModules.ChannelTextArea.profileBioInput,
                    )}
                />
                <div className="control-panel">
                    <EmojiPickerButton onSelect={onEmojiPicked} />
                    <DateTimePicker onSubmit={(date, format) => push(value => value + `<t:${date.unix()}:${format}>`)} />
                    <span id="chars-left" data-limit-passed={isPastLimit}>{charsLeft}</span>
                </div>
            </div>
            <ButtonContainer justify="center">
                <CancelButton onClick={() => onButtonPressed(initialValue)}>Cancel</CancelButton>
                <SuccessButton disabled={isPastLimit} onClick={() => charsLeft >= 0 && onButtonPressed(value)}>Save</SuccessButton>
            </ButtonContainer>
        </div>
    )
}