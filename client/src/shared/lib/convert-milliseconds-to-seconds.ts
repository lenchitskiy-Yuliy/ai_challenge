export function convertMillisecondsToSeconds(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const millisecondsFraction = (milliseconds % 1000) / 10;

  return seconds + millisecondsFraction / 100;
}
