var express = require('express');
const Promise = require('bluebird');
var router = express.Router();

const User = require('../Database/user');
const Subject = require('../Database/SubjectDB');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res) {
 
  var newUser = new User();
  var newSubject = new Subject();

  newUser.name = req.body.name;
  newUser.stream = req.body.stream;
  newUser.enrollment_number = req.body.enrollment_number;

  newSubject.subjects = req.body.subjects;

  newUser.subjects.push(newSubject);

});



module.exports = router;
