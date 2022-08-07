import { classNames, React } from '@discordium/modules';
import Discord from '../Discord';
const { Form: { FormSection }, Margins } = Discord;

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