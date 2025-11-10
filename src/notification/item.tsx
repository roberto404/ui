import React from 'react';

/* !-- Actions */

import { remove } from './actions';


/* !-- Components */

import IconInfo from '../icon/mui/action/info';
import { templates } from './templates';
import NotificationItemWrapper from './itemWrapper';


/* !-- Constants */


/* !-- Types */

import { Templates } from './templates';
import { useDispatch } from 'react-redux';

export type PropTypes = {
  id: string | number,
  title: string,
  caption?: string,
  color?: 'blue' | 'yellow' | 'red' | 'green';
  Icon?: React.FC;
  buttons?: any[];
  template?: Templates,
  payload?: {},
  children?: React.ReactNode,
  componentKey?: string,
  disableClose: boolean;
  closeOnChangeLocation: boolean;
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
    color = 'blue',
    Icon = IconInfo,
    buttons = [],
  } = props;


  const children = props.children || (
    <>
      <div
        className={`bold text-${color}-dark`}
      >
        {title}
      </div>
      <div className='text-s text-gray mt-1 light'>
        {caption}
      </div>
    </>
  )

  return (
    <NotificationItemWrapper {...props}>
      <div className='flex p-1'>

        {/* Icon */}

        <div
          className='border-right p-2 mr-2 my-1'
          style={{ alignSelf: 'center' }}
        >
          <Icon
            className={`w-2 h-2 p-1/4 bg-${color}-dark fill-white circle`}
          />
        </div>

        {/* Message */}

        <div
          className='py-1 text-line-s grow'
          style={{
            alignSelf: 'center',
          }}
        >
          {children}

          {buttons.length > 0 &&
            <div className='v-right gap-1 mt-1'>
              {buttons.map((button, i) => (
                <div
                  key={i}
                  className={`pointer text-s text-${color}-dark p-1/2 px-1 border rounded border-${color}-dark hover:bg-${color}-dark hover:text-white`}
                >
                  {button.title}
                </div>
              ))}
            </div>
          }

        </div>
      </div>
    </NotificationItemWrapper>
  );
}

export default NotificationItem;