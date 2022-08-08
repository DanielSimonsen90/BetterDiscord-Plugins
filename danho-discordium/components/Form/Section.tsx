import React, { classNames } from '@react';
import { Form, Margins } from '../Discord';
const { FormSection } = Form;

type SectionProps = {
    className?: string,
    title: string,
    children: React.ReactNode
}
export const Section = ({ title, children, className }: SectionProps) => (
    <FormSection tag='h1' title={title} className={classNames(Margins.marginBottom20, 'settings', className)}>
        {children}
    </FormSection>
);
export default Section;