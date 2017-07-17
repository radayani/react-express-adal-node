var express = require('express');
var router = express.Router();
var cors = require('cors');

router.use(cors());

router.get('/', function (req, res, next) {
    
    res.json(
        [
            { key: "ProvideBlood", label: "Provide Blood", desc: "saicnxsoincoisdc", registered: true },
            { key: "SureCan", label: "Sure Can", desc: "sdifbcosdinco", registered: true },
            { key: "ConnectPeople", label: "Connect People", desc: "eivndoifvn", registered: false },
            { key: "PeopleFinder", label: "People Finder", desc: "wefcmedcv", registered: false },
            { key: "LovePeople", label: "Love People", desc: "wfceiov", registered: false }
        ]
    );

});

module.exports = router;