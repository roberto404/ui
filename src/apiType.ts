export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

type CommonResponse = {
  status: Status;
  version: '3.0.0';
};

export type SuccessResponse = CommonResponse & {
  status: Status.SUCCESS;
  config: {};
  count: number;
  records: [];
};

export type ErrorResponse = CommonResponse & {
  status: Status.ERROR;
  code: string,
  message: string,
  modal: {
    title: string,
  }
};

export type Response = SuccessResponse | ErrorResponse;


export type ApiResponse<T> = Response & {
  records: T;
};

export type ApiSuccessResponse<T> = SuccessResponse & {
  records: T;
};


export type ApiType = <T>(props: { url: string; payload?: {} }) => Promise<ApiResponse<T>>;

export type useApiReturnType<T> = [
  data: ApiResponse<T> | undefined,
  loading: boolean,
  error: boolean | undefined,
];

// @todo use api type
export type argsType = [string] | [string, {}];

