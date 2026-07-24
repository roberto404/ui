import React from 'react';
import classNames from 'classnames';

import granularityFromRange, { Granularity } from '@1studio/utils/date/granularityFromRange';
import { SeriesGridApi } from '../hooks/useSeriesGrid';


/* !- Period bucketing (plain Date, no moment dependency) */

type Period = { id: string, label: string, start: number, end: number };

const startOf = (time: number, granularity: Granularity): Date => {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  if (granularity === 'month') { date.setDate(1); }
  if (granularity === 'year') { date.setMonth(0, 1); }
  return date;
};

const next = (date: Date, granularity: Granularity): Date => {
  const forward = new Date(date);
  if (granularity === 'day') { forward.setDate(forward.getDate() + 1); }
  if (granularity === 'month') { forward.setMonth(forward.getMonth() + 1); }
  if (granularity === 'year') { forward.setFullYear(forward.getFullYear() + 1); }
  return forward;
};

const labelOf = (date: Date, granularity: Granularity): string => {
  if (granularity === 'day') { return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
  if (granularity === 'month') { return date.toLocaleDateString(undefined, { month: 'short' }); }
  return String(date.getFullYear());
};

const buildPeriods = (min: number, max: number, granularity: Granularity): Period[] => {
  if (!max) {
    return [];
  }

  const periods: Period[] = [];
  let cursor = startOf(min, granularity);

  // guard against pathological ranges
  for (let i = 0; cursor.getTime() <= max && i < 1000; i += 1) {
    const start = cursor.getTime();
    const forward = next(cursor, granularity);
    periods.push({ id: cursor.toISOString().slice(0, 10), label: labelOf(cursor, granularity), start, end: forward.getTime() - 1 });
    cursor = forward;
  }

  return periods;
};

const dataRange = (api: SeriesGridApi) => {
  const axis = api.raw[0]?.xAxis || [];
  const times = axis.map((value) => new Date(value).getTime()).filter((time) => !isNaN(time));

  return times.length ? { min: Math.min(...times), max: Math.max(...times) } : { min: 0, max: 0 };
};


/* !- Styles */

const chip: React.CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: 'nowrap',
  transition: 'background-color .15s, color .15s',
};

const arrowButton: React.CSSProperties = {
  border: 'none',
  background: '#f1f3f5',
  color: '#6b7280',
  cursor: 'pointer',
  borderRadius: '999px',
  width: '1.9rem',
  height: '1.9rem',
  flex: 'none',
  fontSize: '1.1rem',
  lineHeight: 1,
};


/* !- Types */

export type PeriodCarouselProps = {
  api: SeriesGridApi,
  // grid filter id (must be registered on the card); browses/filters by date period
  filterId?: string,
  // widest the strip may get before it scrolls
  maxWidth?: number | string,
};


/**
 * Dynamic period selector (top-right of a DateFilterCard).
 *
 * Buckets the data's date range at a granularity chosen from its span
 * (≤14 days → days, ≤24 months → months, else years) and renders a scrollable
 * strip of period chips. Selecting a chip filters the grid to that period;
 * selecting it again clears the filter ("all").
 */
const PeriodCarousel = ({ api, filterId = 'period', maxWidth = 460 }: PeriodCarouselProps) => {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState<string | null>(null);

  const { min, max } = dataRange(api);
  const granularity = granularityFromRange(min, max);
  const periods = React.useMemo(() => buildPeriods(min, max, granularity), [min, max, granularity]);

  const onSelect = (period: Period) => () => {
    if (active === period.id) {
      api.detachFilterId(filterId);
      setActive(null);
      return;
    }

    api.applyFilterValue(filterId, `${period.start}|${period.end}`);
    setActive(period.id);
  };

  const scrollBy = (direction: number) => () => {
    scroller.current?.scrollBy({ left: direction * 160, behavior: 'smooth' });
  };

  if (!periods.length) {
    return null;
  }

  return (
    <div className="chart-card-period-carousel" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', maxWidth }}>
      <button type="button" style={arrowButton} onClick={scrollBy(-1)} aria-label="previous">‹</button>

      <div
        ref={scroller}
        style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '0.15rem' }}
      >
        {periods.map((period) => {
          const isActive = active === period.id;

          return (
            <button
              key={period.id}
              type="button"
              onClick={onSelect(period)}
              className={classNames('chart-card-period', { active: isActive })}
              style={{
                ...chip,
                backgroundColor: isActive ? '#0b1524' : '#f1f3f5',
                color: isActive ? '#fff' : '#4b5563',
              }}
            >
              {period.label}
            </button>
          );
        })}
      </div>

      <button type="button" style={arrowButton} onClick={scrollBy(1)} aria-label="next">›</button>
    </div>
  );
};

export default PeriodCarousel;
