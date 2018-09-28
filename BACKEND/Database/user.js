const mongoose = require('../config/dbconfig');
const Crypto = require('crypto').default;
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;


var userSchema = new Schema({
    name : {
        type : String,
        required : true,
        minlength : 2,
        trim : true
    },
    stream : {
        type : String,
        required : true
    },
    enrollment_number : {
        type : String,
        required : true,
        unique : true,
        minlength : 16
    },
    subjects : [{
        type :Schema.ObjectId,
        ref : 'SubjectDB'
    }],
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }],
    hash : String,
    salt : String
});

userSchema.methods.setPassword = function (password) {
    this.salt = Crypto.randomBytes(16).toString('hex');
    this.hash = Crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = Crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function () {
    var user = this;
    var access = 'auth';

    var token = jwt.sign({
        _id : user._id.toHexString(),
        access
    },"*Za1Mai7ebZt!I$KOl6OrwF!mklnoiG8A!b1q0YXsBNK#d9O#m6lEidF^*MP8zls@*").toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return token;
};

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, '*Za1Mai7ebZt!I$KOl6OrwF!mklnoiG8A!b1q0YXsBNK#d9O#m6lEidF^*MP8zls@*')
    } catch (e) {

    }
    return decoded;
}


var User = mongoose.model('User', userSchema);



module.exports = User;

