import React, { useForceUpdate } from "@react";

import { buildContextMenu, buildTextItem } from "@danho-lib/ContextMenus";

import { CustomBadge, CustomBadgeData } from "src/Badges/components/CustomBadge";
import { BadgePositionsStoreEditor } from "src/Badges/stores";

import { ModifyBadgeData } from "./CustomBadgeModifyForm";

type PositionInputProps = {
  selectedBadge: Partial<CustomBadgeData>;
  modifyBadge: ModifyBadgeData;
  badgePositionsStoreEditor: BadgePositionsStoreEditor;
};

export default function PositionInput({ selectedBadge, modifyBadge, badgePositionsStoreEditor }: PositionInputProps) {
  const forceUpdate = useForceUpdate();
  const badges = badgePositionsStoreEditor.getSortedBadges();

  return (
    <div className="position-input" role="list">
      {badges.map((badge, position) => !badge || badge.id === selectedBadge.id ? (
        <CustomBadge key={modifyBadge.id} name="" iconUrl="" {...modifyBadge} href={modifyBadge.href ? '#' : undefined} />
      ) : (
        <CustomBadge key={badge.id} name={badge.name} style={badge.style} iconUrl={badge.iconUrl} href={badge.url ? '#' : undefined}
          onContextMenu={e => {
            BdApi.ContextMenu.open(e as any, buildContextMenu(
              buildTextItem('badge-move-before', `Move ${modifyBadge.name} before ${badge.name} (left)`, () => {
                badgePositionsStoreEditor.setBadgePosition(selectedBadge.id, position);
                forceUpdate();
              }),
              buildTextItem('badge-move-after', `Move ${modifyBadge.name} after ${badge.name} (right)`, () => {
                badgePositionsStoreEditor.setBadgePosition(selectedBadge.id, position + 1);
                forceUpdate();
              }),
            ));
          }} />
      ))}
    </div>
  );
};