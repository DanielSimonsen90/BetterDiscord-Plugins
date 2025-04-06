import {
  // React
  React,
  useCallback, useRef, useState, useImperativeHandle,

  // React utils
  classNames,

  // Custom components
  SearchableList, User,
  FormItem, FormItemFromModel, EmptyFormGroup,
  ErrorBoundary,

  // Custom hooks
  useClickOutside, useForceUpdate,
  useEffect,
} from "@react";

import { Button, Tooltip, UserProfileBadge } from "@discord/components";
import { Switch, Text } from "@dium/components";
import { UserProfileStore } from "@stores";

import { buildContextMenu, buildTextItem } from '@danho-lib/ContextMenus';
import { ObjectUtils, UrlUtils, UserUtils } from "@danho-lib/Utils";
import { Logger } from "@danho-lib/dium/api/logger";

import CustomBadgesStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/CustomBadgesStore";
import { CustomBadge, CustomBadgeData } from "src/0DanhoLibrary/features/danho-enhancements/badges/components/CustomBadge";
import sortBadges, { getPosition } from "src/0DanhoLibrary/features/danho-enhancements/badges/utils/sortBadges";
import DiscordBadgeStore from "src/0DanhoLibrary/features/danho-enhancements/badges/stores/DiscordBadgeStore";

import CreateSettingsGroup from "../../_CreateSettingsGroup";

export default CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  return (<>
    <Setting setting="useClientCustomBadges" {...props} />
    {props.settings.useClientCustomBadges && <CustomBadgesSettingsGroup {...props} />}
  </>);
});

type ModifyBadgeData = Pick<CustomBadgeData, 'id' | 'name' | 'iconUrl' | 'href' | 'userTags' | 'position' | 'size'>;

const CustomBadgesSettingsGroup = CreateSettingsGroup((React, props, Setting, { FormSection }) => {
  const [modifyBadge, setModifyBadge] = useState<ModifyBadgeData | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<ModifyBadgeData | null>(null);
  const [badgeIdsInTooltip, setBadgeIdsInTooltip] = useState<boolean>(false);
  const forceUpdate = useForceUpdate();
  const modifyUserToBadge = useModifyUserToBadge(forceUpdate);

  const formItemModel = ObjectUtils.exclude(modifyBadge, 'userTags', 'position');
  const hasChanges = !ObjectUtils.isEqual(modifyBadge, selectedBadge);
  const isNewBadge = (
    modifyBadge &&
    !(modifyBadge.id in CustomBadgesStore.customBadges) &&
    !(selectedBadge.id in CustomBadgesStore.customBadges)
  );

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
            onSearch={(search, item) => UserUtils.getUsernames(item, true).includes(search)}
          >
            {user => {
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
              badgeIds.splice(getPosition(modifyBadge.position, badgeIds), 0, modifyBadge.id);
              const sortedBadges = sortBadges(badgeIds);

              const compiledBadges = sortedBadges.map<CustomBadgeData>(badgeId => {
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

                const customBadge = customBadges.find(badge => badge.id === badgeId);
                if (customBadge) return {
                  ...customBadge,
                  name: badgeIdsInTooltip ? customBadge.id : customBadge.name,
                };

                if (badgeId === modifyBadge.id) return modifyBadge;

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
                      <User user={user} onClick={() => setModifyBadge(current => ({ ...current, userTags: current.userTags ? [...current.userTags, user.username] : [user.username] }))}>
                        <div className="danho-user-badge-list">
                          {compiledBadges.map(badge => <CustomBadge key={badge.id} {...badge} />)}
                        </div>
                      </User>
                    </div>
                  )}
                </Tooltip>
              );
            }}
          </SearchableList>

          <EmptyFormGroup label="Badge position" name="position">
            {ref => <PositionInput ref={ref} value={modifyBadge.position} onChange={position => setModifyBadge(current => ({ ...current, position }))} />}
          </EmptyFormGroup>
          <FormItemFromModel model={formItemModel} property='size' defaultValue='20px' onChange={size => setModifyBadge(current => ({ ...current, size: `${Number(size)}px` }))} />

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
          <CustomBadge key={badge.id} {...badge} onContextMenu={e => {
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
                      ? <User user={user} onClick={onClick} />
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
                onSearch={(search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search))}
                placeholder='Give this badge to...'
              >
                {user => (
                  <Tooltip text={`Give ${badge.name} to ${UserUtils.getUsernames(user).shift()}`}>
                    {props => {
                      const onClick = () => modifyUserToBadge(badge.id, user.username, 'add');
                      return (
                        <div {...props} className="user-tooltip" onClick={onClick}>
                          <User user={user} onClick={onClick} />
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
  value: CustomBadgeData['position'];
  onChange: (value: CustomBadgeData['position']) => void;
};

const PositionInput = React.forwardRef<HTMLInputElement, PositionInputProps>(({ value, onChange }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const [internalValue, _setInternalValue] = useState(() => {
    if (typeof value === 'number') return value.toString();
    if (value === 'start' || value === 'end') return value;

    return Object.entries(value).reduce((acc, [key, value]) => {
      return acc += `${key}:${value} `;
    }, '').trim();
  });

  const setInternalValue = useCallback((value: string) => {
    _setInternalValue(value);
    if (typeof value === 'number') return onChange(value);
    if (value === 'start' || value === 'end') return onChange(value);

    const position: CustomBadgeData['position'] = Object.fromEntries(
      value.split(' ').map(entry => {
        const [key, value] = entry.split(':');
        return [key, value];
      })
    );
    onChange(position);
  }, [onChange]);

  const inputRef = useRef<HTMLInputElement>(null);
  const clickId = useClickOutside(() => setIsActive(false));

  useEffect(() => {
    if (isActive && inputRef.current) inputRef.current.focus();
    else if (inputRef.current) inputRef.current.blur();
  }, [isActive]);

  // Combine ref and inputRef
  useImperativeHandle(ref, () => inputRef.current!);

  return (
    <div className="position-input-container" data-click-id={clickId}>
      <div className={classNames('input-wrapper', isActive && 'input-wrapper--active')}>
        {internalValue.split(' ').map((entry, index) => {
          const [key, value] = entry.split(':');
          return value ? <PositionInputTag key={index} v={value} k={key} onClick={() => {
            setInternalValue(internalValue.split(' ').filter((_, i) => i !== index).join(' '));
            setIsActive(false);
          }} /> : <span>{key}</span>;
        })}
      </div>
      <input ref={inputRef} className='hidden'
        tabIndex={-1}
        type="text"
        value={internalValue}
        onChange={e => setInternalValue(e.target.value)}
      />
    </div>
  );
});

type PositionInputTagProps = {
  k: string;
  v: string;
  onClick?: () => void;
};
function PositionInputTag({ k: key, v: value, onClick }: PositionInputTagProps) {
  return (
    <div className="position-input-tag" onClick={onClick}>
      <span className='position-input-tag__key'>{key}</span>
      <span className="position-input-tag__seperator">:</span>
      <span className='position-input-tag__value'>{value}</span>
    </div>
  );
}

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