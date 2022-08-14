import { Store, User } from '@discord';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';

import EditBioSection from './components/EditBioSection';

import config from './config.json';
import styles from './styles.scss';
import { SettingsPanel, Settings, settings } from './components/Settings';

export default window.BDD.PluginUtils.buildPlugin({ ...config, styles, settings }, Lib => {
    const Plugin = Lib.GetPlugin();
    const { CompiledReact, $ } = Lib.Modules;
    const { React } = CompiledReact;
    // TODO: Change to UserSettingsStore, when it's created
    const UserSettingsStore = Lib.finder.byProps("getAllSettings", "theme") as Store & Record<string, any>;

    return class DanhoDiscordV2 extends Plugin<Settings> {
        async start() {
            super.start({
                after: {
                    default: {
                        UserPopoutBody: { isModal: true, condition: ({ BetterRoleColors, EditBioElsewhere }) => BetterRoleColors.enabled || EditBioElsewhere.enabled },
                        UserBio: { isModal: true, condition: ({ EditBioElsewhere }) => EditBioElsewhere.enabled },
                        CreateGuildModal: { isModal: true },
                    },
                }
            });

            UserSettingsStore.addChangeListener(this.onUserSettingsChanged);
        }

        onUserSettingsChanged = () => {
            const { theme } = this.finder.byProps("getAllSettings", "theme")?.getAllSettings() || "dark";
            this.userTheme = theme;
        }
        userTheme = UserSettingsStore.theme;

        patchUserPopoutBody({ result }: PatchReturns["UserPopoutBody"]) {
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
            const [user] = $(`.${props.className}`)?.propFromParent<User>("user") ?? [{ id: undefined }];
            const componentClassName = "edit-bio-section";
            const { preference } = this.settings.current.EditBioElsewhere;
            if (user?.id !== Lib.Users.me.id) return;

            const lastChild = () => result.props.children[result.props.children.length - 1] as any;
            if ([componentClassName].includes(lastChild().props?.className)) return;

            result.props.children.push(<EditBioSection renderType={preference} bio={props.userBio} className={componentClassName} />);
        }

        patchCreateGuildModal({ args: [props], result }: PatchReturns["CreateGuildModal"]) {
            $('.theme-light', false).map(el => el
                .removeClass('theme-light')
                .addClass(this.userTheme)
            );
        }

        SettingsPanel = SettingsPanel;
    } as any;
});