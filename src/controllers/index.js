var express = require('express');
const Directory = require('../models/directory');
var router = express.Router();

/* GET home page. */
router.get('/library', async function(req, res, next) {
    try {
        const result = await Directory.find({ parentId: "root" });
        // res.send(result);
        res.render('index', { title: 'Express', result });
    } catch (error) {
        res.status(400).send(error);
    }

});

router.get('/', async function(req, res, next) {
    res.render('main');
})

module.exports = router;