import { TextModule } from '@danho-lib/Patcher/Text';
import { Patcher } from '@dium/api';
import { React } from '@dium/modules';

export default function afterTextModule() {
  Patcher.after(TextModule, 'render', ({ args: [props], result }) => {
    const { className, children: text } = props as { className: string, children: string; };
    if (!className || !className.includes('pronounsText')) return; // Rendered text is not pronouns text

    // Match "pronouns.page/@<username>"
    const regex = text.match(/pronouns\.page\/@(\w+)/);
    if (!regex) return; // Pronouns text is not pronouns.page profile

    const [matched, username] = regex;

    result.props.children = (
      <a href={`https://pronouns.page/@${username}`} target="_blank" rel="noreferrer noopener">
        {matched}
      </a>
    ) as any;
  }, { name: 'TextModule--Pronouns' });
}