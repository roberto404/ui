import React, { useMemo, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import formatLogDay from '@1studio/utils/date/formatLogDay';


/* !- React Elements */

import NestedList from '../nestedList';
import History from './history';
import IconFilter from '../../../icon/mui/content/filter_list';
import IconAll from '../../../icon/mui/navigation/menu';


/* !- Constants */

import { getHistoryCategories, HistoryCategories } from './historyCategories';


/* !- Types */

type HistoryRecord = Record<string, any> & { category?: string };

type PropTypes = {
  /**
   * History records (from the grid Connect too: `<Connect><HistoryList /></Connect>`)
   */
  data?: HistoryRecord[],
  /**
   * Header title, next to it the number of the (filtered) entries
   */
  title?: React.ReactNode,
  /**
   * Filter by category (header "Szűrő" button + category chips)
   */
  filterable?: boolean,
  /**
   * Extends / overrides the global categories (setHistoryCategories)
   */
  categories?: HistoryCategories,
  /**
   * Category of the records without (a known) category, e.g. `other`
   */
  defaultCategory?: string,
  /**
   * Date-time field of the records
   */
  dateField?: string,
  /**
   * Day label (group title): moment format or function.
   * Default: current year "nov. 16.", other years "2025-11-16".
   */
  dateFormat?: string | ((date: moment.Moment) => string),
  onClick?: (record: HistoryRecord, event: React.MouseEvent) => void,
  className?: string,
};


/* !- Helpers */

const defaultDateFormat = (date: moment.Moment) =>
  (date.year() === moment().year() ? formatLogDay(date.toDate()) : date.format('YYYY-MM-DD'));

const formatDay = (date: moment.Moment, dateFormat: PropTypes['dateFormat']) => {
  if (typeof dateFormat === 'function') {
    return dateFormat(date);
  }

  return dateFormat ? date.format(dateFormat) : defaultDateFormat(date);
};


/**
 * History list: day groups (newest first) of History entries, optional header and category filter.
 *
 * @example
 * setHistoryCategories({ payment: { title: 'Fizetés', icon: IconCreditCard, color: '#3d8b52' } });
 *
 * <HistoryList
 *   title="Napló"
 *   data={records}  // [{ category: 'payment', title, userName, insertDateTime, tag, message }]
 *   filterable
 * />
 */
const HistoryList = ({
  data = [],
  title,
  filterable = false,
  categories,
  defaultCategory,
  dateField = 'insertDateTime',
  dateFormat,
  onClick,
  className,
}: PropTypes) => {

  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const allCategories = getHistoryCategories(categories);

  const getCategoryId = (record: HistoryRecord) =>
    (record.category && allCategories[record.category] ? record.category : defaultCategory);

  const records = useMemo(
    () => (selected.length ? data.filter(record => selected.includes(getCategoryId(record) as string)) : data),
    [data, selected, categories, defaultCategory],
  );

  /**
   * { '#nov. 16.': [records], ... } newest first
   */
  const nestedData = useMemo(
    () => [...records]
      .map(record => ({ record, date: moment(record[dateField]) }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf())
      .reduce((groups: Record<string, HistoryRecord[]>, { record, date }) => {
        const key = `#${formatDay(date, dateFormat)}`;

        groups[key] = [...(groups[key] || []), record];

        return groups;
      }, {}),
    [records, dateField, dateFormat],
  );

  const onClickChip = (categoryId?: string) => {
    if (!categoryId) {
      setSelected([]);
      return;
    }

    setSelected(selected.includes(categoryId) ?
      selected.filter(id => id !== categoryId) : [...selected, categoryId]);
  };

  const isFiltered = selected.length > 0;

  // closing the filter resets it: the whole list again
  const onClickFilter = () => {
    if (isFilterOpen) {
      setSelected([]);
    }

    setFilterOpen(!isFilterOpen);
  };

  // pill chip: gray, active black
  const chipClassName = (isActive: boolean) => classNames(
    'initial h-center gap-1/2 px-1 py-1/2 rounded-l bold pointer',
    isActive ? 'bg-black text-white fill-white shadow-outer-2' : 'bg-gray-light text-black fill-black hover:bg-white-dark',
  );

  return (
    <div className={classNames('text-s', className)}>

      {(title || filterable) &&
        <div className="h-center mb-1">
          <div className="grow h-center">
            {title && <div className="bold zoom-1.1 mr-1/2">{title}</div>}
            {title && <div className="text-xs text-gray-dark">{`${records.length} bejegyzés`}</div>}
          </div>

          {filterable &&
            <button
              type="button"
              className={classNames(
                'initial h-center gap-1/2 px-1 py-1/2 rounded border bold pointer',
                isFilterOpen ? 'bg-black border-black text-white fill-white' : 'bg-white-light text-black fill-black',
              )}
              onClick={onClickFilter}
            >
              <IconFilter className="w-1.5 h-1.5" />
              <span>Szűrő</span>
            </button>
          }
        </div>
      }

      {filterable && isFilterOpen &&
        <div className="flex wrap gap-1/2 mb-1">
          <button
            type="button"
            className={chipClassName(!isFiltered)}
            onClick={() => onClickChip()}
          >
            <IconAll className="w-1.5 h-1.5" />
            <span>Összes</span>
          </button>

          {Object.keys(allCategories).map((id) => {
            const { title: categoryTitle, filterTitle, icon, filterIcon } = allCategories[id];
            const Icon = filterIcon || icon;

            return (
              <button
                key={id}
                type="button"
                className={chipClassName(selected.includes(id))}
                onClick={() => onClickChip(id)}
              >
                {Icon && <Icon className="w-1.5 h-1.5" />}
                <span>{filterTitle || categoryTitle}</span>
              </button>
            );
          })}
        </div>
      }

      <NestedList
        nestedData={nestedData}
        // one group level (day), the records are the leaves
        groupBy={['day']}
        UI={History}
        UiProps={{ onClick, categories, defaultCategory }}
        className="nested-list"
        NoResults={() => <div className="py-2 text-gray">Nincs bejegyzés.</div>}
      />
    </div>
  );
};

export default HistoryList;
