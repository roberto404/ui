import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Components */

import Collapse from '../../collapse';
import IconClose from '../../icon/mui/navigation/close';


/* !- Demo */

type PanelPropTypes = {
  title: string,
  onClose: () => void,
};

/**
 * Nyíló panel tartalma, saját bezáró gombbal
 */
const Panel = ({ title, onClose }: PanelPropTypes) => (
  <div className="card relative h-full">
    <div
      role="button"
      tabIndex={-1}
      className="absolute pin-r pin-t m-1 pointer rounded p-1/4 text-line-0 fill-gray hover:bg-gray-light"
      onClick={onClose}
    >
      <IconClose className="w-2 h-2" />
    </div>

    <div className="text-s text-gray light">{title}</div>
    <div className="pt-1">
      A panel mérete folyamatosan animálódik, így a mellette vagy alatta lévő
      tartalom is folyamatosan igazodik hozzá.
    </div>
  </div>
);

const Button = ({ title, onClick }: { title: string, onClick: () => void }) => (
  <div className="button outline w-content p-1/2 px-2" onClick={onClick}>
    {title}
  </div>
);

type DemoPropTypes = React.ComponentProps<typeof Collapse>;

/**
 * Fentről nyíló panel, alatta a tartalom, amit lejjebb tol
 */
const VerticalDemo = ({ open, children, ...props }: DemoPropTypes) => {

  const [isOpen, setOpen] = useState(open);

  return (
    <div className="column gap-1" style={{ width: 480 }}>
      <Button
        title={isOpen ? 'bezár' : 'kinyit'}
        onClick={() => setOpen(!isOpen)}
      />

      <Collapse open={isOpen} {...props}>
        <Panel title="Statisztika" onClose={() => setOpen(false)} />
      </Collapse>

      <div className="card">
        Alatta lévő tartalom, ezt tolja lejjebb / húzza feljebb a panel.
      </div>
    </div>
  );
};

/**
 * Oldalt nyíló panel, mellette a tartalom, amit összeszűkít
 */
const HorizontalDemo = ({ open, children, ...props }: DemoPropTypes) => {

  const [isOpen, setOpen] = useState(open);

  return (
    <div className="column gap-1" style={{ width: 640 }}>
      <Button
        title={isOpen ? 'bezár' : 'kinyit'}
        onClick={() => setOpen(!isOpen)}
      />

      <div className="flex gap-1">
        <Collapse open={isOpen} {...props}>
          <Panel title="Szűrő" onClose={() => setOpen(false)} />
        </Collapse>

        <div className="card grow">
          Mellette lévő tartalom, ez szűkül / szélesedik a panel mozgásával.
        </div>
      </div>
    </div>
  );
};


/* !- Stories */

const meta = {
  title: 'Collapse',
  component: Collapse,
  argTypes: {
    axis: {
      control: 'inline-radio',
      options: ['height', 'width'],
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.05 },
    },
  },
} satisfies Meta<typeof Collapse>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Basic */

/**
 * Fentről nyíló panel. Az `open` arg a kezdőállapotot adja, utána a gombbal
 * (vagy a panel bezáró gombjával) kapcsolható.
 */
export const Basic: Story = {
  args: {
    open: true,
    axis: 'height',
    size: 'auto',
    duration: 0.35,
    fade: true,
  },
  render: (args) => <VerticalDemo {...args} />,
};

Basic.storyName = 'Magasság (auto)';


/* !- Fix méret */

/**
 * Fix magasság: a tartalom mérete nem számít, mindig a megadott méretre nyílik
 */
export const FixedSize: Story = {
  args: {
    ...Basic.args,
    size: 160,
    fade: false,
    duration: 0.6,
  },
  render: (args) => <VerticalDemo {...args} />,
};

FixedSize.storyName = 'Magasság (fix)';


/* !- Oldalsó panel */

/**
 * Oldalt megjelenő panel: a `width` animálódik, a mellette lévő tartalom
 * folyamatosan szűkül. Rugós (spring) transition.
 */
export const Horizontal: Story = {
  args: {
    open: true,
    axis: 'width',
    size: '24rem',
    fade: true,
    transition: { type: 'spring', stiffness: 400, damping: 40 },
  },
  render: (args) => <HorizontalDemo {...args} />,
};

Horizontal.storyName = 'Szélesség (oldalsó panel)';
