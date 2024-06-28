import React from "react";

const PromtAndResponse = ({ p, r }) => {
  return (
    <pre className="flex flex-col m-4 whitespace-pre-wrap md:px-20 lg:px-36 gap-4">
      <div className="flex flex-row-reverse poppins gap-2">
        <img className="h-[35px] w-[35px]" src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png" alt="" />
        <div className="flex justify-end px-4 bg-[#212121] w-fit py-2 rounded-2xl">
          {p}
        </div>
      </div>

      <div className="flex gap-2">
        <img className="h-[40px] w-[40px]" src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png" alt="" />
        <div className="flex justify-start px-4 bg-black w-fit py-2 rounded-2xl">
          {r}
        </div>
      </div>
    </pre>
  );
};

export default PromtAndResponse;
