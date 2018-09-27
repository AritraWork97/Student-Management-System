var mongoose = require('../config/dbConfig');


var subjectSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    subjects :[{
        subject_name : {
            type : String,
            required : true
        },
        theory : [{
            marks : {
                type : Number,
                required : true
            },
            attendance : [{
                present : Number,
                total_days : Number
            }]
        }],
        practical : [{
            marks : {
                type : Number,
                required : true
            },
            attendance : [{
                present : Number,
                total_days : Number
            }]
        }]
    }]

});

var Subject = mongoose.model('SubjectDB', subjectSchema);



module.exports = Subject;