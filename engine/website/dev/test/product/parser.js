
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import { parse } from '../../src/components/product/const';
import { PRODUCTS, HELPERS } from './const';

deepFreeze(PRODUCTS);
deepFreeze(HELPERS);

describe('Product › parsers', () =>
{
  it('parseFlag', () =>
  {
    expect(parse.flag(PRODUCTS[0], HELPERS.flags).length).to.equal(PRODUCTS[0].flag.length);

    // empty product flag
    expect(parse.flag({ flag: [] }, HELPERS.flags)).to.be.an('array');

    // wrong product flag
    expect(parse.flag({ flag: '' }, HELPERS.flags)).to.be.an('array');
    expect(parse.flag({ flag: undefined }, HELPERS.flags)).to.be.an('array');
    expect(parse.flag({}, HELPERS.flags)).to.be.an('array');

    // wrong helper
    expect(parse.flag(PRODUCTS[0], [])).to.deep.equal([]);
    expect(parse.flag(PRODUCTS[0], undefined)).to.deep.equal([]);
    expect(parse.flag(PRODUCTS[0], null)).to.deep.equal([]);
  });

  it('parseFeatures', () =>
  {
    // console.log(parse.features(PRODUCTS[0], HELPERS.flags));
    // expect(parse.flag(PRODUCTS[0], HELPERS.flags).length).to.equal(PRODUCTS[0].flag.length);

    // empty product flag
    expect(parse.features({ features: {} }, HELPERS.flags)).to.deep.equal([]);

    // wrong product feature
    expect(parse.features({ features: '' }, HELPERS.flags)).to.deep.equal([]);
    expect(parse.features({ features: undefined }, HELPERS.flags)).to.deep.equal([]);
    expect(parse.features({ }, HELPERS.flags)).to.deep.equal([]);

    // wrong helper
    expect(parse.features(PRODUCTS[0], [])).to.deep.equal([]);
    expect(parse.features(PRODUCTS[0], undefined)).to.deep.equal([]);
    expect(parse.features(PRODUCTS[0], null)).to.deep.equal([]);
  });

  it('parseFabrics', () =>
  {
    console.log(parse.fabrics(PRODUCTS[0], HELPERS.fabrics));
    // expect(parse.fabrics(PRODUCTS[0], HELPERS.fabricss).length).to.equal(PRODUCTS[0].fabrics.length);

    // empty product fabrics
    // expect(parse.fabrics({ fabrics: {} }, HELPERS.fabrics)).to.deep.equal([]);
    //
    // // wrong product feature
    // expect(parse.fabrics({ fabrics: '' }, HELPERS.fabrics)).to.deep.equal([]);
    // expect(parse.fabrics({ fabrics: undefined }, HELPERS.fabrics)).to.deep.equal([]);
    // expect(parse.fabrics({ }, HELPERS.fabrics)).to.deep.equal([]);
    //
    // // wrong helper
    // expect(parse.fabrics(PRODUCTS[0], [])).to.deep.equal([]);
    // expect(parse.fabrics(PRODUCTS[0], undefined)).to.deep.equal([]);
    // expect(parse.fabrics(PRODUCTS[0], null)).to.deep.equal([]);
  });
});
