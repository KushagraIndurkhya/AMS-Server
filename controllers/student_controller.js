const course_model = require('../models/course_model');
const student_model = require('../models/student_model');
const mongoose = require('mongoose');
module.exports = {
    enroll:async(req, res) => {
        try {
            var c_id= mongoose.Types.ObjectId(req.params.c_id)
            var s_id= mongoose.Types.ObjectId(req.params.s_id)

          const result=await course_model.findById(c_id)
          const stud_quer=await student_model.find({"_id":s_id})
          const name_curr=stud_quer[0].name
          if(result.allowEnroll==true)
          {
            const isMarked=await course_model.find({"_id":c_id, "attendance.Id" : s_id},async (err, docs) =>{ 
              
              if (err){ 
                  console.log(err); 
              } 
              else{ 
                  if(docs.length === 0)
                  {
                  await course_model.update({"_id":c_id},
                  {$addToSet:{"attendance":{Id:s_id,
                                            name:name_curr,
                                            attendance: 0,
                                            marked:false}}})
                  res.status(200).json({ success: true,message:"enrolled" })
                  }
                  else
                  {
                    res.json({ success: false,message:"ALready enrolled" })
                  }
              } 
          }); 
          
        }
          else
          {
            res.json({ success: false,message:"enrollment closed" })
          }
        }
        catch (err) {
            res.status(501).json({success: false,message: err.message})
          }
    },



    attend:async(req, res) => {
      try {
        
          var c_id= mongoose.Types.ObjectId(req.params.c_id)
          var s_id= mongoose.Types.ObjectId(req.params.s_id)
          var code=req.params.code

          var canBeMarked=true

          const result=await course_model.findById(c_id)
          
          for(j in result.attendance)
          {
            if(result.attendance[j].Id.str == s_id.str)
            {
              if(result.attendance[j].marked)
              {
                canBeMarked=false
              }
              }
          }

          if(result.session != 0)
          {
          if (code == result.session && canBeMarked )
          {
            await course_model.findOneAndUpdate(
              {"_id":c_id, "attendance.Id" : s_id},
              {$inc : {"attendance.$.attendance" : 1},$set:{"attendance.$.marked" : true}}
              )
              res.json({ success: true })
          }
          else
          {
            res.json({ success: false, message:"Wrong code Or Already Marked" })
          }
        }
        else{
          res.json({ success: false, message:"Not accepting at the moment" })
        }
        
        }
        catch (err) {
            res.status(501).json({success: false,message: err.message})
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

    student_home: async (req,res)=> {
      try{
        var s_id= mongoose.Types.ObjectId(req.params.id)
        const all  = await course_model.find({"attendance.Id":s_id})
        result={}
        for(i in all)
        {
          console.log(all[i].attendance)
          for(j in all[i].attendance)
          {
            if(all[i].attendance[j].Id.str == s_id.str)
            {
              console.log("here")
              result[all[i].name]=all[i].attendance[j].attendance
              }
          }
          
        }
        res.status(200).json(result)
      }
      catch(err){
          res.json({ success: false, result: err})
    }
    },




}