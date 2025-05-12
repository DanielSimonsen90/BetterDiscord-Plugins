import React, { useState, classNames } from "@react";
import { SearchableList, UserListItem, ErrorBoundary, SearchableListProps } from '@components';
import { useForceUpdate } from "@hooks";

import { Button, Tooltip } from "@discord/components";
import { FormSection, Text } from "@dium/components";

import { buildContextMenu, buildTextItem } from '@context-menus';
import { ObjectUtils, StringUtils, UserUtils } from "@utils";

import { CustomBadge, CustomBadgeData } from "../../components/CustomBadge";
import { CustomBadgesStore } from "../../stores";
import CustomBadgeModifyForm from "./CustomClientBadgesSettings/CustomBadgeModifyForm";
import { Logger } from "@injections";

type Props<TItem> = Pick<SearchableListProps<TItem>, 'items' | 'onSearch'> & {
  type: 'remove' | 'delete';
  allowCreateNew?: boolean;
  allowEdit?: boolean;
  onUserBadgesUpdate: (badge: CustomBadgeData, userTag: string, state: 'add' | 'remove') => void;
  onRemoveOrDelete?: (badgeId: string) => void;
};

export default function CustomBadgesSettingsGroup<TItem extends CustomBadgeData>({
  items, onSearch,
  type, onRemoveOrDelete, onUserBadgesUpdate,
  allowEdit, allowCreateNew
}: Props<TItem>) {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const forceUpdate = useForceUpdate();
  const modifyUserToBadge = useModifyUserToBadge(forceUpdate, onUserBadgesUpdate);
  CustomBadgesStore.useListener(forceUpdate);

  return (
    <FormSection title="Your Custom Badges">
      {selectedBadgeId && <CustomBadgeModifyForm
        selectedBadgeId={selectedBadgeId}
        setSelectedBadgeId={setSelectedBadgeId}
      />}

      <SearchableList items={items} className="custom-badge-list"
        onSearch={onSearch}
        placeholder="Search for a badge to modify..."
        renderItem={(badge, i) => (
          <section className={classNames('custom-badge-container', i % 2 === 0 && 'custom-badge-container--alternate')} key={badge.id}>
            <CustomBadge key={badge.id} {...ObjectUtils.exclude(badge, 'size')} onContextMenu={e => {
              BdApi.ContextMenu.open(e as any, createCustomBadgeContextMenu({
                onEdit: allowEdit ? () => setSelectedBadgeId(badge.id) : undefined,
                onDelete: onRemoveOrDelete ? () => {
                  BdApi.UI.showConfirmationModal(`${StringUtils.pascalCaseFromCamelCase(type)} ${badge.name}?`, (
                    <div>
                      <Text variant="text-md/normal">Are you sure you want to {type} {badge.name}?</Text>
                      <Text variant="text-sm/normal">This action cannot be undone.</Text>
                    </div>
                  ), {
                    confirmText: `${StringUtils.pascalCaseFromCamelCase(type)} ${badge.name}`,
                    onConfirm: () => onRemoveOrDelete(badge.id)
                  });
                } : undefined
              }));
            }} />

            <aside className="custom-badge-info">
              <ErrorBoundary id="users-list">
                <div role="list" className="users">
                  {badge.userTags
                    ? badge.userTags.map(userTag => {
                      const user = UserUtils.getUserByUsername(userTag);
                      if (!user) Logger.warn(`User "${userTag}" not found`);
                      const onClick = () => modifyUserToBadge(badge, userTag, 'remove');
                      const child = user
                        ? <UserListItem user={user} onClick={onClick} />
                        : <Text variant="text-md/normal">{userTag}</Text>;

                      return (
                        <Tooltip text={`Remove ${badge.name} from ${user ? UserUtils.getUsernames(user).shift() : userTag}`}>
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
                        const onClick = () => modifyUserToBadge(badge, user.username, 'add');
                        return (
                          <div {...props} className="user-tooltip" onClick={onClick}>
                            <UserListItem user={user} onClick={onClick} />
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
        {allowCreateNew ? (
          <Button type="button" className="create-new-badge-button"
            look={Button.Looks.FILLED} color={Button.Colors.GREEN} size={Button.Sizes.SMALL}
            onClick={() => setSelectedBadgeId(`custom-badge__${StringUtils.generateRandomId()}`)}>
            Create new badge
          </Button>
        ) : null}
      </SearchableList>
    </FormSection>
  );
};


type CustomBadgeContextMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};
function createCustomBadgeContextMenu({ onEdit, onDelete }: CustomBadgeContextMenuProps) {
  return buildContextMenu(
    buildTextItem('badge-edit', 'Edit', onEdit),
    buildTextItem('badge-delete', 'Delete', onDelete, {
      danger: true,
    }),
  );
}

function useModifyUserToBadge(
  forceUpdate: () => void, 
  onUpdate: (badge: CustomBadgeData, userTag: string, state: 'add' | 'remove') => void
) {
  return function modifyUserToBadge(badge: CustomBadgeData, userTag: string, state: 'add' | 'remove') {
    if (badge.userTags && badge.userTags.includes(userTag) && state === 'add') return;
    if (badge.userTags && !badge.userTags.includes(userTag) && state === 'remove') return;

    onUpdate(badge, userTag, state);

    forceUpdate();
  };
}