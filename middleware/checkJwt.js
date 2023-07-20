const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require('jwks-rsa');

// Auth0 configuration
const authConfig = {
  domain: 'dev-itoeosdt8oc3bfhx.us.auth0.com',
  audience: 'rjJg9KPsvm8On9DVRNsJ1PiagN2AZ74N',
};

// Check JWT middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

module.exports = checkJwt;
