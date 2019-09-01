
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import isEqual from 'lodash/isEqual';

import {
  getEventPosition,
  getEventCoordinate,
  getEventDate,
} from './functions';


/* !- Redux Actions */

// import * as Actions from './actions';


/* !- ReactElements */

import Rectangle from './eventsRectangle';


/**
 * Events component
 *
 * Connect grid === this.state
 */
class Events extends Component
{
  constructor(props, context)
  {
    super(props);

    this.state = context.store.getState().grid[context.id] || { data: [] };
  }

  componentDidMount = () =>
  {
    this.initHammer();

    if (this.context.store)
    {
      this.unsubscribe = this.context.store.subscribe(() => this.onChangeListener());
    }
  }

  componentWillUnmount()
  {
    if (this.unsubscribe)
    {
      this.unsubscribe();
    }
  }

  /* !- Listeners */

  /**
   * Ivoke when the grid state change
   * @private
   */
  onChangeListener()
  {
    const state = this.context.store.getState().grid[this.context.id];

    if (state && !isEqual(state.data, this.state.data))
    {
      this.setState(state);
    }
  }

  /**
   * Invoke when double Tap or long Press above event
   * @private
   * @param  {Object} event
   * @return {void}
   */
  onClickListener = (event) =>
  {
    const {
      id,
      colWidth,
      rowHeight,
      calendarCoord,
    } = this.context;

    const svg = document.getElementById(id).getBoundingClientRect();

    const coord = {
      x: event.pointers[0].clientX - svg.x - calendarCoord.x,
      y: event.pointers[0].clientY - svg.y - calendarCoord.y,
    };

    this.context.onAddEvent(
      getEventDate(
        {
          x: (Math.floor(coord.x / colWidth) * colWidth) + calendarCoord.x,
          y: (Math.floor(coord.y / rowHeight) * rowHeight) + calendarCoord.y,
          height: rowHeight,
        },
        this.context,
      ),
    );

    // this.props.addEvent(getEventDate(
    //   {
    //     x: (Math.floor(coord.x / colWidth) * colWidth) + calendarCoord.x,
    //     y: (Math.floor(coord.y / rowHeight) * rowHeight) + calendarCoord.y,
    //     height: rowHeight,
    //   },
    //   this.context,
    // ));
  }


  /**
   * Prepare events to eventRectangle Component
   * @return {Array} calendar rectagle object { x, y, width, height }
   */
  getEvents()
  {
    return this.state.data.reduce((results, e) =>
    {
      const event = getEventCoordinate(e, this.context);

      event.rect.forEach((rect) =>
      {
        results.push({
          ...event,
          ...rect,
        });
      });

      return results;
    }, []);
  }


  /**
   * Initial Hammer Manager: doubletap, longpress (create new event)
   * @private
   * @return {void}
   */
  initHammer()
  {
    this.calendarHammer = new Hammer.Manager(this.calendar);

    this.calendarHammer.add(new Hammer.Tap({
      event: 'doubletap',
      taps: 2,
      posThreshold: 25,
    }));

    this.calendarHammer.add(new Hammer.Press({
      event: 'longpress',
      time: 550,
      threshold: 20,
    }));

    this.calendarHammer.on('doubletap longpress', this.onClickListener);
  }

  render()
  {
    return (
      <g id="events">
        <rect
          x={this.context.calendarCoord.x}
          y={this.context.calendarCoord.y}
          width={this.context.calendarWidth}
          height={this.context.calendarHeight}
          fill="red"
          fillOpacity="0.0"
          ref={(ref) =>
          {
            this.calendar = ref;
          }}
        />
        <g id="items">
          { this.getEvents().map(event =>
            (
              <Rectangle
                {...event}
                key={`${event.id}-${event.col}`}
              />
            ),
          )}
        </g>
      </g>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
Events.propTypes =
{
};

/**
 * defaultProps
 * @type {Object}
 */
Events.defaultProps =
{
};


Events.contextTypes =
{
  store: PropTypes.object,
  id: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  rowHeight: PropTypes.number,
  colWidth: PropTypes.number,
  calendarCoord: PropTypes.object.isRequired,
  calendarWidth: PropTypes.number.isRequired,
  calendarHeight: PropTypes.number.isRequired,
  // rowNum: PropTypes.number,
  colNum: PropTypes.number,
  onAddEvent: PropTypes.func,
};

export default Events;
