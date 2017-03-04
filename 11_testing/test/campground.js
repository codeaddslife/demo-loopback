'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server');
var should = chai.should();

chai.use(chaiHttp);

describe('Campgrounds', function() {
  it('should show all campgrounds on GET /api/campgrounds', function(done) {
    chai.request(server)
      .get('/api/campgrounds')
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.lengthOf(4);
        done();
      });
  });

  it('should show only the names of the campgrounds on GET /api/campgrounds?filter[fields][name]=true', function(done) {
    chai.request(server)
      .get('/api/campgrounds?filter[fields][name]=true')
      .end(function(err, res) {
        res.should.have.status(200);
        res.body[0].should.have.property('name');
        res.body[0].should.not.have.property('id');
        done();
      });
  });

  it('should show the first 2 campgrounds on GET /api/campgrounds?filter[limit]=2', function(done) {
    chai.request(server)
      .get('/api/campgrounds?filter[limit]=2')
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.lengthOf(2);
        res.body[0].name.should.equal('Salt Lake City KOA');
        res.body[1].name.should.equal('Gouldings Campground');
        done();
      });
  });

  it('should show the last 2 campgrounds on GET /api/campgrounds?filter[skip]=2&filter[limit]=2', function(done) {
    chai.request(server)
      .get('/api/campgrounds?filter[skip]=2&filter[limit]=2')
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.have.lengthOf(2);
        res.body[0].name.should.equal('Grand Canyon Mather Campground');
        res.body[1].name.should.equal('Camping Paris Bois de Boulogne');
        done();
      });
  });
});
