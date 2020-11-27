const mongoose = require('mongoose');
const Schema = mongoose.Schema
const course_Schema = new Schema({
name: String,
admin_id: String,
sessioncount: Number,
session: Number,
attendance:Map
// {
//     type: Map,
//     of:Number
// }
})
module.exports = mongoose.model('course', course_Schema)