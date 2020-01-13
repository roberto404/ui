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
      id: "4417",
      lead: null,
      mimeMajor: "image",
      mimeMinor: "jpeg",
      name: "446c343e0b367cb93bb7708dadc490e9",
      path: "44/6c/34/3e/",
      size: 1211227,
      title: "1889x980_1562763951.655_5d25e24f68dac.jpg",
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
      id: "4418",
      lead: null,
      mimeMajor: "image",
      mimeMinor: "jpeg",
      name: "5210f707ea17395605956cb6cf231054",
      path: "52/10/f7/07/",
      size: 589829,
      title: "1199x592_1562834870.7695_5d26f744de1ea.jpg",
      // markers: [
      //   {
      //     category: 'heading',
      //     position: [50, 50],
      //     settings: 'Második',
      //   },
      // ],
    }],
  }, 'example'));

  return (
    <Form
      id="example"
    >
      <Dropzone
        url={`/api/v3/file/upload?resize=${JSON.stringify(imageSizes)}`}
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
