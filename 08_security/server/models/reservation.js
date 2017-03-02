'use strict';

module.exports = function(Reservation) {
  Reservation.validate('startDate', dateValidator, {message: 'endDate should be after startDate'});
  function dateValidator(err) {
    if(this.startDate >= this.endDate) {
      err();
    }
  }
};
