const LAUNCH_MILLISECONDS = 1644364800000;

export const getDaysFromLaunch = () => {
  const currentDate = new Date();
  const millisecondsFromLaunch = currentDate.valueOf() - LAUNCH_MILLISECONDS;
  const wholeDaysFromLaunch = Math.floor(
    millisecondsFromLaunch / (1000 * 60 * 60 * 24)
  );
  return wholeDaysFromLaunch;
};
