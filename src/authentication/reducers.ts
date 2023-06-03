import Storage from '@1studio/utils/models/storage'; // 64


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

export default reducers;
