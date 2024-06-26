import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerAPI = "http://localhost:8000/api/v3/user/register";
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered(false);

    const data = {
      username: username,
      email: email,
      password: password,
    };

    fetch(registerAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error)
        // setIsRegistered(true);
      });
  };
  return (
    <>
      <div>Register</div>
      <input
        onChange={(e) => {
          setUsername(e.target.value);
          setIsRegistered(false);
        }}
        type="text"
        placeholder="username"
      />
      <input
        onChange={(e) => {
          setEmail(e.target.value);
          setIsRegistered(false);
        }}
        type="text"
        placeholder="email"
      />
      <input
        onChange={(e) => {
          setPassword(e.target.value);
          setIsRegistered(false);
        }}
        type="text"
        placeholder="password"
      />
      <button onClick={handleRegister}>Register</button>
      {isRegistered ? <>User already registered !</> : <></>}
    </>
  );
};

export default Register;
