import { renderChildren, React, useReducer } from "@react";
import { Finder } from "@injections";

const { focused } = Finder.byKeys<Record<string, string>>(['focused', 'item', 'labelContainer']);

type Props = {
  sortOptionClone: HTMLElement;
  orderPostsByAuthor: () => void;
}

export const SortByAuthorOption = ({ sortOptionClone, orderPostsByAuthor }: Props) => {
  const [className, dispatch] = useReducer((state: string, action: 'hover' | 'default') => {
    switch (action) {
      case 'hover': return `${state} ${focused}`;
      case 'default': return state.replace(focused, '').trim();
      default: return state;
    }
  }, sortOptionClone.className);

  return (
    <div data-custom-option className={className}
      onMouseOver={() => dispatch('hover')} onMouseOut={() => dispatch('default')}
      style={{ maxHeight: '1rem', }}
      onClick={orderPostsByAuthor}
    >
      {Array.from(sortOptionClone.children).map(child => {
        if (child.className.includes('label')) child.textContent = 'Author';
        return renderChildren([child], { style: { maxHeight: '1rem', } });
      })}
    </div>
  );
}