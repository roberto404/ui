
import React from 'react';
import PropTypes from 'prop-types';


/* !- React Elements */

import MuiBadge from 'material-ui/Badge';
import IconUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import IconDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { deepOrange700, teal500 } from 'material-ui/styles/colors';

/**
* Grid Cell Stateless Component
*
* Every props value parsing by type
* - number format readable tousands and negative number visible red color
* - if number is float convert percent and put before put positive or negative icon
* - function is eval
*
* Formated Cell
* @example
* <Cell
*   badge={<UploadIcon color={red500} />}
*   sup={'*sup'}
*   value={-0.22}
*   sub={0.21}
* />
*
* or use format helper
*
* <Cell
*   sup={averageDeviation(props)}
*   value={extendUnit(props)}
* />
*/
const GridCell = (
  {
    value,
    badge,
    sup,
    sub,
    valueFormat,
    badgeFormat,
    supFormat,
    subFormat,
  },
  {
    store,
  },
) =>
{
  /**
   * Value fromating helper
   * @param  {any} v value
   * @param {string} format
   * @return {ReactElement}
   */
  const parseValue = (v, format) =>
  {
    let val = v;

    // pre processing
    if (typeof val === 'function')
    {
      val = val(store.getState());
    }

    switch (format)
    {
      case 'percent':
        {
          if (isNaN(val) || !val)
          {
            console.log(val);
            return <div />
          }

          const formatedVal = `${Math.round(Math.abs(val) * 100)}%`;

          // negative
          if (val < 0)
          {
            return (
              <div>
                <IconDown
                  color={deepOrange700}
                  style={{ width: '14px', height: '14px' }}
                />
                <span style={{ color: deepOrange700 }}>{formatedVal}</span>
              </div>
            );
          }

          // positive
          return (
            <div>
              <IconUp
                color={teal500}
                style={{ width: '14px', height: '14px' }}
              />
              <span style={{ color: teal500 }}>{formatedVal}</span>
            </div>
          );
        }

      case 'color':
        {
          let color = 'inherit';

          if (val < 0)
          {
            color = deepOrange700;
          }

          return <span style={{ color }}>{val.toLocaleString('hu-HU')}</span>;
        }

      default:
        return <div>{val}</div>;
    }
  };

  /**
   * Rendering Top Rigth Badge
   * @private
   * @param  {ReactElement}  children
   * @return {ReactElement}
   */
  const renderBadge = (children) =>
  {
    if (!badge)
    {
      return children;
    }

    const badgeStyle = {
      top: '2px',
    };

    if (typeof badge === 'object')
    {
      badgeStyle.background = 'none';
    }

    return (
      <MuiBadge
        badgeContent={parseValue(badge, badgeFormat)}
        badgeStyle={badgeStyle}
        style={{
          padding: '8px 24px 14px 0px',
          zIndex: 1,
        }}
        primary
      >
        { children }
      </MuiBadge>
    );
  };

  /**
   * Rendering Top Left Badge
   * @private
   * @param  {ReactElement}  children
   * @return {ReactElement}
   */
  const renderSup = (children) =>
  {
    if (!sup)
    {
      return <div style={{ padding: '12px 0px 6px 0px' }}>{children}</div>;
    }

    return (
      <MuiBadge
        badgeContent={parseValue(sup, supFormat)}
        badgeStyle={{
          placeContent: 'inherit',
          right: 'inherit',
          background: 'none',
        }}
      >
        { children }
      </MuiBadge>
    );
  };

  /**
   * Rendering Bottom Left Badge
   * @private
   * @param  {ReactElement}  children
   * @return {ReactElement}
   */
  const renderSub = (children) =>
  {
    if (!sub)
    {
      return children;
    }

    return (
      <MuiBadge
        badgeContent={parseValue(sub, subFormat)}
        badgeStyle={{
          placeContent: 'inherit',
          right: 'inherit',
          background: 'none',
          position: 'relative',
          top: '-4px',
          marginBottom: '-11px',
        }}
        style={{
          padding: 'none',
        }}
      >
        { children }
      </MuiBadge>
    );
  };

  return renderBadge(
    renderSup(
      renderSub(
        parseValue(value, valueFormat),
      ),
    ),
  );
};

/**
 * contextTypes
 * @type {Object}
 */
GridCell.contextTypes = {
  store: PropTypes.object,
};

export default GridCell;
