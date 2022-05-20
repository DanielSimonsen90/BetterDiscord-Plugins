import React from "react";

export type RoleReturns = [props: RoleProps];

type RoleProps = {
    "aria-label": string;
    children: [
        roleCircle: React.ReactElement<RoleCircle>,
        roleIcon: React.ReactElement<RoleIcon> | null,
        roleName: React.ReactElement<RoleName>
    ],
    className: string;
    "data-list-item-id": string;
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => void;
    onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onFocus: (e: React.FocusEvent<HTMLDivElement>) => void;
    role: "listitem";
    style: {
        borderColor: string;
    },
    tabIndex: number;
}

type RoleCircle = {
    "aria-hidden": boolean,
    "aria-label": string,
    children: React.ReactElement<{
        "aria-hidden": boolean,
        className: string,
        color: string,
    }>,
    className: string,
    focusProps: {
        focusClassName: string,
    },
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    role: string,
    style: {
        backgroundColor: string,
    },
    tabIndex: number,
    tag: "div",
}
type RoleIcon = {
    className: string,
    enableTooltip: boolean,
    name: string,
    size: number,
    src: string,
    unicodeEmoji: string,
}
type RoleName = {
    "aria-hidden": boolean,
    children: string,
    className: string,
}