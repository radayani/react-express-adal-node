var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {

  res.json(
    [
      { "key": "BloodConnect", "label": "Blood Connect", "desc": "fnocidsnvoifsdnvoi" },
      { "key": "BloodForSure", "label": "Blood For Sure", "desc": "dskvjfdszovfsd" },
      { "key": "DonateBlood", "label": "Donate Blood", "desc": "dsgfdjpvodmp" }
    ]
  );
  
});

module.exports = router;