import BDFDB from "@BDFDB";

const { Libraries, Modules } = window.BDD;
const { ZLibrary } = Libraries;
const { React, DanhoModules } = Modules;
const { classNames } = DanhoModules.CompiledReact;

type BadgeProps = {
    BDFDB: BDFDB,

    tooltipText: string,
    spacing?: number,

    classNameClickable?: string,
    href?: string,
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,

    classNameImg?: string,
    src: JSX.Element | string,
    id: string,
    size?: number,
}

export default function Badge(props: BadgeProps) {
    const { TooltipContainer, Clickable } = props.BDFDB.LibraryComponents;
    const { tooltip, clickable, img } = getProps(props);

    const onClickableClick = props.href ? () => window.open(props.href) :
        props.onClick ? props.onClick : undefined;

    const icon = (typeof img.src === 'string' ?
        <img alt=' ' aria-hidden={true} src={img.src} className={img.className} /> :
        img.src
    );

    return (
        <TooltipContainer {...tooltip}>
            <Clickable {...clickable} role="button" tabIndex={0} onClick={onClickableClick} {...{
                "data-href": props.href,
                "data-id": props.id
            }}>
                {icon}
            </Clickable>
        </TooltipContainer>
    )
}

function getProps({ size = 22, ...props }: BadgeProps) {
    const classes = {
        clickable: ZLibrary.DiscordClassModules.UserModal.clickable,
        img: ZLibrary.DiscordClassModules.UserModal[`profileBadge${size}`],
    }

    const tooltip = {
        text: props.tooltipText,
        spacing: props.spacing || 24,
        key: props.tooltipText
    }
    const clickable = {
        className: classNames(classes.clickable, "danho-badge", props.classNameClickable),
        "aria-label": props.tooltipText,
    }
    const img = {
        src: props.src,
        className: classNames(classes.img, props.classNameImg),
    }

    return { tooltip, clickable, img }
}