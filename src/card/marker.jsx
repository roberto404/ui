
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- React Actions */

import { tooltip } from '../layer/actions';


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
export const MarkerInfoBox = ({ children }, { store }) =>
{
  const onMouseHandler = (event) =>
  {
    store.dispatch(tooltip(children, event));
  };

  return (
    <div
      className="pointer overflow bg-black fill-yellow circle hover:bg-yellow hover:fill-black hover:rotate-45 transition mobile:text-xxs"
      style={{ width: '2.5em', height: '2.5em', padding: '0.3em' }}
      onMouseEnter={onMouseHandler}
      onClick={onMouseHandler}
    >
      <IconPlus />
    </div>
  );
};

MarkerInfoBox.contextTypes =
{
  store: PropTypes.object,
};

/**
 * Predefined Markers: Heading, Tooltip
 */
export const MARKER_ELEMENTS = {
  heading: settings => (
    <div className="p-2 text-white heavy" style={{ fontSize: '4em' }}>
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
    .map(({ position, category, settings }, n) => (
      <Marker key={n} position={position} align={aligns[category]}>
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
  children,
  position,
  align,
  onClick,
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
    >
      {children}
    </div>
  );
};


export default Marker;
