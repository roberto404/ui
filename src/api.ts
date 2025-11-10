import { useEffect, useState } from "react";
import { useAppContext } from "./context";
import { useDispatch } from "react-redux";
import { modal } from "./layer/actions";
import { ApiResponse, argsType, Status, SuccessResponse, useApiReturnType, ApiSuccessResponse } from "./apiType";
export type { ApiResponse, argsType, SuccessResponse, useApiReturnType, ApiSuccessResponse } from "./apiType";
export { Status } from "./apiType";




export const useApiContext = () => {

  const { api } = useAppContext() as { api: <T>(data: any) => Promise<ApiResponse<T>> };

  return api;
}

export const useApiSuccessContext = () => {

  const api = useApiContext();
  const dispatch = useDispatch();

  return async function <T>(data: any): Promise<SuccessResponse & { records: T; }> {

    const response: ApiResponse<T> = await api<T>(data);

    if (response.status === Status.ERROR) {
      if (response.modal) {
        dispatch(modal(response.modal));
      }
      return null;
    }

    return response;
  };
};


function useApi<T>(...args: argsType): useApiReturnType<T> {

  const { api } = useAppContext();

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>();

  const [argsChanged, setArgsChanged] = useState(undefined);

  // Watch for changes in arguments
  useEffect(() => {

    if (argsChanged !== JSON.stringify(args)) {
      setArgsChanged(JSON.stringify(args));
      setLoading(true);
      setData(undefined);
      setError(undefined);
    }
  }, args);

  useEffect(() => {

    let isMounted = true;

    if (loading && argsChanged) {

      api.apply(null, args).then((result) => {

        if (isMounted) {

          setLoading(false);

          if (result.status === Status.SUCCESS) {
            setData(result);
          } else {
            setError(result);
          }
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [argsChanged]);

  return [data, loading, error];
}

export default useApi;

