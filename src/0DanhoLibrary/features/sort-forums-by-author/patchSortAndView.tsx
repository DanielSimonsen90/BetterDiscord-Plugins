import { ActionsEmitter } from "@danho-lib/Actions";
import Finder from "@danho-lib/dium/api/finder";
import { $, DQuery } from "@danho-lib/DOM";
import { ForumStateManagerModule, ForumStateSortOrders } from "@danho-lib/Patcher/ForumStateManager";
import { ChannelStore } from "@danho-lib/Stores";

import { Logger, Patcher } from "@dium/api";
import { ChannelTypes, SelectedChannelStore } from "@dium/modules/channel";
import { React } from "@dium/modules";

let SortByAuthorOption: React.FC = null;

export default async function patchSortAndView() {
  const addSortAndViewButtonClick = () => {
    if (!testForumChannel()) return;

    const sortAndViewButton = $(s => s.ariaLabel('Sort & view').and.type('button'));
    sortAndViewButton?.on('click', async () => {
      addSortByAuthorOnDOM();
      // patchSortAndViewMenu();
    });
    Logger.log(sortAndViewButton ? 'Sort and view button found' : 'Sort and view button not found');
  };

  addSortAndViewButtonClick();
  ActionsEmitter.on('CHANNEL_SELECT', addSortAndViewButtonClick);
}

function testForumChannel() {
  const [_blank, _channelsString, _guildId, channelId] = window.location.pathname.split('/');
  const channel = ChannelStore.getChannel(channelId);
  if (!channel) return false;
  return channel.type === ChannelTypes.GuildForum;
}

async function addSortByAuthorOnDOM() {
  const sortGroup = await new Promise<DQuery<HTMLElement>>((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const sortGroup = $('#sort-and-view')?.children(s => s.ariaLabel('Sort by').and.role('group'), true);
      if (sortGroup) {
        observer.disconnect();
        resolve(sortGroup);
      }
    });

    observer.observe($('#app-mount').element, {
      childList: true, subtree: true
    });

    setTimeout(() => reject('Sort group not found or took too long'), 5000);
  });
  if (typeof sortGroup === 'string') return Logger.error(sortGroup);
  if (sortGroup.children('.bdd-wrapper').length) return;

  const sortOptionClone = sortGroup.lastChild.element.cloneNode(true) as HTMLElement;
  const renderChildren = (children: Element[]) => children.map(child => React.createElement(
    child.tagName,
    Array.from(child.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {}),
    child.innerHTML.includes('<')
      ? React.createElement(React.Fragment, {}, renderChildren(Array.from(child.children)))
      : child.innerHTML
  ));
  SortByAuthorOption = () => (
    <div {...Array.from(sortOptionClone.attributes).reduce((acc, attr) => ({ ...acc, [attr.name]: attr.value }), {})}
     onClick={orderPostsByAuthor}>
      {Array.from(sortOptionClone.children).map(child => {
        if (child.className.includes('label')) child.innerHTML = 'Author';
        return child.innerHTML.includes('<') ? renderChildren(Array.from(child.children)) : child.innerHTML;
      })}
    </div>
  );
  sortGroup.appendHtml('<div></div>').lastChild.replaceWithComponent(<SortByAuthorOption />);
  Logger.log('Sort by author added to DOM');
}

function patchSortAndViewMenu() {
  Logger.log(`Patching sort and view menu...`);
  setTimeout(() => {
    const sortAndViewMenuModule = Finder.findBySourceStrings('navId:"sort-and-view"', { defaultExport: false, first: true }) as {
      Z: JSX.BD.FC<{
        children: JSX.BD.Rendered<{
          'aria-label': string,
          children: [
            SortAndView: JSX.BD.Rendered<{
              label: string,
              children: Array<JSX.BD.Rendered<{
                action(): void; // g(r.z.LATEST_ACTIVITY)
                checked: boolean;
                group: string;
                id: string;
                label: string;
              }>>;
            }>,
            ViewAs: JSX.BD.Rendered<{
              label: string,
              children: Array<JSX.BD.Rendered<{
                action(): void; // x(s.X.LIST)
                checked: boolean;
                group: string;
                id: string;
                label: string;
              }>>;
            }>,
            Reset: JSX.BD.Rendered<{
              children: JSX.BD.Rendered<{
                action(): void,
                className: string,
                id: string,
                label: JSX.BD.Rendered<{
                  children: string;
                  color: 'none';
                  variant: 'text-sm/medium';
                }>,
              }>,
            }>,
          ],
          hideScroller: boolean,
          navId: 'sort-and-view',
          onClose(): void,
          /** same function as onClose */
          onSelect(): void,
        }>,
        className: string;
      }>;
    };
    Logger.log('sort-and-view', sortAndViewMenuModule);
    if (!sortAndViewMenuModule) return;

    Patcher.after(sortAndViewMenuModule, 'Z', ({ result, args }) => {
      Logger.log('sort-and-view', result, args);

      const sortGroup = result.props.children.props.children.find(c => 'label' in c.props && c.props.label.startsWith('Sort'));
      if (!Array.isArray(sortGroup.props.children)) return Logger.error('Sort group not found');

      sortGroup.props.children.splice(sortGroup.props.children.length, 0,
        BdApi.ContextMenu.buildItem({
          type: 'radio',
          label: 'Author',
          action: setSortOrderByAuthor,
        }) as any
      );
    }, { name: 'navId: "sort-and-view"' });
  }, 0);
}

function setSortOrderByAuthor() {
  const channelId = SelectedChannelStore.getChannelId();
  ForumStateManagerModule.H(channelId).setSortOrder(channelId, ForumStateSortOrders.DANHO__BY_AUTHOR);
}

function orderPostsByAuthor() {
  const postsContainer = $(s => s.role('list').and.dataIncludes('list-id', 'forum-channel-list'))?.children(undefined, true);
  if (!postsContainer) return Logger.error('Posts not found');

  const posts = postsContainer.children('li').reduce((acc, post) => {
    const author = post.children(s => s.className('author').className('username'), true);
    if (!author.element) {
      Logger.warn('No author found', post);
      return acc;
    }
    const authorName = author.value.toString();
    if (!authorName) {
      Logger.error('Author not found', post);
      return acc;
    }

    return acc.set(authorName, [...(acc.get(authorName) ?? []), post]);
  }, new Map<string, DQuery[]>());
  const sortedAuthors = Array.from(posts.keys()).sort();

  postsContainer.children('li').forEach(post => post.unmount());
  sortedAuthors.forEach(author => postsContainer.appendElements(posts.get(author)));
}