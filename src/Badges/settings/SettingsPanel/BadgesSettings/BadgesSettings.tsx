import React, {
  useState,

  // React utils
  classNames,

  // Custom components
  SearchableList, UserListItem as UserComponent,
  ErrorBoundary,

  useForceUpdate,
} from "@react";

import { Button, Tooltip } from "@discord/components";
import { FormSection, Text } from "@dium/components";

import { buildContextMenu, buildTextItem } from '@danho-lib/ContextMenus';
import { ObjectUtils, StringUtils, UserUtils } from "@danho-lib/Utils";

import { CustomBadge } from "../../../components/CustomBadge";
import { CustomBadgesStore, BadgePositionsStore } from "../../../stores";
import CustomBadgeModifyForm from "./CustomBadgeModifyForm";

export default function CustomBadgesSettingsGroup() {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const forceUpdate = useForceUpdate();
  const modifyUserToBadge = useModifyUserToBadge(forceUpdate);
  CustomBadgesStore.useListener(forceUpdate);

  return (
    <FormSection title="Custom Badges">
      {selectedBadgeId && <CustomBadgeModifyForm
        selectedBadgeId={selectedBadgeId} 
        setSelectedBadgeId={setSelectedBadgeId} 
      />}

      <SearchableList items={CustomBadgesStore.customBadges} className="custom-badge-list"
        onSearch={(search, item) => [item.name, item.id, item.href].some(value => value?.toLowerCase().includes(search.toLowerCase()))}
        placeholder="Search for a badge to modify..."
        renderItem={(badge, i) => (
          <section className={classNames('custom-badge-container', i % 2 === 0 && 'custom-badge-container--alternate')} key={badge.id}>
            <CustomBadge key={badge.id} {...ObjectUtils.exclude(badge, 'size')} onContextMenu={e => {
              BdApi.ContextMenu.open(e as any, createCustomBadgeContextMenu({
                onEdit: () => setSelectedBadgeId(badge.id),
                onDelete: () => {
                  BdApi.UI.showConfirmationModal(`Delete ${badge.name}?`, (
                    <div>
                      <Text variant="text-md/normal">Are you sure you want to delete {badge.name}?</Text>
                      <Text variant="text-sm/normal">This action cannot be undone.</Text>
                    </div>
                  ), {
                    confirmText: `Delete ${badge.name}`,
                    onConfirm() {
                      BadgePositionsStore.deleteBadgePosition(badge.id);
                      CustomBadgesStore.deleteCustomBadge(badge.id);
                    }
                  })
                }
              }));
            }} />

            <aside className="custom-badge-info">
              <ErrorBoundary id="users-list">
                <div role="list" className="users">
                  {badge.userTags
                    ? badge.userTags.map(userTag => {
                      const user = UserUtils.getUserByUsername(userTag);
                      const onClick = () => modifyUserToBadge(badge.id, userTag, 'remove');
                      const child = user
                        ? <UserComponent user={user} onClick={onClick} />
                        : <Text variant="text-md/normal">{userTag}</Text>;

                      return (
                        <Tooltip text={`Remove ${badge.name} from ${UserUtils.getUsernames(user).shift()}`}>
                          {props => (
                            <div {...props} className="user-tooltip" onClick={onClick}>
                              {child}
                            </div>
                          )}
                        </Tooltip>
                      );
                    })
                    : <Text variant="text-sm/normal">None</Text>}
                </div>
              </ErrorBoundary>

              <ErrorBoundary id="potential-users">
                <SearchableList className="potential-users"
                  items={UserUtils.getUsersPrioritizingFriends().filter(user => badge.userTags ? badge.userTags.includes(user.username) === false : true)}
                  onSearch={(search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search.toLowerCase()))}
                  placeholder='Give this badge to...'
                  renderItem={user => (
                    <Tooltip text={`Give ${badge.name} to ${UserUtils.getUsernames(user).shift()}`}>
                      {props => {
                        const onClick = () => modifyUserToBadge(badge.id, user.username, 'add');
                        return (
                          <div {...props} className="user-tooltip" onClick={onClick}>
                            <UserComponent user={user} onClick={onClick} />
                          </div>
                        );
                      }}
                    </Tooltip>
                  )}
                />
              </ErrorBoundary>
            </aside>
          </section>
        )}
      >
        <Button type="button" className="create-new-badge-button"
          look={Button.Looks.FILLED} color={Button.Colors.GREEN} size={Button.Sizes.SMALL}
          onClick={() => setSelectedBadgeId(`custom-badge__${StringUtils.generateRandomId()}`)}>
          Create new badge
        </Button>
      </SearchableList>
    </FormSection>
  );
};


type CustomBadgeContextMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
}
function createCustomBadgeContextMenu({ onEdit, onDelete }: CustomBadgeContextMenuProps) {
  return buildContextMenu(
    buildTextItem('badge-edit', 'Edit', onEdit),
    buildTextItem('badge-delete', 'Delete', onDelete, {
      danger: true,
    }),
  );
}

function useModifyUserToBadge(forceUpdate: () => void) {
  return function modifyUserToBadge(badgeId: string, userTag: string, state: 'add' | 'remove') {
    const badge = CustomBadgesStore.current.customBadges[badgeId];
    if (!badge) return;
    if (badge.userTags && badge.userTags.includes(userTag) && state === 'add') return;
    if (badge.userTags && !badge.userTags.includes(userTag) && state === 'remove') return;

    badge.userTags = badge.userTags || [];
    if (state === 'add') badge.userTags.push(userTag);
    else badge.userTags = badge.userTags.filter(tag => tag !== userTag);

    CustomBadgesStore.upsetCustomBadge(badge);
    forceUpdate();
  };
}