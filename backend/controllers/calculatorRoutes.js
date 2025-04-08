const express = require("express");
const calculatorController = require("../controllers/calculatorController");

const router = express.Router();

router.post("/", calculatorController.saveCalculation);
router.get("/", calculatorController.getCalculation);

module.exports = router;
