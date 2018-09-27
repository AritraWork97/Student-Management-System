const mongoose = require('mongoose');



mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost:27017/User').then(function () {
    console.log("Database successfully connected");
}, function (e) {
    console.log("Error connecting to database ", e);
});

module.exports = mongoose;