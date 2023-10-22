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

eval("console.log(\"hello world!\");\r\n\r\nconst handleResponse = async (response, method) => {\r\n  const content = document.querySelector(\"#content\");\r\n\r\n  switch (response.status) {\r\n    case 200:\r\n      content.innerHTML = `<b>Success</b>`;\r\n      break;\r\n    case 201:\r\n      content.innerHTML = `<b>Created</b>`;\r\n      break;\r\n    case 204:\r\n      content.innerHTML = `<b>Updated(No Content)</b>`;\r\n      break;\r\n    case 400:\r\n      content.innerHTML = `<b>Bad Request</b>`;\r\n      break;\r\n    case 500: // internal server error\r\n      content.innerHTML = `<b>Internal Server Error</b>`;\r\n      break;\r\n    case 404:\r\n    default:\r\n      content.innerHTML = `<b>Not Found</b>`;\r\n      break;\r\n  }\r\n\r\n  const contentType = response.headers.get(\"content-type\");\r\n  // No content is needed to be parsed. Let's bail out.\r\n  if (method == \"HEAD\" || response.status === 204) {\r\n    return;\r\n  }\r\n  // Parse content\r\n  if (contentType && contentType.includes(\"application/json\")) {\r\n    const obj = await response.json();\r\n    console.log(obj);\r\n    content.innerHTML += `<p>${JSON.stringify(obj)}</p>`;\r\n  } else {\r\n    console.error(\"Unhandled content type:\", contentType);\r\n  }\r\n};\r\n\r\nconst sendRequest = (url, method, body) => {\r\n  fetch(url, {\r\n    method,\r\n    headers: {\r\n      Accept: \"application/json\",\r\n      \"Content-Type\": \"application/json\",\r\n    },\r\n    body,\r\n  })\r\n    .then((response) => handleResponse(response, method))\r\n    .catch((error) => {\r\n      console.error(\"Error:\", error);\r\n      const content = document.querySelector(\"#content\");\r\n      content.innerHTML = `<b>Error: ${error.message}</b>`;\r\n    });\r\n};\r\n\r\nconst init = () => {\r\n  console.log(\"Hello!\");\r\n  // TODO\r\n};\r\n\r\nwindow.onload = init;\r\n\n\n//# sourceURL=webpack://zhao-chat/./client/client.js?");

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