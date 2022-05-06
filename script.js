import Keyboard, { createDomNodeEl } from './assets/js/keybord';

const title = ' RSS Virtual Keyboard';
const subTitle1 = 'Change Language: Shift + Alt';
const subTitle2 = 'Made for: Windows';
const footerText = 'Created by Roman Artimenia, RS-School, 2022';
const textField = createDomNodeEl('textarea', '', 'textfield');
textField.setAttribute('rows', 10);
const keyboard = new Keyboard();
const footer = createDomNodeEl('footer', footerText, 'footer');
const body = document.getElementById('body');
// events:
function keyPress(event, button, code) {
  let text = '';
  let cursor = textField.selectionStart;
  event.preventDefault();
  textField.focus();
  if (code === 'CapsLock') { keyboard.changeCapsLock(event); }
  if ((code === 'AltLeft' && (event.shiftKey || keyboard.shift))
        || (code === 'AltRight' && (event.shiftKey || keyboard.shift))
        || (code === 'ShiftLeft' && event.altKey)
        || (code === 'ShiftRight' && event.altKey)
        || (code === 'Lang')) {
    keyboard.changeLang(event);
    keyboard.removeShift(event);
  }
  if (code === 'ShiftLeft' || code === 'ShiftRight') { keyboard.updateKeyboard(event); }
  if (code === 'ArrowLeft' && cursor > 0) { textField.setSelectionRange(cursor - 1, cursor - 1); }
  if (code === 'ArrowRight') {
    cursor = textField.selectionEnd;
    textField.setSelectionRange(cursor + 1, cursor + 1);
  }
  if (code === 'ArrowUp') {
    const textBeforeCursor = textField.value.substring(0, cursor).split('\n');
    if (textBeforeCursor.length === 1
            || textBeforeCursor[textBeforeCursor.length - 1].length >= 64) {
      cursor -= 64;
    } else if (textBeforeCursor[textBeforeCursor.length - 1].length
            <= textBeforeCursor[textBeforeCursor.length - 2].length % 64) {
      cursor -= (textBeforeCursor[textBeforeCursor.length - 2].length % 64) + 1;
    } else {
      cursor -= textBeforeCursor[textBeforeCursor.length - 1].length + 1;
    }
    if (cursor < 0) { cursor = 0; }
    textField.setSelectionRange(cursor, cursor);
  }
  if (code === 'ArrowDown') {
    cursor = textField.selectionEnd;
    const textBeforeCursor = textField.value.substring(0, cursor).split('\n');
    const textAfterCursor = textField.value.substring(textField.selectionEnd).split('\n');
    if (textAfterCursor.length === 1 || textAfterCursor[0].length >= 64) {
      cursor += 64;
    } else if ((textBeforeCursor[textBeforeCursor.length - 1].length % 64)
            > textAfterCursor[1].length) {
      cursor += textAfterCursor[0].length + textAfterCursor[1].length + 1;
    } else if ((((textBeforeCursor[textBeforeCursor.length - 1].length)
            + textAfterCursor[0].length) > 64)) {
      cursor += textAfterCursor[0].length;
    } else {
      cursor += (textBeforeCursor[textBeforeCursor.length - 1].length % 64)
                + textAfterCursor[0].length + 1;
    }
    textField.setSelectionRange(cursor, cursor);
  }
  if (code === 'Tab') { text = '    '; }
  if (code === 'Enter') { text = '\n'; }
  if (code === 'Backspace') { text = '-1'; }
  if (!button.dataset.noType) {
    text = button.textContent;
    keyboard.removeShift(event);
  }
  if (text) {
    let textBeforeCursor = textField.value.substring(0, cursor);
    const textAfterCursor = textField.value.substring(textField.selectionEnd);
    if (text === '-1') {
      text = '';
      if (cursor === textField.selectionEnd) {
        textBeforeCursor = textBeforeCursor.slice(0, -1);
        cursor -= (cursor > 0) ? 2 : 1;
      } else { cursor -= 1; }
    }
    textField.value = textBeforeCursor + text + textAfterCursor;
    textField.setSelectionRange(cursor + 1, cursor + 1);
    if (text === '    ') { textField.setSelectionRange(cursor + 4, cursor + 4); }
  }
}
//  header
function createHeader() {
  const header = createDomNodeEl('div', '', 'header');
  header.append(createDomNodeEl('h1', title, 'header-text'));
  header.append(createDomNodeEl('div', '', 'subheading'));
  body.append(header);
  const subheading = document.querySelector('.subheading');
  subheading.append(createDomNodeEl('p', subTitle1, 'subheading-text'));
  subheading.append(createDomNodeEl('p', subTitle2, 'subheading-text'));
}

window.onload = () => {
  createHeader();
  body.append(textField);
  body.append(keyboard.generateKeyboard());
  body.append(footer);
  document.addEventListener('keydown', (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.add('active');
      keyPress(event, button, event.code);
    }
  });

  document.addEventListener('keyup', (event) => {
    const button = document.querySelector(`[data-code=${event.code}]`);
    if (button) {
      button.classList.remove('active');
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        keyboard.removeShift(event);
        keyboard.updateKeyboard(event);
      }
    }
  });
  document.querySelector('.keyboard').addEventListener('click', (event) => {
    if (event.target.closest('.key')) {
      const button = event.target.closest('.key');
      if (button.dataset.code === 'ShiftLeft'
        || button.dataset.code === 'ShiftRight') {
        keyboard.shift = !keyboard.shift;
        button.classList.toggle('active');
      }
      keyPress(event, button, button.dataset.code);
    }
  });
};
