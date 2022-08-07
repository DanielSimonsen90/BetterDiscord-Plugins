import { buildCommand } from './CommandsModule';

type Props = {
    message: string;
}

export default buildCommand<Props>("say", "Say something I'm giving  up on you", 'message="Hello World"', [], (Lib, React, Message, props) => {
    return <Message content={props.message} />
})