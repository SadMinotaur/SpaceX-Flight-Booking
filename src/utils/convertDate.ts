const convertDate = (date_utc?: string): string => {
  if (!date_utc) return "";
  return new Date(date_utc).toLocaleDateString("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default convertDate;
