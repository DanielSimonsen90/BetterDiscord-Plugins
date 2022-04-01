type AccountDetails = 
    'avatar' | 'avatarWrapper' | 'buildOverrideButton' | 'canCopy' | 'container' | 'copySuccess' | 'customStatus' | 'emoji' | 'godlike' | 'hasBuildOverride' |
    'nameTag' | 'redIcon' | 'statusTooltip' | 'strikethrough' | 'usernameContainer';

type App = 'app' | 'mobileApp';

type Auditlog = 'desaturate' | 'auditLog' | 'divider' | 'header' | 'headerDefault' | 'headerClickable' | 'headerExpanded' | 'timeWrap' | 'title' | 'avatar' | 
    'expand' | 'expandForeground' | 'colorHook' | 'userHook' | 'changeDetails' | 'detail' | 'prefix' | 'typeCreate' | 'typeDelete' | 'typeUpdate' | 'dash' | 
    'change' | 'changeStr' | 'overflowEllipsis' | 'subListItem' | 'icon' | 'discrim' | 'timestamp' | 'themeOverrideLight' | 'targetAll' | 'targetBan' | 'targetChannel' | 
    'targetGuild' | 'targetEmoji' | 'targetSticker' | 'targetIntegration' | 'targetInvite' | 'targetMemberRole' | 'targetMember' | 'targetPermission' | 'targetRole' | 
    'targetVanityUrl' | 'targetWebhook' | 'targetWidget' | 'targetMessage' | 'targetStageInstance' | 'targetGuildScheduledEvent' | 'thread' | 'applicationCommand' | 
    'themeOverrideDark';

type Backdrop = 'backdrop' | 'withLayer';

type BasicInputs = 'copyInput' | 'copyInputDefault' | 'copyInputError' | 'copyInputSuccess' | 'layout' | 'inputWrapper' | 'button' | 'hiddenMessage' | 'input' | 
    'inputDefault' | 'inputError' | 'inputSuccess' | 'inputHidden';

type Changelog = 'video' | 'container' | 'image' | 'title' | 'lead' | 'added' | 'fixed' | 'improved' | 'progress' | 'marginTop' | 'footer' | 'socialLink' | 
    'premiumBanner' | 'premiumIcon' | 'date';

type ChannelList = 'containerDefault' | 'containerDragAfter' | 'containerDragBefore' | 'containerUserOver' | 'iconBase' | 'iconItem' | 'openChatIconItem' | 'selected' | 
    'iconVisibility' | 'disableClick' | 'disabled' | 'actionIcon' | 'channelInfo' | 'iconLive' | 'wrapper' | 'typeThread' | 'content' | 'modeSelected' | 'modeLocked' | 
    'icon' | 'iconContainer' | 'mainContent' | 'name' | 'channelName' | 'subtitle' | 'unread' | 'children' | 'modeMuted' | 'modeUnread' | 'modeConnected' | 'notInteractive' | 
    'unreadRelevant' | 'numberBadge' | 'container' | 'downloadProgressCircle' | 'guilds' | 'base' | 'sidebar' | 'hidden' | 'hasNotice' | 'panels' | 'activityPanel' | 
    'hiddenOnMobileStore';

type ContextMenu = 'menu' | 'scroller' | 'styleFixed' | 'styleFlexible' | 'item' | 'hideInteraction' | 'customItem' | 'labelContainer' | 'label' | 'subtext' | 'iconContainer' | 
    'iconContainerLeft' | 'icon' | 'hintContainer' | 'imageContainer' | 'caret' | 'image' | 'disabled' | 'separator' | 'submenuContainer' | 'submenuPaddingContainer' | 
    'submenu' | 'colorDefault' | 'checkbox' | 'radioSelection' | 'check' | 'focused' | 'colorBrand' | 'colorDanger' | 'colorPremium' | 'colorGreen' | 'groupLabel' | 'loader';

type Dividers = 'container' | 'labelRow' | 'control' | 'disabled' | 'titleDefault' | 'titleMini' | 'title' | 'note' | 'dividerDefault' | 'divider';

type Embeds = 'spoilerBlurRadius' | 'embed' | 'embedFull' | 'embedAuthorName' | 'embedAuthorNameLink' | 'embedDescription' | 'embedFieldName' | 'embedFieldValue' | 
    'embedFooterText' | 'embedLink' | 'embedProvider' | 'embedTitle' | 'embedTitleLink' | 'grid' | 'hasThumbnail' | 'embedMargin' | 'embedSuppressButton' | 'embedAuthor' | 
    'embedAuthorIcon' | 'embedImage' | 'embedThumbnail' | 'embedVideo' | 'embedGalleryImagesWrapper' | 'embedGallerySide' | 'galleryImage' | 'embedGalleryImageElement' | 
    'centerContent' | 'embedVideoActions' | 'embedVideoImageComponent' | 'embedVideoImageComponentInner' | 'embedVideoAction' | 'embedIframe' | 'embedGIFTag' | 'embedFooter' | 
    'embedFooterSeparator' | 'embedFooterIcon' | 'embedFields' | 'embedField' | 'embedMedia' | 'embedSpotify' | 'spoilerEmbed' | 'hiddenSpoiler' | 'spoilerAttachment';

type Layers = 'layers' | 'layer' | 'animating' | 'bg' | 'baseLayer';

type Margins = `margin${
    `${'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge'}` | 
    'Reset' | 
    `${'Top' | 'Bottom'}${4 | 8 | 20 | 40 | 60}` |
    'CenterHorz' | 'Left8'
}`;

type MemberList = 'container' | 'membersWrap' | 'members' | 'membersGroup' | 'hiddenMembers' | 'hiddenText' | 'memberGroupsPlaceholder' | 'placeholderPulse' | 
    'addMembersButton' | 'addMembersIcon' | 'roleIcon';

type Notices = 'notice' | 'colorDefault' | 'button' | 'colorNeutral' | 'colorGreen' | 'colorNotification' | 'colorDark' | 'colorPremium' | 'colorPremiumTier1' | 
    'colorPremiumTier2' | 'colorInfo' | 'colorSuccess' | 'colorWarning' | 'colorDanger' | 'colorStreamerMode' | 'colorSpotify' | 'platformIcon' | 'colorPlayStation' | 
    'colorBrand' | 'colorCustom' | 'closeButton' | 'buttonMinor';

type PopoutRoles = 'flex' | 'alignCenter' | 'justifyCenter' | 'wrap' | 'desaturateUserColors' | 'root' | 'role' | 'roleCircle' | 'roleRemoveIcon' | 'roleRemoveIconFocused' | 
    'roleName' | 'actionButton' | 'overflowButton' | 'addButton' | 'addButtonIcon' | 'overflowRolesPopout' | 'overflowRolesPopoutArrowWrapper' | 'overflowRolesPopoutArrow' | 
    'popoutBottom' | 'popoutTop' | 'overflowRolesPopoutHeader' | 'popoutRoleDot' | 'overflowRolesPopoutHeaderIcon' | 'overflowRolesPopoutHeaderText' | 'roleIcon';

type Reactions = 'reactions' | 'icon' | 'reactionBtn' | 'active' | 'reaction' | 'reactionReadOnly' | 'reactionCount' | 'reactionMe' | 'reactionInner' | 'reactionTooltip' | 
    'reactionTooltipContent' | 'reactionTooltipEmoji' | 'reactionTooltipText' | 'reactionTooltipInner';

type Textarea = 'textAreaHeight' | 'channelTextArea' | 'highlighted' | 'focusRing' | 'scrollableContainer' | 'sticker' | 'textArea' | 'webkit' | 'channelTextAreaDisabled' | 
    'hasConnectedBar' | 'inner' | 'innerDisabled' | 'sansAttachButton' | 'sansAttachButtonCreateThread' | 'sansAttachButtonCreatePost' | 'attachButton' | 'textAreaSlate' | 
    'textAreaThreadCreation' | 'profileBioInput' | 'textAreaWithoutAttachmentButton' | 'textAreaForPostCreation' | 'textAreaDisabled' | 'buttons' | 'buttonContainer' | 
    'button' | 'emojiButton' | 'stickerIcon' | 'stickerButton' | 'stickerButtonWithNotification' | 'stickerButtonTilted' | 'fontSize12Padding' | 'fontSize14Padding' | 
    'fontSize15Padding' | 'fontSize16Padding' | 'fontSize18Padding' | 'fontSize20Padding' | 'fontSize24Padding' | 'stackedAttachedBar' | 'attachedBars';

type TitleWrap = 'chat' | 'uploadArea' | 'threadSidebarOpen' | 'threadSidebarFloating' | 'form' | 'chatContent' | 'cursorPointer' | 'content' | 'noChat' | 'channelTextArea' | 
    'titleWrapper' | 'editPartyIcon' | 'channelName' | 'parentChannelName' | 'title' | 'followButton' | 'status' | 'guildBreadcrumbContainer' | 'guildBreadcrumbIcon' | 'loader';

type Titlebar = 'titleBar' | 'withFrame' | 'typeMacOS' | 'typeMacOSWithFrame' | 'macButtons' | 'typeWindows' | 'wordmark' | 'wordmarkWindows' | 'wordmarkMacOS' | 'winButton' | 
    'winButtonMinMax' | 'winButtonClose' | 'focused' | 'macButton' | 'macButtonClose' | 'macButtonMaximize' | 'macButtonMinimize' | 'unfocused';

type Titles = 'title' | `h${1 | 2 | 3 | 4 | 5}` | 'defaultMarginh4' | 'defaultMarginh1' | 'defaultMarginh2' | 'defaultMarginh3' | 'defaultMarginh5' | 'disabled' | 
    'required' | 'errorMessage' | 'errorSeparator' | 'defaultColor' | 'faded' | 'error';

type TooltipLayers = 'layerContainer' | 'layer' | 'emptyError' | 'layerHidden' | 'disabledPointerEvents';

type Tooltips = `tooltip${
    'DisablePointerEvents' | 'Pointer' | `Content${'' | 'AllowOverflow'}` | 
    'Top' | 'Bottom' | 'Center' | 'Left' |'Right' | 
    'Primary' | 'Black' | 'Grey' | 'Brand' | 'Red' | 'Green' | 'Yellow'
}`;

type Typing = 'base' | 'text' | 'ellipsis' | 'cooldownWrapper' | 'slowModeIcon' | 'typing' | 'activityInviteEducation' | 'activityInviteEducationFadeIn' | 
    'activityInviteEducationArrow';

type UserModal = 'clickable' | 'container' | 'desaturate' | 'gridGap' | `${`profileBadge${'' | '18' | '22' | '24'}`}`;

type UserPopout = 'userPopout' | 'headerNormal' | 'body' | 'divider' | 'setIdentityLink' | 'scrollerSeparator' | 'editProfileCTA' | 'setIdentityOption';

type Entry<T extends string> = Record<T, string>;

export type DiscordClassModules = {
    AccountDetails: Entry<AccountDetails>,
    App: Entry<App>,
    Auditlog: Entry<Auditlog>,
    Backdrop: Entry<Backdrop>,
    BasicInputs: Entry<BasicInputs>,
    Changelog: Entry<Changelog>,
    ChannelList: Entry<ChannelList>,
    ContextMenu: Entry<ContextMenu>,
    Dividers: Entry<Dividers>,
    Embeds: Entry<Embeds>,
    Layers: Entry<Layers>,
    Margins: Entry<Margins>,
    MemberList: Entry<MemberList>,
    Notices: Entry<Notices>,
    PopoutRoles: Entry<PopoutRoles>,
    Reactions: Entry<Reactions>,
    Textarea: Entry<Textarea>,
    TitleWrap: Entry<TitleWrap>,
    Titlebar: Entry<Titlebar>,
    Titles: Entry<Titles>,
    TooltipLayers: Entry<TooltipLayers>,
    Tooltips: Entry<Tooltips>,
    Typing: Entry<Typing>,
    UserModal: Entry<UserModal>,
    UserPopout: Entry<UserPopout>
}
export default DiscordClassModules;