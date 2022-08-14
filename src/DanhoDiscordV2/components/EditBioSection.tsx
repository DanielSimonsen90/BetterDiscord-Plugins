import EditBioButton from "./EditBioButton";
import UserBioEditor from "./UserBioEditor";

const { React, useState, useCallback, Components } = window.BDD.Modules.CompiledReact;
const UserProfileSettings = window.BDD.Stores.BetterProfileSettings;
const { TooltipContainer, SvgIcon } = Components.BDFDB;

type Props = {
    bio: string;
    className: string;
    renderType: 'button' | 'pencil' | string;
}

export default function EditBioSection({ bio, className, renderType }: Props) {
    const [editMode, setEditMode] = useState(false);
    const onEditButtonClicked = useCallback((value: string) => {
        if (value !== bio) {
            UserProfileSettings.saveProfileChanges({ bio: value });
        }

        setEditMode(false);
    }, [bio]);

    return (
        <div className={className} data-render-type={!editMode && renderType}>
            {editMode ?
                <UserBioEditor initialValue={bio} onButtonPressed={onEditButtonClicked} /> :
                renderType === 'button' ?
                    <EditBioButton onClick={() => setEditMode(true)} /> :
                    <TooltipContainer text="Edit bio">
                        <SvgIcon name={SvgIcon.Names.PENCIL} onClick={() => setEditMode(true)} />
                    </TooltipContainer>
            }
        </div>
    );
}