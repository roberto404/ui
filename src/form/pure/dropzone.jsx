
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import dropzone from 'dropzone';
import request from 'superagent';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import md5 from 'crypto-js/md5';


/* !- Redux Action */

import { modal, preload, close } from '../../layer/actions';


/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/addCircleOutline';


import DynamicCaroussel from '../../caroussel/dynamicCaroussel';
import FileList from './dropzoneFileList';

import Card from '../../card/card';
import Marker from '../../card/marker';
import IconPlus from '../../icon/mui/content/add';


const FILE_PATTERN = /^(([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})[a-f0-9]{24})/;


/**
 * DropZone Props format helper
 * default value: [{ id, ext, name, mimeMajor ... }]
 * this value: [id, id, id ...]
 */
export const formatDropzoneFileId = (value) =>
{
  const lastIndex = value.length - 1;

  if (lastIndex === -1 || typeof value[lastIndex].percent !== 'undefined')
  {
    return value;
  }

  return value.slice(0, lastIndex).concat(value[lastIndex].id);
};

export const formatDropzoneFileIdAndExt = (value) =>
{
  const lastIndex = value.length - 1;
  const lastItem = value[lastIndex];

  if (lastItem && lastItem.path)
  {
    return [
      ...value.slice(0, lastIndex),
      {
        id: lastItem.id,
        ext: lastItem.ext,
      },
    ];
  }

  return value;
}


export class File
{
  baseFolder = '/library/'

  /**
  * @constructs
  * @private
  * @param  {integer} hash
  */
  constructor(file)
  {
    // if ()
    // {
    //   throw new Error('File construct error.');
    // }

    this.id = file.id;
    this.name = file.name;
    this.ext = file.ext || 'jpg';
    this.key = 'f4cDFa';
  }

  setName = () =>
  {
    this.name = md5(this.key + this.id).toString();
  }


  /* !- Getter Setter */

  getUrl = (size, devicePixelRatio) =>
  {
    if (!this.name || !FILE_PATTERN.exec(this.name))
    {
      if (!this.id)
      {
        return '';
        // throw new Error('File hash error.');
      }

      this.setName();
    }

    let sizePrefix = '';

    if (size)
    {
      sizePrefix = `_${size}`;
    }

    const path = this.name.replace(FILE_PATTERN, '$2/$3/$4/$5/$1');
    const dpr = devicePixelRatio ? `@${devicePixelRatio}x` : '';

    return `${this.baseFolder + path + sizePrefix + dpr}.${this.ext}`;
  }

  getThumbnail = () => this.getUrl('250x250')
  getAvatar = () => this.getUrl('32x32')
}



/**
 * Dropzone - File uploader component
 * https://www.dropzonejs.com/
 *
 * Dropzone Events: drop › added › sending › (thumbnail) › uploadprogress › complete
 *
 * @dependecy Dropzone, request
 */
class DropzoneComponent extends Field
{
  dropzoneManager;

  initDropzone()
  {
    this.dropzoneManager = new dropzone(
      this.element,
      {
        url: this.props.url,
        paramName: 'dropzone',
        maxFiles: this.props.maxFiles,
        maxFilesize: this.props.maxFilesSize,
        acceptedFiles: this.props.acceptedFiles,

        accept: (file, done) =>
        {
          if ( this.props.value != null && this.props.value[parseInt(file.lastModified + '' + file.size)] )
          {
            done("value key not unique");
          }
          else
          {
            done();
          }
        },

        previewsContainer: false,
        parallelUploads: 5,
        uploadMultiple: false,
      },
    )
    .on('addedfile', this.onAddedFileHandler)
    .on('sending', this.onSendingHandler)
    .on('thumbnail', this.onThumbnailHandler)
    .on('uploadprogress', this.onUploadProgressHandler)
    .on('complete', this.onCompleteHandler)
    .on('error', this.onErrorHandler)
    .on('drop', this.onDropHandler);
  }


  /* !- Handlers */

  onClickButtonHandler(event)
  {
    event.preventDefault();
    // this.element.click();
  }


  /* !- Dropzone Events: drop › added › sending › (thumbnail) › uploadprogress › complete */

  /**
   * Invoke when the user dropped file onto the dropzone
   *
   * @method onDropHandler
   * @param {object} file
   */

  onDropHandler(file)
  {
  }

  /**
   * Invoke when the user select file,
   * the next event the options.accept method
   *
   * @param {object} file
   */
  onAddedFileHandler = (file) =>
  {
    // this.context.store.dispatch(preload());
  }

  /**
   * Invoke when the sending begin. Called just before each file is sent
   *
   * @param {object} file
   * @param {object} xhr
   * @param {object} formData
   */
  onSendingHandler = (file) =>
  {
    this.onChangeHandler([
      ...this.state.value,
      {
        id: parseInt(`${file.lastModified}${file.size}`),
        title: file.name,
        percent: 0,
      },
    ]);
  }

  /**
   * Invoke when the thumbnail has been generated (async),
   * usually before uploading proccess begining.
   * Invoke only if it is image file
   *
   * @param {object} file
   * @param {object} image
   */
  onThumbnailHandler(file, image)
  {
  }

  /**
   * Called periodically whenever the file upload progress changes
   *
   * @param {object} file
   */
  onUploadProgressHandler = (file, percent, bytesSend) =>
  {
    const value = [...this.state.value];

    const id = parseInt(file.lastModified + '' + file.size);
    const index = findIndex(value, { id: id });

    value[index]['percent'] = parseInt(percent);

    this.onChangeHandler(value);
  }

  /**
   * Invoke when the process ready, but the thumbnail will be later (ex.error)
   * temporary value data deleted and new respose data inserted
   *
   * @method onCompleteHandler
   * @param {object} file
   */
  onCompleteHandler = (file) =>
  {
    const value = [...this.state.value];

    const id = parseInt(file.lastModified + '' + file.size);
    const index = findIndex(value, { id: id });

    let response;

    if (file.accepted && file.xhr.responseText)
    {
      response = JSON.parse(file.xhr.responseText);

      if (response && response.records && typeof response.records.id !== 'undefined')
      {
        /**
         * id, path, name, ext, title, mimeMajor, mimeMinor
         * @type {Array}
         */
        value[index] = response.records;

        this.onChangeHandler(value);
        // this.context.store.dispatch(close());
        return;
      };
    }

    if (response)
    {
      this.context.store.dispatch(modal({
        title: this.props.intl ? this.props.intl.formatMessage({ id: response.code }) : response.message,
        content: response.more,
        classes: 'error',
      }));
    }
  }

  /**
   * Invoke some error
   *
   * @method onErrorHandler
   * @param {object} file
   */
  onErrorHandler = (file, message) =>
  {
    const id = parseInt(file.lastModified + '' + file.size);
    const index = this.state.value.findIndex(item => item.id === id);

    if (index !== -1)
    {
      this.onChangeHandler([
        ...this.state.value.slice(0, index),
        ...this.state.value.slice(index + 1),
      ]);
    }

    if (typeof message === 'string')
    {
      this.context.store.dispatch(modal({
        title: message,
        classes: 'error',
      }));
    }
  }


  componentDidMount()
  {
    this.initDropzone();
    super.componentDidMount();
  }


  // renderItems()
  // {
  //   const items = this.state.value;
  //   const children = [];
  //
  //   return renderInCaroussel(items);
  //
  //   items.map((item) =>
  //   {
  //     let img = '';
  //
  //     switch (typeof item)
  //     {
  //       case 'string':
  //       case 'number':
  //         img = new File({ id: item }).getThumbnail();
  //         break;
  //
  //       case 'object':
  //         img = new File(item).getThumbnail();
  //     }
  //
  //     children.push(
  //       <div
  //         key={item.id}
  //         className="file"
  //       >
  //         <div style={{ backgroundImage: `url(${img})` }} />
  //         {/* <div
  //           className="progress"
  //           data-value={items.percent}
  //         /> */}
  //       </div>
  //     );
  //   });
  //
  //   return children;
  // }

  render()
  {
    return (
      <div className={`field file-field ${this.props.className}`}>

        { this.label }

        <div className="files">

          { this.state.value.length > 0 &&
            React.cloneElement(
              this.props.children,
              {
                id: this.props.id,
                items: this.state.value,
                onChange: this.onChangeHandler,
              },
            )
          }

          { this.state.value.length > 0 && this.props.maxFiles > this.state.value.length &&
          <div className="h-1" />
          }

          { this.props.maxFiles > this.state.value.length &&
            <button
              className="w-auto border shadow white fill-red"
              onClick={this.onClickButtonHandler}
              ref={(ref) =>
              {
                this.element = ref;
              }}
            >
              <IconAdd />
              <span>Add new file</span>
            </button>
          }
        </div>
      </div>
    );
  }
}

/**
 * propTypes
 * @override
 * @type {Object}
 */
DropzoneComponent.propTypes =
{
  ...DropzoneComponent.propTypes,
  value: PropTypes.array,
  url: PropTypes.string.isRequired,
  maxFiles: PropTypes.number,
  maxFilesSize: PropTypes.number,
  /**
   * This is a comma separated list of mime types or file extensions.
   * This option will also be used as accept parameter on the file input
   * @example
   * image/*,application/pdf,.psd
   */
  acceptedFiles: PropTypes.string,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
DropzoneComponent.defaultProps =
{
  ...DropzoneComponent.defaultProps,
  value: [],
  maxFiles: 30,
  maxFilesSize: 5,
  acceptedFiles: 'image/jpg,image/jpeg,image/png,application/pdf',
  children: <FileList />,
};


export default DropzoneComponent;
