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