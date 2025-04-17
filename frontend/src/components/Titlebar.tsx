import React from "react";
import Searchbar from "./Searchbar";

function Titlebar() {
  return (
    <div className="h-[50px] bg-yellow-500 m-1 items-center flex px-3">
      <div className="flex items-center gap-x-2">
        <div className="text-2xl">TitleBar</div>
        <div>
          <Searchbar />
        </div>
      </div>
    </div>
  );
}

export default Titlebar;
