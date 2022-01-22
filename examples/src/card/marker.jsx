import React from 'react';

import IconPlus from '../../../src/icon/mui/content/add';
import Card from '../../../src/card/card';
import Marker from '../../../src/card/marker';

const Example = () =>
(
  <div>
    <div className="heavy text-xxl pb-1">Markers</div>
    <Card
      image="https://picsum.photos/1000/500"
      markers={[
        {
          category: 'heading',
          position: [0, 100],
          settings: 'Nappali bútorok',
        },
        {
          category: 'tooltip',
          position: [17, 36],
          settings: 'Nem eladó!',
        },
        {
          category: 'product',
          position: [50, 50],
          settings: 'sku',
        },
      ]}
    />

    <div className="heavy text-xxl pb-1 pt-4">Custom Markers</div>
    <Card
      image="https://picsum.photos/1000/500"
    >
      <Marker position={[50, 50]} align={[-50, -50]}>
        <div className="p-2 text-yellow shadow heavy" style={{ fontSize: '4em' }}>Nappali bútorok</div>
      </Marker>
      <Marker position={[50, 35]} align={[-50, -50]} onClick={() => alert(1)}>
        <button className="yellow circle">
          <IconPlus className="w-4 h-4" />
        </button>
      </Marker>
    </Card>

    <div className="heavy text-xxl pb-1 pt-4">Marker everywhere</div>
    <div className="grid-3">
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/1000/500"
          title="Szilaj bútorcsalád"
          subTitle="Borovi fenyőből készült minimál stílusú nappali bútorcsalád."
          border
          markers={[
            {
              category: 'heading',
              position: [0, 100],
              settings: 'Nappali bútorok',
            },
            {
              category: 'tooltip',
              position: [17, 36],
              settings: 'Nem eladó!',
            },
            {
              category: 'product',
              position: [50, 50],
              settings: 'sku',
            },
          ]}
        />
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/1000/500"
          title="DominoGo"
          subTitle="A bútorcsalád elemválasztékát nagyfokú variálhatóság jellemzi."
          border
        >
          <Marker position={[50, 50]} align={[-50, -50]}>
            <div className="text-xxl text-red heavy">DominoGo</div>
          </Marker>
        </Card>
      </div>
      <div className="col-1-3">
        <Card
          image="https://picsum.photos/1000/500"
          title="Nepo"
          subTitle="Variálható elemes kisbútorcsalád, előszobába, nappali vagy ifjúsági szobába egyaránt ajánlott sonoma tölgy és sonoma tölgy-fehér színkombinációban."
          border
          markers={[
            {
              category: 'heading',
              position: [0, 100],
              settings: 'Nappali bútorok',
            },
            {
              category: 'tooltip',
              position: [17, 36],
              settings: 'Nem eladó!',
            },
            {
              category: 'product',
              position: [50, 50],
              settings: 'sku',
            },
          ]}
        />
      </div>
    </div>


  </div>
);


export default Example;
