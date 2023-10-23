const popup = require('./popup.js');

// Function to handle the response from the server
const handleResponse = async (response, method) => {
  // Based on the response status, show relevant message to the user
  switch (response.status) {
    case 200:
      popup.sendMessage(popup.messageType.important, 'Success', 1.5);
      break;
    case 201:
      popup.sendMessage(popup.messageType.important, 'Created', 1.5);
      break;
    case 204:
      popup.sendMessage(popup.messageType.important, 'Updated(No Content)', 1.5);
      break;
    case 400:
      popup.sendError('Bad Request', 2.5);
      break;
    case 500:
      popup.sendError('Internal Server Error', 2.5);
      break;
    case 404:
    default:
      popup.sendError('Not Found', 2.5);
      break;
  }

  // For HEAD request or a status of 204, no content is expected.
  if (method === 'HEAD' || response.status === 204) {
    return;
  }

  const contentType = response.headers.get('content-type');

  // If the content type is JSON, parse and log it to the console
  if (contentType && contentType.includes('application/json')) {
    const obj = await response.json();
    console.log(obj);
  } else {
    // Normally, this wouldn't happen because we are using JSON only.
    // But we still want to handle other types if unexpected behavior occurs.
    console.error('Unhandled content type:', contentType);
  }
};

// Function to send a request to the server
const sendRequest = (url, method, body) => {
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
    .then((response) => handleResponse(response, method))
    .catch((error) => {
      console.error('Error:', error);
      popup.sendError(`Error: ${error.message}`, 2.5);
    });
};

let totalRunTime = 0;
let deltaTime = 0;
let previousTotalRunTime = 0;

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

  // Fetch a bottle when the relevant button is clicked
  fetchBottleBtn.addEventListener('click', () => {
    sendRequest('/fetchBottle', 'GET');
  });

  // Send a message when the relevant button is clicked
  sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message.length >= 5 && message.length <= 1000) {
      sendRequest('/sendMessage', 'POST', { message });
      messageInput.value = ''; // Clear the input after sending
    } else {
      popup.sendError('Message must be between 5 and 1000 characters long!', 2.5);
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
