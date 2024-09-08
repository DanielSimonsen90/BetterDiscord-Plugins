import { React } from "@dium/modules";

const { useState } = React;

type CollapsibleProps = {
  children: React.ReactNode;
  
  title?: string;
  defaultOpen?: boolean;
  className?: string;

  onToggle?: (isOpen: boolean) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export function Collapsible({ children, ...props }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

  const toggle = () => {
    setIsOpen(!isOpen);
    props.onToggle?.(!isOpen);
    if (isOpen) props.onClose?.();
    else props.onOpen?.();
  };

  return (
    <div className={`collapsible ${props.className ?? ''}`} data-open={isOpen}>
      <div className="collapsible__header" onClick={toggle}>
        <h3>{props.title}</h3>
        <span></span>
      </div>
      {isOpen && <div className="collapsible__content">{children}</div>}
    </div>
  );
}

export default Collapsible;