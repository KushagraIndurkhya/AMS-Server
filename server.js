const express = require('express');
const mongoose = require('mongoose');
const app = express()
//Database
const MONGOURL= mongodb+srv://sweprojectams:akj@1234@cluster0.v86ui.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(MONGOURL, {useNewUrlParser: true ,useUnifiedTopology:true})
.then(() => console.log("Connected to database"))
.catch(err => console.log(err))
//Middleware
app.use(express.urlencoded({ extended:false }))
app.use(express.json())
//Controllers
const course_Control = require('./controllers/course_controller')
//Routes
app.post('/api/course/create', course_Control.create)
app.get('/api/course/getcourses/:id',course_Control.get)
app.get('/api/course/all',course_Control.all)
app.post('/api/course/start/:id',course_Control.start_session)
app.delete('/api/course/delete/:id',course_Control.delete)
app.post('/api/course/enroll/:s_id/:c_id',course_Control.enroll)
//Start Server
app.listen(3000, ()=> console.log("Server started on 3000"))
