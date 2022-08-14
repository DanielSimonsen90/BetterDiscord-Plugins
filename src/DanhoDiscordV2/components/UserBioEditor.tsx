const { React, useState, useCallback, useMemo, classNames } = window.BDD.Modules.CompiledReact;
const { Button } = window.BDD.Components;
const { DiscordClassModules } = window.BDFDB;
const { SimpleMarkdown } = window.ZLibrary.DiscordModules;
const { defaultBlockParse: parse, defaultReactOutput: output } = SimpleMarkdown;

type UserBioEditorProps = {
    initialValue: string;
    onButtonPressed: (value: string) => void;
}
export default function UserBioEditor({ initialValue, onButtonPressed }: UserBioEditorProps) {
    const [value, setValue] = useState(initialValue);
    const format = useCallback((value: string) => output(parse(value)), [initialValue, parse, output]);
    const charsLeft = useMemo(() => 190 - value.length, [value]);

    return (
        <div className={classNames(
            "edit-bio-editor",
            DiscordClassModules.Flex.flex,
            DiscordClassModules.Flex.directionColumn,
        )}>
            <hr style={{ width: '100%' }} />
            {format(value)}
            <div className="textarea-wrapper">
                <textarea maxLength={190} rows={8.5} value={value}
                    onChange={e => setValue(e.target.value)}
                    className={classNames(
                        DiscordClassModules.ChannelTextArea.channelTextArea,
                        DiscordClassModules.ChannelTextArea.inner,
                        DiscordClassModules.ChannelTextArea.profileBioInput,
                    )}
                />
                <span id="chars-left">{charsLeft}</span>
            </div>
            <div className={classNames("button-container")}>
                <Button
                    look={Button.Looks.OUTLINED}
                    borderColor={Button.BorderColors.RED}
                    onClick={() => onButtonPressed(initialValue)}
                >Cancel</Button>
                <Button
                    look={Button.Looks.FILLED}
                    color={Button.Colors.GREEN}
                    onClick={() => onButtonPressed(value)}
                >Save</Button>
            </div>
        </div>
    )
}