export type RGB = [number, number, number];

export function rgbToHex(rgb: RGB): string {
  const integer = (
    ((Math.round(rgb[0]) & 0xFF) << 16)
    + ((Math.round(rgb[1]) & 0xFF) << 8)
    + (Math.round(rgb[2]) & 0xFF)
  );

  const string = integer.toString(16).toUpperCase();
  return '000000'.substring(string.length) + string;
}

export function hexToRgb(hex: string): RGB {
  if (!hex) return [0, 0, 0];

  const match = hex.match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) return [0, 0, 0];

  let colorString = match[0];

  if (match[0].length === 3) colorString = colorString.split('').map(char => char + char).join('');

  const integer = parseInt(colorString, 16);
  const r = (integer >> 16) & 0xFF;
  const g = (integer >> 8) & 0xFF;
  const b = integer & 0xFF;

  return [r, g, b];
}