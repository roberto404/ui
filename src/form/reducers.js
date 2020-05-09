import isEmpty from 'lodash/isEmpty';
import validate from 'validate.js';

import
{
  FORM_ERRORS_KEY,
  FORM_SCHEME_KEY,
}
from './constants';


validate.validators.custom = (fieldValue, scheme, fieldId, formData) =>
{
  const result = scheme.validator(fieldValue, scheme, fieldId, formData);

  if (scheme.message && result === false)
  {
    return scheme.message;
  }

  if (typeof result === 'string')
  {
    return result;
  }

  return '';
};


export default (state = {}, action = {}) =>
{
  if (action.id === FORM_ERRORS_KEY)
  {
    console.warn(`_${FORM_ERRORS_KEY} is a reserved word.`);
    return state;
  }

  switch (action.type)
  {
    case 'FORM_SET_VALUES':
      {
        let newState = {};

        if (!action.form)
        {
          newState = {
            ...state,
            ...action.items,
          };

          const scheme = newState[FORM_SCHEME_KEY] || state[FORM_SCHEME_KEY];

          if (scheme)
          {
            newState[FORM_ERRORS_KEY] = validate(newState, scheme);
          }
        }
        else
        {
          newState = {
            ...state,
            [action.form]: {
              ...(state[action.form] || {}),
              ...action.items,
            },
          };

          let scheme = newState[action.form][FORM_SCHEME_KEY];

          if (!scheme && state[action.form])
          {
            scheme = state[action.form][FORM_SCHEME_KEY];
          }

          if (scheme)
          {
            newState[action.form][FORM_ERRORS_KEY] = validate(
              newState[action.form],
              scheme,
            );
          }
        }
        return newState;
      }

    case 'FORM_UNSET_VALUES':
      {
        const newState = { ...state };

        let instance;

        Object.keys(action.items).forEach((id) =>
        {
          let values = action.items[id];

          instance = (!action.form) ? newState[id] : newState[action.form][id];

          if (typeof instance !== 'undefined')
          {
            if (Array.isArray(instance) && values !== undefined)
            {
              if (!Array.isArray(values))
              {
                values = [values];
              }

              values.forEach((value) =>
              {
                const index = instance.indexOf(value);

                if (index > -1)
                {
                  if (!action.form)
                  {
                    newState[id].splice(index, 1);
                  }
                  else
                  {
                    newState[action.form][id].splice(index, 1);
                  }
                }
              });
            }

            if (!Array.isArray(instance) || !instance.length || values === undefined)
            {
              if (!action.form)
              {
                delete newState[id];
              }
              else
              {
                delete newState[action.form][id];
              }
            }
          }
        });

        if (state && !isEmpty(state[FORM_SCHEME_KEY]))
        {
          newState[FORM_ERRORS_KEY] = validate(newState, state[FORM_SCHEME_KEY]);
        }
        return newState;
      }

    case 'FORM_VALIDATE':
      {
        if (state && !isEmpty(state[FORM_SCHEME_KEY]))
        {
          return {
            ...state,
            [FORM_ERRORS_KEY]: validate(state, state[FORM_SCHEME_KEY]),
          };
        }

        return state;
      }

    case 'FORM_FLUSH':
      {
        const newState = { ...state };

        if (action.form)
        {
          if (typeof newState[action.form] !== 'undefined')
          {
            delete newState[action.form];
          }

          return newState;
        }

        return {};
      }

    default:
      return state;
  }
};
