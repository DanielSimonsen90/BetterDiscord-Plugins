import { Patcher, React } from "@dium";
import { Tooltip } from "@discord/components";
import MemberListItem from "@danho-lib/Patcher/MemberListItem";
import BirthdayStore from "../../stores/BirthdayStore";

export default function afterMemberListItem() {
  Patcher.after(MemberListItem, 'Z', ({ result: _result, args: [props] }) => {
    const result = _result as any as ReturnType<typeof _result>;

    const isBirthdayChild = BirthdayStore.isBirthdayChild(props.user);
    if (!isBirthdayChild) return result;

    Patcher.after(result.props, 'children', ({ result }) => {
      const avatar = (result.props as any).avatar;
      if (!avatar) return;

      avatar.props.children = [
        avatar.props.children,
        <Tooltip text={`It's ${props.user.globalName ?? props.user.username}'s birthday!`}>
          {props => <span {...props} className="birthday-child-icon">🎂</span>}
        </Tooltip>
      ] as any;
    }, { name: 'MemberListItem Avatar children', once: true });
  }, { name: 'MemberListItem' });
}