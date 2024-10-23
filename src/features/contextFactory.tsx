import { createContext, useContext as useReactContext } from "react";

export function createContextStuff<T = unknown>(defaultValues: T) {
  const context = createContext<T>(defaultValues);

  function useContext() {
    return useReactContext(context);
  }

  return {
    useContext,
    context,
  };
}
