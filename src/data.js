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
};

const fetchBottleById = (id) => {
  const result = _.findWhere(availableBottles, { id }) || _.findWhere(inReviewBottles, { id });
  return result;
};

// Fetch a random bottle from availableBottles and move to viewedBottles
const fetchRandomBottle = () => {
  const fetchedBottle = _.sample(availableBottles);
  if (fetchedBottle) {
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
