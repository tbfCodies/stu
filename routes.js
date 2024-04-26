
const express = require('express');
const router = express.Router();

router.get('/skapainlagg', (req, res) => {
  res.render('skapainlagg');
});

// Route för "Hem"
router.get('/index', (req, res) => {
  res.render('index'); 
});

module.exports = router;
