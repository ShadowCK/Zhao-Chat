/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const popup = __webpack_require__(/*! ./popup.js */ \"./client/popup.js\");\n\n// Function to handle the response from the server\nconst handleResponse = async (response, method) => {\n  // Based on the response status, show relevant message to the user\n  switch (response.status) {\n    case 200:\n      popup.sendMessage(popup.messageType.important, 'Success', 2.5);\n      break;\n    case 201:\n      popup.sendMessage(popup.messageType.important, 'Created', 2.5);\n      break;\n    case 204:\n      popup.sendMessage(popup.messageType.important, 'Updated(No Content)', 2.5);\n      break;\n    case 400:\n      popup.sendError('Bad Request', 2.5);\n      break;\n    case 500:\n      popup.sendError('Internal Server Error', 2.5);\n      break;\n    case 404:\n    default:\n      popup.sendError('Not Found', 2.5);\n      break;\n  }\n\n  // For HEAD request or a status of 204, no content is expected.\n  if (method === 'HEAD' || response.status === 204) {\n    return;\n  }\n\n  const contentType = response.headers.get('content-type');\n\n  // If the content type is JSON, parse and log it to the console\n  if (contentType && contentType.includes('application/json')) {\n    const obj = await response.json();\n    console.log(obj);\n  } else {\n    // Normally, this wouldn't happen because we are using JSON only.\n    // But we still want to handle other types if unexpected behavior occurs.\n    console.error('Unhandled content type:', contentType);\n  }\n};\n\n// Function to send a request to the server\nconst sendRequest = (url, method, body) => {\n  fetch(url, {\n    method,\n    // We only use json in this application\n    headers: {\n      Accept: 'application/json',\n      'Content-Type': 'application/json',\n    },\n    // Stringify the body if it exists, else it will be treated as undefined (no body)\n    body: body ? JSON.stringify(body) : undefined,\n  })\n    .then((response) => handleResponse(response, method))\n    .catch((error) => {\n      console.error('Error:', error);\n      popup.sendError(`Error: ${error.message}`);\n    });\n};\n\nlet totalRunTime = 0;\nlet deltaTime = 0;\nlet previousTotalRunTime = 0;\n\nconst update = () => {\n  popup.update(deltaTime);\n};\n\n/**\n * Continuously updates app data and graphics using requestAnimationFrame.\n * The animation callbacks will be paused if the tab is inactive.\n * For regular time-based executions, consider using window.setTimeout/setInterval.\n * @param {number} realtimeSinceStartup time since the page is loaded in milliseconds\n */\nconst mainLoop = (realtimeSinceStartup) => {\n  // Calculates delta time in seconds\n  totalRunTime = realtimeSinceStartup / 1000;\n  deltaTime = totalRunTime - previousTotalRunTime;\n\n  // In case of any lags, cap deltaTime to a maximum value.\n  if (deltaTime > 1 / 10) deltaTime = 1 / 10;\n\n  update();\n\n  previousTotalRunTime = totalRunTime;\n\n  // When the current frame is processed, requests for the next.\n  window.requestAnimationFrame(mainLoop);\n};\n\n// Initialize the event listeners on page load\nconst init = () => {\n  console.log('Zhao Drift initialized!');\n\n  const fetchBottleBtn = document.querySelector('#fetchBottle');\n  const sendMessageBtn = document.querySelector('#sendMessage');\n  const messageInput = document.querySelector('#messageInput');\n\n  // Fetch a bottle when the relevant button is clicked\n  fetchBottleBtn.addEventListener('click', () => {\n    sendRequest('/fetchBottle', 'GET');\n  });\n\n  // Send a message when the relevant button is clicked\n  sendMessageBtn.addEventListener('click', () => {\n    const message = messageInput.value.trim();\n    if (message.length >= 5 && message.length <= 1000) {\n      sendRequest('/sendMessage', 'POST', { message });\n      messageInput.value = ''; // Clear the input after sending\n    } else {\n      popup.sendError('Message must be between 5 and 1000 characters long!');\n    }\n  });\n\n  // Setup popup overlay\n  popup.setCurrentOverlay(document.getElementById('popupOverlay'));\n\n  // Start the main loop\n  window.requestAnimationFrame(mainLoop);\n};\n\nwindow.onload = init;\n\nconst getDeltaTime = () => deltaTime;\n\nmodule.exports = {\n  getDeltaTime,\n};\n\n\n//# sourceURL=webpack://zhao-chat/./client/client.js?");

/***/ }),

/***/ "./client/popup.js":
/*!*************************!*\
  !*** ./client/popup.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const utils = __webpack_require__(/*! ./utils.js */ \"./client/utils.js\");\n\nconst popups = [];\nlet currentPopupOverlay;\n\n/**\n * a pop-up message with a HTML Element parent.\n */\nclass PopUp {\n  constructor(\n    index,\n    parentElement = currentPopupOverlay,\n    message = 'Unknown',\n    duration = 1,\n    offset = { x: 0, y: 0 },\n    direction = { x: 0, y: -1 }, // -1 is upward\n    speed = Math.random() * 5,\n  ) {\n    this.parentElement = parentElement;\n    this.message = message;\n    this.timer = 0;\n    this.duration = duration;\n    this.index = index;\n    this.direction = direction;\n    this.speed = speed;\n    this.offset = offset;\n\n    // Creates an HTML element for this popup.\n    // This is the frame for text layout\n    const element = utils.createElement('div', { class: 'popup' });\n\n    // This is the centered text\n    const p = utils.createElement('p', { class: 'text' }, { innerHTML: message });\n    this.textChild = p;\n\n    element.append(p);\n    this.parentElement.append(element);\n    this.selfElement = element;\n    // Initial translate\n    this.selfElement.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px)`;\n  }\n\n  /**\n   * Updates popup. Should be called in gameLoop.\n   */\n  update(deltaTime) {\n    this.timer += deltaTime;\n    // Removes the popup when exceeds duration, both frontend and backend\n    if (this.timer > this.duration) {\n      this.parentElement.removeChild(this.selfElement);\n      popups.splice(this.index, 1);\n      popups.filter((e) => e.index > this.index).map((e) => e.index--);\n    }\n\n    this.selfElement.style.opacity = `${1 - this.timer / this.duration}`;\n    this.move();\n  }\n\n  /**\n   * Moves the popup in its direction to create animated visual representation.\n   */\n  move(deltaTime) {\n    this.offset.x += this.speed * this.direction.x * deltaTime;\n    this.offset.y += this.speed * this.direction.y * deltaTime;\n    this.selfElement.style.transform = `translate(${this.offset.x}px, ${this.offset.y}px)`;\n  }\n\n  /**\n   * Has a different visualization if important.\n   * @deprecated Use addTag() which is more general.\n   */\n  markAsImportant() {\n    this.selfElement.classList.add('important');\n    return this;\n  }\n\n  /**\n   * Adds a class to the popup element\n   * @param {string} tag HTML class name\n   */\n  addTag(tag) {\n    this.selfElement.classList.add(tag);\n    return this;\n  }\n}\n\nconst createPopUp = (\n  message,\n  duration,\n  offset,\n  direction,\n  speed,\n  parentElement = currentPopupOverlay,\n) => {\n  const index = popups.length;\n  const popup = new PopUp(index, parentElement, message, duration, offset, direction, speed);\n  popups.push(popup);\n\n  return popup;\n};\n\nconst messageType = {\n  normal: 'normal',\n  important: 'important',\n  error: 'error',\n  warning: 'warning',\n};\n\n// A bunch of wrapper functions of createPop\nconst sendMessage = (\n  type = messageType.normal,\n  message = 'Unkown',\n  duration = 1,\n  offset = undefined,\n  direction = undefined,\n  speed = 10,\n) => {\n  switch (type) {\n    case messageType.important:\n      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay).addTag(\n        'important',\n      );\n      break;\n    case messageType.error:\n      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay)\n        .addTag('important')\n        .addTag('error');\n      break;\n    case messageType.normal:\n    default:\n      createPopUp(message, duration, offset, direction, speed, currentPopupOverlay);\n      break;\n  }\n};\n\nconst sendError = (\n  message = 'Unkown',\n  duration = 3,\n  offset = undefined,\n  direction = undefined,\n  speed = 10,\n) => {\n  sendMessage(messageType.error, message, duration, offset, direction, speed);\n};\n\nconst update = (deltaTime) => {\n  popups.forEach((popup) => {\n    popup.update(deltaTime);\n  });\n};\n\nconst setCurrentOverlay = (element) => {\n  currentPopupOverlay = element;\n};\n\nmodule.exports = {\n  messageType,\n  sendMessage,\n  sendError,\n  update,\n  setCurrentOverlay,\n};\n\n\n//# sourceURL=webpack://zhao-chat/./client/popup.js?");

/***/ }),

/***/ "./client/utils.js":
/*!*************************!*\
  !*** ./client/utils.js ***!
  \*************************/
/***/ ((module) => {

eval("const createElement = (tagName, attributes = {}, properties = {}) => {\n  const element = document.createElement(tagName);\n  Object.entries(attributes).forEach(([key, value]) => {\n    element.setAttribute(key, value);\n  });\n  Object.entries(properties).forEach(([key, value]) => {\n    element[key] = value;\n  });\n  return element;\n};\n\nmodule.exports = {\n  createElement,\n};\n\n\n//# sourceURL=webpack://zhao-chat/./client/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./client/client.js");
/******/ 	
/******/ })()
;