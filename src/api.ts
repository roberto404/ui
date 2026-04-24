import { useEffect, useState } from "react";
import { useAppContext } from "./context";
import { useDispatch } from "react-redux";
import { modal } from "./layer/actions";
import { ApiResponse, argsType, Status, SuccessResponse, useApiReturnType, ApiSuccessResponse, ErrorResponse } from "./apiType";
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


function useApi<T>(args: argsType<T>): useApiReturnType<T> {

  const { api } = useAppContext();

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | undefined>();

  const [argsHash, setArgsHash] = useState<string | undefined>(undefined);

  const isSkipped = args?.skip === true;

  // Args változás figyelése
  useEffect(() => {

    if (isSkipped) {
      setLoading(false);
      return;
    }

    // cannot contain a function like: onLoad
    const serialized = JSON.stringify({ url: args.url, payload: args.payload });

    if (argsHash !== serialized) {
      setArgsHash(serialized);
      setLoading(true);
      setData(undefined);
      setError(undefined);
    }

  }, [args]); // ⬅️ CSAK args

  // API hívás
  useEffect(() => {

    let isMounted = true;

    if (isSkipped || !loading || !argsHash) {
      return;
    }

    const { skip, ...apiArgs } = args;

    api(apiArgs).then((result: ApiResponse<T>) => {

      if (!isMounted) return;

      setLoading(false);

      if (result.status === Status.SUCCESS) {
        setData(result);
      } else {
        setError(result);
      }

      if (typeof args.onLoad === 'function') {
        args.onLoad(result);
      }
    });

    return () => {
      isMounted = false;
    };

  }, [argsHash, loading]); // ⬅️ skip NINCS

  return [data, loading, error];
}


export default useApi;


