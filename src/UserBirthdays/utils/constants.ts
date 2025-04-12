export const DanhoBirthdayCalendarKey = "danho-birthday-calendar";

// \d{1,2}/\d{1,2}(/\d{2|4})? - Matches a date in the format DD/MM/YYYY
export const BIRTHDAY_REGEX = /\d{1,2}\/\d{1,2}(\/(\d{4}|\d{2}))?/; // [(0-9){1,2}/(0-9){1,2}/(2|20)(0-9){2}]

export function getBirthdate(birthdate: string) {
  const now = new Date();
  const [day, month, year] = birthdate
    .split('/')
    .map((value, index) => Number(value) + (
      value.length === 2 && index === 2
        ? now.getFullYear() - 2000 > Number(value) ? 2000 : 1900
        : 0
    ));
  return new Date(year || now.getFullYear(), month - 1, day);
}