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

// Maps MIME types to handler types in the urlStruct. This is mainly for clarity purpose,
// such that we can merge multiple MIME types into a single category in our own words.
const MIMETypeToHandlerType = {
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'html',
  'application/javascript': 'html',
};

const getHandler = (requestMethod, pathname, acceptedTypes) => {
  let handler = null;
  const isAnyType = acceptedTypes[0] === '*/*';

  // Map the MIME types to our handler types. If wildcard is used, add all types.
  const mappedTypes = isAnyType
    ? Object.values(MIMETypeToHandlerType)
    : acceptedTypes.map((type) => MIMETypeToHandlerType[type] || type);

  // Loop through the maps for each accepted handler type to find the handler the client wants
  mappedTypes.some((type) => {
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
