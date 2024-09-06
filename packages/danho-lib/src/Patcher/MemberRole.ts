import { CSSProperties, ReactElement, MouseEvent } from "react";

export type MemberRole = {
    children: ReactElement<{
        "aria-label": string,
        children: [
            roleCircle: ReactElement<{
                "aria-hidden": false,
                "aria-label": string,
                children: [
                    ReactElement<{
                        color: string;
                    }>,
                    ReactElement<{
                        "aria-hidden": true,
                        className: string,
                        color: string;
                    }> | false
                ],
                className: string,
                focusProps: {
                    focusClassName: string,
                },
                onClick(): any;
                role: "button",
                tabIndex: -1,
                tag: "div";
            }>,
            roleIcon: ReactElement<{
                className: string,
                enableTooltip: boolean,
                name: string,
                size: number,
                src: string,
                unicodeEmoji: undefined;
            }> | null,
            roleName: ReactElement<{
                "aria-hidden": true,
                children: string,
                className: string,
            }>
        ],
        className: string,
        "data-list-item-id": string,
        onContextMenu(e: MouseEvent): void;
        onFocus(): void;
        role: "listitem",
        style: CSSProperties,
        tabIndex: -1,
    }>,
};
export default MemberRole;