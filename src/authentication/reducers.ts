import Storage from '@1studio/utils/models/storage'; // 64
import omit from 'lodash/omit';


/**
 * User Model
 * @type {User} from @1studio/utils/models/
 */
let User = new Storage({}, { password: false, key: 'user' });


const createState = () =>
({
  ...User.data,
  model: User,
  isLogged: !!User.data.timestamp,
});

/**
 * User Redux Reducers
 * @param  {Object} [state={}]
 * @param  {Object} action
 * @return {Object}            state
 */
const reducers = (state = createState({}), action = {}) =>
{
  switch (action.type)
  {
    case 'SET-USER':
      {
        User.data = action.user;
        return createState();
      }

    case 'MODIFY-USER-DATA':
      {
        return reducers(
          state,
          {
            user: { ...state.model.data, ...action.user },
            type: 'SET-USER',
          },
        );
      }

    case 'ERASE-USER':
      {
        User.erase();
        return createState();
      }

    default:
      return state;
  }
};

export const createUserStorage = (data = {}, config = {}) =>
{
  User = new Storage(data, config);
};

export const GET_IS_LOGGED = ({ user }) =>
  user.isLogged;

export const GET_ID = ({ user }) =>
  user.id;

export const GET_EMAIL = ({ user }) =>
  user.email;

export const GET_USERNAME = ({ user }) =>
  user.username;

export const GET_NAME = ({ user }) =>
  user.name || `${user.firstName} ${user.lastName}`;

export const GET_PERMISSION = ({ user }) =>
  user.permission;

export const GET_USER_DATA = ({ user }) => ({
  name: user.name,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  email: user.email,
});

export const GET_USER = ({ user }) =>
  user;



export default reducers;
