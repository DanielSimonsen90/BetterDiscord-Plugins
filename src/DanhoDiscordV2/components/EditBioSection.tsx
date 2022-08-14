import EditBioButton from "./EditBioButton";
import UserBioEditor from "./UserBioEditor";

const { React, useState, useCallback } = window.BDD.Modules.CompiledReact;
const UserProfileSettings = window.BDD.Stores.BetterProfileSettings;

type Props = {
    bio: string;
    className: string
}

export default function EditBioSection({ bio, className }: Props) {
    const [editMode, setEditMode] = useState(false);
    const onEditButtonClicked = useCallback((value: string) => {
        if (value !== bio) {
            UserProfileSettings.saveProfileChanges({ bio: value });
        }

        setEditMode(false);
    }, [bio]);

    return (
        <div className={className}>
            {editMode ?
                <UserBioEditor initialValue={bio} onButtonPressed={onEditButtonClicked} /> :
                <EditBioButton onClick={() => setEditMode(true)} />
            }
        </div>
    );
}