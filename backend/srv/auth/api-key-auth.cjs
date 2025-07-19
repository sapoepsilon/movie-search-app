const cds = require('@sap/cds')

module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key']
  const validKeys = process.env.API_KEYS?.split(',').map(key => key.trim()).filter(Boolean) || []
  
  if (apiKey && validKeys.includes(apiKey)) {
    cds.context.user = new cds.User({
      id: 'api-user',
      roles: ['ApiKeyUser'],
      attr: { 
        apiKey: true,
        keyUsed: apiKey
      }
    })
  } else {
    cds.context.user = cds.User.anonymous
  }
  
  next()
}