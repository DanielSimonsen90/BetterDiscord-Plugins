import { Emoji } from "@discord";

const { CompiledReact, Discord, $, moment } = window.BDD.Modules;
const { React, useState, useEffect, useCallback, useMemo, useRef, classNames, Components, Hooks } = CompiledReact;
const { SuccessButton, PrimaryButton, CancelButton, ButtonContainer, DateTimePicker, ChannelEditorContainer, ChatInputTypes } = Components;
const { DiscordClassModules, LibraryComponents: { EmojiPickerButton } } = window.BDFDB;
const { ChannelClass } = Discord;

const DISCORD_BIO_LENGTH = 190;

type UserBioEditorProps = {
    initialValue: string;
    guildProfileMode: boolean;
    onButtonPressed: (guildProfileMode: boolean, value: string) => void;
    onBioModeChange: (guildProfileMode: boolean) => void;
}

function getEditor() {
    const el = $(s => s.className('channel-editor-container'));
    if (!el.element) return null;

    const [editor] = el.prop("editor", "children.props");
    return editor;
}

export default function UserBioEditor({ initialValue, guildProfileMode, onButtonPressed, onBioModeChange }: UserBioEditorProps) {
    const guildExists = useMemo(() => window.BDD.Utils.currentGuild !== null, []);
    const [editor, setEditor] = useState<any>(null);
    const push = useCallback((value: string) => (editor ?? getEditor()).insertTextData({ getData: () => value }), [editor]);

    const [value, setValue] = useState(initialValue);
    const charsLeft = useMemo(() => DISCORD_BIO_LENGTH - value.length, [value]);
    const isPastLimit = useMemo(() => charsLeft < 0, [charsLeft]);

    const onEmojiPicked = useCallback((emoji: Emoji) => push(`<:${emoji.name}:${emoji.id}>`), []);

    useEffect(() => {
        setEditor(getEditor());
    }, [])

    useEffect(() => {
        const _editor = editor ?? getEditor();
        if (!_editor) return;

        for (let i = 0; i < DISCORD_BIO_LENGTH; i++) {
            _editor.deleteBackward(_editor);
        }

        _editor.insertTextData({ getData: () => initialValue });

        if (_editor && !editor) {
            setEditor(_editor);
        }
    }, [initialValue]);

    return (
        <div className={classNames(
            "edit-bio-editor",
            DiscordClassModules.Flex.flex,
            DiscordClassModules.Flex.directionColumn,
        )}>
            <hr style={{ width: '100%' }} />
            <div className="textarea-wrapper">
                <ChannelEditorContainer className="channel-editor-container" channel={new ChannelClass("bio-editor")} onKeyDown={e => {
                    if (e.key === "Enter" && e.ctrlKey) onButtonPressed(guildProfileMode, value);
                }}
                    textValue={value} onChange={(_, v) => setValue(v ?? initialValue)} maxCharacterCount={190} useSlate type={ChatInputTypes.PROFILE_BIO_INPUT}
                />
                <div className="control-panel">
                    <EmojiPickerButton onSelect={onEmojiPicked} />
                    <DateTimePicker onSubmit={(date, format) => push(`<t:${date.unix()}:${format}>`)} />
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