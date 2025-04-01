export function join(args?: Array<string | undefined>, separator = ',', includeAnd = true): string {
  const validArgs: string[] = args?.filter(arg => arg !== undefined && arg !== null && arg !== '');
  if (!validArgs || validArgs.length === 0) return '';
  if (validArgs.length === 1) return validArgs.shift()!;

  const lastArg = validArgs.pop()!;
  const combinedArgs = validArgs.join(separator);
  return `${combinedArgs}${includeAnd ? ' & ' : ''}${lastArg}`;
}

export function kebabCaseFromCamelCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const StringUtils = {
  join, kebabCaseFromCamelCase
}

export default StringUtils;