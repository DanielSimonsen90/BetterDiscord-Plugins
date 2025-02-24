import { useEffect } from '@react';
import { $ } from "@danho-lib/DOM";
import * as ObjectUtils from '@danho-lib/Utils/Object';
import { Logger } from '@dium';

type Props = {
  onClick: (e: React.MouseEvent) => void;
  onSiblingClick: (e: MouseEvent) => void;
}

let selectedClassName: string = null;
export default function useBirthdayNavProps(props: Props) {
  const globalNav = $(s => s.ariaLabel('Direct Messages', 'ul'));

  useEffect(() => {
    globalNav.children().forEach(child => {
      child.on('click', props.onSiblingClick);
    });
  }, []);
  
  const firstNavItem = globalNav.children('li', true);
  if (!firstNavItem.element) return null;

  const clickableProps = firstNavItem.children(undefined, true).props as { className: string; };

  const result = {
    listItemProps: ObjectUtils.exclude(
      firstNavItem.props,
      'children', 'onBlur', 'onClick', 'onFocus'
    ),

    selectedClassName: getSelectedClassName(),

    clickableProps: Object.assign({}, clickableProps, {
      className: clickableProps.className
        .split(' ')
        .filter(className => !className.includes('selected'))
        .join(' '),

      onClick: (e: React.MouseEvent) => {
        globalNav.children('li').forEach(listItem => {
          listItem.children(`.${getSelectedClassName()}`)
            .forEach(child => child.removeClass(getSelectedClassName()))
        });
        
        props.onClick(e);
      }
    })
  }

  return result;
}

function getSelectedClassName(): string {
  Logger.log('SelectedClassName requested: ', selectedClassName)
  return selectedClassName ||= $(s => s.ariaLabel('Direct Messages', 'ul'))
    .children(s => s.className('selected'), true)
    .props?.className
    .split(' ')
    .filter((className: string) => className.includes('selected'))
    .join(' ');
}