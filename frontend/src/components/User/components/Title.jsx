import React from "react";

export default function Title({ selectedQuiz }) {
  return (
    <>
      <div
        style={{
          backgroundImage: "url(/user-dashboard/brick.png)",
          boxShadow: "5px 6px 19px -1px rgba(0,0,0,0.75)",
        }}
        className="mx-auto relative py-5 px-10 mb-16 border-2 border-purple-600 rounded-lg w-fit"
      >
        <img
          src="/torch-gif.gif"
          className="absolute left-2 bottom-2 w-7"
          alt="torch gif"
        />
        <img
          src="/torch-gif.gif"
          className="absolute right-2 bottom-2 w-7"
          alt="torch gif"
        />
        <h1
          style={{
            textShadow: "0px 5px 5px rgba(0,0,0,0.6)",
          }}
          className="text-5xl text-yellow-400"
        >
          {selectedQuiz.title}
        </h1>
      </div>
    </>
  );
}
