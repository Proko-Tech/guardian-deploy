const express = require('express');
const router = new express.Router();

router.get('/', async function(req, res) {
  return res.status(200).json({status: 'success'});
});

module.exports = router;
