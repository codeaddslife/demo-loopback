'use strict';

module.exports = function(Campground) {
  Campground.validatesLengthOf('name', {max: 100, message: {max: 'Name is too long'}});
};
