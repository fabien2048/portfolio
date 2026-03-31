// src/context/TransitionContext.tsx
import { createContext, useContext, useRef, RefObject } from 'react';

interface TransitionContextType {
  maskRef: RefObject<HTMLDivElement | null>;
}

const TransitionContext = createContext<TransitionContextType>({
  maskRef: { current: null },
});

export const useTransitionMask = () => useContext(TransitionContext);
export default TransitionContext;
