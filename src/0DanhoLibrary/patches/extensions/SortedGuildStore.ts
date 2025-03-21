import { ActionsEmitter } from '@danho-lib/Actions';
import { SortedGuildStore } from '@stores';

export default function extendSortedGuildStore() {
  const updateGuildIds = () => {
    SortedGuildStore.guildIds = SortedGuildStore.getGuildFolders()
      .map(folder => folder.guildIds)
      .flat();
  };

  const actionDependencies = [
    'GUILD_CREATE', 'GUILD_DELETE',
    'GUILD_MOVE_BY_ID',
    'GUILD_FOLDER_CREATE_LOCAL', 'GUILD_FOLDER_EDIT_LOCAL', 'GUILD_FOLDER_DELETE_LOCAL',
  ];

  for (const action of actionDependencies) {
    ActionsEmitter.on(action, updateGuildIds);
  }

  updateGuildIds();
}