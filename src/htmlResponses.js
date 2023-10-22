const fs = require('fs');

// Home page
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
// CSS for the home page
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
};
