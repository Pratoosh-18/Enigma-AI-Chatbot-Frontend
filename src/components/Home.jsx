import React, { useContext, useEffect, useRef, useState } from "react";
import runChat from "../gemini/gemini";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import PromtAndResponse from "./PromtAndResponse";
import HistoryCard from "./HistoryCard";

const Home = () => {
  const [prompt, setPrompt] = useState("Hello");
  const [isLoading, setIsLoading] = useState(false);
  const [APIresponse, setAPIresponse] = useState("");
  const [welcomebox, setWelcomebox] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const promptAPI =
    "https://enigmav3-ai-chatbot-backend.onrender.com/api/v3/user/promptData";

  const [smallScreen, setSmallScreen] = useState(false);

  const [components, setComponents] = useState([]);
  const [historyComponents, setHistoryComponents] = useState([]);

  const { user, setUser } = useContext(UserContext);
  const chatComponentRef = useRef(null);

  useEffect(() => {
    fetch("https://enigmav3-ai-chatbot-backend.onrender.com/");
  });

  useEffect(() => {
    if (user && user._id) {
      user.searchHistory.forEach((item) => {
        addComponent(item.prompt, item.response);
        addHistoryComponent(item.prompt);
      });
    }
  }, [user]);

  useEffect(() => {
    if (chatComponentRef.current) {
      chatComponentRef.current.scrollTop =
        chatComponentRef.current.scrollHeight;
    }
  }, [components]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      setIsButtonDisabled(true);
      // Determine which function to call based on your condition
      if (user && user._id) {
        console.log("User is present");
        await handleAPI(prompt);
      } else {
        console.log("No active user");
        await handleNoAPI(prompt);
      }
    }
    setIsButtonDisabled(false);
  };

  const addComponent = (prop, res) => {
    const newComponent = (
      <PromtAndResponse key={`${prop}-${res}`} p={prop} r={res} />
    );
    setComponents((prevComponents) => [...prevComponents, newComponent]);
    scrollToBottom();
  };

  const addHistoryComponent = (prop) => {
    const newComponent = <HistoryCard key={`${prop}`} p={prop} />;
    setHistoryComponents((prevComponents) => [...prevComponents, newComponent]);
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
  };

  const clearInputBox = () => {
    const element = document.getElementById("input-box");
    element.value = "";
  };
  const logoutUser = () => {
    let c = confirm("Are you sure you want to logout?");
    if (c) {
      setUser([]);
    }
    window.location.reload();
  };

  const handleNoAPI = async (prop) => {
    setIsButtonDisabled(true);
    clearInputBox();
    setWelcomebox(false);
    setIsLoading(true);
    const resp = await runChat(prop);
    const res = formatDynamicParagraph(resp);
    addComponent(prop, res);
    addHistoryComponent(prop);
    setIsLoading(false);
    setIsButtonDisabled(false);
  };

  const handleAPI = async (prop) => {
    // console.log("Context user = ", user);
    setIsButtonDisabled(true);
    let componentRes = "";
    clearInputBox();
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
      addHistoryComponent(prop);
    } catch (error) {
      console.log("Error in handling API:", error);
      setIsButtonDisabled(false);
    } finally {
      // Stop loading indicator
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const showHistoryTab = () => {
    setSmallScreen(true);
  };
  const hideHistoryTab = () => {
    setSmallScreen(false);
  };

  function scrollToBottom() {
    const element = document.getElementById("chat-component");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  return (
    <div className="h-[100%] w-[100%] flex overflow-hidden">
      <div
        id="left-bar"
        className={
          smallScreen
            ? "absolute z-10 h-[100vh] w-[80%] sm:w-[50%] flex bg-[#212121] flex-col overflow-y-scroll justify-between duration-1000"
            : "left-bar absolute lg:w-[25%] bg-[#212121] translate-x-[-25%] lg:translate-x-0 md:flex h-[100vh] flex-col overflow-y-scroll justify-between duration-1000"
        }
      >
        <p className="h-[8%] w-[100%] flex justify-around items-center text-lg">
          <p className="block lg:hidden"></p>
          <p>Search History</p>
          <span
            onClick={hideHistoryTab}
            class="block lg:hidden hover:cursor-pointer material-symbols-outlined"
          >
            close
          </span>
        </p>
        <div className="h-[84%] overflow-y-scroll flex flex-col-reverse">
          {historyComponents}
          {historyComponents.length === 0 ? (
            <div className="h-[100%] w-[100%] flex flex-col justify-center items-center">
              <p>New user? Register now !!</p>
              <p>Login to show and save history</p>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="h-[8%] w-[100%] flex gap-2 justify-center items-center">
          <div>
            <img
              className="h-[25px] w-[25px]"
              src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              alt=""
            />
          </div>
          {user.username ? <>{user.username}</> : <>Anonymous user</>}
        </div>
      </div>

      <div className="right-bar lg:ml-[25%] absolute flex flex-col justify-between h-[100vh] w-[100%] lg:w-[75%]">
        {/* <Navbar /> */}
        <div className="bg-[#171717] poppins h-[11%] flex justify-between items-center md:px-10 sm:px-5 px-4">
          <p className="text-xl sm:text-2xl flex gap-2 sm:gap-10 items-center">
            <span
              onClick={showHistoryTab}
              className="block hover:cursor-pointer lg:hidden material-symbols-outlined"
            >
              menu
            </span>
            Enigma AI - 3.0
          </p>
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

        <div className=" bg-[#171717] h-[78%] overflow-y-scroll">
          <div id="chat-component">{components}</div>

          {components.length === 0 && welcomebox ? (
            <div className="h-[100%] flex justify-center items-center gap-3 mx-4">
              <img
                className="h-[60px] w-[6 0px] md:h-[100px] md:w-[100px]"
                src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
                alt=""
              />
              <div>
                <p className="text-2xl sm:text-3xl md:text-5xl font-semibold bg-gradient-to-r from-pink-600 via-blue-600 to-indigo-400 inline-block text-transparent bg-clip-text">
                  Hello,
                </p>
                <p className="text-xl w-fit sm:text-3xl md:text-5xl font-semibold text-gray-400">
                  How can i help you today?
                </p>
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
        <div className="h-[12%] poppins bg-[#171717] flex justify-center gap-3 items-center">
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
              <button
                disabled={isButtonDisabled}
                onClick={() => handleNoAPI(prompt)}
              >
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
