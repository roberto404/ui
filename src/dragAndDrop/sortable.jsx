import React, { Component }  from 'react';

import produceNumericArray from '@1studio/utils/array/produceNumericArray';
import clone from 'lodash/clone';

/**
 * [Sortable description]
 * @extends Component
 */
class Sortable extends Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      dragIndex: -1, // which child is draging
      nextIndex: -1, // element position will be this, when dragging is finish
    };

    /**
     * Collect child refs
     * @type {Array}
     */
    this.childrenRefs = [];

    /**
     * Inject children drag method
     */
    this.children = props.children.map((element, index) =>
      React.cloneElement(
        element,
        {
          key: index,
          draggable: true,
          onDragStart: (e) => this.onDragStartHandler(e , index),
          onDragEnd: (e) => this.onDragEndHandler(e , index),
          ref: this.pushChildRef,
        },
      )
    );
  }

  componentWillReceiveProps(nextProps)
  {
    console.log(nextProps);
  }

  componentDidMount()
  {
    this.forceUpdate();
  }

  pushChildRef = (node) =>
  {
    this.childrenRefs.push(node);
  }

  /**
   * Invoke once when the element dragging start
   */
  onDragStartHandler = (event, index) =>
  {
    const element = this.childrenRefs[index];

    this.ghost = element.cloneNode(true);
    this.ghost.className = this.props.classNameDragGhostElement;

    document.body.appendChild(this.ghost);
    event.dataTransfer.setDragImage(this.ghost, 0, 0);

    element.className = this.props.classNameDragElement;

    this.setState({ dragIndex: index })
  }

  /**
   * Invoke once when the element dragging finish
   */
  onDragEndHandler = (event, index) =>
  {
    const element = this.childrenRefs[index];

    // remove ghost dom
    document.body.removeChild(this.ghost);

    // reset class
    element.className = this.props.children[index].props.className;

    console.log('onDragEndHandler');
  }

  /**
   * Invoke when the element dragging is over container element.
   *
   * Calculate the next position
   */
  onDragOverHandler = (event) =>
  {
    console.log('onDragOverHandler');
    // event.preventDefault();

    const x = event.clientX + window.pageXOffset;
    const y = event.clientY + window.pageYOffset;

    const index = this.getNextIndex({ x, y });

    /**
     * Render if the position is changing
     */
    if (index !== -1 && this.state.nextIndex !== index)
    {
      this.setState({
        nextIndex: index,
      });
    }
  }

  /**
   * Invoke when the element dragging is finish
   */
  onDropHandler = (event) =>
  {
    // start index, end index
    console.log(this.state.dragIndex, this.state.nextIndex);

    // reset state
    this.setState({
      dragIndex: -1,
      nextIndex: -1,
    })
  }

  /**
   * Calculate which element is in focus by x,y mouse coordinates
   * @param  {int} x
   * @param  {int} y
   * @return {int}   index number
   */
  getNextIndex = ({ x, y }) =>
  {
    // get all child bounding rect
    const childrenRect = this.childrenRefs.map(child => child.getBoundingClientRect());

    return childrenRect.findIndex(({ left, bottom, top, right }) =>
      x < right && x > left && y < bottom && y > top);
  }


  render()
  {
    const placeholderStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      opacity: +(this.state.nextIndex !== -1) * 100,
    }

    if (this.state.nextIndex > -1)
    {
      const { left, top } = this.childrenRefs[this.state.nextIndex].getBoundingClientRect();

      placeholderStyle.left = left;
      placeholderStyle.top = top;
    }

    /**
     * Append child with placeholder DIV
     * This DIV appear the drag element new position
     */
    const children = [
      ...this.children,
      <div
        key="@placeholder"
        className={this.props.placeholderClassName}
        style={placeholderStyle}
      />,
    ];


    const { dragIndex, nextIndex } = this.state;

    // const children = clone(this.children);

    // if (dragIndex > -1)
    // {
    //   const dragElement = this.children[dragIndex];
    //   this.children.splice(dragIndex, 1);
    //   this.children.splice(nextIndex, 0, dragElement);
    // }


    // const children = produceNumericArray(
    //   0,
    //   this.children.length,
    //   i =>
    //   {
    //     if (i < nextIndex)
    //     {
    //       return this.children[i];
    //     }
    //     else if (i === nextIndex)
    //     {
    //       return this.children[dragIndex]
    //     }
    //     else if (i <= dragIndex)
    //     {
    //       return this.children[i - 1];
    //     }
    //     else
    //     {
    //       return this.children[i];
    //     }
    //   }
    // );



    // dragIndex, nextIndex ===> -1
    // console.log(this.state);




    return (
      <div
        className={this.props.className}
        onDragOver={this.onDragOverHandler}
        onDrop={this.onDropHandler}
      >
        {children}
      </div>
    );
  }
};

Sortable.defaultProps =
{
  classNameDragElement: 'opacity-20',
  classNameDragGhostElement: 'opacity-100',
  placeholderClassName: 'w-2 h-2 bg-red',
};


export default Sortable;
