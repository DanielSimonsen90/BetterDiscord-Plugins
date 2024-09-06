import { React, classNames } from '@dium/modules';
import { Form } from '../Discord';
const { FormSection } = Form;

type SectionProps = {
    className?: string,
    title: string,
    children: React.ReactNode
}
export const Section = ({ title, children, className }: SectionProps) => (
    <FormSection tag='h1' title={title} className={classNames('settings', className)}>
        {children}
    </FormSection>
);
export default Section;