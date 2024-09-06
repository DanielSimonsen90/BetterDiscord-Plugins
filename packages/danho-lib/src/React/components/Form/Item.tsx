import { React, classNames } from '@dium/modules';
import { Form } from '../Discord';

const { FormItem } = Form;

type MyFormItemProps = {
    direction?: 'vertical' | 'horizontal',
    children: React.ReactNode,
    className?: string
}
export const Item = ({ direction, children, className, ...props }: MyFormItemProps) => (
    <FormItem className={classNames(
        direction,
        'center',
        'settings-item',
        className
    )} {...props}>
        {children}
    </FormItem>
)
export default Item;