import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/hu';
import Application from '@1studio/utils/models/application';

require('../../../assets/style/index.scss');


/* !- Components */

import CalendarMonth from '../../form/components/calendarMonth';
import CalendarMonthButton from '../../form/components/calendarMonthButton';
import CalendarDateTime from '../../form/components/calendarDateTime';
import DateTime from '../../form/components/datetime';
import CalendarMonthInterval from '../../form/components/calendarMonthInterval';
import CalendarMonthIntervalButton from '../../form/components/calendarMonthIntervalButton';
import CalendarMonthCaroussel, { CalendarMonthCarousselButton } from '../../form/components/calendarMonthCaroussel';
import CalendarMonthIntervalCaroussel, { CalendarMonthIntervalCarousselButton } from '../../form/components/calendarMonthIntervalCaroussel';
import CalendarScroll from '../../form/components/calendarScroll';
import CalendarRange from '../../form/components/calendarRange';
import Input from '../../form/components/input';
import Layer from '../../layer/layer';


/* !- Constants */

import { DATE_FORMAT, DATE_FORMAT_HTML5 } from '../../calendar/constants';
import { formatDate } from '../../form/constants';

moment.locale('hu');


/* !- Context (a mező a redux store-hoz, a popover a layerhez kötődik) */

import { AppContext } from '../../context';
import store from '../../store';

const reduxStore = store();
const App = new Application();

const appContext = {
  store: reduxStore,
  register: App.register,
  addListener: App.addListener,
  removeListener: App.removeListener,
  addShortcuts: App.addShortcuts,
  removeShortcuts: App.removeShortcuts,
};

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={appContext as any}>
      <div className="p-3">
        <Story />
      </div>
      <Layer />
    </AppContext.Provider>
  </Provider>
);


/**
 * A mezők store-beli értéke (mi kerül ténylegesen tárolásra)
 */
const StoreValue = ({ ids }: { ids: string[] }) => {
  const values = useSelector(({ form }: any) =>
    ids.map(id => `form.${id} = ${JSON.stringify(form[id] ?? null)}`).join('\n'));

  return (
    <pre className="mt-2 p-1 text-xs bg-white-dark rounded">
      {values}
    </pre>
  );
};

/** Hétköznap (hétvége tiltva) */
const isWeekday = (timestamp: number) => [6, 0].indexOf(new Date(timestamp).getDay()) === -1;


/* !- Stories */

const meta = {
  title: 'Form/Calendar',
  component: CalendarMonth,
  decorators: [withContexts],
} satisfies Meta<typeof CalendarMonth>;

export default meta;


type Story = StoryObj<typeof meta>;


/* !- CalendarMonth: havi naptár, egy nap választható (a szélességet a szülő adja) */

export const Month: Story = {
  args: {
    id: 'calendar-month',
    label: 'Születési dátum',
    dateFormat: DATE_FORMAT,
    resetLabel: 'Törlés',
  },
  render: (args: any) => (
    <div style={{ width: 300 }}>
      <CalendarMonth {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

Month.storyName = 'Havi naptár';


/* !- CalendarMonth min/max + validator: csak a következő 30 nap hétköznapjai választhatók */

export const MonthLimited: Story = {
  args: {
    id: 'calendar-month-limited',
    label: 'Szállítási nap',
    dateFormat: DATE_FORMAT,
    min: moment().format(DATE_FORMAT),
    max: moment().add(30, 'days').format(DATE_FORMAT),
    validator: isWeekday,
    resetLabel: 'Törlés',
  },
  render: Month.render,
};

MonthLimited.storyName = 'Havi naptár – korlátozva';


/* !- CalendarMonthButton: gomb, a naptár popoverben nyílik (év/hónap választóval) */

export const MonthButton: Story = {
  args: {
    id: 'calendar-month-button',
    label: 'Születési dátum',
    placeholder: 'Válassz dátumot',
    buttonClassName: 'input',
    dateFormat: DATE_FORMAT,
    validator: (timestamp: number) => [1, 3, 5].indexOf(new Date(timestamp).getDay()) === -1,
    resetLabel: 'Törlés',
  },
  render: (args: any) => (
    <div style={{ maxWidth: 300 }}>
      <CalendarMonthButton {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

MonthButton.storyName = 'Naptár gomb (popover)';


/* !- CalendarMonth + Input: ugyanaz a mező naptárból és gépelve is kitölthető */

export const MonthWithInput: Story = {
  args: {
    id: 'calendar-month-input',
    dateFormat: DATE_FORMAT,
  },
  render: (args: any) => (
    <div style={{ width: 300 }}>
      <Input
        id={args.id}
        label="Dátum (ÉÉÉÉ-HH-NN)"
        format={formatDate}
        regexp="^((2)|(20)|(202)|(202[0-9]{1})|(202[0-9]{1}-)|(202[0-9]{1}-1?[0-9]{1})|(202[0-9]{1}-1?[0-9]{1}-)|(202[0-9]{1}-1?[0-9]{1}-[1-3]?[0-9]{1}))$"
      />
      <CalendarMonth {...args} disableLabel />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

MonthWithInput.storyName = 'Naptár + beviteli mező';


/* !- CalendarDateTime: év/hónap (és opcionálisan óra/perc) választó a naptár fölött */

export const DateTimeCalendar: Story = {
  args: {
    id: 'calendar-datetime',
    dateFormat: DATE_FORMAT_HTML5,
    disableTime: false,
    resetLabel: 'Törlés',
  },
  render: (args: any) => (
    <div style={{ width: 320 }}>
      <CalendarDateTime {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

DateTimeCalendar.storyName = 'Naptár időponttal';


/* !- DateTime: klasszikus legördülő év / hónap / nap / óra / perc mezők */

export const DateTimeSelect: Story = {
  args: {
    id: 'calendar-datetime-select',
    label: 'Időpont',
    value: '2026-11-12T10:30',
  },
  render: (args: any) => (
    <div style={{ maxWidth: 480 }}>
      <DateTime {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

DateTimeSelect.storyName = 'Dátum/idő legördülők';


/* !- CalendarMonthInterval: időszak egy hónapon belül (két mezőbe: fromId, toId) */

export const Interval: Story = {
  args: {
    fromId: 'interval-from',
    toId: 'interval-to',
    dateFormat: DATE_FORMAT_HTML5,
  },
  render: (args: any) => (
    <div style={{ width: 300 }}>
      <CalendarMonthInterval {...args} />
      <StoreValue ids={[args.fromId, args.toId]} />
    </div>
  ),
};

Interval.storyName = 'Időszak';


/* !- CalendarMonthInterval fix hosszal: mindig 7 napos időszak jelölődik ki */

export const IntervalFixedLength: Story = {
  args: {
    fromId: 'interval-week-from',
    toId: 'interval-week-to',
    dateFormat: DATE_FORMAT_HTML5,
    intervalLength: 7,
  },
  render: Interval.render,
};

IntervalFixedLength.storyName = 'Időszak – fix 7 nap';


/* !- CalendarMonthIntervalButton: gomb, két egymást követő hónap popoverben (start/end mezők) */

export const IntervalButton: Story = {
  args: {
    id: ['start', 'end'],
    label: 'Időszak',
    placeholder: 'Válassz időszakot',
  },
  render: (args: any) => (
    <div style={{ maxWidth: 300 }}>
      <CalendarMonthIntervalButton {...args} />
      <StoreValue ids={args.id} />
    </div>
  ),
};

IntervalButton.storyName = 'Időszak gomb (két hónap)';


/* !- CalendarMonthIntervalCaroussel: gyorsgombok (Ma, Tegnap, Héten…) + két lapozható naptár */

export const IntervalCaroussel: Story = {
  args: {
    id: 'interval-caroussel',
    fromId: 'caroussel-from',
    toId: 'caroussel-to',
    dateFormat: DATE_FORMAT_HTML5,
    flushLabel: 'Szűrés törlése',
    applyLabel: 'Alkalmaz',
    realTime: true,
  },
  render: (args: any) => {
    const suffix = args.realTime ? '' : `@${args.id}`;

    return (
      <div style={{ maxWidth: 900 }}>
        <CalendarMonthIntervalCaroussel {...args} />
        <StoreValue
          ids={[
            `${args.fromId}${suffix}`,
            `${args.toId}${suffix}`,
            ...(args.realTime ? [] : [args.fromId, args.toId]),
          ]}
        />
      </div>
    );
  },
};

IntervalCaroussel.storyName = 'Időszak lapozóval';


/* !- Nem valós idejű: az „Alkalmaz” gomb írja át a végleges fromId/toId mezőket */

export const IntervalCarousselApply: Story = {
  args: {
    ...IntervalCaroussel.args,
    id: 'interval-caroussel-apply',
    fromId: 'caroussel-apply-from',
    toId: 'caroussel-apply-to',
    realTime: false,
  },
  render: IntervalCaroussel.render,
};

IntervalCarousselApply.storyName = 'Időszak lapozóval – Alkalmaz gombbal';


/* !- CalendarMonthIntervalCarousselButton: a lapozós időszak-választó popoverben, rövid címkével */

export const IntervalCarousselButton: Story = {
  args: {
    id: 'interval-caroussel-button',
    fromId: 'from',
    toId: 'to',
    dateFormat: DATE_FORMAT_HTML5,
    label: 'Időszak',
    placeholder: 'Válassz időszakot',
    flushLabel: 'Szűrés törlése',
    applyLabel: 'Alkalmaz',
    realTime: false,
  },
  render: (args: any) => (
    <div>
      <CalendarMonthIntervalCarousselButton {...args} />
      <StoreValue ids={[`${args.fromId}@${args.id}`, `${args.toId}@${args.id}`, args.fromId, args.toId]} />
    </div>
  ),
};

IntervalCarousselButton.storyName = 'Időszak lapozóval – gomb (popover)';


/* !- CalendarMonthCaroussel: egy nap választás, hónapok között lapozva */

export const MonthCaroussel: Story = {
  args: {
    id: 'calendar-caroussel',
  },
  render: (args: any) => (
    <div style={{ width: 300 }}>
      <CalendarMonthCaroussel {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

MonthCaroussel.storyName = 'Havi naptár lapozóval';


/* !- CalendarMonthCarousselButton: a lapozós naptár popoverben */

export const MonthCarousselButton: Story = {
  args: {
    id: 'calendar-caroussel-button',
    label: 'Dátum',
  },
  render: (args: any) => (
    <div style={{ maxWidth: 300 }}>
      <CalendarMonthCarousselButton {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

MonthCarousselButton.storyName = 'Havi naptár lapozóval – gomb (popover)';


/* !- CalendarScroll: végtelenül görgethető havi naptár, egy nap */

export const Scroll: Story = {
  args: {
    id: 'calendar-scroll',
    dateFormat: DATE_FORMAT,
  },
  render: (args: any) => (
    <div style={{ maxWidth: 420 }}>
      <CalendarScroll {...args} />
      <StoreValue ids={[args.id]} />
    </div>
  ),
};

Scroll.storyName = 'Görgethető naptár';


/* !- CalendarScroll időszak: 1. kattintás = kezdet, 2. = vég (hover előnézettel) */

export const ScrollInterval: Story = {
  args: {
    fromId: 'scroll-from',
    toId: 'scroll-to',
    dateFormat: DATE_FORMAT,
  },
  render: (args: any) => (
    <div style={{ maxWidth: 420 }}>
      <CalendarScroll {...args} />
      <StoreValue ids={[args.fromId, args.toId]} />
    </div>
  ),
};

ScrollInterval.storyName = 'Görgethető naptár – időszak';


/* !- CalendarScroll korlátozva: a mai naptól 3 hónapig, hétvége tiltva (a görgetés is megáll) */

export const ScrollLimited: Story = {
  args: {
    fromId: 'scroll-limited-from',
    toId: 'scroll-limited-to',
    dateFormat: DATE_FORMAT,
    min: moment().format(DATE_FORMAT),
    max: moment().add(3, 'months').format(DATE_FORMAT),
    validator: isWeekday,
  },
  render: ScrollInterval.render,
};

ScrollLimited.storyName = 'Görgethető naptár – korlátozva';


/* !- CalendarScroll havi: év-blokkok, hónap-időszak (a záró mezőbe a hónap utolsó napja) */

export const ScrollMonth: Story = {
  args: {
    type: 'month',
    fromId: 'scroll-month-from',
    toId: 'scroll-month-to',
    dateFormat: DATE_FORMAT,
  },
  render: ScrollInterval.render,
};

ScrollMonth.storyName = 'Görgethető naptár – hónap';


/* !- CalendarScroll negyedéves: év-blokkok, negyedév-időszak */

export const ScrollQuarter: Story = {
  args: {
    type: 'quarter',
    fromId: 'scroll-quarter-from',
    toId: 'scroll-quarter-to',
    dateFormat: DATE_FORMAT,
  },
  render: ScrollInterval.render,
};

ScrollQuarter.storyName = 'Görgethető naptár – negyedév';


/* !- CalendarRange: időszak-választó popover (gyorsgombok, nap/hét, hónap, negyedév), az „Adatok betöltése” írja a from/to mezőket */

export const Range: Story = {
  args: {
    id: 'range',
    fromId: 'range-from',
    toId: 'range-to',
    label: 'Időszak',
  },
  render: (args: any) => (
    <div style={{ maxWidth: 360 }}>
      <CalendarRange {...args} />
      <StoreValue ids={[args.fromId, args.toId, `${args.id}@appliedType`]} />
    </div>
  ),
};

Range.storyName = 'Időszak választó (popover)';
