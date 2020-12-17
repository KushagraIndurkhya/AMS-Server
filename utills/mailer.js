exports.codeMailer = function(email,code){
    var nodemailer = require('nodemailer');
    const mailConfig = require('../configs/mail.config')
      var mailer = nodemailer.createTransport
      (
        {
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        ignoreTLS: true,
        auth: {
          user: mailConfig.EMAIL,
          pass: mailConfig.EMAIL_PASSWORD,
        }
      }
      )
      var mailOptions = {
        from:mailConfig.EMAIL,
        to: email,
        subject: 'Course Enrollment code',
        text: 'Code:'+code,
      };
      mailer.sendMail(mailOptions , function(error, info){
        if (error) 
          console.log(error);
    })
  }