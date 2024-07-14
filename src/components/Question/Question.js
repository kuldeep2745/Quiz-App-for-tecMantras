import React from "react";
import "./Question.css";

const Question = ({ question, options, selectedAnswer, onSelectAnswer }) => {
  const optionRows = Math.ceil(options.length / 2);
console.log("Give Your Best To get Amazing Score")
  return (
    <div>
      <p
        className="para-style"
        dangerouslySetInnerHTML={{ __html: question }}
      />
      <div className="options-container">
        {[...Array(optionRows)].map((_, rowIndex) => (
          <div key={rowIndex} className="option-row">
            {options
              .slice(rowIndex * 2, rowIndex * 2 + 2)
              .map((option, index) => (
                <label key={index} className="option-label">
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => onSelectAnswer(option)}
                    className="radio-input"
                  />
                  <div
                    className={`radio-button ${
                      selectedAnswer === option
                        ? "radio-button-selected"
                        : "radio-button-normal"
                    }`}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: option }}
                      className="option-text"
                    />
                  </div>
                </label>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
