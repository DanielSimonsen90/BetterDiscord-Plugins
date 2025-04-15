function join(args?: Array<string | undefined>, separator = ',', includeAnd = true): string {
  const validArgs: string[] = args?.filter(arg => arg !== undefined && arg !== null && arg !== '');
  if (!validArgs || validArgs.length === 0) return '';
  if (validArgs.length === 1) return validArgs.shift()!;

  const lastArg = validArgs.pop()!;
  const combinedArgs = validArgs.join(separator);
  return `${combinedArgs}${includeAnd ? ' & ' : ''}${lastArg}`;
}

function kebabCaseFromCamelCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
function kebabCaseFromPascalCase(str: string): string {
  return kebabCaseFromCamelCase(str.charAt(0).toLowerCase() + str.slice(1));
}

function pascalCaseFromSnakeCase(str: string): string {
  const replaced = str.replace(/_./g, match => ` ${match.charAt(1).toUpperCase()}`);
  return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}

function pascalCaseFromCamelCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 9);
}


type DateSeperation = '-' | '/';
export type DateFormat = (
  | `YYYY${DateSeperation}MM${DateSeperation}DD`
  | `MM${DateSeperation}DD${DateSeperation}YYYY`
  | `DD${DateSeperation}MM${DateSeperation}YYYY`
)
function formatDate(date: Date, format: DateFormat = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const withZero = (num: number) => String(num).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', withZero(month))
    .replace('DD', withZero(day));
}

export const StringUtils = {
  join, formatDate,
  kebabCaseFromCamelCase, kebabCaseFromPascalCase,
  pascalCaseFromSnakeCase, pascalCaseFromCamelCase,
  generateRandomId,
}

export default StringUtils;