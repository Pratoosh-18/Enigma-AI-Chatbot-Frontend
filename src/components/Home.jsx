import React, { useContext, useEffect, useState } from "react";
import runChat from "../gemini/gemini";
import Navbar from "./Navbar";
import { UserContext } from "../Context/UserContext";
import PromtAndResponse from "./PromtAndResponse";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [APIresponse, setAPIresponse] = useState("");
  const promptAPI = "https://enigmav3-ai-chatbot-backend.onrender.com/api/v3/user/promptData";

  const [components, setComponents] = useState([]);

  const { user, setUser } = useContext(UserContext);
  
  useEffect(() =>{

    if (user && user._id) {
      user.searchHistory.forEach((item) => {
        addComponent(item.prompt, item.response);
      });
    }
  }, [user]);

  const addComponent = (prop, res) => {
    // console.log("prop inside function =", prop, "component res inside function =", res);
    const newComponent = <PromtAndResponse key={`${prop}-${res}`} p={prop} r={res} />;
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  const handelShowCurrentUser = () => {
    console.log(user);
  };

  const formatDynamicParagraph = (paragraph) => {
    const lines = paragraph.split("\n");
    let result = [];
    let currentLevel = 0;
  
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("***")) {
        // Sub-bullet points (level 2)
        currentLevel = 2;
        result.push(`    - ${trimmedLine.replace(/\*/g, "").trim()}`);
      } else if (trimmedLine.startsWith("**")) {
        // Headings or main bullet points (level 1)
        if (trimmedLine.includes(":")) {
          // Headings (consider ':' as a heading marker)
          currentLevel = 0;
          result.push(trimmedLine.replace(/\*\*/g, "").trim());
        } else {
          currentLevel = 1;
          result.push(`  - ${trimmedLine.replace(/\*/g, "").trim()}`);
        }
      } else if (trimmedLine.startsWith("*")) {
        // Main bullet points (level 0)
        currentLevel = 0;
        result.push(`- ${trimmedLine.replace(/\*/g, "").trim()}`);
      } else {
        // Handle regular text or unformatted lines
        if (currentLevel === 2) {
          result.push(`    - ${line}`);
        } else if (currentLevel === 1) {
          result.push(`  - ${line}`);
        } else {
          result.push(line);
        }
      }
    });
  
    return result.join("\n");
  };
  

  const handleNoAPI = async (prop) => {
    const resp = await runChat(prop);
    const res = formatDynamicParagraph(resp);
    addComponent(prop, res);
  };

  const handleAPI = async (prop) => {
    // console.log("Context user = ", user);
    let componentRes = "";
    try {
      // Start loading indicator
      setIsLoading(true);

      // Log prop
      // console.log("Prop:", prop);

      // Send the prompt to runChat and get the response
      const resp = await runChat(prop);
      const res = formatDynamicParagraph(resp);
      componentRes = res;
      console.log("runChat Response:", res);

      // Prepare data to be sent to the API
      const data = {
        prompt: prop,
        response: res,
        accessToken: localStorage.getItem("enigmaaiv3at"),
      };
      // console.log("Data being sent to API:", data);

      // Log the user object if necessary
      // console.log(user);

      // Send data to the promptAPI
      const response = await fetch(promptAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      // console.log("API Response:", responseData);
      // setUser(responseData.updatedUser);
      // console.log(responseData.updatedUser)

      // Update the API response state
      setAPIresponse(res);

      // console.log("prop=", prop, "component res =", res);
      addComponent(prop, res);
    } catch (error) {
      console.log("Error in handling API:", error);
    } finally {
      // Stop loading indicator
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] w-[100%] flex ">
      <div className="left-bar w-[20%] bg-[#212121] hidden md:flex h-[100%]">
        <p>History</p>
      </div>
      <div className="right-bar flex flex-col justify-between h-[100%] w-[100%] md:w-[80%]">
        <Navbar />
        <div className=" bg-[#171717] h-[78vh] overflow-y-scroll">
          <div>{components}</div>

          <div>{isLoading ? <>Loading...</> : <></>}</div>
          {/* <pre className="whitespace-pre-wrap">{APIresponse}</pre> */}
        </div>
        <div className="h-[12vh] poppins bg-[#171717] flex justify-center gap-5 items-center">
          <input
          className="bg-[#171717] border-[1px] h-12 px-3 w-[400px] rounded-lg border-white"
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the prompt"
          />

          <div>
            {user._id ? (
                <button
                onClick={() => {
                  handleAPI(prompt);
                }}
              >
                Send
              </button>
            ) : (
              <button onClick={() => handleNoAPI(prompt)}>Send</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
