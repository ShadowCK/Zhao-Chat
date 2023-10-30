const fs = require('fs');

const serveFile = (response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(file);
  response.end();
};

// Home page
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
// CSS for the home page
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bulma = fs.readFileSync(`${__dirname}/../hosted/bulma.css`);
const bulmaTooltip = fs.readFileSync(`${__dirname}/../hosted/bulma-tooltip.css`);

// Bundled js
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const getIndex = (request, response) => {
  serveFile(response, index, 'text/html');
};

const getCSS = (request, response) => {
  serveFile(response, css, 'text/css');
};

const getBulma = (request, response) => {
  serveFile(response, bulma, 'text/css');
};
const getBulmaTooltip = (request, response) => {
  serveFile(response, bulmaTooltip, 'text/css');
};

const getBundle = (request, response) => {
  serveFile(response, bundle, 'application/javascript');
};

// Favicons
const androidChrome192 = fs.readFileSync(`${__dirname}/../hosted/media/android-chrome-192x192.png`);
const androidChrome512 = fs.readFileSync(`${__dirname}/../hosted/media/android-chrome-512x512.png`);
const appleTouchIcon = fs.readFileSync(`${__dirname}/../hosted/media/apple-touch-icon.png`);
const browserConfig = fs.readFileSync(`${__dirname}/../hosted/media/browserconfig.xml`);
const faviconIco = fs.readFileSync(`${__dirname}/../hosted/media/favicon.ico`);
const favicon16 = fs.readFileSync(`${__dirname}/../hosted/media/favicon-16x16.png`);
const favicon32 = fs.readFileSync(`${__dirname}/../hosted/media/favicon-32x32.png`);
const mstile150 = fs.readFileSync(`${__dirname}/../hosted/media/mstile-150x150.png`);
const safariPinnedTab = fs.readFileSync(`${__dirname}/../hosted/media/safari-pinned-tab.svg`);
const webManifest = fs.readFileSync(`${__dirname}/../hosted/media/site.webmanifest`);

const getAndroidChrome192 = (request, response) => {
  serveFile(response, androidChrome192, 'image/png');
};

const getAndroidChrome512 = (request, response) => {
  serveFile(response, androidChrome512, 'image/png');
};

const getAppleTouchIcon = (request, response) => {
  serveFile(response, appleTouchIcon, 'image/png');
};

const getBrowserConfig = (request, response) => {
  serveFile(response, browserConfig, 'application/xml');
};

const getFaviconIco = (request, response) => {
  serveFile(response, faviconIco, 'image/x-icon');
};

const getFavicon16 = (request, response) => {
  serveFile(response, favicon16, 'image/png');
};

const getFavicon32 = (request, response) => {
  serveFile(response, favicon32, 'image/png');
};

const getMstile150 = (request, response) => {
  serveFile(response, mstile150, 'image/png');
};

const getSafariPinnedTab = (request, response) => {
  serveFile(response, safariPinnedTab, 'image/svg+xml');
};

const getWebManifest = (request, response) => {
  serveFile(response, webManifest, 'application/manifest+json');
};

// Images
const bottleImage = fs.readFileSync(`${__dirname}/../hosted/media/bottle.png`);

const getBottleImage = (request, response) => {
  serveFile(response, bottleImage, 'image/png');
};

module.exports = {
  getIndex,
  getCSS,
  getBulma,
  getBulmaTooltip,
  getBundle,
  getAndroidChrome192,
  getAndroidChrome512,
  getAppleTouchIcon,
  getBrowserConfig,
  getFaviconIco,
  getFavicon16,
  getFavicon32,
  getMstile150,
  getSafariPinnedTab,
  getWebManifest,
  getBottleImage,
};
