import { Finder } from "@discordium/api"

export type ParseBioReactModule = {
    parseBioReact: (bio: string, reactElements?: boolean, i?: {}, o?: any) => Array<JSX.Element>
}
export const parseBioReact: ParseBioReactModule['parseBioReact'] = (Finder.byProps("parseBioReact") as ParseBioReactModule).parseBioReact;
export default parseBioReact;