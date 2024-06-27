import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginAPI = "http://localhost:8000/api/v3/user/login";
  const navigate = useNavigate();
  const [isNotUser, setIsNotUser] = useState(false);

  const { user, loginUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };

    const res = await fetch(loginAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), 
    })

    const d = await res.json()

    if(res.status === 401 || !d){
      console.log("Invalid login credentials");
        setIsNotUser(true);
        console.error("Error:", error);
    }else{
        console.log("Success:", data);
        console.log(d.at);
        localStorage.setItem('at',d.at)
        navigate("/");
    }
      // .then((response) => response.json())
      // .then(async (data) => {
      //   await loginUser(data);
      //   console.log("Success:", data);
      //   navigate("/");
      // })
      // .catch((error) => {
      //   console.log("Invalid login credentials");
      //   setIsNotUser(true);
      //   console.error("Error:", error);
      // });

    console.log(email, password);
  };
  return (
    <>
      <div>Login</div>
      <form method="POST">
        <input
          onChange={(e) => {
            setEmail(e.target.value);
            setIsNotUser(false);
          }}
          type="text"
          placeholder="email"
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
            setIsNotUser(false);
          }}
          type="text"
          placeholder="password"
        />
        <button onClick={handleLogin}>Login</button>
        <div>{isNotUser ? <>Invalid Login credentials</> : <></>}</div>
      </form>
    </>
  );
};

export default Login;
