import BDFDB from "@BDFDB";
import { User } from "@discord";
import ZLibrary from "@ZLibrary";
import { Finder, Modules, React } from "discordium";
import { createBDD } from "danho-discordium/Utils";
const BDD = createBDD();

const { Flex, Button, Switch, SwitchItem, TextInput } = Modules;
const { useState, createRef, useEffect } = React;

type AddUserProps = {
    BDFDB: BDFDB,
    onSubmit(user: User): void
}
export default function AddUser({ BDFDB, onSubmit }: AddUserProps) {
    const [userString, setUserString] = useState("");
    const [errorLabel, setErrorLabel] = useState(undefined);

    const Shakeable = Finder.query({ name: "Shakeable" }).default;
    const shakeable = createRef<{
        shake(time: 300 | number, intensity: 5 | number): void,
        stop(): void
    }>();

    useEffect(() => {
        if (shakeable.current && errorLabel) shakeable.current.shake(300, 1);
    }, [errorLabel]);

    const onSend = async () => {
        const user = (
            /.+#[0-9]{4}/.test(userString) ? BDFDB.LibraryModules.UserStore.findByTag(userString.split("#").slice(0, -1).join("#"), userString.split("#").pop()) :
                /\d{18}/.test(userString) ? ZLibrary.DiscordModules.UserStore.getUser(userString) :
                    await BDD.findUserByTag(userString, BDFDB)
        );

        if (!user) return setErrorLabel("User not found");
        onSubmit(user);
    }

    return (
        <div>
            <Shakeable ref={shakeable} className="add-user" {...{ "data-error": errorLabel }}>
                <TextInput placeholder="Username, tag or id" onKeyDown={e => (e.key === 'Enter' || e.key === 'NumpadEnter') && onSend()} onChange={v => {
                    setUserString(v);
                    if (errorLabel) setErrorLabel(undefined);
                }} value={userString} />
                <Button color={Button.Colors.BRAND_NEW} onClick={onSend}>Add user</Button>
            </Shakeable>
        </div>
    )
}