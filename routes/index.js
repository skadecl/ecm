var express = require('express'),
    router  = express.Router();

//Controllers (router) BEGIN :::::
router.use('/api',
  require('./sessions'),
  require('./users'),
  require('./workers'),
  require('./housing'),
  require('./items'),
  require('./issues'),
  require('./feeding'),
  require('./feeding_days'),
  require('./transport')
);
router.use('/api/utils', require('./utils'));
//Controllers (router) END :::::

/* GET home page. */
router.get('/panel', function(req, res, next) {
  res.render('panel');
});

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
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
