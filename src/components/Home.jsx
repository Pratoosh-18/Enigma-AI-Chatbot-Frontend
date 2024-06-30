import React, { useContext, useEffect, useRef, useState } from "react";
import runChat from "../gemini/gemini";
import Navbar from "./Navbar";
import { UserContext } from "../Context/UserContext";
import PromtAndResponse from "./PromtAndResponse";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [APIresponse, setAPIresponse] = useState("");
  const [welcomebox, setWelcomebox] = useState(true);
  const promptAPI =
    "https://enigmav3-ai-chatbot-backend.onrender.com/api/v3/user/promptData";

  const [components, setComponents] = useState([]);

  const { user, setUser } = useContext(UserContext);
  const chatComponentRef = useRef(null);

  useEffect(() => {
    fetch("https://enigmav3-ai-chatbot-backend.onrender.com/");
  });

  useEffect(() => {
    if (user && user._id) {
      user.searchHistory.forEach((item) => {
        addComponent(item.prompt, item.response);
      });
    }
  }, [user]);

  useEffect(() => {
    if (chatComponentRef.current) {
      chatComponentRef.current.scrollTop =
        chatComponentRef.current.scrollHeight;
    }
  }, [components]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Determine which function to call based on your condition
      if (user.lenght===0) {
        handleNoAPI(prompt);
      } else {
        handleAPI(prompt);
      }
    }
  };

  const addComponent = (prop, res) => {
    const newComponent = (
      <PromtAndResponse key={`${prop}-${res}`} p={prop} r={res} />
    );
    setComponents((prevComponents) => [...prevComponents, newComponent]);
    scrollToBottom();
  };

  const formatDynamicParagraph = (paragraph) => {
    const lines = paragraph.split("\n");
    let result = [];
    let currentLevel = 0;
  
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("***")) {
        currentLevel = 2;
        result.push(`      * ${trimmedLine.replace(/\*/g, "").trim()}`); // Using an asterisk for level 2
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
        currentLevel = 0;
        result.push(`- ${trimmedLine.replace(/\*/g, "").trim()}`);
      } else {
        if (currentLevel === 2) {
          result.push(`      * ${line}`);
        } else if (currentLevel === 1) {
          result.push(`  - ${line}`);
        } else {
          result.push(line);
        }
      }
    });
  
    return result.join("\n");
  }

  const clearInputBox = () => {
    const element = document.getElementById("input-box")
    element.value=""
  }

  const handleNoAPI = async (prop) => {
    clearInputBox()
    setWelcomebox(false);
    setIsLoading(true);
    const resp = await runChat(prop);
    const res = formatDynamicParagraph(resp);
    addComponent(prop, res);
    setIsLoading(false);
  };

  const handleAPI = async (prop) => {
    // console.log("Context user = ", user);
    let componentRes = "";
    clearInputBox()
    setWelcomebox(false);
    try {
      // Start loading indicator
      setIsLoading(true);

      const resp = await runChat(prop);
      const res = formatDynamicParagraph(resp);
      componentRes = res;
      // console.log("runChat Response:", res);

      const data = {
        prompt: prop,
        response: res,
        accessToken: localStorage.getItem("enigmaaiv3at"),
      };
      const response = await fetch(promptAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setAPIresponse(res);

      addComponent(prop, res);
    } catch (error) {
      console.log("Error in handling API:", error);
    } finally {
      // Stop loading indicator
      setIsLoading(false);
    }
  };

  function scrollToBottom() {
    const element = document.getElementById("chat-component");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <div className="h-[100vh] w-[100%] flex ">
      {/* <div className="left-bar w-[20%] bg-[#212121] hidden md:flex h-[100%] justify-center pt-5">
        <p>History</p>
      </div> */}
      <div className="right-bar flex flex-col justify-between h-[100%] w-[100%] md:w-[100%]">
        <Navbar />
        <div className=" bg-[#171717] h-[78vh] overflow-y-scroll">
          <div id="chat-component">{components}</div>

          {components.length === 0 && welcomebox ? (
            <div className="h-[100%] flex justify-center items-center gap-3 mx-4">
              <img className="h-[60px] w-[6 0px] md:h-[100px] md:w-[100px]" src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png" alt="" />
              <div>
                <p className="text-2xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-r from-pink-600 via-blue-600 to-indigo-400 inline-block text-transparent bg-clip-text">Hello,</p>
                <p className="text-xl w-fit sm:text-3xl md:text-5xl font-semibold text-gray-400">How can i help you today?</p>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="bg-[212121]">
            {isLoading ? (
              <div className="bg-[212121] mt-2">
                <div className="flex z-40 gap-1 justify-center items-center bg-white dark:bg-[#171717]">
                  <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="h-[12vh] poppins bg-[#171717] flex justify-center gap-3 items-center">
          <input
            id="input-box"
            className="bg-[#171717] border-[1px] h-12 px-3 w-[270px] sm:w-[400px] rounded-lg border-white"
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the prompt"
            onKeyDown={handleKeyDown}
          />

          <div>
            {user._id ? (
              <button
                onClick={() => {
                  handleAPI(prompt);
                }}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/ternnbni.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: "50px", height: "50px" }}
                ></lord-icon>
              </button>
            ) : (
              <button onClick={() => handleNoAPI(prompt)}>
                <lord-icon
                  src="https://cdn.lordicon.com/ternnbni.json"
                  trigger="hover"
                  colors="primary:#ffffff"
                  style={{ width: "50px", height: "50px" }}
                ></lord-icon>
              </button>
            )}
            {/* <button onClick={scrollToBottom}>scroll</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
