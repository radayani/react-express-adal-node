const express = require('express');
projectRouter = express.Router();
//bring in models
// let Project = require('../models/project');
var cors = require('cors');

projectRouter.use(cors());




projectRouter.get('/api/fetchAllRegistrationProjects', (req, res) => {
  new Connection(config).on('connect',function () {
      slash_votesforuser(
        this,
        "SELECT id,project_id FROM ProjectMembers WHERE alias like '%" + req.query.alias + "%'",//Todo: SQL Injection Fix
        res
      );
    });
});



projectRouter.get('/api/getMyUnRegProjects', (req, res) => {
  new Connection(config).on('connect', function () {
    slash_votesforuser( //TODO:change function name
      this,
      "SELECT P.id,P.title AS name FROM Projects P INNER JOIN ProjectMembers PM ON P.id = PM.project_id LEFT OUTER JOIN Registration R ON P.id = R.project_id WHERE PM.alias like '%" + req.query.alias + "%' AND R.project_id IS NULL",//Todo: SQL Injection Fix
      res
    );
  });
});



projectRouter.get('/api/getRegisteredProjects', function (req, res, next) {
  new Connection(config).on('connect', function () {
    slash_votesforuser(
      this,
      "select pm.project_id, p.title,p.description,v.venue ,v.Location from ProjectMembers pm INNER JOIN Projects p on p.id=pm.project_id INNER JOIN Registration r on pm.project_id=r.project_id INNER JOIN venue v on r.venue_id = v.id where pm.alias like '%" + req.query.alias + "%'",
      res
    );
  });
});



projectRouter.get('/api/fetchProjects', (req, res) => {
  new Connection(config).on('connect', function () {
    slash_votesforuser(
      this,
      "SELECT id,title FROM Projects WHERE title like '%" + req.query.filter + "%'",//Todo: SQL Injection Fix
      res
    );
  });
});



router.post('/api/registerProject', function (req, res, next) {

    console.log(req.body);
    var projects = req.body.projects;
    var venue_id = req.body.venue_id;
    console.log(projects);
    // var sessionValue = req.session.authInfo;
    // console.log("sessionValue: " + sessionValue);
    // var authString = JSON.stringify(sessionValue);
    // console.log("authString: " + authString);
    // var userID = sessionValue.userId;
    // console.log("userID: " + userID);
    var alias = req.body.alias;
    console.log('registerprojects:' + alias);
    var sql = "IF NOT EXISTS (SELECT * FROM Registration WHERE alias='" + alias + "' AND project_id=" + projects + ")BEGIN INSERT INTO Registration (project_id,alias,venue_id) SELECT " + projects + ", '" + alias + "', " + venue_id + " ; Update venue set AllocatedBooths=AllocatedBooths+1 where Id=" + venue_id + "; END"
    new Connection(config)
      .on('connect',
      function () {
        execNonQueryNew(
          this,
          sql,
          res
        );
      });
  });


projectRouter.get('/api/votedProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser(
        this,
        "SELECT v.id,p.title, p.tagline, p.description FROM Votes v INNER JOIN Projects p ON v.id = p.id WHERE v.alias = '" + req.query.alias + "'",//Todo: SQL Injection Fix
        res
      );
    });
});


projectRouter.get('/api/projectDescription', (req, res) => {
    new Connection(config).on('connect', function () {
        slash_description(
            this,
            "SELECT description FROM Projects WHERE id = " + req.query.id + "",//Todo: SQL Injection Fix
            res
        );
    });
});
//Search home
// projectRouter.get('/search',(req,res)=>{
//     res.render('search');
// });

// //Search
// projectRouter.get('/find',(req,res)=>{
//   Project.find(
//       { "name": { "$regex": req.query.term, "$options": "i" } },
//       function(err,projects) {
//         var prjs = [];
//         projects.forEach(function(item){
//             prjs.push({id: item._id, label: item.name, value: item.name});
//         });
//         res.contentType('application/json');
//         res.send(JSON.stringify(prjs));
//       }
//   );
// });

// //Get
// projectRouter.get('/:id',(req,res)=>{
//   Project.findById(req.params.id,(err,project)=>{
//     //console.log(req.params.id);
//     res.render('project',{project:project});
//   })
// });


module.exports = projectRouter;
