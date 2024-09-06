import { createPlugin } from "@dium/index";
import { 
  createElement, 
  addEventListener, removeAllEventListeners, 
  injectElement, removeAllInjections 
} from "@danho-lib/DOM";

import { WPMCountId, ChatFormSelector } from "./Selectors";
import { resetProperties, wpm } from "./properties";
import { onKeyDown, onKeyUp } from "./events";

import { Settings } from './settings';
import styles from './styles/index.scss';
import SettingsPanel from "./SettingsPanel";


async function initChatForm(chatForm: HTMLElement) {
  if (!chatForm) return;

  addEventListener(chatForm, 'keydown', onKeyDown);
  addEventListener(chatForm, 'keyup', onKeyUp);
  injectElement(chatForm, createElement(`<p id="${WPMCountId}" style="--leftAlign: ${Settings.current.leftAlign}">${wpm.get()} wpm</p>`));
}

function checkChatFormMod(forceClear: boolean) {
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
    setInterval(checkChatFormMod, 1000);
  },

  stop() {
    resetProperties();
    removeAllEventListeners();
    removeAllInjections();
  },

  Settings,
  styles,
  SettingsPanel
})