import React from 'react';
import PropTypes from 'prop-types';

import Form,
{
  Dropzone
}
  from '@1studio/ui/form/intl';

import IconFavorite from '@1studio/ui/icon/mui/action/favorite';

import { setValues } from '@1studio/ui/form//actions';
import FileList from '@1studio/ui/form/components/dropzoneFileList';

import DefaultPreview from '@1studio/ui/form/components/dropzoneFileListPreview';
import DefaultPreviewItem from '@1studio/ui/grid/components/gridRows/filelist';
import DefaultEditor from '@1studio/ui/form/components/dropzoneCardEditor';

import Editor from '@1studio/ui/form/components/dropzoneImageEditor';
import Preview from '@1studio/ui/form/components/dropzoneImagePreview';
import { useDispatch } from 'react-redux';


/* !- Constants */

const Sidebar = ({
  id,
  status,
  onChange,
}) => {
  return (
    <div style={{ minWidth: 600 }}>
      <input
        value={title}
        id="title"
        onChange={onChange}
        placeholder="Title"
        className="mb-1"
      />
      <select
        value={title}
        id="status"
        onChange={onChange}
        className="mb-1"
      >
        <option value="0">inactive</option>
        <option value="1">active</option>
      </select>
    </div>
  )
}

const imageSizes = [
  { size: '36x36' },
  { size: '250x250' },
  { size: '640x480' },
];


const Example = () => {

  const dispatch = useDispatch();

  dispatch(setValues({
    images: [{
      ext: "jpg",
      id: "8800",
      // markers: [
      //   {
      //     category: 'heading',
      //     position: [50, 50],
      //     settings: 'Második',
      //   },
      // ],
      title: 'A',
      status: 0,
    }, {
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
    }, {
      ext: "jpg",
      id: "8800",
      title: 'B',
      status: 1,
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
        editorProps={{
          className: 'card shadow-outer-2',
        }}
        placeholder="upload"
      />

      <h2>Custom: Default</h2>
      <Dropzone
        url={`http://localhost/api/v3/file/upload?resize=${JSON.stringify(imageSizes)}`}
        maxFilesSize={10}
        id="images"
      >
        <FileList
          draggable={false}
          preview={DefaultPreview}
          previewProps={{
            element: (props) => (
              <div className="relative">
                {props.data.status !== undefined && parseInt(props.data.status) === 0 &&
                  <div className="absolute bg-black p-1/2 no-events" style={{ zIndex: 1, bottom: '4rem', right: '2rem' }}>
                    <IconFavorite className="w-2 h-2 fill-white" />
                  </div>
                }
                <DefaultPreviewItem {...props} />
              </div>
            )
          }}
          editor={DefaultEditor}
          editorProps={{ Sidebar }}
        />
      </Dropzone>

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
