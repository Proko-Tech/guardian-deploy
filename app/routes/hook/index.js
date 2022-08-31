const express = require('express');
const router = new express.Router();

router.get('/github', async function(req, res) {
  return res.status(200).json({status: 'success'});
});

module.exports = router;
