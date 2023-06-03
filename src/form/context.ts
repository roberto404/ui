import { createContext } from 'react';
import { AppContext, bindContexts } from '../context';



export const FormContext = createContext(null);

export const bindFormContexts = (ComponentToBeWrapped) =>
  bindContexts(ComponentToBeWrapped, [FormContext, AppContext]);
