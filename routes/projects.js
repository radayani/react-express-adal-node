const express = require('express');
projectRouter = express.Router();
//bring in models
let Project = require('../models/project');
//Search home
projectRouter.get('/search',(req,res)=>{
    res.render('search');
});

//Search
projectRouter.get('/find',(req,res)=>{
  Project.find(
      { "name": { "$regex": req.query.term, "$options": "i" } },
      function(err,projects) {
        var prjs = [];
        projects.forEach(function(item){
            prjs.push({id: item._id, label: item.name, value: item.name});
        });
        res.contentType('application/json');
        res.send(JSON.stringify(prjs));
      }
  );
});

//Get
projectRouter.get('/:id',(req,res)=>{
  Project.findById(req.params.id,(err,project)=>{
    //console.log(req.params.id);
    res.render('project',{project:project});
  })
});


module.exports = projectRouter;
