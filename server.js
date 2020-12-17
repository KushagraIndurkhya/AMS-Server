const express = require('express');
const mongoose = require('mongoose');
const app = express()


//Database Connection
const config = require('./configs/db.config')
const MONGOURL= config.MONGOURL
mongoose.connect(MONGOURL, {useNewUrlParser: true ,
  useUnifiedTopology:true,
  useCreateIndex:true,
  useFindAndModify:false})
.then(() => console.log("Connected to database"))
.catch(err => console.log(err))

//Middleware
app.use(express.urlencoded({ extended:false }))
app.use(express.json())


//Controllers
const course_Control = require('./controllers/course_controller')
const student_Control = require('./controllers/student_controller')


//Routes
app.get('/', (req, res) => { res.send('Attendance Management System')})


app.post('/api/course/create', course_Control.create)
app.get('/api/course/home/:id',course_Control.course_home)
app.post('/api/course/close/:id',course_Control.close)
app.get('/api/course/getcourses/:id',course_Control.get)
app.get('/api/course/start/:id',course_Control.start_session)
app.delete('/api/course/delete/:id',course_Control.delete)


app.get('/api/student/all',student_Control.all)
app.get('/api/student/home/:id',student_Control.student_home)
app.post('/api/student/enroll/:s_id/:c_id/:code',student_Control.enroll)
app.post('/api/student/attend/:s_id/:c_id/:code',student_Control.attend)


//Start Server
app.listen(process.env.PORT || 3000, ()=> console.log("Server started on 3000"))
