import React, { Dispatch, SetStateAction, useEffect, useState } from "@react";
import { Logger } from "@dium";
import { $ } from "@dom";

import CalendarPage from "../components/CalendarPage";
import { useTimedCheck } from "@hooks/useTimedCheck";
import BirthdayStore from "../stores/BirthdayStore";
import { CALENDAR_PAGE_CLASSNAME } from "../utils/constants";

export default function usePageEffects<TInitialStyle extends object>(
  selected: boolean,
  setSelected: Dispatch<SetStateAction<boolean>>,
) {
  const [initialStyle, setInitialStyle] = useState({});

  useEffect(() => {
    const children = $(s =>
      s.className('base')
        .className('content').and.has(s => s.className('sidebar'))
    ).children();

    setInitialStyle(() => {
      const style = children[1].style ?? {};
      const { display, position } = style;
      return { display, position } as TInitialStyle;
    });
  }, []);

  useTimedCheck(() => {
    const sidebar = $(s => s.className('base').className('content').className('sidebar'));
    const content = sidebar.parent;
    const children = content.children();

    try {
      if (selected || BirthdayStore.current.page.show) {
        children[1].style = {
          display: 'none',
          position: 'absolute',
        };
        if (children[2] && !children[2].children(`.${CALENDAR_PAGE_CLASSNAME}`)) {
          children[2].unmount();
          delete children[2];
        }
        if (!children[2]) content.appendComponent(<CalendarPage onClose={() => setSelected(false)} />, {
          className: children[1].classes
        });
      } else {
        children[1].style = initialStyle;
        children[2]?.unmount();
        delete children[2];
      }
    } catch (error) {
      Logger.error(error);
    }
  }, 500, [selected, initialStyle]);
}