const _ = require('underscore');

// Data structures to hold the drift bottles
let availableBottles = [];
let inReviewBottles = [];
const archivedBottles = [];
// Track the idle times of bottles in review.
const bottleIdleTimes = {};
const reviewTimeout = 10; // seconds

const BottleStatus = Object.freeze({
  Available: 'available',
  InReview: 'inReview',
  Archived: 'archived',
  NotFound: 'notFound',
});

// Add a new bottle with a unique ID, message, date, and view count to availableBottles
const addBottle = (message) => {
  const bottle = {
    id: _.uniqueId('bottle_'),
    message,
    date: new Date(),
    views: 0, // Initial view count
  };
  availableBottles.push(bottle);
  return bottle;
};

/**
 * Retrieves a bottle's information based on its ID.
 * This function is primarily used for administrative purposes:
 *  - Can access bottles even if they're under review or archived.
 *  - Does not increment the view count of the retrieved bottle.
 *
 * @param {string} id - The ID of the bottle to fetch.
 * @param {boolean} includeArchived - Whether to search within archived bottles.
 * @return {Object|null} The found bottle object, or null if not found.
 */

const fetchBottleById = (id, includeArchived = false) => {
  let result = _.findWhere(availableBottles, { id }) || _.findWhere(inReviewBottles, { id });
  if (includeArchived && !result) {
    result = _.findWhere(archivedBottles, { id });
  }
  return result;
};

// Fetch a random bottle from availableBottles and move to viewedBottles
const fetchRandomBottle = (modifyData = true) => {
  const fetchedBottle = _.sample(availableBottles);
  if (fetchedBottle && modifyData) {
    fetchedBottle.views += 1;
    inReviewBottles.push(fetchedBottle);
    availableBottles = _.without(availableBottles, fetchedBottle);
  }
  return fetchedBottle;
};

// Move a specific bottle from viewedBottles to availableBottles
const discardBottle = (bottleOrId) => {
  const bottle = typeof bottleOrId === 'object' ? bottleOrId : _.findWhere(inReviewBottles, { id: bottleOrId });

  if (bottle) {
    availableBottles.push(bottle);
    inReviewBottles = _.without(inReviewBottles, bottle);
    // Clear the tracked idle time
    delete bottleIdleTimes[bottle.id];
  }
  return bottle;
};

// Move a specific bottle from viewedBottles to archivedBottles
const destroyBottle = (id) => {
  const bottle = _.findWhere(inReviewBottles, { id });
  if (bottle) {
    archivedBottles.push(bottle);
    inReviewBottles = _.without(inReviewBottles, bottle);
  }
  return bottle;
};

const isBottleTimedOut = (id) => {
  // Bottle not found (undefined) or invalid idle time (null)
  if (bottleIdleTimes[id] == null) {
    return null;
  }
  return bottleIdleTimes[id] > reviewTimeout;
};

const getBottleStatus = (id) => {
  let bottle = _.findWhere(availableBottles, { id });
  if (bottle) {
    return { status: BottleStatus.Available, bottle };
  }

  bottle = _.findWhere(inReviewBottles, { id });
  if (bottle) {
    return { status: BottleStatus.InReview, bottle };
  }

  bottle = _.findWhere(archivedBottles, { id });
  if (bottle) {
    return { status: BottleStatus.Archived, bottle };
  }

  return { status: BottleStatus.NotFound, bottle: null };
};

// Updates the idle time for each bottle and discards those that have timed out
const update = (deltaTime) => {
  // Collect IDs of bottles that need to be discarded due to timeout
  const bottlesToDiscard = [];

  // Update the idle time for each bottle in review
  inReviewBottles.forEach((bottle) => {
    const { id } = bottle;
    bottleIdleTimes[id] = (bottleIdleTimes[id] || 0) + deltaTime;

    // If the bottle has been idle for too long, add it to the discard list
    if (isBottleTimedOut(id) === true) {
      bottlesToDiscard.push(bottle);
    }
  });

  // Process and discard the timed-out bottles
  bottlesToDiscard.forEach((bottle) => {
    discardBottle(bottle);
  });
};

module.exports = {
  BottleStatus,
  addBottle,
  fetchBottleById,
  fetchRandomBottle,
  discardBottle,
  destroyBottle,
  getBottleStatus,
  update,
};
