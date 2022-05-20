import { BDFDBPluginParams } from '../../../../danho-bd/libraries/BDFDB';
import DanhoPlugin from '../base/DanhoPlugin';
import IConfigData from '../base/IConfigData';
import IPlugin from '../base/IPlugin';
import { UserProfileBadgeList } from '../base/ProcessEvent';

export class CustomBadgesBuilder {
    static config: IConfigData = {
        info: {
            name: 'DanhoCustomBadges',
            description: 'A plugin that adds custom badges to users.',
            author: 'Danho#2105',
            version: '1.0.0'
        }
    }
    static build(params: BDFDBPluginParams) {
        return CustomBadges(params, this.config);
    }
}

export default function CustomBadges([Plugin, BDFDB, ZLibrary]: BDFDBPluginParams, config: IConfigData): IPlugin {
    return class CustomBadges extends DanhoPlugin([Plugin, BDFDB, ZLibrary], config) {
        onLoad() {
            this.patchedModules = {
                after: {
                    UserProfileBadgeList: 'default',
                    MemberListItem: "render"
                }
            };

            this.css = `
                .danho-badge {
                    display: grid;
                    place-items: center;
                    box-sizing: border-box;
                    position: relative;
                }
                .danho-badge img {
                    width: 18px;
                    height: 18px;
                }
                .danho-badge:hover::before {
                    content: attr(aria-label);
                    position: absolute;
                    transform: translate(0%, -150%);
                    width: max-content;

                    -webkit-box-shadow: var(--elevation-high);
                    box-shadow: var(--elevation-high);
                    background-color: var(--background-floating);
                    color: #dcddde;
                    border-radius: 5px;
                    font-size: 16px;
                    line-height: 20px;
                    padding: 8px 12px;
                    overflow-wrap: break-word
                }
            `;

        }

        public getSettingsPanel(collapseStates = {}) {
            
        }

        public processUserProfileBadgeList(e: UserProfileBadgeList) {
            const badges = Array.isArray(e.returnvalue.props.children) ? e.returnvalue.props.children : [];


            return e.returnvalue;
        }
    } as any;
};