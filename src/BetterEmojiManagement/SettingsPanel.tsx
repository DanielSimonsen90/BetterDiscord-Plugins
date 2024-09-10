import { React } from '@dium/modules';
import { FormDivider, FormLabel, FormSection } from '@dium/components/form';

import { SecondaryButton } from '@discord/components';

import { Collapsible, Setting, GuildListItem } from '@components/index';
import { EmojiStore, getEmojiUrl, GuildStore } from '@stores/index';

import { Settings, titles } from './Settings';
import BannedEmojiTag from './BannedEmojiTag';

type Props = {
  updatePatches(): void;
}

export default function SettingsPanel({ updatePatches }: Props) {
  const [current, defaults, set] = Settings.useStateWithDefaults();

  React.useEffect(() => {
    updatePatches();
  }, [current.enableBannedEmojis, current.enableFavorFavoriteEmojis])

  return (
    <div className='danho-plugin-settings'>
      <FormSection>
        <FormLabel>Features</FormLabel>
        <Setting settings={Settings.current} setting='enableBannedEmojis' set={set} titles={titles} />
        <Setting settings={Settings.current} setting='enableFavorFavoriteEmojis' set={set} titles={titles} />
      </FormSection>
      {current.enableBannedEmojis && (<>
        <FormDivider />
        <BannedEmojiSection />
      </>)}
    </div>
  );
}

function BannedEmojiSection() {
  const [current, defaults, set] = Settings.useStateWithDefaults();
  const emojiStoreContext = EmojiStore.getDisambiguatedEmojiContext();
  const bannedEmojis = current.bannedEmojis.map(({ id }) => emojiStoreContext.getById(id));
  const guilds = React.useMemo(() => bannedEmojis.map(({ guildId }) => ({
    id: guildId,
    guild: GuildStore.getGuild(guildId),
    bannedEmojis: bannedEmojis.filter(({ guildId: id }) => id === guildId)
  })), [bannedEmojis]);
  const disableCollapsible = bannedEmojis.length === 0;

  return (
    <FormSection className='banned-emojis'>
      <FormLabel>Banned emojis</FormLabel>
      <Collapsible title={disableCollapsible ? 'There are no banned emojis.' : 'View banned emojis'} disabled={disableCollapsible}>
        <ul className="banned-emojis__guilds-list">
          {guilds.map(({ guild, bannedEmojis }) => (
            <li key={guild.id} className="banned-emojis__guild-list-item">
              <Collapsible title={
                <div className='banned-emojis__guilds-list-item__header'>
                  <GuildListItem guild={guild}>
                    <span className="banned-emojis-count">
                      {bannedEmojis.length} banned emoji{bannedEmojis.length === 1 ? '' : 's'}
                    </span>
                  </GuildListItem>
                  <SecondaryButton onClick={() => {
                    set({
                      bannedEmojis: current.bannedEmojis
                        .filter(e => !bannedEmojis.map(e => e.id).includes(e.id))
                    });
                    BdApi.UI.showToast(`Unbanned all emojis from ${guild.name}.`, { type: 'success' });
                  }}
                  >
                    Unban all
                  </SecondaryButton>
                </div>
              }>
                <ul className="banned-emojis__emojis-list">
                  {bannedEmojis.map(({ id, name }) => (
                    <BannedEmojiTag key={id} emojiId={id} onClick={() =>
                      BdApi.UI.showConfirmationModal(
                        `Unban ${name}`,
                        <div className='bd-flex bd-flex-column bd-flex-center'>
                          <img src={getEmojiUrl({ id })} alt={name} className='emoji jumboable' />
                          <p style={{ color: 'var(--text-primary)', marginLeft: '1ch' }}>Are you sure you want to unban {name}?</p>
                        </div>,
                        {
                          danger: true,
                          confirmText: 'Unban',
                          onConfirm: () => set({ bannedEmojis: current.bannedEmojis.filter(e => e.id !== id) })
                        }
                      )
                    } />
                  ))}
                </ul>
              </Collapsible>
            </li>
          )
          )}
        </ul>
      </Collapsible>
    </FormSection>
  );
}