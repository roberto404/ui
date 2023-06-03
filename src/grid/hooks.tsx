import { useContext } from "react";
import { useSelector } from "react-redux";
import { GridContext } from './context';

export const useGridSelector = () =>
{
  const context = useContext(GridContext);

  const ids = useSelector(
    ({ form }) => form[`grid@${context.grid}`] || [],
    (a, b) => a.join(',') === b.join(',')
  );
  
  return ids;
}