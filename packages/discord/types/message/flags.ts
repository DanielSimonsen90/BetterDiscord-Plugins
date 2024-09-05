export const enum MessageFlags {
  None = 0,
  Crossposted = 1,
  IsCrosspost = 2,
  SuppressEmbeds = 4,
  SourceMessageDeleted = 8,
  Urgent = 16,
  HasThread = 32,
  Ephemeral = 64,
  Loading = 128,
  FailedToMentionSomeRolesInThread = 256
}