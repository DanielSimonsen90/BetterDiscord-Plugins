export type UserBio = {
    // children: Array<React.ReactNode>,
    children: React.Component<{
        children: Array<React.ReactNode>,
        lineClamp: number,
        variant: string
    }>
    className: string,
}
export default UserBio;