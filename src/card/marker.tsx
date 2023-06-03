
import React, { useContext } from 'react';
import classNames from 'classnames';
import { useDispatch, ReactReduxContext } from 'react-redux';


/* !- React Actions */

import { tooltip, close } from '../layer/actions';


/* !- React Elements */

import IconPlus from '../icon/mui/content/add';


/* !- Constants */

/**
 * Predefined Markers Aligns
 */
export const MARKER_ALIGNS = {
  heading: [0, -100],
  tooltip: [-50, -50],
};


/**
 * InfoBox Marker
 * @example
 * <MarkerInfoBox>
 *  <span>Hello</span>
 * </MarkerInfoBox>
 */
export const MarkerInfoBox = ({ children }) =>
{
  const { store } = useContext(ReactReduxContext);
  const dispatch = useDispatch();

  const onMouseHandler = (event) =>
  {
    dispatch(tooltip(children, event));
  };

  const onClickHandler = (event) =>
  {
    event.preventDefault();
    event.stopPropagation();

    const layer = store.getState().layer;

    if (
      layer.active === true
      && children.props.id !== undefined
      && children.props.id === ((layer.element || {}).props || {}).id
    )
    {
      dispatch(close());
    }
    else
    {
      dispatch(tooltip(children, event));
    }
  };

  return (
    <div
      className="pointer overflow bg-black-20 fill-yellow circle hover:bg-yellow hover:fill-black hover:rotate-45 transition mobile:text-xxs"
      style={{ width: '2.5em', height: '2.5em', padding: '0.5em' }}
      onMouseEnter={onMouseHandler}
      onClick={onClickHandler}
    >
      <IconPlus />
    </div>
  );
};

/**
 * Predefined Markers: Heading, Tooltip
 */
export const MARKER_ELEMENTS = {
  heading: settings => (
    <div className="p-2 text-white heavy text-xxl mobile:text-s">
      {settings}
    </div>
  ),
  tooltip: settings => (
    <MarkerInfoBox>
      <span>{settings}</span>
    </MarkerInfoBox>
  ),
};


/**
 * Extend create marker elements
 * @param  {object} elements Ex. MARKER_ELEMENTS
 * @param  {object} aligns   Ex. MARKER_ALIGNS
 * @return {function}          createMarkers
 */
export const createMarkersHelper = ({ elements, aligns }) => markers =>
  markers
    .filter(({ category }) => elements[category])
    .map(({ position, category, settings, draggable }, n) => (
      <Marker key={n} index={n} position={position} align={aligns[category]} draggable={draggable}>
        {elements[category](settings)}
      </Marker>
    ));

/**
 * Create Predefined markers [MARKER_ELEMENTS] from JSON
 * @param {Array} markers [{ position, category, settings }]
 */
export const createMarkers = createMarkersHelper({ elements: MARKER_ELEMENTS, aligns: MARKER_ALIGNS });


/**
 * Wrapper to align and position to markers
 * @example
 * <Marker position={[0, 100]} align={[0, -100]}>
 *  <span>Hello</span>
 * </Marker>
 */
export const Marker = ({
  index,
  children,
  position,
  align,
  onClick,
  draggable,
}) =>
{
  const classes = classNames({
    absolute: true,
    pointer: typeof onClick === 'function',
  });

  return (
    <div
      className={classes}
      style={{ left: `${position[0]}%`, top: `${position[1]}%`, transform: `translate(${align[0]}%, ${align[1]}%)` }}
      onClick={onClick}
      draggable={draggable}
      data-index={index}
    >
      {children}
    </div>
  );
};


export default Marker;
