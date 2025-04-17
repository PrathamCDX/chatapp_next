import { createContext } from "react";

interface userPageContextType {
  displayMessageBox: boolean;
  setDisplayMessageBox: React.Dispatch<React.SetStateAction<boolean>>;
  userData?: any;
  messageList?: any;
  setMessageList: React.Dispatch<React.SetStateAction<any>>;
  currentChatFriend?: any;
  setCurrentChatFriend?: React.Dispatch<React.SetStateAction<any>>;
  sendMessageViaSocket?: (roomId: string, messageToBeSent: string) => void;
  forceRender?: { render: boolean };
  setForceRender?: React.Dispatch<React.SetStateAction<{ render: boolean }>>;
}
// Create context with an initial value of `undefined` or a default object
const userPageContext = createContext<userPageContextType | undefined | never>(
  undefined
);

export default userPageContext;
