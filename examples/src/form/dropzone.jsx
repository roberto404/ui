import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Form,
{
  Dropzone
}
from '../../../src/form/pure/intl';

import IconFavorite from '../../../src/icon/mui/action/favorite';

import { setValues } from '../../../src/form/actions';
import FileList from '../../../src/form/pure/dropzoneFileList';
import Editor from '../../../src/form/pure/dropzoneImageEditor';
import Preview from '../../../src/form/pure/dropzoneImagePreview';
// import Editor from '../../../src/form/pure/dropzoneCardEditor';
// import Preview from '../../../src/form/pure/dropzoneCardPreview';



/* !- Constants */

const imageSizes = [
  { size: '36x36' },
  { size: '250x250' },
  { size: '640x480' },
];


const Example = (props, { store }) =>
{
  store.dispatch(setValues({
    images: [{
      ext: "jpg",
      id: "879",
      // markers: [
      //   {
      //     category: 'heading',
      //     position: [50, 50],
      //     settings: 'Második',
      //   },
      // ],
    },{
      ext: "jpg",
      id: "8800",
      // markers: [
      //   {
      //     category: 'heading',
      //     position: [0, 100],
      //     settings: 'Nappali bútorok',
      //   },
      //   {
      //     category: 'tooltip',
      //     position: [17, 36],
      //     settings: 'Nem eladó!',
      //   },
      //   {
      //     category: 'product',
      //     position: [50, 50],
      //     settings: 'sku',
      //   },
      // ],
    },{
      ext: "jpg",
      id: "8802",
    }],
  }, 'example'));

  return (
    <Form
      id="example"
    >
      <h2>Default file preview/editor</h2>
      <Dropzone
        url={`http://localhost/api/v3/file/upload?resize=${JSON.stringify(imageSizes)}`}
        maxFilesSize={10}
        id="images"
      />

      <h2>Custom file preview/editor</h2>
      <Dropzone
        url={`http://localhost/api/v3/file/upload?resize=${JSON.stringify(imageSizes)}`}
        maxFilesSize={10}
        id="images"
      >
        <FileList
          preview={Preview}
          editor={Editor}
        />
      </Dropzone>
    </Form>
  )
};

Example.contextTypes = {
  store: PropTypes.object,
};

export default Example;
