import { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";


/* !-- Actions */

import { modal } from "../layer/actions";



export const useDisplayErrors = () => {

  const dispatch = useDispatch();
  const intl = useIntl();
  const store = useStore();

  const displayErrors = useCallback(
    (formId: string, formFields: any, enableDispatch = true): false | { title: string, content: string } => {

      const error = store.getState().form[formId]?._errors;

      if (isEmpty(error)) {
        return false;
      }

      const errors = Object.keys(error).reduce((result: Record<string, string[]>, field) => {
        error[field].forEach((intlError: string) => {
          if (!result[intlError]) {
            result[intlError] = [];
          }
          result[intlError].push(field);
        });
        return result;
      }, {});

      const content = Object.keys(errors)
        .map((intlError) => {
          const intlFields = errors[intlError].map(
            (e) => intl.formatMessage({ id: formFields[e].label })
          );

          const intlMessage = intl.formatMessage({ id: intlError });

          return `${intlMessage}: ${intlFields.join(", ")}`;
        })
        .join(". ");

      const modalProps = { title: "Hiányzó, vagy hibás adatok.", content };

      if (enableDispatch) {
        dispatch(modal(modalProps));
      }

      return modalProps;
    },
    []
  );

  return displayErrors;
};
