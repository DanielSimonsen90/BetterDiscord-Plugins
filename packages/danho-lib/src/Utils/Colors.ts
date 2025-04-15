import { Finder } from "../Injections/finder";

export type RGB = [number, number, number];

function rgbToHex(rgb: RGB): string {
  const integer = (
    ((Math.round(rgb[0]) & 0xFF) << 16)
    + ((Math.round(rgb[1]) & 0xFF) << 8)
    + (Math.round(rgb[2]) & 0xFF)
  );

  const string = integer.toString(16).toUpperCase();
  return '000000'.substring(string.length) + string;
}

function hexToRgb(hex: string): RGB {
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

const DiscordColors: Record<(
  | `${'BLACK' | 'BLUE' | 'BRAND' | 'GREEN' | 'ORANGE' | 'PRIMARY' | 'RED' | 'TEAL' | 'WHITE' | 'YELLOW'}${'' | `_${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${0 | 3 | 6}0`}`
  | `${'BLUE' | 'BLUE__NEW' | 'BLURPLE' | 'GREEN' | 'GREEN_NEW' | 'NEUTRAL' | 'ORANGE_NEW' | 'PINK' | 'RED_NEW' | 'TEAL_NEW' | 'YELLOW_NEW'}_${`${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${'' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | '100'}`
  | 'BUNGIE' | 'CRUNHYROLL' | 'EBAY' | 'EPIC_GAMES' | 'FACEBOOK' | 'GITHUB' | 'PAYPAL' | 'PLAYSTATION' | 'REDDIT' | 'RIOT_GAMES' | 'SAMSUNG' | 'SKYPE' | 'SPOTIFY' | 'STEAM' | 'TWITCH' | 'TWITCH_SECONDARY' | 'TWITTER' | 'XBOX' | 'YOUTUBE'
  | 'PARTNER'
  | `ROLE_${'BLUE' | 'BROWN' | 'BURGUNDY' | 'DARK_BLUE' | 'DARK_GREY' | 'DARK_PURPLE' | 'DARK_TEAL' | 'DEFAULT' | 'GREEN' | 'GREY' | 'LIGHT_BLUE' | 'LIGHT_GREEN' | 'LIGHT_GREY' | 'MAGENTA' | 'ORANGE' | 'PURPPLE' | 'SALMON' | 'SKY_BLUE' | 'TAN' | 'TEAL' | 'TERRACOTTA' | 'YELLOW'}`
), string> = Finder.byKeys(["BRAND", "RED"]);

export const ColorUtils = {
  rgbToHex,
  hexToRgb,
  DiscordColors,
}

export default ColorUtils;