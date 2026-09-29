import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Contexts */

import { bindFormContexts } from '../context';


/* !- React Elements */

import Field from '../formField';


/* !- Megjelenés: assets/style/components/segment.scss (.segment-track, .segment-item) */


/**
* Segmented control (pill toggle) — data-vezérelt, form-kötött mező.
* Az első elem az alapértelmezett, ha nincs sem `value`, sem `default`.
*
* @extends Field
* @example
* <Segment
*   id="output"
*   data={[{ id: 'chart', title: 'Chart' }, { id: 'csv', title: 'CSV' }]}
* />
*/
class Segment extends Field {
  trackRef = React.createRef();

  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }

    // Alapértelmezett = első elem (ha nincs sem value, sem default prop).
    if (typeof this.props.default === 'undefined' && !this.state.value && this.data.length) {
      this.onChangeHandler(this.data[0].id);
    }

    this.updateThumb();

    // a sáv szélessége változhat (reszponzív panel), ilyenkor újra kell mérni
    if (typeof ResizeObserver !== 'undefined' && this.trackRef.current) {
      this.resizeObserver = new ResizeObserver(() => this.updateThumb());
      this.resizeObserver.observe(this.trackRef.current);
    }
  }

  componentDidUpdate() {
    if (super.componentDidUpdate) {
      super.componentDidUpdate();
    }

    this.updateThumb();
  }

  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * A kiválasztás-jelölő az aktív elem alá csúszik, ezért méretre van szükség.
   * Mérés DOM-ból, hogy különböző szélességű elemeknél is pontos legyen.
   */
  updateThumb() {
    const track = this.trackRef.current;

    if (!track) {
      return;
    }

    const item = track.querySelector('.segment-item.active');
    const thumb = item ? { left: item.offsetLeft, width: item.offsetWidth } : null;

    const { thumb: prev } = this.state;

    if (prev?.left === thumb?.left && prev?.width === thumb?.width) {
      return;
    }

    this.setState({ thumb });
  }

  onClickItemHandler = (id) => (event) => {
    event.preventDefault();
    this.onChangeHandler(id);
  };

  render() {
    return super.render() || (
      <div className={this.getClasses('segment')}>

        {this.label}

        <div className="segment-track" ref={this.trackRef}>

          {this.state.thumb &&
            <div
              className="segment-thumb"
              style={{
                transform: `translateX(${this.state.thumb.left}px)`,
                width: this.state.thumb.width,
              }}
            />
          }

          {this.data.map((item) => {
            const active = item.id.toString() === (this.state.value ?? '').toString();
            const title = (this.props.intl && this.props.dataTranslate)
              ? this.props.intl.formatMessage({ id: item.title, default: item.title })
              : item.title;

            return (
              <button
                key={item.id}
                type="button"
                className={classNames('segment-item initial', { active })}
                onClick={this.onClickItemHandler(item.id)}
                disabled={this.props.disabled}
              >
                {title}
              </button>
            );
          })}
        </div>

        {this.state.error &&
          <div className="error">{this.state.error}</div>
        }
      </div>
    );
  }
}


/**
 * propTypes
 * @override
 */
Segment.propTypes =
{
  ...Segment.propTypes,
  data: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    })),
  ]),
};

/**
 * defaultProps
 */
Segment.defaultProps =
{
  ...Segment.defaultProps,
  data: [],
};


export default bindFormContexts(Segment);
