import React from 'react';
import PropTypes from 'prop-types';
import { roundIntegerCeil, roundDecimal } from '@1studio/utils/math/round';

import { setValues, flush } from '../../../src/form/actions';


import Form,
{
  Input,
}
from '../../../src/form/pure';

import Connect from '../../../src/form/connect';



const price = {
  purchaseGross: 70000,
  origGross: 100000,
  discount: 10,
  saleGross: 90000,
};


/**
 * [calcDiscounts description]
 * @param  {object} discounts { discount, discountManufacturePurchase }
 * @return {object}           discounts
 */
const calcDiscounts = ({ discount, discountManufacturePurchase }) =>
{
  discountManufacturePurchase = discountManufacturePurchase || 0;

  const discountManufactureGross =
    price.purchaseGross * parseFloat(discountManufacturePurchase) / 100;

  const discountManufacture =
      100 - (price.saleGross - discountManufactureGross) / price.saleGross * 100;

  discount = (!discount || discount < discountManufacture) ?
    discountManufacture : discount;


  const discountGross = roundIntegerCeil(price.saleGross * parseFloat(discount) / 100, 100);
  const priceSaleGross = price.saleGross - discountGross;


  const discountRetail = discount - discountManufacture;

  return ({
    discount: roundDecimal(discount, 100),
    discountGross,
    discountRetail: roundDecimal(discountRetail, 100),
    discountManufacture: roundDecimal(discountManufacture, 100),
    discountManufacturePurchase: roundDecimal(discountManufacturePurchase, 100),
    discountManufactureGross,
    priceSaleGross,
  });
}






const Summary = ({ discountGross, discountManufacturePurchase }) =>
{
  const finalSaleGross = price.saleGross - discountGross;
  const finalDiscount = 100 - (finalSaleGross / price.saleGross) * 100;


  return (
    <div className="col-1-2">
      <div className="pb-1 light">{`discountGross: ${discountGross}`}</div>
      <div className="pb-1 light">{`finalSaleGross: ${finalSaleGross}`}</div>
      <div className="pb-1 light">{`finalDiscount: ${finalDiscount}`}</div>
    </div>
  )
};




const Example = (props, { store }) =>
{
  const calculate = ({ form, id, value }) =>
  {
    const state = { ...store.getState().form[form] };

    state[id] = value || 0;

    const { discountGross, discountRetail, discountManufacture } = state;

    let discount = state.discount || 0;
    let discountManufacturePurchase = state.discountManufacturePurchase || 0;


    switch (id)
    {
      case 'discountGross':
      {
        discount = 100 - (price.saleGross - discountGross) / price.saleGross * 100;
        break;
      }

      case 'discountRetail':
      {
        const discountManufactureGross =
          price.purchaseGross * parseFloat(discountManufacturePurchase) / 100;

        const discountManufacture =
          100 - (price.saleGross - discountManufactureGross) / price.saleGross * 100;


        const totalDiscount = parseFloat(discountRetail) + parseFloat(discountManufacture);

        if (discount < totalDiscount)
        {
          discount = totalDiscount;
        }
        else
        {
          const discountManufacture = discount - discountRetail;
          const discountManufactureGross = price.saleGross * (discountManufacture / 100);

          discountManufacturePurchase =
            100 - (price.purchaseGross - discountManufactureGross) / price.purchaseGross * 100;
        }
        break;
      }

      case 'discountManufacture':
      {
        const discountManufactureGross = price.saleGross * (discountManufacture / 100);

        discountManufacturePurchase =
          100 - (price.purchaseGross - discountManufactureGross) / price.purchaseGross * 100;


        if (discount < discountManufacture)
        {
          discount = discountManufacture;
        }

        break;
      }

      default:
        break;
    }

    return calcDiscounts({ discount, discountManufacturePurchase });
  };





  const onChangeInputHandler = ({ form, id, value }) =>
  {
    const state = calculate({ form, id, value });
    store.dispatch(setValues(state, form));
  }

  const dimensionKeys = ['w', 'h', 'd'];

  return (
    <div>
      <Form
        id="example"
        className="card p-2"
      >
        <h2>Connect</h2>

        <Input
          label="Classic Field"
          id="input"
          placeholder="..."
        />
        <Connect
          UI={({ input }) => <div className="text-blue text-xl">{input}</div>}
        />

        <h2>onChangeHandler => parse string to custom JSON</h2>

        <Input
          id="input2"
          label="string"
          value="12/12x121*22"
          onChange={({ form, id, value }) => {

            const regex = /^([0-9\/]+)[*x]([0-9\/]+)[*x]?([0-9\/]+)?$/;

            const output2 = {};

            (regex.exec(value) || [])
              .slice(1)
              .forEach((v, n) =>
                (v || '')
                  .split('/')
                  .forEach((v0, i) => output2[`${dimensionKeys[n]}${(i ? i + 1 : '')}`] = v0))

            store.dispatch(setValues({
              [id]: value,
              output2: JSON.stringify(output2)
            }, form))
          }}
        />

        <Input
          label="parsed json"
          id="output2"
          onChange={({ form, id, value }) =>
          {
            const jsonValue = JSON.parse(value);

            const input2 = dimensionKeys.map(dimensionKey =>
              [jsonValue[dimensionKey],jsonValue[dimensionKey + 2]]
                .filter(v => v)
                .join('/')
              || 0
            )
              .join('x');

            store.dispatch(setValues({
              [id]: value,
              input2,
            }, form))
          }}
        />

        <h2>onChangeHandler</h2>



        <div className="grid-2">

          <div className="col-1-2">
            <div className="pb-1 light">{`pricePurchaseGross: ${price.purchaseGross}`}</div>
            <div className="pb-1 light">{`priceOrigGross: ${price.origGross}`}</div>
            <div className="pb-1 light">{`priceDiscount: ${price.discount}`}</div>
            <div className="pb-4 ">{`priceSaleGross: ${price.saleGross}`}</div>
          </div>

          <Connect
            UI={Summary}
          />

          <div className="col-1-3">
            <Input
              id="discount"
              label="New discount percent"
              type="number"
              postfix="%"
              onChange={onChangeInputHandler}
              // onBlur={onChangeInputHandler}
            />
          </div>

          <div className="col-1-3">
            <Input
              id="discountGross"
              label="New discount amount"
              type="number"
              postfix="₿"
              // disabled
              onBlur={onChangeInputHandler}
            />
          </div>

          <div className="col-1-3 col-br">
            <Input
              id="priceSaleGross"
              label="Final Price"
              type="number"
              postfix="₿"
              disabled
              onBlur={onChangeInputHandler}
            />
          </div>

          <div className="col-1-3">
            <Input
              id="discountRetail"
              label="Retail sale discount"
              type="number"
              postfix="%"
              onBlur={onChangeInputHandler}
              />
          </div>

          <div className="col-1-3">
            <Input
              id="discountManufacturePurchase"
              label="Manufacturer purchase discount"
              type="number"
              postfix="%"
              onChange={onChangeInputHandler}
            />
          </div>

          <div className="col-1-3">
            <Input
              id="discountManufacture"
              label="Manufacturer discount"
              type="number"
              postfix="%"
              onBlur={onChangeInputHandler}
              />
          </div>


        </div>




        <div
          className="light underline text-gray pointer text-s inline-block"
          onClick={() => store.dispatch(flush('example'))}
        >
          Reset
        </div>




      </Form>
    </div>
  );
}

Example.contextTypes =
{
  store: PropTypes.object,
}

export default Example;
