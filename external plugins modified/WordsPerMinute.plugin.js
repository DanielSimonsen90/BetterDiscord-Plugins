/**
 * @name WordsPerMinute
 * @author Danho
 * @description Calculate your wpm
 * @version 0.0.1
 */
/// <reference types="betterdiscord-types" />

// #region Setup
const PluginName = 'WordsPerMinute';
const log = (...data) => {
  // console.log(`[${PluginName}]`, ...data);
}
const { BdApi } = window;
const { Webpack, DOM, React, ReactDOM, ReactUtils, UI, Utils, Patcher } = BdApi;

const ChatFormSelector = "main[class*=chatContent] form";
const WPMCountId = 'wpm-count';

const Styles = `
  #${WPMCountId} {
    color: white;
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    margin: 0;
    bottom: .3rem;
    left: 4rem;
  }

  form:has(#${WPMCountId}) {
    position: relative;
  }
`;

// #endregion Setup


module.exports = class WordsPerMinute {
  typingStartTime;
  typingEndTime;

  _wpm = 0;
  get wpm() {
    return this._wpm;
  }
  set wpm(value) {
    this._wpm = parseInt(value);

    const element = document.getElementById(WPMCountId)
    if (element) element.textContent = this._wpm;
  }

  // #region Lifecycle
  start() {
    DOM.addStyle(PluginName, Styles);

    const checkChatFormMod = (forceClear) => {
      const chatForm = document.querySelector(ChatFormSelector);
      const wpmCount = document.getElementById(WPMCountId);
      if (chatForm && !wpmCount) this._initChatForm(chatForm);
      if (forceClear && wpmCount) this.wpm = 0;
    };
    checkChatFormMod(true);
    setInterval(checkChatFormMod, 1000);

    log(`Started`);

    window.wpm = this;
  }

  stop() {
    DOM.removeStyle(PluginName);
    document.getElementById(WPMCountId)?.remove();

    const chatForm = document.querySelector(ChatFormSelector);
    if (chatForm) {
      chatForm.removeEventListener('keydown', this._onKeyDown);
      chatForm.removeEventListener('keyup', this._onKeyUp);
    }

    this.typingStartTime = null;
    this.typingEndTime = null;
    this.wpm = 0;

    log(`Stopped`);
  }
  // #endregion Lifecycle

  // #region Evemts
  _onKeyDown(e) {
    // Ignore non-character keys
    if (e.key.length !== 1) return;
    
    // Set typing start time if not set
    this.typingStartTime ??= Date.now();
  }
  _onKeyUp(e) {
    this.typingEndTime = new Date();
    const messageContent = e.target.textContent;

    // Calculate wpm and update the display
    this._calculateWPM(messageContent);

    // Log the event data
    log(`[${new Date(this.typingStartTime).toLocaleTimeString()} - ${new Date(this.typingEndTime).toLocaleTimeString()}] ${this.wpm}: ${messageContent}`);

    // When enter-type key is pressed, submit the message
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      this._onSubmit();
    }

    // Reset wpm if message is empty and backspace is pressed
    if (e.key === 'Backspace' && !messageContent.trim()) {
      log('Reset', e);
      this.typingStartTime = null;
      this.wpm = 0;
    }
  }
  _onSubmit() {
    // Reset the typing start time
    this.typingStartTime = null;

    // Reset the wpm after 1 second TODO: Make this configurable
    setTimeout(() => {
      log('Auto Reset');
      this.typingEndTime = null;
      this.wpm = 0;
    }, 1000);
  }
  // #endregion Events

  // #region Methods
  /**
   * @param {string} messageContent
   */
  _calculateWPM(messageContent) {
    // If, by mistake/debug, the start or end time is not set, return
    if (!this.typingStartTime || !this.typingEndTime || !messageContent) return;

    const timeDiffMs = this.typingEndTime - this.typingStartTime; // in milliseconds
    const timeDiffMin = timeDiffMs / 1000 / 60; // in minutes

    const wordCount = messageContent.trim().split(/\s+/).length;
    // For some reason, the !messageContent check is being ignored
    if (wordCount <= 1 || messageContent.trim() === '') return;

    this.wpm = wordCount / timeDiffMin;
  }

  /**
   * @param {HTMLElement} chatForm 
   */
  async _initChatForm(chatForm) {
    if (!chatForm) return;

    /** @type {HTMLElement} */
    const chatTextArea = document.querySelector(ChatFormSelector);
    chatTextArea.addEventListener('keydown', this._onKeyDown.bind(this));
    chatTextArea.addEventListener('keyup', this._onKeyUp.bind(this));

    chatForm.appendChild(Object.assign(document.createElement('p'), {
      id: WPMCountId,
      textContent: 0
    }));
  }
  // #endregion Methods
};