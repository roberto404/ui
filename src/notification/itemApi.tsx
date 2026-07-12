import React, { useEffect, useRef, useState } from "react";

/* !-- Actions */

/* !-- Components */

import IconAnimatedCheckmark from "./iconCheckmark";
import IconError from "../icon/mui/alert/error";
import PreloadIcon from "../icon/preload";
import Button, { PropTypes as ButtonPropTypes } from "./button";
import { ApiResponse, Status } from "../apiType";
import isEmpty from "lodash/isEmpty";
import ProgressBar from "./progressBar";

/* !-- Constants */

/* !-- Types */

export type PropTypes = {
  title: string | ((respond: Record<string, any>) => string);
  percent: number;
  caption?: string | ((respond: Record<string, any>) => string);
  onClose?: () => void;
  payload: {
    api: () => Promise<ApiResponse<any>>;
    button?: ButtonPropTypes;
    onLoad?: (response: ApiResponse<any>) => void;
  };
};

/**
 * Preloading, when respond -> parse response -> button callback
 */
const NotificationItemApi = ({
  title = "Loading data...",
  caption,
  payload,
  onClose,
}: PropTypes) => {
  const [respond, setRespond] = useState(null);
  const abortRef = useRef(false);

  useEffect(() => {
    // Payload changed, set default state
    setRespond(null);
    abortRef.current = false;

    const fetchData = async () => {
      if (!payload?.api) return;

      const result = await payload.api();

      if (!abortRef.current) {
        setRespond(result);
      }

      if (typeof payload.onLoad === "function") {
        payload.onLoad(result);
      }
    };

    fetchData();

    // Cleanup: ha payload változik / komponens unmount
    return () => {
      abortRef.current = true;
    };
  }, [payload.api]);

  const success =
    respond &&
    respond.status !== Status.ERROR &&
    (respond.records === undefined || !isEmpty(respond.records));

  return (
    <div>
      <div className="flex pl-1">
        {/* Icon */}

        <div
          className="border-right p-2 mr-2 my-1"
          style={{ alignSelf: "center" }}
        >
          {!respond && (
            <div className="w-2 h-2 fill-gray-dark circle bg-gray-light">
              <PreloadIcon />
            </div>
          )}
          {respond && success && <IconAnimatedCheckmark />}
          {respond && !success && (
            <IconError className="w-2 h-2 p-1/4 bg-red-dark fill-white circle" />
          )}
        </div>

        {/* Message */}

        <div className="py-1 text-line-s">
          <div className="bold">
            {typeof title === "string" ? title : title(respond)}
          </div>
          {caption && (
            <div className="text-s text-gray mt-1 light">
              {typeof caption === "string" ? caption : caption(respond)}
            </div>
          )}

          {/* Button */}
          {respond && success && payload.button && (
            <Button {...payload.button} respond={respond} onClose={onClose} />
          )}
        </div>
      </div>
      {respond && (!success || !payload.button) && (
        <ProgressBar
          percentTime={payload.button ? 5 : 2}
          onClose={onClose}
          color="white"
        />
      )}
    </div>
  );
};

export default NotificationItemApi;
