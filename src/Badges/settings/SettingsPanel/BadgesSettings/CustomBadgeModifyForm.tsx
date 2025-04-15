import React, { 
  useState, useMemo, useEffect,
  Dispatch, SetStateAction, 
} from '@react';
import { EmptyFormGroup, FormItem, FormItemFromModel, SearchableList } from '@components';
import { useFormTab } from '@hooks';

import { Button, Text } from '@discord/components';
import { ObjectUtils, UserUtils } from '@utils';

import { PotentialUser } from './PotentialUser';
import PositionInput from './PositionInput';

import { CustomBadgeData } from '../../../components/CustomBadge';
import { CustomBadgesStore, BadgePositionsStore } from '../../../stores';

export type ModifyBadgeData = Partial<Pick<CustomBadgeData, 'id' | 'name' | 'iconUrl' | 'href' | 'userTags' | 'size'>>;

type Props = {
  selectedBadgeId: string;
  setSelectedBadgeId: Dispatch<SetStateAction<string | null>>;
}
export default function CustomBadgeModifyForm(props: Props) {
  const { selectedBadgeId, setSelectedBadgeId } = props;

  const [badgeIdsInTooltip, setBadgeIdsInTooltip] = useState<boolean>(false);
  const selectedBadge = useMemo<Partial<CustomBadgeData>>(() => (
    CustomBadgesStore.current.customBadges[selectedBadgeId] ?? {
      id: selectedBadgeId,
    }
  ), [selectedBadgeId]);
  const [modifyBadge, setModifyBadge] = useState<ModifyBadgeData | null>(() => selectedBadge);
  const badgePositionsStoreEditor = BadgePositionsStore.useEditorStore(selectedBadgeId);
  const formTabProps = useFormTab()

  const formItemModel = ObjectUtils.exclude(modifyBadge, 'userTags');
  const hasChanges = !ObjectUtils.isEqual(modifyBadge, selectedBadge);
  const isNewBadge = (
    !(modifyBadge.id in CustomBadgesStore.current.customBadges) &&
    !(selectedBadge.id in CustomBadgesStore.current.customBadges)
  );

  useEffect(() => {
    setModifyBadge(selectedBadge);
  }, [selectedBadge])

  return (
    <form className="custom-badge-modify-container" {...formTabProps}>
      <Text variant='heading-xl/bold'>{isNewBadge ? 'Create' : 'Edit'} {modifyBadge.name ?? 'your own badge'}</Text>
      <FormItemFromModel model={formItemModel} property='id' onChange={id => setModifyBadge(current => ({ ...current, id }))} />
      <FormItemFromModel model={formItemModel} property='name' onChange={name => setModifyBadge(current => ({ ...current, name }))} />
      <FormItemFromModel model={formItemModel} property='iconUrl' onChange={iconUrl => setModifyBadge(current => ({ ...current, iconUrl }))} label="Url to icon" />
      <FormItemFromModel model={formItemModel} property='href' onChange={href => setModifyBadge(current => ({ ...current, href }))} label="External URL when clicked" />

      <FormItem label="Show badge id in tooltip instead of its name" value={badgeIdsInTooltip} onChange={value => setBadgeIdsInTooltip(value)} />
      <SearchableList items={UserUtils.getUsersPrioritizingFriends()} take={4}
        onSearch={(search, item) => UserUtils.getUsernames(item, true).some(name => name.includes(search.toLowerCase()))}
        renderItem={user => (
          <PotentialUser
            user={user} modifyBadge={modifyBadge}
            badgePositionsStoreEditor={badgePositionsStoreEditor}
            selectedBadge={selectedBadge}
            setModifyBadge={setModifyBadge}
            badgeIdsInTooltip={badgeIdsInTooltip}
          />
        )}
      />

      <EmptyFormGroup label="Badge position" name="position">
        {() => <PositionInput selectedBadge={selectedBadge} modifyBadge={modifyBadge} badgePositionsStoreEditor={badgePositionsStoreEditor} />}
      </EmptyFormGroup>
      <FormItemFromModel model={formItemModel} property='size' defaultValue='20px' onChange={size => setModifyBadge(current => ({ ...current, size: size as any }))} />

      <div className="button-panel">
        <Button type="reset" color={Button.Colors.RED} look={Button.Looks.OUTLINED} onClick={() => setSelectedBadgeId(null)}>
          Deselect {modifyBadge.name || selectedBadge.name} without saving
        </Button>
        <Button type="submit" color={isNewBadge ? Button.Colors.GREEN : Button.Colors.PRIMARY} look={Button.Looks.FILLED} disabled={!hasChanges} onClick={() => {
          // Invalid badge object
          if (!modifyBadge.iconUrl || !modifyBadge.name || !modifyBadge.id) return;

          // Position changed
          if (badgePositionsStoreEditor.getBadgePosition(selectedBadge.id) !== BadgePositionsStore.getBadgePosition(selectedBadge.id)) {
            BadgePositionsStore.setBadgePosition(modifyBadge.id, badgePositionsStoreEditor.getBadgePosition(selectedBadge.id));
          }

          // Badge id changed
          if (modifyBadge.id !== selectedBadge.id) {
            CustomBadgesStore.deleteCustomBadge(selectedBadge.id);
            BadgePositionsStore.deleteBadgePosition(selectedBadge.id);
          }

          CustomBadgesStore.upsetCustomBadge(modifyBadge as CustomBadgeData);
          setSelectedBadgeId(null);
        }}>
          {isNewBadge ? 'Create' : 'Save'} {modifyBadge.name || selectedBadge.name}
        </Button>
      </div>
    </form>
  );
}