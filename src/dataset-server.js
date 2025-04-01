const twilio = require('twilio')
const Router = require('express').Router
const ivrRouter = require('./ivr/router')
const fs = require('fs')
const path = require('path')

const router = new Router()

// Load dataset files
const trainData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'medical_dataset_train.json'), 'utf8'));
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'medical_dataset_test.json'), 'utf8'));

router.get('/', async (req, res) => {
    res.send('Voiceflow Twilio Integration is up and running')
})

// Dataset API routes
router.get('/api/medical/search', (req, res) => {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const trainresults = trainData.filter(item =>
        item.input.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    const testresults = testData.filter(item =>
        item.input.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);

    res.json({ trainresults, testresults });
});

router.get('/api/trainmedical/item/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= trainData.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    res.json({ item: trainData[index] });
});
router.get('/api/testmedical/item/:index', (req, res) => {
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= testData.length) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    res.json({ item: testData[index] });
});

router.get('/api/trainmedical/list', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 31;

    const items = trainData.slice(offset, offset + limit);

    res.json({
        total: trainData.length,
        offset,
        limit,
        items
    });
});
router.get('/api/testmedical/list', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 21;

    const items = testData.slice(offset, offset + limit);

    res.json({
        total: testData.length,
        offset,
        limit,
        items
    });
});

router.use('/ivr', twilio.webhook({ validate: false }), ivrRouter)

module.exports = router