const utils = require('./utils.js');

const popups = [];
let currentPopupOverlay;

/**
 * a pop-up message with a HTML Element parent.
 */
class PopUp {
  constructor(
    index,
    parentElement = currentPopupOverlay,
    message = 'Unknown',
    duration = 1,
    offset = { x: 0, y: 0 },
    direction = { x: 0, y: -1 }, // -1 is upward
    speed = Math.random() * 5,
  ) {
    this.parentElement = parentElement;
    this.message = message;
    this.timer = 0;
    this.duration = duration;
    this.index = index;
    this.direction = direction;
    this.speed = speed;
    this.offset = offset;

    // Creates an HTML element for this popup.
    // This is the frame for text layout
    const element = utils.createElement('div', { class: 'popup' });

    // This is the centered text
    const p = utils.createElement('p', { class: 'text' }, { innerHTML: message });
    this.textChild = p;

    element.append(p);
    this.parentElement.append(element);
    this.selfElement = element;
    // Initial translate
    this.selfElement.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px)`;
  }

  /**
   * Updates popup. Should be called in gameLoop.
   */
  update(deltaTime) {
    this.timer += deltaTime;
    // Removes the popup when exceeds duration, both frontend and backend
    if (this.timer > this.duration) {
      this.parentElement.removeChild(this.selfElement);
      popups.splice(this.index, 1);
      popups.filter((e) => e.index > this.index).map((e) => e.index--);
    }

    this.selfElement.style.opacity = `${1 - this.timer / this.duration}`;
    this.move();
  }

  /**
   * Moves the popup in its direction to create animated visual representation.
   */
  move(deltaTime) {
    this.offset.x += this.speed * this.direction.x * deltaTime;
    this.offset.y += this.speed * this.direction.y * deltaTime;
    this.selfElement.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px)`;
  }

  /**
   * Has a different visualization if important.
   * @deprecated Use addTag() which is more general.
   */
  markAsImportant() {
    this.selfElement.classList.add('important');
    return this;
  }

  /**
   * Adds a class to the popup element
   * @param {string} tag HTML class name
   */
  addTag(tag) {
    this.selfElement.classList.add(tag);
    return this;
  }
}

const createPopUp = (
  message,
  duration,
  offset,
  direction,
  speed,
  parentElement = currentPopupOverlay,
) => {
  const index = popups.length;
  const popup = new PopUp(index, parentElement, message, duration, offset, direction, speed);
  popups.push(popup);

  return popup;
};

const messageType = {
  normal: 'normal',
  important: 'important',
  error: 'error',
  warning: 'warning',
};

// A bunch of wrapper functions of createPop
const sendMessage = (
  type = messageType.normal,
  message = 'Unkown',
  duration = 1,
  offset = undefined,
  direction = undefined,
  speed = 10,
) => {
  switch (type) {
    case messageType.important:
      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay).addTag(
        'important',
      );
      break;
    case messageType.error:
      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay)
        .addTag('important')
        .addTag('error');
      break;
    case messageType.normal:
    default:
      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay);
      break;
  }
};

const sendError = (
  message = 'Unkown',
  duration = 3,
  offset = undefined,
  direction = undefined,
  speed = 10,
) => {
  sendMessage(messageType.error, message, duration, offset, direction, speed);
};

const update = (deltaTime) => {
  popups.forEach((popup) => {
    popup.update(deltaTime);
  });
};

const setCurrentOverlay = (element) => {
  currentPopupOverlay = element;
};

module.exports = {
  messageType,
  sendMessage,
  sendError,
  update,
  setCurrentOverlay,
};
