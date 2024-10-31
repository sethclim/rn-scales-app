export const stringToDate = (date_string: string) => {
  const d = new Date(date_string);

  if (!(d instanceof Date)) throw Error('Null Date');

  return d;
};

export const dateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};
