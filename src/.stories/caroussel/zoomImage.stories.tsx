import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

require('../../../assets/style/index.scss');


/* !- Components */

import ZoomImage from '../../caroussel/zoomImage';


/* !- Constants */

const IMAGE = 'https://www.rs.hu/library/c3/3b/3c/90/c33b3c903608ae5d805c827c47b017a9';


const meta: Meta<typeof ZoomImage> = {
  title: 'Caroussel/ZoomImage',
  component: ZoomImage,
  decorators: [
    Story => (
      <div className="border" style={{ width: '800px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    src: `${IMAGE}_1200x1200.jpg?fitWidthIn=&aspectRatio=1`,
    srcZoom: `${IMAGE}_3600x3600.jpg?fitWidthIn=&aspectRatio=1`,
    alt: 'Konyha',
    scale: 2.5,
  },
};

export default meta;

type Story = StoryObj<typeof ZoomImage>;

/**
 * Egér: kattints egy pontra, oda nagyít, egérmozgatással pásztáz, újabb kattintásra kicsinyít.
 * Érintés: csippentés, dupla koppintás, nagyítva egyujjas mozgatás.
 */
export const Default: Story = {};

/**
 * Nagy felbontású kép nélkül ugyanazt a képet nagyítja
 */
export const WithoutZoomSource: Story = {
  args: {
    srcZoom: undefined,
  },
};
