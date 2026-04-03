const Offer = require("../models/Offer");

const calculateBestReward = async (amount, restaurantId) => {
  const now = new Date();
  const offers = await Offer.find({
    restaurantId,
    isActive: true
  });

  let bestReward = 0;
  let bestOffer = null;

  for (let offer of offers) {
    const startsAt = offer.validFrom ? new Date(offer.validFrom) : null;
    const endsAt = offer.validTo ? new Date(offer.validTo) : null;

    // Legacy offers without date window should still work.
    if (startsAt && now < startsAt) {
      continue;
    }

    if (endsAt && now > endsAt) {
      continue;
    }

    // check eligibility
    if (amount >= offer.minAmount) {
      let reward = 0;

      // flat cashback
      if (offer.cashback) {
        reward = offer.cashback;
      }

      // percentage cashback
      if (offer.percentage) {
        reward = (amount * offer.percentage) / 100;

        // apply max cap
        if (offer.maxCap) {
          reward = Math.min(reward, offer.maxCap);
        }
      }

      // choose best
      if (reward > bestReward) {
        bestReward = reward;
        bestOffer = offer;
      }
    }
  }

  return { bestReward, bestOffer };
};

module.exports = { calculateBestReward };