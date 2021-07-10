var express = require('express');
const {makePdfJson} = require("../utils");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  console.log(req.query.start)
  let forJson = { error: 'error'}
  try {

    forJson = await makePdfJson(req.query.start)
  } catch (e) { console.log(e)}
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(forJson, null, 3));
});

module.exports = router;
