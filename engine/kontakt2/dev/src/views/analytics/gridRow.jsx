import React from 'react';
import PropTypes from 'prop-types';
import simplify from '@1studio/utils/math/simplify';
import clamp from '@1studio/utils/math/clamp';
import formatThousand from '@1studio/utils/string/formatThousand';

/* !- React Elements */

import IconArrow from '@1studio/ui/icon/mui/navigation/arrow_back';
import IconStar from '@1studio/ui/icon/mui/toggle/star';


import { UNIT, SIMPLIFY_ROOT, SIMPLIFY_UNITS, SIMPLIFY_FORMAT } from './const';

/**
 * Visible store value and changes
 */
export const GridColumnStore = (record, { store }) =>
{
  const a = record[record.observe] || 0;
  const b = record[`${record.observe}B`] || 0;

  const stateForm = store.getState().form || {};
  const unitIndex = ['count', 'countUnique'].indexOf(stateForm.summarize) === -1 ? stateForm.field : 'q';
  const unit = UNIT[unitIndex] || '';

  const diff = +(!a || !b) || Math.round((a / b) * 10) / 10;
  const showDiff = diff !== 1;

  const color = diff >= 1 ? 'green' : 'red';
  const rotate = diff >= 1 ? '90' : '270';

  const valueA = `${formatThousand(Math.round(a / 100) / 10)}e ${unit}`;
  const valueB = !b ? '-' : `${formatThousand(Math.round(b / 100) / 10)}e ${unit}`;

  return (
    <div>
      <div>
        <span className="bold">{valueA}</span>
        { showDiff &&
        <span>
          <span className={`pl-1/2 bold text-xs text-${color}`}>
            {`${diff}`}
          </span>
          <IconArrow className={`fill-${color} w-1 rotate-${rotate}`} />
        </span>
        }
      </div>
      <div className="text-s text-gray light">{valueB}</div>
    </div>
  );
};

GridColumnStore.contextTypes = {
  store: PropTypes.object,
};


export const GridColumnStar = (record) =>
{
  const trafficChange = record.traffic / record.trafficB;

  const rate = clamp(
    trafficChange >= 0 ?
      Math.round(trafficChange / 5) + 3
      : Math.round(trafficChange / 0.5) + 1,
    0,
    5,
  );

  return (
    <div>
      {
        [...Array(5).keys()].map((n, i) => (
          <IconStar
            key={i}
            className={`fill-gray-${rate > n ? 'dark' : 'light'} w-1.5`}
          />
        ))
      }
    </div>
  );
};

export default {};
