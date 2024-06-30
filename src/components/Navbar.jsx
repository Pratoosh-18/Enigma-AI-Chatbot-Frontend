import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const logoutUser = () => {
    let c = confirm("Are you sure you want to logout?");
    if (c) {
      setUser([]);
    }
  };

  return (
    <div className="bg-[#171717] poppins h-[11vh] flex justify-between items-center md:px-10 sm:px-5 px-4">
      <p className="text-xl sm:text-2xl">Enigma AI - 3.0</p>
      <div className="flex gap-2 sm:gap-5">
        {user.length === 0 ? (
          <Link to={"/register"}>
            <button className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-2 md:px-5 py-1 sm:py-2 md:py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Register
              </span>
            </button>
          </Link>
        ) : (
          <></>
        )}

        {user._id ? (
          <button
            onClick={logoutUser}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span className="relative px-2 md:px-5 py-1 sm:py-2 md:py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Logout
            </span>
          </button>
        ) : (
          <Link to={"/login"} className="flex justify-between items-center">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-2 md:px-5 py-1 sm:py-2 md:py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Login
              </span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
