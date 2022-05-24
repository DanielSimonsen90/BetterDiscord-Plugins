import { User } from '@discord';
import { React, Modules, SettingsProps, classNames } from 'discordium';

const { Flex, Button, Switch, SwitchItem, TextInput, margins } = Modules;
const { FormSection, FormTitle, FormItem } = Modules.Form;
const { useState, useMemo } = React;

import { BadgeData, Settings, titles } from '../../Settings/types';
import { name } from '../../config.json';

import SettingsUser from './SettingsUser';
import Setting from './Setting';
import ZLibrary from '@ZLibrary';
import BDFDB from '@BDFDB';
import AddUser from './AddUser';

type SettingsPanelProps = SettingsProps<Settings> & {
    BDFDB: BDFDB,
    BadgeList: React.FunctionComponent<{
        className: string,
        user: User,
        // premiumSince: Date,
        // shrinkAtCount: number,
        // shrinkToSize: number,
    }>
};

const getNewBadge = (badges: Array<BadgeData>, userId: string): BadgeData => ({
    index: badges.length,
    tooltip: `${ZLibrary.DiscordModules.UserStore.getUser(userId).tag}'s Badge`,
    src: "https://c.tenor.com/CHc0B6gKHqUAAAAi/deadserver.gif",
})

export const SettingsPanel = ({ BadgeList, BDFDB, defaults, set, ...settings }: SettingsPanelProps) => {
    const [allowVerified, setAllowVerified] = useState(settings.allowVerified || defaults.allowVerified);
    const users = useMemo(() => settings.users || defaults.users, [settings.users, defaults.users]);
    const userComponents = useMemo(() => Object.entries(users).map(([userId, badges]) => (
        <SettingsUser {...{ userId, badges, BDFDB }}
            onSave={badges => set({ users: { ...users, [userId]: badges } })}
            addBadge={() => set({ users: { ...users, [userId]: [...badges, getNewBadge(badges, userId)] } })}
            deleteUser={() => {
                const newUsers = { ...users };
                delete newUsers[userId];
                set({ users: newUsers });
            }}
        />
    )), [users, set]);


    return (
        <section id={`${name}-settings`} className="settings">
            <MyFormSection title="Allow Discord Community Programs" className={classNames('allow-discord-community-programs')}>
                <MyFormItem className={'vertical'}>
                    <MyFormItem className={'horizontal'}>
                        <FormTitle>{titles.allowVerified}</FormTitle>
                        <Setting key="allowVerified" value={settings.allowVerified} set={set} onChange={v => typeof v === 'boolean' && setAllowVerified(v)} />
                    </MyFormItem>
                    {allowVerified && (
                        <MyFormItem>
                            <FormTitle>{titles.allowVerifiedInvite}</FormTitle>
                            <Setting key="allowVerifiedInvite" value={settings.allowVerifiedInvite} set={set} />
                        </MyFormItem>
                    )}
                    <MyFormItem className={'horizontal'}>
                        <FormTitle>{titles.allowPartneredInvite}</FormTitle>
                        <Setting key="allowPartneredInvite" value={settings.allowPartneredInvite} set={set} />
                    </MyFormItem>
                </MyFormItem>
            </MyFormSection>
            <MyFormSection className={classNames('custom-badges')} title="Cusom Badges">
                {userComponents}
                <AddUser BDFDB={BDFDB} onSubmit={user => set({ users: { ...users, [user.id]: [getNewBadge(users[user.id] ?? [], user.id)] } })} />
            </MyFormSection>
        </section>
    )
}

type MyFormItemProps = {
    direction?: 'vertical' | 'horizontal',
    children: React.ReactNode,
    className?: string
}
function MyFormItem({ direction, children, className, ...props }: MyFormItemProps) {
    const { PopoutRoles } = ZLibrary.DiscordClassModules;
    return (
        <FormItem className={classNames(PopoutRoles.flex, direction, 'center', className)} {...props}>
            {children}
        </FormItem>
    )
}

type MyFormSectionProps = {
    className?: string,
    title: string,
    children: React.ReactNode
}
function MyFormSection({ className, title, children }: MyFormSectionProps) {
    return (
        <FormSection tag='h1' title={title} className={classNames(margins.marginBottom20, 'settings', className)}>
            {children}
        </FormSection>
    )
}