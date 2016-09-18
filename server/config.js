var oauth = require('oauth');
require('dotenv').config({silent: true});

var clientId = process.env.MOVES_CLIENT_ID;
var clientSecret = process.env.MOVES_CLIENT_SECRET;

var oauth2 = new oauth.OAuth2(
  clientId,
  clientSecret,
  'https://api.moves-app.com/',
  null,
  'oauth/v1/access_token',
  null);

module.exports = {
  oauth: oauth2
}
