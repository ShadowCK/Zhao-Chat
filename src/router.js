// Import scripts
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const urlStruct = {
  json: {
    GET: {
      '/fetchBottle': jsonHandler.fetchBottle, // Fetching a bottle, either random or by ID
      '/checkBottle': jsonHandler.checkBottle, // Check if the current bottle is timed out
    },
    HEAD: {
      '/fetchBottle': jsonHandler.fetchBottleMeta, // HEAD request for fetching a bottle
    },
    POST: {
      '/discardBottle': jsonHandler.discardBottle, // Discarding a specific bottle
      '/destroyBottle': jsonHandler.destroyBottle, // Destroying a specific bottle
      '/addBottle': jsonHandler.addBottle, // Adding a new bottle with a given message
    },
  },
  html: {
    GET: {
      '/': htmlHandler.getIndex,
      '/style.css': htmlHandler.getCSS,
      '/bulma.css': htmlHandler.getBulma,
      '/bulma-tooltip.css': htmlHandler.getBulmaTooltip,
      '/bundle.js': htmlHandler.getBundle,
      '/android-chrome-192x192.png': htmlHandler.getAndroidChrome192,
      '/android-chrome-512x512.png': htmlHandler.getAndroidChrome512,
      '/apple-touch-icon.png': htmlHandler.getAppleTouchIcon,
      '/browserconfig.xml': htmlHandler.getBrowserConfig,
      '/favicon.ico': htmlHandler.getFaviconIco,
      '/favicon-16x16.png': htmlHandler.getFavicon16,
      '/favicon-32x32.png': htmlHandler.getFavicon32,
      '/mstile-150x150.png': htmlHandler.getMstile150,
      '/safari-pinned-tab.svg': htmlHandler.getSafariPinnedTab,
      '/site.webmanifest': htmlHandler.getWebManifest,
      '/fetchBottle': jsonHandler.fetchBottle, // For browser access to the endpoint
    },
  },
  default: jsonHandler.getNotFound, // Default 404 handler
};

// Maps MIME types to handler types in the urlStruct. This is mainly for clarity purpose,
// such that we can merge multiple MIME types into a single category in our own words.
const MIMETypeToHandlerType = {
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'html',
  'application/javascript': 'html',
  'image/avif': 'html',
  'image/webp': 'html',
  'image/apng': 'html',
  'image/svg+xml': 'html',
};

const getHandler = (requestMethod, pathname, acceptedTypes) => {
  let handler = null;
  // TODO: we shouldn't just check all for "*/*" as the first element.
  // Many acceptedTypes have "*/*" as the last element.
  // Checking all handlers should always be the fallback.
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
