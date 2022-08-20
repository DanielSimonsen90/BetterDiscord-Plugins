import { Finder } from "@discordium/api";
import Input from "./_Input";

export type TextInput<Props = {}> = Input<string, Props>;
export const TextInput: TextInput = Finder.byName("TextInput");
export default TextInput;