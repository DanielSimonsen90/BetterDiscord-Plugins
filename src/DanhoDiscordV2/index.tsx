import { PatchReturns } from 'danho-discordium/Patcher';
import { Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';
import config from './config.json';

export default window.BDD.PluginUtils.buildPlugin(config, Lib => {
    const Plugin = Lib.GetPlugin();
    const { React, DanhoModules } = Lib.Modules;
    const { $, CompiledReact } = DanhoModules;

    const { useState, useCallback, render, classNames } = CompiledReact;
    const { Button } = CompiledReact.Components.Discord;

    type EditBioButtonProps = {
        userBioClassName: string,
        userBio: string,
        marginTop: string
    }
    function EditBioButton({ userBioClassName, userBio, marginTop }: EditBioButtonProps) {
        const onEditBioClicked = () => {
            const container = $(`.${userBioClassName.replace(/ +/g, '.')}`).element;
            render((
                <UserBioEditor {...{
                    container, marginTop,
                    initialValue: userBio,
                }} />
            ), container)
        }

        return (
            <Button className={marginTop}
                look={Button.Looks.OUTLINED} color={Button.Colors.WHITE}
                onClick={onEditBioClicked}
            >
                Edit Bio
            </Button>
        )
    }

    type UserBioEditorProps = {
        container: HTMLElement;
        initialValue: string;
        marginTop: string
    }
    function UserBioEditor({ container, initialValue, marginTop }: UserBioEditorProps) {
        const [value, setValue] = useState(initialValue);

        const { DiscordClassModules } = window.BDFDB;

        const format = useCallback((value: string) => {
            const SimpleMarkdown = window.ZLibrary.DiscordModules.SimpleMarkdown;
            const { defaultBlockParse: parse, defaultReactOutput: output } = SimpleMarkdown;
            return output(parse(value));
        }, []);
        const renderUserBio = useCallback((value: string) => render((
            <>
                {format(value)}
                <EditBioButton {...{
                    userBioClassName: container.className,
                    userBio: value,
                    marginTop,
                }} />
            </>
        ), container), [container, format]);
        const onCancel = useCallback(() => renderUserBio(initialValue), [initialValue, renderUserBio]);
        const onSave = useCallback(() => {
            console.log("Edit bio saved", value);
            renderUserBio(value);
        }, [value, renderUserBio]);

        return (
            <div className={classNames(
                DiscordClassModules.Flex.flex,
                DiscordClassModules.Flex.directionColumn,
            )} style={{ gap: "1em" }}>
                {format(value)}
                <textarea value={value} onChange={e => setValue(e.target.value)}
                    className={classNames(
                        DiscordClassModules.ChannelTextArea.channelTextArea,
                        DiscordClassModules.ChannelTextArea.inner,
                        DiscordClassModules.ChannelTextArea.profileBioInput,
                        // marginTop
                    )}
                    style={{
                        backgroundColor: "var(--background-secondary)",
                        color: "var(--text-normal)",
                        width: "auto",
                        resize: "vertical",
                        padding: "0.5rem",
                        minHeight: "1rem",
                        height: "auto",
                    }}
                />
                <div className={CompiledReact.classNames(
                    "button-container",
                    // marginTop
                )}>
                    <Button
                        look={Button.Looks.OUTLINED}
                        borderColor={Button.BorderColors.RED}
                        onClick={onCancel}
                    >Cancel</Button>
                    <Button
                        look={Button.Looks.FILLED}
                        color={Button.Colors.GREEN}
                        onClick={onSave}
                    >Save</Button>
                </div>
            </div>
        )
    }

    return class DanhoDiscordV2 extends Plugin {
        async start() {
            super.start({
                after: {
                    default: {
                        UserPopoutBody: { isModal: true },
                        UserBio: { isModal: true },
                        CreateGuildModal: { isModal: true },
                    },
                }
            });

            this.ZLibrary.DiscordModules.UserSettingsStore.addChangeListener(this.onUserSettingsChanged);
        }

        onUserSettingsChanged = () => {
            const { theme } = this.ZLibrary.DiscordModules.UserSettingsStore.getAllSettings();
            this.userTheme = theme;
        }
        userTheme = this.ZLibrary.DiscordModules.UserSettingsStore.theme;

        patchUserPopoutBody({ args: [props], result }: PatchReturns["UserPopoutBody"]) {
            const userPopoutBody = $(`.${result.props.className}`);
            if (!userPopoutBody.element) return;

            const [rolesListProps] = userPopoutBody.propsWith<Roles>("userRoles");
            if (!rolesListProps) return;

            const rolesList = $(`.${rolesListProps.className}`);
            if (!rolesList.element) return;

            rolesList.children('* > div[class*="role"]:not(div[class*="addButton"])').forEach((role, i) => {
                if (role.style?.borderColor) role.style.backgroundColor = role.style.borderColor?.replace('0.6', '0.09');
            });
        }
        patchUserBio({ args: [props], result }: PatchReturns["UserBio"]) {
            const lastChild = () => result.props.children[result.props.children.length - 1] as any;

            if (["button", EditBioButton].includes(lastChild().type)
                || lastChild().type === "div"
                && lastChild().props.className.includes("button-container"))
                return;

            result.props.children.push(
                <EditBioButton marginTop={this.ZLibrary.DiscordClassModules.Margins.marginTop20}
                    userBio={props.userBio}
                    userBioClassName={props.className}
                />
            );
        }
        patchCreateGuildModal({ args: [props], result }: PatchReturns["CreateGuildModal"]) {
            $('.theme-light', false).map(el => el
                .removeClass('theme-light')
                .addClass(this.userTheme)
            );
        }
    } as any;
});