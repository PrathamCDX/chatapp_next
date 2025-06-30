import axios from "axios";
import { Dispatch, SetStateAction } from "react";

const pingServer = async (
  setServerLoading: Dispatch<SetStateAction<boolean>>
) => {
  let response = null;
  while (!response) {
    try {
      response = await axios.get(process.env.NEXT_PUBLIC_SOCKET_URI as string);
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  setServerLoading(false);
  console.log("response");
  return response;
};

export { pingServer };
