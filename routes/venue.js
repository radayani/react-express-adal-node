
const express = require('express');
venueRouter = express.Router();

venueRouter.get('/api/getAvailableLocation', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser(
        this,
        "SELECT id,venue, Location FROM venue WHERE AllowedBooths>AllocatedBooths and venue like '%" + req.query.venue + "%'", //Todo: SQL Injection Fix
        res
      );
    });
});



venueRouter.get('/api/getAvailableVenue', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser(
        this,
        "SELECT distinct venue, MIN(id) as id FROM venue GROUP BY venue",//Todo: SQL Injection Fix
        res
      );
    });
});

module.exports = venueRouter;
