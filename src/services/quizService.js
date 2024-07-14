import axios from "axios";

const fetchQuestions = async (retryCount = 10, delay = 1000) => {
  let attempts = 0;
  let dataFetched = false;
  let questions = [];

  const fetchWithRetry = async () => {
    try {
      if (!dataFetched || attempts > 0) {
        const response = await axios.get(
          "https://opentdb.com/api.php?amount=20"
        );

        if (response.status === 429 && attempts < retryCount) {
          attempts++;
          console.warn(
            `Retrying in ${delay} ms... (${attempts}/${retryCount})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry();
        }

        if (response && response.data && response.data.results) {
          questions = response.data.results.filter(
            (q) => q !== null && q !== undefined
          );
          dataFetched = true;
        } else {
          throw new Error("Invalid data structure received from the API");
        }
      }

      return questions;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 429 &&
        attempts < retryCount
      ) {
        attempts++;
        console.warn(`Handling status 429 ${delay} ms... (${attempts}/${retryCount})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry();
      } else {
        console.error("Error fetching questions:", error);
        throw error;
      }
    }
  };

  return fetchWithRetry();
};

export { fetchQuestions };
