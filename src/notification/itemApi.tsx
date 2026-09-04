import React from "react";

/* !-- Actions */

/* !-- Components */

import NotificationItemApiPromise from "./itemApiPromise";

/* !-- Constants */

/* !-- Types */

import { PropTypes as ItemApiPromisePropTypes } from "./itemApiPromise";

export type PropTypes = Omit<
  ItemApiPromisePropTypes,
  "autoStart" | "children"
> & {
  percent?: number;
};

/**
 * Preloading, when respond -> parse response -> button callback
 */
const NotificationItemApi = (props: PropTypes) => (
  <NotificationItemApiPromise {...props} autoStart />
);

export default NotificationItemApi;
