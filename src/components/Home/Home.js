import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  console.log("Welcome to the Kuldeep Rathore's Quiz App")
  return (
    <div className="home-container">
      <h1 className="quiz-title">Quiz App</h1>
      <Link to="/quiz" className="play-button">
        Play
      </Link>
    </div>
  );
};

export default Home;
