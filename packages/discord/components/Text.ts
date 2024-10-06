import { TextModule } from '@danho-lib/Patcher/Text';
export default TextModule.render as (...args: Parameters<typeof TextModule.render>) => JSX.Element;