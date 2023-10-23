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
const fetchBottleCore = (request, response, params = {}) => {
  const includeArchived = params['include-archived'] === '' || params['include-archived'] === 'true';
  const fetchedBottle = params.id
    ? data.fetchBottleById(params.id, includeArchived)
    : data.fetchRandomBottle(request.method !== 'HEAD');

  if (!fetchedBottle) {
    return {
      status: 404,
      responseJSON: {
        message: 'You stirred the water and nothing happens.',
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
  const result = fetchBottleCore(request, response, params);

  if (result.status !== 200) {
    respondJSON(request, response, result.status, result.responseJSON);
    return;
  }

  respondJSON(request, response, 200, result.fetchedBottle);
};

const fetchBottleMeta = (request, response, params) => {
  const result = fetchBottleCore(request, response, params);
  respondJSONMeta(request, response, result.status);
};

const getBody = (request) => new Promise((resolve, reject) => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      resolve(parsedBody);
    } catch (error) {
      reject(new Error('Invalid JSON in request body.'));
    }
  });

  request.on('error', (err) => {
    reject(err);
  });
});

// Discard a specific bottle by ID
const discardBottle = async (request, response) => {
  try {
    const body = await getBody(request);
    const { id } = body;
    if (!id) {
      const responseJSON = {
        message: 'Missing bottle ID.',
        id: 'missingParams',
      };
      respondJSON(request, response, 400, responseJSON);
      return;
    }

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
  } catch (error) {
    const responseJSON = {
      message: 'Bad request body.',
      id: 'badRequest',
    };
    respondJSON(request, response, 400, responseJSON);
  }
};

// Destroy a specific bottle by ID
const destroyBottle = async (request, response) => {
  try {
    const body = await getBody(request);
    const { id } = body;
    if (!id) {
      const responseJSON = {
        message: 'Missing bottle ID.',
        id: 'missingParams',
      };
      respondJSON(request, response, 400, responseJSON);
      return;
    }

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
  } catch (error) {
    const responseJSON = {
      message: 'Bad request body.',
      id: 'badRequest',
    };
    respondJSON(request, response, 400, responseJSON);
  }
};

// Add a new bottle with the given message and respond with the created bottle
const addBottle = async (request, response) => {
  try {
    const body = await getBody(request);
    const { message } = body;
    if (!message || message === '') {
      const responseJSON = {
        message: 'A message is required.',
        id: 'missingParams',
      };
      respondJSON(request, response, 400, responseJSON);
      return;
    }

    const newBottle = data.addBottle(message);
    respondJSON(request, response, 201, newBottle);
  } catch (error) {
    const responseJSON = {
      message: 'Bad request body.',
      id: 'badRequest',
    };
    respondJSON(request, response, 400, responseJSON);
  }
};

// 404 Not Found response
const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The resource you are looking for was not found.',
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
