
// core.js 37 Kbyte
// 18Kb
import request from 'superagent';

// 119Kb
import Application from '@1studio/utils/models/application';


/* !- Redux Store */

// 76Kb
import store from '@1studio/ui/store';
import { createUserStorage } from '@1studio/ui/authentication/reducers';


/* !- React Elements */

import Kontakt2 from './app';


/* !- Assets */

// 5Kb
require('../assets/style/index.scss');
require('../assets/html/index.pug');


/* !- Constants */

/**
 * @type {String} config postfix dynamic timestamp on prod mode.
 */
const configPostfix = (process.env.NODE_ENV === 'production') ?
  `@${new Date().getTime()}` : '';


/**
 * Initialization
 *
 * 1. Load public config
 * 2. Create Redux Store with unique user storeage
 * 3. Create Application model with store, config and use one React App every url path (action).
 */
const init = () =>
  request
    .get(`/json/app${configPostfix}.json`)
    .then((response) =>
    {
      const config = response.body;

      createUserStorage({}, { password: '%>"u[In!5D"4<sqU', key: 'rsuser', sessionTime: 10 }); // minutes

      /**
       * Base Package:
       * -------------
       * index.jsx (255Kb),
       * React+Redux (167Kb),
       * Router (67Kb),
       * Intl (47Kb),
       * Moment (262 Kb)
       * // => 800 Kb
       * @type {Application}
       */
      const App = new Application({
        store: store(),
        config,
        actions: {
          '.*': [Kontakt2],
        },
      });

      if (config.application.global || process.env.NODE_ENV !== 'production')
      {
        window.App = App;
      }
    });

window.onload = init;
