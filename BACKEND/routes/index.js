var express = require('express');
var router = express.Router();
const Promise = require('bluebird');

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

  var token = newUser.generateJWT();

  Promise.all([newUser.save(), newSubject.save()]).then(function (user) {
      res.header('x-auth', token).send(user);
  });
});

router.get('/profile', function (req, res) {
   var token = req.header('x-auth');
   var decoded = User.findByToken(token);
   User.findOne({
       _id : decoded._id,
       'tokens.token' : token,
       'tokens.access' : 'auth'
   }).then(function (user) {
       if(!user) {
            res.status(404).send();
       } else {
           console.log(user);
           res.send(user);
       }

   })
});





module.exports = router;
