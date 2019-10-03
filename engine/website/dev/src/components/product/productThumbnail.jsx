
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';
import formatThousand from '@1studio/utils/string/formatThousand';
import { File } from '@1studio/ui/form/pure/dropzone';


/* !- React Actions */

import { dialog } from '@1studio/ui/layer/actions';


/* !- React Elements */

import IconFavorite from '../../icons/heart';
import IconFavoriteActive from '../../icons/heartSolid';
import IconZoom from '../../icons/searchPlus';
import Product from './product';


/* !- Constants */

import {
  parse,
  MAX_THUMBNAIL_FABRICS_LENGTH,
  MAX_THUMBNAIL_FEATURE_LENGTH,
} from './const';

/**
 * [ProductColorPalette description]
 */
export const ProductColorPalette = ({ fabrics }) => (
  <div className="h-center" style={{ display: 'inline-flex' }}>
    <div className="flex">
      { fabrics.slice(0, MAX_THUMBNAIL_FABRICS_LENGTH).map(({ colorHex, image }) => (
        <div
          key={image}
          className="w-1.5 h-1.5 mr-1/2"
          style={{ backgroundColor: colorHex }}
        />
      ))}
    </div>
    { fabrics.length > MAX_THUMBNAIL_FABRICS_LENGTH &&
    <div className="text-xs bold">{`+${fabrics.length - MAX_THUMBNAIL_FABRICS_LENGTH}`}</div>
    }
  </div>
);

/**
 * [Product description]
 */
class ProductThumbnail extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false,
    };
  }

  onClickHandler = () =>
  {
    if (
      typeof this.props.onClick === 'function'
      && String(this.props.onClick) !== String(ProductThumbnail.defaultProps)
    )
    {
      this.props.onClick(this.props.record);
    }
  }

  onClickZoomHandler = () =>
  {
    this.context.store.dispatch(dialog(<Product record={this.props.record} />));
  }

  onMouseOverHandler = () =>
  {
    this.setState({ active: true });
  }

  onMouseOutHandler = (event) =>
  {
    //this is the original element the event handler was assigned to
    var e = event.toElement || event.relatedTarget;

    if (e.parentNode === this || e === this)
    {
      return;
    }

    console.log(e, e.parentNode);
    this.setState({ active: false });
  }


  render()
  {
    const {
      record,
      className,
      onClick,
      isFavourite,
    } = this.props;

    const {
      brand,
      title,
      subtitle,
      price_discount,
      price_orig_gross,
      price_sale_gross,
      flag,
      features,
      dimension,
      color,
      images,
      manufacturer,
      stock,
    } = record;

    const helper = this.context.register && this.context.register.data.products ? this.context.register.data.products : {};

    //@TODO helper átrakni props-ra


    /**
     * Hover extra info => table (title|value)
     */
    const details = [
      { id: 'dimension', title: 'Méret', value: parse.dimension(record) },
      ...parse.features({ features }, helper.features)
        .filter(({ value }) => value !== undefined).slice(0, MAX_THUMBNAIL_FEATURE_LENGTH),
      { id: 'delivery', title: 'Elérhetőség', value: parse.stock(record) },
      { id: 'color', title: 'Színek', value: <ProductColorPalette fabrics={parse.fabrics(record, helper.fabrics)} /> },
    ];

    const favourite = isFavourite ?
      <IconFavoriteActive className="w-2 fill-orange" /> : <IconFavorite className="w-2 fill-gray" />;

    const classes = classNames({
      relative: true,
      [className]: true,
      'border-top border-left border-right': true,
      'border-white': this.state.active === false,
      'shadow-outer-3': this.state.active,
    });

    return (
      <div
        className={classes}
        style={{ minWidth: '250px' }}
        onClick={this.onClickHandler}
        onMouseOver={this.onMouseOverHandler}
        onMouseOut={this.onMouseOutHandler}
      >
        { flag &&
        <div className="pin-top absolute m-1 tag">
          <span
            className="text-s"
            style={{ textTransform: 'none' }}
          >
            {parse.flag(record, helper.flags)[0].title}
          </span>
        </div>
        }
        <div
          className="embed"
          style={
            images ?
            {
              height: '250px',
              backgroundImage: `url(${new File({ id: images[0] }).getThumbnail()})`,
            }
            :
            {
              height: '250px',
              filter: 'grayscale(100%)',
              opacity: '0.2',
              backgroundImage: 'url(/images/logo.svg)',
            }
          }
        />

        <div className="p-2">
          <div className="overflow mb-1" style={{ height: '5em' }}>
            <div className="mb-1/4 bold" style={{ fontSize: '1.125em', lineHeight: '1.2em' }}>{`${brand} ${title}`}</div>
            <div className="light" style={{ height: '2.4em', lineHeight: '1.2em' }}>{subtitle}</div>
          </div>

          <div className="grid">
            <div className="col-10-12">
              <div className="mb-1/2" style={{ height: '1.5em' }}>
                { parseInt(price_discount) > 0 &&
                <div className="h-center">
                  <div className="text-s bold text-gray strikethrough">
                    {`${formatThousand(price_orig_gross)} Ft`}
                  </div>
                  <div className="tag mx-1 red bold" style={{ fontSize: '0.81em' }}>{`-${price_discount}%`}</div>
                </div>
                }
              </div>
              <div className="text-xl condensed heavy">
                {`${formatThousand(price_sale_gross)} Ft`}
              </div>
            </div>
            <div className="col-2-12 text-right">
              <div className="mb-1/2">
                <IconZoom className="w-2 fill-gray pointer" onClick={this.onClickZoomHandler} />
              </div>
              <div>
                { favourite }
              </div>
            </div>
          </div>
        </div>

        {/* !- Hover Details */}

        { this.state.active === true &&
        <div
          className="absolute border-left border-right border-bottom px-2 bg-white"
          style={{ right: '-1px', left: '-1px' }}
          // onMouseOver={this.onMouseOverHandler}
          // onMouseOut={this.onMouseOutHandler}
        >
          {
          details.map(({ id, title, value }) => (
            <div key={id} className="flex pb-1 text-s">
              <div className="col-1-2">
                <span className="light">{`${capitalizeFirstLetter(title)}: `}</span>
              </div>
              <div className="col-1-2 text-right">
                <span className="bold">{value}</span>
              </div>
            </div>
          ))
          }
        </div>
        }

      </div>
    );
  }
}

ProductThumbnail.defaultProps =
{
  className: 'col-1-3 bg-white',
  onClick: () =>
  {},
};

ProductThumbnail.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

export default ProductThumbnail;
