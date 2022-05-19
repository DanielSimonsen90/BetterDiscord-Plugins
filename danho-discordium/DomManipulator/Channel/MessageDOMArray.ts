import $ from 'danho-discordium/dquery';
import ChannelManipulator from './Channel';

export class MessageDOMArray extends Array<HTMLLIElement> {
    constructor(private source: ChannelManipulator) {
        super(...$(source.rootNode).children('ol', true).children('li').map(d => d.element as HTMLLIElement));
    }

    public get last() {
        return this[this.length - 1];
    }
    public lastSentFrom(userId?: string): HTMLLIElement | undefined {
        return this.reverse().find(message => message.dataset.authorId === userId ?? document.body.dataset.currentUserId);
    }
}
export default MessageDOMArray;