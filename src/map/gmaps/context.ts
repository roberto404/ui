import { createContext } from 'react';
import { AppContext, bindContexts } from '../../context';



export const MapContext = createContext(null);

export const bindMapContexts = (ComponentToBeWrapped) =>
  bindContexts(ComponentToBeWrapped, [MapContext, AppContext]);
