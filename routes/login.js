

var express = require('express');
var loginRouter = express.Router();
var cors = require('cors');

var fs = require('fs');
var crypto = require('crypto');
var AuthenticationContext = require('adal-node').AuthenticationContext;

loginRouter.use(cors());



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
  console.log("hi");
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



module.exports = loginRouter;