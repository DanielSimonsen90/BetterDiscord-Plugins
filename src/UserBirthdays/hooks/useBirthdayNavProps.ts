import { useEffect, useState } from '@react';

import { AppActions } from '@actions';
import { $ } from "@dom";
import { ClassNamesUtils, ObjectUtils, TimeUtils } from '@utils';

type Props = {
  onClick: (e: React.MouseEvent) => void;
  onSiblingClick: (e: MouseEvent) => void;
}

export const ClassNameModule = ClassNamesUtils.combineModuleByKeys<(
  | 'interactive' 
  | 'selected'
) | (
  | 'interactiveSelected'
)>(
  ['interactive', 'selected'],
  ['platedWrapper', 'interactiveSelected']
)

type BirthdayNavProps = null | {
  listItemProps: Record<string, any>;
  clickableProps: ({
    className: string;
    onClick: (e: React.MouseEvent) => void;
  } & {
    [key: string]: any
  });
  selectedClassName: string;
}

const SelectedClassNames = [
  ClassNameModule.interactiveSelected,
  ClassNameModule.selected,
]

export default function useBirthdayNavProps(props: Props): BirthdayNavProps {
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const globalNav = $(s => s.ariaLabel('Direct Messages', 'ul'));
    globalNav.children().forEach(child => {
      child.on('click', props.onSiblingClick);
    });
    const cleanup = () => {
      globalNav.children().forEach(child => {
        child.off('click', props.onSiblingClick);
      });
    }
    
    const firstNavItem = globalNav.children('li', true);
    if (!firstNavItem.element) return cleanup;
  
    const clickableProps = firstNavItem.children(undefined, true).props as { className: string; };
  
    const result = {
      listItemProps: ObjectUtils.exclude(
        firstNavItem.props,
        'children', 'onBlur', 'onClick', 'onFocus'
      ),
  
      clickableProps: Object.assign({}, clickableProps, {
        className: clickableProps.className
          .split(' ')
          .filter(className => !SelectedClassNames.includes(className))
          .join(' '),
  
        onClick: async (e: React.MouseEvent) => {
          AppActions.navigate('/channels/@me');
          await TimeUtils.wait(100);
          globalNav.children('li').forEach(listItem => {
            SelectedClassNames.forEach(className => (
              listItem.children(`.${className}`).forEach(child => child.removeClass(className))
            ));
          });
          
          props.onClick(e);
        }
      }),

      selectedClassName: ClassNameModule.selected,
    }

    setResult(result);
    return cleanup;
  }, []);

  return result;
}