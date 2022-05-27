import { User } from '@discord';
import { React, SettingsProps, classNames } from 'discordium';
import { Discord, Form, Setting } from 'danho-discordium/components';

const { FormTitle } = Discord.Form;
const { Section, Item } = Form;
const { useState, useMemo } = React;

import { BadgeData, Settings, titles } from '../../Settings/types';
import { name, version } from '../../config.json';

import SettingsUser from './SettingsUser';
import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';
import AddUser from './AddUser';
import { createLogger, createPatcher } from '@discordium/api';

type SettingsPanelProps = SettingsProps<Settings> & {
    BDFDB: BDFDB,
};

const getNewBadge = (badges: Array<BadgeData>, userId: string): BadgeData => ({
    id: Date.now().toString(),
    index: 0,
    tooltip: `${ZLibrary.DiscordModules.UserStore.getUser(userId).tag}'s Badge`,
    src: "https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif",
})

export const SettingsPanel = ({ BDFDB, defaults, set, ...settings }: SettingsPanelProps) => {
    const [allowVerified, setAllowVerified] = useState(settings.allowVerified ?? defaults.allowVerified);
    const users = useMemo(() => settings.users || defaults.users, [settings, settings.users, defaults.users]);
    const userComponents = useMemo(() => Object.entries(users).map(([userId, data]) => (
        <SettingsUser {...{ userId, data, BDFDB }}
            onSave={badges => set({ users: { ...users, [userId]: { ...data, badges } } })}
            addBadge={() => set({ users: { ...users, [userId]: { ...data, badges: [...data.badges, getNewBadge(data.badges, userId)] } } })}
            deleteUser={() => {
                const newUsers = { ...users };
                delete newUsers[userId];
                set({ users: newUsers });
            }}
        />
    )), [settings, users, set]);

    return (
        <section id={`${name}-settings`} className="settings">
            <Section title="Allow Discord Community Programs" className={classNames('allow-discord-community-programs')}>
                <Item className={'vertical'}>
                    <Item className={'horizontal'}>
                        <FormTitle>{titles.allowVerified}</FormTitle>
                        <Setting key="allowVerified" value={settings.allowVerified} set={set} onChange={v => typeof v === 'boolean' && setAllowVerified(v)} titles={titles} />
                    </Item>
                    {allowVerified && (
                        <Item>
                            <FormTitle>{titles.allowVerifiedInvite}</FormTitle>
                            <Setting key="allowVerifiedInvite" value={settings.allowVerifiedInvite} set={set} titles={titles} />
                        </Item>
                    )}
                    <Item className={'horizontal'}>
                        <FormTitle>{titles.allowPartneredInvite}</FormTitle>
                        <Setting key="allowPartneredInvite" value={settings.allowPartneredInvite} set={set} titles={titles} />
                    </Item>
                </Item>
            </Section>
            <Section className={classNames('custom-badges')} title="Cusom Badges">
                {userComponents}
                <AddUser BDFDB={BDFDB} onSubmit={user => set({ users: { ...users, [user.id]: { badges: [getNewBadge(users[user.id]?.badges ?? [], user.id)] } } })} />
            </Section>
        </section>
    )
}