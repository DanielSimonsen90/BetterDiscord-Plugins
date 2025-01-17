import CreateSettingsGroup from "../_CreateSettingsGroup";
import { rgbToHex, hexToRgb } from "@danho-lib/Utils/Colors";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const PrettyRoles = () => (
    <FormSection title="PrettyRoles Settings">
      <Setting setting="prettyRoles" {...props} />
      <Setting setting="defaultRoleColor" type="color" {...props}
        formatValue={rgbString => "#" + rgbToHex(rgbString.split(',').map(Number) as [number, number, number])}
        beforeChange={hex => hexToRgb(hex).join(',')}
      />
      <Setting setting="groupRoles" {...props} />
    </FormSection>
  );

  const BadgeModification = () => (
    <FormSection title="Badge Modification">
      <Setting setting="movePremiumBadge" {...props} />
    </FormSection>
  );

  const PronounsPageLinks = () => (
    <FormSection title="Pronouns Page Links">
      <Setting setting="pronounsPageLinks" {...props} />
    </FormSection>
  );

  const ExpandBioAgain = () => (
    <FormSection title="Expand Bio Again">
      <Setting setting="expandBioAgain" {...props} />
    </FormSection>
  );

  const NonObnoxiousProfileEffects = () => (
    <FormSection title="Non-Obnoxious Profile Effects">
      <Setting setting="nonObnoxiousProfileEffects" {...props} />
    </FormSection>
  );

  return (<>
    <BadgeModification />
    <FormDivider />

    <ExpandBioAgain />
    <FormDivider />
    
    <NonObnoxiousProfileEffects />
    <FormDivider />
    
    <PrettyRoles />
    <FormDivider />
    
    <PronounsPageLinks />
  </>);
});