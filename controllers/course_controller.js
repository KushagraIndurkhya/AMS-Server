const course_model = require('../models/course_model');
const student_model = require('../models/student_model');
const faculty_model = require('../models/faculty_model');
const mailer=require('./../utills/mailer')
const mongoose = require('mongoose');
const { enroll } = require('./student_controller');

module.exports = {
    create: async (req, res) => {
        try{
        const enroll_code=Math.floor(100000 + Math.random() * 900000)
        let course = new course_model({
        course_id:req.body.course_id,
        name: req.body.name,
        admin_id: mongoose.Types.ObjectId(req.body.admin_id),
        sessioncount:0,
        session: 0,
        enroll:enroll_code
        })
        const admin = await faculty_model.findById(mongoose.Types.ObjectId(req.body.admin_id))
        mailer.codeMailer(admin.email,enroll_code)
        const result= await course.save()
        res.status(200).json({ success: true, result: result})
    }
    
        catch(err) {
          console.log(err)
          res.status(501).json({ success: false, message:"Something went wrong"})
            }
    },
    
    close:async(req, res) => {
      try {
        var c_id= mongoose.Types.ObjectId(req.params.c_id)
        course_model.findByIdAndUpdate(c_id,{$set:{allowEnroll:false}})
        res.status(200).json({success:true,message: "enrollment closed"})
      }
      catch (err)
      {
        console.log(err)
        res.status(501).json({ success: false, message:"Something went wrong"})
      }
},
   
    get: async (req, res) =>{
        try
        {
        const result= await course_model.find({admin_id:req.params.id})
        res.status(200).json({ success: true, result:result})
    }
          catch(err){
            console.log(err)
            res.status(501).json({ success: false, message:"Something went wrong"})
          }
        },

    start_session: async (req, res) => {
        try{
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
            var code=Math.floor(100000 + Math.random() * 900000)
            var id= mongoose.Types.ObjectId(req.params.id)
            await course_model.findByIdAndUpdate(id, {$set:{session:code,"attendance.$[].marked":false}})
            await course_model.findByIdAndUpdate(id, {$inc:{sessioncount:1}})
            console.log(code)
            res.status(200).json({ success: true, result:code})
            await sleep(50000)
            await course_model.findByIdAndUpdate(id, {$set:{session:0}})
    }
      catch(err) {
        console.log(err)
          res.status(501).json({ success: false, message:"Something went wrong"})
      }
    },


    delete: async (req,res)=> {
        try{
            var id= mongoose.Types.ObjectId(req.params.id)
            const result=await course_model.findByIdAndDelete(id)
            res.status(200).json({ success: true, result: result})
        }
          catch(err){
            console.log(err)
            res.status(501).json({ success: false, message:"Something went wrong"})
        }
        },

    course_home: async (req,res)=> {
      try{
        var c_id= mongoose.Types.ObjectId(req.params.id)
        const all  = await course_model.find({_id:c_id})
        result={}
        var name_arr=[]
        var roll_arr=[]
        var attendance_arr=[]
        for(i in all[0].attendance)
        {
          const stud=await student_model.find({_id:all[0].attendance[i].Id})
          roll_arr.push(stud[0].rollNumber)
          name_arr.push(all[0].attendance[i].name)
          var num=Number(all[0].attendance[i].attendance)/(all[0].sessioncount)
          attendance_arr.push(Number(num.toPrecision(4)))
        }
          res.status(200).json({name:name_arr,
                                roll:roll_arr,
                                attendance:attendance_arr})
      }
      catch(err){
        console.log(err)
        res.status(501).json({ success: false, message:"Something went wrong"})
    }
    },

}