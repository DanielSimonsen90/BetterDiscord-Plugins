import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "../React";
import { classNames } from "@dium/modules";

type CollapsibleProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  titleOpen?: string;
  defaultOpen?: boolean;
  forceState?: boolean | undefined;
  className?: string;
  disabled?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export type CollapsibleRef = HTMLDivElement & {
  isOpen: boolean;
  isDisabled: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const Collapsible = forwardRef<CollapsibleRef, CollapsibleProps>(
  ({ children, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);
    const disabled = props.disabled ?? false;

    const toggle = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
      props.onToggle?.(!isOpen);
      if (isOpen) props.onClose?.();
      else props.onOpen?.();
    };

    useEffect(() => {
      if (props.forceState !== undefined) {
        setIsOpen(props.forceState);
        if (props.forceState) props.onOpen?.();
        else props.onClose?.();
      }
    }, [props.forceState]);

    useImperativeHandle(ref, () => ({
      ...internalRef.current,
      isOpen,
      isDisabled: disabled,
      toggle,
      open: () => {
        setIsOpen(true);
        props.onOpen?.();
      },
      close: () => {
        setIsOpen(false);
        props.onClose?.();
      },
    }));

    const Title = typeof props.title === "string" ? <h3>{props.title}</h3> : props.title;
    const TitleOpen = typeof props.titleOpen === "string" ? <h3>{props.titleOpen}</h3> : props.titleOpen;

    return (
      <div ref={internalRef}
        className={classNames("collapsible", props.className)}
        data-open={isOpen}
        data-disabled={disabled}
      >
        <div className="collapsible__header" onClick={toggle}>
          {isOpen ? TitleOpen ?? Title : Title}
          <span style={{ display: "flex" }}></span>
        </div>
        <div className={classNames("collapsible__content", isOpen ? "visible" : "hidden")}>
          {children}
        </div>
      </div>
    );
  }
);

export default Collapsible;