var express = require('express');
const {makePdfJson} = require("../utils");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  const forJson = await makePdfJson('21', '40')
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(forJson, null, 3));
});

module.exports = router;
