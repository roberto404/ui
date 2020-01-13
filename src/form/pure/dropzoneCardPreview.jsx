import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { File } from './dropzone';

/* !- Redux Actions */

import { setData } from '../../grid/actions';


/* !- React Elements */

import Caroussel from '../../caroussel/caroussel';
import Card from '../../card/card';
import Marker from '../../card/marker';
import IconCreate from '../../icon/mui/content/create';


// TODO
import { createMarkers } from '../../card/marker';



const Preload = ({ title, id, percent }) =>
(
  <div>{title} {percent}%</div>
)


class CardPreview extends Component
{

  /* !- Handlers */

  onClickEditHandler = () =>
  {
    const grid = this.context.store.getState().grid[this.props.id];
    const itemIndex = grid.page - 1;

    this.props.onEdit(itemIndex)
  }

  render()
  {
    const slides = this.props.items.map(item =>
    ({
      id: item.id,
      slide: item.percent === undefined ?
        (
          <Card
            // image={'https://picsum.photos/300/200'}
            image={new File(item).getUrl('1140x570')}
            createMarkers={createMarkers}
            markers={item.markers}
            title={item.title}
            subTitle={item.subTitle}
          />
        )
      :
        (
          <Preload {...item} />
        ),
    }));

    this.context.store.dispatch(setData(slides, null, this.props.id));

    return (
      <div className="relative m-auto">
        <Caroussel
          id={this.props.id}
        />
        <Marker position={[100, 100]} align={[-100, -100]}>
          <div className="p-1/2 fill-white w-3 h-3 bg-yellow pointer" onClick={this.onClickEditHandler}>
            <IconCreate />
          </div>
        </Marker>
      </div>
    );
  }
}

CardPreview.defaultProps =
{
};

CardPreview.contextTypes =
{
  store: PropTypes.object,
};


export default CardPreview;
