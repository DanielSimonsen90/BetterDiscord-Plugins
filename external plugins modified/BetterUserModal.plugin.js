/**
 * @name BetterUserModal
 * @version 1.0.0
 * @description User Modal, but you can actually read bios and click on pronouns.page links
 * @author danhosaur
 */

const select = (value, attribute = 'class') => `[${attribute}*="${value}"]`;

const SELECTORS = {
  pronouns: select('Pronouns', 'aria-label'),
  userProfileModalInner: select('userProfileModalInner'),

  _userProfileModalHeaderTop: select('headerTop'),
  _userProfileBodyContainer: `${select('body')} ${select('container')}`,
};

module.exports = class Plugin {
  css = `
    /* Remove topSection margin */
    ${SELECTORS.userProfileModalInner} ${select('topSection')} {
      margin: 0;
    }

    /* Put margin back, if user has no custom status */
    ${SELECTORS.userProfileModalInner} ${select('topSection')}:not(:has(header ${select('customStatusText')})) {
      margin-bottom: 3em;
    }

    /* Move headerTop to correct position */
    ${SELECTORS.userProfileModalInner} ${SELECTORS._userProfileModalHeaderTop} {
      position: absolute;
      max-width: 80%;
      top: 0;
      right: 0;
      left: 150px;
      padding: .25em .5em;
      gap: 1ch;
    }

    /* Fix badgeList position */
    ${SELECTORS.userProfileModalInner} ${SELECTORS._userProfileModalHeaderTop} > ${select('badgeList')} {
      margin-right: unset;
    }

    /* Ignore relationshipButtons in flex layout, if no buttons are present */
    ${SELECTORS.userProfileModalInner} ${SELECTORS._userProfileModalHeaderTop} > ${select('relationshipButtons')}:not(:has(button)) {
      display: none;
    }

    /* Position User info next to avatar */
    ${SELECTORS.userProfileModalInner} ${SELECTORS._userProfileModalHeaderTop} > ${select('container')}:first-child {
      padding: 0;
    }

    /* Position DisplayName, Username & Pronouns */
    ${SELECTORS.userProfileModalInner} ${select('container')} > div {
      display: flex;
      align-items: baseline;
    }

    /* Fix pronouns width */
    ${SELECTORS.pronouns} {
      width: fit-content;
    }

    /* Give status margin */
    ${SELECTORS.userProfileModalInner} header ${select('customStatusText')} {
      margin-inline: 16px; /* This is the same value as select('userProfileModalOverlayBackground') */
      margin-top: 5em;
    }

    /* Replace status margin if status has emote */
    ${SELECTORS.userProfileModalInner} header ${select('customStatusText')}:has(${select('emoji')}) {
      margin-top: 4em;
    }

    /* If bot, remove username */
    ${SELECTORS.userProfileModalInner}:has(${select('botTag')}) ${select('nameTag')} {
      display: none;
    }
  `;

  constructor(meta) {
    this.meta = meta;
  }

  start() {
    BdApi.injectCSS(this.meta.name, this.css);
  }
  stop() {
    BdApi.clearCSS(this.meta.name);
  }

  /**
   * 
   * @param {MutationRecord} e 
   * @returns 
   */
  async observer(e) {
    if (!e.addedNodes.length) return;
    const addedElements = [...e.addedNodes].filter(el => el instanceof HTMLElement);
    if (!addedElements.length) return;

    for (const [key, selector] of Object.entries(SELECTORS)) {
      if (key.startsWith('_')) continue;

      const [el] = addedElements.map(el => el.querySelector(selector)).filter(Boolean);
      if (!el) continue;

      const pascalKey = key.replace(/(?:^|-)(\w)/g, (m, p1) => p1.toUpperCase());
      this[`process${pascalKey}`](el);
    }
  }

  // #region Pronouns
  /**
   * @param {HTMLElement} el 
   */
  processPronouns(el) {
    if (!el) return;

    let { innerText: value } = el;
    if (el.innerHTML.includes('<a')) return; // already processed

    if (value.includes('pronouns.page')) {
      // regex link like: https://en.pronouns.page/@user
      const regex = /https?:\/\/[a-z]{2}\.pronouns\.page\/@[^ ]+/g;
      const [page] = regex.exec(value);
      value = this.fixPronouns((value.replace(regex, '') || "Pronouns page").trim());
      el.innerHTML = `<a href="${page}" target="_blank" rel="noreferrer noopener">${value}</a>`;
    } else {
      value = this.fixPronouns(value);
      el.innerHTML = `<span>${value}</span>`;
    }
  }

  /**
   * @param {string} value 
   */
  fixPronouns(value) {
    if (['.', ',', ':', ';'].some(punctuation => value.endsWith(punctuation))) value = value.slice(0, -1);
    return value;
  }
  // #endregion

  // #region User Profile Modal
  /**
   * @param {HTMLElement} el 
   */
  processUserProfileModalInner(el) {
    const headerTop = el.querySelector(SELECTORS._userProfileModalHeaderTop);
    if (!headerTop) return console.error('BetterPronouns: Could not find headerTop');

    const container = el.querySelector(SELECTORS._userProfileBodyContainer);
    if (!container) return console.error('BetterPronouns: Could not find container');

    // if custom status
    const containerChildren = Array.from(container.children);
    const status = containerChildren.find(el => el.querySelector(select('customStatusText')));
    if (status) {
      status.remove();
      const topSectionHeader = el.querySelector(`${select('topSection')} header`);
      topSectionHeader.append(status);
    }

    container.remove();
    headerTop.prepend(container);

    const pronouns = headerTop.querySelector(select('pronouns'));
    if (pronouns) this.processPronouns(pronouns);
  }
  // #endregion
};