// import { userPageContext } from "@/app/[userId]/page";
import userPageContext from "@/context/userPageContext";
import axios from "axios";
import { useContext } from "react";

const AddFriend = ({
  username,
  setShowDialog,
}: {
  username: string;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const context = useContext(userPageContext);
  const { userData, forceRender, setForceRender } = context ? context : {};
  const handleClick = async (username: string, friendname: string) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SOCKET_URI + "data/addfriends",
      { username: username, friendname: friendname }
    );

    if (response.data.success == true) {
      //   console.log("friend added successfully");
      setForceRender && setForceRender({ render: true });
      setShowDialog(false);
    } else {
      alert("error in adding friend");
    }
  };
  return (
    <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
      <h1>User Found !</h1>
      <h1>{username}</h1>
      <button
        onClick={() => {
          handleClick(userData, username);
        }}
        className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Add friend
      </button>
    </div>
  );
};

export default AddFriend;
