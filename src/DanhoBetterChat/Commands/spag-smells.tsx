import { buildCommand } from './CommandsModule';

type Props = {}

export default buildCommand<Props>("spag-smells", "Tell spag he smells", '', ["smelly"], async (Lib, React, Message, props) => {
    const { UserStore } = Lib.Libraries.ZLibrary.DiscordModules;
    const spag = Object.values(UserStore.getUsers()).find(user => user.username === "Pebbles");
    return <Message content={`@${spag.username} you smell lol`} suppressPing />
})