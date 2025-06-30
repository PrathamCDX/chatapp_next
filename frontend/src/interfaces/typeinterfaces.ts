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

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  showProgressBar?: boolean;
  spinnerColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export type { axiosResponseInterface, userDataType, LoadingScreenProps };
