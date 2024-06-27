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
    <div className="border-1 border-black h-[10vh] flex justify-between items-center p-8 border-2">
      <p>Navbar</p>
      <div className="flex gap-10">
        <Link to={"/register"}>
          <p>Register</p>
        </Link>

        {/* {console.log("Navbar user",user)} */}

        {user._id ? (
          <button onClick={logoutUser}>Logout</button>
        ) : (
          <Link to={"/login"}>
            <p>Login</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
