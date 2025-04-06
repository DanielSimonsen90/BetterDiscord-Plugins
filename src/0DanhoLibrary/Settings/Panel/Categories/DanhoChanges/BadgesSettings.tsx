import {
  // React
  React, useState, 

  // React utils
  classNames,

  // Custom components
  SearchableList, User as UserComponent,
  FormItem, FormItemFromModel, EmptyFormGroup,
  ErrorBoundary,

  useForceUpdate,
} from "@react";

import { Button, Tooltip, UserProfileBadge } from "@discord/components";
import { User } from "@discord/types";
import { Text } from "@dium/components";
import { UserProfileStore } from "@stores";

import { buildContextMenu, buildTextItem } from '@danho-lib/ContextMenus';
import { ObjectUtils, UrlUtils, UserUtils } from "@danho-lib/Utils";
import { Logger } from "@danho-lib/dium/api/logger";

import { CustomBadge, CustomBadgeData } from "src/0DanhoLibrary/features/danho-enhancements/badges/components/CustomBadge";
import CustomBadgesStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/CustomBadgesStore";
import DiscordBadgeStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/DiscordBadgeStore";
import BadgePositionsStore, { BadgePositionsStoreEditor } from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/BadgePositionsStore";

import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (<>
    <Setting setting="useClientCustomBadges" {...props} />
    {props.settings.useClientCustomBadges && <CustomBadgesSettingsGroup {...props} />}
  </>);
});

type ModifyBadgeData = Pick<CustomBadgeData, 'id' | 'name' | 'iconUrl' | 'href' | 'userTags' | 'size'>;

const CustomBadgesSettingsGroup = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  const [modifyBadge, setModifyBadge] = useState<ModifyBadgeData | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<ModifyBadgeData | null>(null);
  const [badgeIdsInTooltip, setBadgeIdsInTooltip] = useState<boolean>(false);

  const forceUpdate = useForceUpdate();
  const modifyUserToBadge = useModifyUserToBadge(forceUpdate);
  const badgePositionsStoreEditor = BadgePositionsStore.useEditorStore();

  const formItemModel = ObjectUtils.exclude(modifyBadge, 'userTags');
  const hasChanges = !ObjectUtils.isEqual(modifyBadge, selectedBadge);
  const isNewBadge = (
    modifyBadge &&
    !(modifyBadge.id in CustomBadgesStore.customBadges) &&
    !(selectedBadge.id in CustomBadgesStore.customBadges)
  );

  const PotentialUser = ({ user, modifyBadge }: { user: User, modifyBadge: ModifyBadgeData; }) => {
    const displayProfile = UserProfileStore.getUserProfile(user.id);
    const badges: Array<UserProfileBadge> = (
      displayProfile?.badges ??
      displayProfile?.getBadges() ??
      []
    );
    const addedBadges = CustomBadgesStore.current.users[user.id] ?? [];
    const customBadges = CustomBadgesStore.customBadges
      .filter(badge => badge.userTags?.includes(user.username));

    const badgeIds = [
      ...badges.map(badge => badge.id),
      ...addedBadges,
      ...customBadges.map(badge => badge.id),
    ];

    if (!badgeIds.includes(selectedBadge.id)) badgeIds.push(modifyBadge.id);

    const compiledBadges = badgePositionsStoreEditor.sort(badgeIds).map<CustomBadgeData>(badgeId => {
      const badge = (
        badges.find(badge => badge.id === badgeId)
          || badgeId in DiscordBadgeStore.current ? DiscordBadgeStore.current[badgeId] : null
      );
      if (badge) return {
        id: badge.id,
        name: badgeIdsInTooltip ? badge.id : badge.description,
        iconUrl: UrlUtils.badgeIcon(badge.icon),
        href: badge.link,
      };

      if (badgeId === modifyBadge.id) return modifyBadge;

      const customBadge = customBadges.find(badge => badge.id === badgeId);
      if (customBadge) return {
        ...customBadge,
        name: badgeIdsInTooltip ? customBadge.id : customBadge.name,
      };

      Logger.warn(`Badge ${badgeId} not found in DiscordBadgeStore or CustomBadgesStore`, {
        badges,
        modifyBadge,
        addedBadges,
        customBadges,
      });
      return null;
    }).filter(Boolean) as CustomBadgeData[];

    return (
      <Tooltip text={`Give ${modifyBadge.name} to ${UserUtils.getUsernames(user).shift()}`}>
        {props => (
          <div className='tooltip-inner' {...props}>
            <UserComponent user={user} onClick={() => setModifyBadge(current => ({ ...current, userTags: current.userTags ? [...current.userTags, user.username] : [user.username] }))}>
              <div className="danho-user-badge-list">
                {compiledBadges.map(badge => <CustomBadge key={badge.id} {...badge} />)}
              </div>
            </UserComponent>
          </div>
        )}
      </Tooltip>
    );
  };

  function selectBadge(badge: CustomBadgeData) {
    setModifyBadge(badge);
    setSelectedBadge(badge);
  }

  return (
    <FormSection title="Custom Badges">
      {modifyBadge && (
        <form className="custom-badge-modify-container">
          <FormItemFromModel model={formItemModel} property='id' onChange={id => setModifyBadge(current => ({ ...current, id }))} />
          <FormItemFromModel model={formItemModel} property='name' onChange={name => setModifyBadge(current => ({ ...current, name }))} />
          <FormItemFromModel model={formItemModel} property='iconUrl' onChange={iconUrl => setModifyBadge(current => ({ ...current, iconUrl }))} label="Url to icon" />
          <FormItemFromModel model={formItemModel} property='href' onChange={href => setModifyBadge(current => ({ ...current, href }))} label="External URL when clicked" />

          <FormItem label="Show badge id in tooltip instead of its name" value={badgeIdsInTooltip} onChange={value => setBadgeIdsInTooltip(value)} />
          <SearchableList items={UserUtils.getUsersPrioritizingFriends()}
            onSearch={(search, item) => UserUtils.getUsernames(item, true).includes(search.toLowerCase())}
            children={user => <PotentialUser user={user} modifyBadge={modifyBadge} />}
          />

          <EmptyFormGroup label="Badge position" name="position">
            {() => <PositionInput modifyBadge={modifyBadge} badgePositionsStoreEditor={badgePositionsStoreEditor} />}
          </EmptyFormGroup>
          <FormItemFromModel model={formItemModel} property='size' defaultValue='20px' onChange={size => setModifyBadge(current => ({ ...current, size: size as any }))} />

          <div className="button-panel">
            <Button type="reset" color={Button.Colors.RED} look={Button.Looks.OUTLINED} disabled={!hasChanges} onClick={() => selectBadge(null)}>
              Deselect without saving
            </Button>
            <Button type="submit" color={isNewBadge ? Button.Colors.GREEN : Button.Colors.YELLOW} look={Button.Looks.FILLED} disabled={!hasChanges} onClick={() => {
              if (!modifyBadge) return;
              if (modifyBadge.id !== selectedBadge.id) CustomBadgesStore.deleteCustomBadge(selectedBadge.id);
              CustomBadgesStore.updateCustomBadge(modifyBadge);
              selectBadge(null);
            }}>
              Save
            </Button>
          </div>
        </form>
      )}

      {CustomBadgesStore.customBadges.map((badge, i) => (
        <section className={classNames('custom-badge-container', i % 2 === 0 && 'custom-badge-container--alternate')} key={badge.id}>
          <CustomBadge key={badge.id} {...ObjectUtils.exclude(badge, 'size')} onContextMenu={e => {
            BdApi.ContextMenu.open(e as any, createCustomBadgeContextMenu({
              onEdit: () => selectBadge(badge)
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
                items={UserUtils.getUsersPrioritizingFriends().filter(user => badge.userTags?.includes(user.username) === false)}
                onSearch={(search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search.toLowerCase()))}
                placeholder='Give this badge to...'
              >
                {user => (
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
              </SearchableList>
            </ErrorBoundary>
          </aside>
        </section>
      ))}
    </FormSection>
  );
});

type PositionInputProps = {
  modifyBadge: ModifyBadgeData;
  badgePositionsStoreEditor: BadgePositionsStoreEditor;
};

function PositionInput({ modifyBadge, badgePositionsStoreEditor }: PositionInputProps) {
  const forceUpdate = useForceUpdate();
  const badges = badgePositionsStoreEditor.getSortedBadges();

  return (
    <div className="position-input" role="list">
      {badges.map((badge, position) => badge.id === modifyBadge.id ? (
        <CustomBadge key={modifyBadge.id} {...modifyBadge} href={modifyBadge.href ? '#' : undefined} />
      ) : (
        <CustomBadge key={badge.id} name={badge.name} style={badge.style} iconUrl={badge.iconUrl} href={badge.url ? '#' : undefined}
          onContextMenu={e => {
            BdApi.ContextMenu.open(e as any, buildContextMenu(
              buildTextItem('badge-move-before', `Move ${modifyBadge.name} before ${badge.name} (left)`, () => {
                badgePositionsStoreEditor.setBadgePosition(modifyBadge.id, position);
                forceUpdate();
              }),
              buildTextItem('badge-move-after', `Move ${modifyBadge.name} after ${badge.name} (right)`, () => {
                badgePositionsStoreEditor.setBadgePosition(modifyBadge.id, position + 1);
                forceUpdate();
              }),
            ));
          }} />
      ))}
    </div>
  );
};

function createCustomBadgeContextMenu({ onEdit }: { onEdit: () => void; }) {
  return buildContextMenu(
    buildTextItem('badge-edit', 'Edit', onEdit)
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

    CustomBadgesStore.updateCustomBadge(badge);
    forceUpdate();
  };
}