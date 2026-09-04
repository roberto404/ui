import React, { useEffect, useRef, useState } from "react";

/* !-- Actions */

/* !-- Components */

import IconAnimatedCheckmark from "./iconCheckmark";
import IconError from "../icon/mui/alert/error";
import IconInfo from "../icon/mui/action/info";
import PreloadIcon from "../icon/preload";
import Button, { PropTypes as ButtonPropTypes } from "./button";
import ProgressBar from "./progressBar";
import isEmpty from "lodash/isEmpty";

/* !-- Constants */

/* !-- Types */

import { ApiResponse, Status } from "../apiType";

export type StartPayload = Record<string, any>;

export type ChildrenPropTypes = {
  /**
   * Elindítja az api hívást. A kapott payload összefésülődik az api paraméterével.
   */
  onStart: (payload?: StartPayload) => void;
  onClose?: () => void;
};

export type PropTypes = {
  title: string | ((respond: Record<string, any>) => string);
  caption?: string | ((respond: Record<string, any>) => string);
  onClose?: () => void;
  Icon?: React.FC<{ className?: string }>;
  /**
   * Ha true, az api hívás azonnal indul (`addApi`), különben az `onStart`-ra vár (`addApiPromise`).
   */
  autoStart?: boolean;
  /**
   * Indítás előtt megjelenő tartalom. Function Component esetén megkapja az `onStart` handlert.
   */
  children?: React.FC<ChildrenPropTypes> | React.ReactNode;
  payload: {
    api: (payload?: StartPayload) => Promise<ApiResponse<any>>;
    button?: ButtonPropTypes;
    onLoad?: (response: ApiResponse<any>) => void;
  };
};

/* !-- Helpers */

/**
 * Az `onStart` gyakran közvetlenül onClick handlerként fut, ilyenkor a SyntheticEvent-et kapja
 * paraméterként - azt nem szabad az api payloadjába engedni.
 */
const normalizeStartPayload = (payload?: StartPayload): StartPayload => {
  if (!payload || typeof payload !== "object" || "nativeEvent" in payload) {
    return {};
  }

  return payload;
};

/**
 * Api hívás értesítés, ami csak `onStart` után indul el.
 * Indulás után megegyezik az `ItemApi` template-tel: preload -> válasz -> button callback.
 */
const NotificationItemApiPromise = ({
  title = "Loading data...",
  caption,
  payload,
  onClose,
  autoStart = false,
  children: Children,
  Icon = IconInfo,
}: PropTypes) => {
  const [startPayload, setStartPayload] = useState<StartPayload | null>(
    autoStart ? {} : null,
  );
  const [respond, setRespond] = useState(null);
  const abortRef = useRef(false);

  const started = startPayload !== null;

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    // Payload changed, set default state
    setRespond(null);
    abortRef.current = false;

    const fetchData = async () => {
      if (!payload?.api) return;

      const result = await payload.api(startPayload);

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
  }, [payload.api, startPayload]);

  const onStart = (nextPayload?: StartPayload) => {
    if (started) {
      return;
    }

    setStartPayload(normalizeStartPayload(nextPayload));
  };

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
          {!started && (
            <Icon className="w-2 h-2 p-1/4 bg-blue-dark fill-white circle" />
          )}
          {started && !respond && (
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

        <div className="py-1 text-line-s grow pr-1">
          <div className="bold">
            {typeof title === "string" ? title : title(respond)}
          </div>
          {caption && (
            <div className="text-s text-gray mt-1 light">
              {typeof caption === "string" ? caption : caption(respond)}
            </div>
          )}

          {/* Indítás előtti tartalom */}
          {!started && Children && (
            <>
              {typeof Children === "function" ? (
                <Children onStart={onStart} onClose={onClose} />
              ) : (
                Children
              )}
            </>
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

export default NotificationItemApiPromise;
