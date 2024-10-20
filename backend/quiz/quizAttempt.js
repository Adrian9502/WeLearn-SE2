const User = require("../models/userModel");
const Quiz = require("../models/quizModel");
const QuizAttempt = require("../models/quizAttempt");

async function startQuizAttempt(userId, quizId) {
  const quizAttempt = new QuizAttempt({
    user: userId,
    quiz: quizId,
    startTime: new Date(),
  });
  await quizAttempt.save();
  return quizAttempt;
}

async function endQuizAttempt(attemptId, userAnswer) {
  const quizAttempt = await QuizAttempt.findById(attemptId).populate("quiz");
  const user = await User.findById(quizAttempt.user);

  quizAttempt.endTime = new Date();
  quizAttempt.userAnswer = userAnswer;
  quizAttempt.isCorrect =
    userAnswer.toLowerCase().trim() ===
    quizAttempt.quiz.answer.toLowerCase().trim();

  if (quizAttempt.isCorrect) {
    const coinsEarned = 300;
    quizAttempt.coinsEarned = coinsEarned;
    await user.addCoins(coinsEarned);
  }

  await quizAttempt.save();
  return quizAttempt;
}

async function getUserProgress(userId) {
  const attempts = await QuizAttempt.find({ user: userId }).populate("quiz");
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.isCorrect).length;
  const totalCoinsEarned = attempts.reduce((sum, a) => sum + a.coinsEarned, 0);
  const averageTime =
    attempts.reduce((sum, a) => sum + (a.endTime - a.startTime), 0) /
    totalAttempts;

  return {
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
    totalCoinsEarned,
    averageTimePerQuiz: averageTime,
  };
}

module.exports = {
  startQuizAttempt,
  endQuizAttempt,
  getUserProgress,
};
