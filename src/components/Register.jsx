import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordConfirmMatch, setPasswordConfirmMatch] = useState(true)
  const registerAPI =
    "https://enigmav3-ai-chatbot-backend.onrender.com/api/v3/user/register";
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false)

  const handleRegister = async () => {
    setIsRegistered(false);
    setIsLoading(true);

    if(username === '' || password === '' || email === '' || confirmPassword === ''){
      setIsEmpty(true)
      setIsLoading(false)
    }else{
      if(password===confirmPassword){
        const data = {
          username: username,
          email: email,
          password: password,
        };
        
      await fetch(registerAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Success:", data);
        setIsLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setIsRegistered(true);
        setIsLoading(false);
      });
    }else{
      setPasswordConfirmMatch(false)
      setIsLoading(false)
    }
    }
  }
  return (
    <div className="h-[100vh] w-[100vw] poppins bg-[#171717] flex justify-between items-center flex-col">
      <div  className="flex justify-start w-full px-10 mb-5 text-base">
      <Link to={"/"} className="mt-10 text-base">
      &#8592; Home
      </Link>
      </div>
      <div className="box w-[250px] sm:w-[300px] flex flex-col justify-center items-center">
        <div className="mb-8 text-2xl flex gap-3">
        <img className="h-[40px] w-[40px]" src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png" alt="" />
          Register as a new user
          </div>

        <div className="flex w-full">
          <p className="text-sm mb-1">Create a username:</p>
        </div>
        <input
          className="bg-[#171717] p-3 mb-3 border-[1px] rounded-lg w-[250px] sm:w-[300px]"
          onChange={(e) => {
            setUsername(e.target.value);
            setIsRegistered(false);
            setIsEmpty(false);
          }}
          type="text"
          placeholder="username"
          />

        <div className="flex w-full">
          <p className="text-sm mb-1">Enter your email:</p>
        </div>
        <input
          className="bg-[#171717] p-3 mb-3 border-[1px] rounded-lg w-[250px] sm:w-[300px]"
          onChange={(e) => {
            setEmail(e.target.value);
            setIsRegistered(false);
            setIsEmpty(false);
          }}
          type="text"
          placeholder="email"
          />

        <div className="flex w-full">
          <p className="text-sm mb-1">Create a password:</p>
        </div>
        <input
          className="bg-[#171717] p-3 mb-3 border-[1px] rounded-lg w-[250px] sm:w-[300px]"
          onChange={(e) => {
            setPassword(e.target.value);
            setIsRegistered(false);
            setIsEmpty(false);
          }}
          type="password"
          placeholder="password"
          />

        <div className="flex w-full">
          <p className="text-sm mb-1">Confirm password:</p>
        </div>
        <input
          className="bg-[#171717] p-3 mb-3 border-[1px] rounded-lg w-[250px] sm:w-[300px]"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordConfirmMatch(true);
            setIsEmpty(false);
          }}
          type="password"
          placeholder="password"
        />
        <div className="text-red-500 mb-3">

        {passwordConfirmMatch?<></>:<>Paasword does not match !</>}
        {isRegistered ? <>This User is already registered !</> : <></>}
        {isEmpty ? <>Please enter all the details !</> : <></>}
        </div>

        {isLoading ? (
          <button
            disabled
            type="button"
            class="w-[200px] justify-center py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <button
            onClick={handleRegister}
            class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span class="relative w-[200px] px-4 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Register
            </span>
          </button>
        )}
      </div>
      <div> </div>
    </div>
  );
};

export default Register;
