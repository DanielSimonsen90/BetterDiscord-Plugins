/**
 * @name WordsPerMinute
 * @author Danho
 * @description Calculate your wpm
 * @version 1.0.0
 */
/// <reference types="betterdiscord-types" />

// #region Setup
const PluginName = 'WordsPerMinute';
const { BdApi, DanhoPlugin, DanhoLib } = window;
const { Data } = BdApi;

const DEFAULT_SETTINGS = {
  autoResetTime: 1000,
  leftAlign: `1.5rem`
};
const DEFAULT_HIGHSCORES = {
  best: 0,
  bestDate: new Date().toLocaleDateString(),
  today: 0,
  todayDate: new Date().toLocaleDateString()
};

const ChatFormSelector = "main[class*=chatContent] form";
const WPMCountId = 'wpm-count';

// #endregion Setup

module.exports = class WordsPerMinute extends DanhoPlugin {
  constructor() {
    super(PluginName, true);
  }

  typingStartTime;
  typingEndTime;

  _wpm = 0;
  get wpm() {
    return this._wpm;
  }
  set wpm(value) {
    this._wpm = parseInt(value);

    const element = document.getElementById(WPMCountId);
    if (element) element.textContent = `${this._wpm} wpm`;
  }

  // #region Lifecycle
  start() {
    const checkChatFormMod = (forceClear) => {
      const wpmCount = document.getElementById(WPMCountId);
      // If the wpm count is already set and forceClear is true, clear it 
      if (wpmCount && forceClear) this.wpm = 0;
      // If the wpm count is already set, return out of interval
      if (wpmCount) return;

      // if chat form can be found, initialize it with wpm counter
      const chatForm = document.querySelector(ChatFormSelector);
      if (chatForm) this._initChatForm(chatForm);
    };
    checkChatFormMod(true);
    setInterval(checkChatFormMod, 1000);

    super.start();

    window.wpm = this;
  }

  stop() {
    this.typingStartTime = null;
    this.typingEndTime = null;
    this.wpm = 0;

    super.stop();
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
    this.debugLog(`[${new Date(this.typingStartTime).toLocaleTimeString()} - ${new Date(this.typingEndTime).toLocaleTimeString()}] ${this.wpm}: ${messageContent}`);

    // When enter-type key is pressed, submit the message
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      this._onSubmit();
    }

    // Reset wpm if message is empty and backspace is pressed
    if (e.key === 'Backspace' && !messageContent.trim()) {
      this.debugLog('Reset', e);
      this.typingStartTime = null;
      this.wpm = 0;
    }
  }
  _onSubmit() {
    // Reset the typing start time
    this.typingStartTime = null;
    this.updateHighscores();

    setTimeout(() => {
      this.debugLog('Auto Reset');
      this.typingEndTime = null;
      this.wpm = 0;
    }, this.settings.autoResetTime);
  }
  // #endregion Events

  // #region Methods
  /*** @param {string} messageContent */
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

    this.addEventListener(chatForm, 'keydown', this._onKeyDown.bind(this));
    this.addEventListener(chatForm, 'keyup', this._onKeyUp.bind(this));
    this.injectElement(chatForm, DanhoLib.createElement(`<p id="${WPMCountId}">${this.wpm} wpm</p>`));
  }

  updateHighscores() {
    const {
      best, bestDate,
      today: storedTodayScore, todayDate
    } = Data.load(PluginName, 'highscores') ?? DEFAULT_HIGHSCORES;

    const current = this.wpm;
    const today = new Date().toLocaleDateString() === new Date(todayDate).toLocaleDateString() ? storedTodayScore : 0;
    const notification = (
      current > best ? `New best highscore! ${current} wpm`
      : current > today ? `New today's highscore! ${current} wpm`
      : null
    );

    if (!notification) return;

    Data.save(PluginName, 'highscores', {
      best: Math.max(best, current),
      bestDate: best > current ? new Date().toLocaleDateString() : new Date(bestDate).toLocaleDateString(),
      today: Math.max(today, current),
      todayDate: new Date().toLocaleDateString()
    });
    this.log(notification, Data.load(PluginName, 'highscores'), { best, today, todayDate });
    BdApi.UI.showToast(notification);
  }
  // #endregion Methods

  // #region Settings & Style
  _settings = DEFAULT_SETTINGS;
  getSettingsPanel() {
    const createResetButton = (textContent, onclick, danger) => this.lib.createElement('button', {
      classList: !danger ? `bd-button bd-button-outlined bd-button-color-primary` : `bd-button bd-button-outlined bd-button-color-red`,
      textContent,
      onclick
    });
    /**
     * @template {string | number | boolean} TValue
     * @param {string} title
     * @param {string} palceholder
     * @param {keyof typeof DEFAULT_SETTINGS} settingKey
     * @param {(newValue: TValue) => void} onChange
     * @returns {HTMLElement}
     */
    const createSettingGroup = (settingKey, title, readonly) => this.lib.createElement('div', {
      className: `${PluginName}-${settingKey}-setting`,
      children: [
        this.lib.createElement('h3', title),
        this.lib.createElement('div', {
          className: 'bd-flex bd-flex-horizontal',
          style: 'gap: .5rem;',
          children: [
            this.lib.createElement('input', {
              type: typeof this.settings[settingKey] === 'number' ? 'number' : typeof this.settings[settingKey] === 'boolean' ? 'checkbox' : 'text',
              placeholder: `${title} (${this.settings[settingKey]})`,
              value: this.settings[settingKey],
              readonly,
              onchange: () => this.settings[settingKey] = this.value
            }),
            createResetButton('Reset', () => {
              this.settings[settingKey] = DEFAULT_SETTINGS[settingKey];
              document.querySelector(`.${PluginName}-${settingKey}-setting input`).value = DEFAULT_SETTINGS[settingKey];
            })
          ]
        })
      ]
    });

    return this.lib.createElement('div', {
      className: `${PluginName}-settings`,
      style: 'width: 100%;',
      children: [
        createSettingGroup('autoResetTime', 'Auto Reset Time (ms)'),
        createSettingGroup('leftAlign', 'Left Align'),

        this.lib.createElement('div', {
          className: `${PluginName}-highscores`,
          children: [
            this.lib.createElement('h3', 'Highscores'),
            this.lib.createElement('section', {
              className: `${PluginName}-highscores-container`,
              children: [
                this.lib.createElement(`
                  <div class="${PluginName}-best">
                    <h4>Best Highscore</h4>
                    <p>
                      <span id="${PluginName}-best-highscore">${Data.load(PluginName, 'highscores').best} wpm</span>
                      <span id="${PluginName}-best-highscore-date">Date: ${new Date().toLocaleDateString()}</span>
                    </p>
                  </div>  
                `),
                this.lib.createElement(`
                  <div class="${PluginName}-today">
                    <h4>Today's Highscore</h4>
                    <p>
                      <span id="${PluginName}-today-highscore">${Data.load(PluginName, 'highscores').today} wpm</span>
                      <span id="${PluginName}-today-highscore-date">Date: ${new Date().toLocaleDateString()}</span>
                    </p>
                  </div>  
                `)
              ]
            }),
            createResetButton('Reset Highscores', () => {
              Data.save(PluginName, 'highscores', DEFAULT_HIGHSCORES);
              document.getElementById(`${PluginName}-best-highscore`).textContent = `${DEFAULT_HIGHSCORES.best} wpm`;
              document.getElementById(`${PluginName}-best-highscore-date`).textContent = `Date: ${new Date().toLocaleDateString()}`;
              document.getElementById(`${PluginName}-today-highscore`).textContent = `${DEFAULT_HIGHSCORES.today} wpm`;
              document.getElementById(`${PluginName}-today-highscore-date`).textContent = `Date: ${new Date().toLocaleDateString()}`;
            }, true)
          ]
        })
      ]
    })
  };
  style = this.createStyle(({ leftAlign }) => (`
    /* #region Chat Form */
    #${WPMCountId} {
      display: none;
      transition: top .25s ease-in-out 1s;
    }

    form:not(:has(span[class*=emptyText])) #${WPMCountId} {
      display: block;
      color: var(--text-message-preview-low-sat);
      font-size: 12px;
      font-weight: bold;
      position: absolute;
      margin: 0;
      top: .3rem;
      left: ${leftAlign};
    }
      
    form:has(#${WPMCountId}) {
      position: relative;
    }

    div[class*=inner]:has([class*=textArea] [data-slate-string]:not(:empty)) {
      padding-top: 1rem;
    }
    /* #endregion Chat Form */

    /* #region Settings */
    .${PluginName}-settings {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .${PluginName}-settings input {
      box-sizing: border-box;
      width: 100%;
      padding: .25rem;
      border: 1px solid var(--interactive-normal);
      border-radius: .5rem;
      font-size: 1rem;
      background-color: var(--background-modifier-accent);
      color: var(--text-normal);
    }

    .${PluginName}-settings h3 {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--header-primary);
      margin-bottom: .5rem;
    }

    .${PluginName}-highscores {
      margin-top: 1rem;
    }
    
    .${PluginName}-highscores section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      place-items: center;
    }

    .${PluginName}-highscores h3 {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--header-primary);
      margin-bottom: .5rem;
      text-align: center;
    }

    .${PluginName}-highscores h3::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background-color: var(--background-modifier-accent);
      margin-top: .5rem;
    }

    .${PluginName}-highscores h4 {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--header-secondary);
      margin-bottom: .5rem;
    }

    .${PluginName}-highscores p {
      color: var(--text-normal);
      font-size: 1rem;
    }

    .${PluginName}-highscores span:first-child {
      font-weight: bold;
    }
    .${PluginName}-highscores span:last-child::before {
      content: ' • ';
    }

    .${PluginName}-highscores button {
      padding: .5rem;
      font-size: .8rem;
      border-radius: .5rem;
      margin-inline: auto;

      color: var(--button-danger-background) !important;
    }

    .${PluginName}-highscores button:hover {
      color: var(--white-500) !important;
    }
  `));
  // #endregion Settings
};