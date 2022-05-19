export type If<Condition, Then, Else> = Condition extends true ? Then : Else;
export type PartialRecord<Keys extends string, Values> = Partial<Record<Keys, Values>>;