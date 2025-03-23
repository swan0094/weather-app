export const getDayName = (date: Date) => {
  return new Date(date).toLocaleDateString("en-AU", { weekday: "long" });
};
