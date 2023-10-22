// Import scripts
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const urlStruct = {
  // TODO: Add API handlers
  json: {
    GET: {},
    HEAD: {},
  },
  html: {
    GET: {
      '/': htmlHandler.getIndex,
      '/style.css': htmlHandler.getCSS,
      '/bundle.js': htmlHandler.getBundle,
    },
  },
  default: jsonHandler.getNotFound,
};

const MIMETypeToHandlerMapping = {
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'html',
};

const getHandler = (requestMethod, pathname, acceptedTypes) => {
  let handler = null;

  acceptedTypes
    .map((type) => MIMETypeToHandlerMapping[type] || type)
    .some((type) => {
      // Invalid type
      if (!urlStruct[type]) {
        return false;
      }
      const handlerMap = urlStruct[type][requestMethod];
      // Invalid method
      if (!handlerMap) {
        return false;
      }
      const _handler = handlerMap[pathname];
      // Found handler
      if (_handler instanceof Function) {
        handler = _handler;
        return true; // This will stop the iteration
      }
      return false;
    });

  // Assign default handler
  if (!handler) {
    handler = urlStruct.default;
    console.warn(`Cannot find handler for ${pathname}`);
  }

  return handler;
};

module.exports = {
  getHandler,
};
