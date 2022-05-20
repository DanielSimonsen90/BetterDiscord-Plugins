import { ObservationReturns } from './MutationManager';
import { ObservationCallback } from './ObservationConfig';

export * from './ObservationConfig';
export * from './MutationManager';

export type MutationReturns = {
    [Key in keyof ObservationReturns]: Parameters<ObservationCallback<ObservationReturns[Key]>>
}