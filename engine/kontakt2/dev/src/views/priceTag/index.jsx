
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import trim from 'lodash/trim';
import wordWrap from '@1studio/utils/string/wordWrap';

import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import blobStream from 'blob-stream';
import request from 'superagent';


/* !- Redux Actions */

import { CAROUSSEL_SETTINGS } from '@1studio/ui/caroussel/';
import * as GridActions from '@1studio/ui/grid/actions';
import * as LayerActions from '@1studio/ui/layer/actions';
import * as FormActions from '@1studio/ui/form/actions';


/* !- React Elements */

import NestedList from '@1studio/ui/grid/pure/nestedList';
import Connect from '@1studio/ui/grid/connect';

import Caroussel from './caroussel';
import Stock from './gridStock';

import ListGroup from './listGroup';
import ListItem from './listItem';

import IconPlus from '@1studio/ui/icon/mui/content/add';
import IconDelete from '@1studio/ui/icon/mui/content/remove';
import IconDuplicate from '@1studio/ui/icon/mui/content/create';


/* !- Constants */

const sampleItems = [
  {
    id: 1,
    type: 'A6OneProduct',
    props: {
      brand: 'ANGELO',
      product: 'KANAPÉÁGY BARNA+B.ZSÁK',
      dimension: '200x95/152x200 cm',
      description: wordWrap('rugós ülő- és kombinált fekvőfelület, ágyneműtartós', 30).split('\n'),
      price: '1 139 990,-',
      oldPrice: '1 159 990,-',
      discount: '-12%',
      sku: 'K3218801',
    },
  },
  {
    id: 2,
    type: 'A6OneProduct',
    props: {
      brand: 'ANGELO',
      product: 'KANAPÉÁGY BARNA+B.ZSÁK',
      dimension: '200x95/152x200 cm',
      description: wordWrap('rugós ülő- és kombinált fekvőfelület, ágyneműtartós', 30).split('\n'),
      price: '1 139 990,-',
      oldPrice: '1 159 990,-',
      discount: '-12%',
      sku: 'K3218801',
    },
  },
  {
    id: 3,
    type: 'A6OneProduct',
    props: {
      brand: 'ANGELO',
      product: 'KANAPÉÁGY BARNA+B.ZSÁK',
      dimension: '200x95/152x200 cm',
      description: wordWrap('rugós ülő- és kombinált fekvőfelület, ágyneműtartós', 30).split('\n'),
      price: '1 139 990,-',
      oldPrice: '1 159 990,-',
      discount: '-12%',
      sku: 'K3218801',
    },
  },
  {
    id: 4,
    type: 'A6OneProduct',
    props: {
      brand: 'ANGELO',
      product: 'KANAPÉÁGY BARNA+B.ZSÁK',
      dimension: '200x95/152x200 cm',
      description: wordWrap('rugós ülő- és kombinált fekvőfelület, ágyneműtartós', 30).split('\n'),
      price: '1 139 990,-',
      oldPrice: '1 159 990,-',
      discount: '-12%',
      sku: 'K3218801',
    },
  },
  {
    id: 5,
    type: 'A6OneProduct',
    props: {
      brand: 'ANGELO',
      product: 'KANAPÉÁGY BARNA+B.ZSÁK',
      dimension: '200x95/152x200 cm',
      description: wordWrap('rugós ülő- és kombinált fekvőfelület, ágyneműtartós', 30).split('\n'),
      price: '1 139 990,-',
      oldPrice: '1 159 990,-',
      discount: '-12%',
      sku: 'K3218801',
    },
  },
];


/**
* PriceTag Component
*/
class PriceTag extends Component
{
  // componentWillMount()
  // {
  //   this.context.store.dispatch(GridActions.setData(sampleItems, CAROUSSEL_SETTINGS, 'priceTag'));
  // }

  /* !- Handlers */

  /**
   * Remove current priceTag
   */
  onClickDeleteHandler = () =>
  {
    const grid = this.context.store.getState().grid.priceTag;

    // remove item
    this.context.store.dispatch(GridActions.removeRecord(
      { id: grid.data[0].id },
      'priceTag',
    ));

    // go to next item
    this.context.store.dispatch(GridActions.goToPage(grid.page, 'priceTag'));
  }

  /**
   * Duplicate current priceTag
   */
  onClickDuplicateHandler = () =>
  {
    const grid = this.context.store.getState().grid.priceTag;

    this.context.store.dispatch(GridActions.addRecord(
      { ...grid.data[0], id: grid.totalPage },
      'priceTag',
      grid.page,
    ));

    // go to new item
    this.context.store.dispatch(GridActions.goToPage(grid.page + 1, 'priceTag'));
  }

  /**
   * Create new priceTag
   */
  onClickCreateHandler = () =>
  {
    this.showStock();
  }





  /**
   * Udpate grid record
   * Close layer
   * @param  {object} record selected grid record
   * @todo find grid record index from paginate
   */
  onClickStockRecordHandler = (record) =>
  {
    const item = this.context.store.getState().grid.priceTag.data[0];

    this.context.store.dispatch(
      GridActions.modifyRecord(
        {
          ...item,
          props: this.convertStockRecordToSVGProps(record),
        },
        'priceTag',
      ),
    );

    this.context.store.dispatch(
      LayerActions.close(),
    );
  }

  /**
   * Show stock on layer
   * Set search input value
   * @todo search input flush
   */
  onClickPriceTagHandler = () =>
  {
    const item = this.context.store.getState().grid.priceTag.data[0];

    this.context.store.dispatch(
      LayerActions.dialog(
        <Stock
          // onClick={this.onClickStockRecordHandler}
          onClick={this.addNewItemToGridHandler}
          filters={{ search: item.props.brand }}
        />,
    ));



    // this.context.store.dispatch(FormActions.setValues({ id: 'search', value: item.props.brand }));
    // this.context.store.dispatch(GridActions.applyFilter('search', item.props.brand, 'priceTag'));
  }

  /* !- Helper */

  /**
   * Convert grid record to SVG props format
   * @param  {object} record { brand, description, dimension, price ... }
   * @return {object}        formatted record
   */
  convertStockRecordToSVGProps = (record) =>
  {
    const description = wordWrap(trim(record.j), 30).split('\n');
    const name = trim(record.m);
    const brandIndex = name.indexOf(' ');

    return ({
      brand: name.substr(0, brandIndex).toUpperCase(),
      product: name.substr(brandIndex + 1),
      description,
      // dimension: "200x95/152x200 cm"
      dimension: record.d,
      discount: this.props.intl.formatNumber(
        parseInt(((record.a1 / record.a0) - 1) * 100) / 100,
        { style: 'percent' },
      ),
      oldPrice: `${this.props.intl.formatNumber(record.a0)},-`,
      // oldPrice: "159 990,-"
      price: `${this.props.intl.formatNumber(record.a1)},-`,
      // price: "139 990,-"
      sku: record.id,
      // sku: "K3218801"
    });
  }

  showStock = () =>
  {
    this.context.store.dispatch(
      LayerActions.dialog(
        <Stock
          onClick={this.addRecords}
        />,
    ));
  }

  addRecords = (records) =>
  {
    records.forEach(record =>
      this.context.store.dispatch(
        GridActions.addRecord(
          {
            // id: record.id,
            type: 'A6OneProduct',
            props: this.convertStockRecordToSVGProps(record),
          },
          'priceTag',
        )),
    );
  }

  print = () =>
  {
    const doc = new PDFDocument({
      size: [595, 842],
      margin: 0,
    });
    const stream = doc.pipe(blobStream());

    Promise.all([
      request
        .get('/fonts/Roboto/Roboto-Regular.ttf')
        .responseType('arraybuffer'),
      request
        .get('/fonts/Roboto/Roboto-Bold.ttf')
        .responseType('arraybuffer'),
    ]).then((response) =>
    {
      doc.registerFont('Roboto-Regular', response[0].body);
      doc.registerFont('Roboto-Bold', response[1].body);

      const svgs = document.querySelectorAll('.slides svg'); // Use all the svg drawings on the page

      for (let i = 0; i < svgs.length; i += 1)
      {
        SVGtoPDF(
          doc,
          svgs[i].outerHTML || svgs[i],
          (595 / 2) * (i % 2),
          (842 / 2) * +((i % 4) > 1),
          {
            width: 595 / 2,
            height: 842 / 2,
            preserveAspectRatio: 'xMinYMin',
            fontCallback: (family, bold) =>
            {
              if (bold)
              {
                return 'Roboto-Bold';
              }

              return 'Roboto-Regular';
            },
          },
        );

        if (i && (i + 1) % 4 === 0 && i !== svgs.length - 1)
        {
          doc.addPage();
        }
      }

      doc.end();

      stream.on('finish', () =>
      {
        const url = stream.toBlobURL('application/pdf');
        window.open(url);
      });
    });
  }


  render()
  {
    return (
      <div id="priceTag" className="table">

        <div className="w-16 pr-4 border-right border-gray-light">

          <Connect
            id="priceTag"
            UI={NestedList}
            uiProps={{
              groupBy: ['id'],
              UI: [ListGroup, ListItem],
              className: 'slidebar',
            }}
            listen="rawData"
          />

          <div className="absolute pin-b">
            <button onClick={this.showStock}>add new</button>
            <button onClick={this.print}>print</button>
          </div>

        </div>

        <div className="w-auto pl-4">

          <Caroussel
            onClick={this.onClickPriceTagHandler}
          />

        </div>

        <div className="buttons action">
          <button onClick={this.onClickDeleteHandler}><IconDelete /></button>
          <button onClick={this.onClickDuplicateHandler}><IconDuplicate /></button>
          <button onClick={this.onClickCreateHandler}><IconPlus /></button>
        </div>

      </div>
    );
  }
}


export default injectIntl(PriceTag);

PriceTag.contextTypes =
{
  store: PropTypes.object,
};
