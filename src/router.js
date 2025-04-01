const twilio = require('twilio')
const Router = require('express').Router
const dateRouter = require('./dataset-server')
const router = new Router()

router.get('/', async (req, res) => {
  res.send('Voiceflow Twilio Integration is up and running')
})

// router.use('/ivr', twilio.webhook({ validate: false }), ivrRouter)

router.use('/data', twilio.webhook({ validate: false }), dateRouter)

module.exports = router
