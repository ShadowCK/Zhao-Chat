// Import modules
const http = require('http');
const url = require('url');
const query = require('querystring');
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
  const params = query.parse(parsedUrl.query);

  console.log(`${request.method} ${pathname} - ${JSON.stringify(params)}`);

  // Check Accept header to determine response format, default to json
  const acceptHeader = request.headers.accept || 'application/json';
  const acceptedTypes = acceptHeader.split(',');

  const handler = router.getHandler(method, pathname, acceptedTypes);
  handler(request, response, params);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
