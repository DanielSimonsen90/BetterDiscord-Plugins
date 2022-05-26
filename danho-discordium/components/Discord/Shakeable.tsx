import { BaseProps } from "@lib/React";

export type ShakeableRef = {
    shake(time: 300 | number, intensity: 5 | number): void,
    stop(): void
}

export type Shakeable<Props = {}> = React.FunctionComponent<{
    ref: React.Ref<ShakeableRef>;
    children: React.ReactNode
} & BaseProps & Props>
export default Shakeable;