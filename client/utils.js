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

module.exports = {
  createElement,
};
