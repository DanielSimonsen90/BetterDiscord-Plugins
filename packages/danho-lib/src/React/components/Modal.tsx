import { Button, Text } from "@discord/components";
import { ClassNamesUtils } from "@utils/ClassNames";

import React, { ReactNode, useRef } from "../React";
import { classNames } from "../utils";
import { useClickOutside, useKeybind } from "../hooks";

type Props = {
  title: string;
  children: ReactNode

  open: boolean;
  onClose(): void;

  className?: string;
}

export function Modal({ children, open, onClose, title, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);
  useKeybind(['Escape'], onClose);

  return (
    <dialog open={open} className={classNames('danho-modal', props.className)}>
      <div className="danho-modal__backdrop">
        <div className="danho-modal__modal-inner" ref={ref}>
          <div className="danho-modal__header">
            <Text variant="heading-xl/bold" className="danho-modal__title">
              {title}
            </Text>
            <Button look={Button.Looks.BLANK} className={classNames(ClassNamesUtils.ColorClassNames.colorDefault, 'danho-modal__close')} onClick={onClose}>&times;</Button>
          </div>
          <div className="danho-modal__content">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
}