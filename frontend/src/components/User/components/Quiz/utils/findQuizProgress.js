const findQuizProgress = (quizId, userProgress) => {
  return userProgress?.find(
    (progress) => progress.quizId._id === quizId && progress.completed
  );
};
export default findQuizProgress;
