import React from 'react';
import PropTypes from "prop-types";
import { injectIntl } from 'react-intl';

const Price = ({
  price,
  oldPrice,
  discount,
}) =>
{
  if (discount === '0%')
  {
    return <text x="129" y="1201" fontSize="126px" fill="#3b3b3b" style={{ fontWeight: 'bold' }} className="editable">{price}</text>;
  }

  const diff = Math.max(price.length, oldPrice.length) * 40;

  return (
    <g>
      {/* discount background rectangle */}
      <path fill="#3b3b3b" d={`M${140 + diff} 950H${365 + diff}a28.73 28.73 0 0 1 20 8s5 9.3 5 19v104H${140 + diff}V950z`} className="editable" style={{ transform: 'translateX(0px)' }} />

      {/* price background frame */}
      <rect x="94" y="950" width={300 + diff} height="300" rx="30" ry="30" stroke="#3b3b3b" strokeWidth="10px" fill="none" />

      {/* background separator */}
      <line x1="90" y1="1080" x2={398 + diff} y2="1080" stroke="#3b3b3b" strokeWidth="4px" />

      <text x={`${120 + (diff / 2)}`} y="1047" fontSize="72px" fill="#3b3b3b" textAnchor="middle" style={{ fontWeight: 'bold', textDecoration: 'line-through' }} className="editable">{oldPrice}</text>
      <text x={`${265 + diff}`} y="1047" fontSize="72px" textAnchor="middle" fill="white" style={{ fontWeight: 'bold', fill: 'white' }}>{discount}</text>

      <text x={`${245 + (diff / 2)}`} y="1210" fontSize="126px" textAnchor="middle" fill="#3b3b3b" style={{ fontWeight: 'bold' }} className="editable">{price}</text>
    </g>
  );
};


const A6OneProduct = ({
  brand,
  product,
  dimension,
  description,
  price,
  oldPrice,
  discount,
  sku,
  width,
  height,
  onClick,
  intl,
}) =>
(
  <svg width={width} height={height} viewBox="0 0 1205 1748" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" >

    <rect x="0" y="0" width="1205" height="1748" fill="white" className="onClick" onClick={onClick} />

    <text x="90" y="200" fontSize="146px" fill="#3b3b3b" style={{ fontWeight: 'bold' }} className="editable">
      {brand}
    </text>

    <text x="90" y="335" fontSize="62.5px" fill="#3b3b3b" className="editable" >
      {product}
    </text>

    {/* line separator */}
    <rect x="94" y="404" width="1017" height="2" fill="#433f3c" />

    <text x="90" y="464" fontSize="50px" fill="#3b3b3b" >
      {intl.formatMessage({ id: 'priceTag.dimension' })}:
    </text>
    <text x="390" y="464" fontSize="50px" fill="#3b3b3b" className="editable" >
      {dimension}
    </text>

    {/* line separator */}
    <rect x="94" y="487" width="1017" height="2" fill="#433f3c" />

    <text x="90" y="547" fontSize="50px" fill="#3b3b3b" >
      {intl.formatMessage({ id: 'priceTag.description' })}:
    </text>

    <text x="390" y="547" fontSize="50px" className="editable">
      {
        description.map((desc, index) =>
          <tspan x="390" dy={index * 60} key={index}>{desc}</tspan>
        )
      }
    </text>

    {/* line separator */}
    <rect x="94" y={522 + (description.length * 60)} width="1017" height="2" fill="#433f3c" />

    <Price
      price={price}
      oldPrice={oldPrice}
      discount={discount}
    />

    {/* line separator */}
    <rect x="94" y="1372" width="1018" height="2" fill="#433f3c" />

    <text x="96" y="1423" fontSize="36px" fill="#3b3b3b" >
      A kiállított bútor a feltüntetett áron megvásárolható és azonnal
      <tspan x="96" dy="43">szállítható. Más színben és összeállításban is megrendelhető.</tspan>
    </text>

    {/* line separator */}
    <rect x="94" y="1489" width="1018" height="2" fill="#433f3c" />

    <text x="94" y="1548" fontSize="36px" fill="#3b3b3b">
      {intl.formatMessage({ id: 'priceTag.caption.dimension' })}
      <tspan x="94" dy="43">{intl.formatMessage({ id: 'priceTag.caption.price' })}</tspan>
    </text>

    <text x="94" y="1654" fontSize="36px" fill="#3b3b3b" className="editable">
      <tspan>{intl.formatMessage({ id: 'priceTag.sku' })}:</tspan>
      <tspan dx="6">{ sku }</tspan>
    </text>
  </svg>
);

A6OneProduct.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  brand: PropTypes.string,
  product: PropTypes.string,
  dimension: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.string,
  oldPrice: PropTypes.string,
  discount: PropTypes.string,
  sku: PropTypes.string,
};

A6OneProduct.defaultProps = {
  width: 595,
  height: 842,
  brand: 'MÁRKA',
  product: 'TERMÉK',
  dimension: '100x50cm',
  description: '',
  price: '100,-',
  oldPrice: '111,-',
  discount: '-10%',
  sku: '00000000',
};

export default injectIntl(A6OneProduct);
