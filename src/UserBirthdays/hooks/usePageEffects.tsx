import React, { useEffect, useState } from "@react";
import { Logger } from "@dium";
import { $ } from "@danho-lib/DOM";

import CalendarPage from "../components/CalendarPage";

export default function usePageEffects<TInitialStyle extends object>(
  selected: boolean,
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

  useEffect(() => {
    const sidebar = $(s => s.className('base').className('content').className('sidebar'));
    const content = sidebar.parent;
    const children = content.children();

    try {
      if (selected) {
        children[1].style = {
          ...(sidebar.style ?? {}),
          display: 'none',
          position: 'absolute',
        };
        children[2] ? children[2].show() : content.appendComponent(<CalendarPage />, {
          className: children[1].classes
        });
      } else {
        children[1].style = initialStyle;
        children[2]?.hide();
      }
    } catch (error) {
      Logger.error(error);
    }
  }, [selected]);
}