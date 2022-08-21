import SettingsProps from "danho-discordium/SettingsProps";
import { TransformType } from "danholibraryjs";
import { name } from '../../config.json';

const { React, Components } = window.BDD.Modules.CompiledReact;
const {
    MyForm: { Section, Item },
    Form: { FormTitle },
    Setting
} = Components

export const settings = {
    BetterRoleColors: {
        enabled: true,
    },
    EditBioElsewhere: {
        enabled: true,
        preference: "pencil"
    }
}
export type Settings = typeof settings;

const titles: Record<keyof Settings, TransformType<Settings[keyof Settings], boolean, string>> = {
    EditBioElsewhere: {
        enabled: "Enable Edit Bio Elsewhere",
        preference: "Preference on how to toggle the editor"
    },
    BetterRoleColors: {
        enabled: "Give roles a background color",
    },
}

export const SettingsPanel = ({ defaults, set, ...settings }: SettingsProps<Settings>) => (
    <section id={`${name}-settings`} className="settings">
        {Object.keys(settings).map(section => (
            <Section key={section} title={section}>
                {Object.keys(settings[section]).map(setting => (
                    <Item direction="horizontal" key={setting}>
                        <FormTitle tag="h3">{titles[section][setting]}</FormTitle>
                        <Setting settings={settings[section]} set={set} setting={setting} titles={titles[section]} />
                    </Item>
                ))}
            </Section>
        ))}
    </section>
)