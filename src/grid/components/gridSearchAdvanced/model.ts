import slugify from '@1studio/utils/string/slugify';

/**
 * Advanced search (Haladó keresés) — config-driven criteria of a grid.
 *
 * The view describes its criteria in groups of fields, every field has a type
 * (text, checkbox, date ...) which determines the form inputs, the summary chip
 * and the default matching. The values live in the redux form store under the
 * `<formId>#<fieldId>[#<part>]` keys, so a reopened dialog shows the previous
 * search; `getCriteria` collects the active values into one object.
 */

/* !- Types */

export type Option = {
  id: string;
  title: string;
  /** original id of a bound grid filter option (number or string) */
  value?: any;
  /**
   * Own query term of the option (checkbox, choice), instead of `<path>==<id>`;
   * a list: the first is written, all of them are read (old forms)
   * @example ['attachment.origin==piper', 'attachment[piper]']
   */
  query?: string | string[];
};

export type OptionGroup = {
  id: string;
  title: string;
  options: Option[];
};

export type AmountOperator = 'exists' | 'missing' | 'eq' | 'ne' | 'gt' | 'lt' | 'range';

export type DatePreset =
  | 'today'
  | 'thisWeek'
  | 'nextWeek'
  | 'last7'
  | 'thisMonth'
  | 'nextMonth'
  | 'prevMonth'
  | 'thisYear';

export type TextValue = string;
export type TextsValue = Record<string, string>;
export type CheckboxValue = { ids: string[]; mode?: string };
export type ChoiceValue = { id: string; text?: string };
export type AmountValue = { operator: AmountOperator; from?: string; to?: string };
export type DateRow = { type?: string; from?: string; to?: string };
export type DateValue = { state?: 'any' | 'yes' | 'no' | 'date'; rows: DateRow[] };
export type SelectValue = { id: string };

export type Value =
  | TextValue
  | TextsValue
  | CheckboxValue
  | ChoiceValue
  | AmountValue
  | DateValue
  | SelectValue;

export type Criteria = Record<string, Value>;

type FieldBase<R = any, I = any> = {
  id: string;
  title: string;
  /** gray text after the title */
  hint?: string;
  /** gray text under the input */
  note?: string;
  /** the card takes the whole row */
  full?: boolean;
  /** extra words of the criterion finder (Szempont keresése) */
  keywords?: string;
  /**
   * Key of the search query, the record path if there is one (ex. invoicing.name,
   * products.productId), default: the id
   */
  path?: string;
  /**
   * Form key of an existing grid filter (ex. a toolbar GridMultiSelect): the
   * dialog reads its value at opening and writes it back, the grid filter
   * matches it (not part of the search query)
   */
  bind?: string;
  /** record level matching, overrides the default of the type */
  match?: (record: R, value: any) => boolean;
  /** item level matching (see Group.items), the field is matched on the items of the record */
  matchItem?: (item: I, value: any) => boolean;
};

export type TextField<R = any, I = any> = FieldBase<R, I> & {
  type: 'text';
  placeholder?: string;
  /**
   * More record paths, any of them contains the text: one `|` group in the query
   * @example ['products.brand', 'products.title'] -> products.brand=sun|products.title=sun
   */
  paths?: string[];
  /** subject of the default matching (text or list of texts) */
  get?: (subject: any) => any;
  /** normalize both side before compare (ex. phone numbers) */
  normalize?: (value: string) => string;
};

export type TextsField<R = any, I = any> = FieldBase<R, I> & {
  type: 'texts';
  inputs: Array<{
    id: string;
    title: string;
    /** key of the search query (default: <path>.<id>) */
    path?: string;
    placeholder?: string;
    /** flex grow of the input */
    grow?: number;
    get?: (subject: any) => any;
  }>;
};

export type CheckboxField<R = any, I = any> = FieldBase<R, I> & {
  type: 'checkbox';
  options?: Option[];
  /** options in titled groups with a "mind" (all) toggle */
  groups?: OptionGroup[];
  columns?: 2 | 3 | 4;
  /** segmented mode switch on the right side of the header (ex. Jelenlegi státusz / Elérte már) */
  modes?: Option[];
  /** option id(s) of the subject, default matching = any of the selected ones */
  get?: (subject: any) => any;
};

export type ChoiceField<R = any, I = any> = FieldBase<R, I> & {
  type: 'choice';
  /** the first option is the inactive one (Mindegy) */
  options: Option[];
  /** optional text input under the pills, `path`: its key in the query (default: <path>.text) */
  text?: { placeholder?: string; path?: string };
  /** the option ids which show the text input (default: all except the first) */
  textOptions?: string[];
  get?: (subject: any) => any;
};

export type AmountField<R = any, I = any> = FieldBase<R, I> & {
  type: 'amount';
  operators: AmountOperator[];
  /** default operator */
  operator?: AmountOperator;
  unit?: string;
  get?: (subject: any) => any;
};

export type DateField<R = any, I = any> = FieldBase<R, I> & {
  type: 'date';
  /** date types (Melyik dátum?) */
  types?: Option[];
  /** default type */
  defaultType?: string;
  /** more rows with other date types (+ További dátumfeltétel) */
  multiple?: boolean;
  presets?: DatePreset[];
  /** Mindegy / Van / Nincs / Dátum szerint switch */
  states?: boolean;
  /** subject date(s), with the type when `types` is given */
  get?: (subject: any, type?: string) => any;
};

export type SelectField<R = any, I = any> = FieldBase<R, I> & {
  type: 'select';
  options: Option[];
  placeholder?: string;
  /** quick pick buttons under the select (Gyakori) */
  quick?: Option[];
  quickTitle?: string;
  get?: (subject: any) => any;
};

export type Field<R = any, I = any> =
  | TextField<R, I>
  | TextsField<R, I>
  | CheckboxField<R, I>
  | ChoiceField<R, I>
  | AmountField<R, I>
  | DateField<R, I>
  | SelectField<R, I>;

export type Group<R = any, I = any> = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  fields: Field<R, I>[];
  /**
   * Items of the record (ex. product lines): the fields with `matchItem` are
   * matched on them, every criterion on any of the items (like a query path
   * through an array: products.productId=…&products.status==8)
   */
  items?: (record: R) => I[];
};


/* !- Form keys */


export const fieldKey = (formId: string, fieldId: string, part?: string | number) =>
  [formId, fieldId, part].filter(item => item !== undefined && item !== '').join('#');

const isFilled = (value: any) =>
  value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length);

const toArray = (value: any): any[] => (Array.isArray(value) ? value : [value]);


/* !- Values */

/**
 * Value of a field from the form store, undefined if the field is not active
 */
export const getValue = (field: Field, form: Record<string, any>, formId: string): Value | undefined => {
  const key = (part?: string | number) => form[fieldKey(formId, field.id, part)];

  switch (field.type) {
    case 'text': {
      const value = (key() || '').toString().trim();
      return value || undefined;
    }

    case 'texts': {
      const value = field.inputs.reduce((result, input) => {
        const text = (key(input.id) || '').toString().trim();
        return text ? { ...result, [input.id]: text } : result;
      }, {});

      return Object.keys(value).length ? value : undefined;
    }

    case 'checkbox': {
      const ids = field.groups
        ? field.groups.flatMap(group => toArray(key(group.id) || []))
        : toArray(key() || []);
      const cleanIds = ids.filter(isFilled).map(String);

      if (!cleanIds.length) {
        return undefined;
      }

      return field.modes ? { ids: cleanIds, mode: key('mode') || field.modes[0].id } : { ids: cleanIds };
    }

    case 'choice': {
      const id = key() || field.options[0].id;
      const text = (key('text') || '').toString().trim();

      if (id === field.options[0].id) {
        return undefined;
      }

      return text && isChoiceText(field, id) ? { id, text } : { id };
    }

    case 'amount': {
      const operator = key('operator') || field.operator || field.operators[0];
      const from = (key('from') || '').toString().trim();
      const to = (key('to') || '').toString().trim();

      if (operator === 'exists' || operator === 'missing') {
        return { operator };
      }


      if (operator === 'range') {
        return from || to ? { operator, from, to } : undefined;
      }

      return from ? { operator, from } : undefined;
    }

    case 'date': {
      const state = field.states ? (key('state') || 'any') : 'date';

      if (state === 'yes' || state === 'no') {
        return { state, rows: [] };
      }

      if (state === 'any') {
        return undefined;
      }

      const count = field.multiple ? Math.max(1, parseInt(key('rows')) || 1) : 1;
      const rows: DateRow[] = [];

      for (let index = 0; index < count; index += 1) {
        const from = key(`${index}#from`) || '';
        const to = key(`${index}#to`) || '';

        if (from || to) {
          rows.push({
            type: field.types ? (key(`${index}#type`) || field.defaultType || field.types[0].id) : undefined,
            from,
            to,
          });
        }
      }

      return rows.length ? { state: 'date', rows } : undefined;
    }

    case 'select': {
      const id = key();
      return isFilled(id) ? { id: id.toString() } : undefined;
    }

    default:
      return undefined;
  }
};

export const isChoiceText = (field: ChoiceField, id: string) =>
  !!field.text && (field.textOptions ? field.textOptions.includes(id) : id !== field.options[0].id);

/**
 * Active criteria of the dialog: { fieldId: value }
 */
export const getCriteria = (groups: Group[], form: Record<string, any>, formId: string): Criteria =>
  groups.reduce((criteria, group) => {
    group.fields.forEach((field) => {
      const value = getValue(field, form, formId);

      if (value !== undefined) {
        criteria[field.id] = value;
      }
    });

    return criteria;
  }, {} as Criteria);

/**
 * Number shown next to the criterion in the side menu
 */
export const getValueCount = (field: Field, value?: Value): number => {
  if (value === undefined) {
    return 0;
  }

  if (field.type === 'checkbox') {
    return (value as CheckboxValue).ids.length;
  }

  if (field.type === 'date') {
    return Math.max(1, (value as DateValue).rows.length);
  }

  if (field.type === 'texts') {
    return Object.keys(value).length;
  }

  return 1;
};

/**
 * Form keys of a field (clear the field)
 */
export const getFieldKeys = (field: Field, form: Record<string, any>, formId: string): string[] => {
  const prefix = fieldKey(formId, field.id);

  return Object.keys(form).filter(key => key === prefix || key.indexOf(`${prefix}#`) === 0);
};


/* !- Texts */

/** accent and case insensitive form of a text */
export const normalizeText = (value: any) => slugify((value ?? '').toString()).replace(/-/g, ' ');

/** digits only (phone numbers): +36 / 06 prefix removed */
export const normalizePhone = (value: any) =>
  (value ?? '').toString().replace(/[^0-9]/g, '').replace(/^(36|06)/, '');

export const containsText = (subject: any, term: string, normalize = normalizeText) => {
  const needle = normalize(term);

  return toArray(subject)
    .filter(isFilled)
    .some(item => normalize(item).indexOf(needle) !== -1);
};


/* !- Numbers */

export const parseAmount = (value: any) => parseFloat((value ?? '').toString().replace(/[^0-9.,-]/g, '').replace(',', '.'));

export const matchAmount = (subject: any, value: AmountValue) => {
  const numbers = toArray(subject).filter(isFilled).map(parseAmount).filter(number => !isNaN(number));
  const from = parseAmount(value.from);
  const to = parseAmount(value.to);

  switch (value.operator) {
    case 'exists':
      return numbers.some(number => number !== 0);
    case 'missing':
      return numbers.every(number => number === 0);
    case 'eq':
      return numbers.some(number => number === from);
    case 'ne':
      return numbers.every(number => number !== from);
    case 'gt':
      return numbers.some(number => number > from);
    case 'lt':
      return numbers.some(number => number < from);
    case 'range':
      return numbers.some(number =>
        (isNaN(from) || number >= from) && (isNaN(to) || number <= to));
    default:
      return true;
  }
};


/* !- Dates */

const pad = (number: number) => (number < 10 ? `0${number}` : `${number}`);

export const toDateString = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (date: Date, days: number) => {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
};

/** monday of the week */
const startOfWeek = (date: Date) => addDays(date, -((date.getDay() + 6) % 7));

export const DATE_PRESETS: Record<DatePreset, { title: string; range: (now: Date) => [Date, Date] }> = {
  today: { title: 'Ma', range: now => [now, now] },
  thisWeek: { title: 'Ez a hét', range: now => [startOfWeek(now), addDays(startOfWeek(now), 6)] },
  nextWeek: { title: 'Jövő hét', range: now => [addDays(startOfWeek(now), 7), addDays(startOfWeek(now), 13)] },
  last7: { title: 'Elmúlt 7 nap', range: now => [addDays(now, -6), now] },
  thisMonth: {
    title: 'Ez a hónap',
    range: now => [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)],
  },
  nextMonth: {
    title: 'Jövő hónap',
    range: now => [new Date(now.getFullYear(), now.getMonth() + 1, 1), new Date(now.getFullYear(), now.getMonth() + 2, 0)],
  },
  prevMonth: {
    title: 'Előző hónap',
    range: now => [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0)],
  },
  thisYear: {
    title: 'Idén',
    range: now => [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear(), 11, 31)],
  },
};

export const getPresetRange = (preset: DatePreset, now = new Date()) =>
  DATE_PRESETS[preset].range(now).map(toDateString) as [string, string];

/** date part of a datetime string (2026-11-21 10:00:00 -> 2026-11-21) */
const datePart = (value: any) => (value ?? '').toString().substring(0, 10);

export const matchDateRow = (subject: any, row: DateRow) =>
  toArray(subject)
    .map(datePart)
    .filter(date => date && date !== '0000-00-00')
    .some(date => (!row.from || date >= row.from) && (!row.to || date <= row.to));

const hasDate = (subject: any) =>
  toArray(subject).map(datePart).some(date => date && date !== '0000-00-00');

const MONTHS = ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'];

/**
 * Short hungarian date range: nov. 1–21. / nov. 28. – dec. 3. / 2025. nov. 1. –
 */
export const formatDateRange = (from?: string, to?: string, now = new Date()) => {
  const parse = (value?: string) => {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    return { year, month, day };
  };

  const start = parse(from);
  const end = parse(to);
  const year = (date: { year: number }) => (date.year !== now.getFullYear() ? `${date.year}. ` : '');
  const format = (date: { year: number; month: number; day: number }, withYear = true) =>
    `${withYear ? year(date) : ''}${MONTHS[date.month - 1]} ${date.day}.`;

  if (start && end) {
    if (start.year === end.year && start.month === end.month) {
      return start.day === end.day ? format(start) : `${year(start)}${MONTHS[start.month - 1]} ${start.day}–${end.day}.`;
    }

    return `${format(start)} – ${format(end, start.year !== end.year)}`;
  }

  if (start) {
    return `${format(start)} –`;
  }

  return end ? `– ${format(end)}` : '';
};

const formatNumber = (value?: string) => {
  const number = parseAmount(value);
  return isNaN(number) ? '' : number.toLocaleString('hu-HU');
};


/* !- Matching */

/**
 * Default matching of a field on a subject (record or item)
 */
export const matchField = (field: Field, subject: any, value: Value): boolean => {
  const get = (field as any).get;

  switch (field.type) {
    case 'text':
      return containsText(get ? get(subject) : undefined, value as string, field.normalize ? (v => field.normalize(v)) : undefined);

    case 'texts':
      return field.inputs.every(input =>
        !(value as TextsValue)[input.id] ||
        containsText(input.get ? input.get(subject) : undefined, (value as TextsValue)[input.id]));

    case 'checkbox': {
      const ids = toArray(get ? get(subject) : []).filter(isFilled).map(String);
      return (value as CheckboxValue).ids.some(id => ids.includes(id));
    }

    case 'choice': {
      const ids = toArray(get ? get(subject) : []).map(String);
      return ids.includes((value as ChoiceValue).id);
    }

    case 'amount':
      return matchAmount(get ? get(subject) : undefined, value as AmountValue);

    case 'date': {
      const { state, rows } = value as DateValue;

      if (state === 'yes' || state === 'no') {
        const exists = hasDate(get ? get(subject) : undefined);
        return state === 'yes' ? exists : !exists;
      }

      return rows.every(row => matchDateRow(get ? get(subject, row.type) : undefined, row));
    }

    case 'select': {
      const ids = toArray(get ? get(subject) : []).map(String);
      return ids.includes((value as SelectValue).id);
    }

    default:
      return true;
  }
};

const matchRecordField = (field: Field, record: any, value: Value) =>
  (field.match ? field.match(record, value) : matchField(field, record, value));

const matchItemField = (field: Field, item: any, value: Value) =>
  (field.matchItem ? field.matchItem(item, value) : matchField(field, item, value));

const isItemField = (group: Group, field: Field) => !!group.items && (!!field.matchItem || !field.match);

/**
 * Does the record meet every criterion?
 *
 * @param groups criteria config
 * @param record grid record
 * @param criteria active values (getCriteria)
 */
export const matchRecord = (
  groups: Group[],
  record: any,
  criteria: Criteria,
): boolean =>
  groups.every((group) => {
    const active = group.fields.filter(field => criteria[field.id] !== undefined);

    if (!active.length) {
      return true;
    }

    const recordFields = active.filter(field => !isItemField(group, field));
    const itemFields = active.filter(field => isItemField(group, field));

    if (!recordFields.every(field => matchRecordField(field, record, criteria[field.id]))) {
      return false;
    }

    if (!itemFields.length) {
      return true;
    }

    const items = group.items(record) || [];

    return itemFields.every(field => items.some(item => matchItemField(field, item, criteria[field.id])));
  });

/* !- Summary */

const optionTitles = (options: Option[], ids: string[]) =>
  ids.map(id => (options.find(option => option.id === id) || { title: id }).title);

export const getFieldOptions = (field: CheckboxField) =>
  (field.groups ? field.groups.flatMap(group => group.options) : field.options || []);

/**
 * Chip of an active criterion: label + value text
 */
export const getSummary = (field: Field, value: Value): { label: string; text: string } => {
  switch (field.type) {
    case 'text':
      return { label: field.title, text: value as string };

    case 'texts':
      return {
        label: field.title,
        text: field.inputs
          .map(input => (value as TextsValue)[input.id])
          .filter(Boolean)
          .join(', '),
      };

    case 'checkbox': {
      const titles = optionTitles(getFieldOptions(field), (value as CheckboxValue).ids);
      const mode = field.modes && (value as CheckboxValue).mode !== field.modes[0].id
        ? ` (${optionTitles(field.modes, [(value as CheckboxValue).mode])[0].toLowerCase()})`
        : '';

      return {
        label: field.title,
        text: (titles.length > 3 ? `${titles.slice(0, 2).join(', ')} +${titles.length - 2}` : titles.join(', ')) + mode,
      };
    }

    case 'choice': {
      const { id, text } = value as ChoiceValue;
      const title = optionTitles(field.options, [id])[0];
      return { label: field.title, text: text ? `${title}: ${text}` : title };
    }

    case 'amount': {
      const { operator, from, to } = value as AmountValue;
      const unit = field.unit ? ` ${field.unit}` : '';
      const texts = {
        exists: 'van',
        missing: 'nincs',
        eq: `${formatNumber(from)}${unit}`,
        ne: `≠ ${formatNumber(from)}${unit}`,
        gt: `> ${formatNumber(from)}${unit}`,
        lt: `< ${formatNumber(from)}${unit}`,
        range: `${from ? formatNumber(from) : ''}–${to ? formatNumber(to) : ''}${unit}`,
      };

      return { label: field.title, text: texts[operator] };
    }

    case 'date': {
      const { state, rows } = value as DateValue;

      if (state === 'yes' || state === 'no') {
        return { label: field.title, text: state === 'yes' ? 'van' : 'nincs' };
      }

      if (field.types && rows.length === 1) {
        return {
          label: optionTitles(field.types, [rows[0].type])[0],
          text: formatDateRange(rows[0].from, rows[0].to),
        };
      }

      return {
        label: field.title,
        text: rows
          .map(row => [
            field.types ? optionTitles(field.types, [row.type])[0] : '',
            formatDateRange(row.from, row.to),
          ].filter(Boolean).join(' '))
          .join(', '),
      };
    }

    case 'select':
      return { label: field.title, text: optionTitles(field.options, [(value as SelectValue).id])[0] };

    default:
      return { label: (field as Field).title, text: '' };
  }
};


/* !- Bound grid filters */

export const isBound = (field: Field) => !!field.bind;

/** groups without the bound fields (search query, matching) */
export const getQueryGroups = (groups: Group[]): Group[] =>
  groups.map(group => ({ ...group, fields: group.fields.filter(field => !isBound(field)) }));

type GridFilterType = {
  id: string;
  label?: string;
  data?: Array<{ id?: any; title: string; items?: Array<{ id: any; title: string }> }>;
};

/**
 * Criteria of the existing grid filters (SETTINGS.filters with `label` + `data`,
 * the toolbar GridMultiSelect ones): a checkbox field bound to the filter
 *
 * @param filters grid SETTINGS.filters
 * @param config filter id -> field props (title, full, columns, position ...)
 * @example
 * fieldsFromGridFilters(SETTINGS.filters, { acquisition: { columns: 2 } })
 */
export const fieldsFromGridFilters = (
  filters: GridFilterType[],
  config: Record<string, Partial<CheckboxField>>,
): Record<string, CheckboxField> =>
  Object.keys(config).reduce((result, filterId) => {
    const filter = filters.find(item => item.id === filterId);

    if (!filter || !Array.isArray(filter.data)) {
      return result;
    }

    const toOption = ({ id, title }) => ({ id: String(id), title, value: id });
    const hasGroups = filter.data.some(item => Array.isArray(item.items));
    const groups = hasGroups
      ? filter.data.map((item, index) => ({ id: String(index), title: item.title, options: (item.items || []).map(toOption) }))
      : undefined;

    result[filterId] = {
      id: `${filterId}Filter`,
      type: 'checkbox',
      title: filter.label || filterId,
      bind: filterId,
      // a single group: its options without a group title
      ...(groups && groups.length === 1 ? { options: groups[0].options } : groups ? { groups } : { options: filter.data.map(toOption) }),
      ...config[filterId],
    } as CheckboxField;

    return result;
  }, {} as Record<string, CheckboxField>);

/** bound value -> the original option ids of the grid filter */
export const toBoundValue = (field: Field, value?: Value) => {
  if (!value || field.type !== 'checkbox') {
    return undefined;
  }

  const options = getFieldOptions(field);

  return (value as CheckboxValue).ids.map(id => {
    const option = options.find(item => item.id === id);
    return option && option.value !== undefined ? option.value : id;
  });
};


/* !- Search query (toolbar search: `?path=value&path>=value`) */

/*
  The query is in CNF (ui Filters.search `cnf`): `&` separates the groups, which
  all have to match, `|` the alternatives inside a group. The keys are record
  paths where there is one (invoicing.name, products.productId, orderedDateTime),
  so the query works with Filters.search too.

  @example
  invoicing.name=Kovács&takeoverStore==2|takeoverStore==6&deposit!==20000&orderedDateTime>=2026-11-01
 */

const TERM_REGEX = /^([0-9a-zA-ZöüóőúéáűíÖÜÓŐÚÉÁŰÍ_.]+)\s*([=~!*^$><]+)\s*(.*)$/;

export type Term = { field?: string; operator?: string; value?: string; raw: string };

/** the separators of the query are removed from the values */
const clean = (value: any) => (value ?? '').toString().replace(/[&|]/g, ' ').trim();

const YES = 'van';
const NO = 'nincs';

/** key of a field in the query */
export const getFieldPath = (field: Field) => field.path || field.id;

const getInputPath = (field: TextsField, input: TextsField['inputs'][0]) => input.path || `${getFieldPath(field)}.${input.id}`;

const getChoiceTextPath = (field: ChoiceField) => field.text?.path || `${getFieldPath(field)}.text`;

const optionQueries = (option: Option) => (option.query === undefined ? [] : [].concat(option.query));

/** written term of an option (checkbox, choice) */
const optionTerm = (field: Field, option: Option | undefined, id: string) =>
  (option && optionQueries(option).length ? optionQueries(option)[0] : `${getFieldPath(field)}==${clean(id)}`);

const getOptions = (field: Field): Option[] =>
  (field.type === 'checkbox' ? getFieldOptions(field) : field.type === 'choice' ? field.options : []);

/**
 * Query groups of the criteria (one `&` group per entry, `|` inside)
 */
export const criteriaToTerms = (groups: Group[], criteria: Criteria): string[] => {
  const terms: string[] = [];

  groups.forEach((group) => {
    group.fields.forEach((field) => {
      const value: any = criteria[field.id];
      const key = getFieldPath(field);

      if (value === undefined || isBound(field)) {
        return;
      }

      switch (field.type) {
        case 'text':
          terms.push((field.paths || [key]).map(path => `${path}=${clean(value)}`).join('|'));
          break;

        case 'texts':
          field.inputs.forEach((input) => {
            if (value[input.id]) {
              terms.push(`${getInputPath(field, input)}=${clean(value[input.id])}`);
            }
          });
          break;

        case 'checkbox': {
          const options = getFieldOptions(field);
          terms.push(value.ids.map(id => optionTerm(field, options.find(option => option.id === id), id)).join('|'));
          break;
        }

        case 'choice':
          terms.push(optionTerm(field, field.options.find(option => option.id === value.id), value.id));

          if (value.text) {
            terms.push(`${getChoiceTextPath(field)}=${clean(value.text)}`);
          }
          break;

        case 'amount': {
          const { operator, from, to } = value;
          const map = {
            exists: '!==0',
            missing: '==0',
            eq: `==${clean(from)}`,
            ne: `!==${clean(from)}`,
            gt: `>${clean(from)}`,
            lt: `<${clean(from)}`,
          };

          if (operator === 'range') {
            if (from) terms.push(`${key}>=${clean(from)}`);
            if (to) terms.push(`${key}<=${clean(to)}`);
          }
          else {
            terms.push(`${key}${map[operator]}`);
          }
          break;
        }

        case 'date':
          if (value.state === 'yes' || value.state === 'no') {
            terms.push(`${key}=${value.state === 'yes' ? YES : NO}`);
            break;
          }

          value.rows.forEach((row: DateRow) => {
            // date types: the type is the record path (orderedDateTime)
            const name = field.types ? row.type : key;
            if (row.from) terms.push(`${name}>=${row.from}`);
            if (row.to) terms.push(`${name}<=${row.to}`);
          });
          break;

        case 'select':
          terms.push(`${key}==${clean(value.id)}`);
          break;

        default:
          break;
      }
    });
  });

  return terms;
};

export const parseTerm = (raw: string): Term => {
  const match = TERM_REGEX.exec(raw);
  return match ? { field: match[1], operator: match[2], value: match[3].trim(), raw } : { raw };
};

/** CNF: [`&` group: [`|` alternative]] */
export const parseQuery = (query: string): Term[][] =>
  (query || '')
    .split('&')
    .map(group => group.split('|').map(raw => raw.trim()).filter(Boolean).map(parseTerm))
    .filter(group => group.length);

const isNumber = (value: string) => value !== '' && !isNaN(parseAmount(value));

export type ParsedQuery = {
  criteria: Criteria;
  /** `&` groups the criteria do not know (own expressions, ex. `orderId=6.0|orderId=2.3`) */
  rest: string[];
};

type KeyIndex = {
  /** query key -> field (+ texts input / date type) */
  keys: Record<string, { field: Field; input?: string; type?: string }>;
  /** text fields with more paths (one `|` group) */
  multiPaths: TextField[];
  /** own option term -> field + option id */
  options: Record<string, { field: Field; id: string }>;
};

const KEY_INDEX = new WeakMap<Group[], KeyIndex>();

const getKeyIndex = (groups: Group[]): KeyIndex => {
  if (KEY_INDEX.has(groups)) {
    return KEY_INDEX.get(groups);
  }

  const index: KeyIndex = { keys: {}, options: {}, multiPaths: [] };

  getQueryGroups(groups).flatMap(group => group.fields).forEach((field) => {
    if (field.type === 'texts') {
      field.inputs.forEach((input) => {
        index.keys[getInputPath(field, input)] = { field, input: input.id };
      });
    }
    else if (field.type === 'date' && field.types) {
      field.types.forEach((type) => {
        index.keys[type.id] = { field, type: type.id };
      });
    }
    else if (field.type === 'text' && field.paths && field.paths.length > 1) {
      index.multiPaths.push(field);
    }
    else {
      index.keys[getFieldPath(field)] = { field };
    }

    if (field.type === 'choice' && field.text) {
      index.keys[getChoiceTextPath(field)] = { field, input: 'text' };
    }

    getOptions(field).forEach(option => optionQueries(option).forEach((query) => {
      index.options[query] = { field, id: option.id };
    }));
  });

  KEY_INDEX.set(groups, index);

  return index;
};

/**
 * Option id of a term of a checkbox / choice field: own option term or `<path>==<id>`
 */
const getOptionId = (index: KeyIndex, term: Term): { field: Field; id: string } | undefined => {
  if (index.options[term.raw]) {
    return index.options[term.raw];
  }

  const entry = term.field && index.keys[term.field];

  if (!entry || (entry.field.type !== 'checkbox' && entry.field.type !== 'choice') || !['=', '=='].includes(term.operator)) {
    return undefined;
  }

  const option = getOptions(entry.field).find(item => item.id === term.value);

  return option ? { field: entry.field, id: option.id } : undefined;
};

/**
 * Criteria of a query (inverse of criteriaToTerms), the unknown `&` groups are kept
 */
export const termsToCriteria = (groups: Group[], query: string): ParsedQuery => {
  const result: ParsedQuery = { criteria: {}, rest: [] };
  const index = getKeyIndex(groups);
  const criteria: Record<string, any> = result.criteria;

  (query || '').split('&').map(raw => raw.trim()).filter(Boolean).forEach((groupRaw) => {
    const alternatives = groupRaw.split('|').map(raw => raw.trim()).filter(Boolean).map(parseTerm);

    /**
     * Options of one checkbox (or one choice option): any of them
     */
    const options = alternatives.map(term => getOptionId(index, term));
    const optionField = options[0]?.field;

    if (
      optionField
      && options.every(option => option && option.field === optionField)
      && criteria[optionField.id] === undefined
      && (optionField.type === 'checkbox' || alternatives.length === 1)
    ) {
      criteria[optionField.id] = optionField.type === 'checkbox'
        ? { ids: options.map(option => option.id) }
        : { id: options[0].id };
      return;
    }

    // text of more paths: the same text in every path of the field
    const multiPath = alternatives.length > 1 && index.multiPaths.find(field =>
      field.paths.length === alternatives.length
      && alternatives.every(term => term.operator === '=' && term.value === alternatives[0].value)
      && field.paths.every(path => alternatives.some(term => term.field === path)));

    if (multiPath && criteria[multiPath.id] === undefined) {
      criteria[multiPath.id] = alternatives[0].value;
      return;
    }

    if (alternatives.length > 1) {
      result.rest.push(groupRaw);
      return;
    }

    const term = alternatives[0];
    const { operator, value } = term;
    let known = false;

    const entry = term.field && index.keys[term.field];

    // text of a choice (ex. coupon code: products.subtitle=...)
    if (entry && entry.field.type === 'choice' && entry.input === 'text' && operator === '=') {
      criteria[entry.field.id] = { ...(criteria[entry.field.id] || {}), text: value };
      return;
    }

    const field = entry?.field;
    const id = field?.id;

    if (field) {
      switch (field.type) {
        case 'text':
          known = (operator === '=' || operator === '~=') && criteria[id] === undefined;
          if (known) criteria[id] = value;
          break;

        case 'texts':
          known = operator === '=';
          if (known) criteria[id] = { ...(criteria[id] || {}), [entry.input]: value };
          break;

        case 'amount':
          if (!isNumber(value)) {
            break;
          }

          known = true;

          if (operator === '>=' || operator === '<=') {
            const previous = criteria[id]?.operator === 'range' ? criteria[id] : { operator: 'range' };
            criteria[id] = { ...previous, [operator === '>=' ? 'from' : 'to']: value };
          }
          else if ((operator === '==' || operator === '=') && parseAmount(value) === 0) {
            criteria[id] = { operator: 'missing' };
          }
          else if ((operator === '!==' || operator === '!=') && parseAmount(value) === 0) {
            criteria[id] = { operator: 'exists' };
          }
          else {
            const map = { '=': 'eq', '==': 'eq', '!=': 'ne', '!==': 'ne', '>': 'gt', '<': 'lt' };
            known = !!map[operator];
            if (known) criteria[id] = { operator: map[operator], from: value };
          }

          // only the operators of the field (ex. no `nem egyenlő`): an own expression
          if (known && !field.operators.includes(criteria[id].operator)) {
            delete criteria[id];
            known = false;
          }
          break;

        case 'date': {
          if (!entry.type && operator === '=' && (value === YES || value === NO) && field.states) {
            known = true;
            criteria[id] = { state: value === YES ? 'yes' : 'no', rows: [] };
            break;
          }

          if (operator === '>=' || operator === '<=') {
            known = true;

            const current: DateValue = criteria[id] || { state: 'date', rows: [] };
            let row = current.rows.find(item => item.type === entry.type);

            if (!row) {
              row = { type: entry.type };
              current.rows.push(row);
            }

            row[operator === '>=' ? 'from' : 'to'] = value;
            criteria[id] = current;
          }
          break;
        }

        case 'select':
          known = (operator === '==' || operator === '=') && criteria[id] === undefined;
          if (known) criteria[id] = { id: value };
          break;

        default:
          break;
      }
    }

    if (!known) {
      result.rest.push(groupRaw);
    }
  });

  return result;
};

/**
 * Form values of the dialog inputs (inverse of getValue)
 */
export const valueToForm = (field: Field, value: Value, formId: string): Record<string, any> => {
  const key = (part?: string | number) => fieldKey(formId, field.id, part);
  const v: any = value;

  switch (field.type) {
    case 'text':
      return { [key()]: v };

    case 'texts':
      return Object.keys(v).reduce((result, input) => ({ ...result, [key(input)]: v[input] }), {});

    case 'checkbox': {
      const items = field.groups
        ? field.groups.reduce((result, group) => ({
          ...result,
          [key(group.id)]: v.ids.filter(id => group.options.some(option => option.id === id)),
        }), {})
        : { [key()]: v.ids };

      return v.mode ? { ...items, [key('mode')]: v.mode } : items;
    }

    case 'choice':
      return v.text ? { [key()]: v.id, [key('text')]: v.text } : { [key()]: v.id };

    case 'amount':
      return { [key('operator')]: v.operator, [key('from')]: v.from || '', [key('to')]: v.to || '' };

    case 'date': {
      if (v.state === 'yes' || v.state === 'no') {
        return { [key('state')]: v.state };
      }

      return v.rows.reduce((result, row, index) => ({
        ...result,
        [key(`${index}#from`)]: row.from || '',
        [key(`${index}#to`)]: row.to || '',
        ...(row.type ? { [key(`${index}#type`)]: row.type } : {}),
      }), { [key('rows')]: v.rows.length, ...(field.states ? { [key('state')]: 'date' } : {}) });
    }

    case 'select':
      return { [key()]: v.id };

    default:
      return {};
  }
};

/**
 * Dialog form values at opening: the bound grid filters + the search query
 */
export const getDialogForm = (groups: Group[], form: Record<string, any>, formId: string, searchId: string) => {
  const search = form[searchId];
  const parsed = typeof search === 'string' && search[0] === '?'
    ? termsToCriteria(groups, search.substring(1))
    : { criteria: {}, rest: [] } as ParsedQuery;

  const items = {};

  groups.forEach((group) => {
    group.fields.forEach((field) => {
      if (isBound(field)) {
        const ids = [].concat(form[field.bind] || []).map(String);

        if (ids.length) {
          Object.assign(items, valueToForm(field, { ids }, formId));
        }
      }
      else if (parsed.criteria[field.id] !== undefined) {
        Object.assign(items, valueToForm(field, parsed.criteria[field.id], formId));
      }
    });
  });

  return { items, parsed };
};

let QUERY_CACHE: { groups: Group[]; query: string; parsed: ParsedQuery } = null;

/**
 * Grid filter of the search query: the known terms by the criteria, the rest
 * (own expressions) by the fallback (ex. ui Filters.search)
 *
 * @param fallback (record, query) => boolean, the query of the unknown terms
 */
export const matchQuery = (
  groups: Group[],
  record: any,
  query: string,
  fallback?: (record: any, query: string) => boolean,
) => {
  if (!QUERY_CACHE || QUERY_CACHE.groups !== groups || QUERY_CACHE.query !== query) {
    QUERY_CACHE = { groups, query, parsed: termsToCriteria(groups, query) };
  }

  const { criteria, rest } = QUERY_CACHE.parsed;

  // the fallback first: ui Filters.search builds its cache on the first record (index 0);
  // the rest is `&` groups, so the fallback has to split in the same way (Filters.search `cnf`)
  return (!rest.length || !fallback || fallback(record, rest.join('&')))
    && matchRecord(getQueryGroups(groups), record, criteria);
};
