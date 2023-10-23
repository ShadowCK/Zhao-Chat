const data = require('./data');

// Respond with JSON content
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Respond without JSON content (used for 204 status and HEAD requests)
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Fetch a bottle by id or, if no id is given, a random bottle and return as JSON
const fetchBottleCore = (params) => {
  const fetchedBottle = params.id ? data.getBottleById(params.id) : data.fetchRandomBottle();

  if (!fetchedBottle) {
    return {
      status: 404,
      responseJSON: {
        message: 'Bottle not found.',
        id: 'notFound',
      },
    };
  }

  return {
    status: 200,
    fetchedBottle,
  };
};

const fetchBottle = (request, response, params) => {
  const result = fetchBottleCore(params);

  if (result.status !== 200) {
    respondJSON(request, response, result.status, result.responseJSON);
    return;
  }

  respondJSON(request, response, 200, result.fetchedBottle);
};

const fetchBottleMeta = (request, response, params) => {
  const result = fetchBottleCore(params);
  respondJSONMeta(request, response, result.status);
};

// Discard a specific bottle by ID
const discardBottle = (request, response, params) => {
  const { id } = params;
  const discarded = data.discardBottle(id);
  if (discarded) {
    respondJSONMeta(request, response, 204);
  } else {
    const responseJSON = {
      message: 'Bottle not found.',
      id: 'notFound',
    };
    respondJSON(request, response, 404, responseJSON);
  }
};

// Destroy a specific bottle by ID
const destroyBottle = (request, response, params) => {
  const { id } = params;
  const destroyed = data.destroyBottle(id);
  if (destroyed) {
    respondJSONMeta(request, response, 204);
  } else {
    const responseJSON = {
      message: 'Bottle not found.',
      id: 'notFound',
    };
    respondJSON(request, response, 404, responseJSON);
  }
};

// Add a new bottle with the given message and respond with the created bottle
const addBottle = (request, response, params) => {
  if (!params.message || params.message === '') {
    const responseJSON = {
      message: 'A message is required.',
      id: 'missingParams',
    };
    respondJSON(request, response, 400, responseJSON);
    return;
  }

  const newBottle = data.addBottle(params.message);
  respondJSON(request, response, 201, newBottle);
};

// 404 Not Found response
const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

// Export handlers
module.exports = {
  fetchBottle,
  fetchBottleMeta,
  discardBottle,
  destroyBottle,
  addBottle,
  getNotFound,
};
