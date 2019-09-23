
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import wordWrap from '@1studio/utils/string/wordWrap';
// import forEach from 'lodash/forEach';
import { concatMultipleFormRecords } from '@1studio/ui/view/form';
import { FormattedNumber } from 'react-intl';
import trim from 'lodash/trim';


/* !- React Actions */

import * as FormActions from '@1studio/ui/form/actions';
import * as LayerActions from '@1studio/ui/layer/actions';
import * as GridActions from '@1studio/ui/grid/actions';


/* !- React Elements */

import IconSave from '@1studio/ui/icon/mui/action/done';

import Form from '@1studio/ui/form/form';
import Connect from '@1studio/ui/form/connect';

import {
  Plain,
  Input,
  Textarea,
  Submit,
  Select,
  Toggle,
  Checkbox,
  Dropdown,
  Dropzone,
} from '@1studio/ui/form/pure/intl';
// } from '@1studio/ui/form/pure/intl';

import { File, formatDropzoneFileId } from '@1studio/ui/form/pure/dropzone';

import Product, { ProductCard } from '../../components/product';
import Features from '../../components/formFieldFeatures';


/* !- Constants */

import { FIELDS, SCHEME, EDITABLE_FLAGS, IMAGE_URL } from './const';


/**
 * Submit button
 * @param {[type]} onClick [description]
 */
const SubmitButton = ({ onClick }) =>
(
  <div className="pin-br w-auto column center p-3 py-2">
    <button className="action large red shadow mt-1/2" onClick={onClick}><IconSave /></button>
  </div>
);


/**
* ProductForm Component
*/
const ProductForm = ({
  id,
  related_id,
  brand,
  flag,
  title,
  subtitle,
  title_orig,
  title_orig_rest,
  color,
  vat,
  price_orig,
  price_orig_gross,
  price_sale,
  price_sale_gross,
  price_discount,
  price_installation,
  manufacturer,
  category,
  features,
  dimension,
  images,
  instore,
  incart,
  description,
  setValues,
  modifyRecord,
  close,
},
{
  register,
  // store,
}) =>
{
  if (!id)
  {
    return <div className="title hidden-all">Válasz egy terméket.</div>;
  }

  const isOne = !Array.isArray(id);

  const formatedTitle = isOne ? `${brand} ${title}` : `${id.length} termék`;
  const formatedSubtitle = isOne ? subtitle : '';
  const formatedId = isOne ? id : wordWrap(id.join(', '), 100).split('\n')[0];

  const flags = register.data.product ? register.data.product.flags : [];
  const flagData = flags.filter(flag => EDITABLE_FLAGS.indexOf(flag.id) !== -1);

  const imageSizes = [
    { size: '36x36' },
    { size: '250x250' },
    { size: '640x480' },
  ];

  return (
    <Form
      id="product"
      fields={FIELDS}
      flush={false}
      onSuccess={({ records }) =>
      {
        if (!Array.isArray(records))
        {
          records = [records];
        }

        records.forEach((record) =>
        {
          modifyRecord(record, 'product'); // update grid
        });

        setValues(concatMultipleFormRecords(records), 'product'); // update form

        close();
      }}
    >
      <div className="product grid-4 nowrap">
        <div className="grow w-auto block">
          <div className="mb-2 text-s">
            <Dropzone
              url={`/api/v3/file/upload?resize=${JSON.stringify(imageSizes)}`}
              maxFilesSize={10}
              id="images"
              format={formatDropzoneFileId}
            />
            {/*<span className="bold pr-1/2">{parseCategory(category, helper.categories).title}:</span>*/}
            {/*<span>Otthon &rsaquo; Nappali bútorok &rsaquo; Szekrények</span>*/}
          </div>
          { isOne &&
            <div
              className="image"
              style={
                images ?
                {
                  backgroundImage: `url(${new File({ id: images[0] }).getThumbnail()})`,
                }
                :
                {
                  filter: 'grayscale(100%)',
                  opacity: '0.2',
                  backgroundImage: 'url(/images/logo.svg)',
                }
              }
            />
          }

          { isOne &&
          <fieldset>
            <div className="mb-1 heavy zoom-1.1">Leírás</div>
            <Textarea {...FIELDS.description} />
            <Plain
              id="features_orig"
              dangerouslySetInnerHTML
              stateFormat={value => Array.isArray(value) ? '...' :
                value
                  .split(',')
                  .map(feature => `- ${trim(feature)}`)
                  .join('<br>')
              }
            />
            <hr />
          </fieldset>
          }
        </div>


        {/* !- RIGHT */}

        <div className="p-0 mobile:order--1 desktop:w-35" style={{ minWidth: '35rem' }}>
          <div className="mb-1 light"><span className="bold">Cikkszám:</span> {formatedId}</div>
          <Input {...FIELDS.relatedId} />
          { isOne &&
            <div className="light text-gray text-xs pb-1/2">{title_orig}</div>
          }
          <div className="mb-1 text-l bold">{formatedTitle}</div>
          { isOne &&
          <div className="light">{formatedSubtitle}</div>
          }
          <hr />
          { isOne &&
          <div className="mb-1 text-s light">
            <span className="bold">Méret: </span>
            <span>{dimension.w || '-'} x {dimension.h || '-'} x {dimension.d || '-'} cm</span>
          </div>
          }
          <hr />
          { isOne &&
          <fieldset>
            <div className="mb-1/2">
              { parseInt(price_discount) > 0 &&
              <div className="h-center">
                <div className="text-s bold text-gray strikethrough">
                  <FormattedNumber
                    value={price_orig_gross}
                    style="currency"
                    currency="HUF"
                    minimumFractionDigits={0}
                  />
                </div>
                <div className="tag mx-1 red bold">-{price_discount}%</div>
              </div>
              }
            </div>
            <div className="text-xxl bold">
              <FormattedNumber
                value={price_sale_gross}
                style="currency"
                currency="HUF"
                minimumFractionDigits={0}
              />
            </div>
            <hr />
          </fieldset>
          }
          { isOne &&
          <fieldset>
            <span className="bold">Szín csoport: </span>
            <span>{color}</span>
          </fieldset>
          }
          <hr />
          { isOne &&
          <fieldset>
            <Toggle {...FIELDS.instore} />
            <Toggle {...FIELDS.incart} />
          </fieldset>
          }
          {/*<Input {...FIELDS.priority} />*/}

        </div>
      </div>


      {/* !- Címkék */}

      <fieldset>
        <div className="mb-1 heavy zoom-1.1">Kiemelt tulajdonságok</div>
        <div className="grid-2">
          <Checkbox {...FIELDS.flag} data={flagData} className="col-1-2" />
          <div className="col-1-2">
            <Plain
              id="flag"
              dangerouslySetInnerHTML
              stateFormat={value => Array.isArray(value) &&
                value
                  .filter(flagId => EDITABLE_FLAGS.indexOf(flagId) === -1)
                  .map(flagId => `- ${(flags.find(flag => flag.id === flagId) || {}).title}`)
                  .join('<br>')
              }
            />
          </div>
        </div>
        <hr />
      </fieldset>

      {/* !- Kategória */}

      { isOne &&
      <fieldset>
        <div className="section">
          <span>Kategória</span>
        </div>

        <Select
          {...FIELDS.category}
          data={register.data.product ? register.data.product.categories : []}
        />

        {/*
          csoportos szerkesztésnél,
          mi van ha csak egy features változik, pl hozzáadom hogy pácolt
        */}
        <Connect
          UI={Features}
        />

      </fieldset>
      }

      {/*<fieldset>
        <hr />
        <Input
          {...FIELDS.price_installation}
          postfix={(
            <Dropdown
              id="price_installation_postfix"
              data={[
                { id: '0', title: 'Ft' },
                { id: '1', title: '%' },
              ]}
            />
          )}
        />
      </fieldset>*/}

      <Submit><SubmitButton /></Submit>

    </Form>
  );
};


ProductForm.defaultProps =
{
  ...Product.defaultProps,
};

ProductForm.contextTypes =
{
  store: PropTypes.object,
  register: PropTypes.object,
};

export default connect(
  ({ form }, { id }) =>
  form[id],
  {
    setValues: FormActions.setValues,
    close: LayerActions.close,
    modifyRecord: GridActions.modifyRecord,
  },
)(ProductForm);
