import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { File } from './dropzone';

/* !- Redux Actions */

import { setData } from '../../grid/actions';


/* !- React Elements */

import Caroussel from '../../caroussel/caroussel';
import Card from '../../card/card';
import IconDelete from '../../icon/mui/action/delete_forever';


const Preload = ({ title, id, percent }) =>
(
  <div>{title} {percent}%</div>
)


class CardEditor extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { ...props.item };
  }

  /* !- Handlers */

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

  render()
  {
    return (
      <div>
        <div className="v-justify bg-gray-white shadow-outer-2 mb-1 rounded border border-gray-light">
          <div />
          <div className="flex ">
            <button className="bg-white" onClick={this.onClickCancelHandler}>Mégse</button>
            <button className="bg-white" onClick={this.onClickDeleteHandler}>
              <IconDelete className="fill-red-light" />
              <span>Törlés</span>
            </button>
          </div>
        </div>

        <Card
          image={new File(this.props.item).getUrl('640x480')}
        />

      </div>
    );
  }
}

CardEditor.defaultProps =
{
  store: PropTypes.object,
};


export default CardEditor;
