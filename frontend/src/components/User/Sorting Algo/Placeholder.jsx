import React from "react";

export default function Placeholder() {
  return (
    <>
      <h1 className="exercise-title">Choose an Exercise on the left!</h1>
      <p className="exercise-instruction">Good luck!</p>
      <div className="exercise-area">
        <div>
          <div className="instructions jetbrains">
            Instructions: <br />
            1. Choose a Topic: Click on a topic in the left sidebar. <br />
            2. Select an Exercise: Click on an exercise title to reveal its
            questions.
            <br />
            3. Answer Questions: Fill in the blanks in each question wit hyour
            responses.
            <br />
            4. Submit Your Answers: Click &quot;Submit Answer&quot; at the
            bottom after answering all questions.
            <br />
            <br />
            Additional Information: <br />- Correct Answer: You will earn 100
            coins for each correct answer.
            <br />- Show Answer: If you cannot answer a question, you can reveal
            the answer using <br />
            the &quot;Show Answer&quot; button, which costs 300 coins.
          </div>
        </div>
      </div>
    </>
  );
}
