import React from "react";

export default function Placeholder() {
  return (
    <div className="flex flex-col justify-around gap-20">
      <div className="py-3 px-10 relative diagonal border-2 rounded-lg border-purple-600 w-fit ">
        <img
          src="/torch-gif.gif"
          className="w-6 absolute left-2 bottom-0 pointer-events-none"
          alt="torch gif"
        />
        <img
          src="/torch-gif.gif"
          className="w-6 absolute right-2 bottom-0 pointer-events-none"
          alt="torch gif"
        />

        <h1 className="text-4xl text-yellow-400">
          Choose an Exercise on the left!
        </h1>
      </div>

      <div
        style={{ boxShadow: "5px 6px 19px -1px rgba(0,0,0,0.75)" }}
        className="rounded-lg bg-gradient-to-br from-indigo-950 to-purple-950 p-8 border-2 border-purple-600 "
      >
        <div className="text-2xl text-slate-200 jetbrains">
          <div className="font-bold my-2">Instructions:</div>
          <div>
            1.{" "}
            <span className="font-bold text-yellow-300">Choose a Topic: </span>
            Click on a topic in the sidebar.
          </div>
          <div>
            2.{" "}
            <span className="font-bold text-yellow-300">
              Select an Exercise:{" "}
            </span>
            Click on an exercise title to reveal its questions.
          </div>
          <div>
            3.{" "}
            <span className="font-bold text-yellow-300">
              Answer Questions:{" "}
            </span>
            Fill in the blanks in each question with your responses.
          </div>
          <div>
            4.{" "}
            <span className="font-bold text-yellow-300">
              Submit Your Answers:{" "}
            </span>
            Click &quot;Submit Answer&quot; after answering questions.
          </div>
          <br />
          <div className="font-bold my-2">Additional Information:</div>
          <div>
            - <span className="font-bold text-yellow-300">Correct Answer:</span>{" "}
            You will earn 100 coins for each correct answer.
          </div>
          <div>
            - <span className="font-bold text-yellow-300">Show Answer:</span> If
            you cannot answer a question, you can reveal the answer using the
            &quot;Show Answer&quot; button, which costs 300 coins.
          </div>
        </div>
      </div>
    </div>
  );
}
