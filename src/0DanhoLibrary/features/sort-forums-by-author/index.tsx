import Finder from "@danho-lib/dium/api/finder";
import { ForumStateManagerModule, ForumStateSortOrders } from "@danho-lib/Patcher/ForumStateManager";
import { currentChannel } from "@danho-lib/Utils";
import { Snowflake } from "@discord/types/base";
import { Logger, Patcher } from "@dium/api";
import { ChannelStore, ChannelTypes, SelectedChannelStore } from "@dium/modules";


export default function Feature() {
  // watch window.location.pathname
  const cancel = Patcher.after(window.history, 'pushState', () => {
    const [_, guildId, channelId] = window.location.pathname.split('/');
    const channel = ChannelStore.getChannel(channelId);
    if (!channel) return Logger.warn(`Channel not found: ${channelId}`);
    if (channel.type !== ChannelTypes.GuildForum) return;
    Logger.log('Channel found', channel);
    // TODO: Add click listener to Sort & view button, then patch below
    
    
    // const sortAndViewMenuModule = Finder.findBySourceStrings('navId:"sort-and-view"');
    // Logger.log('sort-and-view', sortAndViewMenuModule);
  });


  // const channelId = SelectedChannelStore.getChannelId();
  // ForumStateManagerModule.H(channelId).setSortOrder(channelId, ForumStateSortOrders.DANHO__BY_AUTHOR);
}