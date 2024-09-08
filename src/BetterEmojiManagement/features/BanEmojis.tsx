import { MenuItem, MenuSeparator } from "@dium/components";
import { React } from "@dium/modules";

import { EmojiStore } from "@danho-lib/Stores";
import createPatcherCallback, { createPatcherAfterCallback } from "@danho-lib/Patcher/CreatePatcherCallback";
import { ExpressionPickerContextMenuOptions } from "@danho-lib/ContextMenus/ExpressionPickerItemOptions";
import { ExpressionPickerMenu } from "@danho-lib/Modals/ExpressionPicker";
import { $ } from "@danho-lib/DOM";

import Bin from "@components/Discord/Icons/Bin";

import { Settings } from "../Settings";

/**
 * Update row emoji order
 * - Update favorites using {@link EmojiStore#getDisambiguatedEmojiContext().favoriteEmojisWithoutFetchingLatest}
 * - Update recent using {@link EmojiStore#getDisambiguatedEmojiContext().getFrequentlyUsedEmojisWithoutFetchingLatest}
 * - Update guild using {@link EmojiStore#getDisambiguatedEmojiContext().getCustomEmoji()}
 */

export const sortBannedEmojis = createPatcherCallback<EmojiStore['getSearchResultsOrder']>(({ args, original: __getStoreSearchResults }) => {
  const emojis = __getStoreSearchResults(...args);
  const banned = Settings.current.bannedEmojis.map(e => e.id);

  return emojis.sort((a, b) => {
    const aIsBanned = banned.includes(a.id);
    const bIsBanned = banned.includes(b.id);
    return (
      aIsBanned && !bIsBanned ? 1
        : !aIsBanned && bIsBanned ? -1
          : 0
    );
  });
});

export const addBannedTagToEmoji = createPatcherCallback<ExpressionPickerMenu[string]>(({ args: [props], original: emojiPicker }) => {
  const bannedEmojis = Settings.current.bannedEmojis.map(e => e.id);
  const result = emojiPicker(props);
  result.props.children = result.props.children.map((row) => {
    if (!row.props.descriptor) return row;
    const emojiId = row.props.descriptor.emoji.id;
    const isBanned = bannedEmojis.includes(emojiId);

    return !isBanned ? row : {
      ...row,
      props: {
        ...row.props,
        ['data-banned-emoji']: true
      }
    };
  });

  return result;
});

export const addBannedDataTagToEmojiElement = createPatcherAfterCallback<ExpressionPickerMenu[string]>(({ result }) => {
  result.props.children.forEach(row => {
    if (!('data-banned-emoji' in row.props)) return;

    const emojiId = row.props.descriptor.emoji.id;
    $(`[data-id="${emojiId}"]`).attr('data-banned-emoji', 'true');
  });
});

export const renderBanEmojiMenuItem = createPatcherCallback<ExpressionPickerContextMenuOptions['default']>(({ args: [props], original: menu }) => {
  const attributes = [...props.target.attributes];
  const name = attributes.find(a => a.name === "data-name")?.value;
  const id = attributes.find(a => a.name === "data-id")?.value ?? `default_${name}`;

  const result = menu(props);

  const isBanned = Settings.current.bannedEmojis.some(e => e.id === id);

  const menuOptions = result.props.children.props.children;
  menuOptions.splice(menuOptions.length, 0, <>
    <MenuSeparator />
    <MenuItem id={`emoji-ban_${id}`}
      label={isBanned ? "Unban Emoji" : "Ban Emoji"}
      action={() => {
        Settings.update({
          bannedEmojis: isBanned
            ? Settings.current.bannedEmojis.filter(e => e.id !== id)
            : [...Settings.current.bannedEmojis, { id, name }]
        });

        $(`[data-id="${id}"]`).attr<true, true>('data-banned-emoji', isBanned ? undefined : 'true', true).forceUpdate();
      }}
      color={isBanned ? undefined : "danger"}
      icon={isBanned ? undefined : Bin}
    />
  </>);

  return result;
});