// import storeWrapper from '../src/store';

// const store = storeWrapper();



// import storeCreate from '../src/store';

// const store = storeCreate();

// console.log(store);


// module.exports = {
//   decorators: []
// };




import store from '../src/store';

import { withProvider } from '../src/.stories/reduxProvider';

// import { Provider } from 'react-redux';


// const ProviderWrapper = ({ children }) =>
//   (<Provider store={store()}>{children}</Provider>);


export default {
  decorators: [
    withProvider,
  ],
}


// export const parameters = {
//   actions: { argTypesRegex: '^on.*' }
// }


