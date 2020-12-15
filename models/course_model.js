const mongoose = require('mongoose');
const Schema = mongoose.Schema
const course_Schema = new Schema({
name: {type: String,unique:true},
admin_id: String,
sessioncount: Number,
session: Number,
allowEnroll:Boolean,
attendance:
{
    type: Array,
    of: {
        Id:{type:mongoose.Types.ObjectId,unique:true},
        name:String,
        attendance:Number,
        marked:Boolean
    }
}
})
module.exports = mongoose.model('course', course_Schema)