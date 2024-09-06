import { Finder, Patcher, Filters } from "@dium/api";
import { EmojiStore } from "@danho-lib/Stores";
import { Settings } from "../Settings";
import { WaitForEmojiPickerContextMenu } from "@danho-lib/ContextMenus/ExpressionPickerItemOptions";
import { MenuItem, MenuSeparator } from "@dium/components";
import { React } from "@dium/modules";
import Bin from "@components/Discord/Icons/Bin";

export default function BanEmojis() {
  Patcher.instead(EmojiStore, "getSearchResultsOrder", ({ args: [emojis, query, n], original: __getStoreSearchResults }) => {
    const relevantEmojis = __getStoreSearchResults(emojis, query, n);
    const bannedEmojis = Settings.current.bannedEmojis.map(e => e.id);
    return relevantEmojis.sort((a, b) => {
      const aIsBanned = bannedEmojis.includes(a.id);
      const bIsBanned = bannedEmojis.includes(b.id);
      return aIsBanned && !bIsBanned ? 1
        : !aIsBanned && bIsBanned ? -1
          : 0;
    });
  });

  WaitForEmojiPickerContextMenu(menu => {
    Patcher.instead(menu, "default", ({ args: [props], cancel, context, original: menu }) => {
      const attributes = [...props.target.attributes];
      const name = attributes.find(a => a.name === "data-name")?.value;
      const id = attributes.find(a => a.name === "data-id")?.value ?? `default_${name}`;
      const result = menu(props);

      const isBanned = Settings.current.bannedEmojis.some(e => e.id === id);

      const menuOptions = result.props.children.props.children;
      menuOptions.splice(menuOptions.length, 0,
        <>
          <MenuSeparator />
          <MenuItem id={`emoji-ban_${id}`}
            label={isBanned ? "Unban Emoji" : "Ban Emoji"}
            action={() => Settings.update({
              bannedEmojis: isBanned
                ? Settings.current.bannedEmojis.filter(e => e.id !== id)
                : [...Settings.current.bannedEmojis, { id, name }]
            })}
            color={isBanned ? undefined : "danger"}
            icon={isBanned ? undefined : Bin}
          />
        </>
      );

      return result;
    });
  });
}