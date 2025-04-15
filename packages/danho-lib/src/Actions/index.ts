import { Dispatcher } from '@dium/modules';

export * from './ActionsEmitter';
export * from './CreateActionCallback';

export * from './AppActions';
export * from './ApplicationActions';
export * from './ChannelActions';
export * from './GuildActions';
export * from './MessageActions';
export * from './PermissionsActions';
export * from './RelationshipActions';
export * from './UserNoteActions';
export * from './UserStatusActions';
export * from './VoiceActions';

export const DISPATCH_ACTIONS = (() => {
  const actions = new Set<string>();

  // gather all events
  Object.values(Dispatcher._actionHandlers._dependencyGraph.nodes)
    .forEach(node => Object.keys(node.actionHandler)
      .forEach(event => actions.add(event)));

  Object.keys(Dispatcher._subscriptions).forEach(event => actions.add(event));

  return [...actions].sort((a, b) => a.localeCompare(b));
})();
export function find(action: string) {
  return DISPATCH_ACTIONS.filter(key => key.toLowerCase().includes(action.toLowerCase()));
}
export function findHandlers(action: string) {
  return Object.values(Dispatcher._actionHandlers._dependencyGraph.nodes)
    .filter(node => Object.keys(node.actionHandler).some(key => key.toLowerCase().includes(action.toLowerCase())))
}