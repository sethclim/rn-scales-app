export const stringToDate = (date_string: string) => {
  const d = new Date(date_string);

  if (!(d instanceof Date)) throw Error('Null Date');

  return d;
};

const pad = (n: number) => n.toString().padStart(2, '0');

// Local calendar date as 'YYYY-MM-DD' (toISOString would use the UTC date)
export const dateToString = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

// Monday-first, matching the graph's Mon..Sun columns
export const getWeekRange = (today: Date) => {
  const daysSinceMonday = (today.getDay() + 6) % 7;
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - daysSinceMonday,
  );
  const sunday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6,
  );

  return {start: dateToString(monday), end: dateToString(sunday)};
};
