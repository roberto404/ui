import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Provider, useDispatch } from 'react-redux';

require('../../../assets/style/index.scss');


/* !- Actions */

import {
  add,
  error,
  dialog,
  update,
  addProgress,
  addComplete,
  addApi,
  addApiPromise,
  addApiWithMessage,
  flush,
} from '../../notification/actions';


/* !- Components */

import Notification from '../../notification';
import IconDelete from '../../icon/mui/action/delete_forever';


/* !- Context (az értesítések a redux store-hoz + AppContext-hez kötődnek) */

import { AppContext } from '../../context';
import store from '../../store';

import { Status } from '../../apiType';

const reduxStore = store();

const withContexts = (Story: any) => (
  <Provider store={reduxStore}>
    <AppContext.Provider value={{ store: reduxStore, api: () => Promise.resolve(null) }}>
      <div style={{ padding: 24, minHeight: 480 }}>
        <Story />
        <Notification />
      </div>
    </AppContext.Provider>
  </Provider>
);


/* !- Mock api */

type MockOptions = {
  delay?: number,
  fail?: boolean,
};

/**
 * Az api hívást imitálja: a kapott payloadot visszaadja recordként.
 */
const mockApi = ({ delay = 1500, fail = false }: MockOptions = {}) =>
  (payload = {}) => new Promise<any>((resolve) => {
    setTimeout(
      () => resolve(
        fail
          ? {
            status: Status.ERROR,
            code: '400',
            message: 'Mock hiba',
            modal: { title: 'Mock hiba' },
          }
          : {
            status: Status.SUCCESS,
            count: 1,
            config: {},
            records: { id: 1, ...payload },
          },
      ),
      delay,
    );
  });


/* !- Demo */

type ButtonPropTypes = {
  title: string,
  onClick: () => void,
};

const DemoButton = ({ title, onClick }: ButtonPropTypes) => (
  <div className="button outline w-content p-1/2 px-2" onClick={onClick}>
    {title}
  </div>
);


/* !- Stories */

const meta = {
  title: 'Notification/Actions',
  component: Notification,
  decorators: [withContexts],
} satisfies Meta<typeof Notification>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- add | error | dialog | addComplete | addProgress */

const BasicDemo = () => {

  const dispatch = useDispatch();

  return (
    <div className="column gap-1 w-content">
      <DemoButton
        title="add"
        onClick={() => dispatch(add({
          title: 'Kupont elküldtük a megadott email címre.',
          caption: 'Az értesítés 5 másodperc múlva bezárul.',
          autoClose: true,
        }))}
      />

      <DemoButton
        title="error"
        onClick={() => dispatch(error('Nem sikerült menteni a megrendelést.'))}
      />

      <DemoButton
        title="dialog"
        onClick={() => dispatch(dialog({
          title: 'Biztosan törölni akarod?',
          caption: 'A törlés nem visszavonható.',
          icon: IconDelete,
          autoClose: false,
          button: {
            title: 'Törlés',
            // eslint-disable-next-line no-alert
            handler: (onClose) => onClose(),
          },
        }))}
      />

      <DemoButton
        title="addComplete"
        onClick={() => dispatch(addComplete({
          title: 'Mentés kész.',
          caption: 'A megrendelés adatai frissültek.',
        }))}
      />

      <DemoButton
        title="addProgress"
        onClick={() => {

          const id = `progress-${Date.now()}`;

          dispatch(addProgress({
            id,
            title: {
              49: 'Adatok betöltése...',
              99: 'Második adag betöltése...',
              100: 'Kész',
            },
            caption: '1.2Gb • About 2 seconds left.',
            percent: 0,
          }));

          let percent = 0;

          const timer = setInterval(() => {
            percent += 10;
            dispatch(update({ id, percent }));

            if (percent >= 100) {
              clearInterval(timer);
            }
          }, 300);
        }}
      />

      <DemoButton title="flush" onClick={() => dispatch(flush())} />
    </div>
  );
};

export const Basic: Story = () => <BasicDemo />;

Basic.storyName = 'add | error | dialog | progress';


/* !- addApi */

const ApiDemo = () => {

  const dispatch = useDispatch();

  return (
    <div className="column gap-1 w-content">
      <DemoButton
        title="addApi (siker)"
        onClick={() => dispatch(addApi({
          title: 'Kedvezmény hozzáadása...',
          caption: 'A kedvezmény rögzítése folyamatban van.',
          payload: {
            api: mockApi(),
          },
        }))}
      />

      <DemoButton
        title="addApi (hiba)"
        onClick={() => dispatch(addApi({
          title: 'Kedvezmény hozzáadása...',
          caption: 'A kedvezmény rögzítése folyamatban van.',
          payload: {
            api: mockApi({ fail: true }),
          },
        }))}
      />

      <DemoButton
        title="addApi (válasz + gomb)"
        onClick={() => dispatch(addApi({
          title: (respond) => (respond ? 'Számla elkészült.' : 'Számla készítése...'),
          caption: 'A számlát új ablakban tudod megnyitni.',
          payload: {
            api: mockApi(),
            button: {
              title: 'megnyitás',
              onClick: () => { },
            },
          },
        }))}
      />
    </div>
  );
};

export const Api: Story = () => <ApiDemo />;

Api.storyName = 'addApi';


/* !- addApiPromise */

const ApiPromiseDemo = () => {

  const dispatch = useDispatch();

  return (
    <div className="column gap-1 w-content">
      <DemoButton
        title="addApiPromise (saját children)"
        onClick={() => dispatch(addApiPromise({
          title: 'Kedvezmény hozzáadása',
          caption: 'Az api hívás csak a gombra kattintva indul el.',
          children: ({ onStart }) => (
            <div className="button green w-content p-1/2 px-2 mt-1" onClick={onStart}>
              mehet
            </div>
          ),
          payload: {
            api: mockApi(),
          },
        }))}
      />

      <DemoButton
        title="addApiPromise (payload az onStart-ból)"
        onClick={() => dispatch(addApiPromise({
          title: 'Készlet mozgatása',
          caption: 'Válaszd ki a raktárt, ahova a terméket mozgatjuk.',
          children: ({ onStart }) => (
            <div className="gap-1 flex mt-1">
              {['Budapest', 'Miskolc'].map((warehouse) => (
                <div
                  key={warehouse}
                  className="button outline w-content p-1/2 px-2"
                  onClick={() => onStart({ warehouse })}
                >
                  {warehouse}
                </div>
              ))}
            </div>
          ),
          payload: {
            api: mockApi(),
            onLoad: (respond) => {
              // eslint-disable-next-line no-console
              console.log('onLoad', respond);
            },
          },
        }))}
      />
    </div>
  );
};

export const ApiPromise: Story = () => <ApiPromiseDemo />;

ApiPromise.storyName = 'addApiPromise';


/* !- addApiWithMessage */

const ApiWithMessageDemo = () => {

  const dispatch = useDispatch();

  return (
    <div className="column gap-1 w-content">
      <DemoButton
        title="addApiWithMessage"
        onClick={() => dispatch(addApiWithMessage({
          title: 'Kedvezmény hozzáadása',
          caption: 'Az indoklás megadásáig nem indítható.',
          payload: {
            api: mockApi(),
          },
        }))}
      />

      <DemoButton
        title="addApiWithMessage (egyedi felirat)"
        onClick={() => dispatch(addApiWithMessage({
          title: 'Megrendelés törlése',
          message: {
            label: 'Törlés oka',
            placeholder: 'Miért törlöd a megrendelést?',
            buttonTitle: 'törlés',
            rows: 3,
          },
          payload: {
            api: mockApi(),
          },
        }))}
      />
    </div>
  );
};

export const ApiWithMessage: Story = () => <ApiWithMessageDemo />;

ApiWithMessage.storyName = 'addApiWithMessage';
