var express = require('express');
var router = express.Router();

// if(method === 'GET' && req.path === '/') 等价于
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
