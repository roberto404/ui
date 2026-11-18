import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import moment from 'moment';
import Tree from '@1studio/utils/models/tree';

require('../../../assets/style/index.scss');


/* !- Components */

import { Grid as GridView } from '../../view/grid';
import Connect from '../../grid/connect';
import NestedList, { Accordion } from '../../grid/components/nestedList';
import Messages from '../../grid/components/nestedItems/messages';
import Hierarchy from '../../grid/components/nestedItems/hierarchy';
import MenuItem from '../../grid/components/nestedItems/menu';

import IconArrow from '../../icon/mui/navigation/expand_more';
import IconParent1 from '../../icon/mui/social/notifications';
import IconParent2 from '../../icon/mui/action/explore';
import IconParent4 from '../../icon/mui/action/lock';
import IconChild1 from '../../icon/mui/action/update';
import IconChild2 from '../../icon/mui/action/verified_user';


/* !- Context */

import withGridContext from './withGridContext';


/* !- Constants */

import { DATE_FORMAT, DATETIME_FORMAT } from '../../calendar/constants';
import { DATA, DATA_MESSAGES, DATA_HIERARCHY } from '../../.examples/grid/constants';

const SETTINGS = { paginate: { limit: 0 } };

const fakeApi = (records: any[]) => () => Promise.resolve({ status: 'SUCCESS', records });

const withLayout = (Story: any) => (
  <div className="p-3" style={{ maxWidth: 560 }}>
    <Story />
  </div>
);


/* !- Level elements */

/**
 * Egyszerű csoportcím + elemek
 */
const SimpleItem = ({ index, children, items }: any) => {
  if (children) {
    return (
      <div>
        <div className="text-xs bold text-gray pt-2 pb-1">{index.substring(1)}</div>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className="pl-1 h-center h-4">
      <div className="ellipsis">{items.name}</div>
    </div>
  );
};

/**
 * Lenyitható szülő (fa)
 */
const Parent = ({ level, title, children }: any) => {
  const [active, setActive] = useState(false);

  return (
    <div style={{ padding: `0 0 1.5rem ${level * 2}rem` }}>
      <div className="h-center pointer" onClick={() => setActive(!active)}>
        <IconArrow
          className={`w-2 h-2 rotate-${270 * +!active}`}
          style={{ transition: 'all 0.2s ease-out' }}
        />
        <span className="pl-1">{title}</span>
      </div>
      {active && <div className="pt-1">{children}</div>}
    </div>
  );
};

const TreeItem = ({ index, children, level, items }: any) => {
  if (children) {
    return <Parent level={level} title={index.substring(1)}>{children}</Parent>;
  }

  return (
    <div style={{ padding: `0 0 1.5rem ${Math.max(level + 1, 3)}rem` }}>
      {items.name}
    </div>
  );
};


/* !- Views */

type ViewProps = {
  id: string,
  records: any[],
  responseParser?: (response: any) => any[],
  listProps: Record<string, any>,
};

const NestedListView = ({ id, records, responseParser, listProps }: ViewProps) => (
  <GridView
    id={id}
    api={fakeApi(records)}
    settings={SETTINGS}
    responseParser={responseParser}
    preloader={false}
  >
    <Connect>
      <NestedList {...listProps} />
    </Connect>
  </GridView>
);


/* !- Stories */

const meta = {
  title: 'Grid/NestedList',
  component: NestedListView,
  decorators: [withLayout, withGridContext],
} satisfies Meta<typeof NestedListView>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Csoportosított lista (groupBy: 1 szint) */

export const Grouped: Story = {
  args: {
    id: 'story-nested-grouped',
    records: DATA,
    listProps: { groupBy: ['visits'], UI: SimpleItem },
  },
};

Grouped.storyName = 'Csoportosított lista';


/* !- Fa (groupBy: 2 szint, lenyitható) */

export const TreeStyle: Story = {
  args: {
    id: 'story-nested-tree',
    records: DATA,
    listProps: { groupBy: ['visits', 'gender'], UI: TreeItem },
  },
};

TreeStyle.storyName = 'Fa (lenyitható)';


/* !- Chat (nap + küldő szerint) */

export const Chat: Story = {
  args: {
    id: 'story-nested-chat',
    records: DATA_MESSAGES,
    responseParser: ({ records }: any) => records.map((record: any) => ({
      ...record,
      createdDate: moment(record.createdDateTime, DATETIME_FORMAT).format(DATE_FORMAT),
    })),
    listProps: { groupBy: ['createdDate', 'sender'], UI: Messages, UiProps: { userId: 2 } },
  },
};

Chat.storyName = 'Chat üzenetek';


/* !- Szülő-gyerek hierarchia (nestedDataKey / nestedDataParentKey) */

export const ParentChild: Story = {
  args: {
    id: 'story-nested-hierarchy',
    records: DATA_HIERARCHY,
    responseParser: ({ records }: any) => records.map((record: any) => ({
      ...record,
      title: record.title || record.name,
      dimension: record.dimension?.join(', '),
      rotation: record.rotation?.join(', '),
      position: record.position?.join(', '),
    })),
    listProps: { nestedDataKey: 'name', nestedDataParentKey: 'parent', UI: Hierarchy },
  },
};

ParentChild.storyName = 'Szülő-gyerek hierarchia';


/* !- Menü (Tree model, grid nélkül) */

const MENU = new Tree([
  { id: 1, status: 1, title: 'Értesítések', pid: 0, pos: 0, icon: IconParent1 },
  { id: 2, status: 1, title: 'Frissítések', pid: 1, pos: 1, icon: IconChild1 },
  { id: 3, status: 1, title: 'Jóváhagyások', pid: 1, pos: 0, icon: IconChild2 },
  { id: 4, status: 1, title: 'Útvonalak', pid: 5, pos: 0, icon: IconChild1, value: 12 },
  { id: 5, status: 1, title: 'Felfedezés', pid: 0, pos: 1, icon: IconParent2, badge: 2 },
  { id: 6, status: 1, title: 'Emlékeztetők', pid: 1, pos: 2, icon: IconParent1 },
  { id: 7, status: 1, title: 'Heti összesítő', pid: 2, pos: 0, icon: IconParent1 },
  { id: 8, status: 1, title: 'Kedvencek', pid: 5, pos: 1, active: true, icon: IconChild2, value: 1 },
  { id: 9, status: 1, title: 'Zárolt', pid: 0, pos: 2, icon: IconParent4 },
]);

export const Menu: StoryObj = {
  render: ({ minimalized }: any) => (
    <div style={{ width: minimalized ? 80 : 300 }}>
      <NestedList
        nestedData={MENU.getNestedTree()}
        UI={MenuItem(MENU, (item: any) => console.log(item), { minimalized })}
      />
    </div>
  ),
  args: { minimalized: false },
};

Menu.storyName = 'Menü';


/* !- Accordion (kész elemek, nestedData) */

export const AccordionList: StoryObj = {
  render: () => (
    <NestedList
      UI={[Accordion, Accordion]}
      nestedData={{
        'Szállítás': [<div key="1">Házhozszállítás 2–5 munkanapon belül.</div>],
        'Fizetés': [
          <div key="1">Bankkártya, átutalás</div>,
          <div key="2">Utánvét</div>,
        ],
      }}
      className="accordion"
    />
  ),
};

AccordionList.storyName = 'Accordion';
