const createElement = (tagName, attributes = {}, properties = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  Object.entries(properties).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
};

function formatBottleContent(bottle) {
  return `
    <div class="content">
      <span class="tag is-info">Bottle ID</span> ${bottle.id}
      <br>
      <span class="tag is-success">Date</span> ${new Date(bottle.date).toLocaleString()}
      <br><br>
      <div class="card">
        <div class="card-content">
          <pre class="has-background-white">${bottle.message}</pre>
        </div>
      </div>
    </div>
  `;
}

module.exports = {
  createElement,
  formatBottleContent,
};
