import React, { useContext, useState } from "react";
import runChat from "../gemini/gemini";
import Navbar from "./Navbar";
import { UserContext } from "../Context/UserContext";

const Home = () => {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [APIresponse, setAPIresponse] = useState("");
  const promptAPI = 'http://localhost:8000/api/v3/user/promptData'

  const {user} = useContext(UserContext)

  const handleAPI = async (prop) => {
    const data = {
      "prompt":"This is a sample prompt",
      "response":"This is a sample response"
    }

    try {
      fetch(promptAPI, {
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
          console.log("Error in sending the prompt")
        });
    } catch (error) {
      console.log("Error in prompt data")
    }

    console.log(user)
    prop=prompt
    setIsLoading(true);
    const res = await runChat(prop);
    setIsLoading(false);
    setAPIresponse(res);
  };

  return (
    <div className="h-[100vh] w-[100%] hidden md:flex">
      <div className="left-bar w-[20%] border-2 h-[100%]">
        <p>History</p>
      </div>
      <div className="right-bar flex flex-col justify-between h-[100%] w-[80%]">
        <Navbar/>
        <div className="border-2 h-[78vh] border-black overflow-y-scroll">
          Chat
        <div>{isLoading ? <>Loading...</> : <></>}</div>
        <pre className="whitespace-pre-wrap">
        {APIresponse} 
        </pre>
        </div>
        <div className="border-2 h-[12vh] border-black">
          <input type="text" onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter the prompt"/>
          <button onClick={handleAPI}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
