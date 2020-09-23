import * as React from "react";
import {
  SealedInitialState,
  useSealedState,
} from "reakit-utils/useSealedState";
import {
  unstable_ComboboxListState as ComboboxListState,
  unstable_ComboboxListActions as ComboboxListActions,
  unstable_ComboboxListInitialState as ComboboxListInitialState,
  unstable_useComboboxListState as useComboboxListState,
} from "./ComboboxListState";
import {
  ComboboxPopoverState,
  ComboboxPopoverActions,
  ComboboxPopoverInitialState,
  useComboboxPopoverState,
} from "./__utils/ComboboxPopoverState";

function useSubscribe<T>(state: T) {
  type Listener = (state: T, prevState: T) => any;
  const listenersRef = React.useRef(new Set<Listener>());

  const subscribe = React.useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const prevStateRef = React.useRef({ ...state, subscribe });

  React.useEffect(() => {
    const nextState = { ...state, subscribe };
    for (const listener of listenersRef.current) {
      listener(nextState, prevStateRef.current);
    }
    prevStateRef.current = nextState;
  }, [state]);

  return subscribe;
}

export function unstable_useComboboxState(
  initialState: SealedInitialState<unstable_ComboboxInitialState> = {}
): unstable_ComboboxStateReturn {
  const sealed = useSealedState(initialState);
  const combobox = useComboboxListState(sealed);
  const state = useComboboxPopoverState(combobox, sealed);
  const subscribe = useSubscribe(state);
  return { ...state, subscribe };
}

export type unstable_ComboboxState = ComboboxPopoverState & ComboboxListState;

export type unstable_ComboboxActions = ComboboxPopoverActions &
  ComboboxListActions;

export type unstable_ComboboxInitialState = ComboboxPopoverInitialState &
  ComboboxListInitialState;

export type unstable_ComboboxStateReturn = unstable_ComboboxState &
  unstable_ComboboxActions & {
    /**
     * TODO
     */
    subscribe: (
      listener: (
        state: unstable_ComboboxStateReturn,
        prevState: unstable_ComboboxStateReturn
      ) => any
    ) => void;
  };
