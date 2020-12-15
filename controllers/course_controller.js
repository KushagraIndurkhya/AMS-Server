const course_model = require('../models/course_model');
const student_model = require('../models/student_model');
const mongoose = require('mongoose');
module.exports = {
    create: async (req, res) => {
        try{
        let course = new course_model({
        name: req.body.name,
        admin_id: mongoose.Types.ObjectId(req.body.admin_id),
        sessioncount:0,
        session: 0,
        allowEnroll:true
        })
        const result= await course.save()
        res.json({ success: true, result: result})
    }
        catch(err) {
             res.json({ success: false, result: err})
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
        res.status(501).json({success: false,message: err.message})
      }
},
   
    get: async (req, res) =>{
        try
        {
        const result= await course_model.find({admin_id:req.params.id})
        res.json({ success: true, result:result})
    }
          catch(err){
              res.json({ success: false, result: err})
          }
        },

    start_session: async (req, res) => {
        try{
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
            var code=(Math.floor(Math.random()*(1000000)))
            var id= mongoose.Types.ObjectId(req.params.id)
            await course_model.findByIdAndUpdate(id, {$set:{session:code,"attendance.$[].marked":false}})
            await course_model.findByIdAndUpdate(id, {$inc:{sessioncount:1}})
            res.json({ success: true, result:code})
            await sleep(50000)
            await course_model.findByIdAndUpdate(id, {$set:{session:0}})
    }
      catch(err) {
          res.json({ success: false, result: err})
      }
    },


    delete: async (req,res)=> {
        try{
            var id= mongoose.Types.ObjectId(req.params.id)
            const result=await course_model.findByIdAndDelete(id)
            res.json({ success: true, result: result})
        }
          catch(err){
              res.json({ success: false, result: err})
        }
        },

    course_home: async (req,res)=> {
      try{
        var c_id= mongoose.Types.ObjectId(req.params.id)
        const all  = await course_model.find({_id:c_id})
        result={}

        for(i in all[0].attendance)
        {
          result[all[0].attendance[i].name]=
            Math.floor(((all[0].attendance[i].attendance)/(all[0].sessioncount))*100)
        }
          res.status(200).json(result)
      }
      catch(err){
          res.status(501).json({ success: false, result: err})
    }
    },

}