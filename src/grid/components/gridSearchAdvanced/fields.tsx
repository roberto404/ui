import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

/* !- Actions */

import { setValues, unsetValues } from '../../../form/actions';

/* !- React Elements */

import Input from '../../../form/components/input';
import Checkbox from '../../../form/components/checkbox';
import Segment from '../../../form/components/segment';
import Select from '../../../form/components/select';

import IconCheck from '../../../icon/mui/navigation/check';
import IconAdd from '../../../icon/mui/content/add';
import IconClose from '../../../icon/mui/navigation/close';

/* !- Constants */

import {
  AmountField,
  CheckboxField,
  ChoiceField,
  DateField,
  DATE_PRESETS,
  Field,
  getPresetRange,
  isChoiceText,
  Option,
  SelectField,
  TextField,
  TextsField,
  fieldKey,
} from './model';

type FieldProps<F extends Field = Field> = {
  field: F;
  formId: string;
  form: Record<string, any>;
};

/** checkbox options in columns (ui grid col-* utility) */
const COLUMN_CLASS = { 2: 'col-6-12', 3: 'col-4-12', 4: 'col-3-12' };

const AMOUNT_OPERATOR_TITLE = {
  exists: 'van',
  missing: 'nincs',
  eq: 'pontosan',
  ne: 'nem egyenlő',
  gt: 'nagyobb mint',
  lt: 'kisebb mint',
  range: 'tól–ig',
};


/* !- Parts */

/**
 * Pill toggle (Mindegy / Igen / Nem, date types): outlined, the active one is blue with a check
 */
export const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    className={classNames(
      'initial w-auto h-center gap-1/2 px-3/2 py-1/2 rounded-xl border pointer no-select',
      {
        'border-blue-dark bg-blue-light text-blue-dark fill-blue-dark medium': active,
        'border-gray-light bg-white-light text-black hover:bg-white-dark': !active,
      },
    )}
    onClick={onClick}
  >
    {active && <IconCheck className="w-1.5 h-1.5" />}
    <span>{children}</span>
  </button>
);

/**
 * Quick pick (date presets, frequent users): small gray chip
 */
export const Chip = ({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    className={classNames(
      'initial w-auto px-1 py-1/2 rounded text-xs pointer no-select',
      {
        'bg-blue-light text-blue-dark medium': active,
        'bg-white-dark text-gray-dark hover:bg-blue-light': !active,
      },
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

const Pills = ({ options, value, onChange }: { options: Option[]; value: string; onChange: (id: string) => void }) => (
  <div className="flex wrap gap-1/2">
    {options.map(option => (
      <Pill key={option.id} active={value === option.id} onClick={() => onChange(option.id)}>
        {option.title}
      </Pill>
    ))}
  </div>
);

const useSet = () => {
  const dispatch = useDispatch();

  return (items: Record<string, any>) => dispatch(setValues(items));
};


/* !- Fields */

const Text = ({ field, formId }: FieldProps<TextField>) => (
  <Input id={fieldKey(formId, field.id)} placeholder={field.placeholder || ''} className="m-0" />
);

const Texts = ({ field, formId }: FieldProps<TextsField>) => (
  <div className="flex gap-1">
    {field.inputs.map(input => (
      <div key={input.id} className={(input.grow ?? 1) > 1 ? 'grow' : 'w-1/3 shrink-0'}>
        <div className="text-xs text-gray-dark mb-1/2">{input.title}</div>
        <Input id={fieldKey(formId, field.id, input.id)} placeholder={input.placeholder || ''} className="m-0" />
      </div>
    ))}
  </div>
);

const optionData = (options: Option[]) => options.map(({ id, title }) => ({ id, title }));

const Checkboxes = ({ field, formId, form }: FieldProps<CheckboxField>) => {
  const set = useSet();
  const valueClassName = COLUMN_CLASS[field.columns || 4];

  if (!field.groups) {
    return (
      <Checkbox
        id={fieldKey(formId, field.id)}
        data={optionData(field.options || [])}
        dataTranslate={false}
        className="grid m-0"
        valueClassName={valueClassName}
      />
    );
  }

  return (
    <div className="column gap-1">
      {field.groups.map((group) => {
        const key = fieldKey(formId, field.id, group.id);
        const selected: string[] = (form[key] || []).map(String);
        const isAll = group.options.every(option => selected.includes(option.id));

        return (
          <div key={group.id}>
            <div className="h-center mb-1/2">
              <span className="text-s text-gray-dark">{group.title}</span>
              <button
                type="button"
                className="initial w-auto ml-auto text-s medium text-gray-dark hover:text-blue-dark pointer"
                onClick={() => set({ [key]: isAll ? [] : group.options.map(option => option.id) })}
              >
                {isAll ? 'egyik sem' : 'mind'}
              </button>
            </div>
            <Checkbox
              id={key}
              data={optionData(group.options)}
              dataTranslate={false}
              className="grid m-0"
              valueClassName={valueClassName}
            />
          </div>
        );
      })}
    </div>
  );
};
const Choice = ({ field, formId, form }: FieldProps<ChoiceField>) => {
  const set = useSet();
  const key = fieldKey(formId, field.id);
  const value = form[key] || field.options[0].id;

  return (
    <div className="column gap-1">
      <Pills options={field.options} value={value} onChange={id => set({ [key]: id })} />
      {isChoiceText(field, value) && (
        <Input id={fieldKey(formId, field.id, 'text')} placeholder={field.text.placeholder || ''} className="m-0" />
      )}
    </div>
  );
};

const Amount = ({ field, formId, form }: FieldProps<AmountField>) => {
  const operatorKey = fieldKey(formId, field.id, 'operator');
  const operator = form[operatorKey] || field.operator || field.operators[0];
  const postfix = field.unit ? <span className="text-gray-dark">{field.unit}</span> : undefined;

  return (
    <div className="column gap-1">
      <Segment
        id={operatorKey}
        default={field.operator || field.operators[0]}
        data={field.operators.map(id => ({ id, title: AMOUNT_OPERATOR_TITLE[id] }))}
        className="m-0 text-s nowrap"
      />
      {operator === 'range' && (
        <div className="h-center gap-1">
          <Input id={fieldKey(formId, field.id, 'from')} type="number" placeholder="tól" postfix={postfix} className="m-0 grow postfix-inside" />
          <span className="text-gray-dark">–</span>
          <Input id={fieldKey(formId, field.id, 'to')} type="number" placeholder="ig" postfix={postfix} className="m-0 grow postfix-inside" />
        </div>
      )}
      {['eq', 'gt', 'lt'].includes(operator) && (
        <Input id={fieldKey(formId, field.id, 'from')} type="number" placeholder="összeg" postfix={postfix} className="m-0 postfix-inside" />
      )}
    </div>
  );
};

const DATE_STATES: Option[] = [
  { id: 'any', title: 'Mindegy' },
  { id: 'yes', title: 'Van' },
  { id: 'no', title: 'Nincs' },
  { id: 'date', title: 'Dátum szerint' },
];

const DateRowInputs = ({ field, formId, form, index, removable }: FieldProps<DateField> & { index: number; removable: boolean }) => {
  const set = useSet();
  const dispatch = useDispatch();
  const fromKey = fieldKey(formId, field.id, `${index}#from`);
  const toKey = fieldKey(formId, field.id, `${index}#to`);
  const typeKey = fieldKey(formId, field.id, `${index}#type`);
  const type = form[typeKey] || field.defaultType || field.types?.[0].id;

  const onRemove = () => {
    const count = Math.max(1, parseInt(form[fieldKey(formId, field.id, 'rows')]) || 1);
    const items = {};

    // the next rows step one back
    for (let row = index; row < count - 1; row += 1) {
      ['from', 'to', 'type'].forEach((part) => {
        items[fieldKey(formId, field.id, `${row}#${part}`)] = form[fieldKey(formId, field.id, `${row + 1}#${part}`)];
      });
    }

    dispatch(unsetValues(['from', 'to', 'type'].reduce((result, part) =>
      ({ ...result, [fieldKey(formId, field.id, `${count - 1}#${part}`)]: undefined }), {})));
    set({ ...items, [fieldKey(formId, field.id, 'rows')]: count - 1 });
  };

  return (
    <div className={classNames('column gap-1', { 'border-top border-gray-light pt-1': index > 0 })}>
      {field.types && (
        <div>
          <div className="h-center mb-1/2">
            <span className="text-xs text-gray-dark">Melyik dátum?</span>
            {removable && (
              <button type="button" className="initial w-auto ml-auto h-center gap-1/2 text-xs text-gray-dark pointer hover:text-blue-dark" onClick={onRemove}>
                <IconClose className="w-1 h-1 fill-gray-dark" />
                <span>Feltétel törlése</span>
              </button>
            )}
          </div>
          <Pills options={field.types} value={type} onChange={id => set({ [typeKey]: id })} />
        </div>
      )}

      {field.presets && (
        <div className="flex wrap gap-1/2">
          {field.presets.map((preset) => {
            const [from, to] = getPresetRange(preset);

            return (
              <Chip
                key={preset}
                active={form[fromKey] === from && form[toKey] === to}
                onClick={() => set({ [fromKey]: from, [toKey]: to })}
              >
                {DATE_PRESETS[preset].title}
              </Chip>
            );
          })}
        </div>
      )}

      <div className="h-bottom gap-1">
        <div className="grow">
          <div className="text-xs text-gray-dark mb-1/2">Tól</div>
          <Input id={fromKey} type="date" className="m-0" />
        </div>
        <span className="text-gray-dark pb-1">–</span>
        <div className="grow">
          <div className="text-xs text-gray-dark mb-1/2">Ig</div>
          <Input id={toKey} type="date" className="m-0" />
        </div>
      </div>
    </div>
  );
};

const DateRange = (props: FieldProps<DateField>) => {
  const { field, formId, form } = props;
  const set = useSet();
  const stateKey = fieldKey(formId, field.id, 'state');
  const state = field.states ? (form[stateKey] || 'any') : 'date';
  const count = field.multiple ? Math.max(1, parseInt(form[fieldKey(formId, field.id, 'rows')]) || 1) : 1;

  return (
    <div className="column gap-1">
      {field.states && (
        <Pills options={DATE_STATES} value={state} onChange={id => set({ [stateKey]: id })} />
      )}

      {state === 'date' && Array.from({ length: count }).map((_, index) => (
        <DateRowInputs key={index} {...props} index={index} removable={count > 1} />
      ))}

      {state === 'date' && field.multiple && field.types && count < field.types.length && (
        <button
          type="button"
          className="initial w-auto h-center gap-1/2 text-s medium pointer hover:text-blue-dark"
          onClick={() => set({ [fieldKey(formId, field.id, 'rows')]: count + 1 })}
        >
          <IconAdd className="w-1.5 h-1.5" />
          <span>További dátumfeltétel (másik dátumtípussal)</span>
        </button>
      )}
    </div>
  );
};

const SelectOne = ({ field, formId, form }: FieldProps<SelectField>) => {
  const set = useSet();
  const key = fieldKey(formId, field.id);

  return (
    <div className="column gap-1">
      <Select
        id={key}
        placeholder={field.placeholder || 'Mindegy'}
        data={field.options}
        className="m-0"
      />
      {field.quick && field.quick.length > 0 && (
        <div className="h-center wrap gap-1/2">
          <span className="text-xs text-gray-dark mr-1/2">{field.quickTitle || 'Gyakori'}:</span>
          {field.quick.map(option => (
            <Chip key={option.id} active={form[key] == option.id} onClick={() => set({ [key]: option.id })}>
              {option.title}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
};


/**
 * Inputs of a criterion by its type
 */
const FieldInputs = (props: FieldProps) => {
  switch (props.field.type) {
    case 'text':
      return <Text {...(props as FieldProps<TextField>)} />;
    case 'texts':
      return <Texts {...(props as FieldProps<TextsField>)} />;
    case 'checkbox':
      return <Checkboxes {...(props as FieldProps<CheckboxField>)} />;
    case 'choice':
      return <Choice {...(props as FieldProps<ChoiceField>)} />;
    case 'amount':
      return <Amount {...(props as FieldProps<AmountField>)} />;
    case 'date':
      return <DateRange {...(props as FieldProps<DateField>)} />;
    case 'select':
      return <SelectOne {...(props as FieldProps<SelectField>)} />;
    default:
      return null;
  }
};

export default FieldInputs;
