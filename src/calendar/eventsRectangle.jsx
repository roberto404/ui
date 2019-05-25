
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'hammerjs';
import { connect } from 'react-redux';
// import clamp from '@1studio/utils/math/clamp';
import clamp from '@1studio/utils/math/clamp';

import {
  // getEventCoordinate,
  getEventDate,
} from './functions';



/* !- Constants */

const DEFAULT_STYLE = {
  marginRight: 2,
  fill: '#caefff',
  opacity: 0.8,
  fontColor: '#01689e',
  fontSize: 14,
  fontFamily: 'sans-serif',
  fontMargin: 5,
};


/**
 * x-Axis component
 */
class EventsRectangle extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      height: props.height,
      active: false,
    };
  }

  componentDidMount()
  {
    this.initHammerEdit(); // <- double tap load before long tap
    this.initHammerActivate();
    // this.initHammerDrag();
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({
      active: false,
      x: nextProps.x,
      y: nextProps.y,
      height: nextProps.height,
    });
  }

  componentDidUpdate()
  {
    if (this.state.active)
    {
      this.initHammerResize();
      this.initHammerDrag();
    }
    else
    {
      if (this.upHammerManager)
      {
        this.upHammerManager = undefined;
        this.downHammerManager = undefined;
      }

      if (this.eventHammerManager.recognizers[2])
      {
        this.eventHammerManager.remove(this.eventHammerManager.recognizers[2]);
      }
    }
  }

  /* !- Listeners */

  onClickListener = () =>
  {
    if (this.state.active === false)
    {
      this.setState({ active: true });
    }
    else
    {
      window.removeEventListener(window.orientation === undefined ? 'click' : 'touchend', this.onClickListener);
      this.setState({ active: false });
    }
  }

  /* !- Hammer Manager */

  getHammer(elementName)
  {
    const element = this[elementName];
    const index = `${elementName}HammerManager`;

    if (!this[index])
    {
      this[index] = new Hammer.Manager(element);
    }

    return this[index];
  }

  initHammerActivate()
  {
    const hammerManager = this.getHammer('event');

    hammerManager.add(new Hammer.Press({
      event: 'longtap',
      // time: window.orientation === undefined ? 0 : 250, // <--- mobil longtap
      time: 0,
      threshold: 20,
    }));

    hammerManager.on('longtap', this.activateListener);
  }

  initHammerDrag()
  {
    // recognizers: [0] -> tap, [1] -> press
    if (this.eventHammerManager.recognizers.length === 2)
    {
      const hammerManager = this.getHammer('event');
      hammerManager.add(new Hammer.Pan());
      hammerManager.on('panstart panmove pancancel panend', this.dragListener);
    }
  }

  initHammerResize()
  {
    if (!this.upHammerManager)
    {
      let hammerManager = this.getHammer('up');

      hammerManager.add(new Hammer.Pan());
      hammerManager.on('panstart panmove pancancel panend', e => this.resizeListener('up', e));


      hammerManager = this.getHammer('down');

      hammerManager.add(new Hammer.Pan());
      hammerManager.on('panstart panmove pancancel panend', e => this.resizeListener('down', e));
    }
  }

  initHammerEdit()
  {
    const hammerManager = this.getHammer('event');

    hammerManager.add(new Hammer.Tap({
      event: 'doubletap',
      taps: 2,
      posThreshold: 25,
    }));

    hammerManager.on('doubletap', this.editListener);
  }

  /* !- Listeners */

  activateListener = (event) =>
  {
    window.addEventListener(window.orientation === undefined ? 'click' : 'touchend', this.onClickListener);
  }



  dragListener = (event) =>
  {
    console.log('move - dragListener', event.type);

    // if (!this.state.active && ['panstart', 'panmove', 'pancancel', 'panend'].indexOf(event.type) !== -1)
    // {
    //   return;
    // }

    if (!this.StartCoord)
    {
      this.StartCoord = event.center;
      return;
    }


    const shift = {
      x: event.center.x - this.StartCoord.x,
      y: event.center.y - this.StartCoord.y,
    };

    switch (event.type)
    {
      case 'panmove':
        {
          if (this.state.x !== shift.x || this.state.y !== shift.y)
          {
            // if (Y_MOVEMENT_ACCURANCY)
            // {
            //   const accurancy = rowHeight / 60 * Y_MOVEMENT_ACCURANCY;
            //   shift.y = Math.round(shift.y / accurancy) * accurancy;
            //   shift.x = Math.round(shift.x / colWidth) * colWidth;
            // }

            this.setState({
              x: this.props.x + shift.x,
              y: this.props.y + shift.y,
            });
          }
          break;
        }

      case 'panend':
        {
          this.StartCoord = null;

          this.context.onAddEvent({
            id: this.props.id,
            ...getEventDate(this.state, this.context),
          });

          break;
        }

      default:
        break;
    }

    //ESC create pancancel.
  };

  resizeListener = (direction, event) =>
  {
    const {
      calendarCoord,
      calendarHeight,
    } = this.context;

    if (!this.StartCoord)
    {
      this.StartCoord = event.center;
      return;
    }

    console.log('up', event.type);

    /**
     * pointer movement when start (first click)
     * @type {Object} {x,y}
     */
    const shift = {
      x: event.center.x - this.StartCoord.x,
      y: event.center.y - this.StartCoord.y,
    };

    // if (Y_MOVEMENT_ACCURANCY)
    // {
    //   const accurancy = rowHeight / 60 * Y_MOVEMENT_ACCURANCY;
    //   shift.y = Math.round(shift.y / accurancy) * accurancy;
    // }

    switch (event.type)
    {
      case 'panmove':
        {
          if (direction === 'up')
          {
            const y = clamp(
              this.props.y + shift.y,
              calendarCoord.y,
              this.state.y + this.state.height,
            );

            this.setState({
              y,
              height: this.props.height - y + this.props.y,
            });
          }
          else
          {
            this.setState({
              height: clamp(
                this.props.height + shift.y,
                0,
                calendarHeight + calendarCoord.y - this.props.y,
              ),
            });
          }

          break;
        }

      case 'panend':
        {
          this.StartCoord = null;

          this.context.onAddEvent({
            id: this.props.id,
            ...getEventDate(this.state, this.context),
          });
          break;
        }

      default:
        break;
    }
  }

  editListener = (event) =>
  {
    this.context.onEditEvent(this.props);
    // console.log('edit', event.type, this.props);
  }

  render()
  {
    const {
      width,
      title,
    } = this.props;

    const {
      x,
      y,
      height,
    } = this.state;

    return (
      <g
        // id={`event event-${x}`}
        // ref={(ref) =>
        // {
        //   this.elements.event = ref;
        // }}
      >
        {/* <clipPath id="clip1">
          <rect
            x={e.x}
            y={e.y}
            width={e.width}
            height={e.height}
          />
        </clipPath> */}
        <defs>
          <filter id="dropshadow" width="150%" height="150%">
            <feOffset in="SourceGraphic" result="offOut" dx="2" dy="5" />
            <feColorMatrix
              in="offOut"
              result="matrixOut"
              type="matrix"
              values="0   0   0   0   0
                      0   0   0   0   0
                      0   0   0   0   0
                      0   0   0   0.1 0"
            />
            <feGaussianBlur in="matrixOut" result="blurOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <rect
          x={x}
          y={y}
          width={width - DEFAULT_STYLE.marginRight}
          height={height}
          fill={DEFAULT_STYLE.fill}
          fillOpacity={this.state.active ? 1 : DEFAULT_STYLE.opacity}
          filter={this.state.active ? 'url(#dropshadow)' : null}
          onMouseEnter={event => this.context.onEventMouseEnter(this.props, event)}
          onMouseLeave={event => this.context.onEventMouseLeave(this.props, event)}
          ref={(ref) =>
          {
            this.event = ref;
          }}
        />
        {height &&
        <text
          x={x + DEFAULT_STYLE.fontMargin}
          y={y + DEFAULT_STYLE.fontMargin}
          alignmentBaseline="hanging"
          fill={DEFAULT_STYLE.fontColor}
          fontSize={DEFAULT_STYLE.fontSize}
          fontFamily={DEFAULT_STYLE.fontFamily}
          // clipPath="url(#clip1)"
        >
          {title}
        </text>
        }

        { this.state.active &&
        <g>
          <circle
            cx={x + width - 20}
            cy={y}
            r="5"
            fill="white"
            fillOpacity={+this.state.active}
            strokeWidth="2"
            stroke={DEFAULT_STYLE.fill}
            strokeOpacity={+this.state.active}
          />
          <rect
            x={x}
            y={y - 10}
            width={width - DEFAULT_STYLE.marginRight}
            height={20}
            fillOpacity="0"
            ref={(ref) =>
            {
              this.up = ref;
            }}
          />

          <circle
            cx={x + 20}
            cy={y + height}
            r="5"
            fill="white"
            fillOpacity={+this.state.active}
            strokeWidth="2"
            stroke={DEFAULT_STYLE.fill}
            strokeOpacity={+this.state.active}
          />
          <rect
            x={x}
            y={y + height - 10}
            width={width - DEFAULT_STYLE.marginRight}
            height={20}
            fillOpacity="0"
            ref={(ref) =>
            {
              this.down = ref;
            }}
          />
        </g>
        }

      </g>
    );
  }
}

/**
 * propTypes
 * @type {Object}
 */
EventsRectangle.propTypes =
{
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  title: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  // style: PropTypes.shape({
  //   fill: PropTypes.string,
  //   fontSize: PropTypes.number,
  //   fontFamily: PropTypes.string,
  // }),
  //
};

/**
 * defaultProps
 * @type {Object}
 */
EventsRectangle.defaultProps =
{
  title: '',
  // style: {},
};



EventsRectangle.contextTypes =
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
  // colNum: PropTypes.number,
  onEditEvent: PropTypes.func.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  moment: PropTypes.func.isRequired,
  onEventMouseEnter: PropTypes.func.isRequired,
  onEventMouseLeave: PropTypes.func.isRequired,
};


export default EventsRectangle;
