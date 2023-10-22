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
/***/ (() => {

eval("// Function to display messages to the user using a popup (alert)\r\nconst showMessage = (message) => {\r\n  alert(message);\r\n};\r\n\r\n// Function to handle the response from the server\r\nconst handleResponse = async (response, method) => {\r\n  // Based on the response status, show relevant message to the user\r\n  switch (response.status) {\r\n    case 200:\r\n      showMessage(\"Success\");\r\n      break;\r\n    case 201:\r\n      showMessage(\"Created\");\r\n      break;\r\n    case 204:\r\n      showMessage(\"Updated(No Content)\");\r\n      break;\r\n    case 400:\r\n      showMessage(\"Bad Request\");\r\n      break;\r\n    case 500:\r\n      showMessage(\"Internal Server Error\");\r\n      break;\r\n    case 404:\r\n    default:\r\n      showMessage(\"Not Found\");\r\n      break;\r\n  }\r\n\r\n  // For HEAD request or a status of 204, no content is expected.\r\n  if (method === \"HEAD\" || response.status === 204) {\r\n    return;\r\n  }\r\n\r\n  const contentType = response.headers.get(\"content-type\");\r\n\r\n  // If the content type is JSON, parse and log it to the console\r\n  if (contentType && contentType.includes(\"application/json\")) {\r\n    const obj = await response.json();\r\n    console.log(obj);\r\n  }\r\n  // Normally, this wouldn't happen because we are using JSON only.\r\n  // But we still want to handle other types if unexpected behavior occurs.\r\n  else {\r\n    console.error(\"Unhandled content type:\", contentType);\r\n  }\r\n};\r\n\r\n// Function to send a request to the server\r\nconst sendRequest = (url, method, body) => {\r\n  fetch(url, {\r\n    method,\r\n    // We only use json in this application\r\n    headers: {\r\n      Accept: \"application/json\",\r\n      \"Content-Type\": \"application/json\",\r\n    },\r\n    // Stringify the body if it exists, else it will be treated as undefined (no body)\r\n    body: body ? JSON.stringify(body) : undefined,\r\n  })\r\n    .then((response) => handleResponse(response, method))\r\n    .catch((error) => {\r\n      console.error(\"Error:\", error);\r\n      showMessage(`Error: ${error.message}`);\r\n    });\r\n};\r\n\r\n// Initialize the event listeners on page load\r\nconst init = () => {\r\n  console.log(\"Zhao Drift initialized!\");\r\n\r\n  const fetchBottleBtn = document.querySelector(\"#fetchBottle\");\r\n  const sendMessageBtn = document.querySelector(\"#sendMessage\");\r\n  const messageInput = document.querySelector(\"#messageInput\");\r\n\r\n  // Fetch a bottle when the relevant button is clicked\r\n  fetchBottleBtn.addEventListener(\"click\", () => {\r\n    sendRequest(\"/fetchBottle\", \"GET\");\r\n  });\r\n\r\n  // Send a message when the relevant button is clicked\r\n  sendMessageBtn.addEventListener(\"click\", () => {\r\n    const message = messageInput.value.trim();\r\n    if (message.length >= 5 && message.length <= 1000) {\r\n      sendRequest(\"/sendMessage\", \"POST\", { message });\r\n      messageInput.value = \"\"; // Clear the input after sending\r\n    } else {\r\n      showMessage(\"Message must be between 5 and 1000 characters long!\");\r\n    }\r\n  });\r\n};\r\n\r\nwindow.onload = init;\r\n\n\n//# sourceURL=webpack://zhao-chat/./client/client.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;