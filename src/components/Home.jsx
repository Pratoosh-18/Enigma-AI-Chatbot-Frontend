import React, { useContext, useEffect, useState } from "react";
import runChat from "../gemini/gemini";
import Navbar from "./Navbar";
import { UserContext } from "../Context/UserContext";
import PromtAndResponse from "./PromtAndResponse";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [APIresponse, setAPIresponse] = useState("");
  const promptAPI = "http://localhost:8000/api/v3/user/promptData";
  const refreshServer = "http://localhost:8000/api/v3/user/refreshServer"

  const [components, setComponents] = useState([]);

  const { user, setUser } = useContext(UserContext);
  
  useEffect(() =>{

    if (user && user._id) {
      user.searchHistory.forEach((item) => {
        console.log("Yes");
        addComponent(item.prompt, item.response);
      });
    }
  }, [user]);

  const addComponent = (prop, res) => {
    console.log("prop inside function =", prop, "component res inside function =", res);
    const newComponent = <PromtAndResponse key={`${prop}-${res}`} p={prop} r={res} />;
    setComponents((prevComponents) => [...prevComponents, newComponent]);
  };

  const handelShowCurrentUser = () => {
    console.log(user);
  };

  const formatDynamicParagraph = (paragraph) => {
    // Split the paragraph into lines
    const lines = paragraph
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    // Initialize a result array to store the formatted output
    let result = [];

    // Flags to track the current level of bullet points
    let currentLevel = 0;

    // Iterate through each line and format accordingly
    lines.forEach((line) => {
      if (line.startsWith("***")) {
        // Sub-bullet points (level 2)
        currentLevel = 2;
        result.push(`    - ${line.replace(/\*/g, "").trim()}`);
      } else if (line.startsWith("**")) {
        // Headings or main bullet points (level 1)
        if (line.includes(":")) {
          // Headings (consider ':' as a heading marker)
          currentLevel = 0;
          result.push(line.replace(/\*\*/g, "").trim());
        } else {
          currentLevel = 1;
          result.push(`  - ${line.replace(/\*/g, "").trim()}`);
        }
      } else if (line.startsWith("*")) {
        // Main bullet points (level 0)
        currentLevel = 0;
        result.push(`- ${line.replace(/\*/g, "").trim()}`);
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

    // Join the formatted result and return as a single string
    return result.join("\n");
  };

  const handleNoAPI = async (prop) => {
    const resp = await runChat(prop);
    const res = formatDynamicParagraph(resp);
    addComponent(prop, res);
  };

  const handleAPI = async (prop) => {
    console.log("Context user = ", user);
    let componentRes = "";
    try {
      // Start loading indicator
      setIsLoading(true);

      // Log prop
      console.log("Prop:", prop);

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
      console.log("Data being sent to API:", data);

      // Log the user object if necessary
      console.log(user);

      // Send data to the promptAPI
      const response = await fetch(promptAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);
      // setUser(responseData.updatedUser);
      console.log(responseData.updatedUser)

      // Update the API response state
      setAPIresponse(res);

      console.log("prop=", prop, "component res =", res);
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
      <div className="left-bar w-[20%] border-2  hidden md:flex h-[100%]">
        <p>History</p>
      </div>
      <div className="right-bar flex flex-col justify-between h-[100%] w-[100%] md:w-[80%]">
        <Navbar />
        <div className="border-2 h-[78vh] border-black overflow-y-scroll">
          <div>{components}</div>

          <div>{isLoading ? <>Loading...</> : <></>}</div>
          {/* <pre className="whitespace-pre-wrap">{APIresponse}</pre> */}
        </div>
        <div className="border-2 h-[12vh] border-black">
          <input
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the prompt"
          />

          <button onClick={handelShowCurrentUser}>User</button>

          <div>
            {user._id ? (
                <button
                onClick={() => {
                  handleAPI(prompt);
                }}
              >
                Send with user
              </button>
            ) : (
              <button onClick={() => handleNoAPI(prompt)}>Send without user</button>
            )}
          </div>

          {/* <button onClick={() => {
            handleAPI(prompt)
          }}>Send</button> */}

          {/* <button onClick={handelShowCurrentUser}>
            Show current user in context
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
