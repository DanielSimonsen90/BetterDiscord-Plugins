import React, { classNames } from "@react";
import ZLibrary from "@ZLibrary";
import { Form } from '../Discord';

const { FormItem } = Form;
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