import React from 'react';
import classNames from 'classnames';

import { SeriesGridApi } from '../hooks/useSeriesGrid';


/* !- Types */

export type Segment = {
  id: string,
  title: React.ReactNode,
  // argument handed to the grid filter when this segment is activated
  value: any,
};

export type SegmentedFilterProps = {
  api: SeriesGridApi,
  segments: Segment[],
  // allow several active at once (AND-combined); default single-select
  multiple?: boolean,
};


/* !- Component */

/**
 * Segmented pill control (1D / 1W / 1M / 1Q). Each pill toggles a pre-registered
 * grid filter by id, so the chart + summary + change all react to the change.
 *
 * Single-select (default): activating one deactivates the rest. `multiple`:
 * every pill toggles independently.
 */
const SegmentedFilter = ({ api, segments, multiple = false }: SegmentedFilterProps) => {

  const onClick = (segment: Segment) => () => {
    const active = api.isFilterActive(segment.id);

    if (multiple) {
      if (active) {
        api.detachFilterId(segment.id);
      }
      else {
        api.applyFilterValue(segment.id, segment.value);
      }
      return;
    }

    // single-select: clear the others, keep the clicked one active
    segments.forEach((item) => {
      if (item.id !== segment.id) {
        api.detachFilterId(item.id);
      }
    });

    if (!active) {
      api.applyFilterValue(segment.id, segment.value);
    }
  };

  return (
    <div className="chart-card-segments" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {segments.map((segment) => {
        const active = api.isFilterActive(segment.id);

        return (
          <button
            key={segment.id}
            type="button"
            onClick={onClick(segment)}
            className={classNames('chart-card-segment', { active })}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              lineHeight: 1,
              transition: 'background-color .15s, color .15s',
              backgroundColor: active ? '#e8f0ff' : '#f1f3f5',
              color: active ? '#186eff' : '#6b7280',
            }}
          >
            {segment.title}
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedFilter;
