export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type CommonResponse = {
  status: Status;
  version: '3.0.0';
};

export type SuccessResponse<T = any, C = {}> = CommonResponse & {
  status: Status.SUCCESS;
  config: C;
  count: number;
  records: T;
};


export type ErrorResponse = CommonResponse & {
  status: Status.ERROR;
  code: string,
  message: string,
  modal: {
    title: string,
  }
};

export type Response<T, C = undefined> = SuccessResponse<T, C> | ErrorResponse;

export type ApiResponse<T, C = undefined> = Response<T, C>


export type ApiSuccessResponse<T = any, C = {}> = SuccessResponse<T, C> & {
  config?: C;
};


export type ApiType = <T, C = undefined>(props: { url: string; payload?: {} }) => Promise<ApiResponse<T, C>>;

export type useApiReturnType<T, C = undefined> = [
  data: ApiSuccessResponse<T, C>,
  loading: boolean,
  error: ErrorResponse | undefined,
];

// @todo use api type
export type argsType<T> = [string] | [string, {}] | [{
  url: string,
  payload?: {},
  onLoad?: (response: ApiResponse<T>) => void,
  skip?: boolean,
}];

