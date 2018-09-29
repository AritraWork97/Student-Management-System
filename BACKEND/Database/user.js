const mongoose = require('../config/dbconfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    password : {
        type : String,
        required : true
    }
});



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

userSchema.methods.removeToken = function (token) {
    var user = this;
    return user.updateOne({
        $pull : {
            'tokens' : {
                token : token
            }
        }
    });
};

userSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, '*Za1Mai7ebZt!I$KOl6OrwF!mklnoiG8A!b1q0YXsBNK#d9O#m6lEidF^*MP8zls@*')
    } catch (e) {
        return e;
        }
    return decoded;
};

userSchema.statics.findBYCredentials = function (enrollment_number, password) {
    var user = this;
    return user.findOne({enrollment_number}).then((user) => {
        if(!user) {
            return Promise.reject();
        } else {
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if(res) {
                        resolve(user);
                    } else {
                        reject();
                    }
                })
            })
        }
    })
};


userSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});


var User = mongoose.model('User', userSchema);



module.exports = User;

