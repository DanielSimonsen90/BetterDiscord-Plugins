import { React, classNames, Flex } from "../modules";
import { Button, Margins, Form } from '../../../danho-discordium/components/Discord';
import { confirm } from "../utils";

export interface SettingsContainerProps {
    name: string;
    children?: React.ReactNode;
    onReset: () => void;
}

export const SettingsContainer = ({ name, children, onReset }: SettingsContainerProps): JSX.Element => (
    <Form.FormSection>
        {children}
        <Form.FormDivider className={classNames(Margins.marginTop20, Margins.marginBottom20)} />
        <Flex justify={Flex.Justify.END}>
            <Button
                size={Button.Sizes.SMALL}
                onClick={() => confirm(name, "Reset all settings?", {
                    onConfirm: () => onReset()
                })}
            >Reset</Button>
        </Flex>
    </Form.FormSection>
);
