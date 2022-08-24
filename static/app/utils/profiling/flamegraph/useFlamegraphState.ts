import {useContext} from 'react';

import type {FlamegraphStateContextValue} from './flamegraphStateProvider';
import {FlamegraphStateContext} from './flamegraphStateProvider';

export function useFlamegraphState(): FlamegraphStateContextValue {
  const context = useContext(FlamegraphStateContext);

  if (context === null) {
    throw new Error('useFlamegraphState called outside of FlamegraphStateProvider');
  }

  return context;
}

export function useFlamegraphStateValue(): FlamegraphStateContextValue[0] {
  const context = useContext(FlamegraphStateContext);

  if (context === null) {
    throw new Error('useFlamegraphState called outside of FlamegraphStateProvider');
  }

  return context[0];
}

export function useDispatchFlamegraphState(): [
  FlamegraphStateContextValue[1],
  FlamegraphStateContextValue[2]
] {
  const context = useContext(FlamegraphStateContext);

  if (context === null) {
    throw new Error('useFlamegraphState called outside of FlamegraphStateProvider');
  }

  return [context[1], context[2]];
}
