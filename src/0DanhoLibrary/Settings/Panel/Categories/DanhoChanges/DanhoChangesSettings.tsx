import CreateSettingsGroup from "../../_CreateSettingsGroup";
import BadgesSettings from "./BadgesSettings";
import LockSettings from "./LockSettings";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const Badges = () => (
    <FormSection title="Badges">
      <Setting setting="badges" {...props} />
      {props.settings.badges ? <BadgesSettings {...props} /> : null}
    </FormSection>
  );

  const LockChannels = () => (
    <FormSection title="Lock Channels">
      <Setting setting="lockChannels" {...props} />
      {props.settings.lockChannels ? <LockSettings {...props} /> : null}
    </FormSection>
  )

  const QuickAddMemberToDungeon = () => (
    <FormSection title="Add To Dungeon">
      <Setting setting="addToDungeon" {...props} />
    </FormSection>
  );

  const WakeUp = () => (
    <FormSection title="Wake Up">
      <Setting setting="wakeUp" {...props} />
    </FormSection>
  );

  return (<>
    <Badges />
    <FormDivider />
    
    <LockChannels />
    <FormDivider />
    
    <QuickAddMemberToDungeon />
    <FormDivider />
    
    <WakeUp />

  </>);
});