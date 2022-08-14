import { Store, User } from '@discord';
import { PatchReturns } from 'danho-discordium/Patcher';
import { Roles } from 'danho-discordium/Patcher/UserPopoutBody/roles';

import EditBioButton from './components/EditBioButton';
import EditBioSection from './components/EditBioSection';
import UserBioEditor from './components/UserBioEditor';

import config from './config.json';
import styles from './styles.scss';

export default window.BDD.PluginUtils.buildPlugin({ ...config, styles }, Lib => {
    const Plugin = Lib.GetPlugin();
    const { CompiledReact, $ } = Lib.Modules;
    const { React } = CompiledReact;
    // TODO: Change to UserSettingsStore, when it's created
    const UserSettingsStore = Lib.finder.byProps("getAllSettings", "theme") as Store & Record<string, any>;

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

            UserSettingsStore.addChangeListener(this.onUserSettingsChanged);
        }

        onUserSettingsChanged = () => {
            const { theme } = this.finder.byProps("getAllSettings", "theme")?.getAllSettings() || "dark";
            this.userTheme = theme;
        }
        userTheme = UserSettingsStore.theme;

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
            const [user] = $(`.${props.className}`)?.propFromParent<User>("user") ?? [{ id: undefined }];
            const componentClassName = "edit-bio-section";

            if (user?.id !== Lib.Users.me.id) return;
            else if ([componentClassName].includes(lastChild().props?.className)) return;
            console.log({
                user, lastChild: lastChild()
            })

            result.props.children.push(<EditBioSection bio={props.userBio} className={componentClassName} />);
        }
        patchCreateGuildModal({ args: [props], result }: PatchReturns["CreateGuildModal"]) {
            $('.theme-light', false).map(el => el
                .removeClass('theme-light')
                .addClass(this.userTheme)
            );
        }
    } as any;
});