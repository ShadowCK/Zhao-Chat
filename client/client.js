const EventEmitter = require('events'); // Node.js built-in module
const _ = require('underscore');
const popup = require('./popup.js');
const utils = require('./utils.js');
const settings = require('./settings.js');

const eventEmitter = new EventEmitter();

// Function to handle the response from the server
const handleResponse = async (response, method, callbacks = {}) => {
  const filteredCallbacks = _.pick(callbacks, (value) => _.isFunction(value));
  const {
    preProcess, onNoContent, onJSONParsed, onError, postProcess,
  } = filteredCallbacks;

  if (preProcess) {
    preProcess(response, method);
  }

  // Based on the response status, show relevant message to the user
  switch (response.status) {
    case 200:
      popup.sendMessage(popup.messageType.important, 'Success', settings.successPopupDuration);
      break;
    case 201:
      popup.sendMessage(popup.messageType.important, 'Created', settings.successPopupDuration);
      break;
    case 204:
      popup.sendMessage(
        popup.messageType.important,
        'Updated(No Content)',
        settings.successPopupDuration,
      );
      break;
    case 400:
      popup.sendError('Bad Request', settings.errorPopupDuration);
      break;
    case 500:
      popup.sendError('Internal Server Error', settings.errorPopupDuration);
      break;
    case 404:
    default:
      popup.sendError('Not Found', settings.errorPopupDuration);
      break;
  }

  // For HEAD request or a status of 204, no content is expected.
  if (method === 'HEAD' || response.status === 204) {
    if (onNoContent) {
      onNoContent(response, method);
    }
    if (postProcess) {
      postProcess(response, method);
    }
    return;
  }

  const contentType = response.headers.get('content-type');

  // If the content type is JSON, parse and log it to the console
  if (contentType && contentType.includes('application/json')) {
    const obj = await response.json();
    console.log(obj);

    // Execute callback with parsed json obj
    if (onJSONParsed) {
      onJSONParsed(response, method, obj);
    }
  } else {
    // Normally, this wouldn't happen because we are using JSON only.
    // But we still want to handle other types if unexpected behavior occurs.
    console.error('Unhandled content type:', contentType);
    if (onError) {
      onError(response, method);
    }
  }
  if (postProcess) {
    postProcess(response, method);
  }
};

// Function to send a request to the server
const sendRequest = (url, method, body, callbacks = {}) => {
  fetch(url, {
    method,
    // We only use json in this application
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // Stringify the body if it exists, else it will be treated as undefined (no body)
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((response) => handleResponse(response, method, callbacks))
    .catch((error) => {
      console.error('Error:', error);
      popup.sendError(`Error: ${error.message}`, settings.errorPopupDuration);
    });
};

let totalRunTime = 0;
let deltaTime = 0;
let previousTotalRunTime = 0;
let canFetchBottle = true;

const update = () => {
  popup.update(deltaTime);
};

/**
 * Continuously updates app data and graphics using requestAnimationFrame.
 * The animation callbacks will be paused if the tab is inactive.
 * For regular time-based executions, consider using window.setTimeout/setInterval.
 * @param {number} realtimeSinceStartup time since the page is loaded in milliseconds
 */
const mainLoop = (realtimeSinceStartup) => {
  // Calculates delta time in seconds
  totalRunTime = realtimeSinceStartup / 1000;
  deltaTime = totalRunTime - previousTotalRunTime;

  // In case of any lags, cap deltaTime to a maximum value.
  if (deltaTime > 1 / 10) deltaTime = 1 / 10;

  update();

  previousTotalRunTime = totalRunTime;

  // When the current frame is processed, requests for the next.
  window.requestAnimationFrame(mainLoop);
};

// Initialize the event listeners on page load
const init = () => {
  console.log('Zhao Drift initialized!');

  const fetchBottleBtn = document.querySelector('#fetchBottle');
  const sendMessageBtn = document.querySelector('#sendMessage');
  const messageInput = document.querySelector('#messageInput');
  const bottle = document.getElementById('bottle');
  const bottleDisplay = document.getElementById('bottleDisplay');
  const closePopupBtn = document.getElementById('closePopup');
  const discardBottleBtn = document.getElementById('discardBottle');
  const destroyBottleBtn = document.getElementById('destroyBottle');

  let currentBottle = null;

  // Handlers
  const driftBottleToCenter = () => {
    bottle.classList.add('bottle-showup');
    bottle.classList.remove('bottle-discard');
  };

  const driftBottleOut = () => {
    bottle.classList.remove('bottle-showup');
    bottle.classList.add('bottle-discard');
    bottleDisplay.style.display = 'none'; // Close the bottle content display
  };

  const resetBottle = () => {
    bottle.style.transition = 'none'; // Temporarily disable transition
    bottle.classList.remove('bottle-showup', 'bottle-discard');
    // We will re-enable the transition in the fetchBottle callback
  };

  bottle.addEventListener('click', () => {
    if (bottle.classList.contains('bottle-showup')) {
      bottleDisplay.style.display = 'block';
    }
  });

  closePopupBtn.addEventListener('click', () => {
    bottleDisplay.style.display = 'none';
  });

  const discardCurrentBottle = (callback) => {
    if (!currentBottle) {
      return;
    }

    sendRequest(
      '/discardBottle',
      'POST',
      { id: currentBottle.id },
      {
        postProcess: (response) => {
          if (response.status === 204) {
            console.log('Bottle discarded!');
          }
          // "Discard" whether bottle is successfully discarded on the server side
          driftBottleOut();
          currentBottle = null;

          if (callback && typeof callback === 'function') {
            callback();
          }
        },
      },
    );
  };

  discardBottleBtn.addEventListener('click', () => {
    discardCurrentBottle();
  });

  destroyBottleBtn.addEventListener('click', () => {
    sendRequest(
      '/destroyBottle',
      'POST',
      { id: currentBottle.id },
      {
        postProcess: (response) => {
          if (response.status === 204) {
            console.log('Bottle destroyed!');
          }
          // "Destroy" whether bottle is successfully discarded on the server side
          // TODO: the bottle should not drift out but directly disappear.
          // The distinct visuals would make better user experience.
          driftBottleOut();
          currentBottle = null;
        },
      },
    );
  });

  fetchBottleBtn.addEventListener('click', () => {
    if (!canFetchBottle) {
      return;
    }

    // The user can't ask for new bottles until the current request is handled
    canFetchBottle = false;

    if (currentBottle) {
      discardCurrentBottle(() => {
        // Wait until discard animation is finished
        setTimeout(() => {
          eventEmitter.emit('fetchBottle');
        }, settings.bottleTransitionDuration * 1000);
      });
    } else {
      eventEmitter.emit('fetchBottle');
    }
  });

  // Listen for the fetchBottle event
  eventEmitter.on('fetchBottle', () => {
    // Reset the bottle every time a new one is requested
    resetBottle();

    sendRequest('/fetchBottle', 'GET', null, {
      preProcess: () => {
        bottle.style.transition = ''; // Re-enable the transition by removing inline style
      },
      onJSONParsed: (response, method, data) => {
        if (response.status === 404) {
          return; // Exit if no bottle is found
        }
        currentBottle = data;
        document.getElementById('bottleContent').innerHTML = utils.formatBottleContent(currentBottle);
        driftBottleToCenter();
      },
      postProcess: () => {
        canFetchBottle = true;
      },
    });
  });

  // Send a message when the relevant button is clicked
  sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message.length >= 5 && message.length <= 1000) {
      sendRequest('/addBottle', 'POST', { message });
      messageInput.value = ''; // Clear the input after sending
    } else {
      popup.sendError(
        'Message must be between 5 and 1000 characters long!',
        settings.errorPopupDuration,
      );
    }
  });

  // Setup popup overlay
  popup.setCurrentOverlay(document.getElementById('popupOverlay'));

  // Start the main loop
  window.requestAnimationFrame(mainLoop);
};

window.onload = init;

const getDeltaTime = () => deltaTime;

module.exports = {
  getDeltaTime,
};
