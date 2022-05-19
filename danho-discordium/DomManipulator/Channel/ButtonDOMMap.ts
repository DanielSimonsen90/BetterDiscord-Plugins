import { DQuery, Selector } from "danho-discordium/dquery";
import { ChannelButtons } from ".";
import DOM from "./DOM";

export class ButtonDOMMap extends Map<ChannelButtons, DQuery<HTMLDivElement>> {
    constructor(private dom: DOM) {
        super();

        const childFrom = (element: DQuery<HTMLElement>, selector: Selector<HTMLDivElement>) => element.children<HTMLDivElement, Selector<HTMLDivElement>, true>(selector, true);
        const expression = (label: string) => childFrom(this.buttonsRight, s => s.className("expression-picker-chat-input-button", 'div').ariaLabelContains(label, 'button'));
        
        const buttons = new Map<ChannelButtons, DQuery<HTMLDivElement>>([
            ['attach', childFrom(this.buttonsLeft, s => s.className("attachButton", 'button'))],

            ['timestamp', childFrom(this.buttonsRight, s => s.className("timestamp-button", 'button'))],
            ['gift', childFrom(this.buttonsRight, s => s.ariaLabelContains("gift", 'button'))],
            ['gif', expression("GIF picker")],
            ['sticker', expression("sticker picker")],
            ['emoji', expression("Select emoji")],
            ['send', childFrom(this.buttonsRight, s => s.ariaLabel("Send Message", 'button'))],

            ['thread', childFrom(this.buttonsToolbar, s => s.ariaLabel("Threads", 'div'))],
            ['mute', childFrom(this.buttonsToolbar, s => s.ariaLabel("Notification Settings", 'div'))],
            ['pin', childFrom(this.buttonsToolbar, s => s.ariaLabel("Pinned Messages", 'div'))],
            ['member-list', childFrom(this.buttonsToolbar, s => s.ariaLabelContains("Member List", 'div'))],
            ['search', childFrom(this.buttonsToolbar, s => s.className('searchBar', 'div').role("button"))],
            ['inbox', childFrom(this.buttonsToolbar, s => s.ariaLabel("Inbox", 'div'))],
        ]);
        for (const [key, value] of buttons) {
            this.set(key as ChannelButtons, value);
        }
    }

    public get buttonsLeft() {
        return this.dom.textArea.children(s => s.className("attachWrapper"), true) as DQuery<HTMLDivElement>;
    }
    public get buttonsRight() {
        return this.dom.textArea.children(s => s.className("buttons"), true) as DQuery<HTMLDivElement>;
    }
    public get buttonsToolbar() {
        return this.dom.content.previousSibling.children(s => s.className("toolbar"), true) as DQuery<HTMLDivElement>;
    }
    }
export default ButtonDOMMap;