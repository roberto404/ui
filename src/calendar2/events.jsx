
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Hammer from 'hammerjs';
// import clamp from '@1studio/utils/math/clamp';
import clamp from '@1studio/utils/math/clamp';
import forEach from 'lodash/forEach';

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
 * Calendar component
 */
class Events extends Component
{
  componentDidMount()
  {
    this.initHammer();
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

    const svg = document.getElementById('timeline').getBoundingClientRect();

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
      )
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
   * Prepare events to eventRectangle Componenet
   * @return {Array} calendar rectagle object { x, y, width, height }
   */
  getEvents()
  {
    let i = 0;
    const rects = [];

    this.context.rows.forEach((row, i) =>
    {
      const vehicleCapacity = this.context.data['#' + row.id];

      if (vehicleCapacity)
      {
        vehicleCapacity.forEach(event => rects.push(
          getEventCoordinate(
            event,
            {
              ...this.context,
              rowNum: i
            }
          )
        ))
      }
    });

    return rects;
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
};

Events.contextTypes =
{
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
  rows: PropTypes.array,
  data: PropTypes.object,
  moment: PropTypes.func.isRequired,
};

export default Events;
