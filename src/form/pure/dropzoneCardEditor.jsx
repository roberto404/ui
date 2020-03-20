import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { File } from './dropzone';

/* !- Redux Actions */

import { setData } from '../../grid/actions';


/* !- React Elements */

import Caroussel from '../../caroussel/caroussel';
import Card from '../../card/card';
import Marker from '../../card/marker';
import IconPlus from '../../icon/mui/content/add';
import IconCreate from '../../icon/mui/content/create';
import IconDelete from '../../icon/mui/action/delete_forever';


// TODO
import { createMarkers } from '../../card/marker';


const DEFAULT_STATE =
{
  // page: 0,
  // // editAble: false,
  markers: [],
  title: '',
  subTitle: '',
  url: ''
};

const Preload = ({ title, id, percent }) =>
(
  <div>{title} {percent}%</div>
)


class CardEditor extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { markers: [], ...props.item };
  }

  /* !- Handlers */

  onClickMarkerHandler = (event) =>
  {
    event.preventDefault();

    const id = event.currentTarget.dataset.id;
    const marker = this.props.defaultMarkers[id];

    if (marker)
    {
      this.setState({ markers: [...this.state.markers || [], marker] });
    }
  }

  onClickSaveHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange(this.state);
  }

  onClickCancelHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange(this.props.item)
  }

  onClickDeleteHandler = (event) =>
  {
    event.preventDefault();
    this.props.onChange();
  }

  onChangeInputHandler = (event) =>
  {
    this.setState({ [event.target.id]: event.target.value });
  }

  render()
  {
    return (
      <div style={{ width: '500px' }}>

        <div className="v-justify bg-gray-white shadow-outer-2 mb-1 rounded border border-gray-light">
          <div className="flex">
            <button data-id="heading" onClick={this.onClickMarkerHandler}>heading</button>
            <button data-id="tooltip" onClick={this.onClickMarkerHandler}>tooltip</button>
            <button data-id="product" onClick={this.onClickMarkerHandler}>product</button>
          </div>
          <div className="flex">
            <button className="bg-white" onClick={this.onClickSaveHandler}>Mentés</button>
            <button className="bg-white" onClick={this.onClickCancelHandler}>Mégse</button>
            <button className="bg-white" onClick={this.onClickDeleteHandler}>
              <IconDelete className="fill-red-light" />
              <span>Törlés</span>
            </button>
          </div>
        </div>

        <Card
          // image={'https://picsum.photos/250/250'}
          image={new File(this.props.item).getUrl('1140x570')}
          createMarkers={createMarkers}
          markers={this.state.markers}>
        </Card>

        <div>
          <input
            value={this.state.title}
            id="title"
            onChange={this.onChangeInputHandler}
            placeholder="title"
          />
          <textarea
            value={this.state.subTitle}
            id="subTitle"
            onChange={this.onChangeInputHandler}
            placeholder="subTitle"
          />
          <input
            value={this.state.url}
            id="url"
            onChange={this.onChangeInputHandler}
            placeholder="url"
          />
        </div>

      </div>
    );
  }
}

CardEditor.defaultProps =
{
  defaultMarkers: {
    heading: {
      category: 'heading',
      position: [50,50],
      settings: 'Szöveg helye',
    },
    tooltip: {
      category: 'tooltip',
      position: [50, 50],
      settings: 'Szöveg helye',
    },
    product: {
      category: 'product',
      position: [50, 50],
      settings: '',
    },
  },
  store: PropTypes.object,
};


export default CardEditor;
