import React, { Component } from 'react';
import PropTypes from 'prop-types';
import importJs from '@1studio/utils/window/importJs';
import underscroreToCamelCase from '@1studio/utils/string/underscroreToCamelCase';


import {
  GOOGLE_MAPS_PROPS,
  GOOGLE_MAPS_EVENTS,
  GOOGLE_MAPS_LIB,
} from './constants';


window.assets = [];




const getLocation = (success = () => false, error = () => false) =>
{
  if (navigator && navigator.geolocation)
  {
    const geoPromise = new Promise((resolve, reject) =>
    {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    })

    geoPromise
      .then(success)
      .catch(error);
  }
};







/**
 * [Map description]
 * @extends Component
 */
class Map extends Component
{
  constructor(props)
  {
    super(props);

    this.state =
    {
      currentLocation: {},
    };

    this._listeners = {};
  }

  getChildContext()
  {
    return {
      map: this.map,
      mapElement: this.element,
    };
  }

  componentDidMount()
  {
    this.initMap();
  }

  componentDidUpdate(prevProps, prevState)
  {
    if (this.props.zoom !== prevProps.zoom)
    {
      this.map.setZoom(this.props.zoom);
    }

    if (this.props.center !== prevProps.center)
    {
      this.panTo(this.props.center);
    }

    if (this.state.currentLocation !== prevState.currentLocation)
    {
      this.panTo(this.state.currentLocation);
    }
  }

  componentWillUnmount()
  {
    // @TODO
    // if (this.geoPromise)
    // {
    //   this.geoPromise.cancel();
    // }

    //@TODO google.maps.event.removeListener;
  }

  /* */

  onLoadGoogleMapsApi = (event) =>
  {
    if (event.type === 'load')
    {
      this.createMap();
    }
  }

  /**
   * @return {string} Google Maps source link
   */
  getGoogleMapsApiUrl = () =>
  {
    return `${GOOGLE_MAPS_LIB}?key=${this.props.apiKey}&callback`;
  }

  initMap = () =>
  {
    /**
     * Load Google map if it is not
     */
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined')
    {
      importJs(this.getGoogleMapsApiUrl(), this.onLoadGoogleMapsApi);
    }
  }

  createMap = () =>
  {
    this.map = new window.google.maps.Map(
      this.element,
      GOOGLE_MAPS_PROPS.reduce(
        (props, prop) =>
        {
          props[prop] = this.props[prop]; // eslint-disable-line
          return props;
        },
        {},
      ),
    );

    // Add listeners
    GOOGLE_MAPS_EVENTS.forEach((eventName) =>
    {
      const eventPropName = `on${underscroreToCamelCase(eventName)}`;

      if (this.props[eventPropName])
      {
        this.map.addListener(
          eventName,
          () => this.props[eventPropName](this.map),
        );
      }
    });

    // Set Currenct location
    if (this.props.currentLocation)
    {
      getLocation(({ coords }) =>
      {
        const currentLocation = new window.google.maps.LatLng(coords.latitude, coords.longitude);
        this.setState({ currentLocation });
      });
    }

    window.thisMap = this.map;

    this.forceUpdate();
  }


  panTo = (coords) =>
  {
    if (typeof coords === 'object' && coords.lat && coords.lng && this.map)
    {
      if (!(coords instanceof window.google.maps.LatLng))
      {
        coords = new window.google.maps.LatLng(coords.lat, coords.lng); // eslint-disable-line
      }

      this.map.panTo(coords);
    }
  }

  render()
  {
    return (
      <div
        className={this.props.className}
      >
        <div
          className={this.props.className}
          ref={(ref) =>
            {
              this.element = ref;
            }}
        />
        { this.map && this.props.children }
      </div>
    );
  }
}


/**
 * childContextTypes
 * @type {Object}
 */
Map.childContextTypes = {
  map: PropTypes.object,
  mapElement: PropTypes.object,
};


Map.propTypes = {
  zoom: PropTypes.number,
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  preload: PropTypes.element,
  currentLocation: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  // google: PropTypes.object,
  // initialCenter: PropTypes.object,
  // className: PropTypes.string,
  // style: PropTypes.object,
  // containerStyle: PropTypes.object,
  // visible: PropTypes.bool,
  // mapType: PropTypes.string,
  // maxZoom: PropTypes.number,
  // minZoom: PropTypes.number,
  // clickableIcons: PropTypes.bool,
  disableDefaultUI: PropTypes.bool,
  // zoomControl: PropTypes.bool,
  // zoomControlOptions: PropTypes.object,
  // mapTypeControl: PropTypes.bool,
  // mapTypeControlOptions: PropTypes.bool,
  // scaleControl: PropTypes.bool,
  // streetViewControl: PropTypes.bool,
  // streetViewControlOptions: PropTypes.object,
  // panControl: PropTypes.bool,
  // rotateControl: PropTypes.bool,
  // fullscreenControl: PropTypes.bool,
  scrollwheel: PropTypes.bool,
  // draggable: PropTypes.bool,
  // draggableCursor: PropTypes.string,
  // keyboardShortcuts: PropTypes.bool,
  // disableDoubleClickZoom: PropTypes.bool,
  // noClear: PropTypes.bool,
  styles: PropTypes.array,
  // gestureHandling: PropTypes.string,
  // bounds: PropTypes.object
};

Map.defaultProps = {
  zoom: 8,
  center: {
    lat: 47.49801,
    lng: 19.03991,
  },
  scrollwheel: true,
  disableDefaultUI: false,
  preload: <div>Loading...</div>,
  currentLocation: false,
  className: 'h-full w-full',
  children: <span />,
};

export default Map;
