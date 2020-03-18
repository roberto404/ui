import React, { Component }  from 'react';

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
      dragIndex: -1,
      nextIndex: -1,
    };

    this.childrenRefs = [];

    this.children = props.children.map((element, index) =>
      React.cloneElement(
        element,
        {
          key: index,
          draggable: true,
          onDragStart: (e) => this.onDragStartHandler(e , index),
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

  onDragStartHandler = (event, index) =>
  {
    this.setState({ dragIndex: index })
  }

  onDragOverHandler = (event) =>
  {
    event.preventDefault();

    const x = event.clientX + window.pageXOffset;
    const y = event.clientY + window.pageYOffset;

    const index = this.getNextIndex({ x, y });

    if (this.state.nextIndex !== index)
    {
      this.setState({
        nextIndex: index,
      });
    }
  }

  onDropHandler = (event) =>
  {

    // event.preventDefault();
    // console.log('drop', event,  id);
    console.log(this.state.dragIndex, this.state.nextIndex);
    this.setState({
      dragIndex: -1,
      nextIndex: -1,
    })
  }


  getNextIndex = ({ x, y }) =>
  {
    const childrenRect = this.childrenRefs.map(child => child.getBoundingClientRect());
    const lastChild = childrenRect[childrenRect.length - 1];

    // const xDiff = childrenRect.map(child => Math.min(Math.abs(child.x - x), Math.abs(child.x + child.width - x)));
    const xDiff = [
      ...childrenRect.map(child => Math.abs(child.x - x)),
      // (lastChild.x + lastChild.width - x),
    ];

    const xMin = Math.min(...xDiff);
    const index = xDiff.findIndex(value => value === xMin);

    return index;
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


    const children = [
      ...this.children,
      <div
        key="@placeholder"
        className={this.props.placeholderClassName}
        style={placeholderStyle} />
    ];

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
  placeholderClassName: 'w-2 h-2 bg-blue',
};


export default Sortable;
