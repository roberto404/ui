import React, { memo, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

/* !- Contexts */

import { FormContext } from '../context';
import { useFreshCallback } from '../../hooks';

/* !- Redux Actions */

import { setValues, unsetValues } from '../actions';

/* !- Constants */

import { DATE_FORMAT_HTML5 } from '../../calendar/constants';

/* !- Icons */

import IconWhole from '../../icon/mui/communication/list_alt';

import styles from './calendarScroll.module.scss';

export type CalendarScrollType = 'day' | 'month' | 'quarter';

/** Ilyen közel (px) a lista széléhez tölt be új blokkokat */
const LOAD_MARGIN = 300;

/**
 * Típusonkénti beállítás.
 * - section: egy görgetési blokk (címmel) egysége — nap-nézetben hónap, egyébként év
 * - cols: oszlopok száma a rácsban
 * - load: ennyi blokk töltődik be egyszerre, amikor a görgetés a lista széléhez ér
 * - max: ennyi blokk felett bővítéskor a túlsó vég levágódik (ablakos lista), de csak
 *   az a blokk, ami a betöltési sávon (LOAD_MARGIN) túl van — így magas `height` vagy
 *   alacsony blokkok mellett sem pattog oda-vissza a betöltés
 * - initial: induláskor betöltött blokkok a kiindulóhoz képest
 */
const TYPES: Record<
  CalendarScrollType,
  { section: 'month' | 'year'; cols: number; load: number; max: number; initial: [number, number] }
> = {
  day: { section: 'month', cols: 7, load: 6, max: 18, initial: [-2, 3] },
  month: { section: 'year', cols: 4, load: 3, max: 9, initial: [-1, 2] },
  quarter: { section: 'year', cols: 4, load: 4, max: 12, initial: [-2, 3] },
};

type CalendarScrollProps = {
  /** Választás egysége: nap, hónap vagy negyedév */
  type?: CalendarScrollType;
  /** Egy elem választása: a mező azonosítója */
  id?: string;
  /** Időszak választása: a kezdő és a záró mező (mindkettő kell) */
  fromId?: string;
  toId?: string;
  /** Form azonosító (különben a FormContext-é, végül a gyökér `form` state) */
  form?: string;
  /** A tárolt érték formátuma (moment) */
  dateFormat?: string;
  /** Legkorábbi / legkésőbbi választható nap (`dateFormat` szerint); a görgetés is itt áll meg */
  min?: string;
  max?: string;
  /** Kiegészítő tiltás az időszak első napjára: `false` = nem választható */
  validator?: (timestamp: number) => boolean;
  /** Ide görget induláskor, ha nincs érték (alapból a mai nap) */
  initDate?: string | Date;
  /** Nap-nézetben hétszám-oszlop (ISO hét); időszak-módban a hétszámra kattintva az egész hét kijelölődik */
  weekNumbers?: boolean;
  /** A görgethető terület magassága */
  height?: number | string;
  className?: string;
  onChange?: (value: { value?: string; from?: string; to?: string }) => void;
};

/**
 * Összehasonlítható kulcs az időszakhoz: nap 20261112, hónap 202611, negyedév 20264
 */
const toKey = (date: moment.Moment, type: CalendarScrollType) => {
  if (type === 'quarter') return date.year() * 10 + date.quarter();

  return parseInt(date.format(type === 'month' ? 'YYYYMM' : 'YYYYMMDD'), 10);
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Rövid hónapnév pont nélkül (jan, febr …) */
const shortMonth = (date: moment.Moment) => date.format('MMM').replace(/\.$/, '');

/** Hétfővel kezdődő napnevek (H, K, Sze …) */
const getWeekdays = () =>
  [1, 2, 3, 4, 5, 6, 7].map((day) => capitalize(moment().isoWeekday(day).format('dd')));

/**
 * Egy blokk cellái: az időszakok első napjai (nap-nézetben a hét eleji üres helyekkel)
 */
const getCells = (start: moment.Moment, type: CalendarScrollType): Array<moment.Moment | null> => {
  if (type === 'month') return Array.from({ length: 12 }, (_, i) => start.clone().month(i));
  if (type === 'quarter') return Array.from({ length: 4 }, (_, i) => start.clone().quarter(i + 1));

  const cells: Array<moment.Moment | null> = [
    ...Array(start.isoWeekday() - 1).fill(null),
    ...Array.from({ length: start.daysInMonth() }, (_, i) => start.clone().date(i + 1)),
  ];

  while (cells.length % 7) cells.push(null);

  return cells;
};

type SectionProps = {
  type: CalendarScrollType;
  start: string; // a blokk első napja, YYYY-MM-DD
  offset: number;
  lo: number | null; // kijelölt (vagy hover-előnézeti) időszak eleje
  hi: number | null;
  selectedA: number | null; // kijelölt elem(ek)
  selectedB: number | null;
  current: number; // a mai napot tartalmazó elem
  isDisabled: (date: moment.Moment) => boolean;
  onClick: (date: moment.Moment) => void;
  onHover: ((key: number | null) => void) | null;
  /** Időszak-módban: az egész blokk (hónap / év) kijelölése az első és utolsó választható elemmel */
  onSelectAll: ((first: moment.Moment, last: moment.Moment) => void) | null;
  weekNumbers: boolean;
};

/**
 * Egy blokk (hónap vagy év): cím + rács. Az időszak-sáv soronként fut: a sor és a blokk
 * szélén lekerekedik, a két végpontnál az elem közepéig ér.
 */
const Section = memo(
  ({ type, start, offset, lo, hi, selectedA, selectedB, current, isDisabled, onClick, onHover, onSelectAll, weekNumbers }: SectionProps) => {
    const { cols } = TYPES[type];
    const startDate = moment(start, 'YYYY-MM-DD');
    const cells = getCells(startDate, type);

    const first = cells.findIndex(Boolean);
    const last = cells.length - 1 - [...cells].reverse().findIndex(Boolean);

    const rows = [];

    for (let i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));

    const hasBand = lo !== null && hi !== null && lo !== hi;

    /**
     * Hétszám a sor elején: az egész (ISO) hét kijelölése, akkor is, ha átnyúlik a
     * szomszédos hónapba; kiemelt, ha a hét minden napja az időszakban van
     */
    const renderWeek = (date: moment.Moment) => {
      const monday = date.clone().startOf('isoWeek');
      const days = Array.from({ length: 7 }, (_, i) => monday.clone().add(i, 'days'));
      const enabledDays = days.filter((day) => !isDisabled(day));
      const inRange = hasBand && toKey(days[0], 'day') >= lo && toKey(days[6], 'day') <= hi;

      return (
        <div className={styles.week}>
          <button
            type="button"
            disabled={!onSelectAll || !enabledDays.length}
            onClick={() => onSelectAll(enabledDays[0], enabledDays[enabledDays.length - 1])}
            className={classNames('initial text-xs medium rounded', styles.weekChip, {
              'bg-blue-light text-blue-dark': inRange,
              'bg-white-dark text-gray-dark': !inRange,
              'hover:bg-blue-light': !inRange && onSelectAll,
            })}
          >
            {date.isoWeek()}
          </button>
        </div>
      );
    };

    // „Egész hónap / év”: az első és utolsó választható elem (min/max/validator szerint)
    const enabled = onSelectAll ? (cells.filter((date) => date && !isDisabled(date)) as moment.Moment[]) : [];

    return (
      <div data-offset={offset}>
        {/* sticky: a fejléc alatt marad, amíg a következő blokk címe ki nem tolja */}
        <div className={classNames('bg-white-light px-1 pt-1 pb-1/2 flex h-center v-justify', styles.title)}>
          <span className="text-m">
            {type === 'day' ? (
              <>
                <span className="bold">{capitalize(startDate.format('MMMM'))}</span>{' '}
                <span className="text-gray">{startDate.format('YYYY')}</span>
              </>
            ) : (
              <span className="bold">{startDate.format('YYYY')}</span>
            )}
          </span>

          {/* a cím fölé víve jelenik meg (érintőképernyőn mindig látszik) */}
          {enabled.length > 0 && (
            <button
              type="button"
              onClick={() => onSelectAll(enabled[0], enabled[enabled.length - 1])}
              className={classNames(
                'initial no-fill bg-blue-light text-blue-dark bold text-s rounded-l px-1 py-1/2 flex h-center gap-1/2 nowrap pointer',
                styles.whole,
              )}
            >
              <IconWhole className={styles.wholeIcon} />
              <span>{type === 'day' ? 'Egész hónap' : 'Egész év'}</span>
            </button>
          )}
        </div>

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {weekNumbers && type === 'day' && renderWeek(row.find(Boolean) as moment.Moment)}
            {row.map((date, col) => {
              if (!date) return <div key={col} className={styles.cell} />;

              const index = rowIndex * cols + col;
              const key = toKey(date, type);
              const inRange = hasBand && key >= lo && key <= hi;
              const isStart = inRange && key === lo;
              const isEnd = inRange && key === hi;
              const isSelected = key === selectedA || key === selectedB;
              const isCurrent = key === current && !isSelected;
              const isFuture = type !== 'day' && key > current;
              const disabled = isDisabled(date);

              return (
                <div
                  key={col}
                  className={styles.cell}
                  onMouseEnter={onHover && !disabled ? () => onHover(key) : undefined}
                >
                  {inRange && (
                    <span
                      className={classNames('bg-blue-light', styles.band, {
                        [styles.bandStart]: isStart,
                        [styles.bandEnd]: isEnd,
                        [styles.capLeft]: !isStart && (col === 0 || index === first),
                        [styles.capRight]: !isEnd && (col === cols - 1 || index === last),
                      })}
                    />
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onClick(date)}
                    className={classNames('initial', styles.item, {
                      'bg-blue-dark text-white bold': isSelected,
                      [styles.selected]: isSelected,
                      // ma: nap-nézetben piros kör, hónap/negyedév nézetben kék keret
                      'bg-red-dark text-white bold': isCurrent && type === 'day',
                      [`${styles.current} bold`]: isCurrent && type !== 'day',
                      'text-blue-dark medium': inRange && !isSelected && !(isCurrent && type === 'day'),
                      'text-gray-dark': isFuture && !inRange && !isSelected && !isCurrent,
                      'text-black': !inRange && !isSelected && !isCurrent && !isFuture,
                      'hover:bg-blue-light': !isSelected && !(isCurrent && type === 'day'),
                    })}
                  >
                    {type === 'day' && date.date()}
                    {type === 'month' && shortMonth(date)}
                    {type === 'quarter' && (
                      <span className="flex column h-center">
                        <span className="text-m">{`Q${date.quarter()}`}</span>
                        <span
                          className={classNames('text-xs', {
                            'text-gray-dark': !isSelected,
                          })}
                        >
                          {`${date.format('MMM')} – ${date.clone().endOf('quarter').format('MMM')}`}
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);

/**
 * Függőlegesen végtelenül görgethető naptár (mobil dátumválasztó stílus): napot, hónapot
 * vagy negyedévet választ (`type`), egyet (`id`) vagy időszakot (`fromId` + `toId`).
 * Az érték a redux form state-be kerül: a választott időszak első napja, időszaknál a
 * záró mezőbe hónap/negyedév esetén az utolsó napja. A blokkok (hónap / év) a görgetés
 * irányában töltődnek, `min`/`max`-nál megáll; a DOM-ban egyszerre korlátos számú blokk van.
 *
 * @example
 * <CalendarScroll id="deliveryDate" />
 *
 * @example
 * // időszak: 1. kattintás = kezdet, 2. kattintás = vég (hover előnézettel)
 * <CalendarScroll fromId="from" toId="to" dateFormat="YYYY-MM-DD" />
 *
 * @example
 * // negyedév-időszak → from = 2026-04-01, to = 2026-09-30
 * <CalendarScroll type="quarter" fromId="from" toId="to" dateFormat="YYYY-MM-DD" />
 */
const CalendarScroll = ({
  type = 'day',
  id,
  fromId,
  toId,
  form,
  dateFormat = DATE_FORMAT_HTML5,
  min,
  max,
  validator,
  initDate,
  weekNumbers = false,
  height = '28em',
  className,
  onChange,
}: CalendarScrollProps) => {
  const config = TYPES[type];
  const unit = type === 'day' ? 'day' : type; // moment egység az időszak elejéhez / végéhez

  const formContext: any = useContext(FormContext);
  const formId = form || formContext?.form;
  const isInterval = Boolean(fromId && toId);

  const dispatch = useDispatch();

  const [from, to] = useSelector(({ form: state }: any) => {
    const values = (formId ? state[formId] : state) || {};

    return isInterval ? [values[fromId], values[toId]] : [values[id], undefined];
  }, (a, b) => a[0] === b[0] && a[1] === b[1]);

  const parse = (value?: string) => {
    const date = value ? moment(value, dateFormat) : null;

    return date && date.isValid() ? date : null;
  };

  const fromDate = parse(from);
  const toDate = parse(to);

  /* !- Határok (min/max a görgetést is korlátozza) */

  const minDate = parse(min);
  const maxDate = parse(max);
  const minDay = minDate ? toKey(minDate, 'day') : null;
  const maxDay = maxDate ? toKey(maxDate, 'day') : null;

  // a kiinduló blokk (offset 0) csak induláskor számít
  const [base] = useState(() => moment(fromDate || initDate || undefined).startOf(config.section));

  const sectionOffset = (date: moment.Moment) =>
    date.clone().startOf(config.section).diff(base, config.section === 'year' ? 'years' : 'months');

  const minOffset = minDate ? sectionOffset(minDate) : -Infinity;
  const maxOffset = maxDate ? sectionOffset(maxDate) : Infinity;

  const clampRange = (first: number, last: number): [number, number] => [
    Math.max(first, minOffset),
    Math.min(last, maxOffset),
  ];

  const [range, setRange] = useState<[number, number]>(() => clampRange(...config.initial));

  const validatorRef = useRef(validator);
  validatorRef.current = validator;

  // tiltott, ha az időszak teljesen a min/max-on kívül esik
  const isDisabled = useCallback(
    (date: moment.Moment) => {
      if (maxDay !== null && toKey(date, 'day') > maxDay) return true;
      if (minDay !== null && toKey(date.clone().endOf(unit), 'day') < minDay) return true;

      return typeof validatorRef.current === 'function' && validatorRef.current(date.valueOf()) === false;
    },
    [minDay, maxDay, unit],
  );

  /* !- Kijelölés */

  const [hover, setHover] = useState<number | null>(null);

  const write = (values: Record<string, string>, unset?: string) => {
    dispatch(setValues(values, formId));

    if (unset) dispatch(unsetValues({ [unset]: undefined }, formId));
  };

  const startValue = (date: moment.Moment) => date.clone().startOf(unit).format(dateFormat);
  // a záró mezőbe nap-nézetben maga a nap, egyébként az időszak utolsó napja
  const endValue = (date: moment.Moment) =>
    type === 'day' ? startValue(date) : date.clone().endOf(unit).startOf('day').format(dateFormat);

  // stabil referencia, hogy a memo-zott blokkok ne renderelődjenek újra
  const onClick = useFreshCallback((date: moment.Moment) => {
    if (!isInterval) {
      const value = startValue(date);

      write({ [id]: value });
      onChange?.({ value });
      return;
    }

    // nincs kezdet, vagy kész az időszak → új időszak indul
    if (!fromDate || toDate) {
      const value = startValue(date);

      write({ [fromId]: value }, toId);
      onChange?.({ from: value, to: undefined });
      return;
    }

    // a kezdet elé kattintva megfordul
    const [start, end] = date.isBefore(fromDate, unit)
      ? [startValue(date), endValue(fromDate)]
      : [startValue(fromDate), endValue(date)];

    write({ [fromId]: start, [toId]: end });
    setHover(null);
    onChange?.({ from: start, to: end });
  });

  // egész blokk (hónap / év) mint időszak
  const onSelectAll = useFreshCallback((first: moment.Moment, last: moment.Moment) => {
    const start = startValue(first);
    const end = endValue(last);

    write({ [fromId]: start, [toId]: end });
    setHover(null);
    onChange?.({ from: start, to: end });
  });

  const fromKey = fromDate ? toKey(fromDate, type) : null;
  const toKeyValue = toDate ? toKey(toDate, type) : null;

  // befejezetlen időszaknál a hover-elem az előnézeti vég
  const isPreview = isInterval && fromKey !== null && toKeyValue === null;
  const end = toKeyValue ?? (isPreview ? hover : null);

  const lo = fromKey !== null && end !== null ? Math.min(fromKey, end) : null;
  const hi = fromKey !== null && end !== null ? Math.max(fromKey, end) : null;

  /* !- Végtelen görgetés */

  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // a bővítés előtt látható blokk és a helyzete (a görgetés ehhez igazodik utána)
  const anchor = useRef<{ offset: string; top: number } | null>(null);

  // induláskor a kiinduló blokk címe kerül a lista tetejére (a fejléc alá)
  useLayoutEffect(() => {
    const element = scrollRef.current;
    const section = element?.querySelector<HTMLElement>('[data-offset="0"]');

    if (!element || !section) return;

    element.scrollTop +=
      section.getBoundingClientRect().top -
      element.getBoundingClientRect().top -
      (headerRef.current?.offsetHeight || 0);
  }, []);

  // a sticky blokkcím a fejléc alá tapad → a fejléc magassága CSS változóba
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    setHeaderHeight(headerRef.current?.offsetHeight || 0);
  }, []);

  /**
   * Az első (részben) látható blokk helyzete a görgető tetejéhez képest
   */
  const getAnchor = (element: HTMLDivElement) => {
    const top = element.getBoundingClientRect().top + (headerRef.current?.offsetHeight || 0);
    const section = Array.from(element.querySelectorAll<HTMLElement>('[data-offset]'))
      .find((item) => item.getBoundingClientRect().bottom > top);

    return section ? { offset: section.dataset.offset, top: section.getBoundingClientRect().top } : null;
  };

  /**
   * Levágható blokkok száma a lista elejéről (`side = 'top'`) vagy végéről: legfeljebb
   * annyi, amennyivel a blokkszám a max fölé menne, és csak a betöltési sávon túliak
   */
  const getTrimCount = (element: HTMLDivElement, side: 'top' | 'bottom', count: number) => {
    const excess = count - config.max;

    if (excess <= 0) return 0;

    const rect = element.getBoundingClientRect();
    const limit = LOAD_MARGIN * 2;
    const sections = Array.from(element.querySelectorAll<HTMLElement>('[data-offset]'));
    const ordered = side === 'top' ? sections : sections.reverse();

    let trim = 0;

    while (trim < excess && trim < ordered.length) {
      const box = ordered[trim].getBoundingClientRect();
      const outside = side === 'top' ? box.bottom < rect.top - limit : box.top > rect.bottom + limit;

      if (!outside) break;

      trim += 1;
    }

    return trim;
  };

  // felülre fűzés / felül levágás után a látható blokk ugyanott marad
  useLayoutEffect(() => {
    const element = scrollRef.current;
    const current = anchor.current;

    anchor.current = null;

    if (!element || !current) return;

    const section = element.querySelector<HTMLElement>(`[data-offset="${current.offset}"]`);

    if (section) element.scrollTop += section.getBoundingClientRect().top - current.top;
  }, [range[0], range[1]]);

  // a széleken lévő őrök láthatóvá válása tölt; minden bővítés után újra figyel,
  // így addig tölt, amíg az őr ki nem kerül a látótérből
  useEffect(() => {
    const element = scrollRef.current;

    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;

          if (target === topRef.current && range[0] > minOffset) {
            // felül bővül, alul a max feletti (és már messze lévő) rész kikerül
            const [first] = clampRange(range[0] - config.load, range[1]);
            const trim = getTrimCount(element, 'bottom', range[1] - first + 1);

            observer.disconnect();
            anchor.current = getAnchor(element);
            setRange([first, range[1] - trim]);
          } else if (target === bottomRef.current && range[1] < maxOffset) {
            // alul bővül, felül a max feletti (és már messze lévő) rész kikerül
            const [, last] = clampRange(range[0], range[1] + config.load);
            const trim = getTrimCount(element, 'top', last - range[0] + 1);

            observer.disconnect();
            anchor.current = getAnchor(element);
            setRange([range[0] + trim, last]);
          }
        });
      },
      { root: element, rootMargin: `${LOAD_MARGIN}px 0px` },
    );

    if (topRef.current) observer.observe(topRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [range[0], range[1], minOffset, maxOffset]);

  const [weekdays] = useState(getWeekdays);
  const current = toKey(moment(), type);

  const sections = [];

  for (let offset = range[0]; offset <= range[1]; offset += 1) {
    sections.push(
      <Section
        key={offset}
        type={type}
        offset={offset}
        start={base.clone().add(offset, config.section === 'year' ? 'years' : 'months').format('YYYY-MM-DD')}
        lo={lo}
        hi={hi}
        selectedA={fromKey}
        selectedB={toKeyValue}
        current={current}
        isDisabled={isDisabled}
        onClick={onClick}
        onHover={isPreview ? setHover : null}
        onSelectAll={isInterval ? onSelectAll : null}
        weekNumbers={weekNumbers}
      />,
    );
  }

  return (
    <div
      ref={scrollRef}
      className={classNames('calendar-scroll-field bg-white-light text-s', styles.root, styles[type], className)}
      style={{ height, '--calendar-scroll-header': `${headerHeight}px` } as React.CSSProperties}
      onMouseLeave={isPreview ? () => setHover(null) : undefined}
    >
      {type === 'day' && (
        <div ref={headerRef} className={classNames('bg-white-light text-gray-dark medium py-1', styles.header)}>
          {weekNumbers && <div className={classNames('text-xs', styles.week, styles.weekHeader)}>HÉT</div>}
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
      )}

      <div ref={topRef} className={styles.sentinel} />
      {sections}
      <div ref={bottomRef} className={styles.sentinel} />
    </div>
  );
};

export default CalendarScroll;
