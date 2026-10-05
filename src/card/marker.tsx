
import React, { useContext, useState } from 'react';
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


// the tooltip (popover) layer cannot open over these layers (layer reducer)
const BLOCKING_LAYER_METHODS = ['dialog', 'fullscreen', 'sidebar'];


/**
 * InfoBox Marker
 * Over a dialog/fullscreen/sidebar layer (ex. Lightbox) the content opens inline, next to the marker.
 *
 * @example
 * <MarkerInfoBox>
 *  <span>Hello</span>
 * </MarkerInfoBox>
 */
export const MarkerInfoBox = ({ children }) =>
{
  const { store } = useContext(ReactReduxContext);
  const dispatch = useDispatch();

  // inline content: false | 'left' | 'right'
  const [inline, setInline] = useState<false | 'left' | 'right'>(false);

  const isOnLayer = () =>
  {
    const { active, method } = store.getState().layer || {};

    return active === true && BLOCKING_LAYER_METHODS.indexOf(method) !== -1;
  };

  const openInline = (event) =>
  {
    const { left } = event.currentTarget.getBoundingClientRect();

    setInline(left > window.innerWidth / 2 ? 'left' : 'right');
  };

  const onMouseHandler = (event) =>
  {
    if (isOnLayer())
    {
      openInline(event);
      return;
    }

    dispatch(tooltip(children, event));
  };

  const onClickHandler = (event) =>
  {
    event.preventDefault();
    event.stopPropagation();

    if (isOnLayer())
    {
      if (inline)
      {
        setInline(false);
      }
      else
      {
        openInline(event);
      }

      return;
    }

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
      className="relative"
      onMouseLeave={() => setInline(false)}
    >
      <div
        className="pointer overflow bg-black-20 fill-yellow circle hover:bg-yellow hover:fill-black hover:rotate-45 transition mobile:text-xxs"
        style={{ width: '2.5em', height: '2.5em', padding: '0.5em' }}
        onMouseEnter={onMouseHandler}
        onClick={onClickHandler}
      >
        <IconPlus />
      </div>

      {inline &&
        // transparent padding: the mouse can move to the content without leaving
        <div
          className="absolute px-1/2"
          style={{
            top: '50%',
            [inline === 'right' ? 'left' : 'right']: '100%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
          onClick={event => event.stopPropagation()}
        >
          {/* like the tooltip layer content */}
          <div
            className="marker-info bg-white rounded shadow p-1"
            style={{ width: 'max-content' }}
          >
            {children}
          </div>
        </div>
      }
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
