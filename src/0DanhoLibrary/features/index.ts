import DiscordEnhancements from "./discord-enhancements";
import DanhoEnhancements from "./danho-enhancements";

const features = [
  ...DiscordEnhancements,
  ...DanhoEnhancements,
];

export const Features = () => features.forEach(feature => 'default' in feature && feature.default());
export const styles = features.map(feature => 
  'styles' in feature ? feature.styles 
  : 'style' in feature ? feature.style
  : ''
).join("\n\n");