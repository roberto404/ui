import React from 'react';

import View from '../../../src/view/view';


const ViewBasic = () =>
(
  <div>
    <View
      id='sample-view'
      defaultView='data'
      settings={{
        groups: {
          data: [
            { id: 'a', pos: 0, status: 1 },
            { id: 'b', pos: 1, status: 1 },
          ],
          record: [
            { id: 'c', pos: 0, status: 1 }
          ],
        }
      }}
      >
      <div
        data-view="b"
      >
        b
      </div>
      <div
        data-view="a"
      >
        a
      </div>
      <div
        data-view="c"
      >
        c
      </div>
    </View>
  </div>
);

export default ViewBasic;
