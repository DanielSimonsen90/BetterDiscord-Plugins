import { DQuery, $ } from "@danho-lib/DOM";
import { Logger } from "@dium/api";

export default function orderPostsByAuthor() {
  const postsContainer = $(s => s.role('list').and.dataIncludes('list-id', 'forum-channel-list'))?.children(undefined, true);
  if (!postsContainer) return Logger.error('Posts not found');
  postsContainer.addClass('danho-sort-by-author');

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
}