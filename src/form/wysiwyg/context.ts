import { createContext } from 'react';
import { AppContext, bindContexts } from '../../context';



export const WysiwygContext = createContext(null);

export const bindWysiwgContexts = (ComponentToBeWrapped) =>
  bindContexts(ComponentToBeWrapped, [WysiwygContext, AppContext]);
