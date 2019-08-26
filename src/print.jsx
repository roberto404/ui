
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import print from '@1studio/utils/window/print';
import IconPrint from './icon/mui/action/print';

/* !- Constants */

const PREVIEW_ID = 'print-preview';


/**
 * Print Component
 * @example
 */
class Print extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      active: false,
    };
  }

  componentDidMount = () =>
  {
    if (this.props.autoprint && this.state.active === false)
    {
      this.setState({ active: true });
    }
  }

  componentDidUpdate = () =>
  {
    if (this.printPreview)
    {
      print(this.printPreview, this.onPrintListen);
    }
  }


  /* !- Listeners */

  onPrintListen = () =>
  {
    this.setState({ active: false });
  }


  /* !- Handlers */

  /**
   * Reload if listens state props changed
   * @private
   */
  onClickPrintHandler = () =>
  {
    this.setState({ active: true });
  }

  render()
  {
    return (
      <div className={this.props.className}>

        { this.state.active === true &&
        <div style={{ display: 'none' }}>
          <div
            id={PREVIEW_ID}
            className=""
            ref={(ref) =>
            {
              this.printPreview = ref;
            }}
          >
            {React.createElement(this.props.pages)}
          </div>
        </div>
        }

        <div onClick={this.onClickPrintHandler} >
          {this.props.children}
        </div>
      </div>
    );
  }
}

Print.propTypes =
{
  /**
   * Class of CTA
   */
  className: PropTypes.string,
  /**
   * Target component which will be print
   */
  pages: PropTypes.func.isRequired,
  /**
   * Automatically print, no need user action
   */
  autoprint: PropTypes.bool,
  /**
   * CTA content
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]),
};

Print.defaultProps =
{
  className: 'w-2 h-2 pointer',
  autoprint: false,
  children: <IconPrint />,
};

export default Print;
