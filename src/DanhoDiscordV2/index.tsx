import { PatchReturns } from 'danho-discordium/Patcher';

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
                        UserBio: { isModal: true, condition: ({ EditBioElsewhere }) => EditBioElsewhere.enabled },
                    },
                    render: {
                        MemberRole: { selector: ["MemberRole"], condition: ({ BetterRoleColors }) => BetterRoleColors.enabled },
                    }
                },
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

        afterCreateGuildModal = ({ args: [props], result }: PatchReturns["CreateGuildModal"]) => {
            $('.theme-light', false).map(el => el
                .removeClass('theme-light')
                .addClass(Lib.Stores.ThemeStore.theme)
            );
        }

        patchMemberRole({ args: [props], result }: PatchReturns["MemberRole"]) {
            const roleStyle = result.props.children.props.style;
            if (!roleStyle || !roleStyle.borderColor) return;

            result.props.children.props.style.backgroundColor = roleStyle.borderColor.replace('0.6', '0.09');
        }
        SettingsPanel = SettingsPanel;
    } as any;
});