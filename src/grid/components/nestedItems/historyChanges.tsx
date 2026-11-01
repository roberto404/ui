import React from 'react';
import classNames from 'classnames';


/* !- Types */

export type HistoryChangeEntry = {
  // set: the value without a known previous state (neutral)
  type: 'added' | 'removed' | 'changed' | 'set',
  // added / removed / set: the element; changed: what changed (e.g. "Szélesség"), optional
  label?: React.ReactNode,
  from?: React.ReactNode,
  to?: React.ReactNode,
};

export type HistoryChange = {
  field: string,
  // field name (default: the field)
  title?: React.ReactNode,
  entries: HistoryChangeEntry[],
};

type PropTypes = {
  changes: HistoryChange[],
  // without the field names (ex. one field, its name is already in the title)
  hideTitles?: boolean,
  className?: string,
};


/* !- Constants */

// a chip of a change (not the `.tag`: that is uppercase and inline-flex, it eats the spaces)
const CHIP = 'inline-block rounded px-1 py-1/2 text-xs';


/* !- Elements */

const Entry = ({ type, label, from, to }: HistoryChangeEntry) =>
{
  if (type === 'changed') {
    return (
      <span className={classNames(CHIP, 'bg-gray-light')}>
        {label && <span className="text-gray-dark">{label}: </span>}
        <span className="strikethrough text-gray">{from ?? '–'}</span>
        {' → '}
        <span className="bold">{to ?? '–'}</span>
      </span>
    );
  }

  if (type === 'set') {
    return <span className={classNames(CHIP, 'bg-gray-light')}>{label}</span>;
  }

  const isAdded = type === 'added';

  return (
    <span
      className={classNames(CHIP, {
        'bg-chart-good text-chart-good': isAdded,
        'bg-chart-bad text-chart-bad strikethrough': !isAdded,
      })}
      title={isAdded ? 'Hozzáadva' : 'Eltávolítva'}
    >
      {isAdded ? '+ ' : '− '}
      {label}
    </span>
  );
};

/**
 * Only the changes of a log entry by field: added elements green, removed red
 * (struck through), changed values "old → new".
 *
 * @example
 * <HistoryChanges
 *   changes={[
 *     { field: 'flag', title: 'Címkék', entries: [
 *       { type: 'added', label: 'Magyar termék' },
 *       { type: 'removed', label: 'Akciós' },
 *     ] },
 *     { field: 'price_sale_gross', title: 'Bruttó eladási ár', entries: [
 *       { type: 'changed', from: '209 990 Ft', to: '189 990 Ft' },
 *     ] },
 *   ]}
 * />
 */
const HistoryChanges = ({ changes, hideTitles = false, className }: PropTypes) => (
  <div className={classNames('column gap-1/2', className)}>
    {changes.map(({ field, title, entries }) => (
      <div key={field} className="flex wrap gap-1/2 text-s" style={{ alignItems: 'baseline' }}>
        {!hideTitles && <span className="text-gray-dark bold mr-1/2 nowrap">{title ?? field}</span>}
        {entries.map((entry, index) => (
          <Entry key={index} {...entry} />
        ))}
      </div>
    ))}
  </div>
);

export default HistoryChanges;
