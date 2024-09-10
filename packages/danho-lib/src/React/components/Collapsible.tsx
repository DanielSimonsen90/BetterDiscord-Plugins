import { React, classNames } from "@dium/modules";

const { useState } = React;

type CollapsibleProps = {
  children: React.ReactNode;
  
  title?: React.ReactNode;
  titleOpen?: string;
  defaultOpen?: boolean;
  className?: string;
  disabled?: boolean;

  onToggle?: (isOpen: boolean) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export function Collapsible({ children, ...props }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);
  const disabled = props.disabled ?? false;

  const toggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    props.onToggle?.(!isOpen);
    if (isOpen) props.onClose?.();
    else props.onOpen?.();
  };

  const Title = typeof props.title === 'string' ? <h3>{props.title}</h3> : props.title;
  const TitleOpen = typeof props.titleOpen === 'string' ? <h3>{props.titleOpen}</h3> : props.titleOpen;

  return (
    <div className={`collapsible ${props.className ?? ''}`} data-open={isOpen} data-disabled={disabled}>
      <div className="collapsible__header" onClick={toggle}>
        {isOpen ? TitleOpen ?? Title : Title}
        <span style={{ display: 'flex' }}></span>
      </div>
      <div className={classNames('collapsible__content', isOpen ? 'visible' : 'hidden')}>{children}</div>
    </div>
  );
}

export default Collapsible;