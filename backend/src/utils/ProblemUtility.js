const axios = require("axios");

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63,
  };
  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  // you get this code snippet in (create a batch submission code ) on judge0
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API ,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      // send the submission
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};

// wait for 1 sec
const waiting = async (timer)=>{
  setTimeout(()=>{return 1},timer)
}

const submitToken = async (resultToken) => {
  // get a batch submission code
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      // send the tokens in string comma separated
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_API,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  // call the until you get the data
  while (true) {
    const result = await fetchData();
    // if status_id is < 3 then we have to call this again 1 means in queue ,2 means pending

    const isResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (isResultObtained) {
      return result.submissions;
    }
    // wait for 1 seconds then call fetchdata again
    waiting(1000);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
