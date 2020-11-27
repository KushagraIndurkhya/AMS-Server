const course_model = require('../models/course_model');
const mongoose = require('mongoose');
module.exports = {
    create: async (req, res) => {
        try{
        let course = new course_model({
           name: req.body.name,
        admin_id: req.body.admin_id,
        sessioncount:0,
        session: 0,
        })
        const result= await course.save()
        res.json({ success: true, result: result})
    }
        catch(err) {
             res.json({ success: false, result: err})
            }
    },

    enroll:async(req, res) => {
        try {
            var c_id= mongoose.Types.ObjectId(req.params.c_id)
            var s_id= mongoose.Types.ObjectId(req.params.s_id)
            const result=await course_model.findByIdAndUpdate(c_id, {$set:{attendance:new Map([[s_id,0]])}})
            res.json({ success: true, result:result})
        }
        catch (err) {
            res.status(501).json({message: err.message})
          }
    },

    all: async (req, res) => {
        try {
          const all  = await course_model.find()
          res.json(all)
        } 
        catch (err) {
          res.status(500).json({message: err.message})
        }
      },


    get: async (req, res) =>{
        try{
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
            await course_model.findByIdAndUpdate(id, {$set:{session:code}})
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


}