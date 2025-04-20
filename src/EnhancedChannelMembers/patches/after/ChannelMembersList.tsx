import React, { ReactNode, useState } from "@react";
import { UserListItem } from "@components";
import { Text } from "@discord/components";
import { RowData } from "@discord/types";

import { Logger, Patcher } from "@injections";
import { ChannelMembersList } from "@injections/patched/ChannelMembersList";
import { GuildUtils, UserUtils } from "@utils";

import { Settings } from '../../settings/Settings';

export default function afterChannelMembersList() {
  Patcher.patchComponentBySourceStrings('ChannelMembers', "renderRow", ({ component, props }) => {
    const ChannelMembersList = component as ChannelMembersList;

    const Wrapper = () => {
      const [row, setRow] = useState<RowData>();
      const [section, setSection] = useState<RowData>();

      class DanhoChannelMembersList extends ChannelMembersList {
        constructor(props: any) {
          super(props);

          this.__originalRenderRow = 'renderRow' in this ? this.renderRow : undefined;
          this.renderRow = this.patchedRenderRow.bind(this);

          this.__originalRenderSection = 'renderSection' in this ? this.renderSection : undefined;
          this.renderSection = this.patchedRenderSection.bind(this);
        }

        declare __originalRenderRow: (data: RowData) => ReactNode;
        public patchedRenderRow(data: RowData) {
          const rowProps = this.getRowProps(data);

          if (!rowProps) return this.__originalRenderRow(data);
          if (Settings.current.hideContentInventory && rowProps.type === 'CONTENT_INVENTORY') return null;
          if (Settings.current.pushYouToTop && rowProps.type === 'MEMBER' && rowProps.userId === UserUtils.me.id) {
            if (!row) setRow(data);
            else return null;
          }

          return this.__originalRenderRow(data);
        }

        declare __originalRenderSection: (data: RowData) => ReactNode;
        public patchedRenderSection(data: RowData) {
          if (Settings.current.pushYouToTop) {
            if (data.section === row?.section && !section) setSection(data);
            if (data.section === 0) return (
              <div className="danho-top-member-header">
                {this.renderMySection()}
                {this.renderMe()}
              </div>
            );
          }
          if (Settings.current.hideContentInventory && data.section === 0) return null;

          return this.__originalRenderSection(data);
        }

        private renderMySection() {
          return section
            ? <Text>{UserUtils.getUsernames(UserUtils.me).shift()}</Text>
            : this.__originalRenderSection(section);
        }
        private renderMe() {
          return row
            ? this.__originalRenderRow(row)
            : <UserListItem className="top-member"
              user={UserUtils.me} roleColorId={GuildUtils.me.colorRoleId}
              showStatus showActivity openPopoutOnClick
            />;
        }
      }

      return <DanhoChannelMembersList {...props} />;
    };

    return <Wrapper />;
  });
}