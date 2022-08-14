import { React, classNames } from '@discordium/modules';
import ZLibrary from "@ZLibrary";
import { Form } from '../Discord';

const { FormItem } = Form;
const { PopoutRoles, Margins } = ZLibrary.DiscordClassModules;

type MyFormItemProps = {
    direction?: 'vertical' | 'horizontal',
    children: React.ReactNode,
    className?: string
}
export const Item = ({ direction, children, className, ...props }: MyFormItemProps) => (
    <FormItem className={classNames(
        PopoutRoles.flex,
        Margins.marginBottom20,
        direction,
        'center',
        'settings-item',
        className
    )} {...props}>
        {children}
    </FormItem>
)
export default Item;