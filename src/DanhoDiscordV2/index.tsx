import { User } from '@discord';
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

    return class DanhoDiscordV2 extends Plugin<Settings> {
        async start() {
            super.start({
                after: {
                    default: {
                        UserPopoutBody: { isModal: true, condition: ({ BetterRoleColors, EditBioElsewhere }) => BetterRoleColors.enabled || EditBioElsewhere.enabled },
                        UserBio: { isModal: true, condition: ({ EditBioElsewhere }) => EditBioElsewhere.enabled },
                        CreateGuildModal: { isModal: true },
                    }
                },
            });
        }

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
            const userId = $(s => s.id("popout").data("user-id")).attr("data-user-id")
            const componentClassName = "edit-bio-section";
            const { preference } = this.settings.current.EditBioElsewhere;
            if (userId !== Lib.Users.me.id) return;

            const resultProps = result.props.children.props;
            const lastChild = resultProps.children[resultProps.children.length - 1] as any;
            if ([componentClassName].includes(lastChild.props?.className)) return;

            resultProps.children.push(<EditBioSection renderType={preference} className={componentClassName} />);
        }

        patchCreateGuildModal({ args: [props], result }: PatchReturns["CreateGuildModal"]) {
            $('.theme-light', false).map(el => el
                .removeClass('theme-light')
                .addClass(Lib.Stores.UserSettingsStore.theme)
            );
        }

        SettingsPanel = SettingsPanel;
    } as any;
});