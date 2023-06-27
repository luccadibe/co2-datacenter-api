var express = require("express");
var router = express.Router();
var { getDataByZone } = require("../controllers/get-data-by-zone");
const { getBestZone } = require("../controllers/get-best-zone");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/getDataByZone/:zone", getDataByZone);

router.get("/getBestZone/:timespan", getBestZone);
module.exports = router;
