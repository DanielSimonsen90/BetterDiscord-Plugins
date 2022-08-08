import { ShakeableRef } from "@react/components/Discord/Shakeable";
import { User } from "@discord";
import BDFDB from '@BDFDB';

const { Libraries, Modules, Utils } = window.BDD;
const { BDFDB, ZLibrary } = Libraries;

const { React, CompiledReact } = Modules;
const { useState, createRef, useEffect } = React;
const { Button, TextInput, Shakeable } = CompiledReact.Components;

const { findUserByTag } = Utils;

type AddUserProps = {
    BDFDB: BDFDB,
    onSubmit(user: User): void
}
export default function AddUser({ BDFDB, onSubmit }: AddUserProps) {
    const [userString, setUserString] = useState("");
    const [errorLabel, setErrorLabel] = useState(undefined);
    const shakeable = createRef<ShakeableRef>();

    useEffect(() => {
        if (shakeable.current && errorLabel) shakeable.current.shake(300, 1);
    }, [errorLabel]);

    const onSend = async () => {
        const user = (
            /.+#[0-9]{4}/.test(userString) ? BDFDB.LibraryModules.UserStore.findByTag(userString.split("#").slice(0, -1).join("#"), userString.split("#").pop()) :
                /\d{18}/.test(userString) ? ZLibrary.DiscordModules.UserStore.getUser(userString) :
                    await findUserByTag(userString, BDFDB)
        );

        if (!user) return setErrorLabel("User not found");
        onSubmit(user);
    }

    return (
        <Shakeable ref={shakeable} className="add-user" {...{ "data-error": errorLabel }}>
            <TextInput placeholder="Username, tag or id" onKeyDown={e => (e.key === 'Enter' || e.key === 'NumpadEnter') && onSend()} onChange={v => {
                setUserString(v);
                if (errorLabel) setErrorLabel(undefined);
            }} value={userString} />
            <Button color={Button.Colors.BRAND_NEW} onClick={onSend}>Add user</Button>
        </Shakeable>
    )
}