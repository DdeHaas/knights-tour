export const getDurationUntilNow = (startTimeInMilliSeconds) => {
  return getDuration(new Date().getTime(), startTimeInMilliSeconds);
};

export const getDuration = (endTimeInMilliSeconds, startTimeInMilliSeconds) => {
  if (endTimeInMilliSeconds == null || startTimeInMilliSeconds == null) {
    return "00:00:00.000";
  }

  const duration = endTimeInMilliSeconds - startTimeInMilliSeconds;

  const msec = parseInt(duration % 1000)
    .toString()
    .padStart(3, "0");
  const sec = Math.floor((duration / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const min = Math.floor((duration / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const hrs = Math.floor((duration / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");

  return `${hrs}:${min}:${sec}.${msec}`;
};
