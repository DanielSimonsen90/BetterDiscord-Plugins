import { Actions } from './ActionTypes';
export const createActionCallback = <
  TActionName extends keyof Actions, 
  TAction extends Actions[TActionName]
>(action: TActionName, callback: (...ags: TAction) => void) => {
  return callback;
} 

export default createActionCallback;