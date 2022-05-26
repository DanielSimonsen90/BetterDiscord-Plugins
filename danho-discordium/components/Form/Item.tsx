import { React, classNames } from "discordium";
import ZLibrary from "@ZLibrary";
import Discord from '../Discord';

const { Form: { FormItem } } = Discord;
const { PopoutRoles } = ZLibrary.DiscordClassModules;

type MyFormItemProps = {
    direction?: 'vertical' | 'horizontal',
    children: React.ReactNode,
    className?: string
}
export const Item = ({ direction, children, className, ...props }: MyFormItemProps) => (
    <FormItem className={classNames(PopoutRoles.flex, direction, 'center', className)} {...props}>
        {children}
    </FormItem>
)
export default Item;