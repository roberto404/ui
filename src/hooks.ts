import { useReducer } from "react"

export const useForceUpdate = () =>
{
  return useReducer(() => ({}), {})[1] as () => void
}
