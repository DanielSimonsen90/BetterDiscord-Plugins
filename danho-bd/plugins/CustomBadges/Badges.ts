import { Component } from '../../libraries/React';

export class CustomBadge {
    constructor(public label: string, public weight: number, data: string | Component<any, any>) {
        if (typeof data === 'string') this.icon = data;
        else this.component = data;
    }

    public icon?: string
    public component?: Component<any, any>
}


import ZLibrary from '../../libraries/ZLibrary';
export const CustomBadges = (ZLibrary: ZLibrary) => new Array<CustomBadge>(
    new CustomBadge("Pingu Developer", 5684, "https://media.discordapp.net/attachments/767713017274040350/768002085052088351/PinguDev.png"),
    new CustomBadge("Nitro Gifter", 262143, NitroGifter(ZLibrary)),
    new CustomBadge("Verified", 3, "https://media.discordapp.net/attachments/773807780883726359/956654824542322748/Verified.png"),
).map(badge => {
    if (badge.component) return badge.component;
    if (!badge.icon) throw new Error(`Badge, ${badge.label}, doesn't have any children!`);
    return ZLibrary.DiscordModules.React.createElement('img', { 
        src: badge.icon,
        "aria-hidden": true,
        alt: badge.label,
        className: ZLibrary.DiscordClassModules.UserModal.profileBadge22
     })
})
export default CustomBadges;

function NitroGifter(ZLibrary: ZLibrary) {
    const createElement = ZLibrary.DiscordModules.React.createElement;

    return createElement("div", {
            className: "buttonWrapper-3YFQGJ",
            style: {
                opacity: 1,
                transform: 'none',
                color: '#fff'
            }
        }, createElement("svg", {
            width: 24, height: 24,
            "aria-hidden": false,
            viewBox: "0 0 24 24"
        }, createElement("path", {
            fill: "currentColor",
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: ["M16.886 7.999H20C21.104 7.999 22 8.896 22 9.999V11.999H2V9.999C2", 
                "8.896 2.897 7.999 4 7.999H7.114C6.663 7.764 6.236 7.477 5.879 7.121C4.709", 
                "5.951 4.709 4.048 5.879 2.879C7.012 1.746 8.986 1.746 10.121 2.877C11.758", 
                "4.514 11.979 7.595 11.998 7.941C11.9991 7.9525 11.9966 7.96279 11.9941", 
                "7.97304C11.992 7.98151 11.99 7.98995 11.99 7.999H12.01C12.01 7.98986 12.0079", 
                "7.98134 12.0058 7.97287C12.0034 7.96282 12.0009 7.95286 12.002 7.942C12.022", 
                "7.596 12.242 4.515 13.879 2.878C15.014 1.745 16.986 1.746 18.121 2.877C19.29", 
                "4.049 19.29 5.952 18.121 7.121C17.764 7.477 17.337 7.764 16.886 7.999ZM7.293", 
                "5.707C6.903 5.316 6.903 4.682 7.293 4.292C7.481 4.103 7.732 4 8 4C8.268 4", 
                "8.519 4.103 8.707 4.292C9.297 4.882 9.641 5.94 9.825 6.822C8.945 6.639", 
                "7.879 6.293 7.293 5.707ZM14.174 6.824C14.359 5.941 14.702 4.883 15.293", 
                "4.293C15.481 4.103 15.732 4 16 4C16.268 4 16.519 4.103 16.706 4.291C17.096", 
                "4.682 17.097 5.316 16.707 5.707C16.116 6.298 15.057 6.642 14.174 6.824ZM3", 
                "13.999V19.999C3 21.102 3.897 21.999 5 21.999H11V13.999H3ZM13", 
                "13.999V21.999H19C20.104 21.999 21 21.102 21 19.999V13.999H13Z"
            ].join(' ')
        }))
    )
}