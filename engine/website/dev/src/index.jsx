
import { flattenMessagesRevert } from '@1studio/utils/object/flattenMessages';
import { productPropsParser } from './components/product/const';
// import Tree from '@1studio/utils/models/tree';
import Tree from '/Users/roberto/Sites/utils/src/models/tree';


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

import Website from './app';


/* !- Assets */

// 5Kb
require('../assets/style/index.scss');
require('../assets/html/index.pug');


/* !- Constants */

const DATABASE_SYNC = 10 * 60; // 10 min (sec)

//@TODO cames from config
const SESSION_TIME = 4 * 60; // 4 h (min)

/**
 * Unix time ceil to database sync
 * @type {Int}
 */
const timeStamp = parseInt(new Date().getTime() / 1000 / DATABASE_SYNC);

/**
 * @type {String} config postfix dynamic timestamp on prod mode.
 */
const configPostfix = (process.env.NODE_ENV === 'production') ? `@${timeStamp}` : '';


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

      config.project.constants = flattenMessagesRevert(config.project.constants);
      config.project.products = config.project.products.map(product => productPropsParser(product));
      config.project.menu = new Tree(config.project.menu);

      createUserStorage({}, { password: '%>"u[In!5D"4<sqU', key: 'rsweb', sessionTime: SESSION_TIME }); // minutes

      /**
       * Base Package:
       * -------------
       * this (255Kb),
       * React+Redux (167Kb),
       * Router (67Kb),
       * Intl (47Kb),
       * // => 540 Kb
       * @type {Application}
       */
      const App = new Application({
        store: store(),
        config,
        actions: {
          '.*': [Website],
        },
      });

      if (config.application.global || process.env.NODE_ENV !== 'production')
      {
        window.App = App;
      }
    });

window.onload = init;
