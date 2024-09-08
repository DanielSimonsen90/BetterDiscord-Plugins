import { React } from '@dium/modules';
import { FormDivider, FormLabel, FormSwitch, FormSection } from '@dium/components/form';
import { Collapsible, Setting } from '@danho-lib/React/components';
import { Settings, titles } from './Settings';
import BannedEmojiTag from './BannedEmojiTag';
import { EmojiStore, getEmojiUrl } from '@danho-lib/Stores';

export default function SettingsPanel() {
  const [current, defaults, set] = Settings.useStateWithDefaults();

  return (<>
    <FormSection>
      <FormLabel>Features</FormLabel>
      <Setting settings={Settings.current} setting='enableBannedEmojis' set={set} titles={titles} />
      <Setting settings={Settings.current} setting='enableFavorFavoriteEmojis' set={set} titles={titles} />
    </FormSection>
    {current.enableBannedEmojis && (<>
      <FormDivider />
      <FormSection>
        <FormLabel>Banned emojis</FormLabel>
        <Collapsible title='View banned emojis'>
        {/* TODO: Render banned emoji per guild */}
          <ul className='banned-emojis-list'>
            {current.bannedEmojis.map(({ id, name }) => (
              <BannedEmojiTag store={EmojiStore} emojiId={id} onClick={() => 
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
      </FormSection>
    </>)}
  </>);
}