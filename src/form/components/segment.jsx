import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- Contexts */

import { bindFormContexts } from '../context';


/* !- React Elements */

import Field from '../formField';


/* !- Inline stílus (a Chat|Cowork pill-megjelenéshez; később CSS-be emelhető) */

const styles = {
  track: {
    display: 'inline-flex',
    padding: 2,
    gap: 2,
    background: '#ececec',
    borderRadius: 999,
  },
  item: {
    border: 0,
    cursor: 'pointer',
    borderRadius: 999,
    padding: '4px 16px',
    fontWeight: 600,
    color: '#8a8a8a',
    background: 'transparent',
    lineHeight: 1.4,
  },
  itemActive: {
    color: '#111',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.12)',
  },
};


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
  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }

    // Alapértelmezett = első elem (ha nincs sem value, sem default prop).
    if (typeof this.props.default === 'undefined' && !this.state.value && this.data.length) {
      this.onChangeHandler(this.data[0].id);
    }
  }

  onClickItemHandler = (id) => (event) => {
    event.preventDefault();
    this.onChangeHandler(id);
  };

  render() {
    return super.render() || (
      <div className={this.getClasses('segment')}>

        {this.label}

        <div className="segment-track" style={styles.track}>
          {this.data.map((item) => {
            const active = item.id.toString() === (this.state.value ?? '').toString();
            const title = (this.props.intl && this.props.dataTranslate)
              ? this.props.intl.formatMessage({ id: item.title, default: item.title })
              : item.title;

            return (
              <button
                key={item.id}
                type="button"
                className={classNames('segment-item', { active })}
                style={{ ...styles.item, ...(active ? styles.itemActive : {}) }}
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
