import React from 'react';
import { FormattedMessage } from 'react-intl';


/* !- React Elements */

import Login from '@1studio/ui/authentication/login';

/* !- Constants */

import { LOGIN_SCHEME, LOGIN_FIELDS } from '@1studio/ui/authentication/constants';

// enable username in the email field
const SCHEME = { email: LOGIN_SCHEME.email, password: LOGIN_SCHEME.password };
delete SCHEME.email.email;

// change email field placeholder for username
const FIELDS = { email: LOGIN_FIELDS.email, password: LOGIN_FIELDS.password };
FIELDS.email.placeholder = 'login.placeholder';


/**
 * Login Screen
 */
const Home = () =>
(
  <div>
    <div className="h1">
      <FormattedMessage id="home.title" />
    </div>
    <div className="pb-2 light">
      <FormattedMessage id="home.lead" />
    </div>

    <Login
      scheme={SCHEME}
      fields={FIELDS}
    />
  </div>
);

export default Home;
