import React from "react";
import PropTypes from "prop-types";

const Title = ({ selectedQuiz }) => {
  return (
    <div
      className="mx-auto relative py-5 px-10 mb-16 border-2 border-purple-600 rounded-lg w-fit"
      style={{
        backgroundImage: "url(/user-dashboard/brick.png)",
        boxShadow: "5px 6px 19px -1px rgba(0,0,0,0.75)",
      }}
    >
      <img
        src="/torch-gif.gif"
        className="absolute left-2 bottom-2 w-7 pointer-events-none"
        alt="torch gif"
      />
      <img
        src="/torch-gif.gif"
        className="absolute right-2 bottom-2 w-7 pointer-events-none"
        alt="torch gif"
      />
      <h1
        className="text-xl text-center sm:text-2xl md:text-3xl lg:text-4xl text-yellow-400"
        style={{
          textShadow: "0px 5px 5px rgba(0,0,0,0.6)",
        }}
      >
        {selectedQuiz.title}
      </h1>
    </div>
  );
};

Title.propTypes = {
  selectedQuiz: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Title;
