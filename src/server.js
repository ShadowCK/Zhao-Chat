// Import modules
const http = require('http');
const url = require('url');
// Import scripts
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  // Get request method
  const { method } = request;
  // Parse the url into an object
  const parsedUrl = url.parse(request.url);
  // Grab useful data
  const { pathname } = parsedUrl;

  console.log(`${request.method} ${pathname}`);

  // Check Accept header to determine response format, default to json
  const acceptHeader = request.headers.accept || 'application/json';
  const acceptedTypes = acceptHeader.split(',');

  const handler = router.getHandler(method, pathname, acceptedTypes);
  handler(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
