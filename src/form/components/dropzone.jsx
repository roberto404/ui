
import React from 'react';
import PropTypes from 'prop-types'
import dropzone from 'dropzone';
import findIndex from 'lodash/findIndex';
import classNames from 'classnames';

import { bindFormContexts } from '../context';



/* !- Redux Action */

import { modal } from '../../layer/actions';


/* !- React Elements */

import Field from '../../form/formField';
import IconAdd from '../../icon/addCircleOutline';

import FileList from './dropzoneFileList';
import IconArrow from '../../icon/mui/navigation/arrow_forward';


/* !- Constants */

// ...

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

export const formatDropzoneFileIdAndExtHelper = ({ id, title, ext, percent }) =>
  percent === undefined ? ({ id, ext }) : ({ id, title, percent });

export const formatDropzoneFileIdAndExt = (value = []) =>
  value.map(formatDropzoneFileIdAndExtHelper);

export const formatDropzoneMarkers = (value = []) =>
  value.map((values) =>
  {
    const { id, title, ext, percent, markers, url, subTitle, tag } = values;

    if (percent)
    {
      return ({ id, title, percent });
    }

    return Object.entries({ id, title, ext, markers, url, subTitle, tag }).reduce((result, pair) =>
    {
      const [key, value] = pair;

      if (
        value !== undefined
        && (!Array.isArray(value) || value.length > 0)
        && value !== ''
      )
      {
        result[key] = value;
      }

      return result;
    }, {});
  });






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

  getState = () =>
    this.state.value;
    // this.context.store.getState().form[this.context.form]?.[this.props.id] || [];


  /* !- Handlers */

  onClickButtonHandler = (event) =>
  {
    event.preventDefault();
    this.element.click();
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
  onSendingHandler = (file, xhr, formData) =>
  {
    this.onChangeHandler([
      ...this.getState(),
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
    const value = [...this.getState()];

    const id = parseInt(file.lastModified + '' + file.size);
    const index = findIndex(value, { id: id });


    if (index !== -1)
    {
      value[index]['percent'] = parseInt(percent);
      this.onChangeHandler(value);
    }

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
    const value = [...this.getState()];

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
        value[index] = this.props.onUploadFormat(response.records);

        this.onChangeHandler(value);

        if (this.props.onComplete)
        {
          this.props.onComplete(value);
        }

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
    const index = this.getState().findIndex(item => item.id === id);

    if (index !== -1)
    {
      this.onChangeHandler([
        ...this.getState().slice(0, index),
        ...this.getState().slice(index + 1),
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

  UNSAFE_componentWillReceiveProps(nextProps)
  {
    this.element.dropzone.removeAllFiles();
    super.UNSAFE_componentWillReceiveProps(nextProps);
  }

  render()
  {
    const buttonsClass = classNames({
      'buttons concat': this.props.onClickBrowse,
    });

    console.log(this.state);

    return (
      <div
        className={`field file-field ${this.props.className}`}
        ref={(ref) =>
          {
            this.element = ref;
          }}
      >

        { this.label }

        <div className="files">

          { this.getState().length > 0 &&
            React.cloneElement(
              this.props.children,
              {
                ...this.props,
                items: this.getState(),
                onChange: this.onChangeHandler,
              },
            )
          }

          { this.props.maxFiles > this.getState().length &&
            <div className={buttonsClass}>
              { React.createElement(this.props.UI, { ...this.props, onClick: this.onClickButtonHandler })}
              { this.props.onClickBrowse &&
              <button
                onClick={event => this.props.onClickBrowse(event, file => this.onChangeHandler([...this.getState(), file]))}
                className={this.props.classNameButtonBrowse}
              >
                <IconAdd />
                <span>Tallózás</span>
              </button>
              }
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
  maxFilesSize: PropTypes.number,
  /**
   * This is a comma separated list of mime types or file extensions.
   * This option will also be used as accept parameter on the file input
   * @example
   * image/*,application/pdf,.psd
   */
  acceptedFiles: PropTypes.string,
  UI: PropTypes.func,
  onComplete: PropTypes.func,
  classNameButtonBrowse: PropTypes.string,
};

/**
 * defaultProps
 * @override
 * @type {Object}
 */
DropzoneComponent.defaultProps =
{
  ...DropzoneComponent.defaultProps,
  placeholder: 'Upload new file',
  value: [],
  maxFiles: 30,
  maxFilesSize: 5,
  acceptedFiles: 'image/jpg,image/jpeg,image/png,application/pdf',
  children: <FileList />,
  onUploadFormat: v => v,
  UI: ({ onClick, placeholder, classNameButtonUpload }) => (
    <div
      className={classNameButtonUpload}
      onClick={onClick}
      >
      <IconArrow className="rotate-270" />
      <span>{placeholder}</span>
    </div>
  ),
  classNameButtonUpload: 'button inline-block w-auto border shadow white fill-red',
  classNameButtonBrowse: 'w-auto border shadow gray fill-white',
};


export default bindFormContexts(DropzoneComponent);
