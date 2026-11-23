import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import classNames from 'classnames';

/* !- Actions */

import { setValues, unsetValues } from '../../../form/actions';
import { flush } from '../../../layer/actions';
import { EXPANDED_POSTFIX, FORM_PREFIX } from '../../constants';
import { useAppContext } from '../../../context';

/* !- React Elements */

import Input from '../../../form/components/input';
import Segment from '../../../form/components/segment';
import FieldInputs from './fields';
import Grid from '../grid';

import IconTune from '../../../icon/mui/image/tune';
import IconSearch from '../../../icon/mui/action/search';
import IconClose from '../../../icon/mui/navigation/close';

/* !- Constants */

import {
  Criteria,
  Field,
  Group,
  criteriaToTerms,
  fieldKey,
  getCriteria,
  getDialogForm,
  getFieldKeys,
  getFieldOptions,
  getQueryGroups,
  getSummary,
  getValueCount,
  isBound,
  normalizeText,
  toBoundValue,
} from './model';

export * from './model';


/* !- Types */

export type ApplyPayload = {
  criteria: Criteria;
  /** the new search query (without the `?` prefix), empty: no query criterion */
  query: string;
};

type PropTypes = {
  /** prefix of the form store keys of the dialog inputs */
  formId?: string;
  /** form key of the toolbar search (GridSearch id): the query is written there (`?field=value&...`) */
  searchId?: string;
  title?: string;
  description?: React.ReactNode;
  groups: Group[];
  /**
   * Before the values are written back: false = the dialog stays open, string = + the
   * message in the footer
   */
  onApply?: (payload: ApplyPayload) => void | boolean | string | Promise<void | boolean | string>;
  onClose?: () => void;
};

const FIND_KEY = 'find';

/** shortcut collection of the criterion finder (CTRL+K) */
const FIND_SHORTCUTS = 'gridSearchAdvanced@find';

/**
 * Text of the criterion finder: title, keywords, hint and the option names
 * (ex. BútorTrans, Gyártás csúszik), the date types and the input titles
 */
const getSearchText = (field: Field) => [
  field.title,
  field.keywords,
  field.hint,
  ...(field.type === 'checkbox'
    ? [...getFieldOptions(field).map(option => option.title), ...(field.groups || []).map(group => group.title)]
    : []),
  ...(field.type === 'choice' ? field.options.slice(1).map(option => option.title) : []),
  ...(field.type === 'date' && field.types ? field.types.map(option => option.title) : []),
  ...(field.type === 'texts' ? field.inputs.map(input => input.title) : []),
].filter(Boolean).join(' ');

const cardId = (formId: string, fieldId: string) => `${formId}-card-${fieldId}`.replace(/[^a-zA-Z0-9_-]/g, '-');

/** side menu row: utility classes instead of the grid row style (border, blue active row) */
const NavRow = ({ children, onClick, isActive }: any) => (
  <div
    className={classNames('flex rounded pointer no-select', isActive ? 'bg-white-dark bold' : 'hover:bg-white-dark')}
    onClick={onClick}
  >
    {children}
  </div>
);


/**
 * Advanced search dialog (Haladó keresés) of a grid: criteria cards in groups,
 * side menu (ui Grid tree), active chips on the top.
 *
 * The criteria are written into the toolbar search as a query
 * (`?customerName=Kovács&deposit>=10000`), the bound fields (`bind`, ex.
 * fieldsFromGridFilters) into their grid filters. At opening both are read
 * back; the own expressions of the query, which the criteria do not know,
 * are kept.
 *
 * @example
 * dispatch(dialog(<GridSearchAdvanced groups={GROUPS} />, { className: 'no-padding no-close' }));
 */
const GridSearchAdvanced = ({
  formId = 'searchAdvanced',
  searchId = 'search',
  title = 'Haladó keresés',
  description = (
    <>
      A találatnak <b>minden kitöltött szempontnak</b> meg kell felelnie. Ha egy listában
      többet jelölsz be, <b>bármelyik</b> elég.
    </>
  ),
  groups,
  onApply,
  onClose,
}: PropTypes) => {
  const dispatch = useDispatch();
  const store = useStore();
  const form = useSelector(({ form }: any) => form) as Record<string, any>;
  const contentRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>('');
  const [isReady, setReady] = useState(false);
  /** own expressions of the query at opening (`&` groups, not criteria): kept, removable as chips */
  const [rest, setRest] = useState<string[]>([]);

  /**
   * Opening: the dialog inputs from the search query and the bound grid filters
   */
  useLayoutEffect(() => {
    const state = store.getState().form || {};
    const keys = Object.keys(state).filter(key => key.indexOf(`${formId}#`) === 0);

    if (keys.length) {
      dispatch(unsetValues(keys.reduce((result, key) => ({ ...result, [key]: undefined }), {})));
    }

    const { items, parsed } = getDialogForm(groups, state, formId, searchId);

    setRest(parsed.rest);

    if (Object.keys(items).length) {
      dispatch(setValues(items));
    }

    setReady(true);
  }, []);

  const criteria = getCriteria(groups, form, formId);
  const activeFields = groups.flatMap(group => group.fields.filter(field => criteria[field.id] !== undefined));

  /**
   * Criterion finder: title, keywords or group title
   */
  const term = normalizeText(form[fieldKey(formId, FIND_KEY)] || '').trim();
  const isFound = (field: Field) => normalizeText(getSearchText(field)).indexOf(term) !== -1;
  const visibleGroups = groups
    .map((group) => {
      if (!term || normalizeText(group.title).indexOf(term) !== -1) {
        return group;
      }

      return { ...group, fields: group.fields.filter(isFound) };
    })
    .filter(group => group.fields.length);

  /* !- Side menu: ui Grid tree, row ids `g:<groupId>` and `f:<fieldId>` */

  const navId = `${formId}-nav`;
  const navSelected: string = useSelector(({ form }: any) => (form[FORM_PREFIX + navId] || [])[0]);
  /** the selection set by the scroll spy (not a click: no scrolling) */
  const spySelected = useRef<string>(null);
  /** smooth scrolling of a click: the spy waits until */
  const spyPausedUntil = useRef(0);

  const navData = useMemo(
    () => groups.flatMap(group => [
      { id: `g:${group.id}`, title: group.title, group },
      ...group.fields.map(field => ({ id: `f:${field.id}`, pid: `g:${group.id}`, title: field.title, field, group })),
    ]),
    [groups],
  );

  /** open at start: the first group and the groups with active criteria */
  const initialExpanded = useMemo(
    () => groups
      .filter((group, index) => index === 0 || group.fields.some(field => criteria[field.id] !== undefined))
      .map(group => `g:${group.id}`),
    [isReady],
  );

  const navFilter = useCallback(
    ({ group, field }) => normalizeText(field ? getSearchText(field) : group.title).indexOf(term) !== -1,
    [term],
  );

  /**
   * CTRL+K (Mac: ⌘K too): the criterion finder gets the focus
   */
  const { addShortcuts, removeShortcuts } = useAppContext() || {};

  useEffect(() => {
    if (!addShortcuts) {
      return undefined;
    }

    const handler = (event: KeyboardEvent) => {
      event?.preventDefault();
      (document.getElementById(fieldKey(formId, FIND_KEY)) as HTMLInputElement)?.focus();
    };

    addShortcuts([
      { keyCode: 'CTRL+K', handler, description: 'Szempont keresése' },
      { keyCode: 'META+K', handler, description: 'Szempont keresése' },
    ], FIND_SHORTCUTS);

    return () => removeShortcuts?.(FIND_SHORTCUTS);
  }, []);

  const navHook = {
    title: {
      title: '',
      align: 'left',
      format: ({ record }) => {
        if (!record.field) {
          const Icon = record.group.icon;
          const count = record.group.fields.filter(field => criteria[field.id] !== undefined).length;

          return (
            <div className="h-center gap-1 py-1/2 text-line-xl">
              {Icon && <Icon className="w-2 h-2 fill-black shrink-0" />}
              <span className="grow bold zoom-1.1">{record.title}</span>
              {count > 0 && (
                <span className="w-2 h-2 shrink-0 h-center v-center text-xs text-white bg-blue-dark circle">{count}</span>
              )}
            </div>
          );
        }

        const count = getValueCount(record.field, criteria[record.field.id]);

        return (
          <div className="h-center gap-1 px-1 py-1/2 text-line-xl border-left border-gray-light">
            <span className="grow">{record.title}</span>
            {count > 0 && (
              <span className="text-xs text-blue-dark bg-blue-light rounded px-1 bold">{count}</span>
            )}
          </div>
        );
      },
    },
  };

  /* !- Handlers */

  const close = () => {
    if (onClose) {
      onClose();
    }
    else {
      dispatch(flush());
    }
  };

  const clearField = (field: Field) => {
    const keys = getFieldKeys(field, store.getState().form || {}, formId);

    if (keys.length) {
      dispatch(unsetValues(keys.reduce((result, key) => ({ ...result, [key]: undefined }), {})));
    }
  };

  const onClickClearAll = () => {
    groups.forEach(group => group.fields.forEach(clearField));
    setRest([]);
  };

  /**
   * Apply: the query into the search, the bound fields into their grid filters
   */
  const onClickApply = async () => {
    const state = store.getState().form || {};
    const nextCriteria = getCriteria(groups, state, formId);
    const terms = criteriaToTerms(getQueryGroups(groups), nextCriteria);
    const previous = state[searchId];

    // CNF: every own expression is an `&` group, the new criteria are appended
    const query = [...terms, ...rest].join('&');

    const result = onApply
      ? await onApply({ criteria: nextCriteria, query })
      : undefined;

    if (typeof result === 'string') {
      setError(result);
      return;
    }

    if (result === false) {
      return;
    }

    const items = {};
    const unset = {};

    groups.forEach(group => group.fields.filter(isBound).forEach((field) => {
      const value = toBoundValue(field, nextCriteria[field.id]);

      if (value && value.length) {
        items[field.bind] = value;
      }
      else if (state[field.bind] !== undefined) {
        unset[field.bind] = undefined;
      }
    }));

    if (query) {
      items[searchId] = `?${query}`;
    }
    // the plain text search stays, only a query is cleared
    else if (typeof previous === 'string' && previous[0] === '?') {
      unset[searchId] = undefined;
    }

    if (Object.keys(unset).length) {
      dispatch(unsetValues(unset));
    }

    if (Object.keys(items).length) {
      dispatch(setValues(items));
    }

    close();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;

    if (event.key === 'Enter' && target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'checkbox') {
      event.preventDefault();
      onClickApply();
    }
  };

  const expandGroup = (groupId: string) => {
    const key = FORM_PREFIX + navId + EXPANDED_POSTFIX;
    const expanded: string[] = store.getState().form[key] || initialExpanded;

    if (!expanded.includes(`g:${groupId}`)) {
      dispatch(setValues({ [key]: [...expanded, `g:${groupId}`] }));
    }
  };

  const scrollTo = (fieldId: string) => {
    const element = document.getElementById(cardId(formId, fieldId));
    const content = contentRef.current;

    if (element && content) {
      spyPausedUntil.current = Date.now() + 800;
      content.scrollTo({ top: element.offsetTop - content.offsetTop - 16, behavior: 'smooth' });
    }
  };

  /** select a criterion in the side menu (chip click) */
  const select = (fieldId: string) => dispatch(setValues({ [FORM_PREFIX + navId]: [`f:${fieldId}`] }));

  /**
   * Click on a side menu row (or a chip): scroll to the card, a group to its
   * first criterion
   */
  useEffect(() => {
    if (navSelected && navSelected === spySelected.current) {
      // the own change of the spy: no scrolling, a later click on the same row scrolls again
      spySelected.current = null;
      return;
    }

    if (!navSelected) {
      return;
    }

    const id = navSelected.substring(2);
    const isGroup = navSelected.indexOf('g:') === 0;
    const group = isGroup
      ? groups.find(item => item.id === id)
      : groups.find(item => item.fields.some(field => field.id === id));

    if (!group) {
      return;
    }

    expandGroup(group.id);
    scrollTo(isGroup ? group.fields[0].id : id);
  }, [navSelected]);

  /**
   * Scroll spy: the last card above the top edge (+ a bit) is the current one
   */
  const onScroll = () => {
    const content = contentRef.current;

    if (!content || Date.now() < spyPausedUntil.current) {
      return;
    }

    const top = content.scrollTop + content.offsetTop + 40;
    const fields = visibleGroups.flatMap(group => group.fields);
    let next = fields[0]?.id;

    fields.forEach((field) => {
      const element = document.getElementById(cardId(formId, field.id));

      if (element && element.offsetTop <= top) {
        next = field.id;
      }
    });

    if (next && `f:${next}` !== navSelected) {
      spySelected.current = `f:${next}`;
      dispatch(setValues({ [FORM_PREFIX + navId]: [`f:${next}`] }));
      // the group of the current card opens in the side menu
      expandGroup(groups.find(group => group.fields.some(field => field.id === next)).id);
    }
  };

  /* !- Render */

  // the dialog inputs mount after the form is loaded (their defaults are not cleared)
  if (!isReady) {
    return null;
  }

  return (
    <div
      className="column bg-white-light text-left text-black"
      // fixed size of the dialog (design: 800px high)
      style={{ width: '120rem', maxWidth: '95vw', height: 800, maxHeight: '90vh', fontSize: '1.4rem' }}
      onKeyDown={onKeyDown}
    >

      {/* Header */}

      <div className="h-center gap-2 px-3 py-2 border-bottom border-gray-light shrink-0">
        <IconTune className="w-2 h-2 fill-black shrink-0" />
        <div className="text-l bold nowrap">{title}</div>
        <div className="text-s text-line-m text-gray-dark">{description}</div>

        <div className="ml-auto h-center gap-2 shrink-0">
          <button type="button" className="initial w-auto p-1/2 rounded pointer hover:bg-white-dark" onClick={close}>
            <IconClose className="w-2 h-2 fill-black" />
          </button>
        </div>
      </div>

      {/* Active criteria */}

      {(activeFields.length > 0 || rest.length > 0) && (
        <div className="h-center wrap gap-1 px-3 py-1 border-bottom border-gray-light bg-white shrink-0">
          <span className="text-xs bold uppercase text-gray-dark nowrap mr-1">
            Aktív ({activeFields.length + rest.length})
          </span>
          {rest.map(expression => (
            <div
              key={expression}
              className="h-center gap-1/2 px-1 py-1/2 bg-white-light border border-dashed border-gray rounded-l text-s nowrap"
            >
              <span className="text-gray-dark">Saját kifejezés:</span>
              <span className="medium">{expression}</span>
              <button
                type="button"
                className="initial w-auto h-center pointer"
                onClick={() => setRest(rest.filter(item => item !== expression))}
              >
                <IconClose className="w-1.5 h-1.5 fill-black" />
              </button>
            </div>
          ))}
          {activeFields.map((field) => {
            const group = groups.find(item => item.fields.includes(field));
            const Icon = group?.icon;
            const { label, text } = getSummary(field, criteria[field.id]);

            return (
              <div
                key={field.id}
                className="h-center gap-1/2 px-1 py-1/2 bg-white-light border border-gray-light rounded-l text-s nowrap pointer hover:bg-blue-light"
                onClick={() => select(field.id)}
              >
                {Icon && <Icon className="w-1.5 h-1.5 fill-gray-dark" />}
                <span className="text-gray-dark">{label}:</span>
                <span className="medium">{text}</span>
                <button
                  type="button"
                  className="initial w-auto h-center pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    clearField(field);
                  }}
                >
                  <IconClose className="w-1.5 h-1.5 fill-black" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex grow overflow">

        {/* Side menu */}

        <div className="col-1-4 column border-right border-gray-light">
          <div className="p-2 pb-1">
            <Input
              id={fieldKey(formId, FIND_KEY)}
              placeholder="Szempont keresése…"
              prefix={<IconSearch className="fill-gray-dark" />}
              postfix={<span className="shortcut text-xs text-gray-dark">Ctrl K</span>}
              className="m-0 prefix-inside postfix-inside"
            />
          </div>

          <div className="grow scroll-y px-1 pb-2">
            {(
              <Grid
                id={navId}
                data={navData}
                hook={navHook}
                selectable
                multipleSelect={false}
                showHeader={false}
                tree={{ filter: term ? navFilter : undefined, expanded: initialExpanded }}
                rowElement={NavRow}
                className="grid column"
                bodyClassName="column"
                noResults={<div className="text-s text-gray-dark p-1">Nincs ilyen szempont.</div>}
              />
            )}
          </div>
        </div>

        {/* Criteria cards */}

        <div ref={contentRef} className="grow scroll-y bg-white p-3 zoom-1.1" onScroll={onScroll}>
          {visibleGroups.map((group) => {
            const Icon = group.icon;

            return (
              <div key={group.id} className="mb-3">
                <div className="h-center gap-1 mb-2">
                  {Icon && (
                    <div className="h-center p-1 bg-white-light border border-gray-light rounded-l">
                      <Icon className="w-2 h-2 fill-black" />
                    </div>
                  )}
                  <div>
                    <div className="text-m bold">{group.title}</div>
                    {group.subtitle && <div className="text-s text-gray-dark">{group.subtitle}</div>}
                  </div>
                </div>

                <div className="grid-2-2">
                  <div className="columns">
                    {group.fields.map((field) => {
                      const isActive = criteria[field.id] !== undefined;

                      return (
                        <div key={field.id} className={field.full ? 'col-1-1' : 'col-6-12'}>
                          <div
                            id={cardId(formId, field.id)}
                            className={classNames(
                              'h-full bg-white-light rounded-l border p-2',
                              isActive ? 'border-blue-dark' : 'border-gray-light',
                            )}
                          >
                            <div className="h-center gap-1 pb-1 mb-2 border-bottom border-gray-light">
                              {isActive && <span className="inline-block p-1/4 circle bg-blue-dark shrink-0" />}
                              <span className="bold">{field.title}</span>
                              {field.hint && <span className="text-s text-gray-dark">{field.hint}</span>}

                              <div className="ml-auto h-center gap-2">
                                {field.type === 'checkbox' && field.modes && (
                                  <Segment
                                    id={fieldKey(formId, field.id, 'mode')}
                                    default={field.modes[0].id}
                                    data={field.modes}
                                    className="m-0 text-s nowrap"
                                  />
                                )}
                                {isActive && (
                                  <button
                                    type="button"
                                    className="initial w-auto h-center gap-1/2 text-s medium pointer hover:text-blue-dark"
                                    onClick={() => clearField(field)}
                                  >
                                    <IconClose className="w-1.5 h-1.5" />
                                    <span>Törlés</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <FieldInputs field={field} formId={formId} form={form} />

                            {field.note && <div className="text-s text-gray-dark mt-1/2">{field.note}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}

      <div className="h-center gap-1 px-3 py-2 border-top border-gray-light shrink-0">
        <button
          type="button"
          className="initial w-auto text-s medium text-blue-dark underline pointer"
          onClick={onClickClearAll}
        >
          Szűrők törlése
        </button>

        {error && <div className="text-s text-red ml-2">{error}</div>}

        <button type="button" className="solid w-auto ml-auto" onClick={close}>
          Mégsem
        </button>
        <button type="button" className="solid accent fill-white w-auto h-center gap-1/2" onClick={onClickApply}>
          <IconSearch className="w-1.5 h-1.5" />
          <span>Keresés</span>
        </button>
      </div>
    </div>
  );
};

export default GridSearchAdvanced;
