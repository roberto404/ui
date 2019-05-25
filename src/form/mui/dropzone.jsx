
import React from 'react';
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl';
import Dropzone from 'dropzone';
import findIndex from 'lodash/findIndex';
import { connect } from 'react-redux';


/* !- Redux Action */

import { modal, dialog, close } from '../../layer/actions';


/* !- React Elements */

import SubmitField from './submit';

import MuiRaisedButton from 'material-ui/RaisedButton';
import { Card, CardHeader} from 'material-ui/Card';
import IconAdd from 'material-ui/svg-icons/content/add-circle';
import IconDelete from 'material-ui/svg-icons/action/delete-forever';
import Field from '../../form/formField';

const Submit = injectIntl(SubmitField);


const FILE_PATTERN = /^(([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})[a-f0-9]{24})/;
const THUMBNAIL_SIZE = '40x40';

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


export const DropzoneFile = connect(
  null,
  {
    dialog,
    close,
  }
)(({ avatar = '', subtitle, title, onDelete, index, dialog, close }) =>
{
  // todo more size
  const size = subtitle.split(', ')[0];

  const onClickDeleteHandler = () =>
  {
    close();
    onDelete(index);
  }

  const onClickCardHandler = () =>
  {
    dialog(
      <div className="text-center">
        <div>
          <img
            src={avatar.replace(THUMBNAIL_SIZE, size)}
            width="100%"
            style={{ maxWidth: size.split('x')[0] }}
            alt={title}
          />
        </div>

        <div className="mt-2">
          <MuiRaisedButton
            label="Remove"
            onClick={onClickDeleteHandler}
            icon={<IconDelete />}
            secondary
          />
        </div>
      </div>,
    );
  };

  return (
      <Card onClick={onClickCardHandler}>
        <CardHeader
          avatar={avatar}
          title={title}
          subtitle={subtitle}
        />
      </Card>
  );
})


/**
 * Dropzone - File uploader component
 *
 * @dependecy Dropzone, request
 */

class DropzoneComponent extends Field
{
  dropzoneManager;

  initDropzone()
  {
    const resize = Array.isArray(this.props.resize) ? [...this.props.resize] : [this.props.resize];

    resize.push({
      size: THUMBNAIL_SIZE,
      fitWidthIn: '',
      aspectRatio: false,
    });

    this.dropzoneManager = new Dropzone(
      this.element,
      {
        //?ext=jpg|jpeg|png&resize=[{"size":"40x40","fitWidthIn":"","aspectRatio":0}]'
        url: `${this.props.url}?ext=${this.props.extension.join('|')}&resize=${JSON.stringify(resize)}`,
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
    .on('drop', this.onDropHandler)
    .on('queuecomplete', this.onEndHandler);
  }


  /* !- Handlers */

  onClickButtonHandler = (event) =>
  {
    this.dropzoneManager.hiddenFileInput.click();
  }

  onClickDeleteHandler = (index) =>
  {
    this.state.value.splice(index, 1);

    this.onChangeHandler(this.state.value);
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
   * Invoke when the user select file, the next event the options.accept method
   *
   * @method onAddedFileHandler
   * @param {object} file
   */
  onAddedFileHandler(file)
  {
  }

  /**
   * Invoke when the sending begin. Called just before each file is sent
   *
   * @method onSendingHandler
   * @param {object} file
   */
  onSendingHandler = (file, xhr, formData) =>
  {
    if (!this.state.onProgress)
    {
      this.setState({ onProgress: true });
      this.onStartHandler();
    }

    this.onChangeHandler([
      ...this.state.value,
      {
        id: parseInt(file.lastModified + '' + file.size),
        title: file.name,
        type: false,
        url: false,
        percent: 0,
      },
    ]);
  }

  /**
   * Invoke when the thumbnail has been generated (async), usually before uploading proccess begining
   *
   * @method onThumbnailHandler
   * @param {object} file
   */
  onThumbnailHandler(file, image)
  {
  }

  /**
   * Called periodically whenever the file upload progress changes
   *
   * @method onUploadProgressHandler
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
      }
    }

    if (this.props.onComplete)
    {
      this.props.onComplete(response);
    }
    else if (response && response.message)
    {
      this.context.store.dispatch(modal({
        title: response.message,
        content: response.more,
        classes: 'error',
      }));
    }
    else
    {
      this.context.store.dispatch(close());
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

  /**
   * Invoke when multiple proccess start.
   */
  onStartHandler = () =>
  {
    if (this.props.onStart)
    {
      this.props.onStart();
    }
  }

  /**
   * Invoke when all files in the queue finish uploading.
   */
  onEndHandler = () =>
  {
    this.setState({ onProgress: false });

    if (this.props.onEnd)
    {
      this.props.onEnd();
    }
  }


  componentDidMount()
  {
    this.initDropzone();
    super.componentDidMount();
  }

  render()
  {
    const items = this.state.value;
    const resize = Array.isArray(this.props.resize) ? [...this.props.resize] : [this.props.resize];

    return (
      <div className={`field file-field ${this.props.className} mb-2`}>

        <div className="my-1">
          { this.label }
        </div>

        <div className="files">

          { this.props.showFiles && Array.isArray(items) && items.map((item, index) =>
          {
            return (
              <DropzoneFile
                key={item.id}
                index={index}
                title={item.ext}
                subtitle={resize.map(i => i.size).join(', ')}
                avatar={new File(item).getUrl(THUMBNAIL_SIZE)}
                onDelete={this.onClickDeleteHandler}
              />
            );
            // const img = item.hash ? new File(item).getThumbnail() : '';
            //
            // return (
            //   <div
            //     key={item.id}
            //     className="file"
            //   >
            //     <div style={{ backgroundImage: `url(${img})` }} />
            //     {/* <div
            //       className="progress"
            //       data-value={items.percent}
            //     /> */}
            //   </div>
            // );
          })
          }

          { this.props.maxFiles > this.state.value.length &&
          <MuiRaisedButton
            label="Choose or drop file"
            onClick={this.onClickButtonHandler}
            icon={<IconAdd />}
            secondary
          />
          }
        </div>
        <div
          className="hidden"
          ref={(ref) =>
          {
            this.element = ref;
          }}
        />
      </div>
    );
  }
}

const resizePropTypes = {
  size: PropTypes.string.isRequired,
  fitWidthIn: PropTypes.oneOf(['', 'width', 'height']),
  aspectRatio: PropTypes.bool,
};

/**
 * propTypes
 * @override
 * @type {Object}
 */
DropzoneComponent.propTypes =
{
  ...DropzoneComponent.propTypes,
  value: PropTypes.arrayOf(PropTypes.object),
  // name: PropTypes.string.isRequired,
  url: PropTypes.string,
  maxFiles: PropTypes.number,
  maxFilesize: PropTypes.number,
  acceptedFiles: PropTypes.string,
  extension: PropTypes.arrayOf(PropTypes.string),
  resize: PropTypes.oneOfType([
    PropTypes.shape(resizePropTypes),
    PropTypes.arrayOf(PropTypes.shape(resizePropTypes)),
  ]),
  onEnd: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  onStart: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  showFiles: PropTypes.bool,
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
  url: '/api/v3/file/resize',
  extension: ['jpg', 'jpeg', 'png'],
  resize: {
    size: '980x630',
    fitWidthIn: 'width',
    aspectRatio: true,
  },
  acceptedFiles: 'image/jpg,image/jpeg,image/png,application/pdf',
  onStart: false,
  onEnd: false,
  showFiles: true,
};


export default DropzoneComponent;
