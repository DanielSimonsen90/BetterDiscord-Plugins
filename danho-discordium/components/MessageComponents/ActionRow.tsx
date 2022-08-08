import { ComponentTypes, Components } from "@discord";
import { Button, TextInput } from '../Discord';
import React from '@react';

type ActionRowProps = Omit<ComponentTypes[Components.ActionRow], 'type'>

export function ActionRow({ components, ...props }: ActionRowProps) {
    return (
        <div className="container-3Sqbyb">
            <div className="children-2XdE_I">
                {components.map(({ type, ...component }) => {
                    switch (type) {
                        case Components.Button: return <Button {...component} />;
                        // case Components.SelectMenu: return <SelectMenu {...component as ComponentTypes[Components.SelectMenu]} />;
                        // @ts-ignore
                        case Components.TextInput: return <TextInput {...component as ComponentTypes[Components.TextInput]} />;
                        default: return <ActionRow {...component as ComponentTypes[Components.ActionRow]} />
                    }
                })}
            </div>
        </div>
    )
}
export default ActionRow;