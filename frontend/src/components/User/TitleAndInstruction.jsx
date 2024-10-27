import React from "react";

export default function TitleAndInstruction({ selectedQuiz }) {
  return (
    <>
      <h1 className="exercise-title">{selectedQuiz.title}</h1>
      <div className="exercise-instruction jetbrains">
        <p>
          <span className="font-bold">Review the Code:</span> Read through the
          given code snippets carefully.
        </p>
        <p>
          <span className="font-bold">Identify the Placeholders:</span>
          Look for the blanks represented by placeholders (e.g., _____).
        </p>
        <p>
          <span className="font-bold">Answering:</span> If there are two or more
          blanks, separate the answers with a comma (&apos;,&apos;).
        </p>
        <p>
          <span className="font-bold">Click Start:</span> To start the game,
          click on &quot;Start&quot; and the timer will begin. Good luck!
        </p>
      </div>
    </>
  );
}
