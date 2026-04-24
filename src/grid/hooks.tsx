import { useContext } from "react";
import { useSelector } from "react-redux";
import { GridContext } from './context';

export const useGridSelector = () => {
  const context = useContext(GridContext);

  if (!context || !context.grid) {
    return [];
  }

  const ids = useSelector(
    ({ form }) => form[`grid@${context.grid}`] || [],
    (a, b) => a.join(',') === b.join(',')
  );

  return ids;
}

type Constructor<T> = new (...args: any[]) => T;

type UseGridFormSelectorReturn<T> = T extends false ? any[] : T;

export const useGridFormSelector = <T = false>(
  model?: Constructor<T> | false
): UseGridFormSelectorReturn<T> => {
  const context = useContext(GridContext);

  if (!context || !context.grid) {
    return [] as UseGridFormSelectorReturn<T>;
  }

  const form = useSelector(
    ({ form }) => form[context.grid] || []
  );

  if (model) {
    return new model(form) as UseGridFormSelectorReturn<T>;
  }

  return form as UseGridFormSelectorReturn<T>;
};
