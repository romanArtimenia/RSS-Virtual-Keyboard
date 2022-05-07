import KEYS from './keys.js';

function createDomNodeEl(element, innerHTML, ...classes) {
  const nodeEl = document.createElement(element);
  nodeEl.classList.add(...classes);
  nodeEl.innerHTML = innerHTML;
  return nodeEl;
}

class Keyboard {
  constructor() {
    this.lang = 'en';
    this.caps = 'off';
    this.shift = false;
  }

  checkLang() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', this.lang);
    }
  }

  changeLang(event) {
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }
    localStorage.setItem('lang', this.lang);
    this.updateKeyboard(event);
  }

  // Caps Lock
  capsLockIcon() {
    if (this.caps === 'on') {
      document.querySelector('.caps-icon').classList.add('caps-on');
    } else {
      document.querySelector('.caps-icon').classList.remove('caps-on');
    }
  }

  changeCapsLock(event) {
    if (this.caps === 'on') {
      this.caps = 'off';
    } else {
      this.caps = 'on';
    }
    this.capsLockIcon();
    this.updateKeyboard(event);
  }

  // keyboard  Shift
  updateKeyboard(event) {
    const { lang } = this;
    if (event.shiftKey || this.shift) {
      document.querySelectorAll('.key').forEach((e) => {
        if (e.dataset[`${lang}Shift`]) {
          if (this.caps === 'on') {
            e.innerHTML = e.dataset[`${lang}Shift`].toLowerCase();
          } else e.innerHTML = e.dataset[`${lang}Shift`];
        } else if (e.dataset[lang]) e.innerHTML = e.dataset[lang];
      });
    } else {
      document.querySelectorAll('.key').forEach((e) => {
        if (e.dataset[lang]) {
          if (this.caps === 'on' && !(event.shiftKey || this.shift)) {
            e.innerHTML = e.dataset[lang].toUpperCase();
          } else e.innerHTML = e.dataset[lang];
        }
      });
    }
  }

  removeShift(event) {
    if (this.shift) {
      this.shift = !this.shift;
      document.querySelector('.key-leftshift').classList.remove('active');
      document.querySelector('.key-rightshift').classList.remove('active');
      this.updateKeyboard(event);
    }
  }

  generateKeyboard() {
    const keyboard = createDomNodeEl('div', '', 'keyboard');
    const container = createDomNodeEl('div', '', 'keyboard-container');
    this.checkLang();
    //  row
    for (let i = 0; i < KEYS.length; i += 1) {
      const row = createDomNodeEl('div', '', 'keyboard-row');
      KEYS[i].forEach((e) => {
        // Create  key
        const keyLabel = (e.key.ru && e.key.en) ? e.key[this.lang] : e.key;
        const key = createDomNodeEl('div', keyLabel, 'key');
        if (e.class) key.classList.add(e.class);
        key.dataset.code = e.code;
        if (e.key.ru && e.key.en) {
          key.dataset.ru = e.key.ru;
          key.dataset.en = e.key.en;
        }
        if (e.shift) {
          key.dataset.ruShift = e.shift.ru;
          key.dataset.enShift = e.shift.en;
        }
        if (e.noType) {
          key.dataset.noType = true;
        }
        row.append(key);
      });
      container.append(row);
    }
    keyboard.append(container);
    return keyboard;
  }
}
export default Keyboard;
export { createDomNodeEl };
