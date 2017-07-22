const express = require('express');
voteRouter = express.Router();
//bring in models
// let Vote = require('../models/vote');



voteRouter.get('/api/castVote',
  function (req, res) {
    new Connection(config)
      .on('connect',
      function () {
        slash_votes(
          this,
          "INSERT INTO Votes (id,alias) SELECT " + req.query.id + ",'" + req.query.alias + "'  WHERE NOT EXISTS (SELECT * FROM Votes WHERE id=" + req.query.id + " AND alias='" + req.query.alias + "')",//Todo: SQL Injection Fix
          res,
          req
        );
      });
  });

  
// voteRouter.get('/votesforuser',(req,res)=>{
//   console.log('here');
//   let query = {alias:req.query.alias}
//   Vote.find(query,function(err,votes){
//     res.render('index',{title:'Your Votes',votes:votes});
//   });
// });

// voteRouter.get('/',(req,res)=>{
//   console.log('here');
//   let vote = new Vote();
//   vote.projectId = req.query.id;
//   vote.alias = req.query.alias;
//   vote.projectName = req.query.projectName;
//   let query = {projectId:req.query.id,alias:req.query.alias}
//   Vote.find(query,function(err,projects){
//     if(projects.length == 0){
//       vote.save((err)=>{
//         if(err){
//           console.log(err);
//           res.redirect('votes/votesforuser?alias='+req.query.alias);
//         }
//         else{
//           console.log('/votesforuser?alias='+req.query.alias);
//           res.redirect('votes/votesforuser?alias='+req.query.alias);
//         }
//       });
//     }else{
//       //Already voted
//       console.log('Already voted');
//       res.redirect('votes/votesforuser?alias='+req.query.alias);
//     }
//   });
// });


module.exports = voteRouter;
