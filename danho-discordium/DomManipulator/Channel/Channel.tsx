import { ChannelButtons } from ".";
import $, { DQuery } from '@dquery'
import DOM from "./DOM";
import { Message } from "@discord";
import { Channel } from "danho-discordium/Patcher";

export default class ChannelManipulator {
    constructor(record: MutationRecord, public readonly props: Channel) {
        this.rootNode = $(record.target as HTMLElement);
        this.dom = new DOM(this);
    }

    public readonly rootNode: DQuery;
    public readonly dom: DOM;

    public writeText(text: string) {
        const chatInput = $(s => s.tagName('main').tagName("form").className("channelTextArea").className("textArea").role("textbox", 'div'), true);
        const [insertText] = chatInput.prop<Function>("insertText", "node");
        insertText(text);
    }

    public triggerButton(type: ChannelButtons) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.dom.buttons.get(type).element.click())
            }, 100)
        });
    }

    public addButton(panel: 'left' | 'right' | 'toolbar', side: 'left' | 'right', button: JSX.Element) {
        const buttonContainer = (() => {
            switch (panel) {
                case 'left': return this.dom.buttons.buttonsLeft;
                case 'right': return this.dom.buttons.buttonsRight;
                case 'toolbar': return this.dom.buttons.buttonsToolbar;
                default: {
                    console.error(`Unknown panel ${panel}`);
                    return this.dom.buttons.buttonsRight;
                }
            }
        })();
        return buttonContainer[`${side === 'left' ? 'prepend' : 'append'}Component`](button);
    }

    public pin(message: HTMLLIElement) {
        this.togglePin(message, true);
    }
    public unpin(message: HTMLLIElement) {
        this.togglePin(message, false);
    }
    private togglePin(message: HTMLLIElement, force: boolean) {
        const [props] = $(message).prop<Message>("message");
        if ((props.pinned && force) || (!props.pinned && !force)) return;

        console.error(`Toggle pin is not implemented yet`);
    }

    public delete(message: HTMLLIElement) {
        console.error(`Delete message is not implemented yet`);
    }
        
    public react(reaction: string, message?: HTMLLIElement) {
        console.error(`React message is not implemented yet`);
    }
}