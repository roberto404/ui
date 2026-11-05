import React, { useState } from "react";

/* !-- Actions */

/* !-- Components */

import { NotificationButton } from "./layout";

/* !-- Constants */

/* !-- Types */

import { ChildrenPropTypes } from "./itemApiPromise";

export type PropTypes = ChildrenPropTypes & {
  /**
   * Az api payloadban ezzel a kulccsal adódik át a megadott üzenet.
   */
  field?: string;
  label?: React.ReactNode;
  placeholder?: string;
  buttonTitle?: React.ReactNode;
  rows?: number;
};

/**
 * `addApiWithMessage` előre elkészített gyereke: indítás előtt kötelező üzenet.
 */
const NotificationItemApiMessage = ({
  onStart,
  field = "_log",
  label,
  placeholder = "Indoklás",
  buttonTitle = "mehet",
  rows = 2,
}: PropTypes) => {
  const [message, setMessage] = useState("");

  const enable = message.trim().length > 0;

  const onClickStartHandler = () => {
    if (!enable) {
      return;
    }

    onStart({ [field]: message.trim() });
  };

  return (
    <div>
      <div className="field textarea m-0">
        {label && <div className="label">{label}</div>}
        <textarea
          rows={rows}
          value={message}
          placeholder={placeholder}
          className="block"
          onChange={(event) => setMessage(event.target.value)}
        />
      </div>

      <div className="v-right mt-1">
        <NotificationButton
          title={buttonTitle}
          variant="primary"
          disabled={!enable}
          onClick={onClickStartHandler}
        />
      </div>
    </div>
  );
};

export default NotificationItemApiMessage;
