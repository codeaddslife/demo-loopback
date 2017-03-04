'use strict';

module.exports = function(Reservation) {
  Reservation.validate('startDate', dateValidator, {message: 'endDate should be after startDate'});
  function dateValidator(err) {
    if (this.startDate >= this.endDate) {
      err();
    }
  }

  Reservation.observe('after save', function(ctx, next) {
    Reservation.app.models.Campground.findById(ctx.instance.campgroundId, function(err, campground) {
      Reservation.app.models.Email.send({
        to: 'andy.vandenheuvel@gmail.com',
        from: 'noreply@optis.be',
        subject: 'Thank you for your reservation at ' + campground.name,
        html: '<p>We confirm your reservation for <strong>' + campground.name + '</strong></p>',
      }, function(err, mail) {
        console.log('email sent!' + err);
      });
    });
    next();
  });
};
