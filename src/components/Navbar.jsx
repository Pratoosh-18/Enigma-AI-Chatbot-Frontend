import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="border-1 border-black h-[10vh] flex justify-between items-center p-8 border-2">
      <p>Navbar</p>
      <div className="flex gap-10">
        <Link to={"/register"}>
          <p>Register</p>
        </Link>
        <Link to={"/login"}>
          <p>Login</p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
