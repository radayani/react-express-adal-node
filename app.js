var express = require('express');

var fs = require('fs');
var crypto = require('crypto');
var AuthenticationContext = require('adal-node').AuthenticationContext;
// var router = require('react-router-dom');

var path = require('path');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
var session = require('cookie-session');
var cors = require('cors')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static')


//Db
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config =
  {
    userName: 'sciencefair', // update me
    password: 'oneweek@123', // update me
    server: 'sfdbserver.database.windows.net', // update me
    options:
    {
      database: 'sfdbppe' //update me
      , encrypt: true
      , rowCollectionOnRequestCompletion: true
    }
  }



// var login = require('./routes/login');
var index = require('./routes/index');
var votedProjects = require('./routes/votedProjects');
var registeredProjects = require('./routes/registeredProjects');


var app = express();
var router = express.Router();

router.use(cors());

// server side view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// // Express only serves static assets in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("react-client/build"));
// }

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(serveStatic('D:\home\site\wwwroot\public' ));
// app.get('/', function(req, res){
//   res.redirect('/user');
// });
app.use(cors());


//Session middleware
app.use(session({
  secret: 'keybord cat',
  resave: true,
  saveUninitialized: true
}));
//Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});





//Message validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));



var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE'];

var sampleParameters;
if (parametersFile) {
  var jsonFile = fs.readFileSync(parametersFile);
  if (jsonFile) {
    sampleParameters = JSON.parse(jsonFile);
  } else {
    console.log('File not found, falling back to defaults: ' + parametersFile);
  }
}

if (!parametersFile) {
  sampleParameters = {
    tenant: 'microsoft.onmicrosoft.com',
    authorityHostUrl: 'https://login.windows.net',
    clientId: '4c167cf7-fef1-4fe8-a9f9-e032b5335375',
    username: '',
    password: '',
    clientSecret: 'zV61AJ15m7J5n877HnrBmPyEFoEuztc8q1H+RZJOG64='
  };
}

var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
var redirectUri = 'http://sfvotes.azurewebsites.net/getAToken';
// var redirectUri = 'http://localhost:3002/getAToken';
var resource = '00000002-0000-0000-c000-000000000000';

var templateAuthzUrl = 'https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>&state=<state>&resource=<resource>';


function createAuthorizationUrl(state) {
  var authorizationUrl = templateAuthzUrl.replace('<client_id>', sampleParameters.clientId);
  authorizationUrl = authorizationUrl.replace('<redirect_uri>', redirectUri);
  authorizationUrl = authorizationUrl.replace('<state>', state);
  authorizationUrl = authorizationUrl.replace('<resource>', resource);
  return authorizationUrl;
}

app.get('/api/login', function (req, res) {
  console.log("hi");
  crypto.randomBytes(48, function (ex, buf) {
    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

    res.cookie('authstate', token);
    var authorizationUrl = createAuthorizationUrl(token);

    res.redirect(authorizationUrl);
  });
});



app.get('/getAToken', function (req, res) {
  if (req.cookies.authstate !== req.query.state) {
    res.send('error: state does not match');
  }
  var authenticationContext = new AuthenticationContext(authorityUrl);
  authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, resource, sampleParameters.clientId, sampleParameters.clientSecret, function (err, response) {
    var alias = response.userId.substring(0, response.userId.indexOf('@'));
    var message = '';
    if (err) {
      message = 'error: ' + err.message + '\n';
    }
    message += 'response: ' + JSON.stringify(response);

    res.cookie('access_token', response.accessToken);
    res.cookie('alias', alias);
    if (err) {
      // window.location.replace(`http://sfvotes.azurewebistes.net/user/${alias}/register`);
      // res.redirect(`/user/radayani/register`);
      res.redirect(`/user/${alias}/register`);
      
      // res.redirect(`http://sfvotes.azurewebistes.net/user/${alias}/register`);
      return;
    }

    // Later, if the access token is expired it can be refreshed.
    authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, sampleParameters.clientId, sampleParameters.clientSecret, resource, function (refreshErr, refreshResponse) {
      if (refreshErr) {
        message += 'refreshError: ' + refreshErr.message + '\n';
      }
      message += 'refreshResponse: ' + JSON.stringify(refreshResponse);
      // window.location.replace(`http://sfvotes.azurewebistes.net/user/${alias}/register`);
      // res.redirect(`/user/radayani/register`);
      
      res.redirect(`/user/${alias}/register`);
    });
  }
  );
});

app.get(`/user/${alias}/register`, function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
});

// app.get('http://sfvotes.azurewebsites.net/getAToken?code=:x',function(req,res){
// res.redirect(`/user`);
// }) 
 



// Simple route middleware to ensure user is authenticated. (section 4)

//   Use this route middleware on any resource that needs to be protected. If
//   the request is authenticated (typically via a persistent sign-in session),
//   the request proceeds. Otherwise, the user is redirected to the
//   sign-in page.
// function ensureAuthenticated(req, res, next) {
//   console.log(app.get('access_token'));
//   // if (req.isAuthenticated()) { return next(); }
//   // res.redirect('/login')
//   if(app.get('access_token'))
//     return next();
// }



//Routes
function execNonQuery(connection, sqlQuery) {
  connection.execSql(new Request(sqlQuery).then(function () { res.send('ok') }));
}
function execDataSet(connection, sqlQuery) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        var result = [];
        for (var r = 0; r < rows.length; r++) {
          var item = {};
          for (var c = 0; c < rows[r].length; c++) {
            item[rows[r][c].metadata.colName] = rows[r][c].value.toString();
          }
          result.push(item);
        }
        connection.close();
      }).then(function () {
        res.contentType('application/json');
        res.send(JSON.stringify(result));

      })
  );
};



// app.use('/login',login);




// app.get('/api/votedProjects', (req, res) => {
//   new Connection(config)
//     .on('connect',
//     function () {
//       slash_votesforuser(
//         this,
//         "SELECT v.id,p.title, p.tagline, p.description FROM Votes v INNER JOIN Projects p ON v.id = p.id WHERE v.alias = '" + req.query.alias + "'",//Todo: SQL Injection Fix
//         res
//       );
//     });
// });
function slash_votesforuser(connection, sqlQuery, res) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        var result = [];
        for (var r = 0; r < rows.length; r++) {
          console.log('*********RowStart************');
          var item = {};
          for (var c = 0; c < rows[r].length; c++) {
            item[rows[r][c].metadata.colName] = rows[r][c].value.toString();
            console.log(rows[r][c].metadata.colName);
            console.log(rows[r][c].value);
          }
          result.push(item);
          console.log('*********RowEnd************');
        }
        res.json(result);
        //  res.render('index',{pageTitle:'Your Votes',votes:result});
        connection.close();
      })
  ); // end execSql
}; // end slash


app.get('/api/fetchProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser(
        this,
        "SELECT id,title FROM Projects WHERE title like '%" + req.query.filter + "%'",//Todo: SQL Injection Fix
        res
      );
    });
});

app.get('/api/getMyUnRegProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser( //TODO:change function name
        this,
        "SELECT P.id,P.title AS name FROM Projects P INNER JOIN ProjectMembers PM ON P.id = PM.project_id LEFT OUTER JOIN Registration R ON P.id = R.project_id WHERE PM.alias like '%" + req.query.alias + "%' AND R.project_id IS NULL",//Todo: SQL Injection Fix
        res
      );
    });
});


app.get('/api/fetchAllRegistrationProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_votesforuser(
        this,
        "SELECT id,project_id FROM ProjectMembers WHERE alias like '%" + req.query.alias + "%'",//Todo: SQL Injection Fix
        res
      );
    });
});

app.get('/api/castVote',
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
function slash_votes(connection, sqlQuery, res, req) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        connection.close();
        res.status(200).send("Vote Saved Successfully!");
        //res.redirect('votes/votesforuser?alias='+req.query.alias);
      }
    )
  ); // end execSql
};




app.get('/api/projectDescription', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_description(
        this,
        "SELECT description FROM Projects WHERE id = " + req.query.id + "",//Todo: SQL Injection Fix
        res
      );
    });
});
function slash_description(connection, sqlQuery, res) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        var item = {}; {
          item = rows[0][0].value.toString();
          console.log(item);
        }
        res.json(item);
        connection.close();

      })
  ); // end execSql
}; // end slash 





app.get('/api/savePin',
  function (req, res) {
    new Connection(config)
      .on('connect',
      function () {
        slash_votes(
          this,
          "INSERT INTO UniquePin (alias,unique_pin) SELECT '" + req.query.alias + "','" + req.query.UniquePin + "'  WHERE NOT EXISTS (SELECT * FROM UniquePin WHERE alias='" + req.query.alias + "')",//Todo: SQL Injection Fix
          res,
          req
        );
      });
  });




app.get('/api/getPin', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      slash_pin(
        this,
        "SELECT unique_pin FROM UniquePin WHERE alias like '%" + req.query.alias + "%'",//Todo: SQL Injection Fix
        res
      );
    });
});
function slash_pin(connection, sqlQuery, res) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        var item = "";
        {
          if (rows[0] == undefined) {
            res.status(400).send("Pin Not Found");
          }
          else {
            item = rows[0][0].value.toString();
          }
        }
        res.json(item);
        connection.close();
      })
  ); // end execSql
};



// app.get('/api/getRegisteredProjects', (req, res) => {

//   new Connection(config)

//     .on('connect',
//     function () {
//       slash_votesforuser(
//         this,
//         "SELECT r.project_id, p.title, p.tagline, p.description FROM Registration r INNER JOIN Projects p ON r.Project_id =p.id WHERE r.alias like '%" + req.query.alias + "%'",//Todo: SQL Injection Fix
//         res
//       );
//     });
// });


function execNonQueryNew(connection, sqlQuery, res) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        if (err) {
          res.status(500).send({ status: 500 });
        }
        else if (sqlQuery == null) {
          res.status(500).send({ status: 500 });
        }
        else {
          res.status(200).send({ status: 200 });
        }
        connection.close();
      }
    )
  );
};


app.post('/api/registerProject',
  function (req, res) {
    console.log(req.body);
    var projects = req.body.projects;
    var venue_id = req.body.venue_id;
    console.log(projects);
    //var sessionValue = req.session.authInfo;
    //var authString = JSON.stringify(sessionValue);
    var sessionValue = req.session.authInfo;
    console.log("sessionValue: " + sessionValue);
    var authString = JSON.stringify(sessionValue);
    console.log("authString: " + authString);
    var userID = sessionValue.userId;
    console.log("userID: " + userID);
    var alias = req.body.alias;
    console.log('registerprojects:' + alias);
    var sql = "INSERT INTO Registration (project_id,alias,venue_id) SELECT " + projects + " , '" + alias + "', '" + venue_id + "' WHERE NOT EXISTS (SELECT * FROM Registration WHERE alias='" + alias + "' AND project_id=" + projects + "); "
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



// // app.use('/', index);
// // app.use('/users', users);
app.use('/api/votedProjects', votedProjects);
app.use('/api/getRegisteredProjects', registeredProjects);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, () => { console.log('Server started on port 3000') });
module.exports = app;

