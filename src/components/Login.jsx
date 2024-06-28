import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginAPI = "https://enigmav3-ai-chatbot-backend.onrender.com/api/v3/user/login";
  const navigate = useNavigate();
  const [isNotUser, setIsNotUser] = useState(false);

  const { user, loginUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const res = await fetch(loginAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (!d) {
        console.log("Invalid login credentials");
        setIsNotUser(true);
      } else {
        console.log("Success:", data);
        loginUser(d.updatedUser);
        localStorage.setItem("enigmaaiv3at", d.at);
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsNotUser(true);
    }
  };

  return (
    <div className="bg-[#272727] h-[100vh]">
      <div>Login</div>
      <form method="POST" onSubmit={handleLogin}>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
            setIsNotUser(false);
          }}
          type="text"
          placeholder="email"
          value={email}
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
            setIsNotUser(false);
          }}
          type="password"
          placeholder="password"
          value={password}
        />
        <button type="submit">Login</button>
        {isNotUser && <div>Invalid Login credentials</div>}
      </form>
    </div>
  );
};

export default Login;
