const express = require("express");
const router = express.Router();

router.get("/skapainlagg", (req, res) => {
    res.render("skapainlagg");
});

module.exports = router;
