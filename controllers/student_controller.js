const course_model = require('../models/course_model');
const student_model = require('../models/student_model');
const mongoose = require('mongoose');
module.exports = {
    enroll:async(req, res) => {
        try {
            var c_id= mongoose.Types.ObjectId(req.params.c_id)
            var s_id= mongoose.Types.ObjectId(req.params.s_id)
            var e_code=req.params.code

          const result=await course_model.findById(c_id)
          const stud_quer=await student_model.find({"_id":s_id})
          const name_curr=stud_quer[0].name
          if(result.enroll==e_code)
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
            res.json({ success: false,message:"Wrong Code" })
          }
        }
        catch (err) {
            res.status(501).json({success: false,message: err.message})
          }
    },



    attend:async(req, res) => {
      try {
        
          // var c_id= mongoose.Types.ObjectId(req.params.c_id)
          var c_id=req.params.c_id
          var s_id= mongoose.Types.ObjectId(req.params.s_id)
          var code=req.params.code

          var canBeMarked=true

          // const result=await course_model.findById(c_id)
          const result=await course_model.find({"course_id":c_id})
          
          for(j in result[0].attendance)
          {
            if(result[0].attendance[j].Id.str == s_id.str)
            {
              if(result[0].attendance[j].marked)
              {
                canBeMarked=false
              }
              }
          }

          if(result[0].session != 0)
          {
          if (code == result[0].session && canBeMarked )
          {
            await course_model.findOneAndUpdate(
              {"course_id":c_id, "attendance.Id" : s_id},
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
        var course_ids=[]
        var course_name=[]
        var attendance_ratio=[]
        for(i in all)
        {
          for(j in all[i].attendance)
          {
            if(all[i].attendance[j].Id.str == s_id.str)
            {
              course_ids.push(all[i].course_id)
              course_name.push(all[i].name)
              attendance_ratio.push(all[i].attendance[j].attendance/all[i].sessioncount)
              }
          }
          
        }
        res.status(200).json({Id:course_ids,
                              names:course_name,
                              attendance:attendance_ratio})
      }
      catch(err){
          res.json({ success: false, result: err})
    }
    },




}