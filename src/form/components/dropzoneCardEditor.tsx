import React, { Component, useContext, useEffect, useState } from 'react';
import File from '../file';
import { useComponentDidMount, useComponentWillUnmount } from '../../hooks';
import { useAppContext } from '../../context';


/* !- Context */

import { AppContext, MergedContexts, bindContexts } from '../../context';
import { FormContext } from '../context';


/* !- Redux Actions */

import { setData } from '../../grid/actions';
import { unsetValues } from '../actions';
import { dialog, flush } from '../../layer/actions';


/* !- React Elements */

import Dropzone from './dropzone';
import DropZoneFileList from './dropzoneFileList';

import Input from './input';

import IconSettings from '../../icon/mui/navigation/more_horiz';
import IconDelete from '../../icon/mui/action/delete_forever';
import IconSave from '../../icon/mui/navigation/check';
import IconBack from '../../icon/mui/navigation/arrow_back';
import IconNext from '../../icon/mui/navigation/arrow_forward';
import IconPrev from '../../icon/mui/navigation/arrow_back';

import SidebarComponent from './dropzoneCardEditorSidebar';




// TODO
import { createMarkers } from '../../card/marker';
import { useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';

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


type PropTypes = {
  item: any; // Update with the actual type
  items: any[]; // Update with the actual type
  url: string;
  onChange: (item?: any, close?: boolean) => void; // Update with the actual type
  onNavigation: (direction: number) => void; // Update with the actual type
  defaultMarkers?: Record<string, any>; // Update with the actual type
  Sidebar: React.FC; // Ensure this matches the Sidebar component's props
  className?: string;
}


const BG_COLORS = [
  'rgb(248, 213, 61)',
  'rgb(230, 55, 58)',
  'rgb(8, 198, 122)',
  'rgb(168, 205, 206)',
  'rgb(172, 172, 172)',
  'rgb(60, 60, 59)',
];

const Color = ({
  backgroundColor,
  image,
  onChange,
}) => {

  const isActive = image.id == backgroundColor;

  return (
    <div
      className='col-1-3 ratio pointer'
      style={{ backgroundColor }}
      onClick={() => onChange({ id: 'id', value: backgroundColor })}
    >
      {isActive &&
        <div className='absolute bg-black w-3 h-3 v-center h-center'>
          <IconSave className="w-2 h-2 fill-white" />
        </div>
      }
    </div>
  )
}


export const CardEditor = ({
  item,
  items,
  url,
  className,
  onChange,
  onNavigation,
  defaultMarkers = {},
  Sidebar = SidebarComponent,
}: PropTypes) => {

  const [state, setState] = useState({
    ...DEFAULT_STATE,
    ...item,
    visibleSettings: true,
  });

  const [initialItems] = useState([...items]);
  const context = useContext(MergedContexts);
  const { addShortcuts, removeShortcuts } = useAppContext();
  const dispatch = useDispatch();

  useComponentDidMount(() => {
    addShortcuts(
      [
        {
          keyCode: 'Escape',
          handler: onClickCancelHandler,
          description: 'Cancel',
        },
      ],
      'dropzoneCardEditorCollection',
    );
  });

  useComponentWillUnmount(() => {

    dispatch(unsetValues({ id: ID }, context.form));

    if (removeShortcuts) {
      removeShortcuts('dropzoneCardEditorCollection');
    }
  });


  useEffect(() => {
    setState(prevState => ({
      ...DEFAULT_STATE,
      marker: (item?.id !== prevState.id ? DEFAULT_STATE : prevState).marker,
      ...item,
      visibleSettings: state.visibleSettings,
    }));
  }, [item]);

  // state change
  useEffect(() => {
    onChange(state, false);
  }, [state]);



  /* !- Listener */

  /* !- Handlers */




  const onDragMarkerListener = ({ index, x, y }) => {

    let markers = [];

    if (Math.min(x, y) < 0 || Math.max(x, y) > 100) {
      markers = [
        ...state.markers.slice(0, parseInt(index)),
        ...state.markers.slice(parseInt(index) + 1),
      ];
    } else {
      markers = [...state.markers];
      markers[index] = {
        ...state.markers[index],
        position: [x, y],
      };
    }

    setState(prevState => ({ ...prevState, markers }));

    const layer = context.store.getState().layer;

    if (layer.method === 'popover') {
      dispatch(flush());
    }
  };

  const onClickHandler = (category) => () => {

    const settings = context.store.getState().form.markerSetting;

    const marker = {
      category,
      settings,
      position: [50, 50],
    };

    setState(prevState => ({ ...prevState, markers: [...(prevState.markers || []), marker] }));

    dispatch(flush());
  };

  const onClickMarkerHandler = (event: MouseEvent) => {

    event.preventDefault();

    const category = event.currentTarget.dataset.id;

    if (context.store.getState().layer.active) {
      let settings = prompt("Létrehozom:", "");

      const marker = {
        category,
        settings,
        position: [50, 50],
      };

      setState(prevState => ({ ...prevState, markers: [...(prevState.markers || []), marker] }));
    } else {
      dispatch(dialog(
        <div>
          <Input id="markerSetting" />
          <div className="button primary" onClick={onClickHandler(category)}>Létrehozom</div>
        </div>,
      ));
    }
  };


  /**
   * Back button event, reset every changes
   */
  const onClickCancelHandler = (event: MouseEvent) => {
    event.preventDefault();
    onChange(initialItems);
  };

  const onClickDeleteHandler = (event: MouseEvent) => {
    event.preventDefault();
    onChange();
  };

  const onClickSidebarHandler = (event: React.MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    setState(prevState => ({
      ...prevState,
      visibleSettings: !prevState.visibleSettings,
    }));
  };

  const onClickSaveHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onChange(state);
  };


  const onUploadCompleteHandler = (files) => {
    const { id, ext } = files[files.length - 1];

    setState(prevState => ({
      ...prevState,
      id,
      ext,
    }));
  };

  const onChangeInputHandler = (event) => {
    const { id, value } = event.target || event;

    setState(prevState => ({ ...prevState, [id]: value }));
  };

  const renderMarkerButtons = () =>
    Object.keys(defaultMarkers).map(marker => (
      <button
        key={marker}
        className={state.marker.category === marker ? 'green' : ''}
        data-id={marker}
        onClick={onClickMarkerHandler}
      >
        {marker}
      </button>
    ));


  const visibleSettingsInt = +(state.visibleSettings || 0);

  console.log(111, state);

  return (
    <div className={className} style={{ zIndex: 999 }}>

      {/* Toolbar */}

      <div className="v-justify text-m pb-1">
        <div className="flex">
          <button className="fill-blue-dark text-blue-dark" onClick={onClickCancelHandler}>
            <IconBack className="" />
          </button>

          <button className="fill-blue-dark" onClick={onClickDeleteHandler}>
            <IconDelete />
          </button>
        </div>
        <div className="flex">
          <Dropzone
            url={url}
            maxFilesSize={1}
            id={ID}
            placeholder=""
            onComplete={onUploadCompleteHandler}
            className="m-0"
            classNameButtonUpload="button fill-blue-dark text-blue-dark"
          >
            <DropZoneFileList preview={() => <div />} />
          </Dropzone>

          <button className="fill-blue-dark text-blue-dark" onClick={onClickSidebarHandler}>
            <IconSettings />
          </button>

          <button className="fill-blue-dark text-blue-dark" onClick={onClickSaveHandler}>
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
              onClick={(e) => onNavigation(-1)}
            >
              <IconPrev className="w-full h-full" />
            </div>

            {state.ext === 'mp4' &&
              <ReactPlayer playing controls url={new File(state).getUrl()} />
            }
            {state.ext !== 'mp4' && state.ext &&
              <img
                src={new File(state).getUrl('1140x570')}
                width="auto"
                style={{
                  maxHeight: 'inherit',
                  maxWidth: '100%',
                }}
              />
            }
            {!state.ext &&
              <div className='grid-2-2 m-8'>
                {BG_COLORS.map(color => (
                  <Color
                    key={color}
                    backgroundColor={color}
                    image={state}
                    onChange={onChangeInputHandler}
                  />
                ))}
              </div>
            }

            <div
              className="pointer absolute pin-r bg-white-light p-1 m-1 circle w-4 h-4 opacity-50 hover:opacity-100 transition"
              onClick={(e) => onNavigation(1)}
            >
              <IconNext className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Sidebar */}

        <div
          className={`m-${visibleSettingsInt} mt-0 p-${visibleSettingsInt} rounded shadow-outer-3 bg-white-light transition ease-in-out`}
          style={{
            width: `${300 * visibleSettingsInt}px`,
            opacity: `${100 * visibleSettingsInt}`,
            height: 'fit-content',
          }}
        >
          <Sidebar {...state} onChange={onChangeInputHandler} />
        </div>
      </div>

      {/* Markers */}
      <div className="marker-buttons">
        {renderMarkerButtons()}
      </div>

      {/* Render markers on the canvas */}
      <div className="markers">
        {state.markers.map((marker, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${marker.position[0]}%`,
              top: `${marker.position[1]}%`,
              cursor: 'move',
            }}
            draggable
            onDragEnd={(e) => onDragMarkerListener({ index, x: marker.position[0], y: marker.position[1] })}
          >
            <span>{marker.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardEditor;