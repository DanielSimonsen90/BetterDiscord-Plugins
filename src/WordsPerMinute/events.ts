import { debugLog } from '@danho-lib/dium/api/logger';

import { typingStartTime, typingEndTime, wpm, activelyTyping } from './properties';
import { calculateWPM, updateHighscores } from './methods';

export function onKeyDown(event: KeyboardEvent) {
  // Ignore non-character keys
  if (event.key.length !== 1) return;

  // Set activelyTyping to true
  activelyTyping.set(true);

  // Set typing start time if not set
  typingStartTime.nullableSet(Date.now());
}

export function onKeyUp(event: KeyboardEvent) {
  typingEndTime.set(Date.now());

  if (!(event.target instanceof HTMLElement)) return;

  const messageContent = event.target.textContent;

  // Calculate wpm and update the display
  calculateWPM(messageContent);

  // Log the event data
  debugLog(`[${new Date(typingStartTime.get()).toLocaleTimeString()} - ${new Date(typingEndTime.get()).toLocaleTimeString()}] ${wpm}: ${messageContent}`);

  // Reset wpm if message is empty and backspace is pressed
  if (event.key === 'Backspace' && !messageContent.trim()) {
    debugLog('Reset', event);
    typingStartTime.reset();
    wpm.reset();
  }
}

export function onSubmit() {
  // Reset the typing start time
  typingStartTime.reset();
  updateHighscores();
}