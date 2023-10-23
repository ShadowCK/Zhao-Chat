const _ = require('underscore');

// Data structures to hold the drift bottles
let availableBottles = [];
let inReviewBottles = [];
const archivedBottles = [];

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
const discardBottle = (id) => {
  const bottle = _.findWhere(inReviewBottles, { id });
  if (bottle) {
    availableBottles.push(bottle);
    inReviewBottles = _.without(inReviewBottles, bottle);
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

module.exports = {
  addBottle,
  fetchBottleById,
  fetchRandomBottle,
  discardBottle,
  destroyBottle,
};
