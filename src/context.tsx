import React, { createContext, useContext, Component } from "react";


export let AppContext = createContext(null as any);

export const setAppContext = (context) =>
  AppContext = context;


if (process.env.NODE_ENV !== 'production')
{
  AppContext.displayName = 'AppContext';
}

/**
 * @example
 * const { register } = useAppContext(); 
 */
export function useAppContext()
{
  const contextValue = useContext(AppContext);

  if (process.env.NODE_ENV !== 'production' && !contextValue)
  {
    throw new Error(
      'could not find app context value; please ensure the component is wrapped in a <Provider>'
    );
  }

  return contextValue;
}



/**
 * Merge Context
 * https://www.linkedin.com/pulse/react-multiple-contexts-class-component-vikram-gupta
 */
export let mergedContextsValue: any;

const setValue = (newValues) =>
{
  for (let key in newValues) {
    if (['reset', 'setValue'].indexOf(key) === -1 && newValues.hasOwnProperty(key))
    {
      mergedContextsValue[key] = newValues[key];
    }
  }
};


const reset = () => {
  // Keep the setValue and reset methods attached always 
  // to update the values of contexts to be merged
  mergedContextsValue = {
      setValue,
      reset
  };
};


reset();


export let MergedContexts = createContext<any>(mergedContextsValue);

export const setMergedContexts = (create) =>
  MergedContexts = create<any>(mergedContextsValue);


/**
 * Create Element with Provider
 */
const processContexts = (contexts: any[], ComponentToBeWrapped, props) =>
{
  let ChildContext = () => (
    <MergedContexts.Provider value={mergedContextsValue}>
      <ComponentToBeWrapped {...props} />
    </MergedContexts.Provider>
  );


  let i = contexts.length - 1;

  for (; i >= 0; i--)
  {
    const TempContextItem = contexts[i];
    const OldChildContext = ChildContext();


    ChildContext = () => (
      <TempContextItem.Consumer>
        {(context) => {
          mergedContextsValue.setValue({ ...mergedContextsValue, ...context });
          return OldChildContext;
        }}
      </TempContextItem.Consumer>
    );
  }

  return ChildContext();
};


/**
* This HOC helps in using values of multiple contexts in a "Class Component".

* HOC (Higher Order Component) to merge values from multiple contexts
* into New Context and then bind new Context's provider 
* to the given Component.
* 
* @param { Component } ComponentToBeWrapped 
* @param { Array<Context> } contexts 
* 
* @returns { Component }
*/
export const bindContexts = (ComponentToBeWrapped, contexts: any[]) =>
{
  return class WrappedComponent extends Component<any, any>
  {
    render()
    {
      mergedContextsValue.reset();
      const ProcessedContexts = processContexts(contexts, ComponentToBeWrapped, this.props);
      return ProcessedContexts;
    }
  }
};



export default AppContext;
