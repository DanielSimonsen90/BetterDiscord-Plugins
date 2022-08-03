/**
 * @name DanhoCustomBadges
 * @description Add custom badges >:)
 * @author Danho#2105
 * @version 0.0.2
 * @authorLink https://github.com/DanielSimonsen90
 * @website https://github.com/DanielSimonsen90/BetterDiscord-Plugins
 * @source https://github.com/DanielSimonsen90/BetterDiscord-Plugins/tree/master/src/DanhoCustomBadges
 * @updateUrl https://raw.githubusercontent.com/DanielSimonsen90/BetterDiscord-Plugins/master/dist/bd/DanhoCustomBadges.plugin.js
**/

/*@cc_on @if (@_jscript)
var pluginName = WScript.ScriptName.split(".")[0];
var shell = WScript.CreateObject("WScript.Shell");
shell.Popup(
    "Do NOT run scripts from the internet with the Windows Script Host!\nMove this file to your BetterDiscord plugins folder.",
    0,
    pluginName + ": Warning!",
    0x1030
);
var fso = new ActiveXObject("Scripting.FileSystemObject");
var pluginsPath = shell.expandEnvironmentStrings("%appdata%\\BetterDiscord\\plugins");
if (!fso.FolderExists(pluginsPath)) {
    var popup = shell.Popup(
        "Unable to find BetterDiscord on your computer.\nOpen the download page of BetterDiscord?",
        0,
        pluginName + ": BetterDiscord not found",
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer \"https://betterdiscord.app\"");
    }
} else if (WScript.ScriptFullName === pluginsPath + "\\" + WScript.ScriptName) {
    shell.Popup(
        "This plugin is already in the correct folder.\nNavigate to the \"Plugins\" settings tab in Discord and enable it there.",
        0,
        pluginName,
        0x40
    );
} else {
    var popup = shell.Popup(
        "Open the BetterDiscord plugins folder?",
        0,
        pluginName,
        0x34
    );
    if (popup === 6) {
        shell.Exec("explorer " + pluginsPath);
    }
}
WScript.Quit();
@else @*/

module.exports = (() => {
    const module = { exports: null };
    try {
'use strict';

const { Libraries: Libraries$4, Modules: Modules$3 } = window.BDD;
const { ZLibrary: ZLibrary$3 } = Libraries$4;
const { React: React$8, DanhoModules: DanhoModules$5 } = Modules$3;
const { classNames: classNames$3 } = DanhoModules$5.CompiledReact;
function Badge(props) {
    const { TooltipContainer, Clickable } = props.BDFDB.LibraryComponents;
    const { tooltip, clickable, img } = getProps(props);
    const onClickableClick = props.href ? () => window.open(props.href) :
        props.onClick ? props.onClick : undefined;
    const icon = (typeof img.src === 'string' ?
        React$8.createElement("img", { alt: ' ', "aria-hidden": true, src: img.src, className: img.className }) :
        img.src);
    return (React$8.createElement(TooltipContainer, { ...tooltip },
        React$8.createElement(Clickable, { ...clickable, role: "button", tabIndex: 0, onClick: onClickableClick, ...{
                "data-href": props.href,
                "data-id": props.id
            } }, icon)));
}
function getProps(props) {
    const classes = {
        clickable: ZLibrary$3.DiscordClassModules.UserModal.clickable,
        img: ZLibrary$3.DiscordClassModules.UserModal.profileBadge22,
    };
    const tooltip = {
        text: props.tooltipText,
        spacing: props.spacing || 24,
        key: props.tooltipText
    };
    const clickable = {
        className: classNames$3(classes.clickable, "danho-badge", props.classNameClickable),
        "aria-label": props.tooltipText,
    };
    const img = {
        src: props.src,
        className: classNames$3(classes.img, props.classNameImg),
    };
    return { tooltip, clickable, img };
}

const titles = {
    allowVerified: 'Allow custom Verified badge',
    allowVerifiedInvite: 'When clicking on a Verified badge, open the invite link to the server',
    allowPartneredInvite: 'When clicking on a Partnered badge, open the invite link to the server',
    users: 'Custom badges'
};

const name = "DanhoCustomBadges";
const description = "Add custom badges >:)";
const author = "Danho#2105";
const version = "0.0.2";
const config = {
	name: name,
	description: description,
	author: author,
	version: version
};

const { React: React$7 } = window.ZLibrary.DiscordModules;
function DefaultIcon() {
    return (React$7.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "71", height: "55", viewBox: "0 0 71 55", fill: "none" },
        React$7.createElement("link", { type: "text/css", rel: "stylesheet", id: "dark-mode-custom-link" }),
        React$7.createElement("link", { type: "text/css", rel: "stylesheet", id: "dark-mode-general-link" }),
        React$7.createElement("style", { lang: "en", type: "text/css", id: "dark-mode-custom-style" }),
        React$7.createElement("style", { lang: "en", type: "text/css", id: "dark-mode-native-style" }),
        React$7.createElement("g", { "clip-path": "url(#clip0)" },
            React$7.createElement("path", { xmlns: "http://www.w3.org/2000/svg", d: "M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z", fill: "var(--brand-experiment, hsl(235, calc(var(--saturation-factor, 1) * 85.6%), 64.7%))" })),
        React$7.createElement("defs", null,
            React$7.createElement("clipPath", { id: "clip0" },
                React$7.createElement("rect", { width: "71", height: "55", fill: "white" })))));
}

const { React: React$6, DanhoModules: DanhoModules$4 } = window.BDD.Modules;
const { useState: useState$3, useMemo: useMemo$2, useCallback: useCallback$2 } = React$6;
const { Button: Button$1, TextInput: TextInput$1, Form: { FormItem: FormItem$1 }, Margins: Margins$1 } = DanhoModules$4.CompiledReact.Components.Discord;
function SettingsBadge({ badge, user, onUpdate, onDelete }) {
    const [tooltip, setTooltip] = useState$3(badge.tooltip);
    const [src, setSrc] = useState$3(badge.src);
    const [href, setHref] = useState$3(badge.href);
    const [index, setIndex] = useState$3(badge.index.toString() ?? "0");
    const update = useMemo$2(() => ({ ...badge, tooltip, index: parseInt(index), src, href }), [tooltip, index, src, href]);
    const move = useCallback$2((offset) => {
        let newIndex = parseInt(index) + offset;
        if (newIndex < 0)
            newIndex = 0;
        onUpdate({ ...update, index: newIndex });
    }, [index, length, onUpdate, update]);
    const onTextChange = useCallback$2((value) => {
        if (!value)
            return setIndex("");
        let timeout;
        setIndex(value);
        clearTimeout(timeout);
        timeout = setTimeout(() => onUpdate({ ...update, index: parseInt(value) }), 500);
    }, [index]);
    return (React$6.createElement("div", { className: "settings-badge" },
        React$6.createElement("div", { className: "badge-form" },
            React$6.createElement(FormItem$1, null,
                React$6.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: 'https://media.discordapp.net/attachments/{channelId}/{messageId}}/unknown.png', value: src, onChange: setSrc }),
                React$6.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: `${user.username}'s new badge`, value: tooltip, onChange: setTooltip }),
                React$6.createElement(TextInput$1, { className: Margins$1.marginBottom8, placeholder: 'https://google.com', value: href, onChange: setHref }))),
        React$6.createElement("div", { className: "button-container" },
            React$6.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => onUpdate(update), color: Button$1.Colors.GREEN }, "Update badge"),
            React$6.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: onDelete, color: Button$1.Colors.RED }, "Delete"),
            React$6.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => move(-1), color: Button$1.Colors.BRAND_NEW }, "\u25C0"),
            React$6.createElement(TextInput$1, { className: 'text-input-container', placeholder: 'Index', value: index.toString(), onChange: onTextChange }),
            React$6.createElement(Button$1, { size: Button$1.Sizes.SMALL, onClick: () => move(1), color: Button$1.Colors.BRAND_NEW }, "\u25B6"))));
}

const { Libraries: Libraries$3, Modules: { React: React$5 } } = window.BDD;
const { profileBadge22 } = Libraries$3.ZLibrary.DiscordClassModules.UserModal;
function PlusIcon({ onClick }) {
    return (React$5.createElement("div", { className: "add-badge", onClick: onClick },
        React$5.createElement("svg", { className: profileBadge22, xmlns: "http://www.w3.org/2000/svg", version: "1.1", id: "Capa_1", x: "0px", y: "0px", viewBox: "0 0 490.2 490.2", style: {
                fill: 'var(--text-muted)'
            } },
            React$5.createElement("g", null,
                React$5.createElement("g", null,
                    React$5.createElement("path", { d: "M418.5,418.5c95.6-95.6,95.6-251.2,0-346.8s-251.2-95.6-346.8,0s-95.6,251.2,0,346.8S322.9,514.1,418.5,418.5z M89,89    c86.1-86.1,226.1-86.1,312.2,0s86.1,226.1,0,312.2s-226.1,86.1-312.2,0S3,175.1,89,89z" }),
                    React$5.createElement("path", { d: "M245.1,336.9c3.4,0,6.4-1.4,8.7-3.6c2.2-2.2,3.6-5.3,3.6-8.7v-67.3h67.3c3.4,0,6.4-1.4,8.7-3.6c2.2-2.2,3.6-5.3,3.6-8.7    c0-6.8-5.5-12.3-12.2-12.2h-67.3v-67.3c0-6.8-5.5-12.3-12.2-12.2c-6.8,0-12.3,5.5-12.2,12.2v67.3h-67.3c-6.8,0-12.3,5.5-12.2,12.2    c0,6.8,5.5,12.3,12.2,12.2h67.3v67.3C232.8,331.4,238.3,336.9,245.1,336.9z" }))))));
}

const { React: React$4, ReactDOM, DanhoModules: DanhoModules$3 } = window.BDD.Modules;
const { useEffect: useEffect$1, createRef: createRef$1 } = React$4;
const { $, CompiledReact } = DanhoModules$3;
const { classNames: classNames$2, Components: Components$2 } = CompiledReact;
const { UserProfileBadgeList } = Components$2.Discord;
const { default: BadgeList } = UserProfileBadgeList;
function SettingsBadgeList({ user, BDFDB, data: { premiumSince, boosterSince, badges }, onBadgeClick, onAddBadgeClick }) {
    const containerRef = createRef$1();
    useEffect$1(() => {
        if (!containerRef.current)
            return;
        const children = $(containerRef.current).firstChild.children().map(badge => ({
            tooltipText: badge.element.ariaLabel,
            src: badge.firstChild.attr('src'),
            href: badge.firstChild.attr("data-href"),
            id: badge.attr("data-id"),
            isDanhoBadge: badge.classes.includes("danho-badge"),
        })).map(({ isDanhoBadge, ...data }, index) => (React$4.createElement(Badge, { key: index, BDFDB: BDFDB, ...data, classNameClickable: isDanhoBadge && "custom", onClick: () => isDanhoBadge && onBadgeClick(badges.find(b => b.id === data.id)) })));
        ReactDOM.render((React$4.createElement(React$4.Fragment, null,
            children,
            React$4.createElement(PlusIcon, { onClick: onAddBadgeClick }))), containerRef.current.lastElementChild);
    }, [badges, onBadgeClick, BDFDB]);
    return (React$4.createElement("div", { className: "settings-badge-list-container", ref: containerRef },
        React$4.createElement(BadgeList, { user: user, className: 'hidden', premiumSince: premiumSince ? new Date(premiumSince) : null, premiumGuildSince: boosterSince ? new Date(boosterSince) : null }),
        React$4.createElement("div", { "data-user-id": user.id, className: classNames$2("settings-badge-list", BDFDB.DiscordClassModules.UserBadges.container, BDFDB.DiscordClassModules.UserProfileHeader.badgeList) })));
}

const { useState: useState$2, useCallback: useCallback$1 } = window.BDD.Modules.React;
function useSelectedBadge(badges) {
    const [_badge, _setBadge] = useState$2(undefined);
    const setBadge = useCallback$1((badge) => {
        const resolvedBadge = typeof badge === 'function' ? badge(_badge) : badge;
        if (!resolvedBadge)
            return _setBadge(undefined);
        const foundBadge = badges.find(b => b.id === resolvedBadge.id);
        _setBadge(foundBadge);
    }, [badges]);
    return [_badge, setBadge];
}

const { Libraries: Libraries$2, Modules: Modules$2 } = window.BDD;
const { ZLibrary: ZLibrary$2 } = Libraries$2;
const { React: React$3, DanhoModules: DanhoModules$2 } = Modules$2;
const { useMemo: useMemo$1, useCallback } = React$3;
const { classNames: classNames$1, Components: Components$1 } = DanhoModules$2.CompiledReact;
const { Avatar: { default: Avatar, Sizes }, DiscordTag, Form: { FormItem }, Margins, ClassModules } = Components$1.Discord;
function SettingsUser({ BDFDB, userId, data, onSave, addBadge, deleteUser }) {
    const { badges } = data;
    const user = useMemo$1(() => ZLibrary$2.DiscordModules.UserStore.getUser(userId) ?? {
        username: 'Unknown',
        avatar: React$3.createElement(DefaultIcon, null),
        get tag() { return "Unknown#0000"; }
    }, [userId]);
    const [selectedBadge, setSelectedBadge] = useSelectedBadge(badges);
    const { AccountDetails, Titles, UserProfileHeader } = ClassModules;
    const onBadgeClicked = useCallback((badge) => {
        return setSelectedBadge(selectedBadge && badge.id === selectedBadge.id ? null : badge);
    }, [selectedBadge, data]);
    const onBadgeUpdate = useCallback((badge) => {
        BdApi.showToast("Badge updated", { type: 'info' });
        const newBadges = badges.map(b => b.id === selectedBadge.id ? badge : b);
        console.log('Saving new badges', newBadges);
        onSave(newBadges);
        setSelectedBadge(undefined);
    }, [selectedBadge, data, onSave]);
    const onBadgeDelete = useCallback(() => {
        const newBadges = [...badges];
        newBadges.splice(newBadges.findIndex(b => b.id === selectedBadge.id), 1);
        setSelectedBadge(b => (b && badges[b.index - 1]) ?? badges[badges.length - 1]);
        newBadges.length === 0 ? deleteUser() : onSave(newBadges);
    }, [data, onSave, selectedBadge]);
    return (React$3.createElement(FormItem, { "data-setting-for": userId, className: classNames$1(Margins.marginBottom20, 'settings-user') },
        React$3.createElement("div", { className: "user-presentation" },
            React$3.createElement("figure", { className: classNames$1(AccountDetails.avatarWrapper, 'avatar') },
                React$3.createElement(Avatar, { src: BDFDB.UserUtils.getAvatar(userId), className: classNames$1(AccountDetails.avatar, 'avatar'), size: Sizes.SIZE_56 })),
            React$3.createElement(DiscordTag, { user: user, className: classNames$1(Titles.h1, AccountDetails.nameTag, Titles.defaultColor), discriminatorClassName: UserProfileHeader.discriminator }),
            React$3.createElement(SettingsBadgeList, { BDFDB: BDFDB, user: user, data: data, onAddBadgeClick: addBadge, onBadgeClick: onBadgeClicked })),
        selectedBadge && React$3.createElement(SettingsBadge, { badge: selectedBadge, user: user, onUpdate: onBadgeUpdate, onDelete: onBadgeDelete })));
}

const { Libraries: Libraries$1, Modules: Modules$1, Utils } = window.BDD;
const { BDFDB: BDFDB$1, ZLibrary: ZLibrary$1 } = Libraries$1;
const { React: React$2, DanhoModules: DanhoModules$1 } = Modules$1;
const { useState: useState$1, createRef, useEffect } = React$2;
const { Button, TextInput, Shakeable } = DanhoModules$1.CompiledReact.Components.Discord;
const { findUserByTag } = Utils;
function AddUser({ BDFDB, onSubmit }) {
    const [userString, setUserString] = useState$1("");
    const [errorLabel, setErrorLabel] = useState$1(undefined);
    const shakeable = createRef();
    useEffect(() => {
        if (shakeable.current && errorLabel)
            shakeable.current.shake(300, 1);
    }, [errorLabel]);
    const onSend = async () => {
        const user = (/.+#[0-9]{4}/.test(userString) ? BDFDB.LibraryModules.UserStore.findByTag(userString.split("#").slice(0, -1).join("#"), userString.split("#").pop()) :
            /\d{18}/.test(userString) ? ZLibrary$1.DiscordModules.UserStore.getUser(userString) :
                await findUserByTag(userString, BDFDB));
        if (!user)
            return setErrorLabel("User not found");
        onSubmit(user);
    };
    return (React$2.createElement(Shakeable, { ref: shakeable, className: "add-user", ...{ "data-error": errorLabel } },
        React$2.createElement(TextInput, { placeholder: "Username, tag or id", onKeyDown: e => (e.key === 'Enter' || e.key === 'NumpadEnter') && onSend(), onChange: v => {
                setUserString(v);
                if (errorLabel)
                    setErrorLabel(undefined);
            }, value: userString }),
        React$2.createElement(Button, { color: Button.Colors.BRAND_NEW, onClick: onSend }, "Add user")));
}

const { Libraries, Modules } = window.BDD;
const { BDFDB, ZLibrary } = Libraries;
const { React: React$1, DanhoModules } = Modules;
const { useState, useMemo } = React$1;
const { classNames, Components } = DanhoModules.CompiledReact;
const { Discord, Form, Setting } = Components;
const { Form: { FormTitle } } = Discord;
const { Section, Item } = Form;
const getNewBadge = (badges, userId) => ({
    id: Date.now().toString(),
    index: 0,
    tooltip: `${ZLibrary.DiscordModules.UserStore.getUser(userId).tag}'s Badge`,
    src: "https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif",
});
const SettingsPanel = ({ BDFDB, defaults, set, ...settings }) => {
    const [allowVerified, setAllowVerified] = useState(settings.allowVerified ?? defaults.allowVerified);
    const users = useMemo(() => settings.users || defaults.users, [settings, settings.users, defaults.users]);
    const userComponents = useMemo(() => Object.entries(users).map(([userId, data]) => (React$1.createElement(SettingsUser, { ...{ userId, data, BDFDB }, onSave: badges => set({ users: { ...users, [userId]: { ...data, badges } } }), addBadge: () => set({ users: { ...users, [userId]: { ...data, badges: [...data.badges, getNewBadge(data.badges, userId)] } } }), deleteUser: () => {
            const newUsers = { ...users };
            delete newUsers[userId];
            set({ users: newUsers });
        } }))), [settings, users, set]);
    return (React$1.createElement("section", { id: `${name}-settings`, className: "settings" },
        React$1.createElement(Section, { title: "Allow Discord Community Programs", className: classNames('allow-discord-community-programs') },
            React$1.createElement(Item, { className: 'vertical' },
                React$1.createElement(Item, { className: 'horizontal' },
                    React$1.createElement(FormTitle, null, titles.allowVerified),
                    React$1.createElement(Setting, { key: "allowVerified", value: settings.allowVerified, set: set, onChange: v => typeof v === 'boolean' && setAllowVerified(v), titles: titles })),
                allowVerified && (React$1.createElement(Item, null,
                    React$1.createElement(FormTitle, null, titles.allowVerifiedInvite),
                    React$1.createElement(Setting, { key: "allowVerifiedInvite", value: settings.allowVerifiedInvite, set: set, titles: titles }))),
                React$1.createElement(Item, { className: 'horizontal' },
                    React$1.createElement(FormTitle, null, titles.allowPartneredInvite),
                    React$1.createElement(Setting, { key: "allowPartneredInvite", value: settings.allowPartneredInvite, set: set, titles: titles })))),
        React$1.createElement(Section, { className: classNames('custom-badges'), title: "Cusom Badges" },
            userComponents,
            React$1.createElement(AddUser, { BDFDB: BDFDB, onSubmit: user => set({ users: { ...users, [user.id]: { badges: [getNewBadge(users[user.id]?.badges ?? [], user.id)] } } }) }))));
};

const styles = ".hidden {\n  display: none;\n}\n\n.vertical {\n  flex-direction: column;\n  gap: 1rem;\n}\n.vertical .center {\n  place-items: center;\n}\n\n.horizontal {\n  flex-direction: row;\n}\n.horizontal .center {\n  place-content: center;\n}\n\n*[data-error]::after {\n  content: attr(data-error);\n  color: var(--status-danger);\n  position: absolute;\n  top: -1.1em;\n  z-index: 1010;\n}\n\n.button-container {\n  display: flex;\n  flex-direction: row;\n}\n.button-container button {\n  margin-inline: 0.25rem;\n}\n.button-container .text-input-container input {\n  padding: 7px;\n}\n\nsection.settings div[class*=container] > div[class*=labelRow] + div[class*=divider] {\n  display: none;\n}\nsection.settings div[class*=container] {\n  margin-bottom: 0;\n}\nsection.settings h5 {\n  margin-bottom: 0;\n}\nsection.settings div[class*=sectionTitle] {\n  margin-bottom: 1rem;\n}\nsection.settings div[class*=sectionTitle] h5 {\n  font-size: 1.25em;\n  font-weight: bolder;\n}\nsection.settings .add-badge {\n  margin-left: 1rem;\n  cursor: pointer;\n  z-index: 2000;\n}\n\n.user-presentation {\n  display: grid;\n  grid-template-areas: \"avatar tag\" \"avatar badgeList\";\n  grid-template-rows: auto 3rem;\n  grid-template-columns: 4em 1fr;\n}\n.user-presentation .avatar {\n  grid-area: avatar;\n  display: grid;\n  margin: unset;\n}\n.user-presentation .avatar img {\n  border-radius: 50%;\n  height: 100%;\n  width: 100%;\n  object-fit: contain;\n}\n.user-presentation .tag {\n  grid-area: tag;\n  display: flex;\n}\n.user-presentation button.delete {\n  grid-area: tag;\n  width: fit-content;\n}\n.user-presentation div[class*=clickable]:not(.danho-badge.custom) {\n  opacity: 0.45;\n}\n\n.add-user {\n  position: relative;\n  display: flex;\n  flex-direction: row;\n  gap: 0.5rem;\n}\n.add-user div[class*=inputWrapper] {\n  flex: 1;\n}\n.add-user button {\n  margin-left: auto;\n}\n\n.settings-user {\n  padding: 1em;\n  border-radius: 0.25em;\n  display: grid;\n  gap: 1em;\n}\n.settings-user:nth-child(2n) {\n  --modal-background-secondary: var(--modal-footer-background);\n  background-color: var(--modal-background-secondary);\n}\n\n.settings-badge-list {\n  counter-set: badge-counter -1;\n}\n.settings-badge-list .danho-badge::after {\n  counter-increment: badge-counter;\n  content: counter(badge-counter) !important;\n  position: relative !important;\n  color: var(--text-muted, #a3a6aa) !important;\n  top: 0.25em;\n  transform: unset !important;\n  font-size: initial !important;\n}\n\n.danho-badge {\n  position: relative;\n  display: grid;\n  place-items: center;\n  box-sizing: border-box;\n}";

const allowVerified = false;
const allowVerifiedInvite = false;
const allowPartneredInvite = false;
const users = {
	"245572699894710272": {
		premiumSince: null,
		boosterSince: null,
		badges: [
			{
				id: "1653656404017",
				tooltip: "Pingu Developer",
				index: 3,
				src: "https://cdn.discordapp.com/attachments/773807780883726359/977895822291238942/Pingu_Developer.png",
				href: "https://google.com"
			}
		]
	},
	"361815289278627851": {
		premiumSince: null,
		badges: [
			{
				id: "1653656423234",
				tooltip: "Sussie Baka",
				index: 0,
				src: "https://media.discordapp.net/attachments/911311077130776577/977273608823005234/IMG_1840.jpg"
			}
		]
	}
};
const settings = {
	allowVerified: allowVerified,
	allowVerifiedInvite: allowVerifiedInvite,
	allowPartneredInvite: allowPartneredInvite,
	users: users
};

const { React } = window.ZLibrary.DiscordModules;
const index = window.BDD.PluginUtils.buildPlugin({ ...config, styles, settings }, (Lib) => {
    const { $ } = Lib.Modules.DanhoModules;
    const Plugin = Lib.GetPlugin();
    return class DanhoCustomBadge extends Plugin {
        constructor() {
            super(...arguments);
            this.SettingsPanel = (props) => {
                const [current, defaults, set] = this.settings.useStateWithDefaults();
                return React.createElement(SettingsPanel, { ...props, ...{ ...current, defaults, set }, BDFDB: this.BDFDB });
            };
        }
        async start() {
            await super.start({
                after: {
                    default: [{
                            selector: "UserProfileBadgeList", isModal: true
                        }]
                }
            });
            this.patcher.after(Lib.Libraries.Discordium.Finder.byName("UserProfileBadgeList"), "default", (props) => {
                console.log('test');
            });
        }
        patchUserProfileBadgeList({ args: [props], result }) {
            this.logger.log("Hello");
            if (!Array.isArray(result.props.children))
                return this.logger.warn('UserProfileBadgeList children is not an array');
            const ref = $(s => s.getElementFromInstance(result, true), false);
            if (!ref.length)
                return console.log("No ref element");
            const userSettings = this.getUserSettings(props.user.id);
            if (!userSettings)
                return this.logger.log("User has no settings");
            for (const { index, tooltip, ...props } of userSettings.badges) {
                const badge = (() => {
                    try {
                        return React.createElement(Badge, { BDFDB: this.BDFDB, tooltipText: tooltip, ...props });
                    }
                    catch (err) {
                        this.logger.error(err);
                        return null;
                    }
                })();
                if (badge)
                    result.props.children.splice(index, 0, badge);
            }
            this.storePremiumData(props.user.id, result);
        }
        storePremiumData(userId, badgeList) {
            const userSettings = this.getUserSettings(userId);
            const isPremiumBadge = (text) => text?.includes("Subscriber since") || text?.includes("Server boosting since");
            const premiumBadges = badgeList.props.children.filter(child => isPremiumBadge(child.props.text)).map(child => child.props.text);
            if (!premiumBadges.length) {
                if (!userSettings.premiumSince && !userSettings.boosterSince)
                    return;
                userSettings.premiumSince = null;
                userSettings.boosterSince = null;
                return this.saveUserSettings(userId, userSettings);
            }
            const changedProps = premiumBadges.filter(text => {
                const prop = text.includes("Subscriber since") ? "premiumSince" : "boosterSince";
                const [yearText, dateText, monthName] = text.replace(',', '').split(' ').reverse();
                const [year, day] = [yearText, dateText].map(text => parseInt(text));
                const month = (() => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    return months.indexOf(monthName);
                })();
                const date = new Date(year, month, day).toString();
                if (userSettings[prop] === date.toString())
                    return false;
                userSettings[prop] = date.toString();
                return true;
            }).length > 0;
            if (changedProps)
                this.saveUserSettings(userId, userSettings);
        }
        getUserSettings(userId) {
            return this.settings.get().users[userId];
        }
        saveUserSettings(userId, data) {
            const settings = this.settings.get();
            const { users } = settings;
            this.logger.log(`Saving user settings for ${userId}`, data);
            this.data.save("settings", { ...settings, users: { ...users, [userId]: data } });
        }
    };
});

module.exports = index;

    } catch (err) {
        if ('DanhoCustomBadges' === 'DanhoLibrary') console.error(err);
        
        if (window.BDD) console.error(err);
        else module.exports = class NoPlugin {
            //start() { BdApi.Alert("this.name could not be loaded!") }
            start() {
                window.BDD_PluginQueue ??= [];

                if (!this.isLib) {
                    if (window.BDD_PluginQueue.includes(this.name)) return console.log(`${this.name} is already in plugin queue`, err);
                    window.BDD_PluginQueue.push(this.name); 
                } else {
                    setTimeout(() => {
                        BdApi.Plugins.reload(this.name);

                        setTimeout(() => window.BDD?.PluginUtils.restartPlugins(), 500);
                    }, 1000);
                }
            }
            stop() {}

            name = 'DanhoCustomBadges';
            isLib = 'DanhoCustomBadges' === 'DanhoLibrary'
        }
    }

    return module.exports;
})();
/*@end @*/
