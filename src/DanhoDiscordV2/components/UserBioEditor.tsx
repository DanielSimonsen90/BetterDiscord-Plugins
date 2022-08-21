import { Emoji } from "@discord";

const { parseBioReact, CompiledReact } = window.BDD.Modules;
const { React, useEffect, useCallback, useMemo, classNames, Components, Hooks } = CompiledReact;
const { SuccessButton, PrimaryButton, CancelButton, ButtonContainer, DateTimePicker } = Components;
const { useStateStack } = Hooks;
const { DiscordClassModules, LibraryComponents: { EmojiPickerButton } } = window.BDFDB;

type UserBioEditorProps = {
    initialValue: string;
    guildProfileMode: boolean;
    onButtonPressed: (guildProfileMode: boolean, value: string) => void;
    onBioModeChange: (guildProfileMode: boolean) => void;
}

export default function UserBioEditor({ initialValue, guildProfileMode, onButtonPressed, onBioModeChange }: UserBioEditorProps) {
    const [value, { push, undo, redo, clear }] = useStateStack(initialValue);
    const guildExists = useMemo(() => window.BDD.Utils.currentGuild !== null, []);

    const charsLeft = useMemo(() => 190 - value.length, [value]);
    const isPastLimit = useMemo(() => charsLeft < 0, [charsLeft]);

    const onEmojiPicked = useCallback((emoji: Emoji) => push(value => value + `<:${emoji.name}:${emoji.id}>`), []);
    const format = useCallback((value: string) => parseBioReact(value), [parseBioReact]);

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

    useEffect(() => {
        push(initialValue);
    }, [initialValue])

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
                        DiscordClassModules.Scroller.auto
                    )}
                />
                <div className="control-panel">
                    <EmojiPickerButton onSelect={onEmojiPicked} />
                    <DateTimePicker onSubmit={(date, format) => push(value => value + `<t:${date.unix()}:${format}>`)} />
                    <span id="chars-left" data-limit-passed={isPastLimit}>{charsLeft}</span>
                </div>
            </div>
            <ButtonContainer justify="center" flex={false} layout={["primary primary", "cancel success"]} rowGap='.5em'>
                {guildExists && <PrimaryButton onClick={() => onBioModeChange(!guildProfileMode)}>Switch to {guildProfileMode ? 'User' : 'Guild'} Bio</PrimaryButton>}
                <CancelButton onClick={() => onButtonPressed(guildProfileMode, initialValue)}>Cancel</CancelButton>
                <SuccessButton disabled={isPastLimit} onClick={() => charsLeft >= 0 && onButtonPressed(guildProfileMode, value)}>Save</SuccessButton>
            </ButtonContainer>
        </div>
    )
}