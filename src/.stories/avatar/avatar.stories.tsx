import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Components */

import Avatar from '../../avatar';


/* !- Stories */

const meta = {
  title: 'Avatar',
  component: Avatar,
  args: {
    name: 'Gulyás Róbert',
    size: '128x128',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;


/* !- Kép nélkül: monogram */

export const Monogram: Story = {};

Monogram.storyName = 'Monogram';


/* !- Profilkép (a library-ből méretezve; a story-ban csak létező fájl-id-vel látszik) */

export const Image: Story = {
  args: {
    avatar: { id: 1, ext: 'jpg' },
  },
};

Image.storyName = 'Profilkép';


/* !- Nagyítva (em-alapú méret) */

export const Zoomed: Story = {
  args: {
    className: 'zoom-2.5',
  },
};

Zoomed.storyName = 'Nagyítva (zoom-2.5)';
