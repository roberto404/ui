import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindMapContexts } from './context';
import { MergedContexts } from '../../context';
import { popover } from '../../layer/actions';

class Marker extends Component
{
  UNSAFE_componentWillMount()
  {
    if (this.context.map && this.props.lat && this.props.lng)
    {
      const marker = new window.google.maps.Marker({
        position: {
          lat: parseFloat(this.props.lat),
          lng: parseFloat(this.props.lng),
        },
        icon: this.props.icon,
      });

      if (this.props.children)
      {
        google.maps.event.addListener(
          marker,
          'click',
          this.onClickMarker,
        );
      }

      marker.setMap(this.context.map);

      this.marker = marker;
    }
  }

  componentDidUpdate(prevProps)
  {
    if (JSON.stringify(prevProps.icon) !== JSON.stringify(this.props.icon))
    {
      this.marker.setIcon(this.props.icon);
    }

    const lat = parseFloat(this.props.lat);
    const lng = parseFloat(this.props.lng);

    if (prevProps.lat !== lat || prevProps.lng !== lng)
    {
      this.marker.setPosition({ lat, lng });
    }

    if (this.props.showPopover)
    {
      /**
       * @TODO position not working normal
       */
      // setTimeout(
      //   () =>
      //   {
      //     const position = this.context.map.getProjection().fromLatLngToPoint(this.marker.position);
      //
      //     const { top, left } = this.context.mapElement.getBoundingClientRect();
      //
      //     const target = { currentTarget: {
      //       getBoundingClientRect: () => (
      //         {
      //           left: left + position.y,
      //           top: top + position.x,
      //           width: this.marker.icon.scaledSize.width,
      //           height: this.marker.icon.scaledSize.height,
      //         })
      //     }};
      //
      //     this.context.store.dispatch(popover(this.props.children, target));
      //   },
      //   2000,
      // );

      const { top, left, width, height } = this.context.mapElement.getBoundingClientRect();

      const target = { currentTarget: {
        getBoundingClientRect: () => (
          {
            left: left + (width / 2),
            top: top + (height / 2) - this.marker.icon.scaledSize.height,
            width: this.marker.icon.scaledSize.width,
            height: this.marker.icon.scaledSize.height,
          })
      }};

      this.context.store.dispatch(popover(
        this.props.children,
        target,
        {
          className: 'no-padding tooltip closeable',
        },
      ));
    }
  }

  onClickMarker = (marker) =>
  {
    if (this.props.onClick)
    {
      if (this.props.onClick(marker, this.context.map) === false)
      {
        return;
      }
    }

    this.context.store.dispatch(popover(
      this.props.children,
      marker.ub,
      {
        className: 'no-padding tooltip closeable',
      },
    ));
  };

  render()
  {
    return <div id="mrk"></div>;
  }
};

Marker.propTypes = {
  lat: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lng: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      scaledSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    }),
  ]),
  onClick: PropTypes.func,
};


Marker.contextType = MergedContexts;

export default bindMapContexts(Marker);
