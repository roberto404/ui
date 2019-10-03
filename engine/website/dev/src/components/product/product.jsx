
import React from 'react';
import PropTypes from 'prop-types';
import formatThousand from '@1studio/utils/string/formatThousand';
import { File } from '@1studio/ui/form/pure/dropzone';
import capitalizeFirstLetter from '@1studio/utils/string/capitalizeFirstLetter';

/* !- React Actions */

// import { setValues } from '@1studio/ui/form/actions';


/* !- React Elements */

import IconFavorite from '../../icons/heart';
import IconFavoriteActive from '../../icons/heartSolid';
import IconZoom from '../../icons/searchPlus';


/* !- Constants */

import { parse, MAX_FABRICS_LENGTH } from './const';


/**
 * [Product description]
 */
const Product = (
  {
    record,
    isFavourite,
    helper,
  },
) =>
{
  const {
    id,
    related_id,
    brand,
    manufacturer,
    title,
    title_orig,
    title_orig_rest,
    subtitle,
    price_discount,
    price_orig,
    price_orig_gross,
    price_sale,
    price_sale_gross,
    vat,
    flag,
    category,
    features,
    dimension,
    color,
    images,
    instore,
    incart,
    description,
    priority,
  } = record;

  const fabrics = parse.fabrics(record, helper.fabrics) || [];
  const stockSample = parse.stockSample(record).join(', ');

  const favourite = isFavourite ?
    <IconFavoriteActive className="w-2 fill-orange" /> : <IconFavorite className="w-2 fill-gray" />;


  return (
    <div className="grid-3 desktop:nowrap">

      <div className="grow w-auto block mobile:p-0">

        <div
          className="mb-3 mx-auto embed w-full ratio-4-3"
          style={
            images.length ?
            {
              maxWidth: '640px',
              backgroundImage: `url(${new File({ id: images[0] }).getUrl('640x480')})`,
            }
            :
            {
              backgroundSize: '40%',
              filter: 'grayscale(100%)',
              opacity: '0.2',
              backgroundImage: 'url(/images/logo.svg)',
            }
          }
        />

        { description !== '' &&
        <div>
          <div className="mb-1 heavy zoom-1.1">Leírás</div>
          <div className="light text-line-l">{description}</div>
        </div>
        }

        <hr />

        { flag && flag.length > 0 &&
        <parseFlag>
          <div className="mb-1 heavy zoom-1.1">Kiemelt tulajdonságok</div>
          <div>
            { parse.flag(record, helper.flags).map(({ id, title }) => <span key={id} className="tag mx-1">{title}</span>) }
          </div>
          <hr />
        </parseFlag>
        }

        <div className="grid-2 light">
          <div className="col-1-3">
            <div className="mb-1 heavy">Méretek</div>
            { dimension.w &&
            <div className="mb-1/2">{`Szélesség: ${dimension.w} cm`}</div>
            }
            { dimension.h &&
            <div className="mb-1/2">{`Magasság: ${dimension.h} cm`}</div>
            }
            { dimension.d &&
            <div className="mb-1/2">{`Mélység: ${dimension.d} cm`}</div>
            }
          </div>
          <div className="col-1-3">
            <div className="mb-1 heavy">{capitalizeFirstLetter(dimension.e) || 'Egyéb méretek'}</div>
            { (dimension.e || dimension.w2 || dimension.h2 || dimension.d2) &&
            <div>
              { dimension.w2 &&
              <div className="mb-1/2">{`Szélesség: ${dimension.w2} cm`}</div>
              }
              { dimension.h2 &&
              <div className="mb-1/2">{`Magasság: ${dimension.h2} cm`}</div>
              }
              { dimension.d2 &&
              <div className="mb-1/2">{`Mélység: ${dimension.d2} cm`}</div>
              }
            </div>
            }
          </div>
          <div className="col-1-3">
            <div className="mb-1 heavy">Jellemzők</div>
            <span>
              {
                parse.features(record, helper.features).map(({ id, title, value }) => (
                  <div key={id} className="mb-1/2">
                    <span>{capitalizeFirstLetter(title)}</span>
                    { value &&
                      <span>{`: ${Array.isArray(value) ? value.join(', ') : value}`}</span>
                    }
                  </div>
                ))
              }
            </span>
          </div>
        </div>

      </div>

      <div className="p-0 mobile:order--1 desktop:w-35" style={{ minWidth: '35rem' }}>
        <div className="mb-1 light"><span className="bold">Cikkszám: </span>{id}</div>
        <div className="flex">
          <div className="mb-1 text-l bold grow">{`${brand} ${title}`}</div>
          <div>{favourite}</div>
        </div>
        <div className="text-s light text-line-l">{subtitle}</div>
        <hr />
        <div className="mb-2 tag">{parse.stock(record)}</div>
        <div className="mb-1 text-s light">
          <span className="bold">Méret: </span>
          <span>{parse.dimension(record)}</span>
        </div>
        { stockSample &&
        <div className="text-s light"><span className="bold">Megtekinthető: </span>{stockSample}</div>
        }
        <hr />
        <div className="mb-1/2">
          { parseInt(price_discount) > 0 &&
          <div className="h-center">
            <div className="text-s bold text-gray strikethrough">
              {`${formatThousand(price_orig_gross)} Ft`}
            </div>
            <div className="tag mx-1 red bold">{`- ${price_discount}%`}</div>
          </div>
          }
        </div>
        <div className="mb-2 text-xxl condensed">
          {`${formatThousand(price_sale_gross)} Ft`}
        </div>
        <div className="mb-1">
          <span className="bold">Várható szállítási költség:</span>
          <span className="light"> 3000 HUF-tól</span>
        </div>
        <div className="mb-2 text-xs light underline">Szállítási költség kalkulálása</div>
        <div className="text-xs light">(Az ár bruttóban értendő, az ÁFÁ-t tartamlazza.)</div>
        <hr />
        <div className="mb-1 bold">Szín:</div>
        <div className="mb-2 text-s light">A képen nem a választott szín jelenik meg!</div>
        <div className="grid-1-1">
          {
            fabrics.slice(0, MAX_FABRICS_LENGTH).map(f => (
              <div className="col-1-7" key={f.image}>
                <div
                  title={f.title}
                  className="ratio embed border border-gray"
                  style={{
                    backgroundColor: f.colorHex,
                    backgroundImage: `url(http://kontakt.rs.hu/gyartoi_szinmintak/upload/${f.image})`,
                  }}
                />
              </div>
            ))
            .concat([(
              <div className="col-1-7 v-center h-center">
                {`+ ${fabrics.length - MAX_FABRICS_LENGTH}`}
              </div>
            )])
          }
        </div>
        <hr />
        <div>+/-</div>
      </div>
    </div>
  );
};

/**
 * defaultProps
 * @type {Object}
 */
Product.defaultProps =
{
  flag: [],
  dimension: {},
  price_discount: 0,
  price_orig: 0,
  price_orig_gross: 0,
  price_sale: 0,
  price_sale_gross: 0,
  vat: 0,
};

Product.contextTypes =
{
  register: PropTypes.object,
};


export default Product;
