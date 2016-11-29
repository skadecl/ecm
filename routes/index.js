var express = require('express'),
    router  = express.Router();

//Controllers (router) BEGIN :::::
router.use('/api',
  require('./sessions'),
  require('./users'),
  require('./workers')
);
router.use('/api/utils', require('./utils'));
//Controllers (router) END :::::

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('panel');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.end('ECM API');
});

module.exports = router;
