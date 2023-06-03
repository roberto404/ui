import { createContext } from 'react';
import { AppContext, bindContexts } from '../context';



export const GridContext = createContext(null);

export const bindGridContexts = (ComponentToBeWrapped) =>
  bindContexts(ComponentToBeWrapped, [GridContext, AppContext]);
