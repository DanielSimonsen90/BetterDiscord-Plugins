import CreateSettingsGroup from "../../_CreateSettingsGroup";
import AutoCancelFriendRequestSettings from "./AutoCancelFriendRequestSettings";

export default CreateSettingsGroup((React, props, Setting, { FormSection, FormDivider }) => {
  const AutoCancelFriendRequests = () => (
    <FormSection title="Auto Cancel Friend Requests">
      <Setting setting="autoCancelFriendRequests" {...props} />
      {props.settings.autoCancelFriendRequests ? <AutoCancelFriendRequestSettings {...props} /> : null}
    </FormSection>
  )

  const JoinVoiceWithCamera = () => (
    <FormSection title="Join Voice With Camera">
      <Setting setting="joinVoiceWithCamera" {...props} />
    </FormSection>
  )

  const ShowGuildMembersInHeader = () => (
    <FormSection title="Show Guild Members In Header">
      <Setting setting="showGuildMembersInHeader" {...props} />
    </FormSection>
  )

  const AllowForumSortByAuthor = () => (
    <FormSection title="Allow Forum Sort By Author">
      <Setting setting="allowForumSortByAuthor" {...props} />
    </FormSection>
  )

  return (<>
    <AutoCancelFriendRequests />
    <FormDivider />
    
    <JoinVoiceWithCamera />
    <FormDivider />
    
    <ShowGuildMembersInHeader />
    <FormDivider />
    
    <AllowForumSortByAuthor />

  </>);
});