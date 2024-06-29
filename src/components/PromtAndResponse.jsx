import React from "react";

const PromtAndResponse = ({ p, r }) => {
  return (
    <pre className="flex flex-col m-4 whitespace-pre-wrap md:px-20 lg:px-36 gap-4">
      <div className="flex flex-row-reverse poppins gap-2">
        <img
          className="h-[25px] w-[25px] sm:h-[35px] sm:w-[35px]"
          src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
          alt=""
        />
        <div className="flex justify-end px-4 bg-[#212121] w-fit py-2 rounded-2xl text-sm">
          {p}
        </div>
      </div>

      <div className="flex gap-2">
        <img
          className="h-[25px] w-[25px] sm:h-[35px] sm:w-[35px]"
          src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
          alt=""
        />
        <pre className="flex max-w-[90%] whitespace-pre-wrap text-sm sm:text-base justify-start px-4 bg-black w-fit py-2 rounded-2xl overflow-auto">
          {r}
        </pre>
      </div>
    </pre>
  );
};

export default PromtAndResponse;
