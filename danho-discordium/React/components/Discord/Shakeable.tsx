export type ShakeableRef = {
    shake(time: 300 | number, intensity: 5 | number): void,
    stop(): void
}

export type Shakeable<Props = {}> = React.FunctionComponent<{
    className?: string,
    ref: React.Ref<ShakeableRef>;
    children: React.ReactNode
} & Props>
export default Shakeable;