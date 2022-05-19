import ChannelManipulator from "./Channel";
import $ from 'danho-discordium/dquery';
import MessageDOMArray from "./MessageDOMArray";
import ButtonDOMMap from "./ButtonDOMMap";

export class DOM {
    constructor(private source: ChannelManipulator) {}

    public get content() { 
        return this.source.rootNode; 
    }
    public get channelList() {
        return $(s => s.ariaLabel("Channels", 'ul'));
    }
    public get channelListItem() {
        return this.channelList.children(s => s
            .className("containerDefault", 'li')
            .and
            .data("dnd-name", this.source.props.name)
        );
    }
    public get textArea() {
        return this.content.children(s => s.tagName("form").className("channelTextArea", 'div'), true);
    }
    public get search() {
        return this.content.previousSibling.children(s => s.className("DraftEditor-editorContainer", 'div'), true);
    }

    public readonly messages = new MessageDOMArray(this.source);
    public readonly buttons = new ButtonDOMMap(this);
}
export default DOM;