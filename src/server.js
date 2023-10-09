// Import modules
const http = require('http');
const url = require('url');
// Import scripts
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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
    },
  },
  default: jsonHandler.getNotFound,
};

const MIMETypeToHandlerMapping = {
  'application/json': 'json',
  'text/html': 'html',
  'text/css': 'html',
};

const onRequest = (request, response) => {
  // Parse the url into an object
  const parsedUrl = url.parse(request.url);
  // Grab useful data
  const { pathname } = parsedUrl;

  // Check Accept header to determine response format, default to json
  const acceptHeader = request.headers.accept || 'application/json';
  const acceptedTypes = acceptHeader.split(',');

  const { method } = request;

  let handler = null;
  acceptedTypes
    .map((type) => MIMETypeToHandlerMapping[type] || type)
    .some((type) => {
      // Invalid type
      if (!urlStruct[type]) {
        return false;
      }
      const handlerMap = urlStruct[type][method];
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
  }

  handler(request, response); // Updated this line
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
