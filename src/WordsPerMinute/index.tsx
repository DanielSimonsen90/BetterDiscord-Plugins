import { createPlugin } from "@dium";
import { 
  createElement, 
  addEventListener, removeAllEventListeners, 
  injectElement, removeAllInjections 
} from "@dom";

import { WPMCountId, ChatFormSelector, ChatSubmitButton } from "./utils/Selectors";
import { activelyTyping, didSubmit, resetProperties, typingEndTime, typingStartTime, wpm } from "./utils/properties";
import { getOnKeyDown, getOnKeyUp, getOnSubmitButtonClicked } from "./utils/events";

import { Settings, SettingsPanel } from './settings';
import styles from './styles/index.scss';

async function initChatForm(chatForm: HTMLElement) {
  if (!chatForm) return;

  addEventListener(chatForm, 'keydown', getOnKeyDown(activelyTyping, typingStartTime));
  addEventListener(chatForm, 'keyup', getOnKeyUp(wpm, typingStartTime, typingEndTime, didSubmit));
  injectElement(chatForm, createElement(`<p id="${WPMCountId}" style="--leftAlign: ${Settings.current.leftAlign}">${wpm.get()} wpm</p>`));

  const submitButton = document.querySelector<HTMLElement>(ChatSubmitButton);
  if (submitButton) addEventListener(submitButton, 'click', getOnSubmitButtonClicked(didSubmit));
}

async function checkChatFormMod(forceClear: boolean) {
  const wpmCount = document.getElementById(WPMCountId);
  // If the wpm count is already set and forceClear is true, clear it 
  if (wpmCount && forceClear) wpm.reset();
  // If the wpm count is already set, return out of interval
  if (wpmCount) return;

  // if chat form can be found, initialize it with wpm counter
  const chatForm = document.querySelector<HTMLElement>(ChatFormSelector);
  if (chatForm) initChatForm(chatForm);
}

export default createPlugin({
  start() {
    checkChatFormMod(true);
    this.interval = setInterval(checkChatFormMod, 1000);
  },

  stop() {
    resetProperties();
    removeAllEventListeners();
    removeAllInjections();
    clearInterval(this.interval);
  },

  Settings,
  styles,
  SettingsPanel
})