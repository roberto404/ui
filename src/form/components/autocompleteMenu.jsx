import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


/* !- React Elements */

import IconImage from '../../icon/mui/image/image';


/**
 * Autocomplete menu parts: headerElement / footerElement / rowElement building blocks
 *
 * @example
 * <Autocomplete
 *   headerElement={({ records }) => <AutocompleteMenuHeader title="Termékek" count={records.length} />}
 *   footerElement={AutocompleteMenuFooter}
 *   rowElement={({ item, focus }) => <AutocompleteMenuRow title={item.title} focus={focus} />}
 * />
 */


/**
 * ┌──────────────────────────────┐
 * │ TERMÉKEK            8 találat │
 * └──────────────────────────────┘
 */
export const AutocompleteMenuHeader = ({ title, count }) => (
  <div className="flex v-justify h-center px-2 py-1 text-s">
    <div className="uppercase bold text-gray-dark">{title}</div>
    {typeof count === 'number' &&
      <div className="text-gray-dark">{`${count} találat`}</div>
    }
  </div>
);

AutocompleteMenuHeader.propTypes = {
  title: PropTypes.node,
  count: PropTypes.number,
};


/**
 * ┌───────────────────────────────────────────────────────────────┐
 * │ ↑ ↓ navigálás  Enter kiválasztás  Esc bezárás   Összes találat →│
 * └───────────────────────────────────────────────────────────────┘
 *
 * Props of Autocomplete footerElement ({ term, isAll, showAll }), the "show all" link is visible
 * if there are hidden records and the search term is at least minLength chars
 */
export const AutocompleteMenuFooter = ({
  term = '',
  isAll,
  showAll,
  minLength,
  showAllTitle,
}) => (
  <div className="flex v-justify h-center gap-1 px-2 py-1 text-s bg-white-dark">
    <div className="flex h-center gap-1/2 text-gray-dark nowrap">
      <span className="shortcut">↑</span>
      <span className="shortcut">↓</span>
      <span className="mr-1">navigálás</span>
      <span className="shortcut">Enter</span>
      <span className="mr-1">kiválasztás</span>
      <span className="shortcut">Esc</span>
      <span>bezárás</span>
    </div>

    {!isAll && term.length >= minLength && typeof showAll === 'function' &&
      <div
        className="text-blue-dark bold pointer nowrap"
        onClick={() => showAll()}
      >
        {showAllTitle}
      </div>
    }
  </div>
);

AutocompleteMenuFooter.propTypes = {
  term: PropTypes.string,
  isAll: PropTypes.bool,
  showAll: PropTypes.func,
  /**
   * The "show all" link needs a search term of at least this length
   */
  minLength: PropTypes.number,
  showAllTitle: PropTypes.node,
};

AutocompleteMenuFooter.defaultProps = {
  minLength: 3,
  showAllTitle: 'Összes találat megtekintése →',
};


/**
 * ┌────┐ Title                         [BADGE]
 * │ img│ subtitle                      9 990 Ft
 * └────┘ SKU [meta]                    7 990 Ft
 */
export const AutocompleteMenuRow = ({
  image,
  title,
  subtitle,
  code,
  meta,
  badge,
  badgeClassName,
  priceOrig,
  price,
  focus,
}) => (
  <div className="flex h-center gap-1 px-2 py-1">

    <div className="menu-thumbnail shrink-0 w-6 h-6 rounded border border-gray-light bg-white flex h-center v-center">
      {image ?
        <img src={image} alt="" />
        : <IconImage className="w-3 h-3 fill-gray-light" />
      }
    </div>

    <div className="grow column min-w-0">
      <div className={classNames('bold ellipsis', { 'text-blue-dark': focus })}>{title}</div>
      {subtitle &&
        <div className="text-s text-gray mt-1/2 ellipsis">{subtitle}</div>
      }
      {(code || (meta && meta.length > 0)) &&
        <div className="flex h-center gap-1/2 mt-1 text-s text-gray-dark nowrap">
          {code &&
            <span className="monospace mr-1/2 text-s">{code}</span>
          }
          {(meta || []).filter(i => i).map((item, index) => (
            <span key={index} className="bg-white-dark rounded p-1/2 px-1 text-s">{item}</span>
          ))}
        </div>
      }
    </div>

    <div className="shrink-0 text-right">
      {badge &&
        <div>
          <span className={classNames('tag rounded uppercase text-xxs mb-1', badgeClassName)}>{badge}</span>
        </div>
      }
      {priceOrig &&
        <div className="text-s text-gray strikethrough mb-1/2">{priceOrig}</div>
      }
      {price &&
        <div className="bold text-m nowrap">{price}</div>
      }
    </div>

  </div>
);

AutocompleteMenuRow.propTypes = {
  /**
   * Image url, without it a placeholder icon
   */
  image: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  /**
   * Monospace code (ex. SKU)
   */
  code: PropTypes.node,
  /**
   * Chips after the code (ex. dimension)
   */
  meta: PropTypes.arrayOf(PropTypes.node),
  badge: PropTypes.node,
  /**
   * tag color: red, gray-light...
   */
  badgeClassName: PropTypes.string,
  priceOrig: PropTypes.node,
  price: PropTypes.node,
  /**
   * Focused (keyboard) row
   */
  focus: PropTypes.bool,
};

AutocompleteMenuRow.defaultProps = {
  badgeClassName: 'gray-light',
  focus: false,
};
