
import React from 'react';
import { Provider } from 'react-redux';


import store from '../store';



const ProviderWrapper = ({ children }) =>
  (<Provider store={store()}>{children}</Provider>);


export const withProvider = (story) => (
  <ProviderWrapper store={store()}>
      {story()}
  </ProviderWrapper>
)

export default ProviderWrapper;