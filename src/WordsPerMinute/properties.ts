import { createProperty } from "@danho-lib/Utils";
import { WPMCountId } from './Selectors';
import { onSubmit } from "./events";
import { Highscores } from "./settings";

export const typingStartTime = createProperty<number>(undefined);
export const typingEndTime = createProperty<number>(undefined);
export const wpm = createProperty({
  defaultValue: 0,
  beforeSet: value => parseInt(value.toFixed(0)),
  afterSet: (value) => {
    const wpmCountElement = document.getElementById(WPMCountId);
    if (wpmCountElement) wpmCountElement.textContent = `${value} wpm`;
  }
});

let observer = new MutationObserver(() => {
  const placeholder = document.querySelector('[class*=textArea] > div > [class*=placeholder]');
  if (placeholder && didSubmit.get()) onSubmit(activelyTyping, wpm, Highscores);
});

export const activelyTyping = createProperty({
  defaultValue: false,
  afterSet: (value) => {
    if (value) observer.observe(document.body, { childList: true, subtree: true });
    else {
      observer.disconnect();
      resetProperties();
    }
  }
});
export const didSubmit = createProperty({
  defaultValue: false,
})

export function resetProperties() {
  typingStartTime.reset();
  typingEndTime.reset();
  didSubmit.reset();
  wpm.reset();
}