const formatTimeSpent = (totalTimeSpentInSeconds) => {
  if (totalTimeSpentInSeconds < 60) {
    return `${totalTimeSpentInSeconds} secs`;
  }
  const minutes = Math.floor(totalTimeSpentInSeconds / 60);
  const seconds = totalTimeSpentInSeconds % 60;
  return `${minutes} mins ${seconds} secs`;
};

export default formatTimeSpent;
