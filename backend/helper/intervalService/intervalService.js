const createIntervalService = (fn, interval = 1 * 60 * 1000) => {
  let counter = 0;
  const TEN_MINUTES = interval;
  let intervalId = null;

  const start = () => {
    if (intervalId) return;

    try {
      counter++;
      console.log("interval counter : ", counter);
      fn();
    } catch (error) {
      console.error("Error in interval function:", error);
    }

    intervalId = setInterval(async () => {
      try {
        counter++;
        console.log("interval counter in interval id  : ", counter);
        await fn();
      } catch (error) {
        console.error("Error in interval function in interval id: ", error);
      }
    }, TEN_MINUTES);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
};

export default createIntervalService;
