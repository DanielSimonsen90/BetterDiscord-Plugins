import { Logger } from '@injections';
import type { DiumStore } from '@stores';
import { DanhoProperty } from '@utils';

import type { Highscores } from '../settings/settings';
import { calculateWPM, updateHighscores } from './methods';

export function getOnKeyDown(
  activelyTyping: DanhoProperty<boolean>, 
  typingStartTime: DanhoProperty<number>,
) {
  return function onKeyDown(event: KeyboardEvent) {
    // Ignore non-character keys
    if (event.key.length !== 1) return;
  
    // Set activelyTyping to true
    activelyTyping.set(true);
  
    // Set typing start time if not set
    typingStartTime.nullableSet(Date.now());
  }
}

export function getOnKeyUp(
  wpm: DanhoProperty<number>,
  typingStartTime: DanhoProperty<number>,
  typingEndTime: DanhoProperty<number>,
  didSubmit: DanhoProperty<boolean>,
) {
  return function onKeyUp(event: KeyboardEvent) {
    typingEndTime.set(Date.now());

    if (!(event.target instanceof HTMLElement)) return;

    const messageContent = event.target.textContent;

    // Calculate wpm and update the display
    calculateWPM(messageContent, wpm, typingStartTime, typingEndTime);

    // Log the event data
    Logger.debugLog(`[${new Date(typingStartTime.get()).toLocaleTimeString()} - ${new Date(typingEndTime.get()).toLocaleTimeString()}] ${wpm}: ${messageContent}`);

    // Reset wpm if message is empty and backspace is pressed
    if (event.key === 'Backspace' && !messageContent.trim()) {
      Logger.debugLog('Reset', event);
      typingStartTime.reset();
      wpm.reset();
    } else if (
      event.key === 'Enter'
      || event.key === 'NumpadEnter'
    ) {
      Logger.debugLog('Submit through enter-type key')
      didSubmit.set(true);
    }
  };
}

export function getOnSubmitButtonClicked(didSubmit: DanhoProperty<boolean>) {
  return function onSubmitButtonClicked(event: MouseEvent) {
    if (!didSubmit.get()) didSubmit.set(true);
  }
}

export function onSubmit(
  activelyTyping: DanhoProperty<boolean>,
  wpm: DanhoProperty<number>,
  highscores: DiumStore<Highscores>
) {
  updateHighscores(highscores, wpm);
  activelyTyping.set(false);
}