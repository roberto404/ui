import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import uniq from 'lodash/uniq';
import { useRefSelector } from '@1studio/ui/hooks';


/* !- React Actions */

import { popover, flush } from '@1studio/ui/layer/actions';
import { setValues, unsetValues } from '@1studio/ui/form/actions';
import isEmpty from 'lodash/isEmpty';


/* !- React Elements */

type ItemPropTypes = {
  id: string | number,
  title: string,
  parent: boolean,
  formId: string,
  onClick: (props: { id: string | number, parent: boolean }, event: React.MouseEvent<HTMLDivElement>) => void,
  onClickOnly: (props: { id: string | number, parent: boolean }, event: React.MouseEvent<HTMLDivElement>) => void,
}


/**
 * Item
 */
const Item = ({
  id,
  title,
  parent = false,
  formId,
  onClick,
  onClickOnly,
}: ItemPropTypes) => {

  const active = useSelector<boolean>(({ form }) => form[formId] && form[formId].indexOf(id) !== -1);

  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={classNames({
        "mt-1/2 p-1/2 h-center pointer": true,
        "border-bottom": parent,
        "bg-blue-dark text-white h-center rounded": active,
        "bg-white rounded": hovered && !active,
      })}
      onClick={event => onClick({ id, parent }, event)}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {parent === false &&
        <div
          className={classNames({
            "w-2 h-2 mr-1  mb-1/2 mt-1/2": true,
            "fill-gray": !active,
            "fill-white": active,
          })}
          style={{ minWidth: '2rem' }}
        >
          {/* {STATUS_ICON[status]} */}
        </div>
      }

      {parent === false &&
        <div className="grow ellipsis pr-1">
          {title}
        </div>
      }

      {parent &&
        <div className="bold grow p-1/2">{title}</div>
      }

      {hovered &&
        <div
          className="bg-white-light border border-2 border-blue-dark rounded text-blue-dark  text-xs p-1/4 pt-1/2 px-1"
          onClick={event => onClickOnly({ id, parent }, event)}
        >
          csak ezek
        </div>
      }
    </div>
  );
}


/* !- Constants */

// ...


/* !- Types */

type PropTypes = {
  id: string,
  label: string,
  data: { title: string, items: { id: string, title: string }[] }[],
}


/**
 * GridMultiSelect
 */
const GridMultiSelect = ({
  id = 'filter',
  label = '',
  data = [],
}: PropTypes) => {

  const dispatch = useDispatch();
  const { value, ref: valueRef } = useRefSelector<string[]>(({ form }) => form[id] || []);


  /**
   * Invoke on click filter button
   */
  const onClickButtonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();
    event.stopPropagation();

    dispatch(popover(renderLayer(), event, { className: 'no-close' }));
  }

  /**
   * Extend current filters
   */
  const onClickFilterHandler = (props: { id: string | number, parent: boolean }, event: React.MouseEvent<HTMLDivElement>) => {

    event.preventDefault();
    event.stopPropagation();

    const value = valueRef.current;
    const parent = props.parent

    if (parent) {

      const nextValues = data[props.id].items.map(item => item.id);

      if (nextValues.every(id => value.indexOf(id) !== -1)) {
        dispatch(setValues({ [id]: value?.filter(id => nextValues.indexOf(id) === -1) }));
        return;
      }

      dispatch(setValues({ [id]: uniq([...value, ...nextValues]) }));
      return;
    }

    const index = value.indexOf(props.id);

    if (index === -1) {
      dispatch(setValues({ [id]: [...value, props.id] }));
    }
    else {
      const nextValue = [
        ...value.slice(0, index),
        ...value.slice(index + 1),
      ]
      dispatch(setValues({
        [id]: isEmpty(nextValue) ? undefined : nextValue,
      }));
    }
  }

  /**
   * Apply only filter or filter group
   */
  const onClickOnlyFilterHandler = (props: { id: string | number, parent: boolean }, event: React.MouseEvent<HTMLDivElement>) => {

    event.preventDefault();
    event.stopPropagation();

    // click filter group
    if (props.parent) {
      dispatch(setValues({ [id]: data[props.id].items.map(item => item.id) }));
    }
    else {
      dispatch(setValues({ [id]: [props.id] }));
    }

    dispatch(flush());
  }

  const onClickResetHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(unsetValues({ [id]: undefined }));
    dispatch(flush());
  }

  const renderLayer = () => {

    return (
      <div className="_flex" style={{ width: 300 /* * data.length */ }}>
        {
          data.map(({ title, items }, n) => (
            <div
              key={n}
              className={classNames({
                'mb-2': true,
              })}
            >
              <Item
                id={n}
                title={title}
                formId={id}
                onClick={onClickFilterHandler}
                onClickOnly={onClickOnlyFilterHandler}
                parent
              />
              {
                items.map(item => (
                  <Item
                    formId={id}
                    {...item}
                    onClick={onClickFilterHandler}
                    onClickOnly={onClickOnlyFilterHandler}
                  />
                ))
              }
            </div>
          ))
        }

        <div className='text-s underline text-gray text-center mt-2 pt-2 pointer' onClick={onClickResetHandler}>MIND (szűrő törlése)</div>
      </div>
    )
  }

  return (
    <div className={classNames({
      'field': true,
      'active': value?.length > 0,
    })}>
      <button className="input embed-arrow-down-gray" onClick={onClickButtonHandler}>
        {label}
      </button>
    </div>
  );
};

export default GridMultiSelect;