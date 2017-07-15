const express = require('express');
router = express.Router();
//bring in models
let Article = require('../models/article');
//Get single articles

//edit
router.get('/edit/:id',(req,res)=>{
  console.log(req.params.id)
  Article.findById(req.params.id,(err,article)=>{
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

router.post('/edit/:id',(req,res)=>{
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}
  Article.update(query,article,(err)=>{
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success','Article updated');
      res.redirect('/');
    }
  });
});

//Add route
router.get('/add', (req,res)=>{
  res.render('add_article',{title:'Add Articles'});
});

router.post('/add',(req,res)=>{
req.checkBody('title', 'Title is required').notEmpty();
req.checkBody('author', 'Author is required').notEmpty();
req.checkBody('body', 'Body is required').notEmpty();
let errors = req.validationErrors();
if(errors){
  res.render('add_article',{
    title:'Add Article',
    errors:errors
  });
}else{
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body
  article.save((err)=>{
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success','Article added');
      res.redirect('/');
    }
  });
}
});
//delete-article
router.delete('/:id',(req,res)=>{
//console.log('hfgfghf');
  let query = {_id:req.params.id}
  Article.remove(query, (err)=>{
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

router.get('/:id',(req,res)=>{
  console.log('hfgfghf');
  Article.findById(req.params.id,(err,article)=>{
    //console.log(req.params.id);
    res.render('article',{article:article});
  })
});

module.exports = router;
