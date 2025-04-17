interface axiosResponseInterface {
  success: boolean;
  statusCode: Number;
  data?: any;
  path?: any;
  errMessage: any;
}

interface userDataType {
  username: string | null;
  password: string | null;
}

export type { axiosResponseInterface, userDataType };
