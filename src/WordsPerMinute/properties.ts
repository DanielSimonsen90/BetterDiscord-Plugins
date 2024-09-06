import { createProperty } from "@danho-lib/Utils";
import { WPMCountId } from './Selectors';

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

export function resetProperties() {
  typingStartTime.reset();
  typingEndTime.reset();
  wpm.reset();
}