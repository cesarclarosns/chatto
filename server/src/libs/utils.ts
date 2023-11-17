export const convertHoursToMilliseconds = (hours: number) => {
  return hours * 60 * 60 * 1_000
}

export const convertMinutesToMilliseconds = (minutes: number) => {
  return minutes * 60 * 1_000
}
