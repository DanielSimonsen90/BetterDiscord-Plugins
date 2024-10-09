import { React } from "@react";
import { DQuery, $, observeAppMountFor } from "@danho-lib/DOM";
import { Logger } from "@dium/api";
import { SortByAuthorOption } from "./SortByAuthorOption";

export async function addSortByAuthorOnDOM() {
  const sortGroup = await observeAppMountFor(
    () => $('#sort-and-view')?.children(s => s.ariaLabel('Sort by').and.role('group'), true),
    5000, 'Sort group not found or took too long'
  );
  if (typeof sortGroup === 'string') return Logger.error(sortGroup);
  if (sortGroup.children('.bdd-wrapper').length) return;

  sortGroup.children('li').forEach(el => el.on('click', () => $('[data-custom-option] circle').unmount()));

  const sortOptionClone = sortGroup.lastChild.element.cloneNode(true) as HTMLElement;
  // if "Date Posted" option is selected, make sure to remove the circle in the clone
  sortOptionClone.querySelector('circle')?.remove();

  sortGroup.appendHtml('<></>').lastChild.replaceWithComponent(<SortByAuthorOption {...{ sortOptionClone, orderPostsByAuthor }} />);
  Logger.log('Sort by author added to DOM');
}

function orderPostsByAuthor() {
  const postsContainer = $(s => s.role('list').and.dataIncludes('list-id', 'forum-channel-list'))?.children(undefined, true);
  if (!postsContainer) return Logger.error('Posts not found');

  const posts = postsContainer.children('li').reduce((acc, post) => {
    const author = post.children(s => s.className('author').className('username'), true);
    if (!author.element) return acc;
    
    const authorName = author.value.toString();
    if (!authorName) {
      Logger.error('Author not found', post);
      return acc;
    }

    return acc.set(authorName, [...(acc.get(authorName) ?? []), post]);
  }, new Map<string, DQuery[]>());
  if (!posts.size) return Logger.error('No posts found');

  const sortedAuthors = Array.from(posts.keys()).sort();

  postsContainer.children('li').forEach(post => post.unmount());
  sortedAuthors.forEach(author => postsContainer.appendElements(posts.get(author)));

  $('#sort-and-view')
    .children('.bdd-wrapper svg', true)
    .appendElements([$('#sort-and-view').children('circle', true).element]);
  $(s => s.id('sort-and-view').role('group').and.ariaLabel('Sort by'))
    .children('circle')
    .forEach((el) => {
      if (el.ancestor('.bdd-wrapper')) return;
      el.unmount();
    });
}