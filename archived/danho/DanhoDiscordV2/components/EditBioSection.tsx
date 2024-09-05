import EditBioButton from "./EditBioButton";
import UserBioEditor from "./UserBioEditor";

const { CompiledReact } = window.BDD.Modules;
const { React, useState, useMemo, useCallback, Components, Hooks } = CompiledReact;
const { GuildIdentyStore } = window.BDD.Stores;
const UserProfileSettings = window.BDD.Stores.BetterProfileSettings;
const { useGuildProfile } = Hooks;
const { TooltipContainer, SvgIcon } = Components.BDFDB;

type Props = {
    className: string;
    renderType: 'button' | 'pencil' | string;
}

export default function EditBioSection({ className, renderType }: Props) {
    const [editMode, setEditMode] = useState(false);
    const [guildProfileMode, setGuildProfileMode] = useState(window.BDD.Utils.currentGuild !== null);
    const data = useGuildProfile(window.BDD.Users.me.id, window.BDD.Guilds.current?.id);
    const bio = useMemo(() => (guildProfileMode ? data._guildMemberProfile?.bio : data._userProfile.bio) || data.bio, [guildProfileMode, data]);

    const onEditButtonClicked = useCallback((guildProfileMode: boolean, value: string) => {
        if (value !== bio) {
            if (guildProfileMode) GuildIdentyStore.saveGuildIdentityChanges(window.BDD.Utils.currentGuild.id, { bio: value });
            UserProfileSettings.saveProfileChanges({ bio: value }, guildProfileMode ? window.BDD.Utils.currentGuild.id : null);
        }

        setEditMode(false);
    }, [bio]);

    return (
        <div className={className} data-render-type={!editMode && renderType}>
            {editMode ?
                <UserBioEditor initialValue={bio} onButtonPressed={onEditButtonClicked}
                    guildProfileMode={guildProfileMode} onBioModeChange={setGuildProfileMode}
                /> :
                // <AboutMeSection onBioChange={setPendingBio} currentBio={bio} /> :
                renderType === 'button' ?
                    <EditBioButton onClick={() => setEditMode(true)} /> :
                    <TooltipContainer text="Edit bio">
                        <SvgIcon name={SvgIcon.Names.PENCIL} onClick={() => setEditMode(true)} />
                    </TooltipContainer>
            }
        </div>
    );
}