import React from 'react';

/* !-- Actions */

import { remove } from './actions';


/* !-- Components */

import IconInfo from '../icon/mui/action/info';
import { templates } from './templates';
import NotificationItemWrapper from './itemWrapper';
import NotificationLayout, { NotificationButton } from './layout';


/* !-- Constants */


/* !-- Types */

import { Templates } from './templates';
import { useDispatch } from 'react-redux';
import type { ButtonVariant, IconType, NotificationColor, NotificationColors } from './layout';

export type Button = {
  title: React.ReactNode,
  handler?: (onClose: () => void) => void,
  icon?: IconType,
  /** primary = kitöltött, outline = körvonalas (alapértelmezett), secondary = semleges */
  variant?: ButtonVariant,
  /** variant nélkül teljesen egyedi osztály (régi gombok) */
  className?: string,
};

export type PropTypes = {
  id?: string | number,
  title: React.ReactNode,
  caption?: React.ReactNode,
  color?: NotificationColor;
  /** egyedi színek, felülírják a `color` tónust */
  colors?: NotificationColors;
  /** kis címke a cím fölött (pl. HIBA, SIKERES) */
  badge?: React.ReactNode;
  /** rövid megjegyzés a gombok mellett */
  hint?: React.ReactNode;
  /** középre zárt elrendezés (kör ikon, középre zárt szöveg és gomb) */
  centered?: boolean;
  Icon?: IconType;
  buttons?: Button[];
  template?: Templates,
  payload?: {},
  children?: React.ReactNode,
  componentKey?: string,
  disableClose?: boolean;
  closeOnChangeLocation?: boolean;
  autoClose?: boolean | number;
};


/**
*
*/
const NotificationItem = (props: PropTypes) => {

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(remove(props.id));
  }

  if ('template' in props) {

    const ItemTemplate = templates[props.template];

    return (
      <NotificationItemWrapper {...props}>
        <ItemTemplate {...props} onClose={onClose} />
      </NotificationItemWrapper>
    );
  }

  const {
    title = '',
    caption = '',
    badge,
    hint,
    centered,
    Icon = IconInfo,
    buttons = [],
  } = props;

  const actions = buttons.length > 0 && buttons.map((button, i) => (
    <NotificationButton
      key={i}
      title={button.title}
      icon={button.icon}
      variant={button.variant || (button.className ? undefined : 'outline')}
      className={button.className}
      onClick={() => {
        if (button.handler) {
          button.handler(onClose);
        }

        if (props.autoClose !== false) {
          onClose();
        }
      }}
    />
  ));

  return (
    <NotificationItemWrapper {...props}>
      <NotificationLayout
        Icon={Icon}
        badge={badge}
        title={props.children ? undefined : title}
        caption={props.children ? undefined : caption}
        actions={actions || undefined}
        hint={hint}
        centered={centered}
      >
        {props.children}
      </NotificationLayout>
    </NotificationItemWrapper>
  );
}

export default NotificationItem;
