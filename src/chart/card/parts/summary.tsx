import React from 'react';

import { ChangeBadge } from './statValue';


/* !- Types */

export type SummaryItem = {
  label: React.ReactNode,
  // formatted node or a number (formatted with `format`)
  value: React.ReactNode,
  change?: number,
  // small colour dot (matches the series)
  color?: string,
};

export type SummaryProps = {
  items: SummaryItem[],
  format?: (value: number) => React.ReactNode,
};


/**
 * Footer summary row — one block per data series (label + big value + change),
 * or a single block for the primary series.
 */
const Summary = ({ items, format = (value) => value.toLocaleString() }: SummaryProps) => (
  <div
    className="chart-card-summaries"
    style={{
      display: 'flex',
      gap: '2.5rem',
      flexWrap: 'wrap',
      borderTop: '1px solid #eef0f3',
      paddingTop: '1rem',
      marginTop: '0.25rem',
    }}
  >
    {items.map((item, index) => (
      <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', color: '#6b7280' }}>
          {item.color && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'inline-block', flex: 'none' }} />
          )}
          {item.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0b1524', letterSpacing: '-0.02em' }}>
            {typeof item.value === 'number' ? format(item.value) : item.value}
          </div>
          {typeof item.change === 'number' && <ChangeBadge change={item.change} className="text-s" />}
        </div>
      </div>
    ))}
  </div>
);

export default Summary;
