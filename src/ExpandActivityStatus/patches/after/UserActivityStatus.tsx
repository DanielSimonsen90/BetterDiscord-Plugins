import { ActivityIndexes } from "@discord/types";
import { Logger, Patcher, React } from "@dium";
import UserActivityStatus from "@injections/patched/UserActivityStatus";
import { StringUtils } from "@utils";

export default function afterUserActivityStatus() {
  Patcher.after(UserActivityStatus, 'Z', ({ result, args: [props] }) => {
    if (props.activity.type !== ActivityIndexes.LISTENING) return;

    const {
      details: title,
      state: artistsString,
    } = props.activity;

    if (!title || !artistsString) return; // Bots can use "listening" too, but they don't have a title or artists.
    const artists = StringUtils.join(artistsString.split(";"));

    try {
      const children = result.props.children[1]
        ? result.props.children[1].props.children
        : result.props.children;
      children[1] = typeof children[1] !== 'object' ? children[1] : (
        <span>
          <strong>{title}</strong> by <strong>{artists}</strong>
        </span>
      ) as any;
    } catch (err) {
      Logger.error(err, { result, props, title, artists });
    }
  }, { name: 'UserAtivityStatus' })
}