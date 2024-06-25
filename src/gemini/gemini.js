// node --version # Should be >= 18
// npm install @google/generative-ai

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY ='AIzaSyBnQ3uljFRQ4Ez3-peV0Z5Jhg4y2YhkPuk'
  
  async function runChat(promt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
  
    const result = await chat.sendMessage(promt);
    const response = result.response;
    // let finalres="";
    // console.log(response.text());
    // console.log(response.text().length);
    // let responsetext=response.text();
    // for(let i=0;i<responsetext.length;i++){
    //   if(responsetext[i]===' ' && responsetext[i-1]==='*' && responsetext[i-2]==='*'){
    //     finalres=finalres+'\n';
    //   }
    //     finalres=finalres+responsetext[i];
    //   }
      return response.text()
      // return finalres;
      // return responsetext;
  }
  
export default runChat;