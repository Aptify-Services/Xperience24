export function generateDatabaseDateTime(dateSelected) {
  // This null check important, as without null check the date class returns
  // value as 1/1/1970.
  if (!dateSelected) {
    return dateSelected;
  }
  const date = new Date(dateSelected);
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const fullFormattedDate = formattedDate + "T00:00:00";
  return fullFormattedDate;
}

export function generateDateMMDDYYYY(dateSelected) {
  // This null check important, as without null check the date class returns
  // value as 1/1/1970.
  if (!dateSelected) {
    return dateSelected;
  }
  const date = new Date(dateSelected);
  const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
  const fullFormattedDate = formattedDate;
  return fullFormattedDate;
}
