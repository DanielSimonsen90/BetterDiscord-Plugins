import { DependencyList, Dispatch, SetStateAction, useState, useMemo } from "@react";

type UseMemoedStateReturns<State, Memo> = [value: Memo, setInternalState: Dispatch<SetStateAction<State>>, state: State];
export function useMemoedState<State, Memo>(initialState: State, factory: (state: State) => Memo, dependencies: DependencyList = []): UseMemoedStateReturns<State, Memo> {
    const [state, setState] = useState(initialState);
    const memo = useMemo(() => factory(state), [state, ...dependencies]);
    return [memo, setState, state];
}