
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import dropzone from 'dropzone';
import request from 'superagent';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';


/* !- Redux Action */

import { modal } from '../../layer/actions';


/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/addCircleOutline';


const FILE_PATTERN = /^(([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})[a-f0-9]{24})/;

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
    this.hash = file.hash;
    this.ext = file.ext;
  }


  /* !- Getter Setter */

  getUrl = (size) =>
  {
    if (!this.hash || !FILE_PATTERN.exec(this.hash))
    {
      return;
      // throw new Error('File hash error.');
    }

    let sizePrefix = '';

    if (size)
    {
      sizePrefix = `_${size}`;
    }

    const path = this.hash.replace(FILE_PATTERN, '$2/$3/$4/$5/$1');

    return `${this.baseFolder + path + sizePrefix}.${this.ext}`;
  }

  getThumbnail = () => this.getUrl('180x180')
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
        maxFilesize: this.props.maxFilesize,
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
  onAddedFileHandler(file)
  {
    // var reader = new FileReader();
    //
    // reader.onloadend = (evt) => {
    //   if (evt.target.readyState == FileReader.DONE)
    //   { // DONE == 2
    //      evt.target.result
    //   }
    // };
    // reader.readAsBinaryString(file);
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
        type: false,
        url: false,
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
        value[index] = response.records;

        this.onChangeHandler(value);
        return;
      };
    }

    if (response)
    {
      this.context.store.dispatch(modal({
        title: response.message,
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
  onErrorHandler(file, message)
  {
    console.log(file, message);
      // var message = message || 'Please try again';
      //
      // if (typeof message == 'string')
      //     message = message;
      // else if (typeof message.records != 'undefined')
      //     message = message.records.userMessage;
      //
      // if (typeof message.records.more)
      //     message += ' (' + message.records.more + ')';
      //
      // alert(
      // {
      //     message : message,
      //     source : "fieldDropzone :: onErrorHandler :: cant upload file",
      //     error : message,
      //     attr : {file: file},
      //     navigate : window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'))
      // });
  }



  componentDidMount()
  {
    this.initDropzone();
    super.componentDidMount();
  }

  render()
  {
    const items = this.state.value;

    return (
      <div className={`field file-field ${this.props.className}`}>

        { this.label }

        <div className="files">

          { items.map(item =>
          {
            const img = item.hash ? new File(item).getThumbnail() : '';

            return (
              <div
                key={item.id}
                className="file"
              >
                <div style={{ backgroundImage: `url(${img})` }} />
                {/* <div
                  className="progress"
                  data-value={items.percent}
                /> */}
              </div>
            );
          })
          }

          { this.props.maxFiles > this.state.value.length &&
          <div
            className="file add-new"
            onClick={this.onClickButtonHandler}
            ref={(ref) =>
            {
              this.element = ref;
            }}
          >
            <IconAdd />
          </div>
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
  maxFilesize: PropTypes.number,
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
  maxFilesize: 5,
  acceptedFiles: 'image/jpg,image/jpeg,image/png,application/pdf',
};


export default DropzoneComponent;
