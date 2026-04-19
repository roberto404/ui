import { useDispatch, useStore } from 'react-redux';
import { error } from '../notification/actions';

type PermissionTree = Record<string, any> | undefined | null;

const getPermissionPathParts = (path: string) => {
  const [controller, action] = String(path || '').split('.');

  return {
    controller,
    action,
  };
};

export const hasPermissionPath = (permission: PermissionTree, path: string) => {
  const { controller, action } = getPermissionPathParts(path);

  if (!controller || !permission || typeof permission !== 'object' || !(controller in permission)) {
    return false;
  }

  const controllerPermission = permission[controller];

  if (
    controllerPermission === undefined
    || controllerPermission === null
    || typeof controllerPermission !== 'object'
  ) {
    return false;
  }

  if (!action) {
    return true;
  }

  return Object.keys(controllerPermission).length === 0 || action in controllerPermission;
};

const usePermission = () => {

  const dispatch = useDispatch();
  const store = useStore();

  const checkPermission = (path: string) => {

    const { permission } = store.getState().user;
    const isAllowed = hasPermissionPath(permission, path);

    if (!isAllowed) {
      dispatch(error({
        title: 'Hozzáférés megtagadva.',
        caption: 'Kérj a vezetődtől hozzáférést',
        autoClose: true,
      }));
    }

    return isAllowed;
  };

  const validatePermission = <T extends unknown[]>(
    path: string,
    callback: (...args: T) => void,
  ) => (...args: T) => {
    if (!checkPermission(path)) {
      return;
    }

    callback(...args);
  };

  return {
    checkPermission,
    validatePermission,
  };
};

export default usePermission;
