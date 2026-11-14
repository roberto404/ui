import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

/* !- Contexts */

import { FormContext } from '../context';

/* !- Redux Actions */

import { setValues, unsetValues } from '../actions';
import { popover, close } from '../../layer/actions';

/* !- React Elements */

import CalendarScroll, { CalendarScrollType } from './calendarScroll';
import Segment from './segment';
import IconCalendar from '../../icon/mui/action/calendar_today';
import IconClose from '../../icon/mui/navigation/close';

/* !- Constants */

import { DATE_FORMAT } from '../../calendar/constants';

import styles from './calendarRange.module.scss';

const TABS: Array<{ id: CalendarScrollType; title: string }> = [
  { id: 'day', title: 'Nap és hét' },
  { id: 'month', title: 'Hónap' },
  { id: 'quarter', title: 'Negyedév' },
];

const UNIT_LABEL: Record<CalendarScrollType, string> = {
  day: 'nap',
  month: 'hónap',
  quarter: 'negyedév',
};

type Range = { from?: string; to?: string };

type CalendarRangeProps = {
  /** A popover belső (piszkozat) mezőinek névtere */
  id?: string;
  /** A végleges időszak mezői (az „Adatok betöltése” írja) */
  fromId?: string;
  toId?: string;
  form?: string;
  /** A tárolt érték formátuma (moment) */
  dateFormat?: string;
  /** Kezdő fül, ha még nincs alkalmazott időszak */
  type?: CalendarScrollType;
  label?: string;
  /** Naptár ikon a gombban */
  icon?: boolean;
  placeholder?: string;
  buttonClassName?: string;
  className?: string;
  min?: string;
  max?: string;
  validator?: (timestamp: number) => boolean;
  applyLabel?: string;
  clearLabel?: string;
  /** Az alkalmazott (vagy törölt) időszak */
  onApply?: (value: { from?: string; to?: string; type: CalendarScrollType }) => void;
};

/* !- Formázás */

/** Egy időszak-elem: 2026. okt. 14. / 2026. aug. / 2026 Q2 (`withYear = false`: év nélkül) */
const formatItem = (date: moment.Moment, type: CalendarScrollType, withYear = true) => {
  if (type === 'quarter') return `${withYear ? `${date.year()} ` : ''}Q${date.quarter()}`;
  if (type === 'month') return date.format(withYear ? 'YYYY. MMM' : 'MMM');

  return date.format(withYear ? 'YYYY. MMM D.' : 'MMM D.');
};

/**
 * Időszak egy sorban: okt. 14. – nov. 12. / aug. – okt. / Q2 – Q3 (idei év: év nélkül),
 * 2025. okt. 14. – nov. 12. (más év), 2025. dec. 1. – 2026. jan. 5. (évhatáron át)
 */
export const formatRange = (range: Range, type: CalendarScrollType, dateFormat = DATE_FORMAT) => {
  const from = range.from ? moment(range.from, dateFormat) : null;
  const to = range.to ? moment(range.to, dateFormat) : null;

  if (!from) return '';

  const unit = type === 'day' ? 'day' : type;
  const crossYear = Boolean(to && !from.isSame(to, 'year'));
  const withYear = crossYear || !from.isSame(moment(), 'year');

  if (!to || from.isSame(to, unit)) return formatItem(from, type, withYear);

  return `${formatItem(from, type, withYear)} – ${formatItem(to, type, crossYear)}`;
};

/** Az időszak hossza az egységben (30 nap, 3 hónap, 2 negyedév) */
const countRange = (range: Range, type: CalendarScrollType, dateFormat: string) => {
  if (!range.from) return 0;

  const from = moment(range.from, dateFormat);
  const to = range.to ? moment(range.to, dateFormat) : from;

  if (type === 'day') return to.diff(from, 'days') + 1;

  const index = (date: moment.Moment) =>
    type === 'month' ? date.year() * 12 + date.month() : date.year() * 4 + date.quarter() - 1;

  return index(to) - index(from) + 1;
};

/** -tól / -től a kiolvasott hónapnévhez (szeptembertől … decembertől magas hangrendű) */
const monthSuffix = (date: moment.Moment) => (date.month() >= 8 ? 'től' : 'tól');

/** -tól / -től a negyedév számához (háromtól, de egytől, kettőtől, négytől) */
const quarterSuffix = (date: moment.Moment) => (date.quarter() === 3 ? 'tól' : 'től');

/** nov. 6–12. / okt. 14–nov. 12. */
const dayRangeLabel = (from: moment.Moment, to: moment.Moment) =>
  `${from.format('MMM D')}–${to.format(from.isSame(to, 'month') ? 'D.' : 'MMM D.')}`;

/** aug.–okt. */
const monthRangeLabel = (from: moment.Moment, to: moment.Moment) => `${from.format('MMM')}–${to.format('MMM')}`;

/** Q2–Q3 / 2025 Q4–2026 Q1 */
const quarterRangeLabel = (from: moment.Moment, to: moment.Moment) =>
  from.isSame(to, 'year')
    ? `Q${from.quarter()}–Q${to.quarter()}`
    : `${from.year()} Q${from.quarter()}–${to.year()} Q${to.quarter()}`;

/**
 * Gyorsgombok a fülhöz. A záró érték nap-nézetben maga a nap, hónap/negyedév nézetben
 * az utolsó időszak utolsó napja (mint a CalendarScroll-ban).
 */
const getPresets = (type: CalendarScrollType, dateFormat: string) => {
  const today = moment().startOf('day');

  const preset = (title: string, subtitle: string, from: moment.Moment, to: moment.Moment) => ({
    title,
    subtitle,
    from: from
      .clone()
      .startOf(type === 'day' ? 'day' : type)
      .format(dateFormat),
    to: (type === 'day' ? to.clone() : to.clone().endOf(type).startOf('day')).format(dateFormat),
  });

  if (type === 'month') {
    const month = today.clone().startOf('month');
    const last = (count: number) => [month.clone().subtract(count, 'months'), month.clone().subtract(1, 'months')];
    const [m3a, m3b] = last(3);
    const [m6a, m6b] = last(6);
    const [m12a, m12b] = last(12);

    return [
      preset('Ez a hónap', month.format('MMMM'), month, month),
      preset('Múlt hónap', m3b.format('MMMM'), m3b, m3b),
      preset('Utolsó 3 hónap', monthRangeLabel(m3a, m3b), m3a, m3b),
      preset('Utolsó 6 hónap', monthRangeLabel(m6a, m6b), m6a, m6b),
      preset('Utolsó 12 hónap', `${m12a.format('YYYY. MMM')}-${monthSuffix(m12a)}`, m12a, m12b),
      preset('Idei év', monthRangeLabel(month.clone().startOf('year'), month), month.clone().startOf('year'), month),
    ];
  }

  if (type === 'quarter') {
    const quarter = today.clone().startOf('quarter');
    const last = (count: number) => [
      quarter.clone().subtract(count, 'quarters'),
      quarter.clone().subtract(1, 'quarters'),
    ];
    const [q2a, q2b] = last(2);
    const [q4a, q4b] = last(4);
    const year = quarter.clone().startOf('year');
    const lastYear = year.clone().subtract(1, 'year');

    return [
      preset('Ez a negyedév', formatItem(quarter, 'quarter'), quarter, quarter),
      preset('Előző', formatItem(q2b, 'quarter'), q2b, q2b),
      preset('Utolsó 2', quarterRangeLabel(q2a, q2b), q2a, q2b),
      preset('Utolsó 4', `${formatItem(q4a, 'quarter')}-${quarterSuffix(q4a)}`, q4a, q4b),
      preset('Idei év', `${year.year()} Q1–Q4`, year, year.clone().endOf('year')),
      preset('Tavalyi év', `${lastYear.year()} Q1–Q4`, lastYear, lastYear.clone().endOf('year')),
    ];
  }

  const yesterday = today.clone().subtract(1, 'day');
  const week = today.clone().startOf('isoWeek');
  const lastWeek = week.clone().subtract(1, 'week');

  return [
    preset('Ma', today.format('MMM D.'), today, today),
    preset('Tegnap', yesterday.format('MMM D.'), yesterday, yesterday),
    preset(
      'Utolsó 7 nap',
      dayRangeLabel(today.clone().subtract(6, 'days'), today),
      today.clone().subtract(6, 'days'),
      today,
    ),
    preset('Ez a hét', `${week.isoWeek()}. hét`, week, week.clone().endOf('isoWeek')),
    preset('Múlt hét', `${lastWeek.isoWeek()}. hét`, lastWeek, lastWeek.clone().endOf('isoWeek')),
    preset(
      'Utolsó 30 nap',
      dayRangeLabel(today.clone().subtract(29, 'days'), today),
      today.clone().subtract(29, 'days'),
      today,
    ),
  ];
};

/* !- Kulcsok a form state-ben */

const getKeys = ({ id, fromId, toId }: { id: string; fromId: string; toId: string }) => ({
  draftFrom: `${fromId}@${id}`,
  draftTo: `${toId}@${id}`,
  tab: `${id}@type`,
  appliedType: `${id}@appliedType`,
});

type PanelProps = Required<
  Pick<CalendarRangeProps, 'id' | 'fromId' | 'toId' | 'dateFormat' | 'applyLabel' | 'clearLabel'>
> &
  Pick<CalendarRangeProps, 'form' | 'min' | 'max' | 'validator' | 'onApply'>;

/**
 * A popover tartalma: Ettől/Eddig, gyorsgombok, fül (nap / hónap / negyedév), görgethető
 * naptár, Törlés + Adatok betöltése. A választás piszkozat-mezőkbe megy, csak a betöltés
 * írja át a végleges `fromId` / `toId` mezőket.
 */
export const CalendarRangePanel = ({
  id,
  fromId,
  toId,
  form,
  dateFormat,
  min,
  max,
  validator,
  applyLabel,
  clearLabel,
  onApply,
}: PanelProps) => {
  const dispatch = useDispatch();
  const keys = getKeys({ id, fromId, toId });

  const { draft, type } = useSelector(
    ({ form: state }: any) => {
      const values = (form ? state[form] : state) || {};

      return {
        draft: {
          from: values[keys.draftFrom],
          to: values[keys.draftTo],
        } as Range,
        type: (values[keys.tab] || 'day') as CalendarScrollType,
      };
    },
    (a, b) => a.draft.from === b.draft.from && a.draft.to === b.draft.to && a.type === b.type,
  );

  // gyorsgomb után a naptár újra az időszak elejére görget (újramountol)
  const [jump, setJump] = useState(0);

  const presets = getPresets(type, dateFormat);
  const count = countRange(draft, type, dateFormat);

  // a következő kattintás a záró értéket adja → az „Eddig” mező aktív
  const isEditingTo = Boolean(draft.from && !draft.to);

  const onClickPreset = (preset: Range) => {
    dispatch(setValues({ [keys.draftFrom]: preset.from, [keys.draftTo]: preset.to }, form));
    setJump((value) => value + 1);
  };

  const onClickApply = () => {
    const from = draft.from;
    // csak kezdet → egyetlen időszak (a záró érték az időszak vége)
    const to =
      draft.to || (type === 'day' ? from : moment(from, dateFormat).endOf(type).startOf('day').format(dateFormat));

    dispatch(setValues({ [fromId]: from, [toId]: to, [keys.appliedType]: type }, form));
    dispatch(close());
    onApply?.({ from, to, type });
  };

  const onClickClear = () => {
    dispatch(
      unsetValues(
        {
          [keys.draftFrom]: undefined,
          [keys.draftTo]: undefined,
          [fromId]: undefined,
          [toId]: undefined,
        },
        form,
      ),
    );
    dispatch(close());
    onApply?.({ from: undefined, to: undefined, type });
  };

  const field = (title: string, value: string | undefined, active: boolean) => (
    <div
      className={classNames('grow px-1 py-1/2', styles.field, {
        [styles.fieldActive]: active,
      })}
    >
      <div className={classNames('text-xs medium text-gray-dark', styles.fieldLabel)}>{title}</div>
      <div className="bold nowrap">{value ? formatItem(moment(value, dateFormat), type) : '–'}</div>
    </div>
  );

  return (
    <div className={classNames('calendar-range-panel flex', styles.panel)}>
      {/* gyorsgombok: bal oldali lista */}
      <div className={classNames('bg-white-dark py-2 px-1', styles.presets)}>
        <div className="text-xs medium uppercase text-gray-dark px-1 mb-1">Gyors választás</div>

        {presets.map((preset) => {
          const active = preset.from === draft.from && preset.to === draft.to;

          return (
            <button
              key={preset.title}
              type="button"
              title={preset.subtitle}
              onClick={() => onClickPreset(preset)}
              className={classNames('initial flex h-center w-full text-left nowrap pointer', styles.preset, {
                [`bg-white-light text-black bold ${styles.presetActive}`]: active,
                'text-black': !active,
              })}
            >
              <span
                className={classNames(styles.presetDot, {
                  'bg-blue-dark': active,
                })}
              />
              {preset.title}
            </button>
          );
        })}
      </div>

      <div className={classNames('p-2', styles.main)}>
        {/* Ettől / Eddig + bezárás */}
        <div className="flex h-center gap-1 mb-1">
          <div className={classNames('grow flex bg-white-dark', styles.fields)}>
            {field('ETTŐL', draft.from, !isEditingTo)}
            {field('EDDIG', draft.to, isEditingTo)}
          </div>
          <button
            type="button"
            onClick={() => dispatch(close())}
            className={classNames('initial bg-white-dark text-gray-dark pointer', styles.close)}
          >
            <IconClose className={styles.icon} />
          </button>
        </div>

        {/* nézet: nap és hét / hónap / negyedév */}
        <Segment id={keys.tab} form={form} data={TABS} className={styles.tabs} />

        <CalendarScroll
          key={`${type}-${jump}`}
          type={type}
          fromId={keys.draftFrom}
          toId={keys.draftTo}
          form={form}
          dateFormat={dateFormat}
          min={min}
          max={max}
          validator={validator}
          weekNumbers={type === 'day'}
          height="24em"
          className="mt-1"
        />

        {/* Törlés + Adatok betöltése */}
        <div className={classNames('flex gap-1 pt-1 mt-1', styles.footer)}>
          <button
            type="button"
            onClick={onClickClear}
            className={classNames('initial bg-white-light text-black medium px-2 pointer', styles.clear)}
          >
            {clearLabel}
          </button>
          <button
            type="button"
            disabled={!draft.from}
            onClick={onClickApply}
            className={classNames('initial grow bg-blue-dark text-white bold pointer', styles.apply)}
          >
            {/* egy elemben: flex gombban a szöveg-csomópont szélén a szóköz elveszne */}
            <span>
              {applyLabel}
              {count > 0 && <span className="normal">{` · ${count} ${UNIT_LABEL[type]}`}</span>}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Időszak-választó gomb: a CalendarRangePanel-t popoverben nyitja (gyorsgombok, nap/hét,
 * hónap és negyedév nézet). Az alkalmazott időszak a `fromId` / `toId` mezőkbe kerül
 * (`dateFormat` szerint; hónap/negyedév esetén a záró mezőbe az utolsó nap).
 *
 * @example
 * <CalendarRange
 *   id="orderPeriod"
 *   fromId="from"
 *   toId="to"
 *   onApply={({ from, to }) => fetchData(from, to)}
 * />
 */
const CalendarRange = ({
  id = 'calendarRange',
  fromId = 'from',
  toId = 'to',
  form,
  dateFormat = DATE_FORMAT,
  type = 'day',
  label,
  icon = true,
  placeholder = 'Válassz időszakot',
  buttonClassName = 'shadow outline fill-gray',
  className,
  min,
  max,
  validator,
  applyLabel = 'Adatok betöltése',
  clearLabel = 'Törlés',
  onApply,
}: CalendarRangeProps) => {
  const formContext: any = useContext(FormContext);
  const formId = form || formContext?.form;
  const keys = getKeys({ id, fromId, toId });

  const dispatch = useDispatch();

  const { from, to, appliedType } = useSelector(
    ({ form: state }: any) => {
      const values = (formId ? state[formId] : state) || {};

      return {
        from: values[fromId],
        to: values[toId],
        appliedType: values[keys.appliedType],
      };
    },
    (a, b) => a.from === b.from && a.to === b.to && a.appliedType === b.appliedType,
  );

  const value = formatRange({ from, to }, appliedType || type, dateFormat);

  const onClickButton = (event: React.MouseEvent) => {
    event.preventDefault();

    // a piszkozat az alkalmazott időszakból indul
    dispatch(
      setValues(
        {
          [keys.draftFrom]: from,
          [keys.draftTo]: to,
          [keys.tab]: appliedType || type,
        },
        formId,
      ),
    );

    if (!from) dispatch(unsetValues({ [keys.draftFrom]: undefined, [keys.draftTo]: undefined }, formId));

    dispatch(
      popover(
        <CalendarRangePanel
          id={id}
          fromId={fromId}
          toId={toId}
          form={formId}
          dateFormat={dateFormat}
          min={min}
          max={max}
          validator={validator}
          applyLabel={applyLabel}
          clearLabel={clearLabel}
          onApply={onApply}
        />,
        event,
        { className: `${styles.layer} no-padding` },
      ),
    );
  };

  return (
    <div
      className={classNames('field button-field', className, {
        active: Boolean(value),
      })}
    >
      {label && <div className="label">{label}</div>}

      <button type="button" onClick={onClickButton} className={classNames('flex h-center gap-1/2', buttonClassName)}>
        {icon && <IconCalendar className={styles.icon} />}
        <span className="nowrap">{value || placeholder}</span>
      </button>
    </div>
  );
};

export default CalendarRange;
