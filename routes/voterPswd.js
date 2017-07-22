const express = require('express');
projectRouter = express.Router();
//bring in models
// let Project = require('../models/project');
var cors = require('cors');


router.get('/', function (req, res) {
    new Connection(config).on('connect', function () {
        slash_pin(
            this,
            "SELECT unique_pin FROM UniquePin WHERE alias like '%" + req.query.alias + "%'",//Todo: SQL Injection Fix
            res
        );

    });
});





router.post('/', function (req, res) {
    var alias = req.body.alias;
    var uniquePin = req.body.unique_pin;
    if (uniquePin != undefined && alias != undefined) {
        var sql = "INSERT INTO UniquePin (alias,unique_pin) SELECT '" + alias + "','" + uniquePin + "'  WHERE NOT EXISTS (SELECT * FROM UniquePin WHERE alias='" + alias + "')";
    }
    new Connection(config).on('connect', function () {
        execNonQueryNew(
            this,
            sql,
            res
        );
    });
});
