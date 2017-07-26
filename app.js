var express = require('express');
const appInsights = require("applicationinsights");
appInsights.setup("75234f11-9d11-442d-bcbe-8a54064621a0")
  .setAutoCollectConsole(true)
  .setAutoDependencyCorrelation(false)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .start();



var fs = require('fs');
var crypto = require('crypto');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var path = require('path');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
var session = require('cookie-session');
var cors = require('cors')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var client = appInsights.getClient("75234f11-9d11-442d-bcbe-8a54064621a0");




//Db
var Connection = require('tedious').Connection;
const DEFAULT_CONNECT_RETRY_INTERVAL = 1000;
var Request = require('tedious').Request;
var config =
  {
    userName: 'sciencefair',
    password: 'twoweek@123',
    server: 'sfvoteserver.database.windows.net',
    options:
    {
      database: 'sfvotedb'
      , encrypt: true
      , rowCollectionOnRequestCompletion: true

      , instancename: 'SQLEXPRESS'
      , maxRetriesOnTransientErrors: 5
      , connectionRetryInterval: DEFAULT_CONNECT_RETRY_INTERVAL
      , requestTimeout: 30000
    }
  }



var index = require('./routes/index');


var app = express();


// server side view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(serveStatic('D:\home\site\wwwroot\public'));
app.get('/home/*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.use(cors());


//Session middleware
app.use(session({
  secret: 'keybord cat',
  resave: true,
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



// ENSURE AUTHENTICATED FUNCTION FOR APIs
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


// ADAL LOGIN
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
var redirectUri = 'http://sfvote.azurewebsites.net/getAToken';
// var redirectUri = 'http://localhost:3000/getAToken';
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
  crypto.randomBytes(48, function (ex, buf) {
    var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');

    res.cookie('authstate', token);
    var authorizationUrl = createAuthorizationUrl(token);

    res.redirect(authorizationUrl);
  });
});


var alias = null;
app.get('/getAToken', function (req, res) {
  if (req.cookies.authstate !== req.query.state) {
    res.send('error: state does not match');
  }
  var authenticationContext = new AuthenticationContext(authorityUrl);
  authenticationContext.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, resource, sampleParameters.clientId, sampleParameters.clientSecret, function (err, response) {
    alias = response.userId.substring(0, response.userId.indexOf('@'));
    var message = '';
    if (err) {
      message = 'error: ' + err.message + '\n';
    }
    message += 'response: ' + JSON.stringify(response);

    res.cookie('access_token', response.accessToken);
    res.cookie('alias', alias);
    if (err) {
      res.redirect(`/api/getPin?alias=${alias}`);
      return;
    }

    // Later, if the access token is expired it can be refreshed.
    authenticationContext.acquireTokenWithRefreshToken(response.refreshToken, sampleParameters.clientId, sampleParameters.clientSecret, resource, function (refreshErr, refreshResponse) {
      if (refreshErr) {
        message += 'refreshError: ' + refreshErr.message + '\n';
      }
      message += 'refreshResponse: ' + JSON.stringify(refreshResponse);
      res.redirect(`/api/getPin?alias=${alias}`);
    });
  }
  );
});

// DIRECT TO HOME PAGE AFTER SUCCESSFUL LOGIN
app.get(`/home`, function (req, res) {
  // res.redirect("http://localhost:3001/home");
  res.sendFile(__dirname + '/public/index.html');
});

// ADAL LOGOUT
var logoutAuthzUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://sfvote.websites.net/loginAgain';
// var logoutAuthzUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:3002/api/login';

app.get('/loginAgain', function (req, res) {
  res.redirect('/api/login');
});

app.get('/api/logout', function (req, res) {
  client.trackEvent("Clicked LOGOUT button! Status Code:" + res.statusCode);
  res.redirect(logoutAuthzUrl);
});


// FUNCTIONS
function getRowsOfData(connection, sqlQuery, res) {
  connection.execSql(new Request(sqlQuery, function (err, rowCount, rows) {
    console.log("Success!" + sqlQuery);
    if (rows == null || rows == 'undefined') {
      client.trackException("4xx error: " + err + " Rows not found on call to getRowsOfData(): " + sqlQuery + " RowsCount: " + rowCount);
      res.status(404).send({ status: 404 });
      return;
    } else if (err) {
      client.trackException("5xx error: " + err + " Server Error on call to getRowsOfData(): " + sqlQuery + " RowsCount: " + rowCount);

      res.status(500).send({ status: 500, error: err });
      return;
    }
    else {
      var result = [];
      for (var r = 0; r < rows.length; r++) {

        var item = {};
        for (var c = 0; c < rows[r].length; c++) {
          item[rows[r][c].metadata.colName] = rows[r][c].value.toString();
        }
        result.push(item);
      }
      res.status(200);
      res.json(result);
      client.trackEvent("2xx/3xx: Success/Redirect on call to getRowsOfData(): " + sqlQuery + " RowsCount: " + rowCount + " noOfRecordsReturned: " + result.length);

    }
    connection.close();
  })
  ); // end execSql
};


function getOneRowOfData(connection, sqlQuery, res) {
  connection.execSql(new Request(sqlQuery, function (err, rowCount, rows) {
    if (rows == null || rows == 'undefined') {
      res.status(404).send({ status: 404 });
      client.trackException("4xx error: " + err + "  Row not found on call to getOneRowOfData(): " + sqlQuery + " RowsCount: " + rowCount);

    } else if (err) {
      res.status(500).send({ status: 500, error: err });
      client.trackException("5xx error: " + err + "  Server Error on call to getOneRowOfData(): " + sqlQuery + " RowsCount: " + rowCount);

    }
    else {
      var item = {};
      item = rows[0][0].value.toString();
      res.status(200);
      res.json(item);
      client.trackEvent("2xx/3xx: Success/Redirect on call to getOneRowOfData(): " + sqlQuery + " RowsCount: " + rowCount + " recordReturned: " + item);

    }
    connection.close();

  })
  ); // end execSql
};


function saveRowOfData(connection, sqlQuery, res, req) {
  connection.execSql(new Request(sqlQuery, function (err, rowCount, rows) {
    if (rows == null || rows == 'undefined') {
      res.status(404).send({ status: 404, });
      client.trackException("4xx error: " + err + "   Row not found on call to saveRowOfData(): " + sqlQuery + " RowsCount: " + rowCount);

    } else if (err) {
      res.status(500).send({ status: 500, error: err });
      client.trackException("5xx error: " + err + "   Server Error on call to saveRowOfData(): " + sqlQuery + " RowsCount: " + rowCount);

    }
    else {
      res.status(200).send("Row Saved Successfully! ");
      client.trackEvent("Row saved successfully! Query: " + sqlQuery + " RowsCount: " + rowCount);
    }
    connection.close();

  })
  ); // end execSql
};


function validateFun(connection, sqlQuery, res) {
  connection.execSql(new Request(sqlQuery, function (err, rowCount, rows) {
    var item = "";
    if (rows == null || rows == 'undefined') {
      res.status(404).send({ status: 400, rows: rows[0] });
      client.trackException("4xx error: " + err + " Row not found on call to validateFun(): " + sqlQuery + " RowsCount: " + rowCount);

    } else if (err) {
      res.status(500).send({ status: 500, error: err });
      client.trackException("5xx error: " + err + "   Server Error on call to validateFun(): " + sqlQuery + " RowsCount: " + rowCount);

    }
    else {
      item = rows[0][0].value.toString();
      res.status(200).send(item);
      client.trackEvent("Pin Matched! Query: " + sqlQuery + " RowsCount: " + rowCount);
    }
    connection.close();
  })
  ); // end execSql
};



function getPinAndRedirectToHomePage(connection, sqlQuery, res) {
  connection.execSql(new Request(sqlQuery, function (err, rowCount, rows) {

    if (rows[0] == undefined || rows == null || rows == 'undefined') {
      res.status(404);
      client.trackException("4xx error: " + err + " Row not found on call to getPinAndRedirectToHomePage(): " + sqlQuery + " RowsCount: " + rowCount);

    } else if (err) {
      res.status(500).send({ status: 500, error: err });
      client.trackException("5xx error: " + err + "   Server Error on call to getPinAndRedirectToHomePage(): " + sqlQuery + " RowsCount: " + rowCount);

    }
    else {
      var item = "";
      item = rows[0][0].value.toString();
      res.cookie('myPIN', item);
      res.status(200);
      client.trackEvent("Pin Exists, Redirect to Home! Query: " + sqlQuery + " RowsCount: " + rowCount);

    }
    res.redirect(`/home`);

    connection.close();
  })
  ); // end execSql
};



function execNonQueryNew(connection, sqlQuery, res) {
  connection.execSql(
    new Request(sqlQuery,
      function (err, rowCount, rows) {
        if (err) {
          res.status(500).send({ status: 500, error: err });
          client.trackException("500 error: " + err + " sqlQuery: " + sqlQuery);

        }
        else if (sqlQuery == null) {
          res.status(500).send({ status: 500, sqlQuery: sqlQuery });
          client.trackException("500 error: " + err + " sqlQuery: " + sqlQuery);
        }
        else {
          res.status(200).send({ status: 200 });
          client.trackEvent("Save Query Executed Successfully! Query: " + sqlQuery + " RowsCount: " + rowCount);

        }
        connection.close();
      }
    )
  );
};

//*******GET AVAILABLE VENUE API*********TESTED**//
app.get('/api/getAvailableVenue', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      getRowsOfData(
        this,
        "SELECT distinct venue, MIN(id) as id FROM venue GROUP BY venue",//Todo: SQL Injection Fix
        res
      );
    });
});

//*******GET AVAILABLE LOCATION API*********TESTED**//
app.get('/api/getAvailableLocation', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      getRowsOfData(
        this,
        "SELECT id,venue, Location FROM venue WHERE AllowedBooths>AllocatedBooths and venue like '%" + req.query.venue + "%'", //Todo: SQL Injection Fix
        res
      );
    });
});


//*******GET VOTED PROJECTS API*********TESTED**//
app.get('/api/votedProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      getRowsOfData(
        this,
        "SELECT v.id,p.title, p.tagline, p.description FROM Votes v INNER JOIN Projects p ON v.id = p.id WHERE v.alias = '" + req.query.alias + "'",//Todo: SQL Injection Fix
        res
      );
    });
});

//*******GET PROJECTS TO SEARCH FROM AND VOTE API*********TESTED**    ------------------BUT FIX SQL  --------------//
app.get('/api/fetchProjects', (req, res) => {
  new Connection(config)
    .on('connect',
    function (err) {
      if (err) {
        client.trackException("Error while creating db connection: " + err);
        return;
      }
      getRowsOfData(
        this,
        "SELECT p.id, p.title FROM projects p inner join registration r on r.project_id = p.id where title like '%" + req.query.filter + "%'",//Todo: SQL Injection Fix 

        // "SELECT id,title FROM Projects WHERE title like '%" + req.query.filter + "%'",//Todo: SQL Injection Fix
        res
      );
    });
});

//*******GET UNREGISTERED PROJECTS API*********TESTED**//
app.get('/api/getMyUnRegProjects', (req, res) => {
  new Connection(config).on('connect',
    function () {
      getRowsOfData( //TODO:change function name
        this,
        "SELECT P.id,P.tagline, P.description, P.title AS name FROM Projects P INNER JOIN ProjectMembers PM ON P.id = PM.project_id LEFT OUTER JOIN Registration R ON P.id = R.project_id WHERE PM.alias like '%" + req.query.alias + "%' AND R.project_id IS NULL",//Todo: SQL Injection Fix
        res
      );
    });
});

//*******SAVE VOTE API*********TESTED**//
app.get('/api/castVote', function (req, res) {
  new Connection(config).on('connect',
    function () {
      saveRowOfData(
        this,
        "INSERT INTO Votes (id,alias) SELECT " + req.query.id + ",'" + req.query.alias + "'  WHERE NOT EXISTS (SELECT * FROM Votes WHERE id=" + req.query.id + " AND alias='" + req.query.alias + "')",//Todo: SQL Injection Fix
        res,
        req
      );
    });
});


//*******GET CURRENT PROJECT TITLE API*********TESTED**//
app.get('/api/projectTitle', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      getOneRowOfData(
        this,
        "SELECT title FROM Projects WHERE id = " + req.query.id + "",//Todo: SQL Injection Fix
        res
      );
    });
});


//*******GET CURRENT PROJECT DESCRIPTION API*********TESTED**//
app.get('/api/projectDescription', (req, res) => {
  new Connection(config)
    .on('connect',
    function () {
      getOneRowOfData(
        this,
        "SELECT description FROM Projects WHERE id = " + req.query.id + "",//Todo: SQL Injection Fix
        res
      );
    });
});

//*******SAVE PIN API*********TESTED**//
app.post('/api/savePin', function (req, res) {
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

//*******VALIDATE PIN API*********TESTED**//
app.get('/api/validatePin', (req, res) => {
  new Connection(config).on('connect', function () {
    validateFun(
      this,
      "SELECT COUNT(alias) FROM UniquePin WHERE alias = '" + req.query.alias + "' and unique_pin = '" + req.query.pin + "' ",//Todo: SQL Injection Fix
      res
    );
  });
});


//*******GET PIN API*********TESTED**//
app.get('/api/getPin', (req, res) => {
  new Connection(config).on('connect', function () {
    getPinAndRedirectToHomePage(
      this,
      "SELECT unique_pin FROM UniquePin WHERE alias = '" + req.query.alias + "'",//Todo: SQL Injection Fix
      res
    );
  });
});

//*******GET REGISTERED PROJECTS API*********TESTED**//
app.get('/api/getRegisteredProjects', (req, res) => {

  new Connection(config)

    .on('connect',
    function () {
      try {
        client.trackEvent(new Error("event" + req.query.alias));
        console.log("try console");
        var alias = req.query.alias
        getRowsOfData(
          this,
          "select pm.project_id, p.title,p.tagline, p.description,v.venue ,v.Location from ProjectMembers pm INNER JOIN Projects p on p.id=pm.project_id INNER JOIN Registration r on pm.project_id=r.project_id INNER JOIN venue v on r.venue_id = v.id where pm.alias = '" + req.query.alias + "@microsoft.com'",
          res
        );
      }
      catch (err) {
        client.trackException(new Error("exception " + err));
      }

    });
});



//*******REGISTER A NEW PROJECT FOR A BOOTH API***************//
app.post('/api/registerProject',
  function (req, res) {
    var projects = req.body.projects;
    var venue_id = req.body.venue_id;
    //var sessionValue = req.session.authInfo;
    //var authString = JSON.stringify(sessionValue);
    // var userID = sessionValue.userId;
    var alias = req.body.alias;
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
  }
);


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


app.listen(3002, () => { console.log('Server started on port 3000') });
module.exports = app;