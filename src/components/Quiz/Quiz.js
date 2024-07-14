import React, { useEffect, useState } from "react";
import { fetchQuestions } from "../../services/quizService";
import Question from "../Question/Question";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isPlayingAgain, setIsPlayingAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
      setIsLoading(false);
    };

    if (!isPlayingAgain) {
      loadQuestions();
    } else {
      setIsPlayingAgain(false);
    }
  }, [isPlayingAgain]);

  const handleSelectAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, questions.length - 1)
    );
  };

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit the quiz?")) {
      navigate("/");
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setIsPlayingAgain(true);
    setIsLoading(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers += 1;
      }
    });
    return correctAnswers;
  };

  const getFeedbackMessage = (percentage) => {
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 50) return "Good job!";
    return "You need more practice!";
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const attemptedQuestions = Object.keys(answers).length;
    const correctAnswers = score;
    const wrongAnswers = attemptedQuestions - correctAnswers;

    return (
      <div className="outer-container">
        <i className="fa-sharp fa-regular fa-circle-check icon-style"></i>
        <h2 className="result-text">Result</h2>
        <div className="results-container">
          <p className="result-message">{getFeedbackMessage(percentage)}</p>
          <p className="result-score">Your Score: {percentage}%</p>
          <div className="result-score-text-wrapper">
            <div>
              <p className="result-total">Total number of questions:</p>
              <p className="result-question-margin">
                Number of attempted questions:
              </p>
              <p className="result-question-margin">
                Number of Correct Answers:
              </p>
              <p className="result-question-margin">Number of Wrong Answers:</p>
            </div>
            <div>
              <p className="result-total">{questions.length}</p>
              <p className="result-question-margin">{attemptedQuestions}</p>
              <p className="result-question-margin">{correctAnswers}</p>
              <p className="result-question-margin">{wrongAnswers}</p>
            </div>
          </div>
        </div>
        <div>
          <button onClick={handlePlayAgain} className="score-button1">
            Play Again
          </button>
          <button onClick={() => navigate("/")} className="score-button2">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = currentQuestion
    ? [
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers,
      ].sort()
    : [];

  return (
    <div className="outer-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading">Loading...</div>
        </div>
      ) : (
        <div className="card">
          <h2 className="question-heading">Question</h2>
          <span className="question-count-wrap">
            <p>
              {currentQuestionIndex + 1} of {questions.length}
            </p>
            <Question
              question={currentQuestion.question}
              options={options}
              selectedAnswer={answers[currentQuestionIndex]}
              onSelectAnswer={handleSelectAnswer}
            />
          </span>
          <div className="button-container">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="button previous-button"
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNext} className="button next-button">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="button submit-button">
                Submit
              </button>
            )}
            <button onClick={handleQuit} className="button quite-button">
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
