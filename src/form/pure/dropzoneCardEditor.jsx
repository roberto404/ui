import React, { Component } from 'react';
import PropTypes from 'prop-types'

/* !- Redux Actions */

import { setData } from '../../grid/actions';
import { unsetValues } from '../../form/actions';
import { dialog, flush } from '../../layer/actions';


/* !- React Elements */

import Dropzone, { File } from './dropzone';
import DropZoneFileList from './dropzoneFileList';

import Input from './input';

import IconSettings from '../../icon/mui/navigation/more_horiz';
import IconDelete from '../../icon/mui/action/delete_forever';
import IconSave from '../../icon/mui/navigation/check';
import IconBack from '../../icon/mui/navigation/arrow_back';
import IconNext from '../../icon/mui/navigation/arrow_forward';
import IconPrev from '../../icon/mui/navigation/arrow_back';



// TODO
import { createMarkers } from '../../card/marker';

const ID = 'DropzoneCardEditor';

const DEFAULT_STATE =
{
  markers: [],
  marker: {},
  title: '',
  subTitle: '',
  url: '',
  tag: '',
};

const Sidebar = ({
  title,
  subTitle,
  url,
  tag,
  onChange,
}) =>
{
  const onChangeInputHandler = onChange;

  return (
    <div>
      <input
        value={title}
        id="title"
        onChange={onChangeInputHandler}
        placeholder="Kép címe"
        className="mb-1"
      />
      <textarea
        value={subTitle}
        id="subTitle"
        onChange={onChangeInputHandler}
        placeholder="Kép alcíme"
        className="mb-1"
      />
      <input
        value={url}
        id="url"
        onChange={onChangeInputHandler}
        placeholder="Hivatkozott weboldal"
        className="mb-1"
      />
      <input
        value={tag}
        id="tag"
        onChange={onChangeInputHandler}
        placeholder="Címkék"
      />
  </div>
);
}



class CardEditor extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      ...DEFAULT_STATE,
      ...props.item,
      visibleSettings: true,
    };

    this.initialItems = [...props.items];
  }

  componentDidMount()
  {
    if (this.context.addShortcuts)
    {
      this.context.addShortcuts(
        [
          {
            keyCode: 'Escape',
            handler: this.onClickCancelHandler,
            description: 'Cancel',
          },
        ],
        'dropzoneCardEditorCollection',
      );
    }
  }

  componentWillReceiveProps(nextProps)
  {
    this.setState({
      ...DEFAULT_STATE,
      ...nextProps.item,
    });
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    return (JSON.stringify(nextState) !== JSON.stringify(this.state));
  }

  componentDidUpdate()
  {
    this.props.onChange(this.state, false);
  }

  componentWillUnmount()
  {
    this.context.store.dispatch(unsetValues({ id: ID }, this.context.form));

    if (this.context.removeShortcuts)
    {
      this.context.removeShortcuts('dropzoneCardEditorCollection');
    }
  }

  /* !- Listener */

  onClickSettingsHandler = (event) =>
  {
    event.preventDefault();
    this.setState({ visibleSettings: !this.state.visibleSettings });
  }

  onDragMarkerListener = ({ index, x, y }) =>
  {
    let markers = [];

    if (Math.min(x, y) < 0 || Math.max(x, y) > 100)
    {
      markers = [
        ...this.state.markers.slice(0, parseInt(index)),
        ...this.state.markers.slice(parseInt(index) + 1),
      ];
    }
    else
    {
      markers = [...this.state.markers];

      markers[index] =
      {
        ...this.state.markers[index],
        position: [x, y],
      };
    }


    this.setState({ markers });
    this.context.store.dispatch(flush());
  }



  /* !- Handlers */

  onClickMarkerHandler = (event) =>
  {
    event.preventDefault();

    const category = event.currentTarget.dataset.id;

    const onClickHandler = () =>
    {
      const settings = this.context.store.getState().form.markerSetting;

      const marker = {
        category,
        settings,
        position: [50, 50],
      };

      this.setState({ markers: [...(this.state.markers || []), marker] });
      this.context.store.dispatch(flush());
    };

    this.context.store.dispatch(dialog(
      <div>
        <Input id="markerSetting" />
        <div className="button primary" onClick={onClickHandler}>Létrehozom</div>
      </div>,
    ));
  }

  onClickSaveHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange(this.state);
  }

  onClickCancelHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange(this.initialItems);
  }

  onClickDeleteHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange();
  }

  onUploadCompleteHandler = (files) =>
  {
    const { id, ext } = files[files.length - 1];

    this.setState({
      id,
      ext,
    });
  }

  onChangeInputHandler = (event) =>
  {
    const { id, value } = event.target || event;

    this.setState({ [id]: value });
  }


  renderMarkerButtons = () =>
    Object.keys(this.props.defaultMarkers).map(marker => (
      <button
        key={marker}
        className={this.state.marker.category === marker ? 'green' : ''}
        data-id={marker}
        onClick={this.onClickMarkerHandler}
      >
        {marker}
      </button>
    ));


  render()
  {
    const Sidebar = this.props.Sidebar;

    return (
      <div className={this.props.className} style={{ zIndex: 999 }}>

        {/* Toolbar */}

        <div className="v-justify text-m pb-1">
          <div className="flex">
            <button className="fill-blue-dark text-blue-dark" onClick={this.onClickCancelHandler}>
              <IconBack className="" />
              {/*<span>Vissza</span>*/}
            </button>

            <button className="fill-blue-dark" onClick={this.onClickDeleteHandler}>
              <IconDelete />
              {/*<span>Törlés</span>*/}
            </button>

          </div>
          <div className="flex">

            <Dropzone
              url={this.props.url}
              maxFilesSize={1}
              id={ID}
              // placeholder="Kép feltöltés"
              placeholder=""
              onComplete={this.onUploadCompleteHandler}
              className="m-0"
              classNameButtonUpload="button fill-blue-dark text-blue-dark"
            >
              <DropZoneFileList preview={() => <div />} />
            </Dropzone>


            <button className="fill-blue-dark text-blue-dark" onClick={this.onClickSettingsHandler}>
              <IconSettings />
            </button>

            <button className="fill-blue-dark text-blue-dark" onClick={this.onClickSaveHandler}>
              <IconSave />
            </button>

          </div>
        </div>

        {/* Image */}

        <div className="grow flex">
          <div className="grow">
            <div
              className="v-center h-center relative"
              style={{
                maxWidth: 'calc(100% - 4rem)',
                maxHeight: 'calc(100vh - 4rem)',
                marginLeft: '2rem',
              }}
            >
              <div
                className="pointer absolute pin-l bg-white-light p-1 m-1 circle w-4 h-4 opacity-50 hover:opacity-100 transition"
                onClick={(e) => this.props.onNavigation(-1)}
              >
                <IconPrev className="w-full h-full" />
              </div>

              <img
                src={new File(this.state).getUrl('1140x570')}
                width="auto"
                style={{
                  maxHeight: 'inherit',
                  maxWidth: '100%',
                }}
              />

              <div
                className="pointer absolute pin-r bg-white-light p-1 m-1 circle w-4 h-4 opacity-50 hover:opacity-100 transition"
                onClick={(e) => this.props.onNavigation(1)}
              >
                <IconNext className="w-full h-full" />
              </div>

            </div>
          </div>

          {/* Slidebar */}
          <div
            className={`m-${+this.state.visibleSettings} mt-0 p-${+this.state.visibleSettings} rounded shadow-outer-3 bg-white-light transition ease-in-out`}
            style={{
              width: `${300 * +this.state.visibleSettings}px`,
              opacity: `${100 * +this.state.visibleSettings}`,
              height: 'fit-content',
            }}
          >
            <Sidebar {...this.state} onChange={this.onChangeInputHandler} />
          </div>

        </div>
      </div>
    );
  }
}

CardEditor.defaultProps =
{
  defaultMarkers: {
    // heading: {
    //   category: 'heading',
    //   position: [50,50],
    //   settings: 'Szöveg helye',
    // },
    // tooltip: {
    //   category: 'tooltip',
    //   position: [50, 50],
    //   settings: 'Szöveg helye',
    // },
  },
  Sidebar,
  className: 'pin column bg-white',
};

CardEditor.contextTypes =
{
  store: PropTypes.object,
  form: PropTypes.string,
  addShortcuts: PropTypes.func,
  removeShortcuts: PropTypes.func,
}


export default CardEditor;
