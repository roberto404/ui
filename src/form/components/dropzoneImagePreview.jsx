import React, { Component } from 'react';
import File from '../file';
import { ReactReduxContext } from 'react-redux';

/* !- Redux Actions */

import { setData } from '../../grid/actions';


/* !- React Elements */

import Caroussel from '../../caroussel/caroussel';
import Card from '../../card/card';
import Marker from '../../card/marker';
import IconCreate from '../../icon/mui/content/create';
import classNames from 'classnames';
import Pages from '../../pagination/pure/pages';


const Preload = ({ title, id, percent }) =>
(
  <div className="v-center h-center column" style={{ height: '250px' }}>
    <div className="preloader" />
    <div className="mt-1">{title}</div>
  </div>
);



const PageThumbnail = images => ({ active, onClick, page }) =>
{
  if (typeof images[page - 1].percent !== 'undefined')
  {
    return (
      <div className="w-5 h-5 mr-1" style={{ padding: '1.5rem' }}>
        <div className="preloader" style={{ width: '100%', height: '100%' }} />
      </div>
    )
  }

  return (
    <div
      className={classNames({ 'shadow-outer border border-gray-light': active, 'pointer': !active, 'rounded w-5 h-5 mr-1 embed': true })}
      onClick={onClick}
      style={{ backgroundImage: `url(${new File(images[page - 1]).getUrl('250x250')})` }}
    />
  );
}


class ImagePreview extends Component
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
            image={new File(item).getUrl('250x250')}
          />
        )
      :
        (
          <Preload {...item} />
        ),
    }));

    this.context.store.dispatch(setData(slides, null, this.props.id));

    return (
      <div>
        <div className="relative m-auto" style={{ maxWidth: '250px' }}>
          <Caroussel
            id={this.props.id}
            disablePages
          />
          <Marker position={[100, 100]} align={[-100, -100]}>
            <div className="p-1/2 fill-white w-3 h-3 bg-yellow pointer" onClick={this.onClickEditHandler}>
              <IconCreate />
            </div>
          </Marker>
        </div>

        <Pages
          className="flex"
          id={this.props.id}
          UI={PageThumbnail(this.props.items)}
          images={this.props.items}
        />
      </div>
    );
  }
}

ImagePreview.contextType = ReactReduxContext;


export default ImagePreview;
